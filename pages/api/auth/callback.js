/**
 * Whop OAuth Callback Handler
 * CRITICAL: Handles the OAuth redirect from Whop after user login
 */

import { whopSdk, getUserMembership, planIdToTier } from '../../../lib/whop-sdk';
import { userStore } from '../webhooks/whop';

// ⚠️  PRODUCTION WARNING: This in-memory Map is wiped on every serverless cold start.
// Replace with a persistent store before launch:
//   - Vercel KV: import { kv } from '@vercel/kv'
//   - Upstash Redis: import { Redis } from '@upstash/redis'
//   - Edge Config or a database session table
// The Map below is safe for local dev and staging only.
const sessionStore = globalThis.__mmk_sessionStore || new Map();
globalThis.__mmk_sessionStore = sessionStore;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, error, error_description } = req.query;

  // Handle OAuth errors
  if (error) {
    console.error('[AUTH CALLBACK] OAuth error:', error, error_description);
    return res.redirect(`/?auth_error=${encodeURIComponent(error_description || error)}`);
  }

  if (!code) {
    return res.redirect('/?auth_error=no_code');
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await exchangeCodeForTokens(code);
    
    if (!tokenResponse.access_token) {
      throw new Error('No access token received');
    }

    // Get user info from Whop
    const userInfo = await getUserInfo(tokenResponse.access_token);
    
    // Get user's membership/tier
    const membership = await getUserMembership(userInfo.id);
    const tier = membership ? planIdToTier(membership.plan_id) : 'free';

    // Create session
    const sessionToken = generateSessionToken();
    const session = {
      userId: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      tier,
      membershipId: membership?.id || null,
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt: Date.now() + (tokenResponse.expires_in * 1000),
      createdAt: new Date().toISOString()
    };

    // Store session
    sessionStore.set(sessionToken, session);

    // Also update user store
    userStore.set(userInfo.id, {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      tier,
      membershipId: membership?.id || null,
      lastLogin: new Date().toISOString()
    });

    console.log('[AUTH CALLBACK] User authenticated:', {
      userId: userInfo.id,
      email: userInfo.email,
      tier
    });

    // Set session cookie and redirect
    const isProduction = process.env.NODE_ENV === 'production';
    const secureFlag = isProduction ? '; Secure' : '';
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    res.setHeader('Set-Cookie', [
      `whop_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`,
      `whop_user_id=${userInfo.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`
    ]);

    // Redirect to dashboard or home
    return res.redirect('/dashboard?auth=success');

  } catch (error) {
    console.error('[AUTH CALLBACK] Error:', error);
    return res.redirect(`/?auth_error=${encodeURIComponent(error.message)}`);
  }
}

/**
 * Exchange authorization code for tokens
 */
async function exchangeCodeForTokens(code) {
  const clientId = process.env.NEXT_PUBLIC_WHOP_CLIENT_ID;
  const clientSecret = process.env.WHOP_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`
    : 'http://localhost:3000/api/auth/callback';

  const response = await fetch('https://api.whop.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return response.json();
}

/**
 * Get user info from Whop API
 */
async function getUserInfo(accessToken) {
  const response = await fetch('https://api.whop.com/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get user info');
  }

  return response.json();
}

/**
 * Generate secure session token
 */
function generateSessionToken() {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

// Export session store for other routes
export { sessionStore };
