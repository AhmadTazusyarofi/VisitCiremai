import type { JSX, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../ui/PageLoader';

/** Membungkus halaman admin; mengalihkan ke login bila sesi tidak ada. */
export function RequireAuth({ children }: { children: ReactNode }): JSX.Element {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!admin) {
    // `state.from` dipakai agar setelah login user kembali ke halaman tujuan.
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
