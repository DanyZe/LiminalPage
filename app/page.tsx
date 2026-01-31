"use client"

import { useState } from "react"
import { CaveScene } from "@/components/ice-cave/CaveScene"
import { LoadingScreen } from "@/components/ice-cave/LoadingScreen"
import { AudioProvider } from "@/components/ice-cave/AudioManager"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <AudioProvider>
      <main className="min-h-screen bg-cave-dark">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
        <CaveScene />
      </main>
    </AudioProvider>
  )
}
