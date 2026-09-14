import * as Haptics from 'expo-haptics';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ionicons, Pressy, Txt } from '@/components/ui';
import { C, F, MaxWidth } from '@/constants/theme';
import type { Teardown } from '@/data/types';
import { clearChat, replayActions, sendAgentMessage, useChat, welcomeSuggestions, type ChatMessage } from '@/lib/agent/chat';

type Mode = 'closed' | 'peek' | 'open';

function tap() {
  if (Platform.OS !== 'web') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/** Floating "Ask Teardown" agent: answers questions about this teardown and drives the screen. */
export function AgentDock({ t }: { t: Teardown }) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const chat = useChat(t.id);
  const [mode, setMode] = useState<Mode>('closed');
  const [draft, setDraft] = useState('');
  const scroll = useRef<ScrollView>(null);
  const last = [...chat.messages].reverse().find((m) => m.role === 'assistant');
  const suggestions = last?.suggestions?.length ? last.suggestions : welcomeSuggestions(t);

  useEffect(() => {
    const timer = setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(timer);
  }, [chat.messages.length, chat.thinking, mode]);

  async function send(text: string) {
    if (!text.trim() || chat.thinking) return;
    tap();
    setDraft('');
    setMode('open');
    const reply = await sendAgentMessage(t, text);
    // If the agent changed the screen, shrink so the change is visible
    if (reply?.receipts?.length) {
      if (Platform.OS !== 'web') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setMode('peek');
    }
  }

  if (mode === 'closed') {
    return (
      <View pointerEvents="box-none" style={[styles.fabWrap, { bottom: insets.bottom + 18 }]}>
        <Pressy onPress={() => { tap(); setMode(last ? 'peek' : 'open'); }} style={styles.fab}>
          <View style={styles.fabIcon}>
            <Ionicons name="sparkles" size={16} color={C.bg} />
          </View>
          <Txt style={styles.fabText}>Ask Teardown</Txt>
        </Pressy>
      </View>
    );
  }

  const panelHeight = mode === 'open' ? Math.min(height * 0.66, 640) : 196;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      pointerEvents="box-none"
      style={StyleSheet.absoluteFill}>
      <View pointerEvents="box-none" style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={[styles.panel, { height: panelHeight + insets.bottom, paddingBottom: insets.bottom }]}>
          <Pressy onPress={() => setMode(mode === 'open' ? 'peek' : 'open')} style={styles.header}>
            <View style={styles.grabber} />
            <View style={styles.headerRow}>
              <View style={styles.avatar}>
                <Ionicons name="sparkles" size={15} color={C.bg} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt style={styles.title}>Ask Teardown</Txt>
                <Txt variant="small" numberOfLines={1}>
                  {chat.thinking ? 'Thinking…' : `Your guide to how ${t.name} is built`}
                </Txt>
              </View>
              {last?.source && (
                <View style={[styles.sourcePill, last.source === 'claude' && { borderColor: `${C.violet}88` }]}>
                  <Txt style={[styles.sourceText, last.source === 'claude' && { color: C.violet }]}>
                    {last.source === 'claude' ? 'CLAUDE' : 'BUILT-IN'}
                  </Txt>
                </View>
              )}
              {chat.messages.length > 0 && mode === 'open' && (
                <Pressy onPress={() => clearChat(t.id)} style={styles.iconBtn} accessibilityLabel="Clear chat">
                  <Ionicons name="trash-outline" size={16} color={C.textDim} />
                </Pressy>
              )}
              <Pressy onPress={() => setMode(mode === 'open' ? 'peek' : 'open')} style={styles.iconBtn} accessibilityLabel="Resize">
                <Ionicons name={mode === 'open' ? 'chevron-down' : 'chevron-up'} size={18} color={C.textDim} />
              </Pressy>
              <Pressy onPress={() => setMode('closed')} style={styles.iconBtn} accessibilityLabel="Close">
                <Ionicons name="close" size={18} color={C.textDim} />
              </Pressy>
            </View>
          </Pressy>

          {mode === 'peek' ? (
            <Pressy onPress={() => setMode('open')} style={{ flex: 1, paddingHorizontal: 14 }}>
              {last ? (
                <View style={{ gap: 8 }}>
                  <Receipts message={last} t={t} />
                  <Txt variant="dim" numberOfLines={3}>
                    {plain(last.text)}
                  </Txt>
                  <Txt style={styles.peekMore}>Tap to keep chatting</Txt>
                </View>
              ) : (
                <Txt variant="dim">Ask anything about {t.name}.</Txt>
              )}
            </Pressy>
          ) : (
            <>
              <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={styles.messages} keyboardShouldPersistTaps="handled">
                <Bubble role="assistant">
                  <Txt style={styles.msgText}>
                    Hi! I know how <Text style={styles.bold}>{t.name}</Text> is built. Ask me how anything works, or tell me what to
                    change in the playground, like “make it dark mode”.
                  </Txt>
                </Bubble>
                {chat.messages.map((m) =>
                  m.role === 'user' ? (
                    <Bubble key={m.id} role="user">
                      <Txt style={[styles.msgText, { color: C.bg }]}>{m.text}</Txt>
                    </Bubble>
                  ) : (
                    <Bubble key={m.id} role="assistant">
                      <Rich text={m.text} />
                      <Receipts message={m} t={t} />
                    </Bubble>
                  ),
                )}
                {chat.thinking && (
                  <Bubble role="assistant">
                    <Dots />
                  </Bubble>
                )}
              </ScrollView>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={{ flexGrow: 0 }}
                contentContainerStyle={styles.suggestions}>
                {suggestions.map((s) => (
                  <Pressy key={s} onPress={() => send(s)} style={styles.suggestion} disabled={chat.thinking}>
                    <Txt style={styles.suggestionText}>{s}</Txt>
                  </Pressy>
                ))}
              </ScrollView>

              <View style={styles.inputRow}>
                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  onSubmitEditing={() => send(draft)}
                  placeholder={`Ask about ${t.name} or say “make it blue”`}
                  placeholderTextColor={C.textFaint}
                  returnKeyType="send"
                  style={styles.input}
                  editable={!chat.thinking}
                />
                <Pressy onPress={() => send(draft)} disabled={!draft.trim() || chat.thinking} style={[styles.send, (!draft.trim() || chat.thinking) && { opacity: 0.4 }]}>
                  <Ionicons name="arrow-up" size={18} color={C.bg} />
                </Pressy>
              </View>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: ReactNode }) {
  return <View style={[styles.bubble, role === 'user' ? styles.userBubble : styles.botBubble]}>{children}</View>;
}

function Receipts({ message, t }: { message: ChatMessage; t: Teardown }) {
  if (!message.receipts?.length) return null;
  return (
    <View style={styles.receipts}>
      {message.receipts.slice(0, 4).map((r, i) => (
        <View key={`${r}-${i}`} style={styles.receipt}>
          <Ionicons name="checkmark-circle" size={13} color={C.mint} />
          <Txt style={styles.receiptText} numberOfLines={1}>
            {r}
          </Txt>
        </View>
      ))}
      <Pressy onPress={() => replayActions(t, message)} style={styles.replay}>
        <Ionicons name="eye-outline" size={13} color={C.cyan} />
        <Txt style={styles.replayText}>Show me again</Txt>
      </Pressy>
    </View>
  );
}

/** Renders the agent's light formatting: "• " bullets, `code`, **bold**. */
function Rich({ text }: { text: string }) {
  const lines = text.split('\n').filter((l, i, all) => l.trim() || (i > 0 && all[i - 1].trim()));
  return (
    <View style={{ gap: 4 }}>
      {lines.map((line, i) => {
        const bullet = /^\s*(•|-|\*|\d+\.)\s+/.exec(line);
        const content = bullet ? line.slice(bullet[0].length) : line;
        if (!content.trim()) return <View key={i} style={{ height: 4 }} />;
        return (
          <View key={i} style={{ flexDirection: 'row', gap: 6 }}>
            {bullet && <Txt style={[styles.msgText, { color: C.cyan }]}>{/\d/.test(bullet[1]) ? bullet[1] : '•'}</Txt>}
            <Txt style={[styles.msgText, { flex: 1 }]}>
              {content.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, j) => (
                <Fragment key={j}>
                  {part.startsWith('`') && part.endsWith('`') ? (
                    <Text style={styles.inlineCode}>{part.slice(1, -1)}</Text>
                  ) : part.startsWith('**') && part.endsWith('**') ? (
                    <Text style={styles.bold}>{part.slice(2, -2)}</Text>
                  ) : (
                    part
                  )}
                </Fragment>
              ))}
            </Txt>
          </View>
        );
      })}
    </View>
  );
}

const plain = (text: string) => text.replace(/\*\*|`/g, '').replace(/\n+/g, ' ');

function Dots() {
  const values = useRef([0, 1, 2].map(() => new Animated.Value(0.3))).current;
  useEffect(() => {
    const loops = values.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(v, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(v, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [values]);
  return (
    <View style={{ flexDirection: 'row', gap: 5, paddingVertical: 4 }}>
      {values.map((v, i) => (
        <Animated.View key={i} style={[styles.dot, { opacity: v }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fabWrap: { position: 'absolute', right: 16, left: 16, alignItems: 'flex-end' },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: `${C.cyan}88`,
    borderRadius: 999,
    paddingLeft: 6,
    paddingRight: 16,
    paddingVertical: 6,
    shadowColor: C.cyan,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  fabIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.cyan, alignItems: 'center', justifyContent: 'center' },
  fabText: { fontFamily: F.display, fontSize: 15, color: C.text },
  panel: {
    width: '100%',
    maxWidth: MaxWidth,
    alignSelf: 'center',
    backgroundColor: C.bgRaised,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: `${C.cyan}55`,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -6 },
    elevation: 16,
    overflow: 'hidden',
  },
  header: { paddingHorizontal: 14, paddingBottom: 10 },
  grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: C.lineHi, marginTop: 8, marginBottom: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 32, height: 32, borderRadius: 11, backgroundColor: C.cyan, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: F.display, fontSize: 16, color: C.text },
  sourcePill: { borderWidth: 1, borderColor: C.lineHi, borderRadius: 999, paddingHorizontal: 7, paddingVertical: 2 },
  sourceText: { fontFamily: F.monoBold, fontSize: 9.5, color: C.textDim, letterSpacing: 0.6 },
  iconBtn: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  peekMore: { fontFamily: F.displayMedium, fontSize: 12.5, color: C.cyan },
  messages: { paddingHorizontal: 14, paddingBottom: 12, gap: 10 },
  bubble: { maxWidth: '88%', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 9 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: C.cyan, borderBottomRightRadius: 5 },
  botBubble: { alignSelf: 'flex-start', backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderBottomLeftRadius: 5 },
  msgText: { fontFamily: F.body, fontSize: 14.5, lineHeight: 21, color: C.text },
  bold: { fontFamily: F.display },
  inlineCode: { fontFamily: F.mono, fontSize: 12.5, color: C.mint },
  receipts: { marginTop: 8, gap: 5 },
  receipt: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  receiptText: { fontFamily: F.mono, fontSize: 11.5, color: C.mint, flexShrink: 1 },
  replay: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2, alignSelf: 'flex-start' },
  replayText: { fontFamily: F.displayMedium, fontSize: 12, color: C.cyan },
  suggestions: { paddingHorizontal: 14, paddingBottom: 8, gap: 8 },
  suggestion: { borderWidth: 1, borderColor: `${C.cyan}55`, backgroundColor: C.card, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  suggestionText: { fontFamily: F.displayMedium, fontSize: 13, color: C.text },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingBottom: 10 },
  input: {
    flex: 1,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: C.text,
    fontFamily: F.body,
    fontSize: 15,
    outlineStyle: 'none',
  } as object,
  send: { width: 42, height: 42, borderRadius: 14, backgroundColor: C.cyan, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.cyan },
});
