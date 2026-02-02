"use client"

import Image from "next/image"

export function IntentSection() {
  return (
    <div className="w-full max-w-3xl mx-auto px-6">
      <h2 className="font-serif text-2xl md:text-3xl text-ice-white mb-3 text-center tracking-tight">
        Letter of Intent
      </h2>

      {/* Poster Image - zoomed out slightly so borders aren't clipped */}
      <div className="mb-4 rounded-xl overflow-hidden border border-cyan-500/20 max-w-[280px] mx-auto p-3 bg-cave-dark/30 flex items-center justify-center">
        <Image
          src="/images/liminal-poster.png"
          alt="Liminal - A short nature documentary poster"
          width={300}
          height={400}
          className="w-[90%] h-auto object-contain"
        />
      </div>

      {/* Single paragraph text - center aligned */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/30 via-slate-900/40 to-indigo-950/30 border border-cyan-500/20 backdrop-blur-sm">
        <p className="text-sm text-ice-light/85 leading-relaxed text-center">
          There is no certainty. No permanence. No stability. These realizations birthed our project—a personal audiovisual exploration of impermanence, change, and time sparked by encounters with Iceland's vanishing ice caves. We treat the melting caves as living witnesses to time and disappearance, asking what it means to document beauty that may not exist by the time audiences see this film. Through intimate audiovisual language, the film becomes a sensory time capsule—an unhurried, sincere gaze at natural wonder on the verge of vanishing.
        </p>
      </div>
    </div>
  )
}
