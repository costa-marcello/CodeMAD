# Bun vs Jest

<!-- Extracted from .claude/rules/testing.md | 2026-02-06 -->

This project uses **Bun's built-in test runner**. Key differences from Jest:

| Feature    | Bun                       | Jest                          |
| ---------- | ------------------------- | ----------------------------- |
| Speed      | 10-20x faster startup     | Slower, JIT warmup            |
| Config     | Minimal, `bunfig.toml`    | `jest.config.js`              |
| TypeScript | Native, no transpile step | Requires ts-jest/babel        |
| Mocking    | `mock.module()`, `spyOn`  | `jest.mock()`, `jest.spyOn()` |
| Snapshots  | Supported                 | Supported                     |
| Watch mode | `--watch`                 | `--watch`                     |
| Coverage   | `--coverage`              | `--coverage`                  |

**Bun-specific patterns:**

```typescript
import { test, expect, mock, spyOn } from "bun:test"

// Module mocking
mock.module("./api", () => ({
  fetchUser: () => Promise.resolve({ id: 1 }),
}))

// Spy on method
const spy = spyOn(console, "log")
doSomething()
expect(spy).toHaveBeenCalledWith("expected output")
```

**Migration note:** If porting Jest tests, replace `jest.mock` with `mock.module` and `jest.fn()` with `mock()`.
