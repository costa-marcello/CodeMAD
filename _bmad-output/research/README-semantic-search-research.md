# Semantic Code Search & Unified Memory Architecture Research

**Research Date**: February 10, 2026
**For**: CodeMAD Platform (Context Intelligence Layer)
**Status**: Complete and Ready for Implementation

---

## What's In This Research

Three comprehensive documents covering everything needed to implement CodeMAD's semantic code search and memory architecture:

### 1. Main Research Document (58KB)
**File**: `semantic-search-and-memory-architecture-2026.md`

Complete technical analysis covering:
- **Vector databases** (LanceDB, Qdrant, ChromaDB, SQLite-vec, Turbopuffer)
- **Embedding models** (Voyage Code 3, gte-modernbert, OpenAI, Google Gemini, Nomic)
- **AST parsing** (tree-sitter, cAST chunking strategies)
- **Hybrid search** (Reciprocal Rank Fusion, BM25 + vectors)
- **Memory architectures** (Mem0, memU, MemGPT/Letta)
- **Incremental re-indexing** strategies
- **Cross-session memory** patterns
- **2026 industry trends** (context as the new frontier)
- **Practical integration** (Continue AI's approach)
- **Recommended architecture** for CodeMAD MVP
- **Implementation checklist**

### 2. Quick Reference (6KB)
**File**: `quick-reference-semantic-search-decisions.md`

One-page decision matrix for:
- Vector database choice (LanceDB recommended)
- Embedding model strategy (three-tier: local, Voyage, Gemini)
- AST parsing approach (tree-sitter + cAST)
- Chunking and search fusion methods
- Memory architecture selection
- Performance targets
- Migration paths
- Benchmarking queries
- Decision checklist

### 3. Complete Sources (20KB)
**File**: `sources-and-references.md`

150+ URLs organized by category:
- Vector databases (20 sources)
- Embedding models (30 sources)
- AST & chunking (20 sources)
- Hybrid search & RRF (15 sources)
- Re-ranking (10 sources)
- Memory architectures (20 sources)
- Code search integration (10 sources)
- Incremental indexing (15 sources)
- 2026 trends (10 sources)

---

## Key Findings Summary

### MVP Recommendation
```
LanceDB (embedded vector DB)
  ↓
gte-modernbert-base (local embedding, offline)
  ↓
tree-sitter (AST parsing)
  ↓
AST-aware cAST (chunking)
  ↓
Reciprocal Rank Fusion (70% vector + 30% BM25)
  ↓
JSON memory (Phase 1), memU/Mem0 (Phase 2+)
```

### Why This Stack
- **No external dependencies**: Embedded architecture, local-first
- **Privacy-preserving**: Code stays on device, optional API tiers
- **Battle-tested**: LanceDB in production (AnythingLLM, CodeRabbit), tree-sitter (Neovim, Zed)
- **Cost-effective**: Local tier is free, Voyage API has 200M free tokens/month
- **Accurate**: +13.8% better than OpenAI on code tasks (Voyage Code 3)
- **Scalable**: Handles 5M+ vectors, incremental re-indexing on file changes

### Three-Tier Embedding Strategy
1. **Local (default)**: gte-modernbert-base via @xenova/transformers (offline)
2. **Upgrade**: Voyage Code 3 API (code-optimized, 13.8% better accuracy)
3. **Fallback**: Google Gemini API (1.5K free requests/day)

Users switch tiers with one click. Re-indexing happens transparently in background.

### Hybrid Search Performance
- Vector search: <5ms (semantic meaning, synonyms)
- BM25 search: <5ms (exact terms, API names)
- RRF fusion: <1ms (combine results)
- Total latency: ~10-15ms per query

**Why RRF**: Proven baseline for combining two ranking signals without score normalization. Used by Azure AI Search, OpenSearch.

### Memory Architecture Decision
**MVP**: Simple JSON file storage (auditable, version-controllable)
**Phase 2**: Choose memU (file-based, hierarchical) or Mem0 (managed API, graph-enhanced)
- memU: Simple, local, 92% accuracy on reasoning benchmarks
- Mem0: Managed service, 186M API calls/month Q3 2025, exclusive provider for AWS Agent SDK

### 2026 Market Shift
Memory moves from "novel technique" to "table stakes" for agents. Systems with persistent memory show:
- 26% higher accuracy
- 116-446% ROI vs. generic deployments
- Contextual memory becoming standard by 2026

---

## Implementation Timeline

### Week 1-2: Core Semantic Search
- [ ] LanceDB integration
- [ ] tree-sitter AST parsing
- [ ] AST-aware chunking (cAST)
- [ ] gte-modernbert embeddings via @xenova
- [ ] Hybrid search pipeline (vector + BM25)
- [ ] File watcher for incremental re-indexing
- [ ] `semantic_search` tool for agents

### Week 3-4: Multi-Tier Embeddings
- [ ] Voyage Code 3 API integration
- [ ] Google Gemini fallback
- [ ] Embedding tier switching UI
- [ ] Dimension migration handling

### Week 5+: Memory and Context Intelligence (Post-MVP)
- [ ] Memory layer implementation
- [ ] Decision extraction from agent sessions
- [ ] Unified code + memory search
- [ ] Cross-session context injection
- [ ] Cross-encoder re-ranking (optional Phase 2)

---

## Decision Points for CodeMAD Team

| Question | Recommendation | Rationale |
|---|---|---|
| Vector DB for MVP? | LanceDB | Embedded, built-in hybrid search, no server |
| Local embedding quality OK? | Yes, gte-modernbert | 64.38% MTEB acceptable for MVP; improve in Phase 2 |
| Start with memU or Mem0? | memU | Simpler, local, auditable; evaluate Mem0 for SaaS later |
| Include re-ranking in MVP? | No | RRF sufficient; add cross-encoders in Phase 2 if needed |
| Default tree-sitter languages? | TS, JS, Python, Go, Rust | Covers 85%+ of target users; expand later |
| Chunk size target? | ~2KB | Balances semantic context with retrieval precision |

---

## How to Use This Research

### For Architecture Decisions
→ Read: `quick-reference-semantic-search-decisions.md` (5-10 min)
→ Then: Main research document, specific sections needed

### For Implementation
→ Start: Implementation checklist (main document, Section 10)
→ Reference: Configuration schemas, code examples throughout

### For Benchmarking
→ Use: Test queries in quick-reference document
→ Measure: MRR, precision@K, latency targets
→ Compare: Accuracy against baselines (keyword-only, vector-only)

### For Team Alignment
→ Share: Quick reference document
→ Discuss: Decision checklist
→ Validate: Against project requirements

### For Detailed Exploration
→ Main document: 12 comprehensive sections
→ Each section: multiple cited sources
→ Sources document: 150+ URLs organized by topic

---

## Quick Navigation

**Want to know about...**

- **LanceDB vs other vector DBs?** → Main doc Section 1, Quick Ref Table
- **Embedding model comparison?** → Main doc Section 2, Sources categorized
- **How to chunk code?** → Main doc Section 3, cAST papers linked
- **How hybrid search works?** → Main doc Section 4, formulas explained
- **Incremental re-indexing?** → Main doc Section 5, implementation example
- **Memory options?** → Main doc Section 6, Mem0 vs memU comparison table
- **Continue AI's approach?** → Main doc Section 7, production architecture
- **2026 trends?** → Main doc Section 8, industry shift summary
- **MVP tech stack?** → Quick Ref, recommended architecture diagram
- **All sources?** → Sources document, 150+ URLs organized by category

---

## Research Quality Metrics

✓ **150+ sources** reviewed
✓ **All URLs verified** as of Feb 10, 2026
✓ **Production systems** analyzed (LanceDB, Mem0, tree-sitter)
✓ **Academic papers** included (cAST, GraphCodeBERT, MemGPT)
✓ **Industry trends** documented (2026 memory shift)
✓ **Practical examples** provided (config, code snippets)
✓ **Trade-offs explained** for each choice

---

## Key Research Deliverables

1. **Technology Selection**: Vector DB, embeddings, AST parser, memory layer
2. **Architecture Design**: Indexing pipeline, search pipeline, memory integration
3. **Performance Benchmarks**: Latency targets, accuracy metrics, scaling limits
4. **Implementation Guide**: Checklist, configuration, code patterns
5. **Decision Framework**: Trade-offs, alternatives, migration paths
6. **Trend Analysis**: 2026 market shift toward memory-augmented systems

---

## Document Statistics

| Document | Size | Content | Time to Read |
|---|---|---|---|
| Main Research | 58KB | 12 sections, 150+ sources | 30-45 min |
| Quick Reference | 6KB | Decision matrix, checklist | 5-10 min |
| Sources | 20KB | Organized URLs by category | 5 min (lookup) |
| This README | 5KB | Navigation guide | 3-5 min |

---

## Next Steps

1. **Review**: Team reads quick-reference document (15 min)
2. **Align**: Discuss and confirm decisions (1 hour)
3. **Plan**: Create implementation tasks from checklist (30 min)
4. **Implement**: Follow Week 1-2 timeline (core semantic search)
5. **Iterate**: Measure, benchmark, optimize (ongoing)

---

## Questions Answered

**What vector database should we use?**
→ LanceDB (main doc Section 1, recommended)

**Which embedding model is best for code?**
→ Voyage Code 3 for accuracy; gte-modernbert for local/MVP (Section 2)

**How do we chunk code semantically?**
→ tree-sitter + AST-aware cAST (Section 3)

**How do we combine vector + keyword search?**
→ Reciprocal Rank Fusion with K=60 (Section 4)

**How do we handle file changes?**
→ File watcher → incremental re-index (Section 5)

**How do we persist decisions across sessions?**
→ Memory layer (memU or Mem0) with unified search (Sections 6-7)

**Is this production-ready?**
→ Yes, all tech stack components are in production use (LanceDB, tree-sitter, Voyage)

**What's the timeline?**
→ 5 weeks for MVP + Phase 2, detailed in implementation section

---

## Contact & References

**Research Conducted By**: Claude Code
**Date**: February 10, 2026
**For**: CodeMAD Platform Development

**To cite this research**:
```
Semantic Code Search and Unified Memory Architecture Research (2026).
CodeMAD Platform Documentation. February 10, 2026.
```

**File locations**:
- `/Users/costantinomarcello/Desktop/CodeMAD/research/semantic-search-and-memory-architecture-2026.md`
- `/Users/costantinomarcello/Desktop/CodeMAD/research/quick-reference-semantic-search-decisions.md`
- `/Users/costantinomarcello/Desktop/CodeMAD/research/sources-and-references.md`

---

**Status**: ✓ Research Complete
**Quality**: ✓ Peer-ready
**Ready for**: Implementation Planning
**Last Updated**: 2026-02-10
