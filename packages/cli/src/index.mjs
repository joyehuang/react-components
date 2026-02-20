#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '../../..')
const manifestPath = path.resolve(__dirname, '../../registry/manifest/components.json')
const uiSourceRoot = path.resolve(__dirname, '../../ui/src')

function readManifest() {
  const raw = fs.readFileSync(manifestPath, 'utf8')
  return JSON.parse(raw)
}

function parseArgs(argv) {
  const invocationCwd = process.env.INIT_CWD ? path.resolve(process.env.INIT_CWD) : process.cwd()
  const args = [...argv]
  const flags = {
    cwd: invocationCwd,
    overwrite: false,
    dryRun: false,
  }
  const positionals = []

  while (args.length > 0) {
    const next = args.shift()
    if (!next) continue

    if (next === '--overwrite') {
      flags.overwrite = true
      continue
    }

    if (next === '--dry-run') {
      flags.dryRun = true
      continue
    }

    if (next === '--cwd') {
      const value = args.shift()
      if (!value) throw new Error('Missing value for --cwd.')
      flags.cwd = path.resolve(invocationCwd, value)
      continue
    }

    positionals.push(next)
  }

  return { positionals, flags }
}

function printUsage() {
  console.log('rc-components <command>')
  console.log('')
  console.log('Commands:')
  console.log('  list')
  console.log('  add <slug> [--cwd <path>] [--overwrite] [--dry-run]')
  console.log('  doctor [--cwd <path>]')
}

function listComponents(manifest) {
  for (const component of manifest) {
    console.log(`${component.slug.padEnd(24)} ${component.status.padEnd(6)} ${component.category}`)
  }
}

function ensureDir(targetPath) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true })
}

function copyComponent(manifest, slug, flags) {
  const component = manifest.find((item) => item.slug === slug)

  if (!component) {
    throw new Error(`Unknown component slug "${slug}". Run "rc-components list" to inspect available slugs.`)
  }

  const copied = []
  const skipped = []

  for (const relativeFile of component.files) {
    const sourcePath = path.resolve(uiSourceRoot, relativeFile)
    const destinationPath = path.resolve(flags.cwd, 'src', relativeFile)

    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Source file missing: ${sourcePath}`)
    }

    if (fs.existsSync(destinationPath) && !flags.overwrite) {
      skipped.push(destinationPath)
      continue
    }

    if (!flags.dryRun) {
      ensureDir(destinationPath)
      fs.copyFileSync(sourcePath, destinationPath)
    }
    copied.push(destinationPath)
  }

  console.log(`[add] ${component.name}`)
  if (copied.length > 0) {
    console.log('[add] Copied files:')
    for (const file of copied) console.log(`  - ${path.relative(flags.cwd, file)}`)
  }
  if (skipped.length > 0) {
    console.log('[add] Skipped existing files (use --overwrite to replace):')
    for (const file of skipped) console.log(`  - ${path.relative(flags.cwd, file)}`)
  }

  if (component.dependencies.length > 0) {
    console.log('[add] Runtime dependencies:')
    for (const dep of component.dependencies) {
      console.log(`  - ${dep.name}${dep.version ? `@${dep.version}` : ''}`)
    }
  }

  console.log(`[add] Import: ${component.importStatement}`)
}

function doctor(manifest, flags) {
  const packageJsonPath = path.resolve(flags.cwd, 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`package.json not found under ${flags.cwd}`)
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const installed = new Set([
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.peerDependencies ?? {}),
  ])

  const required = new Map()
  for (const component of manifest) {
    for (const dep of component.dependencies) {
      required.set(dep.name, dep.version ?? '')
    }
  }

  const missing = [...required.entries()].filter(([name]) => !installed.has(name))

  if (missing.length === 0) {
    console.log('[doctor] All manifest runtime dependencies are installed.')
    return
  }

  console.log('[doctor] Missing dependencies:')
  for (const [name, version] of missing) {
    console.log(`  - ${name}${version ? `@${version}` : ''}`)
  }
}

function run() {
  const { positionals, flags } = parseArgs(process.argv.slice(2))
  const manifest = readManifest()
  const [command, arg1] = positionals

  switch (command) {
    case 'list':
      listComponents(manifest)
      return
    case 'add':
      if (!arg1) throw new Error('Missing <slug> for "add" command.')
      copyComponent(manifest, arg1, flags)
      return
    case 'doctor':
      doctor(manifest, flags)
      return
    default:
      printUsage()
  }
}

try {
  run()
} catch (error) {
  console.error(`[rc-components] ${error instanceof Error ? error.message : 'Unknown error'}`)
  process.exit(1)
}
