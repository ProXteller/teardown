import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
  type TextInputKeyPressEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CareerPicker } from '@/components/career-picker';
import { SearchSuggestions } from '@/components/search-suggestions';
import { Card, Chip, GridBackground, Ionicons, LogoMark, Pressy, Txt, type IconName } from '@/components/ui';
import { C, F, MaxWidth, visibleBrand } from '@/constants/theme';
import { CURATED, getCurated, type ParsedQuery } from '@/data/catalog';
import { QUICK_ENGINE_VERSION } from '@/lib/offline/build';
import { PAYWALL_ENABLED, usePro } from '@/lib/purchases';
import { CAREER_TRACKS } from '@/lib/roadmap/content';
import { clearHistory, FREE_AI_TEARDOWNS, getState, setCareer, shouldShowPaywall, startGeneration, useStore } from '@/lib/store';
import { useSuggestions } from '@/lib/suggest/client';
import { curatedFor, isSpecificAddress, suggestionQuery, typedSuggestion } from '@/lib/suggest/local';
import type { Suggestion } from '@/lib/suggest/types';

const TRY_THESE = ['duolingo.com', 'linear.app', 'notion.so', 'txstate.edu', 'chatgpt.com', 'airbnb.com'];

const FEATURES: { icon: IconName; title: string; body: string; color: string }[] = [
  { icon: 'sparkles', title: 'Ask Teardown', body: 'An AI guide that explains anything and edits the app for you', color: C.cyan },
  { icon: 'time-outline', title: 'Story', body: 'Who built it, when, and the milestones that shaped it', color: C.amber },
  { icon: 'layers-outline', title: 'Stack', body: 'Languages, frameworks and databases, explained simply', color: C.mint },
  { icon: 'git-network-outline', title: 'System map', body: 'Tap any box and watch a request travel through it', color: '#6EA8FF' },
  { icon: 'map-outline', title: 'Roadmap', body: 'Your path to building it, with real courses and videos', color: C.violet },
  { icon: 'color-wand-outline', title: 'Playground', body: 'Remix a rebuild of the real page, by code or by hand', color: C.pink },
];

/** How long a blurred search box keeps its suggestions, so a tap on one still lands */
const BLUR_GRACE_MS = 200;

/** A saved teardown that reopens as is, by resolveQuery's rules: not built by an older engine, nothing failed */
function reusableEntry(id: string): boolean {
  const entry = getState().entries[id];
  const stale = entry?.quick && entry.quick.version !== QUICK_ENGINE_VERSION;
  return Boolean(entry && !stale && !Object.values(entry.parts).includes('error'));
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const history = useStore((s) => s.history);
  const career = useStore((s) => s.career);
  const careerTrack = CAREER_TRACKS.find((c) => c.id === career);
  const aiCount = useStore((s) => s.aiCount);
  const { isPro } = usePro();
  const cols = width >= 700 ? 3 : 2;
  const freeLeft = Math.max(0, FREE_AI_TEARDOWNS - aiCount);

  const [focused, setFocused] = useState(false);
  // After Enter on a plain name the suggestions stay open until the student picks one
  const [pinned, setPinned] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  // The row under the arrow keys or the mouse; only one picked with the keys opens on Enter
  const [highlight, setHighlight] = useState<{ key: string; byKeys: boolean } | null>(null);
  const inputRef = useRef<TextInput>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pressingRow = useRef(false);
  // Focus is on the search box, its button or a suggestion (Tab moves between them without closing the list)
  const focusInside = useRef(false);
  const { items, webLoading, webFailed } = useSuggestions(query);
  const highlighted = highlight ? items.findIndex((s) => s.key === highlight.key) : -1;
  const showSuggestions = query.trim().length > 0 && (focused || pinned) && !dismissed;

  function closeSuggestions() {
    setPinned(false);
    setDismissed(true);
    setHighlight(null);
  }

  function open(id: string) {
    closeSuggestions();
    inputRef.current?.blur();
    router.push({ pathname: '/t/[id]', params: { id } });
  }

  /** Starts a new teardown (or the paywall when the free ones are used up) */
  function startTeardown(q: ParsedQuery) {
    closeSuggestions();
    inputRef.current?.blur();
    if (shouldShowPaywall(isPro)) {
      // The paywall starts exactly this teardown after unlocking (its id may be "zoom-com", not what the text parses to)
      router.push({ pathname: '/paywall', params: { q: q.raw, id: q.id, name: q.displayName, host: q.host ?? '' } });
      return;
    }
    const id = startGeneration(q);
    router.push({ pathname: '/t/[id]', params: { id } });
  }

  /** A past teardown: reopens it, or rebuilds it under the same id when it's no longer saved */
  function reopen(id: string, text: string, name: string) {
    if (getCurated(id) || getState().entries[id]) {
      open(id);
      return;
    }
    const q = suggestionQuery(typedSuggestion(text), {});
    if (q) startTeardown({ ...q, id, displayName: name });
  }

  function choose(s: Suggestion) {
    pressingRow.current = false;
    if (s.kind === 'recent') {
      if (s.entryId) reopen(s.entryId, history.find((h) => h.id === s.entryId)?.query ?? s.domain ?? s.name, s.name);
      return;
    }
    // A curated row, or a row or address on the curated site ("insta" as typed, twitter.com); x.ai is not the curated X
    const curated = curatedFor(s);
    if (curated) {
      open(curated.id);
      return;
    }
    const q = suggestionQuery(s, getState().entries);
    if (!q) return;
    if (reusableEntry(q.id)) open(q.id);
    else startTeardown(q);
  }

  /** Enter or the arrow button: a row picked with the keys opens, a link opens its teardown, a name asks which one */
  function go() {
    const value = query.trim();
    if (!value) return;
    // A row the mouse happens to rest on doesn't count: Enter on a plain name must ask, not guess
    const chosen = showSuggestions && highlight?.byKeys && highlighted >= 0 ? items[highlighted] : undefined;
    if (chosen) {
      choose(chosen);
      return;
    }
    // A link opens the same teardown as its "as typed" row
    if (isSpecificAddress(value)) {
      choose(typedSuggestion(value));
      return;
    }
    setPinned(true);
    setDismissed(false);
    AccessibilityInfo.announceForAccessibility(`Which “${value}” do you mean? Choose one of the suggestions.`);
    // Clicking the arrow button blurs the box on web; keep it focused so the arrow keys still work
    if (Platform.OS === 'web') inputRef.current?.focus();
  }

  function changeQuery(text: string) {
    setQuery(text);
    setPinned(false);
    setDismissed(false);
    setHighlight(null);
  }

  /** Web keyboard: arrows move through the suggestions, Enter chooses, Escape closes */
  function onKeyPress(e: TextInputKeyPressEvent) {
    if (Platform.OS !== 'web') return;
    const { key, isComposing, keyCode } = e.nativeEvent as TextInputKeyPressEvent['nativeEvent'] & {
      isComposing?: boolean;
      keyCode?: number;
    };
    if (key === 'Escape') {
      closeSuggestions();
      return;
    }
    // Safari reports the Enter that confirms an input method's candidate as keyCode 229, not isComposing
    if (key === 'Enter' && !isComposing && keyCode !== 229) {
      // Handled here instead of onSubmitEditing, which would also blur the box
      e.preventDefault();
      go();
      return;
    }
    if ((key !== 'ArrowDown' && key !== 'ArrowUp') || !query.trim() || !items.length) return;
    e.preventDefault();
    const current = showSuggestions ? highlighted : -1;
    const next = key === 'ArrowDown' ? (current + 1) % items.length : current <= 0 ? items.length - 1 : current - 1;
    setDismissed(false);
    setHighlight({ key: items[next].key, byKeys: true });
  }

  /** Focus moved to the search box, its button or a suggestion: the list stays open */
  function focusIn() {
    clearTimeout(blurTimer.current);
    focusInside.current = true;
    setFocused(true);
  }

  /** Focus left one of them: the list closes unless focus lands on another one (or a row is being pressed) */
  function focusOut() {
    focusInside.current = false;
    clearTimeout(blurTimer.current);
    blurTimer.current = setTimeout(() => {
      if (!pressingRow.current && !focusInside.current) setFocused(false);
    }, BLUR_GRACE_MS);
  }

  function onFocus() {
    focusIn();
    setDismissed(false);
  }

  /** A press on a suggestion keeps the list open even though the search box lost focus */
  function rowPressIn() {
    pressingRow.current = true;
    clearTimeout(blurTimer.current);
  }

  /** ...and a press that didn't choose anything (dragged away) closes it like a normal blur */
  function rowPressOut() {
    clearTimeout(blurTimer.current);
    blurTimer.current = setTimeout(() => {
      pressingRow.current = false;
      if (!focusInside.current) setFocused(false);
    }, BLUR_GRACE_MS);
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
            ref={inputRef}
            value={query}
            onChangeText={changeQuery}
            onSubmitEditing={go}
            onKeyPress={onKeyPress}
            onFocus={onFocus}
            onBlur={focusOut}
            submitBehavior="submit"
            placeholder="Zoom, Duolingo, linear.app…"
            placeholderTextColor={C.textFaint}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityHint="Shows matching apps and websites to choose from"
            style={styles.searchInput}
          />
          <Pressy onPress={go} onFocus={focusIn} onBlur={focusOut} style={styles.searchGo} accessibilityLabel="Tear it down">
            <Ionicons name="arrow-forward" size={20} color={C.bg} />
          </Pressy>
        </View>
        {showSuggestions && (
          <SearchSuggestions
            query={query}
            items={items}
            highlighted={highlighted}
            webLoading={webLoading}
            webFailed={webFailed}
            pinned={pinned}
            onChoose={choose}
            onHighlight={(i) => setHighlight(items[i] ? { key: items[i].key, byKeys: false } : null)}
            onPressIn={rowPressIn}
            onPressOut={rowPressOut}
            onRowFocus={focusIn}
            onRowBlur={focusOut}
          />
        )}
        <View style={styles.searchMeta}>
          <Txt variant="small">
            Type a name to see matching apps, or paste a link
            <Txt variant="small" style={{ color: C.textFaint }}>
              {' · '}
              {!PAYWALL_ENABLED
                ? 'Free · unlimited teardowns of any app or website'
                : isPro
                ? 'Pro · unlimited AI teardowns'
                : `${freeLeft} free AI teardown${freeLeft === 1 ? '' : 's'} left · curated apps are always free`}
            </Txt>
          </Txt>
        </View>
        <View style={styles.tryRow}>
          {TRY_THESE.map((t) => (
            <Pressy key={t} onPress={() => choose(typedSuggestion(t))} style={styles.tryChip}>
              <Txt style={styles.tryText}>{t}</Txt>
            </Pressy>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Txt variant="label">What do you want to become?</Txt>
            {careerTrack && (
              <Pressy onPress={() => setCareer(null)}>
                <Txt variant="small" style={{ color: C.textFaint }}>
                  Change
                </Txt>
              </Pressy>
            )}
          </View>
          {careerTrack ? (
            <Card style={[styles.careerCard, { borderColor: `${careerTrack.color}77` }]}>
              <Txt style={{ fontSize: 28 }}>{careerTrack.emoji}</Txt>
              <View style={{ flex: 1 }}>
                <Txt variant="heading" style={{ fontSize: 16 }}>
                  Your path: {careerTrack.label}
                </Txt>
                <Txt variant="small">Open any app’s Roadmap tab to see how to build it on this path.</Txt>
              </View>
            </Card>
          ) : (
            <>
              <Txt variant="dim" style={{ marginBottom: 12 }}>
                Pick a path and every teardown gets a step-by-step roadmap with real courses, YouTube videos and practice.
              </Txt>
              <CareerPicker selected={career} onSelect={setCareer} />
            </>
          )}
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
                <Pressy key={h.id} onPress={() => reopen(h.id, h.query ?? h.name, h.name)} style={styles.historyItem}>
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
          live scan of the site, verified facts where we have them, and how that kind of product is usually engineered. With
          an AI key, Gemini (free) or Claude then researches it live from real pages and lists its sources. Anything
          unverified is marked “likely”.
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
  careerCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  featureIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  footnote: { marginTop: 32, color: C.textFaint, lineHeight: 18 },
});
