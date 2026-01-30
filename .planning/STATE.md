# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-30)

**Core value:** Context-aware workflow orchestration that never loses your project state
**Current focus:** Phase 1 - Fork Foundation
**Strategy:** Fork of OpenCode (not greenfield)

## Current Position

Phase: 1 of 6 (Fork Foundation) - COMPLETE
Plan: 5 of 5 executed (including gap closure plans)
Status: Phase 1 fully complete, ready for Phase 2
Last activity: 2026-01-30 - Completed 01-05-PLAN.md (Gap Closure - Visual Polish)

Progress: [==========] 27.8% (5/18 total plans)

**Phase 1 Plans:**
- 01-01: Fork OpenCode, rebrand to CodeMAD (Wave 1) - COMPLETE
- 01-02: Add Chinese LLM providers (Wave 2) - COMPLETE
- 01-03: API key auth + provider UI (Wave 3) - COMPLETE
- 01-04: Gap closure - complete rebrand (Wave 1) - COMPLETE
- 01-05: Gap closure - visual polish (Wave 1) - COMPLETE

Config:
{
  "mode": "yolo",
  "depth": "comprehensive",
  "parallelization": true,
  "commit_docs": true,
  "model_profile": "quality",
  "workflow": {
    "research": true,
    "plan_check": true,
    "verifier": true
  }
}

## Performance Metrics

**Velocity:**
- Total plans completed: 5
- Average duration: 10 min
- Total execution time: 0.85 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-fork-foundation | 5/5 | 51 min | 10 min |

**Recent Trend:**
- Last 5 plans: 01-01 (14 min), 01-02 (4 min), 01-03 (6 min), 01-04 (23 min), 01-05 (4 min)
- Trend: Gap closure plans execute quickly when requirements are clear

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Strategy]: Fork OpenCode instead of greenfield Tauri build (saves 6-12 months)
- [Fork Base]: OpenCode v1.1.44+ (MIT license, 92.5k stars, 663 contributors)
- [Language]: OpenCode is TypeScript with Tauri 2.x desktop (not Go)
- [Worktrees]: OpenCode already has worktree infrastructure (sandbox mode v1.1.1+)
- [Providers]: Add Chinese LLM support (Kimi 2.5, GLM 4.7, Minimax 2.1)
- [Auth]: API key first for Chinese providers (OAuth not mature)
- [Stack]: LanceDB for vector embeddings (local-first, no server)
- [Pattern]: Adopt Kilo's read-shared/write-isolated for parallel agents
- [Sessions]: SQLite with heartbeat (parallel-cc pattern)
- [Diffs]: Implement DiffLens-style reasoning (Verdent pattern)

**Plan 01-01 Decisions:**
- [Naming]: Keep packages/opencode directory, only change npm scope to @codemad/*
- [Icons]: Retain OpenCode icons as placeholders, design custom later
- [i18n]: Update English first, other languages incrementally

**Plan 01-02 Decisions:**
- [Provider Pattern]: Use CUSTOM_LOADERS in provider.ts instead of separate files
- [Bundled vs Dynamic]: Bundle Zhipu directly, load MiniMax dynamically (type compatibility)
- [Moonshot SDK]: Use @ai-sdk/openai-compatible (no dedicated SDK exists)
- [Endpoints]: Default to China endpoints, document global alternatives

**Plan 01-04 Decisions:**
- [Theme]: Use landing page brand colors (#FF3300 primary, #050505 bg)
- [Logo]: MAD portion uses theme.primary color for red accent
- [Preserved]: Config paths (.opencode/), external services (opencode.ai) unchanged

**Plan 01-05 Decisions:**
- [CLI Colors]: Direct ANSI codes (97m white, 91m red) instead of Bun.color()
- [Logo Marks]: Empty marks string disables mark-based coloring
- [Session Prefix]: CM as 2-letter abbreviation for CodeMAD

### Pending Todos

None.

### Blockers/Concerns

- Chinese provider OAuth: Not mature, using API key fallback (resolved)
- Parallel execution conflict resolution: HIGH risk (Phase 3) - mitigated by researched patterns
- OpenCode upstream merges: Structure fork for clean cherry-picks

## Completed Summaries

| Phase-Plan | Summary | Key Outcome |
|------------|---------|-------------|
| 01-01 | [01-01-SUMMARY.md](./phases/01-fork-foundation/01-01-SUMMARY.md) | OpenCode fork rebranded to CodeMAD with @codemad/* packages |
| 01-02 | [01-02-SUMMARY.md](./phases/01-fork-foundation/01-02-SUMMARY.md) | Moonshot, Zhipu, MiniMax Chinese LLM providers with CUSTOM_LOADERS |
| 01-03 | [01-03-SUMMARY.md](./phases/01-fork-foundation/01-03-SUMMARY.md) | Auth plugins enable API key entry UI for Chinese providers |
| 01-04 | [01-04-SUMMARY.md](./phases/01-fork-foundation/01-04-SUMMARY.md) | Complete rebrand: CodeMAD theme, banner, CLI commands |
| 01-05 | [01-05-SUMMARY.md](./phases/01-fork-foundation/01-05-SUMMARY.md) | Visual polish: terminal title, clean ASCII art, CLI brand colors |

## Research Completed

| Document | Focus |
|----------|-------|
| FORK-CANDIDATES.md | Fork decision (OpenCode recommended) |
| OPENCODE-DISAMBIGUATION.md | Clarifies two "OpenCode" projects |
| OPENCODE-WORKTREES.md | OpenCode architecture, sandbox mode |
| VERDANT-PATTERNS.md | Multi-agent pipeline, DiffLens |
| KILOCODE-PATTERNS.md | Read-shared/write-isolated pattern |
| AUTO-CLAUDE-PATTERNS.md | SQLite sessions, heartbeat |
| AIDER_FORK_ANALYSIS.md | Aider as alternative (Python) |
| 01-RESEARCH.md | Phase 1 specific research |

## Session Continuity

Last session: 2026-01-30T13:09:47Z
Stopped at: Completed 01-05-PLAN.md (Gap Closure - Visual Polish)
Resume file: None
