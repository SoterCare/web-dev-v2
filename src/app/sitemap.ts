import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sotercare.com";

  return [
    {
      url: baseUrl,
      lastModified: "2026-01-19",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/product`,
      lastModified: "2026-01-19",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: "2026-01-19",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: "2026-01-19",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: "2026-01-19",
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: "2026-01-19",
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
