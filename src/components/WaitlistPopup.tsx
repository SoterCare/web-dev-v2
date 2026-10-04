"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { joinWaitlistAction, subscribeAction } from "@/app/actions"
import { X, ArrowRight, CheckCircle, Loader2, Check } from "lucide-react"

interface WaitlistPopupProps {
    isOpen: boolean
    onClose: () => void
}

const POINTS = [
    "Care homes come first, then every home",
    "One email from us when the home kit is ready",
    "No spam, and you can unsubscribe any time",
]

export default function WaitlistPopup({ isOpen, onClose }: WaitlistPopupProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")
    const [errorMsg, setErrorMsg] = useState("")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    useEffect(() => {
        if (!isOpen) return
        setStatus("idle")
        setErrorMsg("")
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [isOpen, onClose])

    if (!isOpen || !mounted) return null

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-title"
            data-lenis-prevent
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/45 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Solid card, two panes on desktop */}
            <div className="relative grid max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl animate-in zoom-in-95 duration-300 sm:max-h-[calc(100dvh-3rem)] md:grid-cols-5 md:overflow-hidden">
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-4 top-4 z-10 rounded-full p-2 text-text-muted transition-colors hover:bg-black/5 hover:text-text"
                >
                    <X size={22} />
                </button>

                {/* Left: the promise */}
                <aside className="flex flex-col justify-between gap-8 bg-[#eaf3f6] p-7 sm:p-10 md:col-span-3">
                    <div>
                        <h2 id="waitlist-title" className="text-4xl font-bold !leading-[1.05] tracking-tight text-text md:text-5xl">
                            Join the home&#8209;kit waitlist
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-text-muted">
                            We are starting with care homes. Once SoterCare is proven there, we will
                            bring it to every home as a family kit. That is our promise to the
                            community.
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
                </aside>

                {/* Right: the form */}
                <div className="p-7 sm:p-10 md:col-span-2">
                    {status === "success" ? (
                        <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-2">
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#67D974]/25">
                                <CheckCircle size={34} className="text-[#2f9e44]" />
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight text-text">You&apos;re on the list</h3>
                            <p className="mt-3 max-w-xs text-lg leading-relaxed text-text-muted">
                                We&apos;ll let you know when the home kit is ready.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-8 rounded-full bg-text px-8 py-3 font-bold text-bg-card transition-transform hover:scale-105 active:scale-95"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault()
                                setErrorMsg("")

                                const formData = new FormData(e.currentTarget)
                                const consent = formData.get("newsletter_consent") === "on"

                                if (!consent) {
                                    setErrorMsg("Please tick the box to subscribe to the newsletter and join the waitlist.")
                                    return
                                }

                                setStatus("loading")

                                // Join the waitlist, then subscribe to the newsletter with the same email.
                                const waitlistResult = await joinWaitlistAction(formData)

                                if (waitlistResult.success) {
                                    await subscribeAction(formData)
                                    setStatus("success")
                                    localStorage.setItem("subscribed", "true") // They consented to the newsletter
                                } else {
                                    setErrorMsg(waitlistResult.error || "Something went wrong. Please try again.")
                                    setStatus("idle")
                                }
                            }}
                            className="flex h-full flex-col justify-center space-y-5"
                        >
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-semibold text-text">Email</span>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-text placeholder:text-text-muted/60 transition-all focus:border-[#3d7e93] focus:outline-none focus:ring-4 focus:ring-[#3d7e93]/15"
                                />
                            </label>

                            <label htmlFor="newsletter_consent" className="flex cursor-pointer select-none items-start gap-3">
                                <span className="relative mt-0.5 flex">
                                    <input
                                        type="checkbox"
                                        name="newsletter_consent"
                                        id="newsletter_consent"
                                        required
                                        className="peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md border border-black/20 bg-white checked:border-[#3d7e93] checked:bg-[#3d7e93] focus:outline-none focus:ring-4 focus:ring-[#3d7e93]/15"
                                    />
                                    <Check
                                        size={14}
                                        strokeWidth={3}
                                        className="pointer-events-none absolute left-[3px] top-[3px] text-white opacity-0 peer-checked:opacity-100"
                                    />
                                </span>
                                <span className="text-sm leading-snug text-text-muted">
                                    I agree to subscribe to the SoterCare newsletter to receive updates and news.
                                </span>
                            </label>

                            {errorMsg && (
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
                                        Joining...
                                    </>
                                ) : (
                                    <>
                                        Join the waitlist
                                        <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}
