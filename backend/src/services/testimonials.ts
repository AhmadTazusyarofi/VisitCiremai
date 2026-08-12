import { execute, query, type SqlParam } from '../db.js';
import type { TestimonialDto, TestimonialStatus } from '../types.js';

/** Hanya testimoni yang sudah disetujui admin yang tampil di situs. */
export async function listApprovedTestimonials(): Promise<TestimonialDto[]> {
  const rows = await query<TestimonialDto>(
    `SELECT id, name, trip, rating, quote
       FROM testimonials
      WHERE status = 'approved'
      ORDER BY created_at DESC`,
  );
  return rows.map((r) => ({ ...r, rating: Number(r.rating) }));
}

export type NewTestimonial = {
  name: string;
  trip: string;
  rating: number;
  quote: string;
};

/** Testimoni baru selalu masuk sebagai 'pending' (default kolom status). */
export async function createTestimonial(data: NewTestimonial): Promise<number> {
  const { insertId } = await execute(
    'INSERT INTO testimonials (name, trip, rating, quote) VALUES (?, ?, ?, ?)',
    [data.name, data.trip, data.rating, data.quote],
  );
  return insertId;
}

// --- Admin ---

export type TestimonialRow = TestimonialDto & {
  status: TestimonialStatus;
  created_at: Date;
};

/** Semua testimoni (opsional difilter status) untuk halaman moderasi. */
export async function listTestimonials(
  status?: TestimonialStatus,
): Promise<TestimonialRow[]> {
  const params: SqlParam[] = [];
  let where = '';
  if (status) {
    where = 'WHERE status = ?';
    params.push(status);
  }

  const rows = await query<TestimonialRow>(
    `SELECT id, name, trip, rating, quote, status, created_at
       FROM testimonials ${where}
      ORDER BY created_at DESC, id DESC`,
    params,
  );
  return rows.map((r) => ({ ...r, rating: Number(r.rating) }));
}

export async function updateTestimonialStatus(
  id: number,
  status: TestimonialStatus,
): Promise<boolean> {
  const { affectedRows } = await execute(
    'UPDATE testimonials SET status = ? WHERE id = ?',
    [status, id],
  );
  return affectedRows > 0;
}

export async function deleteTestimonial(id: number): Promise<boolean> {
  const { affectedRows } = await execute('DELETE FROM testimonials WHERE id = ?', [id]);
  return affectedRows > 0;
}

/** Jumlah testimoni per status — untuk lencana "menunggu moderasi". */
export async function countTestimonialsByStatus(): Promise<Record<string, number>> {
  const rows = await query<{ status: TestimonialStatus; total: number }>(
    'SELECT status, COUNT(*) AS total FROM testimonials GROUP BY status',
  );
  return Object.fromEntries(rows.map((r) => [r.status, Number(r.total)]));
}
