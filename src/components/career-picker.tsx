import { ScrollView, StyleSheet, View } from 'react-native';

import { Pressy, Txt } from '@/components/ui';
import { C, F, onColor } from '@/constants/theme';
import { CAREER_TRACKS } from '@/lib/roadmap/content';
import type { TrackId } from '@/lib/roadmap/types';

/** "What do you want to become?" chips. `layout="wrap"` for the home screen, `"row"` for a compact scroller. */
export function CareerPicker({
  selected,
  onSelect,
  layout = 'wrap',
}: {
  selected: TrackId | null;
  onSelect: (id: TrackId) => void;
  layout?: 'wrap' | 'row';
}) {
  const chips = CAREER_TRACKS.map((track) => {
    const on = selected === track.id;
    return (
      <Pressy
        key={track.id}
        onPress={() => onSelect(track.id)}
        style={[styles.chip, { borderColor: on ? track.color : C.line, backgroundColor: on ? track.color : C.card }]}>
        <Txt style={styles.emoji}>{track.emoji}</Txt>
        <Txt style={[styles.label, { color: on ? onColor(track.color) : C.text }]}>{track.label}</Txt>
      </Pressy>
    );
  });

  if (layout === 'row') {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {chips}
      </ScrollView>
    );
  }
  return <View style={styles.wrap}>{chips}</View>;
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emoji: { fontSize: 15 },
  label: { fontFamily: F.displayMedium, fontSize: 13.5 },
});
