import { componentManifest } from '@/lib/manifest'
import { ComponentCatalog } from '@/components/docs/component-catalog'

export default function ComponentsPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-fd-muted-foreground">Library</p>
        <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
        <p className="max-w-2xl text-sm text-fd-muted-foreground">
          Manifest-driven component catalog with searchable metadata, installation instructions, and quality status.
        </p>
      </header>
      <ComponentCatalog components={componentManifest} />
    </article>
  )
}
