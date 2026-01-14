import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoterCare",
  description: "IoT & ML Based Health Monitoring System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased">
        {children}
      </body>
    </html>
  );
}
