"use client"

import { useState, useEffect } from "react"
import { subscribeAction } from "@/app/actions"
import { X, Mail, CheckCircle, ArrowRight, Loader2 } from "lucide-react"

export default function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false)
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (localStorage.getItem("subscribed") || sessionStorage.getItem("newsletter_dismissed")) {
            return
        }

        const pricingSection = document.getElementById("pricing")
        if (!pricingSection) {
            // Fallback to timer if pricing section not found? Or just return?
            // Let's fallback for safety or just return. Returning is safer to avoid unexpected popups.
            // Actually, let's just log it or do nothing.
            return
        }

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0]
            // Trigger when the element leaves the viewport (scrolled past it)
            // boundingClientRect.top < 0 means it's above the viewport
            if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                setIsOpen(true)
                observer.disconnect()
            }
        }, {
            threshold: 0
        })

        observer.observe(pricingSection)

        return () => observer.disconnect()
    }, [])

    const handleClose = () => {
        setIsOpen(false)
        // Don't show again for this session if closed? Or maybe allow it to pop up again later?
        // user requirement said "if they haven't seen it", but typically "seen" means interacted or dismissed.
        // For now, let's not set "subscribed", so it might pop up again on refresh, 
        // but maybe set a session flag if needed. 
        // The requirement "if (!localStorage.getItem('subscribed'))" implies it only stops if subscribed.
        // We'll stick to that strictly, or maybe use session storage to avoid spamming on every refresh.
        sessionStorage.setItem("newsletter_dismissed", "true")
    }

    // Event listener for manual trigger (Footer button)
    useEffect(() => {
        const handleOpenEvent = () => setIsOpen(true);
        window.addEventListener('open-newsletter-popup', handleOpenEvent);

        return () => window.removeEventListener('open-newsletter-popup', handleOpenEvent);
    }, []);


    if (!mounted || !isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
                onClick={handleClose}
            />

            {/* Card */}
            <div className="relative w-full max-w-md bg-gradient-to-b from-[#fafafa] to-[#f7f7f7] shadow-m rounded-[1.5rem] p-6 sm:p-8 border border-white/50 overflow-hidden animate-in zoom-in-95 duration-300 slide-in-from-bottom-4">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-black/5"
                >
                    <X size={20} />
                </button>

                {status === "success" ? (
                    <div className="flex flex-col items-center text-center py-4 animate-in fade-in slide-in-from-bottom-2">
                        <h2 className="text-xl font-bold text-[var(--text)]">You're on <br />the list!</h2>
                        <p className="text-[var(--text-muted)] max-w-[200px]">
                            Thanks for joining.
                        </p>
                        <button
                            onClick={handleClose}
                            className="mt-4 px-6 py-2 py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center group text-md bg-[#a0cbdb] shadow-m text-white hover:text-black hover:bg-white disabled:opacity-70"
                        >
                            Continue
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 text-[#a0cbdb] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                <Mail size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Updates Newsletter</h2>
                            <p className="text-[var(--text-muted)] leading-relaxed">
                                Join us to stay updated on our progress and be part of our journey with SoterCare.
                            </p>
                        </div>

                        <form onSubmit={async (e) => {
                            e.preventDefault()
                            setStatus("loading")
                            const formData = new FormData(e.currentTarget)
                            const result = await subscribeAction(formData)
                            if (result.success) {
                                setStatus("success")
                                localStorage.setItem("subscribed", "true")
                            } else {
                                alert(result.error) // Simple alert for now, or use a state to show error below input
                                setStatus("idle")
                            }
                        }} className="space-y-3">
                            <div className="relative">
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 text-gray-800"
                                />
                            </div>
                            <button
                                disabled={status === "loading"}
                                className="w-full py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center group text-md bg-[#a0cbdb] shadow-m text-white hover:text-black hover:bg-white disabled:opacity-70"
                            >
                                {status === "loading" ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Subscribing...
                                    </>
                                ) : (
                                    <>
                                        Subscribe Free
                                        <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4">
                                No spam. Unsubscribe anytime.
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
