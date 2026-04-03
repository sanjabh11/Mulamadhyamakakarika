/**
 * 3D Model Generation API
 * 
 * Uses modern fal.ai models for text-to-3D generation:
 * - Tripo3D v2.5 (primary)
 * - Hunyuan3D (fallback)
 * 
 * Returns GLB model URL for use with React Three Fiber
 */

import { fal } from '@fal-ai/client';
import { rateLimitMiddleware } from '../../lib/rate-limiter';
import { getEffectiveTier, getRequestSession } from '../../lib/server-session';

// Configure fal.ai
const FAL_API_KEY = process.env.FAL_API_KEY || process.env.FAL_KEY;
if (FAL_API_KEY) {
  fal.config({ credentials: FAL_API_KEY });
}

// Cache for generated 3D models
const modelCache = new Map();

// Quantum concept to 3D prompt mapping
const CONCEPT_PROMPTS = {
  'entanglement': 'two glowing orbs connected by ethereal threads, quantum particles, cosmic void, sci-fi, clean geometry',
  'superposition': 'translucent sphere with multiple ghost versions overlapping, quantum state, ethereal glow',
  'wave-function': 'flowing wave surface with probability cloud, abstract mathematical visualization',
  'double-slit': 'scientific apparatus with barrier containing two slits, wave pattern, physics experiment',
  'decoherence': 'dissolving crystal structure, particles dispersing into environment, entropy visualization',
  'non-locality': 'two distant spheres with instant connection beam, space-time grid, teleportation effect',
  'observer-effect': 'eye observing quantum particle, measurement device, wave collapse visualization',
  'fluctuations': 'bubbling energy field, virtual particles appearing and disappearing, vacuum energy',
  'dependent-origination': 'interconnected web of glowing nodes, cause and effect chain, Buddhist mandala',
  'emptiness': 'transparent void with subtle energy patterns, śūnyatā visualization, formless form'
};

/**
 * Get optimized prompt for 3D generation
 */
function get3DPrompt(concept, customPrompt) {
  const basePrompt = CONCEPT_PROMPTS[concept] || CONCEPT_PROMPTS['entanglement'];
  
  if (customPrompt) {
    return `${customPrompt}, ${basePrompt}, high quality 3D model, clean topology, game-ready asset`;
  }
  
  return `${basePrompt}, high quality 3D model, clean topology, game-ready asset`;
}

/**
 * Determine concept from prompt text
 */
function detectConcept(prompt) {
  const promptLower = (prompt || '').toLowerCase();
  
  if (promptLower.includes('entangle')) return 'entanglement';
  if (promptLower.includes('superposition')) return 'superposition';
  if (promptLower.includes('wave function') || promptLower.includes('probability')) return 'wave-function';
  if (promptLower.includes('double-slit') || promptLower.includes('slit')) return 'double-slit';
  if (promptLower.includes('decoherence')) return 'decoherence';
  if (promptLower.includes('non-local')) return 'non-locality';
  if (promptLower.includes('observer')) return 'observer-effect';
  if (promptLower.includes('fluctuation')) return 'fluctuations';
  if (promptLower.includes('dependent') || promptLower.includes('condition')) return 'dependent-origination';
  if (promptLower.includes('empty') || promptLower.includes('śūnyatā')) return 'emptiness';
  
  return 'entanglement';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const session = await getRequestSession(req);
  if (session?.userId) {
    req.headers['x-user-id'] = session.userId;
  }
  const userTier = await getEffectiveTier(req, 'anonymous');
  if (!rateLimitMiddleware(req, res, userTier)) {
    return;
  }

  try {
    const { prompt, chapter, verse } = req.body;
    
    if (!prompt && !chapter) {
      return res.status(400).json({ error: 'Prompt or chapter/verse required' });
    }

    // Cache key
    const cacheKey = `${chapter}-${verse}-3d`;
    
    // Check cache
    if (modelCache.has(cacheKey)) {
      console.log('[3D API] Cache hit:', cacheKey);
      return res.status(200).json(modelCache.get(cacheKey));
    }

    // Detect concept and build prompt
    const concept = detectConcept(prompt);
    const optimizedPrompt = get3DPrompt(concept, prompt);
    
    console.log('[3D API] Generating 3D model:', { concept, prompt: optimizedPrompt.substring(0, 50) });

    // Try Tripo3D first (primary model)
    try {
      const result = await fal.subscribe('fal-ai/tripo3d/v2.5/text-to-3d', {
        input: {
          prompt: optimizedPrompt,
          texture_resolution: 1024,
          foreground_ratio: 0.85,
          remesh: true
        },
        logs: true,
        onQueueUpdate: (update) => {
          console.log('[Tripo3D] Status:', update.status);
        }
      });

      if (result.data?.model_mesh?.url) {
        const response = {
          glbUrl: result.data.model_mesh.url,
          thumbnailUrl: result.data.rendered_image?.url || null,
          concept,
          chapter,
          verse,
          provider: 'tripo3d',
          isFallback: false
        };
        
        modelCache.set(cacheKey, response);
        return res.status(200).json(response);
      }
    } catch (tripoError) {
      console.error('[Tripo3D] Error:', tripoError.message);
    }

    // Fallback: Try image-to-3D with generated image
    try {
      // First generate an image
      const imageResult = await fal.subscribe('fal-ai/flux/schnell', {
        input: {
          prompt: optimizedPrompt,
          image_size: 'square_hd',
          num_inference_steps: 4
        }
      });

      const imageUrl = imageResult.data?.images?.[0]?.url;
      
      if (imageUrl) {
        // Then convert to 3D
        const meshResult = await fal.subscribe('fal-ai/tripo3d/v2.5/image-to-3d', {
          input: {
            image_url: imageUrl,
            texture_resolution: 1024,
            foreground_ratio: 0.85,
            remesh: true
          },
          logs: true
        });

        if (meshResult.data?.model_mesh?.url) {
          const response = {
            glbUrl: meshResult.data.model_mesh.url,
            thumbnailUrl: imageUrl,
            concept,
            chapter,
            verse,
            provider: 'tripo3d-i2m',
            isFallback: false
          };
          
          modelCache.set(cacheKey, response);
          return res.status(200).json(response);
        }
      }
    } catch (fallbackError) {
      console.error('[Image-to-3D] Error:', fallbackError.message);
    }

    // Final fallback: Return null GLB (will use procedural animation)
    console.log('[3D API] All generation methods failed, using procedural fallback');
    
    const fallbackResponse = {
      glbUrl: null,
      thumbnailUrl: null,
      concept,
      chapter,
      verse,
      provider: 'procedural',
      isFallback: true
    };
    
    return res.status(200).json(fallbackResponse);

  } catch (error) {
    console.error('[3D API] Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate 3D model',
      details: error.message 
    });
  }
}
