"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthTokens } from "@/lib/auth";
import { LayoutDashboard, AlertCircle, LogOut } from "lucide-react";
import Image from "next/image";

const links = [
  { href: "/dashboard",        label: "Overview",      icon: LayoutDashboard },
  { href: "/dashboard/alerts", label: "Recent Alerts", icon: AlertCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await clearAuthTokens();
    router.push("/dashboard/login");
  };

  return (
    <aside className="w-64 hidden md:flex flex-col z-20 bg-[var(--bg-card)] border-r border-black/[0.05] shadow-[2px_0_20px_-8px_rgba(0,0,0,0.08)]">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-black/[0.05]">
        <Image
          src="/assets/SoterCare-Primary-logo-brandblue.webp"
          alt="SoterCare"
          width={140}
          height={40}
          className="h-9 w-auto object-contain"
          style={{ width: "auto" }}
          priority
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <p className="px-3 text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase mb-3">Main Menu</p>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                active
                  ? "bg-[var(--text)] text-[var(--bg-body)] shadow-m"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-panel)] hover:text-[var(--text)]"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-4 py-5 border-t border-black/[0.05]">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-sm text-[var(--text-muted)] hover:bg-red-50 hover:text-red-600 transition-all depth-panel"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
