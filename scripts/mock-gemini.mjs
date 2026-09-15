/**
 * A tiny fake of the Gemini API (models.generateContent with Google Search grounding) for testing
 * /api/teardown's Gemini path without a key or quota.
 *   npx tsx scripts/mock-gemini.mjs        → http://localhost:9931 (GEMINI_MOCK_PORT to change)
 * Run it with tsx so the fixtures come from src/data/curated/spotify.ts; plain `node` falls back to small inline fixtures.
 *
 * POST /v1beta/models/{model}:generateContent answers with JSON for the part named by the request
 * (story / system / build, read from responseJsonSchema or the prompt) plus groundingMetadata whose
 * chunk URIs point at this server's /grounding-api-redirect?to=<real url>, which 302s like Google's redirect links.
 * Scenario markers anywhere in the prompt:
 *   mock-retry-once   → first request per part gets 429, then success
 *   mock-fallback     → 400 when a request has BOTH tools and responseMimeType (search+JSON unsupported);
 *                       search-only requests get research notes with their own sources, JSON-only requests get the JSON
 *   mock-rate-limit   → always 429          mock-unavailable → always 503
 *   mock-bad-key      → 400 "API key not valid" (what Gemini really returns for a bad key)
 *   mock-blocked      → promptFeedback.blockReason SAFETY
 *   mock-garbage      → prose instead of JSON   mock-wrong-shape → JSON of the wrong shape
 *   mock-repair       → story languages that don't sum to 100 + a scan-detected tool marked likely;
 *                       system flow hop with no matching edge
 *   mock-daily-quota  → 429 naming a PerDay quota      mock-retry-hint → 429 asking to retry in 45s
 *   mock-model-404    → 404 NOT_FOUND for the model    mock-region     → 400 "User location is not supported"
 *   mock-truncated    → JSON answers cut in half with finishReason MAX_TOKENS (notes calls are fine)
 *   mock-slow         → answers after 4s (for client timeouts)
 *   mock-no-grounding → JSON answer with every stack item "confirmed" and no groundingMetadata (Gemini didn't search)
 *   mock-ssrf         → grounding chunk URIs that only look like redirect links (other host, other path, private IP)
 *   mock-injected-src → story sources include a localhost URL and a credentials URL (must be dropped)
 * A missing/wrong x-goog-api-key header (anything but "test") also gets the bad-key 400.
 * Also POST /v1/messages (Anthropic, streaming or not) so the Claude path of the route can be smoke-tested.
 * GET /__requests lists logged requests (API key replaced by a boolean); DELETE /__requests clears them. GET /health.
 */
import http from 'node:http';

const PORT = Number(process.env.GEMINI_MOCK_PORT ?? 9931);
const BASE = `http://localhost:${PORT}`;

/* ---------------------------------------------------------------- fixtures */

async function loadFixtures() {
  try {
    const { spotify } = await import('../src/data/curated/spotify.ts');
    return {
      story: {
        name: spotify.name, url: spotify.url, tagline: spotify.tagline, category: spotify.category,
        brandColor: spotify.brandColor, accentColor: spotify.accentColor, logoGlyph: spotify.logoGlyph, eli5: spotify.eli5,
        facts: spotify.facts, history: spotify.history, languages: spotify.languages, stack: spotify.stack,
        concepts: spotify.concepts, buildYourOwn: spotify.buildYourOwn, sources: spotify.sources,
      },
      system: { architecture: spotify.architecture, files: spotify.files },
      build: { code: spotify.code, playground: spotify.playground },
      from: 'src/data/curated/spotify.ts',
    };
  } catch {
    const node = (id, tier, kind) => ({ id, label: id, kind, tier, tech: 'Example tech', description: `The ${id} box.` });
    const nodes = [node('app', 0, 'client'), node('cdn', 1, 'edge'), node('api', 2, 'gateway'), node('player', 3, 'service'), node('db', 4, 'database')];
    const edges = [['app', 'cdn'], ['cdn', 'api'], ['api', 'player'], ['player', 'db']].map(([from, to]) => ({ from, to, label: 'HTTPS' }));
    const steps = [['app', 'cdn'], ['cdn', 'api'], ['api', 'player'], ['player', 'db']].map(([from, to]) => ({ from, to, narration: `${from} → ${to}` }));
    return {
      story: {
        name: 'Spotify', url: 'spotify.com', tagline: 'Music streaming', category: 'Audio streaming', brandColor: '#1DB954',
        accentColor: '#1ED760', logoGlyph: '🎧', eli5: 'Spotify streams music from the cloud.',
        facts: [{ label: 'Founded', value: '2006' }], history: [{ year: '2006', title: 'Founded', detail: 'Founded in Stockholm.' }],
        languages: [{ name: 'Java', usedFor: 'Backend services', share: 60 }, { name: 'TypeScript', usedFor: 'Web and desktop UI', share: 40 }],
        stack: [{ layer: 'Frontend', items: [{ name: 'React', role: 'Web UI', beginnerNote: 'Builds the screen from components.', confidence: 'confirmed' }] }],
        concepts: [{ term: 'CDN', meaning: 'Servers near you that cache files.' }],
        buildYourOwn: [{ step: 'Play a file', detail: 'Use an <audio> tag.' }],
        sources: [{ label: 'Spotify on Wikipedia', url: 'https://en.wikipedia.org/wiki/Spotify' }],
      },
      system: {
        architecture: { nodes, edges, flows: ['You press play', 'You search', 'You like a song'].map((title, i) => ({ id: `f${i}`, title, emoji: '▶️', steps })) },
        files: [{ path: 'web/src/App.tsx', note: 'Root component' }],
      },
      build: {
        code: [{ id: 'play', title: 'Play a song', file: 'web/src/play.ts', language: 'TypeScript', explanation: 'Plays audio.', code: 'const audio = new Audio(url);\naudio.play();' }],
        playground: {
          title: 'Mini player', description: 'A tiny player',
          html: '<!doctype html><html><head><style>:root{\n--brand: #1DB954; /* @tweak color "Brand color" */\n}</style></head><body><h1 data-edit="title">Now playing</h1><script>1</script></body></html>',
          challenges: ['Change the brand color'],
        },
      },
      from: 'inline',
    };
  }
}

const FIXTURES = await loadFixtures();

const redirect = (url) => `${BASE}/grounding-api-redirect?to=${encodeURIComponent(url)}`;

/** Search sources for the one-call path. Titles are bare domains or page titles, like real grounding chunks. */
const GROUNDING = [
  { title: 'wikipedia.org', url: 'https://en.wikipedia.org/wiki/Spotify' },
  { title: 'Spotify - Web Player: Music for everyone', url: 'https://spotify.com' },
  { title: 'stackshare.io', url: 'https://stackshare.io/spotify/spotify' },
  { title: 'newsroom.spotify.com', url: 'https://newsroom.spotify.com/company-info/' },
];
/** Sources for research-notes calls in the fallback path (distinct so tests can tell which response was used). */
const NOTES_GROUNDING = [
  { title: 'How Spotify built its data platform', url: 'https://engineering.atspotify.com/2024/05/data-platform-explained' },
  { title: 'wikipedia.org', url: 'https://en.wikipedia.org/wiki/Spotify' },
];

function storyFixture(prompt) {
  const story = structuredClone(FIXTURES.story);
  // Exercise source merging: a human label for a page grounding calls "wikipedia.org", a bare-domain label for a page
  // grounding titles properly, an unresolved redirect and a non-web URL (both must be dropped)
  story.sources = [
    { label: 'Spotify on Wikipedia', url: 'https://en.wikipedia.org/wiki/Spotify' },
    { label: 'spotify.com', url: 'https://www.spotify.com/' },
    { label: 'Some redirect', url: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AbC123' },
    { label: 'Not a page', url: 'javascript:alert(1)' },
    { label: 'Spotify Engineering', url: 'https://engineering.atspotify.com/' },
  ];
  if (prompt.includes('mock-repair')) {
    story.languages = story.languages.map((l, i) => ({ ...l, share: i === 0 ? 90 : 30 }));
    story.stack = [
      { layer: 'Infrastructure', items: [{ name: 'Cloudflare', role: 'CDN', beginnerNote: 'Serves files from nearby.', confidence: 'likely' }] },
      ...story.stack,
    ];
  }
  return story;
}

function systemFixture(prompt) {
  const system = structuredClone(FIXTURES.system);
  if (prompt.includes('mock-repair')) {
    const step = system.architecture.flows[0].steps[0];
    system.architecture.edges = system.architecture.edges.filter(
      (e) => !((e.from === step.from && e.to === step.to) || (e.from === step.to && e.to === step.from)),
    );
  }
  return system;
}

const fixtureFor = (part, prompt) =>
  part === 'story' ? storyFixture(prompt) : part === 'system' ? systemFixture(prompt) : structuredClone(FIXTURES.build);

/* ---------------------------------------------------------------- helpers */

let requests = [];
const retried = new Set();

function send(res, status, json, headers = {}) {
  res.writeHead(status, { 'content-type': 'application/json', ...headers });
  res.end(JSON.stringify(json));
}

const googleError = (res, code, status, message, extra = {}) => send(res, code, { error: { code, message, status, ...extra } });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function partOf(body, prompt) {
  const props = body.generationConfig?.responseJsonSchema?.properties ?? {};
  if ('eli5' in props) return 'story';
  if ('architecture' in props) return 'system';
  if ('playground' in props) return 'build';
  const named = /\b(STORY|SYSTEM|BUILD) part\b/.exec(prompt)?.[1];
  return named ? named.toLowerCase() : null;
}

function candidate(parts, grounding, finishReason = 'STOP') {
  return {
    content: { role: 'model', parts },
    finishReason,
    index: 0,
    ...(grounding
      ? {
          groundingMetadata: {
            webSearchQueries: ['spotify tech stack', 'spotify founded year founders'],
            groundingChunks: grounding.map((s) => ({ web: { uri: redirect(s.url), title: s.title } })),
            searchEntryPoint: { renderedContent: '<div>search</div>' },
          },
        }
      : {}),
  };
}

const ok = (res, parts, grounding, extra = {}, finishReason = 'STOP') =>
  send(res, 200, {
    candidates: [candidate(parts, grounding, finishReason)],
    usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 200, totalTokenCount: 300 },
    modelVersion: 'gemini-3.8-flash-mock',
    responseId: `mock-${requests.length}`,
    ...extra,
  });

/* ---------------------------------------------------------------- Gemini */

async function generateContent(req, res, body, model) {
  const prompt = (body.contents ?? []).flatMap((c) => c.parts ?? []).map((p) => p.text ?? '').join('\n');
  const tools = Array.isArray(body.tools) && body.tools.length > 0;
  const search = tools && body.tools.some((t) => t.googleSearch);
  const json = body.generationConfig?.responseMimeType === 'application/json';
  const part = partOf(body, prompt);

  if (req.headers['x-goog-api-key'] !== 'test' || prompt.includes('mock-bad-key')) {
    return googleError(res, 400, 'INVALID_ARGUMENT', 'API key not valid. Please pass a valid API key.', {
      details: [{ '@type': 'type.googleapis.com/google.rpc.ErrorInfo', reason: 'API_KEY_INVALID', domain: 'googleapis.com' }],
    });
  }
  if (!model || !body.contents?.length) return googleError(res, 400, 'INVALID_ARGUMENT', 'model and contents are required');
  if (!body.systemInstruction?.parts?.[0]?.text) return googleError(res, 400, 'INVALID_ARGUMENT', 'mock expects a systemInstruction');
  if (json && !body.generationConfig?.responseJsonSchema) return googleError(res, 400, 'INVALID_ARGUMENT', 'mock expects responseJsonSchema with JSON output');
  if (!part) return googleError(res, 400, 'INVALID_ARGUMENT', 'mock could not tell which teardown part was requested');

  if (prompt.includes('mock-rate-limit')) return googleError(res, 429, 'RESOURCE_EXHAUSTED', 'Resource has been exhausted (e.g. check quota).');
  if (prompt.includes('mock-daily-quota')) {
    return googleError(res, 429, 'RESOURCE_EXHAUSTED', 'You exceeded your current quota, please check your plan and billing details.', {
      details: [
        { '@type': 'type.googleapis.com/google.rpc.QuotaFailure', violations: [{ quotaMetric: 'generativelanguage.googleapis.com/generate_content_free_tier_requests', quotaId: 'GenerateRequestsPerDayPerProjectPerModel-FreeTier' }] },
        { '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '3s' },
      ],
    });
  }
  if (prompt.includes('mock-retry-hint')) {
    return googleError(res, 429, 'RESOURCE_EXHAUSTED', 'You exceeded your current quota.', {
      details: [{ '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '45s' }],
    });
  }
  if (prompt.includes('mock-model-404')) return googleError(res, 404, 'NOT_FOUND', `models/${model} is not found for API version v1beta, or is not supported for generateContent.`);
  if (prompt.includes('mock-region')) return googleError(res, 400, 'FAILED_PRECONDITION', 'User location is not supported for the API use.');
  if (prompt.includes('mock-slow')) await sleep(4000);
  if (prompt.includes('mock-unavailable')) return googleError(res, 503, 'UNAVAILABLE', 'The model is overloaded. Please try again later.');
  if (prompt.includes('mock-retry-once') && !retried.has(part)) {
    retried.add(part);
    return googleError(res, 429, 'RESOURCE_EXHAUSTED', 'Resource has been exhausted (e.g. check quota).');
  }
  if (prompt.includes('mock-fallback') && tools && json) {
    return googleError(res, 400, 'INVALID_ARGUMENT', "Tool use with a response mime type: 'application/json' is unsupported");
  }
  if (prompt.includes('mock-blocked')) {
    return send(res, 200, { promptFeedback: { blockReason: 'SAFETY' }, modelVersion: 'gemini-3.8-flash-mock' });
  }

  if (!json) {
    // Research-notes call (fallback path): plain text grounded in search
    return ok(res, [{ text: `Research notes for the ${part} part: Spotify was founded in 2006 in Stockholm (Wikipedia). It uses Java and Python services (Spotify Engineering blog).` }], search ? NOTES_GROUNDING : null);
  }
  if (prompt.includes('mock-garbage')) return ok(res, [{ text: 'Sorry, I could not find much about this product.' }], search ? GROUNDING : null);
  if (prompt.includes('mock-truncated')) {
    const full = JSON.stringify(fixtureFor(part, prompt));
    return ok(res, [{ text: full.slice(0, Math.floor(full.length / 2)) }], search ? GROUNDING : null, {}, 'MAX_TOKENS');
  }
  if (prompt.includes('mock-no-grounding')) {
    const story = fixtureFor(part, prompt);
    if (part === 'story') {
      story.stack = story.stack.map((l) => ({ ...l, items: l.items.map((i) => ({ ...i, confidence: 'confirmed' })) }));
      // Home pages only, so the route doesn't need the network to check them
      story.sources = [{ label: 'Spotify', url: 'https://www.spotify.com/' }];
    }
    return ok(res, [{ text: JSON.stringify(story) }], null);
  }
  if (prompt.includes('mock-ssrf')) {
    const fake = [
      { title: 'private ip', url: `http://127.0.0.1:${PORT}/grounding-api-redirect?to=${encodeURIComponent('https://internal.example/secret')}` },
      { title: 'other host', url: `https://evil.example/grounding-api-redirect/abc` },
      { title: 'redirect word in query', url: `${BASE}/not-a-redirect?x=grounding-api-redirect` },
      { title: 'wikipedia.org', url: redirect('https://en.wikipedia.org/wiki/Spotify') },
    ];
    const r = candidate([{ text: JSON.stringify(fixtureFor(part, prompt)) }], null);
    r.groundingMetadata = { webSearchQueries: ['spotify'], groundingChunks: fake.map((s) => ({ web: { uri: s.url, title: s.title } })) };
    return send(res, 200, { candidates: [r], modelVersion: 'gemini-3.8-flash-mock' });
  }
  if (prompt.includes('mock-injected-src') && part === 'story') {
    const story = fixtureFor(part, prompt);
    story.sources = [
      ...story.sources,
      { label: 'metadata', url: 'http://169.254.169.254/latest/meta-data/' },
      { label: 'local', url: 'http://localhost:3000/admin' },
      { label: 'creds', url: 'https://user:pass@example.com/' },
    ];
    return ok(res, [{ text: JSON.stringify(story) }], search ? GROUNDING : null);
  }
  if (prompt.includes('mock-wrong-shape')) return ok(res, [{ text: JSON.stringify({ hello: 'world' }) }], search ? GROUNDING : null);

  const text = JSON.stringify(fixtureFor(part, prompt));
  // Split the JSON over two parts like a streamed/merged answer; response.text joins them
  return ok(res, [{ text: text.slice(0, 40) }, { text: text.slice(40) }], search ? GROUNDING : null);
}

/* ---------------------------------------------------------------- Anthropic (Claude path smoke test) */

function messages(req, res, body) {
  const props = body.output_config?.format?.schema?.properties ?? {};
  const part = 'eli5' in props ? 'story' : 'architecture' in props ? 'system' : 'playground' in props ? 'build' : null;
  if (req.headers['x-api-key'] !== 'test') {
    return send(res, 401, { type: 'error', error: { type: 'authentication_error', message: 'invalid x-api-key' } });
  }
  if (!part) return send(res, 400, { type: 'error', error: { type: 'invalid_request_error', message: 'mock expects output_config.format' } });
  const text = JSON.stringify(fixtureFor(part, ''));
  const message = {
    id: `msg_mock_${requests.length}`, type: 'message', role: 'assistant', model: body.model ?? 'claude-opus-5',
    content: [{ type: 'text', text }], stop_reason: 'end_turn', stop_sequence: null, usage: { input_tokens: 10, output_tokens: 42 },
  };
  if (!body.stream) return send(res, 200, message);
  res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' });
  const event = (type, data) => res.write(`event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`);
  event('message_start', { message: { ...message, content: [], stop_reason: null, usage: { input_tokens: 10, output_tokens: 1 } } });
  event('content_block_start', { index: 0, content_block: { type: 'text', text: '' } });
  const half = Math.floor(text.length / 2);
  event('content_block_delta', { index: 0, delta: { type: 'text_delta', text: text.slice(0, half) } });
  event('content_block_delta', { index: 0, delta: { type: 'text_delta', text: text.slice(half) } });
  event('content_block_stop', { index: 0 });
  event('message_delta', { delta: { stop_reason: 'end_turn', stop_sequence: null }, usage: { output_tokens: 42 } });
  event('message_stop', {});
  res.end();
}

/* ---------------------------------------------------------------- server */

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', BASE);
  if (url.pathname === '/health') return send(res, 200, { ok: true, fixtures: FIXTURES.from });
  if (url.pathname === '/__requests') {
    if (req.method === 'DELETE') {
      requests = [];
      retried.clear();
      return send(res, 200, { ok: true });
    }
    return send(res, 200, requests);
  }
  if (url.pathname.startsWith('/grounding-api-redirect')) {
    const to = url.searchParams.get('to');
    requests.push({ method: req.method, path: url.pathname, redirectTo: to });
    res.writeHead(to ? 302 : 404, to ? { location: to } : {});
    return res.end();
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  let body = {};
  try {
    body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
  } catch {
    return googleError(res, 400, 'INVALID_ARGUMENT', 'Invalid JSON payload received.');
  }

  const gen = /^\/(v1beta|v1|v1alpha)\/models\/([^/:]+):generateContent$/.exec(url.pathname);
  if (req.method === 'POST' && gen) {
    requests.push({ method: 'POST', path: url.pathname, apiVersion: gen[1], model: gen[2], hasKey: Boolean(req.headers['x-goog-api-key']), body });
    return void generateContent(req, res, body, gen[2]).catch(() => {
      if (!res.headersSent) googleError(res, 500, 'INTERNAL', 'mock failed');
    });
  }
  if (req.method === 'POST' && url.pathname === '/v1/messages') {
    requests.push({ method: 'POST', path: url.pathname, hasKey: Boolean(req.headers['x-api-key']), body: { model: body.model, stream: body.stream } });
    return messages(req, res, body);
  }
  requests.push({ method: req.method, path: url.pathname, unknown: true });
  return googleError(res, 404, 'NOT_FOUND', `mock has no route for ${req.method} ${url.pathname}`);
});

server.listen(PORT, () => console.log(`mock Gemini API on ${BASE} (fixtures: ${FIXTURES.from})`));
