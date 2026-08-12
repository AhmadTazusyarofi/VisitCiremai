import type { JSX } from 'react';

/** Ditampilkan saat bundle halaman (React.lazy) masih diunduh. */
export function PageLoader(): JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center bg-bg"
    >
      <span
        aria-hidden="true"
        className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-primary motion-reduce:animate-none"
      />
      <span className="sr-only">Memuat halaman…</span>
    </div>
  );
}
