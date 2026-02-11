# Phase Orchestration Design

**Date:** 2026-02-11
**Author:** Costa + Claude
**Status:** Design proposal (pre-architecture)
**Input:** Product Brief, BMAD workflows, technical research, brainstorming session

---

## Purpose

This document defines how CodeMAD's four protocol phases operate as independent orchestration surfaces, each with its own system prompt, sub-agents, and UI context. The goal is to maximise quality and parallelism while keeping the user experience focused: one phase at a time, one clear output per phase, and a clean separation between planning and implementation.

The core insight: each phase is not an "agent" but a **mode** the application enters. When the user clicks Phase 1, the entire application personality changes. The system prompt, the available sub-agents, the UI layout, and the expected output all shift to serve that phase's single purpose.

---

## Design Principles

1. **One phase, one output.** Each phase produces exactly one canonical document. Intermediate artifacts (brainstorming notes, research files) are working memory that gets consumed and deleted when the output is validated.

2. **Per-phase orchestration, not global orchestrator.** Each phase has its own orchestrator. There is no single orchestrator sitting above all four phases. This avoids a context window that tries to hold the entire project in memory.

3. **Single protocol interface with phase tabs, plus a free chat.** The user sees one interface with navigation buttons for each phase. Clicking a phase changes the system behaviour (orchestrator, sub-agents, personality). A separate free chat exists for users who want unstructured AI assistance without the protocol.

4. **Sub-agents do the heavy work. The phase orchestrator coordinates.** The orchestrator for each phase never writes the output document directly. It spawns sub-agents for research, drafting, and validation, then synthesises their results.

5. **Validation is mandatory and automatic.** Every phase output runs through a validation sub-agent before the phase is considered complete. The user cannot advance to the next phase until validation passes.

6. **Intermediate artifacts are temporary.** Brainstorming notes, research documents, and draft versions exist only to feed the canonical output. Once the output is validated, intermediate artifacts are deleted automatically.

---

## Architecture: Why Per-Phase Orchestrators

The original four-tier hierarchy (Orchestrator > Phase > Specialist > Researcher) assumed a global orchestrator coordinating all phases. This design replaces the global orchestrator with per-phase orchestrators for three reasons.

**Reason 1: Context window budget.** A global orchestrator must hold awareness of all four phases, all artifacts, and all agent states. That exceeds the 120k soft target and forces aggressive compression. A per-phase orchestrator only needs to know its own phase's context: the input document(s) and the output being produced.

**Reason 2: No nested sub-agents.** Current LLM agent frameworks (Claude Code included) do not support sub-agents that themselves spawn sub-agents. A global orchestrator spawning a phase agent that spawns a researcher is three levels deep. Per-phase orchestrators flatten this to two levels: orchestrator spawns sub-agents. This works today.

**Reason 3: Clean phase transitions.** When Phase 1 completes, its orchestrator shuts down and its context is released. Phase 2 starts fresh with only the validated output from Phase 1 as input. No context bleed between phases. No stale state. Each phase reads the previous phase's output document, not the previous phase's conversation history.

The trade-off: no global orchestrator means no single agent with awareness of the full project lifecycle. The application itself (the Bun sidecar) manages phase transitions, stores phase state, and enforces the phase sequence. The orchestration of the protocol is application logic, not agent logic.

---

## Phase Overview

| Phase | Name | Input | Output | Intermediate Artifacts | UI Surface |
|-------|------|-------|--------|----------------------|------------|
| 1 | Analysis | User's idea | Product Brief | Brainstorming notes, research documents | Protocol chat (Phase 1 tab) |
| 2 | Planning | Product Brief | PRD + UX Design (optional) | Draft PRD, draft UX, consistency reports | Protocol chat (Phase 2 tab) |
| 3 | Solutioning | PRD + UX Design | Architecture + Epics | Draft architecture, verification reports, readiness report | Protocol chat (Phase 3 tab) |
| 4 | Implementation | Architecture + Epics | Working code | Sprint status, story files, code review reports | Protocol chat (Phase 4 tab) |

---

## Phase 1: Analysis

### Purpose

Transform a vague idea into a validated Product Brief.

### System Prompt Personality

The app enters **analyst mode**. The system prompt positions the AI as a strategic analyst and facilitator. It asks questions, challenges assumptions, and guides the user through structured exploration. It does not generate solutions. It draws solutions out of the user. The orchestrator acts as a gatekeeper, ensuring guardrails are followed and edge cases are explored before passing context to researcher sub-agents.

### Workflow

```
User clicks "Phase 1: Analysis"
    |
    v
[Brainstorming Session] -- INTERACTIVE, always requires user input
    |                       Techniques: question storming, morphological
    |                       analysis, SCAMPER, chaos engineering
    |                       Output: brainstorming-session.md (temporary)
    |
    v
[Research Sub-agents] -- AUTOMATIC, no user input needed
    |                     Spawns 2-3 parallel researchers:
    |                     - Market research
    |                     - Domain/competitive research
    |                     - Technical research (if tech decisions needed)
    |                     Output: research documents (temporary)
    |
    v
[Product Brief Drafter] -- AUTOMATIC
    |                       Reads brainstorming + research
    |                       Produces product-brief.md
    |
    v
[Validation Sub-agent] -- AUTOMATIC
    |                      Checks: Does the brief contain everything
    |                      from brainstorming? Are research findings
    |                      incorporated? Any inconsistencies?
    |                      Checks: Coverage, measurability, traceability
    |
    v
[A/P/C Checkpoint] -- INTERACTIVE
    |                    Orchestrator presents the Product Brief
    |                    User chooses: Continue / Party Mode /
    |                    Advanced Elicitation
    |                    Loop until user chooses Continue
    |
    v
[Validation Sub-agent] -- AUTOMATIC
    |                      Checks: coverage, measurability,
    |                      traceability, completeness against
    |                      brainstorming + research
    |
    v
[Cleanup] -- AUTOMATIC
             Brainstorming notes deleted
             Research documents deleted
             Product Brief is the sole surviving artifact
```

### Sub-Agent Roster

| Sub-Agent | Type | Spawned By | Purpose |
|-----------|------|-----------|---------|
| Brainstorming Facilitator | Phase Orchestrator itself | N/A | Runs the interactive brainstorming (this is the orchestrator's direct role) |
| Market Researcher | Researcher | Orchestrator | Investigate market size, competitors, trends |
| Domain Researcher | Researcher | Orchestrator | Investigate industry, regulatory, technical landscape |
| Technical Researcher | Researcher | Orchestrator | Evaluate tech stack options (only if needed) |
| Brief Drafter | Specialist | Orchestrator | Synthesise brainstorming + research into Product Brief |
| Brief Validator | Specialist | Orchestrator | Validate brief for completeness, consistency, coverage |

### Key Design Decisions

**Brainstorming is always interactive.** The user must participate. This is not a phase the AI can complete alone. The facilitation techniques (question storming, SCAMPER, chaos engineering) require human input to produce meaningful results. The first wow moment for the user is seeing their vague idea turn into a structured plan.

**Research is always automatic.** After brainstorming captures the user's intent, researcher sub-agents run in parallel without user input. The user watches researchers work (visible in the Phase 1 chat) but does not need to guide them.

**Intermediate artifacts are consumed and deleted.** The brainstorming notes and research documents exist solely to feed the Product Brief drafter. Once the Product Brief is validated, these files are removed. The Product Brief is the canonical output. If the user needs to revisit research findings, those findings are embedded in the brief itself.

**Validation checks for completeness against source material.** The validator does not just check the brief's internal consistency. It cross-references against the brainstorming session (were all key decisions captured?) and the research (were all findings incorporated?). This prevents the brief from silently dropping important discoveries.

---

## Phase 2: Planning

### Purpose

Transform the Product Brief into implementation-ready requirements and (optionally) a UX design.

### System Prompt Personality

The app enters **specification mode**. The system prompt positions the AI as a product manager. It is precise, detail-oriented, and focused on turning vision into measurable requirements. It pushes for specificity: "what happens when the user clicks this button?" rather than "the user can manage their settings." The orchestrator spawns a separate UX/UI Designer sub-agent for visual and interaction design.

### Workflow

```
User clicks "Phase 2: Planning"
    |
    v
[Load Product Brief] -- AUTOMATIC
    |                    Reads the validated Product Brief from Phase 1
    |
    v
[User Choice] -- INTERACTIVE
    |              "Do you need a UX design?" Yes / No
    |
    +--[No]--> [PRD Drafter] -- mostly AUTOMATIC, light user input
    |              |             Reads Product Brief
    |              |             Produces prd.md
    |              |             May ask user clarifying questions
    |              v
    |          [A/P/C Checkpoint: PRD] -- INTERACTIVE
    |              |                       Continue / Party Mode /
    |              |                       Advanced Elicitation
    |              v
    |          [PRD Validator] -- AUTOMATIC
    |              |               13-step validation
    |              v
    |          [Phase Complete]
    |
    +--[Yes]--> [PRD Drafter] -- mostly AUTOMATIC (PRD first by default)
                   |              Reads Product Brief
                   |              Produces prd.md
                   v
                [A/P/C Checkpoint: PRD] -- INTERACTIVE
                   |
                   v
                [UX/UI Designer] -- mostly AUTOMATIC
                   |                 Reads Product Brief + PRD
                   |                 Produces ux-design.md
                   v
                [A/P/C Checkpoint: UX/UI] -- INTERACTIVE
                   |
                   v
                [PRD Validator] -- AUTOMATIC
                   |               Validates PRD independently
                   v
                [UX/UI Validator] -- AUTOMATIC
                   |                  Validates UX design independently
                   v
                [Consistency Checker] -- AUTOMATIC
                   |                     Cross-references PRD and UX:
                   |                     - Every PRD requirement has a
                   |                       corresponding UX element
                   |                     - Every UX interaction maps to
                   |                       a PRD requirement
                   |                     - No contradictions between them
                   |                     Max 2 correction cycles
                   v
                [Phase Complete]
```

### Sub-Agent Roster

| Sub-Agent | Type | Spawned By | Purpose |
|-----------|------|-----------|---------|
| PRD Drafter | Specialist | Orchestrator | Create PRD from Product Brief |
| UX/UI Designer | Specialist | Orchestrator | Create UX and UI Design from Product Brief |
| PRD Validator | Specialist | Orchestrator | 13-step PRD validation |
| UX/UI Validator | Specialist | Orchestrator | UX/UI completeness and quality check |
| Consistency Checker | Specialist | Orchestrator | Cross-reference PRD against UX Design |

### Key Design Decisions

**PRD before UX by default.** The PRD is created first because the UX/UI Designer references PRD requirements to ensure every interaction maps to a requirement. Users can run them in parallel if they prefer, but sequential is the default because it produces better-aligned outputs.

**The consistency checker is the critical sub-agent.** The PRD and UX design must be perfectly aligned before Phase 3 begins. Every button described in the UX must map to a requirement in the PRD. Every user flow in the PRD must have a corresponding UX design. If the consistency check finds issues, the orchestrator routes fixes to the right sub-agent: PRD issues go to the PRD Drafter, UX issues go to the UX/UI Designer. After fixes, the consistency check re-runs automatically. Maximum 2 correction cycles -- after the second failure, the orchestrator escalates to the user for manual review.

**UX design is optional.** Not all projects need a UX design (CLIs, libraries, APIs). The user chooses. If skipped, only the PRD is produced and validated.

**No intermediate artifacts to delete.** Unlike Phase 1, the outputs of Phase 2 (PRD and UX Design) are both canonical and persist. There are no temporary working files to clean up.

---

## Phase 3: Solutioning

### Purpose

Transform the PRD and UX Design into an architecture document and implementable epics with stories.

### System Prompt Personality

The app enters **architect mode**. The system prompt positions the AI as a senior software architect. It is research-heavy, opinionated about patterns, and focused on making decisions that will survive implementation. Every technology choice, every pattern, every structural decision is backed by current research.

### Workflow

```
User clicks "Phase 3: Solutioning"
    |
    v
[Load PRD + UX Design] -- AUTOMATIC
    |                      Reads both validated documents from Phase 2
    |
    v
[Architecture Creation] -- INTERACTIVE (most research-intensive step)
    |                       Orchestrator drives architecture decisions
    |                       with user input
    |
    |   Spawns parallel researchers:
    |   +-- [Tech Researcher] -- Current patterns, libraries, versions
    |   +-- [Security Researcher] -- OWASP, SLSA, vulnerability patterns
    |   +-- [Integration Researcher] -- API patterns, third-party services
    |
    |   Research feeds back into architecture decisions
    |   User confirms or overrides each major decision
    |   Output: architecture.md
    |
    v
[A/P/C Checkpoint: Architecture] -- INTERACTIVE
    |                                 Continue / Party Mode /
    |                                 Advanced Elicitation
    |
    v
[Architecture Validator] -- AUTOMATIC
    |                        Cross-references against PRD + UX
    |                        Max 2 correction cycles
    |
    v
[Epic & Story Creator] -- AUTOMATIC with user confirmation
    |                      Reads architecture + PRD + UX
    |                      Creates epics.md with:
    |                      - Vertical-slice story structure
    |                      - Dependency ordering
    |                      - Acceptance criteria per story
    |
    v
[A/P/C Checkpoint: Epics/Stories] -- INTERACTIVE
    |                                  Continue / Party Mode /
    |                                  Advanced Elicitation
    |
    v
[Implementation Readiness Check] -- AUTOMATIC
    |                                Final cross-artifact consistency
    |                                Brief -> PRD -> UX -> Architecture
    |                                  -> Epics all aligned
    |                                Max 2 correction cycles
    |                                Output: readiness-report.md
    |
    v
[Pre-flight Checklist] -- INTERACTIVE (advisory, not blocking)
    |                      Green/yellow/red items shown
    |                      User can proceed with warnings
    |
    v
[Phase Complete]
    |
    [Cleanup] -- AUTOMATIC
                 Readiness report deleted (consumed)
                 Architecture and Epics survive as canonical artifacts
```

### Sub-Agent Roster

| Sub-Agent | Type | Spawned By | Purpose |
|-----------|------|-----------|---------|
| Tech Researcher | Researcher | Orchestrator | Current patterns, library versions, best practices |
| Security Researcher | Researcher | Orchestrator | OWASP, vulnerability patterns, SLSA compliance |
| Integration Researcher | Researcher | Orchestrator | API patterns, third-party service integration |
| Architecture Validator | Specialist | Orchestrator | Cross-reference architecture against PRD + UX |
| Epic Creator | Specialist | Orchestrator | Break architecture into implementable epics/stories |
| Readiness Checker | Specialist | Orchestrator | Final cross-artifact consistency validation |

### Key Design Decisions

**Architecture creation is the most research-intensive step in the protocol.** This is where Context7 (real-time library docs) and Semgrep (security scanning) run automatically via MCP. The orchestrator spawns researchers in parallel to verify that every technology choice uses current APIs and patterns. Wrong decisions here cascade through every story and every file.

**Sprint planning and story elaboration move into Phase 3.** The original BMAD workflow placed sprint planning in Phase 4. This design moves it here because sprint planning and story creation are planning activities, not implementation activities. Phase 3 (the last planning phase) should handle all planning. Phase 4 should handle only building.

**Architecture verification is automatic.** After the Architect finishes, the orchestrator spawns a validator to cross-reference the architecture against the PRD and UX. If verification fails, the orchestrator spawns the Architect with the verification report for corrections. Maximum 2 correction cycles -- after the second failure, the orchestrator escalates to the user.

**The readiness check is the final gate.** It validates the entire chain: Product Brief to PRD to UX to Architecture to Epics. If any link is broken (a requirement in the PRD has no story, a UX interaction has no architectural support), the readiness check catches it. If the readiness check fails, the orchestrator reads the report and routes fixes to the right sub-agent: architecture issues go to the Architect, epic/story issues go to the Epic Creator. If both are affected, the Architect runs first (because architecture changes affect stories), then the Epic Creator. After fixes, the readiness check re-runs automatically. Maximum 2 correction cycles -- after the second failure, the orchestrator escalates to the user.

---

## Phase 4: Implementation

### Purpose

Build working code from the validated architecture and stories.

### System Prompt Personality

The app enters **team lead mode**. The system prompt positions the AI as a senior team lead who coordinates Story Developers but does not write code directly. It is precise, disciplined, and focused on shipping code that passes quality gates. It follows the architecture document exactly. It does not make architectural decisions -- those were made in Phase 3. When architecture changes are needed, it spawns an Architect sub-agent rather than editing planning artifacts itself.

### UI Surface Change

**The Phase 4 tab has a different layout from Phases 1-3.** When the user clicks the Phase 4 tab, the chat panel remains but the surrounding UI changes: a sprint board shows story status (backlog, in-progress, review, done), agent activity streams show one per active worktree, and code diffs and quality gate results appear inline. The planning artifacts (Product Brief, PRD, UX Design, Architecture, Epics) are accessible in the sidebar as read-only references.

### Workflow

```
User clicks "Phase 4: Implementation"
    |
    v
[Load Architecture + Epics] -- AUTOMATIC
    |                           Reads validated documents from Phase 3
    |
    v
[Phase 4 Orchestrator] -- coordinates all implementation work
    |
    +-- For each story (or parallel batch of stories):
    |
    |   [Story Elaborator] -- AUTOMATIC
    |       |                  Reads story from epics.md
    |       |                  Reads architecture for tech context
    |       |                  Reads previous story learnings
    |       |                  Produces detailed story file with
    |       |                  dev notes, tasks, acceptance criteria
    |       v
    |   [Story Validator] -- AUTOMATIC
    |       |                 Quality competition: fresh context
    |       |                 reviews story for gaps, missing specs,
    |       |                 wrong libraries, regression risks
    |       v
    |   [Story Developer(s)] -- AUTOMATIC (up to 3 in parallel by default)
    |       |                    Each in its own git worktree
    |       |                    Builds one story end-to-end (backend + frontend + tests)
    |       |                    Follows story file as its only spec
    |       v
    |   [Quality Gates] -- AUTOMATIC per story
    |       |               1. Lint (Biome)
    |       |               2. Type check (tsc/cargo check)
    |       |               3. Build (Turborepo/cargo build)
    |       |               4. Tests (Vitest/cargo test)
    |       |               5. Security scan (Semgrep)
    |       v
    |   [Code Reviewer] -- AUTOMATIC
    |       |               Fresh context, different model recommended
    |       |               Reviews against story acceptance criteria
    |       |               Builder-validator pattern: if review fails,
    |       |               developer agent iterates
    |       v
    |   [Story Complete] -- developer agent merges worktree
    |
    +-- After all stories in an epic:
    |
    |   [Epic Retrospective] -- AUTOMATIC
    |       |                    Captures lessons learned
    |       |                    Stores in cross-session memory (LanceDB)
    |       |                    Future agents read these lessons
    |       v
    |   [Course Correction] -- if needed, routed by scope:
    |       |                    Minor: SM updates story files
    |       |                    Moderate: PM updates epics/stories
    |       |                      -> auto readiness re-check
    |       |                    Major: Architect updates architecture
    |       |                      -> PM updates epics/stories
    |       |                      -> auto readiness re-check
    |       |                    Max 2 cycles, then escalate to user
    |
    v
[Implementation Complete]
```

### Sub-Agent Roster

| Sub-Agent | Type | Spawned By | Purpose |
|-----------|------|-----------|---------|
| Story Elaborator | Specialist | Orchestrator | Expand epic story into detailed implementation spec |
| Story Validator | Specialist | Orchestrator | Quality check on elaborated story (competition pattern) |
| Story Developer (x N) | Specialist | Orchestrator | Implement one story end-to-end (backend + frontend + tests) in isolated worktree |
| Quality Gate Runner | Specialist | Orchestrator | Run lint, type check, build, test, security scan |
| Code Reviewer | Specialist | Orchestrator | Review code against story acceptance criteria |
| Architect (course correction) | Specialist | Orchestrator | Update architecture.md when implementation reveals design flaws |
| PM (course correction) | Specialist | Orchestrator | Update PRD sections, epics, and stories when implementation reveals planning gaps |
| SM (course correction) | Specialist | Orchestrator | Update individual story details for minor scope changes |
| Readiness Checker (course correction) | Specialist | Orchestrator | Re-validate cross-artifact consistency after Moderate/Major corrections |
| Retrospective Agent | Specialist | Orchestrator | Capture lessons learned after epic completion |

### Key Design Decisions

**The Phase 4 orchestrator is the most complex orchestrator.** It manages parallel agents across git worktrees, handles merge coordination, tracks sprint status, and responds to quality gate failures. This is where XState (or a similar state machine) is most justified.

**Multiple stories run in parallel.** Each Story Developer builds one story end-to-end (backend + frontend + tests) in an isolated worktree. Parallelism comes from running multiple stories simultaneously, not from splitting layers. This preserves tRPC shared type safety within each worktree and follows BMAD's vertical slice model.

**The builder-validator pattern is mandatory.** Every story goes through: developer writes code, quality gates run, code reviewer checks, if failed the developer iterates. This costs 2x compute but eliminates false "done" reports.

**Course correction follows real-team delegation.** A Story Developer never edits planning artifacts directly, just as a developer in a real team would never rewrite the architecture doc or the PRD. When implementation reveals a flaw, the developer reports the issue in chat. The orchestrator analyses the issue and routes it based on scope:

| Scope | Trigger | Orchestrator spawns (in order) | Readiness re-check? |
|-------|---------|-------------------------------|---------------------|
| **Minor** | Story-level tweaks (wrong acceptance criteria, missing edge case) | SM to update affected story files | No |
| **Moderate** | Epic/story restructuring (wrong story boundaries, missing stories, PRD gaps) | PM to update PRD sections and epics/stories | Yes (automatic) |
| **Major** | Architecture + stories affected (wrong tech choice, missing integration, structural flaw) | 1. Architect to update architecture.md, then 2. PM to update PRD and epics/stories (sequential, because architecture changes affect stories) | Yes (automatic) |

After any Moderate or Major correction, the orchestrator automatically spawns a Readiness Checker to re-validate cross-artifact consistency. Maximum 2 correction cycles -- after the second readiness failure, the orchestrator escalates to the user for manual review.

The retrospective at the end of each epic can also trigger course correction if it detects issues that affect the next epic. The orchestrator reads the retrospective output and follows the same routing table above.

---

## Interface Model: Protocol Chat + Free Chat

CodeMAD has two chat interfaces, but NOT split by planning vs implementation. Instead, the split is by **mode of work**: protocol-guided vs unstructured.

### Protocol Chat (Phases 1-4)

A single interface where all four phases live. The user navigates between phases using tab buttons in a sidebar (like VS Code's file tree, but for phases). Each phase tab shows:

- **Phase explanation** -- what this phase does and what it produces
- **Phase chat thread** -- a fresh conversation context for that phase
- **Document panel** -- the current phase's output being built
- **Sub-agent activity** -- visible as agents spawn and complete tasks

Clicking a phase button changes the entire system behaviour:
- System prompt switches to the phase's personality
- Available sub-agents change
- UI elements within the chat adapt (Phase 4 shows sprint board, worktree status, code diffs; Phases 1-3 show document drafting panels)

**Phase transition:**
1. Current phase's validation passes
2. Intermediate artifacts are cleaned up
3. User clicks the next phase tab (or is prompted to)
4. New phase starts with fresh context, reading the previous phase's validated output
5. Pre-flight checklist (advisory, not blocking) warns of any yellow/red items

**Each phase starts with fresh context.** The Phase 2 orchestrator does not inherit Phase 1's conversation. It reads the validated Product Brief as its input. This prevents context bleed and keeps each phase's context budget clean.

### Free Chat

A separate, unstructured chat for users who want AI assistance without the protocol. This serves users who like CodeMAD's tooling but do not want to follow all four phases for every task.

**What the user sees:**
- A standard chat interface (no phase tabs, no protocol structure)
- Full access to all MCP tools and code generation
- No validation gates, no phase transitions, no mandatory sub-agents

**Why this exists:**
- Not every task needs the full protocol. Quick fixes, one-off questions, and small changes belong in free chat.
- This is the Quick Flow from the product brief, made into a distinct interface.
- Users who adopt CodeMAD for the tooling (Context7, Semgrep, LanceDB) can use free chat without learning the protocol.

### Why Not Planning Chat + Implementation Chat?

The original design split by planning vs implementation (Phases 1-3 in one chat, Phase 4 in another). This was rejected because:
- **Users expect one workspace.** Switching between two pages to go from planning to building adds friction. Phase tabs in one interface is a single click.
- **Phase 4 still needs access to planning context.** Putting implementation in a separate page creates an unnecessary barrier to referencing architecture and stories. In the tab model, planning artifacts are always visible in the sidebar.
- **Traycer's split is a workaround.** Traycer separates planning and execution because it hands off to external tools (Cursor, Claude Code). CodeMAD builds execution in, so the separation is unnecessary.

---

## Agent Hierarchy Per Phase

Each phase follows a two-level hierarchy: one orchestrator and multiple sub-agents. This is flat enough to work with current LLM agent frameworks.

```
Phase 1 Orchestrator (system prompt: analyst mode)
    +-- Market Researcher (sub-agent)
    +-- Domain Researcher (sub-agent)
    +-- Technical Researcher (sub-agent)
    +-- Brief Drafter (sub-agent)
    +-- Brief Validator (sub-agent)

Phase 2 Orchestrator (system prompt: specification mode)
    +-- PRD Drafter (sub-agent)
    +-- UX/UI Designer (sub-agent)
    +-- PRD Validator (sub-agent)
    +-- UX/UI Validator (sub-agent)
    +-- Consistency Checker (sub-agent)

Phase 3 Orchestrator (system prompt: architect mode)
    +-- Tech Researcher (sub-agent)
    +-- Security Researcher (sub-agent)
    +-- Integration Researcher (sub-agent)
    +-- Architecture Validator (sub-agent)
    +-- Epic Creator (sub-agent)
    +-- Readiness Checker (sub-agent)

Phase 4 Orchestrator (system prompt: team lead mode)
    +-- Story Elaborator (sub-agent)
    +-- Story Validator (sub-agent)
    +-- Story Developer (sub-agent, in worktree) x N (default 3)
    +-- Quality Gate Runner (sub-agent)
    +-- Code Reviewer (sub-agent)
    +-- Architect (sub-agent, course correction only)
    +-- PM (sub-agent, course correction only)
    +-- SM (sub-agent, course correction only)
    +-- Readiness Checker (sub-agent, course correction only)
    +-- Retrospective Agent (sub-agent)
```

---

## Parallelism Opportunities

### Within Phase 1

| Step | Parallel? | Details |
|------|----------|---------|
| Brainstorming | No | Sequential, interactive with user |
| Research | Yes | 2-3 researchers run in parallel |
| Brief drafting | No | Must wait for all research to complete |
| Validation | No | Must wait for draft to complete |

### Within Phase 2

| Step | Parallel? | Details |
|------|----------|---------|
| PRD drafting | Yes | Runs in parallel with UX design |
| UX design | Yes | Runs in parallel with PRD drafting |
| PRD validation | Yes | Can run in parallel with UX validation |
| UX validation | Yes | Can run in parallel with PRD validation |
| Consistency check | No | Must wait for both PRD and UX to be validated |

### Within Phase 3

| Step | Parallel? | Details |
|------|----------|---------|
| Architecture research | Yes | 2-3 researchers run in parallel |
| Architecture creation | No | Sequential, interactive with user |
| Architecture validation | No | Must wait for architecture to complete |
| Epic creation | No | Must wait for architecture to be validated |
| Readiness check | No | Must wait for epics to complete |

### Within Phase 4

| Step | Parallel? | Details |
|------|----------|---------|
| Story elaboration | Per-story | Each story elaborated independently |
| Story validation | Per-story | Each story validated independently |
| Story development | Yes | Multiple stories built in parallel, each by one Story Developer in its own worktree |
| Quality gates | Per-story | Run on each story independently |
| Code review | Per-story | Review each story independently |
| Epic retrospective | No | After all stories in epic complete |

Phase 4 has the most parallelism. Multiple stories can be in different stages simultaneously: one being elaborated, one being built, one being reviewed.

---

## Blackboard and Communication

Each phase orchestrator has access to a Blackboard MCP server for sub-agent coordination. The blackboard serves two purposes:

1. **Within a phase:** Sub-agents post findings, decisions, and observations. Other sub-agents read these without direct messaging. The orchestrator reads the blackboard to synthesise results.

2. **Between phases:** The blackboard persists across phase transitions. Phase 2's orchestrator can read Phase 1's blackboard entries to understand context beyond what's in the Product Brief. However, the canonical input is always the previous phase's output document, not the blackboard.

### Communication Pattern Per Phase

```
Phase Orchestrator
    |
    +-- reads: previous phase's output document (canonical input)
    +-- reads: blackboard (supplementary context)
    +-- writes: blackboard (decisions, observations)
    |
    +-- spawns sub-agents:
        |
        +-- reads: task assignment from orchestrator
        +-- reads: blackboard (other agents' findings)
        +-- writes: blackboard (own findings)
        +-- writes: output file (its deliverable)
        +-- reports: completion to orchestrator
```

### Task List for Phase 4

Phase 4 uses a formal task list (the Claude Code teams pattern) in addition to the blackboard. This is because Phase 4 has complex dependencies between stories, parallel agents, and merge coordination that the blackboard alone cannot handle.

```
Phase 4 Orchestrator
    |
    +-- Task List (sprint status, story assignments, dependencies)
    +-- Blackboard (shared discoveries, architecture decisions)
    |
    +-- Developer agents:
        +-- reads: task assignment (from task list)
        +-- reads: blackboard (architecture context)
        +-- writes: task status (to task list)
        +-- writes: blackboard (implementation discoveries)
        +-- works: in isolated git worktree
```

---

## Phase Transition Protocol

When one phase completes and the next begins, the application (Bun sidecar) handles the transition:

1. **Validate.** Run the current phase's validation sub-agent. If validation fails, the user must resolve issues before advancing.

2. **Clean up.** Delete intermediate artifacts. Only canonical outputs survive.

3. **Store phase state.** The application records which phases are complete and their output file paths.

4. **Update system prompt.** The next phase's system prompt replaces the current one. This changes the AI's personality, available tools, and interaction style.

5. **Load inputs.** The next phase's orchestrator reads the previous phase's canonical output(s).

6. **Notify user.** The protocol chat shows a phase transition marker. The pre-flight checklist (green/yellow/red, advisory) confirms readiness.

### Phase State Machine

```
[Phase 1: Analysis]
    |
    | Output: product-brief.md (validated)
    | Deleted: brainstorming-session.md, research-*.md
    v
[Phase 2: Planning]
    |
    | Output: prd.md + ux-design.md (both validated, UX optional)
    v
[Phase 3: Solutioning]
    |
    | Output: architecture.md + epics.md (both validated)
    | Deleted: readiness-report.md
    v
[Phase 4: Implementation]  <-- same interface, Phase 4 tab (different UI layout)
    |
    | Output: working code (in git worktrees, merged to main)
    | Stories and sprint status persist
    v
[Complete]
```

---

## Dynamic Phase Entry

Not every project starts at Phase 1. The product brief mentions a "dynamic phase selector" (SCAMPER idea S#1). Users who already have a PRD, or who are joining an existing codebase, should be able to enter at the appropriate phase.

| Entry Point | Requirements | Skipped |
|------------|-------------|---------|
| Phase 1 | Nothing (start fresh) | Nothing |
| Phase 2 | Product Brief (user provides or imports) | Phase 1 |
| Phase 3 | PRD + optional UX Design (user provides or imports) | Phases 1-2 |
| Phase 4 | Architecture + Epics (user provides or imports) | Phases 1-3 |

When entering at a later phase, the application validates the provided documents against the expected schema before allowing the phase to begin. Imported documents may need a compatibility check sub-agent to verify they contain enough detail for the phase to work.

**This is a v0.5 feature** (per the release flow). MVP requires sequential Phase 1 through Phase 4.

---

## Quick Flow

Quick Flow is the two-track protocol's fast path for bug fixes and small changes. It skips Phases 1-3 and drops directly into a simplified Phase 4.

```
User selects "Quick Flow"
    |
    v
[Quick Spec] -- INTERACTIVE
    |              User describes the change in natural language
    |              AI generates a mini-spec (not a full PRD)
    |              Covers: what to change, acceptance criteria,
    |              files likely affected
    |
    v
[Developer Agent] -- AUTOMATIC
    |                  Single agent, single worktree
    |                  No parallel execution
    |                  If spec is small: embedded in system prompt
    |                  (no reference document needed)
    |                  If spec is large: saved to disk, path passed
    |                  Quality gates still run
    |
    v
[Code Review] -- AUTOMATIC
    |              Same builder-validator pattern
    v
[Complete]
```

Quick Flow runs in the free chat interface. It does not use the protocol phase tabs. It does not produce planning artifacts. It does not run validation sub-agents beyond code review.

**This is a v0.2 MVP feature.**

---

## Comparison with Traycer

Costa mentioned Traycer as a reference point. Here is how CodeMAD's phase orchestration compares.

| Aspect | Traycer | CodeMAD |
|--------|---------|---------|
| Planning | Spec-driven, generates file-level plans | Protocol-driven, generates PRD + UX + Architecture + Epics |
| Execution | Hands off to external agent (Cursor, Claude Code) | Built-in parallel developer agents in git worktrees |
| Verification | Verifies changes against plan, detects regressions | Builder-validator pattern + 5-stage quality gates + code review |
| Chat model | Single context for planning | Protocol chat (phase tabs) + free chat |
| Phase structure | Single planning phase | Four structured phases with validation between each |
| Research | None (works from user's spec) | Automatic researcher sub-agents at Phases 1 and 3 |
| Artifacts | Plans that external agents consume | Self-contained: plans AND execution in one tool |

CodeMAD is Traycer's planning rigour combined with built-in execution. The user does not need to copy plans into Cursor or Claude Code. The same platform that creates the spec also builds the code.

---

## Implementation Considerations

### Application-Level Orchestration

The Bun sidecar manages the protocol, not an AI agent. This means:

- Phase state is stored in the project's `.codemad/` directory
- Phase transitions are deterministic application logic
- System prompt switching is a function call, not an agent decision
- Intermediate artifact cleanup is a file system operation
- The application enforces that Phase 2 cannot start until Phase 1's output is validated

This is important because it means the protocol is reliable. An AI agent might skip a phase or forget to validate. The application cannot -- the code enforces the sequence.

### System Prompt Architecture

Each phase needs a distinct system prompt that includes:

1. **Phase personality** (discovery / specification / architect / builder)
2. **Available sub-agents** (which agents can be spawned)
3. **Input documents** (what to read)
4. **Output specification** (what to produce)
5. **Quality criteria** (what "done" looks like)
6. **Constraints** (what the phase must NOT do -- Phase 4 must not make architecture decisions, Phase 2 must not write code)

The system prompts are not static text. The application assembles them from templates + project context + phase state. This allows the protocol to adapt to the project while maintaining the phase structure.

### MCP Tool Availability Per Phase

Not all MCP tools are needed in all phases. Lazy loading per phase reduces token cost.

| MCP Tool | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|----------|:-------:|:-------:|:-------:|:-------:|
| Web search | Yes | No | Yes | No |
| Context7 (library docs) | No | No | Yes | Yes |
| Semgrep (security scan) | No | No | Yes | Yes |
| LanceDB (code search) | No | No | Yes | Yes |
| LanceDB (memory) | Yes | Yes | Yes | Yes |
| Blackboard MCP | Yes | Yes | Yes | Yes |
| Git operations | No | No | No | Yes |
| File system | Yes | Yes | Yes | Yes |

---

## Resolved Design Decisions

These questions were raised during the initial design and resolved by Costa on 2026-02-11.

### RD1: Fresh context per phase (not persistent)

Each phase starts with a fresh conversation context. The Phase 2 orchestrator does not inherit Phase 1's conversation history. It reads the validated Product Brief as its sole input. This prevents context bleed and keeps context clean.

**Trade-off accepted:** Conversational continuity is lost. If the user discussed a nuance in Phase 1 that did not make it into the Product Brief, that nuance is gone in Phase 2. The orchestrator's gatekeeper role in each phase mitigates this: it ensures important context is captured in the output document before the phase completes.

### RD2: Course correction via Architect sub-agent (developer never edits planning artifacts)

When a Story Developer discovers that the architecture is wrong during implementation, they report the issue in the Phase 4 chat. The Phase 4 orchestrator then spawns an Architect sub-agent to update `architecture.md`. The developer never edits planning artifacts directly.

This mirrors real-team dynamics: a developer files a ticket or speaks to the architect, they do not rewrite the architecture doc. Benefits:
- **Separation of concerns** -- the developer's context stays focused on code
- **Audit trail** -- architecture changes are made by an architect-persona agent, clearly distinguishable in logs
- **Consistency** -- the architect sub-agent cross-references PRD and UX when updating, just as the Phase 3 architect did originally

### RD3: Pre-flight checklist is advisory (not blocking)

The pre-flight checklist at phase transitions shows green/yellow/red items but allows the user to proceed with warnings. If the result is not as expected, they were warned.

**Rationale:** Blocking frustrates experienced users who understand the risks. Advisory respects user agency while making the consequences visible.

### RD4: Default 3 parallel Story Developers (configurable)

Phase 4 runs up to 3 Story Developer agents in parallel by default. Users can increase this based on their API budget and the independence of stories. The orchestrator manages merge coordination and dependencies regardless of count.

**Why 3:** Balances throughput against merge conflict risk. Most epics have 3-5 stories, and running 3 in parallel covers the common case. Going higher requires stories that touch completely independent file sets.

### RD5: Orchestrator mediates researcher access (gatekeeper pattern)

Research sub-agents in Phase 1 receive context from the orchestrator, not from the raw brainstorming conversation. The orchestrator reads the brainstorming output document and tells researchers what to look for: guardrails, edge cases, specific areas to investigate. The orchestrator acts as gatekeeper in every phase, ensuring sub-agents are properly briefed.

**This applies to all phases, not just Phase 1.** Every phase orchestrator mediates between its inputs and its sub-agents. Sub-agents receive focused instructions, not raw context dumps.

---

## Information Flow

### Current Constraint

Current LLM agent frameworks do not support direct sub-agent-to-sub-agent communication. All coordination flows through the orchestrator. This is a technical limitation, not a design choice. The architecture should be ready to allow direct sub-agent communication when frameworks support it.

### How Data Moves Today

```
User <-> Orchestrator <-> Sub-Agent
         |                   |
         |  1. Structured brief: goal, context file paths,
         |     scope, expected output format
         |  ---------------------------------->
         |
         |  2. Sub-agent reads files from disk, does work
         |
         |  3. Return: summary, output document path, status
         |  <----------------------------------
         |
         |  4. Orchestrator reads output document if needed
         |  5. Orchestrator decides next action
         |  6. Orchestrator presents summary to user in chat
```

- The orchestrator sends a structured brief to each sub-agent when spawning it: goal, context file paths, scope, and expected output format.
- The sub-agent reads files from disk, does its work, and returns a summary, an output document path, and a status (success, failure, needs-correction).
- The orchestrator reads the output document if needed, decides the next action based on the phase system prompt, and presents a summary to the user in chat.
- Automatic validation sub-agents (consistency check, architecture verification, readiness check) return reports to the orchestrator. The orchestrator decides whether to show the report to the user or handle it automatically.

---

## Document Quality Standard

Documents are the sole handoff mechanism between phases (see RD1: fresh context per phase). Even without token constraints, these standards apply because high signal density produces better agent decisions than exhaustive documents.

### Five Requirements

1. **High signal density.** Every sentence either changes a decision or clarifies an action. If removing a sentence changes nothing, remove it.
2. **Layered.** A short summary at the top (what was decided, what to build, what constraints exist), with detailed sections below for sub-agents that need depth. The orchestrator reads the summary. A specialist sub-agent reads the section relevant to its task.
3. **Self-contained.** No "see the conversation from Phase 1" or "as we discussed". A fresh agent with zero history must be able to act on this document alone.
4. **Actionable.** Every section is either a decision (with rationale) or a requirement (with acceptance criteria). No "we should consider" or "it might be good to".
5. **Structured.** Consistent headings, machine-parseable frontmatter, cross-references between documents by file path.

### Enforcement

The orchestrator flags documents that fail these criteria during validation. Validation sub-agents check for self-containment (no dangling references), actionability (every requirement has acceptance criteria), and structure (consistent heading hierarchy).

---

## Document Review: A/P/C Checkpoint

After each canonical document is created, the orchestrator presents it to the user and offers three choices: **Advanced Elicitation**, **Party Mode**, or **Continue**. This replaces BMAD's per-step A/P/C with a per-document checkpoint -- fewer interruptions, better context for the decision.

### The Three Modes

| Mode | Behaviour | When to use |
|------|-----------|-------------|
| **Continue** | Accept the document as-is. Move to validation. | The document looks complete and accurate. |
| **Party Mode** | Orchestrator enters divergent creative mode. It suggests additions, alternatives, and "what if" scenarios: "What if we also supported offline mode?", "Have you considered a plugin system?". The user picks what resonates. The document is updated with the chosen additions. | The document feels thin, or the user wants to explore possibilities they had not considered. |
| **Advanced Elicitation** | Orchestrator asks structured probing questions to find gaps and challenge assumptions: "What happens when the API key expires mid-session?", "Who is the second user persona?", "What is the fallback when LanceDB is unavailable?". User answers feed back into the document. | The document feels like it has gaps or unstated assumptions that need surfacing. |

### Loop Behaviour

After Party Mode or Advanced Elicitation updates the document, the orchestrator presents the updated version and offers A/P/C again. The user can loop as many times as they want. Continue exits the loop and moves to validation.

```
[Sub-agent creates document]
    |
    v
[Orchestrator presents document to user]
    |
    +-- [Continue] --> [Validation sub-agent]
    |
    +-- [Party Mode] --> [Creative exploration]
    |       |              User picks additions
    |       |              Document updated
    |       +-----------> [Present updated document] --> A/P/C again
    |
    +-- [Advanced Elicitation] --> [Probing questions]
            |                        User answers
            |                        Document updated
            +----------------------> [Present updated document] --> A/P/C again
```

### Which Documents Get A/P/C

| Document | A/P/C? | Rationale |
|----------|--------|-----------|
| Product Brief (Phase 1) | Yes | Sets the direction for the entire project. Gaps here cascade everywhere. |
| PRD (Phase 2) | Yes | Requirements gaps cause rework in every later phase. |
| UX/UI Design (Phase 2) | Yes | Interaction gaps surface as implementation surprises. |
| Architecture (Phase 3) | Yes | Wrong decisions affect every file in the codebase. |
| Epics and Stories (Phase 3) | Yes | Story boundaries affect parallelisation, scope, and implementation order. |
| Phase 4 story files | No | These are elaborated from already-approved epics. The Story Validator catches gaps. User interaction here would stall the build pipeline. |
| Quick Flow specs | No | Quick Flow is for fast tasks. A/P/C would add ceremony that defeats the purpose. |

### First-Time User Experience

The first time a user sees the A/P/C checkpoint, the orchestrator briefly explains what each mode does. After that, just show the three buttons. New users need to learn what Party Mode means. Returning users just want to click.

### Legal Significance

Each A/P/C checkpoint is a moment where the user exercises editorial judgement over AI-generated content. "I chose Continue" is a human decision. "I used Party Mode to add requirement X" is stronger evidence of human authorship. "I used Advanced Elicitation to clarify edge case Y" is strongest. This loop strengthens the "substantial human participation" argument for AI code copyright defence and satisfies EU AI Act transparency requirements. The A/P/C checkpoint is both a quality mechanism and a legal mechanism.

---

## Summary

CodeMAD's four phases operate as independent orchestration surfaces, each with:

- Its own system prompt personality
- Its own orchestrator (no global orchestrator)
- Its own sub-agents (two-level hierarchy: orchestrator + sub-agents)
- Its own validation before phase transition
- A/P/C checkpoint on every canonical document (Continue / Party Mode / Advanced Elicitation)
- Automatic cleanup of intermediate artifacts

All four phases live in a single protocol interface with tab navigation. A separate free chat provides unstructured AI assistance. The application (Bun sidecar) manages phase transitions, enforces the protocol sequence, and handles system prompt switching.

Each phase produces one (or two) canonical output documents. Intermediate artifacts are consumed and deleted. The chain of canonical outputs (Product Brief > PRD + UX > Architecture + Epics > Working Code) forms the decision audit trail that serves as product differentiator, legal defence, and regulatory compliance simultaneously.

The design maximises sub-agent parallelism within each phase while keeping the phase sequence strictly ordered. Research runs in parallel. Multiple stories develop in parallel (up to 3 by default), each as a vertical slice built end-to-end by one Story Developer. But Phase 2 never starts until Phase 1's Product Brief is validated. The protocol is the product, and the protocol is enforced by application logic, not agent judgement.
