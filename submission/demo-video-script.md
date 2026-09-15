# Teardown: demo video script (under 2:00)

**Hard limit: finish by 1:58.** The rules say the video should be under two minutes and judges don't have to watch
past that. RevenueCat's guide also asks the first two minutes to cover the elevator pitch, the core experience, the
purchase experience **and the prize categories you're targeting**. This script does all four.

**Voiceover: 220 spoken words** (acronyms and years counted as spoken, e.g. "C-S-S" is 3). At 150 words per minute
that's about 88 seconds of talking, which leaves about 29 seconds for taps, typing (sped up) and animations. Every
shot's lines fit inside its time box (see the budget table). The optional live-research **Shot 6B** has its own
timing table and still ends at 1:57.

Story arc: **curious about Instagram → understand it → ask about it → remix it → do it to a real TXST site → go Pro.**

> **Gate (7 PM status):** Shot 4 needs the Ask Teardown button on the teardown screen. `AgentDock` is now rendered by
> `src/app/t/[id].tsx`, and screenshots 04–05 were captured with it. If both demo prompts don't work in rehearsal,
> record **Shot 4B**.

---

## Recording setup (do this before take 1)

| Setting | Value | Why |
| --- | --- | --- |
| Device | Physical iPhone (best, since the rules ask for the app "running on intended device"), or the **iPhone 16 / iPhone 15 Pro simulator**, which is natively 1179×2556. Don't record the web build for the Devpost video. | Crisp portrait capture on the target platform |
| `.env` | `EXPO_PUBLIC_PAYWALL_ENABLED=true` and `EXPO_PUBLIC_REVENUECAT_API_KEY=<Test Store key>` | Shows the real RevenueCat purchase flow |
| `GEMINI_API_KEY` and `ANTHROPIC_API_KEY` | **Leave both empty for the main take** | Instant teardowns build right away with the amber "Built instantly" banner Shot 6 needs, and the assistant answers immediately (**BUILT-IN** badge). With a key, `mobile.txst.edu` shows the green live research banner instead, and its tabs change while you film. |
| Optional Shot 6B | A **separate session** with `GEMINI_API_KEY` set. Reinstall the app (or Expo Go) first, restart Metro, and check that `curl http://localhost:8081/api/status` shows `"provider":"gemini"`. Afterwards remove the key, restart, and reinstall again before the main take. | A teardown the device already saved reopens without researching (**Clear** only empties the list). A finished live research also uses one of the 2 free AI teardowns, and the main take needs the no-key behavior. |
| App state | On home, tap **Clear** under "Recently torn down". Delete and reinstall the app (or Expo Go) so the RevenueCat Test Store customer starts without Pro. | Clean first impression, paywall starts locked |
| Status bar | `xcrun simctl status_bar booted override --time "9:41" --batteryState charged --batteryLevel 100` | No distracting clock or battery |
| Touches | `defaults write com.apple.iphonesimulator ShowSingleTouches 1`, then restart Simulator | Viewers can see where you tap |
| Keyboard | Simulator → I/O → Keyboard → **Connect Hardware Keyboard** | Type with your Mac keyboard |
| Warm-up | Before recording, open `mobile.txst.edu` once and back out, then **Clear** history | Confirms the venue Wi-Fi can reach the site |

After Metro restarts, press `r` to reload so the `.env` change takes effect. Check that home shows **GO PRO** in the
top right and "2 free AI teardowns left · curated apps are always free" under the search box.

---

## Time and word budget

At 150 wpm you get 2.5 words per second. Each shot's voiceover stays well under its box.

| Shot | Time box | Seconds | Words | Speaking time |
| --- | --- | --- | --- | --- |
| 1 Hook | 0:00–0:08 | 8 | 18 | 7 s |
| 2 Story | 0:08–0:17 | 9 | 21 | 8 s |
| 3 System map | 0:17–0:32 | 15 | 31 | 12 s |
| 4 Ask Teardown | 0:32–0:54 | 22 | 38 | 15 s |
| 5 Playground | 0:54–1:14 | 20 | 35 | 14 s |
| 6 Live scan (TXST) | 1:14–1:36 | 22 | 40 | 16 s |
| 7 Pro via RevenueCat | 1:36–1:50 | 14 | 24 | 10 s |
| 8 Close + category | 1:50–1:57 | 7 | 13 | 5 s |
| **Total** | **1:57** | | **220** | **88 s** |

**With optional Shot 6B (live research).** Pay for its 6 seconds by trimming Shot 3 (one autoplay step, drop "with
every hop narrated") and Shot 6 (drop "Guesses are marked 'likely,' and", and move faster between tabs). Shots 1, 2,
7 and 8 don't change.

| Shot | Time box | Seconds | Words | Speaking time |
| --- | --- | --- | --- | --- |
| 3 System map (trimmed) | 0:17–0:29 | 12 | 27 | 11 s |
| 4 Ask Teardown | 0:29–0:51 | 22 | 38 | 15 s |
| 5 Playground | 0:51–1:11 | 20 | 35 | 14 s |
| 6 Live scan (trimmed) | 1:11–1:30 | 19 | 35 | 14 s |
| 6B Live research (Gemini) | 1:30–1:36 | 6 | 12 | 5 s |
| **Total** | **1:57** | | **223** | **89 s** |

---

## Shot list

Times are for the **final edit**. Record each shot as its own clip, then speed up typing (2–4×) and trim dead air.

### Shot 1 · 0:00–0:08 · Hook

**Screen:** Home. The hero reads "See how any app is actually built." Hold for 2 s, then tap the search box.

**Voiceover:**
> "Most CS freshmen use Instagram. Almost none of us could explain how it works. Teardown fixes that."

**Caption:** `Teardown · for beginner CS students`

### Shot 2 · 0:08–0:17 · Search → curated story

**Tap:** type `instagram` → tap the cyan arrow.
**Screen:** Instagram teardown, chip **CURATED · HAND-CHECKED**, Story tab. Scroll slowly past "In plain English"
and Quick facts to the History timeline (2010 "Launch on iPhone" … 2023 "Threads").

**Voiceover:**
> "Search any app. Instagram is one of fourteen curated teardowns: plain-English basics, then its history, from 2010
> to Threads."

**Caption:** `Story · facts · timeline`

### Shot 3 · 0:17–0:32 · System map request animation

**Tap:** **System** tab → the **"You post a photo"** chip at the top.
**Screen:** The packet travels iPhone app → Load balancer → Django web servers. Let 2 steps autoplay (3.4 s each),
then tap **skip forward** once so step 3 (Django web servers → Photo & video storage) shows. Scroll so the
narration card and the top of the map are both in frame.

**Voiceover:**
> "The System tab is an interactive architecture map. Tap 'You post a photo' and follow the request through the load
> balancer, into Django, and into photo storage, with every hop narrated."

**Caption:** `Tap a request, watch it travel`

### Shot 4 · 0:32–0:54 · Ask Teardown answers AND changes the app

**Tap:** the floating **Ask Teardown** button → type `What happens when I like a post?` → send.
**Screen:** The reply appears. The panel shrinks to a peek with a receipt ("Playing “You like a post”"), and the
System tab plays **"You like a post"**. Hold 3 s on the moving packet.

**Tap:** the peek panel → type `make it dark mode` → send.
**Screen:** The app switches to **Playground** and the mini Instagram goes dark (`--bg` and `--text` change). Hold
2 s.

**Voiceover:**
> "Stuck? Ask Teardown. 'What happens when I like a post?' It explains, then plays that exact request on the map.
> Now, 'make it dark mode.' It jumps to the playground and changes the CSS for me."

**Caption:** `AI assistant that drives the app · works without an API key`

> Verify both prompts in rehearsal and note the exact receipts. If a prompt doesn't trigger an action, use one of
> the suggestion chips it shows and adjust the voiceover to match what's on screen. Don't narrate an action the take
> doesn't show.

### Shot 4B (fallback if Ask Teardown isn't in the build) · 0:32–0:54 · Code and Learn

**Tap:** **Code** tab → "Double-tap to like (iPhone)" is selected. Scroll through the Swift snippet. Then **Learn**
tab → tap **Load balancer** to expand it.

**Voiceover (27 words):**
> "The Code tab has teaching snippets from each layer, like the Swift behind double-tap to like. Learn turns it into
> interview words: load balancer, sharding, caching."

**Caption:** `Code from every layer · interview-ready concepts`

In Shot 5, tap the **Background** swatch to black and the **Text** swatch to white under Controls first (the toast
shows the line that changed), then continue with the on-screen edit.

### Shot 5 · 0:54–1:14 · Playground two-way editing

**Tap:** close the assistant (×) → **Edit text on the screen** → tap the caption *"Golden hour never misses 🌅"* on
the rendered post → put the cursor at the end and type ` at TXST Shipaton`.
**Screen:** Toast: "Screen edit rewrote the code" with the line number and the new line.

**Tap:** the **Code** sub-tab (the phone preview shrinks to make room) → in the editor, go to line 9,
`--accent: #F77737;`, and change it to `#00C2FF`.
**Screen:** About half a second after you stop typing, the photo gradient and the avatar ring shift to blue. Line 9 sits
just under the editor header, so the preview and the edited line are both on screen.

**Voiceover:**
> "The playground is a working mini Instagram, and it syncs both ways. Type on the screen, and the HTML rewrites
> itself, down to the line. Change the code, and the screen updates."

**Caption:** `Screen → code · code → screen`

### Shot 6 · 1:14–1:36 · Instant teardown of a real TXST site with live scan evidence

**Tap:** back chevron → home. Clear the search box, type `mobile.txst.edu` → arrow.
**Screen:** Chip **INSTANT TEARDOWN**, name **Texas State University**, amber banner **"Built instantly in N ms"**.
**Tap:** **Stack** tab → hold on the **Live scan** card: scan time and fingerprints with evidence, e.g. *Apache HTTP
Server: "The server header says Apache"*, *jQuery: "Loads jquery.js"*, *HSTS (HTTPS enforced)*. Scroll to the
Frontend layer (open by default), where **jQuery CONFIRMED** sits above **TypeScript LIKELY**.
**Tap:** **Playground** tab → "mobile.txst.edu page, rebuilt", headline **"Mobile Apps at Texas State"** and its real
menu.

**Voiceover:**
> "Now any link, like Texas State's mobile site. Teardown scans the real site and shows the evidence: Apache, jQuery,
> HTTPS enforced. Guesses are marked 'likely,' and the playground is rebuilt from the page's real headings."

**Caption:** `Live scan of mobile.txst.edu · evidence shown`

> Verified against the dev server at 3:15 PM on Sep 14: HSTS, Apache, jQuery, Font Awesome, Google Analytics and
> YouTube embeds (6 detections, 1.7 s scan), headline "Mobile Apps at Texas State". Scan results change when the
> site changes. If the scan fails on venue Wi-Fi, use a backup take.

### Shot 6B (optional, needs `GEMINI_API_KEY`) · 1:30–1:36 · Live research upgrades the teardown

Record this clip in its own session with the key set (see the setup table). For real it takes about **20–60
seconds**, so **cut the wait** in the edit. It shows the viewer what Pro sells right before the paywall.

**Tap:** home → type `linear.app` → arrow.
**Screen:** The instant teardown appears at once with the green banner **"Researching Linear live · 0/2 tabs
updated"**, then 1/2 (hold about 1 s, then jump-cut past the wait). The banner changes to **"Researched live with
Gemini + live web pages · N sources"** and the header chip reads **LIVE · GEMINI** (hold about 1 s).
**Tap:** **Learn** tab → scroll to **Sources & further reading** and hold about 2 s on the pages Gemini read.

**Voiceover (12 words):**
> "With Gemini on, it researches the app live and cites real pages."

**Caption:** `Live research · free Gemini tier · sources it actually read`

> Sep 14 test runs: Gemini 3.8 Flash was out of its daily quota and 3.7 was overloaded, so the app rotated to 3.6
> Flash, which answered a Linear teardown in about 22 s. Linear's sources were linear.app/about, /company, /careers
> and github.com/linear. Results change with quotas and pages, so only narrate what your take shows. The server caches
> finished research for a while, so a repeat search can finish before the banner is on camera, and a teardown saved on
> the device reopens with no banner at all. Film on a freshly installed app, with an app you haven't researched since
> the dev server started. If the banner ends with "Live research unavailable" or says a
> tab kept instant data (rate limit or daily quota), wait a minute and tap **Try live research again**, or skip 6B
> and use the main timing. Daily free quotas reset at midnight Pacific time.

### Shot 7 · 1:36–1:50 · Pro paywall via RevenueCat

**Tap:** back → home → **GO PRO** pill (top right).
**Screen:** Teardown Pro paywall: "Curious about everything?", the perks, and the monthly plan and price from the
RevenueCat offering.
**Tap:** **Unlock Pro** → complete the RevenueCat Test Store purchase sheet. The paywall closes on its own and you're
back on home. The pill now reads **PRO**, and the line under the search box reads "Pro · unlimited AI teardowns".
Hold 1 s on the pill.

**Voiceover:**
> "Curated teardowns are free, and so are your first two AI teardowns. Teardown Pro, a RevenueCat subscription,
> unlocks unlimited AI teardowns."

**Caption:** `Teardown Pro · RevenueCat`

> The paywall perks currently also list "Live site scans", "Every playground" and "Saved on your device", which free
> users already get. If the lead hasn't reworded them by recording time, keep the camera moving past the perks.

### Shot 8 · 1:50–1:57 · Closing + category

**Screen:** End card (build it in Adobe Express): app icon, **Teardown**, "See how any app is actually built",
`Entering: RevenueCat Shipaton Next Gen Award · TXST Shipaton 2026`, repo URL, and a small line: "Not affiliated
with the companies whose products are explained."

**Voiceover:**
> "Teardown, for the Next Gen Award. See how any app is actually built."

For the TXST local cut, say "Teardown, built at TXST Shipaton." instead (8 spoken words, same timing).

---

## Voiceover only (for recording the audio in one pass)

1. Most CS freshmen use Instagram. Almost none of us could explain how it works. Teardown fixes that.
2. Search any app. Instagram is one of fourteen curated teardowns: plain-English basics, then its history, from 2010
   to Threads.
3. The System tab is an interactive architecture map. Tap "You post a photo" and follow the request through the load
   balancer, into Django, and into photo storage, with every hop narrated.
4. Stuck? Ask Teardown. "What happens when I like a post?" It explains, then plays that exact request on the map.
   Now, "make it dark mode." It jumps to the playground and changes the CSS for me.
   *(Fallback 4B: The Code tab has teaching snippets from each layer, like the Swift behind double-tap to like. Learn
   turns it into interview words: load balancer, sharding, caching.)*
5. The playground is a working mini Instagram, and it syncs both ways. Type on the screen, and the HTML rewrites
   itself, down to the line. Change the code, and the screen updates.
6. Now any link, like Texas State's mobile site. Teardown scans the real site and shows the evidence: Apache, jQuery,
   HTTPS enforced. Guesses are marked "likely," and the playground is rebuilt from the page's real headings.
   *(Optional 6B: With Gemini on, it researches the app live and cites real pages.)*
7. Curated teardowns are free, and so are your first two AI teardowns. Teardown Pro, a RevenueCat subscription,
   unlocks unlimited AI teardowns.

If you use 6B, read line 3 without "with every hop narrated" and line 6 as "…HTTPS enforced. The playground is
rebuilt from the page's real headings."
8. Teardown, for the Next Gen Award. See how any app is actually built.

## Backup takes

- **Scan fails on Wi-Fi:** use `txstate.edu` (one-tap chip on home; Sep 14 scan: HSTS, Apache, jQuery, Font Awesome,
  Google Analytics; headline "Texas State University") and say "like Texas State's website." Or use `notion.so`
  (Cloudflare, Vercel and Next.js from headers, plus 8 more detections) and say "shows the evidence: Next.js, Vercel,
  Cloudflare."
- **Want the GEMINI pill in Ask Teardown:** in the Shot 6B session (key set), open **Spotify** and ask `Who is the CEO
  of Spotify right now, and how many monthly users?`. In a Sep 14 test it answered in about 22 s, naming the co-CEOs
  and monthly users, with newsroom.spotify.com/company-info and Spotify's Wikipedia article under **From the web**.
  Cut the wait and only narrate what the reply shows. Shot 4's Instagram prompts stay **BUILT-IN** even with a key
  (Instagram is curated, and playground edits always use the built-in engine). With only `ANTHROPIC_API_KEY` set,
  the pill reads **CLAUDE** instead. Don't record Shot 6 with a key set, because the amber "Built instantly" banner
  turns into the live research banner.
- **Running long:** cut Shot 2's scroll to 7 s and drop "with every hop narrated." (saves about 2 s).

---

## Recording tips

- **Simulator capture (no device frame):** `xcrun simctl io booted recordVideo --codec=h264 --force shot1.mov`,
  then press Ctrl+C to stop. You get the device's native pixels.
- **Physical iPhone:** plug in → QuickTime Player → File → New Movie Recording → click the arrow next to the record
  button → choose the iPhone as the camera. Turn on Do Not Disturb first.
- **QuickTime screen recording (fallback):** File → New Screen Recording → record just the Simulator window. Crop
  out the window chrome in the edit.
- **Export 1080p:** in Adobe Express, create a **1920×1080** video. Put the portrait recording in the center or left
  third, captions and callouts on the right, dark background `#070B16` to match the app. Export MP4 at 1080p.
- **Captions:** use Adobe Express auto-captions (or YouTube's, then fix them). Burn in the short key-moment captions
  above so they show on muted autoplay.
- **Audio:** record voiceover separately in a quiet room (Voice Memos is fine) and keep it close to the mic. Skip
  music or use royalty-free tracks from Adobe Express only. The rules bar copyrighted music.
- **Trademarks:** the rules bar third-party trademarks without permission. Teardown uses letter and emoji glyphs, not
  real logos, but the product names (and the "Instagram" wordmark text in the playground) are still on screen. Keep
  the video on in-app screens, add no real logos or screenshots of other apps, and keep the "not affiliated" line on
  the end card.
- **Upload:** YouTube or Vimeo, visibility **Public**, title "Teardown: see how any app is actually built (TXST
  Shipaton 2026)". Check the link in a private window.
