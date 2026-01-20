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
  ];
}
