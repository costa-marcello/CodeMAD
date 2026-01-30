# Roadmap: CodeMAD

## Milestones

- ✅ **v1.0 Fork Foundation** — Phase 1 (shipped 2026-01-30) → [archive](milestones/v1.0-ROADMAP.md)
- 📋 **v1.1 Context Intelligence** — Phases 2-6 (planned)

## Phases

<details>
<summary>✅ v1.0 Fork Foundation (Phase 1) — SHIPPED 2026-01-30</summary>

- [x] Phase 1: Fork Foundation (5/5 plans) — completed 2026-01-30

See [milestones/v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md) for full details.

</details>

### 📋 v1.1 Context Intelligence (Planned)

- [ ] **Phase 2: Context Intelligence** — Vector embeddings and semantic code search
- [ ] **Phase 3: Parallel Execution** — Git worktree multi-agent orchestration
- [ ] **Phase 4: Code Review** — Per-hunk approval workflow
- [ ] **Phase 5: GSD Workflow** — Discuss/Plan/Execute/Verify methodology
- [ ] **Phase 6: Polish & Security** — Privacy, security, UX refinements

---

## Phase Details

### Phase 2: Context Intelligence

**Goal**: Users can search their codebase by meaning, not just keywords
**Depends on**: Phase 1 ✓
**Requirements**: CTX-01, CTX-02, CTX-03, CTX-04, CTX-06
**Estimated Duration**: 3-4 weeks
**Risk Level**: MEDIUM (embedding model selection needs benchmarking)

**Success Criteria** (what must be TRUE):

1. User can search for code by describing what it does
2. Codebase is automatically indexed when files change
3. User can use @file, @codebase, @docs syntax to inject context
4. Search combines vector similarity with LSP symbol information
5. Embedding tier auto-detected based on available hardware

Plans:

- [ ] 02-01: Integrate LanceDB for vector storage
- [ ] 02-02: Implement codebase indexing with file watcher
- [ ] 02-03: Build hybrid search (vector + LSP) and context injection syntax

---

### Phase 3: Parallel Execution

**Goal**: Multiple AI agents work on different tasks simultaneously in isolated git worktrees
**Depends on**: Phase 2 (needs codebase context to assign work)
**Requirements**: PAR-01, PAR-02, PAR-03, PAR-04, PAR-05, PAR-06, PAR-07, PAR-08
**Estimated Duration**: 4-6 weeks
**Risk Level**: HIGH (conflict resolution is complex, novel architecture)

**Success Criteria** (what must be TRUE):

1. User can spawn multiple agents, each working in its own git worktree
2. User can see progress of all running agents in a unified view
3. System detects file conflicts between worktrees before merge
4. Completed worktrees auto-merge back to main branch (with user approval)
5. Agent execution stops automatically after configurable step limit
6. User can pause, resume, or cancel any running agent
7. User receives notification when background agent completes

Plans:

- [ ] 03-01: Git worktree management layer
- [ ] 03-02: Agent coordinator with isolated execution contexts
- [ ] 03-03: Conflict detection and auto-merge workflow
- [ ] 03-04: Progress tracking UI and agent controls

---

### Phase 4: Code Review

**Goal**: Users can approve or reject AI changes at the individual hunk level
**Depends on**: Phase 3 (review applies to changes from parallel agents)
**Requirements**: REV-01, REV-02, REV-03, REV-04, REV-05, REV-06
**Estimated Duration**: 3-4 weeks
**Risk Level**: MEDIUM (UI complexity, but patterns exist in market)

**Success Criteria** (what must be TRUE):

1. User sees each diff broken into individual hunks with accept/reject buttons
2. User can ask "Why did you change this?" and get explanation for any hunk
3. User can undo the last applied change with a single command
4. User can restore project to any previous checkpoint
5. System flags semantic conflicts (logic issues git merge would miss)

Plans:

- [ ] 04-01: Per-hunk diff parser and data model
- [ ] 04-02: Hunk review UI with accept/reject/explain
- [ ] 04-03: Checkpoint system and undo functionality
- [ ] 04-04: Logic conflict detection

---

### Phase 5: GSD Workflow

**Goal**: Users have a structured methodology that guides them from idea to shipped product
**Depends on**: Phase 4 (verification needs review system)
**Requirements**: GSD-01, GSD-02, GSD-03, GSD-04, GSD-05, GSD-06, CTX-05, CTL-01, CTL-02, CTL-03
**Estimated Duration**: 6-8 weeks
**Risk Level**: HIGH (novel methodology, requires iteration to get right)

**Success Criteria** (what must be TRUE):

1. User's workflow is guided through Discuss, Plan, Execute, Verify phases
2. After execution, system verifies the GOAL was achieved, not just tasks completed
3. Failed verification automatically generates a fix plan (gap closure)
4. System escalates to human after repeated fix attempts
5. Project structure uses .planning/ conventions
6. Decisions and context persist across sessions and are retrievable
7. User can set permission level: Guardian, Balanced, Autopilot

Plans:

- [ ] 05-01: Workflow state machine (Discuss/Plan/Execute/Verify)
- [ ] 05-02: Goal-backward verification engine
- [ ] 05-03: .planning/ file management and cross-session memory
- [ ] 05-04: Permission levels and reasoning depth controls
- [ ] 05-05: Gap closure loop and fix-loop detection

---

### Phase 6: Polish & Security

**Goal**: CodeMAD is production-ready with proper security and UX polish
**Depends on**: Phase 5
**Requirements**: SEC-01, SEC-02, SEC-03, SEC-04, UX-01, UX-02, UX-03
**Estimated Duration**: 4 weeks
**Risk Level**: LOW (known patterns, refinement work)

**Success Criteria** (what must be TRUE):

1. User can choose between local-only mode and optional cloud sync
2. Agent execution is sandboxed with configurable filesystem boundaries
3. System warns user when secrets are detected in files or git history
4. Credentials are stored in OS keychain, never plaintext
5. Command palette provides access to all actions
6. Accessibility modes work: NO_COLOR, SCREEN_READER, HIGH_CONTRAST
7. User sees estimated costs before committing expensive operations

Plans:

- [ ] 06-01: Privacy controls and data retention settings
- [ ] 06-02: Agent sandbox and secret detection
- [ ] 06-03: Command palette and accessibility refinements
- [ ] 06-04: Cost visibility and final UX polish

---

## Progress

**Execution Order:** Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase                   | Milestone | Plans Complete | Status      | Completed  |
| ----------------------- | --------- | -------------- | ----------- | ---------- |
| 1. Fork Foundation      | v1.0      | 5/5            | ✅ Complete | 2026-01-30 |
| 2. Context Intelligence | v1.1      | 0/3            | Not started | -          |
| 3. Parallel Execution   | v1.1      | 0/4            | Not started | -          |
| 4. Code Review          | v1.1      | 0/4            | Not started | -          |
| 5. GSD Workflow         | v1.1      | 0/5            | Not started | -          |
| 6. Polish & Security    | v1.1      | 0/4            | Not started | -          |

**Total:** 5/25 plans complete

---

_Created: 2026-01-30_
_Strategy: Fork of OpenCode (MIT)_
