import type { MetadataRoute } from "next";
import { readNews } from "@/lib/news-store";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sotercare.com";
  const { articles } = readNews();

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-06-29"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date("2026-06-29"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articleEntries,
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date("2026-06-29"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
