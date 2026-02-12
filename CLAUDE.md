# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project State

CodeMAD is a **desktop-first AI coding platform** built around the CodeMAD Protocol (a 4-phase methodology: Analysis, Planning, Solutioning, Implementation). The project is currently in the **planning phase** -- brainstorming, research, product brief, and PRD are complete. Architecture design is next. There is no application source code yet.

**Owner:** Costa (solo founder, stealth mode)
**License:** AGPL-3.0

## Locked Technical Decisions

These 12 decisions were locked after extensive research (Feb 2026). Treat as settled. Re-evaluate only if: a dependency is discontinued, a show-stopper bug is found in early testing, or a constraint changes (e.g. Anthropic unblocks OAuth PKCE).

| Decision | Choice | Why |
|----------|--------|-----|
| Architecture | Tauri -- Rust thin shell + Bun sidecar + WebView | Native perf, smallest bundle, no Electron overhead |
| Runtime | Bun (Node.js fallback) | 3-5x faster startup than Node, native TS support |
| UI Framework | Svelte 5 | Smallest bundle, no virtual DOM, runes reactivity |
| API Framework | Hono + tRPC | End-to-end type safety with minimal overhead |
| LLM SDK | Vercel AI SDK v6 | Unified streaming API across 5 providers |
| Vector DB | LanceDB (dual-use: code search + memory) | Embedded (no server), Lance columnar format is fast for similarity search |
| Monorepo | pnpm + Turborepo | pnpm strict deps prevent phantom imports, Turbo caches builds |
| Linting | Biome | Single tool replaces ESLint + Prettier, 100x faster |
| Testing | Vitest + cargo test | Vitest for TS (Vite-native), cargo test for Rust shell |
| Cross-session memory | LanceDB custom (Phase 2: Mem0) | Avoids external DB dependency at launch |
| Within-session memory | Blackboard MCP server | 13-57% better agent coordination than master-slave |
| Agent communication | Task list + blackboard (Claude Code teams pattern) | Proven pattern from Claude Code teams, decoupled agents |

## Locked Strategic Decisions

These were locked by Costa (Feb 11, 2026). Treat as constraints, not open questions.

| Decision | Choice | Why |
|----------|--------|-----|
| Auth strategy | OAuth-first (OpenAI first, then Anthropic/Google). BYOK as power-user alternative | Zero-cost adoption -- users with existing subscriptions pay nothing extra |
| Target audience | Experienced vibecoders + developers with any experience. Excludes non-technical founders | Autonomous AI coding trend means even 5y+ devs use autopilot. Non-technical founders are Bolt/Lovable territory |
| Revenue model | Free at launch (OAuth). BYOK for power users. Paid tier deferred | Get traction first. Architecture includes hooks for future gating |
| Launch strategy | Staged stealth: Costa-only alpha, 5-10 beta testers, 20-50 at v0.2, public at v0.3+ | Validates without exposure risk |

## Release Checkpoints

Six stable checkpoints (locked Feb 11, 2026). Nothing is dropped from the brief, just sequenced:

| Release | What ships |
|---------|-----------|
| v0.1-alpha | Shell + OpenAI OAuth + single-agent protocol + basic gates |
| v0.1-beta | + Anthropic/Google OAuth + LanceDB memory + Quick Flow |
| v0.1-rc | + BYOK all providers + model selection + two-track UI |
| v0.2 MVP | + multi-agent + worktrees + blackboard + agent recovery + AI merge |
| v0.2.1 | + Ollama local models + rate limiting + token tracking |
| v0.2.2 | + EU AI Act compliance + network resilience + error UX + credential rotation |

## Critical Constraints

| Constraint | Impact |
|-----------|--------|
| Anthropic OAuth PKCE blocked (Jan 2026) | No "log in with Claude Max". OpenAI ships first |
| Bun native deps 34% failure rate | Validate LanceDB + tree-sitter in v0.1-alpha before building on them |
| 5 MVP LLM providers | Anthropic, Google, OpenAI, Zhipu (GLM), Moonshot (Kimi) |
| Double streaming pattern | LLM -> Bun sidecar -> frontend via SSE. Shapes the entire API layer |
| EU AI Act transparency deadline: Aug 2, 2026 | Label AI-generated content, document human vs AI per phase (see Architecture Requirements) |
| Code signing cert ~$300/year | macOS $99, Windows ~$200-500. Max 459-day validity. Pre-launch blocker |

## Architecture Requirements

These must be addressed in the architecture document (from reconciliation review):

**Critical (regulatory/legal deadlines):**
1. **EU AI Act compliance** -- label AI-generated content, document human vs AI per phase. Deadline Aug 2, 2026
2. **AI code copyright defence** -- protocol phases create "substantial human participation" evidence. Needed before any public release
3. **MCP server strategy** -- expose protocol phases as MCP tools for distribution. Key differentiator

**Important (correctness/reliability):**
4. **Handoff message pairing** -- LLMs need tool call + response pairs during agent handoffs or they hallucinate
5. **Credential rotation** -- rotation/expiry/401 monitoring for 5 providers (storage via keychain is solved)
6. **CQRS for agent auditing** -- complements blackboard for continuous micro-review
7. **Semantic cache thresholds** -- 0.95+ for code generation, 0.85-0.90 for chat

## Repository Structure

```
_bmad-output/                              # All BMAD-generated artifacts
  brainstorming/                           # Phase 1 outputs (project spec, brainstorming session)
  planning-artifacts/
    product-brief-CodeMAD-2026-02-10.md    # Updated product brief (party mode review applied)
    prd.md                                 # Product requirements document (complete, 12 steps)
    prd-validation-report.md               # PRD validation findings and resolutions
    notes/Architecture/                    # Phase orchestration design notes
    research/
      technical-.../index.md               # 12 locked tech decisions (sharded folder)
      market-.../index.md                  # Competitive intelligence (sharded folder)
      domain-.../index.md                  # Industry, regulatory, technical trends (sharded folder)
      BMAD-METHODOLOGY-REFERENCE.md        # Full BMAD methodology reference
  implementation-artifacts/                # Phase 4 outputs (empty -- not started)
.github/workflows/                         # CI -- Claude Code review on @claude mentions
assets/                                    # SVG logos, banner, icon generation scripts
```

Research documents are **sharded folders** (not single files). Each folder has an `index.md` that serves as a table of contents for selective loading. Load `index.md` first, then pull specific sections as needed to manage context.

## BMAD Workflow Progression

1. Brainstorming -- **Complete** (`_bmad-output/brainstorming/`)
2. Technical Research -- **Complete** (12 decisions locked, 3 sharded research docs)
3. Domain Research -- **Complete** (26 web searches, 50+ sources)
4. Product Brief -- **Complete** (`_bmad-output/planning-artifacts/product-brief-CodeMAD-2026-02-10.md`)
5. BMAD Deep Research -- **Complete** (methodology reference at `_bmad-output/planning-artifacts/research/BMAD-METHODOLOGY-REFERENCE.md`)
6. PRD Creation -- **Complete** (`_bmad-output/planning-artifacts/prd.md`, all 12 steps, validation edits applied Feb 12)
7. Architecture/Design -- **Next** (use `/bmad-bmm-create-architecture`)
8. Implementation -- Not started

## Git Conventions

| Rule | Why |
|------|-----|
| Main branch: `main` | Planning artifacts live here until implementation begins |
| Implementation branch: `dev` | Separates planning from code. Created when coding starts |
| One concern per commit | Keeps diffs reviewable and bisectable |
| Push only when explicitly asked | Stealth mode. Premature exposure risks competitive advantage |

## Context Intelligence

Two retrieval backends, auto-injected by hooks on every prompt:

| Tool | Use for |
|------|---------|
| `mcp__qdrant-codemad__search_code` | Code patterns, implementation details, files |
| `mcp__qdrant-codemad__contextual_search` | Project documentation |
| `mcp__qdrant-codemad__search_git_history` | Commit history and past changes |
| `mcp__plugin_claude-mem_mcp-search__search` | Past decisions, patterns, gotchas |

Code/implementation queries go to Qdrant. Past decisions/patterns go to claude-mem. When unsure, use both.

## CodeMAD Protocol Rules

These rules govern how the CodeMAD Protocol structures work. Violating them creates wrong structures that are expensive to fix.

**Epic organisation:** Epics split by **user value** (vertical slices), never by technical layer. "Database Setup" and "API Development" are explicitly wrong epic structures. Each epic must deliver complete functionality for its domain.

**Parallelisation model:** Parallelisation happens at **story level**, not layer level. Multiple stories can run in parallel if they touch different files. Tasks within a story are strictly sequential (red-green-refactor).

**Two story-creation stages:**
1. Phase 3 `create-epics-and-stories` -- creates `epics.md` with user stories + BDD acceptance criteria (the WHAT)
2. Phase 4 `create-story` -- enriches ONE story into a dev-ready file with tasks, subtasks, guardrails (the HOW)

**Testing:** Dev-story hardcodes TDD (red-green-refactor per task). No switch to standard testing exists in the current workflow.

**Sprint management:** `sprint-status.yaml` is the single source of truth. Story lifecycle: `backlog -> ready-for-dev -> in-progress -> review -> done`.

Full reference: `_bmad-output/planning-artifacts/notes/architecture/phase-orchestration-design.md`

## Priority When Rules Conflict

Project CLAUDE.md overrides global `~/.claude/CLAUDE.md` for domain-specific behaviour. Within this file: Locked Decisions > Critical Constraints > Architecture Requirements > Conventions. When ambiguous, ask Costa.

---

## Critical Reminders

- **Locked decisions are settled.** 12 technical + 4 strategic. Re-evaluate only on discontinuation, show-stopper bugs, or changed constraints.
- **Epics split by user value, never technical layer.** "Database Setup" and "API Development" are wrong structures.
- **Architecture is next.** Run `/bmad-bmm-create-architecture`. All inputs are ready.
- **Sharded folders: load `index.md` first.** Research documents are folders. Load the TOC, then pull sections selectively.
