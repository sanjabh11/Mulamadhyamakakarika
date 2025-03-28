// Configuration for the Investigation of Anguish visualization
export const verses = [
    {
        number: 1,
        text: "Some assert that anguish arises from being made by self, made by other, by both, without cause. To do that is not suitable.",
        madhyamakaExplanation: "This verse refutes four views on suffering's origin (self-caused, other-caused, both, or without cause), as they imply inherent existence, contradicting dependent origination.",
        quantumParallel: "Wave-Particle Duality: Particles show wave or particle behavior depending on observation, indicating phenomena lack inherent nature, similar to suffering's non-inherent cause.",
        accessibleExplanation: "Imagine a friend who acts differently depending on who's watching—particles change too; suffering doesn't have a fixed cause.",
        animationType: "doubleSlit"
    },
    {
        number: 2,
        text: "If it were made by self, therefore it would not be contingently arising, because those aggregates arise contingently on these aggregates.",
        madhyamakaExplanation: "Argues against self-causation, since the self (aggregates) arises dependently, not inherently, supporting the concept of anatta (no-self).",
        quantumParallel: "Wave Function Collapse: A quantum system's state emerges only upon measurement, not inherently, mirroring suffering's conditional nature.",
        accessibleExplanation: "Think of a magic trick where the rabbit appears only when the hat is lifted—suffering arises from conditions, not by itself.",
        animationType: "waveCollapse"
    },
    {
        number: 3,
        text: "If that were other than this and if this were other than that, anguish would be made by other and that would be made by those others.",
        madhyamakaExplanation: "Challenges the separation of self and other, highlighting their interdependence and lack of inherent existence.",
        quantumParallel: "Quantum Entanglement: Correlated particles influence each other instantly, showing interconnectedness, like self and other being linked.",
        accessibleExplanation: "Picture two dancers moving in sync—entangled particles affect each other; self and other aren't truly separate.",
        animationType: "entanglement"
    },
    {
        number: 4,
        text: "If anguish were made by one's own person, who would that person be who has made anguish by himself, but is not included in the anguish?",
        madhyamakaExplanation: "Questions how the self can cause suffering yet remain separate from it, showing self and suffering are intertwined.",
        quantumParallel: "Many-Worlds Interpretation: The observer is part of the quantum system, not separate, akin to self being inseparable from suffering.",
        accessibleExplanation: "Imagine a story where the hero is also the villain—the self can't be detached from suffering.",
        animationType: "manyWorlds"
    },
    {
        number: 5,
        text: "If anguish arose from another person, how could it be suitable for there to be someone not included in the anguish, who has been given it by another who made the anguish?",
        madhyamakaExplanation: "Critiques suffering as something handed over by another, suggesting no real separation between persons exists.",
        quantumParallel: "EPR Paradox: Entangled particles show instant correlation, challenging separation, much like interconnected persons.",
        accessibleExplanation: "Like how one friend's mood lifts or sinks another's, we're linked—suffering isn't just passed along.",
        animationType: "eprParadox"
    },
    {
        number: 6,
        text: "If anguish arose from another person, who would that other person be who, having made it, gives it to someone else, but is not included in the anguish?",
        madhyamakaExplanation: "Questions the idea of an unaffected causer of suffering, as all involved experience suffering.",
        quantumParallel: "Back-Action in Quantum Measurements: Measuring a system affects both the system and the measurer, showing mutual influence.",
        accessibleExplanation: "Think of two people pushing a cart—both feel the effort; causing suffering impacts everyone.",
        animationType: "backAction"
    },
    {
        number: 7,
        text: "Since it is not established as made by self, how can anguish have been made by other? For whatever anguish is made by other, that has been made by his self.",
        madhyamakaExplanation: "Shows that rejecting self-causation undermines other-causation, revealing their inconsistency.",
        quantumParallel: "Bell's Theorem: Rules out local hidden variables, indicating no fixed causes, like suffering lacking inherent origins.",
        accessibleExplanation: "Like a child's endless \"why\" questions, quantum events defy simple causes—suffering does too.",
        animationType: "bellTheorem"
    },
    {
        number: 8,
        text: "Anguish is not made by self; that is not made by that itself. If it is not made by an other self, how can anguish be made by other?",
        madhyamakaExplanation: "Rejects both self and other as causes of suffering, affirming its emptiness and dependent nature.",
        quantumParallel: "Vacuum Fluctuations: Particles emerge without a specific cause due to quantum uncertainty, similar to suffering's dependent arising.",
        accessibleExplanation: "Picture random noises in a silent room—particles pop up without reason; suffering arises the same way.",
        animationType: "vacuumFluctuations"
    },
    {
        number: 9,
        text: "If it is made by each, anguish would be made by both. Not made by self, not made by other, how can anguish have no cause?",
        madhyamakaExplanation: "Dismisses causation by both self and other, as well as no cause, reinforcing dependent origination.",
        quantumParallel: "Statistical Laws: Individual quantum events are random, but patterns emerge, like suffering's conditional nature.",
        accessibleExplanation: "Like rolling dice—each throw is random, but trends appear; suffering follows conditions, not fixed rules.",
        animationType: "statisticalLaws"
    },
    {
        number: 10,
        text: "Not only does anguish alone not have the four aspects; external things too do not have the four aspects.",
        madhyamakaExplanation: "Extends the rejection of the four aspects (self, other, both, no cause) to all phenomena, showing their emptiness.",
        quantumParallel: "Principle of Complementarity: Phenomena lack inherent properties and depend on context, like all things lacking fixed nature.",
        accessibleExplanation: "Think of a coin that's heads and tails until you look—it's not fixed until observed; neither is anything else.",
        animationType: "doubleSlit" // Using double slit again for complementarity
    }
];

export const animationSettings = {
    doubleSlit: {
        particleCount: 100,
        particleSpeed: 0.8,
        slitWidth: 0.5,
        observationProbability: 0.5
    },
    waveCollapse: {
        waveAmplitude: 0.5,
        collapseSpeed: 0.8,
        complexity: 5
    },
    entanglement: {
        particlePairs: 10,
        correlationStrength: 0.9,
        distanceFactor: 3
    },
    manyWorlds: {
        branchingFactor: 3,
        maxDepth: 4,
        branchingProbability: 0.7
    },
    eprParadox: {
        particleSpeed: 0.8,
        measurementDelay: 1000,
        particleCount: 2
    },
    backAction: {
        systemComplexity: 4,
        interactionStrength: 0.7,
        feedbackRate: 0.5
    },
    bellTheorem: {
        angleVariation: 45,
        correlationVisibility: 0.8,
        particlePairs: 50
    },
    vacuumFluctuations: {
        fluctuationRate: 0.8,
        particleLifetime: 2000,
        energyDensity: 0.6
    },
    statisticalLaws: {
        eventCount: 100,
        randomnessFactor: 0.7,
        patternVisibility: 0.6
    }
};

// Color schemes for different animations
export const colorSchemes = {
    primary: {
        background: 0x0f172a,
        particles: 0x8B5CF6,
        waves: 0x10b981,
        highlight: 0x3a7bd5,
        secondary: 0x00d2ff
    },
    accent: {
        light: 0xe0f2fe,
        medium: 0x93c5fd,
        dark: 0x3b82f6
    }
};

// Global animation settings
export const globalSettings = {
    rotationSpeed: 0.001,
    transitionDuration: 1.2,
    particleSize: 0.05,
    cameraDistance: 10
};

