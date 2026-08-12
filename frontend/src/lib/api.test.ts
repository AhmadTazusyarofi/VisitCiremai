import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiGet, apiPost } from './api';

function mockFetch(status: number, body: unknown) {
  const fn = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response);
  vi.stubGlobal('fetch', fn);
  return fn;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('apiGet', () => {
  it('membuka amplop { data } dan mengembalikan isinya', async () => {
    mockFetch(200, { data: [{ id: 'a' }] });
    await expect(apiGet('/packages')).resolves.toEqual([{ id: 'a' }]);
  });

  it('memanggil path relatif terhadap base /api', async () => {
    const fetchMock = mockFetch(200, { data: null });
    await apiGet('/packages/x');
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/packages/x');
  });

  it('melempar ApiError berisi status saat server membalas error', async () => {
    mockFetch(404, { error: { message: 'Paket tidak ditemukan.' } });
    await expect(apiGet('/packages/x')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      message: 'Paket tidak ditemukan.',
    });
  });
});

describe('apiPost', () => {
  it('meneruskan pesan error per-field dari backend', async () => {
    mockFetch(400, {
      error: {
        message: 'Data yang dikirim belum valid.',
        fields: { name: 'Nama minimal 2 karakter.' },
      },
    });

    await expect(apiPost('/bookings', { name: 'B' })).rejects.toMatchObject({
      status: 400,
      fields: { name: 'Nama minimal 2 karakter.' },
    });
  });

  it('memberi pesan ramah saat server tidak dapat dihubungi', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('failed')));

    const err = await apiPost('/bookings', {}).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(0);
    expect((err as ApiError).message).toMatch(/tidak dapat terhubung/i);
  });
});
