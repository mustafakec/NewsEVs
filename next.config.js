/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.mercedes-benzsouthwest.co.uk'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      }
    ],
    dangerouslyAllowSVG: true,
  },
  experimental: {
    optimizeCss: true,
    serverActions: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*; font-src 'self' data:; connect-src 'self' https://*;"
          },
        ],
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig