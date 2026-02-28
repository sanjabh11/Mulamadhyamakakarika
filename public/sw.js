// Minimal Service Worker for Offline Caching of App Shell
const CACHE_NAME = 'mmk-quantum-v3';
const DYNAMIC_CACHE = 'mmk-dynamic-v2';

// Assets to pre-cache
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/assets/bg-stars.png',
    // Next.js handles JS bundles via its own mechanism usually, but we can cache key static files
];

self.addEventListener('install', (event) => {
    // Force new SW to take control
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

self.addEventListener('activate', (event) => {
    // Clean up old caches
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    // Ignore API routes and next-server internal routes
    const url = new URL(event.request.url);
    if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next/webpack')) return;

    // Bypass custom caching during local development to prevent stale chunk errors
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname.startsWith('192.168.')) return;

    // Stale-while-revalidate strategy for most resources
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // Update cache with new response
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Network failed
                // Could return offline.html here if we had one
            });

            return cachedResponse || fetchPromise;
        })
    );
});
