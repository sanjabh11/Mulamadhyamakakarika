import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';
import { COMPANION_MODEL_ID, SYSTEM_PROMPT_FILE } from '../../../../lib/research-metadata';
import { getEffectiveTier, getRequestSession } from '../../../../lib/server-session';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export const maxDuration = 30;

export async function POST(req) {
    try {
        const { messages, chapterId, verseId, verseData } = await req.json();
        const session = await getRequestSession(req);
        const tier = await getEffectiveTier(req, 'free');

        if (!Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: 'Messages are required' }), { status: 400 });
        }

        // Tier Quota Check
        const quotaMap = { free: 0, seeker: 5, practitioner: 50, teacher: Infinity };
        const maxMessages = quotaMap[tier] || 0;

        if (maxMessages === 0) {
            return new Response(JSON.stringify({ error: 'Upgrade required to use Quantum Companion' }), { status: 403 });
        }

        if (maxMessages !== Infinity) {
            const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
            const identityKey = session?.userId ? `user:${session.userId}` : `ip:${ip}`;
            const today = new Date().toISOString().split('T')[0];
            const key = `companion_quota:${identityKey}:${today}`;

            // Only use Redis if configured, otherwise bypass for local dev
            if (process.env.UPSTASH_REDIS_REST_URL) {
                const current = await redis.incr(key);
                if (current === 1) await redis.expire(key, 86400); // 24h

                if (current > maxMessages) {
                    return new Response(JSON.stringify({ error: `Daily quota of ${maxMessages} messages exceeded for ${tier} tier.` }), { status: 429 });
                }
            }
        }

        // Context preparation
        const systemPromptPath = path.join(process.cwd(), SYSTEM_PROMPT_FILE);
        let systemPromptBase = "You are MADHYAMAKA-GPT, a synthesis of a Tibetan Geshe, a Quantum Physicist, a Pedagogue, and a Technical Artist.";
        try {
            if (fs.existsSync(systemPromptPath)) {
                systemPromptBase = fs.readFileSync(systemPromptPath, 'utf8');
            }
        } catch (e) {
            console.warn("Could not read system prompt file, using default.");
        }

        const verseContext = `
      CURRENT VERSE CONTEXT:
      Chapter: ${chapterId}
      Verse: ${verseId}
      Title: ${verseData?.title || 'Unknown'}
      Sanskrit: ${verseData?.sanskrit || 'Not provided'}
      Translation: ${verseData?.translation || 'Not provided'}
      Philosophy Insight: ${verseData?.philosophy?.insight || 'Not provided'}
      Quantum Resonance: ${verseData?.quantumResonance || 'Not provided'}
    `;

        const systemMessage = systemPromptBase + "\n\n" + verseContext;

        const google = createGoogleGenerativeAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const result = await streamText({
            model: google(COMPANION_MODEL_ID),
            system: systemMessage,
            messages,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to process chat request' }), { status: 500 });
    }
}
