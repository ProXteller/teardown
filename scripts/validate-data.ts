import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import type { Teardown } from '../src/data/types';
import { parseTweaks, setEditableText, setTweak } from '../src/lib/playground';
import { tokenize } from '../src/lib/highlight';

// Usage: npx tsx scripts/validate-data.ts [src/data/curated/<id>.ts]  (no argument = every curated app in the catalog)
async function main() {
const file = process.argv[2];
const CURATED: Teardown[] = file
  ? [Object.values(await import(pathToFileURL(resolve(file)).href))[0] as Teardown]
  : (await import('../src/data/catalog')).CURATED;

let problems = 0;
const fail = (id: string, msg: string) => { problems++; console.log(`  ✗ [${id}] ${msg}`); };

for (const t of CURATED) {
  const { nodes, edges, flows } = t.architecture;
  const ids = new Set(nodes.map((n) => n.id));
  if (ids.size !== nodes.length) fail(t.id, 'duplicate node ids');
  const perTier = new Map<number, number>();
  nodes.forEach((n) => perTier.set(n.tier, (perTier.get(n.tier) ?? 0) + 1));
  perTier.forEach((c, tier) => c > 4 && fail(t.id, `tier ${tier} has ${c} nodes`));
  edges.forEach((e) => (!ids.has(e.from) || !ids.has(e.to)) && fail(t.id, `edge ${e.from}->${e.to} dangles`));
  const edgeSet = new Set(edges.flatMap((e) => [`${e.from}>${e.to}`, `${e.to}>${e.from}`]));
  flows.forEach((f) => f.steps.forEach((s) => !edgeSet.has(`${s.from}>${s.to}`) && fail(t.id, `flow "${f.title}" step ${s.from}->${s.to} has no edge`)));
  const share = t.languages.reduce((a, l) => a + l.share, 0);
  if (Math.abs(share - 100) > 1) fail(t.id, `language shares sum to ${share}`);

  const html = t.playground.html;
  const tweaks = parseTweaks(html);
  if (tweaks.length < 3) fail(t.id, `only ${tweaks.length} tweaks parsed`);
  tweaks.forEach((tw) => {
    const r = setTweak(html, tw.name, tw.type === 'color' ? '#123456' : `${tw.max}px`);
    if (!r.line || r.code === html) fail(t.id, `tweak ${tw.name} did not rewrite`);
    if (tw.type === 'range' && !/px$/.test(tw.value)) fail(t.id, `range ${tw.name} value "${tw.value}" is not px`);
  });
  const keys = [...html.matchAll(/data-edit=["']([^"']+)["']/g)].map((m) => m[1]);
  if (keys.length < 3) fail(t.id, `only ${keys.length} data-edit elements`);
  keys.forEach((k) => {
    const r = setEditableText(html, k, 'ZZZ');
    if (!r.line || !r.code.includes('>ZZZ<')) fail(t.id, `data-edit="${k}" is not plain text`);
  });
  if (/(src|href)=["']https?:/i.test(html)) fail(t.id, 'playground loads external resources');
  t.code.forEach((c) => tokenize(c.code, c.language));

  console.log(`✓ ${t.name}: ${nodes.length} nodes, ${edges.length} edges, ${flows.length} flows, ${t.code.length} snippets, ${tweaks.length} tweaks (${tweaks.map((x) => x.name).join(' ')}), ${keys.length} editable`);
}
console.log(problems ? `\n${problems} problem(s)` : '\nAll curated data valid');
process.exit(problems ? 1 : 0);
}

void main();
