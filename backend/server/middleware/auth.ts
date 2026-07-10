import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { env } from '../config/env';
import { getRedisClient } from '../utils/cache';
import { logger } from '../config/logger';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole | string;
  };
}

export const isB2BRole = (role?: string | null) => {
  return role === 'b2b' || role === 'b2b_buyer' || role === 'b2b_manager';
};

// Generate JWT Token
export const generateToken = (userId: string, email: string, role: UserRole | string): string => {
  const signOptions: jwt.SignOptions = {
    expiresIn: env.JWT_EXPIRE as jwt.SignOptions['expiresIn']
  };

  return jwt.sign(
    { id: userId, email, role },
    env.JWT_SECRET as string,
    signOptions
  );
};

// Generate Refresh Token
export const generateRefreshToken = (userId: string): string => {
  const signOptions: jwt.SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRE as jwt.SignOptions['expiresIn']
  };

  return jwt.sign(
    { id: userId },
    env.JWT_REFRESH_SECRET as string,
    signOptions
  );
};

function getTokenFromRequest(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.split(' ')[1];
  if ((req as any).cookies && (req as any).cookies.token) return (req as any).cookies.token;
  return undefined;
}

// Authenticate middleware - verify JWT token
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'No authentication token provided', code: 'NO_TOKEN' });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET as unknown as string) as any;
    (req as any).user = { userId: decoded.id, email: decoded.email, role: decoded.role, iat: decoded.iat };
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: 'Token expired', code: 'TOKEN_EXPIRED' });
    return res.status(401).json({ success: false, message: 'Invalid token', code: 'INVALID_TOKEN' });
  }
};

// Authorize middleware - check user role
export const authorize = (...allowedRoles: Array<UserRole | string>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!(req as any).user) return res.status(401).json({ success: false, message: 'Not authenticated', code: 'NOT_AUTHENTICATED' });

    const currentRole = String((req as any).user.role);
    const normalizedAllowedRoles = allowedRoles.map(role => String(role));

    const hasAccess = normalizedAllowedRoles.some((allowedRole) => {
      if (allowedRole === 'b2b') {
        return isB2BRole(currentRole);
      }
      return currentRole === allowedRole;
    });

    if (!hasAccess) return res.status(403).json({ success: false, message: 'Insufficient permissions', code: 'INSUFFICIENT_PERMISSIONS' });
    next();
  };
};

// Optional auth - attach user if token exists, continue if not
export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = getTokenFromRequest(req as Request);
    if (!token) return next();
    const decoded = jwt.verify(token, env.JWT_SECRET as unknown as string) as any;
    (req as any).user = { userId: decoded.id, email: decoded.email, role: decoded.role };
  } catch {
    // Ignore optional auth failures
  }
  next();
};

// Rate limiting per user (placeholder for Redis-based implementation)
export const userRateLimit = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  const identifier = user?.userId ? `user:${user.userId}` : `ip:${req.ip}`;
  const key = `rate:${identifier}`;
  const windowMs = env.RATE_LIMIT_WINDOW_MS;
  const maxRequests = env.RATE_LIMIT_MAX_REQUESTS;

  try {
    const client = await getRedisClient();
    if (!client) {
      return next();
    }

    const count = await client.incr(key);
    if (count === 1) {
      await client.pexpire(key, windowMs);
    }

    const remaining = maxRequests - Number(count);
    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, remaining)));

    if (count > maxRequests) {
      logger.warn(`Rate limit exceeded for ${identifier}`);
      return res.status(429).json({
        success: false,
        error: 'Muitas requisições. Por favor, aguarde antes de tentar novamente.',
        code: 'RATE_LIMIT_EXCEEDED',
      });
    }

    return next();
  } catch (error) {
    logger.warn('Redis rate limiter failed, falling back to default policy', { error });
    return next();
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!(req as any).user) return res.status(401).json({ success: false, message: 'Autenticação necessária' });
    if (!roles.includes(String((req as any).user.role))) return res.status(403).json({ success: false, message: 'Acesso negado. Permissões insuficientes.' });
    next();
  };
};