"use client"

import { Mail } from "lucide-react"

const contacts = [
  {
    name: "Dany Zernitsky",
    role: "Co-Creator & Director",
    email: "dzsoundtrack@gmail.com",
  },
  {
    name: "Hila Manor",
    role: "Co-Creator & Director",
    email: "manor.hila@gmail.com",
  },
]

export function ContactSection() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 text-center">
      <h2 className="font-serif text-3xl md:text-4xl text-ice-white mb-2">
        Get in Touch
      </h2>
      <p className="text-ice-light/60 mb-12 text-sm">
        We'd love to hear from you
      </p>

      <div className="space-y-6 mb-12">
        {contacts.map((contact) => (
          <a
            key={contact.email}
            href={`mailto:${contact.email}`}
            className="block p-6 rounded-xl bg-cave-deep/50 border border-ice-primary/10 hover:border-ice-primary/30 transition-all duration-300 group"
          >
            <div className="text-center">
              <h3 className="text-ice-white text-lg font-serif mb-1">{contact.name}</h3>
              <p className="text-ice-light/60 text-sm mb-3">{contact.role}</p>
              <span className="inline-flex items-center gap-2 text-ice-primary group-hover:text-ice-light transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{contact.email}</span>
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className="pt-8 border-t border-ice-primary/10">
        <p className="text-ice-light/40 text-sm mb-4">
          Liminal - A Short Nature Documentary
        </p>
        <p className="text-ice-light/30 text-xs">
          Co-created by Dany Zernitsky & Hila Manor | Produced by Yonatan Jakob
        </p>
      </div>
    </div>
  )
}
