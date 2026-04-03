import { announceAchievement, announceMilestone } from '../../../lib/discord-webhook';
import { getUser } from '../../../lib/redis-store';
import { getRequestSession } from '../../../lib/server-session';

const DISCORD_INTERNAL_WEBHOOK_SECRET = process.env.DISCORD_INTERNAL_WEBHOOK_SECRET;

function hasInternalAccess(req) {
    if (!DISCORD_INTERNAL_WEBHOOK_SECRET) {
        return false;
    }

    return req.headers['x-internal-webhook-secret'] === DISCORD_INTERNAL_WEBHOOK_SECRET;
}

function isValidPayload(type, payload) {
    if (!payload || typeof payload !== 'object') {
        return false;
    }

    if (type === 'achievement') {
        return typeof payload.name === 'string'
            && typeof payload.description === 'string'
            && typeof payload.icon === 'string';
    }

    if (type === 'milestone') {
        return typeof payload.milestone === 'string'
            && (payload.chapter === undefined || Number.isInteger(payload.chapter))
            && (payload.details === undefined || typeof payload.details === 'string');
    }

    return false;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { type, payload, userId } = req.body;
        const internalAccess = hasInternalAccess(req);
        const session = internalAccess ? null : await getRequestSession(req);

        if (!internalAccess && !session) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!isValidPayload(type, payload)) {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        if (!internalAccess && userId && session?.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // Fetch real username if userId is provided
        let username = 'A guest seeker';
        if (userId) {
            const user = await getUser(userId);
            if (user && user.name) {
                username = user.name;
            }
        } else if (session?.name) {
            username = session.name;
        }

        if (type === 'achievement') {
            const result = await announceAchievement({
                username: username,
                achievement: payload.name,
                description: payload.description,
                icon: payload.icon
            });
            return res.status(200).json({ success: result.success });
        }

        if (type === 'milestone') {
            const result = await announceMilestone({
                username: username,
                milestone: payload.milestone,
                chapter: payload.chapter,
                details: payload.details
            });
            return res.status(200).json({ success: result.success });
        }

        return res.status(400).json({ error: 'Invalid event type' });
    } catch (error) {
        console.error('[Discord Webhook API] Error:', error);
        return res.status(500).json({ error: 'Failed to send webhook' });
    }
}
