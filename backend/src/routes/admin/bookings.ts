import { Router } from 'express';
import { z } from 'zod';
import { HttpError } from '../../middleware/error.js';
import { parse } from '../../middleware/validate.js';
import {
  countBookingsByStatus,
  listBookings,
  updateBookingStatus,
} from '../../services/bookings.js';
import { BOOKING_STATUSES } from '../../types.js';

const listQuerySchema = z.object({
  status: z.enum(BOOKING_STATUSES).optional(),
});

const patchSchema = z.object({
  status: z.enum(BOOKING_STATUSES),
});

const idSchema = z.coerce.number().int().positive();

export const adminBookingsRouter = Router();

// GET /api/admin/bookings?status=
adminBookingsRouter.get('/', async (req, res) => {
  const { status } = parse(listQuerySchema, req.query);
  const [items, counts] = await Promise.all([
    listBookings(status),
    countBookingsByStatus(),
  ]);
  res.json({ data: { items, counts } });
});

// PATCH /api/admin/bookings/:id
adminBookingsRouter.patch('/:id', async (req, res) => {
  const id = parse(idSchema, req.params.id);
  const { status } = parse(patchSchema, req.body);

  const ok = await updateBookingStatus(id, status);
  if (!ok) throw new HttpError(404, 'Pemesanan tidak ditemukan.');

  res.json({ data: { id, status } });
});
