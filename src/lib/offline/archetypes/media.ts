import type { ArchetypeTemplate } from '../types';

export const archetype: ArchetypeTemplate = {
  id: 'media',
  label: 'Streaming & creator platform',

  keywords: [
    'video',
    'videos',
    'streaming',
    'stream',
    'live stream',
    'livestream',
    'watch now',
    'watch free',
    'music',
    'music streaming',
    'listen',
    'podcast',
    'podcasts',
    'episodes',
    'playlist',
    'playlists',
    'songs',
    'albums',
    'creators',
    'channel',
    'subscribe',
    'movies',
    'tv shows',
    'series',
    'clips',
    'upload video',
    'video sharing',
    'radio',
    'audio',
    'trailers',
    'broadcast',
    'binge',
  ],

  tagline: '{{name}} is a streaming platform where people watch, listen to and share videos, music or podcasts from creators around the world.',

  eli5:
    "{{name}} is like a huge library of videos or songs that plays instantly instead of making you download whole files first. When a creator uploads something, servers convert it into several sizes and quality levels and chop it into short chunks a few seconds long. When you press play, your device fetches those chunks from a server near you and switches to a lower quality if your internet slows down, so playback keeps going instead of freezing.",

  languages: [
    { name: 'TypeScript / JavaScript', usedFor: 'The web player, creator dashboard and some API servers', share: 25 },
    { name: 'Python', usedFor: 'Recommendation models, captions and data pipelines', share: 20 },
    { name: 'Go', usedFor: 'Upload, playback and transcoding-job services', share: 20 },
    { name: 'C / C++', usedFor: 'Video and audio encoders like FFmpeg and x264 that the platform builds on', share: 10 },
    { name: 'Swift / Kotlin', usedFor: 'The iOS, Android and TV apps', share: 15 },
    { name: 'SQL', usedFor: 'Catalog queries and analytics like trending charts', share: 10 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'HTML5 video & Media Source Extensions',
          role: 'Plays streamed chunks in the browser',
          beginnerNote:
            'The browser\'s built-in <video> element does the playing. Media Source Extensions let JavaScript feed it one small chunk of video at a time instead of a single big file.',
        },
        {
          name: 'hls.js or Shaka Player',
          role: 'Adaptive streaming player library',
          beginnerNote:
            'Open-source player libraries that read the list of available qualities, measure your download speed and pick which chunks to fetch next.',
        },
      ],
    },
    {
      layer: 'Mobile',
      items: [
        {
          name: 'AVPlayer (iOS)',
          role: 'Native video and audio playback',
          beginnerNote: "Apple's built-in media player plays HLS streams out of the box and supports background audio and AirPlay.",
        },
        {
          name: 'ExoPlayer / Media3 (Android)',
          role: 'Native adaptive playback',
          beginnerNote:
            "Google's open-source Android player that supports HLS and DASH streaming, offline downloads and switching quality mid-video.",
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Go services',
          role: 'Upload, playback and channel APIs',
          beginnerNote:
            'Go is a fast, simple language that handles many requests at once, which suits services that hand out millions of "here is where your video lives" answers.',
        },
        {
          name: 'FFmpeg',
          role: 'Transcoding',
          beginnerNote:
            'A free, open-source Swiss army knife for audio and video. It converts one uploaded file into many sizes, bitrates and formats.',
        },
        {
          name: 'Apache Kafka',
          role: 'Job queue and view events',
          beginnerNote:
            'A durable line of messages. Uploads drop "please transcode this" jobs into it, and players send "watched 30 seconds" events that other systems read later.',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'PostgreSQL',
          role: 'Users, channels and video details',
          beginnerNote: 'A reliable table-based database for facts like titles, descriptions, owners and whether a video is public.',
        },
        {
          name: 'Redis',
          role: 'View counters and fast lookups',
          beginnerNote:
            'An in-memory store. Adding 1 to a view counter millions of times a minute is far too much for a normal database, but easy for Redis.',
        },
        {
          name: 'Elasticsearch',
          role: 'Search',
          beginnerNote: 'A search engine database that finds videos by title, description and captions, even with typos.',
        },
        {
          name: 'Data warehouse (BigQuery or Snowflake)',
          role: 'Watch history analytics',
          beginnerNote:
            'A database built to crunch billions of rows of "who watched what, for how long" to power trending charts, creator stats and model training.',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Amazon S3 (object storage)',
          role: 'Original uploads and encoded chunks',
          beginnerNote:
            'Cloud storage for files of any size. One popular video can turn into thousands of small chunk files, and they all live here.',
        },
        {
          name: 'Video CDN',
          role: 'Delivers chunks near viewers',
          beginnerNote:
            'Video is by far the heaviest traffic on the internet, so copies of popular chunks sit on servers inside cities and internet providers close to viewers.',
        },
        {
          name: 'HLS & DASH',
          role: 'Adaptive streaming formats',
          beginnerNote:
            'Two standard ways of cutting video into short chunks with a playlist file listing every quality. HLS came from Apple, and DASH is an international standard.',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Recommendation models',
          role: 'Home feed and Up next',
          beginnerNote:
            'One model quickly narrows millions of videos to a few hundred you might like, then a second model ranks them by how long you are likely to watch.',
        },
        {
          name: 'Speech-to-text',
          role: 'Automatic captions',
          beginnerNote: 'Models listen to the audio track and write captions, which also make videos searchable by what is said in them.',
        },
        {
          name: 'Audio & video fingerprinting',
          role: 'Copyright matching',
          beginnerNote:
            'Each upload is turned into a compact "fingerprint" and compared with a library of copyrighted songs and shows, a bit like matching fingerprints at a crime scene.',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'web',
        label: 'Web Player',
        kind: 'client',
        tier: 0,
        tech: '{{frontend}} + HTML5 video player',
        description:
          'The {{name}} website. It shows the catalog, plays videos or audio with an adaptive streaming player, and lets creators upload from their browser.',
      },
      {
        id: 'mobile',
        label: 'Mobile & TV Apps',
        kind: 'client',
        tier: 0,
        tech: 'Swift (iOS) · Kotlin (Android, TV)',
        description:
          'Native apps that use each device\'s built-in media player, support background playback and can download episodes or songs for offline use.',
      },
      {
        id: 'cdn',
        label: 'CDN',
        kind: 'edge',
        tier: 1,
        tech: '{{hosting}} · video CDN edge servers',
        description:
          'Thousands of servers close to viewers that keep copies of the site code and popular video chunks. Most of the bytes you stream come from here, not from the main data center.',
      },
      {
        id: 'lb',
        label: 'Load Balancer',
        kind: 'edge',
        tier: 1,
        tech: 'Cloud load balancer',
        description: 'Spreads API requests, such as "what should I watch next?", across many servers so none gets overloaded.',
      },
      {
        id: 'api',
        label: 'API Gateway',
        kind: 'gateway',
        tier: 2,
        tech: 'REST / GraphQL gateway',
        description: 'The single front door for app requests. It checks who you are and routes each request to the right service.',
      },
      {
        id: 'upload',
        label: 'Upload Service',
        kind: 'service',
        tier: 3,
        tech: 'Node.js or Go service',
        description:
          'Starts uploads, hands out secure time-limited upload links and records the new video in the database with the status "processing".',
      },
      {
        id: 'transcode',
        label: 'Transcoding Workers',
        kind: 'service',
        tier: 3,
        tech: 'FFmpeg workers on autoscaling servers',
        description:
          'Turn each upload into many versions, such as 1080p, 720p and 480p, and cut them into chunks a few seconds long. More workers start automatically when the queue gets long.',
      },
      {
        id: 'playback',
        label: 'Playback Service',
        kind: 'service',
        tier: 3,
        tech: 'Go service',
        description:
          'When you press play, it checks the video is ready and allowed in your country, then returns a signed link to the playlist file that lists every quality.',
      },
      {
        id: 'recs',
        label: 'Recommendations',
        kind: 'ml',
        tier: 3,
        tech: 'Python models (PyTorch / TensorFlow)',
        description:
          'Picks what appears on your home page and in Up next, based on what you and people with similar taste watched, finished or skipped.',
      },
      {
        id: 'storage',
        label: 'Media Storage',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3 (object storage)',
        description:
          'Holds the original uploads plus every encoded chunk and playlist file. CDN servers fetch from here when they do not have a copy yet.',
      },
      {
        id: 'db',
        label: 'Catalog Database',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL',
        description:
          'Titles, descriptions, channels, which qualities exist for each video and who is allowed to watch it. The media files themselves are not stored here.',
      },
      {
        id: 'queue',
        label: 'Jobs & Events',
        kind: 'queue',
        tier: 4,
        tech: 'Apache Kafka',
        description:
          'Carries "transcode this upload" jobs to the workers and collects a constant stream of watch events like "paused at 2:14" from players.',
      },
      {
        id: 'warehouse',
        label: 'Data Warehouse',
        kind: 'database',
        tier: 4,
        tech: 'BigQuery or Snowflake',
        description:
          'Stores years of watch history for analysis. Trending charts, creator statistics and recommendation training all read from here.',
      },
    ],
    edges: [
      { from: 'web', to: 'cdn', label: 'Video chunks (HLS / DASH)' },
      { from: 'mobile', to: 'cdn', label: 'Video chunks (HLS / DASH)' },
      { from: 'cdn', to: 'storage', label: 'Fetch on cache miss' },
      { from: 'web', to: 'lb', label: 'HTTPS API' },
      { from: 'mobile', to: 'lb', label: 'HTTPS API' },
      { from: 'lb', to: 'api', label: 'Routes requests' },
      { from: 'api', to: 'upload', label: 'Start upload' },
      { from: 'api', to: 'playback', label: 'Get playlist link' },
      { from: 'api', to: 'recs', label: 'Home & Up next' },
      { from: 'api', to: 'queue', label: 'Watch events' },
      { from: 'upload', to: 'storage', label: 'Store original file' },
      { from: 'upload', to: 'queue', label: 'Transcode job' },
      { from: 'queue', to: 'transcode', label: 'Deliver jobs' },
      { from: 'transcode', to: 'storage', label: 'Write encoded chunks' },
      { from: 'transcode', to: 'db', label: 'Mark video ready' },
      { from: 'playback', to: 'db', label: 'Video info & rights' },
      { from: 'queue', to: 'warehouse', label: 'Stream watch history' },
      { from: 'warehouse', to: 'recs', label: 'Training data' },
      { from: 'recs', to: 'db', label: 'Candidate video details' },
    ],
    flows: [
      {
        id: 'upload-video',
        title: 'A creator uploads a video',
        emoji: '⬆️',
        steps: [
          {
            from: 'web',
            to: 'lb',
            narration: 'A creator picks a video file and types a title. The page asks {{name}} for permission to start an upload.',
          },
          { from: 'lb', to: 'api', narration: 'The request is routed to an API server, which checks that the creator is logged in.' },
          {
            from: 'api',
            to: 'upload',
            narration: 'The Upload service creates a new video record with the status "uploading" and prepares a place to put the file.',
          },
          {
            from: 'upload',
            to: 'storage',
            narration:
              'It hands the browser a secure, time-limited link, and the big file travels into object storage in pieces, so a dropped connection only resends one piece.',
          },
          {
            from: 'upload',
            to: 'queue',
            narration: 'Once the upload is complete, a "transcode video 123" job goes onto the queue and the video status becomes "processing".',
          },
          {
            from: 'queue',
            to: 'transcode',
            narration:
              'A free transcoding worker grabs the job and runs FFmpeg, creating 1080p, 720p, 480p and smaller versions, each cut into chunks about 4 seconds long.',
          },
          {
            from: 'transcode',
            to: 'storage',
            narration:
              'The chunks and playlist files are saved to storage and the video is marked "ready" in the database. It can now be watched.',
          },
        ],
      },
      {
        id: 'press-play',
        title: 'You press play',
        emoji: '▶️',
        steps: [
          { from: 'mobile', to: 'lb', narration: 'You tap a video. The app asks {{name}} how to play it.' },
          { from: 'lb', to: 'api', narration: 'The load balancer passes the request to an available API server.' },
          { from: 'api', to: 'playback', narration: 'The API checks your login and forwards the request to the Playback service.' },
          {
            from: 'playback',
            to: 'db',
            narration:
              'Playback confirms the video is ready and allowed where you are, then returns a signed link to the main playlist file, which lists every available quality.',
          },
          {
            from: 'mobile',
            to: 'cdn',
            narration:
              'The player downloads the playlist, then the first few chunks from a CDN server near you. It measures how fast they arrive and picks the best quality your connection can keep up with.',
          },
          {
            from: 'cdn',
            to: 'storage',
            narration:
              'If that CDN server does not have a chunk yet (a cache miss), it fetches it once from storage and keeps a copy for the next viewer nearby.',
          },
        ],
      },
      {
        id: 'recommendations',
        title: 'Your recommendations update',
        emoji: '✨',
        steps: [
          {
            from: 'web',
            to: 'lb',
            narration: 'While you watch, the player quietly sends tiny events every few seconds: started, paused, skipped ahead, finished.',
          },
          { from: 'lb', to: 'api', narration: 'The events arrive at an API server along with thousands of others per second.' },
          { from: 'api', to: 'queue', narration: 'The API drops them onto the event stream right away, so your video never waits for this work.' },
          {
            from: 'queue',
            to: 'warehouse',
            narration: 'A pipeline copies the events into the data warehouse, next to billions of other viewing sessions.',
          },
          {
            from: 'warehouse',
            to: 'recs',
            narration:
              'Models are retrained on this history. They learn that people who finish videos like the one you just watched often enjoy certain other videos too.',
          },
          {
            from: 'recs',
            to: 'db',
            narration: 'For you, the system narrows millions of videos to a few hundred candidates, loads their details and ranks them.',
          },
          {
            from: 'api',
            to: 'recs',
            narration: 'Next time you open {{name}}, the API asks Recommendations for your home page, and the newly ranked videos appear.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'services/upload/src/routes/videos.ts', note: 'Starts an upload and returns a signed upload link' },
    { path: 'services/upload/src/events/onUploadComplete.ts', note: 'Puts a transcode job on the queue when a file finishes uploading' },
    { path: 'workers/transcode/hls.go', note: 'Runs FFmpeg once per quality level to make HLS chunks' },
    { path: 'workers/transcode/master_playlist.go', note: 'Writes the playlist file that lists every quality' },
    { path: 'workers/transcode/thumbnails.go', note: 'Grabs frames from the video to use as thumbnails' },
    { path: 'services/playback/handlers/manifest.go', note: 'Checks access and returns a signed playlist link' },
    { path: 'services/playback/signing/cdn_token.go', note: 'Creates CDN links that stop working after a few hours' },
    { path: 'db/migrations/001_catalog.sql', note: 'Tables for channels, videos, qualities and watch progress' },
    { path: 'events/schemas/watch_progress.avsc', note: 'Describes a "watched up to N seconds" event' },
    { path: 'ml/recs/candidate_generation.py', note: 'Finds a few hundred videos you might like' },
    { path: 'ml/recs/ranker.py', note: 'Orders candidates by predicted watch time' },
    { path: 'ml/captions/speech_to_text_job.py', note: 'Generates automatic captions' },
    { path: 'analytics/queries/trending_24h.sql', note: 'The warehouse query behind a Trending page' },
    { path: 'infra/cdn/cache-rules.yaml', note: 'Caches chunks for a long time and playlist files only briefly' },
    { path: 'infra/k8s/transcode-autoscaler.yaml', note: 'Adds transcoding workers when the job queue grows' },
  ],

  code: [
    {
      id: 'upload-endpoint',
      title: 'Starting an upload (API endpoint)',
      file: 'services/upload/src/routes/videos.ts',
      language: 'TypeScript',
      explanation:
        'Video files are huge, so the API never touches the bytes. It checks the request, saves a video row with the status "uploading", and returns a presigned URL: a link to cloud storage that allows one upload and expires after an hour. The browser then sends the file straight to S3. When S3 reports the file has arrived, a separate handler puts a transcode job on the queue.',
      code: `import express from 'express'; // Express 5 passes async errors to its error handler
import { randomUUID } from 'node:crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Pool } from 'pg';
import { requireCreator } from './auth'; // sets res.locals.channelId

const app = express();
app.use(express.json());
const s3 = new S3Client({ region: 'us-east-1' });
const db = new Pool();
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const MAX_BYTES = 5 * 1024 ** 3; // 5 GB, the limit for one S3 upload request

app.post('/videos', requireCreator, async (req, res) => {
  const { title, sizeBytes, contentType } = req.body;
  if (typeof title !== 'string' || !title.trim() || !VIDEO_TYPES.includes(contentType)) {
    return res.status(400).json({ error: 'A title and an MP4, MOV or WebM file are required' });
  }
  if (!(sizeBytes > 0 && sizeBytes <= MAX_BYTES)) {
    // Bigger files use S3 multipart upload: many smaller parts, each retried on its own.
    return res.status(413).json({ error: 'Files over 5 GB must use multipart upload' });
  }

  const videoId = randomUUID();
  const key = \`originals/\${videoId}\`;
  await db.query(
    'INSERT INTO videos (id, channel_id, title, status, original_key) VALUES ($1, $2, $3, $4, $5)',
    [videoId, res.locals.channelId, title.trim(), 'uploading', key],
  );

  // The browser uploads straight to S3, so gigabytes never pass through our servers.
  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: 'media-originals', Key: key, ContentType: contentType }),
    { expiresIn: 3600 }, // seconds
  );
  res.status(201).json({ videoId, uploadUrl });
});`,
    },
    {
      id: 'catalog-schema',
      title: 'Videos, qualities and watch progress',
      file: 'db/migrations/001_catalog.sql',
      language: 'SQL',
      explanation:
        'The database stores facts about media, never the media itself. A video moves through statuses (uploading, processing, ready), which is modeled with an enum type so typos are impossible. Each quality the transcoder produces gets a row in renditions, which is how the Playback service knows what to offer. watch_progress powers "continue watching" with one row per person per video.',
      code: `CREATE TABLE channels (
  id               BIGSERIAL PRIMARY KEY,
  owner_id         BIGINT NOT NULL,
  handle           TEXT UNIQUE NOT NULL,
  subscriber_count BIGINT NOT NULL DEFAULT 0
);

CREATE TYPE video_status AS ENUM ('uploading', 'processing', 'ready', 'failed', 'removed');

CREATE TABLE videos (
  id           UUID PRIMARY KEY,
  channel_id   BIGINT NOT NULL REFERENCES channels(id),
  title        TEXT NOT NULL,
  status       video_status NOT NULL DEFAULT 'uploading',
  original_key TEXT NOT NULL,      -- where the uploaded file sits in object storage
  duration_ms  INT,                -- filled in by the transcoder
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX videos_by_channel ON videos (channel_id, published_at DESC);

-- One row per quality level the transcoder produced.
CREATE TABLE renditions (
  video_id     UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  height       INT NOT NULL,       -- 1080, 720, 480 ...
  bitrate_kbps INT NOT NULL,
  playlist_key TEXT NOT NULL,      -- e.g. hls/<video id>/720p/index.m3u8
  PRIMARY KEY (video_id, height)
);

-- "Continue watching": how far each person got in each video.
CREATE TABLE watch_progress (
  user_id     BIGINT NOT NULL,
  video_id    UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  position_ms INT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, video_id)
);`,
    },
    {
      id: 'hls-transcoder',
      title: 'Transcoding into an adaptive bitrate ladder',
      file: 'workers/transcode/hls.go',
      language: 'Go',
      explanation:
        'A transcoding worker runs FFmpeg once for each rung of the "bitrate ladder", from sharp 1080p down to tiny 240p for weak connections. Each run writes 4-second HLS chunks plus a small playlist file. Forcing a keyframe (a complete picture) every 2 seconds makes every quality start its chunks at the same moments, so the player can switch quality between chunks without a visible jump. Real platforms tune the ladder per video, and use newer codecs like VP9 and AV1 too.',
      code: `package transcode

import (
    "context"
    "fmt"
    "os"
    "os/exec"
    "path/filepath"
)

// The "bitrate ladder": every quality a viewer's player can switch between.
var ladder = []struct {
    name, bitrate string
    height        int
}{
    {"1080p", "5000k", 1080},
    {"720p", "2800k", 720},
    {"480p", "1400k", 480},
    {"240p", "400k", 240},
}

// ToHLS turns one uploaded file into chunked HLS streams for every rung.
func ToHLS(ctx context.Context, input, outDir string) error {
    for _, r := range ladder {
        dir := filepath.Join(outDir, r.name)
        if err := os.MkdirAll(dir, 0o755); err != nil {
            return err
        }
        cmd := exec.CommandContext(ctx, "ffmpeg", "-i", input,
            "-vf", fmt.Sprintf("scale=-2:%d", r.height), "-c:v", "libx264", "-b:v", r.bitrate,
            "-force_key_frames", "expr:gte(t,n_forced*2)", // keyframe every 2 s lines rungs up
            "-c:a", "aac", "-b:a", "128k", "-hls_time", "4", "-hls_playlist_type", "vod",
            "-hls_segment_filename", filepath.Join(dir, "seg_%03d.ts"), filepath.Join(dir, "index.m3u8"))
        if out, err := cmd.CombinedOutput(); err != nil {
            return fmt.Errorf("ffmpeg %s: %w\\n%s", r.name, err, out)
        }
    }
    return writeMasterPlaylist(outDir) // master.m3u8 lists every rung for the player
}`,
    },
  ],

  playground: {
    title: 'Adaptive video player',
    description:
      'A mini watch page with a pretend video player. Drag your internet speed up and down and watch the player switch quality, fill its buffer and stall, just like real adaptive streaming.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Watch</title>
<style>
:root {
  --brand: {{brand}}; /* @tweak color "Brand color" */
  --accent: {{accent}}; /* @tweak color "Accent color" */
  --bg: #0f0f0f; /* @tweak color "Background" */
  --radius: 12px; /* @tweak range 0 24 "Corner radius" */
  --player-h: 204px; /* @tweak range 150 280 "Player height" */
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: #f1f1f1; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
button { font: inherit; border: 0; cursor: pointer; }
header { display: flex; align-items: center; gap: 8px; padding: 10px 14px; }
.mark { width: 30px; height: 21px; border-radius: 6px; background: var(--brand); color: #fff; text-shadow: 0 0 3px rgba(0,0,0,.6); display: grid; place-items: center; font-size: 11px; }
.logo { font-size: 18px; font-weight: 800; }
.player { position: relative; height: var(--player-h); background: #000; overflow: hidden; cursor: pointer; }
.screen { position: absolute; inset: -12px; display: grid; place-items: center; font-size: 72px; transition: filter .5s; }
.tag { position: absolute; top: 8px; right: 8px; padding: 2px 8px; border-radius: 4px; background: rgba(0,0,0,.65); font-size: 12px; font-weight: 700; }
.time { position: absolute; left: 8px; bottom: 10px; font-size: 12px; text-shadow: 0 1px 2px #000; }
.big { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; border-radius: 50%; background: rgba(0,0,0,.6); display: grid; place-items: center; font-size: 24px; }
.spin { position: absolute; inset: 0; display: none; place-items: center; background: rgba(0,0,0,.45); font-weight: 600; }
.spin.on { display: grid; }
.bar { position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: rgba(255,255,255,.2); }
.buf, .fill { position: absolute; left: 0; top: 0; bottom: 0; width: 0; }
.buf { background: rgba(255,255,255,.45); } .fill { background: var(--brand); }
.info { padding: 12px 14px 4px; }
h1 { margin: 0 0 4px; font-size: 17px; line-height: 1.3; }
small, .meta { color: #aaa; font-size: 12px; }
.row { display: flex; align-items: center; gap: 10px; margin-top: 12px; }
.avatar { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(135deg, var(--brand), var(--accent)); }
.channel { flex: 1; } .channel b { display: block; font-size: 14px; }
.sub { padding: 8px 14px; border-radius: 999px; background: #f1f1f1; color: #0f0f0f; font-weight: 700; }
.sub.on { background: #272727; color: #f1f1f1; }
.chip { padding: 7px 12px; border-radius: 999px; background: #272727; color: #f1f1f1; font-weight: 600; }
.chip.on { box-shadow: inset 0 0 0 2px var(--brand); }
.lab { margin: 12px 14px; padding: 12px; border-radius: var(--radius); background: #1d1d1d; font-size: 13px; }
.lab input { width: 100%; accent-color: var(--brand); }
.stats { display: flex; justify-content: space-between; margin-top: 6px; color: #aaa; }
.stats b { color: #f1f1f1; }
h2 { margin: 0 14px 8px; font-size: 15px; }
.up { display: flex; gap: 10px; padding: 6px 14px; cursor: pointer; }
.thumb { position: relative; width: 136px; height: 76px; flex-shrink: 0; border-radius: var(--radius); display: grid; place-items: center; font-size: 30px; }
.thumb span { position: absolute; right: 4px; bottom: 4px; padding: 0 4px; border-radius: 3px; background: rgba(0,0,0,.8); font-size: 11px; }
.up b { display: block; font-size: 14px; margin-bottom: 2px; }
</style>
</head>
<body>
<header><span class="mark">▶</span><span class="logo" data-edit="logo">{{name}}</span></header>
<div class="player" id="player">
  <div class="screen" id="screen"></div>
  <div class="tag" id="tag"></div>
  <div class="big" id="big">▶</div>
  <div class="spin" id="spin">Buffering…</div>
  <div class="time" id="time"></div>
  <div class="bar"><div class="buf" id="buf"></div><div class="fill" id="fill"></div></div>
</div>
<div class="info">
  <h1 id="title"></h1>
  <div class="meta" id="meta"></div>
  <div class="row">
    <div class="avatar">🎬</div>
    <div class="channel"><b data-edit="channel">Campus Creators</b><small data-edit="subs">1.2M subscribers</small></div>
    <button class="sub" id="sub">Subscribe</button>
  </div>
  <div class="row"><button class="chip" id="like">👍 12K</button><button class="chip" id="quality">⚙ Auto</button></div>
</div>
<div class="lab">
  <b data-edit="lab">Network lab</b>
  <div class="stats"><span>Your internet speed</span><b id="speedText"></b></div>
  <input type="range" id="speed" min="0.2" max="8" step="0.1" value="3">
  <div class="stats"><span>Buffered ahead: <b id="ahead">0s</b></span><span>Stalls: <b id="stalls">0</b></span></div>
</div>
<h2 data-edit="upnext">Up next</h2>
<div id="list"></div>

<script>
// The "bitrate ladder": the transcoder made these versions of every video
const ladder = [
  { name: '1080p', mbps: 5, blur: 0 },
  { name: '720p', mbps: 2.8, blur: 0.8 },
  { name: '480p', mbps: 1.4, blur: 2 },
  { name: '240p', mbps: 0.4, blur: 4 }
];
const videos = [
  { title: 'How the internet works in 5 minutes', emoji: '🌐', art: 'linear-gradient(135deg, #1e3c72, #2a5298)', len: 300, meta: '1.4M views · 3 days ago' },
  { title: 'I built a robot that waters my plants', emoji: '🤖', art: 'linear-gradient(135deg, #11998e, #38ef7d)', len: 512, meta: '860K views · 1 week ago' },
  { title: 'Lo-fi beats to debug to', emoji: '🎧', art: 'linear-gradient(135deg, #8e2de2, #4a00e0)', len: 3600, meta: '5.2M views · 1 year ago' },
  { title: 'Cooking pasta with only a kettle', emoji: '🍝', art: 'linear-gradient(135deg, #f7971e, #ffd200)', len: 421, meta: '312K views · 2 days ago' }
];
let current = 0, position = 0, buffered = 0, playing = false, stalled = false, stalls = 0;
let manual = -1; // -1 = Auto, otherwise an index into ladder
const $ = (id) => document.getElementById(id);

function fmt(s) { s = Math.floor(s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }

// Adaptive bitrate (ABR): the best quality that uses at most 80% of your speed
function pickRung() {
  if (manual >= 0) return ladder[manual];
  const speed = Number($('speed').value);
  return ladder.find((r) => r.mbps <= speed * 0.8) || ladder[ladder.length - 1];
}

function load(i) {
  current = i; position = 0; buffered = 0; stalled = false;
  const v = videos[i];
  $('title').textContent = v.title;
  $('meta').textContent = v.meta;
  $('screen').textContent = v.emoji;
  $('screen').style.background = v.art;
  $('list').innerHTML = '';
  videos.forEach((u, j) => {
    if (j === i) return;
    const row = document.createElement('div');
    row.className = 'up';
    row.innerHTML = '<div class="thumb"><span></span></div><div><b></b><small></small></div>';
    row.querySelector('.thumb').style.background = u.art;
    row.querySelector('.thumb').prepend(u.emoji);
    row.querySelector('span').textContent = fmt(u.len);
    row.querySelector('b').textContent = u.title;
    row.querySelector('small').textContent = u.meta;
    row.onclick = () => { load(j); playing = true; window.scrollTo(0, 0); };
    $('list').appendChild(row);
  });
}

function draw() {
  const v = videos[current], rung = pickRung();
  $('fill').style.width = (position / v.len) * 100 + '%';
  $('buf').style.width = (buffered / v.len) * 100 + '%';
  $('tag').textContent = (manual < 0 ? 'Auto · ' : '') + rung.name;
  $('screen').style.filter = 'blur(' + rung.blur + 'px)'; // low quality looks blurry
  $('spin').classList.toggle('on', playing && stalled);
  $('big').style.display = playing ? 'none' : 'grid';
  $('time').textContent = fmt(position) + ' / ' + fmt(v.len);
  $('speedText').textContent = Number($('speed').value).toFixed(1) + ' Mbps';
  $('ahead').textContent = (buffered - position).toFixed(1) + 's';
  $('stalls').textContent = stalls;
}

// Our fake network + video engine, 4 times per second
setInterval(() => {
  const v = videos[current], rung = pickRung();
  // Seconds of video downloaded per real second = your speed / this quality's bitrate
  if (buffered < Math.min(v.len, position + 30)) {
    buffered = Math.min(v.len, buffered + 0.25 * Number($('speed').value) / rung.mbps);
  }
  if (playing) {
    const ahead = buffered - position;
    if (ahead >= (stalled ? 2 : 0.25) || buffered >= v.len) { // after a stall, wait for 2s of buffer
      stalled = false;
      position = Math.min(v.len, position + 0.25);
      if (position >= v.len) playing = false;
    } else if (!stalled) { stalled = true; stalls++; }
  }
  draw();
}, 250);

$('player').onclick = () => { if (position >= videos[current].len) position = 0; playing = !playing; draw(); };
$('quality').onclick = () => {
  manual = manual + 1 < ladder.length ? manual + 1 : -1; // Auto -> 1080p -> ... -> 240p -> Auto
  $('quality').textContent = '⚙ ' + (manual < 0 ? 'Auto' : ladder[manual].name);
  draw();
};
$('sub').onclick = () => { const on = $('sub').classList.toggle('on'); $('sub').textContent = on ? 'Subscribed' : 'Subscribe'; };
$('like').onclick = () => $('like').classList.toggle('on');
$('speed').oninput = draw;

load(0); draw();
</script>
</body>
</html>`,
    challenges: [
      'Press play, then drag "Your internet speed" below 1 Mbps. Watch the quality tag drop to 240p and the picture turn blurry instead of freezing.',
      'Tap the ⚙ button until it says 1080p, keep your speed around 2 Mbps and count the stalls. This is why players choose quality automatically.',
      'Add a 1440p rung at the top of the ladder array with mbps: 8 and blur: 0, then raise the speed slider\'s max to 12. How fast must your internet be before Auto picks 1440p?',
      'Change the 0.8 in pickRung() to 1.0. The player now uses all of your speed. Does it stall more when the speed wobbles?',
    ],
  },

  concepts: [
    {
      term: 'Transcoding',
      meaning:
        'Converting a media file into other formats, sizes and bitrates, for example turning one 4K upload into 1080p, 720p and 480p versions that work on every device.',
    },
    {
      term: 'Bitrate',
      meaning:
        'How much data one second of video or audio uses, measured in kilobits or megabits per second. Higher bitrate usually means better quality and bigger downloads.',
    },
    {
      term: 'Adaptive bitrate streaming (ABR)',
      meaning:
        'The player measures your connection while it plays and picks a higher or lower quality for the next chunk, so playback keeps going when your internet slows down.',
    },
    {
      term: 'HLS and DASH',
      meaning:
        'Standard streaming formats that split media into chunks a few seconds long plus a playlist (manifest) file that tells the player which chunks and qualities exist.',
    },
    {
      term: 'Buffering',
      meaning:
        'Downloading a little ahead of what you are watching. If downloads fall behind playback, the buffer empties and the video freezes, which is called a stall.',
    },
    {
      term: 'CDN caching',
      meaning:
        'Keeping copies of popular files on servers close to viewers. A request the nearby server can answer itself is a cache hit; one it must fetch from storage is a cache miss.',
    },
    {
      term: 'Job queue & workers',
      meaning:
        'Slow tasks like transcoding go into a queue, and a pool of worker machines takes jobs one at a time. More workers can be added when the queue gets long.',
    },
    {
      term: 'Recommendation system',
      meaning:
        'Software that predicts what you will enjoy next, usually by finding candidate items from viewing patterns and then ranking them with a machine learning model.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Record a few short clips',
      detail: 'Film three or four 30-second videos on your phone, or download Creative Commons clips from sites like Pexels.',
    },
    {
      step: 'Transcode them with FFmpeg',
      detail:
        'Install FFmpeg and run one command, such as ffmpeg -i clip.mp4 -hls_time 4 -hls_playlist_type vod out/index.m3u8, to turn each clip into HLS chunks.',
    },
    {
      step: 'Play them in a web page',
      detail:
        'Use a <video> tag with hls.js (Safari can play HLS without it). Add a list of videos that loads the chosen one into the player.',
    },
    {
      step: 'Build an upload flow',
      detail:
        'Write a small Node.js + Express API that saves video details in PostgreSQL (Supabase works well) and hands out presigned upload links for Cloudflare R2 or Amazon S3.',
    },
    {
      step: 'Transcode in the background',
      detail:
        'Add a job queue such as BullMQ with Redis. A worker process picks up each new upload, runs FFmpeg, uploads the chunks and marks the video ready.',
    },
    {
      step: 'Count views and deploy',
      detail:
        'Log a row when someone watches for 30 seconds, build a "most watched this week" page with SQL GROUP BY, then deploy the API and worker to Render or Fly.io.',
    },
  ],
};
