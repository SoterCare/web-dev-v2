"use client";

import { useEffect, useState } from "react";
import { BellOff } from "lucide-react";
import { dashboardApi } from "@/lib/dashboardApi";
import {
  NO_PHONE_BANNER_TEXT,
  shouldShowNoPhoneBanner,
  type NotificationStatus,
} from "@/lib/notificationStatus";

/**
 * Shown only when GET /notifications/status confirms zero registered phones.
 * Hidden while loading and on any error (I-1: claim nothing that is not confirmed).
 */
export default function NoPhoneBanner() {
  const [status, setStatus] = useState<NotificationStatus | null>(null);

  useEffect(() => {
    let active = true;
    dashboardApi.getNotificationStatus().then((s) => {
      if (active) setStatus(s);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!shouldShowNoPhoneBanner(status)) return null;

  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-900"
    >
      <BellOff className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p>{NO_PHONE_BANNER_TEXT}</p>
    </div>
  );
}
