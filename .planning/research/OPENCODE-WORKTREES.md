# OpenCode Worktree Implementation Research

**Researched:** 2026-01-30
**Repository:** [anomalyco/opencode](https://github.com/anomalyco/opencode)
**Primary Language:** TypeScript (86.6%)
**Confidence:** HIGH (official docs, GitHub issues, release notes)

## Executive Summary

OpenCode (formerly sst/opencode) is an open-source AI coding agent with a client-server architecture. **Yes, OpenCode has worktree support**, but it's implemented at multiple levels:

1. **Core System**: Basic worktree awareness via `Instance.worktree` for project boundary detection
2. **Sandbox Mode**: Built-in git worktree creation for session isolation (added v1.1.1)
3. **Community Plugins**: Rich ecosystem of worktree management plugins for advanced workflows

The architecture enables but doesn't fully automate parallel AI agent work. Community plugins fill this gap with features like automatic terminal spawning, file sync, and cleanup on exit.

---

## Architecture Overview

### Client-Server Model

OpenCode operates as a **local HTTP server** (Hono framework, default port 4096) with multiple client interfaces:

| Client | Technology | Description |
|--------|------------|-------------|
| TUI | SolidJS via @opentui/solid | Terminal UI, primary interface |
| Desktop | Tauri 2.x | Cross-platform app with embedded CLI |
| VS Code | TypeScript extension | IDE integration |
| Web | Static site | Documentation/sharing |

**Key insight for CodeMAD**: The client-server split means the server can run anywhere (local, cloud, sandbox container) while clients connect remotely. This is the foundation for sandbox/worktree isolation.

### Event System

- **Server-Sent Events (SSE)** at `/global/event` for real-time sync
- **Dual-bus architecture**: LocalBus (instance) + GlobalBus (cross-client)
- **30+ event types** for session, message, and tool updates

Source: [Server Documentation](https://opencode.ai/docs/server/)

---

## Instance System: The Foundation

OpenCode uses an **Instance** system for project scoping. Two critical properties:

| Property | Purpose | Source |
|----------|---------|--------|
| `Instance.directory` | Current working directory (CWD) | Process.cwd() |
| `Instance.worktree` | Git worktree root | `git rev-parse --git-common-dir` resolution |

### How Worktree Detection Works

Location: `packages/opencode/src/project/project.ts` (lines 141-151)

```typescript
// Simplified flow
const gitCommonDir = execSync('git rev-parse --git-common-dir');
const worktree = path.dirname(gitCommonDir); // Parent of .git
```

**Known Issue (HIGH priority for CodeMAD)**: [Issue #10643](https://github.com/anomalyco/opencode/issues/10643) - Bare repo worktrees are mis-resolved because `--git-common-dir` returns the bare repo itself, not the worktree.

### Permission System

File operations check containment against `Instance.directory`:

```typescript
// packages/opencode/src/file/read.ts:30
if (!Filesystem.contains(Instance.directory, filepath)) {
  // triggers external_directory permission
}
```

This caused [Issue #7758](https://github.com/anomalyco/opencode/issues/7758): Monorepo subdirectories triggered false external_directory prompts. Fixed by checking against `Instance.worktree` as well.

---

## Sandbox Mode (Native)

Added in **v1.1.1**: "sandbox support for git worktrees to allow working in multiple directories per project"

### What Native Sandbox Does

1. Creates isolated git worktree per session
2. Worktree location: `~/.local/share/opencode/worktree/<project-id>/<branch>/`
3. Session-specific adjective-noun naming (e.g., "brave-eagle")
4. Undo/Redo via git commits within the worktree

### Sandbox Provider Vision

Per [Twitter thread by dax (OpenCode lead)](https://x.com/thdxr/status/2006441680090570925):

> "opencode is getting support for 'sandboxes' in general under the hood so you can run a session inside worktree, or docker, or cf sandbox, or daytona, or bring your own"

Planned sandbox providers:
- Git worktrees (current)
- Docker containers
- Cloudflare Sandbox
- Daytona
- Bring-your-own

**Evidence**: Docker image exists on Docker Hub: `cloudflare/sandbox:0.0.0-pr-314-96676c1-opencode`

---

## Agent System

### Built-in Agents

| Agent | Type | Permissions | Use Case |
|-------|------|-------------|----------|
| **Build** | Primary | Full access, auto-approve bash | Standard development |
| **Plan** | Primary | Read-only, ask for edits | Analysis, planning |
| **General** | Subagent | Configurable | Multi-step research |
| **Explore** | Subagent | Read-only | Codebase exploration |

Switch agents with Tab key. Subagents invoked via `@` mentions or automatically by primary agents.

### Agent Configuration

Defined in JSON or markdown, supports:
- Custom system prompts
- Model selection per agent
- Tool permission overrides
- Temperature settings
- Max iteration limits

Source: [Agent Configuration](https://opencode.ai/docs/agents/)

### Tool Registry

Built-in tools: `read`, `write`, `edit`, `bash`, `list`, `glob`, `grep`, `task`

Each tool has permission levels:
- `auto` - Execute without asking
- `ask` - Prompt user before execution
- `deny` - Block entirely

The **task** tool enables recursive agent delegation (subagent spawning).

---

## Community Worktree Plugins

The native worktree support is basic. Community plugins add sophisticated workflows:

### 1. opencode-worktree (kdco)

**Repo**: [kdcokenny/opencode-worktree](https://github.com/kdcokenny/opencode-worktree)

**Key Features**:
- Auto-spawns terminal with OpenCode running inside worktree
- File synchronization via `.opencode/worktree.jsonc`
- Hook system (postCreate, preDelete)
- Symlink support for node_modules

**MCP Tools Exposed**:
```typescript
worktree_create(branch, baseBranch?)  // Creates worktree, spawns terminal
worktree_delete(reason)                // Commits, cleans up, removes
```

**Terminal Detection**: Supports 15+ terminals across macOS/Linux/Windows with intelligent fallback.

**Worktree Location**: `~/.local/share/opencode/worktree/<project-id>/<branch>/`

### 2. opencode-worktree-session

**Repo**: [felixAnhalt/opencode-worktree-session](https://github.com/felixAnhalt/opencode-worktree-session)

**Features**:
- Worktrees in `.opencode/worktrees/`
- Main branch protection (refuses to run on main)
- Auto-generates commit messages via OpenCode API
- Auto-pushes and cleans up on exit

### 3. open-trees

**Repo**: [0xSero/open-trees](https://github.com/0xSero/open-trees)

**Tools**:
- `worktree_make` - Create/open/fork worktrees with sessions
- `worktree_cleanup` - Safe removal with pruning

### 4. opencode-devcontainers

**Repo**: [athal7/opencode-devcontainers](https://github.com/athal7/opencode-devcontainers)

For when you need more than worktrees: full container isolation with auto-assigned ports.

---

## Known Issues & Limitations

### Current Bugs

| Issue | Status | Impact |
|-------|--------|--------|
| [#10643](https://github.com/anomalyco/opencode/issues/10643) Bare repo worktrees not recognized | Open | WorktreeNotGitError |
| [#5638](https://github.com/anomalyco/opencode/issues/5638) Desktop app worktree collision | Open | Same project ID across worktrees |

### Feature Gaps

| Issue | Status | Description |
|-------|--------|-------------|
| [#564](https://github.com/anomalyco/opencode/issues/564) Full worktree integration | Closed (incomplete) | Multi-agent file conflict avoidance |
| [#1877](https://github.com/anomalyco/opencode/issues/1877) Session aggregation across subdirs | Open | Continuing work in worktrees |
| [#9366](https://github.com/anomalyco/opencode/issues/9366) Per-session working directories | Closed (duplicate) | Custom Session.directory |

### Per-Session Directory (Recent)

PR [#9365](https://github.com/anomalyco/opencode/pull/9365) adds `Session.directory` accessor, enabling:
- Sessions with independent working directories
- Fallback to `Instance.directory` when not set
- Plugin hook `session.creating` for customization

---

## Relevant Release History

| Version | Date | Worktree Changes |
|---------|------|------------------|
| v1.1.1 | 2025-08 | Sandbox support for git worktrees, managed worktrees |
| v1.1.14 | 2026-01-12 | Check worktree for external_directory in subdirs |
| v1.1.20 | 2026-01-14 | Fix plan mode when not in git worktree |
| v1.1.23 | 2026-01-15 | Filter dead worktrees from git worktree list |
| v1.1.37 | 2026-01-27 | Add worktree to plugin tool context, expose Instance.directory |

---

## CodeMAD Implementation Recommendations

### What to Adopt from OpenCode

1. **Instance System Pattern**
   - Separate `Instance.directory` (CWD) from `Instance.worktree` (git root)
   - Use worktree for permission boundaries, CWD for tool context

2. **Client-Server Architecture**
   - HTTP API with SSE for real-time sync
   - Enables remote clients (mobile, web, IDE)
   - Foundation for cloud sandbox deployment

3. **Session Isolation via Worktrees**
   - Adjective-noun naming for branch/worktree
   - Store in `~/.local/share/codemad/worktree/<project-id>/<branch>/`
   - Undo/Redo via git commits

4. **Plugin Hook Pattern**
   - `session.creating` for worktree customization
   - Allow plugins to set `Session.directory`

### Pitfalls to Avoid

1. **Bare Repo Resolution**
   - Don't assume `git rev-parse --git-common-dir` parent is the worktree
   - Check if it's a bare repo first

2. **Project ID Collision**
   - OpenCode derives ID from root commit hash
   - All worktrees share same ID -> session collision
   - Consider worktree path in ID calculation

3. **CWD vs Worktree Containment**
   - Use worktree for permission checks, not just CWD
   - Otherwise monorepo subdirs trigger false external permissions

### What OpenCode Doesn't Have (CodeMAD Opportunities)

1. **Automatic Multi-Agent Coordination**
   - Community plugins exist but not core
   - Agent-to-agent handoff in worktrees

2. **Worktree Lifecycle Management**
   - No built-in cleanup policies
   - No stale worktree garbage collection

3. **Cross-Worktree Session Awareness**
   - Sessions don't know about each other's worktrees
   - No mechanism for merging work

---

## Sources

### Primary (HIGH confidence)
- [OpenCode GitHub Repository](https://github.com/anomalyco/opencode)
- [OpenCode Server Documentation](https://opencode.ai/docs/server/)
- [OpenCode SDK Documentation](https://opencode.ai/docs/sdk/)
- [OpenCode Agents Documentation](https://opencode.ai/docs/agents/)
- [DeepWiki - anomalyco/opencode](https://deepwiki.com/anomalyco/opencode)

### GitHub Issues & PRs
- [Issue #564 - Git worktree integration](https://github.com/anomalyco/opencode/issues/564)
- [Issue #7758 - external_directory in worktrees](https://github.com/anomalyco/opencode/issues/7758)
- [Issue #9366 - Per-session working directories](https://github.com/anomalyco/opencode/issues/9366)
- [Issue #10643 - Bare repo worktrees](https://github.com/anomalyco/opencode/issues/10643)

### Community Plugins
- [kdcokenny/opencode-worktree](https://github.com/kdcokenny/opencode-worktree)
- [felixAnhalt/opencode-worktree-session](https://github.com/felixAnhalt/opencode-worktree-session)
- [0xSero/open-trees](https://github.com/0xSero/open-trees)

### Release Notes
- [OpenCode Releases](https://github.com/anomalyco/opencode/releases)

---

## Metadata

**Research date:** 2026-01-30
**Confidence breakdown:**
- Architecture: HIGH - official docs + DeepWiki
- Worktree core: HIGH - code references + issues
- Community plugins: HIGH - README analysis
- Sandbox providers: MEDIUM - Twitter + partial evidence
- Future direction: LOW - single tweet

**Valid until:** ~30 days (active development, frequent releases)
