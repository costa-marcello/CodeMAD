# Kilo Code Architecture Patterns - Research

**Researched:** 2026-01-30
**Domain:** AI Coding Agent Architecture (Cline/Roo Fork)
**Confidence:** HIGH (verified via DeepWiki, official docs, GitHub)

## Summary

Kilo Code is a fork of Roo Code (which forked from Cline), positioned as "a superset of both Roo and Cline." It has achieved significant traction: 14.7k GitHub stars, 750k+ users, #1 on OpenRouter, and $8M seed funding. The architecture provides several patterns directly relevant to CodeMAD's Phase 1-3 planning, particularly around **git worktree isolation for parallel agents**, **orchestrator mode for task decomposition**, and **multi-process agent runtime**.

**Primary recommendations for CodeMAD:**
1. Adopt git worktree pattern for parallel agent isolation
2. Study their ClineProvider/Task stack-based orchestration
3. Consider their read-shared, write-isolated state pattern
4. Use their session management approach for cross-device sync

---

## 1. What Changed from Cline

### Fork Lineage
```
Cline (original) → Roo Code (fork) → Kilo Code (fork of Roo)
```

### Key Differences from Cline

| Aspect | Cline | Kilo Code |
|--------|-------|-----------|
| **Deployment** | VS Code extension only | Multi-interface (VS Code, CLI, JetBrains) |
| **CLI Support** | None | First-class CLI with session sync |
| **Provider System** | Anthropic-focused | 30+ unified providers via factory pattern |
| **State Persistence** | Primarily local | Four-tier (memory, VS Code, filesystem, cloud) |
| **Session Management** | Local only | Cloud sync with cross-device support |
| **Code Indexing** | None | Integrated semantic search (Qdrant, LanceDB) |
| **Modes** | Plan/Act | Architect, Code, Debug, Ask, Custom + Orchestrator |
| **Context Handling** | Basic | Advanced context condensing + Memory Bank |
| **MCP Integration** | Basic | Built-in McpServerManager + Marketplace |
| **Ghost Autocomplete** | None | Three-tier caching with adaptive debouncing |
| **System Prompt** | Long, inflated | Dynamic generation based on mode/tools |

### What Roo Added (inherited by Kilo)
- Intelligent context condensing
- Customizable modes (Architect, Code, Ask, Debug)
- Better handling of large codebases
- Multi-mode workflows

### What Kilo Added
- **Orchestrator Mode** - Breaks problems into subtasks, assigns to specialized modes
- **Memory Bank** - Maintains context across sessions via markdown files
- **Parallel Mode** - Git worktree isolation for concurrent agents
- **CLI with session sync** - Same extension code runs headless
- **MCP Server Marketplace** - Plugin ecosystem for external tools
- **Codebase Indexing** - Semantic search via embeddings

**Confidence:** HIGH - Verified via [DeepWiki architecture docs](https://deepwiki.com/Kilo-Org/kilocode/1-overview) and [official comparison blog](https://blog.kilo.ai/p/roo-or-cline-were-building-a-superset)

---

## 2. Worktree / Isolation Patterns

### Git Worktree Architecture

Kilo Code's parallel mode uses git worktrees for complete filesystem isolation:

```
project/
├── .git/                           # Main git directory
├── .kilocode/
│   └── worktrees/                  # Isolated agent workspaces
│       ├── agent-1-feature-a/      # Full working copy
│       ├── agent-2-feature-b/      # Full working copy
│       └── agent-3-bugfix/         # Full working copy
└── src/                            # Main working directory
```

**Key Implementation Details:**
- Worktrees created in `.kilocode/worktrees/` within project
- Folder auto-excluded via `.git/info/exclude` (local-only, no commit needed)
- Each agent gets isolated branch context
- After completion, worktree cleaned up, branch preserved
- Results reviewable as PRs for merge/cherry-pick

### Parallel Mode CLI Workflow

```bash
# Spawn parallel agent with worktree isolation
kilocode --parallel "Implement feature X"

# Use existing branch
kilocode --parallel --existing-branch feature/my-branch "Continue work"

# Autonomous mode with parallel
kilocode --parallel --auto "Refactor module"
```

**Internal Workflow:**
1. Create git worktree at temporary directory
2. Switch to new or existing branch
3. Execute task in isolated workspace
4. Commit changes on completion
5. Return to original directory
6. Clean up worktree (branch preserved)

### IDE Agent Manager

The Agent Manager provides GUI control for parallel agents:
- Spawn 1-4 agents on git worktrees simultaneously
- Each works on different tasks without conflict
- Session controls: Continue, Approve, Cancel, Stop
- Post-completion: VCS UI for review before merge

**Confidence:** HIGH - Verified via [Agent Manager docs](https://kilo.ai/docs/advanced-usage/agent-manager) and [Parallel Agents CLI](https://kilo.ai/features/parallel-agents-cli)

---

## 3. Multi-Agent Orchestration

### Orchestrator Mode (Subtask Decomposition)

Orchestrator Mode acts as an "AI project manager" that:
1. Analyzes complex tasks
2. Decomposes into subtasks
3. Delegates to specialized modes (Architect, Code, Debug)
4. Coordinates sequential execution
5. Aggregates results via summaries

**Context Isolation Model:**
```
┌─────────────────────────────────────────┐
│           Orchestrator Task             │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │Subtask 1│ │Subtask 2│ │Subtask 3│   │
│  │Architect│ │  Code   │ │  Debug  │   │
│  │  Mode   │ │  Mode   │ │  Mode   │   │
│  └────┬────┘ └────┬────┘ └────┬────┘   │
│       │           │           │         │
│       └─────────┬─┴───────────┘         │
│                 ↓                       │
│         Summaries only                  │
└─────────────────────────────────────────┘
```

**Critical Distinction from Claude Code:**
| Aspect | Claude Code | Kilo Code |
|--------|-------------|-----------|
| Sub-agent state | Stateful, persistent context | **Stateless, transactional** |
| Context inheritance | Full independent window | Must be explicitly passed |
| Multi-step reasoning | Agent maintains history | Each subtask isolated |

**Information Flow:**
- **Down:** Via `message` parameter in `new_task` tool
- **Up:** Only `result` summary from `attempt_completion` returns

### Task Stack Architecture

ClineProvider uses stack-based task management (LIFO):

```typescript
// Conceptual structure
class ClineProvider {
  clineStack: Task[] = [];  // LIFO stack

  getCurrentTask(): Task | undefined {
    return this.clineStack[this.clineStack.length - 1];
  }

  pushSubtask(task: Task) {
    this.clineStack.push(task);  // Parent pauses
  }

  popSubtask(): Task {
    return this.clineStack.pop();  // Resume parent
  }
}
```

**Stack-Based Execution:**
- Tasks execute one at a time (sequential, not parallel)
- Subtasks can spawn, pushing onto stack
- Parent pauses while child executes
- Child completion pops, parent resumes with summary

**Confidence:** HIGH - Verified via [Orchestrator Mode docs](https://kilo.ai/docs/basic-usage/orchestrator-mode) and [DeepWiki architecture](https://deepwiki.com/Kilo-Org/kilocode/1-overview)

---

## 4. Parallel Execution Patterns

### Agent Runtime Package

The `@kilocode/agent-runtime` package enables headless agent execution:

```
┌─────────────────┐     IPC      ┌─────────────────┐
│  Parent Process │◄────────────►│  Agent Process  │
│  (CLI/Manager)  │              │ (Extension Host)│
└─────────────────┘              └─────────────────┘
```

**Process Model:**
- **Parent Process:** CLI or Agent Manager controls lifecycle
- **Agent Process:** Forked Node.js child running extension host
- **Communication:** Bidirectional IPC with request/response + timeouts

**Agent Spawning:**
```javascript
// Configuration passed via environment
const agentConfig = {
  workspace: '/path/to/project',
  provider: { /* API settings */ },
  mode: 'code',
  sessionId: 'uuid'
};

// Spawn agent
const agent = fork(agentPath, [], {
  env: { AGENT_CONFIG: JSON.stringify(agentConfig) }
});
```

**Message Protocol:**

| Direction | Message | Purpose |
|-----------|---------|---------|
| Parent → Agent | `sendMessage` | Transmit user tasks |
| Parent → Agent | `injectConfig` | Update settings |
| Parent → Agent | `shutdown` | Graceful termination |
| Agent → Parent | `ready` | Initialization complete |
| Agent → Parent | `message` | Extension responses |
| Agent → Parent | `stateChange` | State updates |

### Read-Shared, Write-Isolated Pattern

**Key Architecture Decision:**
- **Read:** Configuration retrieved from extension via provider state (shared)
- **Write:** Each spawned agent receives isolated config via env vars (isolated)

This ensures parallel agents have independent state with no race conditions or file I/O conflicts.

### Proposed Ensemble Mode (Discussion #2337)

Community proposal for enhanced parallel execution:

```
┌───────────────────────────────────────────────────────────────┐
│                       Ensemble Mode                           │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │ Claude  │  │ GPT-4   │  │ Gemini  │  │ Llama   │          │
│  │Worktree1│  │Worktree2│  │Worktree3│  │Worktree4│          │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘          │
│       │            │            │            │                │
│       └────────────┴────────────┴────────────┘                │
│                         │                                     │
│                    ┌────▼────┐                                │
│                    │ Review  │                                │
│                    │ Model   │                                │
│                    └────┬────┘                                │
│                         │                                     │
│                    ┌────▼────┐                                │
│                    │  Best   │                                │
│                    │ Synthesis│                               │
│                    └─────────┘                                │
└───────────────────────────────────────────────────────────────┘
```

**Proposed Workflow:**
1. User selects Ensemble Mode, defines task
2. Choose participating models + review model
3. System creates isolated git worktrees for each
4. Agents work in parallel on respective worktrees
5. Review model evaluates all implementations
6. Synthesize best elements into final solution
7. Apply to main branch, clean up worktrees

**Status:** Feature request, not yet implemented. Current parallel mode differs.

**Confidence:** HIGH for existing features, LOW for Ensemble Mode (proposed only)

---

## 5. Enterprise Features

### Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Basic features, BYOK |
| Teams | $29/user/month | Centralized billing, team management, usage analytics, role-based permissions, priority support |
| Enterprise | $299/user/month | SSO/OIDC/SCIM, audit logs, model/provider limits, SLAs, dedicated support |

### Enterprise Capabilities

**Security & Compliance:**
- Enterprise proxy routing with auditing
- Rate limits and data loss prevention controls
- Pooled credits with unified billing
- Enterprise-grade data privacy controls

**Planned Features:**
- Audit logs
- Role-based access control (RBAC)
- Managed deployments

**Core Extension Model:**
- Extension stays open source
- Monetization via premium agent infrastructure and enterprise management layers

**Local Operation:**
- Fully local operation option (code never leaves machine)
- No data used to train models

**Confidence:** MEDIUM - Verified via [enterprise page](https://kilo.ai/enterprise) but some features listed as "planned"

---

## 6. Unique Architecture Components

### ClineProvider - Central Orchestrator

Located at `src/core/webview/ClineProvider.ts`:

```typescript
// Key responsibilities
class ClineProvider extends WebviewViewProvider {
  // Task stack (LIFO)
  clineStack: Task[] = [];

  // Core functions
  createWebviewPanel();           // Webview lifecycle
  spawnTask(options);            // Task management
  postMessageToWebview(msg);     // Message routing
  getStateToPostToWebview();     // State serialization

  // Integration points
  sessionManager: SessionManager;  // CLI sync
  codeIndexManager: CodeIndexManager;  // Semantic search
  mcpServerManager: McpServerManager;  // External tools
}
```

### Task Class

Manages individual AI conversation sessions:

```typescript
class Task extends EventEmitter {
  // Dual history design
  apiConversationHistory: ApiMessage[];  // LLM tokens
  clineMessages: ClineMessage[];          // UI display

  // State machine properties
  isStreaming: boolean;
  isWaitingForFirstChunk: boolean;
  userMessageContentReady: boolean;
  didRejectTool: boolean;
  abort: boolean;

  // Lifecycle events
  emit('TaskCreated' | 'TaskStarted' | 'TaskCompleted' | 'TaskAborted');
}
```

**Dual History Benefits:**
- Checkpoint restoration (rewind API history)
- Conversation replay (reconstruct from saved)
- Context condensing (compress old, preserve UI display)

### Extension-Webview Communication

**Typed message protocol:**

```typescript
// Extension → Webview
type ExtensionMessage =
  | { type: 'state', state: AppState }
  | { type: 'action', action: string }
  | { type: 'mcpServers', servers: McpServer[] }
  | { type: 'routerModels', models: Model[] }
  | { type: 'indexingStatusUpdate', status: IndexStatus };

// Webview → Extension
type WebviewMessage =
  | { type: 'newTask', text: string }
  | { type: 'askResponse', response: string }
  | { type: 'saveApiConfiguration', config: ApiConfig }
  | { type: 'cancelTask' };
```

Messages routed through `webviewMessageHandler()` to appropriate Task or ClineProvider methods.

### Memory Bank

Markdown-based context persistence in `.kilocode/rules/memory-bank/`:

```
memory-bank/
├── brief.md        # Project goals (user-maintained)
├── product.md      # Problems solved, UX goals
├── context.md      # Current work, recent changes (frequently updated)
├── architecture.md # System design, component relationships
├── tech.md         # Stack, frameworks, dependencies
└── tasks.md        # Repetitive workflow documentation
```

**Session Workflow:**
1. Task start: Kilo reads all memory bank files
2. Signals `[Memory Bank: Active]` with context summary
3. Commands: `initialize memory bank`, `update memory bank`
4. Complements (but independent of) codebase indexing

### Codebase Indexing

**Process:**
1. **Parse:** Tree-sitter identifies semantic blocks (functions, classes)
2. **Embed:** AI models create vector representations
3. **Store:** Qdrant/LanceDB for similarity searches
4. **Search:** `codebase_search` tool for semantic queries

**Embedding Providers:**
- OpenAI `text-embedding-3-small` (recommended)
- Gemini `gemini-embedding-001`
- Ollama (local, offline)

**Features:**
- Hash-based caching (no reprocessing unchanged files)
- Git branch switching handled
- Respects `.gitignore` and `.kilocodeignore`

**Confidence:** HIGH - Verified via [codebase indexing docs](https://kilo.ai/docs/features/codebase-indexing) and [memory bank docs](https://kilo.ai/docs/advanced-usage/memory-bank)

---

## 7. CLI Commands Reference

### Core Commands

```bash
# Basic usage
kilocode "Your prompt here"

# Operating modes
kilocode --mode architect "Design a REST API"
kilocode --mode code "Implement the function"
kilocode --mode debug "Fix this error"

# Autonomous mode (CI/CD)
kilocode --auto "Refactor module"
kilocode --auto --timeout 300 "Run tests"

# JSON output for integration
kilocode --auto --json "Generate report"

# Bidirectional JSON (for Agent Manager)
kilocode --json-io

# Parallel mode with worktree
kilocode --parallel "Feature implementation"
kilocode --parallel --existing-branch feature/x "Continue"

# Session management
kilocode --session <sessionId>
kilocode --continue  # Resume last conversation

# Provider/model override
kilocode --provider openai --model gpt-4 "Query"

# Attachments
kilocode --attach screenshot.png "Analyze this"

# Custom system prompt
kilocode --append-system-prompt "Always use TypeScript"
kilocode --append-system-prompt-file rules.md "Proceed"

# Auto-approve all (YOLO mode)
kilocode --yolo "Do it"
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error (init/validation) |
| 124 | Timeout exceeded |
| 130 | User interrupt (Ctrl+C) |
| 143 | System termination |

### Interactive Commands

```
/session show      # Current session ID
/session list      # All sessions (up to 50)
/session search X  # Search sessions
/session select X  # Restore session
/session share     # Share publicly
/session fork X    # Fork shared session
/session delete X  # Delete session
/session rename X  # Rename session
/exit              # Exit CLI
/clear             # Clear screen
/help              # Help
```

**Confidence:** HIGH - Verified via [DeepWiki CLI docs](https://deepwiki.com/Kilo-Org/kilocode/7.2-cli-commands-and-usage)

---

## 8. Patterns Relevant to CodeMAD

### High-Value Patterns for Adoption

| Pattern | Kilo Implementation | CodeMAD Application |
|---------|---------------------|---------------------|
| **Worktree Isolation** | `.kilocode/worktrees/` with auto-exclude | Phase 2/3: Parallel agent execution |
| **Stack-Based Tasks** | ClineProvider.clineStack LIFO | Orchestrator mode for subtasks |
| **Read-Shared, Write-Isolated** | Env vars for agent config | Multi-agent state management |
| **Dual History** | apiConversationHistory + clineMessages | Checkpoint/replay support |
| **Memory Bank** | Markdown files for context | Cross-session context persistence |
| **Agent Runtime** | Fork Node.js, IPC messages | Headless agent execution |

### Architectural Decisions to Consider

**Sequential vs Parallel:**
- Kilo's orchestrator is **sequential** (stack-based, one at a time)
- Kilo's parallel mode is **truly parallel** (worktree isolation)
- Claude Code sub-agents are **stateful** (Kilo's are stateless)

**State Management:**
- Four-tier: Memory → VS Code → Filesystem → Cloud
- Each tier has different persistence/accessibility tradeoffs

**Extension-CLI Parity:**
- CLI bundles and executes extension code directly
- Eliminates code duplication
- Terminal-optimized interface on top

### Anti-Patterns to Avoid

| Anti-Pattern | Why Bad | Alternative |
|--------------|---------|-------------|
| Sharing mutable state between parallel agents | Race conditions | Read-shared, write-isolated |
| Inheriting parent context automatically | Context pollution | Explicit message passing |
| Single worktree for multiple agents | File conflicts | Separate worktrees per agent |
| Stateful sub-agents (unless needed) | Memory overhead | Stateless, summary-based |

---

## 9. Open Questions

### For CodeMAD Planning

1. **Which orchestration model?**
   - Kilo: Stateless subtasks with explicit context passing
   - Claude: Stateful sub-agents with full context
   - Which fits CodeMAD's use case better?

2. **Worktree lifecycle management?**
   - Who cleans up abandoned worktrees?
   - How to handle branch conflicts?
   - PR creation automation?

3. **Session sync architecture?**
   - Cloud sync introduces latency
   - Local-first with eventual sync?
   - Cross-device requirements?

4. **Ensemble mode value?**
   - Multiple models on same task = expensive
   - When is synthesis worth the cost?
   - Alternative: best model per task type?

---

## Sources

### Primary (HIGH confidence)
- [DeepWiki - Kilo Code Overview](https://deepwiki.com/Kilo-Org/kilocode/1-overview)
- [DeepWiki - Core Features](https://deepwiki.com/Kilo-Org/kilocode/3-core-features)
- [DeepWiki - CLI Commands](https://deepwiki.com/Kilo-Org/kilocode/7.2-cli-commands-and-usage)
- [Kilo Docs - Agent Manager](https://kilo.ai/docs/advanced-usage/agent-manager)
- [Kilo Docs - Orchestrator Mode](https://kilo.ai/docs/basic-usage/orchestrator-mode)
- [Kilo Docs - Codebase Indexing](https://kilo.ai/docs/features/codebase-indexing)
- [Kilo Docs - Memory Bank](https://kilo.ai/docs/advanced-usage/memory-bank)
- [GitHub - AGENTS.md](https://github.com/Kilo-Org/kilocode/blob/main/AGENTS.md)

### Secondary (MEDIUM confidence)
- [GitHub Discussion #2337 - Ensemble Mode](https://github.com/Kilo-Org/kilocode/discussions/2337)
- [GitHub Discussion #27 - Parallel Agents](https://github.com/Kilo-Org/kilocode/discussions/27)
- [GitHub Discussion #1535 - Claude Sub-Agents](https://github.com/Kilo-Org/kilocode/discussions/1535)
- [Kilo Blog - Roo or Cline Superset](https://blog.kilo.ai/p/roo-or-cline-were-building-a-superset)
- [Kilo Enterprise Page](https://kilo.ai/enterprise)

### Tertiary (LOW confidence)
- Various Medium/blog posts for comparison context
- Community discussions on feature requests

---

## Metadata

**Research scope:** Kilo Code architecture, patterns for CodeMAD integration
**Confidence breakdown:**
- Fork differences: HIGH (official docs)
- Worktree patterns: HIGH (docs + DeepWiki)
- Orchestrator mode: HIGH (docs)
- Enterprise features: MEDIUM (some "planned")
- Ensemble mode: LOW (proposal only)

**Research date:** 2026-01-30
**Valid until:** ~2026-03-01 (active development, features changing)
