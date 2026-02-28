import { useState, useEffect } from 'react';

/**
 * Hook to track scroll position for parallax effects.
 * 
 * @param speed - Parallax speed multiplier (e.g., 0.5 means moves at half scroll speed)
 * @returns Vertical offset in pixels
 */
export function useParallax(speed: number = 0.5) {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        // Respect user preference for reduced motion
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) return;

        const handleScroll = () => {
            if (typeof window !== 'undefined') {
                setOffset(window.scrollY * speed);
            }
        };

        // Initial set
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return offset;
}
