# Code Style

<!-- v1.8 | 2026-02-06 | paths: ["packages/**/*.ts", "packages/**/*.tsx"] -->

## Core Principles

| Principle                  | Why                                                             |
| -------------------------- | --------------------------------------------------------------- |
| Keep logic in one function | Split only when composable/reusable                             |
| Use direct property access | `obj.a` reads clearer than `const { a } = obj`                  |
| Let errors propagate       | Callers handle errors; catching obscures source                 |
| Use proper typing          | `unknown` + narrowing instead of `any`                          |
| Use Bun APIs               | `Bun.file()` is faster and more idiomatic than Node equivalents |
| Rely on type inference     | Explicit annotations only for exports or clarity                |

## Patterns

| Pattern       | Bad                                     | Good                                                   | Why                                          |
| ------------- | --------------------------------------- | ------------------------------------------------------ | -------------------------------------------- |
| Variables     | `let x; if (c) x = 1; else x = 2`       | `const x = c ? 1 : 2`                                  | Mutation obscures flow                       |
| Control flow  | `if (c) return 1; else return 2`        | `if (c) return 1; return 2`                            | Reduces nesting                              |
| Naming        | `const userSession = getSession()`      | `const session = getSession()`                         | Context makes meaning clear                  |
| Async         | `.then().catch()` chains                | `async/await` with try                                 | Readable, easier debugging                   |
| Imports       | Mixed import styles                     | External deps, internal, relative, types               | Consistent ordering aids scanning            |
| Comments      | `// increment x` above `x++`            | Comment non-obvious why, not what                      | Code shows what; comments explain intent     |
| Functions     | `function` for callbacks                | Arrow functions for callbacks, `function` for hoisting | Arrows capture `this`; functions hoist       |
| Exports       | `export default`                        | Named exports                                          | Refactoring-safe, better tree-shaking        |
| Nullish       | `val \|\| default`                      | `val ?? default`                                       | `\|\|` treats `0` and `''` as falsy          |
| Strings       | `'Hello ' + name + '!'`                 | Template literal                                       | Cleaner, supports multiline                  |
| Type guards   | `as Type` assertion                     | Type narrowing with `typeof`/`in`                      | Assertions trust blindly; guards verify      |
| External data | `const data = await res.json() as User` | `UserSchema.parse(await res.json())`                   | Type assertions trust blindly; Zod validates |
| Env vars      | `process.env.API_KEY!`                  | `z.string().parse(process.env.API_KEY)`                | Non-null assertion hides missing config      |

## Import Order

| Order                   | Example                                 | Enforced By |
| ----------------------- | --------------------------------------- | ----------- |
| 1. Node/Bun builtins    | `import { readFile } from 'fs'`         | ESLint      |
| 2. External packages    | `import { z } from 'zod'`               | ESLint      |
| 3. @codemad/\* packages | `import { retry } from '@codemad/util'` | ESLint      |
| 4. Relative imports     | `import { Button } from './button'`     | ESLint      |
| 5. Type imports         | `import type { User } from './types'`   | ESLint      |

## Naming Disambiguation

| Context                   | Single-word OK | Multi-word Needed   | Why                                 |
| ------------------------- | -------------- | ------------------- | ----------------------------------- |
| Inside `SessionComponent` | `session`      | —                   | Component provides context          |
| Module-level variable     | —              | `currentSession`    | No implicit scope                   |
| Function parameter        | `user`         | —                   | Function signature provides context |
| Exported constant         | —              | `defaultRetryCount` | Consumers lack context              |

## Nullish Operators

| Operator | Use When                             | Example                 |
| -------- | ------------------------------------ | ----------------------- |
| `??`     | Missing config (null/undefined only) | `port ?? 3000`          |
| `\|\|`   | Falsy replacement (includes 0, '')   | `name \|\| 'Anonymous'` |
| `?.`     | Optional chaining                    | `user?.email`           |

## Comment Styles

| Type        | Format                              | Example                                            |
| ----------- | ----------------------------------- | -------------------------------------------------- |
| TODO        | `TODO: description (#ticket)`       | `// TODO: Add retry logic (#123)`                  |
| FIXME       | `FIXME: description (cause)`        | `// FIXME: Race condition (concurrent writes)`     |
| HACK        | `HACK: description (why temporary)` | `// HACK: Skip validation (deadline)`              |
| Why comment | Explain non-obvious reason          | `// Using sync read: Bun bug with async in worker` |

## When to Deviate

| Pattern                | Acceptable Deviation                  | Example                                                             |
| ---------------------- | ------------------------------------- | ------------------------------------------------------------------- |
| Named exports          | Default for lazy-loaded routes        | `export default () => <Page />` — required by router code-splitting |
| Named exports          | Default for Tauri commands            | `export default invoke('cmd')` — required by Tauri IPC              |
| Direct property access | Destructuring in function params      | `function foo({ a, b })` — improves signature readability           |
| Const over let         | Loop variables requiring reassignment | `for (let i = 0; ...)` — no alternative for traditional loops       |

## Design Philosophy

- **Easy to delete > easy to extend** — Requirements change; deletable code doesn't become debt
- **Composition > inheritance** — Rigid hierarchies are hard to refactor
- **Single responsibility** — One thing per function
- **Guard clauses > nesting** — Early returns flatten logic
- **DRY after Rule of Three** — Wait for patterns to emerge across three uses before extracting
- **Inline first** — Extract when pattern is clear; bad abstractions are OK if reversible

## TypeScript Strict Mode

| Flag                         | Effect                                                            | Why                                                  |
| ---------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| `strict: true`               | Enables all strict checks (strictNullChecks, strictFunctionTypes) | Catches null/undefined bugs before runtime           |
| `noUncheckedIndexedAccess`   | Array/object access returns `T \| undefined`, forces null checks  | Prevents crashes on empty arrays/missing keys        |
| `noImplicitOverride`         | Requires `override` keyword, catches broken inheritance           | Detects accidental method shadowing during refactors |
| `exactOptionalPropertyTypes` | Distinguishes `undefined` from missing property                   | Prevents subtle serialization bugs                   |

## Zod at Boundaries

Validate external data (API inputs, form data, env vars) with Zod--TypeScript only checks compile-time; runtime lies slip through.

```typescript
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(["admin", "user"]).default("user"),
})

export async function POST(req: Request) {
  const result = CreateUserSchema.safeParse(await req.json())
  if (!result.success) return Response.json({ error: result.error.flatten() }, { status: 400 })
  return createUser(result.data) // Fully typed: { email: string; name: string; role: 'admin' | 'user' }
}
```

## Branded Types (Optional)

For domain ID safety, use branded types. See `@.claude/reference/branded-types.md`.

## Error Handling

- **Bubble unless handleable** — Catching unfixable errors hides problems
- **Catch at boundaries** — API routes, event handlers, async entry points
- **Log or rethrow** — Never swallow silently
- **Custom error classes** — Domain errors carry meaning

```typescript
// Let errors bubble; catch at the boundary
async function getUser(id: string) {
  const user = await db.users.find(id) // Throws if fails
  const prefs = await db.prefs.find(id) // Throws if fails
  return { user, prefs }
}

// Boundary handles with context
app.get("/user/:id", async (req, res) => {
  try {
    res.json(await getUser(req.params.id))
  } catch (e) {
    logger.error({ event: "getUser_failed", id: req.params.id, error: e })
    res.status(500).json({ error: "Failed to fetch user" })
  }
})
```

## Async Patterns

| Pattern            | Bad                                    | Good                                  | Why                                         |
| ------------------ | -------------------------------------- | ------------------------------------- | ------------------------------------------- |
| Cancellation       | No abort signal on fetch/timers        | `AbortController` for fetch/timers    | Prevents memory leaks, zombie requests      |
| Concurrency limits | `Promise.all(1000 requests)`           | Batch with `p-limit(10)` or chunking  | Prevents memory exhaustion, API throttling  |
| Error aggregation  | `Promise.all` for partial-success jobs | `Promise.allSettled` + filter results | One failure doesn't mask others             |
| Cleanup            | Resources released only in try block   | `finally` block for cleanup           | Releases resources regardless of throw path |

```typescript
// Batched with concurrency limit
const results = []
for (let i = 0; i < items.length; i += 10) {
  const batch = await Promise.all(items.slice(i, i + 10).map(fetchItem))
  results.push(...batch)
}
```

## Debugging

| Practice        | Bad                            | Good                                                                       | Why                                       |
| --------------- | ------------------------------ | -------------------------------------------------------------------------- | ----------------------------------------- |
| Structured logs | `console.log('Error:', error)` | `logger.error({ event: 'payment_failed', orderId, error: error.message })` | Context enables correlation and filtering |
| Reproduce first | Fix based on description       | Capture exact input, write failing test                                    | Proves bug exists and fix works           |
| Binary search   | Read entire codebase           | Comment out half, narrow location                                          | Finds bug in O(log n) time                |

## Performance

| Practice      | Bad                         | Good                                                  | Why                                            |
| ------------- | --------------------------- | ----------------------------------------------------- | ---------------------------------------------- |
| Measure first | Optimize based on intuition | Profile, then optimize hot paths                      | Intuition about perf is often wrong            |
| N+1 queries   | Query per item in loop      | Batch with `findMany({ where: { id: { in: ids } } })` | N queries to 1 query; O(n) to O(1) round trips |
| Memoize       | Recompute derived values    | `createMemo(() => items().filter(...))` for SolidJS   | Trades memory for CPU; measure both            |
