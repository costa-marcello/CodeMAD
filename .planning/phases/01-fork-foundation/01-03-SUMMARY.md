---
phase: 01-fork-foundation
plan: 03
status: complete
commits:
  - "04cd0f9f3: feat(opencode): add auth plugins for Chinese LLM providers"
  - "9271a8c95: fix(opencode): remove extractReasoningMiddleware blocking think blocks"
---

# Plan 01-03 Summary: API Key Authentication

## What Was Built

1. **Auth plugins for Chinese providers** (`packages/opencode/src/plugin/chinese-providers.ts`)
   - MoonshotAuthPlugin, ZhipuAuthPlugin, MiniMaxAuthPlugin
   - Each registers API key auth method (`type: "api"`)
   - Enables UI to show API key entry dialog

2. **Registered in INTERNAL_PLUGINS** (`packages/opencode/src/plugin/index.ts`)
   - Plugins load automatically on startup
   - No npm installation required (internal plugins)

3. **Upstream sync: v1.45 fix**
   - Removed `extractReasoningMiddleware` that blocked `<think>` blocks
   - Synced with anomalyco/opencode#11270

## Verification

- API key dialog appears when clicking Chinese providers in UI
- Keys saved to `~/.local/share/opencode/auth.json`
- Example storage: `{"moonshot": {"type": "api", "key": "..."}}`

## Key Discovery

The original plan assumed we needed to create custom auth storage. Investigation revealed:
- OpenCode already has a robust auth system (`Auth` namespace)
- Providers need **auth plugins** with `methods: [{ type: "api" }]` to enable UI
- The existing `chinese-providers.ts` in `/auth/` was a convenience wrapper, not the root cause

The fix was creating proper auth plugins following the `codex.ts` pattern.
