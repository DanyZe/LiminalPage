"use client"

import React from "react"

import { useState, useEffect } from "react"

export function PositioningGrid() {
  const [isVisible, setIsVisible] = useState(true)
  const [showCoords, setShowCoords] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Toggle grid with 'G' key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "g" || e.key === "G") {
        setIsVisible((prev) => !prev)
      }
      if (e.key === "c" || e.key === "C") {
        setShowCoords((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    setMousePos({ x, y })
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-[9999] bg-black/80 px-3 py-2 rounded-lg border border-cyan-500/40 text-cyan-300 text-xs font-mono">
        Press <kbd className="bg-cyan-900/50 px-1.5 py-0.5 rounded">G</kbd> to
        show grid
      </div>
    )
  }

  return (
    <>
      {/* Grid overlay */}
      <div
        className="fixed inset-0 z-[9998] pointer-events-none"
        onMouseMove={handleMouseMove}
      >
        {/* Vertical lines - 10% increments */}
        {Array.from({ length: 11 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${i * 10}%`,
              background:
                i % 5 === 0
                  ? "rgba(6, 182, 212, 0.4)"
                  : "rgba(6, 182, 212, 0.15)",
            }}
          >
            {i % 2 === 0 && (
              <span className="absolute top-2 -translate-x-1/2 text-cyan-400 text-[10px] font-mono bg-black/60 px-1 rounded">
                {i * 10}
              </span>
            )}
          </div>
        ))}

        {/* Horizontal lines - 10% increments */}
        {Array.from({ length: 11 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${i * 10}%`,
              background:
                i % 5 === 0
                  ? "rgba(6, 182, 212, 0.4)"
                  : "rgba(6, 182, 212, 0.15)",
            }}
          >
            {i % 2 === 0 && (
              <span className="absolute left-2 -translate-y-1/2 text-cyan-400 text-[10px] font-mono bg-black/60 px-1 rounded">
                {i * 10}
              </span>
            )}
          </div>
        ))}

        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-px bg-red-500/60" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-px bg-red-500/60" />
        </div>
      </div>

      {/* Mouse position indicator */}
      {showCoords && (
        <div
          className="fixed z-[9999] pointer-events-none bg-black/90 px-3 py-2 rounded-lg border border-cyan-500 shadow-lg"
          style={{
            left: "50%",
            top: "20px",
            transform: "translateX(-50%)",
          }}
        >
          <div className="text-cyan-300 text-sm font-mono font-semibold">
            x: <span className="text-cyan-100">{mousePos.x}</span>, y:{" "}
            <span className="text-cyan-100">{mousePos.y}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="fixed bottom-4 left-4 z-[9999] bg-black/80 px-4 py-3 rounded-lg border border-cyan-500/40 space-y-1">
        <div className="text-cyan-300 text-xs font-mono">
          <kbd className="bg-cyan-900/50 px-1.5 py-0.5 rounded mr-1">G</kbd>
          Hide grid
        </div>
        <div className="text-cyan-300 text-xs font-mono">
          <kbd className="bg-cyan-900/50 px-1.5 py-0.5 rounded mr-1">C</kbd>
          Toggle coords
        </div>
        <div className="text-cyan-400/70 text-[10px] mt-2">
          Hover to see x,y position
        </div>
      </div>
    </>
  )
}
