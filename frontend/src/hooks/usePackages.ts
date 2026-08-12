import { useApiResource, type AsyncState } from './useApiResource';
import type { Package } from '../types/package';

/** Daftar paket. Filter dikerjakan di server lewat query string. */
export function usePackages(
  params: { q?: string; kategori?: string } = {},
): AsyncState<Package[]> {
  const { q = '', kategori = '' } = params;

  const search = new URLSearchParams();
  if (q) search.set('q', q);
  if (kategori) search.set('kategori', kategori);
  const suffix = search.toString();

  return useApiResource<Package[]>(`/packages${suffix ? `?${suffix}` : ''}`);
}

/** Detail satu paket beserta includes & gallery. */
export function usePackage(id: string | undefined): AsyncState<Package> {
  return useApiResource<Package>(id ? `/packages/${encodeURIComponent(id)}` : null);
}
