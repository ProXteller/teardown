import type { Teardown } from '../types';

export const amazon: Teardown = {
  id: 'amazon',
  name: 'Amazon',
  url: 'amazon.com',
  tagline: 'The everything store: find almost any product and get it delivered fast.',
  category: 'E-commerce',
  brandColor: '#FF9900',
  accentColor: '#146EB4',
  logoGlyph: '📦',
  source: 'curated',

  eli5:
    "Amazon is like a gigantic online shop run by thousands of small teams, where each team owns one piece of the store, such as product details, the shopping cart or recommendations. When you open a page, Amazon's servers ask many of these little programs (sometimes more than a hundred) for their piece at the same time and stitch the answers into one page. When you click Buy, your order is saved, your payment is checked, and a message is sent to a warehouse so people and robots can pack your box.",

  facts: [
    { label: 'Founded', value: 'July 1994, Bellevue, Washington' },
    { label: 'Founder', value: 'Jeff Bezos' },
    { label: 'Headquarters', value: 'Seattle, Washington and Arlington, Virginia' },
    { label: 'Went public', value: 'May 1997 (NASDAQ: AMZN)' },
    { label: 'CEO', value: 'Andy Jassy (since July 2021)' },
    { label: 'Revenue', value: 'About $717 billion (2025)' },
    { label: 'Known for (tech)', value: 'Service-oriented architecture, two-pizza teams, and inventing AWS' },
  ],

  history: [
    {
      year: '1994',
      title: 'Started in a garage',
      detail:
        'Jeff Bezos left his Wall Street job, moved to the Seattle area and started the company in the garage of his rented house in Bellevue, Washington. It was first called Cadabra before being renamed Amazon.',
    },
    {
      year: '1995',
      title: 'Opens as an online bookstore',
      detail:
        'Amazon.com opened to the public in July 1995 selling books, because an online store could list far more titles than any physical bookshop. Music, videos and eventually almost everything else followed.',
    },
    {
      year: '2002',
      title: 'Everything becomes a service',
      detail:
        'Amazon was already breaking up the one big program behind its website. Around 2002, as former engineer Steve Yegge later retold, Bezos ordered every team to share its data and features only through service interfaces (APIs).',
    },
    {
      year: '2005',
      title: 'Amazon Prime',
      detail:
        'For $79 a year, Prime offered unlimited two-day shipping, a bet that fast, free delivery would make people shop more often.',
    },
    {
      year: '2006',
      title: 'AWS launches S3 and EC2',
      detail:
        'Amazon started renting out computing infrastructure to other companies. S3 (file storage) launched in March and EC2 (virtual servers) in August, kicking off modern cloud computing.',
    },
    {
      year: '2007',
      title: 'Kindle and the Dynamo paper',
      detail:
        "The Kindle e-reader launched in November. The same year Amazon engineers published the Dynamo paper, describing the always-available key-value store behind services like the shopping cart.",
    },
    {
      year: '2012',
      title: 'DynamoDB and warehouse robots',
      detail:
        "DynamoDB turned Dynamo's ideas into a database anyone could rent on AWS, and Amazon bought Kiva Systems, whose robots carry whole shelves to warehouse workers.",
    },
    {
      year: '2014',
      title: 'Echo and Alexa',
      detail:
        'The Echo smart speaker introduced Alexa, a voice assistant that uses speech recognition running in the cloud to answer questions, play music and shop by voice.',
    },
    {
      year: '2019',
      title: 'The last Oracle database is switched off',
      detail:
        "Amazon's consumer business finished moving roughly 75 petabytes of data off Oracle databases and onto AWS databases such as DynamoDB and Aurora.",
    },
    {
      year: '2021',
      title: 'Andy Jassy becomes CEO',
      detail:
        'Jeff Bezos became executive chairman, and Andy Jassy, who had led AWS since its early days, took over as CEO in July 2021.',
    },
  ],

  languages: [
    { name: 'Java', usedFor: 'Most backend services, like catalog, cart and orders', share: 40 },
    { name: 'JavaScript / TypeScript', usedFor: 'Interactive parts of amazon.com and infrastructure-as-code tools', share: 20 },
    { name: 'Python', usedFor: 'Machine learning, data analysis and automation scripts', share: 12 },
    { name: 'C / C++', usedFor: 'The early website and speed-critical systems', share: 10 },
    { name: 'Kotlin / Swift', usedFor: 'The Amazon Shopping apps on Android and iPhone', share: 10 },
    { name: 'Rust', usedFor: 'Newer performance-critical AWS systems such as Firecracker, the tiny virtual machines behind AWS Lambda', share: 8 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'Server-rendered HTML',
          role: 'Pages built on the server',
          beginnerNote:
            "Amazon's servers send a finished page of HTML, so the product, price and photos appear quickly even on slow phones before much JavaScript runs.",
          confidence: 'likely',
        },
        {
          name: 'JavaScript',
          role: 'Interactive parts of each page',
          beginnerNote:
            "The browser's own programming language powers things like the quantity picker, image zoom and Add to Cart without reloading the whole page.",
          confidence: 'confirmed',
        },
        {
          name: 'AUI (Amazon UI)',
          role: 'Shared styles and components',
          beginnerNote:
            "A shared kit of buttons, boxes and layouts, which is why class names like a-button appear all over amazon.com's HTML.",
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Mobile',
      items: [
        {
          name: 'Native iOS & Android apps',
          role: 'The Amazon Shopping app',
          beginnerNote:
            "Apps built with each phone's own tools, like Swift on iPhone and Kotlin on Android, so scrolling, camera search and notifications feel smooth.",
          confidence: 'likely',
        },
        {
          name: 'Web views',
          role: 'Reusing web pages inside the app',
          beginnerNote:
            'Some screens are web pages shown inside the app, so a change to the website can reach phones without waiting for an app store update.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Service-oriented architecture',
          role: 'Thousands of small services',
          beginnerNote:
            "Instead of one giant program, the store is split into many small programs that talk through APIs, like a restaurant where each station cooks one part of the meal.",
          confidence: 'confirmed',
        },
        {
          name: 'Java',
          role: 'Main backend language',
          beginnerNote:
            'Java is fast, mature and has great tools, and Amazon has said it runs thousands of production services on its own Java build.',
          confidence: 'confirmed',
        },
        {
          name: 'Amazon Corretto',
          role: "Amazon's free Java (OpenJDK) build",
          beginnerNote:
            'The version of Java that Amazon uses internally, shared free with everyone (previewed in late 2018, ready for production in 2019) with long-term security updates.',
          confidence: 'confirmed',
        },
        {
          name: 'Smithy',
          role: 'Describing service APIs',
          beginnerNote:
            'An open-source language from AWS for writing down exactly what each API accepts and returns, so client and server code can be generated from one file.',
          confidence: 'confirmed',
        },
        {
          name: 'Amazon SQS & SNS',
          role: 'Messages between services',
          beginnerNote:
            "Queues and notification topics let one service say 'an order was placed' and let others react whenever they are ready, like leaving a note on a shared board.",
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'Amazon DynamoDB',
          role: 'Fast key-value database',
          beginnerNote:
            "A database that finds data by key, like a giant dictionary, which grew out of Amazon's 2007 Dynamo paper and is built to stay fast during huge shopping peaks.",
          confidence: 'confirmed',
        },
        {
          name: 'Amazon Aurora',
          role: 'Relational SQL database',
          beginnerNote:
            'A cloud database that speaks MySQL or PostgreSQL, and one of the main places Amazon moved its old Oracle databases to.',
          confidence: 'confirmed',
        },
        {
          name: 'Amazon S3',
          role: 'File and data-lake storage',
          beginnerNote:
            'Stores files of any size, from product photos to huge archives of past activity, and you fetch each one by its name, like a locker number.',
          confidence: 'likely',
        },
        {
          name: 'Amazon Redshift',
          role: 'Data warehouse for reports',
          beginnerNote:
            "A database built for giant questions like 'total sales per category per day', which would be far too slow to ask the shopping databases.",
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Amazon Web Services (EC2)',
          role: 'Where the store runs',
          beginnerNote:
            "Amazon's own store runs on the same rentable cloud servers that AWS sells to other companies.",
          confidence: 'confirmed',
        },
        {
          name: 'Amazon CloudFront',
          role: 'Content delivery network',
          beginnerNote:
            'Keeps copies of photos, styles and scripts on servers around the world, so they load from a city near you.',
          confidence: 'likely',
        },
        {
          name: 'Elastic Load Balancing',
          role: 'Spreads traffic across servers',
          beginnerNote:
            'Like a host at a busy restaurant, it sends each incoming request to a server that has room for it.',
          confidence: 'likely',
        },
        {
          name: 'Availability Zones',
          role: 'Surviving data center failures',
          beginnerNote:
            'Copies of each service run in separate data center buildings, so if one loses power the others keep the store open.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Item-to-item collaborative filtering',
          role: "'Customers who bought this also bought'",
          beginnerNote:
            'Products count as similar when many of the same people bought both, an approach Amazon engineers described in a well-known 2003 paper.',
          confidence: 'confirmed',
        },
        {
          name: 'Amazon Personalize',
          role: 'Recommendations for other companies',
          beginnerNote:
            'An AWS service that lets any app add recommendations, which AWS says is based on the same kind of technology Amazon.com uses.',
          confidence: 'confirmed',
        },
        {
          name: 'Rufus',
          role: 'AI shopping assistant',
          beginnerNote:
            "A generative-AI chat assistant launched in 2024 that answers questions like 'is this tent good in the rain?' using product details and reviews.",
          confidence: 'confirmed',
        },
        {
          name: 'Alexa speech models',
          role: 'Understanding voice requests',
          beginnerNote:
            'Machine-learning models turn your voice into text, work out what you meant, and speak an answer back.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'DevOps',
      items: [
        {
          name: 'Two-pizza teams',
          role: 'Small teams that own a service',
          beginnerNote:
            "A team should be small enough to be fed by two pizzas, and it builds, runs and fixes its own service ('you build it, you run it').",
          confidence: 'confirmed',
        },
        {
          name: 'Continuous deployment',
          role: 'Shipping in small steps',
          beginnerNote:
            'Code goes out in many small automatic releases instead of a few big ones, and in 2011 Amazon said it deployed about every 11.6 seconds on an average weekday.',
          confidence: 'confirmed',
        },
        {
          name: 'Apollo',
          role: 'Internal deployment system',
          beginnerNote:
            "Amazon's in-house tool for rolling new code out to thousands of servers a few at a time, described publicly by CTO Werner Vogels in 2014.",
          confidence: 'confirmed',
        },
        {
          name: 'Correction of Error (COE) reviews',
          role: 'Learning from outages',
          beginnerNote:
            'After a serious problem, the team writes up what happened and why, focusing on fixing the process instead of blaming a person.',
          confidence: 'confirmed',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      // Tier 0: clients
      {
        id: 'browser',
        label: 'amazon.com',
        kind: 'client',
        tier: 0,
        tech: 'HTML, CSS & JavaScript in your browser',
        description:
          "The Amazon website in your browser. Most of each page arrives as ready-made HTML, then JavaScript adds interactive parts like the Add to Cart button.",
      },
      {
        id: 'mobile-app',
        label: 'Shopping app',
        kind: 'client',
        tier: 0,
        tech: 'Native iOS & Android apps',
        description:
          'The Amazon Shopping app on phones. It talks to the same backend services as the website, so your cart looks the same everywhere.',
      },
      // Tier 1: edge
      {
        id: 'cdn',
        label: 'CDN',
        kind: 'edge',
        tier: 1,
        tech: 'Amazon CloudFront',
        description:
          'Servers around the world that keep copies of product photos, styles and scripts, so they download from somewhere near you.',
      },
      {
        id: 'load-balancer',
        label: 'Load balancer',
        kind: 'edge',
        tier: 1,
        tech: 'Elastic Load Balancing',
        description:
          'The front door for page and API requests. It spreads traffic across a big fleet of web servers so none of them gets overloaded, even on Prime Day.',
      },
      // Tier 2: API / gateway (plus outside partners)
      {
        id: 'web-fleet',
        label: 'Page assembly',
        kind: 'gateway',
        tier: 2,
        tech: 'Java web services on Amazon EC2',
        description:
          'Servers that build each page. They call many smaller services at the same time, collect the answers and stitch them into the HTML or JSON you receive.',
      },
      {
        id: 'payments',
        label: 'Banks & card networks',
        kind: 'external',
        tier: 2,
        tech: 'Card networks and card-issuing banks',
        description:
          "Outside companies that approve or decline a payment. Amazon asks them whether a charge can go through before confirming your order.",
      },
      {
        id: 'warehouses',
        label: 'Fulfillment centers',
        kind: 'external',
        tier: 2,
        tech: 'Warehouse systems & Amazon Robotics',
        description:
          "Amazon's giant warehouses. Their software listens for new orders and guides people and robots to pick, pack and ship your box.",
      },
      // Tier 3: services
      {
        id: 'catalog',
        label: 'Catalog service',
        kind: 'service',
        tier: 3,
        tech: 'Java service',
        description:
          "Knows everything about each product, such as its title, photos, description and price, all looked up by the product's ID (Amazon calls it an ASIN).",
      },
      {
        id: 'cart',
        label: 'Cart service',
        kind: 'service',
        tier: 3,
        tech: 'Java service',
        description:
          "Keeps track of what's in your cart. It is designed to always accept 'add to cart', even when parts of the system are struggling.",
      },
      {
        id: 'orders',
        label: 'Order service',
        kind: 'service',
        tier: 3,
        tech: 'Java service',
        description:
          'Turns a cart into a real order: it checks the payment, reserves stock, saves the order and announces it to the rest of Amazon.',
      },
      {
        id: 'recs',
        label: 'Recommendations',
        kind: 'ml',
        tier: 3,
        tech: 'Item-to-item collaborative filtering',
        description:
          "Powers 'Customers who bought this also bought'. The lists of similar products are worked out ahead of time, so showing them is just a quick lookup.",
      },
      // Tier 4: data & storage
      {
        id: 'dynamodb',
        label: 'DynamoDB',
        kind: 'database',
        tier: 4,
        tech: 'Amazon DynamoDB (key-value)',
        description:
          "A very fast database that finds data by key, like a giant dictionary. Perfect for 'give me cart X' or 'give me product Y' millions of times a second.",
      },
      {
        id: 'aurora',
        label: 'Aurora',
        kind: 'database',
        tier: 4,
        tech: 'Amazon Aurora (relational SQL)',
        description:
          'A table-based SQL database, used here for data where every number must add up exactly, such as orders and stock counts.',
      },
      {
        id: 's3',
        label: 'S3 storage',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3',
        description:
          'Stores files of any size: product photos, plus big archives of past orders that the recommendation system learns from.',
      },
      {
        id: 'order-queue',
        label: 'Event queue',
        kind: 'queue',
        tier: 4,
        tech: 'Amazon SQS / SNS',
        description:
          "A waiting line of messages like 'an order was placed'. Warehouses, email senders and other systems read it at their own pace, so checkout doesn't wait for them.",
      },
    ],
    edges: [
      { from: 'browser', to: 'cdn', label: 'HTTPS (images, CSS, JS)' },
      { from: 'mobile-app', to: 'cdn', label: 'HTTPS (images)' },
      { from: 'browser', to: 'load-balancer', label: 'HTTPS' },
      { from: 'mobile-app', to: 'load-balancer', label: 'HTTPS / JSON' },
      { from: 'cdn', to: 's3', label: 'fetch on cache miss' },
      { from: 'load-balancer', to: 'web-fleet', label: 'HTTP' },
      { from: 'web-fleet', to: 'catalog', label: 'RPC' },
      { from: 'web-fleet', to: 'cart', label: 'RPC' },
      { from: 'web-fleet', to: 'recs', label: 'RPC' },
      { from: 'web-fleet', to: 'orders', label: 'RPC' },
      { from: 'catalog', to: 'dynamodb', label: 'get item by ASIN' },
      { from: 'cart', to: 'dynamodb', label: 'read / update cart' },
      { from: 'recs', to: 'dynamodb', label: 'look up similar items' },
      { from: 'recs', to: 's3', label: 'learn from order history (offline)' },
      { from: 'orders', to: 'payments', label: 'authorize payment' },
      { from: 'orders', to: 'aurora', label: 'SQL transaction' },
      { from: 'orders', to: 'cart', label: 'empty the cart' },
      { from: 'orders', to: 'order-queue', label: 'publish OrderPlaced' },
      { from: 'order-queue', to: 'warehouses', label: 'deliver message' },
    ],
    flows: [
      {
        id: 'open-product',
        title: 'You open a product page',
        emoji: '🛍️',
        steps: [
          {
            from: 'browser',
            to: 'load-balancer',
            narration:
              "You click a product. Your browser asks amazon.com for that page over HTTPS, with the product's ID (its ASIN) in the web address.",
          },
          {
            from: 'load-balancer',
            to: 'web-fleet',
            narration: "The load balancer hands the request to a page-assembly server that isn't too busy.",
          },
          {
            from: 'web-fleet',
            to: 'catalog',
            narration:
              'The server sends out many requests at the same time. One goes to the catalog service for the title, description and price.',
          },
          {
            from: 'catalog',
            to: 'dynamodb',
            narration: 'The catalog service looks up the product by its ID in DynamoDB, which answers in a few milliseconds.',
          },
          {
            from: 'web-fleet',
            to: 'recs',
            narration:
              "Another request asks the recommendations service for 'customers also bought' items, a list that was calculated ahead of time.",
          },
          {
            from: 'web-fleet',
            to: 'cart',
            narration:
              'A third asks the cart service how many items you have, for the little number on the cart icon. Once the answers are back, the page is stitched together and sent to you.',
          },
          {
            from: 'browser',
            to: 'cdn',
            narration:
              'Your browser reads the HTML and downloads the product photos from a nearby CDN server, so the images pop in quickly.',
          },
        ],
      },
      {
        id: 'add-to-cart',
        title: 'You add an item to your cart',
        emoji: '🛒',
        steps: [
          {
            from: 'mobile-app',
            to: 'load-balancer',
            narration:
              'You choose a quantity of 2 and tap Add to Cart. The app bumps the cart badge right away and sends a small request in the background.',
          },
          {
            from: 'load-balancer',
            to: 'web-fleet',
            narration: 'The load balancer passes the request to one of the backend servers.',
          },
          {
            from: 'web-fleet',
            to: 'cart',
            narration: 'The server asks the cart service to add 2 of this product to your cart.',
          },
          {
            from: 'cart',
            to: 'dynamodb',
            narration:
              "The cart service updates the row for (you, this product) in DynamoDB, adding 2 in a single step so two taps at once can't overwrite each other.",
          },
          {
            from: 'web-fleet',
            to: 'recs',
            narration:
              "The server also grabs 'frequently bought together' suggestions for the confirmation screen, then replies with your new cart count and subtotal.",
          },
        ],
      },
      {
        id: 'place-order',
        title: 'You place an order',
        emoji: '📦',
        steps: [
          {
            from: 'browser',
            to: 'load-balancer',
            narration: 'You click Place your order, and the browser sends the checkout request over a secure HTTPS connection.',
          },
          {
            from: 'load-balancer',
            to: 'web-fleet',
            narration: 'The request is routed to a checkout server.',
          },
          {
            from: 'web-fleet',
            to: 'orders',
            narration: 'The checkout server asks the order service to turn your cart into a real order.',
          },
          {
            from: 'orders',
            to: 'payments',
            narration:
              'The order service checks with the card network and your bank that the payment can go through. If not, you are asked for another payment method.',
          },
          {
            from: 'orders',
            to: 'aurora',
            narration:
              'In one database transaction it reserves the stock and saves the order and its items, so you can never end up with half an order.',
          },
          {
            from: 'orders',
            to: 'order-queue',
            narration:
              "It publishes an 'OrderPlaced' message to the queue and shows you the confirmation page without waiting for anything else.",
          },
          {
            from: 'order-queue',
            to: 'warehouses',
            narration:
              'Warehouse systems pick up the message, choose a fulfillment center that has your item, and send it to people and robots to pick, pack and ship.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'web/detail-page/src/main/java/detail/DetailPageController.java', note: 'Builds a product page by calling many services in parallel' },
    { path: 'web/detail-page/templates/buy-box.html', note: 'The price, stock, quantity and Add to Cart box' },
    { path: 'web/detail-page/static/addToCart.ts', note: 'Makes the Add to Cart button update the badge without a page reload' },
    { path: 'web/detail-page/static/buy-box.css', note: 'Styles for the buy box, using shared UI components' },
    { path: 'services/catalog/src/main/java/catalog/ProductLookup.java', note: 'Fetches product details and price by ASIN' },
    { path: 'services/cart/model/cart.smithy', note: 'Smithy file describing the cart API: operations, inputs and outputs' },
    { path: 'services/cart/src/main/java/cart/CartService.java', note: 'Adds and removes cart lines in DynamoDB' },
    { path: 'services/orders/src/main/java/orders/PlaceOrderHandler.java', note: 'Runs checkout: payment check, database transaction, event' },
    { path: 'services/orders/db/schema.sql', note: 'Tables for inventory, orders, order items and outbox events' },
    { path: 'services/orders/db/place_order.sql', note: 'The all-or-nothing transaction that creates an order' },
    { path: 'services/delivery-promise/src/main/java/delivery/DeliveryEstimator.java', note: "Works out the 'FREE delivery Thursday' date" },
    { path: 'workers/fulfillment/src/main/java/fulfillment/OrderPlacedListener.java', note: 'Reads OrderPlaced messages and picks a warehouse' },
    { path: 'ml/recommendations/similar_items.py', note: 'Offline job that finds products bought by the same customers' },
    { path: 'ml/recommendations/load_lookup_table.py', note: 'Copies the finished similar-items lists into DynamoDB' },
    { path: 'android/app/src/main/java/shopping/product/ProductViewModel.kt', note: 'Android product screen state: quantity, subtotal, cart count' },
    { path: 'ios/Shopping/Product/ProductView.swift', note: 'The iPhone product screen' },
    { path: 'infra/cdk/lib/cart-stack.ts', note: 'AWS CDK code that creates the cart table, servers and alarms' },
    { path: 'pipelines/cart-service.yaml', note: 'Deployment pipeline: build, test, release to one zone, then the rest' },
  ],

  code: [
    {
      id: 'java-cart-dynamodb',
      title: 'Adding to the cart with DynamoDB',
      file: 'services/cart/src/main/java/cart/CartService.java',
      language: 'Java',
      explanation:
        "A simplified cart service using the AWS SDK for Java. Each cart line is one DynamoDB item found by two keys: who you are and which product. The update adds to the quantity in one atomic step, so two taps arriving at the same moment can't overwrite each other, and a condition blocks going over the limit. It's inspired by the Dynamo paper's idea that 'add to cart' should always work, not Amazon's real code.",
      code: `import java.time.Instant;
import java.util.Map;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.ConditionalCheckFailedException;
import software.amazon.awssdk.services.dynamodb.model.ReturnValue;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;

public class CartService {
    private static final int MAX_PER_ITEM = 10;
    private final DynamoDbClient dynamo = DynamoDbClient.create();

    /** Adds some of a product to a cart and returns the new quantity for that line. */
    public int addToCart(String customerId, String asin, int quantity) {
        if (quantity < 1 || quantity > MAX_PER_ITEM) throw new IllegalArgumentException("Bad quantity");
        UpdateItemRequest request = UpdateItemRequest.builder()
                .tableName("Carts")
                // One item per cart line: partition key = customer, sort key = product
                .key(Map.of(
                        "customerId", AttributeValue.fromS(customerId),
                        "asin", AttributeValue.fromS(asin)))
                // ADD creates the number if it's missing, or adds to it, in one atomic step
                .updateExpression("SET updatedAt = :now ADD #qty :q")
                // Refuse the write if it would push this line past the limit
                .conditionExpression("attribute_not_exists(#qty) OR #qty <= :room")
                .expressionAttributeNames(Map.of("#qty", "quantity"))
                .expressionAttributeValues(Map.of(
                        ":q", AttributeValue.fromN(String.valueOf(quantity)),
                        ":room", AttributeValue.fromN(String.valueOf(MAX_PER_ITEM - quantity)),
                        ":now", AttributeValue.fromS(Instant.now().toString())))
                .returnValues(ReturnValue.UPDATED_NEW)
                .build();
        try {
            return Integer.parseInt(dynamo.updateItem(request).attributes().get("quantity").n());
        } catch (ConditionalCheckFailedException e) {
            throw new IllegalArgumentException("Limit " + MAX_PER_ITEM + " per customer");
        }
    }
}`,
    },
    {
      id: 'python-item-to-item',
      title: "'Customers who bought this also bought'",
      file: 'ml/recommendations/similar_items.py',
      language: 'Python',
      explanation:
        "The core idea from Amazon's 2003 item-to-item collaborative filtering paper, shrunk to a toy. Instead of comparing you to other customers, it compares products to each other: two items are similar when many of the same people bought both. The heavy math runs offline ahead of time, so the product page only has to look up a ready-made list.",
      code: `from collections import defaultdict
from itertools import combinations
from math import sqrt

# Each customer's purchases (real data would have millions of customers)
orders = {
    "alice": {"tent", "sleeping-bag", "headlamp"},
    "bob": {"tent", "headlamp"},
    "cara": {"sleeping-bag", "camp-stove"},
    "dev": {"tent", "sleeping-bag"},
}


def build_similar_items(orders, top_n=3):
    buyers = defaultdict(set)    # product -> customers who bought it
    together = defaultdict(int)  # (product_a, product_b) -> customers who bought both
    for customer, items in orders.items():
        for item in items:
            buyers[item].add(customer)
        for a, b in combinations(sorted(items), 2):
            together[(a, b)] += 1

    similar = defaultdict(list)
    for (a, b), both in together.items():
        # Cosine similarity: bought together, scaled down for items everyone buys
        score = both / sqrt(len(buyers[a]) * len(buyers[b]))
        similar[a].append((score, b))
        similar[b].append((score, a))

    # Keep only the best matches for each product, highest score first
    return {item: [name for _, name in sorted(pairs, reverse=True)[:top_n]]
            for item, pairs in similar.items()}


similar_items = build_similar_items(orders)
print(similar_items["tent"])  # ['headlamp', 'sleeping-bag']`,
    },
    {
      id: 'ts-add-to-cart',
      title: 'The Add to Cart button on the website',
      file: 'web/detail-page/static/addToCart.ts',
      language: 'TypeScript',
      explanation:
        "The HTML for the product page already arrived from the server; this script only adds behavior. It updates the cart badge immediately (optimistic UI), sends a small JSON request, and then either trusts the server's real count or puts the old number back if something went wrong. Prices travel as whole cents to avoid floating-point rounding bugs.",
      code: `// Runs on the product page after the server has sent the finished HTML.
interface CartResponse {
  cartCount: number;
  subtotalCents: number; // money in whole cents: no 0.1 + 0.2 rounding surprises
}

const addButton = document.querySelector<HTMLButtonElement>('#add-to-cart')!;
const quantityPicker = document.querySelector<HTMLSelectElement>('#quantity')!;
const cartBadge = document.querySelector<HTMLSpanElement>('#cart-count')!;
const message = document.querySelector<HTMLParagraphElement>('#cart-message')!;

const dollars = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

addButton.addEventListener('click', async () => {
  const asin = addButton.dataset.asin!; // the product ID the server printed into the page
  const quantity = Number(quantityPicker.value);
  const previousCount = Number(cartBadge.textContent);

  cartBadge.textContent = String(previousCount + quantity); // optimistic: update right away
  addButton.disabled = true; // stop accidental double-clicks

  try {
    const res = await fetch('/api/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asin, quantity }),
    });
    if (!res.ok) throw new Error(\`Cart service replied \${res.status}\`);
    const cart: CartResponse = await res.json();
    cartBadge.textContent = String(cart.cartCount); // trust the server's real total
    message.textContent = \`Added to Cart. Subtotal: \${dollars(cart.subtotalCents)}\`;
  } catch {
    cartBadge.textContent = String(previousCount); // undo if it failed
    message.textContent = 'Sorry, that did not work. Please try again.';
  } finally {
    addButton.disabled = false;
  }
});`,
    },
    {
      id: 'sql-place-order',
      title: 'Placing an order: all or nothing',
      file: 'services/orders/db/place_order.sql',
      language: 'SQL',
      explanation:
        "Checkout must never half-happen. This PostgreSQL-style transaction (Aurora can run PostgreSQL) reserves stock only if enough is left, creates the order and its line items, and writes an 'outbox' event that another process later publishes to the message queue. If any step fails, ROLLBACK undoes everything, so you can't pay for an order that doesn't exist.",
      code: `-- Placing an order is all-or-nothing: every step below happens, or none of them do.
BEGIN;

-- 1. Reserve stock. The WHERE clause refuses to sell units we don't have.
UPDATE inventory
SET    available = available - 2
WHERE  asin = 'B0EXAMPLE1'
  AND  fulfillment_center = 'FC-SEA-1'
  AND  available >= 2;
-- The app checks the row count: 0 rows updated means ROLLBACK and "Only 1 left in stock".

-- 2. Create the order (prices are whole cents, so totals never round badly)
INSERT INTO orders (order_id, customer_id, status, subtotal_cents, placed_at)
VALUES ('114-0000001-0000001', 42, 'PLACED', 5998, now());

-- 3. Remember exactly what was bought, at the price you saw
INSERT INTO order_items (order_id, asin, quantity, unit_price_cents)
VALUES ('114-0000001-0000001', 'B0EXAMPLE1', 2, 2999);

-- 4. Write an "outbox" event in the same transaction. A separate process
--    publishes it to the queue once the order is safely saved.
INSERT INTO outbox_events (event_type, payload)
VALUES ('OrderPlaced', '{"orderId": "114-0000001-0000001", "items": 2}');

COMMIT;

-- If anything above fails, the app runs ROLLBACK instead, and nothing changes.`,
    },
    {
      id: 'kotlin-product-viewmodel',
      title: 'Quantity stepper and Add to Cart (Android)',
      file: 'android/app/src/main/java/shopping/product/ProductViewModel.kt',
      language: 'Kotlin',
      explanation:
        "The 'brain' behind an Android product screen. It keeps the quantity, subtotal and cart count in one state object that the screen redraws from. Tapping Add to Cart ignores double taps, calls the cart API inside a coroutine (a lightweight background task), and shows a friendly message if the phone is offline.",
      code: `import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import java.io.IOException
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class ProductUiState(
    val quantity: Int = 1,
    val priceCents: Long = 2999,
    val cartCount: Int = 0,
    val isAdding: Boolean = false,
    val error: String? = null,
) {
    val subtotalCents: Long get() = quantity * priceCents  // always matches the quantity
}

interface CartApi { suspend fun addItem(asin: String, quantity: Int): Int }  // returns new cart count

class ProductViewModel(private val asin: String, private val api: CartApi) : ViewModel() {
    private val _state = MutableStateFlow(ProductUiState())
    val state: StateFlow<ProductUiState> = _state  // the screen redraws whenever this changes

    fun increase() = _state.update { it.copy(quantity = (it.quantity + 1).coerceAtMost(10)) }
    fun decrease() = _state.update { it.copy(quantity = (it.quantity - 1).coerceAtLeast(1)) }  // stepper: 1 to 10

    fun addToCart() {
        if (_state.value.isAdding) return  // ignore a second tap while the first is running
        _state.update { it.copy(isAdding = true, error = null) }
        viewModelScope.launch {
            try {
                val newCount = api.addItem(asin, _state.value.quantity)
                _state.update { it.copy(cartCount = newCount) }
            } catch (e: IOException) {
                _state.update { it.copy(error = "No connection. Your cart wasn't changed.") }
            } finally { _state.update { it.copy(isAdding = false) } }
        }
    }
}`,
    },
  ],

  playground: {
    title: 'Mini Amazon product page',
    description:
      'A tiny product page with a CSS-drawn tent photo, star rating, price, delivery estimate and a quantity stepper. Tap Add to Cart to watch the cart badge and subtotal update.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mini Amazon product page</title>
<style>
:root {
  --nav: #131921; /* @tweak color "Top bar color" */
  --button: #FFD814; /* @tweak color "Add to Cart color" */
  --price: #B12704; /* @tweak color "Price color" */
  --star: #FFA41C; /* @tweak color "Star color" */
  --link: #007185; /* @tweak color "Link color" */
  --radius: 20px; /* @tweak range 0 28 "Button roundness" */
  --photo: 220px; /* @tweak range 140 320 "Photo height" */
}
* { box-sizing: border-box; }
body { margin: 0; background: #FFFFFF; color: #0F1111;
  font: 14px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
button { font: inherit; color: inherit; cursor: pointer; }

/* Top bar: logo, search box and a cart with a badge */
.nav { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--nav); color: #FFFFFF; }
.logo { margin: 0; font-size: 21px; font-weight: 700; letter-spacing: -0.5px; }
.logo::after { content: ""; display: block; height: 5px; margin: -3px 4px 0 8px;
  border-bottom: 2px solid var(--star); border-radius: 0 0 50% 50%; } /* the smile */
.search { flex: 1; padding: 7px 10px; border-radius: 8px; background: #FFFFFF; color: #6B7280; font-size: 13px; }
.cart { position: relative; font-size: 24px; }
.badge { position: absolute; top: -6px; right: -8px; min-width: 18px; padding: 0 4px; border-radius: 9px;
  background: var(--star); color: var(--nav); font-size: 12px; font-weight: 700; text-align: center; }
.badge.bump { animation: bump 0.35s; }
@keyframes bump { 50% { transform: scale(1.5); } }

/* Product details */
.page { padding: 12px 14px 24px; }
.link { color: var(--link); font-size: 13px; }
.title { margin: 4px 0 6px; font-size: 16px; font-weight: 500; }
.rating { display: flex; align-items: center; gap: 6px; font-size: 13px; }
/* 4.6 out of 5 stars = 92% of the stars filled in */
.stars { font-size: 16px; letter-spacing: 1px; color: transparent;
  background: linear-gradient(90deg, var(--star) 92%, #D5D9D9 92%);
  -webkit-background-clip: text; background-clip: text; }
.deal { display: inline-block; margin-top: 8px; padding: 3px 8px; border-radius: 4px;
  background: var(--price); color: #FFFFFF; font-size: 12px; font-weight: 700; }

/* The "photo" is pure CSS: a sky gradient, grass and a triangle tent */
.photo { position: relative; height: var(--photo); margin: 12px 0; border-radius: 8px; overflow: hidden;
  background: linear-gradient(#8EC5FC, #E0F2FE 70%, #7BC67B 70%, #4E9F3D); }
.tent { position: absolute; left: 50%; bottom: 18%; width: 58%; height: 52%; transform: translateX(-50%);
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
  background: linear-gradient(90deg, #F97316 50%, #C2410C 50%); }
.tent::after { content: ""; position: absolute; left: 38%; bottom: 0; width: 24%; height: 45%;
  clip-path: polygon(50% 0, 100% 100%, 0 100%); background: #3B2A1A; }

.price { margin: 0; font-size: 28px; color: var(--price); }
.currency { font-size: 14px; vertical-align: 10px; }
.delivery { margin: 6px 0 2px; }
.cutoff { color: #067D62; font-size: 13px; }
.stock { margin: 8px 0; color: #007600; font-size: 17px; }

/* Quantity stepper and the big button */
.stepper { display: inline-flex; align-items: center; overflow: hidden;
  border: 2px solid var(--button); border-radius: var(--radius); }
.stepper button { width: 40px; height: 34px; border: 0; background: #F0F2F2; font-size: 18px; }
.stepper button:disabled { opacity: 0.4; cursor: default; }
.qty { min-width: 36px; text-align: center; font-weight: 700; }
.add { display: block; width: 100%; margin-top: 12px; padding: 11px; border: 0;
  border-radius: var(--radius); background: var(--button); box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15); }
.add:active { filter: brightness(0.92); }
.summary { margin: 12px 0 0; padding: 10px; border-radius: 8px; background: #F7FAFA; font-size: 13px; }
.summary.flash { animation: flash 0.8s; }
@keyframes flash { from { background: #CFF2DF; } to { background: #F7FAFA; } }
</style>
</head>
<body>
  <header class="nav">
    <h1 class="logo" data-edit="store">amazon</h1>
    <div class="search">Search</div>
    <div class="cart" aria-label="Cart">🛒<span class="badge" id="badge">0</span></div>
  </header>

  <main class="page">
    <span class="link" data-edit="brand">Visit the TrailPeak Store</span>
    <h2 class="title" data-edit="title">TrailPeak 2-Person Dome Tent, Waterproof, 5-Minute Setup</h2>
    <div class="rating">
      <span>4.6</span>
      <span class="stars" aria-label="4.6 out of 5 stars">★★★★★</span>
      <span class="link">12,408 ratings</span>
    </div>
    <span class="deal" data-edit="deal">Limited time deal</span>

    <div class="photo" role="img" aria-label="Orange tent on grass"><div class="tent"></div></div>

    <p class="price"><span class="currency">$</span><span id="price" data-edit="price">29.99</span></p>
    <p class="delivery">FREE delivery <b id="eta">soon</b></p>
    <div class="cutoff" id="cutoff"></div>
    <p class="stock">In Stock</p>

    <div class="stepper">
      <button id="minus" aria-label="Decrease quantity">−</button>
      <span class="qty" id="qty">1</span>
      <button id="plus" aria-label="Increase quantity">+</button>
    </div>
    <button class="add" id="add">Add to Cart</button>
    <p class="summary" id="summary">Cart subtotal (<span id="items">0 items</span>): <b id="subtotal">$0.00</b></p>
  </main>

<script>
  const MAX_QTY = 10;
  // State: the number in the stepper, and what's already in the cart
  let qty = 1;
  let cartItems = 0;
  let cartCents = 0; // money in whole cents, so 0.1 + 0.2 rounding errors can't happen

  const $ = (id) => document.getElementById(id);

  // Read the price text (you can edit it!) and turn "29.99" into 2999 cents
  function priceCents() {
    return Math.round(parseFloat($('price').textContent.replace(/[^0-9.]/g, '')) * 100) || 0;
  }
  function money(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  // Draw the screen from the state
  function render() {
    $('qty').textContent = qty;
    $('minus').disabled = qty === 1;
    $('plus').disabled = qty === MAX_QTY;
    $('badge').textContent = cartItems;
    $('items').textContent = cartItems + (cartItems === 1 ? ' item' : ' items');
    $('subtotal').textContent = money(cartCents);
  }

  function replayAnimation(el, className) {
    el.classList.remove(className);
    void el.offsetWidth; // makes the browser notice, so the animation can play again
    el.classList.add(className);
  }

  $('minus').addEventListener('click', () => { qty = Math.max(1, qty - 1); render(); });
  $('plus').addEventListener('click', () => { qty = Math.min(MAX_QTY, qty + 1); render(); });

  // Add to Cart: add the chosen quantity to the cart and update badge + subtotal
  $('add').addEventListener('click', () => {
    cartItems += qty;
    cartCents += qty * priceCents();
    render();
    replayAnimation($('badge'), 'bump');
    replayAnimation($('summary'), 'flash');
  });

  // Delivery estimate: two days from today, plus a countdown to midnight
  const eta = new Date();
  eta.setDate(eta.getDate() + 2);
  $('eta').textContent = eta.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const now = new Date();
  const minsLeft = 24 * 60 - (now.getHours() * 60 + now.getMinutes());
  $('cutoff').textContent = 'Order within ' + Math.floor(minsLeft / 60) + ' hrs ' + (minsLeft % 60) + ' mins';

  render();
</script>
</body>
</html>`,
    challenges: [
      'Set --button to #FFA41C and drag Button roundness to 0px: the Add to Cart button becomes an orange rectangle and the quantity stepper gets a square orange border.',
      'Edit the price to 49.99, set the quantity to 3 and tap Add to Cart. The subtotal should read $149.97, because the script reads the price text every time you tap.',
      'In the script, change MAX_QTY from 10 to 3 and watch the + button switch off as soon as you reach 3.',
      "Find getDate() + 2 and change it to + 1 to promise faster delivery, then set --nav to #232F3E for Amazon's lighter navy.",
    ],
  },

  concepts: [
    {
      term: 'Service-oriented architecture',
      meaning:
        'Building one big product out of many small, independent programs (services) that each do one job and talk to each other through APIs.',
    },
    {
      term: 'API',
      meaning:
        "A published 'menu' of requests a program accepts, like 'add item to cart', so other programs can use it without knowing how it works inside.",
    },
    {
      term: 'Two-pizza team',
      meaning:
        "Amazon's rule of thumb that a team should be small enough to feed with two pizzas, so it can move fast and fully own its service.",
    },
    {
      term: 'Key-value store',
      meaning:
        'A database that saves and finds each piece of data by a unique key, like looking up a word in a dictionary, which makes simple lookups extremely fast.',
    },
    {
      term: 'Eventual consistency',
      meaning:
        'A trade-off where copies of data on different machines can briefly disagree after a change but always catch up, which lets a system keep accepting writes when some machines are unreachable.',
    },
    {
      term: 'Item-to-item collaborative filtering',
      meaning:
        "A recommendation method that calls two products similar when many of the same people bought both, then suggests items similar to the one you're looking at.",
    },
    {
      term: 'Database transaction',
      meaning:
        'A group of database changes that succeed or fail together, so an order is never saved without its items or stock is never taken without an order.',
    },
    {
      term: 'Message queue',
      meaning:
        'A waiting line of messages between programs, so one service can announce something (like a new order) and others can handle it later at their own pace.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Model your store',
      detail:
        'Plan four tables, products, cart_items, orders and order_items, in SQLite or a free Supabase (PostgreSQL) database. Store prices as whole cents so totals never round wrongly.',
    },
    {
      step: 'Build a small API',
      detail:
        'Use Express (JavaScript) or Spring Boot (Java, like much of Amazon) to make endpoints such as GET /products/:id, POST /cart/items and POST /orders.',
    },
    {
      step: 'Make the product page',
      detail:
        'Start from this playground or build a screen in Expo (React Native) with a photo, star rating, price, quantity stepper, and an Add to Cart button that updates a cart badge.',
    },
    {
      step: 'Check out safely',
      detail:
        "Wrap 'reduce stock + create order + add items' in one database transaction, and use Stripe in test mode for payments so you never handle real card numbers yourself.",
    },
    {
      step: "Add 'customers also bought'",
      detail:
        'Run a Python script like the one in the Code tab over your orders table once a night and save the results in a similar_items table your product page can read.',
    },
    {
      step: 'Put it online',
      detail:
        'Store product photos in Amazon S3 or Cloudinary, and deploy your API on the AWS Free Tier or a beginner-friendly host like Render.',
    },
  ],

  sources: [
    { label: 'Wikipedia: Amazon (company)', url: 'https://en.wikipedia.org/wiki/Amazon_(company)' },
    { label: 'About Amazon (official company site)', url: 'https://www.aboutamazon.com' },
    { label: 'All Things Distributed (blog by Amazon CTO Werner Vogels)', url: 'https://www.allthingsdistributed.com' },
    { label: "The Amazon Builders' Library", url: 'https://aws.amazon.com/builders-library/' },
    { label: 'Amazon Science', url: 'https://www.amazon.science' },
  ],
};
