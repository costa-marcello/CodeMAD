# Requirements: CodeMAD

## Overview

CodeMAD requirements are organized into what **OpenCode provides** (inherited from fork) and what **CodeMAD adds** (new development). Only CodeMAD additions require active development work.

**Fork Base:** OpenCode (github.com/anomalyco/opencode) v1.1.44+
**License:** MIT

---

## Inherited from OpenCode (No Development Required)

These features come from the fork and require only configuration/branding changes:

| Category | Feature | OpenCode Status |
|----------|---------|-----------------|
| Desktop | Cross-platform Electron app (macOS, Windows, Linux) | Complete |
| LLM | Multi-provider support (Claude, GPT, Gemini) | Complete |
| LLM | Local models (Ollama, LMStudio) | Complete |
| LLM | Streaming responses | Complete |
| Context | LSP integration | Complete |
| Context | MCP tool system | Complete |
| Session | SQLite persistence | Complete |
| Git | Basic operations (commit, diff, branch) | Complete |
| UX | Keyboard navigation | Complete |
| Privacy | Direct API calls (no proxy) | Complete |

---

## v1 Requirements (Active Development)

### Fork Foundation (FORK)

| ID | Requirement | Priority |
|----|-------------|----------|
| FORK-01 | CodeMAD branding replaces OpenCode identity | Must |
| FORK-02 | Chinese LLM providers: Kimi 2.5, GLM 4.7, Minimax 2.1 | Must |
| FORK-03 | Dual auth paths: OAuth (subscription) AND API key | Must |
| FORK-04 | Provider configuration UI for Chinese providers | Must |

### Context Intelligence (CTX)

| ID | Requirement | Priority |
|----|-------------|----------|
| CTX-01 | Vector embeddings via LanceDB for semantic code search | Must |
| CTX-02 | Real-time codebase indexing as files change | Must |
| CTX-03 | Hybrid search (vector + LSP) for code navigation | Must |
| CTX-04 | Context injection syntax: @file, @codebase, @docs | Must |
| CTX-05 | Cross-session memory persistence (decisions retrievable) | Must |
| CTX-06 | Adaptive embedding tiers (auto-detect hardware) | Should |

### Parallel Execution (PAR)

| ID | Requirement | Priority |
|----|-------------|----------|
| PAR-01 | Git worktree management (create/switch/merge) | Must |
| PAR-02 | Multiple agents in isolated worktrees | Must |
| PAR-03 | Progress tracking across parallel agents | Must |
| PAR-04 | Conflict detection between worktrees | Must |
| PAR-05 | Auto-merge worktrees on completion | Should |
| PAR-06 | Pause/Resume/Cancel agent execution | Should |
| PAR-07 | Runaway protection (configurable step limit) | Must |
| PAR-08 | Completion notifications for background agents | Should |

### Code Review (REV)

| ID | Requirement | Priority |
|----|-------------|----------|
| REV-01 | Per-hunk diff parsing from unified diff format | Must |
| REV-02 | Accept/reject UI per individual hunk | Must |
| REV-03 | Change explanation: "Why did you change this?" | Must |
| REV-04 | One-command undo for last change | Must |
| REV-05 | Checkpoint system (restore to any previous state) | Must |
| REV-06 | Logic conflict detection (semantic conflicts) | Should |

### GSD Workflow (GSD)

| ID | Requirement | Priority |
|----|-------------|----------|
| GSD-01 | Four-phase workflow: Discuss, Plan, Execute, Verify | Must |
| GSD-02 | Goal-backward verification (checks goal, not tasks) | Must |
| GSD-03 | Milestone/phase/plan structure for projects | Must |
| GSD-04 | .planning/ file conventions (PROJECT, ROADMAP, STATE) | Must |
| GSD-05 | Gap closure loop (failed verification generates fix) | Must |
| GSD-06 | Fix-loop detection (escalates after repeated failures) | Should |

### Reasoning & Control (CTL)

| ID | Requirement | Priority |
|----|-------------|----------|
| CTL-01 | Permission levels: Guardian, Balanced, Autopilot | Must |
| CTL-02 | Reasoning depth levels: Swift/Deep/Ultra | Should |
| CTL-03 | Question classification: MUST ASK / CAN ASSUME / MUST PROCEED | Should |

### Privacy & Security (SEC)

| ID | Requirement | Priority |
|----|-------------|----------|
| SEC-01 | Privacy-flexible: user chooses local-only or cloud sync | Must |
| SEC-02 | Agent sandbox with filesystem boundaries | Must |
| SEC-03 | Secret detection on files and git history | Should |
| SEC-04 | OS keychain storage for credentials | Should |

### User Experience (UX)

| ID | Requirement | Priority |
|----|-------------|----------|
| UX-01 | Command palette (Cmd/Ctrl+Shift+P) | Must |
| UX-02 | Accessibility: NO_COLOR, SCREEN_READER, HIGH_CONTRAST | Should |
| UX-03 | Cost visibility before committing operations | Should |

---

## v2 Scope (Deferred)

- Team collaboration
- Enterprise features (SSO, audit logs)
- Plugin marketplace
- Custom agent builder
- Mobile app

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FORK-01 | Phase 1 | Complete |
| FORK-02 | Phase 1 | Complete |
| FORK-03 | Phase 1 | Complete |
| FORK-04 | Phase 1 | Complete |
| CTX-01 | Phase 2 | Pending |
| CTX-02 | Phase 2 | Pending |
| CTX-03 | Phase 2 | Pending |
| CTX-04 | Phase 2 | Pending |
| CTX-05 | Phase 5 | Pending |
| CTX-06 | Phase 2 | Pending |
| PAR-01 | Phase 3 | Pending |
| PAR-02 | Phase 3 | Pending |
| PAR-03 | Phase 3 | Pending |
| PAR-04 | Phase 3 | Pending |
| PAR-05 | Phase 3 | Pending |
| PAR-06 | Phase 3 | Pending |
| PAR-07 | Phase 3 | Pending |
| PAR-08 | Phase 3 | Pending |
| REV-01 | Phase 4 | Pending |
| REV-02 | Phase 4 | Pending |
| REV-03 | Phase 4 | Pending |
| REV-04 | Phase 4 | Pending |
| REV-05 | Phase 4 | Pending |
| REV-06 | Phase 4 | Pending |
| GSD-01 | Phase 5 | Pending |
| GSD-02 | Phase 5 | Pending |
| GSD-03 | Phase 5 | Pending |
| GSD-04 | Phase 5 | Pending |
| GSD-05 | Phase 5 | Pending |
| GSD-06 | Phase 5 | Pending |
| CTL-01 | Phase 5 | Pending |
| CTL-02 | Phase 5 | Pending |
| CTL-03 | Phase 5 | Pending |
| SEC-01 | Phase 6 | Pending |
| SEC-02 | Phase 6 | Pending |
| SEC-03 | Phase 6 | Pending |
| SEC-04 | Phase 6 | Pending |
| UX-01 | Phase 6 | Pending |
| UX-02 | Phase 6 | Pending |
| UX-03 | Phase 6 | Pending |

---

*Created: 2026-01-30*
*Derived from: PROJECT.md, FORK-CANDIDATES.md*
