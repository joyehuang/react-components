'use client'

import type { ComponentManifest } from '@rc-lab/registry'
import Link from 'next/link'
import { useMemo, useState } from 'react'

type ComponentCatalogProps = {
  components: ComponentManifest[]
}

type StatusFilter = 'all' | 'stable' | 'beta' | 'draft'

function getStatusLabel(status: StatusFilter | ComponentManifest['status']) {
  if (status === 'stable') return 'Stable'
  if (status === 'beta') return 'Beta'
  if (status === 'draft') return 'Draft'
  return 'All'
}

export function ComponentCatalog({ components }: ComponentCatalogProps) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [category, setCategory] = useState('all')

  const categories = useMemo(
    () => ['all', ...new Set(components.map((component) => component.category))],
    [components],
  )

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return components.filter((component) => {
      const matchesQuery =
        normalized.length === 0 ||
        component.name.toLowerCase().includes(normalized) ||
        component.summary.toLowerCase().includes(normalized) ||
        component.tags.some((tag) => tag.toLowerCase().includes(normalized))

      const matchesStatus = status === 'all' || component.status === status
      const matchesCategory = category === 'all' || component.category === category

      return matchesQuery && matchesStatus && matchesCategory
    })
  }, [category, components, query, status])

  return (
    <div className="space-y-6">
      <section className="component-section space-y-4">
        <div className="catalog-controls">
          <label className="catalog-field">
            <span>Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, tag, or summary..."
              className="catalog-input"
            />
          </label>

          <label className="catalog-field">
            <span>Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as StatusFilter)}
              className="catalog-select"
            >
              <option value="all">All statuses</option>
              <option value="stable">Stable</option>
              <option value="beta">Beta</option>
              <option value="draft">Draft</option>
            </select>
          </label>

          <label className="catalog-field">
            <span>Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="catalog-select">
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === 'all' ? 'All categories' : item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="text-sm text-fd-muted-foreground">
          Showing <span className="font-semibold text-fd-foreground">{filtered.length}</span> of {components.length}{' '}
          components
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((component) => (
          <Link key={component.slug} href={`/docs/components/${component.slug}`} className="catalog-card group">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="component-badge">{getStatusLabel(component.status)}</span>
              <span className="text-fd-muted-foreground">{component.category}</span>
            </div>

            <h3 className="text-xl font-semibold tracking-tight text-fd-foreground">{component.name}</h3>
            <p className="mt-2 text-sm leading-7 text-fd-muted-foreground">{component.summary}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {component.tags.map((tag) => (
                <span key={tag} className="component-tag">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
