/**
 * Pulls the visible skeleton of a web page (menu, headings, text, buttons) out of raw HTML,
 * so the playground can rebuild the real page instead of showing a generic template.
 * Runs on the server during a scan; regex-based because there's no DOM there.
 */

export interface PageOutline {
  nav: string[];
  headings: { level: 1 | 2 | 3; text: string }[];
  paragraphs: string[];
  buttons: string[];
  imageCount: number;
}

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
  ndash: '–', mdash: '—', hellip: '…', copy: '©', reg: '®', trade: '™', bull: '•', middot: '·',
};

function decode(s: string) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, code: string) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1));
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : '';
    }
    return ENTITIES[code.toLowerCase()] ?? m;
  });
}

function textOf(fragment: string) {
  return decode(fragment.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function uniq(list: string[], max: number) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
    if (out.length === max) break;
  }
  return out;
}

function shorten(s: string, max: number) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 20))}…`;
}

const JUNK = /^(skip to|menu|close|search|toggle|open|×|x|≡|☰|more|back to top|cookie|accept|reject)\b/i;
/** Headings that exist only for screen readers or page chrome */
const CHROME_HEADING = /^(navigation( menu)?|main (menu|navigation)|site (menu|navigation)|footer|site map|sitemap|search( results)?|breadcrumbs?|primary navigation|you are here|related links|social media|follow us)$/i;

export function extractOutline(html: string): PageOutline {
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html)
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|svg|template|iframe|select)[^>]*>[\s\S]*?<\/\1>/gi, ' ');

  const links = (fragment: string) => [...fragment.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].map((m) => textOf(m[1]));
  const navBlocks = [...body.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav>/gi)].map((m) => m[1]);
  const headerBlock = body.match(/<header\b[^>]*>([\s\S]*?)<\/header>/i)?.[1] ?? '';
  let nav = uniq(navBlocks.flatMap(links).filter((t) => t.length >= 2 && t.length <= 28 && !JUNK.test(t)), 7);
  if (nav.length < 2) nav = uniq(links(headerBlock).filter((t) => t.length >= 2 && t.length <= 28 && !JUNK.test(t)), 7);

  const headings = uniq(
    [...body.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => `${m[1]}|${textOf(m[2])}`).filter((h) => {
      const t = h.slice(2);
      return t.length >= 3 && t.length <= 110 && !JUNK.test(t) && !CHROME_HEADING.test(t);
    }),
    9,
  ).map((h) => ({ level: Number(h[0]) as 1 | 2 | 3, text: shorten(h.slice(2), 90) }));

  const paragraphs = uniq(
    [...body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => textOf(m[1])).filter((t) => t.length >= 40 && !/cookie|javascript|browser/i.test(t)),
    5,
  ).map((t) => shorten(t, 220));

  const buttons = uniq(
    [
      ...[...body.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)].map((m) => textOf(m[1])),
      ...[...body.matchAll(/<a\b[^>]*class=["'][^"']*\b(?:btn|button|cta)\b[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi)].map((m) => textOf(m[1])),
    ].filter((t) => t.length >= 2 && t.length <= 28 && !JUNK.test(t)),
    3,
  );

  return { nav, headings, paragraphs, buttons, imageCount: (body.match(/<img\b/gi) ?? []).length };
}
