import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AgentDock } from '@/components/agent/agent-dock';
import { CodePanel } from '@/components/panels/code-panel';
import { LearnPanel } from '@/components/panels/learn-panel';
import { PlaygroundPanel } from '@/components/panels/playground-panel';
import { RoadmapPanel } from '@/components/panels/roadmap-panel';
import { LiveScan, StackPanel } from '@/components/panels/stack-panel';
import { StoryPanel } from '@/components/panels/story-panel';
import { SystemPanel } from '@/components/panels/system-panel';
import { Button, Card, Chip, GridBackground, Ionicons, LogoMark, Pressy, Skeleton, Txt, type IconName } from '@/components/ui';
import { C, F, MaxWidth, visibleBrand } from '@/constants/theme';
import type { PartName } from '@/data/schema';
import type { TabKey } from '@/lib/agent/types';
import { usePro } from '@/lib/purchases';
import {
  recordVisit,
  resolveQuery,
  retryLive,
  retryPart,
  shouldShowPaywall,
  startGeneration,
  useTeardown,
  type Entry,
  type Status,
} from '@/lib/store';
import { updateWorkspace, useWorkspace } from '@/lib/workspace';

const TABS: { key: TabKey; label: string; icon: IconName; part: PartName }[] = [
  { key: 'story', label: 'Story', icon: 'time-outline', part: 'story' },
  { key: 'stack', label: 'Stack', icon: 'layers-outline', part: 'story' },
  { key: 'system', label: 'System', icon: 'git-network-outline', part: 'system' },
  { key: 'code', label: 'Code', icon: 'code-slash-outline', part: 'build' },
  { key: 'play', label: 'Playground', icon: 'color-wand-outline', part: 'build' },
  { key: 'learn', label: 'Learn', icon: 'school-outline', part: 'story' },
  { key: 'roadmap', label: 'Roadmap', icon: 'map-outline', part: 'story' },
];

const TIPS = [
  'Typing a web address triggers a DNS lookup that turns the name into an IP address.',
  'A CDN keeps copies of images and video close to you so they load fast.',
  'Most big apps split into many small “services” that talk over the network.',
  'Databases are often “sharded”: split across many machines by user or region.',
  'A load balancer spreads incoming requests across many identical servers.',
  'Caches like Redis or Memcached remember answers so the database works less.',
  'Queues let slow work (like sending notifications) happen in the background.',
];

export default function TeardownScreen() {
  const { id, tab: initialTab } = useLocalSearchParams<{ id: string; tab?: TabKey }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { teardown: t, entry } = useTeardown(id);
  // Tab and selections live in the shared workspace so the Ask Teardown agent can drive them too
  const workspace = useWorkspace(id);
  const tab = workspace.tab;
  const setTab = (next: TabKey) => updateWorkspace(id, { tab: next });
  const scrollRef = useRef<ScrollView>(null);
  const [tabsY, setTabsY] = useState(0);

  useEffect(() => {
    if (initialTab && TABS.some((x) => x.key === initialTab)) updateWorkspace(id, { tab: initialTab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, initialTab]);

  useEffect(() => {
    if (t && t.source === 'curated') recordVisit(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t?.id]);

  // When the agent changes something, bring the panel into view
  useEffect(() => {
    if (workspace.focusRev > 0 && tabsY > 0) scrollRef.current?.scrollTo({ y: tabsY, animated: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace.focusRev]);

  if (!t) return <NotFound id={id} />;

  const brand = visibleBrand(t.brandColor, t.accentColor);
  const current = TABS.find((x) => x.key === tab)!;
  const partStatus: Status = entry ? entry.parts[current.part] : 'done';
  const generating = entry && Object.values(entry.parts).some((s) => s === 'loading');

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView
        ref={scrollRef}
        stickyHeaderIndices={[1]}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        keyboardShouldPersistTaps="handled">
        <View style={{ paddingTop: insets.top + 8 }}>
          <GridBackground height={260} />
          <View style={[styles.glow, { backgroundColor: brand }]} />
          <View style={styles.wrap}>
            <View style={styles.nav}>
              <Pressy onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} style={styles.iconBtn}>
                <Ionicons name="chevron-back" size={20} color={C.text} />
              </Pressy>
              <Chip
                label={t.source === 'curated' ? 'CURATED · HAND-CHECKED' : entry?.live?.done.length ? `LIVE · ${entry.live.provider.toUpperCase()}` : t.source === 'scan' ? 'INSTANT TEARDOWN' : 'AI TEARDOWN'}
                color={t.source === 'curated' ? C.mint : entry?.live?.done.length ? C.mint : t.source === 'scan' ? C.amber : C.violet}
                icon={t.source === 'curated' ? 'shield-checkmark' : entry?.live?.done.length ? 'globe' : t.source === 'scan' ? 'flash' : 'sparkles'}
              />
            </View>
            <View style={styles.identity}>
              {entry?.parts.story === 'loading' ? (
                <Skeleton height={60} width={60} style={{ borderRadius: 17 }} />
              ) : (
                <LogoMark glyph={t.logoGlyph} color={t.brandColor} accent={t.accentColor} size={60} />
              )}
              <View style={{ flex: 1 }}>
                <Txt variant="title" style={width < 380 && { fontSize: 23 }}>
                  {t.name}
                </Txt>
                <Txt style={styles.meta} numberOfLines={1}>
                  {[t.category, t.url].filter(Boolean).join('  ·  ')}
                </Txt>
              </View>
            </View>
            <Txt variant="dim" style={{ fontSize: 15.5, marginTop: 12 }}>
              {t.tagline}
            </Txt>
            {entry && generating && <Progress entry={entry} />}
            {entry?.live && !generating && <LiveBanner entry={entry} name={t.name} />}
            {entry?.quick && !entry.live && !generating && <QuickBanner entry={entry} name={t.name} domain={t.url} />}
          </View>
        </View>

        <View style={styles.tabBarOuter} onLayout={(e) => setTabsY(e.nativeEvent.layout.y)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
            {TABS.map((x) => {
              const on = x.key === tab;
              const status = entry?.live?.pending.includes(x.part) ? 'loading' : entry?.parts[x.part];
              return (
                <Pressy key={x.key} onPress={() => setTab(x.key)} style={[styles.tab, on && { borderBottomColor: brand }]}>
                  {status === 'loading' ? (
                    <ActivityIndicator size="small" color={C.textFaint} style={{ transform: [{ scale: 0.7 }] }} />
                  ) : (
                    <Ionicons name={x.icon} size={16} color={on ? C.text : C.textFaint} />
                  )}
                  <Txt style={[styles.tabText, on && { color: C.text }]}>{x.label}</Txt>
                </Pressy>
              );
            })}
          </ScrollView>
        </View>

        <View style={[styles.wrap, { paddingTop: 22 }]}>
          {tab === 'stack' && entry?.host && partStatus !== 'done' && (
            // The scan finishes long before the AI, so show real evidence right away
            <View style={{ marginBottom: 16 }}>
              <LiveScan scan={entry.scan} loading={entry.scanStatus === 'loading'} />
            </View>
          )}
          {partStatus === 'loading' && <Building part={current.part} />}
          {partStatus === 'error' && entry && <PartError entry={entry} part={current.part} />}
          {partStatus === 'done' && (
            <>
              {tab === 'story' && <StoryPanel t={t} />}
              {tab === 'stack' && <StackPanel t={t} scan={entry?.scan} scanStatus={entry?.scanStatus} />}
              {tab === 'system' && <SystemPanel t={t} />}
              {tab === 'code' && <CodePanel t={t} />}
              {tab === 'play' && <PlaygroundPanel t={t} />}
              {tab === 'learn' && <LearnPanel t={t} />}
              {tab === 'roadmap' && <RoadmapPanel t={t} />}
              <NextTab tab={tab} onGo={setTab} color={brand} />
            </>
          )}
        </View>
      </ScrollView>
      {!generating && partStatus === 'done' && <AgentDock t={t} />}
    </View>
  );
}

function NextTab({ tab, onGo, color }: { tab: TabKey; onGo: (t: TabKey) => void; color: string }) {
  const i = TABS.findIndex((x) => x.key === tab);
  const next = TABS[i + 1];
  if (!next) return null;
  return (
    <Pressy onPress={() => onGo(next.key)} style={[styles.nextTab, { borderColor: `${color}55` }]}>
      <View style={{ flex: 1 }}>
        <Txt variant="label">Up next</Txt>
        <Txt variant="heading">{next.label}</Txt>
      </View>
      <Ionicons name="arrow-forward-circle" size={30} color={color} />
    </Pressy>
  );
}

const PART_TABS: Record<PartName, string> = { story: 'Story & Stack', system: 'System map', build: 'Code & Playground' };

function LiveBanner({ entry, name }: { entry: Entry; name: string }) {
  const live = entry.live!;
  const engine = live.provider === 'gemini' ? 'Gemini + live web pages' : 'Claude';
  const researching = live.pending.length > 0;
  const total = live.done.length + live.pending.length + live.failed.length;
  return (
    <View style={[styles.quick, { backgroundColor: `${C.mint}10`, borderColor: `${C.mint}44` }]}>
      {researching ? (
        <ActivityIndicator size="small" color={C.mint} style={{ transform: [{ scale: 0.8 }], marginTop: -2 }} />
      ) : (
        <Ionicons name={live.failed.length ? 'alert-circle' : 'globe'} size={15} color={live.failed.length ? C.amber : C.mint} style={{ marginTop: 2 }} />
      )}
      <View style={{ flex: 1, gap: 4 }}>
        <Txt style={{ fontFamily: F.displayMedium, fontSize: 13.5, color: C.text }}>
          {researching
            ? `Researching ${name} live · ${live.done.length}/${total} tabs updated`
            : live.done.length
              ? `Researched live with ${engine} · ${live.sources} source${live.sources === 1 ? '' : 's'}`
              : 'Live research unavailable, showing the instant teardown'}
        </Txt>
        <Txt variant="small">
          {researching
            ? `You’re seeing the instant teardown now. ${engine} is reading the web and upgrades each tab as it finishes.`
            : live.failed.length
              ? `${live.failed.map((f) => PART_TABS[f.part]).join(', ')} kept instant data. ${live.failed[0].message}`
              : `Facts come from pages read just now; tap Learn → Sources to check them. Anything unverified is marked LIKELY.`}
        </Txt>
        {!researching && live.failed.length > 0 && (
          <Pressy onPress={() => retryLive(entry.id)} style={{ alignSelf: 'flex-start', marginTop: 2 }}>
            <Txt style={{ fontFamily: F.displayMedium, fontSize: 12.5, color: C.cyan }}>Try live research again</Txt>
          </Pressy>
        )}
      </View>
    </View>
  );
}

function QuickBanner({ entry, name, domain }: { entry: Entry; name: string; domain: string }) {
  const q = entry.quick!;
  const partial = entry.fallbackParts?.length;
  const evidence = entry.scan?.ok
    ? `a live scan of ${domain} (${q.detections} technolog${q.detections === 1 ? 'y' : 'ies'} detected)`
    : 'what we know offline (the site couldn’t be scanned)';
  return (
    <View style={styles.quick}>
      <Ionicons name="flash" size={15} color={C.amber} style={{ marginTop: 2 }} />
      <View style={{ flex: 1, gap: 4 }}>
        <Txt style={{ fontFamily: F.displayMedium, fontSize: 13.5, color: C.text }}>
          {partial ? 'Some tabs were filled in instantly' : `Built instantly in ${Math.max(1, q.builtInMs)} ms`}
        </Txt>
        <Txt variant="small">
          From {evidence}
          {q.knownProduct ? `, verified facts about ${name},` : ','} and how {q.archetypeLabel.toLowerCase()} products are
          usually built. Anything marked LIKELY is an educated guess.
          {q.guessedDomain ? ` We assumed ${name}’s website is ${q.guessedDomain}.` : ''}
        </Txt>
      </View>
    </View>
  );
}

function Progress({ entry }: { entry: Entry }) {
  const steps: { label: string; status: Status }[] = [
    ...(entry.host ? [{ label: 'Live scan', status: entry.scanStatus }] : []),
    { label: 'Story & stack', status: entry.parts.story },
    { label: 'System map', status: entry.parts.system },
    { label: 'Code & playground', status: entry.parts.build },
  ];
  return (
    <View style={styles.progress}>
      {steps.map((s) => (
        <View key={s.label} style={styles.progressItem}>
          {s.status === 'loading' ? (
            <ActivityIndicator size="small" color={C.cyan} style={{ transform: [{ scale: 0.65 }] }} />
          ) : (
            <Ionicons
              name={s.status === 'done' ? 'checkmark-circle' : s.status === 'error' ? 'alert-circle' : 'ellipse-outline'}
              size={15}
              color={s.status === 'done' ? C.mint : s.status === 'error' ? C.red : C.textFaint}
            />
          )}
          <Txt variant="small" style={{ fontSize: 11.5, color: s.status === 'done' ? C.text : C.textDim }}>
            {s.label}
          </Txt>
        </View>
      ))}
    </View>
  );
}

function Building({ part }: { part: PartName }) {
  const [tip, setTip] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTip((i) => (i + 1) % TIPS.length), 3800);
    return () => clearInterval(timer);
  }, []);
  const label =
    part === 'story' ? 'Researching the story and tech stack' : part === 'system' ? 'Drawing the system map' : 'Writing code and building the playground';
  return (
    <View style={{ gap: 16 }}>
      <Card style={{ gap: 10, borderColor: `${C.cyan}44` }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <ActivityIndicator color={C.cyan} />
          <Txt variant="heading" style={{ fontSize: 16 }}>
            {label}…
          </Txt>
        </View>
        <Txt variant="dim">This usually takes under a minute. Other tabs fill in as they finish.</Txt>
        <View style={styles.tip}>
          <Txt variant="label" style={{ color: C.amber }}>
            While you wait
          </Txt>
          <Txt style={{ marginTop: 4, lineHeight: 21 }}>{TIPS[tip]}</Txt>
        </View>
      </Card>
      <Skeleton height={90} />
      <Skeleton height={18} width="60%" />
      <Skeleton height={140} />
    </View>
  );
}

function PartError({ entry, part }: { entry: Entry; part: PartName }) {
  const noKey = entry.errorCode === 'no_key';
  return (
    <Card style={{ gap: 12, borderColor: `${C.red}55` }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ionicons name={noKey ? 'key-outline' : 'cloud-offline-outline'} size={18} color={C.red} />
        <Txt variant="heading" style={{ fontSize: 16 }}>
          {noKey ? 'AI engine not connected' : 'This part didn’t finish'}
        </Txt>
      </View>
      <Txt variant="dim">{entry.errors[part]}</Txt>
      {noKey && (
        <View style={styles.codeBox}>
          <Txt style={styles.codeText}>{'# .env (project root)\nANTHROPIC_API_KEY=sk-ant-...'}</Txt>
        </View>
      )}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button title="Try again" icon="refresh" onPress={() => retryPart(entry.id, part)} style={{ flex: 1 }} />
        <Button title="Explore a classic" variant="ghost" onPress={() => router.replace('/')} style={{ flex: 1 }} />
      </View>
    </Card>
  );
}

function NotFound({ id }: { id: string }) {
  const insets = useSafeAreaInsets();
  const { isPro } = usePro();
  return (
    <View style={[styles.wrap, { flex: 1, paddingTop: insets.top + 40, gap: 14 }]}>
      <Txt variant="title">Nothing here yet</Txt>
      <Txt variant="dim">We don’t have a teardown for “{id}” saved on this device.</Txt>
      <Button
        title={`Tear down ${id}`}
        icon="construct"
        onPress={() => {
          const result = resolveQuery(id);
          if (result.kind !== 'generate') return router.replace({ pathname: '/t/[id]', params: { id: result.id } });
          if (shouldShowPaywall(isPro)) return router.push({ pathname: '/paywall', params: { q: id } });
          startGeneration(result.query);
        }}
      />
      <Button title="Back home" variant="ghost" onPress={() => router.replace('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', maxWidth: MaxWidth, alignSelf: 'center', paddingHorizontal: 20 },
  glow: { position: 'absolute', top: -120, right: -80, width: 260, height: 260, borderRadius: 130, opacity: 0.14 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  meta: { fontFamily: F.mono, fontSize: 12, color: C.textDim, marginTop: 2 },
  progress: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
    padding: 10,
    borderRadius: 12,
    backgroundColor: C.bgRaised,
    borderWidth: 1,
    borderColor: C.line,
  },
  progressItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  tabBarOuter: { backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.line, marginTop: 18 },
  tabBar: { paddingHorizontal: 14, gap: 2, minWidth: '100%', justifyContent: 'center' },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 13,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabText: { fontFamily: F.displayMedium, fontSize: 14, color: C.textFaint },
  tip: { backgroundColor: C.bgRaised, borderRadius: 12, padding: 12, marginTop: 4 },
  quick: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: `${C.amber}10`,
    borderWidth: 1,
    borderColor: `${C.amber}44`,
  },
  codeBox: { backgroundColor: '#050810', borderRadius: 10, padding: 12 },
  codeText: { fontFamily: F.mono, fontSize: 12.5, color: C.mint },
  nextTab: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: C.card,
  },
});
