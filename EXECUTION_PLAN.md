# RC LAB Refactoring Execution Plan

## Overview

This document outlines the step-by-step plan to refactor the RC LAB component library to production-ready standards, then build automation tools (3 Skills) for rapid component development.

---

## Phase 1: Foundation Cleanup (Priority: CRITICAL)

**Goal**: Establish consistent, high-quality foundation before automation.

**Estimated Time**: 1-2 weeks

### Task 1: Unify Component Directory Structure ⭐ START HERE

**Why First**: All other tasks depend on knowing where files are located.

**Current State**:
```
packages/ui/src/components/
├── ui/
│   ├── credit-card.tsx          ✅ New standard
│   └── cylindrical-text-reveal.tsx
├── NeonNetwork.tsx              ❌ Old pattern
├── SimpleGraph.tsx              ❌ Old pattern
├── TextScatter.tsx              ❌ Old pattern
└── TextScatterBurst.tsx         ❌ Old pattern
```

**Target State**:
```
packages/ui/src/components/ui/
├── credit-card/
│   ├── credit-card.tsx
│   ├── credit-card.css
│   ├── index.ts
│   └── credit-card.test.tsx
├── cylindrical-text-reveal/
├── neon-network/
├── simple-graph/
├── text-scatter/
├── text-scatter-burst/
└── scroll-3d-headline/
```

**Steps**:
1. Create directory for each component
2. Move `.tsx` and `.css` files
3. Create `index.ts` with re-export
4. Update `packages/ui/src/index.ts`
5. Update manifest `files` paths
6. Update `apps/docs/components/docs/component-preview.tsx` imports
7. Test CLI: `pnpm components add <slug>`
8. Delete old file locations
9. Run `pnpm typecheck` to catch import errors
10. Commit: `refactor: migrate all components to unified directory structure`
11. **Push immediately**: `git push`

**Success Criteria**:
- ✅ All components in `ui/<component-name>/` directories
- ✅ All imports work
- ✅ CLI can copy components
- ✅ Docs site renders all previews
- ✅ No TypeScript errors

---

### Task 2: Migrate to Tailwind CSS and Establish Design System

**Depends On**: Task 1 (need unified structure first)

**Current Problem**: Components use pure CSS with isolated variables, inconsistent with modern React component libraries (shadcn/ui, react-bits, Aceternity UI all use Tailwind CSS).

**Solution**: Migrate all 7 components to Tailwind CSS with global design tokens.

**Why Tailwind CSS**:
- Aligns with shadcn/ui and all modern component libraries
- Easier user customization via `className` prop
- Future component-builder skill will generate Tailwind code
- Industry standard for copy-paste component libraries

**Pre-requisites Check**:
```bash
# Verify Tailwind is installed in all needed packages
pnpm --filter @rc-lab/ui add -D tailwindcss postcss autoprefixer
pnpm --filter @rc-lab/docs add -D tailwindcss postcss autoprefixer
pnpm --filter @rc-lab/playground add -D tailwindcss postcss autoprefixer

# Install utilities
pnpm --filter @rc-lab/ui add clsx tailwind-merge
```

**Steps**:

#### Part A: Setup Tailwind Config (1-2 hours)

1. **Create `tailwind.config.ts` in packages/ui/**:
   ```typescript
   import type { Config } from 'tailwindcss'

   export default {
     content: ['./src/**/*.{ts,tsx}'],
     theme: {
       extend: {
         colors: {
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
     plugins: [],
   } satisfies Config
   ```

2. **Create `lib/utils.ts` with cn() helper**:
   ```typescript
   import { clsx, type ClassValue } from 'clsx'
   import { twMerge } from 'tailwind-merge'

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs))
   }
   ```

3. **Update `packages/ui/src/index.ts`** to export utils:
   ```typescript
   export { cn } from './lib/utils'
   ```

4. **Commit**: `feat: add Tailwind CSS configuration and cn() utility`
5. **Push**: `git push`

#### Part B: Migrate Components (2-3 days)

Rewrite each component from pure CSS to Tailwind CSS. **Order (easiest to hardest)**:

**Day 1 - Simple Components**:

6. **Migrate Scroll3DHeadline** (no complex state):
   - Remove CSS file entirely
   - Convert all styles to Tailwind classes
   - Test in playground
   - Commit: `refactor(scroll-3d-headline): migrate to Tailwind CSS`
   - Push: `git push`

7. **Migrate SimpleGraph**:
   - Keep SVG-related CSS in separate file
   - Convert container/layout styles to Tailwind
   - Keep animation keyframes in CSS if needed
   - Commit: `refactor(simple-graph): migrate to Tailwind CSS`
   - Push: `git push`

8. **Migrate NeonNetwork**:
   - Keep SVG path animations in CSS
   - Convert button/container styles to Tailwind
   - Test animation still works
   - Commit: `refactor(neon-network): migrate to Tailwind CSS`
   - Push: `git push`

**Day 2 - Medium Complexity**:

9. **Migrate TextScatter**:
   - Convert layout to Tailwind
   - Keep physics-based transform in inline styles (controlled by JS)
   - Commit: `refactor(text-scatter): migrate to Tailwind CSS`
   - Push: `git push`

10. **Migrate TextScatterBurst**:
    - Similar to TextScatter
    - Keep transform animations
    - Commit: `refactor(text-scatter-burst): migrate to Tailwind CSS`
    - Push: `git push`

**Day 3 - Complex Components**:

11. **Migrate CreditCard** (most complex):
    - Convert base styles to Tailwind
    - Keep 3D transform/flip animation in CSS
    - Keep glare effect in CSS
    - Test controlled/uncontrolled modes
    - Commit: `refactor(credit-card): migrate to Tailwind CSS`
    - Push: `git push`

12. **Migrate CylindricalTextReveal**:
    - Convert container to Tailwind
    - Keep 3D cylinder transform in CSS
    - Keep ScrollTrigger animations
    - Commit: `refactor(cylindrical-text-reveal): migrate to Tailwind CSS`
    - Push: `git push`

#### Part C: Documentation & Cleanup

13. **Update docs site** to use new Tailwind tokens:
    - Update global styles
    - Test component previews render correctly
    - Commit: `style(docs): update to use Tailwind design tokens`
    - Push: `git push`

14. **Create token showcase page**:
    - Add `/docs/design-tokens` page
    - Show color palette
    - Show spacing scale
    - Show border radius options
    - Commit: `docs: add design tokens showcase page`
    - Push: `git push`

15. **Update manifest entries**:
    - Update installation notes (mention Tailwind requirement)
    - Update examples with new className patterns
    - Commit: `docs: update manifest for Tailwind migration`
    - Push: `git push`

16. **Final testing**:
    - Test all components in playground
    - Test all components in docs
    - Test CLI still copies files correctly
    - Run `pnpm typecheck` and `pnpm test`

17. **Final commit**: `feat: complete migration to Tailwind CSS`
18. **Push**: `git push`

**Success Criteria**:
- ✅ All 7 components use Tailwind CSS for primary styling
- ✅ Complex animations preserved in minimal CSS files
- ✅ All components use `cn()` utility
- ✅ Tailwind config has RC LAB design tokens
- ✅ All components render identically to before
- ✅ No TypeScript errors
- ✅ All tests pass
- ✅ Documentation updated
- ✅ Token showcase page created

**Estimated Time**: 2-3 days (depending on complexity discoveries)

---

### Task 3: Audit and Standardize Component APIs

**Depends On**: Task 1 (need unified structure)

**Goal**: Ensure all components follow the standard pattern from COMPONENT_SPEC.md.

**Reference**: `packages/ui/src/components/ui/credit-card/credit-card.tsx`

**Checklist Per Component**:
- [ ] Uses `forwardRef`
- [ ] Has `displayName` set
- [ ] Spreads `...rest` props to root element
- [ ] Accepts `className` prop
- [ ] Accepts `style` prop
- [ ] Has complete TypeScript types
- [ ] Props have JSDoc comments
- [ ] Default values documented

**Components to Review**:
1. ✅ credit-card (already compliant)
2. ❓ cylindrical-text-reveal
3. ❓ neon-network
4. ❓ simple-graph
5. ❓ text-scatter
6. ❓ text-scatter-burst
7. ❓ scroll-3d-headline

**Steps**:
1. Open each component file
2. Compare against checklist
3. Update component to match standards
4. Update manifest if props changed
5. Test in playground
6. Commit per component: `refactor(component-name): standardize API`

**Success Criteria**:
- ✅ All components pass checklist
- ✅ Consistent API across all components
- ✅ TypeScript types complete
- ✅ No breaking changes (backward compatible)

---

### Task 4: Add Syntax Highlighting to Documentation

**Independent Task** (can run parallel with others)

**Current State**: Code blocks are plain text
**Target**: Syntax-highlighted TypeScript/JSX code

**Steps**:
1. Install Shiki: `pnpm --filter @rc-lab/docs add shiki`
2. Create utility function in `apps/docs/lib/syntax-highlight.ts`:
   ```tsx
   import { codeToHtml } from 'shiki'

   export async function highlightCode(code: string, lang: string) {
     return await codeToHtml(code, {
       lang,
       theme: 'github-dark'
     })
   }
   ```
3. Update `apps/docs/app/docs/components/[slug]/page.tsx`:
   ```tsx
   // Server component can use async
   const highlightedCode = await highlightCode(component.exampleCode, 'tsx')

   <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
   ```
4. Add CSS for code block styling
5. Test with multiple components
6. Commit: `feat(docs): add syntax highlighting with Shiki`
7. **Push immediately**: `git push`

**Success Criteria**:
- ✅ All code blocks have syntax colors
- ✅ Theme matches overall design
- ✅ Copy button still works
- ✅ No performance regression

---

### Task 5: Implement Multi-Example Support

**Depends On**: Task 4 (for syntax highlighting examples)

**Current State**: One preview per component
**Target**: Tabs showing multiple variations

**Manifest Already Has**:
```json
"examples": [
  {
    "id": "default",
    "label": "Default",
    "description": "Default card with pointer tilt.",
    "code": "<CreditCard />"
  },
  {
    "id": "controlled",
    "label": "Controlled",
    "description": "Controlled card managed from parent.",
    "code": "<CreditCard flipped={isFlipped} onFlippedChange={setIsFlipped} />"
  }
]
```

**Steps**:
1. Install tabs component or create custom
2. Update `ComponentPreview` to accept `variantId` prop
3. Update component detail page to render tabs:
   ```tsx
   <Tabs defaultValue={examples[0].id}>
     <TabsList>
       {examples.map(ex => <TabsTrigger>{ex.label}</TabsTrigger>)}
     </TabsList>
     {examples.map(ex => (
       <TabsContent>
         <ComponentPreview slug={slug} variantId={ex.id} />
         <CodeBlock code={ex.code} />
       </TabsContent>
     ))}
   </Tabs>
   ```
4. Update `ComponentPreview.tsx` to handle variants
5. Add examples to manifest for all components
6. Commit: `feat(docs): add multi-example support with tabs`
7. **Push immediately**: `git push`

**Success Criteria**:
- ✅ Multiple examples render in tabs
- ✅ Code syncs with preview
- ✅ Smooth switching between variants
- ✅ All components have at least 2 examples

---

### Task 6: Add Comprehensive Tests

**Independent Task** (can run parallel)

**Current State**: Only CreditCard and TextScatter have tests
**Target**: All components have basic test coverage

**Test Template**:
```tsx
describe('ComponentName', () => {
  it('renders with default props', () => { ... })
  it('accepts className prop', () => { ... })
  it('accepts style prop', () => { ... })
  it('forwards ref', () => { ... })
  // Component-specific tests...
})
```

**Steps**:
1. Create test file for each untested component:
   - `neon-network.test.tsx`
   - `simple-graph.test.tsx`
   - `text-scatter-burst.test.tsx`
   - `cylindrical-text-reveal.test.tsx`
   - `scroll-3d-headline.test.tsx`
2. Run tests: `pnpm --filter @rc-lab/ui test`
3. Fix any failures
4. Commit per component: `test(component-name): add comprehensive tests`

**Success Criteria**:
- ✅ All components have test files
- ✅ Tests cover: render, className, style, ref
- ✅ All tests pass
- ✅ Coverage >= 80%

---

## Phase 2: Automation Tools (3 Skills)

**Depends On**: Tasks 1, 2, 3 (foundation must be solid)

**Estimated Time**: 1-2 weeks

### Task 7: Create `component-builder` Skill

**Purpose**: Convert external designs/code into RC LAB components

**Steps**:
1. Create `.agents/component-builder/`
2. Write detailed `instructions.md`:
   - Reference COMPONENT_SPEC.md
   - Define input formats (screenshot, URL, code)
   - Specify output structure
   - Include examples
3. Create template files:
   - `templates/component.tsx.template`
   - `templates/component.css.template`
   - `templates/component.test.tsx.template`
4. Test with simple component (Button)
5. Test with complex component (Animated Card)
6. Document usage in README
7. Commit: `feat: add component-builder skill for automated component creation`
8. **Push immediately**: `git push`

**Success Criteria**:
- ✅ Skill can generate components from screenshots
- ✅ Skill can convert external library code
- ✅ Generated code follows COMPONENT_SPEC.md
- ✅ Output passes component-checker (Task 8)

---

### Task 8: Create `component-checker` Skill

**Purpose**: Validate components against quality standards

**Steps**:
1. Create `.agents/component-checker/`
2. Write `instructions.md` with checklist:
   - File structure checks
   - Code pattern checks (forwardRef, displayName, etc.)
   - TypeScript type checks
   - CSS token usage checks
   - Accessibility checks
   - Performance checks
3. Define scoring system (0-100)
4. Define quality tiers (S/A/B/C/F)
5. Create report template
6. Test on all existing components
7. Generate baseline quality report
8. Commit: `feat: add component-checker skill for quality validation`
9. **Push immediately**: `git push`

**Success Criteria**:
- ✅ Can check file structure automatically
- ✅ Can validate code patterns with Grep/Read
- ✅ Generates detailed reports with scores
- ✅ CreditCard scores 95+ (S tier)

---

### Task 9: Create `doc-integrator` Skill

**Purpose**: Automate component integration into docs

**Steps**:
1. Create `.agents/doc-integrator/`
2. Write `instructions.md`:
   - Read component source to extract props
   - Generate manifest entry
   - Update ComponentPreview
   - Update exports
   - Run validation
3. Create manifest entry template
4. Test with new component
5. Verify all changes work
6. Commit: `feat: add doc-integrator skill for automated documentation`
7. **Push immediately**: `git push`

**Success Criteria**:
- ✅ Can update manifest automatically
- ✅ Can add preview logic
- ✅ Can update exports
- ✅ Validates changes before completing
- ✅ Component appears in docs immediately

---

## Phase 3: Production Workflow

**Goal**: Use the 3 Skills together to rapidly add components

**Workflow**:
```bash
# 1. Find inspiration
User: "I want to add this Particles Background effect [link]"

# 2. Build component
User: "@component-builder create particles-background from [link]"
→ Generates tsx, css, test files

# 3. Check quality
User: "@component-checker validate particles-background"
→ Generates report, score 85/100 (B tier)

# 4. Fix issues (if needed)
User: "Fix the issues in the report"
→ Claude updates component

# 5. Re-check
User: "@component-checker validate particles-background"
→ Score 95/100 (S tier) ✅

# 6. Integrate
User: "@doc-integrator add particles-background"
→ Updates manifest, preview, exports

# 7. Done!
Navigate to /docs/components/particles-background
```

---

## Success Metrics

### Phase 1 Complete When:
- [ ] All components in unified structure
- [ ] Global token system established
- [ ] All components follow API standards
- [ ] Docs have syntax highlighting
- [ ] Multi-example support working
- [ ] Test coverage >= 80%

### Phase 2 Complete When:
- [ ] component-builder skill functional
- [ ] component-checker skill functional
- [ ] doc-integrator skill functional
- [ ] Can add new component in 1-2 hours (vs 4-6 hours before)

### Project Success When:
- [ ] 20+ high-quality components
- [ ] Consistent API across all components
- [ ] Professional documentation site
- [ ] Automated workflow proven
- [ ] Ready for public release

---

## Risk Mitigation

**Risk**: Breaking existing code during refactoring
- **Mitigation**: Commit after each small change, push immediately, test thoroughly

**Risk**: Losing work due to unpushed commits
- **Mitigation**: Always push immediately after every commit

**Risk**: Skills don't work as expected
- **Mitigation**: Build incrementally, test on simple cases first

**Risk**: Scope creep / over-engineering
- **Mitigation**: Follow this plan strictly, no extra features

---

## Next Steps

1. **Read**: COMPONENT_SPEC.md, CLAUDE.md, CHANGELOG.md
2. **Start**: Task 1 - Unify Component Directory Structure
3. **Commit**: After each subtask
4. **Push**: Immediately after every commit (⚠️ NEVER skip this!)
5. **Document**: Update CHANGELOG.md with progress
6. **Test**: Verify each change doesn't break existing functionality

**Let's build! 🚀**
