"use client"

import { Droplets, Thermometer, Calendar, Mountain, ExternalLink } from "lucide-react"

const facts = [
  {
    icon: Thermometer,
    stat: "+1.1°C",
    label: "Global temperature rise since pre-industrial times (2011–2020)",
    source: "IPCC AR6 WG1 2021",
    link: "https://www.ipcc.ch/report/ar6/wg1/chapter/summary-for-policymakers/",
    gradient: "from-orange-950/50 via-red-950/40 to-red-900/30",
    iconColor: "text-orange-300",
  },
  {
    icon: Mountain,
    stat: "267 Gt/year",
    label: "Average ice mass loss from glaciers globally — equivalent to filling 107 million Olympic pools every year",
    source: "Nature 2021",
    link: "https://www.nature.com/articles/s41586-021-03436-z",
    gradient: "from-cyan-950/50 via-blue-950/40 to-indigo-950/30",
    iconColor: "text-cyan-300",
  },
  {
    icon: Calendar,
    stat: "By 2050",
    label: "Projected loss of many accessible ice caves",
    source: "The Cryosphere 2025",
    link: "https://tc.copernicus.org/articles/19/6283/2025/",
    gradient: "from-purple-950/50 via-indigo-950/40 to-violet-950/30",
    iconColor: "text-purple-300",
  },
  {
    icon: Droplets,
    stat: "68%",
    label: "Of world's freshwater stored in glaciers",
    source: "USGS",
    link: "https://www.usgs.gov/special-topics/water-science-school/science/ice-snow-and-glaciers-and-water-cycle",
    gradient: "from-teal-950/50 via-sky-950/40 to-cyan-950/30",
    iconColor: "text-teal-300",
  },
]

const keyPoints = [
  {
    title: "Key Point 1",
    text: "This is the first key point.",
    gradient: "from-green-950/50 via-blue-950/40 to-cyan-950/30",
    borderColor: "border-green-500/20",
    numberBg: "bg-green-500",
    numberBorder: "border-white",
    numberText: "text-white",
  },
  {
    title: "Key Point 2",
    text: "This is the second key point.",
    gradient: "from-red-950/50 via-orange-950/40 to-yellow-950/30",
    borderColor: "border-red-500/20",
    numberBg: "bg-red-500",
    numberBorder: "border-white",
    numberText: "text-white",
  },
  {
    title: "Key Point 3",
    text: "This is the third key point.",
    gradient: "from-purple-950/50 via-indigo-950/40 to-violet-950/30",
    borderColor: "border-purple-500/20",
    numberBg: "bg-purple-500",
    numberBorder: "border-white",
    numberText: "text-white",
  },
]

export function IceInfoSection() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <h2 className="font-serif text-3xl md:text-4xl text-ice-white mb-8 text-center">
        The Vanishing Ice
      </h2>

      {/* Facts Grid - 2x2 layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {facts.map((fact) => {
          const Icon = fact.icon
          return (
            <div
              key={fact.label}
              className={`relative p-6 rounded-xl bg-gradient-to-br ${fact.gradient} border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 group backdrop-blur-sm`}
            >
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <Icon className={`w-10 h-10 ${fact.iconColor}`} />
              </div>
              <div className={`font-mono text-3xl md:text-4xl ${fact.iconColor} font-bold mb-3`}>
                {fact.stat}
              </div>
              <p className="text-ice-light/80 text-sm leading-relaxed mb-3">
                {fact.label}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-cyan-400/50 text-xs font-mono">
                  {fact.source}
                </p>
                <a
                  href={fact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 ${fact.iconColor} opacity-60 hover:opacity-100 transition-opacity text-xs font-mono`}
                >
                  <span>Read further</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
