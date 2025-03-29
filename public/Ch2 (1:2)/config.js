export const verses = [
    {
        id: 1,
        title: "Verse 1",
        text: "What has been moved is not moving. What has not been moved is not moving. Apart from what has been moved and what has not been moved, Movement cannot be conceived.",
        madhyamaka: "This verse asserts that motion lacks inherent existence, as it cannot be pinned to a past state (moved) or a potential state (not moved). It exists only relationally, not independently, embodying the Madhyamaka concept of emptiness—phenomena arise through dependence, not as standalone entities. Nagarjuna challenges our intuitive grasp of motion as a fixed property.",
        quantum: "Superposition in quantum mechanics states that a particle can exist in multiple states (e.g., position or momentum) simultaneously until observed. This parallels the verse's rejection of motion as fixed in 'moved' or 'not moved,' as superposition defies classical certainty until measurement collapses the state.",
        explanation: "Imagine a coin spinning in the air—it's not just heads or tails but both until it lands. In quantum physics, particles are like that, existing in a blur of possibilities. Motion isn't a solid 'thing' you can point to; it's a process that only makes sense in the moment.",
        controls: [
            {
                id: "observe-btn",
                label: "Observe",
                action: "observe"
            }
        ]
    },
    {
        id: 2,
        title: "Verse 2",
        text: "Where there is change, there is motion. Since there is change in the moving, And not in the moved or not-moved, Motion is in that which is moving.",
        madhyamaka: "Motion is defined by change, not static states like 'moved' or 'not moved.' It's a dynamic, ongoing process, empty of inherent existence outside its relational context. This reflects dependent origination—motion arises from conditions, not as an intrinsic quality.",
        quantum: "Quantum State Evolution governs how a quantum system changes over time via the Schrödinger equation. Like motion, this evolution is a continuous process, not a fixed attribute, aligning with the verse's focus on change as the essence of motion.",
        explanation: "Picture a flowing river: it's the movement of water that makes it a river, not the still puddles or dried banks. In quantum physics, particles are always shifting, like ripples in a stream, never frozen in one spot.",
        controls: [
            {
                id: "flow-slider",
                label: "Flow Speed",
                type: "slider",
                min: 0.1,
                max: 3,
                value: 1,
                step: 0.1,
                action: "flowSpeed"
            }
        ]
    },
    {
        id: 3,
        title: "Verse 3",
        text: "How would it be acceptable For motion to be in the mover? When it is not moving, it is not acceptable To call it a mover.",
        madhyamaka: "This verse highlights the interdependence of motion and mover—neither exists independently. A mover without motion isn't a mover, showing that both are empty of inherent essence and defined only relationally, a core Madhyamaka insight.",
        quantum: "Entanglement links two particles so that the state of one instantly affects the other, regardless of distance. This interdependence mirrors how motion and mover rely on each other, challenging notions of separate, inherent existence.",
        explanation: "Think of two dancers moving in perfect sync: if one stops, the dance ends. In quantum physics, entangled particles are like partners—one's motion defines the other's, inseparable in their steps.",
        controls: [
            {
                id: "move-particle",
                label: "Move Particle",
                action: "moveParticle"
            },
            {
                id: "reset-particles",
                label: "Reset",
                action: "resetParticles"
            }
        ]
    },
    {
        id: 4,
        title: "Verse 4",
        text: "For whomever there is motion in the mover, There could be non-motion Evident in the mover. But having motion follows from being a mover.",
        madhyamaka: "If motion were inherent in the mover, non-motion could absurdly coexist within it, creating a contradiction. This shows motion cannot be an intrinsic property, reinforcing its emptiness and dependence on context, a classic Madhyamaka critique.",
        quantum: "Superposition allows a quantum particle to be in multiple states (e.g., moving and still) at once. This mirrors the verse's challenge to fixed states, as a particle's 'motion' isn't definite until observed.",
        explanation: "Imagine a light bulb that's both on and off until you flip the switch. In quantum physics, particles can be in a mix of states, like a mover that's both moving and not, until checked.",
        controls: [
            {
                id: "stabilize-btn",
                label: "Stabilize",
                action: "stabilize"
            }
        ]
    },
    {
        id: 5,
        title: "Verse 5",
        text: "If motion is in the mover, There would have to be a twofold motion: One in virtue of which it is a mover, And one in virtue of which it moves.",
        madhyamaka: "This verse exposes an infinite regress: if motion is inherent in the mover, we need another motion to explain the mover's movement, and so on. This absurdity shows motion lacks inherent location, aligning with emptiness.",
        quantum: "Quantum Contextuality states that a particle's properties (like motion) depend on how they're measured, not an inherent essence. This parallels the verse's rejection of motion as fixed, as context defines the outcome.",
        explanation: "Think of a chameleon changing color based on its surroundings—you can't pin down its 'true' shade. In quantum physics, a particle's motion shifts with how you look at it, not where it 'is'.",
        controls: [
            {
                id: "measure-light",
                label: "Measure with Light",
                action: "measureLight"
            },
            {
                id: "measure-sound",
                label: "Measure with Sound",
                action: "measureSound"
            },
            {
                id: "measure-field",
                label: "Measure with Field",
                action: "measureField"
            }
        ]
    },
    {
        id: 6,
        title: "Verse 6",
        text: "If there were a twofold motion, The subject of that motion would be twofold. For without a subject of motion, There cannot be motion.",
        madhyamaka: "If motion were dual, we'd need two movers, leading to absurdity since motion requires a single subject. This underscores the emptiness of motion and mover as separate, inherently existent entities.",
        quantum: "Entanglement distributes motion (or state change) across particles, blurring the idea of a single subject. This reflects the verse's point that motion and mover are interdependent, not independent.",
        explanation: "Picture two singers harmonizing so perfectly you can't tell who's leading. In quantum physics, entangled particles share motion like a duet, with no clear 'soloist'.",
        controls: [
            {
                id: "harmony-slider",
                label: "Harmony",
                type: "slider",
                min: 0,
                max: 1,
                value: 0.5,
                step: 0.01,
                action: "harmonyLevel"
            }
        ]
    },
    {
        id: 7,
        title: "Verse 7",
        text: "If without a mover It would not be correct to say that there is motion, Then if there were no motion, How could there be a mover?",
        madhyamaka: "Motion and mover are mutually dependent—neither can exist alone. This exemplifies dependent origination, showing both lack inherent existence and arise only in relation to each other.",
        quantum: "Entanglement illustrates this interdependence, as the state of one particle cannot be defined without its entangled partner, much like motion and mover.",
        explanation: "Imagine a seesaw: one side can't rise without the other falling. In quantum physics, entangled particles balance each other's states, needing both to 'move'.",
        controls: [
            {
                id: "tilt-left",
                label: "Tilt Left",
                action: "tiltLeft"
            },
            {
                id: "tilt-right",
                label: "Tilt Right",
                action: "tiltRight"
            },
            {
                id: "balance",
                label: "Balance",
                action: "balance"
            }
        ]
    },
    {
        id: 8,
        title: "Verse 8",
        text: "Inasmuch as a real mover does not move, And a non-mover does not move, Apart from a mover and a non-mover, What third thing could move?",
        madhyamaka: "Neither a mover nor a non-mover inherently moves, and no third category exists. This deconstructs all conceptual boxes for motion, revealing their emptiness in Madhyamaka terms.",
        quantum: "Superposition defies binary labels like mover or non-mover, as particles can exist in a blend of states, echoing the verse's rejection of fixed categories.",
        explanation: "Think of a shape that's neither square nor circle but somehow both. In quantum physics, particles mix states, not fitting neatly as 'moving' or 'still'.",
        controls: [
            {
                id: "morph-slider",
                label: "Morph State",
                type: "slider",
                min: 0,
                max: 1,
                value: 0.5,
                step: 0.01,
                action: "morphState"
            }
        ]
    },
    {
        id: 9,
        title: "Verse 9",
        text: "When without motion, It is unacceptable to call something a mover, How will it be acceptable To say that a mover moves?",
        madhyamaka: "A mover requires motion to be a mover, showing their interdependence. Separating them is impossible, pointing to their lack of inherent existence—a key Madhyamaka insight.",
        quantum: "Entanglement ties the states of particles together, so one's 'motion' depends on the other, paralleling the mover-motion link.",
        explanation: "Picture a car with no engine—it's not a car if it can't move. In quantum physics, entangled particles' states are locked together, like a car and its fuel.",
        controls: [
            {
                id: "connect",
                label: "Connect",
                action: "connect"
            },
            {
                id: "disconnect",
                label: "Disconnect",
                action: "disconnect"
            }
        ]
    },
    {
        id: 10,
        title: "Verse 10",
        text: "For him from whose perspective a mover moves, There would be the consequence that Without motion there could be a mover. Because a mover moves.",
        madhyamaka: "If a mover inherently moves, then without motion it's not a mover, creating a contradiction. This critiques inherent existence, showing motion's emptiness depends on perspective.",
        quantum: "Observer Effect in quantum mechanics means observation defines a particle's state (e.g., motion), mirroring how motion depends on perspective in the verse.",
        explanation: "Imagine a shadow only appearing when you shine a light—it's not 'there' otherwise. In quantum physics, motion shows up only when you look, shaped by your view.",
        controls: [
            {
                id: "change-perspective",
                label: "Change Perspective",
                action: "changePerspective"
            }
        ]
    },
    {
        id: 11,
        title: "Verse 11",
        text: "If a mover were to move, There would be a twofold motion: One in virtue of which he is a mover, And one in virtue of which the mover moves.",
        madhyamaka: "This reiterates the infinite regress: if a mover moves, we need another motion to explain it, ad infinitum. Motion cannot be inherently located, revealing its emptiness.",
        quantum: "Quantum Recursion involves self-referencing processes, like feedback loops, that challenge fixed definitions, akin to the verse's regress critique.",
        explanation: "Think of mirrors facing each other, creating endless reflections. In quantum physics, some states loop back on themselves, never settling into one 'motion'.",
        controls: [
            {
                id: "recursion-level",
                label: "Recursion Level",
                type: "slider",
                min: 1,
                max: 5,
                value: 1,
                step: 1,
                action: "recursionLevel"
            }
        ]
    },
    {
        id: 12,
        title: "Verse 12",
        text: "Motion does not begin in what has moved, Nor does it begin in what has not moved, Nor does it begin in what is moving. In what, then, does motion begin?",
        madhyamaka: "Motion lacks an inherent starting point—it's not in the past, future, or present. This deconstructs origination, showing motion's emptiness in Madhyamaka thought.",
        quantum: "Quantum Indeterminacy means a particle's path is probabilistic, with no fixed origin until measured, aligning with the verse's rejection of a definite start.",
        explanation: "Imagine a rainbow's edge—you can't pinpoint where it begins. In quantum physics, a particle's motion is fuzzy at the start, only sharpening when observed.",
        controls: [
            {
                id: "measure-origin",
                label: "Measure Origin",
                action: "measureOrigin"
            },
            {
                id: "reset-trail",
                label: "Reset Trail",
                action: "resetTrail"
            }
        ]
    },
    {
        id: 13,
        title: "Verse 13",
        text: "Prior to the beginning of motion, There is no beginning of motion in The going or in the gone. How could there be motion in the not-gone?",
        madhyamaka: "Temporal categories like 'before' or 'after' motion lack inherent meaning. This challenges linear time, showing all such distinctions are empty in Madhyamaka terms.",
        quantum: "Time Symmetry in Quantum Mechanics reveals that many processes are reversible, undermining a fixed 'before' or 'after,' much like the verse's critique.",
        explanation: "Picture a movie scene that looks the same backward or forward. In quantum physics, time can flow both ways, so motion doesn't have a strict 'start'.",
        controls: [
            {
                id: "reverse-time",
                label: "Reverse Time",
                action: "reverseTime"
            },
            {
                id: "forward-time",
                label: "Forward Time",
                action: "forwardTime"
            }
        ]
    }
];

