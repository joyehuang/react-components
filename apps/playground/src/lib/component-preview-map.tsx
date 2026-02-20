import type { ReactNode } from 'react'
import {
  CreditCard,
  CylindricalTextReveal,
  NeonNetwork,
  SimpleGraph,
  TextScatter,
  TextScatterBurst,
} from '@rc-lab/ui'

export type ComponentPreviewRenderer = () => ReactNode

export const componentPreviewMap: Record<string, ComponentPreviewRenderer> = {
  'credit-card': () => (
    <CreditCard
      cardNumber="1234 5678 9012 3456"
      cardholder="JOHN DOE"
      expires="12/25"
      cvv="123"
      width={500}
      maxTilt={14}
      flipDurationMs={520}
    />
  ),
  'simple-graph': () => (
    <SimpleGraph
      points={[
        { id: 'jan', label: 'Jan', value: 48.5 },
        { id: 'feb', label: 'Feb', value: -42.8, displayValue: '-42.8%' },
        { id: 'mar', label: 'Mar', value: 67.2 },
        { id: 'apr', label: 'Apr', value: 29.6 },
        { id: 'may', label: 'May', value: 73.4 },
        { id: 'jun', label: 'Jun', value: 90.1 },
      ]}
      maxWidth={860}
      height={392}
      animationDurationMs={1550}
      colors={{
        line: '#b49fff',
        lineGlow: 'rgba(180, 159, 255, 0.44)',
        pointActive: '#bcaeff',
        tooltipNegative: '#ff6a6a',
      }}
    />
  ),
  'neon-network': () => (
    <NeonNetwork
      startLabel="Start"
      restartLabel="Restart"
      fillDurationMs={2100}
      colors={{
        lineCore: '#ca47ff',
        lineGlow: 'rgba(196, 94, 255, 0.42)',
        nodeDotHighlight: '#dc6bff',
      }}
    />
  ),
  'cylindrical-text-reveal': () => (
    <CylindricalTextReveal
      lines={['EXPLORE', 'THE', 'FUTURE', 'OF', 'DESIGN']}
      hintArrow="v"
      stickyTopOffset="var(--app-header-height, 64px)"
      sectionMinHeight="200vh"
    />
  ),
  'text-scatter': () => <TextScatter text="Bounce Back." minHeight="68vh" maxWidth={980} />,
  'text-scatter-burst': () => (
    <TextScatterBurst
      text="Bounce Back."
      minHeight="68vh"
      maxWidth={980}
      triggerRadius={84}
      scatterHoldMs={1200}
      targetScatterDistance={320}
      spring={0.06}
      damping={0.86}
      explodeLerp={0.12}
      color="#f7f7f7"
      hoverColor="#ffffff"
    />
  ),
}
