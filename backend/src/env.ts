import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Selalu baca .env milik folder backend, apa pun cwd saat proses dijalankan
// (root workspace, folder backend, atau dist setelah build).
const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, '..', '.env'), quiet: true });

const schema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().min(1),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET minimal 32 karakter'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  SEED_ADMIN_USERNAME: z.string().min(3).default('admin'),
  SEED_ADMIN_PASSWORD: z.string().min(8).default('visitciremai'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const detail = parsed.error.issues
    .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
    .join('\n');
  console.error(
    `\nKonfigurasi .env belum lengkap/valid:\n${detail}\n\n` +
      'Salin backend/.env.example menjadi backend/.env lalu isi nilainya.\n',
  );
  process.exit(1);
}

export const env = parsed.data;

/** Daftar origin yang diizinkan CORS. */
export const corsOrigins = env.CORS_ORIGIN.split(',')
  .map((o) => o.trim())
  .filter(Boolean);

export const isProduction = env.NODE_ENV === 'production';

/** Folder tujuan upload gambar admin. */
export const uploadsDir = path.resolve(here, '..', 'uploads');
