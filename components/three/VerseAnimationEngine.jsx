import { logger } from "@/lib/logger";
/**
 * VerseAnimationEngine - Core config-driven animation engine
 * 
 * Unified engine for all gold-standard chapters. Selects base component
 * from verse data, manages orchestration state machine, renders educational overlays.
 * 
 * Architecture:
 *   verseData.animation → base selection + orchestration
 *   verseData.quantumResonance.concept → base component mapping
 *   verseData.philosophy → educational overlay content
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

import SuperpositionBase from './bases/SuperpositionBase';
import EntanglementBase from './bases/EntanglementBase';
import MeasurementBase from './bases/MeasurementBase';
import CausationBase from './bases/CausationBase';
import GenericBase from './bases/GenericBase';
import { perfMonitor } from '../../lib/performance-monitor';

/**
 * Concept-to-base mapping for Chapter 1
 * Maps quantumResonance.concept → { Component, mode, props }
 */
const VERSE_BASE_MAP = {
  // V1: Superposition / Catuṣkoṭi — tetralemma as ghost states collapsing
  'Superposition': {
    Component: SuperpositionBase,
    mode: 'ghost-states',
  },
  // V2: Feynman Diagrams — four orbital conditions around central void
  'Feynman Diagrams': {
    Component: CausationBase,
    mode: 'orbital',
  },
  // V3: Contextuality / KS Theorem — gold cube inside wireframe sphere
  'Contextuality': {
    Component: MeasurementBase,
    mode: 'contextual',
  },
  // V4: Probability Amplitude — fluid in glass container
  'Probability Amplitude': {
    Component: SuperpositionBase,
    mode: 'fluid',
  },
  // V5: Delayed Choice Quantum Eraser — infinity rings with retro-energy
  'Delayed Choice Quantum Eraser': {
    Component: CausationBase,
    mode: 'infinity',
  },
  // V6: Vacuum Fluctuations — quantum foam surface with bubbles
  'Vacuum Fluctuations': {
    Component: GenericBase,
    mode: 'foam',
  },
  // V7: Quantum Entanglement — paired spheres with scanner
  'Quantum Entanglement': {
    Component: EntanglementBase,
    mode: 'paired',
  },
  // V8: Measurement Problem — observer eye + crystal dissolution
  'Measurement Problem': {
    Component: MeasurementBase,
    mode: 'observer-crystal',
  },
  // V9: Decoherence — temporal chain dissolution
  'Decoherence': {
    Component: CausationBase,
    mode: 'chain',
  },
  // V10: Non-Locality / Bell's Theorem — Bell test detector stations
  'Non-Locality': {
    Component: EntanglementBase,
    mode: 'bell-test',
  },
  "Bell's Theorem": {
    Component: EntanglementBase,
    mode: 'bell-test',
  },
  // V11: Born Rule / Superposition — search chamber
  'Born Rule': {
    Component: SuperpositionBase,
    mode: 'search-chamber',
  },
  // V12: Vacuum Fluctuations (split) — split field mode
  'Quantum Fluctuations': {
    Component: GenericBase,
    mode: 'split-field',
  },
  // V13: Entanglement / Non-Separability — paired with vessels
  'Entanglement': {
    Component: EntanglementBase,
    mode: 'paired',
  },
  'Non-Separability': {
    Component: EntanglementBase,
    mode: 'paired',
  },
  // V14: Complementarity — mandala dissolution
  'Complementarity': {
    Component: CausationBase,
    mode: 'mandala',
  },

  // ─── Chapter 2: Examination of Motion ──────────────────────────────────
  'Quantum Zeno Effect': {
    Component: MeasurementBase,
    mode: 'observer-crystal',
  },
  'Schrödinger Equation / Unitary Evolution': {
    Component: SuperpositionBase,
    mode: 'ghost-states',
  },
  'Kochen-Specker Theorem (Contextuality)': {
    Component: MeasurementBase,
    mode: 'contextual',
  },
  'Superposition Collapse / Measurement Problem': {
    Component: MeasurementBase,
    mode: 'observer-crystal',
  },
  'Renormalisation Problem / Infinite Self-Energy': {
    Component: CausationBase,
    mode: 'chain',
  },
  'Quantum Non-Separability / Holism': {
    Component: EntanglementBase,
    mode: 'paired',
  },
  'Quantum Entanglement (Mutual Constitution)': {
    Component: EntanglementBase,
    mode: 'paired',
  },
  'Superposition / Excluded Middle Violation': {
    Component: SuperpositionBase,
    mode: 'ghost-states',
  },
  'Complementarity / Tautological Framework Descriptions': {
    Component: CausationBase,
    mode: 'mandala',
  },
  'Measurement Back-Action / Observer Effect': {
    Component: MeasurementBase,
    mode: 'observer-crystal',
  },
  'Self-Reference / Formal System Incompleteness': {
    Component: CausationBase,
    mode: 'chain',
  },
  'Heisenberg Uncertainty Principle': {
    Component: SuperpositionBase,
    mode: 'ghost-states',
  },
  'CPT Symmetry / Time-Reversal Invariance': {
    Component: CausationBase,
    mode: 'infinity',
  },
  'Relativity of Simultaneity': {
    Component: CausationBase,
    mode: 'infinity',
  },
  'Position-Momentum Uncertainty / Conjugate Variables': {
    Component: SuperpositionBase,
    mode: 'ghost-states',
  },
  'Complementarity (Bohr)': {
    Component: CausationBase,
    mode: 'mandala',
  },
  'Continuous Unitary Evolution': {
    Component: SuperpositionBase,
    mode: 'fluid',
  },
  'Entanglement / Non-Separability': {
    Component: EntanglementBase,
    mode: 'paired',
  },
  'Observer-System Collapse / Self-Measurement Paradox': {
    Component: MeasurementBase,
    mode: 'observer-crystal',
  },
  "Bell's Theorem / Non-Separability": {
    Component: EntanglementBase,
    mode: 'bell-test',
  },
  'Superposition / Binary Transcendence': {
    Component: SuperpositionBase,
    mode: 'ghost-states',
  },
  'Wave Function Collapse / Pre-Measurement Indeterminacy': {
    Component: MeasurementBase,
    mode: 'observer-crystal',
  },
  'Quantum Identity / Indistinguishability': {
    Component: EntanglementBase,
    mode: 'paired',
  },
  'Virtual Particles / Quantum Vacuum': {
    Component: GenericBase,
    mode: 'foam',
  },
  'Emergent Actuality / Contextual Properties': {
    Component: MeasurementBase,
    mode: 'contextual',
  },

  // ─── Chapter 3: Examination of Perception ──────────────────────────────
  'Quantum Entanglement / Observer-Observed Interdependence': {
    Component: EntanglementBase,
    mode: 'paired',
  },
  'Self-Referential Measurement Problem / Von Neumann Chain': {
    Component: CausationBase,
    mode: 'chain',
  },
  'Spontaneous Emission / No Self-Excitation in QED': {
    Component: GenericBase,
    mode: 'foam',
  },
  'Quantum Contextuality / Kochen-Specker Theorem': {
    Component: MeasurementBase,
    mode: 'contextual',
  },
  'Wave-Particle Complementarity (Bohr)': {
    Component: CausationBase,
    mode: 'mandala',
  },
  "EPR Non-Separability / Bell's Theorem": {
    Component: EntanglementBase,
    mode: 'bell-test',
  },
  'Quantum Measurement Outcome / Emergent Result': {
    Component: MeasurementBase,
    mode: 'observer-crystal',
  },
  'Universality of Quantum Principles / QFT': {
    Component: CausationBase,
    mode: 'orbital',
  },
  'Quantum Holism / Universal Non-Separability': {
    Component: EntanglementBase,
    mode: 'paired',
  },

  // ─── Chapter 4: Examination of Aggregates ─────────────────────────────
  'Quantum Field Excitations / Particle-Field Duality': {
    Component: GenericBase, mode: 'foam',
  },
  'QFT: No Particles Without Fields': {
    Component: GenericBase, mode: 'foam',
  },
  'Unexcited Fields: Physically Meaningless': {
    Component: GenericBase, mode: 'split-field',
  },
  'Quantum Measurement Problem / Superposition Collapse': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Copenhagen Instrumentalism / Anti-Realism': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Quantum State Transformation / Partial Identity': {
    Component: SuperpositionBase, mode: 'fluid',
  },
  'Quantum Holism / Universal Contextuality': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Observer Included in the System / No External Vantage Point': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  "Bell's Theorem / Failed Hidden Variable Programs": {
    Component: EntanglementBase, mode: 'bell-test',
  },

  // ─── Chapter 5: Examination of Elements ───────────────────────────────
  'Quantum Field Identity = Field Properties': {
    Component: GenericBase, mode: 'foam',
  },
  'Kochen-Specker Theorem / Quantum Contextuality': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Quantum Measurement Trilemma / No Pre-Existing Values': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  "Bohr's Complementarity / Measurement Mutual Dependence": {
    Component: CausationBase, mode: 'mandala',
  },
  'QFT — No Substance Beneath Fields': {
    Component: GenericBase, mode: 'foam',
  },
  'Quantum Superposition / Non-Boolean Logic': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Quantum Vacuum / Beyond Classical Categories': {
    Component: GenericBase, mode: 'foam',
  },
  'Measurement Problem as Reification Problem': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },

  // ─── Chapter 6: Examination of Desire and the Desirous ────────────────
  'Relational Quantum Mechanics — No Bare Observer': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Observer-Observable Symmetry in RQM': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Entanglement — Necessary vs. Accidental Correlation': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Indistinguishability vs. Separability — Entanglement as Middle Way': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Entanglement as Non-Classical Association': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Complementarity — Impossibility of Independent Specification': {
    Component: CausationBase, mode: 'mandala',
  },
  'EPR Paradox — Correlation Argues Against Independence': {
    Component: EntanglementBase, mode: 'bell-test',
  },
  "Hidden Variable Inconsistency (Bell's Theorem)": {
    Component: EntanglementBase, mode: 'bell-test',
  },
  'Quantum Indeterminacy — Undefined Relata': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Relational Quantum Mechanics (RQM) — Universal Relationality': {
    Component: MeasurementBase, mode: 'contextual',
  },

  // ─── Chapter 7: Examination of Arising, Abiding, Ceasing ─────────────
  'Quantum Vacuum Fluctuations': {
    Component: GenericBase, mode: 'foam',
  },
  'Quantum Complementarity': {
    Component: CausationBase, mode: 'mandala',
  },
  'Renormalization in Quantum Field Theory': {
    Component: GenericBase, mode: 'split-field',
  },
  'Bootstrap Models in Particle Physics': {
    Component: CausationBase, mode: 'orbital',
  },
  'Causal Loops and the Grandfather Paradox': {
    Component: CausationBase, mode: 'infinity',
  },
  'Retrocausation in Quantum Mechanics': {
    Component: CausationBase, mode: 'infinity',
  },
  'Virtual Particles and Vacuum Fluctuations': {
    Component: GenericBase, mode: 'foam',
  },
  'Self-Interaction in Quantum Field Theory': {
    Component: CausationBase, mode: 'chain',
  },
  'Pauli Exclusion Principle': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Locality Principle in Physics': {
    Component: CausationBase, mode: 'orbital',
  },
  'Non-Locality and the No-Signaling Theorem': {
    Component: EntanglementBase, mode: 'bell-test',
  },
  'Symmetry Principles in Physics': {
    Component: CausationBase, mode: 'mandala',
  },
  'Failure of Classical Dichotomies': {
    Component: CausationBase, mode: 'mandala',
  },
  'Thermodynamic Equilibrium': {
    Component: GenericBase, mode: 'foam',
  },
  'Creation and Annihilation Operators in QFT': {
    Component: GenericBase, mode: 'split-field',
  },
  'Principle of Non-Contradiction': {
    Component: CausationBase, mode: 'chain',
  },
  'Annihilation Operator on Vacuum State': {
    Component: GenericBase, mode: 'split-field',
  },
  'Halting Problem and Self-Referential Termination': {
    Component: CausationBase, mode: 'chain',
  },
  'Matter/Vacuum Dissolution in QFT': {
    Component: GenericBase, mode: 'foam',
  },
  'Particles as Field Excitations': {
    Component: GenericBase, mode: 'foam',
  },

  // ─── Chapter 8: Examination of Agent and Action ───────────────────────
  'Process Ontology in Quantum Mechanics': {
    Component: CausationBase, mode: 'orbital',
  },
  'Conservation Laws in Physics': {
    Component: CausationBase, mode: 'chain',
  },
  'Relational Nature of Physical Laws': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Interdependence of State and Process': {
    Component: CausationBase, mode: 'orbital',
  },
  'Arrow of Time and Entropy': {
    Component: CausationBase, mode: 'infinity',
  },
  'Superposition vs. Contradiction': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Incompatible Observables': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Comprehensive Logical Constraints': {
    Component: CausationBase, mode: 'chain',
  },
  'Vacuum State Constraints': {
    Component: GenericBase, mode: 'foam',
  },
  'No-Go Theorems (Bell, Kochen-Specker)': {
    Component: EntanglementBase, mode: 'bell-test',
  },
  'Quantum Entanglement and Mutual Dependence': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Universality of Quantum Mechanics': {
    Component: CausationBase, mode: 'orbital',
  },

  // ─── Chapter 9: Examination of the Prior Entity ───────────────────────
  'Classical Independent Observer': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Measurement Problem and Observer Status': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  "Hidden Variables and Bell's Theorem": {
    Component: EntanglementBase, mode: 'bell-test',
  },
  'Quantum Entanglement and Non-Separability': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Relational Quantum Mechanics (RQM)': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Quantum Measurement Establishing Properties': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Non-Commutativity and Incompatible Observables': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Quantum Entanglement vs. Product States': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Quantum Holism': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Relational Properties in RQM': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Complementarity and Transcending Dichotomies': {
    Component: CausationBase, mode: 'mandala',
  },

  // ─── Chapter 10: Examination of Fire and Fuel ─────────────────────────
  'Dynamism vs. Static Permanence': {
    Component: CausationBase, mode: 'orbital',
  },
  'Activation Energy and Conditional Processes': {
    Component: CausationBase, mode: 'chain',
  },
  'State vs. Dynamics Distinction': {
    Component: SuperpositionBase, mode: 'fluid',
  },
  'Locality and Interaction Mediation': {
    Component: CausationBase, mode: 'orbital',
  },
  'Chemical Affinity and Interaction Specificity': {
    Component: CausationBase, mode: 'chain',
  },
  'Particle-Antiparticle Annihilation': {
    Component: GenericBase, mode: 'split-field',
  },
  'Measurement Problem and Observer-Observed Interdependence': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Bootstrap Paradox and Self-Reference': {
    Component: CausationBase, mode: 'infinity',
  },
  'Self-Consistent Field Theory': {
    Component: CausationBase, mode: 'orbital',
  },
  'Relational Properties and the Bearer Problem': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Superposition and Transcending Classical Binaries': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Quantum Non-Locality and Indeterminacy': {
    Component: EntanglementBase, mode: 'bell-test',
  },
  'QFT: Particles as Field Excitations': {
    Component: GenericBase, mode: 'foam',
  },
  'Universality of Physical Laws': {
    Component: CausationBase, mode: 'orbital',
  },
  'Misinterpretation of Fundamental Theories': {
    Component: CausationBase, mode: 'chain',
  },

  // ─── Chapter 11: Examination of Prior and Posterior Ends ──────────────
  'Cosmological Singularity and Limits of Spacetime': {
    Component: GenericBase, mode: 'foam',
  },
  'Relativity of Simultaneity': {
    Component: CausationBase, mode: 'infinity',
  },
  'Particle-Antiparticle Creation Pairs': {
    Component: GenericBase, mode: 'split-field',
  },
  'State Preparation and Measurement Order': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Mutual Exclusivity of Quantum Transitions': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'The Problem of Time in Quantum Gravity': {
    Component: CausationBase, mode: 'infinity',
  },
  'Quantum Fields and Excitations as Co-Defined': {
    Component: GenericBase, mode: 'foam',
  },
  'Observer-Observation Entanglement': {
    Component: EntanglementBase, mode: 'paired',
  },

  // ─── Chapter 12: Examination of Suffering ─────────────────────────────
  'Failure of Classical Causation at Quantum Scale': {
    Component: CausationBase, mode: 'chain',
  },
  'Energy Conservation and No Self-Creation': {
    Component: CausationBase, mode: 'chain',
  },
  'Quantum Non-Separability and Entanglement': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Observer-System Entanglement': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Quantum Holism and Non-Separability': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Logical Consistency of Physical Frameworks': {
    Component: CausationBase, mode: 'chain',
  },
  'Cascading Logical Constraints': {
    Component: CausationBase, mode: 'chain',
  },
  "Proof by Exhaustion and Bell's Theorem": {
    Component: EntanglementBase, mode: 'bell-test',
  },
  'Universality of Quantum Principles / Failure of Local Realism': {
    Component: EntanglementBase, mode: 'bell-test',
  },

  // ─── Chapter 13: Examination of Compounded Phenomena ──────────────────
  'Decoherence and Classical Appearance': {
    Component: CausationBase, mode: 'chain',
  },
  'Quantum Formalism as Non-Deceptive Description': {
    Component: SuperpositionBase, mode: 'fluid',
  },
  'Wave-Particle Duality': {
    Component: CausationBase, mode: 'mandala',
  },
  'Quantum Jumps Between Discrete States': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Radioactive Decay and Particle Transformation': {
    Component: GenericBase, mode: 'split-field',
  },
  'Universality of Quantum Laws as Non-Entities': {
    Component: CausationBase, mode: 'orbital',
  },
  'Scientific Method vs. Dogma': {
    Component: CausationBase, mode: 'mandala',
  },

  // ─── Chapter 14: Examination of Contact ───────────────────────────────
  'Quantum Measurement Problem': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Quantum Entanglement and Non-Separability': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Entanglement Challenges Classical Distinctness': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Quantum Superposition and Non-Distinct States': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Wave-Particle Duality and Context-Dependent Identity': {
    Component: CausationBase, mode: 'mandala',
  },
  'Quantum Contextuality (Kochen-Specker)': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Heisenberg Cut / Observer-Observed Boundary': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Entanglement Swapping / Non-Pre-Existing Correlations': {
    Component: EntanglementBase, mode: 'bell-test',
  },

  // ─── Chapter 15: Examination of Essence ───────────────────────────────
  'Wave Function Collapse — No Pre-Existing Properties': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Quantum Indistinguishability of Identical Particles': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Frame-Dependent Quantum Properties': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Superposition — No Definite Entity Before Measurement': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Particle Creation/Annihilation — Field States, Not Inherent Entities': {
    Component: GenericBase, mode: 'split-field',
  },
  'Paradigm Shift from Classical to Quantum Worldview': {
    Component: CausationBase, mode: 'mandala',
  },
  'Quantum Superposition Beyond Binary "Is/Is Not"': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Radioactive Decay — No Unchanging Atomic Essence': {
    Component: GenericBase, mode: 'split-field',
  },
  'Quantum Indeterminacy and the Measurement Problem': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Complementarity — Beyond Binary "Wave" or "Particle"': {
    Component: CausationBase, mode: 'mandala',
  },
  'Quantum Information Conservation — Neither Eternal nor Annihilated': {
    Component: CausationBase, mode: 'chain',
  },

  // ─── Chapter 16: Examination of Bondage and Liberation ────────────────
  'Quantum Decoherence — State Transitions Without Fixed Identity': {
    Component: CausationBase, mode: 'chain',
  },
  'Quantum Non-Locality of System Identity': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Quantum Tunneling — Undefined Existence Between States': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Quantum Phase Transitions — Transformation Requires Flexibility': {
    Component: CausationBase, mode: 'orbital',
  },
  'Quantum Superposition — Neither Fixed nor Free': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Measurement Process vs. Measured State': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Delayed-Choice Experiments — Temporal Ordering Breaks Down': {
    Component: CausationBase, mode: 'infinity',
  },
  "State Exclusivity — Orthogonal States Can't Coexist": {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Quantum Zeno Effect — Constant Observation Freezes Transition': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Paradigm Shift — Framework Failure Demands New Concepts': {
    Component: CausationBase, mode: 'mandala',
  },

  // ─── Chapter 17: Examination of Action and Fruit ──────────────────────
  'Statistical Quantum Causality — Reliable Without Determinism': {
    Component: CausationBase, mode: 'chain',
  },
  'Measurement Choice Primacy': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Wave Function → Measurement Outcome': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Hidden Variables Debate': {
    Component: EntanglementBase, mode: 'bell-test',
  },
  'Complete Basis Set Classification': {
    Component: CausationBase, mode: 'mandala',
  },
  'Wave Function Evolution — Persistence Without Permanence': {
    Component: SuperpositionBase, mode: 'fluid',
  },
  'Sequential Quantum Causal Transmission': {
    Component: CausationBase, mode: 'chain',
  },
  'Quantum Information Conservation': {
    Component: CausationBase, mode: 'chain',
  },
  'Quantum State Evolution in Cognitive Models': {
    Component: SuperpositionBase, mode: 'fluid',
  },
  'Quantum No-Deletion — Information Persists Through Transformation': {
    Component: CausationBase, mode: 'chain',
  },
  'Statistical Regularities from Probabilistic Events': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Paradigm Shift — Classical Assumptions Fail': {
    Component: CausationBase, mode: 'mandala',
  },
  'Paradigm-Consistent Reinterpretation': {
    Component: CausationBase, mode: 'mandala',
  },
  'Entanglement as Persistent Correlation': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Quantum State Transformation Requires Specific Operators': {
    Component: CausationBase, mode: 'orbital',
  },
  'Quantum No-Deletion — Information Resists Arbitrary Erasure': {
    Component: CausationBase, mode: 'chain',
  },
  'Wave Function Collapse — Superposition to Eigenstate': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Content-Neutral Information Conservation': {
    Component: CausationBase, mode: 'chain',
  },
  'Boundary Conditions for Quantum Processes': {
    Component: CausationBase, mode: 'orbital',
  },
  'Quantum Complementarity — Wave-Particle Duality': {
    Component: CausationBase, mode: 'mandala',
  },
  'Virtual Particles — Off-Shell Yet Effective': {
    Component: GenericBase, mode: 'foam',
  },
  'Particle Creation from Field Excitations': {
    Component: GenericBase, mode: 'split-field',
  },
  'Conservation Laws — Outcomes Linked to Inputs': {
    Component: CausationBase, mode: 'chain',
  },
  'Symmetry Breaking — Distinctions from Conditions': {
    Component: CausationBase, mode: 'orbital',
  },
  'Thermodynamic Impossibility of Perpetual Motion': {
    Component: CausationBase, mode: 'chain',
  },
  'Decoherence — Quantum Source Produces Quantum Result': {
    Component: CausationBase, mode: 'chain',
  },
  'Particles as Field Excitations — Emergent, Not Fundamental': {
    Component: GenericBase, mode: 'foam',
  },
  'Quantum Temporal Entanglement — Connected but Evolved': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Relational Observer — No Inherent Agent': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Quantum Vacuum — No Independent Entities': {
    Component: GenericBase, mode: 'foam',
  },

  // ─── Chapter 18: Examination of Self ──────────────────────────────────
  'Quantum Observer Problem — Neither System Nor Separate': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Quantum Non-Ownership — Relational Properties': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Measurement Incompatibility — Wrong Instrument': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Quantum Erasure — Removing Labels Restores Coherence': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Decoherence Reversal — Removing Fixation Restores Freedom': {
    Component: CausationBase, mode: 'chain',
  },
  'Complementarity — Context-Dependent Descriptions': {
    Component: CausationBase, mode: 'mandala',
  },
  'Quantum Vacuum — The Unborn Ground of Reality': {
    Component: GenericBase, mode: 'foam',
  },
  'Quantum Contextuality — Context-Dependent Reality': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Pre-Measurement Quantum State — Undetermined Reality': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Quantum Entanglement — Neither Same Nor Separate': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Quantum Non-Locality — Transcending Classical Categories': {
    Component: EntanglementBase, mode: 'bell-test',
  },
  'Quantum Tunneling — Bypassing Classical Barriers': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },

  // ─── Chapter 19: Examination of Time ──────────────────────────────────
  'Block Universe — All Times Coexist': {
    Component: CausationBase, mode: 'infinity',
  },
  'Retrocausality Problem — Connecting Present to Non-Existent Future': {
    Component: CausationBase, mode: 'infinity',
  },
  'Relativity of Simultaneity — No Absolute "Now"': {
    Component: CausationBase, mode: 'infinity',
  },
  'Gauge Invariance — Only Relations Are Physical': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Problem of Time in Quantum Gravity': {
    Component: CausationBase, mode: 'infinity',
  },
  'Relational Time — Time Shaped by Matter-Energy': {
    Component: CausationBase, mode: 'orbital',
  },

  // ─── Chapter 20: Examination of Assemblage ────────────────────────────
  'Quantum Indeterminacy vs. Classical Pre-Determination': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Quantum Field Theory — Particles Arising from Fields': {
    Component: GenericBase, mode: 'foam',
  },
  'Unobservability of Quantum Potentiality': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Quantum Causal Specificity — Specific Conditions, Specific Outcomes': {
    Component: CausationBase, mode: 'chain',
  },
  'State Change Without Inherent Nature Change': {
    Component: SuperpositionBase, mode: 'fluid',
  },
  'Temporal Causality — Effects Follow Existing Causes': {
    Component: CausationBase, mode: 'chain',
  },
  'Causal Ordering Within Lightcones': {
    Component: CausationBase, mode: 'orbital',
  },
  'Causality Principle — No Effect Before Cause': {
    Component: CausationBase, mode: 'chain',
  },
  'Conservation vs. Identity Through Transformation': {
    Component: CausationBase, mode: 'chain',
  },
  'Decoherence — Conventional Process Beyond Inherent Mechanism': {
    Component: CausationBase, mode: 'chain',
  },
  'Quantum Non-Locality — Correlation Without Classical Connection': {
    Component: EntanglementBase, mode: 'bell-test',
  },
  'No Cross-Temporal Simultaneity': {
    Component: CausationBase, mode: 'infinity',
  },
  'Frame-Dependent Simultaneity': {
    Component: CausationBase, mode: 'infinity',
  },
  'No Properties for Non-Existent Systems': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Quantum Tunneling — Production Without Classical Connection': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Quantum Vacuum Fluctuations — Production from "Empty" Ground': {
    Component: GenericBase, mode: 'foam',
  },
  'Particle Annihilation — Impermanence Proves Emptiness': {
    Component: GenericBase, mode: 'split-field',
  },
  'Dynamic Vacuum — "Empty" Is Not a Fixed State': {
    Component: GenericBase, mode: 'foam',
  },
  'Quantum Superposition — Beyond Binary Categories': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Quantum Contextuality — Properties Depend on Context': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Creation/Annihilation Operators — Conditional Existence': {
    Component: GenericBase, mode: 'split-field',
  },
  "Vacuum's Causal Status Depends on Fluctuations": {
    Component: GenericBase, mode: 'foam',
  },
  'Emergence — Properties Arising from Interactions, Not Self-Production': {
    Component: CausationBase, mode: 'orbital',
  },
  'Conventional Production Through Empty Processes': {
    Component: CausationBase, mode: 'chain',
  },

  // ─── Chapter 21: Examination of Arising and Dissolving ────────────────
  'Creation/Annihilation Complementarity': {
    Component: GenericBase, mode: 'split-field',
  },
  'Bohr Complementarity — Mutually Exclusive Aspects': {
    Component: CausationBase, mode: 'mandala',
  },
  'Quantum Zeno Effect — Incompatible Processes': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'No Permanently Excited States — Universal Decay': {
    Component: GenericBase, mode: 'split-field',
  },
  'Wave-Particle Duality — Transcending Binary Categories': {
    Component: CausationBase, mode: 'mandala',
  },
  'No Re-Creation of Collapsed States': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Particle-Field Mutual Dependence': {
    Component: GenericBase, mode: 'foam',
  },
  'Dynamic Vacuum — Beyond Empty/Non-Empty': {
    Component: GenericBase, mode: 'foam',
  },
  'Creation/Annihilation — Related Opposites': {
    Component: GenericBase, mode: 'split-field',
  },
  'Operator Identity/Independence Both Break Physics': {
    Component: CausationBase, mode: 'chain',
  },
  'Observer Framework Shapes Observation': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Field Excitation Transcends Classical Arising Categories': {
    Component: GenericBase, mode: 'foam',
  },
  'Quantum Indeterminacy — Beyond Classical Causation': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Empty Vacuum Enables Conventional Particle Creation': {
    Component: GenericBase, mode: 'foam',
  },
  'Virtual Particles — Effective Without Being "Real"': {
    Component: GenericBase, mode: 'foam',
  },
  'Superposition — Between Binary Extremes': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Conservation vs. Transformation — Inherent Nature Would Block Change': {
    Component: CausationBase, mode: 'chain',
  },
  'Quantum Tunneling — Overcoming "Impossible" Barriers': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Quantum Fields Transcend Particle Creation/Destruction': {
    Component: GenericBase, mode: 'foam',
  },
  'State Manipulation Requires Non-Fixity': {
    Component: SuperpositionBase, mode: 'fluid',
  },
  'From Inherent Particles to Dependent Field Dynamics': {
    Component: GenericBase, mode: 'foam',
  },

  // ─── Chapter 22: Examination of the Tathāgata ────────────────────────
  'Relational Quantum Mechanics — No Intrinsic Properties': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'No Inherent Container — Vacuum Field vs. Spatial Box': {
    Component: GenericBase, mode: 'foam',
  },
  'Observer ≠ Apparatus': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'No Field Interactions = No Properties': {
    Component: GenericBase, mode: 'foam',
  },
  'Particle Lifetime — Bounded Existence': {
    Component: GenericBase, mode: 'split-field',
  },
  'Isolated System Cannot Entangle': {
    Component: EntanglementBase, mode: 'paired',
  },
  'No Measurement = Undefined Properties': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Exhaustive Measurement Finds No Hidden Essence': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Complementarity — Resisting Complete Determination': {
    Component: CausationBase, mode: 'mandala',
  },
  'Beyond Determinism and Randomness': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Fixed States → No Transitions': {
    Component: CausationBase, mode: 'chain',
  },
  'Some Coherence Required for Processes': {
    Component: SuperpositionBase, mode: 'fluid',
  },
  'Superposition — Beyond Classical Categories': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Indefinite Properties Even While "Present"': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Universal Field Theory — Same Underlying Reality': {
    Component: GenericBase, mode: 'foam',
  },
  'One Underlying Reality — Universal Quantum Fields': {
    Component: GenericBase, mode: 'foam',
  },

  // ─── Chapter 23: Examination of Errors ────────────────────────────────
  'Observer-Dependent Properties': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'No Absolute Reference Frame → No Absolute Properties': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Indefinite Observer → Indefinite Observation': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Ambiguous Property Ownership in Entanglement': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Universal Formalism Applied Consistently': {
    Component: CausationBase, mode: 'orbital',
  },
  'Measurement Problem — Which Trigger?': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Measurement Data Is Apparatus-Dependent': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Virtual Particles — Effective Without Permanent Reality': {
    Component: GenericBase, mode: 'foam',
  },
  'Virtual Input → Virtual Output': {
    Component: GenericBase, mode: 'foam',
  },
  'Complementary Observables — Mutually Defined': {
    Component: CausationBase, mode: 'mandala',
  },
  'Symmetric Complementarity': {
    Component: CausationBase, mode: 'mandala',
  },
  'Undefined Basis → Undefined Outcome': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Superposition — No Definite State to Misperceive': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'No Pre-Measurement State → No Measurement Error': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Entangled Properties — Mutually Defined': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Inherent Properties ≠ Process-Dependent': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'No Inherent State → No Error About That State': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Failure of Simple Causal Models': {
    Component: CausationBase, mode: 'chain',
  },
  'Inherently Fixed States → No Transitions': {
    Component: CausationBase, mode: 'chain',
  },
  'Conventional Existence Without Inherent Fixity': {
    Component: CausationBase, mode: 'orbital',
  },
  'Both Observer and Observed Unestablished': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Particle-Property Relation — Four Ways Unfindable': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Universal Formalism — Same Method, Same Result': {
    Component: CausationBase, mode: 'orbital',
  },
  'Dependent Arising = Emptiness of Inherent Properties': {
    Component: CausationBase, mode: 'orbital',
  },
  'Understanding Nature Changes the Relationship': {
    Component: CausationBase, mode: 'mandala',
  },

  // ─── Chapter 24: Examination of the Noble Truths (gold) ───────────────
  'Classical Objection to Quantum Indefiniteness': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Theory Without "Reality" → No Applications?': {
    Component: CausationBase, mode: 'mandala',
  },
  'Cascading Collapse of Applied Framework': {
    Component: CausationBase, mode: 'chain',
  },
  'Collapse of Discipline — Theory + Community': {
    Component: CausationBase, mode: 'chain',
  },
  'New Framework Accused of Destroying Old': {
    Component: CausationBase, mode: 'mandala',
  },
  'Universal Nihilism Accusation': {
    Component: CausationBase, mode: 'mandala',
  },
  'Misunderstanding the Framework → False Conclusions': {
    Component: CausationBase, mode: 'mandala',
  },
  'Two Descriptions — Wave Function + Measurement Outcomes': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Two-Level Framework Essential for Understanding': {
    Component: CausationBase, mode: 'mandala',
  },
  'Classical Language Needed to Teach Quantum Reality': {
    Component: CausationBase, mode: 'mandala',
  },
  'Powerful Theory Dangerous When Misunderstood': {
    Component: CausationBase, mode: 'mandala',
  },
  "Acknowledgment of Framework's Difficulty": {
    Component: CausationBase, mode: 'mandala',
  },
  'Critique Applies to Misunderstanding, Not Theory': {
    Component: CausationBase, mode: 'mandala',
  },
  'Non-Fixed States Enable All Physical Processes': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  "Projecting Own Framework's Faults": {
    Component: CausationBase, mode: 'chain',
  },
  "Bell's Theorem — Inherent Properties Violate Observations": {
    Component: EntanglementBase, mode: 'bell-test',
  },
  'Fixed States → No Dynamics': {
    Component: CausationBase, mode: 'chain',
  },
  'Four Equivalent Descriptions of One Reality': {
    Component: CausationBase, mode: 'mandala',
  },
  'Universal Entanglement → Universal Non-Inherent Properties': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Classical Realism → No Quantum Phenomena': {
    Component: CausationBase, mode: 'chain',
  },
  'Inherent Occupation → No Transitions In': {
    Component: CausationBase, mode: 'chain',
  },
  'Inherent Properties → Not Affected by Conditions': {
    Component: CausationBase, mode: 'chain',
  },
  'Inherent Occupation → No Decay': {
    Component: CausationBase, mode: 'chain',
  },
  'Computation/Manipulation Requires Non-Fixed States': {
    Component: SuperpositionBase, mode: 'fluid',
  },
  'No New Transitions to Inherently Fixed States': {
    Component: CausationBase, mode: 'chain',
  },
  "Inherent Forces → Can't Be Screened": {
    Component: CausationBase, mode: 'chain',
  },
  'Measurement Process Requires Non-Fixed States': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Inherent Computation → No Need to Run': {
    Component: CausationBase, mode: 'chain',
  },
  'No Goal → No Method': {
    Component: CausationBase, mode: 'chain',
  },
  'Inherent Unknowability → No Measurement Results': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Rejecting Framework → No Applications': {
    Component: CausationBase, mode: 'chain',
  },
  'Criticism Based on Misunderstanding': {
    Component: CausationBase, mode: 'mandala',
  },
  'Framework Provides Coherence': {
    Component: CausationBase, mode: 'orbital',
  },
  'Master Equation Restated': {
    Component: CausationBase, mode: 'orbital',
  },
  'Universal Non-Isolation → Universal Emptiness': {
    Component: EntanglementBase, mode: 'paired',
  },

  // ─── Chapter 25: Examination of Nirvāṇa (gold) ───────────────────────
  'Quantum Vacuum Misconception': {
    Component: GenericBase, mode: 'foam',
  },
  'Fixed States Block All Transitions': {
    Component: CausationBase, mode: 'chain',
  },
  'Vacuum State: Defined by Negation': {
    Component: GenericBase, mode: 'foam',
  },
  'Vacuum ≠ Particle': {
    Component: GenericBase, mode: 'split-field',
  },
  'Absence Is Relative': {
    Component: CausationBase, mode: 'mandala',
  },
  'Superposition ≠ Both Simultaneously': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Negation Presupposes What It Negates': {
    Component: CausationBase, mode: 'chain',
  },
  'No Outside the Framework': {
    Component: CausationBase, mode: 'orbital',
  },
  'Abandon Both Extremes': {
    Component: CausationBase, mode: 'mandala',
  },
  'Combining Conditioned States → Still Conditioned': {
    Component: CausationBase, mode: 'chain',
  },
  'More Dependencies = Less Freedom': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Fundamental ≠ Composite': {
    Component: GenericBase, mode: 'foam',
  },
  'Indeterminate ≠ Unknowable': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Nature Independent of Context': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Malformed Questions About Limits': {
    Component: CausationBase, mode: 'mandala',
  },
  'Reference Frame Equivalence': {
    Component: CausationBase, mode: 'infinity',
  },
  'No Sharp Boundary Between Domains': {
    Component: CausationBase, mode: 'orbital',
  },
  'Temporal Limits May Not Be Well-Defined': {
    Component: CausationBase, mode: 'infinity',
  },
  'Framework Determines Valid Questions': {
    Component: CausationBase, mode: 'mandala',
  },
  'Removing Apparatus Reveals Natural State': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Self-Transcending Framework': {
    Component: CausationBase, mode: 'mandala',
  },
  "Don't Reify the Framework": {
    Component: CausationBase, mode: 'mandala',
  },
  'Ground State = Fundamental Peace': {
    Component: GenericBase, mode: 'foam',
  },

  // ─── Chapter 26: Examination of Twelve Links (gold) ───────────────────
  'Measurement Bias': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Wave Function Evolution': {
    Component: SuperpositionBase, mode: 'fluid',
  },
  'Detector → Measurement Event': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Observer-Observed Mutual Dependence': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'Data → Interpretation': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Observer Entanglement': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Releasing Investment in Outcomes': {
    Component: CausationBase, mode: 'mandala',
  },
  'State Collapse → Decoherence': {
    Component: CausationBase, mode: 'chain',
  },
  'Entropy Accumulation': {
    Component: CausationBase, mode: 'chain',
  },
  'Understanding Bias = Correcting It': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Root Correction → Downstream Fix': {
    Component: CausationBase, mode: 'chain',
  },
  'Complete Error Correction → Ground State': {
    Component: GenericBase, mode: 'foam',
  },

  // ─── Chapter 27: Examination of Views (gold) ─────────────────────────
  'Pre-Measurement Properties Undefined': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'State Evolution ≠ State Identity': {
    Component: SuperpositionBase, mode: 'fluid',
  },
  'Causal Connection Across Time': {
    Component: CausationBase, mode: 'infinity',
  },
  'Mutual Dependence of Observer/Observed': {
    Component: MeasurementBase, mode: 'observer-crystal',
  },
  'No Bare System Apart from Properties': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Neither Identical to Nor Separable from Description': {
    Component: CausationBase, mode: 'mandala',
  },
  'Middle Ground of Existence': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Tetralemma Failure for Temporal States': {
    Component: CausationBase, mode: 'mandala',
  },
  'Indeterminate Present → Limited Future Projection': {
    Component: SuperpositionBase, mode: 'ghost-states',
  },
  'Time-Symmetric Analysis': {
    Component: CausationBase, mode: 'infinity',
  },
  'Unitarity / Causal Connection': {
    Component: CausationBase, mode: 'chain',
  },
  'No Unconditional Arising': {
    Component: CausationBase, mode: 'chain',
  },
  'Time-Symmetric Tetralemma Failure': {
    Component: CausationBase, mode: 'mandala',
  },
  'Beyond Permanent/Impermanent Binary': {
    Component: CausationBase, mode: 'mandala',
  },
  'Perfectly Isolated = Non-Interactive': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Conservation Requires Connection': {
    Component: CausationBase, mode: 'chain',
  },
  'Beyond Finite/Infinite Binary': {
    Component: CausationBase, mode: 'mandala',
  },
  'Neither Identical to Nor Separate from Description': {
    Component: CausationBase, mode: 'mandala',
  },
  'Mutual Dissolution of Self/Other Nature': {
    Component: EntanglementBase, mode: 'paired',
  },
  'Relational Definition Only': {
    Component: MeasurementBase, mode: 'contextual',
  },
  'Transcendence of Classical Categories': {
    Component: CausationBase, mode: 'mandala',
  },
  'Fundamental Assumption → Derived Views': {
    Component: CausationBase, mode: 'chain',
  },
  'Root Correction Cascades': {
    Component: CausationBase, mode: 'chain',
  },
  'True Nature Dissolves Imposed Categories': {
    Component: CausationBase, mode: 'mandala',
  },
  "Don't Reify the Tool": {
    Component: CausationBase, mode: 'mandala',
  },
  'Beyond Fixed Interpretations': {
    Component: CausationBase, mode: 'mandala',
  },
  'Knowing What Can Be Said': {
    Component: CausationBase, mode: 'mandala',
  },
  'Multiple Valid Descriptions': {
    Component: CausationBase, mode: 'mandala',
  },
  'Ground State / Fundamental Nature': {
    Component: GenericBase, mode: 'foam',
  },
  'The Quantum Middle Way': {
    Component: CausationBase, mode: 'orbital',
  },
};

/**
 * Fallback mapping by animation type string (for verses without exact concept match)
 */
const TYPE_FALLBACK_MAP = {
  'superposition': { Component: SuperpositionBase, mode: 'ghost-states' },
  'entanglement': { Component: EntanglementBase, mode: 'paired' },
  'observer-effect': { Component: MeasurementBase, mode: 'observer-crystal' },
  'contextuality': { Component: MeasurementBase, mode: 'contextual' },
  'wave-function': { Component: SuperpositionBase, mode: 'ghost-states' },
  'decoherence': { Component: CausationBase, mode: 'chain' },
  'dependent-origination': { Component: CausationBase, mode: 'orbital' },
  'non-locality': { Component: EntanglementBase, mode: 'bell-test' },
  'fluctuations': { Component: GenericBase, mode: 'foam' },
  'vacuum': { Component: GenericBase, mode: 'foam' },
  'emptiness': { Component: CausationBase, mode: 'mandala' },
  'complementarity': { Component: CausationBase, mode: 'mandala' },
  'double-slit': { Component: SuperpositionBase, mode: 'ghost-states' },
  'collapse': { Component: MeasurementBase, mode: 'observer-crystal' },
};

/**
 * Resolve which base component and mode to use for a given verse
 */
function resolveBase(verseData, animationType) {
  // 1. Try exact concept match from quantumResonance
  const concept = verseData?.quantumResonance?.concept;
  if (concept && VERSE_BASE_MAP[concept]) {
    return VERSE_BASE_MAP[concept];
  }

  // 2. Try animationType fallback
  if (animationType && TYPE_FALLBACK_MAP[animationType]) {
    return TYPE_FALLBACK_MAP[animationType];
  }

  // 3. Ultimate fallback
  return { Component: SuperpositionBase, mode: 'ghost-states' };
}

/**
 * Scene lighting based on verse mood
 */
function VerseLighting({ colors, mood }) {
  const primaryColor = colors?.[0] || '#8B5CF6';
  const accentColor = colors?.[2] || '#06B6D4';

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={primaryColor} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color={accentColor}
      />
    </>
  );
}

/**
 * Main VerseAnimationEngine Component
 * 
 * Renders inside R3F Canvas (provided by QuantumCanvas).
 * Receives full verseData and selects/configures the appropriate base.
 * 
 * Props:
 *   verseData: full verse object from chapter-1.js
 *   animationType: string fallback from verse-animation-config
 *   autoRotate: boolean
 *   onLoad: callback when scene ready
 *   onError: callback on error
 *   onReveal: callback for educational overlay content
 *   onInteraction: callback for interaction events
 */
export default function VerseAnimationEngine({
  verseData = {},
  animationType = 'superposition',
  autoRotate = true,
  deviceProfile, // NEW: for adaptive quality
  frameloop = 'always',
  setFrameloop,
  onLoad,
  onError,
  onReveal,
  onInteraction,
  speed = 1,
  complexity = 0.5,
  zoom = 1,
  accentColor = null,
}) {
  const [animState, setAnimState] = useState('idle');
  const controlsRef = useRef();
  const loadedRef = useRef(false); // Guard to prevent multiple onLoad calls
  const { invalidate } = useThree(); // For demand rendering


  const { Component: BaseComponent, mode } = resolveBase(verseData, animationType);

  // Extract animation config
  const animConfig = verseData?.animation || {};
  const colors = animConfig.colors || ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];
  const cameraConfig = animConfig.camera || { position: [0, 3, 7], fov: 50, autoRotate: true };
  const controlsConfig = animConfig.controls || {};

  // Notify parent on mount (only once!)
  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      const timer = setTimeout(() => {
        if (onLoad) onLoad();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []); // Empty deps - only run once

  // Handle reveal events from base components
  const handleReveal = useCallback((revealType) => {
    setAnimState('revealed');
    if (onReveal) {
      onReveal({
        type: revealType,
        visualBridge: animConfig.visualBridge || '',
        educationalGoal: animConfig.educationalGoal || '',
        twoTruths: verseData?.philosophy?.twoTruths || '',
        commonMisconception: verseData?.philosophy?.commonMisconception || '',
      });
    }
  }, [animConfig, verseData, onReveal]);

  // Handle interaction events
  const handleInteraction = useCallback((event) => {
    setAnimState('interacting');
    if (onInteraction) {
      onInteraction({
        ...event,
        interaction: animConfig.interaction || {},
      });
    }
    // Return to idle after interaction completes
    setTimeout(() => setAnimState('idle'), 3000);
  }, [animConfig, onInteraction]);

  // Auto-rotate speed from config
  const rotationSpeed = controlsConfig.rotation?.speed || 0.5;
  const shouldAutoRotate = controlsConfig.rotation?.default !== false && autoRotate;

  // Mobile touch limits
  const isMobile = deviceProfile?.quality?.includes('mobile');
  const minDist = isMobile ? 4 : 3;
  const maxDist = isMobile ? 15 : 20;

  // CRITICAL FIX: Hybrid frameloop strategy
  // Switch to 'always' when auto-rotating or actively animating
  // Switch to 'demand' when idle (saves battery)
  useEffect(() => {
    if (!setFrameloop) return; // Desktop doesn't need this

    const needsContinuousRender = shouldAutoRotate || animState !== 'idle';
    const desiredMode = needsContinuousRender ? 'always' : (deviceProfile.frameloop || 'always');

    if (frameloop !== desiredMode) {
      logger.log(`[VerseAnimationEngine] Switching frameloop: ${frameloop} → ${desiredMode}`);
      setFrameloop(desiredMode);
    }
  }, [shouldAutoRotate, animState, deviceProfile?.frameloop, frameloop, setFrameloop]);

  // Continuous invalidation for auto-rotate in demand mode (backup if hybrid fails)
  useEffect(() => {
    if (shouldAutoRotate && frameloop === 'demand') {
      const interval = setInterval(() => {
        invalidate();
      }, 16); // ~60fps for smooth rotation
      return () => clearInterval(interval);
    }
  }, [shouldAutoRotate, frameloop, invalidate]);

  // Main orchestration loop
  useFrame((state) => {
    perfMonitor.tick(); // For FPS instrumentation

    // Smooth camera intro if just loaded
    if (loadedRef.current && state.clock.elapsedTime < 2) {
      const zoomPos = cameraConfig.position || [0, 3, 7];
      state.camera.position.lerp(new THREE.Vector3(...zoomPos), 0.05);
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      {/* Verse-specific lighting */}
      <VerseLighting colors={colors} mood={animConfig.mood} />

      {/* Background stars */}
      <Stars
        radius={100}
        depth={50}
        count={isMobile ? 1000 : 4000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Orbit controls with invalidation for demand loop */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={!isMobile} // Disable pan on mobile to prevent scroll conflict
        enableZoom={true}
        enableRotate={true}
        autoRotate={shouldAutoRotate}
        autoRotateSpeed={rotationSpeed}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_ROTATE
        }}
        minDistance={minDist}
        maxDistance={maxDist}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
        onChange={() => invalidate()} // Trigger render on interaction
      />

      {/* Main animation — base component wrapped in Float */}
      <Float
        speed={1}
        rotationIntensity={0.15}
        floatIntensity={0.4}
      >
        <BaseComponent
          config={animConfig}
          mode={mode}
          colors={colors}
          animState={animState}
          deviceProfile={deviceProfile} // Pass down for adaptive quality
          onReveal={handleReveal}
          onInteraction={handleInteraction}
          speed={speed}
          complexity={complexity}
          zoom={zoom}
          accentColor={accentColor}
        />
      </Float>

      {/* Fog for depth */}
      <fog attach="fog" args={['#0f172a', 10, 50]} />
    </>
  );
}
