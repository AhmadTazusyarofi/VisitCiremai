import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LiquidGlass } from './LiquidGlass'

describe('LiquidGlass', () => {
  it('renders children and applies glass class', () => {
    render(<LiquidGlass>hello</LiquidGlass>)
    expect(screen.getByText('hello').className).toContain('glass')
  })
})
