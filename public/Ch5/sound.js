export class SoundManager {
    constructor(soundConfig) {
        this.soundEnabled = soundConfig.enabled;
        this.volume = soundConfig.volume;
        this.sounds = {};
        
        this.initSounds();
    }
    
    initSounds() {
        // Create audio context on first user interaction
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.createSounds();
            }
        }, { once: true });
    }
    
    createSounds() {
        // Create all sounds using Web Audio API
        this.createSound('chime', (ctx) => this.createChimeSound(ctx));
        this.createSound('ping', (ctx) => this.createPingSound(ctx));
        this.createSound('whoosh', (ctx) => this.createWhooshSound(ctx));
        this.createSound('click', (ctx) => this.createClickSound(ctx));
        this.createSound('hum', (ctx) => this.createHumSound(ctx));
        this.createSound('ripple', (ctx) => this.createRippleSound(ctx));
        this.createSound('ding', (ctx) => this.createDingSound(ctx));
        this.createSound('sparkle', (ctx) => this.createSparkleSound(ctx));
    }
    
    createSound(name, generatorFn) {
        if (!this.audioContext) return;
        
        // Generator functions create the audio nodes for each sound
        this.sounds[name] = generatorFn(this.audioContext);
    }
    
    playSound(name) {
        if (!this.soundEnabled || !this.audioContext || !this.sounds[name]) return;
        
        const sound = this.sounds[name];
        
        // Stop sound if it's already playing
        if (sound.source && sound.isPlaying) {
            sound.source.stop();
        }
        
        // Create new source node
        sound.source = this.audioContext.createOscillator();
        sound.source.connect(sound.gainNode);
        
        // Configure source based on sound type
        sound.setup(sound.source, this.audioContext.currentTime);
        
        // Start sound
        sound.source.start();
        sound.isPlaying = true;
        
        // Schedule stop
        if (sound.duration) {
            sound.source.stop(this.audioContext.currentTime + sound.duration);
            
            // Clean up after played
            setTimeout(() => {
                sound.isPlaying = false;
            }, sound.duration * 1000);
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        
        // Update sound toggle button
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            const soundIcon = document.getElementById('sound-icon');
            
            if (!this.soundEnabled) {
                soundIcon.setAttribute('d', 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z');
            } else {
                soundIcon.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
            }
        }
        
        return this.soundEnabled;
    }
    
    createChimeSound(ctx) {
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.1 * this.volume;
        gainNode.connect(ctx.destination);
        
        return {
            gainNode: gainNode,
            setup: (source, time) => {
                source.type = 'sine';
                source.frequency.setValueAtTime(880, time);
                source.frequency.exponentialRampToValueAtTime(440, time + 0.1);
                
                // Envelope
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(0.1 * this.volume, time + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + 1.5);
            },
            duration: 1.5,
            isPlaying: false
        };
    }
    
    createPingSound(ctx) {
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.1 * this.volume;
        gainNode.connect(ctx.destination);
        
        return {
            gainNode: gainNode,
            setup: (source, time) => {
                source.type = 'sine';
                source.frequency.setValueAtTime(1200, time);
                source.frequency.exponentialRampToValueAtTime(900, time + 0.1);
                
                // Envelope
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(0.1 * this.volume, time + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
            },
            duration: 0.3,
            isPlaying: false
        };
    }
    
    createWhooshSound(ctx) {
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.1 * this.volume;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 5;
        
        gainNode.connect(filter);
        filter.connect(ctx.destination);
        
        return {
            gainNode: gainNode,
            setup: (source, time) => {
                source.type = 'sawtooth';
                source.frequency.setValueAtTime(60, time);
                source.frequency.exponentialRampToValueAtTime(220, time + 0.3);
                
                // Envelope
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(0.07 * this.volume, time + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
                
                // Filter sweep
                filter.frequency.setValueAtTime(100, time);
                filter.frequency.exponentialRampToValueAtTime(800, time + 0.3);
            },
            duration: 0.4,
            isPlaying: false
        };
    }
    
    createClickSound(ctx) {
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.1 * this.volume;
        gainNode.connect(ctx.destination);
        
        return {
            gainNode: gainNode,
            setup: (source, time) => {
                source.type = 'square';
                source.frequency.setValueAtTime(60, time);
                source.frequency.exponentialRampToValueAtTime(20, time + 0.02);
                
                // Envelope - very quick attack and decay
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(0.1 * this.volume, time + 0.001);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
            },
            duration: 0.05,
            isPlaying: false
        };
    }
    
    createHumSound(ctx) {
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.05 * this.volume;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 300;
        filter.Q.value = 10;
        
        gainNode.connect(filter);
        filter.connect(ctx.destination);
        
        return {
            gainNode: gainNode,
            setup: (source, time) => {
                source.type = 'sine';
                source.frequency.setValueAtTime(150, time);
                source.frequency.exponentialRampToValueAtTime(250, time + 0.5);
                source.frequency.exponentialRampToValueAtTime(150, time + 1.0);
                
                // Envelope
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(0.05 * this.volume, time + 0.1);
                gainNode.gain.setValueAtTime(0.05 * this.volume, time + 0.9);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + 1.5);
                
                // Filter modulation
                filter.frequency.setValueAtTime(200, time);
                filter.frequency.linearRampToValueAtTime(400, time + 0.5);
                filter.frequency.linearRampToValueAtTime(200, time + 1.0);
            },
            duration: 1.5,
            isPlaying: false
        };
    }
    
    createRippleSound(ctx) {
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.07 * this.volume;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 600;
        
        gainNode.connect(filter);
        filter.connect(ctx.destination);
        
        return {
            gainNode: gainNode,
            setup: (source, time) => {
                source.type = 'sine';
                source.frequency.setValueAtTime(300, time);
                source.frequency.exponentialRampToValueAtTime(150, time + 0.3);
                source.frequency.exponentialRampToValueAtTime(80, time + 0.6);
                
                // Envelope - water droplet-like
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(0.07 * this.volume, time + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.03 * this.volume, time + 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.05 * this.volume, time + 0.3);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.7);
                
                // Filter sweep
                filter.frequency.setValueAtTime(800, time);
                filter.frequency.exponentialRampToValueAtTime(200, time + 0.5);
            },
            duration: 0.7,
            isPlaying: false
        };
    }
    
    createDingSound(ctx) {
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.1 * this.volume;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 500;
        
        gainNode.connect(filter);
        filter.connect(ctx.destination);
        
        return {
            gainNode: gainNode,
            setup: (source, time) => {
                source.type = 'triangle';
                source.frequency.setValueAtTime(800, time);
                source.frequency.setValueAtTime(800, time + 0.01);
                source.frequency.exponentialRampToValueAtTime(700, time + 0.1);
                
                // Bell-like envelope
                gainNode.gain.setValueAtTime(0, time);
                gainNode.gain.linearRampToValueAtTime(0.1 * this.volume, time + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.05 * this.volume, time + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
            },
            duration: 0.8,
            isPlaying: false
        };
    }
    
    createSparkleSound(ctx) {
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.05 * this.volume;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2000;
        
        gainNode.connect(filter);
        filter.connect(ctx.destination);
        
        return {
            gainNode: gainNode,
            setup: (source, time) => {
                source.type = 'triangle';
                
                // Random high-pitched notes in sequence
                const pitches = [2200, 2500, 2800, 3000, 3300];
                const noteDuration = 0.07;
                
                for (let i = 0; i < 5; i++) {
                    const noteTime = time + i * noteDuration;
                    const pitch = pitches[Math.floor(Math.random() * pitches.length)];
                    
                    source.frequency.setValueAtTime(pitch, noteTime);
                    
                    // Each note has its own envelope
                    gainNode.gain.setValueAtTime(0, noteTime);
                    gainNode.gain.linearRampToValueAtTime(0.05 * this.volume, noteTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, noteTime + noteDuration);
                }
            },
            duration: 0.4,
            isPlaying: false
        };
    }
}

