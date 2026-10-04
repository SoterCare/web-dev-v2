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
  { name: "LKR/Rs price", re: /\bLKR\b|\bRs\.?\s?\d/i },
  { name: "consumer 'peace of mind' copy", re: /peace of mind/i },
];

export const REQUIRED = [
  { file: "src/components/Hero.tsx", re: /Book a demo/, why: "primary CTA" },
  { file: "src/components/Pricing.tsx", re: /startup/i, why: "startup statement" },
  { file: "src/components/Team.tsx", re: /startup/i, why: "startup statement" },
  { file: "src/components/HomeKit.tsx", re: /promise/i, why: "household-kit promise" },
  { file: "src/app/page.tsx", re: /<HomeKit/, why: "home-kit section mounted" },
  { file: "src/components/Mission.tsx", re: /id="promise"/, why: "anchor #promise" },
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
  const files = SCAN.flatMap((p) => {
    if (!existsSync(p)) return [];
    return statSync(p).isDirectory() ? [...walk(p)] : [p];
  });
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
