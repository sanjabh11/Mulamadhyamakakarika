/**
 * Whop OAuth Callback Handler
 * CRITICAL: Handles the OAuth redirect from Whop after user login
 */

import { getUserMembership, planIdToTier } from '../../../lib/whop-sdk';
import { setSession, setUser } from '../../../lib/redis-store';
import { emitServerAnalyticsEvent } from '../../../lib/server-analytics';
import { parseCookie } from '../../../lib/server-session';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, error, error_description, state } = req.query;
  const cookieState = parseCookie(req.headers.cookie, 'whop_oauth_state');

  // Handle OAuth errors
  if (error) {
    console.error('[AUTH CALLBACK] OAuth error:', error, error_description);
    return res.redirect(`/?auth_error=${encodeURIComponent('oauth_failed')}`);
  }

  if (!code) {
    return res.redirect('/?auth_error=no_code');
  }

  if (!state || !cookieState || state !== cookieState) {
    console.error('[AUTH CALLBACK] OAuth state mismatch');
    return res.redirect('/?auth_error=invalid_oauth_state');
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
      expiresAt: Date.now() + (tokenResponse.expires_in * 1000),
      createdAt: new Date().toISOString()
    };

    // Persist session and user with durable store
    await setSession(sessionToken, session);
    await setUser(userInfo.id, {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      tier,
      membershipId: membership?.id || null,
      lastLogin: new Date().toISOString()
    });

    // Emit server-side analytics event for attribution
    emitServerAnalyticsEvent('login_succeeded', {
      userId: userInfo.id,
      tier,
      membershipId: membership?.id || null,
      // Link checkout intent cookie if present for attribution
      checkoutIntentId: req.cookies?.checkout_intent_id || null
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
      `whop_session=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secureFlag}`,
      `whop_user_id=${userInfo.id}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secureFlag}`,
      `whop_oauth_state=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`
    ]);

    // Redirect to dashboard or home
    return res.redirect('/dashboard?auth=success');

  } catch (error) {
    console.error('[AUTH CALLBACK] Error:', error);
    return res.redirect(`/?auth_error=${encodeURIComponent('auth_callback_failed')}`);
  }
}

/**
 * Exchange authorization code for tokens
 */
async function exchangeCodeForTokens(code) {
  const clientId = process.env.NEXT_PUBLIC_WHOP_CLIENT_ID;
  const clientSecret = process.env.WHOP_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Missing Whop OAuth config: NEXT_PUBLIC_WHOP_CLIENT_ID and/or WHOP_CLIENT_SECRET');
  }
  const redirectUri = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`
    : 'http://localhost:3004/api/auth/callback';

  const response = await fetch('https://api.whop.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Authorization': `Bearer ${accessToken}` }
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
