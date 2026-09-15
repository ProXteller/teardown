# Teardown: judging rubric self-check

A skeptical judge's scoring of the app as it exists on **Sep 14 at 3:20 PM**, based on reading `src/`, running
`npm run typecheck` (clean), and scanning the demo sites through the running dev server. The UI wasn't viewed in a
browser for this pass, so the design score comes from the code and should be rechecked against the block 4
screenshots.

Scale: 1 = missing, 2 = weak, 3 = solid but with visible gaps, 4 = strong, 5 = best in the room.

> **Update, Sep 14, 7 PM.** Two things landed after this pass. Ask Teardown is now on screen (`AgentDock` is rendered
> by `src/app/t/[id].tsx`, and screenshots 04–05 exist), so improvement 1 is done apart from rehearsing the prompts.
> And **free live research with Google Gemini** was built: instant teardown first, then Story & Stack and System map
> upgrade in place from real pages Gemini reads, with a **LIVE · GEMINI** chip and sources. The scores below are still
> the 3:20 PM read. Items marked *(7 PM)* say what changed.

| Criterion | Now | After the 3 fixes below | One-line reason |
| --- | --- | --- | --- |
| Ingenuity | **4** | 4.5 | Typing on a rendered page rewrites its source, and a live scan with evidence feeds an instant teardown of any site. The headline assistant isn't on screen yet. |
| Striking design | **4** | 4 | A committed blueprint look with an animated request map, held back by dense text tabs and tiny map labels on a phone. |
| Solid execution | **3** | 4 | Deep fallbacks and a clean typecheck, but the star feature isn't mounted, Pro copy oversells, and nothing is deployed. |
| Storytelling | **3** | 4 | A strong arc with a local hook, but none of the video, deck or screenshots exist yet, and Pro's value is told rather than shown. |

---

## Ingenuity: 4/5

**What earns it**
- **Two-way playground.** Drag a slider and a CSS variable changes on a named line; type directly on the rendered
  mini-app and the HTML rewrites itself (`src/lib/playground.ts`). That's the moment a beginner connects code to
  screen, and few learning tools do it in that direction.
- **Evidence-first teardowns of any site.** 104 header/HTML/CSP fingerprint rules that each carry a "why", combined
  with 105 known products, 14 archetypes and 74 technology packs, produce a full six-tab teardown with no LLM. The
  mobile.txst.edu scan returned 6 detections in 1.7 s, and the playground was rebuilt from that page's real menu and
  headings.
- **Epistemic labeling as a feature.** CONFIRMED vs LIKELY badges, "we assumed the site is X.com" and example
  labels teach students to separate evidence from inference, including for AI output.
- **Agent design.** One typed action contract with interchangeable engines (rule-based, plus Gemini function calling
  or Claude tool use *(7 PM)*) means the assistant can drive the UI without touching it directly.
- *(7 PM)* **Live research on a free key.** Google Search grounding refuses free keys, so the server finds real pages
  itself in about a second (Wikipedia, the product's About/Company/Careers/Blog pages, its GitHub organization, Hacker
  News) and Gemini reads them with URL Context. Rotation across Gemini models keeps it working when one is out of
  quota: today 3.8 Flash was out of daily quota and 3.7 was overloaded, and 3.6 Flash answered a Linear teardown in
  about 22 s. Linear's live research named its three founders and its local-first sync engine, with sources from
  linear.app/about, /company, /careers and github.com/linear.

**What holds it back**
- The individual pieces have precedents (Wappalyzer-style fingerprinting, CodePen-style playgrounds, system-design
  diagrams). The originality is the combination for beginners, so the demo has to show them connected.
- ~~Ask Teardown, the most novel interaction, is built but not rendered on the teardown screen.~~ *(7 PM: resolved,
  it's mounted.)*

## Striking design: 4/5

**What earns it**
- A single committed identity: `#070B16` blueprint navy, a two-level cyan grid, Space Grotesk for display and
  JetBrains Mono for labels, and a brand-colored glow per product (`src/constants/theme.ts`).
- The System tab is the visual signature: tiered boxes color-coded by kind, dashed Bézier edges, a glowing packet
  moving along the active hop, and a narration card with step controls.
- The playground sits in a phone frame with a live toast that names the changed line, and color carries meaning
  across the app (mint CONFIRMED, amber LIKELY and Pro, violet AI).
- *(7 PM)* Live research never blocks the screen: the amber instant banner gives way to a mint "Researching … live ·
  n/2 tabs updated" banner, tabs show a small spinner while they upgrade, and the header chip turns to **LIVE ·
  GEMINI**.

**What holds it back**
- Story, Stack and Learn are mostly stacked text cards. Strong for learning, less arresting in a 2-second glance.
- On a phone-width map, boxes are capped at 3 per row with 9.5 pt monospace tech labels, which are hard to read in a
  video. Frame Shot 3 tight, or zoom in during the edit.
- The paywall is a generic centered layout next to a distinctive app.

## Solid execution: 3/5

**What earns it**
- `npm run typecheck` is clean, and `validate-data.ts` / `validate-offline.ts` check edges, flows and the playground
  contract.
- Layered failure handling: `normalize()` repairs model output, each AI part falls back to the instant engine, the
  assistant falls back to the built-in engine, and the scanner has a 7 s timeout and a 600 KB cap.
- *(7 PM)* Live research adds more layers: the instant teardown is always shown first, a rate-limited, out-of-quota
  or overloaded (503) Gemini model is skipped for the next one, Gemini's JSON is schema-validated, and roadmap picks
  are link-checked on the server (HTTP plus YouTube oEmbed) with broken or unrelated ones dropped. Keys stay
  server-side, fetched page text is fenced as untrusted data, and the server only reaches public https hosts.
- RevenueCat is wired properly: current offering, `purchasePackage`, `restorePurchases`, a customer-info listener, and
  a labeled demo mode.

**What a skeptical judge will find**
- ~~**Ask Teardown isn't mounted** in `src/app/t/[id].tsx`.~~ *(7 PM: resolved.)*
- *(7 PM)* **Free Gemini quota is thin.** Gemini 3.8 Flash allows 5 requests a minute and 20 a day on the free tier.
  Rotation helps, but a busy judging hour can still leave new searches on the instant version. Keep a finished LIVE
  teardown saved.
- *(7 PM)* The home footnote in `src/app/index.tsx` still says AI teardowns come "by Claude when an API key is
  configured", with no mention of Gemini.
- **Paywall perks oversell Pro.** "Live site scans", "Every playground" and "Saved on your device" are free for
  everyone.
- **"HAND-CHECKED" on all 14 curated teardowns**, while 8 were added between 2:01 and 2:12 PM today.
- University sites get a learning-app template, so mobile.txst.edu shows LIKELY "Spaced repetition" and a "You
  submit a quiz" flow.
- Not shipped: no store build, no deployed API, no rate limits, and the scanner blocks private hosts by name only.
  (Acceptable for TXST's "full functionality isn't required", but it caps this score.)
- README still says six curated teardowns; LICENSE still names Expo as the copyright holder.

## Storytelling: 3/5

**What earns it**
- A clear arc a room of students recognizes instantly: curious about Instagram → understand it → remix it → do it to
  a Texas State site → go Pro.
- Honest by design: no invented user numbers, a stated pilot plan, and copy that separates what exists from what's
  planned.
- A tight demo script: 222 spoken words in 1:57 with a per-shot budget, a fallback shot, and the category named
  before 2:00, as RevenueCat's guide asks.

**What holds it back**
- Nothing is produced yet: no video, deck, screenshots or thumbnail.
- **Pro's value is never on screen.** The video records without an AI key, so viewers buy "unlimited AI teardowns"
  without ever seeing one. *(7 PM: the script's optional Shot 6B fixes this with a 6-second live research clip,
  banner → LIVE · GEMINI → Learn → Sources, right before the paywall.)*
- Impact is a design goal ("a mental model in one sitting") with no evidence from real students yet. Even two
  classmates' reactions tonight would give slide 8 something real.

---

## The 3 highest-impact improvements for the remaining hours

Ranked by points gained per hour. The first two need the lead and should land before the **5:30 PM feature freeze**.

### 1. Put Ask Teardown on screen and prove the two demo prompts (lead, about 45 min)

*(7 PM: mounted, and screenshots 04–05 were captured. Only the rehearsal check below is left.)*

**Moves:** Ingenuity +0.5, Execution +0.5, and unblocks video Shot 4, screenshots 04–05 and
`scripts/screenshots.mjs`.

- Render `<AgentDock t={t} />` on the teardown screen (inside the root `View` of `src/app/t/[id].tsx`, after the
  `ScrollView`).
- On Instagram with no API key, check that "What happens when I like a post?" plays **You like a post** with a
  receipt, and that "make it dark mode" switches to Playground and changes `--bg` and `--text`.
- Run `npm run typecheck`, then `node scripts/screenshots.mjs`.
- If it isn't solid by 5:30, stop. Record Shot 4B and remove the assistant from the copy (every doc has a gate
  note).

### 2. Make Pro honest and visible (lead + video editor, about 30 min)

**Moves:** Execution +0.5, Storytelling +0.5, and Next Gen's "RevenueCat integration thoughtfulness".

- Replace the three free perks in `src/app/paywall.tsx` with what Pro actually adds ("Unlimited AI teardowns" plus,
  for example, "Live research: story, stack and system map from real pages, with sources"). One true perk beats four
  padded ones.
- Show the thing being sold: with `GEMINI_API_KEY` set, record the script's optional **Shot 6B** (banner "Researching
  Linear live · n/2 tabs updated" → **LIVE · GEMINI** → Learn → Sources, wait cut out) and place it right before the
  paywall. The script's 6B timing table pays for it by trimming Shots 3 and 6.
- In live judging, keep one finished live teardown (e.g. `linear.app`) saved so you can open it and point at the
  **LIVE · GEMINI** chip and its sources.

### 3. Trust pass on everything a judge can open (anyone, about 20 min)

**Moves:** Execution +0.5, and removes easy disqualification or credibility risks.

- Relabel the **HAND-CHECKED** chip to **CURATED** in `src/app/index.tsx` and `src/app/t/[id].tsx`, unless someone
  reviews the 8 new teardowns against their sources first.
- Add "Not affiliated with or endorsed by the companies whose products are explained." to the home footnote. The
  Devpost rules bar third-party trademarks without permission, and the app is full of product names.
- Fix `README.md` (14 curated teardowns, and point the demo section at `submission/demo-video-script.md`) and change
  the `LICENSE` copyright line to the team. Next Gen judges read the repo, and the license file is a requirement.

**Not in the top 3, on purpose:** a university archetype, rate limiting, and the App Store build. Each matters for
Sep 30, but none changes tonight's scores as much as the three above.
