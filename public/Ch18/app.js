import { config } from './config.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// DOM Elements
const verseSelector = document.getElementById('verse-selector');
const prevVerseBtn = document.getElementById('prev-verse');
const nextVerseBtn = document.getElementById('next-verse');
const allVerseContents = document.querySelectorAll('.verse-content');
const hideTextBtns = document.querySelectorAll('.hide-text');
const showTextBtns = document.querySelectorAll('.show-text');
const hidePanelBtns = document.querySelectorAll('.hide-panel');
const showPanelBtns = document.querySelectorAll('.show-panel');

// Side Panel Elements
const sidePanel = document.querySelector('.side-panel');
const panelToggle = document.querySelector('.panel-toggle');
const verseNavigation = document.getElementById('verse-nav');
const verseExplanationSection = document.getElementById('verse-explanation-section');
const verseExplanationContent = document.getElementById('verse-explanation-content');
const animationControlsSection = document.getElementById('animation-controls-section');
const animationControlsContent = document.getElementById('animation-controls-content');

// Current verse state
let currentVerse = 1;
let activeAnimationKey = null; // Keep track of the currently active animation

// Initialize animations objects
const animations = {}; // Simpler initialization, will be populated dynamically

// Initialize side panel
function initSidePanel() {
    // Create verse navigation buttons
    for (let i = 1; i <= 12; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.dataset.verse = i;
        button.addEventListener('click', () => {
            showVerse(i);
        });
        verseNavigation.appendChild(button);
    }
    
    // Set up panel toggle button
    panelToggle.addEventListener('click', () => {
        sidePanel.classList.toggle('collapsed');
        
        // Also toggle margin on verse content
        allVerseContents.forEach(content => {
            content.classList.toggle('panel-collapsed');
        });
    });
    
    // Set up collapsible sections
    const sections = document.querySelectorAll('.collapsible-section');
    sections.forEach(section => {
        const header = section.querySelector('.section-header');
        const content = section.querySelector('.section-content');
        const icon = header.querySelector('i');
        
        header.addEventListener('click', () => {
            content.classList.toggle('expanded');
            
            // Toggle icon
            if (content.classList.contains('expanded')) {
                icon.classList.remove('fa-chevron-right');
                icon.classList.add('fa-chevron-down');
            } else {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-right');
            }
        });
    });
    
    // Initial state - verse explanation expanded, animation controls collapsed
    verseExplanationContent.classList.add('expanded');
    verseExplanationSection.querySelector('i').classList.add('fa-chevron-down');
    
    animationControlsContent.classList.remove('expanded');
    animationControlsSection.querySelector('i').classList.remove('fa-chevron-down');
    animationControlsSection.querySelector('i').classList.add('fa-chevron-right');
    
    // Set mobile defaults
    if (window.innerWidth < 768) {
        verseExplanationContent.classList.remove('expanded');
        verseExplanationSection.querySelector('i').classList.remove('fa-chevron-down');
        verseExplanationSection.querySelector('i').classList.add('fa-chevron-right');
    }
    
    // Update active verse button
    updateActiveVerseButton(currentVerse);
}

// Function to update active verse button
function updateActiveVerseButton(verseNum) {
    const buttons = verseNavigation.querySelectorAll('button');
    buttons.forEach(button => {
        if (parseInt(button.dataset.verse) === verseNum) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Function to update verse explanation content
function updateVerseExplanation(verseNum) {
    // Get content from original verse div
    const verseContent = document.getElementById(`verse${verseNum}`);
    const verseText = verseContent.querySelector('.verse-text p').textContent;
    const madhyamakaConcept = verseContent.querySelector('.concept p').textContent;
    const physicsParallel = verseContent.querySelector('.physics p').textContent;
    const accessibleExplanation = verseContent.querySelector('.accessible p').textContent;
    
    // Clear previous content
    verseExplanationContent.innerHTML = '';
    
    // Create verse text container
    const verseTextContainer = document.createElement('div');
    verseTextContainer.className = 'verse-text-container';
    verseTextContainer.textContent = verseText;
    
    // Create explanation sections
    const explanationSection = document.createElement('div');
    explanationSection.className = 'explanation-section';
    
    // Madhyamaka concept
    const madhyamakaHeader = document.createElement('h3');
    madhyamakaHeader.textContent = 'Madhyamaka Concept';
    const madhyamakaPara = document.createElement('p');
    madhyamakaPara.textContent = madhyamakaConcept;
    
    // Physics parallel
    const physicsHeader = document.createElement('h3');
    physicsHeader.textContent = 'Quantum Physics Parallel';
    const physicsPara = document.createElement('p');
    physicsPara.textContent = physicsParallel;
    
    // Accessible explanation
    const accessibleHeader = document.createElement('h3');
    accessibleHeader.textContent = 'Accessible Explanation';
    const accessiblePara = document.createElement('p');
    accessiblePara.textContent = accessibleExplanation;
    
    // Append all elements
    explanationSection.appendChild(madhyamakaHeader);
    explanationSection.appendChild(madhyamakaPara);
    explanationSection.appendChild(physicsHeader);
    explanationSection.appendChild(physicsPara);
    explanationSection.appendChild(accessibleHeader);
    explanationSection.appendChild(accessiblePara);
    
    verseExplanationContent.appendChild(verseTextContainer);
    verseExplanationContent.appendChild(explanationSection);
}

// Function to update animation controls
function updateAnimationControls(verseNum) {
    // Clear previous content
    animationControlsContent.innerHTML = '';
    
    // Get control panel from original verse div
    const verseContent = document.getElementById(`verse${verseNum}`);
    const controlPanel = verseContent.querySelector('.control-panel');
    
    if (controlPanel) {
        // Clone the controls (not the panel toggle buttons)
        const controls = controlPanel.querySelector('.controls');
        const clonedControls = controls.cloneNode(true);
        
        // Update IDs to avoid duplicates
        const buttons = clonedControls.querySelectorAll('button');
        buttons.forEach(button => {
            const originalId = button.id;
            button.id = `panel-${originalId}`;
            
            // Add event listener that triggers the original button
            button.addEventListener('click', () => {
                const originalButton = document.getElementById(originalId);
                if (originalButton) {
                    originalButton.click();
                }
            });
        });
        
        // Do the same for sliders
        const sliders = clonedControls.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            const originalId = slider.id;
            slider.id = `panel-${originalId}`;
            
            // Add event listener to sync with original slider
            slider.addEventListener('input', () => {
                const originalSlider = document.getElementById(originalId);
                if (originalSlider) {
                    originalSlider.value = slider.value;
                    
                    // Create and dispatch input event
                    const event = new Event('input', { bubbles: true });
                    originalSlider.dispatchEvent(event);
                }
            });
        });
        
        // Add title from control panel
        const title = document.createElement('h3');
        title.className = 'control-title';
        title.textContent = controlPanel.querySelector('h3').textContent;
        
        // Append to animation controls content
        animationControlsContent.appendChild(title);
        animationControlsContent.appendChild(clonedControls);
    }
}

// Event listeners
verseSelector.addEventListener('change', () => {
    showVerse(parseInt(verseSelector.value));
});

prevVerseBtn.addEventListener('click', () => {
    if (currentVerse > 1) {
        showVerse(currentVerse - 1);
    }
});

nextVerseBtn.addEventListener('click', () => {
    if (currentVerse < 12) {
        showVerse(currentVerse + 1);
    }
});

// Add event listeners for hide/show text buttons 
hideTextBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const textSection = this.closest('.text-section');
        const explanation = textSection.querySelector('.explanation');
        const verseText = textSection.querySelector('.verse-text');
        const showBtn = textSection.querySelector('.show-text');
        
        explanation.style.opacity = '0';
        verseText.style.opacity = '0';
        
        setTimeout(() => {
            explanation.classList.add('hidden');
            verseText.classList.add('hidden');
            this.classList.add('hidden');
            showBtn.classList.remove('hidden');
        }, 300);
    });
});

showTextBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const textSection = this.closest('.text-section');
        const explanation = textSection.querySelector('.explanation');
        const verseText = textSection.querySelector('.verse-text');
        const hideBtn = textSection.querySelector('.hide-text');
        
        explanation.classList.remove('hidden');
        verseText.classList.remove('hidden');
        this.classList.add('hidden');
        hideBtn.classList.remove('hidden');
        
        setTimeout(() => {
            explanation.style.opacity = '1';
            verseText.style.opacity = '1';
        }, 10);
    });
});

// Add event listeners for hide/show panel buttons
hidePanelBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const panel = this.closest('.control-panel');
        const controls = panel.querySelector('.controls');
        const h3 = panel.querySelector('h3');
        const showBtn = panel.querySelector('.show-panel');
        
        controls.style.opacity = '0';
        h3.style.opacity = '0';
        
        setTimeout(() => {
            controls.classList.add('hidden');
            h3.classList.add('hidden');
            this.classList.add('hidden');
            showBtn.classList.remove('hidden');
            panel.style.padding = '0.5rem';
        }, 300);
    });
});

showPanelBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const panel = this.closest('.control-panel');
        const controls = panel.querySelector('.controls');
        const h3 = panel.querySelector('h3');
        const hideBtn = panel.querySelector('.hide-panel');
        
        controls.classList.remove('hidden');
        h3.classList.remove('hidden');
        this.classList.add('hidden');
        hideBtn.classList.remove('hidden');
        panel.style.padding = '1rem';
        
        setTimeout(() => {
            controls.style.opacity = '1';
            h3.style.opacity = '1';
        }, 10);
    });
});

// Function to show the specified verse
function showVerse(verseNum) {
    // Hide all verses (This hides the original containers, not strictly needed now maybe?)
    // allVerseContents.forEach(content => {
    //     content.classList.add('hidden');
    // });

    // Show the selected verse container (again, maybe not needed if animation fills space)
    // const verseToShow = document.getElementById(`verse${verseNum}`);
    // verseToShow.classList.remove('hidden');
    // verseToShow.classList.add('fade-in');

    // Update current verse
    currentVerse = verseNum;
    // verseSelector.value = verseNum; // Original selector is hidden

    // Initialize or update the corresponding animation FIRST
    // This ensures cleanup happens before UI updates for the new verse
    initOrUpdateAnimation(verseNum);

    // Update side panel content AFTER animation setup
    updateVerseExplanation(verseNum);
    updateAnimationControls(verseNum);
    updateActiveVerseButton(verseNum);
}

// Initialize or update animation based on verse number
function initOrUpdateAnimation(verseNum) {
    const animationContainer = document.getElementById(`animation${verseNum}`);
    if (!animationContainer) {
        console.error(`Animation container for verse ${verseNum} not found!`);
        return;
    }

    const newAnimationKey = `verse${verseNum}`;

    // 1. Cleanup the previous animation if it exists and is different
    if (activeAnimationKey && activeAnimationKey !== newAnimationKey && animations[activeAnimationKey] && typeof animations[activeAnimationKey].cleanup === 'function') {
        try {
            console.log(`Cleaning up animation: ${activeAnimationKey}`);
            animations[activeAnimationKey].cleanup();
        } catch (error) {
            console.error(`Error cleaning up animation ${activeAnimationKey}:`, error);
        }
        // Clear the reference to the old animation object
        delete animations[activeAnimationKey];
    }

    // If the requested animation is already active, do nothing further
    if (activeAnimationKey === newAnimationKey) {
        console.log(`Animation ${newAnimationKey} is already active.`);
        return;
    }

    // 2. Clear any existing DOM content in the target container
    // This is crucial if cleanup didn't remove everything or if switching failsafe
    while (animationContainer.firstChild) {
        animationContainer.removeChild(animationContainer.firstChild);
    }

    // 3. Initialize the new animation
    console.log(`Initializing animation: ${newAnimationKey}`);
    try {
        // Ensure the specific container is visible (it's nested inside verse-content)
        const verseContentDiv = document.getElementById(`verse${verseNum}`);
        if (verseContentDiv) {
             // Make sure *only* the current verse's main container is visible
             allVerseContents.forEach(content => {
                content.classList.add('hidden');
            });
            verseContentDiv.classList.remove('hidden');
            verseContentDiv.classList.add('fade-in'); // Add fade-in effect
        } else {
             console.error(`Verse content div for verse ${verseNum} not found!`);
        }


        switch(verseNum) {
            case 1:
                initializeVerse1Animation(animationContainer);
                break;
            case 2:
                initializeVerse2Animation(animationContainer);
                break;
            case 3:
                initializeVerse3Animation(animationContainer);
                break;
            case 4:
                initializeVerse4Animation(animationContainer);
                break;
            case 5:
                initializeVerse5Animation(animationContainer);
                break;
            case 6:
                initializeVerse6Animation(animationContainer);
                break;
            case 7:
                initializeVerse7Animation(animationContainer);
                break;
            case 8:
                initializeVerse8Animation(animationContainer);
                break;
            case 9:
                initializeVerse9Animation(animationContainer);
                break;
            case 10:
                initializeVerse10Animation(animationContainer);
                break;
            case 11:
                initializeVerse11Animation(animationContainer);
                break;
            case 12:
                initializeVerse12Animation(animationContainer);
                break;
            default:
                console.warn(`No animation defined for verse ${verseNum}`);
                animationContainer.innerHTML = `<p>Animation for verse ${verseNum} not implemented.</p>`;
        }

        // 4. Update the active animation key
        activeAnimationKey = newAnimationKey;

    } catch (error) {
        console.error(`Error initializing animation ${newAnimationKey}:`, error);
        animationContainer.innerHTML = `<p style="color: red; padding: 20px;">Error loading animation for verse ${verseNum}. Check console.</p>`;
        // Reset active key if initialization failed
        activeAnimationKey = null;
    }
}

// Function to initialize animation for Verse 1 (Double Slit Experiment)
function initializeVerse1Animation(container) {
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Create the double slit setup
    const slitWidth = 0.1;
    const slitHeight = 1;
    const slitDepth = 0.1;
    const slitSeparation = 0.5;
    
    // Create a barrier with two slits
    const barrierGeometry = new THREE.BoxGeometry(3, 2, slitDepth);
    const barrierMaterial = new THREE.MeshPhongMaterial({ color: 0x444466 });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    scene.add(barrier);
    
    // Create cutouts for the slits
    const slitGeometry = new THREE.BoxGeometry(slitWidth, slitHeight, slitDepth + 0.01);
    const slitMaterial = new THREE.MeshBasicMaterial({ color: 0x1a1a2e });
    
    // First slit
    const slit1 = new THREE.Mesh(slitGeometry, slitMaterial);
    slit1.position.x = -slitSeparation / 2;
    barrier.add(slit1);
    
    // Second slit
    const slit2 = new THREE.Mesh(slitGeometry, slitMaterial);
    slit2.position.x = slitSeparation / 2;
    barrier.add(slit2);
    
    // Create the source
    const sourceGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const sourceMaterial = new THREE.MeshBasicMaterial({ color: 0x8080ff });
    const source = new THREE.Mesh(sourceGeometry, sourceMaterial);
    source.position.z = -2;
    scene.add(source);
    
    // Create detection screen
    const screenGeometry = new THREE.PlaneGeometry(4, 3);
    const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x222244, side: THREE.DoubleSide });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 2;
    scene.add(screen);
    
    // Add interference pattern to the screen
    const patternTexture = createInterferencePatternTexture();
    const patternMaterial = new THREE.MeshBasicMaterial({
        map: patternTexture,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    const patternPlane = new THREE.Mesh(screenGeometry, patternMaterial);
    patternPlane.position.z = 2.01;
    scene.add(patternPlane);
    
    // Add detection points (particle mode)
    const detectionPoints = [];
    const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xff8080 });
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);
    
    // Animation variables
    let particles = [];
    let observationMode = config.verse1.observationActive;
    let electronRate = config.verse1.electronRate;
    
    // Create a toggle button inside the container
    const toggleObservationBtn = document.getElementById('toggle-observation');
    if (toggleObservationBtn) {
        toggleObservationBtn.addEventListener('click', () => {
            observationMode = !observationMode;
            config.verse1.observationActive = observationMode;
            updateVisualization();
        });
    }
    
    // Create a slider for electron rate
    const electronRateSlider = document.getElementById('electron-rate');
    if (electronRateSlider) {
        electronRateSlider.value = electronRate;
        electronRateSlider.addEventListener('input', () => {
            electronRate = parseInt(electronRateSlider.value);
            config.verse1.electronRate = electronRate;
        });
    }
    
    // Function to create a random electron particle
    function createElectron() {
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ 
            color: config.verse1.particleColor,
            transparent: true,
            opacity: 0.8
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        particle.position.set(source.position.x, source.position.y, source.position.z);
        particle.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01,
                0.05
            ),
            age: 0,
            maxAge: 200
        };
        scene.add(particle);
        particles.push(particle);
    }
    
    // Function to create an interference pattern texture
    function createInterferencePatternTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext('2d');
        
        // Fill with background color
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Create interference pattern
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                // Calculate normalized coordinates
                const nx = (x / canvas.width) * 2 - 1;
                const ny = (y / canvas.height) * 2 - 1;
                
                // Apply interference formula
                const d1 = Math.sqrt(Math.pow(nx - slitSeparation/3, 2) + Math.pow(ny, 2));
                const d2 = Math.sqrt(Math.pow(nx + slitSeparation/3, 2) + Math.pow(ny, 2));
                
                // Double slit interference
                const wavelength = 0.1;
                const intensity = Math.pow(Math.cos((d1 - d2) * Math.PI / wavelength), 2);
                
                // Set pixel color based on intensity
                const color = Math.floor(intensity * 100);
                context.fillStyle = `rgb(${color}, ${color}, ${color + 80})`;
                context.fillRect(x, y, 1, 1);
            }
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }
    
    // Function to create a simple particle detection pattern
    function addDetectionPoint(x, y) {
        const point = new THREE.Mesh(particleGeometry, particleMaterial);
        point.position.set(x, y, 2.02);
        scene.add(point);
        detectionPoints.push(point);
        
        // Remove old points if too many
        if (detectionPoints.length > 100) {
            const oldPoint = detectionPoints.shift();
            scene.remove(oldPoint);
        }
    }
    
    // Function to update visualization based on observation mode
    function updateVisualization() {
        patternPlane.visible = !observationMode;
        
        // Change source color based on mode
        if (observationMode) {
            sourceMaterial.color.set(config.verse1.detectionColor);
        } else {
            sourceMaterial.color.set(config.verse1.particleColor);
        }
    }
    
    // Call initially
    updateVisualization();
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Spawn new particles
        if (Math.random() < electronRate / 1000) {
            createElectron();
        }
        
        // Update particles
        particles.forEach((particle, index) => {
            particle.position.add(particle.userData.velocity);
            
            // Handle particle passing through barrier
            if (particle.position.z > barrier.position.z && 
                particle.position.z < barrier.position.z + slitDepth + 0.1) {
                
                // Check if particle passes through either slit
                const passesThroughSlit1 = Math.abs(particle.position.x - (-slitSeparation/2)) < slitWidth/2 && 
                                           Math.abs(particle.position.y) < slitHeight/2;
                                           
                const passesThroughSlit2 = Math.abs(particle.position.x - (slitSeparation/2)) < slitWidth/2 && 
                                           Math.abs(particle.position.y) < slitHeight/2;
                
                // Quantum behavior depends on observation mode
                if (observationMode) {
                    // Particle behavior - passes through only one slit
                    if (!passesThroughSlit1 && !passesThroughSlit2) {
                        // Hit barrier
                        scene.remove(particle);
                        particles.splice(index, 1);
                    } else {
                        // Slightly randomize direction after going through slit
                        particle.userData.velocity.x += (Math.random() - 0.5) * 0.005;
                        particle.userData.velocity.y += (Math.random() - 0.5) * 0.005;
                    }
                } else {
                    // Wave behavior - affected by both slits regardless of which it passes through
                    if (!passesThroughSlit1 && !passesThroughSlit2) {
                        // Hit barrier
                        scene.remove(particle);
                        particles.splice(index, 1);
                    }
                }
            }
            
            // Handle particle hitting screen
            if (particle.position.z >= screen.position.z) {
                if (observationMode) {
                    // Add a detection point in particle mode
                    addDetectionPoint(particle.position.x, particle.position.y);
                }
                
                // Remove particle
                scene.remove(particle);
                particles.splice(index, 1);
            }
            
            // Age the particle
            particle.userData.age++;
            if (particle.userData.age > particle.userData.maxAge) {
                scene.remove(particle);
                particles.splice(index, 1);
            }
        });
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Store cleanup function
    animations[`verse1`] = {
        cleanup: function() {
            // Remove event listeners
            window.removeEventListener('resize', onWindowResize);
            
            // Stop animation loop (though this is not really possible with requestAnimationFrame)
            // Remove all particles
            particles.forEach(particle => scene.remove(particle));
            particles = [];
            
            // Remove all detection points
            detectionPoints.forEach(point => scene.remove(point));
            
            // Dispose of geometries, materials, textures
            sourceGeometry.dispose();
            sourceMaterial.dispose();
            barrierGeometry.dispose();
            barrierMaterial.dispose();
            slitGeometry.dispose();
            slitMaterial.dispose();
            screenGeometry.dispose();
            screenMaterial.dispose();
            patternMaterial.dispose();
            particleGeometry.dispose();
            particleMaterial.dispose();
            
            // Dispose of renderer
            renderer.dispose();
            
            // Remove renderer element from DOM
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    };
}

// Function to initialize animation for Verse 2 (Quantum Superposition)
function initializeVerse2Animation(container) {
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Create central particle in superposition
    const particleGeometry = new THREE.SphereGeometry(config.verse2.particleSize / 100, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({ 
        color: config.verse2.particleColor,
        transparent: true,
        opacity: 0.7
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    scene.add(particle);
    
    // Probability cloud visualization
    const cloudGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
    const cloudMaterial = new THREE.MeshPhongMaterial({ 
        color: config.verse2.probabilityColor,
        transparent: true,
        opacity: 0.5,
        wireframe: false
    });
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(cloud);
    
    // Add a second torus for more complex visualization
    const cloud2Geometry = new THREE.TorusGeometry(1, 0.15, 16, 100);
    cloud2Geometry.rotateY(Math.PI / 2);
    const cloud2Material = new THREE.MeshPhongMaterial({ 
        color: config.verse2.probabilityColor,
        transparent: true,
        opacity: 0.3,
        wireframe: false
    });
    const cloud2 = new THREE.Mesh(cloud2Geometry, cloud2Material);
    scene.add(cloud2);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);
    
    // Animation state
    let inSuperposition = config.verse2.superpositionActive;
    let measurementPoint = new THREE.Vector3();
    let waveSpeed = config.verse2.waveSpeed;
    let measurementTime = 0;
    let measured = false;
    
    // Event listeners for controls
    const measureBtn = document.getElementById('measure-particle');
    if (measureBtn) {
        measureBtn.addEventListener('click', () => {
            if (inSuperposition) {
                measured = true;
                measurementTime = 0;
                
                // Pick a random point on the torus
                const angle = Math.random() * Math.PI * 2;
                const distance = 1;
                measurementPoint.set(
                    Math.cos(angle) * distance,
                    Math.sin(angle) * distance,
                    0
                );
                
                inSuperposition = false;
                config.verse2.superpositionActive = false;
            }
        });
    }
    
    const resetBtn = document.getElementById('reset-superposition');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            inSuperposition = true;
            measured = false;
            config.verse2.superpositionActive = true;
            
            // Reset particle to center
            particle.position.set(0, 0, 0);
            particle.scale.set(1, 1, 1);
            
            // Make cloud visible again
            cloud.visible = true;
            cloud2.visible = true;
        });
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        if (inSuperposition) {
            // Animate probability cloud
            cloud.rotation.x = time * waveSpeed;
            cloud.rotation.y = time * waveSpeed * 0.5;
            
            cloud2.rotation.x = time * waveSpeed * 0.7;
            cloud2.rotation.z = time * waveSpeed * 0.3;
            
            // Make particle pulsate slightly
            const scale = 1 + 0.1 * Math.sin(time * 3);
            particle.scale.set(scale, scale, scale);
            
            // Slight movement in center
            particle.position.x = Math.sin(time) * 0.07;
            particle.position.y = Math.cos(time * 1.3) * 0.05;
        } else if (measured) {
            // Collapse animation
            measurementTime += 0.015;
            
            if (measurementTime < 1) {
                // Move particle toward measured position
                particle.position.x = THREE.MathUtils.lerp(particle.position.x, measurementPoint.x, measurementTime);
                particle.position.y = THREE.MathUtils.lerp(particle.position.y, measurementPoint.y, measurementTime);
                particle.position.z = THREE.MathUtils.lerp(particle.position.z, measurementPoint.z, measurementTime);
                
                // Fade out cloud
                cloud.material.opacity = 0.5 * (1 - measurementTime);
                cloud2.material.opacity = 0.3 * (1 - measurementTime);
            } else {
                // Complete collapse
                particle.position.copy(measurementPoint);
                cloud.visible = false;
                cloud2.visible = false;
                measured = false;
            }
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Store cleanup function
    animations[`verse2`] = {
        cleanup: function() {
            // Remove event listeners
            window.removeEventListener('resize', onWindowResize);
            
            // Dispose of geometries, materials
            particleGeometry.dispose();
            particleMaterial.dispose();
            cloudGeometry.dispose();
            cloudMaterial.dispose();
            cloud2Geometry.dispose();
            cloud2Material.dispose();
            
            // Dispose of renderer
            renderer.dispose();
            
            // Remove renderer element from DOM
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    };
}

// Function to initialize animation for Verse 3 (Wave Function)
function initializeVerse3Animation(container) {
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Animation variables
    let waveSpread = config.verse3.waveSpread / 100; // Convert to 0-1 range
    let measurementActive = config.verse3.measurementActive;
    const waveSpeed = config.verse3.waveSpeed;
    const animationSpeed = config.verse3.animationSpeed;
    
    // Create wave function visualization
    const waveResolution = 100;
    const waveWidth = 4;
    const waveHeight = 2;
    
    const waveGeometry = new THREE.PlaneGeometry(waveWidth, waveHeight, waveResolution, 1);
    const waveMaterial = new THREE.MeshBasicMaterial({
        color: config.verse3.waveColor,
        transparent: true,
        opacity: 0.7,
        wireframe: true
    });
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    scene.add(wave);
    
    // Create a filled wave with same geometry but solid material
    const filledWaveGeometry = new THREE.PlaneGeometry(waveWidth, waveHeight, waveResolution, 1);
    const filledWaveMaterial = new THREE.MeshBasicMaterial({
        color: config.verse3.waveColor,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    const filledWave = new THREE.Mesh(filledWaveGeometry, filledWaveMaterial);
    filledWave.position.z = -0.01; // Slightly behind the wireframe
    scene.add(filledWave);
    
    // Create a point that represents the measured state
    const pointGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const pointMaterial = new THREE.MeshBasicMaterial({ 
        color: config.verse3.pointColor,
        transparent: true,
        opacity: 0.8
    });
    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    point.visible = false;
    scene.add(point);
    
    // Event listeners for controls
    const toggleMeasurement = document.getElementById('toggle-measurement');
    if (toggleMeasurement) {
        toggleMeasurement.addEventListener('click', () => {
            measurementActive = !measurementActive;
            config.verse3.measurementActive = measurementActive;
            
            // Show/hide point
            point.visible = measurementActive;
            
            // Update button text
            if (toggleMeasurement.textContent) {
                toggleMeasurement.textContent = measurementActive ? 'Hide Measurement' : 'Show Measurement';
            }
        });
    }
    
    const waveSpreadSlider = document.getElementById('wave-spread');
    if (waveSpreadSlider) {
        waveSpreadSlider.value = config.verse3.waveSpread;
        waveSpreadSlider.addEventListener('input', () => {
            waveSpread = waveSpreadSlider.value / 100;
            config.verse3.waveSpread = waveSpreadSlider.value;
        });
    }
    
    // Function to update wave vertices
    function updateWave(time) {
        const vertices = waveGeometry.attributes.position.array;
        const filledVertices = filledWaveGeometry.attributes.position.array;
        
        // Function to calculate Gaussian wave packet
        function gaussianWavePacket(x, center, width, k, t) {
            const gaussianEnvelope = Math.exp(-Math.pow(x - center, 2) / (2 * width * width));
            const oscillation = Math.cos(k * x - t);
            return gaussianEnvelope * oscillation;
        }
        
        // Update vertices of both waves
        for (let i = 0; i <= waveResolution; i++) {
            const x = (i / waveResolution) * waveWidth - waveWidth / 2;
            
            // Calculate wave height based on Gaussian wave packet
            const center = 0;
            const width = 0.5 + waveSpread * 1.5; // Adjustable spread
            const k = 10; // Wave number (oscillation frequency)
            const amplitude = 0.7; // Wave amplitude
            
            const y = amplitude * gaussianWavePacket(x, center, width, k, time * animationSpeed);
            
            // Update wireframe
            vertices[i * 3 + 1] = y;
            
            // Update filled wave
            filledVertices[i * 3 + 1] = y;
        }
        
        waveGeometry.attributes.position.needsUpdate = true;
        filledWaveGeometry.attributes.position.needsUpdate = true;
    }
    
    // Function to measure wave at random position
    function measureWave(time) {
        if (measurementActive) {
            // Use probability distribution to determine measurement
            const distributionWidth = 0.5 + waveSpread * 1.5;
            
            // Generate random position weighted by probability
            let measurePosition;
            do {
                measurePosition = (Math.random() * 2 - 1) * waveWidth / 2;
            } while (Math.random() > Math.exp(-Math.pow(measurePosition, 2) / (2 * distributionWidth * distributionWidth)));
            
            // Position the measurement point
            const y = 0.7 * Math.exp(-Math.pow(measurePosition, 2) / (2 * distributionWidth * distributionWidth)) 
                      * Math.cos(10 * measurePosition - time * animationSpeed);
            
            point.position.set(measurePosition, y, 0);
        }
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Update wave
        updateWave(time);
        
        // Update measurement
        measureWave(time);
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Store cleanup function
    animations[`verse3`] = {
        cleanup: function() {
            // Remove event listeners
            window.removeEventListener('resize', onWindowResize);
            
            // Dispose of geometries, materials
            waveGeometry.dispose();
            waveMaterial.dispose();
            filledWaveGeometry.dispose();
            filledWaveMaterial.dispose();
            pointGeometry.dispose();
            pointMaterial.dispose();
            
            // Dispose of renderer
            renderer.dispose();
            
            // Remove renderer element from DOM
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    };
}

// Function to initialize animation for Verse 4 (Quantum Erasure)
function initializeVerse4Animation(container) {
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Configuration variables
    let pathInfoActive = config.verse4.pathInfoActive;
    const slitWidth = config.verse4.slitWidth / 100; // Convert to appropriate scale
    const particleRate = config.verse4.particleRate;
    const resetSpeed = config.verse4.resetSpeed;
    
    // Create source
    const sourceGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const sourceMaterial = new THREE.MeshBasicMaterial({ color: config.verse4.particleColor });
    const source = new THREE.Mesh(sourceGeometry, sourceMaterial);
    source.position.z = -3;
    scene.add(source);
    
    // Create double-slit barrier
    const barrierGeometry = new THREE.BoxGeometry(4, 2, 0.2);
    const barrierMaterial = new THREE.MeshPhongMaterial({ color: 0x333355 });
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    barrier.position.z = -1;
    scene.add(barrier);
    
    // Create slits
    const slitGeometry1 = new THREE.BoxGeometry(slitWidth, 1, 0.3);
    const slitGeometry2 = new THREE.BoxGeometry(slitWidth, 1, 0.3);
    const slitMaterial = new THREE.MeshBasicMaterial({ color: 0x1a1a2e });
    
    const slit1 = new THREE.Mesh(slitGeometry1, slitMaterial);
    slit1.position.set(-0.5, 0, -1);
    scene.add(slit1);
    
    const slit2 = new THREE.Mesh(slitGeometry2, slitMaterial);
    slit2.position.set(0.5, 0, -1);
    scene.add(slit2);
    
    // Create detector screen
    const screenGeometry = new THREE.PlaneGeometry(4, 2);
    const screenMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x222244, 
        side: THREE.DoubleSide 
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 2;
    scene.add(screen);
    
    // Create interference pattern texture
    const patternTexture = createInterferencePattern();
    const noPatternTexture = createNoInterferencePattern();
    
    // Add pattern to screen
    const patternGeometry = new THREE.PlaneGeometry(3.9, 1.9);
    const patternMaterial = new THREE.MeshBasicMaterial({ 
        map: pathInfoActive ? noPatternTexture : patternTexture,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    const pattern = new THREE.Mesh(patternGeometry, patternMaterial);
    pattern.position.z = 2.01;
    scene.add(pattern);
    
    // Create which-path detectors
    const detectorGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const detectorMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff5555,
        transparent: true,
        opacity: pathInfoActive ? 0.8 : 0.2
    });
    
    const detector1 = new THREE.Mesh(detectorGeometry, detectorMaterial);
    detector1.position.set(-0.5, 0, -0.8);
    scene.add(detector1);
    
    const detector2 = new THREE.Mesh(detectorGeometry, detectorMaterial);
    detector2.position.set(0.5, 0, -0.8);
    scene.add(detector2);
    
    // Add text labels for detectors
    function createTextSprite(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = '24px Arial';
        context.fillStyle = 'rgba(255, 255, 255, 0.7)';
        context.fillText(text, 10, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        
        return new THREE.Sprite(material);
    }
    
    const label1 = createTextSprite('Detector 1');
    label1.position.set(-0.9, 0.3, -0.8);
    label1.scale.set(0.5, 0.25, 1);
    scene.add(label1);
    
    const label2 = createTextSprite('Detector 2');
    label2.position.set(0.9, 0.3, -0.8);
    label2.scale.set(0.5, 0.25, 1);
    scene.add(label2);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);
    
    // Particles for visualization
    let particles = [];
    
    // Event listeners for controls
    const togglePathBtn = document.getElementById('toggle-path-info');
    if (togglePathBtn) {
        togglePathBtn.addEventListener('click', () => {
            pathInfoActive = !pathInfoActive;
            config.verse4.pathInfoActive = pathInfoActive;
            
            // Update visualization
            updateVisualization();
        });
    }
    
    const resetBtn = document.getElementById('reset-experiment');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // Clear all particles
            particles.forEach(p => scene.remove(p));
            particles = [];
        });
    }
    
    // Function to create interference pattern texture
    function createInterferencePattern() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        // Fill with background color
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Create interference pattern
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                // Calculate normalized coordinates
                const nx = (x / canvas.width) * 2 - 1;
                const ny = (y / canvas.height) * 2 - 1;
                
                // Apply interference formula
                const d1 = Math.sqrt(Math.pow(nx - 0.5/4, 2) + Math.pow(ny, 2));
                const d2 = Math.sqrt(Math.pow(nx + 0.5/4, 2) + Math.pow(ny, 2));
                
                // Double slit interference
                const wavelength = 0.05;
                const intensity = Math.pow(Math.cos((d1 - d2) * Math.PI / wavelength), 2);
                
                // Set pixel color based on intensity
                const color = Math.floor(intensity * 80);
                context.fillStyle = `rgb(${color}, ${color}, ${color + 100})`;
                context.fillRect(x, y, 1, 1);
            }
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }
    
    // Function to create pattern without interference
    function createNoInterferencePattern() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        // Fill with background color
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Create two separate distributions
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                // Calculate normalized coordinates
                const nx = (x / canvas.width) * 2 - 1;
                const ny = (y / canvas.height) * 2 - 1;
                
                // Apply two separate Gaussian distributions
                const sigma = 0.2;
                const intensity1 = Math.exp(-Math.pow(nx - 0.5/2, 2) / (2 * sigma * sigma));
                const intensity2 = Math.exp(-Math.pow(nx + 0.5/2, 2) / (2 * sigma * sigma));
                
                // Sum the intensities
                const intensity = (intensity1 + intensity2) / 2;
                
                // Set pixel color based on intensity
                const color = Math.floor(intensity * 80);
                context.fillStyle = `rgb(${color}, ${color}, ${color + 100})`;
                context.fillRect(x, y, 1, 1);
            }
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }
    
    // Update visualization based on path info mode
    function updateVisualization() {
        // Update pattern
        patternMaterial.map = pathInfoActive ? noPatternTexture : patternTexture;
        patternMaterial.needsUpdate = true;
        
        // Update detector visibility
        detectorMaterial.opacity = pathInfoActive ? 0.8 : 0.2;
        detectorMaterial.needsUpdate = true;
    }
    
    // Create a particle
    function createParticle() {
        const particleGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ 
            color: config.verse4.particleColor,
            transparent: true,
            opacity: 0.7
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.copy(source.position);
        
        // Initial velocity towards barrier
        particle.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                0.05
            ),
            age: 0,
            maxAge: 300,
            throughSlit: null
        };
        
        scene.add(particle);
        particles.push(particle);
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Generate new particles
        if (Math.random() < particleRate / 1000) {
            createParticle();
        }
        
        // Update existing particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            
            // Move particle
            particle.position.add(particle.userData.velocity);
            
            // Check if particle is reaching the barrier with slits
            if (particle.position.z >= barrier.position.z - 0.2 && 
                particle.position.z <= barrier.position.z + 0.2 && 
                particle.userData.throughSlit === null) {
                
                // Check if it goes through either slit
                const throughSlit1 = Math.abs(particle.position.x - slit1.position.x) < slitWidth/2;
                const throughSlit2 = Math.abs(particle.position.x - slit2.position.x) < slitWidth/2;
                
                if (throughSlit1) {
                    particle.userData.throughSlit = 1;
                    
                    // If being observed, adjust trajectory accordingly
                    if (pathInfoActive) {
                        particle.userData.velocity.x = (Math.random() - 0.5) * 0.01;
                        particle.userData.velocity.y = (Math.random() - 0.5) * 0.01;
                        
                        // Flash detector
                        detector1.material.color.set(0xff0000);
                        setTimeout(() => {
                            detector1.material.color.set(0xff5555);
                        }, 100);
                    }
                } else if (throughSlit2) {
                    particle.userData.throughSlit = 2;
                    
                    // If being observed, adjust trajectory accordingly
                    if (pathInfoActive) {
                        particle.userData.velocity.x = (Math.random() - 0.5) * 0.01;
                        particle.userData.velocity.y = (Math.random() - 0.5) * 0.01;
                        
                        // Flash detector
                        detector2.material.color.set(0xff0000);
                        setTimeout(() => {
                            detector2.material.color.set(0xff5555);
                        }, 100);
                    }
                } else {
                    // Hit the barrier
                    scene.remove(particle);
                    particles.splice(i, 1);
                    continue;
                }
            }
            
            // Check if particle reaches the screen
            if (particle.position.z >= screen.position.z) {
                particle.userData.velocity.set(0, 0, 0);
                
                // Fade out over time
                particle.userData.age += 5;
                particle.material.opacity = Math.max(0, 0.7 - (particle.userData.age / particle.userData.maxAge) * 0.7);
            }
            
            // Remove old particles
            particle.userData.age++;
            if (particle.userData.age > particle.userData.maxAge) {
                scene.remove(particle);
                particles.splice(i, 1);
            }
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Store cleanup function
    animations[`verse4`] = {
        cleanup: function() {
            // Remove event listeners
            window.removeEventListener('resize', onWindowResize);
            
            // Remove all particles
            particles.forEach(p => scene.remove(p));
            
            // Dispose of geometries, materials, textures
            sourceGeometry.dispose();
            sourceMaterial.dispose();
            barrierGeometry.dispose();
            barrierMaterial.dispose();
            slitGeometry1.dispose();
            slitGeometry2.dispose();
            slitMaterial.dispose();
            screenGeometry.dispose();
            screenMaterial.dispose();
            patternGeometry.dispose();
            patternMaterial.dispose();
            detectorGeometry.dispose();
            detectorMaterial.dispose();
            
            if (patternTexture) patternTexture.dispose();
            if (noPatternTexture) noPatternTexture.dispose();
            
            // Dispose of renderer
            renderer.dispose();
            
            // Remove renderer element from DOM
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    };
}

function initializeVerse5Animation(container) {
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Configuration variables
    let fixationActive = config.verse5.fixationActive;
    let probabilityDensity = config.verse5.probabilityDensity / 100; // Convert to 0-1 range
    
    // Create central particle
    const particleGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({ 
        color: config.verse5.particleColor,
        transparent: true,
        opacity: 0.8
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    scene.add(particle);
    
    // Create probability wave visualization
    const wavePoints = [];
    const waveSegments = 64;
    const waveRadius = 1.5;
    
    for (let i = 0; i <= waveSegments; i++) {
        const angle = (i / waveSegments) * Math.PI * 2;
        const x = Math.cos(angle) * waveRadius;
        const y = Math.sin(angle) * waveRadius;
        wavePoints.push(new THREE.Vector3(x, y, 0));
    }
    
    const waveGeometry = new THREE.BufferGeometry().setFromPoints(wavePoints);
    const waveMaterial = new THREE.LineBasicMaterial({ 
        color: config.verse5.waveColor,
        transparent: true,
        opacity: 0.6
    });
    const wave = new THREE.LineLoop(waveGeometry, waveMaterial);
    scene.add(wave);
    
    // Create a more complex probabilistic cloud
    const cloudGeometry = new THREE.SphereGeometry(waveRadius, 32, 16);
    const cloudMaterial = new THREE.MeshBasicMaterial({
        color: config.verse5.waveColor,
        transparent: true,
        opacity: 0.15,
        wireframe: true
    });
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(cloud);
    
    // Create fixation visualization
    const fixationGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const fixationMaterial = new THREE.MeshBasicMaterial({
        color: config.verse5.fixationColor,
        transparent: true,
        opacity: fixationActive ? 0.7 : 0
    });
    const fixation = new THREE.Mesh(fixationGeometry, fixationMaterial);
    scene.add(fixation);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);
    
    // Event listeners for controls
    const toggleFixationBtn = document.getElementById('toggle-fixation');
    if (toggleFixationBtn) {
        toggleFixationBtn.addEventListener('click', () => {
            fixationActive = !fixationActive;
            config.verse5.fixationActive = fixationActive;
            updateVisualization();
        });
    }
    
    const densitySlider = document.getElementById('probability-density');
    if (densitySlider) {
        densitySlider.value = config.verse5.probabilityDensity;
        densitySlider.addEventListener('input', () => {
            probabilityDensity = parseInt(densitySlider.value) / 100;
            config.verse5.probabilityDensity = parseInt(densitySlider.value);
            updateVisualization();
        });
    }
    
    // Update visualization based on current state
    function updateVisualization() {
        // Update fixation box
        fixationMaterial.opacity = fixationActive ? 0.7 : 0;
        
        // Update particle color
        particle.material.color.set(fixationActive ? config.verse5.fixationColor : config.verse5.particleColor);
        
        // Update cloud size based on density
        cloud.scale.set(
            0.7 + probabilityDensity * 0.6,
            0.7 + probabilityDensity * 0.6,
            0.7 + probabilityDensity * 0.6
        );
    }
    
    // Apply initial visualization
    updateVisualization();
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        if (fixationActive) {
            // Fixed behavior
            particle.position.set(0, 0, 0);
            fixation.position.set(0, 0, 0);
            
            // Slowly rotate fixation
            fixation.rotation.x = time * 0.3;
            fixation.rotation.y = time * 0.5;
            
            // Pulsate fixation slightly
            const scale = 1 + 0.1 * Math.sin(time * 2);
            fixation.scale.set(scale, scale, scale);
            
            // Fade out wave and cloud
            wave.material.opacity = Math.max(0, wave.material.opacity - 0.005);
            cloud.material.opacity = Math.max(0, cloud.material.opacity - 0.001);
            
        } else {
            // Probabilistic behavior
            
            // Restore wave and cloud visibility
            wave.material.opacity = Math.min(0.6, wave.material.opacity + 0.01);
            cloud.material.opacity = Math.min(0.15, cloud.material.opacity + 0.002);
            
            // Make particle orbit within probability cloud
            const orbitRadius = 0.4 + Math.sin(time * 0.5) * 0.3;
            const orbitSpeed = 1.0;
            
            particle.position.x = Math.cos(time * orbitSpeed) * orbitRadius;
            particle.position.y = Math.sin(time * orbitSpeed) * orbitRadius;
            particle.position.z = Math.sin(time * 0.7) * 0.2;
            
            // Animate wave
            const wavePoints = [];
            for (let i = 0; i <= waveSegments; i++) {
                const angle = (i / waveSegments) * Math.PI * 2;
                const waveStrength = 0.1 * (0.5 + probabilityDensity);
                const radius = waveRadius + Math.sin(angle * 8 + time * 2) * waveStrength;
                
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                wavePoints.push(new THREE.Vector3(x, y, 0));
            }
            
            // Update wave geometry
            wave.geometry.dispose();
            wave.geometry = new THREE.BufferGeometry().setFromPoints(wavePoints);
            
            // Rotate cloud
            cloud.rotation.x = time * 0.1;
            cloud.rotation.y = time * 0.15;
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Store cleanup function
    animations[`verse5`] = {
        cleanup: function() {
            // Remove event listeners
            window.removeEventListener('resize', onWindowResize);
            
            // Dispose of geometries, materials
            particleGeometry.dispose();
            particleMaterial.dispose();
            waveGeometry.dispose();
            waveMaterial.dispose();
            cloudGeometry.dispose();
            cloudMaterial.dispose();
            fixationGeometry.dispose();
            fixationMaterial.dispose();
            
            // Dispose of renderer
            renderer.dispose();
            
            // Remove renderer element from DOM
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    };
}

function initializeVerse6Animation(container) {
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Configuration variables
    let inSuperposition = config.verse6.inSuperposition;
    const particleSize = config.verse6.particleSize / 100;
    const rotationSpeed = config.verse6.rotationSpeed;
    
    // Create the central spin particle
    const particleGeometry = new THREE.SphereGeometry(particleSize, 32, 32);
    const superpositionMaterial = new THREE.MeshPhongMaterial({ 
        color: config.verse6.superpositionColor,
        transparent: true,
        opacity: 0.9
    });
    const spinUpMaterial = new THREE.MeshPhongMaterial({ 
        color: config.verse6.spinUpColor,
        transparent: true,
        opacity: 0.9
    });
    const spinDownMaterial = new THREE.MeshPhongMaterial({ 
        color: config.verse6.spinDownColor,
        transparent: true,
        opacity: 0.9
    });
    
    const particle = new THREE.Mesh(particleGeometry, superpositionMaterial);
    scene.add(particle);
    
    // Create spin axis
    const axisGeometry = new THREE.CylinderGeometry(0.01, 0.01, 3, 8);
    const axisMaterial = new THREE.MeshBasicMaterial({ color: 0x666666 });
    const axis = new THREE.Mesh(axisGeometry, axisMaterial);
    axis.rotation.x = Math.PI / 2;
    scene.add(axis);
    
    // Create superposition indicator (ring)
    const ringGeometry = new THREE.TorusGeometry(particleSize * 1.5, 0.03, 16, 48);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: config.verse6.superpositionColor,
        transparent: true,
        opacity: 0.7
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    
    // Add arrow indicators for spin state
    const arrowUpGeometry = new THREE.ConeGeometry(0.1, 0.3, 16);
    const arrowUpMaterial = new THREE.MeshBasicMaterial({ 
        color: config.verse6.spinUpColor,
        transparent: true,
        opacity: 0
    });
    const arrowUp = new THREE.Mesh(arrowUpGeometry, arrowUpMaterial);
    arrowUp.position.y = 0.8;
    scene.add(arrowUp);
    
    const arrowDownGeometry = new THREE.ConeGeometry(0.1, 0.3, 16);
    const arrowDownMaterial = new THREE.MeshBasicMaterial({ 
        color: config.verse6.spinDownColor,
        transparent: true,
        opacity: 0
    });
    const arrowDown = new THREE.Mesh(arrowDownGeometry, arrowDownMaterial);
    arrowDown.position.y = -0.8;
    arrowDown.rotation.x = Math.PI;
    scene.add(arrowDown);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);
    
    // Group for rotation
    const rotationGroup = new THREE.Group();
    rotationGroup.add(particle);
    rotationGroup.add(ring);
    scene.add(rotationGroup);
    
    // Event listeners for controls
    const measureSpinBtn = document.getElementById('measure-spin');
    if (measureSpinBtn) {
        measureSpinBtn.addEventListener('click', () => {
            if (inSuperposition) {
                inSuperposition = false;
                config.verse6.inSuperposition = false;
                
                // Randomly choose spin up or down
                const spinUp = Math.random() > 0.5;
                measureSpin(spinUp);
            }
        });
    }
    
    const resetSpinBtn = document.getElementById('reset-spin');
    if (resetSpinBtn) {
        resetSpinBtn.addEventListener('click', () => {
            inSuperposition = true;
            config.verse6.inSuperposition = true;
            resetToSuperposition();
        });
    }
    
    // Function to measure spin (collapse superposition)
    function measureSpin(spinUp) {
        // Change particle color based on measurement
        particle.material = spinUp ? spinUpMaterial : spinDownMaterial;
        
        // Animate the transition
        const timeline = { t: 0 };
        
        // Initial state
        const initialY = particle.position.y;
        const targetY = spinUp ? 0.5 : -0.5;
        
        // Update visualization
        ring.material.opacity = 0;
        
        // Show appropriate arrow
        arrowUpMaterial.opacity = spinUp ? 0.8 : 0;
        arrowDownMaterial.opacity = spinUp ? 0 : 0.8;
        
        // Animate the particle moving to measured position
        const tween = {
            update: function(time) {
                if (timeline.t < 1) {
                    timeline.t += 0.02;
                    
                    // Move particle to measured position
                    particle.position.y = THREE.MathUtils.lerp(initialY, targetY, timeline.t);
                    
                    return true; // Continue animation
                }
                return false; // Stop animation
            }
        };
        
        tweens.push(tween);
    }
    
    // Function to reset to superposition state
    function resetToSuperposition() {
        // Change particle back to superposition state
        particle.material = superpositionMaterial;
        
        // Reset position
        const timeline = { t: 0 };
        const initialY = particle.position.y;
        
        // Update visualization
        ring.material.opacity = 0.7;
        
        // Hide arrows
        arrowUpMaterial.opacity = 0;
        arrowDownMaterial.opacity = 0;
        
        // Animate the particle moving back to center
        const tween = {
            update: function(time) {
                if (timeline.t < 1) {
                    timeline.t += 0.02;
                    
                    // Move particle back to center
                    particle.position.y = THREE.MathUtils.lerp(initialY, 0, timeline.t);
                    
                    return true; // Continue animation
                }
                return false; // Stop animation
            }
        };
        
        tweens.push(tween);
    }
    
    // Array to store active tweens
    const tweens = [];
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Process active tweens
        for (let i = tweens.length - 1; i >= 0; i--) {
            const stillActive = tweens[i].update(time);
            if (!stillActive) {
                tweens.splice(i, 1);
            }
        }
        
        if (inSuperposition) {
            // Animate superposition state
            rotationGroup.rotation.y = time * rotationSpeed;
            rotationGroup.rotation.x = Math.sin(time * rotationSpeed * 0.5) * 0.2;
            
            // Pulse the ring slightly
            const scale = 1 + 0.05 * Math.sin(time * 2);
            ring.scale.set(scale, scale, scale);
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Store cleanup function
    animations[`verse6`] = {
        cleanup: function() {
            // Remove event listeners
            window.removeEventListener('resize', onWindowResize);
            
            // Clear tweens
            tweens.length = 0;
            
            // Dispose of geometries, materials
            particleGeometry.dispose();
            superpositionMaterial.dispose();
            spinUpMaterial.dispose();
            spinDownMaterial.dispose();
            axisGeometry.dispose();
            axisMaterial.dispose();
            ringGeometry.dispose();
            ringMaterial.dispose();
            arrowUpGeometry.dispose();
            arrowUpMaterial.dispose();
            arrowDownGeometry.dispose();
            arrowDownMaterial.dispose();
            
            // Dispose of renderer
            renderer.dispose();
            
            // Remove renderer element from DOM
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    };
}

function initializeVerse7Animation(container) {
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.verse7.vacuumColor);
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Configuration variables
    let fluctuationsActive = config.verse7.fluctuationsActive;
    let fluctuationRate = config.verse7.fluctuationRate / 100;
    const particleLifetime = config.verse7.particleLifetime;
    const maxParticles = config.verse7.maxParticles;
    
    // Create vacuum visualization - subtle grid
    const gridHelper = new THREE.GridHelper(10, 20, 0x222244, 0x111133);
    gridHelper.position.y = -2;
    scene.add(gridHelper);
    
    // Add a subtle glow to the background
    const glowGeometry = new THREE.SphereGeometry(8, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x111133,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);
    
    // Particle system for quantum fluctuations
    const particles = [];
    
    // Event listeners for controls
    const toggleFluctuationsBtn = document.getElementById('toggle-fluctuations');
    if (toggleFluctuationsBtn) {
        toggleFluctuationsBtn.addEventListener('click', () => {
            fluctuationsActive = !fluctuationsActive;
            config.verse7.fluctuationsActive = fluctuationsActive;
            
            // Update button text
            if (toggleFluctuationsBtn.textContent) {
                toggleFluctuationsBtn.textContent = fluctuationsActive ? 'Pause Fluctuations' : 'Resume Fluctuations';
            }
        });
    }
    
    const fluctuationRateSlider = document.getElementById('fluctuation-rate');
    if (fluctuationRateSlider) {
        fluctuationRateSlider.value = config.verse7.fluctuationRate;
        fluctuationRateSlider.addEventListener('input', () => {
            fluctuationRate = parseInt(fluctuationRateSlider.value) / 100;
            config.verse7.fluctuationRate = parseInt(fluctuationRateSlider.value);
        });
    }
    
    // Function to create particle pairs
    function createParticlePair() {
        // Random position in visible area
        const x = (Math.random() - 0.5) * 6;
        const y = (Math.random() - 0.5) * 4;
        const z = (Math.random() - 0.5) * 4;
        
        // Create particle geometry with random size
        const size = 0.05 + Math.random() * 0.1;
        const particleGeometry = new THREE.SphereGeometry(size, 8, 8);
        
        // Material for the particle
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: config.verse7.particleColor,
            transparent: true,
            opacity: 0.8
        });
        
        // Create particle pair
        const particle1 = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        const particle2 = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        
        // Position them close together
        particle1.position.set(x, y, z);
        particle2.position.set(x + size * 2, y, z);
        
        // Add to scene
        scene.add(particle1);
        scene.add(particle2);
        
        // Add to particles array with lifetime
        particles.push({
            meshes: [particle1, particle2],
            lifetime: 0,
            maxLifetime: particleLifetime * (0.5 + Math.random()),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01
            )
        });
        
        // Limit number of particles
        if (particles.length > maxParticles) {
            const oldestPair = particles.shift();
            oldestPair.meshes.forEach(mesh => scene.remove(mesh));
        }
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now();
        
        // Create new particle pairs if active
        if (fluctuationsActive && Math.random() < fluctuationRate) {
            createParticlePair();
        }
        
        // Update existing particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const pair = particles[i];
            
            // Increase lifetime
            pair.lifetime += 16; // Approx. 16ms per frame
            
            // Move particles apart
            if (pair.meshes[0] && pair.meshes[1]) {
                // Move first particle
                pair.meshes[0].position.add(pair.velocity);
                
                // Move second particle in opposite direction
                const oppositeVelocity = pair.velocity.clone().negate();
                pair.meshes[1].position.add(oppositeVelocity);
                
                // Calculate fade based on lifetime
                const fadeRatio = pair.lifetime / pair.maxLifetime;
                const opacity = Math.max(0, 0.8 * (1 - fadeRatio));
                
                // Apply fade
                pair.meshes.forEach(mesh => {
                    if (mesh.material) {
                        mesh.material.opacity = opacity;
                    }
                });
                
                // Remove if lifetime exceeded
                if (pair.lifetime >= pair.maxLifetime) {
                    pair.meshes.forEach(mesh => scene.remove(mesh));
                    particles.splice(i, 1);
                }
            }
        }
        
        // Rotate grid slightly for dynamic effect
        gridHelper.rotation.y = time * 0.0001;
        
        // Pulse glow
        const glowPulse = 0.3 + 0.05 * Math.sin(time * 0.001);
        glowMaterial.opacity = glowPulse;
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Store cleanup function
    animations[`verse7`] = {
        cleanup: function() {
            // Remove event listeners
            window.removeEventListener('resize', onWindowResize);
            
            // Remove all particles
            particles.forEach(pair => {
                pair.meshes.forEach(mesh => scene.remove(mesh));
            });
            
            // Dispose of geometries, materials
            glowGeometry.dispose();
            glowMaterial.dispose();
            
            // Dispose of renderer
            renderer.dispose();
            
            // Remove renderer element from DOM
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    };
}

function initializeVerse8Animation(container) {
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Configuration variables
    let currentContext = config.verse8.currentContext;
    const transitionSpeed = config.verse8.transitionSpeed;
    
    // Create base object (always present)
    const baseGeometry = new THREE.OctahedronGeometry(1, 0);
    const baseMaterial = new THREE.MeshPhongMaterial({
        color: 0x666666,
        transparent: true,
        opacity: 0.2,
        wireframe: true
    });
    const baseObject = new THREE.Mesh(baseGeometry, baseMaterial);
    scene.add(baseObject);
    
    // Create context objects
    const contextGeometries = {
        A: new THREE.BoxGeometry(1.5, 1.5, 1.5),
        B: new THREE.SphereGeometry(1.2, 32, 32),
        C: new THREE.TorusGeometry(1, 0.4, 16, 64),
        D: new THREE.TorusKnotGeometry(1, 0.3, 64, 16)
    };
    
    const contextMaterials = {
        A: new THREE.MeshPhongMaterial({
            color: new THREE.Color(config.verse8.contextA.color),
            transparent: true,
            opacity: 0.7
        }),
        B: new THREE.MeshPhongMaterial({
            color: new THREE.Color(config.verse8.contextB.color),
            transparent: true,
            opacity: 0.7
        }),
        C: new THREE.MeshPhongMaterial({
            color: new THREE.Color(config.verse8.contextC.color),
            transparent: true,
            opacity: 0.7
        }),
        D: new THREE.MeshPhongMaterial({
            color: new THREE.Color(config.verse8.contextD.color),
            transparent: true,
            opacity: 0.7
        })
    };
    
    // Create meshes for each context
    const contextObjects = {
        A: new THREE.Mesh(contextGeometries.A, contextMaterials.A),
        B: new THREE.Mesh(contextGeometries.B, contextMaterials.B),
        C: new THREE.Mesh(contextGeometries.C, contextMaterials.C),
        D: new THREE.Mesh(contextGeometries.D, contextMaterials.D)
    };
    
    // Add all objects to scene (will control visibility)
    Object.values(contextObjects).forEach(obj => {
        obj.visible = false;
        scene.add(obj);
    });
    
    // Set initial context
    contextObjects[currentContext].visible = true;
    
    // Create label for current context
    function createContextLabel() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'bold 36px Arial';
        context.fillStyle = '#ffffff';
        
        // Get label for current context
        let label;
        switch(currentContext) {
            case 'A': label = config.verse8.contextA.label; break;
            case 'B': label = config.verse8.contextB.label; break;
            case 'C': label = config.verse8.contextC.label; break;
            case 'D': label = config.verse8.contextD.label; break;
            default: label = 'Unknown Context';
        }
        
        // Center text
        const textMetrics = context.measureText(label);
        const x = (canvas.width - textMetrics.width) / 2;
        
        context.fillText(label, x, 70);
        
        const texture = new THREE.CanvasTexture(canvas);
        
        return texture;
    }
    
    // Create sprite for label
    const labelMaterial = new THREE.SpriteMaterial({ 
        map: createContextLabel(),
        transparent: true
    });
    const labelSprite = new THREE.Sprite(labelMaterial);
    labelSprite.position.y = -2;
    labelSprite.scale.set(2, 0.5, 1);
    scene.add(labelSprite);
    
    // Update label when context changes
    function updateContextLabel() {
        labelMaterial.map = createContextLabel();
        labelMaterial.needsUpdate = true;
        
        // Also update DOM label if it exists
        const contextLabel = document.querySelector('.context-label');
        if (contextLabel) {
            let label;
            switch(currentContext) {
                case 'A': label = config.verse8.contextA.label; break;
                case 'B': label = config.verse8.contextB.label; break;
                case 'C': label = config.verse8.contextC.label; break;
                case 'D': label = config.verse8.contextD.label; break;
                default: label = 'Unknown Context';
            }
            contextLabel.textContent = `Current Context: ${label}`;
        }
    }
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight1.position.set(1, 1, 2);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(-1, -1, -1);
    scene.add(directionalLight2);
    
    // Event listeners for controls
    const changeContextBtn = document.getElementById('change-context');
    if (changeContextBtn) {
        changeContextBtn.addEventListener('click', () => {
            // Cycle through contexts: A -> B -> C -> D -> A
            const contexts = ['A', 'B', 'C', 'D'];
            const currentIndex = contexts.indexOf(currentContext);
            const nextIndex = (currentIndex + 1) % contexts.length;
            
            changeContext(contexts[nextIndex]);
        });
    }
    
    // Animation variables
    let transitioning = false;
    let transitionProgress = 0;
    let fromContext = 'A';
    let toContext = 'A';
    
    // Function to change context with animated transition
    function changeContext(newContext) {
        if (transitioning || newContext === currentContext) return;
        
        fromContext = currentContext;
        toContext = newContext;
        transitioning = true;
        transitionProgress = 0;
        
        // Make both objects visible during transition
        contextObjects[fromContext].visible = true;
        contextObjects[toContext].visible = true;
        
        // Update context in config
        config.verse8.currentContext = newContext;
        currentContext = newContext;
        
        // Update the label
        updateContextLabel();
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Handle transition animation
        if (transitioning) {
            transitionProgress += 1000 / transitionSpeed / 60; // Approx. 60fps
            
            if (transitionProgress >= 1) {
                // Transition complete
                transitioning = false;
                
                // Hide the old context object
                contextObjects[fromContext].visible = false;
                
                // Reset opacity of new object
                contextObjects[toContext].material.opacity = 0.7;
            } else {
                // Animate transition
                const fadeOut = 1 - transitionProgress;
                const fadeIn = transitionProgress;
                
                contextObjects[fromContext].material.opacity = fadeOut * 0.7;
                contextObjects[toContext].material.opacity = fadeIn * 0.7;
                
                // Animate scale
                contextObjects[fromContext].scale.setScalar(1 + fadeOut * 0.2);
                contextObjects[toContext].scale.setScalar(0.8 + fadeIn * 0.2);
            }
        }
        
        // Rotate all visible objects
        Object.keys(contextObjects).forEach(key => {
            const obj = contextObjects[key];
            if (obj.visible) {
                obj.rotation.x = time * 0.3;
                obj.rotation.y = time * 0.5;
            }
        });
        
        // Rotate base object slightly differently
        baseObject.rotation.x = time * 0.2;
        baseObject.rotation.y = time * 0.4;
        baseObject.rotation.z = time * 0.1;
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Store cleanup function
    animations[`verse8`] = {
        cleanup: function() {
            // Remove event listeners
            window.removeEventListener('resize', onWindowResize);
            
            // Dispose of geometries, materials, textures
            baseGeometry.dispose();
            baseMaterial.dispose();
            
            Object.values(contextGeometries).forEach(geometry => geometry.dispose());
            Object.values(contextMaterials).forEach(material => material.dispose());
            
            if (labelMaterial.map) labelMaterial.map.dispose();
            labelMaterial.dispose();
            
            // Dispose of renderer
            renderer.dispose();
            
            // Remove renderer element from DOM
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    };
}

function initializeVerse9Animation(container) {
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Configuration variables
    let differentiationActive = config.verse9.differentiationActive;
    let waveSmoothness = config.verse9.waveSmoothness / 100; // Convert to 0-1 range
    const waveSpeed = config.verse9.waveSpeed;
    const waveHeight = config.verse9.waveHeight / 100;
    
    // Create wave surface
    const waveSegments = 100;
    const waveWidth = 5;
    const waveDepth = 5;
    
    // Create geometry for the wave surface
    const waveGeometry = new THREE.PlaneGeometry(
        waveWidth, 
        waveDepth, 
        waveSegments, 
        waveSegments
    );
    
    // Materials for different states
    const smoothMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.verse9.smoothColor),
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
        flatShading: false,
        shininess: 80
    });
    
    const differentiatedMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.verse9.differentiatedColor),
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
        flatShading: true, // Enable flat shading for angular appearance
        shininess: 30
    });
    
    // Create the wave mesh with initial material
    const wave = new THREE.Mesh(
        waveGeometry, 
        differentiationActive ? differentiatedMaterial : smoothMaterial
    );
    wave.rotation.x = -Math.PI / 2; // Lay flat
    scene.add(wave);
    
    // Add a grid for reference
    const gridHelper = new THREE.GridHelper(10, 20, 0x111122, 0x222233);
    gridHelper.position.y = -0.2;
    scene.add(gridHelper);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0x8080ff, 0.5);
    directionalLight2.position.set(-1, 0.5, -1);
    scene.add(directionalLight2);
    
    // Event listeners for controls
    const toggleDifferentiationBtn = document.getElementById('toggle-differentiation');
    if (toggleDifferentiationBtn) {
        toggleDifferentiationBtn.addEventListener('click', () => {
            differentiationActive = !differentiationActive;
            config.verse9.differentiationActive = differentiationActive;
            
            // Update wave material
            wave.material = differentiationActive ? differentiatedMaterial : smoothMaterial;
            
            // Update button text
            if (toggleDifferentiationBtn.textContent) {
                toggleDifferentiationBtn.textContent = differentiationActive ? 
                    'Show Suchness (Undifferentiated)' : 'Show Differentiation';
            }
        });
    }
    
    const waveSmoothSlider = document.getElementById('wave-smoothness');
    if (waveSmoothSlider) {
        waveSmoothSlider.value = config.verse9.waveSmoothness;
        waveSmoothSlider.addEventListener('input', () => {
            waveSmoothness = parseInt(waveSmoothSlider.value) / 100;
            config.verse9.waveSmoothness = parseInt(waveSmoothSlider.value);
        });
    }
    
    // Function to update wave vertices
    function updateWave(time) {
        const positions = waveGeometry.attributes.position;
        const vertex = new THREE.Vector3();
        
        // The smoothness factor affects the frequency of waves
        const frequencyFactor = 1 - waveSmoothness;
        
        for (let i = 0; i < positions.count; i++) {
            vertex.fromBufferAttribute(positions, i);
            
            // Original position (on the flat plane)
            const origX = vertex.x;
            const origZ = vertex.y; // Y in buffer is Z in our rotated mesh
            
            // Wave calculation - based on smoothness
            if (differentiationActive) {
                // More angular, distinct waves when differentiated
                const frequency = 1 + frequencyFactor * 3;
                const distanceFromCenter = Math.sqrt(origX * origX + origZ * origZ);
                
                // Create sharper peaks with modulo operation
                let height = Math.sin(distanceFromCenter * frequency - time) * waveHeight;
                height += Math.sin(origX * frequency * 1.5 - time * 1.3) * waveHeight * 0.5;
                
                // Add some noise for more differentiation
                height += (Math.random() - 0.5) * 0.05 * waveHeight;
                
                vertex.z = height;
            } else {
                // Smooth, flowing waves for suchness
                const frequency = 0.5 + frequencyFactor * 0.5;
                const distanceFromCenter = Math.sqrt(origX * origX + origZ * origZ);
                
                // Create gentle, harmonious patterns
                let height = Math.sin(distanceFromCenter * frequency - time) * waveHeight;
                height += Math.sin(origX * frequency * 0.8 - time * 0.7) * waveHeight * 0.3;
                height += Math.cos(origZ * frequency * 0.8 - time * 0.6) * waveHeight * 0.3;
                
                vertex.z = height;
            }
            
            // Update position
            positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        positions.needsUpdate = true;
        waveGeometry.computeVertexNormals();
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Update wave
        updateWave(time * waveSpeed);
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Store cleanup function
    animations[`verse9`] = {
        cleanup: function() {
            // Remove event listeners
            window.removeEventListener('resize', onWindowResize);
            
            // Dispose of geometries, materials
            waveGeometry.dispose();
            smoothMaterial.dispose();
            differentiatedMaterial.dispose();
            
            // Dispose of renderer
            renderer.dispose();
            
            // Remove renderer element from DOM
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    };
}

function initializeVerse10Animation(container) {
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 6;
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Configuration variables
    let entangled = config.verse10.entangled;
    const particle1Color = new THREE.Color(config.verse10.particle1Color);
    const particle2Color = new THREE.Color(config.verse10.particle2Color);
    const connectionColor = new THREE.Color(config.verse10.connectionColor);
    const particleSize = config.verse10.particleSize / 100;
    const distance = config.verse10.distance / 100;
    const rotationSpeed = config.verse10.rotationSpeed;
    
    // Create particle geometry
    const particleGeometry = new THREE.SphereGeometry(particleSize, 32, 32);
    
    // Create particle materials
    const particle1Material = new THREE.MeshPhongMaterial({
        color: particle1Color,
        transparent: true,
        opacity: 0.8,
        shininess: 80
    });
    
    const particle2Material = new THREE.MeshPhongMaterial({
        color: particle2Color,
        transparent: true,
        opacity: 0.8,
        shininess: 80
    });
    
    // Create particles
    const particle1 = new THREE.Mesh(particleGeometry, particle1Material);
    particle1.position.x = -distance;
    scene.add(particle1);
    
    const particle2 = new THREE.Mesh(particleGeometry, particle2Material);
    particle2.position.x = distance;
    scene.add(particle2);
    
    // Connection between particles
    const connectionGeometry = new THREE.CylinderGeometry(0.03, 0.03, distance * 2, 16);
    connectionGeometry.rotateZ(Math.PI / 2); // Orient horizontally
    
    const connectionMaterial = new THREE.MeshBasicMaterial({
        color: connectionColor,
        transparent: true,
        opacity: 0.5
    });
    
    const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
    scene.add(connection);
    
    // Create axes for each particle to represent spin states
    const axisGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.5, 8);
    const axisMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const axis1 = new THREE.Group();
    const axis1X = new THREE.Mesh(axisGeometry, axisMaterial.clone());
    axis1X.material.color.set(0xff5555);
    axis1X.rotation.z = Math.PI / 2;
    
    const axis1Y = new THREE.Mesh(axisGeometry, axisMaterial.clone());
    axis1Y.material.color.set(0x55ff55);
    
    const axis1Z = new THREE.Mesh(axisGeometry, axisMaterial.clone());
    axis1Z.material.color.set(0x5555ff);
    axis1Z.rotation.x = Math.PI / 2;
    
    axis1.add(axis1X);
    axis1.add(axis1Y);
    axis1.add(axis1Z);
    particle1.add(axis1);
    
    const axis2 = new THREE.Group();
    const axis2X = new THREE.Mesh(axisGeometry, axisMaterial.clone());
    axis2X.material.color.set(0xff5555);
    axis2X.rotation.z = Math.PI / 2;
    
    const axis2Y = new THREE.Mesh(axisGeometry, axisMaterial.clone());
    axis2Y.material.color.set(0x55ff55);
    
    const axis2Z = new THREE.Mesh(axisGeometry, axisMaterial.clone());
    axis2Z.material.color.set(0x5555ff);
    axis2Z.rotation.x = Math.PI / 2;
    
    axis2.add(axis2X);
    axis2.add(axis2Y);
    axis2.add(axis2Z);
    particle2.add(axis2);
    
    // Create arrows to show spin direction
    const arrowGeometry = new THREE.ConeGeometry(0.05, 0.1, 8);
    
    const arrow1 = new THREE.Mesh(arrowGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    arrow1.position.y = 0.3;
    particle1.add(arrow1);
    
    const arrow2 = new THREE.Mesh(arrowGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    arrow2.position.y = 0.3;
    arrow2.rotation.x = Math.PI; // Point in opposite direction
    particle2.add(arrow2);
    
    // Group containing both particles and connection
    const particleSystem = new THREE.Group();
    particleSystem.add(particle1);
    particleSystem.add(particle2);
    particleSystem.add(connection);
    scene.add(particleSystem);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xccccff, 0.3);
    directionalLight2.position.set(-1, -1, -1);
    scene.add(directionalLight2);
    
    // Event listeners for controls
    const measureEntangledBtn = document.getElementById('measure-entangled');
    if (measureEntangledBtn) {
        measureEntangledBtn.addEventListener('click', () => {
            // Only trigger if currently entangled
            if (entangled) {
                // Measure one particle, affecting the other
                measureParticles();
            }
        });
    }
    
    const resetEntanglementBtn = document.getElementById('reset-entanglement');
    if (resetEntanglementBtn) {
        resetEntanglementBtn.addEventListener('click', () => {
            resetEntanglement();
        });
    }
    
    // Rotation state
    let particle1Rotation = { x: 0, y: 0, z: 0 };
    let particle2Rotation = { x: 0, y: 0, z: 0 };
    let targetRotation1 = { x: 0, y: 0, z: 0 };
    let targetRotation2 = { x: 0, y: 0, z: 0 };
    let animatingMeasurement = false;
    let animationProgress = 0;
    
    // Function to measure the entangled particles
    function measureParticles() {
        entangled = false;
        config.verse10.entangled = false;
        animatingMeasurement = true;
        animationProgress = 0;
        
        // Randomly choose a measurement result
        const randomAngleX = Math.random() * Math.PI * 2;
        const randomAngleY = Math.random() * Math.PI * 2;
        const randomAngleZ = Math.random() * Math.PI * 2;
        
        // Set target rotations for both particles
        // For entangled particles, they are correlated but opposite
        targetRotation1 = { 
            x: randomAngleX, 
            y: randomAngleY, 
            z: randomAngleZ 
        };
        
        targetRotation2 = { 
            x: randomAngleX + Math.PI, 
            y: randomAngleY + Math.PI, 
            z: randomAngleZ + Math.PI 
        };
        
        // Make connection fade out
        const originalOpacity = connectionMaterial.opacity;
        connectionMaterial.opacity = 0;
        
        // Flash particles to indicate measurement
        particle1Material.emissive.set(particle1Color);
        particle2Material.emissive.set(particle2Color);
        
        setTimeout(() => {
            particle1Material.emissive.set(0x000000);
            particle2Material.emissive.set(0x000000);
        }, 300);
    }
    
    // Function to reset entanglement
    function resetEntanglement() {
        entangled = true;
        config.verse10.entangled = true;
        animatingMeasurement = false;
        
        // Reset rotations
        particle1Rotation = { x: 0, y: 0, z: 0 };
        particle2Rotation = { x: 0, y: 0, z: 0 };
        particle1.rotation.set(0, 0, 0);
        particle2.rotation.set(0, 0, 0);
        
        // Restore connection
        connectionMaterial.opacity = 0.5;
    }
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Rotate entire system slowly
        particleSystem.rotation.y = time * rotationSpeed;
        
        if (entangled) {
            // When entangled, particles rotate in sync
            const rotX = Math.sin(time * 0.5) * 0.2;
            const rotY = Math.sin(time * 0.7) * 0.2;
            const rotZ = Math.sin(time * 0.3) * 0.2;
            
            particle1.rotation.set(rotX, rotY, rotZ);
            particle2.rotation.set(-rotX, -rotY, -rotZ); // Opposite rotation
            
            // Pulse connection
            connection.material.opacity = 0.3 + Math.sin(time * 2) * 0.2;
            
        } else if (animatingMeasurement) {
            // Animate transition to measured state
            animationProgress += 0.02;
            
            if (animationProgress >= 1) {
                animatingMeasurement = false;
                
                // Set final rotations
                particle1.rotation.set(
                    targetRotation1.x,
                    targetRotation1.y,
                    targetRotation1.z
                );
                
                particle2.rotation.set(
                    targetRotation2.x,
                    targetRotation2.y,
                    targetRotation2.z
                );
                
                particle1Rotation = targetRotation1;
                particle2Rotation = targetRotation2;
            } else {
                // Interpolate rotations
                particle1.rotation.x = THREE.MathUtils.lerp(particle1Rotation.x, targetRotation1.x, animationProgress);
                particle1.rotation.y = THREE.MathUtils.lerp(particle1Rotation.y, targetRotation1.y, animationProgress);
                particle1.rotation.z = THREE.MathUtils.lerp(particle1Rotation.z, targetRotation1.z, animationProgress);
                
                particle2.rotation.x = THREE.MathUtils.lerp(particle2Rotation.x, targetRotation2.x, animationProgress);
                particle2.rotation.y = THREE.MathUtils.lerp(particle2Rotation.y, targetRotation2.y, animationProgress);
                particle2.rotation.z = THREE.MathUtils.lerp(particle2Rotation.z, targetRotation2.z, animationProgress);
            }
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Store cleanup function
    animations[`verse10`] = {
        cleanup: function() {
            // Remove event listeners
            window.removeEventListener('resize', onWindowResize);
            
            // Dispose of geometries, materials
            particleGeometry.dispose();
            particle1Material.dispose();
            particle2Material.dispose();
            connectionGeometry.dispose();
            connectionMaterial.dispose();
            axisGeometry.dispose();
            axisMaterial.dispose();
            arrowGeometry.dispose();
            
            // Dispose of renderer
            renderer.dispose();
            
            // Remove renderer element from DOM
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    };
}

function initializeVerse11Animation(container) {
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 7;
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Configuration variables
    let localityActive = config.verse11.localityActive;
    const particle1Color = new THREE.Color(config.verse11.particle1Color);
    const particle2Color = new THREE.Color(config.verse11.particle2Color);
    const effectColor = new THREE.Color(config.verse11.effectColor);
    let distance = config.verse11.distance / 20; // Convert to appropriate scale
    const effectSpeed = config.verse11.effectSpeed;
    const particleSize = config.verse11.particleSize / 100;
    
    // Create geometry for particles
    const particleGeometry = new THREE.SphereGeometry(particleSize, 32, 32);
    
    // Create materials
    const particle1Material = new THREE.MeshPhongMaterial({
        color: particle1Color,
        transparent: true,
        opacity: 0.9,
        shininess: 90
    });
    
    const particle2Material = new THREE.MeshPhongMaterial({
        color: particle2Color,
        transparent: true,
        opacity: 0.9,
        shininess: 90
    });
    
    // Create particles
    const particle1 = new THREE.Mesh(particleGeometry, particle1Material);
    particle1.position.x = -distance;
    scene.add(particle1);
    
    const particle2 = new THREE.Mesh(particleGeometry, particle2Material);
    particle2.position.x = distance;
    scene.add(particle2);
    
    // Create effect path for non-locality visualization
    const effectPathGeometry = new THREE.TubeGeometry(
        new THREE.LineCurve3(
            new THREE.Vector3(-distance, 0, 0),
            new THREE.Vector3(distance, 0, 0)
        ),
        20, // Path segments
        0.1, // Tube radius
        8, // Radial segments
        false // Closed
    );
    
    const effectPathMaterial = new THREE.MeshBasicMaterial({
        color: effectColor,
        transparent: true,
        opacity: 0,
        wireframe: true
    });
    
    const effectPath = new THREE.Mesh(effectPathGeometry, effectPathMaterial);
    scene.add(effectPath);
    
    // Create effect wave for non-locality
    const effectWaveGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const effectWaveMaterial = new THREE.MeshBasicMaterial({
        color: effectColor,
        transparent: true,
        opacity: 0,
        wireframe: true
    });
    
    const effectWave = new THREE.Mesh(effectWaveGeometry, effectWaveMaterial);
    effectWave.position.copy(particle1.position);
    scene.add(effectWave);
    
    // Create glowing rings around particles
    const ringGeometry = new THREE.TorusGeometry(particleSize * 1.5, 0.02, 16, 48);
    const ring1Material = new THREE.MeshBasicMaterial({
        color: particle1Color,
        transparent: true,
        opacity: 0.5
    });
    
    const ring2Material = new THREE.MeshBasicMaterial({
        color: particle2Color,
        transparent: true,
        opacity: 0.5
    });
    
    const ring1 = new THREE.Mesh(ringGeometry, ring1Material);
    ring1.rotation.x = Math.PI / 2;
    particle1.add(ring1);
    
    const ring2 = new THREE.Mesh(ringGeometry, ring2Material);
    ring2.rotation.x = Math.PI / 2;
    particle2.add(ring2);
    
    // Connect particles with line when in local mode
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-distance, 0, 0),
        new THREE.Vector3(distance, 0, 0)
    ]);
    
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x555555,
        transparent: true,
        opacity: localityActive ? 0.8 : 0
    });
    
    const connectionLine = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(connectionLine);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xccccff, 0.4);
    directionalLight2.position.set(-1, -1, -1);
    scene.add(directionalLight2);
    
    // Animation variables
    let animatingEffect = false;
    let effectProgress = 0;
    
    // Event listeners for controls
    const toggleLocalityBtn = document.getElementById('toggle-locality');
    if (toggleLocalityBtn) {
        toggleLocalityBtn.addEventListener('click', () => {
            localityActive = !localityActive;
            config.verse11.localityActive = localityActive;
            
            // Update visualization
            updateVisualization();
            
            // Trigger effect animation
            if (!animatingEffect) {
                animatingEffect = true;
                effectProgress = 0;
                
                // Reset effect wave
                effectWave.position.copy(particle1.position);
                effectWave.scale.set(1, 1, 1);
                effectWaveMaterial.opacity = 0;
                
                // Flash source particle
                particle1Material.emissive.set(particle1Color);
                setTimeout(() => {
                    particle1Material.emissive.set(0x000000);
                }, 300);
            }
            
            // Update button text
            if (toggleLocalityBtn.textContent) {
                toggleLocalityBtn.textContent = localityActive ? 
                    'Show Non-Locality' : 'Show Locality';
            }
        });
    }
    
    const distanceSlider = document.getElementById('distance');
    if (distanceSlider) {
        distanceSlider.value = config.verse11.distance;
        distanceSlider.addEventListener('input', () => {
            distance = parseInt(distanceSlider.value) / 20;
            config.verse11.distance = parseInt(distanceSlider.value);
            
            // Update particle positions
            particle1.position.x = -distance;
            particle2.position.x = distance;
            
            // Update connection line
            lineGeometry.dispose();
            lineGeometry.setFromPoints([
                new THREE.Vector3(-distance, 0, 0),
                new THREE.Vector3(distance, 0, 0)
            ]);
            
            // Update effect path
            scene.remove(effectPath);
            effectPathGeometry.dispose();
            
            const newEffectPathGeometry = new THREE.TubeGeometry(
                new THREE.LineCurve3(
                    new THREE.Vector3(-distance, 0, 0),
                    new THREE.Vector3(distance, 0, 0)
                ),
                20, // Path segments
                0.1, // Tube radius
                8, // Radial segments
                false // Closed
            );
            
            effectPath.geometry = newEffectPathGeometry;
            scene.add(effectPath);
        });
    }
    
    // Update visualization based on locality mode
    function updateVisualization() {
        // Update connection line visibility
        lineMaterial.opacity = localityActive ? 0.8 : 0;
    }
    
    // Apply initial visualization
    updateVisualization();
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Animate rings around particles
        if (ring1) ring1.rotation.z = time * 0.5;
        if (ring2) ring2.rotation.z = -time * 0.5;
        
        // Animate non-locality effect
        if (animatingEffect) {
            // Progress the effect
            effectProgress += 1000 / effectSpeed / 60; // Approx. 60fps
            
            if (effectProgress < 1) {
                if (localityActive) {
                    // Local effect - moves along the path
                    const position = new THREE.Vector3();
                    position.x = THREE.MathUtils.lerp(-distance, distance, effectProgress);
                    effectWave.position.copy(position);
                    
                    // Make effect visible during transit
                    effectWaveMaterial.opacity = effectProgress < 0.9 ? 0.7 : 0.7 * (1 - (effectProgress - 0.9) * 10);
                } else {
                    // Non-local effect - instantaneous
                    // Just make path briefly visible then fade it
                    effectPathMaterial.opacity = 0.7 * (1 - effectProgress);
                    
                    // Flash target particle immediately
                    if (effectProgress < 0.1) {
                        particle2Material.emissive.set(particle2Color);
                    } else if (effectProgress < 0.2) {
                        particle2Material.emissive.set(0x000000);
                    }
                    
                    // Expand effect wave from particle1
                    const radius = 0.2 + effectProgress * distance * 2;
                    effectWave.scale.set(radius, radius, radius);
                    effectWaveMaterial.opacity = 0.5 * (1 - effectProgress);
                }
            } else {
                // Effect complete
                animatingEffect = false;
                effectWaveMaterial.opacity = 0;
                effectPathMaterial.opacity = 0;
                particle2Material.emissive.set(0x000000);
            }
        }
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Store cleanup function
    animations[`verse11`] = {
        cleanup: function() {
            // Remove event listeners
            window.removeEventListener('resize', onWindowResize);
            
            // Dispose of geometries, materials
            particleGeometry.dispose();
            particle1Material.dispose();
            particle2Material.dispose();
            effectPathGeometry.dispose();
            effectPathMaterial.dispose();
            effectWaveGeometry.dispose();
            effectWaveMaterial.dispose();
            ringGeometry.dispose();
            ring1Material.dispose();
            ring2Material.dispose();
            lineGeometry.dispose();
            lineMaterial.dispose();
            
            // Dispose of renderer
            renderer.dispose();
            
            // Remove renderer element from DOM
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    };
}

function initializeVerse12Animation(container) {
    // Create a scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Configuration variables
    let barrierActive = config.verse12.barrierActive;
    const barrierHeight = config.verse12.barrierHeight / 100; // Convert to 0-1 range
    const particleSize = config.verse12.particleSize / 100;
    const animationSpeed = config.verse12.animationSpeed;
    
    // Create barrier
    const barrierWidth = 0.5;
    const barrierGeometry = new THREE.BoxGeometry(barrierWidth, barrierHeight * 3, 0.5);
    const barrierMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.verse12.barrierColor),
        transparent: true,
        opacity: 0.7
    });
    
    const barrier = new THREE.Mesh(barrierGeometry, barrierMaterial);
    scene.add(barrier);
    
    // Create tunnel visualization
    const tunnelGeometry = new THREE.BoxGeometry(barrierWidth + 0.02, 0.2, 0.55);
    const tunnelMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(config.verse12.tunnelColor),
        transparent: true,
        opacity: 0.5,
        wireframe: true
    });
    
    const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
    tunnel.visible = !barrierActive;
    scene.add(tunnel);
    
    // Create particle
    const particleGeometry = new THREE.SphereGeometry(particleSize, 32, 32);
    const particleMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(config.verse12.particleColor),
        transparent: true,
        opacity: 0.9,
        emissive: new THREE.Color(0x303060)
    });
    
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.x = -3; // Start position
    scene.add(particle);
    
    // Create particle trail
    const trailPoints = [];
    for (let i = 0; i < 50; i++) {
        trailPoints.push(new THREE.Vector3(-3, 0, 0));
    }
    
    const trailGeometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
    const trailMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(config.verse12.particleColor),
        transparent: true,
        opacity: 0.3
    });
    
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    scene.add(trail);
    
    // Create path visualization
    const pathGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-4, 0, 0),
        new THREE.Vector3(-barrierWidth/2, 0, 0),
        new THREE.Vector3(barrierWidth/2, 0, 0),
        new THREE.Vector3(4, 0, 0)
    ]);
    
    const pathMaterial = new THREE.LineDashedMaterial({
        color: 0x555555,
        dashSize: 0.2,
        gapSize: 0.1,
        transparent: true,
        opacity: 0.5
    });
    
    const path = new THREE.Line(pathGeometry, pathMaterial);
    path.computeLineDistances(); // Required for dashed lines
    scene.add(path);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xaaaaff, 0.4);
    directionalLight2.position.set(-1, -1, -1);
    scene.add(directionalLight2);
    
    // Event listeners for controls
    const toggleBarrierBtn = document.getElementById('toggle-barrier');
    if (toggleBarrierBtn) {
        toggleBarrierBtn.addEventListener('click', () => {
            barrierActive = !barrierActive;
            config.verse12.barrierActive = barrierActive;
            
            // Update visualization
            tunnel.visible = !barrierActive;
            
            // Update button text
            if (toggleBarrierBtn.textContent) {
                toggleBarrierBtn.textContent = barrierActive ? 
                    'Enable Tunneling' : 'Disable Tunneling';
            }
        });
    }
    
    const barrierHeightSlider = document.getElementById('barrier-height');
    if (barrierHeightSlider) {
        barrierHeightSlider.value = config.verse12.barrierHeight;
        barrierHeightSlider.addEventListener('input', () => {
            const newHeight = parseInt(barrierHeightSlider.value) / 100;
            config.verse12.barrierHeight = parseInt(barrierHeightSlider.value);
            
            // Update barrier height
            barrierGeometry.dispose();
            const newBarrierGeometry = new THREE.BoxGeometry(barrierWidth, newHeight * 3, 0.5);
            barrier.geometry = newBarrierGeometry;
        });
    }
    
    // Animation variables
    let particlePosition = -3;
    let particleDirection = 1;
    let particleState = "approaching"; // approaching, tunneling, passed
    let tunnelProgress = 0;
    const trailHistory = [];
    
    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Update barrier appearance
        if (!barrierActive) {
            // Make barrier more transparent when tunneling is allowed
            barrierMaterial.opacity = 0.4 + Math.sin(time * 2) * 0.1;
            
            // Animate tunnel glow
            tunnelMaterial.opacity = 0.3 + Math.sin(time * 3) * 0.2;
        } else {
            barrierMaterial.opacity = 0.7;
        }
        
        // Animate particle
        if (particleState === "approaching") {
            // Approach the barrier
            particlePosition += 0.02 * animationSpeed * particleDirection;
            
            // Check if reached barrier
            if (particleDirection > 0 && particlePosition >= -barrierWidth/2) {
                if (barrierActive) {
                    // Reflect off barrier
                    particleDirection = -1;
                    particleMaterial.emissive.set(0x602020); // Change glow to indicate reflection
                    
                    setTimeout(() => {
                        particleMaterial.emissive.set(0x303060);
                    }, 300);
                } else {
                    // Start tunneling
                    particleState = "tunneling";
                    tunnelProgress = 0;
                    particleMaterial.emissive.set(config.verse12.tunnelColor); // Change glow during tunneling
                }
            } else if (particleDirection < 0 && particlePosition <= -3) {
                // Reached left edge, reverse again
                particleDirection = 1;
                particleMaterial.emissive.set(0x303060); // Reset glow
            }
        } else if (particleState === "tunneling") {
            // Animate tunneling
            tunnelProgress += 0.01 * animationSpeed;
            
            if (tunnelProgress >= 1) {
                // Finished tunneling
                particleState = "passed";
                particleMaterial.emissive.set(0x306030); // Change glow to indicate successful tunneling
                particlePosition = barrierWidth/2; // Place just past barrier
            } else {
                // Interpolate position through barrier
                particlePosition = THREE.MathUtils.lerp(-barrierWidth/2, barrierWidth/2, tunnelProgress);
                
                // Add wiggle effect during tunneling
                const wiggle = Math.sin(tunnelProgress * Math.PI * 10) * 0.05;
                particle.position.y = wiggle;
                
                // Pulse opacity during tunneling
                particleMaterial.opacity = 0.5 + Math.sin(tunnelProgress * Math.PI * 6) * 0.3;
            }
        } else if (particleState === "passed") {
            // Continue moving away from barrier
            particlePosition += 0.02 * animationSpeed;
            
            // Reset when off screen
            if (particlePosition >= 3) {
                // Reset to starting position
                particlePosition = -3;
                particleState = "approaching";
                particleDirection = 1;
                particleMaterial.emissive.set(0x303060); // Reset glow
                particleMaterial.opacity = 0.9; // Reset opacity
                particle.position.y = 0; // Reset any y-offset
            }
        }
        
        // Update particle position
        particle.position.x = particlePosition;
        
        // Update trail
        trailHistory.unshift({
            x: particlePosition,
            y: particle.position.y,
            z: particle.position.z
        });
        
        if (trailHistory.length > 50) {
            trailHistory.pop();
        }
        
        const points = trailHistory.map(p => new THREE.Vector3(p.x, p.y, p.z));
        trail.geometry.dispose();
        trail.geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Store cleanup function
    animations[`verse12`] = {
        cleanup: function() {
            // Remove event listeners
            window.removeEventListener('resize', onWindowResize);
            
            // Dispose of geometries, materials
            barrierGeometry.dispose();
            barrierMaterial.dispose();
            tunnelGeometry.dispose();
            tunnelMaterial.dispose();
            particleGeometry.dispose();
            particleMaterial.dispose();
            trailGeometry.dispose();
            trailMaterial.dispose();
            pathGeometry.dispose();
            pathMaterial.dispose();
            
            // Dispose of renderer
            renderer.dispose();
            
            // Remove renderer element from DOM
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    };
}

// Initialize side panel on page load
initSidePanel();

// Show first verse initially
// Delay slightly to ensure DOM is ready
setTimeout(() => {
     showVerse(1);
}, 100);