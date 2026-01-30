# Development

<!-- v1.0 | 2026-01-30 | paths: [] -->

## Debugging

**Debug TUI:**
```bash
bun run --inspect=ws://localhost:6499/ dev
```

**Debug server separately:**
```bash
bun run --inspect=ws://localhost:6499/ --cwd packages/opencode ./src/index.ts serve --port 4096
# Then: opencode attach http://localhost:4096
```

## Web/Desktop Development

| Command | Purpose |
|---------|---------|
| `bun run --cwd packages/app dev` | Web UI (start server first) |
| `bun run --cwd packages/desktop tauri dev` | Desktop app (requires Rust) |

## SDK Regeneration

After API changes:

```bash
./packages/sdk/js/script/build.ts        # JavaScript SDK
./script/generate.ts                     # Full regeneration
```

## Build

```bash
./packages/opencode/script/build.ts --single  # Standalone executable
```
