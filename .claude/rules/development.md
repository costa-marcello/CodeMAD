# Development

<!-- v1.8 | 2026-02-08 | paths: [] -->

## Debugging

| Approach         | Command                                                                                           | When to Use                                          |
| ---------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| TUI inspector    | `bun run --inspect=ws://localhost:6499/ dev`                                                      | Debugging agent logic, tool execution, UI state      |
| Server inspector | `bun run --inspect=ws://localhost:6499/ --cwd packages/opencode ./src/index.ts serve --port 4096` | API issues, provider integrations, session state     |
| Attach mode      | `codemad attach http://localhost:4096`                                                            | Connect TUI to running server for isolated debugging |

**Decision Matrix:**

| Scenario           | Use       | Why                                          |
| ------------------ | --------- | -------------------------------------------- |
| Breakpoints needed | Inspector | Step-through debugging impossible with logs  |
| State inspection   | Inspector | See full object state, not serialized output |
| Async flow tracing | Inspector | Call stack shows promise chains              |
| Production issues  | Logs      | Inspector unavailable in prod                |
| Performance timing | Logs      | `console.time` is lower overhead             |
| CI debugging       | Logs      | No interactive debugger in CI                |

## Concurrent Debugging

| Terminal 1                                         | Terminal 2                                   | Purpose                       |
| -------------------------------------------------- | -------------------------------------------- | ----------------------------- |
| `bun run --inspect=ws://localhost:6499/ dev serve` | `bun run --inspect=ws://localhost:6500/ dev` | Debug server + TUI separately |

**Note:** Each inspector port supports one DevTools connection. Open two Chrome DevTools windows at different ports.

## Inspector Port Conflicts

| Problem                    | Solution                                             |
| -------------------------- | ---------------------------------------------------- |
| Port 6499 in use           | Use different port: `--inspect=ws://localhost:6500/` |
| Multiple inspectors needed | Increment port per process (6499, 6500, 6501)        |
| Can't find port in use     | `lsof -i :6499` to identify process                  |

## Web/Desktop Development

| Command                                    | Purpose            | Prerequisite             |
| ------------------------------------------ | ------------------ | ------------------------ |
| `bun run --cwd packages/app dev`           | Web UI development | `bun dev serve` running  |
| `bun run --cwd packages/desktop tauri dev` | Desktop app        | Rust toolchain installed |

## SDK Sync Workflow

**Trigger:** Any API route or schema change in `packages/opencode/src/server/`

| Step              | Command                                  | Why                     |
| ----------------- | ---------------------------------------- | ----------------------- |
| 1. Edit API       | Modify `server/routes.ts` or Zod schemas | —                       |
| 2. Regenerate SDK | `./packages/sdk/js/script/build.ts`      | Types must match server |
| 3. Restart app    | `bun run --cwd packages/app dev`         | Pick up new SDK types   |

**Symptom of skipped sync:** Type errors in app for API calls that work at runtime.

## Build Script Flags

| Flag       | Effect                                      | Use Case     |
| ---------- | ------------------------------------------- | ------------ |
| `--single` | Build standalone binary (no Bun dependency) | Distribution |
| (no flag)  | Build CLI as library                        | Development  |

**Output location:** `packages/opencode/dist/*/bin/codemad`

## Environment

| File   | Purpose         | Git Status |
| ------ | --------------- | ---------- |
| `.env` | Local overrides | Ignored    |

Provider API keys go in `.env`. Never commit secrets.

## Hot Reload

| Issue                  | Cause                        | Fix                        | Why                                                              |
| ---------------------- | ---------------------------- | -------------------------- | ---------------------------------------------------------------- |
| Changes not reflecting | Turborepo cache              | `bun turbo --force`        | Stale cache serves old build artifacts despite source changes    |
| TUI frozen             | Inspector attached           | Detach debugger or restart | Debugger breakpoints pause the event loop, blocking UI rendering |
| Types stale after edit | TypeScript watch not running | Restart `bun dev`          | Bun's watcher misses cross-package changes in monorepos          |

## Troubleshooting

| Problem            | Diagnosis               | Solution                                                    | Why                                                                          |
| ------------------ | ----------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Port 4096 in use   | Another server running  | `lsof -i :4096` then kill, or use `PORT=4097 bun dev serve` | Zombie processes hold ports; identifying the process prevents blind restarts |
| SDK type errors    | Out of sync with server | Regenerate: `./packages/sdk/js/script/build.ts`             | Type errors at runtime indicate SDK drift; regeneration re-syncs with server |
| Storage corruption | Corrupted JSON files    | Delete `~/.local/share/codemad/storage/migration` to retry  | Failed migration counter prevents retry                                      |
| Provider 401       | Invalid or expired key  | Check `.env` and provider dashboard                         | Auth errors are permanent; retrying won't fix expired or revoked credentials |
| Build fails        | Missing dependencies    | `bun install` from repo root                                | Monorepo hoists deps to root; package-level install misses shared packages   |

## Logs

| Location                  | Contents                       |
| ------------------------- | ------------------------------ |
| Console                   | Server requests, agent actions |
| `~/.local/state/codemad/` | Persistent logs, session state |
| Inspector                 | Breakpoints, call stacks       |

Filter console output with `2>&1 | grep "pattern"` for focused debugging.
