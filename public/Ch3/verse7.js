import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { settings } from './config.js';

export function createVerse7Scene() {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(settings.backgroundColor);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 4, 8);
    camera.lookAt(0, 0, 0);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create kitchen counter
    const counterGeometry = new THREE.BoxGeometry(10, 0.5, 5);
    const counterMaterial = new THREE.MeshPhongMaterial({
        color: 0x8b4513
    });
    const counter = new THREE.Mesh(counterGeometry, counterMaterial);
    counter.position.y = -1;
    scene.add(counter);
    
    // Create mixer
    const mixerGroup = new THREE.Group();
    mixerGroup.position.set(0, 0, 0);
    scene.add(mixerGroup);
    
    // Mixer base
    const baseGeometry = new THREE.CylinderGeometry(1.2, 1.5, 1, 16);
    const baseMaterial = new THREE.MeshPhongMaterial({
        color: 0xd3d3d3
    });
    const mixerBase = new THREE.Mesh(baseGeometry, baseMaterial);
    mixerBase.position.y = -0.5;
    mixerGroup.add(mixerBase);
    
    // Mixer bowl
    const bowlGeometry = new THREE.CylinderGeometry(1, 1.2, 1.5, 32);
    const bowlMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7
    });
    const bowl = new THREE.Mesh(bowlGeometry, bowlMaterial);
    bowl.position.y = 0.5;
    mixerGroup.add(bowl);
    
    // Mixer head
    const headGeometry = new THREE.BoxGeometry(1.5, 0.8, 1);
    const headMaterial = new THREE.MeshPhongMaterial({
        color: 0xd3d3d3
    });
    const mixerHead = new THREE.Mesh(headGeometry, headMaterial);
    mixerHead.position.y = 2;
    mixerGroup.add(mixerHead);
    
    // Mixer shaft
    const shaftGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const shaftMaterial = new THREE.MeshPhongMaterial({
        color: 0xa9a9a9
    });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.position.y = 1.2;
    mixerGroup.add(shaft);
    
    // Mixer beaters
    const beaterGeometry = new THREE.TorusGeometry(0.3, 0.03, 8, 16);
    const beaterMaterial = new THREE.MeshPhongMaterial({
        color: 0xa9a9a9
    });
    
    const beater1 = new THREE.Mesh(beaterGeometry, beaterMaterial);
    beater1.position.y = 0.8;
    beater1.rotation.x = Math.PI / 2;
    shaft.add(beater1);
    
    const beater2 = new THREE.Mesh(beaterGeometry, beaterMaterial);
    beater2.position.y = 0.4;
    beater2.rotation.x = Math.PI / 2;
    shaft.add(beater2);
    
    const beater3 = new THREE.Mesh(beaterGeometry, beaterMaterial);
    beater3.position.y = 0;
    beater3.rotation.x = Math.PI / 2;
    shaft.add(beater3);
    
    // Create ingredients
    // Eye (flour)
    const flourGroup = new THREE.Group();
    flourGroup.position.set(-3, 0, 1);
    scene.add(flourGroup);
    
    const flourBagGeometry = new THREE.BoxGeometry(1.2, 1.8, 0.8);
    const flourBagMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });
    const flourBag = new THREE.Mesh(flourBagGeometry, flourBagMaterial);
    flourGroup.add(flourBag);
    
    // Eye symbol on flour bag
    const eyeShape = new THREE.Shape();
    eyeShape.ellipse(0, 0, 0.4, 0.25, 0, Math.PI * 2);
    
    const eyeHole = new THREE.Path();
    eyeHole.ellipse(0, 0, 0.15, 0.15, 0, Math.PI * 2);
    eyeShape.holes.push(eyeHole);
    
    const eyeGeometry = new THREE.ShapeGeometry(eyeShape);
    const eyeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide
    });
    
    const eyeSymbol = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eyeSymbol.position.set(0, 0.2, 0.41);
    flourBag.add(eyeSymbol);
    
    // Form (eggs)
    const eggGroup = new THREE.Group();
    eggGroup.position.set(3, 0, 1);
    scene.add(eggGroup);
    
    const createEgg = () => {
        const eggGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        eggGeometry.scale(1, 1.4, 1);
        const eggMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffcc
        });
        return new THREE.Mesh(eggGeometry, eggMaterial);
    };
    
    const egg1 = createEgg();
    egg1.position.set(-0.3, 0, 0);
    eggGroup.add(egg1);
    
    const egg2 = createEgg();
    egg2.position.set(0.3, 0, 0);
    eggGroup.add(egg2);
    
    // Create cake (consciousness) - initially hidden
    const cakeGroup = new THREE.Group();
    cakeGroup.position.set(0, 0, 0);
    cakeGroup.visible = false;
    scene.add(cakeGroup);
    
    const cakeBaseGeometry = new THREE.CylinderGeometry(1, 1, 0.8, 32);
    const cakeBaseMaterial = new THREE.MeshPhongMaterial({
        color: 0xf5deb3
    });
    const cakeBase = new THREE.Mesh(cakeBaseGeometry, cakeBaseMaterial);
    cakeGroup.add(cakeBase);
    
    const frostingGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 32);
    const frostingMaterial = new THREE.MeshPhongMaterial({
        color: 0xfffacd
    });
    const frosting = new THREE.Mesh(frostingGeometry, frostingMaterial);
    frosting.position.y = 0.45;
    cakeGroup.add(frosting);
    
    // Create cherry on top
    const cherryGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const cherryMaterial = new THREE.MeshPhongMaterial({
        color: settings.accentColor
    });
    const cherry = new THREE.Mesh(cherryGeometry, cherryMaterial);
    cherry.position.y = 0.6;
    cakeGroup.add(cherry);
    
    // Create mixer controls
    const controlsUI = document.createElement('div');
    controlsUI.style.position = 'absolute';
    controlsUI.style.bottom = '20px';
    controlsUI.style.left = '50%';
    controlsUI.style.transform = 'translateX(-50%)';
    controlsUI.style.display = 'flex';
    controlsUI.style.flexDirection = 'column';
    controlsUI.style.alignItems = 'center';
    controlsUI.style.padding = '10px';
    controlsUI.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    controlsUI.style.borderRadius = '10px';
    controlsUI.style.color = 'white';
    controlsUI.style.fontFamily = 'Montserrat, sans-serif';
    controlsUI.style.zIndex = '100';
    document.body.appendChild(controlsUI);
    
    const status = document.createElement('div');
    status.textContent = 'Add the ingredients to the mixer';
    status.style.marginBottom = '10px';
    status.style.fontSize = '16px';
    controlsUI.appendChild(status);
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    controlsUI.appendChild(buttonContainer);
    
    const addEyeButton = createButton('Add Eye (Flour)');
    const addFormButton = createButton('Add Form (Eggs)');
    const mixButton = createButton('Mix');
    mixButton.disabled = true;
    mixButton.style.opacity = '0.5';
    
    buttonContainer.appendChild(addEyeButton);
    buttonContainer.appendChild(addFormButton);
    buttonContainer.appendChild(mixButton);
    
    function createButton(text) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.padding = '8px 12px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.backgroundColor = '#3a1c71';
        button.style.color = 'white';
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Montserrat, sans-serif';
        return button;
    }
    
    // Mixing state
    let flourAdded = false;
    let eggsAdded = false;
    let isMixing = false;
    let mixingComplete = false;
    
    // Animation variables
    let flourParticles = [];
    let eggYolks = [];
    
    // Event listeners
    addEyeButton.addEventListener('click', () => {
        if (!flourAdded && !isMixing) {
            flourAdded = true;
            addEyeButton.disabled = true;
            addEyeButton.style.opacity = '0.5';
            
            // Create flour particles
            for (let i = 0; i < 50; i++) {
                const particle = new THREE.Mesh(
                    new THREE.SphereGeometry(0.05, 8, 8),
                    new THREE.MeshBasicMaterial({ color: 0xffffff })
                );
                
                // Position particles above the flour bag
                particle.position.set(
                    flourGroup.position.x + (Math.random() - 0.5) * 0.5,
                    flourGroup.position.y + 1 + Math.random() * 0.5,
                    flourGroup.position.z + (Math.random() - 0.5) * 0.5
                );
                
                particle.userData = {
                    velocity: new THREE.Vector3(
                        (Math.random() - 0.5) * 0.05,
                        -0.05 - Math.random() * 0.05,
                        (Math.random() - 0.5) * 0.05
                    ),
                    inBowl: false
                };
                
                scene.add(particle);
                flourParticles.push(particle);
            }
            
            status.textContent = 'Flour added! Now add the eggs.';
            updateMixButtonState();
        }
    });
    
    addFormButton.addEventListener('click', () => {
        if (!eggsAdded && !isMixing) {
            eggsAdded = true;
            addFormButton.disabled = true;
            addFormButton.style.opacity = '0.5';
            
            // Create egg yolks
            for (let i = 0; i < 2; i++) {
                const yolk = new THREE.Mesh(
                    new THREE.SphereGeometry(0.25, 16, 16),
                    new THREE.MeshBasicMaterial({ color: 0xffa500 })
                );
                
                // Position yolks above the eggs
                yolk.position.set(
                    eggGroup.position.x + (i === 0 ? -0.3 : 0.3),
                    eggGroup.position.y + 1,
                    eggGroup.position.z
                );
                
                yolk.userData = {
                    velocity: new THREE.Vector3(
                        (Math.random() - 0.5) * 0.05,
                        -0.05 - Math.random() * 0.05,
                        (Math.random() - 0.5) * 0.05
                    ),
                    inBowl: false
                };
                
                scene.add(yolk);
                eggYolks.push(yolk);
            }
            
            status.textContent = 'Eggs added! Ready to mix.';
            updateMixButtonState();
        }
    });
    
    mixButton.addEventListener('click', () => {
        if (flourAdded && eggsAdded && !isMixing && !mixingComplete) {
            isMixing = true;
            mixButton.disabled = true;
            mixButton.style.opacity = '0.5';
            status.textContent = 'Mixing ingredients...';
            
            // Start the mixing animation
            setTimeout(() => {
                isMixing = false;
                mixingComplete = true;
                status.textContent = 'Consciousness has arisen from eye and form!';
                
                // Remove particles and show cake
                flourParticles.forEach(particle => scene.remove(particle));
                eggYolks.forEach(yolk => scene.remove(yolk));
                flourParticles = [];
                eggYolks = [];
                
                cakeGroup.visible = true;
                cakeGroup.scale.set(0.1, 0.1, 0.1);
                
                // Animate cake appearance
                const cakeAppearAnimation = () => {
                    if (cakeGroup.scale.x < 1) {
                        cakeGroup.scale.x += 0.05;
                        cakeGroup.scale.y += 0.05;
                        cakeGroup.scale.z += 0.05;
                        requestAnimationFrame(cakeAppearAnimation);
                    }
                };
                cakeAppearAnimation();
                
            }, 5000); // 5 seconds of mixing
        }
    });
    
    function updateMixButtonState() {
        if (flourAdded && eggsAdded && !isMixing && !mixingComplete) {
            mixButton.disabled = false;
            mixButton.style.opacity = '1';
        }
    }
    
    // Animation variables
    let time = 0;
    let mixerSpeed = 0;
    
    function animate() {
        time += 0.01;
        
        // Animate ingredients falling
        if (flourAdded && !mixingComplete) {
            flourParticles.forEach(particle => {
                if (!particle.userData.inBowl) {
                    particle.position.add(particle.userData.velocity);
                    
                    // Check if particle is in the bowl
                    const distanceToBowlCenter = new THREE.Vector2(
                        particle.position.x,
                        particle.position.z
                    ).length();
                    
                    if (distanceToBowlCenter < 1 && particle.position.y < 0.5 && particle.position.y > -0.5) {
                        particle.userData.inBowl = true;
                        particle.userData.velocity.set(0, 0, 0);
                    }
                    
                    // Make particles fall faster
                    particle.userData.velocity.y -= 0.001;
                }
            });
        }
        
        if (eggsAdded && !mixingComplete) {
            eggYolks.forEach(yolk => {
                if (!yolk.userData.inBowl) {
                    yolk.position.add(yolk.userData.velocity);
                    
                    // Check if yolk is in the bowl
                    const distanceToBowlCenter = new THREE.Vector2(
                        yolk.position.x,
                        yolk.position.z
                    ).length();
                    
                    if (distanceToBowlCenter < 1 && yolk.position.y < 0.5 && yolk.position.y > -0.5) {
                        yolk.userData.inBowl = true;
                        yolk.userData.velocity.set(0, 0, 0);
                    }
                    
                    // Make yolks fall faster
                    yolk.userData.velocity.y -= 0.001;
                }
            });
        }
        
        // Animate mixer during mixing
        if (isMixing) {
            mixerSpeed = Math.min(mixerSpeed + 0.1, 1);
            shaft.rotation.y += 0.2 * mixerSpeed;
            
            // Animate particles during mixing
            const bowlCenter = new THREE.Vector3(0, 0, 0);
            
            flourParticles.forEach(particle => {
                if (particle.userData.inBowl) {
                    // Create swirling motion
                    const directionToBowlCenter = new THREE.Vector3().subVectors(bowlCenter, particle.position).normalize();
                    particle.position.x += Math.sin(time * 5 + particle.position.y) * 0.03;
                    particle.position.z += Math.cos(time * 5 + particle.position.x) * 0.03;
                    particle.position.y = Math.max(-0.4, particle.position.y - 0.01);
                }
            });
            
            eggYolks.forEach(yolk => {
                if (yolk.userData.inBowl) {
                    // Create swirling motion
                    yolk.position.x += Math.sin(time * 3 + yolk.position.y) * 0.05;
                    yolk.position.z += Math.cos(time * 3 + yolk.position.x) * 0.05;
                    yolk.position.y = Math.max(-0.4, yolk.position.y - 0.01);
                    
                    // Make yolks smaller as they mix
                    yolk.scale.multiplyScalar(0.995);
                }
            });
        } else if (mixerSpeed > 0) {
            mixerSpeed = Math.max(mixerSpeed - 0.05, 0);
            shaft.rotation.y += 0.2 * mixerSpeed;
        }
        
        // Animate cake after mixing is complete
        if (mixingComplete && cakeGroup.visible) {
            cakeGroup.rotation.y = time * 0.2;
            cherry.position.y = 0.6 + Math.sin(time * 3) * 0.05;
        }
        
        controls.update();
    }
    
    // Clean up function
    function cleanup() {
        document.body.removeChild(controlsUI);
    }
    
    return {
        scene,
        camera,
        renderer,
        controls,
        animate,
        cleanup
    };
}