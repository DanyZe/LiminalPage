"use client"

import React from "react"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { CrewSection } from "./sections/CrewSection"
import { VideoSection } from "./sections/VideoSection"
import { IntentSection } from "./sections/IntentSection"
import { IceInfoSection } from "./sections/IceInfoSection"
import { ContactSection } from "./sections/ContactSection"

interface ZoomOverlayProps {
  sectionId: string | null
  onClose: () => void
  onPlayExit?: () => void
  originX: number
  originY: number
}

const sectionComponents: Record<string, React.ComponentType> = {
  crew: CrewSection,
  videos: VideoSection,
  intent: IntentSection,
  "ice-info": IceInfoSection,
  contact: ContactSection,
}

export function ZoomOverlay({
  sectionId,
  onClose,
  onPlayExit,
  originX,
  originY,
}: ZoomOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(false)

  useEffect(() => {
    if (sectionId) {
      // Trigger zoom animation - synced with 1s audio duration
      requestAnimationFrame(() => {
        setIsVisible(true)
        // Delay content appearance to match audio (1000ms)
        setTimeout(() => setIsContentVisible(true), 1000)
      })
    } else {
      setIsContentVisible(false)
      setIsVisible(false)
    }
  }, [sectionId])

  const handleClose = () => {
    // Play exit SFX synchronously with the click so browser allows audio (user gesture)
    onPlayExit?.()
    setIsContentVisible(false)
    setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 400)
    }, 200)
  }

  if (!sectionId) return null

  const SectionComponent = sectionComponents[sectionId]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{
        transformOrigin: `${originX}% ${originY}%`,
      }}
    >
      {/* Backdrop with blur */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "rgba(12, 25, 41, 0.85)",
          backdropFilter: "blur(8px)",
        }}
        onClick={handleClose}
      />

      {/* Card container - 1s animation to sync with audio */}
      <div
        className={`relative w-full max-w-5xl max-h-[85vh] overflow-hidden transition-all duration-1000 ease-out ${
          isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
        style={{
          transformOrigin: `${originX}% ${originY}%`,
        }}
      >
        {/* Card with ice cave aesthetic */}
        <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 border border-cyan-500/20 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Top gradient accent */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className={`absolute top-4 right-4 z-10 p-2.5 rounded-lg bg-slate-800/80 border border-cyan-500/20 hover:border-cyan-400/40 hover:bg-slate-700/80 transition-all duration-300 group ${
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
            aria-label="Close"
          >
            <X className="w-4 h-4 text-cyan-200/70 group-hover:text-cyan-100 transition-colors" />
          </button>

          {/* Back indicator */}
          <button
            type="button"
            onClick={handleClose}
            className={`absolute top-5 left-5 z-10 text-cyan-300/60 hover:text-cyan-200 transition-all duration-300 text-xs font-mono tracking-wide ${
              isContentVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            ← ESC
          </button>

          {/* Content container - scrollable */}
          <div
            className={`overflow-y-auto max-h-[85vh] p-8 md:p-12 transition-all duration-500 ${
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {SectionComponent && <SectionComponent />}
          </div>

          {/* Bottom gradient accent */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
        </div>
      </div>
    </div>
  )
}
