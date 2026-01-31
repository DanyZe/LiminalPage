"use client"

import React from "react"

import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react"

interface AudioContextType {
  isMuted: boolean
  toggleMute: () => void
  playEnter: () => void
  playExit: () => void
  startAmbient: () => void
}

const AudioContext = createContext<AudioContextType>({
  isMuted: false,
  toggleMute: () => {},
  playEnter: () => {},
  playExit: () => {},
  startAmbient: () => {},
})

export function useAudio() {
  return useContext(AudioContext)
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)
  const enterIndexRef = useRef(0)
  const exitIndexRef = useRef(0)

  // One element per type (like ambient) — set src at play time so browser loads in user gesture
  const enterSfxRef = useRef<HTMLAudioElement | null>(null)
  const exitSfxRef = useRef<HTMLAudioElement | null>(null)
  const ambientRef = useRef<HTMLAudioElement | null>(null)
  const hasFadedInRef = useRef(false)

  const enterFadeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const exitFadeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const base =
      typeof window !== "undefined" ? window.location.origin : ""
    const s = (path: string) => `${base}${path}`

    // Single SFX elements — no src until play (set in user gesture, like ambient’s first play)
    enterSfxRef.current = new Audio()
    enterSfxRef.current.volume = 0
    exitSfxRef.current = new Audio()
    exitSfxRef.current.volume = 0

    ambientRef.current = new Audio(s("/sounds/ambient.mp3"))
    ambientRef.current.loop = true
    ambientRef.current.volume = 0
    ambientRef.current.preload = "auto"

    return () => {
      if (enterFadeIntervalRef.current) clearInterval(enterFadeIntervalRef.current)
      if (exitFadeIntervalRef.current) clearInterval(exitFadeIntervalRef.current)
      enterSfxRef.current?.pause()
      enterSfxRef.current = null
      exitSfxRef.current?.pause()
      exitSfxRef.current = null
      ambientRef.current?.pause()
      ambientRef.current = null
    }
  }, [])

  const startAmbient = useCallback(() => {
    console.log("[v0] startAmbient called, hasFadedIn:", hasFadedInRef.current, "ambientRef:", !!ambientRef.current)
    // Start ambient with 10s fade-in (only once, triggered by user action)
    if (!hasFadedInRef.current && ambientRef.current) {
      hasFadedInRef.current = true
      
      console.log("[v0] Attempting to play ambient audio")
      ambientRef.current.play().then(() => {
        console.log("[v0] Ambient audio playing successfully")
      }).catch((err) => {
        console.log("[v0] Ambient audio failed:", err.message)
      })

      // Fade in over 10 seconds
      const fadeInDuration = 10000
      const targetVolume = 0.25
      const steps = 100
      const stepDuration = fadeInDuration / steps
      const volumeIncrement = targetVolume / steps
      let currentStep = 0

      const fadeInterval = setInterval(() => {
        if (currentStep >= steps || !ambientRef.current) {
          clearInterval(fadeInterval)
          return
        }
        currentStep++
        if (ambientRef.current) {
          ambientRef.current.volume = Math.min(volumeIncrement * currentStep, targetVolume)
        }
      }, stepDuration)
    }
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev
      // Control ambient audio
      if (ambientRef.current) {
        if (newMuted) {
          ambientRef.current.pause()
        } else {
          ambientRef.current.play().catch(() => {})
        }
      }
      return newMuted
    })
  }, [])

  const fadeOut = useCallback((audio: HTMLAudioElement, duration: number, onComplete?: () => void) => {
    const steps = 10
    const stepDuration = duration / steps
    const volumeDecrement = audio.volume / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      if (currentStep >= steps || audio.volume <= 0) {
        clearInterval(interval)
        audio.pause()
        audio.currentTime = 0
        audio.volume = 0
        if (onComplete) onComplete()
        return
      }
      audio.volume = Math.max(audio.volume - volumeDecrement, 0)
    }, stepDuration)

    return interval
  }, [])

  const fadeIn = useCallback((audio: HTMLAudioElement, targetVolume: number, duration: number) => {
    const steps = 10
    const stepDuration = duration / steps
    const volumeIncrement = targetVolume / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      if (currentStep >= steps || audio.volume >= targetVolume) {
        clearInterval(interval)
        audio.volume = targetVolume
        return
      }
      audio.volume = Math.min(audio.volume + volumeIncrement, targetVolume)
    }, stepDuration)

    return interval
  }, [])

  const playEnter = useCallback(() => {
    if (isMuted) return
    const audio = enterSfxRef.current
    if (!audio) return

    if (enterFadeIntervalRef.current) clearInterval(enterFadeIntervalRef.current)
    if (!audio.paused) fadeOut(audio, 200)

    const index = (enterIndexRef.current % 5) + 1
    enterIndexRef.current = (enterIndexRef.current + 1) % 5
    const base = typeof window !== "undefined" ? window.location.origin : ""
    audio.src = `${base}/sounds/enter-${index}.mp3`
    audio.currentTime = 0
    audio.volume = 0
    audio.play().then(() => {
      enterFadeIntervalRef.current = fadeIn(audio, 0.25, 200)
    }).catch(() => {})
  }, [isMuted, fadeIn, fadeOut])

  const playExit = useCallback(() => {
    if (isMuted) return
    const audio = exitSfxRef.current
    if (!audio) return

    if (exitFadeIntervalRef.current) clearInterval(exitFadeIntervalRef.current)
    if (!audio.paused) fadeOut(audio, 200)

    const index = (exitIndexRef.current % 5) + 1
    exitIndexRef.current = (exitIndexRef.current + 1) % 5
    const base = typeof window !== "undefined" ? window.location.origin : ""
    audio.src = `${base}/sounds/exit-${index}.mp3`
    audio.currentTime = 0
    audio.volume = 0
    audio.play().then(() => {
      exitFadeIntervalRef.current = fadeIn(audio, 0.25, 200)
    }).catch(() => {})
  }, [isMuted, fadeIn, fadeOut])

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playEnter, playExit, startAmbient }}>
      {children}
    </AudioContext.Provider>
  )
}
