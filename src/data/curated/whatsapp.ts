import type { Teardown } from '../types';

export const whatsapp: Teardown = {
  id: 'whatsapp',
  name: 'WhatsApp',
  url: 'whatsapp.com',
  tagline: 'Private messaging and calls for over two billion people',
  category: 'Messaging',
  brandColor: '#25D366',
  accentColor: '#128C7E',
  logoGlyph: '💬',
  source: 'curated',

  eli5:
    "WhatsApp is like a post office that never closes: your phone keeps a line open to WhatsApp's servers, and they pass your messages along the instant your friend is reachable (or hold them until they are). Before a message leaves your phone, it gets locked with a key that only your friend's phone can open. The servers only carry the locked box, so even WhatsApp can't read what you wrote.",

  facts: [
    { label: 'Founded', value: '2009 by Jan Koum & Brian Acton' },
    { label: 'Users', value: '2+ billion (announced 2020)' },
    { label: 'Acquired', value: 'By Facebook in 2014 for about $19B' },
    { label: 'Server language', value: 'Erlang' },
    { label: 'Encryption', value: 'Signal Protocol, on by default since 2016' },
    { label: 'Tiny team', value: '~50 engineers for ~900M users (2015)' },
    { label: 'Connections per server', value: 'Over 2 million (2012)' },
  ],

  history: [
    {
      year: '2009',
      title: 'Two ex-Yahoo engineers start WhatsApp',
      detail:
        'Jan Koum and Brian Acton, who had worked together at Yahoo, founded WhatsApp in California. The first idea was simple: show a status next to each name in your contacts.',
    },
    {
      year: '2009',
      title: 'From status app to messenger',
      detail:
        'The first iPhone version mostly showed status updates. After Apple added push notifications, people started using those statuses to chat, so WhatsApp 2.0 turned it into a messaging app.',
    },
    {
      year: '2012',
      title: '2 million connections on one server',
      detail:
        'By tuning Erlang and FreeBSD, the team got a single server to hold over 2 million simultaneous connections, and later explained how in talks at Erlang Factory.',
    },
    {
      year: '2014',
      title: 'Facebook buys WhatsApp',
      detail:
        'Facebook agreed to buy WhatsApp for about $19 billion, one of the biggest tech acquisitions ever. At the time WhatsApp had around 450 million monthly users.',
    },
    {
      year: '2015',
      title: 'WhatsApp Web and voice calls',
      detail:
        'WhatsApp Web brought your chats to a computer browser, and free voice calls over the internet rolled out to users.',
    },
    {
      year: '2016',
      title: 'Free for everyone, 1 billion users',
      detail:
        'WhatsApp dropped its $1-per-year subscription fee and announced it had passed 1 billion users.',
    },
    {
      year: '2016',
      title: 'End-to-end encryption by default',
      detail:
        'In April, WhatsApp finished turning on end-to-end encryption for every message, call and photo. It was built with Open Whisper Systems, the makers of Signal, using the Signal Protocol.',
    },
    {
      year: '2018',
      title: 'WhatsApp Business',
      detail:
        'A separate WhatsApp Business app launched so small businesses could chat with their customers, with features like business profiles and quick replies.',
    },
    {
      year: '2020',
      title: '2 billion users',
      detail: 'WhatsApp announced it had reached 2 billion users around the world.',
    },
    {
      year: '2021',
      title: 'Multi-device support',
      detail:
        'Linked devices like WhatsApp Web got their own encryption keys and connections, so they keep working even when your phone is offline.',
    },
  ],

  languages: [
    { name: 'Erlang', usedFor: 'Chat servers: connections, routing, presence and offline queues', share: 40 },
    { name: 'Java / Kotlin', usedFor: 'The Android app', share: 18 },
    { name: 'Swift / Objective-C', usedFor: 'The iPhone app', share: 17 },
    { name: 'JavaScript / TypeScript', usedFor: 'WhatsApp Web in the browser', share: 13 },
    { name: 'C / C++', usedFor: 'Speed-critical pieces such as calling and media (likely)', share: 12 },
  ],

  stack: [
    {
      layer: 'Mobile',
      items: [
        {
          name: 'Native Android app (Java / Kotlin)',
          role: 'The Android chat app',
          beginnerNote:
            "Built with Android's own tools instead of a cross-platform framework, which helps it stay fast and light even on inexpensive phones.",
          confidence: 'likely',
        },
        {
          name: 'Native iOS app (Swift / Objective-C)',
          role: 'The iPhone chat app',
          beginnerNote:
            "Built with Apple's own languages, so it can use iPhone features like notifications and the camera directly.",
          confidence: 'likely',
        },
        {
          name: 'Signal Protocol',
          role: 'End-to-end encryption',
          beginnerNote:
            "Like a padlock that only your friend's phone has the key to: messages are locked on your phone and unlocked on theirs.",
          confidence: 'confirmed',
        },
        {
          name: 'SQLite (on the phone)',
          role: 'Chat history on your device',
          beginnerNote:
            'A tiny database that lives inside the app, so your old chats load instantly without asking a server.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Frontend',
      items: [
        {
          name: 'WhatsApp Web & Desktop',
          role: 'Chats on a computer',
          beginnerNote:
            'You link it by scanning a QR code with your phone, and it becomes another device on your account.',
          confidence: 'confirmed',
        },
        {
          name: 'React',
          role: 'Web user interface',
          beginnerNote:
            'A JavaScript library (made by Meta) for building screens out of reusable pieces called components.',
          confidence: 'likely',
        },
        {
          name: 'WebSockets',
          role: 'Live browser connection',
          beginnerNote:
            'A browser connection that stays open, so the server can send new messages the moment they arrive instead of the page asking over and over.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Erlang/OTP',
          role: 'Chat server language',
          beginnerNote:
            'Erlang was created for telephone switches and can juggle millions of tiny independent processes, like giving every connected phone its own mini-worker.',
          confidence: 'confirmed',
        },
        {
          name: 'ejabberd (heavily customized)',
          role: 'Original chat server base',
          beginnerNote:
            'An open-source chat server written in Erlang that WhatsApp started from and then reworked extensively as it grew.',
          confidence: 'confirmed',
        },
        {
          name: 'Customized XMPP protocol',
          role: 'Message format on the wire',
          beginnerNote:
            'XMPP is an open standard "language" for chat messages and online status, and WhatsApp speaks its own customized version of it.',
          confidence: 'confirmed',
        },
        {
          name: 'Noise Protocol',
          role: 'Encrypting phone-to-server traffic',
          beginnerNote:
            "A second lock on the connection between your phone and WhatsApp, so people snooping on the network can't even see details like who a message is for.",
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'Mnesia',
          role: 'Distributed Erlang database',
          beginnerNote:
            'A database built into Erlang that can keep data in memory for speed, like keeping your notes on your desk instead of in a filing cabinet.',
          confidence: 'confirmed',
        },
        {
          name: 'ETS tables',
          role: 'Super-fast in-memory lookups',
          beginnerNote:
            'Erlang\'s built-in tables, handy for quick questions like "which server is this user connected to right now?"',
          confidence: 'likely',
        },
        {
          name: 'Encrypted blob storage',
          role: 'Photos, videos and voice notes',
          beginnerNote:
            "Media is uploaded already encrypted, so the storage servers hold locked boxes they can't open.",
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'FreeBSD',
          role: 'Server operating system (historically)',
          beginnerNote:
            'A free Unix-like operating system that WhatsApp tuned heavily so each machine could handle millions of network connections.',
          confidence: 'confirmed',
        },
        {
          name: 'Meta data centers',
          role: 'Where the servers run today',
          beginnerNote:
            "After the acquisition, WhatsApp's servers moved into Facebook's (now Meta's) own huge buildings full of computers.",
          confidence: 'likely',
        },
        {
          name: 'Apple APNs & Google FCM',
          role: 'Waking up phones',
          beginnerNote:
            "Phones don't let apps stay awake forever, so Apple and Google run services that tap an app on the shoulder when a message is waiting.",
          confidence: 'likely',
        },
        {
          name: 'Load balancers',
          role: 'Spreading connections out',
          beginnerNote:
            'Like a restaurant host seating guests at different tables so no single waiter gets overwhelmed.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        {
          name: 'Erlang hot code loading',
          role: 'Updating servers while they run',
          beginnerNote:
            "Engineers can swap in new code without disconnecting users, like changing a car's tire without stopping the car.",
          confidence: 'confirmed',
        },
        {
          name: 'Beta testing programs',
          role: 'Trying features early',
          beginnerNote:
            'Volunteers install beta versions of the app, so bugs are caught before billions of people get the update.',
          confidence: 'likely',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'you',
        label: 'Your phone',
        kind: 'client',
        tier: 0,
        tech: 'WhatsApp app (Android / iOS)',
        description:
          'Where messages are typed, encrypted and (on the other end) decrypted. The app keeps one always-open connection to WhatsApp so new messages arrive instantly.',
      },
      {
        id: 'friend',
        label: "Friend's phone",
        kind: 'client',
        tier: 0,
        tech: 'WhatsApp app (Android / iOS)',
        description:
          'The receiving side. Only this phone holds the private key that can unlock messages sent to it.',
      },
      {
        id: 'web',
        label: 'WhatsApp Web',
        kind: 'client',
        tier: 0,
        tech: 'Browser app (React, likely)',
        description:
          'A linked device with its own encryption keys and its own connection, so it keeps working even when your phone is off.',
      },
      {
        id: 'lb',
        label: 'Load balancer',
        kind: 'edge',
        tier: 1,
        tech: 'Load balancers (likely)',
        description:
          'Spreads millions of incoming connections across many chat servers so no single machine gets overloaded.',
      },
      {
        id: 'push',
        label: 'Push services',
        kind: 'external',
        tier: 1,
        tech: 'Apple APNs / Google FCM',
        description:
          'Run by Apple and Google to wake up a sleeping phone. WhatsApp uses them to say "you have new messages" when the app is not connected.',
      },
      {
        id: 'chat-server',
        label: 'Chat server',
        kind: 'gateway',
        tier: 2,
        tech: 'Erlang/OTP (historically on FreeBSD)',
        description:
          'Holds the always-open connections to phones, with one lightweight Erlang process per connected user. A single server famously handled over 2 million connections.',
      },
      {
        id: 'media-server',
        label: 'Media server',
        kind: 'gateway',
        tier: 2,
        tech: 'HTTPS upload / download service',
        description:
          'Accepts photos, videos and voice notes that phones have already encrypted, and hands them out again when the recipient downloads them.',
      },
      {
        id: 'router',
        label: 'Message router',
        kind: 'service',
        tier: 3,
        tech: 'Erlang processes',
        description:
          'Decides where each message goes: straight to your friend if they are connected, or into the offline queue if they are not.',
      },
      {
        id: 'offline-queue',
        label: 'Offline queue',
        kind: 'queue',
        tier: 3,
        tech: 'Erlang (store-and-forward)',
        description:
          'Holds on to messages for people who are offline and asks the push services to wake their phones.',
      },
      {
        id: 'presence',
        label: 'Presence service',
        kind: 'service',
        tier: 3,
        tech: 'Erlang',
        description:
          'Keeps track of "online", "last seen" and "typing…" so your contacts can see them (if your privacy settings allow).',
      },
      {
        id: 'key-service',
        label: 'Key directory',
        kind: 'service',
        tier: 3,
        tech: 'Signal Protocol key server',
        description:
          'Stores public keys (never private ones) that each device uploads. This lets your phone start an encrypted chat with someone even while they are offline.',
      },
      {
        id: 'session-table',
        label: 'Session table',
        kind: 'cache',
        tier: 4,
        tech: 'Mnesia / ETS (in memory)',
        description:
          'A super-fast in-memory list of which user is connected to which chat server right now.',
      },
      {
        id: 'offline-db',
        label: 'Offline message store',
        kind: 'database',
        tier: 4,
        tech: 'Mnesia',
        description:
          "Keeps encrypted messages that haven't been delivered yet. They are removed once delivered, and WhatsApp says undelivered ones are kept for up to 30 days.",
      },
      {
        id: 'media-store',
        label: 'Media storage',
        kind: 'storage',
        tier: 4,
        tech: 'Encrypted blob storage',
        description:
          'Stores photos and videos as scrambled blobs. Without the key, which travels inside the encrypted chat message, they are just random bytes.',
      },
      {
        id: 'accounts-db',
        label: 'Accounts & public keys',
        kind: 'database',
        tier: 4,
        tech: 'Mnesia (likely)',
        description: 'Phone numbers, profile info and the public keys each device has uploaded.',
      },
    ],
    edges: [
      { from: 'you', to: 'lb', label: 'Encrypted socket (always on)' },
      { from: 'friend', to: 'lb', label: 'Encrypted socket (always on)' },
      { from: 'web', to: 'lb', label: 'WebSocket' },
      { from: 'lb', to: 'chat-server', label: 'Forward connection' },
      { from: 'chat-server', to: 'router', label: 'Encrypted message' },
      { from: 'router', to: 'session-table', label: 'Who is online where?' },
      { from: 'router', to: 'offline-queue', label: 'Recipient offline' },
      { from: 'offline-queue', to: 'offline-db', label: 'Save until delivered' },
      { from: 'offline-queue', to: 'push', label: 'Wake-up request' },
      { from: 'push', to: 'friend', label: 'Push notification' },
      { from: 'chat-server', to: 'offline-queue', label: 'Fetch waiting messages' },
      { from: 'chat-server', to: 'presence', label: 'Online / typing…' },
      { from: 'presence', to: 'session-table', label: 'Update status' },
      { from: 'chat-server', to: 'key-service', label: 'Fetch public keys' },
      { from: 'key-service', to: 'accounts-db', label: 'Read / store keys' },
      { from: 'you', to: 'media-server', label: 'HTTPS upload' },
      { from: 'friend', to: 'media-server', label: 'HTTPS download' },
      { from: 'media-server', to: 'media-store', label: 'Save encrypted blob' },
    ],
    flows: [
      {
        id: 'send-message',
        title: 'You send a message to a friend',
        emoji: '💬',
        steps: [
          {
            from: 'you',
            to: 'lb',
            narration:
              'Before anything leaves your phone, the app locks your message with a key only your friend\'s phone can open. The locked "blob" travels up the always-open connection your app keeps with WhatsApp.',
          },
          {
            from: 'lb',
            to: 'chat-server',
            narration:
              'The load balancer passes the blob to the chat server holding your connection. Your phone shows one grey ✓, meaning the server has it.',
          },
          {
            from: 'chat-server',
            to: 'router',
            narration:
              'Your personal Erlang process hands the blob to the router. The router can see who the message is for, but not what it says.',
          },
          {
            from: 'router',
            to: 'session-table',
            narration:
              'The router checks the in-memory session table: is your friend connected right now, and to which server?',
          },
          {
            from: 'router',
            to: 'chat-server',
            narration:
              'Your friend is online, so the router passes the blob to the chat server holding their connection (in real life, often a different machine).',
          },
          {
            from: 'chat-server',
            to: 'lb',
            narration:
              "The chat server pushes the blob down your friend's open connection right away. Their phone doesn't have to keep asking for new messages.",
          },
          {
            from: 'lb',
            to: 'friend',
            narration:
              "Your friend's phone unlocks the message with its private key and sends back a receipt, so your tick becomes ✓✓. It turns blue when they open the chat.",
          },
        ],
      },
      {
        id: 'friend-offline',
        title: 'Your friend is offline',
        emoji: '📴',
        steps: [
          {
            from: 'you',
            to: 'lb',
            narration:
              "You hit send. As always, your phone encrypts the message first, so only your friend's phone will ever be able to read it.",
          },
          {
            from: 'lb',
            to: 'chat-server',
            narration:
              'The chat server accepts the blob and you see one grey ✓. That means WhatsApp has it, not that your friend does.',
          },
          {
            from: 'chat-server',
            to: 'router',
            narration:
              'The router looks up your friend and finds no open connection. Their phone might be switched off or out of signal.',
          },
          {
            from: 'router',
            to: 'offline-queue',
            narration:
              'Instead of failing, the message goes into the offline queue. Holding a message and delivering it later is called store-and-forward.',
          },
          {
            from: 'offline-queue',
            to: 'offline-db',
            narration:
              "The still-encrypted blob is saved. WhatsApp can't read it, and undelivered messages are only kept for up to 30 days.",
          },
          {
            from: 'offline-queue',
            to: 'push',
            narration:
              "The queue asks Apple's or Google's push service to nudge your friend's phone. The message itself stays encrypted the whole time.",
          },
          {
            from: 'push',
            to: 'friend',
            narration:
              "Your friend's phone wakes up, reconnects and collects its waiting messages, which are then removed from the server. Your ✓ becomes ✓✓.",
          },
        ],
      },
      {
        id: 'send-photo',
        title: 'You send a photo',
        emoji: '📷',
        steps: [
          {
            from: 'you',
            to: 'media-server',
            narration:
              'Your phone makes a brand-new random key just for this photo, encrypts the file with it, and uploads the scrambled result over HTTPS.',
          },
          {
            from: 'media-server',
            to: 'media-store',
            narration:
              'The encrypted file is saved as a "blob". Without the key, it is just random-looking bytes.',
          },
          {
            from: 'you',
            to: 'lb',
            narration:
              "Next, your phone sends a normal end-to-end encrypted chat message containing the blob's location, the photo's key and a fingerprint (hash) of the file.",
          },
          {
            from: 'lb',
            to: 'chat-server',
            narration:
              'The chat server routes this small message exactly like a text. It never sees the photo key hidden inside.',
          },
          {
            from: 'chat-server',
            to: 'lb',
            narration: "The message is pushed down your friend's open connection.",
          },
          {
            from: 'lb',
            to: 'friend',
            narration:
              "Your friend's phone decrypts the message and learns where the photo is stored and which key unlocks it.",
          },
          {
            from: 'friend',
            to: 'media-server',
            narration:
              'The phone downloads the blob, checks the fingerprint to make sure nothing was changed, and decrypts the photo so it appears in the chat.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'android/app/src/main/java/com/example/chat/ui/ChatScreen.kt', note: 'The chat screen: bubbles, text box and send button' },
    { path: 'android/app/src/main/java/com/example/chat/net/ChatSocket.kt', note: 'Keeps the always-on connection to the chat server' },
    { path: 'android/app/src/main/java/com/example/chat/db/MessageStore.kt', note: 'Saves chat history in SQLite on the phone' },
    { path: 'ios/Chat/ChatViewController.swift', note: 'The iPhone version of the chat screen' },
    { path: 'ios/Crypto/SessionCipher.swift', note: 'Encrypts and decrypts messages on the device' },
    { path: 'web/src/components/ChatWindow.tsx', note: 'WhatsApp Web chat view built from React components' },
    { path: 'web/src/crypto/keyExchange.ts', note: 'Simplified key exchange + encryption demo' },
    { path: 'web/src/chat/receipts.js', note: 'Turns ✓ into ✓✓ and blue ✓✓' },
    { path: 'server/apps/chat/src/chat_sup.erl', note: 'OTP supervisor that restarts crashed workers automatically' },
    { path: 'server/apps/chat/src/chat_connection.erl', note: 'One lightweight process per connected phone' },
    { path: 'server/apps/chat/src/message_router.erl', note: 'Delivers a message now or stores it for later' },
    { path: 'server/apps/chat/src/offline_store.erl', note: 'Store-and-forward queue for offline users' },
    { path: 'server/apps/chat/src/presence.erl', note: 'Online, last seen and typing… status' },
    { path: 'server/apps/keys/src/prekey_directory.erl', note: 'Hands out public keys so new chats start encrypted' },
    { path: 'server/apps/media/src/media_upload.erl', note: 'Accepts encrypted photo and video blobs' },
    { path: 'server/apps/push/src/push_notifier.erl', note: 'Asks Apple or Google to wake offline phones' },
    { path: 'server/db/offline_messages.sql', note: 'Table design for undelivered messages' },
    { path: 'server/rebar.config', note: 'Erlang build settings and dependencies' },
  ],

  code: [
    {
      id: 'router-genserver',
      title: 'Route a message or store it for later',
      file: 'server/apps/chat/src/message_router.erl',
      language: 'Erlang',
      explanation:
        'A gen_server is a standard Erlang building block for a long-running process that handles requests one at a time. This one checks whether the recipient has a live connection process: if so it forwards the encrypted blob straight to it, otherwise it saves the blob and asks for a push notification. It is simplified; a real server would also clean up users who disconnect and spread this work across many machines.',
      code: `-module(message_router).
-behaviour(gen_server).

-export([start_link/0, online/1, send/3]).
-export([init/1, handle_call/3, handle_cast/2]).

start_link() ->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

%% A phone's connection process calls this right after it logs in.
online(UserId) ->
    ets:insert(sessions, {UserId, self()}).

%% Blob is already end-to-end encrypted. The server never looks inside.
send(From, To, Blob) ->
    gen_server:cast(?MODULE, {send, From, To, Blob}).

init([]) ->
    %% In-memory table: UserId -> Pid of that user's connection process
    ets:new(sessions, [named_table, public, set]),
    {ok, #{}}.

handle_cast({send, From, To, Blob}, State) ->
    case ets:lookup(sessions, To) of
        [{To, Pid}] ->
            %% Friend is connected: hand the blob to their process
            Pid ! {deliver, From, Blob};
        [] ->
            %% Friend is offline: store it and ask for a push notification
            offline_store:save(To, {From, Blob}),
            push_notifier:wake(To)
    end,
    {noreply, State}.

handle_call(_Request, _From, State) ->
    {reply, ok, State}.`,
    },
    {
      id: 'chat-screen',
      title: 'Chat screen with bubbles',
      file: 'android/app/src/main/java/com/example/chat/ui/ChatScreen.kt',
      language: 'Kotlin',
      explanation:
        "This uses Jetpack Compose, Android's modern way of building screens with plain Kotlin functions. Each message becomes a bubble pushed to the right if you sent it and to the left if you received it. Tapping Send hands the text to onSend, which in a real app would encrypt it and send it over the open connection.",
      code: `package com.example.chat.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

data class Message(val id: Long, val text: String, val fromMe: Boolean)

@Composable
fun ChatScreen(contact: String, messages: List<Message>, onSend: (String) -> Unit) {
    var draft by remember { mutableStateOf("") } // what's typed in the box
    Column(Modifier.fillMaxSize()) {
        Text(contact, style = MaterialTheme.typography.titleLarge, modifier = Modifier.padding(16.dp))
        // Scrolling list of bubbles: mine on the right, theirs on the left
        LazyColumn(Modifier.weight(1f).padding(horizontal = 8.dp)) {
            items(messages, key = { it.id }) { msg ->
                val bubbleColor = if (msg.fromMe) Color(0xFFDCF8C6) else Color.White
                Box(Modifier.fillMaxWidth().padding(vertical = 2.dp),
                    contentAlignment = if (msg.fromMe) Alignment.CenterEnd else Alignment.CenterStart) {
                    Surface(color = bubbleColor, shape = RoundedCornerShape(10.dp), shadowElevation = 1.dp) {
                        Text(msg.text, Modifier.padding(horizontal = 10.dp, vertical = 6.dp))
                    }
                }
            }
        }
        // Input row: text field + send button
        Row(Modifier.padding(8.dp), verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(value = draft, onValueChange = { draft = it }, modifier = Modifier.weight(1f))
            Spacer(Modifier.width(8.dp))
            Button(onClick = { if (draft.isNotBlank()) { onSend(draft.trim()); draft = "" } }) {
                Text("Send")
            }
        }
    }
}`,
    },
    {
      id: 'e2e-illustration',
      title: 'Key exchange + encryption (simplified illustration)',
      file: 'web/src/crypto/keyExchange.ts',
      language: 'TypeScript',
      explanation:
        'This is a simplified illustration using the browser\'s built-in Web Crypto API, NOT the real Signal Protocol. Two people each make a key pair, swap only their public keys, and still end up with the same secret key (a trick called Diffie-Hellman), which then encrypts the message so a server in the middle only sees scrambled bytes. The real Signal Protocol adds one-time "prekeys" and a "Double Ratchet" that changes the key for every single message.',
      code: `// SIMPLIFIED ILLUSTRATION: this is NOT the real Signal Protocol.
// Signal adds X25519 prekeys and a Double Ratchet that changes keys every message.

function makeKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveKey']);
}

// Combine MY private key with THEIR public key. Both sides get the same secret.
function sharedKey(myPrivate: CryptoKey, theirPublic: CryptoKey): Promise<CryptoKey> {
  return crypto.subtle.deriveKey(
    { name: 'ECDH', public: theirPublic },
    myPrivate,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

async function demo(): Promise<void> {
  const alice = await makeKeyPair();
  const bob = await makeKeyPair();

  // Only PUBLIC keys ever travel through the server.
  const aliceKey = await sharedKey(alice.privateKey, bob.publicKey);
  const bobKey = await sharedKey(bob.privateKey, alice.publicKey);

  // Alice encrypts. The server only ever sees iv + blob: random-looking bytes.
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plain = new TextEncoder().encode('See you at 7?');
  const blob = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aliceKey, plain);

  // Bob decrypts with the key he derived on his own device.
  const opened = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, bobKey, blob);
  console.log(new TextDecoder().decode(opened)); // "See you at 7?"
}

demo();`,
    },
    {
      id: 'offline-table',
      title: 'Offline message table',
      file: 'server/db/offline_messages.sql',
      language: 'SQL',
      explanation:
        'This table is the heart of store-and-forward: undelivered messages wait here, still encrypted, until the recipient reconnects. The index makes fetching one person\'s backlog fast, and rows are deleted as soon as delivery is confirmed. WhatsApp actually keeps data like this in Erlang\'s Mnesia database, but SQL shows the same idea in a form that is easier to read.',
      code: `-- Messages waiting for a phone that is not connected right now.
-- (Illustrated in PostgreSQL. WhatsApp uses Erlang's Mnesia for data like this.)
CREATE TABLE offline_messages (
  id           BIGINT      PRIMARY KEY,       -- unique message id
  recipient_id BIGINT      NOT NULL,          -- who it is for
  sender_id    BIGINT      NOT NULL,          -- who sent it
  ciphertext   BYTEA       NOT NULL,          -- encrypted bytes the server can't read
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Makes "everything waiting for user X, oldest first" fast
CREATE INDEX idx_offline_by_recipient ON offline_messages (recipient_id, created_at);

-- 1) Friend is offline: keep the message
INSERT INTO offline_messages (id, recipient_id, sender_id, ciphertext)
VALUES ($1, $2, $3, $4);

-- 2) Friend reconnects: fetch what is waiting, in order
SELECT id, sender_id, ciphertext
FROM offline_messages
WHERE recipient_id = $1
ORDER BY created_at, id;

-- 3) Their phone confirms delivery: delete the copies from the server
DELETE FROM offline_messages
WHERE recipient_id = $1 AND id = ANY($2);

-- Clean-up job: drop anything still undelivered after 30 days
DELETE FROM offline_messages
WHERE created_at < now() - INTERVAL '30 days';`,
    },
    {
      id: 'receipts',
      title: 'Delivery receipts: ✓ → ✓✓ → blue ✓✓',
      file: 'web/src/chat/receipts.js',
      language: 'JavaScript',
      explanation:
        'Ticks are just small "receipt" messages flowing back to the sender: one ✓ means the server got it, ✓✓ means it reached your friend\'s phone, and blue ✓✓ means it was read (unless read receipts are turned off). Networks are messy and receipts can arrive late or out of order, so the code only ever moves a status forward.',
      code: `// A message's status only moves forward: pending -> sent -> delivered -> read
const ORDER = ['pending', 'sent', 'delivered', 'read'];

const TICKS = {
  pending:   { icon: '🕓', color: '#8696A0' }, // still on your phone
  sent:      { icon: '✓',  color: '#8696A0' }, // WhatsApp's server has it
  delivered: { icon: '✓✓', color: '#8696A0' }, // your friend's phone has it
  read:      { icon: '✓✓', color: '#34B7F1' }, // your friend opened the chat
};

const messages = new Map(); // id -> { text, status }

// Sender side: a receipt arrives over the socket, e.g. { id: 'm42', status: 'read' }
function onReceipt({ id, status }) {
  const msg = messages.get(id);
  if (!msg) return;
  // Receipts can arrive late or out of order, so never go backwards
  if (ORDER.indexOf(status) <= ORDER.indexOf(msg.status)) return;
  msg.status = status;

  const el = document.querySelector(\`[data-msg-id="\${id}"] .ticks\`);
  if (el) {
    el.textContent = TICKS[status].icon;
    el.style.color = TICKS[status].color;
  }
}

// Receiver side: report back what happened to a message
function sendReceipt(socket, id, status) {
  socket.send(JSON.stringify({ type: 'receipt', id, status }));
}
// sendReceipt(socket, 'm42', 'delivered')  as soon as it lands on the phone
// sendReceipt(socket, 'm42', 'read')       when the chat is open on screen`,
    },
  ],

  playground: {
    title: 'Mini WhatsApp chat',
    description:
      'A working chat screen: send a message, watch the ticks go ✓ → ✓✓ → blue, then see your friend start typing and reply.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mini WhatsApp chat</title>
<style>
:root {
  --header: #128C7E; /* @tweak color "Header color" */
  --wallpaper: #ECE5DD; /* @tweak color "Wallpaper color" */
  --bubble-out: #DCF8C6; /* @tweak color "Your bubble color" */
  --bubble-in: #FFFFFF; /* @tweak color "Friend bubble color" */
  --tick-read: #34B7F1; /* @tweak color "Read tick color" */
  --radius: 10px; /* @tweak range 0 24 "Bubble corner radius" */
  --text-size: 15px; /* @tweak range 12 20 "Text size" */
}
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, system-ui, "Segoe UI", Roboto, sans-serif; font-size: var(--text-size); }
.app { display: flex; flex-direction: column; height: 100vh; max-width: 480px; margin: 0 auto; }

/* Green header with the contact's name and status */
header { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--header); color: #fff; }
.back { font-size: 26px; line-height: 1; }
.avatar { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; font-size: 22px; background: linear-gradient(135deg, #FFD36E, #FF8A65); }
.who { flex: 1; line-height: 1.25; }
.name { font-weight: 600; font-size: 1.05em; }
.status { font-size: 0.8em; opacity: 0.85; }
.icons { display: flex; gap: 16px; font-size: 17px; }

/* Chat area: a dotted wallpaper made only with CSS gradients */
.chat {
  flex: 1; overflow-y: auto; padding: 12px 10px;
  display: flex; flex-direction: column; gap: 6px;
  background-color: var(--wallpaper);
  background-image: radial-gradient(rgba(0,0,0,0.07) 1.2px, transparent 1.8px), radial-gradient(rgba(0,0,0,0.04) 1.2px, transparent 1.8px);
  background-size: 22px 22px;
  background-position: 0 0, 11px 11px;
}
.chip { align-self: center; background: rgba(255,255,255,0.92); color: #54656F; font-size: 0.75em; padding: 5px 10px; border-radius: var(--radius); text-align: center; max-width: 85%; }
.notice { background: #FFF3C4; }

/* Bubbles: friend on the left, you on the right */
.bubble { max-width: 78%; padding: 6px 8px 4px; border-radius: var(--radius); box-shadow: 0 1px 1px rgba(0,0,0,0.12); line-height: 1.35; overflow-wrap: break-word; }
.in { align-self: flex-start; background: var(--bubble-in); border-top-left-radius: 0; }
.out { align-self: flex-end; background: var(--bubble-out); border-top-right-radius: 0; }
.meta { float: right; margin: 6px 0 0 10px; font-size: 0.7em; color: #667781; }
.ticks { margin-left: 3px; letter-spacing: -3px; transition: color 0.3s; }
.ticks.read { color: var(--tick-read); }
.pop { animation: pop 0.18s ease-out; }
@keyframes pop { from { transform: scale(0.9); opacity: 0; } }

/* Bottom bar: text box + round send button */
.bar { display: flex; gap: 8px; padding: 8px; background: var(--wallpaper); }
.bar input { flex: 1; border: none; border-radius: 22px; padding: 11px 16px; font-size: var(--text-size); outline: none; }
.send { width: 44px; height: 44px; border: none; border-radius: 50%; background: var(--header); display: grid; place-items: center; cursor: pointer; }
.send:active { transform: scale(0.92); }
</style>
</head>
<body>
<div class="app">
  <header>
    <span class="back">‹</span>
    <div class="avatar">👩🏽</div>
    <div class="who">
      <div class="name" data-edit="contact">Maya</div>
      <div class="status" id="status" data-edit="status">online</div>
    </div>
    <div class="icons"><span>📹</span><span>📞</span><span>⋮</span></div>
  </header>

  <main class="chat" id="chat">
    <div class="chip notice" data-edit="notice">🔒 Messages are end-to-end encrypted. Only people in this chat can read them.</div>
    <div class="chip" data-edit="day">TODAY</div>
    <div class="bubble in"><span data-edit="msg-in">Hey! Are we still on for pizza tonight? 🍕</span><span class="meta">18:02</span></div>
    <div class="bubble out"><span data-edit="msg-out">Yes! See you at 7</span><span class="meta">18:03 <span class="ticks read">✓✓</span></span></div>
  </main>

  <form class="bar" id="bar">
    <input id="input" placeholder="Message" autocomplete="off">
    <button class="send" aria-label="Send">
      <svg viewBox="0 0 24 24" width="22" height="22"><path fill="#fff" d="M3 20.5 21 12 3 3.5v6.6l12 1.9-12 1.9z"/></svg>
    </button>
  </form>
</div>

<script>
  const chat = document.getElementById('chat');
  const input = document.getElementById('input');
  const statusEl = document.getElementById('status');
  const replies = ['Haha nice 😄', 'Sounds good!', 'Wait, really? 😮', 'On my way 🏃', 'Perfect, see you then!'];
  let typingTimer = null;
  let savedStatus = '';

  // Current time as "18:05"
  function now() {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  // Add a bubble. mine = true puts it on the right and returns its tick element.
  function addBubble(text, mine) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble pop ' + (mine ? 'out' : 'in');
    const body = document.createElement('span');
    body.textContent = text; // textContent shows typed HTML as plain text (safe)
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = now() + ' ';
    bubble.append(body, meta);
    let ticks = null;
    if (mine) {
      ticks = document.createElement('span');
      ticks.className = 'ticks';
      ticks.textContent = '✓'; // one grey tick: the server has it
      meta.append(ticks);
    }
    chat.append(bubble);
    chat.scrollTop = chat.scrollHeight;
    return ticks;
  }

  // Your friend "types" for a moment, then replies
  function fakeReply() {
    if (!typingTimer) savedStatus = statusEl.textContent; // remember "online" (or your edit)
    statusEl.textContent = 'typing…';
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function () {
      typingTimer = null;
      statusEl.textContent = savedStatus;
      addBubble(replies[Math.floor(Math.random() * replies.length)], false);
    }, 1800);
  }

  // Send on button tap or Enter key
  document.getElementById('bar').addEventListener('submit', function (e) {
    e.preventDefault(); // stop the form from reloading the page
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    const ticks = addBubble(text, true);
    setTimeout(function () { ticks.textContent = '✓✓'; }, 900); // delivered to friend's phone
    setTimeout(function () { ticks.classList.add('read'); fakeReply(); }, 1900); // friend read it
  });
</script>
</body>
</html>`,
    challenges: [
      'Change "Read tick color" to a bright orange, then send a message and watch the ticks go ✓ → ✓✓ → orange.',
      'Rename the contact and change "online" to "last seen today at 9:41". Send a message: the status flips to "typing…" and then back to your text.',
      'Find the two setTimeout delays in the script. Can you make "delivered" take 3 seconds and "read" take 5?',
      'Add your own funny line to the replies list so your friend sometimes answers with it.',
    ],
  },

  concepts: [
    {
      term: 'End-to-end encryption',
      meaning:
        "Messages are locked on the sender's device and can only be unlocked on the recipient's device, so every server in between just carries unreadable data.",
    },
    {
      term: 'Public-key cryptography',
      meaning:
        'Each device has a public key it can share with anyone and a private key it keeps secret, and together they let two strangers agree on a shared secret without ever sending it.',
    },
    {
      term: 'Persistent connection',
      meaning:
        'A network connection that stays open instead of reconnecting for every request, so the server can push new messages to you instantly.',
    },
    {
      term: 'Lightweight processes (Erlang/BEAM)',
      meaning:
        "Erlang's virtual machine, called BEAM, can run millions of tiny isolated mini-programs at once, cheap enough to give every connected user their own.",
    },
    {
      term: 'Store-and-forward',
      meaning:
        "If the recipient can't be reached, the server stores the message and forwards it as soon as they come back online.",
    },
    {
      term: 'Push notification',
      meaning:
        "A tiny message sent through Apple's or Google's servers that wakes up an app on your phone even when it isn't running.",
    },
    {
      term: 'Horizontal scaling',
      meaning:
        'Handling more users by adding more machines side by side, instead of buying one ever-bigger computer.',
    },
    {
      term: 'Acknowledgement (ACK)',
      meaning:
        'A small "got it!" reply from the receiver; WhatsApp\'s ✓ and ✓✓ ticks are acknowledgements shown to you.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Sketch the chat screen',
      detail:
        'Use React Native with Expo (or plain HTML, CSS and JavaScript) to build a list of bubbles, a text box and a send button. Start with fake messages stored in an array.',
    },
    {
      step: 'Open a real-time connection',
      detail:
        'Create a small Node.js server with Socket.IO, which keeps a WebSocket open so the server can push messages to you the moment they arrive.',
    },
    {
      step: 'Route messages by user',
      detail:
        "On the server, keep a Map from user id to socket. If the recipient is connected, send the message to their socket; if not, save it for later.",
    },
    {
      step: 'Store and forward',
      detail:
        'Save undelivered messages in SQLite (or a free hosted database like Supabase). When a user connects, send their waiting messages and then delete them.',
    },
    {
      step: 'Add ticks and notifications',
      detail:
        'Have the receiving app send back "delivered" and "read" events to flip ✓ into ✓✓, and use Expo Notifications to alert people who are offline.',
    },
    {
      step: 'Lock it with encryption',
      detail:
        'Use TweetNaCl.js to give every user a key pair and encrypt on the device. Your server should only ever see public keys and scrambled messages.',
    },
  ],

  sources: [
    { label: 'WhatsApp on Wikipedia', url: 'https://en.wikipedia.org/wiki/WhatsApp' },
    { label: 'Erlang (programming language) on Wikipedia', url: 'https://en.wikipedia.org/wiki/Erlang_(programming_language)' },
    { label: 'Signal Protocol documentation', url: 'https://signal.org/docs/' },
    { label: 'Engineering at Meta blog', url: 'https://engineering.fb.com/' },
    { label: 'WhatsApp official site', url: 'https://www.whatsapp.com/' },
  ],
};
