import type { ArchetypeTemplate } from './types';

/**
 * Built-in safety net: a classic web app template that guarantees the instant engine can
 * tear down ANY site, even before specialised archetypes (src/lib/offline/archetypes) exist.
 */
export const fallbackArchetype: ArchetypeTemplate = {
  id: 'webapp',
  label: 'Web app',
  keywords: ['dashboard', 'sign in', 'log in', 'account', 'platform', 'get started', 'pricing'],
  tagline: '{{name}} is a website and web app you use in your browser.',
  eli5:
    'When you open {{name}}, your browser downloads the page from servers close to you, then talks to {{name}}’s API whenever you click something. The API checks who you are, reads or saves data in a database, and hands slow chores like sending emails to background workers so the page stays fast.',
  languages: [
    { name: 'TypeScript', usedFor: 'Front-end components and the API server', share: 35 },
    { name: 'HTML/CSS', usedFor: 'Page structure and styling', share: 20 },
    { name: 'SQL', usedFor: 'Reading and writing data in the database', share: 20 },
    { name: 'Python', usedFor: 'Background jobs and data scripts', share: 15 },
    { name: 'YAML/Shell', usedFor: 'Deployment and CI configuration', share: 10 },
  ],
  stack: [
    {
      layer: 'Frontend',
      items: [
        { name: 'HTML, CSS & JavaScript', role: 'What the browser runs', beginnerNote: 'Every website is built from these three: structure, style and behaviour.' },
        { name: 'Component framework', role: 'Reusable UI building blocks', beginnerNote: 'Tools like React let developers build a page from small Lego-like pieces.' },
      ],
    },
    {
      layer: 'Backend',
      items: [
        { name: 'Node.js API server', role: 'Handles requests from the app', beginnerNote: 'A program that listens for requests like “log me in” and sends back answers as JSON.' },
        { name: 'Sessions & tokens', role: 'Knows who you are', beginnerNote: 'After you log in, a small signed token proves it is you on every later request.' },
      ],
    },
    {
      layer: 'Data',
      items: [
        { name: 'PostgreSQL', role: 'Main database', beginnerNote: 'A super-organised set of spreadsheets that many users can safely edit at once.' },
        { name: 'Redis', role: 'Cache & job queue', beginnerNote: 'Keeps hot data in memory, like sticky notes on your desk instead of files in a cabinet.' },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        { name: 'CDN & load balancer', role: 'Fast, spread-out delivery', beginnerNote: 'Copies of the site live around the world, and traffic is shared across many servers.' },
        { name: 'Object storage (S3-style)', role: 'Images & file uploads', beginnerNote: 'A giant online hard drive where each file gets its own web address.' },
        { name: 'Docker containers', role: 'Packaging the server', beginnerNote: 'Bundles the app with everything it needs so it runs the same everywhere.' },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        { name: 'CI/CD pipeline', role: 'Automatic tests & deploys', beginnerNote: 'Every code change is tested by robots and shipped if it passes.' },
        { name: 'Logs & error tracking', role: 'Spotting problems', beginnerNote: 'Like a black-box recorder that tells engineers what broke and where.' },
      ],
    },
  ],
  architecture: {
    nodes: [
      { id: 'web', label: 'Web app', kind: 'client', tier: 0, tech: '{{frontend}} in your browser', description: 'The pages you see. Your browser downloads them, runs the JavaScript, and calls the API when you click things.' },
      { id: 'mobile', label: 'Mobile app', kind: 'client', tier: 0, tech: 'iOS & Android apps', description: 'Many products also ship phone apps that talk to the very same API as the website.' },
      { id: 'dns', label: 'DNS', kind: 'edge', tier: 1, tech: 'Domain name system', description: 'The internet’s phone book: it turns {{domain}} into the IP address of a real server.' },
      { id: 'cdn', label: 'CDN', kind: 'edge', tier: 1, tech: '{{hosting}}', description: 'Servers spread around the world keep copies of images, scripts and styles so pages load fast wherever you are.' },
      { id: 'lb', label: 'Load balancer', kind: 'edge', tier: 1, tech: 'Reverse proxy (nginx / cloud LB)', description: 'Receives every API request and passes it to whichever server has capacity, so no single machine is overwhelmed.' },
      { id: 'api', label: 'API server', kind: 'gateway', tier: 2, tech: 'Node.js / Python web framework', description: 'The front door for data. It checks each request, runs the right code, and replies with JSON.' },
      { id: 'auth', label: 'Auth service', kind: 'service', tier: 2, tech: 'Sessions, JWTs, OAuth', description: 'Handles sign-up, login and “Sign in with Google”, and verifies who is making each request.' },
      { id: 'app', label: 'App logic', kind: 'service', tier: 3, tech: 'Business logic modules', description: 'The rules of the product: what happens when you create, update or delete something.' },
      { id: 'queue', label: 'Job queue', kind: 'queue', tier: 3, tech: 'Redis / SQS', description: 'A to-do list for slow tasks. The API adds a job and replies to you right away instead of making you wait.' },
      { id: 'worker', label: 'Workers', kind: 'service', tier: 3, tech: 'Background job runners', description: 'Separate programs that pick jobs off the queue: sending emails, resizing images, generating reports.' },
      { id: 'email', label: 'Email service', kind: 'external', tier: 3, tech: 'Transactional email API', description: 'A third-party service that actually delivers emails like “Confirm your account” to your inbox.' },
      { id: 'db', label: 'Database', kind: 'database', tier: 4, tech: 'PostgreSQL', description: 'Stores users, content and settings in tables, and guarantees saved data is not lost.' },
      { id: 'cache', label: 'Cache', kind: 'cache', tier: 4, tech: 'Redis', description: 'Remembers recent answers in memory so popular pages don’t hit the database every time.' },
      { id: 'storage', label: 'File storage', kind: 'storage', tier: 4, tech: 'S3-style object storage', description: 'Holds uploaded images and files; the CDN serves them to users.' },
    ],
    edges: [
      { from: 'web', to: 'dns', label: 'DNS lookup' },
      { from: 'web', to: 'cdn', label: 'HTTPS' },
      { from: 'mobile', to: 'lb', label: 'HTTPS / JSON' },
      { from: 'cdn', to: 'lb', label: 'API requests' },
      { from: 'cdn', to: 'storage', label: 'fetch files' },
      { from: 'lb', to: 'api', label: 'HTTP' },
      { from: 'api', to: 'auth', label: 'verify session' },
      { from: 'auth', to: 'db', label: 'SQL' },
      { from: 'api', to: 'app', label: 'function call' },
      { from: 'app', to: 'cache', label: 'GET / SET' },
      { from: 'app', to: 'db', label: 'SQL' },
      { from: 'app', to: 'storage', label: 'upload' },
      { from: 'app', to: 'queue', label: 'enqueue job' },
      { from: 'queue', to: 'worker', label: 'dequeue' },
      { from: 'worker', to: 'db', label: 'SQL' },
      { from: 'worker', to: 'email', label: 'API call' },
    ],
    flows: [
      {
        id: 'open',
        title: 'You open {{name}}',
        emoji: '🌐',
        steps: [
          { from: 'web', to: 'dns', narration: 'Your browser asks DNS where {{domain}} lives and gets back an IP address.' },
          { from: 'web', to: 'cdn', narration: 'It downloads the HTML, JavaScript and CSS from the nearest CDN server, so the page appears quickly.' },
          { from: 'cdn', to: 'lb', narration: 'The page’s JavaScript asks for your data. That request passes through the CDN to the load balancer.' },
          { from: 'lb', to: 'api', narration: 'The load balancer picks an API server that isn’t busy and forwards the request.' },
          { from: 'api', to: 'app', narration: 'The API hands the request to the app logic that knows how to build your home screen.' },
          { from: 'app', to: 'cache', narration: 'It checks the cache first: if the answer was computed recently, it is returned in about a millisecond.' },
          { from: 'app', to: 'db', narration: 'On a cache miss it queries the database, then the JSON travels all the way back to render on your screen.' },
        ],
      },
      {
        id: 'login',
        title: 'You log in',
        emoji: '🔑',
        steps: [
          { from: 'web', to: 'cdn', narration: 'You type your email and password and press Log in. The browser sends them over encrypted HTTPS.' },
          { from: 'cdn', to: 'lb', narration: 'The request is passed along to the load balancer.' },
          { from: 'lb', to: 'api', narration: 'An API server receives the login request.' },
          { from: 'api', to: 'auth', narration: 'The auth service takes over. Passwords are never stored in plain text, only as a salted hash.' },
          { from: 'auth', to: 'db', narration: 'It looks up your user row, compares hashes, and creates a session. Your browser gets a cookie that proves it’s you next time.' },
        ],
      },
      {
        id: 'signup',
        title: 'You sign up and get a welcome email',
        emoji: '✉️',
        steps: [
          { from: 'mobile', to: 'lb', narration: 'You fill in the sign-up form in the app and tap Create account.' },
          { from: 'lb', to: 'api', narration: 'The load balancer routes the request to an API server.' },
          { from: 'api', to: 'app', narration: 'The app logic validates your details, for example checking the email isn’t already taken.' },
          { from: 'app', to: 'db', narration: 'A new row is inserted into the users table inside a transaction, so it’s all-or-nothing.' },
          { from: 'app', to: 'queue', narration: 'Instead of sending the email right now, it drops a “send welcome email” job on the queue and replies to you instantly.' },
          { from: 'queue', to: 'worker', narration: 'A background worker picks up the job a moment later.' },
          { from: 'worker', to: 'email', narration: 'The worker calls the email service, which delivers “Welcome to {{name}}!” to your inbox.' },
        ],
      },
    ],
  },
  files: [
    { path: 'web/src/App.tsx', note: 'Root of the user interface' },
    { path: 'web/src/api/client.ts', note: 'Small wrapper around fetch() for calling the API' },
    { path: 'server/src/index.ts', note: 'Starts the HTTP server and registers routes' },
    { path: 'server/src/routes/auth.ts', note: 'Sign-up, login and logout endpoints' },
    { path: 'server/src/routes/items.ts', note: 'Create, read, update and delete endpoints for the main data' },
    { path: 'server/src/middleware/requireSession.ts', note: 'Rejects requests that aren’t logged in' },
    { path: 'server/src/services/signup.ts', note: 'Business rules for creating an account' },
    { path: 'server/src/cache/redis.ts', note: 'Shared Redis connection and cache helpers' },
    { path: 'server/src/db/schema.sql', note: 'Tables, keys and indexes' },
    { path: 'server/src/db/migrations/001_init.sql', note: 'Versioned database changes' },
    { path: 'worker/jobs.py', note: 'Background jobs such as welcome emails' },
    { path: 'infra/Dockerfile', note: 'How the server is packaged into a container' },
    { path: '.github/workflows/deploy.yml', note: 'Runs tests and deploys on every push' },
    { path: 'README.md', note: 'How to run the project locally' },
  ],
  code: [
    {
      id: 'api-route',
      title: 'An API endpoint with caching',
      file: 'server/src/routes/items.ts',
      language: 'TypeScript',
      explanation:
        'This Express route returns one item as JSON. It checks Redis first and only queries PostgreSQL on a cache miss, then saves the result for 60 seconds. That one pattern is how many sites stay fast under heavy traffic.',
      code: `import { Router } from 'express';
import { db } from '../db/pool';
import { redis } from '../cache/redis';
import { requireSession } from '../middleware/requireSession';

export const items = Router();

items.get('/items/:id', requireSession, async (req, res) => {
  const key = \`item:\${req.params.id}\`;

  // 1. Try the cache first
  const cached = await redis.get(key);
  if (cached) return res.json(JSON.parse(cached));

  // 2. Fall back to the database
  const { rows } = await db.query(
    'SELECT id, title, body, created_at FROM items WHERE id = $1 AND owner_id = $2',
    [req.params.id, req.session.userId],
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });

  // 3. Remember the answer for 60 seconds
  await redis.set(key, JSON.stringify(rows[0]), 'EX', 60);
  res.json(rows[0]);
});`,
    },
    {
      id: 'schema',
      title: 'The database schema',
      file: 'server/src/db/schema.sql',
      language: 'SQL',
      explanation:
        'Tables describe the data: users, their login sessions, and the things they create. Foreign keys link rows together, and indexes act like a book’s index so lookups stay fast as tables grow to millions of rows.',
      code: `CREATE TABLE users (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,          -- never store plain passwords
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
  token      TEXT PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE items (
  id         BIGSERIAL PRIMARY KEY,
  owner_id   BIGINT NOT NULL REFERENCES users(id),
  title      TEXT NOT NULL,
  body       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Speeds up "show me my newest items"
CREATE INDEX items_owner_created_idx ON items (owner_id, created_at DESC);`,
    },
    {
      id: 'worker',
      title: 'A background worker',
      file: 'worker/jobs.py',
      language: 'Python',
      explanation:
        'The API pushes jobs onto a Redis list and replies immediately. This worker waits for jobs with BLPOP, sends the email, and retries later if the email service is down, so a slow third party never slows down the website.',
      code: `import json
import time

import redis
import requests

queue = redis.Redis(host="redis", port=6379)

def send_welcome_email(job):
    response = requests.post(
        "https://email-provider.example/v1/send",
        json={"to": job["email"], "template": "welcome"},
        timeout=10,
    )
    response.raise_for_status()

while True:
    # Block until a job arrives, then pop it off the list
    _, raw = queue.blpop("jobs:welcome_email")
    job = json.loads(raw)
    try:
        send_welcome_email(job)
        print(f"sent welcome email to {job['email']}")
    except requests.RequestException:
        job["attempts"] = job.get("attempts", 0) + 1
        if job["attempts"] < 5:
            time.sleep(2 ** job["attempts"])  # back off, then retry
            queue.rpush("jobs:welcome_email", json.dumps(job))`,
    },
  ],
  playground: {
    title: 'A landing page',
    description: 'A mini landing page like the front door of {{name}}: a headline, a sign-up form that responds, and feature cards you can open.',
    html: `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
:root {
  --brand: {{brand}}; /* @tweak color "Brand color" */
  --accent: {{accent}}; /* @tweak color "Accent color" */
  --bg: #0F1117; /* @tweak color "Background" */
  --radius: 14px; /* @tweak range 0 28 "Corner radius" */
  --space: 18px; /* @tweak range 8 32 "Spacing" */
}
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; background: var(--bg); color: #F4F6FB; }
header { display: flex; align-items: center; justify-content: space-between; padding: var(--space); }
.logo { font-weight: 800; font-size: 20px; color: var(--brand); }
.menu { font-size: 13px; opacity: .7; }
.hero { padding: var(--space); padding-top: 12px; }
.badge { display: inline-block; font-size: 12px; padding: 4px 10px; border-radius: 999px; background: color-mix(in srgb, var(--accent) 25%, transparent); color: var(--accent); }
h1 { font-size: 30px; line-height: 1.1; margin: 12px 0 8px; }
.sub { opacity: .75; line-height: 1.5; margin: 0 0 var(--space); }
form { display: flex; gap: 8px; }
input { flex: 1; min-width: 0; padding: 12px; border-radius: var(--radius); border: 1px solid #2A2F3C; background: #171A23; color: inherit; }
button { padding: 12px 16px; border: 0; border-radius: var(--radius); background: var(--brand); color: white; font-weight: 700; }
.toast { margin-top: 10px; font-size: 14px; color: var(--accent); min-height: 20px; }
.cards { display: grid; gap: 10px; padding: var(--space); }
.card { background: #171A23; border: 1px solid #2A2F3C; border-radius: var(--radius); padding: 14px; cursor: pointer; }
.card h3 { margin: 0; font-size: 16px; display: flex; justify-content: space-between; }
.card p { margin: 8px 0 0; font-size: 14px; opacity: .75; display: none; }
.card.open { border-color: var(--brand); }
.card.open p { display: block; }
.count { text-align: center; font-size: 13px; opacity: .6; padding-bottom: var(--space); }
</style>
</head>
<body>
<header>
  <div class="logo" data-edit="logo">{{name}}</div>
  <div class="menu">Log in</div>
</header>

<section class="hero">
  <span class="badge" data-edit="badge">New</span>
  <h1 data-edit="headline">Do your best work, faster.</h1>
  <p class="sub" data-edit="subhead">Everything you need in one place. Free to start.</p>
  <form id="signup">
    <input id="email" type="email" placeholder="you@example.com">
    <button type="submit" data-edit="cta">Get started</button>
  </form>
  <div class="toast" id="toast"></div>
</section>

<section class="cards">
  <div class="card"><h3>Fast <span>+</span></h3><p>Pages are served from a CDN near you.</p></div>
  <div class="card"><h3>Secure <span>+</span></h3><p>Passwords are hashed and traffic is encrypted.</p></div>
  <div class="card"><h3>Reliable <span>+</span></h3><p>Background workers retry jobs that fail.</p></div>
</section>
<div class="count" id="count">0 people signed up today</div>

<script>
  // Tap a card to open or close it
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.toggle('open');
      card.querySelector('span').textContent = card.classList.contains('open') ? '–' : '+';
    });
  });

  // Pretend to call the API when the form is submitted
  var signups = 0;
  document.getElementById('signup').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('email').value.trim();
    var toast = document.getElementById('toast');
    if (!email.includes('@')) { toast.textContent = 'Please enter a valid email.'; return; }
    toast.textContent = 'Sending…';
    setTimeout(function () {
      signups += 1;
      toast.textContent = 'You’re on the list! Check your inbox.';
      document.getElementById('count').textContent = signups + (signups === 1 ? ' person' : ' people') + ' signed up today';
      document.getElementById('email').value = '';
    }, 700);
  });
</script>
</body>
</html>`,
    challenges: [
      'Change --brand to #22C55E and watch the logo and button turn green.',
      'Tap “Edit text on the screen” and rewrite the headline, then find the changed line in the Code tab.',
      'Set --radius to 0px for sharp corners, then 28px for pill shapes.',
      'In the Code tab, add a fourth feature card called “Accessible”.',
    ],
  },
  concepts: [
    { term: 'Client–server model', meaning: 'Your browser (the client) asks for things and servers answer; almost every app works this way.' },
    { term: 'DNS', meaning: 'The system that translates a name like example.com into the numeric address of a server.' },
    { term: 'CDN', meaning: 'A network of servers worldwide that store copies of files close to users to make sites load faster.' },
    { term: 'REST API', meaning: 'A set of URLs (like GET /items/42) that apps call to read and change data, usually returning JSON.' },
    { term: 'Relational database', meaning: 'Data stored in tables with rows and columns, linked by keys and queried with SQL.' },
    { term: 'Caching', meaning: 'Saving the result of slow work so the next request can reuse it instantly.' },
    { term: 'Background jobs', meaning: 'Slow tasks moved off the main request path and handled later by workers.' },
    { term: 'Password hashing', meaning: 'Storing a scrambled, one-way version of a password so a stolen database doesn’t reveal it.' },
  ],
  buildYourOwn: [
    { step: 'Build the page', detail: 'Make a landing page with HTML and CSS, then turn it into React components with Vite.' },
    { step: 'Add an API', detail: 'Create an Express (Node.js) or FastAPI (Python) server with one GET and one POST endpoint.' },
    { step: 'Save real data', detail: 'Connect a free PostgreSQL database (e.g. Supabase or Neon) and store sign-ups in a table.' },
    { step: 'Add login', detail: 'Use a hosted auth provider or sessions with bcrypt-hashed passwords.' },
    { step: 'Run jobs in the background', detail: 'Send a welcome email from a worker using a queue instead of inside the request.' },
    { step: 'Deploy it', detail: 'Put the front end on Vercel or Netlify and the API on Render or Fly.io, then share the link.' },
  ],
};
