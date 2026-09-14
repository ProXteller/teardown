/**
 * Validates offline-engine content files.
 *   npx tsx scripts/validate-offline.ts archetype src/lib/offline/archetypes/social.ts
 *   npx tsx scripts/validate-offline.ts packs src/lib/offline/frameworks-frontend.ts
 *   npx tsx scripts/validate-offline.ts products src/lib/offline/known-products-a.ts
 * With no arguments, validates every file that exists.
 */
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { parseTweaks, setEditableText } from '../src/lib/playground';
import { ARCHETYPE_IDS, DETECTION_NAMES, type ArchetypeTemplate, type FrameworkPack, type KnownProduct } from '../src/lib/offline/types';

const PLACEHOLDERS = ['name', 'domain', 'brand', 'accent', 'tagline', 'frontend', 'hosting'];
const SAMPLE: Record<string, string> = {
  name: 'Sample',
  domain: 'sample.com',
  brand: '#E60023',
  accent: '#0074E8',
  tagline: 'A sample product',
  frontend: 'React',
  hosting: 'Cloudflare',
};
const LAYERS = ['Frontend', 'Mobile', 'Backend', 'Data', 'Infrastructure', 'AI / ML', 'DevOps'];
const KINDS = ['client', 'edge', 'gateway', 'service', 'queue', 'ml', 'cache', 'database', 'storage', 'external'];
const HEX = /^#[0-9a-f]{6}$/i;

let problems = 0;
const fail = (where: string, msg: string) => {
  problems++;
  console.log(`  ✗ [${where}] ${msg}`);
};
const range = (where: string, what: string, n: number, min: number, max: number) =>
  (n < min || n > max) && fail(where, `${what}: ${n} (expected ${min}-${max})`);

function checkPlaceholders(where: string, value: unknown) {
  const json = JSON.stringify(value);
  for (const m of json.matchAll(/\{\{\s*([a-zA-Z]+)\s*\}\}/g)) {
    if (!PLACEHOLDERS.includes(m[1])) fail(where, `unknown placeholder {{${m[1]}}}`);
  }
}

const fill = (s: string) => s.replace(/\{\{(\w+)\}\}/g, (_, k: string) => SAMPLE[k] ?? `{{${k}}}`);

function checkArchetype(a: ArchetypeTemplate) {
  const w = `archetype:${a.id}`;
  if (!ARCHETYPE_IDS.includes(a.id)) fail(w, `unknown id ${a.id}`);
  checkPlaceholders(w, a);
  range(w, 'keywords', a.keywords.length, 6, 60);
  range(w, 'languages', a.languages.length, 4, 6);
  const share = a.languages.reduce((s, l) => s + l.share, 0);
  if (Math.abs(share - 100) > 1) fail(w, `language shares sum to ${share}`);
  range(w, 'stack layers', a.stack.length, 4, 6);
  a.stack.forEach((l) => {
    if (!LAYERS.includes(l.layer)) fail(w, `bad layer ${l.layer}`);
    range(w, `stack items in ${l.layer}`, l.items.length, 2, 4);
  });
  const { nodes, edges, flows } = a.architecture;
  range(w, 'nodes', nodes.length, 11, 14);
  range(w, 'edges', edges.length, 14, 20);
  const ids = new Set(nodes.map((n) => n.id));
  if (ids.size !== nodes.length) fail(w, 'duplicate node ids');
  const web = nodes.find((n) => n.id === 'web');
  const cdn = nodes.find((n) => n.id === 'cdn');
  if (!web || web.kind !== 'client' || web.tier !== 0 || !web.tech.includes('{{frontend}}')) fail(w, 'needs node "web" (client, tier 0, tech mentions {{frontend}})');
  if (!cdn || cdn.kind !== 'edge' || cdn.tier !== 1 || !cdn.tech.includes('{{hosting}}')) fail(w, 'needs node "cdn" (edge, tier 1, tech mentions {{hosting}})');
  const perTier = new Map<number, number>();
  nodes.forEach((n) => {
    if (!KINDS.includes(n.kind)) fail(w, `node ${n.id} bad kind ${n.kind}`);
    if (![0, 1, 2, 3, 4].includes(n.tier)) fail(w, `node ${n.id} bad tier ${n.tier}`);
    perTier.set(n.tier, (perTier.get(n.tier) ?? 0) + 1);
  });
  perTier.forEach((c, t) => c > 4 && fail(w, `tier ${t} has ${c} nodes`));
  edges.forEach((e) => (!ids.has(e.from) || !ids.has(e.to)) && fail(w, `edge ${e.from}->${e.to} dangles`));
  const edgeSet = new Set(edges.flatMap((e) => [`${e.from}>${e.to}`, `${e.to}>${e.from}`]));
  if (flows.length !== 3) fail(w, `flows: ${flows.length} (expected 3)`);
  flows.forEach((f) => {
    range(w, `steps in "${f.title}"`, f.steps.length, 4, 7);
    f.steps.forEach((s) => !edgeSet.has(`${s.from}>${s.to}`) && fail(w, `flow "${f.title}" step ${s.from}->${s.to} has no edge`));
  });
  range(w, 'files', a.files.length, 12, 16);
  range(w, 'code', a.code.length, 3, 3);
  a.code.forEach((c) => range(w, `lines in snippet "${c.title}"`, c.code.split('\n').length, 12, 45));
  range(w, 'concepts', a.concepts.length, 6, 8);
  range(w, 'buildYourOwn', a.buildYourOwn.length, 5, 6);
  checkPlayground(w, a.playground);
}

function checkPlayground(w: string, p: { html: string; challenges: string[] }) {
  const html = fill(p.html);
  const tweaks = parseTweaks(html);
  range(w, 'playground tweaks', tweaks.length, 4, 7);
  tweaks.forEach((t) => {
    if (t.type === 'color' && !/^#[0-9a-f]{3,8}$/i.test(t.value)) fail(w, `color tweak ${t.name} value "${t.value}" is not a hex color after filling placeholders`);
    if (t.type === 'range' && !/^-?\d+(\.\d+)?px$/.test(t.value)) fail(w, `range tweak ${t.name} value "${t.value}" is not px`);
  });
  const keys = [...html.matchAll(/data-edit=["']([^"']+)["']/g)].map((m) => m[1]);
  range(w, 'data-edit elements', keys.length, 3, 6);
  if (new Set(keys).size !== keys.length) fail(w, 'duplicate data-edit keys');
  keys.forEach((k) => {
    const r = setEditableText(html, k, 'ZZZ');
    if (!r.line || !r.code.includes('>ZZZ<')) fail(w, `data-edit="${k}" must contain only plain text`);
  });
  if (/(src|href)\s*=\s*["']https?:/i.test(html) || /@import|url\(\s*["']?https?:/i.test(html)) fail(w, 'playground loads external resources');
  if (!/<script[\s>]/i.test(html)) fail(w, 'playground has no inline script');
  if (html.split('\n').length > 200) fail(w, `playground is ${html.split('\n').length} lines (max 200)`);
  range(w, 'challenges', p.challenges.length, 3, 4);
}

function checkPacks(packs: FrameworkPack[], where: string) {
  const seen = new Set<string>();
  packs.forEach((p) => {
    const w = `${where}:${p.detection}`;
    if (!DETECTION_NAMES.includes(p.detection)) fail(w, 'detection is not in DETECTION_NAMES');
    if (seen.has(p.detection)) fail(w, 'duplicate pack');
    seen.add(p.detection);
    range(w, 'stackItems', p.stackItems.length, 1, 3);
    p.stackItems.forEach((s) => !LAYERS.includes(s.layer) && fail(w, `bad layer ${s.layer}`));
    range(w, 'files', p.files.length, 0, 5);
    range(w, 'code', p.code.length, 0, 1);
    p.code.forEach((c) => range(w, `lines in "${c.title}"`, c.code.split('\n').length, 10, 32));
    range(w, 'concepts', p.concepts.length, 0, 2);
    if (!p.howWeKnow) fail(w, 'missing howWeKnow');
  });
  console.log(`✓ ${where}: ${packs.length} packs`);
}

function checkProducts(products: KnownProduct[], where: string) {
  const ids = new Set<string>();
  const domains = new Set<string>();
  products.forEach((p) => {
    const w = `${where}:${p.id}`;
    if (ids.has(p.id)) fail(w, 'duplicate id');
    ids.add(p.id);
    p.domains.forEach((d) => {
      if (domains.has(d)) fail(w, `duplicate domain ${d}`);
      if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(d)) fail(w, `bad domain ${d}`);
      domains.add(d);
    });
    if (!ARCHETYPE_IDS.includes(p.archetype)) fail(w, `bad archetype ${p.archetype}`);
    if (!HEX.test(p.brandColor) || !HEX.test(p.accentColor)) fail(w, 'colors must be #RRGGBB');
    range(w, 'facts', p.facts.length, 3, 5);
    range(w, 'history', p.history.length, 3, 6);
    range(w, 'knownStack', p.knownStack.length, 0, 6);
    p.knownStack.forEach((s) => !LAYERS.includes(s.layer) && fail(w, `bad layer ${s.layer}`));
    range(w, 'sources', p.sources.length, 1, 3);
    if (p.aliases.some((a) => a !== a.toLowerCase())) fail(w, 'aliases must be lowercase');
  });
  console.log(`✓ ${where}: ${products.length} products`);
}

async function load(file: string) {
  return import(pathToFileURL(resolve(file)).href);
}

async function main() {
  const [kind, file] = process.argv.slice(2);
  const jobs: [string, string][] = [];
  if (kind && file) jobs.push([kind, file]);
  else {
    const dir = 'src/lib/offline/archetypes';
    if (existsSync(dir)) readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'index.ts').forEach((f) => jobs.push(['archetype', `${dir}/${f}`]));
    ['src/lib/offline/frameworks-frontend.ts', 'src/lib/offline/frameworks-backend.ts'].forEach((f) => existsSync(f) && jobs.push(['packs', f]));
    ['src/lib/offline/known-products-a.ts', 'src/lib/offline/known-products-b.ts'].forEach((f) => existsSync(f) && jobs.push(['products', f]));
  }
  for (const [k, f] of jobs) {
    const mod = await load(f);
    const value = Object.values(mod)[0] as never;
    if (k === 'archetype') {
      checkArchetype(value as ArchetypeTemplate);
      console.log(`✓ checked ${f}`);
    } else if (k === 'packs') checkPacks(value as FrameworkPack[], f);
    else if (k === 'products') checkProducts(value as KnownProduct[], f);
  }
  console.log(problems ? `\n${problems} problem(s)` : '\nAll offline content valid');
  process.exit(problems ? 1 : 0);
}

void main();
