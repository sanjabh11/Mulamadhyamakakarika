// Configuration for verse content and animations
export const verses = [
    {
        number: 14,
        text: "\"Since the beginning of motion Cannot be conceived in any way, What gone thing, what going thing, And what non-going thing can be posited?\"",
        madhyamakaConcept: "If motion's start is empty, then past, present, and future states of motion are also empty. This extends emptiness to all temporal categories, a Madhyamaka hallmark.",
        quantumParallel: "Superposition allows a particle to occupy multiple temporal states simultaneously, defying fixed labels like \"gone\" or \"going,\" as in the verse.",
        accessibleExplanation: "Imagine a clock with hands pointing everywhere at once. In quantum physics, particles can blur past, present, and future until you check them.",
        sceneConfig: {
            type: "temporalSuperposition",
            particleCount: 2000,
            pathComplexity: 3,
            colors: {
                primary: "#4080ff",
                secondary: "#ff40ff",
                tertiary: "#40ffff"
            },
            speed: 0.8
        }
    },
    {
        number: 15,
        text: "\"Just as a moving thing is not stationary, A non-moving thing is not stationary. Apart from the moving and the non-moving, What third thing is stationary?\"",
        madhyamakaConcept: "Stationarity, like motion, lacks inherent existence—it's not in moving or non-moving things, and no third option exists. This reveals the emptiness of all such categories.",
        quantumParallel: "Wave-Particle Duality shows quantum entities can exhibit both wave (motion) and particle (stationary) traits, defying fixed labels as in the verse.",
        accessibleExplanation: "Think of water: it can ripple or sit still, but it's never just one. In quantum physics, particles switch between wave and particle forms, never fully fixed.",
        sceneConfig: {
            type: "waveParticleDuality",
            particleCount: 1000,
            wavelength: 2.5,
            amplitude: 1.2,
            colors: {
                waveState: "#60a0ff",
                particleState: "#ff60a0",
                transition: "#a060ff"
            },
            speed: 1.0
        }
    },
    {
        number: 16,
        text: "\"If without motion It is not appropriate to posit a mover, How could it be appropriate to say That a moving thing is stationary?\"",
        madhyamakaConcept: "Motion and stationarity are interdependent—neither is inherent. A mover needs motion, and a moving thing can't be stationary, showing their emptiness.",
        quantumParallel: "Complementarity in quantum mechanics holds that wave and particle traits are mutually exclusive yet both essential, like motion and stationarity here.",
        accessibleExplanation: "Picture a coin: heads or tails, but not both at once, though both define it. In quantum physics, particles show one trait at a time, yet need both to be whole.",
        sceneConfig: {
            type: "complementarity",
            particleSize: 2,
            morphSpeed: 1.5,
            colors: {
                wave: "#40c0ff",
                particle: "#ffc040",
                blend: "#c040ff"
            },
            interactive: true
        }
    },
    {
        number: 17,
        text: "\"One does not halt from moving, Nor from having moved or not having moved. Motion and coming to rest And starting to move are similar.\"",
        madhyamakaConcept: "Transitions like starting or stopping motion lack inherent points—they're processes, not fixed states. This reflects the emptiness of beginnings and ends in Madhyamaka.",
        quantumParallel: "Quantum State Evolution is a continuous process with no inherent \"start\" or \"stop,\" paralleling the verse's view of motion as seamless.",
        accessibleExplanation: "Imagine a river flowing endlessly—it doesn't \"begin\" or \"end\" abruptly. In quantum physics, particles evolve smoothly, with no sharp breaks in their dance.",
        sceneConfig: {
            type: "continuousFlow",
            streamDensity: 2000,
            flowRate: 0.8,
            colors: {
                stream: "#60e0ff",
                glow: "#a060ff",
                background: "#000020"
            },
            turbulence: 0.5
        }
    },
    {
        number: 18,
        text: "\"That motion just is the mover itself Is not correct. Nor is it correct that They are completely different.\"",
        madhyamakaConcept: "Nagarjuna's Middle Way avoids extremes: motion and mover are neither identical nor fully separate. This balance reveals their emptiness of inherent nature.",
        quantumParallel: "Entanglement shows particles are correlated without being identical or wholly distinct, echoing the Middle Way's relational stance.",
        accessibleExplanation: "Think of two friends who sync perfectly but aren't the same person. In quantum physics, entangled particles are linked yet individual, sharing a subtle bond.",
        sceneConfig: {
            type: "entanglement",
            particleCount: 2,
            orbitSpeed: 0.6,
            connectionStrength: 0.7,
            colors: {
                particle1: "#40a0ff",
                particle2: "#ff60a0",
                connection: "#c0a0ff"
            },
            orbitComplexity: 2
        }
    },
    {
        number: 19,
        text: "\"It would follow from The identity of mover and motion That agent and action Are identical.\"",
        madhyamakaConcept: "If mover and motion were the same, agent and action would collapse into one, which is illogical. This critiques inherent identity, showing their emptiness.",
        quantumParallel: "Observer Effect blurs the line between observer (agent) and observed (action), linking them without merging, as in the verse's critique.",
        accessibleExplanation: "Imagine a chef tasting soup—tasting changes the dish, tying the chef to the act. In quantum physics, observing a particle alters its state, connecting observer and event.",
        sceneConfig: {
            type: "observerEffect",
            particleCount: 300,
            observerStrength: 0.8,
            colors: {
                observer: "#ff8040",
                particle: "#60c0ff",
                effect: "#c0a0ff"
            },
            sensitivity: 1.2
        }
    },
    {
        number: 20,
        text: "\"It would follow from A real distinction between motion and mover That there could be a mover without motion And motion without a mover.\"",
        madhyamakaConcept: "If motion and mover were truly separate, they could exist independently, which is absurd. Their interdependence reveals their emptiness of inherent existence.",
        quantumParallel: "Entanglement ensures particles' states are inseparable, preventing independent \"motion\" or \"mover,\" mirroring the verse's logic.",
        accessibleExplanation: "Picture a kite and its string—neither flies alone. In quantum physics, entangled particles are bound together, their motions always paired.",
        sceneConfig: {
            type: "inseparablePair",
            connectionStrength: 0.9,
            orbitSpeed: 0.7,
            colors: {
                particle1: "#ff6080",
                particle2: "#60ff80",
                tether: "#c0c0ff"
            },
            tetheredMotion: true
        }
    },
    {
        number: 21,
        text: "\"When neither in identity Nor in difference Can they be established, How can these two be established at all?\"",
        madhyamakaConcept: "Motion and mover cannot be fixed as identical or different, so they lack inherent existence entirely. This points to the ultimate emptiness of all distinctions.",
        quantumParallel: "Superposition transcends binary states, allowing particles to exist beyond \"same\" or \"different,\" aligning with the verse's conclusion.",
        accessibleExplanation: "Imagine a flavor that's neither sweet nor sour but both at once. In quantum physics, particles blend states, defying simple labels until observed.",
        sceneConfig: {
            type: "superpositionBlend",
            particleCount: 1,
            morphComplexity: 3.0,
            colors: {
                state1: "#ff4080",
                state2: "#40ff80",
                blend: "#a080ff"
            },
            blendRate: 1.5
        }
    },
    {
        number: 22,
        text: "\"The motion by means of which a mover is manifest Cannot be the motion by means of which he moves. He does not exist before that motion. So what and where is the thing that moves?\"",
        madhyamakaConcept: "A mover doesn't preexist motion—without it, there's no mover. This interdependence shows neither has inherent existence, a Madhyamaka insight.",
        quantumParallel: "Wave Function Collapse defines a particle's state only upon measurement, not before, paralleling the verse's denial of a pre-existing mover.",
        accessibleExplanation: "Think of a shadow needing light to appear—it's not \"there\" without it. In quantum physics, a particle's motion emerges only when observed, not before.",
        sceneConfig: {
            type: "observationalEmergence",
            particleOpacity: 0.4,
            beamStrength: 0.7,
            colors: {
                particle: "#80c0ff",
                beam: "#fff080",
                path: "#c080ff"
            },
            observationRate: 1.2
        }
    },
    {
        number: 23,
        text: "\"A mover does not carry out a different motion From that by means of which he is manifest as a mover. Moreover, in one mover A twofold motion is unacceptable.\"",
        madhyamakaConcept: "A mover can't have two separate motions—one to be a mover, another to move—since multiplicity is illogical. This reinforces the emptiness of inherent distinctions.",
        quantumParallel: "Quantum Identity shows identical particles are indistinguishable, with no separate \"motions,\" echoing the verse's rejection of duality.",
        accessibleExplanation: "Imagine identical twins moving as one—you can't split their actions. In quantum physics, identical particles share motion, blending seamlessly.",
        sceneConfig: {
            type: "quantumIdentity",
            particleCount: 2,
            swapRate: 0.6,
            colors: {
                particle1: "#60a0ff",
                particle2: "#60a0ff",
                path: "#a080ff"
            },
            indistinguishability: 0.9
        }
    },
    {
        number: 24,
        text: "\"A really existent mover Doesn't move in any of the three ways. A non-existent mover Doesn't move in any of the three ways.\"",
        madhyamakaConcept: "Neither an existent nor a non-existent mover can inherently move, showing motion transcends ontological categories. This points to its ultimate emptiness.",
        quantumParallel: "Superposition allows particles to exist in states of being and not being simultaneously, challenging existence vs. non-existence as in the verse.",
        accessibleExplanation: "Picture a ghost fading in and out—real yet unreal. In quantum physics, particles can hover between existence and absence until measured.",
        sceneConfig: {
            type: "existentialSuperposition",
            fadeRate: 0.8,
            pulseStrength: 0.6,
            colors: {
                existence: "#80c0ff",
                nonExistence: "#202040",
                transition: "#a080ff"
            },
            stateCycles: 3
        }
    },
    {
        number: 25,
        text: "\"Neither an entity nor a non-entity Moves in any of the three ways. So motion, mover and route are non-existent.\"",
        madhyamakaConcept: "Motion, mover, and path lack inherent existence—they're neither real nor unreal. This final verse encapsulates Madhyamaka's emptiness, dissolving all phenomena into relationality.",
        quantumParallel: "Wave Function Collapse shows motion emerges relationally through measurement, not as an inherent trait, aligning with the verse's conclusion.",
        accessibleExplanation: "Imagine a mirage: it seems real but vanishes up close. In quantum physics, motion isn't \"there\" until observed, and even then, it's fleeting.",
        sceneConfig: {
            type: "relationalMirage",
            pathSolidity: 0.5,
            observationEffect: 0.8,
            colors: {
                mirage: "#80c0ff",
                solid: "#ff8080",
                measurement: "#ffffff"
            },
            disappearRate: 0.7
        }
    }
];

