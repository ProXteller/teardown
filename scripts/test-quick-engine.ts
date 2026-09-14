/**
 * End-to-end checks for the instant teardown engine.
 *   npx tsx scripts/test-quick-engine.ts            → synthetic scans for every archetype × tech combo + every known product
 *   npx tsx scripts/test-quick-engine.ts --live     → also scans real sites through the running dev server (localhost:8081)
 */
import { parseQuery } from '../src/data/catalog';
import type { Teardown } from '../src/data/types';
import type { Detection, ScanResult } from '../src/lib/fingerprints';
import { buildQuickTeardown, findKnownProduct, resolveDomain } from '../src/lib/offline/build';
import { OFFLINE } from '../src/lib/offline/content';
import { ARCHETYPE_IDS } from '../src/lib/offline/types';
import { parseTweaks, setEditableText, setTweak } from '../src/lib/playground';

let problems = 0;
const fail = (w: string, m: string) => {
  problems++;
  console.log(`  ✗ [${w}] ${m}`);
};

function check(w: string, t: Teardown) {
  const json = JSON.stringify(t);
  const leftover = json.match(/\{\{\s*\w+\s*\}\}/);
  if (leftover) fail(w, `unfilled placeholder ${leftover[0]}`);
  if (t.source !== 'scan') fail(w, 'source should be scan');
  if (!/^#[0-9a-f]{6}$/i.test(t.brandColor) || !/^#[0-9a-f]{6}$/i.test(t.accentColor)) fail(w, `bad colors ${t.brandColor} ${t.accentColor}`);
  const share = t.languages.reduce((s, l) => s + l.share, 0);
  if (share !== 100) fail(w, `language shares ${share}`);
  if (!t.stack.length || !t.facts.length || !t.code.length || !t.concepts.length) fail(w, 'empty section');
  const ids = new Set(t.architecture.nodes.map((n) => n.id));
  t.architecture.edges.forEach((e) => (!ids.has(e.from) || !ids.has(e.to)) && fail(w, `dangling edge ${e.from}->${e.to}`));
  const edges = new Set(t.architecture.edges.flatMap((e) => [`${e.from}>${e.to}`, `${e.to}>${e.from}`]));
  t.architecture.flows.forEach((f) => f.steps.forEach((s) => !edges.has(`${s.from}>${s.to}`) && fail(w, `flow step without edge ${s.from}->${s.to}`)));
  if (new Set(t.code.map((c) => c.id)).size !== t.code.length) fail(w, 'duplicate code ids');
  const tweaks = parseTweaks(t.playground.html);
  if (tweaks.length < 3) fail(w, `only ${tweaks.length} tweaks`);
  tweaks.forEach((tw) => {
    if (tw.type === 'color' && !/^#[0-9a-f]{3,8}$/i.test(tw.value)) fail(w, `tweak ${tw.name}=${tw.value} not hex`);
    if (!setTweak(t.playground.html, tw.name, tw.type === 'color' ? '#123456' : '9px').line) fail(w, `tweak ${tw.name} not writable`);
  });
  [...t.playground.html.matchAll(/data-edit=["']([^"']+)["']/g)].forEach((m) => {
    if (!setEditableText(t.playground.html, m[1], 'Z').line) fail(w, `data-edit ${m[1]} not editable`);
  });
  const stackNames = t.stack.flatMap((l) => l.items.map((i) => i.name.toLowerCase()));
  if (new Set(stackNames).size !== stackNames.length) fail(w, 'duplicate stack items');
}

const det = (...names: string[]): Detection[] => names.map((name) => ({ name, category: 'Framework', evidence: 'test' }));
const scan = (detections: Detection[], extra: Partial<ScanResult> = {}): ScanResult => ({
  ok: true,
  url: 'https://sample.com/',
  status: 200,
  detections,
  headers: [],
  ...extra,
});

const COMBOS: [string, Detection[]][] = [
  ['nothing', []],
  ['next+vercel', det('Next.js', 'React', 'Vercel', 'HSTS (HTTPS enforced)')],
  ['wordpress', det('WordPress', 'PHP', 'Cloudflare', 'jQuery', 'Google Analytics / Tag Manager')],
  ['shopify', det('Shopify', 'Cloudflare', 'Stripe')],
  ['django', det('Django', 'nginx', 'Amazon Web Services', 'Sentry')],
  ['meta', det('Meta infrastructure', 'HTTP/3 (QUIC)', 'Meta CDN (fbcdn)', 'reCAPTCHA')],
  ['everything', OFFLINE.packs.map((p) => ({ name: p.detection, category: 'Framework' as const, evidence: 'test' }))],
];

async function main() {
  const missing = ARCHETYPE_IDS.filter((id) => !OFFLINE.archetypes[id]);
  if (missing.length) fail('content', `missing archetypes: ${missing.join(', ')}`);
  console.log(`content: ${Object.keys(OFFLINE.archetypes).length} archetypes, ${OFFLINE.packs.length} packs, ${OFFLINE.products.length} known products`);

  for (const id of Object.keys(OFFLINE.archetypes)) {
    for (const [combo, detections] of COMBOS) {
      const a = OFFLINE.archetypes[id as keyof typeof OFFLINE.archetypes];
      const s = scan(detections, { title: `Sample | ${a.keywords.slice(0, 3).join(' ')}`, description: a.keywords.slice(0, 6).join(', ') });
      const { teardown, meta } = buildQuickTeardown(OFFLINE, { id: 'sample', query: 'sample.com', displayName: 'Sample', domain: 'sample.com', guessedDomain: false, scan: s });
      check(`${id}/${combo}`, teardown);
      if (combo === 'nothing' && meta.archetype !== id) console.log(`  · keyword self-classification: ${id} → ${meta.archetype}`);
    }
  }

  for (const p of OFFLINE.products) {
    const q = parseQuery(p.name);
    const known = findKnownProduct(OFFLINE.products, q);
    if (known?.id !== p.id) fail(`product:${p.id}`, `name lookup found ${known?.id}`);
    const byDomain = findKnownProduct(OFFLINE.products, parseQuery(p.domains[0]));
    if (byDomain?.id !== p.id) fail(`product:${p.id}`, `domain lookup found ${byDomain?.id}`);
    const target = resolveDomain(q, known);
    const { teardown } = buildQuickTeardown(OFFLINE, { id: q.id, query: q.raw, displayName: q.displayName, domain: target.domain, guessedDomain: target.guessed, scan: null, known });
    check(`product:${p.id}`, teardown);
    if (teardown.name !== p.name) fail(`product:${p.id}`, `name ${teardown.name}`);
  }

  if (process.argv.includes('--live')) {
    const SITES = ['https://www.mobile.txst.edu/', 'txst.edu', 'duolingo.com', 'github.com', 'stripe.com', 'nytimes.com', 'allbirds.com', 'airbnb.com', 'linear.app', 'wordpress.org', 'wikipedia.org', 'bbc.com', 'craigslist.org', 'twitch.tv', 'randomwebsite123456.com'];
    for (const input of SITES) {
      const q = parseQuery(input);
      const known = findKnownProduct(OFFLINE.products, q);
      const target = resolveDomain(q, known);
      const s: ScanResult | null = target.domain
        ? await fetch('http://localhost:8081/api/scan', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url: target.domain }) })
            .then((r) => r.json())
            .catch(() => null)
        : null;
      const { teardown, meta } = buildQuickTeardown(OFFLINE, { id: q.id, query: q.raw, displayName: known?.name ?? q.displayName, domain: target.domain, guessedDomain: target.guessed, scan: s, known });
      check(`live:${input}`, teardown);
      console.log(
        `  live ${input.padEnd(30)} → ${teardown.name.padEnd(24)} ${meta.archetype.padEnd(12)} known=${String(meta.knownProduct).padEnd(5)} det=${s?.ok ? s.detections.length : s?.error ?? 'none'} playground=${meta.playgroundFromSite ? 'REBUILT' : 'example'} "${teardown.playground.title}"`,
      );
      if (meta.playgroundFromSite && s?.outline) {
        console.log(`      nav: ${s.outline.nav.slice(0, 5).join(' | ')}\n      headings: ${s.outline.headings.slice(0, 4).map((h) => h.text).join(' | ')}\n      p: ${(s.outline.paragraphs[0] ?? '').slice(0, 90)}`);
      }
    }
  }

  console.log(problems ? `\n${problems} problem(s)` : '\nQuick engine OK');
  process.exit(problems ? 1 : 0);
}

void main();
