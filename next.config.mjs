import fs from 'fs'
import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Log what's in the public/sounds directory at build time
      const soundsDir = path.join(process.cwd(), 'public', 'sounds')
      try {
        const files = fs.readdirSync(soundsDir)
        console.log('[Next.js Build] Files in public/sounds:', files)
        files.forEach(file => {
          const filePath = path.join(soundsDir, file)
          const stats = fs.statSync(filePath)
          console.log(`[Next.js Build] ${file}: ${stats.size} bytes`)
        })
      } catch (err) {
        console.log('[Next.js Build] Error reading sounds directory:', err.message)
      }
    }
    return config
  },
}

export default nextConfig
