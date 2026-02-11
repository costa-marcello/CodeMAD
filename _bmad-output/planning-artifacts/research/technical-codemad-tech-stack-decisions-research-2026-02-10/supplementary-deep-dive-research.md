# Supplementary Deep-Dive Research

**Research Coverage:** 8 parallel research streams covering Rust backend patterns, frontend framework comparison, full-Rust feasibility, vector DB alternatives, agent memory systems (cross-session and within-session), and inter-agent communication patterns. 200+ sources.

---

## Architecture Decision: Option A (Rust Thin + Bun Sidecar)

Three architecture options were evaluated:

| Option | Description | Verdict |
|--------|-------------|---------|
| **A: Rust thin + Bun sidecar** | Rust handles process supervision, keychain, sandbox, file watching. Bun sidecar handles all app logic. WebView for UI. | **Chosen.** Best solo-dev velocity. Proven by Claude Code (Anthropic ships Bun as Tauri sidecar). |
| B: Rust thick backend + TS frontend | All backend logic in Rust. No sidecar. TypeScript only in WebView. | Rejected. Higher development friction. No ecosystem for LLM SDKs in Rust. |
| C: Full Rust | Leptos/Dioxus for UI + Rust for everything. | Not viable. Missing UI component ecosystem (no React Flow, no kanban DnD, no shadcn equivalent). |

**Why Option A wins for CodeMAD:**
1. **Claude Code proves the pattern** -- Anthropic ships Bun as a Tauri sidecar in production
2. **TypeScript LLM ecosystem is 10x richer** -- Vercel AI SDK, LangChain.js, MCP SDK are all TS-first
3. **Solo dev velocity** -- hot reload on TS changes (instant), Rust changes are rare (supervisor layer only)
4. **Rust surface stays thin** -- process supervision, keychain (tauri-plugin-keyring), file system sandboxing, tree-sitter bindings

_Sources: [Claude Code Architecture](https://docs.anthropic.com/s/claude-code-architecture), [Tauri Sidecar Guide](https://v2.tauri.app/develop/sidecar/)_

---

## Rust Backend Layer (Thin Shell)

### Recommended Crates

| Purpose | Crate | Why |
|---------|-------|-----|
| IPC (type-safe) | **TauRPC** | Auto-generates TS types from Rust via Specta. Zero manual type sync. |
| Linker (dev speed) | **LLD** | Cuts Rust link time from 24s to 8s. Critical for dev loop. |
| Process supervision | **tokio** + custom | Erlang-inspired restart policies for sidecar health |
| Keychain | **tauri-plugin-keyring** | OS-native credential storage (macOS Keychain, Windows Credential Manager) |
| File system | **tauri-plugin-fs** | Sandboxed file access with permission scopes |
| Shell commands | **tauri-plugin-shell** | Execute sidecar and external processes safely |
| Updater | **tauri-plugin-updater** | Auto-update with mandatory signature verification |
| Window state | **tauri-plugin-window-state** | Persist window position/size across restarts |
| Logging | **tauri-plugin-log** | Structured logging across Rust and frontend |
| Local store | **tauri-plugin-store** | Key-value persistence (settings, feature flags) |

### Rust Build Optimisation

```toml
# .cargo/config.toml
[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=lld"]

[target.x86_64-apple-darwin]
rustflags = ["-C", "link-arg=-fuse-ld=lld"]
```

**Impact:** Rust build from 24s to 8s (debug). Production builds unaffected (optimisation dominates).

_Sources: [TauRPC GitHub](https://github.com/nicohman/taurpc), [Tauri v2 Plugins](https://v2.tauri.app/plugin/), [LLD Linker](https://lld.llvm.org/)_

---

## Frontend Framework Decision: Svelte 5

| Framework | Bundle | DX for Solo Dev | SSE Streaming | Component Ecosystem |
|-----------|--------|----------------|---------------|-------------------|
| **Svelte 5** | 1-2 MB | 30-40% less code | Best (runes) | Growing, 79k stars |
| React 19 | 2-3 MB | Most familiar | Good (hooks) | Largest ecosystem |
| SolidJS | 1-2 MB | Moderate | Good (signals) | Smallest ecosystem |
| Vue 3.5 | 1.5-2 MB | Good | Good (reactivity) | Large ecosystem |

**Why Svelte 5 for CodeMAD:**

1. **SSE streaming UX** -- Svelte 5 runes (`$state`, `$derived`) handle real-time LLM token streaming with less boilerplate than React hooks or SolidJS signals. The reactive model updates the DOM automatically as tokens arrive.
2. **30-40% less code** -- Solo founder writing less code means faster shipping and fewer bugs. Svelte compiles away the framework; no virtual DOM overhead.
3. **Bundle size** -- 1-2 MB total (critical for a desktop app that ships its own WebView).
4. **Growing ecosystem** -- shadcn-svelte ports available. SvelteKit for routing. svelte-flow (React Flow port) exists.

**Risk:** Smaller ecosystem than React. Some specialised components (e.g., complex data grids) may need custom implementation or Svelte wrappers around vanilla JS libraries.

**Mitigation:** Svelte can use any vanilla JS library directly. The component gap is real but shrinking. For a desktop app (not a web SaaS with 50 third-party integrations), the ecosystem is sufficient.

_Sources: [Svelte 5 Runes](https://svelte.dev/docs/svelte/$state), [shadcn-svelte](https://www.shadcn-svelte.com/), [svelte-flow](https://svelteflow.dev/)_

---

## Vector DB Decision: LanceDB Confirmed

Six alternatives evaluated. LanceDB wins.

| Database | Hybrid Search | Bun Native | 100k+ Scale | Incremental Index | Production Proof |
|----------|:---:|:---:|:---:|:---:|:---:|
| **LanceDB** | Built-in (BM25+vector+RRF) | Yes (native bindings) | Yes (<20ms at 100k) | Automatic | Continue AI, AnythingLLM, CodeRabbit |
| Orama | Yes (3 modes) | Yes (pure TS) | Untested | Manual | Limited |
| sqlite-vec | Manual (FTS5+vec fusion) | Yes (bun:sqlite) | ~20ms | Manual upsert | Growing |
| Vectra | No (vector only) | Likely | Not designed for it | No | Minimal |
| Qdrant Edge | N/A | No (requires server) | Yes | Yes | Private beta |

**Why LanceDB stays:**
1. **Continue AI uses LanceDB** for semantic code search in a coding tool -- direct validation
2. **Hybrid search out of the box** (BM25 + vector + RRF fusion) -- no manual SQL joining
3. **Automatic incremental indexing** -- detects changed rows without manual upsert logic
4. **FFI overhead is negligible** (~5ms) -- vector math dominates latency, not the Rust-to-JS bridge
5. **Unified architecture** -- same database for code search AND memory (Context Intelligence)

_Sources: [Continue AI + LanceDB](https://blog.continue.dev/building-a-semantic-code-history-search-with-lancedb/), [LanceDB Benchmarks](https://docs.lancedb.com/enterprise/benchmark/benchmark), [LanceDB Hybrid Search](https://docs.lancedb.com/search/hybrid-search)_

---

## Memory Architecture

### The Three Memory Problems

CodeMAD's four-tier agent hierarchy needs three distinct memory layers:

| Layer | Problem | Solution | Technology |
|-------|---------|----------|-----------|
| **Cross-session** | Remember decisions, preferences, patterns between runs | LanceDB `memory_items` table (same DB as code search) | LanceDB custom schema |
| **Within-session** | Agents share discoveries during a single task | Blackboard MCP server | Custom MCP server (TypeScript) |
| **Inter-agent** | Agents on separate worktrees stay in sync | Task list + blackboard events | Claude Code teams pattern |

### memU Evaluation

memU (NevaMind-AI) was evaluated as a cross-session memory candidate.

| Aspect | Finding |
|--------|---------|
| Architecture | Three-layer: Resource -> Memory Item -> Category (excellent design) |
| Stars | 8,740 (7 months old, fast growth) |
| MCP | Third-party only (3 stars) |
| **TypeScript/Bun** | **None. Python 3.13+ only. Deal-breaker.** |
| Persistence | Requires PostgreSQL + pgvector |
| License | Non-standard ("Other") |

**Verdict:** Strong concept, wrong stack. The three-layer hierarchy pattern is worth borrowing but must be built in TypeScript on LanceDB.

_Sources: [memU GitHub](https://github.com/NevaMind-AI/memU), [memU Architecture](https://memu.pro/ai-agent-memory-storage), [memU User Models](https://memu.pro/user-models-context)_

### Cross-Session Memory: LanceDB Custom

**Why LanceDB custom (not Mem0, not Zep, not memU):**

1. **Already in the stack** -- zero new dependencies
2. **Unified search** -- code + decisions in one query = Context Intelligence
3. **Local-first** -- no PostgreSQL, no cloud, no API keys for memory
4. **TypeScript-native** -- runs in Bun sidecar, no FFI for memory operations

**Memory schema (same LanceDB instance, different tables):**

```
LanceDB instance
  ├── code_chunks     → semantic code search (existing)
  └── memory_items    → decisions, preferences, session summaries (new)
```

**Memory item structure:**
- `type`: decision | preference | architecture | session_summary | pattern
- `category`: e.g., "state_management", "testing", "auth"
- `content`: natural language description
- `embedding`: Float32Array for semantic search
- `project`: project identifier (project-scoped isolation)
- `agent_type`: which agent created it (orchestrator/phase/worker)
- `confidence`: 0.0-1.0
- `related_files`: affected source files

**MCP tools exposed:**
- `memory_add(type, category, content, metadata)` -- agents store decisions
- `memory_search(query, filters)` -- agents retrieve relevant context
- `memory_get_category(category)` -- get all decisions in a category
- `memory_get_project(project)` -- get all decisions for a project

**Phase 2 upgrade path:** Migrate to Mem0 when graph relationships are needed ("Decision X relates to Component Y"). Mem0 has 186M API calls/month, MCP server, self-hosted option. Keep LanceDB for code search.

_Sources: [Mem0 GitHub](https://github.com/mem0ai/mem0), [Mem0 MCP](https://github.com/mem0ai/mem0-mcp), [Zep/Graphiti](https://github.com/getzep/graphiti), [Letta](https://github.com/letta-ai/letta)_

### Other Memory Systems Evaluated

| System | MCP | TS/Bun | Self-hosted | Best For | Why Not MVP |
|--------|:---:|:------:|:-----------:|----------|-------------|
| Mem0 | Yes | Partial | Yes | Graph relationships | Phase 2 upgrade |
| Zep/Graphiti | Yes | Yes | Yes | Temporal knowledge graphs | Overkill for MVP |
| Letta | No | Yes (SDK) | Yes | Stateful agents | No MCP, heavy |
| claude-mem | Yes | Yes | Yes | Auto-capture | Early stage |
| LangGraph Memory | No | Yes | Yes | LangChain ecosystem | Ecosystem lock-in |

_Sources: [Shared Memory MCP](https://github.com/haasonsaas/shared-memory-mcp), [MCP Memory Service](https://github.com/doobidoo/mcp-memory-service), [AI Apps with MCP Memory 2026](https://research.aimultiple.com/memory-mcp/)_

### Within-Session Memory: Blackboard Architecture

Research found blackboard architecture shows **13-57% improvement** over master-slave patterns for LLM-based multi-agent systems.

**Pattern:** A shared MCP server where agents post decisions, observations, and summaries. No direct agent-to-agent messaging required.

**Blackboard MCP server tools:**
- `blackboard_post(phase, type, content, author, references)` -- post to shared state
- `blackboard_query(phase, type, author)` -- query shared state
- Resource notifications when blackboard updates (real-time)

**Token budget allocation per tier:**

| Tier | Budget | Allocation |
|------|--------|------------|
| Orchestrator | 120-150k (soft target) | Phase summaries (20k) + plan (10k) + decision log (10k) + buffer (80-110k) |
| Phase Agent | 100k (soft target) | Prior summaries (5k) + current history (40k) + working context (30k) + buffer (25k) |
| Specialist Agent | 100k (soft target) | Task description (5k) + relevant code (50k) + decisions (10k) + buffer (35k) |
| Research Agent | 150k (soft target) | Query context (10k) + search results (70k) + analysis (40k) + buffer (30k) |

**Note:** These are design targets, not hard ceilings. MCP lazy loading with a ToolSearch-style mechanism is the primary lever for keeping actual usage below targets.

**Key pattern -- Narrative Casting:** When a phase agent hands off to the next phase, it writes a narrative summary, not raw conversation history. The next agent reads this as system context. This prevents hallucination of prior agent actions and compresses context.

**Phase 2 upgrade:** Shared Memory MCP (haasonsaas) achieves 6x token efficiency by sending only deltas instead of full state retransmission. Evaluate when parallel agent coordination becomes a bottleneck.

_Sources: [Blackboard Architecture for LLM Agents](https://arxiv.org/abs/2507.01701), [Microsoft Multi-Agent Memory](https://microsoft.github.io/multi-agent-reference-architecture/docs/memory/Memory.html), [JetBrains Context Management](https://blog.jetbrains.com/research/2025/12/efficient-context-management/)_

---

## Inter-Agent Communication on Separate Worktrees

### Claude Code Teams Pattern (Feb 2026 Reference)

CodeMAD's agent coordination follows the Claude Code teams model:

| Component | Implementation |
|-----------|---------------|
| Lead orchestration | Lead creates tasks, assigns teammates, does NOT implement. Stays under 120k tokens. |
| Message passing | SendMessage tool with types: direct, broadcast, shutdown, plan_approval |
| Task coordination | Shared task list (create/update/list/get) with blockedBy/blocks dependencies |
| File ownership | Explicit scope in spawn prompt prevents conflicts |
| Idle/wake | Agents idle between turns, wake on message delivery |
| Scale proof | 16 agents built 100k-line Rust C compiler for Linux kernel |

**At scale:** Claude Code teams achieved this with pure message passing + task lists. No shared memory server. No event bus. The simplicity of the pattern is its strength.

_Sources: [Claude Code Agent Teams](https://code.claude.com/docs/en/sub-agents), [Claude Opus 4.6 Teams Guide](https://www.nxcode.io/resources/news/claude-agent-teams-parallel-ai-development-guide-2026), [From Tasks to Swarms](https://alexop.dev/posts/from-tasks-to-swarms-agent-teams-in-claude-code/)_

### Git Worktree Agent Coordination

Each CodeMAD agent works in its own git worktree. Coordination handles:

1. **Dependency ordering** -- Task list `blockedBy`/`blocks` fields ensure Agent B waits for Agent A
2. **Merge coordination** -- Agents merge completed worktrees back. Conflict detection before merge.
3. **Discovery sharing** -- Agents post findings to blackboard. Others query when needed.

**Communication flow:**

```
Phase Agent (orchestrator for its phase)
    |
    +-- Blackboard MCP Server (shared state)
    |     +-- decisions[]
    |     +-- observations[]
    |     +-- task_status[]
    |     +-- discoveries[]
    |
    +-- Worker A (worktree-1) --> posts results to blackboard
    |
    +-- Worker B (worktree-2) --> reads A's decisions before starting
```

**Real-world validation:**
- **Cursor** uses git worktrees for background agent isolation
- **Devin** uses dual-agent (planner + executor) with continuous dialogue loop
- **Windsurf Cascade** supports 5+ parallel agents with graph-based reasoning

### MCP-Based Agent Communication

MCP can serve as both the tool protocol AND the inter-agent message bus:

- **Agent-to-tool:** Standard MCP tool calls (semantic search, file operations)
- **Agent-to-agent:** Blackboard MCP server with resource notifications
- **Real-time updates:** MCP notifications/subscriptions for event-driven coordination

**MCP + A2A complementary:** MCP handles agent-to-tool communication. Google's A2A protocol handles agent-to-agent. Both can coexist.

_Sources: [MCP Agent Communication](https://aws.amazon.com/blogs/opensource/open-protocols-for-agent-interoperability-part-1-inter-agent-communication-on-mcp/), [A2A + MCP](https://developer.microsoft.com/blog/can-you-build-agent2agent-communication-on-mcp-yes), [Devin Architecture](https://www.cognition.ai/blog/devin-2-0)_

---

## Updated Technology Stack Decisions (All Locked)

| # | Decision | Choice | Confidence | Key Evidence |
|---|----------|--------|-----------|--------------|
| 1 | Architecture | **Option A: Rust thin + Bun sidecar + WebView** | 95% | Claude Code proves pattern in production |
| 2 | Runtime | **Bun** (Node.js fallback plan) | 85% | Anthropic-backed, test LanceDB/tree-sitter first |
| 3 | UI Framework | **Svelte 5** | 85% | Best SSE streaming (runes), 30-40% less code, 1-2MB bundle |
| 4 | API Framework | **Hono + tRPC** | 92% | Multi-runtime + zero-codegen type safety |
| 5 | LLM SDK | **Vercel AI SDK v6** | 95% | Best provider coverage, MCP support, Chinese providers |
| 6 | Vector DB | **LanceDB** | 95% | Continue AI validates, unified code+memory search |
| 7 | Monorepo | **pnpm + Turborepo** | 92% | Fastest at CodeMAD scale, minimal config |
| 8 | Linting | **Biome** | 90% | 10-25x faster, zero deps |
| 9 | Testing | **Vitest** (frontend) + **cargo test** (Rust) | 90% | Fastest, Vite-native |
| 10 | Cross-session memory | **LanceDB custom** (Phase 2: Mem0) | 88% | Already in stack, unified Context Intelligence |
| 11 | Within-session memory | **Blackboard MCP server** | 85% | 13-57% improvement over master-slave patterns |
| 12 | Agent communication | **Task list + blackboard events** (Claude Code teams pattern) | 90% | Proven at 16 agents, 100k lines |

## Memory Evolution Roadmap

| Phase | Cross-Session | Within-Session | Inter-Agent | Trigger |
|-------|--------------|----------------|-------------|---------|
| **MVP** | LanceDB `memory_items` table | Blackboard MCP server | Task list + blackboard events | Ship v0.1 |
| **Phase 2** | **Mem0** (graph relationships, LLM compression) | **Shared Memory MCP** (6x token efficiency) | + A2A protocol for external agents | When flat categories limit decision linking, or token budget is bottleneck |
| **Phase 3** | **Unified Context Intelligence** (code + memory + decisions in one search) | Adaptive compression (importance-weighted) | Cross-framework agent interop | When multiple memory sources need unification |

**MVP memory capabilities:**
- Agents store decisions, preferences, and session summaries in LanceDB
- New sessions retrieve relevant context via semantic search
- Within-session agents share discoveries via blackboard without filling each other's context
- Token budgets enforced per tier (orchestrator 120k, phase 50k, worker 10k)

**Phase 2 memory upgrades (when needed):**
- **Mem0** adds graph relationships ("Decision X relates to Component Y") and LLM-powered compression (1000 tokens to 50 tokens). 186M API calls/month proves production readiness. Self-hosted option available with MCP server.
- **Shared Memory MCP** (haasonsaas) adds delta-based context updates. Agents receive only new information since their last check, achieving 6x token efficiency for parallel coordination.
- **Zep/Graphiti** as alternative to Mem0 if temporal knowledge graphs are needed (when decisions happened, in what order, what invalidated what).

**Phase 3 vision -- Unified Context Intelligence:**
```
Single search across:
  Code chunks (LanceDB)     -> "How is auth implemented?"
  Memory items (LanceDB)    -> "What did we decide about auth?"
  Graph relations (Mem0)    -> "What depends on the auth decision?"
```

This IS the "Context Intelligence" breakthrough concept from the brainstorming session: "Unified memory + semantic search. Agents search code AND decisions as one knowledge layer." The MVP delivers the foundation. Phase 2 adds relationships. Phase 3 unifies everything.

_Sources: [Mem0 GitHub](https://github.com/mem0ai/mem0), [Shared Memory MCP](https://github.com/haasonsaas/shared-memory-mcp), [Zep/Graphiti](https://github.com/getzep/graphiti), [2026 Contextual Intelligence](https://siliconangle.com/2026/01/18/2026-data-predictions-scaling-ai-agents-via-contextual-intelligence/)_

---
