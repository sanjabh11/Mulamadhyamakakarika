'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

        // Do NOT register a service worker in development — it aggressively caches
        // Next.js hot-reload chunks, causing ChunkLoadError timeouts on every reload.
        if (process.env.NODE_ENV === 'development') {
            // Actively unregister any previously-installed SW so stale caches are cleared.
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                registrations.forEach((reg) => reg.unregister());
            });
            return;
        }

        // Production only: register the service worker
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(
                (registration) => {
                    console.log('SW registered, scope:', registration.scope);
                },
                (err) => {
                    console.warn('SW registration failed:', err);
                }
            );
        });
    }, []);

    return null;
}
