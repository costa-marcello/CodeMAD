# Architecture

<!-- v1.0 | 2026-01-30 | paths: ["packages/**/*"] -->

## Package Structure

```
packages/
├── opencode/          # Core CLI, business logic, server
│   └── src/
│       ├── agent/     # LLM agent logic
│       ├── cli/       # CLI commands (TUI in cli/cmd/tui/)
│       ├── mcp/       # Model Context Protocol
│       ├── provider/  # LLM provider integrations
│       ├── server/    # HTTP API server
│       ├── session/   # Conversation state
│       ├── tool/      # Agent tools (file ops, bash, etc.)
│       └── worktree/  # Git worktree management
├── app/               # Shared web UI (SolidJS)
├── desktop/           # Tauri native desktop wrapper
├── ui/                # UI component library
├── plugin/            # @opencode-ai/plugin source
├── sdk/               # Generated SDK from API
└── docs/              # Documentation site
```

## Key Entry Points

| File | Purpose |
|------|---------|
| `packages/opencode/src/index.ts` | CLI entry |
| `packages/opencode/src/server/server.ts` | API server |
| `packages/desktop/src-tauri/` | Rust/Tauri native code |

## Provider Architecture

LLM providers use Vercel AI SDK (`ai` package) in `packages/opencode/src/provider/`.

**Chinese providers** (Kimi, GLM, Minimax) use OpenAI-compatible API via `@ai-sdk/openai-compatible`.

## Planning Documents

Project planning lives in `.planning/`:

| File | Contents |
|------|----------|
| `PROJECT.md` | Requirements and decisions |
| `ROADMAP.md` | 6-phase delivery plan |
| `STATE.md` | Current progress |
| `phases/` | Detailed execution plans |
