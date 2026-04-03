import { getSession } from './redis-store';

function decodeCookieValue(value) {
  if (!value) {
    return null;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function parseCookie(cookieHeader, name) {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (!trimmed) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex);
    if (key !== name) {
      continue;
    }

    return decodeCookieValue(trimmed.slice(separatorIndex + 1));
  }

  return null;
}

export async function getSessionFromCookieHeader(cookieHeader) {
  const token = parseCookie(cookieHeader, 'whop_session');
  if (!token) {
    return null;
  }

  const session = await getSession(token);
  if (!session) {
    return null;
  }

  if (session.expiresAt && Date.now() > session.expiresAt) {
    return null;
  }

  return session;
}

export async function getRequestSession(req) {
  const cookieHeader = typeof req.headers?.get === 'function'
    ? req.headers.get('cookie')
    : req.headers?.cookie;

  return getSessionFromCookieHeader(cookieHeader);
}

export async function getEffectiveTier(req, fallbackTier = 'anonymous') {
  const session = await getRequestSession(req);
  return session?.tier || fallbackTier;
}
