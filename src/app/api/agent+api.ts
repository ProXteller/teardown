import Anthropic from '@anthropic-ai/sdk';
import { betaZodTool } from '@anthropic-ai/sdk/helpers/beta/zod';

import {
  agentError as fail,
  agentSignal,
  appStateText,
  assembleReply,
  contextText,
  createSession,
  MAX_ITERATIONS,
  NO_ANSWER,
  readAgentRequest,
  systemPrompt,
  TOOL_LIMIT_NOTE,
  type AgentToolSpec,
} from '@/lib/agent/tool-runtime';
import type { AgentRequest } from '@/lib/agent/types';
import { GeminiError } from '@/lib/llm/gemini';
import { runGeminiAgent } from '@/lib/llm/gemini-agent';
import { aiProvider } from '@/lib/llm/provider';

/**
 * "Ask Teardown" with an AI engine: answers questions about one teardown and drives the UI through tools.
 * Tools run here on the server against a working copy of the playground and record AgentActions,
 * which the app applies in order (see src/lib/agent/types.ts). The provider-agnostic parts (validation,
 * prompt, tools, reply assembly) live in src/lib/agent/tool-runtime.ts.
 *   - Gemini (GEMINI_API_KEY, preferred): src/lib/llm/gemini-agent.ts, reading live web pages
 *   - Claude (ANTHROPIC_API_KEY): the tool runner below
 */

const MODEL = process.env.TEARDOWN_MODEL ?? 'claude-opus-5';
const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max'] as const;
const EFFORT = EFFORTS.find((e) => e === process.env.TEARDOWN_AGENT_EFFORT) ?? 'low';

/** The shared tool specs as Claude runnable tools (the runner validates input with the same zod schemas). */
const claudeTools = (specs: AgentToolSpec[]) =>
  specs.map((spec) => betaZodTool({ name: spec.name, description: spec.description, inputSchema: spec.inputSchema, run: (input) => spec.run(input) }));

/** Converts the chat into alternating user/assistant turns, with the teardown in the first user turn. */
function buildMessages(req: AgentRequest): Anthropic.Beta.BetaMessageParam[] {
  const context: Anthropic.Beta.BetaTextBlockParam = {
    type: 'text',
    text: contextText(req),
    // Stable across turns and tool iterations, so it's worth caching
    cache_control: { type: 'ephemeral' },
  };
  const turns: { role: 'user' | 'assistant'; content: Anthropic.Beta.BetaTextBlockParam[] }[] = [
    { role: 'user', content: [context] },
  ];
  req.messages.forEach((m, i) => {
    const blocks: Anthropic.Beta.BetaTextBlockParam[] = [];
    if (i === req.messages.length - 1) {
      // Volatile app state goes last so it never breaks the cached prefix
      blocks.push({ type: 'text', text: appStateText(req) });
    }
    blocks.push({ type: 'text', text: m.text });
    const last = turns[turns.length - 1];
    if (last.role === m.role) last.content.push(...blocks);
    else turns.push({ role: m.role, content: blocks });
  });
  return turns;
}

/** The reply text; text a fallback model continues after a mid-answer decline is joined without a line break. */
function textOf(message: Anthropic.Beta.BetaMessage) {
  let text = '';
  let joiner = '\n';
  for (const block of message.content) {
    if (block.type === 'fallback') joiner = '';
    if (block.type !== 'text') continue;
    text += (text ? joiner : '') + block.text;
    joiner = '\n';
  }
  return text.trim();
}

/**
 * After a mid-answer fallback, only the declined partial's text may be echoed back, and its tool
 * calls must not run. Mutates the message before the tool runner appends it and runs its tools.
 */
function dropDeclinedBlocks(message: Anthropic.Beta.BetaMessage) {
  const boundary = message.content.findLastIndex((b) => b.type === 'fallback');
  if (boundary > 0) message.content = message.content.filter((b, i) => i >= boundary || b.type === 'text' || b.type === 'fallback');
}

export async function POST(request: Request) {
  const read = await readAgentRequest(request);
  if (!read.ok) return fail(read.error, read.status);
  const provider = aiProvider();
  if (!provider) {
    return fail(
      'The AI engine isn’t configured yet. Add GEMINI_API_KEY (free tier) or ANTHROPIC_API_KEY to .env and restart the dev server.',
      503,
      'no_key',
    );
  }
  const { req } = read;
  return provider === 'gemini' ? askGemini(req, agentSignal(request)) : askClaude(req, request);
}

async function askGemini(req: AgentRequest, signal: AbortSignal) {
  try {
    return Response.json(await runGeminiAgent(req, signal));
  } catch (error) {
    if (signal.aborted) return fail('That took too long to answer. Try a simpler question.', 504);
    if (error instanceof GeminiError) {
      if (error.code === 'bad_key') return fail('The Gemini API key was rejected.', 401, 'bad_key');
      if (error.code === 'rate_limited') return fail(error.message, 429, 'rate_limited');
      if (error.code === 'blocked') return fail('I can’t help with that one. Try asking about how this app is built.', 422, 'blocked');
      if (error.code === 'unavailable') return fail('The AI is busy right now. Try again in a moment.', 503, 'unavailable');
      if (error.code === 'bad_output') return fail(error.message, 502, 'bad_output');
      console.error('[agent] Gemini error', error.status, error.message);
      return fail(`AI service error (${error.status}).`, 502);
    }
    console.error('[agent]', error instanceof Error ? error.message : error);
    return fail('Something went wrong answering that. Please try again.', 500);
  }
}

async function askClaude(req: AgentRequest, request: Request) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const { specs, actions } = createSession(req.teardown, req.playgroundCode);
  const signal = agentSignal(request);

  try {
    const runner = client.beta.messages.toolRunner(
      {
        model: MODEL,
        max_tokens: 16000,
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        thinking: { type: 'adaptive' },
        output_config: { effort: EFFORT },
        // Automatic caching of the growing conversation, on top of the teardown breakpoint
        cache_control: { type: 'ephemeral' },
        system: systemPrompt(),
        tools: claudeTools(specs),
        messages: buildMessages(req),
        max_iterations: MAX_ITERATIONS,
        stream: true,
      },
      { signal },
    );
    for await (const stream of runner) {
      dropDeclinedBlocks(await stream.finalMessage());
    }
    let message = await runner.done();

    // The iteration cap stopped mid-task with tool results as the last turn: ask for the wrap-up answer without tools
    const { max_iterations, compactionControl, stream, messages, ...params } = runner.params;
    const lastTurn = messages.at(-1);
    if (message.stop_reason === 'tool_use' && lastTurn?.role === 'user' && Array.isArray(lastTurn.content)) {
      const note: Anthropic.Beta.BetaTextBlockParam = { type: 'text', text: TOOL_LIMIT_NOTE };
      message = await client.beta.messages
        .stream(
          { ...params, messages: [...messages.slice(0, -1), { role: 'user', content: [...lastTurn.content, note] }], tool_choice: { type: 'none' } },
          { signal },
        )
        .finalMessage();
    }

    if (message.stop_reason === 'refusal') {
      return fail('I can’t help with that one. Try asking about how this app is built.', 422);
    }

    const reply = assembleReply(textOf(message), req.teardown, actions, 'claude');
    if (!reply) return fail(NO_ANSWER, 502);
    return Response.json(reply);
  } catch (error) {
    if (error instanceof Anthropic.APIUserAbortError || error instanceof Anthropic.APIConnectionTimeoutError) {
      return fail('That took too long to answer. Try a simpler question.', 504);
    }
    if (error instanceof Anthropic.AuthenticationError) return fail('The Anthropic API key was rejected.', 401, 'bad_key');
    if (error instanceof Anthropic.RateLimitError) return fail('Lots of questions at once. Wait a moment and retry.', 429);
    if (error instanceof Anthropic.APIError) {
      console.error('[agent] API error', error.status ?? 'network', error.message);
      if (error.status === 529 || error.status === 503) return fail('The AI is busy right now. Try again in a moment.', 503);
      return fail(`AI service error (${error.status ?? 'network'}).`, 502);
    }
    console.error('[agent]', error instanceof Error ? error.message : error);
    return fail('Something went wrong answering that. Please try again.', 500);
  }
}
