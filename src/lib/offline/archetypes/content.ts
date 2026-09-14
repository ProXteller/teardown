import type { ArchetypeTemplate } from '../types';

export const archetype: ArchetypeTemplate = {
  id: 'content',
  label: 'News, blog & docs site',
  keywords: [
    'news',
    'breaking news',
    'latest news',
    'headlines',
    'top stories',
    'world news',
    'politics',
    'opinion',
    'journalism',
    'newspaper',
    'magazine',
    'journal',
    'daily',
    'times',
    'tribune',
    'gazette',
    'herald',
    'chronicle',
    'blog',
    'articles',
    'essays',
    'writing',
    'newsletter',
    'subscribe',
    'wiki',
    'encyclopedia',
    'documentation',
    'docs',
    'guides',
    'tutorials',
    'knowledge base',
    'reference',
    'handbook',
    'portfolio',
    'case studies',
    'personal website',
  ],
  tagline: '{{name}} publishes articles and pages people come to read, from the latest stories to in-depth guides.',
  eli5:
    "{{name}} is like a library whose shelves are updated every day. Writers and editors work in a content management system (CMS), a private editor behind the scenes, and when they press Publish the site turns each article into a ready-made web page. Copies of those pages are kept on servers all over the world (a CDN), so millions of readers can load a story in a blink without the main servers doing any extra work.",

  languages: [
    { name: 'TypeScript / JavaScript', usedFor: 'Page templates, static site generation, the CMS editor and comments', share: 35 },
    { name: 'PHP', usedFor: 'Popular CMSs like WordPress and Drupal', share: 20 },
    { name: 'HTML & CSS', usedFor: 'Article layouts, typography and email newsletter templates', share: 15 },
    { name: 'SQL', usedFor: 'Articles, authors, revisions and comments', share: 15 },
    { name: 'Python', usedFor: 'Publishing scripts, newsletter jobs and audience analytics', share: 15 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'Static & incremental site generation',
          role: 'Pre-built article pages',
          beginnerNote:
            'Instead of building a page every time someone visits, the site builds it once when the article is published, like printing a newspaper before the readers arrive.',
        },
        {
          name: 'Responsive images (srcset, WebP / AVIF)',
          role: 'Fast photos on any screen',
          beginnerNote:
            'The page lists several sizes of each photo and the browser downloads only the one that fits your screen, so phones do not waste data on huge images.',
        },
        {
          name: 'Semantic, accessible HTML',
          role: 'Readable by people, screen readers and search engines',
          beginnerNote:
            'Using the right tags (article, h1, nav) helps screen readers announce the page correctly and helps search engines understand what the story is about.',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Headless CMS (WordPress, Strapi, Contentful or Sanity)',
          role: 'Where writers create content',
          beginnerNote:
            'A "headless" CMS stores and edits content but does not decide how it looks; it hands the content to any website or app through an API.',
        },
        {
          name: 'Node.js API',
          role: 'Comments, sign-ups and live data',
          beginnerNote:
            'The few parts that change per reader, like comments or your newsletter settings, are handled by a small server that the static pages call.',
        },
        {
          name: 'GraphQL',
          role: 'Fetching exactly the fields a page needs',
          beginnerNote:
            'The page asks for precisely what it needs, such as a headline, author name and photo, in one request instead of calling several endpoints.',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'PostgreSQL or MySQL',
          role: 'Articles, authors and comments',
          beginnerNote:
            'Relational databases store content in tables linked by IDs, so one author row can be connected to hundreds of article rows.',
        },
        {
          name: 'Amazon S3 (object storage)',
          role: 'Photos, videos and built pages',
          beginnerNote:
            'A cloud storage service for files of any size. Pages and photos are saved here once and served to readers through the CDN.',
        },
        {
          name: 'Elasticsearch / Algolia',
          role: 'Site search',
          beginnerNote:
            'A search engine just for the site\'s own articles, so typing "election" finds matching stories instantly, even with a typo.',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'CDN with cache purging (Fastly, Cloudflare, CloudFront)',
          role: 'Serving pages worldwide',
          beginnerNote:
            'Copies of every page sit in data centers near readers. When a story is corrected, the site tells the CDN to throw away old copies (purging) so everyone sees the fix.',
        },
        {
          name: 'Image resizing service',
          role: 'Right-sized photos on the fly',
          beginnerNote:
            'Editors upload one big photo, and a service creates smaller, compressed versions the first time each size is requested.',
        },
        {
          name: 'Email delivery service (Amazon SES, SendGrid, Mailgun)',
          role: 'Sending newsletters',
          beginnerNote:
            'Sending millions of emails that do not land in spam is hard, so sites rent a service that specializes in it.',
        },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        {
          name: 'CI/CD with preview deploys (GitHub Actions)',
          role: 'Safe template changes',
          beginnerNote:
            'Every code change is built and tested automatically, and a private preview link lets the team check a new design before readers see it.',
        },
        {
          name: 'Web analytics & Core Web Vitals',
          role: 'Measuring readers and speed',
          beginnerNote:
            'Tools count page views and measure how fast pages load and settle on real phones, because slow pages lose readers.',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'web',
        label: 'Reader\'s Browser',
        kind: 'client',
        tier: 0,
        tech: '{{frontend}} article pages',
        description:
          'Where readers open the homepage and articles. Most of the page arrives pre-built; small scripts then load extras like comments and the newsletter form.',
      },
      {
        id: 'editor',
        label: 'Editor Dashboard',
        kind: 'client',
        tier: 0,
        tech: 'CMS editor in the browser',
        description:
          'The private writing screen where reporters and editors draft, review, schedule and publish articles, and upload photos.',
      },
      {
        id: 'cdn',
        label: 'CDN',
        kind: 'edge',
        tier: 1,
        tech: '{{hosting}}',
        description:
          'Servers around the world that keep ready-made copies of pages, CSS and scripts close to readers, so a breaking-news spike does not overload the main servers.',
      },
      {
        id: 'images',
        label: 'Image Resizer',
        kind: 'edge',
        tier: 1,
        tech: 'Image CDN (imgix / Cloudinary / Thumbor)',
        description:
          'Turns one large uploaded photo into the exact size and format each device needs, then caches the result.',
      },
      {
        id: 'api',
        label: 'Content API',
        kind: 'gateway',
        tier: 2,
        tech: 'Node.js + GraphQL',
        description:
          'The single door for data: page builds fetch articles through it, and readers\' browsers use it for comments and site search.',
      },
      {
        id: 'cms',
        label: 'Headless CMS',
        kind: 'service',
        tier: 2,
        tech: 'WordPress / Strapi / Contentful',
        description:
          'Stores drafts, revisions, authors, tags and publishing schedules, and announces when something is published or updated.',
      },
      {
        id: 'builder',
        label: 'Site Builder',
        kind: 'service',
        tier: 3,
        tech: 'Static site generation (Next.js / Astro / Hugo)',
        description:
          'Turns content plus templates into finished HTML pages. It rebuilds only the pages affected by a change, like the article, its section and the homepage.',
      },
      {
        id: 'comments',
        label: 'Comments Service',
        kind: 'service',
        tier: 3,
        tech: 'Node.js service',
        description:
          'Saves reader comments and replies, checks for spam and abuse, and holds suspicious comments for a human moderator.',
      },
      {
        id: 'newsletter',
        label: 'Newsletter Service',
        kind: 'service',
        tier: 3,
        tech: 'Python worker + email templates',
        description:
          'Builds newsletter emails from the day\'s top stories and each subscriber\'s chosen topics, then hands them to an email provider in batches.',
      },
      {
        id: 'queue',
        label: 'Publish Events',
        kind: 'queue',
        tier: 3,
        tech: 'Amazon SQS / webhooks',
        description:
          'A waiting line of "article published" and "article updated" messages, so the builder, search and newsletter can each react at their own pace.',
      },
      {
        id: 'db',
        label: 'Content Database',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL / MySQL',
        description:
          'Tables for articles, revisions, authors, tags, comments and subscribers. It is the source of truth that everything else is built from.',
      },
      {
        id: 'media',
        label: 'Files & Media',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3',
        description:
          'Holds original photos and videos plus the generated HTML files that the CDN serves to readers.',
      },
      {
        id: 'search',
        label: 'Site Search Index',
        kind: 'database',
        tier: 4,
        tech: 'Elasticsearch / Algolia',
        description:
          'A searchable copy of every article\'s headline, summary and text, updated whenever something is published.',
      },
      {
        id: 'email',
        label: 'Email Provider',
        kind: 'external',
        tier: 4,
        tech: 'Amazon SES / SendGrid',
        description:
          'An outside service that delivers newsletters to inboxes, handles bounces and unsubscribes, and protects the site\'s sending reputation.',
      },
    ],
    edges: [
      { from: 'web', to: 'cdn', label: 'HTML, CSS, JS' },
      { from: 'web', to: 'images', label: 'Resized photos' },
      { from: 'images', to: 'media', label: 'Original photos' },
      { from: 'cdn', to: 'media', label: 'Built pages on cache miss' },
      { from: 'cdn', to: 'api', label: 'Comments & search requests' },
      { from: 'editor', to: 'cms', label: 'Write & publish (HTTPS)' },
      { from: 'cms', to: 'db', label: 'Articles & revisions' },
      { from: 'cms', to: 'media', label: 'Photo uploads' },
      { from: 'cms', to: 'queue', label: 'Published / updated events' },
      { from: 'queue', to: 'builder', label: 'Rebuild these pages' },
      { from: 'builder', to: 'api', label: 'Fetch content (GraphQL)' },
      { from: 'api', to: 'db', label: 'Read articles' },
      { from: 'builder', to: 'media', label: 'Write HTML files' },
      { from: 'builder', to: 'cdn', label: 'Purge old copies' },
      { from: 'builder', to: 'search', label: 'Update search index' },
      { from: 'api', to: 'search', label: 'Search queries' },
      { from: 'api', to: 'comments', label: 'Post & load comments' },
      { from: 'comments', to: 'db', label: 'Store comments' },
      { from: 'queue', to: 'newsletter', label: 'Issue ready to send' },
      { from: 'newsletter', to: 'email', label: 'Send in batches' },
    ],
    flows: [
      {
        id: 'read-article',
        title: 'You open an article',
        emoji: '📰',
        steps: [
          {
            from: 'web',
            to: 'cdn',
            narration:
              'You tap a headline. Your browser asks the nearest CDN server for the page, and it usually already has a copy, so the article appears in a fraction of a second.',
          },
          {
            from: 'cdn',
            to: 'media',
            narration:
              'If this server has no copy yet (a cache miss), it fetches the pre-built HTML from storage once and keeps it for the next reader.',
          },
          {
            from: 'web',
            to: 'images',
            narration:
              'The page lists several photo sizes, and your browser requests the one that fits your screen from the image resizer.',
          },
          {
            from: 'images',
            to: 'media',
            narration:
              'The first time that size is requested, the resizer shrinks the original photo into a lighter format like WebP and caches it.',
          },
          {
            from: 'web',
            to: 'cdn',
            narration:
              'As you scroll near the bottom, a small script asks for the comments. This request changes per reader, so the CDN does not serve it from cache.',
          },
          {
            from: 'cdn',
            to: 'api',
            narration: 'The CDN passes the request through to the content API.',
          },
          {
            from: 'api',
            to: 'comments',
            narration: 'The API gets the approved comments for this article, and the page shows them under the story.',
          },
        ],
      },
      {
        id: 'publish-story',
        title: 'An editor publishes a story',
        emoji: '✍️',
        steps: [
          {
            from: 'editor',
            to: 'cms',
            narration: 'After a final read, the editor presses Publish in the CMS dashboard.',
          },
          {
            from: 'cms',
            to: 'db',
            narration: 'The CMS saves the final version as a new revision and marks the article as published with a timestamp.',
          },
          {
            from: 'cms',
            to: 'queue',
            narration: 'It drops an "article published" message into the queue instead of waiting for every other system to finish.',
          },
          {
            from: 'queue',
            to: 'builder',
            narration: 'The site builder picks up the message and works out which pages show this story: the article, its section and the homepage.',
          },
          {
            from: 'builder',
            to: 'api',
            narration: 'It fetches the headline, body, author and photos through the content API.',
          },
          {
            from: 'builder',
            to: 'media',
            narration: 'It fills the page templates with that content and saves the finished HTML files to storage.',
          },
          {
            from: 'builder',
            to: 'cdn',
            narration:
              'Finally it tells the CDN to purge the old copies of those pages, so readers everywhere see the new story within seconds.',
          },
        ],
      },
      {
        id: 'send-newsletter',
        title: 'The morning newsletter goes out',
        emoji: '📬',
        steps: [
          {
            from: 'editor',
            to: 'cms',
            narration: 'An editor picks the top stories for tomorrow\'s newsletter, writes a short intro and schedules it for 7am.',
          },
          {
            from: 'cms',
            to: 'db',
            narration: 'The CMS saves the issue with its list of stories and the send time.',
          },
          {
            from: 'cms',
            to: 'queue',
            narration: 'At 7am a scheduler inside the CMS drops a "newsletter ready" message into the queue.',
          },
          {
            from: 'queue',
            to: 'newsletter',
            narration:
              'The newsletter worker fills the email template with the stories, adding an unsubscribe link and each subscriber\'s chosen topics.',
          },
          {
            from: 'newsletter',
            to: 'email',
            narration:
              'It sends the emails to the provider in batches. The provider delivers them, tracks bounces and processes unsubscribes.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'cms/schemas/article.ts', note: 'Content model: headline, summary, body, authors, tags, section' },
    { path: 'cms/webhooks/onPublish.ts', note: 'Sends an "article published" message to the queue' },
    { path: 'api/src/graphql/schema.graphql', note: 'Types and queries the site builder can ask for' },
    { path: 'api/src/routes/comments.ts', note: 'POST and GET endpoints for reader comments' },
    { path: 'api/src/moderation/spamCheck.ts', note: 'Rules that hold suspicious comments for review' },
    { path: 'builder/publish.py', note: 'Rebuilds affected pages and purges the CDN' },
    { path: 'builder/templates/article.html', note: 'Page template the article content is poured into' },
    { path: 'workers/newsletter/send_issue.py', note: 'Builds and sends a newsletter issue in batches' },
    { path: 'workers/search/index_article.py', note: 'Adds a published article to the search index' },
    { path: 'templates/email/daily-briefing.mjml', note: 'Email layout that works across Gmail, Outlook and phones' },
    { path: 'db/migrations/001_articles.sql', note: 'Tables for articles, authors, revisions and comments' },
    { path: 'infra/cdn/cache-rules.yaml', note: 'How long each kind of page may stay cached' },
    { path: 'public/sitemap.xml', note: 'Generated list of every article URL for search engines' },
    { path: 'public/feed.xml', note: 'RSS feed so readers and apps can follow new posts' },
    { path: 'public/robots.txt', note: 'Tells search engine crawlers what they may visit' },
  ],

  code: [
    {
      id: 'comments-endpoint',
      title: 'Posting a comment',
      file: 'api/src/routes/comments.ts',
      language: 'TypeScript',
      explanation:
        'Pages on a content site are mostly pre-built, but comments change per reader, so they go through a small API. This Express route checks that the reader is logged in, validates the input with the zod library, and holds brand-new accounts or link-heavy comments for a moderator. The SQL uses numbered placeholders ($1, $2...) instead of pasting text into the query, which prevents SQL injection attacks.',
      code: `import express from 'express';
import { Pool } from 'pg';
import { z } from 'zod';

const db = new Pool({ connectionString: process.env.DATABASE_URL });
export const router = express.Router();

const CommentInput = z.object({
  articleId: z.number().int().positive(),
  parentId: z.number().int().positive().optional(), // set when replying
  body: z.string().trim().min(1).max(2000),
});

// POST /api/comments (an auth middleware has already set req.user)
router.post('/comments', async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Log in to comment' });

  const parsed = CommentInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const { articleId, parentId, body } = parsed.data;

  // Simple spam rules: new accounts and link-heavy comments wait for a human.
  const links = (body.match(/https?:/g) ?? []).length;
  const status = links > 1 || user.accountAgeDays < 1 ? 'pending' : 'visible';

  const { rows } = await db.query(
    \`INSERT INTO comments (article_id, user_id, parent_id, body, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, created_at\`,
    [articleId, user.id, parentId ?? null, body, status],
  );
  res.status(201).json({ ...rows[0], status });
});`,
    },
    {
      id: 'content-schema',
      title: 'Articles, revisions and comments',
      file: 'db/migrations/001_articles.sql',
      language: 'SQL (PostgreSQL)',
      explanation:
        'The heart of a content site is a handful of tables. Articles have a unique slug used in the URL, a status that moves from draft to published, and a join table so one story can have several authors. Every save creates a revision, so editors can compare versions or undo mistakes. Comments point to their article, and replies point to a parent comment. The partial index at the end makes "newest stories in this section" fast.',
      code: `CREATE TABLE authors (
  id   BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE articles (
  id           BIGSERIAL PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,       -- /tech/how-wifi-works
  section      TEXT NOT NULL,
  headline     TEXT NOT NULL,
  body         TEXT NOT NULL,              -- Markdown or rich-text JSON
  status       TEXT NOT NULL DEFAULT 'draft',  -- draft, scheduled, published
  published_at TIMESTAMPTZ
);

CREATE TABLE article_authors (             -- a story can have several authors
  article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
  author_id  BIGINT REFERENCES authors(id),
  PRIMARY KEY (article_id, author_id)
);

CREATE TABLE revisions (                   -- every save is kept, so edits can be undone
  id         BIGSERIAL PRIMARY KEY,
  article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  edited_by  BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE comments (
  id         BIGSERIAL PRIMARY KEY,
  article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  parent_id  BIGINT REFERENCES comments(id),  -- replies point to a parent
  user_id    BIGINT NOT NULL,
  body       TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'visible',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX articles_recent ON articles (section, published_at DESC) WHERE status = 'published';`,
    },
    {
      id: 'publish-and-purge',
      title: 'Build a page and purge the CDN',
      file: 'builder/publish.py',
      language: 'Python',
      explanation:
        'When an article is published, this script turns its Markdown into HTML, pours it into a Jinja2 template and saves a finished page. Each page is served with "surrogate keys", tags such as article-42 or homepage. Purging a key tells Fastly to throw away every cached page with that tag at once, so the article, its section and the homepage all update together. Other CDNs have the same idea under names like Cloudflare "cache tags".',
      code: `import os
from pathlib import Path

import markdown
import requests
from jinja2 import Environment, FileSystemLoader
from markupsafe import Markup

env = Environment(loader=FileSystemLoader("templates"), autoescape=True)
OUT = Path("dist")

def build_article(article: dict) -> Path:
    """Turn one article from the CMS into a finished HTML file."""
    body = Markup(markdown.markdown(article["body"]))  # trusted editor content
    html = env.get_template("article.html").render(article=article, body=body)
    path = OUT / article["section"] / f"{article['slug']}.html"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html, encoding="utf-8")
    return path

def purge(keys: list[str]) -> None:
    """Ask the CDN to drop cached pages tagged with these surrogate keys."""
    service = os.environ["FASTLY_SERVICE_ID"]
    headers = {"Fastly-Key": os.environ["FASTLY_API_TOKEN"]}
    for key in keys:
        url = f"https://api.fastly.com/service/{service}/purge/{key}"
        requests.post(url, headers=headers, timeout=10).raise_for_status()

def on_publish(article: dict) -> None:
    build_article(article)
    # These pages all show the story, so all of them need fresh copies.
    purge([f"article-{article['id']}", f"section-{article['section']}", "homepage"])`,
    },
  ],

  playground: {
    title: 'Article page',
    description:
      'A mini article page like a news site or blog: a reading progress bar, an automatic reading-time estimate, text size buttons, a clap counter, a newsletter sign-up with email checking, and comments that get held for moderation when they contain links.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Article</title>
<style>
:root {
  --brand: {{brand}}; /* @tweak color "Brand color" */
  --accent: {{accent}}; /* @tweak color "Accent color" */
  --paper: #fffdf8; /* @tweak color "Page background" */
  --ink: #1f2328; /* @tweak color "Text color" */
  --text-size: 17px; /* @tweak range 14 22 "Article text size" */
  --radius: 10px; /* @tweak range 0 24 "Corner radius" */
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--paper); color: var(--ink); font-family: Georgia, "Times New Roman", serif; }
.progress { position: fixed; top: 0; left: 0; height: 4px; width: 0; background: var(--brand); z-index: 2; }
header { padding: 14px 16px; border-bottom: 1px solid rgba(0,0,0,.1); text-align: center; }
.masthead { font-size: 26px; font-weight: 700; letter-spacing: -.5px; color: var(--brand); }
main { padding: 16px; }
.section { font: 700 12px/1 -apple-system, "Segoe UI", sans-serif; text-transform: uppercase; letter-spacing: 1px; color: var(--accent); }
h1 { font-size: 27px; line-height: 1.15; margin: 8px 0 10px; }
.meta { font: 13px -apple-system, "Segoe UI", sans-serif; color: #6b7280; display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.tools { margin-left: auto; display: flex; gap: 6px; }
button { font: 600 13px -apple-system, "Segoe UI", sans-serif; border: 1px solid rgba(0,0,0,.15); background: transparent; color: var(--ink); border-radius: var(--radius); padding: 6px 10px; cursor: pointer; }
.hero { height: 150px; margin: 14px 0; border-radius: var(--radius); background: linear-gradient(135deg, var(--brand), var(--accent)); display: grid; place-items: center; font-size: 56px; }
article p { font-size: var(--text-size); line-height: 1.6; margin: 0 0 14px; }
.clap.on { background: var(--brand); color: #fff; border-color: var(--brand); }
.box { margin: 22px 0; padding: 16px; border-radius: var(--radius); background: rgba(0,0,0,.04); font-family: -apple-system, "Segoe UI", sans-serif; }
.box h2 { font-size: 17px; margin: 0 0 10px; }
.row { display: flex; gap: 8px; }
input, textarea { flex: 1; min-width: 0; font: 15px -apple-system, "Segoe UI", sans-serif; padding: 9px 10px; border: 1px solid rgba(0,0,0,.2); border-radius: var(--radius); background: #fff; }
textarea { width: 100%; height: 64px; resize: none; margin-bottom: 8px; }
.primary { background: var(--brand); color: #fff; border-color: var(--brand); }
.msg { font-size: 13px; margin: 8px 0 0; min-height: 16px; }
.comment { padding: 10px 0; border-top: 1px solid rgba(0,0,0,.08); font-size: 14px; }
.comment b { display: block; font-size: 13px; }
.pending { opacity: .6; }
.pending b::after { content: " · waiting for a moderator"; font-weight: 400; color: #b45309; }
</style>
</head>
<body>
<div class="progress" id="progress"></div>
<header><div class="masthead" data-edit="masthead">{{name}}</div></header>
<main>
  <div class="section" data-edit="section">Technology</div>
  <h1 data-edit="headline">How a Web Page Reaches You in Under a Second</h1>
  <div class="meta">
    <span data-edit="byline">By Sam Rivera</span>·<span id="readtime"></span>
    <span class="tools"><button id="smaller">A-</button><button id="bigger">A+</button></span>
  </div>
  <div class="hero">🌍</div>
  <article id="article">
    <p>When you tap a headline, your phone does not reach all the way to the newsroom's main computer. Instead, it talks to a server that might be just a few miles away.</p>
    <p>That nearby server belongs to a content delivery network, or CDN. It keeps ready-made copies of popular pages, so it can answer almost instantly.</p>
    <p>The page itself was built the moment the editor pressed Publish. A program poured the story into a template and saved the finished HTML, like printing a newspaper before anyone wakes up.</p>
    <p>When a mistake is fixed, the site tells the CDN to throw away its old copies. This is called purging, and it means everyone sees the correction within seconds.</p>
    <p>Only the parts that change for each reader, like the comments below, are fetched live from a server after the page appears.</p>
  </article>
  <button class="clap" id="clap">👏 <span id="claps">128</span></button>

  <div class="box">
    <h2 data-edit="signup">Get the morning briefing</h2>
    <div class="row"><input id="email" type="email" placeholder="you@example.com"><button class="primary" id="subscribe">Subscribe</button></div>
    <p class="msg" id="emailMsg"></p>
  </div>

  <div class="box">
    <h2>Comments (<span id="count">0</span>)</h2>
    <textarea id="text" placeholder="Share your thoughts..."></textarea>
    <button class="primary" id="post">Post comment</button>
    <div id="comments"></div>
  </div>
</main>

<script>
const $ = (id) => document.getElementById(id);
const comments = [
  { name: 'Priya', text: 'I never knew pages were built ahead of time. Cool!', pending: false },
  { name: 'Leo', text: 'So that is why corrections show up so fast.', pending: false }
];

// Reading time: average adults read about 200-250 words per minute
const wordCount = ($('article').textContent.match(/[A-Za-z0-9']+/g) || []).length;
$('readtime').textContent = Math.max(1, Math.round(wordCount / 225)) + ' min read';

// Progress bar: how far down the page you have scrolled
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  $('progress').style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
});

// Text size buttons change the same CSS variable as the tweak slider
let size = 17;
function setSize(px) {
  size = Math.min(24, Math.max(13, px));
  document.documentElement.style.setProperty('--text-size', size + 'px');
}
$('smaller').onclick = () => setSize(size - 1);
$('bigger').onclick = () => setSize(size + 1);

// Clap once to add yours, tap again to take it back
let clapped = false;
$('clap').onclick = () => {
  clapped = !clapped;
  $('claps').textContent = 128 + (clapped ? 1 : 0);
  $('clap').classList.toggle('on', clapped);
};

// Newsletter sign-up with a simple email check
$('subscribe').onclick = () => {
  const email = $('email').value.trim();
  const ok = /^[^@ ]+@[^@ ]+[.][a-z]{2,}$/i.test(email);
  $('emailMsg').textContent = ok ? 'Check ' + email + ' to confirm your subscription.' : 'Please enter a valid email address.';
  $('emailMsg').style.color = ok ? 'green' : '#b91c1c';
};

// Comments: like the real API, anything with a link waits for a moderator
function renderComments() {
  $('comments').innerHTML = '';
  comments.forEach((c) => {
    const div = document.createElement('div');
    div.className = 'comment' + (c.pending ? ' pending' : '');
    div.innerHTML = '<b></b><span></span>';
    div.querySelector('b').textContent = c.name;
    div.querySelector('span').textContent = c.text;
    $('comments').appendChild(div);
  });
  $('count').textContent = comments.filter((c) => !c.pending).length;
}
$('post').onclick = () => {
  const text = $('text').value.trim();
  if (!text) return;
  comments.unshift({ name: 'You', text: text, pending: text.includes('http') });
  $('text').value = '';
  renderComments();
};
renderComments();
</script>
</body>
</html>`,
    challenges: [
      'Change the "Brand color" tweak and see the masthead, progress bar, buttons and hero image update together.',
      'Post a comment that contains "https://" and notice it is held for a moderator. Change the rule so comments with swear words you pick are held too.',
      'Add a sixth paragraph to the article and watch the reading-time estimate. How many words does it take to reach "2 min read"?',
      'Add a "Related stories" list under the article with three links, styled with the Accent color.',
    ],
  },

  concepts: [
    {
      term: 'CMS (content management system)',
      meaning:
        'Software that lets non-programmers write, edit, schedule and publish content through a friendly editor, while the content is saved in a database.',
    },
    {
      term: 'Headless CMS',
      meaning:
        'A CMS that only stores and manages content and hands it out through an API, so the same article can appear on a website, an app or a smart speaker.',
    },
    {
      term: 'Static site generation',
      meaning:
        'Building finished HTML pages ahead of time, when content changes, instead of on every visit. Pre-built pages are fast, cheap to serve and hard to crash.',
    },
    {
      term: 'CDN caching & purging',
      meaning:
        'A CDN stores copies of pages near readers (caching). When content changes, the site tells the CDN to delete the stale copies (purging) so readers get the new version.',
    },
    {
      term: 'Slug',
      meaning:
        'The readable, unique part of a URL that identifies a page, like how-wifi-works in /tech/how-wifi-works. It is usually made from the headline.',
    },
    {
      term: 'Revisions',
      meaning:
        'Saved snapshots of every edit to a page, so editors can see what changed, who changed it, and roll back a mistake. Wikis make this history public.',
    },
    {
      term: 'Content moderation',
      meaning:
        'Checking reader comments for spam and abuse, using automatic rules first and holding anything suspicious for a human to review.',
    },
    {
      term: 'RSS feed & sitemap',
      meaning:
        'Machine-readable files listing a site\'s pages. RSS lets readers and apps follow new posts; a sitemap helps search engines find every page.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Write posts in Markdown',
      detail:
        'Create a folder of .md files, one per post, with a small header for the title, date and tags. Markdown is plain text that turns into HTML, so it is easy to write and track with Git.',
    },
    {
      step: 'Generate a static site',
      detail:
        'Use Astro, Eleventy or Hugo to turn your Markdown into HTML pages with a shared layout, a homepage listing posts, and tag pages.',
    },
    {
      step: 'Deploy to a CDN',
      detail:
        'Push the project to GitHub and connect it to Netlify, Vercel, Cloudflare Pages or GitHub Pages. Every push rebuilds the site and publishes it worldwide for free.',
    },
    {
      step: 'Add an RSS feed and sitemap',
      detail:
        'Most generators have plugins for both. Then submit the sitemap in Google Search Console and check how your pages appear in search.',
    },
    {
      step: 'Add comments and a newsletter',
      detail:
        'Start with Giscus (comments stored in GitHub Discussions) and Buttondown for email. Later, build your own comments API with Express and PostgreSQL like the snippet above.',
    },
    {
      step: 'Try a headless CMS',
      detail:
        'Connect a free tier of Sanity, Strapi or Contentful so friends can write posts in a web editor, and have a webhook trigger a site rebuild whenever they publish.',
    },
  ],
};
