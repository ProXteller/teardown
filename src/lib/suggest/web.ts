/**
 * Web lookup for search suggestions (server only; served by /api/suggest). Lists real apps and websites whose names
 * match what the student typed, from three free, keyless sources queried in parallel:
 *   - the App Store search (mobile apps, with icons and rating counts)
 *   - Clearbit's company autocomplete (company websites)
 *   - Wikidata (software, web services and companies that have an official website)
 * Every source has its own short timeout and a failing one is reported and skipped, so this never throws. Results are
 * merged per site (Zoom Workplace, Zoom Rooms and Wikidata's "Zoom" become one "Zoom"), ranked by how well the name
 * matches what was typed, and cached per query.
 */
import { normalizeDomain, siteOf } from '@/lib/suggest/domain';
import type { Suggestion, SuggestResponse, SuggestSourceStatus, WebSuggestionSource } from '@/lib/suggest/types';

/** Wikimedia's policy asks for a descriptive agent with a contact URL (same as src/lib/research/discover.ts) */
const UA = 'TeardownResearch/1.0 (https://github.com/ProXteller/teardown; student project)';
const TIMEOUT_MS = 2500;
const MAX_QUERY = 60;
const MAX_SUGGESTIONS = 8;
const CACHE_MS = 30 * 60_000;
/** A response with a failed source is only kept briefly, so a later keystroke tries that source again */
const PARTIAL_CACHE_MS = 60_000;
const MAX_CACHE_KEYS = 200;
/** After a source says it is rate limiting us (403/429), it is skipped this long instead of being asked on every keystroke */
const COOLDOWN_MS = 60_000;

/** Name relevance: the query as the whole name, its start, the start of a later word, or inside a word */
const EXACT = 100;
const PREFIX = 80;
const WORD = 70;
const SUBSTRING = 40;
/** The site's own name is the query ("txst" → txst.edu) */
const DOMAIN = 90;
/** An app kept only because its seller matches ("meta" → Instagram by Meta Platforms) */
const SELLER = 30;

/** Hosts that never identify a product: link shorteners, app store pages, link-in-bio and site-builder pages */
const DENY_HOSTS = new Set([
  'aka.ms',
  'bit.ly',
  't.co',
  'goo.gl',
  'tinyurl.com',
  'ow.ly',
  'linktr.ee',
  'linkin.bio',
  'lnk.bio',
  'bio.link',
  'beacons.ai',
  'apple.co',
  'apps.apple.com',
  'itunes.apple.com',
  'play.google.com',
  'sites.google.com',
  'forms.gle',
  'wa.me',
  'onelink.me',
  'app.link',
  'page.link',
  // Ad and file hosts that appear as App Store seller URLs
  'app-ads-txt.com',
  'githubusercontent.com',
  'amazonaws.com',
  'cloudfront.net',
]);

/**
 * Platforms and free hosts that hold pages for many products (facebook.com/zoomtips, someone.blogspot.com). A domain
 * on them is kept only when the host itself names the product (instagram.com for Instagram, meet.google.com for
 * Google Meet), and its subdomain counts as its own site.
 */
const SHARED_SITES = new Set([
  'google.com',
  'apple.com',
  'facebook.com',
  'fb.com',
  'instagram.com',
  'x.com',
  'twitter.com',
  'linkedin.com',
  'youtube.com',
  'tiktok.com',
  'github.com',
  'medium.com',
  'reddit.com',
  'discord.com',
  'discord.gg',
  't.me',
  'blogspot.com',
  'wordpress.com',
  'wixsite.com',
  'weebly.com',
  'squarespace.com',
  'notion.site',
  'carrd.co',
  'webflow.io',
  'framer.website',
  'super.site',
  'substack.com',
  'tumblr.com',
  'netlify.app',
  'vercel.app',
  'pages.dev',
  'web.app',
  'firebaseapp.com',
  'herokuapp.com',
  'glitch.me',
  'godaddysites.com',
  'mystrikingly.com',
  'jimdosite.com',
  'azurewebsites.net',
  'appspot.com',
  'onrender.com',
  'fly.dev',
  'replit.app',
  'surge.sh',
  'framer.app',
  'framer.ai',
  'gitbook.io',
  'myshopify.com',
  'business.site',
  'square.site',
  'about.me',
  'patreon.com',
  'ko-fi.com',
  'buymeacoffee.com',
  'gumroad.com',
  'itch.io',
  'etsy.com',
  'twitch.tv',
  'pinterest.com',
]);
/** Project hosts where every subdomain is its own project site (someone.github.io) */
const PROJECT_HOSTS = new Set(['github.io', 'gitlab.io']);
/** Subdomains that don't name a product (m.facebook.com is still facebook.com) */
const GENERIC_SUBDOMAINS = new Set(['m', 'mobile', 'web', 'about', 'en', 'app', 'apps', 'home', 'my', 'help', 'support']);
/** Name words too common to tie a host to a product */
const STOP_WORDS = new Set(['apps', 'free', 'lite', 'mobile', 'official', 'online', 'plus', 'tool', 'tools', 'with', 'your']);

/** Wikidata descriptions of things a student could tear down: software, websites, apps, companies */
const WIKIDATA_KEEP =
  /software|website|web ?service|online|\bapps?\b|application|platform|social (network|media)|messaging|video.?conferenc|search engine|streaming|company|corporation|marketplace|browser|game|programming language|operating system|e-?commerce|service|university|college|startup|chatbot/i;
/** ...and namesakes that aren't: the album, the TV series, the family name ("personal" and "journaling" are fine) */
const WIKIDATA_SKIP =
  /album|song|\b(film|movie|tv)\b|television|series|episode|\bband\b|musician|singer|rapper|\bactor\b|\bactress\b|\bperson\b|family name|given name|surname|asteroid|\bjournal\b|magazine|newspaper|mathemat|unit of|disambiguation|scholarly|\bbooks?\b|novel|fictional|\bcharacter\b|\bep\b/i;
/** Descriptions that say software outright are kept despite a namesake word ("e-book application", "book catalog website") */
const WIKIDATA_SOFTWARE = /\b(apps?|application|software|website|web service|platform)\b/i;

/** One lookup's match before merging */
interface Candidate {
  source: WebSuggestionSource;
  name: string;
  domain: string | null;
  description?: string;
  iconUrl?: string;
  popularity?: number;
  /** App Store bundle id (the key when an app has no usable domain) */
  appId?: string;
  /** Lowercase App Store seller */
  seller?: string;
  score: number;
}

type GetJson = (url: string) => Promise<unknown>;
type Json = Record<string, unknown>;

const record = (value: unknown): Json => (value && typeof value === 'object' ? (value as Json) : {});
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

/** Lowercase words without accents or punctuation: "Notion: Notes, Tasks & AI" → ["notion", "notes", "tasks", "ai"] */
function words(value: string): string[] {
  return value
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

/**
 * How well a name matches the query: exact ("Linear"), prefix ("ZoomInfo", "Linear Air"), a later word ("Park TXST"),
 * inside a word ("InfiZoom"), else 0. Case, accents and punctuation don't count; a spaced query also matches the name
 * written without spaces ("tik tok" is "TikTok").
 */
function nameScore(name: string, query: string): number {
  const q = words(query);
  const n = words(name);
  if (!q.length || !n.length) return 0;
  const qc = q.join('');
  const qs = q.join(' ');
  if (n.join('') === qc) return EXACT;
  const startsWith = (tail: string[]) => tail.join(' ').startsWith(qs) || (q.length > 1 && tail.join('').startsWith(qc));
  if (startsWith(n)) return PREFIX;
  if (n.some((_, i) => i > 0 && startsWith(n.slice(i)))) return WORD;
  // Inside a word ("InfiZoom"), not across words ("TX Stafford" is not "txst")
  return n.join(' ').includes(qs) || (q.length > 1 && n.join('').includes(qc)) ? SUBSTRING : 0;
}

/** Dedupe key for a domain: its registrable site, or the whole host on shared sites ("meet.google.com", "x.github.io") */
function siteKey(domain: string): string {
  const site = siteOf(domain);
  return SHARED_SITES.has(site) || PROJECT_HOSTS.has(site) ? domain : site;
}

/** A website whose name doesn't match can still match by its domain, so "txst" finds Texas State University at txst.edu */
function webScore(name: string, domain: string, query: string): number {
  const score = nameScore(name, query);
  return score || (words(siteKey(domain).split('.')[0]).join('') === words(query).join('') ? DOMAIN : 0);
}

/** True when one of a host's labels is the product's own name ("instagram" for Instagram, "meet" for Google Meet) */
function namesProduct(labels: string[], name: string): boolean {
  const nameWords = words(name);
  const compact = nameWords.join('');
  return labels.some((raw) => {
    const label = words(raw).join('');
    if (!label) return false;
    if (nameWords.includes(label) || compact === label || (label.length >= 4 && compact.includes(label))) return true;
    return nameWords.some((w) => w.length >= 4 && !STOP_WORDS.has(w) && label.includes(w));
  });
}

/** A seller URL or official website as a domain that identifies this product, or null (aka.ms, facebook.com/somepage) */
function usableDomain(raw: string, name: string): string | null {
  const domain = normalizeDomain(raw);
  if (!domain) return null;
  const site = siteOf(domain);
  if (DENY_HOSTS.has(domain) || DENY_HOSTS.has(site)) return null;
  if (PROJECT_HOSTS.has(site)) return domain === site ? null : domain;
  if (!SHARED_SITES.has(site)) return domain;
  const labels = domain
    .slice(0, -(site.length + 1))
    .split('.')
    .filter((label) => label && !GENERIC_SUBDOMAINS.has(label));
  if (!labels.length) return namesProduct([site.split('.')[0]], name) ? site : null;
  return namesProduct(labels, name) ? `${labels.join('.')}.${site}` : null;
}

/** App Store artwork, only from Apple's https image CDN */
function storeIcon(raw: string): string | undefined {
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && url.hostname.endsWith('.mzstatic.com') && !url.port && !url.username ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/** "Notion: Notes, Tasks, AI" → "Notion" and "Linear Algebra - Matrix Solver" → "Linear Algebra", while the short name still matches */
function shortAppName(trackName: string, query: string): string {
  const head = trackName.split(/\s*[:：]\s*|\s+[-–—|]\s+/)[0].trim();
  return head && head !== trackName && nameScore(head, query) >= WORD ? head : trackName;
}

async function appStore(query: string, get: GetJson): Promise<Candidate[]> {
  const data = record(await get(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=software&limit=15&country=us`));
  return list(data.results).flatMap((item): Candidate[] => {
    const app = record(item);
    const trackName = text(app.trackName);
    const seller = text(app.sellerName);
    const name = shortAppName(trackName, query);
    const score = Math.max(nameScore(name, query), nameScore(trackName, query));
    // The search also returns unrelated popular apps ("Claude by Anthropic" for "linear"): keep real name matches only
    if (!trackName || (score < WORD && nameScore(seller, query) < WORD)) return [];
    const genre = text(app.primaryGenreName);
    return [
      {
        source: 'appstore',
        name,
        domain: usableDomain(text(app.sellerUrl), trackName),
        description: [genre ? `${genre} app` : 'App', seller].filter(Boolean).join(' · '),
        iconUrl: storeIcon(text(app.artworkUrl100)),
        popularity: typeof app.userRatingCount === 'number' ? app.userRatingCount : 0,
        appId: text(app.bundleId) || (typeof app.trackId === 'number' ? String(app.trackId) : undefined),
        seller: seller.toLowerCase(),
        score: Math.max(score, SELLER),
      },
    ];
  });
}

async function clearbit(query: string, get: GetJson): Promise<Candidate[]> {
  const data = await get(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(query)}`);
  return list(data).flatMap((item): Candidate[] => {
    const company = record(item);
    const name = text(company.name);
    const domain = name ? usableDomain(text(company.domain), name) : null;
    return domain ? [{ source: 'clearbit', name, domain, description: domain, score: webScore(name, domain, query) }] : [];
  });
}

/** An item's official website (P856): the preferred statement, else the first one that isn't deprecated */
function officialWebsite(entity: unknown): string {
  const claims = list(record(record(entity).claims).P856)
    .map(record)
    .filter((claim) => claim.rank !== 'deprecated');
  const claim = claims.find((c) => c.rank === 'preferred') ?? claims[0];
  return text(record(record(record(claim).mainsnak).datavalue).value);
}

async function wikidata(query: string, get: GetJson): Promise<Candidate[]> {
  const api = 'https://www.wikidata.org/w/api.php';
  const found = record(
    await get(`${api}?action=wbsearchentities&search=${encodeURIComponent(query)}&language=en&limit=12&format=json&type=item&origin=*`),
  );
  const hits = list(found.search)
    .map(record)
    .map((hit) => ({ id: text(hit.id), label: text(hit.label), description: text(hit.description) }))
    .filter(
      (hit) =>
        /^Q\d+$/.test(hit.id) &&
        hit.label &&
        WIKIDATA_KEEP.test(hit.description) &&
        (!WIKIDATA_SKIP.test(hit.description) || WIKIDATA_SOFTWARE.test(hit.description)),
    );
  if (!hits.length) return [];
  // One batched lookup of every kept item's official website
  const ids = [...new Set(hits.map((hit) => hit.id))].join('|');
  const entities = record(record(await get(`${api}?action=wbgetentities&ids=${encodeURIComponent(ids)}&props=claims&format=json&origin=*`)).entities);
  return hits.flatMap((hit): Candidate[] => {
    const domain = usableDomain(officialWebsite(entities[hit.id]), hit.label);
    if (!domain) return [];
    const description = (hit.description.charAt(0).toUpperCase() + hit.description.slice(1)).slice(0, 120);
    return [{ source: 'wikidata', name: hit.label, domain, description, score: webScore(hit.label, domain, query) }];
  });
}

/** Until when each source is skipped after rate limiting us, per fetch (tests pass their own) */
const cooldowns = new WeakMap<typeof fetch, Map<WebSuggestionSource, number>>();

/** Runs one source with its own timeout; a failure (or a fetch that ignores the abort) only costs that source */
async function runSource(
  name: WebSuggestionSource,
  run: (get: GetJson) => Promise<Candidate[]>,
  fetcher: typeof fetch,
  timeoutMs: number,
): Promise<{ status: SuggestSourceStatus; candidates: Candidate[] }> {
  const started = Date.now();
  if ((cooldowns.get(fetcher)?.get(name) ?? 0) > started) return { status: { name, ok: false, ms: 0 }, candidates: [] };
  const controller = new AbortController();
  const get: GetJson = async (url) => {
    const res = await fetcher(url, { signal: controller.signal, headers: { 'user-agent': UA, accept: 'application/json' } });
    if (res.status === 403 || res.status === 429) {
      if (!cooldowns.has(fetcher)) cooldowns.set(fetcher, new Map());
      cooldowns.get(fetcher)?.set(name, Date.now() + COOLDOWN_MS);
    }
    if (!res.ok) throw new Error(`${name} responded ${res.status}`);
    const json: unknown = await res.json();
    // The MediaWiki API reports many failures as HTTP 200 with an "error" object
    if (record(json).error) throw new Error(`${name} returned an error`);
    return json;
  };
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error(`${name} timed out`));
    }, timeoutMs);
  });
  try {
    const candidates = await Promise.race([run(get), timeout]);
    return { status: { name, ok: true, ms: Date.now() - started }, candidates };
  } catch {
    return { status: { name, ok: false, ms: Date.now() - started }, candidates: [] };
  } finally {
    clearTimeout(timer);
  }
}

interface Group {
  members: Candidate[];
  sites: Set<string>;
  /** "<seller>|<site name>" of its apps */
  sellers: Set<string>;
}

/** One suggestion per product: the most-rated app's icon and popularity, and whichever name matches the query best */
function toSuggestion({ members }: Group, query: string): { suggestion: Suggestion; score: number } {
  const apps = members.filter((c) => c.source === 'appstore');
  const web = members.filter((c) => c.source !== 'appstore');
  // A website's name wins only when it matches what was typed better ("Linear" over "Linear Mobile")
  const named = [...apps.slice(0, 1), ...web].reduce((best, c) => (nameScore(c.name, query) > nameScore(best.name, query) ? c : best));
  // Only a Wikidata item named as well describes it: Google Maps' entry (website google.com/maps) doesn't describe "Google"
  const described =
    [named, ...web].find((c) => c.source === 'wikidata' && nameScore(c.name, query) >= nameScore(named.name, query)) ?? apps[0] ?? named;
  const suggestion: Suggestion = {
    key: named.domain ? `domain:${siteKey(named.domain)}` : `app:${named.appId ?? words(named.name).join('-')}`,
    kind: members[0].source === 'appstore' ? 'app' : 'website',
    name: named.name,
    domain: named.domain,
    description: described.description,
    iconUrl: apps.find((app) => app.iconUrl)?.iconUrl,
    source: members[0].source,
    popularity: apps.length ? Math.max(...apps.map((app) => app.popularity ?? 0)) : undefined,
  };
  return { suggestion, score: Math.max(...members.map((c) => c.score)) };
}

function merge(candidates: Candidate[], query: string): Suggestion[] {
  const groups: Group[] = [];
  const appIds = new Set<string>();
  // Most-rated apps first, so a collapsed group is led by its best-known app
  const ordered = [
    ...candidates.filter((c) => c.source === 'appstore').sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)),
    ...candidates.filter((c) => c.source !== 'appstore'),
  ];
  for (const c of ordered) {
    if (c.score <= 0) continue;
    if (!c.domain) {
      const id = c.appId ?? c.name.toLowerCase();
      if (!appIds.has(id)) groups.push({ members: [c], sites: new Set(), sellers: new Set() });
      appIds.add(id);
      continue;
    }
    const site = siteKey(c.domain);
    // One seller's apps on sites with the same name are one product too (Zoom Workplace at zoom.com, Zoom Rooms at zoom.us)
    const seller = c.seller ? `${c.seller}|${site.split('.')[0]}` : '';
    let group = groups.find((g) => g.sites.has(site)) ?? (seller ? groups.find((g) => g.sellers.has(seller)) : undefined);
    if (!group) groups.push((group = { members: [], sites: new Set(), sellers: new Set() }));
    group.members.push(c);
    group.sites.add(site);
    if (seller) group.sellers.add(seller);
  }
  const ranked = groups
    .map((group) => toSuggestion(group, query))
    .sort((a, b) => b.score - a.score || (b.suggestion.popularity ?? 0) - (a.suggestion.popularity ?? 0));
  const byKey = new Map<string, Suggestion>();
  for (const { suggestion } of ranked) if (!byKey.has(suggestion.key)) byKey.set(suggestion.key, suggestion);
  return [...byKey.values()].slice(0, MAX_SUGGESTIONS);
}

async function lookup(query: string, fetcher: typeof fetch, timeoutMs: number): Promise<SuggestResponse> {
  const results = await Promise.all([
    runSource('appstore', (get) => appStore(query, get), fetcher, timeoutMs),
    runSource('clearbit', (get) => clearbit(query, get), fetcher, timeoutMs),
    runSource('wikidata', (get) => wikidata(query, get), fetcher, timeoutMs),
  ]);
  const sources = results.map((r) => r.status);
  try {
    return { query, suggestions: merge(results.flatMap((r) => r.candidates), query), sources };
  } catch {
    return { query, suggestions: [], sources };
  }
}

const cache = new Map<string, { expires: number; response: SuggestResponse }>();
const inFlight = new Map<string, Promise<SuggestResponse>>();

function remember(key: string, response: SuggestResponse) {
  cache.delete(key);
  cache.set(key, { expires: Date.now() + (response.sources.every((s) => s.ok) ? CACHE_MS : PARTIAL_CACHE_MS), response });
  for (const oldest of cache.keys()) {
    if (cache.size <= MAX_CACHE_KEYS) break;
    cache.delete(oldest);
  }
}

/** What was typed, spaces collapsed and clipped to 60 characters without splitting an emoji */
export function clipQuery(input: string): string {
  const text = String(input ?? '')
    .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return Array.from(text).slice(0, MAX_QUERY).join('').trim();
}

/**
 * Real apps and websites whose names match the query, best match first (at most 8). Identical queries share one
 * lookup while it runs and its result for 30 minutes. Never throws: a failed source shows up as ok:false in `sources`.
 */
export async function webSuggestions(input: string, opts: { fetch?: typeof fetch; timeoutMs?: number } = {}): Promise<SuggestResponse> {
  const query = clipQuery(input);
  // A URL's scheme and www. name nothing ("https://" alone looks nothing up), and without letters or digits nothing matches
  const term = query.replace(/^https?:\/{0,2}/i, '').replace(/^www\./i, '');
  if (term.length < 2 || !words(term).length) return { query, suggestions: [], sources: [] };
  const key = term.toLowerCase();
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) return { ...cached.response, query };
  let pending = inFlight.get(key);
  if (!pending) {
    pending = lookup(term, opts.fetch ?? fetch, opts.timeoutMs ?? TIMEOUT_MS)
      .then((response) => {
        remember(key, response);
        return response;
      })
      .finally(() => inFlight.delete(key));
    inFlight.set(key, pending);
  }
  try {
    return { ...(await pending), query };
  } catch {
    return { query, suggestions: [], sources: [] };
  }
}
