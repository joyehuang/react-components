'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { ComponentManifest } from '@rc-lab/registry'

type ComponentCatalogProps = {
  components: ComponentManifest[]
}

type StatusFilter = 'all' | 'stable' | 'beta' | 'draft'

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
      <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search components, tags, or summary..."
          className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm outline-none ring-offset-2 focus-visible:ring-2"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as StatusFilter)}
          className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm outline-none ring-offset-2 focus-visible:ring-2"
        >
          <option value="all">All Status</option>
          <option value="stable">Stable</option>
          <option value="beta">Beta</option>
          <option value="draft">Draft</option>
        </select>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm outline-none ring-offset-2 focus-visible:ring-2"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === 'all' ? 'All Categories' : item}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-fd-muted-foreground">{filtered.length} components</p>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((component) => (
          <Link
            key={component.slug}
            href={`/docs/components/${component.slug}`}
            className="rounded-xl border border-fd-border bg-fd-card p-4 transition hover:-translate-y-[1px] hover:border-fd-primary/50"
          >
            <div className="mb-3 flex items-center gap-2 text-xs">
              <span className="rounded-full border border-fd-border px-2 py-0.5 uppercase">{component.status}</span>
              <span className="text-fd-muted-foreground">{component.category}</span>
            </div>
            <h3 className="text-base font-semibold">{component.name}</h3>
            <p className="mt-2 text-sm text-fd-muted-foreground">{component.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {component.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-fd-secondary px-2 py-1 text-xs text-fd-muted-foreground">
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
