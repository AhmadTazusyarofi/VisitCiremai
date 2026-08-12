import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { CookieOptions, Response } from 'express';
import { execute, queryOne } from '../db.js';
import { env, isProduction } from '../env.js';

export const SESSION_COOKIE = 'vc_session';

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari

export type AdminUser = { id: number; username: string };

type AdminRow = { id: number; username: string; password_hash: string };

/** Memverifikasi kredensial. Mengembalikan null bila salah. */
export async function verifyCredentials(
  username: string,
  password: string,
): Promise<AdminUser | null> {
  const row = await queryOne<AdminRow>(
    'SELECT id, username, password_hash FROM admins WHERE username = ?',
    [username],
  );

  if (!row) {
    // Tetap kerjakan bcrypt walau username tidak ada, supaya waktu respons
    // "username salah" dan "password salah" tidak bisa dibedakan penyerang.
    await bcrypt.hash(password, 12);
    return null;
  }

  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return null;

  return { id: row.id, username: row.username };
}

function cookieOptions(): CookieOptions {
  return {
    httpOnly: true, // tidak bisa dibaca JavaScript → aman dari pencurian lewat XSS
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
    maxAge: MAX_AGE_MS,
  };
}

/** Menandatangani JWT dan menaruhnya di cookie httpOnly. */
export function setSessionCookie(res: Response, user: AdminUser): void {
  const token = jwt.sign({ username: user.username }, env.JWT_SECRET, {
    subject: String(user.id),
    expiresIn: '7d',
  });
  res.cookie(SESSION_COOKIE, token, cookieOptions());
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, { ...cookieOptions(), maxAge: undefined });
}

/** Membaca & memverifikasi token. Mengembalikan null bila tidak valid/kedaluwarsa. */
export function readSession(token: string | undefined): AdminUser | null {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload === 'string' || !payload.sub) return null;
    return {
      id: Number(payload.sub),
      username: String((payload as jwt.JwtPayload).username ?? ''),
    };
  } catch {
    return null;
  }
}

/** Mengganti password admin (dipakai dari halaman admin). */
export async function changePassword(
  adminId: number,
  currentPassword: string,
  newPassword: string,
): Promise<boolean> {
  const row = await queryOne<AdminRow>(
    'SELECT id, username, password_hash FROM admins WHERE id = ?',
    [adminId],
  );
  if (!row) return false;

  const ok = await bcrypt.compare(currentPassword, row.password_hash);
  if (!ok) return false;

  const hash = await bcrypt.hash(newPassword, 12);
  await execute('UPDATE admins SET password_hash = ? WHERE id = ?', [hash, adminId]);
  return true;
}
