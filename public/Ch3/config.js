// Configuration values for animations and scenes

export const config = {
  // General settings
  rotationSpeed: 0.001,
  backgroundColor: 0x111133,
  cameraPosition: { x: 0, y: 0, z: 10 },
  bloomStrength: 1.5,
  bloomRadius: 0.75,
  bloomThreshold: 0.2,
  
  // Animation-specific settings
  verse1: {
    sphereColor1: 0x6495ED, // Eye
    sphereColor2: 0xFF69B4, // Form
    connectionColor: 0xFFFFFF,
    sphereSize: 0.8,
    distance: 3,
    particleCount: 50,
    particleSpeed: 0.02,
    lineWidth: 2
  },
  
  verse2: {
    eyeColor: 0x6b88ff,
    objectColor: 0xff9933,
    eyeSize: 1.2,
    cubeSize: 0.8,
    interactionThreshold: 2.0,
    pulseSpeed: 2.5,
    gridColor: 0x444444,
    gridSize: 10,
    gridDivisions: 10,
    particleColor: 0x88CCFF,
    particleCount: 100
  },
  
  verse3: {
    lightColor: 0x44AAFF,
    screenColor: 0x222266,
    particleColor: 0xFFFFFF,
    waveColor: 0x44AAFF,
    particleCount: 30,
    transitionDuration: 1
  },
  
  verse4: {
    eyeColor: 0x8866ff,
    prismColor: 0x44ddff,
    prismHighlight: 0xffff66,
    eyeSize: 1.2,
    interactionDistance: 2.0,
    glowIntensity: 0.4,
    particle1Color: 0x44AAFF, // Blue
    particle2Color: 0xFF44AA, // Magenta
    connectionColor: 0xFFFFFF,
    particleCount: 20
  },
  
  verse5: {
    sphereColor: 0xaa66ff,
    cubeColor: 0x44ffdd,
    sphereSize: 1.0,
    pulseSpeed: 2.0,
    particleCount: 25,
    collapseSpeed: 0.4,
    observerColor: 0x6495ED,
    lineColor: 0xFFFFFF,
    formColor: 0xaa66ff,
    wireframeColor: 0xffffff,
    innerParticleColor: 0x44ffdd,
    outerParticleColor: 0x88aaff
  },
  
  verse6: {
    sphereColor1: 0x66bbff, // Seer
    sphereColor2: 0xff66bb, // Seeing
    connectionColor: 0xffff44,
    sphereSize: 0.7,
    connectionParticles: 8,
    measurementSpeed: 0.003,
    stateAColor: 0x44AAFF,
    stateBColor: 0xFF44AA,
    superpositionColor: 0xFFFFFF
  },
  
  verse7: {
    eyeColor: 0x6699ff,
    formColor: 0xff9944,
    consciousnessColor: 0xaa22ff,
    sphereSize: 0.8,
    particleCount: 35,
    collapseDelay: 0.8,
    nodeColors: [0x44AAFF, 0xFF44AA, 0x44FFAA, 0xFFAA44],
    edgeColor: 0xFFFFFF
  },
  
  verse8: {
    sensesColors: [
      0xff6666, // Seeing
      0x66ff66, // Hearing
      0x6666ff, // Smelling
      0xffff66, // Tasting
      0xff66ff, // Touching
      0x66ffff  // Mind
    ],
    objectColor: 0xffffff,
    sphereSize: 0.6,
    interactionDuration: 2.5,
    pulseFactor: 0.08,
    extremeColor1: 0xFF44AA,
    extremeColor2: 0x44AAFF,
    middleColor: 0xFFFFFF
  },
  
  verse9: {
    sensesColors: [
      0xff5555, // Seeing
      0x55ff55, // Hearing
      0x5555ff, // Smelling
      0xffff55, // Tasting
      0xff55ff  // Touching
    ],
    consciousnessColor: 0x55ffff,
    objectColors: [
      0xff9999, // Visible
      0x99ff99, // Sound
      0x9999ff, // Smell
      0xffff99, // Taste
      0xff99ff  // Touchable
    ],
    sphereSize: 0.5,
    lineColor: 0xaaaaff,
    measureSpeed: 0.002,
    lineOpacity: 0.7,
    particleColor: 0x44AAFF,
    uncertaintyColor: 0xFFFFFF,
    gridColor: 0x444444
  },

  camera: {
    fov: 60,
    near: 0.1,
    far: 1000,
    position: { x: 0, y: 0, z: 10 }
  },
  
  rendering: {
    bloomStrength: 1.0,
    bloomRadius: 0.8,
    bloomThreshold: 0.3
  },
  
  verses: [
    {
        id: 1,
        text: "The eye does not see itself. How could the eye, which sees all else, see itself?",
        madhyamakaConcept: "Non-inherent existence of vision and perception",
        quantumParallel: "Observer effect - observation changes the system being observed",
        analysis: "Nāgārjuna introduces a fundamental principle: perception cannot perceive itself. The eye that sees cannot see itself. This parallels the quantum observation problem - the act of measurement affects what is measured."
    },
    {
        id: 2,
        text: "If the eye cannot see itself, how can it see other things? The nature of seeing is emptiness.",
        madhyamakaConcept: "Emptiness (śūnyatā) of perception",
        quantumParallel: "Quantum indeterminacy and measurement problem",
        analysis: "This verse extends the first - if the eye lacks inherent self-nature, its perception of objects is also empty of inherent nature. This relates to quantum indeterminacy, where properties are not fixed until observation."
    },
    {
        id: 3,
        text: "The property of light is not in darkness, nor is it in light itself. Light and darkness are opposed - how can light illuminate?",
        madhyamakaConcept: "Dependent co-arising of opposites",
        quantumParallel: "Wave-particle duality and complementarity principle",
        analysis: "Light and darkness define each other through mutual exclusion. Similarly, in quantum mechanics, wave and particle aspects cannot be observed simultaneously but are complementary ways of understanding the same phenomenon."
    },
    {
        id: 4,
        text: "That which is being seen cannot be in the process of being seen, yet what is not being seen cannot be in the process of being seen either.",
        madhyamakaConcept: "Critique of motion and process",
        quantumParallel: "Quantum entanglement and non-locality",
        analysis: "Nāgārjuna explores the paradox of perception in process. In quantum mechanics, entangled particles instantaneously affect each other, challenging our notions of causality, space and time."
    },
    {
        id: 5,
        text: "Without something being seen, there is no seeing. Without seeing, the seer does not exist either.",
        madhyamakaConcept: "Dependent origination of subject and object",
        quantumParallel: "Observer-dependent reality and measurement",
        analysis: "Subject and object arise dependently - neither exists independently. Similarly, in quantum theory, the observer and observed system cannot be separated; there is no quantum reality independent of measurement."
    },
    {
        id: 6,
        text: "If the seer does not exist without seeing, how can there be seeing without a seer?",
        madhyamakaConcept: "Mutual dependence of perceiver and perception",
        quantumParallel: "Quantum superposition and collapse",
        analysis: "Perceiver and perception mutually define each other. This mirrors quantum superposition, where systems exist in multiple states simultaneously until observation causes state collapse."
    },
    {
        id: 7,
        text: "The seeing, the seen, and the seer arise together in mutual dependence, without any having priority.",
        madhyamakaConcept: "Interdependent origination with no first cause",
        quantumParallel: "Quantum entanglement and non-separability",
        analysis: "The triad of perception arises interdependently, with no component having causal priority. In quantum mechanics, entangled particles form a single system regardless of spatial separation."
    },
    {
        id: 8,
        text: "Whether 'seeing sees' or 'seeing does not see' - both positions are extreme. The Middle Way rejects both extremes.",
        madhyamakaConcept: "Middle Way between existence and non-existence",
        quantumParallel: "Complementarity principle and non-classical logic",
        analysis: "Nāgārjuna rejects fixed positions about perception's nature. Quantum physics similarly rejects classical either/or logic, embracing complementary descriptions that appear contradictory."
    },
    {
        id: 9,
        text: "The seer, seeing, and the seen - none can be established as having a fixed nature or definite relationship.",
        madhyamakaConcept: "Ultimate emptiness of all phenomena",
        quantumParallel: "Heisenberg uncertainty principle",
        analysis: "No aspect of perception has a fixed, definable nature. This corresponds to the uncertainty principle, where precise values of complementary variables cannot be simultaneously determined."
    }
  ]
};