/**
 * Whop Webhook Handler
 * CRITICAL: Handles payment and membership events from Whop
 * 
 * Events handled:
 * - payment.succeeded
 * - membership.activated
 * - membership.deactivated
 */

import { validateWebhook, planIdToTier } from '../../../lib/whop-sdk';

// Disable body parsing - we need raw body for signature validation
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * In-memory user store (replace with database in production)
 * Structure: { odId: { tier, membershipId, validUntil, ... } }
 */
const userStore = globalThis.userStore || new Map();
globalThis.userStore = userStore;

/**
 * Get raw body from request
 */
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get raw body for signature validation
    const rawBody = await getRawBody(req);
    
    // Validate webhook signature
    const headers = {
      'webhook-id': req.headers['webhook-id'],
      'webhook-timestamp': req.headers['webhook-timestamp'],
      'webhook-signature': req.headers['webhook-signature'],
    };
    
    let webhookData;
    try {
      webhookData = validateWebhook(rawBody, headers);
    } catch (error) {
      console.error('Webhook validation failed:', error);
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const { type, data } = webhookData;
    
    console.log(`[WHOP WEBHOOK] Received: ${type}`, data);

    // Handle different event types
    switch (type) {
      case 'payment.succeeded':
        await handlePaymentSucceeded(data);
        break;
        
      case 'membership.activated':
        await handleMembershipActivated(data);
        break;
        
      case 'membership.deactivated':
        await handleMembershipDeactivated(data);
        break;
        
      default:
        console.log(`[WHOP WEBHOOK] Unhandled event type: ${type}`);
    }

    // Always return 200 quickly to prevent retries
    return res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('[WHOP WEBHOOK] Error:', error);
    // Still return 200 to prevent infinite retries
    return res.status(200).json({ received: true, error: error.message });
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(payment) {
  console.log('[PAYMENT SUCCEEDED]', {
    id: payment.id,
    userId: payment.user_id,
    amount: payment.amount,
    planId: payment.plan_id
  });
  
  // Track payment in analytics
  // In production, save to database
  
  const userId = payment.user_id;
  const tier = planIdToTier(payment.plan_id);
  
  // Update user store
  const existingUser = userStore.get(userId) || {};
  userStore.set(userId, {
    ...existingUser,
    tier,
    lastPayment: {
      id: payment.id,
      amount: payment.amount,
      date: new Date().toISOString()
    }
  });
}

/**
 * Handle membership activation
 */
async function handleMembershipActivated(membership) {
  console.log('[MEMBERSHIP ACTIVATED]', {
    id: membership.id,
    userId: membership.user_id,
    productId: membership.product_id,
    planId: membership.plan_id
  });
  
  const userId = membership.user_id;
  const tier = planIdToTier(membership.plan_id);
  
  // Update user store
  userStore.set(userId, {
    id: userId,
    tier,
    membershipId: membership.id,
    productId: membership.product_id,
    status: 'active',
    activatedAt: new Date().toISOString(),
    validUntil: membership.renewal_period_end || null
  });
  
  console.log(`[USER ACTIVATED] User ${userId} now has tier: ${tier}`);
}

/**
 * Handle membership deactivation
 */
async function handleMembershipDeactivated(membership) {
  console.log('[MEMBERSHIP DEACTIVATED]', {
    id: membership.id,
    userId: membership.user_id,
    reason: membership.cancellation_reason
  });
  
  const userId = membership.user_id;
  
  // Update user store - downgrade to free
  const existingUser = userStore.get(userId) || {};
  userStore.set(userId, {
    ...existingUser,
    tier: 'free',
    status: 'inactive',
    deactivatedAt: new Date().toISOString(),
    deactivationReason: membership.cancellation_reason
  });
  
  console.log(`[USER DEACTIVATED] User ${userId} downgraded to free tier`);
}

/**
 * Export user store for use in other API routes
 */
export { userStore };
