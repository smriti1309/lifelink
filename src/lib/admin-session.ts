import { cookies } from 'next/headers';
import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'lifelink_admin_session';

const SECRET_KEY = process.env.ADMIN_SESSION_SECRET || 'lifelink_secret_admin_session_token_key_2026';

interface AdminSessionPayload {
  email: string;
  exp: number;
}

/**
 * Sign a payload with HMAC SHA-256
 */
function signPayload(payload: AdminSessionPayload): string {
  const json = JSON.stringify(payload);
  const base64Payload = Buffer.from(json).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(base64Payload)
    .digest('base64url');
  return `${base64Payload}.${signature}`;
}

/**
 * Verify a signed session string
 */
export function parseAndVerifySession(token: string | null | undefined): AdminSessionPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [base64Payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(base64Payload)
    .digest('base64url');

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const json = Buffer.from(base64Payload, 'base64url').toString('utf8');
    const payload: AdminSessionPayload = JSON.parse(json);
    if (Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Create admin session cookie in server action
 */
export async function createAdminSession(email: string, rememberMe = false): Promise<void> {
  const cookieStore = await cookies();
  // 24 hours default, 7 days if rememberMe
  const durationMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const exp = Date.now() + durationMs;

  const token = signPayload({ email, exp });

  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(durationMs / 1000),
  });
}

/**
 * Get active admin session from server action or server component
 */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return parseAndVerifySession(token);
}

/**
 * Destroy admin session cookie
 */
export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
