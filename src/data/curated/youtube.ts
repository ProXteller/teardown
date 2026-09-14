import type { Teardown } from '../types';

export const youtube: Teardown = {
  id: 'youtube',
  name: 'YouTube',
  url: 'youtube.com',
  tagline: 'Watch, upload and share videos with billions of people.',
  category: 'Video Sharing',
  brandColor: '#FF0000',
  accentColor: '#282828',
  logoGlyph: '▶️',
  source: 'curated',

  eli5:
    "YouTube is like a giant video library that anyone can add to. When someone uploads a video, YouTube's computers turn it into many copies at different sizes and qualities, store them, and keep popular ones on servers close to viewers all over the world. When you press play, your device downloads a few seconds at a time and quietly switches between sharper and blurrier copies to match your internet speed, while a recommendation system guesses what you'll want to watch next.",

  facts: [
    { label: 'Launched', value: '2005 (first video uploaded April 23, 2005)' },
    { label: 'Founders', value: 'Chad Hurley, Steve Chen & Jawed Karim (all ex-PayPal)' },
    { label: 'Parent company', value: 'Google (bought for $1.65 billion in 2006)' },
    { label: 'Headquarters', value: 'San Bruno, California' },
    { label: 'Users', value: '2 billion+ logged-in monthly users (per YouTube)' },
    { label: 'Uploads', value: '500+ hours of video every minute (2019 figure)' },
    { label: 'Known for (tech)', value: 'Created Vitess, now an open-source CNCF database project' },
  ],

  history: [
    {
      year: '2005',
      title: '"Me at the zoo"',
      detail:
        'Former PayPal employees Chad Hurley, Steve Chen and Jawed Karim started YouTube in early 2005. On April 23, Karim uploaded the very first video, a clip under 20 seconds long filmed at the San Diego Zoo.',
    },
    {
      year: '2006',
      title: 'Google buys YouTube',
      detail:
        'Less than two years after it started, Google bought YouTube for $1.65 billion in stock. Over time YouTube moved onto Google’s own servers and data centers.',
    },
    {
      year: '2007',
      title: 'Partner Program and Content ID',
      detail:
        'YouTube began sharing ad money with creators through its Partner Program, and started testing "Video Identification", the system later renamed Content ID, which automatically spots copyrighted music and video inside uploads.',
    },
    {
      year: '2009',
      title: 'Full HD and automatic captions',
      detail:
        'YouTube added 1080p HD playback and started generating automatic captions with Google’s speech recognition, so spoken words could appear as text under videos.',
    },
    {
      year: '2010',
      title: 'Vitess is born',
      detail:
        'To stop its MySQL databases from buckling under traffic, YouTube engineers started building Vitess, which splits data across many MySQL servers and routes each query to the right one. It was later open-sourced and, in November 2019, became a "graduated" project of the Cloud Native Computing Foundation (CNCF), a sign it is mature and widely used.',
    },
    {
      year: '2015',
      title: 'HTML5 player by default and YouTube Kids',
      detail:
        'In January YouTube made its HTML5 player the default in modern browsers, replacing Flash, using Media Source Extensions to change video quality mid-stream. The YouTube Kids app launched the following month.',
    },
    {
      year: '2016',
      title: 'Deep learning recommendations',
      detail:
        'Google researchers published "Deep Neural Networks for YouTube Recommendations" at the RecSys conference, describing a two-stage system: one network picks a few hundred candidate videos and a second one ranks them.',
    },
    {
      year: '2017',
      title: 'Polymer redesign and YouTube TV',
      detail:
        'YouTube rolled out a redesigned desktop site built with Polymer, Google’s web components library, and launched YouTube TV, a live TV streaming subscription in the United States.',
    },
    {
      year: '2020',
      title: 'Shorts',
      detail:
        'YouTube Shorts, short vertical videos you swipe through, launched as a beta in India in September 2020 and rolled out worldwide in 2021.',
    },
    {
      year: '2021',
      title: 'Argos, a chip just for video',
      detail:
        'Google revealed Argos, a custom "video coding unit" chip designed to convert uploaded videos into streamable formats far more efficiently than regular server processors.',
    },
  ],

  languages: [
    { name: 'C++', usedFor: 'Speed-critical services such as video processing and serving', share: 25 },
    { name: 'JavaScript', usedFor: 'The youtube.com web app and its video player (Polymer web components)', share: 20 },
    { name: 'Python', usedFor: 'The original YouTube website, tooling and machine-learning code', share: 15 },
    { name: 'Java / Kotlin', usedFor: 'The Android app and backend services on Google infrastructure', share: 15 },
    { name: 'Swift / Objective-C', usedFor: 'The iPhone and iPad app', share: 15 },
    { name: 'Go', usedFor: 'Vitess, the system that shards YouTube’s MySQL databases', share: 10 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'Polymer (web components)',
          role: 'Building blocks of youtube.com',
          beginnerNote:
            'Google’s library for making custom HTML tags like a reusable video card, and YouTube rebuilt its desktop site with it in 2017.',
          confidence: 'confirmed',
        },
        {
          name: 'HTML5 video + Media Source Extensions',
          role: 'Playing video in the browser',
          beginnerNote:
            'A browser feature that lets JavaScript feed the video player small chunks one at a time, which is what makes switching quality mid-video possible.',
          confidence: 'confirmed',
        },
        {
          name: 'DASH adaptive streaming',
          role: 'Changing quality on the fly',
          beginnerNote:
            'Each video is cut into few-second pieces at several qualities, and the player picks which quality to download next based on your connection speed.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Mobile',
      items: [
        {
          name: 'Swift / Objective-C (iOS)',
          role: 'iPhone and iPad app',
          beginnerNote:
            'These are Apple’s languages for iPhone apps, so they are the natural choice for YouTube’s iOS app.',
          confidence: 'likely',
        },
        {
          name: 'Java / Kotlin (Android)',
          role: 'Android app',
          beginnerNote:
            'The standard languages for Android apps, used to build screens like the watch page and the Shorts feed.',
          confidence: 'likely',
        },
        {
          name: 'ExoPlayer (Media3)',
          role: 'Android video player',
          beginnerNote:
            'Google’s open-source Android video player that understands DASH streaming, which makes it a natural fit for playing YouTube videos.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Python',
          role: 'Original web app language',
          beginnerNote:
            'Early YouTube engineers described in public talks how the first site was written mostly in Python because it let a small team build features quickly.',
          confidence: 'confirmed',
        },
        {
          name: 'C++ and Java services',
          role: 'Heavy-duty backend programs',
          beginnerNote:
            'Most of Google’s large backend systems are written in these fast, compiled languages, and YouTube now runs on that same infrastructure.',
          confidence: 'likely',
        },
        {
          name: 'Protocol Buffers',
          role: 'Messages between services',
          beginnerNote:
            'Google’s compact data format, like a smaller, stricter JSON, which programs use to send requests to each other quickly.',
          confidence: 'likely',
        },
        {
          name: 'Content ID',
          role: 'Copyright matching',
          beginnerNote:
            'Compares the sound and picture of every upload with reference files from rights holders, who can then block, track or earn money from matching videos.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'MySQL',
          role: 'Video and channel records',
          beginnerNote:
            'A classic table-based database that YouTube used from its early days for data like video titles, channels and users.',
          confidence: 'confirmed',
        },
        {
          name: 'Vitess',
          role: 'Sharding MySQL',
          beginnerNote:
            'Created at YouTube and written in Go, it spreads one huge database over many MySQL servers while apps still send normal SQL queries.',
          confidence: 'confirmed',
        },
        {
          name: 'Bigtable',
          role: 'Huge key-value storage',
          beginnerNote:
            'Google’s giant spreadsheet-like storage system, which early YouTube talks said was used to serve video thumbnails.',
          confidence: 'confirmed',
        },
        {
          name: 'Spanner',
          role: 'Globally distributed SQL',
          beginnerNote:
            'Google’s database that keeps data consistent across data centers worldwide; many Google products use it, so parts of YouTube probably do too.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Google data centers',
          role: 'Where the servers live',
          beginnerNote:
            'Since the 2006 acquisition, YouTube has grown onto Google’s own enormous server buildings instead of renting space elsewhere.',
          confidence: 'confirmed',
        },
        {
          name: 'Google Global Cache',
          role: 'Video caches near viewers',
          beginnerNote:
            'Google places cache servers inside internet providers’ own networks, so popular videos travel a short distance to reach you.',
          confidence: 'confirmed',
        },
        {
          name: 'QUIC (HTTP/3)',
          role: 'Faster connections',
          beginnerNote:
            'A newer internet protocol designed at Google that sets up connections faster and copes better with patchy mobile networks, reducing buffering.',
          confidence: 'confirmed',
        },
        {
          name: 'VP9 and AV1 codecs',
          role: 'Squeezing video smaller',
          beginnerNote:
            'Codecs are recipes for compressing video, and these newer ones deliver the same picture quality with fewer bytes than the older H.264.',
          confidence: 'confirmed',
        },
        {
          name: 'Argos video chips',
          role: 'Hardware for transcoding',
          beginnerNote:
            'Custom chips Google built just for converting videos, which do the job with far less power than general-purpose processors.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Two-stage recommender',
          role: 'Home page and Up next',
          beginnerNote:
            'One neural network narrows millions of videos down to a few hundred candidates, then a second one ranks them for you.',
          confidence: 'confirmed',
        },
        {
          name: 'TensorFlow',
          role: 'Training the models',
          beginnerNote:
            'Google’s open-source machine-learning toolkit. The 2016 YouTube recommendations paper says its system was built on Google Brain’s software, which had just been open-sourced as TensorFlow.',
          confidence: 'confirmed',
        },
        {
          name: 'Speech recognition',
          role: 'Automatic captions',
          beginnerNote:
            'Models that listen to a video’s audio and write out the words, so captions appear even when the creator did not type any.',
          confidence: 'confirmed',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      // Tier 0: clients
      {
        id: 'web',
        label: 'youtube.com',
        kind: 'client',
        tier: 0,
        tech: 'Polymer web components (JavaScript)',
        description:
          'The YouTube website running in your browser. It shows the home grid and watch page, and plays video with the HTML5 player.',
      },
      {
        id: 'mobile',
        label: 'YouTube app',
        kind: 'client',
        tier: 0,
        tech: 'iOS (Swift) & Android (Kotlin)',
        description:
          'The phone app for watching, swiping through Shorts and uploading videos. It talks to the same backend as the website.',
      },
      {
        id: 'studio',
        label: 'YouTube Studio',
        kind: 'client',
        tier: 0,
        tech: 'Web app for creators',
        description:
          'Where creators edit titles and thumbnails, reply to comments and check how many people watched their videos.',
      },
      // Tier 1: edge
      {
        id: 'gfe',
        label: 'Google Front End',
        kind: 'edge',
        tier: 1,
        tech: 'Google Front End load balancers (HTTPS / QUIC)',
        description:
          'Google’s front door for internet traffic. It handles the secure connection and sends each request to a backend server that is not too busy.',
      },
      {
        id: 'ggc',
        label: 'Edge caches (CDN)',
        kind: 'edge',
        tier: 1,
        tech: 'Google Global Cache & Google edge network',
        description:
          'Servers all over the world, some sitting inside internet providers’ buildings, that keep copies of video chunks and thumbnails close to viewers.',
      },
      // Tier 2: API / gateway
      {
        id: 'api',
        label: 'YouTube API servers',
        kind: 'gateway',
        tier: 2,
        tech: 'Internal API (Protocol Buffers)',
        description:
          'The programs that answer app requests like "give me the watch page for this video" by gathering details from many other services.',
      },
      {
        id: 'upload',
        label: 'Upload service',
        kind: 'gateway',
        tier: 2,
        tech: 'Resumable upload endpoint',
        description:
          'Receives big video files in chunks and remembers how much has arrived, so a dropped connection does not mean starting over.',
      },
      // Tier 3: services & workers
      {
        id: 'transcode-queue',
        label: 'Processing queue',
        kind: 'queue',
        tier: 3,
        tech: 'Internal job queue',
        description:
          'A waiting line of "process this video" jobs, so the upload service can reply right away while the slow work happens later.',
      },
      {
        id: 'transcoder',
        label: 'Transcoders',
        kind: 'service',
        tier: 3,
        tech: 'Encoders on CPUs + Argos chips (H.264, VP9, AV1)',
        description:
          'Workers that convert each upload into many sizes (from 144p up to 4K and beyond) and codecs, then cut them into few-second chunks for streaming.',
      },
      {
        id: 'content-id',
        label: 'Content ID',
        kind: 'service',
        tier: 3,
        tech: 'Audio & video fingerprint matching',
        description:
          'Makes a compact "fingerprint" of each upload and compares it with copyrighted reference files to find matches.',
      },
      {
        id: 'recs',
        label: 'Recommender',
        kind: 'ml',
        tier: 3,
        tech: 'Deep neural networks (TensorFlow)',
        description:
          'Picks videos for your home page and Up next list by predicting which ones you will actually enjoy watching, not just click.',
      },
      // Tier 4: data & storage
      {
        id: 'vitess',
        label: 'Video metadata DB',
        kind: 'database',
        tier: 4,
        tech: 'MySQL sharded with Vitess',
        description:
          'Stores facts about videos and channels, like titles, owners and processing status. Vitess splits the data across many MySQL servers and routes each query to the right one.',
      },
      {
        id: 'bigtable',
        label: 'Activity store',
        kind: 'database',
        tier: 4,
        tech: 'Bigtable (likely)',
        description:
          'A huge key-value store for fast-growing data like what each person watched, which the recommender reads to understand your tastes.',
      },
      {
        id: 'video-store',
        label: 'Video file storage',
        kind: 'storage',
        tier: 4,
        tech: 'Google distributed file storage (Colossus)',
        description:
          'Where the actual video bytes live: the original upload plus every converted version. Databases only store where each file is.',
      },
    ],
    edges: [
      { from: 'web', to: 'gfe', label: 'HTTPS / QUIC' },
      { from: 'mobile', to: 'gfe', label: 'HTTPS / QUIC' },
      { from: 'studio', to: 'gfe', label: 'HTTPS' },
      { from: 'web', to: 'ggc', label: 'video chunks & thumbnails' },
      { from: 'mobile', to: 'ggc', label: 'video chunks (DASH)' },
      { from: 'ggc', to: 'video-store', label: 'fetch on cache miss' },
      { from: 'gfe', to: 'api', label: 'RPC (Protocol Buffers)' },
      { from: 'gfe', to: 'upload', label: 'upload chunks' },
      { from: 'upload', to: 'video-store', label: 'save original' },
      { from: 'upload', to: 'vitess', label: 'create video row' },
      { from: 'upload', to: 'transcode-queue', label: 'enqueue job' },
      { from: 'transcode-queue', to: 'transcoder', label: 'next job' },
      { from: 'transcoder', to: 'video-store', label: 'save renditions' },
      { from: 'transcoder', to: 'content-id', label: 'fingerprints' },
      { from: 'transcoder', to: 'vitess', label: 'mark as ready' },
      { from: 'content-id', to: 'vitess', label: 'save match result' },
      { from: 'api', to: 'vitess', label: 'SQL via Vitess' },
      { from: 'api', to: 'bigtable', label: 'log watch event' },
      { from: 'api', to: 'recs', label: 'RPC (get recommendations)' },
      { from: 'recs', to: 'bigtable', label: 'read watch history' },
    ],
    flows: [
      {
        id: 'press-play',
        title: 'You press play on a video',
        emoji: '▶️',
        steps: [
          {
            from: 'mobile',
            to: 'gfe',
            narration:
              'You tap a video. The app sends its ID to the nearest Google front door, often over QUIC, a fast protocol built to cope with shaky mobile networks.',
          },
          {
            from: 'gfe',
            to: 'api',
            narration: 'The Google Front End unwraps the secure connection and passes the request to a YouTube API server.',
          },
          {
            from: 'api',
            to: 'vitess',
            narration:
              'The API server looks up the title, channel and which qualities exist. Vitess works out which MySQL shard holds that video’s row.',
          },
          {
            from: 'api',
            to: 'bigtable',
            narration:
              'It records that you started this video, which later shows up in your watch history and shapes future recommendations.',
          },
          {
            from: 'mobile',
            to: 'ggc',
            narration:
              'The app gets back a list of stream addresses and starts downloading the video a few seconds at a time from a cache server near you, maybe inside your own internet provider.',
          },
          {
            from: 'ggc',
            to: 'video-store',
            narration:
              'If that cache does not have the chunks yet (say, a rarely watched video), it fetches them from Google’s storage and keeps a copy for the next viewer.',
          },
        ],
      },
      {
        id: 'upload-video',
        title: 'You upload a video',
        emoji: '📤',
        steps: [
          {
            from: 'mobile',
            to: 'gfe',
            narration:
              'You pick a video and tap Upload. The app sends the file in big chunks, so a dropped connection only means re-sending one chunk.',
          },
          {
            from: 'gfe',
            to: 'upload',
            narration: 'The front end routes the chunks to the upload service, which keeps count of how many bytes have arrived.',
          },
          {
            from: 'upload',
            to: 'video-store',
            narration: 'When the last chunk lands, the original file is saved, untouched, in Google’s file storage.',
          },
          {
            from: 'upload',
            to: 'transcode-queue',
            narration:
              'The upload service drops a "process this video" job on the queue and your app shows "Processing…" instead of making you wait.',
          },
          {
            from: 'transcode-queue',
            to: 'transcoder',
            narration:
              'A transcoding worker picks up the job and re-encodes the video into many sizes, from 144p upward, using codecs like H.264, VP9 and AV1.',
          },
          {
            from: 'transcoder',
            to: 'video-store',
            narration: 'Each finished version is cut into few-second chunks and saved, ready to stream to anyone.',
          },
          {
            from: 'transcoder',
            to: 'content-id',
            narration:
              'The video’s audio and picture fingerprints go to Content ID, which checks them against copyrighted reference files.',
          },
        ],
      },
      {
        id: 'open-home',
        title: 'You open the home page',
        emoji: '🏠',
        steps: [
          {
            from: 'web',
            to: 'gfe',
            narration: 'You open youtube.com and your browser asks Google’s front end for your home page.',
          },
          {
            from: 'gfe',
            to: 'api',
            narration: 'The request is routed to a YouTube API server.',
          },
          {
            from: 'api',
            to: 'recs',
            narration: 'The API server asks the recommender which videos to show you.',
          },
          {
            from: 'recs',
            to: 'bigtable',
            narration:
              'The recommender reads your recent watches, then one model narrows millions of videos to a few hundred candidates and a second model ranks them by how long you would probably watch.',
          },
          {
            from: 'api',
            to: 'vitess',
            narration:
              'The recommender hands back a ranked list of video IDs, and the API server fills in titles, channel names and view counts from the metadata database.',
          },
          {
            from: 'web',
            to: 'ggc',
            narration:
              'Your browser downloads the thumbnail images from nearby Google edge servers, so the grid of videos appears quickly.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'web/src/components/watch-page.js', note: 'Web component for the watch page: player, title, channel row and comments' },
    { path: 'web/src/components/video-card.js', note: 'One thumbnail card in the home page grid' },
    { path: 'web/src/player/quality-picker.js', note: 'Chooses which video quality to download next' },
    { path: 'web/src/player/stream-loader.js', note: 'Feeds video chunks into the browser with Media Source Extensions' },
    { path: 'ios/Watch/WatchViewController.swift', note: 'The iPhone watch screen with the player and Up next list' },
    { path: 'ios/Upload/ResumableUploader.swift', note: 'Uploads a big video in chunks and resumes after a dropped connection' },
    { path: 'android/watch/WatchActivity.kt', note: 'The Android watch screen that plays video with ExoPlayer' },
    { path: 'android/shorts/ShortsPagerFragment.kt', note: 'Swipeable vertical Shorts feed that preloads the next clip' },
    { path: 'api/watch/watch_handler.py', note: 'Returns a video’s title, channel and stream addresses' },
    { path: 'upload/session_tracker.cc', note: 'Remembers how many bytes of each upload have arrived' },
    { path: 'transcoding/plan_renditions.cc', note: 'Decides which sizes and codecs to make for a new upload' },
    { path: 'transcoding/segmenter.cc', note: 'Cuts each encoded version into few-second chunks' },
    { path: 'streaming/manifests/example.mpd', note: 'A DASH manifest listing every quality and where its chunks live' },
    { path: 'contentid/matcher.cc', note: 'Compares upload fingerprints with copyrighted reference files' },
    { path: 'db/schema/videos.sql', note: 'Tables for videos, channels and subscriptions' },
    { path: 'db/vitess/vschema.json', note: 'Tells Vitess how each table is split across shards' },
    { path: 'db/vitess/shard_router.go', note: 'Toy version of how a query finds its shard' },
    { path: 'recs/two_stage.py', note: 'Candidate generation followed by ranking' },
    { path: 'recs/training/train_ranker.py', note: 'Trains the ranking model on past watch time' },
  ],

  code: [
    {
      id: 'web-quality-picker',
      title: 'Picking a video quality (web player)',
      file: 'web/src/player/quality-picker.js',
      language: 'JavaScript',
      explanation:
        'This is the core idea behind adaptive streaming like DASH. After every chunk downloads, the player updates its estimate of your internet speed, smoothing it so one fast or slow chunk does not cause wild jumps. It then picks the highest quality that fits inside a safety margin, and plays it safe when only a few seconds are buffered, because an empty buffer means the dreaded spinning wheel. Real players are far more sophisticated; this is a simplified sketch.',
      code: `// Every video exists at several qualities (bitrate = data per second).
const QUALITIES = [
  { label: '144p', kbps: 100 },
  { label: '360p', kbps: 500 },
  { label: '720p', kbps: 2500 },
  { label: '1080p', kbps: 5000 },
  { label: '2160p (4K)', kbps: 20000 },
];

let speedKbps = 1000; // running estimate of your download speed

// Called after each few-second chunk finishes downloading
function onChunkDownloaded(bytes, seconds) {
  const measured = (bytes * 8) / 1000 / seconds;
  speedKbps = 0.8 * speedKbps + 0.2 * measured; // smooth out random spikes
}

function pickQuality(bufferedSeconds) {
  // Little video buffered = close to stalling, so be extra careful
  const safety = bufferedSeconds < 10 ? 0.5 : 0.8;
  const budget = speedKbps * safety;
  let choice = QUALITIES[0];
  for (const q of QUALITIES) {
    if (q.kbps <= budget) choice = q; // keep the best one that fits
  }
  return choice;
}

async function fetchNextChunk(videoId, index, video) {
  const b = video.buffered;
  const bufferedSeconds = b.length ? b.end(b.length - 1) - video.currentTime : 0;
  const quality = pickQuality(bufferedSeconds);

  const started = performance.now();
  const response = await fetch('/chunks/' + videoId + '/' + quality.label + '/' + index);
  const data = await response.arrayBuffer();
  onChunkDownloaded(data.byteLength, (performance.now() - started) / 1000);
  return data; // appended to a Media Source Extensions buffer to play
}`,
    },
    {
      id: 'ios-resumable-upload',
      title: 'Uploading a big video in chunks (iPhone)',
      file: 'ios/Upload/ResumableUploader.swift',
      language: 'Swift',
      explanation:
        'Inspired by the resumable upload protocol Google documents for the YouTube Data API. The app sends the file in 8 MB pieces, each labelled with a Content-Range header saying which bytes it holds. The server replies 308 ("got it, send more") until the whole file arrives. If the connection drops, an empty request asks the server how many bytes it already has, so the upload continues instead of starting over. Error handling and retries are left out to keep it short.',
      code: `import Foundation

struct ResumableUploader {
    let fileURL: URL
    let sessionURL: URL                // unique upload address the server gave us
    let chunkSize = 8 * 1024 * 1024    // 8 MB per request

    func upload() async throws {
        let file = try FileHandle(forReadingFrom: fileURL)
        defer { try? file.close() }
        let total = try file.seekToEnd()                 // file size in bytes
        var offset = try await bytesAlreadyOnServer(total: total)

        while offset < total {
            try file.seek(toOffset: offset)
            let chunk = try file.read(upToCount: chunkSize) ?? Data()
            let last = offset + UInt64(chunk.count) - 1
            var request = URLRequest(url: sessionURL)
            request.httpMethod = "PUT"
            request.setValue("bytes \\(offset)-\\(last)/\\(total)", forHTTPHeaderField: "Content-Range")
            let (_, response) = try await URLSession.shared.upload(for: request, from: chunk)
            let status = (response as? HTTPURLResponse)?.statusCode ?? 0

            if status == 200 || status == 201 { return }  // the whole video arrived
            guard status == 308 else { throw URLError(.badServerResponse) }
            offset = last + 1                             // 308 means "send the next piece"
        }
    }

    // An empty PUT asks: "how much do you have?" The reply says e.g. "Range: bytes=0-999"
    private func bytesAlreadyOnServer(total: UInt64) async throws -> UInt64 {
        var request = URLRequest(url: sessionURL)
        request.httpMethod = "PUT"
        request.setValue("bytes */\\(total)", forHTTPHeaderField: "Content-Range")
        let (_, response) = try await URLSession.shared.data(for: request)
        guard let range = (response as? HTTPURLResponse)?.value(forHTTPHeaderField: "Range"),
              let end = UInt64(range.split(separator: "-").last ?? "") else { return 0 }
        return end + 1
    }
}`,
    },
    {
      id: 'cpp-rendition-plan',
      title: 'Planning the versions of an upload (transcoding)',
      file: 'transcoding/plan_renditions.cc',
      language: 'C++',
      explanation:
        'Before any encoding starts, a transcoding system decides which versions (renditions) to make. This sketch walks up a quality ladder and stops at the source resolution, since upscaling adds bytes but no detail. Every size gets H.264 for old devices and VP9 for smaller files; AV1 shrinks files even more but takes much more computing power to encode, so this plan saves it for videos expected to get lots of views. The bitrates and the view threshold are made-up teaching numbers.',
      code: `#include <iostream>
#include <string>
#include <utility>
#include <vector>

// One "rendition" = the same video at one size, in one codec.
struct Rendition {
  int height;         // 144, 360, 720, 1080 ...
  int bitrateKbps;    // how much data each second of video uses
  std::string codec;  // "h264", "vp9" or "av1"
};

// Illustrative quality ladder: {height, H.264 bitrate in kbps}
const std::vector<std::pair<int, int>> kLadder = {
    {144, 100}, {240, 250}, {360, 500}, {480, 1000},
    {720, 2500}, {1080, 5000}, {1440, 10000}, {2160, 20000}};

std::vector<Rendition> PlanRenditions(int sourceHeight, long long expectedViews) {
  std::vector<Rendition> plan;
  for (auto [height, kbps] : kLadder) {
    if (height > sourceHeight) break;  // never upscale: more bytes, no more detail
    plan.push_back({height, kbps, "h264"});         // plays on almost anything
    plan.push_back({height, kbps * 2 / 3, "vp9"});  // similar quality, fewer bytes
    // AV1 is even smaller but slow to encode, so spend that effort where it pays off
    if (expectedViews > 100000) plan.push_back({height, kbps / 2, "av1"});
  }
  return plan;
}

int main() {
  for (const Rendition& r : PlanRenditions(1080, 250000)) {
    std::cout << r.height << "p " << r.codec << " @ " << r.bitrateKbps << " kbps\\n";
  }
}`,
    },
    {
      id: 'go-vitess-routing',
      title: 'How a query finds its shard (Vitess-style)',
      file: 'db/vitess/shard_router.go',
      language: 'Go',
      explanation:
        'A toy version of the idea behind Vitess, the Go project YouTube created to shard MySQL. Each row is given a "keyspace ID" by hashing a column (here channel_id), and each shard owns a range of those IDs, named in hex like "-40" or "80-c0". Hashing spreads channels evenly so no single database gets overloaded. In real Vitess, a router called vtgate reads your SQL, finds the right shard and forwards the query, so the app never has to know shards exist.',
      code: `package main

import (
	"crypto/md5"
	"encoding/binary"
	"fmt"
)

// Shards cover back-to-back ranges of keyspace IDs, named after the range in hex.
type Shard struct {
	Name string
	End  uint64 // first ID of the next shard (0 means "all the way to the top")
}

var shards = []Shard{
	{"-40", 0x4000000000000000},
	{"40-80", 0x8000000000000000},
	{"80-c0", 0xc000000000000000},
	{"c0-", 0},
}

// Hashing scrambles channel IDs so channels spread evenly across shards.
func keyspaceID(channelID uint64) uint64 {
	sum := md5.Sum(binary.BigEndian.AppendUint64(nil, channelID))
	return binary.BigEndian.Uint64(sum[:8])
}

func shardFor(channelID uint64) Shard {
	id := keyspaceID(channelID)
	i := 0
	for shards[i].End != 0 && id >= shards[i].End {
		i++ // the ID is past this shard's range, so try the next one up
	}
	return shards[i]
}

func main() {
	// The router spots channel_id in the WHERE clause and asks only that shard.
	fmt.Println("SELECT title FROM videos WHERE channel_id = 42 -> shard", shardFor(42).Name)
}`,
    },
    {
      id: 'python-two-stage-recs',
      title: 'Two-stage recommendations (Python)',
      file: 'recs/two_stage.py',
      language: 'Python',
      explanation:
        'Inspired by the 2016 "Deep Neural Networks for YouTube Recommendations" paper. Stage 1 turns your watch history into a single "taste" vector and quickly finds a few hundred videos whose vectors point the same way. Stage 2 looks at each candidate more carefully and predicts expected watch time rather than clicks, which rewards videos people actually watch over clickbait. In the real system both stages are trained neural networks; here averaging and a tiny formula stand in for them.',
      code: `import numpy as np

# Stage 1: candidate generation. Narrow millions of videos to a few hundred.
def candidates(watched_ids, video_vectors, k=200):
    watched = set(watched_ids)
    taste = np.mean([video_vectors[v] for v in watched_ids], axis=0)  # your "taste" vector
    all_ids = list(video_vectors)
    matrix = np.array([video_vectors[v] for v in all_ids])
    similarity = matrix @ taste                  # dot product: bigger = more alike
    best_first = np.argsort(-similarity)
    return [all_ids[i] for i in best_first if all_ids[i] not in watched][:k]


# Stage 2: ranking. Score each candidate with richer signals.
def rank(candidate_ids, features, weights, top_n=20):
    scored = []
    for video_id in candidate_ids:
        f = features[video_id]
        x = np.array([
            f["topic_match"],             # how close to what you usually watch
            f["watched_channel_before"],  # 1 if you watched this channel, else 0
            f["days_since_upload"],       # freshness
            f["avg_fraction_watched"],    # do other viewers finish it?
        ])
        expected_minutes = np.exp(weights @ x)   # predict watch time, not clicks
        scored.append((expected_minutes, video_id))
    scored.sort(reverse=True)
    return [video_id for _, video_id in scored[:top_n]]


def home_page(user, video_vectors, features, weights):
    return rank(candidates(user["history"], video_vectors), features, weights)`,
    },
  ],

  playground: {
    title: 'Mini YouTube watch page',
    description:
      'A tiny YouTube watch page: a pretend video player with play/pause and a moving progress bar, the video title, a channel row with a Subscribe button, a like button and an Up next list you can tap to switch videos.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mini YouTube</title>
<style>
:root {
  --brand: #FF0000; /* @tweak color "Brand color" */
  --bg: #0F0F0F; /* @tweak color "Background" */
  --text: #F1F1F1; /* @tweak color "Text color" */
  --chip: #272727; /* @tweak color "Button color" */
  --radius: 10px; /* @tweak range 0 24 "Corner radius" */
  --bar: 4px; /* @tweak range 2 12 "Progress bar height" */
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text);
  font: 14px/1.4 Roboto, -apple-system, "Segoe UI", sans-serif; }
button { border: 0; background: none; color: inherit; font: inherit; cursor: pointer; }

/* Top bar with the logo */
.top { display: flex; align-items: center; gap: 6px; padding: 10px 12px; font-size: 18px; font-weight: 700; }
.logo { background: var(--brand); color: #fff; font-size: 11px; padding: 4px 7px; border-radius: 6px; }

/* The "video" is a CSS gradient with an emoji, shaped 16:9 like a real player */
.player { position: relative; width: 100%; aspect-ratio: 16 / 9; display: grid; place-items: center; overflow: hidden; }
.scene { font-size: 64px; }
.playing .scene { animation: bob 2s ease-in-out infinite; }
@keyframes bob { 50% { transform: translateY(-8px) rotate(-5deg); } }
.play { position: absolute; width: 60px; height: 42px; border-radius: var(--radius);
  background: var(--brand); color: #fff; font-size: 18px; transition: opacity 0.3s; }
.playing .play { opacity: 0.3; }
.track { position: absolute; left: 0; right: 0; bottom: 0; height: var(--bar); background: rgba(255, 255, 255, 0.3); }
.fill { height: 100%; width: 0; background: var(--brand); }
.time { position: absolute; right: 8px; bottom: calc(var(--bar) + 6px); font-size: 12px;
  background: rgba(0, 0, 0, 0.7); color: #fff; padding: 1px 6px; border-radius: 4px; }

/* Title, channel row and buttons */
.info { padding: 12px; }
.title { margin: 0 0 4px; font-size: 18px; line-height: 1.3; }
.meta, .subs, .item small { font-size: 12px; opacity: 0.7; }
.channel { display: flex; align-items: center; gap: 10px; margin: 12px 0; }
.avatar { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; background: var(--chip); font-size: 20px; }
.who { flex: 1; }
.name { font-weight: 600; }
.subscribe { background: var(--brand); color: #fff; padding: 8px 14px; border-radius: 999px; font-weight: 600; }
.subscribe.on { background: var(--chip); color: var(--text); }
.pill { background: var(--chip); padding: 7px 14px; border-radius: 999px; }
.pill.liked { color: var(--brand); font-weight: 600; }

/* Up next list */
.upnext { margin: 8px 12px; font-size: 16px; }
.item { display: flex; gap: 10px; width: 100%; padding: 6px 12px; text-align: left; }
.item.current { background: var(--chip); }
.thumb { flex: 0 0 136px; aspect-ratio: 16 / 9; border-radius: var(--radius); display: grid; place-items: center; font-size: 30px; }
.item b { display: block; font-weight: 500; }
</style>
</head>
<body>
  <header class="top"><span class="logo">▶</span> YouTube</header>

  <!-- Tap anywhere on the player to play or pause -->
  <div class="player" id="player">
    <span class="scene" id="scene">🚀</span>
    <button class="play" id="play" aria-label="Play">▶</button>
    <span class="time" id="time">0:00 / 0:30</span>
    <div class="track"><div class="fill" id="fill"></div></div>
  </div>

  <section class="info">
    <h1 class="title" id="title" data-edit="title">How a video reaches your screen</h1>
    <div class="meta" data-edit="meta">1.2M views · 3 days ago</div>
    <div class="channel">
      <div class="avatar">👩‍💻</div>
      <div class="who">
        <div class="name" data-edit="channel">Code Kitchen</div>
        <div class="subs" data-edit="subs">845K subscribers</div>
      </div>
      <button class="subscribe" id="subscribe">Subscribe</button>
    </div>
    <button class="pill" id="like">👍 <span id="likes">48,200</span></button>
    <button class="pill">↗ Share</button>
  </section>

  <h2 class="upnext" data-edit="up-next">Up next</h2>
  <div id="list"></div>

<script>
  // Each video: emoji "scene", two gradient colors, title, views, length in seconds
  const videos = [
    { emoji: '🚀', colors: ['#1e3c72', '#6dd5ed'], title: 'How a video reaches your screen', views: '1.2M views', length: 30 },
    { emoji: '🧠', colors: ['#8e2de2', '#f000ff'], title: 'Recommendations in 5 minutes', views: '860K views', length: 20 },
    { emoji: '🗄️', colors: ['#11998e', '#38ef7d'], title: 'Sharding databases with Vitess', views: '310K views', length: 25 },
    { emoji: '🎞️', colors: ['#f7971e', '#ffd200'], title: 'What is transcoding?', views: '540K views', length: 15 },
  ];

  // State
  let current = 0, playing = false, elapsed = 0, subscribed = false, liked = false, likes = 48200;
  const $ = (id) => document.getElementById(id);

  const fmt = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const gradient = (v) => 'linear-gradient(135deg, ' + v.colors[0] + ', ' + v.colors[1] + ')';

  function renderPlayer() {
    const v = videos[current];
    $('player').classList.toggle('playing', playing);
    $('play').textContent = playing ? '❚❚' : '▶';
    $('fill').style.width = (elapsed / v.length) * 100 + '%';
    $('time').textContent = fmt(elapsed) + ' / ' + fmt(v.length);
  }

  // Build the Up next list from the videos array
  function renderList() {
    $('list').innerHTML = '';
    videos.forEach((v, i) => {
      const item = document.createElement('button');
      item.className = 'item' + (i === current ? ' current' : '');
      item.innerHTML = '<span class="thumb" style="background:' + gradient(v) + '">' + v.emoji + '</span>' +
        '<span><b>' + v.title + '</b><small>' + v.views + ' · ' + fmt(v.length) + '</small></span>';
      item.addEventListener('click', () => openVideo(i));
      $('list').appendChild(item);
    });
  }

  function openVideo(i) {
    current = i; elapsed = 0; playing = true;
    $('scene').textContent = videos[i].emoji;
    $('player').style.background = gradient(videos[i]);
    $('title').textContent = videos[i].title;
    renderList(); renderPlayer();
    window.scrollTo(0, 0);
  }

  $('player').addEventListener('click', () => { playing = !playing; renderPlayer(); });

  // Every 100ms, move the progress bar forward. At the end, autoplay the next video.
  setInterval(() => {
    if (!playing) return;
    elapsed += 0.1;
    if (elapsed >= videos[current].length) openVideo((current + 1) % videos.length);
    else renderPlayer();
  }, 100);

  $('subscribe').addEventListener('click', () => {
    subscribed = !subscribed;
    $('subscribe').classList.toggle('on', subscribed);
    $('subscribe').textContent = subscribed ? 'Subscribed ✓' : 'Subscribe';
  });

  $('like').addEventListener('click', () => {
    liked = !liked;
    likes += liked ? 1 : -1;
    $('like').classList.toggle('liked', liked);
    $('likes').textContent = likes.toLocaleString('en-US');
  });

  $('player').style.background = gradient(videos[0]);
  renderList(); renderPlayer();
</script>
</body>
</html>`,
    challenges: [
      'Change --brand to #065FD4 and press play: the logo, play button, progress bar and Subscribe button all turn blue.',
      'Make a light theme by setting --bg to #FFFFFF, --text to #0F0F0F and --chip to #F2F2F2.',
      'Drag the Progress bar height slider to 10px, then tap a video in the Up next list and watch the bar restart from zero.',
      'In the script, add a fifth video to the videos array (pick an emoji, two colors, a title and a length) and see it appear in Up next.',
    ],
  },

  concepts: [
    {
      term: 'Transcoding',
      meaning:
        'Converting a video into other sizes, qualities and formats, so the same upload can play on an old phone on slow data and a 4K TV on fast Wi-Fi.',
    },
    {
      term: 'Codec',
      meaning:
        'A recipe for compressing and decompressing video, like H.264, VP9 or AV1. Better codecs keep the picture looking good while using fewer bytes.',
    },
    {
      term: 'Adaptive bitrate streaming',
      meaning:
        'Sending video in few-second chunks and letting the player pick a higher or lower quality for each chunk based on your current internet speed. DASH is one standard way to do this.',
    },
    {
      term: 'CDN / edge cache',
      meaning:
        'Servers spread around the world that keep copies of popular files close to viewers, so videos travel a short distance and start playing quickly.',
    },
    {
      term: 'Sharding',
      meaning:
        'Splitting one enormous database into many smaller ones that each hold a slice of the data. Vitess does this for MySQL and routes each query to the right slice.',
    },
    {
      term: 'Resumable upload',
      meaning:
        'Sending a large file in pieces while the server keeps track of what has arrived, so a dropped connection means re-sending one piece instead of the whole file.',
    },
    {
      term: 'Recommendation system',
      meaning:
        'Software that predicts what you will want next. YouTube’s published design first gathers a few hundred candidates, then ranks them by expected watch time.',
    },
    {
      term: 'Fingerprinting',
      meaning:
        'Creating a short, unique summary of a song or video that can be matched even if the copy is slightly changed. Content ID uses this to find copyrighted material.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Sketch your data',
      detail:
        'Plan tables for users, channels, videos (title, file URL, status), subscriptions and likes. Create them in SQLite or a free Supabase (PostgreSQL) database.',
    },
    {
      step: 'Accept uploads into file storage',
      detail:
        'Build an upload endpoint with Express or Django that saves the video file to a storage service such as Supabase Storage or Cloudflare R2, and stores only its URL in the videos table.',
    },
    {
      step: 'Transcode in a background job',
      detail:
        'Use FFmpeg in a background worker to make 360p and 720p versions and cut them into HLS or DASH chunks, then set the video status from "processing" to "ready".',
    },
    {
      step: 'Build the watch page',
      detail:
        'Play the stream with hls.js or dash.js in the browser (or expo-video in an Expo app), and add a title, channel row, Subscribe button and like button that update instantly.',
    },
    {
      step: 'Add a simple Up next list',
      detail:
        'Start with plain rules like "other videos from this channel, most viewed first", and record how many seconds people watch so you can rank by watch time later.',
    },
    {
      step: 'Serve videos through a CDN',
      detail:
        'Put your video chunks and thumbnails behind a CDN such as Cloudflare so they load from servers near your viewers instead of from your one backend server.',
    },
  ],

  sources: [
    { label: 'Wikipedia: YouTube', url: 'https://en.wikipedia.org/wiki/YouTube' },
    { label: 'YouTube Official Blog', url: 'https://blog.youtube' },
    { label: 'Vitess (created at YouTube)', url: 'https://vitess.io' },
    { label: 'Vitess on GitHub', url: 'https://github.com/vitessio/vitess' },
    { label: 'Google Edge Network (Google Global Cache)', url: 'https://peering.google.com' },
  ],
};
