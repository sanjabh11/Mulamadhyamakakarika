'use client';

/**
 * AuroraBackground — B4
 * Animated aurora glow behind the R3F canvas.
 * Respects prefers-reduced-motion (global CSS rule handles animation: none).
 * Only renders on devices with hover (desktop-class), hidden on low-end via CSS.
 */

import React from 'react';

export default function AuroraBackground({ chapterId }: { chapterId?: number | string }) {
    return (
        <div
            className="aurora-background"
            aria-hidden="true"
            style={{ pointerEvents: 'none' }}
        >
            <div className="aurora-blob aurora-blob-1" />
            <div className="aurora-blob aurora-blob-2" />
            <div className="aurora-blob aurora-blob-3" />
        </div>
    );
}
