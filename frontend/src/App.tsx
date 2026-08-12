import type { JSX } from 'react';
import { Suspense, lazy, useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { RequireAuth } from './components/admin/RequireAuth';
import { GlassFilter } from './components/ui/GlassFilter';
import { PageLoader } from './components/ui/PageLoader';
import { WhatsAppFab } from './components/ui/WhatsAppFab';
import { HomePage } from './pages/HomePage';

// Beranda dimuat langsung (halaman masuk utama); sisanya dipecah per route
// supaya bundle awal tetap ringan.
const TentangPage = lazy(() =>
  import('./pages/TentangPage').then((m) => ({ default: m.TentangPage })),
);
const PackageDetailPage = lazy(() =>
  import('./pages/PackageDetailPage').then((m) => ({ default: m.PackageDetailPage })),
);
const SearchResultsPage = lazy(() =>
  import('./pages/SearchResultsPage').then((m) => ({ default: m.SearchResultsPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);
const AdminLoginPage = lazy(() =>
  import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })),
);
const AdminDashboardPage = lazy(() =>
  import('./pages/admin/AdminDashboardPage').then((m) => ({
    default: m.AdminDashboardPage,
  })),
);

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

  // Sembunyikan tombol WhatsApp di halaman booking (sudah punya sticky CTA
  // sendiri) dan di seluruh halaman admin.
  const showFab = !pathname.startsWith('/paket/') && !pathname.startsWith('/admin');

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

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tentang" element={<TentangPage />} />
          <Route path="/cari" element={<SearchResultsPage />} />
          <Route path="/paket/:id" element={<PackageDetailPage />} />

          {/* Admin — dilindungi cookie sesi, tidak diindeks mesin pencari */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminDashboardPage />
              </RequireAuth>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      {showFab && <WhatsAppFab />}
    </>
  );
}
