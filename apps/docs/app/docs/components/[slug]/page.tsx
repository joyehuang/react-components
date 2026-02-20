import { notFound } from 'next/navigation'
import { componentManifest, getComponentBySlug } from '@/lib/manifest'
import { CopyButton } from '@/components/docs/copy-button'
import { ComponentPreview } from '@/components/docs/component-preview'

type ComponentDetailProps = {
  params: Promise<{ slug: string }>
}

export default async function ComponentDetailPage(props: ComponentDetailProps) {
  const params = await props.params
  const component = getComponentBySlug(params.slug)

  if (!component) {
    notFound()
  }

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-fd-muted-foreground">{component.category}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{component.name}</h1>
        <p className="max-w-3xl text-sm text-fd-muted-foreground">{component.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-fd-border px-2 py-1 uppercase">{component.status}</span>
          {component.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-fd-secondary px-2 py-1 text-fd-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <section className="component-preview-frame rounded-xl p-4 md:p-6">
        <ComponentPreview slug={component.slug} />
      </section>

      <section className="space-y-4 rounded-xl border border-fd-border bg-fd-card p-4 md:p-6">
        <h2 className="text-xl font-semibold">Install / Copy</h2>
        <ul className="list-disc space-y-1 pl-4 text-sm text-fd-muted-foreground">
          {component.files.map((file) => (
            <li key={file}>
              <code>{file}</code>
            </li>
          ))}
        </ul>

        <div className="code-block-shell">
          <CopyButton value={component.importStatement} />
          <pre className="overflow-x-auto rounded-lg border border-fd-border bg-fd-secondary px-4 py-4 text-sm">
            <code>{component.importStatement}</code>
          </pre>
        </div>

        <div className="code-block-shell">
          <CopyButton value={component.exampleCode} />
          <pre className="overflow-x-auto rounded-lg border border-fd-border bg-fd-secondary px-4 py-4 text-sm">
            <code>{component.exampleCode}</code>
          </pre>
        </div>

        {component.dependencies.length > 0 ? (
          <div>
            <h3 className="mb-2 text-sm font-semibold">Dependencies</h3>
            <ul className="list-disc space-y-1 pl-4 text-sm text-fd-muted-foreground">
              {component.dependencies.map((dependency) => (
                <li key={dependency.name}>
                  <code>
                    {dependency.name}
                    {dependency.version ? `@${dependency.version}` : ''}
                  </code>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="space-y-4 rounded-xl border border-fd-border bg-fd-card p-4 md:p-6">
        <h2 className="text-xl font-semibold">Props</h2>
        {component.props.length === 0 ? (
          <p className="text-sm text-fd-muted-foreground">No public props.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-fd-border text-left">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Default</th>
                  <th className="py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {component.props.map((prop) => (
                  <tr key={prop.name} className="border-b border-fd-border/60 align-top">
                    <td className="py-2 pr-4">
                      <code>{prop.name}</code>
                    </td>
                    <td className="py-2 pr-4">
                      <code>{prop.type}</code>
                    </td>
                    <td className="py-2 pr-4">
                      <code>{prop.defaultValue ?? 'n/a'}</code>
                    </td>
                    <td className="py-2 text-fd-muted-foreground">{prop.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </article>
  )
}

export function generateStaticParams() {
  return componentManifest.map((component) => ({ slug: component.slug }))
}
