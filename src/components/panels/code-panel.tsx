import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, Chip, Ionicons, Pressy, SectionTitle, Txt } from '@/components/ui';
import { C, F, languageColor } from '@/constants/theme';
import type { CodeSample, Teardown } from '@/data/types';
import { tokenize, TOKEN_COLORS } from '@/lib/highlight';
import { useWorkspace } from '@/lib/workspace';

export function CodePanel({ t }: { t: Teardown }) {
  const [index, setIndex] = useState(0);
  const ws = useWorkspace(t.id);
  useEffect(() => {
    const i = ws.snippet ? t.code.findIndex((c) => c.id === ws.snippet!.id) : -1;
    if (i >= 0) setIndex(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws.snippet?.rev]);
  const sample = t.code[Math.min(index, t.code.length - 1)];
  if (!sample) return null;

  return (
    <View style={{ gap: 16 }}>
      <SectionTitle label="Code tour" title="Peek at each layer" />
      <View style={styles.list}>
        {t.code.map((c, i) => {
          const on = i === index;
          const color = languageColor(c.language, i);
          return (
            <Pressy key={c.id} onPress={() => setIndex(i)} style={[styles.item, on && { borderColor: color, backgroundColor: `${color}18` }]}>
              <View style={[styles.langDot, { backgroundColor: color }]} />
              <View style={{ flex: 1 }}>
                <Txt style={[styles.itemTitle, on && { color: C.text }]} numberOfLines={1}>
                  {c.title}
                </Txt>
                <Txt style={styles.itemFile} numberOfLines={1}>
                  {c.file}
                </Txt>
              </View>
              <Txt style={[styles.itemLang, { color }]}>{c.language}</Txt>
            </Pressy>
          );
        })}
      </View>

      <Snippet sample={sample} color={languageColor(sample.language, index)} />

      <Txt variant="small" style={{ color: C.textFaint }}>
        Snippets are simplified teaching examples inspired by how {t.name} works, not its private source code.
      </Txt>
    </View>
  );
}

function Snippet({ sample, color }: { sample: CodeSample; color: string }) {
  const lines = useMemo(() => {
    const tokens = tokenize(sample.code.replace(/\t/g, '  '), sample.language);
    const out: { type: keyof typeof TOKEN_COLORS; text: string }[][] = [[]];
    tokens.forEach((tok) => {
      tok.text.split('\n').forEach((part, i) => {
        if (i > 0) out.push([]);
        if (part) out[out.length - 1].push({ type: tok.type, text: part });
      });
    });
    return out;
  }, [sample]);
  const gutter = String(lines.length).length;

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <View style={styles.snippetHead}>
        <View style={styles.windowDots}>
          {['#FF6B6B', '#FFC857', '#7CFFB2'].map((c) => (
            <View key={c} style={[styles.windowDot, { backgroundColor: c }]} />
          ))}
        </View>
        <Txt style={styles.filePath} numberOfLines={1}>
          {sample.file}
        </Txt>
        <Chip label={sample.language.toUpperCase()} color={color} />
      </View>
      <View style={styles.explain}>
        <Ionicons name="chatbubble-ellipses-outline" size={15} color={C.amber} style={{ marginTop: 3 }} />
        <View style={{ flex: 1 }}>
          <Txt variant="heading" style={{ fontSize: 16, marginBottom: 4 }}>
            {sample.title}
          </Txt>
          <Txt variant="dim">{sample.explanation}</Txt>
        </View>
      </View>
      <ScrollView horizontal style={styles.codeScroll} contentContainerStyle={{ padding: 14 }}>
        <View>
          {lines.map((line, i) => (
            <Text key={i} style={styles.codeLine}>
              <Text style={styles.lineNo}>{String(i + 1).padStart(gutter, ' ')}  </Text>
              {line.map((tok, j) => (
                <Text key={j} style={{ color: TOKEN_COLORS[tok.type] }}>
                  {tok.text}
                </Text>
              ))}
            </Text>
          ))}
        </View>
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.card,
  },
  langDot: { width: 10, height: 10, borderRadius: 3 },
  itemTitle: { fontFamily: F.displayMedium, fontSize: 14.5, color: C.textDim },
  itemFile: { fontFamily: F.mono, fontSize: 11, color: C.textFaint, marginTop: 1 },
  itemLang: { fontFamily: F.monoBold, fontSize: 11 },
  snippetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    backgroundColor: C.bgRaised,
  },
  windowDots: { flexDirection: 'row', gap: 5 },
  windowDot: { width: 9, height: 9, borderRadius: 5, opacity: 0.85 },
  filePath: { flex: 1, fontFamily: F.mono, fontSize: 12, color: C.textDim },
  explain: { flexDirection: 'row', gap: 10, padding: 14 },
  codeScroll: { backgroundColor: '#050810', borderTopWidth: 1, borderTopColor: C.line },
  codeLine: { fontFamily: F.mono, fontSize: 12.5, lineHeight: 19, color: TOKEN_COLORS.plain },
  lineNo: { color: '#3A4561' },
});
