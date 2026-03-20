"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clearAuthTokens } from "@/lib/auth";
import { Bell, User, LogOut, Mail, ChevronDown } from "lucide-react";

interface UserInfo {
  name:  string;
  email: string;
  role:  string;
  id:    string;
}

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch user info once on mount
  useEffect(() => {
    fetch("/api/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data && !data.error) setUser(data); })
      .catch(() => {});
  }, []);

  // Close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await clearAuthTokens();
    router.push("/dashboard/login");
  };

  return (
    <header className="sticky top-0 z-30 w-full px-6 md:px-10 py-4 bg-[var(--bg-body)]">
      <div className="depth-card px-6 py-3 flex items-center justify-between rounded-2xl max-w-[1200px] mx-auto">

        {/* Left — logo */}
        <Link href="/dashboard" className="flex items-center shrink-0">
          <Image
            src="/assets/SoterCare-Primary-logo-brandblue.webp"
            alt="SoterCare"
            width={160}
            height={44}
            className="h-10 w-auto object-contain"
            style={{ width: "auto" }}
            priority
          />
        </Link>

        {/* Center — page title */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block pointer-events-none">
          <span className="text-sm font-bold text-[var(--text-muted)] tracking-widest uppercase">
            SoterCare Dashboard
          </span>
        </div>

        {/* Right — bell + account */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Bell */}
          <div className="relative depth-panel p-2.5 rounded-xl cursor-pointer">
            <Bell className="w-5 h-5 text-[var(--text-muted)]" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-card)]" />
          </div>

          {/* Account dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="flex items-center gap-2 depth-panel px-3 py-2 rounded-xl hover:shadow-m transition-all"
              aria-label="Account menu"
            >
              <div className="w-8 h-8 rounded-full depth-card flex items-center justify-center">
                <User className="w-4 h-4 text-[var(--text-muted)]" />
              </div>
              <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 depth-card py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">

                {/* User info block */}
                <div className="px-5 pb-3">
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full depth-panel flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-[var(--text-muted)]" />
                    </div>
                    <div>
                      <p className="font-bold text-[var(--text)] leading-tight">
                        {user?.name || "Account Holder"}
                      </p>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 tracking-wide uppercase">
                        {user?.role || "Caregiver"}
                      </span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="depth-panel rounded-xl flex items-center gap-2.5 px-4 py-3">
                    <Mail className="w-4 h-4 text-[var(--text-muted)] shrink-0 translate-y-px" />
                    <span className="text-xs font-semibold text-[var(--text)] truncate leading-none">
                      {user?.email || "—"}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-black/[0.06] mx-3 mb-1" />

                {/* Sign out */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
