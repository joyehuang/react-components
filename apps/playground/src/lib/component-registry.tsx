import { componentManifest } from './component-manifest'
import { componentPreviewMap } from './component-preview-map'
import type { ComponentCategory, ComponentMeta } from './types'

const fallbackPreview = () => (
  <div style={{ padding: '2rem', textAlign: 'center', color: '#9aa4b2' }}>
    Preview is not configured for this component yet.
  </div>
)

export const componentRegistry: ComponentMeta[] = componentManifest.map((component) => ({
  ...component,
  renderPreview: componentPreviewMap[component.slug] ?? fallbackPreview,
}))

const categoryOrder: ComponentCategory[] = ['Cards', 'Data Visualization', 'Visual Effects', 'Text Motion']

export const componentGroups = categoryOrder
  .map((category) => ({
    category,
    components: componentRegistry.filter((component) => component.category === category),
  }))
  .filter((group) => group.components.length > 0)

export const componentBySlug = new Map(componentRegistry.map((component) => [component.slug, component]))

export const getComponentBySlug = (slug: string | undefined) => (slug ? componentBySlug.get(slug) : undefined)

export type ComponentSlug = (typeof componentRegistry)[number]['slug']
