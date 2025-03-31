// chapter-validator.js
import { MigrationLogger } from './migration-logger.js';
import { AnimationTester } from './animation-tester.js';
import { PerformanceTester } from './performance-tester.js';
import * as THREE from 'three'; // Import THREE for dummy renderer

/**
 * Orchestrates the validation process for a migrated chapter.
 */
export class ChapterValidator {
  constructor(chapterName, chapterPath) {
    this.chapterName = chapterName;
    // Assuming chapterPath is relative to the root, e.g., 'public/chapters/ch26'
    this.chapterPath = chapterPath.startsWith('/') ? chapterPath : `/${chapterPath}`;
    this.logger = new MigrationLogger(chapterName);
    this.animationTester = new AnimationTester(this.chapterPath);
    this.performanceTester = new PerformanceTester();
    this.consoleErrors = [];
    this.consoleWarns = [];
    this.originalConsoleError = console.error;
    this.originalConsoleWarn = console.warn;
  }

  /**
   * Runs the full validation suite for the chapter.
   * @returns {Promise<object>} The final validation report from MigrationLogger.
   */
  async validateChapter() {
    this.logger.info(`Starting validation for ${this.chapterName}`);
    this.captureConsoleMessages(); // Start capturing console errors/warnings

    try {
      // --- Dynamically Import Chapter Modules ---
      this.logger.info('Importing chapter modules...');
      let verses, colors, animations;
      try {
        // Use dynamic import with template literals
        const configModule = await import(`${this.chapterPath}/config.js`);
        verses = configModule.verses;
        colors = configModule.colors; // Assuming colors are exported

        const animationModule = await import(`${this.chapterPath}/animations.js`);
        animations = animationModule.animations; // Assuming factory is exported as 'animations'

        if (!verses || !animations) {
            throw new Error('Required exports (verses, animations) not found in modules.');
        }
        this.logger.success('Chapter modules imported successfully.');
      } catch (importError) {
        this.logger.error('Failed to import chapter modules', importError);
        throw importError; // Stop validation if imports fail
      }

      // --- Create Dummy Renderer ---
      // A real renderer might be needed for full validation, but a dummy helps catch basic errors.
      const renderer = this.createDummyRenderer();
      this.logger.info('Using dummy renderer for basic tests.');

      // --- Test Animations ---
      this.logger.info('Testing animations structure and basic execution...');
      const animationResults = await this.animationTester.testAllAnimations(
        animations,
        renderer,
        verses
      );

      // Log animation test results
      let animationErrors = 0;
      animationResults.animation.forEach(result => {
        if (result.success) {
          this.logger.success(`Animation ${result.name} passed basic tests.`);
        } else {
          this.logger.error(`Animation ${result.name} failed: ${result.errors.join(', ')}`);
          animationErrors++;
        }
      });
      if (animationErrors > 0) {
          this.logger.warn(`${animationErrors} animation(s) failed basic tests.`);
      } else {
          this.logger.success('All animations passed basic tests.');
      }

      // --- Test Performance (FPS & Memory) ---
      // This requires running a live animation loop. We'll test the first animation.
      this.logger.info('Testing performance (FPS and Memory) for the first animation...');
      let performanceResults = null;
      if (verses.length > 0 && verses[0].animation) {
          try {
              const firstAnimationType = verses[0].animation;
              const firstVerse = verses[0];
              const liveAnimation = animations.createAnimation(firstAnimationType, renderer, firstVerse);

              if (liveAnimation && typeof liveAnimation.animate === 'function' && typeof liveAnimation.render === 'function') {
                  await this.performanceTester.testFPS(() => {
                      liveAnimation.animate();
                      liveAnimation.render();
                  });
                  await this.performanceTester.testMemoryUsage();
                  performanceResults = this.performanceTester.getResults();
                  this.logger.success(`Performance test completed. Avg FPS: ${performanceResults.averageFPS}, Max Memory: ${performanceResults.maxMemoryMB} MB`);
                  if (performanceResults.performanceScore === 'poor' || performanceResults.memoryEfficiency === 'poor') {
                      this.logger.warn('Performance or memory usage may need optimization.');
                  }
                  liveAnimation.dispose(); // Clean up the live animation instance
              } else {
                  this.logger.warn('Could not create or run the first animation for performance testing.');
              }
          } catch (perfError) {
              this.logger.error('Error during performance testing', perfError);
          }
      } else {
          this.logger.warn('No verses or animations found to run performance tests.');
      }
      this.performanceTester.reset(); // Reset for potential future runs

      // --- Check for Console Errors/Warnings during tests ---
      this.restoreConsoleMessages(); // Stop capturing
      if (this.consoleErrors.length > 0) {
        this.logger.warn(`Detected ${this.consoleErrors.length} console error(s) during validation.`);
        this.consoleErrors.forEach(err => this.logger.error('Console Error:', err));
      }
      if (this.consoleWarns.length > 0) {
        this.logger.warn(`Detected ${this.consoleWarns.length} console warning(s) during validation.`);
        this.consoleWarns.forEach(warn => this.logger.warn('Console Warning:', warn));
      }

      // --- Final Report ---
      const report = this.logger.generateReport();
      this.logger.info(`Validation complete for ${this.chapterName}: ${report.status}`);
      report.performance = performanceResults; // Add performance summary to report
      report.consoleErrorsCaptured = this.consoleErrors;
      report.consoleWarningsCaptured = this.consoleWarns;

      // Optionally save the report
      this.logger.saveReport();

      return report;

    } catch (error) {
      this.restoreConsoleMessages(); // Ensure console is restored even on failure
      this.logger.error('Chapter validation failed with unexpected error', error);
      return this.logger.generateReport(); // Return report even on failure
    }
  }

  /**
   * Creates a minimal dummy THREE.WebGLRenderer for basic testing.
   * Avoids needing a full canvas setup for script-level tests.
   */
  createDummyRenderer() {
    return {
      domElement: null, // No actual canvas
      setPixelRatio: () => {},
      setSize: () => {},
      render: () => {}, // Does nothing
      setClearColor: () => {},
      capabilities: { isWebGL2: true, getMaxAnisotropy: () => 1 }, // Mock capabilities
      info: { render: { calls: 0, triangles: 0 }, memory: { geometries: 0, textures: 0 } }, // Mock info
      shadowMap: { enabled: false },
      dispose: () => {}, // Mock dispose
      // Add other methods/properties as needed by BaseAnimation or specific animations
    };
  }

  /**
   * Captures console.error and console.warn messages.
   */
  captureConsoleMessages() {
      this.consoleErrors = [];
      this.consoleWarns = [];
      console.error = (...args) => {
          this.consoleErrors.push(args);
          this.originalConsoleError.apply(console, args);
      };
      console.warn = (...args) => {
          this.consoleWarns.push(args);
          this.originalConsoleWarn.apply(console, args);
      };
  }

  /**
   * Restores original console.error and console.warn functions.
   */
  restoreConsoleMessages() {
      console.error = this.originalConsoleError;
      console.warn = this.originalConsoleWarn;
  }
}