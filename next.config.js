/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false,
  outputFileTracingRoot: __dirname,
  output: 'export',
  distDir: 'dist',

  // Required headers for Whop iframe embedding
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL', // Allows embedding in Whop iframe
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors https://*.whop.com https://whop.com 'self'",
          },
        ],
      },
    ];
  },

  // BUG-6 FIX: Redirect /verse and /verse/:chapterId to valid chapter-verse format
  async redirects() {
    return [
      {
        source: '/verse',
        destination: '/verse/1-1',
        permanent: false,
      },
      {
        source: '/verse/:id(\\d+)',
        destination: '/verse/:id-1',
        permanent: false,
      },
    ];
  },

  // Optimize R3F and drei imports for faster HMR
  webpack: (config, { dev, isServer }) => {
    // Force single React instance (critical for R3F)
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react': path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        'three': path.resolve(__dirname, 'node_modules/three'),
        '@react-three/fiber': path.resolve(__dirname, 'node_modules/@react-three/fiber'),
        '@react-three/drei': path.resolve(__dirname, 'node_modules/@react-three/drei'),
        'framer-motion': path.resolve(__dirname, 'node_modules/framer-motion'),
      };
    }

    return config;
  },

  // Experimental - faster dev server
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three'],
    cpus: 4,  // Use 4 CPU cores for parallel compilation
  },
};

module.exports = nextConfig;