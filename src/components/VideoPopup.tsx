"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { createPortal } from "react-dom"
import Image from "next/image"

export default function VideoPopup() {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const handleOpenEvent = () => setIsOpen(true)
        window.addEventListener('open-video-popup', handleOpenEvent)

        return () => {
            setMounted(false)
            window.removeEventListener('open-video-popup', handleOpenEvent)
        }
    }, [])

    const handleClose = () => setIsOpen(false)

    if (!mounted || !isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
                onClick={handleClose}
            />

            {/* Card */}
            <div className="relative w-full max-w-[95vw] md:max-w-[85vw] xl:max-w-7xl flex flex-col items-center animate-in zoom-in-95 duration-300 slide-in-from-bottom-4">
                <div className="w-full flex justify-end mb-4 sm:mb-6">
                    {/* White plate close button */}
                    <button
                        onClick={handleClose}
                        aria-label="Close video popup"
                        className="bg-white text-black hover:bg-gray-200 transition-transform active:scale-95 p-3 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] z-50 flex items-center justify-center shrink-0"
                    >
                        <X size={28} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Footer-styled Frame */}
                <div className="relative w-full p-4 sm:p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl">
                    {/* Background layers exactly matching Footer */}
                    <div className="absolute inset-0 z-0 select-none pointer-events-none">
                        <Image
                            src="/assets/testfooter1.png"
                            alt="Background pattern"
                            fill
                            className="object-cover opacity-[0.8]"
                            quality={100}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#0f172a]/80 to-[#0f172a]/95" />
                        <div className="absolute inset-0 border border-white/20 rounded-[1.5rem] md:rounded-[2.5rem]" />
                    </div>

                    {/* Video Container inside the styled frame */}
                    <div className="relative z-10 w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
                        {isOpen && (
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src="https://www.youtube.com/embed/2bcujj8dd_M?autoplay=1"
                                title="SoterCare Demo Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}
