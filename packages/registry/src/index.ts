import components from '../manifest/components.json'
import { validateManifest } from './schema'
import type { ComponentCategory, ComponentManifest } from './types'

const rawManifest = components as unknown
validateManifest(rawManifest)

export const componentManifest: ComponentManifest[] = rawManifest

const categoryOrder: ComponentCategory[] = ['Cards', 'Data Visualization', 'Visual Effects', 'Text Motion']

export const componentGroups = categoryOrder
  .map((category) => ({
    category,
    components: componentManifest.filter((component) => component.category === category),
  }))
  .filter((group) => group.components.length > 0)

export const componentBySlug = new Map(componentManifest.map((component) => [component.slug, component]))

export const getComponentBySlug = (slug: string | undefined) => (slug ? componentBySlug.get(slug) : undefined)

export type ComponentSlug = (typeof componentManifest)[number]['slug']

export type {
  ComponentCategory,
  ComponentDependencySpec,
  ComponentInstallExample,
  ComponentManifest,
  ComponentPreviewTheme,
  ComponentPropDoc,
  ComponentQualityGate,
  ComponentStatus,
} from './types'
