import type { StackLayer, Teardown } from '@/data/types';

import type { CareerTrack, Level, Resource, Roadmap, RoadmapPhase, RoadmapStep, Topic, TrackId, TrackStep } from './types';

/**
 * Builds "how to build an app like <teardown> as a future <track>" from a career track and the
 * teardown's real stack. Resources always come from the verified library, never invented.
 */

/** Maps technology names found in a teardown to learning topics. First match wins per rule. */
const TECH_TOPICS: [RegExp, Topic[]][] = [
  [/react native/i, ['react-native']],
  [/\bexpo\b/i, ['expo', 'react-native']],
  [/next\.?js/i, ['nextjs', 'react']],
  [/\breact\b|relay|jsx/i, ['react']],
  [/typescript/i, ['typescript']],
  [/javascript|node|express|npm/i, ['javascript', 'nodejs']],
  [/html|css|tailwind|bootstrap/i, ['html-css']],
  [/graphql/i, ['graphql']],
  [/swift|ios|uikit|objective-c/i, ['swift']],
  [/kotlin|android|jetpack/i, ['kotlin']],
  [/flutter|dart/i, ['flutter']],
  [/python|django|flask|fastapi/i, ['python']],
  [/django/i, ['django']],
  [/\bjava\b|spring|jvm|scala/i, ['java']],
  [/\bgo\b|golang/i, ['go']],
  [/rust/i, ['rust']],
  [/elixir|erlang|beam/i, ['elixir']],
  [/c\+\+|cpp/i, ['cpp']],
  [/postgres/i, ['postgresql', 'sql']],
  [/mysql|sql|sqlite|vitess|mariadb/i, ['sql', 'databases']],
  [/mongo/i, ['mongodb']],
  [/cassandra|scylla|dynamo|bigtable|spanner|hbase|tao/i, ['databases']],
  [/redis/i, ['redis', 'caching']],
  [/memcache|cache|evcache/i, ['caching']],
  [/kafka|rabbit|pub\/?sub|sqs|queue|celery|stream processing/i, ['message-queues']],
  [/websocket|webrtc|real-?time|presence|socket/i, ['realtime']],
  [/video|transcod|hls|dash|streaming|encoder|codec/i, ['video-streaming']],
  [/search|elastic|lucene|index/i, ['search-engines']],
  [/docker|container/i, ['docker']],
  [/kubernetes|k8s|borg/i, ['kubernetes']],
  [/aws|amazon web|s3|ec2|cloudfront|lambda/i, ['aws']],
  [/google cloud|gcp|bigquery|firebase/i, ['gcp']],
  [/azure/i, ['azure']],
  [/cdn|akamai|fastly|cloudflare|edge|open connect/i, ['cdn']],
  [/load balanc|nginx|envoy|proxy|dns|http\/?[23]|quic|tcp/i, ['networking']],
  [/ci\/?cd|github actions|jenkins|deploy|spinnaker/i, ['ci-cd']],
  [/terraform/i, ['terraform']],
  [/monitor|observab|logging|tracing|jaeger|prometheus|grafana|sentry/i, ['monitoring']],
  [/pytorch|tensorflow|neural|deep learning/i, ['deep-learning', 'machine-learning']],
  [/recommend|ranking|feed|personaliz|collaborative filtering/i, ['recommender-systems', 'machine-learning']],
  [/machine learning|\bml\b|model/i, ['machine-learning']],
  [/llm|gpt|claude|language model|embedding|rag/i, ['llm-apps']],
  [/encrypt|signal protocol|tls|https|crypto/i, ['cryptography']],
  [/auth|login|oauth|password|session|jwt|2fa/i, ['auth']],
  [/spark|hadoop|airflow|pipeline|warehouse|hive|flink|beam/i, ['data-engineering']],
  [/unity/i, ['unity', 'csharp']],
  [/unreal/i, ['unreal', 'cpp']],
];

export function topicsFromText(text: string): Topic[] {
  const out: Topic[] = [];
  for (const [re, topics] of TECH_TOPICS) {
    if (re.test(text)) topics.forEach((t) => !out.includes(t) && out.push(t));
  }
  return out;
}

const LAYER_PLAN: Record<StackLayer, { title: string; fallback: Topic[]; verb: string }> = {
  Frontend: { title: 'Build the screens people use', fallback: ['html-css', 'javascript', 'react'], verb: 'the web front end' },
  Mobile: { title: 'Build the mobile app', fallback: ['react-native', 'expo'], verb: 'the mobile apps' },
  Backend: { title: 'Build the API and server logic', fallback: ['nodejs', 'rest-api', 'python'], verb: 'the back end' },
  Data: { title: 'Store and query the data', fallback: ['sql', 'postgresql', 'databases'], verb: 'the data layer' },
  Infrastructure: { title: 'Put it online and keep it fast', fallback: ['docker', 'cdn', 'aws'], verb: 'the infrastructure' },
  'AI / ML': { title: 'Add the smart features', fallback: ['machine-learning', 'recommender-systems'], verb: 'the AI features' },
  DevOps: { title: 'Ship updates safely', fallback: ['ci-cd', 'git', 'monitoring'], verb: 'the release pipeline' },
};

/** How much each track leans into each layer of the app: 0 = skip, 1 = normal, 2 = deep */
const EMPHASIS: Record<TrackId, Partial<Record<StackLayer, 0 | 1 | 2>>> = {
  software: { Frontend: 1, Mobile: 1, Backend: 2, Data: 2, Infrastructure: 1, 'AI / ML': 1, DevOps: 1 },
  web: { Frontend: 2, Mobile: 0, Backend: 1, Data: 1, Infrastructure: 1, 'AI / ML': 0, DevOps: 1 },
  mobile: { Frontend: 0, Mobile: 2, Backend: 1, Data: 1, Infrastructure: 0, 'AI / ML': 0, DevOps: 1 },
  cybersecurity: { Frontend: 1, Mobile: 0, Backend: 2, Data: 1, Infrastructure: 2, 'AI / ML': 0, DevOps: 1 },
  'data-ai': { Frontend: 0, Mobile: 0, Backend: 1, Data: 2, Infrastructure: 0, 'AI / ML': 2, DevOps: 0 },
  'cloud-devops': { Frontend: 0, Mobile: 0, Backend: 1, Data: 1, Infrastructure: 2, 'AI / ML': 0, DevOps: 2 },
  game: { Frontend: 2, Mobile: 1, Backend: 1, Data: 1, Infrastructure: 0, 'AI / ML': 0, DevOps: 0 },
  uiux: { Frontend: 2, Mobile: 1, Backend: 0, Data: 0, Infrastructure: 0, 'AI / ML': 0, DevOps: 0 },
  explore: { Frontend: 1, Mobile: 1, Backend: 1, Data: 1, Infrastructure: 1, 'AI / ML': 1, DevOps: 0 },
};

const PHASE_LEVEL: Record<RoadmapPhase['id'], Level[]> = {
  foundations: ['beginner'],
  core: ['beginner', 'intermediate'],
  build: ['intermediate', 'beginner'],
  specialize: ['intermediate', 'advanced'],
  career: ['beginner', 'intermediate'],
};

/** Picks up to `max` resources: best topic match, suitable level, free first, varied types, few repeats. */
export function pickResources(library: Resource[], topics: Topic[], phase: RoadmapPhase['id'], used: Map<string, number>, max = 3): Resource[] {
  const levels = PHASE_LEVEL[phase];
  const scored = library
    .map((r) => {
      let score = 0;
      topics.forEach((t, i) => {
        const at = r.topics.indexOf(t);
        if (at >= 0) score += (topics.length - i) * 3 + (at === 0 ? 2 : 0);
      });
      if (score === 0) return { r, score: 0 };
      const levelAt = levels.indexOf(r.level);
      score += levelAt === 0 ? 3 : levelAt === 1 ? 1 : -2;
      if (r.free) score += 2;
      score -= (used.get(r.id) ?? 0) * 4;
      return { r, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.r.id.localeCompare(b.r.id));

  const picked: Resource[] = [];
  for (const { r } of scored) {
    if (picked.length === max) break;
    // Prefer variety: take a second resource of the same type only if nothing else is close
    if (picked.some((p) => p.type === r.type) && scored.some((x) => !picked.includes(x.r) && x.r !== r && !picked.some((p) => p.type === x.r.type))) continue;
    picked.push(r);
  }
  for (const { r } of scored) {
    if (picked.length === max) break;
    if (!picked.includes(r)) picked.push(r);
  }
  picked.forEach((r) => used.set(r.id, (used.get(r.id) ?? 0) + 1));
  return picked;
}

const fill = (s: string, app: string) => s.replace(/\{\{\s*app\s*\}\}/g, app);

function stepFrom(s: TrackStep, app: string, phase: RoadmapPhase['id'], library: Resource[], used: Map<string, number>, prefix: string): RoadmapStep {
  return {
    id: `${prefix}-${s.id}`,
    title: fill(s.title, app),
    why: fill(s.why, app),
    weeks: s.weeks,
    project: s.project ? fill(s.project, app) : undefined,
    resources: pickResources(library, s.topics, phase, used),
  };
}

export function buildRoadmap(t: Teardown, track: CareerTrack, library: Resource[]): Roadmap {
  const app = t.name;
  const used = new Map<string, number>();
  const emphasis = EMPHASIS[track.id];

  const foundations = track.foundations.map((s) => stepFrom(s, app, 'foundations', library, used, 'f'));
  const core = track.core.map((s) => stepFrom(s, app, 'core', library, used, 'c'));

  // Phase 3: the teardown's real layers, weighted by what this track cares about
  const flows = t.architecture.flows.map((f) => f.title);
  const ranked = [...t.stack].sort((a, b) => (emphasis[b.layer] ?? 1) - (emphasis[a.layer] ?? 1));
  const relevant = ranked.filter((layer) => (emphasis[layer.layer] ?? 1) > 0);
  // Every path builds at least two real layers of the app, even when its focus is narrow
  const layers = (relevant.length >= 2 ? relevant : ranked.slice(0, Math.min(2, ranked.length))).slice(0, 5);
  const build: RoadmapStep[] = layers
    .map((layer, i) => {
      const plan = LAYER_PLAN[layer.layer];
      const names = layer.items.map((item) => item.name);
      const found = topicsFromText(layer.items.map((item) => `${item.name} ${item.role}`).join(' '));
      const topics = [...found.slice(0, 2), ...plan.fallback.filter((f) => !found.includes(f))].slice(0, 3) as Topic[];
      const deep = (emphasis[layer.layer] ?? 1) === 2;
      const flow = flows[i % Math.max(1, flows.length)];
      return {
        id: `b-${layer.layer.toLowerCase().replace(/[^a-z]+/g, '-')}`,
        title: plan.title,
        why: `${app} builds ${plan.verb} with ${names.slice(0, 3).join(', ')}. ${
          deep ? 'This is a big part of your path, so go deep here.' : 'Learn enough to make your version work.'
        }`,
        weeks: deep ? 4 : 2,
        project: flow ? `Make “${flow}” work end to end in your mini ${app}.` : undefined,
        resources: pickResources(library, topics, 'build', used),
      };
    });

  const specialize = track.specialize.map((s) => stepFrom(s, app, 'specialize', library, used, 's'));
  const career = track.career.map((s) => stepFrom(s, app, 'career', library, used, 'k'));

  const phases: RoadmapPhase[] = [
    { id: 'foundations', title: 'Foundations', summary: 'The basics every builder uses daily.', steps: foundations },
    { id: 'core', title: `Core ${track.label.toLowerCase()} skills`, summary: track.tagline, steps: core },
    { id: 'build', title: `Build your own ${app}`, summary: `Recreate ${app}'s real layers, one at a time.`, steps: build },
    { id: 'specialize', title: `See ${app} like a ${roleNoun(track)}`, summary: `Apply your path to ${app}'s actual design.`, steps: specialize },
    { id: 'career', title: 'Portfolio & first job', summary: `Turn it into proof: ${track.roles.slice(0, 2).join(' or ')}.`, steps: career },
  ].filter((p) => p.steps.length > 0) as RoadmapPhase[];

  const totalWeeks = phases.reduce((sum, p) => sum + p.steps.reduce((s, step) => s + step.weeks, 0), 0);

  return {
    track: { ...track, tagline: fill(track.tagline, app), description: fill(track.description, app) },
    title: track.id === 'explore' ? `Try every path by building a mini ${app}` : `Build an app like ${app} as a future ${track.label.toLowerCase()}`,
    intro: `About ${totalWeeks} weeks at ~8 hours a week. Every link below was checked, and most are free.`,
    totalWeeks,
    phases,
    capstone: {
      title: `Mini ${app}`,
      description: `Your portfolio project: a small but real version of ${app}, built the way its engineers do, with a README that explains the architecture like a Teardown.`,
      features: [...flows.slice(0, 3).map((f) => `Working flow: “${f}”`), capstoneLens(track.id, app)],
    },
  };
}

function roleNoun(track: CareerTrack) {
  const nouns: Record<TrackId, string> = {
    software: 'software engineer',
    web: 'web developer',
    mobile: 'mobile developer',
    cybersecurity: 'security engineer',
    'data-ai': 'data scientist',
    'cloud-devops': 'cloud engineer',
    game: 'game developer',
    uiux: 'product designer',
    explore: 'builder',
  };
  return nouns[track.id];
}

function capstoneLens(track: TrackId, app: string): string {
  const lens: Record<TrackId, string> = {
    software: `A system design doc showing how your ${app} would scale to 1M users`,
    web: 'A Lighthouse score of 90+ and keyboard-accessible screens',
    mobile: 'Installable on a real phone, with offline support',
    cybersecurity: `A threat model and security test report for your ${app}`,
    'data-ai': 'A recommendation or ranking feature with a simple evaluation',
    'cloud-devops': 'Containerized, deployed with CI/CD, with a monitoring dashboard',
    game: 'Game mechanics like streaks, levels or a leaderboard',
    uiux: 'A Figma prototype tested with 5 real users, with findings',
    explore: 'A short write-up of which part you enjoyed most and why',
  };
  return lens[track];
}
