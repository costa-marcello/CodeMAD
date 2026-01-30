# CodeMAD

Fork of OpenCode (github.com/anomalyco/opencode) adding cross-session memory, workflow orchestration, Chinese LLM providers, and multi-agent parallel execution with git worktrees.

**Status:** Phase 1 (Fork Foundation) - rebranding complete, implementing Chinese provider support.

## Quick Reference

| Setting | Value |
|---------|-------|
| Default branch | `dev` |
| Package manager | Bun 1.3+ |
| Monorepo | Bun workspaces + Turborepo |
| Package scope | `@codemad/*` |

## Commands

| Command | Purpose |
|---------|---------|
| `bun install` | Install dependencies |
| `bun dev` | Run TUI |
| `bun dev <dir>` | Run against specific directory |
| `bun dev serve` | Start API server (port 4096) |
| `bun turbo typecheck` | Type checking |

## Core Principles

- **Const over let** - Use ternary or early returns instead of reassignment
- **Early returns** - Avoid `else` blocks
- **No mocks** - Test actual implementation
- **Bun APIs** - Prefer `Bun.file()` over Node equivalents
- **Single-word names** - When clear enough

## Hard Rules

| Rule | Why |
|------|-----|
| No `any` type | Breaks type safety |
| No unnecessary destructuring | `obj.a` is clearer than `const { a } = obj` |
| No `try`/`catch` unless required | Obscures error propagation |

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
