/**
 * StaticQuantumVisualization - Instant-loading Canvas 2D visualization
 * 
 * CRITICAL: Renders in < 20ms to provide immediate visual feedback
 * while WebGL 3D compiles in background (700-1500ms)
 * 
 * Educational Psychology: Beginners need visual feedback within 1 second
 * to maintain comprehension and engagement.
 * 
 * Features:
 * - Zero dependencies (pure Canvas 2D API)
 * - Concept-specific visualizations for each quantum/Madhyamaka concept
 * - Beautiful static frame (snapshot of what 3D will show)
 * - Fallback if WebGL unavailable
 */

import React, { useEffect, useRef, useState } from 'react';

export default function StaticQuantumVisualization({
    verseData,
    width,
    height,
    className = '',
    style = {}
}) {
    const canvasRef = useRef();
    const containerRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    // Responsive sizing
    useEffect(() => {
        if (!containerRef.current) return;

        const updateSize = () => {
            const container = containerRef.current;
            const rect = container.getBoundingClientRect();
            setDimensions({
                width: width || rect.width || 800,
                height: height || rect.height || 600
            });
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [width, height]);

    useEffect(() => {
        if (!canvasRef.current || !verseData) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Performance measurement
        const startTime = performance.now();

        // Extract visual parameters from verse data
        const colors = verseData?.animation?.colors ||
            verseData?.quantumResonance?.colors ||
            ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

        const concept = (verseData?.quantumResonance?.concept ||
            verseData?.animation?.type ||
            'emptiness').toLowerCase();

        const visualBridge = verseData?.animation?.visualBridge || '';

        // Render appropriate visualization
        renderStaticFrame(ctx, {
            colors,
            concept,
            visualBridge,
            width: dimensions.width,
            height: dimensions.height
        });

        const renderTime = performance.now() - startTime;
        console.log(`Static visualization rendered in ${renderTime.toFixed(1)}ms`);

    }, [verseData, dimensions]);

    return (
        <div
            ref={containerRef}
            className={`static-quantum-viz ${className}`}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: '300px',
                ...style
            }}
        >
            <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e1e2e 100%)',
                    borderRadius: '12px',
                    display: 'block'
                }}
            />

            <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '12px',
                fontFamily: 'Inter, system-ui, sans-serif',
                textAlign: 'center',
                pointerEvents: 'none',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)'
            }}>
                Loading interactive 3D visualization...
            </div>
        </div>
    );
}

/**
 * Main rendering dispatcher
 */
function renderStaticFrame(ctx, { colors, concept, visualBridge, width, height }) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0f172a');
    bgGradient.addColorStop(0.5, '#1a1f35');
    bgGradient.addColorStop(1, '#1e1e2e');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Ambient glow effect
    ctx.shadowBlur = 30;
    ctx.shadowColor = colors[0] + '40';

    // Route to concept-specific renderer
    const renderers = {
        'emptiness': renderEmptiness,
        'śūnyatā': renderEmptiness,
        'sunyata': renderEmptiness,
        'dependent-arising': renderDependentArising,
        'dependent-origination': renderDependentArising,
        'pratītyasamutpāda': renderDependentArising,
        'two-truths': renderTwoTruths,
        'impermanence': renderImpermanence,
        'non-self': renderNonSelf,
        'middle-way': renderMiddleWay,
        'nirvana': renderNirvana,
        'quantum-superposition': renderSuperposition,
        'entanglement': renderEntanglement,
        'wave-particle': renderWaveParticle,
        'uncertainty': renderUncertainty,
        'collapse': renderCollapse,
        'particle-field': renderParticleField,
        'network': renderNetwork,
        'dual-reality': renderTwoTruths
    };

    const renderer = renderers[concept] || renderGenericParticles;
    renderer(ctx, { colors, width, height, visualBridge });

    // Reset shadow
    ctx.shadowBlur = 0;
}

/**
 * CONCEPT-SPECIFIC RENDERERS
 */

function renderEmptiness(ctx, { colors, width, height }) {
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw concentric circles representing form/emptiness duality
    for (let i = 5; i > 0; i--) {
        const radius = i * (Math.min(width, height) / 12);
        const alpha = 1 - (i * 0.15);

        // Outer glow
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = `${colors[0]}${Math.floor(alpha * 128).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 4;
        ctx.stroke();

        // Main circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${colors[0]}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Particles flickering in/out around circle
        const particleCount = 8;
        for (let j = 0; j < particleCount; j++) {
            const angle = (j / particleCount) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            // Particle with glow
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 6);
            gradient.addColorStop(0, colors[j % colors.length]);
            gradient.addColorStop(0.5, colors[j % colors.length] + '88');
            gradient.addColorStop(1, colors[j % colors.length] + '00');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();

            // Inner bright core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Center void/fullness symbol
    const voidGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40);
    voidGradient.addColorStop(0, colors[0] + 'ff');
    voidGradient.addColorStop(0.7, colors[1] + '88');
    voidGradient.addColorStop(1, colors[2] + '00');
    ctx.fillStyle = voidGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fill();
}

function renderDependentArising(ctx, { colors, width, height }) {
    const centerX = width / 2;
    const centerY = height / 2;
    const nodeCount = 12;
    const radius = Math.min(width, height) / 3.5;

    // Draw nodes
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        nodes.push({ x, y, color: colors[i % colors.length] });
    }

    // Draw connections showing interdependence
    ctx.globalAlpha = 0.3;
    nodes.forEach((node, i) => {
        // Connect to next 2 nodes (showing dependent arising chain)
        [1, 2].forEach(offset => {
            const targetNode = nodes[(i + offset) % nodeCount];

            const gradient = ctx.createLinearGradient(node.x, node.y, targetNode.x, targetNode.y);
            gradient.addColorStop(0, node.color);
            gradient.addColorStop(1, targetNode.color);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            ctx.stroke();
        });
    });
    ctx.globalAlpha = 1;

    // Draw nodes on top
    nodes.forEach((node, i) => {
        // Outer glow
        const glowGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 12);
        glowGradient.addColorStop(0, node.color);
        glowGradient.addColorStop(0.5, node.color + '88');
        glowGradient.addColorStop(1, node.color + '00');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
        ctx.fill();

        // Main node
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(node.x - 1.5, node.y - 1.5, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Center label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Interdependence', centerX, centerY);
}

function renderTwoTruths(ctx, { colors, width, height }) {
    const centerX = width / 2;
    const splitY = height / 2;

    // Top half: Conventional truth (detailed, colorful)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, width, splitY);
    ctx.clip();

    // Gradient background for conventional
    const conventionalGrad = ctx.createLinearGradient(0, 0, 0, splitY);
    conventionalGrad.addColorStop(0, colors[0] + '40');
    conventionalGrad.addColorStop(1, colors[1] + '20');
    ctx.fillStyle = conventionalGrad;
    ctx.fillRect(0, 0, width, splitY);

    // Multiple particles (appearance of many)
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * width;
        const y = Math.random() * splitY;
        const size = 3 + Math.random() * 4;
        const color = colors[Math.floor(Math.random() * colors.length)];

        ctx.fillStyle = color + 'cc';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();

    // Bottom half: Ultimate truth (empty, unified)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, splitY, width, height);
    ctx.clip();

    // Darker, emptier background
    const ultimateGrad = ctx.createLinearGradient(0, splitY, 0, height);
    ultimateGrad.addColorStop(0, '#0a0e1a');
    ultimateGrad.addColorStop(1, '#050810');
    ctx.fillStyle = ultimateGrad;
    ctx.fillRect(0, splitY, width, height);

    // Single unified field (emptiness)
    const unifiedGrad = ctx.createRadialGradient(
        centerX, splitY + (height - splitY) / 2,
        0,
        centerX, splitY + (height - splitY) / 2,
        width / 3
    );
    unifiedGrad.addColorStop(0, colors[colors.length - 1] + '40');
    unifiedGrad.addColorStop(1, colors[colors.length - 1] + '00');
    ctx.fillStyle = unifiedGrad;
    ctx.beginPath();
    ctx.arc(centerX, splitY + (height - splitY) / 2, width / 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Dividing line with glow
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, splitY);
    ctx.lineTo(width, splitY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Conventional Truth', centerX, splitY / 2);
    ctx.fillText('Ultimate Truth', centerX, splitY + (height - splitY) / 2);
}

function renderImpermanence(ctx, { colors, width, height }) {
    const centerX = width / 2;
    const centerY = height / 2;

    // Flowing particles showing constant change
    const particleTrails = 8;
    const trailLength = 5;

    for (let i = 0; i < particleTrails; i++) {
        const angle = (i / particleTrails) * Math.PI * 2;
        const radius = Math.min(width, height) / 4;

        for (let j = 0; j < trailLength; j++) {
            const progress = j / trailLength;
            const currentRadius = radius + (progress * radius * 0.5);
            const currentAngle = angle + (progress * Math.PI / 4);

            const x = centerX + Math.cos(currentAngle) * currentRadius;
            const y = centerY + Math.sin(currentAngle) * currentRadius;

            const size = 8 * (1 - progress);
            const alpha = (1 - progress) * 0.8;

            const color = colors[i % colors.length];
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
            gradient.addColorStop(1, color + '00');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function renderNonSelf(ctx, { colors, width, height }) {
    const centerX = width / 2;
    const centerY = height / 2;

    // Scattered, non-unified particles (no central self)
    const particles = 50;
    const maxRadius = Math.min(width, height) / 2.5;

    for (let i = 0; i < particles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * maxRadius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        const size = 3 + Math.random() * 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const alpha = 0.5 + Math.random() * 0.5;

        // Glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, color + '00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Empty center (absence of self)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
}

function renderMiddleWay(ctx, { colors, width, height }) {
    const centerX = width / 2;
    const centerY = height / 2;
    const pathWidth = Math.min(width, height) / 3;

    // Extremes on left and right
    // Left extreme (eternalism)
    ctx.fillStyle = colors[0] + '60';
    ctx.fillRect(0, 0, pathWidth / 2, height);

    // Right extreme (nihilism)
    ctx.fillStyle = colors[colors.length - 1] + '60';
    ctx.fillRect(width - pathWidth / 2, 0, pathWidth / 2, height);

    // Middle path
    const middleGradient = ctx.createLinearGradient(
        centerX - pathWidth / 2, 0,
        centerX + pathWidth / 2, 0
    );
    middleGradient.addColorStop(0, colors[1] + '00');
    middleGradient.addColorStop(0.5, colors[1] + 'ff');
    middleGradient.addColorStop(1, colors[1] + '00');

    ctx.fillStyle = middleGradient;
    ctx.fillRect(centerX - pathWidth / 2, 0, pathWidth, height);

    // Path markers
    for (let i = 0; i < 10; i++) {
        const y = (i / 9) * height;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

function renderNirvana(ctx, { colors, width, height }) {
    const centerX = width / 2;
    const centerY = height / 2;

    // Peaceful, unified glow
    const maxRadius = Math.min(width, height) / 2;

    for (let i = 0; i < 5; i++) {
        const radius = maxRadius * (1 - i * 0.2);
        const alpha = 0.2 - i * 0.03;

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, colors[i % colors.length] + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, colors[i % colors.length] + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Bright center (cessation of suffering)
    const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
    coreGradient.addColorStop(0, '#ffffff');
    coreGradient.addColorStop(0.7, colors[0]);
    coreGradient.addColorStop(1, colors[0] + '00');
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    ctx.fill();
}

function renderSuperposition(ctx, { colors, width, height }) {
    const centerX = width / 2;
    const centerY = height / 2;

    // Overlapping states
    const states = [
        { x: centerX - 60, y: centerY, color: colors[0] },
        { x: centerX + 60, y: centerY, color: colors[1] }
    ];

    ctx.globalAlpha = 0.6;
    states.forEach(state => {
        const gradient = ctx.createRadialGradient(state.x, state.y, 0, state.x, state.y, 80);
        gradient.addColorStop(0, state.color);
        gradient.addColorStop(1, state.color + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(state.x, state.y, 80, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Interference pattern in overlap
    const overlapX = centerX;
    const overlapY = centerY;
    for (let i = 0; i < 5; i++) {
        const radius = 10 + i * 8;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 - i * 0.08})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(overlapX, overlapY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function renderEntanglement(ctx, { colors, width, height }) {
    const particle1 = { x: width * 0.3, y: height / 2 };
    const particle2 = { x: width * 0.7, y: height / 2 };

    // Connection showing entanglement
    const gradient = ctx.createLinearGradient(particle1.x, particle1.y, particle2.x, particle2.y);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = colors[1];
    ctx.beginPath();
    ctx.moveTo(particle1.x, particle1.y);
    ctx.lineTo(particle2.x, particle2.y);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw particles
    [particle1, particle2].forEach((p, i) => {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 20);
        gradient.addColorStop(0, colors[i * 2]);
        gradient.addColorStop(0.5, colors[i * 2] + '88');
        gradient.addColorStop(1, colors[i * 2] + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();
    });
}

function renderWaveParticle(ctx, { colors, width, height }) {
    const centerY = height / 2;

    // Left side: Wave
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x < width / 2; x += 2) {
        const y = centerY + Math.sin(x * 0.05) * 50;
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();

    // Right side: Particles
    for (let i = 0; i < 10; i++) {
        const x = width / 2 + 20 + i * 40;
        const y = centerY + (Math.sin(i) * 50);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
        gradient.addColorStop(0, colors[1]);
        gradient.addColorStop(1, colors[1] + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
    }
}

function renderUncertainty(ctx, { colors, width, height }) {
    const centerX = width / 2;
    const centerY = height / 2;

    // Blurred, uncertain particle cloud
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 100; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        const size = 5 + Math.random() * 10;
        const color = colors[Math.floor(Math.random() * colors.length)];

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function renderCollapse(ctx, { colors, width, height }) {
    const centerX = width / 2;
    const centerY = height / 2;

    // Before collapse: spread out
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 100;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.fillStyle = colors[0];
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    // After collapse: concentrated
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40);
    gradient.addColorStop(0, colors[1]);
    gradient.addColorStop(0.5, colors[1] + '88');
    gradient.addColorStop(1, colors[1] + '00');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fill();
}

function renderParticleField(ctx, { colors, width, height }) {
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 2 + Math.random() * 4;
        const color = colors[Math.floor(Math.random() * colors.length)];

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function renderNetwork(ctx, { colors, width, height }) {
    // Alias for dependent arising
    renderDependentArising(ctx, { colors, width, height });
}

function renderGenericParticles(ctx, { colors, width, height }) {
    const centerX = width / 2;
    const centerY = height / 2;
    const particleCount = 40;
    const maxRadius = Math.min(width, height) / 3;

    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const radiusVariation = 0.7 + Math.random() * 0.6;
        const radius = maxRadius * radiusVariation;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const size = 3 + Math.random() * 5;
        const color = colors[i % colors.length];

        // Glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color + '88');
        gradient.addColorStop(1, color + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}
