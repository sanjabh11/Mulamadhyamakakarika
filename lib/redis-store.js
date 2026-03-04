import { Redis } from '@upstash/redis';

// Fallback in-memory map for local dev without Upstash
const memoryStore = globalThis.__mmk_memoryStore || new Map();
globalThis.__mmk_memoryStore = memoryStore;

let redis = null;
try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    }
} catch (error) {
    console.warn('[REDIS STORE] Failed to initialize Upstash Redis, falling back to memory store.');
}

export async function setSession(key, value, maxAgeSeconds = 7 * 24 * 60 * 60) {
    if (redis) {
        await redis.set(`session:${key}`, value, { ex: maxAgeSeconds });
    } else {
        memoryStore.set(`session:${key}`, value);
    }
}

export async function getSession(key) {
    if (redis) {
        return await redis.get(`session:${key}`);
    }
    return memoryStore.get(`session:${key}`);
}

export async function deleteSession(key) {
    if (redis) {
        await redis.del(`session:${key}`);
    } else {
        memoryStore.delete(`session:${key}`);
    }
}

export async function setUser(key, value) {
    if (redis) {
        await redis.set(`user:${key}`, value);
    } else {
        memoryStore.set(`user:${key}`, value);
    }
}

export async function getUser(key) {
    if (redis) {
        return await redis.get(`user:${key}`);
    }
    return memoryStore.get(`user:${key}`);
}

export async function deleteUser(key) {
    if (redis) {
        await redis.del(`user:${key}`);
    } else {
        memoryStore.delete(`user:${key}`);
    }
}
