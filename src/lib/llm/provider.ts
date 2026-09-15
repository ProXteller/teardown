/**
 * Which AI engine the server uses. Gemini (free tier, reads live web pages) is preferred when its key is set;
 * Claude remains available. Set AI_PROVIDER=gemini|claude to force one when both keys exist.
 */
export type AiProvider = 'gemini' | 'claude';

export function aiProvider(): AiProvider | null {
  const preferred = process.env.AI_PROVIDER?.toLowerCase();
  const gemini = Boolean(process.env.GEMINI_API_KEY);
  const claude = Boolean(process.env.ANTHROPIC_API_KEY);
  if (preferred === 'claude' && claude) return 'claude';
  if (preferred === 'gemini' && gemini) return 'gemini';
  if (gemini) return 'gemini';
  if (claude) return 'claude';
  return null;
}
