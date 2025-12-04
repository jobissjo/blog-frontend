import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // output: 'export', // Outputs a Single-Page Application (SPA)
  // distDir: 'build', // Changes the build output directory to `build`
  //  images: {
  //   unoptimized: true,
  // },
  productionBrowserSourceMaps: true,
  allowedDevOrigins: ['http://localhost:3000', 'https://jotechblog.netlify.app', 'http://192.168.1.37:3000',
    'https://blog-frontend-dn7a5gsn0-jobisjobi1234gmailcoms-projects.vercel.app',
  ],
  images: {
    domains: [
      "res.cloudinary.com"
    ]
  }

}

export default nextConfig