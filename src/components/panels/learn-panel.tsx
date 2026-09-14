import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Ionicons, Pressy, SectionTitle, Txt } from '@/components/ui';
import { C, F, visibleBrand } from '@/constants/theme';
import type { Teardown } from '@/data/types';
import { useWorkspace } from '@/lib/workspace';

export function LearnPanel({ t }: { t: Teardown }) {
  const brand = visibleBrand(t.brandColor, t.accentColor);
  const [open, setOpen] = useState<string | null>(null);
  const ws = useWorkspace(t.id);
  useEffect(() => {
    if (ws.concept) setOpen(ws.concept.term);
  }, [ws.concept]);

  return (
    <View style={{ gap: 28 }}>
      <View>
        <SectionTitle label="Concepts" title="Words you’ll hear in interviews" />
        <View style={{ gap: 8 }}>
          {t.concepts.map((c) => {
            const isOpen = open === c.term;
            return (
              <Pressy key={c.term} onPress={() => setOpen(isOpen ? null : c.term)} style={[styles.concept, isOpen && { borderColor: `${C.cyan}66` }]}>
                <View style={styles.conceptHead}>
                  <Txt style={{ fontFamily: F.display, fontSize: 15, flex: 1 }}>{c.term}</Txt>
                  <Ionicons name={isOpen ? 'remove' : 'add'} size={18} color={C.textDim} />
                </View>
                {isOpen && (
                  <Txt variant="dim" style={{ marginTop: 6 }}>
                    {c.meaning}
                  </Txt>
                )}
              </Pressy>
            );
          })}
        </View>
      </View>

      <View>
        <SectionTitle label="Build your own" title={`A tiny ${t.name}, step by step`} />
        <View style={{ gap: 10 }}>
          {t.buildYourOwn.map((s, i) => (
            <Card key={s.step} style={styles.step}>
              <View style={[styles.stepNum, { backgroundColor: `${brand}22`, borderColor: `${brand}66` }]}>
                <Txt style={{ fontFamily: F.monoBold, color: brand }}>{i + 1}</Txt>
              </View>
              <View style={{ flex: 1 }}>
                <Txt variant="heading" style={{ fontSize: 15.5 }}>
                  {s.step}
                </Txt>
                <Txt variant="dim" style={{ marginTop: 3 }}>
                  {s.detail}
                </Txt>
              </View>
            </Card>
          ))}
        </View>
      </View>

      {t.sources.length > 0 && (
        <View>
          <SectionTitle label="Go deeper" title="Sources & further reading" />
          <View style={{ gap: 8 }}>
            {t.sources.map((s) => (
              <Pressy key={s.url} onPress={() => WebBrowser.openBrowserAsync(s.url)} style={styles.source}>
                <Ionicons name="link" size={15} color={C.cyan} />
                <View style={{ flex: 1 }}>
                  <Txt style={{ fontFamily: F.displayMedium }}>{s.label}</Txt>
                  <Txt style={styles.url} numberOfLines={1}>
                    {s.url.replace(/^https?:\/\//, '')}
                  </Txt>
                </View>
                <Ionicons name="open-outline" size={15} color={C.textFaint} />
              </Pressy>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  concept: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 14, padding: 14 },
  conceptHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  step: { flexDirection: 'row', gap: 12, padding: 14 },
  stepNum: { width: 30, height: 30, borderRadius: 9, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  source: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.line,
    padding: 12,
  },
  url: { fontFamily: F.mono, fontSize: 11, color: C.textFaint, marginTop: 1 },
});
