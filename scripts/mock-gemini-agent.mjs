/**
 * A tiny fake of the Gemini API (models.generateContent) for testing the Gemini "Ask Teardown" agent
 * (src/lib/llm/gemini-agent.ts, via src/app/api/agent+api.ts) without a key.
 *   node scripts/mock-gemini-agent.mjs      → listens on http://localhost:9932 (GEMINI_AGENT_MOCK_PORT to change)
 * Speaks POST /{apiVersion}/models/{model}:generateContent and rejects request shapes the real API would (400):
 * function responses that don't pair with the previous turn's function calls, a missing thought signature,
 * server-side search parts without Google Search, missing tools or system instruction.
 * The scenario is picked from the student's latest message:
 *   "maroon"             → read_playground, then (Google Search +) set_tweak --brand #501214, then play_flow <first flow>,
 *                          then text + SUGGESTIONS with grounding sources (duplicates, a redirect link, a non-web link)
 *   "#bad-args"          → unknown tool, schema violations, bad ids, a disguised network edit; then text
 *   "loop forever"       → a function call every turn until functionCallingConfig.mode is NONE
 *   "#malformed"         → MALFORMED_FUNCTION_CALL with no content first, then text
 *   "#no-search-combo"   → 400 whenever Google Search is combined with functions; otherwise highlight_node, then text
 *   "#empty" / "#blocked" / "#silent-actions" → no usable text, SAFETY, a tool call then no text
 *   "#flaky"             → 503 once, then text · "slow down" → 429 (retryDelay 30s) · "bad key" → 400 API key not valid
 *   "#hang"              → waits 10s before answering (tests the route's deadline)
 *   anything else        → a short text answer
 * GET /__requests returns every request ({ path, model, body }) for assertions; DELETE clears them.
 * GET /grounding-api-redirect/<n> answers 302 to a real-looking article (grounding links are redirects).
 */
import http from 'node:http';

const PORT = Number(process.env.GEMINI_AGENT_MOCK_PORT ?? 9932);
let requests = [];
let ids = 0;
let flakyFailed = false;

const TOOL_NAMES = [
  'search_teardown', 'read_playground', 'open_tab', 'highlight_node', 'play_flow', 'show_code', 'open_stack_layer',
  'show_concept', 'open_roadmap', 'set_tweak', 'edit_text', 'edit_playground_code', 'reset_playground',
];
const SIGNATURE = 'bW9jay10aG91Z2h0LXNpZ25hdHVyZQ==';

const partsOf = (c) => c?.parts ?? [];
const textsOf = (c) => partsOf(c).flatMap((p) => (typeof p.text === 'string' && !p.thought ? [p.text] : []));
const isResponseTurn = (c) => partsOf(c).some((p) => p.functionResponse);
const systemOf = (body) => (typeof body.systemInstruction === 'string' ? body.systemInstruction : textsOf(body.systemInstruction).join('\n'));
const declarationsOf = (body) => (body.tools ?? []).flatMap((t) => t.functionDeclarations ?? []);
const hasSearch = (body) => (body.tools ?? []).some((t) => t.googleSearch);

function teardownFrom(body) {
  const first = textsOf(body.contents?.[0]).join('\n');
  const json = /<teardown_data>\n([\s\S]*?)\n<\/teardown_data>/.exec(first)?.[1];
  try {
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

/** Problems with the request shape, reported back as a 400 like the real API would. */
function validate(body) {
  const problems = [];
  if (!systemOf(body).includes('untrusted')) problems.push('systemInstruction missing');
  const declarations = declarationsOf(body);
  const names = declarations.map((d) => d.name);
  TOOL_NAMES.forEach((n) => !names.includes(n) && problems.push(`function ${n} missing`));
  declarations.forEach((d) => {
    if (!d.description) problems.push(`function ${d.name} has no description`);
    if (d.parameters && d.parametersJsonSchema) problems.push(`function ${d.name} sets parameters and parametersJsonSchema`);
    if (d.parametersJsonSchema && (d.parametersJsonSchema.type !== 'object' || d.parametersJsonSchema.$schema)) problems.push(`function ${d.name} schema malformed`);
  });
  if (hasSearch(body) && declarations.length && body.toolConfig?.includeServerSideToolInvocations !== true) {
    problems.push('Google Search with function calling needs toolConfig.includeServerSideToolInvocations');
  }
  if (!body.generationConfig?.thinkingConfig?.thinkingLevel) problems.push('thinkingLevel missing');
  const contents = body.contents ?? [];
  contents.forEach((c, i) => {
    if (c.role !== 'user' && c.role !== 'model') problems.push(`content ${i} has role ${c.role}`);
    if (i > 0 && c.role === contents[i - 1].role) problems.push(`contents ${i - 1} and ${i} have the same role`);
    if (!partsOf(c).length) problems.push(`content ${i} has no parts`);
    const calls = partsOf(c).filter((p) => p.functionCall);
    if (c.role === 'model' && calls.length && !calls[0].thoughtSignature) problems.push(`content ${i}: function call is missing a thought_signature`);
    if (partsOf(c).some((p) => p.toolCall || p.toolResponse) && !hasSearch(body)) problems.push(`content ${i} has server-side tool parts without Google Search`);
    const results = partsOf(c).filter((p) => p.functionResponse).map((p) => p.functionResponse);
    const previousCalls = i > 0 && contents[i - 1].role === 'model' ? partsOf(contents[i - 1]).filter((p) => p.functionCall).map((p) => p.functionCall) : [];
    if (c.role === 'user' && previousCalls.length && results.length !== previousCalls.length) {
      problems.push(`content ${i} answers ${results.length} of ${previousCalls.length} function calls`);
    }
    results.forEach((r, j) => {
      const call = previousCalls[j];
      if (!call || call.name !== r.name || (call.id ?? undefined) !== (r.id ?? undefined)) problems.push(`content ${i} function response ${j} doesn't match its call`);
      if (!r.response || typeof r.response !== 'object') problems.push(`content ${i} function response ${j} has no response object`);
    });
  });
  if (!teardownFrom(body)) problems.push('no parseable <teardown_data> in the first content');
  if (contents.at(-1)?.role !== 'user') problems.push('last content is not from the user');
  return problems;
}

const call = (name, args, { id = true } = {}) => ({ functionCall: { name, args, ...(id ? { id: `call_${++ids}` } : {}) } });
/** Gemini 3 signs the first function call of a turn */
const signed = (parts) => {
  const i = parts.findIndex((p) => p.functionCall);
  return parts.map((p, j) => (j === i ? { ...p, thoughtSignature: SIGNATURE } : p));
};
const candidate = (parts, extra = {}) => ({ content: { role: 'model', parts: signed(parts) }, finishReason: 'STOP', index: 0, ...extra });
const answer = (parts, extra = {}) => ({ candidates: [candidate(parts, extra)] });
const text = (t) => ({ text: t });
const chunk = (uri, title) => ({ web: { uri, title } });

function respond(body) {
  const contents = body.contents;
  // The student's question: the last user turn that isn't function responses (notes the agent adds start with "[")
  const qi = contents.findLastIndex((c) => c.role === 'user' && !isResponseTurn(c));
  const ask = (textsOf(contents[qi]).filter((t) => !t.startsWith('[')).at(-1) ?? '').toLowerCase();
  const after = contents.slice(qi + 1);
  const notes = contents.slice(qi).flatMap(textsOf).filter((t) => t.startsWith('[Your last function call')).length;
  const round = after.filter((c) => c.role === 'model').length + notes;
  const flows = teardownFrom(body).architecture.flows;
  const final = body.toolConfig?.functionCallingConfig?.mode === 'NONE';

  if (ask.includes('bad key')) return { status: 400, error: { code: 400, message: 'API key not valid. Please pass a valid API key.', status: 'INVALID_ARGUMENT' } };
  if (ask.includes('slow down')) {
    return {
      status: 429,
      error: {
        code: 429,
        message: 'You exceeded your current quota.',
        status: 'RESOURCE_EXHAUSTED',
        details: [{ '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '30s' }],
      },
    };
  }
  if (ask.includes('#flaky') && !flakyFailed) {
    flakyFailed = true;
    return { status: 503, error: { code: 503, message: 'The model is overloaded. Please try again later.', status: 'UNAVAILABLE' } };
  }
  if (ask.includes('#no-search-combo') && hasSearch(body)) {
    return { status: 400, error: { code: 400, message: 'Tool use with function calling is unsupported for this model.', status: 'INVALID_ARGUMENT' } };
  }

  if (ask.includes('loop forever')) {
    if (final) return answer([text('I opened the map a few times.\nSUGGESTIONS: One | Two | Three')]);
    return answer([call('open_tab', { tab: 'system' })]);
  }
  if (ask.includes('#malformed')) {
    if (round === 0) return { candidates: [{ finishReason: 'MALFORMED_FUNCTION_CALL', index: 0 }] };
    return answer([text('Recovered.\nSUGGESTIONS: What is a CDN? | Show the feed | Trace a like')]);
  }
  if (ask.includes('#empty')) return { candidates: [{ content: { role: 'model', parts: [] }, finishReason: 'STOP', index: 0 }] };
  if (ask.includes('#blocked')) return { candidates: [{ finishReason: 'SAFETY', index: 0 }] };
  if (ask.includes('#silent-actions')) return round === 0 ? answer([call('open_tab', { tab: 'code' })]) : answer([text('')]);
  if (ask.includes('#no-search-combo')) {
    if (round === 0) return answer([call('highlight_node', { nodeId: 'postgres' })]);
    return answer([text('The database box is highlighted.\nSUGGESTIONS: What is sharding? | Show the database | Trace a like')]);
  }
  if (ask.includes('#bad-args')) {
    if (round === 0) {
      return answer([
        call('delete_everything', {}),
        call('set_tweak', { name: '--brand' }),
        call('open_tab', { tab: 'settings' }),
        call('highlight_node', { nodeId: 42 }),
        call('play_flow', { flowId: 'nope' }),
        call('edit_text', { key: 'caption', text: 'x'.repeat(400) }),
        call('edit_playground_code', { old_str: '<title>Mini Instagram</title>', new_str: '<title>Mini Instagram</title><img src="https://evil.example/x.png">' }),
        call('set_tweak', { name: 'color', value: '#000000' }),
        call('search_teardown', { query: '!!' }, { id: false }),
      ]);
    }
    return answer([text('Sorry, none of those worked.\nSUGGESTIONS: What is a CDN? | Show the feed | Trace a like')]);
  }
  if (ask.includes('maroon')) {
    if (round === 0) return answer([{ text: 'Planning the change.', thought: true }, text('Let me look at the playground first.'), call('read_playground', {})]);
    if (round === 1) {
      const search = hasSearch(body)
        ? [
            { toolCall: { id: 'search_1', toolType: 'GOOGLE_SEARCH_WEB', args: { queries: ['Texas State Bobcats maroon hex'] } } },
            { toolResponse: { id: 'search_1', toolType: 'GOOGLE_SEARCH_WEB', response: { search_suggestions: 'Texas State maroon is #501214' } } },
          ]
        : [];
      return answer([...search, call('set_tweak', { name: '--brand', value: '#501214' })], {
        groundingMetadata: {
          groundingChunks: [chunk('https://about.instagram.com/brand', 'about.instagram.com'), chunk('https://en.wikipedia.org/wiki/Instagram', 'wikipedia.org')],
          webSearchQueries: ['Texas State Bobcats maroon hex'],
        },
      });
    }
    if (round === 2) return answer([call('play_flow', { flowId: flows[0].id })]);
    return answer(
      [
        text(`I set \`--brand\` to **#501214**, Bobcat maroon, so the like heart changes colour.\n• Now watch "${flows[0].title}" on the map.\nAccording to recent web sources, Insta`),
        text('gram still stores its core data in PostgreSQL.\nSUGGESTIONS: What is sharding? | Show me the Django code | Round the photo corners'),
      ],
      {
        groundingMetadata: {
          groundingChunks: [
            chunk('https://en.wikipedia.org/wiki/Instagram/?utm=dup', 'wikipedia.org'),
            chunk(`http://localhost:${PORT}/grounding-api-redirect/1`, 'theverge.com'),
            chunk('https://engineering.fb.com/2026/instagram-postgres', ''),
            chunk('https://instagram-engineering.com/sharding-ids', 'instagram-engineering.com'),
            chunk('ftp://files.example/notes.txt', 'files.example'),
            chunk('https://www.postgresql.org/about/', 'postgresql.org'),
            chunk('https://example.org/sixth', 'example.org'),
          ],
          webSearchQueries: ['Instagram database 2026'],
        },
      },
    );
  }
  return answer([text('Hello! Ask me about Instagram.\nSUGGESTIONS: What is a CDN? | Show the feed | Trace a like')]);
}

function send(res, status, json, headers = {}) {
  res.writeHead(status, { 'content-type': 'application/json', ...headers });
  res.end(JSON.stringify(json));
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://localhost:${PORT}`);
  if (pathname === '/__requests') {
    if (req.method === 'DELETE') {
      requests = [];
      flakyFailed = false;
    }
    return send(res, 200, requests);
  }
  if (pathname === '/health') return send(res, 200, { ok: true });
  if (pathname.startsWith('/grounding-api-redirect/')) {
    res.writeHead(302, { location: 'https://www.theverge.com/2026/instagram-database' });
    return res.end();
  }
  const match = /^\/(v1beta|v1|v1alpha)\/models\/([^/:]+):generateContent$/.exec(pathname);
  if (req.method !== 'POST' || !match) return send(res, 404, { error: { code: 404, message: `Not found: ${req.method} ${pathname}`, status: 'NOT_FOUND' } });

  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', () => {
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return send(res, 400, { error: { code: 400, message: 'Invalid JSON payload', status: 'INVALID_ARGUMENT' } });
    }
    requests.push({ path: pathname, model: match[2], keyHeader: Boolean(req.headers['x-goog-api-key']), body });
    const problems = validate(body);
    if (problems.length) return send(res, 400, { error: { code: 400, message: problems.join('; '), status: 'INVALID_ARGUMENT' } });

    const result = respond(body);
    const reply = () =>
      result.error
        ? send(res, result.status, { error: result.error })
        : send(res, 200, { ...result, modelVersion: match[2], responseId: `resp_${++ids}`, usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 42, totalTokenCount: 52 } });
    if (!JSON.stringify(body.contents.at(-1)).toLowerCase().includes('#hang')) return reply();
    const timer = setTimeout(() => !res.destroyed && reply(), 10_000);
    res.on('close', () => clearTimeout(timer));
  });
});

server.listen(PORT, () => console.log(`mock Gemini API on http://localhost:${PORT}`));
