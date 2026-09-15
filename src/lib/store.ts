import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import { findCurated, getCurated, parseQuery, type ParsedQuery } from '@/data/catalog';
import { PARTS, type BuildPartT, type PartName, type StoryPartT, type SystemPartT } from '@/data/schema';
import type { Teardown, Tier } from '@/data/types';
import type { ScanResult } from '@/lib/fingerprints';
import type { TrackId } from '@/lib/roadmap/types';
import { getWorkspace } from '@/lib/workspace';
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
  /** Live AI research that upgrades the instant teardown in place, tab by tab */
  live?: LiveResearch;
}

export interface LiveResearch {
  provider: AiProviderName;
  pending: PartName[];
  done: PartName[];
  failed: { part: PartName; message: string }[];
  /** Web pages the research used */
  sources: number;
  researchedAt?: string;
}

export type AiProviderName = 'gemini' | 'claude';

interface PartResponse {
  data: StoryPartT | SystemPartT | BuildPartT;
  provider?: AiProviderName;
  sources?: { title: string; url: string }[];
  researchedAt?: string;
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
/**
 * Tabs that live research upgrades. Code & Playground stay instant (the playground is already rebuilt from the
 * real page), which keeps each teardown to 2 requests on Gemini's free tier (5 requests/minute per model).
 */
const LIVE_PARTS: PartName[] = ['story', 'system'];
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
      Object.entries(state.entries).filter(([, e]) => PARTS.every((p) => e.parts[p] === 'done') && !e.live?.pending.length),
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
      Object.entries(saved.entries ?? {})
        .filter(([, e]) => !e.quick || e.quick.version === QUICK_ENGINE_VERSION)
        // Research that was still running when the app closed won't resume
        .map(([k, e]) => [k, e.live?.pending.length ? { ...e, live: { ...e.live, pending: [] } } : e]),
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

let aiStatus: Promise<{ ai: boolean; provider: AiProviderName | null }> | undefined;

/** Asks the server once which AI engine is configured. Unreachable server → offline mode. */
export function aiInfo(): Promise<{ ai: boolean; provider: AiProviderName | null }> {
  aiStatus ??= fetch(apiUrl('/api/status'))
    .then((r) => (r.ok ? r.json() : { ai: false }))
    .then((j: { ai?: boolean; provider?: AiProviderName | null }) => ({ ai: Boolean(j.ai), provider: j.provider ?? null }))
    .catch(() => ({ ai: false, provider: null }));
  return aiStatus;
}

export function aiAvailable(): Promise<boolean> {
  return aiInfo().then((info) => info.ai);
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
    const info = await aiInfo();
    // Show the instant teardown right away; live research (if any) upgrades it tab by tab
    updateEntry(id, (e) => ({
      ...e,
      teardown: quick.teardown,
      parts: { story: 'done', system: 'done', build: 'done' },
      quick: quick.meta,
      live: info.ai && info.provider ? { provider: info.provider, pending: [...LIVE_PARTS], done: [], failed: [], sources: 0 } : undefined,
    }));
    recordVisit(quick.teardown);
    if (!info.ai) return;
    await Promise.all(LIVE_PARTS.map((part) => upgradePart(id, part, scan)));
    return;
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

/** Upgrades one tab of an instant teardown with live AI research; on failure the instant version stays. */
async function upgradePart(id: string, part: PartName, scan: ScanResult | null) {
  const entry = state.entries[id];
  if (!entry?.live) return;
  try {
    const res = await postJSON<PartResponse>('/api/teardown', {
      query: entry.domainGuessed ? entry.query : (entry.host ?? entry.query),
      part,
      scan,
    });
    updateEntry(id, (e) => {
      if (!e.live) return e;
      let data = res.data;
      // Don't throw away a playground the student has already remixed
      if (part === 'build' && getWorkspace(id).base === e.teardown.playground.html && getWorkspace(id).code !== undefined) {
        data = { ...(data as BuildPartT), playground: e.teardown.playground };
      }
      const merged = normalize(merge(e.teardown, part, data));
      const sources = mergeSources(merged.sources, res.sources ?? []);
      const pending = e.live.pending.filter((p) => p !== part);
      return {
        ...e,
        teardown: { ...merged, sources },
        live: {
          ...e.live,
          provider: res.provider ?? e.live.provider,
          pending,
          done: [...e.live.done, part],
          sources: sources.length,
          researchedAt: pending.length === 0 ? (res.researchedAt ?? new Date().toISOString()) : e.live.researchedAt,
        },
      };
    });
    if (part === 'story') {
      setState((s) => ({ ...s, aiCount: s.aiCount + 1 }));
      const t = state.entries[id]?.teardown;
      if (t) recordVisit(t);
    }
  } catch (err) {
    const message = (err as Error).message;
    updateEntry(id, (e) =>
      e.live
        ? { ...e, live: { ...e.live, pending: e.live.pending.filter((p) => p !== part), failed: [...e.live.failed.filter((f) => f.part !== part), { part, message }] } }
        : e,
    );
  }
}

const livePartsToResearch = (entry: Entry) =>
  LIVE_PARTS.filter((p) => !entry.live || (!entry.live.done.includes(p) && !entry.live.pending.includes(p) && !entry.live.failed.some((f) => f.part === p)));

/**
 * Starts live research for a saved instant teardown that never got it: saved before an AI key was added, or closed
 * mid-research. Tabs that failed wait for the Retry button instead (they're usually rate limited).
 */
export async function ensureLive(id: string) {
  const entry = state.entries[id];
  if (!entry?.quick || Object.values(entry.parts).some((st) => st === 'loading') || !livePartsToResearch(entry).length) return;
  const info = await aiInfo();
  const current = state.entries[id];
  if (!info.ai || !info.provider || !current) return;
  const parts = livePartsToResearch(current);
  if (!parts.length) return;
  updateEntry(id, (e) => ({
    ...e,
    live: {
      provider: info.provider!,
      pending: [...(e.live?.pending ?? []), ...parts],
      done: e.live?.done ?? [],
      failed: e.live?.failed ?? [],
      sources: e.live?.sources ?? 0,
      researchedAt: e.live?.researchedAt,
    },
  }));
  parts.forEach((part) => void upgradePart(id, part, current.scan));
}

/** Tries the tabs that couldn't be researched live again (e.g. after a rate limit). */
export function retryLive(id: string) {
  const entry = state.entries[id];
  if (!entry?.live?.failed.length) return;
  const parts = entry.live.failed.map((f) => f.part);
  updateEntry(id, (e) => (e.live ? { ...e, live: { ...e.live, failed: [], pending: [...e.live.pending, ...parts] } } : e));
  parts.forEach((part) => void upgradePart(id, part, entry.scan));
}

function mergeSources(existing: Teardown['sources'], live: { title: string; url: string }[]): Teardown['sources'] {
  const seen = new Set(existing.map((s) => s.url.replace(/\/$/, '')));
  const added = live
    .filter((s) => /^https?:\/\//.test(s.url) && !seen.has(s.url.replace(/\/$/, '')))
    .map((s) => ({ label: s.title || new URL(s.url).hostname.replace(/^www\./, ''), url: s.url }));
  return [...existing, ...added].slice(0, 16);
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
