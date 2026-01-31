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
  const sfxContextRef = useRef<AudioContext | null>(null)

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

  const playSfx = useCallback(
    (url: string) => {
      if (isMuted) {
        console.log("[SFX] skipped: muted")
        return
      }
      const ctx = sfxContextRef.current
      if (!ctx) {
        console.warn("[SFX] no AudioContext")
        return
      }
      console.log("[SFX] fetch:", url)
      fetch(url)
        .then((r) => {
          console.log("[SFX] response:", r.status, r.statusText, "Content-Type:", r.headers.get("Content-Type"), "Content-Length:", r.headers.get("Content-Length"))
          if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`)
          return r.arrayBuffer()
        })
        .then((buf) => {
          console.log("[SFX] buffer size:", buf.byteLength, "bytes")
          return ctx.decodeAudioData(buf)
        })
        .then((decoded) => {
          console.log("[SFX] decode OK, playing, duration:", decoded.duration.toFixed(2), "s")
          const src = ctx.createBufferSource()
          const gain = ctx.createGain()
          gain.gain.value = 0.25
          src.buffer = decoded
          src.connect(gain)
          gain.connect(ctx.destination)
          src.start(0)
        })
        .catch((err) => {
          console.error("[SFX] failed:", err?.message ?? err, err)
        })
    },
    [isMuted]
  )

  const playEnter = useCallback(() => {
    console.log("[SFX] playEnter called, isMuted:", isMuted)
    if (isMuted) return
    if (!sfxContextRef.current) {
      sfxContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      sfxContextRef.current.resume()
      console.log("[SFX] AudioContext created")
    }
    const base = getSoundsBase()
    const index = (enterIndexRef.current % 5) + 1
    enterIndexRef.current = (enterIndexRef.current + 1) % 5
    const url = `${base}/sounds/enter-${index}.mp3`
    console.log("[SFX] enter URL:", url)
    playSfx(url)
  }, [isMuted, getSoundsBase, playSfx])

  const playExit = useCallback(() => {
    console.log("[SFX] playExit called, isMuted:", isMuted)
    if (isMuted) return
    if (!sfxContextRef.current) {
      sfxContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      sfxContextRef.current.resume()
      console.log("[SFX] AudioContext created")
    }
    const base = getSoundsBase()
    const index = (exitIndexRef.current % 5) + 1
    exitIndexRef.current = (exitIndexRef.current + 1) % 5
    const url = `${base}/sounds/exit-${index}.mp3`
    console.log("[SFX] exit URL:", url)
    playSfx(url)
  }, [isMuted, getSoundsBase, playSfx])

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playEnter, playExit, startAmbient }}>
      {children}
    </AudioContext.Provider>
  )
}
