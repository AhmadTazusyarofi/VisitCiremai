import { execute, query, type SqlParam } from '../db.js';
import type { BookingStatus } from '../types.js';

export type NewBooking = {
  packageId: string;
  name: string;
  phone: string;
  people: number;
  tripDate: string; // 'YYYY-MM-DD'
  notes?: string;
};

/**
 * Menyimpan pesanan baru. Judul & harga paket ikut disalin ke baris booking
 * (snapshot) supaya riwayat pesanan tetap akurat bila paketnya nanti
 * diubah harganya atau dihapus.
 */
export async function createBooking(
  data: NewBooking,
  snapshot: { title: string; price: number },
): Promise<number> {
  const { insertId } = await execute(
    `INSERT INTO bookings
       (package_id, package_title, package_price, name, phone, people, trip_date, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.packageId,
      snapshot.title,
      snapshot.price,
      data.name,
      data.phone,
      data.people,
      data.tripDate,
      data.notes ?? null,
    ],
  );
  return insertId;
}

// --- Admin ---

export type BookingRow = {
  id: number;
  package_id: string | null;
  package_title: string;
  package_price: number;
  name: string;
  phone: string;
  people: number;
  trip_date: string;
  notes: string | null;
  status: BookingStatus;
  created_at: Date;
};

/** Daftar pemesanan untuk halaman admin, terbaru di atas. */
export async function listBookings(status?: BookingStatus): Promise<BookingRow[]> {
  const params: SqlParam[] = [];
  let where = '';
  if (status) {
    where = 'WHERE status = ?';
    params.push(status);
  }

  return query<BookingRow>(
    `SELECT id, package_id, package_title, package_price, name, phone,
            people, trip_date, notes, status, created_at
       FROM bookings ${where}
      ORDER BY created_at DESC, id DESC`,
    params,
  );
}

export async function updateBookingStatus(
  id: number,
  status: BookingStatus,
): Promise<boolean> {
  const { affectedRows } = await execute(
    'UPDATE bookings SET status = ? WHERE id = ?',
    [status, id],
  );
  return affectedRows > 0;
}

/** Jumlah pesanan per status — dipakai untuk lencana di dashboard. */
export async function countBookingsByStatus(): Promise<Record<string, number>> {
  const rows = await query<{ status: BookingStatus; total: number }>(
    'SELECT status, COUNT(*) AS total FROM bookings GROUP BY status',
  );
  return Object.fromEntries(rows.map((r) => [r.status, Number(r.total)]));
}
