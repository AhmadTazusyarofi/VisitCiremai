import { useCallback, useEffect, useState } from 'react';
import { apiGet } from '../lib/api';

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** Muat ulang dari server (dipakai tombol "Coba lagi" & setelah aksi admin). */
  reload: () => void;
};

/**
 * Mengambil satu sumber daya dari API. Permintaan dibatalkan saat komponen
 * dilepas atau path berubah, sehingga respons basi tidak menimpa yang baru.
 *
 * `path` boleh null untuk menunda permintaan.
 */
export function useApiResource<T>(path: string | null): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(path !== null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (path === null) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    apiGet<T>(path, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setData(result);
        setLoading(false);
      })
      .catch((err: unknown) => {
        // Pembatalan (unmount / ganti query) bukan kesalahan yang perlu tampil.
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
        setLoading(false);
      });

    return () => controller.abort();
  }, [path, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { data, loading, error, reload };
}
