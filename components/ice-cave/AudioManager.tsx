"use client"

import React from "react"

import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react"

interface AudioContextType {
  isMuted: boolean
  toggleMute: () => void
  playEnter: () => void
  playExit: () => void
  startAmbient: () => void
  fadeAmbientOut: (durationMs?: number) => void
  fadeAmbientIn: (durationMs?: number) => void
}

const AudioContext = createContext<AudioContextType>({
  isMuted: false,
  toggleMute: () => {},
  playEnter: () => {},
  playExit: () => {},
  startAmbient: () => {},
  fadeAmbientOut: () => {},
  fadeAmbientIn: () => {},
})

export function useAudio() {
  return useContext(AudioContext)
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)
  const enterIndexRef = useRef(0)
  const exitIndexRef = useRef(0)

  const ambientRef = useRef<HTMLAudioElement | null>(null)
  const hasFadedInRef = useRef(false)
  const ambientFadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getSoundsBase = useCallback(() => {
    if (typeof window === "undefined") return ""
    return (
      (process.env.NEXT_PUBLIC_SOUNDS_BASE as string | undefined) ||
      window.location.origin
    )
  }, [])

  useEffect(() => {
    const base = getSoundsBase()
    // Single SFX elements — no src until play (set in user gesture, like ambient’s first play)
    ambientRef.current = new Audio(`${base}/sounds/ambient.mp3`)
    ambientRef.current.loop = true
    ambientRef.current.volume = 0
    ambientRef.current.preload = "auto"

    return () => {
      ambientRef.current?.pause()
      ambientRef.current = null
    }
  }, [getSoundsBase])

  const startAmbient = useCallback(() => {
    // Start ambient with 10s fade-in (only once, triggered by user action)
    if (!hasFadedInRef.current && ambientRef.current) {
      hasFadedInRef.current = true
      ambientRef.current.play().catch((err) => {
        console.warn("[Audio] Ambient failed:", err.message)
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

  const clearAmbientFade = useCallback(() => {
    if (ambientFadeIntervalRef.current) {
      clearInterval(ambientFadeIntervalRef.current)
      ambientFadeIntervalRef.current = null
    }
  }, [])

  const fadeAmbientOut = useCallback((durationMs = 800) => {
    clearAmbientFade()
    if (!ambientRef.current || isMuted) return
    const el = ambientRef.current
    const startVolume = el.volume
    const steps = 40
    const stepDuration = durationMs / steps
    const volumeStep = startVolume / steps
    let step = 0
    ambientFadeIntervalRef.current = setInterval(() => {
      step++
      if (step >= steps || !ambientRef.current) {
        clearAmbientFade()
        if (ambientRef.current) ambientRef.current.volume = 0
        return
      }
      if (ambientRef.current) {
        ambientRef.current.volume = Math.max(0, startVolume - volumeStep * step)
      }
    }, stepDuration)
  }, [isMuted, clearAmbientFade])

  const fadeAmbientIn = useCallback((durationMs = 5000) => {
    clearAmbientFade()
    if (!ambientRef.current || isMuted) return
    const targetVolume = 0.25
    const steps = 100
    const stepDuration = durationMs / steps
    const volumeIncrement = targetVolume / steps
    let step = 0
    ambientRef.current.volume = 0
    ambientRef.current.play().catch(() => {})
    ambientFadeIntervalRef.current = setInterval(() => {
      step++
      if (step >= steps || !ambientRef.current) {
        clearAmbientFade()
        if (ambientRef.current) ambientRef.current.volume = targetVolume
        return
      }
      if (ambientRef.current) {
        ambientRef.current.volume = Math.min(volumeIncrement * step, targetVolume)
      }
    }, stepDuration)
  }, [isMuted, clearAmbientFade])

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

  const playSfx = useCallback(
    (oggUrl: string, mp3Url: string) => {
      if (isMuted) return
      const q = "?v=2"
      const ogg = oggUrl + q
      const mp3 = mp3Url + q
      const audioOgg = new Audio(ogg)
      const audioMp3 = new Audio(mp3)
      audioOgg.volume = 0.25
      audioMp3.volume = 0.25
      const stopOther = (winner: HTMLAudioElement) => {
        if (winner === audioOgg) audioMp3.pause()
        else audioOgg.pause()
      }
      audioOgg.addEventListener("playing", () => stopOther(audioOgg), { once: true })
      audioMp3.addEventListener("playing", () => stopOther(audioMp3), { once: true })
      audioOgg.play().catch(() => {})
      audioMp3.play().catch(() => {})
    },
    [isMuted]
  )

  const playEnter = useCallback(() => {
    if (isMuted) return
    const base = getSoundsBase()
    const index = (enterIndexRef.current % 5) + 1
    enterIndexRef.current = (enterIndexRef.current + 1) % 5
    playSfx(`${base}/sounds/enter-${index}.ogg`, `${base}/sounds/enter-${index}.mp3`)
  }, [isMuted, getSoundsBase, playSfx])

  const playExit = useCallback(() => {
    if (isMuted) return
    const base = getSoundsBase()
    const index = (exitIndexRef.current % 5) + 1
    exitIndexRef.current = (exitIndexRef.current + 1) % 5
    playSfx(`${base}/sounds/exit-${index}.ogg`, `${base}/sounds/exit-${index}.mp3`)
  }, [isMuted, getSoundsBase, playSfx])

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playEnter, playExit, startAmbient, fadeAmbientOut, fadeAmbientIn }}>
      {children}
    </AudioContext.Provider>
  )
}
