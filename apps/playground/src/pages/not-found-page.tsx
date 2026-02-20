import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="empty-state">
        <p className="docs-eyebrow">404</p>
        <h1 className="docs-page__title">Page not found</h1>
        <p className="docs-page__description">The route does not exist in this component lab.</p>
        <div className="home-hero__actions">
          <Link to="/" className="site-button">
            Home
          </Link>
          <Link to="/docs/components" className="site-button site-button--ghost">
            Components
          </Link>
        </div>
      </div>
    </main>
  )
}

