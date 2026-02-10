---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ['project.md']
session_topic: 'CodeMAD as a whole product - features, UX, business model, technical gaps, market positioning, risks, growth'
session_goals: 'Open exploration and discovery. No fixed direction. Let patterns emerge.'
selected_approach: 'ai-recommended-progressive-flow'
techniques_used: ['Question Storming', 'Morphological Analysis', 'SCAMPER', 'Chaos Engineering']
ideas_generated: [20]
context_file: '_bmad/bmm/data/project-context-template.md'
session_active: false
workflow_completed: true
---

# Brainstorming Session Results

**Facilitator:** Costa
**Date:** 2026-02-10

## Session Overview

**Topic:** CodeMAD as a whole product
**Goals:** Open exploration and discovery across all dimensions

### Context Guidance

_Project spec (project.md) loaded as primary context. CodeMAD is a desktop-first AI coding platform with the CodeMAD Protocol (4-phase methodology), three-tier agent hierarchy, git worktree isolation, LanceDB semantic search, 20+ LLM providers, and hybrid BMAD+GSD orchestration._

### Session Setup

_Wide-open brainstorming with no constraints. User chose hybrid AI-recommended + progressive flow approach. All product dimensions are fair game: features, UX, business model, technical architecture, market positioning, competitive threats, user pain points, and growth strategy._

## Technique Selection

**Approach:** AI-Recommended Progressive Flow (hybrid of approaches 2 and 4)
**Journey Design:** Questions > Space mapping > Transformation > Stress-testing

**Progressive Techniques:**

- **Phase 1 - Expansive Exploration:** Question Storming
- **Phase 2 - Pattern Recognition:** Morphological Analysis
- **Phase 3 - Idea Development:** SCAMPER
- **Phase 4 - Stress Test:** Chaos Engineering

---

## Phase 1: Question Storming Results

**Technique:** Question Storming
**Questions Generated:** 116
**Duration:** ~15 minutes of active facilitation

### Key Discovery

The project spec is more fluid than initially assumed. The tech stack (Tauri, Bun, SolidJS, LanceDB) is aspirational, not locked. This shifts the brainstorming scope from "polishing a plan" to "finding the plan."

### Thematic Clusters

| # | Theme | Count | Signal |
|---|-------|-------|--------|
| 1 | Who is this for and why do they care? | ~20 | Target audience undefined beyond "everyone" |
| 2 | What proves it works? | ~18 | No proof-of-concept yet; protocol is theoretical |
| 3 | Can Costa sustain this? | ~22 | Solo founder risk; maintenance burden of wide tech surface |
| 4 | What's the right tech/scope for v1? | ~25 | Tech stack open; MVP scope unclear |
| 5 | How do people find out and believe? | ~31 | No go-to-market strategy; story/narrative not articulated |

### Founder's Raw Questions (Most Valuable)

1. "Will I get visibility and traction?"
2. "Will this app work as I expect?"
3. "Will I be able to maintain it?"
4. "Will there be enough people contributing?"
5. "Will people believe in it?"

### Costa's Key Insights

- **Target:** Everyone. Non-technical users get AI-driven execution; technical users get enhanced thinking.
- **Revenue:** Free. No payment expected. (Sustainability question unresolved.)
- **Differentiation:** Methodology-driven output. Predictable. No spaghetti code.
- **First wow moment:** Brainstorming phase. Users see what's planned before building starts.
- **Memory:** Claude-mem system. 6 types, 7 concepts each. memU as contender. Project-scoped preferred.
- **Speed:** Three agents faster via parallel tokens-per-second, not context window size.
- **Protocol adoption:** Users want fast. They know fast = more iterations = more money. Protocol saves both.

---

## Phase 2: Morphological Analysis Results

**Technique:** Morphological Analysis
**Dimensions Mapped:** 6 primary + 3 sub-dimensions
**Combinations Explored:** 5 named combos + 3 sub-combos

### Revised Constraints (Discovered During Analysis)

- **Time:** Late-night solo coding sessions. Son sleeping. Every hour must count.
- **IP Protection:** Will not publish spec publicly. Fear of being copied and outpaced.
- **Rust Conviction:** Coding tools benefit from Rust's guardrails (process management, file handles, sandbox security). Architecture decision, not vanity.
- **AI-Augmented:** Not a solo dev. A solo dev with extensive 10x AI tooling knowledge.
- **Stealth Mode:** No build-in-public. No content marketing. Ship first, talk later.

### Matrix Collapse

| Dimension | Decision |
|-----------|----------|
| Target | Everyone (solo devs as beachhead) |
| Interface | Desktop app (Tauri) |
| Tech | Tauri + Rust backend + TS frontend (to discuss if best option) |
| Scope | Full protocol, layered releases (v0.1 > v1.0) |
| Revenue | Free for now. Zero-cost stack. |
| Growth | Viral moment (product launch) + organic community post-launch |

### Core Insight

> **The protocol IS the product. Everything else is infrastructure to deliver the protocol.**

The viral moment should demonstrate the protocol, not the technology. Nobody cares about Tauri or LanceDB. They care about watching an idea turn into a working product in one session.

### Release Layering Strategy

| Release | Ships | Proves |
|---------|-------|--------|
| v0.1 | Desktop shell + single chat + one provider | thech (assuming Tauri) works, talks to LLM |
| v0.2 | Full 4-phase pipeline | Complete thesis proven |
| v0.3 | Git worktree isolation + multi-agent | Parallel execution ships faster |
| v0.4 | Semantic code search | Context intelligence makes agents smarter |
| v1.0 | Polish + viral demo + public release | People want this |

---

## Phase 3: SCAMPER Results

**Technique:** SCAMPER Method
**Ideas Generated:** 22 across 7 lenses
**Core Concept Transformed:** "The Protocol IS the Product"

### Accepted Ideas (20/22)

**Substitute:**
- S#1: Dynamic phase selector (enter protocol at any phase, not forced linear)
- S#2: Automatic model router (task-based model selection, user never picks)
- S#3: Visual mind map brainstorming (interactive node graph alongside text)
- S#4: Continuous micro-review (real-time code review, not end-of-story)

**Combine:**
- C#1: Brainstorming + competitive analysis (auto-research during Analysis phase)
- C#2: Context Intelligence (unified memory + semantic search = one knowledge layer)
- C#3: Readiness gate + cost estimator (estimate API cost before Phase 4)
- C#4: Kanban + live agent activity (mission control dashboard)

**Adapt:**
- A#1: Game save states (branch entire decision history, not just code)
- A#2: Pre-flight checklists (visual readiness gate, green/yellow/red)
- A#3: Multi-track timeline (parallel agents visualised like DAW tracks)

**Modify/Magnify:**
- M#1: Code quality score (measurable "no spaghetti" promise, 0-100)
- M#2: Protocol certification badge ("Built with CodeMAD Protocol")
- M#3: Unlimited parallel agents (scale by API budget, not arbitrary cap)

**Put to Other Uses:**
- P#1: Protocol as teaching framework (bootcamps, CS courses)
- P#2: Code review agent as standalone GitHub Action (trojan horse)
- P#3: Brainstorming phase as standalone product validation tool

**Reverse:**
- R#1: TDD choice (user chooses test-driven or standard at the right point)
- R#3: Build CodeMAD with CodeMAD (dogfood once tool reaches expected level)

### Rejected Ideas (2/22)

- E#1: Eliminate UX Design phase -- REJECTED. Apps require UX and UI.
- E#2: Eliminate multi-provider -- REJECTED. Anthropic-only excludes users unwilling to pay for it.

### Modified Ideas

- R#1: Not forced. User gets asked at the appropriate point whether they want TDD or standard.
- R#2: User is already the lead by managing the orchestrator and monitoring for mistakes.
- C#2: Named "Context Intelligence" not "Project Brain."

---

## Phase 4: Chaos Engineering Results

**Technique:** Chaos Engineering
**Attack Vectors:** 6 structural vulnerabilities tested
**Survival Rate:** 6/6 (all addressed with counter-moves)

### Attack Vector 1: Solo Founder Kill Switch
**Threat:** Bus factor of 1. Rust + TS + Tauri + LanceDB is 5 specialisations for one person.
**Counter:** Uses AI extensively. Not a solo dev -- a solo dev with 10x tooling.
**Residual Risk:** Medium. AI doesn't fix the availability problem.
**Design Decision:** Keep Rust surface area minimal (Tauri shell + process/sandbox layer). Everything else in TypeScript.

### Attack Vector 2: Speed Perception Problem
**Threat:** Cursor gives a landing page in 90 seconds. CodeMAD is still brainstorming.
**Counter:** Users will judge OUTPUT, not process. Add Quick Flow from BMAD for small changes (skip phases 1-3).
**Residual Risk:** Low-medium. Quick Mode addresses small tasks. Output quality is the argument for large tasks.
**Design Decision:** Two tracks: Full Protocol (4 phases) and Quick Flow (skip to spec + build).

### Attack Vector 3: Open Source Paradox
**Threat:** MIT license allows well-funded fork to outpace solo founder.
**Counter:** AGPL-3.0. Forces forks to remain open source or pay to monetize.
**Residual Risk:** Low. Some enterprises avoid AGPL, but beachhead is indie devs.
**Design Decision:** License: AGPL-3.0 (changed from MIT).

### Attack Vector 4: Multi-Provider Maintenance
**Threat:** 7+ providers = 7+ breaking change surfaces.
**Counter:** Launch with 5: Anthropic, Google, OpenAI, Zhipu (GLM), Moonshot (Kimi). Vercel AI SDK as abstraction (to decide if use SDK or create a wrapper for all models rather than an SDK).
**Residual Risk:** Medium. 5 manageable. Chinese providers may need custom handling.
**Design Decision:** MVP: 5 providers. Add others post-launch by demand.

### Attack Vector 5: The "Everyone" Trap
**Threat:** "Everyone" = nobody specific.
**Counter:** One product. Protocol adapts to skill level. No persona splitting.
**Residual Risk:** High. Most exposed vector. `user_skill_level` must do real work.
**Design Decision:** Single product. UX adapts through the protocol itself.

### Attack Vector 6: Context Window Arms Race
**Threat:** 2M-token windows make multi-agent architecture unnecessary.
**Counter:** YAGNI. Parallel agents are about speed, not just context. Adapt when needed.
**Residual Risk:** Low. Protocol value is methodology, not architecture.
**Design Decision:** Keep three-tier architecture. Reassess when models change.

---

## Idea Organisation and Prioritisation

### Theme 1: Protocol and Workflow Design

| Idea | Impact |
|------|--------|
| Dynamic phase selector | Users with existing PRDs or code skip to where they need |
| Quick Flow track | Kills speed perception for bug fixes and small tasks |
| TDD choice | Respects experienced devs without forcing beginners |
| Cost estimator at readiness gate | Builds trust. Prevents bill shock. |
| Pre-flight checklist | Makes abstract "readiness" tangible |

### Theme 2: Context Intelligence

| Idea | Impact |
|------|--------|
| Unified memory + semantic search | One knowledge layer. Agents search code AND decisions. |
| Automatic model router | User never picks a model. Optimal selection per task. |
| Continuous micro-review | Catches problems during writing, not after. |
| Auto competitive analysis | Brainstorming enriched with real market data. |

### Theme 3: Visual Experience and UX

| Idea | Impact |
|------|--------|
| Visual mind map brainstorming | Immediately different from every chat-only tool. Shareable. |
| Multi-track agent timeline | Makes invisible multi-agent work visible and controllable |
| Kanban + live agent activity | Mission control. Manage humans and AI agents alike. |
| Game save states | Branch decision history. Try alternative architectures. |
| Code quality score (0-100) | "No spaghetti" becomes measurable. |

### Theme 4: Product Strategy (Decisions Made)

| Decision | Detail |
|----------|--------|
| License | AGPL-3.0 |
| Stack | Tauri + Rust (thin) + TypeScript |
| MVP Providers | Anthropic, Google, OpenAI, Zhipu, Moonshot |
| Protocol Tracks | Full Protocol + Quick Flow |
| Target | Everyone. Single product. Protocol adapts. |
| Growth | Stealth > Ship > Viral > Community |
| Releases | Layered v0.1 > v1.0 |

### Theme 5: Ecosystem and Growth (Future)

| Idea | Trigger |
|------|---------|
| Protocol certification badge | When protocol has proven results |
| Code review agent as GitHub Action | When code review is extractable |
| Brainstorming as standalone web demo | When brainstorming phase is polished |
| Protocol as teaching framework | Post-traction. Partnership opportunity. |
| Unlimited parallel agents | When worktree system is rock-solid |
| Build CodeMAD with CodeMAD | When tool reaches expected level |

### Breakthrough Concepts

1. **"The Protocol IS the Product"** -- Everything else is infrastructure. The viral moment demonstrates methodology, not technology.
2. **Context Intelligence** -- Unified memory + semantic search. Agents search code AND decisions as one knowledge layer.
3. **Two-Track Protocol** -- Full Protocol for big work, Quick Flow for small changes. Resolves speed perception completely.
4. **Visual Brainstorming Surface** -- Interactive mind maps during Phase 1. The screenshot that sells CodeMAD.

---

## Prioritisation

### Must-Have for MVP

| # | Idea | Why |
|---|------|-----|
| 1 | Two-track protocol (Full + Quick Flow) | Without this, users leave at "too slow" |
| 2 | Context Intelligence (unified memory + search) | Core differentiator. Makes agents smarter. |
| 3 | Automatic model router | Removes a decision users shouldn't make. Saves money. |
| 4 | Cost estimator at readiness gate | Trust builder. Nobody else does this. |
| 5 | Pre-flight checklist (visual readiness gate) | Makes the protocol tangible |

### Should-Have for v1.0

| # | Idea | Why |
|---|------|-----|
| 6 | Visual mind map brainstorming | The shareable screenshot. Marketing differentiator. |
| 7 | Kanban + live agent activity | Users need to see what agents are doing |
| 8 | Code quality score | Makes "no spaghetti" measurable |
| 9 | Dynamic phase selector | Power users need flexibility |
| 10 | TDD choice | Respects different workflows |

### Future Plays

| Idea | Trigger |
|------|---------|
| Multi-track agent timeline | When parallel worktrees ship |
| Game save states | When decision branching has demand |
| Continuous micro-review | When code review agent is mature |
| Certification badge | When protocol has proven results |
| Standalone GitHub Action | When code review is extractable |
| Standalone brainstorming web demo | When brainstorming phase is polished |

---

## Unresolved Risks

| Risk | Severity | When to Address |
|------|----------|-----------------|
| Going public timing (when to open the repo) | High | Before v1.0 launch |
| "Everyone" UX adaptation mechanism | High | During UX design phase |
| Revenue model for sustainability | High | After traction data exists |
| AGPL impact on enterprise adoption | Medium | Post-MVP if enterprise interest |
| Chinese provider SDK maintenance | Medium | Post-MVP based on demand |

---

## Session Summary

### Key Achievements

- **116 questions** surfaced 5 thematic clusters and the founder's core fears
- **Morphological analysis** collapsed 4,096 theoretical combinations to a focused path
- **20 SCAMPER ideas** accepted, transforming "protocol is the product" into concrete features
- **6 attack vectors** stress-tested; all survived with counter-moves and design decisions
- **8 concrete decisions** locked (license, stack, providers, protocol tracks, target, growth, releases)

### Creative Facilitation Narrative

_Costa arrived with no fixed direction -- "I don't know, I'm here to brainstorm." Through Question Storming, the session revealed that the project spec was more fluid than assumed, with tech stack and scope still open. The founder's raw questions ("Will people believe in it?") shifted the session from product features to existential product-market fit. Morphological analysis collapsed the possibility space by introducing real constraints: limited nightly hours, IP protection fears, and a conviction that Rust provides genuine architectural guardrails for coding tools. SCAMPER generated 22 transformation ideas, of which 20 survived founder review. The strongest -- Context Intelligence, Two-Track Protocol, and Visual Brainstorming -- became the session's breakthrough concepts. Chaos Engineering exposed the "Everyone" trap as the highest-risk vector and locked AGPL-3.0 as the license after stress-testing the open source paradox. The session's core insight: the protocol IS the product, and everything else is infrastructure to deliver it._

### Decisions Changed from Original Spec

| Area | Original Spec | After Brainstorming |
|------|---------------|---------------------|
| License | MIT | AGPL-3.0 |
| Providers at MVP | 20+ | 5 (Anthropic, Google, OpenAI, Zhipu, Moonshot) |
| Protocol flexibility | Linear 4-phase only | Two tracks: Full Protocol + Quick Flow |
| Memory system | "Memory layer" | Context Intelligence (unified memory + semantic search) |
| TDD | Implied by protocol | Explicit user choice at appropriate point |
| Tech stack | Bun + SolidJS + LanceDB (aspirational) | Tauri + Rust (thin) + TypeScript. UI framework TBD. |

### Next Steps

1. **Update project.md** with decisions from this session
2. **Begin v0.1** -- Tauri desktop shell + single chat + Anthropic provider
3. **Design Context Intelligence architecture** -- unified memory + semantic search
4. **Prototype brainstorming visual** -- even a rough mind map proves the concept
5. **Define user_skill_level behaviour** -- how the protocol adapts per skill level
