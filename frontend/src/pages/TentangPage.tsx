import type { JSX } from 'react';
import { useEffect } from 'react';
import {
  ChevronRight,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Mountain,
  Phone,
} from 'lucide-react';
import { Seo } from '../components/Seo';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';
import { LocationMap, MAP_LINK } from '../components/ui/LocationMap';
import { WhyVisitCiremai } from '../components/sections/WhyVisitCiremai';
import { CTASection } from '../components/sections/CTASection';
import { usePackages } from '../hooks/usePackages';
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
} from '../lib/config';
import { waLink } from '../lib/whatsapp';

const contacts = [
  {
    icon: Phone,
    label: 'Telepon / WhatsApp',
    value: CONTACT_PHONE,
    href: CONTACT_PHONE_HREF,
  },
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: MapPin,
    label: 'Alamat',
    value: CONTACT_ADDRESS,
    href: MAP_LINK,
    external: true,
  },
];

export function TentangPage(): JSX.Element {
  const { data: packages } = usePackages();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Angka diambil dari katalog yang benar-benar tersedia, bukan klaim karangan.
  // Selama data belum termuat, tampilkan '—' agar tidak ada angka menyesatkan.
  const kategoriCount = packages
    ? new Set(packages.map((p) => p.category)).size
    : null;

  const stats = [
    { value: packages ? `${packages.length}` : '—', label: 'Paket & layanan tersedia' },
    { value: kategoriCount !== null ? `${kategoriCount}` : '—', label: 'Kategori layanan' },
    { value: '3.078 m', label: 'Puncak Gunung Ciremai' },
  ];

  return (
    <>
      <Seo
        title="Tentang Kami — VisitCiremai"
        description="Kenali VisitCiremai, partner wisata Gunung Ciremai yang menyediakan paket pendakian, akomodasi, transportasi, dan sewa alat outdoor bersama tim lokal Majalengka."
      />
      <Navbar alwaysSolid />
      <main id="main-content" tabIndex={-1} className="bg-bg outline-none">
        {/* Header */}
        <section className="relative overflow-hidden pt-16 text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[url('/img/hero.png')] bg-cover bg-center bg-fixed"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/60" />

          <Container className="relative z-10 py-14 [text-shadow:0_2px_8px_rgba(0,0,0,0.7)] sm:py-20">
            <nav
              aria-label="Breadcrumb"
              className="mb-5 flex flex-wrap items-center gap-1 text-sm text-white/80"
            >
              <a href="/#beranda" className="rounded transition-colors hover:text-white">
                Beranda
              </a>
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
              <span className="text-white">Tentang Kami</span>
            </nav>

            <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
              Partner perjalananmu di Gunung Ciremai
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
              VisitCiremai dijalankan oleh tim lokal yang tumbuh di kaki Ciremai. Kami
              bantu kamu menyiapkan perjalanan dari awal sampai pulang dengan aman.
            </p>
          </Container>
        </section>

        {/* Cerita kami */}
        <section className="py-14 sm:py-20">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  <Mountain aria-hidden="true" className="h-4 w-4" />
                  Cerita Kami
                </span>
                <h2 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">
                  Dari orang lokal, untuk setiap petualang
                </h2>
                <div className="mt-5 space-y-4 leading-relaxed text-ink-2">
                  <p>
                    VisitCiremai berawal dari kebiasaan sederhana: membantu teman dan
                    tamu yang ingin mendaki Ciremai tapi bingung harus mulai dari mana.
                    Mulai dari perizinan, transportasi, tempat menginap, sampai
                    perlengkapan — semuanya sering harus diurus terpisah.
                  </p>
                  <p>
                    Dari situ kami merapikannya menjadi satu tempat. Sekarang kamu bisa
                    memilih paket pendakian, petualangan lain, akomodasi, transportasi,
                    dan sewa alat outdoor dalam satu platform, lalu langsung terhubung
                    dengan tim kami lewat WhatsApp.
                  </p>
                  <p>
                    Kami bekerja bersama guide, porter, dan pelaku wisata sekitar
                    Ciremai. Jadi setiap perjalanan yang kamu pesan ikut menghidupkan
                    ekonomi warga di kawasan ini.
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button as="a" href="/#paket">
                    Lihat Paket
                  </Button>
                  <Button
                    as="a"
                    variant="ghost"
                    href={waLink(
                      'Halo VisitCiremai! Saya ingin tahu lebih banyak tentang layanan kalian.',
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle aria-hidden="true" className="h-4 w-4" />
                    Tanya via WhatsApp
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-line shadow-sm">
                <img
                  src="/img/hero.png"
                  alt="Pemandangan kawasan Gunung Ciremai"
                  loading="lazy"
                  className="aspect-4/3 w-full object-cover"
                />
              </div>
            </div>

            {/* Stats */}
            <ul className="mt-12 grid gap-4 sm:grid-cols-3">
              {stats.map((s) => (
                <li
                  key={s.label}
                  className="rounded-xl border border-line bg-surface p-6 text-center"
                >
                  <p className="text-3xl font-bold text-primary">{s.value}</p>
                  <p className="mt-1 text-sm text-ink-2">{s.label}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <WhyVisitCiremai />

        {/* Kontak + peta */}
        <section id="lokasi" className="py-14 sm:py-20">
          <Container>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">
                Kontak &amp; Lokasi
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-ink-2">
                Punya pertanyaan soal paket, tanggal keberangkatan, atau kebutuhan
                khusus? Hubungi kami — tim kami siap membantu.
              </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-start">
              <ul className="space-y-4">
                {contacts.map(({ icon: Icon, label, value, href, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external
                        ? { target: '_blank', rel: 'noreferrer' }
                        : {})}
                      className="flex items-start gap-4 rounded-xl border border-line bg-surface p-5 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm text-ink-2">{label}</span>
                        <span className="mt-0.5 flex items-center gap-1.5 font-semibold text-ink">
                          {value}
                          {external && (
                            <ExternalLink
                              aria-hidden="true"
                              className="h-4 w-4 shrink-0 text-ink-2"
                            />
                          )}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <LocationMap className="h-72 border-line sm:h-96" />
            </div>
          </Container>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
