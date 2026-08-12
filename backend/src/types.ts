/** Bentuk paket yang dikirim ke frontend (camelCase, cocok dengan types/package.ts). */
export type PackageDto = {
  id: string;
  title: string;
  category: string;
  location?: string;
  price: number;
  priceUnit: string;
  duration: string;
  image: string;
  description: string;
  includes?: string[];
  gallery?: string[];
  notes?: string[];
};

/** Butir catatan bawaan untuk paket baru — aturan bisnis yang berlaku umum. */
export const DEFAULT_PACKAGE_NOTES = [
  'Itinerary lengkap akan dibagikan sesuai kebutuhan operasional perjalanan.',
  'Tim kami terbuka untuk pertanyaan seputar paket ini.',
  'Harga dapat menyesuaikan sesuai permintaan dan jumlah peserta.',
];

/** Baris tabel `packages` apa adanya (snake_case). */
export type PackageRow = {
  id: string;
  title: string;
  category: string;
  location: string | null;
  price: number;
  price_unit: string;
  duration: string;
  image: string;
  description: string;
  is_published: number;
  sort_order: number;
};

export type TestimonialDto = {
  id: number;
  name: string;
  trip: string;
  rating: number;
  quote: string;
};

export const BOOKING_STATUSES = [
  'baru',
  'dikonfirmasi',
  'selesai',
  'batal',
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const TESTIMONIAL_STATUSES = ['pending', 'approved', 'rejected'] as const;
export type TestimonialStatus = (typeof TESTIMONIAL_STATUSES)[number];

/** Kategori layanan — harus sama dengan union `Category` di frontend. */
export const CATEGORIES = [
  'Pendakian Gunung Hutan',
  'Petualangan Lainnya',
  'Akomodasi',
  'Transportasi',
  'Sewa Alat',
] as const;
