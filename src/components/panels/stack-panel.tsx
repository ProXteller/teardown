import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Chip, Ionicons, Pressy, SectionTitle, Txt, type IconName } from '@/components/ui';
import { C, F, languageColor } from '@/constants/theme';
import type { StackLayer, Teardown } from '@/data/types';
import type { ScanResult } from '@/lib/fingerprints';
import { OFFLINE } from '@/lib/offline/content';
import type { Status } from '@/lib/store';
import { useWorkspace } from '@/lib/workspace';

const LAYER_ICON: Record<StackLayer, IconName> = {
  Frontend: 'browsers-outline',
  Mobile: 'phone-portrait-outline',
  Backend: 'server-outline',
  Data: 'albums-outline',
  Infrastructure: 'cloud-outline',
  'AI / ML': 'sparkles-outline',
  DevOps: 'infinite-outline',
};

export function StackPanel({ t, scan, scanStatus }: { t: Teardown; scan?: ScanResult | null; scanStatus?: Status }) {
  const total = t.languages.reduce((sum, l) => sum + l.share, 0) || 1;
  const [openLayer, setOpenLayer] = useState<string | null>(t.stack[0]?.layer ?? null);
  const ws = useWorkspace(t.id);
  useEffect(() => {
    if (ws.layer) setOpenLayer(ws.layer.name);
  }, [ws.layer]);

  return (
    <View style={{ gap: 28 }}>
      {(scanStatus === 'loading' || scan) && <LiveScan scan={scan} loading={scanStatus === 'loading'} />}

      <View>
        <SectionTitle label="Languages" title="What it’s written in" />
        <View style={styles.bar}>
          {t.languages.map((l, i) => (
            <View key={l.name} style={{ flex: l.share / total, backgroundColor: languageColor(l.name, i) }} />
          ))}
        </View>
        <View style={{ gap: 10, marginTop: 14 }}>
          {t.languages.map((l, i) => (
            <View key={l.name} style={styles.langRow}>
              <View style={[styles.swatch, { backgroundColor: languageColor(l.name, i) }]} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Txt style={{ fontFamily: F.displayMedium }}>{l.name}</Txt>
                  <Txt style={styles.pct}>{Math.round((l.share / total) * 100)}%</Txt>
                </View>
                <Txt variant="small">{l.usedFor}</Txt>
              </View>
            </View>
          ))}
        </View>
        <Txt variant="small" style={{ color: C.textFaint, marginTop: 10 }}>
          Percentages show relative emphasis across the product, not exact lines of code.
        </Txt>
      </View>

      <View>
        <SectionTitle label="Tech stack" title="Layer by layer" />
        <View style={{ gap: 10 }}>
          {t.stack.map((layer) => {
            const open = openLayer === layer.layer;
            return (
              <Card key={layer.layer} style={{ padding: 0, overflow: 'hidden' }}>
                <Pressy onPress={() => setOpenLayer(open ? null : layer.layer)} style={styles.layerHead}>
                  <View style={styles.layerIcon}>
                    <Ionicons name={LAYER_ICON[layer.layer] ?? 'cube-outline'} size={17} color={C.cyan} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Txt variant="heading" style={{ fontSize: 16 }}>
                      {layer.layer}
                    </Txt>
                    <Txt variant="small" numberOfLines={1}>
                      {layer.items.map((i) => i.name).join(' · ')}
                    </Txt>
                  </View>
                  <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={C.textDim} />
                </Pressy>
                {open && (
                  <View style={styles.items}>
                    {layer.items.map((item) => (
                      <View key={item.name} style={styles.item}>
                        <View style={styles.itemHead}>
                          <Txt style={{ fontFamily: F.display, fontSize: 15, flexShrink: 1 }}>{item.name}</Txt>
                          <Chip
                            label={item.confidence === 'confirmed' ? 'CONFIRMED' : 'LIKELY'}
                            color={item.confidence === 'confirmed' ? C.mint : C.amber}
                            icon={item.confidence === 'confirmed' ? 'checkmark' : 'help'}
                          />
                        </View>
                        <Txt style={styles.role}>{item.role}</Txt>
                        <Txt variant="dim">{item.beginnerNote}</Txt>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export function LiveScan({ scan, loading }: { scan?: ScanResult | null; loading: boolean }) {
  return (
    <Card style={{ borderColor: `${C.mint}55`, gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ionicons name="pulse" size={16} color={C.mint} />
        <Txt variant="label" style={{ color: C.mint, flex: 1 }}>
          Live scan
        </Txt>
        {scan?.elapsedMs != null && <Txt style={styles.pct}>{scan.elapsedMs} ms</Txt>}
      </View>
      {loading && <Txt variant="dim">Knocking on the site’s front door and reading its headers…</Txt>}
      {scan && !scan.ok && <Txt variant="dim">{scan.error ?? 'Scan unavailable'}. The teardown uses public knowledge instead.</Txt>}
      {scan?.ok && (
        <>
          <Txt variant="dim">
            We loaded <Txt style={styles.code}>{scan.finalUrl ?? scan.url}</Txt> the way a browser does and looked for
            fingerprints. Here’s what gave it away:
          </Txt>
          {scan.detections.length === 0 && <Txt variant="dim">No well-known fingerprints. This site hides its tracks well.</Txt>}
          {scan.detections.map((d) => (
            <View key={d.name} style={styles.detection}>
              <Ionicons name="finger-print" size={16} color={C.cyan} style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Txt style={{ fontFamily: F.displayMedium }}>{d.name}</Txt>
                  <Chip label={d.category.toUpperCase()} color={C.textDim} />
                </View>
                <Txt variant="small" style={{ marginTop: 2 }}>
                  Evidence: {d.evidence}
                </Txt>
                {OFFLINE.packs.find((p) => p.detection === d.name)?.stackItems[0] && (
                  <Txt variant="small" style={{ marginTop: 2, color: C.textFaint }}>
                    {OFFLINE.packs.find((p) => p.detection === d.name)!.stackItems[0].beginnerNote}
                  </Txt>
                )}
              </View>
            </View>
          ))}
          {scan.headers.length > 0 && (
            <View style={styles.headers}>
              {scan.headers.slice(0, 6).map((h) => (
                <Txt key={h.name} style={styles.headerLine} numberOfLines={1}>
                  <Txt style={{ color: C.cyan, fontFamily: F.mono, fontSize: 11.5 }}>{h.name}</Txt>: {h.value}
                </Txt>
              ))}
            </View>
          )}
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden', gap: 2 },
  langRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  swatch: { width: 12, height: 12, borderRadius: 4, marginTop: 5 },
  pct: { fontFamily: F.mono, fontSize: 12, color: C.textDim },
  layerHead: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  layerIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: `${C.cyan}14`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  items: { borderTopWidth: 1, borderTopColor: C.line, padding: 14, gap: 16 },
  item: { gap: 3 },
  itemHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  role: { fontFamily: F.mono, fontSize: 12, color: C.cyan },
  code: { fontFamily: F.mono, fontSize: 13, color: C.text },
  detection: { flexDirection: 'row', gap: 10 },
  headers: { backgroundColor: C.bg, borderRadius: 10, padding: 10, gap: 4 },
  headerLine: { fontFamily: F.mono, fontSize: 11.5, color: C.textDim },
});
