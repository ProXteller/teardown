import type { ArchetypeTemplate } from '../types';

export const archetype: ArchetypeTemplate = {
  id: 'webapp',
  label: 'Web app',

  keywords: [
    'web app',
    'webapp',
    'web application',
    'web portal',
    'dashboard',
    'portal',
    'client portal',
    'customer portal',
    'member login',
    'members area',
    'my account',
    'account management',
    'self-service',
    'admin panel',
    'control panel',
    'online tool',
    'free tool',
    'tracker',
    'generator',
    'converter',
    'calculator',
    'checker',
    'directory',
    'forum',
    'registration',
    'form builder',
    'survey',
    'status page',
    'booking system',
    'management system',
  ],

  tagline: '{{name}} is a website and web app that runs in your browser and keeps your data safely on its servers.',

  eli5:
    "{{name}} works like a restaurant. Your browser is the dining room where you look at the menu and place orders, the web server is the waiter who carries each order to the kitchen, and the database is the pantry where everything is stored for good. Slow chores, like sending you an email, are handed to background workers so the waiter can hurry straight back to your table.",

  languages: [
    { name: 'TypeScript / JavaScript', usedFor: 'Interactive pages in the browser and often the API server (Node.js)', share: 40 },
    { name: 'HTML & CSS', usedFor: 'The structure and style of every page', share: 20 },
    { name: 'SQL', usedFor: 'Creating tables and asking the database questions', share: 15 },
    { name: 'Python', usedFor: 'Background workers, scripts and back ends built with Django or FastAPI', share: 15 },
    { name: 'YAML & shell', usedFor: 'Docker, CI pipelines and deploy scripts', share: 10 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'HTML, CSS & JavaScript',
          role: 'The pages you see',
          beginnerNote:
            'HTML is the structure, CSS is the style and JavaScript is the behavior. However fancy a website is, it ends up as these three in your browser.',
        },
        {
          name: 'TypeScript',
          role: 'JavaScript with types',
          beginnerNote:
            'TypeScript adds labels to data (this is a number, this is a user) so many mistakes are caught before the code ever runs.',
        },
        {
          name: 'Fetch API & JSON',
          role: 'Talking to the server',
          beginnerNote:
            'The page quietly asks the server for data and gets back JSON, a simple text format for lists and objects, then updates the screen without reloading.',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Node.js with Express',
          role: 'Web server & API',
          beginnerNote:
            'Node.js runs JavaScript on a server, and Express maps URLs like /api/projects to functions you write. Django (Python), Rails (Ruby) and Laravel (PHP) play the same role.',
        },
        {
          name: 'REST API design',
          role: 'Rules for requests',
          beginnerNote:
            'A common way to design URLs: GET reads data, POST creates it, PATCH updates it and DELETE removes it, like verbs acting on nouns.',
        },
        {
          name: 'bcrypt & session cookies',
          role: 'Logging in safely',
          beginnerNote:
            'Passwords are stored only as scrambled hashes. After you log in, a random session ID in a cookie tells the server who you are on every request.',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'PostgreSQL',
          role: 'Main database',
          beginnerNote:
            'A relational database stores data in tables of rows and columns, like spreadsheets with strict rules, and answers questions written in SQL.',
        },
        {
          name: 'Redis',
          role: 'Cache, sessions & job queue',
          beginnerNote:
            'Redis keeps data in memory, so reads take about a millisecond. It is perfect for things checked constantly, like "is this session still valid?"',
        },
        {
          name: 'Amazon S3',
          role: 'File storage',
          beginnerNote:
            'A practically bottomless hard drive in the cloud for uploads like photos and PDFs. The database only remembers each file\'s name.',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Load balancer (nginx or AWS ALB)',
          role: 'Spreading traffic & HTTPS',
          beginnerNote:
            'Like a host at a busy restaurant, it sends each visitor to a server with a free table, and skips any server that has crashed.',
        },
        {
          name: 'Docker',
          role: 'Packaging the app',
          beginnerNote:
            'Docker packs the app with everything it needs into a container, so it runs the same on your laptop as it does in the cloud.',
        },
        {
          name: 'Amazon SES, Postmark or SendGrid',
          role: 'Sending email',
          beginnerNote:
            'Email sent from a random server often lands in spam. These services handle delivery, bounces and sender reputation for you.',
        },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        {
          name: 'GitHub Actions',
          role: 'Test & deploy automatically',
          beginnerNote:
            'Every time code is pushed, a robot runs the tests and, if they pass, ships the new version, so nobody has to deploy by hand.',
        },
        {
          name: 'Sentry',
          role: 'Error tracking',
          beginnerNote:
            'When something crashes for a real user, Sentry records the error and the exact line of code, and alerts the team.',
        },
        {
          name: 'Database migrations',
          role: 'Changing tables safely',
          beginnerNote:
            'Numbered files describe each change to the database, so your laptop, the test server and the live site all end up with exactly the same tables.',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'web',
        label: 'Browser',
        kind: 'client',
        tier: 0,
        tech: '{{frontend}} running in your browser',
        description:
          'The part you see and click. It downloads the page from the CDN, then talks to the API in the background to load and save your data.',
      },
      {
        id: 'admin',
        label: 'Admin Dashboard',
        kind: 'client',
        tier: 0,
        tech: 'Internal admin pages (custom or Retool)',
        description:
          'Private pages for the team running {{name}}, used to help customers, fix bad data and keep an eye on how things are going.',
      },
      {
        id: 'cdn',
        label: 'CDN',
        kind: 'edge',
        tier: 1,
        tech: '{{hosting}}',
        description:
          'Servers around the world keep copies of files that rarely change, like JavaScript, CSS, images and fonts, so they arrive quickly from somewhere near you.',
      },
      {
        id: 'load-balancer',
        label: 'Load Balancer',
        kind: 'edge',
        tier: 1,
        tech: 'nginx or AWS Application Load Balancer',
        description:
          "The front door for API traffic. It handles HTTPS encryption and spreads requests across several copies of the server, so one crash doesn't take the site down.",
      },
      {
        id: 'api',
        label: 'Web Server & API',
        kind: 'gateway',
        tier: 2,
        tech: 'Node.js (Express) · or Django, Rails, Laravel',
        description:
          'The brain of the app. It reads each request, checks who you are and what you are allowed to do, applies the business rules and replies with JSON.',
      },
      {
        id: 'monitoring',
        label: 'Monitoring',
        kind: 'external',
        tier: 2,
        tech: 'Sentry · Grafana · uptime checks',
        description:
          'Collects errors, logs and speed measurements, and wakes up an engineer if the site slows down or starts failing.',
      },
      {
        id: 'auth',
        label: 'Auth & Sessions',
        kind: 'service',
        tier: 3,
        tech: 'bcrypt + session cookies · or Auth0 / Clerk',
        description:
          'Signs people up, checks passwords and remembers who is logged in. It is often a module inside the main server, or a hosted login service.',
      },
      {
        id: 'queue',
        label: 'Job Queue',
        kind: 'queue',
        tier: 3,
        tech: 'Redis with BullMQ, Sidekiq or Celery',
        description:
          'A to-do list for slow chores. The API drops in jobs like "email this person" and answers you right away instead of making you wait.',
      },
      {
        id: 'worker',
        label: 'Background Workers',
        kind: 'service',
        tier: 3,
        tech: 'Worker processes (Node.js or Python)',
        description:
          'Separate programs that take jobs off the queue one by one: sending emails, resizing photos, building reports. If a job fails, they retry it later.',
      },
      {
        id: 'email',
        label: 'Email Service',
        kind: 'external',
        tier: 3,
        tech: 'Amazon SES · Postmark · SendGrid',
        description:
          'Delivers welcome emails, password resets and receipts, and tracks bounces so messages keep landing in inboxes instead of spam.',
      },
      {
        id: 'db',
        label: 'Database',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL',
        description:
          'The permanent home for important data: users, the things they create, settings and payments. Tables, rows and SQL keep it consistent and searchable.',
      },
      {
        id: 'cache',
        label: 'Cache',
        kind: 'cache',
        tier: 4,
        tech: 'Redis',
        description:
          "A super-fast memory store for things read constantly, like sessions and dashboard numbers, so the database doesn't answer the same question a thousand times.",
      },
      {
        id: 'storage',
        label: 'File Storage',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3',
        description:
          "Holds uploaded files such as profile photos and PDFs. The database stores only each file's name; the actual bytes live here.",
      },
    ],
    edges: [
      { from: 'web', to: 'cdn', label: 'HTML, CSS, JS & images' },
      { from: 'web', to: 'load-balancer', label: 'HTTPS API calls (JSON)' },
      { from: 'admin', to: 'load-balancer', label: 'HTTPS (staff only)' },
      { from: 'web', to: 'storage', label: 'Direct file upload' },
      { from: 'cdn', to: 'storage', label: 'Fetch files on cache miss' },
      { from: 'load-balancer', to: 'api', label: 'Forward to a healthy server' },
      { from: 'api', to: 'auth', label: 'Who is this?' },
      { from: 'auth', to: 'cache', label: 'Session lookup' },
      { from: 'auth', to: 'db', label: 'Users & password hashes' },
      { from: 'api', to: 'db', label: 'SQL queries' },
      { from: 'api', to: 'cache', label: 'Cached results' },
      { from: 'api', to: 'storage', label: 'Read & write files' },
      { from: 'api', to: 'queue', label: 'Enqueue job' },
      { from: 'queue', to: 'worker', label: 'Hand out jobs' },
      { from: 'worker', to: 'db', label: 'Update records' },
      { from: 'worker', to: 'storage', label: 'Process files' },
      { from: 'worker', to: 'email', label: 'Send email' },
      { from: 'api', to: 'monitoring', label: 'Errors & metrics' },
      { from: 'worker', to: 'monitoring', label: 'Failed jobs' },
    ],
    flows: [
      {
        id: 'sign-up',
        title: 'You sign up for an account',
        emoji: '✍️',
        steps: [
          {
            from: 'web',
            to: 'load-balancer',
            narration:
              'You fill in the sign-up form and press the button. The browser sends a POST request with your email and password, encrypted by HTTPS.',
          },
          {
            from: 'load-balancer',
            to: 'api',
            narration: 'The load balancer picks one of the healthy server copies and forwards the request to it.',
          },
          {
            from: 'api',
            to: 'auth',
            narration:
              'The API checks that the email looks valid and the password is long enough, then turns the password into a bcrypt hash that cannot be reversed.',
          },
          {
            from: 'auth',
            to: 'db',
            narration:
              'A new row is inserted into the users table. If that email already exists, a UNIQUE rule in the database rejects it and you see "already registered".',
          },
          {
            from: 'api',
            to: 'queue',
            narration:
              'The API sends back a session cookie so you are logged in, and drops a "send welcome email" job into the queue rather than making you wait for it.',
          },
          {
            from: 'queue',
            to: 'worker',
            narration: 'A background worker that is waiting for work picks up the job a moment later.',
          },
          {
            from: 'worker',
            to: 'email',
            narration:
              'The worker fills in the email template with your name and hands it to the email service, which delivers it to your inbox.',
          },
        ],
      },
      {
        id: 'open-dashboard',
        title: 'You open your dashboard',
        emoji: '📊',
        steps: [
          {
            from: 'web',
            to: 'cdn',
            narration:
              'The browser downloads the HTML, JavaScript and CSS from a CDN server near you. These files are the same for everyone, so they are cached close to users.',
          },
          {
            from: 'web',
            to: 'load-balancer',
            narration:
              'The JavaScript on the page asks for your data with GET /api/dashboard. Your session cookie rides along automatically.',
          },
          {
            from: 'load-balancer',
            to: 'api',
            narration: 'The request is forwarded to an API server.',
          },
          {
            from: 'api',
            to: 'auth',
            narration: 'First, the API needs to know who is asking, so it checks the session cookie.',
          },
          {
            from: 'auth',
            to: 'cache',
            narration:
              'The session ID is looked up in Redis. It is found and belongs to you, so the request is allowed to continue.',
          },
          {
            from: 'api',
            to: 'cache',
            narration:
              'The API checks the cache for your dashboard numbers. If they are there (a cache hit), it replies in a millisecond or two.',
          },
          {
            from: 'api',
            to: 'db',
            narration:
              'If not (a cache miss), it runs a SQL query, sends you the result as JSON and saves a copy in the cache for next time.',
          },
        ],
      },
      {
        id: 'upload-photo',
        title: 'You upload a profile photo',
        emoji: '🖼️',
        steps: [
          {
            from: 'web',
            to: 'load-balancer',
            narration: 'You choose a photo. Before sending it, the browser asks the API for permission to upload.',
          },
          {
            from: 'load-balancer',
            to: 'api',
            narration:
              'The API creates a "presigned URL": a special link that allows one upload to one spot in storage for a few minutes. It signs it with a secret key, no trip to storage needed.',
          },
          {
            from: 'web',
            to: 'storage',
            narration:
              'The browser uploads the photo straight to file storage using that link, so the heavy file never has to pass through the app servers.',
          },
          {
            from: 'api',
            to: 'queue',
            narration:
              'When the upload finishes, the browser tells the API, which queues a "make thumbnails" job.',
          },
          {
            from: 'queue',
            to: 'worker',
            narration: 'A background worker picks up the job.',
          },
          {
            from: 'worker',
            to: 'storage',
            narration:
              'The worker downloads the original photo, shrinks it to small and medium sizes, and saves those thumbnails back to storage.',
          },
          {
            from: 'worker',
            to: 'db',
            narration:
              'Finally it saves the thumbnail location on your user row. Next time any page shows your avatar, it loads quickly through the CDN.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'server/src/index.ts', note: 'Starts the web server and plugs in all the routes' },
    { path: 'server/src/routes/auth.ts', note: 'Sign up, log in and log out' },
    { path: 'server/src/routes/dashboard.ts', note: 'Returns the numbers shown on your dashboard' },
    { path: 'server/src/routes/uploads.ts', note: 'Hands out presigned upload URLs' },
    { path: 'server/src/middleware/requireUser.ts', note: 'Rejects requests that have no valid session' },
    { path: 'server/src/db/pool.ts', note: 'A shared pool of PostgreSQL connections' },
    { path: 'server/src/lib/cache.ts', note: 'Get-from-cache-or-load helper around Redis' },
    { path: 'db/migrations/001_create_users.sql', note: 'Creates the users table' },
    { path: 'db/migrations/002_create_projects.sql', note: 'Creates the projects table and its index' },
    { path: 'workers/worker.py', note: 'Background worker that runs queued jobs and retries failures' },
    { path: 'workers/jobs/make_thumbnails.py', note: 'Resizes uploaded photos with Pillow' },
    { path: 'emails/templates/welcome.html', note: 'The welcome email, with a slot for your name' },
    { path: 'Dockerfile', note: 'Recipe for packaging the server into a container' },
    { path: 'docker-compose.yml', note: 'Runs the app, PostgreSQL and Redis locally with one command' },
    { path: '.github/workflows/deploy.yml', note: 'Runs tests and deploys on every push to main' },
    { path: '.env.example', note: 'Lists the secrets the app needs, without the real values' },
  ],

  code: [
    {
      id: 'signup-endpoint',
      title: 'Sign-up API endpoint',
      file: 'server/src/routes/auth.ts',
      language: 'TypeScript',
      explanation:
        'This Express route shows the core of almost every web app. It validates the input, hashes the password with bcrypt (never storing the real one), and inserts the user with $1/$2/$3 placeholders so typed text can never be run as SQL. Then it creates a random session ID in Redis, puts it in a secure cookie, and pushes the slow "welcome email" work onto a queue so the response comes back fast.',
      code: `import express from 'express';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { Pool } from 'pg';
import Redis from 'ioredis';

export const auth = express.Router();
const db = new Pool({ connectionString: process.env.DATABASE_URL });
const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');

auth.post('/api/signup', async (req, res) => {
  const { email, password, name } = req.body ?? {};
  if (typeof email !== 'string' || !email.includes('@') || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Enter an email and a password of 8+ characters' });
  }
  const hash = await bcrypt.hash(password, 12); // slow on purpose, to resist guessing
  try {
    // $1, $2, $3 keep user input separate from the SQL text (no SQL injection).
    const { rows } = await db.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id',
      [email.toLowerCase(), hash, name ?? null],
    );
    const sessionId = randomBytes(32).toString('hex');
    await redis.set('session:' + sessionId, String(rows[0].id), 'EX', 60 * 60 * 24 * 30); // 30 days
    // Slow work goes on the job queue so this response stays fast.
    await redis.rpush('jobs', JSON.stringify({ type: 'send_welcome_email', to: email, name: name ?? '' }));
    res.cookie('sid', sessionId, { httpOnly: true, secure: true, sameSite: 'lax' });
    return res.status(201).json({ id: rows[0].id });
  } catch (err) {
    if ((err as { code?: string }).code === '23505') {
      return res.status(409).json({ error: 'That email is already registered' }); // UNIQUE violation
    }
    return res.status(500).json({ error: 'Something went wrong' });
  }
});`,
    },
    {
      id: 'users-projects-schema',
      title: 'Users and projects tables',
      file: 'db/migrations/002_create_projects.sql',
      language: 'SQL (PostgreSQL)',
      explanation:
        'Most web apps boil down to "users own things". Here each project row points at its owner with a foreign key (REFERENCES), and CHECK rules stop bad data from ever being saved. The index lets the dashboard find one user\'s newest projects without scanning the whole table, and the final query is the kind of question the API asks, with $1 filled in safely by the server.',
      code: `CREATE TABLE users (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,      -- a second sign-up with this email fails (error 23505)
  password_hash TEXT NOT NULL,             -- a bcrypt hash, never the real password
  name          TEXT,
  avatar_key    TEXT,                      -- where the photo lives in S3, e.g. 'avatars/42/256.webp'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE projects (
  id         BIGSERIAL PRIMARY KEY,
  owner_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  status     TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'done')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Makes "my projects, most recently updated first" fast even with millions of rows.
CREATE INDEX projects_owner_recent ON projects (owner_id, updated_at DESC);

-- The dashboard asks: how many projects do I have in each status?
SELECT status, COUNT(*) AS total
FROM projects
WHERE owner_id = $1
GROUP BY status;`,
    },
    {
      id: 'background-worker',
      title: 'Background job worker with retries',
      file: 'workers/worker.py',
      language: 'Python',
      explanation:
        'The API pushed jobs onto a Redis list called "jobs"; this worker pulls them off. BLPOP waits without using CPU until a job arrives. Each job type maps to a function, and if one fails (say the email service is briefly down) the job is retried with exponential backoff: wait 2, then 4, then 8 seconds. After 5 failures it moves to a "dead letter" list for a human to inspect. Libraries like Celery, Sidekiq and BullMQ give you this, plus scheduling and dashboards, but underneath it is the same idea.',
      code: `import json
import time

import redis
from jobs.emails import send_welcome_email       # renders a template, calls Amazon SES
from jobs.make_thumbnails import make_thumbnails  # resizes a photo with Pillow

r = redis.Redis(host="localhost", port=6379, decode_responses=True)
HANDLERS = {"send_welcome_email": send_welcome_email, "make_thumbnails": make_thumbnails}
MAX_ATTEMPTS = 5


def run_forever():
    print("Worker is waiting for jobs...")
    while True:
        _queue, raw = r.blpop(["jobs"])  # blocks until a job arrives
        job = json.loads(raw)
        try:
            HANDLERS[job["type"]](job)
            print("done:", job["type"])
        except Exception as err:
            job["attempts"] = job.get("attempts", 0) + 1
            if job["attempts"] >= MAX_ATTEMPTS:
                r.rpush("jobs:dead", json.dumps(job))  # give up; a human will take a look
                continue
            delay = 2 ** job["attempts"]  # 2s, 4s, 8s, 16s: "exponential backoff"
            print(f"retrying {job['type']} in {delay}s because: {err}")
            time.sleep(delay)  # simple version; real queues schedule retries instead
            r.rpush("jobs", json.dumps(job))


if __name__ == "__main__":
    run_forever()`,
    },
  ],

  playground: {
    title: 'Dashboard with a peek behind the scenes',
    description:
      'A tiny web app dashboard: add, tick off and delete projects while a "behind the scenes" panel shows the API requests, database writes and cache hits and misses each click would cause on a real server.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dashboard</title>
<style>
:root {
  --brand: {{brand}}; /* @tweak color "Brand color" */
  --accent: {{accent}}; /* @tweak color "Accent color" */
  --bg: #f4f5f9; /* @tweak color "Background" */
  --radius: 12px; /* @tweak range 0 24 "Corner radius" */
  --space: 12px; /* @tweak range 4 24 "Spacing" */
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: #1d1f2b; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.nav { display: flex; align-items: center; gap: 10px; padding: var(--space) 16px; background: var(--brand); color: #fff; }
.logo { width: 30px; height: 30px; display: grid; place-items: center; background: rgba(255,255,255,.25); border-radius: calc(var(--radius) / 2); }
.avatar { margin-left: auto; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: var(--accent); font-weight: 700; }
main { padding: 16px; }
h1 { margin: 0 0 var(--space); font-size: 20px; }
h2 { margin: 0; font-size: 15px; }
.row { display: flex; align-items: center; justify-content: space-between; margin: 18px 0 8px; }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space); }
.card { background: #fff; border-radius: var(--radius); padding: var(--space); box-shadow: 0 1px 3px rgba(0,0,0,.08); }
.stat b { display: block; font-size: 24px; color: var(--brand); }
.stat small { font-size: 12px; color: #6b6f80; }
form { display: flex; gap: 8px; }
input { flex: 1; min-width: 0; padding: 10px; font: inherit; border: 1px solid #d6d8e1; border-radius: var(--radius); }
button { padding: 10px 14px; font: inherit; font-weight: 600; color: #fff; background: var(--brand); border: 0; border-radius: var(--radius); cursor: pointer; }
.ghost { padding: 4px 10px; font-size: 13px; color: var(--brand); background: none; border: 1px solid var(--brand); }
ul { list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: var(--space); }
li { display: flex; align-items: center; gap: 10px; }
li input { flex: none; width: 18px; height: 18px; accent-color: var(--brand); }
li.done span { text-decoration: line-through; color: #9a9db0; }
li .del { margin-left: auto; padding: 2px 8px; color: #9a9db0; background: none; }
.log { min-height: 96px; font: 12px/1.5 ui-monospace, Menlo, monospace; color: #c9d1e0; background: #14161f; }
.log div { margin-bottom: 6px; padding-left: 8px; border-left: 3px solid var(--accent); }
.log .hit { color: #5ee7a0; }
.log .miss { color: #ffc861; }
.hint { font-size: 12px; color: #6b6f80; }
</style>
</head>
<body>
<header class="nav">
  <span class="logo">⚡</span>
  <b data-edit="product">{{name}}</b>
  <span class="avatar">S</span>
</header>
<main>
  <h1 data-edit="greeting">Welcome back, Sam</h1>
  <div class="stats">
    <div class="card stat"><b id="total">0</b><small>Total</small></div>
    <div class="card stat"><b id="active">0</b><small>Active</small></div>
    <div class="card stat"><b id="done">0</b><small>Done</small></div>
  </div>

  <div class="row"><h2 data-edit="list-title">Your projects</h2></div>
  <form id="add">
    <input id="title" placeholder="New project name" autocomplete="off">
    <button>Add</button>
  </form>
  <ul id="list"></ul>

  <div class="row">
    <h2 data-edit="log-title">Behind the scenes</h2>
    <button class="ghost" id="reload">↻ Reload</button>
  </div>
  <div class="card log" id="log"></div>
  <p class="hint" data-edit="hint">Each click becomes a request to the API, which talks to the database and the cache.</p>
</main>

<script>
// Pretend database table. On a real site these rows live in PostgreSQL.
const db = [
  { id: 1, title: 'Portfolio website', done: true },
  { id: 2, title: 'Study group planner', done: false },
  { id: 3, title: 'Budget tracker', done: false }
];
let nextId = 4;
let cache = null; // pretend Redis: remembers the last dashboard response
const $ = (id) => document.getElementById(id);
const find = (id) => db.find((p) => p.id === id);

// Add a line to the "Behind the scenes" panel (newest on top)
function log(text, cls) {
  const line = document.createElement('div');
  line.textContent = text;
  if (cls) line.className = cls;
  $('log').prepend(line);
  while ($('log').children.length > 6) $('log').lastChild.remove();
}

// GET /api/dashboard: try the cache first, fall back to the database
function loadDashboard() {
  if (cache) {
    log('GET /api/dashboard → cache HIT → 200 OK in 2ms', 'hit');
  } else {
    cache = db.map((p) => Object.assign({}, p)); // a copy, like a query result
    log('GET /api/dashboard → cache MISS → SELECT … FROM projects → 200 OK in 45ms', 'miss');
  }
  render(cache);
}

// Draw the stats and the list from the rows the "server" sent back
function render(rows) {
  const done = rows.filter((p) => p.done).length;
  $('total').textContent = rows.length;
  $('done').textContent = done;
  $('active').textContent = rows.length - done;
  $('list').innerHTML = '';
  rows.forEach((p) => {
    const li = document.createElement('li');
    li.className = 'card' + (p.done ? ' done' : '');
    li.innerHTML = '<input type="checkbox"><span></span><button class="del" aria-label="Delete">✕</button>';
    li.querySelector('span').textContent = p.title;
    li.querySelector('input').checked = p.done;
    li.querySelector('input').onchange = () =>
      write('PATCH /api/projects/' + p.id + ' → UPDATE projects → 200 OK', () => { find(p.id).done = !p.done; });
    li.querySelector('.del').onclick = () =>
      write('DELETE /api/projects/' + p.id + ' → DELETE FROM projects → 204', () => { db.splice(db.indexOf(find(p.id)), 1); });
    $('list').appendChild(li);
  });
}

// Every change: update the database, then clear the cache so nobody sees stale data
function write(request, change) {
  change();
  cache = null;
  log(request + ' · cache cleared');
  loadDashboard();
}

$('add').onsubmit = (e) => {
  e.preventDefault(); // stop the browser from reloading the whole page
  const title = $('title').value.trim();
  if (!title) return log('POST /api/projects → 400 Bad Request (title is required)');
  $('title').value = '';
  write('POST /api/projects → INSERT INTO projects → 201 Created', () => {
    db.push({ id: nextId++, title: title, done: false });
  });
};
$('reload').onclick = loadDashboard;

loadDashboard();
</script>
</body>
</html>`,
    challenges: [
      'Change the "Brand color" and "Corner radius" tweaks and watch the top bar, stat numbers, buttons and cards restyle together.',
      'Press Reload twice. The first load after a change is a cache MISS and the next is a HIT. Find the line of code that clears the cache.',
      'Delete the line cache = null; inside write(), then add a project. Why does the list stop updating? That bug is called "stale cache".',
      'Add server-side validation: if a project name is longer than 40 characters, log a 400 error instead of inserting it.',
    ],
  },

  concepts: [
    {
      term: 'Three-tier architecture',
      meaning:
        'Splitting an app into presentation (the browser), logic (the web server) and data (the database), so each part can be built, scaled and fixed on its own.',
    },
    {
      term: 'HTTP request & response',
      meaning:
        'Every time the page needs the server, it sends a request (a method like GET or POST, a URL and maybe some data) and gets back a response with a status code such as 200 OK or 404 Not Found.',
    },
    {
      term: 'REST API',
      meaning:
        'A popular style for designing a server\'s URLs around things (like /projects/42) and standard actions on them: GET to read, POST to create, PATCH to update and DELETE to remove.',
    },
    {
      term: 'Relational database & SQL',
      meaning:
        'A database that stores data in tables linked by IDs, and a language (SQL) for asking questions like "count this user\'s projects by status".',
    },
    {
      term: 'Caching',
      meaning:
        'Keeping a copy of a result somewhere fast so the next request can skip the slow work. The tricky part is clearing that copy whenever the real data changes.',
    },
    {
      term: 'Sessions & cookies',
      meaning:
        'After you log in, the server gives your browser a random ID in a cookie. The browser sends it with every request, which is how the server remembers who you are.',
    },
    {
      term: 'Password hashing',
      meaning:
        "Turning a password into a scrambled value that can't be turned back. At login the server hashes what you typed and compares, so a stolen database doesn't reveal anyone's password.",
    },
    {
      term: 'Background jobs',
      meaning:
        'Slow tasks, like sending email or resizing photos, are put on a queue and done by separate worker programs, so the website can respond to you immediately.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Sketch your screens and tables',
      detail:
        'On paper, draw each page and list the data it shows. Every noun that repeats, like users or projects, usually becomes a database table.',
    },
    {
      step: 'Build the front end',
      detail:
        'Create the pages with HTML, CSS and JavaScript, or React with Vite. Start with fake data in an array, just like the playground does.',
    },
    {
      step: 'Write a small API',
      detail:
        'Use Node.js + Express or Python + FastAPI to add GET, POST, PATCH and DELETE endpoints for one kind of thing, and test them with curl or your browser\'s dev tools.',
    },
    {
      step: 'Store data in a real database',
      detail:
        'Connect PostgreSQL (free tiers on Supabase or Neon) or SQLite, write your tables as migration files, and always use parameterized queries.',
    },
    {
      step: 'Add sign-up and login',
      detail:
        'Hash passwords with bcrypt and keep users logged in with a session cookie, or save time with a hosted option like Supabase Auth or Clerk.',
    },
    {
      step: 'Deploy it and add a background job',
      detail:
        'Put the front end on Vercel or Netlify and the API on Render or Railway, then send a welcome email from a background job using Resend or Postmark.',
    },
  ],
};
