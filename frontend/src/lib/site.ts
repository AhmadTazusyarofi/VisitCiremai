import { SITE_URL } from './config';

export { SITE_NAME, SITE_URL, SITE_OG_IMAGE } from './config';

/** Ubah path relatif menjadi URL absolut (dibutuhkan oleh Open Graph). */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
