# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**RC LAB** is a copy-first React component library built as a PNPM monorepo. Components are copied into user projects (like shadcn/ui) rather than distributed via npm packages.

**Core Philosophy**:
- Users get full source code ownership
- Components use React 19 + TypeScript + CSS Variables
- Single source of truth: `packages/registry/manifest/components.json`

## Monorepo Structure

```
react-components/
├── apps/
│   ├── docs/              # Next.js 16 + Fumadocs documentation site
│   └── playground/        # Vite development sandbox
├── packages/
│   ├── ui/                # Component source library (no build step)
│   ├── registry/          # Manifest + metadata system
│   ├── cli/               # Component installer CLI
│   └── quality/           # Quality gate validation
└── content/               # MDX documentation content
```

## Development Commands

### Start Development Servers
```bash
pnpm dev:docs          # Start docs site (http://localhost:3000)
pnpm dev:playground    # Start component playground (http://localhost:5173)
```

### Testing & Validation
```bash
pnpm test                  # Run all tests (currently only ui package has tests)
pnpm typecheck             # TypeScript check across all packages
pnpm validate:manifest     # Validate component registry schema
pnpm quality:check         # Run quality gates for stable components
```

### CLI Usage
```bash
pnpm components list                                  # List all components
pnpm components add <slug> --cwd <path>              # Copy component files
pnpm components doctor --cwd <path>                  # Check dependencies
```

### Testing Individual Components
```bash
cd packages/ui
pnpm test                               # Run all tests
pnpm test credit-card                   # Run specific test file
pnpm test --watch                       # Watch mode
```

## Architecture Deep Dive

### 1. Registry-Driven Architecture

**`packages/registry/manifest/components.json`** is the single source of truth containing:
- Component metadata (name, summary, category, status)
- Props documentation
- File paths (relative to `packages/ui/src/`)
- Dependencies and peer dependencies
- Accessibility notes
- Installation instructions
- Code examples

Both the docs site and CLI consume this manifest:
- **Docs**: Auto-generates component detail pages, props tables, and catalog
- **CLI**: Uses file paths to copy components, shows dependencies

**Critical Rule**: When adding/modifying components, always update the manifest first.

### 2. Component File Organization (CURRENT STATE - INCONSISTENT)

**Problem**: Components are scattered across two locations:

```
packages/ui/src/components/
├── ui/
│   ├── credit-card.tsx          # ✅ New standard (kebab-case)
│   ├── credit-card.css
│   └── cylindrical-text-reveal.tsx
├── NeonNetwork.tsx              # ❌ Old pattern (PascalCase)
├── SimpleGraph.tsx              # ❌ Old pattern
├── TextScatter.tsx              # ❌ Old pattern
└── TextScatterBurst.tsx         # ❌ Old pattern
```

**Target Structure** (to be implemented):
```
packages/ui/src/components/ui/
├── credit-card/
│   ├── credit-card.tsx
│   ├── credit-card.css
│   └── index.ts                 # export { CreditCard } from './credit-card'
├── neon-network/
│   ├── neon-network.tsx
│   ├── neon-network.css
│   └── index.ts
└── ...
```

### 3. Component API Standards

**Reference Implementation**: `packages/ui/src/components/ui/credit-card.tsx`

All components should follow this pattern:
- Use `forwardRef` for ref forwarding
- Spread `...rest` props to root element
- Set `displayName` for dev tools
- Accept `className` and `style` for user overrides
- Use TypeScript with complete prop types
- Support both controlled and uncontrolled modes (when applicable)

```tsx
export const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  function ComponentName({ className, style, ...rest }, ref) {
    return (
      <div ref={ref} className={`base-class ${className || ''}`} style={style} {...rest}>
        {/* content */}
      </div>
    )
  }
)

ComponentName.displayName = 'ComponentName'
```

### 4. Styling System (Tailwind CSS)

**RC LAB uses Tailwind CSS** to align with modern React component libraries (shadcn/ui, react-bits, Aceternity UI).

**Key Decisions**:
- **Primary styling**: Tailwind utility classes
- **Complex animations**: Minimal CSS files (only for keyframes, 3D transforms, etc.)
- **Design tokens**: Defined in `tailwind.config.ts` (colors, spacing, border-radius)
- **className merging**: `cn()` utility (clsx + tailwind-merge)

**Example Pattern**:
```tsx
import { cn } from '@/lib/utils'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-rc-md px-4 py-2',
          variant === 'default' && 'bg-rc-primary text-white',
          variant === 'outline' && 'border border-rc-border',
          className // User overrides last
        )}
        {...rest}
      />
    )
  }
)
```

**Migration Status** (as of Task #2):
- All 7 existing components will be rewritten to use Tailwind CSS
- Complex animations preserved in minimal CSS files
- See [EXECUTION_PLAN.md](./EXECUTION_PLAN.md) Task #2 for migration details

### 5. Documentation Site Architecture

**Pages**:
- `/` - Homepage with hero and featured components
- `/docs` - Documentation landing page
- `/docs/components` - Searchable component catalog
- `/docs/components/[slug]` - Auto-generated component detail pages

**Key Files**:
- `apps/docs/app/docs/components/[slug]/page.tsx` - Renders component details from manifest
- `apps/docs/components/docs/component-preview.tsx` - Contains preview logic for each component
- `apps/docs/components/docs/component-catalog.tsx` - Searchable/filterable component grid

**Dynamic Generation**: Component detail pages use `generateStaticParams()` to pre-render all components from manifest at build time.

### 6. CLI Implementation

**Entry Point**: `packages/cli/src/index.mjs`

**Commands**:
- `list` - Shows all components with status and category
- `add <slug>` - Copies component files from `packages/ui/src` to target project's `src/` directory
- `doctor` - Checks if all manifest dependencies are installed in target project

**Copy Mechanism**: Reads `files` array from manifest, resolves paths relative to `packages/ui/src`, copies to `<target-cwd>/src/<relative-path>`.

## Common Workflows

### Adding a New Component

1. **Create component files** in `packages/ui/src/components/ui/<component-name>/`
2. **Export** from `packages/ui/src/index.ts`
3. **Add manifest entry** to `packages/registry/manifest/components.json` (see existing entries for schema)
4. **Add preview logic** to `apps/docs/components/docs/component-preview.tsx`
5. **Validate**: `pnpm validate:manifest`
6. **Test locally**: `pnpm dev:docs` and navigate to `/docs/components/<slug>`

### Refactoring Existing Components

When moving components to new structure:
1. Create new directory: `packages/ui/src/components/ui/<new-name>/`
2. Move `.tsx` and `.css` files
3. Create `index.ts` with re-export
4. Update manifest `files` array
5. Update imports in `packages/ui/src/index.ts`
6. Update preview in `apps/docs/components/docs/component-preview.tsx`
7. Test CLI: `pnpm components add <slug> --cwd /tmp/test-project`

## Git Commit Conventions

When making changes, commit frequently with clear messages following this pattern:

```
<type>: <subject>

<optional body>

Co-Authored-By: Claude (pa/claude-sonnet-4-5-20250929) <noreply@anthropic.com>
```

**Types**:
- `feat:` - New component or feature
- `fix:` - Bug fix
- `refactor:` - Code restructuring without functionality change
- `docs:` - Documentation changes
- `style:` - CSS/styling changes
- `test:` - Adding or modifying tests
- `chore:` - Build, config, or maintenance tasks

**Examples**:
```
refactor: migrate TextScatter to ui/ directory structure

- Move files to packages/ui/src/components/ui/text-scatter/
- Update manifest file paths
- Add index.ts re-export

Co-Authored-By: Claude (pa/claude-sonnet-4-5-20250929) <noreply@anthropic.com>
```

### ⚠️ IMPORTANT: Always Push After Committing

**After every commit, immediately push to remote:**

```bash
git push
```

**Why this matters**:
- Prevents loss of work if local machine has issues
- Keeps remote repository up to date
- Allows collaboration and review
- Ensures documentation/dev/CHANGELOG.md entries are backed up

**Recommended workflow**:
```bash
# 1. Make changes
# 2. Test changes (pnpm typecheck, pnpm test)
# 3. Stage and commit
git add .
git commit -m "type: description

Co-Authored-By: Claude (pa/claude-sonnet-4-5-20250929) <noreply@anthropic.com>"

# 4. IMMEDIATELY PUSH
git push

# 5. Update documentation/dev/CHANGELOG.md
# 6. Commit changelog update
git add documentation/dev/CHANGELOG.md
git commit -m "docs: update changelog for <task-name>"
git push
```

**Never leave unpushed commits** - Always end your work session with `git push`.

## Known Issues & Planned Improvements

See [CHANGELOG.md](./CHANGELOG.md) for ongoing refactoring work.

**Critical Issues**:
1. **Inconsistent file structure** - Components split between `ui/` and root of `components/` (Task #1)
2. **Pure CSS instead of Tailwind** - All components need migration to Tailwind CSS (Task #2)
3. **Missing code syntax highlighting** in docs (Task #4)
4. **No multi-example support** in component previews (Task #5)

**Quality Targets**:
- All components should match `CreditCard` quality level (forwardRef, TypeScript, accessibility, tests)
- Establish unified design token system
- Complete test coverage for interactive components

## Important Files to Read

- [ANALYSIS.md](../project/ANALYSIS.md) - Detailed analysis of current state and improvement roadmap
- `packages/registry/manifest/components.json` - Component metadata source of truth
- `packages/ui/src/credit-card/credit-card.tsx` - Reference implementation
- `apps/docs/app/docs/components/[slug]/page.tsx` - How docs are generated

## Package-Specific Notes

### @rc-lab/ui
- **No build step** - source files exported directly
- Entry point: `src/index.ts`
- Tests use Vitest + React Testing Library
- GSAP is the only runtime dependency (for animation components)

### @rc-lab/docs
- Next.js 16 with App Router
- Fumadocs for MDX processing
- Transpiles `@rc-lab/ui` and `@rc-lab/registry` packages via webpack config
- Custom aliases in `next.config.mjs` for direct source imports

### @rc-lab/cli
- Pure Node.js script (no build/transpilation)
- Reads manifest from `../registry/manifest/components.json`
- Copies files from `../ui/src` to target project

### @rc-lab/registry
- TypeScript source only (no build)
- Exports parsed manifest data and utility functions
- Validation script checks manifest schema integrity
