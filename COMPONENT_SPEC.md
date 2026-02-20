# RC LAB Component Specification

This document defines the standards for all components in the RC LAB library.

## Table of Contents
1. [File Structure](#file-structure)
2. [Code Template](#code-template)
3. [TypeScript Standards](#typescript-standards)
4. [CSS Standards](#css-standards)
5. [Props Design Principles](#props-design-principles)
6. [Accessibility Requirements](#accessibility-requirements)
7. [Performance Guidelines](#performance-guidelines)
8. [Testing Standards](#testing-standards)
9. [Manifest Entry Schema](#manifest-entry-schema)

---

## File Structure

### Directory Layout

Each component must be in its own directory under `packages/ui/src/components/ui/`:

```
packages/ui/src/components/ui/
├── component-name/              # kebab-case directory name
│   ├── component-name.tsx       # Main component file
│   ├── component-name.css       # Styles (if needed)
│   ├── index.ts                 # Re-export
│   └── component-name.test.tsx  # Tests (recommended)
```

### Re-export Pattern

Every component directory must have an `index.ts`:

```typescript
export { ComponentName } from './component-name'
export type { ComponentNameProps } from './component-name'
```

### Global Export

All components must be exported from `packages/ui/src/index.ts`:

```typescript
export { ComponentName } from './components/ui/component-name'
export type { ComponentNameProps } from './components/ui/component-name'
```

---

## Code Template

### Basic Component Template

```tsx
import { forwardRef, type HTMLAttributes, type CSSProperties } from 'react'
import './component-name.css'

export type ComponentNameProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Component variant
   * @default 'default'
   */
  variant?: 'default' | 'outline' | 'ghost'

  /**
   * Component size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'

  // Add custom props here...
}

export const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  function ComponentName(
    {
      className,
      style,
      variant = 'default',
      size = 'md',
      ...rest
    },
    ref
  ) {
    // Component logic here...

    return (
      <div
        ref={ref}
        className={`component-name component-name--${variant} component-name--${size}${className ? ` ${className}` : ''}`}
        style={style}
        {...rest}
      >
        {/* Component content */}
      </div>
    )
  }
)

ComponentName.displayName = 'ComponentName'

export default ComponentName
```

### Interactive Component with State

```tsx
import { forwardRef, useState, useEffect, type HTMLAttributes } from 'react'
import './component-name.css'

export type ComponentNameProps = HTMLAttributes<HTMLDivElement> & {
  // Controlled mode
  open?: boolean
  onOpenChange?: (open: boolean) => void

  // Uncontrolled mode
  defaultOpen?: boolean
}

export const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  function ComponentName(
    {
      className,
      style,
      open,
      onOpenChange,
      defaultOpen = false,
      ...rest
    },
    ref
  ) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen)

    // Determine if controlled
    const isControlled = typeof open === 'boolean'
    const isOpen = isControlled ? open : internalOpen

    const setOpen = (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    }

    return (
      <div
        ref={ref}
        className={`component-name${isOpen ? ' is-open' : ''}${className ? ` ${className}` : ''}`}
        style={style}
        {...rest}
      >
        {/* Component content */}
      </div>
    )
  }
)

ComponentName.displayName = 'ComponentName'

export default ComponentName
```

---

## TypeScript Standards

### Type Definitions

1. **Always export prop types**: `export type ComponentNameProps = ...`
2. **Extend HTML attributes**: Inherit from `HTMLAttributes<T>` or specific element types
3. **Use JSDoc comments**: Document all props with description and @default
4. **Prefer union types over booleans**: `variant?: 'a' | 'b' | 'c'` is better than `isA?: boolean, isB?: boolean`

### Type Safety Checklist

- [ ] All props have explicit types
- [ ] Optional props have default values documented
- [ ] Callback signatures are typed
- [ ] Ref type matches forwarded element type
- [ ] No `any` types used

---

## CSS Standards

### Global Design Tokens (FUTURE)

When the global token system is established, use these tokens:

```css
:root {
  /* Colors */
  --rc-primary: #7c3aed;
  --rc-primary-dark: #5b21b6;
  --rc-background: #0a0a0a;
  --rc-surface: #1a1a1a;
  --rc-text: #f5f5f5;
  --rc-text-muted: #a1a1aa;
  --rc-border: rgba(255, 255, 255, 0.1);

  /* Spacing */
  --rc-spacing-xs: 0.25rem;
  --rc-spacing-sm: 0.5rem;
  --rc-spacing-md: 1rem;
  --rc-spacing-lg: 1.5rem;
  --rc-spacing-xl: 2rem;

  /* Borders */
  --rc-radius-sm: 0.375rem;
  --rc-radius-md: 0.5rem;
  --rc-radius-lg: 0.75rem;
  --rc-radius-xl: 1rem;
}
```

### Component CSS Pattern

```css
.component-name {
  /* Reference global tokens */
  background: var(--rc-background);
  color: var(--rc-text);
  border: 1px solid var(--rc-border);
  border-radius: var(--rc-radius-md);

  /* Component-specific variables (for fine-tuning) */
  --cn-spacing: var(--rc-spacing-md);
  --cn-accent: var(--rc-primary);

  padding: var(--cn-spacing);
}

/* Variants */
.component-name--outline {
  background: transparent;
  border: 2px solid var(--rc-primary);
}

/* States */
.component-name:hover {
  background: var(--rc-surface);
}

.component-name.is-active {
  border-color: var(--rc-primary);
}
```

### CSS Naming Conventions

- **Class names**: kebab-case, prefixed with component name (`.credit-card-...`)
- **Modifiers**: Use `--` for variants (`.button--large`)
- **States**: Use `is-` prefix (`.is-active`, `.is-disabled`)
- **Utility classes**: Single purpose, generic (`.sr-only`)

---

## Props Design Principles

### Required Props

Every component **must** support:

```typescript
{
  className?: string      // Allow style overrides
  style?: CSSProperties   // Allow inline styles
  // ...rest spread to root element
}
```

### Prop Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Boolean | Affirmative, avoid negation | `disabled`, not `enabled` |
| Callbacks | `on` prefix | `onClick`, `onOpenChange` |
| Children render props | `render` prefix | `renderHeader` |
| Size variants | `size` | `'sm' \| 'md' \| 'lg'` |
| Visual variants | `variant` | `'default' \| 'outline' \| 'ghost'` |

### Default Values

- All optional props should have sensible defaults
- Document defaults in JSDoc `@default` tag
- Prefer defaults that work in most use cases

### Controlled vs Uncontrolled

For stateful components, support both modes:

```typescript
{
  // Controlled
  value?: T
  onChange?: (value: T) => void

  // Uncontrolled
  defaultValue?: T
}
```

---

## Accessibility Requirements

### Mandatory Checklist

Every component must:

- [ ] Use semantic HTML elements (prefer `<button>` over `<div onClick>`)
- [ ] Provide text alternatives for non-text content
- [ ] Ensure keyboard navigability (Tab, Enter, Space, Escape)
- [ ] Include ARIA attributes where needed (`aria-label`, `aria-expanded`, etc.)
- [ ] Support `prefers-reduced-motion` for animations
- [ ] Meet WCAG 2.1 Level AA color contrast (4.5:1 for text)
- [ ] Have visible focus indicators

### Common Patterns

#### Interactive Non-Button Elements

```tsx
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }}
  aria-label="Descriptive label"
>
  Content
</div>
```

#### Reduced Motion

```tsx
useEffect(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (media.matches) {
    // Skip animations
    return
  }

  // Run animations
}, [])
```

```css
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    transition: none;
  }
}
```

#### Screen Reader Only Content

```tsx
<span className="sr-only">Descriptive text for screen readers</span>
```

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Performance Guidelines

### React Optimizations

- Use `useMemo` for expensive computations
- Use `useCallback` for callback props passed to children
- Consider `memo()` for components that render frequently with same props
- Avoid creating objects/functions in render (move to refs or memoize)

### Animation Performance

- Prefer CSS transforms over position changes
- Use `requestAnimationFrame` for JavaScript animations
- Debounce/throttle high-frequency events (scroll, resize, mousemove)
- Clean up event listeners and timers in `useEffect` cleanup

### Example: RAF Animation

```tsx
useEffect(() => {
  let rafId: number | null = null

  const animate = () => {
    // Animation logic
    rafId = requestAnimationFrame(animate)
  }

  rafId = requestAnimationFrame(animate)

  return () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }
  }
}, [])
```

---

## Testing Standards

### Test File Structure

```tsx
import { render, screen } from '@testing-library/react'
import { ComponentName } from './component-name'

describe('ComponentName', () => {
  it('should render with default props', () => {
    render(<ComponentName />)
    expect(screen.getByRole('...')).toBeInTheDocument()
  })

  it('should accept className prop', () => {
    const { container } = render(<ComponentName className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('should accept style prop', () => {
    const { container } = render(<ComponentName style={{ color: 'red' }} />)
    expect(container.firstChild).toHaveStyle({ color: 'red' })
  })

  it('should forward ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<ComponentName ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  // Add component-specific tests...
})
```

### Minimum Test Coverage

Every component should have tests for:
- Default rendering
- `className` override
- `style` override
- `ref` forwarding
- Main interaction flows (click, keyboard, etc.)
- Controlled/uncontrolled modes (if applicable)

---

## Manifest Entry Schema

Every component must have an entry in `packages/registry/manifest/components.json`:

```json
{
  "slug": "component-name",
  "name": "Component Name",
  "summary": "One-sentence description of what this component does and its key features.",
  "category": "Cards|Data Visualization|Visual Effects|Text Motion|Forms|Layout|Navigation|Feedback",
  "status": "stable|beta|draft",
  "tags": ["keyword1", "keyword2", "keyword3"],
  "previewTheme": "dark|light",
  "importStatement": "import { ComponentName } from '@rc-lab/ui'",
  "exampleCode": "<ComponentName variant=\"outline\" size=\"lg\" />",
  "files": [
    "components/ui/component-name/component-name.tsx",
    "components/ui/component-name/component-name.css"
  ],
  "installNotes": [
    "Installation instruction 1",
    "Installation instruction 2"
  ],
  "props": [
    {
      "name": "variant",
      "type": "'default' | 'outline' | 'ghost'",
      "defaultValue": "default",
      "description": "Visual style variant of the component"
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "defaultValue": "md",
      "description": "Size of the component"
    }
  ],
  "dependencies": [
    {
      "name": "gsap",
      "type": "dependency",
      "version": "^3.14.2"
    }
  ],
  "peerDependencies": ["react", "react-dom"],
  "a11yNotes": [
    "Supports keyboard navigation with Enter and Space keys",
    "Includes proper ARIA labels for screen readers"
  ],
  "controlledPatterns": [
    "Supports both controlled and uncontrolled modes",
    "Use 'value' and 'onChange' for controlled mode",
    "Use 'defaultValue' for uncontrolled mode"
  ],
  "knownLimitations": [
    "Animation may not work in older browsers without polyfill",
    "Requires GSAP for full functionality"
  ],
  "updatedAt": "2026-02-20",
  "examples": [
    {
      "id": "default",
      "label": "Default",
      "description": "Default component with standard configuration",
      "code": "<ComponentName />"
    },
    {
      "id": "custom",
      "label": "Custom Variant",
      "description": "Component with outline variant and large size",
      "code": "<ComponentName variant=\"outline\" size=\"lg\" />"
    }
  ]
}
```

### Manifest Field Guidelines

- **slug**: kebab-case, matches directory name
- **name**: Display name in title case
- **summary**: Single sentence, under 120 characters
- **category**: One of the predefined categories
- **status**:
  - `draft` - Work in progress, may have bugs
  - `beta` - Feature complete, needs more testing
  - `stable` - Production ready, fully tested
- **tags**: 3-5 keywords for search
- **files**: Relative to `packages/ui/src/`
- **props**: Document all public props (exclude `className`, `style`, `ref` - implied)
- **examples**: At least 2 examples showing different use cases

---

## Quality Gate Checklist

Before marking a component as `stable`:

### Code Quality
- [ ] Follows file structure standards
- [ ] Uses `forwardRef` pattern
- [ ] Has `displayName` set
- [ ] Spreads `...rest` props
- [ ] Complete TypeScript types
- [ ] No TypeScript errors or warnings

### Props API
- [ ] Accepts `className`
- [ ] Accepts `style`
- [ ] All optional props have defaults
- [ ] Controlled/uncontrolled modes work correctly (if applicable)

### Styling
- [ ] CSS variables used for theming
- [ ] Responsive design considered
- [ ] Dark/light theme compatible

### Accessibility
- [ ] Semantic HTML used
- [ ] ARIA attributes added where needed
- [ ] Keyboard navigable
- [ ] `prefers-reduced-motion` supported
- [ ] Focus indicators visible

### Performance
- [ ] No unnecessary re-renders
- [ ] Animations use RAF or CSS
- [ ] Event listeners cleaned up

### Testing
- [ ] Basic render test
- [ ] Props override tests
- [ ] Ref forwarding test
- [ ] Interaction tests (if applicable)

### Documentation
- [ ] Manifest entry complete
- [ ] Preview added to docs site
- [ ] Examples provided
- [ ] Known limitations documented

---

## Reference Implementation

**Best Example**: `packages/ui/src/components/ui/credit-card/credit-card.tsx`

This component demonstrates:
- ✅ Complete TypeScript types with JSDoc
- ✅ forwardRef + displayName
- ✅ Controlled/uncontrolled flip state
- ✅ Color theming via props
- ✅ Accessibility (keyboard, ARIA, reduced motion)
- ✅ Performance (RAF animation loop)
- ✅ Comprehensive props interface

Study this component when implementing new ones.

---

## Component Categories

Use these categories in manifest entries:

- **Cards** - Card-like containers with styling and layout
- **Data Visualization** - Charts, graphs, data displays
- **Visual Effects** - Decorative animations, backgrounds, effects
- **Text Motion** - Text animations and transitions
- **Forms** - Input fields, selectors, form controls
- **Layout** - Grid systems, containers, spacing utilities
- **Navigation** - Menus, breadcrumbs, tabs
- **Feedback** - Toasts, alerts, loading indicators
- **Overlays** - Modals, popovers, tooltips

---

## Version History

- **v0.1.0** (2026-02-20) - Initial specification based on CreditCard reference implementation
