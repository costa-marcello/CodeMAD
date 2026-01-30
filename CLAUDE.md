# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Fork of OpenCode adding cross-session memory, workflow orchestration, Chinese LLM providers, and multi-agent parallel execution with git worktrees.

**Status:** Phase 1 (Fork Foundation) complete. Ready for Phase 2.

## Quick Reference

| Setting         | Value                                              |
| --------------- | -------------------------------------------------- |
| Default branch  | `main`                                             |
| Package manager | Bun 1.3+                                           |
| Monorepo        | Bun workspaces + Turborepo                         |
| Package scope   | `@codemad/*`                                       |
| TypeScript      | Strict + `noUncheckedIndexedAccess`                |
| Linting         | ESLint 9 + typescript-eslint + eslint-plugin-solid |
| Formatting      | Prettier                                           |

## Commands

| Command                                      | Purpose                              |
| -------------------------------------------- | ------------------------------------ |
| `bun install`                                | Install dependencies                 |
| `bun dev`                                    | Run TUI                              |
| `bun dev <dir>`                              | Run against specific directory       |
| `bun dev serve`                              | Start API server (port 4096)         |
| `bun check`                                  | Full quality gate (typecheck + lint) |
| `bun turbo typecheck`                        | Type checking only                   |
| `bun lint`                                   | ESLint check                         |
| `bun lint:fix`                               | ESLint auto-fix                      |
| `bun format`                                 | Prettier check                       |
| `bun format:fix`                             | Prettier auto-fix                    |
| `bun test --cwd packages/opencode`           | Run tests                            |
| `bun run --inspect=ws://localhost:6499/ dev` | Debug TUI                            |
| `bun run --cwd packages/app dev`             | Web UI (start server first)          |
| `bun run --cwd packages/desktop tauri dev`   | Desktop app (requires Rust)          |

## Quality Gate

Pre-commit hook runs lint-staged (ESLint + Prettier on staged files).
Pre-push hook runs `bun check` (full typecheck + lint).

**Always run `bun check` before pushing.** It must pass with 0 errors.

## SDK & Build

```bash
./packages/sdk/js/script/build.ts        # Regenerate JS SDK after API changes
./packages/opencode/script/build.ts --single  # Build standalone executable
```

## Core Principles

- **Const over let** - Reassignment hides state changes; ternary or early returns make flow explicit
- **Early returns** - Reduces nesting and cognitive load; avoids `else` blocks
- **No mocks** - Tests should verify real behavior; mocks hide integration bugs
- **Bun APIs** - `Bun.file()` and friends are faster and more idiomatic than Node equivalents
- **Single-word names** - Clarity over verbosity; multi-word only when disambiguation needed

## Hard Rules

| Rule                             | Why                                                       |
| -------------------------------- | --------------------------------------------------------- |
| No `any` type                    | Breaks type safety                                        |
| Handle array/object indexing     | `noUncheckedIndexedAccess` is enabled - use `!` or guards |
| No unnecessary destructuring     | `obj.a` is clearer than `const { a } = obj`               |
| No `try`/`catch` unless required | Obscures error propagation                                |

## Commits

Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`

Optional scope: `feat(app):`, `fix(desktop):`, `chore(opencode):`

## Behavior

- Prefer automation: execute actions without confirmation unless blocked by missing info or safety concerns
- Use parallel tool calls when applicable

## Rules (Detailed)

@rules/code-style.md
@rules/testing.md
@rules/architecture.md
@rules/development.md
