import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, Chip, GridBackground, Ionicons, LogoMark, Pressy, Txt, type IconName } from '@/components/ui';
import { C, F, MaxWidth, visibleBrand } from '@/constants/theme';
import { CURATED, getCurated } from '@/data/catalog';
import { PAYWALL_ENABLED, usePro } from '@/lib/purchases';
import { clearHistory, FREE_AI_TEARDOWNS, getState, resolveQuery, shouldShowPaywall, startGeneration, useStore } from '@/lib/store';

const TRY_THESE = ['duolingo.com', 'linear.app', 'notion.so', 'txstate.edu', 'chatgpt.com', 'airbnb.com'];

const FEATURES: { icon: IconName; title: string; body: string; color: string }[] = [
  { icon: 'sparkles', title: 'Ask Teardown', body: 'An AI guide that explains anything and edits the app for you', color: C.cyan },
  { icon: 'time-outline', title: 'Story', body: 'Who built it, when, and the milestones that shaped it', color: C.amber },
  { icon: 'layers-outline', title: 'Stack', body: 'Languages, frameworks and databases, explained simply', color: C.mint },
  { icon: 'git-network-outline', title: 'System map', body: 'Tap any box and watch a request travel through it', color: '#6EA8FF' },
  { icon: 'code-slash-outline', title: 'Code', body: 'Readable snippets from each layer of the app', color: C.violet },
  { icon: 'color-wand-outline', title: 'Playground', body: 'Remix a rebuild of the real page, by code or by hand', color: C.pink },
];

export default function Home() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const history = useStore((s) => s.history);
  const aiCount = useStore((s) => s.aiCount);
  const { isPro } = usePro();
  const cols = width >= 700 ? 3 : 2;
  const freeLeft = Math.max(0, FREE_AI_TEARDOWNS - aiCount);

  function submit(text: string) {
    const value = text.trim();
    if (!value) return;
    const result = resolveQuery(value);
    if (result.kind !== 'generate') {
      router.push({ pathname: '/t/[id]', params: { id: result.id } });
      return;
    }
    if (shouldShowPaywall(isPro)) {
      router.push({ pathname: '/paywall', params: { q: value } });
      return;
    }
    const id = startGeneration(result.query);
    router.push({ pathname: '/t/[id]', params: { id } });
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 48 }}
      keyboardShouldPersistTaps="handled">
      <GridBackground height={520} />
      <View style={styles.wrap}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Ionicons name="construct" size={14} color={C.bg} />
            </View>
            <Txt style={styles.brandText}>TEARDOWN</Txt>
          </View>
          {PAYWALL_ENABLED && (
            <Pressy onPress={() => router.push('/paywall')} style={[styles.proPill, isPro && { borderColor: C.mint }]}>
              <Ionicons name={isPro ? 'checkmark-circle' : 'sparkles'} size={13} color={isPro ? C.mint : C.amber} />
              <Txt style={[styles.proText, { color: isPro ? C.mint : C.amber }]}>{isPro ? 'PRO' : 'GO PRO'}</Txt>
            </Pressy>
          )}
        </View>

        <View style={styles.hero}>
          <Txt variant="label" style={{ color: C.cyan }}>
            {'// for curious builders'}
          </Txt>
          <Txt variant="hero" style={width < 380 && { fontSize: 34, lineHeight: 38 }}>
            See how any app{'\n'}is actually built.
          </Txt>
          <Txt variant="dim" style={{ fontSize: 16, lineHeight: 23, maxWidth: 520 }}>
            Type an app or paste a link. See its story, tech stack, live system map and code, then ask the Teardown agent
            anything or tell it what to change.
          </Txt>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={C.textDim} style={{ marginLeft: 14 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => submit(query)}
            placeholder="instagram.com, Duolingo, linear.app…"
            placeholderTextColor={C.textFaint}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
            style={styles.searchInput}
          />
          <Pressy onPress={() => submit(query)} style={styles.searchGo} accessibilityLabel="Tear it down">
            <Ionicons name="arrow-forward" size={20} color={C.bg} />
          </Pressy>
        </View>
        <View style={styles.searchMeta}>
          <Txt variant="small">
            {!PAYWALL_ENABLED
              ? 'Free · unlimited teardowns of any app or website'
              : isPro
              ? 'Pro · unlimited AI teardowns'
              : `${freeLeft} free AI teardown${freeLeft === 1 ? '' : 's'} left · curated apps are always free`}
          </Txt>
        </View>
        <View style={styles.tryRow}>
          {TRY_THESE.map((t) => (
            <Pressy key={t} onPress={() => submit(t)} style={styles.tryChip}>
              <Txt style={styles.tryText}>{t}</Txt>
            </Pressy>
          ))}
        </View>

        {history.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Txt variant="label">Recently torn down</Txt>
              <Pressy onPress={clearHistory}>
                <Txt variant="small" style={{ color: C.textFaint }}>
                  Clear
                </Txt>
              </Pressy>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {history.map((h) => (
                <Pressy
                  key={h.id}
                  onPress={() =>
                    getCurated(h.id) || getState().entries[h.id]
                      ? router.push({ pathname: '/t/[id]', params: { id: h.id } })
                      : submit(h.query ?? h.name)
                  }
                  style={styles.historyItem}>
                  <LogoMark glyph={h.glyph} color={h.color} size={30} />
                  <View>
                    <Txt style={{ fontFamily: F.displayMedium, fontSize: 14 }}>{h.name}</Txt>
                    <Txt variant="small" style={{ fontSize: 10.5 }}>
                      {h.source === 'ai' ? 'AI teardown' : h.source === 'scan' ? 'Instant' : 'Curated'}
                    </Txt>
                  </View>
                </Pressy>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Txt variant="label">Start with a classic</Txt>
            <Chip label="HAND-CHECKED" color={C.mint} icon="shield-checkmark" />
          </View>
          <View style={styles.grid}>
            {CURATED.map((t) => {
              const brand = visibleBrand(t.brandColor, t.accentColor);
              return (
                <Pressy
                  key={t.id}
                  onPress={() => router.push({ pathname: '/t/[id]', params: { id: t.id } })}
                  style={[styles.appCard, { width: `${100 / cols - 2.2}%` as `${number}%` }]}>
                  <View style={[styles.appGlow, { backgroundColor: brand }]} />
                  <LogoMark glyph={t.logoGlyph} color={t.brandColor} accent={t.accentColor} size={40} />
                  <Txt variant="heading" style={{ marginTop: 10 }}>
                    {t.name}
                  </Txt>
                  <Txt variant="small" numberOfLines={1}>
                    {t.category}
                  </Txt>
                  <View style={styles.langRow}>
                    {t.languages.slice(0, 2).map((l) => (
                      <Txt key={l.name} style={styles.langText} numberOfLines={1}>
                        {l.name}
                      </Txt>
                    ))}
                  </View>
                </Pressy>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Txt variant="label" style={{ marginBottom: 12 }}>
            {"What's inside every teardown"}
          </Txt>
          <View style={styles.grid}>
            {FEATURES.map((f) => (
              <Card key={f.title} style={[styles.featureCard, { width: `${100 / cols - 2.2}%` as `${number}%` }]}>
                <View style={[styles.featureIcon, { backgroundColor: `${f.color}1F` }]}>
                  <Ionicons name={f.icon} size={18} color={f.color} />
                </View>
                <Txt style={{ fontFamily: F.display, fontSize: 15, marginTop: 10 }}>{f.title}</Txt>
                <Txt variant="small" style={{ marginTop: 2 }}>
                  {f.body}
                </Txt>
              </Card>
            ))}
          </View>
        </View>

        <Txt variant="small" style={styles.footnote}>
          Curated teardowns are written from public engineering blogs, talks and Wikipedia. Everything else is built from a
          live scan of the site, verified facts where we have them, and how that kind of product is usually engineered (or
          by Claude when an API key is configured). Anything unverified is marked “likely”.
        </Txt>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', maxWidth: MaxWidth, alignSelf: 'center', paddingHorizontal: 20 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandMark: { width: 24, height: 24, borderRadius: 7, backgroundColor: C.cyan, alignItems: 'center', justifyContent: 'center' },
  brandText: { fontFamily: F.monoBold, fontSize: 14, letterSpacing: 3, color: C.text },
  proPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: `${C.amber}66`,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
    backgroundColor: C.bgRaised,
  },
  proText: { fontFamily: F.monoBold, fontSize: 11, letterSpacing: 1 },
  hero: { gap: 12, marginBottom: 24 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: `${C.cyan}55`,
    shadowColor: C.cyan,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  searchInput: {
    flex: 1,
    color: C.text,
    fontFamily: F.body,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 16,
    outlineStyle: 'none',
  } as object,
  searchGo: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: C.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  searchMeta: { marginTop: 8, marginLeft: 4 },
  tryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  tryChip: {
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.bgRaised,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tryText: { fontFamily: F.mono, fontSize: 12, color: C.textDim },
  section: { marginTop: 36 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 14,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 14,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  appCard: {
    backgroundColor: C.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.line,
    padding: 14,
    overflow: 'hidden',
    marginBottom: 2,
  },
  appGlow: { position: 'absolute', top: -40, right: -40, width: 110, height: 110, borderRadius: 60, opacity: 0.16 },
  langRow: { flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' },
  langText: {
    fontFamily: F.mono,
    fontSize: 10.5,
    color: C.textDim,
    backgroundColor: C.bgRaised,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  featureCard: { padding: 14, marginBottom: 2 },
  featureIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  footnote: { marginTop: 32, color: C.textFaint, lineHeight: 18 },
});
