<p align="center">
  <img src="assets/banner.png" alt="CodeMAD" width="460">
</p>

<p align="center">
  <strong>Structure for AI-first coding. Ship features, not prompts.</strong>
</p>

<p align="center">
  <a href="https://github.com/costa-marcello/codemad/actions/workflows/typecheck.yml"><img src="https://github.com/costa-marcello/codemad/actions/workflows/typecheck.yml/badge.svg" alt="Build"></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/Bun-1.3+-f472b6?logo=bun&logoColor=white" alt="Bun"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green" alt="License"></a>
  <a href="https://github.com/costa-marcello/codemad/stargazers"><img src="https://img.shields.io/github/stars/costa-marcello/codemad" alt="Stars"></a>
</p>

<br />

> **AI coding tools have a dirty secret:** they make you faster at writing code but slower at shipping products. You spend hours in context-switching hell, lose decisions between sessions, and watch AI-generated chaos multiply across your codebase.

**CodeMAD fixes this.** It's the first AI coding platform with a methodology -- turning "vibe coding" into shipped features through structured workflows, persistent memory, and parallel execution.

<br />

## Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [How CodeMAD Compares](#how-codemad-compares)
- [Features](#features)
- [Interface](#interface)
- [How It Works](#how-it-works)
  - [Agent System (TBD)](#agent-system)
  - [Tool System (TBD)](#tool-system)
  - [Semantic Code Search](#semantic-code-search)
  - [Provider Architecture](#provider-architecture)
  - [Session and Storage](#session-and-storage)
  - [Permission System](#permission-system)
  - [Git Worktree Isolation](#git-worktree-isolation)
  - [MCP Integration](#mcp-integration)
  - [API Server](#api-server)
  - [Configuration Resolution](#configuration-resolution)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Development](#development)
- [Roadmap](#roadmap)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Contributing](#contributing)

<br />

## The Problem

You've experienced this:

- **Session amnesia** -- Every conversation starts fresh. "Didn't we already decide to use Zustand?"
- **Chaos multiplication** -- AI generates code fast, but without structure, you're just creating technical debt faster
- **Merge nightmare** -- Parallel work means conflicts. Manual resolution means lost productivity
- **Privacy anxiety** -- Your code goes through someone's proxy server. You hope they're trustworthy

**Result:** AI tools that promise 10x productivity deliver 2x with 5x cleanup.

<br />

## The Solution

CodeMAD introduces the **CodeMAD Protocol** -- a four-phase methodology that turns AI assistance into shipped products:

```
Discuss --> Plan --> Execute --> Verify
   |          |        |          |
 Align    Structure  Build    Confirm
 intent   the work   parallel  the goal
                     agents    was met
```

**This isn't just another AI coding tool. It's AI coding with structure.**

<br />

---

## How CodeMAD Compares

| Capability                     | CodeMAD                     | Aider      | Claude Code     | Windsurf    | Continue.dev | Roo Code   |
| ------------------------------ | --------------------------- | ---------- | --------------- | ----------- | ------------ | ---------- |
| **Multi-agent worktrees**      | Git-isolated                | No         | Sub-agents only | No          | No           | No         |
| **Automatic code indexing**    | LanceDB + AST               | Repo map   | Manual          | Yes         | Yes          | Yes        |
| **Goal-backward verification** | CodeMAD Protocol            | No         | No              | No          | No           | No         |
| **Chinese LLM support**        | Kimi, GLM, MiniMax          | No         | No              | No          | No           | No         |
| **OAuth login**                | Anthropic PKCE              | No         | No              | No          | No           | No         |
| **Privacy (direct API)**       | Yes                         | Yes        | Yes             | No (Proxy)  | Yes          | Yes        |
| **Structured workflow**        | 4-phase protocol            | No         | No              | No          | No           | No         |
| **Open source**                | MIT                         | Apache     | Proprietary     | Proprietary | Apache       | Apache     |
| **Interface**                  | TUI + Web IDE + Desktop IDE | CLI        | CLI             | IDE         | VS Code      | VS Code    |
| **Pricing**                    | Free + API                  | Free + API | API usage       | $15-60/mo   | Free + API   | Free + API |

**Bottom line:** Other tools accelerate code generation. CodeMAD accelerates product delivery.

<br />

---

## Features

| Feature                      | Description                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------- |
| Autonomous Tasks             | Describe your goal; agents handle planning, implementation, and validation   |
| Parallel Execution           | Run multiple builds simultaneously with up to 12 agent chats                |
| Isolated Workspaces          | All changes happen in git worktrees -- your main branch stays safe          |
| Self-Validating QA           | Built-in quality assurance loop catches issues before you review             |
| AI-Powered Merge             | Automatic conflict resolution when integrating back to main                  |
| Memory Layer                 | Agents retain insights across sessions for smarter builds                    |
| Semantic Code Search         | AST-aware vector search finds code by meaning, not just keywords             |
| Permission Modes             | Guardian, Balanced, or Autopilot -- one click to set agent autonomy level   |
| MCP Tool Extensibility       | Connect any MCP server for extra tools; lazy-loaded to save context          |
| OAuth Provider Auth          | Log in with your existing subscription -- no API keys to manage              |
| GitHub/GitLab Integration    | Import issues, investigate with AI, create merge requests                    |
| Linear Integration           | Sync tasks with Linear for team progress tracking                            |
| Cross-Platform               | Native desktop apps for Windows, macOS, and Linux                            |
| Auto-Updates                 | App updates automatically when new versions are released                     |

<br />

---

## Interface

### Kanban Board

Visual task management from planning through completion. Create tasks and monitor agent progress in real-time.

### Agent Chats

AI-powered chats with one-click task context injection. Spawn multiple agents for parallel work.

### Additional Features

- **Insights** -- Separate chat interface for exploring your indexed codebase through conversation
- **Ideation** -- Discover improvements, performance issues, and vulnerabilities
- **Changelog** -- Generate release notes from completed tasks

<br />

---

## How It Works

This section explains every major subsystem in detail: what it does, how it is built, and where the code lives.

### Agent System

*(To define)*

### Tool System

*(To define)*

**Built-in tools:**

| Tool              | What It Does                                                              |
| ----------------- | ------------------------------------------------------------------------- |
| `bash`            | Run shell commands with timeout and working directory                     |
| `read`            | Read file contents with optional line range                               |
| `edit`            | Exact string replacement in files                                         |
| `write`           | Write entire file contents                                                |
| `glob`            | Fast file pattern matching (e.g., `**/*.ts`)                              |
| `grep`            | Content search using ripgrep-style patterns                               |
| `ls`              | List directory contents                                                   |
| `multiedit`       | Multiple edits to a single file in one call                               |
| `batch`           | Run multiple independent tool calls in parallel                           |
| `lsp`             | Language Server Protocol operations (go-to-definition, hover, references) |
| `task`            | Spawn a sub-agent for parallel work                                       |
| `webfetch`        | Fetch and process web content                                             |
| `websearch`       | Web search (conditional, feature-gated)                                   |
| `codesearch`      | Code search across the codebase                                           |
| `semantic_search` | Vector similarity search over indexed code                                |
| `apply_patch`     | Apply unified diff patches (GPT models only)                              |
| `question`        | Ask the user a question (build agent only)                                |
| `skill`           | Invoke a registered skill                                                 |
| `todo_write`      | Write to the TODO list                                                    |
| `todo_read`       | Read from the TODO list                                                   |
| `plan_enter`      | Switch to plan mode                                                       |
| `plan_exit`       | Exit plan mode                                                            |

### Semantic Code Search

The semantic code search system automatically indexes your codebase and lets you search by meaning, not just keywords. It lives in `packages/opencode/src/index/`.

**How indexing works, step by step:**

1. **File discovery.** The `Indexer` (`indexer.ts`) scans the project directory, respecting `.gitignore` rules via `FileIgnore`. It finds all source files and documentation files.

2. **AST-aware chunking.** The `chunker` (`chunker.ts`) uses [tree-sitter](https://tree-sitter.github.io/tree-sitter/) to parse source files into abstract syntax trees. It extracts semantically meaningful chunks -- functions, classes, methods, interfaces, type aliases -- rather than splitting on arbitrary line counts. Each chunk includes its symbol name, symbol type, start/end lines, and whether it contains comments.

   Supported languages for AST chunking:

   | Language   | Semantic Nodes Extracted                                               |
   | ---------- | ---------------------------------------------------------------------- |
   | TypeScript | Functions, classes, methods, interfaces, type aliases, arrow functions |
   | JavaScript | Functions, classes, methods, arrow functions, export statements        |
   | Python     | Functions, classes, decorated definitions                              |
   | Go         | Functions, methods, type declarations                                  |
   | Rust       | Functions, impl blocks, structs, enums, traits, modules                |
   | Java       | Methods, classes, interfaces, enums                                    |
   | C          | Functions, structs, enums                                              |
   | C++        | Functions, classes, namespaces, structs                                |
   | C#         | Methods, classes, interfaces, structs                                  |
   | Bash       | Functions, compound statements                                         |

   Documentation files (Markdown, etc.) use a simpler sliding-window chunker.

3. **Embedding.** The `Embedder` (`embedder.ts`) converts each text chunk into a numeric vector. Three embedding tiers are available:

   | Tier   | Model                       | Dimensions | Accuracy (MTEB) | Requirements                     |
   | ------ | --------------------------- | ---------- | --------------- | -------------------------------- |
   | local  | gte-modernbert-base (149M)  | 768        | 64.38           | ~300MB download, 1GB RAM         |
   | voyage | Voyage Code 3 API           | 1024       | 79%             | API key, 200M tokens/month free  |
   | gemini | Google Gemini API           | 768        | 82%             | API key, 1,500 requests/day free |

   The local tier uses `@xenova/transformers` to run the ONNX-quantised gte-modernbert-base model directly in Bun. No external API needed. The model downloads on first use and is cached at `~/.cache/codemad/embeddings/`.

4. **Vector storage.** Embeddings are stored in [LanceDB](https://lancedb.github.io/lancedb/), a columnar vector database. The store supports both vector similarity search and full-text search (BM25). Index files live in `.codemad/index/` for git projects, or in `~/.cache/codemad/embeddings/<hash>` for other directories.

5. **Incremental re-indexing.** A file watcher (`subscribeToFileChanges` in `indexer.ts`) monitors the project directory. When a file changes, only that file is re-chunked and re-embedded. When the embedding tier changes (e.g., switching from `local` to `voyage`), the store detects a dimension mismatch, clears the index, and triggers a full re-index.

6. **Hybrid search.** When you search (via `@codebase` syntax or the `semantic_search` tool), the system runs two searches in parallel:
   - **Vector search** -- finds chunks whose embeddings are closest to the query embedding (cosine similarity)
   - **Full-text search** -- BM25 keyword matching against chunk content

   Results are combined using **Reciprocal Rank Fusion** (RRF) with K=60: 70% weight on semantic results, 30% weight on keyword results. This produces better results than either method alone because semantic search catches synonyms and intent, while keyword search catches exact terms the embedding might miss.

**The search flow in code:**

```
User query --> Embedder.embed(query) --> [vector]
                                            |
                    +-----------------------+------------------------+
                    |                                                |
            store.vectorSearch(vector)                    store.ftsSearch(query)
                    |                                                |
                    +-----------------------+------------------------+
                                            |
                              reciprocalRankFusion(70%/30%)
                                            |
                                    Ranked results
```

### Provider Architecture

CodeMAD supports 20+ LLM providers through a layered loading system. The provider code lives in `packages/opencode/src/provider/provider.ts`.

**How provider loading works:**

Providers are resolved in priority order. Each layer can add credentials or override options from the layer above:

| Priority | Layer            | Source                                | Example                                                      |
| -------- | ---------------- | ------------------------------------- | ------------------------------------------------------------ |
| 1        | Model database   | `models.dev` API fetch at startup     | Base model definitions, costs, limits                        |
| 2        | Environment vars | `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` | Auto-detected from process.env                               |
| 3        | Auth store       | `~/.local/share/codemad/auth.json`    | Keys saved via `codemad auth <provider>`                     |
| 4        | Plugin loaders   | Plugin.list()                         | GitHub Copilot OAuth flow                                    |
| 5        | Custom loaders   | `CUSTOM_LOADERS` map in provider.ts   | Provider-specific init (Bedrock regions, Vertex project IDs) |
| 6        | Config overrides | `codemad.json` provider section       | User model/option overrides                                  |

A provider only appears in the UI if at least one credential source is found. This means if you set `ANTHROPIC_API_KEY` in your environment, Anthropic models appear automatically with no config file needed.

**Bundled provider SDKs:**

| Provider        | SDK Package                  | Auth Method      |
| --------------- | ---------------------------- | ---------------- |
| Anthropic       | `@ai-sdk/anthropic`          | API key or OAuth |
| OpenAI          | `@ai-sdk/openai`             | API key          |
| Google          | `@ai-sdk/google`             | API key          |
| Zhipu (GLM)     | `zhipu-ai-provider`          | API key          |
| Moonshot (Kimi) | `@ai-sdk/openai-compatible`  | API key          |
| MiniMax         | `vercel-minimax-ai-provider` | API key          |

> **Goal:** Move all providers to OAuth so users never handle API keys directly.

**LLM streaming:**

*(To define)*

### Session and Storage

File-based storage: *(maybe, to define)*

### Permission System

Three permission modes control how much autonomy the agent has:

| Mode       | Edits | Terminal | Description                                      |
| ---------- | ----- | -------- | ------------------------------------------------ |
| Guardian   | Ask   | Ask      | Asks for approval on all edits and bash commands  |
| Balanced   | Auto  | Ask      | Auto-approves file edits, asks for terminal       |
| Autopilot  | Auto  | Auto     | Full autonomy, no approval needed                 |

Override the permission mode with a single click in the TUI. No config files needed.

**How permission resolution works:**

*(To define)*

### Git Worktree Isolation

Like agent teams from Anthropic, but each agent runs in a fully isolated filesystem. Everything happens automatically:

1. When a parallel agent is spawned, CodeMAD creates a new git worktree. This gives the agent its own working directory, HEAD, and index while sharing the `.git` object store with the main repo.

2. Each worktree gets a unique branch. The agent can modify, create, and delete files without affecting the main directory or other agents.

3. When the agent finishes, changes merge back automatically. Conflicts are resolved before merging.

### MCP Integration

CodeMAD implements the [Model Context Protocol](https://modelcontextprotocol.io/) client for extensible tool connectivity.

**Supported transports:**

| Transport       | Protocol                        | Use Case                    |
| --------------- | ------------------------------- | --------------------------- |
| stdio           | `StdioClientTransport`          | Local process (most common) |
| SSE             | `SSEClientTransport`            | Remote server (legacy)      |
| Streamable HTTP | `StreamableHTTPClientTransport` | Remote server (current)     |

**How MCP servers are configured:**

MCP servers are declared in `codemad.json`:

```json
{
  "mcp": {
    "my-server": {
      "type": "stdio",
      "command": "node",
      "args": ["my-mcp-server.js"]
    }
  }
}
```

At startup, CodeMAD connects to each configured MCP server, discovers its tools via the `tools/list` protocol method, and registers them as available tools in the agent's tool set. When the LLM invokes an MCP tool, CodeMAD proxies the call to the appropriate server via `tools/call`.

**MCP OAuth support:**

For remote MCP servers that require authentication, CodeMAD implements OAuth with PKCE. Tokens are stored and refreshed automatically.

**Tool change notifications:**

MCP servers can notify CodeMAD that their tool list has changed via `notifications/tools/list_changed`. When this happens, CodeMAD re-fetches the tool list and updates the agent's available tools mid-session.

**Automatic tool discovery:** The LLM detects when to use MCP tools automatically -- no manual invocation needed.

**Lazy loading:** MCP tool definitions are loaded on demand to minimise context window usage. Tools only occupy context when relevant to the current task.

### API Server

*(To define)*

**Server architecture:**

*(To define)*

**Route modules:**

*(To define)*

**Event streaming:**

*(To define)*

**OpenAPI spec:**

*(To define)*

### Configuration Resolution

*(To define)*

<br />

---

## Architecture

*(To define)*

<br />

---

## Configuration

### Provider Setup

**Option A: OAuth login (Anthropic)**

Log in with your Claude Max or Anthropic Console subscription directly from the TUI. Uses PKCE S256 flow -- no API key needed.

```bash
codemad auth anthropic
```

**Option B: API keys**

Set environment variables in `.env` (gitignored) or export them in your shell:

```bash
# Primary providers
export ANTHROPIC_API_KEY=sk-ant-...   # Claude
export OPENAI_API_KEY=sk-...          # GPT
export GOOGLE_API_KEY=...             # Gemini

# Chinese providers (native support)
export MOONSHOT_API_KEY=sk-...        # Kimi 2.5
export ZHIPU_API_KEY=...              # GLM 4.7
export MINIMAX_API_KEY=...            # MiniMax 2.1

# Cloud providers
export AWS_ACCESS_KEY_ID=...          # Amazon Bedrock
export GOOGLE_CLOUD_PROJECT=...       # Google Vertex AI
```

Or set keys interactively:

```bash
codemad auth anthropic    # Store API key or start OAuth
codemad auth openai       # Store OpenAI key
codemad auth moonshot     # Store Moonshot key
```

### Project Configuration

Create `codemad.json` (or `codemad.jsonc` for comments) in your project root:

```jsonc
{
  "$schema": "https://codemad.dev/config.json",
  // Default provider and model
  "provider": "anthropic",
  "model": "anthropic/claude-sonnet-4-5",
  // Small model for summaries and titles
  "small_model": "anthropic/claude-haiku-4-5",
  // Permission rules
  "permission": {
    "bash": "ask",
    "write": { "*.ts": "allow", "*": "deny" },
  },
  // Semantic search tier: "local" | "voyage" | "gemini"
  "index": {
    "enabled": true,
    "tier": "local",
  },
  // MCP servers
  "mcp": {
    "my-server": {
      "type": "stdio",
      "command": "node",
      "args": ["my-mcp-server.js"],
    },
  },
  // Custom agent definitions
  "agent": {
    "reviewer": {
      "description": "Code review agent",
      "mode": "primary",
      "permission": { "write": "deny", "edit": "deny" },
      "prompt": "You are a code reviewer. Only suggest changes, never make them.",
    },
  },
  // Disable specific providers
  "disabled_providers": ["openrouter"],
  // Or only enable specific providers
  "enabled_providers": ["anthropic", "openai"],
}
```

### Environment Variables

| Variable                                 | Required    | Default | Purpose                              |
| ---------------------------------------- | ----------- | ------- | ------------------------------------ |
| `ANTHROPIC_API_KEY`                      | Conditional | --      | Claude models (default provider)     |
| `OPENAI_API_KEY`                         | Conditional | --      | GPT models                           |
| `GOOGLE_API_KEY`                         | Conditional | --      | Gemini models                        |
| `MOONSHOT_API_KEY`                       | Conditional | --      | Kimi 2.5 (Moonshot)                  |
| `ZHIPU_API_KEY`                          | Conditional | --      | GLM 4.7 (Zhipu)                      |
| `MINIMAX_API_KEY`                        | Conditional | --      | MiniMax 2.1                          |
| `OPENCODE_DISABLE_MODELS_FETCH`          | No          | `false` | Skip models.dev API fetch at startup |
| `OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX` | No          | `32000` | Override max output tokens           |
| `OPENCODE_SERVER_PASSWORD`               | No          | --      | Enable basic auth on API server      |
| `PORT`                                   | No          | `4096`  | API server port                      |

At least one provider API key is required. Set in `.env` (gitignored) or as environment variables.

<br />

---

## Development

### Commands

| Command                                        | Purpose                              |
| ---------------------------------------------- | ------------------------------------ |
| `bun install`                                  | Install all dependencies             |
| `bun dev`                                      | Run TUI                              |
| `bun dev <dir>`                                | Run TUI against a specific directory |
| `bun dev serve`                                | Start API server (port 4096)         |
| `bun check`                                    | Full quality gate (typecheck + lint) |
| `bun turbo typecheck`                          | Type checking only                   |
| `bun lint`                                     | ESLint check                         |
| `bun lint:fix`                                 | ESLint auto-fix                      |
| `bun format`                                   | Prettier check                       |
| `bun format:fix`                               | Prettier auto-fix                    |
| `bun test --cwd packages/opencode`             | Run all tests                        |
| `bun test --cwd packages/opencode <file>`      | Run a single test file               |
| `bun test --cwd packages/opencode --watch`     | Watch mode for tests                 |
| `bun run --inspect=ws://localhost:6499/ dev`   | Debug TUI with DevTools inspector    |
| `bun run --cwd packages/app dev`               | Web IDE dev server                   |
| `bun run --cwd packages/desktop tauri dev`     | Desktop app (requires Rust)          |
| `./packages/sdk/js/script/build.ts`            | Regenerate SDK after API changes     |
| `./packages/opencode/script/build.ts --single` | Build standalone executable          |

### Quality Gate

Pre-commit hooks run lint-staged (ESLint + Prettier on staged files). Pre-push hooks run `bun check` (full typecheck + lint across all packages).

**All contributions must pass `bun check` with zero errors.**

| Failure           | Recovery                                                  |
| ----------------- | --------------------------------------------------------- |
| Format fails      | Run `bun format:fix`, commit the fixed files              |
| Lint fails        | Run `bun lint:fix`, re-run until clean                    |
| Typecheck fails   | Fix type errors. Do not use `any` to escape.              |
| Test fails        | Debug and fix. Verify the fix does not break other tests. |
| Multiple failures | Fix in order: format, then lint, then types, then tests   |

### TypeScript Configuration

| Flag                         | Effect                                            |
| ---------------------------- | ------------------------------------------------- | ---------- |
| `strict: true`               | Enables all strict checks                         |
| `noUncheckedIndexedAccess`   | Array/object access returns `T                    | undefined` |
| `noImplicitOverride`         | Requires `override` keyword on overridden methods |
| `exactOptionalPropertyTypes` | Distinguishes `undefined` from missing property   |

### Debugging

| Scenario         | Approach                                                                              |
| ---------------- | ------------------------------------------------------------------------------------- |
| TUI breakpoints  | `bun run --inspect=ws://localhost:6499/ dev` then open Chrome DevTools                |
| Server debugging | `bun run --inspect=ws://localhost:6499/ --cwd packages/opencode ./src/index.ts serve` |
| Dual debugging   | Use ports 6499 and 6500 for server and TUI separately                                 |
| Performance      | `console.time`/`console.timeEnd` or the built-in `log.time()` utility                 |
| Logs             | Check `~/.local/state/opencode/` for persistent logs                                  |

<br />

---

## Roadmap

### MVP Core

| Feature              | Status  | Description                                                          |
| -------------------- | ------- | -------------------------------------------------------------------- |
| Context Intelligence | Done    | LanceDB vector search, tree-sitter AST, @-syntax agent resolution   |
| Parallel Execution   | Next    | Automatic git worktree multi-agent orchestration                     |
| Code Review          | Planned | Per-hunk approval workflow                                           |

### Framework

Inspired by the [Bmad method](https://github.com/bmadcode/BMAD-METHOD), simplified to one agent per phase with subagents for each concern:

| Phase          | Agent              | Subagents                         |
| -------------- | ------------------ | --------------------------------- |
| Discovery      | Discovery Agent    | Research, stakeholder analysis    |
| Analysis       | Analysis Agent     | Requirements, constraints         |
| Planning       | Planning Agent     | Architecture, task breakdown      |
| Solutioning    | Solutioning Agent  | Design, trade-off evaluation      |
| Implementation | Implementation Agent | Code generation, testing         |

Also exploring [Traycer](https://traycer.ai/) for reference on automated code review and testing workflows.

<br />

---

## Security

*(TBD)*

Three-layer security model:

- **OS Sandbox** -- Bash commands run in isolation
- **Filesystem Restrictions** -- Operations limited to project directory
- **Dynamic Command Allowlist** -- Only approved commands based on detected project stack

All releases are:

- Scanned with VirusTotal before publishing
- Include SHA256 checksums for verification
- Code-signed where applicable (macOS)

<br />

---

## Troubleshooting

| Symptom                       | Cause                          | Fix                                                                |
| ----------------------------- | ------------------------------ | ------------------------------------------------------------------ |
| Port 4096 in use              | Another server running         | `lsof -i :4096` then kill, or `PORT=4097 bun dev serve`            |
| `ANTHROPIC_API_KEY not found` | Missing .env                   | Create `.env` with your API key                                    |
| TypeScript errors after pull  | Stale Turborepo cache          | `bun turbo --force`                                                |
| Types outdated after edit     | Bun file watcher missed change | Restart `bun dev`                                                  |
| Desktop app won't build       | Missing Rust toolchain         | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh`  |
| Desktop window blank          | Frontend not built             | `bun run --cwd packages/app build` first                           |
| Data corruption               | Corrupted local storage        | Delete `~/.local/share/codemad/storage/migration` to retry         |
| Provider not appearing        | No credentials found           | Set env var or run `codemad auth <provider>`                       |
| SDK type errors at runtime    | SDK out of sync with server    | Run `./packages/sdk/js/script/build.ts` to regenerate              |
| Models not loading            | Models.dev fetch disabled      | Unset `OPENCODE_DISABLE_MODELS_FETCH` or provide models via config |
| Index not working             | Embedder failed to load        | Check logs. Ensure 1.5GB RAM available for local tier.             |

<br />

---

## FAQ

<details>
<summary><strong>How is privacy actually handled?</strong></summary>

**Zero proxy servers.** API calls go directly from your machine to your chosen provider. Sessions are stored locally as JSON files with file locking in `~/.local/share/codemad/storage/`. No telemetry. No data harvesting. Auth tokens are stored with `0o600` permissions (owner-only). For complete privacy, use Ollama or LMStudio for fully offline operation -- zero API calls leave your machine.

</details>

<details>
<summary><strong>Why Tauri instead of Electron?</strong></summary>

Tauri produces ~10x smaller binaries (50MB vs 500MB), uses native webviews instead of bundled Chromium, and has significantly lower memory footprint. The tradeoff is requiring Rust for desktop development. The Web IDE provides the same experience in a browser without Rust. Tauri 2.x also provides a capability-based permission system that restricts what the app can access on the host OS.

</details>

<details>
<summary><strong>What does it cost?</strong></summary>

**CodeMAD is free and open source (MIT license).** You pay only for LLM API usage based on your provider's pricing. You can log in with your existing Claude Max or Anthropic Console subscription via OAuth. Running local models via Ollama has zero API cost. The semantic search indexer runs a local embedding model by default (gte-modernbert-base), so indexing is also free.

</details>

<details>
<summary><strong>How does semantic code search work?</strong></summary>

On startup, CodeMAD indexes your codebase by: (1) scanning files respecting `.gitignore`, (2) parsing source files into AST-aware chunks using tree-sitter (extracting functions, classes, methods rather than arbitrary line splits), (3) converting each chunk into a 768-dimensional vector using the gte-modernbert-base local model, and (4) storing vectors in LanceDB. When you search, the query is embedded into the same vector space. Two parallel searches run -- vector similarity and BM25 keyword matching -- and results are fused using Reciprocal Rank Fusion (70% semantic, 30% keyword, K=60). File changes trigger incremental re-indexing via a file watcher.

</details>

<details>
<summary><strong>What makes the CodeMAD Protocol different from just prompting?</strong></summary>

The CodeMAD Protocol is a methodology, not a prompt. It structures AI work into four phases: **Discuss** (align on intent and constraints), **Plan** (break work into structured tasks with dependencies), **Execute** (parallel agents in isolated git worktrees build each task), **Verify** (confirm the original goal was achieved, not just that tasks completed). Verification checks the **goal** -- "build auth" isn't done when code exists, it's done when users can actually log in.

</details>

<details>
<summary><strong>How do parallel agents work?</strong></summary>

Each parallel agent runs in an isolated git worktree -- a separate working directory with its own branch that shares the git object store with the main repo. This provides true filesystem isolation: agents can modify, create, and delete files without conflicts. Each agent gets a fresh context window (up to 200k tokens depending on the model). When an agent finishes, its changes merge back. The `task` tool spawns sub-agents, and the `batch` tool runs multiple independent tool calls in parallel within a single agent.

</details>

<details>
<summary><strong>What languages does the code indexer support?</strong></summary>

Tree-sitter AST-aware chunking supports TypeScript, JavaScript, Python, Go, Rust, Java, C, C++, C#, and Bash. Files in other languages are chunked using a simpler sliding-window approach. Documentation files (Markdown, etc.) are indexed with a docs-specific chunker. The embedding model (gte-modernbert-base) produces language-agnostic vectors, so semantic search works across all file types.

</details>

<details>
<summary><strong>Can I use multiple providers in the same session?</strong></summary>

Yes. You can switch models mid-conversation without losing context. You can also configure different agents to use different providers -- for example, use Claude for the main `build` agent and a cheaper model for the `explore` sub-agent. Set this in `codemad.json` under the agent's `model` field.

</details>

<details>
<summary><strong>How do I add a custom tool?</strong></summary>

Create a `.ts` or `.js` file in a `tool/` or `tools/` directory within any config directory (project root, `~/.config/codemad/`, or `.codemad/`). Export a `ToolDefinition` object with `description`, `args` (Zod schema), and `execute` function. The tool is discovered automatically at startup. Alternatively, use the plugin system or connect an MCP server.

</details>

<br />

---

## Contributing

We welcome contributions at every experience level.

### Quick Path

1. **Find an issue** -- Check [issues](https://github.com/costa-marcello/codemad/issues) or the [roadmap](#roadmap) for contribution opportunities
2. **Fork and branch** -- `git checkout -b feat/your-feature`
3. **Code** -- Follow [code style](.claude/rules/code-style.md). Match existing patterns in the codebase.
4. **Verify** -- `bun check` must pass with 0 errors
5. **PR** -- Use conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`)

### Quality Standards

- TypeScript strict mode with `noUncheckedIndexedAccess: true`
- 70% test coverage baseline (100% for auth, payments, and data mutations)
- No `any` type -- use `unknown` with narrowing
- Pre-commit hooks enforce lint + format on staged files

### Commit Conventions

| Prefix      | Use When                              | Example                                |
| ----------- | ------------------------------------- | -------------------------------------- |
| `feat:`     | New user-facing functionality         | `feat(app): add dark mode toggle`      |
| `fix:`      | Bug fixes                             | `fix(opencode): handle empty response` |
| `docs:`     | Documentation only                    | `docs: update API examples`            |
| `chore:`    | Maintenance, deps, config             | `chore: bump typescript to 5.4`        |
| `refactor:` | Code changes without behaviour change | `refactor(util): simplify retry logic` |
| `test:`     | Adding or fixing tests                | `test(sdk): add timeout edge cases`    |

### High-Impact Areas

- Multi-agent orchestration
- Cross-session memory
- Vector search optimisation
- Per-hunk review UX

<br />

---

<p align="center">
  <strong>Stop generating code. Start shipping products.</strong>
</p>

<p align="center">
  <a href="https://github.com/costa-marcello/codemad/stargazers">Star on GitHub</a> .
  <a href="https://github.com/costa-marcello/codemad/issues">Report Bug</a> .
  <a href="https://github.com/costa-marcello/codemad/issues">Request Feature</a>
</p>

<p align="center">
  <sub>MIT License . Built for developers who got tired of AI chaos</sub>
</p>
