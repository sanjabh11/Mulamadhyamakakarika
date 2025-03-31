// animation-tester.js
/**
 * Tests individual animation classes derived from BaseAnimation.
 * Assumes animations are refactored into classes.
 */
export class AnimationTester {
  constructor(chapterPath) {
    // chapterPath might be needed if assets are loaded relative to it,
    // but currently unused in this basic tester.
    this.chapterPath = chapterPath;
    this.results = {
      initialization: [],
      animation: [],
      disposal: [],
      performance: []
    };
  }

  /**
   * Tests a single animation class.
   * @param {class} animationClass - The animation class to test (must extend BaseAnimation).
   * @param {object} renderer - A dummy or real Three.js renderer instance.
   * @param {object} verse - The verse data object (including config, colors, etc.).
   * @returns {Promise<object>} Test result object.
   */
  async testAnimation(animationClass, renderer, verse) {
    let animationInstance = null;
    try {
      // --- Test Initialization ---
      const initStartTime = performance.now();
      // Assumes constructor takes renderer and verse
      animationInstance = new animationClass(renderer, verse);
      const initEndTime = performance.now();
      this.results.initialization.push({
          name: animationClass.name,
          duration: initEndTime - initStartTime,
          success: true
      });

      // --- Test Animation Frame ---
      const animStartTime = performance.now();
      // Call animate and render once to check for immediate errors
      if (typeof animationInstance.animate !== 'function') throw new Error("animate() method missing");
      if (typeof animationInstance.render !== 'function') throw new Error("render() method missing");
      animationInstance.animate();
      animationInstance.render();
      const animEndTime = performance.now();
      this.results.animation.push({
          name: animationClass.name,
          duration: animEndTime - animStartTime,
          success: true
      });

      // --- Test Disposal ---
      const disposeStartTime = performance.now();
      if (typeof animationInstance.dispose !== 'function') throw new Error("dispose() method missing");
      animationInstance.dispose();
      const disposeEndTime = performance.now();
      this.results.disposal.push({
          name: animationClass.name,
          duration: disposeEndTime - disposeStartTime,
          success: true
      });

      // --- Performance (Simple Frame Time) ---
      // Note: More robust performance testing is in PerformanceTester
      this.results.performance.push({
          name: animationClass.name,
          frameTime: animEndTime - animStartTime, // Time for one frame
          success: true
      });

      return {
        success: true,
        performance: animEndTime - animStartTime,
        errors: []
      };

    } catch (error) {
      console.error(`Error testing animation ${animationClass.name}:`, error);
      // Ensure dispose is called even if errors occurred after instantiation
      if (animationInstance && typeof animationInstance.dispose === 'function') {
          try {
              animationInstance.dispose();
          } catch (disposeError) {
              console.error(`Error during disposal after test failure for ${animationClass.name}:`, disposeError);
          }
      }
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  /**
   * Tests all animations provided in an animation factory object.
   * @param {object} animationFactory - The object with the createAnimation method.
   * @param {object} renderer - Dummy or real renderer.
   * @param {Array<object>} verses - Array of verse data objects for the chapter.
   * @returns {Promise<object>} Aggregated results.
   */
  async testAllAnimations(animationFactory, renderer, verses) {
    if (!animationFactory || typeof animationFactory.createAnimation !== 'function') {
        console.error("Invalid animationFactory provided to testAllAnimations.");
        return this.results;
    }

    // Need to get the actual classes, the factory only creates instances.
    // This basic tester assumes we can somehow get the classes or test via factory.
    // A more robust approach might involve dynamic imports or a registry.
    // For now, we'll test by creating instances via the factory for each verse.

    const testedAnimationTypes = new Set();
    const testPromises = [];

    for (const verse of verses) {
        if (!verse.animation || testedAnimationTypes.has(verse.animation)) {
            continue; // Skip if no animation type or already tested
        }

        testedAnimationTypes.add(verse.animation);

        try {
            // Create an instance using the factory to get the class indirectly
            // Note: This doesn't directly test the class structure but the factory's output.
            const tempInstance = animationFactory.createAnimation(verse.animation, renderer, verse);
            if (!tempInstance) throw new Error(`Factory returned null for type ${verse.animation}`);

            const animationClass = tempInstance.constructor; // Get the class from the instance
            tempInstance.dispose(); // Dispose the temporary instance

            // Now test the actual class
            testPromises.push(
                this.testAnimation(animationClass, renderer, verse).then(result => ({
                    name: verse.animation, // Use the type name from config
                    ...result
                }))
            );

        } catch (error) {
            console.error(`Error preparing test for animation type ${verse.animation}:`, error);
            this.results.animation.push({
                name: verse.animation,
                success: false,
                errors: [`Failed to create/get class: ${error.message}`]
            });
        }
    }

    // Wait for all individual tests to complete
    const individualResults = await Promise.all(testPromises);

    // Collate results (this part might be redundant if testAnimation updates results directly)
    individualResults.forEach(result => {
        // Find existing entry or add new one
        let entry = this.results.animation.find(r => r.name === result.name);
        if (!entry) {
            entry = { name: result.name };
            this.results.animation.push(entry);
        }
        entry.success = result.success;
        entry.errors = result.errors;
        // Add other metrics if needed
    });


    return this.results;
  }
}