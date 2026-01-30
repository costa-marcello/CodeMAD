# Roadmap: CodeMAD

## Overview

CodeMAD is a **fork of OpenCode** (github.com/anomalyco/opencode), not a greenfield build. This roadmap focuses on the delta between OpenCode's existing capabilities and CodeMAD's differentiated vision. The fork strategy reduces time-to-market from 12-18 months to 5-7 months by inheriting OpenCode's desktop shell, multi-provider LLM integration, LSP, MCP tools, session management, and basic Git operations.

**Fork Base:** OpenCode v1.1.44+ (MIT License, 92.5k stars, 663 contributors)
**What OpenCode Provides:** Go CLI/Server backend, LLM provider abstraction, LSP, MCP, session persistence, Git basics
**What CodeMAD Adds:** GSD methodology, per-hunk review, parallel worktree execution, vector embeddings, cross-session memory, Chinese providers

**Architecture Approach:**
- **Use:** OpenCode's TypeScript client/server as backend engine
- **Replace:** Build custom React GUI on top (TUI is irrelevant)
- **Focus:** GUI-first experience, not terminal

**Estimated Timeline:** 22-29 weeks (5-7 months) to differentiated product

**Reference Products (closed-source, study patterns):**
- **Verdent.ai:** Multi-agent (Planner→Coder→Verifier), isolated worktrees, diff reasoning, shared agent memory
- **Conductor.build:** Worktree orchestration, agent dashboard, Linear/GitHub integration, auto-fix CI

---

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Fork Foundation** - Establish CodeMAD identity and Chinese provider support
- [ ] **Phase 2: Context Intelligence** - Vector embeddings and semantic code search
- [ ] **Phase 3: Parallel Execution** - Git worktree multi-agent orchestration
- [ ] **Phase 4: Code Review** - Per-hunk approval workflow
- [ ] **Phase 5: GSD Workflow** - Discuss/Plan/Execute/Verify methodology
- [ ] **Phase 6: Polish & Security** - Privacy, security, UX refinements

---

## Phase Details

### Phase 1: Fork Foundation
**Goal**: CodeMAD exists as a distinct, usable product with Chinese LLM provider support
**Depends on**: Nothing (first phase)
**Requirements**: FORK-01, FORK-02, FORK-03, FORK-04
**Estimated Duration**: 2-3 weeks
**Risk Level**: LOW (straightforward fork and configuration work)

**Success Criteria** (what must be TRUE):
  1. User can download and install CodeMAD on macOS, Windows, or Linux
  2. User can configure and use Kimi 2.5, GLM 4.7, or Minimax 2.1 as their LLM provider
  3. User can authenticate via OAuth OR API key for any supported provider
  4. CodeMAD branding (name, logo, about page) is distinct from OpenCode

**Plans**: 3 plans in 3 waves

Plans:
- [x] 01-01-PLAN.md — Fork OpenCode and rebrand to CodeMAD
- [x] 01-02-PLAN.md — Add Chinese LLM provider adapters (Kimi, GLM, Minimax)
- [x] 01-03-PLAN.md — Implement API key auth and provider configuration UI

**Notes:**
- OpenCode's existing Vercel AI SDK integration simplifies provider addition
- Chinese providers may need custom OAuth flow research (flagged in research summary)
- Fallback to API keys if OAuth proves problematic

---

### Phase 2: Context Intelligence
**Goal**: Users can search their codebase by meaning, not just keywords
**Depends on**: Phase 1
**Requirements**: CTX-01, CTX-02, CTX-03, CTX-04, CTX-06
**Estimated Duration**: 3-4 weeks
**Risk Level**: MEDIUM (embedding model selection needs benchmarking)

**Success Criteria** (what must be TRUE):
  1. User can search for code by describing what it does ("find the function that validates user email")
  2. Codebase is automatically indexed when files change (no manual reindex)
  3. User can use @file, @codebase, @docs syntax to inject context into prompts
  4. Search combines vector similarity with LSP symbol information
  5. Embedding tier auto-detected based on available hardware (GPU/CPU/minimal)

**Plans**: TBD

Plans:
- [ ] 02-01: Integrate LanceDB for vector storage
- [ ] 02-02: Implement codebase indexing with file watcher
- [ ] 02-03: Build hybrid search (vector + LSP) and context injection syntax

**Research Flags:**
- Embedding model selection: voyage-code-3 vs text-embedding-3-large
- Chunking strategy needs benchmarking with real codebases
- Memory footprint on constrained hardware

---

### Phase 3: Parallel Execution
**Goal**: Multiple AI agents work on different tasks simultaneously in isolated git worktrees
**Depends on**: Phase 2 (needs codebase context to assign work)
**Requirements**: PAR-01, PAR-02, PAR-03, PAR-04, PAR-05, PAR-06, PAR-07, PAR-08
**Estimated Duration**: 4-6 weeks
**Risk Level**: HIGH (conflict resolution is complex, novel architecture)

**Success Criteria** (what must be TRUE):
  1. User can spawn multiple agents, each working in its own git worktree
  2. User can see progress of all running agents in a unified view
  3. System detects file conflicts between worktrees before merge
  4. Completed worktrees auto-merge back to main branch (with user approval)
  5. Agent execution stops automatically after configurable step limit (default 25)
  6. User can pause, resume, or cancel any running agent
  7. User receives notification when background agent completes

**Plans**: TBD

Plans:
- [ ] 03-01: Git worktree management layer (create, switch, list, delete)
- [ ] 03-02: Agent coordinator with isolated execution contexts
- [ ] 03-03: Conflict detection and auto-merge workflow
- [ ] 03-04: Progress tracking UI and agent controls

**Research Flags:**
- Optimal number of parallel agents (research suggests 3-5 limit)
- Token overhead measurement for parallel context
- Conflict resolution UX patterns (study CodeRabbit, Cline)

**Study (closed-source patterns):**
- **Verdent.ai:** Planner→Coder→Verifier agent pipeline, isolated worktrees per agent
- **Conductor.build:** Agent dashboard showing all worktrees at a glance, Linear/GitHub issue injection

---

### Phase 4: Code Review
**Goal**: Users can approve or reject AI changes at the individual hunk level
**Depends on**: Phase 3 (review applies to changes from parallel agents)
**Requirements**: REV-01, REV-02, REV-03, REV-04, REV-05, REV-06
**Estimated Duration**: 3-4 weeks
**Risk Level**: MEDIUM (UI complexity, but patterns exist in market)

**Success Criteria** (what must be TRUE):
  1. User sees each diff broken into individual hunks with accept/reject buttons
  2. User can ask "Why did you change this?" and get explanation for any hunk
  3. User can undo the last applied change with a single command
  4. User can restore project to any previous checkpoint
  5. System flags semantic conflicts (logic issues git merge would miss)

**Plans**: TBD

Plans:
- [ ] 04-01: Per-hunk diff parser and data model
- [ ] 04-02: Hunk review UI with accept/reject/explain
- [ ] 04-03: Checkpoint system and undo functionality
- [ ] 04-04: Logic conflict detection

**Study:**
- CodeRabbit's line-level review approach
- Cline's workspace snapshots
- OpenCode issue #9578 (per-hunk review discussion)
- **Verdent.ai:** Diff reasoning (every change has explanation), Verifier subagent validates other AI's code

---

### Phase 5: GSD Workflow
**Goal**: Users have a structured methodology that guides them from idea to shipped product
**Depends on**: Phase 4 (verification needs review system)
**Requirements**: GSD-01, GSD-02, GSD-03, GSD-04, GSD-05, GSD-06, CTX-05, CTL-01, CTL-02, CTL-03
**Estimated Duration**: 6-8 weeks
**Risk Level**: HIGH (novel methodology, requires iteration to get right)

**Success Criteria** (what must be TRUE):
  1. User's workflow is guided through Discuss, Plan, Execute, Verify phases
  2. After execution, system verifies the GOAL was achieved, not just tasks completed
  3. Failed verification automatically generates a fix plan (gap closure)
  4. System escalates to human after repeated fix attempts (fix-loop detection)
  5. Project structure uses .planning/ conventions (PROJECT.md, ROADMAP.md, STATE.md)
  6. Decisions and context persist across sessions and are retrievable
  7. User can set permission level: Guardian (read-only), Balanced (ask), Autopilot (execute)

**Plans**: TBD

Plans:
- [ ] 05-01: Workflow state machine (Discuss/Plan/Execute/Verify)
- [ ] 05-02: Goal-backward verification engine
- [ ] 05-03: .planning/ file management and cross-session memory
- [ ] 05-04: Permission levels and reasoning depth controls
- [ ] 05-05: Gap closure loop and fix-loop detection

**This is CodeMAD's core differentiator.** No existing tool has structured methodology with goal-backward verification.

---

### Phase 6: Polish & Security
**Goal**: CodeMAD is production-ready with proper security and UX polish
**Depends on**: Phase 5
**Requirements**: SEC-01, SEC-02, SEC-03, SEC-04, UX-01, UX-02, UX-03
**Estimated Duration**: 4 weeks
**Risk Level**: LOW (known patterns, refinement work)

**Success Criteria** (what must be TRUE):
  1. User can choose between local-only mode and optional cloud sync
  2. Agent execution is sandboxed with configurable filesystem boundaries
  3. System warns user when secrets are detected in files or git history
  4. Credentials are stored in OS keychain, never plaintext
  5. Command palette (Cmd/Ctrl+Shift+P) provides access to all actions
  6. Accessibility modes work: NO_COLOR, SCREEN_READER, HIGH_CONTRAST
  7. User sees estimated costs before committing expensive operations

**Plans**: TBD

Plans:
- [ ] 06-01: Privacy controls and data retention settings
- [ ] 06-02: Agent sandbox and secret detection
- [ ] 06-03: Command palette and accessibility refinements
- [ ] 06-04: Cost visibility and final UX polish

---

## Risk Summary

| Phase | Risk Level | Primary Risk | Mitigation |
|-------|------------|--------------|------------|
| 1 | LOW | Chinese OAuth complexity | Fallback to API keys |
| 2 | MEDIUM | Embedding model selection | Benchmark early, architecture allows swap |
| 3 | HIGH | Parallel conflict resolution | Start with 2-agent limit, expand after validation |
| 4 | MEDIUM | UI complexity | Study existing patterns (CodeRabbit, Cline) |
| 5 | HIGH | Novel methodology | Iterate with real users, expect pivots |
| 6 | LOW | Standard patterns | No novel risk |

---

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Fork Foundation | 3/3 | Complete | 2026-01-30 |
| 2. Context Intelligence | 0/3 | Not started | - |
| 3. Parallel Execution | 0/4 | Not started | - |
| 4. Code Review | 0/4 | Not started | - |
| 5. GSD Workflow | 0/5 | Not started | - |
| 6. Polish & Security | 0/4 | Not started | - |

**Total:** 3/23 plans complete

---

## Coverage Validation

**v1 Requirements:** 37 total
**Mapped:** 37/37 (100%)
**Orphaned:** None

| Category | Count | Phase(s) |
|----------|-------|----------|
| FORK | 4 | 1 |
| CTX | 6 | 2, 5 |
| PAR | 8 | 3 |
| REV | 6 | 4 |
| GSD | 6 | 5 |
| CTL | 3 | 5 |
| SEC | 4 | 6 |
| UX | 3 | 6 |

---

## What We Inherit vs. What We Build

### Inherited from OpenCode (Phase 0 - Already Done)

These features come with the fork:
- Cross-platform Electron desktop app
- Multi-provider LLM (Claude, GPT, Gemini, local)
- LSP integration for code intelligence
- MCP tool system
- SQLite session persistence
- Basic Git operations (commit, diff, branch)
- Streaming chat interface
- File read/write tools
- Keyboard navigation basics

### What CodeMAD Builds (Phases 1-6)

These are CodeMAD's additions:
- Chinese LLM providers (Kimi, GLM, Minimax)
- Vector embeddings for semantic search (LanceDB)
- Git worktree parallel execution
- Per-hunk code review UI
- GSD workflow methodology
- Goal-backward verification
- Cross-session memory persistence
- Enhanced privacy and security controls

---

*Created: 2026-01-30*
*Strategy: Fork of OpenCode (MIT)*
*Depth: Comprehensive*
*Previous strategy: Greenfield Tauri (superseded)*
