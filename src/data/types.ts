/**
 * A Teardown is everything the app knows about how one product is built.
 * Curated teardowns (src/data/curated) and AI-generated ones (src/app/api/teardown+api.ts)
 * share this exact shape, so every screen renders both the same way.
 */

export type StackLayer =
  | 'Frontend'
  | 'Mobile'
  | 'Backend'
  | 'Data'
  | 'Infrastructure'
  | 'AI / ML'
  | 'DevOps';

/**
 * Tiers drive the system-map layout, top to bottom:
 * 0 = clients (phone, browser) · 1 = edge (DNS, CDN, load balancer)
 * 2 = API / gateway · 3 = services & workers · 4 = data & storage
 */
export type Tier = 0 | 1 | 2 | 3 | 4;

export type NodeKind =
  | 'client'
  | 'edge'
  | 'gateway'
  | 'service'
  | 'queue'
  | 'ml'
  | 'cache'
  | 'database'
  | 'storage'
  | 'external';

export type Confidence = 'confirmed' | 'likely';

export interface ArchNode {
  id: string;
  label: string;
  kind: NodeKind;
  tier: Tier;
  /** Concrete technology, e.g. "Django (Python)" */
  tech: string;
  /** 1–2 beginner-friendly sentences: what this box does and why it exists */
  description: string;
}

export interface ArchEdge {
  from: string;
  to: string;
  /** Short protocol/purpose label, e.g. "HTTPS / GraphQL" */
  label: string;
}

export interface FlowStep {
  from: string;
  to: string;
  /** What happens on this hop, written for a beginner */
  narration: string;
}

export interface Flow {
  id: string;
  /** A user action, e.g. "You post a photo" */
  title: string;
  emoji: string;
  steps: FlowStep[];
}

export interface CodeSample {
  id: string;
  title: string;
  /** Illustrative path, e.g. "server/feed/views.py" */
  file: string;
  /** Display language, e.g. "Python", "Swift", "SQL" */
  language: string;
  /** Plain-English walkthrough of what the snippet shows */
  explanation: string;
  code: string;
}

export interface Teardown {
  id: string;
  name: string;
  /** Bare domain, e.g. "instagram.com" */
  url: string;
  tagline: string;
  category: string;
  brandColor: string;
  accentColor: string;
  /** 1–2 characters or a single emoji used as the logo mark */
  logoGlyph: string;
  /** curated = hand-checked file · ai = Claude-generated · scan = instant offline teardown from a live scan + templates */
  source: 'curated' | 'ai' | 'scan';
  /** "Explain like I'm new to CS": how the product works in 2–3 sentences */
  eli5: string;
  facts: { label: string; value: string }[];
  history: { year: string; title: string; detail: string }[];
  /** share values are relative emphasis and should sum to ~100 */
  languages: { name: string; usedFor: string; share: number }[];
  stack: {
    layer: StackLayer;
    items: { name: string; role: string; beginnerNote: string; confidence: Confidence }[];
  }[];
  architecture: {
    nodes: ArchNode[];
    edges: ArchEdge[];
    flows: Flow[];
  };
  /** Simplified, illustrative project tree */
  files: { path: string; note: string }[];
  code: CodeSample[];
  playground: {
    title: string;
    description: string;
    /**
     * Self-contained HTML document. Contract (see PLAYGROUND_CONTRACT below):
     * - `:root` CSS variables tagged with `/* @tweak ... *\/` become live controls
     * - elements with `data-edit="key"` containing plain text are editable in the preview
     */
    html: string;
    /** Short "try this" prompts for beginners */
    challenges: string[];
  };
  concepts: { term: string; meaning: string }[];
  buildYourOwn: { step: string; detail: string }[];
  sources: { label: string; url: string }[];
}

export const PLAYGROUND_CONTRACT = `
Playground HTML rules:
1. One complete HTML document, no external resources (no <img src="http...">, no CDN links, no web fonts). Use emoji, CSS gradients and inline SVG for visuals.
2. Mobile-first: designed for a ~360px wide viewport, body margin 0.
3. The first <style> block starts with a :root rule declaring 4-7 tweakable CSS custom properties.
   Each tweakable property is on its own line, followed by a tweak comment:
     --brand: #E1306C; /* @tweak color "Brand color" */
     --radius: 14px; /* @tweak range 0 32 "Corner radius" */
   Supported forms: @tweak color "Label"  |  @tweak range MIN MAX "Label"  (range values use px).
   The rest of the CSS must actually use these variables so tweaks visibly change the page.
4. Editable text: put data-edit="some-key" on 3-6 elements whose content is ONLY plain text (no child tags), e.g. <h1 data-edit="title">Home</h1>. Keys are unique.
5. Include a little vanilla JS interactivity in an inline <script> (e.g. tap to like, switch tabs, play/pause) so it feels alive.
6. Keep it under ~180 lines and readable for a beginner, with a few short comments.
`;
