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

_Project spec (project.md) loaded as primary context. CodeMAD is a desktop-first AI coding platform with the CodeMAD Protocol (4-phase methodology), four-tier agent hierarchy (Orchestrator → Phase → Specialist → Researcher), git worktree isolation, LanceDB semantic search, 20+ LLM providers, and hybrid BMAD+GSD orchestration._

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

The project spec is more fluid than initially assumed. The tech stack (Tauri, Bun, SolidJS, LanceDB) is aspirational, not locked. This shifts the brainstorming scope from "polishing a plan" to "finding the plan." **[EVOLUTION - Feb 10, 2026]:** SolidJS evolved to Svelte 5 during technical research (30-40% less code, native SSE support, better bundle size). Bun confirmed as high-confidence after Anthropic acquisition (Dec 2025) and use in Claude Code as Tauri sidecar. 34% native dep failure rate remains the primary risk.

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

- **Target:** Experienced vibecoders and developers with any experience level. The autonomous AI coding trend means even 5+ year developers use autopilot mode. Excludes non-technical founders (Bolt/Lovable territory).
- **Revenue:** Fully free at launch (BYOK). Paid tier introduced later once traction proves what users value. Architecture includes hooks for future gating.
- **Differentiation:** Methodology-driven output. Predictable. No spaghetti code. **[EVOLUTION - Feb 10, 2026]:** Market research found Tessl ($750M), Kiro (250K+ users), Spec Kit (50K+ stars) contesting the structured methodology space. CodeMAD's advantage is unique integration (methodology + orchestration + desktop + privacy + tool-agnostic), not unique methodology.
- **First wow moment:** Brainstorming phase. Users see what's planned before building starts.
- **Memory:** Claude-mem system. 6 types, 7 concepts each. memU as contender. Project-scoped preferred. **[EVOLUTION - Feb 10, 2026]:** Evolved to three-layer architecture: cross-session (LanceDB custom), within-session (Blackboard MCP), inter-agent (task list + blackboard events). memU evaluated and rejected (Python-only).
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
- **Launch Strategy:** Staged stealth: Costa-only alpha → 5-10 hand-picked testers at beta → 20-50 at v0.2 → public at v0.3+.

### Matrix Collapse

| Dimension | Decision |
|-----------|----------|
| Target | Experienced vibecoders and developers with any experience level (excludes non-technical founders) |
| Interface | Desktop app (Tauri) |
| Tech | Tauri + Rust backend + TS frontend (to discuss if best option) |
| Scope | Full protocol, layered releases (v0.1 > v1.0) |
| Revenue | Fully free at launch (BYOK). Paid tier later after traction proves value. Architecture includes hooks for future gating. |
| Growth | Viral moment (product launch) + organic community post-launch **[EVOLUTION - Feb 10, 2026]:** Market research sharpened this: the first 30 minutes of use are existentially important. "Week one wall" -- most free-to-paid conversions happen within week one. |

### Core Insight

> **The protocol IS the product. Everything else is infrastructure to deliver the protocol.**

**[EVOLUTION - Feb 10, 2026]:** Research elevated this to triple value: (1) Product differentiator -- no competitor has structured methodology pipeline, (2) Legal defence -- human authorship gates create copyright protection for users' code, (3) Regulatory compliance -- phase documentation satisfies EU AI Act transparency requirements.

The viral moment should demonstrate the protocol, not the technology. Nobody cares about Tauri or LanceDB. They care about watching an idea turn into a working product in one session.

### Release Layering Strategy

| Release | Ships | Proves |
|---------|-------|--------|
| v0.1 | Desktop shell + single chat + one provider | thech (assuming Tauri) works, talks to LLM |
| v0.2 | Full 4-phase pipeline | Complete thesis proven |
| v0.3 | Git worktree isolation + multi-agent | Parallel execution ships faster |
| v0.4 | Semantic code search | Context intelligence makes agents smarter |
| v1.0 | Polish + viral demo + public release | People want this |

**[EVOLUTION - Feb 10, 2026]:** Release plan refined to 7 releases (v0.1-alpha, v0.1-beta, v0.2, v0.3, v0.4, v0.5, v1.0) with alpha/beta stages. Total estimate: 8-12 months.

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
**Design Decision:** Keep Rust surface area minimal (Tauri shell + process/sandbox layer). Everything else in TypeScript. **[EVOLUTION - Feb 10, 2026]:** Technical research added a three-layer permission model: Rust capability gates, sidecar application permissions, frontend user approval. Research also adds Erlang-inspired restart policies with specific retry limits and timeouts per process type.

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
**Counter:** Launch with 5: Anthropic, Google, OpenAI, Zhipu (GLM), Moonshot (Kimi). Vercel AI SDK as abstraction (to decide if use SDK or create a wrapper for all models rather than an SDK). **[EVOLUTION - Feb 10, 2026]:** Credential storage evolved to OS-native keychains via tauri-plugin-keyring. Strictly better security than file-based storage. Credential rotation/expiry/401 monitoring across 5 providers still needs architecture design.
**Residual Risk:** Medium. 5 manageable. Chinese providers may need custom handling.
**Design Decision:** MVP: 5 providers. Add others post-launch by demand.

### Attack Vector 5: The "Everyone" Trap
**Threat:** "Everyone" = nobody specific.
**Counter:** One product. Protocol adapts to skill level. No persona splitting. Target narrowed to experienced vibecoders and developers with any experience level (excludes non-technical founders).
**Residual Risk:** Medium. Narrower target reduces scope while keeping broad developer appeal.
**Design Decision:** Single product. UX adapts through the protocol itself.

### Attack Vector 6: Context Window Arms Race
**Threat:** 2M-token windows make multi-agent architecture unnecessary.
**Counter:** YAGNI. Parallel agents are about speed, not just context. Adapt when needed.
**Residual Risk:** Low. Protocol value is methodology, not architecture.
**Design Decision:** Keep four-tier architecture (Orchestrator → Phase → Specialist → Researcher). Token budgets are soft targets (120-150k/100k/100k/150k). MCP lazy loading with ToolSearch-style mechanism is the primary lever to stay under targets. Reassess when models change. **[EVOLUTION - Feb 10, 2026]:** Research adds formal state machine design: XState v5 for complex agents, enum-based for simple agents.

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
| Target | Experienced vibecoders and developers with any experience level. Single product. Protocol adapts. |
| Growth | Staged stealth (Costa → 5-10 testers → 20-50 → public) > Viral > Community |
| Releases | Layered v0.1 > v1.0 **[EVOLUTION - Feb 10, 2026]:** Refined to 7 releases (v0.1-alpha, v0.1-beta, v0.2, v0.3, v0.4, v0.5, v1.0) with alpha/beta stages. Total estimate: 8-12 months. |

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

**[EVOLUTION - Feb 10, 2026]:** MCP became the first-class plugin system with lazy loading, proxy-mediated access, and lifecycle management. Also MCP server exposure strategy: CodeMAD protocol phases exposed as MCP tools for ecosystem distribution.

---

## Unresolved Risks

| Risk | Severity | When to Address |
|------|----------|-----------------|
| Going public timing (when to open the repo) | High | Before v1.0 launch |
| Revenue model timing (when to introduce paid tier) | High | After traction data exists **[EVOLUTION - Feb 10, 2026]:** Market research provides $7.37B (2025), growing at 26.6% CAGR to $23.97B by 2030. Multi-agent systems at 52.4% CAGR. |
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
| Memory system | "Memory layer" | Context Intelligence (unified memory + semantic search) **[EVOLUTION - Feb 10, 2026]:** Evolved to three-layer architecture: cross-session (LanceDB custom), within-session (Blackboard MCP), inter-agent (task list + blackboard events). |
| TDD | Implied by protocol | Explicit user choice at appropriate point |
| Tech stack | Bun + SolidJS + LanceDB (aspirational) | Tauri + Rust (thin) + TypeScript. UI framework TBD. **[EVOLUTION - Feb 10, 2026]:** UI framework resolved to Svelte 5. Bun confirmed as high-confidence after Anthropic acquisition (Dec 2025). |

### Next Steps

1. **Update project.md** with decisions from this session
2. **Begin v0.1** -- Tauri desktop shell + single chat + Anthropic provider
3. **Design Context Intelligence architecture** -- unified memory + semantic search
4. **Prototype brainstorming visual** -- even a rough mind map proves the concept
5. **Define user_skill_level behaviour** -- how the protocol adapts per skill level

---

## Post-Reconciliation Amendments

**Date:** 2026-02-10
**Reason:** Reconciliation of brainstorming session outcomes against technical research findings and domain research

These four decisions were made after comparing the original brainstorming session against the completed research phase. They refine or clarify decisions captured during brainstorming.

### Decision R1: Target Audience Refinement

**Original:** "Everyone" — non-technical users get AI-driven execution; technical users get enhanced thinking.

**Updated:** Experienced vibecoders and developers with any experience level.

**Rationale:** The autonomous AI coding trend (Cursor, Windsurf, Copilot) means even 5+ year developers use autopilot mode. Non-technical founders are served by Bolt and Lovable. CodeMAD's methodology-driven approach has strongest appeal to developers who understand what spaghetti code costs. This resolves the "Everyone Trap" risk vector identified in Chaos Engineering (Attack Vector 5).

### Decision R2: Revenue Model Clarity

**Original:** "Free for now. No payment expected. (Sustainability question unresolved.)"

**Updated:** Fully free at launch (BYOK). Paid tier introduced later once traction proves what users value. Architecture includes hooks for future gating.

**Rationale:** Traction must prove what features drive retention before introducing paid tiers. Free BYOK at launch removes adoption friction. Architecture planning must include extensibility hooks for future monetization without requiring re-architecture.

### Decision R3: Agent Hierarchy and Token Budget Model

**Original:** Three-tier agent hierarchy (Orchestrator → Phase → Worker). Token budgets not specified in brainstorming document.

**Updated:** Four-tier agent hierarchy (Orchestrator → Phase → Specialist → Researcher). Token budgets are soft targets, not hard limits: Orchestrator 120-150k, Phase 100k, Specialist 100k, Researcher 150k. MCP lazy loading with ToolSearch-style mechanism is the primary lever to stay under targets.

**Rationale:** Research identified the need for a dedicated Researcher tier for domain and competitive intelligence gathering. Token budgets shifted from hard limits to soft targets after recognizing that MCP lazy loading (load tools on-demand) provides better control than artificial caps. This aligns with the blackboard pattern for agent coordination.

### Decision R4: Launch Strategy Staged Rollout

**Original:** "Stealth Mode: No build-in-public. No content marketing. Ship first, talk later."

**Updated:** Staged stealth: Costa-only alpha → 5-10 hand-picked testers at beta → 20-50 at v0.2 → public at v0.3+.

**Rationale:** Pure stealth until v1.0 is too risky. Staged rollout with hand-picked testers at each milestone allows for feedback loops without public exposure. The v0.3+ public release timing aligns with the point where the full protocol (Analysis + Planning + Test Design + Implementation) has proven stable in real-world use.

---

### Research-Discovered Gaps (Not Anticipated in Brainstorming)

The following 14 gaps were identified during research phases but were not anticipated in the original brainstorming session. They represent critical requirements, risks, and opportunities that must be addressed in architecture planning.

#### Regulatory & Legal (brainstorming had zero coverage)

**EU AI Act compliance**
Transparency deadline Aug 2, 2026. Must label AI-generated content in UI and document human vs AI contributions per protocol phase. Penalties up to 10M EUR or 2% annual turnover. CodeMAD's protocol phases naturally create this documentation but it must be explicit in UI design. Source: Domain research.

**AI code copyright defence**
Purely AI-generated code is not copyrightable (Thaler v. Perlmutter). ~35% of AI code has licensing irregularities. CodeMAD's human decision gates at each phase create "substantial human participation" evidence -- the strongest IP defence in the market. The protocol is simultaneously a product feature, legal defence, and regulatory compliance mechanism. Source: Domain research.

**Code signing logistics**
macOS requires code signing + notarisation ($99/year). Windows needs EV cert (~$200-500/year). Cert validity max 459 days from Feb 23, 2026. ~$300/year budget needed. Hard blocker for public distribution. Source: Domain research.

**OWASP / SLSA compliance**
OWASP Top 10 is "effectively required" for the Hono + tRPC API server. SLSA supply chain integrity is "increasingly expected" for open source projects. Source: Domain research.

#### Technical Architecture (brainstorming didn't address)

**Credential rotation / 401 monitoring**
Storage is covered (keychain), but rotation, expiry detection, and automated 401/403 monitoring across 5 providers is not designed. Five providers means five different auth patterns and error responses. Source: Tech research.

**Handoff message pairing**
LLMs need tool call + response pairs during agent handoffs or they hallucinate. Research discovered the Narrative Casting pattern. Must be formalised as an architecture requirement. Source: Tech research.

**CQRS for agent auditing**
Separating command and query paths enables audit trails of every agent action without impacting performance. Complements the blackboard pattern for "continuous micro-review." Source: Reconciliation analysis.

**Semantic cache thresholds**
Use 0.95+ similarity for code generation queries (high precision), 0.85-0.90 for chat queries (broader recall). Source: Reconciliation analysis.

**MCP server strategy**
MCP market at $1.8B, adopted by OpenAI, Anthropic, and major IDEs. CodeMAD should expose protocol phases as MCP tools, not just consume MCP as a client. Other tools could invoke CodeMAD's methodology. Distribution mechanism. Source: Domain research.

#### Market & Competitive (brainstorming didn't anticipate)

**Spec-driven competition**
Tessl at $750M valuation, Kiro with 250K+ users, Spec Kit with 50K+ stars. Brainstorming treated the methodology gap as uncontested -- it is being contested. CodeMAD's advantage is unique integration (methodology + orchestration + desktop + privacy + tool-agnostic), not unique methodology. Source: Market research.

**Trust crisis as market signal**
Developer trust dropped from 43% to 33%. "Usage up, trust down" is the defining market signal. CodeMAD's methodology directly addresses this. Source: Market research.

**Local model support (Ollama)**
42% of developers run local models. Ollama is the industry standard. MoE models enable zero-cost operation. The automatic model router must include local models as first-class options. Source: Domain research.

**Data flywheel disadvantage**
Privacy-first means no telemetry. Competitors with more users generate more training data. CodeMAD's counter: "protocol quality comes from methodology, not data." Community feedback loops may partially substitute. Long-term risk. Source: Domain research.

**Background automation pattern**
OpenAI Codex introduced agents working on schedules without human triggers. All brainstorming ideas assume human-initiated workflows. Future extension point for Quick Flow. Source: Domain research.

---

### Research Evolutions

The following 13 evolutions were identified during the three research phases (technical, market, domain) and reconciliation. They are annotated inline throughout this document with `**[EVOLUTION - Feb 10, 2026]:**` markers.

1. **Memory system** -- Evolved from "Claude-mem + memU" to three-layer architecture: cross-session (LanceDB custom), within-session (Blackboard MCP), inter-agent (task list + blackboard events). memU rejected (Python-only).
2. **UI framework** -- SolidJS evolved to Svelte 5 during technical research (30-40% less code, native SSE support, better bundle size).
3. **Viral moment / growth** -- Market research sharpened growth strategy: first 30 minutes are existentially important. "Week one wall" drives free-to-paid conversion.
4. **Competitive positioning** -- Methodology space is contested by Tessl ($750M), Kiro (250K+ users), Spec Kit (50K+ stars). CodeMAD's advantage is unique integration, not unique methodology.
5. **Bun runtime** -- Confirmed as high-confidence after Anthropic acquisition (Dec 2025) and use in Claude Code as Tauri sidecar. 34% native dep failure rate remains the primary risk.
6. **Security model** -- Technical research added three-layer permission model: Rust capability gates, sidecar application permissions, frontend user approval.
7. **Credential storage** -- Evolved to OS-native keychains via tauri-plugin-keyring. Rotation/expiry/401 monitoring still needs architecture design.
8. **MCP plugin system** -- MCP became first-class plugin system with lazy loading, proxy-mediated access, and lifecycle management. Also MCP server exposure strategy for ecosystem distribution.
9. **Process supervision** -- Research adds Erlang-inspired restart policies with specific retry limits and timeouts per process type.
10. **Release strategy** -- Refined from 5 releases to 7 releases (v0.1-alpha through v1.0) with alpha/beta stages. Total estimate: 8-12 months.
11. **Agent state machines** -- Research adds formal state machine design: XState v5 for complex agents, enum-based for simple agents.
12. **Triple-value framing** -- Protocol elevated to triple value: product differentiator, legal defence (copyright protection), regulatory compliance (EU AI Act transparency).
13. **Market sizing** -- Market research provides $7.37B (2025), growing at 26.6% CAGR to $23.97B by 2030. Multi-agent systems at 52.4% CAGR.

---

### Second Reconciliation Sweep Gaps (Feb 10, 2026)

The following 17 gaps were identified during a second reconciliation sweep across all research artifacts. They represent requirements not covered by the original 14 research-discovered gaps above. Grouped by category and priority tier.

#### Technical Architecture Gaps (v0.1 MUST)

**1. Agent failure recovery / checkpointing**
Crash mid-phase must resume from checkpoint, not restart. Parallel agents make this harder -- partial completion state must be preserved. Without this, any network blip or provider outage wastes the entire phase's token spend. Source: Second reconciliation sweep (Feb 10, 2026).

**2. Rate limiting / backpressure across 5 providers**
Each provider has different rate limits, retry semantics, and error codes. The automatic model router must handle provider-specific throttling, including graceful fallback to alternate providers when one is rate-limited. Source: Second reconciliation sweep (Feb 10, 2026).

**3. Token usage tracking per task**
Per-task cost attribution across parallel agents. The cost estimator (SCAMPER idea C#3) needs granular tracking to show users what each phase and agent actually consumed. Without this, the cost estimator is a guess, not a measurement. Source: Second reconciliation sweep (Feb 10, 2026).

**4. Error UX for multi-agent failures**
What does the user see when one of several parallel agents fails? The mission control dashboard (SCAMPER idea C#4) must handle partial failure states clearly. A single red banner is not enough when three agents are running and one crashes. Source: Second reconciliation sweep (Feb 10, 2026).

**5. Offline / degraded mode**
Wifi drops mid-Phase 4. Graceful degradation must preserve work-in-progress, queue unsent requests, and resume when connectivity returns. Desktop-first positioning means users expect offline resilience that web tools cannot offer. Source: Second reconciliation sweep (Feb 10, 2026).

#### Technical Architecture Gaps (v0.2 SHOULD)

**6. Auto-update mechanism**
Tauri updater strategy: silent, prompted, or forced updates. Staged stealth rollout (R4) requires controlled update channels for alpha/beta/public tiers. Source: Second reconciliation sweep (Feb 10, 2026).

**7. Crash reporting during staged stealth**
Opt-in diagnostics for beta testers. Privacy-first positioning conflicts with the need for diagnostic data during the 5-10 tester beta phase. Must be explicitly opt-in with clear data scope. Source: Second reconciliation sweep (Feb 10, 2026).

**8. Multi-project / workspace support**
Per-project isolation of LanceDB indices, Blackboard state, and agent contexts. Without this, switching between projects risks cross-contamination of semantic search results and agent memory. Source: Second reconciliation sweep (Feb 10, 2026).

**9. Accessibility (a11y)**
Screen reader support, keyboard navigation, and colour contrast in WebView. Desktop apps have higher a11y expectations than web tools. Tauri's WebView inherits browser a11y primitives but needs explicit implementation. Source: Second reconciliation sweep (Feb 10, 2026).

#### Technical Architecture Gaps (v0.3+ TRACK)

**10. Protocol versioning**
Backwards compatibility when the protocol evolves across releases. Users who started projects on v0.2's protocol format must not break when upgrading to v0.3. Migration paths needed for protocol artifacts. Source: Second reconciliation sweep (Feb 10, 2026).

**11. Extension API beyond MCP**
Custom phases, agent types, and quality rules. MCP covers tool integration, but power users may want to define custom protocol phases or plug in their own agent logic. Track demand before building. Source: Second reconciliation sweep (Feb 10, 2026).

#### Market & Competitive Gaps

**12. Import / migration from competitors**
Import specs from Kiro, Spec Kit, and similar tools. Reducing switching costs accelerates adoption. Even a basic "paste your existing spec" import lowers the barrier from competitor tools. Source: Second reconciliation sweep (Feb 10, 2026).

**13. Collaboration / multi-developer support**
Multiple developers on the same project. Brainstorming assumed solo use. The staged stealth rollout will surface this need when beta testers work on team projects. Track for v0.3+. Source: Second reconciliation sweep (Feb 10, 2026).

**14. Token usage transparency as positioning**
Showing per-task costs builds trust vs subscription-based competitors. "You spent $0.47 on this feature" is a powerful counter-narrative to Cursor's $20/month when users do light work. Requires item #3 (token tracking) as a prerequisite. Source: Second reconciliation sweep (Feb 10, 2026).

#### Domain Gaps

**15. Accessibility (a11y) compliance**
EU accessibility requirements alongside AI Act. The European Accessibility Act (EAA) applies to software products from June 2025. Overlaps with technical gap #9 but adds legal compliance dimension. Source: Second reconciliation sweep (Feb 10, 2026).

**16. Internationalisation (i18n)**
Two of the five MVP providers are Chinese (Zhipu, Moonshot). UI is English-only for now, but i18n architecture should not be bolted on later. String extraction and RTL-aware layout from v0.1. Source: Second reconciliation sweep (Feb 10, 2026).

**17. Crash reporting opt-in**
Privacy-first positioning vs diagnostic data tension. Overlaps with technical gap #7 but adds the domain dimension: GDPR and privacy regulations constrain what telemetry can be collected even with opt-in. Data minimisation principle applies. Source: Second reconciliation sweep (Feb 10, 2026).

---

## Technical Design Seeds (from project.md)

_These concepts were captured in the original project spec (project.md, now deleted). They serve as starting points for the architecture document. Where contradictions existed, brainstorming decisions take precedence._

### Feature Inventory

| Feature | Description |
|---------|-------------|
| Autonomous Tasks | Describe your goal; agents handle planning, implementation, and validation |
| Parallel Execution | Run multiple builds simultaneously in isolated git worktrees |
| Isolated Workspaces | All changes happen in git worktrees -- main branch stays safe |
| Self-Validating QA | Built-in quality assurance loop catches issues before you review |
| AI-Powered Merge | Automatic conflict resolution when integrating back to main |
| Context Intelligence | Unified memory + semantic search -- agents search code AND decisions as one knowledge layer |
| Semantic Code Search | AST-aware vector search finds code by meaning, not just keywords |
| Permission Modes | Guardian, Balanced, or Autopilot -- one click to set agent autonomy level |
| MCP Tool Extensibility | Connect any MCP server for extra tools; lazy-loaded to save context |
| GitHub/GitLab Integration | Import issues, investigate with AI, create merge requests |
| Cross-Platform | Native desktop apps for Windows, macOS, and Linux |
| Auto-Updates | App updates automatically when new versions are released |

_OAuth Provider Auth removed (Anthropic PKCE blocked Jan 2026). Linear Integration deferred (track demand)._

### Permission Modes

Three modes control agent autonomy:

| Mode | File Edits | Terminal | Sandbox |
|------|-----------|----------|---------|
| Guardian | Ask every time | Ask every time | Enforced |
| Balanced | Auto-approve | Ask every time | Enforced |
| Autopilot | Auto-approve | Auto-approve | Enforced |

Sandbox boundary is always enforced regardless of mode. Balanced mode reduces approval prompts by ~84%.

### Competitor Positioning

| Capability | CodeMAD | Cursor | Aider | Claude Code | Windsurf | Continue.dev | Roo Code |
|-----------|---------|--------|-------|-------------|----------|-------------|----------|
| Structured workflow | 4-phase protocol | No | No | No | No | No | No |
| Multi-agent worktrees | Git-isolated | No | No | Sub-agents only | No | No | No |
| Automatic code indexing | LanceDB + AST | Yes | Repo map | Manual | Yes | Yes | Yes |
| Goal-backward verification | CodeMAD Protocol | No | No | No | No | No | No |
| Chinese LLM support | Zhipu, Moonshot | No | No | No | No | No | No |
| Privacy (direct API) | Yes | No (Proxy) | Yes | Yes | No (Proxy) | Yes | Yes |
| Open source | AGPL-3.0 | Proprietary | Apache | Proprietary | Proprietary | Apache | Apache |

_Methodology-space competitors (Tessl, Kiro, Spec Kit) covered in Research-Discovered Gaps above._

### Security Model (Defence-in-Depth)

Six independent layers. A breach in one does not compromise the others.

| Layer | Control | How |
|-------|---------|-----|
| OS sandbox | Process isolation | macOS seatbelt, Linux bubblewrap. Bash runs sandboxed. |
| Filesystem | Project-scoped | Agents read/write only within project root and worktrees |
| Network | Egress control | Block private IP ranges (SSRF). Allow only known provider endpoints. |
| Configuration | Self-modification prevention | Agents cannot modify their own config, hooks, or permissions |
| Secrets | Injection pattern | Keys injected at runtime. Never written to worktrees. 0o600 permissions. |
| Resources | Compute limits | Per-agent timeout, memory ceiling, max file size |

### Quality Gate Sequence

Five gates run in cost order (cheapest first):

| Gate | Checks | Fails when |
|------|--------|-----------|
| 1. Lint | Style rules, import order, formatting | Violations, unused imports |
| 2. Type check | `tsc --noEmit` strict mode | Type errors, missing null checks |
| 3. Build | Turborepo full build | Bundling failures, circular deps |
| 4. Tests | `bun test` all packages | Failing tests, coverage below threshold |
| 5. Review | Code reviewer agent (or human) | Unresolved change requests |

Agent self-validation: stop hooks with exit code 2 force continuation if any gate fails. Prevents false "done" reports.

---

### Audit Trail Note

These amendments were captured in `/Users/costantinomarcello/.claude/projects/-Users-costantinomarcello-Desktop-CodeMAD/memory/MEMORY.md` and applied to this document to maintain consistency across all project artifacts. The original brainstorming insights remain valid; these amendments refine specific decisions based on subsequent research.
