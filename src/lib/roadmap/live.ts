/**
 * Client side of live roadmap picks: asks /api/roadmap (Gemini, every link checked on the server)
 * for current resources that complement the verified offline library.
 *
 * Only runs when the server has AI configured with Gemini. Results are kept in memory per teardown + track + roadmap
 * steps, so the request is made once per session; failures resolve to null and may be retried after a 2 minute cooldown.
 */
import type { LiveRoadmapRequest, LiveRoadmapResponse } from '@/app/api/roadmap+api';
import type { Teardown } from '@/data/types';
import { aiInfo, apiUrl } from '@/lib/store';

import { topicsFromText } from './build';
import { TOPICS, type Level, type Resource, type ResourceType, type Roadmap, type RoadmapPhase, type RoadmapStep, type Topic, type TrackStep } from './types';

export type LivePicks = LiveRoadmapResponse;

const MAX_STEPS = 10;
const TIMEOUT_MS = 120_000;
const RETRY_AFTER_MS = 2 * 60_000;
/** App-specific phases first: that's where "newest resources for this stack" helps most */
const PHASE_PRIORITY: RoadmapPhase['id'][] = ['build', 'specialize', 'core', 'foundations', 'career'];

/** Includes the step ids: if the roadmap's steps change (the teardown's stack was upgraded), old picks no longer fit */
export const livePicksKey = (roadmap: Roadmap, teardown: Pick<Teardown, 'id'>) =>
  `${teardown.id}:${roadmap.track.id}:${roadmap.phases.flatMap((p) => p.steps.map((s) => s.id)).join(',')}`;

/* ------------------------------------------------------------------ */
/* Request                                                              */
/* ------------------------------------------------------------------ */

function topicsFor(step: RoadmapStep, trackSteps: Map<string, TrackStep>): Topic[] {
  const fromTrack = trackSteps.get(step.id.replace(/^[fcsk]-/, ''))?.topics;
  if (fromTrack?.length && !step.id.startsWith('b-')) return fromTrack.slice(0, 3);
  const found = topicsFromText(`${step.title} ${step.why}`);
  const fromResources = step.resources.flatMap((r) => r.topics.slice(0, 1));
  return [...new Set([...found, ...fromResources])].filter((t) => (TOPICS as readonly string[]).includes(t)).slice(0, 3);
}

/** The body for POST /api/roadmap: up to 10 steps, app-specific phases first, in roadmap order. */
export function liveRequest(roadmap: Roadmap, teardown: Teardown): LiveRoadmapRequest {
  const { track } = roadmap;
  const trackSteps = new Map([...track.foundations, ...track.core, ...track.specialize, ...track.career].map((s) => [s.id, s]));
  const ranked = PHASE_PRIORITY.flatMap((id) => roadmap.phases.find((p) => p.id === id)?.steps ?? []);
  const chosen = new Set(ranked.slice(0, MAX_STEPS).map((s) => s.id));
  return {
    appName: teardown.name,
    appUrl: teardown.url || undefined,
    stackNames: [...new Set(teardown.stack.flatMap((layer) => layer.items.map((item) => item.name)))].slice(0, 25),
    track: track.id,
    steps: roadmap.phases
      .flatMap((p) => p.steps)
      .filter((s) => chosen.has(s.id))
      .map((s) => ({ id: s.id, title: s.title.slice(0, 200), topics: topicsFor(s, trackSteps) })),
  };
}

/* ------------------------------------------------------------------ */
/* Availability                                                         */
/* ------------------------------------------------------------------ */

/** True when the server has AI and that AI is Gemini, the provider with live search. Reuses the app's one status request. */
export function liveAvailable(): Promise<boolean> {
  return aiInfo()
    .then((info) => info.ai && info.provider === 'gemini')
    .catch(() => false);
}

/* ------------------------------------------------------------------ */
/* Fetch + cache                                                        */
/* ------------------------------------------------------------------ */

interface MemoEntry {
  at: number;
  promise: Promise<LivePicks | null>;
  /** undefined while the request is in flight */
  value?: LivePicks | null;
}
const memo = new Map<string, MemoEntry>();

/**
 * What this session already knows, without a request: the picks, null when the last attempt failed and the retry
 * cooldown hasn't passed, or undefined (never asked, still in flight, or ready to retry).
 */
export function peekLivePicks(key: string): LivePicks | null | undefined {
  const hit = memo.get(key);
  if (!hit || hit.value === undefined) return undefined;
  if (hit.value === null && Date.now() - hit.at >= RETRY_AFTER_MS) return undefined;
  return hit.value;
}

const RESOURCE_TYPES: readonly string[] = ['course', 'video', 'docs', 'practice', 'book', 'guide'];
const LEVELS: readonly string[] = ['beginner', 'intermediate', 'advanced'];
const text = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');

/** Keeps only well-formed https resources, with every field the panel renders present. */
function toResource(raw: unknown): Resource | null {
  const x = raw as Record<string, unknown> | null;
  if (!x || typeof x !== 'object' || typeof x.id !== 'string' || typeof x.url !== 'string' || !text(x.title, 160)) return null;
  let url: URL;
  try {
    url = new URL(x.url);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  return {
    id: x.id.slice(0, 120),
    title: text(x.title, 160),
    provider: text(x.provider, 80) || url.hostname.replace(/^www\./, ''),
    url: url.href,
    type: (RESOURCE_TYPES.includes(x.type as string) ? x.type : 'guide') as ResourceType,
    topics: Array.isArray(x.topics) ? (x.topics.filter((t) => (TOPICS as readonly string[]).includes(t as string)) as Topic[]) : [],
    level: (LEVELS.includes(x.level as string) ? x.level : 'beginner') as Level,
    free: x.free !== false,
    duration: text(x.duration, 40) || 'self-paced',
    why: text(x.why, 300),
  };
}

async function load(roadmap: Roadmap, teardown: Teardown): Promise<LivePicks | null> {
  if (!(await liveAvailable())) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(apiUrl('/api/roadmap'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(liveRequest(roadmap, teardown)),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as LivePicks;
    if (!json || typeof json.picks !== 'object' || json.picks === null) return null;
    // No prototype: a step id such as "__proto__" or "constructor" is just a key
    const picks = Object.create(null) as Record<string, Resource[]>;
    for (const [stepId, list] of Object.entries(json.picks)) {
      const valid = Array.isArray(list) ? list.map(toResource).filter((r): r is Resource => r !== null) : [];
      if (valid.length) picks[stepId] = valid;
    }
    const checkedAt = typeof json.checkedAt === 'number' && Number.isFinite(json.checkedAt) ? json.checkedAt : Date.now();
    return { ...json, picks, checkedAt, verified: Object.values(picks).flat().length };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Live, link-checked picks for a roadmap, keyed by step id. Resolves to null when live picks are unavailable
 * (no Gemini, server unreachable, rate limited…). Never rejects. One request per teardown + track + steps per session;
 * a failure is remembered for 2 minutes before another request is allowed.
 */
export function fetchLivePicks(roadmap: Roadmap, teardown: Teardown): Promise<LivePicks | null> {
  const key = livePicksKey(roadmap, teardown);
  if (!roadmap.phases.some((p) => p.steps.length)) return Promise.resolve(null);
  const hit = memo.get(key);
  if (hit && (hit.value !== null || Date.now() - hit.at < RETRY_AFTER_MS)) return hit.promise;
  const entry: MemoEntry = { at: Date.now(), promise: Promise.resolve(null) };
  entry.promise = load(roadmap, teardown)
    .catch(() => null)
    .then((value) => {
      entry.value = value;
      entry.at = Date.now();
      return value;
    });
  memo.set(key, entry);
  return entry.promise;
}
