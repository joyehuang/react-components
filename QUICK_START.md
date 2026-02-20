# Quick Start Guide

## For Future Claude Code Sessions

### 📖 Essential Reading (Read First!)

1. **CLAUDE.md** - Comprehensive development guide
2. **EXECUTION_PLAN.md** - Current roadmap and what to work on
3. **CHANGELOG.md** - Progress tracking and work log
4. **COMPONENT_SPEC.md** - Component standards and templates

### 🎯 Current Status

**Phase**: Foundation Cleanup (Phase 1 of 2)

**Priority Task**: Unify component directory structure

Check task list:
```bash
# View all tasks
/tasks
```

### 🚀 Quick Commands

```bash
# Development
pnpm dev:docs          # Start docs site
pnpm dev:playground    # Start playground

# Testing
pnpm test              # Run all tests
pnpm typecheck         # Check TypeScript

# Validation
pnpm validate:manifest # Validate component registry
pnpm quality:check     # Run quality gates

# CLI
pnpm components list   # List components
```

### 📋 Before Starting Work

1. Read CHANGELOG.md to see latest progress
2. Check task dependencies (don't skip blocked tasks)
3. Review COMPONENT_SPEC.md for standards
4. Make sure you understand the current task

### ✅ After Completing Work

1. Update CHANGELOG.md with what you did
2. Run relevant tests (`pnpm typecheck`, `pnpm test`)
3. Commit with proper message format
4. Update task status to "completed"

### 🔄 Workflow for Each Task

```bash
# 1. Start task
/tasks update <task-id> --status in_progress

# 2. Do the work
# - Follow EXECUTION_PLAN.md steps
# - Refer to COMPONENT_SPEC.md for standards
# - Test frequently

# 3. Update changelog
# Edit CHANGELOG.md, add entry under current date

# 4. Commit
git add .
git commit -m "type: description

Detailed explanation if needed.

Co-Authored-By: Claude (pa/claude-sonnet-4-5-20250929) <noreply@anthropic.com>"

# 5. Mark complete
/tasks update <task-id> --status completed
```

### 🎨 Component Development Pattern

**When adding/refactoring components**, follow this order:

1. **Files**: Create/move tsx, css, test files
2. **Exports**: Update `packages/ui/src/index.ts`
3. **Manifest**: Update `packages/registry/manifest/components.json`
4. **Preview**: Update `apps/docs/components/docs/component-preview.tsx`
5. **Validate**: Run `pnpm validate:manifest`
6. **Test**: Run `pnpm test` and `pnpm typecheck`
7. **Commit**: With descriptive message

### 🚨 Common Pitfalls to Avoid

❌ **DON'T**:
- Skip reading EXECUTION_PLAN.md
- Work on tasks that are blocked by others
- Forget to update CHANGELOG.md
- Commit without testing
- Change multiple things in one commit
- Skip the Co-Authored-By line

✅ **DO**:
- Read all docs first
- Follow task order
- Commit frequently
- Test before committing
- Update CHANGELOG.md
- Reference existing quality components (CreditCard)

### 🎯 Current Goal

**Get to Phase 1 Complete**:
- ✅ Unified component structure
- ✅ Global design tokens
- ✅ Standardized APIs
- ✅ Syntax highlighting
- ✅ Multi-example support
- ✅ Comprehensive tests

**Then** → Build the 3 Skills (Phase 2)

### 📚 Quick Reference Links

- **Best Component Example**: `packages/ui/src/components/ui/credit-card/credit-card.tsx`
- **Manifest Schema**: `packages/registry/manifest/components.json`
- **Docs Pages**: `apps/docs/app/docs/components/[slug]/page.tsx`
- **CLI Logic**: `packages/cli/src/index.mjs`

### 💡 Pro Tips

- Use `Glob` to find files by pattern: `**/*credit-card*`
- Use `Grep` to search code: pattern matching in files
- Use `Read` to view file contents before editing
- Always `Read` before `Edit` or `Write`
- Check git status before starting: `git status`

---

**Ready to start? Read EXECUTION_PLAN.md and begin with Task #1! 🚀**
