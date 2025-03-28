export const config = {
    // Scene settings
    scene: {
        starCount: 1000,
        bgColor: 0x000011
    },
    
    // Sound settings
    sound: {
        enabled: true,
        volume: 0.5
    },
    
    // Animation timings
    timing: {
        transitionDuration: 1000, // ms
        verseDisplayTime: 1500 // ms before animations start
    },
    
    // Performance settings
    performance: {
        particleLimit: 200,
        mobileParticleLimit: 100,
        lowPerformanceMode: false // Set to true to reduce effects
    },
    
    // Verses content
    verses: [
        {
            id: "intro",
            title: "Introduction",
            text: "Click the globe to explore the intersection of ancient wisdom and quantum reality."
        },
        {
            id: "verse1",
            title: "Verse 1: Space and Its Characteristics",
            text: "Prior to a characteristic of space, there is not the slightest space...",
            concept: "Space relies on traits like boundaries to exist.",
            parallel: "Wave-Particle Duality—light shifts based on observation.",
            explanation: "Space needs qualities to be real, just like light changes when we watch it.",
            soundEffect: "ping"
        },
        {
            id: "verse2",
            title: "Verse 2: Entities and Characteristics",
            text: "A thing without a characteristic has never existed...",
            concept: "Objects and their traits are inseparable.",
            parallel: "Contextuality—properties shift with measurement.",
            explanation: "A chair needs its shape to be a chair, like a particle's spin depends on how we measure it.",
            soundEffect: "whoosh"
        },
        {
            id: "verse3",
            title: "Verse 3: Arising of Characteristics",
            text: "Neither in the uncharacterized nor in the characterized does a characteristic arise...",
            concept: "Traits emerge from relationships.",
            parallel: "Wave Function Collapse—a state solidifies when measured.",
            explanation: "A blurry image sharpens when you focus, like a particle's state locking in when checked.",
            soundEffect: "click"
        },
        {
            id: "verse4",
            title: "Verse 4: Mutual Dependence",
            text: "If characteristics do not appear, then it is not tenable to posit the characterized object...",
            concept: "Objects and traits depend on each other.",
            parallel: "Quantum Measurement—measurement shapes both particle and result.",
            explanation: "A mirror needs its reflection, like measuring a particle defines it and the outcome.",
            soundEffect: "hum"
        },
        {
            id: "verse5",
            title: "Verse 5: No Independent Entities",
            text: "From this it follows that there is no characterized and no existing characteristic...",
            concept: "Nothing stands alone—everything's interconnected.",
            parallel: "Quantum Field Theory—particles are field ripples.",
            explanation: "Waves aren't separate from the ocean, like particles are part of a bigger field.",
            soundEffect: "ripple"
        },
        {
            id: "verse6",
            title: "Verse 6: Existence and Nonexistence",
            text: "If there is no existent thing, of what will there be nonexistence?...",
            concept: "'Real' and 'not real' are interdependent.",
            parallel: "Superposition—particles exist in multiple states until observed.",
            explanation: "A spinning coin isn't heads or tails 'til it lands, like a particle's state before we look.",
            soundEffect: "ding"
        },
        {
            id: "verse7",
            title: "Verse 7: The Nature of Space",
            text: "Therefore, space is not an entity. It is not a nonentity...",
            concept: "Space lacks a fixed essence—it's dynamic.",
            parallel: "Quantum Vacuum—space buzzes with energy.",
            explanation: "Space isn't empty; it's alive with tiny flickers, like a quiet room humming.",
            soundEffect: "sparkle"
        },
        {
            id: "verse8",
            title: "Verse 8: Transcending Objectification",
            text: "Fools and reificationists who perceive the existence and nonexistence of objects...",
            concept: "Fixating on 'is' or 'isn't' misses reality.",
            parallel: "Measurement Problem—quantum states defy fixed labels.",
            explanation: "Catching a quantum particle is like grasping mist—it shifts.",
            soundEffect: "whoosh"
        },
        {
            id: "conclusion",
            title: "Conclusion",
            text: "The threads of ancient wisdom and modern science weave a tapestry of understanding.",
            explanation: "Keep exploring—the journey goes on!",
            soundEffect: "chime"
        }
    ]
};

