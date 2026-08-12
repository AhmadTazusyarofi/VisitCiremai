import type { JSX, ReactNode } from 'react';
import { ExternalLink, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../layout/Container';
import { useAuth } from '../../context/AuthContext';

export type AdminTab = 'booking' | 'testimoni' | 'paket';

const TABS: { id: AdminTab; label: string }[] = [
  { id: 'booking', label: 'Pemesanan' },
  { id: 'testimoni', label: 'Testimoni' },
  { id: 'paket', label: 'Paket' },
];

export function AdminLayout({
  active,
  onChange,
  badges,
  children,
}: {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
  /** Angka kecil di samping label tab, mis. jumlah yang perlu ditindaklanjuti. */
  badges?: Partial<Record<AdminTab, number>>;
  children: ReactNode;
}): JSX.Element {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* z-40 — tetap di bawah Modal (z-50) agar dialog tidak tertutup header. */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/img/logo.png" alt="VisitCiremai" className="h-8 w-auto" />
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded text-sm text-ink-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:inline-flex"
            >
              Lihat situs
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </a>
            <span className="hidden text-sm text-ink-2 sm:inline">
              {admin?.username}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink transition-colors hover:bg-line/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </Container>

        <Container>
          <nav aria-label="Bagian admin" className="-mb-px flex gap-1 overflow-x-auto">
            {TABS.map((tab) => {
              const isActive = tab.id === active;
              const badge = badges?.[tab.id];
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onChange(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-ink-2 hover:text-ink'
                  }`}
                >
                  {tab.label}
                  {badge !== undefined && badge > 0 && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </Container>
      </header>

      <main id="main-content" tabIndex={-1} className="outline-none">
        <Container className="py-8">{children}</Container>
      </main>
    </div>
  );
}
