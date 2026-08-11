import type { JSX } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Container } from './Container';
import { Button } from '../ui/Button';

const links = [
  { label: 'Beranda', href: '/#beranda' },
  { label: 'Tentang', href: '/#tentang' },
  { label: 'Paket', href: '/#paket' },
  { label: 'Kontak', href: '/#kontak' },
];

export function Navbar({ alwaysSolid = false }: { alwaysSolid?: boolean }): JSX.Element {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const solid = alwaysSolid || scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        solid ? 'bg-surface shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav aria-label="Utama">
        <Container className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <a
            href="/#beranda"
            onClick={() => setOpen(false)}
            className="flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <img
              src="/img/logo.png"
              alt="VisitCiremai"
              className="h-9 w-auto shrink-0 sm:h-10"
            />
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`text-sm font-medium transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded ${
                    solid ? 'text-ink' : 'text-white'
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button as="a" href="/#paket" variant="primary">
              Pesan Sekarang
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-lg md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              solid ? 'text-ink' : 'text-white'
            }`}
          >
            {open ? (
              <X aria-hidden="true" className="h-6 w-6" />
            ) : (
              <Menu aria-hidden="true" className="h-6 w-6" />
            )}
          </button>
        </Container>

        {/* Mobile panel */}
        <div
          id="mobile-menu"
          hidden={!open}
          className="border-t border-line bg-surface md:hidden"
        >
          <Container className="py-2">
              <ul className="flex flex-col">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-11 items-center text-base font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
                <li className="py-2">
                  <Button as="a" href="/#paket" variant="primary" className="w-full" onClick={() => setOpen(false)}>
                    Pesan Sekarang
                  </Button>
                </li>
              </ul>
            </Container>
        </div>
      </nav>
    </header>
  );
}
