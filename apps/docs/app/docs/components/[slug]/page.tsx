import { ComponentPreview } from '@/components/docs/component-preview'
import { CopyButton } from '@/components/docs/copy-button'
import { componentManifest, getComponentBySlug } from '@/lib/manifest'
import { notFound } from 'next/navigation'

type ComponentDetailProps = {
  params: Promise<{ slug: string }>
}

function getStatusLabel(status: string) {
  if (status === 'stable') return 'Stable'
  if (status === 'beta') return 'Beta'
  if (status === 'draft') return 'Draft'
  return status
}

export default async function ComponentDetailPage(props: ComponentDetailProps) {
  const params = await props.params
  const component = getComponentBySlug(params.slug)

  if (!component) {
    notFound()
  }

  const cliInstallCommand = `pnpm components add ${component.slug} --cwd <project-path>`

  return (
    <article className="space-y-8">
      <header className="editorial-panel rounded-2xl p-6 md:p-7">
        <p className="editorial-kicker">{component.category}</p>
        <h1 className="editorial-display mt-4 text-4xl leading-tight text-fd-foreground md:text-5xl">{component.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-fd-muted-foreground md:text-base">{component.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="component-badge">{getStatusLabel(component.status)}</span>
          {component.tags.map((tag) => (
            <span key={tag} className="component-tag">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <section className="component-section space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="editorial-display text-3xl text-fd-foreground">Live Preview</h2>
          <p className="text-xs uppercase tracking-[0.12em] text-fd-muted-foreground">Interactive</p>
        </div>
        <div className="component-preview-frame p-4 md:p-6">
          <ComponentPreview slug={component.slug} />
        </div>
      </section>

      <section className="component-section space-y-5">
        <h2 className="editorial-display text-3xl text-fd-foreground">Installation</h2>
        <p className="text-sm leading-7 text-fd-muted-foreground">
          Use CLI for the fastest setup, then copy import and example snippets directly into your project.
        </p>

        <div className="code-block-shell">
          <CopyButton value={cliInstallCommand} />
          <pre className="component-code">
            <code>{cliInstallCommand}</code>
          </pre>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-fd-muted-foreground">Files</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-fd-muted-foreground">
            {component.files.map((file) => (
              <li key={file}>
                <code>{file}</code>
              </li>
            ))}
          </ul>
        </div>

        <div className="code-block-shell">
          <CopyButton value={component.importStatement} />
          <pre className="component-code">
            <code>{component.importStatement}</code>
          </pre>
        </div>

        <div className="code-block-shell">
          <CopyButton value={component.exampleCode} />
          <pre className="component-code">
            <code>{component.exampleCode}</code>
          </pre>
        </div>

        {component.dependencies.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-fd-muted-foreground">Dependencies</h3>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-fd-muted-foreground">
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

      <section className="component-section space-y-4">
        <h2 className="editorial-display text-3xl text-fd-foreground">Props API</h2>
        {component.props.length === 0 ? (
          <p className="text-sm text-fd-muted-foreground">No configurable props are currently exposed for this component.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-fd-border">
            <table className="component-table min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">Default</th>
                  <th className="px-3 py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {component.props.map((prop) => (
                  <tr key={prop.name} className="align-top">
                    <td className="px-3 py-3">
                      <code>{prop.name}</code>
                    </td>
                    <td className="px-3 py-3">
                      <code>{prop.type}</code>
                    </td>
                    <td className="px-3 py-3">
                      <code>{prop.defaultValue ?? 'n/a'}</code>
                    </td>
                    <td className="px-3 py-3 text-fd-muted-foreground">{prop.description}</td>
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
