/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
      {
        protocol: 'https',
        hostname: 'elektrikliyiz.com',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
    domains: ['placehold.co', 'logo.clearbit.com', 'elektrikliyiz.com'],
  },
  experimental: {
    optimizeCss: true,
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig 
