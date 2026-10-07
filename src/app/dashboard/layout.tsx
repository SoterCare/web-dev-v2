import type { Metadata } from "next";
import DashboardLayoutClient from "@/components/dashboard/DashboardLayoutClient";

// Staff-only pages: keep them out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
