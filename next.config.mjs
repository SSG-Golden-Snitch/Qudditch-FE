/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'sitem.ssgcdn.com',
      },
    ],
  },
}

export default nextConfig
