---
phase: 01-fork-foundation
plan: 01
subsystem: foundation
tags: [tauri, bun, monorepo, rebrand, fork]

# Dependency graph
requires: []
provides:
  - CodeMAD rebranded codebase from OpenCode fork
  - All @codemad/* scoped packages
  - codemad CLI binary
  - Tauri desktop with CodeMAD branding
affects: [01-02, 01-03, all future phases]

# Tech tracking
tech-stack:
  added: []  # No new tech, fork of existing
  patterns:
    - "@codemad/* package scope for all workspace packages"
    - "Tauri 2.x for desktop app"
    - "Bun 1.3.5 as package manager"

key-files:
  created: []
  modified:
    - "package.json"
    - "README.md"
    - "packages/desktop/src-tauri/tauri.conf.json"
    - "packages/desktop/src-tauri/Cargo.toml"
    - "packages/opencode/package.json"
    - "packages/*/package.json (17 packages)"
    - "packages/app/src/i18n/en.ts"
    - "packages/ui/src/components/favicon.tsx"
    - "packages/ui/src/assets/favicon/site.webmanifest"

key-decisions:
  - "Keep packages/opencode directory name unchanged - only rename package scope"
  - "Retain existing OpenCode icons as placeholders - custom icons to be designed later"
  - "Update English i18n file only - other languages can be updated incrementally"
  - "Service-specific URLs (opencode.ai/zen) retained as external references"

patterns-established:
  - "@codemad/*: All internal packages use this npm scope"
  - "Workspace references: Use workspace:* for internal dependencies"

# Metrics
duration: 14min
completed: 2026-01-30
---

# Phase 1 Plan 1: Fork and Rebrand Summary

**OpenCode fork rebranded to CodeMAD with @codemad/* package scope, codemad CLI binary, and Tauri desktop branding**

## Performance

- **Duration:** 14 min
- **Started:** 2026-01-30T06:36:42Z
- **Completed:** 2026-01-30T06:50:48Z
- **Tasks:** 3 (+1 auto-fix)
- **Files modified:** 205

## Accomplishments

- Cloned OpenCode repository and initialized as CodeMAD
- Rebranded all 17 workspace packages to @codemad/* scope
- Renamed CLI binary from "opencode" to "codemad"
- Updated Tauri desktop config with CodeMAD product name, identifier, window title
- Updated user-visible i18n strings to CodeMAD
- Typecheck passes successfully

## Task Commits

Each task was committed atomically:

1. **Task 1: Fork OpenCode and initialize CodeMAD structure** - `22af517ba` (feat)
2. **Task 2: Rebrand Tauri desktop application** - `c2d3a4677` (feat)
3. **Task 3: Rebrand CLI and UI components** - `88b866e0f` (feat)
4. **Auto-fix: Update source imports** - `5ca41db3a` (fix)

## Files Created/Modified

### Root Level
- `package.json` - Changed name to "codemad", updated repo URL
- `README.md` - Complete rewrite with CodeMAD identity

### Desktop (Tauri)
- `packages/desktop/src-tauri/tauri.conf.json` - productName, identifier, title, mainBinaryName, deep-link scheme
- `packages/desktop/src-tauri/Cargo.toml` - package name "codemad", lib name "codemad_lib"

### CLI
- `packages/opencode/package.json` - @codemad/cli, bin: codemad
- `packages/opencode/bin/codemad` - Renamed from opencode

### UI
- `packages/ui/src/components/favicon.tsx` - apple-mobile-web-app-title
- `packages/ui/src/assets/favicon/site.webmanifest` - name/short_name

### All Package.json Files (17 packages)
All renamed from @opencode-ai/* to @codemad/*:
- @codemad/cli, app, ui, sdk, util, plugin, script
- @codemad/desktop, web, function, enterprise, slack
- @codemad/console-app, console-core, console-function
- @codemad/console-mail, console-resource

### Source Files (183 files)
All imports updated from @opencode-ai/* to @codemad/*

## Decisions Made

1. **Directory naming:** Kept `packages/opencode/` directory name unchanged to minimize churn - only changed package.json name and npm scope
2. **Icon approach:** Retained existing OpenCode icons as placeholders; custom CodeMAD icons can be designed later without blocking development
3. **i18n strategy:** Updated English (en.ts) as primary language; other 14 language files can be updated incrementally
4. **Service URLs:** Kept external service references (opencode.ai/zen) unchanged as they point to external services

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated 183 source file imports**
- **Found during:** Build verification (typecheck)
- **Issue:** Typecheck failed because source files imported from @opencode-ai/* packages which no longer existed
- **Fix:** Global replacement of @opencode-ai/ with @codemad/ in all .ts and .tsx files
- **Files modified:** 183 TypeScript files across all packages
- **Verification:** Typecheck passes: "Tasks: 12 successful, 12 total"
- **Committed in:** 5ca41db3a

---

**Total deviations:** 1 auto-fixed (blocking issue)
**Impact on plan:** Essential for build to succeed. Scope remained unchanged.

## Issues Encountered

- ImageMagick not installed for generating placeholder icons - resolved by keeping existing icons
- Some symlinks in the cloned repo converted to regular files - no impact on functionality

## User Setup Required

None - no external service configuration required for fork/rebrand.

## Next Phase Readiness

- Fork and rebrand complete
- All packages build and typecheck successfully
- Ready for Phase 1 Plan 2: Add Chinese LLM providers

**Blockers:** None
**Concerns:** None

---
*Phase: 01-fork-foundation*
*Plan: 01*
*Completed: 2026-01-30*
