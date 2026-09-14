import { StyleSheet, View } from 'react-native';

import { Card, Ionicons, SectionTitle, Txt } from '@/components/ui';
import { C, F, visibleBrand } from '@/constants/theme';
import type { Teardown } from '@/data/types';

export function StoryPanel({ t }: { t: Teardown }) {
  const brand = visibleBrand(t.brandColor, t.accentColor);
  return (
    <View style={{ gap: 28 }}>
      <Card style={[styles.eli5, { borderColor: `${brand}55` }]}>
        <View style={styles.eli5Head}>
          <Ionicons name="bulb" size={16} color={C.amber} />
          <Txt variant="label" style={{ color: C.amber }}>
            In plain English
          </Txt>
        </View>
        <Txt style={{ fontSize: 16, lineHeight: 24 }}>{t.eli5}</Txt>
      </Card>

      <View>
        <SectionTitle label="Quick facts" title="The basics" />
        <View style={styles.facts}>
          {t.facts.map((f) => (
            <View key={f.label} style={styles.fact}>
              <Txt variant="label" style={{ fontSize: 10 }}>
                {f.label}
              </Txt>
              <Txt style={{ fontFamily: F.displayMedium, fontSize: 15, marginTop: 4 }}>{f.value}</Txt>
            </View>
          ))}
        </View>
      </View>

      <View>
        <SectionTitle label="History" title={`How ${t.name} got here`} />
        {t.history.length === 0 && (
          <Card style={{ gap: 6, backgroundColor: C.bgRaised }}>
            <View style={styles.eli5Head}>
              <Ionicons name="hourglass-outline" size={15} color={C.textDim} />
              <Txt variant="label">No verified timeline yet</Txt>
            </View>
            <Txt variant="dim">
              {t.name} isn’t in our offline library, and we only show history we can stand behind. Connect the AI engine for a
              researched timeline, or open the Stack tab to see what the live scan proved.
            </Txt>
          </Card>
        )}
        <View>
          {t.history.map((h, i) => {
            const last = i === t.history.length - 1;
            return (
              <View key={`${h.year}-${h.title}`} style={styles.row}>
                <View style={styles.rail}>
                  <View style={[styles.dot, { borderColor: brand, backgroundColor: i === 0 ? brand : C.bg }]} />
                  {!last && <View style={styles.line} />}
                </View>
                <View style={[styles.event, last && { paddingBottom: 0 }]}>
                  <Txt style={[styles.year, { color: brand }]}>{h.year}</Txt>
                  <Txt variant="heading" style={{ fontSize: 16 }}>
                    {h.title}
                  </Txt>
                  <Txt variant="dim" style={{ marginTop: 4 }}>
                    {h.detail}
                  </Txt>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eli5: { gap: 10, backgroundColor: C.bgRaised },
  eli5Head: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  fact: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 14,
    padding: 12,
  },
  row: { flexDirection: 'row', gap: 14 },
  rail: { width: 16, alignItems: 'center' },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2.5, marginTop: 3 },
  line: { flex: 1, width: 2, backgroundColor: C.line, marginVertical: 2 },
  event: { flex: 1, paddingBottom: 22 },
  year: { fontFamily: F.monoBold, fontSize: 12, letterSpacing: 1, marginBottom: 2 },
});
