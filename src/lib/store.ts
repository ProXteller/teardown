import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import { findCurated, getCurated, parseQuery, type ParsedQuery } from '@/data/catalog';
import { PARTS, type BuildPartT, type PartName, type StoryPartT, type SystemPartT } from '@/data/schema';
import type { Teardown, Tier } from '@/data/types';
import type { ScanResult } from '@/lib/fingerprints';
import type { TrackId } from '@/lib/roadmap/types';
import { buildQuickTeardown, findKnownProduct, QUICK_ENGINE_VERSION, resolveDomain, type QuickMeta } from '@/lib/offline/build';
import { engineReady, OFFLINE } from '@/lib/offline/content';
import { PAYWALL_ENABLED } from '@/lib/purchases';

export type Status = 'idle' | 'loading' | 'done' | 'error';

export interface Entry {
  id: string;
  query: string;
  host: string | null;
  displayName: string;
  teardown: Teardown;
  parts: Record<PartName, Status>;
  errors: Partial<Record<PartName, string>>;
  errorCode?: string;
  scan: ScanResult | null;
  scanStatus: Status;
  createdAt: number;
  /** True when host was guessed from a bare name (e.g. "duolingo" → duolingo.com) */
  domainGuessed?: boolean;
  /** Present when some or all of this teardown came from the instant offline engine */
  quick?: QuickMeta;
  /** AI parts that failed and were filled in by the offline engine */
  fallbackParts?: PartName[];
}

export interface HistoryItem {
  id: string;
  name: string;
  glyph: string;
  color: string;
  source: Teardown['source'];
  at: number;
  /** What was typed, so a teardown that is no longer saved can be rebuilt */
  query?: string;
}

interface State {
  entries: Record<string, Entry>;
  history: HistoryItem[];
  aiCount: number;
  /** What the student wants to become; drives the Roadmap tab */
  career: TrackId | null;
  /** Completed roadmap step ids, keyed by `${teardownId}:${trackId}` */
  progress: Record<string, string[]>;
  hydrated: boolean;
}

export const FREE_AI_TEARDOWNS = 2;
const STORAGE_KEY = 'teardown/v1';

let state: State = { entries: {}, history: [], aiCount: 0, career: null, progress: {}, hydrated: false };
const listeners = new Set<() => void>();

function setState(update: (s: State) => State) {
  state = update(state);
  listeners.forEach((l) => l());
  persist();
}

let persistTimer: ReturnType<typeof setTimeout> | undefined;
function persist() {
  if (!state.hydrated) return;
  clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    const finished = Object.fromEntries(
      Object.entries(state.entries).filter(([, e]) => PARTS.every((p) => e.parts[p] === 'done')),
    );
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ entries: finished, history: state.history, aiCount: state.aiCount, career: state.career, progress: state.progress }),
    ).catch(() => {});
  }, 400);
}

export async function hydrate() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const saved = raw ? (JSON.parse(raw) as Partial<State>) : {};
    // Instant teardowns built by an older engine are dropped so they get rebuilt with better content
    const fresh = Object.fromEntries(
      Object.entries(saved.entries ?? {}).filter(([, e]) => !e.quick || e.quick.version === QUICK_ENGINE_VERSION),
    );
    state = {
      entries: { ...fresh, ...state.entries },
      history: saved.history ?? [],
      aiCount: saved.aiCount ?? 0,
      career: saved.career ?? state.career,
      progress: { ...(saved.progress ?? {}), ...state.progress },
      hydrated: true,
    };
  } catch {
    state = { ...state, hydrated: true };
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

export function getState() {
  return state;
}

/** True when starting another AI teardown should send the user to the paywall. */
export function shouldShowPaywall(isPro: boolean) {
  return PAYWALL_ENABLED && !isPro && state.aiCount >= FREE_AI_TEARDOWNS;
}

/* ------------------------------------------------------------------ */
/* Teardown lookup & generation                                        */
/* ------------------------------------------------------------------ */

export type ResolveResult =
  | { kind: 'curated'; id: string }
  | { kind: 'cached'; id: string }
  | { kind: 'generate'; query: ParsedQuery };

export function resolveQuery(input: string): ResolveResult {
  const query = parseQuery(input);
  const curated = findCurated(query);
  if (curated) return { kind: 'curated', id: curated.id };
  const existing = state.entries[query.id];
  // Anything that previously failed is rebuilt (it will fall back to an instant teardown if AI is unavailable)
  const stale = existing?.quick && existing.quick.version !== QUICK_ENGINE_VERSION;
  if (existing && !stale && !Object.values(existing.parts).includes('error')) return { kind: 'cached', id: query.id };
  return { kind: 'generate', query };
}

export function recordVisit(t: Pick<Teardown, 'id' | 'name' | 'logoGlyph' | 'brandColor' | 'source'>) {
  const query = state.entries[t.id]?.query;
  setState((s) => ({
    ...s,
    history: [
      { id: t.id, name: t.name, glyph: t.logoGlyph, color: t.brandColor, source: t.source, at: Date.now(), query },
      ...s.history.filter((h) => h.id !== t.id),
    ].slice(0, 12),
  }));
}

export function setCareer(career: TrackId | null) {
  setState((s) => ({ ...s, career }));
}

export function toggleRoadmapStep(key: string, stepId: string) {
  setState((s) => {
    const done = s.progress[key] ?? [];
    const next = done.includes(stepId) ? done.filter((d) => d !== stepId) : [...done, stepId];
    return { ...s, progress: { ...s.progress, [key]: next } };
  });
}

export function clearHistory() {
  setState((s) => ({ ...s, history: [] }));
}

export function apiUrl(path: string) {
  const base = process.env.EXPO_PUBLIC_API_URL;
  return base ? `${base.replace(/\/$/, '')}${path}` : path;
}

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({ error: `Server error (${res.status})` }));
  if (!res.ok) {
    const err = new Error(json.error ?? `Request failed (${res.status})`) as Error & { code?: string };
    err.code = json.code;
    throw err;
  }
  return json as T;
}

function placeholder(query: ParsedQuery): Teardown {
  return {
    id: query.id,
    name: query.displayName,
    url: query.host ?? '',
    tagline: 'Tearing it down…',
    category: '',
    brandColor: '#5EE7FF',
    accentColor: '#A78BFA',
    logoGlyph: query.displayName.slice(0, 1).toUpperCase(),
    source: 'ai',
    eli5: '',
    facts: [],
    history: [],
    languages: [],
    stack: [],
    architecture: { nodes: [], edges: [], flows: [] },
    files: [],
    code: [],
    playground: { title: '', description: '', html: '', challenges: [] },
    concepts: [],
    buildYourOwn: [],
    sources: [],
  };
}

function updateEntry(id: string, fn: (e: Entry) => Entry) {
  setState((s) => {
    const e = s.entries[id];
    return e ? { ...s, entries: { ...s.entries, [id]: fn(e) } } : s;
  });
}

let aiStatus: Promise<boolean> | undefined;

/** Asks the server once whether an AI key is configured. Unreachable server → offline mode. */
export function aiAvailable(): Promise<boolean> {
  aiStatus ??= fetch(apiUrl('/api/status'))
    .then((r) => (r.ok ? r.json() : { ai: false }))
    .then((j: { ai?: boolean }) => Boolean(j.ai))
    .catch(() => false);
  return aiStatus;
}

/** Instant teardowns kept in memory so a failed AI part can fall back to them. */
const quickCache = new Map<string, ReturnType<typeof buildQuickTeardown>>();

/** Starts (or restarts) a teardown for anything that isn't curated. Returns the entry id to navigate to. */
export function startGeneration(query: ParsedQuery): string {
  const known = findKnownProduct(OFFLINE.products, query);
  const target = resolveDomain(query, known);
  const entry: Entry = {
    id: query.id,
    query: query.raw,
    host: target.domain,
    domainGuessed: target.guessed,
    displayName: known?.name ?? query.displayName,
    teardown: placeholder(query),
    parts: { story: 'loading', system: 'loading', build: 'loading' },
    errors: {},
    scan: null,
    scanStatus: target.domain ? 'loading' : 'idle',
    createdAt: Date.now(),
  };
  setState((s) => ({ ...s, entries: { ...s.entries, [query.id]: entry } }));
  void runGeneration(query.id);
  return query.id;
}

async function runGeneration(id: string) {
  const entry = state.entries[id];
  if (!entry) return;

  let scan: ScanResult | null = null;
  if (entry.host) {
    try {
      scan = await postJSON<ScanResult>('/api/scan', { url: entry.host });
    } catch {
      scan = null;
    }
    updateEntry(id, (e) => ({ ...e, scan, scanStatus: scan?.ok ? 'done' : 'error' }));
  }

  if (engineReady()) {
    const known = findKnownProduct(OFFLINE.products, { raw: entry.query, host: entry.domainGuessed ? null : entry.host });
    const quick = buildQuickTeardown(OFFLINE, {
      id,
      query: entry.query,
      displayName: entry.displayName,
      domain: entry.host,
      guessedDomain: Boolean(entry.domainGuessed),
      scan,
      known,
    });
    quickCache.set(id, quick);
    if (!(await aiAvailable())) {
      updateEntry(id, (e) => ({
        ...e,
        teardown: quick.teardown,
        parts: { story: 'done', system: 'done', build: 'done' },
        quick: quick.meta,
      }));
      recordVisit(quick.teardown);
      return;
    }
  }

  await Promise.all(PARTS.map((part) => runPart(id, part, scan)));
}

export function retryPart(id: string, part: PartName) {
  const entry = state.entries[id];
  if (!entry) return;
  if (!quickCache.has(id)) {
    // No instant teardown to fall back on yet: rerun the whole pipeline
    updateEntry(id, (e) => ({ ...e, parts: { story: 'loading', system: 'loading', build: 'loading' }, errors: {}, errorCode: undefined }));
    void runGeneration(id);
    return;
  }
  void runPart(id, part, entry.scan);
}

async function runPart(id: string, part: PartName, scan: ScanResult | null) {
  const entry = state.entries[id];
  if (!entry) return;
  updateEntry(id, (e) => ({ ...e, parts: { ...e.parts, [part]: 'loading' }, errors: { ...e.errors, [part]: undefined } }));
  try {
    const res = await postJSON<{ data: StoryPartT | SystemPartT | BuildPartT }>('/api/teardown', {
      query: entry.domainGuessed ? entry.query : (entry.host ?? entry.query),
      part,
      scan,
    });
    updateEntry(id, (e) => ({
      ...e,
      teardown: normalize(merge(e.teardown, part, res.data)),
      parts: { ...e.parts, [part]: 'done' },
    }));
    if (part === 'story') {
      // Only successful teardowns count against the free allowance
      setState((s) => ({ ...s, aiCount: s.aiCount + 1 }));
      const t = state.entries[id]?.teardown;
      if (t) recordVisit(t);
    }
  } catch (err) {
    const error = err as Error & { code?: string };
    const quick = quickCache.get(id);
    if (quick) {
      // Fill the tab instantly instead of showing an error
      updateEntry(id, (e) => {
        const fallbackParts = [...new Set([...(e.fallbackParts ?? []), part])];
        const merged = merge(e.teardown, part, quickPart(quick.teardown, part));
        return {
          ...e,
          teardown: { ...merged, source: fallbackParts.length === PARTS.length ? 'scan' : merged.source },
          parts: { ...e.parts, [part]: 'done' },
          errors: { ...e.errors, [part]: error.message },
          quick: quick.meta,
          fallbackParts,
        };
      });
      if (part === 'story') recordVisit(state.entries[id]?.teardown ?? quick.teardown);
      return;
    }
    updateEntry(id, (e) => ({
      ...e,
      parts: { ...e.parts, [part]: 'error' },
      errors: { ...e.errors, [part]: error.message },
      errorCode: error.code ?? e.errorCode,
    }));
  }
}

function quickPart(q: Teardown, part: PartName): StoryPartT | SystemPartT | BuildPartT {
  switch (part) {
    case 'story':
      return {
        name: q.name, url: q.url, tagline: q.tagline, category: q.category, brandColor: q.brandColor, accentColor: q.accentColor,
        logoGlyph: q.logoGlyph, eli5: q.eli5, facts: q.facts, history: q.history, languages: q.languages, stack: q.stack,
        concepts: q.concepts, buildYourOwn: q.buildYourOwn, sources: q.sources,
      };
    case 'system':
      return { architecture: q.architecture, files: q.files };
    case 'build':
      return { code: q.code, playground: q.playground };
  }
}

function merge(t: Teardown, part: PartName, data: StoryPartT | SystemPartT | BuildPartT): Teardown {
  switch (part) {
    case 'story':
      return { ...t, ...(data as StoryPartT), id: t.id, source: 'ai' };
    case 'system':
      // tier arrives as a plain number; normalize() clamps it into a Tier
      return { ...t, ...(data as SystemPartT as unknown as Pick<Teardown, 'architecture' | 'files'>) };
    case 'build':
      return { ...t, ...(data as BuildPartT) };
  }
}

/** Defends the UI against model slips: dangling ids, crowded tiers, bad colors. */
function normalize(t: Teardown): Teardown {
  const hex = /^#[0-9a-f]{6}$/i;
  const nodes = t.architecture.nodes.map((n) => ({
    ...n,
    tier: Math.min(4, Math.max(0, Math.round(Number(n.tier) || 0))) as Tier,
  }));
  const ids = new Set(nodes.map((n) => n.id));
  const edges = t.architecture.edges.filter((e) => ids.has(e.from) && ids.has(e.to));
  const flows = t.architecture.flows
    .map((f) => ({ ...f, steps: f.steps.filter((s) => ids.has(s.from) && ids.has(s.to)) }))
    .filter((f) => f.steps.length > 0);
  return {
    ...t,
    brandColor: hex.test(t.brandColor) ? t.brandColor : '#5EE7FF',
    accentColor: hex.test(t.accentColor) ? t.accentColor : '#A78BFA',
    architecture: { nodes, edges, flows },
  };
}

export function useTeardown(id: string): { teardown?: Teardown; entry?: Entry } {
  const entry = useStore((s) => s.entries[id]);
  const curated = getCurated(id);
  if (curated) return { teardown: curated };
  return { teardown: entry?.teardown, entry };
}
