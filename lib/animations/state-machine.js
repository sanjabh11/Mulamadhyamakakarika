import { logger } from "@/lib/logger";
/**
 * Animation State Machine
 * 
 * Manages animation states, transitions, and interactions for verse visualizations
 * Supports complex state-based animations with triggers and callbacks
 */

export class AnimationStateMachine {
  constructor(stateDefinitions, initialState = 'idle') {
    this.states = stateDefinitions;
    this.currentState = initialState;
    this.previousState = null;
    this.listeners = new Set();
    this.animationQueue = [];
    this.isTransitioning = false;
  }

  /**
   * Get current state definition
   */
  getCurrentState() {
    return this.states[this.currentState];
  }

  /**
   * Transition to a new state
   */
  async transitionTo(newState, context = {}) {
    if (!this.states[newState]) {
      console.warn(`State "${newState}" not found`);
      return false;
    }

    if (this.isTransitioning) {
      logger.log('State transition already in progress');
      return false;
    }

    this.isTransitioning = true;
    this.previousState = this.currentState;
    const fromState = this.states[this.currentState];
    const toState = this.states[newState];

    // Execute exit callback if exists
    if (fromState.onExit) {
      await fromState.onExit(context);
    }

    // Execute the transition animation
    if (toState.animation) {
      await this.executeAnimation(toState.animation, context);
    }

    // Update current state
    this.currentState = newState;

    // Execute enter callback
    if (toState.onEnter) {
      await toState.onEnter(context);
    }

    // Notify listeners
    this.notifyListeners({
      type: 'stateChange',
      from: this.previousState,
      to: this.currentState,
      context
    });

    this.isTransitioning = false;

    // Handle auto-transition if specified
    if (toState.transition_to && toState.duration) {
      setTimeout(() => {
        this.transitionTo(toState.transition_to, context);
      }, toState.duration);
    }

    return true;
  }

  /**
   * Execute animation sequence
   */
  async executeAnimation(animation, context) {
    const animations = Array.isArray(animation) ? animation : [animation];
    
    for (const anim of animations) {
      await this.executeAnimationStep(anim, context);
    }
  }

  /**
   * Execute a single animation step
   */
  executeAnimationStep(animationDef, context) {
    return new Promise((resolve) => {
      const duration = animationDef.duration || 1000;
      const startTime = Date.now();
      const easing = animationDef.easing || (t => t); // Linear default

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);

        // Notify listeners with animation progress
        this.notifyListeners({
          type: 'animationProgress',
          animation: animationDef,
          progress: easedProgress,
          context
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Animation complete
          this.notifyListeners({
            type: 'animationComplete',
            animation: animationDef,
            context
          });
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  /**
   * Handle user interaction trigger
   */
  handleTrigger(triggerId, data = {}) {
    const currentState = this.states[this.currentState];
    
    // Find matching trigger in current state
    const triggerMatch = Object.entries(this.states).find(([stateName, state]) => {
      return state.trigger?.id === triggerId || 
             state.trigger?.target === triggerId;
    });

    if (triggerMatch) {
      const [nextState, stateConfig] = triggerMatch;
      this.transitionTo(nextState, { triggerData: data });
    } else {
      logger.log(`No state transition for trigger: ${triggerId}`);
    }
  }

  /**
   * Subscribe to state machine events
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   */
  notifyListeners(event) {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  /**
   * Reset to initial state
   */
  reset(initialState = 'idle') {
    this.currentState = initialState;
    this.previousState = null;
    this.animationQueue = [];
    this.isTransitioning = false;
    
    this.notifyListeners({
      type: 'reset',
      state: this.currentState
    });
  }

  /**
   * Get state history
   */
  getHistory() {
    return {
      current: this.currentState,
      previous: this.previousState
    };
  }
}

/**
 * Create a state machine from a verse configuration
 */
export function createVerseStateMachine(verseConfig) {
  const stateDefinitions = verseConfig.states || {};
  const initialState = verseConfig.initial_state || 'idle';
  
  return new AnimationStateMachine(stateDefinitions, initialState);
}

/**
 * Helper: Create a simple fade animation
 */
export function createFadeAnimation(target, from, to, duration = 500) {
  return {
    target,
    property: 'opacity',
    from,
    to,
    duration,
    easing: t => t // Linear
  };
}

/**
 * Helper: Create a movement animation
 */
export function createMoveAnimation(target, fromPos, toPos, duration = 1000) {
  return {
    target,
    property: 'position',
    from: fromPos,
    to: toPos,
    duration,
    easing: t => 1 - Math.pow(2, -10 * t) // easeOutExpo
  };
}

/**
 * Helper: Create a scale animation
 */
export function createScaleAnimation(target, fromScale, toScale, duration = 800) {
  return {
    target,
    property: 'scale',
    from: fromScale,
    to: toScale,
    duration,
    easing: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 // easeInOutQuad
  };
}

export default {
  AnimationStateMachine,
  createVerseStateMachine,
  createFadeAnimation,
  createMoveAnimation,
  createScaleAnimation
};
