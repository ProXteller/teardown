/**
 * Offline "Ask Teardown" engine: instant, rule-based and grounded ONLY in the teardown data.
 * Same contract as the Claude agent (see ./types.ts). Pure: no network, no React, no randomness.
 *
 * Routing: follow-ups ("show me", "make it bigger") → playground changes → questions → search fallback.
 */

import type { ArchNode, CodeSample, Flow, StackLayer, Teardown } from '@/data/types';
import { parseTweaks, setEditableText, setTweak, type Tweak } from '@/lib/playground';

import type { AgentAction, AgentReply, AgentRequest } from './types';

/* ------------------------------------------------------------------ */
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */

const STOP = new Set(
  (
    'a an the i me my mine you your yours it its it\'s this that these those is are was were be been being am to of in on for and or ' +
    'what whats how why when where who whom whose which does do did doing done can could would should will shall may might must ' +
    'about tell show explain please pls with from at by as so if then there their they them we our us get gets got much many just ' +
    'really very some any all into out up down over also too than thing things stuff kind sort lot bit mean means one ok okay hey ' +
    'happen happens happened work works working use uses used using make makes made app apps website site product let lets want ' +
    'know like\'d say see look give need thanks thank more most other each every here now actually basically'
  ).split(/\s+/),
);

/** Very small stemmer so "posting", "posted" and "posts" all match "post". */
function stem(word: string) {
  let w = word;
  if (w.length <= 3) return w;
  if (w.endsWith('ations') && w.length > 10) w = w.slice(0, -6);
  else if (w.endsWith('ation') && w.length > 9) w = w.slice(0, -5);
  else if (w.endsWith('ies') && w.length > 4) w = `${w.slice(0, -3)}y`;
  else if (w.endsWith('ing') && w.length > 5) w = w.slice(0, -3);
  else if (w.endsWith('ed') && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith('es') && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) w = w.slice(0, -1);
  if (w.length > 3 && w.endsWith('e')) w = w.slice(0, -1);
  if (w.length > 3 && /([b-df-hj-km-np-rtv-z])\1$/.test(w) && !/(ll|ss|zz)$/.test(w)) w = w.slice(0, -1);
  return w;
}

/** "log in", "signing in" → "login" and "sign up" → "signup", so both spellings match. */
const joinPhrasalVerbs = (s: string) =>
  s.replace(/\b(?:log|logs|logged|logging|sign|signs|signed|signing)[ -]?(?:in|on)\b/g, 'login').replace(/\b(?:sign|signs|signed|signing)[ -]?up\b/g, 'signup');

const words = (s: string) => joinPhrasalVerbs(s.toLowerCase().replace(/[’']/g, '')).match(/[a-z0-9+#]+/g) ?? [];

function tokens(s: string, extraStop?: Set<string>) {
  return words(s)
    .filter((w) => !STOP.has(w) && !(extraStop?.has(w)) && (w.length > 1 || /\d/.test(w)))
    .map(stem);
}

const tokenSet = (s: string) => new Set(tokens(s));

/** Weighted overlap of query tokens with a field. */
function overlap(q: string[], field: string, weight: number) {
  if (!field) return 0;
  const set = tokenSet(field);
  let score = 0;
  for (const t of new Set(q)) if (set.has(t)) score += weight;
  return score;
}

const norm = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

const countWords = (s: string) => (s.match(/\S+/g) ?? []).length;

function firstSentence(s: string, maxWords = 22) {
  const one = s.replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s/)[0];
  return clipWords(one, maxWords);
}

/** The first clause of a sentence, for compact step lists. */
function shortClause(s: string, maxWords: number) {
  const sentence = s.replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s/)[0].replace(/[.!?]$/, '');
  const lead = /^(when|whenever|after|before|once|if|while|as|every|each|thanks|using|next|then|now|meanwhile|instead|on|in|at|by|with|within|for|from|during|behind|because|since|so|finally|first|later)\b/i;
  const parts = sentence.split(/,\s|;\s|:\s|\s—\s/);
  // "Every night, a job copies…" skips the lead-in; "Katran, the load balancer, passes…" keeps the whole sentence
  const clause = lead.test(parts[0])
    ? (parts.slice(1).find((c) => countWords(c) >= 4 && !lead.test(c)) ?? sentence)
    : countWords(parts[0]) >= 4 ? parts[0] : sentence;
  return clipWords(balanceParens(clause), maxWords);
}

/** Cuts off a trailing "(unfinished aside" so clipped text never shows a dangling bracket. */
function balanceParens(s: string) {
  let out = s;
  while ((out.match(/\(/g) ?? []).length > (out.match(/\)/g) ?? []).length) {
    const cut = out.lastIndexOf('(');
    const trimmed = out.slice(0, cut).replace(/[\s,;:—-]+$/, '');
    out = trimmed === out ? out.replace('(', '') : trimmed;
  }
  return out;
}

function clipWords(s: string, max: number) {
  const list = s.replace(/\s+/g, ' ').trim().split(' ');
  if (list.length <= max) return list.join(' ');
  const clipped = balanceParens(list.slice(0, max).join(' ')).replace(/[,;:.]$/, '');
  return `${clipped}…`;
}

/** Names that stay capitalised at the start of a clause ("Python for data work", not "python for data work"). */
const PROPER =
  /^(Python|Java|JavaScript|TypeScript|Swift|Kotlin|Go|Rust|Elixir|Erlang|Ruby|Scala|Django|Rails|React|Redis|Apache|Amazon|Google|Microsoft|Meta|Facebook|Instagram|Netflix|Discord|Uber|Spotify|WhatsApp|Apple|Android|Linux|Kafka|Cassandra|Spark|Node|Docker|Kubernetes|Hack|PHP|Postgre\w*|MySQL|Nginx|NGINX|Cloudflare|Expo|Electron|GraphQL|Objective-C|C\+\+|C#|SQL|HTML|CSS|Chaos Monkey|Open Connect|Titus|Zuul|Eureka|Spinnaker|Metaflow|TAO|Relay|StyleX|Litho|ComponentKit|Thrift|HHVM|PyTorch|TensorFlow|Celery|RabbitMQ|Memcache\w*|EVCache|ScyllaDB|Elasticsearch|WebRTC|WebSocket\w*|Firebase|Vercel|Next\.js|Shibboleth|Okta|Blackboard|Moodle|Stripe)\b/;

/** Words the current teardown's prose uses in lowercase; a leading word missing from it is a name ("Katran", "Keystone"). */
let LOWER_WORDS: Set<string> | null = null;

/** Lowercases a leading word unless it's an acronym ("ML platform"), "I", a camelCase name ("JavaScript") or a proper noun. */
const lowerFirst = (s: string) => {
  const first = s.match(/^[A-Za-z]+/)?.[0] ?? '';
  const w = first.toLowerCase();
  const known = LOWER_WORDS === null || LOWER_WORDS.has(w) || LOWER_WORDS.has(w.replace(/e?s$/, '')) || LOWER_WORDS.has(w.replace(/s$/, ''));
  const name = PROPER.test(s) || (first.length > 1 && !known);
  return /^[A-Z](?![A-Z0-9])/.test(s) && !/^I\b/.test(s) && !/^[A-Z][a-z]+[A-Z.]/.test(s) && !name ? s.charAt(0).toLowerCase() + s.slice(1) : s;
};
const upperFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function lineOf(code: string, index: number) {
  return code.slice(0, index).split('\n').length;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const hasWord = (text: string, re: RegExp) => re.test(text.toLowerCase());

function listJoin(items: string[]) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/* ------------------------------------------------------------------ */
/* Colours                                                             */
/* ------------------------------------------------------------------ */

const TXST_MAROON = '#501214';
const TXST_GOLD = '#8D734A';

/** Multi-word names first so "light blue" wins over "blue". */
const COLORS: [string, string][] = [
  ['texas state maroon', TXST_MAROON], ['texas state gold', TXST_GOLD], ['txst maroon', TXST_MAROON], ['txst gold', TXST_GOLD],
  ['light blue', '#93C5FD'], ['sky blue', '#38BDF8'], ['baby blue', '#BFDBFE'], ['dark blue', '#1E3A8A'], ['royal blue', '#1D4ED8'],
  ['light green', '#86EFAC'], ['dark green', '#166534'], ['forest green', '#166534'], ['mint green', '#6EE7B7'],
  ['light gray', '#E5E7EB'], ['light grey', '#E5E7EB'], ['dark gray', '#1F2937'], ['dark grey', '#1F2937'],
  ['hot pink', '#FF1493'], ['light pink', '#FBCFE8'], ['dark red', '#991B1B'], ['bright red', '#EF4444'],
  ['dark purple', '#4C1D95'], ['light purple', '#C4B5FD'], ['off white', '#F8F8F4'], ['off-white', '#F8F8F4'],
  ['maroon', TXST_MAROON], ['gold', TXST_GOLD], ['red', '#E53935'], ['blue', '#1D4ED8'], ['green', '#22C55E'],
  ['purple', '#7C3AED'], ['violet', '#8B5CF6'], ['indigo', '#4F46E5'], ['orange', '#F97316'], ['pink', '#EC4899'],
  ['black', '#000000'], ['white', '#FFFFFF'], ['gray', '#6B7280'], ['grey', '#6B7280'], ['silver', '#C0C0C0'],
  ['teal', '#14B8A6'], ['turquoise', '#2DD4BF'], ['cyan', '#06B6D4'], ['yellow', '#FACC15'], ['navy', '#1E3A8A'],
  ['brown', '#92400E'], ['beige', '#F5F0E1'], ['cream', '#FFFDD0'], ['lime', '#84CC16'], ['mint', '#6EE7B7'],
  ['coral', '#FF7F50'], ['salmon', '#FA8072'], ['lavender', '#C4B5FD'], ['crimson', '#DC143C'], ['burgundy', '#800020'],
  ['olive', '#708238'], ['magenta', '#D946EF'],
];

/** Publicly known brand colours, so "make it Spotify green" works. */
const BRAND_COLORS: [string, string][] = [
  ['spotify', '#1DB954'], ['instagram', '#E1306C'], ['facebook', '#1877F2'], ['netflix', '#E50914'], ['twitter', '#1DA1F2'],
  ['youtube', '#FF0000'], ['discord', '#5865F2'], ['whatsapp', '#25D366'], ['uber', '#000000'], ['amazon', '#FF9900'],
  ['google', '#4285F4'], ['reddit', '#FF4500'], ['tiktok', '#FE2C55'], ['chatgpt', '#10A37F'], ['openai', '#10A37F'],
  ['linkedin', '#0A66C2'], ['twitch', '#9146FF'], ['snapchat', '#FFFC00'],
];

interface ColorHit {
  hex: string;
  label: string;
  /** "txst colors" also sets a gold accent */
  txstPair?: boolean;
}

function expandHex(h: string) {
  const raw = h.replace('#', '');
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  return `#${full.toUpperCase()}`;
}

function parseColor(text: string): ColorHit | null {
  const lower = text.toLowerCase();
  const hex = lower.match(/#([0-9a-f]{6}|[0-9a-f]{3})\b/);
  if (hex) return { hex: expandHex(hex[0]), label: expandHex(hex[0]) };
  for (const [name, value] of COLORS) {
    if (new RegExp(`\\b${name.replace(/[-]/g, '[- ]')}\\b`).test(lower)) {
      return { hex: value, label: name.includes('maroon') ? 'TXST maroon' : name.includes('gold') ? 'TXST gold' : name };
    }
  }
  if (/\b(txst|texas state|bobcats?)\b/.test(lower)) return { hex: TXST_MAROON, label: 'TXST maroon', txstPair: true };
  for (const [name, value] of BRAND_COLORS) {
    if (new RegExp(`\\b${name}\\b`).test(lower) && /\b(colou?rs?|green|red|blue|pink|purple|orange|black|yellow|style|look|theme|brand)\b/.test(lower)) {
      return { hex: value, label: `${upperFirst(name)} ${name === 'uber' ? 'black' : 'colour'}` };
    }
  }
  return null;
}

function luminance(hex: string) {
  const h = expandHex(hex).slice(1);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/* ------------------------------------------------------------------ */
/* Playground controls                                                 */
/* ------------------------------------------------------------------ */

type Role = 'bg' | 'text' | 'accent' | 'header' | 'brand' | 'card' | 'side' | 'photo' | 'radius' | 'space' | 'size';

const COLOR_ROLES: Role[] = ['bg', 'text', 'accent', 'header', 'brand', 'card', 'side', 'photo'];
const RANGE_ROLES: Role[] = ['radius', 'space', 'size'];

/** What a tweak is for, judged from its name AND label. */
const TWEAK_ROLES: [Role, RegExp][] = [
  ['bg', /\b(bg|background|wallpaper|paper|canvas|backdrop)\b/],
  ['text', /\b(text|ink|font)\b/],
  ['accent', /\b(accent|button|chip|cta|link|highlight)\b/],
  ['header', /\b(header|nav|top bar|navbar|toolbar)\b/],
  ['brand', /\b(brand|primary|main)\b/],
  ['card', /\b(card|bubble|surface)\b/],
  ['side', /\b(rail|sidebar|side ?bar|side|drawer)\b/],
  ['photo', /\b(photo|gradient|image|picture|cover)\b/],
  ['radius', /\b(radius|corners?|round|roundness)\b/],
  ['space', /\b(space|spacing|gap|padding)\b/],
  ['size', /\b(size|height|width|avatar|art|logo|font|bar|hero|player|photo|balance)\b/],
];

/** Words people use for each role. */
const QUERY_ROLES: [Role, RegExp][] = [
  ['bg', /\b(background|bg|backdrop|wallpaper|canvas|paper|page colou?r|behind)\b/],
  ['text', /\b(text|font|words|writing|letters|ink|type ?face)\b/],
  ['accent', /\b(accent|buttons?|cta|highlights?|secondary|links?)\b/],
  ['header', /\b(header|top ?bar|nav ?bar|navigation bar|toolbar|menu bar|banner)\b/],
  ['brand', /\b(brand|main|primary|theme|logo)\b/],
  ['card', /\b(cards?|bubbles?|panels?|boxes)\b/],
  ['side', /\b(side ?bar|sidebar|rail|side ?panel|left (bar|side|column|strip)|server (list|icons?)|drawer)\b/],
  ['photo', /\b(photos?|pictures?|pics?|images?|gradient)\b/],
  ['radius', /\b(corners?|radius|round|rounder|rounded|roundness|pill|curv(y|ier|ed)|square|sharp)\b/],
  ['space', /\b(spacing|space|spaces|gaps?|padding|roomier|breathing room|spread|tighter|cramped|compact)\b/],
];

const tweakText = (tw: Tweak) => `${tw.name.replace(/^--/, '').replace(/[-_]/g, ' ')} ${tw.label}`.toLowerCase();

function rolesIn(text: string, type: Tweak['type']) {
  const allowed = type === 'color' ? COLOR_ROLES : RANGE_ROLES;
  return new Set(TWEAK_ROLES.filter(([role, re]) => allowed.includes(role) && re.test(text)).map(([role]) => role));
}

/** The label wins when it says what the control is for: `--accent` labelled "Photo gradient" paints the photo, not buttons. */
function tweakRoles(tw: Tweak): Set<Role> {
  const fromLabel = rolesIn(tw.label.toLowerCase(), tw.type);
  const roles = fromLabel.size ? fromLabel : rolesIn(tweakText(tw), tw.type);
  if (tw.type === 'range' && /\b(text|font)\b/.test(tweakText(tw))) roles.add('size');
  return roles;
}

function queryRoles(text: string): Role[] {
  const lower = text.toLowerCase();
  return QUERY_ROLES.filter(([, re]) => re.test(lower)).map(([r]) => r);
}

/** Label words that are too generic to count as a match on their own. */
const LABEL_NOISE = new Set(['color', 'colour', 'size', 'height', 'width', 'range', 'your', 'the']);

/** Scores a tweak against free text: role matches plus label/name words. */
function scoreTweak(tw: Tweak, text: string) {
  const roles = tweakRoles(tw);
  let score = 0;
  for (const r of queryRoles(text)) if (roles.has(r)) score += 4;
  const q = new Set(tokens(text));
  const own = new Set(tokens(tweakText(tw)).filter((t) => !LABEL_NOISE.has(t)));
  for (const t of own) if (q.has(t)) score += 3;
  if (text.includes(tw.name)) score += 10;
  return score;
}

function pickTweak(tweaks: Tweak[], text: string, type: Tweak['type']): { tweak: Tweak; score: number } | null {
  let best: { tweak: Tweak; score: number } | null = null;
  for (const tw of tweaks) {
    if (tw.type !== type) continue;
    const score = scoreTweak(tw, text);
    if (score > 0 && (!best || score > best.score)) best = { tweak: tw, score };
  }
  return best;
}

const withRole = (tweaks: Tweak[], role: Role, type?: Tweak['type']) =>
  tweaks.filter((tw) => (!type || tw.type === type) && tweakRoles(tw).has(role));

function brandLike(tweaks: Tweak[]) {
  const colors = tweaks.filter((t) => t.type === 'color');
  return withRole(colors, 'brand')[0] ?? withRole(colors, 'accent')[0] ?? colors.find((t) => !tweakRoles(t).has('bg') && !tweakRoles(t).has('text')) ?? colors[0];
}

function accentLike(tweaks: Tweak[], not?: Tweak) {
  return withRole(tweaks, 'accent', 'color').find((t) => t !== not);
}

interface EditKey {
  key: string;
  text: string;
  tag: string;
  classes: string[];
  line: number;
}

/** data-edit elements whose text can actually be rewritten. */
function editableKeys(code: string): EditKey[] {
  const out: EditKey[] = [];
  const seen = new Set<string>();
  const re = /<([a-zA-Z][\w-]*)([^>]*?)\sdata-edit=["']([^"']+)["']([^>]*)>([^<]*)</g;
  for (const m of code.matchAll(re)) {
    const [, tag, before, key, after, text] = m;
    if (seen.has(key) || !setEditableText(code, key, 'x').line) continue;
    seen.add(key);
    const cls = `${before} ${after}`.match(/class=["']([^"']+)["']/)?.[1] ?? '';
    out.push({ key, text: text.trim(), tag: tag.toLowerCase(), classes: cls.split(/\s+/).filter(Boolean), line: lineOf(code, m.index ?? 0) });
  }
  return out;
}

/** "site-name" → "site name", "cartTitle" → "cart title", "ride1" → "ride 1" */
const keyWords = (key: string) =>
  key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([a-z])(\d)/gi, '$1 $2').replace(/[-_]+/g, ' ').toLowerCase().trim();

/** Words people use for each kind of editable text. */
const KEY_SYNONYMS: [RegExp, RegExp][] = [
  [/\b(headline|heading|title|h1|big text|hero|main text)\b/, /\b(headline|title|heading|hero|greeting|lesson|product|board)\b/],
  [/\b(name|logo|site|brand|wordmark|app name|store|masthead|company)\b/, /\b(name|logo|site|app|store|brand|product|masthead|workspace|server|repo|game|course|contact|sub name)\b/],
  [/\b(button|cta|call to action)\b/, /\b(cta|button|share|lucky|search label)\b/],
  [/\b(intro|subtitle|description|tagline|about|blurb|summary|paragraph|subheading)\b/, /\b(intro|desc|about|subtitle|topic|tagline|meta|status|hint)\b/],
  [/\b(footer|bottom|fine print|disclaimer)\b/, /\b(footer|disclaimer|returns|note)\b/],
  [/\b(section|card)\b/, /\b(section|card|col|row)\b/],
];

function scoreKey(k: EditKey, target: string) {
  const lower = target.toLowerCase();
  const kw = keyWords(k.key);
  let score = 0;
  for (const [q, keyRe] of KEY_SYNONYMS) if (q.test(lower) && keyRe.test(kw)) score += 4;
  const q = new Set(tokens(target));
  for (const t of tokens(kw)) if (q.has(t)) score += 5;
  if (k.text && lower.includes(k.text.toLowerCase()) && k.text.length > 2) score += 8;
  if (new RegExp(`\\b${k.key.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(lower)) score += 6;
  // "title" usually means the biggest heading; "logo" the element styled as one; "button" a real <button>
  if (/\b(title|headline|heading|h1|big text|main text)\b/.test(lower) && k.tag === 'h1') score += 4;
  if (/\b(logo|app name|wordmark)\b/.test(lower) && k.classes.includes('logo')) score += 4;
  if (/\b(button|btn|cta)\b/.test(lower) && k.tag === 'button') score += 4;
  return score;
}

function rankKeys(keys: EditKey[], target: string) {
  return keys.map((k) => ({ k, score: scoreKey(k, target) })).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
}

const headlineKey = (keys: EditKey[]) => rankKeys(keys, 'headline title')[0]?.k ?? keys[0];

/* ------------------------------------------------------------------ */
/* Conversation context                                                */
/* ------------------------------------------------------------------ */

interface Ctx {
  t: Teardown;
  code: string;
  tab: AgentRequest['tab'];
  /** The new user message, exactly as typed (used for new text values like “Hello Bobcats”) */
  raw: string;
  /** The new user message with slang expanded and obvious typos fixed (used for routing) */
  q: string;
  lower: string;
  /** lower with the product name replaced by "it", so "how does Uber work" reads as "how does it work" */
  lowerIt: string;
  /** "tell me more": give the deeper version of an answer */
  detail: boolean;
  /** Number of user turns so far, used to vary suggestions */
  turn: number;
  prevUser: string;
  prevAssistant: string;
  tweaks: Tweak[];
  keys: EditKey[];
  /** Product-name words, ignored when searching (they appear everywhere) */
  nameStop: Set<string>;
  /** Matches the product's name and domain, removed before searching (they appear everywhere) */
  nameRe: RegExp | null;
  /** Meaningful query tokens */
  qt: string[];
}

/** Hints for picking follow-up suggestions. */
interface Hint {
  kind: 'change' | 'question' | 'help' | 'none';
  nodeIds?: string[];
  flowId?: string;
  layer?: StackLayer;
  snippetId?: string;
}

interface Draft {
  text: string;
  actions: AgentAction[];
  hint: Hint;
  suggestions?: string[];
}

const PLAY: AgentAction = { type: 'open_tab', tab: 'play' };

const CHANGE_START =
  /^(?:(?:please|pls|ok(?:ay)?|now|so|and|also|then|actually|hey|yes|yeah|sure|cool|great|nice|next|can you|could you|would you|will you|let'?s|i want(?: you)? to|i'?d like(?: you)? to|help me|try(?: to)?|go ahead and|how (?:do|can|would) i)[,!\s]+)*(make|change|set|turn|switch|rename|use|paint|colou?r|recolou?r|add|insert|put|edit|update|replace|give|apply|swap|increase|decrease|enlarge|shrink|reduce|round|square|call|write|type|remove|delete|hide|bump|darken|lighten|reset|restore|revert|undo|start over|resize|widen|tighten|lower|raise)\b/;

const QUESTION_START =
  /^(what|whats|what's|why|who|whom|whose|when|where|which|is|are|was|were|does|do|did|has|have|tell me|explain|describe|walk me|show me|how (does|did|is|are|was|were|much|many|old|big|fast|come))\b/;

/* ------------------------------------------------------------------ */
/* Playground changes                                                  */
/* ------------------------------------------------------------------ */

function applyTweaks(ctx: Ctx, changes: { tw: Tweak; value: string }[]) {
  let code = ctx.code;
  const actions: AgentAction[] = [PLAY];
  const parts: string[] = [];
  const same: string[] = [];
  for (const { tw, value } of changes) {
    const res = setTweak(code, tw.name, value);
    if (!res.line) continue;
    if (tw.value.toLowerCase() === value.toLowerCase()) {
      same.push(`\`${tw.name}\` (${tw.label}) is already ${value}`);
      continue;
    }
    code = res.code;
    actions.push({ type: 'set_tweak', name: tw.name, value });
    parts.push(`\`${tw.name}\` (${tw.label}) to ${value} (line ${res.line})`);
  }
  return { actions, parts, same };
}

function tweakReply(ctx: Ctx, changes: { tw: Tweak; value: string }[], lead = '', tail = '', verb = 'Changed'): Draft {
  const { actions, parts, same } = applyTweaks(ctx, changes);
  if (!parts.length) {
    return {
      text: `${lead}Nothing to change: ${listJoin(same)}, so the preview already looks like that.${tail ? ` ${tail}` : ''} Try a different value, or say “reset” to go back to the original.`,
      actions: [PLAY],
      hint: { kind: 'change' },
    };
  }
  const text = [
    `${lead}${verb} ${listJoin(parts)}.`,
    same.length ? `(${upperFirst(listJoin(same))}.)` : '',
    tail,
    `It’s live in the Playground, and the Code tab shows the edited line${parts.length > 1 ? 's' : ''}.`,
  ]
    .filter(Boolean)
    .join(' ');
  return { text, actions, hint: { kind: 'change' } };
}

/** Which tweak really paints an element, read from the CSS (e.g. `body { background: var(--bg) }`). */
function tweakUsedBy(ctx: Ctx, selector: RegExp, prop: RegExp, avoid: Role[] = []): Tweak | undefined {
  const style = ctx.code.match(/<style[^>]*>([\s\S]*?)<\/style>/i)?.[1] ?? '';
  const found: Tweak[] = [];
  for (const m of style.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = m[1].split(',').map((s) => s.trim());
    if (!selectors.some((s) => selector.test(s))) continue;
    for (const decl of m[2].split(';')) {
      const [p, v] = decl.split(/:(.*)/s);
      if (!p || !v || !prop.test(p.trim())) continue;
      const name = v.match(/var\((--[\w-]+)\)/)?.[1];
      const tw = ctx.tweaks.find((x) => x.name === name && x.type === 'color');
      if (tw) found.push(tw);
    }
  }
  return found.find((tw) => !avoid.some((r) => tweakRoles(tw).has(r))) ?? found[0];
}

function roleTweak(ctx: Ctx, role: Role): Tweak | undefined {
  const direct = withRole(ctx.tweaks, role, 'color')[0];
  if (direct) return direct;
  if (role === 'bg') return tweakUsedBy(ctx, /^(body|html|:root|main|\.app|\.page|\.screen)$/, /^background(-color)?$/);
  if (role === 'text') return tweakUsedBy(ctx, /^(body|html|p|main)$/, /^color$/);
  if (role === 'header') return tweakUsedBy(ctx, /^(header|\.header|\.topbar|\.top-bar|\.navbar|\.appbar|\.bar|nav)$/, /^background(-color)?$/);
  if (role === 'accent') {
    // A real button background first, then anything button-like the CSS colours ("send", "like", "cta")
    return (
      tweakUsedBy(ctx, /^(button|\.cta|\.btn|\.button|\.primary)$/, /^background(-color)?$/) ??
      tweakUsedBy(ctx, /(button|\.btn|\.cta|\.send|\.submit|\.like|\.follow|\.join|\.primary)(?![\w-])/, /^(background(-color)?|color|fill|stroke|border-color)$/, ['text', 'bg'])
    );
  }
  if (role === 'side') return tweakUsedBy(ctx, /(\.rail|\.sidebar|\.side\b|aside|\.drawer)/, /^background(-color)?$/);
  if (role === 'photo') return tweakUsedBy(ctx, /(\.photo|\.hero|\.cover|\.image|\.art|img)(?![\w-])/, /^background(-image|-color)?$/);
  return undefined;
}

function controlsSummary(ctx: Ctx) {
  const colors = ctx.tweaks.filter((t) => t.type === 'color');
  const ranges = ctx.tweaks.filter((t) => t.type === 'range');
  const lines: string[] = [];
  if (colors.length) lines.push(`• **Colours:** ${colors.map((t) => `${t.label} (\`${t.name}\`)`).join(', ')}`);
  if (ranges.length) lines.push(`• **Sliders:** ${ranges.map((t) => `${t.label} (\`${t.name}\`, ${t.min}–${t.max}px)`).join(', ')}`);
  if (ctx.keys.length) lines.push(`• **Text:** ${ctx.keys.map((k) => `\`${k.key}\``).join(', ')}`);
  if (/class="navlink/.test(ctx.code)) lines.push('• **Menu:** add a new menu link');
  return lines;
}

/** Example change prompts that would actually do something right now (no "dark mode" when it's already dark). */
function changeExamples(ctx: Ctx): string[] {
  const out: string[] = [];
  const brand = brandLike(ctx.tweaks);
  if (brand && brand.value.toUpperCase() !== TXST_MAROON) {
    const colorWords = new RegExp(`\\b(colou?r|${COLORS.map(([n]) => n).join('|')})\\b`, 'g');
    const what = brand.label.toLowerCase().replace(colorWords, '').replace(/\s+/g, ' ').trim() || 'brand';
    out.push(`Make the ${what} color TXST maroon`);
  }
  const bg = roleTweak(ctx, 'bg');
  if (bg && roleTweak(ctx, 'text')) out.push(/^#[0-9a-f]{3,6}$/i.test(bg.value) && luminance(bg.value) < 80 ? 'Switch to light mode' : 'Switch to dark mode');
  const radius = withRole(ctx.tweaks, 'radius', 'range')[0];
  if (radius) out.push(parseFloat(radius.value) >= radius.max ? 'Make the corners square' : 'Make the corners rounder');
  const size = ctx.tweaks.find((t) => t.type === 'range' && t !== radius && tweakRoles(t).has('size'));
  if (size) out.push(`Make the ${size.label.toLowerCase().replace(/\s+(size|height|width)$/, '')} ${parseFloat(size.value) >= size.max ? 'smaller' : 'bigger'}`);
  const key = headlineKey(ctx.keys);
  if (key) out.push(`Change the ${keyWords(key.key)} to "Go Bobcats!"`);
  if (/class="navlink/.test(ctx.code)) {
    const name = ['Events', 'Parking', 'Tutoring'].find((n) => !new RegExp(`class="navlink[^"]*"[^>]*>${n}<`).test(ctx.code));
    if (name) out.push(`Add a menu link called ${name}`);
  }
  return out;
}

function controlsReply(ctx: Ctx, lead: string): Draft {
  const lines = controlsSummary(ctx);
  const text = lines.length
    ? `${lead} Here’s what I can change in **${ctx.t.playground.title}**:\n${lines.join('\n')}\nTap a suggestion or say something like “make the corners rounder”.`
    : `${lead} This playground has no tagged controls, but you can still edit its code directly in the Playground’s Code view.`;
  return { text, actions: [PLAY], hint: { kind: 'change' }, suggestions: changeExamples(ctx).slice(0, 4) };
}

function resetChange(ctx: Ctx): Draft | null {
  if (!/\b(reset|start over|undo( all| everything| my changes)?|revert|discard (all |my |the )?(changes|edits)|throw away (my |the )?(changes|edits)|restore (the )?(original|playground|everything)|back to (the )?(original|default|how it was|start)|clear (all |my )?(changes|edits)|original code)\b/.test(ctx.lower)) {
    return null;
  }
  // "change the brand color back to the original" restores just that one control
  // "reset the brand color" / "change the headline back": restore just that one control or text
  const one = pickTweak(ctx.tweaks, ctx.q, 'color') ?? pickTweak(ctx.tweaks, ctx.q, 'range');
  const original = parseTweaks(ctx.t.playground.html);
  const single = (/\b(back|original|default)\b/.test(ctx.lower) || /^(please |pls |can you |could you )?(reset|restore|revert|undo)\s+(the|my|that|this)\s+\w/.test(ctx.lower)) && !/\b(everything|all|playground|whole|changes|edits)\b/.test(ctx.lower);
  if (single && one && one.score >= 4) {
    const orig = original.find((o) => o.name === one.tweak.name);
    if (orig && orig.value.toLowerCase() === one.tweak.value.toLowerCase()) {
      return { text: `\`${one.tweak.name}\` (${one.tweak.label}) is already at its original value, ${orig.value}, so there was nothing to restore. Say “reset” if you want to undo every change at once.`, actions: [PLAY], hint: { kind: 'change' } };
    }
    if (orig) return tweakReply(ctx, [{ tw: one.tweak, value: orig.value }], '', 'That’s its original value; your other changes stay as they are.', 'Restored');
  }
  const key = single ? rankKeys(ctx.keys, ctx.q)[0] : undefined;
  if (key && key.score >= 4) {
    const orig = editableKeys(ctx.t.playground.html).find((k) => k.key === key.k.key);
    if (orig && orig.text && orig.text !== key.k.text) {
      return { text: `Restored \`${key.k.key}\` to its original text, “${clipWords(orig.text, 10)}” (data-edit="${key.k.key}", line ${key.k.line}). Everything else you changed stays as it is.`, actions: [PLAY, { type: 'edit_text', key: key.k.key, text: orig.text }], hint: { kind: 'change' } };
    }
  }
  const edited = ctx.code !== ctx.t.playground.html;
  return {
    text: edited
      ? `Done: the playground is back to the original **${ctx.t.playground.title}** code. All colour, size, text and code edits were undone, so you can start experimenting again from a clean slate.`
      : `The playground is already the original **${ctx.t.playground.title}** code, but I reset it anyway so the preview reloads fresh.`,
    actions: [PLAY, { type: 'reset_playground' }],
    hint: { kind: 'change' },
  };
}

/* ---------- colours ---------- */

const ROLE_WORD: Record<Role, string> = {
  bg: 'background', text: 'text', accent: 'button', header: 'header', brand: 'brand', card: 'card', side: 'sidebar', photo: 'photo', radius: 'corner', space: 'spacing', size: 'size',
};

interface ColorMention extends ColorHit {
  index: number;
  length: number;
}

/** All colour mentions in order; the last one is usually the new value ("make the red letters blue"). */
function findColors(text: string): ColorMention[] {
  const lower = text.toLowerCase();
  const found: ColorMention[] = [];
  const taken = (i: number, len: number) => found.some((f) => i < f.index + f.length && f.index < i + len);
  for (const m of lower.matchAll(/#([0-9a-f]{6}|[0-9a-f]{3})\b/g)) {
    found.push({ hex: expandHex(m[0]), label: expandHex(m[0]), index: m.index ?? 0, length: m[0].length });
  }
  for (const m of lower.matchAll(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*[\d.]+\s*)?\)/g)) {
    const hex = `#${[m[1], m[2], m[3]].map((n) => Math.min(255, Number(n)).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
    found.push({ hex, label: hex, index: m.index ?? 0, length: m[0].length });
  }
  for (const [name, value] of COLORS) {
    for (const m of lower.matchAll(new RegExp(`\\b${name.replace(/[-]/g, '[- ]')}\\b`, 'g'))) {
      const i = m.index ?? 0;
      if (taken(i, m[0].length)) continue;
      const label = name.includes('maroon') ? 'TXST maroon' : name.includes('gold') ? 'TXST gold' : name;
      found.push({ hex: value, label, index: i, length: m[0].length });
    }
  }
  if (!found.length) {
    const hit = parseColor(text);
    if (hit) found.push({ ...hit, index: lower.length, length: 0 });
  }
  return found.sort((a, b) => a.index - b.index);
}

function colorChange(ctx: Ctx, force: boolean): Draft | null {
  const colors = findColors(ctx.q);
  if (!colors.length) return null;
  const colorTweaks = ctx.tweaks.filter((t) => t.type === 'color');
  if (!colorTweaks.length) return controlsReply(ctx, 'This playground has no colour controls.');

  // "make the background black and the text white": one assignment per clause
  const clauses = ctx.q.split(/\s*(?:,|;|\band then\b|\band\b|\bthen\b|\bplus\b)\s*/i).filter((c) => c.trim());
  if (clauses.length > 1) {
    const changes: { tw: Tweak; value: string }[] = [];
    for (const clause of clauses) {
      const found = findColors(clause);
      const hit = found[found.length - 1];
      if (!hit) continue;
      const rest = clause.slice(0, hit.index) + clause.slice(hit.index + hit.length);
      const roles = queryRoles(rest);
      const tw = pickTweak(ctx.tweaks, rest, 'color')?.tweak ?? (roles[0] ? roleTweak(ctx, roles[0]) : undefined);
      if (tw && !changes.some((c) => c.tw === tw)) changes.push({ tw, value: hit.hex });
    }
    if (changes.length >= 2) return tweakReply(ctx, changes);
  }

  const color = colors[colors.length - 1];
  const rest = ctx.q.slice(0, color.index) + ctx.q.slice(color.index + color.length);
  const roles = queryRoles(rest).filter((r) => !['radius', 'space', 'size'].includes(r));
  let target = pickTweak(ctx.tweaks, rest, 'color')?.tweak;
  let note = '';
  if (!target && roles.length) {
    target = roleTweak(ctx, roles[0]);
    if (target && !tweakRoles(target).has(roles[0])) note = `In this playground, the ${ROLE_WORD[roles[0]]} colour comes from \`${target.name}\`.`;
  }
  if (!target && roles.length && roles[0] !== 'brand') {
    const wanted = ROLE_WORD[roles[0]];
    return controlsReply(ctx, `There’s no ${wanted} colour control in this playground, so I didn’t change anything.`);
  }
  if (!target && color.txstPair) {
    const brand = brandLike(ctx.tweaks);
    const accent = accentLike(ctx.tweaks, brand);
    const changes = [{ tw: brand, value: TXST_MAROON }];
    if (accent) changes.push({ tw: accent, value: TXST_GOLD });
    return tweakReply(ctx, changes, 'Go Bobcats! ', accent ? '' : 'There’s no accent colour control here for the gold.');
  }
  // "actually make it gold": reuse the control we just changed
  if (!target && /\b(it|that|this|instead|actually|same|too)\b/.test(ctx.lower)) {
    const recent = ctx.prevAssistant.match(/`(--[\w-]+)`/)?.[1];
    target = colorTweaks.find((t) => t.name === recent) ?? pickTweak(ctx.tweaks, ctx.prevUser, 'color')?.tweak;
  }
  if (!target) {
    if (!force && !roles.length && countWords(ctx.q) > 6) return null;
    target = brandLike(ctx.tweaks);
    if (/\b(headline|title|heading|caption|name)\b/.test(ctx.lower)) {
      const textTw = roleTweak(ctx, 'text');
      if (textTw) {
        target = textTw;
        note = `There’s no colour just for that element, so I used the text colour.`;
      }
    }
  }
  return tweakReply(ctx, [{ tw: target, value: color.hex }], '', note);
}

/** Mixes a hex colour toward black (amount < 0) or white (amount > 0). */
function shade(hex: string, amount: number) {
  const h = expandHex(hex).slice(1);
  const target = amount < 0 ? 0 : 255;
  const k = Math.abs(amount);
  const mixed = [0, 2, 4].map((i) => Math.round(parseInt(h.slice(i, i + 2), 16) * (1 - k) + target * k));
  return `#${mixed.map((c) => c.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

const SHADE_WORDS = /\b(darker|darken|deeper|lighter|lighten|brighter|brighten|paler)\b/;

/** "make the brand blue darker": nudge one named colour instead of switching the whole page to dark mode. */
function shadeChange(ctx: Ctx): Draft | null {
  const m = ctx.lower.match(SHADE_WORDS);
  if (!m) return null;
  const rest = ctx.lower.replace(SHADE_WORDS, ' ').replace(/\b(a bit|a little|slightly|much|way|even|more|make|it|the|please|pls)\b/g, ' ');
  const picked = pickTweak(ctx.tweaks, rest, 'color');
  const role = queryRoles(rest).find((r) => COLOR_ROLES.includes(r));
  const tw = picked && picked.score >= 3 ? picked.tweak : role ? roleTweak(ctx, role) : undefined;
  if (!tw || !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(tw.value)) return null;
  const darker = /dark|deep/.test(m[1]);
  const value = shade(tw.value, (darker ? -1 : 1) * (MUCH.test(ctx.lower) ? 0.45 : 0.25));
  return tweakReply(ctx, [{ tw, value }], darker ? 'A shade darker: ' : 'A shade lighter: ');
}

function modeChange(ctx: Ctx): Draft | null {
  const dark = /\b(dark mode|dark theme|night mode|go dark|make it dark(er)?|darker|dark background)\b/.test(ctx.lower);
  const light = /\b(light mode|light theme|day mode|go light|make it light(er)?|lighter|light background)\b/.test(ctx.lower);
  if (!dark && !light) return null;
  const bg = roleTweak(ctx, 'bg') ?? ctx.tweaks.find((t) => t.type === 'color' && /\b(map|wallpaper|board)\b/.test(tweakText(t)));
  const text = roleTweak(ctx, 'text');
  const card = withRole(ctx.tweaks, 'card', 'color')[0];
  if (!bg && !text) return controlsReply(ctx, `This playground has no background or text colour controls, so I can’t switch it to ${dark ? 'dark' : 'light'} mode.`);
  const changes: { tw: Tweak; value: string }[] = [];
  if (bg) changes.push({ tw: bg, value: dark ? '#0F1115' : '#FFFFFF' });
  if (text) changes.push({ tw: text, value: dark ? '#F2F4F7' : '#111111' });
  if (card && text && card !== bg) changes.push({ tw: card, value: dark ? '#1C1F26' : '#FFFFFF' });
  const missing = text ? '' : dark ? ' There’s no text colour control, so some text may stay dark.' : ' There’s no text colour control, so any light text may be hard to read now.';
  const mapNote = bg && !tweakRoles(bg).has('bg') ? ` There’s no page background control, so I used **${bg.label}**.` : '';
  return tweakReply(ctx, changes, dark ? '🌙 Dark mode: ' : '☀️ Light mode: ', `${mapNote}${missing}`.trim());
}

/* ---------- sizes ---------- */

const UP_WORDS = /\b(bigger|larger|increase|grow|huge|taller|wider|thicker|enlarge|longer|higher|expand|boost|raise|widen|more space|more spacing|more padding|more gap|roomier|spread out|looser)\b/;
const DOWN_WORDS = /\b(smaller|decrease|shrink|tiny|shorter|narrower|thinner|reduce|lower|tighter|tighten|compact|less space|less spacing|less padding|less gap|cramped|less round(ed)?|fewer)\b/;
const ROUND_WORDS = /\b(rounder|round corners|rounded corners|rounded|more round(ed)?|pill|pills|curvier|curvy|softer corners|round it|round the corners|round)\b/;
const SQUARE_WORDS = /\b(square|sharp|squared|boxy|no (rounded |round )?corners|not rounded|flat corners)\b/;
const MUCH = /\b(much|a lot|way|really|very|super|huge|massive|max(imum)?)\b/;

function scaleFont(code: string, k: EditKey, factor: number) {
  const style = /<style[^>]*>([\s\S]*?)<\/style>/i.exec(code);
  if (!style) return null;
  const contentStart = style.index + style[0].indexOf(style[1]);
  let best: { rank: number; abs: number; value: number; digits: string; selector: string } | null = null;
  for (const m of style[1].matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const rank = Math.max(
      ...m[1].split(',').map((s) => {
        const compound = s.trim().split(/[\s>+~]+/).pop() ?? '';
        if (compound.includes(':')) return 0;
        if (k.classes.some((c) => new RegExp(`\\.${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`).test(compound))) return 2;
        return new RegExp(`^${k.tag}(?![\\w-])`).test(compound) ? 1 : 0;
      }),
    );
    if (!rank) continue;
    const num = /font-size\s*:\s*(\d+(?:\.\d+)?)px/.exec(m[2]) ?? /font\s*:\s*[^;]*?(\d+(?:\.\d+)?)px/.exec(m[2]);
    if (!num) continue;
    const abs = contentStart + (m.index ?? 0) + m[1].length + 1 + num.index + num[0].lastIndexOf(`${num[1]}px`);
    if (!best || rank >= best.rank) best = { rank, abs, value: Number(num[1]), digits: num[1], selector: m[1].trim() };
  }
  if (!best) return null;
  let next = Math.round(best.value * factor);
  if (Math.abs(next - best.value) < 2) next = best.value + (factor > 1 ? 2 : -2);
  next = Math.min(96, Math.max(8, next));
  const updated = code.slice(0, best.abs) + String(next) + code.slice(best.abs + best.digits.length);
  return { code: updated, line: lineOf(code, best.abs), from: best.value, to: next, selector: best.selector };
}

function sizeChange(ctx: Ctx, imperative: boolean): Draft | null {
  const l = ctx.lower;
  const square = SQUARE_WORDS.test(l);
  const round = !square && ROUND_WORDS.test(l) && !DOWN_WORDS.test(l);
  const up = UP_WORDS.test(l);
  const down = DOWN_WORDS.test(l);
  const ranges = ctx.tweaks.filter((t) => t.type === 'range');
  let px = l.match(/\b(\d+(?:\.\d+)?)\s*(?:px|pixels?)\b/) ?? (imperative ? l.match(/\bto (\d+(?:\.\d+)?)\b/) : null);
  // "make the photo corners 12", "spacing 24": a bare number right next to a named slider
  const bare = l.match(/(?<![#\w.-])(\d{1,3}(?:\.\d+)?)(?![\w%.])/);
  if (!px && bare && (imperative || countWords(l) <= 4) && (pickTweak(ranges, l.replace(bare[0], ' '), 'range')?.score ?? 0) >= 3) px = bare;
  if (!square && !round && !up && !down && !px) return null;

  if (square || round) {
    const radius = withRole(ranges, 'radius')[0];
    if (!radius) return controlsReply(ctx, 'There’s no corner radius control in this playground.');
    return tweakReply(ctx, [{ tw: radius, value: `${square ? radius.min : radius.max}px` }], square ? 'Sharp corners: ' : 'Nice and round: ');
  }

  const cleaned = l
    .replace(/\b(bigger|larger|increase|grow|huge|taller|wider|thicker|enlarge|longer|higher|expand|boost|raise|widen|more|less|smaller|decrease|shrink|tiny|shorter|narrower|thinner|reduce|lower|tighter|tighten|compact|cramped|roomier|looser|spread|out|fewer)\b/g, ' ')
    .replace(MUCH, ' ')
    .replace(/\b(make|set|change|the|it|a|bit|little|even|slightly|please|to|\d+(px)?)\b/g, ' ');
  const hasTarget = tokens(cleaned).length > 0;
  let tw = pickTweak(ranges, cleaned, 'range')?.tweak;
  const keyHit = rankKeys(ctx.keys, cleaned)[0];
  let contextKey: EditKey | undefined;

  if (!tw && !keyHit && !hasTarget) {
    // "make it bigger" → whatever we were just talking about
    const recent = ctx.prevAssistant.match(/`(--[\w-]+)`/)?.[1];
    tw = ranges.find((t) => t.name === recent) ?? pickTweak(ranges, ctx.prevUser, 'range')?.tweak;
    if (!tw) {
      const recentKey = ctx.prevAssistant.match(/data-edit="([^"]+)"/)?.[1];
      contextKey = ctx.keys.find((k) => k.key === recentKey) ?? rankKeys(ctx.keys, ctx.prevUser)[0]?.k;
    }
    if (!tw && !contextKey) tw = ranges.find((t) => tweakRoles(t).has('size') && !tweakRoles(t).has('radius')) ?? ranges[0];
  }

  const factor = up ? (MUCH.test(l) ? 1.6 : 1.3) : down ? (MUCH.test(l) ? 0.5 : 0.7) : 1;
  if (tw) {
    const current = parseFloat(tw.value) || 0;
    let next: number;
    if (px) next = Number(px[1]);
    else if (factor === 1) return null;
    else {
      next = Math.round(current * factor);
      const step = Math.max(2, Math.round((tw.max - tw.min) * 0.15));
      if (up && next < current + step && current === 0) next = current + step;
      if (Math.abs(next - current) < 2) next = current + (up ? 2 : -2);
    }
    const clamped = Math.min(tw.max, Math.max(tw.min, Math.round(next)));
    const edge = clamped === current ? (up ? 'maximum' : down ? 'minimum' : '') : '';
    if (edge) {
      return {
        text: `**${tw.label}** (\`${tw.name}\`) is already at its ${edge} of ${clamped}px, so there’s no room to go ${up ? 'bigger' : 'smaller'} with the slider. You can still type a new value in the Code tab.`,
        actions: [PLAY],
        hint: { kind: 'change' },
      };
    }
    const clampNote = clamped !== Math.round(next) ? `(That slider only goes from ${tw.min} to ${tw.max}px.)` : '';
    return tweakReply(ctx, [{ tw, value: `${clamped}px` }], '', clampNote);
  }

  const key = keyHit?.k ?? contextKey;
  if (key && factor !== 1) {
    const res = scaleFont(ctx.code, key, factor);
    if (res) {
      return {
        text: `There’s no slider for \`${key.key}\`, so I edited the CSS instead: \`${res.selector}\` font size ${res.from}px → ${res.to}px (line ${res.line}). That rule styles the element with data-edit="${key.key}".`,
        actions: [PLAY, { type: 'set_playground_code', code: res.code, summary: `${res.selector} font size ${res.from}px → ${res.to}px` }],
        hint: { kind: 'change' },
      };
    }
  }
  if (!imperative && !up && !down) return null;
  if (!imperative && hasTarget && !tw && !key) return null;
  return controlsReply(ctx, 'I couldn’t find a size control for that.');
}

/* ---------- text ---------- */

interface TextEdit {
  target: string;
  value: string;
  quoted: boolean;
  from?: string;
}

function parseTextEdit(q: string): TextEdit | null {
  const quotes = [...q.matchAll(/["“”]([^"“”]+)["“”]|(?:^|\s)['‘]([^'’]+)['’](?=\s|$|[.,!?])/g)].map((m) => ({
    text: (m[1] ?? m[2]).trim(),
    index: m.index ?? 0,
  }));
  if (quotes.length >= 2) {
    return { target: q.slice(0, quotes[1].index), value: quotes[1].text, quoted: true, from: quotes[0].text };
  }
  if (quotes.length === 1) {
    const before = q.slice(0, quotes[0].index);
    const after = q.slice(quotes[0].index + quotes[0].text.length + 2);
    return { target: `${before} ${after}`, value: quotes[0].text, quoted: true };
  }
  const m =
    q.match(/\b(?:rename|change|set|update|edit|replace|make|switch|write|put)\s+(.+?)\s+(?:to say|to read|so it says|so it reads|to|as|into|say|says|read|reads)\s+(.+?)\s*[.]?$/i) ??
    q.match(/\b(?:call|name|rename)\s+(it|this|that|the \w+(?: \w+)?)\s+(.+?)\s*[.]?$/i);
  if (!m) return null;
  return { target: m[1], value: m[2], quoted: false };
}

/** True when a "value" is really a style ("red", "#fff", "20px", "bigger", "rounded"), not new words for an element. */
function looksLikeStyle(value: string) {
  const v = value.toLowerCase().trim();
  return (
    (findColors(v).some((c) => c.length > 0) && countWords(v) <= 3) ||
    /^#[0-9a-f]{3,8}$/.test(v) ||
    /^-?\d+(\.\d+)?\s*(px|pixels?|%)?$/.test(v) ||
    UP_WORDS.test(v) || DOWN_WORDS.test(v) || ROUND_WORDS.test(v) || SQUARE_WORDS.test(v) || SHADE_WORDS.test(v) ||
    /\b(dark|light|night) (mode|theme)\b/.test(v) ||
    /^(bold|italic|underlined?|cent(er|re)d?|hidden|visible|invisible|transparent|pretty|nicer|better|cool|modern|fancy|pop|bright|dark|light)$/.test(v)
  );
}

/** "make the site name TXST": no "to", so split the words into a target element and its new text. */
function implicitTextEdit(ctx: Ctx): TextEdit | null {
  const m = ctx.raw.match(/\b(?:make|set|call|title)\s+(?:the\s+|my\s+|our\s+)?(.+?)\s*[.!]*$/i);
  if (!m || !ctx.keys.length) return null;
  const parts = m[1].split(/\s+/);
  let best: { target: string; value: string; score: number } | null = null;
  for (let i = 1; i < parts.length; i++) {
    const target = parts.slice(0, i).join(' ');
    const value = parts.slice(i).join(' ');
    const score = rankKeys(ctx.keys, target)[0]?.score ?? 0;
    if (score >= 5 && (!best || score > best.score)) best = { target, value, score };
  }
  if (best) best.value = best.value.replace(/^(text|label|wording|words|copy)\s+/i, '');
  if (!best || !best.value || countWords(best.value) > 8 || looksLikeStyle(best.value) || /^(to|say|says|read|reads|as|into|and|with|a|an|the)\b/i.test(best.value)) return null;
  return { target: best.target, value: best.value, quoted: false };
}

function textChange(ctx: Ctx, edit: TextEdit): Draft | null {
  const cleaned = edit.value.replace(/^["“'‘]|["”'’]$/g, '').trim();
  const value = cleaned.length > 120 ? cleaned.slice(0, 120).replace(/\s+\S*$/, '').trim() : cleaned;
  if (!value) return null;
  if (!ctx.keys.length) return controlsReply(ctx, 'This playground has no editable text elements.');

  let ranked = rankKeys(ctx.keys, edit.from ? `${edit.from} ${edit.target}` : edit.target);
  if (edit.from) {
    const exact = ctx.keys.find((k) => k.text.toLowerCase() === edit.from!.toLowerCase());
    if (exact) ranked = [{ k: exact, score: 99 }, ...ranked.filter((r) => r.k !== exact)];
  }
  let key = ranked[0]?.k;
  let note = '';
  if (!key) {
    const recentKey = ctx.prevAssistant.match(/data-edit="([^"]+)"/)?.[1];
    key = ctx.keys.find((k) => k.key === recentKey) ?? rankKeys(ctx.keys, ctx.prevUser)[0]?.k;
  }
  if (!key) {
    key = headlineKey(ctx.keys);
    note = ` I wasn’t sure which text you meant, so I picked \`${key.key}\`. Other editable text: ${ctx.keys.filter((k) => k !== key).map((k) => `\`${k.key}\``).join(', ')}.`;
  } else if (ranked[1] && ranked[0].k === key && ranked[1].score >= ranked[0].score - 1 && ranked[0].score < 99) {
    note = ` (There’s also \`${ranked[1].k.key}\` if you meant that one.)`;
  }
  const res = setEditableText(ctx.code, key.key, value);
  if (!res.line) return null;
  return {
    text: `Changed the text of \`${key.key}\` from “${clipWords(key.text, 8)}” to “${value}” (data-edit="${key.key}", line ${res.line}).${note} Only the words changed, so the styling stays the same.`,
    actions: [PLAY, { type: 'edit_text', key: key.key, text: value }],
    hint: { kind: 'change' },
  };
}

/* ---------- menu links & sections ---------- */

function addChange(ctx: Ctx): Draft | null {
  const l = ctx.lower;
  if (!/\b(add|insert|create|new|put)\b/.test(l) || !/\b(menu|nav|navigation|navbar|link|links|navlink|item|page|tab|section|card)\b/.test(l)) return null;
  const quoted = ctx.raw.match(/["“”']([^"“”']+)["“”']/)?.[1];
  const called = ctx.raw.match(/\b(?:called|named|titled|labell?ed|saying|that says|for)\s+(.+?)\s*[.!?]*$/i)?.[1];
  const before = ctx.raw.match(/\badd\s+(?:a|an|the|one|another)?\s*(?:new\s+)?(.+?)\s+(?:menu\s+|nav\s+|navigation\s+)?(?:link|item|tab|page|button|section|card)\b/i)?.[1];
  const after = ctx.raw.match(/\b(?:add|insert|create|put)\s+(?:a|an|the|one|another)?\s*(?:new\s+)?(?:menu|nav|navigation|navbar)?\s*(?:link|item|tab|page|button|section|card|entry|option)\s+(.+?)\s*[.!?]*$/i)?.[1];
  const junk = /^(the |a |an )?(menu|nav|navigation|navbar|header|top|new|link|another|more|nav bar|to the menu|to the nav|in the menu|please|pls)$/i;
  let name = [quoted, called, before, after].find((n) => n && !junk.test(n.trim()) && countWords(n) <= 5)?.trim() ?? '';
  name = name.replace(/\s+(to|in|on)\s+(the\s+)?(menu|nav|navigation|navbar|header|page)$/i, '').trim();
  const label = upperFirst(name || 'New page').slice(0, 40);
  const wantsSection = /\b(section|card)\b/.test(l) && !/\b(menu|nav|link)\b/.test(l);

  const cards = [...ctx.code.matchAll(/<article class="card">[\s\S]*?<\/article>/g)];
  if (wantsSection && cards.length && /class="card-head"/.test(ctx.code)) {
    const last = cards[cards.length - 1];
    const at = (last.index ?? 0) + last[0].length;
    const block = `\n  <article class="card">\n    <div class="card-head"><h2>${escapeHtml(label)}</h2><span class="chev">+</span></div>\n    <p>Write this section’s text here in the Code tab.</p>\n  </article>`;
    const code = ctx.code.slice(0, at) + block + ctx.code.slice(at);
    return {
      text: `Added a new section card called **${label}** (line ${lineOf(code, at) + 1}), right after the last section. It copies the structure of the other cards: an <article class="card"> with a heading and a paragraph that opens when you tap it.`,
      actions: [PLAY, { type: 'set_playground_code', code, summary: `Added section “${label}”` }],
      hint: { kind: 'change' },
    };
  }

  const links = [...ctx.code.matchAll(/^([ \t]*)<button class="navlink[^"]*"[^>]*>[^<]*<\/button>[ \t]*$/gm)];
  if (links.length) {
    const last = links[links.length - 1];
    const at = (last.index ?? 0) + last[0].length;
    const code = `${ctx.code.slice(0, at)}\n${last[1]}<button class="navlink">${escapeHtml(label)}</button>${ctx.code.slice(at)}`;
    const burger = /id="burger"/.test(ctx.code) ? ' Tap ☰ in the preview to open the menu and see it.' : '';
    return {
      text: `Added a new **${label}** menu link on line ${lineOf(code, at) + 1}, right after the last <button class="navlink">.${burger} The script already gives every navlink a click handler, so the new one works too.`,
      actions: [PLAY, { type: 'set_playground_code', code, summary: `Added menu link “${label}”` }],
      hint: { kind: 'change' },
    };
  }

  const tabs = /class="tab\b/.test(ctx.code) ? ' This screen has a tab bar instead: in the Code view, copy one of its <button class="tab"> lines, paste it right below and change the emoji or label.' : '';
  return {
    text: `This playground (**${ctx.t.playground.title}**) doesn’t have a menu I can safely add “${label}” to automatically.${tabs || ' To do it yourself, open the Code view, copy a similar element line, paste it right below and change its text.'} The preview updates as you type.`,
    actions: [PLAY],
    hint: { kind: 'change' },
    suggestions: changeExamples(ctx).slice(0, 3),
  };
}

function removeChange(ctx: Ctx): Draft | null {
  if (!/^(please\s+|can you\s+|could you\s+)?(remove|delete|hide|get rid of)\b/.test(ctx.lower)) return null;
  const key = rankKeys(ctx.keys, ctx.q)[0]?.k;
  const where = key ? ` The \`${key.key}\` text is on line ${key.line}: delete that element in the Code view (or rewrite it with “change the ${keyWords(key.key)} to …”).` : '';
  return {
    text: `I can recolour, resize and rewrite things, but I don’t delete elements so the playground never breaks.${where} If you change your mind, say “reset” to restore the original.`,
    actions: [PLAY],
    hint: { kind: 'change' },
    suggestions: changeExamples(ctx).slice(0, 3),
  };
}

const PLAYGROUND_WORDS =
  /\b(it|this|colou?rs?|size|text|font|corners?|playground|screen|preview|look|style|design|button|title|headline|background|theme|bigger|smaller|header|logo|brand|pretty|cool|nicer|better|pop|fancy|modern)\b/;

function tryChange(ctx: Ctx): Draft | null {
  const l = ctx.lower;
  const imperative = CHANGE_START.test(l);
  if (!imperative && QUESTION_START.test(l)) return null;
  if (/\b(build|clone|my own|set ?up|deploy|learn|my (app|website|site|project|code|startup|portfolio))\b/.test(l) && !/\b(playground|preview|colou?r|headline|title|button)\b/.test(l)) return null;
  const short = countWords(ctx.q) <= 6;

  const reset = resetChange(ctx);
  if (reset && (imperative || short)) return reset;
  const remove = removeChange(ctx);
  if (remove) return remove;
  if (imperative || short) {
    const add = addChange(ctx);
    if (add) return add;
  }

  const edit = parseTextEdit(ctx.raw) ?? (imperative ? implicitTextEdit(ctx) : null);
  if (edit && (imperative || edit.quoted)) {
    const value = edit.value.trim();
    const styleValue = !edit.quoted && looksLikeStyle(value);
    const tweakTarget = (pickTweak(ctx.tweaks, edit.target, 'color')?.score ?? 0) + (pickTweak(ctx.tweaks, edit.target, 'range')?.score ?? 0);
    const keyTarget = rankKeys(ctx.keys, edit.from ? `${edit.from} ${edit.target}` : edit.target)[0]?.score ?? 0;
    const renameVerb = /\b(rename|call|name|say|says|read|reads|write)\b/.test(l);
    // A plain-words value can only ever be text, so a matching text element wins over a matching colour or size control
    if (!styleValue && (edit.quoted || keyTarget > 0 || renameVerb || (tweakTarget === 0 && /\b(it|this|that)\b/.test(edit.target)))) {
      const done = textChange(ctx, edit);
      if (done) return done;
    }
  }

  const shaded = imperative || short ? shadeChange(ctx) : null;
  if (shaded) return shaded;
  const mode = modeChange(ctx);
  if (mode && (imperative || short || /\bmode\b/.test(l))) return mode;
  if (imperative || short || queryRoles(l).length) {
    const color = colorChange(ctx, imperative || short);
    if (color) return color;
  }
  const size = sizeChange(ctx, imperative);
  if (size) return size;

  const vibe = imperative ? vibeChange(ctx) : null;
  if (vibe) return vibe;
  if (imperative && (PLAYGROUND_WORDS.test(l) || short)) {
    const badHex = ctx.raw.match(/#[0-9a-z]+\b/i)?.[0];
    if (badHex) return controlsReply(ctx, `“${badHex}” isn’t a colour I can use: hex colours have 3 or 6 digits from 0–9 and A–F, like #501214.`);
    if (/\b(to|say|says|read|reads|into)\s*[.!?]*$/.test(l)) return controlsReply(ctx, 'Change it to what? Finish the sentence, like “change the title to Go Bobcats!”.');
    if (edit) return controlsReply(ctx, `I couldn’t tell what “${clipWords(edit.value, 8)}” should change.`);
    return controlsReply(ctx, 'I’m not sure how to do that one yet.');
  }
  return null;
}

const VIBE = /\b(pop|prettier|pretty|nicer|cooler|cool|better|modern|fancier|fancy|fun|funky|aesthetic|glow ?up|spice (it )?up|fresh|vibrant|stand out|less boring|boring)\b/;

/** "make it pop": a small, visible remix (bolder brand colour, softer corners) instead of a shrug. */
function vibeChange(ctx: Ctx): Draft | null {
  if (!VIBE.test(ctx.lower) || !CHANGE_START.test(ctx.lower) || findColors(ctx.q).some((c) => c.length > 0)) return null;
  if (/^how\b|\b(my|our|fact|facts|story|idea|question|example|tip|project|career|code|skills?)\b/.test(ctx.lower)) return null;
  const brand = brandLike(ctx.tweaks);
  const radius = withRole(ctx.tweaks, 'radius', 'range')[0];
  const changes: { tw: Tweak; value: string }[] = [];
  if (brand) changes.push({ tw: brand, value: brand.value.toUpperCase() === '#7C3AED' ? '#F97316' : '#7C3AED' });
  if (radius) changes.push({ tw: radius, value: `${Math.round(radius.min + (radius.max - radius.min) * 0.75)}px` });
  if (!changes.length) return null;
  return tweakReply(ctx, changes, 'Style is personal, so here’s one quick remix: ', 'Don’t love it? Name a colour (“make it maroon”) or say “reset”.');
}

/* ------------------------------------------------------------------ */
/* Questions: the pieces of a teardown                                 */
/* ------------------------------------------------------------------ */

type StackItem = Teardown['stack'][number]['items'][number];

const conf = (c: StackItem['confidence']) => (c === 'confirmed' ? 'confirmed' : 'LIKELY');
const nodeLabel = (t: Teardown, id: string) => t.architecture.nodes.find((n) => n.id === id)?.label ?? id;
const phrase = (hay: string, needle: string): boolean => {
  const inner = needle.match(/\(([^)]+)\)/)?.[1];
  if (inner && inner.length >= 3 && phrase(hay, inner.replace(/[()]/g, ''))) return true;
  const n = norm(needle);
  return n.length >= 3 && ` ${norm(hay)} `.includes(` ${n} `);
};

/** " (graph cache over MySQL)" for TAO / "TAO (graph cache over MySQL)": no repeated names, no nested brackets. */
function techNote(n: ArchNode) {
  if (!n.tech) return '';
  const inner = n.tech.match(/\(([^()]*)\)/)?.[1];
  if (norm(n.tech) === norm(n.label)) return inner ? ` (${inner})` : '';
  return ` (${n.tech.replace(/\s*\(([^()]*)\)/g, ', $1')})`;
}

function neighbours(t: Teardown, id: string) {
  const out = new Set<string>();
  for (const e of t.architecture.edges) {
    if (e.from === id) out.add(e.to);
    if (e.to === id) out.add(e.from);
  }
  return [...out];
}

type Entity =
  | { kind: 'node'; node: ArchNode; score: number; exact: boolean }
  | { kind: 'stack'; layer: StackLayer; item: StackItem; score: number; exact: boolean }
  | { kind: 'concept'; term: string; meaning: string; score: number; exact: boolean }
  | { kind: 'code'; snippet: CodeSample; score: number; exact: boolean };

const KIND_ORDER: Entity['kind'][] = ['node', 'stack', 'concept', 'code'];

const ALIASES: [RegExp, string][] = [
  [/\baws\b/i, 'amazon web services'],
  [/\bgcp\b/i, 'google cloud'],
  [/\bk8s\b/i, 'kubernetes'],
  [/\bpostgres\b/i, 'postgresql'],
  [/\bgolang\b/i, 'go'],
  [/\blb\b/i, 'load balancer'],
];

/** Drops the product name (it appears everywhere) and adds full names for common abbreviations. */
const stripName = (ctx: Ctx, text: string) => {
  const base = ctx.nameRe ? text.replace(ctx.nameRe, ' ') : text;
  const extra = ALIASES.filter(([re]) => re.test(base)).map(([, full]) => full);
  return extra.length ? `${base} ${extra.join(' ')}` : base;
};

function findEntities(ctx: Ctx, raw: string): Entity[] {
  const { t } = ctx;
  const text = stripName(ctx, raw);
  const qt = tokens(text, ctx.nameStop);
  if (!qt.length) return [];
  // "what is graphql": a thing whose whole name is the question beats a box that merely mentions it ("Web servers (GraphQL)")
  const core = qt.join(' ');
  const whole = (name: string) => (tokens(name.replace(/\(.*?\)/g, ' ')).join(' ') === core ? 4 : 0);
  const out: Entity[] = [];
  for (const node of t.architecture.nodes) {
    const exact = phrase(text, node.label) || phrase(text, node.id.replace(/-/g, ' '));
    const score = overlap(qt, node.label, 4) + overlap(qt, node.id.replace(/-/g, ' '), 3) + overlap(qt, node.tech, 2) + overlap(qt, node.description, 0.5) + (exact ? 6 : 0) + whole(node.label);
    if (score > 0) out.push({ kind: 'node', node, score, exact });
  }
  for (const l of t.stack) {
    for (const item of l.items) {
      const exact = phrase(text, item.name);
      const score = overlap(qt, item.name, 4) + overlap(qt, item.role, 1.5) + overlap(qt, item.beginnerNote, 0.5) + (exact ? 6 : 0) + whole(item.name);
      if (score > 0) out.push({ kind: 'stack', layer: l.layer, item, score, exact });
    }
  }
  for (const c of t.concepts) {
    const exact = phrase(text, c.term);
    const score = overlap(qt, c.term, 4) + overlap(qt, c.meaning, 0.5) + (exact ? 6 : 0) + whole(c.term);
    if (score > 0) out.push({ kind: 'concept', term: c.term, meaning: c.meaning, score, exact });
  }
  for (const s of t.code) {
    const score = overlap(qt, s.title, 3) + overlap(qt, s.file.replace(/[/._-]/g, ' '), 1) + overlap(qt, s.language, 2) + overlap(qt, s.explanation, 0.5);
    if (score > 0) out.push({ kind: 'code', snippet: s, score, exact: false });
  }
  const preferConcept = /\b(mean|meaning|means|define|definition|concept|term)\b/.test(text.toLowerCase());
  const rank = (e: Entity) => (preferConcept && e.kind === 'concept' ? -1 : KIND_ORDER.indexOf(e.kind));
  return out.sort((a, b) => b.score - a.score || rank(a) - rank(b));
}

function entityAnswer(ctx: Ctx, e: Entity, all: Entity[]): Draft {
  const { t } = ctx;
  if (e.kind === 'node') {
    const n = e.node;
    const stackItem = all.find((x): x is Extract<Entity, { kind: 'stack' }> => x.kind === 'stack' && x.score >= 4);
    const concept = all.find((x): x is Extract<Entity, { kind: 'concept' }> => x.kind === 'concept' && x.score >= 4);
    const near = neighbours(t, n.id).map((id) => nodeLabel(t, id));
    const flows = t.architecture.flows.filter((f) => f.steps.some((s) => s.from === n.id || s.to === n.id));
    const lines = [
      `**${n.label}**${techNote(n)}`,
      clipWords(n.description, 45),
      near.length ? `• **Talks to:** ${listJoin(near.slice(0, 5))}` : '',
      flows.length ? `• **Shows up when:** ${listJoin(flows.slice(0, 2).map((f) => lowerFirst(f.title)))}` : '',
      stackItem ? `• **In the stack:** ${stackItem.item.name}, ${lowerFirst(stackItem.item.role)} (${conf(stackItem.item.confidence)})` : '',
      concept && ctx.detail ? `• **Concept:** ${firstSentence(concept.meaning, 25)}` : '',
      ctx.detail && stackItem ? firstSentence(stackItem.item.beginnerNote, 30) : '',
      'I highlighted it on the System map.',
    ];
    return { text: lines.filter(Boolean).join('\n'), actions: [{ type: 'highlight_node', nodeId: n.id }], hint: { kind: 'question', nodeIds: [n.id, ...neighbours(t, n.id)], flowId: flows[0]?.id } };
  }
  if (e.kind === 'stack') {
    const it = e.item;
    const nameToks = tokens(it.name);
    const node = t.architecture.nodes.find((n) => phrase(`${n.tech} ${n.label}`, it.name) || (nameToks.length > 0 && overlap(nameToks, `${n.label} ${n.tech}`, 1) >= Math.min(2, nameToks.length)));
    const siblings = t.stack.find((l) => l.layer === e.layer)?.items.filter((i) => i !== it).map((i) => i.name) ?? [];
    const likely = it.confidence === 'likely' ? ' LIKELY means it’s an educated guess based on typical setups, not something publicly confirmed.' : '';
    const lines = [
      `**${it.name}**: ${lowerFirst(it.role)} (${e.layer} layer, ${conf(it.confidence)})`,
      clipWords(it.beginnerNote, 45),
      node ? `• **On the map:** ${node.label}${techNote(node)}: ${lowerFirst(firstSentence(node.description, 18))}` : '',
      likely.trim(),
      !node && siblings.length ? `• **Also in the ${e.layer} layer:** ${listJoin(siblings.slice(0, 3))}` : '',
      node ? 'I highlighted where it lives on the System map.' : `I opened the ${e.layer} layer on the Stack tab.`,
    ];
    return {
      text: lines.filter(Boolean).join('\n'),
      actions: node ? [{ type: 'highlight_node', nodeId: node.id }] : [{ type: 'open_stack_layer', layer: e.layer }],
      hint: { kind: 'question', layer: e.layer, nodeIds: node ? [node.id] : [] },
    };
  }
  if (e.kind === 'concept') {
    const related = findEntities(ctx, e.term).filter((x): x is Extract<Entity, { kind: 'node' }> => x.kind === 'node' && x.score >= 3).slice(0, 3);
    const lines = [
      `**${e.term}**`,
      clipWords(e.meaning, 50),
      related.length ? `• **Where it shows up in ${t.name}:** ${listJoin(related.map((r) => r.node.label))}` : '',
      related[0] ? `• ${related[0].node.label}: ${firstSentence(related[0].node.description, 20)}` : '',
      'It’s one of the interview-ready concepts on the Learn tab, which I opened for you.',
    ];
    return { text: lines.filter(Boolean).join('\n'), actions: [{ type: 'show_concept', term: e.term }], hint: { kind: 'question', nodeIds: related.map((r) => r.node.id) } };
  }
  return codeReply(ctx, e.snippet, '');
}

/* ---------- tech categories ---------- */

type CatId = 'language' | 'cache' | 'scale' | 'speed' | 'queue' | 'ai' | 'security' | 'data' | 'mobile' | 'frontend' | 'backend' | 'hosting';

interface Category {
  id: CatId;
  title: string;
  re: RegExp;
  layers: StackLayer[];
  kinds: ArchNode['kind'][];
  itemRe?: RegExp;
  nodeRe?: RegExp;
  preferNode?: boolean;
}

const SPEED = /\b(fast|faster|fastest|speed|speedy|quick|quickly|slow|slowly|laggy|lag|latency|performance|instant(ly)?)\b/;

const CATEGORIES: Category[] = [
  { id: 'language', title: 'Languages', re: /\b(languages?|written in|coded in|programming)\b/, layers: [], kinds: [] },
  { id: 'cache', title: 'Caching', re: /\b(cache|caches|caching|cached|memcached|redis)\b/, layers: [], kinds: ['cache'], itemRe: /\b(cache\w*|memcached?|redis|in-memory)\b/i, preferNode: true },
  { id: 'scale', title: 'Handling huge scale', re: /\b(scale|scales|scaling|scalab\w*|millions of|billions of|so many (users|people)|handle (all )?(the )?(traffic|load|users)|heavy traffic)\b/, layers: [], kinds: ['edge', 'cache', 'queue'], itemRe: /\b(shard\w*|cache\w*|load balanc\w*|cdn|content delivery|queue\w*|replica\w*|partition\w*|kafka|scyll\w*|cassandra)\b/i, preferNode: true },
  { id: 'speed', title: 'Speed', re: SPEED, layers: [], kinds: ['cache', 'edge'], itemRe: /\b(cache\w*|cdn|content delivery|memcache\w*|redis|evcache|open connect|edge)\b/i, preferNode: true },
  { id: 'queue', title: 'Queues & background jobs', re: /\b(queues?|queue|kafka|rabbitmq|background (jobs?|work|tasks?|workers?)|workers?|async\w*|message bus|pub ?sub|celery|sidekiq|event stream\w*|jobs?)\b/, layers: [], kinds: ['queue'], itemRe: /\b(queues?|kafka|jobs?|celery|rabbitmq|sidekiq|events?|stream\w*|workers?|pub.?sub)\b/i, nodeRe: /\b(workers?|jobs?|queues?|stream\w*)\b/i, preferNode: true },
  { id: 'ai', title: 'AI & machine learning', re: /\b(ai|a\.i|ml|machine learning|recommendations?|recommend\w*|algorithms?|ranking|models?|personali[sz]\w*|neural|llm|artificial intelligence)\b/, layers: ['AI / ML'], kinds: ['ml'] },
  { id: 'security', title: 'Security & login', re: /\b(security|secure|login|log ?ins?|sign ?in|signin|auth\w*|passwords?|encrypt\w*|privacy|sso|oauth|hack\w*|safe|safety)\b/, layers: [], kinds: [], itemRe: /\b(auth\w*|log ?in|sign[- ]?(in|on)|sso|secur\w*|encrypt\w*|passwords?|oauth|tokens?|recaptcha|hsts|signal protocol|saml|openid|identity)\b/i, nodeRe: /\b(auth\w*|log ?in|sso|identity|secur\w*|encrypt\w*|idp|passwords?)\b/i, preferNode: true },
  { id: 'data', title: 'Data & storage', re: /\b(databases?|db|dbs|storage|stored?|stores?|storing|data|sql|nosql|tables?|saved?|saves|saving|files?|mongo\w*|mysql|postgres\w*|firebase|firestore|dynamo\w*|supabase|sqlite|oracle)\b/, layers: ['Data'], kinds: ['database', 'storage', 'cache'] },
  { id: 'mobile', title: 'Mobile apps', re: /\b(mobile|ios|android|iphone|phones?|app store|native app)\b/, layers: ['Mobile'], kinds: [], nodeRe: /mobile|ios|android|iphone|phone|rider|driver/i },
  { id: 'frontend', title: 'Front end', re: /\b(front ?end|front-end|frameworks?|web ?app|website|web site|react|ui|user interface|browser|client side)\b/, layers: ['Frontend'], kinds: [], nodeRe: /web|site|browser|\.com/i },
  { id: 'backend', title: 'Back end', re: /\b(back ?end|back-end|servers?|apis?|server side|microservices?|services)\b/, layers: ['Backend'], kinds: ['gateway', 'service'] },
  { id: 'hosting', title: 'Hosting & infrastructure', re: /\b(host|hosted|hosting|cloud|cdns?|aws|amazon web services|data ?cent(er|re)s?|infrastructure|deploy\w*|runs on|run on|google cloud|azure|cloudflare|devops)\b/, layers: ['Infrastructure', 'DevOps'], kinds: ['edge'] },
];

function detectCategories(text: string): Category[] {
  const l = text.toLowerCase();
  let cats = CATEGORIES.filter((c) => c.re.test(l));
  const ids = new Set(cats.map((c) => c.id));
  if (ids.has('frontend') && ids.has('backend') && !/front ?end|website|web ?app|browser|\bui\b/.test(l)) cats = cats.filter((c) => c.id !== 'frontend');
  if (ids.has('data') && cats.length > 1 && !/database|storage|stored|\bdb\b|sql/.test(l)) cats = cats.filter((c) => c.id !== 'data');
  return cats;
}

function languageAnswer(ctx: Ctx): Draft {
  const { t } = ctx;
  const langs = [...t.languages].sort((a, b) => b.share - a.share);
  const asked = langs.find((lang) => tokens(lang.name).some((tk) => ctx.qt.includes(tk)));
  const lines = [
    asked ? `Yes, **${asked.name}** is one of them: ${lowerFirst(asked.usedFor)}.` : `${t.name} uses ${langs.length} main languages. The % is relative emphasis, not exact lines of code:`,
    ...langs.slice(0, 5).map((lang) => `• **${lang.name}** (${lang.share}%): ${clipWords(lang.usedFor, 12)}`),
    'The full breakdown is at the top of the Stack tab.',
  ];
  return { text: lines.join('\n'), actions: [{ type: 'open_tab', tab: 'stack' }], hint: { kind: 'question' } };
}

/** One grounded sentence about the front door of the system, for questions the teardown can't answer directly. */
function gatewayHint(t: Teardown) {
  const gate = t.architecture.nodes.find((n) => n.kind === 'gateway') ?? t.architecture.nodes.find((n) => n.tier === 2);
  return gate ? ` A good place to start on the System map is **${gate.label}**: ${lowerFirst(firstSentence(gate.description, 20))}` : '';
}

function categoryAnswer(ctx: Ctx, cat: Category): Draft {
  const { t } = ctx;
  if (cat.id === 'language') return languageAnswer(ctx);
  const items: { layer: StackLayer; item: StackItem }[] = [];
  for (const l of t.stack) {
    for (const item of l.items) {
      const inLayer = cat.layers.includes(l.layer);
      const byName = cat.itemRe?.test(`${item.name} ${item.role}`) ?? false;
      if (inLayer || byName) items.push({ layer: l.layer, item });
    }
  }
  // Items that match the question's own words first ("where are photos stored")
  items.sort((a, b) => overlap(ctx.qt, `${b.item.name} ${b.item.role}`, 1) - overlap(ctx.qt, `${a.item.name} ${a.item.role}`, 1));
  const nodes = t.architecture.nodes
    .filter((n) => cat.kinds.includes(n.kind) || (cat.nodeRe?.test(`${n.id} ${n.label}`) && (cat.id !== 'mobile' && cat.id !== 'frontend' ? true : n.kind === 'client')) || (cat.itemRe?.test(`${n.label} ${n.tech}`) ?? false))
    .map((n) => ({ n, s: (cat.kinds.includes(n.kind) ? 10 : 0) + overlap(ctx.qt, `${n.label} ${n.tech} ${n.description}`, 1) }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.n);

  if (!items.length && !nodes.length) {
    return {
      text: `This teardown doesn’t list anything specific about ${cat.title.toLowerCase()} for ${t.name}, and I only answer from what’s in it. You can still explore the layers it does cover (${t.stack.map((l) => l.layer).join(', ')}) on the Stack tab.${gatewayHint(t)}`,
      actions: [{ type: 'open_tab', tab: 'stack' }],
      hint: { kind: 'question' },
    };
  }

  const top = items.slice(0, 4);
  const lead = nodes[0] && overlap(ctx.qt, `${nodes[0].label} ${nodes[0].tech}`, 1) > 0 ? nodes[0] : undefined;
  const lines = [
    `**${cat.title} in ${t.name}**`,
    lead ? `• On the map, **${lead.label}**${techNote(lead)} handles this: ${lowerFirst(firstSentence(lead.description, 20))}` : '',
    ...top.map(({ item }) => `• **${item.name}**: ${lowerFirst(item.role)} (${conf(item.confidence)})`),
    top[0] ? clipWords(ctx.detail && top[1] ? `${top[0].item.beginnerNote} ${top[1].item.beginnerNote}` : top[0].item.beginnerNote, ctx.detail ? 55 : 30) : '',
    nodes.length && !lead ? `On the System map: ${listJoin(nodes.slice(0, 4).map((n) => n.label))}.` : '',
    top.some(({ item }) => item.confidence === 'likely') ? 'LIKELY items are educated guesses; confirmed ones are publicly documented or detected.' : '',
  ];
  const layer = t.stack.find((l) => cat.layers.includes(l.layer))?.layer ?? top[0]?.layer;
  const questionMatchesNode = Boolean(lead) && cat.kinds.includes(nodes[0].kind);
  const useNode = nodes[0] && (cat.preferNode || questionMatchesNode || !layer);
  const actions: AgentAction[] = useNode ? [{ type: 'highlight_node', nodeId: nodes[0].id }] : layer ? [{ type: 'open_stack_layer', layer }] : [];
  return { text: lines.filter(Boolean).join('\n'), actions, hint: { kind: 'question', layer, nodeIds: nodes.map((n) => n.id) } };
}

/** How sure the stack is, in one line (empty when everything is confirmed). */
function likelyNote(t: Teardown) {
  const items = t.stack.flatMap((l) => l.items);
  const likely = items.filter((i) => i.confidence === 'likely').length;
  if (!likely) return '';
  if (likely === items.length) return `Everything here is marked LIKELY: typical choices for a ${t.category.toLowerCase()}, not confirmed facts about ${t.name}.`;
  return `${likely} of these ${items.length} items are marked LIKELY (educated guesses); the rest are confirmed.`;
}

function stackOverview(ctx: Ctx): Draft {
  const { t } = ctx;
  const langs = [...t.languages].sort((a, b) => b.share - a.share).slice(0, 3).map((l) => l.name);
  const lines = [
    `**How ${t.name} is built**, layer by layer:`,
    ...t.stack.slice(0, 6).map((l) => `• **${l.layer}:** ${listJoin(l.items.slice(0, 3).map((i) => i.name))}`),
    langs.length ? `Main languages: ${listJoin(langs)}.` : '',
    likelyNote(t),
    'Ask about any layer (“what database does it use?”) for the details.',
  ];
  return { text: lines.filter(Boolean).join('\n'), actions: [{ type: 'open_tab', tab: 'stack' }], hint: { kind: 'question' } };
}

function systemOverview(ctx: Ctx): Draft {
  const { t } = ctx;
  const tiers = ['Clients', 'Edge', 'API', 'Services', 'Data'];
  const lines = [
    `${firstSentence(t.eli5, 30)}`,
    `On the System map that becomes ${t.architecture.nodes.length} boxes, top to bottom:`,
    ...tiers
      .map((name, tier) => ({ name, list: t.architecture.nodes.filter((n) => n.tier === tier).map((n) => n.label) }))
      .filter((x) => x.list.length)
      .map((x) => `• **${x.name}:** ${listJoin(x.list.slice(0, 4))}`),
    t.architecture.flows.length ? `Trace a request to watch it move: ${listJoin(t.architecture.flows.map((f) => `“${f.title}”`))}.` : '',
  ];
  return { text: lines.filter(Boolean).join('\n'), actions: [{ type: 'open_tab', tab: 'system' }], hint: { kind: 'question' } };
}

/* ---------- flows ---------- */

const FLOW_NOISE = new Set(['walk', 'through', 'trace', 'step', 'flow', 'journey', 'process', 'behind', 'scenes', 'exactly', 'tap', 'happens', 'goes', 'go', 'system', 'request'].map(stem));
const STRONG_FLOW = /\b(what happens|what goes on|walk me through|walk through|step by step|behind the scenes|when (i|you|someone|somebody|a user|a student|people|my|your|we))\b/;
const WEAK_FLOW = /\b(how does .*\bwork|how do(es)? .* get|trace|the flow|journey|the process|what occurs)\b/;

function scoreFlows(ctx: Ctx, text: string) {
  const qt = tokens(stripName(ctx, text), ctx.nameStop).filter((tk) => !FLOW_NOISE.has(tk));
  return ctx.t.architecture.flows
    .map((f) => {
      const title = overlap(qt, f.title, 4);
      const body = Math.min(4, overlap(qt, f.steps.map((s) => s.narration).join(' '), 1));
      return { f, title, total: title + body };
    })
    .sort((a, b) => b.total - a.total);
}

function flowAnswer(ctx: Ctx, f: Flow): Draft {
  const { t } = ctx;
  const steps = f.steps.slice(0, 7);
  const lines = ctx.detail
    ? [
        `**${f.emoji} ${f.title}**: the boxes involved`,
        ...[...new Set(steps.flatMap((s) => [s.from, s.to]))].slice(0, 5).map((id) => {
          const n = t.architecture.nodes.find((x) => x.id === id);
          return `• **${n?.label ?? id}**: ${n ? firstSentence(n.description, 14) : ''}`;
        }),
        'Replaying the animation on the System map.',
      ]
    : [
        `**${f.emoji} ${f.title}**, in ${f.steps.length} hops (playing it on the System map now):`,
        ...steps.map((s, i) => `${i + 1}. **${nodeLabel(t, s.from)} → ${nodeLabel(t, s.to)}**: ${lowerFirst(shortClause(s.narration, 9))}`),
      ];
  const ids = [...new Set(f.steps.flatMap((s) => [s.from, s.to]))];
  return { text: lines.join('\n'), actions: [{ type: 'play_flow', flowId: f.id }], hint: { kind: 'question', flowId: f.id, nodeIds: ids } };
}

function noFlowAnswer(ctx: Ctx): Draft {
  const flows = ctx.t.architecture.flows;
  return {
    text: flows.length
      ? `This teardown doesn’t trace that exact journey, and I won’t make one up. The request flows it does animate are:\n${flows.map((f) => `• ${f.emoji} ${f.title}`).join('\n')}\nTap one below and I’ll play it step by step on the System map.`
      : `This teardown doesn’t include any animated request flows, so I can’t trace that one. The System tab still shows every box and what it talks to.`,
    actions: [{ type: 'open_tab', tab: 'system' }],
    hint: { kind: 'question' },
    suggestions: flows.slice(0, 3).map(flowQuestion),
  };
}

/* ---------- code ---------- */

const LANGS: [RegExp, RegExp][] = [
  [/\bsql\b|postgres|mysql/, /\bsql\b/i],
  [/\bpython\b|django/, /python/i],
  [/\bswift\b/, /swift/i],
  [/\bkotlin\b/, /kotlin/i],
  [/\bjava\b(?!script)/, /\bjava\b(?!script)/i],
  [/\bgolang\b|\bgo (code|snippet|service|version)\b|\bin go\b|\bthe go\b/, /^go\b/i],
  [/\bjavascript\b|\bjs\b|\bnode(\.js)?\b|\bjsx\b/, /javascript|node/i],
  [/\btypescript\b|\bts\b/, /typescript/i],
  [/\bruby\b|\brails\b/, /ruby/i],
  [/\bphp\b/, /php/i],
  [/\brust\b/, /rust/i],
  [/\bc\+\+|\bcpp\b/, /c\+\+/i],
  [/\bc#|\bcsharp\b/, /c#/i],
  [/\bhtml\b/, /html/i],
  [/\bcss\b/, /css/i],
  [/\bcql\b/, /cql/i],
  [/\bgraphql\b/, /graphql/i],
  [/\bdart\b|\bflutter\b/, /dart/i],
  [/\belixir\b/, /elixir/i],
  [/\bscala\b/, /scala/i],
  [/\bobjective-?c\b/, /objective-?c/i],
];
const LANG_NAMES = ['SQL', 'Python', 'Swift', 'Kotlin', 'Java', 'Go', 'JavaScript', 'TypeScript', 'Ruby', 'PHP', 'Rust', 'C++', 'C#', 'HTML', 'CSS', 'CQL', 'GraphQL', 'Dart', 'Elixir', 'Scala', 'Objective-C'];
const CODE_TRIGGER = /\b(code|codes|snippets?|coded|implement\w*|source|programmed|programming example|show me (the )?(sql|python|swift|kotlin|java|go|javascript|typescript|js|ts|ruby|php|css|html|rust))\b/;
const CODE_NOISE = new Set(['code', 'codes', 'snippet', 'coded', 'implement', 'implemented', 'implementation', 'source', 'example', 'program', 'written', 'function', 'file', 'look'].map(stem));

function codeReply(ctx: Ctx, s: CodeSample, lead: string): Draft {
  const others = ctx.t.code.filter((c) => c !== s).slice(0, 3);
  const lines = [
    `${lead}**${s.title}** · \`${s.file}\` · ${s.language}`,
    clipWords(s.explanation, 60),
    others.length ? `• **Other snippets:** ${others.map((c) => `${c.title} (${c.language.split(' (')[0]})`).join('; ')}` : '',
    'It’s open on the Code tab. Snippets are simplified teaching examples, not private source code.',
  ];
  return { text: lines.filter(Boolean).join('\n'), actions: [{ type: 'show_code', snippetId: s.id }], hint: { kind: 'question', snippetId: s.id } };
}

function codeAnswer(ctx: Ctx): Draft | null {
  const { t } = ctx;
  if (!t.code.length) return null;
  const l = ctx.lower;
  const langIdx = LANGS.findIndex(([q]) => q.test(l));
  const langRe = langIdx >= 0 ? LANGS[langIdx][1] : null;
  const qt = tokens(ctx.q, ctx.nameStop).filter((tk) => !CODE_NOISE.has(tk));
  const scored = t.code
    .map((s) => ({
      s,
      score: (langRe?.test(s.language) ? 6 : 0) + overlap(qt, s.title, 3) + overlap(qt, s.file.replace(/[/._-]/g, ' '), 1.5) + overlap(qt, s.explanation, 0.7) + overlap(qt, s.language, 2),
    }))
    .sort((a, b) => b.score - a.score);
  if (langRe && !t.code.some((s) => langRe.test(s.language))) {
    const have = [...new Set(t.code.map((s) => s.language.split(' (')[0]))];
    return {
      text: `There’s no ${LANG_NAMES[langIdx]} snippet in the ${t.name} teardown, and I won’t invent one. The teaching snippets it does include are written in ${listJoin(have)}:\n${t.code.slice(0, 4).map((s) => `• ${s.title} (${s.language.split(' (')[0]})`).join('\n')}`,
      actions: [{ type: 'open_tab', tab: 'code' }],
      hint: { kind: 'question' },
      suggestions: t.code.slice(0, 2).map((s) => codeQuestion(s, t.code)),
    };
  }
  let best = scored[0].score > 0 ? scored[0].s : undefined;
  if (!best) {
    const context = tokens(`${ctx.prevUser} ${ctx.prevAssistant}`, ctx.nameStop);
    const byContext = t.code.map((s) => ({ s, score: overlap(context, `${s.title} ${s.explanation}`, 1) })).sort((a, b) => b.score - a.score)[0];
    best = byContext && byContext.score >= 2 ? byContext.s : t.code[0];
  }
  return codeReply(ctx, best, '');
}

/* ---------- story, learn, honesty ---------- */

function historyAnswer(ctx: Ctx): Draft {
  const { t } = ctx;
  const l = ctx.lower;
  const factRe = /\b(own|owns|owned|owner|belongs|parent|acquired|bought)\b/.test(l)
    ? /parent|owner|acquir|company/i
    : /\b(who|founder|built|made|created|creator)\b/.test(l)
    ? /found|creat|ceo|parent|owner|company|built/i
    : /\b(when|old|year|launch|start)\b/.test(l)
      ? /found|launch|release|start|creat|year|went public/i
      : /found|launch|parent|owner|headquarter|ceo|company|went public/i;
  const facts = t.facts.filter((f) => factRe.test(f.label)).slice(0, 3);
  if (!t.history.length && !facts.length) {
    const known = t.facts.slice(0, 3).map((f) => `• **${f.label}:** ${f.value}`);
    return {
      text: `This ${t.source === 'scan' ? 'instant ' : ''}teardown doesn’t include company history for ${t.name}${t.source === 'scan' ? ', because it isn’t one of the products with verified facts in the offline library' : ''}, so I won’t guess who built it or when. Here’s what it does know:\n${known.join('\n')}`,
      actions: [{ type: 'open_tab', tab: 'story' }],
      hint: { kind: 'question' },
    };
  }
  const qt = tokens(ctx.q, ctx.nameStop).filter((tk) => !['found', 'built', 'history', 'company', 'start', 'old', 'launch', 'year', 'timelin', 'creat'].includes(tk));
  const matching = t.history.map((h, i) => ({ h, i, s: overlap(qt, `${h.year} ${h.title} ${h.detail}`, 1) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
  const n = t.history.length;
  const spaced = n <= 4 ? t.history.map((_, i) => i) : [0, Math.round(n / 3), Math.round((2 * n) / 3), n - 1];
  const picks = [...new Set([...matching.slice(0, 2).map((x) => x.i), ...spaced])].slice(0, 4).sort((a, b) => a - b);
  const focus = matching[0]?.h ?? t.history[0];
  const noCeo = /\b(ceo|boss|in charge|runs (it|the company)|leader)\b/.test(l) && !/\bceo\b/i.test(JSON.stringify([t.facts, t.history]));
  const lines = [
    `**The story of ${t.name}**`,
    noCeo ? `This teardown doesn’t say who runs ${t.name} today, so I won’t guess. Here’s who started it and who owns it:` : '',
    ...facts.map((f) => `• **${f.label}:** ${f.value}`),
    picks.length ? 'Milestones:' : '',
    ...picks.map((i) => `• **${t.history[i].year}:** ${t.history[i].title}`),
    focus ? clipWords(`${focus.year}: ${focus.detail}`, 32) : '',
  ];
  return { text: lines.filter(Boolean).join('\n'), actions: [{ type: 'open_tab', tab: 'story' }], hint: { kind: 'question' } };
}

function buildAnswer(ctx: Ctx): Draft {
  const { t } = ctx;
  const steps = t.buildYourOwn.slice(0, 6);
  if (!steps.length) return stackOverview(ctx);
  const lines = [
    `**Build your own ${t.name}-style project** in ${steps.length} steps:`,
    ...steps.map((s, i) => `${i + 1}. **${s.step}**: ${firstSentence(s.detail, 11).replace(/\.$/, '')}`),
    'Start small with step 1 today. The full roadmap is on the Learn tab.',
  ];
  return { text: lines.join('\n'), actions: [{ type: 'open_tab', tab: 'learn' }], hint: { kind: 'question' } };
}

function eli5Answer(ctx: Ctx): Draft {
  const { t } = ctx;
  return {
    text: `**${t.name} in plain English**\n${clipWords(t.eli5, 85)}\n• **In one line:** ${clipWords(t.tagline, 25)}\n• **Category:** ${t.category}`,
    actions: [{ type: 'open_tab', tab: 'story' }],
    hint: { kind: 'question' },
  };
}

function evidenceAnswer(ctx: Ctx): Draft {
  const { t } = ctx;
  const items = t.stack.flatMap((l) => l.items);
  const confirmed = items.filter((i) => i.confidence === 'confirmed');
  const likely = items.length - confirmed.length;
  if (t.source === 'curated') {
    return {
      text: `The ${t.name} teardown is **hand-checked**: it was written from public sources like engineering blogs, conference talks and Wikipedia.\n• **Confirmed** (${confirmed.length} stack items): publicly documented\n• **LIKELY** (${likely}): educated guesses based on how products like this are usually built\n• **Code snippets:** simplified teaching examples, not private source code\n${t.sources.length ? `Sources include ${listJoin(t.sources.slice(0, 3).map((s) => s.label))}; they’re listed on the Learn tab.` : ''}`,
      actions: [{ type: 'open_tab', tab: 'learn' }],
      hint: { kind: 'question' },
    };
  }
  if (t.source === 'scan') {
    return {
      text: `This is an **instant teardown**, built in milliseconds without AI.\n• **Confirmed** (${confirmed.length}): things a live scan of ${t.url || 'the site'} actually detected in its headers and HTML${confirmed.length ? `, like ${listJoin(confirmed.slice(0, 3).map((i) => i.name))}` : ''}, plus verified facts when the product is well known\n• **LIKELY** (${likely}): typical choices for a ${t.category.toLowerCase()}, so treat them as guesses\nThe system map, flows and code show a typical design for this kind of product, not ${t.name}’s private internals. The scan evidence is on the Stack tab.`,
      actions: [{ type: 'open_tab', tab: 'stack' }],
      hint: { kind: 'question' },
    };
  }
  return {
    text: `This teardown was **generated by Claude**, grounded in a live scan of ${t.url || 'the site'}.\n• **Confirmed** (${confirmed.length}): detected by the scan or publicly documented\n• **LIKELY** (${likely}): Claude’s educated guesses, clearly marked\nThink of it as a careful reconstruction, not insider knowledge. Code snippets are teaching examples. The scan evidence is on the Stack tab.`,
    actions: [{ type: 'open_tab', tab: 'stack' }],
    hint: { kind: 'question' },
  };
}

function helpAnswer(ctx: Ctx, greeting: boolean): Draft {
  const { t } = ctx;
  if (ctx.prevAssistant.includes('I’m your guide to how')) {
    const flow = t.architecture.flows[0];
    return {
      text: `Not sure what to ask? Tap a suggestion below, or try one of these:\n• “What does the ${lowerFirst(t.architecture.nodes.find((n) => n.tier === 1 || n.tier === 2)?.label ?? 'server')} do?”\n• “${flow ? flowQuestion(flow) : 'How does it work?'}”\n• “Make the corners rounder” or “dark mode” to remix the playground\nI answer only from this ${t.name} teardown, so I never make things up.`,
      actions: [],
      hint: { kind: 'help' },
      suggestions: rotate(starterSuggestions(t), 1),
    };
  }
  return {
    text: `${greeting ? 'Hi! ' : ''}I’m your guide to how **${t.name}** is built. I only use what’s in this teardown, and I can drive the screen for you:\n• **Ask** “what database does it use?” or “what happens when ${t.architecture.flows[0] ? lowerFirst(t.architecture.flows[0].title) : 'I tap a button'}?”\n• **Change the playground:** “make the brand color maroon”, “rounder corners”, “dark mode”\n• **Jump around:** “show me the code”, “who founded it?”, “how do I build my own?”`,
    actions: [],
    hint: { kind: 'help' },
    suggestions: starterSuggestions(t),
  };
}

function tabOverview(ctx: Ctx): Draft {
  switch (ctx.tab) {
    case 'stack':
      return stackOverview(ctx);
    case 'system':
      return systemOverview(ctx);
    case 'code': {
      const s = ctx.t.code[0];
      return s ? codeReply(ctx, s, 'Start with this one: ') : stackOverview(ctx);
    }
    case 'play': {
      const lines = controlsSummary(ctx);
      return {
        text: `**${ctx.t.playground.title}**\n${clipWords(ctx.t.playground.description, 45)}\n${lines.join('\n')}`,
        actions: [PLAY],
        hint: { kind: 'change' },
        suggestions: changeExamples(ctx).slice(0, 3),
      };
    }
    case 'learn':
      return buildAnswer(ctx);
    default:
      return eli5Answer(ctx);
  }
}

/* ---------- yes/no about a technology ---------- */

const YESNO_GENERIC = new Set(['host', 'hosted', 'deploy', 'deployed', 'store', 'stored', 'save', 'service', 'services', 'server', 'servers', 'app', 'system', 'tool', 'platform', 'cloud provider', 'tech', 'technology', 'thing', 'support', 'feature'].map(stem));

const YESNO_NOISE = new Set(['built', 'written', 'run', 'runs', 'still', 'anymore', 'ever', 'version', 'support', 'rely', 'on', 'have', 'has', 'kind', 'type', 'any', 'uses', 'use', 'using', 'used', 'made', 'power', 'powered'].map(stem));

function yesNoAnswer(ctx: Ctx): Draft | null {
  const l = ctx.lower;
  if (!/^(does|do|did|is|are|was|were|has|have|can)\b/.test(l) || !/\b(use|uses|using|used|run|runs|running|built|written|made|on|in|with|have|has|rely|powered)\b/.test(l)) return null;
  const termTokens = tokens(stripName(ctx, ctx.q), ctx.nameStop).filter((tk) => !YESNO_NOISE.has(tk));
  if (!termTokens.length) return null;
  const { t } = ctx;
  const lang = t.languages.find((lg) => tokens(lg.name).some((tk) => termTokens.includes(tk)));
  if (lang) return languageAnswer(ctx);
  // Every specific word must be covered, side by side: "google cloud" is not "Google Firebase Cloud Messaging"
  const specific = tokens(ctx.nameRe ? ctx.q.replace(ctx.nameRe, ' ') : ctx.q, ctx.nameStop).filter((tk) => !YESNO_NOISE.has(tk) && !YESNO_GENERIC.has(tk));
  const covers = (hay: string) => {
    if (!specific.length) return overlap(termTokens, hay, 1) > 0;
    const list = tokens(hay);
    const aliased = (tk: string) => ALIASES.some(([re, full]) => re.test(tk) && phrase(hay, full));
    if (!specific.every((tk) => list.includes(tk) || aliased(tk))) return false;
    if (specific.length < 2 || specific.some(aliased)) return true;
    return list.some((_, i) => specific.every((tk, j) => list[i + j] === tk));
  };
  const hits = findEntities(ctx, ctx.q).filter((e) => (e.kind === 'stack' && covers(e.item.name)) || (e.kind === 'node' && covers(`${e.node.label} ${e.node.tech}`)));
  if (hits.length) {
    const e = hits.find((h) => h.kind === 'stack') ?? hits[0];
    const draft = entityAnswer(ctx, e, hits);
    const likely = e.kind === 'stack' && e.item.confidence === 'likely';
    return { ...draft, text: `${likely ? 'Probably, but it’s marked LIKELY (a well-informed guess).' : 'Yes, according to this teardown.'}\n${draft.text}` };
  }
  const term = words(ctx.q).filter((w) => !STOP.has(w) && !YESNO_NOISE.has(stem(w)) && !ctx.nameStop.has(w)).join(' ');
  const cat = detectCategories(term)[0];
  if (cat && !SPECIFIC_TECH.test(term)) return null;
  const pretty = TECH_NAMES.find((n) => norm(n) === norm(term)) ?? term;
  const layer = cat && t.stack.find((l) => cat.layers.includes(l.layer));
  const overview = layer
    ? [
        `Its **${layer.layer}** layer lists ${listJoin(layer.items.slice(0, 4).map((i) => `${i.name} (${conf(i.confidence)})`))}.`,
        `Ask “tell me about ${layer.items[0].name.replace(/\s*\(.*?\)/g, '')}” to see what it does.`,
      ]
    : t.stack.slice(0, 4).map((l) => `• **${l.layer}:** ${listJoin(l.items.slice(0, 2).map((i) => i.name))}`);
  return {
    text: `This teardown doesn’t mention **${pretty}**, so I can’t say ${t.name} uses it (and I won’t guess). Here’s what it does list:\n${overview.join('\n')}`,
    actions: layer ? [{ type: 'open_stack_layer', layer: layer.layer }] : [{ type: 'open_tab', tab: 'stack' }],
    hint: { kind: 'question', layer: layer?.layer },
  };
}

const SPECIFIC_TECH =
  /\b(react|vue|angular|svelte|next ?js|redis|memcached|kafka|rabbitmq|celery|sidekiq|aws|azure|google cloud|gcp|cloudflare|mongo\w*|mysql|postgres\w*|firebase|firestore|supabase|dynamo\w*|kubernetes|k8s|docker|graphql|django|rails|laravel|flask|express|node|java|php|rust|elixir|swift|kotlin|python|ruby|golang|typescript|javascript|nginx|terraform|oracle|snowflake|bigquery|elasticsearch|spark|hadoop|pytorch|tensorflow|openai|stripe|webrtc|websockets?|electron|flutter|vercel|netlify|heroku|sqlite|jquery|wordpress|shopify)\b/;

const TECH_NAMES = [
  'MongoDB', 'React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Redis', 'Memcached', 'Kafka', 'RabbitMQ', 'Celery', 'AWS', 'Azure', 'Google Cloud',
  'Cloudflare', 'MySQL', 'PostgreSQL', 'Postgres', 'Firebase', 'Supabase', 'DynamoDB', 'Kubernetes', 'Docker', 'GraphQL', 'Django', 'Rails', 'Laravel',
  'Flask', 'Express', 'Node', 'Java', 'PHP', 'Rust', 'Elixir', 'Swift', 'Kotlin', 'Python', 'Ruby', 'TypeScript', 'JavaScript', 'nginx', 'Terraform',
  'Oracle', 'Snowflake', 'BigQuery', 'Elasticsearch', 'Spark', 'Hadoop', 'PyTorch', 'TensorFlow', 'OpenAI', 'Stripe', 'WebRTC', 'Electron',
  'Flutter', 'Vercel', 'Netlify', 'Heroku', 'SQLite', 'jQuery', 'WordPress', 'Shopify',
];

/* ---------- search fallback ---------- */

interface Doc {
  title: string;
  text: string;
  action: AgentAction;
  kind: string;
}

interface Index {
  docs: { doc: Doc; toks: Set<string>; titleToks: Set<string> }[];
  df: Map<string, number>;
}

const INDEX = new WeakMap<Teardown, Index>();

function indexOf(t: Teardown): Index {
  const cached = INDEX.get(t);
  if (cached) return cached;
  const docs: Doc[] = [
    { title: `${t.name} in plain English`, text: `${t.tagline} ${t.eli5}`, action: { type: 'open_tab', tab: 'story' }, kind: 'story' },
    ...t.facts.map((f) => ({ title: f.label, text: f.value, action: { type: 'open_tab', tab: 'story' } as AgentAction, kind: 'fact' })),
    ...t.history.map((h) => ({ title: `${h.year}: ${h.title}`, text: h.detail, action: { type: 'open_tab', tab: 'story' } as AgentAction, kind: 'history' })),
    ...t.languages.map((lg) => ({ title: lg.name, text: lg.usedFor, action: { type: 'open_tab', tab: 'stack' } as AgentAction, kind: 'language' })),
    ...t.stack.flatMap((l) => l.items.map((i) => ({ title: i.name, text: `${i.role}. ${i.beginnerNote}`, action: { type: 'open_stack_layer', layer: l.layer } as AgentAction, kind: 'stack' }))),
    ...t.architecture.nodes.map((n) => ({ title: n.label, text: `${n.tech}. ${n.description}`, action: { type: 'highlight_node', nodeId: n.id } as AgentAction, kind: 'node' })),
    ...t.architecture.flows.map((f) => ({ title: f.title, text: f.steps.map((s) => s.narration).join(' '), action: { type: 'play_flow', flowId: f.id } as AgentAction, kind: 'flow' })),
    ...t.code.map((c) => ({ title: c.title, text: `${c.file} ${c.language}. ${c.explanation}`, action: { type: 'show_code', snippetId: c.id } as AgentAction, kind: 'code' })),
    ...t.concepts.map((c) => ({ title: c.term, text: c.meaning, action: { type: 'show_concept', term: c.term } as AgentAction, kind: 'concept' })),
    ...t.buildYourOwn.map((b) => ({ title: b.step, text: b.detail, action: { type: 'open_tab', tab: 'learn' } as AgentAction, kind: 'build' })),
    ...t.files.map((f) => ({ title: f.path, text: f.note, action: { type: 'open_tab', tab: 'code' } as AgentAction, kind: 'file' })),
    { title: t.playground.title, text: `${t.playground.description} ${t.playground.challenges.join(' ')}`, action: PLAY, kind: 'playground' },
  ];
  const indexed = docs.map((doc) => ({ doc, toks: tokenSet(`${doc.title} ${doc.text}`), titleToks: tokenSet(doc.title) }));
  const df = new Map<string, number>();
  for (const d of indexed) for (const tk of d.toks) df.set(tk, (df.get(tk) ?? 0) + 1);
  const index = { docs: indexed, df };
  INDEX.set(t, index);
  return index;
}

function searchAnswer(ctx: Ctx): Draft {
  const { t } = ctx;
  const index = indexOf(t);
  const qt = [...new Set(tokens(stripName(ctx, ctx.q), ctx.nameStop))].filter((tk) => !/^\d{1,3}$/.test(tk));
  const n = index.docs.length;
  const scored = index.docs
    .map((d) => {
      let score = 0;
      for (const tk of qt) {
        if (!d.toks.has(tk)) continue;
        const idf = Math.log(1 + n / (index.df.get(tk) ?? 1));
        score += idf * (d.titleToks.has(tk) ? 1.6 : 1);
      }
      return { d, score };
    })
    .filter((x) => x.score >= 1.6)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) {
    return {
      text:
        ctx.prevAssistant.startsWith('I couldn’t find anything')
          ? `Still nothing about that in the ${t.name} teardown, sorry. I stick to what it covers so I never guess. Good things to ask: how one part of the system works, what happens when you use ${t.name}, which languages it’s written in, or ask me to remix the playground. Tap one:`
          : `I couldn’t find anything about that in the ${t.name} teardown, and I only answer from what’s in it rather than guessing. I can explain its tech stack, trace what happens when you use it, show code, tell its story, or change the playground. Try one of these:`,
      actions: [],
      hint: { kind: 'none' },
      suggestions: starterSuggestions(t),
    };
  }
  const picks: typeof scored = [];
  for (const s of scored) {
    if (picks.length === 3) break;
    if (picks.some((p) => p.d.doc.kind === s.d.doc.kind && p.d.doc.kind !== 'history')) continue;
    if (s.score < scored[0].score * 0.45) break;
    picks.push(s);
  }
  const lines = [
    `Here’s what the ${t.name} teardown says about that:`,
    ...picks.map((p) => `• **${p.d.doc.title}:** ${firstSentence(p.d.doc.text, 24)}`),
    picks.length < 3 ? `That’s the closest match I could find. For the big picture, ask “how does ${t.name} work?” or tap a suggestion below.` : '',
  ].filter(Boolean);
  const best = picks[0].d.doc;
  return {
    text: lines.join('\n'),
    actions: [best.action],
    hint: {
      kind: 'question',
      nodeIds: best.action.type === 'highlight_node' ? [best.action.nodeId] : undefined,
      flowId: best.action.type === 'play_flow' ? best.action.flowId : undefined,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Suggestions                                                         */
/* ------------------------------------------------------------------ */

function flowQuestion(f: Flow) {
  return /^(you|your|a|an|the|someone|somebody|people|students?|users?|riders?|drivers?)\b/i.test(f.title)
    ? `What happens when ${f.title.replace(/^\w+/, (w) => (/^(A|An|The|You|Your)$/.test(w) ? w.toLowerCase() : w))}?`
    : `Walk me through: ${f.title}`;
}

function codeQuestion(s: CodeSample, all: CodeSample[] = [s]) {
  const lang = s.language.split(' (')[0];
  const unique = all.filter((c) => c.language.split(' (')[0] === lang).length === 1;
  return unique && LANGS.some(([q]) => q.test(`show me the ${lang.toLowerCase()} code`)) ? `Show me the ${lang} code` : `Show me the code for “${s.title}”`;
}

const nodeQuestion = (n: ArchNode) => `Tell me about ${n.label}`;

function hasFounders(t: Teardown) {
  return t.history.length > 0 || t.facts.some((f) => /found|creat/i.test(f.label));
}

function genericQuestions(t: Teardown): string[] {
  const out: string[] = [];
  if (t.stack.some((l) => l.layer === 'Data') || t.architecture.nodes.some((n) => n.kind === 'database')) out.push(`What database does ${t.name} use?`);
  out.push(hasFounders(t) ? `Who founded ${t.name}?` : 'How do you know this?');
  if (t.code[0]) out.push(codeQuestion(t.code[0], t.code));
  if (t.buildYourOwn.length) out.push(`How do I build my own ${t.name}?`);
  out.push(`Explain ${t.name} simply`);
  if (t.languages.length) out.push(`What language is ${t.name} written in?`);
  return out;
}

function rotate<T>(list: T[], by: number) {
  if (!list.length) return list;
  const k = by % list.length;
  return [...list.slice(k), ...list.slice(0, k)];
}

function composeSuggestions(ctx: Ctx, hint: Hint): string[] {
  const { t } = ctx;
  if (hint.kind === 'help' || hint.kind === 'none') return starterSuggestions(t);
  const flows = t.architecture.flows;
  const qs: string[] = [];
  const interest = ['queue', 'cache', 'ml', 'database', 'storage', 'service', 'gateway', 'edge', 'external', 'client'];
  const kindOf = (id: string) => interest.indexOf(t.architecture.nodes.find((n) => n.id === id)?.kind ?? 'client');
  const candidates = hint.flowId ? [...(hint.nodeIds ?? [])].sort((a, b) => kindOf(a) - kindOf(b)) : (hint.nodeIds ?? []);
  for (const id of candidates) {
    const n = t.architecture.nodes.find((x) => x.id === id);
    if (n && !phrase(ctx.q, n.label) && !phrase(ctx.q, n.id.replace(/-/g, ' '))) {
      qs.push(nodeQuestion(n));
      break;
    }
  }
  const otherFlow = hint.flowId ? flows.find((f) => f.id !== hint.flowId) : flows[ctx.turn % Math.max(1, flows.length)];
  if (otherFlow) qs.push(flowQuestion(otherFlow));
  if (hint.snippetId) {
    const other = t.code.find((c) => c.id !== hint.snippetId);
    if (other) qs.unshift(codeQuestion(other, t.code));
  }
  qs.push(...rotate(genericQuestions(t), ctx.turn));
  const changes = rotate(changeExamples(ctx), ctx.turn);
  return hint.kind === 'change' ? [changes[0], changes[1], qs[0], qs[1]] : [qs[0], qs[1], changes[0]];
}

function finalSuggestions(ctx: Ctx, draft: Draft): string[] {
  const asked = new Set([norm(ctx.q), norm(ctx.prevUser)]);
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (s?: string) => {
    if (!s || out.length >= 4) return;
    const key = norm(s);
    if (!key || asked.has(key) || seen.has(key)) return;
    seen.add(key);
    out.push(s);
  };
  // Suggest from the playground as it will look after this reply, so we never offer "dark mode" right after dark mode
  let code = ctx.code;
  for (const a of draft.actions) {
    if (a.type === 'set_tweak') code = setTweak(code, a.name, a.value).code;
    if (a.type === 'edit_text') code = setEditableText(code, a.key, a.text).code;
    if (a.type === 'set_playground_code') code = a.code;
    if (a.type === 'reset_playground') code = ctx.t.playground.html;
  }
  const after: Ctx = code === ctx.code ? ctx : { ...ctx, code, tweaks: parseTweaks(code), keys: editableKeys(code) };
  const fresh = new Set(changeExamples(after).map(norm));
  const isChangePrompt = (x: string) => /^(Make|Switch|Change|Add) /.test(x);
  (draft.suggestions?.length ? draft.suggestions : composeSuggestions(after, draft.hint)).filter((x) => !isChangePrompt(x) || fresh.has(norm(x))).forEach(add);
  if (out.length < 3) [...genericQuestions(ctx.t), ...changeExamples(after)].forEach((s) => out.length < 3 && add(s));
  return out;
}

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

const SHOW_ME =
  /^(?:(?:ok(?:ay)?|yes|yeah|yep|sure|cool|great|nice|please|pls|can you|could you|now)[,!\s]+)*(show (me|it|that|this|them)( that| it| please)?|where is (it|that)|open (it|that)|go there|take me there|let me see( it| that)?|see it|visuali[sz]e (it|that)|highlight (it|that)|point to it)[.!?\s]*$/;
const MORE =
  /^(?:(?:ok(?:ay)?|yes|yeah|sure|cool|great|nice|and|so|interesting)[,!\s]+)*(tell me more|more|more please|go deeper|more details?|explain (more|further|that( more)?)|elaborate|keep going|continue|go on|what else|details|why)[.!?\s]*$/;
const ACK = /^(yes|yeah|yep|sure|ok(ay)?|cool|great|nice|thanks|thank you|thx|ty|awesome|got it|perfect|wow|neat)[.!\s]*$/;
const GREETING = /^(hi|hey|hello|yo|sup|hiya|howdy|good (morning|afternoon|evening)|hola|greetings)\b/;
const HELP = /^(help|help me|what can you do|what can i (ask|say|do)|how do(es)? (this|you) work|who are you|what are you|commands|options|\?+)[.!?\s]*$/;
const CONTROLS = /\b(what can (i|you) (change|edit|tweak)|what('s| is) (editable|tweakable)|list (the )?controls|which controls|available controls|what controls)\b/;
const EVIDENCE =
  /\b(how do (you|we) know|is (this|it|that) (real|true|accurate|right|correct|legit)|evidence|proof|sources?|made up|trust (this|you)|accurate|accuracy|what does likely mean|where (does|did) (this|the data|it|that) come from|how (was|is) this (made|generated|built|created)|hallucinat\w*|verified|is this ai)\b/;
const ELI5 =
  /\b(eli5|explain (it |this |that )?(like|simply|in simple)|like i'?m (5|five|new)|in simple (terms|words)|simple explanation|simply|summary|summari[sz]e|tl;?dr|overview|in a nutshell|big picture|basics)\b|^(what is (it|this)( app| site| website| product| service| company)?|what does (it|this)( app| site)? do|what('s| is) it about)[.!?\s]*$/;
const HISTORY =
  /\b(who (built|made|created|founded|started|owns|runs|invented|designed|makes)|founders?|founded|co-?founders?|history|how old|when (was|were|did)|timeline|ceo|launched|launch date|owner|owns|parent company|headquarter\w*|hq|backstory|story of|origins?|went public|ipo|acquired|bought|owned|belongs to)\b/;
const BUILD =
  /\b(build (my own|your own|one|this|it|something like|a clone|a version|an? app like|my|a mini)|my own|clone|where (do|should) i start|how (do|can|would|should) i (make|build|create|start|code|learn)|roadmap|get started|learn to build|make (my own|one like|something like))\b/;
const TAB_THIS = /^(explain this|what am i looking at|what('s| is) this( tab| screen| page)|what('s| is) (going on|this) here|help me understand( this)?|what does this (tab|screen|page) (show|mean))[.!?\s]*$/;
const OVERVIEW = /\b(built with|tech stack|the stack|technolog(y|ies)|made with|tools|under the hood|how (is|was) it (built|made)|what (does|do) (it|they) (use|run on))\b/;
const HOW_WORKS = /^how does (it|everything|the app|the site|the system) work[.!?\s]*$/;

function answer(ctx: Ctx): Draft {
  const l = ctx.lower;
  const li = ctx.lowerIt;
  if (!l.trim() || HELP.test(li) || (GREETING.test(l) && countWords(l) <= 4)) return helpAnswer(ctx, GREETING.test(l));
  if (CONTROLS.test(l)) return controlsReply(ctx, 'Sure!');

  const off = offTopicAnswer(ctx);
  if (off) return off;
  if (IDENTITY.test(l)) return identityAnswer(ctx);
  if (QUIZ.test(l)) return quizAnswer(ctx);
  if (FUN_FACT.test(l)) return funFactAnswer(ctx);
  const change = tryChange(ctx);
  if (change) return change;
  const other = otherProductAnswer(ctx);
  if (other) return other;
  const numbers = factsAnswer(ctx);
  if (numbers) return numbers;

  if (EVIDENCE.test(li)) return evidenceAnswer(ctx);
  if (TAB_THIS.test(li)) return tabOverview(ctx);
  if (BUILD.test(li)) return buildAnswer(ctx);
  if (HISTORY.test(li) && !STRONG_FLOW.test(li)) return historyAnswer(ctx);

  const entities = findEntities(ctx, ctx.q);
  const bestEntity = entities[0];
  const compared = COMPARE.test(l) && !STRONG_FLOW.test(l) ? compareAnswer(ctx, entities) : null;
  if (compared) return compared;
  const strongEntity = bestEntity && bestEntity.exact && bestEntity.score >= 10;
  if (ELI5.test(li)) return strongEntity && !/^(what is|what does)/.test(li) ? entityAnswer(ctx, bestEntity, entities) : eli5Answer(ctx);
  if (HOW_WORKS.test(li)) return systemOverview(ctx);
  const bareLanguage = countWords(l) <= 3 && LANGS.some(([q]) => q.test(l)) && !/\b(written|language)\b/.test(l) && !QUESTION_START.test(l) && !COMPARE.test(l);
  if (CODE_TRIGGER.test(li) || bareLanguage) {
    const code = codeAnswer(ctx);
    if (code) return code;
  }

  const bestFlow = scoreFlows(ctx, ctx.q)[0];
  if (STRONG_FLOW.test(li)) return bestFlow && bestFlow.total >= 2 ? flowAnswer(ctx, bestFlow.f) : noFlowAnswer(ctx);
  if (bestFlow && WEAK_FLOW.test(li) && !SPEED.test(li) && (bestFlow.title >= 4 || (bestFlow.total >= 2 && (bestEntity?.score ?? 0) < 8))) return flowAnswer(ctx, bestFlow.f);

  const yesNo = yesNoAnswer(ctx);
  if (yesNo) return yesNo;
  if (strongEntity) return entityAnswer(ctx, bestEntity, entities);
  const cats = detectCategories(li);
  if (cats.length) return categoryAnswer(ctx, cats[0]);
  if (OVERVIEW.test(li)) return stackOverview(ctx);
  if (bestFlow && bestFlow.title >= 8) return flowAnswer(ctx, bestFlow.f);
  if (bestEntity && bestEntity.score >= 4) return entityAnswer(ctx, bestEntity, entities);
  if (bestFlow && bestFlow.title >= 4) return flowAnswer(ctx, bestFlow.f);
  return searchAnswer(ctx);
}

/* ---------- identity, quizzes, fun facts, comparisons ---------- */

const IDENTITY = /\b(are|r) (you|u) (an? )?(ai|bot|robot|human|real|person|chatgpt|gpt|claude|openai|gemini|siri|alive)\b|^(who|what) (made|built|created|powers) (you|this chat|this bot)\b/;
const QUIZ = /^(quiz me|test me|give me a quiz|ask me a question|quiz|flashcards?)\b|\b(quiz|test) me\b/;
const FUN_FACT = /\b((fun|cool|interesting|random|surprising|crazy|wild) facts?|surprise me|tell me something (cool|interesting|new|fun))\b/;
const COMPARE = /\b(difference|differences|differ|vs\.?|versus|compare\w*|better than)\b|^(\S+\s+){0,2}\S+ or \S+(\s+\S+)?[?!.]*$/;

function identityAnswer(ctx: Ctx): Draft {
  const { t } = ctx;
  return {
    text: `I’m Ask Teardown, the guide built into this app. Right now I’m running in instant mode: I answer only from the **${t.name}** teardown on your screen, so I don’t browse the web or make things up. I can explain how it’s built, trace what happens when you use it, show code and remix the playground.`,
    actions: [],
    hint: { kind: 'help' },
    suggestions: starterSuggestions(t),
  };
}

function quizAnswer(ctx: Ctx): Draft {
  const { t } = ctx;
  const c = t.concepts[ctx.turn % Math.max(1, t.concepts.length)];
  if (!c) return helpAnswer(ctx, false);
  const where = findEntities(ctx, c.term).find((e) => e.kind === 'node' && e.score >= 4);
  return {
    text: `Pop quiz! 🧠 Here’s an interview-style question from the ${t.name} teardown:\n**What does “${c.term}” mean${where?.kind === 'node' ? `, and why would ${where.node.label} need it` : `, and why would ${t.name} need it`}?**\nSay your answer out loud (or type it), then tap “What is ${c.term.replace(/\s*\(.*?\)/g, '')}?” below to check yourself. Say “quiz me” again for another question.`,
    actions: [],
    hint: { kind: 'question' },
    suggestions: [`What is ${c.term.replace(/\s*\(.*?\)/g, '')}?`, 'Quiz me again', ...starterSuggestions(t).slice(0, 2)],
  };
}

function funFactAnswer(ctx: Ctx): Draft {
  const { t } = ctx;
  const known = t.facts.find((f) => /known for|fun|record|famous/i.test(f.label));
  const h = t.history.length ? t.history[(ctx.turn * 3) % t.history.length] : undefined;
  if (!known && !h) {
    const item = t.stack.flatMap((l) => l.items)[ctx.turn % Math.max(1, t.stack.flatMap((l) => l.items).length)];
    return {
      text: item
        ? `Here’s one from this teardown: **${item.name}** (${item.confidence === 'likely' ? 'LIKELY' : 'confirmed'}) is used for ${lowerFirst(item.role)}. ${firstSentence(item.beginnerNote, 30)} Ask “how do you know this?” to see how sure it is.`
        : `This teardown is too thin for a fun fact, so I won’t invent one. Ask how ${t.name} works instead.`,
      actions: [{ type: 'open_tab', tab: 'stack' }],
      hint: { kind: 'question' },
    };
  }
  const lines = [
    `Here’s a fun one from the ${t.name} teardown:`,
    known && ctx.turn % 2 === 1 ? `• **${known.label}:** ${known.value}` : '',
    h ? `• **${h.year}, ${h.title}:** ${firstSentence(h.detail, 32)}` : '',
    known && ctx.turn % 2 === 0 ? `• **${known.label}:** ${known.value}` : '',
    'Say “fun fact” again for another one, or check the timeline on the Story tab.',
  ];
  return { text: lines.filter(Boolean).join('\n'), actions: [{ type: 'open_tab', tab: 'story' }], hint: { kind: 'question' } };
}

/** "difference between postgres and cassandra": two named things side by side. */
function compareAnswer(ctx: Ctx, entities: Entity[]): Draft | null {
  const name = (e: Entity) => (e.kind === 'node' ? e.node.label : e.kind === 'stack' ? e.item.name : e.kind === 'concept' ? e.term : e.snippet.title);
  const strong = entities.filter((e) => e.kind !== 'code' && e.score >= 6);
  const first = strong[0];
  if (!first) return null;
  const firstToks = new Set(tokens(`${name(first)} ${first.kind === 'node' ? first.node.tech : ''}`));
  const second = strong.find((e) => e !== first && !tokens(name(e)).some((tk) => firstToks.has(tk)));
  if (!second) return null;
  const describe = (e: Entity) =>
    e.kind === 'node'
      ? `• **${e.node.label}**${techNote(e.node)}: ${lowerFirst(firstSentence(e.node.description, 28))}`
      : e.kind === 'stack'
        ? `• **${e.item.name}** (${e.layer} layer, ${conf(e.item.confidence)}): ${lowerFirst(e.item.role)}. ${firstSentence(e.item.beginnerNote, 24)}`
        : e.kind === 'concept'
          ? `• **${e.term}**: ${firstSentence(e.meaning, 28)}`
          : '';
  const action: AgentAction = first.kind === 'node' ? { type: 'highlight_node', nodeId: first.node.id } : first.kind === 'stack' ? { type: 'open_stack_layer', layer: first.layer } : { type: 'open_tab', tab: 'learn' };
  return {
    text: `**${name(first)} vs ${name(second)}** in ${ctx.t.name}:\n${describe(first)}\n${describe(second)}\nBoth are part of this ${ctx.t.name} teardown, so ask about either one to go deeper.`,
    actions: [action],
    hint: { kind: 'question', nodeIds: [first, second].flatMap((e) => (e.kind === 'node' ? [e.node.id] : [])) },
  };
}

/* ---------- off-topic, other products, numbers ---------- */

const OFF_TOPIC =
  /\b(weather|forecast|essays?|homework|assignments?|poems?|poetry|haiku|lyrics|jokes?|riddles?|recipes?|capital of|president|elections?|politics|stock price|bitcoin|crypto(currency)?|horoscope|girlfriend|boyfriend|dating|football|basketball|baseball|soccer|nba|nfl|super bowl|cover letter|my resume|math problem|solve for|calculus|what time is it|what day is it|meaning of life|tell me a story|write (me )?(a|an|my) (story|song|paper|report|letter|email))\b/;

function offTopicAnswer(ctx: Ctx): Draft | null {
  const m = ctx.lower.match(OFF_TOPIC);
  if (!m) return null;
  const { t } = ctx;
  // A weather app's (or a school app's "homework") teardown can talk about it
  if (lexiconOf(t).source.includes(m[0].toLowerCase())) return null;
  const flow = t.architecture.flows[0];
  return {
    text: ctx.prevAssistant.startsWith('That’s outside')
      ? `Still outside my lane, sorry! I only know how **${t.name}** is built, so I can’t help with that and I won’t make something up. I’m great at explaining its system map, stack and code, or remixing the playground (“dark mode”, “make the corners rounder”). Pick one below:`
      : `That’s outside what I can help with. I’m the guide for how **${t.name}** is built, so I stick to its tech, system design, code, story and playground, and I won’t make up an answer. I can walk you through ${flow ? `what happens when ${lowerFirst(flow.title)}` : 'how it works'}, explain its database, or remix the playground. Try one of these:`,
    actions: [],
    hint: { kind: 'none' },
    suggestions: starterSuggestions(t),
  };
}

const PRODUCTS = [
  'Instagram', 'Facebook', 'Netflix', 'Discord', 'Spotify', 'WhatsApp', 'YouTube', 'TikTok', 'Twitter', 'Reddit', 'Amazon', 'Google', 'ChatGPT',
  'Uber', 'Lyft', 'Snapchat', 'LinkedIn', 'Twitch', 'Pinterest', 'Airbnb', 'DoorDash', 'GitHub', 'Duolingo', 'Telegram', 'Hulu', 'Roblox',
  'Minecraft', 'Fortnite', 'Gmail', 'Venmo', 'PayPal', 'Shopify', 'Figma', 'Canva', 'Tinder', 'SoundCloud', 'Wikipedia', 'Yelp', 'Instacart',
  'Robinhood', 'Coinbase', 'Dropbox', 'Outlook', 'Bing', 'Firefox', 'Xbox', 'PlayStation', 'BeReal', 'Grubhub', 'Disney+', 'Apple Music',
];

/** "what is TikTok built with" inside the Instagram teardown: say so instead of answering about the wrong product. */
function otherProductAnswer(ctx: Ctx): Draft | null {
  const { t } = ctx;
  const { source } = lexiconOf(t);
  const comparing = /\b(different|difference|differ|compare\w*|vs|versus|better|worse|faster|slower|same as|similar)\b/.test(ctx.lower);
  const other = PRODUCTS.find((p) => {
    const name = p.toLowerCase().replace(/[+]/g, '\\+');
    const mentioned = new RegExp(`\\b${name}(?![\\w+])`).test(ctx.lower);
    const via = comparing ? '' : `\\b(with|via|through|using|to|into|from|on|in|like)\\s+${name}\\b|`;
    const integration = new RegExp(`${via}\\b${name}\\s+(cloud|analytics|maps|fonts|ads|play|pay|login|sign|auth|s3|web services|workspace|drive|firebase|api|account|style|colou?rs?)\\b`).test(ctx.lower);
    return mentioned && !integration && !source.includes(p.toLowerCase());
  });
  if (!other || norm(other) === norm(t.name)) return null;
  const aboutThis = (ctx.nameRe && new RegExp(ctx.nameRe.source, 'i').test(ctx.q)) || /\b(it|this|this app|this site)\b/.test(ctx.lower);
  if (aboutThis) {
    if (!comparing) return null;
    return {
      text: `I can only speak for **${t.name}** here, because ${other} isn’t part of this teardown (and I won’t guess about it). Here’s the ${t.name} side, so you can compare after searching ${other} on the home screen:\n${t.stack.slice(0, 4).map((l) => `• **${l.layer}:** ${listJoin(l.items.slice(0, 3).map((i) => i.name))}`).join('\n')}`,
      actions: [{ type: 'open_tab', tab: 'stack' }],
      hint: { kind: 'question' },
    };
  }
  return {
    text: `This chat is about the **${t.name}** teardown, so I can’t tell you how ${other} is built from here (and I won’t guess). To see ${other}, go back to the home screen and search for it: you’ll get its own teardown. Meanwhile, ask me anything about ${t.name}:`,
    actions: [],
    hint: { kind: 'none' },
    suggestions: starterSuggestions(t),
  };
}

const COUNT_Q = /\b(how many|number of|how (big|popular|large) is|user ?base|how much traffic)\b/;
const PEOPLE_Q = /\b(users?|subscribers?|members?|memberships?|customers?|people|accounts?|downloads?|players?|listeners?|creators?|drivers?|riders?|messages?|countries|downloads?)\b/;
const MONEY_Q =
  /\b(make money|makes money|making money|how much money|revenue|profits?|profitable|earnings|net worth|valuation|funding|investors?|salary|salaries|how much (does|do|is|did|will) (it|they|this|that|\w+) (cost|charge|make|earn|worth)|is it free|how much is (a|the|it) ?(subscription|plan|membership|premium)?)\b/;

/** User counts and money: answer only from the facts, and say so when they're missing. */
function factsAnswer(ctx: Ctx): Draft | null {
  const { t } = ctx;
  const l = ctx.lowerIt;
  const counting = (COUNT_Q.test(l) && PEOPLE_Q.test(l)) || /\b(how popular|who uses (it|this))\b/.test(l);
  const money = !counting && MONEY_Q.test(l) && !CODE_TRIGGER.test(l);
  if (!counting && !money) return null;
  const re = counting
    ? /user|member|subscri|customer|account|monthly|daily|people|download|player|listener|creator|driver|rider|message|countr|available/i
    : /\b(revenue|valuation|net worth|pric(e|es|ing)|costs?|funding|profits?|earnings|ads|advertis\w*|subscriptions?|ipo|went public)\b|\$\d/i;
  const facts = t.facts.filter((f) => re.test(f.label) && (!counting || /\d|billion|million|trillion|thousand/i.test(f.value)));
  const milestones = facts.length ? [] : t.history.filter((h) => re.test(`${h.title} ${h.detail}`)).slice(0, 2);
  // A little context for a lone number ("Launched: October 2010")
  if (facts.length === 1) facts.push(...t.facts.filter((f) => !facts.includes(f) && /^(launched|founded|available in|headquarters)$/i.test(f.label)).slice(0, 2));
  const what = counting ? 'user numbers' : 'money figures (like revenue or prices)';
  if (!facts.length && !milestones.length) {
    return {
      text: `This teardown doesn’t include ${what} for ${t.name}, so I won’t guess. It’s about how ${t.name} is built rather than its business. Here’s what it does know:\n${t.facts.slice(0, 3).map((f) => `• **${f.label}:** ${f.value}`).join('\n')}\nThe Story tab has the rest.`,
      actions: [{ type: 'open_tab', tab: 'story' }],
      hint: { kind: 'question' },
    };
  }
  const lines = [
    facts.length ? `Here’s what the ${t.name} teardown lists:` : `This teardown doesn’t list exact ${what} for ${t.name}, but these milestones are related:`,
    ...facts.map((f) => `• **${f.label}:** ${f.value}`),
    ...milestones.map((h) => `• **${h.year}, ${h.title}:** ${firstSentence(h.detail, 20)}`),
    facts.length ? 'Numbers like these change often, so treat them as a snapshot from when the teardown was written. More facts are on the Story tab.' : 'The full timeline is on the Story tab.',
  ];
  return { text: lines.join('\n'), actions: [{ type: 'open_tab', tab: 'story' }], hint: { kind: 'question' } };
}

/** "tell me more" when the first answer already said everything: go one level out instead of repeating it. */
function deeperAnswer(ctx: Ctx, prev: Draft): Draft {
  const { t } = ctx;
  const a = prev.actions.find((x) => x.type !== 'open_tab');
  if (a?.type === 'highlight_node') {
    const n = t.architecture.nodes.find((x) => x.id === a.nodeId);
    if (n) {
      const near = neighbours(t, n.id).map((id) => t.architecture.nodes.find((x) => x.id === id)).filter((x): x is ArchNode => Boolean(x)).slice(0, 3);
      const edge = (m: ArchNode) => t.architecture.edges.find((e) => (e.from === n.id && e.to === m.id) || (e.to === n.id && e.from === m.id))?.label;
      const lines = [
        `**Going deeper on ${n.label}**${techNote(n)}`,
        clipWords(n.description, 50),
        near.length ? 'The boxes it works with:' : '',
        ...near.map((m) => `• **${m.label}**${edge(m) ? ` (${edge(m)})` : ''}: ${lowerFirst(firstSentence(m.description, 16))}`),
        'Tap those boxes on the System map to keep following the arrows.',
      ];
      return { text: lines.filter(Boolean).join('\n'), actions: [a], hint: { kind: 'question', nodeIds: near.map((m) => m.id) } };
    }
  }
  if (a?.type === 'open_stack_layer') {
    const layer = t.stack.find((l) => l.layer === a.layer);
    if (layer) {
      const lines = [
        `**Everything in the ${layer.layer} layer**`,
        ...layer.items.slice(0, 4).map((i) => `• **${i.name}** (${conf(i.confidence)}): ${firstSentence(i.beginnerNote, 18)}`),
        'Tap an item on the Stack tab to read its full note.',
      ];
      return { text: lines.join('\n'), actions: [a], hint: { kind: 'question', layer: layer.layer } };
    }
  }
  if (a?.type === 'show_code') {
    const c = t.code.find((x) => x.id === a.snippetId);
    const file = c && t.files.find((f) => c.file.includes(f.path.replace(/\/$/, '')) || f.path.includes(c.file));
    if (c) {
      const text = `**More on ${c.title}**\n${clipWords(c.explanation, 90)}${file ? `\n• **Where it lives:** \`${file.path}\`, ${lowerFirst(file.note)}` : ''}\nRead it line by line on the Code tab; it’s a simplified teaching example, not private source code.`;
      return { text, actions: [a], hint: { kind: 'question', snippetId: c.id } };
    }
  }
  const lines = [
    'That’s everything this teardown says about that, and I won’t pad it with guesses. The closest parts worth exploring:',
    ...t.stack.slice(0, 4).map((l) => `• **${l.layer}:** ${listJoin(l.items.slice(0, 3).map((i) => i.name))}`),
    'Ask about any of them, or tap a suggestion.',
  ];
  return { text: lines.join('\n'), actions: [{ type: 'open_tab', tab: 'stack' }], hint: { kind: 'question' } };
}

function showMeText(ctx: Ctx, draft: Draft): string {
  const { t } = ctx;
  const a = [...draft.actions].reverse().find((x) => x.type !== 'open_tab') ?? draft.actions[0];
  switch (a?.type) {
    case 'highlight_node': {
      const n = t.architecture.nodes.find((x) => x.id === a.nodeId)!;
      const near = neighbours(t, n.id).map((id) => nodeLabel(t, id)).slice(0, 4);
      return `Here it is: **${n.label}** is highlighted on the System map. ${firstSentence(n.description, 25)}${near.length ? ` It’s connected to ${listJoin(near)}: tap those boxes to follow the arrows.` : ' Tap the boxes around it to follow the arrows.'}`;
    }
    case 'play_flow': {
      const f = t.architecture.flows.find((x) => x.id === a.flowId)!;
      return `Playing **${f.emoji} ${f.title}** on the System map. Watch the packet hop between ${f.steps.length} boxes, and tap any box to read what it does.`;
    }
    case 'show_code': {
      const s = t.code.find((x) => x.id === a.snippetId)!;
      return `Opened **${s.title}** (\`${s.file}\`) on the Code tab. ${firstSentence(s.explanation, 25)}`;
    }
    case 'open_stack_layer': {
      const layer = t.stack.find((x) => x.layer === a.layer)!;
      const first = layer.items[0];
      return `Opened the **${layer.layer}** layer on the Stack tab: ${listJoin(layer.items.slice(0, 4).map((i) => i.name))}.${first ? ` Start with **${first.name}**, ${lowerFirst(first.role)}: ${firstSentence(first.beginnerNote, 22)}` : ''} Tap an item to see its beginner note and whether it’s confirmed or LIKELY.`;
    }
    case 'show_concept': {
      const c = t.concepts.find((x) => x.term === a.term)!;
      return `Opened **${c.term}** on the Learn tab. ${firstSentence(c.meaning, 30)}`;
    }
    case 'set_tweak':
    case 'edit_text':
    case 'set_playground_code':
    case 'reset_playground':
      return 'It’s on the Playground tab, which I opened for you. Flip to the Code view to see the exact line that changed.';
    case 'open_tab':
      return draft.text;
    default:
      return draft.text;
  }
}

/* ------------------------------------------------------------------ */
/* Messy input: slang, typos and rambling                              */
/* ------------------------------------------------------------------ */

const SLANG: [RegExp, string][] = [
  [/\bu\b/g, 'you'], [/\bur\b/g, 'your'], [/\b(pls|plz|plez|plss)\b/g, 'please'], [/\b(wat|wut|wht|wha)\b/g, 'what'],
  [/\bhw\b/g, 'how'], [/\babt\b/g, 'about'], [/\b(bc|cuz|coz)\b/g, 'because'], [/\bwhats\b/g, 'what is'], [/\bhows\b/g, 'how is'],
  [/\bwheres\b/g, 'where is'], [/\bwhos\b/g, 'who is'], [/\bppl\b/g, 'people'], [/\bmsgs\b/g, 'messages'], [/\bmsg\b/g, 'message'],
  [/\bpics\b/g, 'photos'], [/\bpic\b/g, 'photo'], [/\bvids\b/g, 'videos'], [/\bvid\b/g, 'video'], [/\balgos?\b/g, 'algorithm'],
  [/\bbtns?\b/g, 'button'], [/\bdoesnt\b/g, "doesn't"], [/\bdont\b/g, "don't"], [/\bidk\b/g, "i don't know"], [/\bthru\b/g, 'through'],
];

const CORE_VOCAB = (
  'database databases video videos ' +
  'stream streaming streams recommendation recommendations recommend algorithm algorithms background button buttons corner corners rounder ' +
  'rounded bigger smaller larger taller shorter wider language languages written founded founder founders frontend backend server servers ' +
  'storage stored cache caching queue queues security secure login password passwords history python javascript typescript kotlin swift ' +
  'purple orange yellow maroon green black white header footer headline title spacing avatar playground happens happen message messages ' +
  'notification notifications photo photos upload account architecture microservices kubernetes docker django postgres postgresql cassandra ' +
  'explain infrastructure hosting hosted deploy deployed framework frameworks library libraries react android iphone mobile website search ' +
  'machine learning payment payments subscribers users feed timeline profile comment comments likes share delivery network balancer technology ' +
  'technologies stack system diagram code snippet snippets concept concepts interview build clone private encryption encrypted scale scaling ' +
  'sharding replication realtime process servers radius change rename delete remove color colour colors colours text bigger dark light mode ' +
  'company created started launched sign signup menu section navigation'
).split(/\s+/);

/** Real words that sit one letter away from a vocabulary word and must never be "fixed". */
const COMMON = new Set(
  (
    'about above after again along always another around because before being below better between bottom build built buying called ' +
    'cannot change could crazy doing during early every first funded funny going great happy having hello later least little looks maybe ' +
    'money never other people places please pretty quick really right roles saved says second seems since small sorry start still ' +
    'story takes thanks their there these thing things think those three today under until using wants water where which while whole ' +
    'works world would write wrong years yours styles style titled title tiles later layer rider riders store stores share shared ' +
    'posts poster hosts moves games gamer times timer liked likes lines links loads makes named names notes paper parts phone plans ' +
    'plays point ports price prints rates reads saves scene sends shows sites sizes skins songs sorts spots stars steps tasks teams ' +
    'tools turns types views votes waits walks words discard stats state states'
  ).split(/\s+/),
);

interface Lexicon {
  known: Set<string>;
  vocab: string[];
  /** The whole teardown as lowercase text, for "is this mentioned anywhere?" checks */
  source: string;
  /** Words its prose writes in lowercase */
  lower: Set<string>;
}

const LEXICON = new WeakMap<Teardown, Lexicon>();

function lexiconOf(t: Teardown): Lexicon {
  const cached = LEXICON.get(t);
  if (cached) return cached;
  const source = JSON.stringify(t).toLowerCase();
  const all = source.match(/[a-z]+/g) ?? [];
  const names = [t.name, t.url, ...t.stack.flatMap((l) => l.items.map((i) => i.name)), ...t.architecture.nodes.map((n) => n.label), ...t.architecture.flows.map((f) => f.title), ...t.concepts.map((c) => c.term), ...t.languages.map((l) => l.name)]
    .join(' ')
    .toLowerCase()
    .match(/[a-z]+/g) ?? [];
  const vocab = [...new Set([...CORE_VOCAB, ...names])].filter((w) => w.length >= 5);
  const prose = JSON.stringify(t, (k, v) => (['id', 'from', 'to', 'file', 'path', 'url', 'code', 'html', 'nodeId', 'flowId'].includes(k) ? undefined : v));
  const lower = new Set([...(prose.match(/(?<![A-Za-z])[a-z]+/g) ?? []), 'you', 'your', 'the', 'a', 'an', 'it', 'its', 'this', 'that', 'they', 'we']);
  const lex = { known: new Set([...all, ...CORE_VOCAB, ...COMMON, ...agentWords()]), vocab, source, lower };
  LEXICON.set(t, lex);
  return lex;
}

let AGENT_WORDS: string[] | null = null;

/** Every word the router's own patterns understand ("sharp", "rounder", "lavender"), so typo fixing never rewrites them. */
function agentWords() {
  AGENT_WORDS ??= [
    UP_WORDS, DOWN_WORDS, ROUND_WORDS, SQUARE_WORDS, SHADE_WORDS, MUCH, CHANGE_START, QUESTION_START, PLAYGROUND_WORDS, SPEED, OFF_TOPIC,
    HISTORY, EVIDENCE, ELI5, BUILD, OVERVIEW, CONTROLS, HELP, GREETING, ACK, SHOW_ME, MORE, STRONG_FLOW, WEAK_FLOW, CODE_TRIGGER, COUNT_Q,
    PEOPLE_Q, MONEY_Q, SPECIFIC_TECH, ...QUERY_ROLES.map(([, re]) => re), ...KEY_SYNONYMS.flat(), ...CATEGORIES.map((c) => c.re),
  ].flatMap((re) => re.source.toLowerCase().match(/[a-z]{5,}/g) ?? []).concat(COLORS.flatMap(([n]) => n.split(/[\s-]+/)), BRAND_COLORS.map(([n]) => n));
  return AGENT_WORDS;
}

/** Optimal string alignment distance (a swap of two letters counts as one edit), capped for speed. */
function editDistance(a: string, b: string, cap: number) {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      rowMin = Math.min(rowMin, d[i][j]);
    }
    if (rowMin > cap) return cap + 1;
  }
  return d[a.length][b.length];
}

/** "whats instgram built with" → "what is instagram built with". Only fixes words nobody would type on purpose. */
function tidyQuery(t: Teardown, text: string) {
  const lex = lexiconOf(t);
  let out = text;
  for (const [re, to] of SLANG) out = out.replace(new RegExp(re.source, 'gi'), to);
  return out.replace(/[A-Za-z]{5,}/g, (word) => {
    const w = word.toLowerCase();
    if (lex.known.has(w) || /[A-Z].*[A-Z]/.test(word)) return word;
    const cap = w.length >= 8 ? 2 : 1;
    let best: { v: string; d: number } | null = null;
    for (const v of lex.vocab) {
      if (v[0] !== w[0] || Math.abs(v.length - w.length) > cap) continue;
      const d = editDistance(w, v, cap);
      if (d <= cap && (!best || d < best.d)) best = { v, d };
    }
    return best ? best.v : word;
  });
}

/** In a long rambling message the actual question is usually the last clause with a question word. */
function focusQuestion(text: string) {
  if (countWords(text) <= 40) return text;
  const chunks = text.split(/[.!?;,\n]+/).map((c) => c.trim()).filter((c) => countWords(c) >= 3);
  const strong = [...chunks].reverse().find((c) => /\b(what|how|why|where|who|which|when)\b/i.test(c));
  return strong ?? chunks[chunks.length - 1] ?? text;
}

function makeCtx(req: AgentRequest, history: AgentRequest['messages'], detail: boolean): Ctx {
  const { teardown: t } = req;
  let qi = history.length - 1;
  while (qi >= 0 && history[qi].role !== 'user') qi--;
  const raw = (qi >= 0 ? history[qi].text : '').trim().slice(0, 500);
  const q = tidyQuery(t, focusQuestion(raw.replace(/<\/?[a-z][^>]*>/gi, ' ')));
  const before = history.slice(0, Math.max(0, qi));
  const prevUser = tidyQuery(t, [...before].reverse().find((m) => m.role === 'user')?.text ?? '');
  const prevAssistant = before[before.length - 1]?.role === 'assistant' ? before[before.length - 1].text : '';
  const code = req.playgroundCode || t.playground.html;
  const domainLabel = t.url.split('.').slice(-2, -1)[0]?.toLowerCase() ?? '';
  const nameWords = words(t.name);
  const nameStop = new Set([...(nameWords.length === 1 ? nameWords : []), ...(domainLabel ? [domainLabel] : []), t.id.toLowerCase()]);
  const lower = q.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ');
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const namePattern = [t.name.toLowerCase(), t.url.toLowerCase(), domainLabel].filter((s) => s.length >= 2).map(esc).join('|');
  const nameRe = namePattern ? new RegExp(`\\b(${namePattern})('s)?\\b`, 'gi') : null;
  const lowerIt = nameRe ? lower.replace(nameRe, 'it').replace(/\s+/g, ' ').trim() : lower;
  return {
    t,
    code,
    tab: req.tab,
    raw,
    q,
    lower,
    lowerIt,
    prevUser,
    prevAssistant,
    tweaks: parseTweaks(code),
    keys: editableKeys(code),
    nameStop,
    nameRe,
    qt: tokens(nameRe ? q.replace(nameRe, ' ') : q, nameStop),
    detail,
    turn: history.filter((m) => m.role === 'user').length,
  };
}

/** Drops any action that points at something this teardown or playground doesn't have. */
function validActions(ctx: Ctx, actions: AgentAction[]): AgentAction[] {
  const { t } = ctx;
  return actions.filter((a) => {
    switch (a.type) {
      case 'highlight_node':
        return t.architecture.nodes.some((n) => n.id === a.nodeId);
      case 'play_flow':
        return t.architecture.flows.some((f) => f.id === a.flowId);
      case 'show_code':
        return t.code.some((c) => c.id === a.snippetId);
      case 'open_stack_layer':
        return t.stack.some((l) => l.layer === a.layer);
      case 'show_concept':
        return t.concepts.some((c) => c.term === a.term);
      case 'set_tweak':
        return ctx.tweaks.some((tw) => tw.name === a.name);
      case 'edit_text':
        return ctx.keys.some((k) => k.key === a.key);
      default:
        return true;
    }
  });
}

export function runLocalAgent(req: AgentRequest): AgentReply {
  LOWER_WORDS = lexiconOf(req.teardown).lower;
  const ctx = makeCtx(req, req.messages, false);
  let draft: Draft;
  try {
    if (ctx.prevUser && (SHOW_ME.test(ctx.lower) || MORE.test(ctx.lower))) {
      // Follow-up: answer the previous question again, either pointing at it or going deeper
      const lastUser = req.messages.map((m) => m.role).lastIndexOf('user');
      let prevIdx = req.messages.slice(0, lastUser).map((m) => m.role).lastIndexOf('user');
      // "why?" → "show me": skip back over earlier follow-ups to the real question
      for (let hops = 0; hops < 3 && prevIdx > 0; hops++) {
        const text = tidyQuery(ctx.t, req.messages[prevIdx].text).toLowerCase().trim();
        if (!SHOW_ME.test(text) && !MORE.test(text)) break;
        const earlier = req.messages.slice(0, prevIdx).map((m) => m.role).lastIndexOf('user');
        if (earlier < 0) break;
        prevIdx = earlier;
      }
      const more = MORE.test(ctx.lower);
      const prevCtx = makeCtx(req, req.messages.slice(0, prevIdx + 1), more);
      const prev = SHOW_ME.test(prevCtx.lower) || MORE.test(prevCtx.lower) ? helpAnswer(prevCtx, false) : answer(prevCtx);
      const isChange = prev.actions.some((a) => a.type === 'set_tweak' || a.type === 'edit_text' || a.type === 'set_playground_code' || a.type === 'reset_playground');
      draft = more
        ? { ...prev, text: isChange ? `${prev.text}` : prev.text, actions: isChange ? [PLAY] : prev.actions }
        : { ...prev, text: showMeText(prevCtx, prev), actions: isChange ? [PLAY] : prev.actions.length ? prev.actions : [{ type: 'open_tab', tab: 'story' }] };
      if (more && isChange) draft.text = `The last change is already applied. ${controlsSummary(ctx).length ? 'You can keep going: ask for another colour, size or text change.' : ''}`.trim();
      else if (more && norm(draft.text) === norm(ctx.prevAssistant)) draft = deeperAnswer(prevCtx, prev);
    } else if (SHOW_ME.test(ctx.lower) || MORE.test(ctx.lower)) {
      draft = {
        text: `There’s nothing to ${SHOW_ME.test(ctx.lower) ? 'show' : 'go deeper on'} yet, because we haven’t talked about anything. Ask me something first, like “${starterSuggestions(ctx.t)[1]}”, and then say “tell me more” or “show me” and I’ll follow up on it. You can also tap one of the suggestions below.`,
        actions: [],
        hint: { kind: 'help' },
      };
    } else if (ctx.raw && !/[A-Za-z0-9\u00C0-\u024F\u0370-\u04FF\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/.test(ctx.raw)) {
      draft = helpAnswer(ctx, false);
    } else if (ACK.test(ctx.lower)) {
      draft = { text: `Happy to help! Pick something below, or ask me anything about how ${ctx.t.name} is built. I can also keep remixing the playground for you.`, actions: [], hint: { kind: 'question' } };
    } else {
      draft = answer(ctx);
    }
  } catch {
    draft = helpAnswer(ctx, false);
    draft.text = `I tripped over that one, sorry. ${draft.text}`;
  }
  return { text: draft.text, actions: validActions(ctx, draft.actions), suggestions: finalSuggestions(ctx, draft), source: 'local' };
}

/** Four good first prompts for this teardown, each one the local agent answers well. */
export function starterSuggestions(t: Teardown): string[] {
  LOWER_WORDS = lexiconOf(t).lower;
  const ctx = makeCtx({ teardown: t, playgroundCode: t.playground.html, tab: 'story', messages: [] }, [], false);
  const out: string[] = [];
  const flow = t.architecture.flows[0];
  out.push(flow ? flowQuestion(flow) : `Explain ${t.name} simply`);
  out.push(t.stack.some((l) => l.layer === 'Data') ? `What database does ${t.name} use?` : `What is ${t.name} built with?`);
  const change = changeExamples(ctx)[0];
  if (change) out.push(change);
  out.push(t.source === 'curated' || hasFounders(t) ? `Who founded ${t.name}?` : 'How do you know this?');
  if (out.length < 4) out.push(t.code[0] ? codeQuestion(t.code[0], t.code) : `How do I build my own ${t.name}?`);
  return out.slice(0, 4);
}
