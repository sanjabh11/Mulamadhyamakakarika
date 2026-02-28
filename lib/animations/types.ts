/**
 * TypeScript Type Definitions for Verse Animations
 * 
 * Defines interfaces for scene configuration, animation states, and interactions
 */

/**
 * Camera configuration
 */
export interface CameraConfig {
  type: 'PerspectiveCamera' | 'OrthographicCamera';
  fov?: number;
  position: [number, number, number];
  lookAt: [number, number, number];
  near: number;
  far: number;
}

/**
 * Light configuration
 */
export interface LightConfig {
  type: 'AmbientLight' | 'DirectionalLight' | 'PointLight' | 'SpotLight' | 'RectAreaLight';
  color: string;
  intensity: number;
  position?: [number, number, number];
  castShadow?: boolean;
  distance?: number;
}

/**
 * Complete lighting setup
 */
export interface LightingConfig {
  ambient: LightConfig;
  key: LightConfig;
  fill: LightConfig;
  rim: LightConfig;
}

/**
 * Background configuration
 */
export interface BackgroundConfig {
  type: 'gradient' | 'solid' | 'texture';
  colors?: string[];
  color?: string;
  textureUrl?: string;
}

/**
 * Post-processing effects
 */
export interface PostProcessingConfig {
  bloom?: {
    intensity: number;
    threshold: number;
    radius?: number;
  };
  chromaticAberration?: {
    offset: number;
  };
}

/**
 * Orbit controls configuration
 */
export interface ControlsConfig {
  type: 'OrbitControls';
  enableDamping: boolean;
  dampingFactor: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
  minDistance: number;
  maxDistance: number;
  enablePan?: boolean;
  maxPolarAngle?: number;
  minPolarAngle?: number;
}

/**
 * Complete scene configuration
 */
export interface VerseSceneConfig {
  camera: CameraConfig;
  lighting: LightingConfig;
  background: BackgroundConfig;
  postProcessing: PostProcessingConfig;
  controls: ControlsConfig;
  performance?: {
    pixelRatio: number;
    antialias: boolean;
    alpha: boolean;
    powerPreference: 'high-performance' | 'low-power' | 'default';
  };
}

/**
 * Material configuration
 */
export interface MaterialConfig {
  type: 'MeshStandardMaterial' | 'MeshPhysicalMaterial' | 'MeshBasicMaterial';
  color?: string;
  metalness?: number;
  roughness?: number;
  transmission?: number;
  thickness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  transparent?: boolean;
  opacity?: number;
  iridescence?: number;
  iridescenceIOR?: number;
  iridescenceThicknessRange?: [number, number];
}

/**
 * 3D object configuration
 */
export interface ObjectConfig {
  geometry: string;
  args?: any[];
  material: MaterialConfig;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  visible?: boolean;
  wireframe?: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

/**
 * Animation definition
 */
export interface AnimationDefinition {
  target: string;
  property: string;
  from: any;
  to: any;
  duration: number;
  easing?: (t: number) => number;
  delay?: number;
}

/**
 * Interaction trigger
 */
export interface TriggerDefinition {
  type: 'click' | 'hover' | 'drag' | 'connect_all' | 'auto';
  target?: string;
  id?: string;
}

/**
 * Animation state
 */
export interface AnimationState {
  description: string;
  trigger?: TriggerDefinition;
  animation?: AnimationDefinition | AnimationDefinition[];
  transition_to?: string;
  duration?: number;
  onEnter?: (context: any) => void | Promise<void>;
  onExit?: (context: any) => void | Promise<void>;
  objects?: {
    [key: string]: Partial<ObjectConfig>;
  };
}

/**
 * State machine configuration
 */
export interface StateMachineConfig {
  states: {
    [stateName: string]: AnimationState;
  };
  initial_state: string;
}

/**
 * Interaction button definition
 */
export interface InteractionDefinition {
  id: string;
  button_label: string;
  sanskrit?: string;
  action: string;
  target: string | string[];
  message: string;
  audio_cue?: string;
  is_solution?: boolean;
}

/**
 * Educational overlay
 */
export interface EducationalOverlay {
  mmk_insight: string;
  quantum_parallel: string;
  bridge: string;
}

/**
 * Quiz question
 */
export interface QuizQuestion {
  type: 'mcq' | 'true_false' | 'drag_drop';
  question: string;
  options?: string[];
  correct_answer: number | string;
  explanation: string;
  xp_value: number;
  tier: 'beginner' | 'student' | 'scholar';
}

/**
 * FAQ item
 */
export interface FAQItem {
  question: string;
  answer: string;
  tier: 'beginner' | 'student' | 'scholar';
}

/**
 * Complete verse animation data
 */
export interface VerseAnimationData {
  id: string;
  quantum_concept: string;
  mmk_concept: string;
  objects: {
    [objectName: string]: ObjectConfig;
  };
  interactions: InteractionDefinition[];
  educational_overlay: EducationalOverlay;
  scene_config?: Partial<VerseSceneConfig>;
  state_machine?: StateMachineConfig;
  quiz_questions?: QuizQuestion[];
  faqs?: FAQItem[];
}

/**
 * Progress tracking
 */
export interface UserProgress {
  userId: string;
  xp: number;
  level: number;
  streak: number;
  rank: number;
  versesCompleted: number;
  totalVerses: number;
  lastActivity: Date;
}

/**
 * Achievement/Certificate
 */
export interface Certificate {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color_scheme: [string, string];
  earnedAt: Date;
  publicUrl: string;
  shareable_text: string;
}

/**
 * Tier levels
 */
export type TierLevel = 'explorer' | 'seeker' | 'practitioner' | 'scholar';

/**
 * Animation event
 */
export interface AnimationEvent {
  type: 'stateChange' | 'animationProgress' | 'animationComplete' | 'reset';
  from?: string;
  to?: string;
  animation?: AnimationDefinition;
  progress?: number;
  context?: any;
}


