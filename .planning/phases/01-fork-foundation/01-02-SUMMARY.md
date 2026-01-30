---
phase: 01-fork-foundation
plan: 02
subsystem: provider
tags: [llm, chinese-providers, kimi, glm, minimax, ai-sdk, openai-compatible]

# Dependency graph
requires:
  - phase: 01-01
    provides: CodeMAD rebranded codebase with @codemad/* packages
provides:
  - Moonshot AI (Kimi K2.5) provider support
  - Zhipu AI (GLM 4.7) provider support
  - MiniMax (M2.1) provider support
  - Chinese LLM provider custom loaders
  - Provider integration tests
affects: [01-03, chinese-users, provider-selection]

# Tech tracking
tech-stack:
  added:
    - zhipu-ai-provider (0.2.2)
    - vercel-minimax-ai-provider (0.0.2)
  patterns:
    - "CUSTOM_LOADERS for Chinese providers with env/config key detection"
    - "OpenAI-compatible API via @ai-sdk/openai-compatible for Moonshot"
    - "Bundled provider import for Zhipu (BUNDLED_PROVIDERS)"

key-files:
  created:
    - ".opencode/opencode.jsonc (Chinese provider configurations)"
    - "packages/opencode/test/provider/chinese-providers.test.ts"
  modified:
    - "packages/opencode/package.json"
    - "packages/opencode/src/provider/provider.ts"

key-decisions:
  - "Use CUSTOM_LOADERS pattern instead of separate provider files"
  - "Bundle Zhipu for direct import, load MiniMax dynamically"
  - "OpenAI-compatible API for Moonshot (no dedicated SDK exists)"
  - "Default to China endpoints (api.moonshot.cn, open.bigmodel.cn)"

patterns-established:
  - "CUSTOM_LOADERS: Chinese providers follow existing pattern with hasKey() detection"
  - "Provider npm mapping: Use existing @ai-sdk/openai-compatible where no SDK exists"
  - "Regional endpoints: Document both China and global in config comments"

# Metrics
duration: 4min
completed: 2026-01-30
---

# Phase 1 Plan 2: Add Chinese LLM Providers Summary

**Moonshot (Kimi K2.5), Zhipu (GLM 4.7), and MiniMax (M2.1) Chinese LLM providers with CUSTOM_LOADERS pattern and config-driven model selection**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-30T06:56:22Z
- **Completed:** 2026-01-30T06:59:58Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Added Moonshot AI (Kimi K2.5, K2.5-thinking) using OpenAI-compatible API
- Added Zhipu AI (GLM 4.7, GLM 4.7 Flash) with bundled provider import
- Added MiniMax (M2.1, M2.1 Lightning) with dynamic provider loading
- Created comprehensive integration tests for all three providers
- Documented regional endpoints (China vs Global) in configuration

## Task Commits

Each task was committed atomically:

1. **Task 1: Install provider packages and create Moonshot provider** - `4351962c0` (feat)
2. **Task 2: Configure Chinese providers in opencode.jsonc** - `9517e013e` (feat)
3. **Task 3: Test provider integration** - `3d63db6f4` (test)

## Files Created/Modified

### Created
- `.opencode/opencode.jsonc` - Chinese provider configurations with models, limits, costs
- `packages/opencode/test/provider/chinese-providers.test.ts` - 9 provider integration tests

### Modified
- `packages/opencode/package.json` - Added zhipu-ai-provider, vercel-minimax-ai-provider
- `packages/opencode/src/provider/provider.ts` - Added BUNDLED_PROVIDERS entry for zhipu, CUSTOM_LOADERS for all three

## Decisions Made

1. **Provider implementation pattern:** Used CUSTOM_LOADERS in provider.ts instead of creating separate provider files (moonshot.ts, etc.) - follows existing codebase pattern and keeps all provider logic centralized

2. **Bundled vs dynamic loading:** Bundled Zhipu directly (BUNDLED_PROVIDERS) since its types are compatible; load MiniMax dynamically because vercel-minimax-ai-provider V3 types conflict with bundled V2 provider types

3. **Moonshot SDK approach:** Used @ai-sdk/openai-compatible since no dedicated Moonshot SDK exists - their API is OpenAI-compatible

4. **Default endpoints:** Default to China endpoints (better latency for target users), document global alternatives in config comments

## Deviations from Plan

### Implementation Changes

**1. [Rule 1 - Bug] No separate moonshot.ts file created**
- **Found during:** Task 1 analysis
- **Issue:** Plan specified creating packages/opencode/src/provider/moonshot.ts but existing codebase uses CUSTOM_LOADERS pattern
- **Fix:** Implemented Moonshot support via CUSTOM_LOADERS in provider.ts following existing pattern (lines 512-527)
- **Rationale:** Consistency with codebase > plan specification. OpenCode centralizes provider logic.
- **Impact:** Better maintainability, follows established patterns

**2. [Rule 3 - Blocking] MiniMax loaded dynamically instead of bundled**
- **Found during:** Task 1 implementation
- **Issue:** vercel-minimax-ai-provider exports V3 provider types incompatible with bundled V2 types
- **Fix:** Load MiniMax dynamically via BunProc.install (existing pattern for non-bundled providers)
- **Files modified:** packages/opencode/src/provider/provider.ts
- **Verification:** Tests pass, provider loads correctly

---

**Total deviations:** 2 implementation changes
**Impact on plan:** Both changes improve integration with existing codebase patterns. All success criteria met.

## Issues Encountered

- TypeScript bundled provider type incompatibility with MiniMax V3 provider - resolved by using dynamic loading pattern

## User Setup Required

**External services require manual API key configuration.** Users need to:

1. **Moonshot AI (Kimi K2.5)**
   - Get API key from: https://platform.moonshot.ai
   - Set: `MOONSHOT_API_KEY` environment variable

2. **Zhipu AI (GLM 4.7)**
   - Get API key from: https://open.bigmodel.cn
   - Set: `ZHIPU_API_KEY` environment variable

3. **MiniMax (M2.1)**
   - Get API key from: https://platform.minimax.io
   - Set: `MINIMAX_API_KEY` environment variable

## Next Phase Readiness

- Chinese LLM providers integrated and tested
- Configuration pattern established for future providers
- Ready for Phase 1 Plan 3: API key auth + provider UI

**Blockers:** None
**Concerns:** None

---
*Phase: 01-fork-foundation*
*Plan: 02*
*Completed: 2026-01-30*
