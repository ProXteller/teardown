import { useSyncExternalStore } from 'react';

import type { StackLayer, Teardown } from '@/data/types';
import type { AgentAction, TabKey } from '@/lib/agent/types';
import { lineText, parseTweaks, setEditableText, setTweak } from '@/lib/playground';

/**
 * Per-teardown UI state that both the user and the Ask Teardown agent can drive:
 * which tab is open, what's selected on the system map, and the playground's edited code.
 */
export interface Workspace {
  tab: TabKey;
  /** The playground code this workspace's edits are based on */
  base?: string;
  /** Edited playground code; undefined means "use the original" */
  code?: string;
  /** Bumped when code changes outside the editor (agent, reset) so the preview reloads */
  codeRev: number;
  /** Last change made from outside the editor, shown as a toast in the playground */
  lastChange?: { text: string; detail: string; at: number };
  selectedNode: string | null;
  flow: { id: string; rev: number } | null;
  snippet: { id: string; rev: number } | null;
  layer: { name: StackLayer; rev: number } | null;
  concept: { term: string; rev: number } | null;
  /** Bumped on every agent action so the screen can scroll the panel into view */
  focusRev: number;
}

const initial = (): Workspace => ({
  tab: 'story',
  codeRev: 0,
  selectedNode: null,
  flow: null,
  snippet: null,
  layer: null,
  concept: null,
  focusRev: 0,
});

let spaces: Record<string, Workspace> = {};
const listeners = new Set<() => void>();
const EMPTY = initial();

export function getWorkspace(id: string): Workspace {
  return spaces[id] ?? EMPTY;
}

export function updateWorkspace(id: string, patch: Partial<Workspace> | ((w: Workspace) => Partial<Workspace>)) {
  const current = spaces[id] ?? initial();
  const next = { ...current, ...(typeof patch === 'function' ? patch(current) : patch) };
  spaces = { ...spaces, [id]: next };
  listeners.forEach((l) => l());
}

export function useWorkspace(id: string): Workspace {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => getWorkspace(id),
    () => getWorkspace(id),
  );
}

/** Current playground code for a teardown, including unsaved edits. */
export function currentCode(id: string, t: Teardown): string {
  const w = getWorkspace(id);
  return w.base === t.playground.html && w.code !== undefined ? w.code : t.playground.html;
}

function withCode(t: Teardown, w: Workspace, code: string | undefined, change: { text: string; detail: string }): Partial<Workspace> {
  return { base: t.playground.html, code, codeRev: w.codeRev + 1, lastChange: { ...change, at: Date.now() }, tab: 'play' };
}

/**
 * Applies agent actions in order and returns a short receipt for each one that worked.
 * Invalid ids, tweak names or keys are skipped rather than breaking the UI.
 */
export function applyAgentActions(t: Teardown, actions: AgentAction[]): string[] {
  const id = t.id;
  const receipts: string[] = [];
  for (const action of actions) {
    const w = getWorkspace(id);
    const code = currentCode(id, t);
    switch (action.type) {
      case 'open_tab':
        updateWorkspace(id, { tab: action.tab });
        receipts.push(`Opened ${TAB_NAMES[action.tab]}`);
        break;
      case 'highlight_node': {
        const node = t.architecture.nodes.find((n) => n.id === action.nodeId);
        if (!node) break;
        updateWorkspace(id, { tab: 'system', selectedNode: node.id, flow: null });
        receipts.push(`Highlighted ${node.label}`);
        break;
      }
      case 'play_flow': {
        const flow = t.architecture.flows.find((f) => f.id === action.flowId);
        if (!flow) break;
        updateWorkspace(id, { tab: 'system', selectedNode: null, flow: { id: flow.id, rev: (w.flow?.rev ?? 0) + 1 } });
        receipts.push(`Playing “${flow.title}”`);
        break;
      }
      case 'show_code': {
        const snippet = t.code.find((c) => c.id === action.snippetId);
        if (!snippet) break;
        updateWorkspace(id, { tab: 'code', snippet: { id: snippet.id, rev: (w.snippet?.rev ?? 0) + 1 } });
        receipts.push(`Opened ${snippet.file}`);
        break;
      }
      case 'open_stack_layer': {
        if (!t.stack.some((l) => l.layer === action.layer)) break;
        updateWorkspace(id, { tab: 'stack', layer: { name: action.layer, rev: (w.layer?.rev ?? 0) + 1 } });
        receipts.push(`Opened ${action.layer} stack`);
        break;
      }
      case 'show_concept': {
        const concept = t.concepts.find((c) => c.term.toLowerCase() === action.term.toLowerCase());
        if (!concept) break;
        updateWorkspace(id, { tab: 'learn', concept: { term: concept.term, rev: (w.concept?.rev ?? 0) + 1 } });
        receipts.push(`Explained ${concept.term}`);
        break;
      }
      case 'set_tweak': {
        const tweak = parseTweaks(code).find((tw) => tw.name === action.name);
        const valid = tweak && (tweak.type === 'color' ? /^#[0-9a-f]{3,8}$/i.test(action.value) : /^-?\d+(\.\d+)?px$/.test(action.value));
        if (!tweak || !valid) break;
        const result = setTweak(code, action.name, action.value);
        if (!result.line) break;
        updateWorkspace(id, withCode(t, w, result.code, { text: `${tweak.label} → ${action.value}`, detail: `line ${result.line}: ${lineText(result.code, result.line)}` }));
        receipts.push(`${action.name} → ${action.value}`);
        break;
      }
      case 'edit_text': {
        const result = setEditableText(code, action.key, action.text);
        if (!result.line) break;
        updateWorkspace(id, withCode(t, w, result.code, { text: `Rewrote “${action.key}”`, detail: `line ${result.line}: ${lineText(result.code, result.line)}` }));
        receipts.push(`Edited “${action.key}”`);
        break;
      }
      case 'set_playground_code': {
        if (!/<html|<!doctype/i.test(action.code)) break;
        updateWorkspace(id, withCode(t, w, action.code, { text: action.summary || 'Updated the code', detail: '' }));
        receipts.push(action.summary || 'Updated the code');
        break;
      }
      case 'reset_playground':
        updateWorkspace(id, withCode(t, w, undefined, { text: 'Reset to the original', detail: '' }));
        receipts.push('Reset the playground');
        break;
    }
  }
  if (receipts.length) updateWorkspace(id, (w) => ({ focusRev: w.focusRev + 1 }));
  return receipts;
}

export const TAB_NAMES: Record<TabKey, string> = {
  story: 'Story',
  stack: 'Stack',
  system: 'System',
  code: 'Code',
  play: 'Playground',
  learn: 'Learn',
};
