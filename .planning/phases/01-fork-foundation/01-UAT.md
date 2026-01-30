---
status: diagnosed
phase: 01-fork-foundation
source: [01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md, 01-04-SUMMARY.md]
started: 2026-01-30T07:45:00Z
updated: 2026-01-30T12:45:00Z
---

## Current Test

[testing complete]

## Tests

### 1. CodeMAD branding distinct
expected: Run `bun dev` and observe the TUI. The application should identify itself as "CodeMAD" in the UI header/title, not "OpenCode".
result: issue
reported: "CODEMAD banner shows but terminal window title says OpenCode. ASCII art has fades and could be slightly bigger."
severity: major

### 2. CLI binary is named codemad
expected: CLI help shows `codemad` commands and CODEMAD banner with proper brand colors.
result: issue
reported: "Commands show codemad prefix correctly, but CLI help colors don't show MAD in red accent - both CODE and MAD are same yellow/gold color."
severity: cosmetic

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

- truth: "Terminal window title should say CodeMAD, not OpenCode"
  status: failed
  reason: "User reported: Terminal window title says OpenCode instead of CodeMAD"
  severity: major
  test: 1
  root_cause: "Process title or terminal escape sequence still references OpenCode"
  artifacts:
    - path: "packages/opencode/src/cli/cmd/tui/index.tsx"
      issue: "May set terminal title via escape sequence"
    - path: "packages/opencode/src/index.ts"
      issue: "Process title may be set here"
  missing:
    - "Update terminal title escape sequence to CodeMAD"
  debug_session: ""

- truth: "ASCII art should be clean without fades and slightly bigger"
  status: failed
  reason: "User reported: ASCII art has fades around letters and could be slightly bigger"
  severity: cosmetic
  test: 1
  root_cause: "Logo marks system creates fade effect, logo size is fixed"
  artifacts:
    - path: "packages/opencode/src/cli/logo.ts"
      issue: "ASCII art uses marks (_^~) creating fade effect"
  missing:
    - "Redesign ASCII art without marks for cleaner look"
    - "Increase logo size"
  debug_session: ""

- truth: "CLI help should show MAD in red accent color"
  status: failed
  reason: "User reported: CLI help colors show both CODE and MAD in same yellow/gold instead of MAD in red"
  severity: cosmetic
  test: 2
  root_cause: "CLI help uses yargs default coloring, not custom brand colors"
  artifacts:
    - path: "packages/opencode/src/cli/ui.ts"
      issue: "UI.logo() may not apply colors in non-TUI context"
  missing:
    - "Apply red color to MAD portion in CLI help output via ANSI codes"
  debug_session: ""
