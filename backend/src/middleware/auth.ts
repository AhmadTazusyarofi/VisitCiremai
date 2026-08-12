import type { NextFunction, Request, Response } from 'express';
import { HttpError } from './error.js';
import { SESSION_COOKIE, readSession, type AdminUser } from '../services/auth.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AdminUser;
    }
  }
}

/**
 * Melindungi seluruh /api/admin/*. Token dibaca dari cookie httpOnly,
 * bukan dari header — sehingga tidak bisa dicuri lewat JavaScript.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const admin = readSession(req.cookies?.[SESSION_COOKIE]);
  if (!admin) {
    next(new HttpError(401, 'Sesi Anda sudah berakhir. Silakan masuk kembali.'));
    return;
  }
  req.admin = admin;
  next();
}
