/**
 * Domain helpers for search suggestions (client and server safe: no Node-only imports).
 */
import { isPrivateHost } from '@/lib/net';

/** Second-level labels under which the registrable name is one level deeper, e.g. "bbc.co.uk", "zoom.com.br" */
const SECOND_LEVEL = /^(co|com|org|net|ac|edu|gov|gob|ne|or|go)$/;

/**
 * A URL or host as a bare lowercase domain ("https://www.Linear.app/about" → "linear.app"), or null when it isn't a
 * public web host (IP addresses, localhost, single-label names, non-http URLs).
 */
export function normalizeDomain(raw: string | null | undefined): string | null {
  const text = (raw ?? '').trim();
  if (!text || /\s/.test(text)) return null;
  let url: URL;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  if (url.username || url.password) return null;
  const host = url.hostname.toLowerCase().replace(/\.$/, '').replace(/^www\./, '');
  if (!host.includes('.') || !/^[a-z0-9.-]+$/.test(host) || !/\.[a-z]{2,}$/.test(host) || isPrivateHost(host)) return null;
  return host;
}

/** The registrable site of a domain: "mobile.txst.edu" → "txst.edu", "zoom.com.br" → "zoom.com.br", "app.notion.so" → "notion.so" */
export function siteOf(domain: string): string {
  const parts = domain.toLowerCase().replace(/^www\./, '').split('.');
  if (parts.length <= 2) return parts.join('.');
  const twoLevel = SECOND_LEVEL.test(parts[parts.length - 2]) && parts[parts.length - 1].length === 2;
  return parts.slice(twoLevel ? -3 : -2).join('.');
}

/** True when two domains belong to the same site ("linear.app" and "www.linear.app", "txst.edu" and "mobile.txst.edu") */
export function sameSite(a: string | null | undefined, b: string | null | undefined): boolean {
  const x = normalizeDomain(a);
  const y = normalizeDomain(b);
  return Boolean(x && y && siteOf(x) === siteOf(y));
}
