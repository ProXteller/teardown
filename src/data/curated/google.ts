import type { Teardown } from '../types';

export const google: Teardown = {
  id: 'google',
  name: 'Google Search',
  url: 'google.com',
  tagline: 'Type a question and get the most useful pages on the web in a fraction of a second.',
  category: 'Search engine',
  brandColor: '#4285F4',
  accentColor: '#34A853',
  logoGlyph: 'G',
  source: 'curated',

  eli5:
    "Google is like a librarian who has already skimmed the whole web. Programs called crawlers keep visiting web pages and copying them, and Google turns those copies into a giant index, like the one at the back of a textbook, that lists which pages contain each word. When you search, many computers look up your words in that index at the same time, score the matching pages for how useful they seem, and send back the best ones before you can blink.",

  facts: [
    { label: 'Founded', value: 'September 1998 (started as BackRub at Stanford in 1996)' },
    { label: 'Founders', value: 'Larry Page & Sergey Brin' },
    { label: 'Parent company', value: 'Alphabet Inc. (since 2015)' },
    { label: 'Headquarters', value: 'Mountain View, California' },
    { label: 'The name', value: 'A play on "googol", the number 1 followed by 100 zeros' },
    { label: 'Index size', value: 'Hundreds of billions of web pages (per Google)' },
    { label: 'Known for (tech)', value: 'PageRank, plus the GFS, MapReduce and Bigtable papers' },
  ],

  history: [
    {
      year: '1996',
      title: 'BackRub at Stanford',
      detail:
        "Stanford PhD students Larry Page and Sergey Brin built a search engine called BackRub. Its big idea was to judge how important a page is by looking at the links pointing to it, its 'backlinks'.",
    },
    {
      year: '1998',
      title: 'Google is born',
      detail:
        "Page and Brin published a paper describing their search engine and the PageRank algorithm, then incorporated Google in September 1998 and moved into a friend's garage in Menlo Park, California.",
    },
    {
      year: '2003',
      title: 'The Google File System paper',
      detail:
        'Google described GFS, a file system that spreads enormous files across thousands of cheap computers and keeps extra copies, so nothing is lost when a machine breaks.',
    },
    {
      year: '2004',
      title: 'MapReduce and the IPO',
      detail:
        "Jeff Dean and Sanjay Ghemawat's MapReduce paper showed how to split giant jobs, like building the search index, across many machines. In August, Google went public on the stock market.",
    },
    {
      year: '2006',
      title: 'Bigtable paper',
      detail:
        'Google published Bigtable, its system for storing one gigantic table across many machines. Together with GFS and MapReduce, these papers inspired open-source projects like Hadoop and HBase.',
    },
    {
      year: '2010',
      title: 'Caffeine: a fresher index',
      detail:
        'Google switched to a new indexing system called Caffeine that updates the index continuously in small pieces instead of in big batches, which Google said made results about 50 percent fresher.',
    },
    {
      year: '2012',
      title: 'Knowledge Graph and Spanner',
      detail:
        "Search started understanding 'things, not strings': the Knowledge Graph connects facts about real people, places and things. The same year Google published Spanner, a database spread across data centers worldwide.",
    },
    {
      year: '2015',
      title: 'RankBrain, Alphabet and Borg',
      detail:
        'Google revealed RankBrain, a machine-learning system that helps interpret unfamiliar searches. It also reorganized under a new parent company, Alphabet, and published a paper on Borg, the cluster manager that inspired Kubernetes.',
    },
    {
      year: '2019',
      title: 'BERT understands whole sentences',
      detail:
        "Google began using BERT, a language model that reads the words around each word, to understand queries better. Google said it would affect about 1 in 10 English searches in the U.S.",
    },
    {
      year: '2024',
      title: 'AI Overviews',
      detail:
        'At Google I/O in May 2024, AI Overviews launched in the U.S.: a Gemini model writes a short summary at the top of some results pages, with links to its sources. AI Mode, a chat-style search, followed in 2025.',
    },
  ],

  languages: [
    { name: 'C++', usedFor: 'Speed-critical core systems: crawling, indexing, ranking and the servers that answer searches', share: 40 },
    { name: 'Java', usedFor: 'Many backend services and large data-processing pipelines', share: 18 },
    { name: 'JavaScript / TypeScript', usedFor: 'The search page in your browser: search box, autocomplete and interactive results', share: 18 },
    { name: 'Go', usedFor: 'Infrastructure tools and networked services (Go was created at Google)', share: 12 },
    { name: 'Python', usedFor: 'Scripts, data analysis, internal tools and machine-learning research', share: 12 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'HTML, CSS & JavaScript',
          role: 'The search page itself',
          beginnerNote:
            'Your browser receives the results page as HTML, styles it with CSS, and runs JavaScript for extras like live suggestions while you type.',
          confidence: 'confirmed',
        },
        {
          name: 'Server-side rendering',
          role: 'Results arrive as a ready-made page',
          beginnerNote:
            "Google's servers build most of the results page before sending it, so something useful appears quickly even on a slow phone.",
          confidence: 'likely',
        },
        {
          name: 'TypeScript',
          role: 'Typed JavaScript for web code',
          beginnerNote:
            'TypeScript is an approved language at Google, and its types catch mistakes like a misspelled property name before the code ever reaches users.',
          confidence: 'likely',
        },
        {
          name: 'Closure Compiler',
          role: 'Shrinks and optimizes JavaScript',
          beginnerNote:
            "An open-source Google tool that renames and removes unused code so pages download faster, a bit like vacuum-packing clothes to fit a suitcase.",
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'C++',
          role: 'Main language for search serving',
          beginnerNote:
            'Search must answer in a fraction of a second over enormous data, and C++ gives engineers tight control over speed and memory.',
          confidence: 'confirmed',
        },
        {
          name: 'Google Web Server (GWS)',
          role: 'Builds the results page',
          beginnerNote:
            'Google wrote its own web server to coordinate each search, and you can even spot its name, "gws", in the response headers of google.com.',
          confidence: 'confirmed',
        },
        {
          name: 'Protocol Buffers',
          role: 'Compact data format between services',
          beginnerNote:
            'You describe your data once in a .proto file and get matching code for many languages, like a shared form that every office knows how to fill in.',
          confidence: 'confirmed',
        },
        {
          name: 'Stubby / gRPC',
          role: 'How services call each other',
          beginnerNote:
            "Google's services ask each other for data with remote procedure calls through an internal system called Stubby. In 2015 Google open-sourced gRPC, its next-generation version of Stubby.",
          confidence: 'confirmed',
        },
        {
          name: 'Go',
          role: 'Language for networked services and tools',
          beginnerNote:
            'Go was created at Google and announced in 2009 to make large networked programs simpler to write and much faster to compile.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'Inverted index (sharded)',
          role: 'Word-to-pages lookup',
          beginnerNote:
            'Like the index at the back of a textbook but for hundreds of billions of pages, split into pieces called shards so many machines can search it at once.',
          confidence: 'confirmed',
        },
        {
          name: 'Bigtable',
          role: 'Giant sorted tables',
          beginnerNote:
            "A database that spreads one huge table over thousands of machines, and its original paper lists web indexing among the Google projects that use it.",
          confidence: 'confirmed',
        },
        {
          name: 'Colossus (successor to GFS)',
          role: 'Distributed file system',
          beginnerNote:
            'Chops files into pieces stored across many machines with enough redundancy that a broken disk never loses data.',
          confidence: 'confirmed',
        },
        {
          name: 'Spanner',
          role: 'Globally consistent database',
          beginnerNote:
            'A database spread across data centers worldwide that uses atomic clocks and GPS to agree on the order of changes, and Google Ads data runs on it.',
          confidence: 'likely',
        },
        {
          name: 'Knowledge Graph',
          role: 'Facts about people, places & things',
          beginnerNote:
            'A web of facts and connections, such as which city a landmark is in, used for the info boxes that answer questions right on the results page.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Google data centers',
          role: 'Where search runs',
          beginnerNote:
            'Google designs its own servers and data centers and runs them on several continents, so searches are answered from somewhere reasonably close to you.',
          confidence: 'confirmed',
        },
        {
          name: 'Borg',
          role: 'Cluster manager',
          beginnerNote:
            'Decides which machine runs which program and restarts jobs when machines fail, like a manager assigning shifts, and it inspired the open-source Kubernetes.',
          confidence: 'confirmed',
        },
        {
          name: 'Maglev & Google Front End',
          role: 'Load balancing and HTTPS',
          beginnerNote:
            'Maglev spreads incoming connections across many front-end machines, and the Google Front End unlocks the encrypted connection and routes each request to the right service.',
          confidence: 'confirmed',
        },
        {
          name: 'QUIC / HTTP/3',
          role: 'Faster connections',
          beginnerNote:
            'Google invented QUIC so connections start faster and cope better with lost data on shaky networks, and it became the standard underneath HTTP/3.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'RankBrain',
          role: 'Understanding unfamiliar searches',
          beginnerNote:
            'A machine-learning system revealed in 2015 that relates words to concepts, so a search Google has never seen before can still find relevant pages.',
          confidence: 'confirmed',
        },
        {
          name: 'BERT',
          role: 'Reading queries as whole sentences',
          beginnerNote:
            'A language model that looks at the words before and after each word, so tiny words like "to" and "for" change the meaning the way they should.',
          confidence: 'confirmed',
        },
        {
          name: 'Gemini',
          role: 'Writes AI Overviews',
          beginnerNote:
            "Google's large language model family, and a custom version of it writes the short AI summaries that appear above some results.",
          confidence: 'confirmed',
        },
        {
          name: 'TPUs',
          role: 'Custom AI chips',
          beginnerNote:
            'Tensor Processing Units are chips Google designed just for machine-learning math, and Google said it used them to serve BERT in Search.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        {
          name: 'Monorepo (Piper)',
          role: 'One giant shared codebase',
          beginnerNote:
            'Most of Google\'s code lives in a single repository with billions of lines, so any engineer can find and reuse code from other teams.',
          confidence: 'confirmed',
        },
        {
          name: 'Bazel (Blaze)',
          role: 'Build system',
          beginnerNote:
            'Only rebuilds and retests the parts of the code affected by a change, and Google open-sourced it as Bazel in 2015.',
          confidence: 'confirmed',
        },
        {
          name: 'Site Reliability Engineering',
          role: 'Keeping search online',
          beginnerNote:
            'Google invented the SRE job: software engineers who run production systems, automate repetitive work and set clear goals for how reliable a service must be.',
          confidence: 'confirmed',
        },
        {
          name: 'Search experiments & raters',
          role: 'Testing changes before launch',
          beginnerNote:
            'Proposed ranking changes are tried on a small slice of real searches and judged by human raters using public guidelines before they reach everyone.',
          confidence: 'confirmed',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      // Tier 0: clients and the outside web
      {
        id: 'browser',
        label: 'Your browser',
        kind: 'client',
        tier: 0,
        tech: 'Chrome, Safari, Firefox or the Google app',
        description:
          'Where you type your search. It shows the search box and suggestions and draws the results page Google sends back.',
      },
      {
        id: 'websites',
        label: 'Websites',
        kind: 'external',
        tier: 0,
        tech: 'The public web (HTML pages and robots.txt files)',
        description:
          'Billions of sites run by other people. Google does not own them; its crawler visits them like any other visitor and reads robots.txt to see what it may fetch.',
      },
      // Tier 1: edge
      {
        id: 'dns',
        label: 'DNS',
        kind: 'edge',
        tier: 1,
        tech: "Google's DNS servers",
        description:
          "The internet's phone book. It turns the name google.com into the numeric address of a Google server, usually one near you.",
      },
      {
        id: 'gfe',
        label: 'Google Front End',
        kind: 'edge',
        tier: 1,
        tech: 'Maglev load balancers + GFE',
        description:
          "Google's front door. Maglev spreads connections across many GFE machines, which unlock the encrypted HTTPS request and pass it to the right service.",
      },
      // Tier 2: API / gateway
      {
        id: 'gws',
        label: 'Google Web Server',
        kind: 'gateway',
        tier: 2,
        tech: 'GWS (C++)',
        description:
          'The coordinator for each search. It asks other systems for web results, facts and summaries, then assembles them into the page you see.',
      },
      {
        id: 'autocomplete',
        label: 'Autocomplete',
        kind: 'service',
        tier: 2,
        tech: 'Suggestion servers doing fast prefix lookups',
        description:
          'Predicts what you are typing. It looks up common and trending searches that match your letters, fast enough to reply after every keystroke.',
      },
      {
        id: 'search-root',
        label: 'Root server',
        kind: 'service',
        tier: 2,
        tech: 'C++ serving system (root fans out to leaf servers)',
        description:
          'Turns one search into many small lookups. It sends your words to every index shard at once, then merges their best answers into one list.',
      },
      // Tier 3: services & workers
      {
        id: 'ranking',
        label: 'Ranking systems',
        kind: 'ml',
        tier: 3,
        tech: 'Many ranking signals plus RankBrain and BERT',
        description:
          'Scores each candidate page: does it match what you meant, is it trustworthy, is it fresh? The highest scores become the top results.',
      },
      {
        id: 'ai-overviews',
        label: 'AI Overviews',
        kind: 'ml',
        tier: 3,
        tech: 'Custom Gemini model',
        description:
          'For some questions, a Gemini model reads top results and writes a short summary for the top of the page, with links to the sources it used.',
      },
      {
        id: 'crawler',
        label: 'Googlebot',
        kind: 'service',
        tier: 3,
        tech: 'Distributed web crawler',
        description:
          'A fleet of programs that download web pages and follow their links to discover new ones, while taking care not to overload any single site.',
      },
      {
        id: 'indexer',
        label: 'Indexing pipeline',
        kind: 'service',
        tier: 3,
        tech: 'Caffeine (incremental indexing)',
        description:
          'Reads newly crawled pages, pulls out their words, links and other signals, and updates the index a little at a time instead of rebuilding it all at once.',
      },
      // Tier 4: data & storage
      {
        id: 'index-shards',
        label: 'Index shards',
        kind: 'database',
        tier: 4,
        tech: 'Inverted index split across many leaf servers',
        description:
          'The index itself: for every word, a list of pages containing it. It is far too big for one computer, so it is split into shards, each copied several times.',
      },
      {
        id: 'bigtable',
        label: 'Bigtable',
        kind: 'database',
        tier: 4,
        tech: 'Bigtable (wide-column store)',
        description:
          'A giant sorted table spread over many machines. The classic example from its paper is one row per web page, keyed by the web address written backwards (like com.cnn.www), holding the page contents.',
      },
      {
        id: 'colossus',
        label: 'Colossus',
        kind: 'storage',
        tier: 4,
        tech: 'Colossus distributed file system (successor to GFS)',
        description:
          'Stores files far bigger than any disk by chopping them into pieces across many machines, with enough redundancy that a failed disk loses nothing.',
      },
      {
        id: 'knowledge-graph',
        label: 'Knowledge Graph',
        kind: 'database',
        tier: 4,
        tech: 'Graph of entities and facts',
        description:
          'A web of facts about real things (people, places, films) and how they connect, used for info boxes that answer questions directly.',
      },
    ],
    edges: [
      { from: 'browser', to: 'dns', label: 'DNS lookup' },
      { from: 'browser', to: 'gfe', label: 'HTTPS (HTTP/2 or HTTP/3)' },
      { from: 'gfe', to: 'autocomplete', label: 'RPC (suggestions)' },
      { from: 'gfe', to: 'gws', label: 'RPC' },
      { from: 'gws', to: 'search-root', label: 'RPC (Protocol Buffers)' },
      { from: 'search-root', to: 'index-shards', label: 'fan-out to every shard' },
      { from: 'search-root', to: 'ranking', label: 'score candidates' },
      { from: 'gws', to: 'knowledge-graph', label: 'entity lookup' },
      { from: 'gws', to: 'ai-overviews', label: 'question + top results' },
      { from: 'crawler', to: 'websites', label: 'HTTP fetch' },
      { from: 'crawler', to: 'bigtable', label: 'store fetched pages' },
      { from: 'indexer', to: 'bigtable', label: 'read new pages' },
      { from: 'indexer', to: 'crawler', label: 'newly found links' },
      { from: 'indexer', to: 'colossus', label: 'write index files' },
      { from: 'index-shards', to: 'colossus', label: 'load index files' },
      { from: 'bigtable', to: 'colossus', label: 'stores its data files' },
    ],
    flows: [
      {
        id: 'search',
        title: 'You search for something',
        emoji: '🔍',
        steps: [
          {
            from: 'browser',
            to: 'dns',
            narration:
              "You type google.com. Your browser asks DNS for its address, and Google's DNS answers with a server location that is usually close to you.",
          },
          {
            from: 'browser',
            to: 'gfe',
            narration:
              'As you start typing "how to", the page sends tiny requests over an encrypted HTTPS connection to Google\'s front door.',
          },
          {
            from: 'gfe',
            to: 'autocomplete',
            narration:
              'The front end passes each partial query to the autocomplete servers, which reply with predictions in milliseconds.',
          },
          {
            from: 'gfe',
            to: 'gws',
            narration:
              'You press Enter. The full query goes to the Google Web Server, which coordinates the rest of the search.',
          },
          {
            from: 'gws',
            to: 'search-root',
            narration:
              'GWS asks the root server for web results, and the root splits the job so many machines can work on it at the same time.',
          },
          {
            from: 'search-root',
            to: 'index-shards',
            narration:
              'Every index shard looks up the lists of pages containing your words, and each one sends back its best matches.',
          },
          {
            from: 'search-root',
            to: 'ranking',
            narration:
              'Ranking systems score the merged candidates on meaning, quality and freshness, and the winners travel back to GWS to become your results page.',
          },
        ],
      },
      {
        id: 'discover-page',
        title: 'Google discovers a new page',
        emoji: '🕷️',
        steps: [
          {
            from: 'crawler',
            to: 'websites',
            narration:
              'Googlebot visits a website, checks its robots.txt rules, and downloads a page it has not seen before.',
          },
          {
            from: 'crawler',
            to: 'bigtable',
            narration: 'The downloaded page is saved in Bigtable, in a row keyed by its web address.',
          },
          {
            from: 'indexer',
            to: 'bigtable',
            narration:
              'The indexing pipeline picks up the new page and pulls out its words, its links and signals such as its language.',
          },
          {
            from: 'indexer',
            to: 'crawler',
            narration:
              "Links to pages Google hasn't seen yet go onto the crawler's to-visit list. Following links is how the web gets discovered.",
          },
          {
            from: 'indexer',
            to: 'colossus',
            narration: 'The indexer writes updated pieces of the index as files in Colossus, the distributed file system.',
          },
          {
            from: 'index-shards',
            to: 'colossus',
            narration:
              'Index servers load the fresh pieces, and from then on the new page can appear in search results.',
          },
        ],
      },
      {
        id: 'ask-question',
        title: 'You ask a question',
        emoji: '💡',
        steps: [
          {
            from: 'browser',
            to: 'gfe',
            narration:
              'You search "how tall is the eiffel tower", and the request reaches a nearby Google Front End over HTTPS.',
          },
          {
            from: 'gfe',
            to: 'gws',
            narration: 'The front end unlocks the encrypted request and hands it to the Google Web Server.',
          },
          {
            from: 'gws',
            to: 'search-root',
            narration: 'GWS starts the normal web search, fanning out across the index to find and rank the best pages.',
          },
          {
            from: 'gws',
            to: 'knowledge-graph',
            narration:
              'GWS also recognizes that the question is about a known thing, the Eiffel Tower, and fetches facts like its height from the Knowledge Graph.',
          },
          {
            from: 'gws',
            to: 'ai-overviews',
            narration:
              'For some questions, GWS sends the query and top results to a Gemini model, which writes a short summary with links to its sources.',
          },
          {
            from: 'gws',
            to: 'gfe',
            narration: 'GWS assembles the fact box, the AI Overview and the blue links into one results page.',
          },
          {
            from: 'gfe',
            to: 'browser',
            narration: 'The finished page travels back over the same secure connection, and your browser draws it.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'web/searchbox/searchbox.ts', note: 'The search box: listens to typing and shows suggestions' },
    { path: 'web/searchbox/suggestions.css', note: 'Styles for the dropdown of predictions' },
    { path: 'web/results/result_card.ts', note: 'Renders one result: web address, blue title link and snippet' },
    { path: 'gws/main.cc', note: 'Starts the Google Web Server and registers its request handlers' },
    { path: 'gws/results_page_builder.cc', note: 'Combines web results, fact boxes and AI Overviews into one page' },
    { path: 'gws/BUILD', note: 'Bazel rules describing how to compile the web server' },
    { path: 'protos/search_service.proto', note: 'Message and RPC definitions shared by the search services' },
    { path: 'serving/root/fanout.cc', note: 'Sends a query to every index shard and merges the top answers' },
    { path: 'serving/leaf/inverted_index.cc', note: 'Looks up posting lists and finds pages with all the words' },
    { path: 'serving/leaf/posting_list.h', note: 'Compact, compressed lists of document ids for each word' },
    { path: 'suggest/prefix_table.cc', note: 'Finds popular completions for the letters typed so far' },
    { path: 'crawler/frontier.go', note: "The crawler's to-visit list with politeness rules" },
    { path: 'crawler/robots.go', note: 'Reads robots.txt to decide which pages may be fetched' },
    { path: 'indexing/tokenize.cc', note: 'Splits page text into normalized words' },
    { path: 'indexing/pagerank.py', note: 'Computes link-based importance scores over the web graph' },
    { path: 'ranking/scorer.cc', note: 'Mixes many signals into one relevance score per page' },
    { path: 'ai_overviews/summarize.py', note: 'Builds the model prompt from the top results and adds source links' },
    { path: 'deploy/gws.borg', note: 'Borg job config: how many copies of the web server run in each data center' },
  ],

  code: [
    {
      id: 'ts-autocomplete',
      title: 'Autocomplete as you type',
      file: 'web/searchbox/searchbox.ts',
      language: 'TypeScript',
      explanation:
        "A simplified search box. It waits for a short pause in typing (called debouncing) so it doesn't send a request on every keystroke, cancels older requests whose answers would arrive too late, and bolds the predicted part of each suggestion the way Google does. This is an educational sketch, not Google's real code.",
      code: `const input = document.querySelector<HTMLInputElement>('#q')!;
const list = document.querySelector<HTMLUListElement>('#suggestions')!;
let timer: number | undefined;
let inFlight: AbortController | null = null;

// Wait until typing pauses for 100 ms before asking the server
input.addEventListener('input', () => {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => fetchSuggestions(input.value), 100);
});

async function fetchSuggestions(prefix: string): Promise<void> {
  if (prefix.trim() === '') return list.replaceChildren();
  inFlight?.abort(); // an older request's answer is no longer useful
  inFlight = new AbortController();
  try {
    const url = \`/complete/search?q=\${encodeURIComponent(prefix)}\`;
    const res = await fetch(url, { signal: inFlight.signal });
    const suggestions: string[] = await res.json();
    render(prefix, suggestions.slice(0, 8));
  } catch (err) {
    if ((err as Error).name !== 'AbortError') console.warn('suggest failed', err);
  }
}

function render(prefix: string, suggestions: string[]): void {
  list.replaceChildren(...suggestions.map((text) => {
    const li = document.createElement('li');
    const typed = document.createElement('span'); // what you typed: normal weight
    typed.textContent = text.slice(0, prefix.length);
    const predicted = document.createElement('b'); // the prediction: bold
    predicted.textContent = text.slice(prefix.length);
    li.append(typed, predicted);
    li.addEventListener('click', () => { input.value = text; list.replaceChildren(); });
    return li;
  }));
}`,
    },
    {
      id: 'cpp-inverted-index',
      title: 'An inverted index in miniature',
      file: 'serving/leaf/inverted_index.cc',
      language: 'C++',
      explanation:
        "The core data structure of every search engine. For each word it keeps a sorted list of document ids, called a posting list. To find pages containing all your words, it walks the lists side by side, which is fast because they are sorted. Google's real index is compressed, split across many machines and far more advanced; this shows the basic idea.",
      code: `#include <algorithm>
#include <cstdint>
#include <iterator>
#include <string>
#include <unordered_map>
#include <utility>
#include <vector>

using DocId = uint32_t;
using PostingList = std::vector<DocId>;  // every page containing a word, sorted by id
class InvertedIndex {
 public:
  // Documents must be added in increasing id order so every list stays sorted.
  void AddDocument(DocId doc, const std::vector<std::string>& words) {
    for (const auto& word : words) {
      PostingList& list = postings_[word];
      if (list.empty() || list.back() != doc) list.push_back(doc);
    }
  }

  // Pages that contain ALL the query words.
  PostingList Search(const std::vector<std::string>& query) const {
    if (query.empty()) return {};
    PostingList result = Lookup(query[0]);
    for (size_t i = 1; i < query.size() && !result.empty(); ++i) {
      const PostingList& next = Lookup(query[i]);
      PostingList both;
      std::set_intersection(result.begin(), result.end(), next.begin(), next.end(),
                            std::back_inserter(both));
      result = std::move(both);
    }
    return result;  // next step: score these candidates and keep the best ten
  }
 private:
  const PostingList& Lookup(const std::string& word) const {
    static const PostingList kEmpty;
    auto it = postings_.find(word);
    return it == postings_.end() ? kEmpty : it->second;
  }
  std::unordered_map<std::string, PostingList> postings_;
};`,
    },
    {
      id: 'python-pagerank',
      title: 'PageRank: links as votes',
      file: 'indexing/pagerank.py',
      language: 'Python',
      explanation:
        "The idea from Page and Brin's 1998 work: a link is a vote, and votes from important pages count for more. Every page starts equal, then scores are passed along links again and again until they settle. The 0.85 damping factor, the value suggested in the original paper, models a surfer who usually clicks links but sometimes jumps to a random page. Today PageRank is just one of many signals Google uses.",
      code: `def pagerank(links, damping=0.85, iterations=20):
    """links maps each page to the list of pages it links to."""
    pages = set(links) | {p for targets in links.values() for p in targets}
    n = len(pages)
    rank = {page: 1.0 / n for page in pages}  # everyone starts equal

    for _ in range(iterations):
        # Some of every page's score comes from random jumps
        new_rank = {page: (1 - damping) / n for page in pages}
        for page in pages:
            targets = links.get(page, [])
            if targets:
                share = damping * rank[page] / len(targets)
                for target in targets:
                    new_rank[target] += share  # a link is a vote, split evenly
            else:
                # A page with no outgoing links shares its vote with everyone
                for other in pages:
                    new_rank[other] += damping * rank[page] / n
        rank = new_rank
    return rank


web = {
    "home.html": ["about.html", "blog.html"],
    "about.html": ["home.html"],
    "blog.html": ["home.html", "about.html", "post.html"],
    "post.html": ["home.html"],
}

for page, score in sorted(pagerank(web).items(), key=lambda kv: -kv[1]):
    print(f"{page:12} {score:.3f}")  # home.html wins: every other page links to it`,
    },
    {
      id: 'go-crawler-frontier',
      title: "A polite crawler's to-visit list",
      file: 'crawler/frontier.go',
      language: 'Go',
      explanation:
        "Crawler manners in miniature. The frontier is the crawler's to-visit list: it skips pages that robots.txt says are off-limits, never queues the same page twice (otherwise pages that link to each other would trap it in a loop), and waits between visits to the same website so it doesn't overload that site's servers. Written in Go for readability; this is not Googlebot's real code.",
      code: `package crawler

import (
    "net/url"
    "time"
)

// Frontier is the crawler's to-visit list, plus a memory of pages it has already seen.
type Frontier struct {
    queue   []*url.URL
    seen    map[string]bool
    lastHit map[string]time.Time // when we last fetched from each website
}

func NewFrontier() *Frontier {
    return &Frontier{seen: map[string]bool{}, lastHit: map[string]time.Time{}}
}

// Add queues a page once, and only if the site's robots.txt allows crawling it.
func (f *Frontier) Add(u *url.URL, allowedByRobots bool) {
    if allowedByRobots && !f.seen[u.String()] {
        f.seen[u.String()] = true
        f.queue = append(f.queue, u)
    }
}

// Next picks a page from a website we haven't visited in the last second.
func (f *Frontier) Next() (*url.URL, bool) {
    for i, u := range f.queue {
        if time.Since(f.lastHit[u.Host]) >= time.Second { // be polite: never hammer one site
            f.queue = append(f.queue[:i], f.queue[i+1:]...)
            f.lastHit[u.Host] = time.Now()
            return u, true
        }
    }
    return nil, false // every waiting page is on a site we visited too recently
}`,
    },
    {
      id: 'proto-search-service',
      title: 'How services describe their data',
      file: 'protos/search_service.proto',
      language: 'Protocol Buffers',
      explanation:
        'Google\'s services talk to each other using Protocol Buffers. You describe messages and RPC calls once in a .proto file, and a compiler generates matching code in C++, Java, Go, Python and more, so a server in one language can call a server in another. The numbers (= 1, = 2) are field tags used in the compact binary format, not default values. The message names here are made up for teaching.',
      code: `syntax = "proto3";

package minisearch;

// What the web server sends to the index servers
message SearchRequest {
  string query = 1;        // "best pizza near me"
  string language = 2;     // "en"
  int32 num_results = 3;   // usually 10 per page
  int32 start = 4;         // 10 means "start at page 2"
}

message SearchResult {
  string url = 1;
  string title = 2;
  string snippet = 3;      // the short preview text under the title
  double score = 4;        // higher means more relevant
}

message SearchResponse {
  repeated SearchResult results = 1;  // "repeated" means a list
  string spelling_suggestion = 2;     // for "Did you mean ...?"
}

message SuggestRequest {
  string prefix = 1;       // the letters typed so far
}

message SuggestResponse {
  repeated string suggestions = 1;
}

// A service is the menu of calls one program can make on another
service SearchService {
  rpc Search(SearchRequest) returns (SearchResponse);
  rpc Suggest(SuggestRequest) returns (SuggestResponse);
}`,
    },
  ],

  playground: {
    title: 'Mini Google',
    description:
      'A tiny search engine in one page: a colorful logo, a search box that suggests searches as you type, and a results page that ranks a mini web by how many of your words each page contains.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mini Google</title>
<style>
:root {
  --blue: #4285F4; /* @tweak color "Blue letters & links" */
  --red: #EA4335; /* @tweak color "Red letters" */
  --yellow: #FBBC05; /* @tweak color "Yellow letter" */
  --green: #34A853; /* @tweak color "Green letter & web addresses" */
  --radius: 24px; /* @tweak range 0 28 "Search box roundness" */
  --logo: 64px; /* @tweak range 32 96 "Logo size" */
}
* { box-sizing: border-box; }
[hidden] { display: none !important; }
body { margin: 0; padding: 16px; background: #fff; color: #202124; font: 15px/1.45 Arial, sans-serif; }
button { font: inherit; cursor: pointer; }

/* Logo: every letter is its own colored span */
.logo { margin: 56px 0 24px; text-align: center; font-size: var(--logo); letter-spacing: -0.04em;
  cursor: pointer; user-select: none; transition: margin 0.3s, font-size 0.3s; }
.b { color: var(--blue); } .r { color: var(--red); }
.y { color: var(--yellow); } .g { color: var(--green); }

/* Search box with a dropdown of suggestions */
.box { position: relative; }
.field { display: flex; align-items: center; gap: 10px; height: 46px; padding: 0 16px;
  border: 1px solid #dfe1e5; border-radius: var(--radius); background: #fff; }
.field:focus-within { border-color: transparent; box-shadow: 0 1px 6px rgba(32, 33, 36, 0.3); }
.field input { flex: 1; min-width: 0; border: 0; outline: 0; font: inherit; background: none; }
.suggest { position: absolute; top: 50px; left: 0; right: 0; z-index: 2; margin: 0; padding: 6px 0;
  list-style: none; background: #fff; border-radius: calc(var(--radius) / 2);
  box-shadow: 0 4px 14px rgba(32, 33, 36, 0.25); }
.suggest li { padding: 9px 16px; cursor: pointer; }
.suggest li::before { content: "🔍"; margin-right: 12px; font-size: 12px; opacity: 0.5; }
.suggest li:hover, .suggest li.on { background: #f1f3f4; }
.buttons { display: flex; justify-content: center; gap: 10px; margin-top: 24px; }
.buttons button { padding: 9px 14px; border: 1px solid #f8f9fa; border-radius: calc(var(--radius) / 4);
  background: #f8f9fa; color: #3c4043; font-size: 14px; }
.hint { margin-top: 28px; text-align: center; color: #70757a; font-size: 13px; }

/* Results page: the logo shrinks and the buttons hide */
body.searched .logo { margin: 0 0 12px; font-size: calc(var(--logo) / 2); }
body.searched .buttons, body.searched .hint { display: none; }
.stats { margin: 14px 0 18px; color: #70757a; font-size: 13px; }
.result { margin-bottom: 24px; }
.result cite { display: block; font-style: normal; font-size: 12px; color: var(--green); }
.result a { color: var(--blue); font-size: 18px; cursor: pointer; }
.result p { margin: 4px 0 0; color: #4d5156; font-size: 14px; }
footer { margin-top: 40px; text-align: center; color: #70757a; font-size: 12px; }
</style>
</head>
<body>
  <!-- The logo: six letters, each in a Google color. Tap it to go back home. -->
  <h1 class="logo" id="logo"><span class="b">G</span><span class="r">o</span><span class="y">o</span><span class="b">g</span><span class="g">l</span><span class="r">e</span></h1>

  <form class="box" id="form" autocomplete="off">
    <div class="field">
      <span>🔍</span>
      <input id="q" type="search" placeholder="Search the tiny web" aria-label="Search">
      <span>🎤</span>
    </div>
    <ul class="suggest" id="suggest" hidden></ul>
    <div class="buttons">
      <button type="submit"><span data-edit="search-label">Google Search</span></button>
      <button type="button" id="lucky"><span data-edit="lucky-label">I'm Feeling Lucky</span></button>
    </div>
  </form>
  <p class="hint" data-edit="hint">Try typing how, what or why</p>

  <p class="stats" id="stats" hidden></p>
  <div id="results"></div>
  <footer data-edit="footer">A tiny Google for learning, not the real thing</footer>

<script>
  // Popular searches. The real Google learns these from what people actually search for.
  const SUGGESTIONS = [
    'how does google search work', 'how to center a div', 'how to learn python',
    'what is an inverted index', 'what is pagerank', 'what is big o notation',
    'why is the sky blue', 'why do we use git', 'weather tomorrow'
  ];
  // A tiny "web" to search. Google's real index holds hundreds of billions of pages.
  const PAGES = [
    { title: 'How search engines work', url: 'learn.example.com › search', text: 'A crawler follows links to find pages, then an index records which words each page contains.' },
    { title: 'What is an inverted index?', url: 'cs.example.edu › index', text: 'An inverted index maps each word to the pages that contain it, like the index at the back of a book.' },
    { title: 'PageRank explained with pictures', url: 'algo.example.org › pagerank', text: 'PageRank treats a link as a vote, and votes from important pages count for more.' },
    { title: 'How to center a div', url: 'css.example.dev › center', text: 'Make the parent a flexbox, then set justify-content and align-items to center.' },
    { title: 'Learn Python in 10 minutes a day', url: 'code.example.org › python', text: 'Short daily Python lessons for beginners, from variables to functions.' },
    { title: 'Big O notation for beginners', url: 'cs.example.edu › big-o', text: 'Big O describes how the work an algorithm does grows as its input gets bigger.' },
    { title: 'Why is the sky blue?', url: 'science.example.org › sky', text: 'Air scatters blue sunlight much more than red, so blue light reaches your eyes from all over the sky.' },
    { title: 'Why use Git? Version control basics', url: 'dev.example.com › git', text: 'Git saves snapshots of your code so you can undo mistakes and work with friends.' }
  ];
  const IGNORE = ['how', 'what', 'why', 'is', 'an', 'the', 'to', 'do', 'does', 'we']; // little words that match everything

  const form = document.getElementById('form');
  const input = document.getElementById('q');
  const list = document.getElementById('suggest');
  const stats = document.getElementById('stats');
  const results = document.getElementById('results');
  let active = -1; // which suggestion the arrow keys have highlighted

  const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // 1. Autocomplete: show saved searches that START with what you typed
  function showSuggestions() {
    const typed = input.value.toLowerCase();
    const matches = typed.trim() ? SUGGESTIONS.filter((s) => s.startsWith(typed)).slice(0, 6) : [];
    active = -1;
    // Like Google, bold the predicted part, not the part you already typed
    list.innerHTML = matches.map((s) =>
      '<li>' + escapeHtml(typed) + '<b>' + escapeHtml(s.slice(typed.length)) + '</b></li>').join('');
    list.hidden = matches.length === 0;
    list.querySelectorAll('li').forEach((li, i) => {
      li.addEventListener('click', () => { input.value = matches[i]; search(false); });
    });
  }

  // 2. Arrow keys move through the suggestions
  input.addEventListener('keydown', (e) => {
    const items = list.querySelectorAll('li');
    if (list.hidden || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
    e.preventDefault();
    active = Math.max(0, Math.min(items.length - 1, active + (e.key === 'ArrowDown' ? 1 : -1)));
    items.forEach((li, i) => li.classList.toggle('on', i === active));
    input.value = items[active].textContent;
  });

  // Bold your search words inside each snippet
  function bold(text, words) {
    return text.split(' ').map((w) =>
      words.some((q) => w.toLowerCase().includes(q)) ? '<b>' + w + '</b>' : w).join(' ');
  }

  // 3. Search: one point per matching word, then sort by points (a mini ranking!)
  function search(lucky) {
    list.hidden = true;
    if (!input.value.trim()) return;
    const start = performance.now();
    const words = input.value.toLowerCase().split(' ').filter((w) => w.length > 1 && !IGNORE.includes(w));
    const ranked = PAGES
      .map((page) => {
        const text = (page.title + ' ' + page.text).toLowerCase();
        return { page: page, score: words.filter((w) => text.includes(w)).length };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, lucky ? 1 : 10);
    const ms = (performance.now() - start).toFixed(2);

    document.body.classList.add('searched');
    stats.hidden = false;
    stats.textContent = lucky ? 'Feeling lucky! Here is the top result:'
      : ranked.length + (ranked.length === 1 ? ' result (' : ' results (') + ms + ' ms, right here in your browser)';
    results.innerHTML = ranked.length ? ranked.map((r) =>
      '<div class="result"><cite>' + r.page.url + '</cite><a>' + r.page.title + '</a><p>' +
      bold(r.page.text, words) + '</p></div>').join('')
      : '<p>No pages in the tiny web match that. Try "what is pagerank".</p>';
  }

  input.addEventListener('input', showSuggestions);
  form.addEventListener('submit', (e) => { e.preventDefault(); search(false); });
  document.getElementById('lucky').addEventListener('click', () => search(true));
  // Tap outside the search box to close the suggestions
  document.addEventListener('click', (e) => { if (!form.contains(e.target)) list.hidden = true; });
  // Tap the logo to go back home
  document.getElementById('logo').addEventListener('click', () => {
    document.body.classList.remove('searched');
    input.value = '';
    results.innerHTML = '';
    stats.hidden = list.hidden = true;
  });
</script>
</body>
</html>`,
    challenges: [
      'Set --blue to #EA4335 and --red to #4285F4 to swap the logo colors, then search "what is pagerank" and notice the result title changed color too.',
      'Add your own entry to the SUGGESTIONS list in the script, like \'how do cats see in the dark\', then type "how" and find it in the dropdown.',
      'Make the ranking smarter: in search(), give a page an extra point when a word appears in page.title, then compare the order of results for "index".',
      'Drag "Search box roundness" to 0px and "Logo size" to 96px, then edit the button labels and footer to launch your own search engine brand.',
    ],
  },

  concepts: [
    {
      term: 'Web crawler',
      meaning:
        'A program that visits web pages, saves a copy, and follows their links to find more pages, like exploring a city by walking down every street you discover.',
    },
    {
      term: 'Inverted index',
      meaning:
        'A lookup table from each word to the list of pages that contain it, like the index at the back of a textbook, so a search never has to read every page.',
    },
    {
      term: 'PageRank',
      meaning:
        "An algorithm that scores a page's importance from the links pointing to it, treating each link as a vote and giving more weight to votes from important pages.",
    },
    {
      term: 'Sharding and fan-out',
      meaning:
        'Splitting a huge index into pieces on many machines (sharding), then sending each search to all the pieces at once and merging their answers (fan-out).',
    },
    {
      term: 'Prefix search (autocomplete)',
      meaning:
        'Finding stored phrases that begin with the letters typed so far, often using a tree of letters called a trie so each lookup stays fast.',
    },
    {
      term: 'MapReduce',
      meaning:
        'A way to process giant datasets by running a map step on many machines in parallel, then a reduce step that combines their partial results into one answer.',
    },
    {
      term: 'Remote procedure call (RPC)',
      meaning:
        "Calling a function that actually runs on another computer. Google's services use RPCs with Protocol Buffers to ask each other for data.",
    },
    {
      term: 'Relevance ranking',
      meaning:
        'Putting matching pages in order of how well they answer the search, by combining signals such as word matches, meaning, freshness and page quality.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Pick a tiny corner of the web',
      detail:
        'Choose a small site you are allowed to crawl, such as your own blog or a documentation site, and aim for a few hundred pages instead of the whole internet.',
    },
    {
      step: 'Write a polite crawler',
      detail:
        "Use Python with requests and BeautifulSoup to download pages and collect their links. Check robots.txt with the standard library's urllib.robotparser and wait about a second between requests.",
    },
    {
      step: 'Build an inverted index',
      detail:
        "Lowercase each page's text, split it into words, and store a map from each word to page ids in SQLite. Once you understand the idea, try SQLite's built-in FTS5 full-text search.",
    },
    {
      step: 'Rank the results',
      detail:
        'Start by counting matching words, then try TF-IDF so rare words count more, and compute PageRank over your link graph with the networkx library.',
    },
    {
      step: 'Serve search and suggestions',
      detail:
        "Create GET /search?q= and GET /suggest?q= endpoints with FastAPI or Flask. For suggestions, keep a sorted list of past searches and find matching prefixes with Python's bisect module.",
    },
    {
      step: 'Make the search page and ship it',
      detail:
        'Build a page whose search box fetches suggestions after a short typing pause and shows a results list, then deploy your API to a beginner-friendly host like Render or Railway.',
    },
  ],

  sources: [
    { label: 'How Google Search works (official)', url: 'https://www.google.com/search/howsearchworks/' },
    { label: 'Wikipedia: Google Search', url: 'https://en.wikipedia.org/wiki/Google_Search' },
    { label: 'Google Search Central documentation', url: 'https://developers.google.com/search' },
    { label: 'Google Research publications (GFS, MapReduce, Bigtable)', url: 'https://research.google' },
    { label: 'The Keyword, Google\'s official blog', url: 'https://blog.google' },
  ],
};
