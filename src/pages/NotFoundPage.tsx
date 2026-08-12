import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Container } from '../components/layout/Container';
import { Button } from '../components/ui/Button';

export function NotFoundPage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <>
      <Seo title="Halaman tidak ditemukan — VisitCiremai" noindex />
      <Navbar alwaysSolid />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-bg pt-16 outline-none"
      >
        <Container className="flex flex-col items-center py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Compass aria-hidden="true" className="h-8 w-8 text-primary" />
          </div>
          <p className="mt-6 text-5xl font-bold text-ink">404</p>
          <h1 className="mt-2 text-xl font-bold text-ink">Halaman tidak ditemukan</h1>
          <p className="mt-3 max-w-md text-ink-2">
            Sepertinya jalur ini menyimpang dari peta. Halaman yang Anda cari tidak
            tersedia atau tautannya sudah berubah.
          </p>
          <div className="mt-6">
            <Button onClick={() => navigate('/')}>Kembali ke Beranda</Button>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
