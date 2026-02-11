# BMAD v6.0.0-Beta.8 — Complete Methodology Reference

> **Generated:** 2026-02-11
> **Source:** Deep analysis of 483 files across 4 BMAD modules by 11 parallel research agents
> **Purpose:** Authoritative reference for CodeMAD product brief alignment and architecture planning

---

## Table of Contents

1. [Overview](#1-overview)
2. [Module Architecture](#2-module-architecture)
3. [The Four Phases](#3-the-four-phases)
4. [Phase 1: Analysis](#4-phase-1-analysis)
5. [Phase 2: Planning](#5-phase-2-planning)
6. [Phase 3: Solutioning](#6-phase-3-solutioning)
7. [Phase 4: Implementation](#7-phase-4-implementation)
8. [The Two Story-Creation Stages](#8-the-two-story-creation-stages)
9. [Testing: Three Approaches](#9-testing-three-approaches)
10. [Parallelisation Model](#10-parallelisation-model)
11. [Agent Roster and Ownership](#11-agent-roster-and-ownership)
12. [Workflow Execution Patterns](#12-workflow-execution-patterns)
13. [Handoff Mechanisms](#13-handoff-mechanisms)
14. [Quality Gates](#14-quality-gates)
15. [Key Corrections for CodeMAD Product Brief](#15-key-corrections-for-codemad-product-brief)

---

## 1. Overview

BMAD (Build Methodology for Agile Development) is a 4-phase, 30+ workflow framework with 18 agents across 4 modules. It drives software projects from brainstorming through to implemented, tested code.

**Core design principles:**

- **Artifact-driven handoffs.** Agents never communicate directly. They produce documents that the next agent discovers and consumes through filesystem glob patterns.
- **User-driven transitions.** No automatic phase progression. The user invokes each workflow. The `/bmad-help` command recommends what to do next.
- **Fresh context per workflow.** Each workflow runs in its own context window. State is tracked in document frontmatter and `sprint-status.yaml`.
- **Append-only document building.** Workflows build documents by appending sections. Content is never overwritten (except the PRD polish step).
- **Micro-file architecture.** Each step is a self-contained instruction file loaded just-in-time. Only one step file is in memory at any time.

---

## 2. Module Architecture

| Module | Version | Source | Purpose |
|--------|---------|--------|---------|
| **core** | 6.0.0-Beta.8 | built-in | Workflow engine, orchestration, brainstorming, review tasks |
| **bmm** | 6.0.0-Beta.8 | built-in | Build Methodology: PRD, architecture, epics, stories, code review |
| **cis** | 0.1.6 | npm | Creative Intelligence: brainstorming, design thinking, innovation |
| **tea** | 1.0.0 | npm | Test Architecture Enterprise: ATDD, test design, CI, quality gates |

Each module has its own `config.yaml`, `module-help.csv`, agents, and workflows. The core module provides the execution engine (`workflow.xml`) that all other modules use.

**Key paths:**

```
_bmad/core/          → Workflow engine, master agent, review tasks
_bmad/bmm/           → Build methodology (the main pipeline)
_bmad/cis/           → Creative intelligence (standalone tools)
_bmad/tea/           → Test architecture (integrates with BMM Phase 4)
_bmad/_config/       → Manifests, agent customisation, IDE configs
_bmad/_memory/       → Agent memory (tech-writer, storyteller)
```

---

## 3. The Four Phases

```
PHASE 1: ANALYSIS (all optional)
  Brainstorm → Research (market/domain/technical) → Product Brief

PHASE 2: PLANNING (PRD required)
  Create PRD [REQUIRED] → Validate PRD → Edit PRD → Create UX Design

PHASE 3: SOLUTIONING (all 3 required)
  Create Architecture [REQUIRED]
  Create Epics & Stories [REQUIRED]
  Implementation Readiness Check [REQUIRED]

PHASE 4: IMPLEMENTATION (story cycle loop)
  Sprint Planning [REQUIRED]
  ┌→ Create Story [REQUIRED]
  │  Dev Story [REQUIRED]
  │  Code Review
  │  Test Automation
  └─ Retrospective (at epic end, then loop)
```

**Gate rules:**
- `required=true` workflows block progression to later phases
- Optional workflows can be skipped without blocking
- Phase 3 is the strictest: all three workflows are required
- Phase 4 is a loop, not a waterfall

---

## 4. Phase 1: Analysis

**Agent:** Mary (Business Analyst)
**All workflows optional.** Users can skip to Phase 2 if they already have requirements clarity.

### 4.1 Product Brief Creation (6 steps)

| Step | Purpose | Output Section |
|------|---------|---------------|
| 1 | Initialisation and document discovery | Frontmatter |
| 2 | Product vision discovery | Executive Summary, Core Vision |
| 3 | Target users discovery | Target Users, User Journey |
| 4 | Success metrics definition | Success Metrics, Business Objectives, KPIs |
| 5 | MVP scope definition | MVP Scope, Future Vision |
| 6 | Completion and next steps | Final validation |

**Interaction pattern:** Steps 2-5 offer the **A/P/C menu**:
- **[A] Advanced Elicitation** — deeper discovery via structured questioning
- **[P] Party Mode** — multi-agent perspective analysis
- **[C] Continue** — save content and proceed

**Output:** `{planning_artifacts}/product-brief-{project}-{date}.md`

### 4.2 Research Workflows (3 types, 6 steps each)

All three research types share the same architecture but have different content. All require web search.

| Type | Focus | Parallel Searches Per Step |
|------|-------|--------------------------|
| Technical | Tech stack, integration patterns, architecture | 3-4 |
| Market | Customer behaviour, pain points, competitive analysis | 3-4 |
| Domain | Industry analysis, regulatory, competitive landscape | 3-4 |

**Output:** `{planning_artifacts}/research/{type}-{topic}-research-{date}.md`

**Key pattern:** Research steps use parallel web searches (3-4 simultaneous queries per step) and mandate source verification. No claims from training data alone.

### 4.3 Phase 1 Outputs

| Artifact | Consumed By |
|----------|-------------|
| Product Brief | PRD creation (Phase 2), UX Design (Phase 2) |
| Technical Research | Architecture decisions (Phase 3) |
| Market Research | Competitive positioning, business strategy |
| Domain Research | Regulatory compliance, industry requirements |

---

## 5. Phase 2: Planning

### 5.1 PRD Creation (12 steps) — REQUIRED

**Agent:** John (PM)

| Step | Purpose |
|------|---------|
| 1-1b | Init / Continue |
| 2 | Project classification (type, domain, complexity) |
| 3 | Success criteria and scope negotiation |
| 4 | User journey mapping (3-4 journeys minimum) |
| 5 | Domain requirements (optional, for medium/high complexity) |
| 6 | Innovation exploration (optional) |
| 7 | Project-type deep dive (CSV-driven) |
| 8 | MVP scoping and phased roadmap |
| 9 | **Functional Requirements** — THE CAPABILITY CONTRACT (20-50 FRs typical) |
| 10 | Non-Functional Requirements |
| 11 | Polish (the only step that replaces content) |
| 12 | Completion |

**The FR contract principle:** UX designers ONLY design what is listed in FRs. Architects ONLY support what is listed. Epic breakdown ONLY implements what is listed. If a capability is missing from FRs, it will not exist in the final product.

**FR format:** `FR1: [Actor] can [capability]`

**Three workflow modes:** Create, Edit, Validate. The validate workflow has 13 steps checking density, measurability, traceability, implementation leakage, domain compliance, and SMART criteria.

### 5.2 UX Design (14 steps) — Optional

**Agent:** Sally (UX Designer)

Covers: project understanding, core experience, emotional response, inspiration analysis, design system choice, defining interaction, visual foundation (colour themes), design directions (HTML mockups), user journey flows (Mermaid diagrams), component strategy, UX patterns, responsive design and accessibility.

**Produces three files:**
1. `ux-design-specification.md` — main spec
2. `ux-color-themes.html` — interactive colour theme visualiser
3. `ux-design-directions.html` — interactive design direction mockups

### 5.3 Phase 2 Outputs

| Artifact | Consumed By |
|----------|-------------|
| PRD (FRs, NFRs) | Architecture (Phase 3), Epics (Phase 3), Readiness Check |
| UX Design | Architecture (Phase 3), Epics (Phase 3), Implementation |

---

## 6. Phase 3: Solutioning

All three workflows are **REQUIRED**. This is the strictest phase.

### 6.1 Create Architecture (8 steps) — REQUIRED

**Agent:** Winston (Architect)
**Prerequisite:** PRD must exist (workflow refuses to proceed without it)

| Step | Purpose |
|------|---------|
| 1-1b | Init / Continue (discover PRD, brief, research, UX) |
| 2 | Project context analysis (requirements, constraints, cross-cutting concerns) |
| 3 | Starter template evaluation (web search for current templates) |
| 4 | Core architectural decisions (5 categories: data, auth, API, frontend, infrastructure) |
| 5 | **Implementation patterns and consistency rules** (prevents AI agent conflicts) |
| 6 | Project structure and boundaries (complete directory tree, requirement mapping) |
| 7 | Architecture validation (coherence, coverage, implementation readiness) |
| 8 | Completion and handoff |

**Step 5 is critical for CodeMAD.** It defines naming conventions, structural patterns, format patterns, communication patterns, and process patterns that prevent multiple AI agents from generating conflicting code. It explicitly states: "All AI Agents MUST follow these patterns."

**Decision record format:** Category, Decision, Version, Rationale, Affects (components/epics), Provided by Starter (yes/no).

### 6.2 Create Epics and Stories (4 steps) — REQUIRED

**Agent:** John (PM)
**Prerequisites:** PRD + Architecture must exist. UX recommended if UI exists.

| Step | Purpose |
|------|---------|
| 1 | Validate prerequisites (extract all FRs, NFRs, additional requirements) |
| 2 | **Design epics** (user-value grouping, FR coverage map) |
| 3 | **Create stories** (per-epic, with BDD acceptance criteria) |
| 4 | Final validation (FR coverage, architecture compliance, dependencies) |

**CRITICAL: Epics are organised by USER VALUE, not by technical layer.**

Correct epic structure:
- Epic 1: User Authentication & Profiles (users can register, login, manage profiles)
- Epic 2: Content Creation (users can create, edit, publish content)
- Epic 3: Social Interaction (users can follow, comment, like content)

Wrong epic structure:
- Epic 1: Database Setup (no user value)
- Epic 2: API Development (no user value)
- Epic 3: Frontend Components (no user value)

**Dependency rules:**
- Each epic must deliver complete functionality for its domain
- Epic N cannot require Epic N+1 to function
- Within an epic, Story N.2 can only depend on Story N.1 (never on N.3)
- Database tables created only when needed by a story (never all upfront)

**Story format:**
```markdown
### Story N.M: {title}

As a {user_type},
I want {capability},
So that {value_benefit}.

**Acceptance Criteria:**

**Given** {precondition}
**When** {action}
**Then** {expected_outcome}
**And** {additional_criteria}
```

**If Architecture specifies a starter template:** Epic 1 Story 1 must be "Set up initial project from starter template."

**Output:** `{planning_artifacts}/epics.md`

### 6.3 Implementation Readiness Check (6 steps) — REQUIRED

**Agent:** Winston (Architect)
**Approach:** Adversarial — the agent is told to find failures, not confirm success.

| Step | What Gets Checked |
|------|-------------------|
| 1 | Document discovery and inventory (flag duplicates) |
| 2 | PRD analysis (extract every FR and NFR verbatim) |
| 3 | Epic coverage validation (FR coverage matrix) |
| 4 | UX alignment (optional — warning if implied but missing) |
| 5 | **Epic quality review** (adversarial, the most rigorous step) |
| 6 | Final assessment (READY / NEEDS WORK / NOT READY) |

**Step 5 checks:**
- Epic titles are user-centric (not technical)
- Epic independence (Epic N does not require Epic N+1)
- Story sizing (completable by a single dev agent)
- Acceptance criteria in Given/When/Then format, independently testable
- No forward dependencies
- Database tables created when first needed, not all upfront

**Severity levels:** RED Critical, ORANGE Major, YELLOW Minor.

**Traceability chain enforced:** PRD FR → Epic → Story → Acceptance Criteria.

**Output:** `{planning_artifacts}/implementation-readiness-report-{date}.md`

---

## 7. Phase 4: Implementation

### 7.1 Sprint Planning — REQUIRED

**Agent:** Bob (SM)

Reads all epic files and generates `sprint-status.yaml` — the single source of truth for implementation progress. Creates entries for every epic, story, and retrospective.

**Status state machines:**
- **Epic:** `backlog → in-progress → done`
- **Story:** `backlog → ready-for-dev → in-progress → review → done`
- **Retrospective:** `optional ↔ done`

**Intelligent status detection:** If story files already exist on disk, upgrades status to at least `ready-for-dev`. Never downgrades existing statuses.

### 7.2 Sprint Status (hub/router)

Three execution modes:
- **Interactive** — dashboard with summary, risk detection, recommendations, action menu
- **Data** — machine-readable output for other workflows
- **Validate** — health check of sprint-status.yaml

**Recommendation priority:**
1. Continue in-progress work (dev-story)
2. Review completed work (code-review)
3. Start ready work (dev-story)
4. Prepare new work (create-story)
5. Reflect on completed epics (retrospective)
6. Celebrate completion

### 7.3 Create Story — REQUIRED (Second Story Creation)

**Agent:** Bob (SM)
**This is the context enrichment pipeline.** See [Section 8](#8-the-two-story-creation-stages) for full comparison with Phase 3.

6-step workflow that takes ONE story from `epics.md` and creates a comprehensive, self-contained dev guide:

| Step | Purpose |
|------|---------|
| 1 | Determine target story (from sprint-status or user input) |
| 2 | **Exhaustive artifact analysis** (epics, PRD, architecture, UX, previous stories, git history) |
| 3 | Architecture analysis for developer guardrails (9 categories) |
| 4 | Web research for latest library versions and breaking changes |
| 5 | Create comprehensive story file (populate template) |
| 6 | Update sprint-status.yaml to `ready-for-dev` |

**Quality validation:** A competitive checklist runs "Disaster Prevention Gap Analysis" across 5 categories: reinvention prevention, technical specification, file structure, regression, and implementation disasters.

**Output:** `{implementation_artifacts}/{story-key}.md`

### 7.4 Dev Story — REQUIRED

**Agent:** Amelia (Developer)
**10-step workflow with strict TDD.**

| Step | Purpose |
|------|---------|
| 1 | Find next `ready-for-dev` story and load it |
| 2 | Load project context and story information |
| 3 | Detect review continuation (if returning from code review) |
| 4 | Mark story `in-progress` in sprint-status.yaml |
| 5 | **Implement task: RED → GREEN → REFACTOR** (loop per task) |
| 6 | Author comprehensive tests (unit, integration, E2E, edge cases) |
| 7 | Run validations and full test suite |
| 8 | Validate and mark task complete (loop back to step 5 if more tasks) |
| 9 | Story completion: all tasks done, full regression, Definition of Done |
| 10 | Completion communication and next steps |

**Step 5 — The TDD cycle (per task):**
1. **RED:** Write FAILING tests first. Confirm they fail (validates test correctness).
2. **GREEN:** Implement MINIMAL code to make tests pass. Run tests to confirm.
3. **REFACTOR:** Improve code structure while keeping tests green. Ensure architecture compliance.

**Critical rules:**
- "FOLLOW THE STORY FILE TASKS/SUBTASKS SEQUENCE EXACTLY AS WRITTEN — NO DEVIATION"
- "NEVER implement anything not mapped to a specific task/subtask in the story file"
- "NEVER mark a task complete unless ALL conditions are met — NO LYING OR CHEATING"
- "NEVER lie about tests being written or passing — tests must actually exist and pass 100%"

**HALT conditions:** Story inaccessible, ambiguous requirements, new dependencies beyond story specs, 3 consecutive failures, regression test failures.

**The dev agent can ONLY modify:** Task checkboxes, Dev Agent Record, File List, Change Log, Status. Cannot modify: Story statement, Acceptance Criteria, Dev Notes.

### 7.5 Code Review (adversarial)

**Agent:** Amelia (Developer) — but recommends using a **different LLM** than the one that implemented the story.

5-step adversarial review:

| Step | Purpose |
|------|---------|
| 1 | Load story and discover changes via git |
| 2 | Build review attack plan (4 dimensions) |
| 3 | **Execute adversarial review** (minimum 3 issues required) |
| 4 | Present findings and fix (auto-fix or action items) |
| 5 | Update story status (`done` if clean, `in-progress` if issues remain) |

**Review dimensions:**
1. AC Validation — verify each acceptance criterion is implemented
2. Task Audit — verify each `[x]` task is actually done
3. Code Quality — security, performance, maintainability
4. Test Quality — "Real tests vs placeholder bullshit"

**Severity:** HIGH (must fix), MEDIUM (should fix), LOW (nice to fix).

**Anti-cheating:** Cross-references git changes with story File List. Tasks marked `[x]` but not implemented are CRITICAL severity.

### 7.6 Retrospective (12 steps)

**Agent:** Bob (SM)

The most elaborate workflow in all of BMAD. Runs after each epic completes. Uses Party Mode Protocol with simulated team dynamics.

Key features:
- Deep story analysis (dev notes, review feedback, lessons learned across all stories)
- Previous retrospective integration (accountability loop — were past action items addressed?)
- Next epic preview and readiness assessment
- SMART action items with owners and deadlines
- **Significant Change Detection** — flags if discoveries invalidate the next epic's plan
- Psychological safety is paramount ("no blame, focus on systems/processes")

### 7.7 Correct Course (emergency steering)

**Agent:** Bob (SM) / John (PM)

Triggered when something goes wrong mid-sprint. 6-step process with a 26-item checklist across 6 sections. Analyses impact across ALL project artifacts, proposes changes with explicit before/after format, routes to appropriate agents based on scope:
- **Minor** → dev team
- **Moderate** → PO/SM
- **Major** → PM/Architect for fundamental replan

---

## 8. The Two Story-Creation Stages

This is the most important distinction in BMAD's implementation pipeline.

### Stage 1: Phase 3 — Create Epics & Stories (PLANNING)

| Aspect | Detail |
|--------|--------|
| **Purpose** | Transform PRD requirements into epics and stories |
| **Agent** | John (PM) |
| **Input** | PRD, Architecture, UX documents |
| **Output** | Single `epics.md` file (planning artifact) |
| **Interaction** | Highly collaborative, user at every step |
| **Workflow type** | Step-file architecture (4 markdown steps) |
| **Granularity** | User stories with Given/When/Then acceptance criteria |
| **Does NOT create** | Individual story files, tasks, subtasks, dev notes, developer guardrails |
| **Epic organisation** | By USER VALUE (vertical slices), never by technical layer |
| **Parallelisation** | None. Sequential epic processing. |

### Stage 2: Phase 4 — Create Story (IMPLEMENTATION PREP)

| Aspect | Detail |
|--------|--------|
| **Purpose** | Take ONE story from epics.md and create a comprehensive dev-ready file |
| **Agent** | Bob (SM) |
| **Input** | epics.md + ALL artifacts (PRD, architecture, UX, previous stories, git history, web research) |
| **Output** | Individual `{story-key}.md` file (implementation artifact) |
| **Interaction** | Mostly automated ("ZERO USER INTERVENTION" except initial selection) |
| **Workflow type** | XML instructions (6 steps) via core workflow engine |
| **Granularity** | Tasks and subtasks with checkboxes, linked to acceptance criteria |
| **Adds** | Developer guardrails, previous story intelligence, git analysis, web research, testing requirements |
| **Design principle** | "The dev agent ONLY has this file to work from" |

### The Pipeline

```
Phase 3: create-epics-and-stories
  → produces epics.md (user stories with BDD acceptance criteria)

Phase 4: sprint-planning
  → reads epics.md, creates sprint-status.yaml (all stories as "backlog")

Phase 4: create-story
  → takes ONE "backlog" story from sprint-status.yaml
  → reads epics.md + architecture + PRD + UX + previous stories + git + web
  → produces individual {story-key}.md with tasks/subtasks/dev-notes
  → updates sprint-status.yaml to "ready-for-dev"

Phase 4: dev-story
  → takes ONE "ready-for-dev" story file
  → implements tasks/subtasks in exact order (red-green-refactor)
  → updates sprint-status.yaml to "in-progress" then "review"

Phase 4: code-review
  → adversarial review, minimum 3 findings
  → if clean: status → "done"
  → if issues: status → "in-progress" (back to dev-story)
```

### Story File Template (Phase 4 output)

```markdown
# Story {epic_num}.{story_num}: {story_title}
Status: ready-for-dev

## Story
As a {role}, I want {action}, so that {benefit}.

## Acceptance Criteria
1. [from epics/PRD]

## Tasks / Subtasks
- [ ] Task 1 (AC: #)
  - [ ] Subtask 1.1
- [ ] Task 2 (AC: #)
  - [ ] Subtask 2.1

## Dev Notes
- Architecture patterns and constraints
- Source tree components to touch
- Testing standards summary

### Project Structure Notes
### References

## Dev Agent Record
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
```

---

## 9. Testing: Three Approaches

BMAD has two testing systems (BMM and TEA) and three distinct approaches. There is currently **no user-facing choice mechanism** — the user implicitly picks by which workflow they invoke.

### 9.1 Three Testing Approaches

| Approach | When | How | Agent | Module |
|----------|------|-----|-------|--------|
| **TEA ATDD** (full TDD) | Before implementation | Generate `test.skip()` failing tests, then dev implements to green | Murat | TEA |
| **Dev-story built-in TDD** (lightweight) | During implementation | Per-task red-green-refactor within dev workflow | Amelia | BMM |
| **Post-implementation testing** | After implementation | Analyse code, generate passing tests for coverage | Quinn or Murat | BMM or TEA |

### 9.2 BMM QA Agent (Quinn) — Simple Path

- Single workflow: `qa-automate`
- Tests AFTER implementation
- No risk analysis, no TDD
- Steps: Detect framework → Identify features → Generate API tests → Generate E2E tests → Run → Summary
- Explicitly says: "For Advanced Features, install TEA module"

### 9.3 TEA Agent (Murat) — Enterprise Path

8 workflows across two phases:

**Phase 3 (Solutioning):**

| Workflow | Purpose |
|----------|---------|
| Test Framework (TF) | Scaffold Playwright/Cypress with fixtures, config |
| CI Setup (CI) | CI/CD quality pipeline (GitHub Actions / GitLab CI) |
| Test Design (TD) | Risk-based test planning (dual-mode: system-level or epic-level) |

**Phase 4 (Implementation):**

| Workflow | Purpose |
|----------|---------|
| **ATDD (AT)** | Generate FAILING tests before implementation (TDD red phase) |
| Test Automation (TA) | Expand test coverage after implementation |
| Test Review (RV) | Quality audit with 0-100 scoring (5 dimensions) |
| NFR Assessment (NR) | Non-functional requirements (security, performance, reliability, scalability) |
| Traceability (TR) | Requirements-to-tests mapping + quality gate (PASS/CONCERNS/FAIL/WAIVED) |

### 9.4 ATDD Workflow Detail

The full TDD workflow for a story:

1. **Preflight** — Load story, framework config, knowledge fragments
2. **Generation mode** — AI generation from ACs (default) or recording mode for complex UI
3. **Test strategy** — Map each AC to test scenarios, assign P0-P3 priorities
4. **Parallel test generation** — Two subprocesses: API tests (step-04a) + E2E tests (step-04b) run simultaneously, output to temp JSON, then aggregate
5. **Validate** — Verify all tests use `test.skip()` (red phase compliance), generate ATDD checklist

**Output:** ATDD checklist document at `{test_artifacts}/atdd-checklist-{story_id}.md` — serves as implementation roadmap for the dev agent.

### 9.5 The Full Testing Flow

```
Phase 3 (Solutioning)
  ├── Test Framework Setup (TF) — scaffold Playwright/Cypress
  ├── Test Design - System Level (TD) — testability review of architecture
  └── CI Setup (CI) — quality pipeline

Phase 4 (Implementation), per story:
  ├── Test Design - Epic Level (TD) — per-epic risk + coverage plan
  ├── ATDD (AT) — generate FAILING tests BEFORE implementation [TDD RED]
  ├── Dev-Story (built-in) — lightweight red-green-refactor per task
  ├── Test Automation (TA) — expand coverage AFTER implementation
  ├── Test Review (RV) — quality audit (0-100 score)
  ├── NFR Assessment (NR) — non-functional requirements
  └── Traceability (TR) — requirements mapping + quality gate
```

**Recommended full path:** TD → AT → Dev-Story → TA → RV → TR
**Lightweight path:** Dev-Story (built-in TDD) → optionally TA

### 9.6 Knowledge Base

TEA has 37 knowledge fragments in `_bmad/tea/testarch/knowledge/`, loaded just-in-time per workflow step. Key fragments:

| Fragment | Purpose |
|----------|---------|
| `component-tdd.md` | Red-Green-Refactor workflow with code examples |
| `fixture-architecture.md` | Composable fixture patterns |
| `data-factories.md` | Factory patterns with faker |
| `test-levels-framework.md` | Unit vs integration vs E2E selection criteria |
| `test-priorities-matrix.md` | P0-P3 criteria |
| `risk-governance.md` | Scoring matrix, gate rules |
| `api-testing-patterns.md` | Pure API patterns without browser |
| `contract-testing.md` | Pact publish/verify |

---

## 10. Parallelisation Model

### What BMAD Does NOT Do

BMAD does **not** split work into frontend and backend streams. Epics are vertical slices of user value. There is no "frontend epic" and "backend epic."

### Where Parallelisation Exists

| Level | Parallel? | How |
|-------|-----------|-----|
| **Multiple stories** | Yes (with caveats) | Assign via explicit `story_path` to different agent instances |
| **Tasks within a story** | No — strictly sequential | "FOLLOW THE STORY FILE TASKS/SUBTASKS SEQUENCE EXACTLY AS WRITTEN" |
| **API + E2E test generation** | Yes | TEA ATDD launches parallel subprocesses (step-04a, step-04b) |
| **Research web searches** | Yes | 3-4 parallel web searches per research step |
| **Code review vs next story prep** | Yes | Review on one story while preparing the next |
| **Epic-level work** | Yes | Different agents can work on different epics if stories are ready |

### Caveats for Parallel Stories

Multiple stories CAN run in parallel IF:
1. They are assigned to different agents with explicit `story_path`
2. They touch different files (no overlap in File List)
3. Sprint-status.yaml updates are serialised or handled carefully
4. There is a separate code review pass per story

### Recommended Pattern

Sequential with learning transfer: "SM typically creates next story after previous one is done to incorporate learnings." The previous story intelligence in create-story (Step 2) extracts dev notes, review feedback, files modified, testing approaches, and problems encountered from the prior story.

---

## 11. Agent Roster and Ownership

### All 18 Agents

| Module | Agent ID | Name | Role | Phase |
|--------|----------|------|------|-------|
| core | bmad-master | — | Master Orchestrator | All |
| bmm | analyst | Mary | Business Analyst | 1 |
| bmm | pm | John | Product Manager | 2, 3, 4 |
| bmm | ux-designer | Sally | UX Designer | 2 |
| bmm | architect | Winston | System Architect | 3 |
| bmm | sm | Bob | Scrum Master | 4 |
| bmm | dev | Amelia | Developer | 4 |
| bmm | qa | Quinn | QA Engineer | 4 |
| bmm | tech-writer | Paige | Technical Writer | Any |
| bmm | quick-flow-solo-dev | Barry | Quick Flow Solo Dev | Any |
| cis | brainstorming-coach | Carson | Brainstorming Specialist | Any |
| cis | creative-problem-solver | Dr. Quinn | Problem Solver | Any |
| cis | design-thinking-coach | Maya | Design Thinking | Any |
| cis | innovation-strategist | Victor | Innovation Oracle | Any |
| cis | presentation-master | Caravaggio | Visual Communication | Any |
| cis | storyteller | Sophia | Storyteller | Any |
| tea | tea | Murat | Master Test Architect | 3, 4 |

### Workflow Ownership

| Agent | Owned Workflows |
|-------|----------------|
| **Mary** | Brainstorm, Market Research, Domain Research, Technical Research, Create Brief, Document Project |
| **John** | Create PRD, Validate PRD, Edit PRD, Create Epics & Stories, Implementation Readiness, Course Correction |
| **Sally** | Create UX Design |
| **Winston** | Create Architecture, Implementation Readiness (shared with John) |
| **Bob** | Sprint Planning, Sprint Status, Create Story, Retrospective, Course Correction (shared with John) |
| **Amelia** | Dev Story, Code Review |
| **Quinn** | QA Automation |
| **Barry** | Quick Spec, Quick Dev, Code Review (shared with Amelia) |
| **Paige** | Document Project, Write Document, Update Standards, Mermaid Generate, Validate Documentation, Explain Concept |
| **Murat** | ATDD, Test Automation, Test Review, NFR Assessment, Traceability, Test Design, Test Framework, CI Setup |

### Agent Activation Pattern

Every agent follows the same sequence:
1. Load persona from agent file
2. Load `config.yaml` (MANDATORY — halt if missing)
3. Store `{user_name}`, `{communication_language}`, `{output_folder}`
4. Greet user by name
5. Display numbered menu
6. Wait for user input
7. Process selection through menu handlers

### Agent Customisation

Each agent has a `.customize.yaml` file supporting: name override, persona replacement, additional critical actions, persistent memories, extra menu items, and custom prompts. All currently empty for CodeMAD.

---

## 12. Workflow Execution Patterns

### Pattern A: Step-File Architecture (Phases 1-3)

```
workflow.md              → Entry point: loads config, routes to step-01
steps/
  step-01-init.md       → First step with initialisation
  step-01b-continue.md  → Optional resume point
  step-02-*.md          → Subsequent steps
  step-N-complete.md    → Final step with handoff
templates/              → Output templates
```

**Characteristics:**
- Just-in-time loading (one step file at a time)
- Sequential enforcement (no skipping)
- State tracking via `stepsCompleted` frontmatter array
- Append-only document building
- User gates at each step (A/P/C menu)

### Pattern B: workflow.yaml + Instructions (Phase 4)

```
workflow.yaml            → Configuration, variables, input patterns
instructions.xml/.md    → Execution steps processed by workflow.xml engine
template.md             → Output template (optional)
checklist.md            → Validation checklist (optional)
```

**Characteristics:**
- Governed by core `workflow.xml` execution engine
- Variable resolution from `config.yaml`
- Smart file discovery with three strategies: FULL_LOAD, SELECTIVE_LOAD, INDEX_GUIDED
- Supports sharded documents (folder with index.md)
- Two execution modes: normal (interactive) and YOLO (automated)

### Pattern C: Tri-Modal Architecture (TEA)

```
workflow.md             → Mode router
workflow.yaml           → Config metadata
steps-c/                → Create mode steps
steps-e/                → Edit mode steps
steps-v/                → Validate mode steps
checklist.md            → Validation criteria
```

### The A/P/C Menu System

Available at every content-generating step in Phases 1-3:

| Option | Name | What It Does |
|--------|------|-------------|
| **[A]** | Advanced Elicitation | Deep-dive structured questioning via `core/workflows/advanced-elicitation/` |
| **[P]** | Party Mode | Multi-agent discussion via `core/workflows/party-mode/` |
| **[C]** | Continue | Save content to document and proceed to next step |
| **[Y]** | YOLO | Auto-complete remaining document without pauses |

Users can loop through A and P multiple times before accepting with C. Changes are always confirmed before integration.

---

## 13. Handoff Mechanisms

### 13.1 Help Task Routing (Primary)

Most workflows end by invoking `_bmad/core/tasks/help.md` with the completed workflow name as argument. The help task:
1. Loads `bmad-help.csv` (master catalogue)
2. Detects active module
3. Scans output directories for completion evidence
4. Recommends next workflows based on phase/sequence ordering

### 13.2 Sprint Status Routing (Phase 4)

`sprint-status` acts as the Phase 4 navigation hub. It reads `sprint-status.yaml`, analyses story statuses, and recommends the next workflow with priority ordering.

### 13.3 Artifact-Based Discovery

Workflows discover predecessor outputs through glob patterns:
- PRD: `{output_folder}/*prd*.md`
- Architecture: `{output_folder}/*architecture*/*.md`
- Epics: `{output_folder}/*epic*/*.md`

The `discover_inputs` protocol handles both whole files and sharded documents.

### 13.4 Fresh Context Window

Each workflow is designed to run in a fresh context. State persists through:
- Document frontmatter (`stepsCompleted`, `inputDocuments`, `status`)
- `sprint-status.yaml` (story lifecycle tracking)
- Story files (Dev Agent Record, File List, Change Log)

---

## 14. Quality Gates

### Phase Progression Gates

| Gate | Type | Condition |
|------|------|-----------|
| Phase 1 → 2 | Soft | Product brief completion recommends PRD |
| Phase 2 → 3 | Hard | PRD must exist (architecture workflow validates) |
| Phase 3 internal | Hard | PRD + Architecture must exist (epics workflow validates) |
| Phase 3 → 4 | Hard | Implementation Readiness Check (adversarial, READY/NEEDS WORK/NOT READY) |

### Dev-Story Quality Gates (7 gates)

| Gate | When | What |
|------|------|------|
| Test-First Gate | Step 5 (RED) | Tests must FAIL before implementation |
| Green Gate | Step 5 (GREEN) | Tests must PASS after implementation |
| Refactor Gate | Step 5 (REFACTOR) | Tests must stay green after refactoring |
| Task Completion Gate | Step 8 | All 4 validation conditions must pass before marking [x] |
| Regression Gate | Steps 7, 9 | Full test suite must pass with zero regressions |
| Definition of Done Gate | Step 9 | 20-item checklist across 5 categories |
| Code Review Gate | Separate workflow | Adversarial review, minimum 3 findings, HIGH/MEDIUM must resolve |

### Definition of Done Checklist (20 items)

**Context and Requirements (4):** Story context completeness, architecture compliance, technical specifications, previous story learnings.

**Implementation (5):** All tasks complete, all ACs satisfied, no ambiguity, edge cases handled, dependencies within scope.

**Testing and Quality (7):** Unit tests, integration tests, E2E tests, coverage, regression prevention, code quality, test framework compliance.

**Documentation (5):** File List complete, Dev Agent Record updated, Change Log updated, review follow-ups completed, story structure compliance.

### TEA Quality Gates

| Gate | Mechanism |
|------|-----------|
| Traceability | PASS / CONCERNS / FAIL / WAIVED based on requirements-to-tests mapping |
| Test Review | 0-100 score across determinism, isolation, maintainability, coverage, performance |
| NFR Assessment | Per-category PASS / CONCERNS / FAIL for security, performance, reliability, scalability |
| CI Pipeline | P0 pass rate 100%, P1 >= 95% |

---

## 15. Key Corrections for CodeMAD Product Brief

Based on this research, the product brief needs these corrections to accurately describe the BMAD methodology:

### 15.1 Epic Structure

**Current (incorrect):** Implies frontend/backend work stream splitting at epic level.
**Correct:** Epics are organised by user value (vertical slices). Each epic delivers complete functionality for its domain. "Database Setup" and "API Development" are explicitly listed as wrong epic structures.

### 15.2 Two Story-Creation Stages

**Current:** Mentions stories being created but does not distinguish the two stages.
**Correct:** Phase 3 creates planning-level stories (WHAT — user stories with BDD acceptance criteria in `epics.md`). Phase 4 enriches each story into a dev-ready guide (HOW — tasks, subtasks, architecture guardrails, previous story intelligence, web-verified library versions in individual story files).

### 15.3 Parallelisation

**Current:** Describes "frontend and backend work streams running fully in parallel."
**Correct:** Parallelisation is at story level, not layer level. Multiple stories CAN run simultaneously if they touch different files. Tasks within a single story are strictly sequential (red-green-refactor). Test generation (API + E2E) runs in parallel via TEA subprocesses.

### 15.4 Testing Choice

**Current:** May not address TDD vs standard choice.
**Correct:** BMAD offers three testing approaches: (1) TEA ATDD for full TDD before implementation, (2) Dev-story built-in lightweight TDD during implementation, (3) Post-implementation test generation via Quinn or TEA automate. The dev-story workflow hardcodes TDD. There is no explicit user choice mechanism — the user picks implicitly by which workflow they invoke.

### 15.5 Sprint Management

**Current:** May not describe the sprint-status.yaml state machine.
**Correct:** Sprint-status.yaml is the single source of truth. The Sprint Status workflow acts as a router/hub. The story lifecycle is: `backlog → ready-for-dev → in-progress → review → done`. The Retrospective workflow creates an accountability loop between epics. Course Correction handles emergency changes with explicit before/after proposals.

### 15.6 Code Review

**Current:** May describe standard code review.
**Correct:** BMAD code review is adversarial by design. Minimum 3 issues per review. Recommends using a different LLM than the implementation agent. Cross-references git changes with story File List. Tasks marked complete but not implemented are CRITICAL severity.
