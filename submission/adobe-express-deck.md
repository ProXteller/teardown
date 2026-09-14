# Teardown: Adobe Express story deck (Best Product Storytelling)

Ten slides, about 4 minutes spoken, or 2:30 if you let the demo video carry the middle. The category asks for
**vision, impact, app screenshots and a demo video**. Slides 5 and 6 are the screenshot slides, and slide 6 embeds
the video.

> Fact-checked against the code on Sep 14, 3:15 PM. **Ask Teardown gate:** slide 5 and the slide 7 side box show the
> assistant, which isn't on the teardown screen yet. If it isn't working by the 5:30 PM freeze, swap slide 5's second
> screenshot for the Code tab and cut the assistant lines from slides 5, 6 and 7.

## Look and feel (set once in Adobe Express)

- **Format:** Adobe Express → Create new → Presentation (16:9). Start blank rather than from a template, so it looks
  like the app.
- **Background:** `#070B16` (the app's blueprint navy). Add a faint blueprint grid like the app's `GridBackground`:
  1 px `#5EE7FF` lines every 16 px at 6% opacity, with heavier lines every 80 px at 12%.
- **Colors (from `src/constants/theme.ts`):** text `#EAF0FF` · dim text `#9AA7C4` · cyan `#5EE7FF` (primary) ·
  amber `#FFC857` (Pro, callouts) · mint `#7CFFB2` (CONFIRMED) · violet `#A78BFA` (AI) · pink `#FF6BA8` (Playground).
- **Type:** headlines in **Space Grotesk Bold** if your Express account has it, otherwise a geometric sans such as
  Montserrat Bold. Labels in a monospace such as **Source Code Pro** (it's Adobe's), uppercase, letter-spaced, cyan,
  styled like the app's `// for curious builders` label.
- **Screenshots:** use the 1179×2556 captures from the checklist. Round the corners about 8% and add a thin
  `#1F2B45` border. No device frames, which matches the store screenshots.
- **One idea per slide.** No more than about 25 words of body copy. The speaker notes carry the rest.

---

## Slide 1 · Title

**Label:** `// TXST SHIPATON 2026`
**Headline:** Teardown
**Body:** See how any app is actually built.
**Visual:** App icon (`assets/images/icon.png`) large on the left. Home screen screenshot on the right, tilted about
6°, with the search box showing `instagram.com, Duolingo, linear.app…`.

**Speaker notes:**
"Hi, we're [team]. This is Teardown. You type an app you use every day and it shows you how that app is built: its
story, its tech stack, a map of its system you can tap, teaching code, and a playground where you can remix it."

---

## Slide 2 · Problem

**Label:** `// THE GAP`
**Headline:** You use dozens of apps a day. Can you explain one?
**Body:**
- Intro CS teaches loops and syntax.
- Real apps are explained in engineering blogs, conference talks and DevTools, all written for professionals.
- Beginners never see the whole picture.

**Visual:** Left side: a tiny `for` loop in monospace. Right side: an Instagram-style feed card, drawn simply, no real
logo. Between them, a big dashed gap labeled `???`.

**Speaker notes:**
"In our first CS classes we learned how to write a loop. Nobody showed us what happens between tapping like and a
friend seeing it. That knowledge exists, but it's scattered across engineering blogs and conference talks written for
senior engineers. So curious students stay curious, or give up."

---

## Slide 3 · Audience

**Label:** `// WHO IT'S FOR`
**Headline:** Built for the first-year CS student at Texas State
**Body:**
- Knows a little code and a lot of apps
- Learns by poking at things, not by reading docs
- Wants interview-ready words: sharding, caching, CDN
- Also useful for bootcamp learners, self-taught devs, and anyone who thinks "how does that work?"

**Visual:** A persona card styled like a Teardown "Quick facts" grid. **Example student** · Major: Computer Science ·
Year: Freshman · Uses daily: Instagram, Spotify, Canvas · Question: "What language is Instagram written in?" Put a
small note on the card saying it's an illustrative persona.

**Speaker notes:**
"We designed for one person: a TXST freshman who knows a little Python or C++ and uses Instagram, Spotify and Canvas
every day. They don't need a textbook. They need to poke at the real thing and get honest answers at their level."

---

## Slide 4 · Solution

**Label:** `// TYPE AN APP. GET IT TAKEN APART.`
**Headline:** Six tabs from "what is it?" to "I rebuilt it"
**Body:** a 3×2 grid of tiles, one line each:
- **Story:** who built it, when, and why
- **Stack:** languages and tech, each marked CONFIRMED or LIKELY
- **System:** tap a request, watch it travel
- **Code:** readable snippets from each layer
- **Playground:** remix a live mini-clone
- **Learn:** interview concepts and a build-your-own roadmap

**Visual:** Six small screenshots, one per tab, from the **Instagram** teardown. Tint each tile's border with its tab
color (amber, mint, cyan, violet, pink, blue `#6EA8FF`).

**Speaker notes:**
"Every teardown has the same six tabs. The key word is honest: every piece of the stack says whether it's confirmed
from public sources or just likely. We want students to learn the difference between evidence and a guess."

---

## Slide 5 · Demo moment: understand it

**Label:** `// LIVE DEMO · 1`
**Headline:** Watch a request travel, then just ask
**Body:**
- Tap "You post a photo": phone → load balancer → Django → storage, narrated hop by hop
- Ask Teardown: "What happens when I like a post?" It answers **and plays the flow on the map**

**Visual:** Two screenshots side by side:
1. Instagram **System** tab mid-animation (packet visible, step narration card showing).
2. The **Ask Teardown** panel showing the answer, a receipt like "Playing 'You like a post'", and suggestion chips.

**Speaker notes (or switch to the live phone here):**
"Here's the System tab for Instagram. I tap 'You post a photo' and the packet walks through each hop:
load balancer, Django servers, photo storage, then a background queue. It's a simplified version of the
architecture Instagram has described publicly. If I'm stuck I ask Teardown. It doesn't just answer. It drives the app
and plays that request for me. A built-in engine answers with no API key, and it uses Claude when a key is set."

---

## Slide 6 · Demo moment: remix it, on any site

**Label:** `// LIVE DEMO · 2`
**Headline:** Edit the screen, the code follows. Even for TXST.
**Body:**
- Playground syncs both ways: type on the screen → code changes, edit code → screen changes
- "make it dark mode" → the assistant rewrites the CSS
- Paste `mobile.txst.edu` → live scan evidence (Apache, jQuery, HSTS) and its real menu and headings rebuilt

**Visual:** Three screenshots:
1. Playground with the "Screen edit rewrote the code" toast visible.
2. Stack tab **Live scan** card for mobile.txst.edu with evidence lines.
3. Playground showing the rebuilt "Mobile Apps at Texas State" page.

**Embed:** the demo video (Adobe Express → Media → Video, or a linked YouTube thumbnail) for anyone viewing the deck
alone.

**Speaker notes:**
"The playground is where it clicks. I type directly on the screen and the HTML changes. I edit the code and the screen
changes. And this isn't only for famous apps. Here's mobile.txst.edu: Teardown fetched the real site, found an Apache
server header and jQuery, shows the evidence for each, pulled in Texas State's real history, and rebuilt the page's
real menu and headings as a playground I can edit."

---

## Slide 7 · How it works

**Label:** `// UNDER THE HOOD`
**Headline:** Evidence first, AI second, no dead ends
**Body:** a left-to-right diagram built with Express shapes:

`Search` → `Curated? (14 teardowns)` → **yes:** `Teardown`
`Search` → **no:** `Live scan (104 fingerprint rules, evidence kept)` → `Instant engine: 105 known products · 14 archetypes · 74 tech packs` → `Teardown built in milliseconds once the scan returns`
With an API key: `Claude Opus 5 · 3 parallel structured-output calls, grounded in the scan` → `Teardown` (any failed part falls back to instant)
Side box: `Ask Teardown · built-in engine or Claude tool use → typed UI actions`
Footer: `Expo SDK 57 · Expo Router API routes · react-native-svg · WebView / iframe bridge · RevenueCat`

**Visual:** The diagram above. Cyan boxes for the free path, violet for Claude, amber for RevenueCat.

**Speaker notes:**
"Under the hood, it's one Expo app with API routes. A live scan reads the site's headers and HTML and keeps the
evidence. Our offline engine combines that with documented facts, 14 product archetypes and 74 tech packs to build
a full teardown a few milliseconds after the scan returns, with no AI needed. With a key, Claude Opus 5 writes a deeper
teardown in three parallel calls with strict schemas, grounded in the scan. The assistant returns the same small set
of typed actions whether the built-in engine or Claude is answering, and the app skips any id it doesn't recognize."

---

## Slide 8 · Impact

**Label:** `// WHY IT MATTERS`
**Headline:** From "how does that work?" to a mental model in one sitting
**Body:** three cards:
- **Curiosity → concepts.** Every teardown ends with interview-ready terms and a build-your-own roadmap.
- **Evidence literacy.** CONFIRMED vs LIKELY teaches students to question sources, including AI.
- **Free core, no API key.** No account needed. Curated teardowns work with no connection, and every search still
  gets a teardown when AI is unavailable, so cost and campus Wi-Fi don't get in the way.

**Visual:** Three cards with real product numbers, not user numbers: `14` curated teardowns · `105` products
with documented facts · `0` API keys needed.

**Speaker notes:**
"We built this for Shipaton and haven't launched yet, so we won't show you made-up user numbers. Here's what we
designed for: in one sitting, a student goes from 'I use this app' to explaining a load balancer and a task queue, and
they've edited real HTML. We haven't measured that yet. Next we'll pilot it with TXST CS students and measure
challenges completed and teardowns per session."

---

## Slide 9 · Business model

**Label:** `// FREE TO LEARN. PRO TO EXPLORE EVERYTHING.`
**Headline:** Teardown Pro, powered by RevenueCat
**Body:**
- **Free:** 14 curated teardowns, playgrounds, Ask Teardown, and 2 AI teardowns to try
- **Pro:** unlimited AI teardowns written by Claude, a monthly subscription at `[$2.99]/month`
- AI costs real money per teardown. When AI is unavailable, the offline engine still builds a free instant teardown.

**Visual:** The paywall screenshot ("Teardown Pro · Curious about everything?") next to a small RevenueCat diagram:
`pro` entitlement → current offering → monthly package.

**Speaker notes:**
"The business model follows our costs. Curated teardowns, the playground and the assistant are free, because they
cost us almost nothing to serve. AI teardowns cost real money every time, so after two free ones they're part of
Teardown Pro. RevenueCat handles the subscription, the `pro` entitlement and restores through one SDK, so the app has a
single Pro check on every platform. Tonight's demo uses RevenueCat's Test Store. Later we see campus and classroom
licenses."

---

## Slide 10 · Roadmap, team and ask

**Label:** `// WHAT'S NEXT`
**Headline:** Help us put Teardown in every intro CS class
**Body (left, roadmap):**
- **Goal for Sep 30:** submit the iOS build for App Review and enter the global Shipaton (Next Gen Award)
- **Fall:** a review pass on every curated teardown, new ones (Canvas, TXST Mobile), and a pilot with TXST CS
  students
- **Next:** classroom mode, "tear down my GitHub repo", share your remix

**Body (right, team and ask):**
- `[Name]`: `[role]` · `[Name]`: `[role]`
- **Ask:** try it tonight, tell us which app you want torn down next, and connect us with an intro CS instructor for
  a pilot.

**Visual:** A horizontal timeline in cyan with three dots. Team headshots or initials in the app's rounded
"LogoMark" squares. A QR code to the repo or video.

**Speaker notes:**
"Next up: the App Store build for the global Shipaton, more curated teardowns of apps TXST students use, and a
classroom pilot. Our ask is simple: tell us what app you want torn down, and if you know an intro CS instructor,
introduce us. Thank you. Teardown: see how any app is actually built."

---

## Before you export

- [ ] Every screenshot is from the current build (Pro pill visible where it makes sense, no debug overlays)
- [ ] No real third-party logos added. Use the app's own glyphs and screens only.
- [ ] No user or download numbers anywhere
- [ ] A small "Not affiliated with the companies whose products are explained" line on slide 1 or 10
- [ ] Every number matches the code: 14 curated, 104 fingerprint rules, 105 known products, 14 archetypes, 74 tech packs
- [ ] Video embedded or linked on slide 6, and the link works in a private window
- [ ] Export: Share → Download → PDF (for the form) and keep the Express link (view access) for judges
