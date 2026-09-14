import type { ArchetypeTemplate } from '../types';

export const archetype: ArchetypeTemplate = {
  id: 'social',
  label: 'Social network',

  keywords: [
    'social',
    'social network',
    'social media',
    'friends',
    'followers',
    'following',
    'follow',
    'profile',
    'profiles',
    'news feed',
    'feed',
    'timeline',
    'likes',
    'comments',
    'hashtag',
    'hashtags',
    'trending',
    'stories',
    'reels',
    'pins',
    'boards',
    'reblog',
    'memes',
    'selfie',
    'status update',
    'connect with friends',
    'meet new people',
    'share photos',
    'community',
    'groups',
    'mentions',
    'viral',
  ],

  tagline: '{{name}} is a social network where people share posts, follow each other and react to what their friends are up to.',

  eli5:
    "{{name}} is like a giant digital bulletin board where everyone gets their own corner, called a profile. When you post something, it is saved in a database and a note goes out to the people who follow you. When you open your feed, servers collect recent posts from the people you follow, sort them so the most interesting ones come first, and send that list to your screen.",

  languages: [
    { name: 'TypeScript / JavaScript', usedFor: 'The web app and API servers that answer feed, profile and like requests', share: 30 },
    { name: 'Python', usedFor: 'Feed ranking models, spam detection and data pipelines', share: 20 },
    { name: 'Go', usedFor: 'High-traffic background workers like feed fan-out and notifications', share: 15 },
    { name: 'SQL', usedFor: 'Queries over users, posts, likes and the follow graph', share: 10 },
    { name: 'Swift', usedFor: 'The iOS app', share: 12 },
    { name: 'Kotlin', usedFor: 'The Android app', share: 13 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'GraphQL client',
          role: 'Fetches exactly the feed data a screen needs',
          beginnerNote:
            'Instead of calling five different URLs for a post, its author and its comments, the app sends one query that lists every field it wants, like ordering a custom sandwich.',
        },
        {
          name: 'Infinite scroll with lazy-loaded images',
          role: 'Keeps photo-heavy feeds fast',
          beginnerNote:
            'The page only downloads posts and photos that are about to appear on screen, then fetches the next batch as you scroll, so it never loads thousands of images at once.',
        },
      ],
    },
    {
      layer: 'Mobile',
      items: [
        {
          name: 'Swift & SwiftUI',
          role: 'Native iOS app',
          beginnerNote: "Apple's own language and UI toolkit give the iPhone app smooth scrolling and access to the camera and photo library.",
        },
        {
          name: 'Kotlin & Jetpack Compose',
          role: 'Native Android app',
          beginnerNote: "Kotlin is Android's recommended language, and Compose builds screens out of small reusable functions.",
        },
        {
          name: 'APNs & FCM',
          role: 'Push notifications',
          beginnerNote:
            'Apple Push Notification service and Firebase Cloud Messaging are the official pipes for sending "Sam liked your photo" alerts to phones, even when the app is closed.',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Node.js (TypeScript)',
          role: 'API servers',
          beginnerNote:
            'Node.js runs JavaScript on servers. It is good at juggling thousands of small requests at once, like likes, follows and "load more posts".',
        },
        {
          name: 'Go',
          role: 'Fan-out and notification workers',
          beginnerNote:
            'Go is a fast, simple language from Google that handles lots of work in parallel, perfect for pushing one new post into thousands of followers\' feeds.',
        },
        {
          name: 'Apache Kafka',
          role: 'Event stream between services',
          beginnerNote:
            'A shared, ordered log of everything that happens ("Maya posted", "Leo liked post 42"). Any service can read it and react, without the others needing to know.',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'PostgreSQL or MySQL (sharded)',
          role: 'Users, posts, likes and follows',
          beginnerNote:
            'A classic table-based database. When one machine is not enough, the data is split into "shards", for example users A to M on one server and N to Z on another.',
        },
        {
          name: 'Redis',
          role: 'Feed lists, counters and sessions',
          beginnerNote:
            "An in-memory store that answers in well under a millisecond. It keeps each person's ready-made list of feed post IDs so the feed does not have to be rebuilt on every visit.",
        },
        {
          name: 'Elasticsearch',
          role: 'Searching people and hashtags',
          beginnerNote: 'A search engine database that can find "cat memes" or a half-typed username across millions of records instantly.',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Amazon S3 (object storage)',
          role: 'Photo and video files',
          beginnerNote:
            'A practically bottomless hard drive in the cloud. The database stores only a short name for each photo, and the photo itself lives here.',
        },
        {
          name: 'Image CDN',
          role: 'Serves photos near users',
          beginnerNote:
            'Copies of popular images are kept on servers around the world and resized on the fly, so a thumbnail in Tokyo does not travel from Virginia.',
        },
        {
          name: 'Kubernetes',
          role: 'Runs the services',
          beginnerNote:
            'Kubernetes starts, restarts and scales hundreds of copies of each service automatically, like a manager who adds cashiers when the line gets long.',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Ranking models (PyTorch)',
          role: 'Order the feed',
          beginnerNote:
            'A model trained on past behavior guesses how likely you are to like, comment on or linger over each post, and the feed shows the highest scores first.',
        },
        {
          name: 'Moderation classifiers',
          role: 'Catch spam and harmful posts',
          beginnerNote:
            'Models scan new text and images and flag likely spam, scams or abuse for removal or for human reviewers, before they spread.',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'web',
        label: 'Web App',
        kind: 'client',
        tier: 0,
        tech: '{{frontend}} web app',
        description:
          'The {{name}} website in your browser. It shows your feed, profiles and notifications, and quietly loads more posts as you scroll.',
      },
      {
        id: 'mobile',
        label: 'Mobile Apps',
        kind: 'client',
        tier: 0,
        tech: 'Swift (iOS) · Kotlin (Android)',
        description:
          'The phone apps. They use the camera for new posts, cache recent feed items so the app opens instantly, and receive push notifications.',
      },
      {
        id: 'cdn',
        label: 'CDN',
        kind: 'edge',
        tier: 1,
        tech: '{{hosting}} · image CDN',
        description:
          'Servers around the world that keep copies of the site code, profile pictures and photos close to you, so image-heavy feeds load quickly.',
      },
      {
        id: 'lb',
        label: 'Load Balancer',
        kind: 'edge',
        tier: 1,
        tech: 'Cloud load balancer (e.g. AWS ALB or NGINX)',
        description:
          'The front door for app requests. It spreads millions of requests across many API servers so no single machine gets overwhelmed.',
      },
      {
        id: 'push',
        label: 'Push Services',
        kind: 'external',
        tier: 1,
        tech: 'Apple APNs · Google FCM',
        description:
          'Apple and Google run the pipes that deliver notifications to phones. {{name}} hands them a short message and they wake up your device, even if the app is closed.',
      },
      {
        id: 'api',
        label: 'API Gateway',
        kind: 'gateway',
        tier: 2,
        tech: 'GraphQL API (Node.js / TypeScript)',
        description:
          'One front door for every app request. It checks who you are, then asks the right internal services for exactly the data the screen needs.',
      },
      {
        id: 'posts',
        label: 'Posts & Profiles',
        kind: 'service',
        tier: 3,
        tech: 'Node.js or Python service',
        description:
          'Saves new posts, comments, likes and follows, and loads profiles. After each change it announces an event like "Maya liked post 42" so other services can react.',
      },
      {
        id: 'feed',
        label: 'Feed Service',
        kind: 'service',
        tier: 3,
        tech: 'Go service',
        description:
          'Builds your home feed. It grabs a list of recent posts from people you follow, which is usually prepared ahead of time, and asks the ranking model to put the best ones first.',
      },
      {
        id: 'ranker',
        label: 'Ranking Model',
        kind: 'ml',
        tier: 3,
        tech: 'PyTorch model served from Python',
        description:
          'Scores each candidate post by how likely you are to engage with it, using signals like who posted it, how fresh it is and what you have liked before.',
      },
      {
        id: 'notify',
        label: 'Notification Workers',
        kind: 'service',
        tier: 3,
        tech: 'Go workers',
        description:
          'Listen for events like new followers and likes, bundle them so you get "Sam and 12 others liked your post" instead of 13 pings, save them and send push alerts.',
      },
      {
        id: 'db',
        label: 'Main Database',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL or MySQL (sharded)',
        description:
          'The source of truth for users, posts, comments, likes and the follow graph. With millions of users, the rows are split across many database servers.',
      },
      {
        id: 'cache',
        label: 'Feed & Counter Cache',
        kind: 'cache',
        tier: 4,
        tech: 'Redis',
        description:
          "Super-fast memory for things read constantly: each person's list of feed post IDs, like counts and login sessions. Reading from memory saves the database from millions of repeat questions.",
      },
      {
        id: 'events',
        label: 'Event Stream',
        kind: 'queue',
        tier: 4,
        tech: 'Apache Kafka',
        description:
          'An ordered log of everything happening: new posts, likes, follows. Services subscribe to it, so the post service never needs to know who cares about a new like.',
      },
      {
        id: 'storage',
        label: 'Photo & Video Storage',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3 (object storage)',
        description:
          'Holds the actual image and video files, saved in several sizes. The database only stores the name of each file.',
      },
    ],
    edges: [
      { from: 'web', to: 'cdn', label: 'Page code & images' },
      { from: 'mobile', to: 'cdn', label: 'Photos & thumbnails' },
      { from: 'cdn', to: 'storage', label: 'Fetch on cache miss' },
      { from: 'web', to: 'lb', label: 'HTTPS / GraphQL' },
      { from: 'mobile', to: 'lb', label: 'HTTPS / GraphQL' },
      { from: 'lb', to: 'api', label: 'Routes requests' },
      { from: 'api', to: 'posts', label: 'Post, like, follow' },
      { from: 'api', to: 'feed', label: 'Load home feed' },
      { from: 'api', to: 'notify', label: 'Notification list' },
      { from: 'posts', to: 'db', label: 'Save rows' },
      { from: 'posts', to: 'storage', label: 'Store uploaded photos' },
      { from: 'posts', to: 'events', label: 'Publish events' },
      { from: 'events', to: 'feed', label: 'New post events' },
      { from: 'events', to: 'notify', label: 'Like & follow events' },
      { from: 'feed', to: 'cache', label: 'Read & update feed lists' },
      { from: 'feed', to: 'ranker', label: 'Score candidates' },
      { from: 'feed', to: 'db', label: 'Post details & follows' },
      { from: 'notify', to: 'db', label: 'Save notifications' },
      { from: 'notify', to: 'push', label: 'Send alerts' },
      { from: 'push', to: 'mobile', label: 'Notification on your phone' },
    ],
    flows: [
      {
        id: 'post-photo',
        title: 'You post a photo',
        emoji: '📸',
        steps: [
          {
            from: 'mobile',
            to: 'lb',
            narration:
              'You pick a photo, write a caption and tap Share. The app sends the photo and caption to {{name}} over an encrypted HTTPS connection.',
          },
          { from: 'lb', to: 'api', narration: 'The load balancer picks an API server that is not too busy and passes the request along.' },
          {
            from: 'api',
            to: 'posts',
            narration: 'The API checks that you are logged in, then hands the new post to the Posts service.',
          },
          {
            from: 'posts',
            to: 'storage',
            narration:
              'The photo file is saved in object storage, along with smaller resized copies for thumbnails and slow connections.',
          },
          {
            from: 'posts',
            to: 'db',
            narration:
              'A new row goes into the posts table: who posted it, the caption, the photo file name and the time. Your post now officially exists.',
          },
          {
            from: 'posts',
            to: 'events',
            narration: 'The Posts service publishes a "new post" event to the event stream and replies to your app that it worked.',
          },
          {
            from: 'events',
            to: 'feed',
            narration:
              'The Feed service reads the event and adds your post ID to the cached feed list of each follower. This copying to every follower is called fan-out.',
          },
        ],
      },
      {
        id: 'open-feed',
        title: 'You open your home feed',
        emoji: '🏠',
        steps: [
          {
            from: 'web',
            to: 'lb',
            narration: 'You open {{name}} in your browser. The page sends a GraphQL query asking for the first 20 posts of your feed.',
          },
          { from: 'lb', to: 'api', narration: 'The request is routed to one of many identical API servers.' },
          { from: 'api', to: 'feed', narration: 'The API asks the Feed service for your feed.' },
          {
            from: 'feed',
            to: 'cache',
            narration:
              'Feed grabs your ready-made list of a few hundred recent post IDs from Redis. Because it was built ahead of time, this takes about a millisecond.',
          },
          {
            from: 'feed',
            to: 'ranker',
            narration:
              'The ranking model scores every candidate: close friends, fresh posts and posts like ones you enjoyed before get higher scores.',
          },
          {
            from: 'feed',
            to: 'db',
            narration: 'For the top 20, Feed loads the details: captions, author names, like counts and photo file names.',
          },
          {
            from: 'web',
            to: 'cdn',
            narration:
              'The JSON reply reaches your browser, which then downloads each photo from a nearby CDN server as it scrolls into view.',
          },
        ],
      },
      {
        id: 'get-liked',
        title: 'Someone likes your post',
        emoji: '❤️',
        steps: [
          {
            from: 'web',
            to: 'lb',
            narration: 'A friend taps the heart under your post. Their browser sends a tiny "like post 42" request.',
          },
          { from: 'lb', to: 'api', narration: 'The request reaches an API server, which checks that your friend is logged in.' },
          {
            from: 'api',
            to: 'posts',
            narration:
              'The Posts service saves the like. A rule in the database allows only one like per person per post, so a double tap cannot count twice.',
          },
          {
            from: 'posts',
            to: 'events',
            narration: 'It publishes a "post liked" event. The heart on your friend\'s screen has already turned red.',
          },
          {
            from: 'events',
            to: 'notify',
            narration:
              'A notification worker picks up the event, bundles it with other recent likes and saves "Alex and 3 others liked your post".',
          },
          {
            from: 'notify',
            to: 'push',
            narration: 'The worker sends a short alert to Apple or Google, addressed to your phone\'s device token.',
          },
          { from: 'push', to: 'mobile', narration: 'Your phone buzzes, even though the {{name}} app was closed.' },
        ],
      },
    ],
  },

  files: [
    { path: 'services/api/src/schema/feed.graphql', note: 'GraphQL types for users, posts and the feed' },
    { path: 'services/api/src/resolvers/feed.ts', note: 'Asks the Feed service for your posts and fills in the details' },
    { path: 'services/posts/src/routes/likes.ts', note: 'Like and unlike endpoints' },
    { path: 'services/posts/src/routes/follows.ts', note: 'Follow and unfollow endpoints' },
    { path: 'services/posts/src/uploads/presign.ts', note: 'Creates short-lived links so apps can upload photos straight to storage' },
    { path: 'services/feed/fanout/worker.go', note: "Adds new post IDs to each follower's cached feed" },
    { path: 'services/feed/candidates/collect.go', note: 'Gathers a few hundred candidate posts for one user' },
    { path: 'services/notifications/bundler.go', note: 'Groups many likes into one notification' },
    { path: 'services/notifications/push/apns_fcm.go', note: 'Sends alerts through Apple and Google push services' },
    { path: 'ml/ranking/features.py', note: 'Turns posts and your history into numbers a model can read' },
    { path: 'ml/ranking/train_engagement_model.py', note: 'Trains the model that predicts likes and comments' },
    { path: 'ml/moderation/spam_classifier.py', note: 'Flags spammy or harmful posts' },
    { path: 'db/migrations/001_social_schema.sql', note: 'Tables for users, posts, follows and likes' },
    { path: 'events/schemas/post_liked.avsc', note: 'Describes the shape of a "post liked" event' },
    { path: 'infra/k8s/feed-service.yaml', note: 'Tells Kubernetes how many copies of the Feed service to run' },
  ],

  code: [
    {
      id: 'like-endpoint',
      title: 'Liking a post (API endpoint)',
      file: 'services/posts/src/routes/likes.ts',
      language: 'TypeScript',
      explanation:
        'When you tap the heart, the app calls an endpoint like this. A database transaction saves the like and bumps the stored like count together, so they can never disagree. ON CONFLICT DO NOTHING turns a double tap into a harmless no-op. Finally an event is published to Kafka so notification workers can tell the author, without this endpoint waiting for them.',
      code: `import express from 'express'; // Express 5 passes async errors to its error handler
import { Pool } from 'pg';
import { Kafka } from 'kafkajs';
import { requireAuth } from './auth'; // sets res.locals.userId
const app = express();
const db = new Pool(); // connection settings come from environment variables
const producer = new Kafka({ clientId: 'posts', brokers: ['kafka:9092'] }).producer();

app.post('/posts/:postId/like', requireAuth, async (req, res) => {
  const userId = res.locals.userId as number;
  const postId = Number(req.params.postId);
  const client = await db.connect();
  let isNewLike = false;
  try {
    await client.query('BEGIN'); // both writes succeed together or not at all
    const inserted = await client.query(
      'INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, postId],
    );
    isNewLike = inserted.rowCount === 1; // 0 means this person already liked it
    if (isNewLike) {
      await client.query('UPDATE posts SET like_count = like_count + 1 WHERE id = $1', [postId]);
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  if (isNewLike) {
    const event = { type: 'post_liked', userId, postId, at: new Date().toISOString() };
    await producer.send({ topic: 'post-events', messages: [{ key: String(postId), value: JSON.stringify(event) }] });
  }
  res.json({ liked: true });
});

producer.connect().then(() => app.listen(3000));`,
    },
    {
      id: 'social-schema',
      title: 'Users, posts and the follow graph',
      file: 'db/migrations/001_social_schema.sql',
      language: 'SQL',
      explanation:
        'Four tables are enough for a basic social network. The follow graph is simply rows of "who follows whom", and composite primary keys stop duplicate follows and likes. Indexes match the most common questions, like "newest posts by this author" and "who follows me?". The last query builds a simple chronological feed; big networks prepare this list ahead of time instead of running it on every visit.',
      code: `CREATE TABLE users (
  id           BIGSERIAL PRIMARY KEY,
  username     TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE posts (
  id         BIGSERIAL PRIMARY KEY,
  author_id  BIGINT NOT NULL REFERENCES users(id),
  caption    TEXT,
  photo_key  TEXT,                      -- file name in object storage
  like_count INT NOT NULL DEFAULT 0,      -- stored so feeds never COUNT(*) likes
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX posts_by_author ON posts (author_id, created_at DESC);
-- The follow graph: one row per arrow "follower -> followee".
CREATE TABLE follows (
  follower_id BIGINT NOT NULL REFERENCES users(id),
  followee_id BIGINT NOT NULL REFERENCES users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, followee_id),
  CHECK (follower_id <> followee_id)      -- you cannot follow yourself
);
CREATE INDEX followers_of ON follows (followee_id);

CREATE TABLE likes (
  user_id    BIGINT NOT NULL REFERENCES users(id),
  post_id    BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)          -- one like per person per post
);

-- A simple chronological feed for user 42.
SELECT p.id, p.caption, p.like_count, p.created_at, u.username
FROM follows f
JOIN posts p ON p.author_id = f.followee_id
JOIN users u ON u.id = p.author_id
WHERE f.follower_id = 42
ORDER BY p.created_at DESC LIMIT 20;`,
    },
    {
      id: 'feed-ranking',
      title: 'Ranking a feed',
      file: 'services/feed/ranking/score.py',
      language: 'Python',
      explanation:
        'This hand-written formula shows the ideas behind feed ranking. Fresh posts get a boost that halves every few hours, posts from people you interact with a lot score higher, and a logarithm stops one viral post from drowning out everything else. A diversity rule then keeps any one person from filling your screen. Large networks replace the formula with machine learning models that predict the chance you will like, comment or share, but the pipeline shape is the same.',
      code: `import math
import time
from dataclasses import dataclass

@dataclass
class Candidate:
    post_id: int
    author_id: int
    created_at: float  # Unix time in seconds
    likes: int
    comments: int

def score(post: Candidate, closeness: dict[int, float], now: float) -> float:
    hours_old = (now - post.created_at) / 3600
    freshness = 0.5 ** (hours_old / 6)  # a post's boost halves every 6 hours
    # How much you interact with this author (0 to 1), learned from your history.
    friendship = closeness.get(post.author_id, 0.05)
    # log1p grows slowly, so 10,000 likes is not 1,000x better than 10.
    engagement = math.log1p(post.likes + 3 * post.comments)
    return friendship * (1 + engagement) * freshness

def rank_feed(candidates: list[Candidate], closeness: dict[int, float], limit: int = 20):
    now = time.time()
    ranked = sorted(candidates, key=lambda p: score(p, closeness, now), reverse=True)
    feed, shown_per_author = [], {}
    for post in ranked:
        count = shown_per_author.get(post.author_id, 0)
        if count < 2:  # diversity: at most 2 posts per author per page
            feed.append(post)
            shown_per_author[post.author_id] = count + 1
        if len(feed) == limit:
            break
    return feed`,
    },
  ],

  playground: {
    title: 'Home feed',
    description:
      'A tiny social feed: write a post, like and follow, switch between a ranked "For you" tab and a chronological "Following" tab, and watch notifications arrive on the bell.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Feed</title>
<style>
:root {
  --brand: {{brand}}; /* @tweak color "Brand color" */
  --accent: {{accent}}; /* @tweak color "Accent color" */
  --bg: #f0f2f5; /* @tweak color "Background" */
  --radius: 14px; /* @tweak range 0 28 "Card corners" */
  --avatar: 40px; /* @tweak range 28 60 "Avatar size" */
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: #1c1e21; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
button { font: inherit; border: 0; background: none; cursor: pointer; }
header { position: sticky; top: 0; z-index: 2; display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #fff; border-bottom: 1px solid #e4e6eb; }
.logo { color: var(--brand); font-size: 22px; font-weight: 800; }
.bell { position: relative; font-size: 20px; }
.badge { position: absolute; top: -4px; right: -8px; padding: 1px 6px; border-radius: 9px; background: var(--brand); color: var(--on-brand, #fff); font-size: 11px; font-weight: 700; }
.badge.zero { display: none; }
.panel { background: #fff; margin: 8px 10px 0; padding: 4px 12px; border-radius: var(--radius); box-shadow: 0 4px 16px rgba(0,0,0,.12); font-size: 13px; }
.tabs { display: flex; background: #fff; }
.tab { flex: 1; padding: 10px; color: #65676b; font-weight: 600; border-bottom: 3px solid transparent; }
.tab.on { color: var(--brand); border-color: var(--brand); }
.card { background: #fff; margin: 10px; padding: 12px; border-radius: var(--radius); box-shadow: 0 1px 2px rgba(0,0,0,.1); }
textarea { width: 100%; padding: 10px; border: 1px solid #e4e6eb; border-radius: calc(var(--radius) / 2); font: inherit; resize: none; }
.row { display: flex; align-items: center; gap: 10px; }
.end { justify-content: flex-end; margin-top: 8px; }
.pill { padding: 6px 18px; border-radius: 999px; background: var(--brand); color: var(--on-brand, #fff); font-weight: 600; }
.ghost { padding: 4px 12px; border-radius: 999px; border: 1.5px solid var(--accent); color: inherit; font-size: 13px; font-weight: 600; }
.ghost.on { background: var(--accent); color: var(--on-accent, #fff); }
.avatar { width: var(--avatar); height: var(--avatar); flex-shrink: 0; border-radius: 50%; display: grid; place-items: center; font-size: calc(var(--avatar) / 2); }
.who { flex: 1; }
.who b { display: block; font-size: 14px; }
.who small, .hint { color: #65676b; font-size: 12px; }
.photo { height: 160px; margin: 10px -12px 0; display: grid; place-items: center; font-size: 64px; }
.text { margin: 10px 0 0; font-size: 15px; line-height: 1.4; }
.actions { margin-top: 10px; padding-top: 6px; border-top: 1px solid #e4e6eb; }
.like { padding: 6px 2px; color: #65676b; font-weight: 600; }
.like.on { color: var(--brand); }
.pop { animation: pop .3s; }
@keyframes pop { 50% { transform: scale(1.35); } }
.hint { text-align: center; margin: 4px 0 20px; }
</style>
</head>
<body>
<header>
  <span class="logo" data-edit="logo">{{name}}</span>
  <button class="bell" id="bell" aria-label="Notifications">🔔<span class="badge" id="badge">0</span></button>
</header>
<div class="panel" id="panel" hidden></div>
<nav class="tabs">
  <button class="tab on" data-sort="rank" data-edit="tab-rank">For you</button>
  <button class="tab" data-sort="time" data-edit="tab-time">Following</button>
</nav>
<div class="card">
  <textarea id="draft" rows="2" placeholder="What's new?"></textarea>
  <div class="row end"><button class="pill" id="share" data-edit="share">Post</button></div>
</div>
<main id="feed"></main>
<p class="hint" data-edit="hint">Likes and freshness decide the order of For you</p>

<script>
// Pretend feed data. A real app gets this as JSON from the feed API.
const posts = [
  { name: 'Maya Chen', emoji: '🦊', color: '#ffd8a8', mins: 12, text: 'Finished my first hackathon project!', photo: '🚀', likes: 48, following: true },
  { name: 'Leo Park', emoji: '🐻', color: '#c3fae8', mins: 95, text: 'Sunset from the library roof. Worth the stairs.', photo: '🌇', likes: 210, following: true },
  { name: 'Priya Das', emoji: '🐼', color: '#e5dbff', mins: 40, text: 'Hot take: tabs are better than spaces.', photo: '', likes: 17, following: false },
  { name: 'Sam Rivera', emoji: '🐸', color: '#d3f9d8', mins: 300, text: 'Made pancakes shaped like binary trees.', photo: '🥞', likes: 96, following: true }
];
let sortBy = 'rank';
let popped = null;   // the post whose heart should animate
let unread = 2;
const notifications = ['Leo Park started following you', 'Priya Das commented: "so true"'];
const $ = (id) => document.getElementById(id);

// Keep button text readable on any brand color: dark text on light colors, white on dark ones
const root = document.documentElement;
function syncInk() {
  ['brand', 'accent'].forEach((name) => {
    const hex = getComputedStyle(root).getPropertyValue('--' + name).trim();
    const n = parseInt(hex.slice(1), 16);
    const light = hex.length === 7 && 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 165;
    const ink = light ? '#111' : '#fff';
    if (root.style.getPropertyValue('--on-' + name) !== ink) root.style.setProperty('--on-' + name, ink);
  });
}
new MutationObserver(syncInk).observe(root, { attributes: true, attributeFilter: ['style'] }); // re-check when a tweak changes a color
syncInk();

// Tiny ranking formula: more likes = higher, older = lower. Real apps use ML models.
function score(p) { return (p.likes + 1) / Math.pow(p.mins / 60 + 2, 1.5); }
function ago(m) { return m < 1 ? 'now' : m < 60 ? m + 'm' : Math.floor(m / 60) + 'h'; }

function render() {
  const list = posts
    .filter((p) => sortBy === 'rank' || p.following)     // Following tab = only people you follow
    .sort((a, b) => sortBy === 'rank' ? score(b) - score(a) : a.mins - b.mins);
  $('feed').innerHTML = '';
  list.forEach((p) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = '<div class="row"><span class="avatar"></span><div class="who"><b></b><small></small></div>' +
      (p.mine ? '' : '<button class="ghost"></button>') + '</div>' +
      (p.photo ? '<div class="photo"></div>' : '') +
      '<p class="text"></p><div class="actions"><button class="like"></button></div>';
    const avatar = card.querySelector('.avatar');
    avatar.textContent = p.emoji;
    avatar.style.background = p.color;
    card.querySelector('b').textContent = p.name;
    card.querySelector('small').textContent = ago(p.mins) + (p.following ? ' · Following' : ' · Suggested for you');
    card.querySelector('.text').textContent = p.text; // textContent keeps typed HTML from running
    if (p.photo) {
      const photo = card.querySelector('.photo');
      photo.textContent = p.photo;
      photo.style.background = 'linear-gradient(135deg, ' + p.color + ', var(--accent))';
    }
    const like = card.querySelector('.like');
    like.textContent = (p.liked ? '♥ ' : '♡ ') + p.likes;
    like.classList.toggle('on', !!p.liked);
    like.classList.toggle('pop', p === popped);
    like.onclick = () => { p.liked = !p.liked; p.likes += p.liked ? 1 : -1; popped = p; render(); };
    const follow = card.querySelector('.ghost');
    if (follow) {
      follow.textContent = p.following ? 'Following' : 'Follow';
      follow.classList.toggle('on', p.following);
      // Following is an edge in the social graph, so it applies to all of that person's posts
      follow.onclick = () => { const now = !p.following; posts.forEach((q) => { if (q.name === p.name) q.following = now; }); render(); };
    }
    $('feed').appendChild(card);
  });
  popped = null;
}

function drawBell() {
  $('badge').textContent = unread;
  $('badge').classList.toggle('zero', unread === 0);
  $('panel').innerHTML = '';
  notifications.slice(0, 5).forEach((n) => {
    const p = document.createElement('p');
    p.textContent = '🔔 ' + n;
    $('panel').appendChild(p);
  });
}

// In a real app this arrives as a push notification from a worker reading the event stream
function notify(text) { notifications.unshift(text); unread++; drawBell(); }

$('bell').onclick = () => { $('panel').hidden = !$('panel').hidden; unread = 0; drawBell(); };

document.querySelectorAll('.tab').forEach((tab) => {
  tab.onclick = () => {
    sortBy = tab.dataset.sort;
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('on', t === tab));
    render();
  };
});

$('share').onclick = () => {
  const text = $('draft').value.trim();
  if (!text) return;
  posts.push({ name: 'You', emoji: '😎', color: '#ffe066', mins: 0, text: text, photo: '', likes: 0, following: true, mine: true });
  $('draft').value = '';
  render();
  // Simulate a follower reacting a moment later
  setTimeout(() => { posts[posts.length - 1].likes++; render(); notify('Maya Chen liked your post'); }, 2500);
};

render();
drawBell();
</script>
</body>
</html>`,
    challenges: [
      'Change the "Brand color" tweak and watch the logo, the active tab, the badge and every liked heart update together.',
      'In the posts array, change Priya\'s likes from 17 to 150 and watch her post jump up the For you tab. Then edit score() so freshness matters more than likes.',
      'Follow Priya, then switch to the Following tab. Her post now appears because you added an edge to your social graph.',
      'Add a comment counter next to the like button that goes up by one each time you tap it.',
    ],
  },

  concepts: [
    {
      term: 'Social graph',
      meaning:
        'The web of connections between people: who follows whom, who is friends with whom. It is often stored as simple rows like "user 7 follows user 42".',
    },
    {
      term: 'Fan-out',
      meaning:
        "Copying a new post's ID into the feed list of every follower when it is posted, so reading a feed later is quick. Accounts with millions of followers are often handled differently, by fetching their posts at read time.",
    },
    {
      term: 'Feed ranking',
      meaning:
        'Sorting candidate posts by a score, such as how likely you are to engage with each one, instead of simply showing the newest first.',
    },
    {
      term: 'Caching',
      meaning:
        'Keeping a ready-made copy of frequently read data, like feed lists or like counts, in fast memory so the database does not have to recompute it every time.',
    },
    {
      term: 'Sharding',
      meaning:
        'Splitting one huge database into many smaller ones, for example by user ID, so each server only holds and handles part of the data.',
    },
    {
      term: 'Event stream (pub/sub)',
      meaning:
        'Services publish messages about things that happened, like "post liked", and any other service can subscribe and react, without the two needing to know about each other.',
    },
    {
      term: 'Push notifications',
      meaning:
        'Short alerts sent through Apple or Google servers that appear on a phone even when the app is closed.',
    },
    {
      term: 'Content moderation',
      meaning:
        'The mix of automated filters and human reviewers that finds and removes spam, scams and harmful posts.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Design the tables',
      detail:
        'Create users, posts, follows and likes tables in PostgreSQL. Supabase gives you a free hosted Postgres database with sign-in built in.',
    },
    {
      step: 'Add sign-up and profiles',
      detail:
        'Use Supabase Auth or Firebase Authentication for accounts, then build a profile page that shows a user\'s avatar, bio and posts.',
    },
    {
      step: 'Build a chronological feed',
      detail:
        'Write the SQL that joins follows to posts and orders by created_at, then show the results in a React app built with Vite or Next.js.',
    },
    {
      step: 'Make likes and follows work',
      detail:
        'Add like and follow buttons. Use composite primary keys so a double tap never creates a duplicate row.',
    },
    {
      step: 'Support photo uploads',
      detail:
        'Store images in Supabase Storage, Cloudinary or Amazon S3 and save only the file name in the posts table. Show them with lazy-loading <img> tags.',
    },
    {
      step: 'Add notifications and ranking, then deploy',
      detail:
        'Create a notifications table filled when someone likes or follows, try a simple scoring formula for the feed, then deploy the frontend to Vercel or Netlify.',
    },
  ],
};
