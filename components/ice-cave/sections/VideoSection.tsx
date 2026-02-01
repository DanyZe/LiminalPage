"use client"

import { useState } from "react"
import { Play } from "lucide-react"

interface VideoItem {
  id: string
  title: string
  description: string
  thumbnail: string
  embedUrl: string
  platform: "vimeo" | "youtube"
}

const videos: VideoItem[] = [
  {
    id: "1",
    title: "Pitch",
    description: "Our vision for Liminal",
    thumbnail: "https://img.youtube.com/vi/1OAToIFbLaA/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/1OAToIFbLaA",
    platform: "youtube",
  },
  {
    id: "2",
    title: "Landscapes: Dead Sea",
    description: "Audiovisual exploration of the Dead Sea",
    thumbnail: "https://img.youtube.com/vi/ZdkOOmTE3Aw/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/ZdkOOmTE3Aw",
    platform: "youtube",
  },
  {
    id: "3",
    title: "Landscapes. Grove",
    description: "Audiovisual exploration",
    thumbnail: "https://img.youtube.com/vi/3u6K_FXFbQ8/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/3u6K_FXFbQ8",
    platform: "youtube",
  },
]

export function VideoSection() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <h2 className="font-serif text-3xl md:text-4xl text-ice-white mb-2 text-center">
        Our Work
      </h2>
      <p className="text-ice-light/60 text-center mb-12 text-sm">
        Audiovisual explorations
      </p>

      {activeVideo ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveVideo(null)}
            className="absolute -top-12 right-0 text-ice-light/60 hover:text-ice-white transition-colors text-sm"
          >
            Back to gallery
          </button>
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-cave-dark border border-ice-primary/20">
            <iframe
              src={activeVideo.embedUrl}
              title={activeVideo.title}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
          <h3 className="font-serif text-xl text-ice-white mt-4">
            {activeVideo.title}
          </h3>
          <p className="text-ice-light/60 text-sm">{activeVideo.description}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setActiveVideo(video)}
              className="group text-left rounded-xl overflow-hidden bg-cave-deep/50 border border-ice-primary/10 hover:border-ice-primary/30 transition-all duration-500"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-cave-dark/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-ice-primary/90 flex items-center justify-center">
                    <Play className="w-6 h-6 text-cave-dark ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg text-ice-white mb-1">
                  {video.title}
                </h3>
                <p className="text-ice-light/60 text-sm">{video.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
