# Strategic Roadmap and Next Steps

## Immediate Actions (Next 30 Days)

1. **Complete architecture planning** -- Use this research to inform architecture decisions. The technology choices are validated (Tauri, Bun, Svelte 5, LanceDB, Hono, tRPC, Vercel AI SDK). Focus architecture on the agent orchestration layer and protocol execution engine.

2. **Resolve token budget discrepancy** -- The canonical docs show 40k/80k (line ~970) vs 120k/50k/10k (line ~1972). Lock this in the architecture document.

3. **Define MCP server interface** -- Design how CodeMAD exposes its protocol phases as MCP tools. This enables ecosystem integration from day one.

   **[RECONCILIATION - Feb 10, 2026]:** Flagged as critical architecture requirement. Must be addressed in the architecture document.

## v0.1-v0.2 Priorities (Validated by Research)

| Priority | Feature | Research Validation |
|----------|---------|-------------------|
| 1 | Desktop shell + single chat + Anthropic provider | Proven form factor. Cursor proved IDE-based adoption. |
| 2 | Full four-phase pipeline | Core differentiator. No competitor has this. |
| 3 | Context Intelligence (LanceDB + tree-sitter) | Industry standard pattern. Hybrid search validated. |
| 4 | Local model support (Ollama) | 42% of devs run local. Privacy differentiator. |
| 5 | Automatic model router | Removes decision users should not make. Cost optimiser. |

## v0.3-v1.0 Priorities (Informed by Competitive Analysis)

| Priority | Feature | Competitive Rationale |
|----------|---------|----------------------|
| 6 | Git worktree isolation + multi-agent | Table stakes. Every serious competitor has this or is building it. |
| 7 | Code quality score (0-100) | Makes "no spaghetti" measurable. No competitor does this. |
| 8 | Cost estimator at readiness gate | Trust builder. Nobody else shows estimated API cost before building. |
| 9 | MCP server mode | Ecosystem play. Let other tools invoke CodeMAD phases. |
| 10 | Visual mind map brainstorming | The screenshot that sells CodeMAD. Visual differentiator. |

## Positioning Strategy

**Primary narrative:** "Stop generating code. Start shipping products."

**Supporting messages:**
- "The first AI coding platform with a methodology"
- "Your code, your machine, your models -- zero proxy servers"
- "From coder to orchestrator: the protocol that teaches you how"

**Target the pain:** PR sizes up 150%, bugs up 9%. Developers are drowning in AI-generated code that ships defects faster. CodeMAD is the cure: structured phases, quality gates, test-first development.
