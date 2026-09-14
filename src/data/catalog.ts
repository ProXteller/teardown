import { amazon } from './curated/amazon';
import { chatgpt } from './curated/chatgpt';
import { discord } from './curated/discord';
import { facebook } from './curated/facebook';
import { google } from './curated/google';
import { instagram } from './curated/instagram';
import { netflix } from './curated/netflix';
import { reddit } from './curated/reddit';
import { spotify } from './curated/spotify';
import { tiktok } from './curated/tiktok';
import { uber } from './curated/uber';
import { whatsapp } from './curated/whatsapp';
import { x } from './curated/x';
import { youtube } from './curated/youtube';
import type { Teardown } from './types';

export const CURATED: Teardown[] = [
  instagram, facebook, youtube, tiktok, spotify, netflix, x, reddit, discord, whatsapp, uber, amazon, google, chatgpt,
];

const ALIASES: Record<string, string[]> = {
  instagram: ['instagram', 'insta', 'ig', 'instagr'],
  spotify: ['spotify'],
  netflix: ['netflix'],
  discord: ['discord', 'discordapp'],
  uber: ['uber', 'ubereats'],
  whatsapp: ['whatsapp', 'wa', 'whats app'],
  facebook: ['facebook', 'fb', 'facebookcom'],
  youtube: ['youtube', 'yt', 'youtu', 'you tube'],
  tiktok: ['tiktok', 'tik tok', 'douyin', 'musically'],
  x: ['x', 'twitter', 'xcom', 'tweet', 'tweets'],
  reddit: ['reddit', 'redd'],
  amazon: ['amazon', 'amzn', 'amazoncom'],
  google: ['google', 'google search', 'googlesearch'],
  chatgpt: ['chatgpt', 'chat gpt', 'openai', 'gpt'],
};

export interface ParsedQuery {
  /** What the user typed, trimmed */
  raw: string;
  /** Hostname when the query looks like a URL/domain, else null */
  host: string | null;
  /** Stable id used for routes and caching, e.g. "linear-app" */
  id: string;
  /** Human-friendly name guess, e.g. "Linear" */
  displayName: string;
}

export function parseQuery(input: string): ParsedQuery {
  const raw = input.trim();
  let host: string | null = null;
  const candidate = raw.includes('://') ? raw : `https://${raw}`;
  if (/^[^\s]+\.[a-z]{2,}(\/.*)?$/i.test(raw.replace(/^https?:\/\//i, ''))) {
    try {
      host = new URL(candidate).hostname.replace(/^www\./, '').toLowerCase();
    } catch {
      host = null;
    }
  }
  const base = host ? host.split('.').slice(0, -1).join('-') || host : raw;
  const id = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  const nameSource = host ? host.split('.').slice(-2, -1)[0] ?? host : raw;
  const displayName = nameSource.charAt(0).toUpperCase() + nameSource.slice(1);
  return { raw, host, id: id || 'app', displayName };
}

export function findCurated(query: ParsedQuery): Teardown | undefined {
  const needle = (query.host ? query.host.split('.').slice(-2, -1)[0] : query.raw)
    ?.toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
  if (!needle) return undefined;
  return CURATED.find(
    (t) => t.id === needle || ALIASES[t.id]?.some((a) => a === needle || needle === a.replace(/\s/g, '')),
  );
}

export function getCurated(id: string): Teardown | undefined {
  return CURATED.find((t) => t.id === id);
}
