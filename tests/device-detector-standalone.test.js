
import { getDeviceProfile } from '../lib/device-detector.js';

// Simple test runner
const describe = async (name, fn) => {
    console.log(`\n🧪 ${name}`);
    await fn();
};

const test = (name, fn) => {
    try {
        fn();
        console.log(`  ✅ ${name}`);
    } catch (e) {
        console.error(`  ❌ ${name}`);
        console.error(e);
    }
};

const expect = (actual) => ({
    toBe: (expected) => {
        if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`);
    },
    toEqual: (expected) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
    },
    toContain: (item) => {
        if (!actual.includes(item)) throw new Error(`Expected ${actual} to contain ${item}`);
    },
    toHaveProperty: (prop) => {
        if (!actual.hasOwnProperty(prop)) throw new Error(`Expected object to have property ${prop}`);
    },
    not: {
        toBe: (expected) => {
            if (actual === expected) throw new Error(`Expected ${actual} not to be ${expected}`);
        }
    }
});

// Mocks
const mockNavigator = (userAgent, cores, memory) => {
    Object.defineProperty(global, 'navigator', {
        value: {
            userAgent,
            hardwareConcurrency: cores,
            deviceMemory: memory,
            platform: 'MacIntel'
        },
        writable: true,
        configurable: true
    });
};

const mockWindow = (dpr) => {
    Object.defineProperty(global, 'window', {
        value: {
            devicePixelRatio: dpr,
            screen: { width: 1920, height: 1080 }
        },
        writable: true,
        configurable: true
    });
    Object.defineProperty(global, 'document', {
        value: {
            createElement: () => ({
                getContext: () => ({
                    getExtension: () => null,
                    getParameter: () => '',
                })
            })
        },
        writable: true,
        configurable: true
    });
};

// Run tests
describe('Device Detector', () => {
    mockNavigator('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 8, 16);
    mockWindow(2);

    test('should detect high-end desktop properties', () => {
        const profile = getDeviceProfile();

        // Check for new properties
        expect(profile).toHaveProperty('powerMode');
        expect(profile).toHaveProperty('frameloop');

        if (profile.quality === 'high') {
            expect(profile.frameloop).toBe('always');
            expect(profile.powerMode).toBe('high-performance');
        }
    });

    test('should detect mobile device properties', () => {
        mockNavigator('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', 4, 4);
        const profile = getDeviceProfile();

        // Should catch the mobile check
        expect(profile.quality).toContain('mobile');
        expect(profile.powerMode).toBe('low-power');
        expect(profile.frameloop).toBe('demand');
        expect(profile.precision).not.toBe('highp');
    });

    test('should fallback for low-end', () => {
        mockNavigator('Mozilla/5.0 (Linux; Android 10; Mobile)', 2, 2);
        const profile = getDeviceProfile();

        expect(profile.quality).toBe('mobile-low');
        expect(profile.dpr).toBe(1.0);
        expect(profile.frameloop).toBe('demand');
        expect(profile.precision).toBe('lowp');
    });
});
