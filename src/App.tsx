import type { JSX } from 'react';
import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { GlassFilter } from './components/ui/GlassFilter';
import { WhatsAppFab } from './components/ui/WhatsAppFab';
import { HomePage } from './pages/HomePage';
import { PackageDetailPage } from './pages/PackageDetailPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App(): JSX.Element {
  const { pathname } = useLocation();
  const firstRender = useRef(true);

  // Move focus to the main content on route change (keyboard / screen-reader UX).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    document.getElementById('main-content')?.focus();
  }, [pathname]);

  // The booking page has its own sticky CTA, so hide the floating button there.
  const showFab = !pathname.startsWith('/paket/');

  return (
    <>
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        Lewati ke konten
      </a>

      {/* Mounted once for the whole app so the liquid-glass filter is available */}
      <GlassFilter />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cari" element={<SearchResultsPage />} />
        <Route path="/paket/:id" element={<PackageDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {showFab && <WhatsAppFab />}
    </>
  );
}
