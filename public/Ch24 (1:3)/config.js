export const verses = [
    {
        id: 1,
        text: "If all were empty, nothing could come about or perish. It would follow for you that the four ennobling truths could not exist.",
        explanation: "Emptiness means lack of inherent existence, not non-existence. Wave-particle duality: particles exist as probabilities (empty of definite properties) until measured, paralleling dependent existence. A rainbow exists dependent on conditions (sun, water) but is empty of inherent existence.",
        interaction: "Toggle the 'Observation' button to switch between wave (unobserved) and particle (observed) states, reflecting emptiness as dependent existence.",
        controls: [
            { id: "toggle-observation", label: "Observation", type: "toggle" }
        ]
    },
    {
        id: 2,
        text: "Since the four ennobling truths would not exist, understanding, letting go, cultivating and realizing would no longer be valid.",
        explanation: "The path is valid within conventional truth, which is based on emptiness. Quantum operations (gates) are meaningful within the quantum framework, like practices are meaningful in the context of emptiness.",
        interaction: "Drag quantum gates onto qubits to transform their states into a final 'liberated' configuration.",
        controls: [
            { id: "hadamard-gate", label: "Hadamard Gate", type: "drag" },
            { id: "cnot-gate", label: "CNOT Gate", type: "drag" },
            { id: "reset-circuit", label: "Reset", type: "button" }
        ]
    },
    {
        id: 3,
        text: "Since they would not exist, the four fruits would also not exist. If the fruits did not exist, there could be no abiding in the fruits. Experiencing them would also not exist.",
        explanation: "The four fruits are conventionally real and achievable through understanding emptiness. Energy levels in atoms: specific conditions lead to transitions, like stages in the path.",
        interaction: "Trigger energy inputs (photons) to shift electrons between glowing energy levels, each labeled as a 'fruit'.",
        controls: [
            { id: "add-photon", label: "Add Photon", type: "button" }
        ]
    },
    {
        id: 4,
        text: "If those eight beings did not exist, the Community would not exist. Since there would be no ennobling truths, the sublime Dharma could also not exist.",
        explanation: "The Sangha and Dharma exist conventionally, dependent on the truths. Entanglement: particles are interconnected, like the interdependence of the three jewels.",
        interaction: "Adjust one particle's state to see how it instantly alters others, symbolizing the three jewels' interdependence.",
        controls: [
            { id: "adjust-particle", label: "Adjust Particles", type: "slider" }
        ]
    },
    {
        id: 5,
        text: "If the Community and the Dharma did not exist, how could Buddha exist? When you talk of emptiness, the three Jewels are maligned.",
        explanation: "The three jewels are interdependent; emptiness doesn't negate them but defines their nature. Non-locality: properties are determined by the whole system, not individual parts.",
        interaction: "Tap a node to see system-wide changes, showing non-locality.",
        controls: [
            { id: "buddha-node", label: "Buddha Node", type: "button" },
            { id: "dharma-node", label: "Dharma Node", type: "button" },
            { id: "sangha-node", label: "Sangha Node", type: "button" }
        ]
    },
    {
        id: 6,
        text: "The existence of actions and fruits, what is not Dharma and what is Dharma, the conventions of the world: all these too are maligned.",
        explanation: "Emptiness doesn't negate conventional reality; it's the basis for it. Measurement in QM: conventional properties arise from measurement, which is a convention.",
        interaction: "Activate the 'Measurement' tool to see a particle's state stabilize, showing conventional reality emerging from emptiness.",
        controls: [
            { id: "measure-particle", label: "Measure", type: "button" },
            { id: "reset-particle", label: "Reset", type: "button" }
        ]
    },
    {
        id: 7,
        text: "An explanation for that: since you do not understand the need for emptiness, the nature of emptiness, and the point of emptiness, therefore in that way you malign.",
        explanation: "Misunderstanding emptiness leads to incorrect conclusions. Misinterpreting QM leads to paradoxes; understanding it resolves them.",
        interaction: "Navigate a shimmering, shifting maze using a 'quantum compass' that reveals paths when understood correctly.",
        controls: [
            { id: "move-up", label: "Up", type: "button" },
            { id: "move-down", label: "Down", type: "button" },
            { id: "move-left", label: "Left", type: "button" },
            { id: "move-right", label: "Right", type: "button" },
            { id: "quantum-compass", label: "Quantum Compass", type: "toggle" }
        ]
    },
    {
        id: 8,
        text: "The Dharma taught by Buddhas perfectly relies on two truths: the ambiguous truths of the world and the truths of the sublime meaning.",
        explanation: "Two truths: conventional and ultimate. QM has two descriptions: wave function and particle states. A coin has two sides: heads and tails, both are true in their context.",
        interaction: "Flip the quantum coin to explore both truths - wave patterns on one side, particle dots on the other.",
        controls: [
            { id: "flip-coin", label: "Flip Coin", type: "button" }
        ]
    },
    {
        id: 9,
        text: "Those who do not understand the division into two truths, cannot understand the profound reality of the Buddha's teaching.",
        explanation: "Understanding both truths is essential for grasping the teaching. Understanding both wave and particle aspects is crucial in QM.",
        interaction: "Adjust two quantum 'lenses' (wave and particle) to align a blurry image into a clear Buddha figure.",
        controls: [
            { id: "wave-lens", label: "Wave Lens", type: "slider" },
            { id: "particle-lens", label: "Particle Lens", type: "slider" }
        ]
    },
    {
        id: 10,
        text: "Without relying on conventions, the sublime meaning cannot be taught. Without understanding the sublime meaning, one will not attain nirvana.",
        explanation: "Conventional truth is the basis for teaching ultimate truth. Mathematical formalism (conventional) is needed to understand QM's implications (ultimate).",
        interaction: "Climb by solving glowing mathematical equations (conventions), reaching a radiant 'nirvana' platform.",
        controls: [
            { id: "solve-equation", label: "Solve Equation", type: "button" },
            { id: "next-step", label: "Next Step", type: "button" }
        ]
    },
    {
        id: 11,
        text: "If their view of emptiness is wrong, those of little intelligence will be hurt. Like handling a snake in the wrong way, or casting a spell in the wrong way.",
        explanation: "Incorrect understanding of emptiness can be harmful. Misapplying QM can lead to incorrect conclusions or technologies.",
        interaction: "Grab the quantum 'snake' (wave function) correctly to harness its energy or incorrectly to see it collapse chaotically.",
        controls: [
            { id: "correct-grab", label: "Correct Grab", type: "button" },
            { id: "incorrect-grab", label: "Incorrect Grab", type: "button" },
            { id: "reset-snake", label: "Reset", type: "button" }
        ]
    },
    {
        id: 12,
        text: "Therefore, knowing how difficult it is for the weak to understand the depths of this Dharma, the heart of the Muni strongly turned away from teaching the Dharma.",
        explanation: "The profundity of emptiness is hard to grasp, leading to initial reluctance to teach. QM's counterintuitive nature was initially resisted by some scientists.",
        interaction: "Rotate glowing, shifting pieces to align a hidden pattern, revealing a Buddha image.",
        controls: [
            { id: "rotate-x", label: "Rotate X", type: "slider" },
            { id: "rotate-y", label: "Rotate Y", type: "slider" },
            { id: "rotate-z", label: "Rotate Z", type: "slider" }
        ]
    },
    {
        id: 13,
        text: "Since [those] erroneous consequences do not apply to emptiness, whatever rejections you make of emptiness do not apply to me.",
        explanation: "The criticisms are based on misunderstanding; emptiness doesn't lead to those consequences. QM's strange implications don't negate its validity; they're part of its nature.",
        interaction: "Tweak the quantum engine's shimmering components to see it function despite odd behaviors like superposition.",
        controls: [
            { id: "adjust-phase", label: "Adjust Phase", type: "slider" },
            { id: "adjust-amplitude", label: "Adjust Amplitude", type: "slider" },
            { id: "toggle-superposition", label: "Toggle Superposition", type: "toggle" }
        ]
    },
    {
        id: 14,
        text: "Those for whom emptiness is possible, for them everything is possible. Those for whom emptiness is not possible, for them everything is not possible.",
        explanation: "Emptiness is the ground for all possibilities. Superposition allows multiple states; understanding it enables quantum technologies.",
        interaction: "Paint with glowing particles in multiple states, creating dynamic art that collapses into one form when observed.",
        controls: [
            { id: "add-particles", label: "Add Particles", type: "button" },
            { id: "clear-canvas", label: "Clear Canvas", type: "button" },
            { id: "observe-particles", label: "Observe", type: "toggle" }
        ]
    }
];

