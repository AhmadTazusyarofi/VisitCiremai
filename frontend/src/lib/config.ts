/**
 * Satu-satunya tempat konfigurasi situs dibaca.
 *
 * Semua nilai berasal dari `frontend/.env` (lihat `.env.example`), sehingga
 * mengganti domain, nomor WhatsApp, atau alamat API cukup dilakukan di satu
 * berkas tanpa menyentuh kode.
 *
 * Catatan: variabel VITE_* ikut ter-bundle ke browser, jadi berkas ini hanya
 * boleh memuat data publik. Rahasia tetap di backend/.env.
 */
const env = import.meta.env;

/**
 * Membaca variabel wajib. Ketiadaannya sudah dicegah lebih awal oleh
 * pemeriksaan di vite.config.ts saat dev/build; pengecekan di sini menjaga
 * agar nilai kosong tidak diam-diam menghasilkan tautan rusak.
 */
function required(key: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `${key} belum diset. Salin frontend/.env.example menjadi frontend/.env lalu isi nilainya.`,
    );
  }
  return value;
}

/** Alamat API. '/api' berarti satu origin dengan situs (lewat proxy). */
export const API_URL = env.VITE_API_URL ?? '/api';

export const SITE_NAME = required('VITE_SITE_NAME', env.VITE_SITE_NAME);
export const SITE_URL = required('VITE_SITE_URL', env.VITE_SITE_URL).replace(/\/+$/, '');
export const SITE_OG_IMAGE = required('VITE_OG_IMAGE', env.VITE_OG_IMAGE);

export const WHATSAPP_NUMBER = required(
  'VITE_WHATSAPP_NUMBER',
  env.VITE_WHATSAPP_NUMBER,
);
export const CONTACT_PHONE = required('VITE_CONTACT_PHONE', env.VITE_CONTACT_PHONE);
export const CONTACT_EMAIL = required('VITE_CONTACT_EMAIL', env.VITE_CONTACT_EMAIL);
export const CONTACT_ADDRESS = required(
  'VITE_CONTACT_ADDRESS',
  env.VITE_CONTACT_ADDRESS,
);

export const MAP_QUERY = required('VITE_MAP_QUERY', env.VITE_MAP_QUERY);

/** Nomor telepon dalam bentuk yang bisa dipakai pada tautan `tel:`. */
export const CONTACT_PHONE_HREF = `tel:+${WHATSAPP_NUMBER}`;
