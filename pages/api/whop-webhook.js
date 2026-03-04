/**
 * Whop Webhook Handler
 * 
 * Handles membership events from Whop:
 * - membership.created
 * - membership.updated
 * - membership.cancelled
 * - payment.completed
 */

import { validateWebhook, planIdToTier } from '../../lib/whop-sdk';
import { announceMilestone } from '../../lib/discord-webhook';
import { getUser, setUser } from '../../lib/redis-store';

export const config = {
  api: {
    bodyParser: false, // Need raw body for signature verification
  },
};

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
    const rawBody = await getRawBody(req);

    // Validate webhook signature
    const event = validateWebhook(rawBody, req.headers);

    console.log('[Whop Webhook] Received event:', event.type);

    switch (event.type) {
      case 'membership.created':
        await handleMembershipCreated(event.data);
        break;

      case 'membership.updated':
        await handleMembershipUpdated(event.data);
        break;

      case 'membership.cancelled':
        await handleMembershipCancelled(event.data);
        break;

      case 'payment.completed':
        await handlePaymentCompleted(event.data);
        break;

      default:
        console.log('[Whop Webhook] Unhandled event type:', event.type);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[Whop Webhook] Error:', error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Handle new membership creation
 */
async function handleMembershipCreated(data) {
  const { user, plan_id, membership_id } = data;
  const tier = planIdToTier(plan_id);

  console.log(`[Webhook] New membership: ${user?.username || 'Unknown'} -> ${tier}`);

  // Announce to Discord
  if (tier !== 'free') {
    await announceMilestone({
      username: user?.username || 'A new seeker',
      milestone: 'first_chapter',
      details: `Joined the ${tier} tier 🙏`
    });
  }

  // Update user record in Redis
  if (user?.id) {
    const existingUser = await getUser(user.id) || {};
    await setUser(user.id, {
      ...existingUser,
      membershipId: membership_id,
      tier: tier,
      updatedAt: Date.now()
    });
  }
}

/**
 * Handle membership updates (upgrades/downgrades)
 */
async function handleMembershipUpdated(data) {
  const { user, plan_id, previous_plan_id } = data;
  const newTier = planIdToTier(plan_id);
  const oldTier = planIdToTier(previous_plan_id);

  console.log(`[Webhook] Membership updated: ${user?.username} ${oldTier} -> ${newTier}`);

  // Announce upgrades
  const tierOrder = ['free', 'seeker', 'practitioner', 'teacher', 'enlightened'];
  if (tierOrder.indexOf(newTier) > tierOrder.indexOf(oldTier)) {
    await announceMilestone({
      username: user?.username || 'A dedicated practitioner',
      milestone: 'upgrade',
      details: `Upgraded to ${newTier}! 🚀`
    });
  }

  // Update user record in Redis
  if (user?.id) {
    const existingUser = await getUser(user.id) || {};
    await setUser(user.id, {
      ...existingUser,
      tier: newTier,
      updatedAt: Date.now()
    });
  }
}

/**
 * Handle membership cancellation
 */
async function handleMembershipCancelled(data) {
  const { user, plan_id, cancellation_reason } = data;

  console.log(`[Webhook] Membership cancelled: ${user?.username}`);

  // Downgrade user to free tier in Redis
  if (user?.id) {
    const existingUser = await getUser(user.id) || {};
    await setUser(user.id, {
      ...existingUser,
      tier: 'free',
      membershipId: null,
      updatedAt: Date.now()
    });
  }
}

/**
 * Handle payment completion
 */
async function handlePaymentCompleted(data) {
  const { user, amount, plan_id } = data;

  console.log(`[Webhook] Payment completed: ${user?.username} - $${amount / 100}`);

  // Could:
  // - Send receipt
  // - Update payment history
  // - Track revenue analytics
}
