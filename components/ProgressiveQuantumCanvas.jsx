/**
 * ProgressiveQuantumCanvas - Progressive Enhancement Wrapper
 * 
 * STRATEGY:
 * 1. Show static Canvas 2D visualization immediately (100-200ms)
 * 2. Load 3D WebGL in parallel (non-blocking)
 * 3. Smoothly transition from static → 3D when ready
 * 
 * BENEFITS:
 * - User sees SOMETHING instantly (no blank canvas)
 * - Educational value preserved (static shows concept)
 * - 3D enhances when available (progressive, not required)
 * - Works even if WebGL fails (graceful degradation)
 */

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import StaticQuantumVisualization from './StaticQuantumVisualization';
import { perfMonitor } from '../lib/performance-monitor';

// Lazy load 3D canvas (don't block initial render)
const QuantumCanvas = dynamic(
    () => import('./three/QuantumCanvas'),
    { ssr: false } // Client-side only
);

export default function ProgressiveQuantumCanvas({
    verseData,
    chapter,
    animationType,
    autoRotate = true,
    className = '',
    style = {},
    ...otherProps
}) {
    const [show3D, setShow3D] = useState(false);
    const [webgl3DReady, setWebgl3DReady] = useState(false);
    const [enableTransition, setEnableTransition] = useState(true);

    // Start loading 3D after brief delay OR on user interaction
    useEffect(() => {
        // Strategy: Load 3D immediately in background, but don't show until ready
        // This maximizes parallelism (static renders while 3D compiles)

        const loadTimer = setTimeout(() => {
            setShow3D(true);
        }, 50); // Start loading almost immediately

        // Also trigger on interaction (user is engaged, prioritize 3D)
        const handleInteraction = () => {
            clearTimeout(loadTimer);
            setShow3D(true);
        };

        // Use detailed target if available, otherwise fallback to window
        // In App Router, scrolling often happens on a container, not window
        const target = otherProps.containerRef?.current || window;

        target.addEventListener('click', handleInteraction, { once: true, passive: true });
        target.addEventListener('scroll', handleInteraction, { once: true, passive: true });
        target.addEventListener('touchstart', handleInteraction, { once: true, passive: true });

        // Always listen to window resize as fallback for interaction
        window.addEventListener('resize', handleInteraction, { once: true, passive: true });

        return () => {
            clearTimeout(loadTimer);
            target.removeEventListener('click', handleInteraction);
            target.removeEventListener('scroll', handleInteraction);
            target.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('resize', handleInteraction);
        };
    }, [otherProps.containerRef]);

    // Handle 3D load completion
    const handleWebGL3DLoad = () => {
        console.log('ProgressiveQuantumCanvas: 3D WebGL ready, fading in...');
        setWebgl3DReady(true);
    };

    // Handle 3D errors (stay with static)
    const handleWebGL3DError = (error) => {
        console.warn('ProgressiveQuantumCanvas: 3D failed, keeping static visualization', error);
        setShow3D(false); // Don't try to show 3D
    };

    return (
        <div
            className={`progressive-quantum-canvas ${className}`}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: '300px',
                overflow: 'hidden',
                ...style
            }}
        >
            {/* Static visualization - ALWAYS rendered first */}
            <div
                style={{
                    opacity: webgl3DReady ? 0 : 1,
                    transition: enableTransition ? 'opacity 0.8s ease-out' : 'none',
                    position: webgl3DReady ? 'absolute' : 'relative',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: webgl3DReady ? 'none' : 'auto',
                    zIndex: webgl3DReady ? 1 : 2,
                }}
            >
                <StaticQuantumVisualization
                    verseData={verseData}
                    className="static-viz"
                />
            </div>

            {/* 3D WebGL - Loads in background, fades in when ready */}
            {show3D && (
                <div
                    style={{
                        opacity: webgl3DReady ? 1 : 0,
                        transition: enableTransition ? 'opacity 0.8s ease-in' : 'none',
                        position: webgl3DReady ? 'relative' : 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: webgl3DReady ? 'auto' : 'none',
                        zIndex: webgl3DReady ? 2 : 1,
                    }}
                >
                    <QuantumCanvas
                        verseData={verseData}
                        chapter={chapter}
                        animationType={animationType}
                        autoRotate={autoRotate}
                        onLoad={handleWebGL3DLoad}
                        onError={handleWebGL3DError}
                        {...otherProps}
                    />
                </div>
            )}

            {/* Item 5: Canvas Skeleton Loader — shows while WebGL is loading */}
            {!webgl3DReady && (
                <div className="canvas-skeleton" role="status" aria-label="Loading quantum visualization">
                    <div className="canvas-skeleton-orb" />
                    <span className="canvas-skeleton-label">Initializing Quantum Field</span>
                </div>
            )}
        </div>
    );
}
