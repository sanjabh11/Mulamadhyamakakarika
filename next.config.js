/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure static file serving
  async rewrites() {
    return [
      // Rewrite requests to /animations.js and /config.js to the correct location
      {
        source: '/animations.js',
        destination: '/Ch16/animations.js',
      },
      {
        source: '/config.js',
        destination: '/Ch16/config.js',
      },
      // Add rewrites for any other static files that might be needed
      {
        source: '/animation-:file*',
        destination: '/Ch16/animation-:file*',
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/chapter-1',
        destination: '/Ch1/index.html',
        permanent: false,
      },
      {
        source: '/chapter-2',
        destination: '/Ch2/index.html',
        permanent: false,
      },
      {
        source: '/chapter-3',
        destination: '/Ch3/index.html',
        permanent: false,
      },
      // For verse-level redirects
      {
        source: '/verse-1-:verseNumber',
        destination: '/Ch1/index.html#verse-:verseNumber',
        permanent: false,
      },
      {
        source: '/verse-2-:verseNumber',
        destination: '/Ch2/index.html#verse-:verseNumber',
        permanent: false,
      },
      {
        source: '/verse-3-:verseNumber',
        destination: '/Ch3/index.html#verse-:verseNumber',
        permanent: false,
      }
    ]
  },
};

module.exports = nextConfig;