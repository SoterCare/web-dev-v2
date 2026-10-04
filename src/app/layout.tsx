import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { faqs } from "@/lib/faqs";

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

import SmoothScroll from "@/components/SmoothScroll";
import NewsletterPopup from "@/components/NewsletterPopup";
import JsonLd from "@/components/JsonLd";
import HashScroll from "@/components/HashScroll";
import VideoPopup from "@/components/VideoPopup";
import ContactPopup from "@/components/ContactPopup";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical fonts for better CLS and FCP */}
        <link
          rel="preload"
          href="/fonts/URWGeometricMedium.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/URWGeometricBold.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        {/* Apple Touch Icon for iOS home screen */}
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/SoterCare-centered-logo.webp" />
        {/* Theme color for browser chrome */}
        <meta name="theme-color" content="#a0cbdb" />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        {/* DNS prefetch for faster resolution */}
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        {/* JSON-LD Structured Data - injected client-side to avoid hydration mismatch */}
        <JsonLd data={jsonLd} id="site-jsonld" />
        <SmoothScroll />
        <HashScroll />
        <NewsletterPopup />
        <VideoPopup />
        <ContactPopup />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
