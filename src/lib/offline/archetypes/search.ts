import type { ArchetypeTemplate } from '../types';

export const archetype: ArchetypeTemplate = {
  id: 'search',
  label: 'Search engine & portal',
  keywords: [
    'search',
    'search engine',
    'web search',
    'private search',
    'search results',
    'find anything',
    'query',
    'maps',
    'map',
    'directions',
    'route planner',
    'navigation',
    'near me',
    'nearby',
    'local search',
    'places',
    'business directory',
    'directory',
    'yellow pages',
    'portal',
    'web portal',
    'lookup',
    'image search',
    'reverse image search',
    'answers',
    'explore',
    'satellite view',
    'street view',
    'traffic',
    'search the web',
  ],
  tagline: '{{name}} helps you find what you are looking for, from web pages and quick answers to places on a map.',
  eli5:
    "Long before you type anything, {{name}} has already sent out programs called crawlers to visit pages and places, and built a giant index from them, like the index at the back of a textbook but for millions of documents. When you search, it looks your words up in that index, scores the matches for how relevant and trustworthy they are, and shows you the best ones in well under a second. On many search sites, a lightning-fast auction also runs on every search to decide which ads appear next to the results.",

  languages: [
    { name: 'C++', usedFor: 'Index serving and ranking code, where every millisecond counts', share: 30 },
    { name: 'Java', usedFor: 'Crawlers, indexing pipelines and the ad auction', share: 20 },
    { name: 'Go', usedFor: 'Query front end and other backend services', share: 15 },
    { name: 'Python', usedFor: 'Machine learning for ranking, experiments and data analysis', share: 15 },
    { name: 'TypeScript / JavaScript', usedFor: 'Results page, autocomplete box and interactive maps', share: 15 },
    { name: 'SQL', usedFor: 'Advertiser accounts, crawl bookkeeping and analytics', share: 5 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'Server-rendered results page',
          role: 'Fast first paint',
          beginnerNote:
            'The server sends finished HTML for the results, so the page appears instantly even on a slow phone, and JavaScript only adds extras like autocomplete.',
        },
        {
          name: 'TypeScript',
          role: 'Typed JavaScript for the UI',
          beginnerNote:
            'TypeScript labels data (this is a string, this is a list of results) so mistakes are caught before the code runs.',
        },
        {
          name: 'WebGL vector maps',
          role: 'Smooth, zoomable maps',
          beginnerNote:
            'Instead of downloading pictures of the map, the browser downloads map data (roads, parks, labels) in small squares called tiles and draws them with the graphics card.',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Go & Java services',
          role: 'Query handling and pipelines',
          beginnerNote:
            'Many small programs each do one job, such as spell-checking the query or running the ad auction, like stations in a restaurant kitchen.',
        },
        {
          name: 'C++ serving code',
          role: 'Index lookups and scoring',
          beginnerNote:
            'C++ gives programmers tight control over memory and speed, which matters when you score thousands of documents for every single search.',
        },
        {
          name: 'gRPC',
          role: 'Service-to-service calls',
          beginnerNote:
            'A fast, strict way for services to call each other over the network, like a shared order form every station agrees to use.',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'Inverted index (Elasticsearch / OpenSearch / Lucene)',
          role: 'Word-to-document lookup',
          beginnerNote:
            'For every word, the index stores the list of documents that contain it, so a search jumps straight to matches instead of reading every page.',
        },
        {
          name: 'Apache Kafka',
          role: 'Event stream',
          beginnerNote:
            'A durable conveyor belt for messages like "page downloaded" or "result clicked" that other systems pick up when they are ready.',
        },
        {
          name: 'Redis',
          role: 'Result and suggestion cache',
          beginnerNote:
            'An in-memory store that remembers answers to popular searches for a few minutes, so repeat queries skip the expensive work.',
        },
        {
          name: 'PostgreSQL',
          role: 'Advertisers, bids and crawl bookkeeping',
          beginnerNote:
            'A classic relational database with tables and SQL, great for data that must stay exactly correct, like how much an advertiser has spent.',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Amazon S3 (object storage)',
          role: 'Raw crawled pages',
          beginnerNote:
            'A huge, cheap hard drive in the cloud where every downloaded page is saved, so the index can be rebuilt without crawling again.',
        },
        {
          name: 'Kubernetes',
          role: 'Runs thousands of containers',
          beginnerNote:
            'An automatic manager that starts, restarts and spreads programs across many machines, like an air-traffic controller for software.',
        },
        {
          name: 'Sharding & replicas',
          role: 'Splitting the index',
          beginnerNote:
            'The index is too big for one computer, so it is cut into pieces (shards), and each piece is copied (replicas) so a broken machine does not break search.',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Learning to rank (LightGBM / XGBoost)',
          role: 'Ordering the results',
          beginnerNote:
            'A model learns from past clicks which signals matter most, such as word matches, freshness and links, and combines them into one score.',
        },
        {
          name: 'Text embeddings & vector search',
          role: 'Matching meaning, not just words',
          beginnerNote:
            'Text is turned into lists of numbers so that "cheap flights" and "low-cost airfare" land close together, even with no words in common.',
        },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        {
          name: 'A/B testing platform',
          role: 'Proving a change helps',
          beginnerNote:
            'A small slice of users sees a new ranking while everyone else sees the old one, and the numbers decide which version wins.',
        },
        {
          name: 'Prometheus & Grafana',
          role: 'Latency and error monitoring',
          beginnerNote:
            'Dashboards and alerts that wake an engineer up if searches start getting slow or failing anywhere in the world.',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'web',
        label: 'Search Page',
        kind: 'client',
        tier: 0,
        tech: '{{frontend}} results page',
        description:
          'The search box and results page in your browser. It sends your query, shows suggestions as you type and draws the results, ads and maps.',
      },
      {
        id: 'sites',
        label: 'The Public Web',
        kind: 'external',
        tier: 0,
        tech: 'Websites · robots.txt · sitemaps',
        description:
          'Millions of websites and business listings that the search engine does not own. Site owners use robots.txt and sitemaps to say what crawlers may visit.',
      },
      {
        id: 'cdn',
        label: 'CDN',
        kind: 'edge',
        tier: 1,
        tech: '{{hosting}}',
        description:
          'Servers around the world that deliver the logo, JavaScript, CSS and map tiles from a location near you, so the page shell loads almost instantly.',
      },
      {
        id: 'lb',
        label: 'Load Balancer',
        kind: 'edge',
        tier: 1,
        tech: 'Envoy / nginx',
        description:
          'The front door for search requests. It spreads the traffic across many query servers and skips any that are unhealthy.',
      },
      {
        id: 'query-api',
        label: 'Query Front End',
        kind: 'gateway',
        tier: 2,
        tech: 'Go service',
        description:
          'Cleans up your query (lowercasing, fixing typos), checks the cache, then asks ranking and ads for answers at the same time and stitches them into one results page.',
      },
      {
        id: 'events',
        label: 'Event Stream',
        kind: 'queue',
        tier: 2,
        tech: 'Apache Kafka',
        description:
          'A conveyor belt of events: newly found links, freshly downloaded pages, and which results people clicked. Pipelines read from it at their own pace.',
      },
      {
        id: 'ranker',
        label: 'Ranking Service',
        kind: 'ml',
        tier: 3,
        tech: 'C++ scoring + learning-to-rank model',
        description:
          'Collects candidate matches from every index shard and scores them with signals like word matches, freshness, popularity and distance, then returns the top results.',
      },
      {
        id: 'ads',
        label: 'Ad Auction',
        kind: 'service',
        tier: 3,
        tech: 'Java service',
        description:
          'Finds advertisers bidding on your words and runs a tiny auction in milliseconds. The winner is picked by bid combined with how useful the ad is likely to be.',
      },
      {
        id: 'crawler',
        label: 'Crawler',
        kind: 'service',
        tier: 3,
        tech: 'Distributed crawler (Java / Go)',
        description:
          'Programs that visit pages, download them politely (a few requests per site at a time) and follow their links to discover new pages.',
      },
      {
        id: 'indexer',
        label: 'Indexer',
        kind: 'service',
        tier: 3,
        tech: 'Apache Spark batch jobs',
        description:
          'Reads downloaded pages, pulls out the text, splits it into words and builds the index shards. It also counts popular queries for autocomplete.',
      },
      {
        id: 'index',
        label: 'Search Index',
        kind: 'database',
        tier: 4,
        tech: 'Sharded inverted index (Elasticsearch / Lucene)',
        description:
          'The giant lookup table from words (and places) to the documents that contain them, split into shards that live on many machines.',
      },
      {
        id: 'cache',
        label: 'Query Cache',
        kind: 'cache',
        tier: 4,
        tech: 'Redis',
        description:
          'Keeps results for popular searches and autocomplete suggestions in memory for a few minutes, so the same question is not answered from scratch thousands of times.',
      },
      {
        id: 'pages',
        label: 'Page Store',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3 object storage',
        description:
          'Stores the raw HTML of every page the crawler downloaded. Keeping copies means the index can be rebuilt with new ideas without crawling the web again.',
      },
      {
        id: 'ads-db',
        label: 'Ads Database',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL',
        description:
          'Advertiser accounts, campaigns, keyword bids and budgets. Money is involved, so this data lives in a database that keeps every change exactly correct.',
      },
    ],
    edges: [
      { from: 'web', to: 'cdn', label: 'JS, CSS, map tiles' },
      { from: 'web', to: 'lb', label: 'HTTPS search requests' },
      { from: 'lb', to: 'query-api', label: 'Routes requests' },
      { from: 'query-api', to: 'cache', label: 'Cached results & suggestions' },
      { from: 'query-api', to: 'ranker', label: 'Find & rank matches' },
      { from: 'ranker', to: 'index', label: 'Look up words on each shard' },
      { from: 'query-api', to: 'ads', label: 'Run ad auction' },
      { from: 'ads', to: 'ads-db', label: 'Campaigns & bids' },
      { from: 'query-api', to: 'events', label: 'Query & click logs' },
      { from: 'crawler', to: 'sites', label: 'Fetch pages (HTTP)' },
      { from: 'crawler', to: 'pages', label: 'Save raw HTML' },
      { from: 'crawler', to: 'events', label: 'New links & page events' },
      { from: 'events', to: 'indexer', label: 'Pages & logs to process' },
      { from: 'indexer', to: 'pages', label: 'Read raw HTML' },
      { from: 'indexer', to: 'index', label: 'Publish new shards' },
      { from: 'indexer', to: 'cache', label: 'Popular query lists' },
      { from: 'events', to: 'ranker', label: 'Clicks for model training' },
    ],
    flows: [
      {
        id: 'run-search',
        title: 'You search for something',
        emoji: '🔍',
        steps: [
          {
            from: 'web',
            to: 'lb',
            narration:
              'You press Enter. The browser sends an encrypted HTTPS request like GET /search?q=learn+python to the load balancer.',
          },
          {
            from: 'lb',
            to: 'query-api',
            narration: 'The load balancer picks a healthy query server near you and hands over the request.',
          },
          {
            from: 'query-api',
            to: 'cache',
            narration:
              'The query server tidies your words, fixes obvious typos, and checks the cache. If someone asked the same thing a minute ago, the answer is already there.',
          },
          {
            from: 'query-api',
            to: 'ranker',
            narration: 'On a cache miss, it asks the ranking service for the best matches, with a strict time limit of a few hundred milliseconds.',
          },
          {
            from: 'ranker',
            to: 'index',
            narration:
              'The ranker asks every index shard at once for documents containing your words, gathers the candidates and scores them to keep the top ten.',
          },
          {
            from: 'query-api',
            to: 'ads',
            narration:
              'At the same time, the ad auction checks which advertisers bid on these words and picks winners, so ads and results are ready together.',
          },
          {
            from: 'lb',
            to: 'web',
            narration: 'The finished results page travels back to your browser, usually in well under half a second.',
          },
        ],
      },
      {
        id: 'discover-page',
        title: 'A new web page gets discovered',
        emoji: '🕷️',
        steps: [
          {
            from: 'crawler',
            to: 'sites',
            narration:
              'The crawler checks the site\'s robots.txt to see what it may visit, then downloads a page it found through a link or a sitemap.',
          },
          {
            from: 'crawler',
            to: 'pages',
            narration: 'The raw HTML is saved in the page store, along with a fingerprint so an unchanged page can be skipped next time.',
          },
          {
            from: 'crawler',
            to: 'events',
            narration: 'It publishes a "page downloaded" event and adds every new link it found to the list of pages to visit later.',
          },
          {
            from: 'events',
            to: 'indexer',
            narration: 'The indexer picks up the event when it has capacity, which keeps a flood of new pages from overwhelming it.',
          },
          {
            from: 'indexer',
            to: 'pages',
            narration: 'It reads the saved HTML, strips out menus and code, and keeps the title, headings and main text.',
          },
          {
            from: 'indexer',
            to: 'index',
            narration:
              'The text is split into words, and the page is added to each word\'s list in the inverted index. New shards go live and the page becomes searchable.',
          },
        ],
      },
      {
        id: 'autocomplete',
        title: 'Suggestions appear as you type',
        emoji: '⌨️',
        steps: [
          {
            from: 'web',
            to: 'lb',
            narration: 'You type "how to lea" and pause for a moment. The page sends just those letters in a tiny request.',
          },
          {
            from: 'lb',
            to: 'query-api',
            narration: 'The request is routed to a query server like any other search.',
          },
          {
            from: 'query-api',
            to: 'cache',
            narration:
              'Suggestions are precomputed, so the server simply reads the most popular searches starting with "how to lea" from memory.',
          },
          {
            from: 'lb',
            to: 'web',
            narration: 'A short list comes back in a few milliseconds and appears under the search box while you are still typing.',
          },
          {
            from: 'query-api',
            to: 'events',
            narration: 'When you pick a suggestion and search, that choice is logged as an event.',
          },
          {
            from: 'events',
            to: 'indexer',
            narration: 'A regular batch job counts millions of logged searches to learn which queries are popular right now.',
          },
          {
            from: 'indexer',
            to: 'cache',
            narration: 'It writes fresh suggestion lists into the cache, so tomorrow\'s trending searches show up in the box.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'services/query-api/cmd/server/main.go', note: 'Starts the query front end HTTP server' },
    { path: 'services/query-api/internal/search/handler.go', note: 'Handles GET /search: cache check, ranking call, JSON reply' },
    { path: 'services/query-api/internal/spell/correct.go', note: 'Suggests "Did you mean...?" fixes for typos' },
    { path: 'services/ranker/src/scorer.cc', note: 'C++ code that scores candidate documents' },
    { path: 'services/ranker/models/ltr_model.txt', note: 'Trained learning-to-rank model loaded at startup' },
    { path: 'services/ads/src/main/java/com/example/ads/Auction.java', note: 'Picks winning ads and their prices' },
    { path: 'crawler/src/main/java/com/example/crawler/Fetcher.java', note: 'Downloads pages politely, a few per site at a time' },
    { path: 'crawler/src/main/java/com/example/crawler/RobotsTxt.java', note: 'Reads robots.txt to respect what sites allow' },
    { path: 'indexer/jobs/build_index.py', note: 'Spark job that turns saved pages into index shards' },
    { path: 'indexer/analysis/tokenizer.py', note: 'Splits text into lowercase words and handles plurals' },
    { path: 'indexer/jobs/popular_queries.py', note: 'Counts searches to build autocomplete lists' },
    { path: 'infra/search/index-mapping.json', note: 'Describes the fields stored in each document (title, body, url)' },
    { path: 'db/migrations/001_crawl_and_ads.sql', note: 'Tables for known URLs, links and keyword bids' },
    { path: 'experiments/ranking/freshness_boost.yaml', note: 'A/B test config: 5% of users get a new ranking tweak' },
    { path: 'infra/k8s/query-api.yaml', note: 'Tells Kubernetes how many query servers to run' },
  ],

  code: [
    {
      id: 'search-endpoint',
      title: 'Search endpoint with a cache',
      file: 'services/query-api/internal/search/handler.go',
      language: 'Go',
      explanation:
        'This is the front door for a search. It cleans up the query, gives the whole request a strict time budget, and checks Redis first because popular searches repeat constantly. On a miss it asks the ranking service for the top 10 results, saves the answer for five minutes and replies with JSON. Real search engines add spell-checking, ads and personalization, but the cache-then-compute pattern is the same.',
      code: `package search

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"
)

type Server struct {
	cache  *redis.Client
	ranker interface{ TopK(ctx context.Context, q string, k int) (any, error) }
}

// Handler serves GET /search?q=...
func (s *Server) Handler(w http.ResponseWriter, r *http.Request) {
	q := strings.ToLower(strings.TrimSpace(r.URL.Query().Get("q")))
	if q == "" || len(q) > 256 {
		http.Error(w, "missing or too long query", http.StatusBadRequest)
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 300*time.Millisecond)
	defer cancel()
	w.Header().Set("Content-Type", "application/json")
	if cached, err := s.cache.Get(ctx, "serp:"+q).Bytes(); err == nil {
		w.Write(cached) // cache hit: someone searched this recently
		return
	}
	results, err := s.ranker.TopK(ctx, q, 10)
	if err != nil {
		http.Error(w, "search is busy, try again", http.StatusServiceUnavailable)
		return
	}
	body, _ := json.Marshal(results)
	s.cache.Set(ctx, "serp:"+q, body, 5*time.Minute) // remember for 5 minutes
	w.Write(body)
}`,
    },
    {
      id: 'crawl-schema',
      title: 'Crawl frontier and ad bids',
      file: 'db/migrations/001_crawl_and_ads.sql',
      language: 'SQL (PostgreSQL)',
      explanation:
        'The urls table is the crawler\'s to-do list: every known page, when it was last visited and when to check it again. The links table records which page points to which, the raw material for link-based signals like PageRank. keyword_bids stores what advertisers will pay per click. The final query picks the next pages to crawl, most important first. At true web scale this is split across many machines, but a small search engine can start exactly like this.',
      code: `-- Every URL the crawler knows about, and when to visit it next.
CREATE TABLE urls (
  id            BIGSERIAL PRIMARY KEY,
  url           TEXT NOT NULL UNIQUE,
  host          TEXT NOT NULL,
  last_crawled  TIMESTAMPTZ,
  next_crawl_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  http_status   SMALLINT,
  content_hash  BYTEA,               -- spots pages that did not change
  link_score    REAL NOT NULL DEFAULT 0
);
CREATE INDEX urls_due ON urls (next_crawl_at);

-- Which page links to which (used for link-based ranking signals).
CREATE TABLE links (
  from_url_id BIGINT NOT NULL REFERENCES urls(id),
  to_url_id   BIGINT NOT NULL REFERENCES urls(id),
  anchor_text TEXT,                  -- the clickable words of the link
  PRIMARY KEY (from_url_id, to_url_id)
);

-- Advertisers bid on keywords.
CREATE TABLE keyword_bids (
  id                 BIGSERIAL PRIMARY KEY,
  advertiser_id      BIGINT NOT NULL,
  keyword            TEXT NOT NULL,
  max_cpc_cents      INTEGER NOT NULL CHECK (max_cpc_cents > 0),
  daily_budget_cents INTEGER NOT NULL
);
CREATE INDEX bids_by_keyword ON keyword_bids (keyword);

-- The crawler asks: which 100 pages are due, most important first?
SELECT id, url
FROM urls
WHERE next_crawl_at <= now()
ORDER BY link_score DESC, next_crawl_at
LIMIT 100;`,
    },
    {
      id: 'inverted-index-bm25',
      title: 'Inverted index with BM25 ranking',
      file: 'indexer/analysis/mini_index.py',
      language: 'Python',
      explanation:
        'This builds a tiny inverted index: for each word, which documents contain it and how often. Searching then only touches documents that share a word with the query. Each match is scored with BM25, a classic ranking formula: rare words (like "learn") count more than common ones (like "python" here), and a match in a short document counts a bit more than in a long one. Notice "pythons" does not match "python"; real engines add stemming to handle plurals. Elasticsearch uses BM25 as its default scoring too.',
      code: `import math
import re
from collections import defaultdict

docs = {
    1: "How to learn Python fast",
    2: "Python snakes: facts about pythons",
    3: "Learn JavaScript and Python for the web",
}

def tokenize(text):
    return re.findall(r"[a-z0-9]+", text.lower())
# Inverted index: word -> {doc_id: times the word appears}
index = defaultdict(dict)
lengths = {}
for doc_id, text in docs.items():
    words = tokenize(text)
    lengths[doc_id] = len(words)
    for w in words:
        index[w][doc_id] = index[w].get(doc_id, 0) + 1
avg_len = sum(lengths.values()) / len(lengths)

def bm25(query, k1=1.2, b=0.75):
    scores = defaultdict(float)
    for word in tokenize(query):
        postings = index.get(word, {})
        if not postings:
            continue
        # Rare words matter more (inverse document frequency).
        idf = math.log(1 + (len(docs) - len(postings) + 0.5) / (len(postings) + 0.5))
        for doc_id, tf in postings.items():
            length_norm = 1 - b + b * lengths[doc_id] / avg_len
            scores[doc_id] += idf * tf * (k1 + 1) / (tf + k1 * length_norm)
    return sorted(scores.items(), key=lambda s: s[1], reverse=True)

for doc_id, score in bm25("learn python"):
    print(f"{score:.2f}  {docs[doc_id]}")
# 0.63  How to learn Python fast
# 0.55  Learn JavaScript and Python for the web
# 0.14  Python snakes: facts about pythons`,
    },
  ],

  playground: {
    title: 'Mini search engine',
    description:
      'A tiny working search engine: it builds an inverted index from eight pretend pages, ranks matches as you type, shows autocomplete suggestions, a sponsored result and tabs for News, Maps and Shopping.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Search</title>
<style>
:root {
  --brand: {{brand}}; /* @tweak color "Brand color" */
  --accent: {{accent}}; /* @tweak color "Ad label color" */
  --link: #1a0dab; /* @tweak color "Result link color" */
  --bg: #ffffff; /* @tweak color "Background" */
  --radius: 24px; /* @tweak range 0 32 "Search box roundness" */
  --gap: 18px; /* @tweak range 6 36 "Space between results" */
}
* { box-sizing: border-box; }
body { margin: 0; padding: 16px; background: var(--bg); color: #202124; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.logo { font-size: 32px; font-weight: 800; text-align: center; margin: 6px 0 2px; color: var(--brand); letter-spacing: -1px; }
.hint { text-align: center; color: #70757a; font-size: 13px; margin: 0 0 14px; }
.box { position: relative; }
.box span { position: absolute; left: 14px; top: 12px; font-size: 15px; }
input { width: 100%; padding: 12px 16px 12px 40px; font-size: 16px; border: 1px solid #dfe1e5; border-radius: var(--radius); outline: none; background: var(--bg); }
input:focus { border-color: var(--brand); box-shadow: 0 1px 6px rgba(32,33,36,.25); }
.suggest { list-style: none; margin: 4px 0 0; padding: 6px 0; border: 1px solid #dfe1e5; border-radius: 12px; }
.suggest li { padding: 8px 16px; cursor: pointer; }
.suggest li:hover { background: #f1f3f4; }
.tabs { display: flex; gap: 16px; margin: 14px 0 4px; border-bottom: 1px solid #ebebeb; }
.tabs button { background: none; border: 0; border-bottom: 3px solid transparent; padding: 8px 2px; font-size: 14px; color: #5f6368; cursor: pointer; }
.tabs button.on { color: var(--brand); border-color: var(--brand); }
.stats { color: #70757a; font-size: 12px; margin: 8px 0 12px; min-height: 14px; }
.result { margin-bottom: var(--gap); }
.result small { font-size: 12px; color: #4d5156; }
.result a { display: block; color: var(--link); font-size: 18px; text-decoration: none; margin: 2px 0; }
.result p { margin: 0; font-size: 14px; line-height: 1.4; color: #4d5156; }
.result b { color: #202124; }
.ad { font-weight: 700; color: var(--accent); }
.score { float: right; font-size: 11px; background: #f1f3f4; color: #5f6368; padding: 2px 8px; border-radius: 10px; }
.empty { color: #70757a; }
footer { color: #70757a; font-size: 12px; text-align: center; margin-top: 20px; }
</style>
</head>
<body>
<div class="logo" data-edit="logo">{{name}}</div>
<p class="hint" data-edit="hint">Search our tiny index of 8 pages</p>
<div class="box">
  <span>🔍</span>
  <input id="q" type="search" placeholder="Try: learn python" autocomplete="off">
</div>
<ul class="suggest" id="suggest" hidden></ul>
<nav class="tabs" id="tabs">
  <button class="on" data-tab="all">All</button>
  <button data-tab="news">News</button>
  <button data-tab="maps">Maps</button>
  <button data-tab="shop">Shopping</button>
</nav>
<div class="stats" id="stats"></div>
<div id="results"></div>
<p class="empty" id="empty" data-edit="empty" hidden>No pages match. Try different words.</p>
<footer data-edit="footer">Ranked by matching words plus popularity</footer>

<script>
// Our pretend web. Real engines crawl billions of pages to build this.
const pages = [
  { type: 'web', url: 'learnpython.dev', title: 'Learn Python in 10 Minutes', text: 'A friendly guide to learn python basics fast.', pop: 3 },
  { type: 'web', url: 'snakes.example', title: 'Pythons: Facts About Giant Snakes', text: 'Where pythons live, what they eat and how big they grow.', pop: 1 },
  { type: 'web', url: 'jsguide.example', title: 'JavaScript Tutorial for Beginners', text: 'Learn javascript step by step and build your first web page.', pop: 2 },
  { type: 'news', url: 'citynews.example', title: 'City Opens a Free Coding School', text: 'Adults can learn python and javascript at night classes.', pop: 2 },
  { type: 'news', url: 'weather.example', title: 'Weather Today: Sunny and Warm', text: 'Check the weather today and the forecast for this week.', pop: 4 },
  { type: 'maps', url: 'Pizza · 0.4 mi', title: 'Slice House Pizza', text: 'Pizza near me, open until 11pm. Rated 4.6 stars.', pop: 3 },
  { type: 'maps', url: 'Cafe · 0.8 mi', title: 'Corner Cafe', text: 'Coffee and free wifi near me, open today until 6pm.', pop: 2 },
  { type: 'shop', url: 'soundshop.example', title: 'Cheap Wireless Headphones', text: 'Budget headphones with free shipping and easy returns.', pop: 2 }
];
const ad = { url: 'bootcamp.example', title: 'Weekend Coding Bootcamp', text: 'Learn python or javascript with a mentor.', words: ['learn', 'python', 'javascript', 'coding'] };
const popular = ['learn python', 'learn javascript', 'pizza near me', 'weather today', 'cheap headphones', 'coffee near me'];

let tab = 'all';
const $ = (id) => document.getElementById(id);
const words = (s) => s.toLowerCase().match(/[a-z0-9]+/g) || [];

// Build the inverted index once: word -> list of page numbers
const index = {};
pages.forEach((page, i) => {
  new Set(words(page.title + ' ' + page.text)).forEach((w) => {
    (index[w] = index[w] || []).push(i);
  });
});

// Wrap words that match the query in <b> tags
function highlight(text, q) {
  return text.replace(/[A-Za-z0-9]+/g, (w) => (q.includes(w.toLowerCase()) ? '<b>' + w + '</b>' : w));
}

function card(label, url, title, text, q) {
  return '<div class="result">' + label + '<small>' + url + '</small><a href="#">' +
    highlight(title, q) + '</a><p>' + highlight(text, q) + '</p></div>';
}

function search() {
  const q = words($('q').value);
  const started = performance.now();
  // Score: 10 points per matching word, plus the page's popularity
  const scores = {};
  q.forEach((w) => (index[w] || []).forEach((i) => { scores[i] = (scores[i] || 0) + 10; }));
  const hits = Object.keys(scores)
    .map((i) => ({ page: pages[i], score: scores[i] + pages[i].pop }))
    .filter((h) => tab === 'all' || h.page.type === tab)
    .sort((a, b) => b.score - a.score);

  let html = '';
  if (tab === 'all' && q.some((w) => ad.words.includes(w))) {
    html += card('<span class="ad">Sponsored · </span>', ad.url, ad.title, ad.text, q);
  }
  hits.forEach((h) => {
    html += card('<span class="score">score ' + h.score + '</span>', h.page.url, h.page.title, h.page.text, q);
  });
  $('results').innerHTML = html;
  $('empty').hidden = q.length === 0 || hits.length > 0;
  const secs = ((performance.now() - started) / 1000).toFixed(4);
  $('stats').textContent = q.length ? 'About ' + hits.length + ' results (' + secs + ' seconds)' : '';
}

// Autocomplete: popular searches that start with what you typed
function suggest() {
  const typed = $('q').value.toLowerCase();
  const list = typed ? popular.filter((s) => s.startsWith(typed) && s !== typed).slice(0, 4) : [];
  $('suggest').innerHTML = '';
  list.forEach((s) => {
    const li = document.createElement('li');
    li.textContent = '🔍 ' + s;
    li.onclick = () => { $('q').value = s; $('suggest').hidden = true; search(); };
    $('suggest').appendChild(li);
  });
  $('suggest').hidden = list.length === 0;
}

$('q').addEventListener('input', () => { suggest(); search(); });
$('tabs').onclick = (e) => {
  if (!e.target.dataset.tab) return;
  tab = e.target.dataset.tab;
  document.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('on', b === e.target));
  search();
};
document.addEventListener('click', (e) => { if (e.target.tagName === 'A') e.preventDefault(); });
search();
</script>
</body>
</html>`,
    challenges: [
      'Search for "python" and notice the snake page is missing because it says "pythons". Make the words() function remove a trailing "s" from each word (simple stemming) and search again.',
      'Change the "Brand color" tweak and watch the logo, the focused search box and the active tab all update.',
      'Add a ninth page to the pages array, then search for a word in its title to see the index pick it up.',
      'Make title matches count double: build a second index just for titles and add extra points when a query word appears there.',
    ],
  },

  concepts: [
    {
      term: 'Web crawler',
      meaning:
        'A program that downloads a page, finds its links, and adds them to a to-do list of pages to visit next, slowly exploring the web the way you might click from link to link.',
    },
    {
      term: 'Inverted index',
      meaning:
        'A lookup table from each word to the documents that contain it, like the index at the back of a book. It lets a search skip straight to matching pages.',
    },
    {
      term: 'Relevance ranking (TF-IDF & BM25)',
      meaning:
        'Formulas that score a document higher when it contains your words often, especially rare words, so the most useful pages float to the top.',
    },
    {
      term: 'Sharding',
      meaning:
        'Splitting data that is too big for one machine into pieces stored on many machines, then asking all the pieces at once and merging their answers.',
    },
    {
      term: 'Caching',
      meaning:
        'Saving the answer to a common request so the next identical request can be answered instantly without redoing the work.',
    },
    {
      term: 'Autocomplete (prefix search)',
      meaning:
        'Suggesting whole searches from the first few letters you type, using precomputed lists of popular queries that start with those letters.',
    },
    {
      term: 'Ad auction',
      meaning:
        'A tiny, automatic auction run on each search where advertisers compete to appear. The ranking usually combines the bid with how relevant the ad is, not just the highest price.',
    },
    {
      term: 'Latency budget',
      meaning:
        'A strict time limit for answering a request, such as 300 milliseconds. Every step has to fit inside it, so slow parts are skipped rather than making you wait.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Crawl a small corner of the web',
      detail:
        'Use Python with the requests and BeautifulSoup libraries to download a few hundred pages from one site you are allowed to crawl, such as your own blog or a documentation site. Read robots.txt first and wait a second between requests.',
    },
    {
      step: 'Build an inverted index',
      detail:
        'Lowercase the text, split it into words and store a dictionary of word to page IDs. Then try SQLite\'s built-in FTS5 full-text search to see how a real index does the same job.',
    },
    {
      step: 'Rank the results',
      detail:
        'Score matches with BM25, either by hand like the snippet above, with the rank_bm25 Python package, or with SQLite FTS5\'s bm25() function. Compare the results to plain word counting.',
    },
    {
      step: 'Serve a search API',
      detail:
        'Wrap your index in a small FastAPI or Express server with a GET /search?q= endpoint that returns the top 10 results as JSON, with the title, URL and a short snippet.',
    },
    {
      step: 'Make the results page with autocomplete',
      detail:
        'Build a search box that calls your API, shows results, and suggests popular searches as you type. Wait about 150ms after the last keystroke before sending a request (debouncing).',
    },
    {
      step: 'Scale up and deploy',
      detail:
        'Move your pages into Meilisearch, Typesense or OpenSearch running in Docker to get typo tolerance and speed for free, then deploy the API to Render or Fly.io.',
    },
  ],
};
