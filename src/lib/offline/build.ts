import type { Confidence, StackLayer, Teardown } from '@/data/types';
import type { ScanResult } from '@/lib/fingerprints';

import { buildSitePlayground, hasRebuildableContent } from './site-playground';
import type { ArchetypeId, ArchetypeTemplate, FrameworkPack, KnownProduct } from './types';

/**
 * Builds a complete teardown for ANY product in milliseconds, with no AI:
 * live-scan evidence (confirmed) + known facts (confirmed) + archetype patterns (likely).
 */

export interface OfflineContent {
  archetypes: Record<ArchetypeId, ArchetypeTemplate>;
  packs: FrameworkPack[];
  products: KnownProduct[];
}

/** Bump when templates or build logic change so saved instant teardowns get rebuilt. */
export const QUICK_ENGINE_VERSION = 5;

export interface QuickMeta {
  version: number;
  archetype: ArchetypeId;
  archetypeLabel: string;
  knownProduct: boolean;
  /** Set when we had to guess the website from a bare name */
  guessedDomain?: string;
  /** True when the playground rebuilds the real page rather than an example screen */
  playgroundFromSite: boolean;
  detections: number;
  builtInMs: number;
}

export interface QuickInput {
  id: string;
  /** What the user typed */
  query: string;
  /** Name guess from the query, e.g. "Duolingo" */
  displayName: string;
  domain: string | null;
  guessedDomain: boolean;
  scan: ScanResult | null;
  known?: KnownProduct;
}

const LAYER_ORDER: StackLayer[] = ['Frontend', 'Mobile', 'Backend', 'Data', 'Infrastructure', 'AI / ML', 'DevOps'];

const FRONTEND_PRIORITY = [
  'Next.js', 'Nuxt (Vue)', 'Remix / React Router', 'Gatsby', 'Astro', 'Svelte / SvelteKit', 'Angular', 'Expo (React Native Web)',
  'Vue.js', 'Ember.js', 'React', 'Shopify', 'WordPress', 'Squarespace', 'Wix', 'Webflow', 'Framer', 'Ghost', 'Drupal',
  'HubSpot CMS', 'htmx', 'Alpine.js', 'jQuery',
];
const HOSTING_PRIORITY = [
  'Cloudflare', 'Vercel', 'Netlify', 'Amazon CloudFront', 'Fastly', 'Akamai', 'Meta infrastructure', 'Google Front End',
  'Google Cloud', 'Microsoft Azure', 'Firebase Hosting', 'GitHub Pages', 'Heroku', 'Fly.io', 'Render', 'Amazon Web Services',
];
const BACKEND_PRIORITY = ['Ruby on Rails', 'Django', 'Laravel', 'ASP.NET', 'Express (Node.js)', 'PHP', 'Proxygen (Meta)'];

/* ------------------------------------------------------------------ */
/* Classification                                                      */
/* ------------------------------------------------------------------ */

export function classify(content: OfflineContent, input: Pick<QuickInput, 'domain' | 'scan' | 'known' | 'displayName'>): ArchetypeId {
  if (input.known) return input.known.archetype;
  const domain = input.domain ?? '';
  if (/\.(edu|ac\.[a-z]{2}|edu\.[a-z]{2})$/.test(domain)) return 'education';
  const names = new Set(input.scan?.detections.map((d) => d.name));
  if (names.has('Shopify')) return 'commerce';

  const haystack = ` ${[input.scan?.title, input.scan?.description, input.scan?.siteName, domain.replace(/\./g, ' '), input.displayName]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()} `;
  let best: { id: ArchetypeId; score: number } = { id: 'webapp', score: 0 };
  for (const a of Object.values(content.archetypes)) {
    if (a.id === 'webapp') continue;
    let score = 0;
    for (const k of a.keywords) {
      const kw = k.toLowerCase().trim();
      if (!kw) continue;
      const re = new RegExp(`[^a-z0-9]${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^a-z0-9]`);
      if (re.test(haystack)) score += kw.includes(' ') ? 2 : 1;
    }
    if (score > best.score) best = { id: a.id, score };
  }
  if (best.score > 0) return best.id;
  if (names.has('Ghost') || names.has('WordPress') || names.has('Squarespace') || names.has('Wix') || names.has('Framer') || names.has('Webflow')) return 'content';
  if (names.has('Stripe') || names.has('PayPal')) return 'commerce';
  return 'webapp';
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const PALETTE: [string, string][] = [
  ['#5B5BD6', '#00A2C7'],
  ['#E5484D', '#F76B15'],
  ['#12A594', '#3E63DD'],
  ['#D6409F', '#8E4EC6'],
  ['#F76B15', '#FFC53D'],
  ['#0090FF', '#46A758'],
  ['#8E4EC6', '#E54666'],
  ['#29A383', '#0D74CE'],
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function luminance(hex: string) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/** Title like "Duolingo - The world's best way to learn a language" → "Duolingo" */
export function productName(input: Pick<QuickInput, 'known' | 'scan' | 'domain' | 'displayName'>): string {
  if (input.known) return input.known.name;
  const root = (input.domain ?? '').split('.').slice(-2, -1)[0]?.toLowerCase() ?? '';
  const site = input.scan?.siteName?.trim();
  if (site && site.length <= 32) return site;
  const title = input.scan?.title?.trim();
  if (title) {
    const parts = title
      .split(/\s+[|·•—–-]\s+|:\s+/)
      // "Canvas Login" → "Canvas", "Acme Home" → "Acme"
      .map((p) => p.trim().replace(/\s+(log ?in|sign ?in|home ?page|home|welcome)$/i, ''))
      .filter(Boolean);
    const match = root && parts.find((p) => p.toLowerCase().replace(/[^a-z0-9]/g, '').includes(root));
    if (match && match.length <= 32) return match;
    const short = parts.filter((p) => p.length <= 24).sort((a, b) => a.length - b.length)[0];
    if (short && parts.length > 1) return short;
    // A single clean title like "Texas State University" beats a guess from the domain
    if (parts.length === 1 && parts[0].length >= 3 && parts[0].length <= 40 && !/^(home|welcome|index|log ?in|sign ?in|untitled|just a moment|access denied|error)/i.test(parts[0])) {
      return parts[0];
    }
  }
  return input.displayName;
}

function trimSentence(text: string, max = 150) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '));
  return end > 60 ? cut.slice(0, end + 1) : `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

function fillDeep<T>(value: T, vars: Record<string, string>): T {
  if (typeof value === 'string') return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k: string) => vars[k] ?? m) as T;
  if (Array.isArray(value)) return value.map((v) => fillDeep(v, vars)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fillDeep(v, vars)])) as T;
  }
  return value;
}

const norm = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, '');

/* ------------------------------------------------------------------ */
/* Builder                                                             */
/* ------------------------------------------------------------------ */

export function buildQuickTeardown(content: OfflineContent, input: QuickInput): { teardown: Teardown; meta: QuickMeta } {
  const started = Date.now();
  const { scan, known } = input;
  const detections = scan?.ok ? scan.detections : [];
  const detected = new Set(detections.map((d) => d.name));
  const packs = content.packs.filter((p) => detected.has(p.detection));

  const archetypeId = classify(content, input);
  const archetype = content.archetypes[archetypeId] ?? content.archetypes.webapp;
  const name = productName(input);
  const domain = input.domain ?? '';

  // Colors: known brand → site theme-color → stable palette
  const [pa, pb] = PALETTE[hash(name) % PALETTE.length];
  const theme = scan?.themeColor && luminance(scan.themeColor) > 35 && luminance(scan.themeColor) < 225 ? scan.themeColor : undefined;
  const brand = known?.brandColor ?? theme ?? pa;
  const accent = known?.accentColor ?? (theme ? pa : pb);

  const frontend = FRONTEND_PRIORITY.find((n) => detected.has(n)) ?? known?.knownStack.find((s) => s.layer === 'Frontend')?.name ?? 'a modern JavaScript framework';
  const hostingList = HOSTING_PRIORITY.filter((n) => detected.has(n));
  const hosting = hostingList.length ? hostingList.slice(0, 2).join(' + ') : 'a CDN';
  const backend = BACKEND_PRIORITY.find((n) => detected.has(n));

  const tagline = known?.tagline ?? (scan?.description ? trimSentence(scan.description) : undefined);
  const vars = { name, domain, brand, accent, frontend, hosting, tagline: tagline ?? '' };
  vars.tagline = tagline ?? fillDeep(archetype.tagline, vars);
  const t = fillDeep(archetype, vars);

  /* Stack: confirmed evidence first, then typical choices */
  const byLayer = new Map<StackLayer, { name: string; role: string; beginnerNote: string; confidence: Confidence }[]>();
  const push = (layer: StackLayer, item: { name: string; role: string; beginnerNote: string }, confidence: Confidence) => {
    const key = norm(item.name);
    // Skip anything already listed in ANY layer (confirmed items win because they are pushed first)
    const all = [...byLayer.values()].flat();
    if (all.some((i) => norm(i.name) === key || (key.length > 3 && norm(i.name).length > 3 && (norm(i.name).includes(key) || key.includes(norm(i.name)))))) return;
    const list = byLayer.get(layer) ?? [];
    list.push({ ...item, confidence });
    byLayer.set(layer, list);
  };
  known?.knownStack.forEach((s) => push(s.layer, s, 'confirmed'));
  packs.forEach((p) => p.stackItems.forEach((s) => push(s.layer, s, 'confirmed')));
  detections
    .filter((d) => !content.packs.some((p) => p.detection === d.name))
    .forEach((d) =>
      push(d.category === 'Framework' || d.category === 'CMS / Platform' || d.category === 'Library' ? 'Frontend' : d.category === 'Server' ? 'Backend' : 'Infrastructure', { name: d.name, role: d.category, beginnerNote: d.evidence }, 'confirmed'),
    );
  t.stack.forEach((l) => l.items.forEach((i) => push(l.layer, i, 'likely')));
  const stack = LAYER_ORDER.filter((l) => byLayer.has(l)).map((layer) => ({ layer, items: byLayer.get(layer)!.slice(0, 5) }));

  /* Languages: archetype mix, nudged by what the scan proved */
  const langs = t.languages.map((l) => ({ ...l }));
  packs.forEach((p) => {
    if (!p.language) return;
    const existing = langs.find((l) => norm(l.name) === norm(p.language!.name));
    if (existing) existing.share += 12;
    else langs.push({ name: p.language.name, usedFor: p.language.usedFor, share: 14 });
  });
  const top = langs.sort((a, b) => b.share - a.share).slice(0, 6);
  const total = top.reduce((s, l) => s + l.share, 0) || 1;
  const languages = top.map((l) => ({ ...l, share: Math.max(1, Math.round((l.share / total) * 100)) }));
  if (languages.length) languages[0].share += 100 - languages.reduce((s, l) => s + l.share, 0);

  /* Architecture: template, with detected back end called out */
  const nodes = t.architecture.nodes.map((n) => ({ ...n }));
  if (backend) {
    const api = nodes.find((n) => n.tier === 2 && (n.kind === 'gateway' || n.kind === 'service')) ?? nodes.find((n) => n.tier === 3 && n.kind === 'service');
    if (api) api.tech = `${backend} (detected) · ${api.tech}`;
  }

  /* Files, code, concepts: detected tech first */
  const seenPaths = new Set<string>();
  const files = [...packs.flatMap((p) => fillDeep(p.files, vars)), ...t.files].filter((f) => !seenPaths.has(f.path) && seenPaths.add(f.path)).slice(0, 20);
  const code = [...packs.flatMap((p) => fillDeep(p.code, vars)).slice(0, 2), ...t.code].map((c, i) => ({ ...c, id: `${c.id || 'snippet'}-${i}` }));
  const seenTerms = new Set<string>();
  const concepts = [...packs.flatMap((p) => p.concepts), ...t.concepts].filter((c) => !seenTerms.has(norm(c.term)) && seenTerms.add(norm(c.term))).slice(0, 10);

  const facts = known
    ? [...known.facts, ...(domain ? [{ label: 'Website', value: domain }] : [])]
    : [
        { label: 'Website', value: domain || 'Not scanned' },
        { label: 'Type of product', value: archetype.label },
        { label: 'Front end', value: FRONTEND_PRIORITY.find((n) => detected.has(n)) ?? 'Not detected' },
        { label: 'Hosting / CDN', value: hostingList.join(', ') || 'Not detected' },
        { label: 'Tech detected', value: scan?.ok ? `${detections.length} fingerprints` : 'Scan unavailable' },
      ];

  const sources = known?.sources.length
    ? known.sources
    : domain && scan?.ok
      ? [{ label: `${name} official site`, url: `https://${domain}` }]
      : [];

  // Playground: rebuild the real page when the scan read enough of it; otherwise a clearly labelled example
  const outline = scan?.ok ? scan.outline : undefined;
  const sitePlayground = hasRebuildableContent(outline) && domain ? buildSitePlayground(outline, { name, domain, brand, accent }) : null;
  const playground = sitePlayground ?? {
    ...t.playground,
    description: `An example ${archetype.label.toLowerCase()} screen, not ${name}’s real design (${
      scan?.ok ? 'the page didn’t have enough readable content to rebuild' : 'the site couldn’t be scanned'
    }). ${t.playground.description}`,
  };

  const teardown: Teardown = {
    id: input.id,
    name,
    url: domain,
    tagline: vars.tagline,
    category: known ? `${archetype.label}` : archetype.label,
    brandColor: brand,
    accentColor: accent,
    logoGlyph: known?.logoGlyph ?? (name.match(/[A-Za-z0-9]/)?.[0]?.toUpperCase() ?? '#'),
    source: 'scan',
    eli5: t.eli5,
    facts,
    history: known?.history ?? [],
    languages,
    stack,
    architecture: { nodes, edges: t.architecture.edges, flows: t.architecture.flows },
    files,
    code,
    playground,
    concepts,
    buildYourOwn: t.buildYourOwn,
    sources,
  };

  return {
    teardown,
    meta: {
      version: QUICK_ENGINE_VERSION,
      archetype: archetype.id,
      archetypeLabel: archetype.label,
      knownProduct: Boolean(known),
      guessedDomain: input.guessedDomain && domain ? domain : undefined,
      playgroundFromSite: Boolean(sitePlayground),
      detections: detections.length,
      builtInMs: Date.now() - started,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Product & domain lookup                                             */
/* ------------------------------------------------------------------ */

export function findKnownProduct(products: KnownProduct[], query: { raw: string; host: string | null }): KnownProduct | undefined {
  if (query.host) {
    const host = query.host.replace(/^www\./, '');
    return products.find((p) => p.domains.some((d) => host === d || host.endsWith(`.${d}`)));
  }
  const q = query.raw.toLowerCase().trim();
  const compact = q.replace(/[^a-z0-9]/g, '');
  return products.find(
    (p) => p.name.toLowerCase() === q || norm(p.name) === compact || p.aliases.some((a) => a === q || a.replace(/[^a-z0-9]/g, '') === compact),
  );
}

/** Picks the website to scan for a query: the typed URL, a known product's domain, or a guessed "<name>.com". */
export function resolveDomain(query: { raw: string; host: string | null }, known?: KnownProduct): { domain: string | null; guessed: boolean } {
  if (query.host) return { domain: query.host, guessed: false };
  if (known?.domains[0]) return { domain: known.domains[0], guessed: false };
  const token = query.raw.trim().toLowerCase();
  if (/^[a-z0-9][a-z0-9-]{1,30}$/.test(token)) return { domain: `${token}.com`, guessed: true };
  return { domain: null, guessed: false };
}
