import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { Check, Inbox, Star, Trash2, Undo2, X } from 'lucide-react';
import { ErrorState } from '../ui/ErrorState';
import { PageLoader } from '../ui/PageLoader';
import { useApiResource } from '../../hooks/useApiResource';
import { ApiError, apiDelete, apiPatch } from '../../lib/api';

const STATUSES = ['pending', 'approved', 'rejected'] as const;
type Status = (typeof STATUSES)[number];

type Item = {
  id: number;
  name: string;
  trip: string;
  rating: number;
  quote: string;
  status: Status;
  created_at: string;
};

type Payload = { items: Item[]; counts: Partial<Record<Status, number>> };

const STATUS_LABEL: Record<Status, string> = {
  pending: 'Menunggu',
  approved: 'Tampil',
  rejected: 'Ditolak',
};

const STATUS_STYLE: Record<Status, string> = {
  pending: 'bg-[#F4B942]/15 text-[#8a6200]',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
};

export function TestimonialsPanel({
  onCountsChange,
}: {
  onCountsChange?: (n: number) => void;
}): JSX.Element {
  const [filter, setFilter] = useState<Status | ''>('pending');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const path = `/admin/testimonials${filter ? `?status=${filter}` : ''}`;
  const { data, loading, error, reload } = useApiResource<Payload>(path);

  const pending = data?.counts.pending ?? 0;
  useEffect(() => {
    onCountsChange?.(pending);
  }, [pending, onCountsChange]);

  async function run(id: number, action: () => Promise<unknown>, failMessage: string) {
    setBusyId(id);
    setActionError(null);
    try {
      await action();
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : failMessage);
    } finally {
      setBusyId(null);
    }
  }

  function setStatus(id: number, status: Status) {
    return run(
      id,
      () => apiPatch(`/admin/testimonials/${id}`, { status }),
      'Gagal mengubah status testimoni.',
    );
  }

  function remove(id: number) {
    if (!window.confirm('Hapus testimoni ini secara permanen?')) return;
    void run(
      id,
      () => apiDelete(`/admin/testimonials/${id}`),
      'Gagal menghapus testimoni.',
    );
  }

  if (loading && !data) return <PageLoader />;
  if (error && !data) return <ErrorState message={error} onRetry={reload} />;

  const items = data?.items ?? [];

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Testimoni</h1>
          <p className="mt-1 text-sm text-ink-2">
            Hanya testimoni berstatus <strong>Tampil</strong> yang muncul di situs.
          </p>
        </div>

        <div>
          <label htmlFor="filter-testi" className="sr-only">
            Saring berdasarkan status
          </label>
          <select
            id="filter-testi"
            value={filter}
            onChange={(e) => setFilter(e.target.value as Status | '')}
            className="h-10 cursor-pointer rounded-lg border border-line bg-surface px-3 text-sm text-ink outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <option value="">Semua status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]} ({data?.counts[s] ?? 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionError && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {actionError}
        </p>
      )}

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-line bg-surface p-10 text-center">
          <Inbox aria-hidden="true" className="mx-auto h-10 w-10 text-ink-2" />
          <p className="mt-3 text-ink-2">Tidak ada testimoni di kategori ini.</p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {items.map((t) => (
            <li
              key={t.id}
              className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex items-center gap-1"
                  aria-label={`Rating ${t.rating} dari 5`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className={
                        i < t.rating
                          ? 'h-4 w-4 fill-[#F4B942] text-[#F4B942]'
                          : 'h-4 w-4 text-line'
                      }
                    />
                  ))}
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[t.status]}`}
                >
                  {STATUS_LABEL[t.status]}
                </span>
              </div>

              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink">
                “{t.quote}”
              </blockquote>

              <div className="mt-4 border-t border-line pt-3">
                <p className="font-semibold text-ink">{t.name}</p>
                <p className="text-sm text-ink-2">
                  {t.trip} ·{' '}
                  {new Date(t.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {t.status !== 'approved' && (
                  <button
                    type="button"
                    disabled={busyId === t.id}
                    onClick={() => void setStatus(t.id, 'approved')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <Check aria-hidden="true" className="h-4 w-4" />
                    Setujui
                  </button>
                )}
                {t.status !== 'rejected' && (
                  <button
                    type="button"
                    disabled={busyId === t.id}
                    onClick={() => void setStatus(t.id, 'rejected')}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-ink transition-colors hover:bg-line/40 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <X aria-hidden="true" className="h-4 w-4" />
                    Tolak
                  </button>
                )}
                {t.status !== 'pending' && (
                  <button
                    type="button"
                    disabled={busyId === t.id}
                    onClick={() => void setStatus(t.id, 'pending')}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-ink transition-colors hover:bg-line/40 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Undo2 aria-hidden="true" className="h-4 w-4" />
                    Kembalikan
                  </button>
                )}
                <button
                  type="button"
                  disabled={busyId === t.id}
                  onClick={() => remove(t.id)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
