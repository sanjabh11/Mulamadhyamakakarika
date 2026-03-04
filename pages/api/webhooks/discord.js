import { announceAchievement, announceMilestone } from '../../../lib/discord-webhook';
import { getUser } from '../../../lib/redis-store';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { type, payload, userId } = req.body;

        // Fetch real username if userId is provided
        let username = 'A guest seeker';
        if (userId) {
            const user = await getUser(userId);
            if (user && user.name) {
                username = user.name;
            }
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
