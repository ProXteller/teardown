/** Lets the app decide between AI teardowns and instant offline ones without spending a request. */
export function GET() {
  return Response.json({ ai: Boolean(process.env.ANTHROPIC_API_KEY) });
}
