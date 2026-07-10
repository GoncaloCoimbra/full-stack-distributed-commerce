import crypto from 'crypto';

export function parseUserIdFromToken(authHeader: string | undefined): string | null {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  const [header, payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'change-me')
    .update(`${header}.${payload}`)
    .digest('base64url');

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { sub?: string; userId?: string; id?: string; exp?: number };
    if (typeof decodedPayload.exp === 'number' && decodedPayload.exp * 1000 <= Date.now()) {
      return null;
    }

    return decodedPayload.sub || decodedPayload.userId || decodedPayload.id || null;
  } catch {
    return null;
  }
}
