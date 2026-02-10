# Architecture

<!-- v1.9 | 2026-02-08 | paths: ["packages/**/*"] -->

## Design Decisions

| Decision     | Choice                     | Alternative            | Why Choice                                                    |
| ------------ | -------------------------- | ---------------------- | ------------------------------------------------------------- |
| Monorepo     | Bun workspaces + Turborepo | Nx, Lerna, pnpm        | Bun-native, fast caching, minimal config                      |
| UI framework | SolidJS                    | React, Vue, Svelte     | Fine-grained reactivity, no virtual DOM overhead              |
| Desktop      | Tauri (Rust)               | Electron               | ~10x smaller binaries, lower memory, native performance       |
| LLM SDK      | Vercel AI SDK              | LangChain, direct SDKs | Unified streaming API, provider abstraction, TypeScript-first |

## Package Structure

| Package    | Purpose                 | Key Dependencies                 |
| ---------- | ----------------------- | -------------------------------- |
| `opencode` | Core CLI, agent, server | `ai`, `hono`, `@lancedb/lancedb` |
| `app`      | Web UI                  | `solid-js`, `@solidjs/router`    |
| `desktop`  | Native wrapper          | `@tauri-apps/api`                |
| `ui`       | Shared components       | `solid-js`, `tailwindcss`        |
| `util`     | Shared utilities        | None (zero dependencies)         |
| `plugin`   | Plugin SDK              | Minimal (types only)             |
| `sdk`      | Generated API client    | Auto-generated from server       |
| `script`   | Build/release utilities | None                             |

## Key Entry Points

| File                                         | Purpose          | When to Modify             |
| -------------------------------------------- | ---------------- | -------------------------- |
| `packages/opencode/src/index.ts`             | CLI entry        | Adding commands            |
| `packages/opencode/src/server/server.ts`     | API server       | Adding endpoints           |
| `packages/opencode/src/provider/provider.ts` | LLM providers    | Adding providers           |
| `packages/desktop/src-tauri/`                | Rust native code | Platform-specific features |

## Provider Architecture

| Provider Type | Implementation              | Example                   | Why                                                            |
| ------------- | --------------------------- | ------------------------- | -------------------------------------------------------------- |
| Standard      | Direct SDK                  | Anthropic, OpenAI, Google | Native SDKs provide full feature access                        |
| Chinese       | `@ai-sdk/openai-compatible` | Kimi, GLM, Minimax        | Similar endpoints; adapter handles minor differences per-model |

## State Management

SolidJS primitives only--no external state libraries. See `packages/app/CLAUDE.md` for signal vs store patterns, context, and persistence.

### Store Updates

| Pattern     | When                     | Example                                       | Why                                                       |
| ----------- | ------------------------ | --------------------------------------------- | --------------------------------------------------------- |
| Path syntax | Direct property update   | `setStore('user', 'name', 'Alice')`           | Most readable for simple, known-path updates              |
| `produce`   | Complex mutations        | `setStore(produce(s => { s.items.push(x) }))` | Imperative style for multi-step or conditional mutations  |
| `reconcile` | Replace with server data | `setStore(reconcile(serverResponse))`         | Diffs incoming data against store, minimizing re-renders  |
| `batch`     | Multiple updates as one  | `batch(() => { setA(...); setB(...) })`       | Coalesces into single render pass, avoids intermediate UI |

## Import Rules

| From → To           | Allowed | Why                                 |
| ------------------- | ------- | ----------------------------------- |
| `app` → `ui`        | ✅      | UI components are shared            |
| `app` → `opencode`  | ❌      | App uses SDK, not direct imports    |
| `app` → `sdk`       | ✅      | API client for server communication |
| `desktop` → `app`   | ✅      | Desktop wraps web app               |
| `ui` → `util`       | ✅      | Utilities are universal             |
| `opencode` → `util` | ✅      | Utilities are universal             |
| `sdk` → anything    | ❌      | SDK is auto-generated, no deps      |

**Rule:** Dependencies flow down the stack: `desktop/app` → `ui` → `util`. Never import up.

## Build Order

Turborepo handles this via `dependsOn` in `turbo.json`:

| Package    | Depends On  | Why                            |
| ---------- | ----------- | ------------------------------ |
| `util`     | —           | No dependencies, builds first  |
| `ui`       | `util`      | Uses shared utilities          |
| `opencode` | `util`      | Uses shared utilities          |
| `sdk`      | `opencode`  | Generated from server types    |
| `app`      | `ui`, `sdk` | Uses components and API client |
| `desktop`  | `app`       | Wraps web app                  |

**Cache invalidation:** Turborepo caches by input hash. If builds seem stale, run `bun turbo --force`.

## Turborepo Cache Keys

| Input Type   | Invalidates Cache | Example                       |
| ------------ | ----------------- | ----------------------------- |
| Source files | Yes               | `*.ts`, `*.tsx`, `*.json`     |
| Test files   | No                | `*.test.ts`, `*.spec.ts`      |
| Dependencies | Yes               | `package.json` changes        |
| Config files | Yes               | `tsconfig.json`, `turbo.json` |

**Force rebuild:** `bun turbo --force` when cache stale despite source changes.

## Adding New Packages

1. Create `packages/<name>/package.json`:
   ```json
   {
     "name": "@codemad/<name>",
     "private": true,
     "type": "module",
     "main": "src/index.ts"
   }
   ```
2. Add to root `package.json` workspaces
3. Add `dependsOn` in `turbo.json` if depends on other packages
4. Run `bun install` from repo root

## Import Violations

| Violation          | Detection                       | Detection Method                                   | Resolution                             |
| ------------------ | ------------------------------- | -------------------------------------------------- | -------------------------------------- |
| Circular import    | TypeScript error, build failure | `madge --circular packages/` or TS error TS2395    | Extract shared code to `util`          |
| Upward import      | Type error "cannot find module" | `grep -r "from '@codemad/opencode'" packages/app/` | Use SDK for app→opencode communication |
| Missing dependency | Turborepo build order failure   | `bun turbo build --dry-run` shows missing deps     | Add `dependsOn` in `turbo.json`        |

## Planning Documents

| File                        | Contents                   | When to Update       |
| --------------------------- | -------------------------- | -------------------- |
| `.planning/PROJECT.md`      | Requirements and decisions | Scope changes        |
| `.planning/REQUIREMENTS.md` | Cumulative requirements    | New feature specs    |
| `.planning/ROADMAP.md`      | Phase delivery plan        | Milestone completion |
| `.planning/STATE.md`        | Current progress           | After each phase     |
| `.planning/phases/`         | Execution plans            | During planning      |
