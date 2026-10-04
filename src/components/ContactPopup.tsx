"use client"

import { useState, useEffect } from "react"
import { contactAction } from "@/app/actions"
import { X, Send, CheckCircle, Loader2, Check } from "lucide-react"

const POINTS = [
    "A walkthrough of SoterCare for your home",
    "Camera-free, and it keeps working without internet",
    "A personal reply from our team within 24 hours",
]

const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-text placeholder:text-text-muted/60 transition-all focus:border-[#3d7e93] focus:outline-none focus:ring-4 focus:ring-[#3d7e93]/15"

function Field({
    label,
    optional,
    children,
}: {
    label: string
    optional?: boolean
    children: React.ReactNode
}) {
    return (
        <label className="block">
            <span className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-text">
                {label}
                {optional && <span className="text-xs font-normal text-text-muted">Optional</span>}
            </span>
            {children}
        </label>
    )
}

export default function ContactPopup() {
    const [isOpen, setIsOpen] = useState(false)
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [errorMsg, setErrorMsg] = useState("")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const handleOpenEvent = () => {
            setIsOpen(true)
            setStatus("idle")
            setErrorMsg("")
        }
        window.addEventListener("open-contact-popup", handleOpenEvent)
        return () => window.removeEventListener("open-contact-popup", handleOpenEvent)
    }, [])

    useEffect(() => {
        if (!isOpen) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [isOpen])

    const handleClose = () => {
        setIsOpen(false)
        // Reset after close animation
        setTimeout(() => {
            setStatus("idle")
            setErrorMsg("")
        }, 300)
    }

    if (!mounted || !isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-title"
            data-lenis-prevent
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/45 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={handleClose}
            />

            {/* Solid card, two panes on desktop */}
            <div className="relative grid max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl animate-in zoom-in-95 duration-300 sm:max-h-[calc(100dvh-3rem)] md:grid-cols-5 md:overflow-hidden">
                <button
                    onClick={handleClose}
                    aria-label="Close"
                    className="absolute right-4 top-4 z-10 rounded-full p-2 text-text-muted transition-colors hover:bg-black/5 hover:text-text"
                >
                    <X size={22} />
                </button>

                {/* Left: what happens next */}
                <aside className="flex flex-col justify-between gap-8 bg-[#eaf3f6] p-7 sm:p-10 md:col-span-2">
                    <div>
                        <h2 id="demo-title" className="text-4xl font-bold !leading-[1.05] tracking-tight text-text md:text-5xl">
                            Book a demo
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-text-muted">
                            Tell us about your care home. We are a startup building SoterCare with
                            our first care homes, and we would love to build it with you.
                        </p>
                        <ul className="mt-8 space-y-4">
                            {POINTS.map((point) => (
                                <li key={point} className="flex items-start gap-3 text-text">
                                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#3d7e93]">
                                        <Check size={14} strokeWidth={3} className="text-white" />
                                    </span>
                                    <span className="leading-snug">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className="text-sm text-text-muted">
                        Prefer email? Write to{" "}
                        <a href="mailto:support@sotercare.com" className="font-semibold text-[#3d7e93] hover:underline">
                            support@sotercare.com
                        </a>
                    </p>
                </aside>

                {/* Right: the form */}
                <div className="p-7 sm:p-10 md:col-span-3 md:overflow-y-auto">
                    {status === "success" ? (
                        <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-2">
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#67D974]/25">
                                <CheckCircle size={34} className="text-[#2f9e44]" />
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight text-text">Request sent</h3>
                            <p className="mt-3 max-w-sm text-lg leading-relaxed text-text-muted">
                                Thank you. A member of our small team will reply to you personally.
                            </p>
                            <button
                                onClick={handleClose}
                                className="mt-8 rounded-full bg-text px-8 py-3 font-bold text-bg-card transition-transform hover:scale-105 active:scale-95"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault()
                                setStatus("loading")
                                setErrorMsg("")
                                const formData = new FormData(e.currentTarget)
                                const result = await contactAction(formData)
                                if (result.success) {
                                    setStatus("success")
                                } else {
                                    setErrorMsg(result.error || "Something went wrong. Please try again.")
                                    setStatus("error")
                                }
                            }}
                            className="space-y-5"
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Your name">
                                    <input name="name" type="text" required placeholder="Full name" autoComplete="name" className={inputClass} />
                                </Field>
                                <Field label="Email">
                                    <input name="email" type="email" required placeholder="you@carehome.com" autoComplete="email" className={inputClass} />
                                </Field>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-3">
                                <div className="sm:col-span-3">
                                    <Field label="Care home" optional>
                                        <input name="home" type="text" placeholder="Name of your care home" className={inputClass} />
                                    </Field>
                                </div>
                                <div className="sm:col-span-1">
                                    <Field label="Beds" optional>
                                        <input name="beds" type="text" inputMode="numeric" placeholder="e.g. 25" className={inputClass} />
                                    </Field>
                                </div>
                                <div className="sm:col-span-2">
                                    <Field label="Your role" optional>
                                        <input name="role" type="text" placeholder="e.g. Manager, nurse, owner" className={inputClass} />
                                    </Field>
                                </div>
                            </div>

                            <Field label="How can we help?">
                                <textarea
                                    name="message"
                                    required
                                    rows={4}
                                    placeholder="Tell us a little about your home and what you are looking for"
                                    className={`${inputClass} resize-none`}
                                />
                            </Field>

                            {status === "error" && errorMsg && (
                                <p className="rounded-xl bg-[#F05B6E]/10 px-4 py-3 text-sm font-medium text-[#B42A3E]" role="alert">
                                    {errorMsg}
                                </p>
                            )}

                            <button
                                disabled={status === "loading"}
                                className="group flex w-full items-center justify-center rounded-full bg-text py-4 text-lg font-bold text-bg-card shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                            >
                                {status === "loading" ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Request a demo
                                        <Send size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
