# Fork Candidate Deep Dive: Cline vs Continue

**Purpose:** Evaluate Cline and Continue as potential core engines for CodeMAD
**Researched:** 2026-01-30
**Confidence:** HIGH (verified via official docs, DeepWiki, blog posts, GitHub)

---

## Executive Summary

Both Cline and Continue are mature, Apache 2.0 licensed TypeScript projects with extractable core engines. However, they represent fundamentally different architectural philosophies that will shape CodeMAD's development trajectory.

**Recommendation:** Fork Cline for the agent/tool execution engine. Its "Cline Core" extraction work is already done, exposing a gRPC API designed for multi-frontend scenarios. Adopt Continue's LanceDB patterns for the embeddings layer, either by direct integration or by studying their implementation.

### Quick Comparison

| Criterion | Cline | Continue |
|-----------|-------|----------|
| **Stars** | 57k | 31k |
| **Contributors** | 272 | Active (100+) |
| **License** | Apache 2.0 | Apache 2.0 |
| **Core extraction** | Done (Cline Core) | Done (binary package) |
| **Communication** | gRPC bidirectional | Message passing (JSON) |
| **Embeddings** | None built-in | LanceDB (production-proven) |
| **Multi-frontend** | Explicit design goal | IDE-focused |
| **Standalone CLI** | Yes (Go-based) | Yes (npm package) |
| **Per-hunk review** | No (per-tool approval) | No (per-tool approval) |

---

## Cline: Detailed Analysis

### Codebase Stats

| Metric | Value | Source |
|--------|-------|--------|
| GitHub Stars | 57,146 | [GitHub](https://github.com/cline/cline) |
| Forks | 5,500+ | GitHub |
| Contributors | 272 | GitHub |
| Primary Language | TypeScript | GitHub |
| Last Updated | Jan 25, 2026 | GitHub |
| License | Apache 2.0 | [LICENSE](https://github.com/cline/cline/blob/main/LICENSE) |

### Architecture Overview

Cline implements a **multi-process architecture** built around VS Code's extension host model, but crucially, the core has been extracted into a standalone service.

```
+------------------+     gRPC      +------------------+
|   VS Code        | <----------> |   Cline Core     |
|   Extension      |              |   (Node.js)      |
+------------------+              +------------------+
                                         ^
+------------------+     gRPC      |     |
|   JetBrains      | <----------> |     |
|   Plugin         |              |     |
+------------------+              |     |
                                  v     |
+------------------+     gRPC      +------------------+
|   Cline CLI      | <----------> |                  |
|   (Go)           |              |                  |
+------------------+              +------------------+
```

**Key Components:**

| Component | Location | Responsibility |
|-----------|----------|----------------|
| Extension Host | `src/extension.ts` | VS Code lifecycle, command registration |
| Controller | `src/core/controller/` | Orchestration hub, task lifecycle |
| Task Executor | `src/core/task/` | Agent loop, tool execution, history |
| State Manager | `src/core/storage/` | Persistence, in-memory cache, settings |
| Cline Core | `src/standalone/cline-core.ts` | **Standalone gRPC service** |
| Tool Executor | (within Task) | File ops, terminal, browser automation |
| Webview | `webview-ui/` | React UI, gRPC client |

### Cline Core: The Extraction That Matters

**This is the key finding.** In late 2025, Cline extracted its core logic into a standalone service:

> "When we started working on Cline, it was a tightly integrated VS Code extension, and it took months to liberate it into a standalone service that can be embedded into any environment. That's Cline Core."
> -- [Cline Blog](https://cline.bot/blog/cline-cli-my-undying-love-of-cline-core)

**Cline Core capabilities:**
- Runs as a Node.js process
- Exposes gRPC API for bidirectional streaming
- Supports multiple frontends attached simultaneously
- Can operate over the network (not just local IPC)
- Used by both JetBrains plugin and CLI

**Architecture details:**
- CLI (`cli/main.go`) spawns Cline Core as child process
- ClientRegistry tracks active connections
- Dynamic port allocation for gRPC
- `ExternalWebviewProvider` for UI delegation
- `HostProvider` singleton for platform abstraction

### Can Core Be Extracted for CodeMAD?

**YES - it's already done.**

The extraction work is complete. Cline Core is designed exactly for CodeMAD's use case: a standalone engine that can power custom frontends.

**What CodeMAD would need to build:**
1. Tauri shell (replaces VS Code host)
2. React UI (can heavily reference Cline's webview-ui)
3. HostProvider implementation for Tauri
4. gRPC client in TypeScript

**What CodeMAD gets for free:**
- Complete agent loop
- Tool execution framework
- Terminal integration
- Browser automation
- MCP support
- Checkpoint system
- Multi-provider LLM support

### Features Implemented

| Feature | Status | Notes |
|---------|--------|-------|
| Tool system | Complete | File read/write, terminal, browser |
| MCP integration | Complete | Can build AND use MCP servers |
| Provider support | Extensive | OpenRouter, Anthropic, OpenAI, Gemini, Bedrock, local |
| Checkpoints | Complete | Shadow git repo, full rollback |
| Plan-then-act mode | Complete | Shows approach before executing |
| Browser automation | Complete | Headless browser with screenshots |
| Terminal execution | Complete | With human-in-loop approval |
| Streaming | Complete | gRPC bidirectional streaming |

### What's Missing for CodeMAD

| Missing Feature | Difficulty | Notes |
|-----------------|------------|-------|
| Per-hunk review | Medium | Has per-tool approval, not per-change |
| Embeddings/indexing | High | No built-in vector DB |
| GSD workflow | Custom | Would be new development |
| Desktop shell | Medium | Need Tauri host provider |
| Custom UI | Medium | Reference existing React UI |

### Checkpoint System Details

Cline's checkpoint system uses a **shadow git repository**:

> "Cline uses a shadow Git repository to track changes. Each change creates a checkpoint. You can review each modification and roll back to any point without affecting your main Git repository."

**Capabilities:**
- Message Editing + Checkpoint Restore
- "Restore Workspace Only" (resets files, preserves chat)
- Edit previous message and restore entire workspace

**Known issues:**
- Disk space consumption (4GB+ per task reported)
- Checkpoint directories can grow to 120GB+
- Occasionally corrupts by renaming .git to .git_disabled

**Implication for CodeMAD:** The checkpoint concept is valuable, but the implementation may need improvement or a different approach (git worktrees instead of shadow repos).

### Forks and Derivatives

Cline has spawned several notable forks:

| Fork | Relationship | Key Addition |
|------|--------------|--------------|
| KiloCode | Fork of Roo Code (fork of Cline) | Orchestrator mode, Memory bank |
| Roo Code (RooCline) | Direct fork | Custom modes |
| OpenAnalyst | Fork of KiloCode | Multi-model support |

**KiloCode is notable** for adding:
- Orchestrator mode (breaks problems into subtasks)
- Memory bank (remembers context/preferences)
- MCP Server Marketplace

This suggests CodeMAD could add GSD methodology as a similar "mode" layer.

---

## Continue: Detailed Analysis

### Codebase Stats

| Metric | Value | Source |
|--------|-------|--------|
| GitHub Stars | 31,100 | [GitHub](https://github.com/continuedev/continue) |
| Forks | 4,100+ | GitHub |
| Contributors | Active community | GitHub |
| Primary Language | TypeScript | GitHub |
| Last Stable | v1.5.39 | [Releases](https://github.com/continuedev/continue/releases) |
| License | Apache 2.0 | [LICENSE](https://github.com/continuedev/continue/blob/main/LICENSE) |

### Architecture Overview

Continue implements a **seven-layer architecture** with explicit separation between core, extension, and GUI:

```
+------------------+
|      GUI         |  React + Redux
+------------------+
        ^
        | messages
        v
+------------------+
|   Extension      |  VS Code / JetBrains adapter
+------------------+
        ^
        | messages
        v
+------------------+
|      Core        |  Business logic, LLM orchestration
+------------------+
        |
        v
+------------------+
|    LanceDB       |  Vector storage
+------------------+
```

**Key Design Principle:**
> "The core is intended to include most of the business logic, which can be reused across different IDE extensions. Message passing is set up so that both core and gui can send messages directly to the extension, and to send messages to each other the core and gui must go through the extension."

### Core Separation

**The "core" package (`@continuedev/core`):**
- Pure business logic
- LLM orchestration
- Context gathering
- Completely IDE-agnostic
- Can be imported as npm package

**The extension layer:**
- Implements `IDE` interface
- Handles file operations, editor state
- Platform-specific APIs
- Message routing between core and GUI

**VsCodeMessenger:**
- Central message router
- Three message categories:
  - WEBVIEW_TO_CORE (GUI to Core)
  - CORE_TO_WEBVIEW (Core to GUI)
  - IDE Operations (direct calls)

### Binary Package for JetBrains

Continue solved the JetBrains problem with a **standalone binary**:

> "The binary package provides standalone Node.js executables for CLI and IntelliJ usage. For JetBrains, the binary is 'a thin wrapper around the core that is shipped alongside the extension as an executable to message with the extension over stdin/stdout.'"

**Communication:**
- JSON messages over stdin/stdout
- `IdeProtocolServer` handles protocol
- Same core code as VS Code extension

### LanceDB Integration (The Standout Feature)

This is Continue's **killer feature** for CodeMAD to learn from:

> "Continue's requirements were unequivocal: an embedded TypeScript library, lightning-fast lookup times even with on-disk storage, and robust SQL-like filtering capabilities."

**Why LanceDB:**
- Only embedded TypeScript vector database
- Sub-millisecond lookup times
- SQL-like filtering
- No server required
- Privacy-first (runs entirely in `~/.continue/`)

**Performance claims:**
- Auto-completion improved 40% in relevance
- <10ms latency with 1M+ vectors
- Incremental indexing (no full reindex for small changes)
- Embedding model flexibility (swap without rebuilding)

**Integration details:**
- Stores in `~/.continue/` directory
- Uses Tree-sitter WASM for AST parsing
- ripgrep for fast text search
- TransformersJS or ONNX for local embeddings
- SQL-like metadata queries

**Embedding recommendations:**
- API: voyage-code-3 (best quality)
- Local: nomic-embed-text via Ollama
- Built-in: all-MiniLM-L6-v2 (384 dimensions)

### Can Core Be Extracted for CodeMAD?

**YES, but less cleanly than Cline.**

Continue's core is extractable via npm package, but:
- Message-passing model assumes IDE adapter exists
- Less focused on "standalone desktop" use case
- GUI tightly integrated with core via Redux

**What CodeMAD would need:**
1. Custom host adapter (implementing `IDE` interface)
2. Message routing layer
3. Custom GUI (can reference existing React)
4. Tauri shell

**What CodeMAD gets:**
- LanceDB integration patterns
- Context provider system
- Embedding pipeline
- MCP support

### Features Implemented

| Feature | Status | Notes |
|---------|--------|-------|
| Embeddings | Production-proven | LanceDB integration |
| Context providers | Extensive | @codebase, @file, @code, @docs, @folder |
| Semantic search | Complete | Hybrid (embeddings + keyword) |
| Agent mode | Complete | Tool calling with approval |
| CLI | Complete | `@continuedev/cli` npm package |
| Headless mode | Complete | For CI/CD automation |
| MCP | Complete | Same config as IDE extensions |

### Agent Mode Details

> "With Agent mode, you can provide natural language instruction and let the model do the work. Agent mode will ask permission when it wants to use a tool."

**Tool policies:**
- Can exclude specific tools
- Can make usage automatic
- Errors caught and fed back to model

### What's Missing for CodeMAD

| Missing Feature | Difficulty | Notes |
|-----------------|------------|-------|
| Per-hunk review | Medium | Per-tool approval only |
| Checkpoint/rollback | Medium | Not as sophisticated as Cline |
| GSD workflow | Custom | Would be new development |
| Desktop shell | Medium | Need custom host adapter |
| gRPC streaming | Medium | Uses message passing, not gRPC |

---

## Head-to-Head Comparison

### For Building a Standalone Desktop App

| Factor | Cline | Continue | Winner |
|--------|-------|----------|--------|
| Core extraction status | Complete (gRPC service) | Complete (npm package) | Cline |
| Multi-frontend design | Explicit goal | IDE-focused | Cline |
| Communication protocol | gRPC (typed, streaming) | JSON messages | Cline |
| Agent loop sophistication | High (plan-then-act) | Medium | Cline |
| Tool system | Complete | Complete | Tie |
| MCP support | Build + use | Use | Cline |

### For Embeddings and Code Intelligence

| Factor | Cline | Continue | Winner |
|--------|-------|----------|--------|
| Vector database | None | LanceDB (production) | Continue |
| Semantic search | None | Complete | Continue |
| Code indexing | None | Tree-sitter + ripgrep | Continue |
| Context providers | Basic | Extensive (@codebase, etc) | Continue |

### For Production Reliability

| Factor | Cline | Continue | Winner |
|--------|-------|----------|--------|
| Checkpoint/rollback | Complete (shadow git) | Limited | Cline |
| Community size | 57k stars | 31k stars | Cline |
| Active development | Very active | Active | Cline |
| Known issues | Checkpoint disk usage | Build system complexity | Tie |

---

## Recommendation for CodeMAD

### Primary Strategy: Fork Cline Core

**Rationale:**
1. Cline Core extraction is done and designed for exactly this use case
2. gRPC API provides clean, typed interface
3. Explicit multi-frontend support
4. Complete tool system with MCP
5. Checkpoint system (needs improvement but exists)

**What to fork:**
- `src/core/` - Core business logic
- `src/standalone/cline-core.ts` - Standalone service
- `webview-ui/` - Reference for React UI patterns

**What to build:**
- Tauri host provider (implementing their `HostProvider` interface)
- Custom React UI in Tauri shell
- Per-hunk review layer (novel development)
- GSD workflow modes

### Secondary: Adopt Continue's Embeddings Pattern

**Rationale:**
1. LanceDB is the clear winner for embedded vector DB
2. Continue's implementation is production-proven
3. Tree-sitter + ripgrep pattern is standard

**Options:**
1. **Direct integration:** Use LanceDB directly (same as Continue)
2. **Pattern adoption:** Study Continue's implementation, build fresh

**Recommended:** Option 1 - LanceDB is well-documented, Continue's patterns are proven.

### Implementation Phases

**Phase 1: Core Integration**
- Fork Cline Core
- Implement Tauri HostProvider
- Basic React UI
- Verify gRPC communication works

**Phase 2: Embeddings Layer**
- Integrate LanceDB directly
- Implement Continue's context provider patterns
- Add semantic search

**Phase 3: Novel Features**
- Per-hunk review (CodeMAD differentiator)
- GSD workflow modes
- Improved checkpoint system

---

## What Neither Has (CodeMAD Opportunities)

These are gaps in both tools that CodeMAD could fill:

| Gap | Description | Opportunity |
|-----|-------------|-------------|
| Per-hunk review | Both have per-tool approval only | Build approval at change level, not tool level |
| GSD methodology | Neither has structured workflow | Research-then-build pattern is novel |
| Goal-backward verification | Neither verifies intent alignment | "Did we achieve the goal?" step |
| Context efficiency metrics | Hidden from users | Show token savings, context usage |
| Memory management UI | Opaque | Show/edit what AI remembers |

### Per-Hunk Review Gap Analysis

**What exists:**
- Cline: User approves each tool call (read_file, write_file, bash)
- Continue: Tool policies (automatic, ask, exclude)

**What's missing:**
- Approve individual lines/hunks within a file edit
- See all proposed changes across files, accept/reject per-hunk
- Edit changes inline before accepting

**CodeMAD opportunity:** Build the "git add -p" equivalent for AI code changes.

---

## Sources

### Official Documentation
- [Cline Architecture Overview (DeepWiki)](https://deepwiki.com/cline/cline/1.3-architecture-overview)
- [Continue Architecture (DeepWiki)](https://deepwiki.com/continuedev/continue)
- [Cline GitHub Repository](https://github.com/cline/cline)
- [Continue GitHub Repository](https://github.com/continuedev/continue)

### Blog Posts
- [Cline Core Blog Post](https://cline.bot/blog/cline-cli-my-undying-love-of-cline-core)
- [Continue LanceDB Integration](https://lancedb.com/blog/the-future-of-ai-native-development-is-local-inside-continues-lancedb-powered-evolution/)
- [Building Semantic Code History Search](https://blog.continue.dev/building-a-semantic-code-history-search-with-lancedb/)

### Architecture References
- [KiloCode Architecture (DeepWiki)](https://deepwiki.com/Kilo-Org/kilocode/1-overview)
- [Cline Tool Integrations (DeepWiki)](https://deepwiki.com/cline/cline/5-tool-integrations)
- [Continue Codebase Indexing (DeepWiki)](https://deepwiki.com/continuedev/continue/3.4-context-providers)

### Related Analysis
- [Cline Source Code Analysis](https://zjy365.dev/blog/cline-source-code-analysis)
- [Cursor vs Cline vs KiloCode Comparison](https://www.arsturn.com/blog/ai-coding-assistants-cursor-vs-cline-vs-kilocode)
