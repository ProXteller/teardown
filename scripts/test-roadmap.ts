/**
 * Roadmap checks: every career track × every curated teardown (plus instant teardowns) produces a
 * complete, tailored plan built only from the verified resource library, and the agent routes to it.
 *   npx tsx scripts/test-roadmap.ts
 */
import { CURATED } from '../src/data/catalog';
import type { Teardown } from '../src/data/types';
import { runLocalAgent } from '../src/lib/agent/local-agent';
import { buildQuickTeardown } from '../src/lib/offline/build';
import { OFFLINE } from '../src/lib/offline/content';
import { buildRoadmap } from '../src/lib/roadmap/build';
import { CAREER_TRACKS, RESOURCES } from '../src/lib/roadmap/content';
import { TOPICS, TRACK_IDS, type TrackId } from '../src/lib/roadmap/types';

let failures = 0;
const fail = (w: string, m: string) => {
  failures++;
  console.log(`  ✗ [${w}] ${m}`);
};

// Track content
if (CAREER_TRACKS.map((c) => c.id).join() !== TRACK_IDS.join()) fail('tracks', `expected ${TRACK_IDS.join()} got ${CAREER_TRACKS.map((c) => c.id).join()}`);
for (const track of CAREER_TRACKS) {
  const steps = [...track.foundations, ...track.core, ...track.specialize, ...track.career];
  const ids = steps.map((s) => s.id);
  if (new Set(ids).size !== ids.length) fail(track.id, 'duplicate step ids');
  if (track.foundations.length < 2 || track.core.length < 3 || track.specialize.length < 3 || track.career.length < 2) fail(track.id, 'phase step counts too low');
  steps.forEach((s) => s.topics.forEach((t) => !(TOPICS as readonly string[]).includes(t) && fail(track.id, `step ${s.id} bad topic ${t}`)));
  if (!/^#[0-9a-f]{6}$/i.test(track.color)) fail(track.id, 'bad color');
}

// Instant teardowns too, so roadmaps work for any searched site
const instant = buildQuickTeardown(OFFLINE, {
  id: 'mobile-txst',
  query: 'mobile.txst.edu',
  displayName: 'Texas State University',
  domain: 'mobile.txst.edu',
  guessedDomain: false,
  scan: null,
  known: OFFLINE.products.find((p) => p.domains.includes('txst.edu')),
}).teardown;
const teardowns: Teardown[] = [...CURATED, instant];

const resourceIds = new Set(RESOURCES.map((r) => r.id));
let totalSteps = 0;
let emptySteps = 0;
for (const t of teardowns) {
  for (const track of CAREER_TRACKS) {
    const w = `${t.id}/${track.id}`;
    const r = buildRoadmap(t, track, RESOURCES);
    const steps = r.phases.flatMap((p) => p.steps);
    totalSteps += steps.length;
    if (r.phases.length < 4) fail(w, `only ${r.phases.length} phases`);
    if (!r.phases.some((p) => p.id === 'build' && p.steps.length >= 2)) fail(w, 'build phase needs 2+ steps from the teardown');
    if (new Set(steps.map((s) => s.id)).size !== steps.length) fail(w, 'duplicate step ids');
    const shown = { title: r.title, intro: r.intro, phases: r.phases, capstone: r.capstone, tagline: r.track.tagline, description: r.track.description };
    if (JSON.stringify(shown).includes('{{')) fail(w, 'unfilled placeholder');
    if (r.totalWeeks < 12 || r.totalWeeks > 160) fail(w, `implausible total weeks ${r.totalWeeks}`);
    steps.forEach((s) => {
      if (s.resources.length === 0) emptySteps++;
      s.resources.forEach((res) => !resourceIds.has(res.id) && fail(w, `unknown resource ${res.id}`));
      if (new Set(s.resources.map((x) => x.id)).size !== s.resources.length) fail(w, `step ${s.id} repeats a resource`);
    });
    if (!r.title.includes(t.name)) fail(w, 'title not tailored to the app');
  }
}
if (emptySteps / Math.max(1, totalSteps) > 0.02) fail('coverage', `${emptySteps}/${totalSteps} steps have no resources`);

// Agent routing
const insta = CURATED.find((t) => t.id === 'instagram')!;
const cases: [string, TrackId | null][] = [
  ['I want to be a cybersecurity engineer', 'cybersecurity'],
  ['make me a roadmap', null],
  ['what courses should i take to become a data scientist', 'data-ai'],
  ['wanna be a game dev', 'game'],
  ['how do i become a ux designer', 'uiux'],
  ['roadmap for cloud and devops', 'cloud-devops'],
  ['i want to become a software engineer', 'software'],
  ['career path for mobile app developer', 'mobile'],
];
for (const [prompt, track] of cases) {
  const reply = runLocalAgent({ teardown: insta, playgroundCode: insta.playground.html, tab: 'story', messages: [{ role: 'user', text: prompt }] });
  const action = reply.actions.find((a) => a.type === 'open_roadmap');
  if (!action) fail(`agent:"${prompt}"`, `no open_roadmap (got ${reply.actions.map((a) => a.type).join(',') || 'none'})`);
  else if ((action.track ?? null) !== track) fail(`agent:"${prompt}"`, `track ${action.track} expected ${track}`);
}
const yt = runLocalAgent({ teardown: insta, playgroundCode: insta.playground.html, tab: 'story', messages: [{ role: 'user', text: 'how does youtube work' }] });
if (yt.actions.some((a) => a.type === 'open_roadmap')) fail('agent', '"how does youtube work" should not open the roadmap');

console.log(`${teardowns.length} teardowns × ${CAREER_TRACKS.length} tracks · ${RESOURCES.length} resources · ${totalSteps} steps (${emptySteps} without resources)`);
console.log(failures ? `\n${failures} failure(s)` : '\nRoadmaps OK');
process.exit(failures ? 1 : 0);
