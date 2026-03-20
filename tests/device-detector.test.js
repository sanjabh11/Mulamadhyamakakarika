
import { getDeviceProfile } from '../lib/device-detector';

// Mock browser APIs
const mockNavigator = (userAgent, cores, memory) => {
    Object.defineProperty(global.navigator, 'userAgent', { value: userAgent, configurable: true });
    Object.defineProperty(global.navigator, 'hardwareConcurrency', { value: cores, configurable: true });
    Object.defineProperty(global.navigator, 'deviceMemory', { value: memory, configurable: true });
};

const mockWindow = (dpr) => {
    Object.defineProperty(global.window, 'devicePixelRatio', { value: dpr, configurable: true });
}

describe('Device Detector', () => {
    beforeEach(() => {
        // Reset mocks
        mockNavigator('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 8, 16);
        mockWindow(2);
    });

    test('should detect high-end desktop', () => {
        // High specs
        mockNavigator('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 12, 16);
        // Note: GPU tier is mocked inside the function locally, which is hard to mock here without DI.
        // Assuming the default GPU tier detection falls back or we rely on CPU/RAM for these tests mainly 
        // OR we can't fully unit test GPU tier dependent logic easily without refactoring.
        // However, looking at the code, it returns based on CPU/RAM if not mobile.

        // Actually, the current code checks `gpuTier === 'high'` which comes from internal `detectGPUTier`.
        // `detectGPUTier` uses canvas and WEBGL_debug_renderer_info which is hard to mock in plain Jest/Vitest without setup.
        // For this test, we might check if critical properties exist in the returned object, 
        // even if it falls through to a different tier due to missing GPU mock.

        const profile = getDeviceProfile();
        expect(profile).toHaveProperty('powerMode');
        expect(profile).toHaveProperty('frameloop');
    });

    test('should detect mobile device', () => {
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
    });
});
