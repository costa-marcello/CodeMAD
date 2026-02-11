---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - product-brief-CodeMAD-2026-02-10.md
  - domain-ai-coding-tools-research-2026-02-10/index.md
  - market-ai-coding-tools-research-2026-02-10/index.md
  - technical-codemad-tech-stack-decisions-research-2026-02-10/index.md
documentCounts:
  briefs: 1
  research: 3
  brainstorming: 0
  projectDocs: 0
classification:
  projectType: desktop_app
  domain: ai_developer_tools
  complexity: high
  projectContext: greenfield
workflowType: 'prd'
---

# Product Requirements Document - CodeMAD

**Author:** Costa
**Date:** 2026-02-11

## Executive Summary

CodeMAD is a desktop-first AI coding platform built around a four-phase protocol (Analysis, Planning, Solutioning, Implementation). The protocol is the product. No AI coding tool structures work through a mandatory methodology pipeline -- CodeMAD is the first.

**Target users:** Experienced vibecoders and developers with any level of experience. Excludes non-technical founders (Bolt/Lovable territory).

**Core thesis:** A structured four-phase protocol produces measurably better AI-assisted code than unstructured prompting.

**Triple value of the protocol:**
1. **Product differentiator** -- no competitor has a structured methodology pipeline
2. **Legal defence** -- human decision gates at each phase create "substantial human participation" evidence for AI code copyright
3. **Regulatory compliance** -- phase documentation satisfies EU AI Act transparency requirements (deadline: Aug 2, 2026)

**Go-to-market:** Free at launch via OAuth (users authenticate with existing ChatGPT Plus, Claude Pro, or Gemini Advanced subscriptions). BYOK as a power-user alternative. Paid tier deferred until after validation.

**Technology:** Tauri (Rust thin shell) + Bun sidecar + Svelte 5 + LanceDB. Desktop-native on macOS, Windows, and Linux.

**Release strategy:** Staged stealth -- Costa-only alpha, 5-10 beta testers, 20-50 at v0.2, public at v0.3+.

## Document Conventions

**Success Criteria** define how we know we've won. **User Journeys** show why each capability matters. **Functional Requirements** (FRs) state what the system does. **Non-Functional Requirements** (NFRs) state how well it must perform. **Product Scope** states when each capability ships.

## Success Criteria

### User Success

Each persona has a specific success moment detected through behaviour, not surveys.

| Persona | Success Moment | Detection Signal | Reinforcement |
|---------|---------------|-----------------|---------------|
| Marco (Quality Guardian) | "The protocol caught something I would have missed" | `research_catches (critical + moderate) >= 3` per project -- research phase flags outdated APIs, deprecated patterns, or security vulnerabilities before code is written | Surface catches visually at pre-flight checklist: "Research found N issues before code was written" |
| Priya (Experienced Vibecoder) | "I never wondered what to do next" | Steady `phase_dwell_time`, zero `backtrack_count` -- user progresses through protocol phases without stalling or re-entering previous phases | Protocol phase indicators show clear forward momentum |
| Tomas (Growing Developer) | "My code is getting better" | `quality_gate_pass_rate` improves across projects (project N+1 > project N) | Show progress: "Your first-pass rate improved from X% to Y% since your last project" |

**Research catch categorisation:**
- **Critical** -- would have caused a bug in production (deprecated auth flow, breaking API change, security vulnerability)
- **Moderate** -- would have caused tech debt (renamed package, suboptimal pattern, missing edge case)
- **Informational** -- nice-to-know (alternative library, style preference, minor optimisation)

Only critical + moderate count toward the "at least 3 per project" target.

**Completion signal:** At project completion, one optional binary question: "Did the protocol catch something you would have missed?" (Yes/No). No scales, no NPS.

**Anti-signals (protocol failure):**
- User abandons mid-Phase-2 (guidance failed them)
- User bypasses protocol phases (perceived as bureaucracy, not value)
- `research_catches (critical + moderate) = 0` across multiple projects (research phase not delivering)

### Business Success

| Stage | Metric | Target | Timeframe |
|-------|--------|--------|-----------|
| Alpha (Costa only) | Protocol proves thesis | Complete one real project through all four phases. Protocol catches at least 3 critical/moderate issues. | First 30 days of v0.1-alpha |
| Alpha | OAuth setup completion rate | 95%+ for OpenAI | v0.1-alpha launch |
| Alpha | OAuth session survival | Authenticated sessions stay alive for full project duration (hours to days without re-auth) | v0.1-alpha onward |
| Beta (5-10 testers) | Second project rate | 80%+ of invited beta testers start a second project unprompted | Within 30 days of beta invite |
| Beta | Week-2 retention | 60%+ still active after 14 days | Rolling |
| Beta | Organic referral | At least 1 referral per 3 beta users | Within beta period |
| Beta | Time-to-first-value | Under 30 minutes to persona-specific "aha" moment | Per user |
| Beta | Protocol completion rate | 50%+ of started projects reach Phase 4 | Rolling |
| v0.3+ Public | Second project rate (organic) | 40%+ of organic public users start a second project | Rolling |
| v0.3+ Public | Growth trajectory | Monthly active users trending upward (track trajectory, not absolute numbers) | Monthly |
| v0.3+ Public | Community signal | Methodology feedback, shared workflows, GitHub engagement | Monthly |
| v0.3+ Public | Conversion readiness | Users express willingness to pay for specific features | Qualitative |

**Revenue is explicitly deferred.** No paid tier until after validation. Architecture includes hooks for future gating, but the goal at launch is volume and usage through zero-cost OAuth adoption.

**Metrics deliberately not tracked:** Downloads/GitHub stars (vanity), NPS scores (unreliable at micro scale), time-to-first-code (wrong race -- CodeMAD wins time-to-working-feature).

### Technical Success

Two tiers: protocol effectiveness (proves the thesis) and platform reliability (proves the tool works).

**Protocol Effectiveness:**

| Metric | What It Proves | Target | When Measurable |
|--------|---------------|--------|-----------------|
| SWE-Bench score: model + CodeMAD > model alone | Protocol improves code generation quality on an industry benchmark | Statistically significant improvement over same model unstructured | v0.2+ (requires multi-agent) |
| Internal case study comparison | Protocol improves multi-step project outcomes across all four phases (what SWE-Bench cannot measure) | Same requirement built with and without protocol -- fewer defects with protocol | v0.1-alpha onward |
| Quality gate first-pass rate (file-level) | Individual files pass lint + type check on first generation | 95%+ | v0.1-alpha onward |
| Quality gate first-pass rate (story-level) | All story files pass lint + type + unit tests | 80%+ | v0.1-alpha onward |
| Quality gate first-pass rate (epic-level) | All stories in epic pass integration + review | 70%+ | v0.2 onward |
| Research catches per project (critical + moderate) | Research phase finds actionable issues before code is written | At least 3 per project | v0.1-alpha onward |
| Phase gate changes | Decisions corrected at a phase gate vs what the AI initially proposed | Track count (no target -- signal of protocol value) | v0.1-alpha onward |
| Iteration count | Build-debug-rebuild cycles per feature | Fewer than unstructured baseline | v0.1-alpha onward |

**Platform Reliability:**

| Metric | Target | Why It Matters |
|--------|--------|---------------|
| Cold start time (first launch) | Under 6 seconds | Gatekeeper verification and sidecar process spawn on first run |
| Cold start time (subsequent launches) | Under 3 seconds | Users expect fast desktop apps after initial setup |
| Time-to-first-token (user perspective) | Under 500ms from send to first visible character | Measures actual perceived responsiveness including double streaming overhead and network variance |
| LanceDB query time (semantic search) | Under 500ms for 10k+ vectors | Memory search must feel instant |
| Worktree merge success rate | 90%+ automatic resolution | Failed merges break the multi-agent value proposition |
| Memory ceiling per project | Under 800MB resident for 3 parallel agents (measure empirically at alpha, optimise if above target) | Desktop app must not consume excessive system resources |

Measurement methods and additional performance constraints: see NFR1-NFR9.

### Measurable Outcomes

| Outcome | Measurement | Gate |
|---------|-------------|------|
| Protocol thesis validated | Costa completes one real project through all four phases with measurably better output than unstructured AI coding | v0.1-alpha exit |
| Multi-agent thesis validated | Parallel story execution produces correct, mergeable code across isolated worktrees | v0.2 exit |
| Zero-cost adoption works | Users authenticate with existing provider subscriptions and use CodeMAD without new payments. OAuth setup rate 95%+. Sessions survive full project duration. | v0.1-alpha exit (OpenAI), v0.1-beta exit (Anthropic, Google) |
| Protocol improves over time | Cross-session memory (LanceDB) makes project N+1 measurably better than project N | v0.1-beta exit |
| SWE-Bench baseline established | Same model measured with and without CodeMAD Protocol on SWE-Bench subset | v0.2 exit |
| Retention survives selection bias | 40%+ second-project rate among organic (non-invited) users at v0.3 public launch | v0.3 exit |

## Product Scope

### MVP Strategy

**MVP approach:** Problem-solving MVP. The goal is to prove a single thesis: that a structured four-phase protocol produces measurably better AI-assisted code than unstructured prompting.

Everything in the MVP exists to validate this thesis. Features that don't contribute to validation are deferred. Features that measure validation (quality gates, research catches, protocol completion rate) are must-haves even if they seem like "nice-to-haves."

**Validation stages:**

| Stage | Release | Question Answered | Exit Criteria |
|-------|---------|------------------|---------------|
| Thesis validation | v0.1-alpha | Does the protocol work? | Costa completes one real project through all four phases. Protocol catches at least 3 critical/moderate issues. Quality gates pass at defined levels. Protocol completion rate above 50%. |
| Market validation | v0.1-beta through v0.1-rc | Do other people want this? | 80%+ of invited beta testers start a second project. First value under 30 minutes. Week-2 retention above 60%. OAuth setup rate 95%+. |
| Scale validation | v0.2 (full MVP) | Does the protocol scale? | Multi-agent parallel execution produces correct, mergeable code. SWE-Bench baseline established. Worktree merge success rate 90%+. |

**Resource reality:** Solo founder (Costa) in stealth mode. Sequential development, one feature stream at a time until beta testers arrive. Each checkpoint has clear exit criteria and a priority order -- if a checkpoint runs long, lower-priority features defer to the next checkpoint.

### MVP (v0.1-alpha through v0.2)

Everything needed to prove the protocol thesis at full power.

| Checkpoint | What Ships | What It Proves |
|-----------|-----------|---------------|
| v0.1-alpha | Desktop shell (Tauri + Bun sidecar + Svelte 5). OpenAI OAuth. Single-agent 4-phase protocol. Basic quality gates. Code signing. Permission modes. Research catches display. Builder-validator loop. Empty state handling. Brownfield support (codebase scan, convention detection, Phase 2-4 adaptation). | Protocol works end-to-end. App distributable. Greenfield and brownfield both supported. |
| v0.1-beta | + Anthropic/Google OAuth. Cross-session memory (LanceDB). Pre-flight checklist. Quick Flow. Auto-update. Crash reporting. Decision audit trail. Basic project list (name, date, current phase, last quality score). | Multi-provider OAuth. Protocol has memory. Testers can trace decisions. |
| v0.1-rc | + BYOK all providers. Manual model selection. Multiple chats. Two-track protocol UI. Full project switching with historical metrics. | Power users can join. Full UI. |
| v0.2 (MVP) | Multi-agent execution with git worktree isolation. Agent communication (task list + blackboard). Agent failure recovery. AI-powered merge. Language-aware quality gates. Provisional code quality score (0-100, beta label). | Protocol scales. Parallel story execution proven. |

**Provisional quality score formula inputs:**
- File-level lint pass rate
- File-level type check pass rate
- Unit test pass rate
- Semgrep findings per 1000 lines (inverse)
- Story-level integration pass rate

Output: 0-100 composite. All weights equal initially. Calibration with real-data tuning deferred to v0.5.

**MVP exit criteria:**
1. Costa completes one real project through all four phases
2. 80%+ of invited beta testers start a second project
3. First value under 30 minutes
4. Quality gates pass at defined levels (file 95%, story 80%, epic 70%)
5. OAuth works for OpenAI (alpha), Anthropic + Google (beta) with 95%+ setup completion
6. SWE-Bench baseline established

### v0.1-alpha Must-Haves (Priority Order)

If alpha runs long, ship items 1-7 and defer 8-10 to beta. Items 1-7 validate the thesis on both greenfield and brownfield projects.

| Priority | Feature | Validates | Deferrable to Beta? |
|----------|---------|----------|-------------------|
| 1 | Desktop shell (Tauri + Bun + Svelte) | App exists | No -- nothing works without this |
| 2 | OpenAI OAuth | Zero-cost adoption thesis | No -- BYOK contradicts the strategy |
| 3 | Four-phase protocol, single agent | Core product thesis | No -- this IS the product |
| 4 | Quality gates (lint + type check) | Measurable quality improvement | No -- without metrics, validation is subjective |
| 5 | Research catches display | Proves research phase delivers value | No -- Marco's "aha moment" depends on this |
| 6 | Code signing (macOS) | Distribution to testers | No -- Gatekeeper blocks unsigned apps |
| 7 | Brownfield support (codebase scan, convention detection, Phase 2-4 adaptation) | Protocol works on existing projects | No -- most real developer work is brownfield |
| 8 | Builder-validator loop | Automates fix-and-recheck cycle | Yes -- Costa can fix manually at alpha |
| 9 | Permission modes (Guardian, Balanced, Autopilot) | Agent trust boundaries | Yes -- can ship Balanced-only if needed |
| 10 | Empty state handling (project creation) | First-run experience | Yes -- Costa knows how to start a project |

**Deferred from v0.1-alpha to v0.1-beta:**

| Feature | Reason |
|---------|--------|
| Decision audit trail | Costa can validate the protocol without formal audit logging. Trail matters when testers need to trace decisions. |

### Post-MVP (v0.2.1 through v0.2.2)

| Version | What Ships |
|---------|-----------|
| v0.2.1 | Ollama local models. Linux platform. Rate limiting. Token tracking. |
| v0.2.2 | EU AI Act full compliance. Network resilience. Error UX. Credential rotation. |

### Growth Features (v0.3 through v0.5)

Expand the audience. Deepen the value.

| Version | Key Features | Strategic Purpose |
|---------|-------------|-------------------|
| v0.3 | Zhipu + Moonshot providers. Kanban + live agent dashboard. Basic GitHub integration (PR creation from completed story). Basic MCP server exposure (one protocol phase as MCP tool). | Provider ecosystem. Agent work visible. Distribution begins. |
| v0.4 | Automatic model router. CQRS for agent auditing. Cost estimator. Advanced multi-project workspace (templates, sharing). | Intelligent routing. Full audit trail. |
| v0.5 | Calibrated code quality score (data-tuned formula, historical comparison dashboard). Dynamic phase selector. TDD choice. | Measurable quality. Power user flexibility. |

**Growth exit criteria:** 40%+ second-project rate among organic users. Community contributions emerge. Users choose CodeMAD over unstructured tools for real work.

### Vision (v0.6 through v2.0)

Platform play. CodeMAD protocol becomes the methodology layer beneath any AI coding tool.

| Version | Key Features | Strategic Purpose |
|---------|-------------|-------------------|
| v0.6 | Accessibility (EU EAA). Full GitHub/GitLab integration (issues, reviews, CI status, branch management). Multi-developer collaboration. | Accessible. Connected workflows. |
| v0.7 | Visual mind map brainstorming. Multi-track agent timeline. | Visual differentiator. Shareable screenshots. |
| v0.8 | Continuous micro-review. Unlimited parallel agents. Semantic cache. | Performance at scale. Proactive quality. |
| v0.9 | Competitor imports. i18n. Game save states. | Breadth. Lower switching costs. Global reach. |
| v1.0-v1.4 | MCP server exposure. Standalone agents. Teaching framework. CodeMAD builds CodeMAD. | Ecosystem. Distribution. Self-hosting proof. |
| v2.0 | Decision branching. Community-driven development. | Next generation. |

**Vision exit criteria:** "Built with CodeMAD Protocol" means something. Other tools invoke the protocol via MCP. Protocol certification exists.

### Risk-Based Scoping

**Technical risks:**

| Risk | Impact on Scope | Mitigation |
|------|----------------|-----------|
| Bun native deps 34% failure rate (LanceDB, tree-sitter) | Cross-session memory blocked if LanceDB fails. Fallback: SQLite + manual embeddings. | Test LanceDB + tree-sitter on Bun in sprint zero. |
| OAuth provider dependency (OpenAI first) | Alpha is dead if OpenAI revokes access. | BYOK accelerated to v0.1-beta as safety net. |
| Tauri updater infrastructure | Needs HTTPS endpoint for update artifacts. | GitHub Releases at alpha. Dedicated update server at beta. |
| Quality score formula inaccuracy | Provisional equal weights may not reflect real quality. | Ship with "beta" label. Calibrate at v0.5. |

**Market risks:**

| Risk | Impact on Scope | Mitigation |
|------|----------------|-----------|
| Developers don't want structured methodology | Core thesis fails. Product becomes Quick Flow only. | Measure protocol completion rate from day one. Simplify before beta if below 50% in alpha. |
| Competitors copy the protocol concept | First-mover advantage erodes. | Data moat creates switching costs. Ship fast. |

**Resource risks (solo founder):**

| Risk | Impact on Scope | Mitigation |
|------|----------------|-----------|
| Alpha takes longer than expected | Beta delays. | Priority order defined. Ship items 1-7, defer 8-10. |
| Bug fixing consumes development time | Features stall. | Prioritise protocol-critical bugs only at alpha. |
| No dedicated QA | Bugs reach testers. | Mandatory Semgrep + Vitest in CI. Manual testing checklist per checkpoint. |

## User Journeys

Five journeys reveal the capabilities this product must deliver. Each surfaces requirements through narrative. The Journey Requirements Summary at the end maps capabilities to release checkpoints.

### Journey 1: Marco Builds a Payment Integration (Success Path)

**Opening Scene.**
Marco's team needs Stripe webhook handling for their SaaS platform. He's done this before with Claude Code -- it took four hours and three rounds of debugging because the AI used the deprecated Charges API instead of PaymentIntents. He downloads CodeMAD after seeing a Reddit post about "AI that researches before it codes."

**Rising Action.**
Marco authenticates with his ChatGPT Plus account -- one OAuth click, no API key. He starts a new project and the protocol guides him into Phase 1 (Analysis). The brainstorming session asks questions he'd normally skip: "What happens when a webhook is replayed? What's your retry strategy?" He types terse answers -- he knows this domain -- but the questions force him to think about edge cases before a single line of code exists.

Phase 2 (Planning) produces a PRD from his answers. He reviews it at the phase gate and catches a requirement he missed: idempotency keys. The pre-flight checklist shows green across all sections. Phase 3 (Solutioning) is where he sits up. The research phase pulls current Stripe API documentation via Context7 and flags that `checkout.session.completed` events now require a different signature verification method than what his team used last year.

**Climax.**
That's the moment. Marco stares at the research catch and realises: "I would have spent two hours debugging that in production." The protocol found a breaking change in an API he thought he knew. Not a theoretical warning -- a concrete, specific catch that would have become a real bug. The research catches counter shows 4 critical findings before a single line of code exists.

**Resolution.**
Phase 4 (Implementation) launches three Story Developer agents in parallel across git worktrees. One builds the webhook endpoint, another handles event processing logic, a third writes the test suite. Semgrep catches a timing vulnerability in the webhook signature verification. Each story passes quality gates on first attempt. The AI-powered merge integrates all three worktrees -- two minor conflicts resolve automatically. Marco reviews the final diff. It's cleaner than code he'd write by hand. Quality gate first-pass: 96% at file level.

Marco's PR gets approved with zero comments for the first time in months. He opens a second project the next day -- migrating an auth flow. He tells his team lead about CodeMAD at standup.

**Requirements revealed:**
- OAuth authentication flow (one-click, no API key confusion)
- Four-phase protocol pipeline (sequential phases with gates)
- Research phase with real-time documentation (Context7 integration)
- Pre-flight checklist (visual readiness gate between phases)
- Multi-agent parallel execution (3 agents, git worktree isolation)
- Security scanning during code generation (Semgrep integration)
- AI-powered merge (worktree conflict resolution)
- Quality gate reporting (file-level, story-level pass rates)
- Research catches display (count + categorisation: critical/moderate/informational)

---

### Journey 2: Priya Ships a Client Dashboard (Success Path)

**Opening Scene.**
Priya's client wants a project management dashboard. She's built two before -- both collapsed when the client asked for user roles and real-time updates. She heard about CodeMAD from a YouTube video showing the brainstorming phase. "A tool that plans before it builds" -- that's what she's been missing.

**Rising Action.**
Priya downloads the app and authenticates with her Gemini Advanced account via OAuth. She starts a project and the protocol opens Phase 1 (Analysis). The brainstorming session is her first surprise. Instead of a blank prompt, the protocol runs her through structured discovery: question storming, stress testing, morphological analysis. She types "project management dashboard for a design agency" and the facilitation draws out specifics she hadn't considered: "How many concurrent users? Do designers need different permissions from project managers? What happens when two people edit the same task?"

By the end of Phase 1, she has a product brief she's never written before -- personas, success metrics, a scoped release plan. She didn't know she needed one. Phase 2 produces a PRD. The pre-flight checklist at the gate between Phase 2 and Phase 3 shows one yellow item: "Authentication strategy not specified." Priya taps the yellow item. An inline editor opens on that specific section of the PRD -- no phase reset, no navigation away, no lost work. She types "Google OAuth for the agency's Google Workspace." The checklist recalculates. Green across the board.

Phase 3 (Solutioning) researches current patterns for real-time collaboration dashboards. The research phase finds that the WebSocket library she used last time has a known memory leak in production -- flagged as critical. The architecture uses a server-sent events pattern instead. Phase 4 runs single-agent sequential execution. Each story builds end-to-end -- backend route, frontend component, tests -- as a vertical slice.

**Climax.**
Priya watches her dashboard take shape over two days. Not once did she wonder "what do I do next?" -- the protocol moved her forward at every step. The client reviews the first version and asks for task assignments. Priya opens Quick Flow (skip to spec + build), types the requirement, and the protocol builds it as a small change without restarting the full four phases.

**Resolution.**
The dashboard ships with user roles, real-time updates, and zero structural rewrites. Priya's client asks "how did you build this so fast AND so well?" She starts her next project in CodeMAD the same week. Her projects survive past week three for the first time.

**Requirements revealed:**
- Guided brainstorming facilitation (structured techniques, not blank prompt)
- Phase gate visual indicators (green/yellow/red pre-flight checklist)
- Inline editing within pre-flight checklist items (no phase reset, no lost work)
- Quick Flow (skip to spec + build for small changes)
- Two-track UI (protocol chat for full protocol, free chat for Quick Flow)
- Single-agent sequential execution (v0.1 path before multi-agent)
- Vertical slice story execution (backend + frontend + tests per story)
- Protocol phase progression (clear forward momentum indicators)

---

### Journey 3: Priya's Dashboard Hits a Wall (Edge Case -- Course Correction)

**Opening Scene.**
Priya is in Phase 4 of a new project -- a booking system for a yoga studio. Two stories are complete when the Story Developer agent discovers that the calendar library specified in the architecture doesn't support recurring events. The architecture assumed it did. This is a moderate course correction -- the architecture needs a different library, which affects two planned stories.

**Rising Action.**
The agent flags the issue through the protocol's course correction flow. CodeMAD detects the mismatch within seconds of the agent encountering the incompatibility. The protocol classifies it as a moderate scope issue (epic/story restructuring needed, not a full architecture rewrite). A product manager sub-agent assesses the impact: two stories need revised specs, one new story is needed for the recurring events feature. The sub-agent proposes a correction: swap the calendar library, update the two affected stories, add the new story.

Priya sees the course correction proposal in her protocol chat. The before/after comparison shows exactly what changes and why. She reviews the proposal -- the new library suggestion includes research catches confirming it supports recurring events and has an active maintenance community.

**Climax.**
Priya approves the correction. The protocol re-runs the readiness check automatically. The re-validation passes on first attempt -- the updated stories are consistent with the PRD and architecture. Phase 4 resumes with the corrected plan. The two affected stories rebuild from their revised specs.

**Resolution.**
The booking system ships with recurring events working correctly. Priya realises the protocol didn't just prevent a collapse -- it handled the recovery for her. The course correction log shows the decision trail: what broke, what was proposed, what she approved, and the re-validation results. She refers back to it when the client asks "why did you switch calendar libraries?"

**Requirements revealed:**
- Course correction flow (automatic detection of plan-vs-reality mismatch)
- Correction detection latency (flag mismatch within seconds, not minutes)
- Correction proposal accuracy (proposed fix must resolve the actual issue)
- Re-validation pass rate (readiness check passes after correction applied)
- Scope classification (minor/moderate/major determines correction path)
- Sub-agent routing (PM sub-agent for moderate issues, architect for major)
- Before/after correction proposal display
- User approval gate for corrections (human decision, not automatic)
- Automatic readiness re-check after correction
- Decision audit trail (what broke, what was proposed, what was approved, re-validation result)
- Maximum 2 correction cycles before escalating to user
- Story Developer never edits planning artifacts directly

---

### Journey 4: Tomas Levels Up Over Three Projects (Success Path)

**Opening Scene.**
Tomas's team lead tells him to try CodeMAD for his next feature -- adding search to their internal knowledge base. Tomas is sceptical. He generates code fast with Copilot. A tool that makes him plan first feels like bureaucracy, not help.

**Rising Action.**
Tomas authenticates with his team's OpenAI account via OAuth. He starts the project and the protocol opens Phase 1. The brainstorming session asks about search requirements he hadn't considered: "Full-text or semantic? What happens when there are zero results? How do you handle large documents?" He realises he was about to build full-text search when the use case clearly needs semantic search.

Phase 3 is where the learning starts. The research phase catches that the embedding model he assumed (text-embedding-ada-002) has been superseded by text-embedding-3-small at half the cost and better performance. The architecture agent builds a search pipeline Tomas hasn't seen before -- chunk, embed, index, query with re-ranking. He reads the architecture document and understands for the first time why search systems are structured this way.

Phase 4 builds the feature. Quality gates flag his first story at 72% file-level pass rate -- the AI-generated code has type errors in three files. The protocol fixes them in the builder-validator loop. His PR goes through with one minor comment instead of the usual four structural rewrites.

Halfway through, something shifts. Tomas realises the protocol isn't slowing him down. It's showing him what he didn't know he was missing. The brainstorming questions, the architecture rationale, the research catches -- each one is a lesson he'd have learned the hard way in production. The protocol is teaching him without lecturing.

**The handoff between projects.**
Tomas finishes project one. The protocol shows his completion summary: 72% file-level first-pass rate, 3 research catches (2 critical, 1 moderate), total build time. A "Start new project" button sits next to his project list, where the search project now appears with its metrics.

**Project two (two weeks later):** Tomas starts an API rate-limiting feature. The protocol greets him: "Welcome back. Your last project had a 72% file-level pass rate. Let's beat that." Cross-session memory surfaces a pattern from his search project: "In your last project, the embedding model research caught a cost savings. Consider checking current pricing for the rate-limiting middleware." He checks. The middleware has a new version with breaking changes. Another catch. First-pass rate: 81%.

**Project three (month two):** Tomas builds a notification system. First-pass rate: 89%. He spends the time he would have spent debugging on actually understanding the architecture decisions the protocol made. His team lead stops sending PRs back.

**Climax.**
CodeMAD shows Tomas his progression: "Your first-pass rate improved from 72% to 89% across three projects. Research catches have found 11 issues across your projects." He screenshots this and sends it to his team lead. Three months ago he thought the protocol was bureaucracy. Now he won't start a feature without it.

**Resolution.**
Tomas doesn't just ship faster -- he ships better. The sceptic became the advocate. The protocol taught him structured thinking by making him follow it. He understands architecture decisions because the protocol documents why each choice was made. His team lead notices and assigns him the next complex feature.

**Requirements revealed:**
- Cross-session memory (LanceDB) surfacing relevant past decisions in new projects
- Quality gate progression tracking across projects (per-user metrics)
- Builder-validator loop (automatic fix-and-recheck cycle within Phase 4)
- Research catch history (cumulative count across projects)
- Architecture document readability (user learns from protocol output)
- Decision audit trail per project (why each choice was made)
- User progress display (visual improvement metrics)
- Project completion summary (metrics, catches, build time)
- Project list with historical metrics
- Project-to-project welcome with past performance context
- "Start new project" action prominent after completion

---

### Journey 5: Beta Tester's First 30 Minutes (Onboarding)

**Opening Scene.**
Sam gets a beta invite from Costa. She's a full-stack developer who uses Cursor daily. She's curious but sceptical -- she's tried three "AI coding tools with methodology" that turned out to be prompt wrappers. She clicks the download link.

**Rising Action.**
The installer runs in under 30 seconds (Tauri's small bundle). On first launch, Gatekeeper verifies the signed app -- takes about 4 seconds on macOS. CodeMAD opens to a clean onboarding screen. First choice: authenticate with a provider. Sam has a Claude Pro subscription, so she clicks "Connect with Anthropic." OAuth flow opens her browser, she authorises, the app receives the token. She's authenticated in under 15 seconds.

The app suggests starting a project. Sam picks something small -- a CLI tool she's been meaning to build. Phase 1 opens with brainstorming. Within 5 minutes, the brainstorming facilitation has drawn out requirements she hadn't written down: argument parsing strategy, output formatting, error codes, shell completion support. She's impressed -- this isn't a prompt wrapper.

Phase 2 produces a PRD. Phase 3 produces an architecture that references the latest version of her preferred CLI framework (researched via Context7, she doesn't know this is happening). Phase 4 builds it. 20 minutes in, she has a working CLI tool with tests passing.

Then the app crashes. A LanceDB index operation fails on an edge case in her project structure. The crash reporter pops up: "Something went wrong. Send a report to help us fix this?" She clicks yes. The report includes the error stack, her project metadata (no code), and the phase she was in.

Sam expects the worst. Every other tool she's used would lose her work here. She'd start over, re-enter her requirements, wait for the AI to regenerate everything. Twenty minutes of progress, gone.

**Climax.**
Sam reopens the app. The protocol detects the interrupted session and shows a resume prompt: "You were building CLI Tool. Pick up from Story 3 of 5?" She clicks resume. The protocol restores her state from the last completed story checkpoint. She's back to where she was in under 30 seconds. Her requirements, architecture, completed stories -- all intact. The crash cost her 30 seconds, not 20 minutes.

**Resolution.**
Sam sends Costa a message: "The crash was annoying but the fact that I didn't lose my work sold me. The brainstorming phase is genuinely useful, not just ceremony." She starts a second project the next day.

**OAuth failure micro-journey (alternate path):**
Sam's colleague Dev gets the same beta invite but uses Firefox with strict privacy settings. He clicks "Connect with OpenAI." The browser redirect opens but the callback fails silently -- Firefox blocks the localhost redirect. After 5 seconds, CodeMAD detects the missing callback and shows a fallback: "Browser didn't connect? Enter this code manually:" with a one-time code displayed in the browser's OpenAI auth page. Dev copies the code, pastes it into CodeMAD, and is authenticated. Total time: 25 seconds. The experience is rougher than Sam's but functional.

**Requirements revealed:**
- Code signing and notarisation (macOS Gatekeeper, Windows SmartScreen)
- Fast install (Tauri small bundle, under 30 seconds)
- First-launch cold start (under 6 seconds including Gatekeeper)
- OAuth onboarding flow (provider selection, browser redirect, token receipt)
- OAuth failure fallback (manual code entry when browser redirect fails, activates within 5 seconds, auth completes within 30 seconds)
- Crash reporting (opt-in, includes metadata but not user code)
- Agent failure recovery / checkpointing (resume from last completed story)
- Interrupted session detection and resume prompt
- Work-in-progress preservation (protocol checkpoint saves state)
- Auto-update mechanism (beta testers receive fixes quickly)
- Empty state handling in project creation (handle "I don't know what to build" -- template gallery or problem-statement prompt)

---

### Journey Requirements Summary

| Capability | Revealed By Journey | MVP Version |
|-----------|-------------------|-------------|
| OAuth authentication (one-click, multi-provider) | Marco, Priya, Tomas, Beta tester | v0.1-alpha (OpenAI), v0.1-beta (Anthropic, Google) |
| OAuth failure fallback (manual code entry) | Beta tester (alt path) | v0.1-alpha |
| Four-phase protocol pipeline | Marco, Priya, Tomas | v0.1-alpha |
| Guided brainstorming facilitation | Priya, Tomas, Beta tester | v0.1-alpha |
| Research phase with real-time documentation (Context7) | Marco, Tomas | v0.1-alpha |
| Security scanning (Semgrep) | Marco | v0.1-alpha |
| Pre-flight checklist (green/yellow/red) | Marco, Priya | v0.1-beta |
| Inline editing within pre-flight checklist items | Priya | v0.1-beta |
| Phase gate backtrack capability (no reset, no lost work) | Priya | v0.1-beta |
| Quick Flow (spec + build for small changes) | Priya | v0.1-beta |
| Cross-session memory (LanceDB) | Tomas | v0.1-beta |
| Two-track UI (protocol chat + free chat) | Priya | v0.1-rc |
| Manual model selection | Tomas | v0.1-rc |
| Multi-agent parallel execution (3 agents, worktrees) | Marco | v0.2 |
| AI-powered merge (worktree conflict resolution) | Marco | v0.2 |
| Course correction flow (detection, classification, sub-agent routing) | Priya edge case | v0.2 |
| Correction detection latency (seconds, not minutes) | Priya edge case | v0.2 |
| Correction proposal accuracy and re-validation pass rate | Priya edge case | v0.2 |
| Agent failure recovery / checkpointing | Beta tester | v0.2 |
| Interrupted session detection and resume | Beta tester | v0.2 |
| Quality gate reporting (file/story/epic levels) | Marco, Tomas | v0.1-alpha |
| Research catches display (count + categorisation) | Marco, Tomas | v0.1-alpha |
| User progress tracking (per-user metrics across projects) | Tomas | v0.1-beta |
| Project completion summary and project list | Tomas | v0.1-beta |
| Project-to-project welcome with past metrics | Tomas | v0.1-beta |
| Decision audit trail | Marco, Priya edge case, Tomas | v0.1-alpha |
| Builder-validator loop | Tomas | v0.1-alpha |
| Code signing and notarisation | Beta tester | v0.1-alpha |
| Crash reporting (opt-in) | Beta tester | v0.1-beta |
| Auto-update mechanism | Beta tester | v0.1-beta |
| Empty state handling (project creation) | Beta tester (noted) | v0.1-alpha |

## Domain-Specific Requirements

CodeMAD operates in the AI developer tools domain -- a high-complexity space with regulatory deadlines, legal implications, and security risks unique to tools that let AI agents write and execute code.

### Compliance and Regulatory

**EU AI Act Transparency (deadline: Aug 2, 2026)**
- Label AI-generated content in the UI. Users must see which code, architecture decisions, and documentation were produced by AI vs approved by a human.
- Document human vs AI contributions per protocol phase. Each phase gate is a documented human decision point.
- Phase documentation satisfies transparency requirements. The decision audit trail is the compliance artefact.
- Architecture must accommodate labelling from v0.1-alpha even though full compliance ships at v0.2.2. Retrofitting labels onto unlabelled content is expensive.

*Labelling granularity (testable):*
- Every code file generated or modified by an agent carries a provenance marker (agent ID, timestamp, phase).
- Every planning artefact section records whether content was AI-generated, human-authored, or human-edited-from-AI-draft.
- Phase gate decisions record the human approver and what was approved.
- Acceptance criterion: an auditor can trace any line of code or planning text back to its origin (human or AI) and the phase gate where a human reviewed it.

**AI Code Copyright Defence**

No competitor offers automated legal protection for AI-generated code. Users will choose CodeMAD specifically because their code has documented human authorship.

- Protocol phases create "substantial human participation" evidence -- the strongest IP protection available for AI-assisted code.
- Human decision gates at each phase (brainstorming approval, PRD review, architecture sign-off, story acceptance) are the legal mechanism.
- Decision audit trail serves as evidence of human authorship in any copyright dispute.
- The protocol is simultaneously a product differentiator (no competitor has this), a legal defence (human authorship gates), and a regulatory compliance mechanism (EU AI Act transparency).

*Acceptance criteria:*
- Each completed project produces an exportable authorship report listing: every phase gate decision, the human who approved it, what AI-generated content was reviewed, and what changes the human made.
- The audit trail is tamper-evident (append-only log with checksums, not editable after the fact).

### Provider and Authentication Constraints

**OAuth Provider Terms of Service**
- Users authenticating via OAuth are subject to each provider's TOS and rate limits.
- ChatGPT Plus, Claude Pro, and Gemini Advanced subscriptions may grant different API access levels than direct API keys. Behaviour may vary per subscription tier.
- Providers can revoke OAuth access, change rate limits, or modify terms without notice. This is the highest strategic dependency at launch: if OpenAI revokes OAuth during alpha, v0.1-alpha has no fallback until BYOK ships at v0.1-rc.
- Requirement: the auth adapter must handle provider-side changes gracefully (token refresh, scope changes, access revocation) without data loss.
- Contingency: BYOK for all providers is accelerated to v0.1-beta as a safety net. If the primary OAuth provider becomes unavailable, beta testers can switch to BYOK immediately rather than waiting for v0.1-rc.

**Provider Rate Limiting (user-facing behaviour)**
- When a user hits their provider's rate limit mid-protocol, the protocol pauses the active agent, displays a clear message ("Provider rate limit reached. Resuming in ~X seconds" or "Switch to another provider?"), and resumes automatically when the limit resets.
- The protocol never silently fails or drops work due to rate limiting.
- At MVP (v0.1-alpha): pause and wait. At v0.2.1: per-agent rate limiting with backpressure across providers.

**Chinese Provider Constraints (Zhipu, Moonshot)**
- Zhipu (GLM) and Moonshot (Kimi) are MVP-scope providers but ship at v0.1-beta or later, not v0.1-alpha.
- These providers may have different API authentication patterns (not OAuth), content filtering requirements, and data localisation rules. The auth adapter must accommodate non-OAuth authentication flows.
- Specific regulatory and API constraints for these providers are researched during architecture phase, not assumed here.

**Credential Management**
- Credential rotation, expiry monitoring, and 401 handling for 5 providers (OpenAI, Anthropic, Google, Zhipu, Moonshot).
- OS-native keychain storage (macOS Keychain, Windows Credential Manager) for credential persistence.
- Session survival: authenticated sessions must stay alive for full project duration (hours to days) without re-authentication.

*Session survival failure modes (testable):*
- Token expiry mid-phase: app detects expiry, silently refreshes if possible, prompts re-auth only if refresh fails. No work lost. User sees a brief "reconnecting" indicator, not a login screen.
- OS sleep/wake: session state persists across sleep cycles. On wake, the app validates the token and resumes or refreshes. Protocol phase state is unaffected.
- App backgrounded for extended period: same as sleep/wake. The app does not lose session state when backgrounded.
- Provider-side session invalidation: the app detects the 401, notifies the user, and offers re-authentication or provider switch. In-progress work is preserved at the last checkpoint.

### Code Generation Security

**AI-Generated Code Vulnerability Risk**
- AI-generated code has 2.74x more security vulnerabilities than human-written code (market research finding).
- Semgrep integration scans every code change for security vulnerabilities, unsafe patterns, and known CVEs automatically during code review and quality gates.
- Semgrep is not comprehensive. It catches known patterns but misses novel vulnerabilities, logic errors, and business logic flaws.
- Requirement: security scanning is mandatory in quality gates, not optional. Users cannot disable it at MVP.

**Agent Trust Boundaries**

Define explicit file system and shell command boundaries for all four agent tiers (Orchestrator, Phase, Specialist, Researcher).

- **Orchestrator agent:** read/write access to protocol state files (sprint-status.yaml, phase state, agent assignments). Read access to all worktrees for coordination. Cannot generate code directly. Cannot modify user source files.
- **Phase agents:** read access across worktrees to coordinate story execution. Write access to phase-specific state and planning artefacts within their phase scope. Cannot modify artefacts from other phases (e.g. a Phase 4 agent cannot edit the PRD from Phase 2).
- **Researcher agents:** read-only access to project files and external documentation. No file writes, no shell execution.
- **Story Developer agents:** confined to their assigned git worktree. Cannot modify files outside the worktree. Cannot modify planning artefacts (PRD, architecture, story specs) directly.
- **Validation/review agents:** read-only access to code under review. Can write review comments and reports. Cannot modify source code.
- Permission modes (Guardian, Balanced, Autopilot) gate user-facing destructive actions. Guardian requires explicit approval for all file writes and shell commands. Balanced auto-approves within worktree scope. Autopilot auto-approves all non-destructive actions.

**Prompt Injection via User Code**
- User code is untrusted input. Repositories may contain adversarial strings (comments, variable names, documentation) designed to manipulate LLM behaviour.
- Requirement: isolate user code content from agent instruction context. Code content should be passed as data, not as part of the system prompt or tool instructions.
- Requirement: agents processing user code should have their instruction context hardened against injection (clear separation of instructions vs code content).

*Verification criteria (testable):*
- Static analysis of all prompt templates confirms user code is never interpolated into system prompts or tool instruction blocks.
- An adversarial test suite (maintained as part of the QA artefacts) includes known prompt injection payloads embedded in code comments, variable names, and documentation strings. All agents must process these payloads without behavioural deviation.
- Prompt injection tests run as part of the CI pipeline for any change to agent prompt templates.

### Model Reliability

**Hallucination in Planning Phases**
- Agents can generate plausible but incorrect research findings, architecture recommendations, or documentation references.
- Phase gates are hallucination firewalls: every agent-generated planning artefact must be verifiable by a human at the phase gate before the protocol advances.
- Research agents must cite sources. Architecture agents must reference specific documentation. Claims without sources are flagged for human review.
- The handoff message pairing requirement (LLMs need tool call + response pairs during agent handoffs) prevents hallucination amplification between agents.

**Mid-Phase Provider Failure**
- LLM providers can go down, hit rate limits, or throttle during active protocol execution.
- Requirement (MVP): if a provider fails mid-story, pause the affected agent, preserve its state (last completed subtask), notify the user, and offer to resume when the provider returns or switch to an alternative provider.
- Requirement (MVP): partial story progress is never lost due to provider failure. The checkpoint/recovery mechanism from agent failure recovery covers this case.
- Full network resilience (queue unsent requests, graceful degradation) ships at v0.2.2.

### Privacy and Data Handling

**Local-First Architecture**
- User code never leaves their machine. All code processing, indexing, and storage happens locally.
- Direct API calls to LLM providers. No CodeMAD proxy servers, no cloud intermediaries.
- LanceDB stores embeddings locally with no cloud dependency.
- Crash reports include error stacks and project metadata but never user code.

**Token Cost Transparency**
- Users spend real money on API calls through OAuth or BYOK. A full four-phase protocol run with multi-agent execution consumes significant tokens.
- Requirement (MVP): display running token count and estimated cost during protocol execution. At minimum, a "this session has used ~X tokens (~$Y)" indicator visible during active work.
- Requirement (v0.2.1): token usage tracking per task, per agent, per phase. Rate limiting and backpressure across providers.
- Users must never be surprised by API costs. Cost visibility is a trust requirement, not a nice-to-have.

### MCP Tool Security

**Pre-Installed Tool Execution**
- Context7 and Semgrep run automatically as part of the protocol. Users do not trigger them.
- Tool execution must be sandboxed: MCP tools cannot access files outside the project scope, cannot make network requests beyond their documented API endpoints, and cannot persist data outside their designated storage.
- Future MCP tools added via lazy loading inherit the same sandboxing constraints.

### Risk Summary

| Risk | Severity | Likelihood | MVP Mitigation | Full Mitigation |
|------|----------|-----------|---------------|-----------------|
| EU AI Act non-compliance | High (legal deadline) | High (fixed deadline) | Architecture accommodates labelling from v0.1-alpha | Full labelling at v0.2.2 |
| Provider OAuth revocation | High (strategic dependency) | Medium-High (precedent exists) | BYOK accelerated to v0.1-beta as safety net. Graceful token refresh. | Multi-provider redundancy |
| Code generation vulnerabilities | High (security) | High (2.74x baseline) | Mandatory Semgrep scanning at v0.1-alpha. Semgrep has known blind spots (novel vulns, logic errors) -- additional scanners planned for Growth phase. | Additional scanners + formal review |
| Agent trust boundary violation | High (security) | Medium | Permission modes + worktree isolation for all 4 agent tiers | Formal sandboxing |
| AI copyright challenge | Medium (no precedent) | Low (no case law yet) | Phase gates + audit trail from v0.1-alpha. Exportable authorship report. | Protocol certification at v1.0 |
| Prompt injection via user code | Medium (security) | Medium | Context isolation in agent prompts. Adversarial test suite in CI. | Hardened prompt architecture |
| Model hallucination in planning | Medium (quality) | Medium-High | Phase gates as human verification points | Source citation requirements |
| Provider failure mid-phase | Medium (reliability) | Medium | Pause + preserve state + notify | Full network resilience at v0.2.2 |
| Unexpected API costs | Medium (trust) | High (always present) | Basic token count display | Per-task tracking at v0.2.1 |
| Provider rate limiting mid-protocol | Medium (UX) | Medium-High | Pause agent, display wait time, auto-resume | Per-agent backpressure at v0.2.1 |
| MCP tool overreach | Low (sandboxed) | Low | Project-scoped access only | Formal capability model |

## Innovation Analysis

### Core Innovation

**Protocol-driven AI development: the methodology is the product.**

No AI coding tool structures work through a mandatory methodology pipeline. Cursor, Windsurf, Claude Code, Copilot -- all provide AI capabilities without prescribing how to use them. CodeMAD inverts this: the four-phase protocol (Analysis, Planning, Solutioning, Implementation) is the product. The AI is the execution engine underneath.

This is a Blue Ocean move. Competitors compete on AI capability (better models, more context, faster generation). CodeMAD competes on methodology -- a different value curve entirely. The "coder to orchestrator" narrative (2026's defining trend) validates this approach: users orchestrate the protocol, agents do the work.

### Three Strategic Consequences

The protocol creates three value streams simultaneously. None require separate features -- they emerge from the protocol's structure.

**1. Quality improvement through research-before-code.**
Every competitor moves directly from prompt to code. CodeMAD's Phase 1 (Analysis) and Phase 3 (Solutioning/Research) force documentation and discovery before implementation. The research catches metric (at least 3 critical/moderate per project) measures this concretely. Users don't get "AI that codes better" -- they get "AI that prevents bugs before code exists."

**2. Legal protection through human decision gates.**
Protocol phases create "substantial human participation" evidence -- the strongest IP protection available for AI-assisted code. Human gates at each phase (brainstorming approval, PRD review, architecture sign-off, story acceptance) are the legal mechanism. Users get copyright defence as a side effect of following the protocol. No competitor offers this.

**3. Regulatory compliance through phase documentation.**
The decision audit trail satisfies EU AI Act transparency requirements. Each phase gate is a documented human decision point. Phase documentation is the compliance artefact. Users get regulatory readiness without additional work.

### Protocol-Generated Data as Competitive Moat

Every protocol run generates data no competitor can collect:
- **Research catches** -- what the AI would have gotten wrong without the research phase
- **Phase gate corrections** -- what humans changed from what the AI proposed
- **Quality gate metrics** -- how good the output was at file, story, and epic levels
- **Cross-session patterns** -- what improved across projects for each user

This data creates three advantages:
1. **Product improvement** -- cross-session memory (LanceDB) is trained on the user's own project patterns. Project N+1 is measurably better than Project N. Cursor doesn't get better at YOUR code over time.
2. **Switching costs** -- a user's protocol history, research catches, and quality progression live in CodeMAD. This data isn't exportable to unstructured tools.
3. **Aggregate insights** (Growth phase) -- anonymised, opt-in aggregate data could power claims like "developers using the protocol have X% fewer production bugs." Marketing built on evidence, not promises.

### Validation Approach

| Innovation Claim | Validation Method | Leading Indicator | When |
|-----------------|------------------|-------------------|------|
| Protocol improves outcomes | Internal case study: same requirement with/without protocol | **Protocol completion rate** -- % of started projects reaching Phase 4. Target: above 50% in alpha, above 80% by beta. | v0.1-alpha onward |
| Research catches prevent bugs | Track critical + moderate catches per project. Target: at least 3. | First research catch in first project | v0.1-alpha onward |
| Protocol improves over time | Cross-session memory makes project N+1 better than N | Quality gate first-pass rate trending upward per user | v0.1-beta onward |
| Multi-agent protocol scales | SWE-Bench: model + CodeMAD > model alone | Parallel story merge success rate | v0.2+ |
| Users prefer structured over unstructured | Second project rate: 80% beta, 40% public | Protocol completion rate (leading), time-in-protocol vs time-in-quick-flow ratio | Beta onward |
| Protocol-generated data creates switching costs | Qualitative: users reference past project data in new projects | Cross-session memory surface rate (how often past data is shown and useful) | v0.1-beta onward |

**Protocol completion rate** is the single most important leading indicator. It is measurable from day one on Costa's own projects, before any beta testers are needed. If completion rate is below 50% in alpha, the protocol is too heavy and needs simplification before beta.

### Innovation Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **Users perceive protocol as bureaucracy, not value** (primary risk) | High | Quick Flow bypass for small tasks. Research catches prove value concretely within the first project. Phase indicators show forward momentum, not ceremony. Personas (Marco, Priya, Tomas) don't want structure -- they want the outcomes structure produces. The protocol must be invisible infrastructure, not visible overhead. |
| Protocol overhead makes CodeMAD slower for simple tasks | Medium | Quick Flow (spec + build) skips the full protocol. Two-track UI separates protocol work from quick edits. The protocol is for projects, not one-liners. |
| Research phase doesn't find enough catches | Medium | Context7 integration for real-time documentation. If catches are consistently low, the research agent needs tuning -- tracked via metrics and addressed in sprint retrospectives. |
| Protocol-generated data creates privacy concerns | Medium | All data is local-first. No cloud sync. No aggregate data collection without explicit opt-in. Users own their data. |
| Market doesn't adopt structured AI coding | Low (long-term) | The desktop app proves the protocol works. MCP exposure distributes it as a layer beneath any tool. Protocol certification (v1.0+) creates a standard. The app is phase one of a protocol company, not the end state. |

### Long-Term Innovation Trajectory

The desktop app is the delivery mechanism. The real IP is the four-phase methodology with human gates.

1. **v0.1-v0.2 (Prove):** Desktop app validates the protocol works for individual developers.
2. **v0.3-v0.5 (Refine):** Protocol data powers measurable quality claims. User progression tracking demonstrates compounding value.
3. **v1.0+ (Distribute):** MCP exposure lets other tools run the CodeMAD Protocol. "Built with CodeMAD Protocol" becomes a certification mark. The protocol becomes a standard, like how ESLint configs became shareable.
4. **v2.0 (Platform):** Community-driven protocol evolution. Protocol extensions for specific domains (fintech, healthcare, gaming). The methodology outlives any single tool.

## Desktop Application Requirements

### Platform Support

| Platform | Target Release | Minimum OS Version | Notes |
|----------|---------------|-------------------|-------|
| macOS | v0.1-alpha | macOS 13 (Ventura) | Sole platform for alpha and beta. Code signing via Apple Developer ($99/year). |
| Windows | v0.1-rc | Windows 10+ | Ships with BYOK and wider audience readiness. Code signing via EV certificate (~$200-500/year). |
| Linux | v0.2.1 | Ubuntu 22.04+ / Fedora 38+ | Ships alongside Ollama as the "privacy-first" release. AppImage as primary packaging format. |

**Prerequisites on user's system:**
- Git CLI (required). CodeMAD uses git for version control, worktree isolation, and merge operations. The app detects git on first launch and shows an install prompt if missing.
- A supported LLM provider account (OAuth or BYOK) for any AI-powered features.

**Platform CI requirement:** each platform is tested in its own CI pipeline before its target release. macOS CI from v0.1-alpha, Windows CI from v0.1-rc, Linux CI from v0.2.1. No platform ships without automated test coverage on that platform.

### System Integration

**Git integration:** all git operations use the CLI via Bun subprocess calls. No libgit2 or embedded git. This keeps the dependency simple, debuggable, and compatible with the user's existing git configuration (SSH keys, GPG signing, custom hooks).

**Credential storage:** OS-native keychain (macOS Keychain, Windows Credential Manager, libsecret on Linux). OAuth tokens and BYOK API keys are stored in the system keychain, never in plain text files or app-local storage.

**File system monitoring:** real-time detection of project file changes during Phase 4 (Implementation). Required for the builder-validator loop to detect when generated code has been written and trigger quality gates. Implementation mechanism is an architecture decision (fs.watch, chokidar, or Tauri's native watcher).

**Shell CLI command** (`codemad .` to open a project from terminal): Growth feature (v0.3+). Not in MVP scope.

**Deep links** (`codemad://open?project=X`): Growth feature (v0.3+). Not in MVP scope.

### Update Strategy

**Mechanism:** Tauri's built-in updater plugin (tauri-plugin-updater). Handles code signing verification, delta updates, and rollback natively on macOS and Windows.

**Infrastructure prerequisite:** the updater requires an HTTPS endpoint serving update artifacts and a JSON manifest. At alpha, GitHub Releases serves this role. At beta with multiple channels, a dedicated update server or channel-aware routing is needed.

**Update channels:**

| Channel | Audience | Frequency | Behaviour |
|---------|----------|-----------|-----------|
| beta | Invited testers (v0.1-beta onward) | Frequent (multiple times per week during active development) | Persistent "update available" banner. Not forced. |
| stable | All users (v0.1-rc onward) | Release-gated (only on version bumps) | Persistent "update available" banner. Not forced. |

**Update behaviour:**
- Normal updates are never forced. Users see a persistent but dismissable "update available" banner with a one-click install action.
- **Security-critical updates** (credential storage vulnerabilities, authentication bypasses, agent trust boundary breaches) show a blocking modal: "A security update is required. Update now or quit." The user can quit but cannot continue using the vulnerable version. This is standard practice for desktop apps handling credentials (1Password, Bitwarden).
- The app checks for updates on launch and every 24 hours while running.

### Offline Capabilities

**Principle:** all non-LLM features work without internet. LLM features require a provider connection or a local model (v0.2.1+).

| Feature | Works Offline | Notes |
|---------|--------------|-------|
| Browse past projects | Yes | Project data is local. |
| View protocol history and decision audit trail | Yes | Stored locally. |
| View quality metrics and progression | Yes | LanceDB is embedded. |
| Memory search (cross-session) | Yes | LanceDB queries are local. |
| Start/resume a project | Partial | Works until the first LLM API call, then pauses with "no connection" message. |
| LLM-powered features (brainstorming, research, code generation) | No (cloud) / Yes (Ollama v0.2.1+) | Requires provider connection or local model. |
| File editing and git operations | Yes | Git CLI and file system are local. |
| Semgrep security scanning | Partial | Bundled rules work offline. Rule updates require internet. Stale rules still pass quality gates but may miss newer vulnerabilities. |

**Offline UX:** when the app detects no internet connection, it shows a subtle "offline" indicator in the status bar. LLM-dependent actions show "Requires connection -- connect to a provider or use a local model" instead of failing silently. The app never loses work or state due to connectivity loss.

**Offline test coverage:** offline mode has dedicated test coverage that runs without network access (simulated offline environment in CI). This ensures the offline principle holds across releases.

### Implementation Considerations

**Bundle size:** Tauri produces small bundles (~10-15MB vs Electron's ~150MB+). This matters for first-install experience and auto-updates (smaller deltas).

**Cold start performance:** targets already defined in Technical Success (under 6s first launch, under 3s subsequent). The Bun sidecar process spawn is the primary contributor to startup time -- architecture must optimise this path.

**Memory ceiling:** target already defined (under 800MB for 3 parallel agents). Desktop apps that consume excessive memory lose user trust. Empirical measurement at alpha, optimisation if above target.

**Sections explicitly skipped** (per project-type CSV configuration): web SEO, mobile-specific features. These are not relevant to a desktop-first application.

## Brownfield Protocol Support

The protocol supports both greenfield (new project from scratch) and brownfield (changes to an existing codebase). Most real developer work is brownfield. If the protocol only handles greenfield, its value is artificially limited.

**How the four phases adapt for brownfield projects:**

| Phase | Greenfield Path | Brownfield Path |
|-------|----------------|-----------------|
| Phase 1 (Analysis) | Brainstorm from scratch. Research market, domain, and technology. | **Scan and document existing codebase first** (tech stack, architecture, APIs, data models, patterns, conventions). Then brainstorm changes within existing constraints. |
| Phase 2 (Planning) | Create PRD for new product. | Create PRD for changes, informed by existing codebase documentation. PRD references existing capabilities and specifies what changes, what's new, and what's preserved. |
| Phase 3 (Solutioning) | Create architecture from scratch. | **Extend existing architecture.** Respect existing patterns and conventions. Architecture document describes modifications, not a full rebuild. New components integrate with existing structure. |
| Phase 4 (Implementation) | Build everything new. | Modify existing code. Respect existing naming, structure, and pattern conventions. AI agents follow the project's style, not their defaults. |

**Brownfield Phase 1: Codebase Understanding (new protocol step)**

Before planning changes to an existing project, the protocol scans and documents the codebase. This step produces reference documentation that all subsequent phases consume:

- **Tech stack classification** -- languages, frameworks, database, build tools, package managers, versions
- **Architecture extraction** -- patterns, component structure, data flow, entry points
- **API contracts** -- existing endpoints, data models, authentication patterns
- **Code conventions** -- naming patterns, file structure, testing approach, style rules
- **Integration points** -- where components connect, external dependencies, configuration

This documentation becomes the constraint set for Phases 2-4. The PRD respects it. The architecture extends it. The implementation follows it.

**Codebase scan levels:**

| Level | What It Does | When to Use |
|-------|-------------|-------------|
| Quick | Reads configs, manifests, directory structure. No source file reading. | Small changes, familiar codebase. |
| Deep | Reads critical directories per project type. | Feature additions, moderate changes. |
| Exhaustive | Reads all source files (excluding node_modules, dist, build). | Major refactors, unfamiliar codebase. |

**Existing pattern preservation:**

The protocol detects and enforces existing code conventions during implementation. AI agents generating code for brownfield projects must match:
- Existing naming conventions (camelCase vs snake_case, file naming patterns)
- Existing project structure (where new files go, how modules are organised)
- Existing testing patterns (test framework, test file location, assertion style)
- Existing error handling patterns
- Existing documentation style

This is enforced through the architecture document's "Implementation Patterns and Consistency Rules" section (Step 5 of the architecture workflow), which for brownfield projects is populated from the codebase scan rather than defined from scratch.

**Quick Flow is inherently brownfield.** Small changes to existing projects are the primary Quick Flow use case. Quick Flow skips the full codebase scan (assumes the user knows the project) but still respects detected conventions.

**Brownfield support in the roadmap:**

| Release | What Ships |
|---------|-----------|
| v0.1-alpha | Basic brownfield support: codebase scan (quick and deep levels), convention detection, Phase 2-4 adaptation for existing projects. |
| v0.1-beta | + Exhaustive scan level. + Deep-dive mode for specific modules. + Scan resumability for large codebases. |
| v0.2+ | + Multi-agent brownfield (parallel story execution respecting existing code). + Cross-session memory of codebase patterns. |

## Functional Requirements

80 functional requirements across 8 capability areas, organised by user value. Each FR states WHAT capability exists, not HOW it is implemented. FRs cover the committed roadmap (v0.1-alpha through v0.2.2). Growth (v0.3+) and Vision (v0.6+) capabilities are outlined in the Product Scope section and will be formalised into FRs as they enter active planning.

### Protocol Execution

- **FR1:** User can start a new project and enter the four-phase protocol (Analysis, Planning, Solutioning, Implementation)
- **FR2:** User can progress through protocol phases sequentially with gates between each phase
- **FR3:** User can review and approve AI-generated planning artefacts at each phase gate before advancing
- **FR4:** User can view a pre-flight checklist showing readiness status (green/yellow/red) before phase transitions
- **FR5:** User can edit specific items within the pre-flight checklist without resetting the current phase or losing work
- **FR6:** User can use Quick Flow to make small changes to existing projects without running the full four-phase protocol
- **FR7:** User can choose between protocol mode (full four phases) and free mode (Quick Flow) as two distinct interaction modes within the same project
- **FR8:** User can view protocol phase progression indicators showing current position and forward momentum
- **FR9:** System can detect mismatches between planning artefacts and implementation reality during Phase 4 execution
- **FR10:** System can classify course corrections by scope (minor/moderate/major) and route to the appropriate sub-agent for resolution
- **FR11:** User can review and approve or reject course correction proposals with before/after comparison
- **FR12:** System can facilitate structured brainstorming through a conversational interface using all guided discovery techniques (question storming, stress testing, morphological analysis) in Phase 1
- **FR13:** User can run multiple concurrent conversations within a project
- **FR14:** System can conduct a retrospective after epic completion, capturing lessons learned (basic local capture at alpha, cross-session memory storage at v0.2+)

### Authentication and Provider Access

- **FR15:** User can authenticate with LLM providers via OAuth (one-click browser flow)
- **FR16:** User can authenticate with LLM providers via BYOK (manual API key entry)
- **FR17:** User can complete authentication via manual code entry when browser redirect fails
- **FR18:** User can switch between authenticated providers during a session
- **FR19:** System can refresh expired tokens silently without interrupting the user's workflow or losing state
- **FR20:** System can detect provider-side session invalidation and prompt re-authentication while preserving in-progress work
- **FR21:** System can handle provider rate limits by pausing agents, displaying estimated wait time, and auto-resuming when limits reset
- **FR22:** System can persist authenticated sessions across app sleep/wake cycles and extended backgrounding
- **FR23:** User can connect a local LLM via Ollama as a provider for fully offline AI execution
- **FR24:** System can monitor credential health and alert users when tokens approach expiry or API keys need rotation

### Project Lifecycle

- **FR25:** User can create a new greenfield project from scratch
- **FR26:** User can create a new brownfield project targeting an existing codebase
- **FR27:** User can view a list of past projects with name, date, current phase, and last quality score
- **FR28:** User can switch between projects and view historical metrics per project
- **FR29:** System can detect interrupted sessions on app launch and offer to resume from the last completed checkpoint
- **FR30:** User can view a project completion summary showing quality metrics, research catches, and build time
- **FR31:** System can display the user's last project quality score and at least one relevant pattern from cross-session memory when starting a new project
- **FR32:** User can start a project from an empty state with guided project creation
- **FR33:** User can complete a guided onboarding flow on first launch (provider authentication, first project creation)
- **FR34:** User can view and manage story status within a sprint (backlog, ready-for-dev, in-progress, review, done)
- **FR35:** System can prompt users to start a new project after completing or reaching a milestone in the current project

### Codebase Intelligence

- **FR36:** System can scan an existing codebase at quick, deep, or exhaustive levels, extracting tech stack, architecture patterns, API contracts, code conventions, and integration points into reference documentation
- **FR37:** System can enforce detected code conventions during implementation, flagging deviations and offering auto-correction during code generation
- **FR38:** Research agents can query real-time external documentation during the research phase
- **FR39:** System can store and retrieve cross-session memory (past decisions, patterns, project history) for use in new projects
- **FR40:** System can surface relevant past project data (research catches, architecture decisions, quality patterns) when starting a new project
- **FR41:** Research agents can cite sources for claims, and uncited claims are visually distinguished from cited claims in the output

### Code Generation and Agent Execution

- **FR42:** System can execute the protocol with a single agent processing stories sequentially
- **FR43:** System can execute the protocol with multiple agents processing stories in parallel across isolated git worktrees
- **FR44:** System can maintain shared state accessible to all active agents within a session
- **FR45:** System can coordinate agent task assignments and completion status during multi-agent execution
- **FR46:** System can merge completed worktrees automatically via AI-powered conflict resolution and escalate unresolvable conflicts to the user for manual resolution
- **FR47:** System can run a builder-validator loop that triggers quality gates on generated code and auto-fixes failures
- **FR48:** System can recover from agent failures by preserving state at the last completed subtask and offering resume
- **FR49:** User can view preserved agent state after a mid-story failure and choose to resume from the last completed subtask
- **FR50:** User can select a permission mode -- Guardian (explicit approval for all writes and commands), Balanced (auto-approve within worktree scope), Autopilot (auto-approve all non-destructive actions) -- that gates agent file and shell access
- **FR51:** System can enforce agent trust boundaries per tier (Orchestrator, Phase, Specialist, Researcher) restricting file access and capabilities
- **FR52:** User can select which LLM model to use for agent execution
- **FR53:** System can manage version control for parallel agent work, including branch isolation and merge integration

### Quality and Security

- **FR54:** System can run quality gates (lint, type check, unit tests) on every generated code change
- **FR55:** System can run security scanning on every generated code change as a mandatory quality gate
- **FR56:** System can track and display research catches (critical, moderate, informational) per project
- **FR57:** System can track quality gate first-pass rates at file, story, and epic levels
- **FR58:** User can view quality progression across multiple projects
- **FR59:** System can compute and display a code quality score (0-100) from lint pass rate, type check pass rate, test pass rate, security findings density, and integration results, with equal initial weighting
- **FR60:** System can isolate user code content from agent instruction context to prevent prompt injection
- **FR61:** System can sandbox MCP tool execution to project-scoped file access and documented API endpoints only
- **FR62:** System can track and display protocol completion rates (percentage of started projects reaching each phase)

### Compliance and Auditability

- **FR63:** System can label AI-generated content in the UI, distinguishing AI-generated from human-authored content
- **FR64:** System can attach provenance markers (agent ID, timestamp, phase) to every generated or modified code file
- **FR65:** System can record whether each planning artefact section is AI-generated, human-authored, or human-edited-from-AI-draft
- **FR66:** System can record phase gate decisions including the human approver and what was approved
- **FR67:** User can export an authorship report listing all phase gate decisions, human approvals, and AI content changes
- **FR68:** System can maintain a tamper-evident decision audit trail (append-only log with content checksums)
- **FR69:** System can enforce write isolation between implementation agents and planning artefacts

### Application Platform

- **FR70:** System can install and run on macOS, Windows, and Linux
- **FR71:** System can check for and deliver updates via beta and stable channels
- **FR72:** System can enforce security-critical updates with a blocking prompt before allowing continued use
- **FR73:** User can use all non-LLM features without internet connectivity
- **FR74:** System can detect offline state and display a clear indicator, with informative messages on LLM-dependent actions
- **FR75:** System can preserve work-in-progress at subtask-level checkpoints and resume operations when network connectivity is restored
- **FR76:** System can collect and send opt-in crash reports containing error context but never user code
- **FR77:** User can view running token count and estimated cost during active protocol execution
- **FR78:** User can view historical token usage and cost per project
- **FR79:** System can verify code signing integrity on first launch
- **FR80:** System can detect missing prerequisites (git CLI) on first launch and guide installation

## Non-Functional Requirements

40 non-functional requirements across 9 categories. Each NFR specifies HOW WELL the system must perform, with measurable targets. Only categories relevant to a desktop-first AI coding platform are included. Scalability, availability, and internationalisation are explicitly skipped (desktop app, single user, English-only through v0.2.2).

### Performance

- **NFR1:** Cold start time (first launch including Gatekeeper/SmartScreen verification): under 6 seconds
- **NFR2:** Cold start time (subsequent launches): under 3 seconds
- **NFR3:** Local processing overhead (message sent to API call dispatched to first SSE byte forwarded to frontend): under 100ms
- **NFR4:** User-perceived time-to-first-token: under 2 seconds including provider latency. A "streaming started" indicator shown within 500ms of sending
- **NFR5:** LanceDB semantic search query time: under 500ms for 10k+ vectors
- **NFR6:** Quality gate execution time (lint + type check + test): under 60 seconds for stories under 50 files
- **NFR7:** Codebase scan time -- quick level: under 30 seconds for projects up to 10,000 files. Deep level: under 5 minutes for projects up to 50,000 files. Exhaustive level: under 15 minutes with progress indication
- **NFR8:** Agent spawn time (from task assignment to agent's first visible action): under 5 seconds
- **NFR9:** Update download size: under 20MB for delta updates via Tauri's built-in delta mechanism

### Security

- **NFR10:** All credentials (OAuth tokens, API keys) stored in OS-native keychain (macOS Keychain, Windows Credential Manager, libsecret on Linux). Never in plaintext files or app-local storage
- **NFR11:** All LLM API communication over HTTPS. No credential values logged, displayed in UI, or included in crash reports
- **NFR12:** User code content isolated from agent instruction context (system prompts, tool instructions). Verified by static analysis of all prompt templates
- **NFR13:** MCP tools sandboxed to project-scoped file access and documented API endpoints. No access outside project directory
- **NFR14:** Code signing verified on every platform before distribution. macOS notarisation, Windows EV certificate, Linux package signing
- **NFR15:** Adversarial prompt injection test suite runs in CI for every change to agent prompt templates

### Privacy and Data Handling

- **NFR16:** User source code never transmitted to any server other than the user's chosen LLM provider API. No CodeMAD servers, no analytics services, no cloud intermediaries
- **NFR17:** No telemetry or usage data collected without explicit opt-in. Crash reports are opt-in and exclude user code, file contents, and project-specific data
- **NFR18:** Direct API calls from the desktop app to LLM providers. No proxy servers or relay infrastructure
- **NFR19:** All project data (code, embeddings, memory, protocol state) stored locally on the user's machine. No cloud synchronisation

### Reliability

- **NFR20:** Agent checkpoint granularity at subtask level. No more than one subtask of work lost on any failure (agent crash, provider outage, app crash, OS sleep/wake)
- **NFR21:** AI-powered merge resolves conflicts in synthetic test scenarios with at least 90% success rate. Real-world rate tracked separately from production data
- **NFR22:** Session state survives app crashes, OS sleep/wake cycles, and provider outages without user intervention beyond selecting "resume"
- **NFR23:** Update mechanism includes rollback capability. If an update introduces a breaking issue, the user can revert to the previous version
- **NFR24:** All non-LLM features operational without internet connectivity. LLM-dependent actions pause with clear messaging, never fail silently

### Resource Constraints

- **NFR25:** Memory ceiling: under 800MB resident memory for 3 parallel agents. Under 400MB for single-agent mode. Measured empirically at alpha, optimised if above target
- **NFR26:** Bundle size: under 30MB installer (Tauri target ~10-15MB)
- **NFR27:** Disk usage per project (excluding user source code): under 500MB for LanceDB indices, protocol state, and cross-session memory combined
- **NFR28:** Cross-session memory implements automatic compaction. Data older than 12 months or exceeding 100 projects is eligible for automatic compaction with user notification before deletion

### Usability

- **NFR29:** OAuth setup completion rate: 95%+ (users who start the OAuth flow successfully complete authentication)
- **NFR30:** Every application state includes a visible next-action prompt or status indicator
- **NFR31:** All user-facing error messages include the failure cause, preservation status of in-progress work, and at least one actionable next step

### Accessibility (MVP Baseline)

- **NFR32:** All primary actions accessible via keyboard navigation
- **NFR33:** Colour contrast meets WCAG 2.1 AA minimum (4.5:1 for normal text, 3:1 for large text)
- **NFR34:** No information conveyed by colour alone -- icons, labels, or patterns supplement colour indicators (pre-flight checklist green/yellow/red must include text labels or icons)
- **NFR35:** Full EU European Accessibility Act (EAA) compliance deferred to v0.6. MVP provides baseline keyboard and contrast support

### Integration Compatibility

- **NFR36:** Compatible with git CLI versions 2.20+ (minimum version required for worktree features used by multi-agent execution)
- **NFR37:** OAuth flows compatible with standard browser-based redirect. Fallback to manual code entry for restricted browser environments
- **NFR38:** All MCP integrations follow the Model Context Protocol specification for interoperability

### Test Quality

- **NFR39:** Quality gate test suites produce identical results on repeated execution. A test that fails intermittently is treated as a blocking defect (zero flaky tests)
- **NFR40:** No completed story introduces regressions in previously passing stories. Verified by full regression suite execution after each story completion
