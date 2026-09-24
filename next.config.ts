/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'react-markdown',
    ],
  },

  outputFileTracingIncludes: {
    '/api/chat': ['./KnowledgeBase/**/*', './lib/ada/**/*'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 768, 1024, 1280, 1920],
    qualities: [75, 90],
    minimumCacheTTL: 31536000,
  },

  async headers() {
    return [
      {
        source: '/(.*)\\.(js|css|woff2|png|jpg|jpeg|webp|avif|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'geolocation=()',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
