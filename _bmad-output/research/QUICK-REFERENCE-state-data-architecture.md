# Quick Reference: State & Data Architecture for Desktop AI Apps

Fast lookup reference for patterns, tools, and decisions.

---

## 1. Tool Selection Matrix

### Frontend State Management
```
Chart: Zustand vs Redux vs React Query (2026)

Zustand (40% adoption)
├─ Async: Direct native async/await ✓
├─ Boilerplate: Minimal
├─ Learning curve: 1 hour
└─ Use for: Chat state, streaming buffers, UI toggles

Redux Toolkit (10% adoption)
├─ Async: Via middleware (thunks, saga)
├─ Boilerplate: Medium
├─ Learning curve: 4-6 hours
└─ Use for: Large enterprise, strict consistency

React Query (80% server state)
├─ Purpose: Server state sync only
├─ Cache: Built-in stale-while-revalidate
├─ Learning curve: 2 hours
└─ Use for: API calls, message history sync
```

### File Watching
```
Chokidar (Node.js) vs Tauri Native vs fs.watch

                Performance  Cross-platform  Maturity
Chokidar        ⭐⭐⭐⭐    ✓ (30M repos)      Mature
Tauri Native    ⭐⭐⭐⭐⭐  ✗ (Tauri only)     Growing
fs.watch        ⭐⭐⭐     ✗ (OS-specific)    Stable
Polling         ⭐         ✓ (network only)   Deprecated
```

---

## 2. State Structure Templates

### Conversation State
```javascript
const conversationState = {
  // Core message stream
  messages: [
    { id, role: 'user' | 'assistant', content, timestamp },
  ],

  // Streaming state
  isStreaming: boolean,              // 🔑 Critical gate
  currentResponse: string,           // Accumulating tokens
  streamBuffer: [],                  // Batched token chunks

  // Optimistic updates
  pendingUserInput: string,          // Unsent draft
  optimisticMessages: Message[],     // Pre-confirm additions

  // UI state
  selectedConversation: string,      // Active tab
  conversations: Map<id, Conversation>,
  loadingState: 'idle' | 'loading' | 'error',
};
```

### Project State
```javascript
const projectState = {
  // Git awareness
  files: Map<path, {
    status: 'untracked' | 'modified' | 'staged',
    hash: string,
    indexedAt: number,
  }>,
  currentBranch: string,
  worktrees: Map<id, { path, agentId }>,

  // Session recovery
  lastSavePoint: { timestamp, fileStates },
  crashRecovery: { agentPlans, incompleteEdits },

  // Configuration
  config: { model, systemPrompt, toolPermissions },
  secrets: { apiKeys, tokens },  // Encrypted
};
```

### Agent Activity State
```javascript
const agentActivityState = {
  agents: Map<id, {
    id: string,
    status: 'running' | 'waiting' | 'completed' | 'error',
    currentAction: string,           // "searching codebase"
    progress: 0-100,
    filesInScope: string[],
    reasoning: string,
    startTime: number,
    plan: AgentPlan,
  }>,

  sharedResources: {
    taskList: Task[],
    branchState: string,
    eventLog: AgentEvent[],
  },
};
```

---

## 3. Configuration Storage Locations

### Layer 1: XDG Base Directory (Cross-platform Standard)
```bash
~/.config/codead/               # XDG_CONFIG_HOME
├── config.json                 # User preferences
├── profiles/                   # Workspace profiles
└── ai-dotfiles.yaml           # Agent configuration

~/.local/share/codead/         # XDG_DATA_HOME
├── embeddings.db              # Vector storage
├── ast-cache.db               # Parse trees
└── sessions/                  # Session history

~/.local/state/codead/         # XDG_STATE_HOME
├── session.json               # Current runtime state
└── recovery/                  # Crash recovery

~/.cache/codead/               # XDG_CACHE_HOME
└── temp-indices/              # Regenerable
```

### Layer 2: Workspace-Local (Version-Controlled)
```bash
.codead/                        # Project root
├── config.json                 # Project-specific settings
├── state.json                  # Runtime state (gitignored)
├── .gitignore                  # Prevent secrets leak
└── cache/                      # Workspace cache
```

### Layer 3: Secrets Management
```bash
❌ NEVER: Hardcode or commit secrets
✓ RECOMMENDED:
  - System keyring (macOS Keychain, Windows Cred Manager, Linux Secret Service)
  - Environment variables (load from .env.local, gitignored)
  - Encrypted file + master key in keyring
  - HashiCorp Vault for enterprise
```

---

## 4. Data Flow Diagrams

### LLM Streaming Architecture (Double Streaming)
```
┌─────────────┐
│ User Input  │
└──────┬──────┘
       │
       ▼
  ┌─────────────────────────────────────┐
  │  Frontend (React + Zustand)         │
  │ ┌──────────────────────────────────┐│
  │ │ → Message added optimistically   ││
  │ │ → isStreaming = true             ││
  │ │ → Form disabled                  ││
  │ └──────────────────────────────────┘│
  └────────┬────────────────────────────┘
           │ HTTP POST /chat
           ▼
  ┌──────────────────────────────┐
  │ Backend (Rust/Node)          │
  │ ┌─────────────────────────┐ │
  │ │ → Store user message    │ │
  │ │ → Call LLM API          │ │
  │ │ → Stream tokens from LLM│ │
  │ └─────────────────────────┘ │
  └────────┬────────────────────┘
           │ SSE /chat/stream (tokens)
           ▼
  ┌──────────────────────────────────┐
  │ Frontend Receive                 │
  │ ┌────────────────────────────┐  │
  │ │ Token chunk arrives        │  │
  │ │ currentResponse += token   │  │
  │ │ UI updates instantly       │  │
  │ └────────────────────────────┘  │
  └──────────────────────────────────┘
           │
           ▼ (final)
  ┌──────────────────────────────────┐
  │ Message Complete                 │
  │ ├─ Append to messages array      │
  │ ├─ isStreaming = false           │
  │ ├─ Form enabled                  │
  │ └─ Persist to database           │
  └──────────────────────────────────┘
```

### Unidirectional Data Flow
```
        State Store
         (Single Source of Truth)
              ▲
              │
              │ mutations
              │
        ┌─────┴──────┐
        │             │
    Commands      Queries
        │             │
        │             ▼
        │        UI Components
        │             │
        │             │ props
        │             ▼
        │        Render Output
        │             │
        └─────────────┤
                      │
                   Events
                   (user actions)
```

### Multi-Agent Parallel State
```
  Cursor Multi-Agent Architecture

Git Repository
├─ .git/
├─ main/                     (worktree 1)
├─ agent-1-feature/          (worktree 2) ← Agent 1 edits here
├─ agent-2-docs/             (worktree 3) ← Agent 2 edits here
└─ workflow_state.md         (shared state)

workflow_state.md:
{
  "agents": [
    { "id": 1, "action": "implementing", "worktree": "agent-1-feature" },
    { "id": 2, "action": "writing-docs", "worktree": "agent-2-docs" }
  ],
  "taskList": ["feature", "tests", "docs"],
  "sharedResources": { ... }
}

Benefits:
✓ No file conflicts (separate worktrees)
✓ Independent testing (each agent's branch)
✓ Parallel commits (merge when done)
```

### Multi-Layer Cache Stack
```
┌─────────────────────────────┐
│ Memory Cache (LRU)          │ <1ms   ~100MB
│ Hot: Recently used embeddings
└──────────┬──────────────────┘
           │ miss
           ▼
┌─────────────────────────────┐
│ Disk Cache (SQLite)         │ 1-50ms ~1-10GB
│ Warm: Parsed ASTs, embeddings
└──────────┬──────────────────┘
           │ miss
           ▼
┌─────────────────────────────┐
│ Semantic Cache (Redis)      │ 50-500ms cross-machine
│ Cold: LLM response dedup
└──────────┬──────────────────┘
           │ miss
           ▼
┌─────────────────────────────┐
│ Recompute                   │ 1-10s
│ Last resort
└─────────────────────────────┘
```

---

## 5. Streaming Pattern: Zustand + SSE

### Complete Working Example
```javascript
// Store
const useChatStore = create((set, get) => ({
  messages: [],
  isStreaming: false,
  currentResponse: '',

  // Direct async, no middleware needed
  sendMessage: async (userMessage) => {
    // Optimistic: add user message
    set((state) => ({
      messages: [...state.messages, {
        id: generateId(),
        role: 'user',
        content: userMessage
      }]
    }));

    set({ isStreaming: true, currentResponse: '' });

    try {
      // Send message, get streaming response
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: get().messages
        })
      });

      // Stream chunks
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const token = decoder.decode(value);
        set((state) => ({
          currentResponse: state.currentResponse + token
        }));
      }

      // Save assistant message
      set((state) => ({
        messages: [...state.messages, {
          id: generateId(),
          role: 'assistant',
          content: state.currentResponse
        }],
        currentResponse: ''
      }));
    } catch (error) {
      // Rollback on error
      set((state) => ({
        messages: state.messages.slice(0, -1)  // Remove user message
      }));
    } finally {
      set({ isStreaming: false });
    }
  }
}));

// Component
function Chat() {
  const { messages, isStreaming, sendMessage } = useChatStore();

  return (
    <div>
      {messages.map(m => <div key={m.id}>{m.content}</div>)}
      <input
        disabled={isStreaming}  // 🔑 Prevent race conditions
        onKeyPress={(e) => {
          if (e.key === 'Enter') sendMessage(e.target.value);
        }}
      />
    </div>
  );
}
```

---

## 6. File Watching + Incremental Indexing

### Chokidar Setup (Best Practices)
```javascript
import chokidar from 'chokidar';

const watcher = chokidar.watch(projectPath, {
  // Don't watch noise
  ignored: ['node_modules', '.git', 'dist', 'build'],

  // Batch rapid changes (typical: 500-1000ms)
  awaitWriteFinish: {
    stabilityThreshold: 100,
    pollInterval: 100
  },

  // Use native file system events (avoid polling)
  usePolling: false,

  // Recursive watching
  recursive: true
});

// Debounced reindexing
let debounceTimer;
const changedFiles = new Set();

watcher.on('all', (event, filePath) => {
  changedFiles.add(filePath);

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    await reindexBatch(Array.from(changedFiles));
    changedFiles.clear();
  }, 1000);  // Wait 1 second of quiet before reindexing
});
```

### Incremental Reindexing Tiers
```
Tier 1: Change Detection          (~50ms)
├─ Walk filesystem once
├─ Compare against previous state
└─ Result: 95% of files skipped

Tier 2: Tree-Sitter Parsing      (~1-5ms per changed file)
├─ Reuse old AST nodes
├─ Re-parse only changed regions
└─ Result: 10-100x faster than full parse

Tier 3: Selective Embedding       (~2s for 50 changed files)
├─ Check if change is significant
├─ Skip if outside code bounds
└─ Batch embed only changed
```

---

## 7. Session Persistence & Crash Recovery

### Two-Phase Hydration
```javascript
// Phase 1: Fast (0-500ms)
const savedState = await loadFromDisk('.codead/state.json');
store.hydrate(savedState);
showUI();  // User sees cached data immediately

// Phase 2: Async rebuild (background)
setTimeout(async () => {
  const gitState = await detectGitChanges();
  const fileChanges = compareStates(savedState, gitState);

  if (fileChanges.length > 0) {
    await reindexChangedFiles(fileChanges);
    await updateEmbeddings(fileChanges);
    await persistUpdatedState();
  }
}, 0);
```

### Save Points
```javascript
// Save state at safe moments
const saveCheckpoint = async () => {
  const state = {
    fileStates: getCurrentFileStates(),
    conversations: getConversations(),
    agentPlans: getAgentPlans(),
    timestamp: Date.now()
  };

  await fs.writeJSON('.codead/state.json', state);
};

// Autosave: every 30 seconds + on significant event
setInterval(saveCheckpoint, 30000);
document.on('unload', saveCheckpoint);  // Before quit
onAgentCompleted(saveCheckpoint);       // After milestone
```

---

## 8. Semantic Caching for LLM Responses

### Redis LLM Cache Setup
```javascript
import { LLMCache } from 'redis-langcache';

const cache = new LLMCache({
  redisUrl: 'redis://localhost:6379',
  embeddingModel: 'text-embedding-3-small',
  similarityThreshold: 0.90,  // 0.85 conservative, 0.95 aggressive
  ttl: 3600  // 1 hour
});

// Usage: automatic deduplication
const response = await cache.generateCompletion({
  query: "How do I implement authentication?",
  // If similar query cached: <100ms, return cached response
  // If new: call LLM, cache result, return
});

// Results: 60-73% cost savings
// Latency: 2-4x faster for cache hits
```

### Cache Invalidation
```javascript
// Content-based
const cacheKey = `embedding:${hash(fileContent)}`;
// If content unchanged → cache hit
// If content changed → hash differs → cache miss

// Timestamp-based
if (cacheTimestamp > fileEditedAt) {
  // Cache is newer than source → use it
}

// Adaptive TTL
const ttl = fileEditFrequency > 10_per_day
  ? 3600      // 1 hour for hot files
  : 604800;   // 7 days for stable files
```

---

## 9. Tauri Backend-Frontend Sync

### Command Pattern (Async Calls)
```rust
// Backend (Rust)
#[tauri::command]
async fn send_message(
  state: tauri::State<'_, AppState>,
  message: String
) -> Result<Message, String> {
  // Process in backend
  // Update global state
  Ok(response)
}

// Frontend (React)
const response = await invoke('send_message', {
  message: userInput
});
```

### Event Pattern (Broadcasts)
```rust
// Backend: broadcast to all windows
app.emit_all("agent:created", new_agent);

// Frontend: listen
useEffect(() => {
  listen('agent:created', (event) => {
    set(state => ({
      agents: [...state.agents, event.payload]
    }));
  });
});
```

---

## 10. Decision Trees

### "What state management tool should I use?"
```
Start
  │
  ├─ Is it API/server state?
  │  └─ YES → Use React Query
  │
  ├─ Do you have multiple windows in Tauri?
  │  └─ YES, shared state → Put in Rust backend
  │
  ├─ Is it UI-only (form, theme)?
  │  └─ YES → useState or Context API
  │
  ├─ Do you need complex async operations?
  │  └─ YES → Zustand (native async)
  │  └─ NO → Redux Toolkit (if enterprise)
  │
  └─ Default → Zustand
```

### "How do I handle streaming LLM responses?"
```
Step 1: Establish connection (HTTP POST / WebSocket)
Step 2: Receive first token → Set isStreaming = true
Step 3: Accumulate tokens in currentResponse state
Step 4: UI updates automatically (Zustand re-renders)
Step 5: Final token → Append to messages, isStreaming = false
Step 6: Persist to database
```

### "When should I reindex files?"
```
Real-time (on save):        Too expensive, causes lag
Debounced (500-1000ms):     ✓ Recommended for most apps
Incremental:                ✓ Use Tree-sitter for code
Batch (on idle):            ✓ Good for large projects
Full reindex:               ❌ Only for migration/recovery
```

---

## 11. Performance Targets

| Metric | Target | How |
|--------|--------|-----|
| File change detection | <50ms | Single filesystem walk |
| Code parsing (single file) | <10ms | Tree-sitter incremental |
| Embedding a file | 1-2s | Batch, vector DB insert |
| Semantic search | 5-20ms | Redis vector index |
| Chat message to UI | <100ms | Optimistic update |
| LLM response (cache hit) | <1s total | 5-20ms lookup + render |
| LLM response (cache miss) | 2-10s | Network + inference |
| Session hydration | <500ms | Load from disk, async rebuild |
| Agent status update | <100ms | Event broadcast |

---

## 12. Checklist: Production-Ready State Architecture

- [ ] **Frontend**: Zustand or React Query configured
- [ ] **Streaming**: SSE or WebSocket pipe set up, isStreaming gate working
- [ ] **Persistence**: XDG directories + workspace-local config
- [ ] **Secrets**: Stored encrypted, never in git
- [ ] **File watching**: Chokidar debounced, ignoring noise
- [ ] **Incremental indexing**: Only changed files re-indexed
- [ ] **Multi-layer cache**: Memory → Disk → Redis → Recompute
- [ ] **Semantic cache**: Deduplication threshold tuned (0.85-0.95)
- [ ] **Error recovery**: Two-phase hydration (fast + async)
- [ ] **State sync**: Tauri commands or events broadcasting
- [ ] **Git-aware**: Worktrees for agents, branch detection
- [ ] **Monitoring**: Logs for cache hits, reindex latency, streaming errors
