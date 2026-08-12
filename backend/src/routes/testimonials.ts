import { Router } from 'express';
import { z } from 'zod';
import { writeLimiter } from '../middleware/rateLimit.js';
import { parse } from '../middleware/validate.js';
import {
  createTestimonial,
  listApprovedTestimonials,
} from '../services/testimonials.js';

const testimonialSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nama minimal 2 karakter.')
    .max(120, 'Nama terlalu panjang.'),
  trip: z.string().trim().max(160, 'Nama paket terlalu panjang.').optional(),
  rating: z.coerce
    .number()
    .int()
    .min(1, 'Rating minimal 1 bintang.')
    .max(5, 'Rating maksimal 5 bintang.'),
  quote: z
    .string()
    .trim()
    .min(10, 'Ceritakan pengalamanmu minimal 10 karakter.')
    .max(1000, 'Pesan terlalu panjang.'),
});

export const testimonialsRouter = Router();

// GET /api/testimonials — hanya yang sudah disetujui
testimonialsRouter.get('/', async (_req, res) => {
  const data = await listApprovedTestimonials();
  res.json({ data });
});

// POST /api/testimonials — masuk antrean moderasi
testimonialsRouter.post(
  '/',
  writeLimiter(10, 'Terlalu banyak kiriman testimoni. Coba lagi nanti.'),
  async (req, res) => {
    const data = parse(testimonialSchema, req.body);
    const id = await createTestimonial({
      ...data,
      trip: data.trip || 'Pengunjung',
    });
    res.status(201).json({ data: { id, status: 'pending' } });
  },
);
