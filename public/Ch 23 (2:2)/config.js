// Configuration file for verse data and animation settings

export const verses = [
    {
        id: 13,
        text: "If such an apprehension as 'the impermanent is permanent' is confused, since impermanence does not exist in the empty, how can such an apprehension be confused?",
        madhyamaka: "Critiques confusion of permanence in empty phenomena.",
        quantum: "Quantum superposition: multiple states until measured (e.g., quantum computers).",
        explanation: "Like a spinning coin not heads or tails until stopped, confusion isn't fixed in emptiness.",
        animation: "superposition",
        controls: [
            {
                type: "button",
                id: "measure-button",
                label: "Measure State",
                action: "measureState"
            }
        ]
    },
    {
        id: 14,
        text: "If such an apprehension as 'the impermanent is permanent' is confused, how would the apprehension 'there is impermanence in the empty' also not be confused?",
        madhyamaka: "Questions confusion about impermanence in emptiness, both lack reality.",
        quantum: "Quantum tunneling: probabilistic barrier crossing (e.g., tunneling microscopes).",
        explanation: "Like a ball passing through walls, confusion about change isn't solid in emptiness.",
        animation: "tunneling",
        controls: [
            {
                type: "slider",
                id: "barrier-height",
                label: "Barrier Height",
                min: 1,
                max: 10,
                value: 5,
                action: "adjustBarrier"
            }
        ]
    },
    {
        id: 15,
        text: "[The means] by which one apprehends, the apprehension [itself], the apprehender and the apprehended—all are completely pacified; therefore there is no apprehending.",
        madhyamaka: "All dualistic apprehensions are pacified, no inherent subject/object, aligning with emptiness.",
        quantum: "Quantum entanglement: correlated states, no separation (e.g., cryptography).",
        explanation: "Like dancers in perfect sync, thoughts and objects blend into one flow, not separate.",
        animation: "entanglement",
        controls: [
            {
                type: "button",
                id: "measure-entangled",
                label: "Measure First Particle",
                action: "measureEntangled"
            }
        ]
    },
    {
        id: 16,
        text: "If there is neither confused nor right apprehension, who is confused and who is not confused?",
        madhyamaka: "No inherent confused/unconfused subject, apprehensions are empty, beyond dualism.",
        quantum: "Quantum indeterminacy: no fixed properties until measured (e.g., atomic clocks).",
        explanation: "Like asking if a room's messy before checking, confusion depends on looking, not fixed.",
        animation: "indeterminacy",
        controls: [
            {
                type: "button",
                id: "measure-indeterminacy",
                label: "Observe Particles",
                action: "measureIndeterminacy"
            }
        ]
    },
    {
        id: 17,
        text: "Confusions do not occur for those who are [already] confused; confusions do not occur for those who are not [yet] confused.",
        madhyamaka: "Confusion doesn't arise in fixed states, paradoxical in emptiness.",
        quantum: "Quantum Zeno effect: observation prevents change (e.g., error correction).",
        explanation: "Like a spinning top staying put if checked often, confusion doesn't shift if locked in place.",
        animation: "zeno",
        controls: [
            {
                type: "slider",
                id: "observation-rate",
                label: "Observation Frequency",
                min: 1,
                max: 10,
                value: 5,
                action: "adjustObservationRate"
            }
        ]
    },
    {
        id: 18,
        text: "Confusions do not occur for those who are being confused. For whom do confusions occur? Examine this by yourself!",
        madhyamaka: "Challenges confusion's subject in the moment, invites self-examination in emptiness.",
        quantum: "Observer effect: observation alters the system (e.g., electron microscopes).",
        explanation: "Like shining light changes shadows, looking at something changes it; confusion depends on you.",
        animation: "observerEffect",
        controls: [
            {
                type: "button",
                id: "observe-system",
                label: "Observe System",
                action: "observeSystem"
            }
        ]
    },
    {
        id: 19,
        text: "If confusions are not born, how can they exist? If confusions are not born, where can there be someone who has confusion?",
        madhyamaka: "Denies inherent origin of confusions, no self to possess them, reinforcing emptiness.",
        quantum: "Particle creation/annihilation: appear/disappear (e.g., accelerators).",
        explanation: "Like bubbles popping in and out, confusions aren't born solid, no fixed owner.",
        animation: "particleCreation",
        controls: [
            {
                type: "slider",
                id: "field-energy",
                label: "Field Energy",
                min: 1,
                max: 10,
                value: 5,
                action: "adjustFieldEnergy"
            }
        ]
    },
    {
        id: 20,
        text: "Things are not born from themselves or from others. If they are also not from self and others, where can there be someone who has confusion?",
        madhyamaka: "Denies four possibilities of arising, no basis for self or confusion, showing dependent origination.",
        quantum: "No local hidden variables: entangled correlations defy causation (e.g., cryptography).",
        explanation: "Like magic links between particles, confusion doesn't come from a fixed self or other.",
        animation: "noLocalVariables",
        controls: [
            {
                type: "button",
                id: "measure-correlation",
                label: "Measure Correlation",
                action: "measureCorrelation"
            }
        ]
    },
    {
        id: 21,
        text: "If self and purity and permanence and happiness were existent, self and purity and permanence and happiness would not be confusions.",
        madhyamaka: "If self, purity, etc., were inherent, they wouldn't cause confusion, but they're empty.",
        quantum: "Probabilistic states: no fixed properties (e.g., random number generators).",
        explanation: "Like dice rolls, seeing self or happiness as solid causes confusion—they're not fixed.",
        animation: "probabilisticStates",
        controls: [
            {
                type: "button",
                id: "collapse-probability",
                label: "Collapse Probability Wave",
                action: "collapseProbability"
            }
        ]
    },
    {
        id: 22,
        text: "If self and purity and permanence and happiness were non-existent, selflessness, impurity, impermanence and anguish would not exist.",
        madhyamaka: "Self and selflessness are interdependent, both empty, beyond dualism.",
        quantum: "Particle-antiparticle pairs: interdependent (e.g., PET scans).",
        explanation: "Like two sides of a coin, self and no-self need each other, neither solid alone.",
        animation: "particleAntiparticle",
        controls: [
            {
                type: "button",
                id: "create-pair",
                label: "Create Particle Pair",
                action: "createParticlePair"
            }
        ]
    },
    {
        id: 23,
        text: "Thus by stopping confusion, ignorance will stop. If ignorance is stopped, impulsive acts etc., will stop.",
        madhyamaka: "Stopping confusion halts ignorance and actions, aligning with dependent origination.",
        quantum: "Quantum state preparation: setting conditions (e.g., laser cooling).",
        explanation: "Like cooling atoms to settle, stopping confusion calms mind and actions.",
        animation: "laserCooling",
        controls: [
            {
                type: "slider",
                id: "temperature",
                label: "Temperature",
                min: 0,
                max: 10,
                value: 7,
                action: "adjustTemperature"
            }
        ]
    },
    {
        id: 24,
        text: "If afflictions existed by their own nature for some people, how could they be let go of? Who can let go of what exists by nature?",
        madhyamaka: "If afflictions were inherent, they couldn't be released, but they're empty, enabling liberation.",
        quantum: "Quantum state transitions: states change with interaction (e.g., solar panels).",
        explanation: "Like electrons jumping levels, feelings can shift if not fixed, through understanding.",
        animation: "electronJump",
        controls: [
            {
                type: "button",
                id: "add-photon",
                label: "Add Photon Energy",
                action: "addPhoton"
            }
        ]
    },
    {
        id: 25,
        text: "If afflictions did not exist by their own nature for some people, how could they be let go of? Who can let go of what does not exist?",
        madhyamaka: "Afflictions' lack of inherent existence allows letting go, as there's nothing fixed to release.",
        quantum: "Quantum vacuum: potential without fixed existence (e.g., Casimir effect).",
        explanation: "Like waves in a calm sea, feelings aren't solid; letting go is seeing they're empty.",
        animation: "quantumVacuum",
        controls: [
            {
                type: "slider",
                id: "plate-distance",
                label: "Plate Distance",
                min: 1,
                max: 10,
                value: 5,
                action: "adjustPlateDistance"
            }
        ]
    }
];

// Animation settings
export const animationSettings = {
    colors: {
        primary: 0x3a86ff,
        secondary: 0x8338ec,
        accent: 0xff006e,
        light: 0xffffff,
        dark: 0x212529
    },
    particleCount: 1000,
    animationSpeed: 0.5,
    cameraDistance: 5
};

// Default controls settings
export const defaultControls = {
    measureState: false,
    barrierHeight: 5,
    observationRate: 5,
    fieldEnergy: 5,
    temperature: 7,
    plateDistance: 5
};

