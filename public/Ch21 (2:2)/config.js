// Animation configuration and verse data
export const verses = [
    {
        number: 13,
        text: "It is not that those who are born, cease, nor is it that those who are not born do not cease. All things are empty, what ceases and what does not?",
        concept: "Neither born nor not-born inherently cease; all phenomena are empty, lacking inherent ceasing.",
        quantum: "Quantum field theory: Particles are field excitations, not inherently existing entities.",
        explanation: "Like ripples on water, particles come and go without inherent existence; similarly, birth and death are empty concepts.",
        controls: [
            {
                type: "slider",
                id: "energy-slider",
                label: "Field Energy",
                min: 0,
                max: 100,
                value: 50
            },
            {
                type: "button",
                id: "create-particle",
                label: "Create Particle"
            }
        ]
    },
    {
        number: 14,
        text: "It is not that what is born does not die, nor is it that what is not born, dies: of the essence, not of the essence, from whence is there an examination?",
        concept: "Birth and death are not inherent properties; all things are empty, so examining them from an essentialist view is misguided.",
        quantum: "Quantum measurement: Properties like position are not inherent but depend on observation.",
        explanation: "An electron's position isn't fixed until measured; similarly, birth and death aren't fixed properties but depend on perspective.",
        controls: [
            {
                type: "button",
                id: "measure-electron",
                label: "Measure Position"
            },
            {
                type: "button",
                id: "reset-electron",
                label: "Reset Electron Cloud"
            }
        ]
    },
    {
        number: 15,
        text: "If a thing is permanent, it will not arise. If a thing is impermanent, it will not cease. That which is not arising and not ceasing, is indeed nirvana.",
        concept: "Neither permanence nor impermanence is inherently true; nirvana is beyond arising and ceasing.",
        quantum: "Time symmetry: Many physical processes are reversible, challenging definitive arising and ceasing.",
        explanation: "Physics shows processes can run backward; similarly, nirvana is beyond start and stop.",
        controls: [
            {
                type: "slider",
                id: "time-direction",
                label: "Time Direction",
                min: -100,
                max: 100,
                value: 0
            },
            {
                type: "button",
                id: "toggle-time",
                label: "Toggle Time Flow"
            }
        ]
    },
    {
        number: 16,
        text: "The Lord spoke of arising which is dependent and of ceasing which is dependent. Arising and ceasing are artificial and not fixed.",
        concept: "Arising and ceasing are dependent on conditions, not inherent; they are conventional designations.",
        quantum: "Quantum contextuality: Measurement outcomes depend on context, not fixed properties.",
        explanation: "How you measure affects what you see; similarly, arising and ceasing depend on conditions.",
        controls: [
            {
                type: "button",
                id: "x-measure",
                label: "Measure X-Axis"
            },
            {
                type: "button",
                id: "y-measure",
                label: "Measure Y-Axis"
            },
            {
                type: "button",
                id: "z-measure",
                label: "Measure Z-Axis"
            }
        ]
    },
    {
        number: 17,
        text: "This which is brought forth conditionally is not brought forth, unstopped it does not stop. Annihilation and origination do not exist any more than do stopping and moving.",
        concept: "Conditionally arisen things lack inherent arising and ceasing; concepts like origination and annihilation are empty.",
        quantum: "Quantum Zeno effect: Frequent observation prevents change, showing conditional 'stopping.'",
        explanation: "Watching something closely can freeze it; similarly, arising and ceasing are conditional.",
        controls: [
            {
                type: "slider",
                id: "observation-rate",
                label: "Observation Frequency",
                min: 0,
                max: 100,
                value: 0
            },
            {
                type: "button",
                id: "toggle-observation",
                label: "Toggle Observations"
            }
        ]
    },
    {
        number: 18,
        text: "If there were something which was essentially existent, this something would be unmade. How could that essentially existent thing be conditionally existent?",
        concept: "Inherent existence implies no dependence on conditions, contradicting observed reality; thus, nothing has inherent existence.",
        quantum: "Complementarity: Properties like position and momentum can't both be definite, showing no inherent properties.",
        explanation: "Can't know position and speed exactly; properties depend on measurement, not inherent.",
        controls: [
            {
                type: "slider",
                id: "uncertainty-balance",
                label: "Position/Momentum Balance",
                min: 0,
                max: 100,
                value: 50
            },
            {
                type: "button",
                id: "measure-position",
                label: "Measure Position"
            },
            {
                type: "button",
                id: "measure-momentum",
                label: "Measure Momentum"
            }
        ]
    },
    {
        number: 19,
        text: "If there were something which was essentially non-existent, this something would be unmade. How could that essentially non-existent thing be conditionally existent?",
        concept: "Neither inherent existence nor non-existence; phenomena are dependently originated.",
        quantum: "Virtual particles: Not fully existent but affect reality under conditions.",
        explanation: "Virtual particles influence real things without being fully there; similarly, things aren't completely non-existent.",
        controls: [
            {
                type: "slider",
                id: "plate-distance",
                label: "Plate Distance",
                min: 10,
                max: 100,
                value: 50
            },
            {
                type: "button",
                id: "toggle-field",
                label: "Toggle Field Visibility"
            }
        ]
    },
    {
        number: 20,
        text: "That which depends on another is not stopped or made, it is neither destroyed nor eternal, and not existing, not ceasing, what is here in this?",
        concept: "Dependently originated things are beyond extremes of creation, destruction, existence, non-existence.",
        quantum: "Conservation laws: Quantities like energy are neither created nor destroyed, only transformed.",
        explanation: "Energy changes form but isn't created or destroyed; similarly, things transform without inherent birth or death.",
        controls: [
            {
                type: "button",
                id: "initiate-collision",
                label: "Initiate Collision"
            },
            {
                type: "slider",
                id: "collision-energy",
                label: "Collision Energy",
                min: 0,
                max: 100,
                value: 50
            }
        ]
    },
    {
        number: 21,
        text: "Likewise, if the continuity of becoming is not reasonable at any of the three times, how can there be a continuity of becoming which is non-existent in the three times?",
        concept: "Time and becoming are not inherently real; they are conventional constructs.",
        quantum: "Emergent time in quantum gravity: Time may not be fundamental but arises from deeper laws.",
        explanation: "Some theories suggest time isn't basic but emerges; similarly, time and becoming are empty concepts.",
        controls: [
            {
                type: "button",
                id: "start-time",
                label: "Start Time Flow"
            },
            {
                type: "button",
                id: "stop-time",
                label: "Stop Time Flow"
            },
            {
                type: "slider",
                id: "observation-strength",
                label: "Observation Strength",
                min: 0,
                max: 100,
                value: 50
            }
        ]
    }
];

// Animation settings
export const settings = {
    backgroundColor: 0x080814,
    particleColor: 0x4361ee,
    highlightColor: 0x7209b7
};

