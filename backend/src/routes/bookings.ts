import { Router } from 'express';
import { z } from 'zod';
import { HttpError } from '../middleware/error.js';
import { writeLimiter } from '../middleware/rateLimit.js';
import { parse } from '../middleware/validate.js';
import { createBooking } from '../services/bookings.js';
import { getPackageSummary } from '../services/packages.js';

/** Tanggal hari ini 'YYYY-MM-DD' menurut waktu server. */
function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const bookingSchema = z.object({
  packageId: z.string().trim().min(1).max(120),
  name: z
    .string()
    .trim()
    .min(2, 'Nama minimal 2 karakter.')
    .max(120, 'Nama terlalu panjang.'),
  phone: z
    .string()
    .trim()
    .min(8, 'Nomor HP minimal 8 digit.')
    .max(40, 'Nomor HP terlalu panjang.')
    .regex(/^[0-9+()\-\s]+$/, 'Nomor HP hanya boleh berisi angka dan tanda + ( ) -.'),
  people: z.coerce
    .number()
    .int('Jumlah orang harus bilangan bulat.')
    .min(1, 'Jumlah orang minimal 1.')
    .max(100, 'Untuk rombongan di atas 100 orang, hubungi kami langsung.'),
  tripDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid.')
    .refine((d) => d >= todayISO(), 'Tanggal perjalanan tidak boleh di masa lalu.'),
  notes: z.string().trim().max(1000, 'Catatan terlalu panjang.').optional(),
});

export const bookingsRouter = Router();

// POST /api/bookings
bookingsRouter.post(
  '/',
  writeLimiter(20, 'Terlalu banyak pemesanan dari perangkat ini. Coba lagi nanti.'),
  async (req, res) => {
    const data = parse(bookingSchema, req.body);

    const pkg = await getPackageSummary(data.packageId);
    if (!pkg) {
      throw new HttpError(404, 'Paket yang dipesan tidak ditemukan.', {
        packageId: 'Paket tidak tersedia.',
      });
    }

    const id = await createBooking(data, { title: pkg.title, price: Number(pkg.price) });
    res.status(201).json({ data: { id } });
  },
);
