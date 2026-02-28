/**
 * Whop SDK Configuration
 * CRITICAL: This is the actual Whop SDK setup for production use
 * 
 * Install: npm install @whop/sdk
 */

// Import will work after npm install @whop/sdk
let Whop;
try {
  const whopModule = require('@whop/sdk');
  Whop = whopModule.Whop;
} catch (e) {
  // Fallback for development without SDK installed
  console.warn('Whop SDK not installed. Run: npm install @whop/sdk');
}

/**
 * Server-side Whop SDK instance
 * Use this for all server-side Whop API calls
 */
export const whopSdk = Whop ? new Whop({
  appID: process.env.NEXT_PUBLIC_WHOP_APP_ID,
  apiKey: process.env.WHOP_API_KEY,
  webhookKey: process.env.WHOP_WEBHOOK_SECRET 
    ? Buffer.from(process.env.WHOP_WEBHOOK_SECRET).toString('base64')
    : undefined,
}) : null;

/**
 * Verify user token from request headers
 * @param {Headers} headers - Request headers
 * @returns {Promise<{userId: string}>}
 */
export async function verifyUserToken(headers) {
  if (!whopSdk) {
    throw new Error('Whop SDK not initialized');
  }
  
  const authHeader = headers.get?.('authorization') || headers['authorization'];
  if (!authHeader) {
    throw new Error('No authorization header');
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    const result = await whopSdk.verifyUserToken(token);
    return result;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
}

/**
 * Check if user has access to a specific experience/product
 * @param {string} experienceId - The experience/product ID
 * @param {string} userId - User ID
 * @returns {Promise<{has_access: boolean, access_level: string}>}
 */
export async function checkUserAccess(experienceId, userId) {
  if (!whopSdk) {
    // Development fallback
    return { has_access: true, access_level: 'customer' };
  }
  
  try {
    const access = await whopSdk.users.checkAccess(experienceId, { id: userId });
    return access;
  } catch (error) {
    console.error('Access check failed:', error);
    return { has_access: false, access_level: null };
  }
}

/**
 * Get user's membership details
 * @param {string} userId - User ID
 * @returns {Promise<object>}
 */
export async function getUserMembership(userId) {
  if (!whopSdk) {
    return null;
  }
  
  try {
    const memberships = await whopSdk.memberships.list({
      user_id: userId,
      valid: true
    });
    return memberships.data?.[0] || null;
  } catch (error) {
    console.error('Failed to get membership:', error);
    return null;
  }
}

/**
 * Create checkout session for a plan
 * @param {string} planId - Plan ID
 * @param {object} metadata - Additional metadata
 * @returns {Promise<{checkoutUrl: string}>}
 */
export async function createCheckoutSession(planId, metadata = {}) {
  if (!whopSdk) {
    // Fallback to direct URL
    return {
      checkoutUrl: `https://whop.com/checkout/${planId}`
    };
  }
  
  try {
    const session = await whopSdk.payments.createCheckoutSession({
      planId,
      metadata
    });
    return session;
  } catch (error) {
    console.error('Failed to create checkout:', error);
    return {
      checkoutUrl: `https://whop.com/checkout/${planId}`
    };
  }
}

/**
 * Validate webhook signature
 * @param {string} body - Raw request body
 * @param {object} headers - Request headers
 * @returns {object} - Parsed webhook data
 */
export function validateWebhook(body, headers) {
  if (!whopSdk) {
    // Parse without validation in dev
    return JSON.parse(body);
  }
  
  try {
    const webhookData = whopSdk.webhooks.unwrap(body, { headers });
    return webhookData;
  } catch (error) {
    console.error('Webhook validation failed:', error);
    throw new Error('Invalid webhook signature');
  }
}

/**
 * Plan IDs for each tier
 * Replace with actual plan IDs from Whop dashboard
 */
export const PLAN_IDS = {
  seeker: process.env.NEXT_PUBLIC_WHOP_PLAN_SEEKER || 'plan_seeker',
  practitioner: process.env.NEXT_PUBLIC_WHOP_PLAN_PRACTITIONER || 'plan_practitioner',
  teacher: process.env.NEXT_PUBLIC_WHOP_PLAN_TEACHER || 'plan_teacher'
};

/**
 * Map Whop plan ID to tier
 * @param {string} planId - Whop plan ID
 * @returns {string} - Tier name
 */
export function planIdToTier(planId) {
  const mapping = {
    [PLAN_IDS.seeker]: 'seeker',
    [PLAN_IDS.practitioner]: 'practitioner',
    [PLAN_IDS.teacher]: 'teacher'
  };
  return mapping[planId] || 'free';
}

export default whopSdk;
