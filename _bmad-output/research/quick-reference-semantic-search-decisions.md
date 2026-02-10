# Quick Reference: Semantic Search & Memory Decisions for CodeMAD

## One-Page Decision Matrix

| Decision Area | Recommendation | Why | Alternative |
|---|---|---|---|
| **Vector Database** | LanceDB | Embedded, hybrid search built-in, incremental updates | Qdrant (scale), ChromaDB (prototyping) |
| **Embedding (Local)** | gte-modernbert-base | 768-dim, MTEB 64.38%, ~300MB, offline | nomic-embed-code (code-specific) |
| **Embedding (Premium)** | Voyage Code 3 | +13.8% accuracy on code tasks, free 200M tokens | OpenAI text-embedding-3-large (general) |
| **Embedding (Fallback)** | Google Gemini API | MTEB ~82%, free 1.5K requests/day | OpenAI (higher cost) |
| **AST Parser** | tree-sitter | 40+ languages, incremental, battle-tested | ANTLR, language-specific parsers |
| **Chunking Strategy** | AST-aware cAST | Structure-preserving, +5.5pts RepoEval vs. fixed-size | Sliding window (simple but suboptimal) |
| **Hybrid Search Fusion** | Reciprocal Rank Fusion (K=60) | Proven baseline, 70% vector + 30% BM25 | Score normalization (unstable), learning-to-rank (overkill) |
| **Memory (MVP)** | JSON files | Local, simple, auditable | Database |
| **Memory (Phase 2)** | memU or Mem0 | memU: file-based hierarchical; Mem0: managed API | MemGPT (function-call overhead) |

## MVP Tech Stack at a Glance

```
Input Code
    ↓
File Discovery (respects .gitignore)
    ↓
tree-sitter AST parsing
    ↓
AST-aware semantic chunking (cAST)
    ↓
gte-modernbert-base embeddings (local, offline)
    ↓
LanceDB (vector + BM25 indexes)
    ↓
File watcher (incremental re-index)
    ↓
User Query
    ↓
Parallel: Vector Search (cosine) + BM25 Search
    ↓
Reciprocal Rank Fusion (K=60, 70/30 weights)
    ↓
Ranked Results to Agent
```

## Performance Targets

| Metric | Target | Status |
|---|---|---|
| Embedding latency | <100ms per file | ✓ Achievable |
| Search latency | <15ms per query | ✓ Achievable |
| Re-indexing after file change | <500ms | ✓ Achievable |
| Index storage per 10K LOC | <50MB | ✓ Achievable |
| Accuracy (MRR) | >0.7 | ✓ Achievable with vector + BM25 |

## Three-Tier Embedding Strategy

```
Tier 1 (DEFAULT):  gte-modernbert-base
  → Offline, no API key, ~768-dim
  → MTEB 64.38% (acceptable for MVP)
  → ~300MB download, 1GB RAM

Tier 2 (UPGRADE):  Voyage Code 3 API
  → Code-optimized, +13.8% vs OpenAI
  → Free: 200M tokens/month
  → Requires VOYAGE_API_KEY

Tier 3 (FALLBACK): Google Gemini API
  → MTEB ~82%, multilingual
  → Free: 1,500 requests/day
  → Requires GOOGLE_API_KEY
```

## Key Implementation Details

### Chunking
- Extract semantic nodes (functions, classes, methods) via tree-sitter
- Rich metadata per chunk: symbol name, type, scope chain, imports
- Context enrichment: include related definitions, docstrings
- Chunk size target: ~2KB (respects semantic boundaries)

### Indexing
- Vector index: cosine similarity (HNSW-like in LanceDB)
- Full-text index: BM25 keyword matching
- Incremental: file watcher → re-chunk → re-embed → upsert
- Dimension change: clear old index → full re-index (transparent)

### Search
- Vector: finds semantic meaning, synonyms, related concepts
- BM25: finds exact terms, API names, structured identifiers
- RRF fusion: rank-based merge, no score normalization needed
- Result: top-K unified ranking with combined relevance

## File Organization

```
.codemad/
  ├── index/
  │   ├── vectors.lance
  │   ├── metadata.json
  │   └── embeddings_config.json
  └── config/
      └── semantic_search.json
```

## Configuration Example

```json
{
  "semantic_search": {
    "embedding_tier": "local",
    "vector_db": "lancedb",
    "hybrid_search": {
      "vector_weight": 0.70,
      "bm25_weight": 0.30,
      "rrf_k": 60
    },
    "file_watcher": {
      "debounce_ms": 300
    }
  }
}
```

## Migration Path: Tier Switching

```
User changes tier in UI
    ↓
New embedding model selected
    ↓
Dimension check
    ↓
IF dimensions match:
  - Swap embedder config
  - Re-embed queued files only

IF dimensions differ:
  - Clear LanceDB index
  - Trigger full re-index (background)
  - Search uses BM25-only during re-index
    ↓
Done (transparent to user)
```

## Memory Architecture (Post-MVP)

### Decision: memU vs. Mem0

| Aspect | memU | Mem0 |
|---|---|---|
| Architecture | File-system hierarchy | Managed API + graph |
| Storage | Markdown files | Database |
| Setup | ~50 lines of code | API integration |
| Auditability | Excellent (files) | Limited (proprietary) |
| Cost | Free (self-hosted) | Managed service |
| Latency | ~50-100ms | ~100-200ms |
| Best for | Local agents | Multi-user SaaS |

**Recommendation for CodeMAD**: Start with memU (simpler, local, auditable). Evaluate Mem0 if multi-user SaaS planned.

## Benchmarking Queries

Test these to validate search quality:

```
1. "How do we handle API errors?"
   → Should find: error handling code, retry logic, timeout patterns

2. "Where is authentication implemented?"
   → Should find: auth module, login endpoints, token validation

3. "Database query patterns"
   → Should find: query builders, ORM usage, migration files

4. "State management approach"
   → Should find: store setup, action definitions, reducer patterns

5. "Configuration and environment setup"
   → Should find: config files, env variables, initialization code
```

## Decision Checklist for MVP

- [ ] Confirm LanceDB as vector DB choice
- [ ] Confirm gte-modernbert-base as local embedding
- [ ] Define target languages for tree-sitter support
- [ ] Agree on chunk size limits (~2KB default)
- [ ] Confirm RRF weights (70/30 default)
- [ ] Decide: JSON or simple DB for MVP memory
- [ ] Set accuracy target (MRR threshold)
- [ ] Plan Phase 2 (Voyage API, memU integration)

## When to Re-evaluate

| Condition | Action |
|---|---|
| MRR < 0.5 on test queries | Add cross-encoder re-ranking |
| Indexing > 1s per file | Implement batch processing |
| False positives > 20% | Increase re-ranking threshold |
| Users request non-MVP languages | Extend tree-sitter support |
| Scale > 500K files | Evaluate Qdrant or Turbopuffer |

---

**Document Version**: 1.0 (2026-02-10)
**Purpose**: Quick reference for CodeMAD implementation team
**Status**: Ready for development kickoff
