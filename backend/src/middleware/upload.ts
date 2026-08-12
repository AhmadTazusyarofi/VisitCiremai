import { randomBytes } from 'node:crypto';
import path from 'node:path';
import multer from 'multer';
import { uploadsDir } from '../env.js';
import { HttpError } from './error.js';

const ALLOWED = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

const MAX_BYTES = 3 * 1024 * 1024; // 3 MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    // Nama file diacak: nama asli dari klien tidak pernah dipercaya, sehingga
    // tidak ada risiko path traversal atau ekstensi menyesatkan.
    const ext = ALLOWED.get(file.mimetype) ?? '.bin';
    cb(null, `${Date.now()}-${randomBytes(6).toString('hex')}${ext}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      cb(new HttpError(400, 'Format gambar harus JPG, PNG, atau WEBP.'));
      return;
    }
    cb(null, true);
  },
}).single('file');

/** URL publik untuk file yang sudah tersimpan. */
export function uploadedFileUrl(filename: string): string {
  return `/uploads/${path.basename(filename)}`;
}

export { MAX_BYTES as MAX_UPLOAD_BYTES };
