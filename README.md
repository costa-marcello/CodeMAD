<p align="center">
  <img src="assets/banner.png" alt="CodeMAD Banner" width="800" />
</p>

<h1 align="center">CodeMAD</h1>

<p align="center">
  <strong>The AI coding platform where methodology beats speed.</strong><br />
  A structured 4-phase protocol that turns ideas into working software — without the spaghetti.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-blue.svg" alt="License: AGPL-3.0" /></a>
  <img src="https://img.shields.io/badge/status-planning-orange" alt="Status: Planning" />
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey" alt="Platform" />
</p>

---

## The Problem

AI coding tools are everywhere. They generate code fast. And the results are getting worse.

- **1.7x more issues** in AI-generated code compared to human-written code
- **2.74x more security vulnerabilities** introduced by AI assistants
- **PR sizes up 150%** with a 9% rise in bugs
- Developer trust in AI tools **dropped from 43% to 33%** in one year
- Experienced developers were **19% slower** when using AI tools in controlled trials

The industry generates code faster but ships products slower. Every tool accelerates the same thing: raw code output. None of them ask the question that matters: **is this the right code to write?**

## The Solution

CodeMAD takes a different approach. Instead of typing faster, it thinks first.

A 4-phase protocol guides every task from idea to working code. Multi-agent orchestration runs the phases in parallel while you stay in control. Each phase has a human decision gate. You approve before the next phase begins.

> **The protocol IS the product. Everything else is infrastructure to deliver it.**

```mermaid
flowchart LR
    A["Analysis\n─────────\nResearch\nScope\nContext"] -->|"Human\nApproval"| B["Planning\n─────────\nArchitecture\nDesign\nCost Estimate"]
    B -->|"Human\nApproval"| C["Test Design\n─────────\nTest Specs\nAcceptance\nCriteria"]
    C -->|"Human\nApproval"| D["Implementation\n─────────\nCode + QA\nReview\nMerge"]

    style A fill:#4A90D9,stroke:#2C5F8A,color:#fff
    style B fill:#7B68EE,stroke:#5A4CB5,color:#fff
    style C fill:#E67E22,stroke:#B8651B,color:#fff
    style D fill:#27AE60,stroke:#1E8449,color:#fff
```

Two tracks handle different workloads:

| Track | When to Use | What Happens |
|-------|------------|-------------|
| **Full Protocol** | New features, large tasks | All 4 phases with decision gates |
| **Quick Flow** | Bug fixes, small changes | Skip to spec + build |

---

## Why CodeMAD?

### 1. Structured Methodology

No competitor ships a full methodology pipeline. CodeMAD's 4-phase protocol guides every task from discovery through delivery. The result: predictable, maintainable output instead of code that needs immediate refactoring.

### 2. Privacy First

Your code stays on your machine. Direct API calls to your own keys (BYOK). No proxy servers. No telemetry. No data leaves your environment. Desktop-native architecture means your projects, memory, and search indices live in local storage.

### 3. Multi-Agent Orchestration

Parallel agents work in isolated git worktrees. Each agent gets its own branch, its own workspace, and its own context. Faster through parallelism. Safer through isolation. Your main branch stays untouched until you approve the merge.

### 4. Context Intelligence

Unified semantic search across code, project decisions, and conversation history. Agents find what they need by meaning, not keywords. AST-aware vector search understands code structure. One knowledge layer powers every phase.

### 5. Provider Freedom

Bring any LLM. Ships with 5 providers at launch:

| Provider | Models |
|----------|--------|
| Anthropic | Claude family |
| Google | Gemini family |
| OpenAI | GPT / o-series |
| Zhipu | GLM-4 family |
| Moonshot | Kimi |

Local model support via Ollama is planned. The automatic model router selects the best model for each task. You never pick a model manually unless you want to.

### 6. The Triple Value of the Protocol

The protocol is not just a product feature. It serves three purposes simultaneously:

```mermaid
flowchart TD
    P["CodeMAD Protocol\n4-Phase Methodology"]
    P --> D["Product Differentiator\n─────────────────\nNo competitor has a\nstructured methodology\npipeline"]
    P --> L["Legal Defence\n─────────────────\nHuman decision gates\ncreate copyright\nprotection evidence"]
    P --> R["Regulatory Compliance\n─────────────────\nPhase documentation\nsatisfies EU AI Act\ntransparency rules"]

    style P fill:#2C3E50,stroke:#1A252F,color:#fff
    style D fill:#4A90D9,stroke:#2C5F8A,color:#fff
    style L fill:#7B68EE,stroke:#5A4CB5,color:#fff
    style R fill:#27AE60,stroke:#1E8449,color:#fff
```

- **Product differentiator** -- the only platform with an integrated methodology pipeline
- **Legal defence** -- human authorship gates at each phase create "substantial human participation" evidence, the strongest position for AI code copyright
- **Regulatory compliance** -- phase-by-phase documentation of human vs AI contributions satisfies EU AI Act transparency requirements (deadline: August 2, 2026)

---

## Architecture

CodeMAD is a desktop application built on a three-layer architecture. Rust handles security and process management. Bun handles business logic and LLM communication. The WebView renders the interface.

```mermaid
flowchart TB
    subgraph Desktop["Desktop Application (Tauri)"]
        direction TB
        subgraph Rust["Rust Shell"]
            R1["Process Supervisor"]
            R2["OS Sandbox"]
            R3["Permission Gates"]
            R4["Keychain Access"]
        end
        subgraph Bun["Bun Sidecar"]
            B1["Hono + tRPC API"]
            B2["Agent Orchestrator"]
            B3["LLM SDK (Vercel AI)"]
            B4["LanceDB"]
        end
        subgraph Web["WebView (Svelte 5)"]
            W1["Protocol Dashboard"]
            W2["Agent Activity"]
            W3["Code Editor"]
            W4["Brainstorming Canvas"]
        end
    end

    Web -->|"IPC"| Rust
    Web -->|"SSE"| Bun
    Rust -->|"Spawn + Monitor"| Bun
    Bun -->|"API Calls"| LLM["LLM Providers"]
    Bun -->|"Git Ops"| Git["Git Worktrees"]
    Rust -->|"Secure Storage"| KC["OS Keychain"]

    style Rust fill:#DEA584,stroke:#B8651B,color:#000
    style Bun fill:#FBF0B2,stroke:#C4A000,color:#000
    style Web fill:#A8D8EA,stroke:#5B9BD5,color:#000
```

**Why this split?** Rust provides security guarantees that TypeScript cannot: process isolation, filesystem sandboxing, and memory safety. Bun provides fast startup and native integration with the JavaScript ecosystem where LLM SDKs live. The WebView delivers a rich UI without the overhead of Electron.

### Double Streaming

LLM responses flow through two hops: provider to sidecar (SDK stream), then sidecar to frontend (Server-Sent Events). This gives the backend a chance to intercept, validate, and transform agent output before the user sees it.

---

## Agent System

Four tiers of agents handle work at different levels of abstraction. Higher tiers coordinate. Lower tiers execute.

```mermaid
flowchart TD
    O["Orchestrator\n120-150k tokens\n──────────────\nRoutes tasks\nManages phases\nCoordinates agents"]
    O --> P1["Phase Agent\n100k tokens\n──────────────\nOwns one phase\nManages specialists\nProduces deliverables"]
    O --> P2["Phase Agent\n100k tokens"]
    P1 --> S1["Specialist\n100k tokens\n──────────────\nDomain expert\nExecutes specific\nskill tasks"]
    P1 --> S2["Specialist\n100k tokens"]
    P2 --> S3["Specialist\n100k tokens"]
    S1 --> R1["Researcher\n150k tokens\n──────────────\nGathers context\nSearches code + docs\nProvides evidence"]
    S2 --> R2["Researcher\n150k tokens"]

    style O fill:#2C3E50,stroke:#1A252F,color:#fff
    style P1 fill:#4A90D9,stroke:#2C5F8A,color:#fff
    style P2 fill:#4A90D9,stroke:#2C5F8A,color:#fff
    style S1 fill:#7B68EE,stroke:#5A4CB5,color:#fff
    style S2 fill:#7B68EE,stroke:#5A4CB5,color:#fff
    style S3 fill:#7B68EE,stroke:#5A4CB5,color:#fff
    style R1 fill:#27AE60,stroke:#1E8449,color:#fff
    style R2 fill:#27AE60,stroke:#1E8449,color:#fff
```

- **Token budgets are soft targets**, not hard limits. MCP tools load on-demand to keep usage below targets.
- **Blackboard pattern** for agent coordination: agents post findings to a shared state that others can read. 13-57% improvement over master-slave messaging.
- **Narrative casting** for phase handoffs: structured summaries prevent hallucination when passing context between agents.

### Permission Modes

Three levels control how much autonomy agents have:

| Mode | File Edits | Terminal Commands | Sandbox |
|------|-----------|-------------------|---------|
| **Guardian** | Ask every time | Ask every time | Always enforced |
| **Balanced** | Auto-approve | Ask every time | Always enforced |
| **Autopilot** | Auto-approve | Auto-approve | Always enforced |

The sandbox boundary is always enforced. Balanced mode reduces approval prompts by ~84%.

---

## Security

Six independent layers. A breach in one does not compromise the others.

```mermaid
flowchart TB
    subgraph Security["Defence-in-Depth (6 Layers)"]
        direction TB
        L1["1. OS Sandbox\nmacOS seatbelt / Linux bubblewrap\nProcess-level isolation"]
        L2["2. Filesystem Scope\nAgents read/write only within\nproject root and worktrees"]
        L3["3. Network Egress Control\nBlock private IPs (SSRF protection)\nAllow only known provider endpoints"]
        L4["4. Configuration Guard\nAgents cannot modify their own\nconfig, hooks, or permissions"]
        L5["5. Secrets Injection\nKeys injected at runtime\nNever written to worktrees"]
        L6["6. Resource Limits\nPer-agent timeout, memory ceiling\nMax file size enforcement"]
    end

    L1 --> L2 --> L3 --> L4 --> L5 --> L6

    style L1 fill:#C0392B,stroke:#922B21,color:#fff
    style L2 fill:#E74C3C,stroke:#C0392B,color:#fff
    style L3 fill:#E67E22,stroke:#B8651B,color:#fff
    style L4 fill:#F39C12,stroke:#D68910,color:#fff
    style L5 fill:#27AE60,stroke:#1E8449,color:#fff
    style L6 fill:#2980B9,stroke:#21618C,color:#fff
```

---

## Quality Gates

Five gates run in cost order. The cheapest checks run first so failures are caught before expensive operations.

| Gate | Checks | Fails When |
|------|--------|-----------|
| 1. Lint | Style rules, imports, formatting | Violations, unused imports |
| 2. Type Check | `tsc --noEmit` strict mode | Type errors, missing null checks |
| 3. Build | Turborepo full build | Bundling failures, circular deps |
| 4. Tests | All packages | Failing tests, coverage below threshold |
| 5. Review | Code reviewer agent (or human) | Unresolved change requests |

Agents cannot report "done" if any gate fails. Stop hooks with exit code 2 force continuation until all gates pass.

---

## Competitive Landscape

| Capability | CodeMAD | Cursor | Aider | Claude Code | Windsurf | Continue | Roo Code |
|-----------|---------|--------|-------|-------------|----------|----------|----------|
| Structured workflow | 4-phase protocol | No | No | No | No | No | No |
| Multi-agent worktrees | Git-isolated | No | No | Sub-agents | No | No | No |
| Automatic code indexing | LanceDB + AST | Yes | Repo map | Manual | Yes | Yes | Yes |
| Goal-backward verification | CodeMAD Protocol | No | No | No | No | No | No |
| Chinese LLM support | Zhipu, Moonshot | No | No | No | No | No | No |
| Privacy (direct API) | Yes | No (proxy) | Yes | Yes | No (proxy) | Yes | Yes |
| Open source | AGPL-3.0 | Proprietary | Apache | Proprietary | Proprietary | Apache | Apache |
| Cost transparency | Per-task tracking | No | No | No | No | No | No |
| Local model support | Planned (Ollama) | No | Yes | No | No | Yes | Yes |

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Desktop shell | Tauri (Rust) | Security, small binary, native performance |
| Runtime | Bun | Fast startup, Anthropic-validated (Claude Code sidecar) |
| Frontend | Svelte 5 | 30-40% less code, native SSE, small bundles |
| API | Hono + tRPC | Type-safe end-to-end, lightweight |
| LLM integration | Vercel AI SDK v6 | Unified streaming across all providers |
| Vector DB | LanceDB | Dual-use: code search + cross-session memory |
| Agent coordination | Blackboard MCP | Shared state, lazy tool loading |
| Monorepo | pnpm + Turborepo | Fast builds, package isolation |
| Linting | Biome | Fast, single tool for format + lint |
| Testing | Vitest + cargo test | JS + Rust coverage in one pipeline |

These 12 decisions were locked after extensive research in February 2026. Full rationale with trade-off analysis is documented in the planning artifacts.

---

## Roadmap

| Release | Milestone | What Ships |
|---------|----------|-----------|
| **v0.1-alpha** | Desktop shell works | Tauri app + single chat + one LLM provider |
| **v0.1-beta** | Multi-provider | Stability fixes + all 5 providers connected |
| **v0.2** | Protocol proven | Full 4-phase pipeline end-to-end |
| **v0.3** | Parallelism | Git worktree isolation + multi-agent execution |
| **v0.4** | Intelligence | Semantic code search + Context Intelligence |
| **v0.5** | Experience | Visual brainstorming canvas + polish |
| **v1.0** | Public release | Production-ready for general use |

### Current Status

CodeMAD is in the **architecture planning phase**. Brainstorming and technical research are complete. No application code exists yet.

**What exists today:**

```
_bmad-output/
  brainstorming/             # Product spec and 4-technique brainstorming session
  planning-artifacts/
    research/                # Technical, market, and domain research (3 docs)
  implementation-artifacts/  # Empty (not started)
assets/                      # Logo SVGs, banner, icon generation scripts
```

**Research completed:**
- 116 questions explored across 5 thematic clusters
- 20 SCAMPER transformation ideas accepted
- 6 chaos engineering attack vectors stress-tested
- 12 technology decisions locked with full rationale
- 50+ sources across technical, market, and domain research
- 31 architecture gaps identified and prioritised

---

## Key Features (Planned)

| Feature | Description |
|---------|-------------|
| **Autonomous Tasks** | Describe your goal. Agents handle planning, implementation, and validation. |
| **Parallel Execution** | Multiple builds run simultaneously in isolated git worktrees. |
| **Self-Validating QA** | Built-in quality loop catches issues before you review. |
| **AI-Powered Merge** | Automatic conflict resolution when integrating back to main. |
| **Context Intelligence** | Semantic search across code AND project decisions as one layer. |
| **Cost Estimator** | See estimated API cost before the implementation phase begins. |
| **Pre-flight Checklist** | Visual readiness gate (green/yellow/red) before each phase. |
| **Automatic Model Router** | Best model selected per task. You never pick manually. |
| **MCP Extensibility** | Connect any MCP server. Tools load on-demand to save context. |
| **Cross-Platform** | Native desktop apps for macOS, Windows, and Linux. |

---

## The Market Opportunity

The AI coding tools market is in a "Warring States Period" ([a16z](https://a16z.com)):

- **$7.4B market** growing at 15-27% CAGR
- **82% of developers** use AI assistants daily or weekly
- **Cursor reached $500M ARR** in 15 months
- **42% of developers** run models locally
- **Zero competitors** offer a structured methodology pipeline

The gap is validated. The timing is now.

---

## Contributing

CodeMAD is in stealth development. The repository is not accepting contributions yet.

Once the project reaches beta, contribution guidelines will be published. Watch or star the repo to get notified.

## License

CodeMAD is licensed under the [GNU Affero General Public License v3.0](LICENSE).

This means: forks and modifications must remain open source. If you run a modified version as a service, you must release the source. See the `LICENSE` file for full terms.

---

<p align="center">
  <img src="assets/cm-mark.svg" alt="CodeMAD Mark" width="48" />
  <br />
  <em>Built with methodology. Not just speed.</em>
</p>
