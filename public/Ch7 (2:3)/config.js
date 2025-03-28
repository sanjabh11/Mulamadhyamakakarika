// Configuration for the meditation on emptiness project
export const config = {
    // Scene settings
    scene: {
        background: 0x000814,
        intensity: 1.0,
        animationSpeed: 1.0,
        cameraDistance: 100,
        cameraFOV: 75, // Increased FOV for better viewing angles
        autoRotate: true,
        autoRotateSpeed: 0.5
    },
    
    // Text display settings
    display: {
        transitionDuration: 1.0,
        autoAdvance: false,
        autoAdvanceDelay: 30, // seconds
        showExplanations: true
    },

    // 3D animation settings - can be adjusted for different systems
    performance: {
        particleCount: 2000,
        usePostProcessing: true,
        qualityLevel: 'high', // 'low', 'medium', 'high'
        useBloom: true,
        useMotionBlur: false
    },
    
    // Interaction settings
    controls: {
        enableZoom: true,
        enablePan: true, // Added panning for better exploration
        enableDamping: true,
        dampingFactor: 0.05,
        maxPolarAngle: Math.PI * 0.9, // Limit rotation angles
        minPolarAngle: Math.PI * 0.1
    }
};