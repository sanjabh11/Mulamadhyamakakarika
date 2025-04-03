import { colorThemes } from '../config.js';

let p5Instance;
let particles = [];
let entangled = false;
let measurementResults = [];
let pendingCorrelation = false;

export function initVerse17(container) {
    // Clean up any existing p5 instance
    if (p5Instance) {
        p5Instance.remove();
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
    
    // Create new p5 instance
    p5Instance = new p5((p) => {
        const theme = colorThemes[4]; // Theme for verse 17
        
        p.setup = () => {
            const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
            canvas.parent(container);
            
            // Create two entangled particles
            particles = [
                new Particle(p.width * 0.35, p.height * 0.5, theme.primary, 0),
                new Particle(p.width * 0.65, p.height * 0.5, theme.secondary, 1)
            ];
            
            // Set initial state
            entangled = true;
            measurementResults = [];
            
            // Setup responsive UI
            p.windowResized = () => {
                p.resizeCanvas(window.innerWidth, window.innerHeight);
                
                // Reposition particles
                particles[0].pos.x = p.width * 0.35;
                particles[0].pos.y = p.height * 0.5;
                particles[1].pos.x = p.width * 0.65;
                particles[1].pos.y = p.height * 0.5;
            };
        };
        
        p.draw = () => {
            p.background(0, 20);
            
            // Draw connection line if entangled
            if (entangled) {
                p.stroke(theme.accent);
                p.strokeWeight(2);
                p.line(particles[0].pos.x, particles[0].pos.y, 
                       particles[1].pos.x, particles[1].pos.y);
                
                // Draw entanglement wave
                drawEntanglementWave(p, particles[0].pos, particles[1].pos, theme.accent);
            }
            
            // Draw information labels
            drawLabels(p, theme);
            
            // Update and display particles
            for (let particle of particles) {
                particle.update(p);
                particle.display(p);
            }
            
            // Draw measurement results
            drawMeasurementResults(p, theme);
            
            // Draw buttons
            drawButtons(p, theme);
            
            // Process pending correlation if needed
            if (pendingCorrelation && measurementResults.length === 1) {
                // Short delay before showing correlated measurement
                if (p.frameCount % 60 === 0) {
                    measureParticle(p, measurementResults[0].particleIndex === 0 ? 1 : 0, 
                                    measurementResults[0].result);
                    pendingCorrelation = false;
                }
            }
        };
        
        p.mousePressed = () => {
            // Check for measurement button clicks
            const buttonWidth = 160;
            const buttonHeight = 40;
            const buttonY = p.height - 80;
            
            // Measure first particle button
            if (p.mouseX > (p.width * 0.35) - buttonWidth/2 && 
                p.mouseX < (p.width * 0.35) + buttonWidth/2 && 
                p.mouseY > buttonY && p.mouseY < buttonY + buttonHeight) {
                
                // Only allow measurement if not already measured
                if (!particles[0].measured && entangled) {
                    measureParticle(p, 0);
                    pendingCorrelation = true;
                }
            }
            
            // Measure second particle button
            if (p.mouseX > (p.width * 0.65) - buttonWidth/2 && 
                p.mouseX < (p.width * 0.65) + buttonWidth/2 && 
                p.mouseY > buttonY && p.mouseY < buttonY + buttonHeight) {
                
                // Only allow measurement if not already measured
                if (!particles[1].measured && entangled) {
                    measureParticle(p, 1);
                    pendingCorrelation = true;
                }
            }
            
            // Reset button
            if (p.mouseX > (p.width * 0.5) - buttonWidth/2 && 
                p.mouseX < (p.width * 0.5) + buttonWidth/2 && 
                p.mouseY > buttonY + 50 && p.mouseY < buttonY + 50 + buttonHeight) {
                
                resetExperiment(p);
            }
        };
        
        // Function to draw entanglement wave
        function drawEntanglementWave(p, pos1, pos2, color) {
            const wavesCount = 10;
            const maxAmp = 15;
            const t = p.frameCount * 0.05;
            
            p.push();
            p.noFill();
            p.stroke(color);
            p.strokeWeight(1);
            
            for (let i = 0; i < wavesCount; i++) {
                const progress = i / (wavesCount - 1);
                const opacity = p.map(p.sin(progress * p.PI), 0, 1, 50, 180);
                p.stroke(p.red(color), p.green(color), p.blue(color), opacity);
                
                p.beginShape();
                for (let x = 0; x <= 1; x += 0.01) {
                    const lerpX = p.lerp(pos1.x, pos2.x, x);
                    const lerpY = p.lerp(pos1.y, pos2.y, x);
                    
                    // Create wavy line between particles
                    const amp = maxAmp * p.sin(progress * p.PI);
                    const waveOffset = amp * p.sin(x * p.PI * 8 + t + i);
                    
                    const angle = p.atan2(pos2.y - pos1.y, pos2.x - pos1.x) + p.HALF_PI;
                    const offsetX = waveOffset * p.cos(angle);
                    const offsetY = waveOffset * p.sin(angle);
                    
                    p.vertex(lerpX + offsetX, lerpY + offsetY);
                }
                p.endShape();
            }
            p.pop();
        }
        
        // Function to draw UI labels
        function drawLabels(p, theme) {
            p.push();
            p.fill(255);
            p.textAlign(p.CENTER);
            p.textSize(26);
            p.text("Quantum Entanglement and the Ineffability of Nirvāņa", p.width/2, 60);
            
            p.textSize(18);
            p.text("Particle A", particles[0].pos.x, particles[0].pos.y - 70);
            p.text("Particle B", particles[1].pos.x, particles[1].pos.y - 70);
            
            p.textSize(14);
            p.text("Entangled particles exhibit correlated outcomes", p.width/2, p.height - 140);
            p.text("but cannot transmit information faster than light", p.width/2, p.height - 120);
            
            // State description
            p.textSize(16);
            p.fill(theme.accent);
            if (entangled && !particles[0].measured && !particles[1].measured) {
                p.text("Particles are in an entangled superposition", p.width/2, 90);
            } else if (measurementResults.length === 2) {
                p.text("Both particles measured with correlated outcomes", p.width/2, 90);
            } else if (measurementResults.length === 1) {
                p.text("One particle measured, awaiting correlated outcome", p.width/2, 90);
            }
            
            p.pop();
        }
        
        // Function to draw UI buttons
        function drawButtons(p, theme) {
            p.push();
            const buttonWidth = 160;
            const buttonHeight = 40;
            const buttonY = p.height - 80;
            
            // Draw measure buttons
            for (let i = 0; i < 2; i++) {
                const particle = particles[i];
                const x = i === 0 ? p.width * 0.35 : p.width * 0.65;
                
                p.noStroke();
                if (particle.measured) {
                    // Disabled button
                    p.fill(100);
                } else {
                    // Active button
                    p.fill(p.color(theme.primary));
                }
                
                p.rect(x - buttonWidth/2, buttonY, buttonWidth, buttonHeight, 20);
                
                p.fill(255);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(14);
                p.text("Measure Particle " + (i === 0 ? "A" : "B"), x, buttonY + buttonHeight/2);
            }
            
            // Draw reset button
            p.fill(p.color(theme.accent));
            p.rect(p.width/2 - buttonWidth/2, buttonY + 50, buttonWidth, buttonHeight, 20);
            
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(14);
            p.text("Reset Experiment", p.width/2, buttonY + 50 + buttonHeight/2);
            
            p.pop();
        }
        
        // Function to draw measurement results
        function drawMeasurementResults(p, theme) {
            p.push();
            p.textAlign(p.CENTER);
            p.textSize(16);
            
            for (let result of measurementResults) {
                const x = result.particleIndex === 0 ? p.width * 0.35 : p.width * 0.65;
                p.fill(255);
                p.text("Measured state: " + (result.result ? "UP" : "DOWN"), x, particles[result.particleIndex].pos.y + 70);
                
                // Draw arrow indicating state
                p.fill(result.result ? p.color(theme.accent) : p.color(theme.secondary));
                p.noStroke();
                const arrowY = particles[result.particleIndex].pos.y + 40;
                
                // Arrow head
                p.triangle(
                    x, arrowY + (result.result ? -15 : 15),
                    x - 10, arrowY + (result.result ? 0 : 0),
                    x + 10, arrowY + (result.result ? 0 : 0)
                );
                
                // Arrow body
                p.rect(x - 2, arrowY + (result.result ? -15 : 0), 4, 15);
            }
            p.pop();
        }
        
        // Function to measure a particle
        function measureParticle(p, particleIndex, forcedResult = null) {
            // Determine measurement outcome
            const result = forcedResult !== null ? forcedResult : Math.random() > 0.5;
            
            // Mark particle as measured
            particles[particleIndex].measured = true;
            
            // Flash effect
            particles[particleIndex].flash = 255;
            
            // Add to measurement results
            measurementResults.push({
                particleIndex: particleIndex,
                result: result
            });
            
            // If both particles are now measured, break entanglement
            if (particles[0].measured && particles[1].measured) {
                entangled = false;
            }
        }
        
        // Function to reset the experiment
        function resetExperiment(p) {
            // Reset particles
            for (let particle of particles) {
                particle.measured = false;
                particle.flash = 0;
            }
            
            // Reset state variables
            entangled = true;
            measurementResults = [];
            pendingCorrelation = false;
        }
        
        // Particle class
        class Particle {
            constructor(x, y, color, index) {
                this.pos = p.createVector(x, y);
                this.vel = p.createVector(0, 0);
                this.acc = p.createVector(0, 0);
                this.color = color;
                this.size = 30;
                this.measured = false;
                this.flash = 0;
                this.index = index;
            }
            
            update(p) {
                // Add some slight movement for visual interest
                if (entangled && !this.measured) {
                    this.acc = p.createVector(
                        p.map(p.noise(p.frameCount * 0.01 + this.index * 1000), 0, 1, -0.05, 0.05),
                        p.map(p.noise(p.frameCount * 0.01 + 500 + this.index * 1000), 0, 1, -0.05, 0.05)
                    );
                    
                    this.vel.add(this.acc);
                    this.vel.limit(0.5);
                    this.pos.add(this.vel);
                    
                    // Keep particles from drifting too far
                    const targetX = this.index === 0 ? p.width * 0.35 : p.width * 0.65;
                    const targetY = p.height * 0.5;
                    
                    this.pos.x = p.lerp(this.pos.x, targetX, 0.01);
                    this.pos.y = p.lerp(this.pos.y, targetY, 0.01);
                }
                
                // Fade flash effect
                if (this.flash > 0) {
                    this.flash -= 5;
                }
            }
            
            display(p) {
                p.push();
                
                // Draw glow if entangled
                if (entangled) {
                    p.noStroke();
                    for (let i = 5; i > 0; i--) {
                        const alpha = p.map(i, 5, 0, 50, 150);
                        p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), alpha);
                        const pulseSize = this.size + i * 5 + 10 * p.sin(p.frameCount * 0.05 + this.index);
                        p.ellipse(this.pos.x, this.pos.y, pulseSize);
                    }
                }
                
                // Draw measurement flash
                if (this.flash > 0) {
                    p.noStroke();
                    p.fill(255, this.flash);
                    p.ellipse(this.pos.x, this.pos.y, this.size * 3);
                }
                
                // Draw particle body
                p.noStroke();
                p.fill(this.color);
                p.ellipse(this.pos.x, this.pos.y, this.size);
                
                // Draw particle center
                p.fill(255);
                p.ellipse(this.pos.x, this.pos.y, this.size * 0.3);
                
                p.pop();
            }
        }
    });
}

export function cleanupVerse17() {
    if (p5Instance) {
        p5Instance.remove();
        p5Instance = null;
    }
}