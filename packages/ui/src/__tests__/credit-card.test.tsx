import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CreditCard } from '../credit-card'

describe('CreditCard', () => {
  it('toggles aria-pressed in uncontrolled mode', () => {
    render(<CreditCard clickToFlip />)

    const button = screen.getByRole('button', { name: /flip card/i })
    expect(button).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onFlippedChange in controlled mode', () => {
    const onFlippedChange = vi.fn()
    render(<CreditCard clickToFlip flipped={false} onFlippedChange={onFlippedChange} />)

    const button = screen.getByRole('button', { name: /flip card/i })
    fireEvent.click(button)

    expect(onFlippedChange).toHaveBeenCalledWith(true)
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('forwards root html attributes', () => {
    render(<CreditCard data-testid="credit-card-root" id="card-root" />)
    const root = screen.getByTestId('credit-card-root')
    expect(root).toHaveAttribute('id', 'card-root')
  })
})
