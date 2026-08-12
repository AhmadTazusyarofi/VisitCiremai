# VisitCiremai

Platform wisata dan perjalanan untuk kawasan Gunung Ciremai — paket pendakian, petualangan,
akomodasi, transportasi, dan sewa alat outdoor.

Repo ini adalah **npm workspaces** dengan dua paket:

```
visit-ciremai/
├── frontend/     React 19 + TypeScript + Vite 8 + Tailwind CSS v4
└── backend/      Express 5 + TypeScript + MySQL (mysql2)
```

## Prasyarat

- Node.js 20+
- MySQL — tersedia lewat XAMPP (nyalakan modul **MySQL** di XAMPP Control Panel)

## Setup pertama kali

```bash
# 1. Install semua dependensi (satu kali, dari root)
npm install

# 2. Siapkan konfigurasi backend
cp backend/.env.example backend/.env      # Windows: copy backend\.env.example backend\.env
#    lalu isi JWT_SECRET dengan string acak minimal 32 karakter:
#    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. Buat tabel database
#    Lewat phpMyAdmin: menu Import → pilih backend/db/schema.sql
#    Atau lewat terminal:
"C:\xampp\mysql\bin\mysql.exe" -u root < backend/db/schema.sql

# 4. Isi data awal (15 paket + akun admin)
npm run seed
```

## Menjalankan

Semua perintah dijalankan dari **root repo**.

| Perintah | Keterangan |
| --- | --- |
| `npm run dev` | Frontend (:5173) **dan** API (:4000) sekaligus |
| `npm run dev:web` | Frontend saja |
| `npm run dev:api` | API saja |
| `npm run build` | Build produksi kedua workspace |
| `npm run seed` | Mengisi database dengan data awal (aman diulang) |
| `npm test` | Unit test frontend (Vitest) |
| `npm run lint` | Oxlint untuk seluruh repo |

Saat dev, permintaan ke `/api` dan `/uploads` dari frontend diteruskan ke `localhost:4000`
lewat proxy Vite, sehingga keduanya berbagi origin yang sama.

## API

Semua respons berbentuk `{ "data": ... }`, sedangkan error berbentuk
`{ "error": { "message": string, "fields"?: { [field]: string } } }`.

| Endpoint | Keterangan |
| --- | --- |
| `GET /api/packages?q=&kategori=` | Daftar paket terbit; pencarian dilakukan di SQL |
| `GET /api/packages/:id` | Detail paket + `includes` + `gallery` |
| `POST /api/bookings` | Simpan pemesanan → `201 { id }` |
| `GET /api/testimonials` | Testimoni yang sudah disetujui |
| `POST /api/testimonials` | Kirim testimoni (masuk antrean moderasi) |
| `GET /api/health` | Cek kesehatan server |

Endpoint yang menulis data dibatasi rate limit (15 menit per jendela).

### Admin

Login menaruh JWT pada **cookie httpOnly** (`vc_session`), sehingga token tidak bisa dibaca
JavaScript. Seluruh `/api/admin/*` menolak permintaan tanpa cookie yang sah dengan `401`.

| Endpoint | Keterangan |
| --- | --- |
| `POST /api/auth/login` | Masuk (rate limit 10×/15 menit) |
| `POST /api/auth/logout` | Keluar |
| `GET /api/auth/me` | Memulihkan sesi saat halaman dimuat ulang |
| `POST /api/auth/password` | Ganti password |
| `GET /api/admin/bookings?status=` | Daftar pemesanan + jumlah per status |
| `PATCH /api/admin/bookings/:id` | Ubah status pemesanan |
| `GET /api/admin/testimonials?status=` | Semua testimoni + jumlah per status |
| `PATCH /api/admin/testimonials/:id` | Setujui / tolak / kembalikan |
| `DELETE /api/admin/testimonials/:id` | Hapus permanen |
| `GET`/`POST`/`PUT`/`DELETE /api/admin/packages` | CRUD paket (termasuk draf) |
| `POST /api/admin/uploads` | Unggah gambar — JPG/PNG/WEBP, maks 3 MB |

Halaman admin ada di **`/admin`** (login di `/admin/login`), semuanya `noindex`.
Akun awal dibuat oleh `npm run seed` dari `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD`
di `.env` — **ganti password setelah login pertama**.

## Struktur

```
frontend/src/
├── components/    layout/ hero/ package/ sections/ ui/ admin/
├── pages/         HomePage TentangPage PackageDetailPage
│                  SearchResultsPage NotFoundPage
│                  admin/AdminLoginPage admin/AdminDashboardPage
├── hooks/         useApiResource usePackages
├── context/       AuthContext TestimonialsContext
├── lib/           api.ts format.ts site.ts whatsapp.ts
└── types/

backend/
├── db/schema.sql          skema MySQL
├── uploads/               gambar hasil unggahan admin (tidak di-commit)
└── src/
    ├── server.ts app.ts db.ts env.ts
    ├── middleware/        auth error validate rateLimit upload
    ├── routes/            packages bookings testimonials auth admin/*
    ├── services/          query SQL per domain
    ├── seed.ts            pengisian data awal
    └── seed-data.ts       15 paket awal
```

## Database

| Tabel | Isi |
| --- | --- |
| `packages` | Paket wisata (id = slug URL) |
| `package_includes` | Daftar "Yang Termasuk" tiap paket |
| `package_gallery` | Foto tambahan tiap paket |
| `bookings` | Pemesanan masuk; judul & harga paket ikut disalin sebagai snapshot |
| `testimonials` | Testimoni dengan status `pending` / `approved` / `rejected` |
| `admins` | Akun admin (password bcrypt) |

## Deploy

- **Frontend** — Apache (XAMPP) menyajikan isi `frontend/dist/`. File `public/.htaccess` sudah
  berisi aturan SPA fallback agar URL langsung seperti `/paket/xxx` tetap termuat.
  Jika di-deploy pada subfolder, sesuaikan `RewriteBase` di `.htaccess` dan opsi `base` di
  `vite.config.ts`.
- **Backend** — jalankan sebagai proses Node terpisah (`npm start`) di port 4000. Agar frontend
  dan API tetap satu origin, tambahkan reverse proxy Apache (`mod_proxy`) untuk `/api` dan
  `/uploads` → `http://localhost:4000`. Alternatifnya, letakkan API di domain sendiri lalu
  setel `VITE_API_URL` saat build frontend.
- Jangan lupa setel `NODE_ENV=production` dan `CORS_ORIGIN` ke domain produksi di `backend/.env`.
