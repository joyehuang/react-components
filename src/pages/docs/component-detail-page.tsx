import { Link, useParams } from 'react-router-dom'
import { getComponentBySlug } from '../../lib/component-registry'

export function ComponentDetailPage() {
  const { slug } = useParams()
  const component = getComponentBySlug(slug)

  if (!component) {
    return (
      <section className="docs-page">
        <div className="empty-state">
          <h1 className="docs-page__title">Component not found</h1>
          <p className="docs-page__description">The requested component slug does not exist in the registry.</p>
          <Link to="/docs/components" className="site-button">
            Back to components
          </Link>
        </div>
      </section>
    )
  }

  return (
    <article className="docs-page component-detail-page">
      <header className="docs-page__header">
        <p className="docs-eyebrow">{component.category}</p>
        <h1 className="docs-page__title">{component.name}</h1>
        <p className="docs-page__description">{component.summary}</p>
        <div className="chip-row">
          <span className="status-chip">{component.status}</span>
          {component.tags.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <section className="component-preview">
        <div className={`component-preview__frame ${component.previewTheme === 'dark' ? 'is-dark' : 'is-light'}`}>
          {component.renderPreview()}
        </div>
      </section>

      <section className="docs-card">
        <h2 className="docs-card__title">Install / Copy</h2>
        <p className="docs-card__description">
          This project keeps components copy-friendly. Bring over the files below and keep import paths consistent.
        </p>

        <ul className="file-list">
          {component.files.map((file) => (
            <li key={file}>
              <code>{file}</code>
            </li>
          ))}
        </ul>

        <pre className="code-block">
          <code>{component.importStatement}</code>
        </pre>

        <pre className="code-block">
          <code>{component.exampleCode}</code>
        </pre>

        {component.installNotes.length > 0 ? (
          <ul className="note-list">
            {component.installNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}

        {component.sourceDoc ? (
          <p className="source-note">
            Prompt source: <code>{component.sourceDoc}</code>
          </p>
        ) : null}
      </section>

      <section className="docs-card">
        <h2 className="docs-card__title">Props</h2>
        {component.props.length === 0 ? (
          <p className="empty-state__text">No public props. This component currently ships as a fixed interaction.</p>
        ) : (
          <div className="props-table-wrap">
            <table className="props-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Type</th>
                  <th scope="col">Default</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                {component.props.map((prop) => (
                  <tr key={prop.name}>
                    <td>
                      <code>{prop.name}</code>
                    </td>
                    <td>
                      <code>{prop.type}</code>
                    </td>
                    <td>
                      <code>{prop.defaultValue ?? 'n/a'}</code>
                    </td>
                    <td>{prop.description}</td>
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

