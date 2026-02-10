# Branded Types

<!-- Extracted from .claude/rules/code-style.md | 2026-02-06 -->

For domain IDs that shouldn't mix -- prevents passing `orderId` where `userId` expected:

```typescript
type Brand<T, B> = T & { __brand: B }
type UserId = Brand<string, "UserId">
type OrderId = Brand<string, "OrderId">

const userId = "abc" as UserId
const orderId = "xyz" as OrderId

function getUser(id: UserId) {
  /* ... */
}
getUser(orderId) // Type error -- OrderId not assignable to UserId
```
