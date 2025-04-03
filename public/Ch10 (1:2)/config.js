// Configuration file for animation and verse data

export const verses = [
    {
        id: 1,
        text: "If firewood were fire, actor and act would be one. If fire were other than wood, it would occur even without wood.",
        madhyamakaConcept: "Challenges inherent existence by showing fire and firewood are neither identical nor entirely separate. If identical, the distinction between agent (fire) and action (burning) collapses. If entirely different, fire could exist without wood, which it cannot. This points to interdependence and lack of inherent existence.",
        quantumParallel: "Quantum entanglement: Two particles are correlated such that the state of one affects the other instantly, regardless of distance. They are neither fully separate nor identical, mirroring the interdependence of fire and wood.",
        accessibleExplanation: "Like two friends who always know each other's feelings instantly, fire and wood are connected: fire needs wood to burn, and wood's purpose is to fuel fire. They depend on each other, just like the friends' emotions.",
        animationType: "entanglement"
    },
    {
        id: 2,
        text: "Fire would burn permanently and would not arise from causes for burning. Starting a fire would be meaningless. If it were like that, there would also be no act.",
        madhyamakaConcept: "If fire existed inherently, it would burn eternally without needing conditions like wood. This contradicts experience, as fire requires causes to start and stop. Thus, fire arises dependently, reinforcing emptiness.",
        quantumParallel: "Particle creation and annihilation: In quantum field theory, particles are created from energy and annihilate back into energy, depending on specific conditions. This parallels fire arising from and ceasing with conditions.",
        accessibleExplanation: "Like ice cream melting on a hot day, fire (like the liquid state) arises from specific conditions (heat). Similarly, particles are created when there's enough energy, showing dependence on conditions.",
        animationType: "particleCreation"
    },
    {
        id: 3,
        text: "Because fire does not depend on anything else, it would not arise from causes for burning. If it burned permanently, starting it would be meaningless.",
        madhyamakaConcept: "Reiterates that if fire were independent, it wouldn't need causes to start, making the act of starting a fire pointless. Since fire does require conditions, it must be dependent, emphasizing dependent origination.",
        quantumParallel: "Quantum jumps: Electrons in atoms jump between energy levels, emitting or absorbing photons only under specific energy conditions. This mirrors fire requiring conditions to ignite.",
        accessibleExplanation: "Like a light bulb that only turns on when you flip the switch, fire depends on conditions (like wood and oxygen). Similarly, electrons only emit light when jumping energy levels, just as fire only burns when conditions are right.",
        animationType: "electronJump"
    },
    {
        id: 4,
        text: "Concerning this, if one thinks that while burning it is firewood, if it is such only at that time, by what could that firewood be ignited?",
        madhyamakaConcept: "Examines temporal aspects of burning, showing dependence on conditions for ignition, reinforcing emptiness.",
        quantumParallel: "Quantum jumps: Electron transitions depend on energy conditions.",
        accessibleExplanation: "Like a car needing a key to start, fire needs the right moment and conditions, like atoms needing energy to emit light.",
        animationType: "atomIgnition"
    },
    {
        id: 5,
        text: "Because fire is other, it would not connect; if it did not connect, it would not ignite; if it did not ignite, it would not die; if it did not die, it would also remain in possession of its own characteristic.",
        madhyamakaConcept: "Argues fire and wood must connect despite difference, illustrating interdependence and lack of inherent characteristics.",
        quantumParallel: "Quantum coherence and decoherence: Interaction causes state changes.",
        accessibleExplanation: "Like dancers needing to touch to dance, fire and wood must connect to burn, like quantum systems needing interaction to change.",
        animationType: "quantumCoherence"
    },
    {
        id: 6,
        text: "Just as a woman connects with a man and a man too with a woman, although fire is other than wood, it is fit to connect with wood.",
        madhyamakaConcept: "Uses analogy to show different entities can connect, emphasizing interdependence despite difference.",
        quantumParallel: "Quantum field interactions: Particles interact via fields despite difference.",
        accessibleExplanation: "Like people holding hands despite being different, fire and wood connect to burn, like particles interacting via forces.",
        animationType: "fieldInteraction"
    },
    {
        id: 7,
        text: "If fire and wood eliminated each other, even though fire is something other than wood, it would have to connect with wood.",
        madhyamakaConcept: "Suggests mutual exclusivity yet necessity of connection, reinforcing interdependence.",
        quantumParallel: "Particle-antiparticle annihilation: Different entities connect and annihilate.",
        accessibleExplanation: "Like magnets attracting then repelling, fire and wood connect to burn out, like particles annihilating in physics.",
        animationType: "annihilation"
    },
    {
        id: 8,
        text: "If fire were dependent on wood and wood were dependent on fire, of what becomes fire and wood dependently, which would be established first?",
        madhyamakaConcept: "Highlights circular dependency, showing neither can be established first, pointing to emptiness.",
        quantumParallel: "Measurement problem: Observer and observed are interdependent, no clear first.",
        accessibleExplanation: "Like a chicken and egg, fire and wood depend on each other, like quantum states needing measurement to be real.",
        animationType: "measurement"
    }
];

// Animation settings
export const animationSettings = {
    entanglement: {
        particleSize: 0.5,
        particleSpeed: 0.01,
        particleDistance: 3,
        rotationSpeed: 0.01
    },
    particleCreation: {
        energyLevel: 50,
        particleCount: 20,
        waveAmplitude: 30,
        waveFrequency: 0.05
    },
    electronJump: {
        orbitRadii: [2, 3.5, 5],
        electronSpeed: 0.01,
        jumpProbability: 0.005,
        photonSpeed: 0.1
    },
    atomIgnition: {
        energyThreshold: 0.7,
        orbitRadius: 4,
        electronCount: 3
    },
    quantumCoherence: {
        systemSize: 2,
        interactionStrength: 0.05,
        decoherenceRate: 0.01
    },
    fieldInteraction: {
        particleCount: 2,
        forceStrength: 0.02,
        exchangeRate: 0.03
    },
    annihilation: {
        particleSpeed: 0.03,
        explosionIntensity: 2,
        particleLifetime: 3
    },
    measurement: {
        uncertaintyRadius: 2,
        collapseSpeed: 0.05,
        observerSize: 1
    }
};

