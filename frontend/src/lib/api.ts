/**
 * Pembungkus tipis di atas fetch untuk berbicara dengan API VisitCiremai.
 *
 * Saat dev, `/api` diteruskan ke http://localhost:4000 lewat proxy Vite
 * (lihat vite.config.ts). Di produksi, setel VITE_API_URL bila API berada
 * pada domain yang berbeda.
 */
const BASE = import.meta.env.VITE_API_URL ?? '/api';

/** Error dari API, membawa pesan per-field bila ada. */
export class ApiError extends Error {
  readonly status: number;
  readonly fields?: Record<string, string>;

  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields;
  }
}

type ApiEnvelope<T> = { data: T; error?: never };
type ApiErrorEnvelope = {
  data?: never;
  error: { message: string; fields?: Record<string, string> };
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      credentials: 'include',
      ...init,
      headers: {
        // Hanya untuk body JSON. FormData harus dibiarkan agar browser
        // menyusun sendiri header multipart beserta boundary-nya.
        ...(typeof init?.body === 'string'
          ? { 'Content-Type': 'application/json' }
          : {}),
        ...init?.headers,
      },
    });
  } catch {
    // Jaringan mati / server belum menyala.
    throw new ApiError(
      'Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.',
      0,
    );
  }

  let body: ApiEnvelope<T> | ApiErrorEnvelope | null = null;
  try {
    body = (await res.json()) as ApiEnvelope<T> | ApiErrorEnvelope;
  } catch {
    body = null;
  }

  if (!res.ok) {
    const err = body && 'error' in body ? body.error : undefined;
    throw new ApiError(
      err?.message ?? `Permintaan gagal (${res.status}).`,
      res.status,
      err?.fields,
    );
  }

  if (!body || !('data' in body)) {
    throw new ApiError('Respons server tidak dikenali.', res.status);
  }

  return body.data as T;
}

export function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  return request<T>(path, { method: 'GET', signal });
}

export function apiPost<T>(path: string, payload: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: JSON.stringify(payload) });
}

export function apiPut<T>(path: string, payload: unknown): Promise<T> {
  return request<T>(path, { method: 'PUT', body: JSON.stringify(payload) });
}

export function apiPatch<T>(path: string, payload: unknown): Promise<T> {
  return request<T>(path, { method: 'PATCH', body: JSON.stringify(payload) });
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE' });
}

/**
 * Unggah satu berkas. Content-Type sengaja tidak diset agar browser
 * menyusun boundary multipart-nya sendiri.
 */
export function apiUpload(path: string, file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('file', file);
  return request<{ url: string }>(path, { method: 'POST', body: form });
}
