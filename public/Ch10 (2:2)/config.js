export const verses = [
    {
        number: 9,
        text: "If fire were dependent on wood, already established fire would be established again. Firewood also would be such even without fire.",
        madhyamaka: "Challenges logical consistency of dependence, showing neither can be independent or fully dependent.",
        quantum: "Superposition: Systems in multiple states, neither here nor there.",
        accessible: "Like a coin spinning, not heads or tails yet, fire and wood are neither fully separate nor together until conditions meet.",
        animationType: "superposition",
        animationParams: {
            type: "p5js",
            title: "Quantum Superposition",
            controls: [
                { id: "particles", label: "Particles", type: "range", min: 10, max: 100, value: 50, step: 1 },
                { id: "speed", label: "Speed", type: "range", min: 0.5, max: 5, value: 1, step: 0.1 }
            ]
        }
    },
    {
        number: 10,
        text: "If a thing (A) is established dependently (on B), but if what it depends upon (B) is established also in dependence on that very thing (A), what would be established in dependence on what?",
        madhyamaka: "Further explores circular dependency, showing mutual dependence leads to logical impasse, reinforcing emptiness.",
        quantum: "Quantum contextuality: Properties depend on measurement context, interdependent.",
        accessible: "Like a mirror reflecting a mirror, fire and wood reflect each other's existence, like quantum properties needing context.",
        animationType: "contextuality",
        animationParams: {
            type: "threejs",
            title: "Quantum Contextuality",
            controls: [
                { id: "rotation", label: "Rotation", type: "range", min: 0, max: 1, value: 0.5, step: 0.01 },
                { id: "complexity", label: "Complexity", type: "range", min: 1, max: 10, value: 5, step: 1 }
            ]
        }
    },
    {
        number: 11,
        text: "How can a thing (A) which is established dependently (on B) be dependent (on B) when it (A) is not established? If one asks, \"how can establishment be dependent?\" It is not reasonable for it (A) to be dependent.",
        madhyamaka: "Questions logical possibility of dependent establishment, showing inherent existence is untenable.",
        quantum: "Uncertainty principle: Cannot know position and momentum simultaneously, showing limits to establishment.",
        accessible: "Like trying to catch smoke, you can't pin down fire without wood, like physics can't know everything at once.",
        animationType: "uncertainty",
        animationParams: {
            type: "threejs",
            title: "Uncertainty Principle",
            controls: [
                { id: "precision", label: "Measurement Precision", type: "range", min: 0.1, max: 2, value: 1, step: 0.1 },
                { id: "particles", label: "Particles", type: "range", min: 1, max: 20, value: 10, step: 1 }
            ]
        }
    },
    {
        number: 12,
        text: "There is no fire that is dependent on wood; there is also no fire that is not dependent on wood. There is no wood that is dependent on fire; there is also no wood that is not dependent on fire.",
        madhyamaka: "Denies both dependence and independence, rejecting extremes, central to Madhyamaka's middle way.",
        quantum: "Superposition: Systems in multiple states, neither dependent nor independent.",
        accessible: "Like a cloud, fire and wood are neither fully tied nor free, like quantum systems being both wave and particle.",
        animationType: "waveparticle",
        animationParams: {
            type: "p5js",
            title: "Wave-Particle Duality",
            controls: [
                { id: "observation", label: "Observation Strength", type: "range", min: 0, max: 1, value: 0.5, step: 0.01 },
                { id: "wavelength", label: "Wavelength", type: "range", min: 10, max: 50, value: 25, step: 1 }
            ]
        }
    },
    {
        number: 13,
        text: "Fire does not come from something else; fire also does not exist in wood. Likewise, the remainder of wood has been shown by gone, not-gone and going.",
        madhyamaka: "Argues fire doesn't originate elsewhere nor pre-exist, showing dependent nature, extending to all phenomena.",
        quantum: "Quantum tunneling: Particles appear without classical paths, not coming from elsewhere.",
        accessible: "Like a ghost passing through walls, fire doesn't come from outside, like particles tunneling through barriers.",
        animationType: "tunneling",
        animationParams: {
            type: "threejs",
            title: "Quantum Tunneling",
            controls: [
                { id: "barrier", label: "Barrier Thickness", type: "range", min: 0.5, max: 5, value: 2, step: 0.1 },
                { id: "energy", label: "Particle Energy", type: "range", min: 0.1, max: 2, value: 1, step: 0.1 }
            ]
        }
    },
    {
        number: 14,
        text: "Wood itself is not fire; fire is also not something other than wood. Fire does not possess wood; wood does not exist in fire; that (fire) does not exist in it.",
        madhyamaka: "Denies all possible substantial relationships, showing emptiness of inherent connections.",
        quantum: "Quantum field theory: Particles as field excitations, no inherent possession or containment.",
        accessible: "Like waves on water, fire and wood aren't separate things, like particles being part of fields, not distinct objects.",
        animationType: "quantumfield",
        animationParams: {
            type: "threejs",
            title: "Quantum Field Theory",
            controls: [
                { id: "excitation", label: "Field Excitation", type: "range", min: 0, max: 1, value: 0.5, step: 0.01 },
                { id: "fieldSize", label: "Field Size", type: "range", min: 10, max: 50, value: 30, step: 1 }
            ]
        }
    },
    {
        number: 15,
        text: "Through fire and wood is explained without exception all the stages of self and the grasped and at the same time jugs, cloth and so on.",
        madhyamaka: "Generalizes argument to all phenomena, showing all are empty like fire and wood, central to MMK's conclusion.",
        quantum: "Summary of quantum concepts applied to everyday objects.",
        accessible: "Like how fire and wood show all things depend, so do jugs and cloths, like everything in life needing conditions.",
        animationType: "summary",
        animationParams: {
            type: "threejs",
            title: "Quantum World Summary",
            controls: [
                { id: "objects", label: "Objects", type: "range", min: 1, max: 10, value: 5, step: 1 },
                { id: "connections", label: "Connection Strength", type: "range", min: 0, max: 1, value: 0.5, step: 0.01 }
            ]
        }
    },
    {
        number: 16,
        text: "I do not think those who teach the identity or difference of self and things are wise in the meaning of the teaching.",
        madhyamaka: "Criticizes views asserting inherent identity or difference, aligning with Madhyamaka's rejection of extremes.",
        quantum: "Neither entirely same nor different, like quantum states that resist binary categorization.",
        accessible: "Like saying neither all same nor all different makes sense, fire and wood teach us things aren't fixed, like quantum states.",
        animationType: "superposition",
        animationParams: {
            type: "p5js",
            title: "Beyond Binary States",
            controls: [
                { id: "entanglement", label: "Entanglement", type: "range", min: 0, max: 1, value: 0.5, step: 0.01 },
                { id: "complexity", label: "System Complexity", type: "range", min: 1, max: 10, value: 5, step: 1 }
            ]
        }
    }
];

