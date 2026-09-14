import type { Teardown } from '../types';

export const x: Teardown = {
  id: 'x',
  name: 'X (Twitter)',
  url: 'x.com',
  tagline: 'Short public posts, replies and reposts, shared with the whole world in real time.',
  category: 'Social Media',
  brandColor: '#000000',
  accentColor: '#1D9BF0',
  logoGlyph: '𝕏',
  source: 'curated',

  eli5:
    "X, formerly Twitter, is like a giant public noticeboard where anyone can pin up a short message called a post (it used to be called a tweet). When you post, X's servers give your message a unique ID number, save it, and quickly slip it into the timelines of the people who follow you. When you open the app, a recommendation system gathers posts from accounts you follow and accounts it thinks you'll enjoy, then puts the most interesting ones at the top.",

  facts: [
    { label: 'First tweet', value: 'March 21, 2006 ("just setting up my twttr")' },
    { label: 'Founders', value: 'Jack Dorsey, Noah Glass, Biz Stone & Evan Williams' },
    { label: 'Post length', value: '280 characters for most accounts (140 until 2017)' },
    { label: 'Acquisition', value: 'Bought by Elon Musk for about $44 billion in October 2022' },
    { label: 'New name', value: 'Rebranded from Twitter to X in July 2023' },
    { label: 'Traffic record', value: '143,199 tweets in one second (August 2013)' },
    {
      label: 'Known for (tech)',
      value: 'Open-source projects like Finagle, Snowflake, Zipkin and the Bootstrap CSS framework',
    },
  ],

  history: [
    {
      year: '2006',
      title: '"just setting up my twttr"',
      detail:
        'Twitter began as a side project inside the podcasting company Odeo. Jack Dorsey sent the first tweet on March 21, 2006, and the service opened to the public that summer.',
    },
    {
      year: '2007',
      title: 'Its own company, and the hashtag',
      detail:
        'Twitter became a separate company and took off at the South by Southwest (SXSW) festival. That August, user Chris Messina suggested using # to group tweets by topic, and the hashtag was born.',
    },
    {
      year: '2008',
      title: 'The Fail Whale era',
      detail:
        'Growth kept overloading the original Ruby on Rails app, so users often saw an error page showing a whale lifted by birds. The pain pushed engineers to start rewriting busy back-end pieces, like the message queue, in Scala.',
    },
    {
      year: '2010',
      title: 'Snowflake IDs',
      detail:
        'Twitter announced Snowflake, an open-source service that creates unique, roughly time-ordered 64-bit IDs for tweets on many machines at once. It was needed because Twitter was moving data off MySQL, which had been handing out simple one-after-another IDs.',
    },
    {
      year: '2011',
      title: 'Finagle and faster search',
      detail:
        'Twitter open-sourced Finagle, its Scala library for services that call each other over the network, and replaced the Ruby on Rails front end of search with a Java server called Blender, making search about three times faster. Bootstrap, first built by two Twitter employees, was also released that year.',
    },
    {
      year: '2013',
      title: 'Off the monolith, onto the stock market',
      detail:
        'After years of moving from one big Ruby app to many JVM services, Twitter handled a record 143,199 tweets per second in August without falling over. In November it went public on the New York Stock Exchange.',
    },
    {
      year: '2014',
      title: 'Manhattan database',
      detail:
        "Engineers introduced Manhattan, Twitter's own distributed database, built to store data across many machines and data centers with very fast reads and writes.",
    },
    {
      year: '2017',
      title: '280 characters and Twitter Lite',
      detail:
        'The limit doubled from 140 to 280 characters for most languages. Twitter also launched Twitter Lite, a fast mobile website built with React and Node.js that later became the base for the main twitter.com site.',
    },
    {
      year: '2022',
      title: 'Elon Musk buys Twitter',
      detail:
        'Elon Musk completed his purchase of Twitter for about $44 billion in October 2022, took the company private, and cut a large share of its staff.',
    },
    {
      year: '2023',
      title: 'Open-source algorithm and the X rebrand',
      detail:
        'In March, much of the code behind the "For You" timeline was published on GitHub. In July, Twitter was renamed X, tweets became posts, and the blue bird was replaced by an X logo.',
    },
  ],

  languages: [
    { name: 'Scala', usedFor: 'Most back-end services: Finagle servers, timelines and recommendation pipelines', share: 35 },
    { name: 'Java', usedFor: 'Search (Earlybird on Lucene), data pipelines and JVM infrastructure', share: 20 },
    { name: 'JavaScript', usedFor: 'The x.com web app, built with React and React Native for Web', share: 15 },
    { name: 'Python', usedFor: 'Training machine-learning models such as the ranking neural network', share: 10 },
    { name: 'Swift / Objective-C', usedFor: 'The iPhone and iPad app', share: 10 },
    { name: 'Kotlin / Java (Android)', usedFor: 'The Android app', share: 10 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'React',
          role: 'Web UI library',
          beginnerNote:
            'Builds the x.com page from reusable components, and Twitter wrote publicly about using it for Twitter Lite, which grew into the main website.',
          confidence: 'confirmed',
        },
        {
          name: 'React Native for Web',
          role: 'Cross-platform UI components',
          beginnerNote:
            'Lets developers write components in the React Native style and have them run in a browser; it was created by an engineer at Twitter and powers its web app.',
          confidence: 'confirmed',
        },
        {
          name: 'Redux',
          role: 'App-wide state',
          beginnerNote:
            'Keeps shared data, like the posts already loaded, in one central store so every part of the page shows the same thing.',
          confidence: 'confirmed',
        },
        {
          name: 'GraphQL',
          role: 'Asking for exactly the data needed',
          beginnerNote:
            'The web app sends queries that list exactly which fields it wants, like filling in an order form instead of taking a fixed combo meal.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Mobile',
      items: [
        {
          name: 'Swift & Objective-C',
          role: 'iPhone and iPad app',
          beginnerNote:
            "These are Apple's languages for native apps, giving smooth scrolling through long timelines and access to features like notifications.",
          confidence: 'likely',
        },
        {
          name: 'Kotlin & Java',
          role: 'Android app',
          beginnerNote:
            'The standard languages for Android apps, which run the timeline, compose screen and notifications on Android phones.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Ruby on Rails',
          role: 'The original app (2006 to early 2010s)',
          beginnerNote:
            'A beginner-friendly web framework that let a small team build Twitter fast, but one big Rails app struggled once millions of people tweeted at the same moment.',
          confidence: 'confirmed',
        },
        {
          name: 'Scala on the JVM',
          role: 'Main language for services',
          beginnerNote:
            'Scala runs on the Java Virtual Machine, which is fast for long-running servers, so Twitter rewrote its busiest systems in it.',
          confidence: 'confirmed',
        },
        {
          name: 'Finagle',
          role: 'How services talk to each other',
          beginnerNote:
            "Twitter's open-source library for making and answering network calls between services, with timeouts and retries built in so one slow service doesn't freeze everything.",
          confidence: 'confirmed',
        },
        {
          name: 'Thrift & Scrooge',
          role: 'Shared message formats',
          beginnerNote:
            'Thrift files describe what a request and response look like, and Scrooge turns them into Scala code, so two services always agree on the shape of the data.',
          confidence: 'confirmed',
        },
        {
          name: 'Snowflake',
          role: 'Unique ID generator',
          beginnerNote:
            'Builds each post ID from the current time, a machine number and a counter, so thousands of servers can create IDs at once without ever repeating one.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'Manhattan',
          role: 'Main distributed database',
          beginnerNote:
            "Twitter's own key-value database, which works like a huge dictionary spread across many machines and data centers, with extra copies in case a machine dies.",
          confidence: 'confirmed',
        },
        {
          name: 'Redis',
          role: 'Cached home timelines',
          beginnerNote:
            "Keeps each active user's timeline as a list of post IDs in memory, which engineers described in talks as the key to loading timelines quickly.",
          confidence: 'confirmed',
        },
        {
          name: 'Memcached (Twemcache)',
          role: 'In-memory cache',
          beginnerNote:
            'Short-term memory for popular data like user profiles, so databases are not asked the same question millions of times; Twemcache is Twitter’s open-source version.',
          confidence: 'confirmed',
        },
        {
          name: 'MySQL',
          role: 'Relational database',
          beginnerNote:
            'A classic table-based database that stored tweets and users in the early years, split across many servers once one machine was not enough.',
          confidence: 'confirmed',
        },
        {
          name: 'Earlybird (Lucene)',
          role: 'Real-time search index',
          beginnerNote:
            'A search engine built on Apache Lucene that can find a post within seconds of it being written, and it also supplies posts for the For You timeline.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Own data centers',
          role: 'Where the servers live',
          beginnerNote:
            'Instead of renting everything from a cloud company, Twitter has run much of its service on servers in data centers it operates.',
          confidence: 'confirmed',
        },
        {
          name: 'Apache Kafka',
          role: 'Event streaming',
          beginnerNote:
            'A shared, ordered log of events like "new post" or "someone liked this", which many services can read at their own pace.',
          confidence: 'confirmed',
        },
        {
          name: 'Apache Mesos & Aurora',
          role: 'Running services on a shared cluster',
          beginnerNote:
            'Mesos pooled thousands of machines into one big computer and Aurora, which Twitter open-sourced, decided where each service should run and restarted crashed ones.',
          confidence: 'confirmed',
        },
        {
          name: 'Hadoop & Scalding',
          role: 'Big offline data jobs',
          beginnerNote:
            "Hadoop crunches huge piles of stored data over many machines, and Scalding is Twitter's Scala library for writing those jobs, like computing who-follows-whom statistics.",
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Home Mixer',
          role: 'Builds the For You timeline',
          beginnerNote:
            'A service from the 2023 open-source release that gathers candidate posts, asks models to score them, filters them, and mixes in things like ads.',
          confidence: 'confirmed',
        },
        {
          name: 'SimClusters',
          role: 'Finds communities of interest',
          beginnerNote:
            'Groups accounts into communities, like "space fans" or "football", so posts popular in your communities can reach you even from people you do not follow.',
          confidence: 'confirmed',
        },
        {
          name: 'Real Graph',
          role: 'Predicts who you interact with',
          beginnerNote:
            'A model that guesses how likely you are to interact with each account, so posts from your closest connections get extra weight.',
          confidence: 'confirmed',
        },
        {
          name: 'Heavy ranker',
          role: 'Neural network that orders posts',
          beginnerNote:
            'Predicts how likely you are to like, repost or reply to each candidate, then combines those guesses into one score used to sort your timeline.',
          confidence: 'confirmed',
        },
        {
          name: 'navi (Rust)',
          role: 'Serves ML models fast',
          beginnerNote:
            'A model-serving server written in Rust, published with the algorithm code, that runs trained models quickly enough to score posts while you wait.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        {
          name: 'Zipkin',
          role: 'Tracing requests across services',
          beginnerNote:
            'Twitter created this open-source tool to follow one request as it hops between services and show which hop was slow, like a parcel tracking page.',
          confidence: 'confirmed',
        },
        {
          name: 'Pants build system',
          role: 'Building a giant shared codebase',
          beginnerNote:
            'Twitter created Pants to build and test only the parts of its huge single code repository that actually changed, instead of rebuilding everything.',
          confidence: 'confirmed',
        },
        {
          name: 'Canary releases',
          role: 'Rolling out code safely',
          beginnerNote:
            'New code goes to a few servers first, and if error rates stay normal it spreads to the rest, like a taste test before serving the whole pot.',
          confidence: 'likely',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      // Tier 0: clients
      {
        id: 'mobile-app',
        label: 'X mobile apps',
        kind: 'client',
        tier: 0,
        tech: 'Swift (iOS) & Kotlin (Android)',
        description:
          'The X app on iPhone and Android. It shows your timeline, lets you post, and talks to X over the internet.',
      },
      {
        id: 'web-app',
        label: 'x.com',
        kind: 'client',
        tier: 0,
        tech: 'React + React Native for Web (JavaScript)',
        description: 'The website version of X, a JavaScript app that runs inside your browser.',
      },
      // Tier 1: edge
      {
        id: 'cdn',
        label: 'Media CDN',
        kind: 'edge',
        tier: 1,
        tech: 'Edge caches (pbs.twimg.com, video.twimg.com)',
        description:
          'Servers close to users that keep copies of photos, videos and profile pictures, so they download quickly without bothering the main servers.',
      },
      {
        id: 'lb',
        label: 'Load balancers',
        kind: 'edge',
        tier: 1,
        tech: 'Front-end proxies & load balancers',
        description:
          'The front door for app requests. They spread traffic across many API servers so a sudden spike, like a big sports moment, does not flatten one machine.',
      },
      // Tier 2: API and front-line services
      {
        id: 'api',
        label: 'API front end',
        kind: 'gateway',
        tier: 2,
        tech: 'Finagle servers (Scala), HTTP + GraphQL',
        description:
          'Checks who you are and what you are allowed to do, then calls the right internal services to answer each request.',
      },
      {
        id: 'tweet-svc',
        label: 'Tweet service',
        kind: 'service',
        tier: 2,
        tech: 'Tweetypie (Scala)',
        description:
          'The core service for reading and writing posts. It gives each new post a Snowflake ID and fetches full post details when other services only have IDs.',
      },
      {
        id: 'home-mixer',
        label: 'Home Mixer',
        kind: 'service',
        tier: 2,
        tech: 'Home Mixer on Product Mixer (Scala)',
        description:
          'Builds your For You timeline: it collects candidate posts, has them scored, filters out things you should not see, and mixes the final list.',
      },
      // Tier 3: streams, workers and ML
      {
        id: 'kafka',
        label: 'Event stream',
        kind: 'queue',
        tier: 3,
        tech: 'Apache Kafka',
        description:
          'An ordered log of everything happening, like new posts and likes. Services subscribe to it and react at their own pace instead of calling each other directly.',
      },
      {
        id: 'fanout',
        label: 'Fan-out service',
        kind: 'service',
        tier: 3,
        tech: 'Timeline fan-out workers (JVM)',
        description:
          "When someone posts, it looks up their followers and adds the new post's ID to each follower's cached timeline.",
      },
      {
        id: 'candidates',
        label: 'Candidate sources',
        kind: 'ml',
        tier: 3,
        tech: 'SimClusters, Real Graph & engagement graphs',
        description:
          'Finds posts from accounts you do not follow that you might still like, for example posts that are popular in communities you are interested in.',
      },
      {
        id: 'ranker',
        label: 'Heavy ranker',
        kind: 'ml',
        tier: 3,
        tech: 'Neural network served by navi (Rust)',
        description:
          'Predicts how likely you are to like, repost or reply to each candidate post, and turns those predictions into one score for sorting.',
      },
      // Tier 4: data & storage
      {
        id: 'manhattan',
        label: 'Manhattan',
        kind: 'database',
        tier: 4,
        tech: 'Manhattan distributed key-value database',
        description:
          'Stores posts, likes and much more as key-value pairs spread over many machines, with copies kept in several places so nothing is lost.',
      },
      {
        id: 'timeline-cache',
        label: 'Timeline cache',
        kind: 'cache',
        tier: 4,
        tech: 'Redis (plus Memcached for other hot data)',
        description:
          'Holds a ready-made list of recent post IDs for each active user in memory, so timelines can be read without searching the whole database.',
      },
      {
        id: 'search-index',
        label: 'Search index',
        kind: 'database',
        tier: 4,
        tech: 'Earlybird (built on Apache Lucene)',
        description:
          'A real-time index of posts by word, author and time. It powers search and supplies recent posts from people you follow.',
      },
      {
        id: 'media-storage',
        label: 'Media storage',
        kind: 'storage',
        tier: 4,
        tech: 'Blobstore (photo & video files)',
        description:
          'Where the actual photo and video files live. Posts only store a pointer to the file, while this system holds the heavy bytes.',
      },
    ],
    edges: [
      { from: 'mobile-app', to: 'lb', label: 'HTTPS' },
      { from: 'web-app', to: 'lb', label: 'HTTPS / GraphQL' },
      { from: 'mobile-app', to: 'cdn', label: 'HTTPS (images, video)' },
      { from: 'web-app', to: 'cdn', label: 'HTTPS (images, video)' },
      { from: 'cdn', to: 'media-storage', label: 'fetch on cache miss' },
      { from: 'lb', to: 'api', label: 'HTTP' },
      { from: 'api', to: 'tweet-svc', label: 'Thrift RPC' },
      { from: 'api', to: 'home-mixer', label: 'Thrift RPC' },
      { from: 'api', to: 'media-storage', label: 'upload media' },
      { from: 'api', to: 'manhattan', label: 'save like' },
      { from: 'api', to: 'kafka', label: 'user action events' },
      { from: 'tweet-svc', to: 'manhattan', label: 'store post' },
      { from: 'tweet-svc', to: 'kafka', label: 'new post event' },
      { from: 'kafka', to: 'fanout', label: 'consume events' },
      { from: 'kafka', to: 'search-index', label: 'index new posts' },
      { from: 'kafka', to: 'candidates', label: 'real-time signals' },
      { from: 'fanout', to: 'timeline-cache', label: 'push post IDs' },
      { from: 'home-mixer', to: 'search-index', label: 'in-network candidates' },
      { from: 'home-mixer', to: 'candidates', label: 'out-of-network candidates' },
      { from: 'home-mixer', to: 'ranker', label: 'score ~1,500 posts' },
      { from: 'home-mixer', to: 'tweet-svc', label: 'fetch post details' },
    ],
    flows: [
      {
        id: 'post-tweet',
        title: 'You post a tweet',
        emoji: '✍️',
        steps: [
          {
            from: 'mobile-app',
            to: 'lb',
            narration:
              'You type your post, the counter shows you are under 280 characters, and you tap Post. The app sends the text over a secure HTTPS connection.',
          },
          {
            from: 'lb',
            to: 'api',
            narration:
              'A load balancer picks an API server that is not too busy. The API checks you are logged in and that the post follows the rules.',
          },
          {
            from: 'api',
            to: 'tweet-svc',
            narration:
              'The API calls the Tweet service, which creates a Snowflake ID for your post: a 64-bit number that starts with the current time, so newer posts get bigger IDs.',
          },
          {
            from: 'tweet-svc',
            to: 'manhattan',
            narration:
              'The post (its ID, your user ID and the text) is saved in the Manhattan database, with copies kept on several machines.',
          },
          {
            from: 'tweet-svc',
            to: 'kafka',
            narration:
              'A "new post" event is written to Kafka, and your app is told the post worked, so it appears on your screen without waiting for the next steps.',
          },
          {
            from: 'kafka',
            to: 'fanout',
            narration:
              'The fan-out service reads the event and looks up everyone who follows you. Meanwhile the search indexer reads the same event, so your post becomes searchable within seconds.',
          },
          {
            from: 'fanout',
            to: 'timeline-cache',
            narration:
              "It adds your post's ID to the top of each follower's cached timeline list in Redis, so it is waiting for them the next time they refresh.",
          },
        ],
      },
      {
        id: 'open-for-you',
        title: 'You open the For You timeline',
        emoji: '🏠',
        steps: [
          {
            from: 'web-app',
            to: 'lb',
            narration: 'You open x.com, and the page asks X for the first page of your For You timeline over HTTPS.',
          },
          {
            from: 'lb',
            to: 'api',
            narration: 'The request is passed to one of the API front-end servers.',
          },
          {
            from: 'api',
            to: 'home-mixer',
            narration: 'The API asks Home Mixer to build a timeline just for you.',
          },
          {
            from: 'home-mixer',
            to: 'search-index',
            narration:
              'First it grabs recent posts from accounts you follow out of the Earlybird search index, favoring accounts you interact with most.',
          },
          {
            from: 'home-mixer',
            to: 'candidates',
            narration:
              "Then it asks for posts from accounts you don't follow, like ones popular in your SimClusters communities. In 2023, Twitter said For You was about half of each kind on average.",
          },
          {
            from: 'home-mixer',
            to: 'ranker',
            narration:
              'The heavy ranker scores roughly 1,500 candidates by how likely you are to engage. Home Mixer then filters out blocked or muted accounts, avoids too many posts from one author, and mixes the final list.',
          },
          {
            from: 'web-app',
            to: 'cdn',
            narration:
              'The page receives the list of posts and downloads avatars, photos and videos from a nearby CDN server, so the timeline fills in quickly.',
          },
        ],
      },
      {
        id: 'like-post',
        title: 'You like a post',
        emoji: '❤️',
        steps: [
          {
            from: 'mobile-app',
            to: 'lb',
            narration:
              'You tap the heart. It turns pink and the count goes up instantly on your screen, while a small like request is sent in the background.',
          },
          {
            from: 'lb',
            to: 'api',
            narration: 'The load balancer forwards the like to an API server.',
          },
          {
            from: 'api',
            to: 'manhattan',
            narration:
              'The API records that you liked this post, so the heart stays pink on all your devices and the like count is correct for everyone.',
          },
          {
            from: 'api',
            to: 'kafka',
            narration: 'It also publishes a "like" event onto the stream of user actions.',
          },
          {
            from: 'kafka',
            to: 'candidates',
            narration:
              'Recommendation systems read that event to update what they know about your interests, so future For You timelines can show more of what you enjoy.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'web/src/features/timeline/HomeTimeline.jsx', note: 'The For You and Following tabs on x.com' },
    { path: 'web/src/features/timeline/PostCard.jsx', note: 'One post: avatar, name, text, and reply/repost/like buttons' },
    { path: 'web/src/features/compose/ComposeBox.jsx', note: 'The "What\'s happening?" box with its character counter' },
    { path: 'web/src/features/compose/weightedLength.js', note: 'Counts characters the X way (links count as 23, emoji as 2)' },
    { path: 'ios/Timeline/PostActionsView.swift', note: 'Reply, repost and like buttons on iPhone' },
    { path: 'android/timeline/TimelineViewModel.kt', note: 'Loads timeline pages on Android and keeps them on rotate' },
    { path: 'idl/post.thrift', note: 'Thrift definitions of a post and the Tweet service calls' },
    { path: 'api/src/main/scala/graphql/HomeTimelineQuery.scala', note: 'API endpoint that asks Home Mixer for your timeline' },
    { path: 'tweet-service/src/main/scala/PostWriteHandler.scala', note: 'Validates a new post, stores it and publishes an event' },
    { path: 'snowflake/src/main/scala/IdWorker.scala', note: 'Generates unique, time-ordered 64-bit IDs' },
    { path: 'fanout/src/main/java/FanoutWorker.java', note: "Copies new post IDs into followers' cached timelines" },
    { path: 'home-mixer/src/main/scala/ForYouPipeline.scala', note: 'Steps of the For You timeline: candidates, scoring, filters, mixing' },
    { path: 'candidates/simclusters/InterestedIn.scala', note: 'Works out which communities each user cares about' },
    { path: 'ranking/heavy_ranker/score.py', note: 'Combines predicted likes, reposts and replies into one score' },
    { path: 'search/earlybird/PostIndexer.java', note: 'Adds each new post to the real-time search index' },
    { path: 'config/kafka/topics.yaml', note: 'Event streams such as new posts and user actions' },
    { path: 'config/manhattan/datasets.yaml', note: 'Which data lives in Manhattan and how many copies to keep' },
    { path: 'deploy/home-mixer.aurora', note: 'How many copies of Home Mixer to run and with how much memory' },
  ],

  code: [
    {
      id: 'scala-snowflake',
      title: 'Snowflake: unique IDs without a central counter',
      file: 'snowflake/src/main/scala/IdWorker.scala',
      language: 'Scala',
      explanation:
        "A simplified take on Twitter's open-source Snowflake design. Each 64-bit ID packs in the time in milliseconds, a datacenter number, a worker number and a small counter. Because every machine has its own worker number, thousands of servers can make IDs at the same time without ever colliding, and because time sits in the highest bits, bigger IDs mean newer posts (give or take small clock differences between machines).",
      code: `// Simplified Snowflake ID generator, inspired by Twitter's open-source design (2010).
// 64-bit layout: [1 unused][41 bits: time][5: datacenter][5: worker][12: sequence]
class IdWorker(datacenterId: Long, workerId: Long) {
  private val twepoch = 1288834974657L              // "time zero": Nov 4, 2010, in milliseconds
  private val maxSequence = (1L << 12) - 1           // 4095, the biggest 12-bit number

  private var lastTimestamp = -1L
  private var sequence = 0L

  def nextId(): Long = synchronized {
    var now = System.currentTimeMillis()
    if (now < lastTimestamp)
      throw new IllegalStateException("Clock moved backwards, refusing to make IDs")

    if (now == lastTimestamp) {
      sequence = (sequence + 1) & maxSequence        // another ID in the same millisecond
      if (sequence == 0) {                           // all 4,096 used up: wait for the next ms
        while (now <= lastTimestamp) now = System.currentTimeMillis()
      }
    } else {
      sequence = 0                                   // new millisecond, restart the counter
    }
    lastTimestamp = now

    ((now - twepoch) << 22) |                        // time in the high bits = IDs sort by time
      (datacenterId << 17) |
      (workerId << 12) |
      sequence
  }
}

// You can read the time back out of any post ID:
//   val createdAtMillis = (postId >> 22) + 1288834974657L`,
    },
    {
      id: 'react-compose-counter',
      title: 'The compose box and its character counter',
      file: 'web/src/features/compose/ComposeBox.jsx',
      language: 'JavaScript (React)',
      explanation:
        "X doesn't simply count letters. Its open-source twitter-text library gives most Latin characters a weight of 1, while emoji and characters like Chinese or Japanese count as 2, and every link counts as 23 because it is shortened with t.co. This simplified React component uses a rough version of that rule to show how many characters you have left and to disable the Post button when you go over.",
      code: `import { useState } from 'react';

const LIMIT = 280;
const LINK_WEIGHT = 23; // links are shortened to t.co, so each one counts as 23

// Rough version of the twitter-text rules: most Latin text counts 1, emoji and CJK count 2
function weightedLength(text) {
  const links = text.match(/https?:\\/\\/\\S+/g) || [];
  const rest = text.replace(/https?:\\/\\/\\S+/g, '');
  let total = links.length * LINK_WEIGHT;
  for (const char of rest) {              // for...of walks whole characters, emoji included
    total += char.codePointAt(0) <= 0x10ff ? 1 : 2;
  }
  return total;
}

export default function ComposeBox({ onPost }) {
  const [text, setText] = useState('');
  const remaining = LIMIT - weightedLength(text);
  const canPost = text.trim() !== '' && remaining >= 0;

  function handleSubmit(event) {
    event.preventDefault();
    if (!canPost) return;
    onPost(text.trim());                   // the parent adds it to the top of the timeline
    setText('');
  }

  return (
    <form className="compose" onSubmit={handleSubmit}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="What's happening?" />
      {remaining <= 20 && <span className={remaining < 0 ? 'count over' : 'count'}>{remaining}</span>}
      <button type="submit" disabled={!canPost}>Post</button>
    </form>
  );
}`,
    },
    {
      id: 'java-fanout',
      title: 'Fan-out on write with Redis lists',
      file: 'fanout/src/main/java/FanoutWorker.java',
      language: 'Java',
      explanation:
        "Twitter engineers have described in public talks how home timelines were kept as lists of post IDs in Redis and filled in when a post is written. This simplified worker shows the idea: for every follower, push the new ID onto the front of their list and trim the list so it never grows forever. The celebrity shortcut is a widely taught variation: accounts with millions of followers are skipped here and merged in when a timeline is read.",
      code: `import java.util.List;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;

// Simplified fan-out-on-write worker: copy each new post ID into every
// follower's cached timeline, so reading a timeline is one quick list read.
public class FanoutWorker {
    private static final int TIMELINE_SIZE = 800;           // keep only the newest entries
    private static final long CELEBRITY_FOLLOWERS = 1_000_000;

    private final Jedis redis;
    private final FollowGraph graph;                         // answers "who follows this account?"

    public FanoutWorker(Jedis redis, FollowGraph graph) {
        this.redis = redis;
        this.graph = graph;
    }

    // Called for every "new post" event read from Kafka
    public void onNewPost(long authorId, long postId) {
        if (graph.followerCount(authorId) > CELEBRITY_FOLLOWERS) {
            return;  // huge accounts: their posts are merged in at read time instead
        }
        List<Long> followers = graph.followersOf(authorId);
        Pipeline batch = redis.pipelined();                  // many commands, one round trip
        for (long followerId : followers) {
            String key = "timeline:" + followerId;
            batch.lpush(key, Long.toString(postId));         // newest post goes to the front
            batch.ltrim(key, 0, TIMELINE_SIZE - 1);          // drop the oldest if too long
        }
        batch.sync();
    }
}`,
    },
    {
      id: 'python-for-you-ranking',
      title: 'Scoring and filtering the For You timeline',
      file: 'ranking/heavy_ranker/score.py',
      language: 'Python',
      explanation:
        "The code X published in 2023 describes a heavy ranker that predicts several kinds of engagement for each candidate post and combines them with weights, where a reply counts far more than a like and negative feedback pulls the score down. This toy version uses made-up weights, sorts the candidates by score, then applies two simple filters: never show blocked accounts, and don't let one author fill the timeline.",
      code: `from dataclasses import dataclass

# Made-up weights for teaching: each predicted action is worth a different amount
WEIGHTS = {
    "like": 0.5,
    "repost": 1.0,
    "reply": 13.0,
    "author_replies_back": 70.0,   # a real conversation is worth a lot
    "negative_feedback": -70.0,    # "show less often", mute or block
}

@dataclass
class Candidate:
    post_id: int
    author_id: int
    predictions: dict[str, float]  # e.g. {"like": 0.12, "reply": 0.01}, from the ranker model

def score(candidate: Candidate) -> float:
    return sum(WEIGHTS[action] * chance for action, chance in candidate.predictions.items())

def build_for_you(candidates: list[Candidate], blocked: set[int], size: int = 50) -> list[int]:
    timeline: list[int] = []
    posts_per_author: dict[int, int] = {}
    for c in sorted(candidates, key=score, reverse=True):   # best score first
        if c.author_id in blocked:
            continue                                         # filter: never show blocked accounts
        if posts_per_author.get(c.author_id, 0) >= 2:
            continue                                         # variety: max 2 posts per author here
        posts_per_author[c.author_id] = posts_per_author.get(c.author_id, 0) + 1
        timeline.append(c.post_id)
        if len(timeline) == size:
            break
    return timeline`,
    },
    {
      id: 'swift-optimistic-like',
      title: 'Instant likes that undo themselves on failure (iPhone)',
      file: 'ios/Timeline/PostActionsView.swift',
      language: 'Swift',
      explanation:
        "Tapping like on X feels instant because apps use 'optimistic UI': change the screen first, then tell the server. This simplified SwiftUI view shows the part that is easy to forget: if the network request fails, it puts the heart and the count back the way they were, so the screen never lies for long.",
      code: `import SwiftUI

struct PostActionsView: View {
    let postId: Int64
    let api: PostAPI                      // wraps the HTTPS calls to X
    @State var likeCount: Int
    @State var isLiked: Bool

    var body: some View {
        HStack(spacing: 40) {
            Label("Reply", systemImage: "bubble.left")
            Label("Repost", systemImage: "arrow.2.squarepath")
            Button(action: toggleLike) {
                Label("\\(likeCount)", systemImage: isLiked ? "heart.fill" : "heart")
            }
            .foregroundStyle(isLiked ? Color.pink : Color.secondary)
        }
    }

    private func toggleLike() {
        let wasLiked = isLiked
        isLiked.toggle()                  // 1. update the screen right away
        likeCount += isLiked ? 1 : -1

        Task {
            do {
                try await api.setLiked(postId: postId, liked: !wasLiked)  // 2. tell the server
            } catch {
                isLiked = wasLiked        // 3. it failed, so undo the change
                likeCount += wasLiked ? 1 : -1
            }
        }
    }
}`,
    },
  ],

  playground: {
    title: 'Mini X home timeline',
    description:
      'A tiny clone of the X home screen: For You and Following tabs, a compose box with a live character ring, and post cards whose reply, repost and like buttons all work.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mini X timeline</title>
<style>
:root {
  --accent: #1D9BF0; /* @tweak color "Accent color" */
  --like: #F91880; /* @tweak color "Like color" */
  --bg: #FFFFFF; /* @tweak color "Background" */
  --text: #0F1419; /* @tweak color "Text color" */
  --avatar: 40px; /* @tweak range 28 56 "Avatar size" */
  --radius: 20px; /* @tweak range 0 24 "Button roundness" */
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text);
  font: 15px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
button { background: none; border: 0; padding: 0; color: inherit; font: inherit; cursor: pointer; }
.line { border-bottom: 1px solid rgba(128, 128, 128, 0.25); }

/* Sticky header with the two timeline tabs */
header { position: sticky; top: 0; z-index: 1; background: var(--bg); }
.title { margin: 0; padding: 10px 0 2px; text-align: center; font-size: 20px; font-weight: 800; }
.tabs { display: flex; }
.tab { flex: 1; padding: 12px 0; font-weight: 600; opacity: 0.55; }
.tab.active { opacity: 1; box-shadow: inset 0 -4px 0 var(--accent); }

/* Shared layout for the compose box and every post */
.row { display: flex; gap: 10px; padding: 12px; }
.avatar { flex: none; width: var(--avatar); height: var(--avatar); border-radius: 50%;
  display: grid; place-items: center; font-size: calc(var(--avatar) * 0.5);
  background: linear-gradient(135deg, var(--accent), var(--like)); }
.main { flex: 1; min-width: 0; }

/* Compose box with a ring that fills up as you type */
textarea { width: 100%; min-height: 60px; border: 0; outline: none; resize: none;
  background: transparent; color: var(--text); font-family: inherit; font-size: 18px; }
.bar { display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
.ring { --pct: 0; --ring: var(--accent); width: 24px; height: 24px; border-radius: 50%;
  background: conic-gradient(var(--ring) calc(var(--pct) * 1%), rgba(128, 128, 128, 0.25) 0);
  -webkit-mask: radial-gradient(circle, transparent 8px, #000 9px);
  mask: radial-gradient(circle, transparent 8px, #000 9px); }
.ring.warn { --ring: #FFD400; }
.ring.over { --ring: #F4212E; }
.left { font-size: 13px; opacity: 0.7; min-width: 28px; text-align: right; }
.post-btn { background: var(--accent); color: #fff; font-weight: 700; padding: 8px 18px; border-radius: var(--radius); }
.post-btn:disabled { opacity: 0.5; cursor: default; }

/* Post cards */
.meta { display: flex; gap: 4px; white-space: nowrap; }
.handle { opacity: 0.6; overflow: hidden; text-overflow: ellipsis; }
.text { margin: 2px 0 8px; white-space: pre-wrap; overflow-wrap: anywhere; }
.actions { display: flex; justify-content: space-between; max-width: 290px; }
.act { display: flex; align-items: center; gap: 4px; padding: 4px 8px; font-size: 13px;
  opacity: 0.7; border-radius: var(--radius); }
.act:hover { background: rgba(128, 128, 128, 0.15); }
.act svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2;
  stroke-linecap: round; stroke-linejoin: round; }
.reply:hover { color: var(--accent); }
.repost.on { color: #00BA7C; opacity: 1; }
.like.on { color: var(--like); opacity: 1; }
.like.on svg { fill: currentColor; animation: pop 0.3s; }
@keyframes pop { 50% { transform: scale(1.3); } }
</style>
</head>
<body>
  <header class="line">
    <h1 class="title" data-edit="title">Home</h1>
    <nav class="tabs">
      <button class="tab active" data-edit="tab-for-you">For you</button>
      <button class="tab" data-edit="tab-following">Following</button>
    </nav>
  </header>

  <!-- Compose box -->
  <section class="row line">
    <div class="avatar">🙂</div>
    <div class="main">
      <textarea id="box" placeholder="What's happening?"></textarea>
      <div class="bar">
        <span class="left" id="left">280</span>
        <span class="ring" id="ring"></span>
        <button class="post-btn" id="post" disabled>Post</button>
      </div>
    </div>
  </section>

  <main id="feed">
    <article class="tweet row line" data-handle="@ada">
      <div class="avatar">🐤</div>
      <div class="main">
        <div class="meta"><b data-edit="name">Ada Lovelace</b><span class="handle">@ada · 2h</span></div>
        <p class="text" data-edit="post-text">Just shipped my first API endpoint. It returns JSON and I feel unstoppable.</p>
        <div class="actions">
          <button class="act reply"><svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></svg><span>4</span></button>
          <button class="act repost"><svg viewBox="0 0 24 24"><path d="M4 11V8h14l-3-3M20 13v3H6l3 3"/></svg><span>12</span></button>
          <button class="act like"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg><span>87</span></button>
        </div>
      </div>
    </article>
  </main>

  <!-- Blueprint for posts you write: copied by the script below -->
  <template id="tweet-template">
    <article class="tweet row line" data-handle="@you">
      <div class="avatar">🙂</div>
      <div class="main">
        <div class="meta"><b>You</b><span class="handle">@you · now</span></div>
        <p class="text"></p>
        <div class="actions">
          <button class="act reply"><svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></svg><span>0</span></button>
          <button class="act repost"><svg viewBox="0 0 24 24"><path d="M4 11V8h14l-3-3M20 13v3H6l3 3"/></svg><span>0</span></button>
          <button class="act like"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg><span>0</span></button>
        </div>
      </div>
    </article>
  </template>

<script>
  const LIMIT = 280; // X's limit for most accounts (it was 140 until 2017)
  const box = document.getElementById('box');
  const ring = document.getElementById('ring');
  const left = document.getElementById('left');
  const postBtn = document.getElementById('post');
  const feed = document.getElementById('feed');
  const template = document.getElementById('tweet-template');

  // Update the ring, the number and the Post button every time you type
  function updateCounter() {
    const remaining = LIMIT - box.value.length;
    ring.style.setProperty('--pct', Math.min(box.value.length / LIMIT * 100, 100));
    ring.classList.toggle('warn', remaining <= 20);
    ring.classList.toggle('over', remaining < 0);
    left.textContent = remaining;
    postBtn.disabled = box.value.trim() === '' || remaining < 0;
  }
  box.addEventListener('input', updateCounter);

  // Post: copy the template, fill in your text, put it at the top of the feed
  postBtn.addEventListener('click', () => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.querySelector('.text').textContent = box.value.trim();
    feed.prepend(card);
    box.value = '';
    updateCounter();
  });

  // One listener handles the buttons on every post, even brand-new ones
  feed.addEventListener('click', (event) => {
    const btn = event.target.closest('.act');
    if (!btn) return;
    if (btn.classList.contains('reply')) {
      box.value = btn.closest('.tweet').dataset.handle + ' ';
      box.focus();
      updateCounter();
      return;
    }
    // Like and repost switch on or off, and the number follows
    const on = btn.classList.toggle('on');
    const count = btn.querySelector('span');
    count.textContent = Number(count.textContent) + (on ? 1 : -1);
  });

  // Tabs: highlight the one you tapped
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelector('.tab.active').classList.remove('active');
      tab.classList.add('active');
    });
  });
</script>
</body>
</html>`,
    challenges: [
      'Find const LIMIT = 280 in the script and change it to 140 to go back to the original 2006 to 2017 rule, then watch the ring fill up twice as fast.',
      'Make a dark mode like X\'s "Lights out" theme by setting --bg to #000000 and --text to #E7E9EA.',
      'Change --like to #00BA7C and --accent to #7856FF, then post something and like it to see every button restyle.',
      'Edit the name and post text, tap Reply to see the handle drop into the compose box, and drag Button roundness to 0px for square buttons.',
    ],
  },

  concepts: [
    {
      term: 'Fan-out on write',
      meaning:
        "Copying a new post into every follower's timeline at the moment it is posted, so reading a timeline later is quick. The trade-off is lots of work for accounts with millions of followers.",
    },
    {
      term: 'Snowflake ID',
      meaning:
        'A 64-bit ID made from the time, a machine number and a counter, so many servers can create unique IDs without asking each other, and IDs sort from oldest to newest.',
    },
    {
      term: 'RPC (remote procedure call)',
      meaning:
        'Calling a function that actually runs on another server, as if it were in your own program. Finagle is the library Twitter built to make these calls reliable.',
    },
    {
      term: 'Monolith vs. microservices',
      meaning:
        'A monolith is one big app that does everything, like early Twitter on Rails. Microservices split the work into many small services that can be scaled and fixed separately.',
    },
    {
      term: 'Event stream',
      meaning:
        'An ordered log of things that happened, like "new post" or "new like", that many services read at their own pace. Kafka is a popular tool for this.',
    },
    {
      term: 'Candidate generation and ranking',
      meaning:
        'A two-step way to recommend things: first quickly gather a big pool of possibly interesting posts (about 1,500 for X\'s For You timeline), then use a slower, smarter model to put them in the best order.',
    },
    {
      term: 'Inverted index',
      meaning:
        'The data structure behind search: for every word, a list of the posts that contain it, like the index at the back of a textbook.',
    },
    {
      term: 'Optimistic UI',
      meaning:
        'Updating the screen right away, like filling in the heart, before the server confirms it, and quietly undoing the change if the request fails.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Sketch your data',
      detail:
        "Plan four tables: users, posts, follows and likes. Create them in SQLite or a free Supabase (PostgreSQL) database and write the query 'newest posts from people I follow' using a JOIN on follows.",
    },
    {
      step: 'Build a tiny API',
      detail:
        'Use Express (JavaScript) or Django (Python) to make POST /posts (reject anything over 280 characters), GET /timeline and POST /posts/:id/like.',
    },
    {
      step: 'Make time-sortable IDs',
      detail:
        'Write a mini Snowflake generator (time shifted left, plus a counter), then use the last ID on the page as a cursor: GET /timeline?before=ID loads the next page.',
    },
    {
      step: 'Build the home timeline',
      detail:
        'Create an Expo (React Native) app with a compose box and character counter above a FlatList of post cards, with likes that update instantly and roll back on errors.',
    },
    {
      step: 'Try fan-out with Redis',
      detail:
        "When someone posts, LPUSH the post ID onto each follower's Redis list and LTRIM it to a few hundred items, so reading a timeline is a single LRANGE.",
    },
    {
      step: 'Add a simple For You tab and ship it',
      detail:
        'Score posts with something like (likes + 2 x reposts + 5 x replies) divided by the post\'s age in hours plus 2, show the top ones, and deploy on Render or Railway.',
    },
  ],

  sources: [
    { label: 'Wikipedia: X (social network)', url: 'https://en.wikipedia.org/wiki/X_(social_network)' },
    { label: 'X Engineering blog', url: 'https://blog.x.com/engineering/en_us' },
    { label: 'The For You algorithm source code (GitHub)', url: 'https://github.com/twitter/the-algorithm' },
    { label: 'Finagle by Twitter (GitHub)', url: 'https://github.com/twitter/finagle' },
    { label: 'Snowflake ID generator (GitHub archive)', url: 'https://github.com/twitter-archive/snowflake' },
  ],
};
