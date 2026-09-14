import type { Teardown } from '../types';

export const discord: Teardown = {
  id: 'discord',
  name: 'Discord',
  url: 'discord.com',
  tagline: 'Group chat, voice and video for communities and friends',
  category: 'Communication',
  brandColor: '#5865F2',
  accentColor: '#EB459E',
  logoGlyph: '🎮',
  source: 'curated',

  eli5:
    'Discord is a collection of clubhouses (servers), each with rooms (channels) that are either group chats or live voice calls. When you open the app it keeps a line open to Discord’s computers (a WebSocket), so a friend’s message is pushed to your screen the instant it’s sent instead of your app asking “anything new?” over and over. Behind the scenes, every server gets its own tiny worker program that forwards events to its members, and messages are saved in a giant database split up by channel and by time.',

  facts: [
    { label: 'Launched', value: 'May 2015' },
    { label: 'Founders', value: 'Jason Citron & Stanislav Vishnevskiy' },
    { label: 'Headquarters', value: 'San Francisco, California' },
    { label: 'Servers are called', value: '“Guilds” in the code and API' },
    { label: 'Real-time engine', value: 'Elixir on the Erlang VM' },
    { label: 'Messages stored', value: 'Trillions, in ScyllaDB' },
    { label: 'Message IDs', value: '64-bit “snowflakes” that encode the time' },
  ],

  history: [
    {
      year: '2011',
      title: 'OpenFeint is sold',
      detail:
        'Jason Citron’s earlier company OpenFeint, a social network for mobile games, was acquired by the Japanese company GREE.',
    },
    {
      year: '2012',
      title: 'Hammer & Chisel is founded',
      detail:
        'Citron started a game studio called Hammer & Chisel, with Stanislav Vishnevskiy joining as co-founder and CTO.',
    },
    {
      year: '2014',
      title: 'Fates Forever',
      detail:
        'The studio released Fates Forever, a multiplayer battle game for tablets. It wasn’t a hit, but the team noticed how clunky voice chat was for gamers and pivoted.',
    },
    {
      year: '2015',
      title: 'Discord launches',
      detail:
        'Discord launched in May 2015 as a free voice and text chat app for gamers, pitched as an easier alternative to tools like Skype and TeamSpeak.',
    },
    {
      year: '2017',
      title: 'Nitro and billions of messages',
      detail:
        'Discord launched Nitro, a paid subscription with perks like animated avatars. Its engineering blog also explained how it stores billions of messages in Cassandra after outgrowing MongoDB.',
    },
    {
      year: '2020',
      title: 'Read States moves from Go to Rust',
      detail:
        'An engineering post explained that the service tracking unread messages was rewritten from Go to Rust, removing lag spikes caused by Go’s garbage collector.',
    },
    {
      year: '2020',
      title: '“Your place to talk”',
      detail:
        'As people stayed home during the COVID-19 pandemic, classes, clubs and friend groups flooded in. Discord rebranded around “Your place to talk” to welcome communities beyond gaming.',
    },
    {
      year: '2021',
      title: 'Says no to Microsoft',
      detail:
        'Discord reportedly held acquisition talks with Microsoft but chose to stay independent. The same year it refreshed its logo and signature “blurple” color.',
    },
    {
      year: '2023',
      title: 'Trillions of messages on ScyllaDB',
      detail:
        'An engineering post described moving trillions of messages from Cassandra to ScyllaDB, with new Rust “data services” in front of the database. The cluster shrank from 177 nodes to 72.',
    },
    {
      year: '2023',
      title: 'Goodbye, #1234',
      detail:
        'Discord began replacing name-plus-number tags like wumpus#1234 with unique usernames, a big change to how accounts are identified.',
    },
  ],

  languages: [
    { name: 'TypeScript / JavaScript', usedFor: 'Desktop, web and mobile apps (React, React Native, Electron)', share: 30 },
    { name: 'Elixir', usedFor: 'Real-time gateway, guild processes and voice signaling', share: 25 },
    { name: 'Python', usedFor: 'Main REST API and background jobs', share: 20 },
    { name: 'Rust', usedFor: 'Speed-critical services like Read States and data services', share: 15 },
    { name: 'C++', usedFor: 'Voice and video media servers', share: 10 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'React',
          role: 'UI for desktop and web',
          beginnerNote:
            'React builds the screen out of small reusable pieces, like LEGO bricks for a message row, a channel list and an avatar.',
          confidence: 'confirmed',
        },
        {
          name: 'Electron',
          role: 'Desktop app wrapper',
          beginnerNote:
            'Electron bundles a mini Chromium browser with the app, so the same web code runs as a Windows, Mac or Linux program.',
          confidence: 'confirmed',
        },
        {
          name: 'TypeScript',
          role: 'Typed JavaScript',
          beginnerNote:
            'TypeScript is JavaScript with labels on your data, so mistakes like passing a number where text belongs are caught before the app runs.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Mobile',
      items: [
        {
          name: 'React Native',
          role: 'iOS and Android apps',
          beginnerNote:
            'React Native lets developers write the app once in JavaScript and turn it into real iPhone and Android apps that share code with desktop.',
          confidence: 'confirmed',
        },
        {
          name: 'Swift & Kotlin',
          role: 'Native phone features',
          beginnerNote:
            'Some jobs, like ringing your phone for a call, need the phone’s own language, so small native modules plug into the React Native app.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Elixir',
          role: 'Real-time gateway',
          beginnerNote:
            'Elixir runs on the Erlang virtual machine, originally built for telephone switches, which can juggle millions of tiny processes at once.',
          confidence: 'confirmed',
        },
        {
          name: 'Python',
          role: 'Main REST API',
          beginnerNote:
            'Python is quick to write and easy to read, so it powers everyday “do something” requests like sending a message or creating a channel.',
          confidence: 'confirmed',
        },
        {
          name: 'Rust',
          role: 'Speed-critical services',
          beginnerNote:
            'Rust is about as fast as C++, but its compiler catches memory mistakes before the program ever runs.',
          confidence: 'confirmed',
        },
        {
          name: 'Go',
          role: 'Earlier services',
          beginnerNote:
            'Go powered services like Read States until its garbage collector (the language pausing to clean up memory) caused lag, which pushed Discord toward Rust.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'ScyllaDB',
          role: 'Stores trillions of messages',
          beginnerNote:
            'ScyllaDB is a C++ rewrite of Cassandra that speaks the same query language, so Discord could switch databases and keep its table designs.',
          confidence: 'confirmed',
        },
        {
          name: 'Apache Cassandra',
          role: 'Previous message database',
          beginnerNote:
            'Cassandra spreads one huge table across many machines and handles tons of writes, which is why Discord moved messages to it from MongoDB early on.',
          confidence: 'confirmed',
        },
        {
          name: 'Elasticsearch',
          role: 'Message search',
          beginnerNote:
            'Elasticsearch builds an index like the one at the back of a textbook, so finding every message that says “pizza” doesn’t mean reading them all.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Google Cloud',
          role: 'Hosting',
          beginnerNote:
            'Instead of owning buildings full of computers, Discord rents servers, networking and storage from Google.',
          confidence: 'confirmed',
        },
        {
          name: 'WebRTC',
          role: 'Voice and video transport',
          beginnerNote:
            'WebRTC is a standard for sending live audio and video between devices with very little delay, used by many video-call apps.',
          confidence: 'confirmed',
        },
        {
          name: 'C++ media servers (SFU)',
          role: 'Forward call audio and video',
          beginnerNote:
            'A Selective Forwarding Unit receives your audio once and copies it to everyone else, so your phone doesn’t upload separately to each friend.',
          confidence: 'confirmed',
        },
        {
          name: 'CDN',
          role: 'Fast images and files',
          beginnerNote:
            'A content delivery network keeps copies of avatars and attachments in data centers worldwide, so pictures load from somewhere close to you.',
          confidence: 'likely',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'desktop-app',
        label: 'Desktop & web app',
        kind: 'client',
        tier: 0,
        tech: 'React + Electron',
        description:
          'The app on your computer or in your browser. It draws servers, channels and messages, and keeps a live connection open so new messages appear instantly.',
      },
      {
        id: 'mobile-app',
        label: 'Mobile app',
        kind: 'client',
        tier: 0,
        tech: 'React Native',
        description:
          'The iPhone and Android app. It shares much of its logic with the desktop app and talks to exactly the same backend.',
      },
      {
        id: 'load-balancer',
        label: 'Load balancer',
        kind: 'edge',
        tier: 1,
        tech: 'Cloud load balancing',
        description:
          'Spreads incoming API requests across many identical API servers so no single machine gets overwhelmed.',
      },
      {
        id: 'cdn',
        label: 'Media CDN',
        kind: 'edge',
        tier: 1,
        tech: 'Content delivery network',
        description:
          'Keeps copies of avatars, emoji and uploaded files close to users around the world, so images load quickly.',
      },
      {
        id: 'api',
        label: 'REST API',
        kind: 'service',
        tier: 2,
        tech: 'Python',
        description:
          'Handles “do something” requests: send a message, create a channel, upload a file. It checks permissions, saves the data, then announces what happened.',
      },
      {
        id: 'gateway',
        label: 'Real-time gateway',
        kind: 'gateway',
        tier: 2,
        tech: 'Elixir (WebSockets)',
        description:
          'Holds an always-open WebSocket for every online user and pushes events like new messages, typing indicators and who’s online.',
      },
      {
        id: 'guild-process',
        label: 'Guild processes',
        kind: 'service',
        tier: 3,
        tech: 'Elixir on the Erlang VM (BEAM)',
        description:
          'Each Discord server (called a “guild” in the code) gets its own lightweight process that knows who is connected and fans events out to them.',
      },
      {
        id: 'read-states',
        label: 'Read States',
        kind: 'service',
        tier: 3,
        tech: 'Rust',
        description:
          'Remembers the last message you read in every channel. This powers unread channel highlights and red @mention badges.',
      },
      {
        id: 'data-services',
        label: 'Data services',
        kind: 'service',
        tier: 3,
        tech: 'Rust',
        description:
          'A layer between the API and the database that routes queries by channel and merges identical requests, shielding the database from traffic spikes.',
      },
      {
        id: 'voice-servers',
        label: 'Voice servers',
        kind: 'service',
        tier: 3,
        tech: 'WebRTC media servers (C++)',
        description:
          'Receive your microphone or camera stream and forward it to everyone else in the call with as little delay as possible.',
      },
      {
        id: 'db',
        label: 'Message database',
        kind: 'database',
        tier: 4,
        tech: 'ScyllaDB (formerly Cassandra)',
        description:
          'A cluster of machines holding trillions of messages and other high-volume data. Messages are split into partitions by channel and time window so each lookup stays small.',
      },
      {
        id: 'search-index',
        label: 'Search index',
        kind: 'database',
        tier: 4,
        tech: 'Elasticsearch',
        description:
          'A separate copy of message text organized for searching, so finding old messages by word or author is fast.',
      },
      {
        id: 'object-storage',
        label: 'File storage',
        kind: 'storage',
        tier: 4,
        tech: 'Cloud object storage',
        description:
          'Holds uploaded images, videos and files. The CDN fetches from here the first time someone asks for a file.',
      },
    ],
    edges: [
      { from: 'desktop-app', to: 'load-balancer', label: 'HTTPS (REST)' },
      { from: 'mobile-app', to: 'load-balancer', label: 'HTTPS (REST)' },
      { from: 'load-balancer', to: 'api', label: 'HTTPS' },
      { from: 'desktop-app', to: 'gateway', label: 'WebSocket' },
      { from: 'mobile-app', to: 'gateway', label: 'WebSocket' },
      { from: 'desktop-app', to: 'cdn', label: 'images & files' },
      { from: 'mobile-app', to: 'cdn', label: 'images & files' },
      { from: 'cdn', to: 'object-storage', label: 'fetch on cache miss' },
      { from: 'gateway', to: 'guild-process', label: 'subscribe / events' },
      { from: 'api', to: 'guild-process', label: 'publish events' },
      { from: 'api', to: 'data-services', label: 'read / write messages' },
      { from: 'data-services', to: 'db', label: 'CQL queries' },
      { from: 'api', to: 'read-states', label: 'mark as read' },
      { from: 'gateway', to: 'read-states', label: 'unread counts' },
      { from: 'read-states', to: 'db', label: 'save read markers' },
      { from: 'api', to: 'search-index', label: 'index & search' },
      { from: 'api', to: 'object-storage', label: 'save uploads' },
      { from: 'guild-process', to: 'voice-servers', label: 'assign voice server' },
      { from: 'desktop-app', to: 'voice-servers', label: 'WebRTC (UDP)' },
      { from: 'mobile-app', to: 'voice-servers', label: 'WebRTC (UDP)' },
    ],
    flows: [
      {
        id: 'send-message',
        title: 'You send a message',
        emoji: '💬',
        steps: [
          {
            from: 'desktop-app',
            to: 'load-balancer',
            narration:
              'You type “gg!” and press Enter. The app sends it as an HTTPS request to POST /channels/{id}/messages.',
          },
          {
            from: 'load-balancer',
            to: 'api',
            narration:
              'The load balancer picks one of many identical Python API servers that isn’t too busy and hands it the request.',
          },
          {
            from: 'api',
            to: 'data-services',
            narration:
              'The API checks you’re allowed to post here, gives the message a snowflake ID, and asks the Rust data service to save it.',
          },
          {
            from: 'data-services',
            to: 'db',
            narration:
              'The data service writes the message into ScyllaDB, inside the partition for this channel’s current 10-day time bucket.',
          },
          {
            from: 'api',
            to: 'guild-process',
            narration:
              'Now the API announces a MESSAGE_CREATE event to the Elixir process that represents your server.',
          },
          {
            from: 'guild-process',
            to: 'gateway',
            narration:
              'The guild process fans the event out to the gateway session of every member who is online right now.',
          },
          {
            from: 'gateway',
            to: 'mobile-app',
            narration:
              'Your friend’s phone already has a WebSocket open, so the message is pushed down it and pops up instantly, no refresh needed.',
          },
        ],
      },
      {
        id: 'join-voice',
        title: 'You join a voice channel',
        emoji: '🎙️',
        steps: [
          {
            from: 'desktop-app',
            to: 'gateway',
            narration:
              'You click a voice channel. The app sends a small “voice state update” over the WebSocket it already has open.',
          },
          {
            from: 'gateway',
            to: 'guild-process',
            narration:
              'The gateway passes it to your server’s guild process, which keeps track of who is sitting in each voice channel.',
          },
          {
            from: 'guild-process',
            to: 'voice-servers',
            narration:
              'The guild process picks a voice server in a nearby region with room to spare and reserves a spot for the call.',
          },
          {
            from: 'guild-process',
            to: 'gateway',
            narration:
              'It sends back that voice server’s address and a one-time token, and tells everyone in the server that you joined.',
          },
          {
            from: 'gateway',
            to: 'desktop-app',
            narration:
              'Your app receives the address and token, and your avatar shows up under the voice channel for everyone.',
          },
          {
            from: 'desktop-app',
            to: 'voice-servers',
            narration:
              'Your app opens a WebRTC connection straight to the voice server and starts streaming your microphone audio.',
          },
          {
            from: 'voice-servers',
            to: 'mobile-app',
            narration:
              'The voice server forwards your audio to each friend in the channel, so they hear you with very little delay.',
          },
        ],
      },
      {
        id: 'open-app',
        title: 'You open the app and your servers load',
        emoji: '🚀',
        steps: [
          {
            from: 'mobile-app',
            to: 'gateway',
            narration:
              'You open Discord. The app connects a WebSocket to the gateway, gets a “Hello”, and replies with “Identify” plus your login token.',
          },
          {
            from: 'gateway',
            to: 'guild-process',
            narration:
              'Your gateway session subscribes to the guild process of every server you’re in and collects channels, roles and who’s online.',
          },
          {
            from: 'gateway',
            to: 'read-states',
            narration:
              'The gateway asks the Rust Read States service where you left off in each channel, so it knows which ones are unread.',
          },
          {
            from: 'gateway',
            to: 'mobile-app',
            narration:
              'A READY event arrives, followed by details for each server. Your server list, channel names and red @mention badges appear.',
          },
          {
            from: 'mobile-app',
            to: 'cdn',
            narration:
              'The app requests server icons and friends’ avatars from the CDN, which usually has a copy stored nearby.',
          },
          {
            from: 'cdn',
            to: 'object-storage',
            narration:
              'If the CDN doesn’t have a picture yet, it fetches it once from file storage and keeps a copy for the next person.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'client/src/App.tsx', note: 'Root React component: server rail, channel list and chat area' },
    { path: 'client/src/gateway/GatewaySocket.ts', note: 'Opens the WebSocket, sends heartbeats, reconnects' },
    { path: 'client/src/stores/MessageStore.ts', note: 'Keeps loaded messages per channel in memory' },
    { path: 'client/src/components/chat/MessageList.tsx', note: 'Scrollable list of messages with avatars' },
    { path: 'client/src/components/chat/MessageInput.tsx', note: 'The “Message #general” box and send logic' },
    { path: 'client/src/components/guilds/GuildRail.tsx', note: 'Left column of round server icons' },
    { path: 'client/src/voice/VoiceConnection.ts', note: 'Sets up WebRTC audio for voice channels' },
    { path: 'desktop/main.js', note: 'Electron entry: creates the window, tray icon and notifications' },
    { path: 'mobile/src/screens/ChannelScreen.tsx', note: 'React Native screen for one channel' },
    { path: 'api/routes/messages.py', note: 'REST endpoints to send, edit and fetch messages' },
    { path: 'api/utils/snowflake.py', note: 'Generates time-ordered 64-bit IDs and time buckets' },
    { path: 'gateway/lib/gateway/session.ex', note: 'One process per connected user’s WebSocket' },
    { path: 'gateway/lib/gateway/guild.ex', note: 'One process per server that fans out events' },
    { path: 'read_states/src/cache.rs', note: 'In-memory cache of unread markers and mention counts' },
    { path: 'data_services/src/router.rs', note: 'Routes message queries by channel and merges duplicates' },
    { path: 'db/schema/messages.cql', note: 'Messages table partitioned by channel and time bucket' },
    { path: 'voice/sfu/src/forwarder.cpp', note: 'Forwards audio and video packets to call members' },
  ],

  code: [
    {
      id: 'guild-genserver',
      title: 'A guild as an Elixir process',
      file: 'gateway/lib/gateway/guild.ex',
      language: 'Elixir',
      explanation:
        'In Elixir, each server (guild) can be its own GenServer: a tiny process with private state that handles one message at a time, so there are no locks or race conditions. When a new message is published, the guild process forwards it to every connected member’s session process. If someone disconnects, Process.monitor delivers a :DOWN message so the guild stops sending to them.',
      code: `defmodule Gateway.Guild do
  use GenServer

  # Every Discord server ("guild") runs as its own lightweight process.
  def start_link(guild_id) do
    GenServer.start_link(__MODULE__, guild_id, name: via(guild_id))
  end

  def join(guild_id, session_pid), do: GenServer.call(via(guild_id), {:join, session_pid})
  def publish(guild_id, event), do: GenServer.cast(via(guild_id), {:publish, event})

  @impl true
  def init(guild_id) do
    {:ok, %{id: guild_id, sessions: MapSet.new()}}
  end

  @impl true
  def handle_call({:join, pid}, _from, state) do
    # Get a :DOWN message if this user's connection process dies.
    Process.monitor(pid)
    {:reply, :ok, %{state | sessions: MapSet.put(state.sessions, pid)}}
  end

  @impl true
  def handle_cast({:publish, event}, state) do
    # Fan-out: copy the event to every connected member's session.
    Enum.each(state.sessions, fn pid -> send(pid, {:dispatch, event}) end)
    {:noreply, state}
  end

  @impl true
  def handle_info({:DOWN, _ref, :process, pid, _reason}, state) do
    {:noreply, %{state | sessions: MapSet.delete(state.sessions, pid)}}
  end

  defp via(guild_id), do: {:via, Registry, {Gateway.GuildRegistry, guild_id}}
end`,
    },
    {
      id: 'create-message-api',
      title: 'Sending a message through the API',
      file: 'api/routes/messages.py',
      language: 'Python',
      explanation:
        'The REST API handles actions like sending a message: validate the input, check permissions, save it, then announce it. Saving and broadcasting are separate steps, because the database keeps the history while the real-time gateway handles delivery to people who are online. IDs are sent as strings because JavaScript numbers can’t exactly hold 64-bit integers.',
      code: `from flask import Flask, abort, g, jsonify, request

from api.db import channels, messages
from api.gateway import publish
from api.permissions import can_send_messages
from api.utils.snowflake import make_bucket, new_snowflake

app = Flask(__name__)
MAX_LENGTH = 2000


@app.post("/channels/<int:channel_id>/messages")
def create_message(channel_id: int):
    user = g.current_user  # filled in earlier by the login middleware
    channel = channels.get_or_404(channel_id)
    content = (request.get_json(silent=True) or {}).get("content", "").strip()

    if not content or len(content) > MAX_LENGTH:
        abort(400, description="Messages must be 1-2000 characters.")
    if not can_send_messages(user, channel):
        abort(403)

    message_id = new_snowflake()  # unique, and encodes when it was created
    messages.insert(
        channel_id=channel.id,
        bucket=make_bucket(message_id),  # which 10-day partition it belongs to
        message_id=message_id,
        author_id=user.id,
        content=content,
    )

    payload = {
        "id": str(message_id),
        "channel_id": str(channel.id),
        "author": {"id": str(user.id), "username": user.username},
        "content": content,
    }
    # Hand off to the real-time side so online members see it instantly.
    publish(guild_id=channel.guild_id, event="MESSAGE_CREATE", data=payload)
    return jsonify(payload), 201`,
    },
    {
      id: 'messages-table',
      title: 'Messages partitioned by channel and time',
      file: 'db/schema/messages.cql',
      language: 'CQL',
      explanation:
        'Discord’s engineering blog describes a messages table whose partition key is the channel plus a 10-day time “bucket”, with messages sorted newest-first by snowflake ID. Loading a channel reads one small, tidy partition instead of searching the whole database, and no partition grows forever. ScyllaDB speaks the same CQL language as Cassandra, so this design survived the database migration.',
      code: `-- One partition = one channel's messages from one 10-day window.
CREATE TABLE messages (
  channel_id  bigint,
  bucket      int,
  message_id  bigint,
  author_id   bigint,
  content     text,
  edited_at   timestamp,
  PRIMARY KEY ((channel_id, bucket), message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);

-- Open #general: grab the 50 newest messages in the current bucket.
SELECT message_id, author_id, content
FROM messages
WHERE channel_id = 1100000000000000001
  AND bucket = 427
LIMIT 50;

-- Scroll up: fetch 50 messages older than the oldest one on screen.
SELECT message_id, author_id, content
FROM messages
WHERE channel_id = 1100000000000000001
  AND bucket = 427
  AND message_id < 1550000000000000000
LIMIT 50;

-- Send a message: a single small write into the right partition.
INSERT INTO messages (channel_id, bucket, message_id, author_id, content)
VALUES (1100000000000000001, 427, 1550000000012345678, 42, 'gg everyone!');`,
    },
    {
      id: 'read-states-cache',
      title: 'Tracking unread messages in Rust',
      file: 'read_states/src/cache.rs',
      language: 'Rust',
      explanation:
        'Read States remembers, for every user and channel, the last message you read and how many times you were @mentioned. Keeping this in an in-memory cache means most checks never touch the database, and changed entries are saved later in batches. Rust gives C++-level speed without a garbage collector, which removed the periodic lag spikes Discord saw in the old Go version.',
      code: `use std::collections::HashMap;
type Key = (u64, u64); // (user_id, channel_id)

/// For one user in one channel: how far have they read?
#[derive(Clone, Copy, Debug, Default)]
pub struct ReadState {
    pub last_read_id: u64, // snowflake ID of the last message seen
    pub mentions: u32,     // the number on the red @mention badge
}

#[derive(Default)]
pub struct ReadStateCache {
    states: HashMap<Key, ReadState>,
    dirty: Vec<Key>, // changed entries waiting to be saved
}

impl ReadStateCache {
    pub fn add_mention(&mut self, key: Key) { // a new message @mentions this user
        self.states.entry(key).or_default().mentions += 1;
        self.dirty.push(key);
    }

    /// The user scrolled to the bottom: everything up to message_id is read.
    pub fn ack(&mut self, key: Key, message_id: u64) {
        let state = self.states.entry(key).or_default();
        if message_id > state.last_read_id {
            state.last_read_id = message_id;
            state.mentions = 0;
            self.dirty.push(key);
        }
    }

    /// A background task calls this every few seconds and batch-writes the result.
    pub fn take_dirty(&mut self) -> Vec<(Key, ReadState)> {
        let mut keys = std::mem::take(&mut self.dirty);
        keys.sort_unstable();
        keys.dedup();
        keys.into_iter().filter_map(|k| self.states.get(&k).map(|s| (k, *s))).collect()
    }
}`,
    },
    {
      id: 'gateway-client',
      title: 'Staying connected to the gateway',
      file: 'client/src/gateway/GatewaySocket.ts',
      language: 'TypeScript',
      explanation:
        'After the gateway says Hello, the client identifies itself and then sends a heartbeat on a timer so the server knows the connection is still alive. Everything else arrives as “dispatch” events like READY or MESSAGE_CREATE. Discord publicly documents this same protocol for bot developers, so the opcodes here are real.',
      code: `// Every gateway payload has an opcode (op), data (d), sequence (s) and event type (t).
type Payload = { op: number; d: any; s: number | null; t: string | null };

const OP = { DISPATCH: 0, HEARTBEAT: 1, IDENTIFY: 2, HELLO: 10, HEARTBEAT_ACK: 11 };

export function connectGateway(token: string, onEvent: (type: string, data: any) => void) {
  const ws = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json');
  let lastSeq: number | null = null;
  let heartbeat: ReturnType<typeof setInterval> | undefined;

  const send = (op: number, d: unknown) => ws.send(JSON.stringify({ op, d }));

  ws.onmessage = (msg) => {
    const payload: Payload = JSON.parse(msg.data);
    if (payload.s !== null) lastSeq = payload.s; // remember our place in the stream

    switch (payload.op) {
      case OP.HELLO:
        // The server tells us how often to prove we're still here.
        heartbeat = setInterval(() => send(OP.HEARTBEAT, lastSeq), payload.d.heartbeat_interval);
        send(OP.IDENTIFY, {
          token,
          intents: 513, // GUILDS + GUILD_MESSAGES: which events we want
          properties: { os: 'linux', browser: 'teardown', device: 'teardown' },
        });
        break;
      case OP.HEARTBEAT_ACK:
        break; // the connection is healthy
      case OP.DISPATCH:
        // Real events: READY, GUILD_CREATE, MESSAGE_CREATE, TYPING_START...
        if (payload.t) onEvent(payload.t, payload.d);
        break;
    }
  };

  ws.onclose = () => clearInterval(heartbeat);
  return () => ws.close(); // call this to disconnect
}`,
    },
  ],

  playground: {
    title: 'Mini Discord channel',
    description:
      'A dark-mode Discord channel. Send a message, watch a friend reply, tap reactions and switch between server icons.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mini Discord</title>
<style>
  :root {
    --brand: #5865F2; /* @tweak color "Brand color" */
    --bg: #313338; /* @tweak color "Chat background" */
    --rail: #1E1F22; /* @tweak color "Server rail color" */
    --text: #DBDEE1; /* @tweak color "Message text color" */
    --avatar: 38px; /* @tweak range 24 56 "Avatar size" */
    --radius: 8px; /* @tweak range 0 24 "Corner radius" */
  }
  * { box-sizing: border-box; }
  body { margin: 0; height: 100vh; display: flex; overflow: hidden; background: var(--bg); color: var(--text); font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }

  /* Left strip of round server icons */
  .rail { width: 60px; flex: none; background: var(--rail); display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 10px 0; }
  .server { width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; background: var(--bg); font-size: 20px; cursor: pointer; transition: border-radius .2s, background .2s; }
  .server:hover, .server.active { border-radius: var(--radius); background: var(--brand); }

  /* Chat column: header, messages, typing line, input */
  .chat { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  header { padding: 10px 14px; border-bottom: 1px solid rgba(0,0,0,.35); }
  .server-name { font-size: 11px; text-transform: uppercase; letter-spacing: .5px; opacity: .6; }
  .hash { opacity: .5; margin-right: 4px; font-weight: 700; }
  .channel { font-weight: 700; color: #fff; }
  .topic { font-size: 12px; opacity: .6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .messages { flex: 1; overflow-y: auto; padding: 8px 0; }
  .welcome { margin: 8px 14px 14px; font-size: 20px; font-weight: 800; color: #fff; }
  .msg { display: flex; gap: 10px; padding: 6px 14px; }
  .msg:hover { background: rgba(0,0,0,.1); }
  .avatar { width: var(--avatar); height: var(--avatar); flex: none; border-radius: 50%; display: grid; place-items: center; color: #fff; font-weight: 700; }
  .name { font-weight: 600; color: #fff; }
  .time { font-size: 11px; opacity: .5; margin-left: 6px; }
  .text { margin-top: 2px; line-height: 1.35; overflow-wrap: anywhere; }
  .reaction { margin-top: 6px; display: inline-flex; gap: 5px; align-items: center; padding: 2px 8px; font: inherit; font-size: 13px; color: var(--text); background: var(--rail); border: 1px solid transparent; border-radius: var(--radius); cursor: pointer; }
  .reaction.mine { border-color: var(--brand); color: #fff; }
  .typing { height: 18px; padding: 0 14px; font-size: 12px; opacity: .7; }
  form { display: flex; gap: 8px; margin: 0 12px 12px; padding: 6px 6px 6px 12px; background: var(--rail); border-radius: var(--radius); }
  input { flex: 1; min-width: 0; background: transparent; border: 0; outline: 0; color: var(--text); font-size: 15px; }
  .send { border: 0; padding: 8px 12px; border-radius: var(--radius); background: var(--brand); color: #fff; font-weight: 600; cursor: pointer; }
</style>
</head>
<body>
  <nav class="rail">
    <div class="server active" title="Teardown Club">🛠️</div>
    <div class="server" title="Gaming">🎮</div>
    <div class="server" title="Study group">📚</div>
    <div class="server" title="Add a server">➕</div>
  </nav>
  <main class="chat">
    <header>
      <div class="server-name" data-edit="server">Teardown Club</div>
      <div><span class="hash">#</span><span class="channel" data-edit="channel">general</span></div>
      <div class="topic" data-edit="topic">Say hi and share what you are building</div>
    </header>
    <section class="messages" id="messages">
      <div class="welcome" data-edit="welcome">Welcome to the server!</div>
    </section>
    <div class="typing" id="typing"></div>
    <form id="composer">
      <input id="input" placeholder="Message #general" autocomplete="off">
      <button class="send" type="submit">Send</button>
    </form>
  </main>

<script>
  var list = document.getElementById('messages');
  var input = document.getElementById('input');
  var typing = document.getElementById('typing');
  var colors = { Wumpus: '#EB459E', Clyde: '#23A55A', You: 'var(--brand)' };
  var replies = ['Nice one! 🎉', 'Haha, same 😂', 'Wait, how did you build that?', 'Welcome aboard! 👋'];

  // A reaction chip: tap to add or remove your reaction
  function makeReaction(emoji, count) {
    var chip = document.createElement('button');
    chip.className = 'reaction';
    chip.innerHTML = '<span></span><b></b>';
    chip.firstChild.textContent = emoji;
    chip.lastChild.textContent = count;
    chip.onclick = function () {
      var mine = chip.classList.toggle('mine');
      count += mine ? 1 : -1;
      chip.lastChild.textContent = count;
    };
    return chip;
  }

  // Build one message row: avatar circle, name, time, text and optional reaction
  function addMessage(author, text, emoji, count) {
    var row = document.createElement('div');
    row.className = 'msg';
    var avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.style.background = colors[author] || '#F0B232';
    avatar.textContent = author[0];
    var body = document.createElement('div');
    var head = document.createElement('div');
    head.innerHTML = '<span class="name"></span><span class="time"></span>';
    head.firstChild.textContent = author;
    head.lastChild.textContent = 'Today at ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    var p = document.createElement('div');
    p.className = 'text';
    p.textContent = text; // textContent keeps typed text safe (no HTML injection)
    body.append(head, p);
    if (emoji) body.appendChild(makeReaction(emoji, count));
    row.append(avatar, body);
    list.appendChild(row);
    list.scrollTop = list.scrollHeight; // stick to the newest message
  }

  addMessage('Wumpus', 'Hey everyone! Welcome to the server 👋', '👋', 3);
  addMessage('Clyde', 'Fun fact: Discord calls servers "guilds" in its code.', '🤯', 5);
  addMessage('Wumpus', 'Type a message below and hit Enter!', null, 0);

  // Sending: append your message, then fake a friend replying over the "WebSocket"
  document.getElementById('composer').addEventListener('submit', function (e) {
    e.preventDefault(); // stop the page from reloading
    var text = input.value.trim();
    if (!text) return;
    addMessage('You', text, null, 0);
    input.value = '';
    typing.textContent = 'Wumpus is typing...';
    setTimeout(function () {
      typing.textContent = '';
      var reply = replies[Math.floor(Math.random() * replies.length)];
      addMessage('Wumpus', reply, '❤️', 1);
    }, 1200);
  });

  // Tap a server icon to highlight it
  document.querySelectorAll('.server').forEach(function (s) {
    s.onclick = function () {
      document.querySelector('.server.active').classList.remove('active');
      s.classList.add('active');
    };
  });

  // Keep the input hint in sync with the (editable) channel name
  input.addEventListener('focus', function () {
    input.placeholder = 'Message #' + document.querySelector('.channel').textContent;
  });
</script>
</body>
</html>`,
    challenges: [
      'Change “Brand color” to Discord’s pink accent (#EB459E) and watch the Send button, active server and your avatar update.',
      'Rename the channel to “homework-help”, then tap the message box: the hint text follows along.',
      'In the script, give your own messages a 👍 reaction by changing addMessage(\'You\', text, null, 0).',
      'Harder: make each server icon show its own set of messages, a tiny version of switching guilds.',
    ],
  },

  concepts: [
    {
      term: 'WebSocket',
      meaning:
        'A connection that stays open so the server can push data to your app the moment something happens, instead of the app repeatedly asking.',
    },
    {
      term: 'Pub/sub fan-out',
      meaning:
        'One publisher sends an event to a topic (like a server) and the system copies it out to every subscriber listening to that topic.',
    },
    {
      term: 'Actor model',
      meaning:
        'Building a program from many tiny independent “actors” that each own their data and only communicate by sending messages, which is how Elixir processes work.',
    },
    {
      term: 'Snowflake ID',
      meaning:
        'A 64-bit unique ID whose leading bits are a timestamp, so sorting IDs also sorts things by when they were created.',
    },
    {
      term: 'Database partitioning',
      meaning:
        'Splitting a huge table into smaller chunks by a key (like channel plus time window) so each query only touches one small chunk.',
    },
    {
      term: 'Consistent hashing',
      meaning:
        'A way to assign items (like servers or channels) to machines so that adding or removing a machine only moves a small share of the items.',
    },
    {
      term: 'Heartbeat',
      meaning:
        'A small “I’m still here” message sent on a timer so both sides can quickly notice when a connection has died.',
    },
    {
      term: 'WebRTC',
      meaning: 'A web standard for sending live audio, video and data between devices with very low delay.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Sketch the chat screen',
      detail:
        'Build a channel view with a message list and an input box using React (try Vite) or Expo for a phone app. Start with fake messages stored in an array.',
    },
    {
      step: 'Make it live with WebSockets',
      detail:
        'Write a tiny Node.js server with Socket.IO that broadcasts every new message to all connected browsers. Open two tabs and chat with yourself!',
    },
    {
      step: 'Add servers and channels',
      detail:
        'Use Socket.IO “rooms” so each channel only receives its own messages. This is pub/sub fan-out in miniature.',
    },
    {
      step: 'Save the history',
      detail:
        'Store messages in SQLite, or a hosted Postgres database like Supabase, and load the newest 50 when a channel opens.',
    },
    {
      step: 'Add accounts',
      detail:
        'Use Firebase Authentication or Supabase Auth for sign-in instead of storing passwords yourself, then show each author’s name and avatar.',
    },
    {
      step: 'Stretch goal: voice chat',
      detail:
        'Try a two-person voice call over WebRTC with a helper library like PeerJS. For group calls, services like LiveKit run the forwarding media server for you.',
    },
  ],

  sources: [
    { label: 'Discord on Wikipedia', url: 'https://en.wikipedia.org/wiki/Discord' },
    { label: 'Discord official site', url: 'https://discord.com' },
    { label: 'Discord Blog (includes engineering posts)', url: 'https://discord.com/blog' },
    { label: 'Discord Developer Documentation', url: 'https://discord.com/developers/docs' },
    { label: 'Elixir programming language', url: 'https://elixir-lang.org' },
  ],
};
