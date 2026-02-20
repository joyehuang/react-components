import { componentManifest } from '@rc-lab/registry'

export { componentManifest }

export const componentBySlug = new Map(componentManifest.map((component) => [component.slug, component]))

export const componentCategories = [...new Set(componentManifest.map((component) => component.category))]

export const getComponentBySlug = (slug: string) => componentBySlug.get(slug)
