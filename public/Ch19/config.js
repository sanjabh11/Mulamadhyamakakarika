// Configuration settings for animations
export const config = {
    // Verse 1: Quantum Eraser Experiment
    quantumEraser: {
        photonRate: 50, // Photons per second
        slitWidth: 0.2, // Width of slits
        slitDistance: 1, // Distance between slits
        measurementOn: false, // Whether measurement is active
        eraserOn: false, // Whether quantum eraser is active
        particleColor: 0x4cc9f0, // Color of photon particles
        waveColor: 0x7209b7, // Color of wave visualization
        backgroundColor: 0x1a1a2e, // Background color
        cameraDistance: 15, // Camera distance from center
        particleSize: 0.08, // Size of particles
    },
    
    // Verse 2: Delayed Choice Experiment
    delayedChoice: {
        measurementTiming: 50, // When measurement occurs (0-100%)
        choiceType: 'wave', // 'wave' or 'particle'
        particleSpeed: 0.15, // Speed of particles
        patternScale: 2, // Scale of interference pattern
        particleColor: 0x7209b7, // Color of particles
        cameraSpeed: 0.01, // Camera rotation speed
        patternIntensity: 0.8, // Interference pattern intensity
    },
    
    // Verse 3: Time Dilation
    timeDilation: {
        velocity: 50, // % of speed of light
        observerPerspective: 'stationary', // 'stationary' or 'moving'
        clockSize: 3, // Size of clocks
        clockDetail: 16, // Detail level of clock models
        statClockColor: 0x4361ee, // Stationary clock color
        movingClockColor: 0xff6b6b, // Moving clock color
        spaceGridSize: 30, // Size of spacetime grid
        spacetimeEffects: true, // Enable spacetime distortion effects
    },
    
    // Verse 4: Uncertainty Principle
    uncertaintyPrinciple: {
        positionPrecision: 50, // Higher = more precise position measurement
        visualizationType: 'both', // 'position', 'momentum', or 'both'
        wavePacketSize: 1, // Size of wave packet
        waveColor: 0x4cc9f0, // Color of wave visualization
        gridColor: 0xf72585, // Color of measurement grid
        animation3D: true, // Enable 3D wave packet visualization
        waveSpeed: 1.0, // Wave animation speed
    },
    
    // Verse 5: Energy-Time Uncertainty
    energyTimeUncertainty: {
        measurementDuration: 50, // Duration of measurement
        energyLevel: 1, // Energy state (1-5)
        particleCount: 150, // Number of particles in visualization
        energyColors: [0x3a0ca3, 0x4361ee, 0x4cc9f0, 0x7209b7, 0xf72585], // Colors for energy levels
        transitionEffects: true, // Enable particle transition effects
        energyVisualScale: 1.5, // Scale of energy level visualization
    },
    
    // Verse 6: Entropy and Arrow of Time
    entropy: {
        particleCount: 300, // Number of particles
        temperature: 50, // System temperature
        containerSize: 10, // Size of container
        lowEntropyColor: 0x3a0ca3, // Color for low entropy state
        highEntropyColor: 0xf72585, // Color for high entropy state
        particleSpeed: 2.5, // Base speed of particles
        showEntropyGraph: true, // Show real-time entropy graph
    }
};

// UI preferences
export const uiConfig = {
    animationTransitionDuration: 1000, // Duration of transition between animations in ms
    textFadeSpeed: 300, // Speed of text fading in ms
    particleRenderSize: 8, // Size of rendered particles in px
    showFPS: true, // Whether to show FPS counter
    autoRotateObjects: true, // Auto-rotate 3D objects
    rotationSpeed: 0.01, // Rotation speed for objects
    cameraControls: true, // Enable camera controls
    showLoadingIndicator: true, // Show loading indicator when changing animations
    enableBloom: true, // Enable bloom effect for particles
    enablePostProcessing: true, // Enable post-processing effects
};