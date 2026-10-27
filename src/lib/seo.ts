import type { Metadata } from "next";

export const SITE_URL = "https://sotercare.com";
export const SITE_NAME = "SoterCare";

const DEFAULT_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "SoterCare - smart care monitoring for care homes",
};

interface PageMetadataInput {
  title: string;
  description: string;
  // Path from the site root, e.g. "/news". Becomes the canonical and og:url.
  path: string;
  // Title for social cards when it should differ from the <title> (which gets "| SoterCare").
  socialTitle?: string;
  socialDescription?: string;
  image?: { url: string; alt: string; width?: number; height?: number };
  article?: { publishedTime: string; tags?: string[] };
}

const DESCRIPTION_LIMIT = 155;

function clampDescription(text: string): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= DESCRIPTION_LIMIT) return clean;
  const cut = clean.slice(0, DESCRIPTION_LIMIT - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.;:–—-]+$/, "")}…`;
}

// Next.js copies openGraph, twitter and alternates down from the root layout unless a page sets
// its own, so every indexable page builds its metadata here. Without it, each page's canonical
// and social card point at the homepage.
export function pageMetadata({
  title,
  description,
  path,
  socialTitle,
  socialDescription,
  image,
  article,
}: PageMetadataInput): Metadata {
  title = title.trim();
  description = clampDescription(description);
  const cardTitle = socialTitle ?? `${title} | ${SITE_NAME}`;
  const cardDescription = socialDescription ? clampDescription(socialDescription) : description;
  const images = [image ?? DEFAULT_IMAGE];

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title: cardTitle,
      description: cardDescription,
      images,
      ...(article
        ? { type: "article", publishedTime: article.publishedTime, tags: article.tags }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title: cardTitle,
      description: cardDescription,
      images: images.map((i) => i.url),
    },
  };
}
