/**
 * Live roadmap picks: Gemini (with Google Search) finds current courses, videos, docs and practice sites for
 * roadmap steps, then every link is checked before anything is returned.
 *
 * POST { appName, appUrl, stackNames: string[], track: TrackId, steps: [{ id, title, topics: Topic[] }] }
 *   → 200 { picks: Record<stepId, Resource[]>, sources, verified, dropped, model, checkedAt, ... }
 *   → 400 bad body · 413 body over 64 KB · 503 { code: 'no_live' } when Gemini isn't the configured provider
 *   → 401/422/429/502/503 Gemini errors
 *
 * A pick survives only if: its URL is public https, it isn't already in the offline library (RESOURCES), it isn't a
 * repeat within this answer, all its topics are in TOPICS, and the link checker (src/lib/links.ts) proves it is live.
 * Verified answers are cached for 6 hours (gemini.ts cached/remember), keyed by the whole normalized request so a
 * crafted request (say, injected step titles) can't fill the cache for everyone else asking about the same app.
 */
import * as z from 'zod/v4';

import { verifyLinks, youTubeCanonical, type LinkCheck } from '@/lib/links';
import { cached, GEMINI_MODEL, GeminiError, googleSearchOn, groundedJSON, remember, type Source } from '@/lib/llm/gemini';
import { aiProvider } from '@/lib/llm/provider';
import { safeHttpsUrl } from '@/lib/net';
import { pickResources } from '@/lib/roadmap/build';
import { CAREER_TRACKS, RESOURCES } from '@/lib/roadmap/content';
import { TOPICS, TRACK_IDS, type Level, type Resource, type ResourceType, type RoadmapPhase, type Topic, type TrackId } from '@/lib/roadmap/types';

export interface LiveRoadmapRequest {
  appName: string;
  appUrl?: string;
  stackNames: string[];
  track: TrackId;
  steps: { id: string; title: string; topics: Topic[] }[];
}

export interface LiveRoadmapResponse {
  picks: Record<string, Resource[]>;
  sources: Source[];
  verified: number;
  dropped: number;
  model: string;
  /** When the links were checked (ms since epoch) */
  checkedAt: number;
  /** Why candidates were thrown away, for debugging */
  rejected: { url: string; reason: string }[];
  cached?: boolean;
  elapsedMs?: number;
}

const MAX_STEPS = 10;
const MAX_BODY_BYTES = 64_000;
const MAX_URL_LENGTH = 2000;
const PER_STEP = 2;
/** Candidates considered per step (the model is asked for 2; extras only fill in for broken links) */
const CANDIDATES_PER_STEP = 4;
const RESOURCE_TYPES: ResourceType[] = ['course', 'video', 'docs', 'practice', 'book', 'guide'];
const LEVELS: Level[] = ['beginner', 'intermediate', 'advanced'];
const TOPIC_SET = new Set<string>(TOPICS);
/** Own-property lookup, so ids like "constructor" or "__proto__" never reach Object.prototype */
const own = <T>(record: Record<string, T>, key: string): T | undefined => (Object.prototype.hasOwnProperty.call(record, key) ? record[key] : undefined);

/* ------------------------------------------------------------------ */
/* Request validation                                                   */
/* ------------------------------------------------------------------ */

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '');

function parseRequest(raw: unknown): LiveRoadmapRequest | string {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return 'Expected a JSON object';
  const body = raw as Record<string, unknown>;
  const appName = str(body.appName, 100);
  if (!appName) return 'appName is required';
  if (body.appUrl !== undefined && typeof body.appUrl !== 'string') return 'appUrl must be a string';
  if (body.stackNames !== undefined && !Array.isArray(body.stackNames)) return 'stackNames must be an array of strings';
  if (typeof body.track !== 'string' || !(TRACK_IDS as readonly string[]).includes(body.track)) return `track must be one of ${TRACK_IDS.join(', ')}`;
  if (!Array.isArray(body.steps) || body.steps.length === 0) return 'steps must be a non-empty array';

  const steps: LiveRoadmapRequest['steps'] = [];
  for (const s of body.steps) {
    if (!s || typeof s !== 'object') return 'each step must be an object';
    const step = s as Record<string, unknown>;
    const id = typeof step.id === 'string' ? step.id.trim() : '';
    if (!/^[\w-]{1,80}$/.test(id)) return 'each step needs an id (letters, digits, - or _)';
    const title = str(step.title, 200);
    if (!title) return `step ${id} needs a title`;
    if (step.topics !== undefined && !Array.isArray(step.topics)) return `step ${id}: topics must be an array`;
    const topics = ((step.topics as unknown[] | undefined) ?? []).filter((t): t is Topic => typeof t === 'string' && TOPIC_SET.has(t)).slice(0, 4);
    if (!steps.some((x) => x.id === id)) steps.push({ id, title, topics });
    if (steps.length === MAX_STEPS) break;
  }

  const stackNames = ((body.stackNames as unknown[] | undefined) ?? [])
    .map((n) => str(n, 60))
    .filter((n, i, all) => n && all.indexOf(n) === i)
    .slice(0, 25);
  return { appName, appUrl: str(body.appUrl, 200) || undefined, stackNames, track: body.track as TrackId, steps };
}

/* ------------------------------------------------------------------ */
/* Gemini                                                               */
/* ------------------------------------------------------------------ */

const LiveResource = z.object({
  title: z.string(),
  provider: z.string(),
  url: z.string(),
  type: z.string().meta({ enum: RESOURCE_TYPES }),
  topics: z.array(z.string()),
  level: z.string().meta({ enum: LEVELS }),
  free: z.boolean(),
  duration: z.string(),
  why: z.string(),
});
const LiveAnswer = z.object({
  steps: z.array(z.object({ stepId: z.string(), resources: z.array(LiveResource) })),
});
type LiveCandidate = z.infer<typeof LiveResource>;

const systemText = (search: boolean) => `You find learning resources for Teardown, an app that shows beginner and intermediate computer science students how real apps are built and turns each app into a career roadmap.

Rules:
${
  search
    ? '- Use Google Search. Only return URLs you actually found in search results for this request. Never guess, shorten or construct a URL: every link is checked automatically and anything broken, private or unrelated is thrown away.'
    : '- Only return resources you are certain exist, with their exact canonical URLs: official course and documentation pages and long-established, well-known videos and playlists. Never guess, shorten or construct a URL or a video id: every link is checked automatically and anything broken, private or unrelated is thrown away, so one real link beats three guesses.'
}
- Prefer material published or updated in 2024 or later from reputable sources: official documentation, universities and established learning platforms (for example freeCodeCamp, MDN, Harvard CS50, Google, Microsoft Learn, AWS, OWASP, PortSwigger, TryHackMe, The Odin Project) and well-known YouTube channels.
- Free first. Set free=false only when the core material needs payment (free audit or free tier counts as free).
- A YouTube resource must be one video (https://www.youtube.com/watch?v=VIDEO_ID) or a playlist (https://www.youtube.com/playlist?list=LIST_ID). No channel, search or Shorts pages.
- Mix types when you can: a course, a video, official docs, hands-on practice.
- Match each resource to its step and, where it fits, the app's real technologies.
- title: the resource's real title. provider: the organization or channel. duration: rough effort such as "3 hours" or "self-paced".
- topics: 1 to 3 values copied exactly from the allowed topic list.
- why: one plain-English sentence telling a beginner why this resource fits this step.
- Output only JSON.`;

const PHASE_BY_PREFIX: Record<string, RoadmapPhase['id']> = { f: 'foundations', c: 'core', b: 'build', s: 'specialize', k: 'career' };

function buildPrompt(req: LiveRoadmapRequest) {
  const track = CAREER_TRACKS.find((t) => t.id === req.track);
  const lines = req.steps.map((s) => {
    const phase = own(PHASE_BY_PREFIX, s.id.split('-')[0]) ?? 'core';
    const have = s.topics.length ? pickResources(RESOURCES, s.topics, phase, new Map(), 3).map((r) => `"${r.title}"`) : [];
    return `- id "${s.id}": ${s.title}${s.topics.length ? ` (topics: ${s.topics.join(', ')})` : ''}${have.length ? `. Already has: ${have.join(', ')}` : ''}`;
  });
  return `App: ${req.appName}${req.appUrl ? ` (${req.appUrl})` : ''}
Its real technologies: ${req.stackNames.join(', ') || 'unknown'}
Career path: ${track ? `${track.label} (${track.roles.slice(0, 3).join(', ')})` : req.track}
Allowed topics: ${TOPICS.join(', ')}

For each roadmap step below, find up to ${PER_STEP} current resources a student could start this week that complement (not repeat) what they already have from our library.

Steps:
${lines.join('\n')}

Answer as {"steps":[{"stepId":"<id from the list>","resources":[...]}]} with one entry per step.`;
}

/* ------------------------------------------------------------------ */
/* Verification                                                         */
/* ------------------------------------------------------------------ */

const TOPIC_ALIASES: Record<string, Topic> = {
  html: 'html-css', css: 'html-css', 'html5': 'html-css', js: 'javascript', ts: 'typescript', node: 'nodejs', 'node-js': 'nodejs',
  'next-js': 'nextjs', 'react-js': 'react', reactjs: 'react', 'rest': 'rest-api', 'rest-apis': 'rest-api', api: 'rest-api', postgres: 'postgresql',
  database: 'databases', 'sql-databases': 'sql', 'web-application-security': 'web-security', 'application-security': 'secure-coding',
  'cyber-security': 'security-fundamentals', cybersecurity: 'security-fundamentals', security: 'security-fundamentals', 'penetration-testing': 'pentesting',
  authentication: 'auth', authorization: 'auth', oauth: 'auth', 'ci/cd': 'ci-cd', cicd: 'ci-cd', ml: 'machine-learning', 'ai': 'machine-learning',
  'system-architecture': 'system-design', 'real-time': 'realtime', websockets: 'realtime', 'c++': 'cpp', 'c#': 'csharp', golang: 'go', 'git-github': 'git',
};

/** Maps the model's topic spellings onto TOPICS; returns null if any topic is still unknown. */
function normalizeTopics(raw: string[]): Topic[] | null {
  const out: Topic[] = [];
  for (const t of raw) {
    const key = t.toLowerCase().trim().replace(/[\s_]+/g, '-').replace(/\.(?=js\b)/, '-');
    const topic = TOPIC_SET.has(key) ? (key as Topic) : own(TOPIC_ALIASES, key);
    if (!topic) return null;
    if (!out.includes(topic)) out.push(topic);
  }
  return out.slice(0, 4);
}

function normalizeType(raw: string, url: string): ResourceType {
  if (youTubeCanonical(url)) return 'video';
  const t = raw.toLowerCase().trim();
  if ((RESOURCE_TYPES as string[]).includes(t)) return t as ResourceType;
  if (/doc|reference|manual/.test(t)) return 'docs';
  if (/video|youtube|playlist|lecture/.test(t)) return 'video';
  if (/practice|lab|exercise|challenge|interactive|ctf|game/.test(t)) return 'practice';
  if (/course|class|bootcamp|program/.test(t)) return 'course';
  if (/book/.test(t)) return 'book';
  return 'guide';
}

/** A comparable form of a URL: YouTube by video/playlist id, others by host + path + meaningful query. */
export function urlKey(raw: string): string {
  const yt = youTubeCanonical(raw);
  if (yt) return yt;
  try {
    const u = new URL(raw.trim());
    [...u.searchParams.keys()].filter((k) => /^(utm_|ref$|source$|fbclid$|gclid$)/i.test(k)).forEach((k) => u.searchParams.delete(k));
    u.searchParams.sort();
    const query = u.searchParams.toString();
    return `${u.hostname.toLowerCase().replace(/^www\./, '')}${u.pathname.replace(/\/+$/, '')}${query ? `?${query}` : ''}`;
  } catch {
    return raw.trim();
  }
}

let libraryKeys: Set<string> | undefined;
const inLibrary = (url: string) => (libraryKeys ??= new Set(RESOURCES.map((r) => urlKey(r.url)))).has(urlKey(url));

const STOP = new Set(['with', 'from', 'your', 'that', 'this', 'what', 'into', 'about', 'learn', 'learning', 'guide', 'course', 'tutorial', 'beginners', 'beginner', 'full', 'complete', 'crash', 'introduction', 'intro', 'basics', 'build', 'building', 'official', 'video', 'free', 'how', 'the', 'and', 'for']);
const words = (s: string) => new Set(s.toLowerCase().split(/[^a-z0-9+#]+/).filter((w) => w.length >= 3 && !STOP.has(w)));

/** Catches a real-but-unrelated YouTube id: the real title must share a meaningful word with what was promised. */
function videoMatches(check: LinkCheck, candidate: LiveCandidate, step: LiveRoadmapRequest['steps'][number]) {
  const actual = words(`${check.title ?? ''} ${check.author ?? ''}`);
  const expected = words(`${candidate.title} ${candidate.provider} ${step.title} ${step.topics.join(' ').replace(/-/g, ' ')}`);
  return [...expected].some((w) => actual.has(w));
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'resource';

async function findPicks(req: LiveRoadmapRequest, cacheKey: string): Promise<LiveRoadmapResponse> {
  const started = Date.now();
  const { data, sources, model } = await groundedJSON({
    system: systemText(googleSearchOn()),
    prompt: buildPrompt(req),
    schema: LiveAnswer,
    search: true,
    cacheKey: `${cacheKey}:answer`,
    // Chat-speed models: roadmap picks shouldn't use the research models' quota
    task: 'fast',
  });

  const rejected: LiveRoadmapResponse['rejected'] = [];
  const reject = (url: string, reason: string) => rejected.push({ url: url.slice(0, 300), reason });
  const seen = new Set<string>();
  const candidates: { step: LiveRoadmapRequest['steps'][number]; item: LiveCandidate; url: string; topics: Topic[] }[] = [];

  for (const step of req.steps) {
    const items = data.steps.filter((s) => s.stepId.trim() === step.id).flatMap((s) => s.resources).slice(0, CANDIDATES_PER_STEP);
    for (const item of items) {
      const safe = item.url.length <= MAX_URL_LENGTH ? safeHttpsUrl(item.url) : null;
      // The normalized form: no stray whitespace or control characters from the model's string
      const url = safe?.href ?? item.url.trim();
      if (!safe) {
        reject(url, 'not a public https link');
        continue;
      }
      const normalized = normalizeTopics(item.topics);
      if (!normalized) {
        reject(url, `unknown topic (${item.topics.join(', ')})`);
        continue;
      }
      const topics = normalized.length ? normalized : step.topics.slice(0, 3);
      if (topics.length === 0) {
        reject(url, 'no topics');
        continue;
      }
      if (inLibrary(url)) {
        reject(url, 'already in the offline library');
        continue;
      }
      const key = urlKey(url);
      if (seen.has(key)) {
        reject(url, 'repeated in this answer');
        continue;
      }
      seen.add(key);
      candidates.push({ step, item, url, topics });
    }
  }

  const checks = await verifyLinks(candidates.map((c) => c.url));
  const picks = Object.create(null) as Record<string, Resource[]>;
  const ids = new Set<string>();
  const landed = new Set<string>();
  let verified = 0;

  candidates.forEach(({ step, item, url, topics }, i) => {
    const check = checks[i];
    if (!check.ok) return reject(url, check.reason ?? 'link check failed');
    // A redirect can land on something the library (or an earlier pick) already has
    const landedKey = urlKey(check.finalUrl ?? url);
    if (landed.has(urlKey(url)) || landed.has(landedKey) || (check.kind === 'web' && inLibrary(check.finalUrl ?? url))) {
      return reject(url, 'redirects to a link that is already listed');
    }
    if (check.kind === 'youtube' && !videoMatches(check, item, step)) return reject(url, `video is actually "${check.title}"`);
    const list = (picks[step.id] ??= []);
    if (list.length >= PER_STEP) return;
    landed.add(urlKey(url)).add(landedKey);

    // Links that redirect to another site (Google's grounding redirects, shorteners) are replaced by where they really
    // go, so what the student opens later is the page that was checked
    const site = (u: string) => new URL(u).hostname.replace(/^www\./, '');
    const finalUrl =
      check.kind === 'youtube'
        ? check.finalUrl!
        : check.finalUrl && (/vertexaisearch\.cloud\.google\.com|grounding-api-redirect/.test(url) || site(check.finalUrl) !== site(url))
          ? check.finalUrl
          : url;
    const baseId = `live-${slug(step.id)}-${slug(check.kind === 'youtube' ? (check.title ?? item.title) : item.title)}`;
    let id = baseId;
    for (let n = 2; ids.has(id); n++) id = `${baseId}-${n}`;
    ids.add(id);

    list.push({
      id,
      title: str(check.kind === 'youtube' ? (check.title ?? item.title) : item.title, 160) || str(check.title, 160),
      provider: str(check.kind === 'youtube' ? (check.author ?? item.provider) : item.provider, 80) || new URL(finalUrl).hostname.replace(/^www\./, ''),
      url: finalUrl,
      type: normalizeType(item.type, finalUrl),
      topics,
      level: (LEVELS as string[]).includes(item.level.toLowerCase().trim()) ? (item.level.toLowerCase().trim() as Level) : 'beginner',
      free: item.free !== false,
      duration: str(item.duration, 40) || 'self-paced',
      why: str(item.why, 300),
    });
    verified++;
  });

  return {
    picks,
    sources,
    verified,
    dropped: rejected.length,
    model: model || GEMINI_MODEL,
    checkedAt: Date.now(),
    rejected: rejected.slice(0, 40),
    elapsedMs: Date.now() - started,
  };
}

/* ------------------------------------------------------------------ */
/* Route                                                                */
/* ------------------------------------------------------------------ */

const inflight = new Map<string, Promise<LiveRoadmapResponse>>();
const TOO_LARGE = Symbol('too large');

/** Reads and parses the JSON body without buffering more than MAX_BODY_BYTES. */
async function readBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) return TOO_LARGE;
  const reader = request.body?.getReader();
  if (!reader) return undefined;
  const decoder = new TextDecoder();
  let text = '';
  let bytes = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        reader.cancel().catch(() => {});
        return TOO_LARGE;
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  const raw = await readBody(request);
  if (raw === TOO_LARGE) return Response.json({ error: 'Request body is too large', code: 'bad_request' }, { status: 413 });
  const parsed = parseRequest(raw);
  if (typeof parsed === 'string') return Response.json({ error: parsed, code: 'bad_request' }, { status: 400 });

  if (aiProvider() !== 'gemini') {
    return Response.json(
      { error: 'Live roadmap picks need GEMINI_API_KEY in .env (then restart the dev server).', code: 'no_live' },
      { status: 503 },
    );
  }

  // Everything that reaches the prompt is part of the key (parseRequest already normalized and capped it)
  const key = `live-roadmap:v2:${JSON.stringify(parsed)}`;
  const hit = cached<LiveRoadmapResponse>(key);
  if (hit) return Response.json({ ...hit, cached: true } satisfies LiveRoadmapResponse);

  let job = inflight.get(key);
  if (!job) {
    job = findPicks(parsed, key)
      .then((result) => (result.verified > 0 ? remember(key, result) : result))
      .finally(() => inflight.delete(key));
    inflight.set(key, job);
  }

  try {
    return Response.json(await job);
  } catch (e) {
    if (e instanceof GeminiError) {
      // A 400 from Gemini is our request's fault, not the caller's body
      const status = [401, 422, 429, 503].includes(e.status) ? e.status : 502;
      return Response.json({ error: e.message, code: e.code }, { status });
    }
    console.error('[roadmap] live picks failed:', e instanceof Error ? e.message : e);
    return Response.json({ error: 'Couldn’t find live picks right now.', code: 'error' }, { status: 500 });
  }
}
