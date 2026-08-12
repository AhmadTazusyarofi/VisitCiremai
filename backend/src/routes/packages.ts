import { Router } from 'express';
import { z } from 'zod';
import { HttpError } from '../middleware/error.js';
import { parse } from '../middleware/validate.js';
import { getPackage, listPackages } from '../services/packages.js';

const listQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  kategori: z.string().trim().max(60).optional(),
});

export const packagesRouter = Router();

// GET /api/packages?q=&kategori=
packagesRouter.get('/', async (req, res) => {
  const { q, kategori } = parse(listQuerySchema, req.query);
  const data = await listPackages({ q, kategori });
  res.json({ data });
});

// GET /api/packages/:id
packagesRouter.get('/:id', async (req, res) => {
  const data = await getPackage(req.params.id);
  if (!data) throw new HttpError(404, 'Paket tidak ditemukan.');
  res.json({ data });
});
