/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: false,

  // Optimize R3F and drei imports for faster HMR
  webpack: (config, { dev, isServer }) => {
    // Enable persistent filesystem cache in development (CRITICAL for performance)
    if (dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }

    // === CRITICAL: React.use() polyfill for React 18 + Next.js 14.2.x App Router ===
    // Next.js 14.2.x's app-index.js calls React.use() which only exists in React 19.
    // Inject the polyfill as the first entry point on the client side.
    if (!isServer) {
      const polyfillPath = path.resolve(__dirname, 'lib/react-use-polyfill.js');

      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await (typeof originalEntry === 'function' ? originalEntry() : originalEntry);

        // Inject polyfill into all client-side entry points
        for (const [key, entry] of Object.entries(entries)) {
          if (Array.isArray(entry.import)) {
            // Add polyfill as the FIRST import so React.use exists before app-index.js runs
            if (!entry.import.includes(polyfillPath)) {
              entry.import.unshift(polyfillPath);
            }
          }
        }

        return entries;
      };

      // Force single React instance (critical for R3F)
      config.resolve.alias = {
        ...config.resolve.alias,
        'react': path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        'three': path.resolve(__dirname, 'node_modules/three'),
        '@react-three/fiber': path.resolve(__dirname, 'node_modules/@react-three/fiber'),
        '@react-three/drei': path.resolve(__dirname, 'node_modules/@react-three/drei'),
      };
    }

    // Reduce chunk size warnings for R3F
    config.performance = {
      ...config.performance,
      maxAssetSize: 1000000, // 1MB
      maxEntrypointSize: 1000000,
    };

    return config;
  },

  // Experimental - faster dev server
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three'],
    cpus: 4,  // Use 4 CPU cores for parallel compilation
  },
};

module.exports = nextConfig;