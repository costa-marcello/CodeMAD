# Post-Reconciliation Amendments

**Amendment Date:** 2026-02-10 (same day as original research completion)

After comparing the brainstorming session outputs against all three research documents (technical, market, domain), the following discrepancies were identified and resolved:

## 1. Token Budget Discrepancy (RESOLVED)

**Issue:** Two conflicting token budget specifications were found in this document:
- Context Management Strategy section (line ~970): Orchestrator 40k, Phase Agent 80k, Specialist Agent 20k, Research Agent 60k
- Within-Session Memory section (line ~1972): Orchestrator 120k, Phase Agent 50k, Worker Agent 10k

**Resolution:** Both sections updated to the locked decision from brainstorming reconciliation:
- Orchestrator: 120-150k (soft target)
- Phase Agent: 100k (soft target)
- Specialist Agent: 100k (soft target)
- Research Agent: 150k (soft target)

All targets are soft ceilings, not hard limits. MCP lazy loading with a ToolSearch-style mechanism is the primary lever for keeping actual usage below targets.

## 2. Agent Hierarchy Tier Count (RESOLVED)

**Issue:** Document consistently referred to a "three-tier" agent hierarchy (Orchestrator → Phase → Specialist) but the brainstorming session and BMAD framework clearly define four tiers with Research Agents as a distinct fourth tier.

**Resolution:** Updated all references from "three-tier" to "four-tier" hierarchy:
- Orchestrator (Tier 1): Task creation, assignment, synthesis
- Phase Agent (Tier 2): Owns workflow phases (Analysis, Design, Build, QA)
- Specialist Agent (Tier 3): Single-purpose tasks (<30s)
- Research Agent (Tier 4): Deep investigation, web search, multi-source analysis

## 3. Cross-Document Alignment

These amendments bring the technical research document into full alignment with:
- `_bmad-output/brainstorming/brainstorming-session-2026-02-10.md` (source of truth for locked decisions)
- `_bmad-output/planning-artifacts/research/market-ai-coding-tools-research-2026-02-10.md`
- `_bmad-output/planning-artifacts/research/domain-ai-coding-tools-research-2026-02-10.md`

**No other technical decisions were changed.** The 12 locked decisions remain as stated in the Research Conclusion section. These amendments only correct internal inconsistencies within this document.

## 4. Identified Gaps

The brainstorming-vs-research reconciliation analysis identified 10 gaps that are not fully addressed in the research documentation. These are categorised by priority and tracked for future architecture and design work.

**v0.1 MUST Credential rotation / 401 monitoring**
Storage is covered (keychain via tauri-plugin-keyring), but rotation, expiry detection, and automated 401/403 monitoring across 5 providers is not designed. Five providers means five different expiry models. Architecture must address this. Source: Technical research (covered storage only) and brainstorming reconciliation analysis.

**v0.1 MUST UX skill-level adaptation mechanism**
Both brainstorming (Attack Vector 5, highest-risk) and research identify `user_skill_level` as critical. Neither document designs the actual mechanism for how protocol verbosity and AI autonomy adapt to skill level. This is core to the R1 target audience decision (experienced vibecoders + any-experience developers). Source: Brainstorming session and technical research reconciliation.

**v0.1 MUST Pre-flight checklist visual UX**
Brainstorming MVP Must-Have #5: visual readiness gate (green/yellow/red) before Phase 4 execution. Research mentions BMAD implementation readiness checks but the visual UX is not designed. Zero design work exists. Source: Brainstorming session (MVP Must-Have feature).

**v0.1 MUST Handoff message pairing**
LLMs need tool call + response pairs during agent handoffs or they hallucinate. Research mentions Narrative Casting (line ~1976) but this pattern needs to be formalised as an architecture requirement. Source: Technical research (mentioned but not formalised) and reconciliation analysis.

**v0.1 MUST Cost estimator at readiness gate**
Brainstorming proposed estimating API cost before Phase 4. Research validates the concept (Cost Display for Users section) but does not design the readiness gate integration. Source: Brainstorming session and technical research reconciliation.

**v0.2 SHOULD CQRS for agent auditing**
Complements the blackboard pattern for "continuous micro-review." Separating command and query paths enables audit trails of every agent action without impacting performance. Source: Reconciliation analysis (architectural pattern suggestion).

**v0.3+ TRACK Code quality score (0-100)**
Brainstorming MVP feature: measurable "no spaghetti" promise. Research mentions Semgrep for security scanning but does not design a quality scoring algorithm. No competitor does this (market research confirmed). Needs real usage data to calibrate. Source: Brainstorming session (MVP feature) and market research.

**v0.3+ TRACK Game save states / decision branching**
Brainstorming "Future Play" feature: branch entire decision history, not just code. Not addressed in research. Post-MVP. Source: Brainstorming session (Future Play feature).

**v0.3+ TRACK Visual mind map brainstorming**
Brainstorming "Should-Have for v1.0": interactive node graph alongside text during Phase 1. Research mentions svelte-flow as available library but does not design the feature. Source: Brainstorming session (Should-Have v1.0 feature) and technical research.

**v0.3+ TRACK Kanban + live agent activity dashboard**
Brainstorming feature: mission control dashboard. Research covers backend SSE event types for multi-agent progress display and notes Kanri (Tauri kanban app) as proof of viability. Frontend UX design is missing. Source: Brainstorming session (feature request) and technical research (backend coverage only).

### Second Reconciliation Sweep (Feb 10, 2026)

A second pass identified 11 additional gaps focused on failure handling, resilience, desktop app concerns, and extensibility. These were not covered in either the brainstorming session or the first reconciliation round.

**v0.1 MUST Agent failure recovery / checkpointing**
What happens when an agent crashes mid-phase? Multi-agent workflows need resume-from-checkpoint capability. Neither brainstorming nor research designs this. Users who lose 30 minutes of agent work to a crash will not trust the platform. Source: Second reconciliation sweep (Feb 10, 2026).

**v0.1 MUST Rate limiting / backpressure across 5 providers**
Each provider (Anthropic, Google, OpenAI, Zhipu, Moonshot) has different rate limits, retry policies, and throttling behaviour. Multi-agent parallel execution will hit these fast. Need provider-specific backpressure handling to prevent cascading failures when one provider throttles. Source: Second reconciliation sweep (Feb 10, 2026).

**v0.1 MUST Token usage tracking per task**
BYOK model means users pay providers directly. They need per-task visibility: "this task used X tokens costing ~$Y." Must attribute costs across parallel agents running simultaneously. Without this, users cannot manage their spend. Source: Second reconciliation sweep (Feb 10, 2026).

**v0.1 MUST Error UX for multi-agent failures**
When 3 agents run in parallel and one fails: does the whole phase fail? Do others continue? What does the user see? Multi-agent error state machine design is needed. The current architecture describes the happy path but not failure modes. Source: Second reconciliation sweep (Feb 10, 2026).

**v0.1 MUST Offline / degraded mode**
Desktop app. User's wifi drops mid-Phase 4. What happens to in-flight agent requests, unsaved work, protocol state? Need graceful degradation that preserves work-in-progress and resumes cleanly when connectivity returns. Source: Second reconciliation sweep (Feb 10, 2026).

**v0.2 SHOULD Auto-update mechanism**
Tauri has a built-in updater but the update strategy (silent, prompted, forced for security patches) is not designed. Staged stealth release means frequent updates to a small group. Need to define update UX and rollback capability. Source: Second reconciliation sweep (Feb 10, 2026).

**v0.2 SHOULD Crash reporting during staged stealth**
Privacy-first stance + no telemetry = zero diagnostic data. Need explicit opt-in crash reporting for 5-10 beta testers without compromising the privacy-first architecture. Without diagnostics, debugging remote failures during beta is guesswork. Source: Second reconciliation sweep (Feb 10, 2026).

**v0.2 SHOULD Multi-project / workspace support**
Can a developer use CodeMAD on two projects at once? LanceDB indices, Blackboard MCP state, and agent state all need per-project isolation. Without this, opening a second project could corrupt the first project's state. Source: Second reconciliation sweep (Feb 10, 2026).

**v0.2 SHOULD Accessibility (a11y)**
Svelte 5 in a WebView. Screen reader support, keyboard navigation, colour contrast, focus management. No mention in any planning document. EU accessibility requirements (European Accessibility Act, effective June 2025) may apply to commercial software. Source: Second reconciliation sweep (Feb 10, 2026).

**v0.3+ TRACK Protocol versioning**
As the protocol evolves across releases, how do older projects maintain compatibility? A v0.1 project opened in v0.3 -- does the protocol state migrate? Need a versioning and migration strategy for protocol state to prevent data loss on upgrades. Source: Second reconciliation sweep (Feb 10, 2026).

**v0.3+ TRACK Extension API beyond MCP**
MCP server exposes protocol phases. But can users create custom phases, custom agent types, custom quality rules? Community extensibility beyond MCP is the long-term growth vector. Needs design for plugin boundaries and sandboxing. Source: Second reconciliation sweep (Feb 10, 2026).

---

**Amendment Completion:** 2026-02-10
**Amended By:** Post-research reconciliation process (two sweeps)
