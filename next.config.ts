import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // output: 'export', // Outputs a Single-Page Application (SPA)
  // distDir: 'build', // Changes the build output directory to `build`
  //  images: {
  //   unoptimized: true,
  // },
  productionBrowserSourceMaps: true,
  allowedDevOrigins: ['http://localhost:3000', 'https://blog.jotech.in', 'https://jotechblog.netlify.app', 'http://192.168.1.40:3000',
    'https://blog-frontend-dn7a5gsn0-jobisjobi1234gmailcoms-projects.vercel.app', 'https://jo-tech-blog.vercel.app',
    'http://localhost:8080'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // Optional: match specific paths if needed, or leave as is to allow all from this domain
      },
    ],
    unoptimized: false, // Set to true if you need to disable optimization entirelyx
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

}

export default nextConfig