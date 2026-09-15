/**
 * Tests Gemini model rotation: callGemini / reserveModel / groundedJSON in src/lib/llm/gemini.ts and the agent loop in
 * src/lib/llm/gemini-agent.ts, against a fake Gemini API started inside this process whose answer depends on the
 * model named in the request path. No key and no mock server to start.
 *   npx tsx scripts/test-gemini-rotation.ts
 * Cooldowns and the per-minute budget are checked by shifting Date.now instead of waiting; the run takes ~25s.
 * The chains and GEMINI_RPM are read when gemini.ts is imported, so the budget checks (GEMINI_RPM=2) run in a child
 * process started with --budget; everything else runs with a roomy budget.
 */
import { spawn } from 'node:child_process';
import http from 'node:http';
import type { AddressInfo } from 'node:net';

const BUDGET = process.argv.includes('--budget');
process.env.GEMINI_API_KEY = 'test';
process.env.GEMINI_RPM = BUDGET ? '2' : '100000';
process.env.GEMINI_RESEARCH_MODELS = 'research-a,research-b';
// More fast models than the agent's 3 attempts, so a run that needs to skip several models is visible
process.env.GEMINI_FAST_MODELS = BUDGET ? 'fast-a,fast-b' : 'fast-a,fast-b,fast-c,fast-d';
process.env.GEMINI_TIMEOUT_MS = '5000';
delete process.env.GEMINI_MODEL;
delete process.env.GEMINI_FAST_MODEL;
delete process.env.TEARDOWN_AGENT_EFFORT;
delete process.env.TEARDOWN_AGENT_TIMEOUT_MS;

import type { Content } from '@google/genai';
import * as z from 'zod/v4';

import { instagram } from '../src/data/curated/instagram';
import type { AgentRequest } from '../src/lib/agent/types';

let problems = 0;
const check = (ok: unknown, what: string) => {
  if (!ok) problems++;
  console.log(`  ${ok ? '✓' : '✗'} ${what}`);
};

/* ------------------------------------------------------------------ */
/* Fake Gemini API                                                      */
/* ------------------------------------------------------------------ */

interface Body {
  contents?: Content[];
  generationConfig?: { thinkingConfig?: { thinkingLevel?: string }; responseMimeType?: string };
}
interface Answer {
  status: number;
  json: unknown;
}
type Handler = (model: string, body: Body) => Answer;

let handler: Handler = (model) => text(model, 'ok');
let log: { model: string; body: Body }[] = [];

const googleError = (code: number, status: string, message: string, details?: unknown[]): Answer => ({
  status: code,
  json: { error: { code, message, status, ...(details ? { details } : {}) } },
});
const tooMany = (retryDelay?: string) =>
  googleError(429, 'RESOURCE_EXHAUSTED', 'You exceeded your current quota, please check your plan and billing details.', [
    { '@type': 'type.googleapis.com/google.rpc.QuotaFailure', violations: [{ quotaId: 'GenerateRequestsPerMinutePerProjectPerModel-FreeTier' }] },
    ...(retryDelay ? [{ '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay }] : []),
  ]);
const dailyQuota = () =>
  googleError(429, 'RESOURCE_EXHAUSTED', 'You exceeded your current quota, please check your plan and billing details.', [
    { '@type': 'type.googleapis.com/google.rpc.QuotaFailure', violations: [{ quotaId: 'GenerateRequestsPerDayPerProjectPerModel-FreeTier' }] },
    { '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '3s' },
  ]);
const missing = (model: string) => googleError(404, 'NOT_FOUND', `models/${model} is not found for API version v1beta, or is not supported for generateContent.`);
const thinkingUnsupported = () => googleError(400, 'INVALID_ARGUMENT', 'Unable to submit request because thinking_level is not supported by this model.');
const candidateOf = (model: string, parts: unknown[]): Answer => ({
  status: 200,
  json: { candidates: [{ content: { role: 'model', parts }, finishReason: 'STOP', index: 0 }], modelVersion: model },
});
const text = (model: string, t: string) => candidateOf(model, [{ text: t }]);

/** Agent turns: open the map first, then answer once the function result comes back */
const followUp = (body: Body) => (body.contents ?? []).some((c) => (c.parts ?? []).some((p) => p.functionResponse));
const openMap = (model: string) => candidateOf(model, [{ functionCall: { id: 'call_1', name: 'open_tab', args: { tab: 'system' } }, thoughtSignature: 'bW9jaw==' }]);
const mapAnswer = (model: string) => text(model, `I opened the map (${model}).\nSUGGESTIONS: One | Two | Three`);
const agentTurn = (model: string, body: Body) => (followUp(body) ? mapAnswer(model) : openMap(model));

function startServer() {
  const server = http.createServer(async (req, res) => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    const match = /\/models\/([^/:]+):generateContent$/.exec(new URL(req.url ?? '/', 'http://localhost').pathname);
    let answer: Answer;
    if (req.method !== 'POST' || !match) {
      answer = googleError(404, 'NOT_FOUND', `no route for ${req.method} ${req.url}`);
    } else {
      const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') as Body;
      log.push({ model: match[1], body });
      answer = handler(match[1], body);
    }
    res.writeHead(answer.status, { 'content-type': 'application/json' });
    res.end(JSON.stringify(answer.json));
  });
  return new Promise<http.Server>((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

// Cooldowns and the per-minute window read Date.now: shift it instead of waiting (undici's timers don't use it)
const realNow = Date.now.bind(Date);
let offset = 0;
Date.now = () => realNow() + offset;
const HOUR = 60 * 60_000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const models = () => log.map((l) => l.model).join(',');
const thinkingOf = (i: number) => log[i]?.body.generationConfig?.thinkingConfig?.thinkingLevel;
const settle = <T>(promise: Promise<T>) => promise.then((value) => ({ value, error: undefined }), (error: unknown) => ({ value: undefined, error }));
async function timed<T>(fn: () => Promise<T>) {
  const started = performance.now();
  const result = await settle(fn());
  return { ...result, ms: Math.round(performance.now() - started) };
}
const request = (question: string): AgentRequest => ({
  teardown: instagram,
  playgroundCode: instagram.playground.html,
  tab: 'play',
  messages: [{ role: 'user', text: question }],
});

async function main() {
  const server = await startServer();
  process.env.GEMINI_BASE_URL = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  // Imported after the env is set so the chains, budget and client pick up the fake API
  const gemini = await import('../src/lib/llm/gemini');
  const { runGeminiAgent } = await import('../src/lib/llm/gemini-agent');
  const { GeminiError } = gemini;

  const scenario = (title: string, next: Handler) => {
    console.log(`\n${title}`);
    gemini.resetModelState();
    offset = 0;
    log = [];
    handler = next;
  };
  const ask = (task?: 'research' | 'fast') => gemini.callGemini({ systemInstruction: 'Answer briefly.' }, 'hello', task ? { task } : {});
  const isGeminiError = (e: unknown, code: string, reason?: string): e is InstanceType<typeof GeminiError> =>
    e instanceof GeminiError && e.code === code && (reason === undefined || e.reason === reason);
  const describe = (e: unknown) => (e instanceof GeminiError ? `${e.status} ${e.code}${e.reason ? `/${e.reason}` : ''}` : e instanceof Error ? e.message : 'ok');
  /** Which model reserveModel picks `ms` from now (Date.now is only shifted while the pick is made) */
  const pickAt = (ms: number, task: 'research' | 'fast' = 'research') => {
    offset = ms;
    try {
      return gemini.reserveModel(task);
    } finally {
      offset = 0;
    }
  };
  /** Settles within `ms`, or 'queued' while it is still waiting for a model */
  const within = (promise: Promise<unknown>, ms: number) => Promise.race([settle(promise), sleep(ms).then(() => 'queued' as const)]);

  if (BUDGET) {
    /* ---------------------------------------------------------- per-model budget */
    scenario('GEMINI_RPM=2: rapid calls fill the first model, then the next', (model) => text(model, `from ${model}`));
    const answers = [];
    for (let i = 0; i < 4; i++) answers.push((await ask()).modelVersion);
    check(models() === 'research-a,research-a,research-b,research-b', `calls 1-2 → research-a, calls 3-4 → research-b (${models()})`);
    check(answers.join() === models(), `each response reports the model that answered (${answers.join()})`);
    log = [];
    const fifth = await timed(() => ask());
    check(
      isGeminiError(fifth.error, 'rate_limited') && fifth.ms < 1000 && log.length === 0,
      `5th call: both models used their minute (~60s to wait, over the 25s queue limit) → rate_limited at once, no request (${describe(fifth.error)}, ${fifth.ms}ms)`,
    );
    offset = 32_000;
    const tooLong = await within(gemini.reserveModel('research'), 300);
    offset = 38_000;
    const shortEnough = await within(gemini.reserveModel('research'), 300);
    offset = 0;
    check(tooLong !== 'queued' && isGeminiError(tooLong.error, 'rate_limited'), '~28s until a model has room: rate_limited without queuing');
    check(shortEnough === 'queued', '~22s until a model has room: the call queues instead of failing');
    offset = 57_000;
    const waited = await timed(() => ask());
    offset = 0;
    check(
      waited.value?.modelVersion === 'research-a' && models() === 'research-a' && waited.ms >= 1000 && waited.ms < 5000,
      `~3s until research-a's oldest call leaves the minute: waits, then research-a answers (${waited.value?.modelVersion ?? describe(waited.error)} after ${waited.ms}ms)`,
    );

    scenario('Agent reservation (3 calls) with GEMINI_RPM=2: a rate-limited model is still skipped', (model, body) =>
      model === 'fast-a' ? tooMany() : agentTurn(model, body),
    );
    const small = await timed(() => runGeminiAgent(request('show me the map')));
    check(
      small.value?.text.includes('(fast-b)') && models().startsWith('fast-a,fast-b'),
      `429 on fast-a → the run moves to fast-b even though 3 calls don't fit a 2/minute budget (${models()}; ${describe(small.error)})`,
    );

    console.log(problems ? `\n✗ ${problems} budget problem(s)` : '\n✓ budget checks pass');
    process.exit(problems ? 1 : 0);
  }

  /* ---------------------------------------------------------- callGemini: 429 */
  check(
    gemini.MODEL_CHAINS.research.join() === 'research-a,research-b' && gemini.MODEL_CHAINS.fast.join() === 'fast-a,fast-b,fast-c,fast-d',
    'GEMINI_RESEARCH_MODELS / GEMINI_FAST_MODELS set the chains',
  );

  scenario('429 on the first model: the next model answers', (model) => (model === 'research-a' ? tooMany() : text(model, `answer from ${model}`)));
  const rotated = await timed(() => ask());
  check(rotated.value?.text === 'answer from research-b' && rotated.value.modelVersion === 'research-b', `research-b answers and the response reports it (${rotated.value?.modelVersion ?? describe(rotated.error)})`);
  check(models() === 'research-a,research-b' && rotated.ms < 1000, `research-a once, then research-b right away (${models()}, ${rotated.ms}ms)`);
  log = [];
  await ask();
  check(models() === 'research-b', `while research-a cools down, the next call goes straight to research-b (${models()})`);

  scenario('groundedJSON rotates within its task chain and reports the model that answered', (model) =>
    model === 'fast-a' ? tooMany() : text(model, JSON.stringify({ ok: true, from: model })),
  );
  const schema = z.object({ ok: z.boolean(), from: z.string() });
  const picked = await settle(gemini.groundedJSON({ system: 'Answer in JSON.', prompt: 'roadmap picks', schema, search: false, task: 'fast' }));
  check(picked.value?.model === 'fast-b' && picked.value.data.from === 'fast-b' && models() === 'fast-a,fast-b', `task "fast": fast-a (429) → fast-b, result.model fast-b (${models()}; ${picked.value?.model ?? describe(picked.error)})`);
  log = [];
  const deep = await settle(gemini.groundedJSON({ system: 'Answer in JSON.', prompt: 'teardown', schema, search: false }));
  check(deep.value?.model === 'research-a' && models() === 'research-a', `no task: the research chain (${models()}; ${deep.value?.model ?? describe(deep.error)})`);

  /* ---------------------------------------------------------- cooldown lengths */
  const cooldown = async (title: string, reply: () => Answer, before: number, after: number) => {
    scenario(title, (model) => (model === 'research-a' ? reply() : text(model, 'ok')));
    await ask();
    const [early, late] = [await pickAt(before), await pickAt(after)];
    check(models() === 'research-a,research-b' && early === 'research-b' && late === 'research-a', `research-b at +${before / 1000}s, research-a again at +${after / 1000}s (${early}, ${late})`);
  };
  await cooldown('429 without a retry hint: research-a cools down for 60s', () => tooMany(), 59_000, 61_000);
  await cooldown('429 asking to retry in 20s: cools down for the hinted 20s', () => tooMany('20s'), 19_000, 21_000);
  await cooldown('429 asking to retry in 2s: cools down for at least 10s', () => tooMany('2s'), 9_000, 11_000);
  {
    // Measured before the scenario's call; the cooldown starts a few ms later, well inside the 5s margins
    const midnight = gemini.msUntilPacificMidnight();
    await cooldown('429 naming a PerDay quota: cools down until midnight Pacific (when daily quotas reset)', () => dailyQuota(), midnight - 5000, midnight + 5000);
  }

  scenario('Every model rate limited: fail at once, or queue when a model frees up soon', () => tooMany());
  const busy = await timed(() => ask());
  check(
    isGeminiError(busy.error, 'rate_limited') && busy.error.status === 429 && models() === 'research-a,research-b' && busy.ms < 1000,
    `each model tried once, then rate_limited without waiting out a 60s cooldown (${models()}, ${describe(busy.error)}, ${busy.ms}ms)`,
  );
  const soon = await timed(() => pickAt(57_000));
  check(soon.value === 'research-a' && soon.ms >= 2000 && soon.ms < 5000, `3s before research-a's cooldown ends, the call waits for it (${soon.value ?? describe(soon.error)} after ${soon.ms}ms)`);

  scenario('Daily quota used up on every model', () => dailyQuota());
  const daily = await settle(ask());
  check(models() === 'research-a,research-b', `each model (own daily quota) tried once (${models()})`);
  check(isGeminiError(daily.error, 'rate_limited', 'daily_quota'), `error keeps reason daily_quota, so students hear it resets at midnight Pacific (${describe(daily.error)})`);

  /* ---------------------------------------------------------- 404, thinking, other failures */
  scenario('404 on the first model: skipped, and stays skipped', (model) => (model === 'research-a' ? missing(model) : text(model, `answer from ${model}`)));
  const found = await settle(ask());
  check(found.value?.modelVersion === 'research-b' && models() === 'research-a,research-b', `research-a (404) → research-b answers (${models()})`);
  log = [];
  await ask();
  const hoursLater = await pickAt(3 * HOUR);
  check(models() === 'research-b' && hoursLater === 'research-b', `never tried again, not even hours later (${models()}; +3h → ${hoursLater})`);

  scenario('404 on every model', (model) => missing(model));
  const none = await settle(ask());
  check(isGeminiError(none.error, 'error', 'model_not_found') && models() === 'research-a,research-b', `each model tried once, then model_not_found (${models()}, ${describe(none.error)})`);
  log = [];
  const noneAgain = await settle(ask());
  check(isGeminiError(noneAgain.error, 'error', 'model_not_found') && log.length === 0, 'the next call fails at once without calling Gemini');

  scenario('400 about thinking: retried without thinkingConfig, remembered for that model', (model, body) =>
    body.generationConfig?.thinkingConfig ? thinkingUnsupported() : text(model, `no thinking on ${model}`),
  );
  const thought = await settle(ask());
  check(thought.value?.text === 'no thinking on research-a' && models() === 'research-a,research-a', `same model retried and answers (${models()}; ${describe(thought.error)})`);
  check(thinkingOf(0) === 'LOW' && log[1] && !log[1].body.generationConfig?.thinkingConfig, `first request has the default thinkingLevel LOW, the retry none (${thinkingOf(0)}, ${thinkingOf(1)})`);
  log = [];
  await ask();
  check(log.length === 1 && !log[0].body.generationConfig?.thinkingConfig, 'the next call to that model leaves thinkingConfig out from the start');

  scenario('Other 400s: not retried, not rotated', () => googleError(400, 'INVALID_ARGUMENT', 'Request contains an invalid argument.'));
  const invalid = await settle(ask());
  check(isGeminiError(invalid.error, 'error') && invalid.error.status === 400 && models() === 'research-a', `one request, 400 error (${models()}, ${describe(invalid.error)})`);

  let overloaded = false;
  scenario('503 (model overloaded): the next model answers right away, the busy one is skipped for 20s', (model) => {
    if (overloaded) return text(model, `recovered on ${model}`);
    overloaded = true;
    return googleError(503, 'UNAVAILABLE', 'This model is currently experiencing high demand. Please try again later.');
  });
  const flaky = await timed(() => ask());
  check(flaky.value?.text === 'recovered on research-b' && models() === 'research-a,research-b' && flaky.ms < 1000, `research-a (503) → research-b without a backoff (${models()}, ${flaky.ms}ms)`);
  log = [];
  await ask();
  const [overloadedEarly, overloadedLate] = [await pickAt(19_000), await pickAt(21_000)];
  check(models() === 'research-b' && overloadedEarly === 'research-b' && overloadedLate === 'research-a', `next call on research-b; research-a back after 20s (${models()}; +19s ${overloadedEarly}, +21s ${overloadedLate})`);

  /* ---------------------------------------------------------- agent */
  scenario('Agent: a 429 before the first answer moves the run to the next fast model', (model, body) => (model === 'fast-a' ? tooMany() : agentTurn(model, body)));
  const moved = await settle(runGeminiAgent(request('show me the map')));
  check(
    moved.value?.text.includes('(fast-b)') && JSON.stringify(moved.value.actions) === '[{"type":"open_tab","tab":"system"}]',
    `answered by fast-b with its action (${moved.value?.text.split('\n')[0] ?? describe(moved.error)})`,
  );
  check(models() === 'fast-a,fast-b,fast-b', `fast-a once, then the whole run on fast-b (${models()})`);
  log = [];
  await settle(runGeminiAgent(request('show me the map')));
  check(models() === 'fast-b,fast-b', `the next run starts on fast-b while fast-a cools down (${models()})`);

  scenario('Agent: a 404 model is skipped for this and later runs', (model, body) => (model === 'fast-a' ? missing(model) : agentTurn(model, body)));
  const skipped = await settle(runGeminiAgent(request('show me the map')));
  check(skipped.value?.text.includes('(fast-b)') && models() === 'fast-a,fast-b,fast-b', `fast-a (404) → fast-b (${models()}; ${describe(skipped.error)})`);
  log = [];
  await settle(runGeminiAgent(request('show me the map')));
  check(models() === 'fast-b,fast-b', `next run never tries fast-a (${models()})`);

  scenario('Agent: after the first answer, a 429 fails the run with rate_limited (thought signatures bind the model)', (model, body) =>
    followUp(body) ? tooMany('30s') : openMap(model),
  );
  const bound = await timed(() => runGeminiAgent(request('show me the map')));
  check(isGeminiError(bound.error, 'rate_limited') && bound.ms < 3000, `rate_limited without waiting 30s (${describe(bound.error)}, ${bound.ms}ms)`);
  check(models() === 'fast-a,fast-a', `both requests on fast-a, no other model tried (${models()})`);

  scenario('Agent: after the first answer, short 429s never switch the model', (model, body) => (followUp(body) ? tooMany() : openMap(model)));
  const retried = await timed(() => runGeminiAgent(request('show me the map')));
  check(isGeminiError(retried.error, 'rate_limited') && log.length >= 2 && log.every((l) => l.model === 'fast-a'), `every request on fast-a, then rate_limited (${models()}, ${retried.ms}ms)`);

  scenario('Agent: every fast model rate limited before the first answer', () => tooMany());
  const allBusy = await timed(() => runGeminiAgent(request('show me the map')));
  const tried = log.map((l) => l.model);
  check(isGeminiError(allBusy.error, 'rate_limited') && allBusy.ms < 3000, `rate_limited, no waiting for cooldowns (${describe(allBusy.error)}, ${allBusy.ms}ms)`);
  check(tried.length >= 2 && tried.join() === gemini.MODEL_CHAINS.fast.slice(0, tried.length).join(), `models tried in chain order, none twice (${tried.join()})`);

  scenario('Agent: skips as many missing models as it takes (more than its 3 attempts)', (model, body) => (model === 'fast-d' ? agentTurn(model, body) : missing(model)));
  const far = await settle(runGeminiAgent(request('show me the map')));
  check(far.value?.text.includes('(fast-d)') && models() === 'fast-a,fast-b,fast-c,fast-d,fast-d', `fast-a, b, c (404) → fast-d answers (${models()}; ${describe(far.error)})`);

  scenario('Agent: a model that rejects thinking settings is called without them for the rest of the run, and in later runs', (model, body) =>
    body.generationConfig?.thinkingConfig ? thinkingUnsupported() : agentTurn(model, body),
  );
  const plain = await settle(runGeminiAgent(request('show me the map')));
  check(thinkingOf(0) && log[1] && !thinkingOf(1) && log[1].model === 'fast-a', `first request sends thinking, the retry on fast-a drops it (${log.slice(0, 2).map((l, i) => `${l.model}:${thinkingOf(i) ?? 'none'}`).join(', ')})`);
  check(plain.value?.text.includes('(fast-a)'), `the two-turn run finishes (${describe(plain.error)}; requests ${log.map((_, i) => thinkingOf(i) ?? 'none').join(', ')})`);
  log = [];
  const nextRun = await settle(runGeminiAgent(request('show me the map again')));
  check(nextRun.value?.text.includes('(fast-a)') && log.every((_, i) => !thinkingOf(i)), `a later run on fast-a sends no thinking settings (${describe(nextRun.error)}; requests ${log.map((_, i) => thinkingOf(i) ?? 'none').join(', ')})`);

  /* ---------------------------------------------------------- budget phase */
  console.log(problems ? `\n✗ ${problems} rotation problem(s)` : '\n✓ rotation checks pass');
  console.log('\n(budget checks with GEMINI_RPM=2, in a child process)');
  const child = spawn(process.execPath, [...process.execArgv, process.argv[1], '--budget'], { stdio: 'inherit', env: process.env });
  const code = await new Promise<number>((resolve) => child.on('exit', (c) => resolve(c ?? 1)));
  server.close();
  process.exit(problems || code ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
