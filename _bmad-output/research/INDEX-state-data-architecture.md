# Research Index: State Management & Data Architecture for Desktop AI Apps

This research package covers proven patterns, tools, and architectural approaches for building complex desktop AI applications in 2026. The research spans frontend state management, backend persistence, file indexing, caching strategies, and real-world implementations from industry leaders.

---

## Documents in This Research

### 1. **state-management-data-architecture-desktop-ai-2026.md** (34 KB)
Comprehensive deep-dive covering all aspects of state and data architecture.

**Sections:**
- Frontend state management for AI chat UIs (conversation state, multi-tab management, agent dashboards, optimistic updates)
- Project state persistence patterns (XDG directories, Git-aware state, session recovery)
- Data flow architecture (streaming LLM responses, unidirectional data flow, CQRS)
- File watching and incremental indexing (chokidar, debouncing, Tree-sitter)
- Caching architecture (multi-layer strategy, semantic caching, invalidation)
- Tauri-specific state management patterns
- Real-world case studies (Cursor, Continue AI, Cody)

**Best for:** Complete understanding, architecture decisions, implementation details.

### 2. **QUICK-REFERENCE-state-data-architecture.md** (18 KB)
Fast lookup reference with tables, diagrams, code snippets, and decision trees.

**Sections:**
- Tool selection matrix (Zustand vs Redux vs React Query)
- State structure templates (conversation, project, agent activity)
- Configuration storage locations (XDG standard)
- Data flow diagrams (streaming, unidirectional, multi-agent)
- Zustand + SSE complete working example
- File watching + incremental indexing setup
- Session persistence & crash recovery
- Semantic caching Redis setup
- Tauri patterns (commands, events)
- Decision trees (state tool selection, streaming, reindexing)
- Performance targets & production checklist

**Best for:** Quick lookup, copy-paste code, architecture diagrams, decision making.

---

## Key Findings Summary

### Frontend State Management (2026 Consensus)
- **Zustand**: 40% adoption, minimal boilerplate, native async support. Recommended for chat state and streaming.
- **React Query**: 80%+ for server state. Handles message history, API calls.
- **Redux Toolkit**: ~10% of new projects. Enterprise-only for strict consistency.

### Architecture Pattern: Unidirectional Data Flow
```
State → Components → Events → Actions → State
```
Enables predictable updates, easier debugging, time-travel support.

### Streaming Pattern: Double Streaming
```
Frontend sends message → Backend sends to LLM → Backend streams to Frontend
```
Using Server-Sent Events (SSE) is the modern standard, not WebSocket unless bi-directional updates needed.

### File Watching & Indexing
- **File Watcher**: Chokidar (Node.js) or Tauri native
- **Debouncing**: 500-1000ms typical for code indexing
- **Incremental Parsing**: Tree-sitter enables 10-100x speedup by re-parsing only changed regions
- **Incremental Embedding**: Only changed files re-embedded, avoiding full reindex

### Caching Strategy: Multi-Layer
```
Memory (<1ms, ~100MB)
  ↓ miss
Disk (1-50ms, ~1GB)
  ↓ miss
Redis Semantic Cache (50-500ms, cross-machine)
  ↓ miss
Recompute (1-10s)
```
Semantic caching reduces LLM API costs by 60-73%.

### Git-Aware State Management
- Detect file modifications without full Git scan
- Use Git worktrees for isolated parallel agent work
- Track session state separately from repository state
- Crash recovery via saved state snapshots

### Project Configuration (XDG Standard)
```
~/.config/codead/        Configuration
~/.local/share/codead/   Data & embeddings
~/.local/state/codead/   Runtime state & recovery
~/.cache/codead/         Temp (regenerable)
.codead/                 Workspace-local (versioned)
```

---

## Real-World Implementations

### Cursor: Parallel Agents
- 8 agents running simultaneously with git worktrees isolation
- Shared JSON state file for inter-agent communication
- Real-time progress dashboard showing agent actions
- Automatic conflict prevention via isolated branches

### Continue AI: Codebase-Aware Indexing
- File watcher detects changes
- Only changed files re-embedded (99% cost reduction vs full reindex)
- SQLite + Redis for embedding storage
- Semantic search finds relevant code context

### Cody: Tree-Sitter for Performance
- 1-5ms incremental parse vs 10-100ms full parse
- Syntax highlighting feels instant
- Symbol resolution updates in real-time

---

## Technology Stack Recommendations

### For Maximum Performance (Desktop AI Apps)
- **Frontend**: React + TypeScript + Zustand
- **Backend**: Tauri + Rust (or Electron + Node.js for rapid prototyping)
- **State**: Zustand (frontend) + Rust State (backend, shared)
- **Streaming**: SSE (Server-Sent Events)
- **File Watching**: Tauri native (Rust) or Chokidar (Node.js)
- **Parsing**: Tree-sitter for incremental updates
- **Caching**: Memory (LRU) → Disk (SQLite) → Redis (semantic)
- **Configuration**: XDG standard + workspace-local `.codead/`

### For Rapid Prototyping
- **Frontend**: React + Zustand
- **Backend**: Electron + Node.js
- **Streaming**: SSE
- **File Watching**: Chokidar
- **Caching**: SQLite (disk only, no distributed cache yet)
- **Configuration**: XDG standard

---

## Critical Patterns

### 1. Optimistic Updates During Streaming
```javascript
// Add message to UI immediately
set(state => ({ messages: [...state.messages, userMessage] }));

// Async: send to backend, stream response
// Error: rollback message to draft state
```

### 2. The `isStreaming` Boolean Gate
```javascript
<input disabled={isStreaming} />  // Prevent race conditions
// Critical for preventing multiple concurrent messages
```

### 3. Two-Phase Crash Recovery
```javascript
// Phase 1: Load from disk instantly (0-500ms)
// Phase 2: Verify & rebuild async (background)
```

### 4. File Change Batching
```javascript
// Wait for 500-1000ms of quiet before reindexing
// Prevents processing intermediate states during formatting
```

### 5. Semantic Cache Similarity Threshold
```javascript
0.85 = Conservative (high precision)
0.90 = Balanced (recommended)
0.95 = Aggressive (high recall, risky for precision)
```

---

## Decision Trees

### "Should I rebuild the entire codebase index?"
- ✗ No, use incremental approach
- Change detection (95% files skipped)
- Tree-sitter for parsing (only changed regions)
- Selective embedding (only significant changes)

### "Where should I store project configuration?"
- Versioned, project-specific → `.codead/config.json`
- User-specific, global → `~/.config/codead/`
- Secrets → System keyring (encrypted)
- Session state → `~/.local/state/codead/` (not git)

### "Zustand or Redux?"
- Simple, chat-based → Zustand
- Enterprise, strict consistency → Redux Toolkit
- Server state → React Query
- Theme/env → Context API

### "SSE or WebSocket?"
- Chat, unidirectional → SSE (standard, default)
- Real-time collab, bi-directional → WebSocket
- Legacy systems → Polling (not recommended)

---

## Performance Targets

| Operation | Target | Notes |
|-----------|--------|-------|
| File change detection | <50ms | Single FS walk |
| Single file parse | <10ms | Tree-sitter incremental |
| Batch embedding (50 files) | <2s | Vector DB batch |
| Semantic search | 5-20ms | Redis vector index |
| UI message add | <100ms | Optimistic update |
| Chat response (cache hit) | <1s | 5-20ms lookup |
| Chat response (cache miss) | 2-10s | Network + inference |
| Session hydration | <500ms | Disk load |
| Agent status broadcast | <100ms | Event propagation |

---

## Avoiding Common Pitfalls

### ❌ Don't:
- Commit secrets to git (impossible to remove fully)
- Re-index entire codebase on every file change
- Use polling for file watching (CPU intensive)
- Block UI while reindexing (make it async)
- Wait for LLM response before showing UI update
- Store all conversation history in memory (use pagination)
- Use exact string matching for cache hits (use semantic)
- Force full state rebuild on every app restart

### ✓ Do:
- Store secrets in system keyring or encrypted files
- Detect changed files, re-index only those
- Use native file watchers (fs.watch, FSEvents, inotify)
- Debounce file changes (500-1000ms)
- Use optimistic updates (add message before API call)
- Paginate old conversations, stream new ones
- Use semantic caching (vector similarity)
- Implement two-phase hydration (fast load + async rebuild)

---

## Integration with CodeMAD Project

This research informs state and data architecture decisions for CodeMAD's semantic search and agent-based code manipulation:

1. **Conversation State**: Track multi-turn interactions with agents
2. **Project State**: Maintain Git-aware codebase state and file tracking
3. **Agent Activity**: Real-time dashboard showing parallel agent progress
4. **Incremental Indexing**: Efficient re-embedding of changed files
5. **Semantic Caching**: Reduce LLM API costs for duplicate/similar queries
6. **File Watching**: Detect code changes, trigger re-indexing
7. **Session Recovery**: Restore agents' work after crashes

---

## Sources & References

All findings are backed by:
- **Primary sources**: GitHub repos (Cursor, Continue, Cody, Zustand, Chokidar)
- **Documentation**: Tauri, Redis, Tree-sitter official docs
- **Articles & Blog Posts**: Engineering articles from companies building AI tools in 2025-2026
- **Academic**: Semantic caching papers, CQRS architecture patterns
- **Community**: GitHub issues, discussions, open-source implementations

See full sources in `state-management-data-architecture-desktop-ai-2026.md`.

---

## How to Use This Research

1. **Architecture Decision**: Read the comprehensive guide + decision trees
2. **Quick Implementation**: Copy from QUICK-REFERENCE code snippets
3. **Specific Pattern**: Search for section (e.g., "Streaming", "Caching", "File Watching")
4. **Performance Tuning**: Refer to performance targets and anti-patterns
5. **Real-World Example**: Check case studies (Cursor, Continue, Cody)

---

## Document Map

```
research/
├── INDEX-state-data-architecture.md          (this file, 5 min read)
├── state-management-data-architecture-2026.md (complete guide, 30 min read)
└── QUICK-REFERENCE-state-data-architecture.md (lookup & snippets, 10 min browse)
```

Start with INDEX (you are here) → Pick QUICK-REFERENCE for fast answers → Deep dive into main guide as needed.

---

**Last Updated**: February 10, 2026
**Research Scope**: Desktop AI applications (ChatGPT, Claude, Cursor, Continue, Cody, Windsurf)
**Technologies Covered**: React, Zustand, Tauri, Electron, TypeScript, Rust, LLM APIs
