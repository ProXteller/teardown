# Teardown: see how any app is actually built

You scroll past something amazing, like Instagram, and wonder how it works. Who built it? What language is it written in?
What happens between tapping ❤️ and your friend seeing it? **Teardown** answers that. Type an app name or paste a link
and you get an interactive breakdown made for beginner and intermediate CS students, plus an agent you can ask anything
or tell to change things.

Built at **TXST Shipaton 2026** (Texas State University, September 14, 2026), the local edition of RevenueCat Shipaton.

**Team:** _Name 1_ · _Name 2_ · _Name 3_ · _Name 4_

| Home | System map | Ask Teardown edits the page | Career roadmap |
| --- | --- | --- | --- |
| ![Home](submission/screenshots/01-home.png) | ![System map](submission/screenshots/03-system-flow.png) | ![Agent](submission/screenshots/08-playground-after-agent.png) | ![Roadmap](submission/screenshots/09-career-roadmap.png) |

---

## ✅ Built during the hackathon (September 14, 2026)

Everything in this repository was built during the event. The first commit is the blank `create-expo-app` template
from 12:10 PM; the rest of the history is the hackathon work. Everything listed here runs today:

- **Search any app or website** by name or URL.
- **14 curated teardowns** written from public sources and fact-checked against the web: Instagram, Facebook, YouTube,
  TikTok, Spotify, Netflix, X, Reddit, Discord, WhatsApp, Uber, Amazon, Google Search, ChatGPT.
- **Instant teardowns of any other site**, with no AI key required:
  - **Live scan** of the real site: 100+ header, HTML and security-policy fingerprints, each shown with its evidence.
  - **Known facts** for 105 popular products (founders, history, brand colours), fact-checked against the web.
  - **Product-type templates** for 14 kinds of product (social, commerce, education, and so on), filled with the
    detected tech.
  - **Tech explanations** for 74 technologies the scanner can detect.
- **Six tabs per teardown:**
  - **Story:** plain-English explanation, quick facts and a history timeline.
  - **Stack:** languages and layer-by-layer tech with *confirmed* vs *likely* badges, plus live-scan evidence.
  - **System:** interactive architecture map. Tap a box to see what it does, or play a request ("You post a photo") and
    watch it travel through the system with narration.
  - **Code:** syntax-highlighted teaching snippets and an illustrative project file tree.
  - **Playground:** a live mini-clone you can remix. Controls change the code, the code changes the screen, and typing on
    the screen changes the code. For scanned sites it rebuilds the real page from its actual menu, headings and text.
  - **Learn:** key concepts, a build-your-own roadmap and sources.
- **Ask Teardown agent:** a chat on every teardown that answers questions and drives the screen.
  - It highlights parts of the map, plays request flows, opens code and explains concepts.
  - It edits the playground on request ("make it dark mode", "rename the headline to Hello Bobcats").
  - It works offline with a built-in engine, tested on 228 scripted and 1,104 fuzzed prompts.
  - It uses Claude Opus 5 with tool use when `ANTHROPIC_API_KEY` is set.
- **Career roadmaps:** pick what you want to become (software engineer, web, mobile, cybersecurity, data & AI, cloud &
  DevOps, game dev, UI/UX, or not sure yet). Every teardown gets a **Roadmap** tab: "Build an app like Instagram as a
  future cybersecurity engineer".
  - Five phases: foundations, core skills, building that app's real layers, your path's lens on the app, and portfolio
    and certifications.
  - Checkable steps with mini projects and a capstone.
  - **274 learning resources** (courses, YouTube videos, docs, practice sites). Every link was checked by a script, with
    YouTube confirmed through oEmbed, and reviewed by hand.
- **Live AI research with Google Gemini** (free tier) or Claude: instant teardown first, then each tab upgrades with
  sourced, real-time facts; any failure keeps the instant version.
  - The server finds real pages about the app in about a second: Wikipedia, its own About/Careers/Blog pages, its
    GitHub organization (the languages its code really uses) and Hacker News engineering stories.
  - Gemini reads those pages with its URL Context tool and writes the teardown from them, citing what it read.
  - Model rotation spreads requests across several Gemini models, each with its own free per-minute quota.
  - Google Search grounding can be switched on for billing-enabled keys (`GEMINI_GOOGLE_SEARCH=on`).
- **Claude-generated teardowns** (with an API key): three parallel structured-output calls grounded in the live scan. Any
  part that fails falls back to the instant teardown.
- **Teardown Pro paywall with the RevenueCat SDK** (`src/lib/purchases.ts`, `src/app/paywall.tsx`): offerings, purchase,
  restore, plus a local demo mode when no key is set. It is switched off by default (see below).
- **Runs on iOS, Android and web** from one Expo codebase, with a custom icon and a dark "blueprint" design.

## 🔭 Future ideas (not built yet)

- Publish to the App Store and Google Play with live RevenueCat products and a free trial.
- Deploy the API (EAS Hosting) so phone builds work away from a laptop dev server.
- Scan JavaScript-rendered sites with a headless browser, so apps like Duolingo get real-page playgrounds too.
- Accounts and cloud sync for saved teardowns, playground remixes and chat history.
- Compare two apps side by side ("Instagram vs TikTok: how do their feeds differ?").
- Classroom mode for CS instructors: assign a teardown, quiz students, track progress.
- Community-submitted curated teardowns with review, like a Wikipedia for app architecture.
- Export a playground remix to CodePen or a GitHub repo.
- Voice mode for the agent, and support for more languages.
- Roadmap progress synced across devices, reminders, and "what to learn this week" plans.
- Personalized roadmaps from Claude that still pick only from the verified resource library.

---

## Run it

```bash
npm install
cp .env.example .env        # optional: ANTHROPIC_API_KEY, RevenueCat keys, EXPO_PUBLIC_PAYWALL_ENABLED
npx expo start
```

- Press **w** for web, or scan the QR code with **Expo Go** on a phone on the same Wi-Fi.
- The API routes (`src/app/api/*+api.ts`) run inside the Expo dev server, so there's no separate backend.
- **No API key? Everything still works:** curated teardowns, instant teardowns, live scans, and the built-in Ask
  Teardown agent.
- **Live research (free):** put a free Google Gemini key in `.env` as `GEMINI_API_KEY` (get one at
  [aistudio.google.com](https://aistudio.google.com)) and restart.
  - Any search shows the instant teardown first, then Gemini reads real pages about the app and upgrades each tab.
  - Sources are listed under Learn.
  - Ask Teardown can read the app's Wikipedia article, site and sources for up-to-date answers, and lists them.
  - Roadmaps add newly found courses and videos, each link checked before it's shown.
  - Claude (`ANTHROPIC_API_KEY`) is supported too.

### Tests

```bash
npm run typecheck                                  # TypeScript
npx tsx scripts/validate-data.ts                   # curated teardowns (map links, flows, playground contract)
npx tsx scripts/validate-offline.ts                # templates, tech packs, known products
npx tsx scripts/test-quick-engine.ts --live        # instant teardowns incl. real sites (dev server running)
npx tsx scripts/test-agent.ts                      # built-in agent: 99 cases
npx tsx scripts/agent-battery.ts                   # built-in agent: 228 scripted + 1,104 fuzzed prompts
npx tsx scripts/test-roadmap.ts                    # 9 career paths × 15 apps
npx tsx scripts/verify-resources.ts                # checks every course/video/docs link is live
node scripts/mock-anthropic-agent.mjs & npx tsx scripts/test-agent-api.ts   # Claude agent route against a mock API
npx tsx scripts/test-gemini-pages.ts               # free-tier Gemini: page discovery + URL Context (no key needed)
npx tsx scripts/test-gemini-rotation.ts            # Gemini model rotation, quotas and overloads (no key needed)
node scripts/mock-gemini.mjs & npx tsx scripts/test-gemini-teardown.ts        # Gemini teardown route (Google Search mode)
node scripts/mock-gemini-agent.mjs & npx tsx scripts/test-gemini-agent.ts     # Gemini agent loop (Google Search mode)
npx tsx scripts/test-live-roadmap.ts               # live roadmap picks with real link checks
```

## RevenueCat (Teardown Pro)

The paywall is **off by default** so the app is free during judging. To turn it on:

1. At [app.revenuecat.com](https://app.revenuecat.com), create a project with an **entitlement** `pro` and a monthly
   package in the **current offering**.
2. Put the **Test Store** public key in `.env` as `EXPO_PUBLIC_REVENUECAT_API_KEY` (works in Expo Go and on web). Store
   builds use `EXPO_PUBLIC_REVENUECAT_IOS_KEY` / `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`.
3. Set `EXPO_PUBLIC_PAYWALL_ENABLED=true` and restart. Without keys, the paywall runs in a labelled demo mode.

## How it works

```mermaid
flowchart LR
  U[Search: name or URL] --> R{Curated?}
  R -- yes --> T[Teardown screen]
  R -- no --> S[/api/scan: headers, HTML, CSP, page outline/]
  S --> K{AI key?}
  K -- no --> Q[Instant engine: known facts + product-type template + tech packs + real-page playground]
  K -- yes --> A[/api/teardown ×3 · Claude Opus 5 structured outputs/]
  A -- part fails --> Q
  Q --> T
  A --> T
  T <--> G[Ask Teardown agent · built-in engine or /api/agent with Claude tool use]
```

- **Honest by design.** What the scan proved and documented facts are marked *confirmed*; patterns and guesses are marked
  *likely*, and every instant teardown explains how it was built.
- **Agent drives the UI through a contract.** The agent returns actions (`src/lib/agent/types.ts`), such as
  `play_flow`, `highlight_node` and `set_tweak`. The app applies them through a shared workspace store
  (`src/lib/workspace.ts`), so the same actions work for the built-in engine and for Claude.
- **Playground contract.** CSS variables tagged `/* @tweak */` become controls, and `data-edit` elements become editable on
  screen. `src/lib/playground.ts` syncs code and preview both ways (WebView on native, sandboxed iframe on web).

```
src/app/                   screens (expo-router) + API routes (scan, teardown, agent, status)
src/components/panels/     Story, Stack, System, Code, Playground, Learn
src/components/agent/      Ask Teardown chat dock
src/data/curated/          14 curated teardowns
src/lib/offline/           instant engine: templates, tech packs, known products, real-page playground
src/lib/agent/             agent contract, built-in engine, chat store
src/lib/roadmap/           career roadmap engine; tracks in src/data/careers.ts, resources in src/data/resources/
submission/                Shipaton submission kit (deck text, demo script, screenshots)
```

## Honesty notes

- Code snippets and file trees are simplified teaching examples, not any company's private source code.
- Built with AI pair programming (Claude Code), with the team directing the product, design and content choices.
- The scanner blocks obvious private and localhost addresses, but it isn't a hardened proxy. Rate-limit it if you
  deploy it publicly.
