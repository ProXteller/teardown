/**
 * Local search suggestions: matches what a student types against Teardown's own library (curated teardowns, the
 * offline known-products list and teardowns they opened before) with no network, merges in web results, and turns a
 * chosen suggestion into the query that starts its teardown. Pure (no React, no storage): safe on client and server.
 */
import { CURATED, curatedAliases, findCurated, getCurated, parseQuery, type ParsedQuery } from '@/data/catalog';
import type { Teardown } from '@/data/types';
import { findKnownProduct, resolveDomain } from '@/lib/offline/build';
import { OFFLINE } from '@/lib/offline/content';
import type { HistoryItem } from '@/lib/store';

import { normalizeDomain, sameSite, siteOf } from './domain';
import type { Suggestion } from './types';

const SCORE = { exact: 100, subdomain: 90, prefix: 80, word: 70, domain: 60, substring: 40, typo: 30 };
const BOOST = { curated: 5, recent: 3 };

/** Subdomains that are pages of the site, not products of their own (help.instagram.com, but not meet.google.com) */
const GENERIC_SUBDOMAINS = new Set(['m', 'mobile', 'web', 'about', 'en', 'app', 'apps', 'home', 'my', 'help', 'support']);
/** Dotted names that are files or frameworks, not web addresses: "Next.js", "Node.js" */
const FILE_SUFFIXES = new Set([
  ...['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs', 'json', 'css', 'scss', 'html', 'htm', 'php'],
  ...['txt', 'exe', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'svg'],
]);

/** Lowercase letters and digits only: "X (Twitter)" → "xtwitter", "Booking.com" → "bookingcom" */
const compact = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** True when `domain` is `site` itself or one of its generic pages ("m.x.com" of "x.com") */
function isPageOf(domain: string, site: string): boolean {
  if (domain === site) return true;
  if (!domain.endsWith(`.${site}`)) return false;
  return domain
    .slice(0, -(site.length + 1))
    .split('.')
    .every((label) => GENERIC_SUBDOMAINS.has(label));
}

/** What was typed, prepared once per keystroke */
interface Needle {
  compact: string;
  /** The typed domain when the input is a URL or domain, e.g. "zoom.us" */
  domain: string | null;
}

/** Everything a product can be found by */
interface Target {
  names: { compact: string; tails: string[] }[];
  domains: string[];
}

function needleOf(input: string): Needle | null {
  const text = input.trim();
  const q = compact(text);
  if (!q) return null;
  return { compact: q, domain: isSpecificAddress(text) ? normalizeDomain(text) : null };
}

function targetOf(names: (string | null | undefined)[], domains: (string | null | undefined)[]): Target {
  const variants = new Set<string>();
  for (const name of names) {
    if (!name?.trim()) continue;
    variants.add(name);
    // "X (Twitter)" is also found as "X"
    const bare = name.replace(/\s*\(.*?\)\s*/g, ' ').trim();
    if (bare) variants.add(bare);
  }
  return {
    names: [...variants].map((name) => {
      // Word starts, camelCase included: "Google Drive" → "drive", "YouTube" → "tube"
      const words = name
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean);
      return { compact: compact(name), tails: words.slice(1).map((_, i) => words.slice(i + 1).join('')) };
    }),
    domains: [...new Set(domains.map((d) => normalizeDomain(d)).filter((d): d is string => Boolean(d)))],
  };
}

/** Optimal string alignment distance (Damerau–Levenshtein with adjacent swaps), giving up past `max` */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      let d = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d = Math.min(d, prev2[j - 2] + 1);
      row.push(d);
      rowMin = Math.min(rowMin, d);
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = row;
  }
  return prev[b.length];
}

/** A likely typo of a name ("googel" → "google"), or of its start once the query is long enough ("microsft teams") */
function isTypo(q: string, name: string): boolean {
  const max = q.length >= 8 ? 2 : q.length >= 4 ? 1 : 0;
  if (!max) return false;
  if (editDistance(q, name, max) <= max) return true;
  if (q.length < 6 || name.length <= q.length) return false;
  return [q.length - 1, q.length, q.length + 1].some((n) => editDistance(q, name.slice(0, n), max) <= max);
}

/** How well a product matches what was typed: 0 (no match) to 100 (exact) */
function scoreTarget(needle: Needle, target: Target): number {
  const q = needle.compact;
  let best = 0;
  for (const name of target.names) {
    if (name.compact === q) return SCORE.exact;
    if (name.compact.startsWith(q)) best = Math.max(best, SCORE.prefix);
    // A single letter only finds names that start with it
    if (q.length < 2) continue;
    if (name.tails.some((tail) => tail.startsWith(q))) best = Math.max(best, SCORE.word);
    if (q.length >= 3 && name.compact.includes(q)) best = Math.max(best, SCORE.substring);
    if (best < SCORE.typo && isTypo(q, name.compact)) best = SCORE.typo;
  }
  if (q.length < 2) return best;
  for (const domain of target.domains) {
    if (needle.domain === domain) return SCORE.exact;
    if (needle.domain?.endsWith(`.${domain}`)) best = Math.max(best, SCORE.subdomain);
    // The name part of a site's own domain counts as a name ("bsky" → bsky.app), but not a parent's ("google" → drive.google.com)
    const label = siteOf(domain) === domain ? domain.slice(0, domain.indexOf('.')) : null;
    if (compact(domain) === q || (label && compact(label) === q)) return SCORE.exact;
    if (compact(domain).startsWith(q)) best = Math.max(best, SCORE.domain);
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* Library                                                             */
/* ------------------------------------------------------------------ */

interface LibraryItem {
  suggestion: Suggestion;
  target: Target;
}

let library: { curated: Map<string, LibraryItem>; known: Map<string, LibraryItem> } | undefined;

/** Curated teardowns and known products, indexed once on first use */
function getLibrary() {
  if (library) return library;
  const curated = new Map<string, LibraryItem>();
  for (const t of CURATED) {
    curated.set(t.id, {
      suggestion: {
        key: `curated:${t.id}`,
        kind: 'curated',
        name: t.name,
        domain: normalizeDomain(t.url),
        description: t.tagline,
        curatedId: t.id,
        logoGlyph: t.logoGlyph,
        brandColor: t.brandColor,
      },
      target: targetOf([t.name, t.id, ...curatedAliases(t.id)], [t.url]),
    });
  }
  const known = new Map<string, LibraryItem>();
  for (const p of OFFLINE.products) {
    const domain = normalizeDomain(p.domains[0]);
    known.set(p.id, {
      suggestion: {
        key: domain ? `domain:${domain}` : `known:${p.id}`,
        kind: 'known',
        name: p.name,
        domain,
        description: p.tagline,
        logoGlyph: p.logoGlyph,
        brandColor: p.brandColor,
      },
      target: targetOf([p.name, ...p.aliases], p.domains),
    });
  }
  library = { curated, known };
  return library;
}

const SOURCE_LABEL: Record<Teardown['source'], string> = { curated: 'Curated', ai: 'AI teardown', scan: 'Instant' };

/**
 * Library products and past teardowns that match what the student typed, best first. A past teardown of a curated
 * or known product shows once (curated wins; otherwise the past teardown, so it reopens instead of rebuilding).
 */
export function localSuggestions(input: string, history: HistoryItem[], limit = 6): Suggestion[] {
  const needle = needleOf(input);
  if (!needle || limit <= 0) return [];
  const { curated, known } = getLibrary();
  const found = new Map<string, { suggestion: Suggestion; score: number }>();

  for (const [id, item] of curated) {
    const score = scoreTarget(needle, item.target);
    if (score) found.set(`curated:${id}`, { suggestion: item.suggestion, score: score + BOOST.curated });
  }
  for (const [id, item] of known) {
    const score = scoreTarget(needle, item.target);
    if (score) found.set(`known:${id}`, { suggestion: item.suggestion, score });
  }

  const seen = new Set<string>();
  for (const h of history) {
    const query = h.query?.trim() || null;
    const address = query && isSpecificAddress(query) ? normalizeDomain(query) : null;
    const own = scoreTarget(needle, targetOf([h.name, address ? null : query], [address]));
    const curatedItem = curated.get(h.id);
    const product = curatedItem ? undefined : findKnownProduct(OFFLINE.products, query ? parseQuery(query) : { raw: h.name, host: null });
    const knownItem = product && known.get(product.id);
    const slot = curatedItem ? `curated:${h.id}` : product && knownItem ? `known:${product.id}` : `recent:${h.id}`;
    // History is newest first: an older visit of the same product adds nothing
    if (seen.has(slot)) continue;
    seen.add(slot);
    const libraryItem = curatedItem ?? knownItem;
    const score = Math.max(own, libraryItem ? scoreTarget(needle, libraryItem.target) : 0);
    if (!score) continue;
    const opened = `Opened before · ${SOURCE_LABEL[h.source] ?? 'Instant'}`;
    if (curatedItem) {
      found.set(slot, {
        suggestion: { ...curatedItem.suggestion, entryId: h.id },
        score: score + BOOST.curated + BOOST.recent,
      });
      continue;
    }
    found.set(slot, {
      suggestion: {
        key: `recent:${h.id}`,
        kind: 'recent',
        name: h.name,
        domain: address ?? knownItem?.suggestion.domain ?? null,
        description: opened,
        entryId: h.id,
        logoGlyph: h.glyph || knownItem?.suggestion.logoGlyph,
        brandColor: h.color || knownItem?.suggestion.brandColor,
      },
      score: score + BOOST.recent,
    });
  }

  const ranked = [...found.values()].sort(
    (a, b) => b.score - a.score || a.suggestion.name.length - b.suggestion.name.length || a.suggestion.name.localeCompare(b.suggestion.name),
  );
  return uniqueByKey(ranked.map((m) => ({ ...m.suggestion }))).slice(0, limit);
}

function uniqueByKey(list: Suggestion[]): Suggestion[] {
  const keys = new Set<string>();
  return list.filter((s) => {
    if (keys.has(s.key)) return false;
    keys.add(s.key);
    return true;
  });
}

/** The "tear down exactly what I typed" row */
export function typedSuggestion(input: string): Suggestion {
  const text = input.trim();
  return {
    key: `typed:${text.toLowerCase()}`,
    kind: 'typed',
    name: text,
    domain: isSpecificAddress(text) ? normalizeDomain(text) : null,
    description: `Tear down “${text}” as typed`,
  };
}

/** True when the input already names one site (a URL or domain like "zoom.us"), so it can open without asking */
export function isSpecificAddress(input: string): boolean {
  const text = input.trim();
  const domain = normalizeDomain(text);
  if (parseQuery(text).host === null || !domain) return false;
  // "Next.js" is a name, unless a scheme or a path says it's meant as an address
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(text) || text.includes('/')) return true;
  return !FILE_SUFFIXES.has(domain.slice(domain.lastIndexOf('.') + 1));
}

/** A name without a known domain as a query: "Next.js" is not the host next.js */
function nameQuery(name: string): ParsedQuery {
  const q = parseQuery(name);
  if (!q.host) return q;
  return { ...parseQuery(name.replace(/\./g, ' ')), raw: q.raw, displayName: q.raw.charAt(0).toUpperCase() + q.raw.slice(1) };
}

/** The curated teardown on a domain: its own site, a page of it (m.x.com) or a former domain from a long alias (twitter.com) */
function curatedOnDomain(domain: string): Teardown | undefined {
  return CURATED.find((t) => {
    const own = normalizeDomain(t.url);
    if (own && isPageOf(domain, own)) return true;
    return curatedAliases(t.id).some((alias) => compact(alias).length >= 7 && isPageOf(domain, `${compact(alias)}.com`));
  });
}

/**
 * The curated teardown a chosen suggestion already is, or undefined: a curated row, a row or typed address on the
 * curated site ("https://m.instagram.com", "twitter.com"), or a name without a domain ("insta" as typed). Library
 * products and other products on the same site (Gmail at mail.google.com, xAI at x.ai) are teardowns of their own.
 */
export function curatedFor(s: Suggestion): Teardown | undefined {
  if (s.kind === 'curated') return s.curatedId ? getCurated(s.curatedId) : undefined;
  if (s.kind === 'known' || s.kind === 'recent') return undefined;
  const domain = normalizeDomain(s.domain);
  return domain ? curatedOnDomain(domain) : findCurated(nameQuery(s.name));
}

/** "Zoom" and "Zoom Workplace" agree; "Google Search" and "Google Maps" don't */
function namesAgree(a: string, b: string): boolean {
  const x = compact(a.replace(/\s*\(.*?\)\s*/g, ' '));
  const full = compact(a);
  const y = compact(b);
  return Boolean(y) && [x, full].some((n) => Boolean(n) && (n.startsWith(y) || y.startsWith(n)));
}

/**
 * Every domain a listed product is known by: all of a library product's domains (Zoom is zoom.us and zoom.com), and
 * for a past teardown of a plain name, the domain its scan guessed ("Chase" → chase.com).
 */
function domainsOf(s: Suggestion): string[] {
  const domain = normalizeDomain(s.domain);
  if (s.kind !== 'known' && s.kind !== 'recent') return domain ? [domain] : [];
  if (!domain) {
    const guessed = s.kind === 'recent' ? resolveDomain(parseQuery(s.name)).domain : null;
    return guessed ? [guessed] : [];
  }
  const product = findKnownProduct(OFFLINE.products, { raw: s.name, host: domain });
  return [domain, ...(product?.domains ?? []).map((d) => normalizeDomain(d)).filter((d): d is string => Boolean(d))];
}

/** A curated teardown's names worth matching exactly: "X (Twitter)" is also "Twitter" (single letters are too loose) */
function curatedNames(id: string | undefined): string[] {
  const name = (id && getCurated(id)?.name) || '';
  return [name, name.replace(/\s*\(.*?\)\s*/g, ' '), ...[...name.matchAll(/\((.*?)\)/g)].map((m) => m[1])]
    .map(compact)
    .filter((n) => n.length >= 3);
}

/**
 * True when `item` is the same product as one already listed (`kept`): one of its domains or a generic page of one
 * (instagram.com covers help.instagram.com, but not a different product like tv.youtube.com), the same site under the
 * same name, or for a curated teardown its former domain or its exact name elsewhere ("ChatGPT" at openai.com).
 */
function sameProduct(kept: Suggestion, item: Suggestion): boolean {
  const b = normalizeDomain(item.domain);
  if (!b) return !normalizeDomain(kept.domain) && Boolean(compact(kept.name)) && compact(kept.name) === compact(item.name);
  const name = compact(item.name);
  if (domainsOf(kept).some((a) => isPageOf(b, a) || (sameSite(a, b) && compact(kept.name) === name))) return true;
  return kept.kind === 'curated' && (curatedOnDomain(b)?.id === kept.curatedId || curatedNames(kept.curatedId).includes(name));
}

/**
 * The full list the home screen shows: library matches first, then web results that add something new (ranked by how
 * well they match, then popularity), then the "as typed" row unless a listed product already is exactly that.
 */
export function mergeSuggestions(input: string, local: Suggestion[], web: Suggestion[], limit = 10): Suggestion[] {
  const text = input.trim();
  const needle = needleOf(text);
  const merged = local.map((s) => ({ ...s }));
  const extra: { suggestion: Suggestion; score: number }[] = [];
  const positions = new Map<string, number>();

  for (const item of web) {
    const source = item.source ?? '';
    const position = positions.get(source) ?? 0;
    positions.set(source, position + 1);

    const twins = merged.filter((m) => sameProduct(m, item));
    if (twins.length) {
      const twin = twins.find((m) => namesAgree(m.name, item.name));
      if (twin && item.iconUrl && !twin.iconUrl) twin.iconUrl = item.iconUrl;
      continue;
    }
    const score = needle ? scoreTarget(needle, targetOf([item.name], [item.domain])) : 0;
    // Unrelated names are noise, except a web source's own top results for a real query (e.g. a company's legal name)
    if (!score && !(needle && needle.compact.length >= 3 && position <= 2)) continue;
    // The web lookup already merged each site (keeping products on shared hosts like meet.google.com apart)
    if (extra.some((e) => e.suggestion.key === item.key || sameProduct(e.suggestion, item))) continue;
    extra.push({ suggestion: { ...item }, score });
  }

  extra.sort((a, b) => b.score - a.score || (b.suggestion.popularity ?? 0) - (a.suggestion.popularity ?? 0));
  const typed = text ? typedSuggestion(text) : null;
  const list = uniqueByKey([...merged, ...extra.map((e) => e.suggestion)])
    .filter((s) => s.key !== typed?.key)
    .slice(0, Math.max(0, limit));
  if (!typed) return list;

  // An address is covered by a listed product on exactly that domain, a plain name by a product with exactly that name,
  // and either one by the listed curated teardown it would open anyway ("twitter" is X)
  const address = typed.domain;
  const q = compact(text);
  const curatedId = curatedFor(typed)?.id;
  const covered =
    (address ? list.some((s) => normalizeDomain(s.domain) === address) : list.some((s) => s.domain && compact(s.name) === q)) ||
    (Boolean(curatedId) && list.some((s) => s.curatedId === curatedId));
  if (!covered) list.push(typed);
  return list;
}

/**
 * The query that starts (or finds the cached) teardown for a chosen suggestion, or null for curated and past
 * teardowns, which open by id. Two different sites never share a teardown id: parseQuery drops the TLD ("zoom.us"
 * and "zoom.com" are both "zoom"), so a taken id falls back to the full domain ("zoom-com"), and when that is taken
 * too (parseQuery's id for zoom.com.br) to a numbered one ("zoom-com-2").
 */
export function suggestionQuery(s: Suggestion, entries: Record<string, { host: string | null }>): ParsedQuery | null {
  if (s.kind === 'curated' || s.kind === 'recent') return null;
  const domain = normalizeDomain(s.domain);
  if (!domain) {
    const q = nameQuery(s.name);
    return s.kind === 'typed' ? q : { ...q, displayName: s.name };
  }
  const q = parseQuery(domain);
  const query: ParsedQuery = { ...q, raw: domain, displayName: s.kind === 'typed' ? q.displayName : s.name };
  const taken = (id: string) => {
    const entry = entries[id];
    const curated = getCurated(id);
    return Boolean((entry && !sameSite(entry.host, domain)) || (curated && !sameSite(curated.url, domain)));
  };
  if (taken(q.id)) {
    const base = domain.replace(/[^a-z0-9]+/g, '-');
    query.id = base;
    for (let n = 2; taken(query.id); n++) query.id = `${base}-${n}`;
  }
  return query;
}
