/**
 * Search suggestions on the home screen: Teardown's own matches show on every keystroke, and real apps and websites
 * from /api/suggest join them once the student pauses typing.
 */
import { useEffect, useState } from 'react';

import { apiUrl, useStore } from '@/lib/store';
import { localSuggestions, mergeSuggestions } from '@/lib/suggest/local';
import type { Suggestion, SuggestResponse } from '@/lib/suggest/types';

const DEBOUNCE_MS = 250;
const MIN_WEB_QUERY = 2;
const MAX_CACHED = 50;

interface WebResult {
  key: string;
  suggestions: Suggestion[];
  failed: boolean;
}

/** Recent complete web responses by query, so going back to a query shows its apps instantly */
const cache = new Map<string, Suggestion[]>();

function remember(key: string, suggestions: Suggestion[]) {
  cache.delete(key);
  cache.set(key, suggestions);
  for (const oldest of cache.keys()) {
    if (cache.size <= MAX_CACHED) break;
    cache.delete(oldest);
  }
}

/**
 * The web lookup ignores case and extra spaces, so "Zoom " and "zoom" share one request (same limit as the server,
 * counted in characters so an emoji at the limit isn't cut in half, which would make the URL impossible to encode)
 */
const webKey = (input: string) => Array.from(input.replace(/\s+/g, ' ').trim()).slice(0, 60).join('').trim().toLowerCase();

/**
 * Every product matching what the student typed: library matches first, then apps and websites from the web, then
 * the "as typed" row. A failed web lookup still leaves the library matches.
 */
export function useSuggestions(input: string): { items: Suggestion[]; webLoading: boolean; webFailed: boolean } {
  const history = useStore((s) => s.history);
  const key = webKey(input);
  const [web, setWeb] = useState<WebResult | null>(null);

  useEffect(() => {
    if (key.length < MIN_WEB_QUERY || cache.has(key)) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(apiUrl(`/api/suggest?q=${encodeURIComponent(key)}`), { signal: controller.signal });
        if (!res.ok) throw new Error(`Suggestions failed (${res.status})`);
        const json = (await res.json()) as SuggestResponse;
        const suggestions = Array.isArray(json.suggestions) ? json.suggestions : [];
        const sources = Array.isArray(json.sources) ? json.sources : [];
        // Only a lookup where every source answered is kept; a partial one is asked again next time
        if (sources.every((s) => s.ok)) remember(key, suggestions);
        const failed = sources.length > 0 && sources.every((s) => !s.ok);
        if (!controller.signal.aborted) setWeb({ key, suggestions, failed });
      } catch {
        if (!controller.signal.aborted) setWeb({ key, suggestions: [], failed: true });
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [key]);

  const local = localSuggestions(input, history);
  const cached = cache.get(key);
  // A response for an earlier query never shows under this one
  const current = web?.key === key ? web : cached ? { key, suggestions: cached, failed: false } : null;
  const hasWeb = key.length >= MIN_WEB_QUERY;
  return {
    items: mergeSuggestions(input, local, hasWeb ? (current?.suggestions ?? []) : [], 10),
    webLoading: hasWeb && !current,
    webFailed: hasWeb && Boolean(current?.failed),
  };
}
