/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.mercedes-benzsouthwest.co.uk', 'res.cloudinary.com'],
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
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://ep2.adtrafficquality.google https://*.google.com https://*.doubleclick.net https://securepubads.g.doubleclick.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://* https://pagead2.googlesyndication.com https://www.google-analytics.com https://*.doubleclick.net https://*.google.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://* https://pagead2.googlesyndication.com https://www.google-analytics.com https://*.google.com https://*.doubleclick.net; frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.google.com https://*.doubleclick.net https://ep2.adtrafficquality.google; fenced-frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.google.com https://*.doubleclick.net https://ep2.adtrafficquality.google; object-src 'none'; base-uri 'self'; form-action 'self';"
          },
        ],
      },
    ]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.swf$/,
      use: [
        {
          loader: 'ignore-loader'
        }
      ]
    });
    return config;
  }
}

module.exports = nextConfig