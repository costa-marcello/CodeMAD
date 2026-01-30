---
status: complete
phase: 01-fork-foundation
source: [01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md, 01-04-SUMMARY.md, 01-05-SUMMARY.md]
started: 2026-01-30T13:19:00Z
updated: 2026-01-30T13:32:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Terminal window title shows CodeMAD
expected: Run `bun dev` to start the TUI. The terminal window/tab title should say "CodeMAD" (not "OpenCode").
result: pass

### 2. ASCII art is clean without fades
expected: The ASCII banner at startup shows clean block characters forming "CODEMAD" without fade marks (_^~) around the letters.
result: pass

### 3. CLI help shows MAD in red (matching TUI)
expected: Run `codemad --help` or `bun dev --help`. The banner shows CODE in white and MAD in the same orange-red (#FF3300) as the TUI.
result: issue
reported: "CLI colors differ from TUI. Both CODE and MAD should match TUI exactly - CODE should be grayish (not white), MAD should be orange-red #FF3300"
severity: cosmetic

### 4. Chinese providers appear in list
expected: In settings or provider selection, Moonshot (Kimi), Zhipu (GLM), and MiniMax appear as available providers.
result: pass

### 5. API key auth dialog for Chinese providers
expected: Select a Chinese provider (Moonshot, Zhipu, or MiniMax) without an API key. An API key entry dialog prompts you to enter your key.
result: pass

### 6. Session title shows CM prefix
expected: When a session starts, the terminal title shows "CM | {session-name}" format (not "OC |").
result: pass

## Summary

total: 6
passed: 5
issues: 1
pending: 0
skipped: 0

## Gaps

- truth: "CLI banner colors should match TUI banner colors exactly"
  status: failed
  reason: "User reported: CLI colors differ from TUI. Both CODE and MAD should match TUI exactly - CODE should be grayish (not white), MAD should be orange-red #FF3300"
  severity: cosmetic
  test: 3
  root_cause: "CLI uses basic ANSI codes (97m white, 91m red) instead of true color matching TUI theme (textMuted #888888, primary #FF3300)"
  artifacts:
    - path: "packages/opencode/src/cli/ui.ts"
      issue: "Lines 46-55 use wrong ANSI codes: 97m (white) instead of #888888, 91m (red) instead of #FF3300"
    - path: "packages/opencode/src/cli/cmd/tui/context/theme/codemad.json"
      issue: "Reference - defines correct colors: textMuted=#888888, primary=#FF3300"
  missing:
    - "Change CODE to use true color: \\x1b[38;2;136;136;136m (#888888)"
    - "Change MAD to use true color: \\x1b[38;2;255;51;0m\\x1b[1m (#FF3300 + bold)"
  debug_session: ""
