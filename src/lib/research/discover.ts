/**
 * Free, live evidence gathering (server only). Finds real pages about a product so Gemini can read them with its
 * URL Context tool, which works on the free tier (Google Search grounding does not):
 *   - Wikipedia (REST search + page summary)
 *   - the product's own About / Careers / Blog / Engineering pages (job posts often name the real stack)
 *   - its public GitHub organization (the languages its open-source code actually uses)
 *   - Hacker News stories about its engineering (via the free Algolia API)
 * Every fetch has a short timeout and only reaches public https hosts.
 */
import { safeHttpsUrl } from '@/lib/net';

export type EvidenceKind = 'site' | 'wikipedia' | 'github' | 'article' | 'careers' | 'blog';

export interface EvidenceUrl {
  url: string;
  kind: EvidenceKind;
  title?: string;
}

export interface Evidence {
  urls: EvidenceUrl[];
  /** Short facts fetched directly (Wikipedia summary, GitHub languages, story titles) */
  notes: string[];
  elapsedMs: number;
}

/** Site pages: many sites refuse unknown agents, so browser-compatible but still naming this app */
const PAGE_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36 TeardownResearch/1.0';
/** Public APIs: Wikimedia's policy asks for a descriptive agent with a contact URL (browser-like agents get 429s) */
const API_UA = 'TeardownResearch/1.0 (https://github.com/ProXteller/teardown; student project)';
const TIMEOUT_MS = 5000;
const MAX_URLS = 12;

async function get(url: string, accept = 'application/json', ua = API_UA): Promise<Response | null> {
  const safe = safeHttpsUrl(url);
  if (!safe) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(safe.href, { redirect: 'follow', signal: controller.signal, headers: { 'user-agent': ua, accept } });
    return res;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function json<T>(url: string): Promise<T | null> {
  const res = await get(url);
  if (!res?.ok) return null;
  return (await res.json().catch(() => null)) as T | null;
}

/** "www.linear.app" → "linear.app"; "mobile.txst.edu" → "txst.edu" (good enough for common TLDs) */
function registrable(domain: string) {
  const parts = domain.toLowerCase().replace(/^www\./, '').split('.');
  const twoLevel = /^(co|com|org|net|ac|edu|gov)$/.test(parts[parts.length - 2] ?? '') && parts.length > 2;
  return parts.slice(twoLevel ? -3 : -2).join('.');
}

const COMPANYISH =
  /company|software|app\b|application|website|web service|service|platform|social|network|university|college|school|search engine|streaming|video|messaging|game|bank|retailer|marketplace|startup|tool|browser|media|news|organization|brand|operating system|programming language|editor|productivity|issue track|project management/i;

async function wikipedia(name: string, domain: string | null): Promise<{ url: string; title: string; extract: string } | null> {
  type Search = { pages?: { key: string; title: string; description?: string | null }[] };
  const lower = name.toLowerCase();
  // "Linear" alone finds Linear A and linear algebra, so also search with a hint
  const results = await Promise.all(
    [name, `${name} software company`].map((q) => json<Search>(`https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(q)}&limit=8`)),
  );
  const pages = results.flatMap((r) => r?.pages ?? []);
  // The article for exactly this name ("Figma", "Notion (productivity software)"), not "Linear A" or "Just a Notion"
  const page = pages.find((p) => {
    const title = p.title.toLowerCase();
    if (title !== lower && !title.startsWith(`${lower} (`)) return false;
    return COMPANYISH.test(p.description ?? '') || /\((company|website|software|app|service|platform|[a-z ]*software)\)/i.test(p.title);
  });
  if (!page) return null;
  type Summary = { title: string; extract?: string; type?: string; content_urls?: { desktop?: { page?: string } } };
  const summary = await json<Summary>(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page.key)}`);
  if (!summary?.extract || summary.type === 'disambiguation') return null;
  // If we know the site, prefer articles that mention it or its name in the summary
  if (domain && !summary.extract.toLowerCase().includes(lower) && !summary.extract.toLowerCase().includes(registrable(domain).split('.')[0])) return null;
  return {
    url: summary.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(page.key)}`,
    title: summary.title,
    extract: summary.extract.slice(0, 1200),
  };
}

async function sitePages(domain: string): Promise<EvidenceUrl[]> {
  const root = registrable(domain);
  const candidates: EvidenceUrl[] = [
    { url: `https://${domain}/`, kind: 'site' },
    { url: `https://${domain}/about`, kind: 'site' },
    { url: `https://${domain}/company`, kind: 'site' },
    { url: `https://${domain}/careers`, kind: 'careers' },
    { url: `https://${domain}/jobs`, kind: 'careers' },
    { url: `https://${domain}/blog`, kind: 'blog' },
    { url: `https://engineering.${root}/`, kind: 'blog' },
    { url: `https://blog.${root}/`, kind: 'blog' },
  ];
  const checked = await Promise.all(
    candidates.map(async (c) => {
      const res = await get(c.url, 'text/html', PAGE_UA);
      if (!res || res.status >= 400) return null;
      // A redirect to some other company's site doesn't count (notion.so → notion.com does)
      const finalHost = new URL(res.url || c.url).hostname.toLowerCase();
      if (!finalHost.endsWith(root) && registrable(finalHost).split('.')[0] !== root.split('.')[0]) return null;
      res.body?.cancel().catch(() => {});
      return { ...c, url: res.url || c.url };
    }),
  );
  const seen = new Set<string>();
  return checked.filter((c): c is EvidenceUrl => {
    if (!c) return false;
    const key = c.url.replace(/\/+$/, '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function github(name: string, domain: string | null): Promise<{ url: string; note: string } | null> {
  const slugs = [...new Set([domain ? registrable(domain).split('.')[0] : '', name.toLowerCase().replace(/[^a-z0-9-]/g, '')].filter(Boolean))];
  for (const slug of slugs) {
    type Org = { login: string; blog?: string; name?: string; html_url: string; public_repos?: number };
    const org = await json<Org>(`https://api.github.com/orgs/${slug}`);
    if (!org) continue;
    const blog = (org.blog ?? '').toLowerCase();
    const matches = (domain && blog.includes(registrable(domain))) || (org.name ?? '').toLowerCase() === name.toLowerCase();
    if (!matches) continue;
    type Repos = { items?: { name: string; language: string | null; stargazers_count: number; html_url: string }[] };
    const repos = await json<Repos>(`https://api.github.com/search/repositories?q=org:${slug}&sort=stars&order=desc&per_page=8`);
    const items = repos?.items ?? [];
    const languages = new Map<string, number>();
    items.forEach((r) => r.language && languages.set(r.language, (languages.get(r.language) ?? 0) + 1));
    const langs = [...languages.entries()].sort((a, b) => b[1] - a[1]).map(([l]) => l);
    const top = items.slice(0, 5).map((r) => `${r.name} (${r.language ?? 'n/a'}, ${r.stargazers_count}★)`);
    return {
      url: org.html_url,
      note: `GitHub organization ${org.login} (${org.public_repos ?? items.length} public repos). Most-starred repos: ${top.join('; ') || 'none'}. Languages used in them: ${langs.join(', ') || 'unknown'}.`,
    };
  }
  return null;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Social posts can't be read by Gemini's URL tool and rarely explain engineering */
const UNREADABLE = /(^|\.)(twitter\.com|x\.com|facebook\.com|instagram\.com|linkedin\.com|youtube\.com|tiktok\.com)$/i;

async function hackerNews(name: string, domain: string | null): Promise<EvidenceUrl[]> {
  type Hits = { hits?: { title?: string; url?: string; points?: number }[] };
  const root = domain ? registrable(domain) : '';
  // The name as its own word, not the second half of another name ("Linear" but not "Kimi Linear")
  const mentions = new RegExp(`(?<![A-Z][\\w-]*\\s)\\b${escape(name)}\\b`);
  const results = await Promise.all(
    ['engineering', 'architecture'].map((word) =>
      json<Hits>(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(`${name} ${word}`)}&tags=story&hitsPerPage=15`),
    ),
  );
  const hits = results.flatMap((r) => r?.hits ?? []);
  return hits
    .filter((h) => {
      const url = h.url ? safeHttpsUrl(h.url) : null;
      return url && h.title && !UNREADABLE.test(url.hostname) && (mentions.test(h.title) || (root && url.hostname.endsWith(root)));
    })
    .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
    .filter((h, i, all) => all.findIndex((x) => x.url!.split(/[?#]/)[0] === h.url!.split(/[?#]/)[0]) === i)
    .slice(0, 3)
    .map((h) => ({ url: h.url!, kind: 'article' as const, title: h.title }));
}

/** Gathers live evidence about a product in parallel (typically 1–4 seconds). Never throws. */
export async function discoverEvidence(input: { name: string; domain: string | null }): Promise<Evidence> {
  const started = Date.now();
  // Tests and offline demos can turn discovery off; research then relies on the scan and the model
  if (/^(0|off|false|no)$/i.test(process.env.TEARDOWN_DISCOVERY ?? '')) return { urls: [], notes: [], elapsedMs: 0 };
  const name = input.name.trim().slice(0, 80);
  const domain = input.domain?.toLowerCase().replace(/^www\./, '') ?? null;
  const [wiki, site, gh, hn] = await Promise.all([
    wikipedia(name, domain).catch(() => null),
    domain ? sitePages(domain).catch(() => []) : Promise.resolve([] as EvidenceUrl[]),
    github(name, domain).catch(() => null),
    hackerNews(name, domain).catch(() => []),
  ]);

  const urls: EvidenceUrl[] = [];
  const notes: string[] = [];
  if (wiki) {
    urls.push({ url: wiki.url, kind: 'wikipedia', title: `${wiki.title} (Wikipedia)` });
    notes.push(`Wikipedia summary of "${wiki.title}": ${wiki.extract}`);
  }
  urls.push(...site);
  if (gh) {
    urls.push({ url: gh.url, kind: 'github', title: 'GitHub organization' });
    notes.push(gh.note);
  }
  urls.push(...hn);
  if (hn.length) notes.push(`Engineering stories about ${name} on Hacker News: ${hn.map((h) => `"${h.title}"`).join('; ')}.`);

  return { urls: urls.slice(0, MAX_URLS), notes, elapsedMs: Date.now() - started };
}
