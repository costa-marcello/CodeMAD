---
phase: 01-fork-foundation
plan: 04
subsystem: cli
tags: [rebrand, cli, theme, user-experience]
dependency-graph:
  requires: [01-01]
  provides: [complete-rebrand, codemad-theme, cli-identity]
  affects: []
tech-stack:
  added: []
  patterns: []
key-files:
  created:
    - packages/opencode/src/cli/cmd/tui/context/theme/codemad.json
  modified:
    - packages/opencode/src/cli/cmd/tui/context/theme.tsx
    - packages/opencode/src/index.ts
    - packages/opencode/src/cli/logo.ts
    - packages/opencode/src/cli/cmd/tui/component/logo.tsx
    - packages/opencode/src/cli/cmd/serve.ts
    - packages/opencode/src/cli/cmd/run.ts
    - packages/opencode/src/cli/cmd/auth.ts
    - packages/opencode/src/cli/cmd/import.ts
    - packages/opencode/src/cli/cmd/web.ts
    - packages/opencode/src/cli/cmd/pr.ts
    - packages/opencode/src/cli/cmd/tui/thread.ts
    - packages/opencode/src/cli/cmd/tui/attach.ts
    - packages/opencode/src/cli/cmd/upgrade.ts
    - packages/opencode/src/cli/cmd/uninstall.ts
    - packages/opencode/src/cli/cmd/tui/component/tips.tsx
  deleted:
    - packages/opencode/src/cli/cmd/tui/context/theme/opencode.json
decisions: []
metrics:
  duration: 23 min
  completed: 2026-01-30
---

# Phase 01 Plan 04: Gap Closure - Complete Rebrand Summary

**One-liner:** Complete CodeMAD rebrand with branded theme (#FF3300 primary), CODEMAD ASCII banner, and CLI command references.

## What Was Built

This gap closure plan completed the CodeMAD rebrand by fixing all user-visible CLI strings that were missed in Plan 01:

1. **CodeMAD Branded Theme (codemad.json)**
   - Created new theme with landing page brand colors
   - Primary: #FF3300 (MAD Red)
   - Background: #050505 (pure dark)
   - Success: #00FF94 (bright green)
   - Accent: #E3C67B (gold)
   - Removed opencode.json theme

2. **CLI Identity**
   - Changed scriptName from "opencode" to "codemad"
   - Created new ASCII banner spelling "CODE MAD" (not "OPEN CODE")
   - MAD portion uses theme.primary color (red accent)

3. **Command Descriptions (15 files updated)**
   - serve.ts: "headless codemad server"
   - run.ts: "run codemad with a message"
   - auth.ts: "codemad auth provider"
   - web.ts: "start codemad server", "codemad.local" mDNS
   - pr.ts: "run codemad", "Starting codemad..."
   - thread.ts: "start codemad tui"
   - attach.ts: "attach to a running codemad server"
   - upgrade.ts: "upgrade codemad to the latest version"
   - uninstall.ts: "uninstall codemad", "Thank you for using CodeMAD"

4. **TUI Tips (16 tips updated)**
   - CLI commands: codemad run, codemad serve, codemad upgrade, etc.
   - Product name: "CodeMAD auto-handles OAuth", "CodeMAD uses LSP servers"
   - GitHub: "/codemad" in issues/PRs

## Preserved References (unchanged)

- Config directories: `.opencode/`
- Config filenames: `opencode.json`
- External services: `opencode.ai`, OpenCode Zen
- Docker images: `ghcr.io/anomalyco/opencode`
- Short commands: `/oc`
- Environment variables: `OPENCODE_*`
- Internal URLs: `opencode.internal`

## Commits

| Hash | Type | Description |
|------|------|-------------|
| b33abbe0a | feat | Create CodeMAD branded theme with landing page colors |
| b44a7cdde | feat | Update CLI scriptName and CODEMAD ASCII banner |
| 6d7528e30 | feat | Update CLI command descriptions to reference codemad |
| 7ca9fdde0 | fix | Update attach command description to reference codemad |
| 35517341b | feat | Update TUI tips to reference codemad CLI commands |
| 5e5f7f568 | feat | Update upgrade and uninstall command descriptions |

## Deviations from Plan

### Auto-fixed Issues (Rule 3 - Blocking)

**1. Additional files discovered during verification**
- **Found during:** Task 2 verification
- **Issue:** CLI help still showed "opencode" in attach, upgrade, uninstall commands
- **Fix:** Updated attach.ts, upgrade.ts, uninstall.ts
- **Files modified:** 3 additional files beyond original plan

**2. Additional tips discovered**
- **Found during:** Task 3 execution
- **Issue:** pr.ts also contained user-visible "opencode" strings
- **Fix:** Updated pr.ts describe and user messages
- **Files modified:** pr.ts

## Verification Results

1. **Type check:** PASSED (all 12 packages)
2. **CLI banner:** Shows CODEMAD with colored MAD portion
3. **CLI commands:** All describe text uses "codemad"
4. **Tips:** Reference "codemad run", "codemad serve", etc.
5. **Config paths:** Still use `.opencode/`, `opencode.json`
6. **External services:** Still reference `opencode.ai`

## Files Summary

| Category | Count |
|----------|-------|
| Created | 1 |
| Modified | 15 |
| Deleted | 1 |
| Total changes | 17 |

## Next Phase Readiness

Phase 1 (Fork Foundation) is now fully complete:
- Plan 01: Fork and initial rebrand
- Plan 02: Chinese LLM providers
- Plan 03: API key authentication
- Plan 04: Gap closure - complete rebrand

Ready to proceed to Phase 2 (Memory System).
