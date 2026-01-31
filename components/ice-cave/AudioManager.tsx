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

  const ambientRef = useRef<HTMLAudioElement | null>(null)
  const hasFadedInRef = useRef(false)

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

  const tryOneSfxUrl = useCallback((url: string): Promise<void> => {
    const audio = new Audio(url)
    audio.volume = 0.25
    return audio.play().then(() => {})
  }, [])

  const logServerResponse = useCallback((label: string, url: string) => {
    fetch(url, { method: "HEAD" }).then((r) => {
      const ct = r.headers.get("Content-Type") ?? "none"
      console.warn(`[SFX] ${label} server response: ${r.status} Content-Type: ${ct}`)
    }).catch(() => {})
  }, [])

  const playSfx = useCallback(
    (oggUrl: string, mp3Url: string) => {
      if (isMuted) return
      tryOneSfxUrl(oggUrl).catch((oggErr) => {
        console.warn("[SFX] OGG failed:", (oggErr as Error)?.message ?? oggErr)
        logServerResponse("OGG", oggUrl)
        return tryOneSfxUrl(mp3Url)
      }).catch((mp3Err) => {
        console.error("[SFX] MP3 failed:", (mp3Err as Error)?.message ?? mp3Err)
        logServerResponse("MP3", mp3Url)
      })
    },
    [isMuted, tryOneSfxUrl, logServerResponse]
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
    <AudioContext.Provider value={{ isMuted, toggleMute, playEnter, playExit, startAmbient }}>
      {children}
    </AudioContext.Provider>
  )
}
