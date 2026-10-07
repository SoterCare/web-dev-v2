import type { MetadataRoute } from "next";
import { readNews } from "@/lib/news-store";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const { articles } = readNews();

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/news/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // The home page and /news both list the latest articles, so they change when a new one is posted.
  const latestArticle = articles.reduce<Date>(
    (latest, a) => (new Date(a.date) > latest ? new Date(a.date) : latest),
    new Date("2026-06-29"),
  );

  return [
    {
      url: SITE_URL,
      lastModified: latestArticle,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/community`,
      lastModified: new Date("2026-07-29"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: latestArticle,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articleEntries,
  ];
}
