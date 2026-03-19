import { getAccessToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import VitalsDisplay from "@/components/dashboard/VitalsDisplay";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import DeviceStatus from "@/components/dashboard/DeviceStatus";
import TemperatureStatistics from "@/components/dashboard/TemperatureStatistics";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";

export const metadata: Metadata = {
  title: "Dashboard | SoterCare",
  description: "Real-time elderly monitoring dashboard",
};

export default async function DashboardPage() {
  const token = await getAccessToken();
  if (!token) redirect("/dashboard/login");

  return (
    <div className="space-y-8 pb-8">
      {/* Top: 4 vitals cards */}
      <VitalsDisplay />

      {/* Middle grid: alerts+stats on left, devices+timeline on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <AlertsPanel />
          <TemperatureStatistics />
        </div>

        {/* Right column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <DeviceStatus />
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
}
