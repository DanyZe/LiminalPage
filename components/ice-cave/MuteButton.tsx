"use client"

import { Volume2, VolumeX } from "lucide-react"
import { useAudio } from "./AudioManager"

export function MuteButton() {
  const { isMuted, toggleMute } = useAudio()

  return (
    <button
      type="button"
      onClick={toggleMute}
      className="fixed top-6 right-6 z-50 group"
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
    >
      <div className="relative">
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-300"
          style={{
            background: isMuted
              ? "radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)",
            filter: "blur(12px)",
            transform: "scale(1.2)",
          }}
        />
        
        {/* Button container */}
        <div
          className={`relative p-3.5 rounded-full backdrop-blur-md transition-all duration-300 border ${
            isMuted
              ? "bg-slate-900/80 border-red-500/40 hover:border-red-400/60"
              : "bg-slate-900/80 border-cyan-500/40 hover:border-cyan-400/60"
          }`}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-red-400 transition-colors" />
          ) : (
            <Volume2 className="w-5 h-5 text-cyan-300 transition-colors" />
          )}
        </div>

        {/* Pulse rings when unmuted */}
        {!isMuted && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping" />
            <div
              className="absolute inset-0 rounded-full border border-cyan-400/20"
              style={{
                animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
                animationDelay: "0.5s",
              }}
            />
          </>
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-slate-900/95 border border-cyan-500/30 rounded-lg px-3 py-1.5 backdrop-blur-md">
          <span className="text-xs text-cyan-200 font-mono whitespace-nowrap">
            {isMuted ? "Sound Off" : "Sound On"}
          </span>
        </div>
      </div>
    </button>
  )
}
