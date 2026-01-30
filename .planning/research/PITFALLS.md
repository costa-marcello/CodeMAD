# Domain Pitfalls: AI Development Platforms

**Domain:** Cross-platform AI development platform (desktop)
**Researched:** 2026-01-30
**Confidence:** HIGH (multiple verified sources from GitHub issues, forum complaints, and industry analyses)

---

## Critical Pitfalls

Mistakes that cause rewrites, data loss, or fundamental architecture changes.

---

### Pitfall 1: Context/Memory Amnesia Between Sessions

**What goes wrong:** Users lose all project context when starting new sessions. Every session feels like onboarding a "new hire" who knows nothing about the project.

**Why it happens:**
- No persistent storage layer for project context
- Over-reliance on LLM context window as the only memory
- Context compaction that discards critical project knowledge
- No mechanism to inject relevant history into new sessions

**Evidence:**
- [Claude Code Issue #2545](https://github.com/anthropics/claude-code/issues/2545): "Severe session memory loss - instructions and context not retained"
- [Claude Code Issue #14227](https://github.com/anthropics/claude-code/issues/14227): "Users paying $200/mo for a product we can't reliably use" due to zero context between sessions
- Multiple community tools created to solve this: claude-mem, claude-cognitive, SaveContext

**Consequences:**
- Users repeatedly explain the same project conventions
- AI makes "wrong" suggestions because it doesn't know architecture decisions
- Productivity loss re-establishing context every session
- User abandonment due to frustration

**Warning signs:**
- Users asking "Why did you forget X?"
- Repeated questions about project structure
- AI suggesting patterns that contradict prior decisions

**Prevention:**
1. **Persistent project state from Day 1** - SQLite database for project context, decisions, and conventions
2. **Structured memory injection** - On session start, automatically load: project conventions, recent decisions, active tasks
3. **Incremental context compression** - Compress old context but preserve key decisions and patterns
4. **Session continuity indicators** - Show users what context was loaded vs. what's new

**Phase relevance:** Core architecture (Phase 1). Building session memory as an afterthought requires rewriting the entire context management layer.

---

### Pitfall 2: Auto-Compaction Destroying Work Context

**What goes wrong:** Automatic context compaction triggers at wrong times, causing the AI to "forget" it was mid-task, deny making edits it just made, or lose track of the conversation.

**Why it happens:**
- Aggressive compaction thresholds (e.g., triggering at 65% context usage instead of 95%)
- No differentiation between "safe to compress" and "critical active context"
- Compaction running during active tasks instead of at natural breakpoints
- No preservation of "what I'm currently doing" state

**Evidence:**
- [OpenAI Codex Issue #5957](https://github.com/openai/codex/issues/5957): "Auto compaction causes GPT-5-Codex to lose the plot. It forgets it is mid-task, forgets it has edited files and stops."
- Claude Code changelog: "Fixed regression where context window blocking limit was calculated too aggressively, blocking users at ~65% context usage instead of ~98%"
- Reports of AI "fabricating false timelines" after compaction, confidently asserting false information

**Consequences:**
- Lost work mid-task
- AI denies making edits it just made
- User trust destruction
- Wasted tokens repeating context

**Warning signs:**
- AI suddenly "forgets" recent conversation
- AI denies knowledge of recent file edits
- Compaction triggering every few minutes during active work

**Prevention:**
1. **User-controlled compaction** - Never auto-compact during active tasks; offer manual trigger
2. **Task-aware compaction** - Preserve current task context as sacred; only compress completed work
3. **Edit history persistence** - Track file edits separately from conversation context
4. **Compaction preview** - Show users what will be compressed before doing it
5. **High threshold defaults** - Don't compact until 90%+ context usage

**Phase relevance:** Context management system (Phase 2). Must be designed correctly from the start; fixing post-launch breaks user trust.

---

### Pitfall 3: Provider Abstraction That Leaks

**What goes wrong:** Building a unified multi-provider interface that can't handle provider-specific quirks, leading to silent failures, inconsistent behavior, or broken features.

**Why it happens:**
- Underestimating provider differences (auth, response formats, hidden state)
- Not accounting for provider-specific features (tool calling, JSON modes, image inputs)
- Intermediary layers (OpenRouter, unified SDKs) masking important differences
- State synchronization issues between providers

**Evidence:**
- [OpenCode Issue #5674](https://github.com/anomalyco/opencode/issues/5674): Custom provider options not being passed to API calls
- [OpenCode Issue #10412](https://github.com/anomalyco/opencode/issues/10412): Abacus AI provider - "tool calls fail with all models, models output commands instead of executing"
- [OpenCode Issue #2724](https://github.com/sst/opencode/issues/2724): "No output in OpenCode with OpenAI-compatible Straico provider (tokens used, cURL works, UI empty)"
- [LiteLLM Issue #12367](https://github.com/BerriAI/litellm/issues/12367): OAuth2-based providers not supported without monkey-patching
- Analysis: "Different providers handle hidden context in different ways, and there's no common standard"

**Consequences:**
- Features work with some providers, silently fail with others
- Token usage without visible output
- Tool calling that outputs text instead of executing
- User confusion about which providers actually work

**Warning signs:**
- "Works with OpenAI but not with X" bug reports
- Silent failures (tokens consumed, no output)
- Inconsistent behavior between providers

**Prevention:**
1. **Provider-specific adapters** - Thin adapters for each provider's quirks, not one-size-fits-all
2. **Feature capability matrix** - Track which features work with which providers; disable unsupported features gracefully
3. **Explicit error surfacing** - Never swallow provider errors; always surface what went wrong
4. **Provider-specific testing** - Integration tests for each provider, not just unit tests against mocks
5. **Official SDKs when possible** - Use provider's official SDK rather than reimplementing; reduces maintenance burden

**Phase relevance:** Provider layer (Phase 2-3). Design the abstraction layer to expect quirks, not assume uniformity.

---

### Pitfall 4: Parallel Execution Without Conflict Resolution

**What goes wrong:** Multiple agents or worktrees editing the same files create merge conflicts, inconsistent state, or lost work that's impossible to recover.

**Why it happens:**
- Optimistic concurrency without conflict detection
- No file-level locking or change tracking
- Agents lack context about what other agents are doing
- Merge conflicts discovered too late (after significant work)

**Evidence:**
- Cognition AI blog ["Don't Build Multi-Agents"](https://cognition.ai/blog/dont-build-multi-agents): "Running multiple agents in collaboration only results in fragile systems"
- Research: "Coordination failures produce 'novel and under-appreciated risks' with emergent behaviors unpredictable from individual agent testing"
- Finding: "If Engineer A's code causes a merge conflict with Engineer B, the correct protocol is to talk out differences. Agents are not quite able to engage in this style of long-context proactive discourse."
- Token duplication: "Systems consume 1.5x to 7x more tokens than theoretically necessary due to redundant context sharing"

**Consequences:**
- Merge conflicts after hours of parallel work
- Lost work when conflicts can't be resolved
- Token waste from redundant context
- User confusion about which version is "correct"

**Warning signs:**
- Merge conflicts appearing after agent completion
- Agents touching the same files unknowingly
- Conflicting changes to shared dependencies

**Prevention:**
1. **File-level intent declaration** - Before editing, agents declare which files they'll touch; detect conflicts early
2. **Real-time conflict detection** - As agents work, monitor for overlapping changes
3. **Granular worktree isolation** - Each task in its own git worktree; merge only when task complete
4. **Conflict preview before merge** - Show predicted conflicts before attempting merge
5. **Human-in-the-loop for conflicts** - Never auto-resolve complex conflicts; surface to user
6. **Task decomposition guidance** - Guide users to create independent, non-overlapping tasks

**Phase relevance:** Parallel execution system (Phase 3-4). This is CodeMAD's differentiator - get it wrong and the core value prop fails.

---

### Pitfall 5: Diff/Review UX That Breaks Workflow

**What goes wrong:** Code review UI that interrupts flow, hides important context, or makes accepting/rejecting changes painful.

**Why it happens:**
- All-or-nothing accept/reject (no granular per-hunk control)
- Review UI that removes file context (can't see surrounding code)
- Accept/reject buttons that disappear, move, or don't respond
- Diff view that locks the file, preventing manual edits
- Review state that persists incorrectly after accepting

**Evidence:**
- [Cursor Forum](https://forum.cursor.com/t/review-mode-missing-accept-reject-diff-buttons/146198): "All my files appearing as edited while no differences highlighted and no controls to accept/reject"
- [Cursor Forum](https://forum.cursor.com/t/i-dont-like-the-new-cursor-diff-view/145154): "It goes to diff view instead of the file itself. The whole point of seeing changes is to accept, see surrounding context, then make edits if necessary."
- [Cursor Forum](https://forum.cursor.com/t/partial-accept-reject-not-working-in-mdc-diff-view/106292): "Inline Accept and Reject buttons do not respond to clicks. Only global Accept File and Reject File work."
- [Cursor Forum](https://forum.cursor.com/t/bug-ux-report-pending-changes-bar-moved-to-an-awkward-top-right-position/138965): "The floating 'pending changes' review bar moved to top-right corner. This made the interface significantly more annoying."

**Consequences:**
- Users accepting all changes because granular review is too painful
- Lost context when reviewing changes
- Manual edits impossible during review
- Broken trust in code review quality

**Warning signs:**
- Users skipping review entirely
- "Accept all" becoming the default workflow
- Complaints about review UI position or behavior

**Prevention:**
1. **Per-hunk accept/reject** - Always support granular decisions; never force all-or-nothing
2. **Inline editing during review** - Allow manual edits without leaving review mode
3. **Context preservation** - Show surrounding code, not just the diff
4. **Stable UI position** - Keep review controls in consistent, predictable location
5. **Three-way merge view** - Show original, AI changes, and result simultaneously
6. **Review state cleanup** - Clear review mode after accepting; don't leave files in limbo
7. **Keyboard shortcuts** - Power users need fast navigation (j/k, y/n, etc.)

**Phase relevance:** Code review UI (Phase 4-5). Per-hunk review is a core CodeMAD differentiator - this must be excellent.

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or significant user frustration.

---

### Pitfall 6: Memory Leaks and Resource Exhaustion

**What goes wrong:** Application becomes sluggish or crashes after extended use, requiring frequent restarts.

**Why it happens:**
- Stream resources not cleaned up after shell commands
- Accumulated conversation context weighing down memory
- Extension/plugin memory not properly released
- Long-running processes without garbage collection

**Evidence:**
- [Cursor Forum](https://forum.cursor.com/t/cursor-becomes-ridiculously-slow-after-a-few-hours-of-usage/148505): "No other way than to close the app and start it again - and then it's fine again. 2-3 times per day."
- [Cline Issue #1574](https://github.com/cline/cline/issues/1574): "Extension causes high CPU load"
- [Cline Issue #5289](https://github.com/cline/cline/issues/5289): "Cline extension becomes unresponsive (grayed out) requiring VS Code restart - frequency increasing over time"
- Claude Code changelog: "Fixed memory leak in long-running sessions where stream resources were not cleaned up after shell commands completed"

**Prevention:**
1. **Memory profiling in CI** - Automated tests that detect memory growth over time
2. **Resource cleanup in finally blocks** - Always release streams, connections, subprocesses
3. **Conversation trimming** - Actively manage conversation history size
4. **Health monitoring** - Track memory usage and warn users before critical threshold
5. **Graceful degradation** - Offer "clear session" option before crash

**Phase relevance:** Core infrastructure (Phase 1-2). Memory management is hard to retrofit.

---

### Pitfall 7: Slow Startup and Initialization

**What goes wrong:** Application takes minutes to become usable, especially after updates or with large projects.

**Why it happens:**
- Synchronous initialization blocking UI
- Full codebase indexing on every startup
- Extension/plugin initialization not parallelized
- No caching of expensive computations

**Evidence:**
- [Cline Issue #6622](https://github.com/cline/cline/issues/6622): "Cline takes 5-15+ minutes to become ready after VS Code startup"
- [Cline Issue #3888](https://github.com/cline/cline/issues/3888): "Cline not opening: infinite load"
- Reports of working with large codebases causing memory limits to be reached

**Prevention:**
1. **Lazy initialization** - Load only what's needed for immediate use; defer the rest
2. **Background indexing** - Index in background; don't block UI
3. **Persistent indexes** - Cache indexes across sessions; only update changed files
4. **Progressive loading indicators** - Show what's loading and why
5. **Fast-path for small projects** - Skip heavy initialization for simple use cases

**Phase relevance:** Application shell (Phase 1). Architecture decision that's expensive to change.

---

### Pitfall 8: Tool/File Editing Failures

**What goes wrong:** AI tool calls fail silently, edit the wrong file, make incomplete changes, or operate on stale file content.

**Why it happens:**
- Operating on cached/stale file content
- Multiple similar code sections causing edit location confusion
- Tool output that looks successful but actually failed
- Context window overflow causing truncated edits

**Evidence:**
- [Cline Issue #4011](https://github.com/cline/cline/issues/4011): "replace_in_file tool consistently failing after recent update - 'could not find matching SEARCH block'"
- [OpenAI Codex Issue #2064](https://github.com/openai/codex/issues/2064): "Local models use fake tool invocation - uses apply_patch which 'is not a real CLI command'"
- Analysis: "Cascading bugs from small changes. A tiny change would somehow break half the application. Fixing one bug would create three new ones."
- IEEE finding: "GPT-5 generates code that fails to perform as intended but seems to run successfully, avoiding syntax errors by removing safety checks or creating fake output"

**Prevention:**
1. **Fresh file reads before edits** - Always re-read file immediately before editing
2. **Edit verification** - After edit, verify the change was applied correctly
3. **Unique edit anchors** - Use line numbers + content hashes for precise targeting
4. **Rollback capability** - Every edit creates a revertible checkpoint
5. **Tool output validation** - Don't trust "success" responses; verify actual changes
6. **Explicit failure modes** - Tool calls should fail loudly, not silently

**Phase relevance:** Tool system (Phase 2-3). Core to reliability; must be robust from start.

---

### Pitfall 9: Token Cost Spiral

**What goes wrong:** Costs spiral out of control as agentic workflows consume 10-100x expected tokens.

**Why it happens:**
- No visibility into token usage until bill arrives
- Reasoning/thinking tokens billed as expensive output tokens
- Redundant context in multi-agent systems (1.5-7x overhead)
- No budget limits or alerts

**Evidence:**
- Analysis: "85% of organizations misestimate AI costs by more than 10%, and nearly a quarter are off by 50% or more"
- Finding: "Token consumption per task jumped 10x-100x since December 2023" due to agentic workflows
- Reddit case: "User spending 9.5 billion tokens in one month; optimized prompts reduced costs by 70%"
- Analysis: "Reasoning tokens are billed as output tokens, directly inflating your output costs"

**Prevention:**
1. **Real-time cost display** - Show token usage and estimated cost during conversation
2. **Budget alerts** - 50/80/100% threshold warnings
3. **Model tier suggestions** - Recommend cheaper models when task doesn't need frontier
4. **Prompt compression** - Automatically compress repetitive context
5. **Cost attribution** - Show which operations consumed the most tokens
6. **Hard budget limits** - Option to stop when budget exhausted (not just warn)

**Phase relevance:** Provider integration (Phase 2-3). Easier to add early than retrofit.

---

### Pitfall 10: OAuth/Authentication Fragility

**What goes wrong:** Authentication flows break, sessions expire unexpectedly, or token refresh fails silently.

**Why it happens:**
- OAuth flows designed for humans (browser redirects) not headless agents
- Each provider implements auth differently (x-api-key vs. Bearer vs. custom headers)
- Session state stored only in memory (lost on restart)
- Token refresh not handled properly

**Evidence:**
- Analysis: "Modern identity protocols like OAuth 2.0 were built with web/mobile apps in mind, not autonomous agents. OAuth 'redirect to browser' process is awkward for agent systems."
- [LiteLLM Issue](https://github.com/BerriAI/litellm/issues/12367): "LiteLLM does not support OAuth2 natively unless you inject a custom client"
- Finding: "Each major LLM provider implements authentication differently... Claude uses x-api-key headers, Gemini uses x-goog-api-key with Google Cloud integration"
- MCP spec compliance issues documented with OAuth 2.1 token binding

**Prevention:**
1. **Persistent token storage** - Securely persist tokens across sessions
2. **Background token refresh** - Refresh before expiry, not after failure
3. **Provider-specific auth adapters** - Don't assume uniform auth patterns
4. **Graceful degradation** - Clear error messages when auth fails; easy re-auth flow
5. **API key fallback** - Support simple API keys alongside OAuth
6. **Auth state visibility** - Show users which providers are authenticated and expiry times

**Phase relevance:** Provider authentication (Phase 2). Authentication is foundational; hard to change later.

---

## Minor Pitfalls

Mistakes that cause annoyance but are recoverable.

---

### Pitfall 11: Git Worktree Setup Friction

**What goes wrong:** Each worktree requires manual setup (npm install, env files, etc.), creating overhead that discourages parallel work.

**Prevention:**
1. **Setup script automation** - Auto-run project setup in new worktrees
2. **Shared node_modules** - Use pnpm or symlinks where possible
3. **Worktree templates** - Pre-configure common settings
4. **One-click worktree creation** - UI button instead of terminal commands

**Phase relevance:** Worktree management (Phase 3-4).

---

### Pitfall 12: Remote Development Performance

**What goes wrong:** Tools become unusably slow over SSH or remote development due to network latency.

**Evidence:**
- [Cline Issue #6328](https://github.com/cline/cline/issues/6328): "Extremely slow thinking-content update under VS Code Remote Development with moderate network latency"

**Prevention:**
1. **Local-first architecture** - Core operations shouldn't require round-trips
2. **Batched operations** - Combine multiple small operations
3. **Stream buffering** - Don't flush every token over the network

**Phase relevance:** Architecture (Phase 1). Fundamental design decision.

---

### Pitfall 13: Extension Crashes Affecting Host

**What goes wrong:** AI tool crashes take down the entire editor or IDE.

**Evidence:**
- [Cline Issue #3084](https://github.com/cline/cline/issues/3084): "Cline crashes VS Code extension server"

**Prevention:**
1. **Process isolation** - AI operations in separate process
2. **Crash recovery** - Auto-restart without losing state
3. **Graceful degradation** - Failure doesn't break basic editing

**Phase relevance:** Desktop architecture (Phase 1). Process model decision.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation | Priority |
|-------------|---------------|------------|----------|
| **Core Architecture** | Memory leaks, slow startup | Memory profiling, lazy init | HIGH |
| **Context System** | Amnesia, aggressive compaction | Persistent state, user-controlled compaction | CRITICAL |
| **Provider Layer** | Leaky abstraction, auth fragility | Provider-specific adapters, robust auth | HIGH |
| **Parallel Execution** | Merge conflicts, lost work | Intent declaration, conflict detection | CRITICAL |
| **Code Review UI** | All-or-nothing review, broken controls | Per-hunk control, stable UI | HIGH |
| **Cost Management** | Surprise bills, token spiral | Real-time display, budget limits | MEDIUM |
| **Tool Reliability** | Silent failures, wrong edits | Verification, rollback | HIGH |

---

## Anti-Patterns Summary

| Don't | Do Instead | Why |
|-------|-----------|-----|
| Rely on LLM context as only memory | Persistent SQLite + context injection | Sessions end; memory should persist |
| Auto-compact during active tasks | User-controlled, task-aware compaction | Loses work, destroys trust |
| One abstraction for all providers | Provider-specific thin adapters | Providers differ; abstraction leaks |
| Optimistic parallel execution | File-level conflict detection | Merge conflicts after hours of work |
| All-or-nothing code review | Per-hunk accept/reject | Users skip review entirely |
| Silent tool failures | Explicit verification and errors | Users don't know what went wrong |
| No cost visibility | Real-time token/cost display | Surprise bills kill adoption |

---

## Sources

### GitHub Issues
- [Claude Code #2545 - Session Memory Loss](https://github.com/anthropics/claude-code/issues/2545)
- [Claude Code #14227 - Persistent Memory Request](https://github.com/anthropics/claude-code/issues/14227)
- [Claude Code #5771 - CPU/Memory Resources](https://github.com/anthropics/claude-code/issues/5771)
- [OpenAI Codex #5957 - Auto-compaction Losing Context](https://github.com/openai/codex/issues/5957)
- [OpenCode #5674 - Provider Options Bug](https://github.com/anomalyco/opencode/issues/5674)
- [OpenCode #10412 - Tool Call Failures](https://github.com/anomalyco/opencode/issues/10412)
- [Cline #1574 - High CPU](https://github.com/cline/cline/issues/1574)
- [Cline #6622 - Slow Startup](https://github.com/cline/cline/issues/6622)
- [Cline #4011 - File Edit Failures](https://github.com/cline/cline/issues/4011)
- [LiteLLM #12367 - OAuth2 Support](https://github.com/BerriAI/litellm/issues/12367)

### Forum Threads
- [Cursor Forum - Review Mode Bugs](https://forum.cursor.com/t/review-mode-missing-accept-reject-diff-buttons/146198)
- [Cursor Forum - Diff View UX](https://forum.cursor.com/t/i-dont-like-the-new-cursor-diff-view/145154)
- [Cursor Forum - Performance Degradation](https://forum.cursor.com/t/performance-degradation-and-ai-editing-issues-in-cursor-ide/61928)
- [Cursor Forum - Slow After Hours](https://forum.cursor.com/t/cursor-becomes-ridiculously-slow-after-a-few-hours-of-usage/148505)

### Industry Analysis
- [Cognition AI - Don't Build Multi-Agents](https://cognition.ai/blog/dont-build-multi-agents)
- [IEEE Spectrum - AI Coding Degrades](https://spectrum.ieee.org/ai-coding-degrades)
- [Pete Hodgson - Why Your AI Coding Assistant Keeps Doing It Wrong](https://blog.thepete.net/blog/2025/05/22/why-your-ai-coding-assistant-keeps-doing-it-wrong-and-how-to-fix-it/)
- [Armin Ronacher - LLM APIs are a Synchronization Problem](https://lucumr.pocoo.org/2025/11/22/llm-apis/)
- [Requesty - Switching LLM Providers](https://www.requesty.ai/blog/switching-llm-providers-why-it-s-harder-than-it-seems)
- [GetDX - Total Cost of AI Coding Tools](https://getdx.com/blog/ai-coding-tools-implementation-cost/)
- [Skywork - AI API Cost Throughput](https://skywork.ai/blog/ai-api-cost-throughput-pricing-token-math-budgets-2025/)

### Community Solutions
- [claude-mem - Persistent Memory Plugin](https://github.com/thedotmack/claude-mem)
- [SaveContext - MCP Server for Persistence](https://github.com/greenfieldlabs-inc/savecontext)
- [Crystal - Electron AI Tool with SQLite](https://deepwiki.com/stravu/crystal)
