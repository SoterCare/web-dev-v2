"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "./Header";
import DashboardFooter from "./DashboardFooter";
import { WebSocketProvider } from "./WebSocketContext";
import { LayoutDashboard, Clock, Trash2, Newspaper } from "lucide-react";

const NAV = [
  { href: "/dashboard",             label: "Overview",    Icon: LayoutDashboard },
  { href: "/dashboard/timeline",    label: "Timeline",    Icon: Clock },
  { href: "/dashboard/recycle-bin", label: "Recycle Bin", Icon: Trash2 },
  ...(process.env.NODE_ENV !== "production"
    ? [{ href: "/dashboard/news", label: "News", Icon: Newspaper }]
    : []),
];

function DashboardNav() {
  const pathname = usePathname();
  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-2 pb-1">
      <nav className="flex items-center gap-1 bg-[var(--bg-card)] rounded-2xl p-1.5 depth-card shadow-sm w-fit">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-[var(--text)] text-[var(--bg-body)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-panel)]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-body)] font-sans relative">
      <div className="dotted-bg" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <WebSocketProvider>
          <DashboardNav />
          <main className="flex-1 p-5 md:p-8">
            <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out">
              {children}
            </div>
          </main>
        </WebSocketProvider>
        <DashboardFooter />
      </div>
    </div>
  );
}
