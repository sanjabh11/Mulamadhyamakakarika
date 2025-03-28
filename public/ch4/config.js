// Configuration file for the Emptiness and Quantum Physics presentation
export const config = {
    // Animation settings
    animation: {
        cameraDistance: 5,
        particleCount: 300,
        waveAmplitude: 0.5,
        waveFrequency: 0.2,
        collapseDuration: 1.5, // seconds
        particleSize: 0.05,
        backgroundColor: 0x000000,
        particleColor: 0x6c63ff,
        waveColor: 0xff9500,
        measurementColor: 0xff2d55,
        lowPerformanceMode: false, // Set to true for older devices
    },
    
    // Content for each verse
    verses: [
        {
            id: 1,
            verse: "Apart from the cause of form, form is not perceived. Apart from 'form', the cause of form also does not appear.",
            madhyamaka: "Interdependence shows form and cause are empty, lacking svabhava, challenging inherent existence.",
            quantum: "Wave-particle duality: properties depend on measurement, mirroring form's cause reliance.",
            explanation: "Like a shadow needing object and light, form relies on causes, neither existing alone.",
            animationType: "wave-particle-duality"
        },
        {
            id: 2,
            verse: "If there were form apart from the cause of form, it would follow that form is without cause; there is no object at all that is without cause.",
            madhyamaka: "Form cannot exist uncaused, reinforcing dependent origination and emptiness of phenomena.",
            quantum: "Definite properties exist only upon measurement, paralleling need for causes in Madhyamaka.",
            explanation: "Like a photograph needing a camera, form requires causes, no form without them.",
            animationType: "wave-function-collapse"
        },
        {
            id: 3,
            verse: "If a cause of form existed apart from form, it would exist as a cause without fruit; causes without fruit do not exist.",
            madhyamaka: "Causes must produce effects; without effects, not causes, showing interdependence and emptiness.",
            quantum: "Force defined by producing acceleration; without motion, no force, mirroring cause-effect need.",
            explanation: "Like a light switch needing to turn on a light, cause needs effect to be meaningful.",
            animationType: "force-effect"
        },
        {
            id: 4,
            verse: "If form existed, a cause of form would be untenable; if form did not exist, a cause of form would be untenable.",
            madhyamaka: "Form's existence or non-existence renders causes unnecessary, showing flawed causality assumptions.",
            quantum: "Definite states emerge upon measurement; before, in superposition, mirroring interdependence.",
            explanation: "Like Schrödinger's cat, form's state depends on cause, showing mutual dependence.",
            animationType: "superposition"
        },
        {
            id: 5,
            verse: "Forms which do not have a cause are not at all tenable. Therefore, do not conceive the concept of form at all.",
            madhyamaka: "Uncaused forms impossible; avoid reifying form, understand as empty, emphasizing non-abiding.",
            quantum: "Particles lack definite properties until measured, don't conceive as inherently existing.",
            explanation: "Like dice's face set upon rolling, particles' properties definite upon measurement, not inherent.",
            animationType: "electron-cloud"
        },
        {
            id: 6,
            verse: "It is untenable to say, 'the fruit is like the cause.' It is also untenable to say, 'the fruit is unlike the cause.'",
            madhyamaka: "Neither similarity nor difference tenable, as both assume inherent existence, showing emptiness.",
            quantum: "Complementarity: particles exhibit wave/particle behaviors, defying 'like' or 'unlike' categorization.",
            explanation: "Like water and ice, not simply like or unlike, quantum particles resist classical categorization.",
            animationType: "double-slit"
        },
        {
            id: 7,
            verse: "Feeling and perception, impulses and mind and all things are comparable in every aspect, at every stage with form.",
            madhyamaka: "All aggregates empty like form, lacking inherent existence, showing uniformity in dependent origination.",
            quantum: "All particles are field excitations, governed by similar quantum principles, paralleling emptiness.",
            explanation: "Like Lego blocks with same rules, all particles follow quantum rules, aggregates are empty.",
            animationType: "field-excitation"
        },
        {
            id: 8,
            verse: "When having argued by means of emptiness, everything of that one who objects is not an objection; it is similar to what is to be established.",
            madhyamaka: "Objections to emptiness support it, relying on concepts it deconstructs, a rhetorical strategy.",
            quantum: "Classical descriptions lead to paradoxes, resolved by quantum principles, mirroring objections.",
            explanation: "Like confusing electric car with gas assumptions, objections show need for emptiness perspective.",
            animationType: "schrodinger-cat"
        },
        {
            id: 9,
            verse: "When having explained by means of emptiness, everything of that one who finds fault is not a fault; it is similar to what is to be established.",
            madhyamaka: "Faults with emptiness reinforce its truth, based on reified concepts it negates, a Madhyamaka insight.",
            quantum: "Criticisms based on classical intuition fail, supporting quantum theory, paralleling faults.",
            explanation: "Like criticizing smartphone for lacking buttons, faults reflect misunderstanding, resolved by emptiness.",
            animationType: "schrodinger-cat-resolved"
        }
    ]
};