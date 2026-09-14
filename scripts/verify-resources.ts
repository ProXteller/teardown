/**
 * Validates the learning-resource library and checks that every link is real.
 *   npx tsx scripts/verify-resources.ts                               → every file in src/data/resources
 *   npx tsx scripts/verify-resources.ts src/data/resources/security.ts → one file
 *   add --offline to skip network checks
 *
 * YouTube links are confirmed with YouTube's oEmbed endpoint (returns the real title and channel).
 * Other links must load with HTTP < 400. Sites that block bots (403/429/999) are reported as
 * "blocked" warnings; everything else that fails (404, DNS, timeout) is an error.
 */
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { TOPICS, TRACK_IDS, type Resource } from '../src/lib/roadmap/types';

const DIR = 'src/data/resources';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const TYPES = ['course', 'video', 'docs', 'practice', 'book', 'guide'];
const LEVELS = ['beginner', 'intermediate', 'advanced'];

let errors = 0;
let warnings = 0;
const err = (where: string, msg: string) => {
  errors++;
  console.log(`  ✗ [${where}] ${msg}`);
};
const warn = (where: string, msg: string) => {
  warnings++;
  console.log(`  ! [${where}] ${msg}`);
};

function isYouTube(url: string) {
  return /^https:\/\/(www\.)?(youtube\.com\/(watch\?v=|playlist\?list=)|youtu\.be\/)/.test(url);
}

async function fetchWithTimeout(url: string, ms = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { redirect: 'follow', signal: controller.signal, headers: { 'user-agent': UA, accept: 'text/html,application/json' } });
  } finally {
    clearTimeout(timer);
  }
}

async function checkLink(r: Resource): Promise<void> {
  const w = r.id;
  try {
    if (isYouTube(r.url)) {
      const res = await fetchWithTimeout(`https://www.youtube.com/oembed?url=${encodeURIComponent(r.url)}&format=json`);
      if (!res.ok) return err(w, `YouTube oEmbed ${res.status}: video/playlist does not exist or is private → ${r.url}`);
      const data = (await res.json()) as { title?: string; author_name?: string };
      console.log(`  ▶ ${w}: "${data.title}" by ${data.author_name}`);
      return;
    }
    const res = await fetchWithTimeout(r.url);
    if ([401, 403, 429, 999].includes(res.status)) return warn(w, `blocked by bot protection (${res.status}); open manually → ${r.url}`);
    if (res.status >= 400) return err(w, `HTTP ${res.status} → ${r.url}`);
    const html = (await res.text()).slice(0, 200000);
    const title = html.match(/<title[^>]*>([^<]{1,160})<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim();
    if (/page not found|404 not found|this page (doesn.t|does not) exist/i.test(title ?? '')) return err(w, `soft 404 ("${title}") → ${r.url}`);
    console.log(`  ✓ ${w}: ${title ?? '(no title)'}`);
  } catch (e) {
    err(w, `${(e as Error).name === 'AbortError' ? 'timeout' : (e as Error).message} → ${r.url}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const offline = args.includes('--offline');
  const files = args.filter((a) => !a.startsWith('--'));
  const targets = files.length ? files : readdirSync(DIR).filter((f) => f.endsWith('.ts') && f !== 'index.ts').map((f) => `${DIR}/${f}`);

  const all: Resource[] = [];
  for (const file of targets) {
    const mod = await import(pathToFileURL(resolve(file)).href);
    const list = Object.values(mod).find(Array.isArray) as Resource[] | undefined;
    if (!list) {
      err(file, 'no exported Resource[] array');
      continue;
    }
    console.log(`\n${file}: ${list.length} resources`);
    all.push(...list);
  }

  const ids = new Set<string>();
  const urls = new Set<string>();
  for (const r of all) {
    const w = r.id ?? '(missing id)';
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(r.id)) err(w, 'id must be kebab-case');
    if (ids.has(r.id)) err(w, 'duplicate id');
    ids.add(r.id);
    if (urls.has(r.url)) err(w, `duplicate url ${r.url}`);
    urls.add(r.url);
    if (!/^https:\/\//.test(r.url)) err(w, 'url must be https');
    if (!r.title || !r.provider || !r.why || !r.duration) err(w, 'missing title/provider/why/duration');
    if (!TYPES.includes(r.type)) err(w, `bad type ${r.type}`);
    if (!LEVELS.includes(r.level)) err(w, `bad level ${r.level}`);
    if (!r.topics?.length || r.topics.length > 4) err(w, 'needs 1-4 topics');
    r.topics?.forEach((t) => !(TOPICS as readonly string[]).includes(t) && err(w, `unknown topic ${t}`));
    if (r.type === 'video' && !isYouTube(r.url) && !/vimeo|ocw\.mit|edx|coursera/.test(r.url)) warn(w, 'video that is not on YouTube');
  }

  // Coverage: every topic should have at least one resource, ideally a free beginner one
  const byTopic = new Map<string, Resource[]>();
  all.forEach((r) => r.topics.forEach((t) => byTopic.set(t, [...(byTopic.get(t) ?? []), r])));
  if (!files.length) {
    const missing = TOPICS.filter((t) => !byTopic.has(t));
    if (missing.length) err('coverage', `topics with no resources: ${missing.join(', ')}`);
    const noFree = TOPICS.filter((t) => byTopic.has(t) && !byTopic.get(t)!.some((r) => r.free));
    if (noFree.length) warn('coverage', `topics without a free resource: ${noFree.join(', ')}`);
    console.log(`\n${all.length} resources · ${byTopic.size}/${TOPICS.length} topics covered · tracks: ${TRACK_IDS.length}`);
  }

  if (!offline) {
    console.log('\nChecking links…');
    const queue = [...all];
    await Promise.all(
      Array.from({ length: 8 }, async () => {
        while (queue.length) await checkLink(queue.shift()!);
      }),
    );
  }

  console.log(`\n${errors} error(s), ${warnings} warning(s)`);
  process.exit(errors ? 1 : 0);
}

void main();
