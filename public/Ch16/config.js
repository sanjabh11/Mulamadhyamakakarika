// Configuration settings for our quantum physics visualizations
export const config = {
    // General settings
    animationSpeed: 1.0,  // Speed multiplier for all animations
    particleCount: 1000,  // Number of particles for effects
    
    // Visualization specific settings for each verse
    verse1: {
        // Double-slit experiment
        slitDistance: 1.0,      // Distance between the two slits
        waveIntensity: 0.8,     // Intensity of the wave pattern
        collapseSpeed: 0.5,     // How quickly the wave collapses on interaction
    },
    
    verse2: {
        // Entangled particles
        particleDistance: 2.5,   // Distance between entangled particles
        connectionStrength: 0.7, // Visual strength of entanglement connection
        rotationSpeed: 0.02,     // How fast the particles rotate
    },
    
    verse3: {
        // Wave collapse
        waveSpread: 3.0,         // How far the wave spreads
        collapseRadius: 0.2,     // Final radius after collapse
        waveColor: 0x4cc9f0,     // Color of the wave
    },
    
    verse4: {
        // Uncertainty principle
        initialUncertainty: 0.5, // Starting uncertainty value
        maxPrecision: 0.9,       // Maximum achievable precision
        particleSize: 0.3,       // Size of the particle
    },
    
    verse5: {
        // Superposition states
        stateDistance: 2.0,      // Distance between bound/free states
        oscillationSpeed: 0.01,  // Speed of oscillation between states
        collapseTime: 1000,      // Time (ms) for state to collapse
    },
    
    verse6: {
        // Observer effect
        observerDistance: 3.0,   // Distance of observer from observed
        waveComplexity: 5,       // Complexity of the wave function
        collapseDelay: 500,      // Delay (ms) before collapse starts
    },
    
    verse7: {
        // Entanglement without temporal order
        particleSize: 0.4,       // Size of entangled particles
        correlationSpeed: 0.8,   // Speed of correlation effect
        spinRate: 0.03,          // Rotation rate of particles
    },
    
    verse8: {
        // Paradox visualization
        stateBlendFactor: 0.5,   // How much states blend together
        transitionSpeed: 0.02,   // Speed of transition between states
        boundColor: 0xff3366,    // Color for "bound" state
        freeColor: 0x33ff99,     // Color for "free" state
    },
    
    verse9: {
        // Quantum Zeno effect
        freezeThreshold: 5,      // Number of measurements to freeze state
        decayRate: 0.05,         // Rate of natural state change
        measurementEffect: 0.2,  // Visual impact of measurement
    },
    
    verse10: {
        // Quantum contextuality
        perspectiveCount: 3,     // Number of different perspectives
        rotationAngle: Math.PI/4,// Angle between perspectives
        transitionTime: 800,     // Time (ms) for perspective transition
    }
};

// Verse content database
export const verseData = [
    {
        id: 1,
        title: "The Emptiness of Samsara through Tetralemma",
        madhyamakaConcept: "Emptiness of samsara through tetralemma, neither permanent nor impermanent",
        quantumPhysics: "Superposition, particle in multiple states until measured",
        explanation: "Picture a gift box that could hold a book, a toy, or nothing—until you open it, it's all of those things at once. Similarly, samsara isn't fixed as permanent or impermanent; it's our perception that defines it."
    },
    {
        id: 2,
        title: "No-self Doctrine and Dependent Aggregates",
        madhyamakaConcept: "No-self doctrine, person dependent on aggregates",
        quantumPhysics: "Entanglement, particles interconnected without independent existence",
        explanation: "Think of two best friends who always know what the other is thinking, like they're linked. The self is like that— not a solo thing, but a mix of thoughts, feelings, and experiences tied together."
    },
    {
        id: 3,
        title: "The Emptiness of Clinging and Becoming",
        madhyamakaConcept: "Emptiness of clinging and becoming, no inherent entity",
        quantumPhysics: "Measurement problem, measurement determines state like clinging",
        explanation: "Imagine staring at a blurry photo: focusing on it (like measuring) makes it sharp, but it's still just an image. Clinging works the same way—it creates a sense of self, but there's no solid 'you' there."
    },
    {
        id: 4,
        title: "Inherent Constraints in Samsara",
        madhyamakaConcept: "Inherent constraints in samsara, misery inescapable from inherent view",
        quantumPhysics: "Uncertainty principle, limits in knowing properties",
        explanation: "It's like trying to grab a wet bar of soap—the harder you squeeze, the more it slips. In samsara, suffering sticks around because we can't fully control or escape it."
    },
    {
        id: 5,
        title: "The Emptiness of Bondage and Freedom",
        madhyamakaConcept: "Emptiness of bondage and freedom, neither bound nor freed ultimately",
        quantumPhysics: "Quantum indeterminacy, particle neither in one state nor another",
        explanation: "Imagine flipping a coin in the air—it's neither heads nor tails until it lands. Similarly, we're not truly bound or free until we label it that way."
    },
    {
        id: 6,
        title: "The Ambiguity of Subject-Object in Clinging",
        madhyamakaConcept: "Ambiguity of subject-object in clinging, both empty",
        quantumPhysics: "Wave function collapse, measurement blurs observer-observed",
        explanation: "Think of taking a selfie: the moment you snap it, you change the scene by being in it. In samsara, grasping at things makes them seem real, but both you and the 'thing' are empty."
    },
    {
        id: 7,
        title: "Interdependence without Temporal Precedence",
        madhyamakaConcept: "Interdependence without temporal precedence, binding and bound co-arise",
        quantumPhysics: "Entanglement, correlation without temporal order",
        explanation: "Picture two dancers moving perfectly in sync—no one leads, they just flow together. Binding and being bound in samsara are like that, happening together without a 'first step.'"
    },
    {
        id: 8,
        title: "The Paradox of Bondage and Freedom",
        madhyamakaConcept: "Paradox of bondage and freedom, both empty of inherent existence",
        quantumPhysics: "Superposition, system in multiple states simultaneously",
        explanation: "Imagine a cat in a box, alive and dead until you check. Similarly, we can be seen as bound and free at the same time—until we decide, it's all empty."
    },
    {
        id: 9,
        title: "Grasping at Non-grasping",
        madhyamakaConcept: "Grasping at non-grasping, attachment to non-attachment",
        quantumPhysics: "Quantum Zeno effect, frequent measurement reinforces state",
        explanation: "It's like watching a pot to see if it'll boil—keep checking, and it won't. Trying hard to let go of clinging can turn into a new kind of clinging."
    },
    {
        id: 10,
        title: "The Conventional Nature of Samsara and Nirvana",
        madhyamakaConcept: "Conventional nature of samsara and nirvana, dependent on perspective",
        quantumPhysics: "Quantum contextuality, measurement outcomes depend on context",
        explanation: "Think of a prism: tilt it one way, you see red; another, blue. Samsara and nirvana are like that—what you see depends on how you look at reality."
    }
];