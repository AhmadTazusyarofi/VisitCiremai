import { mkdirSync } from 'node:fs';
import { createApp } from './app.js';
import { assertDbConnection, pool } from './db.js';
import { env, uploadsDir } from './env.js';

async function main(): Promise<void> {
  mkdirSync(uploadsDir, { recursive: true });

  try {
    await assertDbConnection();
  } catch (err) {
    console.error(
      '\nGagal terhubung ke MySQL.\n' +
        '  - Pastikan MySQL di XAMPP sudah berjalan.\n' +
        `  - Pastikan database "${env.DB_NAME}" sudah dibuat (import backend/db/schema.sql).\n` +
        '  - Periksa DB_USER / DB_PASSWORD di backend/.env\n',
      err,
    );
    process.exit(1);
  }

  const server = createApp().listen(env.PORT, () => {
    console.log(`API VisitCiremai siap di http://localhost:${env.PORT}`);
  });

  // Tutup koneksi dengan rapi saat proses dihentikan.
  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.on(signal, () => {
      server.close(() => {
        void pool.end().finally(() => process.exit(0));
      });
    });
  }
}

void main();
