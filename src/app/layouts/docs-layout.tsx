import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { componentGroups } from '../../lib/component-registry'

const rootNavLinkClass = ({ isActive }: { isActive: boolean }) => `docs-nav-link${isActive ? ' is-active' : ''}`

export function DocsLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className="docs-shell">
      <header className="docs-topbar">
        <div className="docs-topbar__left">
          <button
            type="button"
            className={`docs-menu-button ${isSidebarOpen ? 'is-open' : ''}`}
            onClick={() => setIsSidebarOpen((current) => !current)}
            aria-label="Toggle docs navigation"
            aria-controls="docs-sidebar"
            aria-expanded={isSidebarOpen}
          >
            <span />
            <span />
            <span />
          </button>
          <NavLink to="/" className="brand-mark" onClick={closeSidebar}>
            RC LAB
          </NavLink>
          <NavLink to="/docs/components" className="docs-topbar__link" onClick={closeSidebar}>
            Components
          </NavLink>
        </div>
        <div className="docs-topbar__right">
          <label className="docs-search">
            <span className="sr-only">Search components</span>
            <input type="search" placeholder="Search (coming soon)" disabled />
          </label>
        </div>
      </header>

      <div className="docs-body">
        <button
          type="button"
          className={`docs-overlay ${isSidebarOpen ? 'is-open' : ''}`}
          onClick={() => setIsSidebarOpen(false)}
          tabIndex={isSidebarOpen ? 0 : -1}
          aria-hidden={!isSidebarOpen}
        />

        <aside id="docs-sidebar" className={`docs-sidebar ${isSidebarOpen ? 'is-open' : ''}`} aria-label="Documentation navigation">
          <nav className="docs-nav">
            <section className="docs-nav-group">
              <p className="docs-nav-heading">Core</p>
              <NavLink to="/docs/getting-started" className={rootNavLinkClass} onClick={closeSidebar}>
                Getting Started
              </NavLink>
              <NavLink to="/docs/components" end className={rootNavLinkClass} onClick={closeSidebar}>
                All Components
              </NavLink>
            </section>

            {componentGroups.map((group) => (
              <section key={group.category} className="docs-nav-group">
                <p className="docs-nav-heading">{group.category}</p>
                {group.components.map((component) => (
                  <NavLink
                    key={component.slug}
                    to={`/docs/components/${component.slug}`}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `docs-nav-link docs-nav-link--compact${isActive ? ' is-active' : ''}`
                    }
                  >
                    {component.name}
                  </NavLink>
                ))}
              </section>
            ))}
          </nav>
        </aside>

        <main className="docs-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
