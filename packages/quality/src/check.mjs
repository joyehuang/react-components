import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const manifestPath = path.resolve(__dirname, '../../registry/manifest/components.json')

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const errors = []

for (const component of manifest) {
  if (component.status !== 'stable') continue

  const prefix = `[stable:${component.slug}]`

  if (!Array.isArray(component.a11yNotes) || component.a11yNotes.length === 0) {
    errors.push(`${prefix} a11yNotes must be defined.`)
  }

  if (!Array.isArray(component.examples) || component.examples.length === 0) {
    errors.push(`${prefix} examples must be defined.`)
  }

  if (!Array.isArray(component.controlledPatterns) || component.controlledPatterns.length === 0) {
    errors.push(`${prefix} controlledPatterns must be defined.`)
  }

  if (!Array.isArray(component.props)) {
    errors.push(`${prefix} props must be an array.`)
  }
}

if (errors.length > 0) {
  for (const message of errors) {
    console.error(message)
  }
  process.exit(1)
}

console.log(`[quality] Stable gates passed for ${manifest.filter((item) => item.status === 'stable').length} components.`)
