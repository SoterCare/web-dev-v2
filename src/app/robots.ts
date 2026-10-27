import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// One group for every crawler: a crawler obeys only the most specific group that names it, so
// separate Googlebot/Bingbot groups would skip these rules. /_next/ stays crawlable because
// search engines need its JS and CSS to render the pages. Staff pages (/dashboard, /pitch,
// /editnews) are kept out of results with noindex instead, which crawlers can only see if
// they're allowed to fetch the page.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
