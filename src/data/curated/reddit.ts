import type { Teardown } from '../types';

export const reddit: Teardown = {
  id: 'reddit',
  name: 'Reddit',
  url: 'reddit.com',
  tagline: 'Thousands of topic-based communities where people post, vote and discuss.',
  category: 'Social News & Forums',
  brandColor: '#FF4500',
  accentColor: '#0079D3',
  logoGlyph: '👽',
  source: 'curated',

  eli5:
    "Reddit is a huge collection of discussion boards called subreddits, each about one topic, like r/learnprogramming or r/aww. When you post or tap an up or down arrow, your app sends that to Reddit's servers, which save it and update a score that mixes how many votes a post has with how new it is. When you open a subreddit, the servers hand back a list of posts that was already sorted ahead of time, so the page loads fast even while millions of people are voting.",

  facts: [
    { label: 'Launched', value: 'June 2005' },
    { label: 'Founders', value: 'Steve Huffman & Alexis Ohanian (Aaron Swartz joined in late 2005)' },
    { label: 'Headquarters', value: 'San Francisco, California' },
    { label: 'CEO', value: 'Steve Huffman (co-founder, back as CEO since 2015)' },
    { label: 'Stock', value: 'Public on the New York Stock Exchange as RDDT since March 2024' },
    { label: 'Users', value: '100 million+ daily active users (2025)' },
    { label: 'Known for (tech)', value: 'Its Python code, including the "hot" ranking formula, was released as open source in 2008' },
  ],

  history: [
    {
      year: '2005',
      title: 'Launch in the first Y Combinator batch',
      detail:
        'University of Virginia roommates Steve Huffman and Alexis Ohanian built Reddit in Y Combinator\'s very first group of startups and launched it in June 2005. The first version was written in Common Lisp.',
    },
    {
      year: '2005',
      title: 'Rewritten in Python',
      detail:
        "Aaron Swartz joined after his startup Infogami merged with Reddit, and by early December the team had rewritten the whole site in Python using web.py, a tiny web framework Swartz had written. A big reason was that Python had many more ready-made libraries than Lisp.",
    },
    {
      year: '2006',
      title: 'Bought by Condé Nast',
      detail:
        'About 16 months after launch, the magazine publisher Condé Nast (owner of Wired and Vogue) bought Reddit. The site kept running as its own small team.',
    },
    {
      year: '2008',
      title: 'Open source code and user-made subreddits',
      detail:
        'Reddit let any user create their own subreddit, which turned it from one news page into thousands of communities. The same year it published the code that ran the site as open source, a Python app nicknamed r2 built on the Pylons framework.',
    },
    {
      year: '2009',
      title: 'Moving into the cloud',
      detail:
        "Reddit moved its servers into Amazon Web Services, renting computers on demand instead of running its own machines. That let a very small engineering team keep up with fast growth.",
    },
    {
      year: '2016',
      title: 'Official apps and image hosting',
      detail:
        'After buying the popular iPhone app Alien Blue in 2014, Reddit released its own official iOS and Android apps. It also started hosting uploaded images itself on i.redd.it instead of relying on outside sites.',
    },
    {
      year: '2017',
      title: 'r/place and the end of open source',
      detail:
        "On April Fools' Day, r/place gave everyone a shared 1,000 × 1,000 pixel canvas where each person could place one pixel every few minutes. Later that year Reddit stopped updating the public copy of its source code, and the repository was archived.",
    },
    {
      year: '2018',
      title: 'The redesign',
      detail:
        'Reddit rolled out a big redesign of its desktop website, built with React. People who preferred the classic look could keep using old.reddit.com.',
    },
    {
      year: '2023',
      title: 'API changes and the blackout',
      detail:
        'Reddit started charging for heavy use of its API, the doorway other programs use to read Reddit data. Thousands of subreddits went dark in protest, and popular third-party apps such as Apollo shut down.',
    },
    {
      year: '2024',
      title: 'Going public',
      detail:
        'In March 2024 Reddit became a public company, listing its shares on the New York Stock Exchange under the ticker RDDT.',
    },
  ],

  languages: [
    { name: 'Python', usedFor: 'The original r2 web app, background workers and many internal services', share: 35 },
    { name: 'Go', usedFor: 'Newer high-traffic backend services that are split out of the old Python app', share: 20 },
    { name: 'TypeScript / JavaScript', usedFor: 'The reddit.com website and its reusable UI components', share: 15 },
    { name: 'Kotlin', usedFor: 'The Android app', share: 10 },
    { name: 'Swift', usedFor: 'The iPhone app', share: 10 },
    { name: 'SQL', usedFor: 'Reading and writing posts, users and votes in PostgreSQL', share: 10 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'React',
          role: 'UI library for the 2018 redesign',
          beginnerNote:
            "Builds a web page out of reusable pieces called components, so one 'post card' can be written once and repeated down the whole feed.",
          confidence: 'confirmed',
        },
        {
          name: 'Web components (Lit)',
          role: 'Lighter, faster web pages',
          beginnerNote:
            'Custom HTML tags, like a made-up <vote-arrows> tag, that browsers understand natively, which Reddit has used while rebuilding its site to load faster.',
          confidence: 'likely',
        },
        {
          name: 'TypeScript',
          role: 'JavaScript with types',
          beginnerNote:
            'JavaScript plus labels saying what kind of data each variable holds, so mistakes like treating a score as text are caught before the code runs.',
          confidence: 'likely',
        },
        {
          name: 'Mako templates',
          role: 'Server-made HTML for old.reddit.com',
          beginnerNote:
            'HTML files with blanks that Python fills in on the server, like a fill-in-the-blanks form, so the classic site arrives as a finished page.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Mobile',
      items: [
        {
          name: 'Swift',
          role: 'iPhone app language',
          beginnerNote: "Apple's modern language for iPhone apps, the standard choice for building Reddit's iOS app.",
          confidence: 'likely',
        },
        {
          name: 'Kotlin',
          role: 'Android app language',
          beginnerNote: "Google's recommended language for Android apps, a friendlier and safer cousin of Java.",
          confidence: 'likely',
        },
        {
          name: 'Jetpack Compose',
          role: 'Android UI toolkit',
          beginnerNote:
            'Lets you describe a screen as functions ("show a title, then the replies") and redraws it automatically when the data changes.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'r2 (Python + Pylons)',
          role: 'The original monolith',
          beginnerNote:
            'One big Python app that did almost everything, from logins to votes to comment pages, and its code was public on GitHub for years.',
          confidence: 'confirmed',
        },
        {
          name: 'Go services',
          role: 'Newer, faster microservices',
          beginnerNote:
            'Busy features are being moved out of the big Python app into smaller programs written in Go, a fast language built for servers that do many things at once.',
          confidence: 'confirmed',
        },
        {
          name: 'Baseplate',
          role: "Reddit's service toolkit",
          beginnerNote:
            'An open-source starter kit (for Python and Go) that gives every service the same logging, metrics and ways to talk to other services, like a standard chassis for many car models.',
          confidence: 'confirmed',
        },
        {
          name: 'GraphQL',
          role: 'One API for the apps',
          beginnerNote:
            'Lets the app ask for exactly the fields it needs, such as title, score and comment count, in one request instead of calling many different addresses.',
          confidence: 'confirmed',
        },
        {
          name: 'AutoModerator',
          role: 'Rule-based moderation bot',
          beginnerNote:
            'Moderators write simple rules in YAML, such as "remove posts with no title text", and the bot checks every new post and comment against them.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'PostgreSQL',
          role: 'Main database',
          beginnerNote:
            'A classic table-based database that stores the core records, like accounts, posts and subreddits, in rows and columns.',
          confidence: 'confirmed',
        },
        {
          name: 'Apache Cassandra',
          role: 'Precomputed listings and heavy writes',
          beginnerNote:
            "A database spread across many machines that is great at saving lots of small updates quickly, which suits ever-changing lists like a subreddit's Hot page.",
          confidence: 'confirmed',
        },
        {
          name: 'Memcached',
          role: 'In-memory cache',
          beginnerNote:
            'Super-fast short-term memory that keeps popular answers, like a post you just loaded, ready so the database is not asked the same thing again and again.',
          confidence: 'confirmed',
        },
        {
          name: 'RabbitMQ',
          role: 'Job queues in the classic code',
          beginnerNote:
            'A waiting line for work: the web app drops a vote or new comment in the line and replies to you right away, and workers process it moments later.',
          confidence: 'confirmed',
        },
        {
          name: 'Apache Kafka',
          role: 'Streams of events',
          beginnerNote:
            'A giant, replayable log of everything happening, like "someone voted" or "a post was created", that many different services can read at their own pace.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Amazon Web Services',
          role: 'Cloud servers',
          beginnerNote:
            'Reddit rents computers, storage and networking from Amazon instead of owning its own data centers, and can add more machines when traffic spikes.',
          confidence: 'confirmed',
        },
        {
          name: 'Kubernetes',
          role: 'Runs containers at scale',
          beginnerNote:
            'A system that decides which machine each service runs on and restarts anything that crashes, like a manager assigning shifts in a huge kitchen.',
          confidence: 'confirmed',
        },
        {
          name: 'Amazon S3',
          role: 'File storage for media',
          beginnerNote:
            'A nearly bottomless online hard drive for files like thumbnails and uploaded images, while the database only stores where each file lives.',
          confidence: 'confirmed',
        },
        {
          name: 'CDN (Fastly)',
          role: 'Delivers pages, images and video',
          beginnerNote:
            'Copies of popular files sit on servers around the world, so an image loads from a nearby city instead of from across an ocean.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        {
          name: 'Public postmortems',
          role: 'Learning from outages',
          beginnerNote:
            'After big outages, such as a 2023 Kubernetes upgrade that took the site down for hours, engineers write up what went wrong and how they will prevent it, without blaming a person.',
          confidence: 'confirmed',
        },
        {
          name: 'Feature flags & experiments',
          role: 'Turn features on gradually',
          beginnerNote:
            'New features hide behind an on/off switch, so they can be shown to 1% of users first and switched off instantly if something breaks.',
          confidence: 'likely',
        },
        {
          name: 'CI/CD pipelines',
          role: 'Automatic testing and deploys',
          beginnerNote:
            'Every code change is built and tested by robots before it goes live, so bugs are caught early instead of by millions of users.',
          confidence: 'likely',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      // Tier 0: clients
      {
        id: 'web-app',
        label: 'reddit.com',
        kind: 'client',
        tier: 0,
        tech: 'TypeScript web app (plus classic old.reddit.com)',
        description:
          'The website in your browser. The modern site is built from reusable UI components, and the classic old.reddit.com pages are still available too.',
      },
      {
        id: 'mobile-app',
        label: 'Reddit apps',
        kind: 'client',
        tier: 0,
        tech: 'Swift (iOS) & Kotlin (Android)',
        description:
          'The official iPhone and Android apps. They show feeds, let you vote and comment, and upload photos and videos.',
      },
      // Tier 1: edge
      {
        id: 'cdn',
        label: 'CDN',
        kind: 'edge',
        tier: 1,
        tech: 'Content delivery network (Fastly)',
        description:
          'Servers spread around the world that keep copies of images, videos and web files, so they download from somewhere close to you.',
      },
      {
        id: 'lb',
        label: 'Load balancers',
        kind: 'edge',
        tier: 1,
        tech: 'Cloud load balancers on AWS',
        description:
          'The front door for requests. They spread millions of requests across many servers so no single one gets overloaded.',
      },
      // Tier 2: API / gateway
      {
        id: 'graphql',
        label: 'GraphQL API',
        kind: 'gateway',
        tier: 2,
        tech: 'GraphQL gateway',
        description:
          'One entrance for the apps and website. It takes a request like "posts for r/aww, sorted by Hot" and collects the answer from many services behind it.',
      },
      {
        id: 'r2',
        label: 'r2 (classic Python app)',
        kind: 'gateway',
        tier: 2,
        tech: 'Python on Pylons (the original monolith)',
        description:
          "Reddit's original all-in-one web app. It still powers classic pages and features that have not yet been moved into newer services.",
      },
      // Tier 3: services & workers
      {
        id: 'post-service',
        label: 'Post & comment services',
        kind: 'service',
        tier: 3,
        tech: 'Go and Python microservices (Baseplate)',
        description:
          'Smaller programs that each own one job, like creating posts or loading comments, so teams can change and scale them separately.',
      },
      {
        id: 'listings',
        label: 'Listings & ranking',
        kind: 'service',
        tier: 3,
        tech: 'Hot / New / Top sorts, plus ML models for the Home feed',
        description:
          'Decides the order of posts. For a subreddit it reads a list that was sorted ahead of time; for your Home feed, machine-learning models also guess what you will enjoy.',
      },
      {
        id: 'queue',
        label: 'Queues',
        kind: 'queue',
        tier: 3,
        tech: 'RabbitMQ (classic r2), Kafka (newer event streams)',
        description:
          'A waiting line for work. The web servers drop jobs here, like "count this vote", and answer you right away instead of making you wait.',
      },
      {
        id: 'workers',
        label: 'Vote & listing workers',
        kind: 'service',
        tier: 3,
        tech: 'Queue consumers (Python / Go)',
        description:
          "Background programs that take jobs off the queue, update vote totals and move posts to their new spots in each subreddit's sorted lists.",
      },
      // Tier 4: data & storage
      {
        id: 'postgres',
        label: 'PostgreSQL',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL',
        description:
          'The main table-based database for accounts, subreddits, posts and their vote totals.',
      },
      {
        id: 'cassandra',
        label: 'Cassandra',
        kind: 'database',
        tier: 4,
        tech: 'Apache Cassandra',
        description:
          "Stores precomputed listings, such as the IDs of r/aww's Hot posts already in order, so a subreddit page never has to sort millions of posts on the spot.",
      },
      {
        id: 'memcached',
        label: 'Memcached',
        kind: 'cache',
        tier: 4,
        tech: 'Memcached',
        description:
          'Very fast temporary memory that holds recently used posts and comments, so most page loads skip the database completely.',
      },
      {
        id: 'media-store',
        label: 'Media storage',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3 (images on i.redd.it, videos on v.redd.it)',
        description:
          'Where the actual image and video files live. Posts only store a link to the file, while this system holds the heavy bytes.',
      },
    ],
    edges: [
      { from: 'web-app', to: 'cdn', label: 'HTTPS (images, JS)' },
      { from: 'mobile-app', to: 'cdn', label: 'HTTPS (images, video)' },
      { from: 'web-app', to: 'lb', label: 'HTTPS' },
      { from: 'mobile-app', to: 'lb', label: 'HTTPS / GraphQL' },
      { from: 'mobile-app', to: 'media-store', label: 'direct upload (signed link)' },
      { from: 'cdn', to: 'media-store', label: 'fetch on cache miss' },
      { from: 'lb', to: 'graphql', label: 'HTTP' },
      { from: 'lb', to: 'r2', label: 'HTTP (classic pages)' },
      { from: 'graphql', to: 'r2', label: 'internal API' },
      { from: 'graphql', to: 'post-service', label: 'RPC' },
      { from: 'graphql', to: 'listings', label: 'RPC' },
      { from: 'r2', to: 'postgres', label: 'SQL' },
      { from: 'r2', to: 'memcached', label: 'get / set' },
      { from: 'r2', to: 'queue', label: 'enqueue job' },
      { from: 'post-service', to: 'postgres', label: 'SQL' },
      { from: 'post-service', to: 'memcached', label: 'get / set' },
      { from: 'post-service', to: 'queue', label: 'publish event' },
      { from: 'queue', to: 'workers', label: 'consume' },
      { from: 'workers', to: 'postgres', label: 'update totals' },
      { from: 'workers', to: 'cassandra', label: 'update listings' },
      { from: 'listings', to: 'cassandra', label: 'read sorted IDs' },
    ],
    flows: [
      {
        id: 'upvote',
        title: 'You upvote a post',
        emoji: '⬆️',
        steps: [
          {
            from: 'web-app',
            to: 'lb',
            narration:
              'You click the up arrow. It turns orange and the score ticks up instantly, while a tiny vote request is sent in the background.',
          },
          {
            from: 'lb',
            to: 'r2',
            narration:
              "The load balancer hands the request to one of the Python servers running r2, Reddit's classic app, which checks that you are logged in.",
          },
          {
            from: 'r2',
            to: 'queue',
            narration:
              'Instead of doing all the math now, r2 drops a "count this vote" job in the queue and tells your browser it worked.',
          },
          {
            from: 'queue',
            to: 'workers',
            narration:
              'A vote worker picks up the job a moment later. Many workers run side by side, so huge bursts of votes do not slow the website down.',
          },
          {
            from: 'workers',
            to: 'postgres',
            narration: "The worker saves your vote and updates the post's up and down totals.",
          },
          {
            from: 'workers',
            to: 'cassandra',
            narration:
              "It recalculates the post's hot score and moves the post to its new spot in the subreddit's pre-sorted Hot and Top lists.",
          },
        ],
      },
      {
        id: 'open-subreddit',
        title: 'You open a subreddit sorted by Hot',
        emoji: '🔥',
        steps: [
          {
            from: 'mobile-app',
            to: 'lb',
            narration: 'You open r/aww. The app sends one GraphQL request asking for the first page of Hot posts.',
          },
          {
            from: 'lb',
            to: 'graphql',
            narration: 'The load balancer forwards it to the GraphQL gateway, which works out which services it needs to ask.',
          },
          {
            from: 'graphql',
            to: 'listings',
            narration: 'First it asks the listings service: "Which posts are on r/aww\'s Hot page, in order?"',
          },
          {
            from: 'listings',
            to: 'cassandra',
            narration:
              'The listings service reads a list of post IDs that workers already sorted, so nothing has to be ranked right now.',
          },
          {
            from: 'graphql',
            to: 'post-service',
            narration: 'Next, the gateway asks the post service for each post\'s title, author, score and comment count.',
          },
          {
            from: 'post-service',
            to: 'memcached',
            narration:
              'Most of those posts are already sitting in Memcached, so the details come back in milliseconds without touching the database.',
          },
          {
            from: 'mobile-app',
            to: 'cdn',
            narration: 'The app draws the cards and downloads the thumbnails and images from a nearby CDN server.',
          },
        ],
      },
      {
        id: 'post-photo',
        title: 'You post a photo',
        emoji: '📷',
        steps: [
          {
            from: 'mobile-app',
            to: 'lb',
            narration: 'You pick a photo and write a title. The app first asks Reddit for a place to upload the image.',
          },
          {
            from: 'lb',
            to: 'graphql',
            narration:
              'The request reaches the GraphQL API, which replies with a short-lived signed link: a one-time permission slip to upload one file.',
          },
          {
            from: 'mobile-app',
            to: 'media-store',
            narration:
              "The app uploads the image bytes straight to cloud storage with that link, so the big file never clogs Reddit's app servers.",
          },
          {
            from: 'graphql',
            to: 'post-service',
            narration:
              'When the upload finishes, the app submits the post, and the gateway passes the title, subreddit and image location to the post service.',
          },
          {
            from: 'post-service',
            to: 'postgres',
            narration:
              'The service saves a new post row. It starts with a score of 1, because your own upvote is added automatically.',
          },
          {
            from: 'post-service',
            to: 'queue',
            narration:
              'It publishes a "new post created" event, so spam checks, AutoModerator and listings can react without slowing down your request.',
          },
          {
            from: 'queue',
            to: 'workers',
            narration: "A worker picks up the event and slots your post into the subreddit's New and Hot lists.",
          },
        ],
      },
    ],
  },

  files: [
    { path: 'r2/r2/controllers/api.py', note: 'Classic Python endpoints for actions like voting and submitting' },
    { path: 'r2/r2/models/link.py', note: 'Data models for posts (called "links" in the classic code) and comments' },
    { path: 'r2/r2/lib/db/_sorts.pyx', note: 'The hot, top and controversial formulas, written in Cython for speed' },
    { path: 'r2/r2/lib/db/queries.py', note: "Keeps precomputed listings like a subreddit's Hot page up to date" },
    { path: 'r2/r2/lib/amqp.py', note: 'Helpers for putting jobs onto RabbitMQ queues' },
    { path: 'r2/r2/templates/link.html', note: 'Template that draws one post on old.reddit.com' },
    { path: 'web/src/pages/SubredditFeed.tsx', note: 'A subreddit page with its banner and Hot / New / Top sort bar' },
    { path: 'web/src/components/VoteArrows.tsx', note: 'Up and down arrows that update the score instantly' },
    { path: 'graphql/schema/post.graphql', note: 'GraphQL types for posts, votes and listings' },
    { path: 'services/votes/consumer.go', note: 'Worker that reads votes from the queue and re-ranks posts' },
    { path: 'services/ranking/hot.go', note: 'The hot formula as a small Go package other services can share' },
    { path: 'services/comments/tree.go', note: 'Turns a flat list of comments into a nested reply tree' },
    { path: 'android/comments/CommentThread.kt', note: 'Collapsible nested comments on Android' },
    { path: 'ios/Feed/PostCardView.swift', note: 'One post card in the iPhone feed' },
    { path: 'db/migrations/001_posts_and_votes.sql', note: 'Tables for subreddits, posts and votes' },
    { path: 'k8s/votes-consumer/deployment.yaml', note: 'Tells Kubernetes how many vote workers to run' },
    { path: 'r/learnprogramming/wiki/config/automoderator', note: "One subreddit's AutoModerator rules, a YAML page its moderators edit" },
  ],

  code: [
    {
      id: 'python-hot-ranking',
      title: 'The "hot" ranking formula',
      file: 'r2/r2/lib/db/_sorts.pyx',
      language: 'Python',
      explanation:
        "This simplified version is modelled on the hot formula from Reddit's open-sourced code (the original lived in a Cython file, a Python-like language that compiles to C for speed). A logarithm makes the first 10 points count as much as the next 90, and the post's timestamp gives newer posts a head start: every 12.5 hours of age costs as much as needing 10 times more points.",
      code: `from datetime import datetime, timedelta, timezone
from math import log10

# "Time zero" for scores: a moment in December 2005, as a Unix timestamp
REDDIT_EPOCH = 1134028003


def hot(ups, downs, date):
    score = ups - downs

    # log10: 10 points -> 1, 100 points -> 2, 1,000 points -> 3.
    # Each extra "step" needs 10x more votes, so giant posts can't run away forever.
    order = log10(max(abs(score), 1))

    # Positive posts are pushed up, negative posts are pushed down
    sign = 1 if score > 0 else -1 if score < 0 else 0

    # Newer posts have bigger timestamps, so they start higher.
    # 45,000 seconds = 12.5 hours = the same boost as 10x more votes.
    seconds = date.timestamp() - REDDIT_EPOCH
    return round(sign * order + seconds / 45000, 7)


if __name__ == "__main__":
    now = datetime.now(timezone.utc)
    fresh = hot(ups=110, downs=10, date=now - timedelta(hours=1))   # 100 points, 1 hour old
    older = hot(ups=1000, downs=100, date=now - timedelta(days=1))  # 900 points, 1 day old
    print(fresh > older)  # True: the newer post ranks higher despite fewer points`,
    },
    {
      id: 'go-vote-consumer',
      title: 'A worker that processes votes',
      file: 'services/votes/consumer.go',
      language: 'Go',
      explanation:
        "Votes are not ranked the moment you click. The web server drops each vote in a queue and replies, and a pool of workers like this one does the heavier work: saving the vote, then moving the post inside its subreddit's pre-sorted Hot and Top lists. Here a Go channel stands in for the real queue, and the Store interface hides which databases are used.",
      code: `package votes

import (
	"context"
	"log"
	"time"
	"example.com/teardown/ranking" // the hot formula, ported to Go
)

// VoteEvent is one message taken off the vote queue.
type VoteEvent struct {
	UserID, PostID string
	Dir            int // +1 upvote, -1 downvote, 0 vote removed
}

type Post struct {
	ID, Subreddit string
	Ups, Downs    int
	Created       time.Time
}

// Store hides the databases: PostgreSQL for totals, Cassandra for sorted listings.
type Store interface {
	SaveVote(ctx context.Context, e VoteEvent) (Post, error)
	SetRank(ctx context.Context, subreddit, sort, postID string, rank float64) error
}

// Consume runs forever on a worker machine, handling one vote at a time.
func Consume(ctx context.Context, events <-chan VoteEvent, store Store) {
	for e := range events {
		post, err := store.SaveVote(ctx, e) // records the vote, returns fresh totals
		if err != nil {
			log.Printf("could not save vote on %s: %v", e.PostID, err)
			continue
		}
		// Move the post to its new spot in each pre-sorted list
		store.SetRank(ctx, post.Subreddit, "hot", post.ID, ranking.Hot(post.Ups, post.Downs, post.Created))
		store.SetRank(ctx, post.Subreddit, "top", post.ID, float64(post.Ups-post.Downs))
	}
}`,
    },
    {
      id: 'sql-posts-votes',
      title: 'Posts, votes and one vote per person',
      file: 'db/migrations/001_posts_and_votes.sql',
      language: 'SQL',
      explanation:
        'A simplified PostgreSQL schema for a Reddit-like site. The votes table uses (user_id, post_id) as its primary key, so the database itself guarantees nobody votes twice on the same post, and changing your mind updates the same row. An index on (subreddit_id, created_at) makes the New sort a fast lookup instead of a scan of every post.',
      code: `-- Simplified tables for communities, posts and votes (PostgreSQL)
CREATE TABLE subreddits (
    id         bigserial PRIMARY KEY,
    name       text UNIQUE NOT NULL,          -- e.g. 'learnprogramming'
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE posts (
    id           bigserial PRIMARY KEY,
    subreddit_id bigint  NOT NULL REFERENCES subreddits (id),
    author_id    bigint  NOT NULL,
    title        text    NOT NULL,
    ups          integer NOT NULL DEFAULT 1,  -- your own post starts with your upvote
    downs        integer NOT NULL DEFAULT 0,  -- workers keep these totals up to date
    created_at   timestamptz NOT NULL DEFAULT now()
);
-- "New" sort: newest posts in one subreddit, straight from an index
CREATE INDEX posts_new ON posts (subreddit_id, created_at DESC);

CREATE TABLE votes (
    user_id   bigint   NOT NULL,
    post_id   bigint   NOT NULL REFERENCES posts (id),
    direction smallint NOT NULL CHECK (direction IN (-1, 1)),
    PRIMARY KEY (user_id, post_id)            -- one vote per person per post
);

-- Changed your mind? The same row is updated instead of adding a second vote.
INSERT INTO votes (user_id, post_id, direction)
VALUES (42, 1001, 1)
ON CONFLICT (user_id, post_id) DO UPDATE SET direction = EXCLUDED.direction;

-- The 25 newest posts in r/learnprogramming
SELECT p.id, p.title, p.ups - p.downs AS score, p.created_at
FROM posts p
JOIN subreddits s ON s.id = p.subreddit_id
WHERE s.name = 'learnprogramming'
ORDER BY p.created_at DESC
LIMIT 25;`,
    },
    {
      id: 'react-vote-arrows',
      title: 'Vote arrows that feel instant',
      file: 'web/src/components/VoteArrows.tsx',
      language: 'TypeScript (React)',
      explanation:
        "This React component uses 'optimistic UI': the arrow color and score change the moment you click, and only then is the vote sent to a GraphQL API. If the request fails, the old vote is put back. Tapping the same arrow twice removes your vote, just like on Reddit. The mutation name is made up for this example.",
      code: `import { useState } from 'react';

type Vote = -1 | 0 | 1;

// Sends the vote to a GraphQL endpoint (a made-up mutation, for teaching)
async function sendVote(postId: string, direction: Vote) {
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'mutation SetVote($id: ID!, $dir: Int!) { setVote(postId: $id, direction: $dir) { ok } }',
      variables: { id: postId, dir: direction },
    }),
  });
  if (!res.ok) throw new Error('Vote failed');
}

export function VoteArrows({ postId, baseScore }: { postId: string; baseScore: number }) {
  const [vote, setVote] = useState<Vote>(0);

  async function press(dir: 1 | -1) {
    const previous = vote;
    const next: Vote = vote === dir ? 0 : dir; // same arrow again = undo
    setVote(next); // 1. update the screen right away
    try {
      await sendVote(postId, next); // 2. then tell the server
    } catch {
      setVote(previous); // 3. it failed, so put the old vote back
    }
  }

  const color = vote === 1 ? '#FF4500' : vote === -1 ? '#7193FF' : 'inherit';
  return (
    <div className="vote-arrows">
      <button aria-label="Upvote" aria-pressed={vote === 1} onClick={() => press(1)}>▲</button>
      <span style={{ color }}>{baseScore + vote}</span>
      <button aria-label="Downvote" aria-pressed={vote === -1} onClick={() => press(-1)}>▼</button>
    </div>
  );
}`,
    },
    {
      id: 'kotlin-comment-thread',
      title: 'Nested, collapsible comments (Android)',
      file: 'android/comments/CommentThread.kt',
      language: 'Kotlin',
      explanation:
        "Reddit comments form a tree: every reply points at a parent. This Jetpack Compose function draws one comment, then calls itself for each reply one level deeper, which is recursion. Tapping the header hides the whole branch. Real apps usually flatten the tree into a scrolling list for speed and sort replies with smarter 'Best' math, but the idea is the same.",
      code: `import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

// Comments form a tree: each comment holds its list of replies
data class Comment(
    val author: String,
    val body: String,
    val score: Int,
    val replies: List<Comment> = emptyList(),
)

@Composable
fun CommentThread(comment: Comment, depth: Int = 0) {
    var collapsed by remember { mutableStateOf(false) }
    val marker = if (collapsed) "  [+]" else ""

    // Each level is indented a little more than its parent
    Column(Modifier.padding(start = (12 * depth).dp, top = 6.dp)) {
        Text(
            text = "u/\${comment.author} · \${comment.score} points\$marker",
            modifier = Modifier.clickable { collapsed = !collapsed }, // tap to hide the branch
        )
        if (!collapsed) {
            Text(comment.body)
            // Recursion: every reply is drawn by this same function, one level deeper
            comment.replies.sortedByDescending { it.score }.forEach { reply ->
                CommentThread(reply, depth + 1)
            }
        }
    }
}`,
    },
  ],

  playground: {
    title: 'Mini subreddit feed',
    description:
      'A tiny subreddit page: a banner, Hot and New sort tabs, and post cards with up and down arrows that change the score and its color. Hot uses a simplified version of Reddit\'s classic votes-plus-age formula.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mini Reddit</title>
<style>
:root {
  --upvote: #FF4500; /* @tweak color "Upvote color" */
  --downvote: #7193FF; /* @tweak color "Downvote color" */
  --accent: #0079D3; /* @tweak color "Banner & tabs" */
  --bg: #DAE0E6; /* @tweak color "Page background" */
  --card: #FFFFFF; /* @tweak color "Card color" */
  --text: #1A1A1B; /* @tweak color "Text color" */
  --radius: 8px; /* @tweak range 0 24 "Card corners" */
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text);
  font: 14px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
button { background: none; border: 0; padding: 0; color: inherit; font: inherit; cursor: pointer; }

/* Subreddit banner and header */
.banner { height: 64px; background: linear-gradient(120deg, var(--accent), var(--upvote)); }
.header { background: var(--card); padding: 0 14px 12px; }
.icon { width: 56px; height: 56px; margin-top: -28px; border-radius: 50%; border: 3px solid var(--card);
  background: var(--accent); display: grid; place-items: center; font-size: 28px; }
.header h1 { margin: 4px 0 0; font-size: 20px; }
.about { margin: 2px 0 0; font-size: 13px; opacity: 0.7; }

/* Hot / New tabs */
.sorts { display: flex; gap: 8px; padding: 10px 8px; }
.tab { padding: 6px 14px; border-radius: 999px; font-weight: 700; opacity: 0.6; }
.tab.active { background: var(--card); color: var(--accent); opacity: 1; }

/* Post cards: vote column on the left, content on the right */
.feed { display: flex; flex-direction: column; gap: 10px; padding: 0 8px 16px; }
.post { display: flex; background: var(--card); border-radius: var(--radius); overflow: hidden; }
.votes { display: flex; flex-direction: column; align-items: center; width: 44px; padding: 8px 0;
  background: rgba(128, 128, 128, 0.08); }
.arrow { font-size: 16px; line-height: 1; padding: 3px 8px; opacity: 0.45; transition: transform 0.1s; }
.arrow:active { transform: scale(1.4); }
.score { font-size: 12px; font-weight: 700; margin: 2px 0; }
/* A vote colors the arrow AND the score */
.post.up .up-btn, .post.up .score { color: var(--upvote); opacity: 1; }
.post.down .down-btn, .post.down .score { color: var(--downvote); opacity: 1; }
.body { flex: 1; min-width: 0; padding: 8px 10px; }
.meta { font-size: 12px; opacity: 0.65; }
.title { margin: 4px 0 8px; font-size: 16px; font-weight: 600; }
.footer { display: flex; gap: 14px; font-size: 12px; font-weight: 700; opacity: 0.65; }
</style>
</head>
<body>
  <header>
    <div class="banner"></div>
    <div class="header">
      <div class="icon">💻</div>
      <h1 data-edit="sub-name">r/learnprogramming</h1>
      <p class="about" data-edit="sub-about">A friendly place to ask questions and show what you built</p>
    </div>
  </header>

  <nav class="sorts">
    <button class="tab active" data-sort="hot">🔥 Hot</button>
    <button class="tab" data-sort="new">✨ New</button>
  </nav>

  <!-- data-score = points before your vote, data-age = hours since it was posted -->
  <main class="feed" id="feed">
    <article class="post" data-score="1320" data-age="3">
      <div class="votes"><button class="arrow up-btn" aria-label="Upvote">▲</button><span class="score"></span><button class="arrow down-btn" aria-label="Downvote">▼</button></div>
      <div class="body">
        <div class="meta">r/learnprogramming · u/curious_coder · 3h</div>
        <h2 class="title" data-edit="title-1">Python or JavaScript as a first language?</h2>
        <div class="footer"><span>💬 845 Comments</span><span>↗ Share</span></div>
      </div>
    </article>
    <article class="post" data-score="12" data-age="0.5">
      <div class="votes"><button class="arrow up-btn" aria-label="Upvote">▲</button><span class="score"></span><button class="arrow down-btn" aria-label="Downvote">▼</button></div>
      <div class="body">
        <div class="meta">r/learnprogramming · u/merge_panic · 30m</div>
        <h2 class="title" data-edit="title-2">A merge conflict ate my homework. How do I undo it?</h2>
        <div class="footer"><span>💬 41 Comments</span><span>↗ Share</span></div>
      </div>
    </article>
    <article class="post" data-score="4210" data-age="9">
      <div class="votes"><button class="arrow up-btn" aria-label="Upvote">▲</button><span class="score"></span><button class="arrow down-btn" aria-label="Downvote">▼</button></div>
      <div class="body">
        <div class="meta">r/learnprogramming · u/stack_sketcher · 9h</div>
        <h2 class="title" data-edit="title-3">Recursion finally clicked when I drew the call stack on paper</h2>
        <div class="footer"><span>💬 312 Comments</span><span>↗ Share</span></div>
      </div>
    </article>
    <article class="post" data-score="87" data-age="1">
      <div class="votes"><button class="arrow up-btn" aria-label="Upvote">▲</button><span class="score"></span><button class="arrow down-btn" aria-label="Downvote">▼</button></div>
      <div class="body">
        <div class="meta">r/learnprogramming · u/first_deploy · 1h</div>
        <h2 class="title">My first website is live! It's ugly but it's mine</h2>
        <div class="footer"><span>💬 23 Comments</span><span>↗ Share</span></div>
      </div>
    </article>
    <article class="post" data-score="9800" data-age="22">
      <div class="votes"><button class="arrow up-btn" aria-label="Upvote">▲</button><span class="score"></span><button class="arrow down-btn" aria-label="Downvote">▼</button></div>
      <div class="body">
        <div class="meta">r/learnprogramming · u/big_o_pizza · 22h</div>
        <h2 class="title">Big-O notation explained with pizza delivery</h2>
        <div class="footer"><span>💬 1.1k Comments</span><span>↗ Share</span></div>
      </div>
    </article>
  </main>

<script>
  // Each card keeps its state in data- attributes; data-vote is your vote: -1, 0 or 1
  const feed = document.getElementById('feed');
  const posts = Array.from(document.querySelectorAll('.post'));
  let sort = 'hot';

  function score(post) {
    return Number(post.dataset.score) + Number(post.dataset.vote);
  }

  // 4210 becomes "4,210" (the real site shortens big scores to "4.2k")
  function format(n) {
    return n.toLocaleString('en-US');
  }

  // Reddit's classic "hot" idea: log10 of the score, minus a penalty for age.
  // Every 12.5 hours of age cancels out 10x as many points.
  function hot(post) {
    const s = score(post);
    const order = Math.log10(Math.max(Math.abs(s), 1));
    const sign = s > 0 ? 1 : s < 0 ? -1 : 0;
    return sign * order - Number(post.dataset.age) / 12.5;
  }

  // Draw one card from its state
  function render(post) {
    const vote = Number(post.dataset.vote);
    post.querySelector('.score').textContent = format(score(post));
    post.classList.toggle('up', vote === 1);
    post.classList.toggle('down', vote === -1);
  }

  // Sort the cards, then re-append them in order (appendChild moves an existing card)
  function sortFeed() {
    posts.sort((a, b) => sort === 'hot' ? hot(b) - hot(a) : Number(a.dataset.age) - Number(b.dataset.age));
    posts.forEach((post) => feed.appendChild(post));
  }

  // Tap an arrow to vote; tap the same arrow again to take your vote back
  function vote(post, dir) {
    post.dataset.vote = Number(post.dataset.vote) === dir ? 0 : dir;
    render(post);
  }

  posts.forEach((post) => {
    post.dataset.vote = 0;
    post.querySelector('.up-btn').addEventListener('click', () => vote(post, 1));
    post.querySelector('.down-btn').addEventListener('click', () => vote(post, -1));
    render(post);
  });

  // Hot / New tabs re-rank the feed (votes don't reshuffle it until you tap a tab)
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelector('.tab.active').classList.remove('active');
      tab.classList.add('active');
      sort = tab.dataset.sort;
      sortFeed();
    });
  });

  sortFeed();
</script>
</body>
</html>`,
    challenges: [
      'Tap ▲ on a post: the arrow and score turn orange and the score goes up by 1. Tap ▲ again to undo it, or ▼ to flip it to blue. Then set --upvote to #46D160 and vote again.',
      'Tap New, then Hot. The 9,800-point pizza post sits below the 4,210-point recursion post in Hot because it is 22 hours old. In the script, change 12.5 to 1000: age barely matters now, so the pizza post jumps to the top.',
      'Make a dark mode: set --bg to #030303, --card to #1A1A1B and --text to #D7DADC, then slide Card corners up to 20px.',
      'Edit the subreddit name and a post title, then copy the last <article> block and give the copy data-score="50000" data-age="30". Where does Hot put it?',
    ],
  },

  concepts: [
    {
      term: 'Ranking algorithm',
      meaning:
        "A formula that decides the order of a list. Reddit's classic Hot sort combines a post's points with its age, so good new posts can climb past older popular ones.",
    },
    {
      term: 'Logarithm (log scale)',
      meaning:
        'A way of counting in powers of ten: log10 turns 10 into 1, 100 into 2 and 1,000 into 3, so each extra step needs ten times more votes and early votes matter most.',
    },
    {
      term: 'Precomputed listings',
      meaning:
        'Sorting lists ahead of time, whenever votes change, and saving the result, so opening a subreddit is a quick read instead of sorting millions of posts on the spot.',
    },
    {
      term: 'Message queue',
      meaning:
        'A waiting line of jobs, like "count this vote", that background workers handle a moment later, so the website can answer you immediately.',
    },
    {
      term: 'Caching',
      meaning:
        'Keeping recently used data, like a popular post, in very fast memory so the next person who asks for it gets an answer without a database trip.',
    },
    {
      term: 'Monolith vs. microservices',
      meaning:
        'A monolith is one big app that does everything (like Reddit\'s original r2); microservices split features into small separate programs that teams can update and scale on their own.',
    },
    {
      term: 'GraphQL',
      meaning:
        'An API style where the app sends one query describing exactly which fields it wants, like title and score, and gets back just that data.',
    },
    {
      term: 'Optimistic UI',
      meaning:
        'Changing the screen right away, like coloring the upvote arrow, before the server confirms it, and quietly undoing the change if the request fails.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Sketch your data',
      detail:
        'Plan tables for users, subreddits, posts, comments and votes. Create them in SQLite or a free Supabase (PostgreSQL) database, and make (user_id, post_id) the primary key of votes so nobody can vote twice.',
    },
    {
      step: 'Build a small API',
      detail:
        'Use Express (JavaScript) or FastAPI (Python) to add endpoints like GET /r/:name?sort=hot, POST /posts and POST /posts/:id/vote with a direction of 1, 0 or -1.',
    },
    {
      step: 'Write your own Hot sort',
      detail:
        'Start with ORDER BY created_at DESC for New. For Hot, compute log10 of the score plus the post time divided by 45,000 seconds, and store it in a column you update on every vote.',
    },
    {
      step: 'Make the feed screen',
      detail:
        'Build post cards in React or an Expo (React Native) FlatList with vote arrows, a title, a "r/name · u/user" line and a comment count. Update the score instantly when an arrow is tapped.',
    },
    {
      step: 'Add nested comments',
      detail:
        'Give each comment a parent_id that points at the comment it replies to, then render replies with a recursive component that indents one level per depth.',
    },
    {
      step: 'Speed it up and ship it',
      detail:
        'Cache each subreddit\'s Hot list in Redis, move vote counting into a background job, and deploy your API on a beginner-friendly host like Render or Railway.',
    },
  ],

  sources: [
    { label: 'Wikipedia: Reddit', url: 'https://en.wikipedia.org/wiki/Reddit' },
    { label: 'r/RedditEng, the Reddit engineering blog', url: 'https://www.reddit.com/r/RedditEng/' },
    { label: "Reddit's archived open-source code (GitHub)", url: 'https://github.com/reddit-archive/reddit' },
    { label: 'Reddit, Inc. official site', url: 'https://www.redditinc.com' },
  ],
};
