import * as WebBrowser from 'expo-web-browser';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { CareerPicker } from '@/components/career-picker';
import { Card, Chip, Ionicons, Pressy, Txt, type IconName } from '@/components/ui';
import { C, F } from '@/constants/theme';
import type { Teardown } from '@/data/types';
import { buildRoadmap } from '@/lib/roadmap/build';
import { CAREER_TRACKS, RESOURCES } from '@/lib/roadmap/content';
import { fetchLivePicks, liveAvailable, livePicksKey, peekLivePicks, type LivePicks } from '@/lib/roadmap/live';
import type { Resource, RoadmapStep, TrackId } from '@/lib/roadmap/types';
import { setCareer, toggleRoadmapStep, useStore } from '@/lib/store';
import { useWorkspace } from '@/lib/workspace';

/** Stable empty list: a fresh [] from a store selector would re-render forever */
const NO_PROGRESS: string[] = [];
/** Stable empty list for steps without live picks */
const NO_LIVE: Resource[] = [];
/**
 * Wait this long on a track before asking for live picks, so tapping through the career picker doesn't start a
 * Gemini search for every track passed on the way (each costs free-tier quota).
 */
const LIVE_START_DELAY_MS = 900;

interface LiveState {
  key: string;
  status: 'loading' | 'done' | 'failed';
  data: LivePicks | null;
}

function checkedAgo(at: number) {
  const mins = Math.round((Date.now() - at) / 60000);
  if (mins < 3) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  return `${Math.round(mins / 60)} h ago`;
}

const TYPE_ICON: Record<Resource['type'], { icon: IconName; label: string }> = {
  course: { icon: 'school-outline', label: 'Course' },
  video: { icon: 'logo-youtube', label: 'Video' },
  docs: { icon: 'book-outline', label: 'Docs' },
  practice: { icon: 'flask-outline', label: 'Practice' },
  book: { icon: 'library-outline', label: 'Book' },
  guide: { icon: 'compass-outline', label: 'Guide' },
};

export function RoadmapPanel({ t }: { t: Teardown }) {
  const career = useStore((s) => s.career);
  const ws = useWorkspace(t.id);
  const trackId = ws.roadmapTrack ?? career;
  const track = CAREER_TRACKS.find((x) => x.id === trackId);
  const roadmap = useMemo(() => (track ? buildRoadmap(t, track, RESOURCES) : null), [t, track]);
  const key = `${t.id}:${trackId}`;
  const done = useStore((s) => s.progress[key] ?? NO_PROGRESS);
  const [openPhase, setOpenPhase] = useState<string>('foundations');
  const [liveState, setLiveState] = useState<LiveState | null>(null);
  const liveKey = roadmap ? livePicksKey(roadmap, t) : '';
  // Live research is still upgrading this teardown (its stack can change the roadmap's build steps): wait for it, and
  // don't take one of Gemini's few concurrent slots away from it
  const researching = useStore((s) => (s.entries[t.id]?.live?.pending.length ?? 0) > 0);

  // The agent asked for a specific track: make it the student's choice too
  useEffect(() => {
    if (ws.roadmapTrack && ws.roadmapTrack !== career) setCareer(ws.roadmapTrack);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws.roadmapTrack]);

  // Live picks: at most once per teardown + track + steps (fetchLivePicks remembers results and failures), only when
  // Gemini is available. Re-renders never refetch: a known result or a recent failure returns before any request.
  useEffect(() => {
    if (!roadmap || researching || peekLivePicks(liveKey) !== undefined) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      void (async () => {
        if (!(await liveAvailable()) || cancelled) return;
        setLiveState({ key: liveKey, status: 'loading', data: null });
        const data = await fetchLivePicks(roadmap, t);
        if (!cancelled) setLiveState({ key: liveKey, status: data ? 'done' : 'failed', data });
      })();
    }, LIVE_START_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [liveKey, roadmap, t, researching]);

  const choose = (id: TrackId) => setCareer(id);

  if (!track || !roadmap) {
    return (
      <View style={{ gap: 18 }}>
        <Card style={{ gap: 10, borderColor: `${C.cyan}55` }}>
          <Txt variant="label" style={{ color: C.cyan }}>
            Your roadmap
          </Txt>
          <Txt variant="title" style={{ fontSize: 24 }}>
            What do you want to become?
          </Txt>
          <Txt variant="dim">
            Pick a path and we’ll turn {t.name} into a step-by-step plan to learn the skills, with real courses, YouTube
            videos and practice sites.
          </Txt>
        </Card>
        <CareerPicker selected={null} onSelect={choose} />
      </View>
    );
  }

  const allSteps = roadmap.phases.flatMap((p) => p.steps);
  const completed = allSteps.filter((s) => done.includes(s.id)).length;
  const pct = allSteps.length ? completed / allSteps.length : 0;
  const known = peekLivePicks(liveKey);
  const live: LiveState | null =
    known !== undefined ? { key: liveKey, status: known ? 'done' : 'failed', data: known } : liveState?.key === liveKey ? liveState : null;
  const livePicks = live?.status === 'done' ? live.data : null;
  const liveFor = (id: string) => (livePicks && Object.prototype.hasOwnProperty.call(livePicks.picks, id) ? livePicks.picks[id] : NO_LIVE);
  const liveCount = allSteps.reduce((n, s) => n + liveFor(s.id).length, 0);

  return (
    <View style={{ gap: 18 }}>
      <View style={{ gap: 10 }}>
        <Txt variant="label">I want to become</Txt>
        <CareerPicker selected={track.id} onSelect={choose} layout="row" />
      </View>

      <Card style={[styles.hero, { borderColor: `${track.color}77` }]}>
        <View style={styles.heroTop}>
          <Txt style={{ fontSize: 30 }}>{track.emoji}</Txt>
          <View style={{ flex: 1 }}>
            <Txt variant="heading" style={{ fontSize: 19, lineHeight: 24 }}>
              {roadmap.title}
            </Txt>
            <Txt variant="small" style={{ marginTop: 2 }}>
              {track.roles.join(' · ')}
            </Txt>
          </View>
        </View>
        <Txt variant="dim">{track.description}</Txt>
        <Txt variant="dim">{roadmap.intro}</Txt>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct * 100}%`, backgroundColor: track.color }]} />
        </View>
        <Txt variant="small">
          {completed}/{allSteps.length} steps done · ~{roadmap.totalWeeks} weeks
        </Txt>
      </Card>

      {live?.status === 'loading' && (
        <View style={styles.liveStatus} accessibilityLiveRegion="polite">
          <ActivityIndicator size="small" color={C.violet} />
          <Txt variant="small" style={{ flex: 1, color: C.textDim }}>
            Finding the newest resources with Gemini…
          </Txt>
        </View>
      )}
      {livePicks && liveCount > 0 && (
        <View style={styles.liveStatus} accessibilityLiveRegion="polite">
          <Ionicons name="sparkles" size={14} color={C.violet} />
          <Txt variant="small" style={{ flex: 1, color: C.textDim }}>
            Added {liveCount} live pick{liveCount === 1 ? '' : 's'}, every link checked {checkedAgo(livePicks.checkedAt)}
          </Txt>
        </View>
      )}
      {livePicks && liveCount === 0 && (
        <View style={styles.liveStatus} accessibilityLiveRegion="polite">
          <Ionicons name="sparkles-outline" size={14} color={C.textFaint} />
          <Txt variant="small" style={{ flex: 1, color: C.textFaint }}>
            Gemini didn’t find any new links that passed our checks, so this plan uses the checked library.
          </Txt>
        </View>
      )}
      {live?.status === 'failed' && (
        <View style={styles.liveStatus} accessibilityLiveRegion="polite">
          <Ionicons name="cloud-offline-outline" size={14} color={C.textFaint} />
          <Txt variant="small" style={{ flex: 1, color: C.textFaint }}>
            Live picks aren’t available right now (Gemini may be busy). Every resource below is from the checked library.
          </Txt>
        </View>
      )}

      {roadmap.phases.map((phase, index) => {
        const open = openPhase === phase.id;
        const phaseDone = phase.steps.filter((s) => done.includes(s.id)).length;
        return (
          <Card key={phase.id} style={{ padding: 0, overflow: 'hidden' }}>
            <Pressy onPress={() => setOpenPhase(open ? '' : phase.id)} style={styles.phaseHead}>
              <View style={[styles.phaseNum, { borderColor: track.color, backgroundColor: phaseDone === phase.steps.length ? track.color : 'transparent' }]}>
                <Txt style={{ fontFamily: F.monoBold, color: phaseDone === phase.steps.length ? C.bg : track.color }}>{index + 1}</Txt>
              </View>
              <View style={{ flex: 1 }}>
                <Txt variant="heading" style={{ fontSize: 16 }}>
                  {phase.title}
                </Txt>
                <Txt variant="small" numberOfLines={open ? undefined : 1}>
                  {phase.summary}
                </Txt>
              </View>
              <Txt style={styles.phaseCount}>
                {phaseDone}/{phase.steps.length}
              </Txt>
              <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={C.textDim} />
            </Pressy>
            {open && (
              <View style={styles.steps}>
                {phase.steps.map((step) => (
                  <Step
                    key={step.id}
                    step={step}
                    live={liveFor(step.id)}
                    done={done.includes(step.id)}
                    color={track.color}
                    onToggle={() => toggleRoadmapStep(key, step.id)}
                  />
                ))}
              </View>
            )}
          </Card>
        );
      })}

      <Card style={[styles.capstone, { borderColor: `${track.color}77` }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="trophy" size={18} color={C.amber} />
          <Txt variant="label" style={{ color: C.amber }}>
            Capstone project
          </Txt>
        </View>
        <Txt variant="heading">{roadmap.capstone.title}</Txt>
        <Txt variant="dim">{roadmap.capstone.description}</Txt>
        {roadmap.capstone.features.map((f) => (
          <View key={f} style={{ flexDirection: 'row', gap: 8 }}>
            <Ionicons name="checkmark" size={15} color={track.color} style={{ marginTop: 3 }} />
            <Txt style={{ flex: 1, lineHeight: 21 }}>{f}</Txt>
          </View>
        ))}
      </Card>

      <Txt variant="small" style={{ color: C.textFaint }}>
        Links were checked when this roadmap library was built.
        {liveCount > 0 ? ' LIVE picks were suggested by Gemini, and each link was checked on the server before it was shown.' : ''} Course
        providers can change prices or pages, so confirm before paying for anything.
      </Txt>
    </View>
  );
}

function Step({ step, live, done, color, onToggle }: { step: RoadmapStep; live: Resource[]; done: boolean; color: string; onToggle: () => void }) {
  return (
    <View style={[styles.step, done && { opacity: 0.72 }]}>
      <Pressy onPress={onToggle} style={styles.stepHead} accessibilityLabel={done ? 'Mark not done' : 'Mark done'}>
        <Ionicons name={done ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={done ? color : C.textDim} />
        <View style={{ flex: 1 }}>
          <Txt style={[styles.stepTitle, done && { textDecorationLine: 'line-through' }]}>{step.title}</Txt>
          <Txt variant="small">~{step.weeks} week{step.weeks === 1 ? '' : 's'}</Txt>
        </View>
      </Pressy>
      <Txt variant="dim" style={{ marginLeft: 32 }}>
        {step.why}
      </Txt>
      {step.project && (
        <View style={[styles.project, { borderColor: `${color}55` }]}>
          <Ionicons name="hammer-outline" size={14} color={color} style={{ marginTop: 2 }} />
          <Txt style={{ flex: 1, fontSize: 13.5, lineHeight: 19 }}>{step.project}</Txt>
        </View>
      )}
      <View style={{ gap: 6, marginLeft: 32 }}>
        {step.resources.map((r) => (
          <ResourceRow key={r.id} r={r} />
        ))}
        {live.map((r) => (
          <ResourceRow key={`live:${r.id}`} r={r} live />
        ))}
        {step.resources.length === 0 && live.length === 0 && (
          <Txt variant="small" style={{ color: C.textFaint }}>
            No verified resource for this step yet. Search the step title on roadmap.sh or freeCodeCamp.
          </Txt>
        )}
      </View>
    </View>
  );
}

function ResourceRow({ r, live }: { r: Resource; live?: boolean }) {
  const type = TYPE_ICON[r.type] ?? TYPE_ICON.guide;
  return (
    <Pressy onPress={() => WebBrowser.openBrowserAsync(r.url)} style={[styles.resource, live && styles.liveResource]}>
      <View style={styles.resourceIcon}>
        <Ionicons name={type.icon} size={15} color={r.type === 'video' ? '#FF4E45' : C.cyan} />
      </View>
      <View style={{ flex: 1 }}>
        <Txt style={styles.resourceTitle} numberOfLines={2}>
          {r.title}
        </Txt>
        <Txt variant="small" numberOfLines={1}>
          {r.provider} · {type.label} · {r.duration}
        </Txt>
      </View>
      <View style={styles.chips}>
        {live && <Chip label="LIVE" color={C.violet} icon="sparkles" />}
        {r.free ? <Chip label="FREE" color={C.mint} /> : <Chip label="PAID" color={C.amber} />}
      </View>
    </Pressy>
  );
}

const styles = StyleSheet.create({
  hero: { gap: 10 },
  heroTop: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: C.lineHi, overflow: 'hidden', marginTop: 4 },
  progressFill: { height: 8, borderRadius: 4 },
  phaseHead: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  phaseNum: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  phaseCount: { fontFamily: F.mono, fontSize: 12, color: C.textDim },
  steps: { borderTopWidth: 1, borderTopColor: C.line, padding: 14, gap: 22 },
  step: { gap: 8 },
  stepHead: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  stepTitle: { fontFamily: F.display, fontSize: 15.5, color: C.text },
  project: { flexDirection: 'row', gap: 8, marginLeft: 32, borderWidth: 1, borderStyle: 'dashed', borderRadius: 10, padding: 10 },
  resource: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.bgRaised,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    padding: 10,
  },
  liveResource: { borderColor: `${C.violet}55` },
  chips: { alignItems: 'flex-end', gap: 4 },
  liveStatus: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: -6, paddingHorizontal: 4 },
  resourceIcon: { width: 30, height: 30, borderRadius: 9, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  resourceTitle: { fontFamily: F.displayMedium, fontSize: 13.5, color: C.text },
  capstone: { gap: 8 },
});
