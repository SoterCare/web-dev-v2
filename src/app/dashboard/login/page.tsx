"use client";

import { useState } from "react";
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
      setStep("otp");
    } catch (err: any) {
      console.error(`[AUTH] Error:`, err);
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
      if (mode === "login" || data.accessToken) {
        await setAuthTokens(data.accessToken || "mock-token", data.refreshToken || "mock-refresh");
        router.push("/dashboard");
      } else {
        setSuccessMsg("Account verified! Please sign in.");
        setMode("login"); setStep("form"); setOtp("");
      }
    } catch (err: any) {
      console.error(`[AUTH] Verify Error:`, err);
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

      <div className="depth-card w-full max-w-md p-10 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/assets/SoterCare-Primary-logo-brandblue.webp"
            alt="SoterCare"
            width={160}
            height={50}
            className="h-12 w-auto object-contain mb-6"
            style={{ width: "auto" }}
          />
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] mb-1">
            {step === "form"
              ? mode === "login" ? "Welcome back" : "Create account"
              : "Check your email"}
          </h1>
          <p className="text-sm text-[var(--text-muted)] font-medium text-center">
            {step === "form"
              ? mode === "login"
                ? "Enter your email to receive a sign-in code"
                : "Enter your details to get started"
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        <form onSubmit={step === "form" ? handleAuthSubmit : handleVerifySubmit} className="space-y-5">
          {/* Error banner */}
          {error && (
            <div className="depth-panel px-4 py-3 text-red-600 text-sm font-medium flex items-center gap-3">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}
          {successMsg && (
            <div className="depth-panel px-4 py-3 text-green-700 text-sm font-medium">
              {successMsg}
            </div>
          )}

          <div className="relative overflow-hidden">
            {/* Form step */}
            <div className={`space-y-4 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${step === "otp" ? "-translate-x-full absolute w-full invisible" : "translate-x-0"}`}>
              {mode === "register" && (
                <div>
                  <label className="block text-sm font-bold text-[var(--text)] mb-2 tracking-wide">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      required={mode === "register" && step === "form"}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-black/[0.06] bg-[var(--bg-panel)] text-[var(--text)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--text)]/20 focus:border-[var(--text)]/30 transition-all placeholder:text-[var(--text-muted)]"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-[var(--text)] mb-2 tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    required={step === "form"}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-black/[0.06] bg-[var(--bg-panel)] text-[var(--text)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--text)]/20 focus:border-[var(--text)]/30 transition-all placeholder:text-[var(--text-muted)]"
                    placeholder="you@sotercare.com"
                  />
                </div>
              </div>

              <div className="text-center text-sm text-[var(--text-muted)] font-medium pt-1">
                {mode === "login" ? "No account?" : "Already registered?"}{" "}
                <button
                  type="button"
                  onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                  className="text-[var(--text)] font-bold hover:underline"
                >
                  {mode === "login" ? "Register" : "Sign in"}
                </button>
              </div>
            </div>

            {/* OTP step */}
            <div className={`transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${step === "form" ? "translate-x-full absolute w-full invisible" : "translate-x-0"}`}>
              <label className="block text-sm font-bold text-[var(--text)] mb-2 tracking-wide">Verification Code</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  required={step === "otp"}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-black/[0.06] bg-[var(--bg-panel)] text-[var(--text)] font-bold text-center tracking-[0.5em] text-xl focus:outline-none focus:ring-2 focus:ring-[var(--text)]/20 focus:border-[var(--text)]/30 transition-all placeholder:text-[var(--text-muted)] placeholder:tracking-normal placeholder:text-base"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              <button
                type="button"
                onClick={() => { setStep("form"); setError(""); }}
                className="mt-3 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors font-medium"
              >
                ← Change email
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-[var(--text)] text-[var(--bg-body)] font-bold text-base rounded-xl flex items-center justify-center gap-2 group shadow-m hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {step === "form"
                  ? mode === "login" ? "Send Sign-in Code" : "Create Account"
                  : "Verify & Continue"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
