# Recommendations

## Technology Adoption Strategy

1. **Prioritise MCP integration** in both client (consuming tools) and server (exposing protocol) modes. MCP is becoming universal infrastructure.
2. **Ship with Ollama/local model support** from v0.1 or v0.2. The 42% local-running developer base is a natural audience for a privacy-first desktop tool.
3. **Invest in hybrid search** (vector + BM25) as the baseline, with GraphRAG as a Phase 2 enhancement for code search quality.
4. **Keep the three-tier agent hierarchy** despite growing context windows. The protocol's value comes from structured methodology, not from fitting everything in one context.

## Innovation Roadmap

| Phase | Technology Focus |
|-------|-----------------|
| **v0.1-0.2** | Core MCP client, basic LanceDB search, single-provider chat |
| **v0.3** | Multi-agent worktree execution, hybrid search, automatic model router |
| **v0.4** | Context Intelligence (full AST-aware indexing + hybrid search), MCP server mode |
| **v1.0** | Production-grade orchestration, local model support, visual brainstorming surface |
| **v1.x+** | Background automations, GraphRAG, Agent Swarm-scale parallelism |

## Risk Mitigation

1. **Context window arms race:** Monitor quarterly. If 5M+ token windows make multi-agent unnecessary for most tasks, CodeMAD can simplify to a single-agent mode with the protocol still providing the methodology layer.
2. **MCP spec changes:** Subscribe to the MCP spec repo. Track breaking changes. Abstract the MCP layer so it can be updated independently.
3. **Model quality competition:** The automatic model router is the insurance policy. If a new model leapfrogs the current best, users can switch without changing their workflow.
4. **Framework fragmentation:** Do not depend on external orchestration frameworks. Build CodeMAD's orchestration as first-party code.
