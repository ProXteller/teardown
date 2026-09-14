import type { ArchetypeTemplate } from '../types';

export const archetype: ArchetypeTemplate = {
  id: 'productivity',
  label: 'Collaboration & productivity tool',
  keywords: [
    'workspace',
    'workspaces',
    'collaboration',
    'collaborate',
    'collaborative',
    'productivity',
    'project management',
    'task management',
    'tasks',
    'to-do list',
    'todo',
    'kanban',
    'kanban board',
    'whiteboard',
    'note-taking',
    'notes app',
    'document editor',
    'documents',
    'spreadsheet',
    'spreadsheets',
    'team wiki',
    'knowledge base',
    'roadmap',
    'roadmaps',
    'workflow',
    'workflows',
    'teamwork',
    'real-time collaboration',
    'design tool',
    'prototyping',
    'brainstorm',
    'brainstorming',
    'planner',
    'saas',
    'all-in-one workspace',
    'okrs',
    'gantt',
  ],
  tagline: '{{name}} is an online workspace where teams write, plan and create together in real time.',
  eli5:
    "{{name}} is like a shared notebook that lives on the internet instead of on one computer. Every time you type or move something, your change is sent to {{name}}'s servers in a fraction of a second and passed on to everyone else looking at the same page, so all screens stay in sync. Behind the scenes, the servers also check who is allowed to see or edit each page, keep old versions so nothing gets lost, and track which plan each team pays for.",

  languages: [
    { name: 'TypeScript / JavaScript', usedFor: 'The web and desktop app, the editor and most API servers (Node.js)', share: 40 },
    { name: 'Go', usedFor: 'Fast backend services such as permissions, file uploads and billing', share: 15 },
    { name: 'Swift & Kotlin', usedFor: 'Native iOS and Android apps', share: 15 },
    { name: 'Rust / C++', usedFor: 'Speed-critical parts like canvas rendering (via WebAssembly) and sync servers', share: 10 },
    { name: 'SQL', usedFor: 'Workspaces, pages, permissions and billing records in PostgreSQL', share: 10 },
    { name: 'Python', usedFor: 'Data analysis, search indexing jobs and AI features', share: 10 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'Rich-text editor engine (ProseMirror / Tiptap)',
          role: 'The typing surface',
          beginnerNote:
            'A plain browser text box is too simple for headings, checklists and comments, so apps use an editor engine that stores the page as a tree of blocks and turns every change into a small, trackable step.',
        },
        {
          name: 'WebAssembly + Canvas / WebGL',
          role: 'Fast drawing for boards and designs',
          beginnerNote:
            'WebAssembly lets code written in C++ or Rust run inside the browser at near-native speed, which helps when a whiteboard or design file has thousands of shapes to draw.',
        },
        {
          name: 'Electron',
          role: 'Desktop app',
          beginnerNote:
            'Electron wraps the web app in a desktop window, so one codebase runs on Windows, Mac and Linux without being rewritten three times.',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Node.js (TypeScript)',
          role: 'Main API server',
          beginnerNote:
            'JavaScript running on the server, so front-end and back-end developers can share code and type definitions like "Page" or "Workspace".',
        },
        {
          name: 'WebSockets',
          role: 'Live connection for real-time edits',
          beginnerNote:
            'A normal web request is like mailing a letter and waiting for a reply. A WebSocket is like an open phone line: either side can speak at any moment.',
        },
        {
          name: 'Yjs / Automerge (CRDTs)',
          role: 'Merging edits from many people',
          beginnerNote:
            'These libraries store a document in a special way so edits made at the same moment can be merged automatically, in any order, and everyone still ends up with the same text.',
        },
        {
          name: 'Stripe Billing',
          role: 'Subscriptions & invoices',
          beginnerNote:
            'Instead of handling credit cards themselves, most SaaS companies let Stripe charge customers every month and send a message back when a payment succeeds or fails.',
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
            'A reliable relational database: tables of users, workspaces, members, pages and permissions, linked together by IDs.',
        },
        {
          name: 'Redis',
          role: 'Presence, caching & pub/sub',
          beginnerNote:
            'An in-memory data store that is extremely fast. It remembers who is online right now and relays live edits between servers.',
        },
        {
          name: 'Amazon S3',
          role: 'File & image storage',
          beginnerNote:
            'Cheap, practically unlimited storage for uploads like images, PDFs and exports. The database only keeps a short key pointing to each file.',
        },
        {
          name: 'Elasticsearch / OpenSearch',
          role: 'Workspace search',
          beginnerNote:
            'A search engine that builds an index of every word in every page, like the index at the back of a textbook, so searching thousands of documents takes milliseconds.',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Amazon Web Services',
          role: 'Cloud provider',
          beginnerNote:
            'Renting servers, databases and storage from a cloud provider means a small team can grow from ten customers to millions without building data centers.',
        },
        {
          name: 'Kubernetes',
          role: 'Runs and scales the services',
          beginnerNote:
            'Kubernetes starts, restarts and moves small programs (containers) between machines automatically, adding more copies of the sync server when many people are online.',
        },
        {
          name: 'Apache Kafka',
          role: 'Event stream',
          beginnerNote:
            'A durable log of events like "page edited" or "file uploaded" that many background workers can read at their own pace, without the API waiting for them.',
        },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        {
          name: 'GitHub Actions',
          role: 'Tests on every change',
          beginnerNote:
            'Every time a developer proposes a change, robots run the test suite, so bugs are caught before they reach customers.',
        },
        {
          name: 'Feature flags',
          role: 'Gradual rollouts',
          beginnerNote:
            'Switches in the code that turn a new feature on for 1% of teams first, then everyone. If something breaks, only a few people notice and the switch flips back.',
        },
        {
          name: 'Sentry & Datadog',
          role: 'Errors & monitoring',
          beginnerNote:
            'Tools that collect crashes and performance graphs from real users, so engineers find out about problems before customers write in.',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Large language model APIs',
          role: 'Writing & summarizing assistant',
          beginnerNote:
            'Many tools now have an "Ask AI" button that sends page text to a large language model to summarize, rewrite or answer questions about it.',
        },
        {
          name: 'Vector embeddings',
          role: 'Search by meaning',
          beginnerNote:
            'Pages are turned into lists of numbers that capture their meaning, so a search for "vacation rules" can find a page titled "Time-off policy".',
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
        tech: 'Built with {{frontend}} + an editor engine',
        description:
          'The {{name}} site in your browser. It keeps a local copy of the document, so typing feels instant even before the server has replied.',
      },
      {
        id: 'apps',
        label: 'Desktop & Mobile Apps',
        kind: 'client',
        tier: 0,
        tech: 'Electron · Swift · Kotlin',
        description:
          'Desktop apps usually wrap the same web code, while phone apps are often native. They keep recent pages on the device so you can work offline and sync later.',
      },
      {
        id: 'cdn',
        label: 'CDN',
        kind: 'edge',
        tier: 1,
        tech: '{{hosting}}',
        description:
          "Servers around the world that deliver the app's JavaScript, fonts and uploaded images from a location close to you, so pages load quickly.",
      },
      {
        id: 'lb',
        label: 'Load Balancer',
        kind: 'edge',
        tier: 1,
        tech: 'Cloud load balancer (HTTPS & WebSocket)',
        description:
          'The front door for API requests and live connections. It spreads traffic across many servers and keeps each open WebSocket attached to the same server.',
      },
      {
        id: 'api',
        label: 'API Server',
        kind: 'gateway',
        tier: 2,
        tech: 'Node.js (TypeScript) · REST / GraphQL',
        description:
          'Handles everything except live typing: creating pages, inviting teammates, uploading files, searching and changing plans. It checks who you are on every request.',
      },
      {
        id: 'realtime',
        label: 'Real-time Sync Server',
        kind: 'gateway',
        tier: 2,
        tech: 'WebSockets + Yjs (CRDT)',
        description:
          'Holds an open connection to everyone viewing a document. It merges incoming edits, forwards them to the other viewers within milliseconds and shares live cursors.',
      },
      {
        id: 'authz',
        label: 'Permissions Service',
        kind: 'service',
        tier: 3,
        tech: 'Go · role-based access control',
        description:
          'Answers one question very quickly, many times a second: may this person view, comment on or edit this page? It combines workspace roles with pages shared directly.',
      },
      {
        id: 'queue',
        label: 'Event Queue',
        kind: 'queue',
        tier: 3,
        tech: 'Apache Kafka',
        description:
          'A waiting line for slow work. The API drops in events like "file uploaded" and replies to you right away, while workers pick the events up in the background.',
      },
      {
        id: 'workers',
        label: 'Background Workers',
        kind: 'service',
        tier: 3,
        tech: 'Node.js & Python workers',
        description:
          'Do the heavy lifting nobody should wait for: making image thumbnails, exporting PDFs, sending notification emails and updating the search index.',
      },
      {
        id: 'billing',
        label: 'Payments',
        kind: 'external',
        tier: 3,
        tech: 'Stripe Billing',
        description:
          'An outside payment company that stores card details, charges each team monthly or yearly, and tells {{name}} when a subscription starts, renews or fails.',
      },
      {
        id: 'db',
        label: 'Main Database',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL',
        description:
          "The source of truth: users, workspaces, members and roles, pages, saved document updates and each workspace's plan.",
      },
      {
        id: 'redis',
        label: 'Live State Cache',
        kind: 'cache',
        tier: 4,
        tech: 'Redis (pub/sub)',
        description:
          'Super-fast memory that relays edits between sync servers and remembers who is online and where their cursor is. If it restarts, nothing permanent is lost.',
      },
      {
        id: 's3',
        label: 'File Storage',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3',
        description:
          'Holds uploaded images, attachments, thumbnails and exports. Each file gets a unique key, like a locker number, that the database stores.',
      },
      {
        id: 'search',
        label: 'Search Index',
        kind: 'database',
        tier: 4,
        tech: 'Elasticsearch / OpenSearch',
        description:
          'A pre-built index of the words in every page, so searching a whole workspace is instant. Workers update it in the background after pages change.',
      },
    ],
    edges: [
      { from: 'web', to: 'cdn', label: 'App code & images' },
      { from: 'web', to: 'lb', label: 'HTTPS & WebSocket' },
      { from: 'apps', to: 'lb', label: 'HTTPS & WebSocket' },
      { from: 'cdn', to: 's3', label: 'Fetch files on cache miss' },
      { from: 'lb', to: 'api', label: 'REST / GraphQL' },
      { from: 'lb', to: 'realtime', label: 'Live connections' },
      { from: 'api', to: 'authz', label: 'May they do this?' },
      { from: 'realtime', to: 'authz', label: 'Check document access' },
      { from: 'authz', to: 'db', label: 'Roles & shares' },
      { from: 'api', to: 'db', label: 'Read & write records' },
      { from: 'realtime', to: 'redis', label: 'Relay edits & presence' },
      { from: 'realtime', to: 'db', label: 'Save document updates' },
      { from: 'api', to: 's3', label: 'Signed upload links' },
      { from: 'api', to: 'search', label: 'Search queries' },
      { from: 'api', to: 'queue', label: 'Publish events' },
      { from: 'api', to: 'billing', label: 'Subscriptions & webhooks' },
      { from: 'queue', to: 'workers', label: 'Background jobs' },
      { from: 'workers', to: 's3', label: 'Thumbnails & exports' },
      { from: 'workers', to: 'search', label: 'Update the index' },
    ],
    flows: [
      {
        id: 'edit-together',
        title: 'You and a teammate edit the same page',
        emoji: '✍️',
        steps: [
          {
            from: 'web',
            to: 'lb',
            narration:
              'You type a word. The editor updates your screen instantly, then sends a tiny message describing the change over a WebSocket that stays open while the page is open.',
          },
          {
            from: 'lb',
            to: 'realtime',
            narration: 'The load balancer passes the message along the live connection to the sync server hosting this document.',
          },
          {
            from: 'realtime',
            to: 'authz',
            narration:
              'When you opened the page, the sync server asked the Permissions service whether you may edit it. The answer is remembered, so each keystroke does not need a fresh check.',
          },
          {
            from: 'realtime',
            to: 'redis',
            narration:
              "The sync server merges your change into its copy of the document and publishes it on this page's Redis channel, so other sync servers with viewers of the page get it too. Your cursor position travels the same way.",
          },
          {
            from: 'realtime',
            to: 'db',
            narration:
              'New changes are saved to PostgreSQL as small updates. Every so often they are squashed into a snapshot so the page loads quickly next time.',
          },
          {
            from: 'lb',
            to: 'apps',
            narration:
              "Your teammate's app receives the update and merges it with anything they typed at the same moment. Because the document is a CRDT, both screens end up identical and nobody's words are lost.",
          },
        ],
      },
      {
        id: 'upload-image',
        title: 'You drop an image into a page',
        emoji: '🖼️',
        steps: [
          {
            from: 'web',
            to: 'lb',
            narration: 'You drag a photo onto the page. Before uploading anything, the app asks the API where the file should go.',
          },
          {
            from: 'lb',
            to: 'api',
            narration:
              'An API server checks your login and confirms with the Permissions service that you are allowed to edit this page.',
          },
          {
            from: 'api',
            to: 's3',
            narration:
              'The API creates a presigned URL: a short-lived link that allows exactly one upload to S3. Your browser sends the file straight to storage with it, so big files never clog the API servers.',
          },
          {
            from: 'api',
            to: 'queue',
            narration: 'When the upload finishes, the API records the file in the database and publishes a "file uploaded" event.',
          },
          {
            from: 'queue',
            to: 'workers',
            narration: 'A background worker picks up the event and makes smaller thumbnail versions of the image.',
          },
          {
            from: 'workers',
            to: 's3',
            narration: 'The thumbnails are saved to S3 next to the original, ready for fast previews.',
          },
          {
            from: 'web',
            to: 'cdn',
            narration:
              'Whenever anyone opens the page, the image loads through the CDN from a server near them. The CDN fetches it from S3 once and keeps a copy for everyone after.',
          },
        ],
      },
      {
        id: 'upgrade-plan',
        title: 'Your team upgrades to a paid plan',
        emoji: '💳',
        steps: [
          {
            from: 'web',
            to: 'lb',
            narration: 'A workspace admin clicks "Upgrade". The app asks the API to start a checkout.',
          },
          {
            from: 'lb',
            to: 'api',
            narration: 'The API confirms you are an admin of this workspace, because regular members cannot change billing.',
          },
          {
            from: 'api',
            to: 'billing',
            narration:
              "The API asks Stripe to create a checkout session and sends you to Stripe's payment page, so card numbers never touch {{name}}'s own servers.",
          },
          {
            from: 'billing',
            to: 'api',
            narration:
              'After the payment succeeds, Stripe sends a webhook: a signed message saying the subscription is active. The API verifies the signature so nobody can fake it.',
          },
          {
            from: 'api',
            to: 'db',
            narration: "The API saves the workspace's new plan and number of paid seats in PostgreSQL.",
          },
          {
            from: 'api',
            to: 'queue',
            narration: 'A "plan changed" event lets background workers email a receipt and raise the storage limit.',
          },
          {
            from: 'authz',
            to: 'db',
            narration:
              'The next time the Permissions service looks up this workspace, it sees the paid plan and unlocks features such as guest access.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'services/api/src/routes/pages.ts', note: 'Create, rename, move and delete pages' },
    { path: 'services/api/src/routes/uploads.ts', note: 'Hands out presigned S3 upload URLs' },
    { path: 'services/api/src/billing/stripeWebhook.ts', note: 'Verifies Stripe webhooks and updates the plan' },
    { path: 'services/sync/src/server.ts', note: 'WebSocket server that joins people to document rooms' },
    { path: 'services/sync/src/persistence.ts', note: 'Saves CRDT updates and snapshots to PostgreSQL' },
    { path: 'services/permissions/can.go', note: 'Decides who can view, comment on or edit a page' },
    { path: 'services/workers/src/indexPage.ts', note: 'Sends page text to the search index' },
    { path: 'services/workers/src/thumbnails.py', note: 'Makes preview images for uploaded files' },
    { path: 'packages/editor/src/collab.ts', note: 'Connects the editor to the shared Yjs document' },
    { path: 'packages/shared/src/roles.ts', note: 'Role names shared by the front end and back end' },
    { path: 'db/migrations/001_workspaces.sql', note: 'Users, workspaces, members, pages and permissions' },
    { path: 'infra/k8s/sync-deployment.yaml', note: 'Runs and scales the sync servers on Kubernetes' },
    { path: 'infra/terraform/storage.tf', note: 'Creates the S3 bucket for uploads' },
    { path: '.github/workflows/ci.yml', note: 'Runs tests on every pull request' },
  ],

  code: [
    {
      id: 'sync-server',
      title: 'Real-time sync server (WebSockets + CRDT)',
      file: 'services/sync/src/server.ts',
      language: 'TypeScript',
      explanation:
        'Everyone viewing the same page joins a "room" that holds one shared Yjs document. A newcomer first receives the whole document, then every edit they send is merged (CRDTs make the order of arrival irrelevant), forwarded to the other people in the room and saved. Production servers such as y-websocket or Hocuspocus also share cursor positions, compact old updates and use Redis so rooms can span many servers.',
      code: `import { WebSocketServer, WebSocket } from 'ws';
import * as Y from 'yjs';
import { canAccess, loadDoc, saveUpdate, userFromCookie } from './lib';

type Room = { doc: Y.Doc; sockets: Set<WebSocket> };
const rooms = new Map<string, Promise<Room>>(); // one shared document per open page

function getRoom(pageId: string) {
  if (!rooms.has(pageId)) {
    // Rebuild the document from the latest snapshot plus updates saved since then.
    rooms.set(pageId, loadDoc(pageId).then((doc) => ({ doc, sockets: new Set<WebSocket>() })));
  }
  return rooms.get(pageId)!;
}

const wss = new WebSocketServer({ port: 4000 });

wss.on('connection', async (socket, req) => {
  const pageId = new URL(req.url ?? '/', 'http://localhost').searchParams.get('page') ?? '';
  const userId = await userFromCookie(req.headers.cookie);
  if (!(await canAccess(userId, pageId, 'viewer'))) return socket.close(4403, 'No access');
  const canEdit = await canAccess(userId, pageId, 'editor');

  const room = await getRoom(pageId);
  room.sockets.add(socket);
  socket.send(Y.encodeStateAsUpdate(room.doc)); // 1. the newcomer gets the whole document

  socket.on('message', async (data) => {
    if (!canEdit) return; // viewers can watch, but not change anything
    const update = new Uint8Array(data as Buffer);
    Y.applyUpdate(room.doc, update); // 2. CRDT merge: arrival order does not matter
    for (const peer of room.sockets) {
      if (peer !== socket && peer.readyState === WebSocket.OPEN) peer.send(update); // 3. fan out
    }
    await saveUpdate(pageId, update); // 4. persist so nothing is lost on a restart
  });

  socket.on('close', () => room.sockets.delete(socket));
});`,
    },
    {
      id: 'workspace-schema',
      title: 'Workspaces, pages & permissions (data model)',
      file: 'db/migrations/001_workspaces.sql',
      language: 'SQL (PostgreSQL)',
      explanation:
        'Every row that belongs to a customer points at a workspace, which is how one database safely serves thousands of separate teams (multi-tenancy). Members get a role for the whole workspace, while page_permissions lets you share one page with a guest. Document edits are stored as small binary CRDT updates in order, which also makes version history possible.',
      code: `-- Core tables for a collaborative workspace app (PostgreSQL)
CREATE TABLE users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text NOT NULL UNIQUE);

CREATE TABLE workspaces (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text NOT NULL,
  plan               text NOT NULL DEFAULT 'free',  -- free | pro | enterprise
  stripe_customer_id text UNIQUE                    -- links the team to its billing record
);

CREATE TABLE workspace_members (
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id      uuid REFERENCES users(id) ON DELETE CASCADE,
  role         text NOT NULL CHECK (role IN ('viewer', 'commenter', 'editor', 'admin')),
  PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE pages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  parent_id    uuid REFERENCES pages(id) ON DELETE CASCADE,  -- pages can nest inside pages
  title        text NOT NULL DEFAULT 'Untitled'
);

-- Share one page with someone, even a guest outside the workspace
CREATE TABLE page_permissions (
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role    text NOT NULL,
  PRIMARY KEY (page_id, user_id)
);

-- Every edit is stored as a small binary CRDT update, in order
CREATE TABLE document_updates (
  id         bigserial PRIMARY KEY,
  page_id    uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  payload    bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON document_updates (page_id, id);`,
    },
    {
      id: 'permission-check',
      title: 'Who can edit this page? (permissions)',
      file: 'services/permissions/can.go',
      language: 'Go',
      explanation:
        'Roles are ranked, so "editor" automatically includes everything a "viewer" can do. The query looks up two possible sources of access at once: a role on the whole workspace and a direct share of this page, and the stronger one wins. Real systems cache these answers for a few seconds because the check runs on almost every request and live connection.',
      code: `package permissions

import (
	"context"
	"database/sql"
	"errors"
)

// Higher number = more power. An editor can do everything a viewer can.
var rank = map[string]int{"viewer": 1, "commenter": 2, "editor": 3, "admin": 4}

type Service struct{ DB *sql.DB }

// Can reports whether a user has at least the wanted role on a page.
func (s *Service) Can(ctx context.Context, userID, pageID, want string) (bool, error) {
	need, ok := rank[want]
	if !ok {
		return false, errors.New("unknown role: " + want)
	}
	var pageRole, workspaceRole sql.NullString // NULL means "no access from this source"
	err := s.DB.QueryRowContext(ctx, \`
		SELECT pp.role, wm.role
		FROM pages p
		LEFT JOIN page_permissions pp ON pp.page_id = p.id AND pp.user_id = $1
		LEFT JOIN workspace_members wm ON wm.workspace_id = p.workspace_id AND wm.user_id = $1
		WHERE p.id = $2\`, userID, pageID).Scan(&pageRole, &workspaceRole)
	if errors.Is(err, sql.ErrNoRows) {
		return false, nil // the page does not exist
	}
	if err != nil {
		return false, err
	}
	// Take the stronger of the two roles (an unknown or missing role counts as 0).
	return max(rank[pageRole.String], rank[workspaceRole.String]) >= need, nil
}`,
    },
  ],

  playground: {
    title: 'Live team board',
    description:
      'A tiny shared kanban board in the style of {{name}}: tap cards to move them, add tasks, watch a pretend teammate make live changes, and switch yourself to view-only to see permissions in action.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Team board</title>
<style>
:root {
  --brand: {{brand}}; /* @tweak color "Brand color" */
  --accent: {{accent}}; /* @tweak color "Teammate color" */
  --bg: #f4f4f1; /* @tweak color "Board background" */
  --radius: 10px; /* @tweak range 0 24 "Corner radius" */
  --gap: 8px; /* @tweak range 2 20 "Card spacing" */
}
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; background: var(--bg); color: #1f2328; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
header { display: flex; align-items: center; gap: 8px; padding: 12px 14px; background: #fff; border-bottom: 1px solid #e5e5e0; }
.logo { width: 26px; height: 26px; border-radius: calc(var(--radius) / 2); background: var(--brand); color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 13px; }
header b { flex: 1; font-size: 14px; }
.av { width: 26px; height: 26px; border-radius: 50%; border: 2px solid #fff; margin-left: -8px; display: inline-grid; place-items: center; color: #fff; font-size: 11px; font-weight: 700; }
.bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 14px 4px; }
h1 { font-size: 18px; margin: 0; }
.role { border: 0; border-radius: 999px; padding: 6px 12px; font-size: 12px; font-weight: 600; background: var(--brand); color: #fff; cursor: pointer; }
.role.viewer { background: #d9d9d4; color: #444; }
.cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap); padding: 10px 14px; }
.col { background: rgba(0,0,0,.05); border-radius: var(--radius); padding: 6px; min-height: 230px; }
.col h2 { font-size: 11px; text-transform: uppercase; letter-spacing: .6px; color: #6b6b66; margin: 4px 4px 8px; }
.card { background: #fff; border-radius: calc(var(--radius) * .7); padding: 8px; margin-bottom: var(--gap); font-size: 12px; line-height: 1.3; box-shadow: 0 1px 2px rgba(0,0,0,.12); border-left: 3px solid var(--brand); cursor: pointer; transition: transform .15s; }
.card:active { transform: scale(.96); }
.card.remote { border-left-color: var(--accent); box-shadow: 0 0 0 2px var(--accent); }
.add { display: flex; gap: 6px; padding: 0 14px; }
.add input { flex: 1; min-width: 0; padding: 9px 10px; border: 1px solid #d6d6d0; border-radius: var(--radius); font-size: 13px; }
.add button { border: 0; border-radius: var(--radius); background: var(--brand); color: #fff; padding: 0 14px; font-weight: 600; }
.toast { margin: 12px 14px; padding: 8px 10px; border-radius: var(--radius); background: #fff; font-size: 12px; color: #555; border: 1px dashed #d6d6d0; }
.dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); margin-right: 6px; }
</style>
</head>
<body>
<header>
  <span class="logo" id="logo"></span>
  <b id="ws" data-edit="workspace">{{name}}</b>
  <span class="av" style="background: var(--brand)">Y</span><span class="av" style="background: var(--accent)">S</span>
</header>

<div class="bar">
  <h1 data-edit="board">Launch plan</h1>
  <button class="role" id="role">Can edit</button>
</div>

<div class="cols">
  <section class="col"><h2 data-edit="col1">To do</h2><div id="todo"></div></section>
  <section class="col"><h2 data-edit="col2">Doing</h2><div id="doing"></div></section>
  <section class="col"><h2 data-edit="col3">Done</h2><div id="done"></div></section>
</div>

<form class="add" id="add">
  <input id="task" placeholder="Add a task..." maxlength="40">
  <button>Add</button>
</form>
<p class="toast" id="toast"><span class="dot"></span>Sam is viewing this board</p>

<script>
// The shared board "document". In a real app it lives in a CRDT synced to every teammate.
const cards = [
  { id: 1, text: 'Write launch blog post', col: 'todo' },
  { id: 2, text: 'Design pricing page', col: 'doing' },
  { id: 3, text: 'Fix login bug', col: 'doing' },
  { id: 4, text: 'Set up billing', col: 'done' },
  { id: 5, text: 'Invite beta testers', col: 'todo' }
];
const order = ['todo', 'doing', 'done'];
let canEdit = true;
let nextId = 6;
const $ = (id) => document.getElementById(id);

// Redraw every column from the cards array (the "state")
function render(highlightId) {
  order.forEach((col) => { $(col).innerHTML = ''; });
  cards.forEach((card) => {
    const el = document.createElement('div');
    el.className = 'card' + (card.id === highlightId ? ' remote' : '');
    el.textContent = card.text;
    el.onclick = () => move(card, 'You');
    $(card.col).appendChild(el);
  });
}

// Show a message in the activity bar (append keeps user text as plain text)
function say(message) {
  $('toast').innerHTML = '<span class="dot"></span>';
  $('toast').append(message);
}

// Move a card one column to the right (Done wraps back to To do)
function move(card, who) {
  if (who === 'You' && !canEdit) {
    say('🔒 You only have view access. Ask an admin to make you an editor.');
    return;
  }
  card.col = order[(order.indexOf(card.col) + 1) % order.length];
  render(who === 'You' ? null : card.id);
  say(who + ' moved "' + card.text + '"');
  if (who !== 'You') setTimeout(() => render(), 1500); // fade the highlight
}

// Permissions: switch yourself between editor and viewer
$('role').onclick = () => {
  canEdit = !canEdit;
  $('role').textContent = canEdit ? 'Can edit' : 'Can view';
  $('role').classList.toggle('viewer', !canEdit);
  $('task').disabled = !canEdit;
};

$('add').onsubmit = (e) => {
  e.preventDefault();
  const text = $('task').value.trim();
  if (!text || !canEdit) return;
  cards.push({ id: nextId++, text: text, col: 'todo' });
  $('task').value = '';
  render();
  say('You added "' + text + '"');
};

// Pretend teammate: every few seconds an edit "arrives over the WebSocket"
setInterval(() => {
  const card = cards[Math.floor(Math.random() * cards.length)];
  move(card, 'Sam');
}, 4000);

$('logo').textContent = $('ws').textContent.trim().charAt(0).toUpperCase() || 'W';
render();
</script>
</body>
</html>`,
    challenges: [
      'Change the "Brand color" tweak and watch the logo, buttons and card stripes all update together.',
      'Tap "Can edit" to become a viewer, then try to move a card. Find the line in the script that blocks you.',
      'Make the pretend teammate Sam add a brand-new card every so often instead of only moving existing ones.',
      'Add a fourth "Blocked" column. You will need a new section in the HTML and a new entry in the order array.',
    ],
  },

  concepts: [
    {
      term: 'Real-time collaboration',
      meaning:
        "Several people editing the same thing at once and seeing each other's changes within a fraction of a second, usually over WebSocket connections.",
    },
    {
      term: 'CRDT (conflict-free replicated data type)',
      meaning:
        'A way of storing data so every copy can accept edits on its own, and all copies merge into the same result no matter what order the edits arrive in.',
    },
    {
      term: 'Operational transformation (OT)',
      meaning:
        'An older approach to live editing, made famous by Google Docs, where a central server adjusts each incoming edit to account for other edits that happened at the same time.',
    },
    {
      term: 'WebSocket',
      meaning:
        'A connection between the browser and a server that stays open, so either side can send messages at any time instead of the browser asking over and over.',
    },
    {
      term: 'Role-based access control (RBAC)',
      meaning:
        'Giving people roles like viewer, editor or admin and deciding what each role may do, instead of setting permissions one person at a time.',
    },
    {
      term: 'Multi-tenancy',
      meaning:
        "One copy of the software serves many separate customers (workspaces). Every query must filter by workspace so no team ever sees another team's data.",
    },
    {
      term: 'Presigned URL',
      meaning:
        'A temporary link, signed with a secret key, that lets a browser upload or download one specific file directly from cloud storage.',
    },
    {
      term: 'Webhook',
      meaning:
        'A message another service sends to your server when something happens, like a payment company announcing "this subscription was paid".',
    },
  ],

  buildYourOwn: [
    {
      step: 'Build a single-player board',
      detail:
        'Make a to-do board with React and Vite (or plain JavaScript) where cards move between columns, and save the cards in localStorage so they survive a refresh.',
    },
    {
      step: 'Add accounts and workspaces',
      detail:
        'Use Supabase, or Node.js with PostgreSQL, to store users, workspaces and a members table with a role column (viewer, editor, admin).',
    },
    {
      step: 'Make it real-time',
      detail:
        'Store the board in a Yjs document and sync it with y-websocket, or try a hosted service like Liveblocks. Open two browser windows and watch edits appear in both.',
    },
    {
      step: 'Enforce permissions on the server',
      detail:
        "Check the user's role on every API request and whenever a WebSocket connects. Hiding a button in the UI is not security; the server must be the one that says no.",
    },
    {
      step: 'Support file uploads',
      detail:
        'Generate presigned upload URLs for S3-compatible storage such as Cloudflare R2 or Supabase Storage, and store only the file key in your database.',
    },
    {
      step: 'Charge for a Pro plan and deploy',
      detail:
        'Use Stripe Checkout in test mode, handle its webhooks to update the workspace plan, then deploy the front end to Vercel and the sync server to Render or Fly.io.',
    },
  ],
};
