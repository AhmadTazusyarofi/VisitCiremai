import type { JSX } from 'react';
import { Seo } from '../components/Seo';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Container } from '../components/layout/Container';
import { HeroSection } from '../components/hero/HeroSection';
import { CategorySection } from '../components/package/CategorySection';
import { WhyVisitCiremai } from '../components/sections/WhyVisitCiremai';
import { Testimonials } from '../components/sections/Testimonials';
import { CTASection } from '../components/sections/CTASection';
import { packages } from '../data/packages';
import type { Category } from '../types/package';

const CATEGORY_ORDER: { title: Category; id: string }[] = [
  { title: 'Pendakian Gunung Hutan', id: 'paket' },
  { title: 'Petualangan Lainnya', id: 'petualangan' },
  { title: 'Akomodasi', id: 'akomodasi' },
  { title: 'Transportasi', id: 'transportasi' },
  { title: 'Sewa Alat', id: 'sewa-alat' },
];

export function HomePage(): JSX.Element {
  return (
    <>
      <Seo
        title="VisitCiremai — Paket Wisata & Pendakian Gunung Ciremai"
        description="Jelajahi paket pendakian, petualangan, akomodasi, transportasi, dan sewa alat outdoor di kawasan Gunung Ciremai bersama VisitCiremai."
      />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <HeroSection />

        <section id="tentang" className="py-12 sm:py-16">
          <Container className="text-center">
            <h2 className="text-3xl font-bold text-ink">Paket dan Layanan Kami</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-ink-2">
              Temukan pengalaman terbaik di kaki Gunung Ciremai dengan pilihan paket
              petualangan, akomodasi nyaman, dan perlengkapan lengkap.
            </p>
          </Container>
        </section>

        <div className="space-y-16 pb-16 sm:space-y-20 sm:pb-20">
          {CATEGORY_ORDER.map((c) => (
            <Container key={c.id}>
              <CategorySection
                id={c.id}
                title={c.title}
                items={packages.filter((p) => p.category === c.title)}
              />
            </Container>
          ))}
        </div>

        <WhyVisitCiremai />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
