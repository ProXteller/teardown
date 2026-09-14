/**
 * Checks the offline Ask Teardown agent (src/lib/agent/local-agent.ts).
 *   npx tsx scripts/test-agent.ts
 * Every reply is also checked for integrity: actions must point at real ids, tweaks and keys, and changes must apply.
 */
import { CURATED } from '../src/data/catalog';
import { instagram } from '../src/data/curated/instagram';
import { uber } from '../src/data/curated/uber';
import type { Teardown } from '../src/data/types';
import { runLocalAgent, starterSuggestions } from '../src/lib/agent/local-agent';
import type { AgentMessage, AgentReply, TabKey } from '../src/lib/agent/types';
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

const txst = buildQuickTeardown(OFFLINE, {
  id: 'mobile-txst-edu',
  query: 'mobile.txst.edu',
  displayName: 'Mobile',
  domain: 'mobile.txst.edu',
  guessedDomain: false,
  scan: txstScan,
}).teardown;

/* ------------------------------------------------------------------ */
/* A tiny simulated chat that applies actions like the app does        */
/* ------------------------------------------------------------------ */

interface Turn {
  prompt: string;
  reply: AgentReply;
  before: string;
  after: string;
  ms: number;
  problems: string[];
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const words = (s: string) => (s.match(/\S+/g) ?? []).length;

class Session {
  code: string;
  tab: TabKey;
  messages: AgentMessage[] = [];

  constructor(
    public t: Teardown,
    tab: TabKey = 'story',
  ) {
    this.code = t.playground.html;
    this.tab = tab;
  }

  ask(prompt: string): Turn {
    this.messages.push({ role: 'user', text: prompt });
    const before = this.code;
    const started = performance.now();
    const reply = runLocalAgent({ teardown: this.t, playgroundCode: this.code, tab: this.tab, messages: [...this.messages] });
    const ms = performance.now() - started;
    const problems = integrity(this.t, before, prompt, reply);
    if (ms > 20) problems.push(`slow: ${ms.toFixed(1)}ms`);
    for (const a of reply.actions) {
      if (a.type === 'open_tab') this.tab = a.tab;
      if (a.type === 'set_tweak') this.code = setTweak(this.code, a.name, a.value).code;
      if (a.type === 'edit_text') this.code = setEditableText(this.code, a.key, a.text).code;
      if (a.type === 'set_playground_code') this.code = a.code;
      if (a.type === 'reset_playground') this.code = this.t.playground.html;
    }
    this.messages.push({ role: 'assistant', text: reply.text });
    return { prompt, reply, before, after: this.code, ms, problems };
  }
}

function integrity(t: Teardown, code: string, prompt: string, r: AgentReply): string[] {
  const p: string[] = [];
  if (r.source !== 'local') p.push('source is not local');
  if (!r.text.trim()) p.push('empty text');
  if (/tripped over/.test(r.text)) p.push('engine threw');
  if (r.suggestions.length < 2 || r.suggestions.length > 4) p.push(`${r.suggestions.length} suggestions`);
  if (r.suggestions.some((s) => norm(s) === norm(prompt))) p.push('suggestion repeats the prompt');
  const tweaks = parseTweaks(code);
  const keys = new Set([...code.matchAll(/data-edit=["']([^"']+)["']/g)].map((m) => m[1]));
  const changes = r.actions.filter((a) => ['set_tweak', 'edit_text', 'set_playground_code', 'reset_playground'].includes(a.type));
  if (changes.length && (r.actions[0].type !== 'open_tab' || r.actions[0].tab !== 'play')) p.push('change without open_tab play first');
  let running = code;
  for (const a of r.actions) {
    switch (a.type) {
      case 'highlight_node':
        if (!t.architecture.nodes.some((n) => n.id === a.nodeId)) p.push(`bad node ${a.nodeId}`);
        break;
      case 'play_flow':
        if (!t.architecture.flows.some((f) => f.id === a.flowId)) p.push(`bad flow ${a.flowId}`);
        break;
      case 'show_code':
        if (!t.code.some((c) => c.id === a.snippetId)) p.push(`bad snippet ${a.snippetId}`);
        break;
      case 'open_stack_layer':
        if (!t.stack.some((l) => l.layer === a.layer)) p.push(`bad layer ${a.layer}`);
        break;
      case 'show_concept':
        if (!t.concepts.some((c) => c.term === a.term)) p.push(`bad concept ${a.term}`);
        break;
      case 'set_tweak': {
        const tw = tweaks.find((x) => x.name === a.name);
        if (!tw) {
          p.push(`bad tweak ${a.name}`);
          break;
        }
        if (tw.type === 'color' && !/^#[0-9a-f]{3,8}$/i.test(a.value)) p.push(`bad colour ${a.value}`);
        if (tw.type === 'range') {
          const n = parseFloat(a.value);
          if (!/^-?\d+(\.\d+)?px$/.test(a.value) || n < tw.min || n > tw.max) p.push(`bad range ${a.name}=${a.value}`);
        }
        const res = setTweak(running, a.name, a.value);
        if (!res.line) p.push(`tweak ${a.name} not writable`);
        running = res.code;
        break;
      }
      case 'edit_text': {
        if (!keys.has(a.key)) p.push(`bad key ${a.key}`);
        const res = setEditableText(running, a.key, a.text);
        if (!res.line) p.push(`key ${a.key} not writable`);
        running = res.code;
        break;
      }
      case 'set_playground_code':
        if (!/<html|<!doctype/i.test(a.code)) p.push('code is not a document');
        if (parseTweaks(a.code).length !== tweaks.length) p.push('code lost tweaks');
        if ([...a.code.matchAll(/data-edit=["']([^"']+)["']/g)].length !== keys.size) p.push('code lost data-edit keys');
        if (!a.summary) p.push('code without summary');
        running = a.code;
        break;
      default:
        break;
    }
  }
  return p;
}

/* ------------------------------------------------------------------ */
/* Expectations                                                        */
/* ------------------------------------------------------------------ */

type Check = (turn: Turn) => string | null;

const all =
  (...checks: Check[]): Check =>
  (turn) =>
    checks.map((c) => c(turn)).find(Boolean) ?? null;

const action =
  (type: string, field?: string, value?: string): Check =>
  ({ reply }) => {
    const hit = reply.actions.find((a) => a.type === type && (!field || (a as unknown as Record<string, string>)[field] === value));
    return hit ? null : `expected ${type}${field ? ` ${field}=${value}` : ''}, got [${reply.actions.map((a) => a.type + ('nodeId' in a ? `:${a.nodeId}` : 'flowId' in a ? `:${a.flowId}` : 'snippetId' in a ? `:${a.snippetId}` : 'layer' in a ? `:${a.layer}` : 'name' in a ? `:${a.name}=${a.value}` : 'key' in a ? `:${a.key}` : 'tab' in a ? `:${a.tab}` : '')).join(', ')}]`;
  };

const noAction =
  (type: string): Check =>
  ({ reply }) =>
    reply.actions.some((a) => a.type === type) ? `did not expect ${type}` : null;

const oneOf =
  (...checks: Check[]): Check =>
  (turn) => {
    const errors = checks.map((c) => c(turn));
    return errors.some((e) => e === null) ? null : errors.join(' OR ');
  };

/** The tweak really changed in the code the app would show. */
const tweak =
  (name: string, value: string): Check =>
  (turn) => {
    const err = action('set_tweak', 'name', name)(turn);
    if (err) return err;
    const now = parseTweaks(turn.after).find((x) => x.name === name)?.value;
    return now?.toLowerCase() === value.toLowerCase() ? null : `${name} is ${now}, expected ${value}`;
  };

const edited =
  (key: string, text: string): Check =>
  (turn) => {
    const hit = turn.reply.actions.find((a) => a.type === 'edit_text');
    if (!hit || hit.type !== 'edit_text') return 'expected edit_text';
    if (hit.key !== key || hit.text !== text) return `edited ${hit.key}="${hit.text}", expected ${key}="${text}"`;
    const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return turn.after.includes(`data-edit="${key}">${escaped}<`) ? null : 'text not in code';
  };

const codeHas =
  (...needles: (string | RegExp)[]): Check =>
  ({ after }) =>
    needles.map((n) => (typeof n === 'string' ? after.includes(n) : n.test(after)) ? null : `code missing ${n}`).find(Boolean) ?? null;

const codeLacks =
  (needle: string): Check =>
  ({ after }) =>
    after.includes(needle) ? `code should not contain ${needle}` : null;

const says =
  (...needles: string[]): Check =>
  ({ reply }) =>
    needles.map((n) => (reply.text.toLowerCase().includes(n.toLowerCase()) ? null : `reply missing “${n}”`)).find(Boolean) ?? null;

const wordRange =
  (min = 30, max = 130): Check =>
  ({ reply }) => {
    const n = words(reply.text);
    return n >= min && n <= max ? null : `${n} words`;
  };

const unchanged: Check = ({ before, after }) => (before === after ? null : 'code changed');

/* ------------------------------------------------------------------ */
/* Cases                                                               */
/* ------------------------------------------------------------------ */

interface Case {
  name: string;
  t: Teardown;
  turns: string[];
  tab?: TabKey;
  expect: Check;
}

const cases: Case[] = [
  // ---- Instagram: questions
  { name: 'flow: like', t: instagram, turns: ['What happens when I like a post?'], expect: all(action('play_flow', 'flowId', 'like-post'), says('Load balancer'), wordRange()) },
  { name: 'flow: walk through posting', t: instagram, turns: ['walk me through posting a photo'], expect: all(action('play_flow', 'flowId', 'post-photo'), wordRange()) },
  { name: 'tech: database', t: instagram, turns: ['What database does Instagram use?'], expect: all(oneOf(action('open_stack_layer', 'layer', 'Data'), action('highlight_node', 'nodeId', 'postgres')), says('PostgreSQL', 'Cassandra'), wordRange()) },
  { name: 'tech: language', t: instagram, turns: ['What language is Instagram written in?'], expect: all(action('open_tab', 'tab', 'stack'), says('Python', 'Swift'), wordRange()) },
  { name: 'entity: load balancer', t: instagram, turns: ['What does the load balancer do?'], expect: all(action('highlight_node', 'nodeId', 'load-balancer'), wordRange()) },
  { name: 'entity: cassandra', t: instagram, turns: ['Tell me about Cassandra'], expect: all(action('highlight_node', 'nodeId', 'cassandra'), says('Apache Cassandra'), wordRange()) },
  { name: 'entity: redis (stack item)', t: instagram, turns: ['What is Redis?'], expect: all(oneOf(action('open_stack_layer', 'layer', 'Data'), action('highlight_node')), says('Redis', 'counters'), wordRange(20)) },
  { name: 'concept: sharding', t: instagram, turns: ['What is sharding?'], expect: all(action('show_concept', 'term', 'Sharding'), wordRange()) },
  { name: 'code: sql', t: instagram, turns: ['Show me the SQL'], expect: all(action('show_code', 'snippetId', 'postgres-sharded-ids'), wordRange()) },
  { name: 'code: swift', t: instagram, turns: ['show me the swift code'], expect: action('show_code', 'snippetId', 'ios-double-tap-like') },
  { name: 'code: by topic', t: instagram, turns: ['How is saving a like coded on the server?'], expect: action('show_code', 'snippetId', 'django-like-view') },
  { name: 'code: missing language', t: instagram, turns: ['Show me the Rust code'], expect: all(noAction('show_code'), says('no Rust')) },
  { name: 'story: founders', t: instagram, turns: ['Who founded Instagram?'], expect: all(action('open_tab', 'tab', 'story'), says('Kevin Systrom'), wordRange()) },
  { name: 'story: launch', t: instagram, turns: ['When did Instagram launch?'], expect: all(action('open_tab', 'tab', 'story'), says('2010')) },
  { name: 'eli5', t: instagram, turns: ['Explain Instagram simply'], expect: all(action('open_tab', 'tab', 'story'), says('photo album'), wordRange()) },
  { name: 'build your own', t: instagram, turns: ['How do I build my own Instagram?'], expect: all(action('open_tab', 'tab', 'learn'), says('Sketch your data'), wordRange()) },
  { name: 'evidence: curated', t: instagram, turns: ['How do you know this?'], expect: all(says('hand-checked', 'LIKELY'), action('open_tab', 'tab', 'learn'), wordRange()) },
  { name: 'yes/no: AWS', t: instagram, turns: ['Is it on AWS?'], expect: all(says('Amazon Web Services'), oneOf(action('open_stack_layer', 'layer', 'Infrastructure'), action('highlight_node'))) },
  { name: 'yes/no: not in teardown', t: instagram, turns: ['Does Instagram use MongoDB?'], expect: all(says('doesn’t mention', 'mongodb'), noAction('highlight_node')) },
  { name: 'tech: AI', t: instagram, turns: ['How does Instagram use AI?'], expect: all(oneOf(action('open_stack_layer', 'layer', 'AI / ML'), action('highlight_node', 'nodeId', 'ranking')), says('Ranking')) },
  { name: 'greeting', t: instagram, turns: ['hi'], expect: all(says('Instagram'), ({ reply }) => (reply.suggestions.length === 4 && !reply.actions.length ? null : 'expected 4 suggestions, no actions')) },
  { name: 'fallback: unknown', t: instagram, turns: ['What is the weather in Austin?'], expect: all(oneOf(says('couldn’t find'), says('outside what I can help with')), ({ reply }) => (reply.actions.length ? 'expected no actions' : null)) },
  { name: 'tab overview: system', t: instagram, tab: 'system', turns: ['explain this'], expect: all(action('open_tab', 'tab', 'system'), says('PostgreSQL shards')) },
  { name: 'follow-up: show me', t: instagram, turns: ['What does Memcached do?', 'show me'], expect: all(action('highlight_node', 'nodeId', 'memcached'), says('Memcached')) },
  { name: 'follow-up: tell me more (flow)', t: instagram, turns: ['What happens when I open my feed?', 'tell me more'], expect: all(action('play_flow', 'flowId', 'open-feed'), says('boxes involved')) },

  // ---- Instagram: changes
  { name: 'colour: brand maroon', t: instagram, turns: ['make the brand color maroon'], expect: all(tweak('--brand', '#501214'), says('--brand', 'line')) },
  { name: 'colour: starter prompt', t: instagram, turns: ['Make the brand color TXST maroon'], expect: tweak('--brand', '#501214') },
  { name: 'colour: background', t: instagram, turns: ['change the background to black'], expect: tweak('--bg', '#000000') },
  { name: 'colour: two clauses', t: instagram, turns: ['make the background black and the text white'], expect: all(tweak('--bg', '#000000'), tweak('--text', '#FFFFFF')) },
  { name: 'colour: bare hex', t: instagram, turns: ['#1db954'], expect: tweak('--brand', '#1DB954') },
  { name: 'colour: follow-up pronoun', t: instagram, turns: ['change the background to navy', 'actually make it teal'], expect: tweak('--bg', '#14B8A6') },
  { name: 'dark mode', t: instagram, turns: ['switch to dark mode'], expect: all(tweak('--bg', '#0F1115'), tweak('--text', '#F2F4F7')) },
  { name: 'size: rounder', t: instagram, turns: ['make the corners rounder'], expect: tweak('--radius', '32px') },
  { name: 'size: avatar bigger', t: instagram, turns: ['make the avatar bigger'], expect: tweak('--avatar', '47px') },
  { name: 'size: context "even bigger" clamps', t: instagram, turns: ['make the avatar bigger', 'even bigger'], expect: tweak('--avatar', '56px') },
  { name: 'text: quoted username', t: instagram, turns: ['change the username to "bobcat.life"'], expect: edited('username', 'bobcat.life') },
  { name: 'add link: no menu here', t: instagram, turns: ['add a menu link called Reels'], expect: all(noAction('set_playground_code'), action('open_tab', 'tab', 'play'), says('Code'), unchanged) },
  { name: 'no match: list controls', t: instagram, turns: ['make it sparkle'], expect: all(action('open_tab', 'tab', 'play'), noAction('set_tweak'), says('Photo corners', 'app-name')) },
  { name: 'reset after change', t: instagram, turns: ['make the brand color maroon', 'reset'], expect: all(action('reset_playground'), ({ after }) => (after === instagram.playground.html ? null : 'not reset')) },
  { name: 'restore one control', t: instagram, turns: ['make the brand color maroon', 'change the brand color back to the original'], expect: tweak('--brand', '#E1306C') },

  // ---- Uber
  { name: 'uber flow: request ride', t: uber, turns: ['What happens when I request a ride?'], expect: all(action('play_flow', 'flowId', 'request-ride'), says('Matching'), wordRange()) },
  { name: 'uber flow: paying', t: uber, turns: ['how does paying at the end of a trip work'], expect: action('play_flow', 'flowId', 'pay-trip') },
  { name: 'uber entity: kafka', t: uber, turns: ['What is Kafka?'], expect: all(action('highlight_node', 'nodeId', 'kafka'), wordRange()) },
  { name: 'uber code: go', t: uber, turns: ['Show me the Go code'], expect: action('show_code', 'snippetId', 'go-matcher') },
  { name: 'uber code: surge', t: uber, turns: ['how is surge pricing coded?'], expect: action('show_code', 'snippetId', 'python-surge') },
  { name: 'uber tech: language', t: uber, turns: ['What language is Uber written in?'], expect: says('Go', 'Java') },
  { name: 'uber story: founders', t: uber, turns: ['Who founded Uber?'], expect: all(says('Garrett Camp'), action('open_tab', 'tab', 'story')) },
  { name: 'uber tech: ML', t: uber, turns: ['What does Uber use for machine learning?'], expect: all(says('Michelangelo'), oneOf(action('open_stack_layer', 'layer', 'AI / ML'), action('highlight_node', 'nodeId', 'ml-platform'))) },
  { name: 'uber yes/no: likely item', t: uber, turns: ['Is Uber built with Kubernetes?'], expect: says('Kubernetes', 'LIKELY') },
  { name: 'uber colour: accent gold', t: uber, turns: ['make the accent color txst gold'], expect: tweak('--accent', '#8D734A') },
  { name: 'uber dark mode uses map', t: uber, turns: ['dark mode'], expect: all(tweak('--map', '#0F1115'), says('Map color')) },
  { name: 'uber: no background control', t: uber, turns: ['make the background blue'], expect: all(noAction('set_tweak'), says('no background'), unchanged) },
  { name: 'uber text: from → to', t: uber, turns: ['change "Where to?" to "Where are we going?"'], expect: edited('title', 'Where are we going?') },
  { name: 'uber size: square', t: uber, turns: ['square corners please'], expect: tweak('--radius', '0px') },
  { name: 'uber evidence', t: uber, turns: ['is this real?'], expect: says('hand-checked') },

  // ---- Instant teardown (mobile.txst.edu, real-page playground)
  { name: 'txst text: headline', t: txst, turns: ['rename the headline to "Go Bobcats!"'], expect: all(edited('headline', 'Go Bobcats!'), says('headline', 'line')) },
  { name: 'txst text: button', t: txst, turns: ['change the button to "Apply now"'], expect: edited('cta', 'Apply now') },
  { name: 'txst text: unquoted site name', t: txst, turns: ['set the site name to Bobcat Hub'], expect: edited('site-name', 'Bobcat Hub') },
  { name: 'txst text: footer', t: txst, turns: ['change the footer to "Made at Texas State"'], expect: edited('footer', 'Made at Texas State') },
  { name: 'txst add menu link', t: txst, turns: ['add a menu link called Events'], expect: all(action('set_playground_code'), codeHas('<button class="navlink">Events</button>'), ({ after }) => ((after.match(/class="navlink/g) ?? []).length === 4 ? null : 'expected 4 navlinks')) },
  { name: 'txst add link: escapes html', t: txst, turns: ['add a menu link called "<b>Hi</b>"'], expect: all(codeHas('&lt;b&gt;Hi&lt;/b&gt;'), codeLacks('<b>Hi</b>')) },
  { name: 'txst add section', t: txst, turns: ['add a section called Campus Map'], expect: all(action('set_playground_code'), codeHas('<h2>Campus Map</h2>')) },
  { name: 'txst colours', t: txst, turns: ['make it txst colors'], expect: all(tweak('--brand', '#501214'), tweak('--accent', '#8D734A')) },
  { name: 'txst header colour → brand', t: txst, turns: ['make the header navy'], expect: all(tweak('--brand', '#1E3A8A'), says('header')) },
  { name: 'txst more spacing', t: txst, turns: ['more spacing'], expect: tweak('--space', '21px') },
  { name: 'txst tighter spacing', t: txst, turns: ['tighter spacing'], expect: tweak('--space', '11px') },
  { name: 'txst explicit px', t: txst, turns: ['set the corner radius to 20px'], expect: tweak('--radius', '20px') },
  { name: 'txst headline bigger via CSS', t: txst, turns: ['make the headline bigger'], expect: all(action('set_playground_code'), codeHas(/h1 \{ font-size: 34px/)) },
  { name: 'txst context: rename then bigger', t: txst, turns: ['rename the headline to "Hello"', 'make it bigger'], expect: all(codeHas(/h1 \{ font-size: 34px/), codeHas('data-edit="headline">Hello<')) },
  { name: 'txst evidence: scan', t: txst, turns: ['How do you know this?'], expect: all(says('instant', 'LIKELY', 'Cloudflare'), action('open_tab', 'tab', 'stack'), wordRange()) },
  { name: 'txst history: honest', t: txst, turns: ['Who founded TXST Mobile?'], expect: all(says('doesn’t include'), action('open_tab', 'tab', 'story')) },
  { name: 'txst flow: login', t: txst, turns: ['What happens when a student logs in?'], expect: action('play_flow', 'flowId', 'school-login') },
  { name: 'txst yes/no: cloudflare', t: txst, turns: ['Is it hosted on Cloudflare?'], expect: all(says('Yes', 'Cloudflare'), oneOf(action('highlight_node', 'nodeId', 'cdn'), action('open_stack_layer', 'layer', 'Infrastructure'))) },
  { name: 'txst cache', t: txst, turns: ['How is data cached?'], expect: action('highlight_node', 'nodeId', 'cache') },
  { name: 'txst storage', t: txst, turns: ['Where are videos stored?'], expect: action('highlight_node', 'nodeId', 'media') },
  { name: 'txst SSO', t: txst, turns: ['what is SSO?'], expect: oneOf(action('highlight_node', 'nodeId', 'idp'), action('show_concept', 'term', 'Single sign-on (SSO)')) },
  { name: 'txst built with', t: txst, turns: ['What is TXST Mobile built with?'], expect: all(action('open_tab', 'tab', 'stack'), says('Cloudflare')) },
  { name: 'txst code tab: show code', t: txst, tab: 'code', turns: ['show me the code'], expect: action('show_code') },
  // ---- Messy demo input (see scripts/agent-battery.ts for the full adversarial run)
  { name: 'messy: typo database', t: instagram, turns: ['what databse does instgram use'], expect: all(says('PostgreSQL'), wordRange()) },
  { name: 'messy: slang + typo flow', t: uber, turns: ['wat happens when u reqest a ride'], expect: action('play_flow', 'flowId', 'request-ride') },
  { name: 'messy: rambling question', t: instagram, turns: [`so basically my professor said to pick an app and i picked instagram because i use it all day, and i was wondering, like, when i post stuff where does it all go, what databse do they use for all of it?`], expect: says('PostgreSQL') },
  { name: 'messy: off-topic essay', t: instagram, turns: ['write my essay'], expect: all(says('outside'), unchanged, ({ reply }) => (reply.actions.length ? 'expected no actions' : null)) },
  { name: 'messy: other product', t: instagram, turns: ['what is tiktok built with'], expect: all(says('TikTok', 'home screen'), unchanged) },
  { name: 'messy: named tech not listed', t: instagram, turns: ['does it use mongodb'], expect: all(says('MongoDB', 'doesn’t mention'), action('open_stack_layer', 'layer', 'Data'), wordRange()) },
  { name: 'messy: tell me more never repeats', t: CURATED.find((x) => x.id === 'discord')!, turns: ['why does discord use rust', 'tell me more'], expect: all(action('highlight_node', 'nodeId', 'read-states'), says('Going deeper')) },
  { name: 'messy: cold follow-up', t: uber, turns: ['why?'], expect: says('Ask me something first') },
  { name: 'messy: button colour uses the CSS', t: instagram, turns: ['can u make the button red'], expect: tweak('--brand', '#E53935') },
  { name: 'messy: sidebar synonym', t: CURATED.find((x) => x.id === 'discord')!, turns: ['make the sidebar maroon'], expect: tweak('--rail', '#501214') },
  { name: 'messy: darker brand, not dark mode', t: instagram, turns: ['make the brand color darker'], expect: all(action('set_tweak', 'name', '--brand'), noAction('reset_playground'), ({ reply }) => (reply.actions.some((a) => a.type === 'set_tweak' && a.name === '--bg') ? 'switched to dark mode' : null)) },
  { name: 'messy: dark mode twice is a no-op', t: instagram, turns: ['dark mode', 'dark mode'], expect: all(noAction('set_tweak'), says('already')) },
  { name: 'messy: invalid hex', t: instagram, turns: ['make the brand color #12'], expect: all(unchanged, says('#12', 'hex')) },
  { name: 'messy: bare number for a slider', t: txst, turns: ['spacing 24'], expect: tweak('--space', '24px') },
  { name: 'messy: text edit without "to"', t: txst, turns: ['can you make the site name TXST'], expect: edited('site-name', 'TXST') },
  { name: 'messy: text value beats colour target', t: txst, turns: ['change the button text to Apply Now'], expect: edited('cta', 'Apply Now') },
  { name: 'messy: menu item name after noun', t: txst, turns: ['add menu item Events'], expect: codeHas('<button class="navlink">Events</button>') },
  { name: 'messy: make it pop', t: instagram, turns: ['make it pop'], expect: all(action('set_tweak'), says('reset')) },
  { name: 'messy: fun fact is not a remix', t: instagram, turns: ['give me a fun fact'], expect: all(unchanged, says('Django')) },
  { name: 'messy: no repeat suggestion after dark mode', t: instagram, turns: ['dark mode'], expect: ({ reply }) => (reply.suggestions.includes('Switch to dark mode') ? 'suggested dark mode again' : null) },
  { name: 'txst suggestions mix', t: txst, turns: ['make the corners rounder'], expect: ({ reply }) => (reply.suggestions.some((s) => /\?$/.test(s)) && reply.suggestions.some((s) => /^(Make|Switch|Change|Add)/.test(s)) ? null : `suggestions not mixed: ${reply.suggestions.join(' | ')}`) },
];

/* ------------------------------------------------------------------ */
/* Run                                                                 */
/* ------------------------------------------------------------------ */

let failures = 0;
const rows: string[] = [];
// Warm up the JIT so timing checks measure the engine, not first-call compilation
runLocalAgent({ teardown: instagram, playgroundCode: instagram.playground.html, tab: 'story', messages: [{ role: 'user', text: 'warm up' }] });

for (const c of cases) {
  const s = new Session(c.t, c.tab);
  const turns = c.turns.map((p) => s.ask(p));
  const last = turns[turns.length - 1];
  const problems = [...turns.flatMap((tn) => tn.problems), c.expect(last)].filter(Boolean) as string[];
  if (problems.length) failures++;
  const ms = Math.max(...turns.map((tn) => tn.ms)).toFixed(1);
  rows.push(`${problems.length ? '✗' : '✓'} ${c.t.id.padEnd(16)} ${c.name.padEnd(38)} ${ms.padStart(5)}ms  ${problems.join('; ')}`);
  if (problems.length || process.argv.includes('--verbose')) {
    rows.push(`    “${c.turns.join('” → “')}”\n    ${last.reply.text.replace(/\n/g, '\n    ')}\n    suggestions: ${last.reply.suggestions.join(' | ')}`);
  }
}

// Battery: every starter prompt and a set of common prompts must work on every teardown we can build
const archetypeTeardowns = Object.keys(OFFLINE.archetypes).map(
  (id) =>
    buildQuickTeardown(OFFLINE, {
      id: `arch-${id}`,
      query: 'sample.com',
      displayName: 'Sample',
      domain: 'sample.com',
      guessedDomain: false,
      scan: { ok: true, url: 'https://sample.com/', status: 200, title: `Sample | ${OFFLINE.archetypes[id as keyof typeof OFFLINE.archetypes].keywords.slice(0, 3).join(' ')}`, detections: [], headers: [] },
    }).teardown,
);
const COMMON = [
  'make the brand color red', 'dark mode', 'rounder corners', 'make it bigger', 'change the title to "Hello"', 'what database does it use?',
  'show me the code', 'who founded it?', 'how do you know this?', 'reset', 'asdf qwerty', 'hi', 'tell me more', 'show me', 'what can I change?',
  'make the text smaller', 'add a menu link called Events', 'what is the backend?', 'is it secure?', 'explain this',
];
let batteryChecks = 0;
let batteryFailures = 0;
const allTeardowns = [...CURATED, txst, ...archetypeTeardowns];
for (const t of allTeardowns) {
  const starters = starterSuggestions(t);
  batteryChecks++;
  if (starters.length !== 4 || new Set(starters.map(norm)).size !== 4) {
    batteryFailures++;
    rows.push(`✗ battery ${t.id}: starters ${JSON.stringify(starters)}`);
  }
  for (const prompt of [...starters, ...COMMON]) {
    const s = new Session(t, 'play');
    if (prompt === 'tell me more' || prompt === 'show me') s.ask(t.architecture.flows[0] ? `What happens when ${t.architecture.flows[0].title.toLowerCase()}?` : 'What database does it use?');
    const turn = s.ask(prompt);
    batteryChecks++;
    const problems = [...turn.problems];
    if (starters.includes(prompt)) {
      if (!turn.reply.actions.length) problems.push('starter prompt produced no action');
      if (/couldn’t find|not sure how/.test(turn.reply.text)) problems.push('starter prompt fell through');
    }
    if (problems.length) {
      batteryFailures++;
      rows.push(`✗ battery ${t.id.padEnd(16)} “${prompt}”: ${problems.join('; ')}\n    ${turn.reply.text.replace(/\n/g, '\n    ')}`);
    }
  }
}

console.log(rows.join('\n'));
console.log(`\ncases: ${cases.length - failures}/${cases.length} passed`);
console.log(`battery: ${batteryChecks - batteryFailures}/${batteryChecks} passed across ${allTeardowns.length} teardowns`);
if (failures || batteryFailures) process.exit(1);
