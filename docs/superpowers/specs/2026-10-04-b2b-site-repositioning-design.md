# B2B Site Repositioning — Design Spec

**Date:** 2026-10-04
**Status:** Draft v2, review decisions applied (see section 10)
**Source of truth for claims:** `SoterCare-Pitch-updatedv2.pdf` (also at `public/pitch-deck/`)
**Scope:** All public front pages. **Out of scope:** `/dashboard/**`, `/editnews`, `/api/**`, and news article content (CMS-managed).

---

## 1. Why this change

SoterCare is no longer selling a kit to families first. The go-to-market is now **B2B first**: sell to fee-paying care homes, prove it there, and only then ship a household kit. The household kit becomes a public **promise to the community**, not an offer.

The site today is a B2C consumer product page. It speaks to "your loved ones", sells a $329 pre-order kit, and lists Free/Pro/Enterprise subscription tiers. All of that contradicts the pitch deck and has to change.

### What stays the same
- The system: thigh node, gateway, backend, ML trends, mobile app.
- The design system (light neumorphic tokens, `#3d7e93` for accent text on white, GSAP/Lenis motion, section chips). **This is a copy and structure change, not a visual rebrand.**
- `/news`, `/community`, `/pitch` routes and their purpose.

### What changed in the product (to reflect on the site)
| Item | Before | Now |
|---|---|---|
| Buyer | Individual family | Care home (manager + carers), families as guardians |
| Thigh band | Wearable | **Unchanged** |
| Gateway | Small hub | **15.6-inch touch screen** with an all-residents overview (see every resident's status at once) |
| Mobile app | One login | **Two logins: Caregiver and Guardian** |
| Caregiver | n/a | Receives **critical alerts** |
| Guardian (family) | n/a | Real-time status, summaries, trends, patterns, full records. Notified only for concerning issues or necessary updates, not every alert |

---

## 2. Audience and message hierarchy

**Primary visitor:** care home owner or manager, plus investors and NIA reviewers arriving from the pitch. **Secondary:** families of residents, who learn what they would get as guardians. **Tertiary:** the student community and press (unchanged pages).

**One-line positioning (from the deck):**
> A smart care system that monitors, alerts, spots trends and keeps the record, for every resident in a care home.

**Core promise:** safer care without hiring more staff. No cameras, ever. Works offline.

**Four verbs to reuse across the site:** Monitor · Alert · Analyse · Record. They map to the deck's ecosystem slide and make every section scannable.

---

## 3. Information architecture

Home (`/`) stays a single scrolling page. No new routes. Order changes to follow the pitch narrative: problem, solution, proof, how to buy.

| # | Section | Anchor | Status | Source in deck |
|---|---|---|---|---|
| 1 | Hero | — | Rewrite | Cover |
| 2 | Promise (non-pinned scroll reveal that starts as the section enters view; about responsible elderly care and families staying connected safely; only key words bold blue) | `#promise` | Rewrite | Mission |
| 3 | How it works (Monitor, Alert, Analyse, Record) | `#how-it-works` | **New** (replaces Features intro) | Solution/Ecosystem |
| 4 | Product: thigh node, ward gateway, apps | `#product` | Rewrite | Product slide, A4/A5 |
| 5 | ~~For carers and for families (two logins)~~ | — | **Removed (user decision)** | — |
| 6 | Features (trimmed) | `#features` | Rewrite | Innovation slides |
| 7 | Proof and roadmap | `#proof` | **New** | Traction, TRL, pilot targets |
| 8 | Pricing: talk to us, and who we are (startup) | `#pricing` | Rewrite (see 5.8) | Business Model |
| 9 | Coming home (household kit promise) | `#home-kit` | **New** | User brief |
| 10 | Latest News | — | Unchanged | — |
| 11 | Community intro | — | Unchanged | — |
| 12 | FAQ | `#faqs` | Rewrite | — |
| 13 | Team (+ advisors) | `#team` | Update | Team slide |
| 14 | Footer / contact | `#contact` | Rewrite copy | Closing slide |

`Pricing.tsx` exists but is **not currently mounted** on the home page. It is rewritten and mounted at slot 8.
`Mission.tsx` (the pinned "be their child again" quote) is retired from the home page. Its tech-stack marquee is kept and moved under Product.

---

## 4. Navigation and CTAs

- **Nav links:** Product · How it works · Pricing · Team · Community · News (heartbeat unchanged). Drop "Features" and "Contact" as top-level links.
- **Primary CTA everywhere:** **Book a demo** (opens the existing Contact popup, retitled and extended, see 5.12). Secondary: **See how it works** (scroll).
- The existing **Dashboard** button stays in the navbar, relabelled "Carer login". It is the entry point for staff, not for sales.
- No consumer "Pre-Order" button anywhere. The household kit CTA is **Join the home-kit waitlist** (existing `WaitlistPopup`).

---

## 5. Section-by-section content

Copy below is a **proposal**. Every number is from the deck; keep the deck's source footnotes in a collapsed "Sources" line per section.

### 5.1 Hero
- **Chip:** `For care homes`
- **H1:** "Safer care for every resident." / accent line: "Without hiring more staff."
- **Sub:** "SoterCare monitors every resident, alerts the right carer in seconds, learns each person's patterns and keeps the home's records. No cameras. Works without internet."
- **CTAs:** Book a demo · See how it works
- **Bottom bar:** `#healthtech` / `Sri Lanka Based` stay.
- **Marquee rows** (currently "Weight into wellness", "MedTech care", "Wellness Simplified"): replace with `MONITOR · ALERT · ANALYSE · RECORD`, `CAMERA-FREE`, `SOTERCARE`, `CARE HOME READY`.
- **Trust strip under CTAs:** `97.65% gait accuracy (lab data)` · `Alerts in seconds` · `24/7 recording` · `No cameras, ever`.

### 5.2 Problem (new)
Replaces the Mission pinned quote with a pinned reveal using the same scroll mechanic (reuse, do not rebuild).
- **Reveal line:** "Care breaks down, unseen."
- **Three stat cards:** 81% of care home falls are unwitnessed · 83% happen in the resident's own room · 31% of residents who fell waited over an hour on the floor.
- **Three pains:** Help comes late · Understaffed (2 or 3 carers per home covering every room at night) · No records kept (handover runs on memory).
- **Quote:** "This is not an eight-hour duty. We must work 24 hours." Carer, aged care home in Galle.
- **Local anchor:** 18% of Sri Lankans are 60+; about 40,000 nurses against the 88,000 needed.

### 5.3 How it works (new)
Four-step strip, one verb each:
1. **Monitor.** One band per resident. Motion, moisture and skin temperature.
2. **Alert.** Critical alerts reach the right carer's phone in seconds, straight to the right room.
3. **Analyse.** Our own models learn each resident's gait, night stand-ups and moisture patterns over weeks.
4. **Record.** Every resident, alert and response time in one place, with no extra paperwork.

### 5.4 Product
Retitle "IoT Devices" to **"The Hardware"** and show the system as three parts.

- **The Thigh Node (unchanged device).** "A soft thigh band worn under clothing. Sensors for motion, moisture and skin temperature. Streams readings to the gateway over the home's LAN. One per resident." Add: USB-C charging, 7-day battery target is a *target*, label it as such.
- **The Ward Gateway (changed).** "A 15.6-inch touch screen for the whole home. Runs the gait model and alerts for every bed, works offline, charges nodes over USB-C. The overview screen shows **every resident's status at once**: who is moving, resting, wet, or needs help." One gateway per home.
- **Backend and apps.** Stores every reading, finds trends over weeks, and an AI writes the shift handover.

**Wording changes forced by the deck**
- Remove all **wrist node** language (`Pricing.tsx`, `layout.tsx` JSON-LD). The deck has one body-worn device.
- Gateway hardware is described as "gateway" or "ward gateway", not "Raspberry Pi 5" (the final product uses a Compute Module 5; the Pi 5 is only the prototype).

### 5.5 Apps: two logins (rewrite of "Mobile App")
Split into two side-by-side panels with one mockup each.

| | **Caregiver login** | **Guardian login** |
|---|---|---|
| Who | Carers and nurses on shift | Family members of a resident |
| Gets | **Critical alerts** (stand-up attempt, fall, wet pad, device offline) with room and resident | Real-time status, daily summaries, trends and patterns |
| Can | Confirm or dismiss an alert (dismissals retrain the model), see response times | Browse all records and history; export |
| Does not | n/a | Get the carer alert stream. Guardians are notified **only when something concerning happens or an update is necessary for them** (e.g. a fall, a significant change in pattern, a care change). No routine or per-event alerts |

Keep from the current app copy: AI-powered plain-language summaries, data export (PDF/CSV), system timeline, password-less sign-in (OTP and Google). Reword "Recycle Bin" as a **carer** feature only.
**No heart rate or SpO2 anywhere.** The "Real-Time Vitals" card is removed; live status shows movement, activity, moisture and skin temperature. The current app mockup (`Mobile Mockup latest.png`) shows vitals and must be replaced (section 8).

### 5.6 Features: what each party gets
Reorganise Features by **who benefits**, so the section shows how SoterCare connects care homes, elders and their families. Four groups, each with 2 to 4 cards, in the existing bento card style.

| Group | Features |
|---|---|
| **Elders** | Camera-free monitoring (privacy and dignity) · Discreet moisture detection with private, silent alerts · Gait analysis model that spots a stand-up attempt before a fall (97.65%, lab data, five movement states) · Haptic warning on the band (prototype) |
| **Carers** | **Critical alerts** to the right carer's phone with room and resident · Instant hard-fall detection (kept) · Confirm or dismiss alerts; dismissals retrain the model (the "Recycle Bin") · ARIA: ask about a resident from their own records |
| **Care homes (managers)** | Ward gateway overview of every resident at once · Works offline with local alerts · Records, reports and AI-written shift handover · Response-time and device-status timeline · Multi-agent AI (Safety Guard with no LLM, ARIA, Clinical Report Agent) |
| **Families (guardians)** | Real-time status · Daily summaries in plain language · Trends and patterns over weeks · Full records, exportable · Notified only when something concerning happens |

Section header line naming the connection: "Elders wear it. Carers act on it. Families stay informed. Homes keep the record."
"Instant hard-fall detection" is kept as a carer feature at your direction; it is not in the deck, so confirm the wording with the IoT lead before publishing.
Reword "Your personal AI nurse" to "ARIA answers questions about a resident from their own records".

---

### 5.7 Proof and roadmap (new)
- **TRL strip:** TRL 5 done · **TRL 6 we are here** · TRL 7 next, pilot via NIA voucher · TRL 8 to 9 production.
- **Roadmap:** Months 1 to 8 build; months 9 to 10 test in 3 homes, 60 beds; then release and first paying homes.
- **Pilot targets (stated as targets, not results):** 80% wear time, under 1 false alarm per bed per week, response under 3 minutes.
- Link to `/news` for NIA finalist and CodeSprint items (already published there). No logos or claims beyond what news already says.

### 5.8 Pricing: talk to us (and who we are)
**No prices on the site.** Delete the Free/Pro/Enterprise tiers, the $329 kit, the "Pre-Order Now" button, and do not publish the deck's per-unit figures.
Replace with a short, honest section:
- **Heading:** "Priced for care homes. Let's talk."
- **Copy:** "SoterCare is a startup, and we are building this with our first care homes. Pricing is per home: a band for each resident, one ward gateway, and a small monthly fee per bed. Tell us about your home and we will send you a quote."
- **Included (no numbers):** one band per resident · one 15.6-inch ward gateway · caregiver and guardian apps · support.
- **Startup statement** (reused in footer and Team): "We are a startup building SoterCare. Working prototype today, pilots in real care homes next. Early partners shape the product."
- **CTA:** Book a demo (contact form, see 5.12).
Pricing detail stays in `/pitch` only (investor-facing).

---

### 5.9 Coming home: household kit (new)
Small, honest, low-key section. It is a promise, not a product.
- **Heading:** "Then, every home."
- **Copy:** "We are starting where the need is greatest: care homes. Once SoterCare is proven there, we will bring it to families as a home kit. That is our promise to the community."
- **CTA:** Join the home-kit waitlist (existing `WaitlistPopup`; it already requires newsletter subscription).
- **Rules:** no price, no date, no specs, no "pre-order". Do not imply availability.

### 5.10 FAQ (rewrite; keep the accordion component)
Replace all five. Proposed set:
1. How is SoterCare different from call bells and CCTV? (Alerts before the fall; residents do not need to press anything; no cameras.)
2. Do you use cameras? (No, ever. Privacy and consent friendly.)
3. Does it work if the internet or Wi-Fi goes down? (Gateway runs the model and alerts locally and buffers data; alerts reach carers over the home's LAN. Final wording to be checked with the team.)
4. What does it cost a home? (Quoted per home after a conversation. We are a startup building with our first care homes; contact us.)
5. What can families see, and who gets alerts? (Two logins: carers get critical alerts; families see status, trends and records and are notified only about concerning issues or necessary updates.)
6. Is it a medical device? (Safety monitoring and records, not diagnosis.)
7. When can my family get one at home? (Promise, per 5.9.)

The `FAQPage` JSON-LD in `layout.tsx` must mirror the visible FAQ exactly.

### 5.11 Team
- Keep the three founders; update roles to the deck: Daham Dissanayake, Founder, IoT and ML · Sanjula Herath, Co-founder, Backend and AI · Komudi Senarachchi, Co-founder, Design and Docs.
- **Add an Advisors row:** Banu Athuraliya (external advisor, IIT) and Dr. P.A.D.M. Senarachchi (medical expert, National Hospital Kandy). Need photos and consent to list.
- Closing line from the deck: "SoterCare started with caring for our own grandparents."
- **Name:** use "Komudi Senarachchi" on the site (decided; the deck's "Dhara" is not used). Add a short "We are a startup" line here too.

### 5.12 Contact and popups
- **`ContactPopup` → "Book a demo".** Add optional fields: care home name, number of beds, role. Keep the message field. Submissions go through the existing Resend flow to the **same team inbox** (no separate address). Update `ContactNotification` (flag it as a care-home enquiry) and `ContactAutoReply` (startup-honest tone: a small team that will reply personally). Touches `src/app/actions.ts`.
- **`WaitlistPopup`** → home-kit waitlist (copy only).
- **`NewsletterPopup`**: copy only ("Updates for care homes and families").
- **Footer:** replace "Wellness Simplified" with "Smarter care for every elder." Keep phone, email, LinkedIn, Instagram, GitHub. Add `sotercare.com` as in the deck.

### 5.13 Other routes
- **`/pitch`** (`PitchViewer`): keep. Confirm `public/pitch-deck/SoterCare-Pitch-updatedv2.pdf` is the final deck. No code change expected.
- **`/news`, `/news/[slug]`, `/community`:** no content changes. Only the shared Footer and Navbar change.
- **`not-found`:** no change.

---

## 6. SEO and structured data

All in `src/app/layout.tsx`, `sitemap.ts`, `robots.ts`.

- **Title/description:** "SoterCare - Smart Care Monitoring for Care Homes" and a B2B description built from the positioning line. Drop "keep your loved ones safe" phrasing.
- **Keywords:** replace consumer terms with `care home monitoring`, `fall prevention care home`, `aged care technology`, `camera-free resident monitoring`, `nursing home alert system`, `Sri Lanka care homes`.
- **Open Graph and Twitter:** same text update. `og.png` alt text updated; ask design whether the image itself shows consumer imagery.
- **JSON-LD:**
  - `Organization.description` rewritten.
  - **Remove** `Product` with $329 PreOrder offer and the `SoftwareApplication` price 0 offer. A false price is a structured-data guideline risk. Replace with a `Service` or `Product` with no `offers`, or `offers` omitted.
  - `BreadcrumbList` matches new anchors.
  - `FAQPage` matches 5.10.
  - Theme colour `#a0cbdb` in `<meta>` is fine (not text).
- **Sitemap:** no new routes, so no change.

---

## 7. Claims and compliance rules

1. Every figure comes from the deck. If the deck changes, the site changes.
2. Label **lab data** wherever 97.65% appears. Never present it as real-world accuracy.
3. Pilot numbers are **targets**. Roadmap is a plan.
4. No medical claims. Position as "safety monitoring and records, not diagnosis" (deck risk A3).
5. No cameras claim is absolute in the deck ("no cameras, ever"); keep.
6. "Works offline" means local detection and alerting on the home LAN. Do not imply cloud features (trends, family app) work offline.
7. Do not name pilot homes or partners that are not already public.
8. No prices on the public site. Pricing detail lives only in the `/pitch` deck.
9. Say plainly that SoterCare is a startup. Never imply an established vendor, customer base or certifications.

---

## 8. Assets required

| Asset | Status | Owner |
|---|---|---|
| Gateway 3D model + stills for **15.6-inch** screen (`public/models/edge-gateway.html`, `assets/features/*gateway*`) | Current art is the old hub | Hardware/design |
| Gateway **all-residents overview screen** mockup | Missing | Design |
| **Caregiver** app mockup | Missing | Design |
| **Guardian** app mockup | Missing | Design |
| Thigh node art | Reusable | — |
| Advisor photos | Missing | Team |
| Remove `the-wrist-node.webp` usages | Cleanup | Dev |

Until mockups exist, `AppsDuo` shows a labelled 'App screens coming soon' frame. The old mockup shows vitals and is not used. Do not block copy work on assets.

---

## 9. Implementation shape (for the plan step)

Mostly content edits inside existing components; a few new components.

- **Edit:** `Hero`, `Navbar`, `Footer`, `Product`, `Features`, `FAQ`, `Team`, `Pricing`, `ContactPopup`, `WaitlistPopup`, `NewsletterPopup`, `layout.tsx` (metadata + JSON-LD), `actions.ts`, 2 email templates.
- **New:** `Problem`, `HowItWorks`, `Proof`, `HomeKit`, `AppsDuo` (carer/guardian). Follow existing section pattern (chip, `h2`, GSAP reveal via `useGSAP`).
- **Retire from home:** `Mission` pinned quote (keep file for the tech-stack row, or move the row into `Product`).
- **Compose** in `src/app/page.tsx` in the order of section 3.
- **Hardening:** keep copy in typed constants at the top of each component so the next repositioning is a data edit.
- **Suggested phasing:** (1) metadata, hero, nav, footer, FAQ; (2) problem, how-it-works, product, apps; (3) pricing, home-kit, proof, team, forms; (4) asset swaps as they arrive.

### Testing and verification
- `next build` and `eslint` clean.
- Manual pass at 375, 768 and 1440 widths for every changed section (GSAP pins are the usual breakage point).
- Grep check that none of these remain on public pages: `wrist`, `$329`, `Pre-Order`, `loved one`, `$1.99`, `under \$150`, `Free`/`Pro` plan names, `Raspberry Pi` (allowed only in `TechStack.tsx`, where it names the prototype logo).
- JSON-LD validated with Google's Rich Results test; FAQ text identical to the page.
- Contact form end to end (new fields, both emails).
- `/dashboard`, `/editnews` untouched: `git diff --stat` shows no files under those paths.

---

## 10. Decisions

Resolved in review (2026-10-04):
1. **Pricing:** contact us only. The demo/contact form goes via Resend to the team inbox. The site states plainly that we are a startup.
2. **Guardian alerts:** guardians are notified only for concerning issues or necessary updates. Carers receive the critical alerts.
3. **Vitals:** heart rate and SpO2 removed from the site.
4. **Name:** "Komudi Senarachchi".
5. **Hard-fall detection:** kept, shown as a carer feature. Features are organised by party (elders, carers, care homes, families).

Still open (defaults assumed):
- Home-kit waitlist requires newsletter signup first today. *(Assumed: keep.)*
- Confirm the "works offline" and hard-fall wording with the IoT lead before publishing.

---

## 11. Success criteria

- A care home manager landing on the site understands within one screen: what it is, who it is for, that it uses no cameras, and how to book a demo.
- No page, metadata or structured data contradicts the pitch deck.
- The household kit appears only as a promise with a waitlist.
- Dashboard and CMS pages are byte-for-byte untouched.
