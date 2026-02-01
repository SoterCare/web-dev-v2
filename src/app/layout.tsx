import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";


// Safe, minimal, truthful schema - compliant with Google guidelines
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://sotercare.com/#organization",
      "name": "SoterCare",
      "url": "https://sotercare.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sotercare.com/assets/SoterCare-centered-logo.png",
        "width": 512,
        "height": 512
      },
      "description": "SoterCare provides IoT and ML-based elderly care monitoring systems featuring fall detection, vital sign monitoring, and caregiver alerts.",
      "email": "sotercare@gmail.com",
      "telephone": "+94704888440",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "LK"
      },
      "sameAs": [
        "https://www.instagram.com/sotercare_",
        "https://www.linkedin.com/company/sotercare/"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://sotercare.com/#website",
      "name": "SoterCare",
      "url": "https://sotercare.com",
      "description": "Smart Elderly Care Monitoring System - Wellness Simplified",
      "publisher": {
        "@id": "https://sotercare.com/#organization"
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "SoterCare Mobile App",
      "description": "The SoterCare mobile application provides real-time health monitoring, AI-powered health summaries, fall alerts, and vital sign tracking for elderly care.",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "Product",
      "@id": "https://sotercare.com/#product",
      "name": "SoterCare Kit",
      "description": "The essential hardware kit for elderly care monitoring. Includes the Thigh Node, Wrist Node, and the Edge Gateway for seamless, offline-ready monitoring with AI-powered fall detection and vital sign tracking.",
      "brand": {
        "@type": "Brand",
        "name": "SoterCare"
      },
      "category": "Health Monitoring Devices",
      "offers": {
        "@type": "Offer",
        "price": "329.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/PreOrder",
        "url": "https://sotercare.com/#pricing",
        "priceValidUntil": "2026-12-31"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://sotercare.com"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How is SoterCare different from a standard SOS panic button?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Unlike panic buttons that require you to press them after an accident, SoterCare is proactive. It uses AI to detect 'risky movements' (like unassisted standing) and alerts caregivers before a fall happens. It also works automatically if the user is unconscious."
          }
        },
        {
          "@type": "Question",
          "name": "Will the system work if my home Wi-Fi goes down?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. SoterCare has an Offline Safety Mode. The central hub processes alerts locally, triggering instant buzzers and lights for falls even without internet. Data syncs to the cloud automatically once Wi-Fi is restored."
          }
        },
        {
          "@type": "Question",
          "name": "How does the 'Recycle Bin' feature help with false alarms?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It helps reduce annoying alerts. If you get a false alarm, you can mark it as 'False' in the app. This moves it to the Recycle Bin and uses that data to retrain our system, making it smarter and more accurate for you over time."
          }
        },
        {
          "@type": "Question",
          "name": "Is the urinary incontinence alert discreet?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. To protect dignity, there are no loud 'bathroom' alarms. The system detects moisture and sends a private, silent notification to the caregiver's phone. A small blue light on the hub provides a discreet visual cue."
          }
        },
        {
          "@type": "Question",
          "name": "What happens if one of the wearable bands runs out of battery?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The thigh and wrist bands work independently. If one battery dies, the other keeps monitoring. For example, if the thigh band stops, the wristband continues to track heart rate and oxygen levels seamlessly."
          }
        }
      ]
    }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sotercare.com"),
  title: {
    default: "SoterCare - Smart Elderly Care Monitoring System | Fall Detection & Vital Signs",
    template: "%s | SoterCare"
  },
  description: "SoterCare is an IoT and ML-based elderly care monitoring system featuring AI-powered fall detection, real-time vital sign monitoring (heart rate, SpO2), and instant caregiver alerts. Keep your loved ones safe with proactive health monitoring.",
  keywords: [
    "elderly care monitoring",
    "fall detection system",
    "vital sign monitoring",
    "IoT health monitoring",
    "senior care technology",
    "caregiver alerts",
    "heart rate monitoring",
    "SpO2 monitoring",
    "AI health monitoring",
    "wearable health device",
    "elderly safety system",
    "remote patient monitoring"
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
    title: "SoterCare - Smart Elderly Care Monitoring System",
    description: "AI-powered elderly care monitoring with fall detection, vital sign tracking, and instant caregiver alerts. Wellness simplified.",
    images: [
      {
        url: "https://sotercare.com/og.png",
        width: 1200,
        height: 630,
        alt: "SoterCare IoT elderly care monitoring dashboard showing fall detection and vital signs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SoterCare - Smart Elderly Care Monitoring System",
    description: "AI-powered elderly care monitoring with fall detection, vital sign tracking, and instant caregiver alerts.",
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
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        {/* DNS prefetch for faster resolution */}
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <SmoothScroll />
        <NewsletterPopup />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
