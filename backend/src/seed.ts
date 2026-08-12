/**
 * Mengisi database dengan data awal.
 *
 *   npm run seed --workspace backend
 *
 * Aman dijalankan berulang: paket di-upsert berdasarkan id, daftar
 * includes/gallery ditulis ulang, dan akun admin hanya dibuat bila belum ada.
 */
import bcrypt from 'bcryptjs';
import { pool, queryOne, transaction } from './db.js';
import { env } from './env.js';
import { seedPackages } from './seed-data.js';

async function seed(): Promise<void> {
  await transaction(async (conn) => {
    let order = 0;

    for (const pkg of seedPackages) {
      order += 10;

      await conn.execute(
        `INSERT INTO packages
           (id, title, category, location, price, price_unit, duration, image, description, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           category = VALUES(category),
           location = VALUES(location),
           price = VALUES(price),
           price_unit = VALUES(price_unit),
           duration = VALUES(duration),
           image = VALUES(image),
           description = VALUES(description),
           sort_order = VALUES(sort_order)`,
        [
          pkg.id,
          pkg.title,
          pkg.category,
          pkg.location ?? null,
          pkg.price,
          pkg.priceUnit,
          pkg.duration,
          pkg.image,
          pkg.description,
          order,
        ],
      );

      // Tulis ulang daftar turunan agar hasil seed selalu sama persis.
      await conn.execute('DELETE FROM package_includes WHERE package_id = ?', [pkg.id]);
      await conn.execute('DELETE FROM package_gallery WHERE package_id = ?', [pkg.id]);

      for (const [i, label] of (pkg.includes ?? []).entries()) {
        await conn.execute(
          'INSERT INTO package_includes (package_id, label, sort_order) VALUES (?, ?, ?)',
          [pkg.id, label, i * 10],
        );
      }

      for (const [i, image] of (pkg.gallery ?? []).entries()) {
        await conn.execute(
          'INSERT INTO package_gallery (package_id, image, sort_order) VALUES (?, ?, ?)',
          [pkg.id, image, i * 10],
        );
      }
    }
  });

  console.log(`✓ ${seedPackages.length} paket tersimpan.`);

  // --- Akun admin ---
  const existing = await queryOne<{ id: number }>(
    'SELECT id FROM admins WHERE username = ?',
    [env.SEED_ADMIN_USERNAME],
  );

  if (existing) {
    console.log(`• Akun admin "${env.SEED_ADMIN_USERNAME}" sudah ada, dilewati.`);
  } else {
    const hash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 12);
    await pool.execute('INSERT INTO admins (username, password_hash) VALUES (?, ?)', [
      env.SEED_ADMIN_USERNAME,
      hash,
    ]);
    console.log(`✓ Akun admin "${env.SEED_ADMIN_USERNAME}" dibuat.`);
    console.log('  Ganti SEED_ADMIN_PASSWORD di .env setelah login pertama.');
  }
}

seed()
  .then(() => pool.end())
  .then(() => {
    console.log('\nSeeding selesai.');
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('\nSeeding gagal:', err);
    await pool.end().catch(() => {});
    process.exit(1);
  });
