import type { ReactNode } from 'react'
import type {
  ComponentCategory,
  ComponentManifest,
  ComponentPreviewTheme,
  ComponentPropDoc,
  ComponentStatus,
} from '@rc-lab/registry'

export type ComponentMeta = ComponentManifest & {
  renderPreview: () => ReactNode
}

export type { ComponentCategory, ComponentPreviewTheme, ComponentPropDoc, ComponentStatus }
