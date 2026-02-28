'use client';

/**
 * ParticleCursor — B5
 * Quantum particle trail cursor for desktop.
 * Only active on devices with hover capability (pointer: fine).
 * Respects prefers-reduced-motion — particles are skipped entirely.
 */

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
    x: number;
    y: number;
    alpha: number;
    size: number;
    color: string;
    id: number;
}

const COLORS = ['#00FFFF', '#8B5CF6', '#06B6D4', '#A78BFA', '#67E8F9'];
let particleId = 0;

export default function ParticleCursor() {
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const rafRef = useRef<number>(0);
    const lastPos = useRef({ x: -999, y: -999 });
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const isDesktop = window.innerWidth >= 768;
        const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setShouldRender(isDesktop && hasFinePointer && !prefersReduced);
    }, []);

    useEffect(() => {
        if (!shouldRender) return;

        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - lastPos.current.x;
            const dy = e.clientY - lastPos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Only spawn particles if cursor moved enough
            if (dist < 6) return;
            lastPos.current = { x: e.clientX, y: e.clientY };

            // Spawn 2-3 particles
            const count = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < count; i++) {
                particlesRef.current.push({
                    x: e.clientX + (Math.random() - 0.5) * 8,
                    y: e.clientY + (Math.random() - 0.5) * 8,
                    alpha: 0.8 + Math.random() * 0.2,
                    size: 3 + Math.random() * 4,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    id: particleId++,
                });
            }
        };

        const render = () => {
            // Fade out all particles
            particlesRef.current = particlesRef.current
                .map(p => ({ ...p, alpha: p.alpha - 0.04, size: p.size * 0.93 }))
                .filter(p => p.alpha > 0.02);

            // Sync DOM
            if (container) {
                // Remove stale elements
                const existing = new Set(
                    Array.from(container.children).map(el => el.getAttribute('data-pid'))
                );
                const active = new Set(particlesRef.current.map(p => String(p.id)));

                // Remove dead particles from DOM
                Array.from(container.children).forEach(el => {
                    if (!active.has(el.getAttribute('data-pid') || '')) {
                        container.removeChild(el);
                    }
                });

                // Update / create particles
                particlesRef.current.forEach(p => {
                    let el = container.querySelector(`[data-pid="${p.id}"]`) as HTMLElement | null;
                    if (!el) {
                        el = document.createElement('div');
                        el.setAttribute('data-pid', String(p.id));
                        el.style.cssText = `
                            position: fixed;
                            border-radius: 50%;
                            pointer-events: none;
                            transform: translate(-50%, -50%);
                            will-change: opacity, transform;
                        `;
                        container.appendChild(el);
                    }
                    el.style.left = `${p.x}px`;
                    el.style.top = `${p.y}px`;
                    el.style.width = `${p.size}px`;
                    el.style.height = `${p.size}px`;
                    el.style.opacity = String(p.alpha);
                    el.style.background = p.color;
                    el.style.boxShadow = `0 0 ${p.size * 2}px ${p.color}`;
                });
            }

            rafRef.current = requestAnimationFrame(render);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        rafRef.current = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, [shouldRender]);

    if (!shouldRender) return null;

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 9999,
                overflow: 'hidden',
            }}
        />
    );
}
