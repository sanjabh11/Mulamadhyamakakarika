// Configuration for verses and their related content
export const verses = [
    {
        number: 13,
        text: "The simultaneous connection of a present fruit with a future, a past, and a present cause never exists.",
        madhyamaka: "Denies fixed temporal links across past, present, and future; cause and effect are interdependent, empty of inherent existence.",
        quantum: "Heisenberg uncertainty principle: Position and momentum cannot be known simultaneously, disrupting classical time relations.",
        explanation: "Like trying to snap a photo of a speeding car, you can't catch both its spot and speed at once—time blurs connections.",
        controls: [
            { type: "button", label: "Toggle Uncertainty", action: "toggleUncertainty" },
            { type: "slider", label: "Precision", min: 0, max: 1, step: 0.01, value: 0.5, action: "setPrecision" }
        ]
    },
    {
        number: 14,
        text: "The simultaneous connection of a future fruit with a present, a future, and a past cause never exists.",
        madhyamaka: "Rejects simultaneous causal links for future effects, emphasizing temporal interdependence and emptiness.",
        quantum: "Delayed choice experiment: Present choices affect past event interpretations, challenging linear causality.",
        explanation: "Deciding today how to read yesterday's story—present actions reshape past meanings, not fixed links.",
        controls: [
            { type: "button", label: "Make Choice", action: "makeChoice" },
            { type: "button", label: "Reset Experiment", action: "resetExperiment" }
        ]
    },
    {
        number: 15,
        text: "When there is no connection, how can a cause produce fruit? Even when there is connection, how can a cause produce fruit?",
        madhyamaka: "Questions causation's basis with or without connection, revealing its paradoxical, empty nature.",
        quantum: "Quantum tunneling: Particles cross barriers without a classical link, defying traditional cause-effect.",
        explanation: "A ball passes through a wall without force—quantum effects happen without clear connections.",
        controls: [
            { type: "button", label: "Classical Mode", action: "setClassicalMode" },
            { type: "button", label: "Quantum Mode", action: "setQuantumMode" },
            { type: "slider", label: "Barrier Height", min: 0, max: 1, step: 0.01, value: 0.5, action: "setBarrierHeight" }
        ]
    },
    {
        number: 16,
        text: "If a cause is empty of fruit, how can it produce fruit? If a cause is not empty of fruit, how can it produce fruit?",
        madhyamaka: "Emptiness paradox: if cause lacks effect, how produce it? If it has it, why produce again?",
        quantum: "Quantum decoherence: Systems shift from quantum to classical via interaction, effects emerge relationally.",
        explanation: "A spinning top in many states settles when watched—effects come from interaction, not fixed causes.",
        controls: [
            { type: "button", label: "Observe System", action: "observeSystem" },
            { type: "button", label: "Reset Superposition", action: "resetSuperposition" }
        ]
    },
    {
        number: 17,
        text: "Unempty fruit would not be produced; the unempty would not stop. That unempty is unstoppable and also unproducable.",
        madhyamaka: "If effects were inherent, they couldn't arise or cease—change requires emptiness of inherent existence.",
        quantum: "Particle-antiparticle annihilation: Particles vanish upon collision, lacking inherent permanence.",
        explanation: "Particles turn into energy when they meet their opposite—they're not fixed, showing no inherent existence.",
        controls: [
            { type: "button", label: "Trigger Collision", action: "triggerCollision" },
            { type: "button", label: "Reset Particles", action: "resetParticles" }
        ]
    },
    {
        number: 18,
        text: "How would empty [fruit] be produced? And how would the empty stop? It follows that that empty too is unstoppable and also unproducable.",
        madhyamaka: "Emptiness enables conventional arising and ceasing; phenomena lack inherent production or cessation.",
        quantum: "Quantum fluctuations in vacuum: Particles briefly appear and vanish in \"empty\" space, showing potential.",
        explanation: "Even \"nothing\" buzzes with temporary particles—emptiness has room for things to pop up and fade.",
        controls: [
            { type: "button", label: "Increase Energy", action: "increaseEnergy" },
            { type: "button", label: "Decrease Energy", action: "decreaseEnergy" },
            { type: "slider", label: "Zoom Level", min: 0.5, max: 3, step: 0.1, value: 1, action: "setZoom" }
        ]
    },
    {
        number: 19,
        text: "It is never possible that cause and fruit are identical. It is never possible that cause and fruit are other.",
        madhyamaka: "Rejects cause-effect as same or different; they arise interdependently via dependent origination.",
        quantum: "Quantum superposition in qubits: States are both 0 and 1, defying strict identity or difference.",
        explanation: "A qubit is 0 and 1 at once—cause and effect aren't fully same or separate, they blend together.",
        controls: [
            { type: "button", label: "Rotate X", action: "rotateX" },
            { type: "button", label: "Rotate Y", action: "rotateY" },
            { type: "button", label: "Rotate Z", action: "rotateZ" }
        ]
    },
    {
        number: 20,
        text: "If cause and fruit were identical, producer and produce would be identical. If cause and fruit were other, cause and non-cause would be similar.",
        madhyamaka: "Identity leads to absurdity, difference to arbitrary causation; supports the middle way of interdependence.",
        quantum: "Quantum contextuality: Outcomes depend on measurement context, properties are relational, not fixed.",
        explanation: "How you test a quantum particle changes its result—cause and effect depend on context, not absolutes.",
        controls: [
            { type: "button", label: "Context A", action: "setContextA" },
            { type: "button", label: "Context B", action: "setContextB" },
            { type: "button", label: "Measure", action: "measure" }
        ]
    },
    {
        number: 21,
        text: "If fruit existed essentially, what would a cause produce? If fruit did not exist essentially, what would a cause produce?",
        madhyamaka: "If effects were inherent, no need to produce; if not, how produced? Points to emptiness of phenomena.",
        quantum: "Creation/annihilation operators: Particles are made or destroyed, lacking inherent existence.",
        explanation: "Particles pop into being or vanish—they're not permanent, so effects arise conventionally, not inherently.",
        controls: [
            { type: "button", label: "Create Particle", action: "createParticle" },
            { type: "button", label: "Annihilate Particle", action: "annihilateParticle" },
            { type: "slider", label: "Energy Level", min: 0, max: 1, step: 0.01, value: 0.5, action: "setEnergyLevel" }
        ]
    },
    {
        number: 22,
        text: "If it were not productive, the cause itself would be impossible. If the cause itself were impossible, whose would the fruit be?",
        madhyamaka: "No production, no cause; no cause, no effect—cause and effect are interdependent, not independent.",
        quantum: "Quantum fluctuations: Particles arise from energy shifts, intertwining cause and effect.",
        explanation: "Particles emerge from \"empty\" energy ripples—effects need causes, but they're tied together, not separate.",
        controls: [
            { type: "button", label: "Add Energy", action: "addEnergy" },
            { type: "button", label: "Remove Energy", action: "removeEnergy" },
            { type: "slider", label: "Fluctuation Rate", min: 0, max: 1, step: 0.01, value: 0.5, action: "setFluctuationRate" }
        ]
    },
    {
        number: 23,
        text: "If whatever is a combination of causes and conditions does not produce itself by itself, how could it produce fruit?",
        madhyamaka: "Combinations lack inherent existence, so production is conventional, not intrinsic.",
        quantum: "Emergent properties: Complex systems show new traits from interactions, not single parts.",
        explanation: "Many particles together make a wave—combinations create effects, but not from one thing alone.",
        controls: [
            { type: "button", label: "Add Particles", action: "addParticles" },
            { type: "button", label: "Reset System", action: "resetSystem" },
            { type: "slider", label: "Interaction Strength", min: 0, max: 1, step: 0.01, value: 0.5, action: "setInteractionStrength" }
        ]
    },
    {
        number: 24,
        text: "Therefore, there is no fruit which has been made by combination [or] made by non-combination. If fruit does not exist, where can a combination of conditions exist?",
        madhyamaka: "No inherent effects mean no inherent causes; both are empty, arising conventionally.",
        quantum: "Quantum vacuum: \"Empty\" space holds potential for phenomena, emptiness enables conventional arising.",
        explanation: "Empty space isn't truly empty—it's alive with possibilities, like emptiness allowing things to happen.",
        controls: [
            { type: "button", label: "Zoom In", action: "zoomIn" },
            { type: "button", label: "Zoom Out", action: "zoomOut" },
            { type: "slider", label: "Energy Density", min: 0, max: 1, step: 0.01, value: 0.2, action: "setEnergyDensity" }
        ]
    }
];

// Animation settings with improved parameters
export const animationSettings = {
    particleCount: 2000,
    cameraDistance: 5,
    backgroundColor: 0x001233,
    particleSize: 0.08,
    particleSpeed: 0.01,
    bloomStrength: 1.0,
    bloomRadius: 0.3,
    bloomThreshold: 0.9,
    fogDensity: 0.035,
    autoRotateSpeed: 0.5
};

// Helper functions for animations
export const helpers = {
    // Create glowing material with configurable parameters
    createGlowMaterial: function(color, intensity = 0.5, opacity = 1) {
        return new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: intensity,
            transparent: opacity < 1,
            opacity: opacity,
            metalness: 0.3,
            roughness: 0.4
        });
    },
    
    // Create interactive object
    makeInteractive: function(object, onClick, hoverColor = 0x3a86ff) {
        object.userData.originalColor = object.material.color.clone();
        object.userData.isInteractive = true;
        object.userData.onClick = onClick;
        object.userData.hoverColor = hoverColor;
        return object;
    }
};