export function formatRupiah(n: number): string {
  const rounded = Math.round(n)
  const negative = rounded < 0
  const digits = Math.abs(rounded).toString()
  const withDots = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return (negative ? '-Rp' : 'Rp') + withDots
}

const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

/** '2026-08-17' -> '17 Agustus 2026'. Mengembalikan '' bila input kosong/invalid. */
export function formatTanggal(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return ''
  const [, year, month, day] = m
  const bulan = BULAN[Number(month) - 1]
  if (!bulan) return ''
  return `${Number(day)} ${bulan} ${year}`
}

/** Tanggal hari ini dalam format 'YYYY-MM-DD' (waktu lokal). */
export function todayISO(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
