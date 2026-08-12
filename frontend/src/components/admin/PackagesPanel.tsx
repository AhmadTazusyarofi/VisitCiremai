import type { JSX } from 'react';
import { useState } from 'react';
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { ErrorState } from '../ui/ErrorState';
import { PageLoader } from '../ui/PageLoader';
import { PackageFormModal, type AdminPackage } from './PackageFormModal';
import { useApiResource } from '../../hooks/useApiResource';
import { ApiError, apiDelete, apiGet } from '../../lib/api';
import { formatRupiah } from '../../lib/format';

export function PackagesPanel(): JSX.Element {
  const { data, loading, error, reload } = useApiResource<AdminPackage[]>(
    '/admin/packages',
  );

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminPackage | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  async function openEdit(id: string) {
    setBusyId(id);
    setActionError(null);
    try {
      // Ambil detail lengkap (includes & gallery tidak ikut di daftar).
      const full = await apiGet<AdminPackage>(
        `/admin/packages/${encodeURIComponent(id)}`,
      );
      setEditing(full);
      setFormOpen(true);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Gagal memuat paket.');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(pkg: AdminPackage) {
    const ok = window.confirm(
      `Hapus paket "${pkg.title}"?\n\nPemesanan yang sudah masuk tetap tersimpan beserta judul dan harganya.`,
    );
    if (!ok) return;

    setBusyId(pkg.id);
    setActionError(null);
    try {
      await apiDelete(`/admin/packages/${encodeURIComponent(pkg.id)}`);
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Gagal menghapus paket.');
    } finally {
      setBusyId(null);
    }
  }

  if (loading && !data) return <PageLoader />;
  if (error && !data) return <ErrorState message={error} onRetry={reload} />;

  const items = data ?? [];

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Paket</h1>
          <p className="mt-1 text-sm text-ink-2">
            {items.length} paket · {items.filter((p) => p.isPublished).length} terbit.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus aria-hidden="true" className="h-4 w-4" />
          Tambah Paket
        </Button>
      </div>

      {actionError && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {actionError}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <caption className="sr-only">Daftar paket wisata</caption>
          <thead className="border-b border-line text-ink-2">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Paket
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Kategori
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Harga
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt=""
                      className="h-11 w-16 shrink-0 rounded-lg border border-line object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-ink">{p.title}</p>
                      <p className="truncate text-xs text-ink-2">/paket/{p.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-2">{p.category}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink">
                  {formatRupiah(p.price)}
                  <span className="text-xs text-ink-2"> / {p.priceUnit}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      p.isPublished
                        ? 'bg-green-50 text-green-700'
                        : 'bg-line/60 text-ink-2'
                    }`}
                  >
                    {p.isPublished ? (
                      <Eye aria-hidden="true" className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff aria-hidden="true" className="h-3.5 w-3.5" />
                    )}
                    {p.isPublished ? 'Terbit' : 'Draf'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      disabled={busyId === p.id}
                      onClick={() => void openEdit(p.id)}
                      aria-label={`Ubah ${p.title}`}
                      className="rounded-full p-2 text-ink-2 transition-colors hover:bg-line/60 hover:text-ink disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Pencil aria-hidden="true" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={busyId === p.id}
                      onClick={() => void remove(p)}
                      aria-label={`Hapus ${p.title}`}
                      className="rounded-full p-2 text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <PackageFormModal
          // key memaksa form dibuat ulang, sehingga state-nya bersih tiap dibuka.
          key={editing?.id ?? 'baru'}
          open={formOpen}
          initial={editing}
          onClose={() => setFormOpen(false)}
          onSaved={reload}
        />
      )}
    </section>
  );
}
