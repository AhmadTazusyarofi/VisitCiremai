import type { z } from 'zod';
import { HttpError } from './error.js';

/**
 * Memvalidasi data dengan skema zod. Bila gagal, melempar HttpError 400
 * berisi pesan per-field supaya frontend bisa menampilkannya tepat di
 * bawah input yang bermasalah.
 *
 * Dipanggil langsung di dalam route (bukan sebagai middleware) karena di
 * Express 5 `req.query` bersifat read-only sehingga hasil validasi tidak
 * bisa ditulis balik ke object request.
 */
export function parse<S extends z.ZodType>(schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;

  const fields: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join('.') || '_';
    fields[key] ??= issue.message;
  }

  throw new HttpError(400, 'Data yang dikirim belum valid.', fields);
}
