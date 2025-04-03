// Configuration parameters
export const config = {
    // Animation parameters
    animationSpeed: 1.0, // Global speed multiplier
    particleCount: 2000, // Number of particles for relevant animations
    colorScheme: {
        background: 0x000819,
        primary: 0x4444ff,
        secondary: 0x00ffff,
        accent: 0xff00ff,
        neutral: 0xcccccc
    },
    
    // Camera settings
    cameraDistance: 5,
    cameraFOV: 75,
    
    // Mobile responsiveness
    mobileBreakpoint: 768, // Pixel width to trigger mobile version
    
    // Verse data
    verses: [
        {
            number: 1,
            title: "Verse 1: Arising and Ceasing",
            madhyamaka: "Challenges inherent arising and ceasing, emphasizing emptiness and dependent origination, rejecting inherent essence (svabhāva).",
            quantum: "Superposition: An electron exists in multiple energy levels until measured.",
            explanation: "Like a light switch both on and off until checked, things don't inherently start or stop—it's all perspective.",
            controls: [
                { type: "slider", id: "oscillation-speed", label: "Oscillation Speed", min: 0.1, max: 3, step: 0.1, default: 1 },
                { type: "button", id: "measure-particle", label: "Measure Particle" }
            ]
        },
        {
            number: 2,
            title: "Verse 2: Paradox of Birth",
            madhyamaka: "Paradox of birth: If something is already being born, it doesn't need to be born again, showing dependent origination.",
            quantum: "Uncertainty Principle: Measuring position blurs speed, showing indeterminacy.",
            explanation: "Like photographing a car—you get position or speed, not both; birth can't be pinned down either.",
            controls: [
                { type: "slider", id: "position-certainty", label: "Position Certainty", min: 0, max: 1, step: 0.01, default: 0.5 },
                { type: "slider", id: "momentum-certainty", label: "Momentum Certainty", min: 0, max: 1, step: 0.01, default: 0.5 }
            ]
        },
        {
            number: 3,
            title: "Verse 3: Arising from Non-Existence",
            madhyamaka: "Questions arising from non-existence, highlighting dependent origination over inherent essence.",
            quantum: "Vacuum fluctuations: Particles pop up from empty space in quantum field theory.",
            explanation: "Like bubbles forming in water, particles appear from nothing—birth from non-existence is empty too.",
            controls: [
                { type: "slider", id: "vacuum-energy", label: "Vacuum Energy", min: 0, max: 2, step: 0.1, default: 1 },
                { type: "button", id: "clear-particles", label: "Clear All Particles" }
            ]
        },
        {
            number: 4,
            title: "Verse 4: Paradox of Ceasing",
            madhyamaka: "Paradox of ceasing: If it's already stopping, further ceasing is redundant, pointing to dependent origination.",
            quantum: "Decoherence: A qubit loses its quantum state when interacting with the environment.",
            explanation: "Like a system losing its uniqueness when touched, ceasing isn't an inherent trait.",
            controls: [
                { type: "slider", id: "interaction-strength", label: "Interaction Strength", min: 0, max: 1, step: 0.01, default: 0.2 },
                { type: "button", id: "interact-system", label: "Interact with System" }
            ]
        },
        {
            number: 5,
            title: "Verse 5: Challenge of Future Ceasing",
            madhyamaka: "Challenges future ceasing if it's not happening now, showing change is conditional, not inherent.",
            quantum: "Stationary states: An electron stays stable until disturbed.",
            explanation: "Like an electron sitting still until poked, ceasing only happens with conditions.",
            controls: [
                { type: "slider", id: "stability-level", label: "Stability Level", min: 0, max: 1, step: 0.01, default: 0.9 },
                { type: "button", id: "perturb-system", label: "Perturb System" }
            ]
        },
        {
            number: 6,
            title: "Verse 6: Birth from Non-Birth",
            madhyamaka: "Absurdity of birth from non-existence, reinforcing emptiness and rejecting inherent relations.",
            quantum: "Virtual particles: They influence real particles without fully existing.",
            explanation: "Like virtual particles nudging real ones, birth from not-born lacks inherent basis—it's empty.",
            controls: [
                { type: "slider", id: "virtual-intensity", label: "Virtual Particle Intensity", min: 0, max: 1, step: 0.01, default: 0.5 },
                { type: "button", id: "exchange-photon", label: "Exchange Photon" }
            ]
        },
        {
            number: 7,
            title: "Verse 7: Birth from Birth",
            madhyamaka: "Circular dependency: Birth from something already born is illogical, showing dependent origination.",
            quantum: "Pair production: A photon creates particle pairs from itself.",
            explanation: "Like a photon splitting into particles, birth from born is circular and empty.",
            controls: [
                { type: "slider", id: "photon-energy", label: "Photon Energy", min: 0.5, max: 2, step: 0.1, default: 1 },
                { type: "button", id: "split-photon", label: "Split Photon" }
            ]
        },
        {
            number: 8,
            title: "Verse 8: Relations of Being and Non-Being",
            madhyamaka: "Rejects inherent relations between born and not-born, reinforcing emptiness.",
            quantum: "Quantum field theory: Particles are excitations in a field, not independent.",
            explanation: "Like ripples in a field, not standalone things—relations aren't inherent, just empty.",
            controls: [
                { type: "slider", id: "field-strength", label: "Field Strength", min: 0, max: 2, step: 0.1, default: 1 },
                { type: "button", id: "excite-field", label: "Excite Field" }
            ]
        },
        {
            number: 9,
            title: "Verse 9: Causal Paradoxes",
            madhyamaka: "Causal paradoxes: Birth from birth or no-birth leads to infinite regress or absurdity, showing causation is empty.",
            quantum: "Spontaneous decay: Atoms decay randomly with no clear cause.",
            explanation: "Like an atom decaying out of the blue, birth lacks a solid cause—it's empty.",
            controls: [
                { type: "slider", id: "decay-probability", label: "Decay Probability", min: 0, max: 0.1, step: 0.001, default: 0.01 },
                { type: "button", id: "reset-atoms", label: "Reset Atoms" }
            ]
        },
        {
            number: 10,
            title: "Verse 10: Coexistence of Opposites",
            madhyamaka: "Arising and ceasing can't coexist in one thing, emphasizing dependent origination over inherent traits.",
            quantum: "Creation/annihilation: Distinct processes in quantum field theory.",
            explanation: "Like creating then destroying particles, arising and ceasing don't mix—they're dependent.",
            controls: [
                { type: "slider", id: "creation-rate", label: "Creation Rate", min: 0, max: 2, step: 0.1, default: 1 },
                { type: "slider", id: "annihilation-rate", label: "Annihilation Rate", min: 0, max: 2, step: 0.1, default: 1 }
            ]
        },
        {
            number: 11,
            title: "Verse 11: Nature of Processes",
            madhyamaka: "Absurdity of arising and ceasing being identical or separate, reinforcing emptiness of processes.",
            quantum: "Unitary evolution/collapse: Quantum states evolve then collapse distinctly.",
            explanation: "Like a system changing then being measured, arising and ceasing aren't one or separate—just dependent.",
            controls: [
                { type: "slider", id: "evolution-speed", label: "Evolution Speed", min: 0, max: 2, step: 0.1, default: 1 },
                { type: "button", id: "collapse-state", label: "Collapse State" }
            ]
        },
        {
            number: 12,
            title: "Verse 12: Illusory Nature",
            madhyamaka: "Arising and ceasing are illusory, lacking inherent existence, fully embracing emptiness.",
            quantum: "Probabilistic nature: Reality isn't fixed until measured.",
            explanation: "Like particles seeming solid but really just chances, processes are illusions—empty.",
            controls: [
                { type: "slider", id: "reality-mode", label: "Reality Mode", min: 0, max: 1, step: 0.01, default: 0.5 },
                { type: "button", id: "toggle-view", label: "Toggle Perspective" }
            ]
        }
    ]
};

