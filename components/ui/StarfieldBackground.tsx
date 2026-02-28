'use client';

import React, { useState, useEffect } from 'react';
import { useParallax } from '../../hooks/useParallax';

/**
 * StarfieldBackground
 * 
 * Renders a multi-layered starfield with parallax scrolling.
 * Uses CSS gradients for performance (no heavy images).
 * Respects reduced motion via useParallax hook (offsets stay 0).
 */
export default function StarfieldBackground() {
    const offset1 = useParallax(0.05); // Distant stars (slowest)
    const offset2 = useParallax(0.15); // Mid-distance stars
    const offset3 = useParallax(0.25); // Close stars (fastest)

    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const isDesktop = window.innerWidth >= 768;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setShouldRender(isDesktop && !prefersReduced);
    }, []);

    if (!shouldRender) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-quantum-deep section-starfield">
            {/* Layer 1: Small distant stars */}
            <div
                className="absolute inset-0 starfield-layer-1 opacity-60"
                style={{ transform: `translateY(-${offset1}px)` }}
            />

            {/* Layer 2: Medium stars */}
            <div
                className="absolute inset-0 starfield-layer-2 opacity-50"
                style={{ transform: `translateY(-${offset2}px)` }}
            />

            {/* Layer 3: Large close stars + subtle nebula glow */}
            <div
                className="absolute inset-0 starfield-layer-3 opacity-40 mix-blend-screen"
                style={{ transform: `translateY(-${offset3}px)` }}
            />
        </div>
    );
}
