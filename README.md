# RC LAB Component Workspace

Monorepo for a copy-first React component library:

- `apps/playground`: Vite sandbox for component development and preview.
- `apps/docs`: Next.js + Fumadocs documentation site.
- `packages/registry`: Manifest source of truth for component metadata.
- `packages/ui`: Component source package.
- `packages/cli`: `rc-components` installer CLI.
- `packages/quality`: Stable gate checks.

## Quick Start

```bash
pnpm install
pnpm dev:playground
pnpm dev:docs
```

## Workspace Commands

```bash
# all packages
pnpm build
pnpm typecheck
pnpm test

# manifest + quality gates
pnpm validate:manifest
pnpm quality:check
```

## CLI Commands

Run from workspace root:

```bash
pnpm --filter @rc-lab/cli components list
pnpm --filter @rc-lab/cli components add credit-card --cwd C:/path/to/app
pnpm --filter @rc-lab/cli components doctor --cwd C:/path/to/app
```

## Architecture Notes

- Single source of truth: `packages/registry/manifest/components.json`
- Docs and CLI both consume the manifest.
- Preferred component API: named exports from `@rc-lab/ui`.
- Pilot quality migration target: `CreditCard` and `TextScatter`.
