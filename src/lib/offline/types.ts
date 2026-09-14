/**
 * Contracts for the offline "quick teardown" engine.
 *
 * When the AI engine isn't available, a teardown for ANY site is assembled from:
 *   1. a live scan of the site (src/lib/fingerprints.ts)          → confirmed tech
 *   2. a KnownProduct entry, if we recognise the product            → real facts & history
 *   3. an ArchetypeTemplate for the kind of product it is          → architecture, flows, code, playground
 *   4. FrameworkPacks for each detected technology                  → framework-specific stack items, files, code
 *
 * Every string in an ArchetypeTemplate may contain these placeholders, replaced at build time:
 *   {{name}}     product name, e.g. "Pinterest"
 *   {{domain}}   bare domain, e.g. "pinterest.com" (may be empty for name-only searches)
 *   {{brand}}    primary brand color hex, e.g. "#E60023"
 *   {{accent}}   secondary color hex
 *   {{tagline}}  one-line description
 *   {{frontend}} detected web framework, or a sensible default like "React"
 *   {{hosting}}  detected hosting/CDN, or a default like "a CDN"
 */

import type { ArchNode, CodeSample, Flow, StackLayer, Teardown } from '@/data/types';

export const ARCHETYPE_IDS = [
  'social', // social networks & feeds: Facebook, Pinterest, Tumblr
  'media', // video/music/podcast streaming & creators: YouTube, Twitch, SoundCloud
  'messaging', // chat, calls & team communication: Telegram, Slack, Zoom
  'commerce', // online stores & retail marketplaces: Amazon, Etsy, eBay, Shopify stores
  'marketplace', // two-sided booking/gig/delivery/travel/dating: Airbnb, DoorDash, Tinder
  'productivity', // SaaS & collaboration tools: Notion, Figma, Trello, Google Docs
  'search', // search engines, maps & portals: Google, Bing, Maps
  'content', // news, blogs, wikis, docs & portfolios: NYTimes, Medium, Wikipedia, personal sites
  'education', // learning platforms & schools/universities: Duolingo, Coursera, txstate.edu
  'finance', // payments, banking, investing & crypto: Stripe, PayPal, Robinhood
  'ai', // AI assistants & generative tools: Perplexity, Midjourney
  'devtools', // developer platforms: GitHub, Vercel, Stack Overflow
  'gaming', // games & game platforms: Roblox, Steam, Chess.com
  'webapp', // generic fallback when nothing else fits
] as const;

export type ArchetypeId = (typeof ARCHETYPE_IDS)[number];

export interface ArchetypeTemplate {
  id: ArchetypeId;
  /** Human label, e.g. "Social network" */
  label: string;
  /** Lowercase words/phrases that suggest this archetype when found in a site's title, description or domain */
  keywords: string[];
  /** Fallback one-liner when the site has no description, e.g. "{{name}} is a social network where…" */
  tagline: string;
  /** 2–3 sentences, beginner friendly, uses {{name}} */
  eli5: string;
  /** 4–6 entries, shares sum to 100 */
  languages: { name: string; usedFor: string; share: number }[];
  /** 4–6 layers, 2–4 items each. These are typical choices, so the builder marks them "likely". */
  stack: { layer: StackLayer; items: { name: string; role: string; beginnerNote: string }[] }[];
  architecture: {
    /**
     * 11–14 nodes, tiers 0–4, at most 4 per tier. Must include exactly one node with id "web" (kind client, tier 0)
     * whose tech mentions {{frontend}}, and exactly one node with id "cdn" (kind edge, tier 1) whose tech mentions {{hosting}}.
     */
    nodes: ArchNode[];
    /** 14–20 edges between node ids */
    edges: { from: string; to: string; label: string }[];
    /** Exactly 3 flows of 4–7 steps; each step must follow an existing edge (either direction) */
    flows: Flow[];
  };
  /** 12–16 illustrative project paths (server/data side mostly; framework packs add front-end files) */
  files: { path: string; note: string }[];
  /** 3 snippets: backend/API, data model (SQL or similar), and one archetype-specific system (feed ranking, cart, search index…) */
  code: CodeSample[];
  playground: {
    title: string;
    description: string;
    /** Must follow PLAYGROUND_CONTRACT (src/data/types.ts). Use {{brand}}, {{accent}}, {{name}} so it matches the product. */
    html: string;
    challenges: string[];
  };
  /** 6–8 terms */
  concepts: { term: string; meaning: string }[];
  /** 5–6 steps */
  buildYourOwn: { step: string; detail: string }[];
}

/** Every technology name the live scanner can report (Detection.name). FrameworkPack.detection must be one of these. */
export const DETECTION_NAMES = [
  // Front-end frameworks
  'Next.js', 'React', 'Nuxt (Vue)', 'Vue.js', 'Angular', 'Svelte / SvelteKit', 'Astro', 'Remix / React Router', 'Gatsby',
  'Expo (React Native Web)', 'Ember.js', 'Alpine.js', 'htmx',
  // Site builders & CMS
  'WordPress', 'Shopify', 'Squarespace', 'Wix', 'Webflow', 'Framer', 'Ghost', 'Drupal', 'HubSpot CMS',
  // Back-end frameworks & servers
  'PHP', 'Laravel', 'Ruby on Rails', 'Django', 'ASP.NET', 'Express (Node.js)', 'nginx', 'Apache HTTP Server',
  'Microsoft IIS', 'Envoy proxy', 'Varnish', 'Proxygen (Meta)',
  // Hosting, CDN & cloud
  'Cloudflare', 'Vercel', 'Netlify', 'Amazon CloudFront', 'Amazon S3', 'Amazon Web Services', 'Fastly', 'Akamai',
  'Google Front End', 'Google Cloud', 'Microsoft Azure', 'Firebase Hosting', 'GitHub Pages', 'Heroku', 'Fly.io', 'Render',
  'Meta infrastructure', 'Meta CDN (fbcdn)', 'Google static CDN', 'Public JS CDN', 'HTTP/3 (QUIC)', 'HSTS (HTTPS enforced)',
  // Libraries
  'Tailwind CSS', 'Bootstrap', 'jQuery', 'Font Awesome', 'Google Fonts',
  // Third-party services
  'Google Analytics / Tag Manager', 'Segment', 'Sentry', 'Hotjar', 'Intercom', 'Stripe', 'PayPal', 'reCAPTCHA', 'Algolia',
  'Auth0', 'Firebase', 'Supabase', 'YouTube embeds',
] as const;

export type DetectionName = (typeof DETECTION_NAMES)[number];

export interface FrameworkPack {
  detection: DetectionName;
  /** Items added to the stack as "confirmed" because the scan saw them (1–3) */
  stackItems: { layer: StackLayer; name: string; role: string; beginnerNote: string }[];
  /** Language this technology implies, if any (e.g. PHP for WordPress) */
  language?: { name: string; usedFor: string };
  /** 0–5 illustrative files this technology implies */
  files: { path: string; note: string }[];
  /** 0–1 short (12–30 line) teaching snippet showing how sites typically use this technology */
  code: CodeSample[];
  /** 0–2 concepts a beginner should learn from this technology */
  concepts: { term: string; meaning: string }[];
  /** How to explain the evidence, e.g. "Its HTML loads scripts from /_next/static/, a folder only Next.js creates." */
  howWeKnow: string;
}

/** Facts about popular products that aren't full curated teardowns. Only well-documented facts. */
export interface KnownProduct {
  id: string;
  name: string;
  /** Bare domains, primary first, e.g. ["pinterest.com", "pin.it"] */
  domains: string[];
  /** Lowercase alternate names people type, e.g. ["pinterest", "pins"] */
  aliases: string[];
  archetype: ArchetypeId;
  tagline: string;
  brandColor: string;
  accentColor: string;
  logoGlyph: string;
  /** 3–5 facts: Founded, Founders, Headquarters, Parent company, etc. */
  facts: { label: string; value: string }[];
  /** 3–6 well-documented milestones */
  history: { year: string; title: string; detail: string }[];
  /** 0–6 publicly documented technologies (engineering blog, talks, official docs) */
  knownStack: { layer: StackLayer; name: string; role: string; beginnerNote: string }[];
  /** 1–3 sources: official site, Wikipedia, engineering blog root */
  sources: { label: string; url: string }[];
}

export type OfflineTeardown = Teardown;
