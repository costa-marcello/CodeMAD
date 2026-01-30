# Code Style

<!-- v1.0 | 2026-01-30 | paths: ["packages/**/*.ts", "packages/**/*.tsx"] -->

## Core Principles

| Principle | Rationale |
|-----------|-----------|
| Keep logic in one function | Unless composable/reusable |
| Avoid unnecessary destructuring | Use `obj.a` instead of `const { a } = obj` |
| Avoid `try`/`catch` | Where possible |
| No `any` type | Use proper typing |
| Use Bun APIs | `Bun.file()`, etc. |
| Rely on type inference | Explicit annotations only for exports or clarity |

## Variable Declarations

**Prefer `const` over `let`:**

```ts
// Good
const foo = condition ? 1 : 2

// Bad
let foo
if (condition) foo = 1
else foo = 2
```

## Control Flow

**Prefer early returns over `else`:**

```ts
// Good
function foo() {
  if (condition) return 1
  return 2
}

// Bad
function foo() {
  if (condition) return 1
  else return 2
}
```

## Naming

**Prefer single-word names when clear:**

```ts
// Good
const foo = 1
const bar = 2

// Bad (unless necessary for clarity)
const fooBar = 1
const barBaz = 2
```
