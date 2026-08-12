import type { JSX } from 'react';

/** Placeholder satu kartu paket selama data dimuat dari API. */
export function PackageCardSkeleton(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse flex-col overflow-hidden rounded-xl border border-line bg-surface motion-reduce:animate-none"
    >
      <div className="aspect-16/10 w-full bg-line" />
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="h-4 w-4/5 rounded bg-line" />
        <div className="h-3 w-full rounded bg-line/70" />
        <div className="h-3 w-11/12 rounded bg-line/70" />
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-line" />
            <div className="h-3 w-20 rounded bg-line/70" />
          </div>
          <div className="h-11 w-28 rounded-full bg-line" />
        </div>
      </div>
    </div>
  );
}

/**
 * Barisan skeleton dengan grid yang sama seperti PackageGrid, sehingga
 * tinggi halaman tidak melompat saat data selesai dimuat.
 */
export function PackageGridSkeleton({ count = 3 }: { count?: number }): JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <span className="sr-only">Memuat paket…</span>
      {Array.from({ length: count }).map((_, i) => (
        <PackageCardSkeleton key={i} />
      ))}
    </div>
  );
}
