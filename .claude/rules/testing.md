# Testing

<!-- v1.9 | 2026-02-06 | paths: ["**/*.test.ts"] -->

## Commands

| Command                                    | Purpose                |
| ------------------------------------------ | ---------------------- |
| `bun test --cwd packages/opencode`         | Run all tests          |
| `bun test --cwd packages/opencode <file>`  | Run specific test file |
| `bun test --cwd packages/opencode --watch` | Watch mode             |

## Principles

| Rule                        | Why                                                        |
| --------------------------- | ---------------------------------------------------------- |
| Test actual implementations | Mocks hide integration bugs; real code catches real issues |
| Verify against known values | Tests should check behavior, not reimplement logic         |
| Prefer integration tests    | Real interactions catch more bugs than isolated units      |
| Failing test before fix     | Proves bug exists and fix works                            |

## Patterns

| Pattern              | Bad                                        | Good                                          | Why                                          |
| -------------------- | ------------------------------------------ | --------------------------------------------- | -------------------------------------------- |
| Real implementations | `jest.mock('../utils')`                    | `const result = actualFn(input)`              | Mocks hide integration bugs                  |
| Known values         | `expect(result).toEqual(input.split(','))` | `expect(parseList('a,b')).toEqual(['a','b'])` | Don't reimplement logic in tests             |
| Bug fixes            | Fix first, test after                      | Write failing test, then fix                  | Proves bug existed                           |
| Behavior testing     | `expect(state.count).toBe(1)`              | `expect(screen.getByText('1')).toBeVisible()` | Test user-visible output, not internal state |
| AI-generated code    | Trust AI output directly                   | Run linters/tests on all AI-generated code    | AI makes plausible-looking mistakes          |

## When to Use Unit vs Integration

| Use Unit Tests                                   | Use Integration Tests     |
| ------------------------------------------------ | ------------------------- |
| Pure functions (parsers, formatters, validators) | API routes and handlers   |
| Complex algorithms with many edge cases          | Database operations       |
| Utility functions with clear input/output        | Provider interactions     |
| Performance-critical hot paths                   | Multi-component workflows |

Integration tests are the default—they catch more real bugs. Use unit tests when the function is pure, has many edge cases, or when integration setup is disproportionately complex.

## Coverage

| Code Type      | Target | Rationale                                        |
| -------------- | ------ | ------------------------------------------------ |
| General        | ~70%   | ROI drops after 70% (2x effort per additional %) |
| Auth, payments | 100%   | Single bug = account breach or money loss        |
| Data mutations | 100%   | Data corruption is often unrecoverable           |

## File Naming

| Convention  | When to Use         | Example                                            | Why                                           |
| ----------- | ------------------- | -------------------------------------------------- | --------------------------------------------- |
| `*.test.ts` | All tests           | `parser.test.ts`                                   | Single convention eliminates naming decisions |
| Colocated   | Test next to source | `src/utils/format.ts` + `src/utils/format.test.ts` | Proximity aids discovery and maintenance      |

This codebase uses `*.test.ts` for all tests (unit and integration). Colocate tests with source files where possible. CodeMAD uses `test/` for integration tests that span multiple modules.

## Test Structure

```
packages/opencode/
├── src/
│   └── tool/
│       ├── bash.ts
│       └── bash.test.ts      # Colocated test
└── test/
    └── fixtures/             # Shared test data
        └── models-api.json
```

## Setup/Teardown

| Hook         | Use For         | Example                                       |
| ------------ | --------------- | --------------------------------------------- |
| `beforeEach` | State reset     | Clear database, reset mocks                   |
| `afterEach`  | Cleanup         | Close connections, remove temp files          |
| `beforeAll`  | Expensive setup | Start test server (only if tests independent) |
| `afterAll`   | Global teardown | Stop test server                              |

## Test Timeouts

Default timeout: **5 seconds**. This balances catching hangs early without flaky failures on slower CI machines.

| Timeout | When to Use                             |
| ------- | --------------------------------------- |
| 5s      | Default—most unit/integration tests     |
| 10s     | Database operations, external API calls |
| 30s     | E2E tests, complex multi-step workflows |

**Why 5s?** Fast enough to catch infinite loops quickly, slow enough to avoid false negatives on CI runners with variable load. Tests exceeding 5s usually indicate a design problem (missing cancellation, unbounded loops, or test doing too much).

## Async Patterns

| Pattern  | Bad                                  | Good                                              | Why                                                                       |
| -------- | ------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------- |
| Promises | `test('x', () => promise.then(...))` | `test('x', async () => await promise)`            | Async/await gives clearer stack traces; `.then` chains hide error origins |
| Timeouts | No timeout on slow tests             | `test('x', async () => {...}, { timeout: 5000 })` | Prevents CI hangs; default timeout often too long for unit tests          |
| Cleanup  | Side effects leak                    | `afterEach(() => cleanup())`                      | Tests should be isolated                                                  |

## Async Error Assertions

Use `rejects.toThrow` for async functions--without `await`, the test completes before the promise rejects, causing false positives.

```typescript
// Bad: passes incorrectly—doesn't wait for rejection
expect(asyncFn("bad")).toThrow()

// Good: awaits rejection with message or error class
await expect(asyncFn("bad")).rejects.toThrow("Invalid input")
await expect(login("wrong")).rejects.toThrow(AuthError)
```

## Fixtures

| Type              | Location               | Example                   |
| ----------------- | ---------------------- | ------------------------- |
| Static JSON       | `test/fixtures/*.json` | API response mocks        |
| Factory functions | `test/helpers/*.ts`    | `createMockSession()`     |
| Inline            | Test file              | Small, test-specific data |

Use static fixtures for API responses; factories for complex objects with many variations.

## Boundary Values

Test edge cases systematically—bugs cluster at boundaries.

| Type          | Values to Test                            |
| ------------- | ----------------------------------------- |
| Arrays        | `[]`, `[single]`, `[...1000 items]`       |
| Strings       | `''`, `'a'`, `'a'.repeat(10000)`          |
| Numbers       | `0`, `1`, `-1`, `Number.MAX_SAFE_INTEGER` |
| Special chars | `@`, `+`, unicode, emoji                  |

**Common boundary bugs:**

- Off-by-one errors at array start/end
- Empty string vs `null` vs `undefined`
- Integer overflow at `MAX_SAFE_INTEGER`
- Unicode normalization (NFC vs NFD)

## E2E Testing

Use sparingly--E2E tests are slow and brittle. Critical paths only (login, checkout, onboard).

| Aspect    | E2E Tests                               | Integration Tests           | Why Distinction Matters                                       |
| --------- | --------------------------------------- | --------------------------- | ------------------------------------------------------------- |
| Scope     | Real browser/app, full user flows       | Real code, mocked externals | E2E catches deployment issues; integration catches logic bugs |
| Speed     | Minutes (parallelize where possible)    | Seconds                     | Slow feedback loops reduce developer velocity                 |
| Stability | Flaky (retry network, stable selectors) | Deterministic               | Flaky tests erode trust in CI                                 |
| Coverage  | ~10% of suite                           | ~60% of suite               | ROI favors integration for most cases                         |
| Data      | Seed + clean up after each run          | In-memory/fixtures          | Shared state causes intermittent failures                     |

## Bun vs Jest

This project uses **Bun's built-in test runner**. See `@.claude/reference/bun-testing.md` for the full comparison table, Bun-specific patterns, and Jest migration notes.
