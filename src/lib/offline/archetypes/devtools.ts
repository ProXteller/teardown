import type { ArchetypeTemplate } from '../types';

export const archetype: ArchetypeTemplate = {
  id: 'devtools',
  label: 'Developer platform',
  keywords: [
    'developer',
    'developers',
    'developer platform',
    'developer tools',
    'devtools',
    'git',
    'repository',
    'repositories',
    'source code',
    'version control',
    'pull request',
    'pull requests',
    'merge request',
    'code review',
    'open source',
    'ci/cd',
    'continuous integration',
    'continuous deployment',
    'pipelines',
    'devops',
    'deploy',
    'deployments',
    'preview deployments',
    'serverless',
    'edge functions',
    'sdk',
    'cli',
    'api reference',
    'programming',
    'programmers',
    'debugging',
    'error monitoring',
    'observability',
    'package registry',
    'docker',
    'kubernetes',
    'infrastructure as code',
    'self-hosted',
  ],
  tagline: '{{name}} is a developer platform where people store code, review changes, and automatically test and ship their software.',
  eli5:
    "{{name}} is like a shared garage for code. Developers upload (push) their work with a tool called Git, and {{name}} keeps every version so a team can review changes before accepting them. Each push can also wake up robot computers that build and test the project automatically, and if everything passes, publish it to the internet for real users.",

  languages: [
    { name: 'TypeScript / JavaScript', usedFor: 'The web interface, CLI tools and serverless runtimes', share: 25 },
    { name: 'Go', usedFor: 'Git servers, build runners, webhooks and other high-traffic services', share: 25 },
    { name: 'Ruby', usedFor: 'The main web app and API in many long-running platforms (Ruby on Rails)', share: 15 },
    { name: 'YAML & Bash', usedFor: 'Pipeline config files and the build scripts that runners execute', share: 15 },
    { name: 'C', usedFor: 'Git itself and low-level repository libraries like libgit2', share: 10 },
    { name: 'SQL', usedFor: 'Users, repositories, issues, pull requests and pipeline records', share: 10 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'Monaco / CodeMirror',
          role: 'In-browser code viewer & editor',
          beginnerNote:
            'The same kind of editor that powers VS Code can run inside a web page, with syntax colors, line numbers, search and quick edits.',
        },
        {
          name: 'Tree-sitter',
          role: 'Understanding code structure',
          beginnerNote:
            'Tree-sitter reads code the way a compiler does, so the site can color keywords correctly and let you jump to where a function is defined.',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Ruby on Rails',
          role: 'Main web app & API',
          beginnerNote:
            'A framework that makes common web features (pages, forms, database models) quick to build. Several of the largest code-hosting sites started as Rails apps.',
        },
        {
          name: 'Go',
          role: 'Git servers, runners & fast services',
          beginnerNote:
            'Go compiles to a single fast program and makes it easy to handle thousands of connections at once, which suits Git traffic and job runners.',
        },
        {
          name: 'Git & libgit2',
          role: 'Storing and comparing code',
          beginnerNote:
            'Git saves every version of every file as compressed "objects" named by a fingerprint (hash) of their content, so identical files are stored only once.',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'PostgreSQL / MySQL',
          role: 'Users, repos, issues & pipelines',
          beginnerNote:
            'A relational database holds everything that is not code itself: who owns which repository, every issue and comment, and the result of each build.',
        },
        {
          name: 'Redis',
          role: 'Caching & job queues',
          beginnerNote:
            'An in-memory store used to cache busy pages and to hold lists of background jobs waiting to be picked up.',
        },
        {
          name: 'Amazon S3',
          role: 'Build logs, artifacts & caches',
          beginnerNote:
            'Object storage for the huge number of files builds produce. It is cheap, durable and can serve files straight to a CDN.',
        },
        {
          name: 'Elasticsearch',
          role: 'Code & issue search',
          beginnerNote:
            'A search engine that pre-indexes text, so you can search millions of files or issues for a word and get results in about a second.',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Firecracker microVMs & containers',
          role: 'Isolated build machines',
          beginnerNote:
            "Each build runs inside a fresh, throwaway mini computer, so one customer's code can never peek at another's and every build starts clean.",
        },
        {
          name: 'Kubernetes',
          role: 'Runs services & runner fleets',
          beginnerNote:
            'Kubernetes starts more runner machines when many builds are waiting and shuts them down when things are quiet, which saves money.',
        },
        {
          name: 'Apache Kafka',
          role: 'Event stream',
          beginnerNote:
            'A durable log of events like "code pushed" or "pull request opened" that many services (CI, webhooks, search) read independently.',
        },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        {
          name: 'Docker',
          role: 'Reproducible build environments',
          beginnerNote:
            'A Docker image freezes an exact set of tools (like Node 22 and Python 3.12), so a build behaves the same today, tomorrow and on any machine.',
        },
        {
          name: 'Terraform',
          role: 'Infrastructure as code',
          beginnerNote:
            'Servers, databases and networks are described in text files and created automatically, so the whole setup can be reviewed and rebuilt like code.',
        },
        {
          name: 'Prometheus & Grafana',
          role: 'Metrics & dashboards',
          beginnerNote:
            'Every service reports numbers like "builds waiting" or "push latency", and dashboards and alerts warn engineers when something looks wrong.',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Code-completion language models',
          role: 'AI coding assistants',
          beginnerNote:
            'Models trained on lots of code suggest the next lines as you type, explain errors or draft a pull request description.',
        },
        {
          name: 'Code embeddings',
          role: 'Search code by meaning',
          beginnerNote:
            'Functions are turned into lists of numbers that capture what they do, so searching "retry failed payment" can find code that never uses those exact words.',
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
        tech: 'Built with {{frontend}}',
        description:
          'The {{name}} website: browsing code, reviewing pull requests, reading build logs and changing settings, with syntax-highlighted code views.',
      },
      {
        id: 'cli',
        label: 'Git & CLI',
        kind: 'client',
        tier: 0,
        tech: 'git · command-line tools · API clients',
        description:
          'Developers mostly talk to {{name}} from a terminal: git push and git pull move code, while CLI tools and scripts call the public API.',
      },
      {
        id: 'cdn',
        label: 'CDN & Edge Network',
        kind: 'edge',
        tier: 1,
        tech: '{{hosting}}',
        description:
          "Delivers the site's own JavaScript and images from nearby servers. For deploy platforms it also serves customers' published websites close to every visitor.",
      },
      {
        id: 'lb',
        label: 'Load Balancer',
        kind: 'edge',
        tier: 1,
        tech: 'HAProxy / cloud load balancer',
        description:
          'The front door for web, API and Git traffic. It spreads requests across many servers and forwards SSH connections from git push to the Git servers.',
      },
      {
        id: 'api',
        label: 'Web & API Server',
        kind: 'gateway',
        tier: 2,
        tech: 'Ruby on Rails or Go · REST & GraphQL',
        description:
          'Runs the website and public API: repositories, issues, pull requests, comments and settings. It checks your login or access token on every request.',
      },
      {
        id: 'git',
        label: 'Git Server',
        kind: 'gateway',
        tier: 2,
        tech: 'Git over SSH & HTTPS (Go)',
        description:
          'Speaks the Git protocol. On a push it checks your SSH key or token, receives only the new commits and saves them to repository storage.',
      },
      {
        id: 'queue',
        label: 'Event & Job Queue',
        kind: 'queue',
        tier: 3,
        tech: 'Apache Kafka · Redis-backed job queue',
        description:
          'Every push, pull request or comment becomes an event here. Slow work like builds, webhooks and indexing happens in the background, so git push stays fast.',
      },
      {
        id: 'runner',
        label: 'Build Runners',
        kind: 'service',
        tier: 3,
        tech: 'Throwaway VMs & containers (Docker, Firecracker)',
        description:
          'A fleet of machines that run pipelines: clone the code, install dependencies, run tests and build. Every job gets a fresh, isolated machine.',
      },
      {
        id: 'deploy',
        label: 'Deploy Service',
        kind: 'service',
        tier: 3,
        tech: 'Go · immutable deployments',
        description:
          'Turns a successful build into a live version with its own URL, then points your domain at it in one step. Rolling back just means pointing at an older version.',
      },
      {
        id: 'webhooks',
        label: 'Webhook Service',
        kind: 'service',
        tier: 3,
        tech: 'Go workers · HMAC-signed HTTP',
        description:
          'Tells outside systems what happened, like "a pull request was opened", by sending signed HTTP requests to URLs you registered, and retries if they are down.',
      },
      {
        id: 'db',
        label: 'Main Database',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL / MySQL',
        description:
          'Stores everything except the code itself: users, organizations, permissions, issues, pull requests, comments and the status of every pipeline and job.',
      },
      {
        id: 'gitstore',
        label: 'Repository Storage',
        kind: 'storage',
        tier: 4,
        tech: 'Replicated file servers (Git objects)',
        description:
          "Where the actual Git data lives. Each repository is copied to several servers, so a failed disk never loses anyone's code.",
      },
      {
        id: 'artifacts',
        label: 'Artifact Storage',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3',
        description:
          'Holds everything builds produce: log files, dependency caches, test reports, packages and the files of deployed websites.',
      },
      {
        id: 'search',
        label: 'Search Index',
        kind: 'database',
        tier: 4,
        tech: 'Elasticsearch / custom code index',
        description:
          'A pre-built index of code, issues and discussions, so searching millions of files returns results in about a second. Background jobs refresh it after pushes.',
      },
    ],
    edges: [
      { from: 'web', to: 'cdn', label: 'Static files & deployed sites' },
      { from: 'web', to: 'lb', label: 'HTTPS' },
      { from: 'cli', to: 'lb', label: 'git over SSH / HTTPS' },
      { from: 'cdn', to: 'artifacts', label: 'Fetch files on cache miss' },
      { from: 'lb', to: 'api', label: 'REST / GraphQL' },
      { from: 'lb', to: 'git', label: 'Git protocol' },
      { from: 'git', to: 'gitstore', label: 'Read & write objects' },
      { from: 'git', to: 'db', label: 'Check push access' },
      { from: 'git', to: 'queue', label: 'Push events' },
      { from: 'api', to: 'db', label: 'Repos, issues, pull requests' },
      { from: 'api', to: 'search', label: 'Search code & issues' },
      { from: 'api', to: 'git', label: 'Diffs & merge checks' },
      { from: 'api', to: 'queue', label: 'Pull request events' },
      { from: 'queue', to: 'webhooks', label: 'Fan out events' },
      { from: 'queue', to: 'runner', label: 'CI jobs' },
      { from: 'runner', to: 'git', label: 'Clone the commit' },
      { from: 'runner', to: 'artifacts', label: 'Logs, caches & build output' },
      { from: 'runner', to: 'api', label: 'Report check status' },
      { from: 'runner', to: 'deploy', label: 'Build ready to ship' },
      { from: 'deploy', to: 'cdn', label: 'Switch traffic to new version' },
    ],
    flows: [
      {
        id: 'push-ci',
        title: 'You push code and the tests run',
        emoji: '🚀',
        steps: [
          {
            from: 'cli',
            to: 'lb',
            narration:
              'You run git push. Your computer opens an encrypted SSH (or HTTPS) connection, and the load balancer forwards it to a Git server.',
          },
          {
            from: 'lb',
            to: 'git',
            narration: 'The Git server checks your SSH key or access token to find out who you are.',
          },
          {
            from: 'git',
            to: 'db',
            narration:
              'It looks up whether you have write access to this repository and whether the branch has protection rules, such as "changes to main need a review".',
          },
          {
            from: 'git',
            to: 'gitstore',
            narration:
              'Git works out which objects are new, receives only those, and saves them to several storage servers before moving the branch to point at your latest commit.',
          },
          {
            from: 'git',
            to: 'queue',
            narration:
              'A "push" event (repository, branch, commit ID) goes onto the queue. Your terminal reports success right away; everything else happens in the background.',
          },
          {
            from: 'queue',
            to: 'runner',
            narration:
              'The pipeline file in your repo (usually YAML) says which jobs to run. Each job is queued, and a free runner claims it on a fresh, clean machine.',
          },
          {
            from: 'runner',
            to: 'api',
            narration:
              'The runner clones your commit, runs the tests and reports the result. A green check or red cross appears next to your commit and pull request.',
          },
        ],
      },
      {
        id: 'deploy-site',
        title: 'Your website gets deployed',
        emoji: '🌍',
        steps: [
          {
            from: 'queue',
            to: 'runner',
            narration: 'You merge a change into the main branch, which queues a production build. A runner picks it up.',
          },
          {
            from: 'runner',
            to: 'git',
            narration: 'The runner downloads exactly that commit, so the build uses the reviewed code and nothing else.',
          },
          {
            from: 'runner',
            to: 'artifacts',
            narration:
              'It installs dependencies (reusing a cache from earlier builds to save minutes), runs the build command, and uploads the output files and full log to artifact storage.',
          },
          {
            from: 'runner',
            to: 'deploy',
            narration:
              'The build passed, so the runner hands its output to the Deploy service, which creates a new, never-changing version with its own unique URL.',
          },
          {
            from: 'deploy',
            to: 'cdn',
            narration:
              'The Deploy service tells the edge network that your domain now points at the new version. It is a single switch, so visitors never see a half-updated site.',
          },
          {
            from: 'web',
            to: 'cdn',
            narration: "A visitor opens your site, and their browser connects to the edge server nearest to them.",
          },
          {
            from: 'cdn',
            to: 'artifacts',
            narration:
              'If that edge server has not cached the files yet, it fetches them once from artifact storage and keeps a copy for the next visitor.',
          },
        ],
      },
      {
        id: 'open-pr',
        title: 'You open a pull request',
        emoji: '🔀',
        steps: [
          {
            from: 'web',
            to: 'lb',
            narration: 'You click "Create pull request" to ask your team to review your branch and merge it.',
          },
          {
            from: 'lb',
            to: 'api',
            narration: 'The request reaches the web app servers, which check that you are allowed to open pull requests in this repository.',
          },
          {
            from: 'api',
            to: 'git',
            narration:
              'The API asks the Git server to compare your branch with main: which files changed, the line-by-line differences, and whether the two can merge without conflicts.',
          },
          {
            from: 'api',
            to: 'db',
            narration:
              'The pull request is saved in the database with its title, description, branches, author and requested reviewers.',
          },
          {
            from: 'api',
            to: 'queue',
            narration: 'A "pull request opened" event goes onto the queue, which starts CI checks and notifications.',
          },
          {
            from: 'queue',
            to: 'webhooks',
            narration:
              'The Webhook service sends a signed JSON message to every URL subscribed to pull request events, such as a team chat bot, and retries later if a server does not answer.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'app/controllers/pull_requests_controller.rb', note: 'Web pages and API endpoints for pull requests' },
    { path: 'app/models/repository.rb', note: 'Repository model: owner, visibility, default branch' },
    { path: 'services/git-server/receive_pack.go', note: 'Handles git push: authenticate, receive objects, update branches' },
    { path: 'services/git-server/hooks/pre_receive.go', note: 'Enforces branch protection before a push is accepted' },
    { path: 'services/runner/agent.py', note: 'Runner loop: claim a job, run its steps, report the result' },
    { path: 'services/runner/images/base.Dockerfile', note: 'The clean image every build job starts from' },
    { path: 'services/webhooks/src/deliver.ts', note: 'Signs and delivers webhook events with retries' },
    { path: 'services/deploy/router.go', note: 'Points domains at the newest successful deployment' },
    { path: 'services/search/code_indexer.go', note: 'Updates the code search index after pushes' },
    { path: 'db/migrations/20240101_create_pipelines.sql', note: 'Tables for repositories, pipelines and jobs' },
    { path: 'schemas/pipeline.schema.json', note: 'Validates the YAML pipeline files users write' },
    { path: 'examples/.ci/pipeline.yml', note: 'Sample pipeline: install, test, build, deploy' },
    { path: 'docs/api/openapi.yaml', note: 'Public REST API description used to generate docs and SDKs' },
    { path: 'infra/terraform/runners.tf', note: 'Autoscaling pool of build machines' },
  ],

  code: [
    {
      id: 'webhook-delivery',
      title: 'Delivering a signed webhook',
      file: 'services/webhooks/src/deliver.ts',
      language: 'TypeScript',
      explanation:
        'When something happens (like a push), the platform POSTs a JSON message to every URL you registered. It signs the body with HMAC-SHA256 using a secret only you and the platform know, so your server can recompute the signature and reject fakes. Temporary failures are retried with exponential backoff (waiting longer each time); in production those retries are usually scheduled through a job queue instead of sleeping inside one process.',
      code: `import { createHmac, randomUUID } from 'node:crypto';

type Hook = { url: string; secret: string };

// Sign the exact bytes we send, so the receiver can prove the message really came from us.
function sign(body: string, secret: string) {
  return 'sha256=' + createHmac('sha256', secret).update(body).digest('hex');
}

export async function deliver(hook: Hook, event: string, payload: object, maxAttempts = 5) {
  const body = JSON.stringify(payload);
  const deliveryId = randomUUID(); // same ID on every retry, so receivers can ignore duplicates

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(hook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Event': event,
          'X-Delivery-Id': deliveryId,
          'X-Signature-256': sign(body, hook.secret),
        },
        body,
        signal: AbortSignal.timeout(10_000), // give up on servers slower than 10 seconds
      });
      if (res.ok) return { delivered: true, attempt };
      // A 4xx (other than 429 "too many requests") means retrying will not help.
      if (res.status >= 400 && res.status < 500 && res.status !== 429) return { delivered: false, attempt };
    } catch {
      // Network error or timeout: fall through and try again.
    }
    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt)); // wait 2s, 4s, 8s, 16s
    }
  }
  return { delivered: false, attempt: maxAttempts };
}`,
    },
    {
      id: 'pipelines-schema',
      title: 'Repositories, pipelines & the job queue (data model)',
      file: 'db/migrations/20240101_create_pipelines.sql',
      language: 'SQL (PostgreSQL)',
      explanation:
        'A pipeline is one run of CI for one commit, and it contains jobs such as "test" and "build". The last statement is how many runners can safely share one queue table: FOR UPDATE SKIP LOCKED locks the row a runner is claiming, and other runners simply skip locked rows instead of waiting, so two runners never grab the same job.',
      code: `-- Repositories, CI pipelines and the jobs runners pick up (PostgreSQL; accounts table not shown)
CREATE TABLE repositories (
  id             bigserial PRIMARY KEY,
  owner_id       bigint NOT NULL REFERENCES accounts(id),
  name           text NOT NULL,
  default_branch text NOT NULL DEFAULT 'main',
  is_private     boolean NOT NULL DEFAULT true,
  UNIQUE (owner_id, name)                       -- "alice/website" can only exist once
);

CREATE TABLE pipelines (
  id         bigserial PRIMARY KEY,
  repo_id    bigint NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  commit_sha char(40) NOT NULL,                 -- the exact commit being tested
  branch     text NOT NULL,
  status     text NOT NULL DEFAULT 'queued',    -- queued | running | passed | failed
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE jobs (
  id          bigserial PRIMARY KEY,
  pipeline_id bigint NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  name        text NOT NULL,                    -- e.g. 'test', 'build', 'deploy'
  status      text NOT NULL DEFAULT 'queued',
  runner_id   text,
  log_key     text,                             -- where the log file lives in object storage
  started_at  timestamptz,
  finished_at timestamptz
);
CREATE INDEX jobs_waiting ON jobs (id) WHERE status = 'queued';

-- A runner claims the oldest waiting job. SKIP LOCKED: two runners never get the same one.
UPDATE jobs SET status = 'running', runner_id = 'runner-42', started_at = now()
WHERE id = (
  SELECT id FROM jobs WHERE status = 'queued'
  ORDER BY id LIMIT 1
  FOR UPDATE SKIP LOCKED
)
RETURNING id, pipeline_id, name;`,
    },
    {
      id: 'build-runner',
      title: 'A tiny build runner',
      file: 'services/runner/agent.py',
      language: 'Python',
      explanation:
        'A runner is a loop: ask the server for a job, clone the exact commit into an empty folder, run each step, send the logs back and report passed or failed. Because the steps are commands from the repository, the runner is running other people\'s code, so real platforms run this inside a throwaway virtual machine or container that is destroyed after every job.',
      code: `import subprocess
import tempfile
import time
import requests

API = "https://ci.example.com/api/runner"
HEADERS = {"Authorization": "Bearer RUNNER_TOKEN"}  # each runner has its own secret token

def run_job(job):
    """Clone the exact commit, run each step in order, return 'passed' or 'failed'."""
    with tempfile.TemporaryDirectory() as workdir:  # a fresh empty folder = a clean build
        subprocess.run(["git", "clone", "--quiet", job["clone_url"], workdir], check=True)
        subprocess.run(["git", "checkout", "--quiet", job["commit_sha"]], cwd=workdir, check=True)
        for step in job["steps"]:  # e.g. "npm ci", "npm test", "npm run build"
            result = subprocess.run(step, shell=True, cwd=workdir, capture_output=True, text=True, timeout=1800)
            requests.post(f"{API}/jobs/{job['id']}/logs", headers=HEADERS, timeout=30,
                          json={"step": step, "output": result.stdout + result.stderr})
            if result.returncode != 0:
                return "failed"  # stop at the first failing step
    return "passed"

def main():
    while True:
        # Ask for work. The server answers 204 No Content when the queue is empty.
        res = requests.post(f"{API}/jobs/claim", headers=HEADERS, timeout=30)
        if res.status_code == 204:
            time.sleep(5)
            continue
        res.raise_for_status()
        job = res.json()
        try:
            status = run_job(job)
        except Exception:  # a crash, timeout or failed clone still gets reported
            status = "failed"
        requests.post(f"{API}/jobs/{job['id']}/finish", headers=HEADERS, timeout=30, json={"status": status})

if __name__ == "__main__":
    main()`,
    },
  ],

  playground: {
    title: 'Pull request checks',
    description:
      'A mini pull request page in the style of {{name}}: push a commit to start a pretend CI pipeline, watch each check run with live logs, sneak in a bug to see a failure, and merge once everything is green.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pull request checks</title>
<style>
:root {
  --brand: {{brand}}; /* @tweak color "Brand color" */
  --accent: {{accent}}; /* @tweak color "Branch label color" */
  --pass: #1f883d; /* @tweak color "Passing color" */
  --fail: #cf222e; /* @tweak color "Failing color" */
  --term: #0d1117; /* @tweak color "Log background" */
  --radius: 8px; /* @tweak range 0 20 "Corner radius" */
}
* { box-sizing: border-box; }
body { margin: 0; background: #f6f8fa; color: #1f2328; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; }
header { background: var(--brand); color: #fff; padding: 12px 16px; display: flex; gap: 10px; align-items: center; }
.logo { font-family: ui-monospace, Menlo, monospace; font-weight: 700; background: rgba(255,255,255,.2); border-radius: var(--radius); padding: 2px 6px; }
main { padding: 16px; }
h1 { font-size: 20px; margin: 0 0 8px; }
.meta { margin: 0 0 14px; color: #59636e; line-height: 1.9; }
.pill { background: var(--pass); color: #fff; border-radius: 999px; padding: 3px 10px; font-weight: 600; margin-right: 4px; }
.pill.merged { background: #8250df; }
code { font-family: ui-monospace, Menlo, monospace; font-size: 12px; border: 1px solid var(--accent); color: var(--accent); background: #fff; border-radius: var(--radius); padding: 1px 6px; }
.box { background: #fff; border: 1px solid #d1d9e0; border-radius: var(--radius); overflow: hidden; }
.box b { display: block; padding: 10px 12px; border-bottom: 1px solid #d1d9e0; background: #f6f8fa; }
ul { list-style: none; margin: 0; padding: 0; }
li { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-top: 1px solid #eef1f4; }
li:first-child { border-top: 0; }
.icon { width: 18px; height: 18px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; color: #fff; background: #afb8c1; flex-shrink: 0; }
li.pass .icon { background: var(--pass); }
li.fail .icon { background: var(--fail); }
li.running .icon { background: none; border: 2px solid #d4a72c; border-top-color: transparent; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.name { flex: 1; }
li small { color: #59636e; }
.toggle { display: flex; gap: 8px; align-items: center; margin: 12px 0; color: #59636e; }
.actions { display: flex; gap: 8px; }
button { flex: 1; border: 1px solid #d1d9e0; border-radius: var(--radius); padding: 10px; font-weight: 600; font-size: 14px; cursor: pointer; background: #fff; color: #1f2328; }
#merge { background: var(--pass); border-color: var(--pass); color: #fff; }
button:disabled { opacity: .45; cursor: not-allowed; }
.hint { color: #59636e; font-size: 12px; margin: 8px 0; }
#log { background: var(--term); color: #c9d1d9; border-radius: var(--radius); padding: 10px 12px; font: 12px/1.6 ui-monospace, Menlo, monospace; height: 150px; overflow-y: auto; }
#log .cmd { color: #79c0ff; }
#log .good { color: #56d364; }
#log .bad { color: #ff7b72; }
#log .dim { color: #8b949e; }
</style>
</head>
<body>
<header>
  <span class="logo">&lt;/&gt;</span>
  <b data-edit="repo">{{name}} / website</b>
</header>
<main>
  <h1 data-edit="title">Add dark mode toggle</h1>
  <p class="meta"><span class="pill" id="status">Open</span> Merge <code data-edit="branch">feature/dark-mode</code> into <code>main</code></p>

  <section class="box">
    <b id="summary">Push a commit to start the checks</b>
    <ul id="checks"></ul>
  </section>

  <label class="toggle"><input type="checkbox" id="broken"> Sneak a bug into the next commit</label>
  <div class="actions">
    <button id="push">Push a commit</button>
    <button id="merge" disabled>Merge</button>
  </div>
  <p class="hint" data-edit="hint">All checks must pass before you can merge.</p>
  <div id="log"><div class="dim">Waiting for your first push...</div></div>
</main>

<script>
// Each check is one job in the pipeline, run in order by a build runner
const checks = [
  { name: 'Lint', cmd: 'npm run lint', ok: 'No problems found' },
  { name: 'Unit tests', cmd: 'npm test', ok: '42 tests passed', bad: 'FAIL DarkMode.test.js: expected "dark" but got "light"' },
  { name: 'Build', cmd: 'npm run build', ok: 'Compiled successfully in 8.2s' },
  { name: 'Preview deploy', cmd: 'deploy --preview', ok: 'Preview ready at dark-mode.preview.dev' }
];
const icons = { queued: '•', running: '', pass: '✓', fail: '✕', skipped: '–' };
let run = 0;        // goes up on every push, so an older run stops updating
let merged = false;
const $ = (id) => document.getElementById(id);

// Add one line to the build log
function log(text, cls) {
  const line = document.createElement('div');
  line.textContent = text;
  line.className = cls || '';
  $('log').appendChild(line);
  $('log').scrollTop = $('log').scrollHeight;
}

// Redraw the checks list and buttons from our variables
function render() {
  $('checks').innerHTML = '';
  checks.forEach((c) => {
    const li = document.createElement('li');
    li.className = c.state || '';
    li.innerHTML = '<span class="icon"></span><span class="name"></span><small></small>';
    li.querySelector('.icon').textContent = icons[c.state] || '';
    li.querySelector('.name').textContent = c.name;
    li.querySelector('small').textContent = c.state || 'waiting';
    $('checks').appendChild(li);
  });
  const passed = checks.every((c) => c.state === 'pass');
  const failed = checks.some((c) => c.state === 'fail');
  if (run > 0) $('summary').textContent = passed ? 'All checks have passed' : failed ? 'Some checks failed' : 'Checks are running…';
  $('merge').disabled = merged || !passed;
  $('push').disabled = merged;
}

// Pretend build runner: runs each check in order, like a CI server
function runChecks() {
  const id = ++run;
  const broken = $('broken').checked;
  checks.forEach((c) => { c.state = 'queued'; });
  $('log').innerHTML = '';
  log('Runner #7 picked up commit ' + Math.random().toString(16).slice(2, 9), 'dim');
  let i = 0;
  const next = () => {
    if (id !== run) return; // a newer push replaced this run
    if (i === checks.length) return render();
    const c = checks[i];
    c.state = 'running';
    render();
    log('$ ' + c.cmd, 'cmd');
    setTimeout(() => {
      if (id !== run) return;
      if (broken && c.bad) {
        c.state = 'fail';
        log(c.bad, 'bad');
        checks.slice(i + 1).forEach((rest) => { rest.state = 'skipped'; });
        return render();
      }
      c.state = 'pass';
      log(c.ok, 'good');
      i++;
      next();
    }, 700 + Math.random() * 800);
  };
  next();
}

$('push').onclick = runChecks;
$('merge').onclick = () => {
  merged = true;
  $('status').textContent = 'Merged';
  $('status').classList.add('merged');
  log('Merged into main. Production deploy started 🚀', 'good');
  render();
};
render();
</script>
</body>
</html>`,
    challenges: [
      'Tick "Sneak a bug into the next commit" and push again. Why are the checks after the failing test skipped instead of run?',
      'Change the "Passing color" and "Failing color" tweaks to a colorblind-friendly pair, such as blue and orange.',
      'Add a fifth check called "Security scan" to the checks array, with its own command and success message.',
      'Make the pretend runner much faster or slower by changing the delay passed to setTimeout in runChecks.',
    ],
  },

  concepts: [
    {
      term: 'Git',
      meaning:
        'A version control system that records snapshots (commits) of a project, so you can see its history, undo mistakes and work on separate branches at the same time.',
    },
    {
      term: 'Pull request',
      meaning:
        'A request to merge one branch into another, with a page where teammates discuss and review the changes line by line before accepting them.',
    },
    {
      term: 'CI/CD',
      meaning:
        'Continuous integration automatically builds and tests every change; continuous delivery or deployment automatically ships the changes that pass.',
    },
    {
      term: 'Build runner',
      meaning:
        "A worker machine that executes pipeline jobs. Fresh, isolated runners keep builds reproducible and stop one project's code from affecting another's.",
    },
    {
      term: 'Artifact',
      meaning:
        'Any file a build produces, such as a compiled app, a package, a test report or a log, saved so later steps or people can use it.',
    },
    {
      term: 'Webhook',
      meaning:
        'An HTTP request a platform sends to your URL when something happens, so your systems can react right away instead of asking "anything new?" over and over.',
    },
    {
      term: 'Immutable deployment',
      meaning:
        'Every deploy creates a brand-new version that is never edited afterwards. Going live or rolling back is just changing which version the domain points to.',
    },
    {
      term: 'Job queue',
      meaning:
        'A to-do list for background work. Producers add jobs, workers claim them one at a time, and nothing is lost if a worker crashes halfway.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Learn Git from the command line',
      detail:
        'Create a repository, make commits, create and merge branches, and push to a free account on an existing Git host so you understand what the platform stores.',
    },
    {
      step: 'Host repositories yourself',
      detail:
        'Run Gitea or Forgejo with Docker on your laptop. You get repositories, pull requests and webhooks from one small Go program whose source you can read.',
    },
    {
      step: 'Write a webhook receiver',
      detail:
        'Build a tiny Express or Flask server that receives push events, verifies the HMAC signature with your secret, and prints each commit message.',
    },
    {
      step: 'Build a mini CI runner',
      detail:
        'When a push event arrives, clone the repository into a temporary folder, run its tests inside a Docker container, and save the output to a log file.',
    },
    {
      step: 'Show build status',
      detail:
        'Store each run in PostgreSQL or SQLite (queued, running, passed, failed) and make a page listing runs with green or red badges and links to their logs.',
    },
    {
      step: 'Add one-click deploys',
      detail:
        'After a passing build on main, copy the build output into a new versioned folder and switch an nginx symlink to it, or call the deploy API of a host like Netlify or Vercel.',
    },
  ],
};
