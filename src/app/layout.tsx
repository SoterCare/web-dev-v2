import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

export const metadata: Metadata = {
  title: "SoterCare.",
  description: "IoT & ML Based Health Monitoring System",
};

import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased">
        <SmoothScroll />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
