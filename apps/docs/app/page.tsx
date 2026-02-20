import Link from 'next/link'

const pillars = [
  {
    title: 'Live-first docs',
    description: 'Every component page includes preview, copyable code, props, and CLI install commands.',
  },
  {
    title: 'Copy-first workflow',
    description: 'Use components directly through CLI or file copy without extra boilerplate overhead.',
  },
  {
    title: 'Systemized delivery',
    description: 'Manifest, docs, CLI, and quality checks stay in sync to keep the library dependable.',
  },
]

const quickStats = [
  { value: '100%', label: 'Manifest-driven metadata' },
  { value: 'Live', label: 'Preview integration for key components' },
  { value: 'CLI', label: 'Install support built in' },
]

export default function HomePage() {
  return (
    <main className="editorial-shell mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
      <section className="editorial-panel relative overflow-hidden rounded-[1.7rem] px-6 py-8 md:px-10 md:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_35%_100%,color-mix(in_srgb,var(--color-brand-soft)_12%,transparent),transparent_50%)]" />

        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
          <div>
            <p className="editorial-kicker">RC LAB Docs</p>
            <h1 className="editorial-display mt-5 max-w-3xl text-4xl leading-[1.02] text-fd-foreground md:text-6xl">
              Build polished interfaces with reusable React components.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-fd-muted-foreground md:text-base">
              This documentation is designed for builders who want fast implementation and reliable visual quality.
              Browse components, test behavior, copy implementation, and install with CLI.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/docs/components" className="editorial-button-primary">
                Browse Components
              </Link>
              <Link href="/docs/quick-start" className="editorial-button-secondary">
                Quick Start
              </Link>
            </div>
          </div>

          <aside className="grid content-start gap-3">
            {quickStats.map((item) => (
              <article key={item.label} className="editorial-stat">
                <p className="editorial-display text-2xl text-fd-foreground">{item.value}</p>
                <p className="mt-1 text-sm text-fd-muted-foreground">{item.label}</p>
              </article>
            ))}
          </aside>
        </div>
      </section>

      <section className="mt-7 grid gap-4 md:grid-cols-3">
        {pillars.map((item) => (
          <article key={item.title} className="editorial-panel rounded-2xl p-5">
            <h2 className="editorial-display text-2xl text-fd-foreground">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-fd-muted-foreground">{item.description}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
