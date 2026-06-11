import { getAccessToken, clearAuthTokens } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Box, Smartphone } from "lucide-react";

import VitalsDisplay from "@/components/dashboard/VitalsDisplay";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import TemperatureStatistics from "@/components/dashboard/TemperatureStatistics";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Real-time elderly monitoring dashboard",
};

export default async function DashboardPage() {
  const token = await getAccessToken();
  if (!token) redirect("/dashboard/login");

  let profileData = null;
  try {
    const res = await fetch("https://backend.sotercare.com/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: "no-store"
    });

    if (res.status === 401) {
      await clearAuthTokens();
      redirect("/dashboard/login");
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch profile: ${res.status}`);
    }

    profileData = await res.json();
  } catch (err) {
    console.error("[Dashboard] Profile fetch error:", err);
    // On unexpected fail, redirect to login for safety or just refresh token gracefully.
    // Given the requirement "when use freshesh the browser cgheck for whetheir the current account is available", login redirect is best.
    redirect("/dashboard/login");
  }

  const user = profileData?.user;
  const hasClaimedDevice = user?.hasClaimedDevice === true;
  const deviceId = user?.deviceId || "Unknown Device";

  if (!hasClaimedDevice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-blue-50/50 border border-blue-100/50 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Smartphone className="w-10 h-10 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold text-[var(--text)] tracking-tight mb-4">No Device Claimed</h2>
        <p className="text-[var(--text-muted)] text-lg max-w-md mx-auto mb-8 font-medium">
          There is no device claimed to this account. Use the mobile application and claim a device to use the web dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">

      {/* Top: 4 vitals cards */}
      <VitalsDisplay />

      {/* Main grid: alerts left, temperature chart right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Recent Alerts */}
        <div className="lg:col-span-5 flex flex-col">
          <AlertsPanel />
        </div>

        {/* Right: Temperature Statistics */}
        <div className="lg:col-span-7 flex flex-col">
          <TemperatureStatistics />
        </div>
      </div>
    </div>
  );
}
