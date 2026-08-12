import type { JSX } from 'react';
import { RotateCw, WifiOff } from 'lucide-react';
import { Button } from './Button';

/** Ditampilkan saat permintaan ke API gagal, dengan opsi mencoba lagi. */
export function ErrorState({
  message,
  onRetry,
  className = '',
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}): JSX.Element {
  return (
    <div
      role="alert"
      className={`rounded-2xl border border-line bg-surface p-8 text-center ${className}`}
    >
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <WifiOff aria-hidden="true" className="h-6 w-6 text-primary" />
      </span>
      <h3 className="mt-4 font-bold text-ink">Gagal memuat data</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-2">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-5">
          <RotateCw aria-hidden="true" className="h-4 w-4" />
          Coba lagi
        </Button>
      )}
    </div>
  );
}
