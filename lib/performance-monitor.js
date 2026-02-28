import { logger } from "@/lib/logger";
/**
 * Verse Performance Monitor - ACTUALLY MEASURE what's slow
 * 
 * PURPOSE: Stop guessing, start measuring
 * - Track verse load times
 * - Track static vs 3D render times
 * - Track memory usage
 * - Identify real bottlenecks
 */

class VersePerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.enabled = true; // Set to false in production
        this.isTracking = false;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
    }

    /**
     * Start tracking FPS for instrumentation
     */
    startFPSTracking() {
        if (this.isTracking) return;
        this.isTracking = true;
        this.lastFpsUpdate = performance.now();

        logger.log('📊 [PerfMonitor] FPS Tracking Started');

        // Log FPS every second to console for mobile debugging
        const logInterval = setInterval(() => {
            if (!this.isTracking) {
                clearInterval(logInterval);
                return;
            }

            const now = performance.now();
            const delta = now - this.lastFpsUpdate;
            const fps = Math.round((this.frameCount * 1000) / delta);

            logger.log(`📡 [FPS] ${fps} | Frameloop: ${typeof window !== 'undefined' ? window.__FRAMELOOP_MODE : 'unknown'}`);

            this.frameCount = 0;
            this.lastFpsUpdate = now;
        }, 1000);
    }

    stopFPSTracking() {
        this.isTracking = false;
    }

    // Call this in the animation loop
    tick() {
        if (this.isTracking) {
            this.frameCount++;
        }
    }

    /**
     * Start tracking a verse load
     */
    startVerseLoad(verseId) {
        if (!this.enabled) return;

        this.metrics.set(verseId, {
            verseId,
            startTime: performance.now(),
            marks: {
                routeChange: performance.now(),
                componentMount: null,
                staticVizReady: null,
                webglStart: null,
                webglReady: null,
                firstInteractive: null
            },
            memory: {
                start: this.getMemoryInfo(),
                end: null
            }
        });

        logger.log(`[PerfMonitor] Started tracking: ${verseId}`);
    }

    /**
     * Mark a specific milestone
     */
    mark(verseId, milestone) {
        if (!this.enabled) return;

        const metric = this.metrics.get(verseId);
        if (!metric) {
            console.warn(`[PerfMonitor] No metric found for ${verseId}`);
            return;
        }

        metric.marks[milestone] = performance.now();
        const elapsed = metric.marks[milestone] - metric.startTime;
        logger.log(`[PerfMonitor] ${verseId} - ${milestone}: ${elapsed.toFixed(0)}ms`);
    }

    /**
     * Complete verse load tracking
     */
    endVerseLoad(verseId) {
        if (!this.enabled) return;

        const metric = this.metrics.get(verseId);
        if (!metric) return;

        metric.memory.end = this.getMemoryInfo();
        metric.totalTime = performance.now() - metric.startTime;

        this.logSummary(verseId);
        return this.getMetrics(verseId);
    }

    /**
     * Get memory info from Three.js renderer (if available)
     */
    getMemoryInfo() {
        // Try to access Three.js renderer info
        // This will be populated when renderer is available
        if (typeof window !== 'undefined' && window.__THREE_RENDERER__) {
            return {
                geometries: window.__THREE_RENDERER__.info.memory.geometries,
                textures: window.__THREE_RENDERER__.info.memory.textures,
                programs: window.__THREE_RENDERER__.info.programs.length
            };
        }
        return { geometries: 0, textures: 0, programs: 0 };
    }

    /**
     * Get metrics for a verse
     */
    getMetrics(verseId) {
        return this.metrics.get(verseId);
    }

    /**
     * Log summary for a verse
     */
    logSummary(verseId) {
        const metric = this.metrics.get(verseId);
        if (!metric) return;

        const { marks, memory, totalTime } = metric;

        console.group(`📊 Performance Summary: ${verseId}`);
        logger.log(`Total Load Time: ${totalTime.toFixed(0)}ms`);

        if (marks.staticVizReady) {
            const staticTime = marks.staticVizReady - marks.routeChange;
            logger.log(`  ✓ Static Viz: ${staticTime.toFixed(0)}ms`);
        }

        if (marks.webglReady) {
            const webglTime = marks.webglReady - (marks.webglStart || marks.staticVizReady || marks.routeChange);
            logger.log(`  ✓ WebGL 3D: ${webglTime.toFixed(0)}ms`);
        }

        if (memory.start && memory.end) {
            const geometryDelta = memory.end.geometries - memory.start.geometries;
            logger.log(`  📦 Geometries Created: ${geometryDelta}`);
            logger.log(`  🎨 Total Geometries: ${memory.end.geometries}`);
            logger.log(`  🖼️ Total Textures: ${memory.end.textures}`);
        }

        console.groupEnd();
    }

    /**
     * Compare two verse loads
     */
    compare(verseId1, verseId2) {
        const m1 = this.metrics.get(verseId1);
        const m2 = this.metrics.get(verseId2);

        if (!m1 || !m2) {
            console.warn('[PerfMonitor] Cannot compare - metrics missing');
            return;
        }

        console.group(`🔬 Comparison: ${verseId1} vs ${verseId2}`);
        logger.log(`Total Time: ${m1.totalTime.toFixed(0)}ms → ${m2.totalTime.toFixed(0)}ms`);

        const improvement = ((m1.totalTime - m2.totalTime) / m1.totalTime * 100);
        if (improvement > 0) {
            logger.log(`✅ Improvement: ${improvement.toFixed(1)}% faster`);
        } else {
            logger.log(`⚠️ Regression: ${Math.abs(improvement).toFixed(1)}% slower`);
        }

        console.groupEnd();
    }

    /**
     * Get all metrics
     */
    getAllMetrics() {
        return Array.from(this.metrics.values());
    }

    /**
     * Clear all metrics
     */
    clear() {
        this.metrics.clear();
        logger.log('[PerfMonitor] Metrics cleared');
    }
}

// Export singleton
export const perfMonitor = new VersePerformanceMonitor();

// Export class for testing
export { VersePerformanceMonitor };

// Helper to expose renderer globally (for memory tracking)
export function registerRenderer(renderer) {
    if (typeof window !== 'undefined') {
        window.__THREE_RENDERER__ = renderer;
    }
}
