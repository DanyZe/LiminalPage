"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { WaterDrip } from "./WaterDrip"
import { IceParticles } from "./IceParticles"
import { Hotspot } from "./Hotspot"
import { ZoomOverlay } from "./ZoomOverlay"
import { MuteButton } from "./MuteButton"
import { useAudio } from "./AudioManager"

interface HotspotData {
  id: string
  x: number
  y: number
  label: string
  size?: number
  color?: string
  animDelay?: number
  tabletX?: number
  tabletY?: number
  mobileX?: number
  mobileY?: number
  accent?: boolean
}

// Hotspots with responsive positioning
const hotspots: HotspotData[] = [
  { 
    id: "videos", 
    x: 40, y: 60, 
    label: "Our Work", 
    size: 85, 
    color: "blue", 
    animDelay: 0,
    mobileX: 25, 
    mobileY: 64,
  },
  { 
    id: "intent", 
    x: 52, y: 41, 
    label: "Letter of Intent", 
    size: 75, 
    color: "indigo", 
    animDelay: 0.8,
    mobileX: 58,
    mobileY: 48,
  },
  { 
    id: "crew", 
    x: 10, y: 90, 
    label: "The Team", 
    size: 70, 
    color: "blue", 
    animDelay: 1.6,
    tabletY: 82,
    mobileY: 83,
    accent: true,
  },
  { 
    id: "contact", 
    x: 85, y: 90, 
    label: "Contact", 
    size: 68, 
    color: "indigo", 
    animDelay: 1.2,
    tabletY: 82,
    mobileY: 83,
    accent: true,
  },
  { 
    id: "ice-info", 
    x: 30, y: 10, 
    label: "The Vanishing Ice", 
    size: 72, 
    color: "cyan", 
    animDelay: 0.4,
    tabletX: 40,
    mobileY: 18,
    accent: true,
  },
]

export function CaveScene() {
  const { playEnter, playExit } = useAudio()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [visitedSections, setVisitedSections] = useState<Set<string>>(new Set())
  const [clickOrigin, setClickOrigin] = useState({ x: 50, y: 50 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Intro animation
    const timer = setTimeout(() => setIsLoaded(true), 500)
    // Hide hint after first interaction or after 8 seconds
    const hintTimer = setTimeout(() => setShowHint(false), 8000)
    return () => {
      clearTimeout(timer)
      clearTimeout(hintTimer)
    }
  }, [])

  const handleHotspotClick = (id: string) => {
    const hotspot = hotspots.find((h) => h.id === id)
    if (hotspot) {
      // Play enter sound
      playEnter()
      setClickOrigin({ x: hotspot.x, y: hotspot.y })
      setActiveSection(id)
      setVisitedSections((prev) => new Set([...prev, id]))
      setShowHint(false)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current && !activeSection) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      setMousePosition({ x, y })
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-cave-dark"
      onMouseMove={handleMouseMove}
    >
      {/* Main background image with parallax */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
        style={{
          transform: `translate(${(mousePosition.x - 0.5) * -15}px, ${(mousePosition.y - 0.5) * -15}px) scale(1.05)`,
          transition: activeSection
            ? "transform 0.7s ease-out, opacity 1s"
            : "transform 0.3s ease-out, opacity 1s",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/cave-main.jpg"
          alt="Ice cave interior with dramatic blue ice formations and tunnel leading to light"
          className="w-full h-full object-cover"
        />
        {/* Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-cave-dark/60 via-transparent to-cave-dark/30" />
      </div>

      {/* Ambient effects */}
      <WaterDrip />
      <IceParticles />

      {/* Hotspots - Fixed absolute layer (doesn't move with parallax) */}
      <div
        className={`fixed inset-0 transition-opacity duration-500 pointer-events-none z-30 ${
          activeSection ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute w-full h-full pointer-events-auto">
          {hotspots.map((hotspot) => (
            <Hotspot
              key={hotspot.id}
              {...hotspot}
              onClick={handleHotspotClick}
            />
          ))}
        </div>
      </div>

      {/* Title overlay */}
      <div
        className={`absolute top-8 left-8 z-20 transition-all duration-700 ${
          isLoaded && !activeSection
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4"
        }`}
      >
        <h1 className="font-serif text-4xl md:text-5xl text-ice-white tracking-tight">
          <span className="text-ice-primary">*</span>LIMINAL
        </h1>
        <p className="text-ice-light/60 text-sm mt-1 tracking-wide">
          A Short Nature Documentary
        </p>
      </div>

      {/* Explore hint - subtle, fades quickly since hotspots are obvious */}
      <div
        className={`absolute bottom-24 left-1/2 -translate-x-1/2 z-20 transition-all duration-1000 ${
          showHint && isLoaded && !activeSection
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <p className="text-cyan-200/70 text-xs tracking-[0.3em] uppercase">
          Click to explore
        </p>
      </div>

      {/* Progress indicator */}
      <div
        className={`absolute bottom-8 right-8 z-20 flex gap-2 transition-all duration-500 ${
          isLoaded && !activeSection ? "opacity-100" : "opacity-0"
        }`}
      >
        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              visitedSections.has(hotspot.id)
                ? "bg-ice-primary border border-ice-primary"
                : "border border-ice-light/30"
            }`}
            title={hotspot.label}
          />
        ))}
      </div>

      {/* Mute button */}
      <MuteButton />

      {/* Zoom overlay */}
      <ZoomOverlay
        sectionId={activeSection}
        onClose={() => setActiveSection(null)}
        onPlayExit={playExit}
        originX={clickOrigin.x}
        originY={clickOrigin.y}
      />
    </div>
  )
}
