# Executive Summary

CodeMAD is a desktop-first AI coding platform built on the CodeMAD Protocol (4-phase methodology) with a four-tier agent hierarchy, git worktree isolation, and semantic code search. This research evaluated 12 technical decisions across 6 workflow steps, using web-verified data from 500+ sources.

**Architecture Decision:** Option A -- Rust thin shell (process supervision, keychain, sandbox) + Bun sidecar (all application logic) + WebView (Svelte 5 UI). This mirrors the pattern Anthropic uses for Claude Code, where Bun runs as a Tauri sidecar in production.

**Key Findings:**

- **Bun is Anthropic-backed** (acquired December 2025). Claude Code ships Bun as a Tauri sidecar, validating the exact architecture CodeMAD needs.
- **Svelte 5 runes** provide the best SSE streaming developer experience for real-time LLM token rendering, with 30-40% less code than React.
- **Vercel AI SDK v6** covers all 5 MVP providers (Anthropic, OpenAI, Google, Zhipu GLM, Moonshot Kimi) plus native MCP support. 20M+ monthly downloads.
- **LanceDB serves dual duty** -- semantic code search AND cross-session memory in a single embedded database. This IS the "Context Intelligence" concept from the brainstorming session.
- **Smart model routing** (Haiku 40% + Sonnet 40% + Opus 20%) drops monthly LLM costs from $120-240 to $30-60. Adding prompt caching brings this to $10-25.
- **Blackboard MCP server** for within-session agent coordination shows 13-57% improvement over master-slave patterns. Agents post decisions to shared state rather than messaging directly.
- **Anthropic OAuth PKCE is blocked** (January 2026) for third-party tools. The "log in with Claude Max" feature from the project spec is not viable.

**Locked Decisions (12):**

| Decision | Choice | Confidence |
|----------|--------|-----------|
| Architecture | Rust thin + Bun sidecar + WebView | 95% |
| Runtime | Bun (Node.js fallback) | 85% |
| UI Framework | Svelte 5 | 85% |
| API Framework | Hono + tRPC | 92% |
| LLM SDK | Vercel AI SDK v6 | 95% |
| Vector DB | LanceDB | 95% |
| Monorepo | pnpm + Turborepo | 92% |
| Linting | Biome | 90% |
| Testing | Vitest + cargo test | 90% |
| Cross-session memory | LanceDB custom (Mem0 in Phase 2) | 88% |
| Within-session memory | Blackboard MCP server | 85% |
| Agent communication | Task list + blackboard (Claude Code teams pattern) | 90% |

**Critical Risks:**
- Bun native dependency compatibility (34% failure rate in ecosystem) -- test LanceDB + tree-sitter early
- Solo founder maintaining Rust + TypeScript -- keep Rust surface minimal
- "Everyone" target audience -- user_skill_level adaptation must do real work

**Estimated path to v1.0:** 8-12 months for a solo developer with AI tooling (Claude Code + Cursor).

---
