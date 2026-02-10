# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project State

CodeMAD is a **desktop-first AI coding platform** built around the CodeMAD Protocol (a 4-phase methodology: Analysis, Planning, Test Design, Implementation). The project is currently in the **planning phase** — brainstorming and technical research are complete, architecture/design planning is next. There is no application source code yet.

**Owner:** Costa (solo founder, stealth mode)
**License:** AGPL-3.0

## Locked Technical Decisions

These 12 decisions were locked after extensive research (Feb 2026). Do not re-debate them. Re-evaluation is justified only if: a dependency is discontinued, a show-stopper bug is found in early testing, or a constraint changes (e.g. Anthropic unblocks OAuth PKCE).

| Decision | Choice |
|----------|--------|
| Architecture | Tauri — Rust thin shell + Bun sidecar + WebView |
| Runtime | Bun (Node.js fallback) |
| UI Framework | Svelte 5 |
| API Framework | Hono + tRPC |
| LLM SDK | Vercel AI SDK v6 |
| Vector DB | LanceDB (dual-use: code search + memory) |
| Monorepo | pnpm + Turborepo |
| Linting | Biome |
| Testing | Vitest + cargo test |
| Cross-session memory | LanceDB custom (Phase 2: Mem0) |
| Within-session memory | Blackboard MCP server |
| Agent communication | Task list + blackboard (Claude Code teams pattern) |

Full rationale: `_bmad-output/planning-artifacts/research/technical-codemad-tech-stack-decisions-research-2026-02-10.md`

## Critical Constraints

- Anthropic OAuth PKCE is blocked (Jan 2026) — no "log in with Claude Max"
- Bun native deps have a 34% failure rate — test LanceDB + tree-sitter early
- 5 MVP LLM providers: Anthropic, Google, OpenAI, Zhipu (GLM), Moonshot (Kimi)
- Three-tier agent hierarchy: Orchestrator (120k tokens) → Phase (50k) → Worker (10k)
- Double streaming pattern: LLM → Bun sidecar → frontend via SSE

## Repository Structure

```
_bmad-output/                # All BMAD-generated artifacts
  brainstorming/             # Phase 1 outputs (project spec, brainstorming session)
  planning-artifacts/        # Phase 2 outputs (research documents)
  implementation-artifacts/  # Phase 4 outputs (empty -- not started)
assets/                      # SVG logos, banner, icon generation scripts
```

## BMAD Workflow Progression

1. Brainstorming — **Complete** (`_bmad-output/brainstorming/`)
2. Technical Research — **Complete** (12 decisions locked)
3. Architecture/Design Planning — **Next**
4. Implementation — Not started

## Git Conventions

- Main branch: `main` (planning artifacts)
- Implementation branch: `dev` (when coding begins)
- Small, scoped commits -- one concern per commit keeps history bisectable and reviewable
- Do not push unless explicitly asked -- Costa reviews before anything reaches remote

---

## Local Development Environment

**Everything below is gitignored.** These tools exist on disk but are not tracked in the repository. Teammates inherit this context through CLAUDE.md loading, not through git.

### BMAD Framework

BMAD v6.0.0-Beta.8 drives the development methodology. Four installed modules:

| Module | Purpose |
|--------|---------|
| `core` | Master orchestration, brainstorming workflows |
| `bmm` | Build Methodology — PRD, architecture, epics, stories, code review |
| `cis` | Creative Intelligence — brainstorming, design thinking, innovation |
| `tea` | Test Architecture — test strategy, ATDD, CI patterns |

Key paths:

```
_bmad/_config/manifest.yaml      # Framework version and module registry
_bmad/bmm/config.yaml            # Project config (user: Costa, output paths)
_bmad/bmm/agents/                # Agent definitions (analyst, architect, dev, pm, qa, etc.)
_bmad/bmm/workflows/             # Phase workflows with step-by-step execution
```

All BMAD agents require loading `_bmad/bmm/config.yaml` on activation (mandatory step 2 in each agent spec).

### BMAD Commands

Key slash commands for the current phase (30+ available in `.claude/commands/`):

| Command | What it does |
|---------|-------------|
| `/bmad-help` | Shows what workflow step comes next |
| `/bmad-bmm-create-architecture` | Creates architecture document |
| `/bmad-bmm-create-prd` | Creates product requirements document |
| `/bmad-bmm-create-epics-and-stories` | Breaks architecture into implementable stories |
| `/bmad-bmm-check-implementation-readiness` | Validates all planning artifacts before coding |
| `/bmad-agent-bmm-architect` | Spawns the architect agent (Winston) |
| `/bmad-agent-bmm-pm` | Spawns the PM agent (John) |
| `/bmad-review-adversarial-general` | Cynical review of any content |

### Context Intelligence

Retrieval context is injected automatically on every prompt. Two backends:

| Tool | Use for |
|------|---------|
| `mcp__qdrant-codemad__search_code` | Code patterns, implementation details, files |
| `mcp__qdrant-codemad__contextual_search` | Project documentation |
| `mcp__qdrant-codemad__search_git_history` | Commit history and past changes |
| `mcp__plugin_claude-mem_mcp-search__search` | Past decisions, patterns, gotchas |

**Routing:** code/implementation queries go to Qdrant. Past decisions/patterns go to claude-mem. When unsure, use both.

#### CLI Access (for subagents)

```bash
node .claude/hooks/context.mjs "query"              # auto-detect
node .claude/hooks/context.mjs "query" --code        # Qdrant code only
node .claude/hooks/context.mjs "query" --mem         # claude-mem only
node .claude/hooks/context.mjs --health              # check service health
```

### Execution Plans

When transitioning from planning to implementation, use the plan template at `.claude/plan-topup.md`. It enforces:

- Working branch must be `dev`
- Parallel workstreams with explicit contracts
- Atomic task tracking (WS/Block/Task IDs)
- Subagent spawning mapped 1:1 to workstreams
- Status tracking in `/.claude/plans/`
