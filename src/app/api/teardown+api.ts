import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';

import { BuildPart, PARTS, StoryPart, SystemPart, type PartName } from '@/data/schema';
import { PLAYGROUND_CONTRACT } from '@/data/types';
import type { ScanResult } from '@/lib/fingerprints';
import { geminiErrorResponse, researchPart } from '@/lib/llm/research';
import { aiProvider } from '@/lib/llm/provider';

const MODEL = process.env.TEARDOWN_MODEL ?? 'claude-opus-5';
const EFFORT = (process.env.TEARDOWN_EFFORT ?? 'medium') as 'low' | 'medium' | 'high';

const SYSTEM = `You are the engine behind Teardown, an app that shows beginner and intermediate computer science students how real apps and websites are built.

Voice: a friendly senior engineer explaining things to a curious first-year student. Plain English, concrete analogies, no unexplained jargon.

Honesty rules:
- Separate what is publicly documented (official engineering blogs, talks, Wikipedia, job posts, the live scan evidence you are given) from educated inference. Mark stack items "confirmed" only for the former.
- Never invent specific numbers, dates, people or URLs you are not confident about. If the product is small or obscure, say so plainly and describe the most plausible architecture for a product of that type, marked "likely".
- Code samples are simplified educational examples inspired by how such a system works, never claimed to be the product's real source code.
- If live scan evidence is provided, treat it as ground truth for the web front end and hosting, and weave it into your answer.

All ids you reference (edges, flow steps) must exist. Output only the requested JSON.`;

const PART_INSTRUCTIONS: Record<PartName, string> = {
  story:
    'Write the STORY part: identity, brand colors, eli5, quick facts, history timeline, languages, the tech stack by layer, key CS concepts, build-your-own steps and sources.',
  system:
    'Write the SYSTEM part: an architecture map (nodes in tiers 0-4, edges, and exactly 3 request flows that trace real user actions hop by hop along existing edges) plus an illustrative project file tree spanning client and server.',
  build: `Write the BUILD part: 4-5 educational code snippets across different layers/languages of this product, and an interactive playground: a mini-clone of the product's signature screen.\n${PLAYGROUND_CONTRACT}`,
};

const SCHEMAS = { story: StoryPart, system: SystemPart, build: BuildPart } as const;

function describeScan(scan?: ScanResult | null) {
  if (!scan?.ok) return 'No live scan is available (the query is a name, or the site could not be reached).';
  const detections = scan.detections.map((d) => `- ${d.name} (${d.category}): ${d.evidence}`).join('\n') || '- nothing recognizable';
  const headers = scan.headers.map((h) => `- ${h.name}: ${h.value}`).join('\n');
  return `Live scan of ${scan.finalUrl ?? scan.url} (HTTP ${scan.status}):
Title: ${scan.title ?? 'n/a'}
Description: ${scan.description ?? 'n/a'}
Detected technologies:
${detections}
Notable response headers:
${headers || '- none'}
Page structure (use it so the playground resembles the real page):
- Menu: ${scan.outline?.nav.join(' | ') || 'n/a'}
- Headings: ${scan.outline?.headings.map((h) => h.text).join(' | ') || 'n/a'}
- First paragraph: ${scan.outline?.paragraphs[0] ?? 'n/a'}
- Buttons: ${scan.outline?.buttons.join(' | ') || 'n/a'}`;
}

export async function POST(request: Request) {
  const body = ((await request.json().catch(() => ({}))) ?? {}) as {
    query?: string;
    part?: string;
    scan?: ScanResult | null;
  };
  const query = typeof body.query === 'string' ? body.query.trim().slice(0, 200) : '';
  const part = body.part as PartName;
  if (!query || !PARTS.includes(part)) {
    return Response.json({ error: 'Expected { query, part: "story" | "system" | "build" }' }, { status: 400 });
  }
  const provider = aiProvider();
  if (!provider) {
    return Response.json(
      {
        error:
          'The AI engine isn’t configured yet. Add GEMINI_API_KEY (free at aistudio.google.com) or ANTHROPIC_API_KEY to .env and restart the dev server.',
        code: 'no_key',
      },
      { status: 503 },
    );
  }

  if (provider === 'gemini') {
    // Live research: Gemini reads real pages found for this product (and Google Search on paid keys), grounded in the live scan
    try {
      const research = await researchPart(part, query, body.scan && typeof body.scan === 'object' ? body.scan : null);
      return Response.json({
        part,
        data: research.data,
        model: research.model,
        provider: 'gemini',
        sources: research.sources,
        queries: research.queries,
        researchedAt: research.researchedAt,
      });
    } catch (error) {
      return geminiErrorResponse(error);
    }
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const schema = SCHEMAS[part];

  try {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 32000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      thinking: { type: 'adaptive' },
      output_config: { effort: EFFORT, format: betaZodOutputFormat(schema) },
      system: SYSTEM,
      messages: [
        {
          role: 'user',
          content: `Product to tear down: "${query}"\n\n${describeScan(body.scan)}\n\n${PART_INSTRUCTIONS[part]}`,
        },
      ],
    });
    const message = await stream.finalMessage();

    if (message.stop_reason === 'refusal') {
      return Response.json({ error: 'The AI declined to analyze this one. Try a different app.' }, { status: 422 });
    }
    if (message.stop_reason === 'max_tokens') {
      return Response.json({ error: 'The answer ran too long. Please try again.' }, { status: 502 });
    }

    const json = message.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('');
    const parsed = schema.safeParse(JSON.parse(json));
    if (!parsed.success) {
      return Response.json({ error: 'The AI returned an unexpected shape. Please retry.' }, { status: 502 });
    }
    return Response.json({ part, data: parsed.data, model: message.model, provider: 'claude' });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: 'The Anthropic API key was rejected.', code: 'bad_key' }, { status: 401 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json({ error: 'Too many teardowns at once. Wait a moment and retry.' }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return Response.json({ error: `AI service error (${error.status ?? 'network'}).` }, { status: 502 });
    }
    if (error instanceof SyntaxError) {
      return Response.json({ error: 'The AI response was not valid JSON. Please retry.' }, { status: 502 });
    }
    throw error;
  }
}
