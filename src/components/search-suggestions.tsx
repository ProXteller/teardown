import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Chip, Ionicons, LogoMark, Pressy, Txt } from '@/components/ui';
import { C, F } from '@/constants/theme';
import type { Suggestion, SuggestionKind } from '@/lib/suggest/types';

const BLUE = '#6EA8FF';
const ICON = 36;

const BADGE: Record<Exclude<SuggestionKind, 'typed'>, { label: string; color: string; spoken: string }> = {
  curated: { label: 'CURATED', color: C.mint, spoken: 'curated teardown' },
  recent: { label: 'SAVED', color: C.amber, spoken: 'saved teardown' },
  known: { label: 'LIBRARY', color: C.textDim, spoken: 'in Teardown’s library' },
  app: { label: 'APP', color: C.violet, spoken: 'app' },
  website: { label: 'WEBSITE', color: BLUE, spoken: 'website' },
};

const IN_TEARDOWN: SuggestionKind[] = ['curated', 'known', 'recent'];

interface Props {
  query: string;
  items: Suggestion[];
  /** Index into items of the row picked with the arrow keys or the mouse, or -1 */
  highlighted: number;
  webLoading: boolean;
  webFailed: boolean;
  /** True after Enter on a plain name: the student has to choose which product they meant */
  pinned: boolean;
  onChoose: (s: Suggestion) => void;
  onHighlight: (index: number) => void;
  /** A row press started (the search box may blur before the press lands) */
  onPressIn?: () => void;
  /** A row press ended, chosen or not */
  onPressOut?: () => void;
  /** Keyboard focus moved onto a row (web Tab), or off it */
  onRowFocus?: () => void;
  onRowBlur?: () => void;
}

/** Every product matching the search, grouped: Teardown's library, then apps and websites, then "as typed". */
export function SearchSuggestions({
  query,
  items,
  highlighted,
  webLoading,
  webFailed,
  pinned,
  onChoose,
  onHighlight,
  onPressIn,
  onPressOut,
  onRowFocus,
  onRowBlur,
}: Props) {
  const text = query.trim();
  const rows = items.map((s, index) => ({ s, index }));
  const library = rows.filter((r) => IN_TEARDOWN.includes(r.s.kind));
  const web = rows.filter((r) => r.s.kind === 'app' || r.s.kind === 'website');
  const typed = rows.filter((r) => r.s.kind === 'typed');

  const row = ({ s, index }: { s: Suggestion; index: number }) => (
    <SuggestionRow
      key={s.key}
      suggestion={s}
      highlighted={index === highlighted}
      onPress={() => onChoose(s)}
      onHoverIn={() => onHighlight(index)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={onRowFocus}
      onBlur={onRowBlur}
    />
  );

  return (
    <View style={[styles.panel, pinned && styles.panelPinned]}>
      {/* A live region, so screen readers hear the question when Enter turns the list into a choice */}
      <View aria-live="polite">
        {pinned ? (
          <View style={styles.header}>
            <Txt style={styles.question} numberOfLines={2}>
              Which “{text}” do you mean?
            </Txt>
            <Txt variant="small">Choose one to tear it down</Txt>
          </View>
        ) : (
          <Txt variant="label" style={styles.label}>
            Suggestions
          </Txt>
        )}
      </View>

      {library.length > 0 && (
        <>
          <Txt variant="label" style={styles.group}>
            In Teardown
          </Txt>
          {library.map(row)}
        </>
      )}

      {web.length > 0 && (
        <>
          <Txt variant="label" style={styles.group}>
            Apps & websites
          </Txt>
          {web.map(row)}
        </>
      )}

      {webLoading && (
        <View style={styles.status} accessibilityLiveRegion="polite">
          <ActivityIndicator size="small" color={C.cyan} style={{ transform: [{ scale: 0.75 }] }} />
          <Txt variant="small" style={styles.statusText}>
            Looking up apps and websites…
          </Txt>
        </View>
      )}
      {!webLoading && webFailed && (
        <View style={styles.status}>
          <Ionicons name="cloud-offline-outline" size={14} color={C.textFaint} />
          <Txt variant="small" style={styles.statusText}>
            Couldn’t reach the web, showing Teardown’s library
          </Txt>
        </View>
      )}

      {typed.length > 0 && (
        <>
          {(library.length > 0 || web.length > 0) && <View style={styles.divider} />}
          {typed.map(row)}
        </>
      )}
    </View>
  );
}

function SuggestionRow({
  suggestion: s,
  highlighted,
  onPress,
  onHoverIn,
  onPressIn,
  onPressOut,
  onFocus,
  onBlur,
}: {
  suggestion: Suggestion;
  highlighted: boolean;
  onPress: () => void;
  onHoverIn: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const badge = s.kind === 'typed' ? undefined : BADGE[s.kind];
  const typed = !badge;
  const title = typed ? (s.description ?? s.name) : s.name;
  // Clearbit's description is just the domain again
  const description = !typed && s.description && s.description !== s.domain ? s.description : undefined;
  const label = [typed ? title : s.name, s.domain, badge?.spoken].filter(Boolean).join(', ');

  return (
    <Pressy
      onPress={onPress}
      onHoverIn={onHoverIn}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: highlighted }}
      style={[styles.row, highlighted && styles.rowHighlighted]}>
      {typed ? (
        <View style={styles.typedIcon}>
          <Ionicons name="search" size={17} color={C.cyan} />
        </View>
      ) : (
        <SuggestionIcon suggestion={s} />
      )}
      <View style={styles.rowBody}>
        <View style={styles.titleLine}>
          <Txt style={[styles.name, typed && styles.typedName]} numberOfLines={1}>
            {title}
          </Txt>
          {s.domain && (
            <Txt style={styles.domain} numberOfLines={1}>
              {s.domain}
            </Txt>
          )}
        </View>
        {description && (
          <Txt variant="small" numberOfLines={1}>
            {description}
          </Txt>
        )}
      </View>
      {badge ? (
        <View>
          <Chip label={badge.label} color={badge.color} />
        </View>
      ) : (
        <Ionicons name="arrow-forward" size={16} color={highlighted ? C.cyan : C.textFaint} />
      )}
    </Pressy>
  );
}

/** App Store artwork when there is one, else the product's letter mark (a neutral one for unknown brands) */
function SuggestionIcon({ suggestion: s }: { suggestion: Suggestion }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  if (s.iconUrl && failedUrl !== s.iconUrl) {
    return (
      <Image
        source={{ uri: s.iconUrl }}
        style={styles.icon}
        contentFit="cover"
        transition={120}
        recyclingKey={s.key}
        accessible={false}
        onError={() => setFailedUrl(s.iconUrl ?? null)}
      />
    );
  }
  const glyph = s.logoGlyph || s.name.trim().charAt(0).toUpperCase() || '?';
  return <LogoMark glyph={glyph} color={s.brandColor ?? C.lineHi} size={ICON} />;
}

const styles = StyleSheet.create({
  panel: {
    marginTop: 8,
    backgroundColor: C.bgRaised,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.lineHi,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  panelPinned: { borderColor: `${C.cyan}55` },
  header: { gap: 2, paddingHorizontal: 10, paddingTop: 8, paddingBottom: 4 },
  question: { fontFamily: F.display, fontSize: 17, lineHeight: 22, color: C.text },
  label: { paddingHorizontal: 10, paddingTop: 6, paddingBottom: 2 },
  group: { fontSize: 10, paddingHorizontal: 10, paddingTop: 10, paddingBottom: 4, color: C.textFaint },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowHighlighted: { backgroundColor: C.cardHi, borderColor: `${C.cyan}44` },
  icon: { width: ICON, height: ICON, borderRadius: ICON * 0.28, backgroundColor: C.card },
  typedIcon: {
    width: ICON,
    height: ICON,
    borderRadius: ICON * 0.28,
    borderWidth: 1,
    borderColor: `${C.cyan}44`,
    backgroundColor: `${C.cyan}14`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1, minWidth: 0, gap: 1 },
  titleLine: { flexDirection: 'row', alignItems: 'baseline', gap: 8, minWidth: 0 },
  name: { flexShrink: 1, fontFamily: F.display, fontSize: 15, lineHeight: 20, color: C.text },
  typedName: { fontFamily: F.displayMedium },
  // On narrow screens the domain gives up its room before the name does
  domain: { flexShrink: 4, maxWidth: '55%', fontFamily: F.mono, fontSize: 11, lineHeight: 16, color: C.cyan },
  status: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8 },
  // Native rows don't shrink their children by default: long status text wraps instead of running past the panel
  statusText: { flexShrink: 1, color: C.textFaint },
  divider: { height: 1, backgroundColor: C.line, marginHorizontal: 10, marginVertical: 4 },
});
