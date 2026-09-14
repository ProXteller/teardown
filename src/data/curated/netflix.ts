import type { Teardown } from '../types';

export const netflix: Teardown = {
  id: 'netflix',
  name: 'Netflix',
  url: 'netflix.com',
  tagline: 'Streaming shows and movies to hundreds of millions of screens.',
  category: 'Video Streaming',
  brandColor: '#E50914',
  accentColor: '#B81D24',
  logoGlyph: 'N',
  source: 'curated',

  eli5:
    "Netflix keeps copies of its shows on special servers placed inside internet providers' buildings all over the world, so the video only has to travel a short distance to your screen. When you open the app, many small programs running in Amazon's cloud work together to figure out who you are, what you've watched and which rows of shows to put in front of you. When you press Play, the video arrives in small chunks, and the app quietly switches between higher and lower quality as your internet speed changes.",

  facts: [
    { label: 'Founded', value: '1997, California' },
    { label: 'Founders', value: 'Reed Hastings & Marc Randolph' },
    { label: 'Headquarters', value: 'Los Gatos, California' },
    { label: 'Available in', value: '190+ countries' },
    { label: 'Paid memberships', value: '300M+ (reported early 2025)' },
    { label: 'Backend runs on', value: 'Amazon Web Services (AWS)' },
    { label: 'Video delivery', value: 'Open Connect, its own CDN' },
  ],

  history: [
    {
      year: '1997',
      title: 'DVDs by mail',
      detail:
        'Reed Hastings and Marc Randolph started Netflix as a website where you picked a DVD online and it arrived in your mailbox.',
    },
    {
      year: '1999',
      title: 'The subscription model',
      detail:
        'Netflix switched to a flat monthly subscription instead of paying per rental, the same business idea it still uses today.',
    },
    {
      year: '2007',
      title: 'Streaming begins',
      detail:
        'Netflix launched "Watch Now", letting members stream movies instantly on their computers instead of waiting for a disc.',
    },
    {
      year: '2008',
      title: 'The outage that changed everything',
      detail:
        "A major database corruption stopped Netflix from shipping DVDs for three days. The team decided to leave single points of failure in its own data center behind and move to distributed systems in the AWS cloud.",
    },
    {
      year: '2011',
      title: 'Chaos Monkey and the Simian Army',
      detail:
        'Netflix described its "Simian Army", a set of tools led by Chaos Monkey that deliberately shut down its own servers to prove the service can survive failures.',
    },
    {
      year: '2012',
      title: 'Open Connect and open source',
      detail:
        'Netflix announced Open Connect, its own video delivery network, and began releasing internal tools such as Eureka and Hystrix as open source (Netflix OSS).',
    },
    {
      year: '2013',
      title: 'House of Cards',
      detail:
        'Netflix released its first major original series and made the whole season available at once, turning from a distributor into a studio.',
    },
    {
      year: '2016',
      title: 'Global and fully in the cloud',
      detail:
        'In January 2016 Netflix launched in 130 more countries at once, reaching over 190 countries, and finished moving its streaming service out of its own data centers into AWS.',
    },
    {
      year: '2021',
      title: 'DGS Framework open-sourced',
      detail:
        'Netflix open-sourced its Domain Graph Service (DGS) framework, which it uses to build GraphQL APIs on top of Spring Boot.',
    },
    {
      year: '2022',
      title: 'A plan with ads',
      detail:
        'Netflix launched a lower-priced plan that shows ads, starting out with Microsoft as its advertising technology partner.',
    },
  ],

  languages: [
    { name: 'Java', usedFor: 'Backend microservices with Spring Boot, plus tools like Zuul and Eureka', share: 40 },
    { name: 'JavaScript / TypeScript', usedFor: 'Web and TV user interfaces built with React, and Node.js servers', share: 20 },
    { name: 'Python', usedFor: 'Data science, machine learning (Metaflow) and automation scripts', share: 15 },
    { name: 'Kotlin', usedFor: 'Android app', share: 10 },
    { name: 'Swift', usedFor: 'iPhone and iPad app', share: 8 },
    { name: 'C / C++', usedFor: 'Low-level TV device runtime and Open Connect server software', share: 7 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'React',
          role: 'Web and TV interfaces',
          beginnerNote:
            'React builds a screen out of reusable Lego-like pieces called components, so one "row of posters" piece can be reused for every row.',
          confidence: 'confirmed',
        },
        {
          name: 'Node.js',
          role: 'Website server layer',
          beginnerNote:
            'Node.js runs JavaScript on a server, so the same language used in the browser can prepare pages before they reach you.',
          confidence: 'confirmed',
        },
        {
          name: 'TypeScript',
          role: 'Safer JavaScript',
          beginnerNote:
            'TypeScript is JavaScript with labels on your data, like "this is a number", so mistakes are caught before the code runs.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Mobile',
      items: [
        {
          name: 'Swift',
          role: 'iOS app',
          beginnerNote: "Swift is Apple's language for iPhone apps, like the native tongue of iOS.",
          confidence: 'likely',
        },
        {
          name: 'Kotlin',
          role: 'Android app',
          beginnerNote: "Kotlin is Google's recommended language for Android apps, a modern and more concise cousin of Java.",
          confidence: 'likely',
        },
        {
          name: 'GraphQL clients',
          role: 'Fetch screen data',
          beginnerNote:
            'Instead of calling many separate URLs, the app sends one "shopping list" query describing exactly the data a screen needs.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Java + Spring Boot',
          role: 'Microservices',
          beginnerNote:
            'Spring Boot is a toolkit that gives each Java service a ready-made skeleton, so engineers only write the parts unique to their feature.',
          confidence: 'confirmed',
        },
        {
          name: 'DGS Framework',
          role: 'GraphQL APIs',
          beginnerNote:
            "Netflix's own open-source library for answering GraphQL queries inside Spring Boot services.",
          confidence: 'confirmed',
        },
        {
          name: 'Zuul',
          role: 'API gateway',
          beginnerNote:
            "Zuul is like a building's reception desk: every request checks in there first and gets sent to the right office.",
          confidence: 'confirmed',
        },
        {
          name: 'Eureka',
          role: 'Service discovery',
          beginnerNote:
            'Eureka is a phone book for services: each one registers its address so others can find it even as servers come and go.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'Apache Cassandra',
          role: 'Distributed database',
          beginnerNote:
            'Cassandra spreads data across many machines and regions, so the database keeps working even if some of them fail.',
          confidence: 'confirmed',
        },
        {
          name: 'EVCache',
          role: 'In-memory cache',
          beginnerNote:
            'Built on memcached, EVCache keeps popular answers in fast memory, like keeping snacks on your desk instead of walking to the store.',
          confidence: 'confirmed',
        },
        {
          name: 'Apache Kafka',
          role: 'Event streaming',
          beginnerNote:
            'Kafka is a conveyor belt for messages: services drop events like "user pressed pause" on it and others pick them up later.',
          confidence: 'confirmed',
        },
        {
          name: 'Amazon S3',
          role: 'File and data storage',
          beginnerNote:
            'S3 is a practically bottomless online hard drive for huge files such as video masters and data logs.',
          confidence: 'confirmed',
        },
        {
          name: 'Apache Iceberg',
          role: 'Data lake tables',
          beginnerNote:
            'Iceberg, created at Netflix, makes piles of files in S3 behave like neat database tables that analysts can query.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Amazon Web Services',
          role: 'Cloud for the backend',
          beginnerNote:
            "Netflix rents computers in Amazon's data centers instead of owning them, like renting apartments rather than building houses.",
          confidence: 'confirmed',
        },
        {
          name: 'Open Connect',
          role: 'Video delivery network',
          beginnerNote:
            'Netflix places its own video servers inside internet providers, like a local warehouse that ships to your street the same day.',
          confidence: 'confirmed',
        },
        {
          name: 'FreeBSD + NGINX',
          role: 'Open Connect server software',
          beginnerNote:
            'The Open Connect servers run the FreeBSD operating system and the NGINX web server, tuned to push out lots of video very efficiently.',
          confidence: 'confirmed',
        },
        {
          name: 'Titus',
          role: 'Container platform',
          beginnerNote:
            'Titus runs apps packed in containers, which are like shipping boxes that work the same on any machine.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Python',
          role: 'Data science and ML',
          beginnerNote:
            "Python is the most popular language for data work because it's easy to read and has great math and ML libraries.",
          confidence: 'confirmed',
        },
        {
          name: 'Metaflow',
          role: 'ML workflow framework',
          beginnerNote:
            'Metaflow, open-sourced by Netflix, turns a data scientist\'s Python script into a repeatable pipeline that can run on big cloud machines.',
          confidence: 'confirmed',
        },
        {
          name: 'Apache Spark',
          role: 'Big data processing',
          beginnerNote:
            'Spark splits a giant calculation into small pieces and runs them on many computers at the same time.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        {
          name: 'Spinnaker',
          role: 'Continuous delivery',
          beginnerNote:
            'Spinnaker, created at Netflix, is an assembly line that tests and rolls out new code to servers step by step.',
          confidence: 'confirmed',
        },
        {
          name: 'Chaos Monkey',
          role: 'Chaos engineering',
          beginnerNote:
            'Chaos Monkey randomly switches off servers on purpose, like a fire drill that proves the system can handle real emergencies.',
          confidence: 'confirmed',
        },
        {
          name: 'Atlas',
          role: 'Monitoring metrics',
          beginnerNote:
            "Atlas collects health numbers from every service, like a car's dashboard showing speed, fuel and warning lights.",
          confidence: 'confirmed',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'tv-app',
        label: 'TV App',
        kind: 'client',
        tier: 0,
        tech: 'React-based UI on a C++ device runtime',
        description:
          'The Netflix app on smart TVs, consoles and streaming sticks, where most viewing happens. It is built to be driven with a remote control.',
      },
      {
        id: 'phone-app',
        label: 'Phone App',
        kind: 'client',
        tier: 0,
        tech: 'Swift (iOS) · Kotlin (Android)',
        description:
          'The native apps for phones and tablets. They can also download episodes so you can watch offline.',
      },
      {
        id: 'web-app',
        label: 'Web Browser',
        kind: 'client',
        tier: 0,
        tech: 'React',
        description: 'netflix.com in your browser, built with React components and a built-in HTML5 video player.',
      },
      {
        id: 'open-connect',
        label: 'Open Connect CDN',
        kind: 'edge',
        tier: 1,
        tech: 'Open Connect Appliances (FreeBSD + NGINX)',
        description:
          "Netflix's own content delivery network: servers placed inside internet providers and exchange points worldwide, pre-loaded with video. The actual movie bytes come from here, not from AWS.",
      },
      {
        id: 'load-balancer',
        label: 'Load Balancer',
        kind: 'edge',
        tier: 1,
        tech: 'AWS Elastic Load Balancing',
        description:
          'Spreads incoming app requests across many copies of the gateway so no single machine gets overwhelmed.',
      },
      {
        id: 'zuul',
        label: 'Zuul Gateway',
        kind: 'gateway',
        tier: 2,
        tech: 'Zuul (Java, Netflix OSS)',
        description:
          'The front door for every API call. It checks each request and routes it to the right backend service, and can reroute traffic when something breaks.',
      },
      {
        id: 'graphql',
        label: 'GraphQL Gateway',
        kind: 'gateway',
        tier: 2,
        tech: 'GraphQL Federation + DGS',
        description:
          'Lets an app ask for exactly the data a screen needs in one query, then splits that query across the services that own each piece of data.',
      },
      {
        id: 'home-service',
        label: 'Home Page Service',
        kind: 'service',
        tier: 3,
        tech: 'Java · Spring Boot · DGS',
        description:
          'Assembles the rows on your home screen, like "Continue Watching" and "Trending Now", for your specific profile.',
      },
      {
        id: 'playback-service',
        label: 'Playback Service',
        kind: 'service',
        tier: 3,
        tech: 'Java · Spring Boot',
        description:
          'Handles the moment you press Play: it finds your resume point, checks what your device supports and picks the best Open Connect servers for you.',
      },
      {
        id: 'recs-engine',
        label: 'Recommendation Models',
        kind: 'ml',
        tier: 3,
        tech: 'Python · Metaflow · Spark',
        description:
          'Machine-learning models that learn from viewing patterns to rank which shows, and even which artwork, each member is most likely to enjoy.',
      },
      {
        id: 'keystone',
        label: 'Keystone Pipeline',
        kind: 'queue',
        tier: 3,
        tech: 'Apache Kafka · Apache Flink',
        description:
          'A huge conveyor belt for events such as "played", "paused" or "finished". Services drop events on it and other systems process them without slowing the app down.',
      },
      {
        id: 'evcache',
        label: 'EVCache',
        kind: 'cache',
        tier: 4,
        tech: 'EVCache (built on memcached)',
        description:
          'A very fast in-memory store for ready-made answers, like your precomputed recommendation rows, so they are not recalculated on every request.',
      },
      {
        id: 'cassandra',
        label: 'Member Data Store',
        kind: 'database',
        tier: 4,
        tech: 'Apache Cassandra',
        description:
          'A database spread across many machines and AWS regions that stores data like viewing history. It keeps working even when some machines fail.',
      },
      {
        id: 'data-lake',
        label: 'Data Lake',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3 · Apache Iceberg',
        description:
          'Long-term storage for enormous amounts of event logs, which data scientists and ML jobs query to find patterns and run experiments.',
      },
      {
        id: 'video-store',
        label: 'Video Storage',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3',
        description:
          'Holds encoded video files: each title is encoded into many versions for different qualities and devices. New files are copied out to Open Connect servers, mostly during quiet off-peak hours.',
      },
    ],
    edges: [
      { from: 'tv-app', to: 'load-balancer', label: 'HTTPS API calls' },
      { from: 'phone-app', to: 'load-balancer', label: 'HTTPS API calls' },
      { from: 'web-app', to: 'load-balancer', label: 'HTTPS API calls' },
      { from: 'tv-app', to: 'open-connect', label: 'Video chunks' },
      { from: 'phone-app', to: 'open-connect', label: 'Video chunks' },
      { from: 'web-app', to: 'open-connect', label: 'Video chunks' },
      { from: 'load-balancer', to: 'zuul', label: 'Forward traffic' },
      { from: 'zuul', to: 'graphql', label: 'Route API calls' },
      { from: 'zuul', to: 'playback-service', label: 'Playback requests' },
      { from: 'graphql', to: 'home-service', label: 'GraphQL query' },
      { from: 'home-service', to: 'evcache', label: 'Read cached rows' },
      { from: 'home-service', to: 'cassandra', label: 'Viewing history' },
      { from: 'playback-service', to: 'cassandra', label: 'Resume position' },
      { from: 'playback-service', to: 'open-connect', label: 'Pick best servers' },
      { from: 'playback-service', to: 'keystone', label: 'Viewing events' },
      { from: 'keystone', to: 'data-lake', label: 'Store event logs' },
      { from: 'data-lake', to: 'recs-engine', label: 'Training data' },
      { from: 'recs-engine', to: 'evcache', label: 'Write ranked picks' },
      { from: 'video-store', to: 'open-connect', label: 'Off-peak fill' },
    ],
    flows: [
      {
        id: 'open-home',
        title: 'You open the home screen',
        emoji: '🏠',
        steps: [
          {
            from: 'phone-app',
            to: 'load-balancer',
            narration:
              'You open the app, and it sends a secure HTTPS request asking for your home screen, along with which profile you picked.',
          },
          {
            from: 'load-balancer',
            to: 'zuul',
            narration: 'The load balancer hands the request to one of many identical Zuul gateway servers that is not too busy.',
          },
          {
            from: 'zuul',
            to: 'graphql',
            narration: 'Zuul checks the request is legitimate and routes it to the GraphQL gateway, which understands the query for home rows.',
          },
          {
            from: 'graphql',
            to: 'home-service',
            narration: 'The GraphQL gateway sees that the Home Page service owns this data and forwards that part of the query to it.',
          },
          {
            from: 'home-service',
            to: 'evcache',
            narration:
              'The Home Page service grabs your precomputed recommendation rows from EVCache. Reading from memory takes about a millisecond instead of redoing heavy calculations.',
          },
          {
            from: 'home-service',
            to: 'cassandra',
            narration: 'It also reads your recent viewing history from Cassandra to build the "Continue Watching" row.',
          },
          {
            from: 'home-service',
            to: 'graphql',
            narration:
              'The finished rows travel back through the gateway to your phone as JSON, and the app draws the posters.',
          },
        ],
      },
      {
        id: 'press-play',
        title: 'You press Play',
        emoji: '▶️',
        steps: [
          {
            from: 'tv-app',
            to: 'load-balancer',
            narration: 'You press Play on your TV remote. The app sends a "start playback" request that includes what your TV can handle, like 4K or HDR.',
          },
          {
            from: 'load-balancer',
            to: 'zuul',
            narration: 'The load balancer passes the request to a Zuul gateway server.',
          },
          {
            from: 'zuul',
            to: 'playback-service',
            narration: 'Zuul sees this is a playback request and routes it to the Playback service running in AWS.',
          },
          {
            from: 'playback-service',
            to: 'cassandra',
            narration: 'The Playback service looks up where you stopped last time so the episode resumes at the right second.',
          },
          {
            from: 'playback-service',
            to: 'open-connect',
            narration:
              'Using health reports from the Open Connect servers, it picks the nearby ones that already have this video and sends their addresses back to your TV.',
          },
          {
            from: 'tv-app',
            to: 'open-connect',
            narration:
              'Your TV downloads the video straight from a nearby Open Connect server in small chunks, switching quality up or down as your internet speed changes.',
          },
        ],
      },
      {
        id: 'recommend-show',
        title: 'Netflix recommends a show',
        emoji: '✨',
        steps: [
          {
            from: 'zuul',
            to: 'playback-service',
            narration: 'You finish an episode. Your app reports it, and Zuul routes that update to the Playback service.',
          },
          {
            from: 'playback-service',
            to: 'keystone',
            narration: 'The Playback service drops a "finished watching" event onto the Keystone pipeline, then immediately gets back to work.',
          },
          {
            from: 'keystone',
            to: 'data-lake',
            narration: 'Keystone collects millions of events like yours and saves them as tables in the data lake on S3.',
          },
          {
            from: 'data-lake',
            to: 'recs-engine',
            narration:
              'Machine-learning jobs read these logs to learn patterns, such as "people who finished this show often love that one".',
          },
          {
            from: 'recs-engine',
            to: 'evcache',
            narration: 'The models rank titles for each profile and write the ready-made lists into EVCache.',
          },
          {
            from: 'home-service',
            to: 'evcache',
            narration: 'Next time you open the app, the Home Page service reads your fresh list from the cache.',
          },
          {
            from: 'home-service',
            to: 'graphql',
            narration: 'Your new "Because you watched..." row travels back through the gateway and appears on your screen.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'web/src/pages/Browse.tsx', note: 'Home screen page: hero banner plus a stack of title rows' },
    { path: 'web/src/components/TitleRow.tsx', note: 'One sideways-scrolling row of posters' },
    { path: 'web/src/graphql/HomeQuery.graphql', note: 'The GraphQL query the web app sends for home rows' },
    { path: 'tv/src/navigation/RemoteFocus.ts', note: 'Moves the highlight when you press arrow keys on a TV remote' },
    { path: 'android/app/src/main/java/com/teardown/player/PlayerScreen.kt', note: 'Full-screen video player (Jetpack Compose)' },
    { path: 'ios/Teardown/Home/HomeViewController.swift', note: 'iPhone home screen with rows of titles' },
    { path: 'edge/zuul/src/main/java/com/teardown/zuul/filters/AuthFilter.java', note: 'Gateway filter that checks the login token before routing' },
    { path: 'services/home-dgs/src/main/resources/schema/home.graphqls', note: 'GraphQL schema describing rows and titles' },
    { path: 'services/home-dgs/src/main/java/com/teardown/home/HomeDataFetcher.java', note: 'Answers the homeRows GraphQL query' },
    { path: 'services/playback/src/main/java/com/teardown/playback/PlaybackController.java', note: 'The "start playback" API endpoint' },
    { path: 'services/playback/src/main/java/com/teardown/playback/SteeringClient.java', note: 'Asks which Open Connect servers are healthy and close by' },
    { path: 'services/playback/src/main/resources/application.yml', note: 'Service settings: port, timeouts, cache names' },
    { path: 'data/cassandra/viewing_history.cql', note: 'Cassandra table for what each profile watched' },
    { path: 'data/events/playback_event.avsc', note: 'Schema for playback events sent to Kafka' },
    { path: 'ml/recommendations/co_watch.py', note: 'Toy "Because you watched" recommender' },
    { path: 'ml/recommendations/flows/train_ranker.py', note: 'Metaflow pipeline that trains the ranking model' },
    { path: 'infra/spinnaker/playback-deploy.json', note: 'Rollout pipeline: test on a few servers, then everywhere' },
    { path: 'infra/chaos/chaos-monkey.yml', note: 'Which server groups Chaos Monkey is allowed to shut down' },
  ],

  code: [
    {
      id: 'playback-endpoint',
      title: 'Starting playback (Spring Boot)',
      file: 'services/playback/src/main/java/com/teardown/playback/PlaybackController.java',
      language: 'Java',
      explanation:
        'This Spring Boot controller handles the "press Play" request: it looks up where you stopped last time and asks a steering client for the best nearby video servers. It returns a small playback plan as JSON, or a 503 "service unavailable" status so the app knows to retry. The real system also handles things like DRM licenses and device formats, but the overall shape is similar.',
      code: `package com.teardown.playback;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/playback")
public class PlaybackController {

    private final SteeringClient steering;    // knows which video servers are healthy
    private final ViewingHistoryRepo history; // reads from Cassandra

    // Spring creates this class and passes in the helpers it needs
    public PlaybackController(SteeringClient steering, ViewingHistoryRepo history) {
        this.steering = steering;
        this.history = history;
    }

    // POST /playback/start  {"profileId": "p-123", "titleId": "t-42", "device": "tv"}
    @PostMapping("/start")
    public ResponseEntity<PlaybackPlan> start(@RequestBody PlayRequest req) {
        int resumeAt = history.lastPositionSeconds(req.profileId(), req.titleId());

        // Ask for up to 3 nearby servers that already store this video
        List<String> urls = steering.bestServers(req.titleId(), req.device(), 3);
        if (urls.isEmpty()) {
            return ResponseEntity.status(503).build(); // the app will retry
        }
        return ResponseEntity.ok(new PlaybackPlan(req.titleId(), resumeAt, urls));
    }
}

record PlayRequest(String profileId, String titleId, String device) {}

record PlaybackPlan(String titleId, int resumeAtSeconds, List<String> streamUrls) {}`,
    },
    {
      id: 'title-row',
      title: 'A row of posters (React)',
      file: 'web/src/components/TitleRow.tsx',
      language: 'TypeScript',
      explanation:
        'A React component that draws one row of posters, like "Trending Now". It receives its data through props, remembers which card your mouse is over with the useState hook, and tells its parent when you click a title. The row-track class would use display: flex and overflow-x: auto in CSS so the row scrolls sideways.',
      code: `import { useState } from 'react';

type Title = { id: string; name: string; artworkUrl: string };

type TitleRowProps = {
  heading: string;
  titles: Title[];
  onSelect: (title: Title) => void;
};

// One horizontal "shelf" on the home screen, e.g. "Trending Now"
export function TitleRow({ heading, titles, onSelect }: TitleRowProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="row">
      <h2 className="row-heading">{heading}</h2>
      <ul className="row-track">
        {titles.map((title) => (
          <li
            key={title.id}
            className={title.id === hoveredId ? 'card card--active' : 'card'}
            onMouseEnter={() => setHoveredId(title.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelect(title)}
          >
            {/* lazy: only download artwork when it scrolls into view */}
            <img src={title.artworkUrl} alt={title.name} loading="lazy" />
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
    {
      id: 'player-screen',
      title: 'Video player screen (Android)',
      file: 'android/app/src/main/java/com/teardown/player/PlayerScreen.kt',
      language: 'Kotlin',
      explanation:
        "A Jetpack Compose screen that plays video using Android's open-source Media3 ExoPlayer library (Netflix's real player is its own custom one). It resumes from a saved position, starts buffering the first chunks with prepare(), and releases the player when you leave to free memory and the video decoder. Pointing it at an adaptive stream manifest lets the player switch quality automatically.",
      code: `package com.teardown.player

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.common.MediaItem
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView

// streamUrl points to an adaptive stream (e.g. a DASH manifest),
// so the player can change quality as your connection changes.
@Composable
fun PlayerScreen(streamUrl: String, resumeAtMs: Long) {
    val context = LocalContext.current

    val player = remember(streamUrl) {
        ExoPlayer.Builder(context).build().apply {
            setMediaItem(MediaItem.fromUri(streamUrl))
            seekTo(resumeAtMs)   // pick up where you left off
            prepare()            // start downloading the first chunks
            playWhenReady = true // play as soon as enough is buffered
        }
    }

    // Free the decoder and network connections when this screen closes
    DisposableEffect(player) {
        onDispose { player.release() }
    }

    AndroidView(
        modifier = Modifier.fillMaxSize(),
        factory = { ctx -> PlayerView(ctx).apply { this.player = player } }
    )
}`,
    },
    {
      id: 'viewing-history-schema',
      title: 'Viewing history table (Cassandra)',
      file: 'data/cassandra/viewing_history.cql',
      language: 'CQL',
      explanation:
        'A Cassandra table designed around one question: "what did this profile watch most recently?". profile_id is the partition key, so all of a profile\'s rows live together on the same machines, and the clustering order keeps the newest activity first so "Continue Watching" is a quick read. The keyspace keeps 3 copies of every row in each data center, so losing a machine does not lose data.',
      code: `-- Keep 3 copies of every row in each data center
CREATE KEYSPACE IF NOT EXISTS viewing
  WITH replication = {
    'class': 'NetworkTopologyStrategy',
    'dc_us_east': 3,
    'dc_eu_west': 3
  };

-- One row per viewing session, grouped by profile, newest first
CREATE TABLE IF NOT EXISTS viewing.history_by_profile (
  profile_id    text,
  last_watched  timestamp,
  title_id      text,
  position_sec  int,
  duration_sec  int,
  device_type   text,
  PRIMARY KEY ((profile_id), last_watched, title_id)
) WITH CLUSTERING ORDER BY (last_watched DESC, title_id ASC);

-- Save progress (Cassandra writes are very fast)
INSERT INTO viewing.history_by_profile
  (profile_id, last_watched, title_id, position_sec, duration_sec, device_type)
VALUES ('p-123', toTimestamp(now()), 't-42', 1260, 3300, 'tv');

-- "Continue Watching": the 10 most recent sessions for this profile
SELECT title_id, position_sec, duration_sec
FROM viewing.history_by_profile
WHERE profile_id = 'p-123'
LIMIT 10;`,
    },
    {
      id: 'because-you-watched',
      title: '"Because you watched" (Python)',
      file: 'ml/recommendations/co_watch.py',
      language: 'Python',
      explanation:
        'A tiny recommender that counts how often two shows appear in the same person\'s watch history, then suggests the most common companions. Netflix\'s real system uses large machine-learning models trained on huge amounts of viewing data, but the core idea of learning from what similar viewers enjoyed is the same. Run it and you get the three shows most often watched alongside "Stellar Drift".',
      code: `from collections import Counter, defaultdict

# Each list is what one (anonymous) profile finished watching.
watch_histories = [
    ["Stellar Drift", "Haunted Lake", "Code Heist"],
    ["Stellar Drift", "Haunted Lake", "Robot Chef"],
    ["Royal Mess", "Time Loop High", "Stellar Drift"],
    ["Haunted Lake", "Robot Chef", "Code Heist"],
]


def build_co_watch_counts(histories):
    """Count how often every pair of shows appears in the same history."""
    together = defaultdict(Counter)
    for history in histories:
        shows = list(dict.fromkeys(history))  # remove duplicates, keep order
        for show in shows:
            for other in shows:
                if show != other:
                    together[show][other] += 1
    return together


def because_you_watched(show, together, already_seen, k=3):
    """Return up to k shows most often watched alongside this show."""
    ranked = together[show].most_common()
    return [title for title, _count in ranked if title not in already_seen][:k]


together = build_co_watch_counts(watch_histories)
picks = because_you_watched("Stellar Drift", together, already_seen={"Stellar Drift"})
print(picks)  # ['Haunted Lake', 'Code Heist', 'Robot Chef']`,
    },
  ],

  playground: {
    title: 'Mini Netflix Home Screen',
    description:
      'A dark home screen with a gradient hero banner, sideways-scrolling rows of title cards, a details sheet and a pretend player that switches video quality like adaptive streaming.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mini Netflix Home</title>
<style>
:root {
  --brand: #E50914; /* @tweak color "Brand red" */
  --bg: #141414; /* @tweak color "Background" */
  --hero-height: 320px; /* @tweak range 220 440 "Hero height" */
  --card-width: 108px; /* @tweak range 80 160 "Card width" */
  --card-radius: 6px; /* @tweak range 0 24 "Card corners" */
  --gap: 8px; /* @tweak range 2 20 "Card spacing" */
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: #fff; font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; overflow-x: hidden; }
button { font: inherit; cursor: pointer; }
/* Top bar floats over the hero */
.topbar { position: absolute; top: 0; left: 0; right: 0; z-index: 2; display: flex; align-items: center; gap: 14px; padding: 12px 16px; }
.logo { color: var(--brand); font-weight: 900; font-size: 24px; letter-spacing: 1px; }
.topbar span { font-size: 13px; color: #e5e5e5; }
/* Hero banner: stacked CSS gradients instead of a photo */
.hero {
  position: relative; height: var(--hero-height); padding: 16px; display: flex; flex-direction: column; justify-content: flex-end;
  background:
    linear-gradient(to top, var(--bg) 5%, transparent 55%),
    radial-gradient(circle at 70% 35%, #ffcc70 0, #ff6a3d 10%, transparent 30%),
    linear-gradient(160deg, #0b1d3a 0%, #3a1c5c 50%, #7a1020 100%);
}
.badge { margin: 0 0 4px; font-size: 11px; letter-spacing: 3px; color: #ccc; }
.hero h1 { margin: 0 0 6px; font-size: 32px; line-height: 1; text-transform: uppercase; }
.hero p.desc { margin: 0 0 12px; font-size: 13px; color: #ddd; max-width: 300px; }
.actions { display: flex; gap: 10px; }
.btn { border: 0; border-radius: 4px; padding: 8px 20px; font-weight: 700; font-size: 15px; }
.btn-play { background: #fff; color: #000; }
.btn-info { background: rgba(110, 110, 110, 0.7); color: #fff; }
/* Rows of title cards that scroll sideways */
.row { padding: 12px 0 0 16px; }
.row h2 { margin: 0 0 8px; font-size: 16px; }
.track { display: flex; gap: var(--gap); overflow-x: auto; padding: 6px 16px 8px 0; scrollbar-width: none; }
.card { flex: 0 0 var(--card-width); aspect-ratio: 2 / 3; border-radius: var(--card-radius); display: flex; align-items: flex-end;
  padding: 8px; font-size: 12px; font-weight: 700; text-shadow: 0 1px 4px #000; cursor: pointer; transition: transform 0.2s; }
.card.selected { transform: scale(1.05); box-shadow: 0 0 0 2px var(--brand); }
/* Details sheet that slides up from the bottom */
.sheet { position: fixed; left: 0; right: 0; bottom: 0; z-index: 3; padding: 16px; background: #232323; border-radius: 12px 12px 0 0; transform: translateY(110%); transition: transform 0.25s; }
.sheet.open { transform: translateY(0); }
.sheet h3 { margin: 0 0 6px; font-size: 20px; }
.meta { margin: 0 0 12px; font-size: 13px; color: #bbb; }
.match { color: #46d369; font-weight: 700; }
.close { position: absolute; top: 10px; right: 12px; background: none; border: 0; color: #fff; font-size: 20px; }
/* Full-screen "now playing" view */
.player { position: fixed; inset: 0; z-index: 4; display: none; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 24px; background: #000; text-align: center; }
.player.open { display: flex; }
.player h2 { margin: 0; }
.big { width: 72px; height: 72px; border-radius: 50%; border: 2px solid #fff; background: none; color: #fff; font-size: 24px; }
.bar { width: 100%; height: 4px; background: #444; border-radius: 2px; }
.fill { width: 0; height: 100%; background: var(--brand); border-radius: 2px; }
.small { margin: 0; font-size: 12px; color: #aaa; }
</style>
</head>
<body>
<header class="topbar">
  <div class="logo" data-edit="logo">NETFLIX</div>
  <span>Shows</span><span>Movies</span><span>My List</span>
</header>

<section class="hero">
  <p class="badge">#1 IN TV SHOWS TODAY</p>
  <h1 id="heroTitle" data-edit="hero-title">Stellar Drift</h1>
  <p class="desc" data-edit="hero-desc">Teen engineers must fix their failing starship before it drifts into a black hole.</p>
  <div class="actions">
    <button class="btn btn-play" id="heroPlay">▶ Play</button>
    <button class="btn btn-info" id="heroInfo">ⓘ Info</button>
  </div>
</section>

<section class="row">
  <h2 data-edit="row-1">Trending Now</h2>
  <div class="track" id="trending"></div>
</section>
<section class="row">
  <h2 data-edit="row-2">Continue Watching</h2>
  <div class="track" id="watching"></div>
</section>

<div class="sheet" id="sheet">
  <button class="close" id="sheetClose" aria-label="Close">✕</button>
  <h3 id="sheetTitle">Title</h3>
  <p class="meta"><span class="match" id="sheetMatch">98% Match</span> · 2026 · 1 Season</p>
  <button class="btn btn-play" id="sheetPlay">▶ Play</button>
</div>

<div class="player" id="player">
  <button class="close" id="playerClose" aria-label="Back">✕</button>
  <p class="small">Now playing</p>
  <h2 id="playerTitle">Title</h2>
  <button class="big" id="toggle" aria-label="Play or pause">❚❚</button>
  <div class="bar"><div class="fill" id="fill"></div></div>
  <p class="small" id="quality">Streaming in HD 1080p</p>
</div>

<script>
// Fake catalog: [title, gradient color 1, gradient color 2]
var catalog = {
  trending: [["Stellar Drift", "#0b1d3a", "#7a1020"], ["Robot Chef", "#f7971e", "#8e2de2"], ["Haunted Lake", "#134e5e", "#0b0b0b"], ["Code Heist", "#00b09b", "#1c1c3c"], ["Royal Mess", "#b24592", "#f15f79"], ["Time Loop High", "#4568dc", "#b06ab3"]],
  watching: [["Deep Sea Detectives", "#1e3c72", "#2a5298"], ["Pixel Kingdom", "#ff512f", "#dd2476"], ["Mountain Rescue", "#56ab2f", "#1b3a1b"], ["Midnight Diner", "#434343", "#8a2a2a"]]
};
var qualities = ["SD 480p", "HD 720p", "HD 1080p", "Ultra HD 4K"];
var selectedCard = null;
var playing = false;
var progress = 0;
function byId(id) { return document.getElementById(id); }

// Build one gradient "poster" card per title
function fillRow(rowId, titles) {
  titles.forEach(function (t) {
    var card = document.createElement("div");
    card.className = "card";
    card.textContent = t[0];
    card.style.background = "linear-gradient(160deg, " + t[1] + ", " + t[2] + ")";
    card.onclick = function () { openSheet(t[0], card); };
    byId(rowId).appendChild(card);
  });
}
fillRow("trending", catalog.trending);
fillRow("watching", catalog.watching);

// Tap a card: highlight it and slide up the details sheet
function openSheet(name, card) {
  closeSheet();
  selectedCard = card;
  if (card) card.classList.add("selected");
  byId("sheetTitle").textContent = name;
  byId("sheetMatch").textContent = (80 + Math.floor(Math.random() * 20)) + "% Match";
  byId("sheet").classList.add("open");
}
function closeSheet() {
  if (selectedCard) selectedCard.classList.remove("selected");
  selectedCard = null;
  byId("sheet").classList.remove("open");
}

// Open the full-screen player and restart the progress bar
function play(name) {
  closeSheet();
  byId("playerTitle").textContent = name;
  byId("player").classList.add("open");
  progress = 0;
  setPlaying(true);
}
function setPlaying(on) {
  playing = on;
  byId("toggle").textContent = on ? "❚❚" : "▶";
}

// Every half second, move the progress bar while playing
setInterval(function () {
  if (!playing) return;
  progress = Math.min(progress + 1, 100);
  byId("fill").style.width = progress + "%";
}, 500);

// Every 3 seconds, pretend your internet speed changed (adaptive bitrate)
setInterval(function () {
  if (!playing) return;
  var q = qualities[Math.floor(Math.random() * qualities.length)];
  byId("quality").textContent = "Streaming in " + q;
}, 3000);

byId("heroPlay").onclick = function () { play(byId("heroTitle").textContent); };
byId("heroInfo").onclick = function () { openSheet(byId("heroTitle").textContent, null); };
byId("sheetPlay").onclick = function () { play(byId("sheetTitle").textContent); };
byId("sheetClose").onclick = closeSheet;
byId("toggle").onclick = function () { setPlaying(!playing); };
byId("playerClose").onclick = function () { setPlaying(false); byId("player").classList.remove("open"); };
</script>
</body>
</html>`,
    challenges: [
      'Change "Brand red" to another color and watch the logo, the selected card outline and the progress bar all update together.',
      'Edit the hero title to name your own show, then press Play and check that the player shows your new title.',
      'Add a third row called "Top Picks for You": copy a row section in the HTML, give its track a new id, and add a matching list to the catalog in the script.',
      'Make the pretend adaptive streaming switch quality faster by changing 3000 (milliseconds) in the second setInterval.',
    ],
  },

  concepts: [
    {
      term: 'Microservices',
      meaning: 'Building one big product as many small, independent services that each do one job and talk to each other over the network.',
    },
    {
      term: 'API gateway',
      meaning: 'A single front door that receives every request from the apps and routes it to the right backend service.',
    },
    {
      term: 'CDN (Open Connect)',
      meaning:
        "A network of servers placed close to viewers that store copies of content so it travels a shorter distance; Open Connect is Netflix's own CDN.",
    },
    {
      term: 'Adaptive bitrate streaming',
      meaning: 'Splitting a video into short chunks encoded at several quality levels so the player can switch up or down as your internet speed changes.',
    },
    {
      term: 'Caching',
      meaning: 'Keeping a ready-made copy of frequently requested data in fast memory so it does not have to be recomputed or fetched again.',
    },
    {
      term: 'Event streaming',
      meaning: 'Sending a continuous flow of small messages, like "user paused", through a system such as Kafka so many other programs can react to them.',
    },
    {
      term: 'Chaos engineering',
      meaning: 'Deliberately breaking parts of a live system, like shutting down random servers, to prove it can survive real failures.',
    },
    {
      term: 'Circuit breaker',
      meaning:
        'A safety switch that stops calling a failing service for a while and uses a fallback instead, so one broken piece does not take down everything.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Build the home screen',
      detail:
        'Create a React app with Vite (or an Expo app) and draw a hero banner plus a few rows of cards from a hard-coded JSON list of titles.',
    },
    {
      step: 'Use real movie data',
      detail:
        'Sign up for a free TMDB (The Movie Database) API key and fetch real titles and poster images to fill your rows.',
    },
    {
      step: 'Add a simple backend',
      detail:
        'Write a small API with Node.js and Express (or Java with Spring Boot from start.spring.io) that returns home rows as JSON, then call it from your app.',
    },
    {
      step: 'Save watch history',
      detail:
        'Store profiles and "last watched position" in a database such as SQLite or a hosted Supabase project, and use it to build a Continue Watching row.',
    },
    {
      step: 'Stream a video',
      detail:
        'Play a free sample HLS stream in an HTML video element using the hls.js library, and watch it switch quality when you throttle your network in browser DevTools.',
    },
    {
      step: 'Recommend and ship it',
      detail:
        'Add a "Because you watched" row using simple co-watch counts, then deploy the frontend to Vercel or Netlify and the backend to Render.',
    },
  ],

  sources: [
    { label: 'Netflix on Wikipedia', url: 'https://en.wikipedia.org/wiki/Netflix' },
    { label: 'Netflix TechBlog', url: 'https://netflixtechblog.com' },
    { label: 'Netflix Open Connect', url: 'https://openconnect.netflix.com' },
    { label: 'Netflix Open Source (GitHub)', url: 'https://github.com/Netflix' },
    { label: 'Netflix Research', url: 'https://research.netflix.com' },
  ],
};
