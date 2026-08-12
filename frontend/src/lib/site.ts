/** Identitas situs untuk metadata (Open Graph, canonical, dsb). */
export const SITE_NAME = 'VisitCiremai';

/**
 * Domain produksi. Ganti bila domain berubah — nilai ini dipakai untuk
 * membentuk URL absolut pada tag Open Graph & canonical.
 */
export const SITE_URL = 'https://visitciremai.com';

/** Gambar default saat halaman dibagikan ke WhatsApp / Facebook / X. */
export const SITE_OG_IMAGE = '/img/hero.png';

/** Ubah path relatif menjadi URL absolut (dibutuhkan oleh Open Graph). */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
