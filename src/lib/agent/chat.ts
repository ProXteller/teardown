import { useSyncExternalStore } from 'react';

import type { Teardown } from '@/data/types';
import { aiAvailable, apiUrl } from '@/lib/store';
import { applyAgentActions, currentCode, getWorkspace } from '@/lib/workspace';

import { runLocalAgent, starterSuggestions } from './local-agent';
import type { AgentAction, AgentReply, AgentRequest } from './types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  actions?: AgentAction[];
  /** What actually happened in the UI, e.g. "Playing “You post a photo”" */
  receipts?: string[];
  suggestions?: string[];
  source?: AgentReply['source'];
  /** Web pages a live answer came from */
  sources?: { title: string; url: string }[];
}

interface Chat {
  messages: ChatMessage[];
  thinking: boolean;
}

const MAX_HISTORY = 12;
let chats: Record<string, Chat> = {};
const listeners = new Set<() => void>();
let counter = 0;

const EMPTY: Chat = { messages: [], thinking: false };

function setChat(id: string, fn: (c: Chat) => Chat) {
  chats = { ...chats, [id]: fn(chats[id] ?? EMPTY) };
  listeners.forEach((l) => l());
}

export function useChat(id: string): Chat {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => chats[id] ?? EMPTY,
    () => chats[id] ?? EMPTY,
  );
}

export function welcomeSuggestions(t: Teardown) {
  return starterSuggestions(t);
}

const UI_ACTIONS = new Set(['set_tweak', 'edit_text', 'set_playground_code', 'reset_playground', 'open_roadmap']);
const LIVE_QUESTION = /\b(latest|recent(ly)?|now|today|current(ly)?|news|this year|20[2-3]\d|update[sd]?|still|anymore|ceo|how many (users|people|employees)|revenue|valuation|price|pricing|acquired|lawsuit|outage)\b/i;

/**
 * Free-tier friendly routing: playground edits, roadmaps and questions about hand-checked apps stay on the
 * instant built-in agent; live questions and apps that weren't hand-checked go to the AI (which can search the web).
 */
function needsAi(t: Teardown, text: string, local: AgentReply) {
  if (local.actions.some((a) => UI_ACTIONS.has(a.type))) return false;
  if (LIVE_QUESTION.test(text)) return true;
  return t.source !== 'curated';
}

async function askAi(req: AgentRequest): Promise<AgentReply> {
  const res = await fetch(apiUrl('/api/agent'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`agent ${res.status}`);
  return (await res.json()) as AgentReply;
}

/** Sends a message to the agent and applies whatever it does to the teardown screen. */
export async function sendAgentMessage(t: Teardown, text: string): Promise<ChatMessage | undefined> {
  const clean = text.trim();
  if (!clean || (chats[t.id]?.thinking ?? false)) return;

  const user: ChatMessage = { id: `m${++counter}`, role: 'user', text: clean };
  setChat(t.id, (c) => ({ messages: [...c.messages, user], thinking: true }));

  const history = (chats[t.id]?.messages ?? []).slice(-MAX_HISTORY).map((m) => ({ role: m.role, text: m.text }));
  const req: AgentRequest = {
    teardown: t,
    playgroundCode: currentCode(t.id, t),
    tab: getWorkspace(t.id).tab,
    messages: history,
  };

  let reply: AgentReply;
  const local = runLocalAgent(req);
  try {
    reply = (await aiAvailable()) && needsAi(t, clean, local) ? await askAi(req) : local;
  } catch {
    // AI unreachable or rate limited: the built-in agent still answers
    reply = local;
  }
  if (reply.source === 'local') await new Promise((r) => setTimeout(r, 350)); // feels less abrupt than instant

  const receipts = applyAgentActions(t, reply.actions ?? []);
  const assistant: ChatMessage = {
    id: `m${++counter}`,
    role: 'assistant',
    text: reply.text,
    actions: reply.actions,
    receipts,
    suggestions: reply.suggestions?.slice(0, 4),
    source: reply.source,
    sources: (reply as AgentReply & { sources?: { title: string; url: string }[] }).sources?.slice(0, 5),
  };
  setChat(t.id, (c) => ({ messages: [...c.messages, assistant], thinking: false }));
  return assistant;
}

/** Re-applies an earlier answer's actions ("Show me again"). */
export function replayActions(t: Teardown, message: ChatMessage) {
  if (message.actions?.length) applyAgentActions(t, message.actions);
}

export function clearChat(id: string) {
  setChat(id, () => EMPTY);
}
