<p align="center">
  <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="CodeMAD logo">
</p>
<p align="center">Context-aware AI coding agent with workflow orchestration.</p>
<p align="center">
  <em>A fork of <a href="https://github.com/anomalyco/opencode">OpenCode</a> focused on project memory and multi-agent workflows.</em>
</p>
<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
</p>

---

## What is CodeMAD?

CodeMAD is an AI coding agent that never loses your project context. Built as a fork of OpenCode, it adds:

- **Chinese LLM Support** - Native support for Kimi 2.5, GLM 4.7, Minimax 2.1 providers
- **Project Memory** - Persistent context across sessions (coming: LanceDB + semantic search)
- **Workflow Orchestration** - Break complex projects into phased execution plans
- **Multi-Agent Coordination** - Parallel agent execution with git worktrees

## Features

### Available Now

- Multi-provider LLM support (Claude, GPT, Gemini, GLM 4.7, Kimi 2.5, Minimax 2.1)
- Cross-platform TUI and desktop app (macOS, Windows, Linux)
- MCP (Model Context Protocol) tool integration
- LSP (Language Server Protocol) code intelligence
- SQLite-backed session persistence
- Git integration (commit, diff, branch)

### Coming Soon

- Semantic code search with vector embeddings
- Git worktree parallel agent execution
- Per-hunk code review workflow
- GSD methodology (Discuss, Plan, Execute, Verify)
- Cross-session memory retrieval

## Installation

### Prerequisites

- [Bun](https://bun.sh) 1.3+
- Git

### From Source

```bash
git clone https://github.com/costantinomarcello/codemad.git
cd codemad
bun install
```

## Usage

### TUI Mode

```bash
bun dev
```

Run against a specific directory:

```bash
bun dev /path/to/your/project
```

### API Server

Start the server on port 4096:

```bash
bun dev serve
```

### Desktop App

Requires Rust toolchain for Tauri:

```bash
bun run --cwd packages/desktop tauri dev
```

## Configuration

### Provider Setup

Set your API keys as environment variables:

```bash
# Anthropic
export ANTHROPIC_API_KEY=sk-ant-...

# OpenAI
export OPENAI_API_KEY=sk-...

# Chinese providers
export MOONSHOT_API_KEY=sk-...      # Kimi 2.5
export ZHIPU_API_KEY=...            # GLM 4.7
export MINIMAX_API_KEY=...          # Minimax 2.1
```

Or configure via the TUI provider settings.

## Development

| Command | Purpose |
|---------|---------|
| `bun install` | Install dependencies |
| `bun dev` | Run TUI |
| `bun turbo typecheck` | Type checking |
| `bun run --cwd packages/app dev` | Web UI development |
| `bun run --cwd packages/desktop tauri dev` | Desktop app |

### Project Structure

```
packages/
├── opencode/     # Core CLI and business logic
├── app/          # Shared web UI (SolidJS)
├── desktop/      # Tauri native desktop wrapper
├── ui/           # UI component library
├── plugin/       # Plugin SDK
└── sdk/          # Generated API SDK
```

## Roadmap

- [x] **Phase 1: Fork Foundation** - Rebrand, Chinese provider support
- [ ] **Phase 2: Context Intelligence** - Vector embeddings, semantic search
- [ ] **Phase 3: Parallel Execution** - Git worktree multi-agent orchestration
- [ ] **Phase 4: Code Review** - Per-hunk approval workflow
- [ ] **Phase 5: GSD Workflow** - Discuss/Plan/Execute/Verify methodology
- [ ] **Phase 6: Polish & Security** - Privacy, security, UX refinements

See [`.planning/ROADMAP.md`](.planning/ROADMAP.md) for detailed plans.

## Contributing

Contributions welcome! This project uses:

- **TypeScript** with strict mode
- **Bun** as package manager and runtime
- **Conventional commits**: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`

### Guidelines

- Prefer `const` over `let`
- Use early returns instead of `else` blocks
- Avoid `any` type
- Use Bun APIs over Node equivalents

## Acknowledgments

CodeMAD is built on [OpenCode](https://github.com/anomalyco/opencode) by the Anomaly team (MIT License). Patterns inspired by Kilo Code, Verdant, and parallel-cc.

---

**License:** [MIT](LICENSE)
