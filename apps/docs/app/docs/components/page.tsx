import { ComponentCatalog } from '@/components/docs/component-catalog'
import { componentManifest } from '@/lib/manifest'

export default function ComponentsPage() {
  return (
    <article className="space-y-7">
      <header className="editorial-panel rounded-2xl p-6 md:p-7">
        <p className="editorial-kicker">Library Index</p>
        <h1 className="editorial-display mt-4 text-4xl leading-tight text-fd-foreground md:text-5xl">
          Component Directory
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-fd-muted-foreground md:text-base">
          Discover reusable UI modules with preview, API surface, and installation commands. Filter by status and
          category to find production-ready components faster.
        </p>
      </header>

      <ComponentCatalog components={componentManifest} />
    </article>
  )
}
