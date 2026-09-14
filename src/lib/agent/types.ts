/**
 * "Ask Teardown" agent contract.
 *
 * The agent answers questions about ONE teardown and can drive the UI. It never touches the UI
 * directly: it returns a reply plus a list of actions, and the app applies them in order.
 * Two engines implement it with the same inputs and outputs:
 *   - src/lib/agent/local-agent.ts  → instant, offline, rule-based (no API key needed)
 *   - src/app/api/agent+api.ts      → Claude with tools (used when ANTHROPIC_API_KEY is set)
 */

import type { StackLayer, Teardown } from '@/data/types';
import type { TrackId } from '@/lib/roadmap/types';

export type TabKey = 'story' | 'stack' | 'system' | 'code' | 'play' | 'learn' | 'roadmap';

export type AgentAction =
  /** Switch the teardown screen to a tab */
  | { type: 'open_tab'; tab: TabKey }
  /** Open the System tab and select a node on the map (id from teardown.architecture.nodes) */
  | { type: 'highlight_node'; nodeId: string }
  /** Open the System tab and animate a request flow (id from teardown.architecture.flows) */
  | { type: 'play_flow'; flowId: string }
  /** Open the Code tab on a snippet (id from teardown.code) */
  | { type: 'show_code'; snippetId: string }
  /** Open the Stack tab with a layer expanded */
  | { type: 'open_stack_layer'; layer: StackLayer }
  /** Open the Learn tab with a concept expanded (term from teardown.concepts) */
  | { type: 'show_concept'; term: string }
  /** Change a playground CSS variable tagged with @tweak, e.g. { name: '--brand', value: '#501214' } */
  | { type: 'set_tweak'; name: string; value: string }
  /** Replace the plain text of a playground element with data-edit="key" */
  | { type: 'edit_text'; key: string; text: string }
  /** Replace the whole playground document (must still follow PLAYGROUND_CONTRACT) */
  | { type: 'set_playground_code'; code: string; summary: string }
  /** Restore the playground to its original code */
  | { type: 'reset_playground' }
  /** Open the Roadmap tab, optionally for a career track (software, web, mobile, cybersecurity, data-ai, cloud-devops, game, uiux, explore) */
  | { type: 'open_roadmap'; track?: TrackId };

export interface AgentMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface AgentRequest {
  teardown: Teardown;
  /** Current playground source; may differ from teardown.playground.html after the user's edits */
  playgroundCode: string;
  /** Tab the user is currently looking at */
  tab: TabKey;
  /** Conversation so far, oldest first. The last item is the new user message. */
  messages: AgentMessage[];
}

export interface AgentReply {
  /**
   * Reply shown in the chat. Plain text with light formatting only:
   *   lines starting with "• " are bullets, `backticks` render as code, **double asterisks** render bold.
   * Keep it short and friendly for a beginner (roughly 40–120 words).
   */
  text: string;
  /** UI actions to apply, in order. Unknown ids are ignored by the app. */
  actions: AgentAction[];
  /** 2–4 short follow-up prompts the user can tap */
  suggestions: string[];
  source: 'local' | 'claude';
}
