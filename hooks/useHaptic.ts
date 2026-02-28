'use client';

/**
 * Hook to provide haptic feedback if supported by the device.
 * Gracefully no-ops if navigator.vibrate is unavailable.
 */
export function useHaptic() {
    const vibrate = (pattern: number | number[]) => {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    };

    return {
        /** Short tap feedback (light impact) */
        tap: () => vibrate(10),
        /** Success feedback (medium impact) */
        success: () => vibrate(50),
        /** Error feedback (double buzz) */
        error: () => vibrate([50, 50, 50]),
        /** Custom pattern */
        pattern: (p: number | number[]) => vibrate(p),
    };
}
