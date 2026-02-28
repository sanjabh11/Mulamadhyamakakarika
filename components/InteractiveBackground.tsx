'use client';

import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let lastFrame = 0;
        let isStatic = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let width = canvas.width;
        let height = canvas.height;

        // Quantum palette
        const colors = ['#8B5CF6', '#06B6D4', '#EC4899', '#FFD700'];

        const resize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
            canvas.width = rect.width;
            canvas.height = rect.height;
            width = rect.width;
            height = rect.height;
            initParticles();
            if (isStatic) renderStatic();
        };

        const mouse = { x: -1000, y: -1000 };
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener('resize', resize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMotionPreference = (e: MediaQueryListEvent) => {
            isStatic = e.matches;
            if (isStatic) {
                cancelAnimationFrame(animationFrameId);
                renderStatic();
            } else {
                lastFrame = performance.now();
                loop(lastFrame);
            }
        };
        mediaQuery.addEventListener('change', handleMotionPreference);

        interface Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            color: string;
            alpha: number;
            baseY: number;
            phase: number;
        }

        let particles: Particle[] = [];

        const initParticles = () => {
            particles = [];
            const count = Math.min(80, Math.floor((width * height) / 15000)); // Responsive count
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    baseY: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    radius: 1 + Math.random() * 2,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    alpha: 0.1 + Math.random() * 0.6,
                    phase: Math.random() * Math.PI * 2
                });
            }
        };

        const drawWaveBackground = (time: number) => {
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.05;
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.strokeStyle = colors[i % colors.length];
                for (let x = 0; x <= width; x += 20) {
                    const y = height / 2 + Math.sin(x * 0.005 + time * 0.001 + i) * (100 + i * 20);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            ctx.globalAlpha = 1.0;
        };

        const renderFrame = (time: number) => {
            ctx.clearRect(0, 0, width, height);

            // Subtle center radial gradient overlay
            const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2);
            gradient.addColorStop(0, 'rgba(139, 92, 246, 0.08)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            drawWaveBackground(time);

            // Update & draw particles
            particles.forEach((p, i) => {
                // Wave motion
                p.x += p.vx;
                p.y = p.baseY + Math.sin(p.phase + time * 0.001) * 30; // Sine wave interference pattern

                // Wrap around
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;

                let currentAlpha = p.alpha;
                let currentRadius = p.radius;

                // Probability density collapse (Mouse interaction)
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const mouseRadius = 150;

                if (dist < mouseRadius) {
                    // Collapse into defined orb near cursor
                    const influence = 1 - dist / mouseRadius;
                    currentAlpha = Math.min(1, p.alpha + influence * 0.5);
                    currentRadius = p.radius + influence * 2;
                    // Gravitational pull slightly
                    p.x += dx * influence * 0.01;
                    p.baseY += dy * influence * 0.01;
                } else if (mouse.x > 0) {
                    // Blur out distant particles
                    currentAlpha = Math.max(0.05, p.alpha - 0.2);
                }

                // Draw Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = currentAlpha;
                ctx.fill();

                // Entanglement lines (connect nearby particles)
                ctx.globalAlpha = currentAlpha * 0.5; // lower alpha for lines
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx2 = p.x - p2.x;
                    const dy2 = p.y - p2.y;
                    const dist2 = dx2 * dx2 + dy2 * dy2; // Squared distance for perf
                    if (dist2 < 10000) { // < 100px
                        const lineAlpha = (1 - Math.sqrt(dist2) / 100) * currentAlpha;
                        ctx.beginPath();
                        ctx.strokeStyle = p.color;
                        ctx.globalAlpha = lineAlpha * 0.8;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            ctx.globalAlpha = 1.0;
        };

        const renderStatic = () => {
            renderFrame(10000); // Render state at a specific time
        };

        const loop = (time: number) => {
            if (isStatic) return;

            // ~30 FPS Throttle
            if (time - lastFrame < 33) {
                animationFrameId = requestAnimationFrame(loop);
                return;
            }
            lastFrame = time;

            renderFrame(time);
            animationFrameId = requestAnimationFrame(loop);
        };

        // Init
        resize();
        if (!isStatic) {
            lastFrame = performance.now();
            loop(lastFrame);
        } else {
            renderStatic();
        }

        return () => {
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            mediaQuery.removeEventListener('change', handleMotionPreference);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-auto bg-[#050810] overflow-hidden">
            <canvas
                ref={canvasRef}
                className="w-full h-full block"
                style={{ touchAction: 'none' }}
                aria-hidden="true"
            />
        </div>
    );
}
