import type { Teardown } from '../types';

export const instagram: Teardown = {
  id: 'instagram',
  name: 'Instagram',
  url: 'instagram.com',
  tagline: 'Share photos, videos, Stories and Reels with the people you follow.',
  category: 'Social Media',
  brandColor: '#E1306C',
  accentColor: '#F77737',
  logoGlyph: '📸',
  source: 'curated',

  eli5:
    "Instagram is like a giant shared photo album. When you post, your phone uploads the picture to Instagram's servers, which save it, make smaller copies, and remember that your followers should see it. When a friend opens the app, the servers pick and rank recent posts for them, and the photos load quickly from a server close to where they live.",

  facts: [
    { label: 'Launched', value: 'October 2010' },
    { label: 'Founders', value: 'Kevin Systrom & Mike Krieger' },
    { label: 'Parent company', value: 'Meta Platforms (bought by Facebook in 2012)' },
    { label: 'Headquarters', value: 'Menlo Park, California' },
    { label: 'Users', value: '3 billion+ monthly active users (2025)' },
    { label: 'First platform', value: 'iPhone only (Android came in 2012)' },
    { label: 'Known for (tech)', value: 'One of the largest Django (Python) deployments in the world' },
  ],

  history: [
    {
      year: '2010',
      title: 'Launch on iPhone',
      detail:
        'Kevin Systrom and Mike Krieger turned their check-in app Burbn into a simple photo app with filters. Instagram launched on iOS in October 2010 and passed 1 million users in about two months.',
    },
    {
      year: '2012',
      title: 'Android app and the Facebook deal',
      detail:
        'Instagram arrived on Android in April 2012. That same month Facebook agreed to buy the company for about $1 billion, when it had only 13 employees.',
    },
    {
      year: '2013',
      title: 'Video and Instagram Direct',
      detail:
        'Short video posts were added in the summer, and in December Instagram Direct let you send photos and messages privately instead of to all your followers.',
    },
    {
      year: '2014',
      title: "Moving into Facebook's data centers",
      detail:
        "Engineers moved Instagram's servers from Amazon Web Services into Facebook's own data centers, a huge migration done while the app stayed online.",
    },
    {
      year: '2016',
      title: 'Stories and a ranked feed',
      detail:
        'Stories, posts that disappear after 24 hours, launched in August. The same year the feed stopped being strictly newest-first and started being ordered by ranking algorithms.',
    },
    {
      year: '2017',
      title: 'The big move to Python 3',
      detail:
        'At PyCon 2017, Instagram engineers explained how they moved their giant Django codebase from Python 2 to Python 3 while still shipping new features.',
    },
    {
      year: '2018',
      title: 'IGTV and 1 billion users',
      detail:
        'Instagram announced 1 billion monthly users and launched IGTV for longer vertical videos. Later that year both co-founders left the company.',
    },
    {
      year: '2020',
      title: 'Reels',
      detail:
        'Reels, short vertical videos set to music, launched in August 2020 and became one of the most-used parts of the app.',
    },
    {
      year: '2021',
      title: 'Cinder goes open source',
      detail:
        'Instagram published Cinder, its speed-focused version of CPython (the standard Python interpreter), to share how it makes Python run faster at huge scale.',
    },
    {
      year: '2023',
      title: 'Threads',
      detail:
        'The Instagram team launched Threads, a text-based conversation app that you can sign up for using your Instagram account.',
    },
  ],

  languages: [
    { name: 'Python', usedFor: 'The Django backend, background jobs and internal tools', share: 35 },
    { name: 'JavaScript', usedFor: 'The instagram.com website (React) and some React Native screens', share: 15 },
    { name: 'Objective-C / Swift', usedFor: 'The iPhone app', share: 15 },
    { name: 'Java / Kotlin', usedFor: 'The Android app', share: 15 },
    { name: 'C / C++', usedFor: "Speed-critical code such as Cinder's compiler and media processing", share: 10 },
    { name: 'SQL', usedFor: 'Reading and writing data in PostgreSQL', share: 10 },
  ],

  stack: [
    {
      layer: 'Mobile',
      items: [
        {
          name: 'Objective-C (iOS)',
          role: 'iPhone app language',
          beginnerNote:
            'Instagram began as an iPhone-only app written in Objective-C, the language Apple apps used before Swift existed.',
          confidence: 'confirmed',
        },
        {
          name: 'IGListKit',
          role: 'Fast scrolling lists',
          beginnerNote:
            'An open-source iOS library Instagram built for its feed that only redraws the rows that actually changed, like updating one line of a list instead of rewriting the whole page.',
          confidence: 'confirmed',
        },
        {
          name: 'Java / Kotlin (Android)',
          role: 'Android app languages',
          beginnerNote:
            "These are the standard languages for Android apps, so they're the natural choice for Instagram's Android version.",
          confidence: 'likely',
        },
        {
          name: 'React Native',
          role: 'Shared screens on iOS & Android',
          beginnerNote:
            'Lets a screen be written once in JavaScript and run on both iPhone and Android; Instagram wrote publicly about adopting it in 2017.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Frontend',
      items: [
        {
          name: 'React',
          role: 'Website UI library',
          beginnerNote:
            'Builds web pages out of reusable pieces called components, like LEGO bricks, and instagram.com was one of the first big sites built with it.',
          confidence: 'confirmed',
        },
        {
          name: 'JavaScript',
          role: 'Language of the web app',
          beginnerNote:
            "It's the programming language every web browser understands, so it runs the buttons, feed and likes on instagram.com.",
          confidence: 'confirmed',
        },
        {
          name: 'GraphQL',
          role: 'Asking for exactly the data needed',
          beginnerNote:
            'A way for the app to request exactly the fields it needs from the server, like ordering specific dishes instead of a fixed combo meal.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Django (Python)',
          role: 'Main web framework',
          beginnerNote:
            'A Python toolkit that handles web addresses, logins and database access, and Instagram runs one of the biggest Django setups on Earth.',
          confidence: 'confirmed',
        },
        {
          name: 'uWSGI',
          role: 'Python app server',
          beginnerNote:
            'Runs many copies of the Python app on each machine and hands each incoming request to a free one, like a host seating guests at open tables.',
          confidence: 'confirmed',
        },
        {
          name: 'Cinder',
          role: 'Faster Python',
          beginnerNote:
            "Instagram's own performance-focused version of CPython that runs the same Python code faster, which means fewer servers are needed.",
          confidence: 'confirmed',
        },
        {
          name: 'Celery & RabbitMQ',
          role: 'Background jobs',
          beginnerNote:
            'RabbitMQ keeps a line of jobs and Celery workers take them one by one, so slow work happens after you have already seen your post go up.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'PostgreSQL (sharded)',
          role: 'Main database for users, posts, likes',
          beginnerNote:
            'A classic table-based database, split into thousands of smaller pieces (shards) because no single computer could hold all of Instagram.',
          confidence: 'confirmed',
        },
        {
          name: 'Apache Cassandra',
          role: 'Database for huge write volumes',
          beginnerNote:
            'A database spread over many machines that is great at saving tons of new data quickly, and Instagram even open-sourced changes that made it faster.',
          confidence: 'confirmed',
        },
        {
          name: 'Memcached',
          role: 'In-memory cache',
          beginnerNote:
            "Super-fast short-term memory that keeps popular answers (like a post's like count) ready so the database isn't asked the same thing millions of times.",
          confidence: 'confirmed',
        },
        {
          name: 'Redis',
          role: 'In-memory lists and counters',
          beginnerNote:
            'Keeps lists and counters in memory, and Instagram used it for feeds and sessions in its early years.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Meta data centers',
          role: 'Where the servers live',
          beginnerNote:
            "Since moving off Amazon's cloud, Instagram runs on the same giant server buildings that power Facebook.",
          confidence: 'confirmed',
        },
        {
          name: 'Amazon Web Services',
          role: 'Original cloud host (2010–2014)',
          beginnerNote:
            'In the early days Instagram rented servers from Amazon instead of buying its own, which let a tiny team grow very fast.',
          confidence: 'confirmed',
        },
        {
          name: 'Content delivery network',
          role: 'Delivers photos and videos',
          beginnerNote:
            'Copies of images are kept on servers all over the world, so your photo loads from a nearby city instead of from across an ocean.',
          confidence: 'likely',
        },
        {
          name: 'Load balancers',
          role: 'Spread traffic across servers',
          beginnerNote:
            'Like a traffic officer, they send each incoming request to a server that is not too busy.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Ranking models',
          role: 'Order Feed, Stories, Reels & Explore',
          beginnerNote:
            'Machine-learning models guess how likely you are to like or watch each post, and the ones with the highest scores show up first.',
          confidence: 'confirmed',
        },
        {
          name: 'Account embeddings (ig2vec)',
          role: 'Find similar accounts for Explore',
          beginnerNote:
            'Each account is turned into a list of numbers so that similar accounts end up close together, like songs that belong on the same playlist.',
          confidence: 'confirmed',
        },
        {
          name: 'PyTorch',
          role: 'Machine-learning framework',
          beginnerNote:
            "Meta's open-source toolkit for training AI models, and the natural choice for building Instagram's recommendation models.",
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        {
          name: 'Continuous deployment',
          role: 'Ship code many times a day',
          beginnerNote:
            'Every small code change is automatically tested and rolled out, instead of saving everything up for one big scary release.',
          confidence: 'confirmed',
        },
        {
          name: 'MonkeyType & LibCST',
          role: 'Tools for a huge Python codebase',
          beginnerNote:
            'Open-source tools from Instagram that add type hints automatically and safely rewrite code across millions of lines.',
          confidence: 'confirmed',
        },
        {
          name: 'Pyre',
          role: 'Python type checker',
          beginnerNote:
            "Meta's type checker catches mistakes like passing text where a number was expected before the code ever runs.",
          confidence: 'likely',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      // Tier 0: clients
      {
        id: 'ios-app',
        label: 'iPhone app',
        kind: 'client',
        tier: 0,
        tech: 'Objective-C & Swift (UIKit, IGListKit)',
        description:
          'The Instagram app on iPhones. It shows your feed, runs the camera, and talks to Instagram over the internet.',
      },
      {
        id: 'android-app',
        label: 'Android app',
        kind: 'client',
        tier: 0,
        tech: 'Java & Kotlin',
        description: 'The same Instagram experience built for Android phones, using the same backend servers.',
      },
      {
        id: 'web-app',
        label: 'instagram.com',
        kind: 'client',
        tier: 0,
        tech: 'React (JavaScript)',
        description:
          'The website version of Instagram, built from React components that run inside your browser.',
      },
      // Tier 1: edge
      {
        id: 'cdn',
        label: 'CDN',
        kind: 'edge',
        tier: 1,
        tech: "Meta's content delivery network",
        description:
          'Servers spread around the world that keep copies of photos and videos, so they download from somewhere close to you.',
      },
      {
        id: 'load-balancer',
        label: 'Load balancer',
        kind: 'edge',
        tier: 1,
        tech: 'Software load balancers',
        description:
          'The front door for app requests. It spreads millions of requests across many web servers so none of them gets overloaded.',
      },
      // Tier 2: API / gateway
      {
        id: 'api',
        label: 'Django web servers',
        kind: 'gateway',
        tier: 2,
        tech: 'Django (Python) on uWSGI + Cinder',
        description:
          "Instagram's main Python app, running on a huge number of servers. Every request, like posting, liking or loading the feed, is handled here first.",
      },
      {
        id: 'push',
        label: 'Push services',
        kind: 'external',
        tier: 2,
        tech: 'Apple APNs & Google Firebase Cloud Messaging',
        description:
          "Apple and Google run the systems that deliver notifications to phones. Instagram hands them a message like 'someone liked your photo' and they deliver it.",
      },
      // Tier 3: services & workers
      {
        id: 'feed-service',
        label: 'Feed service',
        kind: 'service',
        tier: 3,
        tech: 'Internal feed services',
        description:
          "Collects candidate posts from the accounts you follow and asks the ranking models which ones you'll most want to see.",
      },
      {
        id: 'ranking',
        label: 'Ranking models',
        kind: 'ml',
        tier: 3,
        tech: 'Machine-learning models (PyTorch)',
        description:
          'Predicts how likely you are to like, comment on or linger on each post, so the most interesting ones appear at the top.',
      },
      {
        id: 'task-queue',
        label: 'Task queue',
        kind: 'queue',
        tier: 3,
        tech: 'Celery + RabbitMQ',
        description:
          "A to-do list for slow jobs. Web servers drop jobs here and reply to you right away instead of making you wait.",
      },
      {
        id: 'workers',
        label: 'Background workers',
        kind: 'service',
        tier: 3,
        tech: 'Celery workers (Python)',
        description:
          'Separate servers that pick jobs off the queue, such as resizing photos, spreading new posts to followers, and sending notifications.',
      },
      // Tier 4: data & storage
      {
        id: 'postgres',
        label: 'PostgreSQL shards',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL (sharded)',
        description:
          'Stores core data like users, posts and likes in tables. There is far too much for one machine, so the data is split across many database servers called shards.',
      },
      {
        id: 'cassandra',
        label: 'Cassandra',
        kind: 'database',
        tier: 4,
        tech: 'Apache Cassandra',
        description:
          'A database spread across many machines that is built to save huge amounts of new data quickly, a good fit for fast-growing lists like feeds and activity.',
      },
      {
        id: 'memcached',
        label: 'Memcached',
        kind: 'cache',
        tier: 4,
        tech: 'Memcached',
        description:
          "Very fast temporary memory. Popular answers, like a post's like count, are kept here so the databases aren't asked the same question over and over.",
      },
      {
        id: 'media-storage',
        label: 'Photo & video storage',
        kind: 'storage',
        tier: 4,
        tech: 'Blob storage in Meta data centers (originally Amazon S3)',
        description:
          'Where the actual image and video files live. The databases only store a key pointing to each file, while this system holds the heavy bytes.',
      },
    ],
    edges: [
      { from: 'ios-app', to: 'load-balancer', label: 'HTTPS' },
      { from: 'android-app', to: 'load-balancer', label: 'HTTPS' },
      { from: 'web-app', to: 'load-balancer', label: 'HTTPS / GraphQL' },
      { from: 'ios-app', to: 'cdn', label: 'HTTPS (images)' },
      { from: 'android-app', to: 'cdn', label: 'HTTPS (images)' },
      { from: 'web-app', to: 'cdn', label: 'HTTPS (images)' },
      { from: 'cdn', to: 'media-storage', label: 'fetch on cache miss' },
      { from: 'load-balancer', to: 'api', label: 'HTTP' },
      { from: 'api', to: 'memcached', label: 'get / set' },
      { from: 'api', to: 'postgres', label: 'SQL' },
      { from: 'api', to: 'media-storage', label: 'store original' },
      { from: 'api', to: 'feed-service', label: 'RPC' },
      { from: 'api', to: 'task-queue', label: 'enqueue job' },
      { from: 'feed-service', to: 'cassandra', label: 'CQL' },
      { from: 'feed-service', to: 'ranking', label: 'RPC (score posts)' },
      { from: 'task-queue', to: 'workers', label: 'AMQP' },
      { from: 'workers', to: 'media-storage', label: 'save resized copies' },
      { from: 'workers', to: 'cassandra', label: 'CQL (fan-out)' },
      { from: 'workers', to: 'push', label: 'HTTPS' },
      { from: 'push', to: 'ios-app', label: 'push notification' },
      { from: 'push', to: 'android-app', label: 'push notification' },
    ],
    flows: [
      {
        id: 'post-photo',
        title: 'You post a photo',
        emoji: '📸',
        steps: [
          {
            from: 'ios-app',
            to: 'load-balancer',
            narration:
              'You tap Share. Your phone shrinks the photo a bit and sends it, with your caption, over a secure HTTPS connection.',
          },
          {
            from: 'load-balancer',
            to: 'api',
            narration: 'The load balancer picks a Django web server that is not too busy and passes the upload along.',
          },
          {
            from: 'api',
            to: 'media-storage',
            narration:
              'The server saves the original image file in blob storage, a giant warehouse built just for files.',
          },
          {
            from: 'api',
            to: 'postgres',
            narration:
              'It adds a row for your post (who posted, the caption, where the file lives) to the PostgreSQL shard that holds your data.',
          },
          {
            from: 'api',
            to: 'task-queue',
            narration:
              "Instead of making you wait for the slow parts, it drops a 'process this post' job on the queue and tells your phone it worked.",
          },
          {
            from: 'task-queue',
            to: 'workers',
            narration:
              'A background worker picks up the job and makes smaller copies of your photo for different screen sizes.',
          },
          {
            from: 'workers',
            to: 'cassandra',
            narration:
              "Finally the worker records your new post in your followers' feed data, so it's ready when they open the app.",
          },
        ],
      },
      {
        id: 'open-feed',
        title: 'You open your feed',
        emoji: '🏠',
        steps: [
          {
            from: 'android-app',
            to: 'load-balancer',
            narration: 'You open the app, and it asks Instagram for the first page of your feed over HTTPS.',
          },
          {
            from: 'load-balancer',
            to: 'api',
            narration: 'The request is routed to one of the Django web servers.',
          },
          {
            from: 'api',
            to: 'feed-service',
            narration: 'Django asks the feed service to put together a list of posts for you.',
          },
          {
            from: 'feed-service',
            to: 'cassandra',
            narration: 'The feed service reads recent posts from the accounts you follow out of Cassandra.',
          },
          {
            from: 'feed-service',
            to: 'ranking',
            narration:
              "Machine-learning models give each post a score for how much you'll probably enjoy it, and the list is sorted by that score.",
          },
          {
            from: 'api',
            to: 'memcached',
            narration:
              'Django fills in details like usernames and like counts, grabbing most of them from the fast Memcached cache instead of the database.',
          },
          {
            from: 'android-app',
            to: 'cdn',
            narration:
              'Your phone gets the list back and downloads the actual photos from a nearby CDN server, so they appear quickly.',
          },
        ],
      },
      {
        id: 'like-post',
        title: 'You like a post',
        emoji: '❤️',
        steps: [
          {
            from: 'ios-app',
            to: 'load-balancer',
            narration:
              'You double-tap. The heart turns red instantly on your screen, and a tiny like request is sent in the background.',
          },
          {
            from: 'load-balancer',
            to: 'api',
            narration: 'The load balancer forwards the like to a Django web server.',
          },
          {
            from: 'api',
            to: 'postgres',
            narration:
              'The server saves who liked which post in the right PostgreSQL shard. Liking the same post twice is blocked by the database.',
          },
          {
            from: 'api',
            to: 'memcached',
            narration:
              "It bumps the cached like count by one, so everyone sees the new number without recounting every like.",
          },
          {
            from: 'api',
            to: 'task-queue',
            narration: "It adds a 'notify the author' job to the queue, then replies to your phone right away.",
          },
          {
            from: 'task-queue',
            to: 'workers',
            narration: 'A background worker picks up the job a moment later.',
          },
          {
            from: 'workers',
            to: 'push',
            narration:
              "The worker asks Apple's or Google's push service to deliver 'someone liked your photo' to the author's phone.",
          },
        ],
      },
    ],
  },

  files: [
    { path: 'ios/Feed/FeedViewController.swift', note: 'The scrolling home feed screen on iPhone' },
    { path: 'ios/Feed/PostCell.swift', note: 'One post card: header, photo, heart button and like count' },
    { path: 'ios/Camera/CaptureViewController.swift', note: 'Camera screen for taking photos and videos' },
    { path: 'ios/Networking/APIClient.swift', note: 'Sends HTTPS requests to the Instagram API' },
    { path: 'android/feed/FeedFragment.kt', note: 'The Android home feed screen' },
    { path: 'android/feed/FeedViewModel.kt', note: 'Loads feed pages and keeps them when the screen rotates' },
    { path: 'web/src/pages/Feed.jsx', note: 'Home page on instagram.com that lists post cards' },
    { path: 'web/src/components/PostCard.jsx', note: 'React component for a single post on the website' },
    { path: 'server/settings.py', note: 'Django settings: database shards, cache servers, installed apps' },
    { path: 'server/feed/views.py', note: 'API endpoint that returns your ranked feed' },
    { path: 'server/likes/views.py', note: 'API endpoint that saves a like' },
    { path: 'server/likes/tasks.py', note: 'Celery job that notifies the author of a liked post' },
    { path: 'server/media/tasks.py', note: 'Celery jobs that resize photos and convert videos' },
    { path: 'server/sharding/router.py', note: 'Works out which PostgreSQL shard holds a given ID' },
    { path: 'db/schema/posts.sql', note: 'Tables for posts and likes, plus the ID generator' },
    { path: 'db/cassandra/feed.cql', note: 'Cassandra tables for feed and activity lists' },
    { path: 'ml/feed_ranker/model.py', note: "Model that predicts which posts you'll enjoy most" },
    { path: 'deploy/uwsgi.ini', note: 'How many Python worker processes each web server runs' },
  ],

  code: [
    {
      id: 'ios-double-tap-like',
      title: 'Double-tap to like (iPhone)',
      file: 'ios/Feed/PostCell.swift',
      language: 'Swift',
      explanation:
        "This UIKit cell listens for two quick taps on the photo or a tap on the heart. It uses 'optimistic UI': the heart and like count change on screen immediately, and only then is the server told, so the app feels instant even on a slow connection.",
      code: `import UIKit

final class PostCell: UICollectionViewCell {
    private let photoView = UIImageView()  // (layout code left out to keep it short)
    private let heartButton = UIButton(type: .system)
    private let likesLabel = UILabel()
    private var likeCount = 0
    private var isLiked = false
    var onLikeChanged: ((Bool) -> Void)?  // the feed screen sends this to the API

    override init(frame: CGRect) {
        super.init(frame: frame)
        photoView.isUserInteractionEnabled = true
        let doubleTap = UITapGestureRecognizer(target: self, action: #selector(photoDoubleTapped))
        doubleTap.numberOfTapsRequired = 2
        photoView.addGestureRecognizer(doubleTap)
        heartButton.addTarget(self, action: #selector(heartTapped), for: .touchUpInside)
    }
    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    func configure(likeCount: Int, isLiked: Bool) {
        (self.likeCount, self.isLiked) = (likeCount, isLiked)
        render()
    }

    @objc private func photoDoubleTapped() { if !isLiked { toggleLike() } }  // double-tap only likes
    @objc private func heartTapped() { toggleLike() }
    private func toggleLike() {
        isLiked.toggle()           // 1. change the data right away
        likeCount += isLiked ? 1 : -1
        render()                   // 2. redraw, so it feels instant
        onLikeChanged?(isLiked)    // 3. then tell the server in the background
    }

    private func render() {
        heartButton.setImage(UIImage(systemName: isLiked ? "heart.fill" : "heart"), for: .normal)
        heartButton.tintColor = isLiked ? .systemPink : .label
        likesLabel.text = "\\(likeCount) likes"
    }
}`,
    },
    {
      id: 'django-like-view',
      title: 'Saving a like: shard, cache, queue',
      file: 'server/likes/views.py',
      language: 'Python',
      explanation:
        'This simplified Django view shows three big ideas in one place. It finds the right database shard from the post ID itself, keeps the like count in Memcached so nobody has to count rows on every view, and hands the slow push notification to a Celery background worker.',
      code: `from django.core.cache import cache
from django.db import IntegrityError, transaction
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from likes.models import Like
from likes.tasks import notify_author


def shard_for_id(object_id):
    # IDs have the shard number packed inside them (see posts.sql)
    shard_number = (object_id >> 10) & 0x1FFF  # grab the 13 "shard" bits
    return f"shard_{shard_number}"


@require_POST
def like_post(request, post_id):
    shard = shard_for_id(post_id)

    try:
        with transaction.atomic(using=shard):
            Like.objects.using(shard).create(post_id=post_id, user_id=request.user.id)
    except IntegrityError:
        # Already liked: the database refuses duplicates, so there's nothing to do
        return JsonResponse({"liked": True})

    # Cache-aside counter: bump the number in Memcached instead of counting rows
    key = f"like_count:{post_id}"
    try:
        cache.incr(key)
    except ValueError:  # not cached yet (or it expired), so count once and remember it
        count = Like.objects.using(shard).filter(post_id=post_id).count()
        cache.set(key, count, timeout=60 * 60)

    # Push notifications are slow, so a background worker sends them later
    notify_author.delay(post_id=post_id, liker_id=request.user.id)
    return JsonResponse({"liked": True})`,
    },
    {
      id: 'postgres-sharded-ids',
      title: 'Unique IDs across thousands of shards',
      file: 'db/schema/posts.sql',
      language: 'SQL',
      explanation:
        "Inspired by Instagram's well-known 'Sharding & IDs' engineering post, each database shard generates its own 64-bit IDs that pack in the time, the shard number and a counter. That way two shards can never create the same ID, IDs sort roughly by time, and any server can tell which shard a post lives on just by reading its ID.",
      code: `-- Each shard is its own PostgreSQL schema, e.g. shard_1234.
-- A 64-bit ID is packed like this:
--   41 bits: milliseconds since our own epoch (enough for about 69 years)
--   13 bits: shard number (up to 8,192 shards)
--   10 bits: per-shard counter (up to 1,024 IDs per millisecond)
CREATE SCHEMA shard_1234;
CREATE SEQUENCE shard_1234.id_seq;

CREATE FUNCTION shard_1234.next_id() RETURNS bigint AS $$
DECLARE
    our_epoch bigint := 1293840000000;  -- 2011-01-01 00:00 UTC, in ms
    shard_id  bigint := 1234;
    seq_id    bigint := nextval('shard_1234.id_seq') % 1024;
    now_ms    bigint := floor(extract(epoch FROM clock_timestamp()) * 1000);
BEGIN
    RETURN ((now_ms - our_epoch) << 23) | (shard_id << 10) | seq_id;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE shard_1234.posts (
    id         bigint PRIMARY KEY DEFAULT shard_1234.next_id(),
    user_id    bigint NOT NULL,
    media_key  text   NOT NULL,  -- where the photo file lives in blob storage
    caption    text,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON shard_1234.posts (user_id, created_at DESC);  -- "my newest posts"

CREATE TABLE shard_1234.likes (
    post_id    bigint NOT NULL REFERENCES shard_1234.posts (id),
    user_id    bigint NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (post_id, user_id)  -- you can only like a post once
);`,
    },
    {
      id: 'android-feed-paging',
      title: 'Loading the feed page by page (Android)',
      file: 'android/feed/FeedViewModel.kt',
      language: 'Kotlin',
      explanation:
        "Nobody downloads their whole feed at once. This ViewModel asks the API for one page at a time using a 'cursor' (a bookmark the server hands back), adds each new page to the end of the list, and stops when the server says there is nothing more.",
      code: `import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import java.io.IOException
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class Post(val id: Long, val username: String, val imageUrl: String, val likeCount: Int)
data class FeedPage(val posts: List<Post>, val nextCursor: String?)

interface FeedApi {
    // GET /api/v1/feed?cursor=abc123  ->  { "posts": [...], "nextCursor": "def456" }
    suspend fun getFeed(cursor: String?): FeedPage
}

class FeedViewModel(private val api: FeedApi) : ViewModel() {
    private val _posts = MutableStateFlow<List<Post>>(emptyList())
    val posts: StateFlow<List<Post>> = _posts  // the screen redraws whenever this changes
    private var nextCursor: String? = null
    private var isLoading = false
    private var reachedEnd = false

    // Called when the feed opens, and again whenever you scroll near the bottom
    fun loadNextPage() {
        if (isLoading || reachedEnd) return
        isLoading = true
        viewModelScope.launch {
            try {
                val page = api.getFeed(nextCursor)
                _posts.value = _posts.value + page.posts  // add to the end, don't replace
                nextCursor = page.nextCursor
                reachedEnd = page.nextCursor == null
            } catch (e: IOException) {
                // No connection: keep the posts we already have so the screen isn't blank
            } finally {
                isLoading = false
            }
        }
    }
}`,
    },
    {
      id: 'react-post-card',
      title: 'A post card on instagram.com',
      file: 'web/src/components/PostCard.jsx',
      language: 'JavaScript (React)',
      explanation:
        "instagram.com is built with React, where each piece of the page is a component. This card uses srcSet so the browser downloads only the image size it needs (the smaller copies made by background workers), loading='lazy' so photos far down the page wait until you scroll, and a bit of state for the 'more' button on long captions.",
      code: `import { useState } from 'react';

// One post on the website. The photo already exists in several sizes,
// so the browser can pick the smallest one that still looks sharp.
export default function PostCard({ post }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = post.caption.length > 90;
  const caption = expanded || !isLong ? post.caption : post.caption.slice(0, 90) + '…';

  return (
    <article className="post">
      <header className="post-header">
        <img className="avatar" src={post.author.avatarUrl} alt="" width={32} height={32} />
        <strong>{post.author.username}</strong>
      </header>

      <img
        className="post-photo"
        src={post.images.medium}
        srcSet={\`\${post.images.small} 320w, \${post.images.medium} 640w, \${post.images.large} 1080w\`}
        sizes="(max-width: 600px) 100vw, 600px"
        loading="lazy"
        alt={post.altText || \`Photo by \${post.author.username}\`}
      />

      <p className="caption">
        <strong>{post.author.username}</strong> {caption}
        {isLong && !expanded && (
          <button className="more" onClick={() => setExpanded(true)}>
            more
          </button>
        )}
      </p>
    </article>
  );
}`,
    },
  ],

  playground: {
    title: 'Mini Instagram post',
    description:
      'A tiny clone of the Instagram home screen: a post with a gradient avatar ring, a photo you can double-tap to like, a like counter, caption and a bottom tab bar.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mini Instagram</title>
<style>
:root {
  --brand: #E1306C; /* @tweak color "Brand color" */
  --accent: #F77737; /* @tweak color "Photo gradient" */
  --bg: #FFFFFF; /* @tweak color "Background" */
  --text: #262626; /* @tweak color "Text color" */
  --radius: 0px; /* @tweak range 0 32 "Photo corners" */
  --avatar: 36px; /* @tweak range 24 56 "Avatar size" */
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); padding-bottom: 60px; /* room for the tab bar */
  font: 14px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
button { background: none; border: 0; padding: 0; color: inherit; font: inherit; cursor: pointer; }

/* Top bar */
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; }
.logo { margin: 0; font: 600 26px "Snell Roundhand", "Brush Script MT", cursive; }
.topbar span { font-size: 22px; }

/* Post header: avatar with a gradient "story ring" */
.post-header { display: flex; align-items: center; gap: 10px; padding: 8px 12px; }
.avatar {
  width: var(--avatar); height: var(--avatar); border-radius: 50%; border: 2px solid transparent;
  background: linear-gradient(var(--bg), var(--bg)) padding-box,
              linear-gradient(45deg, var(--accent), var(--brand)) border-box;
  display: grid; place-items: center; font-size: calc(var(--avatar) * 0.5);
}
.who { flex: 1; }
.username { font-weight: 600; }
.location { font-size: 12px; opacity: 0.7; }

/* The "photo" is just a CSS gradient with an emoji on top */
.photo {
  display: grid; place-items: center; aspect-ratio: 1 / 1; overflow: hidden;
  border-radius: var(--radius);
  background: linear-gradient(160deg, var(--accent), #833AB4);
  user-select: none; -webkit-user-select: none; touch-action: manipulation;
}
.photo > * { grid-area: 1 / 1; }
.scene { font-size: 110px; }
.burst { width: 100px; height: 100px; fill: #fff; opacity: 0; pointer-events: none; }
.burst.show { animation: burst 0.8s ease-out; }
@keyframes burst {
  0% { opacity: 0; transform: scale(0.2); }
  20% { opacity: 0.95; transform: scale(1.2); }
  35%, 70% { opacity: 0.95; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.9); }
}

/* Buttons and text under the photo */
.actions { display: flex; align-items: center; gap: 14px; padding: 8px 12px 4px; font-size: 22px; }
.actions .save { margin-left: auto; }
.like svg { display: block; width: 26px; height: 26px; fill: none; stroke: var(--text); stroke-width: 2; }
.like.liked svg { fill: var(--brand); stroke: var(--brand); animation: bump 0.3s; }
@keyframes bump { 50% { transform: scale(1.25); } }
.likes, .caption, .time { margin: 0; padding: 2px 12px; }
.likes { font-weight: 600; }
.time { font-size: 11px; text-transform: uppercase; opacity: 0.6; }

/* Bottom tab bar */
.tabbar {
  position: fixed; left: 0; right: 0; bottom: 0;
  display: flex; height: 54px;
  background: var(--bg);
  border-top: 1px solid rgba(128, 128, 128, 0.25);
}
.tab { flex: 1; font-size: 22px; opacity: 0.45; position: relative; }
.tab.active { opacity: 1; }
.tab.active::after {
  content: ""; position: absolute; bottom: 5px; left: 50%;
  width: 6px; height: 6px; margin-left: -3px; border-radius: 50%;
  background: var(--brand);
}
</style>
</head>
<body>
  <header class="topbar">
    <h1 class="logo" data-edit="app-name">Instagram</h1>
    <span>💬</span>
  </header>

  <article class="post">
    <div class="post-header">
      <div class="avatar">🦊</div>
      <div class="who">
        <div class="username" data-edit="username">sunset.chaser</div>
        <div class="location" data-edit="location">Golden Gate Park</div>
      </div>
      <button aria-label="More options">⋯</button>
    </div>

    <!-- Double-tap the photo to like it -->
    <div class="photo" id="photo">
      <span class="scene">🌅</span>
      <svg class="burst" id="burst" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
    </div>

    <div class="actions">
      <button class="like" id="like" aria-label="Like">
        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      </button>
      <button aria-label="Comment">💬</button>
      <button aria-label="Share">📤</button>
      <button class="save" aria-label="Save">🔖</button>
    </div>
    <p class="likes"><span id="likes">1,204</span> likes</p>
    <p class="caption"><b>sunset.chaser</b> <span data-edit="caption">Golden hour never misses 🌅</span></p>
    <p class="time" data-edit="time">2 hours ago</p>
  </article>

  <nav class="tabbar">
    <button class="tab active" aria-label="Home">🏠</button>
    <button class="tab" aria-label="Search">🔍</button>
    <button class="tab" aria-label="New post">➕</button>
    <button class="tab" aria-label="Reels">🎬</button>
    <button class="tab" aria-label="Profile">👤</button>
  </nav>

<script>
  // State: is the post liked, and how many likes does it have?
  let liked = false;
  let likes = 1204;
  let lastTap = 0;

  const likeBtn = document.getElementById('like');
  const likesEl = document.getElementById('likes');
  const photo = document.getElementById('photo');
  const burst = document.getElementById('burst');

  // Draw the screen from the state
  function render() {
    likeBtn.classList.toggle('liked', liked);
    likesEl.textContent = likes.toLocaleString();
  }

  function setLiked(value) {
    if (value === liked) return;
    liked = value;
    likes += liked ? 1 : -1;
    render();
  }

  // Tap the heart: like or unlike
  likeBtn.addEventListener('click', () => setLiked(!liked));

  // Two taps less than 300ms apart = double-tap, which only ever likes
  photo.addEventListener('click', () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      setLiked(true);
      burst.classList.remove('show');
      void burst.offsetWidth; // restart the CSS animation
      burst.classList.add('show');
      lastTap = 0;
    } else {
      lastTap = now;
    }
  });

  // Bottom tabs: highlight the one you tapped
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
      'Change --brand to #1DB954, then tap the heart: the like button, the avatar ring and the active tab dot all turn green.',
      'Make a dark mode by setting --bg to #000000 and --text to #FFFFFF.',
      'Drag the Photo corners slider to 24px and the Avatar size slider to 52px to restyle the post like a card.',
      'Edit the username and caption, then find 300 in the script and change it to 600 so slower double-taps still count as a like.',
    ],
  },

  concepts: [
    {
      term: 'Sharding',
      meaning:
        'Splitting one enormous database into many smaller databases (shards), each holding a slice of the data, so no single computer has to store or serve everything.',
    },
    {
      term: 'CDN (content delivery network)',
      meaning:
        'A worldwide network of servers that keep copies of photos and videos so your device downloads them from somewhere nearby and they load fast.',
    },
    {
      term: 'Caching',
      meaning:
        'Keeping the answer to a common question, like a like count, in fast memory so it does not have to be recalculated from the database every time.',
    },
    {
      term: 'Task queue',
      meaning:
        'A waiting line of background jobs, like resizing a photo or sending a notification, that worker programs handle later so the app can reply to you right away.',
    },
    {
      term: 'Fan-out',
      meaning:
        "Spreading a new post out to each follower's feed data when it is created, so their feeds are ready before they even open the app.",
    },
    {
      term: 'Feed ranking',
      meaning:
        'Using machine-learning models to score posts by how interesting they probably are to you, then showing the highest scores first instead of the newest first.',
    },
    {
      term: 'Load balancer',
      meaning:
        'A traffic officer for web requests that spreads them across many identical servers so none of them gets overwhelmed.',
    },
    {
      term: 'Optimistic UI',
      meaning:
        'Updating the screen immediately, like turning the heart red, before the server confirms it, and quietly undoing the change if the request fails.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Sketch your data',
      detail:
        "Plan four tables: users, posts, likes and follows. Create them in SQLite or a free Supabase (PostgreSQL) database and practice a query like 'newest posts from people I follow'.",
    },
    {
      step: 'Build a tiny API',
      detail:
        'Use Django with Django REST Framework (or Express if you prefer JavaScript) to make endpoints like POST /posts, GET /feed and POST /posts/:id/like.',
    },
    {
      step: 'Store the photos as files',
      detail:
        'Do not put images inside the database. Upload them to a file service like Cloudinary or Supabase Storage, and save only the returned URL in your posts table.',
    },
    {
      step: 'Make the feed screen',
      detail:
        'Create an Expo (React Native) app with a FlatList of post cards showing an avatar, username, photo, heart button and caption.',
    },
    {
      step: 'Add likes that feel instant',
      detail:
        'Treat two taps within about 300 ms as a double-tap, turn the heart red right away, then send the like request and undo the change if it fails.',
    },
    {
      step: 'Speed it up and ship it',
      detail:
        'Cache like counts in Redis, move thumbnail-making into a background job, and deploy your API on a beginner-friendly host like Render or Railway.',
    },
  ],

  sources: [
    { label: 'Wikipedia: Instagram', url: 'https://en.wikipedia.org/wiki/Instagram' },
    { label: 'Instagram Engineering blog', url: 'https://instagram-engineering.com' },
    { label: 'Engineering at Meta blog', url: 'https://engineering.fb.com' },
    { label: "Cinder, Instagram's CPython fork (GitHub)", url: 'https://github.com/facebookincubator/cinder' },
    { label: 'IGListKit by Instagram (GitHub)', url: 'https://github.com/Instagram/IGListKit' },
  ],
};
