# Technology Stack

**Project:** CodeMAD - Cross-Platform AI Development Platform
**Researched:** 2026-01-30
**Overall Confidence:** HIGH

---

## Executive Summary

For a cross-platform desktop AI development platform targeting "technical vibe coders," the recommended 2026 stack is:

- **Desktop Framework:** Tauri 2.x + React/TypeScript (performance, security, smaller bundles)
- **LLM Integration:** Vercel AI SDK 6.x as unified interface + native SDKs for provider-specific features
- **Vector Database:** LanceDB (embedded, TypeScript-native, zero infrastructure)
- **Code Intelligence:** Tree-sitter + LSP (hybrid approach for parsing + semantic understanding)
- **Git Operations:** simple-git + custom worktree orchestration layer

This stack prioritizes developer experience, performance, and the "local-first" privacy model while supporting both cloud providers and local LLMs.

---

## Recommended Stack

### Desktop Framework

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **Tauri** | 2.9.x | Cross-platform desktop shell | HIGH |
| **React** | 19.x | Frontend UI framework | HIGH |
| **TypeScript** | 5.7.x | Type-safe development | HIGH |
| **Vite** | 6.x | Build tooling | HIGH |
| **TauRPC** | 0.5.x | Type-safe Rust-TS IPC | MEDIUM |

**Why Tauri over Electron:**
- Bundle size: 3-10MB vs 80-150MB (10x smaller)
- Memory usage: 30-50MB vs 150-300MB (5x less)
- Startup time: ~0.4s vs ~1.5s (4x faster)
- Security: Capability-based permissions, sandboxed WebView, minimal attack surface
- Mobile: Tauri 2.x extends to iOS/Android from same codebase (future-proofing)

**Why NOT Electron:**
- Bundles full Chromium per app (massive overhead)
- Higher memory footprint unacceptable for always-running dev tool
- Security model requires discipline to lock down (Tauri is secure by default)

**Why NOT Go + Bubble Tea TUI:**
- CodeMAD requires rich UI (per-hunk code review, visual workflows)
- TUI limits visual capabilities for complex features
- Web technologies have better ecosystem for UI components
- Tauri's Rust backend provides similar performance benefits

**Why React over Solid/Svelte:**
- Most mature TypeScript support
- Largest ecosystem for code editor components (Monaco, CodeMirror)
- Team hiring/familiarity
- Performance difference negligible for this use case

Sources:
- [Tauri vs Electron Comparison](https://www.gethopp.app/blog/tauri-vs-electron)
- [Tauri 2.0 Documentation](https://v2.tauri.app/)
- [TauRPC Crate](https://docs.rs/crate/taurpc/latest)

---

### LLM Provider Integration

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **Vercel AI SDK** | 6.0.x | Unified multi-provider interface | HIGH |
| **@anthropic-ai/sdk** | 0.72.x | Claude-specific features (MCP, Agent SDK) | HIGH |
| **openai** | 6.17.x | GPT + OpenAI-compatible endpoints | HIGH |
| **@google/genai** | 1.38.x | Gemini native features | HIGH |
| **zhipu-ai-provider** | latest | GLM 4.7 via Vercel AI SDK | MEDIUM |
| **Ollama API** | REST | Local model serving | HIGH |

**Architecture Pattern: Unified + Native Hybrid**

```typescript
// Layer 1: Unified interface for common operations
import { generateText, streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

// Layer 2: Native SDKs for provider-specific features
import Anthropic from '@anthropic-ai/sdk';  // For MCP, extended thinking
import OpenAI from 'openai';                 // For Assistants API fallback
```

**Why Vercel AI SDK as primary:**
- Unified API across 100+ providers with single interface
- Built-in streaming, tool calling, structured outputs
- Provider switching with one line change
- Active development (v6.0 released late 2025)
- SSE-based streaming works well with Tauri

**Why NOT LiteLLM as primary:**
- Python-focused (proxy server model)
- Adds infrastructure complexity
- Vercel AI SDK provides same benefits in TypeScript-native way

**Provider-Specific Considerations:**

| Provider | Auth Model | Notes |
|----------|------------|-------|
| Claude | OAuth + API Key | MCP support via native SDK |
| GPT | API Key | OpenAI-compatible for many providers |
| Gemini | OAuth + API Key | Use native SDK for advanced features |
| GLM 4.7 | API Key | OpenAI-compatible, zhipu-ai-provider for AI SDK |
| Kimi 2.5 | API Key | OpenAI-compatible endpoints |
| Minimax 2.1 | API Key | OpenAI-compatible endpoints |
| Ollama | None (local) | REST API, OpenAI-compatible mode |
| LMStudio | None (local) | OpenAI-compatible API |

**Chinese Provider Integration Pattern:**
```typescript
// Most Chinese providers support OpenAI-compatible API
const kimi = createOpenAI({
  baseURL: 'https://api.moonshot.cn/v1',
  apiKey: process.env.KIMI_API_KEY,
});

const minimax = createOpenAI({
  baseURL: 'https://api.minimax.chat/v1',
  apiKey: process.env.MINIMAX_API_KEY,
});
```

Sources:
- [Vercel AI SDK 6.0](https://ai-sdk.dev/)
- [Multi-Provider LLM Integration](https://medium.com/@richardhightower/multi-provider-chat-app-litellm-streamlit-ollama-gemini-claude-perplexity-and-modern-llm-afd5218c7eab)
- [Zhipu AI Provider for Vercel AI SDK](https://github.com/Xiang-CH/zhipu-ai-provider)

---

### Vector Database (Code Context)

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **LanceDB** | 0.23.x | Embedded vector database | HIGH |

**Why LanceDB:**
- **Only embedded TypeScript vector database** - no server required
- Used by Continue (VS Code/JetBrains AI extension) for same use case
- Used by AnythingLLM for local RAG
- Sub-millisecond lookup times on local disk
- SQL-like filtering for metadata queries
- Multimodal support (text, code, future: images)
- Zero infrastructure - runs in-process with Tauri

**Why NOT Qdrant:**
- Requires separate server process (client-server architecture)
- Overkill for local-first desktop app
- Better for billion-scale datasets, not local codebase

**Why NOT Chroma:**
- Less mature TypeScript support
- Embedded mode less battle-tested than LanceDB
- LanceDB has better performance benchmarks

**Performance (from benchmarks):**
| Database | Query Time | Recall@1 | Memory |
|----------|-----------|----------|--------|
| LanceDB (IVF_PQ) | 40-60ms | ~88% | Low |
| Qdrant (HNSW) | 20-30ms | ~95% | Medium-High |

For local codebase search (thousands, not billions of vectors), LanceDB's performance is more than sufficient, and the embedded architecture eliminates deployment complexity.

**Embedding Model Recommendation:**
- **Code:** `voyage-code-3` or `text-embedding-3-large` (OpenAI)
- **Local option:** `nomic-embed-text` via Ollama

Sources:
- [LanceDB for Continue.dev](https://lancedb.com/blog/the-future-of-ai-native-development-is-local-inside-continues-lancedb-powered-evolution/)
- [LanceDB vs Qdrant Comparison](https://medium.com/@vinayak702010/lancedb-vs-qdrant-for-conversational-ai-vector-search-in-knowledge-bases-793ac51e0b81)
- [Vector Database Comparison](https://www.myscale.com/blog/milvus-alternatives-chroma-qdrant-lancedb/)

---

### Git Worktree Management

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **simple-git** | 3.30.x | Git operations in Node.js | HIGH |
| **Custom orchestration** | - | Worktree lifecycle management | HIGH |

**Why simple-git:**
- Mature, TypeScript-native library
- Supports worktree operations (add, list, prune)
- AbortController support for cancellation
- Progress events for long operations
- 3.x has ESM, CommonJS, and TypeScript definitions

**Worktree Architecture Pattern:**
```
project/
├── .git/                    # Shared git directory
├── main/                    # Main worktree
├── .worktrees/              # Agent worktrees (gitignored)
│   ├── agent-1-feature-a/
│   ├── agent-2-feature-b/
│   └── agent-3-bugfix/
```

**Best Practices (from research):**
1. Structured directories under `.worktrees/`
2. Treat worktrees as temporary (create for task, remove when done)
3. Rebase often to prevent merge conflicts
4. Clean up unused worktrees automatically
5. Never checkout same branch in two worktrees (Git prevents this)

**Parallel Agent Workflow:**
```typescript
// Create isolated worktree for agent
await git.worktree.add({
  path: `.worktrees/agent-${id}`,
  branch: `agent/${id}/${taskName}`,
});

// Agent works in isolation
// On completion: merge or PR
await git.merge(['--no-ff', `agent/${id}/${taskName}`]);

// Cleanup
await git.worktree.prune();
```

Sources:
- [Git Worktrees for Parallel AI Development](https://stevekinney.com/courses/ai-development/git-worktrees)
- [Claude Code + Git Worktrees](https://medium.com/@dtunai/mastering-git-worktrees-with-claude-code-for-parallel-development-workflow-41dc91e645fe)
- [simple-git npm](https://www.npmjs.com/package/simple-git)

---

### LSP Integration (Code Intelligence)

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **typescript-language-server** | 5.1.x | TypeScript/JavaScript LSP | HIGH |
| **tree-sitter** | 0.25.x | Fast incremental parsing | HIGH |
| **tree-sitter-typescript** | latest | TypeScript grammar | HIGH |
| **vscode-languageserver** | 9.x | LSP protocol implementation | MEDIUM |

**Why Hybrid Tree-sitter + LSP:**
- **Tree-sitter:** Fast incremental parsing (sub-ms), syntax highlighting, code folding
- **LSP:** Semantic features (go-to-definition, find references, hover, diagnostics)

**LSP Capabilities to Implement:**
| Capability | Purpose | Priority |
|------------|---------|----------|
| `goToDefinition` | Navigate to symbol definition | HIGH |
| `findReferences` | Find all usages | HIGH |
| `hover` | Type information on hover | HIGH |
| `documentSymbol` | File outline/structure | HIGH |
| `getDiagnostics` | Real-time error detection | MEDIUM |

**Performance (from Claude Code LSP research):**
- With LSP: 50ms to navigate codebase
- Without LSP: 45 seconds via text search
- 900x improvement for code intelligence operations

**Multi-Language Support:**
| Language | LSP Server | Notes |
|----------|------------|-------|
| TypeScript/JS | typescript-language-server | Most mature |
| Python | pylsp or pyright | Pyright faster |
| Go | gopls | Official Google server |
| Rust | rust-analyzer | Excellent |
| Java | jdtls | Eclipse-based |

**Integration Pattern:**
```typescript
// Lazy-load LSP servers per language
const lspManager = new LSPManager({
  typescript: 'typescript-language-server',
  python: 'pylsp',
  go: 'gopls',
});

// Connect when file type detected
await lspManager.ensureServer(document.languageId);
```

Sources:
- [Claude Code LSP Setup](https://www.aifreeapi.com/en/posts/claude-code-lsp)
- [typescript-language-server](https://github.com/typescript-language-server/typescript-language-server)
- [Tree-sitter Node.js](https://tree-sitter.github.io/node-tree-sitter/)

---

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **Zustand** | 5.x | State management | Global app state |
| **TanStack Query** | 5.x | Async state/caching | LLM responses, API calls |
| **Monaco Editor** | latest | Code editing | Per-hunk review, code display |
| **Zod** | 3.x | Runtime validation | API responses, config |
| **date-fns** | 4.x | Date utilities | Timestamps, durations |
| **nanoid** | 5.x | ID generation | Unique identifiers |
| **pino** | 9.x | Logging | Structured logs |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| Desktop | Tauri | Electron | 5x memory, 10x bundle size |
| Desktop | Tauri | Go+Bubble Tea | Limited UI for complex features |
| Frontend | React | SolidJS | Smaller ecosystem, hiring |
| Frontend | React | Svelte | Less mature TS support |
| LLM Gateway | Vercel AI SDK | LiteLLM | Python-focused, needs proxy |
| Vector DB | LanceDB | Qdrant | Requires server process |
| Vector DB | LanceDB | Chroma | Less mature TS support |
| Git | simple-git | isomorphic-git | simple-git has better worktree support |
| IPC | TauRPC | rspc | rspc no longer maintained |

---

## What NOT to Use

| Technology | Why Avoid |
|------------|-----------|
| **Electron** | Excessive memory/bundle for always-running dev tool |
| **rspc** | No longer maintained; use TauRPC or tauri-specta |
| **SQLite for vectors** | Not optimized for similarity search |
| **Langchain.js** | Over-abstraction, version churn, hard to debug |
| **Pinecone/Weaviate** | Cloud-only, violates local-first privacy model |
| **OpenAI Assistants API** | Deprecated August 2026, use Vercel AI SDK patterns |

---

## Installation

### Prerequisites
```bash
# Rust (required for Tauri)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Node.js 20+ LTS
# Install via fnm, nvm, or asdf
```

### Core Dependencies
```bash
# Initialize Tauri project
npm create tauri-app@latest codemad -- --template react-ts

cd codemad

# Core dependencies
npm install @lancedb/lancedb ai @ai-sdk/anthropic @ai-sdk/openai @ai-sdk/google
npm install simple-git tree-sitter tree-sitter-typescript
npm install zustand @tanstack/react-query zod pino nanoid

# Dev dependencies
npm install -D @tauri-apps/cli typescript @types/node
npm install -D vitest @testing-library/react
```

### Rust Dependencies (Cargo.toml)
```toml
[dependencies]
tauri = { version = "2", features = ["shell-open"] }
taurpc = "0.5"
specta = { version = "=2.0.0-rc.22", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

---

## Confidence Assessment

| Area | Confidence | Reasoning |
|------|------------|-----------|
| **Tauri 2.x** | HIGH | Stable 2.0 released late 2024, verified 2.9.x current |
| **Vercel AI SDK** | HIGH | v6 GA, actively maintained, verified version |
| **LanceDB** | HIGH | Used by Continue.dev, AnythingLLM, verified TS SDK |
| **simple-git** | HIGH | Mature library, verified worktree support |
| **Tree-sitter** | HIGH | Industry standard, verified 0.25.x current |
| **Chinese Providers** | MEDIUM | OpenAI-compatible, but SDK ecosystem less mature |
| **TauRPC** | MEDIUM | Active but smaller community than tauri-specta |

---

## Gaps & Future Research

1. **Chinese provider OAuth flows** - Need to verify Kimi, GLM OAuth implementation details
2. **LSP server bundling** - Strategy for bundling language servers with Tauri app
3. **Embedding model comparison** - Benchmark voyage-code-3 vs text-embedding-3-large for code
4. **Local model quantization** - Optimal quantization levels for Ollama models in this use case

---

## Sources

### Framework Comparisons
- [Tauri vs Electron Deep Comparison](https://www.gethopp.app/blog/tauri-vs-electron)
- [Tauri 2.0 Official Documentation](https://v2.tauri.app/)
- [Go vs Rust TUI Development](https://dev.to/dev-tngsh/go-vs-rust-for-tui-development-a-deep-dive-into-bubbletea-and-ratatui-2b7)

### LLM Integration
- [Vercel AI SDK Documentation](https://ai-sdk.dev/)
- [Multi-Provider Chat App with LiteLLM](https://medium.com/@richardhightower/multi-provider-chat-app-litellm-streamlit-ollama-gemini-claude-perplexity-and-modern-llm-afd5218c7eab)
- [Anthropic TypeScript SDK](https://github.com/anthropics/anthropic-sdk-typescript)

### Vector Databases
- [LanceDB + Continue.dev Integration](https://lancedb.com/blog/the-future-of-ai-native-development-is-local-inside-continues-lancedb-powered-evolution/)
- [Vector Database Comparison Guide](https://www.myscale.com/blog/milvus-alternatives-chroma-qdrant-lancedb/)

### Git Worktrees
- [Git Worktrees for AI Development](https://stevekinney.com/courses/ai-development/git-worktrees)
- [Parallel AI Development Guide](https://sgryt.com/posts/git-worktree-parallel-ai-development/)

### LSP Integration
- [Claude Code LSP Setup](https://www.aifreeapi.com/en/posts/claude-code-lsp)
- [typescript-language-server](https://github.com/typescript-language-server/typescript-language-server)
