// Configuration settings for the animations
export const config = {
    // General settings
    transition: {
        duration: 1.5, // Duration of transitions in seconds
    }, 

    // Settings for each verse animation
    verse1: {
        gridSize: 20,
        gridColor: 0x3a3a5c,
        activeColor: 0x8a6bff,
        rippleSpeed: 0.4,
        particleDensity: 5000, 
    }, 

    verse2: {
        blobColor: 0x555555,
        definedColor: 0x9966ff,
        pulseSpeed: 1.5,
        complexity: 2.5, 
    }, 

    verse3: {
        minColor: 0x2255aa,
        maxColor: 0xff5588,
        transitionSpeed: 1.0,
        backgroundColor: 0x222233, 
    }, 

    verse4: {
        mirrorReflectivity: 0.6,
        objectColor: 0xffaa33,
        environmentIntensity: 1.5,
        interactionSpeed: 0.8, 
    }, 

    verse5: {
        oceanColor: 0x3366cc,
        waveHeight: 0.8,
        waveSpeed: 1.2,
        foamColor: 0xffffff, 
    }, 

    verse6: {
        bulbColor: 0xffffaa,
        glowIntensity: 1.0,
        minBrightness: 0.1,
        maxBrightness: 1.0, 
    }, 

verse7: {
    particleSize: 0.35, // Increased size
    particleCount: 3000,
    particleColor: 0xffffff, // Changed to white for brightness
    emergenceRate: 1.2, // Increased speed
},

    verse8: {
        glassColor: 0xaaccff,
        liquidColor: 0x3377aa,
        liquidOpacity: 0.7,
        rotationSpeed: 0.5, 
    }, 
}; 


// Verse content for display in the side panel
export const verses = [
    {
        id: 1,
        text: `"Prior to a characteristic of space
There is not the slightest space.
If it arose prior to the characteristic
Then it would, absurdly, arise without a characteristic."`,
        concept: "Nagarjuna asserts that space cannot exist independently of its characteristics (e.g., extension, direction). If space existed before these defining traits, it would lack identity, which is incoherent. This exemplifies shunyata (emptiness): space only \"exists\" through dependent conditions, not as an inherent entity.",
        physics: "In quantum field theory, space is not a passive void but a dynamic medium filled with quantum fields. Without these fields—its \"characteristics\"—space has no functional meaning, echoing Nagarjuna's rejection of an independent essence.",
        explanation: "Imagine a blank canvas: without paint, it's not a painting—it's just potential. Space is like that: it needs \"paint\" (fields or particles) to be anything meaningful, not a standalone thing.", 
    }, 

    {
        id: 2,
        text: `"A thing without a characteristic
Has never existed.
If nothing lacks a characteristic,
Where do characteristics come to be?"`,
        concept: "No entity can exist without traits to define it, yet those traits don't arise independently. Both the entity and its characteristics emerge interdependently, revealing their emptiness of inherent existence.",
        physics: "Quantum indeterminacy shows that particles lack definite properties (e.g., position, momentum) until measured. These traits emerge relationally through observation, not as intrinsic qualities, aligning with Nagarjuna's insight.",
        explanation: "Think of a song: without notes, it's not a song, but the notes only make sense together in the melody. Similarly, a particle's traits—like a song's notes—depend on how they're \"heard\" through measurement.", 
    }, 

    {
        id: 3,
        text: `"Neither in the uncharacterized nor in the characterized
Does a characteristic arise.
Nor does it arise
In something different from these two."`,
        concept: "Nagarjuna employs the tetralemma, negating all possible origins for characteristics: they don't emerge from undefined things, defined things, or anything beyond these categories. This underscores their lack of inherent existence.",
        physics: "Quantum contextuality reveals that a particle's properties depend on the measurement context, not a fixed source. This mirrors Nagarjuna's rejection of an inherent origin for traits.",
        explanation: "Picture a chameleon: its color shifts with its surroundings, not from some inner \"chameleon essence.\" In quantum physics, a particle's \"color\" changes based on how we look at it, not what it inherently is.", 
    }, 

    {
        id: 4,
        text: `"If characteristics do not appear,
Then it is not tenable to posit the characterized object.
If the characterized object is not posited,
There will be no characteristic either."`,
        concept: "Characteristics and the objects they define are mutually dependent: without traits, there's no object; without an object, traits have no basis. This interdependence reveals their shared emptiness.",
        physics: "Quantum entanglement links the observer and observed. Measurement co-defines both the particle and its properties, reflecting the mutual reliance Nagarjuna describes.",
        explanation: "Think of a mirror and its reflection: take away the mirror, and the reflection disappears; remove the reflection, and the mirror loses its point. In quantum physics, observer and particle define each other.", 
    }, 

    {
        id: 5,
        text: `"From this it follows that there is no characterized
And no existing characteristic.
Nor is there any entity
Other than the characterized and the characteristic."`,
        concept: "Since neither objects nor their traits have inherent existence, no third category exists beyond them. Nagarjuna exhausts all conceptual possibilities, pointing to the ultimate emptiness of phenomena.",
        physics: "Quantum field theory portrays reality as excitations in fields—there's no \"something else\" beyond these relational events, resonating with Nagarjuna's negation of a third entity.",
        explanation: "Imagine the ocean: it's just waves and water—there's no separate \"thing\" floating apart from them. In quantum physics, everything is ripples in fields, with no extra \"stuff\" lurking.", 
    }, 

    {
        id: 6,
        text: `"If there is no existent thing,
Of what will there be nonexistence?
Apart from existent and nonexistent things
Who knows existence and nonexistence?"`,
        concept: "Existence and nonexistence depend on each other—neither is absolute. Nagarjuna transcends this duality, suggesting reality lies beyond such binary categories.",
        physics: "Quantum superposition allows particles to exist in multiple states simultaneously, neither fully \"existent\" nor \"nonexistent\" until observed, paralleling the verse's insight.",
        explanation: "Picture a dimmer switch: it's not just on or off but somewhere in between until you set it. In quantum physics, particles hover between being and not being until we check.", 
    }, 

    {
        id: 7,
        text: `"Therefore, space is not an entity.
It is not a nonentity.
Not characterized, not without character.
The same is true of the other five elements."`,
        concept: "Space—and by extension, all elements—defies categorization as entity, nonentity, defined, or undefined. This universal emptiness applies to all phenomena, not just space.",
        physics: "The quantum vacuum isn't truly empty but teems with virtual particles, resisting labels like \"entity\" or \"nonentity.\" This aligns with Nagarjuna's view of space as indefinable.",
        explanation: "Imagine a \"blank\" page: it's not nothing—it holds potential for words or drawings. In quantum physics, \"empty\" space buzzes with unseen energy, never truly one thing or another.", 
    }, 

    {
        id: 8,
        text: `"Fools and reificationists who perceive
The existence and nonexistence
Of objects
Do not see the pacification of objectification."`,
        concept: "Clinging to objects as inherently existent or nonexistent reflects ignorance of emptiness. True understanding \"pacifies\" such conceptual grasping, transcending dualities.",
        physics: "The measurement problem in quantum mechanics shows reality doesn't fit fixed categories—observation shapes it, not reveals a pre-set state, mirroring Nagarjuna's \"pacification.\"",
        explanation: "Think of arguing whether a glass is half full or half empty: it's both, depending on your angle. In quantum physics, particles don't \"have\" states—they're defined by how we see them.", 
    }, 
]; 