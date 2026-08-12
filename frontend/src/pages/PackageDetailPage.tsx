import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  MapPin,
  MessageCircle,
  Send,
  Tag,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/PageLoader';
import { Seo } from '../components/Seo';
import { PackageGallery } from '../components/package/PackageGallery';
import { usePackage } from '../hooks/usePackages';
import { ApiError, apiPost } from '../lib/api';
import { formatRupiah, formatTanggal, todayISO } from '../lib/format';
import { waLink } from '../lib/whatsapp';

const inputClass =
  'w-full rounded-lg border border-line bg-surface px-4 py-2.5 text-ink placeholder:text-ink-2/60 outline-none transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30';

const inputErrorClass = 'border-red-600 focus:border-red-600';

/** Pesan error di bawah sebuah field. */
function FieldError({ id, message }: { id: string; message?: string }): JSX.Element | null {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-red-700">
      {message}
    </p>
  );
}

export function PackageDetailPage(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: pkg, loading, error, reload } = usePackage(id);

  const [nama, setNama] = useState('');
  const [hp, setHp] = useState('');
  const [jumlah, setJumlah] = useState('1');
  const [tanggal, setTanggal] = useState('');
  const [catatan, setCatatan] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const minDate = todayISO();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <>
        <Seo title="Memuat paket… — VisitCiremai" noindex />
        <Navbar alwaysSolid />
        <main id="main-content" tabIndex={-1} className="pt-16 outline-none">
          <PageLoader />
        </main>
      </>
    );
  }

  if (!pkg) {
    const isNotFound = !error || error.toLowerCase().includes('tidak ditemukan');
    return (
      <>
        <Seo title="Paket tidak ditemukan — VisitCiremai" noindex />
        <Navbar alwaysSolid />
        <main
          id="main-content"
          tabIndex={-1}
          className="min-h-screen bg-bg pt-16 outline-none"
        >
          <Container className="py-24 text-center">
            <h1 className="text-2xl font-bold text-ink">
              {isNotFound ? 'Paket tidak ditemukan' : 'Gagal memuat paket'}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-ink-2">
              {isNotFound
                ? 'Maaf, paket yang Anda cari tidak tersedia atau tautannya sudah berubah.'
                : error}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={() => navigate('/#paket')}>
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Kembali ke Beranda
              </Button>
              {!isNotFound && (
                <Button variant="ghost" onClick={reload}>
                  Coba lagi
                </Button>
              )}
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  const pesan = [
    `Halo VisitCiremai! Saya ingin memesan paket berikut:`,
    ``,
    `*${pkg.title}*`,
    `Harga: ${formatRupiah(pkg.price)} / ${pkg.priceUnit}`,
    `Durasi: ${pkg.duration}`,
    ``,
    `Nama: ${nama || '-'}`,
    `No. HP/WA: ${hp || '-'}`,
    `Jumlah Orang: ${jumlah || '-'}`,
    `Tanggal Perjalanan: ${formatTanggal(tanggal) || '-'}`,
    `Catatan: ${catatan || '-'}`,
  ].join('\n');
  const waHref = waLink(pesan);
  const images = [pkg.image, ...(pkg.gallery ?? [])].filter(
    (src, i, arr) => arr.indexOf(src) === i,
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pkg) return;

    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    try {
      await apiPost<{ id: number }>('/bookings', {
        packageId: pkg.id,
        name: nama,
        phone: hp,
        people: Number(jumlah),
        tripDate: tanggal,
        notes: catatan || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        if (err.fields) setFieldErrors(err.fields);
      } else {
        setFormError('Gagal mengirim pemesanan. Coba lagi beberapa saat lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Seo
        title={`${pkg.title} — VisitCiremai`}
        description={pkg.description}
        image={pkg.image}
        type="product"
      />
      <Navbar alwaysSolid />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-bg pt-16 outline-none"
      >
        <Container className="py-8 sm:py-12 max-lg:pb-28">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1 text-sm text-ink-2"
          >
            <a href="/#beranda" className="transition-colors hover:text-ink">
              Beranda
            </a>
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
            <a href="/#paket" className="transition-colors hover:text-ink">
              Paket
            </a>
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
            <span className="line-clamp-1 text-ink">{pkg.title}</span>
          </nav>

          <h1 className="mb-8 text-2xl font-bold leading-tight text-ink sm:text-3xl">
            {pkg.title}
          </h1>

          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            {/* Left: package details */}
            <div className="space-y-6">
              <PackageGallery images={images} alt={pkg.title} />

              {/* Meta chips */}
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink">
                  <Tag aria-hidden="true" className="h-4 w-4 text-primary" />
                  {formatRupiah(pkg.price)}
                  <span className="font-normal text-ink-2">/ {pkg.priceUnit}</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink">
                  <Clock aria-hidden="true" className="h-4 w-4 text-primary" />
                  {pkg.duration}
                </span>
                {pkg.location && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink">
                    <MapPin aria-hidden="true" className="h-4 w-4 text-primary" />
                    {pkg.location}
                  </span>
                )}
              </div>

              {/* Overview */}
              <section className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
                <h2 className="text-lg font-bold text-ink">Tentang Paket</h2>
                <p className="mt-3 text-ink-2 leading-relaxed">{pkg.description}</p>
              </section>

              {/* Includes */}
              {pkg.includes && pkg.includes.length > 0 && (
                <section className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-ink">Yang Termasuk</h2>
                  <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Check aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Notes */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-ink-2">
                <p className="font-semibold text-ink">Catatan</p>
                <ul className="mt-2 space-y-1">
                  <li>• Itinerary lengkap akan dibagikan sesuai kebutuhan operasional perjalanan.</li>
                  <li>• Tim kami terbuka untuk pertanyaan seputar paket ini.</li>
                  <li>• Harga dapat menyesuaikan sesuai permintaan dan jumlah peserta.</li>
                </ul>
              </div>
            </div>

            {/* Right: booking form */}
            <aside id="form-pemesanan" className="scroll-mt-24 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
                {submitted ? (
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="mt-4 text-lg font-bold text-ink">
                      Pemesanan tersimpan!
                    </h2>
                    <p className="mt-2 text-sm text-ink-2">
                      Terima kasih, {nama || 'Kak'}. Pesanan Anda sudah kami terima.
                      Kirim juga detailnya lewat WhatsApp agar tim kami bisa segera
                      mengonfirmasi.
                    </p>
                    {formatTanggal(tanggal) && (
                      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                        <CalendarDays aria-hidden="true" className="h-4 w-4" />
                        {formatTanggal(tanggal)}
                      </p>
                    )}
                    <Button
                      as="a"
                      href={waHref}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 w-full"
                    >
                      <MessageCircle aria-hidden="true" className="h-4 w-4" />
                      Hubungi WhatsApp
                    </Button>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-3 text-sm text-ink-2 underline-offset-2 hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                      Buat pesanan lain
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 flex items-center gap-2">
                      <ClipboardList aria-hidden="true" className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-bold text-ink">Form Pemesanan</h2>
                    </div>
                    <p className="mb-5 text-sm text-ink-2">
                      Isi data di bawah, lalu kirim untuk konfirmasi ke tim kami.
                    </p>

                    {formError && (
                      <p
                        role="alert"
                        className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                      >
                        {formError}
                      </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                      <div>
                        <label htmlFor="nama" className="mb-1.5 block text-sm font-medium text-ink">
                          Nama Lengkap <span className="text-primary">*</span>
                        </label>
                        <input
                          id="nama"
                          type="text"
                          required
                          value={nama}
                          onChange={(e) => setNama(e.target.value)}
                          placeholder="Masukkan nama lengkap Anda"
                          aria-invalid={Boolean(fieldErrors.name)}
                          aria-describedby={fieldErrors.name ? 'nama-error' : undefined}
                          className={`${inputClass} ${fieldErrors.name ? inputErrorClass : ''}`}
                        />
                        <FieldError id="nama-error" message={fieldErrors.name} />
                      </div>

                      <div>
                        <label htmlFor="hp" className="mb-1.5 block text-sm font-medium text-ink">
                          No. HP / WhatsApp <span className="text-primary">*</span>
                        </label>
                        <input
                          id="hp"
                          type="tel"
                          required
                          value={hp}
                          onChange={(e) => setHp(e.target.value)}
                          placeholder="Contoh: 081234567890"
                          aria-invalid={Boolean(fieldErrors.phone)}
                          aria-describedby={fieldErrors.phone ? 'hp-error' : undefined}
                          className={`${inputClass} ${fieldErrors.phone ? inputErrorClass : ''}`}
                        />
                        <FieldError id="hp-error" message={fieldErrors.phone} />
                      </div>

                      <div>
                        <label htmlFor="jumlah" className="mb-1.5 block text-sm font-medium text-ink">
                          Jumlah Orang <span className="text-primary">*</span>
                        </label>
                        <input
                          id="jumlah"
                          type="number"
                          min={1}
                          required
                          value={jumlah}
                          onChange={(e) => setJumlah(e.target.value)}
                          aria-invalid={Boolean(fieldErrors.people)}
                          aria-describedby={fieldErrors.people ? 'jumlah-error' : undefined}
                          className={`${inputClass} ${fieldErrors.people ? inputErrorClass : ''}`}
                        />
                        <FieldError id="jumlah-error" message={fieldErrors.people} />
                      </div>

                      <div>
                        <label
                          htmlFor="tanggal"
                          className="mb-1.5 block text-sm font-medium text-ink"
                        >
                          Tanggal Perjalanan <span className="text-primary">*</span>
                        </label>
                        <div className="relative">
                          <CalendarDays
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-2 max-sm:hidden"
                          />
                          <input
                            id="tanggal"
                            type="date"
                            required
                            min={minDate}
                            value={tanggal}
                            onChange={(e) => setTanggal(e.target.value)}
                            aria-invalid={Boolean(fieldErrors.tripDate)}
                            aria-describedby={
                              fieldErrors.tripDate ? 'tanggal-error' : 'tanggal-help'
                            }
                            className={`${inputClass} sm:pr-11 ${fieldErrors.tripDate ? inputErrorClass : ''}`}
                          />
                        </div>
                        {fieldErrors.tripDate ? (
                          <FieldError id="tanggal-error" message={fieldErrors.tripDate} />
                        ) : (
                          <p id="tanggal-help" className="mt-1.5 text-xs text-ink-2">
                            Pilih tanggal keberangkatan yang kamu inginkan. Ketersediaan
                            dikonfirmasi tim kami.
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="catatan" className="mb-1.5 block text-sm font-medium text-ink">
                          Catatan Tambahan
                        </label>
                        <textarea
                          id="catatan"
                          rows={3}
                          value={catatan}
                          onChange={(e) => setCatatan(e.target.value)}
                          placeholder="Tambahkan catatan jika ada..."
                          aria-invalid={Boolean(fieldErrors.notes)}
                          aria-describedby={fieldErrors.notes ? 'catatan-error' : undefined}
                          className={`${inputClass} resize-y ${fieldErrors.notes ? inputErrorClass : ''}`}
                        />
                        <FieldError id="catatan-error" message={fieldErrors.notes} />
                      </div>

                      <Button type="submit" className="w-full" disabled={submitting}>
                        <Send aria-hidden="true" className="h-4 w-4" />
                        {submitting ? 'Mengirim…' : 'Kirim Pemesanan'}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </aside>
          </div>
        </Container>

        {/* Sticky booking CTA — mobile only */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 p-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="leading-tight">
              <p className="text-xs text-ink-2">Mulai dari</p>
              <p className="font-bold text-ink">
                {formatRupiah(pkg.price)}
                <span className="text-xs font-normal text-ink-2"> / {pkg.priceUnit}</span>
              </p>
            </div>
            <Button
              onClick={() =>
                document
                  .getElementById('form-pemesanan')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Pesan Sekarang
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
