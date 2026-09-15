/**
 * Tests the web lookup behind search suggestions (src/lib/suggest/web.ts) against a fake fetch that answers with
 * fixtures shaped like the real App Store, Clearbit and Wikidata responses. No network.
 *   npx tsx scripts/test-suggest-web.ts
 *   npx tsx scripts/test-suggest-web.ts --live   → instead queries the real APIs for a few names and prints what they find
 *                                                  (a separate run: results are cached per query inside the process)
 */
import { normalizeDomain } from '../src/lib/suggest/domain';
import type { SuggestResponse } from '../src/lib/suggest/types';
import { webSuggestions } from '../src/lib/suggest/web';

let problems = 0;
const check = (ok: unknown, what: string) => {
  if (!ok) problems++;
  console.log(`  ${ok ? '✓' : '✗'} ${what}`);
};

/* ------------------------------------------------------------------ */
/* Fixtures                                                             */
/* ------------------------------------------------------------------ */

const ART = (id: string) => `https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/${id}/AppIcon-0-0-1x.png/100x100bb.jpg`;

const app = (trackName: string, sellerName: string, sellerUrl: string | undefined, userRatingCount: number, bundleId: string, extra = {}) => ({
  trackId: Math.floor(Math.random() * 1e9),
  trackName,
  sellerName,
  sellerUrl,
  primaryGenreName: 'Business',
  userRatingCount,
  artworkUrl60: ART(bundleId).replace('100x100', '60x60'),
  artworkUrl100: ART(bundleId),
  trackViewUrl: `https://apps.apple.com/us/app/id${bundleId}`,
  bundleId,
  ...extra,
});

const claim = (value: string, rank = 'normal') => ({ mainsnak: { snaktype: 'value', property: 'P856', datavalue: { value, type: 'string' } }, rank });
const hit = (id: string, label: string, description: string) => ({ id, title: id, label, description, match: { type: 'label', language: 'en', text: label } });

interface Fixture {
  appstore: unknown[];
  clearbit: unknown[];
  wikidata: ReturnType<typeof hit>[];
  websites: Record<string, ReturnType<typeof claim>[]>;
}

const FIXTURES: Record<string, Fixture> = {
  zoom: {
    appstore: [
      app('Zoom Workplace', 'Zoom Communications, Inc.', 'https://www.zoom.com', 3229435, 'us.zoom.videomeetings'),
      app('Zoom Rooms', 'Zoom Communications, Inc.', 'http://zoom.us/zoomrooms', 237, 'us.zoom.zpcontroller'),
      app('Zoom Workplace for Intune', 'Zoom Communications, Inc.', 'https://zoom.us', 18820, 'us.zoom.videomeetings4intune'),
      app('Google Meet', 'Google LLC', 'https://meet.google.com', 2332646, 'com.google.Tachyon', { primaryGenreName: 'Social Networking' }),
      app('Claude by Anthropic', 'Anthropic PBC', 'https://claude.ai', 260582, 'com.anthropic.claude'),
      app('Microsoft Teams', 'Microsoft Corporation', 'http://aka.ms/microsoftteams', 3374175, 'com.microsoft.skype.teams'),
      app('Participant 3rd Party Zoom App', 'Think Tap Work, LLC', 'https://thinktapwork.com/participant/', 7096, 'com.thinktapwork.Participant-for-Zoom'),
      app('xZoom Cam - PRO Camera', 'Slava Plisko', 'https://xzoom.app', 551, 'com.mobndev.xZoom-pro'),
      app('Zoom for BlackBerry', 'Zoom Communications, Inc.', 'http://zoom.us', 272, 'us.zoom.videomeetingsforGood'),
    ],
    clearbit: [
      { name: 'ZoomInfo', domain: 'zoominfo.com', logo: null },
      { name: 'Zoomit', domain: 'zoomit.ir', logo: null },
      { name: 'ZOOMG', domain: 'zoomg.ir', logo: null },
      { name: 'Zoom', domain: 'zoom.com.br', logo: null },
      { name: 'Zoom Corporation', domain: 'zoomcorp.com', logo: null },
      { name: 'Zoom Video Communications', domain: 'zoom.us', logo: null },
      { name: 'Zoomcar', domain: 'zoomcar.com', logo: null },
      { name: 'Zoom Telephonics', domain: 'zoomtel.com', logo: null },
    ],
    wikidata: [
      hit('Q94979732', 'Zoom', 'video-conferencing software'),
      hit('Q1930415', 'Zoom', '2001 studio album by Electric Light Orchestra'),
      hit('Q932299', 'Zoom Corporation', 'Japanese company'),
      hit('Q12898501', 'Zoom', 'Haitian musician'),
      hit('Q16639197', 'GitLab', 'online git source code repository host'),
      hit('Q17460900', 'Zoom Communications', 'company responsible for the Zoom software'),
      hit('Q8074135', 'Zoom', '1972 TV series'),
      hit('Q135077267', 'ZOOM', 'video game developed by 3 ALIENS IN A SAUCER'),
    ],
    websites: {
      Q94979732: [claim('https://www.zoom.com/')],
      Q932299: [claim('http://www.zoom.co.jp/english/index.html/')],
      Q17460900: [claim('https://www.zoom.com/')],
      Q16639197: [claim('https://about.gitlab.com/', 'preferred'), claim('https://gitlab.com/')],
      Q1930415: [claim('https://elo.example.com/')],
    },
  },
  linear: {
    appstore: [
      app('Linear Mobile', 'Linear Orbit, Inc.', 'https://linear.app/mobile', 2088, 'com.linear.ios', { primaryGenreName: 'Productivity' }),
      app('Claude by Anthropic', 'Anthropic PBC', 'https://claude.ai', 260582, 'com.anthropic.claude'),
      app('Linear Algebra - Matrix Solver', 'ALG Software Lab SIA', 'http://aka.ms/linalg', 12, 'com.algsoftlab.LinearAlgebra', {
        artworkUrl100: 'http://is1.mzstatic.com/image/thumb/linalg/100x100bb.jpg',
      }),
      app('Linear Tips', 'Some Person', 'https://www.facebook.com/lineartips', 40, 'com.someone.lineartips', {
        artworkUrl100: 'https://evil.example.com/icon.png',
      }),
      app('Linear Notes', 'Linear Notes Dev', 'https://linearnotes.github.io/app', 9, 'com.linearnotes.app'),
      app('Linear Timer', 'Timer Person', 'https://iosdevasian.blogspot.com', 3, 'com.timer.linear'),
    ],
    clearbit: [
      { name: 'Linear', domain: 'linear.app', logo: null },
      { name: 'LinearB', domain: 'linearb.io', logo: null },
      { name: 'Linear Link', domain: 'linktr.ee', logo: null },
    ],
    wikidata: [
      hit('Q30972', 'Linear A', 'undeciphered writing system from Crete'),
      hit('Q37152072', 'Linear', 'family name'),
      hit('Q13360000', 'Linear Algebra and its Applications', 'mathematical journal'),
      hit('Q999001', 'Linear', 'issue tracking software'),
    ],
    websites: { Q999001: [claim('https://linear.app')] },
  },
  txst: {
    appstore: [
      app('Park TXST', 'ParkZen LLC', undefined, 11, 'com.parkzen.txst'),
      app('Bobcat Safe Rides', 'Downtowner App Inc.', 'https://www.txst.edu', 16, 'com.downtownerapp.license.txst.rider'),
      app('Canvas by Instructure', 'Instructure, Inc.', 'https://www.canvaslms.com/', 2768148, 'com.instructure.icanvas'),
    ],
    clearbit: [
      { name: 'Texas State University', domain: 'txst.edu', logo: null },
      { name: 'TxStreet', domain: 'txstreet.com', logo: null },
      { name: 'TX Stafford Plumbing', domain: 'txstaffordplumbing.com', logo: null },
    ],
    wikidata: [
      hit('Q1495387', 'Texas State University', 'public research university in San Marcos, Texas, United States'),
      hit('Q106158576', 'Texas State Undergraduate Research Journal', 'journal'),
    ],
    websites: { Q1495387: [claim('https://www.txstate.edu', 'deprecated'), claim('https://www.txst.edu/')] },
  },
  chatgpt: {
    appstore: [app('ChatGPT', 'OpenAI OpCo, LLC', 'https://openai.com/chatgpt', 3500000, 'com.openai.chat', { primaryGenreName: 'Productivity' })],
    clearbit: [],
    wikidata: [hit('Q125000001', 'ChatGPT Search', 'search engine by OpenAI')],
    websites: { Q125000001: [claim('https://openai.com/index/introducing-chatgpt-search/')] },
  },
  flashcards: {
    appstore: [
      app('Flashcards Deluxe', 'Dev A', 'https://u488ba950.app-ads-txt.com/app-ads.txt', 50, 'com.a.flash'),
      app('Flashcards Toll', 'Dev B', 'https://o62171e05.app-ads-txt.com', 40, 'com.b.flash'),
      app('Flashcards Maker', 'Dev C', 'http://jin-apps.s3-website.ap-northeast-2.amazonaws.com/privacy', 30, 'com.c.flash'),
      app('Flashcards Raw', 'Dev D', 'https://raw.githubusercontent.com/dev/flash/main/privacy.md', 20, 'com.d.flash'),
      app('Flashcards Flashy', 'Dev E', 'https://www.patreon.com/flashy', 10, 'com.e.flash'),
      app('Flashcards Itch', 'Dev F', 'https://flashcards.itch.io', 5, 'com.f.flash'),
    ],
    clearbit: [],
    wikidata: [],
    websites: {},
  },
  readers: {
    appstore: [],
    clearbit: [],
    wikidata: [
      hit('Q200001', 'Readers Goodreads', 'social book catalog website'),
      hit('Q200002', 'Readers Books', 'e-book application by Apple'),
      hit('Q200003', 'Readers Journal', 'smartphone and desktop app for journaling'),
      hit('Q200004', 'Readers Budget', 'American multi-platform personal budgeting program'),
      hit('Q200005', 'Readers Novel', 'novel by an American writer'),
    ],
    websites: {
      Q200001: [claim('https://flashgoodreads.com')],
      Q200002: [claim('https://flashbooks.com')],
      Q200003: [claim('https://flashjournal.com')],
      Q200004: [claim('https://flashbudget.com')],
      Q200005: [claim('https://flashnovel.com')],
    },
  },
  notion: {
    appstore: [
      app('Notion: Notes, Tasks, AI', 'Notion Labs, Incorporated', 'https://www.notion.so', 90098, 'notion.id'),
      app('Notion Mail', 'Notion Labs, Incorporated', 'https://www.notion.com/product/mail', 122, 'so.notion.Mail'),
      app('Widget for Notion', 'YUYA YOSHIDA', 'https://yuya-yoshida.notion.site/25d53ccd99ab8095abd5f14db8b5800b', 32, 'com.yossy.notion-widget'),
    ],
    clearbit: [{ name: 'Notion', domain: 'notion.so', logo: null }],
    wikidata: [hit('Q60747998', 'Notion', 'productivity software')],
    websites: { Q60747998: [claim('https://www.notion.com', 'preferred'), claim('https://www.notion.so', 'deprecated')] },
  },
};

/* ------------------------------------------------------------------ */
/* Fake fetch                                                           */
/* ------------------------------------------------------------------ */

interface FakeOptions {
  /** Hosts that never answer (and ignore the abort signal) */
  hang?: string[];
  /** Hosts that answer 500 */
  fail?: string[];
  /** Hosts that answer 403, like the App Store when it rate limits */
  limited?: string[];
  /** Wikidata answers HTTP 200 with a MediaWiki error body */
  wikidataError?: boolean;
  delayMs?: number;
}

function fakeFetch(options: FakeOptions = {}) {
  const calls: URL[] = [];
  const agents: string[] = [];
  const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    calls.push(url);
    agents.push(new Headers(init?.headers).get('user-agent') ?? '');
    if (options.delayMs) await new Promise((resolve) => setTimeout(resolve, options.delayMs));
    if (options.hang?.includes(url.hostname)) return new Promise<Response>(() => {});
    if (options.fail?.includes(url.hostname)) return new Response('Internal error', { status: 500 });
    if (options.limited?.includes(url.hostname)) return new Response('Forbidden', { status: 403 });
    const term = (url.searchParams.get('term') ?? url.searchParams.get('query') ?? url.searchParams.get('search') ?? '').toLowerCase();
    if (url.hostname === 'itunes.apple.com') {
      const results = FIXTURES[term]?.appstore ?? [];
      return Response.json({ resultCount: results.length, results });
    }
    if (url.hostname === 'autocomplete.clearbit.com') return Response.json(FIXTURES[term]?.clearbit ?? []);
    if (options.wikidataError && url.hostname === 'www.wikidata.org') return Response.json({ error: { code: 'internal_api_error_DBQueryError', info: 'Database error' } });
    if (url.hostname === 'www.wikidata.org' && url.searchParams.get('action') === 'wbsearchentities') {
      return Response.json({ searchinfo: { search: term }, search: FIXTURES[term]?.wikidata ?? [], success: 1 });
    }
    if (url.hostname === 'www.wikidata.org' && url.searchParams.get('action') === 'wbgetentities') {
      const websites = Object.assign({}, ...Object.values(FIXTURES).map((f) => f.websites)) as Fixture['websites'];
      const ids = (url.searchParams.get('ids') ?? '').split('|');
      const entities = Object.fromEntries(ids.map((id) => [id, { type: 'item', id, claims: websites[id] ? { P856: websites[id] } : {} }]));
      return Response.json({ entities, success: 1 });
    }
    return new Response('Not found', { status: 404 });
  }) as typeof fetch;
  return { fetcher, calls, agents };
}

function checkShape(label: string, res: SuggestResponse) {
  const keys = res.suggestions.map((s) => s.key);
  check(Array.isArray(res.suggestions) && res.suggestions.length <= 8, `${label}: at most 8 suggestions (${res.suggestions.length})`);
  check(new Set(keys).size === keys.length, `${label}: unique keys`);
  check(
    res.suggestions.every((s) => s.domain === null || normalizeDomain(s.domain) === s.domain),
    `${label}: every domain is already normalized`,
  );
  check(
    res.suggestions.every((s) => (s.domain ? s.key.startsWith('domain:') : s.key.startsWith('app:'))),
    `${label}: keys are domain:<site> or app:<bundleId>`,
  );
  check(
    res.suggestions.every((s) => !s.iconUrl || /^https:\/\/[^/]+\.mzstatic\.com\//.test(s.iconUrl)),
    `${label}: icons are https App Store artwork only`,
  );
}

const names = (res: SuggestResponse) => res.suggestions.map((s) => s.name);

async function offline() {
  console.log('\nzoom');
  const zoom = fakeFetch();
  const z = await webSuggestions('zoom', { fetch: zoom.fetcher });
  console.log(`    ${z.suggestions.map((s) => `${s.name} (${s.domain ?? s.key})`).join(', ')}`);
  checkShape('zoom', z);
  check(z.suggestions.length === 8, 'zoom: many matches are capped at 8');
  check(z.sources.length === 3 && z.sources.every((s) => s.ok), 'zoom: all three sources ok');
  check(!names(z).some((n) => /google meet|claude|teams|xzoom|gitlab/i.test(n)), 'zoom: unrelated App Store and Wikidata results are dropped');
  const zoomSite = z.suggestions.filter((s) => s.domain && /^(zoom\.com|zoom\.us)$/.test(s.domain));
  check(zoomSite.length === 1, `zoom: Zoom Workplace, Zoom Rooms, Intune, BlackBerry and the websites collapse into one (${zoomSite.length})`);
  const top = z.suggestions[0];
  check(top?.name === 'Zoom' && top.domain === 'zoom.com', `zoom: first is "Zoom" at zoom.com (${top?.name} ${top?.domain})`);
  check(top?.iconUrl === ART('us.zoom.videomeetings') && top.popularity === 3229435, 'zoom: it keeps the most-rated app’s icon and rating count');
  check(top?.kind === 'app' && top.source === 'appstore', 'zoom: merged suggestion keeps the first source (App Store)');
  check(top?.description === 'Video-conferencing software', `zoom: Wikidata description, capitalized (${top?.description})`);
  check(!z.suggestions.some((s) => /album|musician|tv series/i.test(s.description ?? '')), 'zoom: album, musician and TV series are filtered out');
  const getEntities = zoom.calls.filter((u) => u.searchParams.get('action') === 'wbgetentities');
  const ids = getEntities[0]?.searchParams.get('ids')?.split('|') ?? [];
  check(getEntities.length === 1, `zoom: official websites come from one batched wbgetentities call (${getEntities.length})`);
  check(ids.includes('Q94979732') && ids.includes('Q17460900') && !ids.includes('Q1930415') && !ids.includes('Q12898501'), `zoom: batch holds only kept items (${ids.join('|')})`);
  check(zoom.calls.length === 4, `zoom: 4 requests in total (${zoom.calls.length})`);
  check(zoom.agents.every((a) => a.startsWith('TeardownResearch/1.0 (')), 'zoom: every request sends the descriptive user agent');
  check(zoom.calls.every((u) => u.protocol === 'https:'), 'zoom: every request is https');

  console.log('\nlinear');
  const linear = fakeFetch();
  const l = await webSuggestions('linear', { fetch: linear.fetcher });
  console.log(`    ${l.suggestions.map((s) => `${s.name} (${s.domain ?? s.key})`).join(', ')}`);
  checkShape('linear', l);
  check(!names(l).some((n) => /claude/i.test(n)), 'linear: "Claude by Anthropic" is dropped');
  check(!names(l).some((n) => /linear a$|journal/i.test(n)) && !l.suggestions.some((s) => s.description === 'Family name'), 'linear: writing system, family name and journal are dropped');
  const linearApp = l.suggestions.filter((s) => s.domain === 'linear.app');
  check(linearApp.length === 1 && linearApp[0].name === 'Linear', `linear: the app, Clearbit and Wikidata merge into "Linear" (${linearApp.map((s) => s.name)})`);
  check(linearApp[0]?.key === 'domain:linear.app' && linearApp[0].iconUrl === ART('com.linear.ios'), 'linear: keyed by site, with the app’s icon');
  const algebra = l.suggestions.find((s) => s.name === 'Linear Algebra');
  check(algebra, 'linear: "Linear Algebra - Matrix Solver" is shortened to "Linear Algebra"');
  check(algebra?.domain === null && algebra.key === 'app:com.algsoftlab.LinearAlgebra', `linear: aka.ms seller URL gives no domain (${algebra?.domain})`);
  check(algebra && !algebra.iconUrl, 'linear: http artwork is not used as an icon');
  const tips = l.suggestions.find((s) => s.name === 'Linear Tips');
  check(tips?.domain === null && !tips.iconUrl, 'linear: a facebook.com page is not the product’s domain, and a non-Apple icon is dropped');
  check(l.suggestions.find((s) => s.name === 'Linear Notes')?.domain === 'linearnotes.github.io', 'linear: a github.io project site is kept');
  check(l.suggestions.find((s) => s.name === 'Linear Timer')?.domain === null, 'linear: a personal blogspot.com page is dropped');
  check(!l.suggestions.some((s) => s.domain === 'linktr.ee'), 'linear: linktr.ee is never a domain');
  check(l.suggestions[0]?.name === 'Linear', `linear: exact name ranks first (${l.suggestions[0]?.name})`);

  console.log('\ntxst');
  const t = await webSuggestions('txst', { fetch: fakeFetch().fetcher });
  console.log(`    ${t.suggestions.map((s) => `${s.name} (${s.domain ?? s.key})`).join(', ')}`);
  checkShape('txst', t);
  check(t.suggestions[0]?.name === 'Texas State University' && t.suggestions[0].domain === 'txst.edu', 'txst: the site named txst ranks first');
  check(t.suggestions.filter((s) => s.domain === 'txst.edu').length === 1, 'txst: Clearbit and Wikidata merge (deprecated txstate.edu ignored)');
  check(!names(t).includes('Bobcat Safe Rides') && !names(t).includes('Canvas by Instructure'), 'txst: apps are matched by name, not by seller URL');
  check(names(t).includes('Park TXST'), 'txst: an app with the query as a later word is kept');
  check(names(t).includes('TxStreet') && !names(t).includes('TX Stafford Plumbing'), 'txst: "TxStreet" matches, "TX Stafford" (across words) does not');

  console.log('\nnotion');
  const n = await webSuggestions('notion', { fetch: fakeFetch().fetcher });
  console.log(`    ${n.suggestions.map((s) => `${s.name} (${s.domain ?? s.key})`).join(', ')}`);
  checkShape('notion', n);
  check(n.suggestions.filter((s) => /^notion\.(so|com)$/.test(s.domain ?? '')).length === 1, 'notion: notion.so and notion.com from one seller collapse');
  check(n.suggestions[0]?.name === 'Notion' && n.suggestions[0].domain === 'notion.so', `notion: "Notion: Notes, Tasks, AI" becomes "Notion" (${n.suggestions[0]?.name})`);
  check(n.suggestions.find((s) => s.name === 'Widget for Notion')?.domain === null, 'notion: someone’s notion.site page is not a domain');

  console.log('\nshort input, cache and in-flight');
  const none = fakeFetch();
  const short = await webSuggestions(' z ', { fetch: none.fetcher });
  check(short.suggestions.length === 0 && short.sources.length === 0 && none.calls.length === 0, 'fewer than 2 characters makes no requests');
  const again = fakeFetch();
  const cached = await webSuggestions('  ZOOM ', { fetch: again.fetcher });
  check(again.calls.length === 0 && cached.suggestions.length === z.suggestions.length, 'the same query (any case) is served from cache');
  check(cached.query === 'ZOOM', `the cached response echoes this query (${cached.query})`);
  const shared = fakeFetch({ delayMs: 30 });
  const [a, b] = await Promise.all([webSuggestions('Figma', { fetch: shared.fetcher }), webSuggestions('figma', { fetch: shared.fetcher })]);
  check(shared.calls.length === 3 && a.sources.length === 3 && b.sources.length === 3, `identical concurrent queries share one lookup (${shared.calls.length} requests)`);
  check(a.query === 'Figma' && b.query === 'figma', 'each concurrent caller gets its own query echoed');
  const long = await webSuggestions('x'.repeat(200), { fetch: fakeFetch().fetcher });
  check(long.query.length === 60, 'input is clipped to 60 characters');

  console.log('\nfailures');
  const slow = fakeFetch({ hang: ['autocomplete.clearbit.com'] });
  const started = Date.now();
  const partial = await webSuggestions('Notion Labs', { fetch: slow.fetcher, timeoutMs: 150 });
  const elapsed = Date.now() - started;
  const clearbitStatus = partial.sources.find((s) => s.name === 'clearbit');
  check(clearbitStatus && !clearbitStatus.ok && clearbitStatus.ms >= 140, `a hanging source reports ok:false after its timeout (${clearbitStatus?.ms} ms)`);
  check(elapsed < 1000, `...without holding up the response (${elapsed} ms)`);
  check(partial.sources.filter((s) => s.ok).length === 2, 'the other sources still report ok');
  const broken = fakeFetch({ fail: ['itunes.apple.com', 'www.wikidata.org'] });
  const onlyClearbit = await webSuggestions('linearb', { fetch: broken.fetcher });
  check(onlyClearbit.sources.filter((s) => !s.ok).map((s) => s.name).join() === 'appstore,wikidata', 'HTTP errors report ok:false for those sources');
  const garbage = (async () => new Response('<html>not json</html>', { status: 200 })) as unknown as typeof fetch;
  const bad = await webSuggestions('garbage in', { fetch: garbage });
  check(bad.suggestions.length === 0 && bad.sources.every((s) => !s.ok), 'non-JSON answers never throw');
  const weird = (async () => Response.json({ results: [null, 7, { trackName: 42 }], search: 'nope' })) as unknown as typeof fetch;
  const odd = await webSuggestions('weird shapes', { fetch: weird });
  check(Array.isArray(odd.suggestions) && odd.suggestions.length === 0, 'unexpected JSON shapes never throw');

  console.log('\nregressions');
  const chatgpt = await webSuggestions('chatgpt', { fetch: fakeFetch().fetcher });
  const openai = chatgpt.suggestions.find((s) => s.domain === 'openai.com');
  check(openai && openai.description !== 'Search engine by OpenAI', `a Wikidata item named differently doesn't describe the group (${openai?.description})`);
  check(openai?.description === 'Productivity app · OpenAI OpCo, LLC', 'the app’s genre and seller describe it instead');

  const flash = await webSuggestions('flashcards', { fetch: fakeFetch().fetcher });
  console.log(`    ${flash.suggestions.map((s) => `${s.name} (${s.domain ?? s.key}) ${s.description ?? ''}`).join(', ')}`);
  checkShape('flashcards', flash);
  check(!flash.suggestions.some((s) => /app-ads-txt|githubusercontent|amazonaws|patreon/.test(s.domain ?? '')), 'ads.txt, raw file, S3 and Patreon hosts are never a product’s domain');
  check(['Flashcards Deluxe', 'Flashcards Toll', 'Flashcards Maker', 'Flashcards Raw', 'Flashcards Flashy'].every((n) => names(flash).includes(n)), 'apps on those hosts stay separate instead of merging by host');
  check(flash.suggestions.find((s) => s.name === 'Flashcards Itch')?.domain === 'flashcards.itch.io', 'an itch.io page named after the product is kept as its own host');
  const readers = await webSuggestions('readers', { fetch: fakeFetch().fetcher });
  check(
    ['Readers Goodreads', 'Readers Books', 'Readers Journal', 'Readers Budget'].every((n) => names(readers).includes(n)),
    `Wikidata software described with "book", "journaling" or "personal" is kept (${names(readers).join(', ')})`,
  );
  check(!names(readers).includes('Readers Novel'), 'a novel is still dropped');

  const errorBody = await webSuggestions('linear errors', { fetch: fakeFetch({ wikidataError: true }).fetcher });
  check(errorBody.sources.find((s) => s.name === 'wikidata')?.ok === false, 'a MediaWiki error body (HTTP 200) reports Wikidata ok:false');

  const limited = fakeFetch({ limited: ['itunes.apple.com'] });
  const first = await webSuggestions('rate one', { fetch: limited.fetcher });
  const later = await webSuggestions('rate two', { fetch: limited.fetcher });
  const storeCalls = limited.calls.filter((u) => u.hostname === 'itunes.apple.com').length;
  check(first.sources[0]?.ok === false && later.sources[0]?.ok === false, 'a rate-limited App Store reports ok:false');
  check(storeCalls === 1, `...and is not asked again for the next keystrokes (${storeCalls} App Store requests)`);
  check(later.sources.filter((s) => s.ok).length === 2, '...while the other sources still answer');

  const junk = fakeFetch();
  for (const q of ['https:', 'https:/', 'https://', '..', '😀😀', 'www.']) {
    const res = await webSuggestions(q, { fetch: junk.fetcher });
    if (res.suggestions.length || res.sources.length) check(false, `"${q}" looks nothing up`);
  }
  check(junk.calls.length === 0, `a scheme, punctuation or emoji alone makes no requests (${junk.calls.length})`);
  const scheme = fakeFetch();
  const withScheme = await webSuggestions('https://www.zoominfo', { fetch: scheme.fetcher });
  check(scheme.calls.some((u) => u.searchParams.get('term') === 'zoominfo') && withScheme.query === 'https://www.zoominfo', 'a typed scheme and www. are left out of the lookup');

  const emoji = await webSuggestions(`${'a'.repeat(59)}😀`, { fetch: fakeFetch().fetcher });
  check(!/[\uD800-\uDBFF]$/.test(emoji.query) && emoji.sources.every((s) => s.ok), `an emoji at the 60-character limit isn't split, so every source still answers (${JSON.stringify(emoji.query.slice(-2))})`);
}

async function live() {
  for (const q of ['linear', 'zoom', 'notion', 'txst']) {
    const started = Date.now();
    const res = await webSuggestions(q);
    console.log(`\n"${q}" (${Date.now() - started} ms; ${res.sources.map((s) => `${s.name} ${s.ok ? 'ok' : 'FAILED'} ${s.ms}ms`).join(', ')})`);
    res.suggestions.forEach((s) =>
      console.log(`    ${s.kind.padEnd(7)} ${s.name} · ${s.domain ?? '(no domain)'} · ${s.description ?? ''}${s.iconUrl ? ' · icon' : ''}${s.popularity ? ` · ${s.popularity}` : ''}`),
    );
    check(Array.isArray(res.suggestions), `${q}: didn’t throw and returned an array`);
  }
}

(async () => {
  await (process.argv.includes('--live') ? live() : offline());
  console.log(problems ? `\n${problems} problem(s)` : '\nAll checks passed');
  process.exit(problems ? 1 : 0);
})();
