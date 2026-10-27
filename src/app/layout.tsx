import type { Metadata } from "next";
import { preload } from "react-dom";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Site-wide schema only. Page-specific schema (Service, FAQPage, NewsArticle) lives on its page.
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
        width: 2000,
        height: 2000,
      },
      description:
        "SoterCare is a startup building a smart care system for care homes: a camera-free thigh band, a ward gateway and apps that monitor every resident, alert the right carer in seconds, spot trends and keep the home's records.",
      email: "support@sotercare.com",
      telephone: "+94704888440",
      address: {
        "@type": "PostalAddress",
        addressCountry: "LK",
      },
      founder: {
        "@type": "Person",
        name: "Daham Dissanayake",
        sameAs: "https://www.linkedin.com/in/daham-dissanayake/",
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
  // iPhone Safari turns dates, phone numbers and addresses into links before the page's script
  // runs. That changes the server HTML under React, which then fails to hydrate and redraws the
  // page. Real links (tel:, mailto:) are written out in the markup already.
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
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
  // Defaults for pages that don't build their own (see pageMetadata in lib/seo.ts). No url or
  // canonical here: Next.js copies them to every child page, which pointed them all at the homepage.
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SoterCare",
    images: [
      {
        url: "https://sotercare.com/og.png",
        width: 1200,
        height: 630,
        alt: "SoterCare - smart care monitoring for care homes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://sotercare.com/og.png"],
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
  // Preload the above-the-fold font weights for better CLS and FCP. React's preload() emits one tag
  // each; hand-written <link rel="preload"> tags in <head> were being output twice.
  preload("/fonts/URWGeometricMedium.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/fonts/URWGeometricBold.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme color for browser chrome */}
        <meta name="theme-color" content="#a0cbdb" />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        {/* DNS prefetch for faster resolution */}
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        {/* Runs before the first paint (see globals.css). A visitor who has already seen the
            splash this session has it hidden straight away, instead of waiting for the page's
            script to load. Otherwise scrolling is locked until the splash has finished; the
            splash only exists on the home page, so other pages never get the lock. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var c=document.documentElement.classList;if(sessionStorage.getItem('hasViewedSplash'))c.add('splash-seen');else if(location.pathname==='/')c.add('splash-lock')}catch(e){}",
          }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
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
