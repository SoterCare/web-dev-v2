"use client"

import { useState, useEffect } from "react"
import { contactAction } from "@/app/actions"
import { X, Send, CheckCircle, Loader2, MessageSquare } from "lucide-react"

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
                onClick={handleClose}
            />

            {/* Card */}
            <div className="relative w-full max-w-md bg-gradient-to-b from-[#fafafa] to-[#f7f7f7] shadow-m rounded-[1.5rem] p-6 sm:p-8 border border-white/50 overflow-hidden animate-in zoom-in-95 duration-300 slide-in-from-bottom-4">
                <button
                    onClick={handleClose}
                    aria-label="Close contact popup"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-black/5"
                >
                    <X size={20} />
                </button>

                {status === "success" ? (
                    <div className="flex flex-col items-center text-center py-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="w-14 h-14 rounded-full bg-[#a0cbdb]/10 flex items-center justify-center mb-4">
                            <CheckCircle size={28} className="text-[#a0cbdb]" />
                        </div>
                        <h2 className="text-xl font-extrabold text-[var(--text)] leading-[1.1] tracking-tight">
                            Message Sent!
                        </h2>
                        <p className="text-[var(--text-muted)] max-w-[260px] mt-2 leading-relaxed">
                            Thank you for reaching out. A team member will get back to you soon.
                        </p>
                        <button
                            onClick={handleClose}
                            className="mt-6 px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center group text-md bg-[#a0cbdb] shadow-m text-white hover:text-black hover:bg-white disabled:opacity-70"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 text-[#a0cbdb] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                <MessageSquare size={24} />
                            </div>
                            <h2 className="text-2xl font-extrabold text-[var(--text)] mb-1 leading-[1.1] tracking-tight">Send a Message</h2>
                            <p className="text-[var(--text-muted)] leading-relaxed">
                                Have a question or feedback? We&apos;d love to hear from you.
                            </p>
                        </div>

                        <form onSubmit={async (e) => {
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
                        }} className="space-y-3">
                            <input
                                name="name"
                                type="text"
                                placeholder="Your name"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a0cbdb]/30 focus:border-[#a0cbdb] transition-all placeholder:text-gray-400 text-gray-800"
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a0cbdb]/30 focus:border-[#a0cbdb] transition-all placeholder:text-gray-400 text-gray-800"
                            />
                            <textarea
                                name="message"
                                placeholder="Your message..."
                                required
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a0cbdb]/30 focus:border-[#a0cbdb] transition-all placeholder:text-gray-400 text-gray-800 resize-none"
                            />

                            {status === "error" && errorMsg && (
                                <p className="text-red-500 text-sm text-center">{errorMsg}</p>
                            )}

                            <button
                                disabled={status === "loading"}
                                className="w-full py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center group text-md bg-[#a0cbdb] shadow-m text-white hover:text-black hover:bg-white disabled:opacity-70"
                            >
                                {status === "loading" ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <Send size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
