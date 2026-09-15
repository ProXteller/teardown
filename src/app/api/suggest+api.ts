import type { SuggestResponse } from '@/lib/suggest/types';
import { clipQuery, webSuggestions } from '@/lib/suggest/web';

/** Browsers may keep a complete answer for 5 minutes; one where a source failed must be asked again next time */
const cacheHeaders = (res: SuggestResponse) => ({
  'Cache-Control': res.sources.length && res.sources.every((s) => s.ok) ? 'public, max-age=300' : 'no-store',
});

/**
 * Real apps and websites whose names match what the student is typing (App Store, Clearbit and Wikidata; no AI key),
 * so the home screen can ask "Which “zoom” do you mean?" instead of guessing. GET /api/suggest?q=zoom
 */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get('q') ?? '';
  let res: SuggestResponse = { query: '', suggestions: [], sources: [] };
  if (!q.trim()) return Response.json(res, { headers: { 'Cache-Control': 'public, max-age=300' } });
  try {
    res = await webSuggestions(q);
  } catch {
    res = { query: clipQuery(q), suggestions: [], sources: [] };
  }
  return Response.json(res, { headers: cacheHeaders(res) });
}
