import type { Teardown } from '../types';

export const uber: Teardown = {
  id: 'uber',
  name: 'Uber',
  url: 'uber.com',
  tagline: 'A live marketplace that matches riders and drivers in seconds.',
  category: 'Ride-hailing & delivery',
  brandColor: '#000000',
  accentColor: '#276EF1',
  logoGlyph: 'U',
  source: 'curated',

  eli5:
    "Uber is a giant, always-running matchmaker. Drivers' phones keep telling Uber where they are, and when you tap Request, Uber's servers look at the drivers in the small hexagon-shaped map areas around you, predict who can reach you fastest, and send that driver your pickup. During the ride the same system streams the car's position to your screen, then charges your card automatically when the trip ends.",

  facts: [
    { label: 'Founded', value: '2009 in San Francisco (as UberCab)' },
    { label: 'Founders', value: 'Garrett Camp & Travis Kalanick' },
    { label: 'CEO', value: 'Dara Khosrowshahi (since 2017)' },
    { label: 'Went public', value: 'NYSE, 2019 (ticker: UBER)' },
    { label: 'Backend style', value: 'Thousands of microservices, mostly Go and Java' },
    { label: 'Map trick', value: 'Splits the world into hexagons with H3' },
    { label: 'Famous open source', value: 'H3, Jaeger, Cadence, RIBs, Apache Hudi' },
  ],

  history: [
    {
      year: '2009',
      title: 'UberCab is born',
      detail:
        'Garrett Camp and Travis Kalanick start a company around one simple idea: tap a button on your phone and a car comes to you.',
    },
    {
      year: '2010',
      title: 'First rides in San Francisco',
      detail:
        'The service launches in San Francisco with black luxury cars. The company soon drops "Cab" from its name and becomes just Uber.',
    },
    {
      year: '2012',
      title: 'UberX goes everyday',
      detail:
        'UberX lets drivers use regular cars, making rides much cheaper and helping Uber spread quickly to new cities.',
    },
    {
      year: '2014',
      title: 'Uber Eats begins',
      detail:
        'Uber starts delivering food, reusing the same idea of matching a nearby driver to a request, just with a meal instead of a passenger.',
    },
    {
      year: '2015',
      title: 'Breaking up the monolith',
      detail:
        "Uber's first backend was one big Python app on a PostgreSQL database. To keep up with growth, engineers split it into many small services that teams can change independently.",
    },
    {
      year: '2016',
      title: 'A new home for trip data',
      detail:
        'Uber explains publicly how it built Schemaless, its own storage layer on top of MySQL, and why it moved much of its data from PostgreSQL to MySQL.',
    },
    {
      year: '2016',
      title: 'Rider app rebuilt from scratch',
      detail:
        'The rider app is rewritten in Swift (iOS) and Java (Android) using a new architecture called RIBs, which Uber later open-sources.',
    },
    {
      year: '2017',
      title: 'A new CEO',
      detail:
        'Dara Khosrowshahi becomes CEO. The same year Uber open-sources Jaeger, a tool for following a single request as it travels through many services.',
    },
    {
      year: '2018',
      title: 'H3 goes open source',
      detail:
        'Uber releases H3, its system for covering the globe in hexagons, so anyone can group locations into map cells the way Uber does.',
    },
    {
      year: '2019',
      title: 'Uber goes public',
      detail: 'Uber lists its shares on the New York Stock Exchange under the ticker UBER.',
    },
  ],

  languages: [
    { name: 'Go', usedFor: 'High-traffic backend services like matching and geofences', share: 30 },
    { name: 'Java', usedFor: 'Core backend services, data pipelines and Android code', share: 28 },
    { name: 'JavaScript / TypeScript', usedFor: 'Web apps (React, Base Web) and the early Node.js dispatch system', share: 12 },
    { name: 'Python', usedFor: 'The original monolith, data science and machine learning', share: 12 },
    { name: 'Swift', usedFor: 'iPhone apps for riders, drivers and Eats', share: 10 },
    { name: 'Kotlin', usedFor: 'Newer Android app code', share: 8 },
  ],

  stack: [
    {
      layer: 'Mobile',
      items: [
        {
          name: 'Swift',
          role: 'iOS apps',
          beginnerNote: "Apple's modern language for iPhone apps, used for Uber's rider and driver apps on iOS.",
          confidence: 'confirmed',
        },
        {
          name: 'Java & Kotlin',
          role: 'Android apps',
          beginnerNote: "Android's two main languages: the 2016 rider app rewrite used Java, and newer code is written in Kotlin.",
          confidence: 'confirmed',
        },
        {
          name: 'RIBs',
          role: 'App architecture',
          beginnerNote:
            'Splits the app into small Router-Interactor-Builder units, like Lego bricks that each own one piece of logic, so hundreds of engineers can work without colliding.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Frontend',
      items: [
        {
          name: 'React',
          role: 'Web user interface',
          beginnerNote: 'A JavaScript library that builds web pages out of reusable pieces called components, like snapping together blocks.',
          confidence: 'confirmed',
        },
        {
          name: 'Base Web',
          role: 'Design system',
          beginnerNote: "Uber's open-source kit of ready-made React buttons, inputs and menus, so every web page looks and behaves consistently.",
          confidence: 'confirmed',
        },
        {
          name: 'Fusion.js',
          role: 'Web app framework',
          beginnerNote: "Uber's open-source framework that handles the plumbing around React apps, such as rendering pages on the server.",
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Backend',
      items: [
        {
          name: 'Go',
          role: 'High-throughput services',
          beginnerNote: 'A fast, simple language that is very good at handling thousands of requests at the same time.',
          confidence: 'confirmed',
        },
        {
          name: 'Java',
          role: 'Core business services',
          beginnerNote: 'A mature, widely used language with huge libraries, a safe choice for big systems like payments.',
          confidence: 'confirmed',
        },
        {
          name: 'Node.js + Ringpop',
          role: 'Early real-time dispatch',
          beginnerNote:
            "Uber's first dispatch system ran on Node.js, and Ringpop spread the work across many servers, like dealing cards evenly to players.",
          confidence: 'confirmed',
        },
        {
          name: 'Cadence',
          role: 'Workflow engine',
          beginnerNote:
            'Keeps long, multi-step processes on track, remembering where they left off even if a server crashes halfway through.',
          confidence: 'confirmed',
        },
        {
          name: 'Protobuf / gRPC',
          role: 'Service-to-service calls',
          beginnerNote: 'A compact, typed way for services to call each other, like a strict form that both sides agree to fill in.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'Data',
      items: [
        {
          name: 'MySQL (Schemaless & Docstore)',
          role: 'Main online storage',
          beginnerNote: 'Uber built its own storage layers on top of the MySQL database so trip data can be spread across many machines.',
          confidence: 'confirmed',
        },
        {
          name: 'Apache Kafka',
          role: 'Event streaming',
          beginnerNote: 'A giant conveyor belt of events like "driver moved" or "trip ended" that any service can read from.',
          confidence: 'confirmed',
        },
        {
          name: 'Apache Hudi',
          role: 'Data lake',
          beginnerNote: 'Created at Uber to keep huge analytics tables up to date with small incremental changes instead of rebuilding them every night.',
          confidence: 'confirmed',
        },
        {
          name: 'Apache Pinot',
          role: 'Real-time analytics',
          beginnerNote: 'A database built to answer questions like "how many trips started in this city in the last five minutes?" in under a second.',
          confidence: 'confirmed',
        },
      ],
    },
    {
      layer: 'Infrastructure',
      items: [
        {
          name: 'H3',
          role: 'Geospatial index',
          beginnerNote: 'Covers the planet in hexagons, so "drivers near me" becomes "drivers in these few cells", which is much faster to check.',
          confidence: 'confirmed',
        },
        {
          name: 'Jaeger',
          role: 'Distributed tracing',
          beginnerNote: 'Like a package tracking number for one request, showing every service it visited and how long each step took.',
          confidence: 'confirmed',
        },
        {
          name: 'M3',
          role: 'Metrics platform',
          beginnerNote: 'Stores streams of health numbers such as error counts and response times, so engineers can spot problems on dashboards.',
          confidence: 'confirmed',
        },
        {
          name: 'Kubernetes',
          role: 'Running containers',
          beginnerNote: 'Software that decides which machine runs each service and restarts it if it crashes, like an air-traffic controller for programs.',
          confidence: 'likely',
        },
      ],
    },
    {
      layer: 'AI / ML',
      items: [
        {
          name: 'Michelangelo',
          role: 'ML platform',
          beginnerNote: "Uber's in-house platform for training, deploying and serving machine learning models, like a factory line for predictions.",
          confidence: 'confirmed',
        },
        {
          name: 'DeepETA',
          role: 'Arrival-time prediction',
          beginnerNote: "A deep learning model that corrects a routing engine's travel-time guess using lessons learned from past trips.",
          confidence: 'confirmed',
        },
        {
          name: 'Horovod',
          role: 'Distributed training',
          beginnerNote: "Uber's open-source tool for training one model on many GPUs at once, like splitting a big homework assignment among friends.",
          confidence: 'confirmed',
        },
      ],
    },
  ],

  architecture: {
    nodes: [
      {
        id: 'rider-app',
        label: 'Rider app',
        kind: 'client',
        tier: 0,
        tech: 'Swift (iOS) · Java/Kotlin (Android) · RIBs',
        description: 'The app you open to book a ride. It shows the map, sends your ride request and listens for live updates about your driver.',
      },
      {
        id: 'driver-app',
        label: 'Driver app',
        kind: 'client',
        tier: 0,
        tech: 'Uber Driver (iOS & Android)',
        description: "The app drivers keep open while working. It reports the phone's GPS position every few seconds and pops up new ride offers.",
      },
      {
        id: 'web-app',
        label: 'Web app',
        kind: 'client',
        tier: 0,
        tech: 'React + Base Web',
        description: 'Lets people request rides or manage their account from a browser. It talks to the same backend as the phone apps.',
      },
      {
        id: 'edge',
        label: 'Load balancers',
        kind: 'edge',
        tier: 1,
        tech: 'DNS + load balancers',
        description: 'The front door for all internet traffic. They spread incoming requests across many servers so no single machine gets overwhelmed.',
      },
      {
        id: 'api-gateway',
        label: 'API gateway',
        kind: 'gateway',
        tier: 2,
        tech: 'Uber Edge Gateway',
        description: 'Checks who you are and forwards each request to the right internal service. The apps only need to know this one entrance.',
      },
      {
        id: 'push',
        label: 'Push platform',
        kind: 'gateway',
        tier: 2,
        tech: 'Long-lived streaming connections',
        description:
          'Keeps an open line to every active phone so the server can send updates instantly, instead of the app asking "anything new?" over and over.',
      },
      {
        id: 'dispatch',
        label: 'Matching (dispatch)',
        kind: 'service',
        tier: 3,
        tech: 'Go + H3',
        description: 'Pairs riders with drivers. It looks at drivers in nearby hexagons, ranks them by predicted arrival time and offers the trip to the best one.',
      },
      {
        id: 'location',
        label: 'Location service',
        kind: 'service',
        tier: 3,
        tech: 'Go · in-memory H3 index',
        description: 'Receives a flood of GPS pings and remembers where every online driver is right now, grouped by hexagon for fast lookups.',
      },
      {
        id: 'pricing',
        label: 'Pricing',
        kind: 'service',
        tier: 3,
        tech: 'Java + surge model',
        description:
          'Works out your fare before you ride. When many riders want cars in one area and few drivers are free, it raises prices (surge) to attract more drivers.',
      },
      {
        id: 'payments',
        label: 'Payments',
        kind: 'service',
        tier: 3,
        tech: 'Java',
        description: 'Finalizes the fare when a trip ends, charges your saved payment method and records what the driver earned.',
      },
      {
        id: 'kafka',
        label: 'Event stream',
        kind: 'queue',
        tier: 4,
        tech: 'Apache Kafka',
        description: 'A shared, ordered log of everything that happens, like "driver moved" or "trip paid". Many services can read the same events without calling each other.',
      },
      {
        id: 'docstore',
        label: 'Trip database',
        kind: 'database',
        tier: 4,
        tech: 'Docstore / Schemaless on MySQL',
        description: 'Stores trips, riders and receipts. Uber built its own layers on top of MySQL to split this data across many machines.',
      },
      {
        id: 'ml-platform',
        label: 'ML models',
        kind: 'ml',
        tier: 4,
        tech: 'Michelangelo (e.g. DeepETA)',
        description: 'Serves machine learning predictions, such as how many minutes a driver needs to reach you. The models learn from huge amounts of past trip data.',
      },
      {
        id: 'card-network',
        label: 'Payment processors',
        kind: 'external',
        tier: 4,
        tech: 'Outside card & wallet providers',
        description: 'Companies outside Uber that actually move money from your card. Uber sends them a charge request and gets back "approved" or "declined".',
      },
    ],
    edges: [
      { from: 'rider-app', to: 'edge', label: 'HTTPS' },
      { from: 'driver-app', to: 'edge', label: 'HTTPS' },
      { from: 'web-app', to: 'edge', label: 'HTTPS' },
      { from: 'edge', to: 'api-gateway', label: 'Route request' },
      { from: 'api-gateway', to: 'pricing', label: 'Fare quote' },
      { from: 'api-gateway', to: 'dispatch', label: 'Ride request' },
      { from: 'api-gateway', to: 'location', label: 'GPS pings' },
      { from: 'api-gateway', to: 'payments', label: 'End trip' },
      { from: 'pricing', to: 'location', label: 'Drivers per hexagon' },
      { from: 'dispatch', to: 'location', label: 'Nearby drivers?' },
      { from: 'dispatch', to: 'ml-platform', label: 'Predict ETAs' },
      { from: 'dispatch', to: 'docstore', label: 'Save trip' },
      { from: 'dispatch', to: 'push', label: 'Ride offer' },
      { from: 'location', to: 'kafka', label: 'Location events' },
      { from: 'kafka', to: 'push', label: 'Trip updates' },
      { from: 'push', to: 'rider-app', label: 'Live car position' },
      { from: 'push', to: 'driver-app', label: 'New offers' },
      { from: 'payments', to: 'pricing', label: 'Final fare' },
      { from: 'payments', to: 'card-network', label: 'Charge card' },
      { from: 'payments', to: 'docstore', label: 'Save receipt' },
      { from: 'payments', to: 'kafka', label: 'Trip paid event' },
      { from: 'kafka', to: 'ml-platform', label: 'Training data' },
    ],
    flows: [
      {
        id: 'request-ride',
        title: 'You request a ride',
        emoji: '🙋',
        steps: [
          {
            from: 'rider-app',
            to: 'edge',
            narration: 'You tap Request. Your app sends a small HTTPS message with your pickup spot and ride type to Uber\'s load balancers.',
          },
          {
            from: 'edge',
            to: 'api-gateway',
            narration: 'A load balancer picks a healthy server, and the API gateway checks that you are logged in before passing the request along.',
          },
          {
            from: 'api-gateway',
            to: 'dispatch',
            narration: 'The gateway hands your ride request to the matching service, whose whole job is pairing riders with drivers.',
          },
          {
            from: 'dispatch',
            to: 'location',
            narration: 'Matching asks, "Which free drivers are near this pickup?" The location service checks your hexagon and the ones around it.',
          },
          {
            from: 'dispatch',
            to: 'ml-platform',
            narration: 'For each nearby driver, an ML model predicts how many minutes they need to reach you, which is smarter than straight-line distance.',
          },
          {
            from: 'dispatch',
            to: 'push',
            narration: 'The driver with the best arrival time is chosen, and the offer is handed to the push platform for instant delivery.',
          },
          {
            from: 'push',
            to: 'driver-app',
            narration: "The driver's phone lights up with your trip. When they tap Accept, the trip is saved and your app shows their name, car and ETA.",
          },
        ],
      },
      {
        id: 'car-moves',
        title: "Your driver's car moves on the map",
        emoji: '🚗',
        steps: [
          {
            from: 'driver-app',
            to: 'edge',
            narration: "Every few seconds the driver app sends a tiny GPS update: where the car is and which way it's heading.",
          },
          {
            from: 'edge',
            to: 'api-gateway',
            narration: 'Huge numbers of these little pings arrive, so load balancers spread them across many servers before the gateway routes them.',
          },
          {
            from: 'api-gateway',
            to: 'location',
            narration: "The location service updates the driver's latest position and files it under the H3 hexagon the car is now in.",
          },
          {
            from: 'location',
            to: 'kafka',
            narration: 'It also publishes a "driver moved" event to Kafka, so any service that cares can react without slowing the location service down.',
          },
          {
            from: 'kafka',
            to: 'push',
            narration: "The push platform reads those events and picks out the ones that belong to active trips, like yours.",
          },
          {
            from: 'push',
            to: 'rider-app',
            narration: 'The new position travels down the connection your app already has open, and the app smoothly slides the car icon to its new spot.',
          },
        ],
      },
      {
        id: 'pay-trip',
        title: 'You pay at the end of the trip',
        emoji: '💳',
        steps: [
          {
            from: 'driver-app',
            to: 'edge',
            narration: 'You arrive and the driver taps End Trip. The app sends that message to Uber just like any other request.',
          },
          {
            from: 'edge',
            to: 'api-gateway',
            narration: 'The request passes through the load balancers, and the gateway confirms it really came from the driver on this trip.',
          },
          {
            from: 'api-gateway',
            to: 'payments',
            narration: 'The gateway tells the payments service the trip is over, so it can start settling up.',
          },
          {
            from: 'payments',
            to: 'pricing',
            narration: 'Payments asks pricing for the final fare, which is usually the price you were shown up front plus extras like tips or tolls.',
          },
          {
            from: 'payments',
            to: 'card-network',
            narration: 'Payments asks an outside payment processor to charge your saved card, and waits for an "approved" answer.',
          },
          {
            from: 'payments',
            to: 'docstore',
            narration: 'The receipt and the driver\'s earnings are saved in the trip database so they show up in both apps.',
          },
          {
            from: 'payments',
            to: 'kafka',
            narration: 'Finally a "trip paid" event goes onto Kafka. Receipt emails, rating prompts and analytics each pick it up on their own, a few moments later.',
          },
        ],
      },
    ],
  },

  files: [
    { path: 'mobile/rider-ios/RequestRide/RequestRideBuilder.swift', note: 'RIBs builder: creates the Request Ride screen and hands it what it needs' },
    { path: 'mobile/rider-ios/RequestRide/RequestRideInteractor.swift', note: 'RIBs interactor: business logic, like what happens when you tap Request' },
    { path: 'mobile/rider-ios/RequestRide/RequestRideRouter.swift', note: 'RIBs router: attaches child screens such as "Finding your driver"' },
    { path: 'mobile/rider-android/map/LiveMapViewModel.kt', note: "Smoothly animates the driver's car between GPS updates (see Code)" },
    { path: 'mobile/driver-android/location/LocationReporter.kt', note: "Sends the driver's GPS position to the backend every few seconds" },
    { path: 'web/rider-web/src/pages/RequestRide.tsx', note: 'Browser version of the booking screen, built with React and Base Web' },
    { path: 'idl/dispatch/v1/dispatch.proto', note: 'The contract listing which calls the dispatch service accepts' },
    { path: 'services/gateway/routes.yaml', note: 'Maps public app URLs like /v1/rides to internal services' },
    { path: 'services/location/ingest.go', note: "Receives GPS pings and updates each driver's current H3 cell" },
    { path: 'services/dispatch/matcher.go', note: 'Finds the best nearby driver using hexagons and ETAs (see Code)' },
    { path: 'services/pricing/surge_sketch.py', note: 'Prototype of surge multipliers per hexagon (see Code)' },
    { path: 'services/payments/src/main/java/com/example/payments/TripPaidPublisher.java', note: 'Publishes a TRIP_PAID event to Kafka (see Code)' },
    { path: 'services/push/stream_server.go', note: 'Holds open connections to phones and streams trip updates to them' },
    { path: 'storage/schemas/trips.sql', note: 'Simplified trips table and the queries that use it (see Code)' },
    { path: 'infra/kafka/topics.yaml', note: 'Declares event topics such as driver-locations and trip-events' },
    { path: 'data/pipelines/trips_to_lake.py', note: 'Spark job that copies trip events from Kafka into Apache Hudi tables' },
    { path: 'ml/eta/train_eta_model.py', note: 'Trains the arrival-time model on past trips and registers it for serving' },
    { path: 'observability/tracing.go', note: 'Adds Jaeger tracing so one request can be followed across services' },
  ],

  code: [
    {
      id: 'go-matcher',
      title: 'Find the closest driver with H3 hexagons',
      file: 'services/dispatch/matcher.go',
      language: 'Go',
      explanation:
        "Instead of measuring the distance to every driver on Earth, the matcher only looks inside the pickup hexagon and the six hexagons touching it. It then asks an ETA model which of those drivers can arrive soonest. Real dispatch systems often match many riders and drivers together, but the \"look nearby first\" idea is the same.",
      code: `package dispatch

import (
    "math"

    "example.com/rides/geo" // thin wrapper around Uber's open-source H3 library
)

// Driver is an online driver that the location service knows about.
type Driver struct {
    ID       string
    Lat, Lng float64
}

// Matcher keeps free drivers bucketed by the H3 hexagon they are in.
type Matcher struct {
    DriversByCell map[geo.Cell][]Driver
    PredictETA    func(d Driver, lat, lng float64) float64 // minutes, from an ML model
}

// BestDriver checks the pickup hexagon plus the ring of hexagons around it,
// then returns the driver who can arrive soonest.
func (m *Matcher) BestDriver(lat, lng float64) (Driver, bool) {
    pickup := geo.CellAt(lat, lng, 9) // resolution 9: each hexagon is about 0.1 km²

    var best Driver
    bestETA := math.Inf(1)
    for _, cell := range geo.GridDisk(pickup, 1) { // the center cell + its 6 neighbors
        for _, d := range m.DriversByCell[cell] {
            if eta := m.PredictETA(d, lat, lng); eta < bestETA {
                best, bestETA = d, eta
            }
        }
    }

    // Nobody nearby? The caller can retry with a bigger ring (2, 3, ...).
    return best, !math.IsInf(bestETA, 1)
}`,
    },
    {
      id: 'java-kafka-producer',
      title: 'Announce "trip paid" on Kafka',
      file: 'services/payments/src/main/java/com/example/payments/TripPaidPublisher.java',
      language: 'Java',
      explanation:
        "After charging a rider, the payments service doesn't call the receipt, earnings and analytics systems one by one. It publishes a single TRIP_PAID event to a Kafka topic, and each of those systems reads it on its own schedule. Using the trip id as the message key keeps all events for one trip in order.",
      code: `package com.example.payments;

import java.util.Properties;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;

public class TripPaidPublisher implements AutoCloseable {
    private static final String TOPIC = "trip-events";
    private final KafkaProducer<String, String> producer;

    public TripPaidPublisher(String brokers) {
        Properties props = new Properties();
        props.put("bootstrap.servers", brokers);
        props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("acks", "all"); // wait until the event is safely copied to several brokers
        this.producer = new KafkaProducer<>(props);
    }

    /** Receipts, driver earnings and analytics all listen for this event. */
    public void publish(String tripId, long fareCents, String currency) {
        String json = """
            {"type":"TRIP_PAID","tripId":"%s","fareCents":%d,"currency":"%s"}
            """.formatted(tripId, fareCents, currency);

        // Same key = same partition, so events for one trip stay in order.
        ProducerRecord<String, String> record = new ProducerRecord<>(TOPIC, tripId, json);
        producer.send(record, (metadata, error) -> {
            if (error != null) {
                System.err.println("Could not publish trip " + tripId + ": " + error.getMessage());
            }
        });
    }

    @Override
    public void close() {
        producer.close(); // sends anything still waiting, then disconnects
    }
}`,
    },
    {
      id: 'kotlin-live-map',
      title: 'Slide the car smoothly between GPS updates',
      file: 'mobile/rider-android/map/LiveMapViewModel.kt',
      language: 'Kotlin',
      explanation:
        "GPS updates from the driver arrive only every few seconds, so jumping the car icon from point to point would look jerky. This ViewModel slides the car from its current spot to the new one in small steps, and collectLatest cancels an unfinished animation as soon as a newer update arrives. The map screen just observes carPosition and redraws the marker.",
      code: `package com.example.rider.map

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

data class LatLng(val lat: Double, val lng: Double)

class LiveMapViewModel(driverUpdates: Flow<LatLng>) : ViewModel() {
    private val _carPosition = MutableStateFlow<LatLng?>(null)
    val carPosition: StateFlow<LatLng?> = _carPosition // the map screen observes this

    init {
        viewModelScope.launch {
            // collectLatest cancels an unfinished slide when a newer update arrives
            driverUpdates.collectLatest { target ->
                val start = _carPosition.value ?: target
                slide(start, target)
            }
        }
    }

    // Move the car from start to target over about one second, in 30 small steps.
    private suspend fun slide(start: LatLng, target: LatLng, steps: Int = 30) {
        for (i in 1..steps) {
            val t = i.toDouble() / steps
            _carPosition.value = LatLng(
                lat = start.lat + (target.lat - start.lat) * t,
                lng = start.lng + (target.lng - start.lng) * t,
            )
            delay(1000L / steps)
        }
    }
}`,
    },
    {
      id: 'python-surge',
      title: 'Surge pricing sketch per hexagon',
      file: 'services/pricing/surge_sketch.py',
      language: 'Python',
      explanation:
        "Surge pricing compares demand (riders asking for cars) with supply (free drivers) inside each hexagon. When riders clearly outnumber drivers the multiplier rises, which encourages more drivers to head there, and a cap stops it from growing forever. Uber's real pricing models are far richer, so treat this as the core intuition only.",
      code: `"""Surge pricing sketch: compare riders vs. free drivers in each H3 hexagon."""
from collections import Counter
from dataclasses import dataclass

BASE_FARE = 2.50    # dollars
PER_MINUTE = 0.35
PER_KM = 1.10
MAX_MULTIPLIER = 3.0


@dataclass
class Quote:
    fare: float
    multiplier: float


def surge_multipliers(requests: list[str], free_drivers: list[str]) -> dict[str, float]:
    """Each list holds one H3 cell id per open ride request or idle driver."""
    demand, supply = Counter(requests), Counter(free_drivers)
    multipliers = {}
    for cell, riders in demand.items():
        ratio = riders / max(supply[cell], 1)  # max() avoids dividing by zero
        # No surge until riders outnumber drivers, then grow gently up to the cap.
        multipliers[cell] = min(MAX_MULTIPLIER, max(1.0, 1.0 + 0.5 * (ratio - 1.0)))
    return multipliers


def quote(cell: str, minutes: float, km: float, multipliers: dict[str, float]) -> Quote:
    m = multipliers.get(cell, 1.0)
    fare = (BASE_FARE + PER_MINUTE * minutes + PER_KM * km) * m
    return Quote(fare=round(fare, 2), multiplier=m)


if __name__ == "__main__":
    downtown, suburb = "89283082803ffff", "89283082807ffff"
    requests = [downtown] * 12 + [suburb] * 2
    drivers = [downtown] * 4 + [suburb] * 5
    surge = surge_multipliers(requests, drivers)
    print(quote(downtown, minutes=14, km=6.2, multipliers=surge))
    # Quote(fare=28.44, multiplier=2.0)`,
    },
    {
      id: 'sql-trips',
      title: 'A simplified trips table',
      file: 'storage/schemas/trips.sql',
      language: 'SQL',
      explanation:
        "A trip is one row that moves through statuses from REQUESTED to COMPLETED. The index makes \"show my past trips\" fast, and the UPDATE only succeeds while the trip is still REQUESTED, so two drivers can't both accept the same ride. Uber's real trip data is spread across many MySQL machines, but these ideas still apply.",
      code: `-- Simplified trips table (MySQL 8 syntax).
CREATE TABLE trips (
  trip_id       VARCHAR(40)   PRIMARY KEY,
  rider_id      VARCHAR(40)   NOT NULL,
  driver_id     VARCHAR(40)   NULL,          -- empty until a driver accepts
  product       VARCHAR(20)   NOT NULL,      -- 'UberX', 'Comfort', 'UberXL'
  status        VARCHAR(20)   NOT NULL DEFAULT 'REQUESTED',
  pickup_h3     CHAR(15)      NOT NULL,      -- H3 hexagon of the pickup point
  pickup_lat    DECIMAL(9,6)  NOT NULL,
  pickup_lng    DECIMAL(9,6)  NOT NULL,
  fare_cents    INT           NULL,          -- money as whole cents, never floats
  currency      CHAR(3)       NOT NULL DEFAULT 'USD',
  requested_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at  TIMESTAMP     NULL,
  CHECK (status IN ('REQUESTED', 'ACCEPTED', 'ON_TRIP', 'COMPLETED', 'CANCELED'))
);

-- "Your trips" screen: look up by rider, newest first.
CREATE INDEX idx_trips_rider_time ON trips (rider_id, requested_at);

-- A driver accepts. Only works if nobody else accepted first.
UPDATE trips
SET driver_id = 'driver-42', status = 'ACCEPTED'
WHERE trip_id = 'trip-1001' AND status = 'REQUESTED';

-- Show a rider's last 20 finished trips.
SELECT trip_id, product, fare_cents, currency, completed_at
FROM trips
WHERE rider_id = 'rider-7' AND status = 'COMPLETED'
ORDER BY requested_at DESC
LIMIT 20;`,
    },
  ],

  playground: {
    title: 'Mini Uber: request a ride',
    description:
      'A stylized city map with a car that drives to your pickup pin, a "Where to?" sheet, ride options you can tap, and a Request button that walks through the matching states.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mini Uber</title>
<style>
:root {
  --brand: #000000; /* @tweak color "Brand color" */
  --accent: #276EF1; /* @tweak color "Accent color" */
  --map: #E6EBEF; /* @tweak color "Map color" */
  --road: #FFFFFF; /* @tweak color "Road color" */
  --radius: 14px; /* @tweak range 0 32 "Corner radius" */
}
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fff; color: #111; }

/* The map: two repeating gradients draw a grid of streets every 90px */
.map {
  position: relative; height: 300px; overflow: hidden;
  background-color: var(--map);
  background-image:
    linear-gradient(90deg, transparent 44%, var(--road) 44%, var(--road) 56%, transparent 56%),
    linear-gradient(0deg, transparent 44%, var(--road) 44%, var(--road) 56%, transparent 56%);
  background-size: 90px 90px;
}
.park, .lake { position: absolute; width: 64px; height: 64px; border-radius: var(--radius); }
.park { left: 58px; top: 148px; background: #CFE8C8; }
.lake { left: 148px; top: 58px; background: #C6DDF5; }
.pill {
  position: absolute; top: 12px; left: 12px; right: 12px; z-index: 2;
  background: #fff; border-radius: var(--radius); padding: 10px 14px;
  font-size: 14px; font-weight: 600; box-shadow: 0 2px 10px rgba(0,0,0,.15);
}
/* Pickup pin with a pulsing ring in the accent color */
.pin {
  position: absolute; left: 214px; top: 88px; width: 22px; height: 22px;
  border-radius: 50%; background: var(--brand); border: 6px solid #fff;
  animation: ping 1.6s infinite;
}
@keyframes ping { from { box-shadow: 0 0 0 0 var(--accent); } to { box-shadow: 0 0 0 16px transparent; } }
.tag { position: absolute; left: 242px; top: 72px; background: var(--brand); color: #fff; font-size: 12px; padding: 4px 8px; border-radius: var(--radius); }
.car {
  position: absolute; left: 31px; top: 211px; width: 28px; height: 28px;
  line-height: 28px; text-align: center; font-size: 22px;
  transition: left .6s, top .6s;
}
/* Drive right along one street, then turn up the next one */
.car.moving { left: 211px; top: 126px; transition: left 1.6s ease-in, top 1.2s ease-out 1.6s; }

/* Bottom sheet */
.sheet {
  position: relative; margin-top: -20px; background: #fff; padding: 10px 16px 20px;
  border-radius: var(--radius) var(--radius) 0 0; box-shadow: 0 -4px 16px rgba(0,0,0,.12);
}
.handle { width: 40px; height: 4px; border-radius: 2px; background: #ddd; margin: 0 auto 10px; }
h2 { margin: 0 0 10px; font-size: 22px; }
.search { background: #EEE; border-radius: var(--radius); padding: 12px 14px; font-size: 15px; margin-bottom: 12px; }
.ride {
  display: flex; align-items: center; gap: 12px; width: 100%; padding: 10px 12px; margin-bottom: 8px;
  background: #fff; border: 2px solid transparent; border-radius: var(--radius);
  font: inherit; color: inherit; text-align: left; cursor: pointer;
}
.ride.selected { border-color: var(--brand); background: #F6F6F6; }
.icon { font-size: 28px; }
.info { flex: 1; }
.name { display: block; font-weight: 700; }
.meta { font-size: 13px; color: #666; }
.price { font-weight: 700; }
.request {
  width: 100%; padding: 16px; margin-top: 4px; border: 0; border-radius: var(--radius);
  background: var(--brand); color: #fff; font: inherit; font-size: 17px; font-weight: 700; cursor: pointer;
}
.request.busy { background: var(--accent); animation: breathe .9s infinite alternate; }
@keyframes breathe { to { opacity: .75; } }
</style>
</head>
<body>
<div class="map">
  <div class="pill" id="status">Choose a ride</div>
  <div class="park"></div>
  <div class="lake"></div>
  <div class="pin"></div>
  <div class="tag" data-edit="pickup">Pickup</div>
  <div class="car" id="car">🚗</div>
</div>

<div class="sheet">
  <div class="handle"></div>
  <h2 data-edit="title">Where to?</h2>
  <div class="search" data-edit="destination">Home · 24 Market St</div>

  <button class="ride selected">
    <span class="icon">🚗</span>
    <span class="info"><span class="name" data-edit="ride1">UberX</span><span class="meta">4 seats · 3 min away</span></span>
    <span class="price">$14.20</span>
  </button>
  <button class="ride">
    <span class="icon">🚙</span>
    <span class="info"><span class="name" data-edit="ride2">Comfort</span><span class="meta">Newer cars · 4 min away</span></span>
    <span class="price">$18.60</span>
  </button>
  <button class="ride">
    <span class="icon">🚐</span>
    <span class="info"><span class="name" data-edit="ride3">UberXL</span><span class="meta">6 seats · 6 min away</span></span>
    <span class="price">$24.90</span>
  </button>

  <button class="request" id="request">Request UberX · $14.20</button>
</div>

<script>
var rides = document.querySelectorAll('.ride');
var button = document.getElementById('request');
var statusPill = document.getElementById('status');
var car = document.getElementById('car');
var state = 'idle'; // idle -> finding -> arriving -> arrived

function requestLabel() {
  var card = document.querySelector('.ride.selected');
  return 'Request ' + card.querySelector('.name').textContent + ' · ' + card.querySelector('.price').textContent;
}

// 1. Tap a ride card to select it
rides.forEach(function (card) {
  card.addEventListener('click', function () {
    if (state !== 'idle') return; // no switching rides mid-request
    rides.forEach(function (c) { c.classList.remove('selected'); });
    card.classList.add('selected');
    button.textContent = requestLabel();
  });
});

// 2. Request: pretend the server is matching, then send the car
button.addEventListener('click', function () {
  if (state === 'idle') {
    state = 'finding';
    button.textContent = 'Finding your driver…';
    button.classList.add('busy');
    statusPill.textContent = 'Checking drivers in nearby hexagons';
    setTimeout(function () {
      state = 'arriving';
      button.textContent = 'Driver arriving';
      statusPill.textContent = 'Sam is 2 min away in a grey Prius';
      car.classList.add('moving'); // the CSS transition drives the car
    }, 2000);
  } else if (state === 'arrived') {
    state = 'idle'; // reset for another go
    car.classList.remove('moving');
    statusPill.textContent = 'Choose a ride';
    button.textContent = requestLabel();
  }
});

// 3. When the car finishes its last turn, it has arrived
car.addEventListener('transitionend', function (e) {
  if (e.propertyName !== 'top' || state !== 'arriving') return;
  state = 'arrived';
  statusPill.textContent = 'Your driver is here';
  button.textContent = 'Ride again';
  button.classList.remove('busy');
});
</script>
</body>
</html>`,
    challenges: [
      'Use the Brand color and Accent color tweaks to reskin the app, then watch the pin pulse and the busy button change color.',
      'Tap "UberX" in the preview and rename it (maybe "Scooter"), select it, and check that the Request button uses your new name.',
      'In the script, change the 2000 ms timeout to 5000 to feel how a slow matching service makes waiting worse.',
      'Copy one of the ride buttons to add a fourth option called "Green" with its own emoji and price, and make sure it can be selected.',
    ],
  },

  concepts: [
    {
      term: 'Geospatial indexing (H3)',
      meaning: 'Filing locations into map cells (Uber uses hexagons) so finding what is nearby means checking a few cells instead of every point on Earth.',
    },
    {
      term: 'Microservices',
      meaning: 'Building one big product out of many small programs that each do one job, are deployed separately and talk over the network.',
    },
    {
      term: 'Event streaming (Kafka)',
      meaning: 'Services publish facts like "trip ended" to a shared, ordered log that any other service can read whenever it is ready.',
    },
    {
      term: 'Dynamic (surge) pricing',
      meaning: 'Prices that rise when riders outnumber free drivers in an area, nudging more drivers to go where people are waiting.',
    },
    {
      term: 'ETA prediction',
      meaning: 'Combining map routing with machine learning trained on past trips to estimate how many minutes a car will take to arrive.',
    },
    {
      term: 'Eventual consistency',
      meaning: 'Different parts of the system may briefly disagree (your receipt appears a moment after you pay), but they all catch up shortly.',
    },
    {
      term: 'Real-time push',
      meaning: 'The server sends updates down a connection that is already open the moment something changes, instead of the app asking again and again.',
    },
    {
      term: 'Distributed tracing',
      meaning: 'Tagging a request with an id so you can follow its path and timing through every service it touches, which is what Jaeger does.',
    },
  ],

  buildYourOwn: [
    {
      step: 'Sketch the three screens',
      detail: 'Draw the map with a pickup pin, the ride picker, and the "driver arriving" state in Figma or on paper before writing any code.',
    },
    {
      step: 'Build the rider app',
      detail: 'Use Expo (React Native) with react-native-maps to show a map, a pickup pin, a few ride options and a Request button.',
    },
    {
      step: 'Make a tiny backend',
      detail: 'Create endpoints like POST /rides and POST /drivers/location using Node.js with Express, or Python with FastAPI.',
    },
    {
      step: 'Store trips and find nearby drivers',
      detail: 'Save trips in Supabase (hosted Postgres) and use the h3-js library to group drivers by hexagon for quick "who is near me?" lookups.',
    },
    {
      step: 'Move the car in real time',
      detail: 'Send driver positions to the rider with WebSockets (Socket.IO) or Supabase Realtime, and animate the marker between updates.',
    },
    {
      step: 'Take test payments',
      detail: 'Add Stripe in test mode so each trip ends with a pretend charge and a receipt screen, without touching real money.',
    },
  ],

  sources: [
    { label: 'Uber (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Uber' },
    { label: 'Uber Engineering Blog', url: 'https://www.uber.com/blog/engineering/' },
    { label: 'H3 geospatial indexing system', url: 'https://h3geo.org/' },
    { label: 'RIBs mobile architecture (GitHub)', url: 'https://github.com/uber/RIBs' },
    { label: 'Jaeger distributed tracing', url: 'https://www.jaegertracing.io/' },
  ],
};
