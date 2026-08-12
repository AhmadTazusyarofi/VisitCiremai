/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Variabel yang wajib ada di frontend/.env. Diperiksa saat dev & build supaya
 * situs tidak terlanjur ter-deploy dengan tautan kosong.
 * VITE_API_URL sengaja tidak wajib — nilai bawaannya '/api' (satu origin).
 */
const REQUIRED_ENV = [
  'VITE_API_PROXY_TARGET',
  'VITE_SITE_NAME',
  'VITE_SITE_URL',
  'VITE_OG_IMAGE',
  'VITE_WHATSAPP_NUMBER',
  'VITE_CONTACT_PHONE',
  'VITE_CONTACT_EMAIL',
  'VITE_CONTACT_ADDRESS',
  'VITE_MAP_QUERY',
]

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Mode 'test' dilewati agar unit test tetap bisa jalan tanpa berkas .env.
  if (mode !== 'test') {
    const missing = REQUIRED_ENV.filter((key) => !env[key])
    if (missing.length > 0) {
      throw new Error(
        `\nKonfigurasi frontend/.env belum lengkap. Variabel berikut kosong:\n` +
          missing.map((k) => `  - ${k}`).join('\n') +
          `\n\nSalin frontend/.env.example menjadi frontend/.env lalu isi nilainya.\n`,
      )
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // Proxy ini membuat frontend & API berbagi origin yang sama saat dev,
      // sehingga cookie sesi admin bekerja tanpa konfigurasi CORS tambahan.
      proxy: {
        '/api': { target: env.VITE_API_PROXY_TARGET, changeOrigin: true },
        '/uploads': { target: env.VITE_API_PROXY_TARGET, changeOrigin: true },
      },
    },
    test: { environment: 'jsdom', globals: true, setupFiles: './src/test/setup.ts' },
  }
})
