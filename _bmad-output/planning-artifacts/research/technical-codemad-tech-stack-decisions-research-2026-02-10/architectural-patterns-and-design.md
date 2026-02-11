# Architectural Patterns and Design

**Research Coverage:** 4 parallel streams covering desktop process architecture, multi-agent orchestration, state/data management, and security/plugin patterns. 120+ sources.

---

## System Architecture: Process Model

### Recommended: Tauri Core + Bun Sidecar + WebView

The production-proven pattern for CodeMAD's desktop architecture:

```
┌─────────────────────────────────────────────────┐
│                   Tauri Shell                    │
│                   (Rust Core)                    │
│                                                  │
│  Responsibilities:                               │
│  - Window management and native menus            │
│  - Sidecar lifecycle (spawn, monitor, restart)   │
│  - OS-level permissions and capability gates      │
│  - File system sandboxing                        │
│  - Auto-updater and crash reporting              │
│  - Keychain access (tauri-plugin-keyring)        │
│                                                  │
├──────────┬──────────────────────┬────────────────┤
│          │                      │                │
│  ┌───────▼───────┐    ┌────────▼────────┐       │
│  │   WebView     │    │  Bun Sidecar    │       │
│  │  (Frontend)   │    │  (TS Backend)   │       │
│  │               │    │                 │       │
│  │  UI rendering │    │  LLM providers  │       │
│  │  State mgmt   │◄──►│  Agent system   │       │
│  │  User input   │HTTP│  MCP servers    │       │
│  │               │SSE │  Git operations │       │
│  │               │    │  Semantic search│       │
│  └───────────────┘    │  File watching  │       │
│                       └─────────────────┘       │
└─────────────────────────────────────────────────┘
```

**Why this split:** Rust handles what it excels at -- process management, file handles, sandboxing, native APIs. TypeScript handles the application logic where the ecosystem is richest. The sidecar pattern is validated by Claude Code (Bun sidecar), Warp Terminal, and Cody Desktop.

_Sources: [Tauri Architecture](https://v2.tauri.app/concept/architecture/), [Tauri Process Model](https://v2.tauri.app/concept/process-model/), [Warp: How It Works](https://www.warp.dev/blog/how-warp-works)_

### Process Supervision

The Rust core acts as supervisor for all child processes. Inspired by Erlang/OTP supervision trees:

| Process | Restart Policy | Max Retries | Timeout |
|---------|---------------|-------------|---------|
| Bun sidecar | Always restart | 3 in 60s | 10s |
| MCP servers (stdio) | Restart on crash | 3 in 60s | 30s |
| Git operations | No restart (one-shot) | N/A | 120s |
| File watcher | Always restart | 5 in 60s | 5s |

If a child exceeds its restart limit, the supervisor notifies the frontend (degraded mode) rather than crashing the entire app.

**Implementation options:**
- **Rust-native:** `supertrees` crate (Erlang-inspired, async)
- **Node.js-side:** PMDaemon or custom supervisor
- **Tauri built-in:** `app_handle.shell().sidecar()` with event listeners for exit/error

_Sources: [Erlang Supervisor Behaviour](https://www.erlang.org/docs/24/design_principles/sup_princ), [supertrees crate](https://docs.rs/supertrees)_

---

## Agent Orchestration Architecture

### Four-Tier Agent Hierarchy (Validated)

The project spec's four-tier hierarchy (Orchestrator, Phase Agents, Specialist Agents, Research Agents) aligns with production patterns from Claude Code teams and Cursor.

| Tier | CodeMAD Name | Claude Code Equivalent | Role |
|------|-------------|----------------------|------|
| 1 | Orchestrator | Lead Agent | Task creation, assignment, synthesis |
| 2 | Phase Agent | Teammate | Owns a workflow phase (Analysis, Design, Build, QA) |
| 3 | Specialist Agent | Subagent | Single-purpose tasks (<30s) |
| 4 | Research Agent | Research Teammate | Deep investigation, web search, multi-source analysis |

**Key design choices from production implementations:**

1. **Task DAGs, not linear lists.** Claude Code teams use directed acyclic graphs for dependencies. Task B can start before Task A finishes if they are independent. This enables genuine parallelism.

2. **File ownership prevents conflicts.** Cursor assigns each parallel agent its own git worktree. Claude Code assigns file ownership through task descriptions. Two agents editing the same file causes overwrites -- prevent this architecturally.

3. **Context isolation is mandatory.** Each agent gets its own context window. Shared state lives in the filesystem (task lists, output files), not in agent memory. This matches CodeMAD's git worktree isolation design.

_Sources: [Claude Code Agent Teams](https://code.claude.com/docs/en/agent-teams), [Anthropic: Building a C compiler with parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler), [Cursor Parallel Agents](https://cursor.com/docs/configuration/worktrees)_

### Agent State Machine

Production AI tools use explicit state machines for agent lifecycle. XState v5 is the TypeScript standard.

```
                    ┌──────────┐
                    │   Idle   │
                    └────┬─────┘
                         │ assign_task
                    ┌────▼─────┐
              ┌─────│ Planning │◄────────────┐
              │     └────┬─────┘             │
              │          │ plan_ready         │ revision_needed
              │     ┌────▼─────┐             │
              │     │Executing │─────────────┤
              │     └────┬─────┘             │
              │          │ execution_done     │
              │     ┌────▼─────┐             │
              │     │Reviewing │─────────────┘
              │     └────┬─────┘
              │          │ review_passed
              │     ┌────▼──────┐
              │     │ Completed │
              │     └───────────┘
              │
              │ error (any state)
         ┌────▼─────┐
         │  Error   │──retry──► (previous state)
         └────┬─────┘
              │ max_retries_exceeded
         ┌────▼──────┐
         │ Escalated │──► human review
         └───────────┘
```

**XState advantages for CodeMAD:**
- Type-safe state transitions (TypeScript v5.0+ inference)
- Hierarchical sub-states (Executing can contain sub-machine for tool calls)
- Guards for conditional transitions (check token budget before executing)
- Built-in event queuing (agents process events sequentially)
- State history for debugging and audit trails

**Alternative:** For simple agents with 5-8 fixed states, a custom enum-based state machine avoids XState's learning curve. Use XState only for orchestrator and phase agents where state complexity justifies it.

_Sources: [XState Documentation](https://stately.ai/docs/xstate), [Stately Agent Framework](https://stately.ai/agent)_

### Context Management Strategy

Production teams budget 60-65% of advertised context windows as reliable working space.

| Agent Role | Token Budget | Strategy |
|-----------|-------------|----------|
| Orchestrator | 120-150k (soft target) | Minimal context. Task list + summaries only |
| Phase Agent | 100k (soft target) | Full file context for owned files |
| Specialist Agent | 100k (soft target) | Single file + instructions |
| Research Agent | 150k (soft target) | Deep retrieval context |

**Note:** These are design targets, not hard ceilings. MCP lazy loading with a ToolSearch-style mechanism is the primary lever for keeping actual usage below targets.

**Compression triggers (MemGPT-inspired):**

| Utilisation | Action |
|-------------|--------|
| 70% | Compress conversation history (keep recent, summarise old) |
| 85% | Switch to RAG for earlier conversation turns |
| 95% | Escalate to human or fail gracefully |

**Selective context loading** reduces effective context by 30-40% without accuracy loss:
- Remove import statements (agent infers from usage)
- Compress test files to assertion signatures only
- Summarise docstrings that do not affect current task
- Time-decay: older code chunks compressed more aggressively

_Sources: [MemGPT Memory Architecture](https://letta.com/blog/agent-memory), [Factory.ai Context Compression](https://factory.ai/news/compressing-context)_

### Progressive Quality Gates

The builder-validator pattern extends to a staged pipeline:

| Gate | Time | Threshold | Action on Fail |
|------|------|-----------|----------------|
| 1. Lint | ~5s | 0 violations | Agent auto-fixes |
| 2. Type check | ~15s | 0 errors | Agent analyses error, retries |
| 3. Unit tests | ~30s | All pass, >90% coverage | Agent reads failure, adjusts |
| 4. Build | ~60s | Clean compile | Agent reads build log |
| 5. Security scan | ~20s | 0 critical/high | Agent reviews finding, fixes |

**Failure recovery data (from Galileo research):**
- 87% of agent failures resolved at retry stage (different strategy each attempt)
- 11% resolved by requesting specialist agent help
- 2% require human intervention

**Exit code 2 pattern:** When a quality gate fails, the stop hook returns exit code 2, forcing the agent to continue working rather than reporting false completion.

_Sources: [InfoQ: Pipeline Quality Gates](https://www.infoq.com/articles/pipeline-quality-gates/), [Galileo: Multi-Agent Failure Recovery](https://galileo.ai/blog/multi-agent-ai-system-failure-recovery)_

---

## Data Architecture

### Frontend State Management

**2026 consensus:** Zustand dominates at 40% adoption (30%+ YoY growth). React Query handles server state (80%+ adoption for API data).

| Library | Adoption | Best For | Bundle |
|---------|----------|----------|--------|
| Zustand | 40% | Client state (UI, conversations) | 1.1KB |
| React Query | 80%+ (server state) | API responses, caching, sync | ~12KB |
| Redux Toolkit | ~10% | Strict enterprise consistency | ~11KB |
| Jotai | Growing | Fine-grained atom-based state | ~3KB |
| Pinia (Vue) | Standard for Vue | Vue equivalent of Zustand | ~1.5KB |

**Note:** If SolidJS is chosen, built-in `createStore` replaces Zustand. If Svelte, Runes and built-in stores replace both. This decision cascades from the UI framework choice.

**Conversation state structure (proven pattern):**

```typescript
interface ConversationState {
  conversations: Map<string, Conversation>
  activeConversationId: string | null
  // Per conversation:
  messages: Message[]
  streamingMessage: Partial<Message> | null
  isStreaming: boolean  // Critical: prevents race conditions
  toolCalls: ToolCall[]
  agentActivity: AgentStatus[]
}
```

_Sources: [npm trends Zustand](https://npmtrends.com/zustand-vs-redux-vs-jotai), [Cursor Architecture](https://newsletter.pragmaticengineer.com/p/cursor)_

### Data Flow: Double Streaming Pattern

LLM API keys must not reach the frontend. This creates a "double stream":

```
LLM Provider  ──SSE──►  Bun Sidecar  ──SSE──►  Frontend (WebView)
                         (transforms,            (renders tokens,
                          tool calls,             updates UI state)
                          rate limiting)
```

1. Frontend sends user message via HTTP POST to sidecar
2. Sidecar calls LLM provider, receives SSE stream
3. Sidecar re-emits as SSE to frontend with enriched metadata (agent ID, phase, tool call status)
4. Frontend's `EventSource` API handles auto-reconnection

**SSE event types for multi-agent UIs:**

| Event | Purpose | Payload |
|-------|---------|---------|
| `token` | Streaming text content | `{ agentId, text, index }` |
| `tool_start` | Tool invocation begins | `{ agentId, toolName, args }` |
| `tool_result` | Tool returns data | `{ agentId, toolName, result }` |
| `status` | Agent state change | `{ agentId, state, phase }` |
| `error` | Error notification | `{ agentId, code, message }` |
| `done` | Stream complete | `{ agentId, usage }` |

**Why SSE over WebSocket:** SSE auto-reconnects, works through proxies, is simpler to implement, and LLM streaming is unidirectional (server to client). Use WebSocket only if bidirectional real-time updates prove necessary (e.g., collaborative editing).

_Sources: [SSE for AI Agent Streaming](https://akanuragkumar.medium.com/streaming-ai-agents-responses-with-server-sent-events-sse-a-technical-case-study-f3ac855d0755), [SSE is King for LLM Streaming](https://medium.com/@FrankGoortani/sse-is-the-king-0559dcb0cb3d)_

### Project State Persistence

**XDG Base Directory Standard** is the cross-platform convention:

| Type | macOS | Linux | Windows |
|------|-------|-------|---------|
| Config | `~/Library/Application Support/CodeMAD/` | `~/.config/codemad/` | `%APPDATA%\CodeMAD\` |
| Data | Same as config (macOS) | `~/.local/share/codemad/` | `%LOCALAPPDATA%\CodeMAD\` |
| Cache | `~/Library/Caches/CodeMAD/` | `~/.cache/codemad/` | `%TEMP%\CodeMAD\` |
| Workspace | `<project>/.codemad/` | `<project>/.codemad/` | `<project>\.codemad\` |

**Layered settings resolution:**

| Priority | Source | Scope |
|----------|--------|-------|
| 1 | CLI flags / env vars | Session |
| 2 | `.codemad/config.json` | Project-scoped |
| 3 | Global config dir | User-scoped |
| 4 | Built-in defaults | Application |

**Crash recovery (two-phase):**
1. **Fast load** (~100ms): Read last known good state from local JSON checkpoint
2. **Async rebuild** (~2-5s): Re-validate against git status, re-index if needed, reconcile any stale agent states

_Sources: [XDG Base Directory Spec](https://specifications.freedesktop.org/basedir-spec/latest/), [Tauri path-plugin](https://v2.tauri.app/plugin/file-system/)_

### File Watching and Incremental Indexing

| Watcher | Repos Supported | Platform | Notes |
|---------|----------------|----------|-------|
| Chokidar | 30M+ repos use it | All | Most battle-tested, 9.7KB |
| Tauri fs-watch | N/A (built-in) | All | Rust-native, best for Tauri apps |
| `fs.watch` (Node) | N/A | All | Unreliable on Linux, no recursive on some platforms |

**Recommended:** Use Tauri's built-in file watcher from the Rust core for OS-native performance. Forward change events to the Bun sidecar for indexing.

**Debouncing strategy:**

| File Type | Debounce Window | Rationale |
|-----------|----------------|-----------|
| Source code | 500-1000ms | Typical save interval during editing |
| Config files | 200ms | Changes are intentional and infrequent |
| Lock files | Ignore | Generated files, not user content |
| node_modules | Ignore | Exclude from indexing entirely |

**Incremental re-indexing pipeline:**
1. File watcher detects change
2. tree-sitter incrementally re-parses AST (1-5ms vs 10-100ms full parse)
3. Chunker extracts only changed functions/classes
4. Embedding model re-embeds only changed chunks
5. LanceDB upserts updated vectors (content hash as key)
6. Result: 99% reduction vs full re-index

_Sources: [Chokidar npm](https://www.npmjs.com/package/chokidar), [tree-sitter Docs](https://tree-sitter.github.io/tree-sitter/)_

### Caching Architecture

Multi-layer cache with semantic deduplication for LLM calls:

| Layer | Latency | Storage | Eviction | Use |
|-------|---------|---------|----------|-----|
| Memory (LRU) | <1ms | 50-200MB | LRU | Hot embeddings, recent tool results |
| Disk (SQLite) | 1-50ms | 1-5GB | TTL + LRU | AST parses, embedding cache, session state |
| Semantic cache | 10-50ms | LanceDB | Cosine threshold | LLM response deduplication |
| Recompute | 100ms-10s | None | N/A | Cache miss fallback |

**Semantic caching for LLM responses:**
- Hash the prompt embedding, not the raw text
- Cosine similarity threshold: 0.85-0.95 (tune per use case)
- Cache hit → return stored response (no API call)
- **Measured savings:** 60-73% API cost reduction in production systems

**Cache invalidation:**
- Embedding cache: Content hash of source file. If hash changes, re-embed.
- AST cache: File modification timestamp + content hash.
- LLM response cache: TTL (e.g., 24h for code explanations, never for deterministic transforms).

_Sources: [Semantic Caching Research](https://arxiv.org/abs/2311.04934), [Continue AI Incremental Indexing](https://docs.continue.dev/)_

---

## Security Architecture

### Permission Model

Claude Code's production permission system provides the reference pattern. It reduced permission prompts by **84%** through intelligent defaults and path-based rules.

**Three-layer permission model for CodeMAD:**

| Layer | Scope | Examples |
|-------|-------|---------|
| Capability gates (Rust) | OS-level | File system paths, network access, process spawning |
| Application permissions (Sidecar) | Feature-level | Which tools agents can use, which directories agents can write |
| User approval (Frontend) | Action-level | Destructive operations, external API calls, git push |

**Tauri 2.x capability-based permissions:**
- Each window/WebView has its own capability set
- Capabilities restrict which IPC commands the frontend can invoke
- Scopes further narrow capabilities (e.g., allow `fs:read` but only in project directory)
- Plugins declare required permissions in `capabilities/*.json`

_Sources: [Tauri Security Model](https://v2.tauri.app/security/), [Claude Code Permission System](https://code.claude.com/docs/en/security)_

### Agent Sandboxing

| Approach | Isolation Level | Performance | Used By |
|----------|----------------|-------------|---------|
| Git worktree | File-level | Minimal overhead | Cursor, ccswarm |
| Process sandbox | Process-level | Low overhead | Claude Code (macOS sandbox-exec) |
| Container/VM | Full isolation | Higher overhead | Devin, OpenAI Codex |
| Capability restriction | API-level | No overhead | Tauri 2.x |

**Recommended for CodeMAD:**
- **Development agents:** Git worktree isolation (file-level). Agents cannot modify files outside their worktree.
- **MCP tool execution:** Tauri capability restrictions. Tools declare required permissions; user approves at install time.
- **Shell commands:** Process-level sandbox via Rust. Restrict network access, limit CPU/memory, timeout enforcement.

### Plugin Architecture via MCP

MCP serves as CodeMAD's plugin system. The architecture follows VS Code's proven isolation pattern:

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Frontend   │     │   MCP Proxy      │     │ MCP Server  │
│   (WebView)  │◄───►│   (Sidecar)      │◄───►│  (Plugin)   │
│              │     │                  │     │             │
│  Tool UI     │     │  Capability gate │     │  Tools      │
│  Result view │     │  Rate limiting   │     │  Resources  │
│              │     │  Token budgeting │     │  Prompts    │
└──────────────┘     └──────────────────┘     └─────────────┘
```

**Key design decisions:**
1. **Proxy-mediated access.** No direct frontend-to-MCP-server communication. The sidecar acts as proxy, enforcing capability gates and rate limits.
2. **Lazy tool loading.** Do not load all MCP tool definitions at startup (costs 10k+ tokens). Connect to servers on demand.
3. **Plugin lifecycle:** Install → Enable → Configure → Update → Disable → Uninstall. Persistent state in project-scoped config.
4. **Security scanning:** Validate MCP server manifests before installation. Check for excessive permission requests.

_Sources: [VS Code Extension Host Architecture](https://code.visualstudio.com/api/advanced-topics/extension-host), [MCP Specification](https://modelcontextprotocol.io/specification/2025-11-25)_

### Code Generation Safety

**Critical finding:** 40% of AI-generated code contains vulnerabilities (2025 research). CodeMAD must scan generated code before committing.

| Tool | Approach | Speed | Coverage | Best For |
|------|----------|-------|----------|----------|
| Semgrep | Rule-based SAST | Fast (seconds) | 30+ languages, OWASP rules | Local, real-time scanning |
| Snyk Code | ML-based SAST | Medium | Broad | Deep vulnerability detection |
| CodeQL | Query-based | Slow | GitHub-integrated | CI/CD pipeline |

**Recommended pattern:** Run Semgrep in the quality gate pipeline (Gate 5). Use the continuous micro-review idea from brainstorming -- scan as code is generated, not after the full file is written.

_Sources: [OWASP Top 10 2025](https://owasp.org/www-project-top-ten/), [Pillar Security: AI Code Vulnerabilities](https://www.pillar.security/blog/new-research-40-percent-of-ai-generated-code-is-insecure)_

---

## Design Principles Applied to CodeMAD

### Hexagonal Architecture (Ports and Adapters)

The sidecar's TypeScript codebase should use hexagonal architecture for provider abstraction:

```
Domain Layer (innermost)
├── Entities: Conversation, Agent, Project, Phase
├── Use Cases: StreamCompletion, SearchCode, RunQualityGate

Application Layer
├── Services: ConversationService, AgentOrchestrator, IndexService
├── Ports (interfaces):
│   ├── ILLMProvider (complete, streamComplete, toolCall)
│   ├── IVectorStore (upsert, search, delete)
│   ├── IGitAdapter (status, branch, worktree, merge)
│   ├── IFileWatcher (watch, onChange)
│   └── ICredentialStore (get, set, delete)

Adapter Layer (outermost)
├── LLM: AnthropicAdapter, OpenAIAdapter, GoogleAdapter, ZhipuAdapter, MoonshotAdapter
├── Vector: LanceDBAdapter
├── Git: GitBinaryAdapter (shells to git CLI)
├── Watch: TauriWatcherAdapter, ChokidarAdapter
└── Credentials: KeychainAdapter, FileAdapter
```

**Why hexagonal:** Swapping LLM providers, vector databases, or git implementations requires changing only the adapter, not the business logic. Testing uses mock adapters with no API calls.

_Sources: [Hexagonal Architecture in TypeScript](https://dev.to/dyarleniber/hexagonal-architecture-and-clean-architecture-with-examples-48oi), [Khalil Stemmler: Enterprise TypeScript](https://khalilstemmler.com/articles/enterprise-typescript-nodejs/clean-nodejs-architecture/)_

### Event-Driven Internal Communication

Inside the sidecar, use an event bus to decouple subsystems:

| Event | Emitter | Subscribers |
|-------|---------|-------------|
| `file:changed` | File watcher | Indexer, AST cache, agent context |
| `agent:status` | Agent orchestrator | Frontend (SSE), logger |
| `llm:stream` | LLM adapter | Conversation service, token counter |
| `tool:executed` | MCP proxy | Logger, permission audit, agent context |
| `quality:gate` | QA pipeline | Agent (retry/complete), frontend |

**Implementation:** Lightweight typed event bus (e.g., mitt or ts-bus, both <1KB). Not Kafka -- overkill for a desktop app. Events stay in-process within the sidecar.

_Sources: [ts-bus](https://github.com/ryardley/ts-bus), [Tauri Events](https://v2.tauri.app/develop/calling-rust/)_

### Offline-First with Graceful Degradation

| Feature | Offline | Degraded | Full |
|---------|---------|----------|------|
| Code editing | Full | Full | Full |
| Git operations | Full (local) | Full (local) | Push/pull available |
| Semantic search | Full (local LanceDB) | Full | Full |
| LLM completions | Local model only | Fallback provider | All providers |
| MCP tools (local) | Full | Full | Full |
| MCP tools (remote) | Unavailable | Unavailable | Full |
| File watching | Full | Full | Full |

**Key principle:** Everything that can run locally, does run locally. Network is for LLM APIs and remote MCP servers only.

_Sources: [LogRocket: Offline-First 2025](https://blog.logrocket.com/offline-first-frontend-apps-2025-indexeddb-sqlite/), [DEV: Local-First 2026](https://dev.to/the_nortern_dev/the-architecture-shift-why-im-betting-on-local-first-in-2026-1nh6)_

---

## Architectural Patterns Summary

| Pattern | Decision | Validated By |
|---------|----------|-------------|
| Process model | Rust core (thin) + Bun sidecar + WebView | Claude Code, Warp |
| Process supervision | Erlang-inspired restart policies in Rust | supertrees crate |
| Agent hierarchy | Four-tier: Orchestrator → Phase → Specialist → Researcher | Claude Code teams, Cursor |
| Agent state machine | XState v5 for complex agents, enum for simple | Stately Agent Framework |
| Context budgeting | 60-65% of advertised window, compression at 70% | MemGPT, Factory.ai |
| Quality gates | 5-stage progressive pipeline with exit code 2 | Claude Code hooks |
| Frontend state | Framework-dependent (Zustand/built-in/Pinia) | 40% market adoption |
| Data flow | Double streaming (LLM → sidecar → frontend via SSE) | Industry consensus |
| Project config | XDG standard + workspace `.codemad/` | freedesktop spec |
| File indexing | Tauri watcher → tree-sitter → LanceDB upsert | Continue AI, Cody |
| Caching | 4-layer (memory → disk → semantic → recompute) | 60-73% cost savings |
| Permissions | 3-layer (Rust capability → sidecar rules → user approval) | Claude Code (84% reduction) |
| Agent isolation | Git worktree (files) + process sandbox (commands) | Cursor, Devin |
| Plugin system | MCP via proxy with lazy loading | 97M monthly downloads |
| Code safety | Semgrep in quality gate pipeline | OWASP, Pillar Security |
| Internal design | Hexagonal architecture + typed event bus | Production TypeScript patterns |
| Connectivity | Offline-first, network for LLM APIs only | Local-first movement |
