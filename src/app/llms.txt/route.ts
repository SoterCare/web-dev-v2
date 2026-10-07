import { readNews } from "@/lib/news-store";
import { sortArticles } from "@/lib/news-sort";
import { SITE_URL } from "@/lib/seo";

// A plain-text summary of the site for AI assistants (https://llmstxt.org). Built from news.json
// at build time, so new articles are listed without editing this file.
export const dynamic = "force-static";

export function GET() {
  const articles = sortArticles(readNews().articles);

  const body = `# SoterCare

> SoterCare is an early-stage Sri Lankan startup building a camera-free smart care system for care homes: a thigh-worn sensor band for each resident, a 15.6-inch ward gateway, and caregiver and guardian (family) apps. It alerts the right carer in seconds, learns each resident's patterns and keeps the home's records. Detection and alerts keep working without internet.

- Founded by Daham Dissanayake (Founder, IoT & ML) with co-founders Sanjula Herath (Backend & AI) and Komudi Senarachchi (Design & Docs).
- Stage: working prototype (technology readiness level 6). University Voucher recipient under the NIA Innovation Voucher Programme 2026; incubated in NEO Ventures Cohort 3.
- SoterCare is a safety monitoring and record-keeping system, not a medical device. It does not diagnose.
- Pricing is quoted per care home; there is no public price.
- Contact: support@sotercare.com, +94 70 488 8440

## Key pages

- [Home](${SITE_URL}/): how it works, hardware, FAQs and team
- [News](${SITE_URL}/news): milestones, awards and updates
- [Community](${SITE_URL}/community): SoterCare Developers, the student open-source community

## News

${articles.map((a) => `- [${a.title.trim()}](${SITE_URL}/news/${a.slug}): ${a.date}`).join("\n")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
