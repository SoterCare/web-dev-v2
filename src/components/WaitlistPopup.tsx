"use client"

import { useState, useEffect } from "react"
import { joinWaitlistAction } from "@/app/actions"
import { X, UserPlus, CheckCircle, ArrowRight } from "lucide-react"

interface WaitlistPopupProps {
    isOpen: boolean
    onClose: () => void
}

import { createPortal } from "react-dom"

export default function WaitlistPopup({ isOpen, onClose }: WaitlistPopupProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!isOpen || !mounted) return null

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
                onClick={onClose}
            />

            {/* Card */}
            <div className="relative w-full max-w-md bg-gradient-to-b from-[#fafafa] to-[#f7f7f7] shadow-m rounded-[1.5rem] p-6 sm:p-8 border border-white/50 overflow-hidden animate-in zoom-in-95 duration-300 slide-in-from-bottom-4">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-black/5"
                >
                    <X size={20} />
                </button>

                {status === "success" ? (
                    <div className="flex flex-col items-center text-center py-4 animate-in fade-in slide-in-from-bottom-2">
                        <h2 className="text-xl font-bold text-[var(--text)]">You're on the list!</h2>
                        <p className="text-[var(--text-muted)] max-w-[200px]">
                            We'll let you know as soon as spots open up.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-4 px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center group text-md bg-[#a0cbdb] shadow-m text-white hover:text-black hover:bg-white disabled:opacity-70"
                        >
                            Awesome
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 text-[#a0cbdb] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                <UserPlus size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-[var(--text)] mb-2">Join the Waitlist</h2>
                            <p className="text-[var(--text-muted)] leading-relaxed">
                                Be the first to know when SoterCare launches. Early access spots are limited!
                            </p>
                        </div>

                        <form action={async (formData) => {
                            setStatus("loading")
                            await joinWaitlistAction(formData)
                            setStatus("success")
                        }} className="space-y-3">
                            <div className="space-y-3">
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
                                    <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Join Waitlist
                                        <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4">
                                No spam. We promise.
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>,
        document.body
    )
}
