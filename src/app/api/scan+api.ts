import { detect, extractMeta, INTERESTING_HEADERS, type ScanResult } from '@/lib/fingerprints';
import { extractOutline } from '@/lib/outline';

const MAX_HTML_BYTES = 600_000;
const TIMEOUT_MS = 7000;

/** Refuse obvious internal targets so the scanner can't be pointed at private networks. */
function isPrivateHost(hostname: string) {
  const h = hostname.toLowerCase();
  return (
    h === 'localhost' ||
    h.endsWith('.local') ||
    h.endsWith('.internal') ||
    h === '0.0.0.0' ||
    h.startsWith('[') ||
    /^127\./.test(h) ||
    /^10\./.test(h) ||
    /^192\.168\./.test(h) ||
    /^169\.254\./.test(h) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h)
  );
}

export async function POST(request: Request) {
  const started = Date.now();
  const { url } = (await request.json().catch(() => ({}))) as { url?: string };
  if (!url) return Response.json({ ok: false, error: 'Missing url' }, { status: 400 });

  let target: URL;
  try {
    target = new URL(url.includes('://') ? url : `https://${url}`);
  } catch {
    return Response.json({ ok: false, url, detections: [], headers: [], error: 'Not a valid URL' } satisfies ScanResult);
  }
  if (!/^https?:$/.test(target.protocol) || isPrivateHost(target.hostname)) {
    return Response.json({ ok: false, url, detections: [], headers: [], error: 'That address can’t be scanned' } satisfies ScanResult);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(target, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36 TeardownScanner/1.0',
        accept: 'text/html,application/xhtml+xml',
      },
    });

    let html = '';
    if (res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let bytes = 0;
      while (bytes < MAX_HTML_BYTES) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        html += decoder.decode(value, { stream: true });
      }
      reader.cancel().catch(() => {});
    }

    const headers = INTERESTING_HEADERS.flatMap((name) => {
      const value = res.headers.get(name);
      return value ? [{ name, value: value.slice(0, 160) }] : [];
    });

    const result: ScanResult = {
      ok: true,
      url: target.toString(),
      finalUrl: res.url,
      status: res.status,
      ...extractMeta(html),
      detections: detect(res.headers, html, new URL(res.url || target.toString()).hostname),
      headers,
      outline: extractOutline(html),
      elapsedMs: Date.now() - started,
    };
    return Response.json(result);
  } catch (e) {
    const aborted = e instanceof Error && e.name === 'AbortError';
    return Response.json({
      ok: false,
      url: target.toString(),
      detections: [],
      headers: [],
      error: aborted ? 'The site took too long to respond' : 'Couldn’t reach the site',
      elapsedMs: Date.now() - started,
    } satisfies ScanResult);
  } finally {
    clearTimeout(timer);
  }
}
