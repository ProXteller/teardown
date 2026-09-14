# Teardown: 60-second pitch + judge Q&A

## The pitch (about 150 spoken words, 60 seconds)

Hold the phone so the judges can see it. **Bold** marks what to show while you say that line.

> Who here uses Instagram? Who could explain how it actually works?
> *(pause)* That gap is why we built **Teardown**.
>
> Teardown is for beginner CS students. Type an app and it takes it apart: its story, its tech stack, and an
> interactive system map. **Tap "You post a photo"** and watch the request travel through the load balancer, Django
> and storage.
>
> Then you remix it. The playground is a working mini Instagram. **Type on the screen** and the code rewrites itself.
> Our assistant, **Ask Teardown**, answers questions and drives the app. **"Make it dark mode."** Done.
>
> Paste a real site, like **mobile.txst.edu**. It scans the live site, shows the evidence, and rebuilds the page as
> a playground.
>
> Curated teardowns are free. **Teardown Pro**, a RevenueCat subscription, unlocks unlimited AI teardowns written by
> Claude.
>
> Teardown. See how any app is actually built.

> **Ask Teardown gate:** if the assistant isn't in the build you're demoing, replace its two sentences with "Then the
> Code and Learn tabs turn it into real concepts: load balancers, sharding, caching." Never pitch a feature you can't
> show on the phone in your hand.

**If you only get 30 seconds:** say the first paragraph, then "Type any app and you get its story, its stack, a
system map you can tap, and a playground you can remix. It even scans mobile.txst.edu and shows its evidence. Curated
teardowns are free, and Pro through RevenueCat unlocks unlimited AI teardowns."

---

## 5 likely judge questions

### 1. "How do you know any of this is accurate? Isn't the AI just making it up?"

> "Everything is labeled by where it came from. The live scan reads the site's real headers and HTML, and we show the
> evidence line for every detection, like 'the server header says Apache.' In instant teardowns, only scan evidence
> and documented public facts get a **CONFIRMED** badge. Patterns we infer from the type of product are marked
> **LIKELY**. When Claude writes a teardown, the scan goes into the prompt as ground truth and the prompt only allows
> 'confirmed' for documented facts. That's a rule, not a guarantee, so those carry an **AI TEARDOWN** label. The 14
> curated teardowns are written from public engineering blogs, talks and Wikipedia, each lists its sources, and the
> code is labeled as teaching examples, not private source."

### 2. "Why would a student pay for this? What's in Pro?"

> "The learning core is free: all 14 curated teardowns, the playground, the assistant, and your first two AI
> teardowns. Pro unlocks **unlimited AI teardowns**, because each Claude teardown costs us real money. When AI isn't
> available, searches still get a free instant teardown from our offline engine, which costs almost nothing to run.
> Pro is a monthly subscription through RevenueCat with a `pro` entitlement, so the unlock is one check in the app no
> matter the platform. Tonight it runs on RevenueCat's Test Store. Later we'd like campus and classroom licenses."

### 3. "What happens if the Wi-Fi dies or Claude is down?"

> "The demo keeps working. Curated teardowns are bundled in the app. Any other search gets an instant teardown built
> in milliseconds from facts on 105 products, 14 product archetypes and 74 technology packs. Without a connection
> there's no live scan, and the banner says so. If a Claude call fails, only that tab falls back to the instant
> version. The assistant has a built-in engine and switches to it on its own."

Only offer "Want me to turn on airplane mode?" if you ran the airplane-mode test in checklist block 11 on this exact
device today. On a phone running Expo Go, the app's JavaScript comes from the laptop, so don't reload while offline.

### 4. "How does the assistant control the app? Isn't that risky?"

> "It never touches the UI directly. Both engines, the built-in one and Claude, can only return a small typed list of
> actions: open a tab, play a flow, highlight a node, show code, set a CSS variable, edit a text element, or replace
> the playground code. The app checks each id and skips anything unknown. With Claude, those actions are tools. The
> prompt marks text scraped from websites as untrusted data, and code edits that add network calls or outside
> resources are rejected on the server. So even a model that gets tricked can only do the same small set of things a
> student could do by hand. Playground code runs isolated in a WebView on phones and a sandboxed iframe on web."

### 5. "Is it okay to scan other companies' websites?"

> "We only read what every browser already receives from a public page: response headers and HTML. It's View Source
> with explanations. The scanner refuses localhost and private network addresses, times out after 7 seconds, and caps
> the download at 600 KB. We never claim to show private code, and every curated teardown lists its sources. Before a
> public launch we'd add rate limiting and DNS-level checks so it can't be pointed at internal networks."

---

## Honest one-liners to have ready

- **"Is it on the App Store?"** Not yet. Tonight it runs through Expo. We're preparing the iOS build for the global
  Shipaton deadline on Sep 30. `[update with real status]`
- **"How many users?"** None yet. We built it for Shipaton. Our first step is a pilot with TXST CS students.
- **"Did a person check all 14 curated teardowns?"** `[Answer truthfully. If not every one was reviewed, say which
  ones were, that eight were added today, and that a review pass against their sources is next.]`
- **"Why do the Pro perks mention live scans?"** `[If the paywall copy is still unfixed: "Good catch. Those are free
  today. Pro is unlimited AI teardowns, and we're fixing that copy."]`
- **"What did you build vs. use?"** We built the scanner, the offline engine and its content, the system map, the
  two-way playground bridge and the assistant. We use Expo, RevenueCat and Claude.
- **"What's the tech stack?"** Expo SDK 57 with Expo Router and API routes, TypeScript, react-native-svg for the map,
  a WebView/iframe bridge for the playground, Claude Opus 5 with structured outputs and tool use, and RevenueCat for
  Pro.
