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
  
  // Preload all audio files
  const enterSoundsRef = useRef<HTMLAudioElement[]>([])
  const exitSoundsRef = useRef<HTMLAudioElement[]>([])
  const ambientRef = useRef<HTMLAudioElement | null>(null)
  const hasFadedInRef = useRef(false)
  
  // Track currently playing audio for fade out
  const currentlyPlayingEnterRef = useRef<HTMLAudioElement | null>(null)
  const currentlyPlayingExitRef = useRef<HTMLAudioElement | null>(null)
  const enterFadeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const exitFadeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Use full URL so paths resolve correctly (static export, basePath, etc.)
    const base =
      typeof window !== "undefined" ? window.location.origin : ""
    const s = (path: string) => `${base}${path}`

    enterSoundsRef.current = [
      new Audio(s("/sounds/enter-1.mp3")),
      new Audio(s("/sounds/enter-2.mp3")),
      new Audio(s("/sounds/enter-3.mp3")),
      new Audio(s("/sounds/enter-4.mp3")),
      new Audio(s("/sounds/enter-5.mp3")),
    ]

    exitSoundsRef.current = [
      new Audio(s("/sounds/exit-1.mp3")),
      new Audio(s("/sounds/exit-2.mp3")),
      new Audio(s("/sounds/exit-3.mp3")),
      new Audio(s("/sounds/exit-4.mp3")),
      new Audio(s("/sounds/exit-5.mp3")),
    ]

    enterSoundsRef.current.forEach((audio) => {
      audio.volume = 0
      audio.preload = "auto"
    })
    exitSoundsRef.current.forEach((audio) => {
      audio.volume = 0
      audio.preload = "auto"
    })

    // Ambient (same URL pattern so it stays consistent)
    ambientRef.current = new Audio(s("/sounds/ambient.mp3"))
    ambientRef.current.loop = true
    ambientRef.current.volume = 0
    ambientRef.current.preload = "auto"

    return () => {
      // Cleanup on unmount
      if (enterFadeIntervalRef.current) clearInterval(enterFadeIntervalRef.current)
      if (exitFadeIntervalRef.current) clearInterval(exitFadeIntervalRef.current)
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
    console.log("[v0] playEnter called, isMuted:", isMuted)
    if (isMuted) return
    
    // Fade out currently playing enter sound if any
    if (currentlyPlayingEnterRef.current && !currentlyPlayingEnterRef.current.paused) {
      if (enterFadeIntervalRef.current) clearInterval(enterFadeIntervalRef.current)
      fadeOut(currentlyPlayingEnterRef.current, 200)
    }
    
    const audio = enterSoundsRef.current[enterIndexRef.current]
    console.log("[v0] Playing enter sound index:", enterIndexRef.current, "audio:", !!audio)
    if (audio) {
      audio.currentTime = 0
      audio.volume = 0
      audio.play().then(() => {
        console.log("[v0] Enter sound playing successfully")
        // Fade in over 200ms
        enterFadeIntervalRef.current = fadeIn(audio, 0.25, 200)
        currentlyPlayingEnterRef.current = audio
      }).catch((err) => {
        console.log("[v0] Enter sound failed:", err.message)
      })
    }
    
    // Cycle to next sound
    enterIndexRef.current = (enterIndexRef.current + 1) % 5
  }, [isMuted, fadeIn, fadeOut])

  const playExit = useCallback(() => {
    console.log("[v0] playExit called, isMuted:", isMuted)
    if (isMuted) return
    
    // Fade out currently playing exit sound if any
    if (currentlyPlayingExitRef.current && !currentlyPlayingExitRef.current.paused) {
      if (exitFadeIntervalRef.current) clearInterval(exitFadeIntervalRef.current)
      fadeOut(currentlyPlayingExitRef.current, 200)
    }
    
    const audio = exitSoundsRef.current[exitIndexRef.current]
    console.log("[v0] Playing exit sound index:", exitIndexRef.current, "audio:", !!audio)
    if (audio) {
      audio.currentTime = 0
      audio.volume = 0
      audio.play().then(() => {
        console.log("[v0] Exit sound playing successfully")
        // Fade in over 200ms
        exitFadeIntervalRef.current = fadeIn(audio, 0.25, 200)
        currentlyPlayingExitRef.current = audio
      }).catch((err) => {
        console.log("[v0] Exit sound failed:", err.message)
      })
    }
    
    // Cycle to next sound
    exitIndexRef.current = (exitIndexRef.current + 1) % 5
  }, [isMuted, fadeIn, fadeOut])

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playEnter, playExit, startAmbient }}>
      {children}
    </AudioContext.Provider>
  )
}
