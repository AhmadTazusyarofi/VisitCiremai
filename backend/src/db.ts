import mysql from 'mysql2/promise';
import { env } from './env.js';

/**
 * Connection pool dipakai (bukan koneksi tunggal) supaya request paralel
 * tidak saling mengantre dan koneksi yang putus otomatis diganti.
 */
export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4_unicode_ci',
  dateStrings: ['DATE'], // trip_date tetap 'YYYY-MM-DD', bukan objek Date bergeser timezone
});

/** Nilai yang boleh dikirim sebagai parameter prepared statement. */
export type SqlParam = string | number | boolean | Date | null;

/** Query SELECT — selalu prepared statement, jadi aman dari SQL injection. */
export async function query<T>(sql: string, params: SqlParam[] = []): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

/** Ambil satu baris, atau null bila tidak ada. */
export async function queryOne<T>(
  sql: string,
  params: SqlParam[] = [],
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

/** INSERT/UPDATE/DELETE. Mengembalikan insertId & affectedRows. */
export async function execute(
  sql: string,
  params: SqlParam[] = [],
): Promise<{ insertId: number; affectedRows: number }> {
  const [result] = await pool.execute(sql, params);
  const r = result as mysql.ResultSetHeader;
  return { insertId: r.insertId, affectedRows: r.affectedRows };
}

/**
 * Menjalankan beberapa query dalam satu transaksi. Otomatis rollback
 * bila callback melempar error.
 */
export async function transaction<T>(
  fn: (conn: mysql.PoolConnection) => Promise<T>,
): Promise<T> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

/** Dipanggil saat start-up agar kegagalan koneksi ketahuan sejak awal. */
export async function assertDbConnection(): Promise<void> {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }
}
