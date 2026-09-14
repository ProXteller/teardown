import type { Teardown } from '../types';

export const facebook: Teardown = {
  id: 'facebook',
  name: 'Facebook',
  url: 'facebook.com',
  tagline: 'Connect with friends, share posts and photos, and catch up in your News Feed.',
  category: 'Social Media',
  brandColor: '#1877F2',
  accentColor: '#42B72A',
  logoGlyph: 'f',
  source: 'curated',

  eli5:
    "Facebook is like a giant map of who knows whom: every person, post, photo and like is a dot or a line on that map, saved across thousands of databases. When you open your feed, Facebook's servers gather what your friends and the pages you follow have posted recently, score each post by how much you'll probably care about it, and send the best ones to your screen. Photos then load from a server near you, so the whole page appears in a blink.",

  facts: [
    { label: 'Launched', value: 'February 2004 (as "TheFacebook")' },
    {
      label: 'Founders',
      value: 'Mark Zuckerberg, Eduardo Saverin, Andrew McCollum, Dustin Moskovitz & Chris Hughes',
    },
    { label: 'Started at', value: 'Harvard University, for Harvard students only' },
    { label: 'Parent company', value: 'Meta Platforms (renamed from Facebook, Inc. in 2021)' },
    { label: 'Headquarters', value: 'Menlo Park, California' },
    { label: 'Users', value: 'About 3 billion monthly active users (last reported, end of 2023)' },
    { label: 'Known for (tech)', value: 'Created React, GraphQL, the Hack language and PyTorch' },
  ],

  history: [
    {
      year: '2004',
      title: 'TheFacebook launches at Harvard',
      detail:
        'Mark Zuckerberg and his co-founders launched TheFacebook in February 2004 as a simple PHP website with a MySQL database. It started with Harvard students and spread to other universities within months.',
    },
    {
      year: '2006',
      title: 'News Feed, and open to everyone',
      detail:
        "In September 2006 News Feed began showing a constantly updated list of your friends' activity. Later that month Facebook opened to anyone aged 13 or older with a valid email address.",
    },
    {
      year: '2008',
      title: 'Chat and Cassandra',
      detail:
        'Facebook Chat launched, with the servers that deliver messages written in Erlang. The same year engineers open-sourced Cassandra, a database first built for searching your inbox, which later became an Apache project used by companies like Netflix.',
    },
    {
      year: '2009',
      title: 'The Like button',
      detail:
        'The Like button arrived in February 2009, letting you react to a post with one tap instead of writing a comment. A year later it spread to other websites too.',
    },
    {
      year: '2010',
      title: 'HipHop for PHP',
      detail:
        "PHP was easy to write but slow to run, so Facebook built HipHop, a tool that turned its PHP code into C++ and made the servers much faster. It was later replaced by HHVM, a virtual machine that speeds up code while it's running.",
    },
    {
      year: '2012',
      title: 'IPO, native apps and GraphQL',
      detail:
        'Facebook went public in May 2012 and passed 1 billion monthly users that October. It also rebuilt its iPhone app as a fully native app, and engineers created GraphQL internally to feed that app its data.',
    },
    {
      year: '2013',
      title: 'React goes open source',
      detail:
        "React, a UI library first used in Facebook's News Feed, was open-sourced at JSConf US in May 2013. That year Facebook also published research papers on TAO (its social graph store) and on scaling Memcache.",
    },
    {
      year: '2014',
      title: 'The Hack language',
      detail:
        'Facebook released Hack, a language built on PHP that adds types so many mistakes are caught before code runs. By then almost the entire PHP codebase had already been moved to Hack running on HHVM.',
    },
    {
      year: '2015',
      title: 'GraphQL and Relay go public',
      detail:
        'Facebook published the GraphQL specification and open-sourced Relay, its tool for connecting React components to GraphQL data. React Native was also open-sourced that year.',
    },
    {
      year: '2021',
      title: 'The company becomes Meta',
      detail:
        'In October 2021 Facebook, Inc. renamed itself Meta Platforms. The Facebook app kept its name and became one of several apps the company runs, alongside Instagram and WhatsApp.',
    },
  ],

  languages: [
    { name: 'Hack / PHP', usedFor: 'The huge main web codebase and GraphQL API, running on HHVM', share: 30 },
    { name: 'C++', usedFor: 'Speed-critical systems like HHVM, Proxygen and many backend services', share: 25 },
    { name: 'JavaScript (Flow)', usedFor: 'The facebook.com website, built with React and Relay', share: 15 },
    { name: 'Python', usedFor: 'Machine learning with PyTorch, data work and internal tools', share: 10 },
    { name: 'Java / Kotlin', usedFor: 'The Android app', share: 10 },
    { name: 'Objective-C++ / Swift', usedFor: 'The iPhone app', share: 10 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'React',
          role: 'UI component library',
          beginnerNote:
            'Facebook created React to build pages out of reusable pieces called components, and it rebuilt facebook.com with React and Relay in a big 2019–2020 redesign.',
          confidence: 'confirmed',
        },
        {
          name: 'Relay',
          role: 'Loads GraphQL data into React',
          beginnerNote:
            'Each component lists the data it needs, and Relay combines those lists into one request, like a waiter collecting everyone’s order before going to the kitchen.',
          confidence: 'confirmed',
        },
        {
          name: 'StyleX',
          role: 'Styling system',
          beginnerNote:
            "Meta's open-source way of writing CSS inside components that is squeezed into small, shared style files so the site downloads less.",
          confidence: 'confirmed',
        },
        {
          name: 'Flow',
          role: 'Type checker for JavaScript',
          beginnerNote:
            'A Facebook tool that checks your JavaScript for mistakes, like using text where a number was expected, before the code ever runs.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Mobile',
      items: [
        {
          name: 'ComponentKit (iOS)',
          role: 'Fast feed screens on iPhone',
          beginnerNote:
            'An open-source iOS framework Facebook built for News Feed that describes the screen as components, React-style, and does layout work off the main thread so scrolling stays smooth.',
          confidence: 'confirmed',
        },
        {
          name: 'Litho (Android)',
          role: 'Fast feed screens on Android',
          beginnerNote:
            'The Android cousin of ComponentKit: it prepares list items in the background and reuses small pieces, which keeps long feeds from stuttering.',
          confidence: 'confirmed',
        },
        {
          name: 'Kotlin',
          role: 'Modern Android language',
          beginnerNote:
            "Meta has written publicly about moving large parts of its Android code from Java to Kotlin, a shorter and safer language that runs in the same place.",
          confidence: 'confirmed',
        },
        {
          name: 'React Native',
          role: 'Shared screens on iOS & Android',
          beginnerNote:
            'Lets a team write a screen once in JavaScript and ship it on both phones; Facebook used it for features such as Marketplace.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Hack',
          role: 'Main backend language',
          beginnerNote:
            "Facebook's own language based on PHP. It keeps PHP's quick edit-and-refresh feel but adds types that catch bugs early.",
          confidence: 'confirmed',
        },
        {
          name: 'HHVM',
          role: 'Runs the Hack code',
          beginnerNote:
            'A virtual machine that watches which code runs most and turns it into fast machine code on the fly, which saves a huge number of servers.',
          confidence: 'confirmed',
        },
        {
          name: 'GraphQL',
          role: 'API for apps and website',
          beginnerNote:
            'Instead of many fixed web addresses, apps send one query describing exactly the fields they want, like ordering dishes à la carte instead of a set menu.',
          confidence: 'confirmed',
        },
        {
          name: 'Thrift',
          role: 'How services talk to each other',
          beginnerNote:
            'A Facebook-made tool where you describe a service’s functions once, and it generates code so programs in C++, Hack, Python and other languages can call each other.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'TAO',
          role: 'Social graph store',
          beginnerNote:
            'Stores people, posts and the links between them (friend of, likes, commented on) and keeps them cached in memory so reads are lightning fast.',
          confidence: 'confirmed',
        },
        {
          name: 'MySQL with MyRocks',
          role: 'Permanent storage under TAO',
          beginnerNote:
            'A classic table-based database, split into many shards and using the RocksDB engine (also made at Facebook) to take up less disk space.',
          confidence: 'confirmed',
        },
        {
          name: 'Memcache',
          role: 'Huge in-memory cache',
          beginnerNote:
            "Facebook runs one of the biggest memcached setups ever described, keeping popular answers in memory so databases aren't asked the same thing again and again.",
          confidence: 'confirmed',
        },
        {
          name: 'Tectonic (after Haystack & f4)',
          role: 'Photo and video storage',
          beginnerNote:
            'Photos were first kept in custom systems called Haystack and f4, which packed many photos into big files so one could be found with a single disk read. Meta later moved all of this onto Tectonic, one giant shared file system that can span a whole data center.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Katran',
          role: 'Layer 4 load balancer',
          beginnerNote:
            'An open-source load balancer that runs inside the Linux kernel and spreads incoming connections across servers extremely quickly.',
          confidence: 'confirmed',
        },
        {
          name: 'Proxygen',
          role: 'HTTP server and edge proxy',
          beginnerNote:
            "Facebook's open-source C++ web server library. It accepts your secure connection close to where you live and passes requests on to the data center.",
          confidence: 'confirmed',
        },
        {
          name: 'Meta data centers & Open Compute',
          role: 'Where the servers live',
          beginnerNote:
            'Facebook designs its own server hardware and buildings, and in 2011 it shared those designs publicly through the Open Compute Project.',
          confidence: 'confirmed',
        },
        {
          name: 'Edge caches (CDN)',
          role: 'Delivers photos and videos',
          beginnerNote:
            'Copies of popular photos and videos are kept on servers around the world, so they load from somewhere nearby instead of from across an ocean.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'PyTorch',
          role: 'Machine-learning framework',
          beginnerNote:
            'An open-source toolkit for building and training AI models that was created at Facebook AI Research and is now used all over the world.',
          confidence: 'confirmed',
        },
        {
          name: 'Feed ranking models',
          role: 'Order posts in your feed',
          beginnerNote:
            'Models predict how likely you are to like, comment on or share each post, then combine those guesses into one score used to sort your feed.',
          confidence: 'confirmed',
        },
        {
          name: 'DLRM-style recommenders',
          role: 'Recommendation model design',
          beginnerNote:
            'DLRM is a recommendation model design Meta open-sourced in 2019; models like it turn users and posts into lists of numbers to predict what you will enjoy.',
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
            'Instead of one big weekly release, small batches of changes are tested and pushed to facebook.com continuously throughout the day.',
          confidence: 'confirmed',
        },
        {
          name: 'Gatekeeper',
          role: 'Feature flags',
          beginnerNote:
            'An on/off switch for features, so new code can be turned on for employees or 1% of users first and switched off instantly if something breaks.',
          confidence: 'confirmed',
        },
        {
          name: 'Sapling & Buck2',
          role: 'Source control and builds for a monorepo',
          beginnerNote:
            'Most code lives in one giant repository; Sapling handles version history and Buck2 rebuilds only the parts that changed, both open-sourced by Meta.',
          confidence: 'confirmed',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      // Tier 0: clients
      {
        id: 'web-app',
        label: 'facebook.com',
        kind: 'client',
        tier: 0,
        tech: 'React + Relay (JavaScript)',
        description:
          'The website in your browser. React draws the feed from components, and Relay fetches their data with GraphQL.',
      },
      {
        id: 'ios-app',
        label: 'iPhone app',
        kind: 'client',
        tier: 0,
        tech: 'Objective-C++ & Swift (ComponentKit)',
        description: 'The Facebook app on iPhones. It shows your feed, uploads photos and receives notifications.',
      },
      {
        id: 'android-app',
        label: 'Android app',
        kind: 'client',
        tier: 0,
        tech: 'Java & Kotlin (Litho)',
        description: 'The Facebook app for Android phones, talking to exactly the same servers as the website.',
      },
      // Tier 1: edge
      {
        id: 'cdn',
        label: 'CDN',
        kind: 'edge',
        tier: 1,
        tech: 'Meta edge caches',
        description:
          'Servers around the world that keep copies of photos and videos, so they download from somewhere close to you.',
      },
      {
        id: 'katran',
        label: 'L4 load balancer',
        kind: 'edge',
        tier: 1,
        tech: 'Katran (eBPF / XDP)',
        description:
          'The first stop for incoming connections. It runs inside the Linux kernel and very quickly spreads connections across many Proxygen servers.',
      },
      {
        id: 'proxygen',
        label: 'Edge proxy',
        kind: 'edge',
        tier: 1,
        tech: 'Proxygen (C++)',
        description:
          'Understands HTTP itself: it unlocks the encrypted HTTPS connection and forwards each request to a web server that can handle it.',
      },
      // Tier 2: API / gateway
      {
        id: 'www',
        label: 'Web servers (GraphQL)',
        kind: 'gateway',
        tier: 2,
        tech: 'Hack on HHVM',
        description:
          "Facebook's main codebase running on a huge fleet of servers. Every GraphQL query (load my feed) and mutation (like this post) is handled here.",
      },
      {
        id: 'push',
        label: 'Push services',
        kind: 'external',
        tier: 2,
        tech: 'Apple APNs & Google Firebase Cloud Messaging',
        description:
          "Apple and Google run the systems that deliver notifications to phones. Facebook hands them a message and they make the phone buzz.",
      },
      // Tier 3: services & workers
      {
        id: 'feed-service',
        label: 'Feed aggregator',
        kind: 'service',
        tier: 3,
        tech: 'Multifeed (aggregators + leaf servers)',
        description:
          "Keeps an index of everyone's recent activity. When you open your feed, it gathers candidate posts from your friends, groups and pages right then.",
      },
      {
        id: 'ranking',
        label: 'Ranking models',
        kind: 'ml',
        tier: 3,
        tech: 'Machine-learning models (PyTorch)',
        description:
          'Gives each candidate post a score for how much you will probably care about it, so the best ones go to the top.',
      },
      {
        id: 'tao',
        label: 'TAO',
        kind: 'cache',
        tier: 3,
        tech: 'TAO (graph cache over MySQL)',
        description:
          'Stores the social graph as objects (users, posts) and associations (links like "likes"). It answers most reads from memory and writes changes down to MySQL.',
      },
      {
        id: 'async',
        label: 'Background jobs',
        kind: 'queue',
        tier: 3,
        tech: 'Distributed job queue',
        description:
          'A to-do list for work that can happen a moment later, like sending notifications, so the web servers can reply to you right away.',
      },
      // Tier 4: data & storage
      {
        id: 'mysql',
        label: 'MySQL shards',
        kind: 'database',
        tier: 4,
        tech: 'MySQL with MyRocks (RocksDB)',
        description:
          'The permanent home for social graph data. It is split into many shards because no single machine could hold it all.',
      },
      {
        id: 'memcache',
        label: 'Memcache',
        kind: 'cache',
        tier: 4,
        tech: 'memcached (heavily customized)',
        description:
          'A giant pool of fast memory for other frequently read data, so the same database question does not get asked millions of times.',
      },
      {
        id: 'haystack',
        label: 'Photo storage',
        kind: 'storage',
        tier: 4,
        tech: 'Blob storage on Tectonic',
        description:
          'Where the actual photo and video files live, on Tectonic, a file system so big a single cluster can fill a whole data center. It replaced the older Haystack and f4 photo stores.',
      },
    ],
    edges: [
      { from: 'web-app', to: 'katran', label: 'HTTPS / GraphQL' },
      { from: 'ios-app', to: 'katran', label: 'HTTPS / GraphQL' },
      { from: 'android-app', to: 'katran', label: 'HTTPS / GraphQL' },
      { from: 'web-app', to: 'cdn', label: 'HTTPS (photos)' },
      { from: 'ios-app', to: 'cdn', label: 'HTTPS (photos)' },
      { from: 'android-app', to: 'cdn', label: 'HTTPS (photos)' },
      { from: 'cdn', to: 'haystack', label: 'fetch on cache miss' },
      { from: 'katran', to: 'proxygen', label: 'TCP connections' },
      { from: 'proxygen', to: 'www', label: 'HTTP' },
      { from: 'www', to: 'feed-service', label: 'Thrift RPC' },
      { from: 'feed-service', to: 'ranking', label: 'score posts' },
      { from: 'www', to: 'tao', label: 'objects & associations' },
      { from: 'tao', to: 'mysql', label: 'SQL (misses & writes)' },
      { from: 'www', to: 'memcache', label: 'get / set' },
      { from: 'www', to: 'haystack', label: 'upload photo' },
      { from: 'www', to: 'async', label: 'enqueue job' },
      { from: 'async', to: 'push', label: 'HTTPS' },
      { from: 'push', to: 'ios-app', label: 'push notification' },
      { from: 'push', to: 'android-app', label: 'push notification' },
    ],
    flows: [
      {
        id: 'open-feed',
        title: 'You scroll your News Feed',
        emoji: '📰',
        steps: [
          {
            from: 'web-app',
            to: 'katran',
            narration:
              'You open facebook.com. Relay collects the data needs of every component on the page into one GraphQL query and sends it over HTTPS.',
          },
          {
            from: 'katran',
            to: 'proxygen',
            narration: 'Katran, the load balancer, passes your connection to a Proxygen server that is not too busy.',
          },
          {
            from: 'proxygen',
            to: 'www',
            narration: 'Proxygen unlocks the encrypted request and forwards it to a Hack web server running on HHVM.',
          },
          {
            from: 'www',
            to: 'feed-service',
            narration:
              'The web server asks the feed aggregator for stories. It gathers recent posts from your friends, groups and pages right now, when you ask.',
          },
          {
            from: 'feed-service',
            to: 'ranking',
            narration:
              'Ranking models score thousands of candidates by how likely you are to like, comment or share, and only the top few are kept.',
          },
          {
            from: 'www',
            to: 'tao',
            narration:
              'The web server fills in each story: author name, text and like count, mostly read from TAO’s in-memory cache.',
          },
          {
            from: 'web-app',
            to: 'cdn',
            narration:
              'The answer comes back, React draws the post cards, and your browser downloads the photos from a nearby CDN server.',
          },
        ],
      },
      {
        id: 'like-post',
        title: "You like a friend's post",
        emoji: '👍',
        steps: [
          {
            from: 'android-app',
            to: 'katran',
            narration:
              'You tap Like. The thumb turns blue instantly on your screen, and a tiny GraphQL mutation is sent in the background.',
          },
          {
            from: 'katran',
            to: 'proxygen',
            narration: 'The load balancer hands the request to an edge proxy.',
          },
          {
            from: 'proxygen',
            to: 'www',
            narration: 'The proxy forwards it to a Hack web server, which checks that you are allowed to see this post.',
          },
          {
            from: 'www',
            to: 'tao',
            narration:
              'The server asks TAO to add a "likes" link from you to the post. TAO also adds the reverse "liked by" link, so both questions are quick to answer.',
          },
          {
            from: 'tao',
            to: 'mysql',
            narration:
              'TAO writes the links permanently to MySQL, each on the shard of the object it starts from, then refreshes its cached like count.',
          },
          {
            from: 'www',
            to: 'async',
            narration: 'The web server drops a "tell the author" job into the background queue and replies to your phone.',
          },
          {
            from: 'async',
            to: 'push',
            narration:
              "A worker picks up the job and asks Apple's or Google's push service to show the notification on your friend's phone.",
          },
        ],
      },
      {
        id: 'post-photo',
        title: 'You share a photo post',
        emoji: '📷',
        steps: [
          {
            from: 'ios-app',
            to: 'katran',
            narration: 'You tap Post. Your iPhone uploads the photo and your text over HTTPS.',
          },
          {
            from: 'katran',
            to: 'proxygen',
            narration: 'The load balancer picks an edge proxy to receive the upload.',
          },
          {
            from: 'proxygen',
            to: 'www',
            narration: 'The proxy passes the upload to a Hack web server.',
          },
          {
            from: 'www',
            to: 'haystack',
            narration:
              'The photo file is saved in blob storage. Only a small ID pointing to the file is kept with the post itself.',
          },
          {
            from: 'www',
            to: 'tao',
            narration:
              'A new post object is created in TAO and linked to you with an "authored" association, which is saved to MySQL underneath.',
          },
          {
            from: 'www',
            to: 'feed-service',
            narration:
              "The feed system records your new story, so it can be pulled into your friends' feeds the next time they look.",
          },
          {
            from: 'cdn',
            to: 'haystack',
            narration:
              'When the first friend scrolls to your post, a CDN server fetches the photo from storage and keeps a copy nearby for everyone after.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'www/src/ui/feed/NewsFeed.react.js', note: 'The scrolling feed page on facebook.com' },
    { path: 'www/src/ui/feed/FeedStory.react.js', note: 'One post card: header, text, photo, reactions and comments' },
    { path: 'www/src/ui/feed/LikeButton.react.js', note: 'The Like button, with its Relay fragment and mutation' },
    { path: 'www/src/ui/feed/__generated__/LikeButton_story.graphql.js', note: 'Code the Relay compiler generates from the fragment' },
    { path: 'www/flib/graphql/types/StoryType.hack', note: 'Defines the GraphQL Story type: id, text, likeCount…' },
    { path: 'www/flib/graphql/mutations/LikeStoryMutation.hack', note: 'Hack code that runs when someone taps Like' },
    { path: 'www/flib/tao/TaoClient.hack', note: 'Helper for reading and writing objects and associations in TAO' },
    { path: 'www/flib/jobs/NotifyLikeJob.hack', note: 'Background job that tells a post author about a new like' },
    { path: 'www/flib/gatekeeper/feed_gatekeepers.hack', note: 'Feature flags that turn new feed features on for some users' },
    { path: 'ios/NewsFeed/FBFeedStoryComponent.mm', note: 'ComponentKit component (Objective-C++) for a post on iPhone' },
    { path: 'android/feed/FeedStoryComponentSpec.kt', note: 'Litho component that lays out a post on Android' },
    { path: 'services/if/feed.thrift', note: 'Thrift definitions for how the web servers call the feed service' },
    { path: 'services/multifeed/Aggregator.cpp', note: 'Gathers candidate stories and asks the ranker to score them' },
    { path: 'services/tao/AssocCache.cpp', note: 'In-memory cache of association lists and counts' },
    { path: 'db/mysql/schema/tao_graph.sql', note: 'Tables for objects, associations and association counts' },
    { path: 'ml/feed_ranking/story_ranker.py', note: 'PyTorch model that predicts likes, comments and shares' },
    { path: 'infra/katran/balancer.bpf.c', note: 'eBPF program that runs in the Linux kernel to spread connections' },
    { path: 'infra/proxygen/edge_routes.cpp', note: 'Rules for which data center and servers get each request' },
  ],

  code: [
    {
      id: 'relay-like-button',
      title: 'A Like button with Relay',
      file: 'www/src/ui/feed/LikeButton.react.js',
      language: 'JavaScript (React + Relay)',
      explanation:
        "A simplified, illustrative component in the style facebook.com uses. The component declares exactly the fields it needs in a GraphQL fragment, and Relay merges fragments from every component into one request for the page. Tapping Like sends a mutation with an 'optimistic response', so the button changes instantly and Relay rolls it back if the server says no.",
      code: `import { graphql, useFragment, useMutation } from 'react-relay';

export default function LikeButton({ storyRef }) {
  // This component only asks for the three fields it actually uses
  const story = useFragment(
    graphql\`fragment LikeButton_story on Story { id viewerHasLiked likeCount }\`,
    storyRef,
  );

  const [commitLike] = useMutation(graphql\`
    mutation LikeButtonMutation($storyId: ID!, $like: Boolean!) {
      setStoryLike(storyId: $storyId, like: $like) {
        story { id viewerHasLiked likeCount }
      }
    }
  \`);

  function handleClick() {
    const like = !story.viewerHasLiked;
    commitLike({
      variables: { storyId: story.id, like },
      // Show the result right away; Relay undoes it if the request fails
      optimisticResponse: {
        setStoryLike: {
          story: { id: story.id, viewerHasLiked: like, likeCount: story.likeCount + (like ? 1 : -1) },
        },
      },
    });
  }

  return (
    <button onClick={handleClick} aria-pressed={story.viewerHasLiked}>
      👍 {story.viewerHasLiked ? 'Liked' : 'Like'} · {story.likeCount}
    </button>
  );
}`,
    },
    {
      id: 'hack-like-mutation',
      title: 'Saving a like in Hack with TAO',
      file: 'www/flib/graphql/mutations/LikeStoryMutation.hack',
      language: 'Hack',
      explanation:
        "An educational sketch, not real Facebook source. It follows the ideas in Facebook's published TAO paper: a like is an association (a typed link) from a user to a post, TAO adds the reverse link automatically, and counts come straight from TAO. Hack's async/await and concurrent block let two reads run at the same time, and the slow notification is handed off to a background job.",
      code: `// TAO models the social graph as OBJECTS (users, posts, comments) and
// ASSOCIATIONS: typed, one-way links like "user 42 LIKES post 9001".
enum Assoc: string as string {
  LIKES = 'likes';
  LIKED_BY = 'liked_by'; // configured as the inverse of LIKES
}

final class LikeStoryMutation {
  public function __construct(
    private TaoClient $tao,
    private JobQueue $jobs,
  ) {}

  // Called by the GraphQL layer when someone taps Like
  public async function likeAsync(int $viewer_id, int $story_id): Awaitable<int> {
    // 1. Add "viewer LIKES story". Because LIKED_BY is its inverse,
    //    TAO also adds "story LIKED_BY viewer" for us.
    await $this->tao->assocAddAsync($viewer_id, Assoc::LIKES, $story_id);

    // 2. Run two reads at the same time instead of one after the other
    concurrent {
      $count = await $this->tao->assocCountAsync($story_id, Assoc::LIKED_BY);
      $story = await $this->tao->objGetAsync($story_id);
    }

    // 3. The author's notification can wait a moment, so queue it
    $author_id = $story['owner_id'] as int;
    if ($author_id !== $viewer_id) {
      $this->jobs->enqueue('notify_like', dict[
        'story_id' => $story_id,
        'from' => $viewer_id,
        'to' => $author_id,
      ]);
    }
    return $count;
  }
}`,
    },
    {
      id: 'mysql-tao-tables',
      title: 'Storing a social graph in MySQL',
      file: 'db/mysql/schema/tao_graph.sql',
      language: 'SQL',
      explanation:
        "A simplified schema inspired by the TAO paper, not Facebook's real tables. Everything is either an object or an association. Each object ID has its shard number built in, and associations live on the shard of the object they start from, so 'who liked post 9001?' is answered by a single shard. Counts are kept in their own table so nobody ever counts millions of rows.",
      code: `-- Every user, post, comment or photo is a row in objects.
-- The shard an object lives on is encoded inside its id.
CREATE TABLE objects (
  id      BIGINT UNSIGNED NOT NULL PRIMARY KEY,
  otype   VARCHAR(32)     NOT NULL,   -- 'user', 'post', 'comment'
  data    JSON            NOT NULL,   -- e.g. {"text": "Hello!", "owner_id": 42}
  version INT UNSIGNED    NOT NULL DEFAULT 1
) ENGINE=ROCKSDB;

-- Every link between two objects is a row in assocs.
CREATE TABLE assocs (
  id1   BIGINT UNSIGNED NOT NULL,     -- from, e.g. post 9001
  atype VARCHAR(32)     NOT NULL,     -- 'liked_by', 'friend', 'authored'
  id2   BIGINT UNSIGNED NOT NULL,     -- to, e.g. user 42
  time  INT UNSIGNED    NOT NULL,     -- when it happened
  PRIMARY KEY (id1, atype, id2),      -- you can only like a post once
  KEY newest_first (id1, atype, time)
) ENGINE=ROCKSDB;

CREATE TABLE assoc_counts (
  id1   BIGINT UNSIGNED NOT NULL,
  atype VARCHAR(32)     NOT NULL,
  count INT UNSIGNED    NOT NULL DEFAULT 0,
  PRIMARY KEY (id1, atype)
) ENGINE=ROCKSDB;

-- On post 9001's shard: save "liked by user 42" and bump the count together
START TRANSACTION;
INSERT INTO assocs (id1, atype, id2, time) VALUES (9001, 'liked_by', 42, UNIX_TIMESTAMP());
INSERT INTO assoc_counts (id1, atype, count) VALUES (9001, 'liked_by', 1)
  ON DUPLICATE KEY UPDATE count = count + 1;
COMMIT;

-- "The 10 most recent people who liked post 9001"
SELECT id2, time FROM assocs
WHERE id1 = 9001 AND atype = 'liked_by'
ORDER BY time DESC LIMIT 10;`,
    },
    {
      id: 'cpp-feed-aggregator',
      title: 'Gathering and ranking a feed',
      file: 'services/multifeed/Aggregator.cpp',
      language: 'C++',
      explanation:
        "An educational sketch of a 'pull' feed, where your feed is built at the moment you ask for it. The aggregator asks many leaf servers for your friends' recent stories in parallel, merges the answers, scores each story, and keeps only the best ones. partial_sort is used because we only need the top few in order, not the whole list.",
      code: `#include <algorithm>
#include <cstdint>
#include <functional>
#include <future>
#include <vector>

struct Story {
  int64_t id;
  int64_t authorId;
  double score = 0;
};

// Stand-ins for real network calls to other services
std::vector<Story> fetchRecentStories(int leaf, const std::vector<int64_t>& friendIds);
double predictScore(int64_t viewerId, const Story& story);  // the ranking model

std::vector<Story> buildFeed(int64_t viewerId, const std::vector<int64_t>& friendIds,
                             int numLeaves, size_t pageSize) {
  // 1. Ask every leaf server at the same time for recent stories by your friends
  std::vector<std::future<std::vector<Story>>> pending;
  for (int leaf = 0; leaf < numLeaves; ++leaf) {
    pending.push_back(std::async(std::launch::async, fetchRecentStories, leaf, std::cref(friendIds)));
  }

  // 2. Merge all the answers into one list of candidates
  std::vector<Story> candidates;
  for (auto& answer : pending) {
    std::vector<Story> part = answer.get();
    candidates.insert(candidates.end(), part.begin(), part.end());
  }

  // 3. Score each candidate, then keep the best few, highest score first
  for (Story& s : candidates) s.score = predictScore(viewerId, s);
  size_t keep = std::min(pageSize, candidates.size());
  std::partial_sort(candidates.begin(), candidates.begin() + keep, candidates.end(),
                    [](const Story& a, const Story& b) { return a.score > b.score; });
  candidates.resize(keep);
  return candidates;
}`,
    },
    {
      id: 'pytorch-story-ranker',
      title: 'A tiny feed ranking model',
      file: 'ml/feed_ranking/story_ranker.py',
      language: 'Python',
      explanation:
        "A toy PyTorch model inspired by how Meta has described feed ranking: predict the chance of several actions (like, comment, share), then combine them with weights into one relevance score. Real models use thousands of signals and far more data; this one uses random numbers just to show the shape of the idea.",
      code: `import torch
from torch import nn


class StoryRanker(nn.Module):
    """Predicts how likely a viewer is to like, comment on, or share a story."""

    def __init__(self, num_features: int):
        super().__init__()
        self.shared = nn.Sequential(
            nn.Linear(num_features, 64), nn.ReLU(),
            nn.Linear(64, 32), nn.ReLU(),
        )
        # One small output "head" for each action we want to predict
        self.heads = nn.ModuleDict({
            "like": nn.Linear(32, 1),
            "comment": nn.Linear(32, 1),
            "share": nn.Linear(32, 1),
        })

    def forward(self, features: torch.Tensor) -> dict[str, torch.Tensor]:
        hidden = self.shared(features)
        return {name: torch.sigmoid(head(hidden)).squeeze(-1) for name, head in self.heads.items()}


# A comment or share says more than a quick like, so they count for more
WEIGHTS = {"like": 1.0, "comment": 4.0, "share": 6.0}


def score_stories(model: StoryRanker, features: torch.Tensor) -> torch.Tensor:
    # features: one row per candidate story, e.g. [close_friend, has_photo, hours_old, ...]
    with torch.no_grad():
        chances = model(features)
    return sum(WEIGHTS[name] * p for name, p in chances.items())


model = StoryRanker(num_features=8)
candidates = torch.rand(5, 8)  # 5 made-up stories with 8 made-up features each
scores = score_stories(model, candidates)
print("Show in this order:", scores.argsort(descending=True).tolist())`,
    },
  ],

  playground: {
    title: 'Mini News Feed post',
    description:
      'A tiny Facebook-style post card: an avatar, name and time, some text, a gradient "photo", a Like button that toggles and updates the count, and a comment box that adds your comment to the list.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mini News Feed</title>
<style>
:root {
  --brand: #1877F2; /* @tweak color "Brand blue" */
  --photo: #42B72A; /* @tweak color "Photo gradient" */
  --bg: #F0F2F5; /* @tweak color "Feed background" */
  --card: #FFFFFF; /* @tweak color "Card color" */
  --text: #050505; /* @tweak color "Text color" */
  --radius: 10px; /* @tweak range 0 28 "Card corners" */
  --avatar: 40px; /* @tweak range 28 60 "Avatar size" */
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text);
  font: 15px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
button, input { font: inherit; color: inherit; }
.muted { color: #65676B; font-size: 13px; }

/* Top bar */
.topbar { display: flex; align-items: center; justify-content: space-between;
  padding: 8px 14px; background: var(--card); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); }
.logo { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px; color: var(--brand); }
.topbar span { font-size: 20px; }

/* The post card */
.card { background: var(--card); margin: 10px 8px; border-radius: var(--radius);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); overflow: hidden; }
.head { display: flex; align-items: center; gap: 10px; padding: 12px; }
.avatar { width: var(--avatar); height: var(--avatar); border-radius: 50%; flex: none;
  display: grid; place-items: center; font-size: calc(var(--avatar) * 0.55);
  background: linear-gradient(135deg, var(--brand), var(--photo)); }
.who { flex: 1; }
.name { font-weight: 600; }
.text { margin: 0; padding: 0 12px 10px; }

/* The "photo" is just a CSS gradient with an emoji on top */
.photo { aspect-ratio: 16 / 10; display: grid; place-items: center; font-size: 72px;
  background: linear-gradient(160deg, var(--brand), var(--photo)); }

/* Like count and the Like / Comment / Share bar */
.counts { display: flex; justify-content: space-between; padding: 8px 12px; }
.thumb-dot { display: inline-grid; place-items: center; width: 18px; height: 18px; margin-right: 4px;
  border-radius: 50%; background: var(--brand); font-size: 10px; vertical-align: -3px; }
.bar { display: flex; margin: 0 12px; border-top: 1px solid rgba(128, 128, 128, 0.3);
  border-bottom: 1px solid rgba(128, 128, 128, 0.3); }
.bar button { flex: 1; padding: 8px 0; border: 0; border-radius: 6px; background: none;
  color: #65676B; font-weight: 600; cursor: pointer; }
.bar button:active { background: rgba(128, 128, 128, 0.15); }
.bar .like.on { color: var(--brand); }
.like.on .thumb { display: inline-block; animation: pop 0.3s; }
@keyframes pop { 50% { transform: scale(1.4) rotate(-12deg); } }

/* Comments */
.comments { padding: 10px 12px 0; }
.comment, .box { display: flex; gap: 8px; margin-bottom: 10px; }
.mini { width: 32px; height: 32px; border-radius: 50%; flex: none; display: grid; place-items: center;
  background: rgba(128, 128, 128, 0.2); }
.says { background: rgba(128, 128, 128, 0.15); border-radius: calc(var(--radius) + 8px); padding: 6px 12px; font-size: 14px; }
.says b { display: block; font-size: 13px; }
.box { padding: 0 12px 2px; }
.box input { flex: 1; min-width: 0; border: 0; border-radius: 18px; padding: 8px 14px;
  background: rgba(128, 128, 128, 0.15); outline-color: var(--brand); }
.box button { border: 0; background: none; color: var(--brand); font-weight: 700; cursor: pointer; }
.box button:disabled { opacity: 0.4; cursor: default; }
</style>
</head>
<body>
  <header class="topbar">
    <h1 class="logo" data-edit="app-name">facebook</h1>
    <span>🔍 💬</span>
  </header>

  <article class="card">
    <div class="head">
      <div class="avatar">🐼</div>
      <div class="who">
        <div class="name" data-edit="name">Maya Rivera</div>
        <div class="muted"><span data-edit="time">3 hrs</span> · 🌎</div>
      </div>
      <span>⋯</span>
    </div>
    <p class="text" data-edit="post-text">Finished my first web app for CS 101! Only took 47 cups of tea.</p>
    <div class="photo" data-edit="photo-emoji">💻</div>

    <div class="counts muted">
      <span><span class="thumb-dot">👍</span><span id="likes">128</span></span>
      <span id="comment-count">1 comment</span>
    </div>

    <!-- Reaction bar -->
    <div class="bar">
      <button class="like" id="like"><span class="thumb">👍</span> Like</button>
      <button id="comment-btn">💬 Comment</button>
      <button>↗ Share</button>
    </div>

    <div class="comments" id="comments">
      <div class="comment">
        <div class="mini">🦊</div>
        <div class="says"><b>Leo Park</b>Congrats!! Send me the link 🎉</div>
      </div>
    </div>
    <form class="box" id="form">
      <div class="mini">🙂</div>
      <input id="input" placeholder="Write a comment..." autocomplete="off">
      <button id="send" disabled>Post</button>
    </form>
  </article>

<script>
  // State lives in plain variables; render() copies it onto the screen
  let liked = false;
  let likes = 128;
  let commentCount = 1;

  const likeBtn = document.getElementById('like');
  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const send = document.getElementById('send');

  function render() {
    likeBtn.classList.toggle('on', liked);
    document.getElementById('likes').textContent = likes.toLocaleString();
    document.getElementById('comment-count').textContent =
      commentCount + (commentCount === 1 ? ' comment' : ' comments');
  }

  // Like: flip liked on/off and move the count up or down by one
  likeBtn.addEventListener('click', () => {
    liked = !liked;
    likes += liked ? 1 : -1;
    render();
  });

  // The Comment button just jumps to the text box
  document.getElementById('comment-btn').addEventListener('click', () => input.focus());

  // Only allow posting when the box is not empty
  input.addEventListener('input', () => {
    send.disabled = input.value.trim() === '';
  });

  // Add a new comment to the bottom of the list
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // stop the browser from reloading the page
    const text = input.value.trim();
    if (!text) return;

    const row = document.createElement('div');
    row.className = 'comment';
    const avatar = document.createElement('div');
    avatar.className = 'mini';
    avatar.textContent = '🙂';
    const says = document.createElement('div');
    says.className = 'says';
    const who = document.createElement('b');
    who.textContent = 'You';
    says.append(who, text); // text is added as plain text, never as HTML
    row.append(avatar, says);
    document.getElementById('comments').appendChild(row);

    commentCount += 1;
    input.value = '';
    send.disabled = true;
    render();
  });
</script>
</body>
</html>`,
    challenges: [
      'Build Facebook-style dark mode: set --bg to #18191A, --card to #242526 and --text to #E4E6EB.',
      'Post a comment that says <b>hi</b>. It shows up as plain text because the script adds it as text, not HTML. Search for "cross-site scripting" to see why that matters.',
      'Find likes += liked ? 1 : -1 in the script and change both 1s to 10, then tap Like a few times to watch the count jump.',
      'Tap the name, time and post text to edit them, then drag Card corners to 24px and change --photo to #F7B928 for a sunset photo.',
    ],
  },

  concepts: [
    {
      term: 'Social graph',
      meaning:
        'A map of people and things (posts, photos, pages) as dots, with lines between them for relationships like "friends with" or "liked", which is how Facebook stores almost everything.',
    },
    {
      term: 'Sharding',
      meaning:
        'Splitting one enormous database into many smaller ones (shards), each holding a slice of the data, so no single computer has to store or serve everything.',
    },
    {
      term: 'Caching',
      meaning:
        'Keeping copies of frequently read data in fast memory, like TAO and Memcache do, so the database is not asked the same question over and over.',
    },
    {
      term: 'GraphQL',
      meaning:
        'A way for an app to ask a server for exactly the fields it needs in one request, instead of calling many fixed endpoints and getting extra data it will throw away.',
    },
    {
      term: 'Component',
      meaning:
        'A reusable piece of user interface, like a Like button or a post card, that you build once and use many times. React is built around this idea.',
    },
    {
      term: 'Feed ranking',
      meaning:
        'Scoring each possible post by how much a person will probably care about it and showing the highest scores first, instead of simply showing the newest posts first.',
    },
    {
      term: 'JIT compilation',
      meaning:
        '"Just-in-time" compiling: while a program runs, the system turns the most-used code into fast machine code. HHVM does this to make Hack code run quickly.',
    },
    {
      term: 'Cross-site scripting (XSS)',
      meaning:
        'An attack where someone types code (like a <script> tag) into a comment, and a careless site runs it for other users. Inserting user text as plain text prevents it.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Model the social graph',
      detail:
        "Create tables for users, friendships, posts, likes and comments in SQLite or a free Supabase (PostgreSQL) database. Practice the query 'newest posts from my friends'.",
    },
    {
      step: 'Build a small GraphQL API',
      detail:
        'Use Node.js with GraphQL Yoga or Apollo Server. Define User, Post and Comment types, a feed query, and likePost and addComment mutations.',
    },
    {
      step: 'Make the post card in React',
      detail:
        'Build FeedStory, LikeButton and CommentList components, like the playground above, and show a list of posts that comes from your API.',
    },
    {
      step: 'Make likes feel instant and safe',
      detail:
        'Update the Like button on screen first, then send the mutation and undo it on failure. Add a unique constraint on (user_id, post_id) so nobody can like twice.',
    },
    {
      step: 'Store photos and cache counts',
      detail:
        'Upload images to a file service like Supabase Storage or Cloudinary and save only the URL. Keep like counts in Redis so you are not counting rows on every page load.',
    },
    {
      step: 'Rank your feed and ship it',
      detail:
        'Start with a simple score such as likes + comments × 3 − hours old, sort by it, then deploy the website on Vercel and your API on Render or Railway.',
    },
  ],

  sources: [
    { label: 'Wikipedia: Facebook', url: 'https://en.wikipedia.org/wiki/Facebook' },
    { label: 'Engineering at Meta blog', url: 'https://engineering.fb.com' },
    { label: 'React documentation', url: 'https://react.dev' },
    { label: 'GraphQL (official site)', url: 'https://graphql.org' },
    { label: 'Hack language (official site)', url: 'https://hacklang.org' },
  ],
};
