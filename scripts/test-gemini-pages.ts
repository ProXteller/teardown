/**
 * Tests the free-tier default mode (GEMINI_GOOGLE_SEARCH unset): Gemini reads pages found for the request with its URL
 * Context tool instead of searching. Covers /api/teardown (src/lib/llm/research.ts), the chat agent
 * (src/lib/llm/gemini-agent.ts), /api/roadmap, rotation on an overloaded model and the daily-quota message, against a
 * fake Gemini API started inside this process. Page discovery is stubbed with setDiscoveryForTests: no key, no network.
 *   npx tsx scripts/test-gemini-pages.ts
 * The Google Search mode is covered by scripts/test-gemini-teardown.ts, test-gemini-agent.ts and test-live-roadmap.ts.
 */
import http from 'node:http';
import type { AddressInfo } from 'node:net';

process.env.GEMINI_API_KEY = 'test';
// Rapid scenarios shouldn't be throttled by the free-tier per-model budget (5/minute)
process.env.GEMINI_RPM = '100000';
process.env.GEMINI_TIMEOUT_MS = '5000';
for (const name of [
  'GEMINI_GOOGLE_SEARCH',
  'TEARDOWN_DISCOVERY',
  'GEMINI_MODEL',
  'GEMINI_FAST_MODEL',
  'GEMINI_RESEARCH_MODELS',
  'GEMINI_FAST_MODELS',
  'AI_PROVIDER',
  'ANTHROPIC_API_KEY',
  'TEARDOWN_AGENT_EFFORT',
  'TEARDOWN_AGENT_TIMEOUT_MS',
]) {
  delete process.env[name];
}

import type { Content } from '@google/genai';

import { instagram } from '../src/data/curated/instagram';
import { spotify } from '../src/data/curated/spotify';
import { StoryPart, type StoryPartT } from '../src/data/schema';
import type { AgentRequest } from '../src/lib/agent/types';
import type { ScanResult } from '../src/lib/fingerprints';
import type { Evidence } from '../src/lib/research/discover';

let problems = 0;
const check = (ok: unknown, what: string) => {
  if (!ok) problems++;
  console.log(`  ${ok ? '✓' : '✗'} ${what}`);
};

/* ------------------------------------------------------------------ */
/* Fixtures                                                             */
/* ------------------------------------------------------------------ */

const SITE = 'https://linear.app/';
const ABOUT = 'https://linear.app/about';
const WIKI = 'https://en.wikipedia.org/wiki/Linear_(software)';
const GITHUB = 'https://github.com/linear';
const ARTICLE = 'https://news.ycombinator.com/item?id=41000000';
const BLOG = 'https://linear.app/blog/scaling-the-sync-engine';
const CAREERS = 'https://linear.app/careers';

const EVIDENCE: Record<string, Evidence> = {
  'Linear|linear.app': {
    urls: [
      { url: SITE, kind: 'site', title: 'Linear – Plan and build products' },
      { url: WIKI, kind: 'wikipedia', title: 'Linear (Wikipedia)' },
      { url: GITHUB, kind: 'github', title: 'GitHub organization' },
      { url: ARTICLE, kind: 'article', title: 'How Linear built its sync engine' },
      { url: BLOG, kind: 'blog', title: 'Scaling the sync engine' },
      { url: CAREERS, kind: 'careers' },
      { url: ABOUT, kind: 'site' },
    ],
    notes: ['Wikipedia summary of "Linear (software)": Linear is a project management tool founded in 2019.', 'GitHub organization "linear": top languages TypeScript, Go.'],
    elapsedMs: 12,
  },
  'Instagram|instagram.com': {
    urls: [
      { url: 'https://about.instagram.com/about-us', kind: 'site', title: 'About Instagram' },
      // Also one of the teardown's own sources: listed once
      { url: 'https://en.wikipedia.org/wiki/Instagram', kind: 'wikipedia', title: 'Instagram (Wikipedia)' },
    ],
    notes: ['Wikipedia summary of "Instagram": a photo and video sharing service owned by Meta.'],
    elapsedMs: 8,
  },
};
const NO_EVIDENCE: Evidence = { urls: [], notes: [], elapsedMs: 0 };

const SUCCESS = 'URL_RETRIEVAL_STATUS_SUCCESS';
/** What the story's URL Context reads report: three pages read, the rest failed; Wikipedia was never opened */
const STORY_READ = [
  { retrievedUrl: SITE, urlRetrievalStatus: SUCCESS },
  { retrievedUrl: ARTICLE, urlRetrievalStatus: SUCCESS },
  { retrievedUrl: GITHUB, urlRetrievalStatus: 'URL_RETRIEVAL_STATUS_ERROR' },
  { retrievedUrl: BLOG, urlRetrievalStatus: 'URL_RETRIEVAL_STATUS_ERROR' },
  { retrievedUrl: CAREERS, urlRetrievalStatus: 'URL_RETRIEVAL_STATUS_UNSAFE' },
  { retrievedUrl: ABOUT, urlRetrievalStatus: SUCCESS },
];
const AGENT_READ = [
  { retrievedUrl: 'https://en.wikipedia.org/wiki/Instagram', urlRetrievalStatus: SUCCESS },
  { retrievedUrl: 'https://engineering.fb.com', urlRetrievalStatus: 'URL_RETRIEVAL_STATUS_ERROR' },
  { retrievedUrl: 'https://about.instagram.com/about-us', urlRetrievalStatus: SUCCESS },
];

/** A schema-valid story. No model-cited sources, so no link checks (network) are needed. */
const STORY: StoryPartT = {
  name: spotify.name,
  url: spotify.url,
  tagline: spotify.tagline,
  category: spotify.category,
  brandColor: spotify.brandColor,
  accentColor: spotify.accentColor,
  logoGlyph: spotify.logoGlyph,
  eli5: spotify.eli5,
  facts: spotify.facts,
  history: spotify.history,
  languages: spotify.languages,
  stack: spotify.stack,
  concepts: spotify.concepts,
  buildYourOwn: spotify.buildYourOwn,
  sources: [],
};

/* ------------------------------------------------------------------ */
/* Fake Gemini API                                                      */
/* ------------------------------------------------------------------ */

interface Body {
  contents?: Content[];
  systemInstruction?: Content;
  tools?: Record<string, unknown>[];
  toolConfig?: { includeServerSideToolInvocations?: boolean };
  generationConfig?: { responseMimeType?: string; responseJsonSchema?: { properties?: Record<string, unknown> } };
}
interface Answer {
  status: number;
  json: unknown;
}
type Handler = (model: string, body: Body) => Answer;

const textOf = (c: Content | undefined) => (c?.parts ?? []).map((p) => p.text ?? '').join('\n');
const promptOf = (body: Body | undefined) => (body?.contents ?? []).map(textOf).join('\n');
const systemOf = (body: Body | undefined) => textOf(body?.systemInstruction);
const toolKinds = (body: Body | undefined) => (body?.tools ?? []).map((t) => Object.keys(t).join('+')).join(',');
const fenced = (text: string, tag: string) => new RegExp(`<${tag}>\\n([\\s\\S]*?)\\n</${tag}>`).exec(text)?.[1].split('\n').map((l) => l.replace(/^- /, '')) ?? [];

const candidateOf = (model: string, text: string, urlMetadata?: unknown[]): Answer => ({
  status: 200,
  json: {
    candidates: [{ content: { role: 'model', parts: [{ text }] }, finishReason: 'STOP', index: 0, ...(urlMetadata ? { urlContextMetadata: { urlMetadata } } : {}) }],
    modelVersion: model,
  },
});
const googleError = (code: number, status: string, message: string, details?: unknown[]): Answer => ({
  status: code,
  json: { error: { code, message, status, ...(details ? { details } : {}) } },
});

/** Agent requests get a text answer, roadmap requests no picks, teardown requests the story; URL reads only when the tool was given */
const answer: Handler = (model, body) => {
  const tools = body.tools ?? [];
  const reads = tools.some((t) => 'urlContext' in t);
  if (tools.some((t) => 'functionDeclarations' in t)) {
    return candidateOf(model, 'Instagram joined Facebook in 2012.\nSUGGESTIONS: What is sharding? | Show the feed | Trace a like', reads ? AGENT_READ : undefined);
  }
  if ('steps' in (body.generationConfig?.responseJsonSchema?.properties ?? {})) return candidateOf(model, JSON.stringify({ steps: [] }));
  return candidateOf(model, JSON.stringify(STORY), reads ? STORY_READ : undefined);
};

let handler: Handler = answer;
let log: { model: string; body: Body }[] = [];

function startServer() {
  const server = http.createServer(async (req, res) => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    const match = /\/models\/([^/:]+):generateContent$/.exec(new URL(req.url ?? '/', 'http://localhost').pathname);
    let reply: Answer;
    if (req.method !== 'POST' || !match) {
      reply = googleError(404, 'NOT_FOUND', `no route for ${req.method} ${req.url}`);
    } else {
      const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') as Body;
      log.push({ model: match[1], body });
      reply = handler(match[1], body);
    }
    res.writeHead(reply.status, { 'content-type': 'application/json' });
    res.end(JSON.stringify(reply.json));
  });
  return new Promise<http.Server>((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

// The daily-quota cooldown runs until midnight Pacific: pin the clock to midday so the check doesn't depend on when it runs
const realNow = Date.now.bind(Date);
let offset = 0;
Date.now = () => realNow() + offset;
const HOUR = 60 * 60_000;

const settle = <T>(promise: Promise<T>) => promise.then((value) => ({ value, error: undefined }), (error: unknown) => ({ value: undefined, error }));

async function main() {
  const server = await startServer();
  process.env.GEMINI_BASE_URL = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  // Imported after the env is set so the model chains and client pick up the fake API
  const teardownApi = await import('../src/app/api/teardown+api');
  const roadmapApi = await import('../src/app/api/roadmap+api');
  const { productOf, setDiscoveryForTests } = await import('../src/lib/llm/research');
  const gemini = await import('../src/lib/llm/gemini');
  const { runGeminiAgent } = await import('../src/lib/llm/gemini-agent');

  const discovered: string[] = [];
  setDiscoveryForTests(async ({ name, domain }) => {
    const key = `${name}|${domain ?? ''}`;
    discovered.push(key);
    return EVIDENCE[key] ?? NO_EVIDENCE;
  });

  const scenario = (title: string, next: Handler = answer) => {
    console.log(`\n${title}`);
    gemini.resetModelState();
    log = [];
    handler = next;
  };
  const teardown = async (query: string, part = 'story') => {
    const started = realNow();
    const res = await teardownApi.POST(new Request('http://localhost/api/teardown', { method: 'POST', body: JSON.stringify({ query, part, scan: null }) }));
    const json = (await res.json()) as { data?: StoryPartT; sources?: { title: string; url: string }[]; queries?: string[]; model?: string; provider?: string; error?: string; code?: string };
    return { status: res.status, json, took: realNow() - started };
  };
  const models = () => log.map((l) => l.model).join(',');

  check(!gemini.googleSearchOn(), 'GEMINI_GOOGLE_SEARCH unset → Google Search off (the free-tier default)');

  /* ---------------------------------------------------------- teardown */
  scenario('Teardown story: Gemini reads the discovered pages with URL Context');
  const story = await teardown('linear.app');
  const sent = log[0]?.body;
  const prompt = promptOf(sent);
  check(story.status === 200 && story.json.provider === 'gemini' && StoryPart.safeParse(story.json.data).success, `200 with a valid story (${story.status}${story.json.error ? `: ${story.json.error}` : ''})`);
  check(discovered.join() === 'Linear|linear.app', `discovery asked for name "Linear", domain "linear.app" (${discovered.join()})`);
  check(log.length === 1, `one Gemini call (${log.length})`);
  check(toolKinds(sent) === 'urlContext', `tools: urlContext only, no googleSearch (${toolKinds(sent)})`);
  check(sent?.generationConfig?.responseMimeType === 'application/json', 'JSON output combined with URL Context');
  check(fenced(prompt, 'pages').join() === EVIDENCE['Linear|linear.app'].urls.map((u) => u.url).join(), `<pages> lists every discovered URL in order (${fenced(prompt, 'pages').length})`);
  check(
    EVIDENCE['Linear|linear.app'].notes.every((n) => fenced(prompt, 'evidence_notes').includes(n)),
    'evidence notes fenced in <evidence_notes>',
  );
  const system = systemOf(sent);
  check(/URL tool/.test(system) && !/Google Search/i.test(system), 'system instruction: read with the URL tool, no mention of Google Search');
  const expected = [
    { title: 'Linear – Plan and build products', url: SITE },
    { title: 'How Linear built its sync engine', url: ARTICLE },
    { title: 'Official site: linear.app', url: ABOUT },
    { title: 'Linear (Wikipedia)', url: WIKI },
    { title: 'GitHub organization', url: GITHUB },
  ];
  check(JSON.stringify(story.json.sources) === JSON.stringify(expected), `sources: pages read (titled from the evidence), then the Wikipedia/GitHub evidence (${JSON.stringify(story.json.sources?.map((s) => s.title))})`);
  check(!story.json.sources?.some((s) => s.url === BLOG || s.url === CAREERS), 'pages that failed to load (ERROR) or were refused (UNSAFE) are not sources');
  check(
    JSON.stringify(story.json.data?.sources) === JSON.stringify(expected.map((s) => ({ label: s.title, url: s.url }))) && (story.json.queries ?? []).length === 0,
    'data.sources matches the top-level sources; no search queries',
  );

  console.log('\nproductOf');
  const scanOf = (fields: Partial<ScanResult>) => ({ ok: true, url: '', status: 200, detections: [], headers: [], ...fields }) as ScanResult;
  const products: [string, ScanResult | null, { name: string; domain: string | null }][] = [
    ['linear.app', null, { name: 'Linear', domain: 'linear.app' }],
    ['https://www.notion.so/product', null, { name: 'Notion', domain: 'notion.so' }],
    ['m.facebook.com', null, { name: 'Facebook', domain: 'm.facebook.com' }],
    ['Spotify', null, { name: 'Spotify', domain: null }],
    ['linear.app', scanOf({ url: 'https://linear.app', finalUrl: 'https://linear.app/', title: 'Linear – Plan and build products' }), { name: 'Linear', domain: 'linear.app' }],
    ['spotify.com', scanOf({ url: 'https://spotify.com', finalUrl: 'https://open.spotify.com/', siteName: 'Spotify', title: 'Spotify - Web Player' }), { name: 'Spotify', domain: 'open.spotify.com' }],
  ];
  for (const [query, scan, want] of products) {
    const got = productOf(query, scan);
    check(JSON.stringify(got) === JSON.stringify(want), `productOf(${JSON.stringify(query)}${scan ? ', scan' : ''}) → ${JSON.stringify(got)}`);
  }

  scenario('Teardown with nothing discovered: no tools at all');
  const bare = await teardown('Obscure Notes App');
  const bareBody = log[0]?.body;
  check(bare.status === 200 && discovered.at(-1) === 'Obscure Notes App|', `200, discovery asked for the name only (${bare.status}, ${discovered.at(-1)})`);
  check(log.length === 1 && bareBody?.tools === undefined, `no tools sent (${toolKinds(bareBody) || 'none'})`);
  check(!/<pages>|<evidence_notes>/.test(promptOf(bareBody)), 'no <pages> or <evidence_notes> in the prompt');
  check((bare.json.sources ?? []).length === 0, 'no sources');
  check(
    (bare.json.data?.stack ?? []).flatMap((l) => l.items).every((i) => i.confidence === 'likely'),
    'no pages read and no scan: every stack item is "likely" (the fixture said "confirmed")',
  );

  /* ---------------------------------------------------------- agent */
  const ask = (teardownData: AgentRequest['teardown'], text: string): AgentRequest => ({
    teardown: teardownData,
    playgroundCode: teardownData.playground.html,
    tab: 'play',
    messages: [{ role: 'user', text }],
  });

  scenario('Agent: URL Context over the teardown sources and discovered pages');
  const reply = await settle(runGeminiAgent(ask(instagram, 'Who owns Instagram today?')));
  const first = log[0]?.body;
  check(reply.value?.text.startsWith('Instagram joined Facebook in 2012.'), `answered (${reply.value?.text.split('\n')[0] ?? String(reply.error)})`);
  check(discovered.at(-1) === 'Instagram|instagram.com', `discovery asked for "Instagram", "instagram.com" (${discovered.at(-1)})`);
  check(toolKinds(first) === 'functionDeclarations,urlContext', `tools: functions + urlContext, no googleSearch (${toolKinds(first)})`);
  check(first?.toolConfig?.includeServerSideToolInvocations === true, 'includeServerSideToolInvocations set with the web tool');
  const listed = fenced(textOf(first?.contents?.[0]), 'web_pages');
  check(
    instagram.sources.every((s) => listed.includes(s.url)) && listed.includes('https://about.instagram.com/about-us') && listed.length === instagram.sources.length + 1,
    `<web_pages> in the first user turn: the teardown's ${instagram.sources.length} sources plus the discovered page, Wikipedia once (${listed.length})`,
  );
  const agentSystem = systemOf(first);
  check(/<web_pages> with your URL tool/.test(agentSystem) && !/Google Search/i.test(agentSystem), 'system prompt: read <web_pages> with the URL tool, no Google Search');
  check(
    JSON.stringify(reply.value?.sources) ===
      JSON.stringify([
        { title: 'Wikipedia: Instagram', url: 'https://en.wikipedia.org/wiki/Instagram' },
        { title: 'About Instagram', url: 'https://about.instagram.com/about-us' },
      ]),
    `reply.sources: the pages read successfully (from urlContextMetadata), with their titles (${JSON.stringify(reply.value?.sources)})`,
  );

  scenario('Agent: no teardown sources and nothing discovered → functions only');
  const empty = { ...structuredClone(instagram), name: 'Nowhere Notes', url: 'nowhere-notes.example', sources: [] };
  const plain = await settle(runGeminiAgent(ask(empty, 'What does it use?')));
  const plainBody = log[0]?.body;
  check(plain.value?.text.startsWith('Instagram joined') && discovered.at(-1) === 'Nowhere Notes|nowhere-notes.example', `answered (${plain.value ? 'ok' : String(plain.error)}, discovery ${discovered.at(-1)})`);
  check(toolKinds(plainBody) === 'functionDeclarations' && !plainBody?.toolConfig?.includeServerSideToolInvocations, `tools: functions only (${toolKinds(plainBody)})`);
  check(!/<web_pages>/.test(promptOf(plainBody)) && !/URL tool/.test(systemOf(plainBody)), 'no <web_pages>, teardown-only system prompt');
  check(plain.value?.sources === undefined, 'no sources');

  /* ---------------------------------------------------------- roadmap */
  scenario('Roadmap picks: no tools in pages mode');
  const picks = await roadmapApi.POST(
    new Request('http://localhost/api/roadmap', {
      method: 'POST',
      body: JSON.stringify({
        appName: 'Instagram',
        appUrl: 'instagram.com',
        stackNames: ['Python', 'Django'],
        track: 'cybersecurity',
        steps: [{ id: 'f-web-basics', title: 'Learn how the web works', topics: ['javascript'] }],
      }),
    }),
  );
  const picksJson = (await picks.json()) as { verified?: number; error?: string };
  const roadmapBody = log[0]?.body;
  check(picks.status === 200 && picksJson.verified === 0, `200 (${picks.status}${picksJson.error ? `: ${picksJson.error}` : ''})`);
  check(log.length === 1 && roadmapBody?.tools === undefined && roadmapBody?.generationConfig?.responseMimeType === 'application/json', `one JSON call with no tools (${toolKinds(roadmapBody) || 'none'})`);
  check(!/Google Search/i.test(systemOf(roadmapBody)) && /certain exist/.test(systemOf(roadmapBody)), 'system text: no Google Search, only resources it is certain exist');
  check(log[0]?.model === gemini.MODEL_CHAINS.fast[0], `fast model chain (${log[0]?.model})`);

  /* ---------------------------------------------------------- rotation */
  const research = gemini.MODEL_CHAINS.research;
  scenario('503 "high demand" on the first research model → the second model answers', (model, body) =>
    model === research[0] ? googleError(503, 'UNAVAILABLE', 'This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.') : answer(model, body),
  );
  const busy = await teardown('busy.example');
  check(busy.status === 200 && busy.json.model === research[1] && busy.took < 2000, `200 from ${busy.json.model} without a backoff (${busy.status}, ${busy.took}ms)`);
  check(models() === research.slice(0, 2).join(), `${research[0]} once, then ${research[1]} (${models()})`);
  log = [];
  const next = await teardown('busy-again.example');
  check(next.status === 200 && models() === research[1], `the next request goes straight to ${research[1]}: ${research[0]} isn't retried right away (${models()})`);

  /* ---------------------------------------------------------- daily quota */
  const perDay = () =>
    googleError(429, 'RESOURCE_EXHAUSTED', 'You exceeded your current quota, please check your plan and billing details.', [
      { '@type': 'type.googleapis.com/google.rpc.QuotaFailure', violations: [{ quotaMetric: 'generativelanguage.googleapis.com/generate_content_free_tier_requests', quotaId: 'GenerateRequestsPerDayPerProjectPerModel-FreeTier' }] },
      { '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '21s' },
    ]);
  offset = gemini.msUntilPacificMidnight() - 12 * HOUR;
  try {
    scenario('Daily quota used up on every model', perDay);
    const direct = await settle(gemini.callGemini({ systemInstruction: 'Answer briefly.' }, 'hello'));
    const e = direct.error;
    check(
      e instanceof gemini.GeminiError && e.code === 'rate_limited' && e.reason === 'daily_quota',
      `callGemini → rate_limited with reason daily_quota (${e instanceof gemini.GeminiError ? `${e.code}/${e.reason}` : String(e)})`,
    );
    check(models() === research.join(), `each research model tried once (${models()})`);
    scenario('Daily quota through /api/teardown', perDay);
    const quota = await teardown('quota.example');
    check(
      quota.status === 429 && quota.json.code === 'rate_limited' && /midnight Pacific/.test(quota.json.error ?? ''),
      `429 rate_limited that says the quota resets at midnight Pacific (${quota.status}: ${quota.json.error})`,
    );
  } finally {
    offset = 0;
  }

  setDiscoveryForTests(null);
  server.close();
  console.log(problems ? `\n✗ ${problems} problem(s)` : '\n✓ URL Context (pages) mode passes');
  process.exit(problems ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
