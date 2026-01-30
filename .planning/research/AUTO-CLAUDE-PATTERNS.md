# Auto-Claude Patterns Research

**Researched:** 2026-01-30
**Domain:** Autonomous Multi-Agent AI Coding with Git Worktree Isolation
**Confidence:** HIGH (multiple verified sources, active GitHub projects)

## Executive Summary

Auto-Claude and similar tools represent a paradigm shift in AI-assisted development: from single-agent coding assistance to **orchestrated multi-agent autonomous development**. The core innovation is using **git worktrees** for isolated parallel execution, enabling 4-12 concurrent AI agents to work simultaneously without conflicts.

This research covers five key implementations: Auto-Claude (AndyMik90), parallel-cc (frankbria), ccswarm (nwiizo), ccpm (automazeio), and incident.io's production patterns. All share common architectural patterns that inform CodeMAD Phase 1-3 planning.

**Primary recommendation:** Adopt git worktree isolation as the foundation, with SQLite-based session tracking, heartbeat-based health monitoring, and specification-driven task orchestration.

---

## 1. Git Worktree Implementation Patterns

### Core Concept

Git worktrees allow multiple branch checkouts simultaneously in separate directories, sharing a single `.git` database. This enables:

- **Isolation**: Each agent works in its own directory without conflicts
- **Safety**: Main branch remains untouched until explicit merge
- **Parallelism**: Multiple builds run without blocking each other
- **Rollback**: Discard worktree = discard all changes instantly

### Standard Directory Structure

```
project-root/
├── .git/                      # Shared git database
├── .worktrees/                # Worktree mount point (optional)
│   └── auto-claude/           # Auto-Claude specific
│       └── {spec-name}/       # Per-spec worktree
├── .auto-claude/              # Specs and metadata
│   └── specs/
│       └── {NNN}-{name}/
│           ├── spec.md
│           ├── requirements.json
│           ├── context.json
│           ├── implementation_plan.json
│           ├── qa_report.md
│           └── QA_FIX_REQUEST.md
└── main working directory...
```

**Alternative (parallel-cc pattern):**
```
~/projects/
├── myrepo/                    # Primary checkout (main)
└── worktrees/
    └── myrepo/
        ├── parallel-abc123/   # Session worktree 1
        └── parallel-def456/   # Session worktree 2
```

### Branch Naming Convention

| System | Pattern | Example |
|--------|---------|---------|
| Auto-Claude | `auto-claude/{spec-name}` | `auto-claude/001-auth-feature` |
| parallel-cc | `parallel-{session-id}` | `parallel-abc123` |
| incident.io | `{username}/{feature}` | `pete/oauth-refactor` |

### Worktree Lifecycle Commands

```bash
# Create worktree
git worktree add -b feature-branch ../worktrees/feature-name

# List worktrees
git worktree list

# Remove worktree (after merge or discard)
git worktree remove ../worktrees/feature-name

# Prune stale worktrees
git worktree prune
```

### Key Implementation Detail: Never Push Until Explicit

All systems keep branches LOCAL until user explicitly approves:

```
main (user's branch)
└── auto-claude/{spec-name} ← LOCAL spec branch (isolated worktree)
```

This prevents polluting remote with experimental work.

---

## 2. Parallel Agent Management

### Session Tracking Patterns

**Pattern 1: SQLite Coordination (parallel-cc)**

```
~/.parallel-cc/coordinator.db

Tables:
- sessions (repo_path, pid, created_at, last_heartbeat)
- file_claims (path, session_id, claim_type: exclusive|shared)
- merge_events (branch, merged_at, notification_sent)
```

Advantages:
- Single source of truth
- Survives process restarts
- Enables conflict detection before it happens

**Pattern 2: File-Based State (ccswarm, Auto-Claude)**

```
~/.claude/teams/{team-name}/
├── config.json            # Team metadata, member roster
└── inboxes/
    └── {agent}.json       # Per-agent message queue

~/.claude/tasks/{team-name}/
└── {N}.json               # Task with full state snapshot
```

Advantages:
- Human-readable debugging
- No database dependencies
- Easy to inspect/modify

**Pattern 3: Zustand Stores (Auto-Claude Frontend)**

```typescript
// 24+ stores covering:
stores/
├── project-store.ts       # Active project state
├── task-store.ts          # Kanban board state
├── terminal-store.ts      # PTY session tracking
├── agent-store.ts         # Running agent status
└── settings-store.ts      # User preferences
```

### Concurrency Limits

| System | Max Concurrent | Notes |
|--------|----------------|-------|
| Auto-Claude | 12 terminals | PTY daemon manages all |
| Claude Code (native) | 10 Tasks | Batched execution |
| ccswarm | Configurable | Via agent pool size |

### Heartbeat Mechanisms

**parallel-cc implementation:**

```bash
# PostToolUse hook in ~/.claude/settings.json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.local/bin/parallel-cc-heartbeat.sh"
      }]
    }]
  }
}
```

- Updates session timestamp after each Claude tool execution
- Sessions inactive 10+ minutes flagged as stale
- Cleanup daemon removes stale worktrees

**Auto-Claude implementation:**

- Electron frontend monitors agent processes
- IPC communication with 40+ handler modules
- Real-time Kanban board reflects agent state

---

## 3. Agent Coordination Patterns

### Multi-Agent Pipeline (Auto-Claude)

```
Spec Creation Pipeline:
┌─────────────┐   ┌──────────────┐   ┌─────────────┐   ┌───────────┐
│  Discovery  │ → │ Requirements │ → │   Context   │ → │   Spec    │
└─────────────┘   └──────────────┘   └─────────────┘   └───────────┘
                         ↓                                   ↓
                  [optional]                          ┌───────────┐
               ┌──────────────┐                       │   Plan    │
               │   Research   │                       └───────────┘
               └──────────────┘                            ↓
                                                    ┌───────────┐
                                                    │ Validate  │
                                                    └───────────┘

Implementation Pipeline:
┌──────────┐   ┌─────────┐   ┌─────────────┐   ┌──────────┐
│ Planner  │ → │  Coder  │ → │ QA Reviewer │ → │ QA Fixer │
└──────────┘   └─────────┘   └─────────────┘   └──────────┘
                   ↑              │                  │
                   └──────────────┴──────────────────┘
                          (loop until approved)
```

### Complexity Tiers

| Tier | Phases | Scope | Files |
|------|--------|-------|-------|
| SIMPLE | 3 | UI fixes, text changes | 1-2 |
| STANDARD | 6-7 | Features, bug fixes | 3-10 |
| COMPLEX | 8 | Multi-service, integrations | 10+ |

### Swarm Coordination Patterns (ccswarm)

**1. Parallel Specialists**
```
Multiple reviewers simultaneously:
├── security-reviewer → security findings
├── performance-reviewer → perf findings
├── architecture-reviewer → arch findings
└── leader → synthesizes all findings
```

**2. Sequential Pipeline**
```
Phase 1 (discovery) completes →
  Phase 2 (planning) unblocks →
    Phase 3 (implementation) unblocks →
      Phase 4 (QA) unblocks
```

**3. Self-Organizing Swarm**
```
Shared task pool:
├── Task A (unclaimed)
├── Task B (claimed by worker-1)
├── Task C (completed)
└── Task D (unclaimed)

Workers race to claim tasks, naturally load-balance
```

### TeammateTool Operations (ccswarm)

| Operation | Purpose |
|-----------|---------|
| `spawnTeam` | Create team infrastructure |
| `discoverTeams` | List available teams |
| `requestJoin` | Request team membership |
| `approveJoin`/`rejectJoin` | Leader manages membership |
| `write` | Target message to specific agent |
| `broadcast` | Send to all (expensive) |
| `requestShutdown` | Initiate graceful exit |
| `approvePlan`/`rejectPlan` | Leader governs plans |
| `cleanup` | Remove team resources |

### Task Lifecycle States

```
pending → in_progress → completed
                ↓
           (on failure)
                ↓
            blocked
```

Task dependencies via `blockedBy`/`blocks` relationships auto-unblock when dependencies complete.

---

## 4. Session/State Management

### Auto-Claude State Layers

**1. Specification State (File-Based)**
```
.auto-claude/specs/001-feature/
├── spec.md                    # Human-readable specification
├── requirements.json          # Parsed requirements
├── context.json               # Project context snapshot
├── implementation_plan.json   # Task breakdown
├── qa_report.md               # QA findings
└── QA_FIX_REQUEST.md          # Current fix request
```

**2. Runtime State (Zustand + IPC)**
```typescript
// Agent state store
interface AgentState {
  running: Map<string, AgentProcess>;
  queue: Task[];
  history: CompletedTask[];
}

// Terminal state store
interface TerminalState {
  sessions: Map<string, PTYSession>;
  activeId: string | null;
}
```

**3. Memory State (Graphiti Graph DB)**
```
Cross-session semantic knowledge:
├── Entities (files, functions, concepts)
├── Relations (depends-on, implements, tests)
└── Temporal context (when learned, relevance decay)
```

### Pause/Resume Mechanisms

**File-Based Pause (Auto-Claude):**
```bash
# Pause after current session
touch specs/001-name/PAUSE

# Add instructions for resume
echo "Focus on error handling" > specs/001-name/HUMAN_INPUT.md
```

**Interactive Pause:**
- `Ctrl+C` (once) = Pause and add instructions
- `Ctrl+C` (twice) = Exit immediately

### Session Recovery

**parallel-cc approach:**
```bash
# Check session health
parallel-cc doctor

# View active sessions
parallel-cc status --json

# Clean stale sessions
parallel-cc cleanup

# Manual release if needed
parallel-cc release --pid $$
```

---

## 5. Unique Patterns for Isolated Execution

### Intent-Aware Semantic Merge (Auto-Claude)

When multiple agents modify related files:

```
apps/backend/merge/
├── semantic_analyzer.py   # AST-based conflict detection
├── intent_matcher.py      # Match change intentions
└── auto_resolver.py       # Intelligent resolution
```

Not just line-by-line merge - understands what each change intended.

### E2E Testing via Electron MCP (Auto-Claude)

QA agents interact with running application:
```
QA Reviewer can:
├── Launch app in test mode
├── Interact via Chrome DevTools Protocol
├── Capture screenshots
├── Verify UI behavior
└── Report findings back to QA Fixer
```

### Three-Layer Security Model (Auto-Claude)

```
Layer 1: OS Sandbox
└── Bash commands execute in isolation

Layer 2: Filesystem Restrictions
└── Operations confined to project directories

Layer 3: Dynamic Command Allowlist
└── Only approved commands based on detected project stack
```

### Context Window Optimization

**Problem:** 200k tokens sounds large but fills fast in complex projects.

**Solutions:**

1. **Task isolation**: Each Task gets fresh 200k context
2. **Explicit file paths**: Don't waste tokens on discovery
3. **Summary extraction**: Subagents summarize findings, not raw data
4. **Staged delegation**: Research agent → summary → Implementation agent

### GitButler Alternative (Non-Worktree)

For simpler setups without worktree complexity:

```
Lifecycle hooks automatically:
├── Create branch per Claude session
├── Commit with prompt as message
├── Organize changes by session
└── Enable merge in any order
```

Trade-off: Less isolation but less setup overhead.

---

## 6. Implementation Recommendations for CodeMAD

### Phase 1: Foundation

**Git Worktree Manager:**
```typescript
interface WorktreeManager {
  create(name: string, baseBranch?: string): Promise<WorktreePath>;
  list(): Promise<Worktree[]>;
  remove(name: string): Promise<void>;
  getPath(name: string): WorktreePath | null;
}
```

**Session Tracker (SQLite):**
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  worktree_path TEXT NOT NULL,
  pid INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_heartbeat TIMESTAMP,
  status TEXT CHECK(status IN ('active', 'paused', 'completed', 'failed'))
);
```

### Phase 2: Agent Coordination

**Task Queue:**
```typescript
interface TaskQueue {
  enqueue(task: Task): void;
  claim(agentId: string): Task | null;
  complete(taskId: string, result: TaskResult): void;
  getBlocked(): Task[];
  getDependents(taskId: string): Task[];
}
```

**Agent Registry:**
```typescript
interface AgentRegistry {
  spawn(type: AgentType, config: AgentConfig): AgentHandle;
  list(): AgentInfo[];
  terminate(id: string): Promise<void>;
  sendMessage(id: string, message: Message): void;
}
```

### Phase 3: Orchestration

**Specification-Driven Execution:**
```
1. User creates spec (via CLI or UI)
2. Spec analyzer determines complexity tier
3. Orchestrator creates implementation plan
4. Tasks distributed to agent pool
5. QA loop validates until approved
6. User reviews and merges
```

---

## 7. Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Single worktree for all agents | Conflicts, blocked execution | One worktree per task/spec |
| No heartbeat monitoring | Zombie sessions accumulate | Periodic heartbeat + cleanup |
| Nested subagent spawning | Complexity explosion | Single delegation level |
| Polling for task completion | Wastes resources | Event-driven with dependencies |
| Shared mutable state | Race conditions | Message passing or file locks |
| No session recovery | Lost work on crash | Persistent state + resume |

---

## 8. Technology Stack Summary

| Component | Recommended | Alternatives |
|-----------|-------------|--------------|
| Worktree management | Native git commands | libgit2 bindings |
| Session DB | SQLite (better-sqlite3) | File-based JSON |
| IPC | Unix domain sockets | Named pipes, TCP |
| Agent spawning | Node child_process | Python subprocess |
| State management | Zustand (frontend) | Redux, MobX |
| Memory/context | Graphiti (graph DB) | Vector store, simple JSON |
| Terminal emulation | xterm.js + node-pty | Not needed for CLI-only |

---

## Sources

### Primary (HIGH confidence)
- [Auto-Claude GitHub Repository](https://github.com/AndyMik90/Auto-Claude) - Core architecture, CLAUDE.md
- [parallel-cc GitHub Repository](https://github.com/frankbria/parallel-cc) - Session tracking, heartbeat patterns
- [ccswarm GitHub Repository](https://github.com/nwiizo/ccswarm) - Swarm orchestration, TeammateTool
- [ccpm GitHub Repository](https://github.com/automazeio/ccpm) - GitHub Issues integration, parallel patterns

### Secondary (MEDIUM confidence)
- [incident.io Blog: Shipping Faster with Claude Code and Git Worktrees](https://incident.io/blog/shipping-faster-with-claude-code-and-git-worktrees) - Production patterns
- [Claude Code Swarm Orchestration Gist](https://gist.github.com/kieranklaassen/4f2aba89594a4aea4ad64d753984b2ea) - TeammateTool operations
- [DEV.to: The Task Tool](https://dev.to/bhaidar/the-task-tool-claude-codes-agent-orchestration-system-4bf2) - Task tool internals
- [GitButler Blog: Parallel Claude Code](https://blog.gitbutler.com/parallel-claude-code) - Non-worktree alternative

### Tertiary (for context)
- [Medium: Mastering Git Worktrees with Claude Code](https://medium.com/@dtunai/mastering-git-worktrees-with-claude-code-for-parallel-development-workflow-41dc91e645fe)
- [DEV.to: Running Multiple Claude Code Sessions](https://dev.to/datadeer/part-2-running-multiple-claude-code-sessions-in-parallel-with-git-worktree-165i)

---

## Metadata

**Confidence breakdown:**
- Git worktree patterns: HIGH - Multiple verified implementations
- Agent coordination: HIGH - Active projects with documentation
- Session management: HIGH - Code available for inspection
- Semantic merge: MEDIUM - Auto-Claude specific, less verified
- Memory systems: MEDIUM - Graphiti mentioned but details sparse

**Research date:** 2026-01-30
**Valid until:** 2026-03-01 (fast-moving ecosystem)
