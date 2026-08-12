import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ApiError, apiGet, apiPost } from '../lib/api';

export type Admin = { id: number; username: string };

type AuthCtx = {
  admin: Admin | null;
  /** true selama sesi yang tersimpan sedang dipulihkan. */
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  // Token disimpan di cookie httpOnly yang tidak terbaca JavaScript, jadi
  // status login dipulihkan dengan menanyakannya ke server.
  useEffect(() => {
    const controller = new AbortController();

    apiGet<Admin>('/auth/me', controller.signal)
      .then((me) => {
        if (!controller.signal.aborted) setAdmin(me);
      })
      .catch(() => {
        // 401 = belum login. Bukan kondisi error yang perlu ditampilkan.
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const me = await apiPost<Admin>('/auth/login', { username, password });
    setAdmin(me);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiPost('/auth/logout', {});
    } catch (err) {
      // Sesi mungkin sudah kedaluwarsa di server — tetap keluar di sisi klien.
      if (!(err instanceof ApiError)) throw err;
    }
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
