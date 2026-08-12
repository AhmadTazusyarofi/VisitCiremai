import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usePackages } from './usePackages';
import { PackageGrid } from '../components/package/PackageGrid';
import { PackageGridSkeleton } from '../components/ui/PackageCardSkeleton';

const pkg = {
  id: 'pick-up-pendaki',
  title: 'Pick Up Pendaki',
  category: 'Transportasi',
  price: 400000,
  priceUnit: 'Unit',
  duration: 'Sekali jalan',
  image: '/img/placeholder.png',
  description: 'Layanan pick up rombongan pendaki.',
};

function Harness({ kategori }: { kategori?: string }) {
  const { data, loading, error } = usePackages(kategori ? { kategori } : {});
  if (loading) return <PackageGridSkeleton />;
  if (error) return <p>{error}</p>;
  return <PackageGrid items={data ?? []} />;
}

function renderHarness(kategori?: string) {
  return render(
    <MemoryRouter>
      <Harness kategori={kategori} />
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('usePackages', () => {
  it('menampilkan skeleton lalu daftar paket dari API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: [pkg] }),
      } as Response),
    );

    renderHarness();
    expect(screen.getByText('Memuat paket…')).toBeInTheDocument();

    expect(await screen.findByText('Pick Up Pendaki')).toBeInTheDocument();
    expect(screen.getByText(/Rp400\.000/)).toBeInTheDocument();
  });

  it('mengirim filter kategori sebagai query string ke server', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: [] }),
    } as Response);
    vi.stubGlobal('fetch', fetchMock);

    renderHarness('Transportasi');

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/packages?kategori=Transportasi');
  });

  it('menampilkan pesan error saat API gagal', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: { message: 'Server sedang bermasalah.' } }),
      } as Response),
    );

    renderHarness();
    expect(await screen.findByText('Server sedang bermasalah.')).toBeInTheDocument();
  });
});
