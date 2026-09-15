/**
 * Server-only link checker: proves a URL is live before the app shows it to a student.
 *   - https on the default port only, private/internal hosts refused (src/lib/net.ts), redirects followed by hand so
 *     each hop is checked too, and every hop's hostname is resolved first so names pointing at private addresses
 *     (127.0.0.1.nip.io, localtest.me) are refused. Limitation: fetch resolves the name again, so a DNS-rebinding server
 *     that answers differently the second time could still slip through; don't expose this as an open proxy.
 *   - YouTube videos/playlists: YouTube's oEmbed endpoint (returns the real title and channel, 4xx if missing or private)
 *   - everything else: GET with a browser user agent, 8 s timeout, HTTP < 400, and no "soft 404" (a 200 page whose
 *     title says not found, a parked domain, or a deep link that silently redirects to the home page)
 */
import { lookup } from 'node:dns/promises';

import { isPrivateIp, safeHttpsUrl } from './net';

export interface LinkCheck {
  /** The URL that was checked, as given */
  url: string;
  ok: boolean;
  kind: 'youtube' | 'web';
  /** Real page or video title, when known */
  title?: string;
  /** YouTube channel name */
  author?: string;
  /** Canonical YouTube URL, or where a web link landed after redirects */
  finalUrl?: string;
  status?: number;
  /** Why the link was rejected */
  reason?: string;
}

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 5;
const MAX_HTML_BYTES = 256_000;

const SOFT_404 =
  /page not found|not found\s*[|·–—-]|[|·–—-]\s*not found|^\s*not found|^\s*404\b|\b404\b\W*(error|not found|page)|error\W*404|(page|content|video|course) (is )?(not |no longer |un)available|(page|course) (doesn.t|does not|no longer) exist|this page (can.t|could not|couldn.t) be found|domain (is )?for sale|buy this domain|parked (free|domain)|^\s*just a moment|attention required|access denied/i;

/** True when a page title says the page is missing, parked or behind a bot wall. */
export function looksLikeSoft404(title: string) {
  return SOFT_404.test(title);
}

/** Returns the canonical watch/playlist URL for a YouTube link, or null if it isn't a video or playlist. */
export function youTubeCanonical(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase().replace(/^(www|m|music)\./, '');
  const id = (v: string | null | undefined) => (v && /^[\w-]{11}$/.test(v) ? v : null);
  let video: string | null = null;
  if (host === 'youtu.be') video = id(url.pathname.split('/')[1]);
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (url.pathname === '/watch') video = id(url.searchParams.get('v'));
    else if (/^\/(shorts|live|embed|v)\//.test(url.pathname)) video = id(url.pathname.split('/')[2]);
    else if (url.pathname === '/playlist') {
      const list = url.searchParams.get('list');
      return list && /^[\w-]{10,64}$/.test(list) ? `https://www.youtube.com/playlist?list=${list}` : null;
    }
  }
  return video ? `https://www.youtube.com/watch?v=${video}` : null;
}

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();
}

/** Locale roots such as "/", "/en/" or "/en-us" count as a home page. */
const isHomePath = (path: string) => /^\/([a-z]{2}([-_][a-z]{2})?\/?)?$/i.test(path);

const abortError = () => Object.assign(new Error('Timed out'), { name: 'AbortError' });

/** Reads at most MAX_HTML_BYTES, stopping at </title>. Honors the timeout even if the body stream ignores the signal. */
async function readHead(res: Response, signal: AbortSignal): Promise<string> {
  if (!res.body) return '';
  const reader = res.body.getReader();
  const stop = () => void reader.cancel().catch(() => {});
  signal.addEventListener('abort', stop, { once: true });
  const decoder = new TextDecoder();
  let html = '';
  let bytes = 0;
  try {
    while (bytes < MAX_HTML_BYTES && !signal.aborted) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      html += decoder.decode(value, { stream: true });
      if (/<\/title>/i.test(html)) break;
    }
  } finally {
    signal.removeEventListener('abort', stop);
    stop();
  }
  if (signal.aborted) throw abortError();
  return html;
}

/**
 * True when every address the hostname resolves to is public. IP literals are checked directly. Where node:dns isn't
 * available (a non-Node runtime) only the hostname checks in safeHttpsUrl apply.
 */
async function resolvesToPublic(hostname: string, signal: AbortSignal): Promise<boolean> {
  const host = hostname.replace(/^\[|\]$/g, '');
  if (/^[\d.]+$/.test(host) || host.includes(':')) return !isPrivateIp(host);
  if (typeof lookup !== 'function') return true;
  let onAbort = () => {};
  const timedOut = new Promise<never>((_, reject) => {
    onAbort = () => reject(abortError());
    signal.addEventListener('abort', onAbort, { once: true });
  });
  try {
    const addresses = await Promise.race([lookup(host, { all: true, verbatim: true }), timedOut]);
    return addresses.length > 0 && addresses.every((a) => !isPrivateIp(a.address));
  } finally {
    signal.removeEventListener('abort', onAbort);
  }
}

const PRIVATE_REASON = 'Only public https links are allowed (this name points at a private address)';

async function checkYouTube(url: string, canonical: string, signal: AbortSignal): Promise<LinkCheck> {
  const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(canonical)}&format=json`, {
    signal,
    headers: { 'user-agent': UA, accept: 'application/json' },
  });
  if (!res.ok) {
    res.body?.cancel().catch(() => {});
    return { url, ok: false, kind: 'youtube', status: res.status, finalUrl: canonical, reason: `YouTube says this video or playlist is missing or private (${res.status})` };
  }
  const data = (await res.json().catch(() => ({}))) as { title?: string; author_name?: string };
  if (!data.title) return { url, ok: false, kind: 'youtube', status: res.status, finalUrl: canonical, reason: 'YouTube returned no title' };
  return { url, ok: true, kind: 'youtube', status: res.status, title: data.title, author: data.author_name, finalUrl: canonical };
}

async function checkWeb(url: string, start: URL, signal: AbortSignal): Promise<LinkCheck> {
  let current = start;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (!(await resolvesToPublic(current.hostname, signal))) {
      return { url, ok: false, kind: 'web', finalUrl: current.toString(), reason: PRIVATE_REASON };
    }
    if (signal.aborted) throw abortError();
    const res = await fetch(current, {
      redirect: 'manual',
      signal,
      headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8', 'accept-language': 'en-US,en;q=0.9' },
    });
    const location = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && location) {
      res.body?.cancel().catch(() => {});
      let resolved: string;
      try {
        resolved = new URL(location, current).toString();
      } catch {
        return { url, ok: false, kind: 'web', status: res.status, reason: 'Redirected to an invalid address' };
      }
      const next = safeHttpsUrl(resolved);
      if (!next) {
        return { url, ok: false, kind: 'web', status: res.status, finalUrl: resolved.slice(0, 300), reason: 'Redirected to a non-https or private address' };
      }
      current = next;
      continue;
    }
    const finalUrl = current.toString();
    if (res.status >= 400) {
      res.body?.cancel().catch(() => {});
      return { url, ok: false, kind: 'web', status: res.status, finalUrl, reason: `HTTP ${res.status}` };
    }
    if (res.status >= 300) return { url, ok: false, kind: 'web', status: res.status, finalUrl, reason: `HTTP ${res.status} without a redirect target` };

    let html = '';
    if (/html|xml/i.test(res.headers.get('content-type') ?? 'text/html')) html = await readHead(res, signal);
    else res.body?.cancel().catch(() => {});
    const raw = html.match(/<title[^>]*>([^<]{1,300})<\/title>/i)?.[1];
    const title = raw ? decodeEntities(raw).slice(0, 200) : undefined;
    if (title && looksLikeSoft404(title)) return { url, ok: false, kind: 'web', status: res.status, title, finalUrl, reason: `Soft 404 ("${title}")` };
    if (!isHomePath(start.pathname) && isHomePath(current.pathname) && current.toString() !== start.toString()) {
      return { url, ok: false, kind: 'web', status: res.status, title, finalUrl, reason: 'Deep link redirected to the home page' };
    }
    return { url, ok: true, kind: 'web', status: res.status, title, finalUrl };
  }
  return { url, ok: false, kind: 'web', reason: 'Too many redirects' };
}

/** Checks one link. Never throws. */
export async function verifyLink(url: string): Promise<LinkCheck> {
  const canonical = youTubeCanonical(url);
  const kind = canonical ? 'youtube' : 'web';
  const target = safeHttpsUrl(url);
  if (!target) return { url, ok: false, kind, reason: 'Only public https links are allowed' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return canonical ? await checkYouTube(url, canonical, controller.signal) : await checkWeb(url, target, controller.signal);
  } catch (e) {
    const aborted = e instanceof Error && e.name === 'AbortError';
    return { url, ok: false, kind, reason: aborted ? 'Timed out after 8 s' : 'Could not reach the site' };
  } finally {
    clearTimeout(timer);
  }
}

/** Checks many links, `concurrency` at a time. Results come back in the same order as `urls`. */
export async function verifyLinks(urls: string[], concurrency = 6): Promise<LinkCheck[]> {
  const results = new Array<LinkCheck>(urls.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, urls.length) }, async () => {
      while (next < urls.length) {
        const i = next++;
        results[i] = await verifyLink(urls[i]);
      }
    }),
  );
  return results;
}
