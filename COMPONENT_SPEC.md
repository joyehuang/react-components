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

### Basic Component Template (Tailwind CSS)

```tsx
import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

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
      variant = 'default',
      size = 'md',
      ...rest
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'relative flex items-center justify-center',
          'rounded-rc-md border border-rc-border',
          'transition-colors duration-200',

          // Variants
          variant === 'default' && 'bg-rc-primary text-white hover:bg-rc-primary-dark',
          variant === 'outline' && 'bg-transparent hover:bg-rc-surface',
          variant === 'ghost' && 'border-transparent hover:bg-rc-surface',

          // Sizes
          size === 'sm' && 'h-9 px-3 text-sm',
          size === 'md' && 'h-10 px-4',
          size === 'lg' && 'h-11 px-8 text-lg',

          // User overrides
          className
        )}
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

### Interactive Component with State (Tailwind CSS)

```tsx
import { forwardRef, useState, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

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
        className={cn(
          // Base styles
          'relative rounded-rc-lg border border-rc-border',
          'transition-all duration-300',

          // State-based styles
          isOpen ? 'bg-rc-surface shadow-xl' : 'bg-rc-background shadow-md',

          // User overrides
          className
        )}
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

## Styling Standards (Tailwind CSS)

### Philosophy

**RC LAB uses Tailwind CSS** to align with modern React component libraries (shadcn/ui, react-bits, Aceternity UI).

**Styling Strategy**:
- **Primary**: Tailwind utility classes for layout, spacing, colors, and simple styles
- **Secondary**: Custom CSS files only for complex animations and effects that Tailwind can't handle
- **Goal**: Maximum customizability via `className` prop

### Tailwind Config Design Tokens

All components should reference tokens defined in `tailwind.config.ts`:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // RC LAB brand colors
        'rc-primary': {
          DEFAULT: '#7c3aed',
          dark: '#5b21b6',
          light: '#a78bfa',
        },
        'rc-background': '#0a0a0a',
        'rc-surface': '#1a1a1a',
        'rc-text': {
          DEFAULT: '#f5f5f5',
          muted: '#a1a1aa',
        },
        'rc-border': 'rgba(255, 255, 255, 0.1)',
      },
      borderRadius: {
        'rc-sm': '0.375rem',
        'rc-md': '0.5rem',
        'rc-lg': '0.75rem',
        'rc-xl': '1rem',
      },
      spacing: {
        'rc-xs': '0.25rem',
        'rc-sm': '0.5rem',
        'rc-md': '1rem',
        'rc-lg': '1.5rem',
        'rc-xl': '2rem',
      },
    },
  },
}
```

### Component Styling Pattern

#### Simple Component (Tailwind Only)

```tsx
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant = 'default', size = 'md', ...rest }, ref) {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-rc-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rc-primary',
          'disabled:pointer-events-none disabled:opacity-50',

          // Variants
          variant === 'default' && 'bg-rc-primary text-white hover:bg-rc-primary-dark',
          variant === 'outline' && 'border border-rc-border bg-transparent hover:bg-rc-surface',
          variant === 'ghost' && 'hover:bg-rc-surface',

          // Sizes
          size === 'sm' && 'h-9 px-3 text-sm',
          size === 'md' && 'h-10 px-4',
          size === 'lg' && 'h-11 px-8 text-lg',

          // User overrides
          className
        )}
        {...rest}
      />
    )
  }
)
```

**Key Points**:
- Use `cn()` utility (clsx + tailwind-merge) for className merging
- Base styles first, then variants, then sizes, then user className
- No separate CSS file needed

#### Complex Component (Tailwind + CSS)

For components with complex animations or 3D effects:

```tsx
import './credit-card.css' // Only for animations

export const CreditCard = forwardRef<HTMLDivElement, CreditCardProps>(
  function CreditCard({ className, flipped, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'relative w-[480px] h-[300px]',
          'perspective-1000', // Tailwind custom utility
          className
        )}
        {...rest}
      >
        <article
          className={cn(
            'credit-card', // CSS class for animation
            'w-full h-full rounded-2xl shadow-2xl',
            'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
            flipped && 'is-flipped'
          )}
        >
          {/* Content with Tailwind classes */}
        </article>
      </div>
    )
  }
)
```

**CSS file contains ONLY animations**:
```css
/* credit-card.css - Only keyframes and complex transforms */
.credit-card {
  transform-style: preserve-3d;
  transition: transform 520ms cubic-bezier(0.4, 0, 0.2, 1);
}

.credit-card.is-flipped {
  transform: rotateY(180deg);
}

@keyframes glare-sweep {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### cn() Utility Function

Every component should use the `cn()` utility for className merging:

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Why**:
- `clsx` - Conditional className logic
- `twMerge` - Resolves Tailwind class conflicts (e.g., `px-4` overrides `px-2`)

### Tailwind Best Practices

#### 1. Responsive Design
```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Mobile: full width, Tablet: half, Desktop: third */}
</div>
```

#### 2. Dark Mode (Prepare for Future)
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* Automatic dark mode support */}
</div>
```

#### 3. Hover/Focus States
```tsx
<button className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500">
  Button
</button>
```

#### 4. Arbitrary Values (When Needed)
```tsx
<div className="w-[480px] h-[300px]">
  {/* Custom exact values */}
</div>
```

### When to Use CSS Files vs Tailwind

| Use Case | Solution | Example |
|----------|----------|---------|
| **Layout, spacing, colors** | Tailwind classes | `flex items-center gap-4 bg-rc-primary` |
| **Simple hover/focus** | Tailwind states | `hover:bg-gray-100 focus:ring-2` |
| **Responsive design** | Tailwind breakpoints | `w-full md:w-1/2 lg:w-1/3` |
| **Component variants** | Conditional Tailwind | `variant === 'outline' && 'border-2'` |
| **Keyframe animations** | CSS file | `@keyframes slide-in` |
| **3D transforms** | CSS file | `transform-style: preserve-3d` |
| **Complex filters/effects** | CSS file | `backdrop-filter: blur(10px)` |
| **requestAnimationFrame logic** | TypeScript + CSS vars | Update CSS variables from TS |

### Migration Strategy for Existing Components

When migrating from pure CSS to Tailwind:

1. **Identify styles**:
   - Layout/spacing → Tailwind classes
   - Colors → Tailwind color tokens
   - Simple states → Tailwind hover/focus
   - Complex animations → Keep in CSS

2. **Refactor incrementally**:
   ```tsx
   // Before
   <div className="card card--large card--primary">

   // After
   <div className={cn(
     'rounded-lg shadow-xl p-6', // Tailwind
     'bg-rc-primary text-white', // Tokens
     size === 'large' && 'p-8 text-lg'
   )}>
   ```

3. **Test thoroughly**:
   - Visual appearance matches
   - Animations still work
   - Responsive behavior correct

### CSS Naming Conventions (When CSS Files Are Needed)

- **Animation classes**: Descriptive names (`.fade-in`, `.slide-up`)
- **State classes**: Use `is-` prefix (`.is-flipped`, `.is-active`)
- **Avoid presentational classes**: Use Tailwind instead of `.text-center`, `.mt-4`

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
