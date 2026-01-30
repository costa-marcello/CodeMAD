# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-30)

**Core value:** Context-aware workflow orchestration that never loses your project state
**Current focus:** Phase 1 - Fork Foundation
**Strategy:** Fork of OpenCode (not greenfield)

## Current Position

Phase: 1 of 6 (Fork Foundation)
Plan: 1 of 3 executed (3 planned)
Status: In progress
Last activity: 2026-01-30 - Completed 01-01-PLAN.md (Fork and Rebrand)

Progress: [===-------] 5.5% (1/18 total plans)

**Phase 1 Plans:**
- 01-01: Fork OpenCode, rebrand to CodeMAD (Wave 1) - COMPLETE
- 01-02: Add Chinese LLM providers (Wave 2) - Pending
- 01-03: API key auth + provider UI (Wave 3) - Pending

## Performance Metrics

**Velocity:**
- Total plans completed: 1
- Average duration: 14 min
- Total execution time: 0.23 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-fork-foundation | 1/3 | 14 min | 14 min |

**Recent Trend:**
- Last 5 plans: 01-01 (14 min)
- Trend: N/A (first plan)

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

Last session: 2026-01-30T06:50:48Z
Stopped at: Completed 01-01-PLAN.md (Fork and Rebrand)
Resume file: None
