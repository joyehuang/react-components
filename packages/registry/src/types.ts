export type ComponentStatus = 'draft' | 'beta' | 'stable'

export type ComponentPreviewTheme = 'light' | 'dark'

export type ComponentCategory = 'Cards' | 'Data Visualization' | 'Text Motion' | 'Visual Effects'

export type DependencyKind = 'dependency' | 'peerDependency'

export type ComponentDependencySpec = {
  name: string
  type: DependencyKind
  version?: string
}

export type ComponentPropDoc = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

export type ComponentInstallExample = {
  id: string
  label: string
  description?: string
  code: string
}

export type ComponentManifest = {
  slug: string
  name: string
  summary: string
  category: ComponentCategory
  status: ComponentStatus
  tags: string[]
  previewTheme: ComponentPreviewTheme
  importStatement: string
  exampleCode: string
  files: string[]
  installNotes: string[]
  props: ComponentPropDoc[]
  dependencies: ComponentDependencySpec[]
  peerDependencies: string[]
  a11yNotes: string[]
  controlledPatterns: string[]
  knownLimitations: string[]
  updatedAt: string
  sourceDoc?: string
  examples: ComponentInstallExample[]
}

export type ComponentQualityGate = ComponentStatus
