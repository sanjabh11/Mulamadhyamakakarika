import { colorThemes } from '../config.js';

let p5Instance;
let particlePositions = [];
let particleMomentums = [];
let sliderValue = 0.5;
let dragging = false;
let uncertaintyShowing = false;

export function initVerse14(container) {
    // Clean up any existing p5 instance
    if (p5Instance) {
        p5Instance.remove();
        p5Instance = null; // Ensure it's nullified
    }
    
    // Ensure p5 is available
    if (typeof p5 === 'undefined') {
        console.error('p5 is not defined');
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Error loading animation library. Please refresh the page.';
        errorMessage.style.color = 'white';
        errorMessage.style.padding = '20px';
        errorMessage.style.textAlign = 'center';
        container.appendChild(errorMessage);
        return;
    }
    
    try {
        // Create a new p5 instance
        p5Instance = new p5((p) => {
            const theme = colorThemes[1]; // Use theme for verse 14
            const particleCount = 150;
            
            p.setup = () => {
                const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
                canvas.parent(container);
                
                // Initialize particles
                particlePositions = []; // Clear previous particles
                particleMomentums = []; // Clear previous momentums
                for (let i = 0; i < particleCount; i++) {
                    particlePositions.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        size: p.random(3, 8)
                    });
                    
                    particleMomentums.push({
                        vx: p.random(-2, 2),
                        vy: p.random(-2, 2),
                        color: p.color(
                            p.random(100, 255),
                            p.random(100, 255),
                            p.random(100, 255)
                        )
                    });
                }
                
                // Reset state variables
                sliderValue = 0.5;
                dragging = false;
                uncertaintyShowing = false;

                // Create slider for uncertainty principle
                createSlider(p);
            };
            
            p.draw = () => {
                p.background(0, 30);
                
                // Draw the uncertainty principle visualization
                drawUncertaintyVisualization(p, theme);
                
                // Draw the complementarity principle (light/dark)
                drawComplementarityVisualization(p, theme);
                
                // Draw interactive slider
                drawSlider(p, theme);
            };
            
            p.mousePressed = () => {
                // Check if mouse is on slider
                if (p.mouseX > p.width/2 - 150 && p.mouseX < p.width/2 + 150 &&
                    p.mouseY > p.height - 100 && p.mouseY < p.height - 80) {
                    dragging = true;
                }
                
                // Toggle uncertainty when clicking elsewhere
                if (!dragging && p.mouseY < p.height - 120) {
                    uncertaintyShowing = !uncertaintyShowing;
                }
            };
            
            p.mouseReleased = () => {
                dragging = false;
            };
            
            p.mouseDragged = () => {
                if (dragging) {
                    const newX = p.constrain(p.mouseX, p.width/2 - 150, p.width/2 + 150);
                    sliderValue = p.map(newX, p.width/2 - 150, p.width/2 + 150, 0, 1);
                }
            };
            
            p.windowResized = () => {
                p.resizeCanvas(window.innerWidth, window.innerHeight);
            };
        });
    } catch (error) {
        console.error('Failed to initialize p5.js instance for Verse 14:', error);
        const errorMessage = document.createElement('div');
        errorMessage.textContent = `Error initializing Verse 14 animation: ${error.message}. Please try refreshing.`;
        errorMessage.style.color = 'red'; // Make error more visible
        errorMessage.style.padding = '20px';
        errorMessage.style.textAlign = 'center';
        // Clear container before adding error message
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(errorMessage);
        // Ensure p5Instance is null if initialization failed
        if (p5Instance && typeof p5Instance.remove === 'function') {
             p5Instance.remove();
        }
        p5Instance = null;
    }
}

function createSlider(p) {
    // Slider is created through drawing functions
}

function drawSlider(p, theme) {
    // Draw slider track
    p.noFill();
    p.stroke(255, 150);
    p.strokeWeight(2);
    p.rect(p.width/2 - 150, p.height - 100, 300, 20, 10);
    
    // Draw slider handle
    p.fill(p.color(theme.primary));
    p.noStroke();
    const handleX = p.map(sliderValue, 0, 1, p.width/2 - 150, p.width/2 + 150);
    p.circle(handleX, p.height - 90, 30);
    
    // Draw labels
    p.fill(255);
    p.textSize(16);
    p.textAlign(p.CENTER);
    p.text("Position Certainty", p.width/2 - 150, p.height - 110);
    p.text("Momentum Certainty", p.width/2 + 150, p.height - 110);
    
    // Instruction text
    p.textSize(14);
    p.text("Drag slider to adjust uncertainty | Click anywhere to toggle visualization", p.width/2, p.height - 60);
    
    // Draw heading
    p.textSize(24);
    p.fill(p.color(theme.accent));
    p.text("Quantum Complementarity: Position vs. Momentum", p.width/2, p.height - 140);
}

function drawUncertaintyVisualization(p, theme) {
    // Calculate uncertainty levels based on slider
    const positionCertainty = sliderValue;
    const momentumCertainty = 1 - sliderValue;
    
    // Size of position markers
    const positionSize = p.map(positionCertainty, 0, 1, 30, 5);
    
    // Speed of momentum markers
    const speedFactor = p.map(momentumCertainty, 0, 1, 0.2, 3);
    
    // Draw particles based on uncertainty
    for (let i = 0; i < particlePositions.length; i++) {
        const pos = particlePositions[i];
        const mom = particleMomentums[i];
        
        // Update position with velocity
        if (uncertaintyShowing) {
            pos.x += mom.vx * speedFactor;
            pos.y += mom.vy * speedFactor;
            
            // Bounce off walls
            if (pos.x < 0 || pos.x > p.width) mom.vx *= -1;
            if (pos.y < 0 || pos.y > p.height) mom.vy *= -1;
            
            // Constrain to canvas
            pos.x = p.constrain(pos.x, 0, p.width);
            pos.y = p.constrain(pos.y, 0, p.height);
        }
        
        // Draw position marker
        p.noStroke();
        p.fill(p.color(theme.primary));
        p.circle(pos.x, pos.y, positionSize * pos.size / 5);
        
        // Draw momentum vector if showing uncertainty
        if (uncertaintyShowing && momentumCertainty > 0.3) {
            p.stroke(mom.color);
            p.strokeWeight(1);
            const arrowLength = mom.vx * mom.vx + mom.vy * mom.vy;
            p.line(
                pos.x, 
                pos.y, 
                pos.x + mom.vx * 10 * momentumCertainty, 
                pos.y + mom.vy * 10 * momentumCertainty
            );
        }
    }
    
    // Display uncertainty principle information
    p.textSize(18);
    p.fill(255);
    p.textAlign(p.CENTER);
    
    if (uncertaintyShowing) {
        p.text("Position Uncertainty: " + p.nf(1 - positionCertainty, 1, 2), p.width/2, 50);
        p.text("Momentum Uncertainty: " + p.nf(1 - momentumCertainty, 1, 2), p.width/2, 80);
        p.text("ΔxΔp ≥ ħ/2", p.width/2, 110);
    }
}

function drawComplementarityVisualization(p, theme) {
    // Create a yin-yang like visualization to represent mutually exclusive properties
    const centerX = p.width / 2;
    const centerY = p.height / 2;
    const radius = 150;
    
    if (!uncertaintyShowing) {
        // Draw circle divided into light and dark
        p.push();
        p.translate(centerX, centerY);
        
        // Draw outer circle
        p.noFill();
        p.stroke(255);
        p.strokeWeight(2);
        p.circle(0, 0, radius * 2);
        
        // Draw dividing line
        p.stroke(255);
        p.line(-radius, 0, radius, 0);
        
        // Draw top half - "Light" (thing)
        p.fill(p.color(theme.primary));
        p.noStroke();
        p.arc(0, 0, radius * 2, radius * 2, p.PI, 0, p.OPEN);
        
        // Draw bottom half - "Dark" (nothing)
        p.fill(p.color(theme.secondary));
        p.arc(0, 0, radius * 2, radius * 2, 0, p.PI, p.OPEN);
        
        // Draw small circles in each half
        p.fill(p.color(theme.secondary));
        p.circle(0, -radius/2, radius/3);
        
        p.fill(p.color(theme.primary));
        p.circle(0, radius/2, radius/3);
        
        // Labels
        p.fill(255);
        p.textSize(18);
        p.textAlign(p.CENTER);
        p.text("Thing", 0, -radius - 20);
        p.text("Nothing", 0, radius + 40);
        p.text("Mutually Exclusive", 0, 0);
        
        p.pop();
        
        // Title
        p.textSize(24);
        p.fill(p.color(theme.accent));
        p.text("Nirvāņa cannot be both a thing and nothing", centerX, 50);
        p.textSize(18);
        p.fill(255);
        p.text("Like light and dark cannot coexist in the same space", centerX, 80);
    }
}

export function cleanupVerse14() {
    if (p5Instance) {
        p5Instance.remove();
        p5Instance = null;
    }
    particlePositions = [];
    particleMomentums = [];
}