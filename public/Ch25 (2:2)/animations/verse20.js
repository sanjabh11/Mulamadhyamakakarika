import { colorThemes } from '../config.js';

let p5Instance;
let massObjects = [];
let mousePressed = false;
let showLabels = true;

export function initVerse20(container) {
    // Clean up any existing p5 instance
    if (p5Instance) {
        p5Instance.remove();
    }
    
    // Create new p5 instance
    p5Instance = new p5((p) => {
        const theme = colorThemes[7]; // Theme for verse 20
        
        // Grid settings
        const gridSize = 20;
        const pointSize = 8;
        let gridPoints = [];
        
        p.setup = () => {
            const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
            canvas.parent(container);
            
            // Initialize grid
            const cols = Math.ceil(p.width / gridSize) + 1;
            const rows = Math.ceil(p.height / gridSize) + 1;
            
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    gridPoints.push({
                        x: i * gridSize,
                        y: j * gridSize,
                        originalX: i * gridSize,
                        originalY: j * gridSize,
                        distortion: 0
                    });
                }
            }
            
            // Create some massive objects to distort spacetime
            createMassObjects(theme);
            
            // Handle window resize
            p.windowResized = () => {
                p.resizeCanvas(window.innerWidth, window.innerHeight);
                
                // Update grid for new dimensions
                gridPoints = [];
                const cols = Math.ceil(p.width / gridSize) + 1;
                const rows = Math.ceil(p.height / gridSize) + 1;
                
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        gridPoints.push({
                            x: i * gridSize,
                            y: j * gridSize,
                            originalX: i * gridSize,
                            originalY: j * gridSize,
                            distortion: 0
                        });
                    }
                }
                
                // Reset mass objects positions
                massObjects.forEach(obj => {
                    obj.pos.x = p.random(p.width * 0.2, p.width * 0.8);
                    obj.pos.y = p.random(p.height * 0.2, p.height * 0.8);
                });
            };
            
            // Handle mouse press to add new mass objects
            p.mousePressed = () => {
                mousePressed = true;
                if (p.mouseY > 100) { // Avoid creating objects in UI area
                    massObjects.push({
                        pos: p.createVector(p.mouseX, p.mouseY),
                        mass: p.random(20, 40),
                        color: p.color(
                            p.random(100, 255),
                            p.random(100, 255),
                            p.random(100, 255)
                        ),
                        velocity: p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5)),
                        rotation: 0,
                        rotationSpeed: p.random(-0.02, 0.02)
                    });
                }
            };
            
            // Toggle labels on key press
            p.keyPressed = () => {
                if (p.key === ' ') {
                    showLabels = !showLabels;
                }
            };
        };
        
        p.draw = () => {
            p.background(0);
            
            // Draw grid background
            p.stroke(50);
            p.strokeWeight(0.5);
            
            // Calculate and draw distorted grid
            calculateGridDistortion();
            drawDistortedGrid();
            
            // Draw mass objects
            drawMassObjects();
            
            // Draw UI elements
            drawUI(theme);
        };
        
        function createMassObjects(theme) {
            // Create initial massive objects
            massObjects = [];
            
            // Add a central "black hole" representing Nirvana/Samsara center
            massObjects.push({
                pos: p.createVector(p.width / 2, p.height / 2),
                mass: 60,
                color: p.color(theme.accent),
                velocity: p.createVector(0, 0),
                rotation: 0,
                rotationSpeed: 0.01,
                isCenter: true
            });
            
            // Add other smaller objects
            for (let i = 0; i < 5; i++) {
                massObjects.push({
                    pos: p.createVector(
                        p.random(p.width * 0.2, p.width * 0.8),
                        p.random(p.height * 0.2, p.height * 0.8)
                    ),
                    mass: p.random(15, 30),
                    color: i % 2 === 0 ? p.color(theme.primary) : p.color(theme.secondary),
                    velocity: p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5)),
                    rotation: 0,
                    rotationSpeed: p.random(-0.02, 0.02)
                });
            }
        }
        
        function calculateGridDistortion() {
            // Reset grid points to original positions
            gridPoints.forEach(point => {
                point.x = point.originalX;
                point.y = point.originalY;
                point.distortion = 0;
            });
            
            // Apply distortion from each mass
            gridPoints.forEach(point => {
                massObjects.forEach(mass => {
                    // Calculate distance from point to mass
                    const dx = point.x - mass.pos.x;
                    const dy = point.y - mass.pos.y;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    
                    // Apply gravitational distortion
                    if (distance > 0) {
                        const force = mass.mass / distance;
                        const angle = Math.atan2(dy, dx);
                        
                        // Move point toward mass, with distance falloff
                        point.x -= Math.cos(angle) * force * 0.5;
                        point.y -= Math.sin(angle) * force * 0.5;
                        
                        // Record distortion amount for coloring
                        point.distortion += force;
                    }
                });
            });
            
            // Update mass object positions
            massObjects.forEach(mass => {
                mass.pos.add(mass.velocity);
                mass.rotation += mass.rotationSpeed;
                
                // Bounce off edges
                if (mass.pos.x < 0 || mass.pos.x > p.width) mass.velocity.x *= -1;
                if (mass.pos.y < 0 || mass.pos.y > p.height) mass.velocity.y *= -1;
                
                // Apply gravitational attraction to center
                if (!mass.isCenter) {
                    const center = massObjects.find(m => m.isCenter);
                    if (center) {
                        const dx = center.pos.x - mass.pos.x;
                        const dy = center.pos.y - mass.pos.y;
                        const distance = Math.sqrt(dx*dx + dy*dy);
                        
                        // Small attraction force to center
                        if (distance > 0) {
                            const force = 0.01;
                            const angle = Math.atan2(dy, dx);
                            
                            mass.velocity.x += Math.cos(angle) * force;
                            mass.velocity.y += Math.sin(angle) * force;
                        }
                    }
                }
            });
        }
        
        function drawDistortedGrid() {
            // Draw grid connecting points
            p.stroke(40);
            p.strokeWeight(0.5);
            
            const cols = Math.ceil(p.width / gridSize) + 1;
            const rows = Math.ceil(p.height / gridSize) + 1;
            
            // Draw horizontal lines
            for (let j = 0; j < rows; j++) {
                p.beginShape();
                for (let i = 0; i < cols; i++) {
                    const index = i + j * cols;
                    if (index < gridPoints.length) {
                        const point = gridPoints[index];
                        p.vertex(point.x, point.y);
                    }
                }
                p.endShape();
            }
            
            // Draw vertical lines
            for (let i = 0; i < cols; i++) {
                p.beginShape();
                for (let j = 0; j < rows; j++) {
                    const index = i + j * cols;
                    if (index < gridPoints.length) {
                        const point = gridPoints[index];
                        p.vertex(point.x, point.y);
                    }
                }
                p.endShape();
            }
            
            // Draw grid points
            p.noStroke();
            gridPoints.forEach(point => {
                // Color based on distortion
                const distortionNormalized = p.constrain(point.distortion / 10, 0, 1);
                const pointColor = p.lerpColor(
                    p.color(40, 40, 80),
                    p.color(200, 200, 255),
                    distortionNormalized
                );
                
                p.fill(pointColor);
                p.ellipse(point.x, point.y, pointSize * (1 + distortionNormalized));
            });
        }
        
        function drawMassObjects() {
            p.push();
            
            massObjects.forEach(mass => {
                // Draw glow
                p.noStroke();
                for (let i = 5; i > 0; i--) {
                    const alpha = p.map(i, 5, 0, 50, 150);
                    p.fill(p.red(mass.color), p.green(mass.color), p.blue(mass.color), alpha);
                    p.ellipse(mass.pos.x, mass.pos.y, mass.mass * (1 + i/2));
                }
                
                // Draw central sphere
                p.fill(mass.color);
                p.ellipse(mass.pos.x, mass.pos.y, mass.mass);
                
                // For the center object, draw special markings
                if (mass.isCenter) {
                    p.push();
                    p.translate(mass.pos.x, mass.pos.y);
                    p.rotate(mass.rotation);
                    
                    // Draw Yin-Yang symbol
                    const r = mass.mass / 2;
                    
                    // White half
                    p.fill(255);
                    p.arc(0, 0, mass.mass, mass.mass, 0, p.PI);
                    
                    // Black half
                    p.fill(0);
                    p.arc(0, 0, mass.mass, mass.mass, p.PI, p.TWO_PI);
                    
                    // Small circles
                    p.fill(0);
                    p.ellipse(r/2, 0, r/2);
                    
                    p.fill(255);
                    p.ellipse(-r/2, 0, r/2);
                    
                    p.pop();
                    
                    // Labels for central object if enabled
                    if (showLabels) {
                        p.fill(255);
                        p.textSize(14);
                        p.textAlign(p.CENTER);
                        p.text("Saṃsāra ↔ Nirvāņa", mass.pos.x, mass.pos.y + mass.mass/2 + 20);
                    }
                }
            });
            
            p.pop();
        }
        
        function drawUI(theme) {
            p.push();
            
            // Draw heading
            p.fill(255);
            p.textSize(24);
            p.textAlign(p.CENTER);
            p.text("Spacetime Curvature: Saṃsāra and Nirvāņa", p.width/2, 40);
            
            p.textSize(16);
            p.text("The limit of nirvāna is the limit of samsara", p.width/2, 70);
            
            // Instructions
            p.textSize(12);
            p.text("Click to add more mass objects | Press SPACE to toggle labels", p.width/2, p.height - 20);
            
            // Draw labels if enabled
            if (showLabels) {
                // Label for samsara
                p.fill(p.color(theme.primary));
                p.textSize(18);
                p.text("Saṃsāra", p.width * 0.25, 100);
                
                // Label for nirvana
                p.fill(p.color(theme.secondary));
                p.text("Nirvāņa", p.width * 0.75, 100);
            }
            
            p.pop();
        }
    });
}

export function cleanupVerse20() {
    if (p5Instance) {
        p5Instance.remove();
        p5Instance = null;
    }
    massObjects = [];
}

