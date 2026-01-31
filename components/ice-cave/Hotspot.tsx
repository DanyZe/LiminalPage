"use client"

import React from "react"

import { useState } from "react"

interface HotspotProps {
  id: string
  x: number
  y: number
  size?: number
  label: string
  color?: string
  animDelay?: number
  tabletX?: number
  tabletY?: number
  mobileX?: number
  mobileY?: number
  onClick: (id: string) => void
}

const colorVariants = {
  cyan: {
    primary: "rgba(34, 211, 238, 0.7)",
    secondary: "rgba(165, 243, 252, 0.5)",
    glow: "rgba(34, 211, 238, 0.4)",
    glowHover: "rgba(34, 211, 238, 0.7)",
    text: "text-cyan-100",
    labelBg: "rgba(8, 47, 73, 0.9)",
    labelBorder: "rgba(103, 232, 249, 0.5)",
  },
  sky: {
    primary: "rgba(56, 189, 248, 0.7)",
    secondary: "rgba(186, 230, 253, 0.5)",
    glow: "rgba(56, 189, 248, 0.4)",
    glowHover: "rgba(56, 189, 248, 0.7)",
    text: "text-sky-100",
    labelBg: "rgba(8, 47, 73, 0.9)",
    labelBorder: "rgba(125, 211, 252, 0.5)",
  },
  blue: {
    primary: "rgba(96, 165, 250, 0.7)",
    secondary: "rgba(191, 219, 254, 0.5)",
    glow: "rgba(96, 165, 250, 0.4)",
    glowHover: "rgba(96, 165, 250, 0.7)",
    text: "text-blue-100",
    labelBg: "rgba(8, 47, 73, 0.9)",
    labelBorder: "rgba(147, 197, 253, 0.5)",
  },
  teal: {
    primary: "rgba(45, 212, 191, 0.7)",
    secondary: "rgba(153, 246, 228, 0.5)",
    glow: "rgba(45, 212, 191, 0.4)",
    glowHover: "rgba(45, 212, 191, 0.7)",
    text: "text-teal-100",
    labelBg: "rgba(8, 47, 73, 0.9)",
    labelBorder: "rgba(94, 234, 212, 0.5)",
  },
  indigo: {
    primary: "rgba(129, 140, 248, 0.7)",
    secondary: "rgba(199, 210, 254, 0.5)",
    glow: "rgba(129, 140, 248, 0.4)",
    glowHover: "rgba(129, 140, 248, 0.7)",
    text: "text-indigo-100",
    labelBg: "rgba(8, 47, 73, 0.9)",
    labelBorder: "rgba(165, 180, 252, 0.5)",
  },
}

export function Hotspot({
  id,
  x,
  y,
  size = 50,
  label,
  color = "cyan",
  animDelay = 0,
  tabletX,
  tabletY,
  mobileX,
  mobileY,
  onClick,
}: HotspotProps) {
  const [isHovered, setIsHovered] = useState(false)
  const colorScheme = colorVariants[color as keyof typeof colorVariants] || colorVariants.cyan
  
  // Use CSS custom properties for responsive positioning
  const positionStyle = {
    '--desktop-x': `${x}%`,
    '--desktop-y': `${y}%`,
    '--tablet-x': `${tabletX ?? x}%`,
    '--tablet-y': `${tabletY ?? y}%`,
    '--mobile-x': `${mobileX ?? x}%`,
    '--mobile-y': `${mobileY ?? y}%`,
  } as React.CSSProperties

  const handleClick = () => {
    // TODO: Add click sound effect here - provide audio file path
    // const audio = new Audio('/sounds/hotspot-click.mp3')
    // audio.play()
    onClick(id)
  }

  const handleMouseEnter = () => {
    // TODO: Add hover sound effect here - provide audio file path
    // const audio = new Audio('/sounds/hotspot-hover.mp3')
    // audio.volume = 0.3
    // audio.play()
    setIsHovered(true)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      className="absolute cursor-pointer group z-10 hotspot-responsive"
      style={{
        ...positionStyle,
        transform: "translate(-50%, -50%)",
      }}
      aria-label={label}
    >
      {/* Ambient glow - soft and radiant */}
      <div
        className="absolute rounded-full animate-soft-breathe transition-all duration-700"
        style={{
          width: `${size * 2.2}px`,
          height: `${size * 2.2}px`,
          left: `${-(size * 0.6)}px`,
          top: `${-(size * 0.6)}px`,
          background: `radial-gradient(circle, ${isHovered ? colorScheme.glowHover : colorScheme.glow} 0%, transparent 70%)`,
          animationDelay: `${animDelay}s`,
          filter: "blur(16px)",
          opacity: isHovered ? 0.9 : 0.6,
        }}
      />

      {/* Rotating outer ring - delicate orbit */}
      <div
        className={`absolute animate-slow-spin transition-all duration-500 ${
          isHovered ? "opacity-40" : "opacity-25"
        }`}
        style={{
          width: `${size * 1.4}px`,
          height: `${size * 1.4}px`,
          left: `${-(size * 0.2)}px`,
          top: `${-(size * 0.2)}px`,
          animationDelay: `${animDelay}s`,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke={colorScheme.secondary}
            strokeWidth="0.5"
            strokeDasharray="2,4"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Main snowflake/ice crystal structure */}
      <div
        className={`relative transition-all duration-500 ${
          isHovered ? "scale-110" : "scale-100"
        }`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {/* Snowflake SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-lg transition-all duration-500"
          style={{
            filter: isHovered 
              ? `drop-shadow(0 0 8px ${colorScheme.glow}) drop-shadow(0 0 12px ${colorScheme.glow})`
              : `drop-shadow(0 0 4px ${colorScheme.glow})`,
          }}
        >
          {/* Main 6 branches of snowflake */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <g key={angle} transform={`rotate(${angle} 50 50)`}>
              {/* Main branch */}
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="10"
                stroke={colorScheme.primary}
                strokeWidth={isHovered ? "1.8" : "1.5"}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              {/* Side branches - upper */}
              <line
                x1="50"
                y1="20"
                x2="42"
                y2="15"
                stroke={colorScheme.secondary}
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.9"
              />
              <line
                x1="50"
                y1="20"
                x2="58"
                y2="15"
                stroke={colorScheme.secondary}
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.9"
              />
              {/* Side branches - middle */}
              <line
                x1="50"
                y1="30"
                x2="44"
                y2="27"
                stroke={colorScheme.secondary}
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.7"
              />
              <line
                x1="50"
                y1="30"
                x2="56"
                y2="27"
                stroke={colorScheme.secondary}
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.7"
              />
              {/* Tiny crystalline details */}
              <circle
                cx="50"
                cy="15"
                r="1.5"
                fill={colorScheme.primary}
                opacity="0.8"
              />
            </g>
          ))}
          
          {/* Center hexagonal core */}
          <circle
            cx="50"
            cy="50"
            r="4"
            fill={colorScheme.primary}
            opacity={isHovered ? "0.9" : "0.7"}
            className="transition-opacity duration-500"
          />
          <circle
            cx="50"
            cy="50"
            r="2.5"
            fill="white"
            opacity={isHovered ? "0.6" : "0.4"}
            className="transition-opacity duration-500"
          />
          
          {/* Inner hexagon detail */}
          <path
            d="M 50 42 L 57 46 L 57 54 L 50 58 L 43 54 L 43 46 Z"
            fill="none"
            stroke={colorScheme.secondary}
            strokeWidth="0.5"
            opacity="0.5"
          />
        </svg>

        {/* Melting effect - subtle drip at bottom */}
        <div
          className={`absolute bottom-[-2px] left-1/2 -translate-x-1/2 transition-all duration-500 ${
            isHovered ? "h-3 w-0.5 opacity-50" : "h-2 w-px opacity-30"
          }`}
          style={{
            background: `linear-gradient(to bottom, ${colorScheme.primary}, transparent)`,
            borderRadius: "0 0 50% 50%",
          }}
        />
      </div>

      {/* Label - always visible, enhanced on hover */}
      <div
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300"
        style={{ top: `${size + 16}px` }}
      >
        <span
          className={`text-[10px] font-mono tracking-[0.15em] uppercase px-3 py-1.5 rounded-md backdrop-blur-md transition-all duration-300 ${colorScheme.text}`}
          style={{
            background: colorScheme.labelBg,
            border: `1px solid ${colorScheme.labelBorder}`,
            textShadow: isHovered 
              ? `0 0 8px ${colorScheme.glow}, 0 0 12px ${colorScheme.glow}`
              : `0 0 4px ${colorScheme.glow}`,
            opacity: isHovered ? 1 : 0.9,
            letterSpacing: isHovered ? "0.2em" : "0.15em",
          }}
        >
          {label}
        </span>
      </div>

      <style jsx>{`
        .hotspot-responsive {
          left: var(--desktop-x);
          top: var(--desktop-y);
        }
        @media (max-width: 1024px) {
          .hotspot-responsive {
            left: var(--tablet-x);
            top: var(--tablet-y);
          }
        }
        @media (max-width: 640px) {
          .hotspot-responsive {
            left: var(--mobile-x);
            top: var(--mobile-y);
          }
        }
        @keyframes soft-breathe {
          0%, 100% {
            transform: scale(0.92);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.2;
          }
        }
        @keyframes slow-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-soft-breathe {
          animation: soft-breathe 6s ease-in-out infinite;
        }
        .animate-slow-spin {
          animation: slow-spin 40s linear infinite;
        }
      `}</style>
    </button>
  )
}
