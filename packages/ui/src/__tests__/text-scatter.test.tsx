import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TextScatter } from '../components/ui/text-scatter'

describe('TextScatter', () => {
  it('renders text content from props', () => {
    render(<TextScatter text="Hello UI" />)
    expect(screen.getByText('H')).toBeInTheDocument()
    expect(screen.getByText('e')).toBeInTheDocument()
  })

  it('applies configurable style tokens', () => {
    render(
      <TextScatter
        data-testid="scatter-root"
        minHeight={400}
        maxWidth={640}
        color="#111111"
        hoverColor="#222222"
      />,
    )

    const root = screen.getByTestId('scatter-root')
    expect(root).toHaveStyle('--ts-min-height: 400px')
    expect(root).toHaveStyle('--ts-max-width: 640px')
    expect(root).toHaveStyle('--ts-char-color: #111111')
    expect(root).toHaveStyle('--ts-char-hover-color: #222222')
  })
})
