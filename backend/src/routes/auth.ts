import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';
import { writeLimiter } from '../middleware/rateLimit.js';
import { parse } from '../middleware/validate.js';
import {
  changePassword,
  clearSessionCookie,
  setSessionCookie,
  verifyCredentials,
} from '../services/auth.js';

const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username wajib diisi.').max(60),
  password: z.string().min(1, 'Password wajib diisi.').max(200),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Password saat ini wajib diisi.'),
  newPassword: z
    .string()
    .min(8, 'Password baru minimal 8 karakter.')
    .max(200, 'Password terlalu panjang.'),
});

export const authRouter = Router();

// POST /api/auth/login
authRouter.post(
  '/login',
  writeLimiter(10, 'Terlalu banyak percobaan masuk. Coba lagi dalam 15 menit.'),
  async (req, res) => {
    const { username, password } = parse(loginSchema, req.body);

    const admin = await verifyCredentials(username, password);
    if (!admin) {
      // Pesan sengaja tidak menyebut field mana yang salah.
      throw new HttpError(401, 'Username atau password salah.');
    }

    setSessionCookie(res, admin);
    res.json({ data: admin });
  },
);

// POST /api/auth/logout
authRouter.post('/logout', (_req, res) => {
  clearSessionCookie(res);
  res.json({ data: { ok: true } });
});

// GET /api/auth/me — dipakai frontend untuk memulihkan sesi saat refresh
authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ data: req.admin });
});

// POST /api/auth/password
authRouter.post('/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = parse(passwordSchema, req.body);
  const admin = req.admin;
  if (!admin) throw new HttpError(401, 'Sesi tidak valid.');

  const ok = await changePassword(admin.id, currentPassword, newPassword);
  if (!ok) {
    throw new HttpError(400, 'Password saat ini salah.', {
      currentPassword: 'Password saat ini salah.',
    });
  }

  res.json({ data: { ok: true } });
});
