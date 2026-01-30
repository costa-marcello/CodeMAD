# CodeMAD

## What This Is

CodeMAD is a cross-platform desktop AI development platform that provides structure for AI-first developers. It combines context intelligence, workflow orchestration, parallel execution, and per-hunk code review into a unified "CodeMAD Protocol" that turns AI-generated code into shipped products.

Target users are technical vibe coders — developers who prompt, approve, and iterate but need methodology to avoid the chaos of unstructured AI output.

## Core Value

**Context-aware workflow orchestration that never loses your project state.** Every session builds on previous sessions. The AI always knows your codebase, your decisions, and where you are in the development process.

## Requirements

### Validated

**v1.0 Fork Foundation (2026-01-30):**

- ✓ CodeMAD branding — distinct identity from OpenCode (scriptName, theme, banner, CLI)
- ✓ Chinese LLM providers — Kimi 2.5, GLM 4.7, Minimax 2.1 integrated
- ✓ Dual auth paths — API key authentication for Chinese providers
- ✓ Provider configuration — UI enables API key entry for all Chinese providers

### Active

#### Context Intelligence

- [ ] Cross-session memory — conversations persist, decisions retrievable from any previous session
- [ ] Semantic code search — find code by meaning, not keywords (vector + LSP hybrid)
- [ ] Real-time indexing — context updates automatically as files change
- [ ] Context injection — `@file`, `@codebase`, `@docs` syntax to inject context
- [ ] Adaptive embedding tiers — auto-detect hardware, allow tier selection

#### Workflow Orchestration (CodeMAD Protocol)

- [ ] Four-phase workflow — Discuss → Plan → Execute → Verify
- [ ] Goal-backward verification — checks if _goal_ achieved, not just tasks completed
- [ ] Gap closure loop — failed verification auto-generates fix plans
- [ ] Fix-loop detection — escalates to human after repeated failures
- [ ] Milestone/phase structure — projects decompose into trackable units

#### Parallel Execution

- [ ] Multi-agent worktrees — each agent in isolated git worktree
- [ ] Auto-merge — worktrees merge back to main on completion
- [ ] Pause/Resume/Cancel — control agents mid-execution
- [ ] Runaway protection — configurable step limit (default 25)
- [ ] Completion notifications — notify when background agents finish

#### Code Review & Changes

- [ ] Per-hunk approval — accept/reject changes hunk-by-hunk
- [ ] Logic conflict detection — catch semantic conflicts git merge misses
- [ ] Git conflict detection — detect merge conflicts between worktrees
- [ ] Change explanation — "Why did you change this?" for any diff
- [ ] One-command undo — single command reverts last change
- [ ] Checkpoint restore — return to any previous state

#### Provider Management

- [ ] Multi-provider support — Claude, GPT, Gemini, GLM 4.7, Kimi 2.5, Minimax 2.1
- [ ] Local models — Ollama, LMStudio for offline/privacy
- [ ] Dual auth paths — OAuth (subscription) AND API key
- [ ] Mid-session switching — change providers without restart
- [ ] Automatic failover — rate limiting triggers backup provider
- [ ] Cost visibility — show estimated costs before committing

#### Reasoning & Control

- [ ] Reasoning depth levels — Swift/Deep/Ultra (or Off/On/Ultra)
- [ ] Permission levels — Guardian (read-only), Balanced (ask), Autopilot (execute)
- [ ] Question classification — MUST ASK / CAN ASSUME / MUST PROCEED
- [ ] Autopilot review modes — "Review at end" vs "Review every step"

#### Privacy & Security

- [ ] Privacy-flexible — user chooses local-only or optional cloud sync
- [ ] Direct API calls — no proxy servers, data goes to user's provider
- [ ] Agent sandbox — isolated execution with filesystem boundaries
- [ ] Secret detection — automatic scanning on files + git history
- [ ] OS keychain storage — credentials never in plaintext

#### User Experience

- [ ] Cross-platform desktop — macOS, Windows, Linux
- [ ] 100% keyboard navigation — every action reachable without mouse
- [ ] Command palette — Cmd/Ctrl+Shift+P for any action
- [ ] Terminal theming — auto-detect capabilities, graceful fallback
- [ ] Accessibility — NO_COLOR, SCREEN_READER, HIGH_CONTRAST support

### Out of Scope (v1)

- Team collaboration — single-user focus for MVP
- Enterprise features (SSO, audit logs) — defer to Stage 3
- Plugin marketplace — defer to Stage 3
- Custom agent builder — defer to Stage 3
- Mobile app — desktop-first

## Context

### Problem Being Solved

AI coding tools have created "technical vibe coders" — developers who prompt and iterate but drown in unstructured output. Every session starts fresh. Context is lost. Architecture decisions are inconsistent. Projects almost work but never ship.

Existing solutions fall short:

- **Cursor** — Pure power without methodology (accelerates chaos)
- **Kiro** — Enterprise positioning alienates indie builders
- **Trae** — Privacy concerns with ByteDance ownership
- **Lovable/Bolt** — Optimized for demos, not deployment
- **Claude Code** — Powerful but requires manual setup

No tool combines methodology + developer experience + privacy + adaptive UI.

### Technical Foundation (Researched)

**Fork Base:** OpenCode (anomalyco/opencode) v1.1.44+

- TypeScript client/server architecture with Tauri 2.x desktop
- MIT license, 92.5k stars, 663+ contributors
- Already has: Multi-LLM, LSP, MCP, SQLite sessions, git basics, worktree infrastructure (sandbox mode)

**Patterns to Adopt:**

- **Kilo Code:** Read-shared/write-isolated state model for parallel agents
- **parallel-cc:** SQLite session tracking with heartbeat monitoring
- **Verdent:** DiffLens-style reasoning (every change has explanation)
- **LanceDB:** Embedded vector DB for semantic search (no server, sub-ms lookups)

**Reference Documents:**

- `.planning/research/FORK-CANDIDATES.md` - Fork decision analysis
- `.planning/research/VERDANT-PATTERNS.md` - Multi-agent pipeline patterns
- `.planning/research/KILOCODE-PATTERNS.md` - Worktree isolation patterns
- `.planning/research/OPENCODE-WORKTREES.md` - OpenCode architecture details
- `.planning/research/AUTO-CLAUDE-PATTERNS.md` - Session management patterns

### Target Users

| Persona                | Description                             | Key Need                   |
| ---------------------- | --------------------------------------- | -------------------------- |
| **Marco** (Vibe Coder) | Prompts AI, approves code, ships fast   | Structure without friction |
| **Jake** (Pro Dev)     | Traditional developer adopting AI-first | Methodology that scales    |
| **Dana** (Brownfield)  | Has existing codebase, wants AI help    | Documentation + context    |

### Success Metrics

**North Star:** Projects Shipped (idea → deployed production)

| Metric                   | Target   |
| ------------------------ | -------- |
| First Project Structured | < 10 min |
| Story Completion Rate    | > 40%    |
| 7-Day Return Rate        | > 50%    |
| Diff Approval Rate       | > 70%    |

## Constraints

- **Privacy**: User data never leaves machine except direct API calls to user's chosen provider
- **Platform**: Must work on macOS, Windows, Linux from v1
- **Architecture**: Solid foundation approach — take time to get it right, then accelerate
- **Providers (v1)**: Claude, GPT, Gemini, GLM 4.7, Kimi 2.5 (thinking), Minimax 2.1, local models
- **Auth**: Both OAuth (subscription) AND API key paths required

## Key Decisions

| Decision                                | Rationale                                                | Outcome   |
| --------------------------------------- | -------------------------------------------------------- | --------- |
| Fork OpenCode (not greenfield)          | Saves 6-12 months; inherits LLM, LSP, MCP, sessions, git | ✓ Decided |
| TypeScript + Tauri 2.x                  | OpenCode's stack; 10x smaller than Electron              | ✓ Decided |
| LanceDB for embeddings                  | Local-first, no server, sub-ms, used by Continue.dev     | ✓ Decided |
| Chinese providers: API key first        | OAuth not mature; fallback always available              | ✓ Decided |
| Privacy-flexible (not absolute)         | User choice between local-only and convenience           | ✓ Decided |
| All four core systems equal priority    | Context, Workflow, Parallel, Review are tightly coupled  | ✓ Decided |
| Adopt Kilo's read-shared/write-isolated | Prevents race conditions in parallel execution           | ✓ Decided |
| SQLite for session state                | parallel-cc pattern; heartbeat monitoring for cleanup    | ✓ Decided |

---

## Current State

**Shipped:** v1.0 Fork Foundation (2026-01-30)
**Codebase:** 232k TypeScript LOC across 17 @codemad/\* packages
**Next milestone:** v1.1 Context Intelligence (Phases 2-6)

---

_Last updated: 2026-01-30 after v1.0 milestone_
