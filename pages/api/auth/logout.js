/**
 * Logout Endpoint
 * Clears session and cookies
 */

import { sessionStore } from './callback';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get session token from cookie
    const cookieToken = parseCookie(req.headers.cookie, 'whop_session');
    
    if (cookieToken) {
      // Remove from session store
      sessionStore.delete(cookieToken);
    }

    // Clear cookies
    res.setHeader('Set-Cookie', [
      'whop_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
      'whop_user_id=; Path=/; SameSite=Lax; Max-Age=0'
    ]);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('[LOGOUT] Error:', error);
    return res.status(500).json({ error: 'Logout failed' });
  }
}

function parseCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  return cookies[name] || null;
}
