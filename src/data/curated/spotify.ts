import type { Teardown } from '../types';

export const spotify: Teardown = {
  id: 'spotify',
  name: 'Spotify',
  url: 'spotify.com',
  tagline: 'Music, podcasts and audiobooks streamed instantly to any device',
  category: 'Audio streaming',
  brandColor: '#1DB954',
  accentColor: '#1ED760',
  logoGlyph: '🎧',
  source: 'curated',

  eli5:
    "Spotify is a giant music library that lives in the cloud instead of on your phone. When you press play, the app asks Spotify's servers if you're allowed to hear that song and where its audio file is, then downloads it in small chunks from a server near you so it starts almost instantly. Everything you play is also recorded as data, which recommendation systems use to learn your taste and build playlists like Discover Weekly.",

  facts: [
    { label: 'Founded', value: '2006' },
    { label: 'Founders', value: 'Daniel Ek & Martin Lorentzon' },
    { label: 'Headquarters', value: 'Stockholm, Sweden' },
    { label: 'Listeners', value: '750M+ users, about 300M paying subscribers' },
    { label: 'Catalog', value: '100M+ tracks and about 7M podcast titles' },
    { label: 'Markets', value: '180+ countries and territories' },
    { label: 'Stock ticker', value: 'NYSE: SPOT (listed 2018)' },
  ],

  history: [
    {
      year: '2006',
      title: 'Founded in Stockholm',
      detail:
        'Daniel Ek and Martin Lorentzon start Spotify in Sweden, aiming to build a legal music service that is faster and easier than piracy.',
    },
    {
      year: '2008',
      title: 'Launches in Europe',
      detail:
        "Spotify opens in October 2008 in several European countries with a free ad-supported tier and a paid Premium tier. To start songs quickly, the desktop app partly used peer-to-peer tech, fetching pieces of songs from other listeners' computers.",
    },
    {
      year: '2011',
      title: 'Arrives in the United States',
      detail: 'After long licensing negotiations with record labels, Spotify launches in the US in July 2011.',
    },
    {
      year: '2014',
      title: 'Buys The Echo Nest',
      detail:
        'Spotify acquires The Echo Nest, a music-data company whose technology helps computers understand songs and listeners. The same year it phases out peer-to-peer delivery and serves audio from its own servers and CDNs.',
    },
    {
      year: '2015',
      title: 'Discover Weekly debuts',
      detail:
        'A personalized playlist of 30 songs, refreshed every Monday by recommendation algorithms, quickly becomes one of the most loved features on Spotify.',
    },
    {
      year: '2016',
      title: 'Moves to Google Cloud',
      detail:
        'Spotify announces it will leave its own data centers for Google Cloud Platform, adopting tools like BigQuery and Pub/Sub. The migration takes roughly two years.',
    },
    {
      year: '2018',
      title: 'Goes public',
      detail:
        'Spotify lists on the New York Stock Exchange in April 2018 through a direct listing, an unusual way of going public without a traditional IPO.',
    },
    {
      year: '2019',
      title: 'Bets big on podcasts',
      detail:
        'Spotify acquires podcast studio Gimlet Media and podcast-creation app Anchor, expanding from music into all kinds of audio.',
    },
    {
      year: '2020',
      title: 'Open-sources Backstage',
      detail:
        'Spotify releases Backstage, its internal developer portal, as open source. Later that year it is accepted into the Cloud Native Computing Foundation (CNCF).',
    },
    {
      year: '2023',
      title: 'Launches AI DJ',
      detail:
        'Spotify introduces DJ, an AI guide that picks music for you and talks between songs with a generated voice, combining its personalization with generative AI.',
    },
  ],

  languages: [
    { name: 'Java', usedFor: 'Most backend microservices, such as playback and search', share: 30 },
    { name: 'Python', usedFor: 'Data science, machine learning and workflow tools like Luigi', share: 20 },
    { name: 'TypeScript / JavaScript', usedFor: 'Web player, desktop app UI and Backstage', share: 20 },
    { name: 'Scala', usedFor: 'Big data pipelines written with Scio on Apache Beam', share: 10 },
    { name: 'Swift / Objective-C', usedFor: 'The iOS app', share: 10 },
    { name: 'Kotlin', usedFor: 'The Android app', share: 10 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'React',
          role: 'Web player & desktop UI',
          beginnerNote:
            'React lets developers build screens out of reusable pieces, like Lego bricks for a play button, a song row or a playlist card.',
          confidence: 'confirmed',
        },
        {
          name: 'TypeScript',
          role: 'Typed JavaScript',
          beginnerNote:
            'TypeScript adds labels to data (this is a number, this is a song) so mistakes get caught before the code ever runs.',
          confidence: 'likely',
        },
        {
          name: 'Chromium Embedded Framework',
          role: 'Desktop app shell',
          beginnerNote:
            'The desktop app contains a built-in mini Chrome browser that shows web code, so one codebase can run on both Windows and Mac.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Mobile',
      items: [
        {
          name: 'Swift & Objective-C',
          role: 'Native iOS app',
          beginnerNote:
            "Apple's own languages give the iPhone app smooth animations and full access to features like lock-screen controls and background audio.",
          confidence: 'likely',
        },
        {
          name: 'Kotlin & Java',
          role: 'Native Android app',
          beginnerNote:
            "Kotlin is Android's modern, recommended language, a friendlier and safer cousin of Java that runs on the same platform.",
          confidence: 'likely',
        },
        {
          name: 'Mobius',
          role: 'Open-source state management',
          beginnerNote:
            'Mobius keeps all app state in one place and changes it only through clear events, like a referee who alone decides what the scoreboard shows.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Java',
          role: 'Main microservice language',
          beginnerNote:
            'Hundreds of small Java programs each do one job, such as search or playlists, like specialists in a big restaurant kitchen.',
          confidence: 'confirmed',
        },
        {
          name: 'gRPC & Protocol Buffers',
          role: 'Service-to-service calls',
          beginnerNote:
            'A fast, strict format for services to talk to each other, like a shared order form that every kitchen station agrees to use.',
          confidence: 'likely',
        },
        {
          name: 'Python',
          role: 'Data tooling & scripts',
          beginnerNote:
            'Python is quick to write and great with data, so it is popular for analysis, machine learning and glue code between systems.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'Google Cloud Pub/Sub',
          role: 'Event delivery',
          beginnerNote:
            "Like a super-fast post office: services drop off event messages and other services pick them up, without needing to know each other.",
          confidence: 'confirmed',
        },
        {
          name: 'BigQuery',
          role: 'Data warehouse',
          beginnerNote:
            'A huge analytics database where you can run SQL over billions of rows of listening history and get answers in seconds.',
          confidence: 'confirmed',
        },
        {
          name: 'Cloud Bigtable & Apache Cassandra',
          role: 'Fast large-scale storage',
          beginnerNote:
            'Databases spread across many machines so they stay fast and available even with hundreds of millions of users reading and writing.',
          confidence: 'confirmed',
        },
        {
          name: 'Scio (Scala on Apache Beam)',
          role: 'Data pipelines',
          beginnerNote:
            'Scio, created at Spotify, lets engineers describe a data job once, like "count plays per song", and run it across thousands of machines.',
          confidence: 'confirmed',
        },
        {
          name: 'Luigi',
          role: 'Batch job workflows',
          beginnerNote:
            "Luigi, created at Spotify, chains jobs together like a recipe: don't frost the cake until the baking step has finished.",
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Google Cloud Platform',
          role: 'Cloud provider',
          beginnerNote:
            'Instead of owning buildings full of servers, Spotify rents computing power from Google, like using the power grid instead of running your own generator.',
          confidence: 'confirmed',
        },
        {
          name: 'Kubernetes',
          role: 'Runs containers at scale',
          beginnerNote:
            'Kubernetes is like an air-traffic controller for thousands of small programs, starting, restarting and moving them between machines automatically.',
          confidence: 'confirmed',
        },
        {
          name: 'Content delivery networks',
          role: 'Serves audio near listeners',
          beginnerNote:
            'Like keeping copies of a popular book in every local library, so nobody waits for it to be shipped from the capital.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Collaborative filtering',
          role: 'Taste-matching recommendations',
          beginnerNote:
            "If people whose taste overlaps with yours all love a song you haven't heard yet, it is probably a good pick for you too.",
          confidence: 'confirmed',
        },
        {
          name: 'Annoy & Voyager',
          role: 'Fast nearest-neighbor search',
          beginnerNote:
            'These open-source Spotify libraries quickly find the songs "closest" to a given song on a giant map of music, like finding your nearest neighbors.',
          confidence: 'confirmed',
        },
        {
          name: 'TensorFlow & Kubeflow',
          role: 'Training ML models',
          beginnerNote:
            'Tools for training models and running them as repeatable pipelines, like an assembly line that builds a fresh model every time.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        {
          name: 'Backstage',
          role: 'Developer portal',
          beginnerNote:
            'A website where any Spotify engineer can find every service, who owns it and its docs, like a searchable phone book for software.',
          confidence: 'confirmed',
        },
        {
          name: 'Docker',
          role: 'Packaging services',
          beginnerNote:
            'Docker packs a program with everything it needs into a container, like a lunchbox that works the same no matter whose table it lands on.',
          confidence: 'confirmed',
        },
        {
          name: 'Golden Paths',
          role: 'Recommended ways to build',
          beginnerNote:
            'Step-by-step "paved roads" for common tasks, so teams don\'t have to reinvent how to create and ship a new service.',
          confidence: 'confirmed',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'mobile-app',
        label: 'Mobile App',
        kind: 'client',
        tier: 0,
        tech: 'Swift (iOS) · Kotlin (Android)',
        description:
          'The native Spotify app on your phone. It plays audio, keeps a cache of recent and downloaded songs on the device, and talks to Spotify over the internet.',
      },
      {
        id: 'desktop-web',
        label: 'Desktop & Web Player',
        kind: 'client',
        tier: 0,
        tech: 'React in Chromium Embedded Framework',
        description:
          'The desktop app and the web player share much of the same web code. On desktop, that code runs inside a built-in mini browser.',
      },
      {
        id: 'cdn',
        label: 'Audio CDN',
        kind: 'edge',
        tier: 1,
        tech: 'Content delivery networks',
        description:
          'Servers around the world that keep copies of audio files close to listeners. Downloading a song from your own region is much faster than fetching it from across an ocean.',
      },
      {
        id: 'load-balancer',
        label: 'Load Balancer',
        kind: 'edge',
        tier: 1,
        tech: 'Google Cloud Load Balancing',
        description:
          "The front door for app requests. It spreads millions of requests across many servers so no single machine gets overwhelmed.",
      },
      {
        id: 'api-gateway',
        label: 'API Gateway',
        kind: 'gateway',
        tier: 2,
        tech: 'Java edge services',
        description:
          'Checks that you are logged in, then forwards each request to the right internal service. Apps only need one address instead of knowing hundreds of services.',
      },
      {
        id: 'playback',
        label: 'Playback Service',
        kind: 'service',
        tier: 3,
        tech: 'Java microservice on Kubernetes',
        description:
          'Decides whether you can play a track (is it licensed in your country? are you Premium?) and tells the app which audio file to fetch and at what quality.',
      },
      {
        id: 'search',
        label: 'Search Service',
        kind: 'service',
        tier: 3,
        tech: 'Java microservice',
        description:
          'Turns what you type into a ranked list of songs, artists, podcasts and playlists. It has to answer in milliseconds, even while you are still typing.',
      },
      {
        id: 'recommender',
        label: 'Personalization',
        kind: 'ml',
        tier: 3,
        tech: 'Scio pipelines + TensorFlow models',
        description:
          'Learns your taste from listening history and builds personal playlists like Discover Weekly. The heavy work runs ahead of time as batch jobs, so results load instantly.',
      },
      {
        id: 'event-delivery',
        label: 'Event Delivery',
        kind: 'queue',
        tier: 3,
        tech: 'Google Cloud Pub/Sub',
        description:
          'Collects a constant stream of tiny event messages like "this user played song X for 45 seconds". It holds them safely until data pipelines are ready to use them.',
      },
      {
        id: 'audio-storage',
        label: 'Audio Files',
        kind: 'storage',
        tier: 4,
        tech: 'Google Cloud Storage',
        description:
          'The master copies of every encoded audio file, saved at several quality levels. CDN servers pull files from here when they do not have a copy yet.',
      },
      {
        id: 'metadata-db',
        label: 'User & Catalog Data',
        kind: 'database',
        tier: 4,
        tech: 'Cloud Bigtable · Apache Cassandra',
        description:
          'Stores facts about songs (title, artist, length, licensing) and about you (playlists, likes, follows). It is split across many machines to stay fast at huge scale.',
      },
      {
        id: 'search-index',
        label: 'Search Index',
        kind: 'database',
        tier: 4,
        tech: 'Inverted index + vector search',
        description:
          'A pre-built lookup table, like the index at the back of a textbook, that maps words to matching tracks, artists and episodes. It is rebuilt as the catalog changes.',
      },
      {
        id: 'bigquery',
        label: 'Data Warehouse',
        kind: 'database',
        tier: 4,
        tech: 'Google BigQuery',
        description:
          'A giant analytics database holding listening history. Engineers and data scientists run SQL over billions of rows for charts, reports and model training.',
      },
    ],
    edges: [
      { from: 'mobile-app', to: 'load-balancer', label: 'HTTPS API calls' },
      { from: 'desktop-web', to: 'load-balancer', label: 'HTTPS API calls' },
      { from: 'mobile-app', to: 'cdn', label: 'Audio chunks' },
      { from: 'desktop-web', to: 'cdn', label: 'Audio chunks' },
      { from: 'cdn', to: 'audio-storage', label: 'Fetch on cache miss' },
      { from: 'load-balancer', to: 'api-gateway', label: 'Routes requests' },
      { from: 'api-gateway', to: 'playback', label: 'gRPC' },
      { from: 'api-gateway', to: 'search', label: 'gRPC' },
      { from: 'api-gateway', to: 'recommender', label: 'Home & playlists' },
      { from: 'api-gateway', to: 'event-delivery', label: 'Listening events' },
      { from: 'playback', to: 'metadata-db', label: 'Rights & track info' },
      { from: 'search', to: 'search-index', label: 'Query index' },
      { from: 'search', to: 'metadata-db', label: 'Result details' },
      { from: 'metadata-db', to: 'search-index', label: 'Catalog updates' },
      { from: 'event-delivery', to: 'bigquery', label: 'Stream events' },
      { from: 'bigquery', to: 'recommender', label: 'Listening history' },
      { from: 'recommender', to: 'metadata-db', label: 'Save playlists' },
    ],
    flows: [
      {
        id: 'press-play',
        title: 'You press play on a song',
        emoji: '▶️',
        steps: [
          {
            from: 'mobile-app',
            to: 'load-balancer',
            narration:
              'You tap play. The app sends a small, encrypted HTTPS request saying "this user wants this track" to Spotify\'s front door.',
          },
          {
            from: 'load-balancer',
            to: 'api-gateway',
            narration: 'The load balancer picks a healthy gateway server with spare capacity and passes the request along.',
          },
          {
            from: 'api-gateway',
            to: 'playback',
            narration: 'The gateway checks your login and hands the request to the Playback service.',
          },
          {
            from: 'playback',
            to: 'metadata-db',
            narration:
              'Playback looks up the track: is it licensed where you are, and which audio file matches your quality setting? It replies with a temporary link to that file.',
          },
          {
            from: 'mobile-app',
            to: 'cdn',
            narration:
              'The app downloads the audio in small chunks from a CDN server near you. Music starts after the first few chunks, without waiting for the whole file.',
          },
          {
            from: 'cdn',
            to: 'audio-storage',
            narration:
              "If that nearby server doesn't have the file yet (a cache miss), it fetches it once from central storage and keeps a copy for the next listener.",
          },
        ],
      },
      {
        id: 'search-artist',
        title: 'You search for an artist',
        emoji: '🔍',
        steps: [
          {
            from: 'desktop-web',
            to: 'load-balancer',
            narration:
              "You type an artist's name into the web player. After a tiny pause in your typing, the page sends what you've typed so far to Spotify.",
          },
          {
            from: 'load-balancer',
            to: 'api-gateway',
            narration: 'The request is routed to an available gateway server.',
          },
          {
            from: 'api-gateway',
            to: 'search',
            narration: 'The gateway forwards your search text to the Search service.',
          },
          {
            from: 'search',
            to: 'search-index',
            narration:
              'Search looks your words up in its pre-built index and pulls back likely matches, even if you made a small typo.',
          },
          {
            from: 'search',
            to: 'metadata-db',
            narration:
              'It fetches details for the best matches, like artist images and track titles, and ranks them using signals such as popularity.',
          },
          {
            from: 'load-balancer',
            to: 'desktop-web',
            narration:
              'The ranked results travel back as JSON, and React redraws the results list, usually in a fraction of a second.',
          },
        ],
      },
      {
        id: 'discover-weekly',
        title: 'Discover Weekly is made',
        emoji: '✨',
        steps: [
          {
            from: 'api-gateway',
            to: 'event-delivery',
            narration:
              'All week, every play, skip and save you make is sent by the app as a tiny event, and the gateway drops it into Event Delivery.',
          },
          {
            from: 'event-delivery',
            to: 'bigquery',
            narration: 'The events are stored in the data warehouse, next to billions of plays from other listeners.',
          },
          {
            from: 'bigquery',
            to: 'recommender',
            narration:
              'Batch jobs look for listeners and playlists that overlap with your taste (collaborative filtering) and songs that often appear alongside the ones you love.',
          },
          {
            from: 'recommender',
            to: 'metadata-db',
            narration:
              "The system picks 30 songs you haven't played yet and saves them as your personal Discover Weekly playlist.",
          },
          {
            from: 'mobile-app',
            to: 'load-balancer',
            narration: 'On Monday you open the app, and it asks Spotify for your Home screen and playlists.',
          },
          {
            from: 'load-balancer',
            to: 'api-gateway',
            narration: 'As usual, the request is routed to a gateway server.',
          },
          {
            from: 'api-gateway',
            to: 'recommender',
            narration:
              'The gateway asks Personalization for your playlists. Discover Weekly loads instantly because all the hard work was done ahead of time.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'apps/ios/NowPlaying/NowPlayingViewController.swift', note: 'iOS now-playing screen' },
    {
      path: 'apps/android/app/src/main/java/com/example/player/NowPlayingScreen.kt',
      note: 'Android now-playing screen in Jetpack Compose',
    },
    {
      path: 'apps/android/app/src/main/java/com/example/player/PlayerViewModel.kt',
      note: 'Holds playback state (track, position, playing) for the screen',
    },
    {
      path: 'apps/android/app/src/main/java/com/example/offline/AudioCache.kt',
      note: 'Saves downloaded songs for offline listening',
    },
    { path: 'apps/web-player/src/components/PlayerBar.tsx', note: 'Play/pause bar at the bottom of the web player' },
    { path: 'apps/web-player/src/api/searchClient.ts', note: 'Calls the search API as you type, with a short delay' },
    { path: 'apps/desktop/shell/main.cpp', note: 'Native desktop shell that hosts the web UI in Chromium' },
    {
      path: 'services/playback/src/main/java/com/example/playback/PlaybackController.java',
      note: 'Endpoint the app calls when you press play',
    },
    { path: 'services/playback/k8s/deployment.yaml', note: 'Tells Kubernetes how many copies of the service to run' },
    {
      path: 'services/search/src/main/java/com/example/search/SearchService.java',
      note: 'Matches and ranks search results',
    },
    {
      path: 'services/search/indexer/BuildIndexJob.java',
      note: 'Rebuilds the search index when the catalog changes',
    },
    { path: 'protos/playback/v1/playback.proto', note: 'Shared gRPC contract between the gateway and Playback' },
    { path: 'services/events/schemas/song_played.avsc', note: 'Schema describing a "song played" event' },
    {
      path: 'data/pipelines/src/main/scala/ListeningStatsJob.scala',
      note: 'Scio pipeline that counts plays per track per day',
    },
    { path: 'data/workflows/weekly_tasks.py', note: 'Luigi tasks that run the weekly jobs in the right order' },
    { path: 'ml/discover_weekly/collaborative_filter.py', note: 'Taste-matching recommendation sketch' },
    { path: 'analytics/queries/top_tracks_by_country.sql', note: 'BigQuery query behind a "Top 10" chart' },
    { path: 'catalog-info.yaml', note: 'Backstage file saying which squad owns this service' },
  ],

  code: [
    {
      id: 'playback-endpoint',
      title: 'Starting playback (backend endpoint)',
      file: 'services/playback/src/main/java/com/example/playback/PlaybackController.java',
      language: 'Java',
      explanation:
        'When you press play, the app calls an endpoint like this. It looks up the track, checks that it is licensed in your country, picks an audio quality based on your plan, and returns a short-lived signed link to the file on the CDN. It is written in familiar Spring Boot style for learning; the real system is far more complex.',
      code: `package com.example.playback;

import java.time.Duration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/playback")
public class PlaybackController {

    private final TrackRepository tracks;
    private final LicenseService licenses;
    private final CdnUrlSigner signer;

    public PlaybackController(TrackRepository tracks, LicenseService licenses, CdnUrlSigner signer) {
        this.tracks = tracks;
        this.licenses = licenses;
        this.signer = signer;
    }

    // Called by the app when you press play on a track.
    @GetMapping("/{trackId}")
    public ResponseEntity<PlaybackInfo> start(@PathVariable String trackId,
                                              @RequestHeader("X-User-Id") String userId,
                                              @RequestHeader("X-Country") String country) {
        Track track = tracks.findById(trackId).orElse(null);
        if (track == null) {
            return ResponseEntity.notFound().build();
        }
        // Record labels license songs country by country.
        if (!licenses.isPlayable(track, country)) {
            return ResponseEntity.status(451).build(); // 451 = unavailable for legal reasons
        }
        int kbps = licenses.isPremium(userId) ? 320 : 160; // Premium gets higher quality
        String url = signer.sign(track.audioFileId(kbps), Duration.ofMinutes(15));
        return ResponseEntity.ok(new PlaybackInfo(trackId, kbps, url));
    }
}

record PlaybackInfo(String trackId, int bitrateKbps, String audioUrl) {}`,
    },
    {
      id: 'web-player-bar',
      title: 'Web player play/pause bar',
      file: 'apps/web-player/src/components/PlayerBar.tsx',
      language: 'TypeScript',
      explanation:
        'This React component keeps two pieces of state, whether music is playing and how far along it is, and the screen redraws whenever they change. The browser\'s audio element does the actual playing and reports progress through events like onTimeUpdate. The real player streams encrypted audio in chunks, but the idea of "state drives the UI" is the same.',
      code: `import { useEffect, useRef, useState } from 'react';
type Track = { id: string; title: string; artist: string; audioUrl: string };

export function PlayerBar({ track }: { track: Track }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 = start, 1 = end

  // Whenever a new track is chosen, load it and try to start playing.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.audioUrl;
    setProgress(0);
    audio.play().catch(() => setIsPlaying(false)); // browsers may block autoplay
  }, [track.audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play(); else audio.pause();
  };

  return (
    <footer className="player-bar">
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => {
          const { currentTime, duration } = e.currentTarget;
          setProgress(duration ? currentTime / duration : 0);
        }}
      />
      <strong>{track.title}</strong> <span>{track.artist}</span>
      <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
      <progress value={progress} max={1} />
    </footer>
  );
}`,
    },
    {
      id: 'android-now-playing',
      title: 'Android now-playing screen',
      file: 'apps/android/app/src/main/java/com/example/player/NowPlayingScreen.kt',
      language: 'Kotlin',
      explanation:
        'Jetpack Compose describes the screen as a function of state: album art, title, a seek slider and playback buttons. When the ViewModel reports a new position or a pause, Compose automatically redraws only what changed. Button taps call ViewModel functions instead of changing the screen directly, which keeps the logic easy to test.',
      code: `// Jetpack Compose + Material 3 (imports omitted for brevity)
@Composable
fun NowPlayingScreen(viewModel: PlayerViewModel) {
    // The screen redraws automatically whenever this state changes.
    val state by viewModel.state.collectAsState()
    val track = state.track

    Column(
        modifier = Modifier.fillMaxSize().background(Color(0xFF121212)).padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        AlbumArt(url = track.coverUrl, modifier = Modifier.size(300.dp))
        Spacer(Modifier.height(24.dp))
        Text(track.title, color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
        Text(track.artist, color = Color.Gray, fontSize = 16.sp)

        // Dragging the slider "seeks" to a new spot in the song.
        Slider(
            value = state.positionMs.toFloat(),
            onValueChange = { viewModel.seekTo(it.toLong()) },
            valueRange = 0f..track.durationMs.toFloat(),
            colors = SliderDefaults.colors(activeTrackColor = Color(0xFF1DB954))
        )

        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = viewModel::skipPrevious) {
                Icon(Icons.Filled.SkipPrevious, contentDescription = "Previous", tint = Color.White)
            }
            FilledIconButton(onClick = viewModel::togglePlayPause, modifier = Modifier.size(64.dp)) {
                Icon(
                    imageVector = if (state.isPlaying) Icons.Filled.Pause else Icons.Filled.PlayArrow,
                    contentDescription = if (state.isPlaying) "Pause" else "Play"
                )
            }
            IconButton(onClick = viewModel::skipNext) {
                Icon(Icons.Filled.SkipNext, contentDescription = "Next", tint = Color.White)
            }
        }
    }
}`,
    },
    {
      id: 'collaborative-filtering',
      title: 'Collaborative filtering sketch',
      file: 'ml/discover_weekly/collaborative_filter.py',
      language: 'Python',
      explanation:
        'Two songs count as "similar" when the same people play both. For each song you have not heard, we add up how similar it is to the songs you already love and recommend the highest scores. Spotify\'s real systems work with hundreds of millions of users and mix in techniques like matrix factorization and audio analysis, but this is the core intuition.',
      code: `import numpy as np

songs = ["Blinding Lights", "Levitating", "Bad Guy", "Heat Waves", "Shivers", "Stay"]

# Rows = listeners, columns = songs. 1 means "this person plays it a lot".
plays = np.array([
    [1, 1, 0, 1, 0, 0],  # Ana
    [1, 1, 1, 0, 0, 0],  # Ben
    [0, 0, 1, 1, 1, 0],  # Chloe
    [1, 0, 0, 1, 0, 1],  # Dev
])

def song_similarity(matrix):
    """Cosine similarity between song columns: do the same people play them?"""
    norms = np.linalg.norm(matrix, axis=0)
    normalized = matrix / np.where(norms == 0, 1, norms)
    return normalized.T @ normalized  # songs x songs grid of scores

def discover(user, top_n=2):
    history = plays[user]
    # Score each song by how similar it is to everything this user plays.
    scores = song_similarity(plays) @ history
    scores[history > 0] = -np.inf  # never recommend songs they already know
    best = np.argsort(scores)[::-1][:top_n]
    return [songs[i] for i in best]

print("Discover Weekly for Ana:", discover(0))
# -> Discover Weekly for Ana: ['Bad Guy', 'Stay']`,
    },
    {
      id: 'top-tracks-sql',
      title: 'Top 10 songs per country',
      file: 'analytics/queries/top_tracks_by_country.sql',
      language: 'SQL (BigQuery)',
      explanation:
        'This query reads a week of listening events and counts a play as a stream only after 30 seconds, the rule Spotify publicly uses for counting streams. A window function (RANK ... OVER) numbers songs within each country so we can keep the top 10. Queries like this can scan billions of rows because BigQuery spreads the work across many machines.',
      code: `-- Top 10 songs in each country over the last 7 days.
WITH streams AS (
  SELECT
    user_country,
    track_id,
    COUNT(*) AS stream_count,
    COUNT(DISTINCT user_id) AS listeners
  FROM \`analytics.listening_events\`
  WHERE event_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
    AND ms_played >= 30000  -- only plays of 30+ seconds count
  GROUP BY user_country, track_id
),
ranked AS (
  SELECT
    *,
    RANK() OVER (PARTITION BY user_country ORDER BY stream_count DESC) AS chart_position
  FROM streams
)
SELECT
  r.user_country,
  r.chart_position,
  t.title,
  t.artist_name,
  r.stream_count,
  r.listeners
FROM ranked AS r
JOIN \`catalog.tracks\` AS t
  ON t.track_id = r.track_id
WHERE r.chart_position <= 10
ORDER BY r.user_country, r.chart_position;`,
    },
  ],

  playground: {
    title: 'Now Playing screen',
    description:
      'A tiny clone of the Spotify now-playing screen: gradient album art, a working play/pause button, a progress bar that moves while music "plays", a like button and an Up next queue you can tap.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Now Playing</title>
<style>
:root {
  --brand: #1DB954; /* @tweak color "Brand green" */
  --glow: #6D2E8C; /* @tweak color "Top glow" */
  --bg: #121212; /* @tweak color "Background" */
  --art-size: 240px; /* @tweak range 160 300 "Album art size" */
  --radius: 8px; /* @tweak range 0 32 "Corner radius" */
}
* { box-sizing: border-box; }
body {
  margin: 0; min-height: 100vh; padding: 14px 20px 24px; color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: linear-gradient(180deg, var(--glow) 0%, var(--bg) 60%);
}
.top { display: flex; justify-content: space-between; align-items: center; }
.top div { text-align: center; }
.top small { display: block; font-size: 10px; letter-spacing: 1.5px; opacity: .75; }
.top b { font-size: 13px; }
.art {
  width: var(--art-size); height: var(--art-size); max-width: 100%;
  margin: 22px auto; border-radius: var(--radius); display: grid; place-items: center;
  font-size: 64px; box-shadow: 0 16px 40px rgba(0,0,0,.5);
}
.row { display: flex; align-items: center; justify-content: space-between; }
h1 { font-size: 22px; margin: 0; }
.artist { color: #b3b3b3; margin-top: 4px; }
button { background: none; border: 0; color: #fff; cursor: pointer; padding: 4px; }
.like svg { width: 26px; height: 26px; fill: none; stroke: #b3b3b3; stroke-width: 2; }
.like.on svg { fill: var(--brand); stroke: var(--brand); }
.bar { height: 5px; margin-top: 18px; background: rgba(255,255,255,.25); border-radius: 3px; cursor: pointer; }
.fill { height: 100%; width: 0; background: var(--brand); border-radius: 3px; }
.times { display: flex; justify-content: space-between; font-size: 11px; color: #b3b3b3; margin-top: 6px; }
.controls { display: flex; justify-content: center; align-items: center; gap: 36px; margin: 12px 0 20px; }
.controls svg { width: 30px; height: 30px; fill: currentColor; }
.controls .play { width: 64px; height: 64px; border-radius: 50%; background: var(--brand); color: #000; display: grid; place-items: center; }
.play .i-pause, .play.playing .i-play { display: none; }
.play.playing .i-pause { display: block; }
h2 { font-size: 16px; margin: 0 0 8px; }
ul { list-style: none; margin: 0; padding: 0; }
li { display: flex; align-items: center; gap: 12px; padding: 8px; border-radius: var(--radius); cursor: pointer; }
li:hover { background: rgba(255,255,255,.08); }
.mini { width: 44px; height: 44px; flex-shrink: 0; border-radius: calc(var(--radius) / 2); }
li b { display: block; font-size: 14px; }
li small, .hint { color: #b3b3b3; font-size: 12px; }
</style>
</head>
<body>
<header class="top">
  <svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 9l7 7 7-7" stroke="#fff" stroke-width="2" fill="none"/></svg>
  <div>
    <small data-edit="context">PLAYING FROM PLAYLIST</small>
    <b data-edit="playlist">Code and Chill</b>
  </div>
  <span>•••</span>
</header>

<div class="art" id="art"></div>

<div class="row">
  <div>
    <h1 id="title"></h1>
    <div class="artist" id="artist"></div>
  </div>
  <button class="like" id="like" aria-label="Like">
    <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>
  </button>
</div>

<div class="bar" id="bar"><div class="fill" id="fill"></div></div>
<div class="times"><span id="now">0:00</span><span id="len">0:00</span></div>

<div class="controls">
  <button id="prev" aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M6 5h2v14H6zM20 5v14L9 12z"/></svg></button>
  <button class="play" id="play" aria-label="Play or pause">
    <svg class="i-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
    <svg class="i-pause" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
  </button>
  <button id="next" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M16 5h2v14h-2zM4 5v14l11-7z"/></svg></button>
</div>

<h2 data-edit="upnext">Up next</h2>
<ul id="queue"></ul>
<p class="hint" data-edit="hint">Tap a song to play it</p>

<script>
// Our pretend catalog. Each album cover is just a CSS gradient!
const songs = [
  { title: 'Midnight Compile', artist: 'The Semicolons', len: 194, emoji: '🌙', art: 'linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)' },
  { title: 'Null Pointer Blues', artist: 'Big O', len: 171, emoji: '🎷', art: 'linear-gradient(135deg, #0f2027, #2c5364, #1db954)' },
  { title: 'Merge Conflict', artist: 'Byte Club', len: 208, emoji: '⚡', art: 'linear-gradient(135deg, #f7971e, #ffd200)' },
  { title: 'Recursion (Again)', artist: 'Lo-Fi Loops', len: 156, emoji: '🌀', art: 'radial-gradient(circle at 30% 30%, #43cea2, #185a9d)' },
  { title: 'Hello, World', artist: 'Stack Overflowers', len: 183, emoji: '👋', art: 'linear-gradient(160deg, #ee0979, #ff6a00)' }
];

let current = 0;    // which song is on screen
let position = 0;   // seconds played so far
let playing = false;
const $ = (id) => document.getElementById(id);

// 75 seconds -> "1:15"
function formatTime(sec) {
  const s = Math.floor(sec);
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

function drawProgress() {
  const song = songs[current];
  $('fill').style.width = (position / song.len) * 100 + '%';
  $('now').textContent = formatTime(position);
  $('len').textContent = formatTime(song.len);
}

// Redraw the screen from our variables (the "state")
function render() {
  const song = songs[current];
  $('title').textContent = song.title;
  $('artist').textContent = song.artist;
  $('art').style.background = song.art;
  $('art').textContent = song.emoji;
  $('like').classList.toggle('on', !!song.liked);
  $('play').classList.toggle('playing', playing);
  drawProgress();

  // "Up next" = the songs after this one, wrapping around to the start
  const queue = $('queue');
  queue.innerHTML = '';
  for (let step = 1; step < songs.length; step++) {
    const i = (current + step) % songs.length;
    const li = document.createElement('li');
    li.innerHTML = '<span class="mini"></span><div><b></b><small></small></div>';
    li.querySelector('.mini').style.background = songs[i].art;
    li.querySelector('b').textContent = songs[i].title;
    li.querySelector('small').textContent = songs[i].artist;
    li.onclick = () => playSong(i);
    queue.appendChild(li);
  }
}

function playSong(i) {
  current = (i + songs.length) % songs.length;
  position = 0;
  playing = true;
  render();
}

$('play').onclick = () => { playing = !playing; render(); };
$('next').onclick = () => playSong(current + 1);
$('prev').onclick = () => playSong(current - 1);
$('like').onclick = () => { songs[current].liked = !songs[current].liked; render(); };

// Tap the bar to jump ("seek") to that spot in the song
$('bar').onclick = (e) => {
  const box = $('bar').getBoundingClientRect();
  position = ((e.clientX - box.left) / box.width) * songs[current].len;
  drawProgress();
};

// Our fake audio engine: every second, move forward if playing
setInterval(() => {
  if (!playing) return;
  position += 1;
  if (position >= songs[current].len) playSong(current + 1);
  else drawProgress();
}, 1000);

render();
</script>
</body>
</html>`,
    challenges: [
      'Change the "Brand green" tweak to your favorite color and watch the play button, progress bar and like heart all update.',
      'Add a sixth song to the songs array with your own title, emoji and CSS gradient album art.',
      'Songs move forward one second at a time. Make the progress bar move 10x faster by changing the setInterval code.',
      'Add a repeat button: when it is on, a song that ends starts again instead of jumping to the next one.',
    ],
  },

  concepts: [
    {
      term: 'Audio streaming & caching',
      meaning:
        'Instead of downloading a whole song first, the app fetches small chunks as it plays, and keeps recent or downloaded songs on your device so they start instantly and work offline.',
    },
    {
      term: 'CDN (content delivery network)',
      meaning:
        'A network of servers around the world that store copies of files close to users, so downloads travel a much shorter distance.',
    },
    {
      term: 'Microservices',
      meaning:
        'Building the backend as many small, independent programs (search, playback, playlists) that talk over the network, so each team can update its piece without redeploying everything.',
    },
    {
      term: 'Publish/subscribe (event delivery)',
      meaning:
        "Services publish messages about things that happened to a shared channel, and any other service can subscribe to receive them, so senders and receivers don't need to know about each other.",
    },
    {
      term: 'Collaborative filtering',
      meaning:
        'Recommending things by finding patterns across many users: if people who like what you like also love a song you have not heard, it is probably a good pick.',
    },
    {
      term: 'Batch processing',
      meaning:
        'Running a big computation over a large pile of saved data all at once (for example, every week) instead of instantly for each request.',
    },
    {
      term: 'Data warehouse',
      meaning:
        'A database built for analyzing huge amounts of historical data with SQL, rather than for answering quick requests from an app.',
    },
    {
      term: 'Squads & tribes',
      meaning:
        "Spotify's well-known way of organizing engineers into small, self-directed teams (squads) that each own a part of the product, grouped into larger areas (tribes).",
    },
  ],

  buildYourOwn: [
    {
      step: 'Collect a few songs',
      detail:
        'Use Creative Commons tracks from the Free Music Archive or record your own with Audacity, and save them as MP3 files in a folder.',
    },
    {
      step: 'Build the player screen',
      detail:
        'Make a page with an HTML <audio> element, a play button and a progress bar using plain JavaScript, or try React with Vite once you are comfortable.',
    },
    {
      step: 'Serve songs from a backend',
      detail:
        'Write a small Node.js + Express (or Python + Flask) server with a /songs endpoint that returns a JSON list and serves the audio files.',
    },
    {
      step: 'Save playlists and likes',
      detail:
        'Store users, playlists and liked songs in a database such as SQLite, or use Supabase to get a hosted Postgres database with sign-in built in.',
    },
    {
      step: 'Log plays and make a mini "Wrapped"',
      detail:
        'Save a row every time someone listens for 30+ seconds, then use SQL GROUP BY and ORDER BY to show each user their top songs.',
    },
    {
      step: 'Add simple recommendations and deploy',
      detail:
        'Write a "people who liked this also liked" script with Python and pandas, then deploy the frontend to Vercel and the backend to Render.',
    },
  ],

  sources: [
    { label: 'Spotify on Wikipedia', url: 'https://en.wikipedia.org/wiki/Spotify' },
    { label: 'Spotify Engineering blog', url: 'https://engineering.atspotify.com/' },
    { label: 'Spotify newsroom: company info', url: 'https://newsroom.spotify.com/company-info/' },
    { label: 'Backstage (open-source developer portal)', url: 'https://backstage.io/' },
    { label: 'Luigi on GitHub', url: 'https://github.com/spotify/luigi' },
  ],
};
