<p align="center">
  <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="CodeMAD logo">
</p>
<p align="center">Context-aware AI coding agent with workflow orchestration.</p>
<p align="center">
  <em>A fork of <a href="https://github.com/anomalyco/opencode">OpenCode</a> focused on project memory and multi-agent workflows.</em>
</p>

---

## What is CodeMAD?

CodeMAD is an AI coding agent that never loses your project context. Built as a fork of OpenCode, it adds:

- **Project Memory** - Persistent context across sessions (LanceDB + semantic search)
- **Workflow Orchestration** - Break complex projects into phased execution plans
- **Chinese LLM Support** - Native support for Kimi, GLM, Minimax providers
- **Multi-Agent Coordination** - Parallel agent execution with conflict resolution

### Installation

```bash
# From npm (coming soon)
npm i -g @codemad/cli

# From source
git clone https://github.com/costantinomarcello/codemad.git
cd codemad
bun install
bun run dev
```

### Desktop App

CodeMAD includes a desktop application built with Tauri.

| Platform              | Download                          |
| --------------------- | --------------------------------- |
| macOS (Apple Silicon) | `codemad-desktop-darwin-aarch64.dmg` |
| macOS (Intel)         | `codemad-desktop-darwin-x64.dmg`     |
| Windows               | `codemad-desktop-windows-x64.exe`    |
| Linux                 | `.deb`, `.rpm`, or AppImage       |

### Agents

CodeMAD includes built-in agents you can switch between with the `Tab` key.

- **build** - Default, full access agent for development work
- **plan** - Read-only agent for analysis and code exploration
- **general** - Subagent for complex searches and multistep tasks

### Documentation

For configuration and usage, see the [docs](./docs) directory.

### Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting PRs.

### Credits

CodeMAD is a fork of [OpenCode](https://github.com/anomalyco/opencode) (MIT License).
Original work by the OpenCode team and contributors.

---

**License:** MIT
