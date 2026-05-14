# TagHunter — Meta Ad Pack v1

**Budget:** $3,000 over 60 days
**Window:** 2026-05-13 → 2026-07-12 (overlaps WY/MT/AZ/ID primary draws and CO/UT secondaries — peak intent window)
**Author:** ops, drafted 2026-05-13
**Status:** Draft pending Mayor sign-off + pixel install
**Phase:** Open beta. TagHunter is free. No paywall, no upsell, no card. Goal is 5K active western hunters before any monetization talk.

---

## 0. Pre-flight (must be done before $1 is spent)

These are blockers. If any of these are open on launch day, we are throwing money at cold reach with no learning loop.

1. **Meta Pixel is NOT installed on taghunter.com.** Grepped the repo — no `fbq`, no `connect.facebook.net`, no GTM container. Without it we get zero conversion optimization, no lookalike seeding, no retargeting. Install before launch. Standard events to wire: `PageView` (auto), `ViewContent` (/plan), `InitiateCheckout` (Step 1 submitted), `Lead` (waitlist signup), `CompleteRegistration` (strategy generated on /strategy).
2. **No existing mailing list confirmed.** Cold B lookalike depends on this. If the WaitlistForm has been collecting emails for >30 days and has 100+ entries, we can build a custom audience. If not, Cold B is on hold until week 3.
3. **Data verification gap.** Per DATA_STATUS.md: only 3/76 species entries are verified (Colorado Elk, Utah Elk, Utah Mule Deer). 96% are ESTIMATED. Ad copy must NOT claim "verified deadlines for every state" — it would be a lie that bounces back when a hunter checks Oregon (May 15 deadline, 0/6 verified). Use language like "tracks every deadline across 24 states" — true. Avoid "official" or "verified" claims.
4. **No /odds page conversion path confirmed.** /odds exists but I didn't audit whether it captures email. Mayor: confirm /odds has a CTA back to /plan, or we don't send traffic there.

---

## Why free? (landing page module — copy block)

Three sentences, max. Lives above the fold on /plan and on a tiny "/why-free" anchor every ad links to.

> TagHunter is free during open beta. No card, no signup wall, no premium tier — built free by hunters for hunters while we grow the western hunting community to 5K users. After that we'll figure out what's fair. Until then, full feature access, no strings.

---

## 1. Ad Variants

Four variants, each leaning on a different psychological lever. All copy written hunter-to-hunter — no "epic," no "adventure," no exclamation marks, no "elevate your hunt." Tone is the same voice as the homepage ("Stop guessing. Start drawing.") and the About page ("If your draw odds are 2%, we say 2%"). Voice test: would a guy on Rokslide type this into a thread? If no, rewrite it.

---

### V1 — "Deadline Panic"

**Lever:** Loss aversion. Western draws have hard deadlines and most hunters miss at least one a year. This is the highest-intent variant — somebody clicking this is already mid-application.

**Primary text (125 char):**
> Wyoming closes June 1. Montana June 1. Arizona June 2. TagHunter tracks every western deadline. Free, no signup.

**Primary text (250 char):**
> Wyoming closes June 1. Montana June 1. Arizona June 2. Idaho June 5. Nevada and Washington June 15. Colorado and Utah by month's end. TagHunter tracks every western draw deadline in one place — and tells you which units are worth applying for. Free during beta. No card, no paywall.

**Headline (40 char):** `Don't miss a 2026 western draw.`

**Description (30 char):** `Free deadline + odds tracker.`

**Image direction:** Top-down shot of a stained kitchen table with three open state regulation booklets fanned out (Wyoming, Montana, Idaho), a black coffee mug, and a phone propped against the mug showing a clean TagHunter deadline list. Window light from the left, slightly weathered hands resting on the edge of the table. Mood: it's 9pm on a Sunday, the hunter just realized they have 19 days. No screen glow halos, no stock-photo smiles. AI-gen acceptable but disable any "professional" filter — we want truck-cab realism.

**Hypothesis:** Hits late-applier hunters (every state has 20-40% of applications come in the last week). Highest click-through, probably worst form-completion rate because the user is panicking and will bounce if they don't see their specific state above the fold.

**Landing page:** `/plan?utm_source=meta&utm_medium=cpc&utm_campaign=deadline_panic&utm_content=v1`
**Note:** /plan opens to Step 1 (goals). For panic users we may want to test /odds as a secondary destination — confirm /odds has a CTA back to /plan before sending traffic.

---

### V2 — "Point Strategy"

**Lever:** Sunk cost. A hunter with 6 Colorado points has already paid ~$500+ in application fees over the years. The question "when do I burn them?" is the most common forum thread in r/elkhunting and on Rokslide. This variant is for the hunter who's playing the long game.

**Primary text (125 char):**
> You've got 8 Colorado points. Burn them in Unit 37 or hold for 49? TagHunter runs the 10-yr math. Free.

**Primary text (250 char):**
> You've got 8 Colorado preference points. Burn them this year in Unit 37 at 9% odds, or hold for Unit 49 at 4% but 350-class bulls? TagHunter's AI runs the 10-year draw math across every western state, every species. Your point balance plus our strategy layer in three minutes. Free during open beta — no card, no signup wall.

**Headline (40 char):** `Burn 'em or bank 'em?`

**Description (30 char):** `10-yr draw strategy in 3 min.`

**Image direction:** Close-crop of a hunter's hand holding a folded paper application against a topo map background, pencil tucked behind ear. Half-frame is the phone showing TagHunter's strategy timeline (Year 1, Year 2, Year 3 columns visible — match the PlanTimeline component aesthetic on /). Color palette: amber + bone + dark earth (matches site). Avoid: tactical-bro aesthetic, camo-everywhere, anything that looks like an outdoor industry stock image.

**Hypothesis:** Lower CTR than V1 but higher LTV/quality user. These are the hunters who'll actually complete the /plan flow because they already think in 10-year horizons. Best variant for waitlist conversion.

**Landing page:** `/plan?utm_source=meta&utm_medium=cpc&utm_campaign=point_strategy&utm_content=v2`

---

### V3 — "Consultant Killer"

**Lever:** Anti-establishment / value. The $300-500 consultant fee is real and called out on the About page. This is the populist variant — frames TagHunter as the people's tool against the gatekeepers.

**Primary text (125 char):**
> Hunting consultants charge $400/yr to tell you where to apply. TagHunter does the same job with AI. Free.

**Primary text (250 char):**
> Hunting consultants charge $300-500/yr to tell you which units to apply for. The data they use is public — they're charging for the strategy layer. TagHunter built an AI that does the same job, runs it across 24 western states and 9 species, and gives it away. Free during beta. No paywall, no upsell, no card needed.

**Headline (40 char):** `Quit paying $400/yr for a draw plan.`

**Description (30 char):** `Same strategy. Zero dollars.`

**Image direction:** Split-screen visual. Left half: a printed PDF "Hunt Consulting Report" with a $400 invoice stapled to it, slightly crumpled, on a desk. Right half: same desk, a phone showing TagHunter's strategy output (year-by-year list). Caption-style text within image is fine but small — Meta penalizes >20% text overlay so keep it under that. Alternative cut: just the invoice torn in half.

**Hypothesis:** Highest CTR of the three, lowest conversion quality. Skews younger (28-40) and price-sensitive. Risk: attracts users who churn the instant they're asked for any email at all. Test it but expect it to be the variant we kill in week 3.

**Landing page:** `/?utm_source=meta&utm_medium=cpc&utm_campaign=consultant_killer&utm_content=v3` — lands on homepage so the "Free · No Signup · Built for Hunters" eyebrow does the trust work before the CTA.

---

### V4 — "TagHunter vs Vaporware"

**Lever:** Skepticism / impatience. There's a competing "AI hunt planner" raising on Kickstarter right now — promo videos, no shipped product. Hunters who've followed gear Kickstarters know how that usually ends. This variant is for the hunter who already typed "AI hunt planner" into Google last month and bounced off a pre-order page.

**Primary text (125 char):**
> While others are still crowdfunding their AI hunt planner, ours has been live and free since 2026. Skip the wait.

**Primary text (250 char):**
> Other folks are running Kickstarter campaigns for an AI hunt planner. We just built ours. Live since early 2026, free during open beta, no pre-order, no founder tier, no waitlist gate — just open the site and plan your tag. Built free by hunters for hunters. Skip the wait.

**Headline (40 char):** `Skip the Kickstarter. Plan your tag.`

**Description (30 char):** `Live and free. Not a promo video.`

**Image direction:** Two phones side by side on a wood truck dash, both same angle. Left phone: a generic "coming soon / back this project" promo page on a black background — keep it blurry enough to be obviously a placeholder, not a recognizable competitor logo. Right phone: TagHunter's /strategy view, sharp focus, year-by-year output rendered. Background: faint topo paper, a coffee thermos. Caption inside image (small, under 20% overlay): "live now" arrow on the right phone. Do NOT name TINE, do NOT show a real competitor screenshot — implication only. We don't want to give them a free brand mention or a screenshot lawsuit.

**Hypothesis:** Polarizing. Will either crush on CTR among hunters who've been burned by gear Kickstarters, or get ignored by hunters who haven't heard of the competitor at all. Best signal: comment section. If we see "wait, what's the other one?" replies, the variant is working — those people are now thinking about us as the shipped option.

**Landing page:** `/?utm_source=meta&utm_medium=cpc&utm_campaign=vaporware&utm_content=v4` — homepage, so "live now" / "free during beta" eyebrow lands before any feature claim.

---

## 2. Audience Targeting

Three audience sets running in parallel. Budget split below assumes pixel is live; if pixel is not live on day 1, Cold C cannot run and its budget rolls to Cold A.

### Cold A — Interest stack (the workhorse)
- **Budget share:** 50% of paid social = $900 over 60 days, ~$15/day
- **Geo:** US west region — WY, CO, MT, ID, UT, NV, OR, WA, AZ, NM, CA. Exclude HI and AK (different draw systems, wasted impressions).
- **Age:** 28-55, male skew (Meta auto, don't hard-gender — illegal in some categories and a worse signal anyway)
- **Interests (stack, any-of):** onX Hunt, Eastmans' Hunting Journal, GoHunt, MeatEater, Randy Newberg, Rokslide, Hunt Talk, Backcountry Hunters & Anglers, Western Hunter Magazine, Sitka Gear, First Lite
- **Also wire as lookalike seeds when available:** Eastmans / GoHUNT subscriber lookalikes, onX Hunt user behavior, state G&F site visitors (Wyoming, Colorado, Montana, Arizona, Idaho)
- **Expected CPM:** $18-32 (western hunting is mid-tier — onX and gear brands have driven up the auction)
- **Expected CPC:** $1.20-$3.00 cold
- **Kill criteria:** If CPC > $3.00 after $200 spend OR if no waitlist signups after $400 spend, pause and review audience.

### Cold B — Lookalike (deferred)
- **Budget share:** 20% of paid social = $360, ~$6/day (held until pixel + seed audience exist)
- **Source:** 1% lookalike of WaitlistForm subscribers OR (if list < 100) 1% lookalike of /plan completers from pixel. Eastmans/GoHUNT subscriber lookalikes are the fallback seed if our list isn't big enough.
- **FLAG FOR MAYOR:** I cannot confirm whether `WaitlistForm` (used on / and /plans) has been collecting emails into a usable list. Check the Supabase table or wherever it writes. If list size < 100, Cold B does not launch in week 1 — its budget rolls to Cold A until we have a seed audience.
- **Geo:** Same as Cold A
- **Expected CPM:** $25-40 (LALs cost more — narrower audience)
- **Expected CPC:** $0.80-$2.00 (should outperform Cold A once seeded)
- **Kill criteria:** Same as Cold A.

### Cold C — Retargeting + behavior
- **Budget share:** 30% of paid social = $540, ~$9/day (only launches once pixel has fired 1,000+ PageViews — probably week 2)
- **Audiences:**
  - Pixel: visited taghunter.com in last 30 days, did NOT complete /plan
  - Pixel: started /plan (Step 1 fired) but did not hit /strategy
  - Meta behavior: "Hunting" interest + recent activity, plus state G&F site visitors where available
- **Expected CPM:** $30-50 (retargeting is always more expensive on CPM, cheaper on CPA)
- **Expected CPC:** $0.50-$1.50
- **Kill criteria:** If retargeting CPA > $80/lead after $300 spend, the funnel is leaking — fix the /plan flow, not the ads.

**If pixel is not live on day 1:** Cold A gets 80% ($1,440), Cold B gets 20% ($360, deferred to week 3). Cold C waits.

---

## 3. Budget Allocation — $3,000 over 60 days

| Channel | $ | % | Notes |
|---|---:|---:|---|
| Meta paid social | $1,800 | 60% | Split A/B/C per section 2 |
| YouTube creator sponsorship | $600 | 20% | Single mid-tier creator, 60-90s integration |
| SEO content | $450 | 15% | 3 long-form posts at ~$150 each |
| Reddit / forum organic | $150 | 5% | Tooling + time, NOT paid placement |
| **Total** | **$3,000** | **100%** | |

### YouTube creator ($600)
- **Tier:** 10K-100K subs, western big-game focus
- **Target list (pitch in this order):**
  1. **The Western Hunter (Cody Rich)** — strong western draw audience, mid-tier
  2. **The Hunting Public** — broader but covers western draws
  3. **Hushin'** — younger demo, good engagement
  4. **University of Elk Hunting (Corey Jacobsen)** — niche-perfect but may be over $600
- **Deal:** 60-90 second integrated ad slot, NOT a pre-roll. Script provided by us but allow creator to put it in their own words. Custom UTM link (`utm_source=youtube&utm_medium=sponsorship&utm_campaign=<creator>`). One-shot deal — if the first creator's video performs (>500 link clicks), we re-up in v2 budget; if not, we learn and move on.
- **Talking points for creator:** It's free during beta. No card, no upsell. We're trying to hit 5K users before we even think about monetization. They can say that on camera — it's true.
- **FLAG:** $600 is the floor for this tier. If everyone we pitch wants $800+, raise it from the Meta budget or skip this channel and move the $600 to SEO/Meta.

### SEO content ($450)
- **3 posts, ~$150 each** (use Factor21 internal writer or external freelancer who hunts):
  1. "Wyoming elk preference points 2026: what your point balance is actually worth"
  2. "Colorado moose draw odds explained — why the wait is 20+ years and what to do instead"
  3. "How to apply for 5 western states in one weekend (Wyoming, Montana, Idaho, Nevada, Colorado)"
- **Each post:** 1,500-2,500 words, internal links to /plan, /odds, /find, and species-specific URLs. Schema-marked FAQ blocks for SERP capture.
- **Hosting:** taghunter.com/blog or taghunter.com/guides — Mayor to confirm which slug. Blog infrastructure not audited; if it doesn't exist, deploy a minimal Markdown route or use a subdomain.

### Reddit / forum organic ($150)
- **What this buys:** GummySearch or LunarCRUSH subscription ($60-80/mo) for spotting questions in real time on r/elkhunting, r/Hunting, r/Wyoming, r/ColoradoHunting, plus paid time (the writer's, not Mayor's) to respond authentically.
- **Ethical rules (non-negotiable):** No alt accounts. No VPN sock-puppets. No upvote rings. Operator answers questions truthfully on their own account, mentions TagHunter only when directly relevant ("I built a free tool for this — link in profile" not "USE TAGHUNTER NOW"). One self-promo post per subreddit per month maximum, and only where the sub's rules allow it.
- **Forums to monitor:** Rokslide, Hunt Talk, Monster Muleys, 24hourcampfire — these are higher-intent than Reddit and often allow signature-line product mentions.
- **Success measure:** 5+ inbound signups attributable to forum/Reddit referrer over 60 days. Not a primary channel, just a "be present where the hunters live" play.

---

## 4. A/B Test Plan

### Week 1-2 (days 1-14)
- All four Meta variants run equal weight at ~$15/day each = $60/day Meta total
- Total Meta spend week 1-2: ~$840
- Audience: Cold A only (Cold B/C may not be ready)

### Week 3-4 (days 15-28)
- Kill the bottom variant by CPC and signup-cost (likely V3 — Consultant Killer — based on hypothesis; V4 vaporware is the wildcard)
- Run top 3 at ~$20/day each = $60/day Meta total
- Pixel should have enough data to launch Cold C retargeting
- Total Meta spend week 3-4: ~$840

### Week 5-8 (days 29-60)
- Run top 2 variants at ~$10/day each = $20/day Meta total over 28 days = $560
- Layer in Cold B lookalike if seed audience available (~$5/day = $140 across 28 days)
- Total Meta spend week 5-8: ~$700

**Total Meta spend:** $840 + $840 + $700 = $2,380. Over the $1,800 line. Trim: cut week 1-2 to $40/day total ($560), week 3-4 to $40/day total ($560), week 5-8 at $24/day ($680). Total $1,800. Done.

This means weekly Meta spend is conservative — ~$40/day, not the $90/day a more aggressive launch would do. Mayor: if you want faster learning, top up another $1,000 to the Meta line and we run at $90/day for the first two weeks. Otherwise we accept slower learning.

### Success metrics
- **Primary:** signup cost < $40 (waitlist email or account creation — both free)
- **Secondary:** /plan completion cost < $80 (user reaches /strategy)
- **Tertiary:** CTR > 1.2% (cold), CPC < $2.50 (cold)
- **North star (60-day):** net new active users toward the 5K beta target

### Variant kill criteria (any one triggers pause)
- CPC > $3.00 after $200 spend on that variant
- CTR < 0.6% after $150 spend
- Zero signups after $250 spend

### Reporting cadence
- **Weekly summary to Mayor (Mondays):** spend by variant, CPC, CTR, signups, plan-completes, retargeting funnel state, what's killed, what's scaled, what changed, distance to 5K user goal
- **Mid-week flag:** if any variant hits a kill criterion mid-week, pause immediately and flag — don't wait for Monday

---

## 5. Tracking Requirements

### Pixel events (in order of priority to wire)
1. **PageView** — auto-fires on Pixel install
2. **ViewContent** on `/plan` — user arrived at the funnel entry
3. **InitiateCheckout** on `/plan` Step 1 → Step 2 transition (when StepOne submits)
4. **Lead** on WaitlistForm submit (homepage + /plans)
5. **CompleteRegistration** on `/strategy` page mount (strategy generated)
6. **AddToWishlist** on "Save Plan" action (if /strategy has a save button — verify)

### UTM convention (use exactly this)
- `utm_source` = `meta` | `youtube` | `reddit` | `seo`
- `utm_medium` = `cpc` | `sponsorship` | `organic` | `referral`
- `utm_campaign` = `deadline_panic` | `point_strategy` | `consultant_killer` | `vaporware` | `<creator_handle>` | `<post_slug>`
- `utm_content` = `v1` | `v2` | `v3` | `v4` | `<creative_asset_id>`

Server-side capture: log UTMs into the same row as the waitlist email so we can attribute signups end-to-end without trusting Meta's reporting.

### Reporting stack
- Meta Ads Manager (primary)
- Cross-checked weekly against pixel events in Meta Events Manager
- Cross-checked against Supabase waitlist row count (truth)
- If discrepancy >15% between Meta-reported leads and Supabase row delta, something's misfiring — investigate

---

## 6. Risks & Honest Caveats

1. **Western hunting Meta CPCs are mid-tier, not cheap.** Expect $1.20-$3.00 cold. Outdoor/hunting interest stack is more expensive than e-comm but cheaper than B2B SaaS. Budget assumes we're in that band.
2. **First 2 weeks are learning, not converting.** Don't panic at week 1 CPA numbers. Pixel needs ~50 conversion events before Meta's optimizer earns its keep — we may not hit that until week 3.
3. **No pixel = no optimization.** If pixel is not installed before launch, we're buying cold reach and waitlist signups via post-click attribution only. This is fine for ~$500 of testing but not for $3K. Block on pixel.
4. **Data verification gap is a brand risk.** Per DATA_STATUS.md, 96% of state-species entries are ESTIMATED. If V1 (Deadline Panic) sends a hunter to /plan and the Oregon May 15 deadline is wrong in our data, we've burned a customer and possibly a forum thread. Verification of the priority queue states (Oregon, Montana, Wyoming, Arizona, Idaho) should happen BEFORE this ad spend goes live.
5. **Vaporware competitor risk cuts both ways.** If the competitor ships during the 60-day window, V4's "still crowdfunding" line goes stale fast. Re-check their status weekly and swap copy if they ship. Also: never name them in ad text — free brand mention for them and a comparative-ads policy risk on Meta.
6. **Free-during-beta is load-bearing.** Every ad in this pack says "free" — and right now that's literally true with no asterisk. When we eventually monetize (post-5K), the policy must grandfather existing users or we eat reputation damage. Decide that grandfather policy now, in writing, even though we're not enforcing it yet.
7. **Late draw deadlines in late-May / early-June mean week 1 traffic is the most valuable.** A click on day 1 has 19 days to convert into a Wyoming applicant. A click on day 30 has zero. Front-load if anything.
8. **onX is a partner, not a target.** Don't run ads that bash mapping tools. Our positioning is complementary (planning vs in-field). If a Meta reviewer flags us for competitive language, we'd rather not have to defend it.
9. **Apple Mail Privacy + iOS 17 means email-event tracking is noisy.** Trust the Supabase signup count more than Meta-reported "Leads."
10. **Disclaimer drift.** The About page says "AI-generated recommendations may contain errors." Ad copy must not contradict that — avoid superlatives like "best plan," "perfect strategy," etc. Stick with "your plan," "your strategy."

---

## 7. What Mayor needs to decide before launch

- [ ] **Install Meta Pixel on taghunter.com.** Blocker. Estimate 1-2 hours of dev work (add Pixel ID to layout.tsx, wire 4 conversion events). Filed as a bd issue.
- [ ] **Confirm WaitlistForm has captured ≥100 emails into a usable Supabase table.** If yes, Cold B lookalike can launch week 1. If no, Cold B defers to week 3.
- [ ] **Verify the priority-queue states in DATA_STATUS.md (OR, MT, WY, AZ, ID) BEFORE V1 launches.** A panic ad that sends users to incorrect data is worse than no ad.
- [ ] **Approve the creator shortlist + outreach budget cap.** Default $600, raise to $800 if you want the top tier.
- [ ] **Confirm blog/guides infrastructure exists (or sign off on building it) before the SEO posts are commissioned.**
- [ ] **Sign off on which writer handles the Reddit/forum presence.** Their personal account becomes the TagHunter face in those communities — choose carefully.
- [ ] **Lock the grandfather policy for existing beta users in writing**, even though we're not monetizing yet. So when we eventually do, the answer is already on file.
- [ ] **Final go/no-go.** Once items 1-3 above clear, hit launch. Until then, this is a draft.
