# OpenCode Name Disambiguation

**Researched:** 2026-01-30
**Purpose:** Clarify the two different projects named "OpenCode"

## Summary

There are **two unrelated projects** both called "OpenCode" that appear in GitHub searches. This document clarifies which is which to prevent confusion.

---

## The Two OpenCodes

### 1. anomalyco/opencode (RECOMMENDED - Used in prior research)

| Attribute | Value |
|-----------|-------|
| **Repository** | https://github.com/anomalyco/opencode |
| **Stars** | 92,537 |
| **Forks** | 8,546 |
| **Language** | TypeScript |
| **License** | MIT |
| **Status** | ACTIVE (last commit: 2026-01-30) |
| **Description** | "The open source coding agent." |
| **Organization** | Anomaly Co. (terminal.shop creators) |
| **npm package** | `opencode-ai` |

**Key features:**
- Cross-platform desktop app (Electron)
- Client/server architecture
- Multi-provider LLM support (Claude, OpenAI, Gemini, local)
- Built-in agents: `build` (full access) and `plan` (read-only)
- LSP integration
- MCP support
- 14+ languages supported
- 663+ contributors

**This is the correct fork candidate for CodeMAD.**

---

### 2. opencode-ai/opencode (ARCHIVED - Not recommended)

| Attribute | Value |
|-----------|-------|
| **Repository** | https://github.com/opencode-ai/opencode |
| **Stars** | 10,681 |
| **Forks** | 977 |
| **Language** | Go |
| **License** | MIT |
| **Status** | **ARCHIVED** (September 18, 2025) |
| **Successor** | Crush (charmbracelet/crush) |

**Key facts:**
- Built with Bubble Tea TUI framework
- Archived in September 2025
- Development continued under "Crush" by Charmbracelet

**Why not viable:**
1. Repository is archived and read-only
2. No future updates or security patches
3. Successor project (Crush) has FSL license that prohibits commercial competing use

---

## Crush (opencode-ai/opencode's successor)

| Attribute | Value |
|-----------|-------|
| **Repository** | https://github.com/charmbracelet/crush |
| **Stars** | 19,162 |
| **Forks** | 1,170 |
| **Language** | Go |
| **License** | **FSL-1.1-MIT** (time-delayed permissive) |
| **Status** | ACTIVE |

**License implications:**
- Currently (until ~May 2027): Commercial competing use **prohibited**
- After 2-year conversion: Full MIT license
- Cannot fork for CodeMAD until license converts

---

## How to distinguish

| Search term | Likely result | Check |
|-------------|---------------|-------|
| "opencode ai coding" | Could be either | Check org name |
| "anomalyco opencode" | Correct (92k stars) | TypeScript, active |
| "opencode-ai opencode" | Archived (10k stars) | Go, archived |
| "opencode desktop" | anomalyco (has desktop) | |
| "opencode bubble tea" | opencode-ai (archived) | |

---

## Recommendation

**Use anomalyco/opencode** as identified in the existing research. It is:
- Actively maintained
- MIT licensed (commercially safe)
- Already has desktop app
- TypeScript (easier to extend)
- Much larger community

**Avoid opencode-ai/opencode** and its successor Crush for commercial fork due to:
- Archived status (no updates)
- Successor's FSL license restrictions

---

## Sources

- [anomalyco/opencode GitHub](https://github.com/anomalyco/opencode)
- [opencode-ai/opencode GitHub](https://github.com/opencode-ai/opencode) (archived)
- [charmbracelet/crush GitHub](https://github.com/charmbracelet/crush)
- [Crush FSL-1.1-MIT License](https://github.com/charmbracelet/crush/blob/main/LICENSE.md)
