"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-body)] font-sans relative">
      <div className="dotted-bg" />
      <div className="relative z-10">
        <Header />
        <main className="p-5 md:p-8 pb-20">
          <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

