import type { ArchetypeTemplate } from '../types';

export const archetype: ArchetypeTemplate = {
  id: 'messaging',
  label: 'Messaging & calls',

  keywords: [
    'chat',
    'chats',
    'messaging',
    'messenger',
    'messages',
    'text messages',
    'instant messaging',
    'group chat',
    'group chats',
    'direct messages',
    'private messages',
    'send messages',
    'voice calls',
    'video calls',
    'video call',
    'voice chat',
    'video conferencing',
    'online meetings',
    'meetings',
    'screen sharing',
    'end-to-end encrypted',
    'end-to-end encryption',
    'encrypted messaging',
    'team chat',
    'team communication',
    'huddle',
    'stickers',
    'walkie-talkie',
    'webinar',
    'conversations',
    'stay in touch',
    'talk to friends',
  ],

  tagline: '{{name}} lets people send messages, share files and make voice or video calls in real time.',

  eli5:
    "{{name}} works like a post office that delivers in the blink of an eye. While the app is open, it keeps a connection to {{name}}'s servers permanently open, like a phone line that never hangs up, so when you hit send your message reaches the server, gets saved, and is pushed straight down your friend's open line within a fraction of a second. If their app is closed, a push notification wakes their phone, and calls use a separate connection built to carry voice and video with as little delay as possible.",

  languages: [
    { name: 'TypeScript / JavaScript', usedFor: 'The web and desktop apps, plus Node.js realtime servers', share: 25 },
    { name: 'Go', usedFor: 'Message, presence and push notification services', share: 20 },
    { name: 'Elixir / Erlang', usedFor: 'Connection servers that hold millions of open connections at once', share: 10 },
    { name: 'C++ / Rust', usedFor: 'Call media handling, audio and video codecs and encryption libraries', share: 15 },
    { name: 'Swift / Kotlin', usedFor: 'The iOS and Android apps', share: 20 },
    { name: 'SQL / CQL', usedFor: 'Queries for accounts, groups and message history', share: 10 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'WebSocket client',
          role: 'Live two-way connection',
          beginnerNote:
            'Normal web requests are like sending letters: ask, get an answer, done. A WebSocket is like a phone call that stays connected, so the server can send you new messages the moment they exist.',
        },
        {
          name: 'Electron',
          role: 'Desktop app from web code',
          beginnerNote:
            'Electron bundles a copy of Chromium with the web app, so the same code becomes a Windows, Mac and Linux desktop app.',
        },
        {
          name: 'IndexedDB',
          role: 'Message cache in the browser',
          beginnerNote: 'A small database built into every browser. Recent chats are saved there so they appear instantly, even before the network responds.',
        },
      ],
    },
    {
      layer: 'Mobile',
      items: [
        {
          name: 'Swift & Kotlin',
          role: 'Native iOS and Android apps',
          beginnerNote: 'Native apps can keep connections efficient, run in the background briefly and integrate with the phone\'s call screen and contacts.',
        },
        {
          name: 'SQLite on the device',
          role: 'Local message history',
          beginnerNote:
            'Every chat is also stored in a tiny database on your phone, which is why old conversations open instantly and can be read without internet.',
        },
        {
          name: 'Signal Protocol',
          role: 'End-to-end encryption (in apps that offer it)',
          beginnerNote:
            'Messages are locked on your phone with a key only the recipient\'s device has, so even the company running the servers cannot read them.',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Elixir / Erlang (BEAM)',
          role: 'Connection gateways',
          beginnerNote:
            'The Erlang virtual machine was built for telephone switches. It can juggle millions of tiny lightweight processes, one per connected device, on a handful of servers.',
        },
        {
          name: 'Go services',
          role: 'Message and push logic',
          beginnerNote: 'Go is fast and simple, and makes it easy to do many things in parallel, like delivering one group message to 500 members.',
        },
        {
          name: 'WebRTC media server (SFU)',
          role: 'Group voice and video calls',
          beginnerNote:
            'Open-source servers such as mediasoup, Janus or LiveKit receive each caller\'s video once and forward it to everyone else in the call.',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'Apache Cassandra or ScyllaDB',
          role: 'Message history',
          beginnerNote:
            'Databases spread across many machines that are very good at writing huge numbers of rows quickly, like billions of messages a day, and reading them back in order.',
        },
        {
          name: 'PostgreSQL',
          role: 'Accounts, contacts and groups',
          beginnerNote: 'A classic, reliable table database for data that must be exactly right, like who is a member of which group.',
        },
        {
          name: 'Redis',
          role: 'Presence and pub/sub',
          beginnerNote:
            'An in-memory store that remembers who is online right now and passes new messages between servers instantly with its publish/subscribe feature.',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'STUN / TURN servers (coturn)',
          role: 'Help calls get through firewalls',
          beginnerNote:
            'STUN tells your device its public internet address. When a school or office network blocks direct connections, TURN relays the call audio and video instead.',
        },
        {
          name: 'APNs & FCM',
          role: 'Push notifications',
          beginnerNote: 'Apple and Google run the official services that wake a phone to show "New message from Sam", even when the app is closed.',
        },
        {
          name: 'Amazon S3 (object storage)',
          role: 'Photos, voice notes and files',
          beginnerNote: 'Attachments are stored as files in the cloud, and each message only holds a link to its file.',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'web',
        label: 'Web & Desktop App',
        kind: 'client',
        tier: 0,
        tech: '{{frontend}} (often wrapped in Electron for desktop)',
        description:
          'The {{name}} app in your browser or on your computer. It keeps a WebSocket open for live messages and caches recent chats locally.',
      },
      {
        id: 'mobile',
        label: 'Mobile Apps',
        kind: 'client',
        tier: 0,
        tech: 'Swift (iOS) · Kotlin (Android) · SQLite',
        description:
          'The phone apps keep a local copy of your chats so they open instantly and work offline, then sync with the servers whenever they reconnect.',
      },
      {
        id: 'cdn',
        label: 'CDN',
        kind: 'edge',
        tier: 1,
        tech: '{{hosting}} · attachment delivery',
        description:
          'Serves the app code, emoji, avatars and shared photos from servers close to you, so images in a chat load quickly.',
      },
      {
        id: 'push',
        label: 'Push Services',
        kind: 'external',
        tier: 1,
        tech: 'Apple APNs · Google FCM',
        description:
          'Apple and Google deliver notifications to phones. {{name}} hands them a short message and they wake the device, even if the app is closed.',
      },
      {
        id: 'turn',
        label: 'STUN / TURN',
        kind: 'edge',
        tier: 1,
        tech: 'coturn',
        description:
          'Help call audio and video find a path between devices. When a strict network blocks direct connections, TURN relays the media instead.',
      },
      {
        id: 'gateway',
        label: 'Realtime Gateway',
        kind: 'gateway',
        tier: 2,
        tech: 'WebSocket servers (Elixir or Node.js)',
        description:
          'Holds an always-open WebSocket for every online device, behind a load balancer. It pushes new messages, typing indicators and call invites down those connections instantly.',
      },
      {
        id: 'api',
        label: 'REST API',
        kind: 'gateway',
        tier: 2,
        tech: 'HTTPS API (Go or Node.js)',
        description:
          'Handles everything that does not need to be instant: logging in, loading older messages as you scroll up, creating groups and uploading files.',
      },
      {
        id: 'chat',
        label: 'Message Service',
        kind: 'service',
        tier: 3,
        tech: 'Go service',
        description:
          'The heart of chat. It checks you are allowed to post in a conversation, gives each message an ID, saves it and delivers it to every member.',
      },
      {
        id: 'notify',
        label: 'Push Worker',
        kind: 'service',
        tier: 3,
        tech: 'Go worker',
        description:
          'When a member of a conversation has no device connected, this worker builds a notification and sends it through Apple or Google.',
      },
      {
        id: 'sfu',
        label: 'Call Media Server',
        kind: 'service',
        tier: 3,
        tech: 'WebRTC SFU (e.g. mediasoup, Janus or LiveKit)',
        description:
          'In group calls, each person sends their audio and video here once, and it forwards copies to everyone else. One-to-one calls can often connect device to device instead.',
      },
      {
        id: 'msgdb',
        label: 'Message Store',
        kind: 'database',
        tier: 4,
        tech: 'Apache Cassandra or ScyllaDB',
        description:
          'Billions of messages, stored grouped by conversation and sorted by time, so "the latest 50 messages in this chat" is one fast read.',
      },
      {
        id: 'redis',
        label: 'Presence & Pub/Sub',
        kind: 'cache',
        tier: 4,
        tech: 'Redis',
        description:
          'Keeps short-lived facts in memory, like who is online and who is typing, and relays new messages to whichever gateway server holds each recipient\'s connection.',
      },
      {
        id: 'pg',
        label: 'Accounts & Groups',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL',
        description: 'Users, contacts, groups and memberships. This data changes less often than messages but must always be correct.',
      },
      {
        id: 'files',
        label: 'Attachments',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3 (object storage)',
        description: 'Photos, voice notes, videos and documents. A message only stores a link to its attachment.',
      },
    ],
    edges: [
      { from: 'web', to: 'gateway', label: 'WebSocket (wss://)' },
      { from: 'mobile', to: 'gateway', label: 'WebSocket (wss://)' },
      { from: 'web', to: 'api', label: 'HTTPS' },
      { from: 'mobile', to: 'api', label: 'HTTPS' },
      { from: 'web', to: 'cdn', label: 'App code & attachments' },
      { from: 'cdn', to: 'files', label: 'Fetch on cache miss' },
      { from: 'gateway', to: 'chat', label: 'New messages' },
      { from: 'gateway', to: 'redis', label: 'Presence & subscriptions' },
      { from: 'chat', to: 'redis', label: 'Publish to members' },
      { from: 'chat', to: 'msgdb', label: 'Save message' },
      { from: 'chat', to: 'pg', label: 'Check membership' },
      { from: 'chat', to: 'notify', label: 'Offline members' },
      { from: 'notify', to: 'push', label: 'Send notification' },
      { from: 'push', to: 'mobile', label: 'Wake the phone' },
      { from: 'api', to: 'msgdb', label: 'Load older messages' },
      { from: 'api', to: 'pg', label: 'Accounts & groups' },
      { from: 'api', to: 'files', label: 'Signed upload links' },
      { from: 'web', to: 'sfu', label: 'WebRTC audio & video' },
      { from: 'mobile', to: 'turn', label: 'STUN / TURN (UDP)' },
      { from: 'turn', to: 'sfu', label: 'Relayed call media' },
    ],
    flows: [
      {
        id: 'send-message',
        title: 'You send a message',
        emoji: '💬',
        steps: [
          {
            from: 'web',
            to: 'gateway',
            narration:
              'You type and press Enter. The app shows your message right away with a little clock icon, and sends it up the WebSocket that is already open.',
          },
          { from: 'gateway', to: 'chat', narration: 'The gateway server holding your connection passes the message to the Message service.' },
          {
            from: 'chat',
            to: 'pg',
            narration: 'The Message service checks that you are a member of this conversation. The answer is usually cached, so this is very quick.',
          },
          {
            from: 'chat',
            to: 'msgdb',
            narration:
              'It gives the message a unique ID that sorts by time and saves it. Your app gets an acknowledgement and swaps the clock for a single tick.',
          },
          {
            from: 'chat',
            to: 'redis',
            narration: 'It publishes the message on each member\'s channel in Redis, a bit like shouting it into the right rooms.',
          },
          {
            from: 'redis',
            to: 'gateway',
            narration: 'Whichever gateway servers hold connections for those members are listening on their channels, and receive it instantly.',
          },
          {
            from: 'gateway',
            to: 'mobile',
            narration:
              'The message travels down your friend\'s open WebSocket and appears on their phone. Their app replies "delivered", and you see a second tick.',
          },
        ],
      },
      {
        id: 'friend-offline',
        title: 'Your friend is offline',
        emoji: '🔔',
        steps: [
          { from: 'web', to: 'gateway', narration: 'You send a message to a friend whose app is closed.' },
          { from: 'gateway', to: 'chat', narration: 'The message is checked and saved exactly as usual. Nothing is lost just because they are away.' },
          {
            from: 'chat',
            to: 'redis',
            narration:
              'The Message service checks presence. Your friend\'s phone has not sent a heartbeat recently, so no gateway is holding a connection for them.',
          },
          { from: 'chat', to: 'notify', narration: 'It asks the Push worker to notify them.' },
          {
            from: 'notify',
            to: 'push',
            narration:
              'The worker sends a short notification to Apple or Google, addressed to your friend\'s device token. Apps with end-to-end encryption send only an encrypted payload or a "new message" hint.',
          },
          { from: 'push', to: 'mobile', narration: 'Your friend\'s phone lights up with the notification, even though {{name}} was closed.' },
          {
            from: 'mobile',
            to: 'api',
            narration:
              'They tap it. The app opens, reconnects and asks the API for every message newer than the last one it has stored, so the whole conversation syncs.',
          },
        ],
      },
      {
        id: 'group-call',
        title: 'You start a group video call',
        emoji: '📹',
        steps: [
          {
            from: 'web',
            to: 'gateway',
            narration:
              'You press the video call button. Your app sends a "call invite" over its WebSocket. Messages that set up a call like this are called signaling.',
          },
          { from: 'gateway', to: 'redis', narration: 'The gateway publishes the invite on each member\'s channel.' },
          {
            from: 'redis',
            to: 'gateway',
            narration: 'The gateway servers holding your friends\' connections receive the invite, because they are listening on those channels.',
          },
          { from: 'gateway', to: 'mobile', narration: 'Your friend\'s phone rings. They tap Accept, and that answer travels back the same way.' },
          {
            from: 'web',
            to: 'sfu',
            narration:
              'Your browser connects to the call media server with WebRTC and starts sending your camera and microphone, encrypted, usually over fast UDP packets.',
          },
          {
            from: 'mobile',
            to: 'turn',
            narration:
              'Your friend is on strict campus Wi-Fi that blocks direct connections. Their phone asks a STUN server for its public address, then falls back to a TURN relay.',
          },
          {
            from: 'turn',
            to: 'sfu',
            narration:
              'The relay passes their video to the media server, which forwards each person\'s stream to everyone else, sending lower quality to anyone with a weak connection.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'services/gateway/src/server.ts', note: 'Accepts WebSocket connections and forwards messages to devices' },
    { path: 'services/gateway/src/presence.ts', note: 'Heartbeats that mark a user as online' },
    { path: 'services/messages/send.go', note: 'Saves a message and delivers it to every member' },
    { path: 'services/messages/ids.go', note: 'Creates unique message IDs that sort by time' },
    { path: 'services/push/worker.go', note: 'Turns undelivered messages into push notifications' },
    { path: 'services/api/routes/history.go', note: 'Returns older messages when you scroll up' },
    { path: 'services/api/routes/uploads.go', note: 'Hands out signed links for uploading attachments' },
    { path: 'db/cassandra/messages.cql', note: 'Message history and read-state tables' },
    { path: 'db/postgres/001_accounts_groups.sql', note: 'Users, groups and memberships' },
    { path: 'calls/sfu/config.yaml', note: 'Media server settings such as ports and bitrate limits' },
    { path: 'calls/turn/turnserver.conf', note: 'coturn relay settings for calls on strict networks' },
    { path: 'clients/web/src/realtime/socket.ts', note: 'Opens the WebSocket and reconnects when the network drops' },
    { path: 'clients/web/src/calls/peer.ts', note: 'Sets up the WebRTC connection for a call' },
    { path: 'clients/mobile/sync/MessageSync.kt', note: 'Fetches missed messages after the app reconnects' },
    { path: 'infra/k8s/gateway.yaml', note: 'Runs gateway servers behind a WebSocket-aware load balancer' },
  ],

  code: [
    {
      id: 'websocket-gateway',
      title: 'A realtime WebSocket gateway',
      file: 'services/gateway/src/server.ts',
      language: 'TypeScript',
      explanation:
        'Every online device keeps a WebSocket open to a gateway server like this one. The server remembers which sockets belong to which user and subscribes to that user\'s Redis channel, so a message published from anywhere reaches every device the user has open. A short-lived Redis key acts as presence: heartbeats keep refreshing it, and if a device vanishes it simply expires. Sending a message gets an "ack" back, which is when your app shows the first tick.',
      code: `import { WebSocketServer, type WebSocket } from 'ws';
import Redis from 'ioredis';
import { verifyToken } from './auth'; // returns the user ID inside a valid login token
import { saveMessage } from './messageClient'; // calls the Message Service

const redis = new Redis();
const subscriber = new Redis(); // a subscribing connection cannot run other commands
const devices = new Map<string, Set<WebSocket>>(); // userId -> sockets open on THIS server
subscriber.on('message', (channel, payload) => { // "user:42" -> user 42's devices here
  devices.get(channel.slice('user:'.length))?.forEach((ws) => ws.send(payload));
});

new WebSocketServer({ port: 8080 }).on('connection', (ws, req) => {
  const userId = verifyToken(new URL(req.url ?? '/', 'http://localhost').searchParams.get('token'));
  if (!userId) return ws.close(4001, 'Unauthorized');
  const mine = devices.get(userId) ?? new Set<WebSocket>();
  if (mine.size === 0) void subscriber.subscribe(\`user:\${userId}\`); // first device on this server
  devices.set(userId, mine.add(ws));
  // Presence: a key that expires 45 s after the last heartbeat.
  const heartbeat = () => void redis.set(\`presence:\${userId}\`, '1', 'EX', 45);
  heartbeat();
  const timer = setInterval(heartbeat, 20_000);
  ws.on('message', async (raw) => {
    try {
      const event = JSON.parse(raw.toString());
      if (event.type !== 'send') return;
      const saved = await saveMessage(userId, event.conversationId, event.body);
      ws.send(JSON.stringify({ type: 'ack', clientId: event.clientId, id: saved.id }));
    } catch {
      ws.send(JSON.stringify({ type: 'error', message: 'Message not sent' })); // never crash the server
    }
  });
  ws.on('close', () => {
    clearInterval(timer);
    mine.delete(ws);
    if (mine.size > 0) return; // the user still has other devices connected here
    devices.delete(userId);
    void subscriber.unsubscribe(\`user:\${userId}\`);
  });
});`,
    },
    {
      id: 'message-tables',
      title: 'Storing billions of messages',
      file: 'db/cassandra/messages.cql',
      language: 'CQL (Cassandra)',
      explanation:
        'Cassandra and ScyllaDB use a SQL-like language called CQL, but you design tables around the questions you will ask. Here, all messages for one conversation in one time bucket (say, 10 days) sit together in a partition, already sorted newest first. Opening a chat or scrolling up is a single fast read from one place. Buckets stop very busy chats from growing a single, gigantic partition; when you scroll past the start of a bucket, the app simply asks for the previous one.',
      code: `-- Messages grouped by conversation + time bucket, newest first.
CREATE TABLE messages_by_conversation (
  conversation_id text,
  bucket          int,         -- e.g. days since 2020-01-01 divided by 10
  message_id      timeuuid,    -- unique AND sortable by time
  sender_id       text,
  body            text,
  attachment_key  text,        -- file name in object storage, if any
  edited_at       timestamp,
  PRIMARY KEY ((conversation_id, bucket), message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);

-- Opening a chat: the newest 50 messages, from one partition, already sorted.
SELECT message_id, sender_id, body FROM messages_by_conversation
WHERE conversation_id = 'c42' AND bucket = 245
LIMIT 50;

-- Scrolling up: the 50 messages just older than the oldest one on screen.
SELECT message_id, sender_id, body FROM messages_by_conversation
WHERE conversation_id = 'c42' AND bucket = 245
  AND message_id < 5b6962dd-3f90-11ee-be56-0242ac120002
LIMIT 50;

-- Read receipts: how far each member has read in each conversation.
CREATE TABLE read_state (
  conversation_id text,
  user_id         text,
  last_read_id    timeuuid,
  PRIMARY KEY (conversation_id, user_id)
);`,
    },
    {
      id: 'deliver-message',
      title: 'Delivering to online and offline members',
      file: 'services/messages/send.go',
      language: 'Go',
      explanation:
        'The Message service saves a message exactly once, then fans it out. It always publishes to each member\'s Redis channel, which is cheap: if any gateway holds a connection for that person, their devices get it instantly. Then it checks presence, and members with no recent heartbeat get a push notification instead. Real systems also batch pushes, respect muted chats and retry failures, but the online-or-push decision is the core idea.',
      code: `package messages

import (
    "context"
    "encoding/json"
    "errors"
    "slices"

    "github.com/gocql/gocql"
    "github.com/redis/go-redis/v9"
)

type Service struct {
    DB    *gocql.Session
    Redis *redis.Client
    Push  func(ctx context.Context, userID string, payload []byte) // queues a push notification
}

// Send saves a message, then delivers it to members (loaded from PostgreSQL, usually cached).
func (s *Service) Send(ctx context.Context, convID, senderID, body string, members []string) (gocql.UUID, error) {
    if !slices.Contains(members, senderID) {
        return gocql.UUID{}, errors.New("sender is not in this conversation")
    }
    id := gocql.TimeUUID() // unique, and sorts by the time it was created
    if err := s.DB.Query("INSERT INTO messages_by_conversation (conversation_id, bucket, message_id, sender_id, body) VALUES (?, ?, ?, ?, ?)",
        convID, currentBucket(), id, senderID, body).WithContext(ctx).Exec(); err != nil { // bucket helper not shown
        return gocql.UUID{}, err
    }
    payload, _ := json.Marshal(map[string]string{"type": "message", "id": id.String(), "conversationId": convID, "senderId": senderID, "body": body})
    for _, userID := range members {
        // Always publish: any gateway holding this user's connections forwards it.
        s.Redis.Publish(ctx, "user:"+userID, payload)
        // No fresh heartbeat means no device is connected, so wake their phone instead.
        if userID != senderID && s.Redis.Exists(ctx, "presence:"+userID).Val() == 0 {
            s.Push(ctx, userID, payload)
        }
    }
    return id, nil
}`,
    },
  ],

  playground: {
    title: 'Chat screen',
    description:
      'A mini chat with a friend: send messages and watch the ticks go from sending to sent, delivered and read, see the typing indicator, then switch your friend\'s phone offline to see a push notification instead.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Chat</title>
<style>
:root {
  --brand: {{brand}}; /* @tweak color "My bubble color" */
  --accent: {{accent}}; /* @tweak color "Accent color" */
  --bg: #ece5dd; /* @tweak color "Chat background" */
  --radius: 16px; /* @tweak range 2 24 "Bubble roundness" */
  --text: 15px; /* @tweak range 12 20 "Text size" */
}
* { box-sizing: border-box; }
body { margin: 0; height: 100vh; display: flex; flex-direction: column; background: var(--bg); color: #111; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
button { font: inherit; border: 0; cursor: pointer; }
.appbar { padding: 6px 12px; background: var(--brand); color: var(--on-brand, #fff); font-size: 13px; font-weight: 800; }
header { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: #fff; border-bottom: 1px solid #ddd; }
.avatar { position: relative; width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; font-size: 20px; background: linear-gradient(135deg, var(--brand), var(--accent)); }
.dot { position: absolute; right: 0; bottom: 0; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; background: #2ecc71; }
.dot.off { background: #aaa; }
.who { flex: 1; }
.who b { display: block; font-size: 16px; }
.who small { color: #667; font-size: 12px; }
.icons { font-size: 18px; letter-spacing: 10px; }
.lab { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 12px; background: rgba(255,255,255,.75); font-size: 12px; }
.lab button { padding: 5px 10px; border-radius: 999px; background: #fff; font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,.2); white-space: nowrap; }
main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; }
.day { align-self: center; padding: 3px 10px; border-radius: 8px; background: rgba(255,255,255,.85); color: #555; font-size: 11px; }
.bubble { position: relative; max-width: 78%; padding: 7px 10px; border-radius: var(--radius); font-size: var(--text); line-height: 1.35; box-shadow: 0 1px 1px rgba(0,0,0,.1); cursor: pointer; }
.them { align-self: flex-start; background: #fff; border-bottom-left-radius: 4px; }
.me { align-self: flex-end; background: var(--brand); color: var(--on-brand, #fff); border-bottom-right-radius: 4px; }
.meta { float: right; margin: 7px 0 -4px 10px; font-size: 11px; opacity: .8; }
.tick { margin-left: 4px; }
.tick.read { padding: 0 3px; border-radius: 6px; background: #fff; color: var(--accent); font-weight: 700; }
.liked { margin-bottom: 12px; }
.liked::after { content: "❤️"; position: absolute; right: 8px; bottom: -13px; padding: 0 3px; border-radius: 10px; background: #fff; font-size: 12px; }
.typing { display: flex; gap: 4px; padding: 12px 14px; }
.typing[hidden] { display: none; }
.typing i { width: 7px; height: 7px; border-radius: 50%; background: #999; animation: blink 1s infinite; }
.typing i:nth-child(2) { animation-delay: .2s; }
.typing i:nth-child(3) { animation-delay: .4s; }
@keyframes blink { 50% { opacity: .2; } }
form { display: flex; gap: 8px; padding: 8px; background: #f0f0f0; }
input { flex: 1; min-width: 0; border: 0; border-radius: 999px; padding: 10px 14px; font: inherit; font-size: var(--text); }
.send { width: 44px; height: 44px; border-radius: 50%; background: var(--brand); color: var(--on-brand, #fff); font-size: 18px; }
.push { position: fixed; top: 8px; left: 8px; right: 8px; z-index: 5; padding: 10px 12px; border-radius: 14px; background: rgba(28,28,30,.94); color: #fff; font-size: 13px; box-shadow: 0 6px 20px rgba(0,0,0,.3); }
.push b { display: block; margin-bottom: 2px; }
</style>
</head>
<body>
<div class="appbar" data-edit="app">{{name}}</div>
<header>
  <div class="avatar">🧑‍💻<i class="dot" id="dot"></i></div>
  <div class="who"><b data-edit="contact">Alex</b><small id="status">online</small></div>
  <span class="icons">📞📹</span>
</header>
<div class="lab"><span data-edit="lab">Try turning your friend's phone off, then send a message</span><button id="toggle">📶 Online</button></div>
<main id="chat">
  <div class="day" data-edit="day">Today</div>
  <div class="bubble them typing" id="typing" hidden><i></i><i></i><i></i></div>
</main>
<form id="form">
  <input id="input" autocomplete="off" placeholder="Message">
  <button class="send" aria-label="Send">➤</button>
</form>
<div class="push" id="push" hidden><b>🔔 Push sent to your friend's phone</b><span id="pushText"></span></div>

<script>
const replies = ['Haha nice 😄', 'Wait, really?', 'On my way!', 'Can you send me the notes?', 'Sounds good 👍', 'brb, class is starting'];
const icons = { sending: '🕓', sent: '✓', delivered: '✓✓', read: '✓✓' };
let online = true;     // is the friend's phone connected?
let waiting = [];      // my bubbles the friend's phone has not received yet
let replyTimer, nextReply = 0;
const $ = (id) => document.getElementById(id);

// Keep text readable on any brand color: dark text on light colors, white on dark ones
const root = document.documentElement;
function syncInk() {
  const hex = getComputedStyle(root).getPropertyValue('--brand').trim();
  const n = parseInt(hex.slice(1), 16);
  const ink = hex.length === 7 && 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 165 ? '#111' : '#fff';
  if (root.style.getPropertyValue('--on-brand') !== ink) root.style.setProperty('--on-brand', ink);
}
new MutationObserver(syncInk).observe(root, { attributes: true, attributeFilter: ['style'] });
syncInk();

function addBubble(text, mine) {
  const b = document.createElement('div');
  b.className = 'bubble ' + (mine ? 'me' : 'them');
  b.innerHTML = '<span class="txt"></span><span class="meta"><span class="time"></span><span class="tick"></span></span>';
  b.querySelector('.txt').textContent = text; // textContent: typed HTML is shown, never run
  const now = new Date();
  b.querySelector('.time').textContent = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
  b.onclick = () => b.classList.toggle('liked'); // tap a bubble to react
  $('chat').insertBefore(b, $('typing'));
  $('chat').scrollTop = $('chat').scrollHeight;
  return b;
}

function setTick(b, state) {
  const t = b.querySelector('.tick');
  t.textContent = icons[state];
  t.className = 'tick ' + state;
}

function send(text) {
  const b = addBubble(text, true);
  setTick(b, 'sending');               // shown instantly, before the server answers
  setTimeout(() => {
    setTick(b, 'sent');                // the server saved it and sent back an "ack"
    if (online) deliver([b]);
    else { waiting.push(b); showPush(text); }
  }, 500);
}

function deliver(bubbles) {
  setTimeout(() => {
    bubbles.forEach((b) => setTick(b, 'delivered'));  // friend's phone received it
    setTimeout(() => {
      bubbles.forEach((b) => setTick(b, 'read'));     // friend opened the chat
      friendReplies();
    }, 900);
  }, 600);
}

function friendReplies() {
  clearTimeout(replyTimer);
  replyTimer = setTimeout(() => {
    if (!online) return;
    $('typing').hidden = false;          // "typing..." is a tiny event, never saved
    $('status').textContent = 'typing…';
    $('chat').scrollTop = $('chat').scrollHeight;
    replyTimer = setTimeout(() => {
      $('typing').hidden = true;
      $('status').textContent = online ? 'online' : 'last seen just now';
      if (online) addBubble(replies[nextReply++ % replies.length], false); // take turns through the list
    }, 1600);
  }, 700);
}

function showPush(text) {
  $('pushText').textContent = 'You: ' + text;
  $('push').hidden = false;
  clearTimeout(showPush.timer);
  showPush.timer = setTimeout(() => { $('push').hidden = true; }, 2600);
}

// Presence: pretend the friend's phone connects or disconnects
$('toggle').onclick = () => {
  online = !online;
  $('toggle').textContent = online ? '📶 Online' : '📴 Offline';
  $('dot').classList.toggle('off', !online);
  $('typing').hidden = true;
  $('status').textContent = online ? 'online' : 'last seen just now';
  if (online && waiting.length) { deliver(waiting); waiting = []; } // reconnect = sync missed messages
};

$('form').onsubmit = (e) => {
  e.preventDefault();
  const text = $('input').value.trim();
  if (text) send(text);
  $('input').value = '';
};

// Starting conversation
addBubble('Hey! Are you coming to the study session?', false);
setTick(addBubble('Yes! Be there at 6', true), 'read');
friendReplies();
</script>
</body>
</html>`,
    challenges: [
      'Send a message and watch the icon change: 🕓 sending, ✓ saved by the server, ✓✓ delivered, then highlighted ✓✓ when read.',
      'Tap "📶 Online" to take your friend offline, send two messages, then bring them back online. Notice both messages get delivered at once, like a phone syncing after reconnecting.',
      'Add your own lines to the replies array, then make your friend reply with the same text you sent if it ends with a question mark.',
      'Add a "sent 5 seconds ago" style label: store each bubble\'s send time and update it every second with setInterval.',
    ],
  },

  concepts: [
    {
      term: 'WebSocket',
      meaning:
        'A connection between app and server that stays open, so either side can send data at any moment. It is what makes new messages appear without refreshing.',
    },
    {
      term: 'Presence & heartbeats',
      meaning:
        'Knowing who is online. Each connected device sends a small "still here" signal every few seconds, and a user who stops sending them is marked offline.',
    },
    {
      term: 'Pub/sub',
      meaning:
        'Publish/subscribe: senders publish messages to a named channel, and anyone subscribed to that channel receives them, without senders knowing who is listening.',
    },
    {
      term: 'Acknowledgements & receipts',
      meaning:
        'Small replies confirming each step: the server saved your message (sent), the other device received it (delivered) and the person saw it (read).',
    },
    {
      term: 'Push notifications',
      meaning:
        'Alerts delivered through Apple or Google that can wake a phone and show a message even when the app is not running.',
    },
    {
      term: 'End-to-end encryption',
      meaning:
        'Messages are encrypted on the sender\'s device and can only be decrypted on the recipient\'s device, so the servers in between only ever see scrambled data.',
    },
    {
      term: 'WebRTC',
      meaning:
        'A browser and mobile standard for real-time audio, video and data. It handles microphones, cameras, encryption and finding a network path, with help from STUN and TURN servers.',
    },
    {
      term: 'Partitioning',
      meaning:
        'Storing related rows together, such as one conversation\'s messages, so they can be read in one quick lookup, and so data can be spread over many machines.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Start with a WebSocket server',
      detail:
        'Create a Node.js project with the ws or Socket.IO library. Make an echo server first: whatever a client sends, send it to every connected client.',
    },
    {
      step: 'Build the chat screen',
      detail:
        'Make a page with a message list and an input. Send JSON like {"type":"message","text":"hi"} and add a bubble whenever one arrives.',
    },
    {
      step: 'Save messages in a database',
      detail:
        'Store messages in PostgreSQL or SQLite with a room ID and timestamp, and load the latest 50 when someone opens a room. Supabase Realtime can handle this for you too.',
    },
    {
      step: 'Add accounts and rooms',
      detail:
        'Add sign-in (Supabase Auth or Firebase Authentication), let users create rooms, and only send each message to members of its room.',
    },
    {
      step: 'Add presence, typing and receipts',
      detail:
        'Track who is connected, broadcast short-lived "typing" events, and send an acknowledgement back so the sender sees a tick.',
    },
    {
      step: 'Try a video call and deploy',
      detail:
        'Build a one-to-one call with the browser WebRTC API or a hosted service like LiveKit Cloud, then deploy on Render or Fly.io, which support long-lived WebSocket connections.',
    },
  ],
};
