import { useState } from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTestimonials } from '../../context/TestimonialsContext';
import { usePackages } from '../../hooks/usePackages';
import { ApiError } from '../../lib/api';
import type { Category } from '../../types/package';

const fieldClass =
  'w-full rounded-lg border border-line bg-surface px-4 py-2.5 text-ink placeholder:text-ink-2/60 outline-none transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30';

/** Field yang punya tempat menampilkan pesan error tepat di bawahnya. */
const FIELDS_WITH_INLINE_ERROR = new Set(['name', 'quote']);

/** Urutan optgroup pada dropdown paket — sama dengan urutan section di beranda. */
const CATEGORY_ORDER: Category[] = [
  'Pendakian Gunung Hutan',
  'Petualangan Lainnya',
  'Akomodasi',
  'Transportasi',
  'Sewa Alat',
];

export function TestimonialForm({ onClose }: { onClose: () => void }) {
  const { addTestimonial } = useTestimonials();
  const { data: packages, loading: packagesLoading } = usePackages();

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState('');
  const [trip, setTrip] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      await addTestimonial({
        quote: message.trim(),
        name: name.trim(),
        trip: trip.trim() || 'Pengunjung',
        rating,
      });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        const fields = err.fields ?? {};
        setFieldErrors(fields);

        // Pesan validasi sudah tampil di bawah field masing-masing, jadi
        // spanduk umum ("Data yang dikirim belum valid.") hanya mengulang.
        // Spanduk dipakai untuk error yang tidak punya field, atau untuk
        // field yang tidak menampilkan pesannya sendiri.
        const tanpaTempat = Object.keys(fields).filter(
          (key) => !FIELDS_WITH_INLINE_ERROR.has(key),
        );
        if (Object.keys(fields).length === 0) {
          setFormError(err.message);
        } else if (tanpaTempat.length > 0) {
          setFormError(fields[tanpaTempat[0]] ?? err.message);
        }
      } else {
        setFormError('Gagal mengirim testimoni. Coba lagi beberapa saat lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-ink">Terima kasih!</h3>
        <p className="mt-2 text-sm text-ink-2">
          Testimoni Anda sudah kami terima dan akan tampil di halaman utama setelah
          ditinjau oleh tim VisitCiremai.
        </p>
        <Button onClick={onClose} className="mt-5 w-full">
          Tutup
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tf-name" className="mb-1.5 block text-sm font-medium text-ink">
            Nama <span className="text-primary">*</span>
          </label>
          <input
            id="tf-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'tf-name-error' : undefined}
            className={`${fieldClass} ${fieldErrors.name ? 'border-red-600' : ''}`}
          />
          {fieldErrors.name && (
            <p id="tf-name-error" className="mt-1.5 text-sm text-red-700">
              {fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="tf-trip" className="mb-1.5 block text-sm font-medium text-ink">
            Paket / Trip
          </label>

          {/* Bila katalog gagal dimuat, jangan kunci pengguna — kembalikan
              ke isian bebas agar testimoni tetap bisa dikirim. */}
          {!packagesLoading && !packages ? (
            <input
              id="tf-trip"
              type="text"
              value={trip}
              onChange={(e) => setTrip(e.target.value)}
              placeholder="Contoh: Privat Trip Ciremai"
              className={fieldClass}
            />
          ) : (
            <select
              id="tf-trip"
              value={trip}
              disabled={packagesLoading}
              onChange={(e) => setTrip(e.target.value)}
              className={`${fieldClass} cursor-pointer disabled:cursor-wait disabled:text-ink-2`}
            >
              <option value="">
                {packagesLoading ? 'Memuat paket…' : 'Pilih paket'}
              </option>
              {CATEGORY_ORDER.map((category) => {
                const items = (packages ?? []).filter((p) => p.category === category);
                if (items.length === 0) return null;
                return (
                  <optgroup key={category} label={category}>
                    {items.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          )}
        </div>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink">Rating</span>
        <div role="group" aria-label="Beri rating" className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`${star} bintang`}
              aria-pressed={rating === star}
              className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Star
                aria-hidden="true"
                className={
                  star <= rating
                    ? 'h-6 w-6 fill-[#F4B942] text-[#F4B942]'
                    : 'h-6 w-6 text-line'
                }
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="tf-message" className="mb-1.5 block text-sm font-medium text-ink">
          Pesan <span className="text-primary">*</span>
        </label>
        <textarea
          id="tf-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ceritakan pengalaman Anda bersama VisitCiremai..."
          aria-invalid={Boolean(fieldErrors.quote)}
          aria-describedby={fieldErrors.quote ? 'tf-message-error' : undefined}
          className={`${fieldClass} resize-y ${fieldErrors.quote ? 'border-red-600' : ''}`}
        />
        {fieldErrors.quote && (
          <p id="tf-message-error" className="mt-1.5 text-sm text-red-700">
            {fieldErrors.quote}
          </p>
        )}
      </div>

      {formError && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formError}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? 'Mengirim…' : 'Kirim Testimoni'}
      </Button>
    </form>
  );
}
