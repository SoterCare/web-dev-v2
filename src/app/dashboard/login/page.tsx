"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setAuthTokens } from "@/lib/auth";
import { authService } from "@/lib/api";
import { Loader2, Mail, KeyRound, ArrowRight, User as UserIcon } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"form" | "otp">("form");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Initialize and manage the cooldown timer
  useEffect(() => {
    const end = localStorage.getItem("sotercare_otp_cooldown_end");
    if (end) {
      const remaining = Math.ceil((parseInt(end, 10) - Date.now()) / 1000);
      if (remaining > 0) {
        setCooldown(remaining);
      } else {
        localStorage.removeItem("sotercare_otp_cooldown_end");
      }
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("sotercare_otp_cooldown_end");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const startCooldown = () => {
    const endsAt = Date.now() + 60000; // 1 minute
    localStorage.setItem("sotercare_otp_cooldown_end", endsAt.toString());
    setCooldown(60);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    console.log(`[AUTH] Initiating ${mode} for:`, email);
    try {
      let res;
      if (mode === "login") {
        res = await authService.login({ email });
      } else {
        res = await authService.register({ name, email });
      }
      console.log(`[AUTH] Response:`, res.status, res.statusText);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Server returned ${res.status}: ${text || "Unknown error"}`);
      }
      
      let data: any = {};
      try { data = await res.json(); console.log("[AUTH] Init Data:", data); } catch (_) {}
      
      if (data.success === false) {
        throw new Error(data.message || "Operation failed");
      }
      
      setStep("otp");
      startCooldown();
    } catch (err: any) {
      // We don't console.error expected validation errors to avoid Next.js dev overlay popups
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    console.log(`[AUTH] Verifying ${mode} for:`, email, "otp:", otp);
    try {
      let res;
      if (mode === "login") {
        res = await authService.verifyLogin({ email, otp });
      } else {
        res = await authService.verifyRegistration({ email, otp });
      }
      console.log(`[AUTH] Verify Response:`, res.status, res.statusText);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Server returned ${res.status}: ${text || "Invalid code"}`);
      }
      
      let data: any = {};
      try { data = await res.json(); console.log("[AUTH] Data:", data); } catch (_) {}
      
      // The backend returns { success: false, message: ... } on invalid OTP
      if (data.success === false) {
        throw new Error(data.message || "Invalid OTP");
      }
      if (mode === "login") {
        // Extract token — backend may nest under data.data or at top level
        const accessToken = data.accessToken || data.data?.accessToken || data.token;
        const refreshToken = data.refreshToken || data.data?.refreshToken || data.refresh;

        if (!accessToken) {
          throw new Error("No access token received. Please try again.");
        }

        await setAuthTokens(accessToken, refreshToken || "");
        router.push("/dashboard");
      } else if (data.accessToken || data.data?.accessToken) {
        const accessToken = data.accessToken || data.data.accessToken;
        const refreshToken = data.refreshToken || data.data?.refreshToken || "";
        await setAuthTokens(accessToken, refreshToken);
        router.push("/dashboard");
      } else {
        setSuccessMsg("Account verified! Please sign in.");
        setMode("login"); setStep("form"); setOtp("");
      }
    } catch (err: any) {
      // We don't console.error expected validation errors (like wrong OTP) to avoid Next.js dev overlay popups
      setError(err.message || "Failed to verify. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)] p-4 relative overflow-hidden font-sans">
      <div className="dotted-bg" />
      {/* Subtle glow matching SoterCare brand */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-sky-100 to-blue-100 blur-[160px] opacity-50 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-slate-100 to-indigo-100 blur-[160px] opacity-50 pointer-events-none" />
      {/* Auth Card */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#fafafa] to-[#f7f7f7] shadow-m rounded-[1.8rem] p-8 md:p-10 border border-white/50 overflow-hidden animate-in zoom-in-95 duration-500 slide-in-from-bottom-4 z-10">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6">
            <Image
              src="/assets/SoterCare-Primary-logo-brandblue.webp"
              alt="SoterCare"
              width={160}
              height={44}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">
            {step === "form" 
              ? (mode === "login" ? "Welcome Back" : "Create Account")
              : "Verify Email"}
          </h1>
          <p className="text-[var(--text-muted)] mt-2 font-medium">
            {step === "form"
              ? (mode === "login" ? "Sign in to access your dashboard" : "Join us to start monitoring health")
              : `We've sent a code to ${email}`}
          </p>
        </div>

        {/* Messaging */}
        {(error || successMsg) && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}
            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {successMsg}
              </div>
            )}
          </div>
        )}

        <form onSubmit={step === "form" ? handleAuthSubmit : handleVerifySubmit} className="space-y-5">
          {step === "form" ? (
            <>
              {mode === "register" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] ml-1 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      required={mode === "register"}
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] ml-1 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  {mode === "login" ? "Need an account? Create one" : "Already have an account? Sign in"}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] ml-1 uppercase tracking-wider text-center block">Verification Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    required
                    className="w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all placeholder:text-gray-300 text-gray-800 placeholder:tracking-normal placeholder:text-base mr-[-0.5em]"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  ← Use a different email
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (step === "form" && cooldown > 0)}
            className="w-full py-4 rounded-full font-bold transition-all duration-300 flex items-center justify-center group text-base bg-[#a0cbdb] shadow-m text-white hover:text-black hover:bg-white disabled:opacity-70 mt-4 active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {step === "form" 
                  ? (cooldown > 0 ? `Wait ${cooldown}s to Resend` : (mode === "login" ? "Receive Sign-in Code" : "Create Account")) 
                  : "Verify & Continue"}
                <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
