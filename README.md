# RC LAB Component Workspace

A copy-first React component library built as a PNPM monorepo. Components are copied into user projects (like shadcn/ui) rather than distributed via npm packages.

## 📚 Documentation

**Quick Start**:
- **[QUICK_START.md](QUICK_START.md)** - 5-minute quick start guide

**All Documentation**:
- Browse the [documentation/](./documentation/) folder for organized docs
  - **Developer docs** (for Claude Code): [documentation/dev/](./documentation/dev/)
  - **Project management docs**: [documentation/project/](./documentation/project/)
  - See [documentation/README.md](./documentation/README.md) for complete index

**Key Developer Docs**:
- [CLAUDE.md](documentation/dev/CLAUDE.md) - Comprehensive development guide
- [EXECUTION_PLAN.md](documentation/dev/EXECUTION_PLAN.md) - Detailed task roadmap
- [CHANGELOG.md](documentation/dev/CHANGELOG.md) - Progress tracking log

## 🏗️ Monorepo Structure

- `apps/playground`: Vite sandbox for component development and preview
- `apps/docs`: Next.js + Fumadocs documentation site
- `packages/registry`: Manifest source of truth for component metadata
- `packages/ui`: Component source package (no build step)
- `packages/cli`: `rc-components` installer CLI
- `packages/quality`: Stable gate checks

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev:playground    # Component sandbox (http://localhost:5173)
pnpm dev:docs          # Documentation site (http://localhost:3000)
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

## 🎯 Current Status

**Phase**: Foundation Cleanup (Phase 1 of 2)

**Next Task**: Unify component directory structure

See [EXECUTION_PLAN.md](EXECUTION_PLAN.md) for details.

## 🏛️ Architecture Highlights

- **Registry-Driven**: `packages/registry/manifest/components.json` is single source of truth
- **Copy-First Distribution**: Users get full source code ownership
- **No Build Step**: Components exported as source for faster iteration
- **Design Tokens**: CSS variables for theming (global system coming in Task #2)
- **Quality Reference**: `CreditCard` component demonstrates all standards

## 📖 For Claude Code

If you're Claude Code working on this project:
1. Read [QUICK_START.md](QUICK_START.md) first
2. Check [CHANGELOG.md](CHANGELOG.md) for latest progress
3. Follow [EXECUTION_PLAN.md](EXECUTION_PLAN.md) for tasks
4. Reference [COMPONENT_SPEC.md](COMPONENT_SPEC.md) when coding

## 🤝 Contributing

This is a personal learning project. See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for vision and goals.
