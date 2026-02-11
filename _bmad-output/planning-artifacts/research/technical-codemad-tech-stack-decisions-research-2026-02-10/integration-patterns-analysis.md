# Integration Patterns Analysis

**Research Coverage:** 3 parallel streams covering Tauri IPC, MCP + agent communication, and OAuth/auth patterns. 80+ sources.

---

## Tauri IPC and Sidecar Communication

### Recommended Architecture: Direct Localhost Connection

The proven pattern for Tauri + TypeScript sidecar:

```
Frontend (WebView)  ──HTTP/SSE──>  Bun Sidecar (localhost:PORT)
       │                                    │
       └──invoke()──>  Rust Core            │
                       (window mgmt,        │
                        sidecar lifecycle,   │
                        permissions)         │
```

1. Rust core spawns Bun sidecar via `app_handle.shell().sidecar()`
2. Sidecar exposes HTTP + WebSocket server on a random port
3. Port communicated back to Rust via stdout, forwarded to frontend
4. Frontend connects directly to `http://localhost:PORT`
5. LLM streaming via SSE (EventSource API) directly from sidecar

**Why direct connection:** Routing SSE through the Rust layer adds latency and complexity. The frontend's native `EventSource` API handles reconnection automatically. This is the same pattern Claude Code uses.

_Sources: [Tauri IPC Concepts](https://v2.tauri.app/concept/inter-process-communication/), [Bun/Deno as Tauri web server](https://codeforreal.com/blogs/using-bun-or-deno-as-a-web-server-in-tauri/), [Tauri Sidecar Docs](https://v2.tauri.app/develop/sidecar/)_

### IPC Method Comparison

| Method | Latency | Bidirectional | Streaming | Best For |
|--------|---------|---------------|-----------|----------|
| Tauri invoke() | Very low | Request-response | No | Window management, permissions |
| Tauri events | Low | Yes | No | State changes, notifications |
| HTTP (fetch) | Medium | No (polling) | Yes (SSE) | LLM streaming, API calls |
| WebSocket | Low | Yes | Yes | Real-time bidirectional updates |
| stdio | Low | No | No | Short-lived sidecar tasks |

**For CodeMAD:** Use invoke() for Rust-level operations (window management, sidecar lifecycle). Use HTTP/SSE for all agent communication and LLM streaming. Use WebSocket only if bidirectional real-time updates prove necessary.

### Platform Caveat: Mixed Content on Windows

On Windows and Android, Tauri uses `https://<scheme>.localhost` by default. This blocks connections to the sidecar's `http://` server (mixed content). **Fix:** Set `useHttpsUrl: false` in capabilities configuration.

_Source: [Tauri Localhost Plugin](https://v2.tauri.app/plugin/localhost/)_

### Type-Safe IPC: TauRPC

[TauRPC](https://github.com/MatsDK/TauRPC) auto-generates TypeScript types from Rust command signatures. Run `pnpm tauri dev` and types appear automatically. Provides typed proxies for commands and events.

---

## Model Context Protocol (MCP) Integration

### MCP Status in 2026

MCP has reached critical mass: **97 million monthly SDK downloads**, 10,000+ active servers, and first-class client support in Claude, ChatGPT, Cursor, Gemini, Microsoft Copilot, and VS Code. The specification is at version 2025-11-25.

_Sources: [MCP Specification](https://modelcontextprotocol.io/specification/2025-11-25), [Enterprise MCP Adoption 2026](https://www.cdata.com/blog/2026-year-enterprise-ready-mcp-adoption/)_

### Transport Options

| Transport | Protocol | Use Case | Status |
|-----------|----------|----------|--------|
| stdio | Child process stdin/stdout | Local MCP servers | Recommended (most common) |
| Streamable HTTP | HTTP POST + SSE responses | Remote MCP servers | Current standard |
| SSE | HTTP POST + SSE stream | Remote (legacy) | Deprecated, still supported |

**For CodeMAD:** Use stdio for local MCP servers (most common pattern). Use Streamable HTTP for remote servers with OAuth.

_Source: [MCPcat Transport Comparison](https://mcpcat.io/guides/comparing-stdio-sse-streamablehttp/)_

### Vercel AI SDK v6 MCP Integration

AI SDK v6 provides native MCP support via `experimental_createMCPClient`. The client's `tools()` method adapts MCP tools to AI SDK tools automatically. Two approaches:
- **Schema discovery** -- automatically list all server tools
- **Explicit schema definition** -- define schemas manually for tighter control

_Source: [AI SDK Core MCP Tools](https://ai-sdk.dev/docs/ai-sdk-core/mcp-tools)_

### Lazy Tool Loading (Critical for Context Management)

Loading all MCP tool definitions at session start consumes tens of thousands of tokens. **Pattern:** Defer tool loading until first use. Start with no or minimal servers active. Launch/connect on demand.

This matches the project spec's "lazy-loaded to save context" design.

_Source: [ByteBridge: MCP Servers at Scale](https://bytebridge.medium.com/managing-mcp-servers-at-scale-the-case-for-gateways-lazy-loading-and-automation-06e79b7b964f)_

### Tool Change Notifications

Servers notify clients via `notifications/tools/list_changed` (JSON-RPC 2.0). Servers must declare `"listChanged": true` in capabilities during initialisation. The TypeScript SDK handles this automatically. **Note:** Claude Desktop does not yet support this.

_Source: [Spring AI Dynamic Tool Updates](https://spring.io/blog/2025/05/04/spring-ai-dynamic-tool-updates-with-mcp/)_

---

## Multi-Agent Communication Patterns

### Task List-Based Coordination (Proven Pattern)

Claude Code uses file-based task coordination:
- Shared task list stores: task ID, status, assignee, dependencies
- Agents check task list for new work (event-driven, not polling)
- Status updates are atomic to prevent race conditions
- Simple file-based implementation integrates naturally with git workflows

This validates the project spec's "task list communication" design.

### Git Worktree Isolation (Industry-Validated)

Multiple production implementations now prove the git worktree pattern for parallel agents:
- **Cursor:** Shipped Parallel Agents with worktree isolation
- **ccswarm:** Multi-agent orchestration for Claude Code CLI
- **Pochi:** Parallel agents using git worktrees with dedicated tabs

Each agent gets its own worktree with independent branch, HEAD, and index while sharing the `.git` object store.

_Sources: [Cursor Parallel Agents](https://cursor.com/docs/configuration/worktrees), [ccswarm](https://github.com/nwiizo/ccswarm), [Pochi](https://dev.to/getpochi/how-we-built-true-parallel-agents-with-git-worktrees-2580)_

### Agent Lifecycle Hooks (12 Events)

| Event | Purpose | CodeMAD Use |
|-------|---------|-------------|
| PreToolUse | Before tool execution | Permission gating, approval |
| PostToolUse | After tool success | Context enrichment |
| PostToolUseFailure | After tool failure | Error handling |
| SessionStart | Session begins | Load dev context |
| SessionEnd | Session ends | Cleanup |
| Stop | Agent stops | Run quality gate (exit code 2 = continue) |
| SubagentStart | Subagent spawns | Setup worktree |
| SubagentStop | Subagent terminates | Merge worktree |
| UserPromptSubmit | User submits prompt | Pre-processing |
| Notification | Generic | Logging/monitoring |
| PreCompact | Before context compaction | State preservation |
| PermissionRequest | Permission needed | Approval workflow |

The **Stop hook with exit code 2** pattern is critical: it forces the agent to continue working instead of reporting completion when validation fails. This eliminates false completions.

_Source: [Claude Code Hooks Reference](https://code.claude.com/docs/en/hooks)_

### Builder + Validator Pairing

The pattern is now standard across AI coding tools:
1. Builder agent generates code
2. Validator agent runs quality gate (lint, types, build, tests)
3. If failed, builder receives feedback and iterates
4. Cycle repeats until validation passes

This costs 2x compute but eliminates the "it compiles but doesn't work" failure mode.

---

## Authentication and Credential Management

### Critical Finding: Anthropic OAuth Restricted

**As of January 9, 2026**, Anthropic blocks third-party tools from using Claude Pro/Max subscription OAuth credentials. Error: *"This credential is only authorized for use with Claude Code."*

**Impact on CodeMAD:**
- Cannot offer "log in with your Claude Max subscription" as planned
- API keys remain the primary auth method for Anthropic
- Google and OpenAI OAuth still work normally
- This restriction may be temporary or negotiable for approved partners

_Source: [VentureBeat - Anthropic cracks down on unauthorised usage](https://venturebeat.com/technology/anthropic-cracks-down-on-unauthorized-claude-usage-by-third-party-harnesses/)_

### OAuth Implementation in Tauri 2.x

Two patterns for OAuth callback handling:

| Pattern | How | Best For |
|---------|-----|----------|
| Localhost redirect | Spawn temp HTTP server on port 8888 | Most reliable, works everywhere |
| Custom protocol | Register `codemad://callback` scheme | Cleaner UX, platform-dependent |

**Plugins:** [tauri-plugin-oauth](https://github.com/FabianLars/tauri-plugin-oauth) (localhost), [tauri-plugin-google-auth](https://github.com/Choochmeque/tauri-plugin-google-auth) (Google-specific)

### Credential Storage: OS-Native Keychains

**Upgrade from project spec:** Replace `0o600` file permissions with OS-native secure storage:

| Platform | Store | Tauri Plugin |
|----------|-------|-------------|
| macOS | Keychain | tauri-plugin-keyring |
| Windows | Credential Manager | tauri-plugin-keyring |
| Linux | Secret Service (GNOME Keyring) | tauri-plugin-keyring |

[tauri-plugin-keyring](https://github.com/HuakunShen/tauri-plugin-keyring) wraps the Rust `keyring` crate. Credentials persist across reinstalls. Much more secure than file-based storage.

### Credential Resolution Order (Validated)

The project spec's layering matches industry standard (Google ADC, AWS CLI):

| Priority | Source | Example |
|----------|--------|---------|
| 1 | Environment variables | `ANTHROPIC_API_KEY` |
| 2 | OS keychain | tauri-plugin-keyring |
| 3 | Auth store file | `~/.local/share/codemad/auth.json` |
| 4 | Config overrides | `codemad.json` provider section |

### MCP OAuth 2.1 for Remote Servers

MCP specification (2025-06) defines OAuth 2.1 for remote MCP servers:
- Authorization Code + PKCE flow
- Mandatory refresh token rotation
- Dynamic Client Registration (RFC 7591)
- Server metadata discovery via `/.well-known/oauth-protected-resource`

_Source: [MCP Authorization Spec](https://modelcontextprotocol.io/specification/draft/basic/authorization)_

---

## SSE Streaming Architecture for Agent UIs

### Multi-Agent Progress Display

When multiple parallel agents stream simultaneously, use a **conductor stream** pattern:
- Each agent maintains its own SSE stream with agent-specific tags
- A conductor aggregates events from all agents
- Frontend subscribes once to the conductor for unified display

**Event types for granular UI updates:**

| Event Type | Purpose |
|------------|---------|
| `TEXT_MESSAGE_CONTENT` | Model output (token-by-token) |
| `TOOL_CALL_START` | Tool invocation begins |
| `TOOL_CALL_RESULT` | Tool returns data |
| `AGENT_HANDOFF` | Agent-to-agent transition |
| `STATUS_CHANGE` | Task state transition |
| `ERROR` | Error notification |

This enables the "multi-track agent timeline" UI from the brainstorming session.

_Sources: [SSE for AI Agent Streaming](https://akanuragkumar.medium.com/streaming-ai-agents-responses-with-server-sent-events-sse-a-technical-case-study-f3ac855d0755), [SSE is King for LLM Streaming](https://medium.com/@FrankGoortani/sse-is-the-king-0559dcb0cb3d)_

---

## Integration Patterns Summary

| Integration Surface | Recommended Pattern | Validated By |
|--------------------|--------------------|--------------|
| Frontend to Sidecar | Direct HTTP/SSE on localhost | Claude Code, Claudia GUI |
| Rust to Sidecar | stdio for lifecycle, events for state | Tauri docs |
| Agent to Agent | Shared task list (file-based, event-driven) | Claude Code teams |
| Parallel Agents | Git worktree isolation | Cursor, ccswarm, Pochi |
| LLM Streaming | SSE via Vercel AI SDK streamText | Industry consensus |
| Tool Extensibility | MCP (stdio local, Streamable HTTP remote) | 97M monthly downloads |
| Authentication | API keys + OAuth PKCE (Google/OpenAI) | Provider docs |
| Credential Storage | OS-native keychain (tauri-plugin-keyring) | Security best practice |
| Agent Lifecycle | 12 hook events, exit code 2 for continue | Claude Code hooks |
| Quality Gate | Builder + Validator pairing, self-validating | Claude Code, Traycer |
