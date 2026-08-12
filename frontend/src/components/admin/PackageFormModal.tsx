import type { JSX } from 'react';
import { useState } from 'react';
import { ImageUp, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ApiError, apiPost, apiPut, apiUpload } from '../../lib/api';
import { formatThousands, parseThousands } from '../../lib/format';
import type { Category } from '../../types/package';

const CATEGORIES: Category[] = [
  'Pendakian Gunung Hutan',
  'Petualangan Lainnya',
  'Akomodasi',
  'Transportasi',
  'Sewa Alat',
];

export type AdminPackage = {
  id: string;
  title: string;
  category: string;
  location?: string;
  price: number;
  priceUnit: string;
  duration: string;
  image: string;
  description: string;
  includes?: string[];
  gallery?: string[];
  notes?: string[];
  isPublished: boolean;
  sortOrder: number;
};

const field =
  'w-full rounded-lg border border-line bg-surface px-4 py-2.5 text-ink placeholder:text-ink-2/60 outline-none transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30';

const labelClass = 'mb-1.5 block text-sm font-medium text-ink';

/** Catatan bawaan untuk paket baru — aturan bisnis yang berlaku umum. */
const DEFAULT_NOTES = [
  'Itinerary lengkap akan dibagikan sesuai kebutuhan operasional perjalanan.',
  'Tim kami terbuka untuk pertanyaan seputar paket ini.',
  'Harga dapat menyesuaikan sesuai permintaan dan jumlah peserta.',
];

/** Mengubah judul menjadi slug URL: huruf kecil, tanpa simbol. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // buang tanda diakritik hasil normalisasi
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function Err({ message }: { message?: string }): JSX.Element | null {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-red-700">{message}</p>;
}

/**
 * Editor daftar teks sederhana — dipakai untuk "Yang Termasuk" dan "Catatan".
 * Enter menambah item, bukan mengirim seluruh form.
 */
function ListEditor({
  id,
  label,
  hint,
  placeholder,
  items,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  placeholder: string;
  items: string[];
  onChange: (next: string[]) => void;
}): JSX.Element {
  const [draft, setDraft] = useState('');

  function add() {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft('');
  }

  return (
    <div>
      <span className={labelClass}>{label}</span>
      {hint && <p className="-mt-1 mb-2 text-xs text-ink-2">{hint}</p>}

      {items.length > 0 && (
        <ul className="mb-3 space-y-2">
          {items.map((item, i) => (
            <li key={`${item}-${i}`} className="flex items-start gap-2">
              <span className="flex-1 rounded-lg bg-bg px-3 py-2 text-sm text-ink">
                {item}
              </span>
              <button
                type="button"
                aria-label={`Hapus ${item}`}
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="rounded-full p-2 text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <label htmlFor={id} className="sr-only">
          {label} — item baru
        </label>
        <input
          id={id}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className={field}
        />
        <Button variant="ghost" className="shrink-0" onClick={add}>
          <Plus aria-hidden="true" className="h-4 w-4" />
          Tambah
        </Button>
      </div>
    </div>
  );
}

export function PackageFormModal({
  open,
  initial,
  onClose,
  onSaved,
}: {
  open: boolean;
  /** null = membuat paket baru. */
  initial: AdminPackage | null;
  onClose: () => void;
  onSaved: () => void;
}): JSX.Element {
  const isEdit = initial !== null;

  const [id, setId] = useState(initial?.id ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [title, setTitle] = useState(initial?.title ?? '');
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
  const [location, setLocation] = useState(initial?.location ?? '');
  // Disimpan sebagai teks berformat ribuan ('2.200.000'); diubah ke angka
  // hanya saat dikirim ke server.
  const [price, setPrice] = useState(formatThousands(String(initial?.price ?? '')));
  const [priceUnit, setPriceUnit] = useState(initial?.priceUnit ?? 'Orang');
  const [duration, setDuration] = useState(initial?.duration ?? '');
  const [image, setImage] = useState(initial?.image ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [includes, setIncludes] = useState<string[]>(initial?.includes ?? []);
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? []);
  const [notes, setNotes] = useState<string[]>(initial?.notes ?? DEFAULT_NOTES);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));

  const [uploading, setUploading] = useState<'image' | 'gallery' | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleTitleChange(value: string) {
    setTitle(value);
    // Slug ikut judul sampai admin mengubahnya sendiri.
    if (!slugTouched) setId(slugify(value));
  }

  async function upload(file: File, target: 'image' | 'gallery') {
    setUploading(target);
    setFormError(null);
    try {
      const { url } = await apiUpload('/admin/uploads', file);
      if (target === 'image') setImage(url);
      else setGallery((g) => [...g, url]);
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : 'Gagal mengunggah gambar.',
      );
    } finally {
      setUploading(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    setFieldErrors({});

    const payload = {
      title,
      category,
      location: location.trim() || undefined,
      price: parseThousands(price),
      priceUnit,
      duration,
      image,
      description,
      isPublished,
      sortOrder: Number(sortOrder) || 0,
      includes,
      gallery,
      notes,
    };

    try {
      if (initial) {
        await apiPut(`/admin/packages/${encodeURIComponent(initial.id)}`, payload);
      } else {
        await apiPost('/admin/packages', { ...payload, id });
      }
      onSaved();
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        if (err.fields) setFieldErrors(err.fields);
      } else {
        setFormError('Gagal menyimpan paket.');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Ubah Paket' : 'Tambah Paket'}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {formError}
          </p>
        )}

        <div>
          <label htmlFor="pf-title" className={labelClass}>
            Judul <span className="text-primary">*</span>
          </label>
          <input
            id="pf-title"
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={field}
          />
          <Err message={fieldErrors.title} />
        </div>

        <div>
          <label htmlFor="pf-id" className={labelClass}>
            Slug URL <span className="text-primary">*</span>
          </label>
          <input
            id="pf-id"
            type="text"
            required
            readOnly={isEdit}
            value={id}
            onChange={(e) => {
              setSlugTouched(true);
              setId(e.target.value);
            }}
            className={`${field} ${isEdit ? 'cursor-not-allowed bg-bg text-ink-2' : ''}`}
          />
          <p className="mt-1.5 text-xs text-ink-2">
            {isEdit
              ? 'Slug tidak bisa diubah agar tautan lama tetap berfungsi.'
              : `Alamat halaman: /paket/${id || 'contoh-slug'}`}
          </p>
          <Err message={fieldErrors.id} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pf-category" className={labelClass}>
              Kategori <span className="text-primary">*</span>
            </label>
            <select
              id="pf-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${field} cursor-pointer`}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Err message={fieldErrors.category} />
          </div>
          <div>
            <label htmlFor="pf-location" className={labelClass}>
              Lokasi
            </label>
            <input
              id="pf-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Via Apuy"
              className={field}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label htmlFor="pf-price" className={labelClass}>
              Harga <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-2"
              >
                Rp
              </span>
              {/* type="text" + inputMode numeric: input number tidak bisa
                  menampilkan titik ribuan, tapi papan ketik ponsel tetap angka. */}
              <input
                id="pf-price"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                required
                value={price}
                onChange={(e) => setPrice(formatThousands(e.target.value))}
                placeholder="0"
                className={`${field} pl-10`}
              />
            </div>
            <Err message={fieldErrors.price} />
          </div>
          <div>
            <label htmlFor="pf-unit" className={labelClass}>
              Satuan <span className="text-primary">*</span>
            </label>
            <select
              id="pf-unit"
              value={priceUnit}
              onChange={(e) => setPriceUnit(e.target.value)}
              className={`${field} cursor-pointer`}
            >
              <option value="Orang">Orang</option>
              <option value="Unit">Unit</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="pf-duration" className={labelClass}>
            Durasi <span className="text-primary">*</span>
          </label>
          <input
            id="pf-duration"
            type="text"
            required
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Contoh: 2 hari 1 malam"
            className={field}
          />
          <Err message={fieldErrors.duration} />
        </div>

        <div>
          <label htmlFor="pf-description" className={labelClass}>
            Deskripsi <span className="text-primary">*</span>
          </label>
          <textarea
            id="pf-description"
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${field} resize-y`}
          />
          <Err message={fieldErrors.description} />
        </div>

        {/* Gambar utama */}
        <div>
          <span className={labelClass}>
            Gambar utama <span className="text-primary">*</span>
          </span>
          <div className="flex items-center gap-4">
            {image ? (
              <img
                src={image}
                alt=""
                className="h-20 w-28 shrink-0 rounded-lg border border-line object-cover"
              />
            ) : (
              <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg border border-dashed border-line text-xs text-ink-2">
                Belum ada
              </div>
            )}
            <div className="min-w-0 flex-1">
              <label
                htmlFor="pf-image-file"
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink transition-colors hover:bg-line/40 focus-within:ring-2 focus-within:ring-primary"
              >
                <ImageUp aria-hidden="true" className="h-4 w-4" />
                {uploading === 'image' ? 'Mengunggah…' : 'Pilih gambar'}
              </label>
              <input
                id="pf-image-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void upload(f, 'image');
                  e.target.value = '';
                }}
              />
              <p className="mt-1.5 truncate text-xs text-ink-2">
                {image || 'JPG, PNG, atau WEBP — maksimal 3 MB.'}
              </p>
            </div>
          </div>
          <Err message={fieldErrors.image} />
        </div>

        {/* Galeri */}
        <div>
          <span className={labelClass}>Galeri foto</span>
          {gallery.length > 0 && (
            <ul className="mb-3 flex flex-wrap gap-2">
              {gallery.map((src, i) => (
                <li key={`${src}-${i}`} className="relative">
                  <img
                    src={src}
                    alt=""
                    className="h-16 w-24 rounded-lg border border-line object-cover"
                  />
                  <button
                    type="button"
                    aria-label={`Hapus foto ${i + 1}`}
                    onClick={() => setGallery((g) => g.filter((_, j) => j !== i))}
                    className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                  >
                    <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <label
            htmlFor="pf-gallery-file"
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink transition-colors hover:bg-line/40 focus-within:ring-2 focus-within:ring-primary"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            {uploading === 'gallery' ? 'Mengunggah…' : 'Tambah foto'}
          </label>
          <input
            id="pf-gallery-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f, 'gallery');
              e.target.value = '';
            }}
          />
        </div>

        <ListEditor
          id="pf-include"
          label="Yang termasuk"
          placeholder="Contoh: Guide bersertifikat"
          items={includes}
          onChange={setIncludes}
        />

        <ListEditor
          id="pf-note"
          label="Catatan"
          hint="Tampil sebagai kotak Catatan di bawah halaman detail paket."
          placeholder="Contoh: Harga dapat menyesuaikan jumlah peserta."
          items={notes}
          onChange={setNotes}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pf-sort" className={labelClass}>
              Urutan tampil
            </label>
            <input
              id="pf-sort"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={field}
            />
            <p className="mt-1.5 text-xs text-ink-2">Angka kecil tampil lebih dulu.</p>
          </div>
          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-3 pb-2.5">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-5 w-5 rounded border-line accent-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              <span className="text-sm font-medium text-ink">
                Terbitkan di situs
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 border-t border-line pt-4">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" className="flex-1" disabled={saving}>
            {saving ? 'Menyimpan…' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
