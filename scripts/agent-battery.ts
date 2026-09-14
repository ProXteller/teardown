/**
 * Adversarial battery for the offline Ask Teardown agent (src/lib/agent/local-agent.ts).
 * Messy, casual, misspelled prompts like a student would type in a live demo, run as real conversations.
 *   npx tsx scripts/agent-battery.ts            → failures only, grouped by category
 *   npx tsx scripts/agent-battery.ts --verbose  → every prompt and reply
 */
import { discord } from '../src/data/curated/discord';
import { facebook } from '../src/data/curated/facebook';
import { instagram } from '../src/data/curated/instagram';
import { netflix } from '../src/data/curated/netflix';
import type { Teardown } from '../src/data/types';
import { runLocalAgent } from '../src/lib/agent/local-agent';
import type { AgentAction, AgentMessage, AgentReply, TabKey } from '../src/lib/agent/types';
import type { ScanResult } from '../src/lib/fingerprints';
import { buildQuickTeardown } from '../src/lib/offline/build';
import { OFFLINE } from '../src/lib/offline/content';
import { parseTweaks, setEditableText, setTweak } from '../src/lib/playground';

/* ------------------------------------------------------------------ */
/* Fixtures                                                            */
/* ------------------------------------------------------------------ */

const txstScan: ScanResult = {
  ok: true,
  url: 'https://mobile.txst.edu/',
  status: 200,
  title: 'TXST Mobile | Texas State University',
  description: 'The official Texas State University mobile app.',
  detections: [{ name: 'Cloudflare', category: 'Hosting / CDN', evidence: 'Response has a cf-ray header' }],
  headers: [],
  outline: {
    nav: ['Home', 'Apps', 'Help'],
    headings: [
      { level: 1, text: 'TXST Mobile' },
      { level: 2, text: 'Get the app' },
      { level: 2, text: 'Features' },
    ],
    paragraphs: ['The official Texas State University app for students, faculty and visitors.', 'Download it free on iOS and Android.'],
    buttons: ['Download'],
    imageCount: 2,
  },
};

const txst = buildQuickTeardown(OFFLINE, { id: 'mobile-txst-edu', query: 'mobile.txst.edu', displayName: 'Mobile', domain: 'mobile.txst.edu', guessedDomain: false, scan: txstScan }).teardown;
// A bare name we couldn't scan: archetype template only, no history, everything LIKELY
const zorblat = buildQuickTeardown(OFFLINE, { id: 'zorblat', query: 'zorblat', displayName: 'Zorblat', domain: 'zorblat.com', guessedDomain: true, scan: null }).teardown;

/* ------------------------------------------------------------------ */
/* Conversation simulator (applies actions like the app does)          */
/* ------------------------------------------------------------------ */

const CHANGE_TYPES = new Set(['set_tweak', 'edit_text', 'set_playground_code', 'reset_playground']);
const isChange = (a: AgentAction) => CHANGE_TYPES.has(a.type);

interface Turn {
  prompt: string;
  reply: AgentReply;
  before: string;
  after: string;
  prompts: string[];
}

class Session {
  code: string;
  messages: AgentMessage[] = [];

  constructor(
    public t: Teardown,
    public tab: TabKey = 'story',
  ) {
    this.code = t.playground.html;
  }

  clone() {
    const s = new Session(this.t, this.tab);
    s.code = this.code;
    s.messages = [...this.messages];
    return s;
  }

  ask(prompt: string): Turn {
    this.messages.push({ role: 'user', text: prompt });
    const before = this.code;
    const reply = runLocalAgent({ teardown: this.t, playgroundCode: this.code, tab: this.tab, messages: [...this.messages] });
    for (const a of reply.actions) {
      if (a.type === 'open_tab') this.tab = a.tab;
      if (a.type === 'highlight_node' || a.type === 'play_flow') this.tab = 'system';
      if (a.type === 'show_code') this.tab = 'code';
      if (a.type === 'open_stack_layer') this.tab = 'stack';
      if (a.type === 'show_concept') this.tab = 'learn';
      if (a.type === 'set_tweak') this.code = setTweak(this.code, a.name, a.value).code;
      if (a.type === 'edit_text') this.code = setEditableText(this.code, a.key, a.text).code;
      if (a.type === 'set_playground_code') this.code = a.code;
      if (a.type === 'reset_playground') this.code = this.t.playground.html;
    }
    this.messages.push({ role: 'assistant', text: reply.text });
    return { prompt, reply, before, after: this.code, prompts: this.messages.filter((m) => m.role === 'user').map((m) => m.text) };
  }
}

/* ------------------------------------------------------------------ */
/* Generic checks: every reply, every teardown                          */
/* ------------------------------------------------------------------ */

type Category =
  | 'crash'
  | 'junk text'
  | 'length'
  | 'invalid action'
  | 'broken code'
  | 'suggestions'
  | 'ungrounded'
  | 'claims change'
  | 'dead-end suggestion'
  | 'repeat'
  | 'expectation';

interface Problem {
  cat: Category;
  msg: string;
}

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9+#]+/g, ' ').trim();
const wordCount = (s: string) => (s.replace(/[•*`]/g, ' ').match(/[A-Za-z0-9#][^\s]*/g) ?? []).length;
const keysOf = (code: string) => [...code.matchAll(/data-edit=["']([^"']+)["']/g)].map((m) => m[1]);
const tweakLines = (code: string) => [...code.matchAll(/^.*\/\*\s*@tweak[^*]*\*\/.*$/gm)].map((m) => m[0].replace(/:\s*[^;]+;/, ':;').trim());

function checkText(t: Teardown, turn: Turn, p: Problem[]) {
  const r = turn.reply;
  const text = r.text;
  if (!text.trim()) p.push({ cat: 'junk text', msg: 'empty text' });
  if (/tripped over/.test(text)) p.push({ cat: 'crash', msg: 'engine threw' });
  const junk = text.match(/\b(undefined|null|NaN|Infinity)\b|\[object Object\]|\{\{|\}\}/);
  if (junk) p.push({ cat: 'junk text', msg: `contains “${junk[0]}”` });
  if ((text.match(/\*\*/g) ?? []).length % 2) p.push({ cat: 'junk text', msg: 'unbalanced **' });
  if ((text.match(/`/g) ?? []).length % 2) p.push({ cat: 'junk text', msg: 'unbalanced backticks' });
  const bad = text.match(/\*\*\s*\*\*|“\s*”|\(\s*\)|`\s*`|\s[,.;:](?=\s|$)|[,;]\.|(?<!\.)\.\.(?![."])|^•\s*$|\*\*:\*\*|\s{3,}\S/m);
  if (bad) p.push({ cat: 'junk text', msg: `odd formatting “${bad[0]}”` });
  for (const line of text.split('\n')) {
    const open = (line.match(/\(/g) ?? []).length;
    if (open !== (line.match(/\)/g) ?? []).length) p.push({ cat: 'junk text', msg: `unbalanced parentheses in “${line.slice(0, 70)}”` });
  }
  // "javaScript", "postgreSQL": a capitalised name that got its first letter lowercased
  const source = JSON.stringify(t);
  const mangled = (text.match(/\b[a-z][a-z]*[A-Z][A-Za-z]*\b/g) ?? []).find((w) => source.includes(w.charAt(0).toUpperCase() + w.slice(1)) && !source.includes(w));
  if (mangled) p.push({ cat: 'junk text', msg: `mangled capitalisation “${mangled}”` });
  // "katran, the load balancer": a proper name (capitalised mid-sentence in the teardown's prose) shown lowercased
  const prose = JSON.stringify(t, (k, v) => (['id', 'from', 'to', 'file', 'path', 'url', 'code', 'html', 'nodeId', 'flowId'].includes(k) ? undefined : v));
  const lowered = (text.match(/(?:^|\n|: |\*\*: )([a-z][a-z]{3,})\b/g) ?? [])
    .map((m) => m.replace(/^[\s:*]+/, ''))
    .find((w) => new RegExp(`[a-z,;] ${w.charAt(0).toUpperCase()}${w.slice(1)}\\b`).test(prose) && !new RegExp(`\\b${w}\\b`).test(prose) && !new RegExp(`\\b${w}\\b`, 'i').test(turn.prompts.join(' ')));
  if (lowered) p.push({ cat: 'junk text', msg: `lowercased name “${lowered}”` });
  if (/Changed `[^`]+` is already/.test(text)) p.push({ cat: 'junk text', msg: '“Changed … is already”' });
  if (/is already/.test(text) && /It’s live in the Playground/.test(text) && !/\bto #|\bto \d/.test(text)) p.push({ cat: 'claims change', msg: 'says “live in the Playground” when nothing changed' });
  const sentences = text.split(/(?<=[.!?])\s+|\n/).map(norm).filter((s) => s.length > 25);
  const dup = sentences.find((s, i) => sentences.indexOf(s) !== i);
  if (dup) p.push({ cat: 'junk text', msg: `repeated sentence “${dup.slice(0, 50)}”` });
}

function checkActions(t: Teardown, turn: Turn, p: Problem[]) {
  const { reply, before } = turn;
  const tweaks = parseTweaks(before);
  const keys = new Set(keysOf(before));
  const changes = reply.actions.filter(isChange);
  if (changes.length && (reply.actions[0].type !== 'open_tab' || reply.actions[0].tab !== 'play')) p.push({ cat: 'invalid action', msg: 'change without open_tab play first' });
  const types = reply.actions.map((a) => `${a.type}:${JSON.stringify(a).slice(0, 60)}`);
  if (new Set(types).size !== types.length) p.push({ cat: 'invalid action', msg: 'duplicate actions' });
  let running = before;
  for (const a of reply.actions) {
    const bad = (msg: string) => p.push({ cat: 'invalid action', msg });
    switch (a.type) {
      case 'open_tab':
        if (!['story', 'stack', 'system', 'code', 'play', 'learn'].includes(a.tab)) bad(`bad tab ${a.tab}`);
        break;
      case 'highlight_node':
        if (!t.architecture.nodes.some((n) => n.id === a.nodeId)) bad(`bad node ${a.nodeId}`);
        break;
      case 'play_flow':
        if (!t.architecture.flows.some((f) => f.id === a.flowId)) bad(`bad flow ${a.flowId}`);
        break;
      case 'show_code':
        if (!t.code.some((c) => c.id === a.snippetId)) bad(`bad snippet ${a.snippetId}`);
        break;
      case 'open_stack_layer':
        if (!t.stack.some((l) => l.layer === a.layer)) bad(`bad layer ${a.layer}`);
        break;
      case 'show_concept':
        if (!t.concepts.some((c) => c.term === a.term)) bad(`bad concept ${a.term}`);
        break;
      case 'set_tweak': {
        const tw = tweaks.find((x) => x.name === a.name);
        if (!tw) {
          bad(`bad tweak ${a.name}`);
          break;
        }
        if (tw.type === 'color' && !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(a.value)) bad(`bad colour ${a.name}=${a.value}`);
        if (tw.type === 'range') {
          const n = parseFloat(a.value);
          if (!/^-?\d+(\.\d+)?px$/.test(a.value) || n < tw.min || n > tw.max) bad(`bad range ${a.name}=${a.value} (${tw.min}–${tw.max})`);
        }
        const res = setTweak(running, a.name, a.value);
        if (!res.line) bad(`tweak ${a.name} not writable`);
        running = res.code;
        break;
      }
      case 'edit_text': {
        if (!keys.has(a.key)) bad(`bad key ${a.key}`);
        if (!a.text.trim()) bad(`empty text for ${a.key}`);
        const res = setEditableText(running, a.key, a.text);
        if (!res.line) bad(`key ${a.key} not writable`);
        running = res.code;
        break;
      }
      case 'set_playground_code': {
        const broken = (msg: string) => p.push({ cat: 'broken code', msg });
        const doctype = before.match(/^\s*<!doctype html>/i)?.[0];
        if (doctype && !a.code.trimStart().toLowerCase().startsWith('<!doctype html>')) broken('lost doctype');
        const lines = tweakLines(before);
        const now = tweakLines(a.code);
        const lost = lines.filter((l) => !now.includes(l));
        if (lost.length) broken(`lost @tweak lines: ${lost.join(' | ')}`);
        const missingKeys = keysOf(before).filter((k) => !keysOf(a.code).includes(k));
        if (missingKeys.length) broken(`lost data-edit ${missingKeys.join(', ')}`);
        if (!/<\/html>\s*$/i.test(a.code) && /<\/html>\s*$/i.test(before)) broken('lost </html>');
        if ((a.code.match(/<script\b/g) ?? []).length !== (before.match(/<script\b/g) ?? []).length) broken('script count changed');
        if (!a.summary?.trim()) broken('no summary');
        running = a.code;
        break;
      }
      case 'reset_playground':
        running = t.playground.html;
        break;
      default:
        bad(`unknown action ${JSON.stringify(a)}`);
    }
  }
  // Claims vs actions
  const says = /^(changed|done|added|restored|renamed|updated)\b|\b(changed|added) (the|a|`)/i.test(reply.text);
  if (says && !changes.length && !/already/i.test(reply.text)) p.push({ cat: 'claims change', msg: 'text claims a change but no change action' });
  if (changes.length && !/(changed|added|restored|back to|reset|already|font size|edited|→)/i.test(reply.text)) p.push({ cat: 'claims change', msg: 'change action but text does not describe it' });
}

function checkSuggestions(turn: Turn, p: Problem[]) {
  const s = turn.reply.suggestions;
  if (s.length < 2 || s.length > 4) p.push({ cat: 'suggestions', msg: `${s.length} suggestions` });
  if (s.some((x) => !x.trim())) p.push({ cat: 'suggestions', msg: 'empty suggestion' });
  if (new Set(s.map(norm)).size !== s.length) p.push({ cat: 'suggestions', msg: `duplicate suggestions: ${s.join(' | ')}` });
  if (s.some((x) => norm(x) === norm(turn.prompt))) p.push({ cat: 'suggestions', msg: 'suggestion repeats the prompt' });
  const long = s.find((x) => x.length > 70);
  if (long) p.push({ cat: 'suggestions', msg: `suggestion too long: ${long}` });
  const junk = s.find((x) => /undefined|null|NaN|\[object/.test(x));
  if (junk) p.push({ cat: 'suggestions', msg: `junk suggestion: ${junk}` });
}

/** Technologies worth checking: if the reply names one, the teardown (or the user) must have mentioned it. */
const TECH = [
  'MongoDB', 'MySQL', 'PostgreSQL', 'Postgres', 'Redis', 'Cassandra', 'ScyllaDB', 'DynamoDB', 'Firebase', 'Firestore', 'Supabase', 'Kubernetes',
  'Docker', 'AWS', 'Amazon Web Services', 'Google Cloud', 'Azure', 'Heroku', 'Vercel', 'Netlify', 'Cloudflare', 'Kafka', 'RabbitMQ', 'Celery',
  'React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Django', 'Flask', 'Rails', 'Laravel', 'Spring Boot', 'Node.js', 'PHP', 'Python', 'Java',
  'Kotlin', 'Swift', 'Rust', 'Elixir', 'Erlang', 'C++', 'TypeScript', 'JavaScript', 'Scala', 'Ruby', 'GraphQL', 'gRPC', 'Thrift', 'Elasticsearch',
  'Memcached', 'Spark', 'Hadoop', 'PyTorch', 'TensorFlow', 'WebRTC', 'WebSocket', 'Electron', 'Flutter', 'React Native', 'nginx', 'Terraform',
  'Jenkins', 'Sentry', 'Stripe', 'Twilio', 'OpenAI', 'BigQuery', 'Airflow', 'Go', 'Dart', 'C#', '.NET', 'Snowflake', 'Oracle',
];

const techRe = (name: string) =>
  name === 'Java'
    ? /\bJava\b(?!Script)/
    : name === 'Go'
      ? /\bGo\b(?! Bobcats| Cats| ahead)(?=[\s,.)]|$)(?<![.!?]\s*Go)/
      : name === 'React'
        ? /\bReact\b/
        : new RegExp(`(^|[^A-Za-z0-9])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9])`, 'i');

/** Within two letter edits (swaps count as one). */
function closeTo(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 2) return false;
  const d = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length] <= 2;
}

function checkGrounding(t: Teardown, turn: Turn, p: Problem[]) {
  const source = `${JSON.stringify(t)} ${turn.before}`;
  const lowerSource = source.toLowerCase();
  const said = turn.prompts.join(' ').toLowerCase();
  const text = turn.reply.text;
  for (const name of TECH) {
    const re = techRe(name);
    if (!re.test(text)) continue;
    const inSource = name === 'Go' ? /\bGo\b(?!\w)/.test(JSON.stringify(t)) : re.test(source) || lowerSource.includes(name.toLowerCase());
    // The user may have typed it with a typo ("kubrenetes"): that still counts as the user saying it
    const typed = said.includes(name.toLowerCase()) || (name.length >= 6 && said.split(/[^a-z0-9.+#]+/).some((w) => w.length >= 5 && w[0] === name[0].toLowerCase() && closeTo(w, name.toLowerCase())));
    if (!inSource && !typed) p.push({ cat: 'ungrounded', msg: `mentions ${name}, which isn’t in the teardown` });
  }
  for (const m of text.matchAll(/\b(1[89]\d\d|20\d\d)\b/g)) {
    if (!source.includes(m[1]) && !said.includes(m[1])) p.push({ cat: 'ungrounded', msg: `year ${m[1]} isn’t in the teardown` });
  }
  for (const m of text.matchAll(/(\d+(?:\.\d+)?)\s*%/g)) {
    if (!t.languages.some((l) => String(l.share) === m[1]) && !source.includes(`${m[1]}%`)) p.push({ cat: 'ungrounded', msg: `${m[1]}% isn’t in the teardown` });
  }
  for (const m of text.matchAll(/\$\s?\d[\d,.]*\s*(?:[bmk]|billion|million)?/gi)) {
    if (!source.includes(m[0].trim())) p.push({ cat: 'ungrounded', msg: `money figure ${m[0]} isn’t in the teardown` });
  }
  // Every quoted thing it says we changed must be something the user asked for or already in the code
  for (const m of text.matchAll(/\bto “([^”]+)”/g)) {
    if (!said.includes(m[1].toLowerCase()) && !turn.after.toLowerCase().includes(m[1].toLowerCase())) p.push({ cat: 'ungrounded', msg: `invented value “${m[1]}”` });
  }
}

/* ------------------------------------------------------------------ */
/* Expectations                                                        */
/* ------------------------------------------------------------------ */

type Expect = (turn: Turn) => string | null;

const describe = (r: AgentReply) =>
  r.actions
    .map((a) => {
      const o = a as unknown as Record<string, string>;
      return `${a.type}${o.nodeId ? `:${o.nodeId}` : ''}${o.flowId ? `:${o.flowId}` : ''}${o.snippetId ? `:${o.snippetId}` : ''}${o.layer ? `:${o.layer}` : ''}${o.term ? `:${o.term}` : ''}${o.name ? `:${o.name}=${o.value}` : ''}${o.key ? `:${o.key}="${o.text}"` : ''}${o.tab ? `:${o.tab}` : ''}`;
    })
    .join(', ') || 'no actions';

const all =
  (...xs: Expect[]): Expect =>
  (turn) =>
    xs.map((x) => x(turn)).find(Boolean) ?? null;

const any =
  (...xs: Expect[]): Expect =>
  (turn) => {
    const errs = xs.map((x) => x(turn));
    return errs.some((e) => e === null) ? null : errs.join(' OR ');
  };

const act =
  (type: AgentAction['type'], field?: string, value?: string): Expect =>
  ({ reply }) =>
    reply.actions.some((a) => a.type === type && (!field || (a as unknown as Record<string, string>)[field] === value)) ? null : `expected ${type}${field ? ` ${field}=${value}` : ''}, got [${describe(reply)}]`;

const tweak =
  (name: string, value?: string): Expect =>
  (turn) => {
    const hit = turn.reply.actions.find((a) => a.type === 'set_tweak' && a.name === name);
    if (!hit || hit.type !== 'set_tweak') return `expected set_tweak ${name}${value ? `=${value}` : ''}, got [${describe(turn.reply)}]`;
    return !value || hit.value.toLowerCase() === value.toLowerCase() ? null : `${name}=${hit.value}, expected ${value}`;
  };

const edit =
  (key: string, text: string): Expect =>
  ({ reply }) => {
    const hit = reply.actions.find((a) => a.type === 'edit_text');
    if (!hit || hit.type !== 'edit_text') return `expected edit_text ${key}="${text}", got [${describe(reply)}]`;
    return hit.key === key && hit.text === text ? null : `edited ${hit.key}="${hit.text}", expected ${key}="${text}"`;
  };

const codeHas =
  (needle: string | RegExp): Expect =>
  ({ after }) =>
    (typeof needle === 'string' ? after.includes(needle) : needle.test(after)) ? null : `code missing ${needle}`;

const changed: Expect = ({ reply }) => (reply.actions.some(isChange) ? null : `expected a change, got [${describe(reply)}]`);
const unchanged: Expect = ({ reply }) => (reply.actions.some(isChange) ? `expected no change, got [${describe(reply)}]` : null);
const noActions: Expect = ({ reply }) => (reply.actions.filter((a) => a.type !== 'open_tab').length ? `expected no pointing actions, got [${describe(reply)}]` : null);

const says =
  (...needles: string[]): Expect =>
  ({ reply }) =>
    needles.map((n) => (reply.text.toLowerCase().includes(n.toLowerCase()) ? null : `reply missing “${n}”`)).find(Boolean) ?? null;

const saysAny =
  (...needles: string[]): Expect =>
  ({ reply }) =>
    needles.some((n) => reply.text.toLowerCase().includes(n.toLowerCase())) ? null : `reply has none of ${needles.map((n) => `“${n}”`).join(', ')}`;

const lacks =
  (...needles: string[]): Expect =>
  ({ reply }) =>
    needles.map((n) => (reply.text.toLowerCase().includes(n.toLowerCase()) ? `reply should not say “${n}”` : null)).find(Boolean) ?? null;

/** Honest "that isn't in this teardown" answer that doesn't touch the playground. */
const honest = all(unchanged, saysAny('doesn’t', 'couldn’t', 'won’t', 'isn’t', 'not in', 'only answer', 'no ', 'can’t'));
/** Off-topic: politely redirect, never pretend to do it, never point at random parts of the teardown. */
const offTopic = all(honest, noActions, lacks('not sure how to do that', 'Changed'));

/* ------------------------------------------------------------------ */
/* Scripts                                                             */
/* ------------------------------------------------------------------ */

interface StepOpts {
  /** Minimum words (default 40 for questions, 8 for changes) */
  min?: number;
}
type Step = string | [string, Expect?, StepOpts?];

interface Script {
  name: string;
  t: Teardown;
  tab?: TabKey;
  steps: Step[];
}

const LONG =
  'ok so i have this project for my cs 1428 class at txst and my professor said we should look at how real apps are built so i picked instagram because i use it every single day and i was wondering like, when i scroll through my feed and see all the photos from my friends and the ads and the reels, where does all of that actually get stored, like what databse do they use and is it one big computer somewhere or lots of them? '.repeat(2);

const scripts: Script[] = [
  {
    name: 'instagram questions',
    t: instagram,
    steps: [
      ['whats instgram built with', all(says('Django'), act('open_tab', 'tab', 'stack'))],
      ['what databse does it use', says('PostgreSQL')],
      ['why?', saysAny('PostgreSQL', 'Cassandra')],
      ['show me', any(act('open_stack_layer', 'layer', 'Data'), act('highlight_node', 'nodeId', 'postgres')), { min: 25 }],
      ['how does it work', act('open_tab', 'tab', 'system')],
      ['what happens when i like a pic', act('play_flow', 'flowId', 'like-post')],
      ['whats sharding', act('show_concept', 'term', 'Sharding')],
      'explain it like im 5',
      ['who made instagram', says('Kevin Systrom')],
      ['who is the ceo', lacks('Mosseri')],
      ['how much money does instagram make', all(honest, lacks('Instagram Direct'))],
      ['does instagram use mongodb', all(honest, says('mongodb'))],
      ['does it use kubernetes', all(honest, says('kubernetes'))],
      ['is it on aws', says('Amazon Web Services')],
      ['what language is it in', says('Python')],
      ['show me the python', act('show_code', 'snippetId', 'django-like-view')],
      ['what is tiktok built with', all(says('Instagram'), unchanged, lacks('How Instagram is built'))],
      ['whats the weather', offTopic],
      ['write my essay', offTopic],
      ['thx', undefined, { min: 10 }],
      ['wats the tech stack', says('Django')],
      ['whos the ceo of instagram', all(says('doesn’t say'), lacks('Mosseri'))],
      ['what does LIKELY mean', says('LIKELY')],
      ['whats a load balancer', any(act('highlight_node', 'nodeId', 'load-balancer'), act('show_concept', 'term', 'Load balancer'))],
      ['how many users does it have', says('3 billion')],
      ['is it made with ai', undefined],
      ['', undefined],
      ['???', undefined],
      ['asdfghjkl', honest],
      [LONG, saysAny('PostgreSQL', 'Cassandra')],
      ['<script>alert(1)</script>', unchanged],
      ['lol', undefined, { min: 10 }],
      ['how do u get the photos to load so fast', saysAny('CDN', 'Memcached', 'cache')],
      ['wat is a cdn', saysAny('CDN', 'content delivery')],
      ['is this legit or did u make it up', says('hand-checked')],
      ['how would i make my own', act('open_tab', 'tab', 'learn')],
    ],
  },
  {
    name: 'instagram changes',
    t: instagram,
    tab: 'play',
    steps: [
      ['can u make the button red', tweak('--brand', '#E53935')],
      ['dark mode pls', all(tweak('--bg', '#0F1115'), tweak('--text', '#F2F4F7'))],
      ['make it bigger', changed],
      ['rename the title to Hello Bobcats', edit('app-name', 'Hello Bobcats')],
      ['make corners round', tweak('--radius', '32px')],
      ['make the text white', tweak('--text', '#FFFFFF')],
      ['add menu item Events', all(unchanged, act('open_tab', 'tab', 'play'))],
      ['#ff00ff', tweak('--brand', '#FF00FF')],
      ['make the background #0a0a0a', tweak('--bg', '#0A0A0A')],
      ['make the brand color #12', all(unchanged, says('#12'), saysAny('hex', 'isn’t a colour'))],
      ['set the avatar to 9999px', tweak('--avatar', '56px')],
      ['make the caption say Go Cats!', edit('caption', 'Go Cats!')],
      ['change username to bobcat_life', edit('username', 'bobcat_life')],
      ['MAKE IT PURPLE!!!', tweak('--brand', '#7C3AED')],
      ['undo', act('reset_playground')],
      ['make it look like spotify', tweak('--brand', '#1DB954')],
      ['change the title to <b>hi</b>', edit('app-name', '<b>hi</b>')],
      ['change the title to', all(unchanged, says('to what'))],
      ['make the photo corners 12', tweak('--radius', '12px')],
      ['make it pop', all(changed, says('reset'))],
      ['remove the caption', unchanged],
      ['make the heart pink', tweak('--brand', '#EC4899')],
      ['start over', act('reset_playground')],
    ],
  },
  {
    name: 'netflix questions',
    t: netflix,
    steps: [
      ['how does netflix stream vidoes', any(act('play_flow', 'flowId', 'press-play'), says('Open Connect'))],
      ['what happens when i press play', act('play_flow', 'flowId', 'press-play')],
      'why?',
      ['whats chaos monkey', says('Chaos Monkey')],
      ['does netflix use aws', says('Amazon Web Services')],
      ['what is netflix written in', says('Java')],
      ['show me the java code', act('show_code', 'snippetId', 'playback-endpoint')],
      ['what database does netflix use', says('Cassandra')],
      ['who started netflix', says('Reed Hastings')],
      ['how many subscribers does it have', all(says('300M'), lacks('subscription model'))],
      ['netflx database', says('Cassandra')],
      ['what does zuul do', act('highlight_node', 'nodeId', 'zuul')],
      ['is netflix fast', saysAny('Open Connect', 'EVCache', 'cache')],
      ['how does the recomendation algorithm work', any(act('play_flow', 'flowId', 'recommend-show'), act('highlight_node', 'nodeId', 'recs-engine'))],
      ['whats the weather in san marcos', offTopic],
      ['write me a poem about netflix', offTopic],
      ['does netflix use mongodb', honest],
      ['tell me more', undefined],
      ['what is spotify built with', all(says('Netflix'), unchanged, lacks('How Netflix is built'))],
    ],
  },
  {
    name: 'netflix changes',
    t: netflix,
    tab: 'play',
    steps: [
      ['make the hero taller', tweak('--hero-height', '416px')],
      ['make it bigger', tweak('--hero-height', '440px')],
      ['even bigger', all(unchanged, says('maximum'))],
      ['change the title to Stranger Bobcats', edit('hero-title', 'Stranger Bobcats')],
      ['light mode', all(tweak('--bg'), lacks('stay dark'))],
      ['make the cards rounder', tweak('--card-radius', '24px')],
      ['set the gap to 50px', tweak('--gap', '20px')],
      ['make the button blue', unchanged],
      ['make the logo white', tweak('--brand', '#FFFFFF')],
      ['set hero height to 100', tweak('--hero-height', '220px')],
      ['change the description to A show about bobcats', edit('hero-desc', 'A show about bobcats')],
      ['rename trending now to Hot at TXST', edit('row-1', 'Hot at TXST')],
      ['wider cards', tweak('--card-width')],
      ['make it red again', tweak('--brand', '#E53935')],
    ],
  },
  {
    name: 'discord',
    t: discord,
    steps: [
      ['how do messages get sent', act('play_flow', 'flowId', 'send-message')],
      ['whats elixir', says('Elixir')],
      ['why does discord use rust', says('Rust')],
      'tell me more',
      ['what is a websocket', act('show_concept', 'term', 'WebSocket')],
      ['how does voice chat work', act('play_flow', 'flowId', 'join-voice')],
      ['show me the code', act('show_code')],
      ['what about the database', says('ScyllaDB')],
      ['is discord secure', undefined],
      ['does discord use python', says('Python')],
      ['does discord use java', honest],
      ['who founded discord', says('Jason Citron')],
      ['ok', undefined, { min: 10 }],
      ['discrod rust', says('Rust')],
      ['how r messages stored', says('ScyllaDB')],
      ['how would u build discord', act('open_tab', 'tab', 'learn')],
      ['show me the code for sending a message', act('show_code', 'snippetId', 'create-message-api')],
      ['change the channel name to bobcats', edit('channel', 'bobcats')],
      ['rename the server to TXST CS Club', edit('server', 'TXST CS Club')],
      ['make the sidebar maroon', tweak('--rail', '#501214')],
      ['light mode', all(tweak('--bg', '#FFFFFF'), tweak('--text', '#111111'))],
      ['make the avatars smaller', tweak('--avatar', '27px')],
      ['make the text yellow', tweak('--text', '#FACC15')],
      ['set the topic to Study group tonight at 7', edit('topic', 'Study group tonight at 7')],
      ['make the welcome message say Hey Bobcats', edit('welcome', 'Hey Bobcats')],
      ['make the send button green', tweak('--brand', '#22C55E')],
    ],
  },
  {
    name: 'facebook',
    t: facebook,
    steps: [
      ['who founded facebook', says('Zuckerberg')],
      ['what is tao', says('TAO')],
      ['whats graphql', all(says('GraphQL'), lacks('no GraphQL'), ({ reply }) => (reply.actions.some((a) => a.type === 'open_tab' && a.tab === 'code') ? 'jumped to the code tab' : null))],
      ['how does the news feed work', act('play_flow', 'flowId', 'open-feed')],
      ['does facebook use php', saysAny('Hack', 'PHP')],
      ['is facebook written in java', says('Java')],
      ['how does facebook make money', all(honest, lacks('Like button', 'launches at Harvard'))],
      ['what\'s the capital of france', offTopic],
      ['what is react', says('React')],
      ['make the brand blue darker', all(tweak('--brand'), ({ reply }) => (reply.actions.some((a) => a.type === 'set_tweak' && a.name === '--bg') ? 'switched the background instead' : null))],
      ['make the cards square', tweak('--radius', '0px')],
      ['change the post text to Hello Bobcats', edit('post-text', 'Hello Bobcats')],
      ['change my name to Boko the Bobcat', edit('name', 'Boko the Bobcat')],
      ['make the photo purple', tweak('--photo', '#7C3AED')],
      ['dark mode', all(tweak('--bg', '#0F1115'), tweak('--text', '#F2F4F7'), tweak('--card', '#1C1F26'))],
      ['make the cards black', tweak('--card', '#000000')],
      ['bigger avatar', tweak('--avatar', '52px')],
      ['make the logo say TXSTbook', edit('app-name', 'TXSTbook')],
      ['make the like button orange', tweak('--brand', '#F97316')],
    ],
  },
  {
    name: 'txst site playground',
    t: txst,
    tab: 'play',
    steps: [
      ['change the headline to Welcome Bobcats', edit('headline', 'Welcome Bobcats')],
      ['rename the title to Hello Bobcats', edit('headline', 'Hello Bobcats')],
      ['add menu item Events', all(act('set_playground_code'), codeHas('<button class="navlink">Events</button>'))],
      ['add a nav link for Parking', codeHas('<button class="navlink">Parking</button>')],
      ['make the button gold', tweak('--accent', '#8D734A')],
      ['make the header maroon', tweak('--brand', '#501214')],
      ['make corners round', tweak('--radius', '28px')],
      ['make it bigger', undefined, { min: 15 }],
      ['change the button text to Apply Now', edit('cta', 'Apply Now')],
      ['change the footer text to Go Cats', edit('footer', 'Go Cats')],
      ['make the intro say We are Texas State', edit('intro', 'We are Texas State')],
      ['can you make the site name TXST', edit('site-name', 'TXST')],
      ['dark mode pls', all(tweak('--bg', '#0F1115'), tweak('--text', '#F2F4F7'))],
      ['what can i change', says('--brand')],
      ['remove the footer', unchanged],
      ['reset', act('reset_playground')],
      ['what is this site built with', says('Cloudflare')],
      ['who made this', honest],
      ['how does login work', act('play_flow', 'flowId', 'school-login')],
      ['add a section called Campus Map', codeHas('<h2>Campus Map</h2>')],
      ['spacing 24', tweak('--space', '24px')],
      ['add a menu item called "Bobcat Days"', codeHas('<button class="navlink">Bobcat Days</button>')],
      ['make the menu button text Menu', edit('cta', 'Menu')],
      ['can u add a link called Library', codeHas('<button class="navlink">Library</button>')],
      ['make the corners 99', tweak('--radius', '28px')],
      ['make the background a bit darker', tweak('--bg')],
      ['make the header navy', tweak('--brand', '#1E3A8A')],
      ['reset the brand color', tweak('--brand')],
      ['change "Get the app" to "Download TXST Mobile"', edit('section-1', 'Download TXST Mobile')],
    ],
  },
  {
    name: 'no-scan web app',
    t: zorblat,
    steps: [
      ['what is zorblat', act('open_tab', 'tab', 'story')],
      ['whats it built with', says('LIKELY')],
      ['who founded it', honest],
      ['is this real', says('instant')],
      ['does it use react', honest],
      ['how do users sign up', act('play_flow', 'flowId', 'sign-up')],
      ['what databse', says('PostgreSQL')],
      ['make it green', tweak('--brand', '#22C55E')],
      ['change the greeting to Hi Bobcats', edit('greeting', 'Hi Bobcats')],
      ['make the corners sharp', tweak('--radius', '0px')],
      ['add menu item Events', unchanged],
      ['more spacing', tweak('--space', '16px')],
      ['what happens when i upload a photo', act('play_flow', 'flowId', 'upload-photo')],
      ['how much does it cost', honest],
      ['what year was it founded', honest],
      ['dark mode', tweak('--bg')],
      ['make the title bigger', changed],
      ['who uses it', honest],
      ['is it free', honest],
      ['make the background darker', tweak('--bg')],
      ['make it lighter', tweak('--bg', '#FFFFFF')],
    ],
  },
  {
    name: 'cold follow-ups (no context)',
    t: instagram,
    steps: [['make it bigger', undefined, { min: 15 }]],
  },
  { name: 'cold why', t: netflix, steps: [['why?', says('Ask me something first')]] },
  { name: 'cold show me', t: discord, steps: [['show me', says('Ask me something first')]] },
  { name: 'whats elixir', t: discord, steps: [['whats elixir', all(says('Elixir'), ({ reply }) => (reply.actions.some((a) => a.type === 'show_code') ? 'jumped to code instead of explaining' : null))]] },
  { name: 'chained follow-ups', t: facebook, steps: [['what is tao', act('highlight_node', 'nodeId', 'tao')], ['why?', undefined], ['show me', act('highlight_node', 'nodeId', 'tao'), { min: 25 }]] },
  { name: 'cold how does it work', t: zorblat, steps: [['how does it work', act('open_tab', 'tab', 'system')]] },
  { name: 'emoji spam', t: facebook, steps: [['🔥🔥🔥', undefined, { min: 20 }]] },
  {
    name: 'curveballs',
    t: instagram,
    steps: [
      ['how is instagram different from tiktok', all(unchanged, says('TikTok isn’t part of this teardown'))],
      ['is instagram owned by facebook', says('Meta')],
      ['give me a fun fact', all(unchanged, saysAny('Django', '20'))],
      ['quiz me', all(unchanged, says('quiz'))],
      ['are you chatgpt', all(unchanged, says('Ask Teardown'), lacks('how ChatGPT is built'))],
      ['can you hear me', undefined, { min: 20 }],
      ['hello??', undefined],
      ['what am i looking at', undefined],
      ['turn the brand color to #zzzzzz', all(unchanged, says('#zzzzzz'))],
      ['make it rgb(255,0,0)', tweak('--brand', '#FF0000')],
      ['make the title say ' + 'Bobcats '.repeat(30), ({ reply }) => (reply.actions.some((a) => a.type === 'edit_text' && a.text.length <= 120) ? null : 'expected a clipped edit_text')],
      ['change the caption to 😀', edit('caption', '😀')],
      ['make the font comic sans', unchanged],
      ['translate this to spanish', unchanged],
      ['explain the code', act('show_code')],
      ['what is a queue', saysAny('queue', 'Queue')],
      ['how does it scale to billions of users', undefined],
      ['whats the difference between postgres and cassandra', says('PostgreSQL', 'Cassandra')],
      ['sql vs nosql', undefined],
      ['memcached or redis', says('Memcached', 'Redis')],
      ['can i sign in with google', lacks('how Google is built')],
      ['does it use google cloud', all(lacks('how Google is built'), saysAny('doesn’t mention', 'Google Cloud'))],
      ['is it better than youtube', says('YouTube isn’t part of this teardown')],
      ['how does youtube work', says('YouTube')],
      ['its cool', unchanged],
      ['how can i make my app better', unchanged],
      ['discard my changes', act('reset_playground')],
      ['make the backround purpel', tweak('--bg', '#7C3AED')],
      ['make the coners roundr', tweak('--radius', '32px')],
    ],
  },
  { name: 'uppercase question', t: netflix, steps: [['WHAT DATABASE DOES NETFLIX USE', says('Cassandra')]] },
  { name: 'hex on txst', t: txst, tab: 'play', steps: [['#501214', tweak('--brand', '#501214')]] },
  { name: 'txst colours', t: txst, tab: 'play', steps: [['make it txst colors', all(tweak('--brand', '#501214'), tweak('--accent', '#8D734A'))]] },
];

/* ------------------------------------------------------------------ */
/* Run                                                                 */
/* ------------------------------------------------------------------ */

const verbose = process.argv.includes('--verbose');
const failures = new Map<Category, string[]>();
let prompts = 0;
let failedPrompts = 0;
const out: string[] = [];

const FALLTHROUGH = /couldn’t find anything|Still nothing about that|not sure how to do that|tripped over|Nothing to change|already at its (maximum|minimum)|nothing to (show|go deeper on) yet/;

for (const script of scripts) {
  const s = new Session(script.t, script.tab);
  for (const step of script.steps) {
    const [prompt, expect, opts] = typeof step === 'string' ? [step, undefined, undefined] : step;
    const turn = s.ask(prompt);
    prompts++;
    const problems: Problem[] = [];
    const prevReply = s.messages.length >= 4 ? s.messages[s.messages.length - 3].text : '';
    checkText(script.t, turn, problems);
    if (prevReply && prevReply === turn.reply.text) problems.push({ cat: 'repeat', msg: 'same reply as the previous turn' });
    checkActions(script.t, turn, problems);
    checkSuggestions(turn, problems);
    checkGrounding(script.t, turn, problems);
    const isChangeReply = turn.reply.actions.some(isChange) || turn.reply.actions.some((a) => a.type === 'open_tab' && a.tab === 'play');
    const n = wordCount(turn.reply.text);
    const min = opts?.min ?? (isChangeReply ? 8 : 40);
    if (n < min || n > 160) problems.push({ cat: 'length', msg: `${n} words` });
    const err = expect?.(turn);
    if (err) problems.push({ cat: 'expectation', msg: err });
    // Tapping a suggestion must never dead-end
    for (const sug of turn.reply.suggestions) {
      const next = s.clone().ask(sug);
      if (FALLTHROUGH.test(next.reply.text)) problems.push({ cat: 'dead-end suggestion', msg: `“${sug}” → ${next.reply.text.slice(0, 60)}…` });
    }
    if (problems.length) failedPrompts++;
    for (const pr of problems) {
      const list = failures.get(pr.cat) ?? [];
      list.push(`[${script.name}] “${prompt.slice(0, 60)}${prompt.length > 60 ? '…' : ''}”: ${pr.msg}`);
      failures.set(pr.cat, list);
    }
    if (problems.length || verbose) {
      out.push(`${problems.length ? '✗' : '✓'} [${script.name}] “${prompt.slice(0, 80)}”${problems.length ? `\n    ✗ ${problems.map((pr) => `${pr.cat}: ${pr.msg}`).join('\n    ✗ ')}` : ''}`);
      out.push(`    actions: ${describe(turn.reply)}\n    ${turn.reply.text.replace(/\n/g, '\n    ')}\n    suggestions: ${turn.reply.suggestions.join(' | ')}`);
    }
  }
}

/* ---------- fuzz: the same prompts, mangled the way people really type ---------- */

let seed = 1428;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const MUTATIONS: ((s: string) => string)[] = [
  (s) => s.toLowerCase().replace(/[?.!,']/g, ''),
  (s) => { const i = 1 + Math.floor(rand() * (s.length - 2)); return s.slice(0, i) + s.slice(i + 1); },
  (s) => { const i = 1 + Math.floor(rand() * (s.length - 3)); return s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2); },
  (s) => s.toUpperCase(),
  (s) => `${s} pls`,
  (s) => `lol ${s.toLowerCase()}`,
  (s) => `${s}???`,
  (s) => s.replace(/\byou\b/gi, 'u').replace(/\bwhat is\b/gi, 'whats'),
];
const BASE = [
  'What database does it use?', 'How does it work?', 'Who founded it?', 'What language is it written in?', 'Show me the code', 'Make the corners rounder',
  'Switch to dark mode', 'Make the brand color maroon', 'Change the title to Hello Bobcats', 'Add a menu item called Events', 'What happens when I open the app?',
  'Is it secure?', 'How do you know this?', 'Make the text bigger', 'Tell me more', 'What is a CDN?', 'How do I build my own?', 'Reset the playground',
  'Make it look like Spotify', 'What does the load balancer do?', 'Does it use Kubernetes?', 'How many users does it have?', 'Make the background white',
];
let fuzzRuns = 0;
let fuzzFailed = 0;
for (const t of [instagram, netflix, discord, facebook, txst, zorblat]) {
  for (const base of BASE) {
    for (const mutate of MUTATIONS) {
      const s = new Session(t, 'play');
      s.ask('What happens when you open the app?');
      const prompt = mutate(base);
      const turn = s.ask(prompt);
      fuzzRuns++;
      const problems: Problem[] = [];
      checkText(t, turn, problems);
      checkActions(t, turn, problems);
      checkSuggestions(turn, problems);
      checkGrounding(t, turn, problems);
      const n = wordCount(turn.reply.text);
      if (n < 8 || n > 160) problems.push({ cat: 'length', msg: `${n} words` });
      if (problems.length) {
        fuzzFailed++;
        for (const pr of problems) {
          const list = failures.get(pr.cat) ?? [];
          list.push(`[fuzz ${t.id}] “${prompt}”: ${pr.msg}`);
          failures.set(pr.cat, list);
        }
        out.push(`✗ [fuzz ${t.id}] “${prompt}”\n    ✗ ${problems.map((pr) => `${pr.cat}: ${pr.msg}`).join('\n    ✗ ')}\n    ${turn.reply.text.replace(/\n/g, '\n    ')}`);
      }
    }
  }
}

console.log(out.join('\n'));
console.log(`\n${prompts} scripted prompts across ${new Set(scripts.map((sc) => sc.t.id)).size} teardowns: ${prompts - failedPrompts} clean, ${failedPrompts} with problems`);
console.log(`${fuzzRuns} fuzzed prompts: ${fuzzRuns - fuzzFailed} clean, ${fuzzFailed} with problems`);
for (const [cat, list] of failures) console.log(`  ${cat}: ${list.length}`);
if (failedPrompts || fuzzFailed) process.exit(1);
