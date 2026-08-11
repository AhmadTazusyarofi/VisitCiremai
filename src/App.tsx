import type { JSX } from 'react';
import { Route, Routes } from 'react-router-dom';
import { GlassFilter } from './components/ui/GlassFilter';
import { HomePage } from './pages/HomePage';
import { PackageDetailPage } from './pages/PackageDetailPage';

export default function App(): JSX.Element {
  return (
    <>
      {/* Mounted once for the whole app so the liquid-glass filter is available */}
      <GlassFilter />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/paket/:id" element={<PackageDetailPage />} />
      </Routes>
    </>
  );
}
