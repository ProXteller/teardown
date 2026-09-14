import type { ArchetypeTemplate } from '../types';

export const archetype: ArchetypeTemplate = {
  id: 'gaming',
  label: 'Game or gaming platform',

  keywords: [
    'game',
    'games',
    'gaming',
    'gamer',
    'gamers',
    'play free',
    'free to play',
    'free-to-play',
    'multiplayer',
    'mmo',
    'mmorpg',
    'rpg',
    'fps',
    'battle royale',
    'esports',
    'leaderboard',
    'tournament',
    'matchmaking',
    'pvp',
    'co-op',
    'clan',
    'guild',
    'level up',
    'patch notes',
    'game studio',
    'indie game',
    'browser games',
    'play online',
    'speedrun',
    'skins',
    'battle pass',
    'arcade',
    'puzzle game',
    'chess',
    'game server',
  ],

  tagline: '{{name}} is a gaming platform where players team up, compete in real-time matches and climb the leaderboards.',

  eli5:
    "{{name}} works a bit like a sports league run by computers. When you press play, a matchmaker finds players of similar skill near you and books a game server, which acts as the referee: it receives everyone's button presses many times per second, decides what really happened and sends the result back to every player. When the match ends, the scores are saved to databases that power your profile, rewards and the leaderboards.",

  languages: [
    { name: 'C++', usedFor: 'Game engines, dedicated game servers and fast networking code', share: 30 },
    { name: 'Go', usedFor: 'Backend services such as matchmaking, lobbies and friends lists', share: 20 },
    { name: 'TypeScript / JavaScript', usedFor: 'The website, store, launcher screens and browser games', share: 20 },
    { name: 'C#', usedFor: 'Gameplay code in Unity and internal tools', share: 15 },
    { name: 'Python', usedFor: 'Build scripts, analytics and anti-cheat models', share: 10 },
    { name: 'Lua', usedFor: 'In-game scripting and player-made mods in many engines', share: 5 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'Unity or Unreal Engine',
          role: 'Game client engine',
          beginnerNote:
            'A game engine is a ready-made toolkit that draws 3D graphics, plays sounds and runs physics, so a studio can focus on the game itself instead of rebuilding those basics.',
        },
        {
          name: 'WebGL & HTML5 Canvas',
          role: 'Games that run in the browser',
          beginnerNote:
            'These browser features let a web page draw fast 2D and 3D graphics, which is how you can play a game on a website without installing anything.',
        },
        {
          name: 'Embedded web views (CEF)',
          role: 'Launchers & in-game stores',
          beginnerNote:
            'Many game launchers are secretly web pages running inside a built-in mini browser, so the store can change without shipping a new download.',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Dedicated game servers',
          role: 'Authoritative match simulation',
          beginnerNote:
            'A copy of the game with no graphics runs in a data center and acts as the referee, so a player cannot simply tell everyone "I won".',
        },
        {
          name: 'Go or Java microservices',
          role: 'Matchmaking, friends, parties & store',
          beginnerNote:
            'Small separate programs each handle one job. If the store has a bug, matches in progress keep running.',
        },
        {
          name: 'WebSockets & UDP',
          role: 'Real-time connections',
          beginnerNote:
            'WebSockets keep a two-way line open for lobby chat and "match found" alerts. UDP fires off tiny game updates without waiting for lost ones to be resent, because an old position is useless anyway.',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'PostgreSQL',
          role: 'Accounts, inventory & purchases',
          beginnerNote:
            'A reliable relational database. Transactions make sure that when you buy a skin, the payment record and the item are saved together or not at all.',
        },
        {
          name: 'Redis',
          role: 'Leaderboards, queues & sessions',
          beginnerNote:
            'An in-memory data store. Its sorted sets keep millions of scores in order, so "what rank am I?" is answered in about a millisecond.',
        },
        {
          name: 'Apache Kafka',
          role: 'Game event stream',
          beginnerNote:
            'A high-speed conveyor belt for events like "match finished" or "item dropped", which stats, anti-cheat and analytics systems each read at their own pace.',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Agones or Amazon GameLift',
          role: 'Game server fleets',
          beginnerNote:
            'These tools keep a pool of game servers ready in each region, hand one to the matchmaker in seconds, and shut spare ones down when players log off.',
        },
        {
          name: 'Kubernetes',
          role: 'Runs services & servers',
          beginnerNote:
            'Kubernetes is like an air-traffic controller for containers, starting, restarting and moving thousands of small programs between machines automatically.',
        },
        {
          name: 'Download CDN',
          role: 'Fast game patches',
          beginnerNote:
            'Game updates can be many gigabytes, so copies sit on servers around the world and your download comes from one close to you.',
        },
        {
          name: 'DDoS protection',
          role: 'Keeping servers online',
          beginnerNote:
            'Attackers sometimes flood game servers with junk traffic. Filtering networks soak it up before it ever reaches the game.',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Cheat detection',
          role: 'Spotting cheaters & bots',
          beginnerNote:
            'Rules and models look for impossible stats, like perfect aim every time or moving faster than the game allows, and flag the account for review.',
        },
        {
          name: 'Skill rating (Elo, Glicko, TrueSkill)',
          role: 'Estimating skill for fair matches',
          beginnerNote:
            'Math that raises your rating a lot when you beat strong players and only a little when you beat weak ones, so the matchmaker can pair people of similar skill.',
        },
        {
          name: 'Chat moderation models',
          role: 'Filtering toxic messages',
          beginnerNote:
            'Text classifiers score chat messages for insults or spam and can hide them before other players see them.',
        },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        {
          name: 'Perforce or Git LFS',
          role: 'Versioning huge game assets',
          beginnerNote:
            'Games contain giant art, audio and level files that plain Git handles badly, so studios use version control built for big binary files.',
        },
        {
          name: 'Build farms (Jenkins or TeamCity)',
          role: 'Building for every platform',
          beginnerNote:
            'Compiling a large game for PC, consoles and phones can take hours, so racks of machines build and test every change automatically.',
        },
        {
          name: 'Crash reporting (Sentry, Backtrace)',
          role: "Finding bugs on players' devices",
          beginnerNote:
            'When the game crashes, it sends a report showing exactly which line of code failed, so developers can fix the most common crashes first.',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'web',
        label: 'Website & Store',
        kind: 'client',
        tier: 0,
        tech: '{{frontend}} web app',
        description:
          'The website where you create an account, read patch notes, check leaderboards and buy items. It shares the same accounts as the game itself.',
      },
      {
        id: 'game-client',
        label: 'Game Client',
        kind: 'client',
        tier: 0,
        tech: 'Unity or Unreal Engine (C# / C++)',
        description:
          'The game installed on your PC, console or phone. It draws the world and plays sounds, but it only predicts what happens: the game server has the final say.',
      },
      {
        id: 'cdn',
        label: 'CDN & Downloads',
        kind: 'edge',
        tier: 1,
        tech: '{{hosting}} + download CDN',
        description:
          'Serves website files and huge game patches from servers near each player, so a 20 GB update does not have to crawl across an ocean.',
      },
      {
        id: 'load-balancer',
        label: 'Load Balancer & DDoS Shield',
        kind: 'edge',
        tier: 1,
        tech: 'Cloud load balancer + DDoS filtering',
        description:
          'The front door for logins, store requests and lobby connections. It spreads traffic across servers and filters out floods of junk traffic aimed at the game.',
      },
      {
        id: 'api',
        label: 'Platform API',
        kind: 'gateway',
        tier: 2,
        tech: 'Go or Node.js REST services',
        description:
          'Handles everything that is not live gameplay: accounts, friends, inventory, store purchases and leaderboard lookups.',
      },
      {
        id: 'realtime',
        label: 'Lobby Gateway',
        kind: 'gateway',
        tier: 2,
        tech: 'WebSocket servers (Go or Elixir)',
        description:
          'Keeps an always-open connection to every online player for parties, chat, friend status and the "Match found!" pop-up.',
      },
      {
        id: 'payments',
        label: 'Payments',
        kind: 'external',
        tier: 2,
        tech: 'Stripe · app store & console billing',
        description:
          "Takes real money for in-game currency and items. Games sold on phones and consoles usually have to use that platform's own billing system.",
      },
      {
        id: 'matchmaker',
        label: 'Matchmaker',
        kind: 'service',
        tier: 3,
        tech: 'Go service (e.g. Open Match)',
        description:
          'Groups waiting players into fair matches by skill rating, region and party size, then books a game server for them.',
      },
      {
        id: 'game-server',
        label: 'Dedicated Game Servers',
        kind: 'service',
        tier: 3,
        tech: 'Headless Unreal / Unity servers on Agones or GameLift',
        description:
          'One server process per match runs the real simulation 20 to 60 times per second (the tick rate), checks every move and sends the true game state to all players.',
      },
      {
        id: 'anticheat',
        label: 'Anti-cheat',
        kind: 'ml',
        tier: 3,
        tech: 'Server-side checks + Python ML models',
        description:
          'Studies match data for impossible behavior like inhuman aim or speed hacks, then flags or bans the accounts involved.',
      },
      {
        id: 'events',
        label: 'Event Stream',
        kind: 'queue',
        tier: 3,
        tech: 'Apache Kafka',
        description:
          'A conveyor belt of game events such as "match finished" or "player reported". Results, leaderboard and anti-cheat workers each read from it independently.',
      },
      {
        id: 'db',
        label: 'Accounts & Inventory',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL',
        description:
          'The permanent record: player accounts, owned items, purchases, match history and skill ratings.',
      },
      {
        id: 'redis',
        label: 'Leaderboards & Queues',
        kind: 'cache',
        tier: 4,
        tech: 'Redis (sorted sets)',
        description:
          'In-memory storage for fast-changing data: live leaderboards, matchmaking tickets and who is online right now.',
      },
      {
        id: 'storage',
        label: 'Builds & Replays',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3',
        description:
          'Stores game builds, patch files and recorded match replays. The CDN copies files from here the first time someone near it asks.',
      },
    ],
    edges: [
      { from: 'web', to: 'cdn', label: 'Pages, scripts & images' },
      { from: 'game-client', to: 'cdn', label: 'Download patches' },
      { from: 'cdn', to: 'storage', label: 'Fetch on cache miss' },
      { from: 'web', to: 'load-balancer', label: 'HTTPS API calls' },
      { from: 'game-client', to: 'load-balancer', label: 'HTTPS + WebSocket' },
      { from: 'load-balancer', to: 'api', label: 'REST requests' },
      { from: 'load-balancer', to: 'realtime', label: 'WebSocket connections' },
      { from: 'api', to: 'db', label: 'Accounts, items & purchases' },
      { from: 'api', to: 'redis', label: 'Leaderboard lookups' },
      { from: 'api', to: 'payments', label: 'Charge payment' },
      { from: 'realtime', to: 'matchmaker', label: 'Matchmaking tickets' },
      { from: 'matchmaker', to: 'redis', label: 'Waiting pool & ratings' },
      { from: 'matchmaker', to: 'game-server', label: 'Allocate a server' },
      { from: 'game-client', to: 'game-server', label: 'UDP inputs & snapshots' },
      { from: 'game-server', to: 'events', label: 'Match results & telemetry' },
      { from: 'game-server', to: 'storage', label: 'Upload replays' },
      { from: 'events', to: 'db', label: 'Save results & XP' },
      { from: 'events', to: 'redis', label: 'Update scores' },
      { from: 'events', to: 'anticheat', label: 'Stats to inspect' },
      { from: 'anticheat', to: 'db', label: 'Flag or ban account' },
    ],
    flows: [
      {
        id: 'find-match',
        title: 'You press "Find match"',
        emoji: '🎮',
        steps: [
          {
            from: 'game-client',
            to: 'load-balancer',
            narration:
              'You press Find match. Your game sends a tiny message over the WebSocket connection it opened when you logged in.',
          },
          {
            from: 'load-balancer',
            to: 'realtime',
            narration:
              'The load balancer passes it to the lobby server that holds your connection. Connections are "sticky", so you keep talking to the same server.',
          },
          {
            from: 'realtime',
            to: 'matchmaker',
            narration:
              'The lobby gateway creates a matchmaking ticket: your player ID, skill rating, region, game mode and party members.',
          },
          {
            from: 'matchmaker',
            to: 'redis',
            narration:
              'Your ticket joins a waiting pool. Every second or so, the matchmaker scans the pool for players with similar ratings and good ping to the same data center.',
          },
          {
            from: 'matchmaker',
            to: 'game-server',
            narration:
              'Once it has enough players, it asks the server fleet for a game server that is already running and ready in that region.',
          },
          {
            from: 'matchmaker',
            to: 'realtime',
            narration:
              'The matchmaker sends back the server address plus a one-time join token, and the lobby gateway pushes "Match found!" down your open connection.',
          },
          {
            from: 'game-client',
            to: 'game-server',
            narration:
              'Your game connects straight to the game server over UDP, shows its token to prove it belongs in this match, and the countdown begins.',
          },
        ],
      },
      {
        id: 'finish-match',
        title: 'You win a match',
        emoji: '🏆',
        steps: [
          {
            from: 'game-client',
            to: 'game-server',
            narration:
              'During the match your game sends only your inputs (move, aim, shoot) many times per second. The server works out what really happened and sends everyone snapshots of the true game state.',
          },
          {
            from: 'game-server',
            to: 'events',
            narration:
              "When the match ends, the server publishes a \"match finished\" event with every player's score, plus stats like accuracy and distance moved.",
          },
          {
            from: 'events',
            to: 'db',
            narration:
              "A results worker reads the event and, in one database transaction, saves the match history, awards XP and updates everyone's skill rating.",
          },
          {
            from: 'events',
            to: 'redis',
            narration:
              'A leaderboard worker adds your points to the season leaderboard, a Redis sorted set that keeps itself in order, so your new rank shows up instantly.',
          },
          {
            from: 'events',
            to: 'anticheat',
            narration:
              'Anti-cheat reads the very same event and compares your stats with what a human player can actually do.',
          },
          {
            from: 'anticheat',
            to: 'db',
            narration:
              'Your stats look normal, so nothing happens. A player who landed 99% headshots through walls would be flagged for review or banned right here.',
          },
        ],
      },
      {
        id: 'buy-skin',
        title: 'You buy a skin in the store',
        emoji: '🛒',
        steps: [
          {
            from: 'web',
            to: 'cdn',
            narration: 'The store page and all the item artwork load quickly from a CDN server near you.',
          },
          {
            from: 'web',
            to: 'load-balancer',
            narration:
              'You click Buy. The browser sends a POST request with the item ID and a unique "idempotency key", so an accidental double-click can never charge you twice.',
          },
          {
            from: 'load-balancer',
            to: 'api',
            narration:
              "The request reaches the platform API, which checks that you are logged in and don't already own the item.",
          },
          {
            from: 'api',
            to: 'payments',
            narration:
              'The API asks the payment provider to charge your card, or subtracts in-game coins from your balance instead.',
          },
          {
            from: 'api',
            to: 'db',
            narration:
              'In a single database transaction it records the purchase and adds the skin to your inventory: either both happen, or neither does.',
          },
          {
            from: 'game-client',
            to: 'load-balancer',
            narration: 'Later you launch the game, and it asks the platform for your inventory.',
          },
          {
            from: 'load-balancer',
            to: 'api',
            narration:
              'The API reads your items from the database, and the new skin appears in your locker, ready to equip.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'game/Source/Server/MatchGameMode.cpp', note: 'Authoritative match rules: scoring, respawns and win conditions' },
    { path: 'game/Source/Shared/Net/Snapshot.h', note: 'Compact world state the server sends to players every tick' },
    { path: 'game/Source/Client/Net/Prediction.cpp', note: 'Client-side prediction and correction when the server disagrees' },
    { path: 'services/api/src/routes/leaderboard.ts', note: 'Reads the top players and your rank from Redis' },
    { path: 'services/api/src/routes/store.ts', note: 'Purchase endpoint that uses idempotency keys' },
    { path: 'services/realtime/internal/ws/hub.go', note: 'Holds player WebSocket connections and pushes "Match found!"' },
    { path: 'services/matchmaker/internal/match/pool.go', note: 'Groups waiting players into fair matches' },
    { path: 'services/matchmaker/config/modes.yaml', note: 'Team sizes, regions and rating rules for each game mode' },
    { path: 'workers/results/consumer.go', note: 'Reads "match finished" events, saves results and awards XP' },
    { path: 'workers/anticheat/detect_outliers.py', note: 'Flags players whose stats are statistically impossible' },
    { path: 'db/migrations/001_players_matches_purchases.sql', note: 'Tables for players, matches, purchases and inventory' },
    { path: 'infra/agones/fleet.yaml', note: 'Keeps a pool of ready game servers in each region' },
    { path: 'infra/k8s/matchmaker-deployment.yaml', note: 'Tells Kubernetes how many matchmaker copies to run' },
    { path: 'tools/build/publish_patch.py', note: 'Packages a new patch and uploads it to storage for the CDN' },
    { path: 'analytics/queries/daily_active_players.sql', note: 'Counts unique players per day for the team dashboard' },
  ],

  code: [
    {
      id: 'leaderboard-api',
      title: 'Leaderboard API with Redis sorted sets',
      file: 'services/api/src/routes/leaderboard.ts',
      language: 'TypeScript',
      explanation:
        'A leaderboard is a perfect fit for a Redis sorted set: every player is stored with a score, and Redis keeps them in order automatically. The results worker calls addScore after each match (players never can, or they would give themselves a million points). The public endpoint grabs the top 10 with ZREVRANGE and looks up your own position with ZREVRANK, both in about a millisecond even with millions of players.',
      code: `import { Router } from 'express';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');
const keyFor = (season: string) => 'leaderboard:' + season;

// Called by the results worker after a match, never directly by players.
export async function addScore(season: string, playerId: string, points: number) {
  // ZINCRBY adds points to one member of the sorted set (creating it if needed).
  await redis.zincrby(keyFor(season), points, playerId);
}

export const leaderboardRoutes = Router();

// GET /leaderboards/season-7?playerId=p42  ->  top 10 plus your own rank
leaderboardRoutes.get('/leaderboards/:season', async (req, res) => {
  const key = keyFor(req.params.season);
  const flat = await redis.zrevrange(key, 0, 9, 'WITHSCORES'); // [id, score, id, score, ...]
  const top: { rank: number; playerId: string; score: number }[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    top.push({ rank: i / 2 + 1, playerId: flat[i], score: Number(flat[i + 1]) });
  }

  const playerId = typeof req.query.playerId === 'string' ? req.query.playerId : null;
  let me: { rank: number; score: number } | null = null;
  if (playerId) {
    const [index, score] = await Promise.all([redis.zrevrank(key, playerId), redis.zscore(key, playerId)]);
    // ZREVRANK counts from 0, and returns null if you have no score yet.
    if (index !== null) me = { rank: index + 1, score: Number(score) };
  }
  res.json({ top, me });
});`,
    },
    {
      id: 'players-schema',
      title: 'Players, matches and purchases',
      file: 'db/migrations/001_players_matches_purchases.sql',
      language: 'SQL (PostgreSQL)',
      explanation:
        'These tables hold the permanent side of a game. match_players is a "join table": one row per player per match, which connects many players to many matches. The purchases table has a UNIQUE idempotency_key, so if the same Buy request arrives twice the second insert fails instead of charging again, and inventory uses (player_id, item_id) as its primary key so nobody can own the same skin twice.',
      code: `CREATE TABLE players (
  id           BIGSERIAL PRIMARY KEY,
  username     TEXT NOT NULL UNIQUE,
  region       TEXT NOT NULL,                  -- 'eu-west', 'us-east'... used by matchmaking
  skill_rating INTEGER NOT NULL DEFAULT 1500,  -- everyone starts in the middle
  banned_at    TIMESTAMPTZ                     -- set by anti-cheat; NULL means good standing
);

CREATE TABLE matches (
  id         BIGSERIAL PRIMARY KEY,
  mode       TEXT NOT NULL,                    -- 'ranked-5v5', 'casual-duos'...
  started_at TIMESTAMPTZ NOT NULL,
  ended_at   TIMESTAMPTZ
);

-- One row per player per match: a many-to-many "join table".
CREATE TABLE match_players (
  match_id     BIGINT NOT NULL REFERENCES matches(id),
  player_id    BIGINT NOT NULL REFERENCES players(id),
  team         SMALLINT NOT NULL,
  score        INTEGER NOT NULL DEFAULT 0,
  rating_delta INTEGER NOT NULL DEFAULT 0,     -- e.g. +18 for a win, -15 for a loss
  PRIMARY KEY (match_id, player_id)
);

CREATE TABLE purchases (
  id              BIGSERIAL PRIMARY KEY,
  player_id       BIGINT NOT NULL REFERENCES players(id),
  item_id         TEXT NOT NULL,               -- 'skin_neon_fox'
  price_cents     INTEGER NOT NULL CHECK (price_cents >= 0),
  idempotency_key TEXT NOT NULL UNIQUE,        -- the same Buy request can't succeed twice
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE inventory (
  player_id BIGINT NOT NULL REFERENCES players(id),
  item_id   TEXT NOT NULL,
  source    TEXT NOT NULL,                     -- 'purchase', 'drop' or 'battle_pass'
  PRIMARY KEY (player_id, item_id)             -- you can't own the same item twice
);`,
    },
    {
      id: 'matchmaking',
      title: 'Skill-based matchmaking',
      file: 'services/matchmaker/internal/match/pool.go',
      language: 'Go',
      explanation:
        'Every second, the matchmaker sorts waiting players by skill rating so that neighbors in the list are the closest in skill, then tries to take them in groups. A group only becomes a match if the gap between its best and worst player is small enough for everyone in it. The allowed gap grows the longer someone waits, which is the classic trade-off every matchmaker makes: fair matches versus short queues. Real systems also weigh ping, party size and team balance.',
      code: `package match

import (
	"sort"
	"time"
)

type Ticket struct {
	PlayerID string
	Rating   int // skill rating, e.g. 1500
	QueuedAt time.Time
}

// maxSpread: the rating gap a player accepts. It grows the longer they wait.
func maxSpread(t Ticket, now time.Time) int {
	waited := int(now.Sub(t.QueuedAt).Seconds())
	return min(100+50*(waited/10), 600) // 100 at first, +50 every 10s, capped at 600
}

// FindMatches runs every second on the waiting pool for ONE region and game mode.
func FindMatches(pool []Ticket, size int, now time.Time) (matches [][]Ticket, waiting []Ticket) {
	sort.Slice(pool, func(i, j int) bool { return pool[i].Rating < pool[j].Rating }) // similar skill side by side
	i := 0 // index of the first player we haven't placed yet
	for i+size <= len(pool) {
		group := pool[i : i+size]
		spread := group[size-1].Rating - group[0].Rating
		fair := true // fair only if the spread is OK for every player in the group
		for _, t := range group {
			fair = fair && spread <= maxSpread(t, now)
		}
		if fair {
			matches = append(matches, group)
			i += size
		} else {
			waiting = append(waiting, pool[i]) // try again next second
			i++
		}
	}
	return matches, append(waiting, pool[i:]...)
}`,
    },
  ],

  playground: {
    title: 'Game lobby',
    description:
      'A tiny clone of a multiplayer game lobby: pick a mode, press Find match and watch the matchmaker widen its skill range while you wait, then see your rating change and the leaderboard re-sort after the match.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Game Lobby</title>
<style>
:root {
  --brand: {{brand}}; /* @tweak color "Brand color" */
  --accent: {{accent}}; /* @tweak color "Accent color" */
  --bg: #0d0f1a; /* @tweak color "Background" */
  --radius: 14px; /* @tweak range 0 28 "Corner radius" */
  --play-height: 60px; /* @tweak range 40 90 "Play button height" */
}
* { box-sizing: border-box; }
body {
  margin: 0; min-height: 100vh; padding: 16px; color: #fff; background: var(--bg);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
/* A soft glow of the brand color behind the top of the screen */
body::before {
  content: ""; position: fixed; left: 0; right: 0; top: 0; height: 260px; z-index: -1;
  background: linear-gradient(180deg, var(--brand), transparent); opacity: .45;
}
header { display: flex; align-items: center; gap: 10px; }
header b { font-size: 18px; }
.logo { width: 34px; height: 34px; display: grid; place-items: center; font-size: 18px; background: var(--brand); border-radius: calc(var(--radius) / 2); }
.coins { margin-left: auto; padding: 6px 10px; font-size: 13px; background: rgba(255,255,255,.12); border-radius: 999px; }
.card { margin-top: 14px; padding: 14px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1); border-radius: var(--radius); }
.player { display: flex; align-items: center; gap: 12px; }
.avatar { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; font-size: 28px; background: linear-gradient(135deg, var(--brand), var(--accent)); }
.player strong { display: block; font-size: 17px; }
.player small { color: #a9adc1; }
#rating { color: var(--accent); font-weight: 700; }
.tabs { display: flex; gap: 8px; margin-top: 14px; }
.tab { flex: 1; padding: 9px 0; color: #fff; background: none; border: 1px solid rgba(255,255,255,.18); border-radius: var(--radius); font: inherit; font-size: 13px; cursor: pointer; }
.tab.on { background: var(--brand); border-color: var(--brand); font-weight: 700; }
#play {
  width: 100%; height: var(--play-height); margin-top: 14px; border: 0; border-radius: var(--radius);
  background: var(--brand); color: #fff; font: inherit; font-size: 18px; font-weight: 800;
  letter-spacing: 1px; text-transform: uppercase; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,.35);
}
#play:disabled { opacity: .6; }
#status { min-height: 20px; margin: 10px 0 0; text-align: center; font-size: 13px; color: #a9adc1; }
#status.win { color: var(--accent); font-weight: 700; }
#status.lose { color: #ff6b6b; }
h2 { margin: 0 0 8px; font-size: 15px; }
ol { list-style: none; margin: 0; padding: 0; }
li { display: flex; gap: 10px; padding: 8px; font-size: 14px; border-radius: calc(var(--radius) / 2); }
li .pos { width: 28px; color: #a9adc1; }
li b { margin-left: auto; }
li.me { background: rgba(255,255,255,.1); box-shadow: inset 4px 0 0 var(--brand); font-weight: 700; }
.hint { margin: 10px 0 0; font-size: 12px; color: #a9adc1; }
</style>
</head>
<body>
<header>
  <span class="logo">🎮</span>
  <b data-edit="game">{{name}}</b>
  <span class="coins">🪙 1,250</span>
</header>

<div class="card player">
  <div class="avatar">🦊</div>
  <div>
    <strong id="player" data-edit="player">PixelFox</strong>
    <small>Level 12 · Rating <span id="rating">1500</span></small>
  </div>
</div>

<div class="tabs">
  <button class="tab on">Ranked</button>
  <button class="tab">Casual</button>
  <button class="tab">Duos</button>
</div>

<button id="play">Find match</button>
<p id="status">Ready when you are</p>

<div class="card">
  <h2 data-edit="board">Season leaderboard</h2>
  <ol id="board"></ol>
  <p class="hint" data-edit="hint">Real games keep this list in a Redis sorted set.</p>
</div>

<script>
// Pretend rivals. A real game keeps these scores in a database and a Redis sorted set.
const rivals = [
  { name: 'NovaByte', rating: 1720 },
  { name: 'LagWizard', rating: 1615 },
  { name: 'CritHappens', rating: 1540 },
  { name: 'QuietStorm', rating: 1470 },
  { name: 'RespawnRex', rating: 1390 }
];
let rating = 1500;      // your skill rating
let searchTimer = null; // set while you are waiting in the queue
const $ = (id) => document.getElementById(id);

// Draw the leaderboard, highest rating first
function renderBoard() {
  const me = { name: $('player').textContent, rating: rating, me: true };
  const rows = rivals.concat([me]).sort((a, b) => b.rating - a.rating);
  $('board').innerHTML = '';
  rows.forEach((p, i) => {
    const li = document.createElement('li');
    if (p.me) li.className = 'me';
    li.innerHTML = '<span class="pos"></span><span></span><b></b>';
    li.children[0].textContent = '#' + (i + 1);
    li.children[1].textContent = p.name;
    li.children[2].textContent = p.rating;
    $('board').appendChild(li);
  });
  $('rating').textContent = rating;
}

function setStatus(text, cls) {
  $('status').textContent = text;
  $('status').className = cls || '';
}

// Game mode tabs: only one can be selected at a time
document.querySelectorAll('.tab').forEach((tab) => {
  tab.onclick = () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('on'));
    tab.classList.add('on');
  };
});

$('play').onclick = () => {
  if (searchTimer) { // pressing again leaves the queue
    clearInterval(searchTimer);
    searchTimer = null;
    $('play').textContent = 'Find match';
    return setStatus('You left the queue');
  }
  const mode = document.querySelector('.tab.on').textContent;
  let seconds = 0;
  $('play').textContent = 'Cancel';
  setStatus('Joining the ' + mode + ' queue…');
  searchTimer = setInterval(() => {
    seconds++;
    // Like a real matchmaker: the longer you wait, the wider the skill range we accept
    const range = Math.min(50 + seconds * 25, 400);
    setStatus('Searching ' + seconds + 's · players within ±' + range + ' rating');
    if (Math.random() < range / 500) startMatch(mode); // wider range = easier to find players
  }, 1000);
};

function startMatch(mode) {
  clearInterval(searchTimer);
  searchTimer = null;
  $('play').disabled = true;
  $('play').textContent = 'In match…';
  setStatus('Match found! Connecting to a ' + mode + ' game server…');
  setTimeout(() => {
    const won = Math.random() < 0.55;
    const change = won ? 18 : -15;
    rating += change;
    // Everyone else kept playing too
    rivals.forEach((r) => { r.rating += Math.round(Math.random() * 30 - 15); });
    setStatus(won ? 'Victory! +' + change + ' rating' : 'Defeat. ' + change + ' rating', won ? 'win' : 'lose');
    $('play').disabled = false;
    $('play').textContent = 'Find match';
    renderBoard();
  }, 2500);
}

renderBoard();
</script>
</body>
</html>`,
    challenges: [
      'Change the "Brand color" tweak and watch the Find match button, the selected mode and your row on the leaderboard all update.',
      'Edit your player name on screen, then finish a match: the leaderboard picks up your new name.',
      'Searches get easier as the rating range grows. Change the 400 in Math.min(50 + seconds * 25, 400) to 100 and notice how much longer you wait.',
      'Add a win streak: after 3 wins in a row, show "On fire!" in the status and award +25 instead of +18.',
    ],
  },

  concepts: [
    {
      term: 'Authoritative server',
      meaning:
        'The game server is the single source of truth. Players send only their inputs and the server decides what actually happened, which makes most kinds of cheating much harder.',
    },
    {
      term: 'Tick rate',
      meaning:
        'How many times per second the server updates the game world, commonly somewhere between 20 and 128. Higher tick rates feel more responsive but need more computing power.',
    },
    {
      term: 'Client-side prediction',
      meaning:
        'Your game shows your move immediately instead of waiting for the server, then quietly corrects itself if the server disagrees. That correction is the "snap back" you feel when the connection lags.',
    },
    {
      term: 'Latency (ping)',
      meaning:
        'The round-trip time for data between your device and the server, measured in milliseconds. Matchmakers pick servers close to all players to keep it low.',
    },
    {
      term: 'UDP vs TCP',
      meaning:
        'TCP guarantees every piece of data arrives in order by resending lost ones. UDP just sends and moves on, which suits fast games because a late position update is already out of date.',
    },
    {
      term: 'Skill rating (Elo)',
      meaning:
        'A number that estimates how good you are. Beating a higher-rated player earns you more points than beating a lower-rated one, and matchmakers pair players with similar numbers.',
    },
    {
      term: 'Sorted set',
      meaning:
        'A data structure that keeps items ordered by a score, like a leaderboard that re-sorts itself every time a score changes. Redis has one built in.',
    },
    {
      term: 'Idempotency key',
      meaning:
        'A unique ID sent with a request such as a purchase. If the same request arrives again (a double-click or an automatic retry), the server recognizes the key and does the work only once.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Build a tiny browser game',
      detail:
        'Make Pong or Snake with an HTML <canvas> and requestAnimationFrame, or try Phaser, a free JavaScript game framework.',
    },
    {
      step: 'Save high scores',
      detail:
        'Write a Node.js + Express server with POST /scores and GET /scores/top, store scores in SQLite, and use ORDER BY score DESC LIMIT 10 for the leaderboard.',
    },
    {
      step: 'Go multiplayer with WebSockets',
      detail:
        "Use Socket.IO or the ws library so the server keeps every player's position and broadcasts the game state about 20 times per second.",
    },
    {
      step: 'Make the server the referee',
      detail:
        'Send only inputs like "up" or "shoot" from the browser and let the server move the players, so nobody can cheat by editing their own position.',
    },
    {
      step: 'Add a lobby and matchmaking',
      detail:
        'Keep waiting players in a list, pair two whose ratings are within 100 points, and update both ratings after each game with the Elo formula.',
    },
    {
      step: 'Deploy it with a live leaderboard',
      detail:
        'Host the server on Render or Fly.io, and move scores into a Redis sorted set (Upstash has a free tier) for instant rankings.',
    },
  ],
};
