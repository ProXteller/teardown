import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Card, Chip, Ionicons, Pressy, SectionTitle, Txt, type IconName } from '@/components/ui';
import { C, F, KIND_STYLE, TIER_LABELS, visibleBrand } from '@/constants/theme';
import type { ArchNode, Teardown } from '@/data/types';
import { updateWorkspace, useWorkspace } from '@/lib/workspace';

const NODE_H = 70;
const ROW_GAP = 50;
const LABEL_H = 20;
const PAD = 6;
const GAP = 8;
const STEP_MS = 3400;

interface Box {
  node: ArchNode;
  x: number;
  y: number;
  w: number;
}

interface Row {
  tier: number;
  y: number;
  showLabel: boolean;
}

function layout(nodes: ArchNode[], width: number) {
  const byTier = new Map<number, ArchNode[]>();
  nodes.forEach((n) => byTier.set(n.tier, [...(byTier.get(n.tier) ?? []), n]));
  const boxes = new Map<string, Box>();
  const rows: Row[] = [];
  // Phones get at most 3 boxes per row so labels stay readable
  const perRow = width < 440 ? 3 : 4;
  let y = 0;
  [...byTier.keys()]
    .sort((a, b) => a - b)
    .forEach((tier) => {
      const tierNodes = byTier.get(tier)!;
      for (let start = 0; start < tierNodes.length; start += perRow) {
        const chunk = tierNodes.slice(start, start + perRow);
        const showLabel = start === 0;
        if (showLabel) y += LABEL_H;
        rows.push({ tier, y, showLabel });
        const w = Math.min(170, (width - PAD * 2 - GAP * (chunk.length - 1)) / chunk.length);
        const rowWidth = w * chunk.length + GAP * (chunk.length - 1);
        const x0 = (width - rowWidth) / 2;
        chunk.forEach((node, i) => boxes.set(node.id, { node, x: x0 + i * (w + GAP), y, w }));
        y += NODE_H + ROW_GAP;
      }
    });
  return { boxes, rows, height: Math.max(0, y - ROW_GAP + 8) };
}

type Geometry =
  | { kind: 'cubic'; p0: [number, number]; p1: [number, number]; p2: [number, number]; p3: [number, number] }
  | { kind: 'quad'; p0: [number, number]; p1: [number, number]; p2: [number, number] };

function geometry(a: Box, b: Box): Geometry {
  const ax = a.x + a.w / 2;
  const bx = b.x + b.w / 2;
  if (Math.abs(a.y - b.y) < 1) {
    const y = a.y + NODE_H;
    return { kind: 'quad', p0: [ax, y], p1: [(ax + bx) / 2, y + ROW_GAP * 0.55], p2: [bx, y] };
  }
  const down = b.y > a.y;
  const y1 = down ? a.y + NODE_H : a.y;
  const y2 = down ? b.y : b.y + NODE_H;
  const bend = (y2 - y1) / 2;
  return { kind: 'cubic', p0: [ax, y1], p1: [ax, y1 + bend], p2: [bx, y2 - bend], p3: [bx, y2] };
}

function toPath(g: Geometry) {
  return g.kind === 'cubic'
    ? `M${g.p0} C${g.p1} ${g.p2} ${g.p3}`
    : `M${g.p0} Q${g.p1} ${g.p2}`;
}

function pointAt(g: Geometry, t: number): [number, number] {
  const u = 1 - t;
  if (g.kind === 'quad') {
    return [
      u * u * g.p0[0] + 2 * u * t * g.p1[0] + t * t * g.p2[0],
      u * u * g.p0[1] + 2 * u * t * g.p1[1] + t * t * g.p2[1],
    ];
  }
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * g.p0[0] + b * g.p1[0] + c * g.p2[0] + d * g.p3[0],
    a * g.p0[1] + b * g.p1[1] + c * g.p2[1] + d * g.p3[1],
  ];
}

export function SystemPanel({ t }: { t: Teardown }) {
  const brand = visibleBrand(t.brandColor, t.accentColor);
  const { nodes, edges, flows } = t.architecture;
  const [width, setWidth] = useState(0);
  const canvasWidth = Math.max(width, 340);
  const { boxes, rows, height } = useMemo(() => layout(nodes, canvasWidth), [nodes, canvasWidth]);

  // Selection is shared with the Ask Teardown agent
  const ws = useWorkspace(t.id);
  const selected = ws.selectedNode;
  const setSelected = (nodeId: string | null) => updateWorkspace(t.id, { selectedNode: nodeId });
  const [flowIndex, setFlowIndex] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const flow = flowIndex != null ? flows[flowIndex] : undefined;
  const activeStep = flow?.steps[step];

  // The agent asked to play a flow
  useEffect(() => {
    if (!ws.flow) return;
    const i = flows.findIndex((f) => f.id === ws.flow!.id);
    if (i < 0) return;
    setFlowIndex(i);
    setStep(0);
    setPlaying(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws.flow?.rev]);

  // The agent highlighted a node: stop any flow so the selection is visible
  useEffect(() => {
    if (ws.selectedNode) {
      setFlowIndex(null);
      setPlaying(false);
    }
  }, [ws.selectedNode]);

  // Moving "packet" along the active hop
  useEffect(() => {
    if (!activeStep) return;
    let raf = 0;
    const start = Date.now();
    const tick = () => {
      setProgress(((Date.now() - start) % 1400) / 1400);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activeStep]);

  // Autoplay through the flow
  useEffect(() => {
    if (!playing || !flow) return;
    const timer = setTimeout(() => {
      if (step < flow.steps.length - 1) setStep(step + 1);
      else setPlaying(false);
    }, STEP_MS);
    return () => clearTimeout(timer);
  }, [playing, flow, step]);

  const flowNodeIds = useMemo(() => new Set(flow?.steps.flatMap((s) => [s.from, s.to]) ?? []), [flow]);
  const activeIds = activeStep ? new Set([activeStep.from, activeStep.to]) : null;

  function chooseFlow(i: number) {
    if (flowIndex === i) {
      setFlowIndex(null);
      setPlaying(false);
      return;
    }
    setSelected(null);
    setFlowIndex(i);
    setStep(0);
    setPlaying(true);
  }

  const selectedNode = selected ? boxes.get(selected)?.node : undefined;
  const connections = selectedNode
    ? edges.filter((e) => e.from === selectedNode.id || e.to === selectedNode.id)
    : [];

  const kindsPresent = [...new Set(nodes.map((n) => n.kind))];
  const activeGeometry = activeStep && boxes.get(activeStep.from) && boxes.get(activeStep.to)
    ? geometry(boxes.get(activeStep.from)!, boxes.get(activeStep.to)!)
    : null;
  const packet = activeGeometry ? pointAt(activeGeometry, progress) : null;

  return (
    <View style={{ gap: 24 }}>
      <View>
        <SectionTitle label="Trace a request" title="Watch data move" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {flows.map((f, i) => {
            const on = flowIndex === i;
            return (
              <Pressy
                key={f.id}
                onPress={() => chooseFlow(i)}
                style={[styles.flowChip, on && { borderColor: brand, backgroundColor: `${brand}22` }]}>
                <Txt style={{ fontSize: 15 }}>{f.emoji}</Txt>
                <Txt style={[styles.flowChipText, on && { color: C.text }]}>{f.title}</Txt>
              </Pressy>
            );
          })}
        </ScrollView>

        {flow && activeStep && (
          <Card style={[styles.narration, { borderColor: `${brand}66` }]}>
            <View style={styles.narrationHead}>
              <Txt variant="label" style={{ color: brand, flexShrink: 0 }}>
                Step {step + 1}/{flow.steps.length}
              </Txt>
              <Txt style={styles.hop} numberOfLines={1}>
                {boxes.get(activeStep.from)?.node.label} → {boxes.get(activeStep.to)?.node.label}
              </Txt>
            </View>
            <Txt style={{ fontSize: 15, lineHeight: 22 }}>{activeStep.narration}</Txt>
            <View style={styles.progressDots}>
              {flow.steps.map((_, i) => (
                <Pressy
                  key={i}
                  onPress={() => {
                    setStep(i);
                    setPlaying(false);
                  }}
                  style={[styles.progressDot, { backgroundColor: i <= step ? brand : C.lineHi, flex: 1 }]}
                />
              ))}
            </View>
            <View style={styles.controls}>
              <ControlButton icon="play-skip-back" disabled={step === 0} onPress={() => { setStep(step - 1); setPlaying(false); }} />
              <ControlButton
                icon={playing ? 'pause' : step === flow.steps.length - 1 ? 'refresh' : 'play'}
                primary={brand}
                onPress={() => {
                  if (!playing && step === flow.steps.length - 1) setStep(0);
                  setPlaying(!playing);
                }}
              />
              <ControlButton
                icon="play-skip-forward"
                disabled={step === flow.steps.length - 1}
                onPress={() => { setStep(step + 1); setPlaying(false); }}
              />
            </View>
          </Card>
        )}
      </View>

      <View>
        <SectionTitle
          label="System map"
          title="Tap any box"
          right={
            <Txt variant="small" style={{ color: C.textFaint }}>
              {nodes.length} parts · {edges.length} links
            </Txt>
          }
        />
        <View style={styles.mapFrame} onLayout={(e) => setWidth(e.nativeEvent.layout.width - 2)}>
          {width > 0 && (
            <ScrollView horizontal scrollEnabled={canvasWidth > width} showsHorizontalScrollIndicator={false}>
              <View style={{ width: canvasWidth, height: height + 8, marginTop: 4 }}>
                <Svg width={canvasWidth} height={height} style={StyleSheet.absoluteFill}>
                  {edges.map((e, i) => {
                    const a = boxes.get(e.from);
                    const b = boxes.get(e.to);
                    if (!a || !b) return null;
                    const touchesSelected = selected && (e.from === selected || e.to === selected);
                    const inFlow = flow && flowNodeIds.has(e.from) && flowNodeIds.has(e.to);
                    const dim = (selected && !touchesSelected) || (flow && !inFlow);
                    return (
                      <Path
                        key={`${e.from}-${e.to}-${i}`}
                        d={toPath(geometry(a, b))}
                        stroke={touchesSelected ? C.cyan : C.lineHi}
                        strokeOpacity={dim ? 0.25 : 1}
                        strokeWidth={touchesSelected ? 2 : 1.3}
                        strokeDasharray={touchesSelected ? undefined : '4 4'}
                        fill="none"
                      />
                    );
                  })}
                  {activeGeometry && (
                    <>
                      <Path d={toPath(activeGeometry)} stroke={brand} strokeWidth={3} fill="none" strokeLinecap="round" />
                      {packet && (
                        <>
                          <Circle cx={packet[0]} cy={packet[1]} r={10} fill={brand} opacity={0.25} />
                          <Circle cx={packet[0]} cy={packet[1]} r={5} fill="#fff" />
                        </>
                      )}
                    </>
                  )}
                </Svg>

                {rows
                  .filter((r) => r.showLabel)
                  .map((r) => (
                    <Txt key={`label-${r.tier}`} variant="label" style={[styles.tierLabel, { top: r.y - LABEL_H + 2 }]}>
                      {`${r.tier} · ${TIER_LABELS[r.tier] ?? ''}`}
                    </Txt>
                  ))}

                {[...boxes.values()].map(({ node, x, y, w }) => {
                  const kind = KIND_STYLE[node.kind] ?? KIND_STYLE.service;
                  const isSelected = selected === node.id;
                  const isActive = activeIds?.has(node.id);
                  const dim = (flow && !flowNodeIds.has(node.id)) || (selected && !isSelected && !connections.some((c) => c.from === node.id || c.to === node.id));
                  return (
                    <Pressy
                      key={node.id}
                      onPress={() => {
                        setSelected(isSelected ? null : node.id);
                        setFlowIndex(null);
                        setPlaying(false);
                      }}
                      style={[
                        styles.node,
                        {
                          left: x,
                          top: y,
                          width: w,
                          borderColor: isActive ? brand : isSelected ? C.cyan : `${kind.color}55`,
                          backgroundColor: isActive ? `${brand}26` : isSelected ? `${C.cyan}1A` : C.card,
                          opacity: dim ? 0.35 : 1,
                        },
                      ]}>
                      <View style={[styles.nodeStripe, { backgroundColor: kind.color }]} />
                      <View style={styles.nodeTop}>
                        {w >= 120 && <Ionicons name={kind.icon as IconName} size={12} color={kind.color} />}
                        <Txt style={styles.nodeLabel} numberOfLines={w >= 120 ? 1 : 2}>
                          {node.label}
                        </Txt>
                      </View>
                      <Txt style={styles.nodeTech} numberOfLines={w >= 120 ? 3 : 2}>
                        {node.tech}
                      </Txt>
                    </Pressy>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>

        <View style={styles.legend}>
          {kindsPresent.map((k) => (
            <View key={k} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: KIND_STYLE[k]?.color ?? C.textDim }]} />
              <Txt variant="small" style={{ fontSize: 11 }}>
                {KIND_STYLE[k]?.label ?? k}
              </Txt>
            </View>
          ))}
        </View>
      </View>

      {selectedNode && (
        <Card style={{ gap: 10, borderColor: `${C.cyan}66` }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={[styles.detailIcon, { backgroundColor: `${KIND_STYLE[selectedNode.kind]?.color ?? C.cyan}22` }]}>
              <Ionicons
                name={(KIND_STYLE[selectedNode.kind]?.icon ?? 'cube-outline') as IconName}
                size={18}
                color={KIND_STYLE[selectedNode.kind]?.color ?? C.cyan}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Txt variant="heading">{selectedNode.label}</Txt>
              <Txt style={styles.detailTech}>{selectedNode.tech}</Txt>
            </View>
            <Chip label={(KIND_STYLE[selectedNode.kind]?.label ?? selectedNode.kind).toUpperCase()} color={KIND_STYLE[selectedNode.kind]?.color} />
          </View>
          <Txt style={{ lineHeight: 22 }}>{selectedNode.description}</Txt>
          {connections.length > 0 && (
            <View style={{ gap: 6 }}>
              <Txt variant="label">Connections</Txt>
              {connections.map((c, i) => {
                const outgoing = c.from === selectedNode.id;
                const other = boxes.get(outgoing ? c.to : c.from)?.node;
                return (
                  <Pressy key={i} onPress={() => other && setSelected(other.id)} style={styles.connection}>
                    <Ionicons name={outgoing ? 'arrow-forward' : 'arrow-back'} size={14} color={C.cyan} />
                    <Txt style={{ flex: 1, fontFamily: F.displayMedium }}>{other?.label}</Txt>
                    <Txt style={styles.edgeLabel}>{c.label}</Txt>
                  </Pressy>
                );
              })}
            </View>
          )}
        </Card>
      )}

      <FileTree files={t.files} />
    </View>
  );
}

function ControlButton({ icon, onPress, disabled, primary }: { icon: IconName; onPress: () => void; disabled?: boolean; primary?: string }) {
  return (
    <Pressy
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.control,
        primary ? { backgroundColor: primary, width: 52 } : null,
        disabled && { opacity: 0.3 },
      ]}>
      <Ionicons name={icon} size={18} color={primary ? '#fff' : C.text} />
    </Pressy>
  );
}

interface TreeNode {
  name: string;
  path: string;
  note?: string;
  children: Map<string, TreeNode>;
}

function FileTree({ files }: { files: Teardown['files'] }) {
  const root = useMemo(() => {
    const r: TreeNode = { name: '', path: '', children: new Map() };
    files.forEach((f) => {
      let cur = r;
      f.path.split('/').filter(Boolean).forEach((part, i, parts) => {
        const path = parts.slice(0, i + 1).join('/');
        if (!cur.children.has(part)) cur.children.set(part, { name: part, path, children: new Map() });
        cur = cur.children.get(part)!;
      });
      cur.note = f.note;
    });
    return r;
  }, [files]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const rows = useRef<{ node: TreeNode; depth: number }[]>([]);
  rows.current = [];
  const walk = (node: TreeNode, depth: number) => {
    [...node.children.values()]
      .sort((a, b) => Number(b.children.size > 0) - Number(a.children.size > 0) || a.name.localeCompare(b.name))
      .forEach((child) => {
        rows.current.push({ node: child, depth });
        if (child.children.size > 0 && !collapsed.has(child.path)) walk(child, depth + 1);
      });
  };
  walk(root, 0);

  if (files.length === 0) return null;
  return (
    <View>
      <SectionTitle label="Project files" title="How the code might be organized" />
      <Card style={{ paddingVertical: 10, paddingHorizontal: 10, backgroundColor: C.bgRaised }}>
        {rows.current.map(({ node, depth }) => {
          const folder = node.children.size > 0;
          const open = !collapsed.has(node.path);
          return (
            <Pressy
              key={node.path}
              disabled={!folder}
              onPress={() => {
                const next = new Set(collapsed);
                if (open) next.add(node.path);
                else next.delete(node.path);
                setCollapsed(next);
              }}
              style={[styles.treeRow, { paddingLeft: 6 + depth * 16 }]}>
              <Ionicons
                name={folder ? (open ? 'folder-open' : 'folder') : 'document-text-outline'}
                size={14}
                color={folder ? C.amber : C.textDim}
                style={{ marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Txt style={[styles.treeName, folder && { color: C.text }]}>{node.name}</Txt>
                {node.note && !folder && <Txt variant="small">{node.note}</Txt>}
              </View>
            </Pressy>
          );
        })}
      </Card>
      <Txt variant="small" style={{ color: C.textFaint, marginTop: 8 }}>
        Illustrative structure to show how responsibilities split up, not the private repository.
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  flowChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.card,
  },
  flowChipText: { fontFamily: F.displayMedium, fontSize: 13.5, color: C.textDim },
  narration: { marginTop: 12, gap: 10 },
  narrationHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  hop: { fontFamily: F.mono, fontSize: 11.5, color: C.textDim, flexShrink: 1 },
  progressDots: { flexDirection: 'row', gap: 4 },
  progressDot: { height: 4, borderRadius: 2 },
  controls: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  control: {
    width: 42,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.cardHi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapFrame: {
    backgroundColor: C.bgRaised,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.line,
    paddingVertical: 10,
    overflow: 'hidden',
  },
  tierLabel: { position: 'absolute', left: 10, fontSize: 9.5 },
  node: {
    position: 'absolute',
    height: NODE_H,
    borderRadius: 12,
    borderWidth: 1.2,
    paddingHorizontal: 8,
    paddingTop: 7,
    overflow: 'hidden',
  },
  nodeStripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
  nodeTop: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  nodeLabel: { fontFamily: F.display, fontSize: 12, lineHeight: 14, color: C.text, flexShrink: 1 },
  nodeTech: { fontFamily: F.mono, fontSize: 9.5, lineHeight: 13, color: C.textDim, marginTop: 3 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  detailIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  detailTech: { fontFamily: F.mono, fontSize: 12, color: C.cyan },
  connection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.bgRaised,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  edgeLabel: { fontFamily: F.mono, fontSize: 11, color: C.textDim },
  treeRow: { flexDirection: 'row', gap: 8, paddingVertical: 5, paddingRight: 6 },
  treeName: { fontFamily: F.mono, fontSize: 12.5, color: C.textDim },
});
