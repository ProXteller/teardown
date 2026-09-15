/**
 * A tiny fake of the Gemini API for testing src/app/api/roadmap+api.ts without a key.
 *   node scripts/mock-gemini-roadmap.mjs      → listens on http://localhost:9933 (GEMINI_MOCK_PORT to change)
 * Speaks POST /{apiVersion}/models/{model}:generateContent (what @google/genai calls when httpOptions.baseUrl is set).
 * The answer is picked from the "App:" line of the prompt and uses the step ids listed as `- id "<id>"`:
 *   default      → a mix of picks the route must keep or drop (see PLAN below) plus groundingMetadata
 *   "#gemini-400" → 400 INVALID_ARGUMENT (the route must answer 502, not 400)
 *   "#empty"      → {"steps": []}, answered after 300 ms (for the in-flight de-duplication test)
 *   "#proto"      → the default answer plus a 4th pick on the first step whose topic is "constructor" (must be dropped)
 * GET /health → ok · GET /__requests → every request ({ path, body }) · DELETE /__requests clears them.
 */
import http from 'node:http';

const PORT = Number(process.env.GEMINI_MOCK_PORT ?? 9933);
let requests = [];

/**
 * Per step index. `expect` documents what the route should do with each pick (the test asserts it).
 * Step 1 has 5 picks: the route only considers the first 4 per step, so the 5th is ignored entirely.
 */
const PLAN = [
  [
    { expect: 'drop:dead', title: 'A page that does not exist', provider: 'Example', url: 'https://example.com/does-not-exist-404-page', type: 'guide', topics: ['javascript'] },
    { expect: 'keep', title: 'Learn web development', provider: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Learn', type: 'documentation', topics: ['HTML', 'javascript'] },
    { expect: 'keep', title: 'Learn JavaScript - Full Course for Beginners', provider: 'freeCodeCamp.org', url: 'https://youtu.be/PkZNo7MFNFg', type: 'video', topics: ['JavaScript'] },
  ],
  [
    { expect: 'drop:library', title: 'Learn CSS', provider: 'web.dev', url: 'https://web.dev/learn/css/', type: 'course', topics: ['html-css'] },
    { expect: 'drop:topic', title: 'JavaScript Guide', provider: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', type: 'docs', topics: ['javascript', 'underwater-basket-weaving'] },
    { expect: 'drop:http', title: 'HTML basics', provider: 'MDN', url: 'http://developer.mozilla.org/en-US/docs/Web/HTML', type: 'docs', topics: ['html-css'] },
    { expect: 'drop:private', title: 'Internal wiki', provider: 'Intranet', url: `https://localhost:${PORT}/private`, type: 'docs', topics: ['security-fundamentals'] },
    { expect: 'ignored', title: 'CSS reference', provider: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS', type: 'docs', topics: ['html-css'] },
  ],
  [
    { expect: 'drop:mismatch', title: 'Kubernetes Crash Course', provider: 'TechWorld with Nana', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', type: 'video', topics: ['kubernetes'] },
    { expect: 'drop:repeat', title: 'Learn web development (again)', provider: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Learn', type: 'docs', topics: ['html-css'] },
    { expect: 'drop:404', title: 'Missing MDN page', provider: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/this-page-does-not-exist-404xyz', type: 'docs', topics: ['web-security'] },
  ],
];

const toResource = ({ expect: _expect, ...r }) => ({
  level: 'beginner',
  free: true,
  duration: 'self-paced',
  why: `Mock pick: ${r.title}.`,
  ...r,
});

const PROTO_PICK = { title: 'Object constructor', provider: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor', type: 'docs', topics: ['constructor'] };

function answer(prompt, proto = false) {
  const ids = [...prompt.matchAll(/^- id "([^"]+)"/gm)].map((m) => m[1]);
  const steps = ids.slice(0, PLAN.length).map((stepId, i) => ({ stepId, resources: [...PLAN[i], ...(proto && i === 0 ? [PROTO_PICK] : [])].map(toResource) }));
  // A step the caller never asked about must be ignored
  steps.push({ stepId: 'zz-not-a-step', resources: [toResource({ title: 'Stray', provider: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', type: 'docs', topics: ['networking'] })] });
  return { steps };
}

const send = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
};

const server = http.createServer((req, res) => {
  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', async () => {
    if (req.method === 'GET' && req.url === '/health') return send(res, 200, { ok: true });
    if (req.url === '/__requests') {
      if (req.method === 'DELETE') requests = [];
      return send(res, 200, requests);
    }
    if (req.method !== 'POST' || !/\/models\/[^/]+:generateContent/.test(req.url ?? '')) {
      return send(res, 404, { error: { code: 404, message: `Mock has no route for ${req.method} ${req.url}`, status: 'NOT_FOUND' } });
    }

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return send(res, 400, { error: { code: 400, message: 'Invalid JSON payload', status: 'INVALID_ARGUMENT' } });
    }
    requests.push({ path: req.url, body });
    const prompt = (body.contents ?? []).flatMap((c) => c.parts ?? []).map((p) => p.text ?? '').join('\n');
    const app = prompt.match(/^App: (.*)$/m)?.[1] ?? '';

    if (app.includes('#gemini-400')) {
      return send(res, 400, { error: { code: 400, message: 'Request contains an invalid argument.', status: 'INVALID_ARGUMENT' } });
    }
    if (app.includes('#empty')) await new Promise((r) => setTimeout(r, 300));
    const data = app.includes('#empty') ? { steps: [] } : answer(prompt, app.includes('#proto'));

    send(res, 200, {
      candidates: [
        {
          content: { role: 'model', parts: [{ text: JSON.stringify(data) }] },
          finishReason: 'STOP',
          index: 0,
          groundingMetadata: {
            webSearchQueries: ['best free javascript course 2025', 'mdn learn web development'],
            groundingChunks: [
              { web: { uri: 'https://developer.mozilla.org/en-US/docs/Learn', title: 'developer.mozilla.org' } },
              { web: { uri: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', title: 'youtube.com' } },
            ],
          },
        },
      ],
      usageMetadata: { promptTokenCount: 900, candidatesTokenCount: 700, totalTokenCount: 1600 },
      modelVersion: 'gemini-mock-roadmap',
    });
  });
});

server.listen(PORT, () => console.log(`mock Gemini (roadmap) on http://localhost:${PORT}`));
