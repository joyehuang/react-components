import type { ReactNode } from 'react'

export type ComponentStatus = 'stable' | 'beta'

export type ComponentPreviewTheme = 'light' | 'dark'

export type ComponentCategory = 'Cards' | 'Data Visualization' | 'Text Motion' | 'Visual Effects'

export type ComponentPropDoc = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

export type ComponentMeta = {
  slug: string
  name: string
  summary: string
  category: ComponentCategory
  status: ComponentStatus
  tags: string[]
  previewTheme: ComponentPreviewTheme
  renderPreview: () => ReactNode
  importStatement: string
  exampleCode: string
  files: string[]
  installNotes: string[]
  props: ComponentPropDoc[]
  sourceDoc?: string
}

