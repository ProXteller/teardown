import type { ArchetypeTemplate } from '../types';

export const archetype: ArchetypeTemplate = {
  id: 'commerce',
  label: 'Online store',

  keywords: [
    'shop',
    'store',
    'cart',
    'checkout',
    'free shipping',
    'shipping',
    'buy',
    'buy now',
    'shop now',
    'add to cart',
    'sale',
    'deals',
    'discount',
    'coupon',
    'promo code',
    'best sellers',
    'new arrivals',
    'clearance',
    'outlet',
    'retail',
    'retailer',
    'shopping',
    'products',
    'clothing',
    'apparel',
    'fashion',
    'shoes',
    'electronics',
    'furniture',
    'beauty',
    'grocery',
    'boutique',
    'handmade',
    'gifts',
    'free returns',
    'in stock',
    'wholesale',
  ],

  tagline: '{{name}} is an online store where you can browse products, add them to a cart and have them delivered to your door.',

  eli5:
    "{{name}} works like a giant shop with a very organized stockroom. When you search, a special search engine instantly finds matching products, and when you add something to your cart the store remembers it and works out the price, shipping and tax. When you pay, the store double-checks there is still stock, asks a payment company to charge your card, and then tells the warehouse to pack and ship your order.",

  languages: [
    { name: 'TypeScript / JavaScript', usedFor: 'Storefront pages, the cart service and the checkout screens', share: 30 },
    { name: 'Java', usedFor: 'Order, inventory and payment services that must never lose an order', share: 25 },
    { name: 'SQL', usedFor: 'Products, stock levels, orders and sales reports', share: 15 },
    { name: 'Python', usedFor: 'Recommendations, demand forecasting and data pipelines', share: 15 },
    { name: 'Swift & Kotlin', usedFor: 'The iPhone and Android shopping apps', share: 15 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'Server-side rendering (SSR)',
          role: 'Fast, searchable product pages',
          beginnerNote:
            'The server builds the finished HTML for each product page before sending it, so the page shows up quickly and Google can read it. That matters because many shoppers arrive from search results.',
        },
        {
          name: 'Responsive images',
          role: 'Product photos sized for each screen',
          beginnerNote:
            'The same photo is saved in several sizes, and the browser picks the smallest one that still looks sharp. A phone never downloads a huge desktop image it does not need.',
        },
        {
          name: 'Payment provider card fields',
          role: 'Secure card entry',
          beginnerNote:
            "The card number box on the checkout page actually belongs to the payment company (for example Stripe or Adyen). It turns your card into a harmless token, so the store's own servers never see the real number.",
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Java & Spring Boot',
          role: 'Orders, inventory and payments',
          beginnerNote:
            'A mature, strongly typed language that big retailers trust for code where mistakes cost money, like "charge the card exactly once and never sell the same last item twice".',
        },
        {
          name: 'Node.js',
          role: 'API gateway and cart service',
          beginnerNote:
            'JavaScript running on the server. It is good at handling lots of small, quick requests at once, like updating a cart every time someone taps "Add to cart".',
        },
        {
          name: 'Microservices',
          role: 'Separate search, cart and order services',
          beginnerNote:
            'Instead of one giant program, the store is split into smaller programs that each do one job. On a huge sale day, the busy search service can get extra servers without touching checkout.',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'PostgreSQL',
          role: 'Products, stock and orders',
          beginnerNote:
            'A reliable relational database. Its transactions make sure an order and its stock change are saved together, or not at all, even if a server crashes halfway through.',
        },
        {
          name: 'Redis',
          role: 'Carts and caching',
          beginnerNote:
            'A super-fast database that keeps data in memory. Carts change constantly, so keeping them in Redis makes every "Add to cart" feel instant.',
        },
        {
          name: 'Elasticsearch',
          role: 'Product search and filters',
          beginnerNote:
            'A search engine that finds products even when you misspell them and counts results for filters like "Size M (42)" or "Under $50 (17)" in milliseconds.',
        },
        {
          name: 'Apache Kafka',
          role: 'Order events',
          beginnerNote:
            'A durable message log. When an order is placed, one "OrderPlaced" message lets the warehouse, email and analytics systems each react in their own time.',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Amazon S3',
          role: 'Product photo storage',
          beginnerNote:
            'Cloud storage for files. Millions of product photos live here safely, and the CDN copies them to servers close to shoppers.',
        },
        {
          name: 'Kubernetes',
          role: 'Runs and scales the services',
          beginnerNote:
            'Kubernetes starts more copies of a service when traffic jumps, like opening extra checkout lanes on Black Friday, and closes them again when it gets quiet.',
        },
        {
          name: 'Content delivery network (CDN)',
          role: 'Serves pages and images near shoppers',
          beginnerNote:
            'Copies of images and pages are kept on servers around the world, so a shopper in Tokyo does not wait for a photo to travel from Virginia.',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: '"Customers also bought" models',
          role: 'Product recommendations',
          beginnerNote:
            'Python jobs look at millions of past orders to find products that are often bought together, then suggest them on product and cart pages.',
        },
        {
          name: 'Fraud scoring',
          role: 'Spotting stolen cards',
          beginnerNote:
            'Before charging a card, a model scores the order for warning signs, like a brand-new account shipping ten phones to a different country, and holds risky ones for review.',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'web',
        label: 'Web Storefront',
        kind: 'client',
        tier: 0,
        tech: '{{frontend}} in the browser',
        description:
          'The {{name}} website: product pages, search, cart and checkout. Product pages are often pre-built on the server so they load fast and show up well in Google.',
      },
      {
        id: 'mobile',
        label: 'Shopping App',
        kind: 'client',
        tier: 0,
        tech: 'Swift (iOS) · Kotlin (Android)',
        description:
          'The phone app talks to the same backend as the website. It adds extras like push notifications for "your order has shipped" and quick re-ordering.',
      },
      {
        id: 'cdn',
        label: 'CDN & Edge',
        kind: 'edge',
        tier: 1,
        tech: '{{hosting}}',
        description:
          'The front door for every request. It serves cached pages and product photos from a server near you, blocks obvious attacks, and forwards everything else to the API.',
      },
      {
        id: 'payments',
        label: 'Payment Provider',
        kind: 'external',
        tier: 1,
        tech: 'Stripe · Adyen · PayPal',
        description:
          'An outside company that actually moves the money. Your card details go straight to them from the checkout page, and the store only ever handles a token that stands in for your card.',
      },
      {
        id: 'api',
        label: 'API Gateway',
        kind: 'gateway',
        tier: 2,
        tech: 'Node.js gateway',
        description:
          'Checks who you are (logged in or a guest), limits how fast one visitor can send requests, and routes each call to the right service.',
      },
      {
        id: 'carriers',
        label: 'Warehouse & Carriers',
        kind: 'external',
        tier: 2,
        tech: 'Warehouse system + UPS / FedEx / DHL APIs',
        description:
          'The real-world side of the store. A warehouse system tells workers what to pick and pack, and shipping companies provide labels and tracking numbers.',
      },
      {
        id: 'search',
        label: 'Search & Catalog',
        kind: 'service',
        tier: 3,
        tech: 'Java service',
        description:
          'Turns "blue running shoes size 9" into a ranked list of products with filters. It also keeps the search index up to date when prices or stock change.',
      },
      {
        id: 'cart',
        label: 'Cart & Pricing',
        kind: 'service',
        tier: 3,
        tech: 'Node.js service',
        description:
          'Remembers what is in your cart and calculates the total: item prices, coupon codes, shipping and tax. The browser never decides the price; this service does.',
      },
      {
        id: 'orders',
        label: 'Checkout & Orders',
        kind: 'service',
        tier: 3,
        tech: 'Java / Spring Boot service',
        description:
          'Runs checkout step by step: reserve stock, charge the card, save the order and announce it. It is the most carefully tested code in the store because mistakes cost real money.',
      },
      {
        id: 'events',
        label: 'Order Events',
        kind: 'queue',
        tier: 3,
        tech: 'Apache Kafka',
        description:
          'A durable stream of messages like "order 1234 was placed". The warehouse, email and search systems each read it at their own pace, so a slow system never blocks checkout.',
      },
      {
        id: 'db',
        label: 'Store Database',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL',
        description:
          'The source of truth for products, prices, stock levels and orders. Transactions guarantee an order and its stock change are saved together.',
      },
      {
        id: 'redis',
        label: 'Cart Cache',
        kind: 'cache',
        tier: 4,
        tech: 'Redis',
        description:
          'Keeps active carts and popular data in memory so reads and writes take well under a millisecond. Old abandoned carts expire automatically.',
      },
      {
        id: 'search-index',
        label: 'Search Index',
        kind: 'database',
        tier: 4,
        tech: 'Elasticsearch',
        description:
          'A copy of the catalog shaped for searching, like the index at the back of a book. It stores names, prices and thumbnails together so results need no extra lookups.',
      },
      {
        id: 'images',
        label: 'Product Photos',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3',
        description:
          'The original product photos. The CDN fetches each photo once, resizes and caches it, then serves it to everyone nearby.',
      },
    ],
    edges: [
      { from: 'web', to: 'cdn', label: 'HTTPS pages & images' },
      { from: 'mobile', to: 'cdn', label: 'HTTPS API calls' },
      { from: 'web', to: 'payments', label: 'Card details → token' },
      { from: 'cdn', to: 'api', label: 'Forward API requests' },
      { from: 'cdn', to: 'images', label: 'Fetch photo on cache miss' },
      { from: 'api', to: 'search', label: 'Search & filters' },
      { from: 'api', to: 'cart', label: 'Cart updates' },
      { from: 'api', to: 'orders', label: 'Place order' },
      { from: 'search', to: 'search-index', label: 'Full-text query' },
      { from: 'db', to: 'search-index', label: 'Catalog sync' },
      { from: 'cart', to: 'redis', label: 'Read / write cart' },
      { from: 'cart', to: 'db', label: 'Prices & promotions' },
      { from: 'orders', to: 'cart', label: 'Final price' },
      { from: 'orders', to: 'db', label: 'Reserve stock, save order' },
      { from: 'orders', to: 'payments', label: 'Charge token' },
      { from: 'orders', to: 'events', label: 'OrderPlaced event' },
      { from: 'events', to: 'carriers', label: 'Pick, pack & ship' },
      { from: 'events', to: 'search', label: 'Stock changes' },
    ],
    flows: [
      {
        id: 'search-products',
        title: 'You search for running shoes',
        emoji: '🔍',
        steps: [
          {
            from: 'web',
            to: 'cdn',
            narration:
              'You type "running shoes" and press Enter. The browser sends the search to the nearest edge server over HTTPS.',
          },
          {
            from: 'cdn',
            to: 'api',
            narration:
              'Search results depend on what you typed, so the edge cannot answer from its cache. It forwards the request to the API gateway.',
          },
          {
            from: 'api',
            to: 'search',
            narration: 'The gateway sees this is a search and passes it, plus any filters like size or price, to the Search service.',
          },
          {
            from: 'search',
            to: 'search-index',
            narration:
              'Elasticsearch finds matching products (even "runing shoes" with a typo), ranks them by relevance and popularity, and counts results for each filter.',
          },
          {
            from: 'cdn',
            to: 'web',
            narration:
              'The ranked list travels back through the gateway and edge as JSON, and {{frontend}} draws the product grid.',
          },
          {
            from: 'cdn',
            to: 'images',
            narration:
              'Your browser now asks for the thumbnails. Most are already cached at the edge; any that are missing are fetched once from S3 and kept for the next shopper.',
          },
        ],
      },
      {
        id: 'add-to-cart',
        title: 'You add an item to your cart',
        emoji: '🛒',
        steps: [
          {
            from: 'mobile',
            to: 'cdn',
            narration: 'You pick size M and tap "Add to cart". The app sends the product variant and quantity to {{name}}.',
          },
          {
            from: 'cdn',
            to: 'api',
            narration: 'The edge forwards the request, and the gateway works out which cart is yours from your login or guest cookie.',
          },
          {
            from: 'api',
            to: 'cart',
            narration: 'The gateway hands the request to the Cart service.',
          },
          {
            from: 'cart',
            to: 'db',
            narration:
              'Cart looks up the current price and any active promotions in the database. It never trusts a price sent by the app, because anyone could edit that.',
          },
          {
            from: 'cart',
            to: 'redis',
            narration: 'The updated cart is saved in Redis, so it is still there if you close the app and come back tomorrow.',
          },
          {
            from: 'cdn',
            to: 'mobile',
            narration:
              'The new subtotal and "You are $12 away from free shipping" travel back to your phone, and the cart badge ticks up.',
          },
        ],
      },
      {
        id: 'checkout',
        title: 'You check out and pay',
        emoji: '💳',
        steps: [
          {
            from: 'web',
            to: 'payments',
            narration:
              "You type your card number into a box that belongs to the payment provider. It sends the card straight to them and gets back a token, so {{name}}'s servers never see the real number.",
          },
          {
            from: 'api',
            to: 'orders',
            narration:
              'You tap "Place order". The request, carrying the token, passes through the edge and gateway to the Checkout service.',
          },
          {
            from: 'orders',
            to: 'cart',
            narration: 'Checkout asks Cart for the final price of everything in your cart, including shipping, tax and your coupon.',
          },
          {
            from: 'orders',
            to: 'db',
            narration:
              'In one database transaction it creates a "pending" order and reserves the stock. If someone just bought the last pair, this fails and you see "sold out" instead of being charged.',
          },
          {
            from: 'orders',
            to: 'payments',
            narration:
              'Checkout asks the payment provider to charge the token. An idempotency key makes sure a retry after a network hiccup can never charge you twice.',
          },
          {
            from: 'orders',
            to: 'events',
            narration: 'The order is marked paid and an "OrderPlaced" event is published to Kafka. You see the confirmation page.',
          },
          {
            from: 'events',
            to: 'carriers',
            narration:
              'The warehouse system reads the event, a worker picks and packs your item, and a carrier label with a tracking number is printed.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'services/search/src/main/java/com/example/search/ProductSearchService.java', note: 'Builds the Elasticsearch query with filters and facets' },
    { path: 'services/search/src/main/java/com/example/search/ProductIndexer.java', note: 'Updates the search index when prices or stock change' },
    { path: 'services/search/mappings/products.json', note: 'Tells Elasticsearch which product fields are text, numbers or keywords' },
    { path: 'services/cart/src/routes/cart.ts', note: 'Add, remove and update-quantity endpoints' },
    { path: 'services/cart/src/pricing/priceCart.ts', note: 'Works out subtotal, coupons, shipping and tax' },
    { path: 'services/cart/src/store/redisCart.ts', note: 'Saves carts in Redis with an expiry time' },
    { path: 'services/orders/src/main/java/com/example/orders/CheckoutController.java', note: 'The "Place order" endpoint' },
    { path: 'services/orders/src/main/java/com/example/orders/PaymentClient.java', note: 'Talks to the payment provider using idempotency keys' },
    { path: 'services/orders/src/main/java/com/example/orders/PaymentWebhookController.java', note: 'Receives "payment succeeded / refunded" messages from the provider' },
    { path: 'services/orders/src/main/java/com/example/orders/OrderEventsPublisher.java', note: 'Publishes OrderPlaced events to Kafka' },
    { path: 'services/orders/src/main/resources/db/migration/V1__catalog_and_orders.sql', note: 'Database tables for products, variants and orders' },
    { path: 'integrations/warehouse/order_placed_consumer.py', note: 'Reads new orders from Kafka and sends them to the warehouse' },
    { path: 'ml/recommendations/also_bought.py', note: '"Customers also bought" job run every night' },
    { path: 'infra/k8s/cart-deployment.yaml', note: 'How many copies of the cart service to run and when to add more' },
    { path: 'infra/terraform/product-images-bucket.tf', note: 'Creates the S3 bucket that stores product photos' },
  ],

  code: [
    {
      id: 'cart-pricing',
      title: 'Pricing a cart (coupons, shipping, tax)',
      file: 'services/cart/src/pricing/priceCart.ts',
      language: 'TypeScript',
      explanation:
        'Stores keep money as whole numbers of cents, because computers store decimals like 0.1 slightly inaccurately and those tiny errors add up. This function totals the items, applies a coupon (never below zero), adds shipping unless the order qualifies for free shipping, and adds tax. It runs on the server every time the cart changes, so a shopper cannot edit the price in their browser. Real tax rules depend on location and product type and usually come from a tax service.',
      code: `// All money is in cents (whole numbers). In JavaScript, 0.1 + 0.2 !== 0.3!
export type CartLine = { sku: string; unitPriceCents: number; quantity: number };
export type Promo = { code: string; percentOff?: number; amountOffCents?: number; minSubtotalCents?: number };

const FREE_SHIPPING_FROM_CENTS = 5000; // free shipping on $50+
const FLAT_SHIPPING_CENTS = 599;

export function priceCart(lines: CartLine[], taxRate: number, promo?: Promo) {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);

  let discount = 0;
  if (promo && subtotal >= (promo.minSubtotalCents ?? 0)) {
    if (promo.percentOff) discount = Math.round((subtotal * promo.percentOff) / 100);
    if (promo.amountOffCents) discount = Math.max(discount, promo.amountOffCents); // give the better deal
    discount = Math.min(discount, subtotal); // a coupon can never make the price negative
  }

  const afterDiscount = subtotal - discount;
  const shipping = lines.length === 0 || afterDiscount >= FREE_SHIPPING_FROM_CENTS ? 0 : FLAT_SHIPPING_CENTS;
  const tax = Math.round(afterDiscount * taxRate); // simplified: real tax rules vary by place

  return { subtotal, discount, shipping, tax, total: afterDiscount + shipping + tax };
}

// Two pairs of $19.99 socks, 8.25% sales tax, and a 10%-off welcome code:
const receipt = priceCart(
  [{ sku: 'SOCK-BLUE-M', unitPriceCents: 1999, quantity: 2 }],
  0.0825,
  { code: 'WELCOME10', percentOff: 10 },
);
console.log(receipt);
// { subtotal: 3998, discount: 400, shipping: 599, tax: 297, total: 4494 }  -> $44.94`,
    },
    {
      id: 'catalog-schema',
      title: 'Products, stock and orders',
      file: 'services/orders/src/main/resources/db/migration/V1__catalog_and_orders.sql',
      language: 'SQL (PostgreSQL)',
      explanation:
        'A product like "Trail Runner" comes in variants (blue size 9, red size 10), and each variant has its own SKU, price and stock count. Orders copy the price at the moment of purchase, because prices change later. The CHECK rules stop impossible data like negative stock. The final UPDATE shows the classic trick for not overselling: it only removes stock if enough is left, so when two people grab the last item at the same moment, exactly one succeeds.',
      code: `-- A product ("Trail Runner") has variants ("blue, size 9"), each with its own stock.
CREATE TABLE products (
  id          BIGSERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,             -- used in URLs like /p/trail-runner
  title       TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE variants (
  id          BIGSERIAL PRIMARY KEY,
  product_id  BIGINT NOT NULL REFERENCES products(id),
  sku         TEXT UNIQUE NOT NULL,             -- the warehouse's code for this exact item
  options     JSONB NOT NULL,                   -- e.g. {"color": "blue", "size": "9"}
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock       INTEGER NOT NULL CHECK (stock >= 0)
);

CREATE TABLE orders (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
  total_cents INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  order_id         BIGINT NOT NULL REFERENCES orders(id),
  variant_id       BIGINT NOT NULL REFERENCES variants(id),
  quantity         INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL,            -- copied at checkout; prices change later
  PRIMARY KEY (order_id, variant_id)
);

-- Reserve 2 units at checkout. If fewer than 2 are left, 0 rows change = "sold out".
UPDATE variants SET stock = stock - 2
WHERE id = 42 AND stock >= 2;`,
    },
    {
      id: 'checkout-endpoint',
      title: 'The "Place order" endpoint',
      file: 'services/orders/src/main/java/com/example/orders/CheckoutController.java',
      language: 'Java',
      explanation:
        'Checkout happens in careful steps. First the server re-prices the cart itself. Then one database transaction creates a pending order and reserves stock. Only then is the card charged, using an idempotency key so a retried request can never charge twice. If the payment is declined, the stock is released. Finally an event tells the warehouse and email systems about the order. The payment call is kept outside the database transaction so a slow bank never locks up the stock table.',
      code: `import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/checkout")
public class CheckoutController {
    private final CartService carts;
    private final OrderService orders;
    private final PaymentClient payments;
    private final OrderEvents events;
    // (constructor that receives these four services omitted)

    // The browser sends a payment TOKEN from the provider, never the raw card number.
    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestHeader("X-User-Id") long userId,
                                        @RequestBody CheckoutRequest req) {
        Cart cart = carts.load(req.cartId(), userId);
        PriceBreakdown price = carts.price(cart); // re-price on the server: never trust the browser

        Order order;
        try {
            // One DB transaction: create a "pending" order and reserve stock for every line.
            order = orders.createPendingAndReserveStock(userId, cart, price);
        } catch (OutOfStockException e) {
            return ResponseEntity.status(409).body(e.itemName() + " just sold out");
        }

        // Same idempotency key on a retry = the provider charges the card only once.
        PaymentResult result = payments.charge(req.paymentToken(), price.totalCents(), "order-" + order.id());
        if (!result.succeeded()) {
            orders.cancelAndReleaseStock(order.id());
            return ResponseEntity.status(402).body("Payment declined: " + result.declineReason());
        }
        orders.markPaid(order.id(), result.paymentId());
        events.publishOrderPlaced(order.id()); // warehouse, emails and analytics react to this
        return ResponseEntity.ok(new CheckoutResponse(order.id(), price.totalCents()));
    }
}
record CheckoutRequest(String cartId, String paymentToken) {}
record CheckoutResponse(long orderId, long totalCents) {}`,
    },
  ],

  playground: {
    title: 'Product page & cart',
    description:
      'A mini {{name}} product page: pick a color and size (sold-out sizes are crossed out), add pairs to your cart, and watch the badge, subtotal and free-shipping meter update.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Product page</title>
<style>
:root {
  --brand: {{brand}}; /* @tweak color "Brand color" */
  --accent: {{accent}}; /* @tweak color "Sale badge" */
  --bg: #f4f4f6; /* @tweak color "Background" */
  --radius: 12px; /* @tweak range 0 28 "Corner radius" */
  --photo: 220px; /* @tweak range 140 300 "Photo height" */
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: #1b1b1f; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.promo { background: var(--brand); color: #fff; text-align: center; font-size: 12px; padding: 6px; }
header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #fff; }
.logo { font-weight: 800; font-size: 18px; color: var(--brand); }
.bag { position: relative; font-size: 22px; background: none; border: 0; cursor: pointer; }
.badge { position: absolute; top: -4px; right: -8px; background: var(--accent); color: #fff; font-size: 11px; min-width: 18px; height: 18px; border-radius: 9px; display: grid; place-items: center; }
main { padding: 16px; }
.photo { position: relative; height: var(--photo); border-radius: var(--radius); display: grid; place-items: center; font-size: 96px; transition: background .3s; }
.sale { position: absolute; top: 10px; left: 10px; background: var(--accent); color: #fff; font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: calc(var(--radius) / 2); }
h1 { font-size: 20px; margin: 14px 0 4px; }
.stars { color: #f5a623; font-size: 13px; }
.stars span { color: #666; }
.price { font-size: 22px; font-weight: 800; margin: 8px 0; }
.price s { color: #888; font-weight: 400; font-size: 15px; margin-left: 6px; }
.label { font-size: 13px; font-weight: 600; margin: 12px 0 6px; }
.chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip { border: 2px solid #d5d5da; background: #fff; border-radius: var(--radius); padding: 8px 12px; font-size: 14px; cursor: pointer; }
.chip.on { border-color: var(--brand); }
.chip:disabled { opacity: .35; text-decoration: line-through; cursor: not-allowed; }
.swatch { width: 36px; height: 36px; padding: 0; border-radius: 50%; }
.stock { font-size: 12px; color: #b54708; margin-top: 8px; min-height: 16px; }
.add { width: 100%; margin-top: 10px; padding: 14px; border: 0; border-radius: var(--radius); background: var(--brand); color: #fff; font-size: 16px; font-weight: 700; cursor: pointer; }
.add:active { transform: scale(.98); }
.cart { margin-top: 16px; background: #fff; border-radius: var(--radius); padding: 12px 14px; }
.row { display: flex; justify-content: space-between; font-size: 14px; }
.cart ul { list-style: none; margin: 8px 0 0; padding: 0; }
.cart li { display: flex; justify-content: space-between; align-items: center; font-size: 13px; padding: 6px 0; border-top: 1px solid #eee; }
.cart li button { border: 0; background: none; color: #999; cursor: pointer; }
.meter { height: 6px; background: #e5e5ea; border-radius: 3px; overflow: hidden; margin: 10px 0 4px; }
.meter div { height: 100%; width: 0; background: var(--brand); transition: width .3s; }
.note { font-size: 12px; color: #666; margin: 4px 0 10px; }
</style>
</head>
<body>
<div class="promo" data-edit="promo">Free shipping on orders over $50</div>
<header>
  <span class="logo" data-edit="store">{{name}}</span>
  <button class="bag" id="bag" aria-label="Cart">🛍️<span class="badge" id="count">0</span></button>
</header>
<main>
  <div class="photo" id="photo"><span class="sale">-20%</span>👟</div>
  <h1 data-edit="product">Trail Runner Sneakers</h1>
  <div class="stars">★★★★☆ <span>4.6 (1,284 reviews)</span></div>
  <div class="price" id="price"></div>
  <div class="label">Color: <span id="colorName"></span></div>
  <div class="chips" id="colors"></div>
  <div class="label">Size</div>
  <div class="chips" id="sizes"></div>
  <div class="stock" id="stock"></div>
  <button class="add" id="add" data-edit="cta">Add to cart</button>

  <section class="cart" id="cart">
    <div class="row"><b data-edit="cartTitle">Your cart</b><span id="items">Empty</span></div>
    <ul id="lines"></ul>
    <div class="meter"><div id="meter"></div></div>
    <div class="note" id="shipNote"></div>
    <div class="row"><span>Subtotal</span><b id="subtotal">$0.00</b></div>
  </section>
  <p class="note" data-edit="returns">Free 30-day returns on every order</p>
</main>

<script>
// Money is kept in cents (whole numbers), just like real stores do
const PRICE = 3999, WAS = 4999, FREE_SHIPPING = 5000;
const colors = [
  { name: 'Ocean', look: 'linear-gradient(135deg, #2193b0, #6dd5ed)' },
  { name: 'Sunset', look: 'linear-gradient(135deg, #ff7e5f, #feb47b)' },
  { name: 'Forest', look: 'linear-gradient(135deg, #134e5e, #71b280)' }
];
const sizes = ['7', '8', '9', '10', '11'];
// Each color + size combo is a "variant" (a SKU) with its own stock count
const stock = {
  Ocean: { '7': 4, '8': 0, '9': 2, '10': 7, '11': 1 },
  Sunset: { '7': 0, '8': 3, '9': 5, '10': 0, '11': 2 },
  Forest: { '7': 6, '8': 1, '9': 0, '10': 3, '11': 0 }
};

let color = 'Ocean';
let size = null;
const cart = []; // lines like { color: 'Ocean', size: '9', qty: 1 }
const $ = (id) => document.getElementById(id);
const money = (cents) => '$' + (cents / 100).toFixed(2);

// How many are still available after what is already in the cart?
function available(c, s) {
  const line = cart.find((l) => l.color === c && l.size === s);
  return stock[c][s] - (line ? line.qty : 0);
}

function button(className, onClick) {
  const b = document.createElement('button');
  b.className = className;
  b.onclick = onClick;
  return b;
}

function render() {
  $('price').innerHTML = money(PRICE) + '<s>' + money(WAS) + '</s>';
  $('colorName').textContent = color;
  $('photo').style.background = colors.find((c) => c.name === color).look;

  $('colors').innerHTML = '';
  colors.forEach((c) => {
    const b = button('chip swatch' + (c.name === color ? ' on' : ''), () => { color = c.name; size = null; render(); });
    b.style.background = c.look;
    b.setAttribute('aria-label', c.name);
    $('colors').appendChild(b);
  });

  $('sizes').innerHTML = '';
  sizes.forEach((s) => {
    const b = button('chip' + (s === size ? ' on' : ''), () => { size = s; render(); });
    b.textContent = s;
    b.disabled = stock[color][s] === 0; // sold out: can't be picked
    $('sizes').appendChild(b);
  });

  const left = size ? available(color, size) : 0;
  $('stock').textContent = !size ? 'Pick a size' : left === 0 ? 'All remaining pairs are in your cart' : left <= 2 ? 'Only ' + left + ' left!' : 'In stock';

  // Cart summary
  const count = cart.reduce((n, l) => n + l.qty, 0);
  const subtotal = count * PRICE;
  $('count').textContent = count;
  $('items').textContent = count ? count + (count > 1 ? ' items' : ' item') : 'Empty';
  $('lines').innerHTML = '';
  cart.forEach((l, i) => {
    const li = document.createElement('li');
    li.textContent = l.qty + ' × ' + l.color + ', size ' + l.size;
    li.appendChild(button('', () => { cart.splice(i, 1); render(); })).textContent = '✕';
    $('lines').appendChild(li);
  });
  $('meter').style.width = Math.min(100, (subtotal / FREE_SHIPPING) * 100) + '%';
  $('shipNote').textContent = subtotal >= FREE_SHIPPING ? 'You unlocked free shipping 🎉' : money(FREE_SHIPPING - subtotal) + ' away from free shipping';
  $('subtotal').textContent = money(subtotal);
}

$('add').onclick = () => {
  if (!size) { $('stock').textContent = 'Please pick a size first'; return; }
  if (available(color, size) === 0) return;
  const line = cart.find((l) => l.color === color && l.size === size);
  if (line) line.qty++; else cart.push({ color: color, size: size, qty: 1 });
  $('bag').animate([{ transform: 'scale(1.35)' }, { transform: 'scale(1)' }], 250);
  render();
};
$('bag').onclick = () => $('cart').scrollIntoView({ behavior: 'smooth' });

render();
</script>
</body>
</html>`,
    challenges: [
      'Change the "Brand color" and "Corner radius" tweaks and watch the banner, buttons and free-shipping meter restyle.',
      'Add a fourth color to the colors array, with its own gradient and a stock entry for every size.',
      'Raise FREE_SHIPPING to 10000 ($100) and see how many pairs it now takes to fill the meter.',
      'Add a promo code box: when someone types SAVE10, take 10% off the subtotal, doing the math in cents with Math.round.',
    ],
  },

  concepts: [
    {
      term: 'SKU & product variants',
      meaning:
        'A product like a T-shirt comes in many variants (red M, blue L). Each variant gets its own SKU (stock keeping unit), a code with its own price and stock count.',
    },
    {
      term: 'Money in cents',
      meaning:
        'Prices are stored as whole numbers of cents (1999, not 19.99) because computers store decimals slightly inaccurately, and tiny rounding errors add up across millions of orders.',
    },
    {
      term: 'Search index & facets',
      meaning:
        'A search index is a copy of the catalog organized for fast lookups. Facets are the filter counts next to search results, like "Size 9 (42)" or "Under $50 (17)".',
    },
    {
      term: 'Overselling (race condition)',
      meaning:
        'When two shoppers buy the last item at the same instant, careless code sells it twice. Stores prevent this by only decreasing stock when enough is left, inside a database transaction.',
    },
    {
      term: 'Payment tokenization',
      meaning:
        "Your card number goes straight to the payment provider, which hands back a token that stands in for the card. The store charges the token, so a hack of the store's servers does not leak card numbers.",
    },
    {
      term: 'Idempotency key',
      meaning:
        'A unique ID sent with a request, like "order-1234". If the same request is retried after a timeout, the server recognises the ID and does not do the work (or charge the card) a second time.',
    },
    {
      term: 'Event-driven order pipeline',
      meaning:
        'After checkout, the store publishes one "OrderPlaced" message. The warehouse, email, analytics and search systems each listen and react independently, so checkout stays fast.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Design your catalog',
      detail:
        'Create products and variants tables in SQLite or PostgreSQL (try a free Supabase project) and add 20 products with prices in cents and stock counts.',
    },
    {
      step: 'Build the product pages',
      detail:
        'Make a product grid and a product page with Next.js, or plain HTML and JavaScript that fetches from a /products endpoint on a small Express or Flask server.',
    },
    {
      step: 'Add a cart',
      detail:
        'Start by saving the cart in localStorage, then move it to the server. Always recalculate totals on the server instead of trusting prices sent from the browser.',
    },
    {
      step: 'Take test payments',
      detail:
        'Use Stripe in test mode with Stripe Checkout, pay with the test card 4242 4242 4242 4242, and mark orders as paid when Stripe sends your webhook.',
    },
    {
      step: 'Add search and filters',
      detail:
        "Begin with PostgreSQL's built-in full-text search. When you want typo tolerance and facets, try Meilisearch or Elasticsearch.",
    },
    {
      step: 'Handle orders and deploy',
      detail:
        'Reduce stock safely at checkout, send a confirmation email with a service like Resend, build a "My orders" page, and deploy the site to Vercel or Render.',
    },
  ],
};
