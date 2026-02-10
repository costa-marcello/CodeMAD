# Semantic Code Search and Unified Memory Architecture Research (2026)

## Executive Summary

This research evaluates the current landscape of semantic code search and unified memory systems for CodeMAD's "Context Intelligence" layer. Key findings:

1. **Vector Databases**: LanceDB remains the optimal choice for local/embedded deployment. Qdrant excels at scale; ChromaDB prioritizes developer velocity for prototypes.

2. **Embedding Models for Code**: Voyage AI's voyage-code-3 outperforms OpenAI by 13.8% on code-specific tasks. Nomic's open-source models and ModernBERT offer cost-effective alternatives.

3. **AST Parsing**: Tree-sitter remains the gold standard. New tools like ast-grep improve the developer experience around tree-sitter.

4. **Hybrid Search**: Reciprocal Rank Fusion (RRF) with K=60 is the proven baseline for combining vector + BM25 search.

5. **Memory Architecture**: Mem0 and memU represent two competing approaches—graph-based and hierarchical file-system-based respectively. 2026 marks the shift from "memory as novel" to "memory as table stakes" for agents.

6. **Integration Pattern**: Continue AI's LanceDB-powered approach demonstrates the practical architecture for local semantic code search in IDEs.

---

## 1. Vector Databases for Local/Embedded Use

### 1.1 LanceDB

**Status**: Production-ready, actively developed

**Key Metrics**:
- Query latency: <20ms for 100K 1000-dim vectors
- Supports 5M+ vectors on commodity hardware
- Built on Apache Arrow columnar format

**Why LanceDB for CodeMAD**:
- **No external server required**: Embedded library design matches CodeMAD's local-first architecture
- **Built-in hybrid search**: Native BM25 + vector search without additional dependencies
- **Memory-mapped disk access**: Queries vectors on disk at near-RAM speeds via SIMD optimizations
- **Automatic reindexing**: LanceDB's write-friendly design supports incremental updates
- **Production adoption**: AnythingLLM users (nearly 100%) report blazing-fast performance on even low-end hardware; CodeRabbit uses it for AI code review

**Integration with CodeMAD**:
```
File changes → LanceDB file watcher → Re-embed changed chunks only
Vector + BM25 searches run in parallel → RRF fusion (70% vector, 30% keyword)
Index lives in `.codemad/index/` (git projects) or `~/.cache/codemad/embeddings/` (other dirs)
```

**Architecture Details**:
- Columnar format (Apache Arrow) enables memory-mapped file access
- HNSW-like indexing for approximate nearest neighbor search
- Incremental updates reuse embeddings where source row hasn't changed
- Full-text search via TF-IDF BM25

**References**:
- [LanceDB Official](https://lancedb.com/)
- [LanceDB Benchmarks](https://github.com/prrao87/lancedb-study)
- [AWS Case Study: LanceDB + S3](https://aws.amazon.com/blogs/architecture/a-scalable-elastic-database-and-search-solution-for-1b-vectors-built-on-lancedb-and-amazon-s3/)
- [Continue AI Integration](https://blog.continue.dev/building-a-semantic-code-history-search-with-lancedb/)

### 1.2 Qdrant

**Status**: Production-ready, enterprise-grade

**Key Strengths**:
- Written in Rust for performance
- Horizontal scaling, ACID transactions
- Advanced metadata filtering
- 200ms p99 latency over 100B vectors (ANN v3)

**Trade-offs vs. LanceDB**:
- Designed for scale (50M–100M+ vectors)
- Requires HTTP API (more overhead than embedded)
- More complex deployment for small teams

**When to use Qdrant**:
- Multi-user cloud deployments
- Handling 50M+ vectors with complex filtering
- Distributed replication needed

**For CodeMAD**: Not necessary for MVP (single-user local app), but valuable if scaling to cloud SaaS.

**References**:
- [Qdrant Embedded Mode](https://qdrant.tech/)
- [Qdrant vs Chroma Comparison](https://www.myscale.com/blog/qdrant-vs-chroma-vector-databases-comparison/)

### 1.3 ChromaDB

**Status**: Good for prototyping; 2025 Rust rewrite delivers 4x faster writes/queries

**Key Characteristics**:
- 4x faster than Python version (2025 rewrite)
- Zero configuration, NumPy-like Python API
- Designed for <10M vectors

**Limitations**:
- Not designed for production at 50M+ vectors
- Optimized for speed-to-prototype, not operational scale

**For CodeMAD**: Consider ChromaDB only if prototyping MVP extremely quickly. LanceDB better for single-codebase indexing.

**References**:
- [ChromaDB vs Qdrant](https://www.waterflai.ai/post/chromadb-vs-qdrant-which-vector-database-is-right-for-you/)

### 1.4 SQLite-vec (successor to sqlite-vss)

**Status**: Emerging, particularly suited for distributed per-user models

**Key Advantages**:
- Lightweight, embeds in SQLite
- Unlimited horizontal scalability via per-user database instances
- Data portability

**Use Case**: Multi-tenant SaaS where each user/customer has their own database instance.

**For CodeMAD**: Not necessary for MVP single-user model, but valuable for future enterprise/SaaS scaling.

**References**:
- [SQLite-vec as sqlite-vss successor](https://github.com/asg017/sqlite-vec)

### 1.5 Turbopuffer

**Status**: Emerging, specialized for extreme scale

**Key Metrics**:
- 200ms p99 latency over 100B vectors
- 10M+ writes/second peak throughput
- 10x cheaper than traditional VectorDBs
- Cold queries: 500-600ms; warm queries: 8-10ms

**Architecture**:
- Object storage-first design (uses S3, GCS, etc.)
- Automatic caching without manual tuning
- Optimizes to 90-100% recall automatically

**For CodeMAD**: Not needed for MVP. Interesting for future enterprise deployments handling massive codebases (100B+ vectors).

**References**:
- [Turbopuffer Official](https://turbopuffer.com/)
- [Cursor's 100B Vector Scale](https://turbopuffer.com/customers/cursor)

### 1.6 Recommendation for CodeMAD

**Use LanceDB for MVP**:
- ✓ Embedded library (no external server)
- ✓ Built-in BM25 + vector hybrid search
- ✓ Incremental re-indexing
- ✓ Production-ready with proven adoption
- ✓ Minimal operational overhead
- ✓ Local-first, privacy-preserving design

**Future scaling path**:
- Single codebase → LanceDB embedded
- Multi-user SaaS → Qdrant (HTTP API) or Turbopuffer (extreme scale)
- Per-user SaaS → SQLite-vec

---

## 2. Embedding Models for Code

### 2.1 Voyage AI: voyage-code-3

**Status**: State-of-the-art for code retrieval (December 2024)

**Performance**:
- Outperforms OpenAI text-embedding-3-large by 13.8% average across 32 code retrieval datasets
- Outperforms CodeSage-large by 16.81%
- Optimized specifically for code understanding

**Matryoshka Support**:
- Supports smaller dimensions (512, 256) with quantization (int8, binary)
- 512-dim binary: 200x less storage cost than full-dim, only 0.31% accuracy drop
- Dramatically reduces embedding storage/retrieval costs

**Cost Model**:
- API-based (requires API key)
- Free tier: 200M tokens/month (sufficient for most codebases)
- Production: Pay-per-token

**When to Use**:
- Cloud deployment with API budget
- Maximum code retrieval accuracy required
- Cost not primary concern

**References**:
- [Voyage Code 3 Blog](https://blog.voyageai.com/2024/12/04/voyage-code-3/)
- [MongoDB Case Study](https://www.mongodb.com/company/blog/voyage-code-3-more-accurate-code-retrieval-lower-dimensional-quantized-embeddings)

### 2.2 OpenAI text-embedding-3-large

**Status**: Solid general-purpose model

**Performance**:
- 3072 dimensions
- MTEB scores competitive with Voyage for general tasks (slightly lower for code)
- 13.8% behind voyage-code-3 on code-specific tasks
- Supports Matryoshka Learning (dimension reduction)

**Cost Model**:
- $0.02 per 1M tokens (input)
- Higher than Voyage API pricing for production

**For CodeMAD**:
- Good fallback if OpenAI provider preferred
- Not optimal for code-specific search (use voyage-code-3 instead)

### 2.3 Google Gemini Embeddings API

**Status**: Competitive general-purpose model

**Performance**:
- 768 dimensions
- MTEB scores: ~82% (strong)
- Free tier: 1,500 requests/day

**Characteristics**:
- Multilingual support
- Fast API responses
- Good for cross-lingual codebases

**For CodeMAD**:
- Consider as cost-effective alternative when Voyage API not available
- Free tier sufficient for prototyping

### 2.4 Nomic: nomic-embed-code

**Status**: Open-source, fully reproducible (2024)

**Key Features**:
- 7B parameter model (locally runnable)
- Trained on CoRNStack dataset with dual-consistency filtering
- Supports: Python, Java, Ruby, PHP, JavaScript, Go
- Fully open-source weights, training data, evaluation code

**Characteristics**:
- Local deployment possible (GPU required for inference speed)
- No API dependency
- Fully reproducible training pipeline
- Smaller than general-purpose embedders

**Cost Model**:
- Free (open-source weights)
- Requires GPU hardware or Ollama integration

**For CodeMAD**:
- Good option for privacy-conscious deployments
- Slightly lower quality than Voyage but acceptable for many use cases
- Can run via Ollama for local inference

**References**:
- [Nomic Embed Code on HuggingFace](https://huggingface.co/nomic-ai/nomic-embed-code)

### 2.5 Nomic: ModernBERT Embed

**Status**: Latest generation, open-source (2024)

**Performance**:
- 149M parameters
- Outperforms nomic-embed-text-v1.5
- Supports 8192 token context (long-context embeddings)

**Key Features**:
- ModernBERT architecture improvements over traditional BERT
- Matryoshka Representation Learning: 256-dim embeddings (3x memory reduction) with minimal quality loss
- Fast inference

**Language Support**:
- Primary: English
- Multilingual: Use mmBERT variant

**For CodeMAD (MVP Tier)**:
- **Recommended for local/offline mode**
- 149M model size fits in ~300MB disk, ~1GB RAM
- Via @xenova/transformers in Bun runtime
- ONNX quantization for speed
- Scores ~64.38% on MTEB (acceptable for initial MVP)

**Deployment Path**:
```
Layer 1 (local): gte-modernbert-base via @xenova/transformers
  → Offline, no API needed, ~768 dimensions
  → MTEB: 64.38% (MVP quality threshold)

Layer 2 (voyage): Voyage Code 3 API (optional upgrade)
  → Higher accuracy (79% MTEB for code)
  → Free tier: 200M tokens/month

Layer 3 (gemini): Google Gemini API (fallback)
  → 82% MTEB, multilingual
  → Free tier: 1,500 requests/day
```

**References**:
- [ModernBERT Embed on HuggingFace](https://huggingface.co/nomic-ai/modernbert-embed-base)
- [Nomic Embed Technical Report](https://arxiv.org/abs/2402.01613)

### 2.6 CodeBERT / GraphCodeBERT Successors

**Status**: Superseded by newer approaches

**Historical Context**:
- CodeBERT (2020): Pre-trained on 6 programming languages
- GraphCodeBERT (2021): Added data flow for semantic understanding
- Successors: CodeT5, PLBART, UniXcoder

**Why Not Used**:
- Newer models (Voyage, Nomic) show better performance
- These models were designed for understanding, not embedding retrieval
- Voyage Code 3 achieves better results on benchmark suite

**References**:
- [CodeBERT GitHub](https://github.com/microsoft/CodeBERT)
- [GraphCodeBERT Paper](https://arxiv.org/abs/2009.08366)

### 2.7 Recommendation for CodeMAD

**MVP Architecture (Three-Tier)**:

| Tier   | Model                      | Dimensions | MTEB Score | Cost      | When Used                           |
|--------|---------------------------|------------|------------|-----------|-------------------------------------|
| Local  | gte-modernbert-base        | 768        | 64.38%     | Free      | Default (offline mode)              |
| Voyage | Voyage Code 3 API          | 1024       | 79% (code) | Freemium  | Premium tier (200M tokens/mo free)  |
| Gemini | Google Gemini Embeddings   | 768        | ~82%       | Freemium  | Fallback (1.5K requests/day free)   |

**Rationale**:
- **Local tier** works offline, no API needed, acceptable for MVP
- **Voyage tier** provides 13.8% accuracy boost for code-specific search (best-in-class for code)
- **Gemini tier** acts as fallback if Voyage quota exhausted

**Implementation Details**:
```typescript
// config: embedding tier selection
{
  "semantic_search": {
    "embedding_tier": "local" | "voyage" | "gemini",
    "local_model": "gte-modernbert-base",
    "dimensions": 768,
    "cache_path": "~/.cache/codemad/embeddings/"
  }
}

// dimension change → clear index → full re-index
// This is automatic and transparent to user
```

---

## 3. AST Parsing and Code Chunking

### 3.1 Tree-sitter

**Status**: Gold standard, battle-tested, actively maintained

**Why Tree-sitter**:
- Powers syntax highlighting in Neovim, Helix, Zed editors
- Supports 40+ languages
- Incremental parsing (fast updates on file changes)
- Recovers from parse errors gracefully

**Supported Languages (CodeMAD)**:
- TypeScript, JavaScript, Python, Go, Rust, Java, C, C++, C#, Bash
- Plus 30+ more via tree-sitter ecosystem

**Integration in CodeMAD**:
```
File discovery (respecting .gitignore)
    ↓
tree-sitter AST parsing
    ↓
Semantic node extraction (functions, classes, methods, etc.)
    ↓
Rich metadata (symbol name, type, lines, comments)
    ↓
Embedding with context
```

**Performance**:
- Parse time: milliseconds per file
- Incremental re-parse on change: <10ms
- File watcher → re-chunk → re-embed → LanceDB update

**References**:
- [Tree-sitter Official](https://tree-sitter.github.io/tree-sitter/)
- [Tree-sitter Parser List](https://github.com/tree-sitter/tree-sitter/wiki/List-of-parsers)
- [Semantic Code Indexing with Tree-sitter (Medium)](https://medium.com/@email2dineshkuppan/semantic-code-indexing-with-ast-and-tree-sitter-for-ai-agents-part-1-of-3-eb5237ba687a)

### 3.2 AST-Aware Chunking Best Practices

**Problem with Fixed-Size Chunking**:
- Splits functions/classes mid-definition
- Loses structural context
- Semantic meaning fragmented across chunks

**cAST (Contextual AST) Solution**:
- Structure-preserving recursion: large AST nodes split recursively, siblings merged while respecting size limits
- Metadata enrichment: each chunk includes scope chain, imports, siblings, entity signatures
- Cross-language consistency: same chunking strategy across all languages

**Performance Gains** (from cAST paper):
- StarCoder2-7B: +5.5 points on RepoEval
- Code generation: +4.3 points on CrossCodeEval
- Code understanding: +2.7 points on SWE-bench

**Implementation Strategy**:
```
AST node → Recursive chunking (respect ~2KB chunk size)
         → Metadata enrichment (scope, imports, context)
         → Embedding with context text

For large files:
  Sliding window strategy → Average embeddings → Re-rank post-retrieval
```

**Handling Large Functions**:
```
Method 1: Sliding window with averaging
  - Extract context from function
  - Chunk at semantic boundaries (nested functions, blocks)
  - Average embeddings for query-time ranking

Method 2: Multi-chunk with pointer
  - If function too large, split but preserve pointers to full definition
  - Allow retrieval of full context at query time
```

**Context Enrichment Example**:
```python
# Raw chunk text insufficient for embedding
# Need: scope chain, imports, type hints, related definitions

chunk = {
  "text": "def process_data(data):\n  return data.strip()",
  "contextualizedText": """
    Module: data_processing
    Imports: [pandas, numpy]
    Related: validate_input(data) → bool
    Scope: [DataProcessor.process_data]
    DocString: "Strips whitespace from data"
    def process_data(data):
      return data.strip()
  """
}
```

**References**:
- [cAST Research Paper](https://arxiv.org/abs/2506.15655)
- [SuperMemory Code-Chunk Implementation](https://github.com/supermemoryai/code-chunk)
- [Building Code-Chunk: AST-Aware Chunking](https://supermemory.ai/blog/building-code-chunk-ast-aware-code-chunking/)

### 3.3 Alternatives to Tree-sitter

**ast-grep**:
- Tree-sitter-based tool for structural search and replacement
- Better developer experience around tree-sitter patterns
- Good for automated refactoring

**ANTLR**:
- Parser generator (requires grammar writing)
- More control over AST structure
- Higher setup cost

**Language-Specific Parsers**:
- Babel (JavaScript)
- ast module (Python)
- More mature but single-language

**Recommendation**: Stick with tree-sitter for CodeMAD. Best balance of breadth, performance, and community.

---

## 4. Hybrid Search Architecture

### 4.1 Reciprocal Rank Fusion (RRF)

**What It Does**:
Merges rankings from multiple search modalities (vector + BM25) into a unified result set without requiring score normalization.

**The Formula**:
```
RRF Score = 1 / (k + rank)

where:
  k = constant (typically 60)
  rank = position in individual result list (1-indexed)
```

**Why RRF Works**:
- Rank-based fusion avoids comparing raw scores (which are incomparable between modalities)
- Robust to outliers in individual ranking algorithms
- Simple, reproducible, no hyperparameter tuning

**Two-Stage Architecture** (CodeMAD Implementation):

```
Query Input
    ↓
Embed query → Vector Search (cosine similarity) → Ranked results (scores 0-1)
                                                        ↓
                                                   Extract ranks only
                                                        ↓
BM25 Keyword Search → Ranked results (BF25 scores) → Extract ranks only
                                                        ↓
                           Reciprocal Rank Fusion (K=60)
                                    ↓
                          Unified Ranked Results
                    (70% semantic weight + 30% keyword weight)
```

**CodeMAD's RRF Configuration**:
- K = 60 (typical value, empirically optimized across Azure AI Search and OpenSearch)
- Semantic weight: 70% (vectors catch intent, synonyms, semantic meaning)
- Keyword weight: 30% (BM25 catches exact terms, structured identifiers)

**Alternative Fusion Strategies**:
1. **Score normalization**: Min-max scaling of raw scores (requires careful handling of outliers)
2. **Learning-to-rank**: Train model to predict optimal ranking (overkill for MVP)
3. **Simple averaging**: Average normalized scores (works but less stable than RRF)

**Best Practice**: RRF is the "simplest, strongest baseline" (Microsoft Azure AI documentation). Use unless proven necessity for more complex approach.

### 4.2 BM25 Implementation

**What BM25 Does**:
- Sparse vector search based on keyword matching
- Builds on TF-IDF with normalization penalty
- Better than TF-IDF because: penalizes document length, handles within-document term saturation

**In LanceDB**:
```
Each chunk indexed by:
  - Token terms (lexical)
  - BM25 weights (computed at index time)

Query processing:
  - Tokenize query → BM25 scoring → Ranked by relevance
```

**When BM25 Excels**:
- Exact identifier matches (function names, variable names)
- API method names
- Known domain-specific terminology
- Short, structured code comments

**Limitations**:
- Doesn't understand synonyms
- Misses semantic relationships
- Failed by typos

### 4.3 Vector Search Component

**What Vector Search Does**:
- Semantic similarity via embeddings
- Catches intent, meaning, related concepts
- Robust to paraphrasing

**Cosine Similarity in LanceDB**:
```
similarity = dot_product(query_vec, chunk_vec) / (|query_vec| * |chunk_vec|)

range: [0, 1]
  1.0 = identical meaning
  0.0 = orthogonal
  0.5 = weak correlation
```

**When Vector Search Excels**:
- Conceptual queries ("error handling", "authentication flow")
- Paraphrased intent
- Cross-language concepts
- Finding related code even with different names

**Limitations**:
- Cannot find exact terms if embedding space doesn't preserve them
- Embedding quality depends on training data
- False positives on unrelated but semantically close code

### 4.4 Implementation in CodeMAD

```typescript
// Hybrid search implementation
async function hybridSearch(query: string, limit: number = 10) {
  const queryEmbedding = await embedder.embed(query);

  // Parallel searches
  const [vectorResults, bm25Results] = await Promise.all([
    // Vector search: cosine similarity
    vectorDb.search({
      vector: queryEmbedding,
      limit: limit * 2, // Over-fetch for RRF
      metric: 'cosine'
    }),

    // Full-text search: BM25
    vectorDb.search({
      query: query,
      limit: limit * 2,
      method: 'bm25'
    })
  ]);

  // Reciprocal Rank Fusion (K=60)
  const rrfK = 60;
  const scoreMap = new Map<string, number>();

  // Vector search contribution (70% weight)
  vectorResults.forEach((result, rank) => {
    const score = (0.7 * (1 / (rrfK + rank + 1)));
    scoreMap.set(result.id, (scoreMap.get(result.id) || 0) + score);
  });

  // BM25 contribution (30% weight)
  bm25Results.forEach((result, rank) => {
    const score = (0.3 * (1 / (rrfK + rank + 1)));
    scoreMap.set(result.id, (scoreMap.get(result.id) || 0) + score);
  });

  // Return top-K fused results
  return Array.from(scoreMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id, score]) => ({ id, rrfScore: score }));
}
```

**Performance Characteristics**:
- Vector search: ~5-10ms for typical queries
- BM25 search: ~2-5ms
- RRF fusion: <1ms
- Total: ~10-15ms per query on typical codebase

### 4.5 Cross-Encoder Re-ranking (Optional Enhancement)

**Purpose**: Post-process initial results with deeper semantic understanding

**How It Works**:
1. Initial retrieval: hybrid search returns top-K (e.g., K=20)
2. Re-ranking: cross-encoder scores all K documents against query
3. Re-ranked results: return top-M (e.g., M=5) after re-ranking

**Cross-Encoder vs. Bi-Encoder**:
- **Bi-encoder** (current): Embed query and documents separately, compare via cosine
- **Cross-encoder**: Jointly encode query + document pair, produce relevance score
- Cross-encoders more accurate but don't scale to millions of documents

**Example Cross-Encoder Models**:
- Sentence-BERT cross-encoder family (HuggingFace)
- ZeroEntropy zerank-1 (custom trained for RAG)
- Cohere rerank-3

**For CodeMAD**:
- **Not required for MVP** (RRF sufficient)
- **Consider for Phase 2** if accuracy insufficient
- Adds ~50-100ms latency (cross-encoder inference)

**Research Results**:
- Databricks: +48% retrieval improvement with re-ranking
- ZeroEntropy: +28% NDCG@10, correlates with lower hallucination in RAG

**References**:
- [OpenAI Cookbook: Search Reranking](https://cookbook.openai.com/examples/search_reranking_with_cross-encoders)
- [Elastic Blog: Cross-Encoder Re-ranking](https://www.elastic.co/search-labs/blog/elasticsearch-cross-encoder-reranker-huggingface)
- [Ultimate Guide to Reranking (2026)](https://www.zeroentropy.dev/articles/ultimate-guide-to-choosing-the-best-reranking-model-in-2025)

### 4.6 Recommendation for CodeMAD

**MVP Implementation**:
- Use Reciprocal Rank Fusion (RRF) with K=60
- Vector search (cosine): 70% weight
- BM25 keyword: 30% weight
- ~10-15ms latency per query
- No cross-encoder (save for Phase 2 optimization)

**Future Enhancement (Phase 2)**:
- Add cross-encoder re-ranking if accuracy insufficient
- Query-dependent weighting: high-confidence queries use 80/20, low-confidence use 50/50
- Track metrics: mean average precision (MAP), normalized discounted cumulative gain (NDCG@10)

---

## 5. Incremental Re-indexing Strategy

### 5.1 File Watcher Approach

**Implementation**:
```
File change → Debounce (300ms) → Parse AST → Embed chunks → Update LanceDB
```

**CodeMAD Design**:
```typescript
// Pseudo-code: file watcher integration
const watcher = watch('.', {
  ignoreInitial: true,
  ignored: ['.git', '.gitignore', 'node_modules', ...] // respect .gitignore
});

watcher.on('change', async (filePath) => {
  // 1. Check if file still exists (might be deleted)
  if (!fs.existsSync(filePath)) {
    await index.deleteDocument(filePath);
    return;
  }

  // 2. Parse old and new AST to find changed chunks
  const oldChunks = await index.getChunksForFile(filePath);
  const newChunks = await parseAndChunkFile(filePath);

  // 3. Identify changed chunks via diff
  const changedChunks = findChangedChunks(oldChunks, newChunks);

  // 4. Re-embed only changed chunks
  const newEmbeddings = await embedder.batch(changedChunks.map(c => c.text));

  // 5. Update vector store (insert or update)
  await vectorDb.upsertDocuments(changedChunks.map((chunk, i) => ({
    ...chunk,
    embedding: newEmbeddings[i]
  })));
});
```

**Optimization Opportunities**:
1. **Chunk-level granularity**: Only re-embed chunks that changed
2. **Embedding reuse**: If only comments changed, reuse same embedding
3. **Batching**: Group changes in 300ms window, process as batch
4. **Debouncing**: Avoid re-indexing during save-while-typing

### 5.2 Dimension Change Handling

**Scenario**: User switches from local embedding (768 dims) to Voyage (1024 dims)

**Current Design** (CodeMAD):
```
Dimension mismatch detected
    ↓
Clear old index
    ↓
Full re-index with new model
    ↓
Swap embedder configuration
    ↓
Background process (not blocking)
```

**User Experience**:
- Seamless tier switching (local ↔ voyage ↔ gemini)
- Re-indexing happens in background
- User can continue working
- Search temporarily returns keyword-only results during re-index

### 5.3 Distributed/Multi-Worktree Consistency

**Challenge**: Multiple agents in parallel worktrees modifying same files

**Solution**:
```
Per-worktree indexing with lazy merge
    ↓
Each worktree maintains its own incremental index
    ↓
On merge back to main:
  - Detect changed files
  - Re-index only merged changes
  - Merge indexes
```

**Conflict Resolution**:
```
File modified in both worktrees
    ↓
Git merge conflict resolved → merged content
    ↓
Use merged content for re-indexing
```

**References**:
- [Databricks Delta Sync Indexing](https://docs.databricks.com/aws/en/vector-search/create-vector-search)
- [Milvus: Incremental Updates](https://milvus.io/ai-quick-reference/how-do-you-handle-incremental-updates-in-a-vector-database)

---

## 6. Memory Architecture Patterns

### 6.1 Mem0: Universal Memory Layer

**Status**: Production-ready, recently raised $24M Series A (Oct 2025)

**Architecture**:
```
Interaction Input → Memory Extraction → Memory Organization → Vector/Graph Store
                        ↓
                   Compress chat history into optimized representations
                        ↓
                   Preserve context fidelity while minimizing tokens
```

**Key Features**:
- Self-improving memory: learns user preferences, patterns, history
- Hierarchical organization: categories → items → raw resources
- Graph enhancement (optional): entity relationships for complex queries
- Dual-mode retrieval: vector search + LLM-based interpretation

**2026 Evolution**:
- Graph memory for AI agents (January 2026 update)
- Optional graph layer adds entity relationships when needed
- Vector-based retrieval handles straightforward use cases
- No runtime dependencies required (unlike MemGPT's archival/recall tables)

**Scale Metrics**:
- Q1 2025: 35M API calls
- Q3 2025: 186 million API calls (30% month-over-month growth)
- Exclusive memory provider for AWS Agent SDK

**Memory Representation**:
```
Conversation History: "User wants to use TypeScript for backend"
                ↓
         Mem0 Compression
                ↓
Memory Item: "Backend Language Preference: TypeScript"
Category: "Project Preferences"
Metadata: {
  confidence: 0.95,
  lastUpdated: "2026-02-10",
  relatedDecisions: ["TS version selection", "ORM choice"]
}
```

**Cost Profile**:
- Significant token savings through compression (e.g., 1000-token conversation → 50-token memory)
- Latency: ~100-200ms for memory operations
- Suitable for cross-session persistence

**References**:
- [Mem0 Official](https://mem0.ai/)
- [Graph Memory for AI Agents (Jan 2026)](https://mem0.ai/blog/graph-memory-solutions-ai-agents)
- [AWS Integration Blog](https://aws.amazon.com/blogs/database/build-persistent-memory-for-agentic-ai-applications-with-mem0-open-source-amazon-elasticache-for-valkey-and-amazon-neptune-analytics/)

### 6.2 memU: Hierarchical File-System Memory

**Status**: Emerging framework, released Feb 2026

**Architecture** (Three-Level Hierarchy):
```
Memory Categories (markdown files)
    ↓
    ├── Category: Project Decisions
    │   ├── Item: "Use TypeScript + SvelteKit"
    │   └── Item: "Zustand for state management"
    │
    ├── Category: User Preferences
    │   ├── Item: "Prefers TDD approach"
    │   └── Item: "Code style: strict ESLint"
    │
    └── Category: Context (Sessions)
        ├── Item: "Session 2026-02-10"
        │   └── Raw: conversation logs
        └── Item: "Session 2026-02-09"
            └── Raw: conversation logs
```

**Key Features**:
- File-system-based storage (simple, auditable, version-controllable)
- Hierarchical retrieval: top-down (fast) or full-read (comprehensive)
- Dual-mode retrieval: embedding search + LLM-based (non-embedding) search
- Multimodal: supports text, images, audio, video

**Retrieval Modes**:
1. **Embedding Search**: Fast semantic matching across categories
2. **LLM-based Search**: Agent reads full category files directly, reasons about content

**Performance**:
- Locomo benchmark: 92.09% average accuracy across all reasoning tasks
- Suitable for persistent 24/7 agent memory
- Token cost lower than Mem0 (uses LLM-based search for fine-grained decisions)

**Philosophy**:
- "Simple as Mem0, Powerful as MemU"
- Treats memory like filesystem: intuitive, explorable, version-controlled
- Natural integration with git (commit memory changes)

**References**:
- [memU GitHub](https://github.com/NevaMind-AI/memU)
- [memU Official Site](https://memu.pro/docs)
- [Building AI Agents with Long-Term Memory: memU vs LangChain](https://brlikhon.engineer/blog/building-ai-agents-with-long-term-memory-memu-vs-langchain-memory-complete-architecture-guide-)

### 6.3 MemGPT / Letta: Tiered Memory

**Status**: Mature framework (OpenReview 2023, maintained as Letta)

**Architecture**:
```
Main Context (fast, small)
    ↓ Managed by LLM via function calls
    ↓
Archival Memory (external table, persistent)
Recall Memory (conversation history table)
```

**How It Works**:
```
LLM context limited to ~4K tokens
                ↓
LLM can call functions:
  - read_archival_memory(query)
  - read_recall_memory(query)
  - write_archival_memory(key, value)
  - write_recall_memory(message)
                ↓
Virtual context management: agent self-manages what data to load into context
```

**Key Concepts**:
- **Virtual context**: Appearance of large context window via intelligent data movement
- **Tiered memory**: Main context (DRAM-like) vs. external (disk-like)
- **LLM autonomy**: Agent decides what to remember/forget

**Limitations**:
- Requires function calls for memory operations (adds latency)
- Function call overhead for simple lookups
- More complex than file-based approaches

**References**:
- [MemGPT Paper](https://arxiv.org/abs/2310.08560)
- [Letta Docs: Memory Management](https://docs.letta.com/advanced/memory-management/)
- [Virtual Context Management Blog](https://www.leoniemonigatti.com/blog/memgpt.html)

### 6.4 Comparison: Mem0 vs. memU vs. MemGPT

| Aspect                | Mem0                      | memU                    | MemGPT/Letta          |
|-----------------------|---------------------------|-------------------------|----------------------|
| **Architecture**      | Graph + vector store      | File-system hierarchy   | Tiered tables         |
| **Storage**           | API-backed DB             | Markdown files          | SQL tables            |
| **Retrieval modes**   | Vector + LLM              | Vector + LLM-read       | Function calls        |
| **Setup complexity**  | Medium (managed service)  | Low (files + embedding) | Medium (function API) |
| **Token efficiency**  | Very high (compression)   | High (selective reads)  | Medium (all ops costly)|
| **Auditability**      | Limited (proprietary API) | Excellent (files)       | Medium (tables)       |
| **Version control**   | Not straightforward       | Native (git)            | Not native            |
| **Latency**           | ~100-200ms                | ~50-100ms               | Variable (function calls) |
| **Cost profile**      | Tokenized API             | Embedded (local)        | Embedded (local)      |
| **Best for**          | Cloud/SaaS, many users    | Local/single-user agents| Complex LLM workflows |
| **Production use**    | 186M monthly calls (Q3)   | Emerging (Feb 2026)     | Research/niche        |

### 6.5 Context Intelligence: Unified Code + Memory Search

**The Problem**:
- Code search answers "where is X in the codebase?"
- Memory search answers "what decisions did we make?"
- These are separate systems, requiring two queries

**The Solution**: Context Intelligence Layer

```
User Query: "How should we handle API retries?"
                ↓
         Unified Search
                ↓
        ┌─────────┬──────────┐
        ↓         ↓          ↓
    Code Search Memory Search Decision History
        ↓         ↓          ↓
    (find retry     (find retry (find when we
     functions)     decision)   decided on retry
                                strategy)
        ↓         ↓          ↓
        └─────────┴──────────┘
                ↓
        Contextual Results
        (code + reasoning)
```

**Implementation Strategy for CodeMAD**:

```typescript
interface ContextIntelligenceQuery {
  query: string;
  scope: 'code' | 'memory' | 'both';
  context?: {
    currentFile?: string;
    recentDecisions?: string[];
    projectPhase?: 'planning' | 'implementation' | 'review';
  };
}

async function contextualSearch(q: ContextIntelligenceQuery) {
  const results = {
    code: [] as CodeSearchResult[],
    memory: [] as MemoryResult[],
    decisions: [] as DecisionResult[]
  };

  if (q.scope === 'code' || q.scope === 'both') {
    // Hybrid search: LanceDB (vectors + BM25)
    results.code = await codeSearch.hybrid(q.query, { limit: 5 });
  }

  if (q.scope === 'memory' || q.scope === 'both') {
    // Memory search: vector + LLM-based
    results.memory = await memory.search(q.query, { limit: 5 });

    // Extract decision history
    results.decisions = await memory.getRelatedDecisions(q.query);
  }

  // Correlate: link code chunks to decisions that shaped them
  const correlated = correlateCodeAndMemory(results.code, results.decisions);

  return {
    ...results,
    correlations: correlated,
    explanation: generateContextualExplanation(results)
  };
}
```

**Use Cases**:
1. "Where do we handle API errors? What was the decision?" → Code + Memory
2. "What's our testing strategy?" → Memory (decisions, architecture choices)
3. "How is authentication implemented?" → Code (implementation details)

**For CodeMAD MVP**:
- Implement as post-MVP enhancement
- Start with separate searches
- Unify UI/results later

---

## 7. Practical Integration: Continue AI's LanceDB Approach

### 7.1 How Continue AI Uses LanceDB

**Architecture**:
```
User Query in Continue IDE
        ↓
Continue calls LanceDB APIs
        ↓
Vector + Scalar Indexes (built at index time)
        ↓
Sub-millisecond result retrieval (milliseconds for massive datasets)
        ↓
SQL-like Filters (language, project, tags)
        ↓
Ranked Results to LLM
```

**Key Innovation**: Semantic Code History Search

```
Git Blame Data (who wrote what, when)
        ↓
Sentence Transformers (embed code + context)
        ↓
LanceDB Vector Store
        ↓
Developers ask: "How did we handle API retries in this project?"
        ↓
Semantic search finds related commits + code
        ↓
LLM synthesizes "Here's what we did before, here's the PR that implemented it"
```

**Advantages Over Keyword Search**:
- Find semantically related code even with different names
- Track design decisions through git history
- "What patterns have we used before?" queries
- Context-aware code suggestions

**Embedding Flexibility**:
- No full re-indexing on model swap
- Changes only update affected vectors
- Dimension mismatch → clear + re-index (transparent)

**References**:
- [Building Semantic Code History Search with LanceDB](https://blog.continue.dev/building-a-semantic-code-history-search-with-lancedb/)
- [Continue AI + LanceDB Evolution](https://lancedb.com/blog/the-future-of-ai-native-development-is-local-inside-continues-lancedb-powered-evolution/)

---

## 8. 2026 Trends: Context as the New Frontier

### 8.1 Industry Shift

**Key Finding**: 2026 is "The Year of Context"

From industry analysis:
- Memory moves from "novel technique" to "table stakes" for agents
- 26% higher accuracy, 116-446% ROI for systems with persistent memory
- Three major evolution areas:
  1. **Contextual Memory**: Hierarchical (user → session → agent levels)
  2. **Context Engineering**: Curating and structuring instructions/tools dynamically
  3. **Context Engines**: Unified platforms merging structured/unstructured retrieval

### 8.2 Context Engineering Pattern

**What It Is**:
```
Agent receives task
        ↓
Query: "What docs, decisions, code, past attempts matter for this task?"
        ↓
Context engine retrieves relevant:
  - Code snippets
  - Architecture decisions
  - Conversation history
  - Similar past tasks
        ↓
Injected into prompt as structured context
        ↓
Agent executes with full background knowledge
```

**Tools Implementing This Pattern**:
- **CodeConductor**: Automatically extracts relevant code
- **Windsurf**: Tracks edits across files as context
- **Cursor**: Per-file context windows that understand project structure

### 8.3 Contextual Memory Evolution

**Identity-Level Memory** (2026 target):
```
User knows: code style, reasoning pattern, project preferences
                ↓
Memory follows user across: email, docs, dashboards, code, CRM
                ↓
AI maintains: identity context, not just session context
```

**Hierarchical Layers**:
- **Session level**: Current conversation
- **Project level**: Decisions specific to this codebase
- **User level**: Preferences, reasoning style, past projects
- **Organization level**: Team standards, architecture patterns

### 8.4 What This Means for CodeMAD

**MVP Priority**:
1. Semantic code search (vector + BM25)
2. Session-level memory (current chat → decision storage)
3. Per-project memory (decisions tied to project)

**Phase 2 Enhancements**:
1. Context Intelligence layer (code + memory unified search)
2. Cross-session memory with hierarchical organization
3. Memory-aware agent prompts (inject relevant past decisions)

**Phase 3 Vision**:
1. Identity-level memory (user preferences across projects)
2. Org-level memory (team standards, architectural patterns)
3. Advanced context engineering (dynamic prompt construction)

**References**:
- [2026 Data Predictions: Scaling AI via Contextual Intelligence](https://siliconangle.com/2026/01/18/2026-data-predictions-scaling-ai-agents-via-contextual-intelligence/)
- [Death of Sessionless AI (Medium)](https://medium.com/@aniruddhyak/the-death-of-sessionless-ai-how-conversation-memory-will-evolve-from-2026-2030-9afb9943bbb5)
- [Why Memory Changes Enterprise AI in 2026](https://medium.com/@johnpettynaible/why-memory-changes-enterprise-ai-in-2026-de5ebf07e5c8)
- [Context Engineering Guide](https://codeconductor.ai/blog/context-engineering/)

---

## 9. Recommended Architecture for CodeMAD

### 9.1 MVP Tech Stack

| Component                | Selection       | Why                                              |
|--------------------------|-----------------|--------------------------------------------------|
| **Vector DB**            | LanceDB         | Embedded, built-in hybrid search, incremental   |
| **Embedding (Local)**    | gte-modernbert  | 768-dim, MTEB 64.38%, offline, ~300MB           |
| **Embedding (Premium)**  | Voyage Code 3   | Code-optimized, 13.8% better than OpenAI        |
| **AST Parser**           | tree-sitter     | 40+ languages, battle-tested, incremental       |
| **Chunking**             | AST-aware cAST  | Structure-preserving, metadata-rich             |
| **Hybrid Search**        | RRF (K=60)      | 70% vector + 30% BM25, proven baseline          |
| **Memory (MVP)**         | JSON files      | Local, auditable, simple                        |
| **Memory (Phase 2)**     | memU or Mem0    | Hierarchical organization, persistent           |

### 9.2 Indexing Pipeline

```
File Discovery
  ↓ (respects .gitignore)
AST Parsing (tree-sitter)
  ↓
Semantic Node Extraction
  ↓ (functions, classes, methods)
Context Enrichment
  ↓ (imports, scope, related definitions)
Batch Embedding
  ↓ (gte-modernbert local or Voyage API)
LanceDB Storage
  ↓ (vector + BM25 indexes)
File Watcher (incremental)
  ↓ (on change: re-chunk → re-embed → upsert)
```

### 9.3 Search Pipeline

```
User Query
  ↓
Embed Query (same model as indexing)
  ↓
┌─ Vector Search (LanceDB, cosine similarity)
│
└─ BM25 Search (LanceDB, keyword matching)
  ↓
Reciprocal Rank Fusion (K=60, 70/30 weight)
  ↓
Ranked Results (top-K, with scores)
  ↓
Optional: Cross-encoder re-ranking (Phase 2)
  ↓
Return to Agent
```

### 9.4 Memory Integration (Phase 2+)

```
Agent Session
  ↓
Track Key Decisions
  ├─ Architecture choices
  ├─ Tech stack selections
  ├─ Testing approach
  └─ Code patterns established
  ↓
Store in Memory Layer
  ├─ Session-level: current chat
  ├─ Project-level: decisions for this codebase
  └─ User-level: preferences across projects
  ↓
Context Intelligence on Query
  ├─ Search code by meaning
  ├─ Search decisions by relevance
  └─ Correlate: "Here's the code, here's why we chose it"
```

### 9.5 Configuration Schema

```json
{
  "semantic_search": {
    "enabled": true,
    "embedding_tier": "local",
    "embedding_tiers": {
      "local": {
        "model": "gte-modernbert-base",
        "dimensions": 768,
        "source": "@xenova/transformers"
      },
      "voyage": {
        "model": "voyage-code-3",
        "dimensions": 1024,
        "api_key": "process.env.VOYAGE_API_KEY"
      },
      "gemini": {
        "model": "text-embedding-004",
        "dimensions": 768,
        "api_key": "process.env.GOOGLE_API_KEY"
      }
    },
    "hybrid_search": {
      "enabled": true,
      "vector_weight": 0.70,
      "bm25_weight": 0.30,
      "rrf_k": 60
    },
    "index_location": ".codemad/index/",
    "file_watcher": {
      "enabled": true,
      "debounce_ms": 300
    }
  },
  "memory": {
    "enabled": false,
    "type": "json",
    "location": "~/.local/share/codemad/memory/",
    "hierarchical": {
      "levels": ["session", "project", "user"]
    }
  }
}
```

---

## 10. Implementation Checklist for CodeMAD MVP

### Phase 1: Core Semantic Search
- [ ] Integrate LanceDB SDK
- [ ] Implement tree-sitter AST parsing for target languages
- [ ] Build AST-aware chunking with metadata enrichment
- [ ] Integrate gte-modernbert-base via @xenova/transformers
- [ ] Implement LanceDB vector index creation
- [ ] Add BM25 full-text index to LanceDB
- [ ] Implement RRF fusion logic (K=60, 70/30 weights)
- [ ] Create file watcher for incremental re-indexing
- [ ] Build semantic_search tool for agents
- [ ] Add @-syntax for inline code queries

### Phase 2: Multi-Tier Embeddings
- [ ] Add Voyage Code 3 API integration
- [ ] Add Google Gemini API fallback
- [ ] Implement embedding tier switching UI
- [ ] Handle dimension migration (clear + re-index)
- [ ] Test tier swapping end-to-end

### Phase 3: Cross-Encoder Re-ranking (Optional)
- [ ] Research best cross-encoder models
- [ ] Integrate re-ranking pipeline
- [ ] Measure accuracy improvements
- [ ] Add to search result flow

### Phase 4: Memory Integration (Post-MVP)
- [ ] Evaluate memU vs. Mem0
- [ ] Implement decision extraction from agent sessions
- [ ] Build memory storage layer
- [ ] Add memory search to semantic_search tool
- [ ] Implement Context Intelligence unified search

---

## 11. Benchmarking and Evaluation Metrics

### Indexing Performance
- **Chunk count**: Documents per codebase
- **Embedding throughput**: Chunks/second
- **Re-indexing time**: File change → searchable (should be <500ms)
- **Storage size**: Disk used by LanceDB index

### Search Quality
- **Mean Reciprocal Rank (MRR)**: Average rank of first relevant result
- **Precision@K**: How many of top-K results are relevant
- **Recall@K**: Coverage of relevant results in top-K
- **Latency**: ms from query to ranked results

### User Experience
- **Query success rate**: How often search finds what user wants
- **Time to answer**: Feedback latency
- **Re-index awareness**: Does user notice index updates?

### Comparative Baselines
```
Comparison Query: "How do we handle API errors?"

Keyword Search Only:
  - Matches: error, API, catch, throw
  - May miss: retry logic, timeout handling, circuit breaker

Vector Search Only:
  - Matches: error handling patterns, exception management
  - May miss: API-specific terminology (404, 500)

Hybrid (RRF):
  - Combines both: "Here's error handling code, including API-specific cases"
  - Superior to either alone
```

---

## 12. Security and Privacy Considerations

### Code Indexing
- Respects `.gitignore`, `.env` (no secrets indexed)
- Local index in `.codemad/index/` (git-ignored)
- No code transmitted to external services (unless using Voyage/Gemini APIs)

### API Keys
- Voyage API key: Optional, requires explicit user action
- Gemini API key: Optional, requires explicit user action
- Local embedding: Zero external API calls

### Memory Storage
- JSON files stored in `~/.local/share/codemad/memory/`
- Permissions: `0o600` (owner-only)
- No cloud sync (local-only)

### Agent Access
- Agents can read code via semantic search
- Agents cannot modify index configuration
- File access bounded to project root

---

## Summary and Next Steps

### Key Takeaways

1. **LanceDB** is the optimal vector database for CodeMAD's MVP—embedded, fast, built-in hybrid search
2. **gte-modernbert-base** (local) with Voyage Code 3 (premium tier) provides best accuracy/cost balance
3. **Tree-sitter + AST-aware chunking** delivers structure-aware code retrieval
4. **Reciprocal Rank Fusion** (RRF, K=60) is the proven baseline for vector + BM25 fusion
5. **Memory in 2026** is shifting from "nice-to-have" to "must-have" for agent systems
6. **Context Intelligence** (unified code + memory search) is the next-generation frontier

### Recommended Implementation Order

1. **Week 1-2**: LanceDB integration + gte-modernbert embedding + hybrid search
2. **Week 3**: Tree-sitter AST parsing + semantic chunking
3. **Week 4**: File watcher + incremental re-indexing
4. **Week 5**: Multi-tier embedding support (Voyage, Gemini fallback)
5. **Post-MVP**: Memory layer, Context Intelligence, cross-encoder re-ranking

### Open Decisions for CodeMAD Team

1. **Memory approach**: memU (file-based, simple) vs. Mem0 (managed, feature-rich)?
2. **Initial language support**: Focus on TypeScript/Python first, then expand?
3. **Local embedding tier**: gte-modernbert acceptable for MVP, or raise quality bar?
4. **Premium default**: Default to local tier or offer Voyage free tier?
5. **Cross-encoder timeline**: Include in MVP or defer to Phase 2?

---

## References (Complete URL List)

### Vector Databases
- https://lancedb.com/
- https://github.com/prrao87/lancedb-study
- https://docs.lancedb.com/faq/faq-oss
- https://github.com/lancedb/lancedb
- https://cybergarden.au/blog/5-powerful-vector-database-tools-2025
- https://aws.amazon.com/blogs/architecture/a-scalable-elastic-database-and-search-solution-for-1b-vectors-built-on-lancedb-and-amazon-s3/
- https://www.oreateai.com/blog/technical-analysis-and-practical-applications-of-vector-database-lancedb/892f4eb7f18a69710b4b3f5cde5546be
- https://lancedb.com/blog/the-future-of-ai-native-development-is-local-inside-continues-lancedb-powered-evolution/
- https://lancedb.com/blog/anythingllms-competitive-edge-lancedb-for-seamless-rag-and-agent-workflows/
- https://zilliz.com/blog/lance-db-vs-deep-lake-a-comprehensive-vector-database-comparison
- https://www.firecrawl.dev/blog/best-vector-databases-2025
- https://www.myscale.com/blog/qdrant-vs-chroma-vector-databases-comparison/
- https://www.datacamp.com/blog/the-top-5-vector-databases
- https://airbyte.com/data-engineering-resources/chroma-db-vs-qdrant
- https://liveblocks.io/blog/whats-the-best-vector-database-for-building-ai-products
- https://customgpt.ai/rag-vector-database-selection/
- https://zilliz.com/comparison/qdrant-vs-chroma
- https://liquidmetal.ai/casesAndBlogs/vector-comparison/
- https://research.aimultiple.com/open-source-vector-databases/
- https://www.waterflai.ai/post/chromadb-vs-qdrant-which-vector-database-is-right-for-you
- https://turbopuffer.com/
- https://turbopuffer.com/docs/vector
- https://jxnl.co/writing/2025/09/11/turbopuffer-object-storage-first-vector-database-architecture/
- https://turbopuffer.com/blog/turbopuffer
- https://turbopuffer.com/customers/cursor
- https://turbopuffer.com/docs/architecture
- https://turbopuffer.com/docs/hybrid
- https://turbopuffer.com/docs/write
- https://turbopuffer.com/docs/query
- https://www.zenml.io/blog/vector-databases-for-rag

### Embedding Models
- https://modal.com/blog/6-best-code-embedding-models-compared
- https://www.openxcell.com/blog/best-embedding-models/
- https://elephas.app/blog/best-embedding-models
- https://www.mongodb.com/company/blog/voyage-code-3-more-accurate-code-retrieval-lower-dimensional-quantized-embeddings
- https://app.ailog.fr/en/blog/guides/choosing-embedding-models
- https://artsmart.ai/blog/top-embedding-models-in-2025/
- https://dev.to/datastax/the-best-embedding-models-for-information-retrieval-in-2025-3dp5
- https://www.zenml.io/blog/best-embedding-models-for-rag
- https://www.bentoml.com/blog/a-guide-to-open-source-embedding-models
- https://blog.voyageai.com/2024/12/04/voyage-code-3/
- https://nomic-ai/modernbert-embed-base · Hugging Face (https://huggingface.co/nomic-ai/modernbert-embed-base)
- https://www.nomic.ai/news/nomic-embed-text-v1
- https://arxiv.org/html/2402.01613v2
- https://www.aimodels.fyi/models/huggingFace/modernbert-embed-base-nomic-ai
- https://nomic-ai/nomic-embed-code · Hugging Face (https://huggingface.co/nomic-ai/nomic-embed-code)
- https://static.nomic.ai/reports/2024_Nomic_Embed_Text_Technical_Report.pdf
- https://ollama.com/library/nomic-embed-text
- https://github.com/nomic-ai/contrastors
- https://research.aimultiple.com/embedding-models/
- https://document360.com/blog/text-embedding-model-analysis/
- https://www.voyageai.com/
- https://blog.voyageai.com/2025/01/07/voyage-3-large/
- https://huggingface.co/voyageai/voyage-code-3

### AST Parsing
- https://medium.com/@email2dineshkuppan/semantic-code-indexing-with-ast-and-tree-sitter-for-ai-agents-part-1-of-3-eb5237ba687a
- https://symflower.com/en/company/blog/2023/parsing-code-with-tree-sitter/
- https://github.com/tree-sitter/tree-sitter/discussions/2553
- https://news.ycombinator.com/item?id=36014875
- https://www.dropstone.io/blog/ast-parsing-tree-sitter-40-languages
- https://ast-grep.github.io/advanced/core-concepts.html
- https://betterprogramming.pub/deep-dive-into-ast-greps-pattern-7efc3eefc7c3
- https://github.com/tree-sitter/tree-sitter/wiki/List-of-parsers
- https://github.com/tree-sitter/tree-sitter/discussions/831
- https://github.com/tree-sitter/tree-sitter

### Hybrid Search & RRF
- https://www.elastic.co/what-is/hybrid-search
- https://docs.cloud.google.com/vertex-ai/docs/vector-search/about-hybrid-search
- https://weaviate.io/blog/hybrid-search-explained
- https://medium.com/thinking-sand/hybrid-search-with-bm25-and-rank-fusion-for-accurate-results-456a70305dc5
- https://opensearch.org/blog/introducing-reciprocal-rank-fusion-hybrid-search/
- https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking
- https://medium.com/@connect.hashblock/7-hybrid-search-recipes-bm25-vectors-without-lag-467189542bf0
- https://qdrant.tech/articles/hybrid-search/
- https://dev.to/qvfagundes/dense-vs-sparse-retrieval-mastering-faiss-bm25-and-hybrid-search-4kb1
- https://www.paradedb.com/learn/search-concepts/reciprocal-rank-fusion

### AST-Aware Chunking
- https://github.com/supermemoryai/code-chunk
- https://supermemory.ai/blog/building-code-chunk-ast-aware-code-chunking/
- https://arxiv.org/html/2506.15655v1
- https://medium.com/@vishnudhat/rag-for-llm-code-generation-using-ast-based-chunking-for-codebase-c55bbd60836e
- https://vxrl.medium.com/enhancing-llm-code-generation-with-rag-and-ast-based-chunking-5b81902ae9fc
- https://arxiv.org/abs/2506.15655
- https://medium.com/@jouryjc0409/ast-enables-code-rag-models-to-overcome-traditional-chunking-limitations-b0bc1e61bdab
- https://arxiv.org/pdf/2506.15655
- https://github.com/yilinjz/astchunk
- https://www.researchgate.net/publication/392839333_cAST_Enhancing_Code_Retrieval-Augmented_Generation_with_Structural_Chunking_via_Abstract_Syntax_Tree

### Memory Architecture
- https://github.com/NevaMind-AI/memU
- https://x.com/Sumanth_077/status/2008177201955643402
- https://memu.pro/docs
- https://pypi.org/project/memu-py/
- https://ht-x.com/en/posts/2026/01/github-nevamind-ai-memu-memory-infrastructure-for/
- https://brlikhon.engineer/blog/building-ai-agents-with-long-term-memory-memu-vs-langchain-memory-complete-architecture-guide-
- https://github.com/NevaMind-AI
- https://github.com/Shichun-Liu/Agent-Memory-Paper-List
- https://github.com/NevaMind-AI/memU-server
- https://github.com/mem0ai/mem0
- https://mem0.ai/
- https://mem0.ai/blog/graph-memory-solutions-ai-agents
- https://deepwiki.com/mem0ai/mem0/1-overview
- https://mem0.ai/series-a
- https://www.datacamp.com/tutorial/mem0-tutorial
- https://aws.amazon.com/blogs/database/build-persistent-memory-for-agentic-ai-applications-with-mem0-open-source-amazon-elasticache-for-valkey-and-amazon-neptune-analytics/
- https://docs.mem0.ai/platform/overview
- https://techcrunch.com/2025/10/28/mem0-raises-24m-from-yc-peak-xv-and-basis-set-to-build-the-memory-layer-for-ai-apps/
- https://www.ycombinator.com/companies/mem0
- https://arxiv.org/abs/2310.08560
- https://docs.letta.com/concepts/memgpt/
- https://www.leoniemonigatti.com/papers/memgpt.html
- https://informationmatters.org/2025/10/memgpt-engineering-semantic-memory-through-adaptive-retention-and-context-summarization/
- https://arxiv.org/pdf/2310.08560
- https://github.com/ksm26/LLMs-as-Operating-Systems-Agent-Memory
- https://docs.letta.com/advanced/memory-management/
- https://www.leoniemonigatti.com/blog/memgpt.html
- https://memgpt.ai/
- https://docs.letta.com/guides/agents/memory/

### Code Search Integration
- https://blog.continue.dev/building-a-semantic-code-history-search-with-lancedb/
- https://lancedb.com/blog/the-future-of-ai-native-development-is-local-inside-continues-lancedb-powered-evolution/
- https://blog.lancedb.com/the-future-of-ai-native-development-is-local-inside-continues-lancedb-powered-evolution/
- https://www.lancedb.com/blog/blog/the-future-of-ai-native-development-is-local-inside-continues-lancedb-powered-evolution/
- https://github.com/danielbowne/claude-context
- https://glama.ai/mcp/servers/@vrppaul/semantic-code-mcp
- https://lancedb.com/blog/case-study-coderabbit/
- https://lancedb.com/blog/building-rag-on-codebases-part-1/
- https://deepwiki.com/Kilo-Org/kilocode/3.7-codebase-indexing-and-semantic-search
- https://github.com/continuedev/continue/issues/1218

### Re-ranking
- https://cookbook.openai.com/examples/search_reranking_with_cross-encoders
- https://oneuptime.com/blog/post/2026-01-30-cross-encoder-reranking/view
- https://www.elastic.co/search-labs/blog/elasticsearch-cross-encoder-reranker-huggingface
- https://medium.com/@rossashman/the-art-of-rag-part-3-reranking-with-cross-encoders-688a16b64669
- https://www.cloudthat.com/resources/blog/the-power-of-cross-encoders-in-re-ranking-for-nlp-and-rag-systems
- https://www.elastic.co/docs/solutions/search/ranking/semantic-reranking
- https://osanseviero.github.io/hackerllama/blog/posts/sentence_embeddings2/
- https://www.sbert.net/examples/cross_encoder/applications/README.html
- https://sbert.net/examples/sentence_transformer/applications/retrieve_rerank/
- https://www.zeroentropy.dev/articles/ultimate-guide-to-choosing-the-best-reranking-model-in-2025

### Context and 2026 Trends
- https://www.getzep.com/
- https://www.microsoft.com/en-us/research/story/whats-next-in-ai/
- https://contextual.ai/
- https://aimultiple.com/ai-context-window
- https://sdtimes.com/ai/ai-predictions-for-2026
- https://codeconductor.ai/blog/context-engineering/
- https://venturebeat.com/data/six-data-shifts-that-will-shape-enterprise-ai-in-2026
- https://siliconangle.com/2026/01/18/2026-data-predictions-scaling-ai-agents-via-contextual-intelligence/
- https://www.infoworld.com/article/4108092/6-ai-breakthroughs-that-will-define-2026.html
- https://www.tribe.ai/applied-ai/beyond-the-bubble-how-context-aware-memory-systems-are-changing-the-game-in-2025
- https://www.sphere-inc.com/blogs/ai-memory-and-context/
- https://claudefa.st/blog/guide/mechanics/session-memory
- https://www.jenova.ai/en/resources/ai-chat-with-history
- https://www.jenova.ai/en/resources/ai-with-unlimited-memory
- https://medium.com/@aniruddhyak/the-death-of-sessionless-ai-how-conversation-memory-will-evolve-from-2026-2030-9afb9943bbb5
- https://medium.com/@johnpettynaible/why-memory-changes-enterprise-ai-in-2026-de5ebf07e5c8
- https://plurality.network/blogs/best-universal-ai-memory-extensions-2026/
- https://dev.to/aws/bring-ai-agents-with-long-term-memory-into-production-in-minutes-338l
- https://developer.nvidia.com/blog/introducing-nvidia-bluefield-4-powered-inference-context-memory-storage-platform-for-the-next-frontier-of-ai/

### Additional Resources
- https://milvus.io/ai-quick-reference/how-do-you-handle-incremental-updates-in-a-vector-database
- https://docs.databricks.com/aws/en/vector-search/create-vector-search
- https://learn.microsoft.com/en-us/azure/databricks/vector-search/create-vector-search
- https://docs.databricks.com/aws/en/vector-search/vector-search
- https://www.pulumi.com/registry/packages/databricks/api-docs/vectorsearchindex/
- https://community.databricks.com/t5/generative-ai/behavior-of-vector-index-sync-with-delta-tables-when-using/td-p/113272
- https://docs.weaviate.io/weaviate/concepts/vector-index
- https://learn.microsoft.com/en-us/azure/databricks/generative-ai/create-query-vector-search
- https://community.openai.com/t/do-i-need-to-re-index-my-embedding-database-periodically/973805
- https://databricks-sdk-py.readthedocs.io/en/latest/workspace/vectorsearch/vector_search_indexes.html
- https://github.com/microsoft/CodeBERT
- https://openreview.net/forum?id=jLoC4ez43PZ
- https://arxiv.org/html/2312.15223v2
- https://openreview.net/pdf?id=jLoC4ez43PZ
- https://deepwiki.com/microsoft/CodeBERT/2-graphcodebert
- https://arxiv.org/abs/2009.08366
- https://ieeexplore.ieee.org/document/9678927/
- https://huang.isis.vanderbilt.edu/cs8395/readings/graphcodebert.pdf
- https://arxiv.org/html/2410.05275v1
- https://www.kaggle.com/code/tiquasar/ensemble-codebert-pairwise-graphcodebert

---

**Document Version**: 1.0 (2026-02-10)
**Research Scope**: Semantic code search, vector databases, embedding models, memory architectures
**Target**: CodeMAD MVP architecture decisions
**Status**: Ready for implementation planning
