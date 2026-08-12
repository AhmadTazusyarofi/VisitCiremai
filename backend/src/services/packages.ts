import { execute, query, queryOne, transaction, type SqlParam } from '../db.js';
import type { PackageDto, PackageRow } from '../types.js';

const BASE_COLUMNS = `
  id, title, category, location, price, price_unit, duration,
  image, description, is_published, sort_order
`;

function toDto(row: PackageRow): PackageDto {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    ...(row.location ? { location: row.location } : {}),
    price: Number(row.price),
    priceUnit: row.price_unit,
    duration: row.duration,
    image: row.image,
    description: row.description,
  };
}

/**
 * Daftar paket terbit. Pencarian dilakukan di SQL (bukan di klien) supaya
 * frontend tidak perlu mengunduh seluruh katalog untuk memfilternya.
 */
export async function listPackages(opts: {
  q?: string;
  kategori?: string;
}): Promise<PackageDto[]> {
  const where: string[] = ['is_published = 1'];
  const params: SqlParam[] = [];

  const q = opts.q?.trim();
  if (q) {
    where.push(
      '(title LIKE ? OR description LIKE ? OR location LIKE ? OR category LIKE ?)',
    );
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }

  const kategori = opts.kategori?.trim();
  if (kategori) {
    where.push('category = ?');
    params.push(kategori);
  }

  const rows = await query<PackageRow>(
    `SELECT ${BASE_COLUMNS} FROM packages
      WHERE ${where.join(' AND ')}
      ORDER BY sort_order ASC, created_at ASC`,
    params,
  );

  return rows.map(toDto);
}

/** Detail satu paket beserta daftar "Yang Termasuk" dan galeri fotonya. */
export async function getPackage(id: string): Promise<PackageDto | null> {
  const row = await queryOne<PackageRow>(
    `SELECT ${BASE_COLUMNS} FROM packages WHERE id = ? AND is_published = 1`,
    [id],
  );
  if (!row) return null;

  const { includes, gallery, notes } = await getChildren(id);

  const dto = toDto(row);
  if (includes.length > 0) dto.includes = includes;
  if (gallery.length > 0) dto.gallery = gallery;
  if (notes.length > 0) dto.notes = notes;
  return dto;
}

/** Daftar turunan sebuah paket: includes, galeri, dan catatan. */
async function getChildren(id: string): Promise<{
  includes: string[];
  gallery: string[];
  notes: string[];
}> {
  const [includes, gallery, notes] = await Promise.all([
    query<{ label: string }>(
      'SELECT label FROM package_includes WHERE package_id = ? ORDER BY sort_order ASC, id ASC',
      [id],
    ),
    query<{ image: string }>(
      'SELECT image FROM package_gallery WHERE package_id = ? ORDER BY sort_order ASC, id ASC',
      [id],
    ),
    query<{ label: string }>(
      'SELECT label FROM package_notes WHERE package_id = ? ORDER BY sort_order ASC, id ASC',
      [id],
    ),
  ]);

  return {
    includes: includes.map((i) => i.label),
    gallery: gallery.map((g) => g.image),
    notes: notes.map((n) => n.label),
  };
}

/** Dipakai saat membuat booking: ambil judul & harga untuk disimpan sebagai snapshot. */
export async function getPackageSummary(
  id: string,
): Promise<{ id: string; title: string; price: number } | null> {
  return queryOne<{ id: string; title: string; price: number }>(
    'SELECT id, title, price FROM packages WHERE id = ? AND is_published = 1',
    [id],
  );
}

// --- Admin ---

export type AdminPackage = PackageDto & {
  isPublished: boolean;
  sortOrder: number;
};

/** Daftar paket untuk admin — termasuk yang belum diterbitkan. */
export async function listAllPackages(): Promise<AdminPackage[]> {
  const rows = await query<PackageRow>(
    `SELECT ${BASE_COLUMNS} FROM packages ORDER BY sort_order ASC, created_at ASC`,
  );
  return rows.map((row) => ({
    ...toDto(row),
    isPublished: Boolean(row.is_published),
    sortOrder: Number(row.sort_order),
  }));
}

/** Detail untuk form edit — mengabaikan filter is_published. */
export async function getPackageForAdmin(id: string): Promise<AdminPackage | null> {
  const row = await queryOne<PackageRow>(
    `SELECT ${BASE_COLUMNS} FROM packages WHERE id = ?`,
    [id],
  );
  if (!row) return null;

  const { includes, gallery, notes } = await getChildren(id);

  return {
    ...toDto(row),
    includes,
    gallery,
    notes,
    isPublished: Boolean(row.is_published),
    sortOrder: Number(row.sort_order),
  };
}

export type PackageInput = {
  id: string;
  title: string;
  category: string;
  location?: string;
  price: number;
  priceUnit: string;
  duration: string;
  image: string;
  description: string;
  isPublished: boolean;
  sortOrder: number;
  includes: string[];
  gallery: string[];
  notes: string[];
};

/** Menulis ulang daftar includes, galeri, dan catatan milik sebuah paket. */
async function replaceChildren(
  conn: Parameters<Parameters<typeof transaction>[0]>[0],
  input: PackageInput,
): Promise<void> {
  await conn.execute('DELETE FROM package_includes WHERE package_id = ?', [input.id]);
  await conn.execute('DELETE FROM package_gallery WHERE package_id = ?', [input.id]);
  await conn.execute('DELETE FROM package_notes WHERE package_id = ?', [input.id]);

  for (const [i, label] of input.includes.entries()) {
    await conn.execute(
      'INSERT INTO package_includes (package_id, label, sort_order) VALUES (?, ?, ?)',
      [input.id, label, i * 10],
    );
  }
  for (const [i, image] of input.gallery.entries()) {
    await conn.execute(
      'INSERT INTO package_gallery (package_id, image, sort_order) VALUES (?, ?, ?)',
      [input.id, image, i * 10],
    );
  }
  for (const [i, label] of input.notes.entries()) {
    await conn.execute(
      'INSERT INTO package_notes (package_id, label, sort_order) VALUES (?, ?, ?)',
      [input.id, label, i * 10],
    );
  }
}

export async function packageExists(id: string): Promise<boolean> {
  const row = await queryOne<{ id: string }>('SELECT id FROM packages WHERE id = ?', [id]);
  return row !== null;
}

/** Paket + daftar turunannya ditulis dalam satu transaksi agar tidak setengah jadi. */
export async function createPackage(input: PackageInput): Promise<void> {
  await transaction(async (conn) => {
    await conn.execute(
      `INSERT INTO packages
         (id, title, category, location, price, price_unit, duration, image,
          description, is_published, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.id,
        input.title,
        input.category,
        input.location ?? null,
        input.price,
        input.priceUnit,
        input.duration,
        input.image,
        input.description,
        input.isPublished ? 1 : 0,
        input.sortOrder,
      ],
    );
    await replaceChildren(conn, input);
  });
}

export async function updatePackage(input: PackageInput): Promise<void> {
  await transaction(async (conn) => {
    await conn.execute(
      `UPDATE packages SET
         title = ?, category = ?, location = ?, price = ?, price_unit = ?,
         duration = ?, image = ?, description = ?, is_published = ?, sort_order = ?
       WHERE id = ?`,
      [
        input.title,
        input.category,
        input.location ?? null,
        input.price,
        input.priceUnit,
        input.duration,
        input.image,
        input.description,
        input.isPublished ? 1 : 0,
        input.sortOrder,
        input.id,
      ],
    );
    await replaceChildren(conn, input);
  });
}

export async function deletePackage(id: string): Promise<boolean> {
  // includes & gallery ikut terhapus lewat ON DELETE CASCADE;
  // bookings.package_id menjadi NULL (ON DELETE SET NULL) sehingga
  // riwayat pesanan tetap tersimpan dengan snapshot judul & harganya.
  const { affectedRows } = await execute('DELETE FROM packages WHERE id = ?', [id]);
  return affectedRows > 0;
}
