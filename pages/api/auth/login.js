import crypto from 'crypto';

function createOAuthState() {
  return crypto.randomBytes(32).toString('hex');
}

function getAppOrigin(req) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  const host = req.headers.host || 'localhost:3004';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  return `${protocol}://${host}`;
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const whopClientId = process.env.NEXT_PUBLIC_WHOP_CLIENT_ID;
  if (!whopClientId) {
    return res.status(500).json({ error: 'Whop OAuth is not configured' });
  }

  const redirectUri = `${getAppOrigin(req)}/api/auth/callback`;
  const state = createOAuthState();
  const isProduction = process.env.NODE_ENV === 'production';
  const secureFlag = isProduction ? '; Secure' : '';

  res.setHeader(
    'Set-Cookie',
    `whop_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${secureFlag}`
  );

  const authUrl = new URL('https://whop.com/oauth');
  authUrl.searchParams.set('client_id', whopClientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid profile email');
  authUrl.searchParams.set('state', state);

  return res.redirect(authUrl.toString());
}

