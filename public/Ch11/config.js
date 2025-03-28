// Configuration settings for the verses and animations
export const config = {
    verses: [
        {
            number: 1,
            text: "When asked, 'is a before-extreme evident?' the great Muni said, 'it is not.' Samsara has no beginning, no end; it has no before, no after.",
            concepts: {
                madhyamaka: "Nagarjuna rejects the notion of temporal extremes in samsara, arguing it has no inherent beginning or end. A starting point would imply an uncaused cause, which contradicts dependent origination. This denial underscores the emptiness of fixed temporal boundaries, portraying samsara as an endless, dependently arisen process without intrinsic existence.",
                quantum: "Quantum vacuum fluctuations exemplify this, as particles spontaneously emerge and vanish in empty space without a definitive origin. This mirrors samsara's ceaseless cycle, reflecting dynamic emptiness. The quantum vacuum isn't static but perpetually active, challenging notions of a fixed starting point.",
                accessible: "Think of ripples spreading across a pond that never fully stop or start from one spot—they just keep going. In physics, empty space buzzes with particles appearing and disappearing, like samsara's timeless flow. There's no first ripple, just constant motion."
            },
            controls: [
                {
                    type: "slider",
                    id: "particle-density",
                    label: "Particle Density",
                    min: 100,
                    max: 2000,
                    value: 500,
                    step: 100
                },
                {
                    type: "slider",
                    id: "energy-level",
                    label: "Energy Level",
                    min: 0.1,
                    max: 2.0,
                    value: 1.0,
                    step: 0.1
                }
            ]
        },
        {
            number: 2,
            text: "For that without beginning and end, where can a middle be in that? Therefore, it is not possible for it to have before, after, and simultaneous phases.",
            concepts: {
                madhyamaka: "Without a beginning or end, samsara cannot have a definable middle, dismantling the idea of distinct temporal phases. This reinforces time's lack of inherent existence, a core Madhyamaka principle. Temporal distinctions are mere conventions, empty of independent reality.",
                quantum: "The Wheeler-DeWitt equation in quantum gravity suggests time isn't fundamental but emerges from other factors, aligning with the verse's rejection of fixed temporal stages. In this framework, past, present, and future blur, echoing Nagarjuna's timeless view.",
                accessible: "Picture a book with no first or last page—where's the middle? Some physics theories say time isn't a straight line but arises from other conditions, mixing up what's before or after, much like samsara's flow."
            },
            controls: [
                {
                    type: "slider",
                    id: "node-count",
                    label: "Event Nodes",
                    min: 10,
                    max: 100,
                    value: 40,
                    step: 5
                },
                {
                    type: "slider",
                    id: "connection-distance",
                    label: "Connection Range",
                    min: 0.5,
                    max: 3.0,
                    value: 1.5,
                    step: 0.1
                }
            ]
        },
        {
            number: 3,
            text: "If birth were before and aging / death after, there would be birth without aging / death and also without dying one would be born.",
            concepts: {
                madhyamaka: "Positing birth before death leads to absurdities: birth without death defies their interdependence. This exposes the flaws in assuming fixed temporal order, emphasizing emptiness. Birth and death are mutually reliant, lacking standalone existence.",
                quantum: "In quantum field theory, pair production ties creation (birth) to annihilation (death)—one can't occur without the other's potential. This interdependence mirrors the verse's logic, showing processes are linked, not isolated.",
                accessible: "Imagine a magic trick where something appears only to vanish later—the two are connected. In physics, particles pop into existence with a partner, destined to fade together, like birth always leading to death."
            },
            controls: [
                {
                    type: "slider",
                    id: "energy-threshold",
                    label: "Energy Threshold",
                    min: 0.1,
                    max: 2.0,
                    value: 1.0,
                    step: 0.1
                },
                {
                    type: "button",
                    id: "trigger-pair",
                    label: "Trigger Pair Production"
                }
            ]
        },
        {
            number: 4,
            text: "If birth were after and aging / death before, how could there be an uncaused aging / death which has no birth?",
            concepts: {
                madhyamaka: "Death preceding birth is illogical, as death presupposes something to die—birth. This contradiction highlights their interdependence and the emptiness of independent temporal events. Nagarjuna dismantles rigid sequencing, pointing to relational existence.",
                quantum: "Quantum mechanics requires preparation before measurement; reversing this order is nonsensical, akin to death before birth. The sequence reflects causality, supporting the verse's critique of isolated temporal phases.",
                accessible: "You can't taste a cake before baking it—there's nothing to taste! In physics, you set up an experiment before checking results, just as birth must come before death for it to make sense."
            },
            controls: [
                {
                    type: "button",
                    id: "proper-sequence",
                    label: "Run Proper Sequence"
                },
                {
                    type: "button",
                    id: "reverse-sequence",
                    label: "Attempt Reversed Sequence"
                }
            ]
        },
        {
            number: 5,
            text: "It is not suitable for birth and aging / death to be simultaneous; that which is being born would be dying and both would be without cause.",
            concepts: {
                madhyamaka: "Simultaneous birth and death create a paradox: a thing being born can't die at the same instant, as each requires distinct causes. This underscores their non-simultaneous, dependent nature, reinforcing emptiness of inherent timing.",
                quantum: "In quantum mechanics, an electron can't absorb and emit a photon at once—these are separate transitions. This mutual exclusivity parallels the verse's rejection of simultaneous birth and death, highlighting distinct processes.",
                accessible: "A light can't switch on and off at the exact same moment—it's one or the other. In physics, particles shift states step-by-step, like birth and death needing their own time, not happening together."
            },
            controls: [
                {
                    type: "button",
                    id: "absorption",
                    label: "Show Absorption"
                },
                {
                    type: "button",
                    id: "emission",
                    label: "Show Emission"
                },
                {
                    type: "button",
                    id: "try-simultaneous",
                    label: "Try Simultaneous"
                }
            ]
        },
        {
            number: 6,
            text: "Why fixate on that birth, that aging / dying, for which the phases of before, after, simultaneity are impossible?",
            concepts: {
                madhyamaka: "Obsessing over birth and death's timing is pointless, as they resist categorization into before, after, or together. These phenomena are conventionally real but empty of inherent existence, arising dependently per Madhyamaka philosophy.",
                quantum: "Quantum contextuality reveals a particle's properties depend on how they're measured, not fixed traits. This aligns with the verse's challenge to rigid temporal labels, emphasizing relational nature over inherent essence.",
                accessible: "A chameleon's color depends on its surroundings, not a set rule. In physics, a particle's traits shift with how we look at them, like birth and death changing meaning based on context, not fixed times."
            },
            controls: [
                {
                    type: "select",
                    id: "measurement-axis",
                    label: "Measurement Axis",
                    options: ["X-Axis", "Y-Axis", "Z-Axis"]
                },
                {
                    type: "button",
                    id: "measure-property",
                    label: "Measure Property"
                }
            ]
        },
        {
            number: 7,
            text: "It is not just samsara alone that has no before-extreme; cause and fruit themselves, and characteristics and the basis for characteristics themselves.",
            concepts: {
                madhyamaka: "The absence of a before-extreme extends beyond samsara to causes, effects, attributes, and their foundations—all lack inherent beginnings. This broadens emptiness to all phenomena, showing their dependent origination and lack of fixed identity.",
                quantum: "Relational quantum mechanics posits that properties emerge from interactions, not independently. This interdependence echoes the verse, where causes and effects are relative, not standalone, mirroring a web of relations.",
                accessible: "\"Fast\" makes sense only compared to \"slow\"—it's all relative. In physics, a particle's state depends on its partner, like how causes and effects tie together without a set starting line."
            },
            controls: [
                {
                    type: "button",
                    id: "measure-particle1",
                    label: "Measure Particle 1"
                },
                {
                    type: "button",
                    id: "measure-particle2",
                    label: "Measure Particle 2"
                },
                {
                    type: "button",
                    id: "reset-entanglement",
                    label: "Reset Entanglement"
                }
            ]
        },
        {
            number: 8,
            text: "Feeling and the feeler, whatever is suitable to bear meaning, also all things have no before-extreme.",
            concepts: {
                madhyamaka: "Feelings, the feeler, and all phenomena lack a beginning or inherent essence, being dependently originated. This challenges an independent self or mind, aligning with Madhyamaka's view of emptiness across subjective and objective realms.",
                quantum: "The observer effect in quantum mechanics ties the observed to the observer—measuring a particle alters it, suggesting reality and consciousness intertwine. This reflects the verse's interdependence of feeling and feeler.",
                accessible: "Watching a movie changes how you feel, and your mood shapes what you see—neither stands alone. In physics, looking at a particle affects it, like how mind and experience blend without a clear start."
            },
            controls: [
                {
                    type: "button",
                    id: "observe-particle",
                    label: "Observe Particle"
                },
                {
                    type: "button",
                    id: "reset-superposition",
                    label: "Reset Superposition"
                }
            ]
        }
    ],
    defaultAnimationSettings: {
        cameraDistance: 10,
        rotationSpeed: 0.001,
        backgroundColor: 0x000011
    }
};

