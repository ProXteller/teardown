# Teardown: Devpost submission copy

> Paste-ready copy for the RevenueCat Shipaton 2026 Devpost form (deadline **Sep 30, 2026, 11:45 PM PDT**) and for
> the TXST Shipaton local form (due **tonight, Sep 14, 11:59 PM**). Fact-checked against the code on Sep 14 at 3:15 PM;
> the live research parts (sections 8–11, How we built it, Challenges) were updated at 7 PM.
> Before you paste, read it once and put it in your own words. RevenueCat's submission guide says not to let AI write
> your whole description (AI help with spelling and formatting is fine), so treat this as a fact sheet and outline, not
> final copy. Fill in the `[brackets]`.
>
> **Gate before pasting (7 PM status):** the Ask Teardown assistant (section 8) is now on screen (`AgentDock` is
> rendered by `src/app/t/[id].tsx`). Still confirm both demo prompts in the app. If they don't work, delete section 8,
> the agent bullet under "How we built it", and the assistant lines in Accomplishments and What we learned.
>
> **Built vs. future:** everything from "What it does" through "What we learned" was built during the hackathon on
> Sep 14. Only "What's next" is future work.

---

## Project overview

**Project name:** Teardown

**Tagline (44 chars):** See how any app or website is actually built

Backups: `Tear down any app. See how it's really built.` (45) · `The X-ray for apps, made for CS students` (40)

**Elevator pitch (under 200 chars):**
Type an app or paste a link. Teardown shows how it's built: its story, tech stack, an interactive system map, teaching
code, and a playground you can remix. Made for beginner CS students.

**Thumbnail (3:2):** the Instagram System tab mid-animation (packet on the "You post a photo" flow) on the left,
with the rebuilt mobile.txst.edu playground on the right, on the app's dark grid background.

---

## Inspiration

Most CS freshmen open Instagram, Spotify and Canvas every day. Almost none of us could explain what happens between
tapping "like" and a friend seeing it. Intro courses teach loops and linked lists. The distance from there to an app
used by 3 billion people feels huge, and the real answers are buried in engineering blogs, conference talks and
DevTools tabs that beginners don't know exist.

We wanted the thing we wished we'd had in our first semester at Texas State: type an app you love and it takes that
app apart for you, honestly, at a beginner's level, with pieces you can actually touch.

## What it does

Search for an app name or paste a URL. Teardown builds an interactive breakdown with six tabs (Story, Stack, System,
Code, Playground, Learn), plus an assistant that can drive them.

**1. Story.** A plain-English "how it works" explanation, quick facts (founders, launch, parent company), and a
history timeline. Instagram's runs from its 2010 iPhone launch to Threads in 2023.

**2. Stack.** Languages by relative emphasis (the app says the percentages aren't lines of code), then the tech stack
layer by layer (Frontend, Mobile, Backend, Data, Infrastructure, AI/ML, DevOps). Every item carries a **CONFIRMED**
or **LIKELY** badge, so students learn to tell documented fact from educated inference.

**3. Live scan (inside Stack).** For a public website, Teardown's server fetches the page's HTML and response headers
and matches them, plus the Content-Security-Policy, against 104 fingerprint rules. It **shows the evidence** for each
detection, for example "The server header says Apache" or "Loads jquery.js". It's the detective work a developer
does in DevTools, explained. Sites that block bots or time out (7 s) say so and fall back to what's known offline.

**4. System map.** An interactive architecture diagram in tiers (clients, edge, API, services, data). Tap any box to
see what it does and what it connects to. Tap a request like **"You post a photo"** and a packet animates hop by hop
(iPhone app → load balancer → Django web servers → photo storage → PostgreSQL shards → task queue → background
workers → Cassandra), with a narration card for each step and play, pause and step controls. For curated apps the
map is a simplified version of the publicly documented architecture.

**5. Code.** Syntax-highlighted teaching snippets from different layers (for Instagram: a Swift double-tap-to-like, a
sharded "save a like" path, unique IDs across shards, Android feed paging and a React post card), plus an
illustrative project file tree. The app labels snippets as simplified examples and the tree as illustrative, not
private source code.

**6. Playground.** A live mini-clone of the app's signature screen with **two-way editing**:
- Drag a slider or tap a color and the matching CSS variable changes in the code. A toast shows the exact line.
- Edit the HTML/CSS/JS and the preview reloads about half a second after you stop typing.
- Turn on "Edit text on the screen", type directly on the rendered page, and the code rewrites itself.
- Beginner challenges give a next step (Instagram: "Make a dark mode by setting --bg to #000000 and --text to
  #FFFFFF").

**7. Learn.** Interview-ready concepts (sharding, caching, fan-out, CDNs…), a "build a tiny version yourself"
roadmap, and sources. A separate **Roadmap** tab turns the teardown into a learning path for the career you pick.

**8. Ask Teardown (AI assistant).** A floating chat that knows the teardown you're looking at and **drives the UI**
instead of only replying with text. Ask "What happens when I like a post?" and it explains, switches to the System
tab and plays that request flow. Say "make it dark mode" and it edits the playground live. Its action vocabulary also
covers highlighting a box on the map, opening a code snippet, expanding a stack layer or concept, and resetting the
playground. Each change shows a receipt and a "Show me again" button. A built-in, rule-based engine answers with no
API key, and tweaks, playground edits and roadmap requests always stay on it, so those are instant. With a free
Google Gemini key, live questions and questions about non-curated apps go to **Gemini** with the same typed tools.
For live questions (the
CEO, user numbers, the latest news, pricing…) it can also read the teardown's source pages plus pages found for the
app (Wikipedia, the official site) with its URL Context tool, and lists them under **From the web**. In a real test,
"Who is the CEO of Spotify right now, and how many monthly users?" came back in about 22 seconds with the co-CEOs and
the monthly active users, citing newsroom.spotify.com/company-info and Spotify's Wikipedia article. **Claude with tool
use** is supported as the other engine. A pill shows which engine replied (BUILT-IN, GEMINI or CLAUDE).
`[Confirm both demo prompts work in the app before pasting.]`

**9. Instant teardowns, even with no AI.** Fourteen apps ship as curated teardowns written from public engineering
blogs, talks and Wikipedia: Instagram, Facebook, YouTube, TikTok, Spotify, Netflix, X, Reddit, Discord, WhatsApp,
Uber, Amazon, Google and ChatGPT. Anything else (like `mobile.txst.edu`, `notion.so` or `linear.app`) gets an
**instant teardown first**, with or without an AI key, assembled in a few milliseconds once the live scan returns (the scan
itself takes about 0.4 to 2 seconds). It combines:
- the live scan (confirmed tech, with evidence)
- facts and history for 105 well-known products (Texas State University included)
- one of 14 product archetypes (social, media, commerce, education…) for the system map, flows, code and playground
- 74 technology packs that explain each detected framework, host or service
- a **playground rebuilt from the real page** (its actual menu, headings, text and buttons, in a simple mobile
  layout). Pages with too little readable HTML get the archetype's example screen, labeled as an example.

With an AI key, live research then upgrades it (next section). Any part that fails keeps the instant version, so a
tab never stays broken.

**10. Live research, free with Google Gemini.** With `GEMINI_API_KEY` set, the instant teardown still shows up right
away, with a banner that says "Researching Linear live · 1/2 tabs updated". The Story & Stack and System map tabs
then upgrade in place with sourced facts, and the header chip changes to **LIVE · GEMINI**. Code and Playground stay
instant, because the playground is already rebuilt from the real page. If anything fails, the instant version stays
and the banner offers "Try live research again".
- **Find real pages (about 1 second):** Wikipedia (REST API), the product's own About, Company, Careers and Blog pages,
  its GitHub organization (the languages of its most-starred repos) and Hacker News engineering stories (Algolia API).
- **Read them:** Gemini reads those pages with its URL Context tool and writes JSON that's validated against the same
  schemas as every other teardown.
- **Cite them:** the sources are the pages Gemini actually retrieved, listed under Learn → Sources.
- **Measured today:** `linear.app` came back with founders Karri Saarinen, Jori Lallo and Tuomas Artman, founded
  2019, and its local-first sync engine (IndexedDB, MobX), sourced from linear.app/about, /company, /careers and
  github.com/linear. A Figma request through the running app's API took 30 seconds: founded 2012 by Dylan Field and
  Evan Wallace, listed as NYSE: FIG, built with WebAssembly, WebGL and React, sourced from Wikipedia, GitHub and
  figma.com.
- **Roadmap picks:** Gemini also suggests current courses and videos for the Roadmap tab, added on top of the verified
  resource library. Every link is checked on the server (an HTTP check, plus YouTube oEmbed for videos) before it's
  shown, and broken or unrelated picks are dropped.
- Google Search grounding is an opt-in for billing-enabled keys only (`GEMINI_GOOGLE_SEARCH=on`), because free keys
  are refused. **Claude** (`ANTHROPIC_API_KEY`) is still supported for teardown upgrades, grounded in the live scan.

**11. Teardown Pro (RevenueCat).** A monthly subscription through the RevenueCat SDK (`pro` entitlement). Curated
teardowns are always free, and so are the first 2 AI teardowns (each finished live research counts as one). Pro
unlocks unlimited AI teardowns.

## How we built it

- **Expo SDK 57 + React Native 0.86 + TypeScript**, with **Expo Router** for screens (typed routes, React Compiler on)
  and **Expo Router API routes** for the server: `/api/scan`, `/api/teardown`, `/api/agent`, `/api/roadmap`,
  `/api/status`. One
  codebase targets iOS, Android and web, and the API routes are set up to deploy to EAS Hosting (not deployed yet).
- **Live scanning:** a server route fetches the page (7 s timeout, 600 KB cap, localhost and private-network hosts
  refused), runs header/HTML/CSP fingerprint rules that each keep a human-readable "why", and extracts a page outline
  (nav, headings, paragraphs, buttons) with a regex-based parser, since there's no DOM on the server.
- **Offline engine** (`src/lib/offline/`): classification into 14 archetypes (known products first, `.edu` domains go
  to education, keyword scoring does the rest). Archetype templates use `{{name}}`, `{{brand}}`, `{{frontend}}` and
  `{{hosting}}` placeholders, filled from detected tech, known-product facts and tech packs. Scan detections and
  documented known-product tech are marked confirmed and listed first; archetype patterns are marked likely.
  Validation scripts check every template's edges, flows and playground contract.
- **Two AI engines, one pipeline** (`src/lib/llm/provider.ts`): Google Gemini is preferred when `GEMINI_API_KEY` is
  set (free tier), Claude when only `ANTHROPIC_API_KEY` is. The app always shows the instant teardown first, then
  upgrades Story & Stack and System map with one structured call each, which keeps a teardown to 2 requests. Scan
  evidence goes into the prompt as ground truth, and "confirmed" is only allowed for documented sources or scan
  evidence. A `normalize()` pass still drops dangling edges and clamps out-of-range tiers so the map can't break.
- **Free live research with Gemini** (`src/lib/research/discover.ts`, `src/lib/llm/research.ts`, official
  `@google/genai` SDK): the server finds real pages about the product in parallel (Wikipedia REST API, the product's
  About/Company/Careers/Blog pages, its GitHub organization, Hacker News through Algolia) in about a second. Gemini
  reads them with URL Context and answers against a JSON schema generated from the same Zod types; the answer is
  validated before it's used. Sources come from the pages Gemini actually retrieved. Links the model typed itself are
  checked, and ones proven dead are dropped. Google Search grounding stays off unless `GEMINI_GOOGLE_SEARCH=on` is
  set with a billing-enabled key.
- **Gemini model rotation** (`src/lib/llm/gemini.ts`): each Gemini model has its own free quota (Gemini 3.8 Flash
  allows 5 requests a minute and 20 a day on the free tier). The app rotates across Gemini 3.8, 3.7, 3.6 and 3.5 Flash
  and the Flash-Lite models, skipping a model that is rate limited, out of daily quota or overloaded (503). In a real
  run today, 3.8 was out of daily quota and 3.7 was overloaded, so 3.6 Flash answered a Linear teardown in about 22
  seconds.
- **Claude Opus 5 with structured outputs** as the optional engine: each part is one call with its own Zod schema,
  grounded in the live scan.
- **Agent:** one contract (`src/lib/agent/types.ts`) and three engines: a rule-based local agent, Gemini and Claude.
  All return a reply plus a list of typed UI actions (`play_flow`, `highlight_node`, `show_code`, `set_tweak`,
  `edit_text`, `set_playground_code`…) that the app applies in order. The model never touches the UI directly, and
  unknown ids are skipped. Each action is a Zod-typed tool, alongside `search_teardown` and `read_playground` for
  looking things up. Claude runs them through the Anthropic SDK's tool runner. Gemini runs the same tools in a manual
  function-calling loop, plus URL Context for live questions. Code edits that add network calls or external
  resources are rejected. If the AI is unreachable or rate limited, the built-in agent answers instead.
- **Safety:** API keys stay on the server, inside the API routes. Scraped website text and fetched page content go
  into prompts as untrusted data, fenced off from the instructions. The server only fetches public https hosts.
- **System map:** `react-native-svg` Bézier edges laid out by tier, with a packet animated along the active curve and
  auto-advancing narrated steps.
- **Playground bridge:** a playground contract (CSS variables tagged `/* @tweak color|range */` become controls, and
  `data-edit` elements become editable). A small injected bridge talks over `postMessage`, through `react-native-webview`
  on iOS/Android and a sandboxed `iframe` on web. Control changes update CSS variables without a reload, so the screen
  keeps its state. On-screen edits are written back into the source, and the toast names the line.
- **RevenueCat:** `react-native-purchases` with a `pro` entitlement, the current offering's packages,
  `purchasePackage`, `restorePurchases`, and a customer-info listener that keeps Pro state live. We test with a
  RevenueCat Test Store key, which works in Expo Go and on web. With no key, a clearly labeled demo mode unlocks
  locally so we can rehearse.
- Custom lightweight syntax highlighter, AsyncStorage persistence (finished teardowns and history stay on the device),
  Space Grotesk and JetBrains Mono type.

## Challenges we ran into

- **Honesty at scale.** It's easy to make up a confident architecture diagram. Making every claim traceable took real
  design work: CONFIRMED vs LIKELY badges, evidence strings on every detection, "we assumed the site is X.com" when a
  domain was guessed, and example playgrounds that say they're examples.
- **Model output that must render.** A system map with one dangling edge id breaks the drawing. Structured outputs
  fixed the JSON shape. We still needed a repair pass and a per-tab fallback to the instant engine.
- **Two-way sync without losing state.** Typing code reloads the preview (debounced). Dragging a control must *not*
  reload, or the mini-app resets. We ended up with two paths, live CSS-variable messages and full reloads, behind one
  bridge that works in both WebView and iframe.
- **Reading real websites with no DOM.** Server-side outline extraction had to skip cookie banners, "Main navigation"
  style headings and menu chrome. Some sites render entirely in JavaScript, and those fall back to a labeled example
  screen.
- **A demo that can't depend on Wi-Fi.** Hackathon Wi-Fi is unpredictable, so curated teardowns, instant teardowns
  and the built-in assistant all work with no API key and no LLM round trip.
- **Grounding on a free key.** Google Search grounding refuses free Gemini keys. So the server finds the pages
  itself (Wikipedia, the product's own site, GitHub, Hacker News) and Gemini reads them with URL Context.
- **Tiny free quotas.** Gemini 3.8 Flash allows 5 requests a minute and 20 a day on the free tier. We show the
  instant teardown first, research only 2 tabs, keep tweaks and playground edits on the built-in agent, and rotate
  across Gemini models. That paid off today: with 3.8 out of daily quota and 3.7 overloaded, 3.6 Flash still
  answered Linear.

## Accomplishments that we're proud of

- The core works with **zero API keys**: 14 curated teardowns, an instant teardown of any URL, and a built-in
  assistant that edits the UI.
- Typing on a rendered screen and watching the source code change is the moment beginners get it.
- Scanning `mobile.txst.edu` returns real evidence (Apache server header, jQuery, HSTS), Texas State's actual
  history, and a playground rebuilt from the page's own headings and menu.
- An AI assistant that *does things in the app*, not just a chat bubble.
- Free live research that cites real pages: `linear.app` came back with its three founders, its founding year and
  its local-first sync engine, sourced from Linear's own About, Company and Careers pages and its GitHub organization.

## What we learned

- Grounding beats prompting. Handing the model scan evidence and requiring a confidence label is more reliable than
  asking it to "be accurate". Finding the pages ourselves and letting Gemini read them worked on a free key.
- Instant first, AI second. Showing the offline teardown right away and upgrading tabs in place means a slow model,
  a rate limit or a used-up quota never leaves the student staring at a spinner.
- Giving an agent a small, typed action vocabulary makes it safer and testable, and the same actions can come from a
  rule engine or an LLM.
- For beginners, interactivity is the explanation. A packet moving across a map shows what a load balancer does
  faster than a paragraph does.
- RevenueCat's entitlement model let us write the Pro check once, independent of platform.

## What's next

None of this is built yet.

- Ship to the App Store (not published yet), with a free trial or offer code on Pro for judges and students. Google
  Play after that.
- A review pass on every curated teardown, then more of them, starting with apps TXST students use daily (Canvas, TXST
  Mobile).
- Fix archetype fit for university sites (today `.edu` pages get a learning-app template, so some LIKELY items, like
  spaced repetition, don't fit a university homepage).
- Classroom mode: an instructor picks an app, and the class does the playground challenges together.
- "Tear down my repo": point Teardown at your own GitHub project and get the same system map for code you wrote.
- Save and share remixes, track completed challenges, and harden the scanner (rate limits, DNS-level SSRF protection)
  before a public launch.
- Per-user limits on live research and the assistant, so a public deploy can't use up the shared Gemini quota.

## Built with

`expo` · `expo-router` · `react-native` · `typescript` · `react` · `revenuecat` · `react-native-purchases` ·
`google-gemini` · `gemini-api` · `google-genai` · `anthropic` · `claude` · `claude-opus-5` · `wikipedia-api` ·
`github-api` · `react-native-svg` · `react-native-webview` · `zod` · `async-storage` · `eas` · `expo-api-routes` ·
`html` · `css` · `javascript`

---

## Other form fields

| Field | Value |
| --- | --- |
| Public app link | `[App Store URL once live]`. Not published yet. TestFlight links don't count. Not required for Next Gen. |
| Next Gen award (students) | Public repo with an open-source license file: `[GitHub URL]` · demo video: `[YouTube/Vimeo URL]` · register with your `.edu` email |
| Demo video | `[YouTube/Vimeo URL]`, public, under 2:00 (script: `submission/demo-video-script.md`) |
| App icon | `assets/images/icon.png` (1024×1024) |
| Screenshot | 1179×2556, no device frame (see `submission/checklist.md`) |
| RevenueCat project ID | `[from app.revenuecat.com → Project settings]` |
| Judge access | `[free trial on teardown_pro_monthly, or offer code]`. For Next Gen, also explain how to unlock Pro from the repo (see checklist block 10). |
| Categories | Next Gen (students). The Design Award and other standard categories need a published store app. |

## Honesty notes (keep these true)

- Don't claim App Store or Play availability, a deployed API, downloads, users or revenue until they exist.
- Say **curated**, not "hand-checked", unless someone on the team has actually read each of the 14 against its sources.
  Eight of them (Facebook, YouTube, TikTok, X, Reddit, Amazon, Google, ChatGPT) were added this afternoon, and the
  README still says six.
- Curated teardowns come from public engineering blogs, talks and Wikipedia. Code snippets and file trees are
  teaching examples. AI teardowns are educated reconstructions, and the UI says so.
- Pro gates **AI teardowns** (2 free, then Pro). Curated teardowns, playgrounds and the assistant don't count against
  it. Every non-curated search opens on the instant teardown. With a key set, live research upgrades it, a finished
  upgrade counts as one AI teardown, and once a free user has used 2, searching a new non-curated site opens the
  paywall. With no key, or when live research fails, the instant version is what they get.
- Live research on the free tier reads pages with Gemini's **URL Context** tool. Don't say it uses Google Search:
  Search grounding needs a billing-enabled key (`GEMINI_GOOGLE_SEARCH=on`) and isn't on in the demo.
- The Linear, Figma and Spotify results are from test runs on Sep 14. Live answers change with the pages found and
  with quotas, and anything not backed by a page or the scan still shows as LIKELY.
- Some scan detections come from a site's Content-Security-Policy allow-list. The evidence says "allows this service",
  which shows the site permits it, not that every page uses it. Say it that way if asked.
