"use client"

import { useEffect, useState, useRef } from "react"
import { useAudio } from "./AudioManager"

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { startAmbient } = useAudio()
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [enterReveal, setEnterReveal] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const revealRafRef = useRef<number | null>(null)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsLoaded(true)
          return 100
        }
        // Increase by random amount, ensuring we reach 100%
        const increment = prev < 90 ? Math.random() * 20 : Math.random() * 10
        return Math.min(prev + increment, 100)
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    revealRafRef.current = requestAnimationFrame(() => {
      revealRafRef.current = requestAnimationFrame(() => {
        setEnterReveal(true)
      })
    })
    return () => {
      if (revealRafRef.current != null) cancelAnimationFrame(revealRafRef.current)
    }
  }, [isLoaded])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isLoaded && e.key === "Enter") {
        startAmbient()
        setIsExiting(true)
        setTimeout(onComplete, 800)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isLoaded, onComplete, startAmbient])

  const handleEnterClick = () => {
    if (isLoaded) {
      startAmbient()
      setIsExiting(true)
      setTimeout(onComplete, 800)
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[100] bg-cave-dark flex flex-col items-center justify-center transition-opacity duration-700 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="font-serif text-5xl md:text-7xl text-ice-white tracking-tight mb-4">
          <span className="text-ice-primary">*</span>LIMINAL
        </h1>
        <p className="text-ice-light/40 text-sm tracking-[0.3em] uppercase">
          A Short Nature Documentary
        </p>
      </div>

      {/* Loading bar */}
      <div className="w-48 h-[1px] bg-ice-primary/20 relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-ice-primary/60 transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Poetic text - shows during and after loading */}
      <div className={`mt-12 text-center max-w-md transition-opacity duration-700 ${
        isLoaded ? "opacity-100" : "opacity-80"
      }`}>
        <p className="text-ice-light/90 text-sm leading-relaxed font-serif italic">
          As if the skies could say:
          <br />
          birds yes, mosquitoes no.
          <br />
          As if it were possible
          <br />
          to pull a single thread from all this
          <br />
          without the whole thing unraveling.
        </p>
      </div>

      {/* Enter prompt - space reserved; reveal delayed by 2 rAF so opacity transition runs */}
      <div className="mt-8 h-12 flex items-center justify-center">
        <button
          type="button"
          onClick={handleEnterClick}
          className={`px-8 py-3 rounded-full border-2 border-ice-primary/40 text-ice-primary/70 hover:border-ice-primary hover:text-ice-primary hover:scale-110 text-base font-mono transition-[opacity,transform,border-color,color] duration-[2000ms] ease-out ${
            enterReveal ? "opacity-100 animate-pulse" : "opacity-0 pointer-events-none"
          }`}
        >
          Enter
        </button>
      </div>
    </div>
  )
}
