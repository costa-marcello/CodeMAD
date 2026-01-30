# Architecture Patterns for AI Development Platforms

**Domain:** Cross-platform AI Development Platform (CodeMAD)
**Researched:** 2026-01-30
**Confidence:** HIGH (verified against multiple production systems)

## Executive Summary

Analysis of OpenCode (Go/TUI), Claude Code (TypeScript/CLI), Aider (Python/CLI), Cursor, Windsurf, Cline, and emerging patterns reveals a convergent architecture for AI development platforms. The recommended architecture for CodeMAD follows a **layered component model** with clear separation of concerns, event-driven communication, and a central context store.

---

## Recommended Architecture

```
+------------------------------------------------------------------+
|                        PRESENTATION LAYER                        |
|  +------------------+  +------------------+  +------------------+ |
|  |   Desktop Shell  |  |   Chat Panel     |  |   Code Editor    | |
|  |    (Tauri)       |  |   (React)        |  |   (Monaco/CM)    | |
|  +------------------+  +------------------+  +------------------+ |
+------------------------------------------------------------------+
                              |
                    Event Bus / IPC Bridge
                              |
+------------------------------------------------------------------+
|                      ORCHESTRATION LAYER                         |
|  +------------------+  +------------------+  +------------------+ |
|  |   Workflow       |  |   Session        |  |   Agent          | |
|  |   Controller     |  |   Manager        |  |   Coordinator    | |
|  +------------------+  +------------------+  +------------------+ |
+------------------------------------------------------------------+
                              |
                        Context Store
                              |
+------------------------------------------------------------------+
|                       INTELLIGENCE LAYER                         |
|  +------------------+  +------------------+  +------------------+ |
|  |   LLM Gateway    |  |   Context        |  |   Tool           | |
|  |   (Multi-provider)|  |   Intelligence   |  |   Executor       | |
|  +------------------+  +------------------+  +------------------+ |
+------------------------------------------------------------------+
                              |
+------------------------------------------------------------------+
|                      INTEGRATION LAYER                           |
|  +--------+  +--------+  +--------+  +--------+  +--------+     |
|  |  LSP   |  |  Git   |  |  MCP   |  |  FS    |  | Vector |     |
|  | Bridge |  | Engine |  | Server |  | Watch  |  |   DB   |     |
|  +--------+  +--------+  +--------+  +--------+  +--------+     |
+------------------------------------------------------------------+
```

---

## Component Boundaries

### 1. Presentation Layer

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| **Desktop Shell** | Window management, system tray, native menus, cross-platform chrome | Orchestration Layer via IPC |
| **Chat Panel** | User input, message display, streaming responses, tool call visualization | Session Manager, Agent Coordinator |
| **Code Editor** | File editing, syntax highlighting, diff views, inline suggestions | Context Intelligence, Tool Executor |
| **Worktree Tabs** | Multi-worktree UI, per-agent isolation display | Agent Coordinator, Git Engine |

**Technology recommendation:** Tauri 2.x for shell (lightweight, Rust backend), React for UI components.

**Why Tauri over Electron:**
- 10-20x smaller bundle size (under 10MB vs 100MB+)
- 30-40MB idle RAM vs 250MB+ for Electron
- Native webview means consistent with OS look/feel
- Rust backend provides memory safety and performance

**Trade-off acknowledged:** Tauri uses different webviews per OS (WebKit on macOS, WebView2 on Windows, WebKitGTK on Linux), requiring cross-browser testing.

### 2. Orchestration Layer

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| **Workflow Controller** | Manages Discuss > Plan > Execute > Verify phases, enforces phase transitions | Session Manager, Agent Coordinator |
| **Session Manager** | Session lifecycle, conversation history, checkpoint/restore, persistence | Context Store, all components |
| **Agent Coordinator** | Multi-agent orchestration, worktree allocation, agent-to-task mapping | Tool Executor, Git Engine, LLM Gateway |

**Pattern: Stateless Turn-Based Execution** (from Deep Agent architecture)
```
1. Controller receives request with current state + history
2. Determine active workflow phase
3. Route to appropriate agent(s)
4. Agents execute with context injection
5. Results distilled back to Context Store
6. Phase transition evaluated
```

### 3. Intelligence Layer

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| **LLM Gateway** | Multi-provider abstraction, routing, fallback, rate limiting | All agent-related components |
| **Context Intelligence** | Vector embeddings, LSP integration, hybrid search (semantic + keyword) | Context Store, Editor, Agent Coordinator |
| **Tool Executor** | Tool dispatch, approval workflows, execution sandboxing, result collection | Agent Coordinator, Integration Layer |

### 4. Integration Layer

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| **LSP Bridge** | Multi-language LSP client management, diagnostics collection | Context Intelligence, Tool Executor |
| **Git Engine** | Worktree management, commit/diff operations, conflict detection | Agent Coordinator, Code Review |
| **MCP Server** | Extension point for external tools, protocol handling | Tool Executor |
| **FS Watcher** | File change detection, incremental indexing triggers | Context Intelligence, Vector DB |
| **Vector DB** | Embedding storage, similarity search | Context Intelligence |

---

## Data Flow

### Primary Data Flow: User Prompt to Code Change

```
User Input (Chat)
       |
       v
+------------------+
| Workflow         |  Phase: DISCUSS/PLAN/EXECUTE/VERIFY
| Controller       |
+------------------+
       |
       v
+------------------+
| Session Manager  |  Load context, history, active files
+------------------+
       |
       v
+------------------+
| Context          |  Enrich with:
| Intelligence     |  - Relevant code (vector search)
|                  |  - LSP symbols & diagnostics
|                  |  - Git state
+------------------+
       |
       v
+------------------+
| LLM Gateway      |  Route to provider (Claude/GPT/Gemini/local)
+------------------+
       |
       v
+------------------+
| Agent            |  Parse response, identify tool calls
| Coordinator      |
+------------------+
       |
       v
+------------------+
| Tool Executor    |  Execute: read/write/edit/bash/search
+------------------+
       |
       v
+------------------+
| Code Review      |  Per-hunk review, conflict detection
| (if EXECUTE)     |
+------------------+
       |
       v
+------------------+
| Session Manager  |  Save checkpoint, update history
+------------------+
       |
       v
User Review / Next Turn
```

### Context Intelligence Flow

```
File Changes (FS Watcher)
       |
       v
+------------------+
| Change Detection |  Incremental vs full reindex decision
+------------------+
       |
       +---> Chunking (AST-aware, ~500 chars/chunk)
       |
       v
+------------------+
| Embedding        |  Generate vectors (local or API)
| Generator        |
+------------------+
       |
       v
+------------------+
| Vector DB        |  Store with metadata (file, symbols, imports)
+------------------+

Query Time:
+------------------+
| User Query       |
+------------------+
       |
       +---> Semantic Search (vector similarity)
       +---> Keyword Search (BM25)
       |
       v
+------------------+
| Hybrid Ranker    |  Combine results, re-rank by relevance
+------------------+
       |
       v
+------------------+
| LLM Re-ranker    |  Optional: use LLM to filter/prioritize
| (for large       |
| result sets)     |
+------------------+
       |
       v
Top-k relevant code snippets injected into prompt
```

### Parallel Agent Flow (Worktrees)

```
User requests parallel tasks
       |
       v
+------------------+
| Agent            |  Task decomposition
| Coordinator      |
+------------------+
       |
       +---> Task A ---> Worktree A (git worktree add)
       |                     |
       |                     +---> Agent Instance A
       |                     +---> Isolated FS
       |                     +---> Dedicated branch
       |
       +---> Task B ---> Worktree B
       |                     |
       |                     +---> Agent Instance B
       |                     +---> Isolated FS
       |                     +---> Dedicated branch
       |
       v
+------------------+
| Merge            |  Collect results, detect conflicts
| Coordinator      |
+------------------+
       |
       v
+------------------+
| Code Review      |  Per-hunk review across all changes
+------------------+
       |
       v
User approval for merge to main
```

---

## State Management Architecture

### State Categories

| Category | Scope | Storage | Examples |
|----------|-------|---------|----------|
| **Global State** | Application lifetime | SQLite / IndexedDB | User preferences, API keys, workspace history |
| **Session State** | Per conversation | SQLite + memory | Chat history, active files, workflow phase |
| **Worktree State** | Per agent/task | Git + memory | Branch, pending changes, agent context |
| **Ephemeral State** | Current operation | Memory only | Streaming response, tool execution progress |

### Context Store Design

Following the Deep Agent architecture pattern, implement a **centralized Context Store** that enables "compound intelligence":

```typescript
interface ContextStore {
  // Knowledge accumulation
  addContext(context: Context): ContextId;
  getContext(id: ContextId): Context;

  // Selective injection
  getRelevantContexts(query: string, limit: number): Context[];

  // Distillation
  distillContext(fullContext: Context): DistilledContext;

  // Cross-session persistence
  persist(): void;
  restore(): ContextStore;
}

interface Context {
  id: ContextId;
  type: 'code' | 'documentation' | 'conversation' | 'tool_result';
  content: string;
  embedding?: number[];
  metadata: {
    createdBy: AgentType;
    createdAt: timestamp;
    filePath?: string;
    relevanceScore?: number;
  };
}
```

**Key insight:** Agents work with full context during execution but report only distilled, essential knowledge back to the store. This prevents "context explosion" while preserving institutional memory.

### Session & Checkpoint Architecture

```
Session
  |
  +-- Checkpoint 0 (initial)
  |     |-- Git snapshot (stash or temp commit)
  |     |-- Conversation state
  |     |-- Active files
  |     |-- Workflow phase
  |
  +-- Checkpoint 1 (after tool execution)
  |     |-- ...
  |
  +-- Current State
        |-- Working changes
        |-- Pending tool calls
```

**Checkpoint operations:**
- **Create:** Automatic after each tool execution or phase transition
- **Restore:** User-triggered "undo" returns to previous checkpoint
- **Diff:** Compare any two checkpoints
- **Prune:** Remove old checkpoints to save space

---

## Plugin/Extension Architecture

### Model Context Protocol (MCP) Integration

MCP is the emerging standard ("USB-C port of AI applications") for extending AI tools. CodeMAD should support MCP both as **client** (consuming external MCP servers) and **server** (exposing its capabilities).

```
+------------------+     MCP Protocol      +------------------+
|   External MCP   | <------------------> |   MCP Client     |
|   Servers        |     (JSON-RPC)       |   (in CodeMAD)   |
|   - Database     |                      |                  |
|   - GitHub       |                      +------------------+
|   - Figma        |                              |
|   - Custom       |                              v
+------------------+                      +------------------+
                                          |   Tool Executor  |
                                          +------------------+

+------------------+     MCP Protocol      +------------------+
|   External AI    | <------------------> |   MCP Server     |
|   Clients        |     (JSON-RPC)       |   (CodeMAD)      |
|   - Claude       |                      |   Exposes:       |
|   - Cursor       |                      |   - File ops     |
|   - Custom       |                      |   - Search       |
+------------------+                      |   - Git ops      |
                                          +------------------+
```

### Transport Options

| Transport | Use Case | Implementation |
|-----------|----------|----------------|
| **STDIO** | Local MCP servers launched as subprocess | Spawn process, communicate via stdin/stdout |
| **HTTP/SSE** | Remote MCP servers | HTTP client with SSE for streaming |

### Internal Plugin API

For CodeMAD-specific extensions beyond MCP:

```typescript
interface CodeMADPlugin {
  id: string;
  name: string;

  // Lifecycle
  activate(context: PluginContext): void;
  deactivate(): void;

  // Extension points
  contributeTools?(): Tool[];
  contributeCommands?(): Command[];
  contributeProviders?(): LLMProvider[];
  contributeWorkflowPhases?(): WorkflowPhase[];

  // Hooks
  onSessionStart?(session: Session): void;
  onToolExecution?(tool: Tool, args: any): ToolHookResult;
  onCodeReview?(hunks: Hunk[]): ReviewHookResult;
}
```

---

## LLM Gateway Architecture

### Multi-Provider Abstraction

```typescript
interface LLMGateway {
  // Unified interface regardless of provider
  complete(request: CompletionRequest): AsyncIterable<CompletionChunk>;

  // Provider management
  registerProvider(provider: LLMProvider): void;
  getAvailableProviders(): ProviderInfo[];

  // Routing
  selectProvider(request: CompletionRequest): LLMProvider;

  // Fallback
  setFallbackChain(providers: LLMProvider[]): void;
}

interface LLMProvider {
  id: string;
  name: string;

  // Capabilities
  maxTokens: number;
  supportsStreaming: boolean;
  supportsTools: boolean;
  supportsPrefill: boolean;

  // Operations
  complete(request: ProviderRequest): AsyncIterable<ProviderChunk>;

  // Health
  checkHealth(): Promise<HealthStatus>;
  getRateLimitStatus(): RateLimitInfo;
}
```

### Routing Strategy

| Factor | Weight | Description |
|--------|--------|-------------|
| **Task complexity** | High | Simple queries to faster/cheaper models |
| **Token budget** | High | Large context to models with higher limits |
| **Cost** | Medium | Route to cheaper provider when quality equivalent |
| **Latency** | Medium | Time-sensitive tasks to faster providers |
| **Availability** | Critical | Automatic failover on errors |

### Supported Providers (Initial)

| Provider | Auth Methods | Notes |
|----------|--------------|-------|
| Anthropic (Claude) | API key, OAuth | Primary recommendation |
| OpenAI (GPT) | API key | Fallback, function calling |
| Google (Gemini) | API key, OAuth | Large context window |
| Local (Ollama/llama.cpp) | None | Privacy-first option |
| Chinese providers | API key | DeepSeek, Qwen, etc. |

---

## Build Order (Dependencies)

Based on component dependencies, recommended implementation order:

### Phase 1: Foundation (Parallel workable)

```
[P1.1] Desktop Shell (Tauri)
  |     - Window management
  |     - IPC bridge setup
  |     - System integration
  |
[P1.2] Session Manager
  |     - SQLite schema
  |     - Basic CRUD
  |     - State serialization
  |
[P1.3] LLM Gateway (single provider)
        - Anthropic integration
        - Streaming support
        - Basic error handling
```

### Phase 2: Core Intelligence (Sequential)

```
[P2.1] Tool Executor Framework
  |     Depends on: P1.2 (Session), P1.3 (LLM)
  |     - Tool registry
  |     - Basic tools (read, write, bash)
  |     - Approval workflow
  |
[P2.2] Context Intelligence (Basic)
  |     Depends on: P1.2 (Session)
  |     - Vector DB integration (Qdrant recommended)
  |     - Basic embedding pipeline
  |     - File chunking
  |
[P2.3] Chat Panel
        Depends on: P1.1 (Shell), P1.3 (LLM), P2.1 (Tools)
        - Message rendering
        - Streaming display
        - Tool call visualization
```

### Phase 3: Workflow & Git (Sequential)

```
[P3.1] Git Engine
  |     Depends on: P2.1 (Tools)
  |     - Basic operations (commit, diff, branch)
  |     - Worktree management
  |     - Change detection
  |
[P3.2] Workflow Controller
  |     Depends on: P2.1 (Tools), P1.2 (Session)
  |     - Phase state machine
  |     - Phase-specific prompts
  |     - Transition rules
  |
[P3.3] Code Editor Integration
        Depends on: P2.2 (Context), P3.1 (Git)
        - Monaco or CodeMirror integration
        - Diff views
        - Inline suggestions
```

### Phase 4: Advanced Features (Parallel workable)

```
[P4.1] Multi-Provider Gateway
  |     Depends on: P1.3 (LLM)
  |     - Additional providers
  |     - Routing logic
  |     - Fallback chains
  |
[P4.2] LSP Integration
  |     Depends on: P2.2 (Context)
  |     - LSP client management
  |     - Diagnostics pipeline
  |     - Symbol indexing
  |
[P4.3] Parallel Worktrees
  |     Depends on: P3.1 (Git), P2.1 (Tools)
  |     - Agent isolation
  |     - Concurrent execution
  |     - Result merging
  |
[P4.4] Per-Hunk Code Review
        Depends on: P3.1 (Git), P2.2 (Context)
        - Hunk parsing
        - Logic analysis
        - Conflict detection
```

### Phase 5: Extensions & Polish

```
[P5.1] MCP Client/Server
  |     Depends on: P2.1 (Tools)
  |     - Protocol implementation
  |     - Server registry
  |     - Built-in servers
  |
[P5.2] Checkpoint/Undo System
  |     Depends on: P1.2 (Session), P3.1 (Git)
  |     - Snapshot creation
  |     - Restore workflow
  |     - Diff UI
  |
[P5.3] Context Store (Advanced)
        Depends on: P2.2 (Context)
        - Distillation pipeline
        - Cross-session memory
        - Relevance decay
```

### Dependency Graph Summary

```
P1.1 Shell ─────────────────────────────────┐
P1.2 Session ──────┬───────────────────┐    │
P1.3 LLM Gateway ──┼───────────┐       │    │
                   │           │       │    │
                   v           v       v    v
              P2.1 Tools ──> P2.3 Chat Panel
                   │           │
                   v           │
              P2.2 Context <───┘
                   │
          ┌───────┴───────┐
          v               v
     P3.1 Git        P4.2 LSP
          │               │
          v               │
     P3.2 Workflow        │
          │               │
          v               v
     P3.3 Editor <────────┘
          │
          ├──────────────────────────┐
          v                          v
     P4.3 Worktrees            P4.4 Code Review
          │                          │
          v                          v
     P5.1 MCP                  P5.2 Checkpoints
                                     │
                                     v
                               P5.3 Context Store (Advanced)
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Monolithic Agent

**What:** Single agent handling all tasks without specialization
**Why bad:** Context pollution, no forced decomposition, hallucination accumulation
**Instead:** Hierarchical agents (Orchestrator > Explorer > Coder pattern)

### Anti-Pattern 2: Shared Filesystem for Parallel Agents

**What:** Multiple agents editing the same working directory
**Why bad:** Race conditions, conflicting edits, unpredictable state
**Instead:** Git worktrees with dedicated branches per agent

### Anti-Pattern 3: Full Context Every Request

**What:** Sending entire codebase or conversation history every API call
**Why bad:** Token waste, cost explosion, context window exhaustion
**Instead:** Context Store with selective injection based on relevance

### Anti-Pattern 4: Naive Chunking for Code

**What:** Fixed-size chunking that splits functions mid-definition
**Why bad:** Broken code in context leads to hallucinations
**Instead:** AST-aware chunking that preserves semantic units (functions, classes)

### Anti-Pattern 5: Blocking on Tool Execution

**What:** Sequential tool execution when parallel is possible
**Why bad:** Latency multiplication
**Instead:** Parallel execution for independent tool calls (OpenCode pattern)

### Anti-Pattern 6: Single Provider Lock-in

**What:** Hard-coding to one LLM provider
**Why bad:** Single point of failure, no cost optimization
**Instead:** Multi-provider gateway with automatic fallback

---

## Scalability Considerations

| Concern | At 1 User | At 10 Users (Team) | At 100+ Users (Enterprise) |
|---------|-----------|--------------------|-----------------------------|
| **Vector DB** | SQLite + in-memory | Qdrant local | Qdrant cluster or Pinecone |
| **Session Storage** | SQLite local | SQLite per user | PostgreSQL with partitioning |
| **LLM Routing** | Single provider | Load balanced | Multi-region with latency routing |
| **Worktrees** | 3-5 concurrent | 10-20 per machine | Distributed workers |
| **Context Sync** | Local only | Optional cloud sync | Full cloud with encryption |

---

## Sources

### Primary Sources (HIGH Confidence)

- [How Coding Agents Actually Work: Inside OpenCode](https://cefboud.com/posts/coding-agents-internals-opencode-deepdive/) - Detailed architecture breakdown
- [Deep Agent Architecture for AI Coding Assistants](https://dev.to/apssouza22/a-deep-dive-into-deep-agent-architecture-for-ai-coding-assistants-3c8b) - Context Store and agent coordination patterns
- [Cline Architecture (DeepWiki)](https://deepwiki.com/cline/cline) - State management and VS Code extension patterns
- [How Claude Code is Built](https://newsletter.pragmaticengineer.com/p/how-claude-code-is-built) - TypeScript/React/Ink architecture
- [OpenCode Documentation](https://opencode.ai/docs/) - Official architecture documentation

### Secondary Sources (MEDIUM Confidence)

- [Git Worktrees: The Power Behind Cursor's Parallel Agents](https://dev.to/arifszn/git-worktrees-the-power-behind-cursors-parallel-agents-19j1) - Worktree patterns
- [How We Built True Parallel Agents With Git Worktrees](https://dev.to/getpochi/how-we-built-true-parallel-agents-with-git-worktrees-2580) - Pochi implementation details
- [Multi-provider LLM orchestration in production: A 2026 Guide](https://dev.to/ash_dubai/multi-provider-llm-orchestration-in-production-a-2026-guide-1g10) - Gateway patterns
- [MCP Protocol: a new AI dev tools building block](https://newsletter.pragmaticengineer.com/p/mcp) - MCP architecture
- [Agent Client Protocol: The LSP for AI Coding Agents](https://blog.promptlayer.com/agent-client-protocol-the-lsp-for-ai-coding-agents/) - ACP standard
- [Building RAG on codebases](https://lancedb.com/blog/building-rag-on-codebases-part-2/) - Vector search patterns
- [Tauri vs Electron Comparison](https://www.dolthub.com/blog/2025-11-13-electron-vs-tauri/) - Desktop framework analysis

### Supporting Sources (LOW Confidence - Verify Before Using)

- Various Medium articles on specific implementations
- Tool documentation that may be version-specific
