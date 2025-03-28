export const config = {
    // Animation speeds and parameters
    animationSpeed: 1.0,
    particleCount: 1000,
    
    // Colors
    primaryColor: 0x7f7fff,
    secondaryColor: 0xff7f7f,
    accentColor: 0x7fffbf,
    
    // Control panel options
    showFPS: true,
    
    // Camera settings
    cameraDistance: 5,
    cameraNear: 0.1,
    cameraFar: 1000,
    
    // Verses data
    verses: [
        {
            number: "Verse 1",
            text: "The Bhagavan said that whatever dharma is deceptive, that is false. All conditions are deceptive dharmas, thus they are false.",
            madhyamakaConcept: "Highlights two truths: samskaras are conventionally real but ultimately empty and false.",
            quantumParallel: "Measurement problem: particles seem fixed but are probabilistic until measured.",
            accessibleExplanation: "Imagine a rainbow. It looks like a solid, colorful arc in the sky, but it's really just light bending through water droplets. If you try to touch it or find its end, you realize it's not actually there—it's an illusion. In quantum physics, particles seem to have definite properties (like a specific position) when we measure them, but before that, they're in a state of potential, not fixed anywhere specific. This matches the Buddhist idea of emptiness: things appear real and solid, but they don't have a fixed, inherent nature. They're deceptive, like the rainbow, because their appearance tricks us into thinking they exist on their own.",
            animationType: "waveCollapse"
        },
        {
            number: "Verse 2",
            text: "If whatever is a deceptive phenomenon is false, what is deceptive about it in what way is it deceptive? That statement by the Bhagavan is a complete presentation of emptiness.",
            madhyamakaConcept: "Recognizing deception fully presents emptiness, the absence of inherent existence.",
            quantumParallel: "Entanglement: particles are interconnected, challenging local realism, complete quantum view.",
            accessibleExplanation: "Think about a pair of gloves. If you keep one and send the other to a friend, when your friend checks and sees they have the left glove, they instantly know you have the right one, no matter how far apart you are. In quantum physics, particles can be \"entangled\" like this—connected so that measuring one instantly tells you about the other, even across great distances. Understanding this connection is key to grasping quantum mechanics. Similarly, in Buddhism, realizing how things are interconnected and not as separate as they seem leads to a complete understanding of emptiness, showing that their apparent independence is deceptive.",
            animationType: "entanglement"
        },
        {
            number: "Verse 3",
            text: "Things have no essential nature because they are seen to change into something else. Things do not lack an essential nature because things are emptiness.",
            madhyamakaConcept: "Things lack inherent nature due to change, but their nature is emptiness, conventionally existing.",
            quantumParallel: "Heisenberg uncertainty: particles lack fixed properties, probabilistic nature mirrors emptiness.",
            accessibleExplanation: "Picture a river. The water is always flowing and changing, so the river you see now isn't the same as it was a moment ago. Yet, we still call it the same river. In quantum physics, particles don't have fixed properties like an exact position or speed; instead, they're described by probabilities, constantly shifting. This is like the Buddhist concept that things don't have a permanent, unchanging nature. Their nature is emptiness, meaning they're always changing and depend on other things to exist, just like the river keeps flowing.",
            animationType: "uncertainty"
        },
        {
            number: "Verse 4",
            text: "If there were no essential nature, whose nature would it be to change into something else? If there were an essential nature, how would it be possible to change into something else?",
            madhyamakaConcept: "Tetralemma shows both having and lacking inherent nature lead to problems, pointing to middle way.",
            quantumParallel: "Wave-particle duality: light is neither purely wave nor particle, mirroring middle way.",
            accessibleExplanation: "Consider water: it can be liquid, ice, or steam depending on the temperature. If water had a fixed nature, it couldn't switch forms, but it does. Yet, there's something consistent that lets us call it \"water\" in all these states. In quantum physics, light can act as both a wave (spreading out) and a particle (hitting one spot), depending on how we observe it. This shows that things don't have a single, fixed nature. Similarly, in Buddhism, things are empty of inherent existence but still function in the world, like water adapting to conditions.",
            animationType: "waveDuality"
        },
        {
            number: "Verse 5",
            text: "This itself does not change into something else. The other itself too does not either. Because youth does not age. Because age too does not age.",
            madhyamakaConcept: "Illustrates momentariness, rejecting continuous identity, each moment distinct.",
            quantumParallel: "Quantum jumps: electrons change levels discontinuously, no gradual change, like distinct moments.",
            accessibleExplanation: "Imagine watching a movie. It looks like smooth, continuous motion, but it's really a series of still images shown quickly. Each image is separate; there's no gradual change from one to the next. In quantum physics, electrons in atoms jump from one energy level to another instantly, without passing through the space between. This is like the Buddhist idea that each moment is distinct—there's no permanent \"thing\" that changes over time. Youth doesn't turn into age; instead, each stage arises separately.",
            animationType: "quantumJump"
        },
        {
            number: "Verse 6",
            text: "If this itself changes into something else, milk itself would be curds. Something other than milk would be the being of curds.",
            madhyamakaConcept: "Transformation shows no persistent identity; milk ceases, curds arise, each distinct.",
            quantumParallel: "Particle decay: carbon-14 decays to nitrogen-14, original ceases, new arises, no identity.",
            accessibleExplanation: "Think about baking a cake. You start with flour, eggs, and sugar, but after baking, you have a cake—not the original ingredients. The cake isn't the flour or the eggs; it's something new. In quantum physics, when a particle decays (like a neutron turning into a proton), the original particle ceases, and new particles are created. This mirrors the Buddhist view that things don't have a continuous, inherent nature; they arise and cease based on conditions, like milk becoming curds but not remaining milk.",
            animationType: "particleDecay"
        },
        {
            number: "Verse 7",
            text: "If a bit of the non-empty existed, a bit of the empty would also exist. If there did not exist a bit of the non-empty, how could the empty exist?",
            madhyamakaConcept: "Emptiness is universal, no distinction; all phenomena are empty, no non-empty parts.",
            quantumParallel: "Superposition: all quantum systems can be in superpositions, universal, like universal emptiness.",
            accessibleExplanation: "Imagine a rainbow. Every color you see comes from light bending through water droplets—there's no color in the rainbow that isn't part of this process. In quantum physics, all particles can exist in multiple states at once, called superposition; it's a universal trait. Similarly, in Buddhism, all things are empty of inherent existence—there are no exceptions. Just as every color in the rainbow follows the same rule, every phenomenon is equally empty, with no mix of empty and non-empty.",
            animationType: "superposition"
        },
        {
            number: "Verse 8",
            text: "The Conquerors taught emptiness as the forsaking of all views. Those who view emptiness are taught to be without realisation incurable / incorrigible.",
            madhyamakaConcept: "Emptiness is transcending views, not a doctrine; grasping it as such leads to error.",
            quantumParallel: "Entanglement: correct understanding doesn't allow faster-than-light, misinterpreting leads to errors, like viewing emptiness.",
            accessibleExplanation: "Think about a map. It helps you navigate, but it's not the actual place. If you mistake the map for the place itself, you'll get lost. In quantum physics, entanglement is often misunderstood—people think it allows faster-than-light communication, but it doesn't. Similarly, in Buddhism, emptiness isn't a belief to cling to; it's a way to see beyond all beliefs. If you treat emptiness as just another idea, you miss its true purpose, which is to let go of all fixed views.",
            animationType: "advancedEntanglement"
        }
    ]
};