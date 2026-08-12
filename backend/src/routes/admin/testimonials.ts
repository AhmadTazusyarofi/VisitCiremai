import { Router } from 'express';
import { z } from 'zod';
import { HttpError } from '../../middleware/error.js';
import { parse } from '../../middleware/validate.js';
import {
  countTestimonialsByStatus,
  deleteTestimonial,
  listTestimonials,
  updateTestimonialStatus,
} from '../../services/testimonials.js';
import { TESTIMONIAL_STATUSES } from '../../types.js';

const listQuerySchema = z.object({
  status: z.enum(TESTIMONIAL_STATUSES).optional(),
});

const patchSchema = z.object({
  status: z.enum(TESTIMONIAL_STATUSES),
});

const idSchema = z.coerce.number().int().positive();

export const adminTestimonialsRouter = Router();

// GET /api/admin/testimonials?status=
adminTestimonialsRouter.get('/', async (req, res) => {
  const { status } = parse(listQuerySchema, req.query);
  const [items, counts] = await Promise.all([
    listTestimonials(status),
    countTestimonialsByStatus(),
  ]);
  res.json({ data: { items, counts } });
});

// PATCH /api/admin/testimonials/:id — approve / reject
adminTestimonialsRouter.patch('/:id', async (req, res) => {
  const id = parse(idSchema, req.params.id);
  const { status } = parse(patchSchema, req.body);

  const ok = await updateTestimonialStatus(id, status);
  if (!ok) throw new HttpError(404, 'Testimoni tidak ditemukan.');

  res.json({ data: { id, status } });
});

// DELETE /api/admin/testimonials/:id
adminTestimonialsRouter.delete('/:id', async (req, res) => {
  const id = parse(idSchema, req.params.id);

  const ok = await deleteTestimonial(id);
  if (!ok) throw new HttpError(404, 'Testimoni tidak ditemukan.');

  res.json({ data: { id } });
});
