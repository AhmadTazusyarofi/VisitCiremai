import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
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
import { packages } from '../data/packages';
import { formatRupiah } from '../lib/format';

const WHATSAPP_NUMBER = '6285520752899'; // matches the footer contact number

const inputClass =
  'w-full rounded-lg border border-line bg-surface px-4 py-2.5 text-ink placeholder:text-ink-2/60 outline-none transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30';

export function PackageDetailPage(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const pkg = packages.find((p) => p.id === id);

  const [nama, setNama] = useState('');
  const [hp, setHp] = useState('');
  const [jumlah, setJumlah] = useState('1');
  const [catatan, setCatatan] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!pkg) {
    return (
      <>
        <Navbar alwaysSolid />
        <main className="min-h-screen bg-bg pt-16">
          <Container className="py-24 text-center">
            <h1 className="text-2xl font-bold text-ink">Paket tidak ditemukan</h1>
            <p className="mx-auto mt-3 max-w-md text-ink-2">
              Maaf, paket yang Anda cari tidak tersedia atau tautannya sudah berubah.
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/#paket')}>
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Kembali ke Beranda
              </Button>
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
    `Catatan: ${catatan || '-'}`,
  ].join('\n');
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(pesan)}`;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <Navbar alwaysSolid />
      <main className="min-h-screen bg-bg pt-16">
        <Container className="py-8 sm:py-12">
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
              <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="max-h-[560px] w-full object-cover"
                />
              </div>

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
            <aside className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
                {submitted ? (
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 aria-hidden="true" className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="mt-4 text-lg font-bold text-ink">
                      Pesanan siap dikirim!
                    </h2>
                    <p className="mt-2 text-sm text-ink-2">
                      Terima kasih, {nama || 'Kak'}. Klik tombol di bawah untuk
                      mengirim detail pesanan ke WhatsApp tim VisitCiremai untuk
                      konfirmasi.
                    </p>
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
                      Ubah data pesanan
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

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                          className={inputClass}
                        />
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
                          className={inputClass}
                        />
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
                          className={inputClass}
                        />
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
                          className={`${inputClass} resize-y`}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        <Send aria-hidden="true" className="h-4 w-4" />
                        Kirim Pemesanan
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
