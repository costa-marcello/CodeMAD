# Fork Candidate Analysis for CodeMAD

**Researched:** 2026-01-30
**Confidence:** HIGH (verified via GitHub repositories and official documentation)

---

## Context: Two Development Paths

This research explores **forking an existing project** as an alternative to the "build from scratch" approach documented in the other research files (SUMMARY.md, STACK.md, etc.).

| Path | Timeline | Risk | Differentiation |
|------|----------|------|-----------------|
| **Fork OpenCode** | 5-7 months | Medium (upstream dependency) | Focus on GSD, parallel, review |
| **Build with Tauri** | 12-18 months | Low (full control) | Everything custom, optimized |

**Recommendation:** Fork OpenCode for faster time-to-market, then evaluate migrating to Tauri-based custom build post-launch if performance or flexibility demands it.

---

## Executive Summary

After comprehensive research of 10+ open source AI coding tools, **OpenCode (anomalyco/opencode)** emerges as the recommended fork base for CodeMAD. It provides the strongest foundation with 92.5k stars, MIT license, TypeScript codebase, multi-provider LLM support, and client/server architecture that aligns with CodeMAD's cross-platform desktop requirements.

**Key insight:** The AI coding tool landscape has matured significantly. Rather than building from scratch, forking gives CodeMAD a 6-12 month head start on table-stakes features while allowing focus on differentiators (GSD methodology, per-hunk review, parallel worktrees).

---

## Quick Comparison Matrix

| Candidate | Stars | Language | License | Desktop Ready | Multi-LLM | Architecture Quality | Gap to CodeMAD |
|-----------|-------|----------|---------|---------------|-----------|---------------------|----------------|
| **OpenCode** | 92.5k | TypeScript | MIT | Yes (Electron) | Yes | Excellent | Small |
| Cline | 57.3k | TypeScript | Apache-2.0 | No (VS Code only) | Yes | Very Good | Medium |
| Aider | 40.2k | Python | Apache-2.0 | No (CLI only) | Yes | Good | Large |
| Continue | 31.2k | TypeScript | Apache-2.0 | No (IDE plugin) | Yes | Very Good | Medium |
| Goose | 29.6k | Rust | Apache-2.0 | Yes (Electron) | Yes | Good | Medium |
| Void | 28.2k | TypeScript | Apache-2.0 | Yes (VS Code fork) | Yes | Good | **PAUSED** |
| Zed | 74.3k | Rust | GPL-3.0 | Yes | Limited | Excellent | Large |
| Roo Code | 22k | TypeScript | Apache-2.0 | No (VS Code only) | Yes | Good | Medium |
| OpenHands | 67.3k | Python | MIT | Yes (Electron) | Yes | Very Good | Medium |

---

## Detailed Candidate Analysis

### 1. OpenCode (anomalyco/opencode) - RECOMMENDED

**Repository:** https://github.com/anomalyco/opencode
**Stars:** 92,500 | **Forks:** 8,500 | **Contributors:** 663
**Language:** TypeScript (86.6%) | **License:** MIT
**Last Commit:** January 30, 2026 (v1.1.44)

#### Why OpenCode Leads

1. **Perfect license (MIT):** Maximum flexibility for commercial use and modification
2. **Cross-platform desktop already exists:** macOS, Windows, Linux apps available
3. **Client/server architecture:** Enables remote control, mobile apps, extensibility
4. **TypeScript codebase:** Easier to extend than Rust or Go for web-focused team
5. **Massive community:** 663 contributors, 650k+ monthly active users
6. **Provider agnostic:** Claude, OpenAI, Google, local models all supported
7. **LSP integration:** Built-in Language Server Protocol support
8. **MCP support:** Model Context Protocol for tool extensibility
9. **Active development:** 14 languages supported, frequent releases

#### Architecture Highlights

```
Client (TUI/Desktop/Mobile) <---> Server (Local) <---> LLM Providers
                                      |
                                      v
                              LSP | MCP Tools | Git
```

- **OpenTUI framework:** Custom Zig + SolidJS reactive TUI
- **Built-in agents:** `build` (full access) and `plan` (read-only)
- **Subagent system:** `@general` invocation for complex tasks
- **Session management:** SQLite persistence
- **File change tracking:** Visual diff during sessions

#### Feature Overlap with CodeMAD

| CodeMAD Requirement | OpenCode Status | Gap |
|---------------------|-----------------|-----|
| Cross-platform desktop | Yes (Electron) | None |
| Multi-provider LLM | Yes (all major + local) | None |
| Context intelligence | LSP yes, vectors partial | Need vector embeddings |
| Parallel execution | No worktree support | Need to build |
| Per-hunk review | Partial diff view | Need to enhance |
| GSD workflow | No methodology | Need to build |
| Privacy/local-first | Yes (local models) | None |

#### What to Keep

- Core LLM integration layer (provider abstraction)
- Client/server architecture
- Desktop app shell (Electron)
- LSP integration
- MCP tool system
- Session management
- Git integration basics

#### What to Replace/Add

- Add vector embedding layer (Qdrant/LanceDB local)
- Add git worktree parallel execution
- Add per-hunk review UI with accept/reject
- Add GSD workflow methodology
- Enhanced context window management
- Custom TUI may need rework for desktop-first UX

---

### 2. Cline (cline/cline) - Strong Alternative

**Repository:** https://github.com/cline/cline
**Stars:** 57,300 | **Forks:** 5,700
**Language:** TypeScript | **License:** Apache-2.0
**Last Commit:** January 30, 2026

#### Strengths

- **Excellent architecture:** Multi-process with gRPC, clean separation
- **MCP leader:** Pioneer in Model Context Protocol extensibility
- **Human-in-the-loop:** Strong approval workflow for all actions
- **Workspace snapshots:** Diff/restore at any point
- **Browser automation:** Built-in Playwright integration
- **Enterprise features:** SSO, RBAC, audit trails in Cline Teams

#### Architecture

```
Extension Host <--gRPC--> Webview Processes
      |
      v
Controller (Orchestrator)
      |
      v
ClineDefaultTool | McpTool | StateManager
```

#### Why Not Primary Choice

- **VS Code locked:** Designed as extension, not standalone
- **Extraction complexity:** Would need to decouple from VS Code APIs
- **Desktop conversion:** Significant work to make standalone

#### Best for CodeMAD

- Study MCP integration patterns
- Borrow workspace snapshot approach
- Learn from Plan/Act mode separation

---

### 3. Continue (continuedev/continue) - IDE Focus

**Repository:** https://github.com/continuedev/continue
**Stars:** 31,200 | **Forks:** 4,100 | **Contributors:** 443
**Language:** TypeScript (84.1%) | **License:** Apache-2.0
**Last Commit:** January 26, 2026

#### Strengths

- **Seven-layer architecture:** Clean separation of concerns
- **Multi-IDE:** VS Code + JetBrains
- **Workflow automation:** CI/CD integration, scheduled agents
- **Progressive permissions:** Granular control over AI actions
- **Well-documented:** Extensive architecture docs
- **Uses LanceDB:** Same vector DB recommended in STACK.md

#### Architecture

```
GUI (React/Redux) <--> Extension <--> Core
                                        |
                                        v
                              Model Providers | Context Providers | MCP
```

#### Why Not Primary Choice

- **IDE-coupled:** Designed for extension, not standalone app
- **Headless mode is new:** CLI/cloud agents recently added
- **No desktop app:** Would need Electron wrapper

---

### 4. Goose (block/goose) - Rust Quality

**Repository:** https://github.com/block/goose
**Stars:** 29,600 | **Forks:** 2,700 | **Contributors:** 373
**Language:** Rust (59.4%) + TypeScript (33.1%) | **License:** Apache-2.0
**Last Commit:** January 29, 2026

#### Strengths

- **Rust core:** High performance, memory safety
- **MCP founding contributor:** Deep protocol expertise
- **Electron desktop:** Already cross-platform
- **Block backing:** Well-funded, enterprise credibility
- **Linux Foundation AAIF:** Part of Agentic AI Foundation

#### Why Not Primary Choice

- **Rust complexity:** Steeper learning curve for extending
- **Younger project:** Less mature than OpenCode
- **Smaller community:** 373 vs 663 contributors

#### Best for CodeMAD

- Study MCP server architecture
- Learn from Rust/TypeScript hybrid approach

---

### 5. Void (voideditor/void) - PAUSED

**Repository:** https://github.com/voideditor/void
**Stars:** 28,200 | **Forks:** 2,300 | **Contributors:** 46
**Language:** TypeScript (95.3%) | **License:** Apache-2.0

#### Status: DEVELOPMENT PAUSED

> "We've paused work on the Void IDE...to explore a few novel coding ideas."

**Not recommended.** While architecturally interesting as a VS Code fork, the project is not actively maintained. Features may deteriorate.

---

### 6. Zed (zed-industries/zed) - Full Editor

**Repository:** https://github.com/zed-industries/zed
**Stars:** 74,300 | **Forks:** 6,800 | **Contributors:** 1,570
**Language:** Rust (97.8%) | **License:** GPL-3.0 (restrictive)

#### Strengths

- **Native performance:** ~58ms response vs 97ms VS Code
- **GPUI framework:** Custom GPU-accelerated UI
- **Multiplayer:** Real-time collaboration built-in
- **Zeta model:** Open-source prediction model
- **Atom/Tree-sitter pedigree:** From Atom creators

#### Why Not Recommended

- **GPL-3.0 license:** Copyleft requires derivative works to be GPL
- **Full editor scope:** Much more than an AI coding tool
- **Rust-only:** Higher barrier to extend
- **Overkill:** Building an editor when we need an AI assistant

---

### 7. Aider (Aider-AI/aider) - CLI Pioneer

**Repository:** https://github.com/Aider-AI/aider
**Stars:** 40,200 | **Forks:** 3,900 | **Contributors:** 165
**Language:** Python (80%) | **License:** Apache-2.0
**Last Commit:** Recent (v0.86.0+)

#### Strengths

- **Architect/Editor separation:** Innovative two-model approach
- **Codebase mapping:** Whole-repo understanding
- **100+ languages:** Broad language support
- **Benchmark leader:** 84.9% on polyglot test suite
- **Git integration:** Auto-commits with good messages

#### Why Not Primary Choice

- **Python codebase:** Less suitable for Electron desktop
- **CLI-only:** No desktop app, would need to wrap
- **No LSP integration:** Relies on AI for code intelligence

#### Best for CodeMAD

- Study Architect/Editor pattern for planning
- Learn codebase mapping approach

---

### 8. OpenHands (OpenHands/OpenHands) - Enterprise Scale

**Repository:** https://github.com/OpenHands/OpenHands
**Stars:** 67,300 | **Forks:** 8,400 | **Contributors:** 468
**Language:** Python (77.1%) | **License:** MIT
**Last Commit:** January 16, 2026

#### Strengths

- **Agent orchestration:** Coordinates multiple agents in parallel
- **SDK approach:** Composable Python library
- **Enterprise integrations:** Slack, Jira, Linear, GitHub, GitLab
- **Self-hosted option:** Kubernetes deployment
- **87% same-day bug resolution:** Strong automation metrics

#### Why Not Primary Choice

- **Python core:** Same desktop challenges as Aider
- **Cloud-first:** Designed for server deployment
- **Enterprise focus:** May be overengineered for desktop tool

#### Best for CodeMAD

- Study parallel agent orchestration
- Learn from SDK composability

---

### 9. Roo Code (RooCodeInc/Roo-Code) - Cline Fork

**Repository:** https://github.com/RooCodeInc/Roo-Code
**Stars:** 22,000 | **Forks:** 2,800 | **Contributors:** 291
**Language:** TypeScript (98.7%) | **License:** Apache-2.0
**Last Commit:** January 28, 2026

#### Strengths

- **Mode system:** Code, Architect, Ask, Debug modes
- **1M users:** Proven product-market fit
- **Active development:** 236 releases
- **Multi-IDE bridge:** JetBrains adapter
- **SOC2 compliant:** Enterprise-ready

#### Why Not Primary Choice

- **Cline derivative:** Better to study Cline directly
- **VS Code coupled:** Same extraction challenges
- **Smaller than Cline:** Less community momentum

---

## Feature Gap Analysis

### What CodeMAD Needs vs. What Exists

| Feature | OpenCode | Cline | Aider | Continue | Build Effort |
|---------|----------|-------|-------|----------|--------------|
| Desktop app | Yes | No | No | No | 0 weeks |
| Multi-LLM | Yes | Yes | Yes | Yes | 0 weeks |
| Chinese providers | Partial | Partial | Yes | Yes | 1-2 weeks |
| Vector embeddings | No | No | No | Continue uses LanceDB | 3-4 weeks |
| LSP integration | Yes | Via VS Code | No | Via IDE | 0 weeks |
| Git worktrees | No | No | No | No | 4-6 weeks |
| Per-hunk review | Partial | Partial | No | No | 3-4 weeks |
| GSD workflow | No | No | No | No | 6-8 weeks |
| Local-first privacy | Yes | Yes | Yes | Yes | 0 weeks |
| MCP tools | Yes | Yes | No | Yes | 0 weeks |

### Estimated Build Timeline (Post-Fork)

**Starting from OpenCode fork:**

| Phase | Features | Duration |
|-------|----------|----------|
| 1 | Fork, customize branding, add Chinese providers | 2-3 weeks |
| 2 | Add vector embeddings layer (LanceDB, aligns with STACK.md) | 3-4 weeks |
| 3 | Implement git worktree parallel execution | 4-6 weeks |
| 4 | Build per-hunk review UI | 3-4 weeks |
| 5 | Implement GSD workflow methodology | 6-8 weeks |
| 6 | Polish, testing, documentation | 4 weeks |

**Total:** ~22-29 weeks (5-7 months) to differentiated product

**Comparison - building from scratch (per STACK.md Tauri approach):** 12-18 months minimum

---

## Fork Strategy Recommendation

### Phase 1: Foundation (Weeks 1-3)

**Keep:**
- OpenCode's Electron desktop shell
- LLM provider abstraction layer
- Client/server architecture
- LSP integration
- MCP tool system
- Session management (SQLite)
- Git integration basics

**Customize:**
- Branding (CodeMAD identity)
- Default configuration
- Add Chinese LLM providers (Qwen, DeepSeek, Moonshot, Baichuan)

### Phase 2: Context Intelligence (Weeks 4-7)

**Add:**
- Vector embedding layer
  - Use LanceDB (aligns with STACK.md recommendation, zero infrastructure)
  - Integrate code embedding models (Jina v2, Voyage 3.5)
  - Implement semantic code search
- Enhanced LSP context gathering
- Automatic codebase indexing

**Replace:**
- Current context window management with intelligent retrieval

### Phase 3: Parallel Execution (Weeks 8-14)

**Add:**
- Git worktree management
  - Create/switch/merge worktrees
  - Isolated agent workspaces
- Parallel agent orchestration
  - Multiple agents on different branches
  - Progress tracking across worktrees
- Conflict detection and resolution UI

**Study:**
- Worktrunk CLI patterns
- OpenHands orchestration approach

### Phase 4: Code Review (Weeks 15-18)

**Add:**
- Per-hunk diff parsing
  - Parse `@@ -a,b +c,d @@` headers
  - Extract context lines
- Accept/reject per hunk UI
- Inline commenting
- Review session management

**Study:**
- CodeRabbit's line-level approach
- Cline's workspace snapshots

### Phase 5: GSD Methodology (Weeks 19-26)

**Add:**
- GSD workflow system
  - Project initialization flow
  - Milestone/phase structure
  - Research agent integration
  - Roadmap generation
- Planning mode with read-only constraints
- Task decomposition and tracking
- `.planning/` file conventions

**This is CodeMAD's core differentiator.** No existing tool has structured methodology.

### Phase 6: Polish (Weeks 27-30)

**Refine:**
- UX consistency
- Performance optimization
- Documentation
- Test coverage
- Privacy controls (data retention, telemetry opt-out)

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| OpenCode pivots direction | Low | Medium | Fork point preserves our version |
| Breaking upstream changes | Medium | Low | Selective cherry-picking |
| Community contribution conflicts | Low | Low | Clear CodeMAD branding |
| License change | Very Low | High | MIT locked at fork point |
| Electron performance issues | Medium | Medium | Consider Tauri migration later (per STACK.md) |

---

## Alternative Strategies Considered

### Option A: Cline extraction
**Rejected.** Too coupled to VS Code. Extraction would take longer than building desktop app around OpenCode.

### Option B: Goose fork
**Viable alternative.** Rust core is performant but harder to extend. Consider if TypeScript proves limiting.

### Option C: Build from scratch with Tauri
**Documented in STACK.md.** 12-18 month timeline but full control. Consider as v2 migration if fork proves limiting.

### Option D: Continue + Electron wrapper
**Possible.** Clean architecture but would need significant work to make standalone. OpenCode already solved this.

---

## Fork vs Build Decision Matrix

| Factor | Fork OpenCode | Build with Tauri |
|--------|---------------|------------------|
| Time to MVP | 5-7 months | 12-18 months |
| Control over architecture | Medium | Full |
| Performance | Electron (medium) | Tauri (excellent) |
| Bundle size | ~100MB | ~10MB |
| Memory usage | 150-300MB | 30-50MB |
| Dependency on upstream | Yes | No |
| Team ramp-up | Faster (familiar stack) | Slower (Rust learning) |
| Long-term flexibility | Limited by fork | Maximum |

**Recommendation:** Start with OpenCode fork to validate market, then evaluate Tauri migration for v2 if performance/size becomes critical.

---

## Final Recommendation

**Fork OpenCode (anomalyco/opencode)** as the foundation for CodeMAD v1.

**Rationale:**
1. MIT license provides maximum flexibility
2. Desktop app already exists and works
3. TypeScript codebase aligns with team skills
4. Largest community ensures ongoing improvements to cherry-pick
5. Client/server architecture enables future mobile/web expansion
6. Provider-agnostic design matches CodeMAD's multi-LLM requirement
7. LSP and MCP already integrated
8. ~6 months to differentiated product vs 12-18 months from scratch

**The gap to CodeMAD's vision is ~30% new features, not reimplementing the 70% that already exists.**

**Future consideration:** If Electron proves limiting (size, performance, memory), migrate to Tauri-based custom build using STACK.md patterns for v2.

---

## Sources

### Primary Candidates
- [OpenCode (anomalyco)](https://github.com/anomalyco/opencode)
- [Cline](https://github.com/cline/cline)
- [Aider](https://github.com/Aider-AI/aider)
- [Continue](https://github.com/continuedev/continue)
- [Void](https://github.com/voideditor/void)
- [Zed](https://github.com/zed-industries/zed)

### Additional Candidates
- [Goose (Block)](https://github.com/block/goose)
- [OpenHands](https://github.com/OpenHands/OpenHands)
- [Roo Code](https://github.com/RooCodeInc/Roo-Code)

### Technical Resources
- [Git Worktrees for AI Agents](https://medium.com/@mabd.dev/git-worktrees-the-secret-weapon-for-running-multiple-ai-coding-agents-in-parallel-e9046451eb96)
- [Worktrunk CLI](https://github.com/max-sixty/worktrunk)
- [CodeGrok MCP](https://hackernoon.com/codegrok-mcp-semantic-code-search-that-saves-ai-agents-10x-in-context-usage)
- [Cline Architecture Overview](https://deepwiki.com/cline/cline/1.3-architecture-overview)
- [Continue Architecture](https://deepwiki.com/continuedev/continue)
- [Per-Hunk Code Review Implementation](https://github.com/anomalyco/opencode/issues/9578)
- [Vector Embeddings Guide](https://dzone.com/articles/vector-embeddings-codebase-guide)
- [Jina Code Embeddings](https://huggingface.co/learn/cookbook/code_search)
- [LanceDB + Continue Integration](https://lancedb.com/blog/the-future-of-ai-native-development-is-local-inside-continues-lancedb-powered-evolution/)
