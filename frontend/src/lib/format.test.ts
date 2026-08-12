import { describe, it, expect } from 'vitest'
import { formatRupiah } from './format'

describe('formatRupiah', () => {
  it('formats millions with dot separators and Rp prefix', () => {
    expect(formatRupiah(2200000)).toBe('Rp2.200.000')
  })
  it('formats small values', () => {
    expect(formatRupiah(35000)).toBe('Rp35.000')
  })
})
