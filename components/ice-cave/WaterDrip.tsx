"use client"

import { useEffect, useState } from "react"

interface Drip {
  id: number
  x: number
  delay: number
  duration: number
}

export function WaterDrip() {
  const [drips, setDrips] = useState<Drip[]>([])

  useEffect(() => {
    // Create initial drips - balanced between visibility and subtlety
    const initialDrips: Drip[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90, // Spread across entire width
      delay: Math.random() * 6, // Medium delay for balanced frequency
      duration: 1.8 + Math.random() * 2.2, // Medium speeds
    }))
    setDrips(initialDrips)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {drips.map((drip) => (
        <div
          key={drip.id}
          className="absolute top-0"
          style={{ left: `${drip.x}%` }}
        >
          {/* The drip - balanced visibility */}
          <div
            className="w-[2.5px] h-[2.5px] bg-cyan-300/70 rounded-full animate-drip shadow-md"
            style={{
              animationDelay: `${drip.delay}s`,
              animationDuration: `${drip.duration}s`,
              boxShadow: "0 0 3px rgba(34, 211, 238, 0.5)",
            }}
          />
          {/* Splash effect at bottom - balanced visibility */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-300/40 rounded-full animate-splash"
            style={{
              animationDelay: `${drip.delay + drip.duration - 0.1}s`,
              animationDuration: `${drip.duration}s`,
              boxShadow: "0 0 4px rgba(34, 211, 238, 0.35)",
            }}
          />
        </div>
      ))}

      <style jsx>{`
        @keyframes drip {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          5% {
            opacity: 0.8;
          }
          95% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        @keyframes splash {
          0%,
          90% {
            transform: translateX(-50%) scale(0);
            opacity: 0;
          }
          95% {
            transform: translateX(-50%) scale(1.5);
            opacity: 0.6;
          }
          100% {
            transform: translateX(-50%) scale(2);
            opacity: 0;
          }
        }
        .animate-drip {
          animation: drip linear infinite;
        }
        .animate-splash {
          animation: splash linear infinite;
        }
      `}</style>
    </div>
  )
}
