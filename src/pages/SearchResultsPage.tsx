import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SearchX } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Container } from '../components/layout/Container';
import { PackageGrid } from '../components/package/PackageGrid';
import { Button } from '../components/ui/Button';
import { packages } from '../data/packages';
import type { Category } from '../types/package';

const CATEGORIES: Category[] = [
  'Pendakian Gunung Hutan',
  'Petualangan Lainnya',
  'Akomodasi',
  'Transportasi',
  'Sewa Alat',
];

const fieldClass =
  'h-11 w-full rounded-lg border border-line bg-surface px-4 text-ink placeholder:text-ink-2/60 outline-none transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30';

export function SearchResultsPage(): JSX.Element {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const q = params.get('q') ?? '';
  const kategori = params.get('kategori') ?? '';

  const [queryInput, setQueryInput] = useState(q);
  const [catInput, setCatInput] = useState(kategori);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Keep the refine form in sync when the URL query changes.
  useEffect(() => {
    setQueryInput(q);
    setCatInput(kategori);
  }, [q, kategori]);

  const results = packages.filter((p) => {
    const haystack = `${p.title} ${p.description} ${p.location ?? ''} ${p.category}`.toLowerCase();
    const matchQuery = !q || haystack.includes(q.toLowerCase());
    const matchCategory = !kategori || p.category === kategori;
    return matchQuery && matchCategory;
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = new URLSearchParams();
    if (queryInput.trim()) next.set('q', queryInput.trim());
    if (catInput) next.set('kategori', catInput);
    navigate(`/cari?${next.toString()}`);
  }

  return (
    <>
      <Seo
        title={q ? `Pencarian “${q}” — VisitCiremai` : 'Pencarian Paket — VisitCiremai'}
        noindex
      />
      <Navbar alwaysSolid />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-bg pt-16 outline-none"
      >
        <Container className="py-8 sm:py-12">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Hasil Pencarian</h1>
          <p className="mt-2 text-ink-2">
            {results.length} paket ditemukan
            {q && (
              <>
                {' '}
                untuk “<span className="text-ink">{q}</span>”
              </>
            )}
            {kategori && (
              <>
                {' '}
                di kategori <span className="text-ink">{kategori}</span>
              </>
            )}
            .
          </p>

          {/* Refine search */}
          <form
            onSubmit={handleSubmit}
            role="search"
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-2"
              />
              <label htmlFor="q2" className="sr-only">
                Cari destinasi atau paket
              </label>
              <input
                id="q2"
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Cari destinasi atau paket…"
                className={`${fieldClass} pl-10`}
              />
            </div>
            <label htmlFor="cat2" className="sr-only">
              Kategori
            </label>
            <select
              id="cat2"
              value={catInput}
              onChange={(e) => setCatInput(e.target.value)}
              className={`${fieldClass} cursor-pointer sm:w-56`}
            >
              <option value="">Semua Kategori</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Button type="submit" className="shrink-0">
              <Search aria-hidden="true" className="h-4 w-4" />
              Cari
            </Button>
          </form>

          {/* Results */}
          <div className="mt-8">
            {results.length > 0 ? (
              <PackageGrid items={results} />
            ) : (
              <div className="rounded-2xl border border-line bg-surface p-10 text-center">
                <SearchX aria-hidden="true" className="mx-auto h-10 w-10 text-ink-2" />
                <h2 className="mt-4 text-lg font-bold text-ink">
                  Tidak ada paket yang cocok
                </h2>
                <p className="mx-auto mt-2 max-w-md text-ink-2">
                  Coba gunakan kata kunci lain atau ubah pilihan kategori.
                </p>
                <div className="mt-5">
                  <Button onClick={() => navigate('/#paket')}>Lihat Semua Paket</Button>
                </div>
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
