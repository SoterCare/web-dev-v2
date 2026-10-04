# B2B Site Repositioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition every public front page of the SoterCare site from a consumer kit pitch to a care-home (B2B) pitch, with the household kit shown only as a community promise.

**Architecture:** Keep the single-page home (`src/app/page.tsx`) and the existing design system and GSAP section pattern. Rewrite copy in existing components, add five new section components (`Problem`, `HowItWorks`, `AppsDuo`, `Proof`, `HomeKit`), and move FAQ text into one shared module so the visible FAQ and the FAQPage JSON-LD cannot drift. Because the repo has no test framework, two small automated guards are added first (a banned/required-copy script and a Node test for the demo-form parser) and every later task is driven to green against them.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, GSAP + ScrollTrigger (`@gsap/react`), Lenis, lucide-react, Resend + `@react-email/components`. Node 26 for `node --test`.

**Spec:** `docs/superpowers/specs/2026-10-04-b2b-site-repositioning-design.md`

## Global Constraints

- **Out of scope, must stay byte-identical:** `src/app/dashboard/**`, `src/app/editnews/**`, `src/app/api/**`, `src/components/dashboard/**`, `data/news.json`.
- **No prices on the public site.** No `$` amounts anywhere in public pages. Pricing detail lives only in the `/pitch` PDF.
- **Say plainly that SoterCare is a startup.** Never imply an established vendor, customer base or certifications.
- **No heart rate, SpO2, blood oxygen or "vitals" anywhere.** Live status = movement, activity, moisture, skin temperature.
- **No wrist node.** One body-worn device: the thigh node.
- **Name:** "Komudi Senarachchi" (never "Dhara" as a surname).
- **Guardians** are notified only for concerning issues or necessary updates. **Carers** receive the critical alerts.
- **97.65%** always carries "lab data". Pilot figures are *targets*, the roadmap is a *plan*.
- **Offline wording:** detection and alerting run locally on the home LAN. Never imply cloud features (trends, family app) work offline.
- **Household kit:** promise and waitlist only. No price, date, specs or "pre-order".
- **Accent text on white:** use `#3d7e93`, never `#a0cbdb` (light neumorphic design system; tokens `bg-bg-card`, `shadow-m`, `text-text`, `text-text-muted`).
- **Primary CTA everywhere:** "Book a demo", implemented by `window.dispatchEvent(new Event("open-contact-popup"))`.
- **No new routes.** `sitemap.ts` is unchanged.
- **Commit trailer** on every commit: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Demo form with only the required fields** (no care home, beds or role): must still send both emails. Pinned by Task 1b tests.
2. **Beds typed as text** ("about twenty five", "25 beds", `-3`, a 5,000-character paste): must be sanitised to digits and length-capped, never crash the email render. Pinned by Task 1b tests.
3. **FAQ drift:** visible FAQ and `FAQPage` JSON-LD diverge after a later edit. Prevented structurally (both import `src/lib/faqs.ts`) and pinned by a guard check in Task 1a.
4. **Dead nav anchors:** a navbar link to `#how-it-works`, `#pricing` etc. whose section id was renamed. Pinned by `REQUIRED` id checks in Task 1a.
5. **Pinned Problem section overflowing a 375 px phone screen** (stat cards plus headline taller than the viewport). Pinned by the manual width check in Task 15.

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `scripts/check-copy.mjs` | Banned/required copy and anchor guard (`npm run check:copy`) | Create |
| `tests/check-copy.test.mjs` | Unit tests for the guard's matcher | Create |
| `src/lib/demoRequest.ts` | Pure parse/validate/subject logic for the demo form | Create |
| `tests/demoRequest.test.mjs` | Unit tests for `demoRequest.ts` | Create |
| `src/lib/faqs.ts` | Single source of FAQ text (page + JSON-LD) | Create |
| `src/lib/useSectionReveal.ts` | Shared GSAP fade-up reveal hook | Create |
| `src/components/SectionHeader.tsx` | Shared chip + `h2` + subtitle | Create |
| `src/components/Problem.tsx` | Pinned problem reveal + stats + pains | Create |
| `src/components/TechStack.tsx` | Tech-logo marquee (moved out of `Mission`) | Create |
| `src/components/HowItWorks.tsx` | Monitor / Alert / Analyse / Record | Create |
| `src/components/AppsDuo.tsx` | Caregiver login vs Guardian login | Create |
| `src/components/Proof.tsx` | TRL, roadmap, pilot targets | Create |
| `src/components/HomeKit.tsx` | "Then, every home" promise + waitlist | Create |
| `src/components/Mission.tsx` | Retired | Delete |
| `src/components/Hero.tsx`, `Navbar.tsx`, `Footer.tsx`, `Product.tsx`, `Features.tsx`, `Pricing.tsx`, `FAQ.tsx`, `Team.tsx` | Copy and structure | Modify |
| `src/components/ContactPopup.tsx`, `WaitlistPopup.tsx`, `NewsletterPopup.tsx` | Demo form and popup copy | Modify |
| `src/app/actions.ts` | `contactAction` uses `parseDemoRequest` | Modify |
| `src/emails/Contact*.tsx`, `Welcome*.tsx` | Email copy | Modify |
| `src/app/layout.tsx` | Metadata and JSON-LD | Modify |
| `src/app/page.tsx` | Section order | Modify |
| `package.json` | `test` and `check:copy` scripts | Modify |

---

### Task 1a: Copy guard (red first)

**Files:**
- Create: `scripts/check-copy.mjs`
- Create: `tests/check-copy.test.mjs`
- Modify: `package.json` (scripts)

**Interfaces:**
- Produces: `export function findViolations(text: string, relPath: string): string[]` (rule names, `relPath` uses forward slashes); `export function findMissing(readFile: (rel: string) => string | null): string[]`; `export const RULES`, `export const REQUIRED`. CLI: `node scripts/check-copy.mjs` exits 1 listing `file: rule` lines.

- [ ] **Step 1: Write the failing test**

Create `tests/check-copy.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { findViolations, findMissing } from "../scripts/check-copy.mjs";

test("flags banned consumer and vitals copy", () => {
  assert.ok(findViolations("includes a Wrist Node", "src/components/Pricing.tsx").length > 0);
  assert.ok(findViolations("only $329 one-time", "src/components/Pricing.tsx").length > 0);
  assert.ok(findViolations("live Heart Rate and SpO2", "src/components/Product.tsx").length > 0);
  assert.ok(findViolations("Wellness Simplified", "src/emails/ContactAutoReply.tsx").length > 0);
  assert.ok(findViolations("Komudi Dhara", "src/components/Team.tsx").length > 0);
});

test("clean care-home copy passes", () => {
  assert.deepEqual(
    findViolations("Safer care for every resident. Book a demo.", "src/components/Hero.tsx"),
    [],
  );
});

test("allow-listed file may mention Raspberry Pi", () => {
  assert.deepEqual(findViolations("Raspberry Pi", "src/components/TechStack.tsx"), []);
  assert.ok(findViolations("Raspberry Pi", "src/components/FAQ.tsx").length > 0);
});

test("findMissing reports absent required copy and anchors", () => {
  const missing = findMissing(() => null);
  assert.ok(missing.length > 0);
  assert.ok(missing.some((m) => m.includes("src/components/Hero.tsx")));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/check-copy.test.mjs`
Expected: FAIL with `Cannot find module .../scripts/check-copy.mjs`

- [ ] **Step 3: Write the guard**

Create `scripts/check-copy.mjs`:

```js
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

// Public-facing sources only. Dashboard, editnews, api and CMS data are out of scope.
const SCAN = ["src/app", "src/components", "src/emails", "src/lib/faqs.ts"];
const SKIP = ["src/app/dashboard", "src/app/editnews", "src/app/api", "src/components/dashboard"];

export const RULES = [
  { name: "wrist node", re: /wrist/i },
  { name: "consumer kit price", re: /\$329|\b3\.29\b/ },
  { name: "pre-order", re: /pre-?order/i },
  { name: "consumer 'loved ones' copy", re: /loved ones?\b/i },
  { name: "old consumer pricing", re: /\$1\.99|under \$150/i },
  { name: "Raspberry Pi (prototype only)", re: /raspberry pi/i, allow: ["src/components/TechStack.tsx"] },
  { name: "heart rate / SpO2 / vitals", re: /spo2|heart rate|blood oxygen|\bvitals?\b/i },
  { name: "old tagline", re: /wellness simplified|weight into wellness|medtech care/i },
  { name: "wrong surname", re: /Komudi Dhara/ },
  { name: "subscription tiers", re: /\benterprise\b/i },
  { name: "published price", re: /\$\s?\d/ },
  { name: "structured-data offer", re: /priceCurrency/ },
];

export const REQUIRED = [
  { file: "src/components/Hero.tsx", re: /Book a demo/, why: "primary CTA" },
  { file: "src/components/Pricing.tsx", re: /startup/i, why: "startup statement" },
  { file: "src/components/Team.tsx", re: /startup/i, why: "startup statement" },
  { file: "src/components/HomeKit.tsx", re: /promise/i, why: "household-kit promise" },
  { file: "src/app/page.tsx", re: /<HomeKit/, why: "home-kit section mounted" },
  { file: "src/components/Problem.tsx", re: /id="problem"/, why: "anchor #problem" },
  { file: "src/components/HowItWorks.tsx", re: /id="how-it-works"/, why: "anchor #how-it-works" },
  { file: "src/components/AppsDuo.tsx", re: /id="apps"/, why: "anchor #apps" },
  { file: "src/components/Proof.tsx", re: /id="proof"/, why: "anchor #proof" },
  { file: "src/components/Pricing.tsx", re: /id="pricing"/, why: "anchor #pricing" },
  { file: "src/components/HomeKit.tsx", re: /id="home-kit"/, why: "anchor #home-kit" },
  { file: "src/app/layout.tsx", re: /from "@\/lib\/faqs"/, why: "JSON-LD uses shared FAQ module" },
  { file: "src/components/FAQ.tsx", re: /from ['"]@\/lib\/faqs['"]/, why: "FAQ uses shared FAQ module" },
];

export function findViolations(text, relPath) {
  return RULES.filter((r) => !(r.allow ?? []).includes(relPath) && r.re.test(text)).map((r) => r.name);
}

export function findMissing(readFile) {
  const out = [];
  for (const req of REQUIRED) {
    const text = readFile(req.file);
    if (text === null || !req.re.test(text)) out.push(`${req.file}: missing ${req.why}`);
  }
  return out;
}

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = relative(process.cwd(), full).split(sep).join("/");
    if (SKIP.includes(rel)) continue;
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.tsx?$/.test(entry)) yield rel;
  }
}

function main() {
  const failures = [];
  const files = SCAN.flatMap((p) => (statSync(p).isDirectory() ? [...walk(p)] : [p]));
  for (const rel of files) {
    for (const name of findViolations(readFileSync(rel, "utf8"), rel)) failures.push(`${rel}: ${name}`);
  }
  failures.push(
    ...findMissing((rel) => (existsSync(rel) ? readFileSync(rel, "utf8") : null)),
  );
  if (failures.length) {
    console.error(failures.join("\n"));
    console.error(`\n${failures.length} copy problem(s).`);
    process.exit(1);
  }
  console.log("Copy check passed.");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
```

- [ ] **Step 4: Add npm scripts**

In `package.json` `"scripts"`, add after `"lint": "eslint"`:

```json
    "test": "node --test \"tests/**/*.test.mjs\"",
    "check:copy": "node scripts/check-copy.mjs"
```
(add the comma after `"lint": "eslint"`.)

- [ ] **Step 5: Run unit tests, then the CLI**

Run: `npm test`
Expected: PASS (4 tests).

Run: `npm run check:copy`
Expected: FAIL, exit 1, listing many `file: rule` lines (Hero, Pricing, FAQ, layout, Features, Product, emails, Footer, Mission…) and the missing-section lines. This is the red baseline every later task drives down. Save it: `npm run check:copy 2> .scratch-copy-baseline.txt` (do not commit this file).

- [ ] **Step 6: Record the dashboard baseline**

Run: `git rev-parse HEAD > .scratch-base-sha.txt` (do not commit). Task 15 diffs against it.

- [ ] **Step 7: Commit**

```bash
git add scripts/check-copy.mjs tests/check-copy.test.mjs package.json
git commit -m "test: add copy guard for B2B repositioning

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 1b: Demo-request parser (TDD)

**Files:**
- Create: `src/lib/demoRequest.ts`
- Test: `tests/demoRequest.test.mjs`

**Interfaces:**
- Produces:
  - `interface DemoRequest { name: string; email: string; message: string; home: string; beds: string; role: string }`
  - `parseDemoRequest(formData: FormData): DemoRequest` (throws `Error` with a user-readable message)
  - `buildSubject(req: DemoRequest): string`
- Must have **no imports** (Node strips types and runs it directly; the `@/` alias is not available in tests).

- [ ] **Step 1: Write the failing test**

Create `tests/demoRequest.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseDemoRequest, buildSubject } from "../src/lib/demoRequest.ts";

const form = (fields) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
};

test("required fields only: optional fields come back empty", () => {
  const r = parseDemoRequest(form({ name: "Nimal", email: "n@home.lk", message: "Hi" }));
  assert.deepEqual(r, { name: "Nimal", email: "n@home.lk", message: "Hi", home: "", beds: "", role: "" });
});

test("trims whitespace and caps lengths", () => {
  const r = parseDemoRequest(
    form({ name: "  Nimal  ", email: "n@home.lk", message: "x".repeat(5000), home: "h".repeat(500) }),
  );
  assert.equal(r.name, "Nimal");
  assert.equal(r.message.length, 4000);
  assert.equal(r.home.length, 150);
});

test("beds keeps digits only and caps at 5 digits", () => {
  const beds = (v) => parseDemoRequest(form({ name: "a", email: "a@b.co", message: "m", beds: v })).beds;
  assert.equal(beds("25 beds"), "25");
  assert.equal(beds("about twenty five"), "");
  assert.equal(beds("-3"), "3");
  assert.equal(beds("1234567"), "12345");
});

test("missing required field throws", () => {
  assert.throws(() => parseDemoRequest(form({ name: "a", email: "a@b.co" })), /required/i);
  assert.throws(() => parseDemoRequest(form({ email: "a@b.co", message: "m" })), /required/i);
});

test("invalid email throws", () => {
  assert.throws(() => parseDemoRequest(form({ name: "a", email: "nope", message: "m" })), /valid email/i);
});

test("subject flags care-home enquiries", () => {
  const base = { name: "Nimal", email: "n@h.lk", message: "m", beds: "", role: "" };
  assert.equal(buildSubject({ ...base, home: "Sunrise Care" }), "New care-home enquiry from Nimal (Sunrise Care) — SoterCare");
  assert.equal(buildSubject({ ...base, home: "" }), "New message from Nimal — SoterCare");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/demoRequest.test.mjs`
Expected: FAIL, `Cannot find module .../src/lib/demoRequest.ts`

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/demoRequest.ts`:

```ts
export interface DemoRequest {
  name: string;
  email: string;
  message: string;
  home: string;
  beds: string;
  role: string;
}

const text = (value: FormDataEntryValue | null, max: number): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseDemoRequest(formData: FormData): DemoRequest {
  const name = text(formData.get("name"), 100);
  const email = text(formData.get("email"), 254);
  const message = text(formData.get("message"), 4000);

  if (!name || !email || !message) {
    throw new Error("Name, email and message are required");
  }
  if (!EMAIL.test(email)) {
    throw new Error("Please enter a valid email address");
  }

  return {
    name,
    email,
    message,
    home: text(formData.get("home"), 150),
    beds: text(formData.get("beds"), 40).replace(/\D/g, "").slice(0, 5),
    role: text(formData.get("role"), 100),
  };
}

export function buildSubject(req: DemoRequest): string {
  return req.home
    ? `New care-home enquiry from ${req.name} (${req.home}) — SoterCare`
    : `New message from ${req.name} — SoterCare`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (all tests, both files).

- [ ] **Step 5: Commit**

```bash
git add src/lib/demoRequest.ts tests/demoRequest.test.mjs
git commit -m "feat: add demo-request parser with tests

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Shared building blocks

**Files:**
- Create: `src/components/SectionHeader.tsx`
- Create: `src/lib/useSectionReveal.ts`
- Create: `src/lib/faqs.ts`

**Interfaces:**
- Produces:
  - `SectionHeader({ chip: string; title: ReactNode; subtitle?: ReactNode })` default export.
  - `useSectionReveal(sectionRef: RefObject<HTMLElement | null>, contentRef: RefObject<HTMLElement | null>): void`.
  - `export const faqs: { question: string; answer: string }[]` (7 items) from `@/lib/faqs`.

- [ ] **Step 1: Create `SectionHeader.tsx`**

```tsx
import React from "react";

interface SectionHeaderProps {
  chip: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

const SectionHeader = ({ chip, title, subtitle }: SectionHeaderProps) => (
  <div className="text-center mb-10 md:mb-14 flex flex-col items-center">
    <span className="bg-bg-card px-8 md:px-10 py-2 md:py-3 rounded-[2rem] shadow-m text-sm md:text-base font-bold uppercase tracking-widest text-foreground/60 mb-4 w-fit">
      {chip}
    </span>
    <h2 className="text-4xl md:text-6xl font-bold tracking-tight">{title}</h2>
    {subtitle && (
      <p className="mt-4 max-w-2xl text-lg md:text-xl text-text-muted leading-relaxed">{subtitle}</p>
    )}
  </div>
);

export default SectionHeader;
```

- [ ] **Step 2: Create `useSectionReveal.ts`**

```ts
"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Same fade-up used by Features, Pricing, FAQ and Product today.
export function useSectionReveal(
  sectionRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
) {
  useGSAP(
    () => {
      if (!sectionRef.current || !contentRef.current) return;
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: sectionRef },
  );
}
```

- [ ] **Step 3: Create `src/lib/faqs.ts`**

```ts
export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "How is SoterCare different from call bells and CCTV?",
    answer:
      "Call bells need a resident who can press them, and CCTV needs someone watching 24/7. SoterCare is worn on the body, spots a stand-up attempt before a fall, and alerts the right carer's phone in seconds, day and night. Nobody has to press anything or watch a screen.",
  },
  {
    question: "Does SoterCare use cameras?",
    answer:
      "No, never. SoterCare uses a body-worn band with motion, moisture and skin temperature sensors, so there are no cameras in bedrooms or bathrooms. That protects residents' privacy and dignity.",
  },
  {
    question: "Does it work if the internet goes down?",
    answer:
      "Detection and carer alerts run on the ward gateway inside the home, over the home's local network, so they keep working without internet. Features that need the cloud, such as long-term trends and the family app, catch up when the connection returns.",
  },
  {
    question: "What does it cost a care home?",
    answer:
      "Pricing is per home: a band for each resident, one ward gateway and a small monthly fee per bed. We are a startup building SoterCare with our first care homes, so we quote each home personally. Book a demo and tell us about your home.",
  },
  {
    question: "What can families see, and who gets alerts?",
    answer:
      "There are two logins. Carers receive the critical alerts. Families, as guardians, see real-time status, daily summaries, trends and patterns, and the full records. They are notified only when something concerning happens or an update is necessary for them.",
  },
  {
    question: "Is SoterCare a medical device?",
    answer:
      "SoterCare is a safety monitoring and record-keeping system. It does not diagnose. It helps carers respond faster and gives homes and families an accurate record.",
  },
  {
    question: "When can my family get SoterCare at home?",
    answer:
      "Care homes come first. Once SoterCare is proven there, we plan to bring it to families as a home kit. That is our promise to the community. Join the home-kit waitlist and we will keep you posted.",
  },
];
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors from the three new files.

- [ ] **Step 5: Commit**

```bash
git add src/components/SectionHeader.tsx src/lib/useSectionReveal.ts src/lib/faqs.ts
git commit -m "feat: add shared section header, reveal hook and FAQ source

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Metadata and JSON-LD

**Files:**
- Modify: `src/app/layout.tsx` (the `jsonLd` constant and `metadata` export; imports)

**Interfaces:**
- Consumes: `faqs` from `@/lib/faqs`.

- [ ] **Step 1: Confirm red**

Run: `npm run check:copy`
Expected: lines for `src/app/layout.tsx` (wrist, `$329`, `priceCurrency`, vitals, `heart rate`, etc.).

- [ ] **Step 2: Replace the structured data and metadata**

In `src/app/layout.tsx`, add this import next to the other imports (above the `jsonLd` constant is fine):

```tsx
import { faqs } from "@/lib/faqs";
```

Delete everything from the line `// Safe, minimal, truthful schema - compliant with Google guidelines` through the end of the `metadata` export (`category: "Healthcare Technology",\n};`) and put this in its place:

```tsx
// Safe, minimal, truthful schema - compliant with Google guidelines.
// No Offer/price: SoterCare is quoted per care home, not sold at a public price.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://sotercare.com/#organization",
      name: "SoterCare",
      url: "https://sotercare.com",
      logo: {
        "@type": "ImageObject",
        url: "https://sotercare.com/assets/SoterCare-centered-logo.webp",
        width: 512,
        height: 512,
      },
      description:
        "SoterCare is a startup building a smart care system for care homes: a camera-free thigh band, a ward gateway and apps that monitor every resident, alert the right carer in seconds, spot trends and keep the home's records.",
      email: "sotercare@gmail.com",
      telephone: "+94704888440",
      address: {
        "@type": "PostalAddress",
        addressCountry: "LK",
      },
      sameAs: [
        "https://www.instagram.com/sotercare_",
        "https://www.linkedin.com/company/sotercare/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://sotercare.com/#website",
      name: "SoterCare",
      url: "https://sotercare.com",
      description: "Smart care monitoring for care homes. Smarter care for every elder.",
      publisher: {
        "@id": "https://sotercare.com/#organization",
      },
    },
    {
      "@type": "Service",
      "@id": "https://sotercare.com/#service",
      name: "SoterCare care home monitoring",
      serviceType: "Care home resident monitoring and alerting",
      description:
        "A body-worn thigh band, a 15.6-inch ward gateway and caregiver and guardian apps that monitor every resident, alert carers to critical events, learn each resident's patterns and keep the home's records, with no cameras.",
      provider: { "@id": "https://sotercare.com/#organization" },
      areaServed: { "@type": "Country", name: "Sri Lanka" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://sotercare.com" },
        { "@type": "ListItem", position: 2, name: "How it works", item: "https://sotercare.com/#how-it-works" },
        { "@type": "ListItem", position: 3, name: "Hardware", item: "https://sotercare.com/#product" },
        { "@type": "ListItem", position: 4, name: "Apps", item: "https://sotercare.com/#apps" },
        { "@type": "ListItem", position: 5, name: "Features", item: "https://sotercare.com/#features" },
        { "@type": "ListItem", position: 6, name: "Team", item: "https://sotercare.com/#team" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sotercare.com"),
  title: {
    default: "SoterCare - Smart Care Monitoring for Care Homes",
    template: "%s | SoterCare",
  },
  description:
    "SoterCare is a smart care system for care homes. A camera-free thigh band monitors every resident, alerts the right carer in seconds, spots trends in each resident's movement and keeps the home's records. A startup building with its first care homes in Sri Lanka.",
  keywords: [
    "care home monitoring",
    "fall prevention care home",
    "aged care technology",
    "camera-free resident monitoring",
    "nursing home alert system",
    "care home records",
    "caregiver alerts",
    "elderly care technology",
    "Sri Lanka care homes",
    "wearable resident monitoring",
  ],
  authors: [{ name: "SoterCare Team", url: "https://sotercare.com" }],
  creator: "SoterCare",
  publisher: "SoterCare",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sotercare.com",
    siteName: "SoterCare",
    title: "SoterCare - Smart Care Monitoring for Care Homes",
    description:
      "Safer care for every resident without hiring more staff. Camera-free monitoring, instant carer alerts, trends and records for care homes.",
    images: [
      {
        url: "https://sotercare.com/og.png",
        width: 1200,
        height: 630,
        alt: "SoterCare smart care system for care homes: thigh band, ward gateway and apps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SoterCare - Smart Care Monitoring for Care Homes",
    description:
      "Safer care for every resident without hiring more staff. Camera-free monitoring, instant carer alerts, trends and records.",
    images: ["https://sotercare.com/og.png"],
    creator: "@sotercare",
  },
  alternates: {
    canonical: "https://sotercare.com",
  },
  category: "Healthcare Technology",
};
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run check:copy`
Expected: no `src/app/layout.tsx` lines remain (the `from "@/lib/faqs"` required check for layout passes).

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: B2B metadata and JSON-LD, FAQ from shared module

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Hero, Navbar, Footer

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Hero imports and copy**

In `src/components/Hero.tsx`:

1. Change the lucide import to:
```tsx
import { ArrowDown, ArrowRight, CalendarCheck } from "lucide-react";
```
2. Eyebrow chip text `Wellness Simplified` becomes `For care homes`.
3. In the `<h1>`, replace the first span's classes `text-5xl sm:text-6xl md:text-7xl lg:text-8xl` with `text-4xl sm:text-5xl md:text-6xl lg:text-7xl` and its text `Proactive Elderly Care` with `Safer care for every resident.`. Replace the second span's classes `text-4xl sm:text-5xl md:text-6xl lg:text-7xl` with `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` and its text `Monitoring System` with `Without hiring more staff.`
4. Replace the two-line paragraph text (`Advanced real-time health monitoring ensuring safety and peace of mind for your loved ones.`) with:
```
SoterCare monitors every resident, alerts the right carer in seconds, learns
each person's patterns and keeps the home's records. No cameras. Works without internet.
```
5. Replace the whole CTA `<div className="reveal-text opacity-0 flex flex-col sm:flex-row ...">…</div>` with the following (dark primary is now Book a demo), and add the trust strip right after it:
```tsx
              <div className="reveal-text opacity-0 flex flex-col sm:flex-row items-center gap-4 mt-9 md:mt-11">
                <button
                  onClick={() => window.dispatchEvent(new Event("open-contact-popup"))}
                  className="group bg-text text-bg-card px-7 py-3.5 rounded-full font-bold text-base hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 shadow-lg"
                >
                  <CalendarCheck size={18} />
                  Book a demo
                </button>
                <a
                  href="#how-it-works"
                  className="group bg-bg-card text-text px-7 py-3.5 rounded-full font-bold text-base shadow-m hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
                >
                  See how it works
                  <ArrowRight size={18} className="text-[#3d7e93] transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              <ul className="reveal-text opacity-0 mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-text-muted">
                <li>97.65% gait accuracy (lab data)</li>
                <li>Alerts in seconds</li>
                <li>24/7 recording</li>
                <li>No cameras, ever</li>
              </ul>
```
6. Replace the `marqueeRows` array with:
```tsx
  const marqueeRows = [
    { text: "MONITOR · ALERT · ANALYSE · RECORD", dir: "left", duration: "35s" },
    { text: "SOTERCARE", dir: "right", duration: "28s" },
    { text: "CAMERA-FREE", dir: "left", duration: "38s" },
    { text: "CARE HOME READY", dir: "right", duration: "32s" },
  ];
```
(The existing `Array(8).fill(\`${row.text} · \`)` repeat logic stays.)

- [ ] **Step 2: Navbar links**

In `src/components/Navbar.tsx`, in the **desktop** link group replace the `#product`, `#features`, `#team`, `#contact` links with (keep the exact `className`/`scroll={false}` of the existing links; Community and News links stay as they are):

```tsx
          <Link href="#product" className="transition-colors text-base font-medium text-[#797979] hover:text-black" scroll={false}>Product</Link>
          <Link href="#how-it-works" className="transition-colors text-base font-medium text-[#797979] hover:text-black" scroll={false}>How it works</Link>
          <Link href="#pricing" className="transition-colors text-base font-medium text-[#797979] hover:text-black" scroll={false}>Pricing</Link>
          <Link href="#team" className="transition-colors text-base font-medium text-[#797979] hover:text-black" scroll={false}>Team</Link>
```
Do the same in the **mobile** menu (same four hrefs/labels, existing mobile className). Change both Dashboard buttons' label text `Dashboard` to `Carer login` (href stays `/dashboard`).

- [ ] **Step 3: Footer**

In `src/components/Footer.tsx`:

1. Replace `marqueeRows` entries with the same four rows used in the Hero (`MONITOR · ALERT · ANALYSE · RECORD`, `SOTERCARE`, `CAMERA-FREE`, `CARE HOME READY`, same dirs and durations).
2. Replace the heading text `Wellness Simplified.` with `Smarter care for every elder.` and reduce its classes `text-5xl sm:text-6xl md:text-7xl lg:text-8xl` to `text-4xl sm:text-5xl md:text-6xl lg:text-7xl`.
3. In the CTA group, change the first button's label `Send a Message` to `Book a demo` (keep the `open-contact-popup` onClick and the `Mail` icon).
4. Directly after the CTA `<div ref={ctaRef} …>…</div>`, add:
```tsx
              <p className="mt-8 max-w-xl text-sm md:text-base text-text-muted leading-relaxed">
                We are a startup building SoterCare with our first care homes.
                Early partners shape the product.
              </p>
```
5. Next to the existing `support@sotercare.com` link, add a second link:
```tsx
                  <a href="https://sotercare.com" className="hover:text-text transition-colors">
                    sotercare.com
                  </a>
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`, then `npm run check:copy`.
Expected: no remaining lines for `Hero.tsx`, `Navbar.tsx`, `Footer.tsx`.

Run `npm run dev`, open `http://localhost:3000`, and confirm at 1440 px and 375 px that the hero fits one screen without clipping the trust strip, and the footer heading wraps cleanly.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx src/components/Navbar.tsx src/components/Footer.tsx
git commit -m "feat: care-home hero, nav and footer copy

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 5: FAQ

**Files:**
- Modify: `src/components/FAQ.tsx`

**Interfaces:**
- Consumes: `faqs` from `@/lib/faqs`.

- [ ] **Step 1: Use the shared module**

In `src/components/FAQ.tsx`: add `import { faqs } from '@/lib/faqs';` with the other imports, then delete the local `const faqs = [ … ];` array (from `const faqs = [` through its closing `];`). Rendering code uses `faq.question` / `faq.answer`, which the shared type provides.

- [ ] **Step 2: Allow longer answers**

The answer wrapper currently uses `max-h-48` when open. Change `max-h-48` to `max-h-80` so the new, longer answers are not clipped.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`, then `npm run check:copy`.
Expected: no `FAQ.tsx` lines. In the dev server, open every FAQ item at 375 px and confirm no answer is clipped.

- [ ] **Step 4: Commit**

```bash
git add src/components/FAQ.tsx
git commit -m "feat: care-home FAQ from shared module

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Problem section and TechStack (retire Mission)

**Files:**
- Create: `src/components/Problem.tsx`
- Create: `src/components/TechStack.tsx`
- Delete: `src/components/Mission.tsx` (it is only imported by `src/app/page.tsx`, which Task 15 updates)

- [ ] **Step 1: Create `TechStack.tsx`** (the marquee moved out of Mission, behaviour unchanged)

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const technologies = [
  { name: "Next.js", src: "/assets/tech-logos/nextjs.webp" },
  { name: "React Native", src: "/assets/tech-logos/reactnative.webp" },
  { name: "NestJS", src: "/assets/tech-logos/nestjs.webp" },
  { name: "Flask", src: "/assets/tech-logos/flask.webp" },
  { name: "PostgreSQL", src: "/assets/tech-logos/postgresql.webp" },
  { name: "TensorFlow", src: "/assets/tech-logos/edgeimpulse.webp" },
  { name: "Raspberry Pi", src: "/assets/tech-logos/raspberry-pi.webp" },
  { name: "ESP", src: "/assets/tech-logos/ESP.webp" },
];

const TechStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const part1Ref = useRef<HTMLDivElement>(null);
  const part2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to([part1Ref.current, part2Ref.current], {
        xPercent: -100,
        repeat: -1,
        duration: 30,
        ease: "none",
      });
    },
    { scope: containerRef },
  );

  const row = (keyPrefix: string) =>
    technologies.map((tech, index) => (
      <div
        key={`${keyPrefix}-${index}`}
        className="mx-4 md:mx-12 relative h-10 w-10 sm:h-16 sm:w-16 md:h-20 md:w-20 aspect-square flex items-center justify-center"
      >
        <Image
          src={tech.src}
          alt={keyPrefix === "a" ? tech.name : ""}
          fill
          sizes="(max-width: 768px) 64px, 80px"
          className="object-contain"
        />
      </div>
    ));

  return (
    <section className="relative z-10 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 w-full">
        <div className="w-full flex items-center overflow-hidden rounded-[1rem] md:rounded-[1.5rem]">
          <div className="flex-shrink-0 px-4 sm:px-10 py-4 sm:py-8 z-10 relative border-r border-black/5">
            <span className="font-bold text-sm md:text-2xl text-text uppercase tracking-widest whitespace-nowrap">
              Tech Stack
            </span>
          </div>
          <div
            className="flex-1 flex overflow-hidden py-4 sm:py-8 max-w-full relative"
            ref={containerRef}
            style={{
              maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            }}
          >
            <div className="flex flex-shrink-0 items-center min-w-full" ref={part1Ref}>
              {row("a")}
            </div>
            <div className="flex flex-shrink-0 items-center min-w-full" ref={part2Ref} aria-hidden="true">
              {row("b")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
```

- [ ] **Step 2: Create `Problem.tsx`**

The pinned reveal reuses Mission's mechanic (one pinned, scrubbed timeline, short hold at the end).

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Users, ClipboardX } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useSectionReveal } from "@/lib/useSectionReveal";

gsap.registerPlugin(ScrollTrigger);
// Mobile browsers resize the viewport as the address bar shows/hides; don't re-measure the pin on that.
ScrollTrigger.config({ ignoreMobileResize: true });

const HEADLINE = "Care breaks down, unseen.";

const STATS = [
  { value: "81%", label: "of care home falls are unwitnessed" },
  { value: "83%", label: "happen in the resident's own room, where no one is watching" },
  { value: "31%", label: "of residents who fell waited over an hour on the floor" },
];

const PAINS = [
  {
    Icon: Clock,
    title: "Help comes late",
    body: "Today's workaround is two-hourly rounds, call bells residents can't press, and CCTV no one watches 24/7.",
  },
  {
    Icon: Users,
    title: "Understaffed",
    body: "Two or three carers per home, many untrained, covering every room at night.",
  },
  {
    Icon: ClipboardX,
    title: "No records kept",
    body: "Handover runs on memory. Families get promises, not proof.",
  },
];

const Problem = () => {
  const pinRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const painsSectionRef = useRef<HTMLElement>(null);
  const painsContentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!pinRef.current || !textRef.current) return;
      const words = textRef.current.querySelectorAll(".word");
      const stats = textRef.current.querySelectorAll(".stat");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(words, { opacity: 0.1 }, { opacity: 1, stagger: 0.15, ease: "none" });
      tl.fromTo(stats, { opacity: 0.1, y: 20 }, { opacity: 1, y: 0, stagger: 0.3, ease: "none" });
      tl.to({}, { duration: 1 });
    },
    { scope: pinRef },
  );

  useSectionReveal(painsSectionRef, painsContentRef);

  return (
    <>
      <section
        id="problem"
        ref={pinRef}
        className="pt-24 md:pt-32 pb-8 bg-bg-body overflow-hidden relative z-10 min-h-[100svh] flex flex-col justify-center"
      >
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
        <div ref={textRef} className="relative z-10 container mx-auto px-4 max-w-5xl text-center">
          <span className="bg-bg-card px-8 py-2 rounded-[2rem] shadow-m text-sm font-bold uppercase tracking-widest text-foreground/60 inline-block mb-6">
            The problem
          </span>
          <h2 className="text-[40px] leading-[1.05] sm:text-6xl md:text-7xl font-medium text-text mb-8 md:mb-12">
            {HEADLINE.split(" ").map((word, i) => (
              <span key={i} className="word inline-block mr-[0.2em] opacity-10">
                {word}
              </span>
            ))}
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {STATS.map((s) => (
              <div key={s.value} className="stat opacity-10 bg-bg-card rounded-2xl sm:rounded-3xl shadow-m p-3 sm:p-6">
                <div className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#3d7e93]">{s.value}</div>
                <p className="mt-2 text-[11px] leading-snug sm:text-base text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] sm:text-xs text-text-muted">
            Single-site studies: JAMDA 2025 (212 falls), JMIR 2021 (6 memory care facilities).
          </p>
        </div>
      </section>

      <section ref={painsSectionRef} className="relative z-10 bg-bg-body py-16 md:py-24">
        <div ref={painsContentRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            chip="Why it matters"
            title="Carers are stretched thin"
            subtitle="18% of Sri Lankans are already 60 or older, and there are about 40,000 nurses against the 88,000 needed."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAINS.map(({ Icon, title, body }) => (
              <div key={title} className="bg-bg-card rounded-3xl shadow-m p-8">
                <Icon className="text-[#3d7e93] mb-4" size={28} />
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="text-text-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <figure className="mt-12 max-w-3xl mx-auto text-center">
            <blockquote className="text-2xl md:text-3xl font-medium text-text leading-snug">
              &ldquo;This is not an eight-hour duty. We must work 24 hours.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-text-muted">Carer, aged care home in Galle</figcaption>
          </figure>
        </div>
      </section>
    </>
  );
};

export default Problem;
```

- [ ] **Step 3: Delete Mission**

Run: `git rm src/components/Mission.tsx`

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`. Expected: only an error that `@/components/Mission` is imported by `src/app/page.tsx` (fixed in Task 15). If that is the only error, proceed.

- [ ] **Step 5: Commit**

```bash
git add src/components/Problem.tsx src/components/TechStack.tsx
git commit -m "feat: add Problem section and TechStack, retire Mission

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 7: How it works

**Files:**
- Create: `src/components/HowItWorks.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useRef } from "react";
import { Activity, BellRing, TrendingUp, ClipboardList } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useSectionReveal } from "@/lib/useSectionReveal";

const STEPS = [
  {
    verb: "Monitor",
    Icon: Activity,
    body: "One band per resident. Motion, moisture and skin temperature, streamed to the ward gateway over the home's network.",
  },
  {
    verb: "Alert",
    Icon: BellRing,
    body: "Critical alerts reach the right carer's phone in seconds, straight to the right room instead of blind rounds.",
  },
  {
    verb: "Analyse",
    Icon: TrendingUp,
    body: "Our own models learn each resident's gait, night stand-ups and moisture patterns over weeks.",
  },
  {
    verb: "Record",
    Icon: ClipboardList,
    body: "Every resident, alert and response time in one place, with no extra paperwork.",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useSectionReveal(sectionRef, contentRef);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="scroll-mt-24 md:scroll-mt-28 relative z-10 py-16 md:py-24"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          chip="How it works"
          title="Monitor. Alert. Analyse. Record."
          subtitle="SoterCare connects elders, carers and families, so a care home gives safer care without hiring more staff."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(({ verb, Icon, body }, i) => (
            <div key={verb} className="bg-bg-card rounded-3xl shadow-m p-8 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-bold text-text-muted tracking-widest">0{i + 1}</span>
                <Icon className="text-[#3d7e93]" size={28} />
              </div>
              <h3 className="text-3xl font-bold mb-3">{verb}</h3>
              <p className="text-text-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-lg font-semibold text-text">
          No cameras. Works without internet.
        </p>
      </div>
    </section>
  );
};

export default HowItWorks;
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` (only the pending Mission import error from Task 6 may remain) and `npm run check:copy` (the `#how-it-works` anchor requirement now passes).

- [ ] **Step 3: Commit**

```bash
git add src/components/HowItWorks.tsx
git commit -m "feat: add How it works section

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Product (hardware only)

**Files:**
- Modify: `src/components/Product.tsx` (full rewrite; the Mobile App block moves to `AppsDuo` in Task 9)

- [ ] **Step 1: Replace the file contents**

The 3D-model wheel forwarding and the iframe styling are kept exactly as today. The 3D gateway model is the old hub art; it stays until new art exists (see Task 16).

```tsx
"use client";

import React, { useEffect, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import { useSectionReveal } from "@/lib/useSectionReveal";

const iframeClass =
  "w-full max-w-[640px] h-[400px] md:h-[560px] md:-my-10 border-0 bg-transparent [mask-image:linear-gradient(to_bottom,#000_88%,transparent)]";

const Product = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useSectionReveal(sectionRef, contentRef);

  // Forward wheel events from the 3D model iframes so Lenis keeps smooth-scrolling
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!e.data?.sotercareWheel) return;
      window.dispatchEvent(
        new WheelEvent("wheel", {
          deltaX: e.data.deltaX,
          deltaY: e.data.deltaY,
          deltaMode: e.data.deltaMode,
          bubbles: true,
          cancelable: true,
        }),
      );
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <section
      id="product"
      ref={sectionRef}
      className="scroll-mt-24 md:scroll-mt-28 bg-transparent relative z-20 w-full overflow-hidden"
    >
      <div ref={contentRef} className="relative z-10 flex flex-col w-full">
        <div className="w-full flex flex-col items-center justify-center px-4 md:px-8 pt-16 md:pt-20 pb-0">
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 md:gap-2 justify-center">
            <SectionHeader
              chip="Product"
              title="The Hardware"
              subtitle="One band per resident. One ward gateway per home."
            />

            <div className="flex flex-col gap-0 md:-mt-2">
              {/* Thigh node */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-8">
                <div className="order-2 md:order-none md:w-1/2 flex flex-col items-center md:items-end text-center md:text-right">
                  <h3 className="text-4xl md:text-5xl font-bold mb-4 md:mb-5">The Thigh Node</h3>
                  <p className="text-text-muted text-xl md:text-2xl leading-snug max-w-xl">
                    A soft thigh band worn under clothing, one per resident. Motion, moisture and
                    skin temperature sensors stream readings to the gateway over the home&apos;s
                    network. It charges over USB-C, and we are targeting a 7-day battery.
                  </p>
                </div>
                <div className="order-1 md:order-none w-full md:w-1/2 flex justify-center md:justify-start">
                  <iframe
                    src="/models/thigh-node.html"
                    title="Interactive 3D model of the SoterCare Thigh Node wearable"
                    loading="lazy"
                    className={iframeClass}
                  />
                </div>
              </div>

              {/* Ward gateway */}
              <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-2 md:gap-8 md:-mt-16">
                <div className="order-2 md:order-none md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                  <h3 className="text-4xl md:text-5xl font-bold mb-4 md:mb-5">The Ward Gateway</h3>
                  <p className="text-text-muted text-xl md:text-2xl leading-snug max-w-xl">
                    A 15.6-inch touch screen for the whole home. It runs the gait model and the
                    alerts for every bed, works offline, and charges the nodes over USB-C. Its
                    overview screen shows every resident&apos;s status at once, so a carer sees who
                    is moving, resting, wet or needs help at a glance.
                  </p>
                </div>
                <div className="order-1 md:order-none w-full md:w-1/2 flex justify-center md:justify-end">
                  <iframe
                    src="/models/edge-gateway.html"
                    title="Interactive 3D model of the SoterCare Ward Gateway"
                    loading="lazy"
                    className={iframeClass}
                  />
                </div>
              </div>
            </div>

            {/* Backend and apps */}
            <div className="mt-6 md:mt-10 bg-bg-card rounded-3xl shadow-m p-8 md:p-10 max-w-4xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Backend and apps</h3>
              <p className="text-text-muted text-lg leading-relaxed">
                The backend stores every reading and finds trends in gait, night stand-ups and
                moisture over weeks. Carers get alerts on their phones, families get the full
                picture in their own app, and AI writes the shift handover.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` and `npm run check:copy`.
Expected: no `Product.tsx` lines.

- [ ] **Step 3: Commit**

```bash
git add src/components/Product.tsx
git commit -m "feat: hardware-only Product section with ward gateway copy

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Apps: caregiver login vs guardian login

**Files:**
- Create: `src/components/AppsDuo.tsx`

**Interfaces:**
- Produces: default export `AppsDuo` (no props). Each role may later receive a real mockup by setting `image` in the `ROLES` array (Task 16); `null` renders a labelled placeholder frame. The old mockup shows vitals and must not be reused.

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { BellRing, Users, Check } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useSectionReveal } from "@/lib/useSectionReveal";

interface Role {
  key: string;
  title: string;
  who: string;
  Icon: typeof BellRing;
  image: string | null;
  points: string[];
}

const ROLES: Role[] = [
  {
    key: "caregiver",
    title: "Caregiver login",
    who: "For carers and nurses on shift",
    Icon: BellRing,
    image: null,
    points: [
      "Critical alerts with the resident and room: stand-up attempts, falls, wet pads, device offline",
      "Confirm or dismiss an alert. Dismissed false alarms go to the Recycle Bin and retrain the model",
      "Response times and a full system timeline",
      "Ask ARIA about a resident, in plain language",
      "Password-less sign-in with a one-time code or Google",
    ],
  },
  {
    key: "guardian",
    title: "Guardian login",
    who: "For the family of a resident",
    Icon: Users,
    image: null,
    points: [
      "Real-time status of their family member",
      "Daily summaries written in plain language",
      "Trends and patterns over weeks",
      "Every record, exportable as PDF or CSV",
      "Notified only when something concerning happens or an update is necessary, never for every alert",
    ],
  },
];

const AppsDuo = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useSectionReveal(sectionRef, contentRef);

  return (
    <section id="apps" ref={sectionRef} className="scroll-mt-24 md:scroll-mt-28 relative z-10 py-16 md:py-24">
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          chip="The apps"
          title="One app, two logins"
          subtitle="Carers act on critical alerts. Families see what is happening, the trends and the records."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {ROLES.map(({ key, title, who, Icon, image, points }) => (
            <article key={key} className="bg-bg-card rounded-[2rem] shadow-m p-6 md:p-10 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-12 rounded-2xl bg-[#a0cbdb]/20 flex items-center justify-center">
                  <Icon className="text-[#3d7e93]" size={24} />
                </span>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
                  <p className="text-text-muted">{who}</p>
                </div>
              </div>

              {image ? (
                <Image
                  src={image}
                  alt={`${title} screens`}
                  width={900}
                  height={700}
                  className="w-full h-auto rounded-2xl mb-6"
                />
              ) : (
                <div className="mb-6 rounded-2xl border-2 border-dashed border-black/10 bg-black/[0.02] h-48 flex items-center justify-center text-sm font-semibold text-text-muted">
                  App screens coming soon
                </div>
              )}

              <ul className="space-y-3">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-text-muted leading-relaxed">
                    <Check size={18} className="mt-1 flex-shrink-0 text-[#3d7e93]" strokeWidth={3} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppsDuo;
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` and `npm run check:copy`.
Expected: `#apps` requirement passes; no new violations.

- [ ] **Step 3: Commit**

```bash
git add src/components/AppsDuo.tsx
git commit -m "feat: add caregiver and guardian apps section

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Features by party

**Files:**
- Modify: `src/components/Features.tsx` (full rewrite)

- [ ] **Step 1: Replace the file contents**

```tsx
'use client';

import React, { useRef } from 'react';
import { PersonStanding, BellRing, Building2, Users } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { useSectionReveal } from '@/lib/useSectionReveal';

interface FeatureGroup {
  key: string;
  title: string;
  tagline: string;
  Icon: typeof BellRing;
  items: { name: string; desc: string }[];
}

const GROUPS: FeatureGroup[] = [
  {
    key: 'elders',
    title: 'Elders',
    tagline: 'Safer nights, with dignity kept.',
    Icon: PersonStanding,
    items: [
      { name: 'Camera-free', desc: 'No cameras in bedrooms or bathrooms. Motion, moisture and skin temperature only.' },
      { name: 'Stand-up warning', desc: 'Our gait model spots a stand-up attempt before a fall: 97.65% accuracy on lab data, across five movement states.' },
      { name: 'Discreet hygiene alerts', desc: 'Moisture is detected on the band and reported privately and silently to the carer.' },
      { name: 'Haptic nudge', desc: 'The band can give a private vibration warning. Working in our prototype.' },
    ],
  },
  {
    key: 'carers',
    title: 'Carers',
    tagline: 'The right alert, to the right room.',
    Icon: BellRing,
    items: [
      { name: 'Critical alerts', desc: 'Delivered to the right carer\'s phone in seconds, with the resident and room.' },
      { name: 'Instant hard-fall detection', desc: 'A fast threshold-based check catches sudden impacts and hard falls immediately.' },
      { name: 'Confirm or dismiss', desc: 'Mark a false alarm and it moves to the Recycle Bin and retrains the model.' },
      { name: 'Ask ARIA', desc: 'ARIA answers questions about a resident from their own records, in plain language.' },
    ],
  },
  {
    key: 'homes',
    title: 'Care homes',
    tagline: 'See everyone at once. Keep the record.',
    Icon: Building2,
    items: [
      { name: 'All residents at a glance', desc: 'The 15.6-inch ward gateway shows every resident\'s status on one screen.' },
      { name: 'Works offline', desc: 'Detection and alerts run on the gateway over the home\'s local network, with no internet needed.' },
      { name: 'Records without paperwork', desc: 'Every resident, alert and response time is logged, and AI writes the shift handover.' },
      { name: 'Three AI agents', desc: 'Safety Guard watches readings and raises alerts with no LLM. ARIA answers questions. A clinical report agent writes six-hourly summaries.' },
    ],
  },
  {
    key: 'families',
    title: 'Families',
    tagline: 'Informed, without being flooded.',
    Icon: Users,
    items: [
      { name: 'Real-time status', desc: 'See how their family member is doing right now.' },
      { name: 'Daily summaries', desc: 'Plain-language updates on the day, written by AI from the sensor data.' },
      { name: 'Trends and patterns', desc: 'Movement, night-time activity and moisture patterns over weeks.' },
      { name: 'Full records', desc: 'Every record, exportable as PDF or CSV.' },
      { name: 'Only when it matters', desc: 'Notified when something concerning happens or an update is necessary, not for every alert.' },
    ],
  },
];

const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useSectionReveal(sectionRef, contentRef);

  return (
    <section id="features" ref={sectionRef} className="scroll-mt-24 md:scroll-mt-28 bg-transparent relative z-10 w-full overflow-hidden">
      <div ref={contentRef} className="w-full relative z-10 px-4 sm:px-8 pt-16 md:pt-24 pb-8">
        <div className="w-full max-w-7xl mx-auto">
          <SectionHeader
            chip="Features"
            title="Built for every party in care"
            subtitle="Elders wear it. Carers act on it. Families stay informed. Homes keep the record."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {GROUPS.map(({ key, title, tagline, Icon, items }) => (
              <article key={key} className="bg-bg-card p-8 rounded-3xl shadow-sm border border-black/5 relative overflow-hidden">
                <Icon className="absolute -bottom-4 -right-4 text-[#3d7e93] opacity-5 w-32 h-32 rotate-12" />
                <h3 className="text-3xl font-bold">{title}</h3>
                <p className="text-[#3d7e93] font-semibold mb-5">{tagline}</p>
                <ul className="space-y-4 relative">
                  {items.map((item) => (
                    <li key={item.name}>
                      <p className="font-bold text-text">{item.name}</p>
                      <p className="text-text-muted leading-relaxed">{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` and `npm run check:copy`.
Expected: no `Features.tsx` lines. If `tsc` reports an unknown lucide icon, replace it with `User` (elders), keeping the same props.

- [ ] **Step 3: Commit**

```bash
git add src/components/Features.tsx
git commit -m "feat: features organised by elders, carers, homes and families

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Proof and roadmap

**Files:**
- Create: `src/components/Proof.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useSectionReveal } from "@/lib/useSectionReveal";

const TRL = [
  { level: "TRL 5", state: "Done", body: "Components validated in a relevant environment.", current: false },
  { level: "TRL 6", state: "We are here", body: "Working prototype demonstrated in a relevant environment.", current: true },
  { level: "TRL 7", state: "Next, with NIA", body: "Pilot in real care homes through the NIA voucher programme.", current: false },
  { level: "TRL 8 to 9", state: "Then", body: "Production release and first paying homes.", current: false },
];

const ROADMAP = [
  { when: "Months 1 to 8", what: "Full build: production node and gateway, LAN alerting, moisture sensing, ML trend backend, carer and family apps." },
  { when: "Months 9 to 10", what: "Testing in 3 homes across 60 beds, then release." },
  { when: "After that", what: "First paying homes. Pilot homes convert at a pre-agreed price." },
];

const TARGETS = ["80% wear time", "Under 1 false alarm per bed a week", "Response under 3 minutes"];

const Proof = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useSectionReveal(sectionRef, contentRef);

  return (
    <section id="proof" ref={sectionRef} className="scroll-mt-24 md:scroll-mt-28 relative z-10 py-16 md:py-24">
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          chip="Where we are"
          title="A working prototype, heading to real care homes"
          subtitle="We are a startup. Here is exactly how far along we are, and what comes next."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRL.map((t) => (
            <div
              key={t.level}
              className={`rounded-3xl p-6 ${t.current ? "bg-text text-bg-card shadow-lg" : "bg-bg-card shadow-m"}`}
            >
              <p className="text-sm font-bold uppercase tracking-widest opacity-70">{t.state}</p>
              <h3 className="text-3xl font-bold my-2">{t.level}</h3>
              <p className={t.current ? "opacity-80" : "text-text-muted"}>{t.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-bg-card rounded-3xl shadow-m p-8">
            <h3 className="text-2xl font-bold mb-5">The plan</h3>
            <ol className="space-y-4">
              {ROADMAP.map((r) => (
                <li key={r.when}>
                  <p className="font-bold text-[#3d7e93]">{r.when}</p>
                  <p className="text-text-muted leading-relaxed">{r.what}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-bg-card rounded-3xl shadow-m p-8">
            <h3 className="text-2xl font-bold mb-2">What we will measure in the pilot</h3>
            <p className="text-text-muted mb-5">These are targets, not results yet.</p>
            <ul className="flex flex-wrap gap-3">
              {TARGETS.map((t) => (
                <li key={t} className="bg-black/5 rounded-full px-4 py-2 font-semibold text-text">
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/news" className="mt-8 inline-flex items-center gap-2 font-bold text-[#3d7e93] hover:underline">
              Follow our progress in the news <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Proof;
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` and `npm run check:copy`. Expected: `#proof` requirement passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/Proof.tsx
git commit -m "feat: add proof and roadmap section

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Pricing ("talk to us") and Home-kit promise

**Files:**
- Modify: `src/components/Pricing.tsx` (full rewrite)
- Create: `src/components/HomeKit.tsx`
- Modify: `src/components/WaitlistPopup.tsx` (copy)

- [ ] **Step 1: Replace `Pricing.tsx`**

```tsx
'use client';

import React, { useRef } from 'react';
import { CalendarCheck, Check } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { useSectionReveal } from '@/lib/useSectionReveal';

const INCLUDED = [
  'One band for each resident',
  'One 15.6-inch ward gateway for the home',
  'Caregiver and guardian apps',
  'Support from the people who built it',
];

const Pricing = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useSectionReveal(sectionRef, contentRef);

  return (
    <section id="pricing" ref={sectionRef} className="scroll-mt-24 md:scroll-mt-28 relative z-10 py-16 md:py-24 overflow-hidden">
      <div ref={contentRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader chip="Pricing" title="Priced for care homes. Let's talk." />

        <div className="bg-bg-card rounded-[2.5rem] shadow-xl border border-black/5 overflow-hidden flex flex-col md:flex-row">
          <div className="p-8 md:p-12 md:w-3/5">
            <p className="text-text-muted text-lg leading-relaxed mb-6">
              SoterCare is a startup, and we are building this with our first care homes. Pricing
              is per home: a band for each resident, one ward gateway, and a small monthly fee per
              bed. Tell us about your home and we will send you a quote.
            </p>
            <ul className="space-y-3">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-3 font-medium text-text">
                  <Check size={18} className="mt-1 flex-shrink-0 text-[#3d7e93]" strokeWidth={3} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-black/5 p-8 md:p-12 md:w-2/5 flex flex-col justify-center items-center gap-5 text-center">
            <button
              onClick={() => window.dispatchEvent(new Event('open-contact-popup'))}
              className="w-full py-4 bg-text text-bg-card rounded-full font-bold hover:scale-105 active:scale-95 transition-transform shadow-lg flex items-center justify-center gap-2"
            >
              <CalendarCheck size={20} />
              Book a demo
            </button>
            <p className="text-sm text-text-muted">
              Early partners shape the product. We reply personally.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
```

- [ ] **Step 2: Create `HomeKit.tsx`**

```tsx
"use client";

import { useRef, useState } from "react";
import { Home } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import WaitlistPopup from "@/components/WaitlistPopup";
import { useSectionReveal } from "@/lib/useSectionReveal";

const HomeKit = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useSectionReveal(sectionRef, contentRef);

  return (
    <section id="home-kit" ref={sectionRef} className="scroll-mt-24 md:scroll-mt-28 relative z-10 py-16 md:py-24">
      <div ref={contentRef} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeader chip="Coming home" title="Then, every home." />
        <p className="text-lg md:text-xl text-text-muted leading-relaxed">
          We are starting where the need is greatest: care homes. Once SoterCare is proven there,
          we will bring it to families as a home kit. That is our promise to the community.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="mt-8 bg-bg-card text-text px-7 py-3.5 rounded-full font-bold shadow-m hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center gap-2"
        >
          <Home size={18} className="text-[#3d7e93]" />
          Join the home-kit waitlist
        </button>
      </div>
      <WaitlistPopup isOpen={open} onClose={() => setOpen(false)} />
    </section>
  );
};

export default HomeKit;
```

- [ ] **Step 2b: Waitlist popup copy**

In `src/components/WaitlistPopup.tsx` change:
- success body `We'll let you know as soon as spots open up.` to `We'll let you know when the home kit is ready.`
- heading `Join the Waitlist` to `Join the Home-Kit Waitlist`
- paragraph `Be the first to know when SoterCare launches. Early access spots are limited!` to `We are starting with care homes. Leave your email and we will tell you when the home kit is ready.`
- the success button label `Awesome` stays.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` and `npm run check:copy`.
Expected: no `Pricing.tsx`/`HomeKit.tsx` violations; the `startup`, `promise`, `#pricing` and `#home-kit` requirements pass. Confirm `grep -n "\\$" src/components/Pricing.tsx src/components/HomeKit.tsx` finds no currency amounts.

- [ ] **Step 4: Commit**

```bash
git add src/components/Pricing.tsx src/components/HomeKit.tsx src/components/WaitlistPopup.tsx
git commit -m "feat: talk-to-us pricing and home-kit promise section

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Team and advisors

**Prerequisite:** written OK from Banu Athuraliya and Dr. P.A.D.M. Senarachchi to be listed on the site. If not yet received, skip Step 3 only; everything else in this task still applies.

**Files:**
- Modify: `src/components/Team.tsx`

- [ ] **Step 1: Roles**

In `TEAM_MEMBERS` set:
- Daham: `role: "Founder · IoT & ML"`
- Sanjula: `role: "Co-founder · Backend & AI"`
- Komudi: `role: "Co-founder · Design & Docs"` (name stays `Komudi Senarachchi`)

- [ ] **Step 2: Startup statement**

Replace the header paragraph (`A tight team of developers, designers, and engineers building the future of elderly care.`) with:

```tsx
            We are a startup. Three founders who built every layer, from firmware to ML to the apps.
            SoterCare started with caring for our own grandparents.
```

- [ ] **Step 3: Advisors row**

Above `const Team = () => {` add:

```tsx
const ADVISORS = [
  {
    name: "Banu Athuraliya",
    role: "External advisor",
    detail:
      "Visiting Lecturer and SDGP Module Leader, Digital Consultant, Informatics Institute of Technology (IIT)",
  },
  {
    name: "Dr. P.A.D.M. Senarachchi",
    role: "Medical expert",
    detail:
      "Accident and Emergency Unit, National Hospital, Kandy. Trauma and Stroke Rehabilitation Hospital, Digana",
  },
];
```

After the closing `</div>` of the 3-column cards grid (`grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto items-start`), inside the same container, add:

```tsx
        <div className="mt-10 max-w-4xl mx-auto">
          <h3 className="text-center text-sm font-bold uppercase tracking-widest text-text-muted mb-5">Advisors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ADVISORS.map((a) => (
              <div key={a.name} className="bg-bg-card rounded-3xl shadow-m p-6">
                <p className="text-sm font-medium text-[#3d7e93] mb-0.5">{a.role}</p>
                <h4 className="text-lg font-bold text-text tracking-tight">{a.name}</h4>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` and `npm run check:copy`. Expected: the Team `startup` requirement passes.

- [ ] **Step 5: Commit**

```bash
git add src/components/Team.tsx
git commit -m "feat: team roles, startup statement and advisors

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Demo form, emails and popup copy

**Files:**
- Modify: `src/app/actions.ts` (`contactAction`)
- Modify: `src/components/ContactPopup.tsx`
- Modify: `src/emails/ContactNotification.tsx`, `ContactAutoReply.tsx`, `WelcomeWaitlist.tsx`, `WelcomeNewsletter.tsx`
- Modify: `src/components/NewsletterPopup.tsx` (copy)

**Interfaces:**
- Consumes: `parseDemoRequest`, `buildSubject` from `@/lib/demoRequest` (Task 1b).
- Produces: `ContactNotification({ senderName, senderEmail, message, home?, beds?, role? })`.

- [ ] **Step 1: `contactAction`**

In `src/app/actions.ts` add `import { parseDemoRequest, buildSubject } from "@/lib/demoRequest";` and replace the body of `contactAction` with:

```ts
export async function contactAction(formData: FormData) {
  try {
    const req = parseDemoRequest(formData);
    const resend = getResendClient();

    // 1. Send notification email to the SoterCare team (same inbox as before)
    const { default: ContactNotification } = await import("@/emails/ContactNotification");
    const { error: notifError } = await resend.emails.send({
      from: "SoterCare <info@sotercare.com>",
      to: "daham.20242053@iit.ac.lk",
      subject: buildSubject(req),
      react: ContactNotification({
        senderName: req.name,
        senderEmail: req.email,
        message: req.message,
        home: req.home,
        beds: req.beds,
        role: req.role,
      }),
    });

    if (notifError) {
      console.error("Contact Notification Email Failed:", notifError);
    }

    // 2. Send auto-reply to the user
    const { default: ContactAutoReply } = await import("@/emails/ContactAutoReply");
    const { error: replyError } = await resend.emails.send({
      from: "SoterCare <info@sotercare.com>",
      to: req.email,
      subject: "We got your message — SoterCare",
      react: ContactAutoReply({ senderName: req.name }),
    });

    if (replyError) {
      console.error("Contact Auto-Reply Email Failed:", replyError);
    }

    return { success: true };
  } catch (error) {
    console.error("contactAction Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send message",
    };
  }
}
```

- [ ] **Step 2: `ContactNotification.tsx`**

Extend the props and defaults:

```tsx
interface ContactNotificationProps {
    senderName: string;
    senderEmail: string;
    message: string;
    home?: string;
    beds?: string;
    role?: string;
}
```
Add `home = "", beds = "", role = "",` to the destructured params. Change the sub-heading text `NEW CONTACT MESSAGE` to `NEW DEMO / CONTACT REQUEST`, and the alert text to `📬 New enquiry from the website`. After the EMAIL link (inside `detailsSection`), add:

```tsx
                        {home && (
                            <>
                                <Text style={label}>CARE HOME</Text>
                                <Text style={value}>{home}</Text>
                            </>
                        )}
                        {beds && (
                            <>
                                <Text style={label}>BEDS</Text>
                                <Text style={value}>{beds}</Text>
                            </>
                        )}
                        {role && (
                            <>
                                <Text style={label}>ROLE</Text>
                                <Text style={value}>{role}</Text>
                            </>
                        )}
```
Change the footer line `© {year} SoterCare. Wellness Simplified.` to `© {new Date().getFullYear()} SoterCare.`

- [ ] **Step 3: `ContactAutoReply.tsx`**

- Sub-heading `WELLNESS SIMPLIFIED` becomes `SMARTER CARE FOR EVERY ELDER`.
- Second paragraph becomes: `We are a small startup team, and one of us will read your message and reply personally. We typically respond within 24 hours.`
- Info box text becomes: `In the meantime, feel free to explore our website to learn more about how SoterCare helps care homes give safer care with camera-free monitoring, instant carer alerts and complete records.`
- Footer `© {year} SoterCare. Wellness Simplified.` becomes `© {new Date().getFullYear()} SoterCare.`

- [ ] **Step 4: Welcome emails**

In `WelcomeWaitlist.tsx` and `WelcomeNewsletter.tsx` replace `© 2026 SoterCare. Wellness Simplified.` with `© {new Date().getFullYear()} SoterCare.`. In `WelcomeWaitlist.tsx` replace the paragraph `We're working hard to get everything ready. You'll be the first to know as soon as spots open up.` with `We are starting with care homes, and the home kit comes next. You'll be among the first to know when it is ready.` In `WelcomeNewsletter.tsx` replace `Explore our latest insights into IoT developments and Machine Learning milestones for elderly care.` with `Follow our progress as we build SoterCare with our first care homes: new milestones, pilots and product updates.`

- [ ] **Step 5: `ContactPopup.tsx`**

- Header `Send a Message` becomes `Book a demo`; its paragraph becomes `Tell us about your care home and we will get back to you personally. We are a startup, and we would love to build this with you.`
- Success heading `Message Sent!` becomes `Request sent!`; success body becomes `Thank you. A member of our small team will reply personally.`
- Insert these inputs between the `email` input and the `textarea` (same `className` string as the existing inputs):
```tsx
                            <input
                                name="home"
                                type="text"
                                placeholder="Care home name (optional)"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a0cbdb]/30 focus:border-[#a0cbdb] transition-all placeholder:text-gray-400 text-gray-800"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    name="beds"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Number of beds (optional)"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a0cbdb]/30 focus:border-[#a0cbdb] transition-all placeholder:text-gray-400 text-gray-800"
                                />
                                <input
                                    name="role"
                                    type="text"
                                    placeholder="Your role (optional)"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a0cbdb]/30 focus:border-[#a0cbdb] transition-all placeholder:text-gray-400 text-gray-800"
                                />
                            </div>
```
- Textarea placeholder `Your message...` becomes `How can we help your home?`
- Submit button label `Send Message` becomes `Request a demo`.

- [ ] **Step 6: `NewsletterPopup.tsx` copy**

Change the paragraph `Join us to stay updated on our progress and be part of our journey with SoterCare.` to `Follow our progress as we build SoterCare with our first care homes.`

- [ ] **Step 7: Verify**

Run: `npm test` (parser tests still green), `npx tsc --noEmit`, `npm run check:copy`.
Expected: no violations left in `src/emails/**`, `ContactPopup.tsx`, `actions.ts`.

Manual: with `RESEND_API_KEY` set in `.env.local`, run `npm run dev`, click Book a demo, submit once with only name, email and message, then once with all fields. Expected: both succeed; the team inbox subject is `New message from …` for the first and `New care-home enquiry from … (…) — SoterCare` for the second, and the notification shows CARE HOME, BEDS and ROLE rows only for the second. Without a key, the popup shows `Configuration Error: Missing RESEND_API_KEY` (unchanged behaviour).

- [ ] **Step 8: Commit**

```bash
git add src/app/actions.ts src/components/ContactPopup.tsx src/components/NewsletterPopup.tsx src/emails
git commit -m "feat: care-home demo request form and email copy

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 15: Compose the page and verify everything

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update imports and order**

In `src/app/page.tsx` replace the component imports block (from `import Navbar` to `import Footer`) with:

```tsx
import Navbar from '@/components/Navbar';
import SplashScreen from '@/components/SplashScreen';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
import HowItWorks from '@/components/HowItWorks';
import Product from '@/components/Product';
import TechStack from '@/components/TechStack';
import AppsDuo from '@/components/AppsDuo';
import Features from '@/components/Features';
import Proof from '@/components/Proof';
import Pricing from '@/components/Pricing';
import HomeKit from '@/components/HomeKit';
import LatestNews from '@/components/LatestNews';
import CommunityIntro from '@/components/CommunityIntro';
import FAQ from '@/components/FAQ';
import Team from '@/components/Team';
import Footer from '@/components/Footer';
```

and the JSX after `<Navbar />` with:

```tsx
      <Hero />
      <Problem />
      <HowItWorks />
      <Product />
      <TechStack />
      <AppsDuo />
      <Features />
      <Proof />
      <Pricing />
      <HomeKit />
      <LatestNews />
      <CommunityIntro />
      <FAQ />
      <Team />
      <Footer />
```

- [ ] **Step 2: Full automated verification**

Run each and expect success:
- `npm test` → all pass.
- `npm run check:copy` → `Copy check passed.` (if a file outside the tasks above still trips a rule, e.g. `src/app/community/page.tsx` or `src/app/news/**`, fix the offending phrase to match the spec's wording; if it is a genuine false positive in unrelated copy, add that exact path to the rule's `allow` list with a one-line comment saying why.)
- `npx tsc --noEmit` → no errors.
- `npm run lint` → no new errors.
- `npm run build` → completes; `/` prerenders.

- [ ] **Step 3: Out-of-scope paths untouched**

Run: `git diff --stat "$(cat .scratch-base-sha.txt)" -- src/app/dashboard src/app/editnews src/app/api src/components/dashboard data/news.json`
Expected: empty output.

- [ ] **Step 4: Anchors and structured data**

Run the dev server and in the browser console on `/`:
```js
["problem","how-it-works","product","apps","features","proof","pricing","home-kit","faqs","team","contact"].filter(id => !document.getElementById(id))
```
Expected: `[]`. Click each navbar link (desktop and mobile menu) and confirm it scrolls to its section. Open `view-source:` or the Rich Results test and confirm the `FAQPage` has 7 questions identical to the visible FAQ and that no `Offer`/price appears.

- [ ] **Step 5: Responsive pass (Review Focus 5)**

At 375 × 667, 768 × 1024 and 1440 × 900 scroll the whole page and check: the pinned Problem section shows headline and all three stat cards without clipping, the pin releases cleanly into "Why it matters", hero and footer fit, every section reveals, no horizontal scroll, both popups open from Hero, Pricing, Footer and the Home-kit button.

- [ ] **Step 6: Spec housekeeping**

In the spec, section 8 (Assets) replace the caregiver/guardian rows' note and add: "Until mockups exist, `AppsDuo` shows a labelled 'App screens coming soon' frame. The old mockup shows vitals and is not used." In section 9's grep list note that `Raspberry Pi` is allowed only in `TechStack.tsx` (prototype logo).

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx docs/superpowers/specs/2026-10-04-b2b-site-repositioning-design.md
git commit -m "feat: compose B2B home page and finish spec notes

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 16: Asset swaps (blocked on design; do as assets arrive)

These do not block release of Tasks 1 to 15. Each is a small, independent change.

**Files:**
- Modify: `public/models/edge-gateway.html` and `public/assets/features/*gateway*` (15.6-inch gateway art)
- Modify: `src/components/AppsDuo.tsx` (`image` for each role)
- Modify: `src/components/Product.tsx` (add overview-screen mockup under the gateway copy)
- Delete after replacement: `public/assets/features/the-wrist-node.webp`, `public/assets/Mobile Mockup latest.png` (if no longer referenced)

- [ ] **Step 1:** When the caregiver and guardian mockups exist, add them as `public/assets/apps/caregiver.webp` and `public/assets/apps/guardian.webp` and set `image: "/assets/apps/caregiver.webp"` / `"/assets/apps/guardian.webp"` in `ROLES`. Neither image may show heart rate or SpO2.
- [ ] **Step 2:** When the new gateway art and the all-residents overview mockup exist, swap the 3D model and add the overview image to the gateway block in `Product.tsx`.
- [ ] **Step 3:** Confirm each removed asset is unreferenced: `grep -rn "the-wrist-node\|Mobile Mockup latest" src` returns nothing, then `git rm` it.
- [ ] **Step 4:** `npm run build`, then commit with `chore: swap in new gateway and app mockups`.

---

## Self-Review

**Spec coverage:**
- §3 IA and order → Tasks 6 to 12 and 15 (all 14 sections mapped; Latest News and Community intro unchanged).
- §4 Nav and CTAs → Task 4 (nav links, Carer login, Book a demo), Task 12 (home-kit CTA).
- §5.1 Hero → Task 4. §5.2 Problem → 6. §5.3 → 7. §5.4 → 8. §5.5 → 9. §5.6 → 10. §5.7 → 11. §5.8 → 12. §5.9 → 12. §5.10 → 2 and 5. §5.11 → 13. §5.12 → 12 (waitlist) and 14 (contact, newsletter, emails, footer in 4). §5.13 → no code change (verified in Task 15 diff scope).
- §6 SEO and JSON-LD → Task 3. Sitemap unchanged.
- §7 Claims rules → Global Constraints plus guard rules.
- §8 Assets → Task 9 placeholders and Task 16.
- §9 Implementation shape and testing → Tasks 1a, 1b, 15.
- §10 Decisions → reflected in Global Constraints (no prices, guardian alerts, no vitals, Senarachchi, hard-fall kept in Features).

**Placeholder scan:** none. Task 13's advisor row depends on consent, stated as a prerequisite, not a TBD.

**Type consistency:** `parseDemoRequest`/`buildSubject` names and the `home`/`beds`/`role` fields match across Tasks 1b and 14; `faqs` is `{ question, answer }` in Tasks 2, 3 and 5; `SectionHeader({ chip, title, subtitle })` and `useSectionReveal(sectionRef, contentRef)` are called with those names throughout; section ids match the `REQUIRED` list in Task 1a and the navbar hrefs in Task 4.

**Known risks to watch during execution:** pinned `Problem` height on small phones (Task 15 Step 5); lucide icon names in `Features`/`Problem` (a `tsc` error tells you immediately); `check:copy` may flag an unrelated page (`community`, `news`), and Task 15 Step 2 says how to resolve it.
