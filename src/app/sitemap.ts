import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sotercare.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date("2025-03-20"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date("2025-03-20"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}



