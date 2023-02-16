/** @type {import('next').NextConfig} */
const securityHeaders = [
  {key:'Referrer-Policy',
    value:'unsafe-url'
  }
]

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  /* experimental: {
    images: {
      unoptimized: true,
    },
  }, */
};

module.exports = nextConfig;
