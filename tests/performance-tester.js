// performance-tester.js
/**
 * Measures FPS and memory usage for a given animation loop.
 */
export class PerformanceTester {
  constructor() {
    this.frameRates = [];
    this.memoryUsage = [];
    this.testDuration = 5000; // Default: 5 seconds
    this.rafId = null; // To store requestAnimationFrame ID
  }

  /**
   * Tests Frames Per Second (FPS) over a set duration.
   * @param {function} animationLoop - The function that runs the animation logic for one frame (e.g., calls animate() and render()).
   * @returns {Promise<number>} Average FPS during the test duration.
   */
  async testFPS(animationLoop) {
    let frames = 0;
    const startTime = performance.now();

    return new Promise(resolve => {
      const countFrame = () => {
        frames++;
        const currentTime = performance.now();

        if (currentTime - startTime < this.testDuration) {
          // Continue animation and counting
          try {
            animationLoop(); // Run the provided animation logic
          } catch (error) {
            console.error("Error during animation loop in FPS test:", error);
            // Optionally stop the test or handle the error
          }
          this.rafId = requestAnimationFrame(countFrame);
        } else {
          // Test duration reached
          const durationSeconds = (currentTime - startTime) / 1000;
          const fps = Math.round(frames / durationSeconds);
          this.frameRates.push(fps);
          console.log(`FPS Test Result: ${fps} FPS over ${durationSeconds.toFixed(2)}s`);
          resolve(fps);
        }
      };

      // Start the loop
      this.rafId = requestAnimationFrame(countFrame);
    });
  }

  /**
   * Tests JavaScript heap memory usage (if available in the browser).
   * @returns {Promise<number|null>} Used JS heap size in bytes, or null if not supported.
   */
  async testMemoryUsage() {
    if (window.performance && window.performance.memory) {
      const memory = window.performance.memory;
      const usedHeap = memory.usedJSHeapSize;
      this.memoryUsage.push(usedHeap);
      console.log(`Memory Test Result: ${ (usedHeap / (1024*1024)).toFixed(2) } MB used JS heap`);
      return usedHeap;
    } else {
      console.warn("Memory usage reporting not supported in this browser.");
      return null;
    }
  }

  /**
   * Stops any ongoing FPS test.
   */
  stopTest() {
      if (this.rafId) {
          cancelAnimationFrame(this.rafId);
          this.rafId = null;
          console.log("Performance test stopped.");
      }
  }

  /**
   * Gets aggregated results from tests run so far.
   * @returns {object} Object containing average FPS, max memory, and qualitative scores.
   */
  getResults() {
    const averageFPS = this.frameRates.length > 0
      ? this.frameRates.reduce((sum, fps) => sum + fps, 0) / this.frameRates.length
      : 0;

    const maxMemory = this.memoryUsage.length > 0
      ? Math.max(...this.memoryUsage)
      : 0;

    // Simple qualitative scoring
    const performanceScore = averageFPS >= 55 ? 'excellent' : (averageFPS >= 45 ? 'good' : (averageFPS >= 30 ? 'fair' : 'poor'));
    const memoryEfficiency = maxMemory === 0 ? 'unknown' : (maxMemory < 50 * 1024 * 1024 ? 'good' : (maxMemory < 100 * 1024 * 1024 ? 'fair' : 'poor')); // Example thresholds (50MB, 100MB)

    return {
      averageFPS: averageFPS.toFixed(1),
      maxMemoryMB: (maxMemory / (1024 * 1024)).toFixed(2),
      performanceScore,
      memoryEfficiency,
      testsRun: this.frameRates.length
    };
  }

  /**
   * Resets collected data.
   */
  reset() {
      this.frameRates = [];
      this.memoryUsage = [];
      this.stopTest(); // Ensure any running test is stopped
  }
}