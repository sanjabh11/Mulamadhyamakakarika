/**
 * Auth Validation Endpoint
 * CRITICAL: Validates session tokens and returns user data
 */

import { getSession, deleteSession, getUser } from '../../../lib/redis-store';
import { parseCookie } from '../../../lib/server-session';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Prefer the HttpOnly cookie. Keep Bearer-token fallback only for legacy clients.
    const authHeader = req.headers.authorization;
    const cookieToken = parseCookie(req.headers.cookie, 'whop_session');
    const token = authHeader?.replace('Bearer ', '') || cookieToken;

    if (!token) {
      return res.status(401).json({
        valid: false,
        error: 'Unauthorized'
      });
    }

    // Look up session
    const session = await getSession(token);

    if (!session) {
      return res.status(401).json({
        valid: false,
        error: 'Unauthorized'
      });
    }

    // Check if session expired
    if (session.expiresAt && Date.now() > session.expiresAt) {
      await deleteSession(token);
      return res.status(401).json({
        valid: false,
        error: 'Unauthorized'
      });
    }

    // Get latest user data
    const userData = await getUser(session.userId) || {};

    // Return user data
    return res.status(200).json({
      valid: true,
      id: session.userId,
      email: session.email,
      name: session.name || userData.name,
      tier: userData.tier || session.tier || 'free',
      membershipId: userData.membershipId || session.membershipId,
      createdAt: session.createdAt,
      // Include progress data if available
      progress: userData.progress || null,
      animationsUsedToday: userData.animationsUsedToday || 0
    });

  } catch (error) {
    console.error('[AUTH VALIDATE] Error:', error);
    return res.status(500).json({
      valid: false,
      error: 'Validation failed'
    });
  }
}
