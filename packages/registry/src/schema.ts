import type { ComponentManifest, ComponentStatus } from './types'

const VALID_STATUSES: ComponentStatus[] = ['draft', 'beta', 'stable']

export function collectManifestErrors(manifest: unknown): string[] {
  const errors: string[] = []

  if (!Array.isArray(manifest)) {
    return ['Manifest must be an array.']
  }

  const seenSlugs = new Set<string>()

  manifest.forEach((item, index) => {
    if (typeof item !== 'object' || item === null) {
      errors.push(`Entry at index ${index} must be an object.`)
      return
    }

    const entry = item as Partial<ComponentManifest>
    const location = `Entry ${index}${entry.slug ? ` (${entry.slug})` : ''}`

    if (!entry.slug || typeof entry.slug !== 'string') {
      errors.push(`${location}: "slug" is required and must be a string.`)
    } else if (seenSlugs.has(entry.slug)) {
      errors.push(`${location}: duplicated slug "${entry.slug}".`)
    } else {
      seenSlugs.add(entry.slug)
    }

    if (!entry.name || typeof entry.name !== 'string') {
      errors.push(`${location}: "name" is required and must be a string.`)
    }

    if (!entry.category || typeof entry.category !== 'string') {
      errors.push(`${location}: "category" is required and must be a string.`)
    }

    if (!entry.status || !VALID_STATUSES.includes(entry.status as ComponentStatus)) {
      errors.push(`${location}: "status" must be one of ${VALID_STATUSES.join(', ')}.`)
    }

    if (!Array.isArray(entry.files) || entry.files.length === 0) {
      errors.push(`${location}: "files" must contain at least one path.`)
    }

    if (!Array.isArray(entry.props)) {
      errors.push(`${location}: "props" must be an array.`)
    }

    if (!Array.isArray(entry.dependencies)) {
      errors.push(`${location}: "dependencies" must be an array.`)
    }

    if (!Array.isArray(entry.a11yNotes) || entry.a11yNotes.length === 0) {
      errors.push(`${location}: "a11yNotes" must contain at least one item.`)
    }

    if (!entry.updatedAt || Number.isNaN(Date.parse(entry.updatedAt))) {
      errors.push(`${location}: "updatedAt" must be a valid date string.`)
    }

    if (entry.status === 'stable') {
      if (!Array.isArray(entry.controlledPatterns) || entry.controlledPatterns.length === 0) {
        errors.push(`${location}: stable components need at least one controlledPatterns note.`)
      }
      if (!Array.isArray(entry.examples) || entry.examples.length === 0) {
        errors.push(`${location}: stable components need at least one example.`)
      }
    }
  })

  return errors
}

export function validateManifest(manifest: unknown): asserts manifest is ComponentManifest[] {
  const errors = collectManifestErrors(manifest)

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }
}
