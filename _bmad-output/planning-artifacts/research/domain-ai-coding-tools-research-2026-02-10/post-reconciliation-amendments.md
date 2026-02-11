# Post-Reconciliation Amendments

**Date:** February 10, 2026

Following completion of the domain research, Costa reconciled conflicts and ambiguities across the research corpus. The following decisions and architecture requirements were flagged for implementation in the architecture planning phase.

## Reconciliation Decisions

**R1 - Target Audience (Resolved)**

Original research referenced "coder to orchestrator" narrative and discussed entry-level impact without clearly defining CodeMAD's target audience.

**Resolution:** Target audience is experienced vibecoders and developers with any experience level. The protocol serves dual purposes:
- Experienced developers gain a structured methodology for AI-orchestrated coding
- Less experienced developers learn orchestration through the four-phase framework

The "coder to orchestrator" narrative validates this positioning -- the protocol helps every developer (regardless of experience) transition to AI-orchestrated coding.

**Research Impact:** Inline notes added at lines 178-180 (vibe coding trend) and 589-592 (developer role transformation).

**R3 - Token Budgets (Resolved)**

Original research cited "three-tier token budget (Orchestrator 120K, Phase 50K, Worker 10K)" from canonical documentation but did not address a discrepancy noted elsewhere (40k/80k values).

**Resolution:** Four-tier soft targets with flexible boundaries:
- Orchestrator: 120-150k tokens
- Phase agents: 100k tokens
- Specialist agents: 100k tokens
- Researcher agents: 150k tokens

MCP lazy loading (ToolSearch-style) is the primary control mechanism rather than hard token limits. Agents load only the tools they need when they need them, keeping context windows lean.

**Research Impact:** Inline note added at line 567-570 (context window section).

## Critical Architecture Requirements

Four areas flagged during reconciliation as critical architecture requirements. These MUST be addressed in the architecture document:

**1. EU AI Act Transparency Obligations (Aug 2, 2026 deadline)**

Location in research: Section "Regulatory Requirements > Implementation Considerations" (lines 491-493)

**Requirement:** CodeMAD must disclose AI interactions and label AI-generated content to comply with EU AI Act transparency obligations (enforceable Aug 2, 2026).

**Architecture Impact:**
- UI must include clear disclosure that content is AI-generated
- Protocol execution must document what AI generated vs what user decided at each phase gate
- Audit trail system needed for phase transitions and decision points

**2. AI Code Copyright Protection**

Location in research: Section "Regulatory Requirements > Compliance Frameworks" (lines 426-439) and "Implementation Considerations" (lines 494-496)

**Requirement:** CodeMAD's four-phase protocol with human decision gates creates stronger "substantial human participation" argument than competitors, addressing copyright uncertainty for AI-generated code.

**Architecture Impact:**
- Document and preserve evidence of human contributions at each phase gate
- Maintain audit trail of architectural decisions, test design choices, and review approvals
- Enable users to export decision history as copyright defence documentation
- Product messaging should emphasise this as a legal advantage over "vibe coding" tools

**3. MCP Server Strategy**

Location in research: Section "Technical Trends > Emerging Technologies" (lines 518-529), "Strategic Roadmap" (line 760), and "Immediate Actions" (line 871)

**Requirement:** CodeMAD should expose its protocol phases as an MCP server, not just consume external MCP tools as a client.

**Architecture Impact:**
- Design MCP server interface that exposes four protocol phases as callable tools
- Other AI coding tools should be able to invoke CodeMAD's brainstorming, planning, test design, and implementation phases
- Enables ecosystem integration and positions CodeMAD as infrastructure, not just an application
- MCP server mode should be v0.4 priority (research roadmap validation)

**4. GDPR/Privacy Compliance Architecture**

Location in research: Section "Regulatory Requirements > Data Protection and Privacy" (lines 442-462)

**Requirement:** Desktop-first, local storage, zero proxy architecture is inherently GDPR-compliant and a competitive advantage.

**Architecture Impact:**
- Preserve the "zero proxy" design -- all API calls go directly from user machine to chosen LLM provider
- Never route code through CodeMAD-controlled servers
- If telemetry is added, implement opt-in consent with granular controls
- Document this privacy advantage in architecture as a regulatory moat

## Identified Gaps

Following the brainstorming-vs-research reconciliation analysis, eight implementation gaps were identified that did not appear in the canonical research documents. These gaps are organised by priority tier based on when they should be addressed during development.

**v0.1 MUST Credential rotation / 401 monitoring**

Storage is covered (keychain), but rotation, expiry detection, and automated 401/403 monitoring across 5 providers is not designed. Five providers (Anthropic, Google, OpenAI, Zhipu, Moonshot) each have different auth patterns and error responses. Must design a unified credential lifecycle management system that handles automatic rotation reminders, detects auth failures across different provider response formats, and prompts users to refresh tokens before they expire. Source: Tech researcher report.

**v0.2 SHOULD Local model support (Ollama)**

42% of developers run local models. Ollama is the industry standard. MoE models like Qwen3-30B-A3B run with only 3B active params per token, enabling zero-cost operation. The automatic model router must include local models as first-class options. This gives CodeMAD a "zero API cost" mode that subscription competitors cannot match. Vercel AI SDK supports Ollama via OpenAI-compatible provider. Source: Domain researcher report, lines 609-624.

**v0.2 SHOULD OWASP Top 10 compliance**

"Effectively required" for the Hono + tRPC API server. The API surface must follow OWASP guidelines from v0.2 onwards. Includes input validation, authentication, secure configuration, cryptographic storage, logging, and security monitoring. This is industry best practice for web application security. Source: Domain researcher report, line 416.

**v0.2 SHOULD SLSA supply chain integrity**

"Increasingly expected" for open source projects. Should be considered for the build pipeline. SLSA provides a framework for software supply chain security, covering source integrity, build integrity, dependency verification, and provenance. Level 1-2 compliance achievable with GitHub Actions. Source: Domain researcher report, line 421.

**v0.2 SHOULD Code signing logistics**

macOS requires code signing + notarisation ($99/year). Windows needs EV cert (~$200-500/year). Cert validity max 459 days from Feb 23, 2026. ~$300/year budget needed. Hard blocker for public distribution. Must be in place before v0.3 public launch. Tauri supports this natively. Budget and process must be planned now. Source: Domain researcher report, lines 480-488.

**v0.3+ TRACK Background automation**

OpenAI Codex introduced agents working on schedules without human triggers. All brainstorming ideas assume human-initiated workflows. The Quick Flow track could be extended to trigger on events (CI failure, new issue, dependency update). Not MVP, but a logical post-v1.0 extension. Would require designing event subscription system, autonomous agent scheduling, and safety boundaries for unsupervised work. Source: Domain researcher report, lines 626-632.

**v0.3+ TRACK Data flywheel disadvantage**

Privacy-first means no telemetry. Tools with more users generate more training data, improving model quality. CodeMAD's counter: "protocol quality comes from methodology, not data." Community feedback loops may partially substitute. Long-term competitive risk against data-rich incumbents like GitHub Copilot. Not actionable short-term, but relevant to understand as a strategic constraint. Source: Domain researcher report, line 346.

**v0.3+ TRACK Semantic cache thresholds**

Use 0.95+ similarity for code generation queries (high precision needed), 0.85-0.90 for chat queries (broader recall acceptable). Semantic caching reduces API costs and latency by identifying when a query is similar enough to a previous query to reuse the cached response. Not formally documented in any research document but identified during reconciliation. Must be implemented when CodeMAD adds response caching. Source: MEMORY.md architecture planning notes.

### Second Reconciliation Sweep (Feb 10, 2026)

**v0.2 SHOULD Accessibility (a11y) compliance**

EU accessibility requirements may apply alongside the AI Act. Desktop app in WebView needs screen reader support, keyboard navigation, colour contrast. Regulatory risk if ignored. Source: Second reconciliation sweep.

**v0.3+ TRACK Internationalisation (i18n)**

5 MVP providers include 2 Chinese (Zhipu, Moonshot). UI is English-only for v0.1 target audience (experienced vibecoders). Confirm this is sufficient or plan i18n for later. Source: Second reconciliation sweep.

**v0.2 SHOULD Crash reporting opt-in for staged stealth**

Privacy-first stance conflicts with needing diagnostic data from 5-10 beta testers. Must be explicit user opt-in with clear data scope. Architecture must support both modes. Source: Second reconciliation sweep.

## Summary of Changes

| Item | Type | Status |
|------|------|--------|
| R1 - Target Audience | Reconciliation Decision | Resolved |
| R3 - Token Budgets | Reconciliation Decision | Resolved |
| EU AI Act Transparency | Architecture Requirement | Flagged |
| AI Copyright Protection | Architecture Requirement | Flagged |
| MCP Server Strategy | Architecture Requirement | Flagged |
| GDPR/Privacy Architecture | Architecture Requirement | Flagged |
| Credential rotation / 401 monitoring | Identified Gap | v0.1 MUST |
| Local model support (Ollama) | Identified Gap | v0.2 SHOULD |
| OWASP Top 10 compliance | Identified Gap | v0.2 SHOULD |
| SLSA supply chain integrity | Identified Gap | v0.2 SHOULD |
| Code signing logistics | Identified Gap | v0.2 SHOULD |
| Background automation | Identified Gap | v0.3+ TRACK |
| Data flywheel disadvantage | Identified Gap | v0.3+ TRACK |
| Semantic cache thresholds | Identified Gap | v0.3+ TRACK |
| Accessibility (a11y) compliance | Identified Gap | v0.2 SHOULD |
| Internationalisation (i18n) | Identified Gap | v0.3+ TRACK |
| Crash reporting opt-in | Identified Gap | v0.2 SHOULD |

All reconciliation decisions are now reflected in the research document with inline notes at relevant sections. All architecture requirements and identified gaps are documented here and must be addressed in the next planning phase.

---
