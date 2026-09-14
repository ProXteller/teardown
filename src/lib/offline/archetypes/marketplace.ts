import type { ArchetypeTemplate } from '../types';

export const archetype: ArchetypeTemplate = {
  id: 'marketplace',
  label: 'Two-sided marketplace',

  keywords: [
    'book',
    'booking',
    'book now',
    'reservations',
    'rentals',
    'vacation rentals',
    'stays',
    'hosts',
    'hotels',
    'flights',
    'travel',
    'trips',
    'experiences',
    'rides',
    'ride',
    'drivers',
    'delivery',
    'food delivery',
    'restaurants',
    'couriers',
    'groceries delivered',
    'near me',
    'nearby',
    'hire',
    'freelancers',
    'freelance',
    'gigs',
    'tasks',
    'handyman',
    'pros',
    'sitters',
    'dog walkers',
    'tutors',
    'dating',
    'matches',
    'singles',
    'listings',
    'become a host',
    'earn money',
  ],

  tagline: '{{name}} is a marketplace that connects people who need something with nearby people who offer it, and handles booking and payment in between.',

  eli5:
    '{{name}} is like a matchmaker with a cash register. On one side are people offering something (a spare room, a ride, a skill), and on the other are people looking for it. {{name}} helps them find each other with map-based search and ranking, makes sure the same slot is never booked twice, holds the payment safely, and pays the provider after the job is done, keeping a small fee.',

  languages: [
    { name: 'TypeScript / JavaScript', usedFor: 'Web app, booking API and real-time updates', share: 30 },
    { name: 'Python', usedFor: 'Ranking, matching, pricing models and data pipelines', share: 20 },
    { name: 'Java / Kotlin', usedFor: 'High-traffic backend services and the Android app', share: 20 },
    { name: 'SQL', usedFor: 'Listings, availability, bookings, reviews and payouts', share: 15 },
    { name: 'Swift', usedFor: 'The iPhone apps for customers and providers', share: 10 },
    { name: 'Go', usedFor: 'Fast services such as location tracking and dispatch', share: 5 },
  ],

  stack: [
    {
      layer: 'Frontend',
      items: [
        {
          name: 'Interactive maps',
          role: 'Map search with price pins',
          beginnerNote:
            'Map libraries like Mapbox GL or the Google Maps SDK draw the map and pins. When you drag the map, the app asks the server for listings inside the new rectangle.',
        },
        {
          name: 'Server-side rendering (SSR)',
          role: 'Listing pages that load fast',
          beginnerNote:
            'Pages for each listing or restaurant are built on the server first, so they appear quickly and search engines can find them.',
        },
      ],
    },
    {
      layer: 'Mobile',
      items: [
        {
          name: 'Two apps, one platform',
          role: 'Customer app and provider app',
          beginnerNote:
            'Most marketplaces have separate experiences for each side: one to book, and one for hosts, drivers or couriers to accept jobs, share location and track earnings.',
        },
        {
          name: 'Push notifications (APNs & FCM)',
          role: 'Instant alerts',
          beginnerNote:
            "Apple's and Google's notification services wake your phone with messages like \"Your booking is confirmed\" or \"New delivery request nearby\".",
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Node.js',
          role: 'Booking API & WebSockets',
          beginnerNote:
            'JavaScript on the server, well suited to keeping thousands of open connections that push live updates like "your courier is 2 minutes away".',
        },
        {
          name: 'Stripe Connect (or Adyen for Platforms)',
          role: 'Split payments & payouts',
          beginnerNote:
            'A payments service built for marketplaces: it charges the customer, keeps the platform fee, and sends the rest to the provider\'s bank account, while handling identity checks on providers.',
        },
        {
          name: 'Java / Kotlin services',
          role: 'Core business services',
          beginnerNote:
            'Heavy-traffic services like search and pricing are often written in typed JVM languages that are fast and have mature tooling.',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'PostgreSQL + PostGIS',
          role: 'Listings, bookings & locations',
          beginnerNote:
            'PostGIS teaches PostgreSQL about maps, so it can answer questions like "which listings are within 5 km of this point?" and store bookings safely in transactions.',
        },
        {
          name: 'Elasticsearch',
          role: 'Search with filters and geo',
          beginnerNote:
            'A search engine that combines text, filters (price, rating, dates) and distance in one fast query, then sorts the results.',
        },
        {
          name: 'Redis',
          role: 'Live locations & short holds',
          beginnerNote:
            'An in-memory database with built-in geo commands. It tracks where drivers are right now and briefly "holds" a slot while someone is paying.',
        },
        {
          name: 'Apache Kafka',
          role: 'Booking & location events',
          beginnerNote:
            'A durable stream of events like "booking confirmed". Notifications, search updates and analytics each read it independently.',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Search ranking models',
          role: 'Choosing what you see first',
          beginnerNote:
            'Models learn from past searches which listings people actually book, mixing in price, distance, reviews and photos to order the results.',
        },
        {
          name: 'Dynamic pricing',
          role: 'Balancing supply and demand',
          beginnerNote:
            'When many people want rides and few drivers are free, prices rise a little to attract more drivers. Hosts get price suggestions based on similar listings.',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'Amazon S3 + CDN',
          role: 'Listing photos',
          beginnerNote:
            'Photos are uploaded to cloud storage, resized into several sizes, and served from CDN servers near each visitor. Good photos strongly affect bookings.',
        },
        {
          name: 'Kubernetes',
          role: 'Runs all the services',
          beginnerNote:
            'Starts more copies of busy services automatically, for example at dinner time for food delivery or on Friday evening for travel searches.',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'web',
        label: 'Web App',
        kind: 'client',
        tier: 0,
        tech: '{{frontend}} + map library',
        description:
          'The {{name}} website where people search on a map, compare listings, book and leave reviews. Providers often manage their listings and calendars here too.',
      },
      {
        id: 'mobile',
        label: 'Customer & Provider Apps',
        kind: 'client',
        tier: 0,
        tech: 'Swift (iOS) · Kotlin (Android)',
        description:
          'Phone apps for both sides of the marketplace. Provider apps also share GPS location while working, so customers can watch their driver or courier on the map.',
      },
      {
        id: 'cdn',
        label: 'CDN & Edge',
        kind: 'edge',
        tier: 1,
        tech: '{{hosting}}',
        description:
          'Serves listing photos and page files from servers near you, filters attack traffic, and forwards API requests to the gateway.',
      },
      {
        id: 'payments',
        label: 'Marketplace Payments',
        kind: 'external',
        tier: 1,
        tech: 'Stripe Connect · Adyen for Platforms',
        description:
          "Charges the customer, keeps {{name}}'s fee, and pays the rest out to the provider's bank account later. It also verifies providers' identities, as financial rules require.",
      },
      {
        id: 'api',
        label: 'API Gateway',
        kind: 'gateway',
        tier: 2,
        tech: 'Node.js gateway',
        description:
          'The single entrance for app requests. It checks your login, limits abusive traffic, and routes each request to the right service.',
      },
      {
        id: 'realtime',
        label: 'Real-time Gateway',
        kind: 'gateway',
        tier: 2,
        tech: 'WebSockets (Node.js) + APNs / FCM push',
        description:
          'Keeps a live connection open to each app so updates arrive instantly: new booking requests, chat messages, and a driver\'s position moving on the map.',
      },
      {
        id: 'search',
        label: 'Search & Ranking',
        kind: 'service',
        tier: 3,
        tech: 'Java service',
        description:
          'Finds listings that match your place, dates and filters, then orders them so the ones you are most likely to love appear first.',
      },
      {
        id: 'booking',
        label: 'Booking Service',
        kind: 'service',
        tier: 3,
        tech: 'Node.js (TypeScript) service',
        description:
          'Owns calendars, bookings, cancellations and reviews. Its most important job is making sure one slot can never be sold to two people.',
      },
      {
        id: 'matching',
        label: 'Matching & Pricing',
        kind: 'ml',
        tier: 3,
        tech: 'Python models + Go dispatch service',
        description:
          'Scores which provider fits each request best (distance, rating, reliability) and suggests prices based on supply and demand.',
      },
      {
        id: 'events',
        label: 'Event Stream',
        kind: 'queue',
        tier: 3,
        tech: 'Apache Kafka',
        description:
          'A durable log of events like "booking confirmed" or "job offered". Notifications, search updates and payouts react to it without slowing the booking itself.',
      },
      {
        id: 'db',
        label: 'Marketplace Database',
        kind: 'database',
        tier: 4,
        tech: 'PostgreSQL + PostGIS',
        description:
          'The source of truth for users, listings, availability, bookings, reviews and payouts. Database rules reject double bookings even if two requests arrive at the same moment.',
      },
      {
        id: 'redis',
        label: 'Live State',
        kind: 'cache',
        tier: 4,
        tech: 'Redis (geo sets & locks)',
        description:
          'In-memory storage for things that change every few seconds, like where each available driver is, plus short "holds" on a slot while you pay.',
      },
      {
        id: 'search-index',
        label: 'Geo Search Index',
        kind: 'database',
        tier: 4,
        tech: 'Elasticsearch',
        description:
          'A copy of every listing arranged for fast searching by location, dates, price and amenities. It is updated whenever a listing or its calendar changes.',
      },
      {
        id: 'photos',
        label: 'Listing Photos',
        kind: 'storage',
        tier: 4,
        tech: 'Amazon S3',
        description:
          'Original photos uploaded by providers. They are resized into several versions and served to visitors through the CDN.',
      },
    ],
    edges: [
      { from: 'web', to: 'cdn', label: 'HTTPS' },
      { from: 'mobile', to: 'cdn', label: 'HTTPS API calls' },
      { from: 'web', to: 'payments', label: 'Card details → token' },
      { from: 'mobile', to: 'realtime', label: 'WebSocket: live updates' },
      { from: 'cdn', to: 'api', label: 'Forward API requests' },
      { from: 'cdn', to: 'photos', label: 'Photos on cache miss' },
      { from: 'api', to: 'search', label: 'Search this map area' },
      { from: 'api', to: 'booking', label: 'Book, cancel, review' },
      { from: 'api', to: 'matching', label: 'Request a provider' },
      { from: 'search', to: 'search-index', label: 'Geo + filter query' },
      { from: 'search', to: 'matching', label: 'Personal ranking scores' },
      { from: 'booking', to: 'redis', label: 'Short hold on a slot' },
      { from: 'booking', to: 'db', label: 'Save booking (transaction)' },
      { from: 'booking', to: 'payments', label: 'Charge & schedule payout' },
      { from: 'booking', to: 'events', label: 'BookingConfirmed' },
      { from: 'matching', to: 'redis', label: 'Find nearby providers' },
      { from: 'matching', to: 'events', label: 'JobOffered' },
      { from: 'realtime', to: 'redis', label: 'Location pings' },
      { from: 'events', to: 'realtime', label: 'Notify apps' },
      { from: 'events', to: 'search', label: 'Availability changed' },
    ],
    flows: [
      {
        id: 'map-search',
        title: 'You search for a place to stay',
        emoji: '🗺️',
        steps: [
          {
            from: 'web',
            to: 'cdn',
            narration:
              'You type a city, pick dates and drag the map. The page sends the map rectangle, dates and filters to {{name}} over HTTPS.',
          },
          {
            from: 'cdn',
            to: 'api',
            narration: 'Every search is different, so the edge forwards it to the API gateway instead of answering from its cache.',
          },
          {
            from: 'api',
            to: 'search',
            narration: 'The gateway passes the search to the Search & Ranking service.',
          },
          {
            from: 'search',
            to: 'search-index',
            narration:
              'Elasticsearch returns listings inside the map area that are free on your dates and match your filters, usually a few hundred candidates.',
          },
          {
            from: 'search',
            to: 'matching',
            narration:
              'A ranking model scores each candidate using price, reviews, distance and what similar guests booked, and the best ones move to the top.',
          },
          {
            from: 'cdn',
            to: 'photos',
            narration:
              'The results come back and price pins appear on the map. Your browser then loads the listing photos, mostly straight from the CDN cache.',
          },
        ],
      },
      {
        id: 'book-and-pay',
        title: 'You book and pay',
        emoji: '📅',
        steps: [
          {
            from: 'mobile',
            to: 'cdn',
            narration: 'You tap "Reserve" for three nights. The app sends the listing, dates and a payment token to {{name}}.',
          },
          {
            from: 'api',
            to: 'booking',
            narration: 'After passing through the edge and gateway, the request reaches the Booking service.',
          },
          {
            from: 'booking',
            to: 'redis',
            narration:
              'Booking places a short hold on those dates in Redis, so a second guest clicking at the same moment is told to wait instead of both paying.',
          },
          {
            from: 'booking',
            to: 'db',
            narration:
              'It saves the booking in PostgreSQL. A database rule rejects any booking whose dates overlap an existing one, which is the final safety net.',
          },
          {
            from: 'booking',
            to: 'payments',
            narration:
              "The payment provider charges your card, keeps {{name}}'s service fee aside, and schedules the host's share to be paid out after check-in.",
          },
          {
            from: 'booking',
            to: 'events',
            narration: 'A "BookingConfirmed" event is published, and you see your confirmation screen.',
          },
          {
            from: 'events',
            to: 'realtime',
            narration:
              'The real-time gateway reads the event and sends the host a push notification: "New booking for next weekend!"',
          },
        ],
      },
      {
        id: 'match-courier',
        title: 'A nearby courier gets your order',
        emoji: '🛵',
        steps: [
          {
            from: 'mobile',
            to: 'realtime',
            narration:
              'Every few seconds, each available courier\'s app sends its GPS position over an open WebSocket connection.',
          },
          {
            from: 'realtime',
            to: 'redis',
            narration: 'The latest positions are stored in a Redis geo set, which can answer "who is near here?" in about a millisecond.',
          },
          {
            from: 'api',
            to: 'matching',
            narration: 'Your order is almost ready at the restaurant, so the API asks Matching to find a courier.',
          },
          {
            from: 'matching',
            to: 'redis',
            narration:
              'Matching looks up couriers within 3 km, then scores them by pickup distance, rating and how often they accept jobs.',
          },
          {
            from: 'matching',
            to: 'events',
            narration: 'It offers the job to the best-scoring courier by publishing a "JobOffered" event.',
          },
          {
            from: 'events',
            to: 'realtime',
            narration:
              'The real-time gateway pushes the offer to that courier\'s phone. If they do not accept within about 30 seconds, Matching offers it to the next courier.',
          },
          {
            from: 'realtime',
            to: 'mobile',
            narration: 'The courier taps Accept, and from then on you can watch their location move on your map.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'services/booking/src/routes/createBooking.ts', note: 'The "Reserve" endpoint: lock, save booking, start payment' },
    { path: 'services/booking/src/webhooks/stripe.ts', note: 'Marks a booking confirmed when the payment provider says it succeeded' },
    { path: 'services/booking/src/jobs/expireUnpaidBookings.ts', note: 'Cancels bookings left unpaid for 15 minutes so the dates free up' },
    { path: 'services/booking/src/payouts/releaseHostPayouts.ts', note: "Sends each provider's share once the stay or job is complete" },
    { path: 'services/booking/migrations/001_listings_and_bookings.sql', note: 'Listings, bookings and reviews tables' },
    { path: 'services/search/src/main/java/com/example/search/ListingSearchService.java', note: 'Builds the geo + dates + filters query' },
    { path: 'services/search/src/main/java/com/example/search/AvailabilityIndexer.java', note: 'Updates the search index when calendars change' },
    { path: 'services/dispatch/internal/geo/nearby.go', note: 'Finds couriers near a point with Redis GEOSEARCH' },
    { path: 'services/dispatch/internal/offers/offer.go', note: 'Offers a job and moves to the next courier after a timeout' },
    { path: 'services/realtime/src/socketServer.ts', note: 'WebSocket server that pushes live updates to the apps' },
    { path: 'ml/matching/score_couriers.py', note: 'Scores nearby couriers for an order' },
    { path: 'ml/ranking/train_search_ranker.py', note: 'Trains the model that orders search results' },
    { path: 'ml/pricing/price_suggestions.py', note: 'Suggests prices from similar listings and demand' },
    { path: 'apps/provider-ios/Location/LocationReporter.swift', note: 'Sends GPS updates every few seconds while a provider is online' },
    { path: 'infra/k8s/dispatch-autoscaler.yaml', note: 'Adds dispatch servers automatically during the dinner rush' },
  ],

  code: [
    {
      id: 'booking-endpoint',
      title: 'The "Reserve" endpoint',
      file: 'services/booking/src/routes/createBooking.ts',
      language: 'TypeScript',
      explanation:
        'Booking has two layers of protection against double booking. A short Redis lock stops two requests for the same listing from running at once, and the database\'s EXCLUDE rule (see the SQL snippet) rejects overlapping dates no matter what; PostgreSQL reports that as error code 23P01. The payment uses Stripe Connect: the guest is charged, the platform keeps its fee, and the rest goes to the host\'s Stripe account. The idempotency key means a retried request never creates a second charge. The app then finishes paying with the returned client secret, a webhook marks the booking confirmed, and a separate job cancels bookings that stay unpaid. Platforms that release money only after check-in use Stripe\'s "separate charges and transfers" instead.',
      code: `import express from 'express';
import { createClient } from 'redis';
import { Pool } from 'pg';
import Stripe from 'stripe';

const app = express().use(express.json());
const db = new Pool(); // connection settings come from environment variables
const redis = await createClient().connect();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

app.post('/v1/bookings', async (req, res) => {
  const { listingId, checkIn, checkOut } = req.body;
  const guestId = res.locals.userId; // set earlier by the login middleware
  // 1. One booking attempt per listing at a time. The lock expires by itself after 10 s.
  const lockKey = \`lock:listing:\${listingId}\`;
  if (!(await redis.set(lockKey, guestId, { NX: true, PX: 10_000 }))) {
    return res.status(409).json({ error: 'Someone else is booking this right now' });
  }
  try {
    const { rows: [listing] } = await db.query('SELECT * FROM listings WHERE id = $1', [listingId]);
    const nights = (Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000;
    const total = listing.nightly_price_cents * nights;
    // 2. Save it. The EXCLUDE constraint rejects dates that overlap another booking.
    const { rows: [booking] } = await db.query(
      \`INSERT INTO bookings (listing_id, guest_id, stay, total_cents, status)
       VALUES ($1, $2, daterange($3, $4), $5, 'awaiting_payment') RETURNING id\`,
      [listingId, guestId, checkIn, checkOut, total]);
    // 3. Charge the guest: Stripe keeps our 12% fee and sends the rest to the host's account.
    const payment = await stripe.paymentIntents.create({
      amount: total, currency: 'usd', application_fee_amount: Math.round(total * 0.12),
      transfer_data: { destination: listing.host_stripe_account },
    }, { idempotencyKey: \`booking-\${booking.id}\` });
    return res.status(201).json({ bookingId: booking.id, clientSecret: payment.client_secret });
  } catch (err: any) {
    if (err.code === '23P01') return res.status(409).json({ error: 'Those dates were just booked' });
    throw err;
  } finally {
    await redis.del(lockKey);
  }
});`,
    },
    {
      id: 'bookings-schema',
      title: 'Listings, bookings and a map search',
      file: 'services/booking/migrations/001_listings_and_bookings.sql',
      language: 'SQL (PostgreSQL + PostGIS)',
      explanation:
        'Listings store their location as a real point on Earth using PostGIS, with a GIST index so "near me" searches stay fast. Each booking stores its stay as a date range, and the EXCLUDE constraint is the star: PostgreSQL itself refuses any booking for the same listing whose dates overlap (&&) an active one, even if two requests arrive at the same instant. Reviews point at a booking, so only real guests can leave one. The query at the end finds listings within 5 km that are free for the chosen dates.',
      code: `CREATE EXTENSION IF NOT EXISTS postgis;     -- adds map types like GEOGRAPHY
CREATE EXTENSION IF NOT EXISTS btree_gist;  -- lets one index mix "=" with "overlaps"

CREATE TABLE listings (
  id                  BIGSERIAL PRIMARY KEY,
  host_id             BIGINT NOT NULL,
  title               TEXT NOT NULL,
  nightly_price_cents INTEGER NOT NULL CHECK (nightly_price_cents > 0),
  location            GEOGRAPHY(POINT, 4326) NOT NULL,  -- longitude + latitude
  host_stripe_account TEXT NOT NULL
);
CREATE INDEX listings_location_idx ON listings USING GIST (location);

CREATE TABLE bookings (
  id          BIGSERIAL PRIMARY KEY,
  listing_id  BIGINT NOT NULL REFERENCES listings(id),
  guest_id    BIGINT NOT NULL,
  stay        DATERANGE NOT NULL,             -- [check-in, check-out)
  total_cents INTEGER NOT NULL,
  status      TEXT NOT NULL,                  -- awaiting_payment, confirmed, cancelled
  -- No two active bookings for the same listing may overlap. Ever.
  EXCLUDE USING GIST (listing_id WITH =, stay WITH &&) WHERE (status <> 'cancelled')
);

CREATE TABLE reviews (
  booking_id BIGINT PRIMARY KEY REFERENCES bookings(id), -- one review per real stay
  rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body       TEXT
);

-- Listings within 5 km of downtown Austin that are free for 3 nights, cheapest first.
SELECT l.id, l.title, l.nightly_price_cents
FROM listings l
WHERE ST_DWithin(l.location, ST_MakePoint(-97.7431, 30.2672)::geography, 5000)
  AND NOT EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.listing_id = l.id AND b.status <> 'cancelled'
      AND b.stay && daterange('2027-03-12', '2027-03-15'))
ORDER BY l.nightly_price_cents
LIMIT 20;`,
    },
    {
      id: 'courier-matching',
      title: 'Matching a courier to an order',
      file: 'ml/matching/score_couriers.py',
      language: 'Python',
      explanation:
        'Matching has two steps: find who is close enough, then pick the best of them. The haversine formula measures distance between GPS points on a round Earth. Each nearby courier gets a score that mostly rewards being close, but also good ratings and reliably accepting jobs. Real dispatch systems use Redis GEOSEARCH for the "who is nearby" step, estimate travel time on real roads instead of straight lines, and tune the weights with experiments and machine learning.',
      code: `from dataclasses import dataclass
from math import asin, cos, radians, sin, sqrt

@dataclass
class Courier:
    id: str
    lat: float
    lng: float
    rating: float           # 1.0 to 5.0 stars
    acceptance_rate: float  # 0.0 to 1.0: how often they accept job offers

def km_between(lat1, lng1, lat2, lng2):
    """Haversine formula: the distance between two GPS points on a round Earth."""
    dlat, dlng = radians(lat2 - lat1), radians(lng2 - lng1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2) ** 2
    return 2 * 6371 * asin(sqrt(a))  # 6371 km = Earth's radius

def score(c, lat, lng):
    closeness = max(0.0, 1 - km_between(c.lat, c.lng, lat, lng) / 3)  # 1 = right here, 0 = 3+ km
    quality = (c.rating - 1) / 4                                       # 1-5 stars -> 0.0-1.0
    return 0.6 * closeness + 0.25 * quality + 0.15 * c.acceptance_rate

def best_couriers(couriers, lat, lng, max_km=3.0, top_n=3):
    nearby = [c for c in couriers if km_between(c.lat, c.lng, lat, lng) <= max_km]
    return sorted(nearby, key=lambda c: score(c, lat, lng), reverse=True)[:top_n]

couriers = [
    Courier("ana", 40.7411, -73.9897, 4.9, 0.95),
    Courier("ben", 40.7440, -73.9870, 4.2, 0.60),
    Courier("cy", 40.7306, -73.9866, 4.8, 0.90),
    Courier("dee", 40.7680, -73.9820, 5.0, 0.99),
]
restaurant = (40.7420, -73.9890)
print([c.id for c in best_couriers(couriers, *restaurant)])
# -> ['ana', 'ben', 'cy']   (dee has perfect stars but is almost 3 km away)`,
    },
  ],

  playground: {
    title: 'Map search & booking',
    description:
      'A mini {{name}} search screen: price pins on a map, a ranked list you can re-sort, hearts to save favorites, and a booking panel that adds up nights and fees and refuses to double-book.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Map search</title>
<style>
:root {
  --brand: {{brand}}; /* @tweak color "Brand color" */
  --accent: {{accent}}; /* @tweak color "Saved heart" */
  --bg: #ffffff; /* @tweak color "Background" */
  --radius: 14px; /* @tweak range 0 24 "Corner radius" */
  --map-h: 190px; /* @tweak range 120 280 "Map height" */
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: #222; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
header { padding: 12px 16px 8px; }
.logo { font-weight: 800; font-size: 20px; color: var(--brand); }
.search { margin-top: 8px; padding: 10px 14px; border-radius: 999px; box-shadow: 0 2px 10px rgba(0,0,0,.12); font-size: 14px; font-weight: 600; }
.map { position: relative; height: var(--map-h); margin: 8px 16px; border-radius: var(--radius); overflow: hidden;
  background: linear-gradient(115deg, transparent 45%, #a9d4f5 45%, #a9d4f5 51%, transparent 51%),
    repeating-linear-gradient(0deg, #fff 0 3px, transparent 3px 40px),
    repeating-linear-gradient(90deg, #fff 0 3px, transparent 3px 48px), #e4efdc; }
.pin { position: absolute; transform: translate(-50%, -50%); border: 0; border-radius: 999px; padding: 5px 9px; background: #fff; font-size: 12px; font-weight: 700; box-shadow: 0 2px 6px rgba(0,0,0,.25); cursor: pointer; }
.pin.on { background: var(--brand); color: #fff; z-index: 2; }
.pin.booked { background: #8a8a8a; color: #fff; text-decoration: line-through; }
.bar { display: flex; justify-content: space-between; align-items: center; padding: 4px 16px; }
h2 { font-size: 16px; margin: 0; }
.chips button { border: 1px solid #ddd; background: #fff; border-radius: 999px; padding: 4px 10px; font-size: 12px; cursor: pointer; }
.chips button.on { background: #222; color: #fff; border-color: #222; }
.card { display: flex; gap: 12px; align-items: center; margin: 8px 16px; padding: 8px; border: 2px solid transparent; border-radius: var(--radius); cursor: pointer; }
.card.on { border-color: var(--brand); }
.ph { width: 72px; height: 72px; flex-shrink: 0; border-radius: calc(var(--radius) * .7); display: grid; place-items: center; font-size: 32px; }
.info { flex: 1; font-size: 13px; }
.info b { display: block; font-size: 14px; }
.info small { color: #717171; }
.heart { border: 0; background: none; font-size: 22px; cursor: pointer; color: #bbb; }
.heart.saved { color: var(--accent); }
.sheet { margin: 12px 16px 20px; padding: 14px; border-radius: var(--radius); box-shadow: 0 -2px 14px rgba(0,0,0,.12); }
.row { display: flex; justify-content: space-between; align-items: center; margin: 6px 0; font-size: 14px; }
.muted { color: #717171; }
.stepper button { width: 30px; height: 30px; border-radius: 50%; border: 1px solid #bbb; background: #fff; font-size: 16px; cursor: pointer; }
.stepper b { display: inline-block; width: 28px; text-align: center; }
.total { border-top: 1px solid #eee; padding-top: 8px; font-weight: 700; }
.reserve { width: 100%; margin-top: 8px; padding: 13px; border: 0; border-radius: calc(var(--radius) * .7); background: var(--brand); color: #fff; font-size: 16px; font-weight: 700; cursor: pointer; }
.status { font-size: 13px; text-align: center; min-height: 18px; margin: 8px 0 0; }
</style>
</head>
<body>
<header>
  <div class="logo" data-edit="logo">{{name}}</div>
  <div class="search" data-edit="search">🔍 Austin · Mar 12–15 · 2 guests</div>
</header>
<div class="map" id="map"></div>
<div class="bar">
  <h2 data-edit="heading">Stays near you</h2>
  <div class="chips" id="chips">
    <button data-sort="best" class="on">Best</button> <button data-sort="price">Price</button> <button data-sort="rating">Rating</button>
  </div>
</div>
<div id="list"></div>
<section class="sheet">
  <div class="row"><b id="selTitle"></b><span id="selPrice"></span></div>
  <div class="row"><span>Nights</span><span class="stepper"><button id="minus">−</button><b id="nights"></b><button id="plus">+</button></span></div>
  <div class="row muted"><span id="stayLabel"></span><span id="stayCost"></span></div>
  <div class="row muted"><span data-edit="feeLabel">Service fee</span><span id="fee"></span></div>
  <div class="row total"><span>Total</span><span id="total"></span></div>
  <button class="reserve" id="reserve" data-edit="cta">Reserve</button>
  <p class="status" id="status"></p>
</section>

<script>
// Pretend search results. x and y place each price pin on the map (in %)
const listings = [
  { id: 1, title: 'Treehouse loft', emoji: '🌳', price: 142, rating: 4.95, km: 1.2, x: 20, y: 30, look: 'linear-gradient(135deg, #56ab2f, #a8e063)' },
  { id: 2, title: 'Downtown studio', emoji: '🏙️', price: 98, rating: 4.71, km: 0.4, x: 55, y: 58, look: 'linear-gradient(135deg, #355c7d, #c06c84)' },
  { id: 3, title: 'Lakeside cabin', emoji: '🛶', price: 180, rating: 4.88, km: 3.8, x: 80, y: 24, look: 'linear-gradient(135deg, #2193b0, #6dd5ed)' },
  { id: 4, title: 'Tiny house with a view', emoji: '🏡', price: 115, rating: 4.82, km: 2.1, x: 34, y: 78, look: 'linear-gradient(135deg, #f7971e, #ffd200)' }
];
const FEE_PERCENT = 12; // the marketplace's cut
let sortBy = 'best';
let selected = 1;
let nights = 3;
const saved = new Set();
const booked = new Set(); // listings already booked for these dates
const $ = (id) => document.getElementById(id);

// "Best match" ranking: reward great ratings, gently penalise price and distance
const score = (l) => l.rating * 2 - l.price / 100 - l.km / 2;

function ranked() {
  const list = listings.slice();
  if (sortBy === 'price') return list.sort((a, b) => a.price - b.price);
  if (sortBy === 'rating') return list.sort((a, b) => b.rating - a.rating);
  return list.sort((a, b) => score(b) - score(a));
}

function render() {
  $('map').innerHTML = '';
  $('list').innerHTML = '';
  ranked().forEach((l) => {
    const pin = document.createElement('button');
    pin.className = 'pin' + (l.id === selected ? ' on' : '') + (booked.has(l.id) ? ' booked' : '');
    pin.style.left = l.x + '%';
    pin.style.top = l.y + '%';
    pin.textContent = '$' + l.price;
    pin.onclick = () => select(l.id);
    $('map').appendChild(pin);

    const card = document.createElement('div');
    card.className = 'card' + (l.id === selected ? ' on' : '');
    card.innerHTML = '<div class="ph"></div><div class="info"><b></b><small></small><div></div></div><button class="heart">♥</button>';
    card.querySelector('.ph').style.background = l.look;
    card.querySelector('.ph').textContent = l.emoji;
    card.querySelector('b').textContent = l.title;
    card.querySelector('small').textContent = '★ ' + l.rating + ' · ' + l.km + ' km away' + (booked.has(l.id) ? ' · booked' : '');
    card.querySelector('.info div').textContent = '$' + l.price + ' / night';
    const heart = card.querySelector('.heart');
    heart.classList.toggle('saved', saved.has(l.id));
    heart.onclick = (e) => { e.stopPropagation(); saved.has(l.id) ? saved.delete(l.id) : saved.add(l.id); render(); };
    card.onclick = () => select(l.id);
    $('list').appendChild(card);
  });

  // Price breakdown for the selected listing
  const l = listings.find((x) => x.id === selected);
  const stay = l.price * nights;
  const fee = Math.round((stay * FEE_PERCENT) / 100);
  $('selTitle').textContent = l.emoji + ' ' + l.title;
  $('selPrice').textContent = '$' + l.price + ' / night';
  $('nights').textContent = nights;
  $('stayLabel').textContent = '$' + l.price + ' × ' + nights + ' nights';
  $('stayCost').textContent = '$' + stay;
  $('fee').textContent = '$' + fee;
  $('total').textContent = '$' + (stay + fee);
  document.querySelectorAll('#chips button').forEach((b) => b.classList.toggle('on', b.dataset.sort === sortBy));
}

function select(id) { selected = id; $('status').textContent = ''; render(); }

$('minus').onclick = () => { nights = Math.max(1, nights - 1); render(); };
$('plus').onclick = () => { nights = Math.min(14, nights + 1); render(); };
$('chips').onclick = (e) => { if (e.target.dataset.sort) { sortBy = e.target.dataset.sort; render(); } };

$('reserve').onclick = () => {
  // The server's database would reject overlapping dates, so we do the same here
  if (booked.has(selected)) {
    $('status').textContent = '⛔ Sorry, those dates were just booked. No double bookings!';
    return;
  }
  booked.add(selected);
  $('status').textContent = '🎉 Booked! The host just got a notification.';
  render();
};

render();
</script>
</body>
</html>`,
    challenges: [
      'Change the "Brand color" tweak and drag "Map height" to make the map bigger, then watch the pins and Reserve button update.',
      'Add a fifth listing to the listings array with its own emoji, price and x/y position on the map.',
      'Change the score function so distance matters much more (try l.km * 2) and see how the "Best" order changes.',
      'Add a cleaning fee of $40 to the price breakdown and include it in the total and the service fee.',
    ],
  },

  concepts: [
    {
      term: 'Two-sided marketplace',
      meaning:
        'A platform with two groups of users, such as guests and hosts or diners and couriers. It only works when both sides are big enough, which is why new marketplaces often start in one city.',
    },
    {
      term: 'Geo search',
      meaning:
        'Searching by location, like "listings inside this map area" or "couriers within 3 km". Special indexes (PostGIS, Elasticsearch geo, Redis geo sets) make these questions fast.',
    },
    {
      term: 'Double booking & exclusion constraints',
      meaning:
        'If two people book the same dates at the same moment, careless code accepts both. A database exclusion constraint refuses any booking whose dates overlap an existing one.',
    },
    {
      term: 'Distributed lock',
      meaning:
        'A short-lived "I am working on this" flag, often stored in Redis, so only one server handles a given listing or job at a time. It expires automatically in case that server crashes.',
    },
    {
      term: 'Search ranking',
      meaning:
        'Deciding the order of results. Marketplaces mix signals like price, distance, ratings and past booking behavior, often with a machine learning model.',
    },
    {
      term: 'Split payments & payouts',
      meaning:
        "The customer pays once, the platform keeps a fee, and the provider's share is paid out to their bank account, often only after the stay or job is done, to protect customers.",
    },
    {
      term: 'WebSockets',
      meaning:
        'A connection between app and server that stays open, so the server can push updates instantly, like a new job offer or a driver moving on the map, instead of the app asking over and over.',
    },
    {
      term: 'Trust & reviews',
      meaning:
        'Strangers need a reason to trust each other. Reviews tied to real completed bookings, verified identities and secure in-app payments provide it.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Pick a tiny niche',
      detail:
        'Choose something small and local, like "tutors at my university" or "borrow camping gear", so you can find enough people on both sides to test it.',
    },
    {
      step: 'Model listings and bookings',
      detail:
        'Create users, listings, bookings and reviews tables in PostgreSQL (Supabase is an easy free option), and add an exclusion constraint so time slots cannot overlap.',
    },
    {
      step: 'Add map search',
      detail:
        'Store each listing\'s latitude and longitude, show them on a Leaflet map with free OpenStreetMap tiles, and use PostGIS ST_DWithin to find listings near a point.',
    },
    {
      step: 'Build the booking flow',
      detail:
        'Let people pick a slot, create a pending booking on the server, and show clear confirmations. Handle the "someone just booked this" error nicely.',
    },
    {
      step: 'Take payments and pay providers',
      detail:
        'Use Stripe Connect in test mode: onboard providers with Express accounts, charge customers with an application fee, and confirm bookings from webhooks.',
    },
    {
      step: 'Add reviews, notifications and deploy',
      detail:
        'Allow a review only after a completed booking, send emails or push notifications on new bookings, then deploy to Vercel, Render or Fly.io.',
    },
  ],
};
