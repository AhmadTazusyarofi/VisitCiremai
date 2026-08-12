import { Router } from 'express';
import { z } from 'zod';
import { HttpError } from '../../middleware/error.js';
import { parse } from '../../middleware/validate.js';
import {
  createPackage,
  deletePackage,
  getPackageForAdmin,
  listAllPackages,
  packageExists,
  updatePackage,
} from '../../services/packages.js';
import { CATEGORIES } from '../../types.js';

const slugSchema = z
  .string()
  .trim()
  .min(3, 'Slug minimal 3 karakter.')
  .max(120, 'Slug terlalu panjang.')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug hanya boleh huruf kecil, angka, dan tanda hubung.',
  );

const bodySchema = z.object({
  title: z.string().trim().min(3, 'Judul minimal 3 karakter.').max(200),
  category: z.enum(CATEGORIES, { message: 'Kategori tidak dikenal.' }),
  // nullish: klien yang mengirim balik hasil GET boleh memakai null untuk
  // paket tanpa lokasi, sama artinya dengan tidak mengirim field ini.
  location: z
    .string()
    .trim()
    .max(120)
    .nullish()
    .transform((v) => v || undefined),
  price: z.coerce
    .number()
    .int('Harga harus bilangan bulat.')
    .min(0, 'Harga tidak boleh negatif.'),
  priceUnit: z.string().trim().min(1, 'Satuan harga wajib diisi.').max(30),
  duration: z.string().trim().min(1, 'Durasi wajib diisi.').max(60),
  image: z.string().trim().min(1, 'Gambar utama wajib diisi.').max(255),
  description: z.string().trim().min(10, 'Deskripsi minimal 10 karakter.'),
  isPublished: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  includes: z.array(z.string().trim().min(1).max(160)).max(60).default([]),
  gallery: z.array(z.string().trim().min(1).max(255)).max(20).default([]),
  notes: z.array(z.string().trim().min(1).max(300)).max(20).default([]),
});

const createSchema = bodySchema.extend({ id: slugSchema });

export const adminPackagesRouter = Router();

// GET /api/admin/packages — termasuk yang belum diterbitkan
adminPackagesRouter.get('/', async (_req, res) => {
  res.json({ data: await listAllPackages() });
});

// GET /api/admin/packages/:id
adminPackagesRouter.get('/:id', async (req, res) => {
  const data = await getPackageForAdmin(req.params.id);
  if (!data) throw new HttpError(404, 'Paket tidak ditemukan.');
  res.json({ data });
});

// POST /api/admin/packages
adminPackagesRouter.post('/', async (req, res) => {
  const input = parse(createSchema, req.body);

  if (await packageExists(input.id)) {
    throw new HttpError(409, 'Slug sudah dipakai paket lain.', {
      id: 'Slug sudah dipakai paket lain.',
    });
  }

  await createPackage(input);
  res.status(201).json({ data: { id: input.id } });
});

// PUT /api/admin/packages/:id
adminPackagesRouter.put('/:id', async (req, res) => {
  const id = parse(slugSchema, req.params.id);
  const input = parse(bodySchema, req.body);

  if (!(await packageExists(id))) throw new HttpError(404, 'Paket tidak ditemukan.');

  await updatePackage({ ...input, id });
  res.json({ data: { id } });
});

// DELETE /api/admin/packages/:id
adminPackagesRouter.delete('/:id', async (req, res) => {
  const ok = await deletePackage(req.params.id);
  if (!ok) throw new HttpError(404, 'Paket tidak ditemukan.');
  res.json({ data: { id: req.params.id } });
});
