import type { Teardown } from '../types';

export const tiktok: Teardown = {
  id: 'tiktok',
  name: 'TikTok',
  url: 'tiktok.com',
  tagline: 'Swipe through an endless feed of short videos picked just for you.',
  category: 'Social Media',
  brandColor: '#FE2C55',
  accentColor: '#25F4EE',
  logoGlyph: '🎵',
  source: 'curated',

  eli5:
    "TikTok is like a TV channel that reprograms itself for you after every video. Each time you swipe, the app tells TikTok's servers what you watched to the end, liked or skipped, and a recommendation system uses those clues to pick what comes next. The videos stream from servers close to where you live, and the app starts loading the next one before you even swipe, so it feels instant.",

  facts: [
    { label: 'Launched', value: '2017 worldwide (its Chinese sister app Douyin launched in 2016)' },
    { label: 'Parent company', value: 'ByteDance, founded in Beijing in 2012' },
    { label: 'ByteDance founders', value: 'Zhang Yiming and Liang Rubo' },
    { label: 'Users', value: '1 billion+ monthly active users (announced 2021)' },
    { label: 'Main screen', value: 'The For You feed, chosen by a recommendation system' },
    { label: 'US user traffic', value: "Routed to Oracle's cloud since 2022 (\"Project Texas\")" },
    { label: 'Known for (tech)', value: "ByteDance's Monolith paper on real-time recommendations (2022)" },
  ],

  history: [
    {
      year: '2012',
      title: 'ByteDance is founded',
      detail:
        'Zhang Yiming and Liang Rubo started ByteDance in Beijing. Its first big hit was Toutiao, a news app that used algorithms to pick articles for each reader, an idea TikTok would later apply to video.',
    },
    {
      year: '2016',
      title: 'Douyin launches in China',
      detail:
        "ByteDance released a short-video app in China in September 2016 and soon named it Douyin. It is TikTok's sister app, but it runs as a separate product for Chinese users.",
    },
    {
      year: '2017',
      title: 'TikTok goes global and buys Musical.ly',
      detail:
        'ByteDance launched TikTok for markets outside China. In November it bought Musical.ly, a lip-sync video app popular with US teens, for a reported price of about $1 billion.',
    },
    {
      year: '2018',
      title: 'Musical.ly merges into TikTok',
      detail:
        "In August 2018 the Musical.ly app was shut down and its users' accounts were moved into TikTok, giving the app a big audience in the US and Europe.",
    },
    {
      year: '2020',
      title: 'Explaining the For You feed',
      detail:
        'TikTok published a post describing how its recommendations use signals like likes, shares, comments, whether you watch a video to the end, and each video\'s captions, sounds and hashtags. The same year India banned the app and the US government pushed ByteDance to sell it.',
    },
    {
      year: '2021',
      title: '1 billion users and open-source Go tools',
      detail:
        'TikTok announced 1 billion monthly users. ByteDance also open-sourced CloudWeGo, a set of Go frameworks for building microservices, starting with the Kitex RPC framework.',
    },
    {
      year: '2022',
      title: 'Project Texas and the Monolith paper',
      detail:
        "TikTok said all US user traffic was now routed to Oracle's cloud. ByteDance researchers also published Monolith, a paper on training recommendation models in real time.",
    },
    {
      year: '2023',
      title: 'TikTok Shop and a hearing in Congress',
      detail:
        "CEO Shou Zi Chew answered US lawmakers' questions about data and safety in March, and in September TikTok Shop launched in the US so people could buy products inside the app.",
    },
    {
      year: '2024',
      title: 'Sell-or-ban law in the US',
      detail:
        "In April the US passed a law saying ByteDance had to sell TikTok's US business or the app would be banned from US app stores and hosting services.",
    },
    {
      year: '2025',
      title: 'Supreme Court ruling and a new US joint venture',
      detail:
        'In January the US Supreme Court upheld the law. TikTok went offline for US users for about 12 hours before service came back while the government delayed enforcement. In December ByteDance signed a deal to move TikTok\'s US business into a new joint venture with investors including Oracle, Silver Lake and MGX, which was completed in January 2026.',
    },
  ],

  languages: [
    { name: 'Go', usedFor: 'Backend microservices and APIs (ByteDance open-sourced its Go frameworks)', share: 30 },
    { name: 'C++', usedFor: 'Fast recommendation serving, video processing and the camera effects engine', share: 20 },
    { name: 'Python', usedFor: 'Training machine-learning models and data analysis', share: 15 },
    { name: 'Kotlin / Java', usedFor: 'The Android app', share: 12 },
    { name: 'Swift / Objective-C', usedFor: 'The iPhone app', share: 12 },
    { name: 'TypeScript / JavaScript', usedFor: 'The tiktok.com website and internal web tools', share: 11 },
  ],

  stack: [
    {
      layer: 'Mobile',
      items: [
        {
          name: 'Swift & Objective-C (iOS)',
          role: 'iPhone app languages',
          beginnerNote:
            "These are Apple's languages for iPhone apps; TikTok hasn't published its code, but an app this size is almost certainly built with them.",
          confidence: 'likely',
        },
        {
          name: 'Kotlin & Java (Android)',
          role: 'Android app languages',
          beginnerNote: 'The standard languages for Android apps, so they are the natural choice for the Android version of TikTok.',
          confidence: 'likely',
        },
        {
          name: 'Video preloading player',
          role: 'Instant, looping playback',
          beginnerNote:
            'The app quietly downloads the first seconds of the next few videos before you swipe, like a waiter bringing the next dish before you ask.',
          confidence: 'likely',
        },
        {
          name: 'Camera effects engine',
          role: 'Filters, green screen and AR effects',
          beginnerNote:
            "Code that edits every camera frame in real time, many times per second, to add filters or stickers; big apps usually share one C++ engine between iPhone and Android.",
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Frontend',
      items: [
        {
          name: 'React',
          role: 'tiktok.com user interface',
          beginnerNote:
            'A popular JavaScript library that builds web pages out of reusable pieces called components, such as one "video card" used over and over.',
          confidence: 'likely',
        },
        {
          name: 'TypeScript',
          role: 'Safer JavaScript',
          beginnerNote:
            'JavaScript with types added, so mistakes like passing a number where text was expected are caught before the site ships.',
          confidence: 'likely',
        },
        {
          name: 'HTML5 video + scroll snapping',
          role: 'Playing and swiping videos in the browser',
          beginnerNote:
            'The browser\'s built-in <video> player shows each clip, and CSS "scroll snap" makes the page stop neatly on one video at a time.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Go',
          role: 'Main language for microservices',
          beginnerNote:
            'A simple, fast language designed for servers that juggle many requests at once, and ByteDance has open-sourced several Go frameworks it uses internally.',
          confidence: 'likely',
        },
        {
          name: 'Kitex (CloudWeGo)',
          role: 'Calls between microservices (RPC)',
          beginnerNote:
            "ByteDance's open-source Go framework that lets one service call a function on another server almost as easily as calling a function in its own code.",
          confidence: 'likely',
        },
        {
          name: 'Hertz (CloudWeGo)',
          role: 'HTTP APIs',
          beginnerNote:
            'Another open-source Go framework from ByteDance, built for answering web requests like "give me the next videos" very quickly.',
          confidence: 'likely',
        },
        {
          name: 'Thrift / Protobuf',
          role: 'Contracts between services',
          beginnerNote:
            'A shared file describes each request and response, and code for both sides is generated from it, so services always agree on the shape of the data.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'Apache Kafka',
          role: 'Stream of events (views, likes, uploads)',
          beginnerNote:
            "A giant, ordered log that many programs can read at once; ByteDance's Monolith paper describes feeding user actions through Kafka to train models.",
          confidence: 'likely',
        },
        {
          name: 'Apache Flink',
          role: 'Real-time stream processing',
          beginnerNote:
            'Processes events the moment they arrive, for example matching "this video was shown" with "and it was watched to the end" a few seconds later.',
          confidence: 'likely',
        },
        {
          name: 'MySQL',
          role: 'Accounts, videos and comments',
          beginnerNote: 'A classic database that stores data in tables, split across many machines because no single computer could hold it all.',
          confidence: 'likely',
        },
        {
          name: 'Redis',
          role: 'In-memory cache',
          beginnerNote:
            "Super-fast short-term memory for things like like counts and the list of videos you've already seen, so the main database isn't asked every time.",
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Oracle Cloud Infrastructure',
          role: 'Hosts US user data (Project Texas)',
          beginnerNote:
            "Because of government concerns, TikTok announced in 2022 that US users' traffic runs through Oracle's cloud servers in the United States.",
          confidence: 'confirmed',
        },
        {
          name: 'Content delivery networks',
          role: 'Deliver the video files',
          beginnerNote:
            'Copies of popular videos sit on servers all over the world, so your video travels from a nearby city instead of across an ocean.',
          confidence: 'likely',
        },
        {
          name: 'Object storage',
          role: 'Holds the original and resized videos',
          beginnerNote:
            'A huge warehouse for files; databases only keep the address of each video, while the heavy video bytes live here.',
          confidence: 'likely',
        },
        {
          name: 'Kubernetes',
          role: 'Runs thousands of service copies',
          beginnerNote:
            'Software that starts, restarts and spreads out containers (packaged programs) across many servers, like a manager assigning shifts.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'For You recommendation system',
          role: 'Chooses every video in your feed',
          beginnerNote:
            'TikTok has publicly explained that it ranks videos using what you watch, like, share and comment on, plus details like captions, sounds and hashtags.',
          confidence: 'confirmed',
        },
        {
          name: 'Monolith (ByteDance research)',
          role: 'Real-time model training',
          beginnerNote:
            "A system ByteDance described in 2022 that keeps training on live user actions and copies the updated per-user and per-video numbers to serving machines every few minutes; TikTok hasn't said exactly where it is used.",
          confidence: 'likely',
        },
        {
          name: 'Automated moderation models',
          role: 'Flag harmful uploads',
          beginnerNote:
            'TikTok says uploaded videos are first checked by automated systems, which remove clear rule-breaking and send unclear cases to human moderators.',
          confidence: 'confirmed',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      // Tier 0: clients
      {
        id: 'mobile-app',
        label: 'TikTok app',
        kind: 'client',
        tier: 0,
        tech: 'iOS (Swift) & Android (Kotlin)',
        description:
          'The app on your phone. It plays videos, records new ones with the camera, and reports what you watch back to TikTok.',
      },
      {
        id: 'web-app',
        label: 'tiktok.com',
        kind: 'client',
        tier: 0,
        tech: 'React (TypeScript)',
        description: 'The website version, with the same vertical feed, running inside your browser.',
      },
      // Tier 1: edge
      {
        id: 'cdn',
        label: 'Video CDN',
        kind: 'edge',
        tier: 1,
        tech: 'Content delivery networks',
        description:
          'Servers spread around the world that keep copies of videos, so the bytes only travel a short distance to your phone.',
      },
      {
        id: 'load-balancer',
        label: 'Load balancer',
        kind: 'edge',
        tier: 1,
        tech: 'Edge load balancers',
        description:
          'The front door for app requests. It spreads millions of requests across many servers so none of them gets overloaded.',
      },
      // Tier 2: API / gateway
      {
        id: 'api-gateway',
        label: 'API gateway',
        kind: 'gateway',
        tier: 2,
        tech: 'Go HTTP services (Hertz-style)',
        description:
          'Checks who you are and forwards each request, like "next videos" or "like this", to the right internal service.',
      },
      {
        id: 'upload-api',
        label: 'Upload API',
        kind: 'gateway',
        tier: 2,
        tech: 'Go service with resumable, chunked uploads',
        description:
          'Receives big video files in small pieces, so a shaky connection only has to resend one piece instead of the whole video.',
      },
      // Tier 3: services & workers
      {
        id: 'feed-service',
        label: 'For You feed service',
        kind: 'service',
        tier: 3,
        tech: 'Go microservice (Kitex RPC)',
        description:
          "Gathers a pool of candidate videos, removes ones you've seen, asks the recommender to score them and returns the best batch.",
      },
      {
        id: 'recommender',
        label: 'Ranking models',
        kind: 'ml',
        tier: 3,
        tech: 'Deep-learning ranking models',
        description:
          'Predicts how likely you are to watch, like or share each candidate video, so the highest scores go to the top of your feed.',
      },
      {
        id: 'trainer',
        label: 'Real-time trainer',
        kind: 'ml',
        tier: 3,
        tech: 'Streaming training (Monolith-style)',
        description:
          'Keeps learning from fresh likes and watch times and sends updated model numbers to the ranking servers every few minutes.',
      },
      {
        id: 'transcoder',
        label: 'Video processing',
        kind: 'service',
        tier: 3,
        tech: 'Transcoding workers + safety classifiers',
        description:
          'Turns each upload into several sizes and qualities for different phones and connections, and runs automated safety checks.',
      },
      // Tier 4: data & storage
      {
        id: 'video-storage',
        label: 'Video storage',
        kind: 'storage',
        tier: 4,
        tech: 'Object storage',
        description:
          'Where the actual video files live. Databases only store a key pointing to each file, while this system holds the heavy bytes.',
      },
      {
        id: 'metadata-db',
        label: 'Metadata database',
        kind: 'database',
        tier: 4,
        tech: 'Sharded MySQL-style databases',
        description:
          'Stores facts about accounts and videos, such as captions, authors, likes and comments, split across many machines.',
      },
      {
        id: 'cache',
        label: 'Cache',
        kind: 'cache',
        tier: 4,
        tech: 'Redis-style in-memory store',
        description:
          "Very fast temporary memory for hot data like like counts and the list of videos you've already seen.",
      },
      {
        id: 'event-log',
        label: 'Event log',
        kind: 'queue',
        tier: 4,
        tech: 'Apache Kafka-style event streams',
        description:
          'An ordered log of everything happening, like "video shown", "watched 90%" or "new upload", that other systems read at their own pace.',
      },
    ],
    edges: [
      { from: 'mobile-app', to: 'load-balancer', label: 'HTTPS (API)' },
      { from: 'web-app', to: 'load-balancer', label: 'HTTPS' },
      { from: 'mobile-app', to: 'cdn', label: 'HTTPS (video chunks)' },
      { from: 'web-app', to: 'cdn', label: 'HTTPS (video)' },
      { from: 'cdn', to: 'video-storage', label: 'fetch on cache miss' },
      { from: 'load-balancer', to: 'api-gateway', label: 'HTTP' },
      { from: 'load-balancer', to: 'upload-api', label: 'HTTP (chunked upload)' },
      { from: 'api-gateway', to: 'feed-service', label: 'RPC' },
      { from: 'api-gateway', to: 'metadata-db', label: 'SQL (likes, comments)' },
      { from: 'api-gateway', to: 'cache', label: 'get / incr' },
      { from: 'api-gateway', to: 'event-log', label: 'publish events' },
      { from: 'feed-service', to: 'recommender', label: 'RPC (score videos)' },
      { from: 'feed-service', to: 'cache', label: 'seen-videos list' },
      { from: 'feed-service', to: 'metadata-db', label: 'video details' },
      { from: 'event-log', to: 'trainer', label: 'stream of actions' },
      { from: 'trainer', to: 'recommender', label: 'sync fresh model' },
      { from: 'upload-api', to: 'video-storage', label: 'store original' },
      { from: 'upload-api', to: 'metadata-db', label: 'create video row' },
      { from: 'upload-api', to: 'event-log', label: 'video uploaded' },
      { from: 'event-log', to: 'transcoder', label: 'processing job' },
      { from: 'transcoder', to: 'video-storage', label: 'save renditions' },
      { from: 'transcoder', to: 'metadata-db', label: 'mark ready' },
    ],
    flows: [
      {
        id: 'open-for-you',
        title: 'You open the For You feed',
        emoji: '📱',
        steps: [
          {
            from: 'mobile-app',
            to: 'load-balancer',
            narration: 'You open TikTok, and the app asks for a batch of videos over a secure HTTPS connection.',
          },
          {
            from: 'load-balancer',
            to: 'api-gateway',
            narration: 'The load balancer picks an API server that is not too busy and passes the request along.',
          },
          {
            from: 'api-gateway',
            to: 'feed-service',
            narration: 'The gateway checks your login and asks the For You feed service to build your next batch.',
          },
          {
            from: 'feed-service',
            to: 'cache',
            narration: "The feed service grabs the list of videos you've already seen from the cache, so you don't get repeats.",
          },
          {
            from: 'feed-service',
            to: 'recommender',
            narration:
              'It sends a pool of candidate videos to the ranking models, which score each one by how likely you are to enjoy it.',
          },
          {
            from: 'feed-service',
            to: 'metadata-db',
            narration: 'The top videos get their details filled in: caption, creator, sound and where the video file lives.',
          },
          {
            from: 'mobile-app',
            to: 'cdn',
            narration:
              'Your phone gets the list and streams the first video from a nearby CDN server, while quietly loading the next one too.',
          },
        ],
      },
      {
        id: 'like-video',
        title: 'You like a video',
        emoji: '❤️',
        steps: [
          {
            from: 'mobile-app',
            to: 'load-balancer',
            narration: 'You tap the heart. It turns red instantly on your screen, and a tiny "like" request is sent in the background.',
          },
          {
            from: 'load-balancer',
            to: 'api-gateway',
            narration: 'The request is routed to an API server.',
          },
          {
            from: 'api-gateway',
            to: 'metadata-db',
            narration: 'The server saves who liked which video in the database, so it is remembered for good.',
          },
          {
            from: 'api-gateway',
            to: 'cache',
            narration: 'It bumps the like count in the cache by one, so everyone sees the new number without recounting.',
          },
          {
            from: 'api-gateway',
            to: 'event-log',
            narration:
              'It also publishes a "user liked video" event to the event log, alongside events for how long you watched.',
          },
          {
            from: 'event-log',
            to: 'trainer',
            narration:
              'The real-time trainer reads the event and nudges the numbers that describe your taste and that video.',
          },
          {
            from: 'trainer',
            to: 'recommender',
            narration:
              'Within minutes the updated model reaches the ranking servers, so your next batches reflect what you just liked.',
          },
        ],
      },
      {
        id: 'post-video',
        title: 'You post a video',
        emoji: '🎬',
        steps: [
          {
            from: 'mobile-app',
            to: 'load-balancer',
            narration: 'You tap Post. The app compresses your clip and starts sending it in small chunks.',
          },
          {
            from: 'load-balancer',
            to: 'upload-api',
            narration: 'Upload traffic goes to the upload API, which is built to receive large files and resume if a chunk fails.',
          },
          {
            from: 'upload-api',
            to: 'video-storage',
            narration: 'Once every chunk arrives, the original video file is saved in object storage.',
          },
          {
            from: 'upload-api',
            to: 'event-log',
            narration: 'Instead of making you wait, it publishes a "new video uploaded" event and tells your phone it worked.',
          },
          {
            from: 'event-log',
            to: 'transcoder',
            narration:
              'Video-processing workers pick up the event, make versions in different qualities and run automated safety checks.',
          },
          {
            from: 'transcoder',
            to: 'video-storage',
            narration: 'The new versions are saved next to the original, ready for CDN servers to copy.',
          },
          {
            from: 'transcoder',
            to: 'metadata-db',
            narration: 'Finally the video is marked ready, so the feed service can start showing it to a first small group of viewers.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'ios/Feed/ForYouViewController.swift', note: 'The full-screen, swipeable For You feed on iPhone' },
    { path: 'ios/Player/FeedPlayerPool.swift', note: 'Keeps the current video playing and preloads the next ones' },
    { path: 'ios/Camera/RecordViewController.swift', note: 'Camera screen for recording clips with effects' },
    { path: 'android/feed/ForYouFragment.kt', note: 'The Android For You feed screen' },
    { path: 'android/analytics/WatchTimeTracker.kt', note: 'Measures how long you watch each video and batches events' },
    { path: 'effects-engine/src/filter_pipeline.cpp', note: 'Shared C++ code that applies camera filters on both platforms' },
    { path: 'web/src/components/ForYouFeed.tsx', note: 'React component for the vertical feed on tiktok.com' },
    { path: 'idl/feed.thrift', note: 'The contract describing feed requests and responses' },
    { path: 'services/gateway/main.go', note: 'HTTP API gateway that checks logins and routes requests' },
    { path: 'services/feed/for_you.go', note: 'Builds your next batch: candidates, filter, rank' },
    { path: 'services/interactions/like.go', note: 'Saves likes and comments and publishes events' },
    { path: 'services/upload/chunked_upload.go', note: 'Receives videos in resumable chunks' },
    { path: 'workers/transcode/profiles.yaml', note: 'Which resolutions and qualities to create for each upload' },
    { path: 'recsys/ranking/model.py', note: 'Model that predicts watch time and likes for each video' },
    { path: 'recsys/training/online_trainer.py', note: 'Learns from the live event stream and publishes updates' },
    { path: 'recsys/embeddings/hash_table.cc', note: 'Fast lookup table giving every user and video its own numbers' },
    { path: 'streams/topics.yaml', note: 'Names of event streams like video_views and likes' },
    { path: 'deploy/k8s/feed-service.yaml', note: 'How many copies of the feed service to run' },
  ],

  code: [
    {
      id: 'go-for-you-feed',
      title: 'Building a For You batch',
      file: 'services/feed/for_you.go',
      language: 'Go',
      explanation:
        "A simplified Go feed service showing the classic recommendation recipe: gather candidates, drop videos you've already watched, let a model score the rest, then sort. The last loop reflects something TikTok has described publicly: the feed tries not to show videos from the same creator back to back.",
      code: `package feed

import "context"
import "sort"

type Video struct {
	ID, AuthorID int64
	Score        float64
}

type Deps interface { // each method is really a call to another microservice over RPC
	Candidates(ctx context.Context, userID int64) ([]Video, error) // "similar to what you liked", "popular near you"
	HasSeen(ctx context.Context, userID, videoID int64) bool
	Score(ctx context.Context, userID int64, videos []Video) error // the ranking model fills in each Score
}

// ForYou picks the next batch of videos for one person.
func ForYou(ctx context.Context, d Deps, userID int64, batch int) ([]Video, error) {
	pool, err := d.Candidates(ctx, userID) // 1. a big pool of maybe-interesting videos
	if err != nil {
		return nil, err
	}
	var fresh []Video
	for _, v := range pool {
		if !d.HasSeen(ctx, userID, v.ID) { // 2. skip what you've already watched
			fresh = append(fresh, v)
		}
	}
	if err := d.Score(ctx, userID, fresh); err != nil { // 3. predict how much you'll enjoy each one
		return nil, err
	}
	sort.Slice(fresh, func(i, j int) bool { return fresh[i].Score > fresh[j].Score })
	out := make([]Video, 0, batch) // 4. best first, but not the same creator twice in a row
	for _, v := range fresh {
		if len(out) < batch && (len(out) == 0 || out[len(out)-1].AuthorID != v.AuthorID) {
			out = append(out, v)
		}
	}
	return out, nil
}`,
    },
    {
      id: 'python-online-training',
      title: 'Learning from every swipe in real time',
      file: 'recsys/training/online_trainer.py',
      language: 'Python',
      explanation:
        "Inspired by ideas in ByteDance's Monolith paper, this toy trainer gives every user and video its own list of numbers (an embedding), ignores IDs until they appear a few times, and updates the numbers after each event instead of retraining once a day. Every so often it pushes the fresh numbers to the servers that rank feeds. Real systems use frameworks and many machines; this shows the core idea in plain Python.",
      code: `import math
import random

DIM = 8             # how many numbers describe each user or video
MIN_COUNT = 3       # ignore brand-new IDs until they show up a few times
LEARNING_RATE = 0.05

vectors, id_counts = {}, {}


def vector_for(key):
    # "Collisionless": every ID gets its own row instead of sharing a slot
    id_counts[key] = id_counts.get(key, 0) + 1
    if id_counts[key] < MIN_COUNT:
        return None  # too rare to be worth the memory yet
    if key not in vectors:
        vectors[key] = [random.gauss(0, 0.1) for _ in range(DIM)]
    return vectors[key]


def train_on_event(event):
    """event = {"user": 42, "video": 987, "watched_ratio": 0.9, "liked": False}"""
    u = vector_for(("user", event["user"]))
    v = vector_for(("video", event["video"]))
    if u is None or v is None:
        return
    label = 1.0 if event["liked"] or event["watched_ratio"] > 0.8 else 0.0
    guess = 1 / (1 + math.exp(-sum(a * b for a, b in zip(u, v))))  # 0..1 "will they enjoy it?"
    error = guess - label
    for i in range(DIM):  # nudge both lists so the next guess is closer
        u[i], v[i] = u[i] - LEARNING_RATE * error * v[i], v[i] - LEARNING_RATE * error * u[i]


def run_trainer(event_stream, publish_to_ranking_servers, sync_every=10_000):
    for n, event in enumerate(event_stream, start=1):  # e.g. events read from Kafka
        train_on_event(event)
        if n % sync_every == 0:
            publish_to_ranking_servers(vectors)  # feeds now use the updated numbers`,
    },
    {
      id: 'swift-preload-player',
      title: 'Preloading the next videos (iPhone)',
      file: 'ios/Player/FeedPlayerPool.swift',
      language: 'Swift',
      explanation:
        "Swiping feels instant because the next video is already loading before you swipe. This AVFoundation sketch keeps a player for the current video plus the next two, frees players that scrolled far away (video uses lots of memory), and uses AVPlayerLooper so each clip repeats until you move on.",
      code: `import AVFoundation

/// Keeps the on-screen video playing and quietly loads the next ones,
/// so a swipe shows the next video right away instead of a spinner.
final class FeedPlayerPool {
    private var players: [URL: AVQueuePlayer] = [:]
    private var loopers: [URL: AVPlayerLooper] = [:]  // replays a clip until you swipe
    private let lookahead = 2  // how many upcoming videos to get ready

    private func player(for url: URL) -> AVQueuePlayer {
        if let existing = players[url] { return existing }
        let player = AVQueuePlayer()
        loopers[url] = AVPlayerLooper(player: player, templateItem: AVPlayerItem(url: url))
        players[url] = player  // the player now starts loading this video
        return player
    }

    /// Call this every time the user lands on a video in the feed.
    func didShowVideo(at index: Int, in urls: [URL]) {
        let wanted = Set(urls[index..<min(index + 1 + lookahead, urls.count)])

        // Free players that are no longer near the screen
        for url in players.keys where !wanted.contains(url) {
            players[url]?.pause()
            players[url] = nil
            loopers[url] = nil
        }

        for url in wanted where url != urls[index] {
            player(for: url).pause()  // warm up upcoming videos, but keep them paused
        }

        let current = player(for: urls[index])
        current.seek(to: .zero)
        current.play()
    }
}`,
    },
    {
      id: 'kotlin-watch-time',
      title: 'Measuring watch time (Android)',
      file: 'android/analytics/WatchTimeTracker.kt',
      language: 'Kotlin',
      explanation:
        "TikTok has said that finishing a longer video is a strong sign of interest, weighted more than weak signals like whether you and the creator are in the same country. This tracker times how long each video stays on screen, then sends events in batches of 20 so the app makes one network request instead of twenty. If the phone is offline, the events are kept and sent later.",
      code: `import android.os.SystemClock
import java.io.IOException

data class WatchEvent(val videoId: Long, val watchedMs: Long, val lengthMs: Long, val liked: Boolean)

interface EventApi { suspend fun send(events: List<WatchEvent>) }  // POST /v1/events with a JSON list

class WatchTimeTracker(private val api: EventApi) {
    private val pending = mutableListOf<WatchEvent>()
    private var currentId: Long? = null
    private var startedAt = 0L
    private var liked = false

    fun onVideoShown(videoId: Long) {
        currentId = videoId
        startedAt = SystemClock.elapsedRealtime()  // not affected if someone changes the phone's clock
        liked = false
    }

    fun onLiked() { liked = true }

    suspend fun onVideoHidden(lengthMs: Long) {
        val id = currentId ?: return
        pending += WatchEvent(id, SystemClock.elapsedRealtime() - startedAt, lengthMs, liked)
        currentId = null
        if (pending.size >= 20) flush()  // one request for 20 events, not 20 requests
    }

    suspend fun flush() {
        if (pending.isEmpty()) return
        val batch = pending.toList()
        pending.clear()
        try {
            api.send(batch)
        } catch (e: IOException) {
            pending.addAll(0, batch)  // offline? keep them and try again later
        }
    }
}`,
    },
    {
      id: 'react-autoplay-feed',
      title: 'Autoplaying the video on screen (web)',
      file: 'web/src/components/ForYouFeed.tsx',
      language: 'TypeScript (React)',
      explanation:
        "On a website, a vertical feed can be mostly CSS: scroll snapping stops the page on one video at a time. Each React item uses the browser's IntersectionObserver to play its video only while at least 60% of it is visible, and to pause and rewind it when you scroll away.",
      code: `import { useEffect, useRef } from 'react';

type Video = { id: string; src: string; caption: string; author: string };

// One full-screen video that plays only while it is (mostly) on screen.
function FeedItem({ video }: { video: Video }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {}); // browsers can block autoplay, so ignore that error
        } else {
          el.pause();
          el.currentTime = 0; // start from the beginning next time
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect(); // clean up when the item is removed
  }, []);

  return (
    <section className="feed-item">
      <video ref={ref} src={video.src} loop muted playsInline preload="metadata" />
      <p className="caption">
        <strong>@{video.author}</strong> {video.caption}
      </p>
    </section>
  );
}

// CSS does the swiping: .feed { height: 100vh; overflow-y: scroll; scroll-snap-type: y mandatory; }
export default function ForYouFeed({ videos }: { videos: Video[] }) {
  return <main className="feed">{videos.map((v) => <FeedItem key={v.id} video={v} />)}</main>;
}`,
    },
  ],

  playground: {
    title: 'Mini For You feed',
    description:
      'A tiny TikTok-style feed: full-screen gradient "videos" with a caption and username, a right-side action rail with a heart you can toggle, comment and share buttons, and tap or swipe up to jump to the next video.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mini TikTok</title>
<style>
:root {
  --brand: #FE2C55; /* @tweak color "Heart color" */
  --accent: #25F4EE; /* @tweak color "Accent color" */
  --video-tint: #7B2FF7; /* @tweak color "Video gradient" */
  --rail-size: 46px; /* @tweak range 32 64 "Button size" */
  --caption-size: 15px; /* @tweak range 11 22 "Caption size" */
  --radius: 0px; /* @tweak range 0 28 "Video corners" */
}
* { box-sizing: border-box; }
html, body { height: 100%; }
body { margin: 0; background: #000; color: #fff; overflow: hidden;
  font: 14px/1.35 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
button { background: none; border: 0; padding: 0; color: inherit; font: inherit; cursor: pointer; } p { margin: 0; }

/* The feed scrolls up and down and "snaps" to one full-screen video at a time */
.feed { height: 100%; overflow-y: scroll; scroll-snap-type: y mandatory; scrollbar-width: none; } .feed::-webkit-scrollbar { display: none; }
.video {
  position: relative; height: 100%; display: grid; place-items: center; overflow: hidden;
  scroll-snap-align: start; scroll-snap-stop: always;
  border-radius: var(--radius); user-select: none; -webkit-user-select: none;
}
/* Each "video" is just a CSS gradient with a bouncing emoji */
.v1 { background: linear-gradient(160deg, var(--video-tint), #FF6A88); }
.v2 { background: linear-gradient(200deg, #0F2027, var(--video-tint) 60%, #2C5364); }
.v3 { background: linear-gradient(140deg, #F7971E, var(--video-tint)); }
.scene { font-size: 120px; animation: bob 1.6s ease-in-out infinite; } @keyframes bob { 50% { transform: translateY(-14px) rotate(-4deg); } }

/* Following / For You tabs */
.tabs { position: fixed; top: 0; left: 0; right: 0; z-index: 2; display: flex; justify-content: center; gap: 20px; padding: 14px; }
.tab { font-weight: 700; font-size: 16px; opacity: 0.6; padding-bottom: 4px; border-bottom: 2px solid transparent; }
.tab.active { opacity: 1; border-color: var(--accent); }

/* Right-side action rail */
.rail { position: absolute; right: 10px; bottom: 96px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
.rail button { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 12px; font-weight: 600; }
.avatar, .icon { width: var(--rail-size); height: var(--rail-size); border-radius: 50%; display: grid; place-items: center; }
.avatar { border: 2px solid #fff; background: var(--accent); font-size: calc(var(--rail-size) * 0.5); }
.icon { background: rgba(0, 0, 0, 0.2); font-size: calc(var(--rail-size) * 0.5); }
.icon svg { width: 62%; height: 62%; fill: #fff; }
.heart.liked svg { fill: var(--brand); animation: pop 0.35s; } @keyframes pop { 50% { transform: scale(1.35); } }

/* Caption area, spinning sound disc and progress bar */
.info { position: absolute; left: 12px; right: 84px; bottom: 26px; font-size: var(--caption-size); text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6); }
.user { font-weight: 700; margin-bottom: 4px; }
.sound { font-size: 13px; margin-top: 6px; }
.disc { position: absolute; right: 16px; bottom: 26px; width: 40px; height: 40px; border-radius: 50%;
  background: radial-gradient(circle, var(--accent) 0 22%, #222 24%); animation: spin 4s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }
.progress { position: absolute; left: 0; bottom: 0; height: 3px; width: 0; background: var(--accent); }
.video.playing .progress { animation: fill 8s linear infinite; } @keyframes fill { to { width: 100%; } }
.toast { position: fixed; left: 50%; top: 50%; z-index: 3; transform: translate(-50%, -50%); padding: 10px 16px;
  border-radius: 8px; background: rgba(0, 0, 0, 0.75); opacity: 0; transition: opacity 0.2s; pointer-events: none; }
.toast.show { opacity: 1; }
</style>
</head>
<body>
  <svg width="0" height="0" style="position:absolute"><symbol id="heart" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></symbol></svg>

  <nav class="tabs">
    <button class="tab">Following</button>
    <button class="tab active" data-edit="tab">For You</button>
  </nav>

  <main class="feed" id="feed">
    <section class="video v1 playing">
      <span class="scene">🕺</span>
      <div class="rail">
        <div class="avatar">🦊</div>
        <button class="heart" data-count="12400"><span class="icon"><svg><use href="#heart"/></svg></span><span class="count">12,400</span></button>
        <button class="comment"><span class="icon">💬</span>318</button>
        <button class="share"><span class="icon">↪️</span>Share</button>
      </div>
      <div class="info">
        <p class="user" data-edit="username">@dance.with.dev</p>
        <p class="caption" data-edit="caption">When the code finally compiles on the first try #fyp #coding</p>
        <p class="sound">♫ <span data-edit="sound">original sound - dance.with.dev</span></p>
      </div>
      <div class="disc"></div>
      <div class="progress"></div>
    </section>
    <section class="video v2">
      <span class="scene">🌌</span>
      <div class="rail">
        <div class="avatar">🐙</div>
        <button class="heart" data-count="98100"><span class="icon"><svg><use href="#heart"/></svg></span><span class="count">98,100</span></button>
        <button class="comment"><span class="icon">💬</span>1,204</button>
        <button class="share"><span class="icon">↪️</span>Share</button>
      </div>
      <div class="info">
        <p class="user">@night.sky.facts</p>
        <p class="caption" data-edit="caption-2">Light from some stars left before the dinosaurs #space</p>
        <p class="sound">♫ calm synth - lofi.lab</p>
      </div>
      <div class="disc"></div>
      <div class="progress"></div>
    </section>
    <section class="video v3">
      <span class="scene">🍜</span>
      <div class="rail">
        <div class="avatar">🐼</div>
        <button class="heart" data-count="4521"><span class="icon"><svg><use href="#heart"/></svg></span><span class="count">4,521</span></button>
        <button class="comment"><span class="icon">💬</span>87</button>
        <button class="share"><span class="icon">↪️</span>Share</button>
      </div>
      <div class="info">
        <p class="user">@dorm.chef</p>
        <p class="caption">3-minute ramen upgrade for exam week #studentlife</p>
        <p class="sound">♫ original sound - dorm.chef</p>
      </div>
      <div class="disc"></div>
      <div class="progress"></div>
    </section>
  </main>
  <div class="toast" id="toast"></div>

<script>
  const feed = document.getElementById('feed');
  const videos = Array.from(document.querySelectorAll('.video'));
  const toast = document.getElementById('toast');

  // Which video is on screen? Divide the scroll position by one screen height.
  function currentIndex() {
    return Math.round(feed.scrollTop / feed.clientHeight);
  }

  // Scroll to the next video, wrapping back to the first one at the end
  function goNext() {
    const next = (currentIndex() + 1) % videos.length;
    feed.scrollTo({ top: next * feed.clientHeight, behavior: 'smooth' });
  }

  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 1200);
  }

  feed.addEventListener('click', (e) => {
    const heart = e.target.closest('.heart');
    if (heart) {
      // Update the heart and count right away (optimistic UI)
      const liked = heart.classList.toggle('liked');
      const count = Number(heart.dataset.count) + (liked ? 1 : -1);
      heart.dataset.count = count;
      heart.querySelector('.count').textContent = count.toLocaleString();
      return;
    }
    if (e.target.closest('.comment')) return showToast('💬 Comments would slide up here');
    if (e.target.closest('.share')) return showToast('🔗 Link copied!');
    if (e.target.closest('.rail, [data-edit]')) return; // don't skip while editing text
    goNext(); // tapping the video itself moves on
  });

  // Only the video on screen is "playing", so only its progress bar runs
  feed.addEventListener('scroll', () => {
    const i = currentIndex();
    videos.forEach((v, n) => v.classList.toggle('playing', n === i));
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown' && !e.target.isContentEditable) goNext(); });

  // Following / For You tabs: highlight the one you tapped
  document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => {
    document.querySelector('.tab.active').classList.remove('active');
    tab.classList.add('active');
  }));
</script>
</body>
</html>`,
    challenges: [
      'Change --brand to #25F4EE, then tap a heart: it fills aqua instead of red. Now change --video-tint and watch all three "videos" change color at once.',
      'Drag Button size to 60px and Caption size to 20px, then set Video corners to 24px and swipe up to see rounded video cards.',
      'Edit the username and caption, then find 8s in the CSS and change it to 3s so the progress bar races along the bottom.',
      'Add a fourth video: copy one <section class="video ..."> block, change its emoji and caption, and notice that tapping now cycles through four videos.',
    ],
  },

  concepts: [
    {
      term: 'Recommendation system',
      meaning:
        'A program that predicts what each person will enjoy and orders content by those predictions, instead of just showing the newest posts from people you follow.',
    },
    {
      term: 'Embedding',
      meaning:
        'A list of numbers that describes something, like a user or a video, so that similar things end up with similar numbers and a computer can compare them.',
    },
    {
      term: 'Real-time (online) training',
      meaning:
        'Updating a machine-learning model continuously as new actions happen, rather than retraining it from scratch once a day, so recommendations react within minutes.',
    },
    {
      term: 'Event stream',
      meaning:
        'An ordered log of things that happened, like "video watched" or "video liked", that many different programs can read and react to at their own pace.',
    },
    {
      term: 'Microservices & RPC',
      meaning:
        'Building a big app out of many small programs that each do one job, which talk to each other using remote procedure calls (calling a function on another computer).',
    },
    {
      term: 'CDN (content delivery network)',
      meaning:
        'A worldwide network of servers that keep copies of files like videos so your device downloads them from somewhere nearby and they start quickly.',
    },
    {
      term: 'Transcoding',
      meaning:
        'Converting a video into other sizes, qualities or formats, so a phone on slow mobile data and a laptop on fast Wi-Fi can each get a version that works well.',
    },
    {
      term: 'Preloading',
      meaning:
        "Starting to download something you'll probably need next, like the next video in the feed, before you ask for it, so it appears instantly.",
    },
  ],

  buildYourOwn: [
    {
      step: 'Sketch your data',
      detail:
        'Plan tables for users, videos, likes, follows and views. Give views a watched_ms column, because watch time will power your recommendations later.',
    },
    {
      step: 'Upload and process videos',
      detail:
        'Upload files to a storage service like Supabase Storage or Cloudflare R2, then use FFmpeg in a background job to make a smaller 720p copy and a thumbnail.',
    },
    {
      step: 'Build the swipeable feed',
      detail:
        'In an Expo (React Native) app, use a FlatList with pagingEnabled so each video fills the screen, and play only the item that is currently visible with expo-video.',
    },
    {
      step: 'Log what people watch',
      detail:
        'Record when each video appears and disappears, calculate the watch time, and send events to your API in small batches instead of one request per swipe.',
    },
    {
      step: 'Write a simple recommender',
      detail:
        'Start with a score like (completion rate × 2) + likes + a bonus for new videos, skip anything the user has seen, and sort by score. Try embeddings once that works.',
    },
    {
      step: 'Make it feel instant',
      detail:
        'Serve videos through a CDN, preload the next video while the current one plays, and cache like counts in Redis so the feed stays fast as it grows.',
    },
  ],

  sources: [
    { label: 'Wikipedia: TikTok', url: 'https://en.wikipedia.org/wiki/TikTok' },
    { label: 'Wikipedia: ByteDance', url: 'https://en.wikipedia.org/wiki/ByteDance' },
    { label: 'TikTok Newsroom', url: 'https://newsroom.tiktok.com' },
    { label: 'Monolith: Real Time Recommendation System (arXiv paper)', url: 'https://arxiv.org/abs/2209.07663' },
    { label: 'CloudWeGo (Kitex & Hertz by ByteDance)', url: 'https://www.cloudwego.io' },
  ],
};
