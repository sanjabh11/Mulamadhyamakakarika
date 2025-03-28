import { fal } from '@fal-ai/client';

// Configure fal.ai client
fal.config({
  credentials: process.env.FAL_API_KEY || process.env.FAL_KEY,
});

// Cache of generated animations to avoid redundant API calls
const animationCache = new Map();

// Helper function to log detailed error information
function logDetailedError(error, context) {
  console.error(`Error in ${context}:`, error);
  console.error('Error details:', {
    message: error.message,
    cause: error.cause ? {
      message: error.cause.message,
      code: error.cause.code,
      hostname: error.cause.hostname
    } : 'No cause',
    stack: error.stack
  });
}

// Function to determine which fallback to use based on prompt content
const getFallbackType = (prompt = "") => {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes("entangle")) return "entanglement";
  if (promptLower.includes("superposition")) return "superposition";
  if (promptLower.includes("double-slit") || promptLower.includes("complementarity")) return "complementarity";
  if (promptLower.includes("wave function") || promptLower.includes("probability cloud")) return "wave-function";
  if (promptLower.includes("decoherence") || promptLower.includes("environment interaction")) return "decoherence";
  if (promptLower.includes("non-local") || promptLower.includes("distance")) return "non-locality";
  if (promptLower.includes("fluctuation") || promptLower.includes("virtual particle")) return "fluctuations";
  if (promptLower.includes("observer") || promptLower.includes("scientist observing")) return "observer-effect";
  return "default";
};

// Concept-specific fallback data
const FALLBACK_DATA = {
  "entanglement": {
    animationUrl: "https://storage.googleapis.com/quantum-animations/entanglement.mp4",
    thumbnailUrl: "https://storage.googleapis.com/quantum-animations/entanglement-thumb.jpg",
  },
  "superposition": {
    animationUrl: "https://storage.googleapis.com/quantum-animations/superposition.mp4",
    thumbnailUrl: "https://storage.googleapis.com/quantum-animations/superposition-thumb.jpg",
  },
  "complementarity": {
    animationUrl: "https://storage.googleapis.com/quantum-animations/wave-particle.mp4",
    thumbnailUrl: "https://storage.googleapis.com/quantum-animations/wave-particle-thumb.jpg",
  },
  "wave-function": {
    animationUrl: "https://storage.googleapis.com/quantum-animations/wave-function.mp4",
    thumbnailUrl: "https://storage.googleapis.com/quantum-animations/wave-function-thumb.jpg",
  },
  "decoherence": {
    animationUrl: "https://storage.googleapis.com/quantum-animations/decoherence.mp4",
    thumbnailUrl: "https://storage.googleapis.com/quantum-animations/decoherence-thumb.jpg",
  },
  "non-locality": {
    animationUrl: "https://storage.googleapis.com/quantum-animations/non-locality.mp4",
    thumbnailUrl: "https://storage.googleapis.com/quantum-animations/non-locality-thumb.jpg",
  },
  "fluctuations": {
    animationUrl: "https://storage.googleapis.com/quantum-animations/quantum-fluctuations.mp4",
    thumbnailUrl: "https://storage.googleapis.com/quantum-animations/quantum-fluctuations-thumb.jpg",
  },
  "observer-effect": {
    animationUrl: "https://storage.googleapis.com/quantum-animations/observer-effect.mp4",
    thumbnailUrl: "https://storage.googleapis.com/quantum-animations/observer-effect-thumb.jpg",
  },
  "default": {
    animationUrl: "https://storage.googleapis.com/falserverless/fal-ai/fast-sdxl-animation/videos/b63dd31e-d62a-49b1-bc0c-b437e0ad3b35.mp4",
    thumbnailUrl: "https://storage.googleapis.com/falserverless/fal-ai/sd-turbo/images/0f0fbf90-9a8c-4d58-890a-86f4d18bb4b0.jpeg",
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt, chapter, verse, method = 'hyper3d' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    // Create a cache key based on the prompt and other parameters
    const cacheKey = `${chapter}-${verse}-${prompt.substring(0, 50)}`;
    
    // Check if we already have this animation in cache
    if (animationCache.has(cacheKey)) {
      console.log('Using cached animation for:', cacheKey);
      return res.status(200).json(animationCache.get(cacheKey));
    }

    // Get the appropriate fallback based on the prompt
    const conceptType = getFallbackType(prompt);
    const fallbackData = FALLBACK_DATA[conceptType] || FALLBACK_DATA.default;
    
    // Add chapter and verse to the fallback data
    const fallbackResponse = {
      ...fallbackData,
      chapter,
      verse,
      isFallback: true
    };

    // Choose the appropriate method based on the request
    if (method === 'hyper3d') {
      // Use Hyper3D Rodin for more advanced generations
      try {
        console.log('Generating with Hyper3D, prompt:', prompt);
        
        // ============================================================
        // USING REAL FAL.AI API INSTEAD OF MOCK DATA
        // ============================================================
        
        try {
          // First, generate an animated image with appropriate content
          console.log('Calling stable-diffusion-xl model...');
          const resultObj = await fal.run('110602490-lcm-sd15-i2i', {
            input: {
              prompt: `Scientific visualization of quantum entanglement, two glowing particles linked by a shimmering thread, particle physics, quantum mechanics, cosmic void, ${prompt}`,
              negative_prompt: "cartoon, 3D rendering, animals, childish, low quality",
              num_steps: 30,
              guidance_scale: 7.5,
              image_size: {
                width: 768,
                height: 768
              }
            },
          });
          
          // Extract the data from the result
          const result = resultObj.data;
          
          // Get the image URL from the result
          const generatedImageUrl = result.image?.url || result.images?.[0]?.url;
          console.log('Generated image URL:', generatedImageUrl);
          
          // Create a simple animation effect
          console.log('Calling sdxl-video model...');
          const animationResultObj = await fal.run('110602490-sdxl-video', {
            input: {
              prompt: `Scientific visualization of quantum entanglement, two glowing particles in cosmic void, connected by quantum thread, particle physics, quantum mechanics, professional rendering, ${prompt}`,
              negative_prompt: "cartoon, 3D rendering, animals, childish, low quality",
              num_frames: 24,
              fps: 12,
              motion_bucket_id: 127,
              width: 768,
              height: 768,
              seed: Math.floor(Math.random() * 1000000)
            },
          });
          
          // Extract the data from the result
          const animationResult = animationResultObj.data;
          
          // Return the results
          const responseData = {
            animationUrl: animationResult.video_url || animationResult.output?.video_url,
            thumbnailUrl: generatedImageUrl,
            modelUrl: null, // No 3D model for now
            chapter,
            verse,
            isFallback: false
          };
          
          // Cache the result
          animationCache.set(cacheKey, responseData);
          
          return res.status(200).json(responseData);
        } catch (modelError) {
          logDetailedError(modelError, 'fal.ai model API call');
          
          // Return fallback data if API call fails
          console.log(`Using ${conceptType} fallback data due to API error`);
          
          // Cache the fallback result to avoid repeated failures
          animationCache.set(cacheKey, fallbackResponse);
          
          return res.status(200).json(fallbackResponse);
        }
        
      } catch (error) {
        logDetailedError(error, 'Hyper3D generation');
        
        // Return fallback data if Hyper3D generation fails
        console.log(`Using ${conceptType} fallback data due to Hyper3D error`);
        
        // Cache the fallback result to avoid repeated failures
        animationCache.set(cacheKey, fallbackResponse);
        
        return res.status(200).json(fallbackResponse);
      }
    } else {
      // Use traditional animation API
      try {
        console.log('Generating with standard animation, prompt:', prompt);
        
        // ============================================================
        // USING REAL FAL.AI API INSTEAD OF MOCK DATA
        // ============================================================
        
        try {
          // Use a standard image-to-video model
          console.log('Calling sdxl-video model (standard)...');
          const resultObj = await fal.run('110602490-sdxl-video', {
            input: {
              prompt: `Scientific visualization of quantum entanglement, two glowing particles in cosmic void, particle physics visualization, quantum mechanics, ${prompt}`,
              negative_prompt: "cartoon, 3D rendering, animals, childish, low quality",
              num_frames: 24,
              fps: 12,
              motion_bucket_id: 127,
              width: 768,
              height: 768,
              seed: Math.floor(Math.random() * 1000000)
            },
          });
          
          // Extract the data from the result
          const result = resultObj.data;
          
          // Cache and return results
          const responseData = { 
            animationUrl: result.video_url || result.output?.video_url,
            thumbnailUrl: result.thumbnail_url || result.output?.thumbnail_url || result.video_frames?.[0],
            chapter,
            verse,
            isFallback: false
          };
          
          // Cache the result
          animationCache.set(cacheKey, responseData);
          
          return res.status(200).json(responseData);
        } catch (modelError) {
          logDetailedError(modelError, 'fal.ai model API call (standard)');
          
          // Return fallback data if API call fails
          console.log(`Using ${conceptType} fallback data due to standard API error`);
          
          // Cache the fallback result to avoid repeated failures
          animationCache.set(cacheKey, fallbackResponse);
          
          return res.status(200).json(fallbackResponse);
        }
      } catch (error) {
        logDetailedError(error, 'standard animation generation');
        
        // Return fallback data if standard animation generation fails
        console.log(`Using ${conceptType} fallback data due to standard animation error`);
        
        // Cache the fallback result to avoid repeated failures
        animationCache.set(cacheKey, fallbackResponse);
        
        return res.status(200).json(fallbackResponse);
      }
    }
  } catch (error) {
    logDetailedError(error, 'animation generation');
    
    // Return fallback data if animation generation fails
    const { chapter, verse, prompt } = req.body;
    const conceptType = getFallbackType(prompt || "");
    const fallbackData = FALLBACK_DATA[conceptType] || FALLBACK_DATA.default;
    
    console.log(`Using ${conceptType} fallback data due to general error`);
    const fallbackResponse = {
      ...fallbackData,
      chapter: chapter || '3',
      verse: verse || '1',
      isFallback: true
    };
    
    return res.status(200).json(fallbackResponse);
  }
} 