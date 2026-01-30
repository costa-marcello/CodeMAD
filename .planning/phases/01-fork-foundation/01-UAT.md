---
status: complete
phase: 01-fork-foundation
source: [01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md, 01-04-SUMMARY.md, 01-05-SUMMARY.md]
started: 2026-01-30T13:19:00Z
updated: 2026-01-30T14:05:00Z
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
result: pass
note: Fixed via commits 44a33791a, 7eb4f2afa, 31411f9a3, 782b59467

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
passed: 6
issues: 0
pending: 0
skipped: 0

## Gaps

[all issues resolved]

- truth: "CLI banner colors should match TUI banner colors exactly"
  status: fixed
  resolution: "Applied true color ANSI codes, restored glow effect, fixed letter spacing"
  commits: ["44a33791a", "7eb4f2afa", "31411f9a3", "782b59467"]
