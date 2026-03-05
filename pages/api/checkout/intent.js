/**
 * Checkout Intent API
 * POST /api/checkout/intent
 *
 * Captures a user's checkout intent before they are redirected to Whop,
 * persisting an intent ID for join-rate attribution linkage after webhook activation.
 *
 * Request body: { checkoutIntentId, selectedTier, userId?, anonymousId?, sessionId?, utmSource?, utmMedium?, utmCampaign? }
 * Returns: { ok: true, checkoutIntentId }
 */

import { emitServerAnalyticsEvent } from '../../../lib/server-analytics';
import { PersistentMap } from '../../../lib/persistent-map';
import crypto from 'crypto';

// Use a persistent file-backed map for intent storage (replace with Redis/KV in production)
const intentStore = new PersistentMap('checkout-intents');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            checkoutIntentId: clientIntentId,
            selectedTier,
            userId,
            anonymousId,
            sessionId,
            utmSource,
            utmMedium,
            utmCampaign
        } = req.body;

        // Use client-provided ID or generate a secure fallback
        const checkoutIntentId = clientIntentId || `intent_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

        const intent = {
            checkoutIntentId,
            selectedTier: selectedTier || 'unknown',
            userId: userId || null,
            anonymousId: anonymousId || null,
            sessionId: sessionId || null,
            utm: {
                source: utmSource || req.headers.referer || null,
                medium: utmMedium || null,
                campaign: utmCampaign || null
            },
            createdAt: new Date().toISOString(),
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        };

        // Persist intent for later attribution linkage
        await intentStore.set(checkoutIntentId, intent);

        // Emit server analytics event for attribution traceability
        emitServerAnalyticsEvent('checkout_intent_captured', {
            checkoutIntentId,
            selectedTier: intent.selectedTier,
            userId: intent.userId,
            anonymousId: intent.anonymousId,
            sessionId: intent.sessionId,
            utm: intent.utm
        });

        return res.status(200).json({ ok: true, checkoutIntentId });

    } catch (error) {
        console.error('[CHECKOUT INTENT] Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
