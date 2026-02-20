'use client'

import {
  CreditCard,
  CylindricalTextReveal,
  NeonNetwork,
  SimpleGraph,
  TextScatter,
  TextScatterBurst,
} from '@rc-lab/ui'

type ComponentPreviewProps = {
  slug: string
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed border-fd-border bg-fd-muted p-6 text-sm text-fd-muted-foreground">
      {label}
    </div>
  )
}

export function ComponentPreview({ slug }: ComponentPreviewProps) {
  if (slug === 'credit-card') {
    return (
      <div className="mx-auto max-w-[540px]">
        <CreditCard width={500} maxTilt={14} />
      </div>
    )
  }

  if (slug === 'simple-graph') {
    return (
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
      />
    )
  }

  if (slug === 'neon-network') {
    return <NeonNetwork autoStart showControls={false} fillDurationMs={1800} />
  }

  if (slug === 'text-scatter') {
    return <TextScatter text="Bounce Back." minHeight={300} maxWidth={760} triggerRadius={120} />
  }

  if (slug === 'text-scatter-burst') {
    return (
      <TextScatterBurst
        text="Bounce Back."
        minHeight={300}
        maxWidth={760}
        triggerRadius={84}
        scatterHoldMs={1200}
      />
    )
  }

  if (slug === 'cylindrical-text-reveal') {
    return (
      <div className="relative overflow-hidden rounded-xl">
        <CylindricalTextReveal
          lines={['EXPLORE', 'THE', 'FUTURE']}
          showHint={false}
          sectionMinHeight="120vh"
          stickyTopOffset="0px"
        />
      </div>
    )
  }

  return <Placeholder label="Preview unavailable for this component." />
}
