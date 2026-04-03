/**
 * Checkout Intent API
 * POST /api/checkout/intent
 *
 * Captures a user's checkout intent before they are redirected to Whop,
 * persisting an intent ID for join-rate attribution linkage after webhook activation.
 *
 * Request body: { selectedTier, anonymousId?, sessionId?, utmSource?, utmMedium?, utmCampaign? }
 * Returns: { ok: true, checkoutIntentId }
 */

import { emitServerAnalyticsEvent } from '../../../lib/server-analytics';
import { PersistentMap } from '../../../lib/persistent-map';
import crypto from 'crypto';
import { getRequestSession } from '../../../lib/server-session';

// Use a persistent file-backed map for intent storage (replace with Redis/KV in production)
const intentStore = new PersistentMap('checkout-intents');
const VALID_TIERS = new Set(['seeker', 'practitioner', 'teacher']);

function sanitizeOptionalString(value, maxLength = 200) {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    return trimmed.slice(0, maxLength);
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const session = await getRequestSession(req);
        const {
            selectedTier,
            anonymousId,
            sessionId,
            utmSource,
            utmMedium,
            utmCampaign
        } = req.body;

        if (!VALID_TIERS.has(selectedTier)) {
            return res.status(400).json({ error: 'Invalid selected tier' });
        }

        const checkoutIntentId = `intent_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;

        const intent = {
            checkoutIntentId,
            selectedTier,
            userId: session?.userId || null,
            anonymousId: sanitizeOptionalString(anonymousId, 120),
            sessionId: sanitizeOptionalString(sessionId, 120),
            utm: {
                source: sanitizeOptionalString(utmSource, 250) || sanitizeOptionalString(req.headers.referer, 250),
                medium: sanitizeOptionalString(utmMedium, 100),
                campaign: sanitizeOptionalString(utmCampaign, 150)
            },
            createdAt: new Date().toISOString(),
            ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress
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

        const isProduction = process.env.NODE_ENV === 'production';
        const secureFlag = isProduction ? '; Secure' : '';
        res.setHeader(
            'Set-Cookie',
            `checkout_intent_id=${encodeURIComponent(checkoutIntentId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600${secureFlag}`
        );

        return res.status(200).json({ ok: true, checkoutIntentId });

    } catch (error) {
        console.error('[CHECKOUT INTENT] Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
