import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { CalendarDays, Inbox, Phone, Users } from 'lucide-react';
import { ErrorState } from '../ui/ErrorState';
import { PageLoader } from '../ui/PageLoader';
import { useApiResource } from '../../hooks/useApiResource';
import { ApiError, apiPatch } from '../../lib/api';
import { formatRupiah, formatTanggal } from '../../lib/format';

export const BOOKING_STATUSES = ['baru', 'dikonfirmasi', 'selesai', 'batal'] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type Booking = {
  id: number;
  package_id: string | null;
  package_title: string;
  package_price: number;
  name: string;
  phone: string;
  people: number;
  trip_date: string;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
};

type Payload = { items: Booking[]; counts: Partial<Record<BookingStatus, number>> };

const STATUS_STYLE: Record<BookingStatus, string> = {
  baru: 'bg-primary/10 text-primary',
  dikonfirmasi: 'bg-blue-50 text-blue-700',
  selesai: 'bg-green-50 text-green-700',
  batal: 'bg-red-50 text-red-700',
};

/** Nomor HP diubah ke format internasional agar tautan wa.me valid. */
function waHref(phone: string, name: string, title: string): string {
  const digits = phone.replace(/\D/g, '').replace(/^0/, '62');
  const text = `Halo ${name}, terima kasih sudah memesan *${title}* di VisitCiremai. Kami ingin mengonfirmasi detail perjalanan Anda.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function BookingsPanel({ onCountsChange }: { onCountsChange?: (n: number) => void }): JSX.Element {
  const [filter, setFilter] = useState<BookingStatus | ''>('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const path = `/admin/bookings${filter ? `?status=${filter}` : ''}`;
  const { data, loading, error, reload } = useApiResource<Payload>(path);

  // Lencana tab dikabarkan lewat efek, bukan saat render, agar tidak
  // memicu setState pada induk di tengah render.
  const baru = data?.counts.baru ?? 0;
  useEffect(() => {
    onCountsChange?.(baru);
  }, [baru, onCountsChange]);

  async function changeStatus(id: number, status: BookingStatus) {
    setBusyId(id);
    setActionError(null);
    try {
      await apiPatch(`/admin/bookings/${id}`, { status });
      reload();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : 'Gagal mengubah status pemesanan.',
      );
    } finally {
      setBusyId(null);
    }
  }

  if (loading && !data) return <PageLoader />;
  if (error && !data) return <ErrorState message={error} onRetry={reload} />;

  const items = data?.items ?? [];

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Pemesanan</h1>
          <p className="mt-1 text-sm text-ink-2">
            {items.length} pemesanan{filter ? ` berstatus "${filter}"` : ''}.
          </p>
        </div>

        <div>
          <label htmlFor="filter-booking" className="sr-only">
            Saring berdasarkan status
          </label>
          <select
            id="filter-booking"
            value={filter}
            onChange={(e) => setFilter(e.target.value as BookingStatus | '')}
            className="h-10 cursor-pointer rounded-lg border border-line bg-surface px-3 text-sm text-ink outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <option value="">Semua status</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s} ({data?.counts[s] ?? 0})
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
          <p className="mt-3 text-ink-2">Belum ada pemesanan di kategori ini.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {items.map((b) => (
            <li
              key={b.id}
              className="rounded-2xl border border-line bg-surface p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-ink">{b.package_title}</p>
                  <p className="mt-0.5 text-sm text-ink-2">
                    {formatRupiah(b.package_price)} · dipesan{' '}
                    {new Date(b.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[b.status]}`}
                >
                  {b.status}
                </span>
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-ink-2">Pemesan</dt>
                  <dd className="font-medium text-ink">{b.name}</dd>
                </div>
                <div>
                  <dt className="text-ink-2">Kontak</dt>
                  <dd>
                    <a
                      href={waHref(b.phone, b.name, b.package_title)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Phone aria-hidden="true" className="h-4 w-4" />
                      {b.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-2">Jumlah orang</dt>
                  <dd className="inline-flex items-center gap-1.5 font-medium text-ink">
                    <Users aria-hidden="true" className="h-4 w-4 text-ink-2" />
                    {b.people}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-2">Tanggal perjalanan</dt>
                  <dd className="inline-flex items-center gap-1.5 font-medium text-ink">
                    <CalendarDays aria-hidden="true" className="h-4 w-4 text-ink-2" />
                    {formatTanggal(b.trip_date) || b.trip_date}
                  </dd>
                </div>
              </dl>

              {b.notes && (
                <p className="mt-4 rounded-lg bg-bg p-3 text-sm text-ink-2">
                  <span className="font-medium text-ink">Catatan: </span>
                  {b.notes}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                <span className="text-sm text-ink-2">Ubah status:</span>
                {BOOKING_STATUSES.filter((s) => s !== b.status).map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={busyId === b.id}
                    onClick={() => changeStatus(b.id, s)}
                    className="rounded-full border border-line px-3 py-1.5 text-sm text-ink transition-colors hover:bg-line/40 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
