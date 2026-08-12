import type { JSX } from 'react';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, Lock, User } from 'lucide-react';
import { Seo } from '../../components/Seo';
import { Button } from '../../components/ui/Button';
import { PageLoader } from '../../components/ui/PageLoader';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../lib/api';

const fieldClass =
  'w-full rounded-lg border border-line bg-surface py-2.5 pl-10 pr-4 text-ink placeholder:text-ink-2/60 outline-none transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30';

export function AdminLoginPage(): JSX.Element {
  const { admin, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <PageLoader />;
  if (admin) return <Navigate to="/admin" replace />;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(username, password);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from && from.startsWith('/admin') ? from : '/admin', { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Gagal masuk. Coba lagi beberapa saat lagi.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Seo title="Masuk Admin — VisitCiremai" noindex />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-screen items-center justify-center bg-bg px-4 py-12 outline-none"
      >
        <div className="w-full max-w-sm">
          <div className="text-center">
            <img
              src="/img/logo.png"
              alt="VisitCiremai"
              className="mx-auto h-10 w-auto"
            />
            <h1 className="mt-6 text-2xl font-bold text-ink">Masuk Admin</h1>
            <p className="mt-2 text-sm text-ink-2">
              Kelola pemesanan, testimoni, dan paket wisata.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-8 space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-sm"
          >
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Username
              </label>
              <div className="relative">
                <User
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-2"
                />
                <input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-2"
                />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              <LogIn aria-hidden="true" className="h-4 w-4" />
              {submitting ? 'Memproses…' : 'Masuk'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm">
            <a
              href="/"
              className="rounded text-ink-2 underline-offset-2 hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              ← Kembali ke situs
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
