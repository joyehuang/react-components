import { Link } from 'react-router-dom'
import { componentGroups, componentRegistry } from '../lib/component-registry'

const flowSteps = [
  {
    id: 'browse',
    title: 'Browse',
    description: 'Explore reusable component reproductions by category and interaction style.',
  },
  {
    id: 'copy',
    title: 'Copy',
    description: 'Copy TSX + CSS files directly into your own product codebase.',
  },
  {
    id: 'ship',
    title: 'Ship',
    description: 'Adjust props or color tokens and ship without third-party UI lock-in.',
  },
]

export function HomePage() {
  const featuredComponents = componentRegistry.slice(0, 4)
  const categoryCount = componentGroups.length

  return (
    <main className="home-page">
      <section className="home-hero">
        <p className="home-hero__badge">React Component Rebuild Lab</p>
        <h1 className="home-hero__title">Reusable React component reproductions, organized like a docs site.</h1>
        <p className="home-hero__description">
          This repository turns vibe-coded component clones into copy-ready building blocks with clear APIs, docs-style
          navigation, and predictable integration steps.
        </p>
        <div className="home-hero__actions">
          <Link className="site-button" to="/docs/components">
            Open Components
          </Link>
          <Link className="site-button site-button--ghost" to="/docs/getting-started">
            Getting Started
          </Link>
        </div>
      </section>

      <section className="home-metrics">
        <article className="metric-card">
          <p className="metric-card__label">Components</p>
          <p className="metric-card__value">{componentRegistry.length}</p>
        </article>
        <article className="metric-card">
          <p className="metric-card__label">Categories</p>
          <p className="metric-card__value">{categoryCount}</p>
        </article>
        <article className="metric-card">
          <p className="metric-card__label">Reuse Style</p>
          <p className="metric-card__value">Copy + Import</p>
        </article>
      </section>

      <section className="home-section">
        <header className="home-section__header">
          <h2 className="home-section__title">Featured Components</h2>
          <p className="home-section__subtitle">Open each detail page for preview, props, and copy instructions.</p>
        </header>
        <div className="feature-grid">
          {featuredComponents.map((component) => (
            <Link key={component.slug} to={`/docs/components/${component.slug}`} className="component-teaser">
              <p className="component-teaser__meta">
                <span>{component.category}</span>
                <span>{component.status}</span>
              </p>
              <h3 className="component-teaser__title">{component.name}</h3>
              <p className="component-teaser__description">{component.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <header className="home-section__header">
          <h2 className="home-section__title">Workflow</h2>
          <p className="home-section__subtitle">A consistent loop keeps the repo scalable as components grow.</p>
        </header>
        <div className="flow-grid">
          {flowSteps.map((step, index) => (
            <article key={step.id} className="flow-card">
              <p className="flow-card__index">0{index + 1}</p>
              <h3 className="flow-card__title">{step.title}</h3>
              <p className="flow-card__description">{step.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

