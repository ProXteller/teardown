/**
 * Search suggestion checks: the local matcher finds the right curated, known and recently opened products for what a
 * student types (typos, word starts, single letters), merges web results without duplicates, and maps a choice to
 * the right teardown id.
 *   npx tsx scripts/test-suggest-local.ts
 */
import { CURATED, parseQuery } from '../src/data/catalog';
import { OFFLINE } from '../src/lib/offline/content';
import type { HistoryItem } from '../src/lib/store';
import { curatedFor, isSpecificAddress, localSuggestions, mergeSuggestions, suggestionQuery, typedSuggestion } from '../src/lib/suggest/local';
import type { Suggestion } from '../src/lib/suggest/types';

let failures = 0;
let checks = 0;
const check = (what: string, ok: boolean, detail = '') => {
  checks++;
  if (ok) return;
  failures++;
  console.log(`  ✗ [${what}] ${detail}`);
};
const show = (list: Suggestion[]) => list.map((s) => `${s.kind}:${s.name}${s.domain ? `@${s.domain}` : ''}`).join(', ') || '(none)';
const uniqueKeys = (what: string, list: Suggestion[]) =>
  check(`${what}: unique keys`, new Set(list.map((s) => s.key)).size === list.length, show(list));

const visit = (item: Partial<HistoryItem> & Pick<HistoryItem, 'id' | 'name'>): HistoryItem => ({
  glyph: '?',
  color: '#000000',
  source: 'scan',
  at: Date.now(),
  ...item,
});

const web = (name: string, domain: string | null, extra: Partial<Suggestion> = {}): Suggestion => ({
  key: domain ? `domain:${domain}` : `app:${name.toLowerCase()}`,
  kind: domain ? 'website' : 'app',
  name,
  domain,
  ...extra,
});

// Local matcher
const insta = localSuggestions('insta', []);
check('insta', insta[0]?.kind === 'curated' && insta[0].curatedId === 'instagram', show(insta));
check('insta: curated fields', insta[0]?.domain === 'instagram.com' && Boolean(insta[0]?.description && insta[0]?.logoGlyph && insta[0]?.brandColor));
check('insta: Instacart listed too', insta.some((s) => s.name === 'Instacart'), show(insta));

const twitter = localSuggestions('twitter', []);
check('twitter', twitter[0]?.curatedId === 'x', show(twitter));
const twit = localSuggestions('twit', []);
check('twit (alias prefix)', twit.some((s) => s.curatedId === 'x'), show(twit));

const zoomProduct = OFFLINE.products.find((p) => p.id === 'zoom');
check('data: Zoom is a known product', Boolean(zoomProduct));
const zoom = localSuggestions('zoom', []);
check('zoom', zoom[0]?.kind === 'known' && zoom[0].name === 'Zoom' && zoom[0].domain === zoomProduct?.domains[0], show(zoom));
check('zoom: known key', zoom[0]?.key === `domain:${zoomProduct?.domains[0]}`, zoom[0]?.key);
check('zoom: tagline', zoom[0]?.description === zoomProduct?.tagline);

const googel = localSuggestions('googel', []);
check('googel typo', googel[0]?.curatedId === 'google', show(googel));
const spotfy = localSuggestions('spotfy', []);
check('spotfy typo', spotfy[0]?.curatedId === 'spotify', show(spotfy));

const drive = localSuggestions('drive', []);
check('drive word prefix', drive[0]?.name === 'Google Drive', show(drive));
const overflow = localSuggestions('overflow', []);
check('overflow word prefix', overflow[0]?.name === 'Stack Overflow', show(overflow));
const york = localSuggestions('york times', []);
check('york times word prefix', york[0]?.name === 'The New York Times', show(york));
const tube = localSuggestions('tube', []);
check('tube camelCase word', tube.some((s) => s.curatedId === 'youtube'), show(tube));

const bsky = localSuggestions('bsky', []);
check('bsky alias/domain label', bsky[0]?.name === 'Bluesky', show(bsky));
const steam = localSuggestions('steampow', []);
check('steampow domain prefix', steam[0]?.name === 'Steam', show(steam));
const googleSub = localSuggestions('google', []);
check('google: curated first', googleSub[0]?.curatedId === 'google', show(googleSub));

const t = localSuggestions('t', [], 50);
check('single letter: results', t.length > 3, show(t));
check('single letter: alias prefix counts', t.some((s) => s.curatedId === 'x') && t.some((s) => s.name === 'Microsoft Teams'), show(t));
const d = localSuggestions('d', [], 50);
check('single letter: name prefix', d.some((s) => s.name === 'Discord') && d.some((s) => s.name === 'Duolingo'), show(d));
check('single letter: no word-start matches', !d.some((s) => s.name === 'Google Drive' || s.name === 'Stack Overflow'), show(d));
check('single letter: limit respected', localSuggestions('t', []).length <= 6 && localSuggestions('t', [], 3).length === 3);
check('limit 2', localSuggestions('google', [], 2).length === 2);

check('empty input', localSuggestions('', []).length === 0 && localSuggestions('   ', []).length === 0);
check('punctuation only', localSuggestions('!!!', []).length === 0);
check('no match', localSuggestions('qwxzvbnm', []).length === 0, show(localSuggestions('qwxzvbnm', [])));

const address = localSuggestions('https://www.linear.app/team/x', []);
check('url input finds its product', address[0]?.name === 'Linear', show(address));
const subdomain = localSuggestions('drive.google.com', []);
check('subdomain url prefers the exact product', subdomain[0]?.name === 'Google Drive', show(subdomain));

// History
const instaVisit = visit({ id: 'instagram', name: 'Instagram', source: 'curated' });
const withCurated = localSuggestions('insta', [instaVisit]);
check('history + curated collapse', withCurated.filter((s) => s.name === 'Instagram').length === 1, show(withCurated));
check('history + curated: stays curated with entryId', withCurated[0]?.kind === 'curated' && withCurated[0]?.entryId === 'instagram', show(withCurated));
uniqueKeys('history + curated', withCurated);

const zoomVisit = visit({ id: 'zoom', name: 'Zoom', query: 'zoom', source: 'scan' });
const withKnown = localSuggestions('zoo', [zoomVisit]);
check('history + known collapse', withKnown.filter((s) => s.name === 'Zoom').length === 1, show(withKnown));
check(
  'history + known: recent with entryId and domain',
  withKnown[0]?.kind === 'recent' && withKnown[0].entryId === 'zoom' && withKnown[0].domain === 'zoom.us',
  JSON.stringify(withKnown[0]),
);
check('history + known: description', withKnown[0]?.description === 'Opened before · Instant', withKnown[0]?.description);
uniqueKeys('history + known', withKnown);

const twoVisits = localSuggestions('zoom', [zoomVisit, visit({ id: 'zoom-us', name: 'Zoom', query: 'zoom.us' })]);
check('two visits of one product show once', twoVisits.filter((s) => s.name === 'Zoom').length === 1, show(twoVisits));

const txst = visit({ id: 'mobile-txst', name: 'Texas State University', query: 'mobile.txst.edu', source: 'ai' });
const withTxst = localSuggestions('texas', [txst]);
check('history address keeps its own domain', withTxst[0]?.kind === 'recent' && withTxst[0].domain === 'mobile.txst.edu', show(withTxst));
check('history ai description', withTxst[0]?.description === 'Opened before · AI teardown', withTxst[0]?.description);

const recentOnly = localSuggestions('acme', [visit({ id: 'acme', name: 'Acme Rockets', query: 'acme' })]);
check('recent-only item', recentOnly.length === 1 && recentOnly[0].kind === 'recent' && recentOnly[0].domain === null, show(recentOnly));
const recentBoost = localSuggestions('pan', [visit({ id: 'pandora', name: 'Pandora', query: 'pandora' })]);
check('recent boost', recentBoost[0]?.kind === 'recent' && recentBoost[0].name === 'Pandora', show(recentBoost));

// isSpecificAddress
const addressCases: [string, boolean][] = [
  ['zoom', false],
  ['zoom.us', true],
  ['https://linear.app/x', true],
  ['google meet', false],
  ['https://x.com', true],
  ['linear.app', true],
  ['localhost', false],
  ['192.168.0.1', false],
  ['', false],
  ['Instagram', false],
  // Framework names with a dot are names, unless typed as a link
  ['Next.js', false],
  ['node.js', false],
  ['three.js', false],
  ['https://next.js', true],
  ['Socket.IO', true],
  ['x.ai', true],
];
for (const [input, expected] of addressCases) check(`isSpecificAddress("${input}")`, isSpecificAddress(input) === expected);

// typedSuggestion
const typedZoom = typedSuggestion('  Zoom ');
check('typed: shape', typedZoom.kind === 'typed' && typedZoom.key === 'typed:zoom' && typedZoom.name === 'Zoom' && typedZoom.domain === null);
check('typed: description', typedZoom.description === 'Tear down “Zoom” as typed', typedZoom.description);
check('typed: domain', typedSuggestion('https://www.Linear.app/x').domain === 'linear.app');
check('typed: a dotted name has no domain', typedSuggestion('Next.js').domain === null);

// mergeSuggestions
const zoomMerged = mergeSuggestions('zoom', localSuggestions('zoom', []), [
  web('Zoom Workplace', 'zoom.us', { kind: 'app', source: 'appstore', iconUrl: 'https://example.com/zoom.png', popularity: 900 }),
  web('Zoom', 'zoom.com', { source: 'clearbit' }),
  web('Zoom Video Communications', 'zoom.us', { source: 'wikidata' }),
  web('Zoom', 'zoom.com.br', { source: 'clearbit' }),
]);
check('merge: typed row redundant when a product is exactly "zoom"', !zoomMerged.some((s) => s.kind === 'typed'), show(zoomMerged));
const zooMerged = mergeSuggestions('zoo', localSuggestions('zoo', []), [web('Zoo Tycoon', 'zootycoon.com', { source: 'clearbit' })]);
check('merge: typed row last', zooMerged[zooMerged.length - 1]?.key === 'typed:zoo' && zooMerged.length === 3, show(zooMerged));
check('merge: typed row once', mergeSuggestions('zoo', [typedSuggestion('zoo')], []).filter((s) => s.kind === 'typed').length === 1);
check('merge: local first', zoomMerged[0]?.kind === 'known' && zoomMerged[0].name === 'Zoom', show(zoomMerged));
check('merge: zoom.us folds into known Zoom', zoomMerged.filter((s) => s.domain === 'zoom.us').length === 1, show(zoomMerged));
check('merge: zoom.com is also known Zoom', !zoomMerged.some((s) => s.domain === 'zoom.com'), show(zoomMerged));
check('merge: zoom.com.br kept as a different site', zoomMerged.some((s) => s.domain === 'zoom.com.br'), show(zoomMerged));
check('merge: icon copied onto local', zoomMerged[0]?.iconUrl === 'https://example.com/zoom.png', JSON.stringify(zoomMerged[0]));
uniqueKeys('merge zoom', zoomMerged);

const zoomLocal = localSuggestions('zoom', []);
mergeSuggestions('zoom', zoomLocal, [web('Zoom Workplace', 'zoom.us', { iconUrl: 'https://example.com/z.png' })]);
check('merge: inputs not mutated', zoomLocal[0].iconUrl === undefined);
check('merge: library not mutated', localSuggestions('zoom', [])[0].iconUrl === undefined);

const instaMerged = mergeSuggestions('instagram', localSuggestions('instagram', []), [
  web('Instagram', 'instagram.com', { source: 'clearbit' }),
  web('Instagram', 'help.instagram.com', { kind: 'app', source: 'appstore', iconUrl: 'https://example.com/ig.png' }),
]);
check('merge: web Instagram folds into curated', instaMerged.filter((s) => /^instagram$/i.test(s.name)).length === 1, show(instaMerged));
check('merge: icon onto curated', instaMerged[0]?.curatedId === 'instagram' && instaMerged[0].iconUrl === 'https://example.com/ig.png');
check('merge: typed row redundant for exact named product', !instaMerged.some((s) => s.kind === 'typed'), show(instaMerged));

const noDomainNamed = mergeSuggestions('acme', [], [web('Acme', null, { source: 'appstore' })]);
check('merge: typed kept when the exact name has no domain', noDomainNamed[noDomainNamed.length - 1]?.kind === 'typed', show(noDomainNamed));

const specific = mergeSuggestions('zoom.com', localSuggestions('zoom.com', []), []);
check('merge: typed kept for an address no item has', specific[specific.length - 1]?.kind === 'typed' && specific[specific.length - 1].domain === 'zoom.com', show(specific));

const googleMerged = mergeSuggestions('google', localSuggestions('google', []), [
  web('Google', 'google.com', { source: 'clearbit', iconUrl: 'https://example.com/g.png' }),
  web('Google Maps', 'google.com', { kind: 'app', source: 'appstore', iconUrl: 'https://example.com/maps.png' }),
  web('Google Maps', 'maps.google.com', { source: 'wikidata' }),
]);
check('merge: google web folds into library', googleMerged.filter((s) => s.kind !== 'typed').every((s) => s.kind === 'curated' || s.kind === 'known'), show(googleMerged));
check('merge: icon only onto a matching name', googleMerged.find((s) => s.curatedId === 'google')?.iconUrl === 'https://example.com/g.png');
check('merge: maps icon not on Google Search', !googleMerged.some((s) => s.curatedId === 'google' && s.iconUrl?.includes('maps')));

const teams = mergeSuggestions('microsoft', localSuggestions('microsoft', []), [web('Microsoft', 'microsoft.com', { source: 'clearbit' })]);
check('merge: a subdomain product does not hide its parent site', teams.some((s) => s.domain === 'microsoft.com' && s.kind === 'website'), show(teams));

const sites = mergeSuggestions('notes', [], [
  web('Notes Pro', 'notespro.com', { source: 'clearbit' }),
  web('Notes Pro', 'help.notespro.com', { source: 'wikidata' }),
  web('Notes', null, { source: 'appstore', popularity: 10 }),
  web('Notes', null, { source: 'appstore', popularity: 5, key: 'app:notes-2' }),
]);
check('merge: web deduped by site', sites.filter((s) => s.domain?.endsWith('notespro.com')).length === 1, show(sites));
check('merge: domainless web deduped by name', sites.filter((s) => s.name === 'Notes').length === 1, show(sites));
uniqueKeys('merge sites', sites);

const ranked = mergeSuggestions('zoom', [], [
  web('Calculator', 'calc.example.com', { source: 'appstore', popularity: 999 }),
  web('Zoom Workplace', 'zoom.us', { source: 'appstore', popularity: 10 }),
  web('Something', 'something.com', { source: 'appstore' }),
  web('Unrelated Far Down', 'far.com', { source: 'appstore' }),
  web('Zoomerang', 'zoomerang.com', { source: 'wikidata', popularity: 50 }),
]);
check('merge: web ranked by name score first', ranked[0]?.name === 'Zoom Workplace' && ranked[1]?.name === 'Zoomerang', show(ranked));
check('merge: top-ranked relevance-light kept', ranked.some((s) => s.name === 'Calculator'), show(ranked));
check('merge: low-ranked unrelated dropped', !ranked.some((s) => s.name === 'Unrelated Far Down'), show(ranked));
const short = mergeSuggestions('zo', [], [web('Calculator', 'calc.example.com', { source: 'appstore' })]);
check('merge: short queries drop unrelated web', !short.some((s) => s.name === 'Calculator'), show(short));
const popular = mergeSuggestions('zoom', [], [web('Zoom Beta', 'zoombeta.com', { popularity: 1 }), web('Zoom Alpha', 'zoomalpha.com', { popularity: 5 })]);
check('merge: popularity breaks ties', popular[0]?.name === 'Zoom Alpha', show(popular));

const many = mergeSuggestions(
  'zoo',
  localSuggestions('zoo', []),
  Array.from({ length: 20 }, (_, i) => web(`Zoom ${i}`, `zoom${i}.com`, { source: 'clearbit' })),
  5,
);
check('merge: limit then typed', many.length === 6 && many[5].kind === 'typed', show(many));
uniqueKeys('merge many', many);
check('merge: empty input', mergeSuggestions('', [], [web('Zoom', 'zoom.us')]).length === 0);

// Regression: the same product on its other official domain, a former domain or under its exact name elsewhere shows once
const zoomApp = mergeSuggestions('zoom', localSuggestions('zoom', []), [web('Zoom', 'zoom.com', { kind: 'app', source: 'appstore', iconUrl: 'https://example.com/zw.png' })]);
check('regression: zoom.com app folds into library Zoom', zoomApp.filter((s) => s.kind !== 'typed').length === localSuggestions('zoom', []).length, show(zoomApp));
check('regression: its icon lands on library Zoom', zoomApp[0]?.name === 'Zoom' && zoomApp[0].iconUrl === 'https://example.com/zw.png', JSON.stringify(zoomApp[0]));
const notionApp = mergeSuggestions('notion', localSuggestions('notion', []), [web('Notion', 'notion.so', { kind: 'app', source: 'appstore' })]);
check('regression: notion.so folds into library Notion (notion.com)', notionApp.filter((s) => s.name === 'Notion').length === 1, show(notionApp));
const twitterWeb = mergeSuggestions('twitter', localSuggestions('twitter', []), [web('Twitter', 'twitter.com', { source: 'clearbit' })]);
check('regression: twitter.com folds into curated X', !twitterWeb.some((s) => s.domain === 'twitter.com'), show(twitterWeb));
const chatgptApp = mergeSuggestions('chatgpt', localSuggestions('chatgpt', []), [web('ChatGPT', 'openai.com', { kind: 'app', source: 'appstore' })]);
check('regression: ChatGPT at openai.com folds into curated ChatGPT', chatgptApp.filter((s) => s.name === 'ChatGPT').length === 1, show(chatgptApp));
const chaseVisit = visit({ id: 'chase', name: 'Chase', query: 'chase', source: 'ai' });
const chase = mergeSuggestions('chase', localSuggestions('chase', [chaseVisit]), [web('Chase', 'chase.com', { kind: 'app' }), web('Chase', 'chase.co.uk')]);
check('regression: a saved plain name covers its guessed domain', !chase.some((s) => s.domain === 'chase.com') && chase.some((s) => s.domain === 'chase.co.uk'), show(chase));

// Regression: other products on a curated or library site stay listed (tv.youtube.com is not YouTube)
const youtubeWeb = mergeSuggestions('youtube', localSuggestions('youtube', []), [
  web('YouTube Kids', 'kids.youtube.com', { kind: 'app', source: 'appstore' }),
  web('YouTube TV', 'tv.youtube.com', { kind: 'app', source: 'appstore' }),
  web('YouTube', 'm.youtube.com', { source: 'wikidata' }),
]);
check('regression: YouTube Kids and YouTube TV kept', youtubeWeb.some((s) => s.name === 'YouTube Kids') && youtubeWeb.some((s) => s.name === 'YouTube TV'), show(youtubeWeb));
check('regression: m.youtube.com still folds into YouTube', !youtubeWeb.some((s) => s.domain === 'm.youtube.com'), show(youtubeWeb));
const googleWeb = mergeSuggestions('google', localSuggestions('google', []), [
  web('Google Meet', 'meet.google.com', { kind: 'app', source: 'appstore' }),
  web('Google Translate', 'translate.google.com', { kind: 'app', source: 'appstore' }),
]);
check('regression: Google Meet and Google Translate both kept', googleWeb.some((s) => s.name === 'Google Meet') && googleWeb.some((s) => s.name === 'Google Translate'), show(googleWeb));

// Regression: an address row is redundant when a listed product has exactly that domain
const linearVisit = visit({ id: 'linear', name: 'Linear', query: 'linear.app' });
const linearAddress = mergeSuggestions('linear.app', localSuggestions('linear.app', [linearVisit]), []);
check('regression: no "as typed" row for an address already listed', !linearAddress.some((s) => s.kind === 'typed'), show(linearAddress));
const twitterTyped = mergeSuggestions('twitter', localSuggestions('twitter', []), []);
check('no "as typed" row when it would open a listed curated teardown', !twitterTyped.some((s) => s.kind === 'typed'), show(twitterTyped));
const xaiTyped = mergeSuggestions('x.ai', localSuggestions('x.ai', []), []);
check('"as typed" row kept for x.ai next to curated X', xaiTyped[xaiTyped.length - 1]?.kind === 'typed', show(xaiTyped));

// suggestionQuery
const known = localSuggestions('zoom', [])[0];
check('query: curated is null', suggestionQuery(insta[0], {}) === null);
check('query: recent is null', suggestionQuery(withKnown[0], {}) === null);
const zq = suggestionQuery(known, {});
check('query: known', zq?.id === 'zoom' && zq.host === 'zoom.us' && zq.raw === 'zoom.us' && zq.displayName === 'Zoom', JSON.stringify(zq));
const sameHost = suggestionQuery(known, { zoom: { host: 'zoom.us' } });
check('query: same site keeps id', sameHost?.id === 'zoom', JSON.stringify(sameHost));
const zoomCom = suggestionQuery(web('Zoom', 'zoom.com', { source: 'clearbit' }), { zoom: { host: 'zoom.us' } });
check('query: id collision uses full domain', zoomCom?.id === 'zoom-com' && zoomCom.host === 'zoom.com' && zoomCom.displayName === 'Zoom', JSON.stringify(zoomCom));
const guessed = suggestionQuery(known, { zoom: { host: null } });
check('query: taken id without host uses full domain', guessed?.id === 'zoom-us', JSON.stringify(guessed));
const xai = suggestionQuery(web('xAI', 'x.ai', { source: 'clearbit' }), {});
check('query: curated id collision uses full domain', xai?.id === 'x-ai' && xai.displayName === 'xAI', JSON.stringify(xai));
const typedUrl = suggestionQuery(typedSuggestion('https://www.linear.app/about'), {});
check('query: typed url keeps parsed name', typedUrl?.raw === 'linear.app' && typedUrl.displayName === 'Linear' && typedUrl.id === 'linear', JSON.stringify(typedUrl));
const typedName = suggestionQuery(typedSuggestion('duolingo'), {});
check('query: typed name matches parseQuery', JSON.stringify(typedName) === JSON.stringify(parseQuery('duolingo')), JSON.stringify(typedName));
const app = suggestionQuery(web('Zoom Workplace', null, { source: 'appstore' }), {});
check('query: no domain', app?.id === 'zoom-workplace' && app.displayName === 'Zoom Workplace' && app.host === null, JSON.stringify(app));

// Regression: a fallback id taken by another site (parseQuery's id for zoom.com.br is "zoom-com") gets a number
const zoomTaken = { zoom: { host: 'zoom.us' }, 'zoom-com': { host: 'zoom.com.br' } };
const zoomNumbered = suggestionQuery(web('Zoom', 'zoom.com', { kind: 'app' }), zoomTaken);
check('regression: taken fallback id is numbered', zoomNumbered?.id === 'zoom-com-2', JSON.stringify(zoomNumbered));
const zoomAgain = suggestionQuery(web('Zoom', 'zoom.com', { kind: 'app' }), { ...zoomTaken, 'zoom-com-2': { host: 'zoom.com' } });
check('regression: numbered id is found again for the same site', zoomAgain?.id === 'zoom-com-2', JSON.stringify(zoomAgain));
const brasil = suggestionQuery(web('Zoom', 'zoom.com.br'), { zoom: { host: 'zoom.us' }, 'zoom-com': { host: 'zoom.com' } });
check('regression: zoom.com.br never reuses zoom.com\'s id', brasil?.id === 'zoom-com-br', JSON.stringify(brasil));

// Regression: a dotted name is not a host
const nextjs = suggestionQuery(typedSuggestion('Next.js'), {});
check('regression: "Next.js" as typed has no host', nextjs?.host === null && nextjs.id === 'next-js' && nextjs.displayName === 'Next.js', JSON.stringify(nextjs));

// Regression: which chosen suggestions open a curated teardown (Gmail at mail.google.com is not Google Search)
const curatedCases: [string, Suggestion, string | undefined][] = [
  ['library Gmail', localSuggestions('gmail', [])[0], undefined],
  ['library Google Drive', localSuggestions('google drive', [])[0], undefined],
  ['library Google Maps', localSuggestions('google maps', [])[0], undefined],
  ['web YouTube TV', web('YouTube TV', 'tv.youtube.com', { kind: 'app' }), undefined],
  ['web YouTube Kids', web('YouTube Kids', 'kids.youtube.com', { kind: 'app' }), undefined],
  ['typed x.ai', typedSuggestion('x.ai'), undefined],
  ['typed discord.me', typedSuggestion('discord.me'), undefined],
  ['typed google.org', typedSuggestion('google.org'), undefined],
  ['typed drive.google.com', typedSuggestion('drive.google.com'), undefined],
  ['typed x.js', typedSuggestion('x.js'), undefined],
  ['typed https://x.com', typedSuggestion('https://x.com'), 'x'],
  ['typed m.instagram.com', typedSuggestion('https://m.instagram.com/zuck'), 'instagram'],
  ['typed twitter.com', typedSuggestion('twitter.com'), 'x'],
  ['typed chatgpt.com', typedSuggestion('chatgpt.com'), 'chatgpt'],
  ['typed insta', typedSuggestion('insta'), 'instagram'],
  ['app Instagram without domain', web('Instagram', null, { source: 'appstore' }), 'instagram'],
  ['web Instagram help site', web('Instagram', 'help.instagram.com'), 'instagram'],
  ['curated row', insta[0], 'instagram'],
  ['recent row', withKnown[0], undefined],
];
for (const [what, s, expected] of curatedCases) check(`curatedFor: ${what}`, curatedFor(s)?.id === expected, `${curatedFor(s)?.id} for ${show([s])}`);

// Every library product is found first by its full name, with no duplicate keys along the way
const names = [...CURATED.map((c) => ({ name: c.name, key: `curated:${c.id}` })), ...OFFLINE.products.map((p) => ({ name: p.name, key: `domain:${p.domains[0]}` }))];
for (const { name, key } of names) {
  const list = localSuggestions(name, []);
  check(`full name "${name}"`, list[0]?.key === key, show(list));
  uniqueKeys(`full name "${name}"`, list);
  const lower = localSuggestions(name.toLowerCase(), []);
  check(`lowercase name "${name}"`, lower[0]?.key === key, show(lower));
}
for (const p of OFFLINE.products) {
  for (const alias of p.aliases) {
    const list = localSuggestions(alias, [], 10);
    check(`alias "${alias}" lists ${p.name}`, list.some((s) => s.key === `domain:${p.domains[0]}`), show(list));
  }
}
// Every prefix of every name keeps keys unique and respects the limit
for (const { name } of names) {
  for (let i = 1; i <= name.length; i++) {
    const list = localSuggestions(name.slice(0, i), [instaVisit, zoomVisit, txst]);
    if (list.length > 6 || new Set(list.map((s) => s.key)).size !== list.length) check(`prefix "${name.slice(0, i)}"`, false, show(list));
  }
}

console.log(`${checks} checks · ${CURATED.length} curated · ${OFFLINE.products.length} known products`);
console.log(failures ? `\n${failures} failure(s)` : '\nSuggestions OK');
process.exit(failures ? 1 : 0);
