import * as z from 'zod/v4';

/**
 * Structured-output schemas for AI-generated teardowns. A teardown is generated in three
 * parts that run in parallel so the first tabs appear quickly; merged, they form a `Teardown`.
 */

const text = (description: string) => z.string().describe(description);

export const StoryPart = z.object({
  name: text('Official product name'),
  url: text('Bare domain, e.g. "linear.app"'),
  tagline: text('One line: what the product is'),
  category: text('Short category, e.g. "Project management"'),
  brandColor: text('Primary brand color as #RRGGBB'),
  accentColor: text('Secondary brand color as #RRGGBB'),
  logoGlyph: text('1-2 letters or one emoji that evokes the logo'),
  eli5: text('2-3 sentences explaining how the product works to a first-year CS student'),
  facts: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .describe('5-7 quick facts: Founded, Founders, Headquarters, Users, Parent company, etc.'),
  history: z
    .array(z.object({ year: z.string(), title: z.string(), detail: z.string() }))
    .describe('7-10 chronological milestones'),
  languages: z
    .array(z.object({ name: z.string(), usedFor: z.string(), share: z.number() }))
    .describe('4-6 programming languages; share is relative emphasis and all shares sum to 100'),
  stack: z
    .array(
      z.object({
        layer: z.enum(['Frontend', 'Mobile', 'Backend', 'Data', 'Infrastructure', 'AI / ML', 'DevOps']),
        items: z.array(
          z.object({
            name: z.string(),
            role: text('Short role, e.g. "Web UI framework"'),
            beginnerNote: text('One sentence analogy or explanation for a beginner'),
            confidence: z
              .enum(['confirmed', 'likely'])
              .describe('confirmed only if publicly documented or detected in the live scan'),
          }),
        ),
      }),
    )
    .describe('4-7 layers with 2-5 items each'),
  concepts: z
    .array(z.object({ term: z.string(), meaning: z.string() }))
    .describe('6-8 CS concepts this product relies on, one-sentence meanings'),
  buildYourOwn: z
    .array(z.object({ step: z.string(), detail: z.string() }))
    .describe('5-6 steps for a beginner to build a tiny version, naming beginner-friendly tools'),
  sources: z
    .array(z.object({ label: z.string(), url: z.string() }))
    .describe('2-5 sources; only URLs you are highly confident exist (official site, Wikipedia, engineering blog root)'),
});

const tier = z
  .number()
  .describe('Integer 0-4: 0 clients, 1 edge (DNS/CDN/load balancer), 2 API/gateway, 3 services & workers, 4 data & storage');

export const SystemPart = z.object({
  architecture: z.object({
    nodes: z
      .array(
        z.object({
          id: text('short kebab-case id'),
          label: text('2-3 word label'),
          kind: z.enum([
            'client',
            'edge',
            'gateway',
            'service',
            'queue',
            'ml',
            'cache',
            'database',
            'storage',
            'external',
          ]),
          tier,
          tech: text('Concrete technology, e.g. "Node.js (Express)"'),
          description: text('1-2 beginner sentences: what this box does and why it exists'),
        }),
      )
      .describe('10-15 nodes, at most 4 per tier'),
    edges: z
      .array(z.object({ from: z.string(), to: z.string(), label: text('e.g. "HTTPS", "SQL", "pub/sub"') }))
      .describe('12-22 edges between node ids'),
    flows: z
      .array(
        z.object({
          id: z.string(),
          title: text('A user action, e.g. "You send a message"'),
          emoji: z.string(),
          steps: z
            .array(z.object({ from: z.string(), to: z.string(), narration: z.string() }))
            .describe('4-7 hops; each hop must follow an existing edge (either direction)'),
        }),
      )
      .describe('exactly 3 flows'),
  }),
  files: z
    .array(z.object({ path: z.string(), note: z.string() }))
    .describe('14-20 illustrative project paths across client and server'),
});

export const BuildPart = z.object({
  code: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        file: text('Illustrative path'),
        language: text('Display language, e.g. "TypeScript"'),
        explanation: text('2-3 sentence walkthrough'),
        code: text('15-40 lines of realistic, correct code'),
      }),
    )
    .describe('4-5 simplified educational snippets across different layers and languages'),
  playground: z.object({
    title: z.string(),
    description: z.string(),
    html: text('Complete self-contained HTML document following the playground rules'),
    challenges: z.array(z.string()).describe('3-4 short "try this" prompts'),
  }),
});

export type StoryPartT = z.infer<typeof StoryPart>;
export type SystemPartT = z.infer<typeof SystemPart>;
export type BuildPartT = z.infer<typeof BuildPart>;

export const PARTS = ['story', 'system', 'build'] as const;
export type PartName = (typeof PARTS)[number];
