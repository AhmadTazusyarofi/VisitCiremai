import { Router } from 'express';
import multer from 'multer';
import { HttpError } from '../../middleware/error.js';
import { MAX_UPLOAD_BYTES, uploadImage, uploadedFileUrl } from '../../middleware/upload.js';

export const adminUploadsRouter = Router();

// POST /api/admin/uploads — field "file"
adminUploadsRouter.post('/', (req, res, next) => {
  uploadImage(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? `Ukuran gambar maksimal ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB.`
          : 'Gagal mengunggah gambar.';
      next(new HttpError(400, message));
      return;
    }
    if (err) {
      next(err);
      return;
    }
    if (!req.file) {
      next(new HttpError(400, 'Tidak ada berkas yang diunggah.'));
      return;
    }

    res.status(201).json({ data: { url: uploadedFileUrl(req.file.filename) } });
  });
});
