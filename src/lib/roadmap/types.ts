/**
 * Career roadmaps: "You want to be a <track>. Here's how to learn to build an app like <teardown>."
 *
 * Content lives in data files (written once, links verified by scripts/verify-resources.ts):
 *   src/data/careers.ts         → CAREER_TRACKS: what each track learns, phase by phase
 *   src/data/resources/*.ts     → RESOURCES: courses, videos, docs and practice sites, tagged by topic
 * The engine (src/lib/roadmap/build.ts) combines a track with a teardown's actual stack.
 */

export const TRACK_IDS = [
  'software', // Software engineer
  'web', // Web developer
  'mobile', // Mobile app developer
  'cybersecurity', // Cybersecurity
  'data-ai', // Data science & AI
  'cloud-devops', // Cloud & DevOps
  'game', // Game developer
  'uiux', // UI/UX & product design
  'explore', // Not sure yet: a broad first taste of everything
] as const;
export type TrackId = (typeof TRACK_IDS)[number];

/** Shared vocabulary for tagging resources and steps. Always use these exact strings. */
export const TOPICS = [
  // Foundations
  'programming-basics', 'python', 'javascript', 'typescript', 'git', 'terminal', 'cs-fundamentals', 'data-structures', 'algorithms',
  // Web
  'html-css', 'react', 'nextjs', 'nodejs', 'rest-api', 'graphql', 'web-performance', 'accessibility',
  // Mobile
  'react-native', 'expo', 'swift', 'kotlin', 'flutter',
  // Back end & data
  'sql', 'postgresql', 'mongodb', 'databases', 'redis', 'caching', 'message-queues', 'django', 'java', 'go', 'rust', 'elixir',
  'system-design', 'realtime', 'video-streaming', 'search-engines',
  // Cloud & DevOps
  'linux', 'networking', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci-cd', 'terraform', 'monitoring', 'cdn',
  // Security
  'security-fundamentals', 'web-security', 'owasp', 'cryptography', 'network-security', 'pentesting', 'ctf',
  'threat-modeling', 'auth', 'cloud-security', 'secure-coding',
  // Data & AI
  'statistics', 'pandas', 'machine-learning', 'deep-learning', 'recommender-systems', 'llm-apps', 'data-engineering', 'nlp',
  'computer-vision',
  // Games
  'game-design', 'unity', 'csharp', 'godot', 'unreal', 'cpp',
  // Design & product
  'ux-research', 'ui-design', 'figma', 'design-systems', 'prototyping', 'usability-testing', 'product-management',
  // Career
  'portfolio', 'interviews', 'open-source', 'certifications',
] as const;
export type Topic = (typeof TOPICS)[number];

export type ResourceType = 'course' | 'video' | 'docs' | 'practice' | 'book' | 'guide';
export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Resource {
  /** kebab-case, unique across all resource files */
  id: string;
  title: string;
  /** e.g. "Harvard (edX)", "freeCodeCamp", "MDN", "PortSwigger" */
  provider: string;
  /** Exact, verified URL. YouTube links use https://www.youtube.com/watch?v=ID or a playlist URL. */
  url: string;
  type: ResourceType;
  /** 1–4 topics from TOPICS, most specific first */
  topics: Topic[];
  level: Level;
  /** true only if the core material is free (audit/free tier counts) */
  free: boolean;
  /** Rough effort, e.g. "4 hours", "10 weeks", "self-paced" */
  duration: string;
  /** One sentence: why a beginner should use this one */
  why: string;
}

export interface TrackStep {
  id: string;
  title: string;
  /** One or two sentences, beginner friendly. May use {{app}} for the product name. */
  why: string;
  /** Rough weeks at ~8 hours/week */
  weeks: number;
  /** Topics used to pick resources for this step (1–3) */
  topics: Topic[];
  /** Optional small project to prove the skill. May use {{app}}. */
  project?: string;
}

export interface CareerTrack {
  id: TrackId;
  label: string;
  emoji: string;
  /** One line shown on the picker */
  tagline: string;
  /** 2–3 sentences: what this person does day to day */
  description: string;
  /** Hex color for accents */
  color: string;
  /** Phase 1: fundamentals every person on this track needs (2–4 steps) */
  foundations: TrackStep[];
  /** Phase 2: the core skills of the track (3–5 steps) */
  core: TrackStep[];
  /**
   * Phase 4: this track's lens on the app being torn down (3–4 steps), e.g. cybersecurity → threat model
   * the architecture, secure the login flow, test the API; data-ai → build the recommendation/ranking system.
   * Use {{app}} for the product name so the steps read as tailored.
   */
  specialize: TrackStep[];
  /** Phase 5: portfolio, certifications (real, current names only), communities, first job (2–4 steps) */
  career: TrackStep[];
  /** 2–4 real job titles this track leads to */
  roles: string[];
}

/* -------------------------------- engine output -------------------------------- */

export interface RoadmapStep {
  id: string;
  title: string;
  why: string;
  weeks: number;
  project?: string;
  resources: Resource[];
}

export interface RoadmapPhase {
  id: 'foundations' | 'core' | 'build' | 'specialize' | 'career';
  title: string;
  summary: string;
  steps: RoadmapStep[];
}

export interface Roadmap {
  track: CareerTrack;
  title: string;
  intro: string;
  totalWeeks: number;
  phases: RoadmapPhase[];
  capstone: { title: string; description: string; features: string[] };
}
