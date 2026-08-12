/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Port backend Express. Lewat proxy ini frontend dan API berbagi origin yang
// sama saat dev, sehingga cookie sesi admin (Fase 3) bekerja tanpa CORS.
const API_TARGET = 'http://localhost:4000'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: true },
      '/uploads': { target: API_TARGET, changeOrigin: true },
    },
  },
  test: { environment: 'jsdom', globals: true, setupFiles: './src/test/setup.ts' },
})
