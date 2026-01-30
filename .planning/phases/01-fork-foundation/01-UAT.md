---
status: diagnosed
phase: 01-fork-foundation
source: [01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md]
started: 2026-01-30T07:45:00Z
updated: 2026-01-30T07:55:00Z
---

## Current Test

[testing complete]

## Tests

### 1. CodeMAD branding distinct
expected: Run `bun dev` and observe the TUI. The application should identify itself as "CodeMAD" in the UI header/title, not "OpenCode".
result: issue
reported: "Not still sees open code"
severity: major

### 2. CLI binary is named codemad
expected: After building, the CLI binary should be `codemad`, not `opencode`. Check with `bun run --cwd packages/opencode ./src/index.ts --version` or inspect `packages/opencode/bin/codemad`.
result: issue
reported: "CLI help shows OPEN CODE banner and all commands use opencode prefix"
severity: major

### 3. Configure Moonshot (Kimi) provider
expected: In settings or config, you can select "Moonshot" or "Kimi" as a provider. The provider should appear in the provider list.
result: pass

### 4. Configure Zhipu (GLM) provider
expected: In settings or config, you can select "Zhipu" or "GLM" as a provider. The provider should appear in the provider list.
result: pass

### 5. Configure MiniMax provider
expected: In settings or config, you can select "MiniMax" as a provider. The provider should appear in the provider list.
result: pass

### 6. API key authentication for Chinese providers
expected: When you select a Chinese provider (Moonshot, Zhipu, or MiniMax) without an API key configured, the UI shows an API key entry dialog prompting you to enter your key.
result: pass

## Summary

total: 6
passed: 4
issues: 2
pending: 0
skipped: 0

## Gaps

- truth: "TUI should identify itself as CodeMAD in the UI header/title, not OpenCode"
  status: failed
  reason: "User reported: Not still sees open code"
  severity: major
  test: 1
  root_cause: "Incomplete rebrand - package scope changed but user-visible strings not updated"
  artifacts:
    - path: "packages/opencode/src/cli/cmd/tui/component/tips.tsx"
      issue: "30+ tip strings reference opencode"
    - path: "packages/app/src/cli/cmd/tui/routes/session/sidebar.tsx"
      issue: "Line 287 says OpenCode"
  missing:
    - "Update all user-visible strings from OpenCode to CodeMAD"
  debug_session: ""

- truth: "CLI binary should be codemad, commands should use codemad prefix"
  status: failed
  reason: "CLI help shows OPEN CODE banner and all commands use opencode prefix"
  severity: major
  test: 2
  root_cause: "CLI scriptName set to opencode, logo.ts has OPEN CODE ASCII art"
  artifacts:
    - path: "packages/opencode/src/index.ts"
      issue: "Line 44: .scriptName(opencode) should be codemad"
    - path: "packages/opencode/src/cli/logo.ts"
      issue: "ASCII art spells OPEN CODE instead of CODEMAD"
    - path: "packages/opencode/src/cli/cmd/*.ts"
      issue: "8+ command files use opencode in descriptions"
  missing:
    - "Change .scriptName to codemad"
    - "Create new CODEMAD ASCII banner"
    - "Update all command descriptions"
  debug_session: ""
