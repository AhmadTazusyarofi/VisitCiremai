import rateLimit from 'express-rate-limit';

/**
 * Pembatas untuk endpoint yang menulis data dari publik (booking, testimoni,
 * login) agar tidak dibanjiri kiriman otomatis.
 */
export function writeLimiter(limit: number, message: string) {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({ error: { message } });
    },
  });
}
