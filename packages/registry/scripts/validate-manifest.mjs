import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const VALID_STATUSES = new Set(['draft', 'beta', 'stable'])

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const manifestPath = path.resolve(__dirname, '../manifest/components.json')

const raw = fs.readFileSync(manifestPath, 'utf8')
const manifest = JSON.parse(raw)

const errors = []

if (!Array.isArray(manifest)) {
  errors.push('Manifest must be an array.')
} else {
  const seenSlugs = new Set()

  for (const [index, item] of manifest.entries()) {
    if (typeof item !== 'object' || item === null) {
      errors.push(`Entry at index ${index} must be an object.`)
      continue
    }

    const location = `Entry ${index}${item.slug ? ` (${item.slug})` : ''}`

    if (typeof item.slug !== 'string' || item.slug.length === 0) {
      errors.push(`${location}: missing slug.`)
    } else if (seenSlugs.has(item.slug)) {
      errors.push(`${location}: duplicated slug "${item.slug}".`)
    } else {
      seenSlugs.add(item.slug)
    }

    if (typeof item.name !== 'string' || item.name.length === 0) {
      errors.push(`${location}: missing name.`)
    }

    if (!VALID_STATUSES.has(item.status)) {
      errors.push(`${location}: invalid status "${item.status}".`)
    }

    if (!Array.isArray(item.files) || item.files.length === 0) {
      errors.push(`${location}: files must be a non-empty array.`)
    }

    if (!Array.isArray(item.props)) {
      errors.push(`${location}: props must be an array.`)
    }

    if (!Array.isArray(item.dependencies)) {
      errors.push(`${location}: dependencies must be an array.`)
    }

    if (!Array.isArray(item.a11yNotes) || item.a11yNotes.length === 0) {
      errors.push(`${location}: a11yNotes must contain at least one item.`)
    }

    if (typeof item.updatedAt !== 'string' || Number.isNaN(Date.parse(item.updatedAt))) {
      errors.push(`${location}: updatedAt must be an ISO-like date string.`)
    }
  }
}

if (errors.length > 0) {
  for (const message of errors) {
    console.error(`[manifest] ${message}`)
  }
  process.exit(1)
}

console.log(`[manifest] OK: ${manifest.length} components validated.`)
