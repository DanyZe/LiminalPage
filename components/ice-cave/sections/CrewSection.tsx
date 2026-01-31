"use client"

import Image from "next/image"

interface CrewMember {
  name: string
  role: string
  bio: string
  image: string
}

const crewMembers: CrewMember[] = [
  {
    name: "Dany Zernitsky",
    role: "Co-Creator",
    bio: "Sound Designer, musician, exploring the intersection of acoustics and human experience.",
    image: "/images/team/dany.jpg",
  },
  {
    name: "Hila Manor",
    role: "Co-Creator",
    bio: "Filmmaker, animator, focused on environmental narratives and immersive storytelling.",
    image: "/images/team/hila.jpg",
  },
  {
    name: "Jonathan Jacob",
    role: "Producer",
    bio: "Experienced producer with a passion for bringing meaningful stories to life.",
    image: "/images/team/yonatan.jpg",
  },
]

export function CrewSection() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <h2 className="font-serif text-3xl md:text-4xl text-ice-white mb-2 text-center">
        The Team
      </h2>
      <p className="text-ice-light/60 text-center mb-12 text-sm">
        The people behind Liminal
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {crewMembers.map((member, index) => (
          <div
            key={member.name}
            className="group text-center p-6 rounded-2xl bg-gradient-to-br from-slate-800/40 via-slate-900/30 to-transparent backdrop-blur-sm border border-ice-primary/10 hover:border-ice-primary/30 transition-all duration-500"
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${
                index === 0 ? 'rgba(59, 130, 246, 0.05)' : 
                index === 1 ? 'rgba(34, 211, 238, 0.05)' : 
                'rgba(99, 102, 241, 0.05)'
              }, transparent)`
            }}
          >
            {/* Circular photo with object-cover for face cropping */}
            <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-ice-primary/20 group-hover:border-ice-primary/50 transition-all duration-500 group-hover:scale-105 bg-slate-900">
              <Image
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                width={112}
                height={112}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            <h3 className="font-serif text-xl text-ice-white mb-1">
              {member.name}
            </h3>
            <p className="text-ice-primary text-sm mb-3 tracking-wide uppercase">
              {member.role}
            </p>
            <p className="text-ice-light/70 text-sm leading-relaxed">
              {member.bio}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
