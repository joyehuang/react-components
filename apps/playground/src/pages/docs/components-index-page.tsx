import { Link } from 'react-router-dom'
import { componentGroups } from '../../lib/component-registry'

export function ComponentsIndexPage() {
  return (
    <article className="docs-page">
      <header className="docs-page__header">
        <p className="docs-eyebrow">Library</p>
        <h1 className="docs-page__title">Components</h1>
        <p className="docs-page__description">
          All components are documented with reusable API contracts and copy-ready source file paths.
        </p>
      </header>

      {componentGroups.map((group) => (
        <section key={group.category} className="group-section">
          <h2 className="group-section__title">{group.category}</h2>
          <div className="component-grid">
            {group.components.map((component) => (
              <Link key={component.slug} to={`/docs/components/${component.slug}`} className="component-card">
                <p className="component-card__meta">
                  <span>{component.status}</span>
                  <span>{component.tags.join(' / ')}</span>
                </p>
                <h3 className="component-card__title">{component.name}</h3>
                <p className="component-card__description">{component.summary}</p>
                <p className="component-card__cta">Read details</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </article>
  )
}

