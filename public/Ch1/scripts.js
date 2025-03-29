import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { config } from './config.js';
import { gsap } from 'gsap';

class QuantumMadhyamakaApp {
    constructor() {
        this.currentChapter = 0;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.particles = null;
        this.particleSystem = null;
        this.clock = new THREE.Clock();
        this.interactionObjects = [];
        this.interactionContainer = document.getElementById('interaction-container');
        this.composer = null;
        this.bloomPass = null;
        this.isMobile = window.innerWidth < 768;
        this.isControlsPanelVisible = true;

        this.init();
        this.setupEventListeners();
        this.updateChapterContent();
        this.setupInteraction();
        this.setupMobileControls();
        this.animate();
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(config.backgroundColor);
        this.scene.fog = new THREE.FogExp2(config.backgroundColor, 0.02);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = config.cameraDistance;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        document.getElementById('scene-container').appendChild(this.renderer.domElement);

        this.setupPostProcessing();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;

        this.createParticleSystem();

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);

        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        const bloomParams = {
            strength: 0.8,
            radius: 0.5,
            threshold: 0.2
        };
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            bloomParams.strength,
            bloomParams.radius,
            bloomParams.threshold
        );
        this.composer.addPass(this.bloomPass);
    }

    createParticleSystem() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        const sizes = [];
        const opacities = [];

        const color1 = new THREE.Color(config.particleColor1);
        const color2 = new THREE.Color(config.particleColor2);
        const highlightColor = new THREE.Color(config.highlightColor);

        for (let i = 0; i < config.particleDensity; i++) {
            let radius, theta, phi, x, y, z;

            if (Math.random() > 0.3) {
                radius = 5 * Math.pow(Math.random(), 0.33);
                theta = Math.random() * Math.PI * 2;
                phi = Math.acos(2 * Math.random() - 1);

                x = radius * Math.sin(phi) * Math.cos(theta);
                y = radius * Math.sin(phi) * Math.sin(theta);
                z = radius * Math.cos(phi);
            } else {
                const clusterCenters = [
                    { x: 2, y: 1, z: -1, radius: 1.5 },
                    { x: -2, y: -1, z: 2, radius: 1.2 },
                    { x: 0, y: -2, z: -2, radius: 1 }
                ];

                const cluster = clusterCenters[Math.floor(Math.random() * clusterCenters.length)];

                const clusterRadius = cluster.radius * Math.random();
                theta = Math.random() * Math.PI * 2;
                phi = Math.acos(2 * Math.random() - 1);

                x = cluster.x + clusterRadius * Math.sin(phi) * Math.cos(theta);
                y = cluster.y + clusterRadius * Math.sin(phi) * Math.sin(theta);
                z = cluster.z + clusterRadius * Math.cos(phi);
            }

            vertices.push(x, y, z);

            const distFromCenter = Math.sqrt(x * x + y * y + z * z);
            const mixRatio = (Math.sin(x) + Math.cos(y) + Math.sin(z * 0.5) + 3) / 6;

            let particleColor;
            if (distFromCenter > 4.5 && Math.random() > 0.7) {
                particleColor = highlightColor;
            } else {
                particleColor = new THREE.Color().lerpColors(color1, color2, mixRatio);
            }

            colors.push(particleColor.r, particleColor.g, particleColor.b);

            const size = Math.random() * 0.2 + 0.05;
            sizes.push(size);

            const opacity = 0.7 + Math.random() * 0.3;
            opacities.push(opacity);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('opacity', new THREE.Float32BufferAttribute(opacities, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: window.devicePixelRatio }
            },
            vertexShader: `
                attribute float size;
                attribute float opacity;
                uniform float time;
                uniform float pixelRatio;
                varying vec3 vColor;
                varying float vOpacity;

                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec4 permute(vec4 x) { return mod289((x * 34.0 + 1.0) * x); }
                vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

                float snoise(vec3 v) {
                    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
                    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

                    vec3 i = floor(v + dot(v, C.yyy));
                    vec3 x0 = v - i + dot(i, C.xxx);

                    vec3 g = step(x0.yzx, x0.xyz);
                    vec3 l = 1.0 - g;
                    vec3 i1 = min(g.xyz, l.zxy);
                    vec3 i2 = max(g.xyz, l.zxy);

                    vec3 x1 = x0 - i1 + C.xxx;
                    vec3 x2 = x0 - i2 + C.yyy;
                    vec3 x3 = x0 - D.yyy;

                    vec4 p = permute(permute(permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0));

                    vec3 ns = 0.142857142857 * D.wyz - D.xzx;

                    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

                    vec4 x_ = floor(j * ns.z);
                    vec4 y_ = j - 7.0 * x_;

                    vec4 x = x_ * ns.x + ns.yyyy;
                    vec4 y = y_ * ns.x + ns.yyyy;
                    vec4 h = 1.0 - abs(x) - abs(y);

                    vec4 b0 = vec4(x.xy, y.xy);
                    vec4 b1 = vec4(x.zw, y.zw);

                    vec4 s0 = floor(b0) * 2.0 + 1.0;
                    vec4 s1 = floor(b1) * 2.0 + 1.0;
                    vec4 sh = -step(h, vec4(0.0));

                    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
                    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

                    vec3 p0 = vec3(a0.xy, h.x);
                    vec3 p1 = vec3(a0.zw, h.y);
                    vec3 p2 = vec3(a1.xy, h.z);
                    vec3 p3 = vec3(a1.zw, h.w);

                    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
                    p0 *= norm.x;
                    p1 *= norm.y;
                    p2 *= norm.z;
                    p3 *= norm.w;

                    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                    return 42.0 * dot(m*m*m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
                }

                void main() {
                    vColor = color;
                    vOpacity = opacity;

                    vec3 pos = position;
                    float noiseScale = 0.2;
                    float timeScale = 0.2;

                    float noise1 = snoise(vec3(pos.x * noiseScale, pos.y * noiseScale, pos.z * noiseScale + time * timeScale));
                    float noise2 = snoise(vec3(pos.z * noiseScale, pos.x * noiseScale, pos.y * noiseScale + time * timeScale));
                    float noise3 = snoise(vec3(pos.y * noiseScale, pos.z * noiseScale, pos.x * noiseScale + time * timeScale));

                    pos.x += noise1 * 0.3;
                    pos.y += noise2 * 0.3;
                    pos.z += noise3 * 0.3;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

                    gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vOpacity;

                void main() {
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);

                    if (dist > 0.5) discard;

                    float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;
                    vec3 glow = vColor * (1.0 - dist * 1.5);

                    gl_FragColor = vec4(glow, alpha);
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            vertexColors: true
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    setupEventListeners() {
        document.getElementById('prev-btn').addEventListener('click', () => this.navigateChapter(-1));
        document.getElementById('next-btn').addEventListener('click', () => this.navigateChapter(1));
    }

    navigateChapter(direction) {
        this.clearInteraction();

        gsap.to('#info-panel', {
            opacity: 0,
            y: direction > 0 ? -20 : 20,
            duration: 0.5,
            onComplete: () => {
                this.currentChapter = (this.currentChapter + direction + config.chapters.length) % config.chapters.length;

                this.updateChapterContent();

                this.setupInteraction();

                gsap.fromTo('#info-panel',
                    { opacity: 0, y: direction > 0 ? 20 : -20 },
                    { opacity: 1, y: 0, duration: 0.5 }
                );
            }
        });
    }

    updateChapterContent() {
        const chapter = config.chapters[this.currentChapter];

        document.getElementById('concept-title').textContent = chapter.title;
        document.getElementById('madhyamaka-text').textContent = chapter.madhyamakaText;
        document.getElementById('quantum-text').textContent = chapter.quantumText;
        document.getElementById('rationale-text').textContent = chapter.rationale;
        document.getElementById('chapter-indicator').textContent = `Chapter ${this.currentChapter + 1}/${config.chapters.length}`;
    }

    clearInteraction() {
        while (this.interactionContainer.firstChild) {
            this.interactionContainer.removeChild(this.interactionContainer.firstChild);
        }

        this.interactionObjects.forEach(obj => {
            if (obj.parent) obj.parent.remove(obj);
        });

        this.interactionObjects = [];
        this.interactionContainer.style.pointerEvents = 'none';
    }

    setupInteraction() {
        const chapter = config.chapters[this.currentChapter];
        const interactionType = chapter.interactionType;

        // Add interaction prompt text
        const promptText = document.createElement('p');
        promptText.textContent = "Pls click to interact with animation";
        promptText.style.textAlign = 'center';
        promptText.style.marginBottom = '10px';
        promptText.style.fontSize = '0.9rem';
        promptText.style.color = 'rgba(255, 255, 255, 0.7)';
        this.interactionContainer.appendChild(promptText);

        this.interactionContainer.style.pointerEvents = 'auto';

        switch (interactionType) {
            case 'doubleSlit':
                this.setupDoubleSlitInteraction();
                break;
            case 'feynmanDiagram':
                this.setupFeynmanDiagramInteraction();
                break;
            case 'quantumRandom':
                this.setupQuantumRandomInteraction();
                break;
            case 'entanglement':
                this.setupEntanglementInteraction();
                break;
            case 'waveCollapse':
                this.setupWaveCollapseInteraction();
                break;
            case 'quantumVacuum':
                this.setupQuantumVacuumInteraction();
                break;
            case 'quantumField':
                this.setupQuantumFieldInteraction();
                break;
            case 'superposition':
                this.setupSuperpositionInteraction();
                break;
            case 'measurementProblem':
                this.setupMeasurementProblemInteraction();
                break;
            case 'contextuality':
                this.setupContextualityInteraction();
                break;
            case 'boseEinstein':
                this.setupBoseEinsteinInteraction();
                break;
            case 'decoherence':
                this.setupDecoherenceInteraction();
                break;
            case 'quantumGravity':
                this.setupQuantumGravityInteraction();
                break;
            case 'complementarity':
                this.setupComplementarityInteraction();
                break;
            default:
                break;
        }
    }

    setupDoubleSlitInteraction() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 500 300");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.maxHeight = "500px";

        const setup = `
            <defs>
                <radialGradient id="particleGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                    <stop offset="0%" stop-color="#64b5f6" stop-opacity="1"/>
                    <stop offset="100%" stop-color="#64b5f6" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#64b5f6" stop-opacity="0.8"/>
                    <stop offset="100%" stop-color="#64b5f6" stop-opacity="0"/>
                </linearGradient>
            </defs>

            <!-- Source -->
            <rect x="20" y="130" width="40" height="40" rx="5" fill="#64b5f6" class="interactive-element" id="source" />
            <text x="40" y="120" text-anchor="middle" fill="white" font-size="12">Source</text>

            <!-- Slits -->
            <rect x="200" y="50" width="10" height="200" fill="#444" />
            <rect x="200" y="50" width="10" height="70" fill="#222" />
            <rect x="200" y="180" width="10" height="70" fill="#222" />
            <text x="205" y="40" text-anchor="middle" fill="white" font-size="12">Slits</text>

            <!-- Detector screen -->
            <rect x="400" y="50" width="10" height="200" fill="#81c784" class="interactive-element" id="detector" />
            <text x="405" y="40" text-anchor="middle" fill="white" font-size="12">Detector</text>

            <!-- Mode switch -->
            <rect x="20" y="20" width="100" height="30" rx="15" fill="#333" class="interactive-element" id="mode-switch" />
            <text x="40" y="40" text-anchor="middle" fill="white" font-size="12">Particle</text>
            <text x="100" y="40" text-anchor="middle" fill="white" font-size="12">Wave</text>
            <circle id="mode-indicator" cx="40" cy="35" r="10" fill="#ffb74d" />

            <!-- Observer -->
            <g id="observer-group" opacity="0.3">
                <circle cx="250" cy="150" r="15" fill="#ff5252" class="interactive-element" id="observer" />
                <text x="250" y="185" text-anchor="middle" fill="white" font-size="12">Observer</text>
            </g>

            <!-- Particle path and interference pattern (initially hidden) -->
            <g id="particle-view">
                <!-- Particles will be added dynamically -->
            </g>

            <g id="wave-view" display="none">
                <!-- Wave pattern will be added dynamically -->
                <path d="M70 150 Q 135 80, 200 125 Q 265 170, 330 125 Q 395 80, 400 150" stroke="url(#waveGradient)" stroke-width="2" fill="none" />
                <path d="M70 150 Q 135 220, 200 175 Q 265 130, 330 175 Q 395 220, 400 150" stroke="url(#waveGradient)" stroke-width="2" fill="none" />
            </g>

            <g id="interference-pattern" display="none">
                <!-- Interference bands will be added dynamically -->
            </g>
        `;
        svg.innerHTML = setup;
        this.interactionContainer.appendChild(svg);

        const interferencePattern = document.getElementById('interference-pattern');
        for (let i = 0; i < 10; i++) {
            const band = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            const y = 70 + i * 18;
            band.setAttribute("x", "410");
            band.setAttribute("y", y.toString());
            band.setAttribute("width", "40");
            band.setAttribute("height", "10");
            band.setAttribute("fill", "#64b5f6");
            band.setAttribute("opacity", i % 2 === 0 ? "0.8" : "0.2");
            interferencePattern.appendChild(band);
        }

        const source = document.getElementById('source');
        const observer = document.getElementById('observer');
        const observerGroup = document.getElementById('observer-group');
        const modeSwitch = document.getElementById('mode-switch');
        const modeIndicator = document.getElementById('mode-indicator');
        const particleView = document.getElementById('particle-view');
        const waveView = document.getElementById('wave-view');
        const detector = document.getElementById('detector');

        let isWaveMode = false;
        let isObserving = false;

        modeSwitch.addEventListener('click', () => {
            isWaveMode = !isWaveMode;

            gsap.to(modeIndicator, {
                cx: isWaveMode ? 100 : 40,
                duration: 0.3
            });

            if (isWaveMode) {
                particleView.setAttribute("display", "none");
                waveView.setAttribute("display", "block");
                interferencePattern.setAttribute("display", isObserving ? "none" : "block");
            } else {
                particleView.setAttribute("display", "block");
                waveView.setAttribute("display", "none");
                interferencePattern.setAttribute("display", "none");
            }
        });

        observer.addEventListener('click', () => {
            isObserving = !isObserving;

            gsap.to(observerGroup, {
                opacity: isObserving ? 1.0 : 0.3,
                duration: 0.3
            });

            if (isWaveMode && isObserving) {
                interferencePattern.setAttribute("display", "none");
            } else if (isWaveMode && !isObserving) {
                interferencePattern.setAttribute("display", "block");
            }
        });

        source.addEventListener('click', () => {
            if (!isWaveMode) {
                const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                particle.setAttribute("cx", "40");
                particle.setAttribute("cy", "150");
                particle.setAttribute("r", "5");
                particle.setAttribute("fill", "url(#particleGlow)");
                particleView.appendChild(particle);

                const slitIndex = isObserving ? Math.round(Math.random()) : -1;
                const path = isObserving ?
                    [
                        { x: 40, y: 150 },
                        { x: 205, y: slitIndex === 0 ? 100 : 210 },
                        { x: 400, y: 50 + Math.floor(Math.random() * 200) }
                    ] :
                    [
                        { x: 40, y: 150 },
                        { x: 205, y: Math.random() > 0.5 ? 100 : 210 },
                        { x: 400, y: 70 + Math.floor(Math.random() * 9) * 18 + 5 }
                    ];

                gsap.to(particle, {
                    cx: path[1].x,
                    cy: path[1].y,
                    duration: 1,
                    ease: "power1.inOut",
                    onComplete: () => {
                        gsap.to(particle, {
                            cx: path[2].x,
                            cy: path[2].y,
                            duration: 1,
                            ease: "power1.inOut",
                            onComplete: () => {
                                const impact = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                                impact.setAttribute("cx", path[2].x + 5);
                                impact.setAttribute("cy", path[2].y);
                                impact.setAttribute("r", "3");
                                impact.setAttribute("fill", "#81c784");
                                particleView.appendChild(impact);

                                setTimeout(() => {
                                    if (particleView.contains(particle)) {
                                        particleView.removeChild(particle);
                                    }
                                }, 100);

                                gsap.to(impact, {
                                    opacity: 0,
                                    duration: 3,
                                    delay: 1,
                                    onComplete: () => {
                                        if (particleView.contains(impact)) {
                                            particleView.removeChild(impact);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

        this.addTooltip(source, "Click to emit particles");
        this.addTooltip(modeSwitch, "Toggle between particle and wave view");
        this.addTooltip(observer, "Toggle observation at the slits");
        this.addTooltip(detector, "Detector screen shows interference pattern or particle hits");
    }

    setupFeynmanDiagramInteraction() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 500 300");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.maxHeight = "500px";

        const diagram = `
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
                    markerWidth="6" markerHeight="6"
                    orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="white"/>
                </marker>
                <radialGradient id="particleGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                    <stop offset="0%" stop-color="white" stop-opacity="1"/>
                    <stop offset="100%" stop-color="white" stop-opacity="0"/>
                </radialGradient>
            </defs>

            <!-- Background grid -->
            <g id="grid">
                ${Array(10).fill().map((_, i) =>
                    `<line x1="0" y1="${i * 30 + 30}" x2="500" y2="${i * 30 + 30}" 
                     stroke="#333" stroke-width="1" />`
                ).join('')}
                ${Array(16).fill().map((_, i) =>
                    `<line x1="${i * 30 + 30}" y1="0" x2="${i * 30 + 30}" y2="300" 
                     stroke="#333" stroke-width="1" />`
                ).join('')}
            </g>

            <!-- Time axis -->
            <line x1="50" y1="250" x2="450" y2="250" stroke="white" stroke-width="2"/>
            <text x="250" y="280" text-anchor="middle" fill="white" font-size="14">Time →</text>

            <!-- Base diagram - always visible -->
            <g id="base-diagram">
                <!-- Initial particles -->
                <circle cx="100" cy="100" r="10" fill="#64b5f6" />
                <circle cx="100" cy="200" r="10" fill="#81c784" />

                <!-- Final particles -->
                <circle cx="400" cy="100" r="10" fill="#81c784" />
                <circle cx="400" cy="200" r="10" fill="#64b5f6" />

                <!-- Particle labels -->
                <text x="80" y="100" text-anchor="end" fill="white" font-size="12">Electron</text>
                <text x="80" y="200" text-anchor="end" fill="white" font-size="12">Positron</text>
                <text x="420" y="100" text-anchor="start" fill="white" font-size="12">Positron</text>
                <text x="420" y="200" text-anchor="start" fill="white" font-size="12">Electron</text>

                <!-- Path selector control -->
                <g id="path-selector">
                    <rect x="50" y="20" width="150" height="30" rx="15" fill="#333" class="interactive-element" />
                    <text x="125" y="40" text-anchor="middle" fill="white" font-size="12">Select Path</text>
                </g>

                <!-- Madhyamaka conditions -->
                <g id="conditions-toggle">
                    <rect x="300" y="20" width="150" height="30" rx="15" fill="#333" class="interactive-element" />
                    <text x="375" y="40" text-anchor="middle" fill="white" font-size="12">Show Conditions</text>
                </g>
            </g>

            <!-- Path 1 - Direct exchange -->
            <g id="path1" class="interactive-element" opacity="0.3">
                <line x1="100" y1="100" x2="400" y2="200" stroke="#64b5f6" stroke-width="3" marker-end="url(#arrow)" />
                <line x1="100" y1="200" x2="400" y2="100" stroke="#81c784" stroke-width="3" marker-end="url(#arrow)" />
                <circle cx="250" cy="150" r="10" fill="#ffb74d" />
                <text x="250" y="130" text-anchor="middle" fill="#ffb74d" font-size="12">Interaction</text>
            </g>

            <!-- Path 2 - Through virtual pair -->
            <g id="path2" class="interactive-element" opacity="0.3" display="none">
                <line x1="100" y1="100" x2="250" y2="100" stroke="#64b5f6" stroke-width="3" marker-end="url(#arrow)" />
                <line x1="100" y1="200" x2="250" y2="200" stroke="#81c784" stroke-width="3" marker-end="url(#arrow)" />
                <line x1="250" y1="100" x2="250" y2="200" stroke="#ffb74d" stroke-width="3" marker-end="url(#arrow)" />
                <line x1="250" y1="100" x2="400" y2="100" stroke="#81c784" stroke-width="3" marker-end="url(#arrow)" />
                <line x1="250" y1="200" x2="400" y2="200" stroke="#64b5f6" stroke-width="3" marker-end="url(#arrow)" />
                <text x="250" y="160" text-anchor="middle" fill="#ffb74d" font-size="12">Photon</text>
            </g>

            <!-- Path 3 - Complex interaction -->
            <g id="path3" class="interactive-element" opacity="0.3" display="none">
                <line x1="100" y1="100" x2="150" y2="120" stroke="#64b5f6" stroke-width="3" marker-end="url(#arrow)" />
                <line x1="100" y1="200" x2="175" y2="175" stroke="#81c784" stroke-width="3" marker-end="url(#arrow)" />
                <line x1="150" y1="120" x2="175" y2="175" stroke="#ffb74d" stroke-width="3" marker-end="url(#arrow)" />
                <line x1="175" y1="175" x2="225" y2="120" stroke="#ffb74d" stroke-width="3" marker-end="url(#arrow)" />
                <line x1="225" y1="120" x2="300" y2="150" stroke="#64b5f6" stroke-width="3" marker-end="url(#arrow)" />
                <line x1="300" y1="150" x2="350" y2="130" stroke="#ffb74d" stroke-width="3" marker-end="url(#arrow)" />
                <line x1="350" y1="130" x2="400" y2="200" stroke="#64b5f6" stroke-width="3" marker-end="url(#arrow)" />
                <line x1="225" y1="120" x2="325" y2="80" stroke="#81c784" stroke-width="3" marker-end="url(#arrow)" />
                <line x1="325" y1="80" x2="400" y2="100" stroke="#81c784" stroke-width="3" marker-end="url(#arrow)" />
            </g>

            <!-- Madhyamaka conditions panel (initially hidden) -->
            <g id="conditions-panel" display="none">
                <rect x="50" y="50" width="400" height="180" rx="10" fill="rgba(0,0,0,0.7)" stroke="#ffb74d" stroke-width="2" />
                <text x="250" y="80" text-anchor="middle" fill="white" font-size="16">Four Types of Conditions</text>

                <text x="80" y="110" fill="#64b5f6" font-size="14">1. Causal Condition</text>
                <text x="100" y="130" fill="white" font-size="12">The immediate cause for the effect</text>

                <text x="80" y="160" fill="#81c784" font-size="14">2. Objective Support Condition</text>
                <text x="100" y="180" fill="white" font-size="12">The object that supports the arising</text>

                <text x="80" y="210" fill="#ffb74d" font-size="14">3. Predominant Condition</text>
                <text x="100" y="230" fill="white" font-size="12">The main influence on the result</text>

                <rect x="410" y="60" width="30" height="30" rx="15" fill="#333" stroke="white" class="interactive-element" id="close-conditions" />
                <text x="425" y="80" text-anchor="middle" fill="white" font-size="16">×</text>
            </g>
        `;
        svg.innerHTML = diagram;
        this.interactionContainer.appendChild(svg);

        const pathSelector = document.getElementById('path-selector');
        const conditionsToggle = document.getElementById('conditions-toggle');
        const closeConditions = document.getElementById('close-conditions');
        const conditionsPanel = document.getElementById('conditions-panel');
        const path1 = document.getElementById('path1');
        const path2 = document.getElementById('path2');
        const path3 = document.getElementById('path3');

        let currentPath = 1;

        pathSelector.addEventListener('click', () => {
            document.getElementById(`path${currentPath}`).setAttribute('display', 'none');
            currentPath = currentPath % 3 + 1;
            const newPath = document.getElementById(`path${currentPath}`);
            newPath.setAttribute('display', 'block');

            gsap.fromTo(newPath,
                { opacity: 0 },
                { opacity: 1, duration: 0.5 }
            );
        });

        conditionsToggle.addEventListener('click', () => {
            conditionsPanel.setAttribute('display', 'block');
            gsap.fromTo(conditionsPanel,
                { opacity: 0 },
                { opacity: 1, duration: 0.5 }
            );
        });

        closeConditions.addEventListener('click', () => {
            gsap.to(conditionsPanel, { opacity: 0, duration: 0.5, onComplete: () => {
                conditionsPanel.setAttribute('display', 'none');
            }});
        });

        [path1, path2, path3].forEach(path => {
            path.addEventListener('mouseenter', () => {
                gsap.to(path, { opacity: 1, duration: 0.3 });
            });

            path.addEventListener('mouseleave', () => {
                gsap.to(path, { opacity: 0.7, duration: 0.3 });
            });

            path.addEventListener('click', (e) => {
                const pulse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                const rect = svg.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width * 500;
                const y = (e.clientY - rect.top) / rect.height * 300;

                pulse.setAttribute("cx", x);
                pulse.setAttribute("cy", y);
                pulse.setAttribute("r", "5");
                pulse.setAttribute("fill", "url(#particleGlow)");
                svg.appendChild(pulse);

                gsap.to(pulse, {
                    r: 30,
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        if (svg.contains(pulse)) {
                            svg.removeChild(pulse);
                        }
                    }
                });
            });
        });

        gsap.to(path1, { opacity: 1, duration: 0.5 });

        this.addTooltip(pathSelector, "Click to cycle through different interaction paths");
        this.addTooltip(conditionsToggle, "Show the four types of Madhyamaka conditions");
        this.addTooltip(path1, "Direct exchange interaction path");
        this.addTooltip(path2, "Interaction through virtual photon exchange");
        this.addTooltip(path3, "Complex multi-particle interaction path");
    }

    setupQuantumRandomInteraction() {
        const container = document.createElement('div');
        container.className = 'quantum-random-container';
        container.innerHTML = `
            <div class="qr-header">
                <h3>Quantum Random Generator</h3>
                <p>Demonstrating inherent unpredictability in quantum systems</p>
            </div>

            <div class="qr-visualization">
                <svg viewBox="0 0 500 300" width="100%" height="100%">
                    <defs>
                        <radialGradient id="particleGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                            <stop offset="0%" stop-color="#64b5f6" stop-opacity="1"/>
                            <stop offset="100%" stop-color="#64b5f6" stop-opacity="0"/>
                        </radialGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="blur"/>
                            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                        </filter>
                    </defs>

                    <!-- Quantum device -->
                    <rect x="200" y="100" width="100" height="100" rx="10" fill="#333" stroke="#64b5f6" stroke-width="2" />
                    <text x="250" y="150" text-anchor="middle" fill="white" font-size="14">Quantum</text>
                    <text x="250" y="170" text-anchor="middle" fill="white" font-size="14">Device</text>

                    <!-- Input beam -->
                    <line x1="100" y1="150" x2="200" y2="150" stroke="#64b5f6" stroke-width="2" stroke-dasharray="5,5" />
                    <circle cx="100" cy="150" r="10" fill="#64b5f6" class="interactive-element" id="input-source" />
                    <text x="100" y="180" text-anchor="middle" fill="white" font-size="12">Source</text>

                    <!-- Output paths -->
                    <line x1="300" y1="150" x2="350" y2="100" stroke="#64b5f6" stroke-width="2" stroke-dasharray="5,5" />
                    <line x1="300" y1="150" x2="350" y2="200" stroke="#64b5f6" stroke-width="2" stroke-dasharray="5,5" />
                    <circle cx="350" cy="100" r="10" fill="#81c784" />
                    <circle cx="350" cy="200" r="10" fill="#81c784" />
                    <text x="380" y="100" text-anchor="start" fill="white" font-size="12">State |0⟩</text>
                    <text x="380" y="200" text-anchor="start" fill="white" font-size="12">State |1⟩</text>

                    <!-- Detection counter -->
                    <rect x="400" y="130" width="80" height="40" rx="5" fill="#333" stroke="#81c784" stroke-width="2" />
                    <text x="440" y="155" text-anchor="middle" fill="white" font-size="14" id="outcome-text">?</text>

                    <!-- Particles group -->
                    <g id="particles"></g>
                </svg>
            </div>

            <div class="qr-controls">
                <button id="generate-btn" class="qr-button">Generate Quantum Random Bit</button>
                <div class="qr-stats">
                    <div class="stat">
                        <span>State |0⟩:</span>
                        <span id="state0-count">0</span>
                    </div>
                    <div class="stat">
                        <span>State |1⟩:</span>
                        <span id="state1-count">0</span>
                    </div>
                </div>
            </div>

            <div class="qr-explanation">
                <p>In quantum systems, identical conditions can produce different outcomes, 
                   demonstrating the absence of inherent production—parallel to the Madhyamaka 
                   view that conditions lack inherent power to produce fixed effects.</p>
            </div>
        `;
        this.interactionContainer.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            .quantum-random-container {
                display: flex;
                flex-direction: column;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 10px;
                padding: 20px;
                width: 100%;
                height: 100%;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .qr-header {
                text-align: center;
                margin-bottom: 20px;
            }

            .qr-header h3 {
                color: #64b5f6;
                margin-bottom: 5px;
            }

            .qr-visualization {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
            }

            .qr-controls {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
                margin-bottom: 20px;
            }

            .qr-button {
                background: #64b5f6;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .qr-button:hover {
                background: #90caf9;
                transform: translateY(-2px);
            }

            .qr-stats {
                display: flex;
                gap: 30px;
            }

            .stat {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            #state0-count, #state1-count {
                background: #333;
                padding: 5px 10px;
                border-radius: 4px;
                min-width: 30px;
                text-align: center;
            }

            .qr-explanation {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: 8px;
                font-size: 0.9rem;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);

        const generateBtn = document.getElementById('generate-btn');
        const state0Count = document.getElementById('state0-count');
        const state1Count = document.getElementById('state1-count');
        const outcomeText = document.getElementById('outcome-text');
        const inputSource = document.getElementById('input-source');
        const particlesGroup = document.getElementById('particles');

        let counts = {
            0: 0,
            1: 0
        };

        generateBtn.addEventListener('click', generateRandomBit);
        inputSource.addEventListener('click', generateRandomBit);

        function generateRandomBit() {
            const outcome = Math.random() > 0.5 ? 1 : 0;

            counts[outcome]++;
            state0Count.textContent = counts[0];
            state1Count.textContent = counts[1];

            const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            particle.setAttribute("cx", "100");
            particle.setAttribute("cy", "150");
            particle.setAttribute("r", "5");
            particle.setAttribute("fill", "url(#particleGlow)");
            particle.setAttribute("filter", "url(#glow)");
            particlesGroup.appendChild(particle);

            const path = [
                { x: 100, y: 150 },
                { x: 250, y: outcome === 0 ? 100 : 200 },
                { x: 400, y: outcome === 0 ? 100 : 200 }
            ];

            gsap.timeline()
                .to(particle, {
                    cx: path[1].x,
                    cy: path[1].y,
                    duration: 1,
                    ease: "power1.inOut"
                })
                .to(particle, {
                    cx: path[2].x,
                    cy: path[2].y,
                    duration: 1,
                    ease: "power1.inOut",
                    onComplete: () => {
                        outcomeText.textContent = outcome;

                        gsap.fromTo(outcomeText,
                            { fill: "#ffb74d", scale: 1.5 },
                            { fill: "white", scale: 1, duration: 0.5 }
                        );

                        setTimeout(() => {
                            if (particlesGroup.contains(particle)) {
                                particlesGroup.removeChild(particle);
                            }
                        }, 100);

                        gsap.to(particle, {
                            opacity: 0,
                            duration: 3,
                            delay: 1,
                            onComplete: () => {
                                if (particlesGroup.contains(particle)) {
                                    particlesGroup.removeChild(particle);
                                }
                            }
                        });
                    }
                });
        }

        this.addTooltip(inputSource, "Click to send a particle through the quantum device");
        this.addTooltip(generateBtn, "Generate a random quantum bit using quantum uncertainty");
    }

    setupEntanglementInteraction() {
        const container = document.createElement('div');
        container.className = 'entanglement-container';
        container.innerHTML = `
            <div class="entanglement-header">
                <h3>Quantum Entanglement</h3>
                <p>Exploring non-local correlations without direct causation</p>
            </div>

            <div class="entanglement-visualization">
                <svg viewBox="0 0 600 300" width="100%" height="100%">
                    <defs>
                        <radialGradient id="particleGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                            <stop offset="0%" stop-color="#64b5f6" stop-opacity="1"/>
                            <stop offset="100%" stop-color="#64b5f6" stop-opacity="0"/>
                        </radialGradient>
                        <linearGradient id="entanglementLine" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#64b5f6"/>
                            <stop offset="50%" stop-color="#ffb74d"/>
                            <stop offset="100%" stop-color="#81c784"/>
                        </linearGradient>
                    </defs>

                    <!-- Source -->
                    <circle cx="300" cy="150" r="20" fill="#ffb74d" class="interactive-element" id="source"/>
                    <text x="300" y="190" text-anchor="middle" fill="white" font-size="14">Entangled Source</text>

                    <!-- Entanglement line -->
                    <line x1="120" y1="150" x2="480" y2="150" stroke="url(#entanglementLine)" stroke-width="3" stroke-dasharray="5,5" id="entanglement-line"/>

                    <!-- Detectors -->
                    <g id="detector-left" transform="translate(100, 150)">
                        <rect x="-25" y="-25" width="50" height="50" rx="5" fill="#333" class="interactive-element"/>
                        <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="20" id="left-state">?</text>
                        <text x="0" y="-40" text-anchor="middle" fill="white" font-size="14">Detector A</text>
                    </g>

                    <g id="detector-right" transform="translate(500, 150)">
                        <rect x="-25" y="-25" width="50" height="50" rx="5" fill="#333" class="interactive-element"/>
                        <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="20" id="right-state">?</text>
                        <text x="0" y="-40" text-anchor="middle" fill="white" font-size="14">Detector B</text>
                    </g>

                    <!-- Distance indicator -->
                    <line x1="200" y1="220" x2="400" y2="220" stroke="white" stroke-width="1" stroke-dasharray="5,5"/>
                    <line x1="200" y1="215" x2="200" y2="225" stroke="white" stroke-width="1"/>
                    <line x1="400" y1="215" x2="400" y2="225" stroke="white" stroke-width="1"/>
                    <text x="300" y="240" text-anchor="middle" fill="white" font-size="12">Arbitrary Distance</text>

                    <!-- Particles group -->
                    <g id="particles"></g>
                </svg>
            </div>

            <div class="entanglement-controls">
                <button id="create-entanglement" class="entanglement-button">Create Entangled Pair</button>
                <button id="measure-left" class="entanglement-button" disabled>Measure Particle A</button>
                <button id="measure-right" class="entanglement-button" disabled>Measure Particle B</button>
                <button id="reset-experiment" class="entanglement-button reset" disabled>Reset Experiment</button>
            </div>

            <div class="entanglement-explanation">
                <p id="explanation-text">
                    In quantum entanglement, measuring one particle instantaneously determines 
                    the state of its entangled partner, regardless of distance. This demonstrates 
                    correlation without direct causation, similar to Madhyamaka's rejection of 
                    substantial cause-effect links.
                </p>
            </div>
        `;
        this.interactionContainer.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            .entanglement-container {
                display: flex;
                flex-direction: column;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 10px;
                padding: 20px;
                width: 100%;
                height: 100%;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .entanglement-header {
                text-align: center;
                margin-bottom: 20px;
            }

            .entanglement-header h3 {
                color: #ffb74d;
                margin-bottom: 5px;
            }

            .entanglement-visualization {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
            }

            .entanglement-controls {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 10px;
                margin-bottom: 20px;
            }

            .entanglement-button {
                background: #64b5f6;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .entanglement-button:hover:not(:disabled) {
                background: #90caf9;
                transform: translateY(-2px);
            }

            .entanglement-button:disabled {
                background: #555;
                cursor: not-allowed;
                opacity: 0.7;
            }

            .entanglement-button.reset {
                background: #e57373;
            }

            .entanglement-button.reset:hover:not(:disabled) {
                background: #ef9a9a;
            }

            .entanglement-explanation {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: 8px;
                font-size: 0.9rem;
                line-height: 1.5;
            }

            @media (max-width: 768px) {
                .entanglement-controls {
                    flex-direction: column;
                    align-items: center;
                }
            }
        `;
        document.head.appendChild(style);

        const sourceBtn = document.getElementById('source');
        const createEntanglementBtn = document.getElementById('create-entanglement');
        const measureLeftBtn = document.getElementById('measure-left');
        const measureRightBtn = document.getElementById('measure-right');
        const resetBtn = document.getElementById('reset-experiment');
        const leftState = document.getElementById('left-state');
        const rightState = document.getElementById('right-state');
        const explanationText = document.getElementById('explanation-text');
        const particlesGroup = document.getElementById('particles');
        const entanglementLine = document.getElementById('entanglement-line');

        let experimentState = {
            entangled: false,
            leftMeasured: false,
            rightMeasured: false,
            outcome: null
        };

        createEntanglementBtn.addEventListener('click', createEntangledPair);
        measureLeftBtn.addEventListener('click', () => measureParticle('left'));
        measureRightBtn.addEventListener('click', () => measureParticle('right'));
        resetBtn.addEventListener('click', resetExperiment);

        function createEntangledPair() {
            leftState.textContent = "?";
            rightState.textContent = "?";

            const particlePair = document.createElementNS("http://www.w3.org/2000/svg", "g");

            const x = 300;
            const y = 150;

            const particle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            particle1.setAttribute("cx", x);
            particle1.setAttribute("cy", y);
            particle1.setAttribute("r", "10");
            particle1.setAttribute("fill", "#64b5f6");

            const particle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            particle2.setAttribute("cx", x);
            particle2.setAttribute("cy", y);
            particle2.setAttribute("r", "10");
            particle2.setAttribute("fill", "#81c784");

            particlePair.appendChild(particle1);
            particlePair.appendChild(particle2);

            particlesGroup.appendChild(particlePair);

            gsap.to(particle1, {
                cx: 100,
                duration: 1.5,
                ease: "power1.inOut"
            });

            gsap.to(particle2, {
                cx: 500,
                duration: 1.5,
                ease: "power1.inOut",
                onComplete: () => {
                    experimentState.entangled = true;
                    measureLeftBtn.disabled = false;
                    measureRightBtn.disabled = false;
                    createEntanglementBtn.disabled = true;
                    resetBtn.disabled = false;

                    gsap.fromTo(entanglementLine,
                        { strokeDasharray: "0,10" },
                        { strokeDasharray: "5,5", duration: 1 }
                    );
                }
            });
        }

        function measureParticle(side) {
            if (!experimentState.entangled) return;

            const isLeft = side === 'left';
            const stateElement = isLeft ? leftState : rightState;
            const otherStateElement = isLeft ? rightState : leftState;

            if (experimentState.outcome === null) {
                experimentState.outcome = Math.random() > 0.5 ? 1 : 0;
            }

            stateElement.textContent = experimentState.outcome;

            gsap.fromTo(stateElement,
                { fill: "#ffb74d", scale: 1.5 },
                { fill: "white", scale: 1, duration: 0.5 }
            );

            if (isLeft) {
                experimentState.leftMeasured = true;
                measureLeftBtn.disabled = true;
            } else {
                experimentState.rightMeasured = true;
                measureRightBtn.disabled = true;
            }

            if ((isLeft && !experimentState.rightMeasured) || (!isLeft && !experimentState.leftMeasured)) {
                explanationText.textContent = `Particle ${isLeft ? 'A' : 'B'} has been measured as ${experimentState.outcome}. The state of particle ${isLeft ? 'B' : 'A'} is now determined, even though no direct interaction has occurred.`;
            }

            if (experimentState.leftMeasured && experimentState.rightMeasured) {
                explanationText.textContent = `Both particles have been measured with correlated outcomes (${experimentState.outcome}), demonstrating quantum entanglement's non-local correlation without direct causation.`;
            }
        }

        function resetExperiment() {
            particlesGroup.innerHTML = '';

            leftState.textContent = "?";
            rightState.textContent = "?";

            experimentState = {
                entangled: false,
                leftMeasured: false,
                rightMeasured: false,
                outcome: null
            };

            createEntanglementBtn.disabled = false;
            measureLeftBtn.disabled = true;
            measureRightBtn.disabled = true;
            resetBtn.disabled = true;

            gsap.to(entanglementLine, {
                strokeDasharray: "0,10",
                duration: 0.5
            });

            explanationText.textContent = "In quantum entanglement, measuring one particle instantaneously determines the state of its entangled partner, regardless of distance. This demonstrates correlation without direct causation, similar to Madhyamaka's rejection of substantial cause-effect links.";
        }

        this.addTooltip(sourceBtn, "Create an entangled pair of particles");
        this.addTooltip(document.querySelector('#detector-left rect'), "Measure the state of particle A");
        this.addTooltip(document.querySelector('#detector-right rect'), "Measure the state of particle B");
    }

    setupWaveCollapseInteraction() {
        const container = document.createElement('div');
        container.className = 'wave-collapse-container';
        container.innerHTML = `
            <div class="wave-collapse-header">
                <h3>Wave Function Collapse</h3>
                <p>Exploring the temporal relationships in quantum measurement</p>
            </div>

            <div class="wave-collapse-visualization">
                <svg viewBox="0 0 500 300" width="100%" height="100%">
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#64b5f6" stop-opacity="0.8"/>
                            <stop offset="100%" stop-color="#64b5f6" stop-opacity="0"/>
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="blur"/>
                            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                        </filter>
                    </defs>

                    <!-- Timeline -->
                    <line x1="50" y1="250" x2="450" y2="250" stroke="white" stroke-width="2"/>
                    <text x="250" y="280" text-anchor="middle" fill="white" font-size="14">Time →</text>

                    <!-- Timeline markers -->
                    <line x1="100" y1="245" x2="100" y2="255" stroke="white" stroke-width="2"/>
                    <text x="100" y="270" text-anchor="middle" fill="white" font-size="12">t₁</text>

                    <line x1="250" y1="245" x2="250" y2="255" stroke="white" stroke-width="2"/>
                    <text x="250" y="270" text-anchor="middle" fill="white" font-size="12">t₂</text>

                    <line x1="400" y1="245" x2="400" y2="255" stroke="white" stroke-width="2"/>
                    <text x="400" y="270" text-anchor="middle" fill="white" font-size="12">t₃</text>

                    <!-- Wave function container -->
                    <g id="wave-container">
                        <!-- Initial state - superposition wave -->
                        <g id="superposition-state">
                            <text x="100" y="40" text-anchor="middle" fill="white" font-size="14">Superposition</text>

                            <!-- Probability waves -->
                            <path id="wave1" d="M 60 100 Q 100 60, 140 100" stroke="#64b5f6" stroke-width="2" fill="none" filter="url(#glow)"/>
                            <path id="wave2" d="M 60 100 Q 100 140, 140 100" stroke="#81c784" stroke-width="2" fill="none" filter="url(#glow)"/>

                            <!-- Particles -->
                            <circle cx="100" cy="80" r="5" fill="#64b5f6"/>
                            <circle cx="100" cy="120" r="5" fill="#81c784"/>

                            <!-- State label -->
                            <text x="100" y="170" text-anchor="middle" fill="white" font-size="16">|ψ⟩ = α|0⟩ + β|1⟩</text>
                        </g>

                        <!-- Measurement event -->
                        <g id="measurement-event">
                            <circle cx="250" cy="100" r="20" fill="#ffb74d" class="interactive-element" id="measure-button"/>
                            <text x="250" y="40" text-anchor="middle" fill="white" font-size="14">Measurement</text>
                            <text x="250" y="105" text-anchor="middle" fill="white" font-size="14">👁️</text>
                        </g>

                        <!-- Post-measurement state -->
                        <g id="collapsed-state" opacity="0.3">
                            <text x="400" y="40" text-anchor="middle" fill="white" font-size="14">Definite State</text>

                            <!-- Definite state wave (will be updated based on measurement) -->
                            <path id="definite-wave" d="M 360 100 Q 400 60, 440 100" stroke="#64b5f6" stroke-width="2" fill="none" filter="url(#glow)"/>

                            <!-- Definite particle (will be updated based on measurement) -->
                            <circle id="definite-particle" cx="400" cy="80" r="5" fill="#64b5f6"/>

                            <!-- State label (will be updated based on measurement) -->
                            <text id="definite-state-label" x="400" y="170" text-anchor="middle" fill="white" font-size="16">|ψ⟩ = |0⟩</text>
                        </g>
                    </g>

                    <!-- Flash effect for measurement -->
                    <circle id="measurement-flash" cx="250" cy="100" r="0" fill="white" opacity="0"/>
                </svg>
            </div>

            <div class="wave-collapse-controls">
                <button id="reset-wave" class="wave-collapse-button">Reset Quantum State</button>
            </div>

            <div class="wave-collapse-explanation">
                <p id="collapse-explanation">
                    The wave function represents a quantum system in multiple possible states simultaneously. 
                    Upon measurement, this superposition 'collapses' instantaneously to a single definite state.
                    This challenges linear causality, similar to Madhyamaka's questioning of temporal conditions.
                </p>
            </div>
        `;
        this.interactionContainer.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            .wave-collapse-container {
                display: flex;
                flex-direction: column;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 10px;
                padding: 20px;
                width: 100%;
                height: 100%;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .wave-collapse-header {
                text-align: center;
                margin-bottom: 20px;
            }

            .wave-collapse-header h3 {
                color: #64b5f6;
                margin-bottom: 5px;
            }

            .wave-collapse-visualization {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
            }

            .wave-collapse-controls {
                display: flex;
                justify-content: center;
                margin-bottom: 20px;
            }

            .wave-collapse-button {
                background: #64b5f6;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .wave-collapse-button:hover {
                background: #90caf9;
                transform: translateY(-2px);
            }

            .wave-collapse-explanation {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: 8px;
                font-size: 0.9rem;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);

        const measureButton = document.getElementById('measure-button');
        const resetButton = document.getElementById('reset-wave');
        const collapsedState = document.getElementById('collapsed-state');
        const definiteWave = document.getElementById('definite-wave');
        const definiteParticle = document.getElementById('definite-particle');
        const definiteStateLabel = document.getElementById('definite-state-label');
        const measurementFlash = document.getElementById('measurement-flash');
        const explanation = document.getElementById('collapse-explanation');

        let hasMeasured = false;

        measureButton.addEventListener('click', () => {
            if (hasMeasured) return;

            const pulse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            pulse.setAttribute("cx", "250");
            pulse.setAttribute("cy", "100");
            pulse.setAttribute("r", "5");
            pulse.setAttribute("fill", "white");
            pulse.setAttribute("opacity", "0.8");
            container.querySelector('.wave-collapse-visualization svg').appendChild(pulse);

            gsap.timeline()
                .to(pulse, {
                    r: 50,
                    opacity: 0.8,
                    duration: 0.3,
                    ease: "power2.out"
                })
                .to(pulse, {
                    opacity: 0,
                    duration: 0.3
                });

            const outcome = Math.random() > 0.5 ? 1 : 0;

            if (outcome === 0) {
                definiteWave.setAttribute("d", "M 360 100 Q 400 60, 440 100");
                definiteWave.setAttribute("stroke", "#64b5f6");
                definiteParticle.setAttribute("cx", "400");
                definiteParticle.setAttribute("cy", "80");
                definiteParticle.setAttribute("fill", "#64b5f6");
                definiteStateLabel.textContent = "|ψ⟩ = |0⟩";
            } else {
                definiteWave.setAttribute("d", "M 360 100 Q 400 140, 440 100");
                definiteWave.setAttribute("stroke", "#81c784");
                definiteParticle.setAttribute("cx", "400");
                definiteParticle.setAttribute("cy", "120");
                definiteParticle.setAttribute("fill", "#81c784");
                definiteStateLabel.textContent = "|ψ⟩ = |1⟩";
            }

            gsap.to(collapsedState, {
                opacity: 1,
                duration: 0.5
            });

            explanation.textContent = `Measurement has collapsed the wave function to state |${outcome}⟩. This parallels Madhyamaka's view that definite properties are not inherent but arise through interdependent conditions - in this case, the act of measurement.`;

            hasMeasured = true;
        });

        resetButton.addEventListener('click', () => {
            gsap.to(collapsedState, {
                opacity: 0.3,
                duration: 0.5
            });

            explanation.textContent = "The wave function represents a quantum system in multiple possible states simultaneously. Upon measurement, this superposition 'collapses' instantaneously to a single definite state. This challenges linear causality, similar to Madhyamaka's questioning of temporal conditions.";
        });

        this.addTooltip(measureButton, "Click to perform a measurement and collapse the wave function");
    }

    setupQuantumVacuumInteraction() {
        const container = document.createElement('div');
        container.className = 'quantum-vacuum-container';
        container.innerHTML = `
            <div class="qv-header">
                <h3>Quantum Vacuum Fluctuations</h3>
                <p>Exploring the dynamic "emptiness" of space</p>
            </div>

            <div class="qv-visualization">
                <svg viewBox="0 0 500 300" width="100%" height="100%">
                    <defs>
                        <radialGradient id="vacuumGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                            <stop offset="0%" stop-color="#64b5f6" stop-opacity="0.2"/>
                            <stop offset="100%" stop-color="#64b5f6" stop-opacity="0"/>
                        </radialGradient>
                        <filter id="particleBlur">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur"/>
                            <feComposite in="blur" in2="SourceGraphic" operator="over"/>
                        </filter>
                    </defs>

                    <!-- Vacuum background -->
                    <rect x="50" y="50" width="400" height="200" rx="5" fill="#111" stroke="#333" stroke-width="2"/>

                    <!-- Zoom controls -->
                    <g id="zoom-controls">
                        <rect x="380" y="60" width="60" height="30" rx="5" fill="#333" class="interactive-element" id="zoom-in"/>
                        <text x="410" y="80" text-anchor="middle" fill="white" font-size="14">Zoom +</text>

                        <rect x="380" y="100" width="60" height="30" rx="5" fill="#333" class="interactive-element" id="zoom-out"/>
                        <text x="410" y="120" text-anchor="middle" fill="white" font-size="14">Zoom -</text>
                    </g>

                    <!-- Energy level indicator -->
                    <g id="energy-controls">
                        <rect x="60" y="60" width="30" height="180" rx="5" fill="#222" stroke="#333"/>
                        <rect id="energy-level" x="65" y="140" width="20" height="95" rx="3" fill="#ffb74d"/>
                        <text x="75" y="50" text-anchor="middle" fill="white" font-size="12">Energy</text>

                        <rect x="100" y="60" width="30" height="30" rx="5" fill="#333" class="interactive-element" id="energy-up"/>
                        <text x="115" y="80" text-anchor="middle" fill="white" font-size="14">▲</text>

                        <rect x="100" y="210" width="30" height="30" rx="5" fill="#333" class="interactive-element" id="energy-down"/>
                        <text x="115" y="230" text-anchor="middle" fill="white" font-size="14">▼</text>
                    </g>

                    <!-- Vacuum region -->
                    <g id="vacuum-region"></g>

                    <!-- Zoom indicator -->
                    <g id="zoom-indicator">
                        <rect id="zoom-box" x="200" y="125" width="100" height="50" rx="5" fill="none" stroke="#ffb74d" stroke-width="2" stroke-dasharray="5,5"/>
                    </g>

                    <!-- Scale indicator -->
                    <g id="scale-indicator">
                        <text id="scale-text" x="250" y="220" text-anchor="middle" fill="white" font-size="12">Scale: 10⁻¹⁵ m</text>
                    </g>
                </svg>
            </div>

            <div class="qv-controls">
                <button id="toggle-particles" class="qv-button">Toggle Particle Visibility</button>
            </div>

            <div class="qv-explanation">
                <p id="vacuum-explanation">
                    The quantum vacuum is not truly empty—it's filled with virtual particles 
                    that continuously appear and disappear. This parallels the Madhyamaka concept 
                    of emptiness (śūnyatā), which is not nothingness but a dynamic interdependence 
                    lacking inherent existence.
                </p>
            </div>
        `;
        this.interactionContainer.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            .quantum-vacuum-container {
                display: flex;
                flex-direction: column;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 10px;
                padding: 20px;
                width: 100%;
                height: 100%;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .qv-header {
                text-align: center;
                margin-bottom: 20px;
            }

            .qv-header h3 {
                color: #64b5f6;
                margin-bottom: 5px;
            }

            .qv-visualization {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
            }

            .qv-controls {
                display: flex;
                justify-content: center;
                margin-bottom: 20px;
            }

            .qv-button {
                background: #64b5f6;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .qv-button:hover {
                background: #90caf9;
                transform: translateY(-2px);
            }

            .qv-explanation {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: 8px;
                font-size: 0.9rem;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);

        const vacuumRegion = document.getElementById('vacuum-region');
        const zoomInBtn = document.getElementById('zoom-in');
        const zoomOutBtn = document.getElementById('zoom-out');
        const energyUpBtn = document.getElementById('energy-up');
        const energyDownBtn = document.getElementById('energy-down');
        const toggleParticlesBtn = document.getElementById('toggle-particles');
        const energyLevel = document.getElementById('energy-level');
        const scaleText = document.getElementById('scale-text');
        const zoomBox = document.getElementById('zoom-box');
        const vacuumExplanation = document.getElementById('vacuum-explanation');

        let zoomLevel = 1;
        let energyValue = 50;
        let particlesVisible = true;
        let particles = [];
        let animationFrameId;

        function createParticles() {
            while (vacuumRegion.firstChild) {
                vacuumRegion.removeChild(vacuumRegion.firstChild);
            }
            particles = [];

            const numParticles = Math.floor(energyValue * zoomLevel / 10);

            for (let i = 0; i < numParticles; i++) {
                const particlePair = document.createElementNS("http://www.w3.org/2000/svg", "g");

                const x = 150 + Math.random() * 200;
                const y = 100 + Math.random() * 100;

                const particle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                particle1.setAttribute("cx", x - 5);
                particle1.setAttribute("cy", y);
                particle1.setAttribute("r", "3");
                particle1.setAttribute("fill", "#64b5f6");
                particle1.setAttribute("filter", "url(#particleBlur)");

                const particle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                particle2.setAttribute("cx", x + 5);
                particle2.setAttribute("cy", y);
                particle2.setAttribute("r", "3");
                particle2.setAttribute("fill", "#81c784");
                particle2.setAttribute("filter", "url(#particleBlur)");

                const connectionLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
                connectionLine.setAttribute("x1", x - 5);
                connectionLine.setAttribute("y1", y);
                connectionLine.setAttribute("x2", x + 5);
                connectionLine.setAttribute("y2", y);
                connectionLine.setAttribute("stroke", "#ffb74d");
                connectionLine.setAttribute("stroke-width", "1");
                connectionLine.setAttribute("stroke-dasharray", "1,1");

                particlePair.appendChild(connectionLine);
                particlePair.appendChild(particle1);
                particlePair.appendChild(particle2);

                particlePair.dataset.lifetime = Math.random() * 2500 + 500;
                particlePair.dataset.born = Date.now();

                particles.push(particlePair);
                vacuumRegion.appendChild(particlePair);
            }
        }

        function updateParticles() {
            const now = Date.now();

            particles = particles.filter(particle => {
                const age = now - parseInt(particle.dataset.born);
                if (age > parseInt(particle.dataset.lifetime)) {
                    if (vacuumRegion.contains(particle)) {
                        vacuumRegion.removeChild(particle);
                    }
                    return false;
                }
                return true;
            });

            const numParticles = Math.floor(energyValue * zoomLevel / 10);
            if (particles.length < numParticles) {
                const particlePair = document.createElementNS("http://www.w3.org/2000/svg", "g");

                const x = 150 + Math.random() * 200;
                const y = 100 + Math.random() * 100;

                const particle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                particle1.setAttribute("cx", x - 5);
                particle1.setAttribute("cy", y);
                particle1.setAttribute("r", "3");
                particle1.setAttribute("fill", "#64b5f6");
                particle1.setAttribute("filter", "url(#particleBlur)");

                const particle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                particle2.setAttribute("cx", x + 5);
                particle2.setAttribute("cy", y);
                particle2.setAttribute("r", "3");
                particle2.setAttribute("fill", "#81c784");
                particle2.setAttribute("filter", "url(#particleBlur)");

                const connectionLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
                connectionLine.setAttribute("x1", x - 5);
                connectionLine.setAttribute("y1", y);
                connectionLine.setAttribute("x2", x + 5);
                connectionLine.setAttribute("y2", y);
                connectionLine.setAttribute("stroke", "#ffb74d");
                connectionLine.setAttribute("stroke-width", "1");
                connectionLine.setAttribute("stroke-dasharray", "1,1");

                particlePair.appendChild(connectionLine);
                particlePair.appendChild(particle1);
                particlePair.appendChild(particle2);

                particlePair.dataset.lifetime = Math.random() * 2500 + 500;
                particlePair.dataset.born = now;

                particles.push(particlePair);
                vacuumRegion.appendChild(particlePair);
            }

            particles.forEach(particle => {
                const particle1 = particle.children[1];
                const particle2 = particle.children[2];

                particle1.setAttribute("cx", parseFloat(particle1.getAttribute("cx")) + (Math.random() - 0.5) * 0.5);
                particle1.setAttribute("cy", parseFloat(particle1.getAttribute("cy")) + (Math.random() - 0.5) * 0.5);

                particle2.setAttribute("cx", parseFloat(particle2.getAttribute("cx")) + (Math.random() - 0.5) * 0.5);
                particle2.setAttribute("cy", parseFloat(particle2.getAttribute("cy")) + (Math.random() - 0.5) * 0.5);

                const connectionLine = particle.children[0];
                connectionLine.setAttribute("x1", particle1.getAttribute("cx"));
                connectionLine.setAttribute("y1", particle1.getAttribute("cy"));
                connectionLine.setAttribute("x2", particle2.getAttribute("cx"));
                connectionLine.setAttribute("y2", particle2.getAttribute("cy"));
            });

            animationFrameId = requestAnimationFrame(updateParticles);
        }

        zoomInBtn.addEventListener('click', () => {
            if (zoomLevel < 4) {
                zoomLevel *= 2;
                updateZoom();
            }
        });

        zoomOutBtn.addEventListener('click', () => {
            if (zoomLevel > 0.5) {
                zoomLevel /= 2;
                updateZoom();
            }
        });

        energyUpBtn.addEventListener('click', () => {
            if (energyValue < 95) {
                energyValue += 5;
                updateEnergy();
            }
        });

        energyDownBtn.addEventListener('click', () => {
            if (energyValue > 5) {
                energyValue -= 5;
                updateEnergy();
            }
        });

        toggleParticlesBtn.addEventListener('click', () => {
            particlesVisible = !particlesVisible;
            vacuumRegion.style.opacity = particlesVisible ? 1 : 0;
            toggleParticlesBtn.textContent = particlesVisible ? "Hide Particles" : "Show Particles";

            if (particlesVisible) {
                vacuumExplanation.textContent = "The quantum vacuum is not truly empty—it's filled with virtual particles that continuously appear and disappear. This parallels the Madhyamaka concept of emptiness (śūnyatā), which is not nothingness but a dynamic interdependence lacking inherent existence.";
            } else {
                vacuumExplanation.textContent = "Now the vacuum appears empty, but this 'emptiness' is actually full of potential. In Madhyamaka, emptiness (śūnyatā) doesn't mean non-existence, but rather existence that is dependently originated and lacks inherent nature.";
            }
        });

        function updateZoom() {
            const width = 100 / zoomLevel;
            const height = 50 / zoomLevel;
            const x = 250 - width / 2;
            const y = 150 - height / 2;

            gsap.to(zoomBox, {
                x: x,
                y: y,
                width: width,
                height: height,
                duration: 0.3
            });

            const scales = ["10⁻¹⁵ m", "10⁻¹⁶ m", "10⁻¹⁷ m", "10⁻¹⁸ m"];
            const scaleIndex = Math.log2(zoomLevel) + 1;
            scaleText.textContent = `Scale: ${scales[scaleIndex]}`;

            createParticles();

            if (zoomLevel <= 1) {
                vacuumExplanation.textContent = "At this scale, we see minimal quantum vacuum activity. Similarly, Madhyamaka's emptiness appears as conventional reality at ordinary scales.";
            } else if (zoomLevel === 2) {
                vacuumExplanation.textContent = "Zooming in reveals more virtual particle activity. Madhyamaka teaches that examining phenomena more closely reveals their dependently originated nature.";
            } else {
                vacuumExplanation.textContent = "At profound scales, the vacuum teems with activity—particles constantly emerging and disappearing. This parallels the Madhyamaka insight that 'emptiness' is actually a dynamic process of interdependent becoming.";
            }
        }

        function updateEnergy() {
            const height = 95 - energyValue;
            gsap.to(energyLevel, {
                y: 140 - (95 - height),
                height: height,
                duration: 0.3
            });

            createParticles();
        }

        createParticles();
        updateParticles();

        this.addTooltip(zoomInBtn, "Zoom in to see smaller scales");
        this.addTooltip(zoomOutBtn, "Zoom out to see larger scales");
        this.addTooltip(energyUpBtn, "Increase vacuum energy");
        this.addTooltip(energyDownBtn, "Decrease vacuum energy");
    }

    setupQuantumFieldInteraction() {
        const container = document.createElement('div');
        container.className = 'quantum-field-container';
        container.innerHTML = `
            <div class="qf-header">
                <h3>Quantum Field Theory</h3>
                <p>Exploring the interconnected nature of fields and particles</p>
            </div>

            <div class="qf-visualization">
                <svg viewBox="0 0 500 300" width="100%" height="100%">
                    <defs>
                        <radialGradient id="fieldGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                            <stop offset="0%" stop-color="#64b5f6" stop-opacity="0.5"/>
                            <stop offset="100%" stop-color="#64b5f6" stop-opacity="0"/>
                        </radialGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="blur"/>
                            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                        </filter>
                    </defs>

                    <!-- Field background -->
                    <rect x="50" y="50" width="400" height="200" rx="5" fill="#111" stroke="#333" stroke-width="2"/>

                    <!-- Field grid -->
                    <g id="field-grid"></g>

                    <!-- Field particles -->
                    <g id="field-particles"></g>

                    <!-- Field controls -->
                    <g id="field-controls">
                        <rect x="60" y="260" width="80" height="30" rx="5" fill="#333" class="interactive-element" id="field-electron"/>
                        <text x="100" y="280" text-anchor="middle" fill="white" font-size="14">Electron</text>

                        <rect x="150" y="260" width="80" height="30" rx="5" fill="#333" class="interactive-element" id="field-photon"/>
                        <text x="190" y="280" text-anchor="middle" fill="white" font-size="14">Photon</text>

                        <rect x="240" y="260" width="80" height="30" rx="5" fill="#333" class="interactive-element" id="field-higgs"/>
                        <text x="280" y="280" text-anchor="middle" fill="white" font-size="14">Higgs</text>

                        <rect x="330" y="260" width="110" height="30" rx="5" fill="#333" class="interactive-element" id="field-interaction"/>
                        <text x="385" y="280" text-anchor="middle" fill="white" font-size="14">Interaction</text>
                    </g>

                    <!-- Field type indicator -->
                    <text id="field-type" x="250" y="30" text-anchor="middle" fill="white" font-size="16">Electron Field</text>
                </svg>
            </div>

            <div class="qf-explanation">
                <p id="qf-explanation">
                    In Quantum Field Theory, particles are excitations of underlying fields that permeate all of spacetime.
                    This parallels Madhyamaka's view of interdependence where no phenomenon exists independently but arises
                    through relationships with other phenomena.
                </p>
            </div>
        `;
        this.interactionContainer.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            .quantum-field-container {
                display: flex;
                flex-direction: column;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 10px;
                padding: 20px;
                width: 100%;
                height: 100%;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .qf-header {
                text-align: center;
                margin-bottom: 10px;
            }

            .qf-header h3 {
                color: #64b5f6;
                margin-bottom: 5px;
            }

            .qf-visualization {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
            }

            .qf-explanation {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: 8px;
                font-size: 0.9rem;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);

        const fieldGrid = document.getElementById('field-grid');
        const particles = document.getElementById('field-particles');
        const fieldTypeText = document.getElementById('field-type');
        const fieldExplanation = document.getElementById('qf-explanation');

        let currentField = 'electron';
        let fieldPoints = [];
        let fieldParticles = [];
        let animationId;

        function createFieldGrid() {
            while (fieldGrid.firstChild) {
                fieldGrid.removeChild(fieldGrid.firstChild);
            }
            fieldPoints = [];

            for (let x = 75; x <= 425; x += 25) {
                for (let y = 75; y <= 225; y += 25) {
                    const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    point.setAttribute("cx", x);
                    point.setAttribute("cy", y);
                    point.setAttribute("r", 2);
                    point.setAttribute("fill", "#444");

                    fieldGrid.appendChild(point);

                    fieldPoints.push({
                        element: point,
                        x: x,
                        y: y,
                        baseY: y,
                        amplitude: 0,
                        phase: Math.random() * Math.PI * 2
                    });
                }
            }
        }

        function updateField() {
            const time = Date.now() / 1000;

            fieldPoints.forEach(point => {
                let amplitude = 0;

                fieldParticles.forEach(particle => {
                    const dx = particle.x - point.x;
                    const dy = particle.y - point.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        const influence = (1 - distance / 100) * 15;

                        if (particle.type === currentField || (currentField === 'electron' && particle.type === 'photon') || (currentField === 'photon' && particle.type !== 'photon')) {
                            amplitude += Math.sin(time * 3 + point.phase + distance / 20) * influence;
                        }
                    }
                });

                point.amplitude = amplitude;
                const newY = point.baseY + amplitude;
                point.y = newY;

                const colorValue = Math.min(255, Math.max(0, 100 + amplitude * 5));
                let color;

                switch (currentField) {
                    case 'electron':
                        color = `rgb(${100 - amplitude * 3}, ${150 - amplitude * 2}, ${255 - amplitude})`;
                        break;
                    case 'photon':
                        color = `rgb(${255 - amplitude}, ${180 - amplitude * 2}, ${77 - amplitude * 3})`;
                        break;
                    case 'higgs':
                        color = `rgb(${129 - amplitude * 3}, ${199 - amplitude}, ${132 - amplitude * 2})`;
                        break;
                }

                point.element.setAttribute("fill", color);
                point.element.setAttribute("cy", newY);

                const radius = 2 + Math.abs(amplitude) / 5;
                point.element.setAttribute("r", radius);
            });

            fieldParticles.forEach(particle => {
                if (particle.type !== currentField && currentField !== 'photon') {
                    particle.vx = (Math.random() - 0.5) * 2;
                    particle.vy = (Math.random() - 0.5) * 2;
                }

                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 50) {
                    particle.x = 50;
                    particle.vx *= -1;
                } else if (particle.x > 450) {
                    particle.x = 450;
                    particle.vx *= -1;
                }

                if (particle.y < 50) {
                    particle.y = 50;
                    particle.vy *= -1;
                } else if (particle.y > 250) {
                    particle.y = 250;
                    particle.vy *= -1;
                }

                particle.vx *= 0.99;
                particle.vy *= 0.99;

                particle.element.setAttribute("cx", particle.x);
                particle.element.setAttribute("cy", particle.y);
            });

            animationId = requestAnimationFrame(updateField);
        }

        document.getElementById('field-electron').addEventListener('click', () => {
            currentField = 'electron';
            fieldTypeText.textContent = 'Electron Field';
            fieldExplanation.textContent = 'The electron field permeates all space. Electrons are excitations of this field, not separate entities. This mirrors the Madhyamaka concept that phenomena lack inherent existence and fixed characteristics.';
        });

        document.getElementById('field-photon').addEventListener('click', () => {
            currentField = 'photon';
            fieldTypeText.textContent = 'Electromagnetic Field';
            fieldExplanation.textContent = 'The electromagnetic field transmits forces between charged particles. Photons are its excitations. In Madhyamaka, this illustrates how relationships between phenomena are as fundamental as the phenomena themselves.';
        });

        document.getElementById('field-higgs').addEventListener('click', () => {
            currentField = 'higgs';
            fieldTypeText.textContent = 'Higgs Field';
            fieldExplanation.textContent = 'The Higgs field gives mass to other particles through interaction. This exemplifies Madhyamaka\'s principle that properties emerge through interdependence rather than existing intrinsically.';
        });

        document.getElementById('field-interaction').addEventListener('click', () => {
            if (fieldParticles.length < 10) {
                const types = ['electron', 'photon', 'higgs'];
                const type1 = types[Math.floor(Math.random() * types.length)];
                const type2 = types[Math.floor(Math.random() * types.length)];

                const x1 = 100 + Math.random() * 300;
                const y1 = 80 + Math.random() * 140;

                fieldParticles.push({
                    element: document.createElementNS("http://www.w3.org/2000/svg", "circle"),
                    type: type1,
                    x: x1,
                    y: y1,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    radius: 6
                });

                fieldParticles.push({
                    element: document.createElementNS("http://www.w3.org/2000/svg", "circle"),
                    type: type2,
                    x: x1 + 20,
                    y: y1 + 20,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    radius: 6
                });

                fieldParticles[fieldParticles.length - 1].element.setAttribute("cx", x1);
                fieldParticles[fieldParticles.length - 1].element.setAttribute("cy", y1);
                fieldParticles[fieldParticles.length - 1].element.setAttribute("r", 6);
                fieldParticles[fieldParticles.length - 1].element.setAttribute("fill", "#64b5f6");
                fieldGrid.appendChild(fieldParticles[fieldParticles.length - 1].element);

                fieldParticles[fieldParticles.length - 2].element.setAttribute("cx", x1 + 20);
                fieldParticles[fieldParticles.length - 2].element.setAttribute("cy", y1 + 20);
                fieldParticles[fieldParticles.length - 2].element.setAttribute("r", 6);
                fieldParticles[fieldParticles.length - 2].element.setAttribute("fill", "#81c784");
                fieldGrid.appendChild(fieldParticles[fieldParticles.length - 2].element);
            }
        });

        createFieldGrid();
        updateField();

        this.addTooltip(document.getElementById('field-electron'), "View the electron field");
        this.addTooltip(document.getElementById('field-photon'), "View the electromagnetic field");
        this.addTooltip(document.getElementById('field-higgs'), "View the Higgs field");
        this.addTooltip(document.getElementById('field-interaction'), "Add particle interactions");
    }

    setupSuperpositionInteraction() {
        const container = document.createElement('div');
        container.className = 'superposition-container';
        container.innerHTML = `
            <div class="sp-header">
                <h3>Quantum Superposition</h3>
                <p>Exploring states of multiple possibilities</p>
            </div>

            <div class="sp-visualization">
                <svg viewBox="0 0 500 300" width="100%" height="100%">
                    <defs>
                        <linearGradient id="superpositionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#64b5f6"/>
                            <stop offset="50%" stop-color="#81c784"/>
                            <stop offset="100%" stop-color="#ffb74d"/>
                        </linearGradient>
                        <filter id="glowEffect">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
                            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                        </filter>
                    </defs>

                    <!-- Bloch sphere -->
                    <circle cx="250" cy="150" r="100" fill="none" stroke="#333" stroke-width="1"/>
                    <ellipse cx="250" cy="150" rx="100" ry="30" fill="none" stroke="#333" stroke-width="1"/>
                    <line x1="250" y1="50" x2="250" y2="250" stroke="#333" stroke-width="1"/>
                    <line x1="150" y1="150" x2="350" y2="150" stroke="#333" stroke-width="1"/>

                    <!-- State labels -->
                    <text x="250" y="40" text-anchor="middle" fill="white" font-size="14">|0⟩</text>
                    <text x="250" y="270" text-anchor="middle" fill="white" font-size="14">|1⟩</text>
                    <text x="140" y="150" text-anchor="end" fill="white" font-size="14">|+⟩</text>
                    <text x="360" y="150" text-anchor="start" fill="white" font-size="14">|-⟩</text>

                    <!-- Current state -->
                    <line id="state-vector" x1="250" y1="150" x2="250" y2="50" stroke="url(#superpositionGradient)" stroke-width="3"/>
                    <circle id="state-point" cx="250" cy="50" r="8" fill="url(#superpositionGradient)" filter="url(#glowEffect)"/>

                    <!-- Controls -->
                    <g id="sp-controls">
                        <rect x="50" y="260" width="80" height="30" rx="5" fill="#333" class="interactive-element" id="x-gate"/>
                        <text x="90" y="280" text-anchor="middle" fill="white" font-size="14">X Gate</text>

                        <rect x="140" y="260" width="80" height="30" rx="5" fill="#333" class="interactive-element" id="h-gate"/>
                        <text x="180" y="280" text-anchor="middle" fill="white" font-size="14">H Gate</text>

                        <rect x="230" y="260" width="80" height="30" rx="5" fill="#333" class="interactive-element" id="z-gate"/>
                        <text x="270" y="280" text-anchor="middle" fill="white" font-size="14">Z Gate</text>

                        <rect x="320" y="260" width="130" height="30" rx="5" fill="#333" class="interactive-element" id="measure-btn"/>
                        <text x="385" y="280" text-anchor="middle" fill="white" font-size="14">Measure Qubit</text>
                    </g>

                    <!-- Measurement result -->
                    <g id="measurement-result" display="none">
                        <rect x="400" y="50" width="80" height="60" rx="5" fill="#222" stroke="#81c784" stroke-width="2"/>
                        <text x="440" y="70" text-anchor="middle" fill="white" font-size="12">Result:</text>
                        <text id="result-value" x="440" y="100" text-anchor="middle" fill="#81c784" font-size="24">|0⟩</text>
                    </g>

                    <!-- State info -->
                    <g id="state-info">
                        <rect x="50" y="50" width="150" height="80" rx="5" fill="rgba(0,0,0,0.6)" stroke="#333" stroke-width="1"/>
                        <text x="60" y="70" fill="white" font-size="12">Current State:</text>
                        <text id="state-formula" x="60" y="95" fill="white" font-size="14">|ψ⟩ = |0⟩</text>
                        <text id="state-probabilities" x="60" y="120" fill="white" font-size="12">P(0) = 100%, P(1) = 0%</text>
                    </g>
                </svg>
            </div>

            <div class="sp-explanation">
                <p id="sp-explanation">
                    Quantum superposition allows a quantum system to exist in multiple states simultaneously.
                    This parallels the Madhyamaka concept that phenomena lack inherent existence - they don't
                    possess definite states or properties until conditions cause them to manifest in specific ways.
                </p>
            </div>
        `;
        this.interactionContainer.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            .superposition-container {
                display: flex;
                flex-direction: column;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 10px;
                padding: 20px;
                width: 100%;
                height: 100%;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .sp-header {
                text-align: center;
                margin-bottom: 10px;
            }

            .sp-header h3 {
                color: #64b5f6;
                margin-bottom: 5px;
            }

            .sp-visualization {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
            }

            .sp-explanation {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: 8px;
                font-size: 0.9rem;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);

        let qubitState = {
            theta: 0,
            phi: 0,
            measured: false
        };

        const stateVector = document.getElementById('state-vector');
        const statePoint = document.getElementById('state-point');
        const stateFormula = document.getElementById('state-formula');
        const stateProbabilities = document.getElementById('state-probabilities');
        const resultValue = document.getElementById('result-value');
        const measurementResult = document.getElementById('measurement-result');
        const spExplanation = document.getElementById('sp-explanation');

        function updateQubitVisualization() {
            const x = 250 + 100 * Math.sin(qubitState.theta) * Math.cos(qubitState.phi);
            const y = 150 - 100 * Math.cos(qubitState.theta);

            stateVector.setAttribute('x2', x);
            stateVector.setAttribute('y2', y);
            statePoint.setAttribute('cx', x);
            statePoint.setAttribute('cy', y);

            const p0 = Math.cos(qubitState.theta / 2) ** 2;
            const p1 = Math.sin(qubitState.theta / 2) ** 2;

            if (qubitState.measured) {
                stateFormula.textContent = `|ψ⟩ = ${p0 > 0.5 ? '|0⟩' : '|1⟩'}`;
                stateProbabilities.textContent = `Measured to definite state`;
            } else if (Math.abs(qubitState.theta) < 0.01) {
                stateFormula.textContent = `|ψ⟩ = |0⟩`;
                stateProbabilities.textContent = `P(0) = 100%, P(1) = 0%`;
            } else if (Math.abs(qubitState.theta - Math.PI) < 0.01) {
                stateFormula.textContent = `|ψ⟩ = |1⟩`;
                stateProbabilities.textContent = `P(0) = 0%, P(1) = 100%`;
            } else if (Math.abs(qubitState.theta - Math.PI/2) < 0.01 && Math.abs(qubitState.phi) < 0.01) {
                stateFormula.textContent = `|ψ⟩ = |+⟩ = (|0⟩+|1⟩)/√2`;
                stateProbabilities.textContent = `P(0) = 50%, P(1) = 50%`;
            } else if (Math.abs(qubitState.theta - Math.PI/2) < 0.01 && Math.abs(qubitState.phi - Math.PI) < 0.01) {
                stateFormula.textContent = `|ψ⟩ = |-⟩ = (|0⟩-|1⟩)/√2`;
                stateProbabilities.textContent = `P(0) = 50%, P(1) = 50%`;
            } else {
                const alpha = Math.cos(qubitState.theta / 2).toFixed(2);
                const beta = Math.sin(qubitState.theta / 2).toFixed(2);
                stateFormula.textContent = `|ψ⟩ = ${alpha}|0⟩ + ${beta}|1⟩`;
                stateProbabilities.textContent = `P(0) = ${(p0*100).toFixed(0)}%, P(1) = ${(p1*100).toFixed(0)}%`;
            }
        }

        function applyXGate() {
            if (qubitState.measured) resetQubit();

            gsap.to(qubitState, {
                theta: Math.PI - qubitState.theta,
                duration: 1,
                onUpdate: updateQubitVisualization,
                onComplete: () => {
                    spExplanation.textContent = "The X gate flips the state of the qubit (|0⟩ ↔ |1⟩). In Madhyamaka terms, this shows how a phenomenon's state can transform completely while maintaining its dependent nature.";
                }
            });
        }

        function applyHGate() {
            if (qubitState.measured) resetQubit();

            gsap.to(qubitState, {
                theta: Math.PI / 2,
                phi: 0,
                duration: 1,
                onUpdate: updateQubitVisualization,
                onComplete: () => {
                    spExplanation.textContent = "The H gate creates a superposition state. From a Madhyamaka perspective, this illustrates how definite states are merely conventional designations - the underlying reality allows for multiple potentialities.";
                }
            });
        }

        function applyZGate() {
            if (qubitState.measured) resetQubit();

            gsap.to(qubitState, {
                phi: qubitState.phi + Math.PI,
                duration: 1,
                onUpdate: updateQubitVisualization,
                onComplete: () => {
                    spExplanation.textContent = "The Z gate changes the phase of the qubit without altering measurement probabilities. This illustrates the Madhyamaka concept that reality has aspects beyond conventional observation.";
                }
            });
        }

        function measureQubit() {
            if (qubitState.measured) return;

            const p0 = Math.cos(qubitState.theta / 2) ** 2;
            const randomOutcome = Math.random();
            const outcome = randomOutcome < p0 ? 0 : 1;

            measurementResult.setAttribute('display', 'block');
            resultValue.textContent = `|${outcome}⟩`;

            gsap.to(qubitState, {
                theta: outcome === 0 ? 0 : Math.PI,
                duration: 0.5,
                onUpdate: updateQubitVisualization,
                onComplete: () => {
                    qubitState.measured = true;

                    spExplanation.textContent = `Measurement has collapsed the superposition to state |${outcome}⟩. This parallels Madhyamaka's view that definite properties are not inherent but arise through interdependent conditions - in this case, the act of measurement.`;
                }
            });
        }

        function resetQubit() {
            measurementResult.setAttribute('display', 'none');
            qubitState.measured = false;

            gsap.to(qubitState, {
                theta: 0,
                phi: 0,
                duration: 0.5,
                onUpdate: updateQubitVisualization,
                onComplete: () => {
                    spExplanation.textContent = "Quantum superposition allows a quantum system to exist in multiple states simultaneously. This parallels the Madhyamaka concept that phenomena lack inherent existence - they don't possess definite states or properties until conditions cause them to manifest in specific ways.";
                }
            });
        }

        document.getElementById('x-gate').addEventListener('click', applyXGate);
        document.getElementById('h-gate').addEventListener('click', applyHGate);
        document.getElementById('z-gate').addEventListener('click', applyZGate);
        document.getElementById('measure-btn').addEventListener('click', measureQubit);

        updateQubitVisualization();

        this.addTooltip(document.getElementById('x-gate'), "Apply X gate (bit flip)");
        this.addTooltip(document.getElementById('h-gate'), "Apply H gate (creates superposition)");
        this.addTooltip(document.getElementById('z-gate'), "Apply Z gate (phase flip)");
        this.addTooltip(document.getElementById('measure-btn'), "Measure the qubit state");
    }

    setupMeasurementProblemInteraction() {
        const container = document.createElement('div');
        container.className = 'measurement-problem-container';
        container.innerHTML = `
            <div class="mp-header">
                <h3>The Quantum Measurement Problem</h3>
                <p>Exploring how observation affects quantum reality</p>
            </div>

            <div class="mp-visualization">
                <svg viewBox="0 0 500 300" width="100%" height="100%">
                    <defs>
                        <radialGradient id="waveGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                            <stop offset="0%" stop-color="#64b5f6" stop-opacity="0.8"/>
                            <stop offset="100%" stop-color="#64b5f6" stop-opacity="0"/>
                        </radialGradient>
                        <filter id="blurFilter">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
                            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                        </filter>
                    </defs>

                    <!-- Experiment setup -->
                    <rect x="50" y="50" width="400" height="200" rx="5" fill="#111" stroke="#333" stroke-width="2"/>

                    <!-- Quantum system -->
                    <g id="quantum-system">
                        <circle id="system-wave" cx="150" cy="150" r="40" fill="url(#waveGlow)" opacity="0.8" filter="url(#blurFilter)"/>
                        <circle id="system-particle" cx="150" cy="150" r="8" fill="#64b5f6" display="none"/>
                    </g>

                    <!-- Detector -->
                    <g id="detector">
                        <rect x="300" y="100" width="100" height="100" rx="5" fill="#222" stroke="#81c784" stroke-width="2"/>
                        <text x="350" y="140" text-anchor="middle" fill="white" font-size="14">Detector</text>
                        <circle id="detector-status" cx="350" cy="170" r="15" fill="#333"/>
                    </g>

                    <!-- Observer -->
                    <g id="observer">
                        <circle cx="450" cy="150" r="20" fill="#ffb74d" class="interactive-element" id="observer-btn"/>
                        <text x="450" y="155" text-anchor="middle" fill="white" font-size="14">👁️</text>
                    </g>

                    <!-- Interpretations -->
                    <g id="interpretation-controls">
                        <rect x="80" y="260" width="110" height="30" rx="5" fill="#333" class="interactive-element" id="copenhagen-btn"/>
                        <text x="130" y="280" text-anchor="middle" fill="white" font-size="12">Copenhagen</text>

                        <rect x="190" y="260" width="120" height="30" rx="5" fill="#333" class="interactive-element" id="many-worlds-btn"/>
                        <text x="250" y="280" text-anchor="middle" fill="white" font-size="12">Many Worlds</text>

                        <rect x="320" y="260" width="100" height="30" rx="5" fill="#333" class="interactive-element" id="reset-btn"/>
                        <text x="370" y="280" text-anchor="middle" fill="white" font-size="12">Reset</text>
                    </g>

                    <!-- Information panel -->
                    <g id="interpretation-info">
                        <rect x="70" y="10" width="360" height="30" rx="5" fill="rgba(0,0,0,0.6)"/>
                        <text id="interpretation-text" x="250" y="30" text-anchor="middle" fill="white" font-size="14">Select an interpretation</text>
                    </g>
                </svg>
            </div>

            <div class="mp-explanation">
                <p id="mp-explanation">
                    The measurement problem asks how quantum superpositions become definite outcomes upon observation.
                    In Madhyamaka philosophy, this parallels the question of how conventional reality arises from the
                    ultimate nature of phenomena, which lack inherent existence.
                </p>
            </div>
        `;
        this.interactionContainer.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            .measurement-problem-container {
                display: flex;
                flex-direction: column;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 10px;
                padding: 20px;
                width: 100%;
                height: 100%;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .mp-header {
                text-align: center;
                margin-bottom: 10px;
            }

            .mp-header h3 {
                color: #64b5f6;
                margin-bottom: 5px;
            }

            .mp-visualization {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
            }

            .mp-explanation {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: 8px;
                font-size: 0.9rem;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);

        const systemWave = document.getElementById('system-wave');
        const systemParticle = document.getElementById('system-particle');
        const detectorStatus = document.getElementById('detector-status');
        const interpretationText = document.getElementById('interpretation-text');
        const mpExplanation = document.getElementById('mp-explanation');

        let currentInterpretation = null;
        let observerActive = false;
        let measured = false;
        let animationId;

        function animateWave() {
            const time = Date.now() / 1000;
            const scale = 1 + 0.2 * Math.sin(time * 2);
            const opacity = 0.7 + 0.3 * Math.sin(time * 3);

            systemWave.setAttribute('r', 40 * scale);
            systemWave.setAttribute('opacity', opacity);

            if (!measured) {
                animationId = requestAnimationFrame(animateWave);
            }
        }

        animateWave();

        function applyCopenhagen() {
            currentInterpretation = 'copenhagen';
            interpretationText.textContent = 'Copenhagen Interpretation';

            if (observerActive && !measured) {
                gsap.to(systemWave, {
                    r: 8,
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        systemWave.style.display = 'none';
                        systemParticle.style.display = 'block';

                        const randomX = 130 + Math.random() * 40;
                        const randomY = 130 + Math.random() * 40;

                        systemParticle.setAttribute('cx', randomX);
                        systemParticle.setAttribute('cy', randomY);

                        detectorStatus.setAttribute('fill', '#81c784');

                        measured = true;

                        mpExplanation.textContent = "In the Copenhagen interpretation, observation collapses the wave function to a definite state. This parallels the Madhyamaka view that conventional reality (with definite properties) emerges from ultimate reality (which lacks inherent existence) through conditions of observation and conceptualization.";
                    }
                });
            }
        }

        function applyManyWorlds() {
            currentInterpretation = 'many-worlds';
            interpretationText.textContent = 'Many Worlds Interpretation';

            if (observerActive && !measured) {
                const systemWaveClone = systemWave.cloneNode(true);
                systemWave.parentNode.appendChild(systemWaveClone);

                const systemParticleClone = systemParticle.cloneNode(true);
                systemParticleClone.style.display = 'block';
                systemWave.parentNode.appendChild(systemParticleClone);

                systemParticle.style.display = 'block';

                const randomX = 130 + Math.random() * 40;
                const randomY = 130 + Math.random() * 40;

                systemParticle.setAttribute('cx', randomX);
                systemParticle.setAttribute('cy', randomY);

                systemParticleClone.setAttribute('cx', randomX + 20);
                systemParticleClone.setAttribute('cy', randomY + 20);

                gsap.to(systemWave, {
                    r: 20,
                    opacity: 0.4,
                    cx: 130,
                    cy: 130,
                    duration: 1
                });

                gsap.to(systemWaveClone, {
                    r: 20,
                    opacity: 0.4,
                    cx: 170,
                    cy: 170,
                    duration: 1,
                    onComplete: () => {
                        detectorStatus.setAttribute('fill', '#ffb74d');

                        measured = true;

                        mpExplanation.textContent = "In the Many Worlds interpretation, observation doesn't collapse the wave function but creates branching universes where all outcomes occur. This reflects the Madhyamaka concept that no single definitive reality exists intrinsically, only a network of interdependent possibilities.";
                    }
                });
            }
        }

        function resetExperiment() {
            systemWave.style.display = 'block';
            systemWave.setAttribute('r', '40');
            systemWave.setAttribute('opacity', '0.8');
            systemWave.setAttribute('cx', '150');
            systemWave.setAttribute('cy', '150');

            systemParticle.style.display = 'none';
            systemParticle.setAttribute('cx', '150');
            systemParticle.setAttribute('cy', '150');

            detectorStatus.setAttribute('fill', '#333');

            measured = false;

            mpExplanation.textContent = "The measurement problem asks how quantum superpositions become definite outcomes upon observation. In Madhyamaka philosophy, this parallels the question of how conventional reality arises from the ultimate nature of phenomena, which lack inherent existence.";
        }

        document.getElementById('copenhagen-btn').addEventListener('click', applyCopenhagen);
        document.getElementById('many-worlds-btn').addEventListener('click', applyManyWorlds);
        document.getElementById('observer-btn').addEventListener('click', () => {
            observerActive = true;

            gsap.to('#observer-btn', {
                r: 25,
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });

            if (currentInterpretation === 'copenhagen') {
                applyCopenhagen();
            } else if (currentInterpretation === 'many-worlds') {
                applyManyWorlds();
            }
        });
        document.getElementById('reset-btn').addEventListener('click', resetExperiment);

        this.addTooltip(document.getElementById('copenhagen-btn'), "Apply Copenhagen interpretation");
        this.addTooltip(document.getElementById('many-worlds-btn'), "Apply Many Worlds interpretation");
        this.addTooltip(document.getElementById('observer-btn'), "Observe the quantum system");
        this.addTooltip(document.getElementById('reset-btn'), "Reset the experiment");
    }

    setupContextualityInteraction() {
        const container = document.createElement('div');
        container.className = 'contextuality-container';
        container.innerHTML = `
            <div class="cx-header">
                <h3>Quantum Contextuality</h3>
                <p>How measurement context determines quantum properties</p>
            </div>

            <div class="cx-visualization">
                <svg viewBox="0 0 500 300" width="100%" height="100%">
                    <defs>
                        <linearGradient id="contextGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#64b5f6"/>
                            <stop offset="100%" stop-color="#81c784"/>
                        </linearGradient>
                    </defs>

                    <!-- Container for the experiment -->
                    <rect x="50" y="50" width="400" height="170" rx="5" fill="#111" stroke="#333" stroke-width="2"/>

                    <!-- Quantum system -->
                    <circle id="cx-particle" cx="150" cy="135" r="15" fill="#64b5f6" filter="url(#glow)"/>

                    <!-- Measurement contexts -->
                    <g id="context-A">
                        <rect x="250" y="80" width="140" height="50" rx="5" fill="#222" stroke="#333"/>
                        <text x="320" y="110" text-anchor="middle" fill="white" font-size="14">Context A</text>
                        <circle id="result-A" cx="350" cy="105" r="10" fill="#333"/>
                    </g>

                    <g id="context-B">
                        <rect x="250" y="140" width="140" height="50" rx="5" fill="#222" stroke="#333"/>
                        <text x="320" y="170" text-anchor="middle" fill="white" font-size="14">Context B</text>
                        <circle id="result-B" cx="350" cy="165" r="10" fill="#333"/>
                    </g>

                    <!-- Controls -->
                    <g id="context-controls">
                        <rect x="70" y="240" width="160" height="35" rx="5" fill="#333" class="interactive-element" id="measure-context-a"/>
                        <text x="150" y="262" text-anchor="middle" fill="white" font-size="14">Measure in Context A</text>

                        <rect x="270" y="240" width="160" height="35" rx="5" fill="#333" class="interactive-element" id="measure-context-b"/>
                        <text x="350" y="262" text-anchor="middle" fill="white" font-size="14">Measure in Context B</text>
                    </g>

                    <!-- Context indicator -->
                    <path id="context-path" d="M 165 135 Q 210 105, 250 105" stroke="#64b5f6" stroke-width="2" fill="none" stroke-dasharray="5,5" opacity="0"/>

                    <!-- Values display -->
                    <g id="values-display">
                        <rect x="60" y="60" width="130" height="30" rx="5" fill="rgba(0,0,0,0.6)"/>
                        <text x="125" y="80" text-anchor="middle" fill="white" font-size="14">Ready to measure</text>
                    </g>
                </svg>
            </div>

            <div class="cx-explanation">
                <p id="cx-explanation">
                    Quantum contextuality demonstrates that measurement results depend on which other properties 
                    are measured simultaneously. This parallels the Madhyamaka view that properties are not 
                    intrinsic to objects but arise relative to specific conditions and contexts.
                </p>
            </div>
        `;
        this.interactionContainer.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            .contextuality-container {
                display: flex;
                flex-direction: column;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 10px;
                padding: 20px;
                width: 100%;
                height: 100%;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .cx-header {
                text-align: center;
                margin-bottom: 10px;
            }

            .cx-header h3 {
                color: #64b5f6;
                margin-bottom: 5px;
            }

            .cx-visualization {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
            }

            .cx-explanation {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: 8px;
                font-size: 0.9rem;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);

        const cxParticle = document.getElementById('cx-particle');
        const contextPath = document.getElementById('context-path');
        const resultA = document.getElementById('result-A');
        const resultB = document.getElementById('result-B');
        const valueText = document.querySelector('#values-display text');
        const cxExplanation = document.getElementById('cx-explanation');

        let lastMeasurementContext = null;
        let valueInContextA = null;
        let valueInContextB = null;
        const states = [
            { A: 1, B: 1 },
            { A: 1, B: 0 },
            { A: 0, B: 1 },
            { A: 0, B: 0 }
        ];
        let systemState = states[Math.floor(Math.random() * states.length)];

        function measureInContextA() {
            if (lastMeasurementContext === 'A') {
                resetMeasurement();
                return;
            }

            if (lastMeasurementContext === 'B') {
                valueInContextA = (valueInContextB === 1) ? 0 : 1;
            } else {
                valueInContextA = systemState.A;
            }

            resultA.setAttribute('fill', valueInContextA === 1 ? '#64b5f6' : '#81c784');

            gsap.to(contextPath, {
                opacity: 1,
                duration: 0.5
            });

            gsap.to(cxParticle, {
                cx: 180,
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });

            valueText.textContent = `Value in A: ${valueInContextA}`;

            lastMeasurementContext = 'A';

            cxExplanation.textContent = "Notice how measuring in context A after context B gives a result constrained by the previous measurement. In Madhyamaka terms, this demonstrates how properties are not inherent but emerge in relation to measurement contexts.";
        }

        function measureInContextB() {
            if (lastMeasurementContext === 'B') {
                resetMeasurement();
                return;
            }

            if (lastMeasurementContext === 'A') {
                valueInContextB = (valueInContextA === 1) ? 0 : 1;
            } else {
                valueInContextB = systemState.B;
            }

            resultB.setAttribute('fill', valueInContextB === 1 ? '#64b5f6' : '#81c784');

            gsap.to(contextPath, {
                opacity: 1,
                duration: 0.5
            });

            gsap.to(cxParticle, {
                cx: 180,
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });

            valueText.textContent = `Value in B: ${valueInContextB}`;

            lastMeasurementContext = 'B';

            cxExplanation.textContent = "Notice how measuring in context B after context A gives a result constrained by the previous measurement. In Madhyamaka terms, this demonstrates how properties are not inherent but emerge in relation to measurement contexts.";
        }

        function resetMeasurement() {
            systemState = states[Math.floor(Math.random() * states.length)];

            resultA.setAttribute('fill', '#333');
            resultB.setAttribute('fill', '#333');

            gsap.to(contextPath, {
                opacity: 0,
                duration: 0.5
            });

            gsap.to(cxParticle, {
                cx: 150,
                duration: 0.5
            });

            valueText.textContent = 'Ready to measure';

            lastMeasurementContext = null;
            valueInContextA = null;
            valueInContextB = null;

            cxExplanation.textContent = "Quantum contextuality demonstrates that measurement results depend on which other properties are measured simultaneously. This parallels the Madhyamaka view that properties are not intrinsic to objects but arise relative to specific conditions and contexts.";
        }

        document.getElementById('measure-context-a').addEventListener('click', measureInContextA);
        document.getElementById('measure-context-b').addEventListener('click', measureInContextB);

        this.addTooltip(document.getElementById('measure-context-a'), "Measure the particle in context A");
        this.addTooltip(document.getElementById('measure-context-b'), "Measure the particle in context B");
    }

    setupBoseEinsteinInteraction() {
        const container = document.createElement('div');
        container.className = 'bose-einstein-container';
        container.innerHTML = `
            <div class="be-header">
                <h3>Bose-Einstein Condensate</h3>
                <p>When particles lose individual identity</p>
            </div>

            <div class="be-visualization">
                <svg viewBox="0 0 500 300" width="100%" height="100%">
                    <defs>
                        <radialGradient id="becGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                            <stop offset="0%" stop-color="#64b5f6" stop-opacity="1"/>
                            <stop offset="100%" stop-color="#64b5f6" stop-opacity="0"/>
                        </radialGradient>
                    </defs>

                    <!-- Container -->
                    <rect x="100" y="50" width="300" height="200" rx="5" fill="#111" stroke="#333" stroke-width="2"/>

                    <!-- Temperature indicator -->
                    <g id="temperature-indicator">
                        <rect x="50" y="100" width="30" height="190" rx="5" fill="#222" stroke="#333" />
                        <rect id="temp-level" x="55" y="140" width="20" height="95" rx="3" fill="#e57373" />
                        <text x="65" y="90" text-anchor="middle" fill="white" font-size="12">Temp</text>
                    </g>

                    <!-- Particles container -->
                    <g id="particles-container"></g>

                    <!-- Condensate cloud -->
                    <circle id="condensate-cloud" cx="250" cy="150" r="0" fill="url(#becGlow)" opacity="0"/>

                    <!-- Controls -->
                    <g id="be-controls">
                        <rect x="100" y="260" width="140" height="30" rx="5" fill="#333" class="interactive-element" id="cool-btn"/>
                        <text x="170" y="280" text-anchor="middle" fill="white" font-size="14">Cool System</text>

                        <rect x="260" y="260" width="140" height="30" rx="5" fill="#333" class="interactive-element" id="heat-btn"/>
                        <text x="330" y="280" text-anchor="middle" fill="white" font-size="14">Heat System</text>
                    </g>

                    <!-- Information -->
                    <g id="be-info">
                        <rect x="150" y="10" width="200" height="30" rx="5" fill="rgba(0,0,0,0.6)"/>
                        <text x="250" y="30" text-anchor="middle" fill="white" font-size="14" id="state-text">Normal Gas State</text>
                    </g>
                </svg>
            </div>

            <div class="be-explanation">
                <p id="be-explanation">
                    In a Bose-Einstein condensate, particles cooled to near absolute zero merge into a single 
                    quantum state, losing their individual identities. This mirrors the Madhyamaka concept 
                    that individual entities lack inherent existence and are ultimately indistinguishable 
                    within the fabric of interdependence.
                </p>
            </div>
        `;
        this.interactionContainer.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            .bose-einstein-container {
                display: flex;
                flex-direction: column;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 10px;
                padding: 20px;
                width: 100%;
                height: 100%;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .be-header {
                text-align: center;
                margin-bottom: 10px;
            }

            .be-header h3 {
                color: #64b5f6;
                margin-bottom: 5px;
            }

            .be-visualization {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
            }

            .be-explanation {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: 8px;
                font-size: 0.9rem;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);

        const particlesContainer = document.getElementById('particles-container');
        const tempLevel = document.getElementById('temp-level');
        const condensateCloud = document.getElementById('condensate-cloud');
        const stateText = document.getElementById('state-text');
        const beExplanation = document.getElementById('be-explanation');

        let temperature = 100;
        let particles = [];
        let animationId;

        function createParticles() {
            while (particlesContainer.firstChild) {
                particlesContainer.removeChild(particlesContainer.firstChild);
            }
            particles = [];

            const numParticles = 50;

            for (let i = 0; i < numParticles; i++) {
                const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                particle.setAttribute("cx", Math.random() * 300 + 100);
                particle.setAttribute("cy", Math.random() * 150 + 50);
                particle.setAttribute("r", 4);
                particle.setAttribute("fill", "#64b5f6");

                particlesContainer.appendChild(particle);

                particles.push({
                    element: particle,
                    x: parseFloat(particle.getAttribute("cx")),
                    y: parseFloat(particle.getAttribute("cy")),
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    inCondensate: false
                });
            }
        }

        function updateParticles() {
            let condensateCount = 0;

            particles.forEach(particle => {
                if (temperature < 20) {
                    particle.inCondensate = true;
                    particle.element.setAttribute("fill", "#81c784");
                } else {
                    if (particle.inCondensate) {
                        particle.inCondensate = false;
                        particle.element.setAttribute("fill", "#64b5f6");
                    }

                    particle.vx = (Math.random() - 0.5) * 2;
                    particle.vy = (Math.random() - 0.5) * 2;
                }

                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 100) {
                    particle.x = 100;
                    particle.vx *= -1;
                } else if (particle.x > 400) {
                    particle.x = 400;
                    particle.vx *= -1;
                }

                if (particle.y < 50) {
                    particle.y = 50;
                    particle.vy *= -1;
                } else if (particle.y > 250) {
                    particle.y = 250;
                    particle.vy *= -1;
                }

                particle.element.setAttribute("cx", particle.x);
                particle.element.setAttribute("cy", particle.y);
            });

            const condensateRatio = particles.filter(particle => particle.inCondensate).length / particles.length;
            const cloudRadius = 60 * condensateRatio;
            const cloudOpacity = condensateRatio;

            condensateCloud.setAttribute("r", cloudRadius);
            condensateCloud.setAttribute("opacity", cloudOpacity);

            if (condensateRatio > 0.8) {
                stateText.textContent = "Bose-Einstein Condensate";
                beExplanation.textContent = "At near absolute zero, the particles have merged into a single quantum state - a Bose-Einstein condensate. Individual identities have disappeared, showing how at a fundamental level, distinct entities merge into a unified whole. This exemplifies the Madhyamaka view that individual existence is merely conventional, not ultimate.";
            } else if (condensateRatio > 0.3) {
                stateText.textContent = "Partial Condensate Forming";
                beExplanation.textContent = "As the temperature drops, particles begin to lose their individual behavior and merge into a collective quantum state. This transition illustrates the Madhyamaka concept that conventional distinct identities give way to reveal their lack of inherent existence.";
            } else {
                stateText.textContent = "Normal Gas State";
                beExplanation.textContent = "In a Bose-Einstein condensate, particles cooled to near absolute zero merge into a single quantum state, losing their individual identities. This mirrors the Madhyamaka concept that individual entities lack inherent existence and are ultimately indistinguishable within the fabric of interdependence.";
            }
        }

        function coolSystem() {
            if (temperature > 0) {
                temperature = Math.max(0, temperature - 10);
                updateTemperatureVisual();
            }
        }

        function heatSystem() {
            if (temperature < 100) {
                temperature = Math.min(100, temperature + 10);
                updateTemperatureVisual();
            }
        }

        function updateTemperatureVisual() {
            if (!tempLevel) return; // Add guard clause to prevent null reference
            
            const height = 190 * temperature / 100;
            const y = 245 - height;

            gsap.to(tempLevel, {
                height: height,
                y: y,
                duration: 0.5
            });

            const r = 229 - (temperature < 50 ? (50 - temperature) * 3 : 0);
            const g = 115 - (temperature < 50 ? (50 - temperature) * 0.7 : 0);
            const b = 115 + (temperature < 50 ? (50 - temperature) * 2.8 : 0);

            tempLevel.setAttribute("fill", `rgb(${r},${g},${b})`);
        }
        
        createParticles();
        updateTemperatureVisual();
        updateParticles();

        document.getElementById('cool-btn').addEventListener('click', coolSystem);
        document.getElementById('heat-btn').addEventListener('click', heatSystem);

        this.addTooltip(document.getElementById('cool-btn'), "Cool the system toward absolute zero");
        this.addTooltip(document.getElementById('heat-btn'), "Heat the system to increase particle motion");
    }

    setupDecoherenceInteraction() {
        const container = document.createElement('div');
        container.className = 'decoherence-container';
        container.innerHTML = `
            <div class="dc-header">
                <h3>Quantum Decoherence</h3>
                <p>How quantum systems transition to classical behavior</p>
            </div>

            <div class="dc-visualization">
                <svg viewBox="0 0 500 300" width="100%" height="100%">
                    <defs>
                        <radialGradient id="quantumGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                            <stop offset="0%" stop-color="#64b5f6" stop-opacity="0.8"/>
                            <stop offset="100%" stop-color="#64b5f6" stop-opacity="0"/>
                        </radialGradient>
                        <filter id="blurEffect">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
                            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                        </filter>
                    </defs>

                    <!-- Environment container -->
                    <rect x="50" y="50" width="400" height="200" rx="5" fill="#111" stroke="#333" stroke-width="2"/>

                    <!-- Environment particles -->
                    <g id="environment-particles"></g>

                    <!-- Central quantum system -->
                    <g id="quantum-system">
                        <circle id="quantum-wave" cx="250" cy="150" r="30" fill="url(#quantumGlow)" filter="url(#blurEffect)"/>
                        <circle id="quantum-particle" cx="250" cy="150" r="6" fill="#64b5f6"/>
                    </g>

                    <!-- Isolation shield -->
                    <circle id="isolation-shield" cx="250" cy="150" r="60" fill="none" stroke="#81c784" stroke-width="2" stroke-dasharray="5,5" opacity="0"/>

                    <!-- Controls -->
                    <g id="dc-controls">
                        <rect x="70" y="260" width="160" height="30" rx="5" fill="#333" class="interactive-element" id="isolate-btn"/>
                        <text x="150" y="280" text-anchor="middle" fill="white" font-size="14">Isolate System</text>

                        <rect x="270" y="260" width="160" height="30" rx="5" fill="#333" class="interactive-element" id="interact-btn"/>
                        <text x="350" y="280" text-anchor="middle" fill="white" font-size="14">Environment Interaction</text>
                    </g>

                    <!-- Information display -->
                    <g id="dc-info">
                        <rect x="70" y="10" width="360" height="30" rx="5" fill="rgba(0,0,0,0.6)"/>
                        <text id="coherence-text" x="250" y="30" text-anchor="middle" fill="white" font-size="14">Quantum Coherence: 100%</text>
                    </g>
                </svg>
            </div>

            <div class="dc-explanation">
                <p id="dc-explanation">
                    Quantum decoherence explains how quantum systems lose their wave-like superposition behavior
                    through interactions with their environment, giving rise to the classical behaviors we observe.
                    This parallels the Madhyamaka concept of dependent origination, where phenomena arise through
                    complex interactions rather than from inherent properties.
                </p>
            </div>
        `;
        this.interactionContainer.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            .decoherence-container {
                display: flex;
                flex-direction: column;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 10px;
                padding: 20px;
                width: 100%;
                height: 100%;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .dc-header {
                text-align: center;
                margin-bottom: 10px;
            }

            .dc-header h3 {
                color: #64b5f6;
                margin-bottom: 5px;
            }

            .dc-visualization {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
            }

            .dc-explanation {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: 8px;
                font-size: 0.9rem;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);

        const environmentParticles = document.getElementById('environment-particles');
        const quantumWave = document.getElementById('quantum-wave');
        const quantumParticle = document.getElementById('quantum-particle');
        const isolationShield = document.getElementById('isolation-shield');
        const coherenceText = document.getElementById('coherence-text');
        const dcExplanation = document.getElementById('dc-explanation');

        let coherence = 100;
        let isIsolated = false;
        let envParticles = [];
        let animationId;

        function createEnvironmentParticles() {
            while (environmentParticles.firstChild) {
                environmentParticles.removeChild(environmentParticles.firstChild);
            }
            envParticles = [];

            const numParticles = 30;

            for (let i = 0; i < numParticles; i++) {
                const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                particle.setAttribute("cx", Math.random() * 400 + 50);
                particle.setAttribute("cy", Math.random() * 150 + 50);
                particle.setAttribute("r", 3);
                particle.setAttribute("fill", "#ffb74d");

                environmentParticles.appendChild(particle);

                envParticles.push({
                    element: particle,
                    x: parseFloat(particle.getAttribute("cx")),
                    y: parseFloat(particle.getAttribute("cy")),
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    interacting: false
                });
            }
        }

        function updateSystem() {
            envParticles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 50) {
                    particle.x = 50;
                    particle.vx *= -1;
                } else if (particle.x > 450) {
                    particle.x = 450;
                    particle.vx *= -1;
                }

                if (particle.y < 50) {
                    particle.y = 50;
                    particle.vy *= -1;
                } else if (particle.y > 250) {
                    particle.y = 250;
                    particle.vy *= -1;
                }

                particle.element.setAttribute("cx", particle.x);
                particle.element.setAttribute("cy", particle.y);

                const distance = Math.sqrt((particle.x - 250) ** 2 + (particle.y - 150) ** 2);

                if (distance < 60 && !isIsolated) {
                    particle.interacting = true;
                    particle.element.setAttribute("fill", "#81c784");

                    coherence -= 0.5;
                    updateCoherenceDisplay();
                } else {
                    if (particle.interacting) {
                        particle.interacting = false;
                        particle.element.setAttribute("fill", "#ffb74d");
                    }
                }
            });

            if (!isIsolated) {
                quantumWave.setAttribute("r", 10 + coherence / 5);
                quantumWave.setAttribute("opacity", 0.1 + coherence / 100);
            } else {
                quantumWave.setAttribute("r", 30);
                quantumWave.setAttribute("opacity", 0.8);
            }

            animationId = requestAnimationFrame(updateSystem);
        }

        function updateCoherenceDisplay() {
            coherenceText.textContent = `Quantum Coherence: ${Math.round(coherence)}%`;

            if (coherence > 80) {
                dcExplanation.textContent = "The system maintains quantum coherence, existing in a superposition of states. In Madhyamaka terms, it lacks a definite, inherent nature - its properties are not fixed but exist as potentialities.";
            } else if (coherence > 40) {
                dcExplanation.textContent = "Partial decoherence is occurring as the quantum system interacts with its environment. This illustrates how, in Madhyamaka philosophy, phenomena emerge through dependent origination - they manifest through relationships rather than from inherent existence.";
            } else {
                dcExplanation.textContent = "The quantum system has decohered, transitioning to classical-like behavior through environmental interaction. This demonstrates the Madhyamaka principle that what we perceive as definite reality emerges from a complex web of conditions and relationships.";
            }
        }

        function isolateSystem() {
            isIsolated = true;

            gsap.to(isolationShield, {
                opacity: 0.7,
                duration: 0.5
            });

            envParticles.forEach(particle => {
                const distance = Math.sqrt((particle.x - 250) ** 2 + (particle.y - 150) ** 2);

                if (distance < 70) {
                    const targetX = 250 + Math.cos(Math.atan2(particle.y - 150, particle.x - 250)) * 80;
                    const targetY = 150 + Math.sin(Math.atan2(particle.y - 150, particle.x - 250)) * 80;

                    gsap.to(particle, {
                        x: targetX,
                        y: targetY,
                        duration: 0.5,
                        onUpdate: () => {
                            particle.element.setAttribute("cx", particle.x);
                            particle.element.setAttribute("cy", particle.y);
                        }
                    });
                }
            });
        }

        function allowInteraction() {
            isIsolated = false;

            gsap.to(isolationShield, {
                opacity: 0,
                duration: 0.5
            });
        }

        createEnvironmentParticles();
        updateSystem();

        document.getElementById('isolate-btn').addEventListener('click', isolateSystem);
        document.getElementById('interact-btn').addEventListener('click', allowInteraction);

        this.addTooltip(document.getElementById('isolate-btn'), "Isolate the quantum system from its environment");
        this.addTooltip(document.getElementById('interact-btn'), "Allow interaction with the environment");
    }

    setupQuantumGravityInteraction() {
        const container = document.createElement('div');
        container.className = 'quantum-gravity-container';
        container.innerHTML = `
            <div class="qg-header">
                <h3>Quantum Gravity</h3>
                <p>Beyond conventional frameworks: unifying quantum mechanics and general relativity</p>
            </div>

            <div class="qg-visualization">
                <svg viewBox="0 0 500 300" width="100%" height="100%">
                    <defs>
                        <radialGradient id="spaceGradient" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                            <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
                            <stop offset="70%" stop-color="#191970" stop-opacity="0.3"/>
                            <stop offset="100%" stop-color="#483D8B" stop-opacity="0.5"/>
                        </radialGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="blur"/>
                            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                        </filter>
                    </defs>

                    <!-- Space-time background -->
                    <rect x="0" y="0" width="500" height="300" fill="url(#spaceGradient)"/>

                    <!-- Space-time grid -->
                    <g id="spacetime-grid"></g>

                    <!-- Massive object -->
                    <circle id="massive-object" cx="250" cy="150" r="20" fill="#ffb74d" filter="url(#glow)"/>

                    <!-- Quantum particles -->
                    <g id="quantum-particles"></g>

                    <!-- Framework controls -->
                    <g id="framework-controls">
                        <rect x="50" y="260" width="110" height="30" rx="5" fill="#333" class="interactive-element" id="quantum-btn"/>
                        <text x="105" y="280" text-anchor="middle" fill="white" font-size="12">Quantum View</text>

                        <rect x="170" y="260" width="110" height="30" rx="5" fill="#333" class="interactive-element" id="relativity-btn"/>
                        <text x="225" y="280" text-anchor="middle" fill="white" font-size="12">Relativity View</text>

                        <rect x="290" y="260" width="160" height="30" rx="5" fill="#333" class="interactive-element" id="unified-btn"/>
                        <text x="370" y="280" text-anchor="middle" fill="white" font-size="12">Beyond Frameworks</text>
                    </g>

                    <!-- View indicator -->
                    <g id="view-indicator">
                        <rect x="150" y="10" width="200" height="30" rx="5" fill="rgba(0,0,0,0.6)"/>
                        <text id="framework-text" x="250" y="30" text-anchor="middle" fill="white" font-size="14">Standard Framework</text>
                    </g>
                </svg>
            </div>

            <div class="qg-explanation">
                <p id="qg-explanation">
                    Quantum gravity seeks to reconcile quantum mechanics with general relativity - two frameworks 
                    that use different conceptual languages to describe reality. This parallels Madhyamaka's 
                    transcendence of conceptual frameworks, pointing to an ultimate reality beyond conventional 
                    designations and language.
                </p>
            </div>
        `;
        this.interactionContainer.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            .quantum-gravity-container {
                display: flex;
                flex-direction: column;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 10px;
                padding: 20px;
                width: 100%;
                height: 100%;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .qg-header {
                text-align: center;
                margin-bottom: 10px;
            }

            .qg-header h3 {
                color: #64b5f6;
                margin-bottom: 5px;
            }

            .qg-visualization {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
            }

            .qg-explanation {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: 8px;
                font-size: 0.9rem;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);

        const spacetimeGrid = document.getElementById('spacetime-grid');
        const massiveObject = document.getElementById('massive-object');
        const quantumParticles = document.getElementById('quantum-particles');
        const frameworkText = document.getElementById('framework-text');
        const qgExplanation = document.getElementById('qg-explanation');

        let currentView = 'standard';
        let particles = [];
        let gridPoints = [];
        let animationId;

        function createSpacetimeGrid() {
            while (spacetimeGrid.firstChild) {
                spacetimeGrid.removeChild(spacetimeGrid.firstChild);
            }
            gridPoints = [];

            for (let x = 50; x <= 450; x += 40) {
                for (let y = 50; y <= 250; y += 40) {
                    const gridPoint = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    gridPoint.setAttribute("cx", x);
                    gridPoint.setAttribute("cy", y);
                    gridPoint.setAttribute("r", 1);
                    gridPoint.setAttribute("fill", "#aaa");

                    spacetimeGrid.appendChild(gridPoint);

                    gridPoints.push({
                        element: gridPoint,
                        x: x,
                        y: y,
                        baseX: x,
                        baseY: y,
                        distorted: false
                    });
                }
            }
        }

        function updateSystem() {
            const time = Date.now() / 1000;

            switch (currentView) {
                case 'quantum':
                    particles.forEach(particle => {
                        particle.waveMode = true;

                        const radius = 10;
                        const frequency = 2;

                        particle.x = particle.waveCenterX + radius * Math.cos(particle.phase + time * frequency);
                        particle.y = particle.waveCenterY + radius * Math.sin(particle.phase + time * frequency);

                        particle.element.setAttribute("cx", particle.x);
                        particle.element.setAttribute("cy", particle.y);
                        particle.element.setAttribute("r", 3);
                        particle.element.setAttribute("fill", "#64b5f6");
                        particle.element.setAttribute("opacity", 0.7 + 0.3 * Math.sin(time * 3 + particle.phase));
                    });

                    gridPoints.forEach(point => {
                        point.x = point.baseX;
                        point.y = point.baseY;
                        point.element.setAttribute("cx", point.x);
                        point.element.setAttribute("cy", point.y);
                        point.element.setAttribute("r", 1);
                    });

                    massiveObject.setAttribute("r", 20);
                    break;
                case 'relativity':
                    particles.forEach(particle => {
                        particle.waveMode = false;

                        const force = 50 / ((particle.x - 250) ** 2 + (particle.y - 150) ** 2);
                        const angle = Math.atan2(particle.y - 150, particle.x - 250);

                        particle.vx -= Math.cos(angle) * force;
                        particle.vy -= Math.sin(angle) * force;

                        particle.x += particle.vx;
                        particle.y += particle.vy;

                        if (particle.x < 50) {
                            particle.x = 50;
                            particle.vx *= -0.8;
                        } else if (particle.x > 450) {
                            particle.x = 450;
                            particle.vx *= -0.8;
                        }

                        if (particle.y < 50) {
                            particle.y = 50;
                            particle.vy *= -0.8;
                        } else if (particle.y > 250) {
                            particle.y = 250;
                            particle.vy *= -0.8;
                        }

                        particle.vx *= 0.99;
                        particle.vy *= 0.99;

                        particle.element.setAttribute("cx", particle.x);
                        particle.element.setAttribute("cy", particle.y);
                        particle.element.setAttribute("r", 2);
                        particle.element.setAttribute("fill", "#81c784");
                        particle.element.setAttribute("opacity", 1);
                    });

                    gridPoints.forEach(point => {
                        const dx = point.baseX - 250;
                        const dy = point.baseY - 150;
                        const distSq = dx ** 2 + dy ** 2;
                        const dist = Math.sqrt(distSq);

                        if (dist > 0) {
                            const displacement = 800 / distSq;
                            const maxDisplacement = 15;
                            const actualDisplacement = Math.min(displacement, maxDisplacement);
                            const angle = Math.atan2(dy, dx);

                            point.x = point.baseX - Math.cos(angle) * actualDisplacement;
                            point.y = point.baseY - Math.sin(angle) * actualDisplacement;
                            point.distorted = true;
                        }
                    });

                    massiveObject.setAttribute("r", 25);
                    break;
                case 'unified':
                    particles.forEach(particle => {
                        particle.waveMode = true;

                        const force = 25 / ((particle.x - 250) ** 2 + (particle.y - 150) ** 2);
                        const angle = Math.atan2(particle.y - 150, particle.x - 250);

                        particle.vx -= Math.cos(angle) * force;
                        particle.vy -= Math.sin(angle) * force;

                        particle.x += particle.vx;
                        particle.y += particle.vy;

                        particle.waveCenterX += particle.vx;
                        particle.waveCenterY += particle.vy;

                        const radius = 5 + 5 * Math.sqrt((particle.x - 250) ** 2 + (particle.y - 150) ** 2) / 100;
                        const frequency = 2 - Math.min(1.5, ((particle.x - 250) ** 2 + (particle.y - 150) ** 2) / 10000);

                        particle.x = particle.waveCenterX + radius * Math.cos(particle.phase + time * frequency);
                        particle.y = particle.waveCenterY + radius * Math.sin(particle.phase + time * frequency);

                        particle.element.setAttribute("cx", particle.x);
                        particle.element.setAttribute("cy", particle.y);
                        particle.element.setAttribute("r", 2);
                        particle.element.setAttribute("fill", "#9575cd");
                        particle.element.setAttribute("opacity", 0.7 + 0.3 * Math.sin(time * 3 + particle.phase));
                    });

                    gridPoints.forEach(point => {
                        const dx = point.baseX - 250;
                        const dy = point.baseY - 150;
                        const distSq = dx ** 2 + dy ** 2;
                        const dist = Math.sqrt(distSq);

                        if (dist > 0) {
                            const displacement = 400 / distSq;
                            const maxDisplacement = 10;
                            const actualDisplacement = Math.min(displacement, maxDisplacement);
                            const angle = Math.atan2(dy, dx);

                            point.x = point.baseX - Math.cos(angle) * actualDisplacement;
                            point.y = point.baseY - Math.sin(angle) * actualDisplacement;
                        }

                        point.x += Math.sin(time * 3 + point.baseX * 0.1) * (50 / (dist + 10));
                        point.y += Math.cos(time * 3 + point.baseY * 0.1) * (50 / (dist + 10));

                        point.element.setAttribute("cx", point.x);
                        point.element.setAttribute("cy", point.y);

                        const pointSize = 1 + Math.max(0, 5 - dist / 20);
                        point.element.setAttribute("r", pointSize);

                        if (dist < 60) {
                            point.element.setAttribute("fill", "#9c27b0");
                        } else {
                            point.element.setAttribute("fill", "#aaa");
                        }
                    });

                    massiveObject.setAttribute("r", 22 + Math.sin(time * 2) * 3);
                    break;
                default:
                    particles.forEach(particle => {
                        particle.waveMode = false;

                        particle.x += particle.vx;
                        particle.y += particle.vy;

                        if (particle.x < 50) {
                            particle.x = 50;
                            particle.vx *= -1;
                        } else if (particle.x > 450) {
                            particle.x = 450;
                            particle.vx *= -1;
                        }

                        if (particle.y < 50) {
                            particle.y = 50;
                            particle.vy *= -1;
                        } else if (particle.y > 250) {
                            particle.y = 250;
                            particle.vy *= -1;
                        }

                        particle.element.setAttribute("cx", particle.x);
                        particle.element.setAttribute("cy", particle.y);
                        particle.element.setAttribute("r", 3);
                        particle.element.setAttribute("fill", "#64b5f6");
                        particle.element.setAttribute("opacity", 1);
                    });

                    gridPoints.forEach(point => {
                        point.x = point.baseX;
                        point.y = point.baseY;
                        point.element.setAttribute("cx", point.x);
                        point.element.setAttribute("cy", point.y);
                        point.element.setAttribute("r", 1);
                    });

                    massiveObject.setAttribute("r", 20);
                    break;
            }

            animationId = requestAnimationFrame(updateSystem);
        }

        function showQuantumView() {
            currentView = 'quantum';
            frameworkText.textContent = 'Quantum Framework';
            qgExplanation.textContent = 'In the quantum framework, particles behave as probability waves rather than definite objects. This parallels the Madhyamaka view that phenomena lack inherent existence and fixed characteristics.';
        }

        function showRelativityView() {
            currentView = 'relativity';
            frameworkText.textContent = 'Relativity Framework';
            qgExplanation.textContent = 'General relativity describes gravity as spacetime curvature. Like Madhyamaka\'s focus on relationships rather than inherent properties, relativity shows how mass and energy relate to the fabric of spacetime itself.';
        }

        function showUnifiedView() {
            currentView = 'unified';
            frameworkText.textContent = 'Beyond Conventional Frameworks';
            qgExplanation.textContent = 'Quantum gravity requires transcending both quantum mechanics and general relativity. Similarly, Madhyamaka\'s ultimate truth transcends conventional frameworks, pointing to a reality beyond conceptual designations and language.';
        }

        createSpacetimeGrid();
        updateSystem();

        document.getElementById('quantum-btn').addEventListener('click', showQuantumView);
        document.getElementById('relativity-btn').addEventListener('click', showRelativityView);
        document.getElementById('unified-btn').addEventListener('click', showUnifiedView);

        this.addTooltip(document.getElementById('quantum-btn'), "View through quantum mechanical framework");
        this.addTooltip(document.getElementById('relativity-btn'), "View through general relativity framework");
        this.addTooltip(document.getElementById('unified-btn'), "View beyond conventional frameworks");
    }

    setupComplementarityInteraction() {
        const container = document.createElement('div');
        container.className = 'complementarity-container';
        container.innerHTML = `
            <div class="cp-header">
                <h3>Wave-Particle Complementarity</h3>
                <p>Exploring the Middle Way between opposing descriptions</p>
            </div>

            <div class="cp-visualization">
                <svg viewBox="0 0 500 300" width="100%" height="100%">
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#64b5f6" stop-opacity="0.8"/>
                            <stop offset="100%" stop-color="#64b5f6" stop-opacity="0"/>
                        </linearGradient>
                        <filter id="glowFilter">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
                            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                        </filter>
                    </defs>

                    <!-- Experiment background -->
                    <rect x="50" y="50" width="400" height="200" rx="5" fill="#111" stroke="#333" stroke-width="2"/>

                    <!-- Source -->
                    <circle id="source" cx="80" cy="150" r="10" fill="#ffb74d" class="interactive-element"/>
                    <text x="80" y="180" text-anchor="middle" fill="white" font-size="12">Source</text>

                    <!-- Screen with slits -->
                    <rect x="200" y="80" width="10" height="140" fill="#333"/>
                    <rect id="upper-slit" x="200" y="100" width="10" height="30" fill="#111"/>
                    <rect id="lower-slit" x="200" y="170" width="10" height="30" fill="#111"/>

                    <!-- Detector screen -->
                    <rect x="410" y="80" width="10" height="140" fill="#81c784"/>
                    <text x="410" y="70" text-anchor="middle" fill="white" font-size="12">Detector</text>

                    <!-- Control panel -->
                    <g id="controls">
                        <rect x="50" y="260" width="110" height="30" rx="5" fill="#333" class="interactive-element" id="wave-mode"/>
                        <text x="105" y="280" text-anchor="middle" fill="white" font-size="14">Wave View</text>

                        <rect x="170" y="260" width="110" height="30" rx="5" fill="#333" class="interactive-element" id="particle-mode"/>
                        <text x="225" y="280" text-anchor="middle" fill="white" font-size="14">Particle View</text>

                        <rect x="290" y="260" width="160" height="30" rx="5" fill="#333" class="interactive-element" id="observer-mode"/>
                        <text x="370" y="280" text-anchor="middle" fill="white" font-size="14">Add Observer</text>
                    </g>

                    <!-- View indicator -->
                    <g id="view-indicator">
                        <rect x="150" y="10" width="200" height="30" rx="5" fill="rgba(0,0,0,0.6)"/>
                        <text id="view-text" x="250" y="30" text-anchor="middle" fill="white" font-size="14">Select a View</text>
                    </g>

                    <!-- Visualization elements - dynamically managed -->
                    <g id="wave-elements"></g>
                    <g id="particle-elements"></g>
                    <g id="detector-elements"></g>
                    <g id="observer-elements"></g>
                </svg>
            </div>

            <div class="cp-explanation">
                <p id="cp-explanation">
                    Wave-particle complementarity in quantum mechanics demonstrates that light and matter can be 
                    described as either waves or particles, depending on the experimental setup. This parallel's 
                    Madhyamaka's Middle Way, which avoids the extremes of eternalism (inherent existence) and 
                    nihilism (non-existence).
                </p>
            </div>
        `;
        this.interactionContainer.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            .complementarity-container {
                display: flex;
                flex-direction: column;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 10px;
                padding: 20px;
                width: 100%;
                height: 100%;
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .cp-header {
                text-align: center;
                margin-bottom: 10px;
            }

            .cp-header h3 {
                color: #64b5f6;
                margin-bottom: 5px;
            }

            .cp-visualization {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
            }

            .cp-explanation {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: 8px;
                font-size: 0.9rem;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);

        const source = document.getElementById('source');
        const waveElements = document.getElementById('wave-elements');
        const particleElements = document.getElementById('particle-elements');
        const detectorElements = document.getElementById('detector-elements');
        const observerElements = document.getElementById('observer-elements');
        const viewText = document.getElementById('view-text');
        const cpExplanation = document.getElementById('cp-explanation');

        let currentMode = null;
        let hasObserver = false;
        let animationId;
        let particleInFlight = false;

        function clearVisualizations() {
            while (waveElements.firstChild) waveElements.removeChild(waveElements.firstChild);
            while (particleElements.firstChild) particleElements.removeChild(particleElements.firstChild);
            while (detectorElements.firstChild) detectorElements.removeChild(detectorElements.firstChild);
            while (observerElements.firstChild) observerElements.removeChild(observerElements.firstChild);
        }

        function setupWaveMode() {
            currentMode = 'wave';
            hasObserver = false;
            clearVisualizations();

            viewText.textContent = 'Wave View';

            const createWaves = () => {
                while (waveElements.firstChild) waveElements.removeChild(waveElements.firstChild);

                for (let radius = 5; radius <= 120; radius += 20) {
                    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    circle.setAttribute("cx", "80");
                    circle.setAttribute("cy", "150");
                    circle.setAttribute("r", radius);
                    circle.setAttribute("fill", "none");
                    circle.setAttribute("stroke", "#64b5f6");
                    circle.setAttribute("stroke-width", 1);
                    circle.setAttribute("stroke-opacity", 1 - radius / 120);
                    waveElements.appendChild(circle);
                }

                const upperWave1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
                upperWave1.setAttribute("d", "M 205 115 C 240 100, 275 90, 410 115");
                upperWave1.setAttribute("fill", "none");
                upperWave1.setAttribute("stroke", "#64b5f6");
                upperWave1.setAttribute("stroke-width", 1);
                upperWave1.setAttribute("stroke-opacity", 0.7);
                waveElements.appendChild(upperWave1);

                const upperWave2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
                upperWave2.setAttribute("d", "M 205 115 C 240 130, 275 140, 410 115");
                upperWave2.setAttribute("fill", "none");
                upperWave2.setAttribute("stroke", "#64b5f6");
                upperWave2.setAttribute("stroke-width", 1);
                upperWave2.setAttribute("stroke-opacity", 0.7);
                waveElements.appendChild(upperWave2);

                const lowerWave1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
                lowerWave1.setAttribute("d", "M 205 185 C 240 170, 275 160, 410 185");
                lowerWave1.setAttribute("fill", "none");
                lowerWave1.setAttribute("stroke", "#64b5f6");
                lowerWave1.setAttribute("stroke-width", 1);
                lowerWave1.setAttribute("stroke-opacity", 0.7);
                waveElements.appendChild(lowerWave1);

                const lowerWave2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
                lowerWave2.setAttribute("d", "M 205 185 C 240 200, 275 210, 410 185");
                lowerWave2.setAttribute("fill", "none");
                lowerWave2.setAttribute("stroke", "#64b5f6");
                lowerWave2.setAttribute("stroke-width", 1);
                lowerWave2.setAttribute("stroke-opacity", 0.7);
                waveElements.appendChild(lowerWave2);

                for (let i = 0; i < 7; i++) {
                    const y = 90 + i * 20;
                    const intensity = Math.abs(Math.sin(i * 1.2));

                    const band = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    band.setAttribute("x", "410");
                    band.setAttribute("y", y);
                    band.setAttribute("width", "10");
                    band.setAttribute("height", "10");
                    band.setAttribute("fill", "#64b5f6");
                    band.setAttribute("opacity", intensity);
                    detectorElements.appendChild(band);
                }
            };

            createWaves();

            const animateWaves = () => {
                const phase = Date.now() / 1000;

                waveElements.querySelectorAll("circle").forEach((circle, index) => {
                    const radius = 5 + index * 20 + 5 * Math.sin(phase + index * 0.5);
                    circle.setAttribute("r", radius);
                    circle.setAttribute("stroke-opacity", 1 - radius / 120);
                });

                detectorElements.querySelectorAll("rect").forEach((band, index) => {
                    const intensity = Math.abs(Math.sin(index * 1.2 + phase * 0.3));
                    band.setAttribute("opacity", intensity);
                });

                animationId = requestAnimationFrame(animateWaves);
            };

            animateWaves();

            cpExplanation.textContent = "In the wave view, quantum entities behave as waves, creating interference patterns when passing through slits. This represents one aspect of reality, similar to Madhyamaka's conventional truth that acknowledges the appearance of phenomena.";
        }

        function setupParticleMode() {
            currentMode = 'particle';
            hasObserver = false;
            clearVisualizations();

            viewText.textContent = 'Particle View';

            for (let i = 0; i < 20; i++) {
                const y = 85 + Math.random() * 130;

                const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                dot.setAttribute("cx", "415");
                dot.setAttribute("cy", y);
                dot.setAttribute("r", 2);
                dot.setAttribute("fill", "#81c784");
                dot.setAttribute("opacity", 0.7);
                detectorElements.appendChild(dot);
            }

            cpExplanation.textContent = "In the particle view, quantum entities appear as discrete particles with definite positions. This represents another aspect of reality, comparable to another facet of Madhyamaka's conventional truth.";
        }

        function setupObserverMode() {
            hasObserver = true;

            const upperObserver = document.createElementNS("http://www.w3.org/2000/svg", "text");
            upperObserver.setAttribute("x", "220");
            upperObserver.setAttribute("y", "115");
            upperObserver.setAttribute("fill", "#ffb74d");
            upperObserver.setAttribute("font-size", "14");
            upperObserver.textContent = "👁️";
            observerElements.appendChild(upperObserver);

            const lowerObserver = document.createElementNS("http://www.w3.org/2000/svg", "text");
            lowerObserver.setAttribute("x", "220");
            lowerObserver.setAttribute("y", "185");
            lowerObserver.setAttribute("fill", "#ffb74d");
            lowerObserver.setAttribute("font-size", "14");
            lowerObserver.textContent = "👁️";
            observerElements.appendChild(lowerObserver);

            while (detectorElements.firstChild) detectorElements.removeChild(detectorElements.firstChild);

            if (currentMode === 'wave') {
                viewText.textContent = 'Wave + Observer';

                for (let i = 0; i < 20; i++) {
                    const y = 85 + Math.random() * 130;

                    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    dot.setAttribute("cx", "415");
                    dot.setAttribute("cy", y);
                    dot.setAttribute("r", 2);
                    dot.setAttribute("fill", "#81c784");
                    dot.setAttribute("opacity", 0.7);
                    detectorElements.appendChild(dot);
                }

                cpExplanation.textContent = "Adding an observer causes the wave function to collapse, demonstrating complementarity. This parallels Madhyamaka's Middle Way - phenomena manifest differently depending on conditions, without requiring either inherent existence or complete non-existence.";
            }
        }

        function emitParticle() {
            if (particleInFlight) return;

            particleInFlight = true;

            const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            particle.setAttribute("cx", "80");
            particle.setAttribute("cy", "150");
            particle.setAttribute("r", "4");
            particle.setAttribute("fill", "#64b5f6");
            particle.setAttribute("filter", "url(#glowFilter)");
            particleElements.appendChild(particle);

            const slitIndex = hasObserver ? Math.round(Math.random()) : -1;
            const path = hasObserver ?
                [
                    { x: 80, y: 150 },
                    { x: 205, y: slitIndex === 0 ? 100 : 210 },
                    { x: 415, y: 50 + Math.floor(Math.random() * 200) }
                ] :
                [
                    { x: 80, y: 150 },
                    { x: 205, y: Math.random() > 0.5 ? 100 : 210 },
                    { x: 415, y: 70 + Math.floor(Math.random() * 9) * 18 + 5 }
                ];

            gsap.to(particle, {
                cx: path[1].x,
                cy: path[1].y,
                duration: 1,
                ease: "power1.inOut",
                onComplete: () => {
                    gsap.to(particle, {
                        cx: path[2].x,
                        cy: path[2].y,
                        duration: 1,
                        ease: "power1.inOut",
                        onComplete: () => {
                            const impact = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                            impact.setAttribute("cx", path[2].x + 5);
                            impact.setAttribute("cy", path[2].y);
                            impact.setAttribute("r", "3");
                            impact.setAttribute("fill", "#81c784");
                            detectorElements.appendChild(impact);

                            particleElements.removeChild(particle);

                            setTimeout(() => {
                                if (detectorElements.contains(impact)) {
                                    detectorElements.removeChild(impact);
                                }
                            }, 100);

                            gsap.to(impact, {
                                opacity: 0,
                                duration: 3,
                                delay: 1,
                                onComplete: () => {
                                    if (detectorElements.contains(impact)) {
                                        detectorElements.removeChild(impact);
                                    }
                                    particleInFlight = false;
                                }
                            });
                        }
                    });
                }
            });
        }

        document.getElementById('wave-mode').addEventListener('click', setupWaveMode);
        document.getElementById('particle-mode').addEventListener('click', setupParticleMode);
        document.getElementById('observer-mode').addEventListener('click', setupObserverMode);
        source.addEventListener('click', () => {
            if (currentMode === 'particle' && !particleInFlight) {
                emitParticle();
            }
        });

        this.addTooltip(document.getElementById('wave-mode'), "Switch to wave view");
        this.addTooltip(document.getElementById('particle-mode'), "Switch to particle view");
        this.addTooltip(document.getElementById('observer-mode'), "Add an observer at the slits");
        this.addTooltip(source, "Click to emit a particle");
    }

    setupMobileControls() {
        const toggleControlsBtn = document.createElement('button');
        toggleControlsBtn.id = 'toggle-controls-btn';
        toggleControlsBtn.className = 'mobile-control-btn';
        toggleControlsBtn.innerHTML = '⚙️';
        toggleControlsBtn.style.display = this.isMobile ? 'block' : 'none';
        document.body.appendChild(toggleControlsBtn);

        const toggleExplanationBtn = document.createElement('button');
        toggleExplanationBtn.id = 'toggle-explanation-btn';
        toggleExplanationBtn.className = 'mobile-control-btn explanation-btn';
        toggleExplanationBtn.innerHTML = 'ℹ️';
        toggleExplanationBtn.style.display = this.isMobile ? 'block' : 'none';
        document.body.appendChild(toggleExplanationBtn);

        toggleControlsBtn.addEventListener('click', () => this.toggleControlsPanel());
        toggleExplanationBtn.addEventListener('click', () => this.toggleExplanationPanel());

        const style = document.createElement('style');
        style.textContent = `
            .mobile-control-btn {
                position: fixed;
                width: 50px;
                height: 50px;
                border-radius: 25px;
                background: rgba(0, 0, 0, 0.6);
                border: 2px solid rgba(255, 255, 255, 0.3);
                color: white;
                font-size: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                z-index: 1000;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            }

            #toggle-controls-btn {
                bottom: 20px;
                right: 20px;
            }

            #toggle-explanation-btn {
                bottom: 20px;
                left: 20px;
            }

            @media (max-width: 768px) {
                .controls-hidden #navigation {
                    transform: translateY(-100px);
                }

                .explanation-hidden #info-panel {
                    transform: translateY(100%);
                }

                #info-panel, #navigation {
                    transition: transform 0.3s ease;
                }
            }
        `;
        document.head.appendChild(style);

        if (this.isMobile) {
            document.body.classList.add('explanation-hidden');
            this.isExplanationVisible = false;
        }
    }

    toggleControlsPanel() {
        document.body.classList.toggle('controls-hidden');
        this.isControlsPanelVisible = !document.body.classList.contains('controls-hidden');
    }

    toggleExplanationPanel() {
        document.body.classList.toggle('explanation-hidden');
        this.isExplanationVisible = !document.body.classList.contains('explanation-hidden');
    }

    addTooltip(element, text) {
        if (!element) return;
        
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = text;
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            
            gsap.to(tooltip, { opacity: 1, duration: 0.3 });
            
            element.addEventListener('mouseleave', () => {
                gsap.to(tooltip, { 
                    opacity: 0, 
                    duration: 0.3,
                    onComplete: () => tooltip.remove()
                });
            }, { once: true });
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);

        if (window.innerWidth < 768) {
            this.isMobile = true;
            document.getElementById('toggle-controls-btn').style.display = 'block';
            document.getElementById('toggle-explanation-btn').style.display = 'block';
        } else {
            this.isMobile = false;
            document.getElementById('toggle-controls-btn').style.display = 'none';
            document.getElementById('toggle-explanation-btn').style.display = 'none';
        }

        if (this.isMobile !== this.isMobile) {
            document.body.classList.remove('controls-hidden', 'explanation-hidden');
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = this.clock.getElapsedTime() * config.animationSpeed;

        if (this.particleSystem) {
            this.particleSystem.material.uniforms.time.value = time;

            this.particleSystem.rotation.y = time * 0.05;
            this.particleSystem.rotation.x = Math.sin(time * 0.025) * 0.2;
            this.particleSystem.rotation.z = Math.cos(time * 0.02) * 0.1;
        }

        this.controls.update();

        this.composer.render();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuantumMadhyamakaApp();
});
