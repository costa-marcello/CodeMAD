---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - brainstorming-session-2026-02-10.md
  - domain-ai-coding-tools-research-2026-02-10.md
  - market-ai-coding-tools-research-2026-02-10.md
  - technical-codemad-tech-stack-decisions-research-2026-02-10.md
date: 2026-02-10
author: Costa
prdAligned: '2026-02-12'
---

# Product Brief: CodeMAD

## Executive Summary

CodeMAD is a desktop-first software creation platform built around the CodeMAD Protocol -- a structured methodology that guides both humans and AI through analysis, planning, solutioning, and implementation to produce working software with confidence.

Every tool in the AI coding market answers "how do I write code faster?" CodeMAD answers a different question: "how do I build software that works?" The $7.4B market (26.6% CAGR) has a defining crisis -- tools generate code faster than ever, but developer trust in AI output dropped from 43% to 33%. PR sizes are up 150% while bugs increased 9%. Frameworks like BMAD prove that structured approaches dramatically improve quality, but they are too complex for real adoption.

CodeMAD solves this by embedding a proven methodology into an automated, guided platform. It delivers the quality of BMAD with the ease of Bolt. Every AI decision is backed by research. Every step is guided so users know exactly what to do next. The protocol reduces the gap between intent and working software -- whether the user is an experienced developer frustrated with debugging AI-generated code, or a vibecoder whose projects keep collapsing past the prototype stage.

The protocol is simultaneously the product differentiator (no competitor has it), a legal defence (human decision gates create copyright protection for users' code), and a regulatory compliance mechanism (phase documentation satisfies EU AI Act transparency requirements by August 2026).

**Secondary audience:** Team leads gain consistency (same protocol, same standards regardless of developer experience). Clients and stakeholders gain transparency (phase milestones replace opaque "percentage done" estimates).

**Adoption paths:** Three routes into CodeMAD -- (1) vibecoder-to-quality: users adopt the protocol to catch issues their current tools miss, (2) developer-to-orchestrator: experienced developers shift from writing code to directing agents through the protocol, (3) junior-to-senior: growing developers use protocol guidance to accelerate skill development.

The protocol supports both greenfield (new projects from scratch) and brownfield (changes to existing codebases). Most real developer work is brownfield -- a greenfield-only protocol would be artificially limited.

---

## Core Vision

### Problem Statement

AI coding tools have created a paradox: developers ship code faster than ever, but the code doesn't work as expected. The result is an endless iteration loop -- build, test, fix, rebuild -- that consumes the time AI was supposed to save.

This happens for three reasons:

1. **Humans struggle to guide AI effectively.** Both technical and non-technical users fail to articulate requirements with enough precision for AI to execute correctly. Without a structured process, critical requirements get missed.

2. **AI builds on outdated knowledge.** Models are trained 6-12 months behind current technology. In a market where frameworks, APIs, and best practices change quarterly, AI confidently implements patterns that are already deprecated.

3. **No tool enforces quality before shipping.** Current AI coding tools prioritise speed over correctness. Code is generated without research verification, architectural planning, or test design.

CodeMAD's real competitor is not Cursor or Copilot. It is the absence of methodology -- the chaos of unstructured AI-assisted development that produces 1.7x more issues and 2.74x more security vulnerabilities than disciplined approaches.

### Problem Impact

**Priya's story -- the experienced vibecoder:**
Priya built a SaaS dashboard for a client using Cursor and Bolt. The first version shipped in a week. Then the client asked for user roles and the whole auth layer collapsed -- because there was no architecture, no tests, and no plan for how features would interact. Rebuilding cost her three weeks and a strained client relationship. The gap between "demo that works" and "product that scales" keeps burning her, project after project.

**Marco's story -- the quality guardian:**
Marco has shipped production code for eight years. He uses Claude Code daily and it makes him faster at writing code. But he spends more time debugging AI output than he did writing code by hand. The AI misses edge cases, uses deprecated APIs, and ignores his team's architecture patterns. He doesn't need guidance on how to build software. He needs a way to make AI follow the engineering discipline he already understands but cannot get AI to follow.

Both Priya and Marco share the same outcome: time lost to AI-generated code that "almost works," and the growing suspicion that AI tools create as much work as they save.

### Why Existing Solutions Fall Short

Every tool in the market answers "how do I write code faster?" None answers "how do I build software that works?"

IDE tools accelerate code generation without methodology. Cloud builders prototype fast but produce fragile apps that break at scale. CLI agents are powerful but unguided. Methodology frameworks prove the approach but lack dedicated tooling and are too mechanical for adoption.

The gap: no tool combines a proven methodology with an automated, guided platform that makes structured development as easy as vibe coding.

### Proposed Solution

CodeMAD embeds the CodeMAD Protocol -- a four-phase methodology (Analysis, Planning, Solutioning, Implementation) -- into a desktop-native platform that guides users step by step through building real software.

Three operational principles run through every phase:

- **Research at every stage when required -- architecture time is the most critical.** Not just during Analysis. Researcher agents verify that architecture decisions, implementation patterns, and library choices are current before any work begins. Architecture-time research matters most because wrong patterns chosen here cascade through every story, every file, and every test. A developer implementing a feature gets automatic research confirming the approach uses up-to-date APIs and best practices. The platform ships with pre-installed MCP tools that make this research automatic and invisible to the user -- they do not need to know these tools exist, configure them, or even understand what MCP is. The research just happens.
- **Automatic validation and verification sub-agents.** At key checkpoints, the protocol spins up validation and verification agents without the user triggering them. These agents check consistency between artifacts, verify architecture decisions, and catch contradictions before they become code. The user sees new agents appear -- the quality assurance is built into the workflow.
- **Parallel work streams.** When stories are created, multiple Story Developer agents build in parallel, each implementing one story end-to-end (backend + frontend + tests) in an isolated git worktree. Parallelism comes from running multiple stories simultaneously as vertical slices, not from splitting layers. The protocol treats AI agents as a proper development team, not a single-threaded assistant.

#### Phase 1: Analysis

The user describes what they want. The protocol guides them through structured discovery:

1. **Brainstorming** -- guided facilitation through multiple techniques (question storming, morphological analysis, SCAMPER, stress testing)
2. **Research** -- researcher agents automatically investigate the market, domain, and technical landscape. Current patterns, competitor approaches, and regulatory requirements are gathered before any decisions.
3. **Product Brief** -- structured discovery produces a comprehensive brief: vision, personas, success metrics, and scoped release plan. Once the brief is validated, brainstorming notes and research documents are cleaned up automatically. The Product Brief is the sole surviving artifact.

Each phase starts with fresh context. The Phase 2 orchestrator does not inherit Phase 1's conversation -- it reads the validated Product Brief as its only input. This prevents context bleed between phases and keeps each phase focused.

#### Phase 2: Planning

The product brief becomes implementation-ready requirements and (optionally) a UX design.

1. **PRD creation** -- the product brief becomes detailed requirements with acceptance criteria.
2. **UX Design** (optional) -- user experience design runs alongside or after the PRD. Not all projects need a UX design (CLIs, libraries, APIs). If skipped, only the PRD is produced and validated.
3. **Consistency check** -- if UX is included, an automatic sub-agent verifies PRD and UX are aligned. Every button described in the UX must map to a requirement in the PRD. Every user flow in the PRD must have a corresponding UX design.

#### Phase 3: Solutioning

Architecture and design decisions are made explicitly, each backed by current research. This is the most research-intensive phase in the entire protocol.

1. **Architecture creation** -- researcher agents verify that technology choices, patterns, and integrations are current. No building on 12-month-old training data. The platform's pre-installed MCP tools do the heavy lifting: Context7 pulls real-time library documentation so the architecture references actual current APIs, not what the model was trained on. Semgrep scans for security vulnerabilities and unsafe patterns as architecture decisions are made, not after code is written. These tools are invisible to the user -- they ship with the platform and run automatically. Many developers do not know tools like these exist. CodeMAD ensures every project benefits from them regardless of the user's awareness.
2. **Architecture verification** -- an automatic sub-agent validates the architecture against the PRD and UX. Checks for contradictions, missing requirements, and structural gaps.
3. **Epic and Story creation** -- requirements are broken into implementable stories as vertical slices. Each story delivers complete functionality (backend + frontend + tests), not a layer.
4. **Implementation Readiness Check** -- a cross-artifact consistency check verifies that the brief, PRD, UX, architecture, and stories are all aligned with no contradictions. This is the final gate before coding begins.

#### Phase 4: Implementation

Multiple Story Developer agents build in parallel (up to 3 by default, configurable), each implementing one story end-to-end in an isolated git worktree.

1. **Story elaboration** -- each story from Phase 3 is expanded into a detailed implementation spec with dev notes, tasks, and acceptance criteria. A validation sub-agent reviews the spec for gaps before development starts.
2. **Development** -- multiple stories run in parallel as vertical slices. Each Story Developer builds one story end-to-end (backend + frontend + tests) in its own git worktree. Parallelism comes from running stories simultaneously, not from splitting layers.
3. **Automatic code review** -- a reviewer sub-agent inspects code as it is produced. Builder-validator pattern ensures code passes all quality gates before the user sees it. Pre-installed Semgrep scans every code change for security vulnerabilities, unsafe patterns, and known CVEs automatically. The user does not trigger this -- it is part of the platform.
4. **Course correction** -- when implementation reveals issues with the plan, the protocol routes fixes by scope. Minor issues (story-level tweaks) are handled by a scrum master sub-agent. Moderate issues (epic/story restructuring, PRD gaps) are handled by a product manager sub-agent with automatic readiness re-check. Major issues (architecture flaws) are handled by an architect sub-agent first, then a product manager sub-agent, with automatic readiness re-check. Maximum 2 correction cycles before escalating to the user. A Story Developer never edits planning artifacts directly -- this mirrors real-team delegation.
5. **Story completion** -- each story passes through quality gates (lint, type check, build, test, security scan, review) before being marked complete.
6. **Epic retrospective** -- when all stories in an epic are implemented, a retrospective captures lessons learned. These lessons are stored in cross-session memory (LanceDB) and are accessible to the developer and to future agents working on the project. Patterns, gotchas, and decisions are preserved so the same mistakes are never repeated. The retrospective can also trigger course correction if it detects issues affecting the next epic.

#### Pre-Installed Intelligence

The platform ships with MCP (Model Context Protocol) tools built in. Users do not need to know what MCP is, install anything, or configure anything. The tools run automatically as part of the protocol.

| Tool | What it does | When it runs |
|------|-------------|-------------|
| Context7 | Pulls real-time library documentation. When the AI makes an architecture decision or writes code that uses a library, Context7 fetches the actual current docs -- not what the model was trained on 6-12 months ago. | Architecture creation, implementation, code review |
| Semgrep | Scans for security vulnerabilities, unsafe patterns, and known CVEs. Checks code against security rules as it is produced, not after deployment. | Architecture creation, code review, quality gates |

Most developers do not know these tools exist. Many AI coding tools generate insecure code because they lack this layer entirely. CodeMAD makes security scanning and current documentation the default for every project, every user, regardless of experience level. This directly addresses two of the three root causes: AI building on outdated knowledge (Context7 solves this) and no tool enforcing quality before shipping (Semgrep solves this for security).

Additional MCP tools will be added over time. The architecture supports lazy loading of MCP tools so the platform can expand its built-in intelligence without increasing token costs or startup time.

**For the user, this means:**
- Every step is guided. You always know what to do next.
- Every AI decision is research-backed at the moment it is made, not based on stale training data.
- Validation happens automatically. Consistency checks, architecture verification, and code review run without the user triggering them.
- Multiple stories develop in parallel, each built end-to-end by one Story Developer agent. The protocol treats your project like a real team, not a single-threaded conversation.
- Lessons are captured and remembered. The retrospective after each epic feeds into the project's memory, making every subsequent sprint smarter.
- Security scanning and current library documentation happen automatically. You get the benefit of tools most developers do not know exist, without configuring anything.
- Build with the confidence that your code was planned, tested, validated, and reviewed before you ever see it.
- The same platform serves vibecoders, experienced developers, and growing juniors -- the protocol adapts, the quality stays consistent.

### BMAD Method Research Prerequisite

The CodeMAD Protocol is built on the BMAD methodology (Build Methodology for AI-Driven Development). Before architecture design begins, the BMAD method must be deeply researched to understand:

- The exact workflow sequence (analysis, planning, solutioning, implementation, retrospective)
- How sub-agents coordinate across phases (consistency checks, verification, code review)
- How artifacts flow between phases (brief → PRD → architecture → stories → code)
- How the retrospective and lesson storage mechanism works
- How vertical-slice parallelisation is managed within the methodology (multiple stories in parallel, not layer splitting)

This research is a hard prerequisite for the architecture document. Incorrect implementation of the methodology would undermine the entire product thesis.

### OpenAI OAuth Research Prerequisite

OpenCode (open-source AI coding tool) has already implemented OAuth with OpenAI's API. Before architecture design begins, study OpenCode's implementation to understand:

- Token exchange mechanism (authorisation code flow, PKCE, or other)
- Refresh token handling and session persistence
- OAuth scope requirements for API access
- How ChatGPT Plus / Team / Enterprise subscriptions map to API access and rate limits
- Any limitations or gotchas discovered in production use

This research informs the universal auth adapter architecture and validates the zero-cost adoption strategy.

### Innovation Analysis

**Core innovation: the methodology is the product.**

No AI coding tool structures work through a mandatory methodology pipeline. Cursor, Windsurf, Claude Code, Copilot -- all provide AI capabilities without prescribing how to use them. CodeMAD inverts this: the four-phase protocol is the product. The AI is the execution engine underneath. This is a Blue Ocean move -- competitors compete on AI capability, CodeMAD competes on methodology.

The protocol creates three value streams simultaneously. None require separate features -- they emerge from the protocol's structure:

1. **Quality improvement through research-before-code.** Every competitor moves directly from prompt to code. CodeMAD forces discovery before implementation. The research catches metric (at least 3 critical/moderate per project) measures this concretely. Users get "AI that prevents bugs before code exists."

2. **Legal protection through human decision gates.** Protocol phases create "substantial human participation" evidence -- the strongest IP protection available for AI-assisted code. Human gates at each phase are the legal mechanism. No competitor offers this.

3. **Regulatory compliance through phase documentation.** The decision audit trail satisfies EU AI Act transparency requirements (deadline: Aug 2, 2026). Each phase gate is a documented human decision point. Users get regulatory readiness without additional work.

**Protocol-generated data as competitive moat.** Every protocol run generates data no competitor can collect: research catches (what the AI would have gotten wrong), phase gate corrections (what humans changed), quality gate metrics (how good the output was), and cross-session patterns (what improved across projects). This data creates switching costs -- a user's protocol history, catches, and quality progression live in CodeMAD and are not exportable to unstructured tools. Project N+1 is measurably better than Project N because cross-session memory learns from the user's own patterns.

---

## Target Users

### Primary Personas

#### Marco -- The Quality Guardian

**Context:** Marco has shipped production code for eight years. He uses Claude Code daily and it makes him faster at writing individual functions. But he spends more time debugging AI output than he saved generating it. The AI misses edge cases, uses deprecated APIs, and ignores his team's architecture patterns. He does not need guidance on how to build software -- he needs a way to make AI follow the engineering discipline he already understands.

**Problem experience:** Marco's frustration is not with AI capability but with AI discipline. He knows that research, planning, and test design produce better outcomes. But current tools skip all of that. He ends up doing the discipline work manually -- checking documentation, verifying API versions, writing tests after the fact -- which defeats the purpose of using AI. He is part of a growing segment: experienced developers whose trust in AI output dropped from 43% to 33% in a single year. Only 2.6% of developers at his experience level "highly trust" AI tools. He uses them anyway because the alternative is falling behind.

**Success vision:** Marco points CodeMAD at a feature requirement and the protocol does what he would do if he had unlimited time: research the latest patterns, plan the architecture, design tests before code, and implement with validation. He reviews AI decisions at each phase gate rather than debugging AI output after the fact. His team adopts it because it enforces the engineering standards he has been trying to maintain through code review alone.

**What makes him stay:** The protocol matches his engineering instincts. The research phase catches outdated patterns before they become bugs. The quality of AI output finally matches his standards. The decision audit trail means his team inherits context, not guesswork.

#### Priya -- The Experienced Vibecoder

**Context:** Priya has been building with AI for two years. She started with Bolt, moved to Cursor, and now runs three AI tools in parallel. She ships real products -- a SaaS dashboard for a client, a mobile app for her side project, an internal tool for a startup she advises. She is not a traditional developer by training, but she builds software daily and gets paid for it. She represents the fastest-growing segment: AI-native builders who learned to code through AI rather than through computer science.

**Problem experience:** Priya hits the same wall every time a project grows beyond a prototype. Her first version works. The second feature breaks the first. By the third week, she is spending more time fixing AI-generated spaghetti than building new features. She knows the problem is structural -- she has read enough Reddit threads about "vibe coding" backlash to recognise it -- but she does not know how to fix it. Architecture, test strategy, and dependency management are skills she never learned because AI tools let her skip them. Current tools make her fast at the wrong things: generating more code without a plan.

**Success vision:** Priya opens CodeMAD with a product idea and the protocol guides her through the parts she has been skipping: structured discovery, architecture planning, and test design. She still builds fast -- faster, because the AI researches patterns and plans before writing code. The difference is that her projects survive past week three. She ships software that scales, not prototypes that break. She does not need to learn computer science. She needs a tool that applies computer science on her behalf.

**What makes her stay:** Guided experience that never leaves her wondering what to do next. Visible progress through protocol phases. Projects that work in production, not just in demos. The protocol teaches her what good software looks like by building it with her.

#### Tomas -- The Growing Developer

**Context:** Tomas is two years into his career. He writes code daily with AI assistance and is part of the demographic most likely to adopt AI tools -- developers aged 18-34 are twice as likely to use AI coding assistants. He generates code quickly but struggles with architectural decisions, test strategy, and the gap between "code that runs" and "code that is production-ready." His team lead reviews his PRs and often sends them back for the same structural issues.

**Problem experience:** Tomas generates code quickly with AI tools but does not know what "good" looks like beyond passing tests. He misses edge cases not because he is careless but because he has not developed the instinct for where problems hide. The 45% of developers who cite "almost correct but wrong" as their most frequent AI issue -- that is Tomas, every day. When his code breaks in production, he learns from the incident but there is no proactive system teaching him to think about quality before shipping.

**Success vision:** CodeMAD's protocol teaches Tomas structured thinking by making him follow it. Each phase -- analysis, planning, solutioning, implementation -- builds the habits that experienced developers like Marco learned over years. His PRs improve because the protocol catches gaps before review. Over time, the guided experience develops his engineering judgement. His team lead notices the difference.

**What makes him stay:** The protocol makes him better, not just faster. Each guided phase builds real engineering skills. His code reviews improve. He feels like he is levelling up, not just generating more code.

### Secondary Users

**Team leads and engineering managers** gain consistency across the team. Every developer follows the same protocol, producing code with the same quality standards regardless of experience level. Review overhead drops because the protocol catches structural issues before code reaches a reviewer. The decision audit trail replaces tribal knowledge with documented rationale.

**Clients and stakeholders** see transparency. The protocol phases create natural milestones that replace opaque "percentage done" estimates. The audit trail shows exactly what was built, why, and what alternatives were considered.

### User Journey

**Discovery:** The user finds CodeMAD through a developer community recommendation (Reddit, X, Discord), a demo video showing the protocol in action, or a standalone brainstorming or code review tool (v1.2 trojan horse strategy). The discovery hook is the protocol -- "a tool that plans before it builds."

**Onboarding (first 30 minutes):** The user downloads the desktop app and configures at least one LLM provider (BYOK at launch, OAuth when available). The onboarding flow guides them to start their first project. Phase 1 (Analysis) begins immediately with guided brainstorming -- the user sees their vague idea transform into structured output within the first session.

Persona-specific hooks within the first session:
- **Marco** sees the research phase catch an outdated pattern his current tools would have missed.
- **Priya** feels guided -- she never wonders what to do next. The brainstorming session is her wow moment.
- **Tomas** feels the protocol is making him better, not slowing him down. It feels like mentorship.

**Core Usage:** The user runs projects through the four-phase protocol (Analysis → Planning → Solutioning → Implementation). Each phase produces validated artifacts. The protocol catches inconsistencies, outdated patterns, and missing requirements automatically. Users develop muscle memory for the phase flow and begin trusting the protocol over their own ad-hoc processes. Quick Flow (v0.1-beta) serves bug fixes and small changes without the full protocol.

**Success Moment:** The user's first project ships with measurably fewer post-completion defects than their unstructured baseline. The protocol caught issues that would have become bugs. The decision audit trail shows why every choice was made. The user tells someone else about it.

**Long-term:** Repeat usage across projects. Cross-session memory (LanceDB) makes each project smarter than the last -- lessons learned from previous projects inform future architecture and story decisions. Users who started with the full protocol begin using Quick Flow for small changes, demonstrating comfort with the tool. Power users adjust parallel agent counts, explore dynamic phase entry (v0.5), and contribute methodology feedback.

### Adoption Paths

**Vibecoder-to-quality path:** Priya discovers CodeMAD after her third project collapses at the scaling stage. The protocol gives her the structure she has been missing. She becomes a vocal advocate because CodeMAD solved a problem she could not solve by switching to yet another AI tool.

**Developer-to-orchestrator path:** Marco adopts CodeMAD for his own work, sees the quality improvement, and advocates for team adoption. The 2026 narrative is "coder to orchestrator" -- he shifts from writing code to directing agents through the protocol. His team lead approves it because the protocol enforces the engineering standards they have been trying to maintain through code review alone.

**Junior-to-senior path:** Tomas is introduced to CodeMAD by his team. The protocol becomes his training framework, building engineering discipline through guided practice rather than trial and error.

### Critical Onboarding Window

The first 30 minutes determine whether a user stays. Market research confirms the "week-one wall" -- most conversions happen within the first week, and users who do not convert in week one rarely return.

Each persona needs a different hook:

- **Marco** needs to see the research phase catch something his current tools would miss. One "I would have spent an hour debugging that" moment creates lasting trust.
- **Priya** needs to feel guided within the first interaction. If she has to figure out what to do next, she will leave for a simpler tool. The brainstorming phase -- watching her idea turn into a structured plan -- is her wow moment.
- **Tomas** needs to feel like the protocol is making him better, not slowing him down. The guided experience must feel like mentorship, not bureaucracy.

---

## Success Metrics

### North Star Metric

**Protocol-guided projects produce fewer post-completion defects than the user's baseline.** Every persona's pain -- Marco debugging AI output, Priya's projects collapsing at scale, Tomas's PRs getting sent back -- is a defect signal. If the protocol reduces the build-debug-rebuild loop, the product works.

**Research catch categorisation:**
- **Critical** -- would cause a bug in production (deprecated auth flow, breaking API change, security vulnerability)
- **Moderate** -- would cause tech debt (renamed package, suboptimal pattern, missing edge case)
- **Informational** -- nice-to-know (alternative library, style preference, minor optimisation)

Only critical + moderate count toward the "at least 3 per project" target. Informational catches are valuable but do not dilute the signal.

**Leading indicator: protocol completion rate.** The percentage of started projects that reach Phase 4 (Implementation). Target: above 50% in alpha, above 80% by beta. Measurable from day one on Costa's projects. If below 50% in alpha, the protocol is too heavy and needs simplification before beta.

**Anti-signals (protocol failure):**
- User abandons mid-Phase-2 (guidance failed them)
- User bypasses protocol phases (perceived as bureaucracy, not value)
- `research_catches (critical + moderate) = 0` across multiple projects (research phase not delivering)

### Tier 1: Protocol Effectiveness (Alpha -- Costa only)

Measurable from day one, per-project rather than per-cohort.

| Metric | What it measures |
|--------|-----------------|
| Research catches | Times the research phase found outdated patterns, deprecated APIs, or better alternatives before code was written |
| Phase gate changes | Decisions corrected at a phase gate vs what the AI initially proposed |
| Iteration count | Build-debug-rebuild cycles per feature, compared to unstructured baseline |
| Quality gate first-pass rate | Percentage of generated code that passes lint, type check, and tests on first attempt |

**Quality gate level targets:**

| Level | Target | What it measures |
|-------|--------|-----------------|
| File-level | 95%+ first-pass | Individual files pass lint + type check on first generation |
| Story-level | 80%+ first-pass | All story files pass lint + type + unit tests |
| Epic-level | 70%+ first-pass | All stories in epic pass integration + review |

Separate targets per level prevent false confidence from file-level passes.

**SWE-Bench validation (v0.2+):** Model + CodeMAD > model alone on SWE-Bench subset. Industry-standard benchmark proving the protocol improves code generation quality.

**Alpha gate signal:** Costa completes one real project through the full protocol (all four phases) and the output is meaningfully better than unstructured AI coding. The protocol catches at least 3 issues that would have become bugs, and final code passes all quality gates without manual intervention.

### Tier 2: User Retention (Beta -- 5-10 testers)

| Metric | Target |
|--------|--------|
| Second project rate | 80%+ of beta testers start a second project unprompted |
| Week-2 retention | 60%+ still using after 14 days |
| Organic referral | At least 1 referral per 3 beta users |
| Time-to-first-value | Under 30 minutes to "wow moment" |
| Protocol completion rate | 50%+ of started projects reach Phase 4 (Implementation) |

### Tier 3: Growth and Business (v0.3+ public)

| Metric | Target |
|--------|--------|
| Monthly active users | Track growth trajectory, not absolute numbers |
| Community contributions | Methodology feedback, shared workflows, GitHub engagement |
| Conversion readiness signals | Users express willingness to pay for specific features |

### Business Objectives

**Revenue model: OAuth as the entry point, BYOK as the power-user path. Free to use at launch.**

| Stage | Model | Success signal |
|-------|-------|----------------|
| Alpha (Costa) | OAuth with OpenAI (existing subscription) | Costa completes projects using his existing ChatGPT Plus account at zero incremental cost |
| Beta (5-10 testers) | OAuth for Anthropic + Google added | Beta testers authenticate with whatever provider subscription they already have |
| Post-beta | BYOK added for all providers | Power users and API-key holders get direct control. Alternative auth path, not the primary one |
| Paid tier (future) | Feature-gated subscription | Conversion data from beta/public phases determines what to gate |

**Zero-cost adoption through existing subscriptions is the primary growth mechanism.** Millions of developers already pay for ChatGPT Plus, Claude Pro, or Gemini Advanced. If CodeMAD lets them authenticate with what they already pay for, the adoption barrier drops to zero. No new payment, no API key confusion, no "how much will this cost me?" hesitation. Just: log in with your existing account and go.

**OAuth is the highest-priority business objective.** Every LLM provider that offers OAuth gets implemented immediately. OAuth leads. BYOK follows as a power-user alternative for developers who want direct API control.

**OpenAI OAuth strategy (first provider):** OpenCode (open-source AI coding tool) has already implemented OAuth with OpenAI's API. Study OpenCode's implementation as the reference for: token exchange mechanism, refresh token handling, scope requirements, and how ChatGPT Plus subscriptions map to API access. This is the fastest path to a working auth flow.

**Anthropic OAuth strategy:** Anthropic blocked PKCE in Jan 2026. If PKCE remains blocked, find alternative OAuth flows or workarounds to enable "log in with Claude" functionality. Do not accept the block as permanent. Explore: authorisation code flow with backend proxy, device code flow, or direct partnership outreach. The goal is zero-friction authentication regardless of provider restrictions.

**Provider OAuth priority:** Ship OAuth in this order, based on subscriber base size and implementation readiness:

| Priority | Provider | Rationale |
|----------|----------|-----------|
| 1 | OpenAI | Largest subscriber base (ChatGPT Plus). OpenCode reference implementation available. Costa's primary account. |
| 2 | Anthropic | Claude Pro subscribers. Research alternative flows due to PKCE block. |
| 3 | Google | Gemini Advanced subscribers. Standard OAuth2. |
| 4 | OpenRouter | Meta-provider (one key = dozens of models). Popular with vibecoders. Expands model access without per-provider integration. |
| 5 | BYOK (all providers) | Power users, API-key holders. Ships as alternative path after OAuth. |
| 6 | Zhipu, Moonshot | v0.3. Research auth flows, OAuth preferred, BYOK fallback. |

**Strategic rationale:** BYOK naturally limits the audience to users comfortable managing API keys and willing to pay per-token. OAuth expands the addressable market to every developer who already has a provider subscription. The conversion from "paste your API key" to "click to connect" is the single largest friction reduction available. Revenue is explicitly deferred until after validation -- the goal is volume and usage, not monetisation.

### Platform Reliability Targets

| Metric | Target | Why |
|--------|--------|-----|
| Cold start (first launch) | Under 6 seconds | Gatekeeper/SmartScreen verification and sidecar spawn |
| Cold start (subsequent) | Under 3 seconds | Users expect fast desktop apps |
| Time-to-first-token | Under 500ms from send to first visible character | Perceived responsiveness including double streaming |
| LanceDB query | Under 500ms for 10k+ vectors | Memory search must feel instant |
| Worktree merge success | 90%+ automatic | Failed merges break multi-agent value proposition |
| Memory ceiling | Under 800MB for 3 parallel agents | Desktop app must not consume excessive resources |

### Key Performance Indicators

| KPI | Stage | Measurement |
|-----|-------|-------------|
| Defect reduction ratio | Alpha onward | Post-merge bugs with protocol vs without (per-project comparison) |
| Protocol value moments | Alpha onward | Count of "the protocol caught X" events per project |
| Time-to-working-feature | Beta onward | Total time from requirement to passing all quality gates |
| OAuth setup completion rate | Alpha onward | Percentage of new users who successfully authenticate with at least one provider via OAuth |
| BYOK adoption rate | Post v0.1-rc | Percentage of users choosing BYOK over OAuth (power-user signal) |
| Token cost per project | Beta onward | Average API spend per completed project, by provider |

### Metrics Not Tracked

- **Downloads/GitHub stars** -- vanity signals that do not indicate value delivery
- **Revenue** -- premature until paid tier exists
- **NPS scores** -- unreliable at micro scale; behaviour over surveys
- **Time-to-first-code** -- the wrong race; CodeMAD wins time-to-working-feature

---

## MVP Scope

### Definition

**MVP = v0.2** -- the checkpoint where the CodeMAD Protocol scales to multi-agent parallel execution. The protocol runs end-to-end from v0.1-alpha (single-agent, sequential), with each subsequent checkpoint adding capability. All releases follow a continuous flow with numbered checkpoints. Each checkpoint is a stable, usable platform from the moment it ships. Features build on previous checkpoints.

### Release Flow

One continuous timeline. Each checkpoint is a usable platform. Features build on previous checkpoints.

| Version | Ships | Proves |
|---------|-------|--------|
| v0.1-alpha | Desktop shell (Tauri + Bun sidecar + Svelte 5). OpenAI OAuth (reference: OpenCode implementation). Single-agent 4-phase protocol (sequential). Basic quality gates (lint, type check, test). Code signing (macOS notarisation). Research catches display (critical/moderate/informational). Brownfield support (codebase scan, convention detection). Builder-validator loop. Permission modes (Guardian, Balanced, Autopilot). Empty state handling. | **Protocol works end-to-end.** Greenfield and brownfield both supported. App distributable on macOS. |
| v0.1-beta | + Anthropic OAuth + Google OAuth. Cross-session memory (LanceDB). Pre-flight checklist (visual readiness gate). Quick Flow (skip to spec + build for bug fixes). Auto-update mechanism. Crash reporting (opt-in for beta testers). | Multi-provider OAuth works. Beta testers authenticate with existing subscriptions at zero cost. Protocol has memory across sessions. |
| v0.1-rc | + OpenRouter (meta-provider, one key = dozens of models). + BYOK for all providers (power-user alternative). Manual model selection per chat. At least 3 concurrent conversations per project (configurable). Two-track protocol UI (protocol chat + free chat). | Power users and API-key holders can join. OpenRouter expands model access. Full UI experience. |
| v0.2 (MVP) | Multi-agent execution with git worktree isolation. Agent communication (Claude Code teams pattern). Context Intelligence full package (within-session Blackboard MCP, inter-agent task list + blackboard). Agent failure recovery / checkpointing (resume from crash, not restart). AI-Powered Merge (conflict resolution when integrating worktrees back to main). Language-aware quality gates. Provisional code quality score (0-100, beta label -- lint, type, test, Semgrep, integration rates, equal weights). Course correction flow (scope classification, sub-agent routing, before/after proposal, max 2 cycles). | **Protocol scales.** Parallel story execution proven. Measurable quality score. |
| v0.2.1 | + Local model support (Ollama as first-class option for full offline/privacy). Rate limiting / backpressure across providers. Token usage tracking per task. | True offline AI. Cost-conscious and privacy-first users can join. |
| v0.2.2 | + EU AI Act compliance (label AI-generated content, document human vs AI contributions per phase). Network resilience (preserve work-in-progress, queue unsent requests, resume on reconnect during cloud provider usage). Error UX for multi-agent failures. Credential rotation / expiry / 401 monitoring across providers. | Regulatory compliant. Resilient under network interruption. Production-grade error handling. |
| v0.3 | Zhipu + Moonshot + Qwen + Minimax providers. OAuth where supported, BYOK fallback. Kanban + live agent activity dashboard. | Provider ecosystem expanded. Agent work visible to user. |
| v0.4 | Automatic model router (optional for user -- manual remains default). CQRS for agent auditing (separate command/query paths for audit trails). Cost estimator at readiness gate. Multi-project / workspace support (per-project isolation of LanceDB indices, Blackboard state, agent contexts). | Intelligent model selection. Full audit trail. Multi-project ready. |
| v0.5 | Code quality score (0-100). Dynamic phase selector (enter protocol at any phase). TDD choice at appropriate point. | Measurable quality. Power users get flexibility. |
| v0.6 | Accessibility (a11y -- screen reader support, keyboard navigation, colour contrast, EU EAA compliance). GitHub/GitLab integration (import issues, investigate with AI, create merge requests). Multi-developer collaboration (if demand from beta testers). | Accessible. Connected to existing developer workflows. |
| v0.7 | Visual mind map brainstorming (interactive node graph during Analysis phase). Multi-track agent timeline (parallel agents visualised like DAW tracks). | Visual differentiator. The shareable screenshot. Agent work becomes cinematic. |
| v0.8 | Continuous micro-review (real-time code review during implementation, not just end-of-story). Unlimited parallel agents (scale by API budget, not arbitrary cap). Semantic cache (0.95+ for code generation queries, 0.85-0.90 for chat). | Performance at scale. Proactive quality. |
| v0.9 | Import from competitor tools (Kiro, Spec Kit, existing specs). i18n beyond English (string extraction, RTL-aware layout). Game save states (branch entire decision history, not just code). | Breadth. Lower switching costs. Global reach. |
| v1.0 | Polish. Viral demo. Protocol certification badge ("Built with CodeMAD Protocol"). Protocol versioning (backwards-compatible upgrades across releases). Public release. | People want this. |
| v1.1 | CodeMAD protocol phases exposed as MCP tools (other AI tools invoke the methodology). Extension API beyond MCP (custom phases, agent types, quality rules). | Ecosystem play. Distribution mechanism. |
| v1.2 | Standalone code review agent as GitHub Action. Standalone brainstorming phase as web demo. | Trojan horse distribution. Reach developers who don't use CodeMAD yet. |
| v1.3 | Background automation (agents work on schedules without human triggers). Teaching framework for bootcamps and CS courses. | Platform extends beyond interactive use. |
| v1.4 | Build CodeMAD with CodeMAD (full dogfood at scale). | Self-hosting proof. Ultimate validation. |
| v2.0 | Decision branching (explore alternative architectures in parallel). Community-driven feature development based on v1.x feedback. | Next generation. Platform maturity. |

### v0.1-alpha Must-Haves (Priority Order)

If alpha runs long, ship items 1-7 and defer 8-10 to beta. Items 1-7 validate the thesis on both greenfield and brownfield projects.

| Priority | Feature | Why non-deferrable |
|----------|---------|-------------------|
| 1 | Desktop shell (Tauri + Bun + Svelte) | Nothing works without this |
| 2 | OpenAI OAuth | Zero-cost adoption thesis. BYOK contradicts the strategy |
| 3 | Four-phase protocol, single agent | This IS the product |
| 4 | Quality gates (lint + type check) | Without metrics, validation is subjective |
| 5 | Research catches display | Marco's "aha moment" depends on seeing what the protocol caught |
| 6 | Code signing (macOS) | Gatekeeper blocks unsigned apps. Distribution requires this |
| 7 | Brownfield support | Most real developer work is brownfield |
| 8 | Builder-validator loop | Deferrable -- Costa can fix manually at alpha |
| 9 | Permission modes | Deferrable -- can ship Balanced-only if needed |
| 10 | Empty state handling | Deferrable -- Costa knows how to start a project |

**Decision audit trail deferred to beta.** Costa can validate the protocol without formal audit logging. Trail matters when testers need to trace decisions.

### Core Features (v0.2 MVP)

**1. Four-Phase Protocol Pipeline**
The complete CodeMAD Protocol: Analysis, Planning, Solutioning, Implementation. This is the product. Every other feature serves the protocol.

**2. Two-Track Protocol**
Full Protocol (4 phases) for new projects and major features, accessed through a protocol chat with tab navigation between phases. Quick Flow (skip to spec + build) for bug fixes and small changes, accessed through a separate free chat. Both live in the same application -- one interface, two modes of work.

**3. Multi-Agent Execution with Git Worktree Isolation**
Multiple Story Developer agents build in parallel (up to 3 by default, configurable), each implementing one story end-to-end in an isolated git worktree. Builder-validator pattern ensures code passes quality gates before the user sees it. Agent communication follows the Claude Code teams pattern: task list coordination, direct messaging, and broadcast.

**4. Context Intelligence (Full Package)**
Three-layer memory architecture:
- **Cross-session:** LanceDB custom storage for decisions, patterns, and project context.
- **Within-session:** Blackboard MCP server for shared agent state.
- **Inter-agent:** Task list + blackboard events for agent coordination.

Unified semantic search across code and memory. AST-aware vector search.

**5. Manual Model Selection**
Users choose which model to use per chat and per worktree. Different agents can run different models. Automatic routing added in v0.3 as an optional feature -- manual selection always remains available.

**6. Pre-Flight Checklist**
Visual readiness gate (green/yellow/red) before each phase transition. Makes "readiness" tangible. Users can edit specific items within the checklist without resetting the current phase or losing work -- the checklist is interactive, not just a status display.

**7. Authentication: OAuth-First + BYOK**
Universal auth adapter per provider. OAuth is the primary auth method. BYOK ships later as a power-user alternative.

| Priority | Provider | Auth Method | Target |
|----------|----------|-------------|--------|
| 1 | OpenAI | OAuth (reference: OpenCode implementation) | v0.1-alpha. Costa's primary account. Largest ChatGPT Plus subscriber base. |
| 2 | Anthropic | OAuth (authorisation code flow via Bun sidecar -- confidential client. Do not accept PKCE block as permanent.) | v0.1-beta. Claude Pro subscribers. |
| 3 | Google | OAuth (standard OAuth2) | v0.1-beta. Gemini Advanced subscribers. |
| 4 | OpenRouter | BYOK (API key) | v0.1-rc. Meta-provider: one key = dozens of models (Claude, GPT-4, Llama, Mistral, etc.). Popular with vibecoders. |
| 5 | All providers | BYOK (Bring Your Own Key) | v0.1-rc. Power-user alternative for direct API control. |
| 6 | Zhipu, Moonshot | OAuth preferred, BYOK fallback | v0.3. Research auth flows. |
| 7 | Qwen, Minimax | OAuth preferred, BYOK fallback | v0.3 or shortly after MVP if development pace allows. |

**Design principle:** Users with existing provider subscriptions (ChatGPT Plus, Claude Pro, Gemini Advanced) should be able to use CodeMAD at zero incremental cost from day one. OAuth is the zero-friction entry point. BYOK serves power users who want direct API control and cost management.

**8. Language-Aware Quality Gates**
Quality gates adapt to the project's language and build system.

| Language | Lint | Type check | Build | Test | Review |
|----------|------|-----------|-------|------|--------|
| TypeScript | Biome | tsc --noEmit | Turborepo | Vitest | Agent/human |
| Rust | clippy | cargo check | cargo build | cargo test | Agent/human |
| Python | Ruff | pyright/mypy | N/A | pytest | Agent/human |
| Mixed | Per-language gates run in parallel | | | | |

Gate configuration is project-scoped. New languages added by defining their gate commands.

**9. Desktop Shell**
Tauri (Rust thin shell) + Bun sidecar + Svelte 5 WebView. Cross-platform. Local-first. Direct API calls. No proxy servers.

**10. Permission Modes**
Three trust levels for agent operations. Users with different risk tolerance need different defaults.

| Mode | Behaviour | Default for |
|------|----------|-------------|
| Guardian | Explicit approval for all file writes and shell commands | New users, high-value codebases |
| Balanced | Auto-approve within worktree scope, confirm outside | Most users (default) |
| Autopilot | Auto-approve all non-destructive actions | Experienced users who trust the protocol |

**11. Course Correction**
When implementation reveals plan gaps, the protocol routes fixes by scope rather than failing silently. Without structured correction, users abandon the protocol or get wrong code.

- **Minor** (story-level tweaks) -- scrum master sub-agent handles
- **Moderate** (epic/story restructuring, PRD gaps) -- product manager sub-agent with automatic readiness re-check
- **Major** (architecture flaws) -- architect sub-agent first, then product manager, with readiness re-check

Maximum 2 correction cycles before escalating to the user. Story Developers never edit planning artefacts directly. User sees a before/after comparison and must approve the correction.

**12. Token Cost Display**
Running token count and estimated cost visible during active protocol execution. Users spend real money per API call. A full four-phase run with multi-agent execution consumes significant tokens. Surprise costs destroy trust. Minimum: "this session has used ~X tokens (~$Y)" indicator during active work. Per-task/per-agent/per-phase breakdown at v0.2.1.

### Out of Scope for MVP

Intentionally deferred to keep v0.2 focused on proving the protocol thesis:

- **Additional providers beyond the first three + OpenRouter.** Zhipu, Moonshot, Qwen, and Minimax ship in v0.3. MVP ships with OpenAI, Anthropic, and Google (OAuth), OpenRouter, plus BYOK for all providers.
- **Automatic model router.** Manual model selection is sufficient for MVP. Auto-routing (v0.4) requires usage pattern data.
- **Kanban and agent activity dashboard.** Agent work is visible in the Phase 4 chat. A visual sprint board ships in v0.3.
- **Dynamic phase selector.** MVP requires sequential Phase 1-4. Entering at a later phase (v0.5) is a power-user feature.
- **Calibrated code quality score.** A provisional 0-100 score ships at v0.2 (beta label, equal weights). Data-tuned calibration with historical comparison ships at v0.5.
- **GitHub/GitLab integration.** MVP operates standalone. Source control integration (v0.6) ships after the core protocol is proven.
- **Visual brainstorming and agent timeline.** Text-based interactions prove the methodology. Visual differentiators ship in v0.7.
- **Continuous micro-review and semantic cache.** End-of-story review and un-cached requests are sufficient for MVP. Optimisations ship in v0.8.
- **Multi-developer collaboration.** Solo developer tool first. Collaboration (v0.6) requires a proven single-user experience.
- **i18n and competitor imports.** English-only, no imports. Breadth features ship in v0.9.
- **MCP server exposure.** Build the product first (v0.2), then expose it as a platform (v1.1).

The full release flow (v0.1-alpha through v2.0) details each deferred feature with its target version.

### MVP Success Criteria

1. **Protocol proves its thesis.** Costa completes one real project through all four phases. Output is meaningfully better than unstructured AI coding. Protocol catches at least 3 issues that would have become bugs.
2. **Beta testers return.** 80%+ of 5-10 beta testers start a second project unprompted.
3. **First-value under 30 minutes.** New users reach their "wow moment" within the first session.
4. **Quality gates pass.** Generated code passes language-appropriate gates on first attempt at a measurably higher rate than unstructured generation.
5. **OAuth works for OpenAI.** Primary auth friction eliminated. Costa can use his existing ChatGPT Plus subscription at zero incremental cost.

### Brownfield Protocol Support

The protocol supports both greenfield (new project from scratch) and brownfield (changes to an existing codebase). Most real developer work is brownfield. A greenfield-only protocol would be artificially limited.

**How the four phases adapt:**

| Phase | Greenfield | Brownfield |
|-------|-----------|------------|
| Phase 1 (Analysis) | Brainstorm from scratch | **Scan existing codebase first** (tech stack, architecture, APIs, patterns, conventions). Then brainstorm changes within existing constraints |
| Phase 2 (Planning) | Create PRD for new product | Create PRD for changes, referencing existing capabilities. Specify what changes, what is new, what is preserved |
| Phase 3 (Solutioning) | Architecture from scratch | **Extend existing architecture.** Respect existing patterns. Describe modifications, not a rebuild |
| Phase 4 (Implementation) | Build everything new | Modify existing code. Follow the project's naming, structure, and pattern conventions |

**Codebase scan levels:**

| Level | What | When |
|-------|------|------|
| Quick | Configs, manifests, directory structure. No source reading | Small changes, familiar codebase |
| Deep | Critical directories per project type | Feature additions, moderate changes |
| Exhaustive | All source files (excluding node_modules, dist, build) | Major refactors, unfamiliar codebase |

**Convention enforcement:** AI agents generating brownfield code must match existing naming conventions, project structure, testing patterns, error handling, and documentation style. Detected conventions populate the architecture document's "Implementation Patterns and Consistency Rules" section.

**Quick Flow is inherently brownfield.** Small changes to existing projects are the primary Quick Flow use case. Quick Flow skips the full scan but still respects detected conventions.

### Desktop Platform Decisions

**Platform order:**

| Platform | Target | Why this order |
|----------|--------|---------------|
| macOS | v0.1-alpha | Costa's platform. Ship where you can test. Code signing $99/year |
| Windows | v0.1-rc | Separate EV cert ($200-500/year). Ships with wider audience readiness |
| Linux | v0.2.1 | Ships alongside Ollama as "privacy-first" release. AppImage packaging |

**Update strategy:**

| Channel | Audience | Behaviour |
|---------|----------|-----------|
| Beta | Invited testers (v0.1-beta+) | Persistent "update available" banner. Not forced |
| Stable | All users (v0.1-rc+) | Release-gated. Persistent banner. Not forced |
| Security-critical | All users | **Blocking modal: "Update now or quit."** User cannot continue with a credential vulnerability. Standard for apps handling secrets (1Password, Bitwarden) |

**Offline capabilities:**

| Feature | Offline? | Why |
|---------|----------|-----|
| Browse projects, view history, view metrics | Yes | All data is local |
| Memory search (cross-session) | Yes | LanceDB is embedded |
| Start/resume a project | Partial | Works until first LLM call, then pauses |
| LLM features (brainstorm, research, code gen) | No (cloud) / Yes (Ollama v0.2.1+) | Requires provider or local model |
| File editing and git operations | Yes | Git CLI and filesystem are local |
| Semgrep scanning | Partial | Bundled rules offline. Updates need internet |

When offline, a subtle indicator appears in the status bar. LLM-dependent actions show "Requires connection" instead of failing silently.

### UX-Critical Domain Decisions

Decisions from the PRD domain analysis that directly shape the user interface.

**Agent trust boundaries (4 tiers):**

| Tier | Access | Why |
|------|--------|-----|
| Orchestrator | Read/write protocol state. Read all worktrees. **Cannot generate code** | Coordination only |
| Phase agents | Read across worktrees. Write within phase scope. **Cannot edit other phases' artefacts** | Phase isolation |
| Researcher agents | **Read-only.** No writes, no shell | Research has no side effects |
| Story Developers | **Confined to assigned worktree.** Cannot modify planning artefacts | Devs don't edit the PRD |
| Validation/review | **Read-only** source. Can write review comments | Reviewers observe, not modify |

**EU AI Act provenance labelling (deadline: Aug 2, 2026):**
- Every code file carries a provenance marker (agent ID, timestamp, phase)
- Every planning section records origin: AI-generated, human-authored, or human-edited-from-AI-draft
- Phase gates record the human approver and what was approved
- Architecture accommodates labelling from v0.1-alpha. Full compliance at v0.2.2. Retrofitting is expensive
- **Exportable authorship report** per project: tamper-evident (append-only with checksums)

**OAuth failure fallback:**
When browser redirect fails (Firefox strict privacy, corporate firewalls), CodeMAD detects the missing callback within 5 seconds and shows a manual code entry screen. Total auth: under 30 seconds.

**Error UX principle:**
Every state has a visible next-action prompt. Every error includes: what failed, whether work is safe, and at least one next step. The app never fails silently.

**Token cost transparency:**
Users must never be surprised by API costs. Running count and estimated cost during active execution. Per-task breakdown at v0.2.1.

### Future Vision

The full release flow (v0.1-alpha through v1.3+) describes the concrete plan. The strategic direction behind it follows three axes:

**Depth (v0.4-v1.0):** Power user features, measurable quality, protocol maturity. The protocol becomes more sophisticated with each release -- from basic phase gates to continuous micro-review, decision branching, and backwards-compatible versioning.

**Breadth (v0.3-v0.5):** Multi-provider ecosystem, visual brainstorming, competitor imports, collaboration, i18n. CodeMAD reaches more users in more contexts.

**Ecosystem (v1.1+):** Protocol phases exposed as MCP tools. Standalone agents. Teaching framework. CodeMAD becomes the standard methodology layer beneath any AI coding tool. Other tools invoke the protocol. The protocol IS the product. Everything else is infrastructure.
