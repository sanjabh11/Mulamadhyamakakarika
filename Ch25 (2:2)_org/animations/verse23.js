import { colorThemes } from '../config.js';

let p5Instance;
let waveMode = true;
let particles = [];
let waves = [];
let userInteracted = false;
let explanationText = "";

export function initVerse23(container) {
    // Clean up any existing p5 instance
    if (p5Instance) {
        p5Instance.remove();
    }
    
    // Create new p5 instance
    p5Instance = new p5((p) => {
        const theme = colorThemes[10]; // Theme for verse 23
        
        p.setup = () => {
            const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
            canvas.parent(container);
            
            // Create particles
            for (let i = 0; i < 30; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.height / 2 + p.random(-100, 100),
                    size: p.random(8, 15),
                    speed: p.random(1, 3) * (p.random() > 0.5 ? 1 : -1),
                    color: p.color(theme.primary)
                });
            }
            
            // Create waves
            const waveCount = 5;
            for (let i = 0; i < waveCount; i++) {
                waves.push({
                    amplitude: p.random(20, 60),
                    wavelength: p.random(100, 200),
                    phase: p.random(p.TWO_PI),
                    speed: p.random(0.02, 0.04),
                    color: p.color(theme.secondary)
                });
            }
            
            // Set initial explanation
            explanationText = "Light behaves as both particles and waves, but we can only observe one aspect at a time";
            
            // Handle window resize
            p.windowResized = () => {
                p.resizeCanvas(window.innerWidth, window.innerHeight);
            };
            
            // Handle mouse press to toggle view
            p.mousePressed = () => {
                if (p.mouseY < p.height - 100) { // Avoid clicking in UI area
                    waveMode = !waveMode;
                    userInteracted = true;
                    
                    explanationText = waveMode ? 
                        "In wave mode, light shows interference patterns" :
                        "In particle mode, light behaves as discrete photons";
                }
            };
            
            // Handle key press
            p.keyPressed = () => {
                if (p.key === ' ') {
                    waveMode = !waveMode;
                    userInteracted = true;
                }
            };
        };
        
        p.draw = () => {
            p.background(0, 30);
            
            // Draw main visualization
            if (waveMode) {
                drawWaveView(p, theme);
            } else {
                drawParticleView(p, theme);
            }
            
            // Draw UI elements
            drawUI(p, theme);
        };
        
        function drawWaveView(p, theme) {
            p.push();
            
            // Draw waves
            for (let wave of waves) {
                p.noFill();
                p.stroke(wave.color);
                p.strokeWeight(2);
                
                p.beginShape();
                for (let x = 0; x < p.width; x += 5) {
                    const y = p.height / 2 + 
                             wave.amplitude * p.sin((x / wave.wavelength) + 
                             wave.phase + (p.frameCount * wave.speed));
                    p.vertex(x, y);
                }
                p.endShape();
                
                // Update phase
                wave.phase += wave.speed;
            }
            
            // Draw interference pattern on bottom
            drawInterferencePattern(p, theme);
            
            p.pop();
        }
        
        function drawParticleView(p, theme) {
            p.push();
            
            // Draw particles
            for (let particle of particles) {
                // Draw glow
                p.noStroke();
                for (let i = 4; i > 0; i--) {
                    p.fill(p.red(particle.color), p.green(particle.color), p.blue(particle.color), 50 / i);
                    p.circle(particle.x, particle.y, particle.size * (i * 1.5));
                }
                
                // Draw particle
                p.fill(particle.color);
                p.circle(particle.x, particle.y, particle.size);
                
                // Update position
                particle.x += particle.speed;
                
                // Wrap around screen
                if (particle.x > p.width + 20) particle.x = -20;
                if (particle.x < -20) particle.x = p.width + 20;
            }
            
            // Draw photoelectric effect on bottom
            drawPhotoelectricEffect(p, theme);
            
            p.pop();
        }
        
        function drawInterferencePattern(p, theme) {
            const patternHeight = 150;
            const y = p.height - patternHeight - 100;
            
            p.push();
            
            // Draw double slit
            p.fill(200);
            p.rect(p.width/2 - 100, y - 40, 200, 30);
            p.fill(0);
            p.rect(p.width/2 - 30, y - 40, 20, 30);
            p.rect(p.width/2 + 10, y - 40, 20, 30);
            
            // Draw interference pattern
            const bandCount = 12;
            const bandWidth = p.width / bandCount;
            
            for (let i = 0; i < bandCount; i++) {
                const intensity = 0.5 + 0.5 * p.sin(i * 0.5 + p.frameCount * 0.02);
                p.fill(p.lerpColor(p.color(0), p.color(theme.secondary), intensity));
                p.noStroke();
                p.rect(i * bandWidth, y, bandWidth, patternHeight);
            }
            
            // Label
            p.fill(255);
            p.textAlign(p.CENTER);
            p.textSize(16);
            p.text("Interference Pattern (Wave Behavior)", p.width/2, y + patternHeight + 20);
            
            p.pop();
        }
        
        function drawPhotoelectricEffect(p, theme) {
            const effectHeight = 150;
            const y = p.height - effectHeight - 100;
            
            p.push();
            
            // Draw metal plate
            p.fill(150);
            p.rect(p.width/2 - 100, y, 200, 30);
            
            // Draw ejected electrons
            for (let i = 0; i < 10; i++) {
                const time = p.frameCount * 0.05 + i * 0.5;
                const x = p.width/2 + p.cos(time) * 50 * p.map(i, 0, 10, 0.5, 2);
                const electronY = y + 15 + p.sin(time) * 50 * p.map(i, 0, 10, 0.5, 2);
                
                p.fill(theme.accent);
                p.circle(x, electronY, 8);
            }
            
            // Draw incident photons
            for (let i = 0; i < 5; i++) {
                const time = (p.frameCount + i * 20) % 100;
                const x = p.map(time, 0, 100, 0, p.width/2 - 110);
                
                p.fill(theme.primary);
                p.circle(x, y + 15, 12);
            }
            
            // Label
            p.fill(255);
            p.textAlign(p.CENTER);
            p.textSize(16);
            p.text("Photoelectric Effect (Particle Behavior)", p.width/2, y + effectHeight);
            
            p.pop();
        }
        
        function drawUI(p, theme) {
            p.push();
            
            // Draw heading
            p.fill(255);
            p.textSize(24);
            p.textAlign(p.CENTER);
            p.text("Quantum Complementarity: Wave-Particle Duality", p.width/2, 40);
            
            // Draw explanation
            p.textSize(18);
            p.fill(p.color(theme.accent));
            p.text(explanationText, p.width/2, 80);
            
            // Draw Buddhist parallel
            p.textSize(16);
            p.fill(255);
            p.text("Similarly, phenomena lack inherent properties like permanence or impermanence", p.width/2, 120);
            p.text("Both perspectives are needed to understand reality completely", p.width/2, 150);
            
            // Current mode indicator
            p.textSize(20);
            p.fill(p.color(waveMode ? theme.secondary : theme.primary));
            p.text(waveMode ? "Wave Mode" : "Particle Mode", p.width/2, p.height - 60);
            
            // Instructions
            p.textSize(14);
            p.fill(200);
            p.text("Click anywhere to toggle between wave and particle view", p.width/2, p.height - 30);
            
            p.pop();
        }
    });
}

export function cleanupVerse23() {
    if (p5Instance) {
        p5Instance.remove();
        p5Instance = null;
    }
    particles = [];
    waves = [];
}