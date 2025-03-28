// Configuration settings for the animations
export const config = {
    // Global animation settings
    global: {
        animationSpeed: 1.0,
        backgroundColor: "#121212",
        particleColor: "#3a7bd5",
        secondaryColor: "#00d2ff",
        accentColor: "#ff7675",
        showFPS: false
    },
    
    // Verse 1: Double Slit Experiment
    verse1: {
        electronCount: 100,
        slitWidth: 0.2,
        slitSeparation: 1.0,
        measurementEnabled: false,
        electronSpeed: 0.5
    },
    
    // Verse 2: Identical Electrons
    verse2: {
        electronCount: 8,
        orbitalLevels: 3,
        swapDuration: 2000,
        highlightColor: "#ff7675"
    },
    
    // Verse 3: Quantum Entanglement
    verse3: {
        particleDistance: 5,
        correlationStrength: 0.95,
        spinVisualizationSpeed: 0.5,
        measurementProbability: 0.5
    },
    
    // Verse 4: Quantum Superposition
    verse4: {
        superpositionBlur: 0.8,
        collapseProbability: 0.5,
        transitionSpeed: 1.0,
        stateColors: ["#3a7bd5", "#00d2ff", "#ff7675"]
    },
    
    // Verse 5: Particle-Antiparticle Creation
    verse5: {
        energyLevel: 0.7,
        pairLifetime: 2000,
        particleSize: 0.4,
        creationRate: 0.5
    },
    
    // Verse 6: Entangled Particle Correlation
    verse6: {
        particleCount: 2,
        correlationDistance: 5,
        interactionStrength: 0.8,
        visualizationScale: 1.0
    },
    
    // Verse 7: Qubit Superposition
    verse7: {
        blochSphereSize: 2.0,
        rotationSpeed: 0.5,
        stateVectorColor: "#00d2ff",
        sphereOpacity: 0.3
    },
    
    // Verse 8: Radioactive Decay
    verse8: {
        neutronSize: 0.8,
        decayProbability: 0.01,
        particleTrailLength: 20,
        decayAnimationSpeed: 1.0
    },
    
    // Verse 9: Wave Packet Spreading
    verse9: {
        initialWidth: 0.5,
        spreadingRate: 0.05,
        waveAmplitude: 1.0,
        timeScale: 1.0
    },
    
    // Verse 10: Schrödinger's Cat
    verse10: {
        decayProbability: 0.5,
        boxSize: 3.0,
        catAnimationSpeed: 0.8,
        superpositionVisualization: 0.7
    },
    
    // Verse 11: Quantum Information Conservation
    verse11: {
        systemSize: 3.0,
        interactionStrength: 0.5,
        decoherenceRate: 0.1,
        informationVisualization: 0.8
    }
};

// Verse content data
export const verseData = [
    {
        id: 1,
        title: "Verse 1: Essence and Causes",
        originalVerse: "It is unreasonable for an essence to arise from causes and conditions. Whatever essence arose from causes and conditions would be something that has been made.",
        madhyamakaConcept: "Essence, by definition, is intrinsic and independent. If it arises from causes, it is dependent and fabricated, contradicting its definition.",
        quantumParallel: "Wave function collapse shows properties are determined upon measurement, not inherent, similar to essences being \"made.\"",
        accessibleExplanation: "Quantum particles lack fixed properties until measured, like a box revealing its content only when opened."
    },
    {
        id: 2,
        title: "Verse 2: Fabricated Essence",
        originalVerse: "How is it possible for there to be 'an essence which has been made?' Essences are not contrived and not dependent on anything else.",
        madhyamakaConcept: "The notion of a fabricated essence is incoherent because essences are supposed to be uncontrived and independent.",
        quantumParallel: "Identical particles in quantum mechanics are indistinguishable, lacking unique properties, suggesting no inherent essence.",
        accessibleExplanation: "Quantum particles are like identical twins with no individual identities, indicating the absence of inherent essence."
    },
    {
        id: 3,
        title: "Verse 3: Relational Identity",
        originalVerse: "If an essence does not exist, how can the thingness of the other exist? For the essence of the thingness of the other is said to be the thingness of the other.",
        madhyamakaConcept: "Without inherent essence, relational identities also collapse, as they depend on the notion of essence.",
        quantumParallel: "Quantum entanglement demonstrates that particles' states are interdependent, not inherent.",
        accessibleExplanation: "Entangled particles have correlated properties, similar to friends who always match their outfits."
    },
    {
        id: 4,
        title: "Verse 4: Emptiness",
        originalVerse: "Apart from an essence and the thingness of the other, what things are there? If essences and thingnesses of others existed, things would be established.",
        madhyamakaConcept: "Without essence or relational identity, things lack inherent establishment; they are empty.",
        quantumParallel: "Quantum systems in superposition do not have definite properties until measured, similar to lacking inherent essence.",
        accessibleExplanation: "Quantum particles are like chameleons whose properties depend on how they are observed."
    },
    {
        id: 5,
        title: "Verse 5: Non-things",
        originalVerse: "If things were not established, non-things would not be established. When a thing becomes something else, people say that it is a non-thing.",
        madhyamakaConcept: "Without inherent things, the concept of non-things also does not hold. Change implies impermanence, not inherent existence.",
        quantumParallel: "Particle creation and annihilation show that particles are not permanent; they can come into and out of existence.",
        accessibleExplanation: "Particles can appear and disappear like magician's rabbits, indicating they lack permanent essence."
    },
    {
        id: 6,
        title: "Verse 6: The Other",
        originalVerse: "If the other exists, what is its essence? If it is not established as something else, then it cannot exist.",
        madhyamakaConcept: "Without inherent essence, the concept of \"the other\" lacks basis; all designations are relative.",
        quantumParallel: "Entangled particles' properties are defined relationally, not independently.",
        accessibleExplanation: "Just as positions are relative, the properties of entangled particles are interdependent."
    },
    {
        id: 7,
        title: "Verse 7: Middle Way",
        originalVerse: "Through knowing things and non-things, the Buddha negated both existence and non-existence in his Advice to Katyayana.",
        madhyamakaConcept: "The Middle Way avoids the extremes of existence and non-existence, advocating for dependent origination and emptiness.",
        quantumParallel: "Superposition in quantum mechanics allows states that are neither definitively one nor the other, avoiding extremes.",
        accessibleExplanation: "Quantum particles in superposition are like spinning coins that are neither heads nor tails until observed."
    },
    {
        id: 8,
        title: "Verse 8: Impermanence",
        originalVerse: "If things existed essentially, they would not come to non-existence. It is never the case that an essence could become something else.",
        madhyamakaConcept: "If things had inherent essence, they would be permanent and unchanging, but since they change, they lack essence.",
        quantumParallel: "Radioactive decay illustrates that particles can transform, indicating they lack a fixed essence.",
        accessibleExplanation: "Particles can change form, similar to ice melting into water, showing they do not have an unchanging essence."
    },
    {
        id: 9,
        title: "Verse 9: Impossibility of Change",
        originalVerse: "If essences did not exist, what could become something else? Even if essences existed, what could become something else?",
        madhyamakaConcept: "Both the existence and non-existence of essences lead to the impossibility of change, yet change occurs, implying emptiness.",
        quantumParallel: "Quantum particles lack definite trajectories, suggesting they do not have a fixed essence over time.",
        accessibleExplanation: "Like trying to follow a drop of water in a river, quantum particles do not have definite paths or identities."
    },
    {
        id: 10,
        title: "Verse 10: Avoiding Extremes",
        originalVerse: "\"Existence\" is the grasping at permanence; \"non-existence\" is the view of annihilation. Therefore, the wise do not dwell in existence or non-existence.",
        madhyamakaConcept: "The wise avoid the extremes of eternalism and nihilism, understanding the Middle Way.",
        quantumParallel: "Superposition embodies states that are beyond binary existence or non-existence.",
        accessibleExplanation: "Quantum states in superposition are like spinning coins that are not definitively one side or the other."
    },
    {
        id: 11,
        title: "Verse 11: Eternalism and Nihilism",
        originalVerse: "\"Since that which exists by its essence is not non-existent,\" is the view of permanence. \"That which arose before is now non-existent,\" leads to the view of annihilation.",
        madhyamakaConcept: "This verse explains the extremes of eternalism and nihilism, both of which are rejected in favor of the Middle Way.",
        quantumParallel: "The conservation of quantum information indicates that while states transform, the information persists, avoiding both permanence and annihilation.",
        accessibleExplanation: "Similar to translating a book where the content changes form but is not lost, quantum information is preserved through transformations."
    }
];

