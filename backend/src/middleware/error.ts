import type { NextFunction, Request, Response } from 'express';
import { isProduction } from '../env.js';

/** Error yang sengaja dilempar route dan aman ditampilkan ke klien. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    /** Pesan error per-field, dipakai form di frontend. */
    readonly fields?: Record<string, string>,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/** Route yang tidak dikenal. */
export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    error: { message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.` },
  });
}

/**
 * Handler error terpusat. Semua respons error memakai bentuk yang sama:
 *   { error: { message: string, fields?: Record<string, string> } }
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: { message: err.message, ...(err.fields ? { fields: err.fields } : {}) },
    });
    return;
  }

  // Error tak terduga: catat lengkap di server, balas seadanya ke klien.
  console.error('[error]', err);
  res.status(500).json({
    error: {
      message: isProduction
        ? 'Terjadi kesalahan pada server. Coba lagi beberapa saat lagi.'
        : err instanceof Error
          ? err.message
          : 'Unknown error',
    },
  });
}
