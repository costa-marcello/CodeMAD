# Testing

<!-- v1.0 | 2026-01-30 | paths: ["**/*.test.ts", "**/*.spec.ts"] -->

## Principles

| Rule | Rationale |
|------|-----------|
| Avoid mocks | Test actual implementation for realistic coverage |
| Don't duplicate logic | Tests should verify behavior, not reimplement it |
| Integration over isolation | Real interactions catch more bugs |

## Anti-Patterns

```ts
// Bad: Mocking internal implementation
jest.mock('../utils')
const mockFn = jest.fn()

// Good: Test actual behavior
const result = actualFunction(input)
expect(result).toBe(expected)
```

```ts
// Bad: Duplicating logic in test
const expected = input.split(',').map(x => x.trim())
expect(result).toEqual(expected)

// Good: Testing against known values
expect(parseList('a, b, c')).toEqual(['a', 'b', 'c'])
```
