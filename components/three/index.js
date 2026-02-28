/**
 * Three.js Components Index
 * 
 * Exports all quantum visualization components
 */

export { default as QuantumCanvas, ANIMATION_TYPES, getAnimationTypeFromPrompt } from './QuantumCanvas';
export { default as QuantumScene } from './QuantumScene';
export { default as QuantumLoader } from './QuantumLoader';
export { default as WebGPUCanvas } from './WebGPUCanvas';
export { LODProvider, useLOD, LOD_LEVELS, LOD_CONFIGS, FPSMonitor } from './LODSystem';

// Animation components - all 11 quantum concepts
export { default as EntanglementAnimation } from './animations/EntanglementAnimation';
export { default as SuperpositionAnimation } from './animations/SuperpositionAnimation';
export { default as WaveFunctionAnimation } from './animations/WaveFunctionAnimation';
export { default as DoubleSlitAnimation } from './animations/DoubleSlitAnimation';
export { default as DecoherenceAnimation } from './animations/DecoherenceAnimation';
export { default as NonLocalityAnimation } from './animations/NonLocalityAnimation';
export { default as ObserverEffectAnimation } from './animations/ObserverEffectAnimation';
export { default as QuantumFluctuationsAnimation } from './animations/QuantumFluctuationsAnimation';
export { default as DependentOriginationAnimation } from './animations/DependentOriginationAnimation';
export { default as EmptinessAnimation } from './animations/EmptinessAnimation';
export { default as ComplementarityAnimation } from './animations/ComplementarityAnimation';
