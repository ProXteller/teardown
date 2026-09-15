# Teardown: tonight's submission checklist

**TXST Shipaton 2026 · LBJ Ballroom · Mon Sep 14 · local submissions due 11:59 PM (Central)**
Global RevenueCat Shipaton on Devpost is due **Sep 30, 11:45 PM PDT**. Tonight, save a Devpost *draft*. Don't
submit it yet.

Plan: **submit locally by 11:15 PM** and keep 45 minutes of buffer. Times assume a 3:00 PM start. If you start
later, shift everything but keep the order.

| # | Block | Time box | Done when |
| --- | --- | --- | --- |
| 0 | Freeze, sanity check, fix the gaps below | 3:00–3:20 | Typecheck and validators pass, gaps assigned |
| 1 | RevenueCat + paywall on | 3:20–4:00 | Test Store purchase unlocks PRO |
| 2 | AI key: Gemini (free) or Claude (optional) | 4:00–4:10 | `/api/status` says what you expect |
| 3 | EAS: hosting + iOS build kicked off | 4:10–4:40 | Build is running in the cloud (skip if no Apple account) |
| 4 | Screenshots | 4:40–5:30 | Six 1179×2556 PNGs |
| 5 | Rehearse + record video | 5:30–7:30 | All 8 shots recorded |
| 6 | Edit, captions, upload | 7:30–8:30 | Public YouTube/Vimeo link, under 2:00 |
| 7 | Adobe Express deck | 8:30–10:00 | Deck link + PDF |
| 8 | Devpost draft | 10:00–10:30 | Draft saved |
| 9 | Local TXST submission | 10:30–11:15 | Confirmation received |
| 10 | Judge access | during 1 and 8 | Access instructions written |
| 11 | Pre-demo rehearsal | before judging | Run-through done twice |

Paths below are relative to the project root. Quote it, because it contains spaces.

---

## Fact-check status (Sep 14, 3:20 PM · live research rows added 7 PM)

Everything in `devpost.md`, `demo-video-script.md`, `pitch-60s.md` and `adobe-express-deck.md` was checked against
`src/`, `app.json`, `package.json` and the running dev server. At 7 PM the docs were updated for **free live research
with Google Gemini** (built today, checked against `src/lib/research/`, `src/lib/llm/` and the teardown screen). These
gaps are still open in the **app**, and the submission copy is written around them. Tell the lead.

| Gap | Why it matters | Fix (owner: lead) |
| --- | --- | --- |
| **Resolved at 7 PM: Ask Teardown is on screen.** `src/app/t/[id].tsx` now renders `AgentDock`, and screenshots 04–05 exist. | It's the headline feature in every doc and Shot 4 of the video. | Still test "What happens when I like a post?" and "make it dark mode" on Instagram before recording. If either fails, use Shot 4B and the gate notes in each doc. |
| **Home footnote still credits only Claude.** `src/app/index.tsx` says teardowns are written "by Claude when an API key is configured". | Gemini is now the preferred engine, and judges read the home screen. | Reword to "by Google Gemini (free) or Claude when an AI key is configured". |
| **Free Gemini quota is small.** Gemini 3.8 Flash allows 5 requests a minute and 20 a day on the free tier. Each live teardown uses 2 requests, plus any chat questions that go to Gemini. Today 3.8 ran out of daily quota and 3.7 was overloaded (rotation still got 3.6 Flash to answer). | A judge crowd or rehearsals can use it up, and then tabs keep the instant version with no LIVE chip. | Don't burn quota rehearsing. Keep one finished **LIVE · GEMINI** teardown (e.g. `linear.app`) in "Recently torn down" for judging. Daily quotas reset at midnight Pacific. |
| **Paywall perks oversell Pro.** `src/app/paywall.tsx` lists "Live site scans", "Every playground" and "Saved on your device", which free users already get. | It's on screen in Shot 7, and Next Gen judges score "RevenueCat integration thoughtfulness". | Keep "Unlimited AI teardowns"; replace the rest with things Pro actually adds, or cut to one perk. |
| **"HAND-CHECKED" chip.** Home and the teardown header say HAND-CHECKED for all 14 curated apps. Eight (Facebook, YouTube, TikTok, X, Reddit, Amazon, Google, ChatGPT) were added between 2:01 and 2:12 PM today. | A judge who asks "who checked these?" needs a true answer. Submission copy now says "curated". | Either review them against their sources before recording, or relabel the chip CURATED. |
| **No "not affiliated" line.** The app, video and deck show Instagram, Spotify and other product names. | Devpost rules bar third-party trademarks without permission. | Add one line to the home footnote: "Not affiliated with or endorsed by the companies whose products are explained." The video end card and deck already carry it. |
| **README is stale.** It says six curated teardowns, and its "2-minute demo script" (linear.app, "hit the free limit") differs from ours. | Next Gen judges read the repo. | Update the count to 14 and point the demo section at `submission/demo-video-script.md`. |
| **LICENSE names Expo, not you.** It's the template's MIT license, "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)". | Next Gen requires a visible open-source license on your repo. | Keep MIT, change the copyright line to `[year] [team names]`. |
| **University sites get a learning-app template.** `mobile.txst.edu` shows LIKELY items like "Spaced repetition" and flows like "You submit a quiz". | Visible in Shot 6 if you open AI / ML or System. | Don't open those in the demo. Longer term: a university archetype. |

---

## Requirements coverage

### RevenueCat Shipaton 2026 (Devpost)

Source: [official rules](https://revenuecat-shipaton-2026.devpost.com/rules) and RevenueCat's
[How to submit your app for Shipaton](https://www.revenuecat.com/blog/engineering/how-to-submit-your-app-for-shipaton),
read Sep 14.

| Requirement | Where it's covered | Status |
| --- | --- | --- |
| New app, first public version released Jul 31–Sep 30 on the App Store, Google Play or Galaxy Store, reachable from the US | Block 3 (iOS build → App Review by Sep 30) | Not started. **Not required for Next Gen.** |
| RevenueCat SDK powers at least one purchase or subscription | `src/lib/purchases.ts` (`react-native-purchases`, `pro` entitlement), block 1 | Code done. Needs dashboard setup + paywall turned on. |
| Project name and tagline | `devpost.md` → Project overview | Ready |
| Description of features (not written by AI; AI help with spelling and formatting is OK) | `devpost.md`, rewritten in your words in block 8 | Fact sheet ready, **rewrite pending** |
| Public store URL (standard categories) | Block 3, block 8 | Not available tonight |
| Public YouTube or Vimeo demo video, under 2 minutes, working app on the intended device | `demo-video-script.md`, blocks 5–6 | Script ready (1:57, 220 spoken words; optional live research Shot 6B keeps 1:57) |
| Video covers elevator pitch, core experience, purchase flow, **and the prize categories targeted** | Shots 1–7, Shot 8 end card + voiceover names the Next Gen Award | Ready |
| No third-party trademarks or copyrighted music in the video | Script "Recording tips", end-card disclaimer, block 6 | Ready (see the trademark gap above) |
| 1024×1024 app icon | `assets/images/icon.png` (verified 1024×1024, has alpha) | Ready |
| At least one 1179×2556 screenshot, no device frame | Block 4 | Pending |
| RevenueCat project ID | Block 1 (copy from Project settings), block 8 | Pending |
| Free trial or promo code so judges can test all premium features, free of charge until judging ends | Block 10 | Pending |
| Category-specific info | Block 8 | Pending |
| Every team member added to the Devpost project | Block 8 | Pending |
| Thumbnail (3:2) and "Built with" tags | `devpost.md`, block 4 | Ready to make |
| Submitted in English, original work, no sponsor funding | n/a | OK |

**Next Gen Award (students)** replaces the store listing with:
- [ ] Every entrant registered with a verifiable student or academic email (`.edu`)
- [ ] A public, open-source repo with a visible license file (fix the LICENSE copyright line first)
- [ ] The demo video
- [ ] Anyone under 18: parent or guardian consent form completed before the deadline
- Judged on: clarity of the app concept, functional progress, how thoughtfully RevenueCat is integrated, and
  technical choices, product thinking and care. The paywall-perks gap and the demo-mode instructions in block 10
  speak directly to "RevenueCat integration".

### TXST Shipaton local

Source: the organizers' brief (not published online, so confirm each item on the submission form).

| Requirement | Where it's covered | Status |
| --- | --- | --- |
| Submit by 11:59 PM Central through the organizers' link | Block 9 | Pending |
| **Product Awards**: ingenuity, striking design, solid execution (full functionality isn't required) | `judging-rubric-selfcheck.md`, `pitch-60s.md`, block 11 | Ready |
| **Best Product Storytelling**: Adobe Express deck with vision, impact, app screenshots and a demo video | `adobe-express-deck.md` (vision: slides 1–4, impact: slide 8, screenshots: slides 5–6, video: slide 6), block 7 | Outline ready |
| RevenueCat powers an in-app purchase | Block 1, Shot 7 | Code done, setup pending |

---

## 0 · Freeze and sanity check (3:00–3:20)

- [ ] Tell the team: **feature freeze at 5:30 PM**. After that, bug fixes only.
- [ ] Hand the lead the fact-check gaps above.
- [ ] `npm run typecheck` (clean at 3:20 PM)
- [ ] `npm run validate` (curated data: edges, flows, playground contract)
- [ ] `npx tsx scripts/validate-offline.ts` (offline engine content)
- [ ] Optional: `npx tsx scripts/test-gemini-rotation.ts` (Gemini model rotation against a fake API, no key needed)
- [ ] Open Instagram, mobile.txst.edu and the Ask Teardown chat once on the device you'll record with.
- [ ] Note the exact Ask Teardown prompts and receipts that work and put them into `demo-video-script.md` if they
      differ.

## 1 · RevenueCat setup + paywall on (3:20–4:00)

The paywall is **off by default** (`EXPO_PUBLIC_PAYWALL_ENABLED`). Shipaton needs RevenueCat to power at least one
in-app purchase, so turn it on for everything you record and submit.

**In the RevenueCat dashboard ([app.revenuecat.com](https://app.revenuecat.com)):**
- [ ] Create a project named **Teardown**.
- [ ] **Apps & providers → Test configuration → Test Store.** It's created with new projects. Copy its **public API
      key**.
- [ ] **Product catalog → Products → New** (in the Test Store): identifier `teardown_pro_monthly`, auto-renewing
      subscription, 1 month, **$2.99** (the price demo mode shows).
- [ ] **Product catalog → Entitlements → New:** identifier **`pro`** (must match `ENTITLEMENT_ID` in
      `src/lib/purchases.ts`). Attach `teardown_pro_monthly`.
- [ ] **Product catalog → Offerings → New:** identifier `default`, **set as Current**. Add a **Monthly** package
      containing `teardown_pro_monthly`. The app reads `offerings.current.availablePackages`.
- [ ] Copy the **Project ID** (Project settings), because Devpost asks for it.

**In `.env`:**
```bash
EXPO_PUBLIC_PAYWALL_ENABLED=true
EXPO_PUBLIC_REVENUECAT_API_KEY=<Test Store public key>
```
- [ ] Restart with a clean cache so the `EXPO_PUBLIC_` values get inlined: stop Metro, run `npx expo start --clear`,
      then reload the app. (Coordinate with the lead, since a dev server is already running.)

**Verify:**
- [ ] Home shows the **GO PRO** pill and "2 free AI teardowns left · curated apps are always free".
- [ ] GO PRO → paywall lists your RevenueCat product and price. The purple "DEMO MODE · NO CHARGE" chip is **gone**.
- [ ] **Unlock Pro** → Test Store purchase sheet → the paywall closes and home shows the **PRO** pill.
- [ ] Tap the PRO pill → the paywall reads "You're Pro. Tear down anything." A reinstall (or reinstalling Expo Go)
      starts a fresh anonymous RevenueCat customer, which is how you re-lock it for the video.

> **What a key changes:** without `GEMINI_API_KEY` or `ANTHROPIC_API_KEY`, searches build *instant* teardowns only,
> which don't use up the free AI allowance, so the paywall only appears through the **GO PRO** pill. With a key, every
> non-curated search still opens on the instant teardown, then live research upgrades it. Each finished upgrade
> counts as an AI teardown, and once 2 have finished, the next new search opens the paywall automatically.

## 2 · AI key: Google Gemini (free) or Claude (optional, 4:00–4:10)

- [ ] Get a free key at [aistudio.google.com](https://aistudio.google.com) and add `GEMINI_API_KEY=` to `.env`
      (server-side only, never `EXPO_PUBLIC_`). Gemini is used first when both keys are set (`AI_PROVIDER=claude`
      forces Claude).
- [ ] Leave `GEMINI_GOOGLE_SEARCH` unset. Free keys are refused for Google Search grounding. Live research reads the
      pages the server finds with Gemini's URL Context tool instead.
- [ ] Optional: `ANTHROPIC_API_KEY=sk-ant-…` (and `TEARDOWN_EFFORT=low` for faster Claude demos).
- [ ] Restart Metro, then `curl http://localhost:8081/api/status` should print `"ai":true` and `"provider":"gemini"`
      (it printed `{"ai":false}` at 3:15 PM).
- [ ] One live check, since each run uses free quota: search `figma.com` → green banner "Researching Figma live · n/2
      tabs updated" → header chip **LIVE · GEMINI** → Learn → Sources lists the pages Gemini read. It takes about
      20–60 s. If a tab "kept instant data" because of a rate limit, wait a minute and tap **Try live research again**.
      Don't check with `linear.app` on the recording device: a search the device has already saved reopens without
      researching (**Clear** only empties the list), so Shot 6B would show no banner.
- [ ] **For the main video take, record with both keys removed** (`{"ai":false}`). Instant teardowns and the built-in
      assistant are immediate. Record the optional live research Shot 6B (and the **GEMINI** pill clip) in a separate
      session with the key set, then remove it and reinstall.
- [ ] Never commit `.env` or `.env.save` (both are in `.gitignore`). Check before you push the repo.

## 3 · EAS: API hosting + iOS build (4:10–4:40, runs in the background)

Be honest about the timeline. **Nothing will be on the App Store by midnight**, and TestFlight links don't count as a
"published app" on Devpost. Starting the build tonight gives you a head start on the Sep 30 global deadline. Skip this
block if you don't have an Apple Developer Program membership.

> These commands edit shared config (`app.json` gets an EAS project ID, and `eas.json` is created). Coordinate with
> the lead engineer before running them.

```bash
npm install --global eas-cli
eas login
eas init                 # links the Expo project (writes extra.eas.projectId to app.json)
eas build:configure      # creates eas.json
```

**Deploy the API routes** (store builds can't reach your laptop's dev server):
```bash
eas env:create --environment production --name GEMINI_API_KEY --value "<your Gemini key>" --visibility sensitive
eas env:create --environment production --name ANTHROPIC_API_KEY --value "sk-ant-..." --visibility sensitive   # optional
npx expo export --platform web
eas deploy --prod --environment production     # EAS Hosting: web app + /api/* routes
```
- [ ] Note the deployed URL (e.g. `https://<name>.expo.app`). Update `origin` in `app.json` (expo-router plugin,
      currently `https://teardown.expo.app/`) to match.
- [ ] Before sharing that URL: the scanner blocks private hosts by name only and has no rate limit, and live research
      and Ask Teardown call Gemini (or Claude) for free users without a per-user cap, so strangers could use up the
      key's free quota. Keep the URL private until rate limits exist.

**Build-time env for the app:**
```bash
eas env:create --environment production --name EXPO_PUBLIC_PAYWALL_ENABLED --value true --visibility plaintext
eas env:create --environment production --name EXPO_PUBLIC_API_URL --value "https://<name>.expo.app" --visibility plaintext
eas env:create --environment production --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "appl_..." --visibility plaintext
```
- [ ] The iOS key comes from RevenueCat → Apps & providers → **App Store** app (bundle ID `edu.txst.teardown`). Don't
      put the Test Store key in production builds, since RevenueCat says never to ship one. On iOS,
      `src/lib/purchases.ts` already prefers `EXPO_PUBLIC_REVENUECAT_IOS_KEY` over the Test Store key.
- [ ] **App Store Connect:** accept the **Paid Apps Agreement** (Business section, needed before any in-app purchase
      loads, even in sandbox). Create subscription group "Teardown Pro" with product `teardown_pro_monthly`, then
      import it into RevenueCat, attach it to `pro`, and add it to the current offering.

**Build and send to TestFlight:**
```bash
eas build --platform ios --profile production --auto-submit
```
- [ ] If `edu.txst.teardown` is already taken in your Apple account, pick a bundle ID you control and update
      `app.json`.
- [ ] TestFlight processing takes about 10–15 minutes after upload. Add yourselves as internal testers.
      TestFlight purchases run in the sandbox, so they're free to test.
- [ ] **By Sep 30:** submit for App Review to get a public App Store URL. App Review takes several business days, so
      don't leave it to the last week. For the **Next Gen** award (students, `.edu` email), no store release is
      needed: a public repo with a license plus the demo video is the path. Google Play is a long shot by Sep 30,
      because new personal developer accounts must run a 14-day closed test first.

## 4 · Screenshots, 1179×2556 without device frame (4:40–5:30)

**Fastest option (automated, web build):** with Metro serving web and Google Chrome installed, run
`node scripts/screenshots.mjs`. It renders a 393×852 viewport at 3× (exactly 1179×2556) and writes
`submission/screenshots/01-home.png` … `07-real-page-playground.png`: home, Instagram story, system flow, assistant
answer, assistant editing a playground, instant live scan, and rebuilt real page. Turn the paywall on first if you
want the GO PRO pill in the home shot. The script doesn't capture the paywall, so take that one by hand.
- [ ] Shots 04 and 05 click the "Ask Teardown" button, so the script fails there until `AgentDock` is mounted.
- [ ] These are web renders. For the store listing and anything labeled as the iOS app, prefer the simulator.

**Simulator option (native look):**

- [ ] Use the **iPhone 16** or **iPhone 15 Pro** simulator (both are natively 1179×2556). If Xcode doesn't list one,
      add it: Window → Devices and Simulators → Simulators → **+** → device type iPhone 16.
- [ ] Clean status bar:
      `xcrun simctl status_bar booted override --time "9:41" --batteryState charged --batteryLevel 100 --cellularBars 4 --wifiBars 3`
- [ ] Capture: `xcrun simctl io booted screenshot --type=png 01-home.png`
- [ ] Verify: `sips -g pixelWidth -g pixelHeight 01-home.png` → **1179 × 2556**. Don't resize from other devices,
      because the aspect ratios differ.
- [ ] Capture these six (paywall on):
  1. **Home**: hero "See how any app is actually built", search box, GO PRO pill
  2. **Instagram → System**: "You post a photo" mid-flow, packet and narration visible
  3. **Ask Teardown**: an answer with an action receipt and suggestion chips (if not in the build: **Instagram →
     Code** with the Swift snippet)
  4. **Instagram → Playground**: edit mode on, "Screen edit rewrote the code" toast visible
  5. **mobile.txst.edu → Stack**: Live scan card with evidence lines
  6. **Paywall**: Teardown Pro with the RevenueCat price (only after the perks copy is fixed)
  7. *(Optional, needs `GEMINI_API_KEY`)* **linear.app**: the **LIVE · GEMINI** chip with the "Researched live with
     Gemini" banner, or Learn → Sources listing the pages Gemini read
- [ ] The Devpost gallery needs at least 1 screenshot plus the icon `assets/images/icon.png` (1024×1024, already that
      size). The file has an alpha channel, which is fine for Devpost. If App Store Connect ever rejects the icon for
      transparency, export a flattened copy on `#070B16`.
- [ ] Devpost **thumbnail** is 3:2. Make it in Adobe Express, e.g. screenshots 2 and 5 side by side on `#070B16`.
- [ ] *(App Store listing later: App Store Connect wants 6.9-inch shots, so use the iPhone 16 Pro Max simulator for those.)*

## 5 · Rehearse + record the demo video (5:30–7:30)

Script: **`submission/demo-video-script.md`**.

- [ ] Decide Shot 4 or Shot 4B based on whether both Ask Teardown prompts work.
- [ ] Decide whether to include optional **Shot 6B** (live research with Gemini). If yes, record it first in its own
      session with `GEMINI_API_KEY` set and use the 6B timing table in the script.
- [ ] Rehearse the full 8-shot run twice without recording. Time it: aim for 1:55, hard stop 1:58.
- [ ] Reset state: **Clear** history on home, reinstall the app or Expo Go so the Test Store customer isn't Pro yet
      (and the free AI allowance is back to 2), and remove `GEMINI_API_KEY` and `ANTHROPIC_API_KEY` for the main take.
- [ ] Turn on touch indicators, connect the hardware keyboard, and override the status bar (see the script's setup
      table).
- [ ] Record on the iPhone simulator or a physical iPhone, not the web build (rules: "running on intended device").
      `xcrun simctl io booted recordVideo --codec=h264 --force shot-N.mov` (Ctrl+C to stop), or QuickTime with a
      physical iPhone.
- [ ] Record the voiceover separately in a quiet room.
- [ ] Check that **mobile.txst.edu** scans on the current Wi-Fi. If not, use the backup take (`txstate.edu` or
      `notion.so`).

## 6 · Edit, caption, upload (7:30–8:30)

- [ ] Adobe Express → Video, **1920×1080**, background `#070B16`, recording centered, key-moment captions burned in.
- [ ] Auto-captions on, then fix "TXST", "RevenueCat", "Django", "jQuery", "HTTPS".
- [ ] End card names the category ("Entering: RevenueCat Shipaton Next Gen Award") and has the "not affiliated" line.
- [ ] No copyrighted music, no real third-party logos added.
- [ ] Length **under 2:00** (aim for 1:57). Export MP4 1080p.
- [ ] Upload to YouTube (or Vimeo) as **Public**. Title: "Teardown: see how any app is actually built (TXST Shipaton
      2026)". Open the link in a private window to confirm it plays.

## 7 · Adobe Express deck (8:30–10:00)

Content: **`submission/adobe-express-deck.md`** (10 slides with speaker notes).

- [ ] Build the slides, place screenshots from block 4, and embed or link the video on slide 6.
- [ ] Fill in team names and roles on slide 10. Confirm the Pro price on slide 9 matches RevenueCat.
- [ ] Run the deck's "Before you export" checks (numbers, disclaimer, no user counts).
- [ ] Share → **view link** (test it logged out) and Download → **PDF**.

## 8 · Devpost draft (10:00–10:30)

Copy: **`submission/devpost.md`**. Rewrite it in your own words, since RevenueCat's guide says not to let AI write
the description.

- [ ] **Team:** invite every member.
- [ ] **Project overview:** name `Teardown` · tagline · 3:2 thumbnail.
- [ ] **Project details:** Inspiration, What it does, How we built it, Challenges, Accomplishments, What we learned,
      What's next. Remove the Ask Teardown parts if it isn't in the build.
- [ ] **Built with:** tags from devpost.md. Include `revenuecat`.
- [ ] **Images:** 1024×1024 icon + 1179×2556 screenshots.
- [ ] **Video:** public YouTube/Vimeo link.
- [ ] **App link:** leave for the App Store URL (not published yet). For Next Gen, add the **public GitHub repo**.
- [ ] **Additional info:** RevenueCat **project ID**, category (Next Gen), judge access instructions (block 10).
- [ ] **Save as draft.** Final submit once the store link or Next Gen materials are ready, before Sep 30, 11:45 PM PDT.
- [ ] Make the repo public: check for `.env`, `.env.save`, API keys (Gemini and Anthropic) and personal info first,
      and confirm the LICENSE copyright line names the team.

## 9 · Local TXST submission (10:30–11:15, hard stop 11:59 PM)

Use the submission link the TXST Shipaton organizers shared. Have these ready to paste:

- [ ] Project name + tagline + short description (elevator pitch from devpost.md)
- [ ] Team member names and emails
- [ ] Category or categories: **Product Awards** (ingenuity, striking design, solid execution; full functionality
      isn't required) and **Best Product Storytelling** (Adobe Express deck with vision, impact, screenshots and
      demo video). Confirm the names on the form.
- [ ] Adobe Express deck link + PDF
- [ ] Demo video link (public)
- [ ] Screenshots + icon
- [ ] Repo link
- [ ] One line on RevenueCat: "Teardown Pro subscription through the RevenueCat SDK (`pro` entitlement), shown in the
      demo with the RevenueCat Test Store."
- [ ] **Submit by 11:15 PM.** Screenshot the confirmation page and post it in the team chat.

## 10 · Judge access to Pro

**Tonight (local judging):** demo on your own device. Test Store purchases never charge, so a judge can press
**Unlock Pro** themselves. To show the locked paywall again after a purchase, reinstall the app or Expo Go, or open
the web build (`w` in Metro) in a private browser window.

**Next Gen (repo + video, no store build):** write this in the Devpost "Additional info" field and the README:
- [ ] "Run from the repo: `npm install`, `cp .env.example .env`, set `EXPO_PUBLIC_PAYWALL_ENABLED=true`, then
      `npx expo start`. With no RevenueCat key, the paywall runs in a labeled demo mode, and **Unlock Pro** unlocks
      locally at no charge ('Reset demo purchase' re-locks it). With a RevenueCat Test Store key, the real purchase
      flow runs, also free. Without an AI key, every search builds an instant teardown. Add a free `GEMINI_API_KEY`
      (aistudio.google.com) to see live research upgrade Story & Stack and System map with sources."

**Global Devpost (needs a published app):** pick one and write clear steps in the form.
- [ ] **Free trial (simplest):** in App Store Connect, add an **introductory offer** (free, 1 week or 1 month) to
      `teardown_pro_monthly`. RevenueCat applies it automatically. Our paywall shows the price but not the trial
      terms yet, so ask the lead to add trial copy before App Review.
- [ ] **Offer codes:** App Store Connect → the subscription → **Offer Codes** → create a custom code (e.g.
      `TEARDOWNJUDGE`). Judges redeem it in the App Store app (account → Redeem Gift Card or Code), then tap
      **Restore purchases** in Teardown.
- [ ] *(Not practical yet)* RevenueCat promotional entitlements need the judge's App User ID, which the app doesn't
      show.
- [ ] The rules also require the app to stay free to test, without restriction, until judging ends. Keep the trial or
      code valid through Oct 21 (winners announced).
- [ ] Paste into Devpost: "Open Teardown → GO PRO → start the free trial (or redeem code `____`) → Unlock Pro.
      Without Pro you can still use all 14 curated teardowns, the playground, Ask Teardown and 2 AI teardowns."

## 11 · Pre-demo rehearsal (before judges arrive)

**Device prep**
- [ ] Phone charged above 80%, brightness up, Do Not Disturb on, orientation locked, default text size
- [ ] Laptop charging, Metro running (`npx expo start`), app opened once, `curl http://localhost:8081/api/status`
      works
- [ ] Backup: the same app open in a laptop browser (`w`), zoomed to phone width
- [ ] History cleared. Decide whether the paywall should start locked (reinstall) or already PRO.
- [ ] Decide on the AI key. **Off:** everything is instant. **On (`GEMINI_API_KEY`):** searches upgrade live in about
      20–60 s and use free quota. Either way, keep one finished **LIVE · GEMINI** teardown in "Recently torn down"
      (for example `linear.app`) so you can show live research without waiting.

**Run the 60-second pitch** (`submission/pitch-60s.md`) twice, then the live flow twice:
1. `instagram` → Story → System → "You post a photo"
2. Ask Teardown → "What happens when I like a post?" → "make it dark mode" (skip if not in the build)
3. Playground → Edit text on the screen → type on the caption → Code tab → change `--accent` on line 9
4. `mobile.txst.edu` → Stack → Live scan evidence → Playground rebuilt page
5. *(Optional)* the saved `linear.app` teardown → **LIVE · GEMINI** chip → Story quick facts → Learn → Sources
6. GO PRO → paywall → Unlock Pro

**Live searches that work well on Wi-Fi** (scanned through the dev server, Sep 14, 3:15 PM):
| Search | What the scan shows | Why use it |
| --- | --- | --- |
| `mobile.txst.edu` | HSTS, Apache, jQuery, Font Awesome, Google Analytics, YouTube embeds (6) · headline "Mobile Apps at Texas State" | Local, plus real Texas State history |
| `txstate.edu` (chip on home) | HSTS, Apache, jQuery, Font Awesome, Google Analytics (5) · headline "Texas State University" | One tap, no typing |
| `notion.so` | Cloudflare, Vercel, Next.js, React and HSTS from headers and HTML, plus 6 services its CSP allows (Stripe, Algolia, Hotjar…) (11) | Longest evidence list |
| `linear.app` | Cloudflare, Google Cloud, HTTP/3, HSTS, Next.js, React, plus Sentry, Stripe, Algolia via CSP (9) | Modern startup stack |

If a judge asks about the CSP ones: the evidence says the site's security policy *allows* that service, which is a
strong hint, not proof that every page uses it.

Avoid live: `duolingo.com` (the scan finds no readable menu or headings, so the playground falls back to an example
screen) and `chatgpt.com` (it opens the curated ChatGPT teardown, not a scan, which is fine but not a scan demo).

**Airplane-mode / bad Wi-Fi fallback**
- [ ] **All 14 curated teardowns work fully offline** (Instagram, Spotify, Netflix, Discord, Uber, WhatsApp…).
- [ ] **Instant teardowns still build offline** from known facts plus archetypes, without the live scan. The banner
      says the site couldn't be scanned, and the playground is a labeled example. Best offline searches: `txst`
      (Texas State facts and history), `canvas`, `duolingo`, `revenuecat`, `notion`.
- [ ] **Ask Teardown works offline** (BUILT-IN engine). If Gemini or Claude is unreachable or rate limited, it falls
      back on its own.
- [ ] **With a key but no Wi-Fi,** live research fails and the instant teardown stays, with a "Try live research
      again" link. Saved LIVE teardowns still reopen.
- [ ] Saved teardowns reopen from "Recently torn down" with no connection.
- [ ] On a physical phone with Expo Go, the JavaScript comes from your laptop over Wi-Fi. **Don't reload the app while
      offline.** Open it before switching networks, or demo on the simulator or web, where the dev server is local.
- [ ] Test it for real once: turn Wi-Fi off, search `txst`, open Instagram, ask the assistant a question, turn Wi-Fi
      back on. Only offer airplane mode to judges if this passed on the same device.

**If something breaks mid-demo:** say "this is the offline engine," go to Instagram (curated, always works), and
finish on the paywall.
