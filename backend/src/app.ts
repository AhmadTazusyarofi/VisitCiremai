import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOrigins, uploadsDir } from './env.js';
import { requireAuth } from './middleware/auth.js';
import { errorHandler, notFound } from './middleware/error.js';
import { authRouter } from './routes/auth.js';
import { bookingsRouter } from './routes/bookings.js';
import { packagesRouter } from './routes/packages.js';
import { testimonialsRouter } from './routes/testimonials.js';
import { adminBookingsRouter } from './routes/admin/bookings.js';
import { adminPackagesRouter } from './routes/admin/packages.js';
import { adminTestimonialsRouter } from './routes/admin/testimonials.js';
import { adminUploadsRouter } from './routes/admin/uploads.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: corsOrigins, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  // Foto yang diunggah lewat halaman admin.
  app.use('/uploads', express.static(uploadsDir, { maxAge: '7d', index: false }));

  app.get('/api/health', (_req, res) => {
    res.json({ data: { status: 'ok' } });
  });

  // --- Publik ---
  app.use('/api/packages', packagesRouter);
  app.use('/api/bookings', bookingsRouter);
  app.use('/api/testimonials', testimonialsRouter);
  app.use('/api/auth', authRouter);

  // --- Admin: seluruh cabang ini dilindungi cookie sesi ---
  app.use('/api/admin', requireAuth);
  app.use('/api/admin/bookings', adminBookingsRouter);
  app.use('/api/admin/testimonials', adminTestimonialsRouter);
  app.use('/api/admin/packages', adminPackagesRouter);
  app.use('/api/admin/uploads', adminUploadsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
