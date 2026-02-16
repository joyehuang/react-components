const quickStart = `pnpm install
pnpm dev`

const copyFlow = `1. Open a component detail page
2. Copy listed files (tsx + css)
3. Import the component into your app
4. Tune props and color tokens`

export function GettingStartedPage() {
  return (
    <article className="docs-page">
      <header className="docs-page__header">
        <p className="docs-eyebrow">Guide</p>
        <h1 className="docs-page__title">Getting Started</h1>
        <p className="docs-page__description">
          The repo is designed for direct component reuse. Every component has a detail page with preview, props, and
          file-level copy instructions.
        </p>
      </header>

      <section className="docs-card">
        <h2 className="docs-card__title">Run this project</h2>
        <pre className="code-block">
          <code>{quickStart}</code>
        </pre>
      </section>

      <section className="docs-card">
        <h2 className="docs-card__title">Reuse a component in another project</h2>
        <pre className="code-block">
          <code>{copyFlow}</code>
        </pre>
      </section>
    </article>
  )
}

