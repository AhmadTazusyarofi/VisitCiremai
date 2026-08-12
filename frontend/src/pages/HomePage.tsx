import type { JSX } from 'react';
import { Seo } from '../components/Seo';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Container } from '../components/layout/Container';
import { HeroSection } from '../components/hero/HeroSection';
import { CategorySection } from '../components/package/CategorySection';
import { ErrorState } from '../components/ui/ErrorState';
import { PackageGridSkeleton } from '../components/ui/PackageCardSkeleton';
import { WhyVisitCiremai } from '../components/sections/WhyVisitCiremai';
import { Testimonials } from '../components/sections/Testimonials';
import { CTASection } from '../components/sections/CTASection';
import { usePackages } from '../hooks/usePackages';
import type { Category } from '../types/package';

const CATEGORY_ORDER: { title: Category; id: string }[] = [
  { title: 'Pendakian Gunung Hutan', id: 'paket' },
  { title: 'Petualangan Lainnya', id: 'petualangan' },
  { title: 'Akomodasi', id: 'akomodasi' },
  { title: 'Transportasi', id: 'transportasi' },
  { title: 'Sewa Alat', id: 'sewa-alat' },
];

export function HomePage(): JSX.Element {
  const { data: packages, loading, error, reload } = usePackages();

  return (
    <>
      <Seo
        title="VisitCiremai — Paket Wisata & Pendakian Gunung Ciremai"
        description="Jelajahi paket pendakian, petualangan, akomodasi, transportasi, dan sewa alat outdoor di kawasan Gunung Ciremai bersama VisitCiremai."
      />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <HeroSection />

        <section id="layanan" className="py-12 sm:py-16">
          <Container className="text-center">
            <h2 className="text-3xl font-bold text-ink">Paket dan Layanan Kami</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-ink-2">
              Temukan pengalaman terbaik di kaki Gunung Ciremai dengan pilihan paket
              petualangan, akomodasi nyaman, dan perlengkapan lengkap.
            </p>
          </Container>
        </section>

        <div className="space-y-16 pb-16 sm:space-y-20 sm:pb-20">
          {loading && (
            <Container>
              <PackageGridSkeleton />
            </Container>
          )}

          {error && (
            <Container>
              <ErrorState message={error} onRetry={reload} />
            </Container>
          )}

          {packages &&
            CATEGORY_ORDER.map((c) => {
              const items = packages.filter((p) => p.category === c.title);
              if (items.length === 0) return null;
              return (
                <Container key={c.id}>
                  <CategorySection id={c.id} title={c.title} items={items} />
                </Container>
              );
            })}
        </div>

        <WhyVisitCiremai />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
