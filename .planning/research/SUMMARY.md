# Project Research Summary

**Project:** CodeMAD - Cross-Platform AI Development Platform
**Domain:** Desktop AI development platform for "technical vibe coders"
**Researched:** 2026-01-30
**Confidence:** HIGH

---

## Executive Summary

CodeMAD enters a mature AI development platform market where basic features (code completion, chat interfaces, codebase awareness) are table stakes. The competitive frontier has shifted to context engineering, multi-agent orchestration, and methodology enforcement. Research confirms CodeMAD's planned differentiators (GSD methodology, goal-backward verification, parallel worktree execution) address genuine market gaps, particularly the underserved "power users who hate enterprise process theater" segment.

The recommended stack is **Tauri 2.x + React/TypeScript** for the desktop shell (10x smaller than Electron, 5x less memory), **Vercel AI SDK 6.x** for multi-provider LLM integration, **LanceDB** as the embedded vector database (zero infrastructure, used by Continue.dev), and **simple-git** with custom worktree orchestration for parallel agent execution. This stack prioritizes the local-first privacy model while supporting both cloud providers and local LLMs.

The critical risks are **session memory amnesia** (users lose context between sessions), **aggressive auto-compaction** (AI forgets mid-task), **parallel execution conflicts** (merge disasters after hours of work), and **leaky provider abstractions** (features work with some providers, fail silently with others). These must be addressed in core architecture, not retrofitted.

---

## Key Findings

### Recommended Stack

The stack prioritizes developer experience, performance, and local-first privacy.

| Technology | Purpose | Confidence |
|------------|---------|------------|
| **Tauri 2.9.x** | Desktop shell (3-10MB vs Electron's 80-150MB) | HIGH |
| **React 19 + TypeScript 5.7** | Frontend UI, mature TS ecosystem | HIGH |
| **Vercel AI SDK 6.x** | Unified multi-provider interface (100+ providers) | HIGH |
| **LanceDB 0.23.x** | Embedded vector DB (no server, sub-ms lookups) | HIGH |
| **simple-git 3.30.x** | Git/worktree operations, TS-native | HIGH |
| **Tree-sitter + LSP** | Hybrid code intelligence (syntax + semantics) | HIGH |
| **TauRPC 0.5.x** | Type-safe Rust-TS IPC | MEDIUM |

**What NOT to use:** Electron (5x memory), Langchain.js (over-abstraction), rspc (unmaintained), cloud-only vector DBs (violates privacy model).

### Expected Features

**Must have (table stakes):**
- Multi-file editing with coordinated changes
- Git integration (auto-commit, diff, undo)
- Model selection (multiple providers, BYOK)
- Codebase indexing and semantic search
- Rules files (.continuerules, CLAUDE.md patterns)
- Diff preview before apply
- Basic session memory

**Should have (competitive):**
- Checkpoint/rewind system (low complexity, high value)
- Cross-session memory ("never loses state")
- Context efficiency visibility (show token savings)
- Background agents (expected soon in market)

**Defer (v2+):**
- Multi-agent parallel execution (high complexity, defining feature)
- GSD methodology enforcement (requires proven patterns)
- Goal-backward verification (novel, needs iteration)
- Full local model support (privacy moat)

### Architecture Approach

A **layered component model** with clear separation: Presentation (Tauri + React), Orchestration (Workflow Controller, Session Manager, Agent Coordinator), Intelligence (LLM Gateway, Context Intelligence, Tool Executor), and Integration (LSP, Git, MCP, Vector DB). Event-driven communication via IPC bridge, with a centralized Context Store that enables "compound intelligence" through distillation.

**Major components:**
1. **Session Manager** - Session lifecycle, checkpoint/restore, persistence
2. **LLM Gateway** - Multi-provider abstraction, routing, fallback chains
3. **Context Intelligence** - Vector embeddings, hybrid search, LSP integration
4. **Agent Coordinator** - Worktree allocation, parallel execution orchestration
5. **Tool Executor** - Dispatch, approval workflows, sandboxing

### Critical Pitfalls

| Pitfall | Prevention | Phase |
|---------|------------|-------|
| **Session memory amnesia** | Persistent SQLite from Day 1, structured memory injection on session start | Phase 1 |
| **Auto-compaction destroying work** | User-controlled compaction, task-aware (never compact during active work), 90%+ threshold | Phase 2 |
| **Provider abstraction leaks** | Provider-specific thin adapters, capability matrix, explicit error surfacing | Phase 2-3 |
| **Parallel execution conflicts** | File-level intent declaration, real-time conflict detection, human-in-loop for conflicts | Phase 3-4 |
| **Diff/review UX that breaks flow** | Per-hunk accept/reject, inline editing during review, stable UI position, keyboard shortcuts | Phase 4-5 |

---

## Implications for Roadmap

### Phase 1: Foundation

**Rationale:** Desktop shell, session management, and single-provider LLM must exist before any intelligence layer. Memory management and lazy initialization must be correct from the start (hard to retrofit).

**Delivers:** Working Tauri shell with React UI, SQLite-backed session persistence, streaming Claude integration.

**Addresses:** Table stakes (basic chat, file access), session memory persistence.

**Avoids:** Memory leaks (profiling in CI), slow startup (lazy init), session amnesia (persistent state from Day 1).

**Stack:** Tauri 2.x, React 19, SQLite, Anthropic SDK.

### Phase 2: Core Intelligence

**Rationale:** Tool execution and context intelligence depend on Phase 1 session management. Provider abstraction needs careful design to avoid leaky abstraction pitfall.

**Delivers:** Tool framework (read/write/bash), vector DB integration, basic chat panel with streaming.

**Addresses:** Multi-file editing, codebase indexing, diff preview.

**Avoids:** Tool failures (verification after edits), compaction disasters (user-controlled, task-aware).

**Stack:** LanceDB, Vercel AI SDK, Zod for validation.

### Phase 3: Workflow and Git

**Rationale:** Git operations and workflow phases depend on the tool executor. Worktree management is foundational for later parallel execution.

**Delivers:** Git integration (commit, diff, branch), worktree management, workflow state machine (Discuss/Plan/Execute/Verify), code editor with Monaco.

**Addresses:** Git integration (table stake), rules files, checkpoint/rewind.

**Avoids:** Worktree setup friction (automation scripts), stale file edits (fresh reads before edit).

**Stack:** simple-git, Monaco Editor, Tree-sitter.

### Phase 4: Advanced Features

**Rationale:** Multi-provider, LSP, and parallel worktrees can be developed in parallel once foundation is stable. Per-hunk code review is a core differentiator.

**Delivers:** Multiple LLM providers with routing, LSP integration for code intelligence, parallel agent execution in isolated worktrees, per-hunk code review.

**Addresses:** Model selection (table stake), background agents, multi-agent parallel (differentiator).

**Avoids:** Provider lock-in (capability matrix), parallel conflicts (intent declaration, conflict detection).

**Stack:** OpenAI/Google/local provider adapters, typescript-language-server.

### Phase 5: Extensions and Polish

**Rationale:** MCP integration, advanced memory, and cross-session context depend on stable core systems.

**Delivers:** MCP client/server, advanced checkpoint system, context store with distillation and cross-session persistence.

**Addresses:** MCP integration, cross-session memory ("never loses state"), context efficiency visibility.

**Avoids:** Token cost spiral (real-time display, budget limits).

**Stack:** MCP protocol (STDIO/SSE transports).

### Phase Ordering Rationale

- **Foundation before Intelligence:** Session persistence prevents amnesia pitfall; must be in architecture from Day 1.
- **Tools before Workflow:** Workflow phases need tool execution to be meaningful.
- **Git before Parallel:** Worktree isolation pattern requires solid git foundation.
- **Per-hunk review as Phase 4:** Core differentiator, but depends on git/editor integration.
- **MCP last:** Extension point, not core value proposition.

### Research Flags

**Needs deeper research during planning:**
- **Phase 2 (Context Intelligence):** Embedding model selection (voyage-code-3 vs text-embedding-3-large), chunking strategy needs benchmarking.
- **Phase 4 (Parallel Execution):** Conflict resolution strategies, 3-5 agent limit validation, token overhead measurement.
- **Phase 4 (LSP Integration):** Bundling strategy for language servers with Tauri, multi-language support matrix.

**Standard patterns (skip research-phase):**
- **Phase 1:** Tauri + React is well-documented, established patterns.
- **Phase 3 (Git):** simple-git worktree operations are straightforward.
- **Phase 5 (MCP):** Protocol is documented, reference implementations exist.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified versions, production usage (Continue.dev uses LanceDB, Claude Code uses same patterns) |
| Features | HIGH | Comprehensive competitive analysis, official docs reviewed |
| Architecture | HIGH | Multiple open-source implementations analyzed (OpenCode, Cline, Claude Code) |
| Pitfalls | HIGH | Real GitHub issues, forum complaints, industry post-mortems |

**Overall confidence:** HIGH

### Gaps to Address

| Gap | Resolution |
|-----|------------|
| Chinese provider OAuth flows | Validate Kimi, GLM implementation during Phase 4; fallback to API keys |
| Embedding model performance | Benchmark during Phase 2; can swap models without architecture change |
| LSP server bundling | Research during Phase 4 planning; Tauri sidecar pattern likely solution |
| Local model quantization | Defer to v2; Ollama integration is standard pattern |
| A2A protocol | Monitor Google A2A development; not critical for MVP |

---

## Technology Decision Matrix

| Decision | Recommendation | Confidence | Alternatives Rejected |
|----------|---------------|------------|----------------------|
| Desktop framework | Tauri 2.x | HIGH | Electron (memory), Go+TUI (limited UI) |
| Frontend | React 19 + TS | HIGH | SolidJS (ecosystem), Svelte (TS support) |
| LLM gateway | Vercel AI SDK 6.x | HIGH | LiteLLM (Python), raw SDKs (fragmented) |
| Vector database | LanceDB | HIGH | Qdrant (needs server), Chroma (less mature) |
| Git library | simple-git | HIGH | isomorphic-git (worktree support weaker) |
| Code editor | Monaco | HIGH | CodeMirror (smaller but less featured) |
| IPC | TauRPC | MEDIUM | tauri-specta (either works), rspc (unmaintained) |

---

## Competitive Positioning

| Competitor | Their Strength | Their Gap | CodeMAD Counter |
|------------|---------------|-----------|-----------------|
| **Cursor** | Model diversity, speed | No methodology | GSD = power + process |
| **Windsurf** | Enterprise, large codebases | Complexity | Solo-focused simplicity |
| **Kiro** | Spec-driven, AWS backing | Enterprise positioning | Anti-enterprise, complete workflow |
| **Claude Code** | Terminal-native, quality | Single provider, manual setup | Multi-provider, pre-configured |
| **Aider** | Git excellence, OSS | No GUI, learning curve | GUI + methodology |

---

## Sources

### Primary (HIGH confidence)
- [Tauri 2.0 Documentation](https://v2.tauri.app/) - Desktop framework
- [Vercel AI SDK 6.0](https://ai-sdk.dev/) - LLM integration
- [LanceDB + Continue.dev](https://lancedb.com/blog/the-future-of-ai-native-development-is-local-inside-continues-lancedb-powered-evolution/) - Vector DB
- [OpenCode Architecture](https://cefboud.com/posts/coding-agents-internals-opencode-deepdive/) - Agent patterns
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) - Workflow patterns

### Secondary (MEDIUM confidence)
- [Cursor Features](https://cursor.com/features) - Competitive analysis
- [Kiro Documentation](https://kiro.dev/) - Spec-driven patterns
- [Git Worktrees for AI Development](https://stevekinney.com/courses/ai-development/git-worktrees) - Parallel execution
- [GitHub Issues](https://github.com/anthropics/claude-code/issues) - Pitfall validation

### Tertiary (Needs validation)
- Chinese provider OAuth flows - Community reports, not official docs
- A2A protocol - Emerging, spec not finalized

---

*Research completed: 2026-01-30*
*Ready for roadmap: yes*
