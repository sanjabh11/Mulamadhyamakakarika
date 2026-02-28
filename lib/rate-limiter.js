/**
 * API Rate Limiter
 * @fix H6 - fal.ai API unprotected from abuse
 * 
 * Simple in-memory rate limiter for API routes
 * For production, use Redis-based solution (Upstash/Vercel KV)
 */

// In-memory store for rate limiting (replace with Redis for production)
const rateLimitStore = new Map();

// Configuration
const RATE_LIMIT_CONFIG = {
  // Anonymous users (by IP)
  anonymous: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,      // 5 requests per minute
  },
  // Free tier users
  free: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 0,                 // No AI animations
  },
  // Seeker tier
  seeker: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 10,                // 10 per day
  },
  // Practitioner & Teacher (unlimited, but still rate limited for abuse)
  practitioner: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,     // 30 per minute max
  },
  teacher: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,     // 60 per minute max
  }
};

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Get rate limit key for a request
 * @param {object} req - Request object
 * @param {string} userTier - User's subscription tier
 * @returns {string} - Rate limit key
 */
function getRateLimitKey(req, userTier) {
  // Get IP address
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || 'unknown';
  
  // Get user ID if authenticated
  const userId = req.headers['x-user-id'] || null;
  
  if (userId) {
    return `user:${userId}:${userTier}`;
  }
  
  return `ip:${ip}:anonymous`;
}

/**
 * Check if request is rate limited
 * @param {string} key - Rate limit key
 * @param {object} config - Rate limit configuration
 * @returns {object} - { limited: boolean, remaining: number, resetTime: number }
 */
function checkRateLimit(key, config) {
  const now = Date.now();
  let data = rateLimitStore.get(key);
  
  // Initialize or reset if window expired
  if (!data || now > data.resetTime) {
    data = {
      count: 0,
      resetTime: now + config.windowMs
    };
  }
  
  // Increment count
  data.count++;
  rateLimitStore.set(key, data);
  
  const remaining = Math.max(0, config.maxRequests - data.count);
  const limited = data.count > config.maxRequests;
  
  return {
    limited,
    remaining,
    resetTime: data.resetTime,
    total: config.maxRequests
  };
}

/**
 * Rate limiting middleware for Next.js API routes
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {string} userTier - User's subscription tier (from auth)
 * @returns {boolean} - true if request should proceed, false if rate limited
 */
export function rateLimitMiddleware(req, res, userTier = 'anonymous') {
  const tier = userTier || 'anonymous';
  const config = RATE_LIMIT_CONFIG[tier] || RATE_LIMIT_CONFIG.anonymous;
  const key = getRateLimitKey(req, tier);
  
  const result = checkRateLimit(key, config);
  
  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', result.total);
  res.setHeader('X-RateLimit-Remaining', result.remaining);
  res.setHeader('X-RateLimit-Reset', result.resetTime);
  
  if (result.limited) {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: tier === 'free' 
        ? 'Free tier does not include AI animations. Upgrade to Seeker for 10 animations/day.'
        : `Too many requests. Please wait ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds.`,
      retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      upgradeUrl: tier === 'free' || tier === 'anonymous' 
        ? '/pricing' 
        : null
    });
    return false;
  }
  
  return true;
}

/**
 * Get current rate limit status for a user
 * @param {string} userId - User ID
 * @param {string} userTier - User's subscription tier
 * @returns {object} - Rate limit status
 */
export function getRateLimitStatus(userId, userTier) {
  const key = userId ? `user:${userId}:${userTier}` : null;
  if (!key) return null;
  
  const config = RATE_LIMIT_CONFIG[userTier] || RATE_LIMIT_CONFIG.anonymous;
  const data = rateLimitStore.get(key);
  
  if (!data) {
    return {
      used: 0,
      remaining: config.maxRequests,
      total: config.maxRequests,
      resetTime: Date.now() + config.windowMs
    };
  }
  
  return {
    used: data.count,
    remaining: Math.max(0, config.maxRequests - data.count),
    total: config.maxRequests,
    resetTime: data.resetTime
  };
}

export default rateLimitMiddleware;
