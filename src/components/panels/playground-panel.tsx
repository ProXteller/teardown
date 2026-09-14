import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, View, type GestureResponderEvent } from 'react-native';

import { PreviewFrame, type PreviewHandle } from '@/components/preview-frame';
import { Button, Card, Chip, Ionicons, Pressy, Txt } from '@/components/ui';
import { C, F, visibleBrand } from '@/constants/theme';
import type { Teardown } from '@/data/types';
import {
  buildPreview,
  lineText,
  parseTweaks,
  setEditableText,
  setTweak,
  type PreviewMessage,
  type Tweak,
} from '@/lib/playground';
import { updateWorkspace, useWorkspace } from '@/lib/workspace';

type Tab = 'tweak' | 'code' | 'challenges';

const SWATCHES = ['#FF3B6B', '#FF9F1C', '#FFD60A', '#1DB954', '#25D366', '#00C2FF', '#5865F2', '#A78BFA', '#E50914', '#FFFFFF', '#121212', '#000000'];

export function PlaygroundPanel({ t }: { t: Teardown }) {
  const brand = visibleBrand(t.brandColor, t.accentColor);
  const original = t.playground.html;
  // Code lives in the shared workspace so the Ask Teardown agent can edit it too
  const ws = useWorkspace(t.id);
  const code = ws.base === original && ws.code !== undefined ? ws.code : original;
  const [previewHtml, setPreviewHtml] = useState(() => buildPreview(code, false));
  const [tab, setTab] = useState<Tab>('tweak');
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState<{ text: string; detail: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Set<number>>(new Set());
  const frame = useRef<PreviewHandle>(null);
  const editModeRef = useRef(editMode);
  editModeRef.current = editMode;
  const codeRef = useRef(code);
  codeRef.current = code;
  const setCode = (next: string) => {
    codeRef.current = next;
    updateWorkspace(t.id, { base: original, code: next });
  };
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const tweaks = useMemo(() => parseTweaks(code), [code]);
  const dirty = code !== original;

  // A different playground was loaded (e.g. the teardown was rebuilt): show it
  const firstOriginal = useRef(original);
  useEffect(() => {
    if (firstOriginal.current === original) return;
    firstOriginal.current = original;
    setPreviewHtml(buildPreview(codeRef.current, editModeRef.current));
    setDone(new Set());
  }, [original]);

  // The agent (or reset) changed the code from outside the editor: reload the preview and say what changed
  const seenRev = useRef(ws.codeRev);
  useEffect(() => {
    // Opened because of that change (the agent switched tabs): still show what changed
    if (ws.lastChange && Date.now() - ws.lastChange.at < 2500) showToast(ws.lastChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (ws.codeRev === seenRev.current) return;
    seenRev.current = ws.codeRev;
    setPreviewHtml(buildPreview(codeRef.current, editModeRef.current));
    setError(null);
    if (ws.lastChange) showToast(ws.lastChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws.codeRev]);

  function showToast(next: { text: string; detail: string }) {
    clearTimeout(toastTimer.current);
    setToast(next);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  function flash(text: string, line: number, source: string) {
    showToast({ text, detail: line ? `line ${line}: ${lineText(source, line)}` : '' });
  }

  /** code → preview (typing reloads the preview after a short pause) */
  function onType(next: string) {
    setCode(next);
    setError(null);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setPreviewHtml(buildPreview(next, editModeRef.current)), 450);
  }

  /** controls → code + live preview (no reload, so the screen keeps its state) */
  function onTweak(tweak: Tweak, value: string) {
    const result = setTweak(codeRef.current, tweak.name, value);
    setCode(result.code);
    frame.current?.send({ type: 'setVar', name: tweak.name, value });
    flash(`${tweak.label} → ${value}`, result.line, result.code);
  }

  /** preview → code (text edited directly on the rendered screen) */
  function onPreviewMessage(msg: PreviewMessage) {
    if (msg.type === 'edit') {
      const result = setEditableText(codeRef.current, msg.key, msg.text);
      if (result.line) {
        setCode(result.code);
        flash(`Screen edit rewrote the code`, result.line, result.code);
      }
    } else if (msg.type === 'error') {
      setError(msg.message);
    } else if (msg.type === 'ready') {
      setError(null);
    }
  }

  function toggleEdit() {
    const on = !editMode;
    setEditMode(on);
    frame.current?.send({ type: 'edit-mode', on });
  }

  function reset() {
    codeRef.current = original;
    updateWorkspace(t.id, (w) => ({ base: original, code: undefined, codeRev: w.codeRev + 1, lastChange: { text: 'Reset to the original', detail: '', at: Date.now() } }));
  }

  return (
    <View style={{ gap: 16 }}>
      <View style={{ gap: 4 }}>
        <Txt variant="label" style={{ color: C.pink }}>
          Playground
        </Txt>
        <Txt variant="title" style={{ fontSize: 22 }}>
          {t.playground.title}
        </Txt>
        <Txt variant="dim">{t.playground.description}</Txt>
      </View>

      <View style={styles.howRow}>
        <HowStep icon="options-outline" text="Drag a control" />
        <Ionicons name="arrow-forward" size={12} color={C.textFaint} />
        <HowStep icon="create-outline" text="Edit the code" />
        <Ionicons name="swap-horizontal" size={12} color={C.textFaint} />
        <HowStep icon="hand-left-outline" text="Or type on the screen" />
      </View>

      <View style={[styles.device, { borderColor: `${brand}66`, height: tab === 'code' ? 380 : 560 }]}>
        <View style={styles.deviceBar}>
          <View style={styles.notch} />
        </View>
        <View style={{ flex: 1, overflow: 'hidden', borderBottomLeftRadius: 26, borderBottomRightRadius: 26 }}>
          {code.trim() ? <PreviewFrame ref={frame} html={previewHtml} onMessage={onPreviewMessage} /> : null}
        </View>
        {toast && (
          <View style={styles.toast}>
            <Txt style={styles.toastText}>{toast.text}</Txt>
            {!!toast.detail && (
              <Txt style={styles.toastDetail} numberOfLines={1}>
                {toast.detail}
              </Txt>
            )}
          </View>
        )}
      </View>

      <View style={styles.actionRow}>
        <Pressy onPress={toggleEdit} style={[styles.editToggle, editMode && { backgroundColor: C.cyan, borderColor: C.cyan }]}>
          <Ionicons name={editMode ? 'checkmark' : 'hand-left-outline'} size={15} color={editMode ? C.bg : C.cyan} />
          <Txt style={[styles.editToggleText, editMode && { color: C.bg }]}>
            {editMode ? 'Editing on screen: tap outlined text' : 'Edit text on the screen'}
          </Txt>
        </Pressy>
        <Pressy onPress={reset} disabled={!dirty} style={[styles.resetBtn, !dirty && { opacity: 0.35 }]}>
          <Ionicons name="refresh" size={16} color={C.textDim} />
        </Pressy>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Ionicons name="bug-outline" size={15} color={C.red} />
          <Txt style={{ color: C.red, flex: 1, fontFamily: F.mono, fontSize: 12 }}>JavaScript error: {error}</Txt>
        </View>
      )}

      <View style={styles.tabs}>
        {(
          [
            ['tweak', 'Controls', 'options'],
            ['code', 'Code', 'code-slash'],
            ['challenges', 'Challenges', 'trophy'],
          ] as const
        ).map(([key, label, icon]) => (
          <Pressy key={key} onPress={() => setTab(key)} style={[styles.tab, tab === key && styles.tabOn]}>
            <Ionicons name={icon} size={14} color={tab === key ? C.text : C.textDim} />
            <Txt style={[styles.tabText, tab === key && { color: C.text }]}>{label}</Txt>
          </Pressy>
        ))}
      </View>

      {tab === 'tweak' && (
        <Card style={{ gap: 18 }}>
          {tweaks.length === 0 && <Txt variant="dim">No tweakable variables found. Add one in the Code tab!</Txt>}
          {tweaks.map((tw) =>
            tw.type === 'color' ? (
              <ColorControl key={tw.name} tweak={tw} onChange={(v) => onTweak(tw, v)} />
            ) : (
              <RangeControl key={tw.name} tweak={tw} color={brand} onChange={(v) => onTweak(tw, v)} />
            ),
          )}
          <Txt variant="small" style={{ color: C.textFaint }}>
            Each control is a CSS variable in the code marked with <Txt style={styles.inlineCode}>/* @tweak */</Txt>. Move one
            and watch the matching line change in the Code tab.
          </Txt>
        </Card>
      )}

      {tab === 'code' && (
        <View style={styles.editorWrap}>
          <View style={styles.editorHead}>
            <Txt style={styles.editorFile}>index.html</Txt>
            {dirty && <Chip label="EDITED" color={C.amber} />}
            <Txt variant="small" style={{ marginLeft: 'auto', color: C.textFaint }}>
              {code.split('\n').length} lines · live
            </Txt>
          </View>
          <TextInput
            value={code}
            onChangeText={onType}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            textAlignVertical="top"
            scrollEnabled={false}
            style={styles.editor}
          />
        </View>
      )}

      {tab === 'challenges' && (
        <View style={{ gap: 8 }}>
          {t.playground.challenges.map((c, i) => {
            const isDone = done.has(i);
            return (
              <Pressy
                key={i}
                onPress={() => {
                  const next = new Set(done);
                  if (isDone) next.delete(i);
                  else next.add(i);
                  setDone(next);
                }}
                style={[styles.challenge, isDone && { borderColor: `${C.mint}88` }]}>
                <Ionicons name={isDone ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={isDone ? C.mint : C.textDim} />
                <Txt style={[{ flex: 1, lineHeight: 21 }, isDone && { color: C.textDim, textDecorationLine: 'line-through' }]}>
                  {c}
                </Txt>
              </Pressy>
            );
          })}
          <Txt variant="small" style={{ color: C.textFaint, marginTop: 4 }}>
            {done.size}/{t.playground.challenges.length} complete
          </Txt>
          {done.size === t.playground.challenges.length && t.playground.challenges.length > 0 && (
            <Button title="You remixed it. Nice work!" icon="trophy" color={C.mint} />
          )}
        </View>
      )}
    </View>
  );
}

function HowStep({ icon, text }: { icon: 'options-outline' | 'create-outline' | 'hand-left-outline'; text: string }) {
  return (
    <View style={styles.howStep}>
      <Ionicons name={icon} size={12} color={C.textDim} />
      <Txt variant="small" style={{ fontSize: 11 }}>
        {text}
      </Txt>
    </View>
  );
}

function ColorControl({ tweak, onChange }: { tweak: Tweak; onChange: (v: string) => void }) {
  const [draft, setDraft] = useState(tweak.value);
  useEffect(() => setDraft(tweak.value), [tweak.value]);
  return (
    <View style={{ gap: 8 }}>
      <View style={styles.controlHead}>
        <Txt style={styles.controlLabel}>{tweak.label}</Txt>
        <Txt style={styles.varName}>{tweak.name}</Txt>
      </View>
      <View style={styles.swatchRow}>
        {SWATCHES.map((s) => (
          <Pressy
            key={s}
            onPress={() => onChange(s)}
            style={[
              styles.swatch,
              { backgroundColor: s },
              tweak.value.toLowerCase() === s.toLowerCase() && { borderColor: C.cyan, borderWidth: 2.5 },
            ]}
          />
        ))}
      </View>
      <View style={styles.hexRow}>
        <View style={[styles.hexPreview, { backgroundColor: tweak.value }]} />
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={() => /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(draft.trim()) && onChange(draft.trim())}
          onBlur={() => /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(draft.trim()) && draft.trim() !== tweak.value && onChange(draft.trim())}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.hexInput}
        />
      </View>
    </View>
  );
}

function RangeControl({ tweak, color, onChange }: { tweak: Tweak; color: string; onChange: (v: string) => void }) {
  const unit = tweak.value.replace(/^-?[\d.]+/, '') || 'px';
  const current = parseFloat(tweak.value) || 0;
  const [width, setWidth] = useState(1);
  const span = tweak.max - tweak.min || 1;
  const ratio = Math.min(1, Math.max(0, (current - tweak.min) / span));
  const last = useRef(current);

  function handle(e: GestureResponderEvent) {
    const x = e.nativeEvent.locationX;
    const next = Math.round(tweak.min + Math.min(1, Math.max(0, x / width)) * span);
    if (next !== last.current) {
      last.current = next;
      onChange(`${next}${unit}`);
    }
  }

  return (
    <View style={{ gap: 8 }}>
      <View style={styles.controlHead}>
        <Txt style={styles.controlLabel}>{tweak.label}</Txt>
        <Txt style={styles.varName}>
          {tweak.name}: <Txt style={{ color: C.text, fontFamily: F.monoBold, fontSize: 11.5 }}>{tweak.value}</Txt>
        </Txt>
      </View>
      <View
        style={styles.sliderHit}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={handle}
        onResponderMove={handle}>
        <View pointerEvents="none" style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${ratio * 100}%`, backgroundColor: color }]} />
        </View>
        <View pointerEvents="none" style={[styles.sliderThumb, { left: ratio * width - 11, borderColor: color }]} />
      </View>
      <View style={styles.rangeEnds}>
        <Txt variant="small" style={{ fontSize: 10.5 }}>
          {tweak.min}
          {unit}
        </Txt>
        <Txt variant="small" style={{ fontSize: 10.5 }}>
          {tweak.max}
          {unit}
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  howRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  howStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.card,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  device: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 390,
    borderRadius: 34,
    borderWidth: 2,
    padding: 6,
    backgroundColor: '#02040A',
  },
  deviceBar: { height: 22, alignItems: 'center', justifyContent: 'center' },
  notch: { width: 90, height: 6, borderRadius: 3, backgroundColor: C.line },
  toast: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    backgroundColor: 'rgba(7,11,22,0.94)',
    borderWidth: 1,
    borderColor: `${C.cyan}88`,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  toastText: { fontFamily: F.displayMedium, fontSize: 13, color: C.cyan },
  toastDetail: { fontFamily: F.mono, fontSize: 10.5, color: C.textDim, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 8, alignSelf: 'center', width: '100%', maxWidth: 390 },
  editToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: `${C.cyan}66`,
    borderRadius: 14,
    paddingVertical: 11,
  },
  editToggleText: { fontFamily: F.displayMedium, fontSize: 13.5, color: C.cyan },
  resetBtn: {
    width: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: `${C.red}14`,
    borderColor: `${C.red}55`,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  tabs: { flexDirection: 'row', backgroundColor: C.bgRaised, borderRadius: 14, padding: 4, gap: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9, borderRadius: 10 },
  tabOn: { backgroundColor: C.cardHi },
  tabText: { fontFamily: F.displayMedium, fontSize: 13, color: C.textDim },
  controlHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  controlLabel: { fontFamily: F.displayMedium, fontSize: 14.5 },
  varName: { fontFamily: F.mono, fontSize: 11.5, color: C.textFaint },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  swatch: { width: 28, height: 28, borderRadius: 9, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  hexRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hexPreview: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: C.lineHi },
  hexInput: {
    flex: 1,
    fontFamily: F.mono,
    fontSize: 13,
    color: C.text,
    backgroundColor: C.bgRaised,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: C.line,
  },
  sliderHit: { height: 30, justifyContent: 'center' },
  sliderTrack: { height: 6, borderRadius: 3, backgroundColor: C.lineHi, overflow: 'hidden' },
  sliderFill: { height: 6 },
  sliderThumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.text,
    borderWidth: 3,
    top: 4,
  },
  rangeEnds: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 },
  inlineCode: { fontFamily: F.mono, fontSize: 11.5, color: C.cyan },
  editorWrap: { borderRadius: 16, borderWidth: 1, borderColor: C.line, overflow: 'hidden', backgroundColor: '#050810' },
  editorHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: C.bgRaised,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },
  editorFile: { fontFamily: F.mono, fontSize: 12, color: C.textDim },
  editor: {
    fontFamily: F.mono,
    fontSize: 12,
    lineHeight: 18,
    color: '#DCE3F5',
    padding: 12,
    minHeight: 420,
    outlineStyle: 'none',
  } as object,
  challenge: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: C.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.line,
    padding: 12,
  },
});
