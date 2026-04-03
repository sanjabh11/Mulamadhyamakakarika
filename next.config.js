/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false,
  outputFileTracingRoot: __dirname,

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
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "frame-ancestors 'self' https://whop.com https://*.whop.com",
        },
      ],
    },
  ],
  redirects: async () => [
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
  ],
};

module.exports = nextConfig;
