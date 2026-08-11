export function formatRupiah(n: number): string {
  const rounded = Math.round(n)
  const negative = rounded < 0
  const digits = Math.abs(rounded).toString()
  const withDots = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return (negative ? '-Rp' : 'Rp') + withDots
}
