import { GEMINI_MODEL } from '@/lib/llm/gemini';
import { aiProvider } from '@/lib/llm/provider';

/** Lets the app decide between live AI teardowns and instant offline ones without spending a request. */
export function GET() {
  const provider = aiProvider();
  return Response.json({
    ai: provider !== null,
    provider,
    model: provider === 'gemini' ? GEMINI_MODEL : provider === 'claude' ? (process.env.TEARDOWN_MODEL ?? 'claude-opus-5') : null,
    live: provider === 'gemini' || provider === 'claude',
  });
}
