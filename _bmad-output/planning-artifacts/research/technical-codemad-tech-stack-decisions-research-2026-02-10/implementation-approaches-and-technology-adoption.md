# Implementation Approaches and Technology Adoption

**Research Coverage:** 4 parallel streams covering development workflows, deployment/distribution, LLM cost modelling, and solo founder strategy. 100+ sources.

---

## Development Workflow

### Tauri Dev Loop

The `tauri dev` command orchestrates three parallel processes:

1. **Frontend dev server** (Vite, Next.js, etc.) -- hot reloads WebView on file changes
2. **Rust backend** -- auto-rebuilds and restarts on Rust file changes
3. **Sidecar** (Bun) -- runs independently with its own file watcher

Frontend changes update the WebView instantly (no app restart). Rust changes trigger a full rebuild (~2-5s with cached dependencies). Sidecar changes restart only the sidecar process.

**Sidecar hot reload:** Configure Bun with `--watch` mode during development. The sidecar restarts automatically on TypeScript changes without touching the Rust core or WebView.

_Sources: [Tauri Development Guide](https://v2.tauri.app/develop/), [Tauri Sidecar](https://v2.tauri.app/develop/sidecar/)_

### Debugging

| Layer | Tool | How |
|-------|------|-----|
| Frontend (WebView) | DevTools | Cmd+Option+I (macOS), Ctrl+Shift+I (Windows/Linux) |
| Rust core | LLDB / GDB | `RUST_BACKTRACE=1` + `tauri build --debug` |
| Bun sidecar | Node inspector | `bun --inspect` + Chrome DevTools |
| IPC traffic | Console logging | Log invoke() calls in both Rust and TS |

**VS Code extensions:** Tauri extension (command palette + config validation), rust-analyzer (Rust intellisense), vscode-lldb (Rust debugging).

_Source: [Tauri Debug Guide](https://v2.tauri.app/develop/debug/)_

### Code Quality Tooling (2026 State)

| Tool | Speed vs ESLint | Rules | Dependencies | Status |
|------|----------------|-------|-------------|--------|
| **Biome v2.3** | 10-25x faster | 434 | 0 (single Rust binary) | Production-ready, type-aware |
| **oxlint v1.0** | 50-100x faster | 520+ | 0 (Rust binary) | Production (Shopify, Airbnb) |
| ESLint + Prettier | Baseline | Variable | 127+ npm packages | Legacy, still dominant |

**Recommendation:** Biome for new projects. Zero configuration, zero dependencies, handles linting + formatting + import sorting in one tool. oxlint is faster but less mature for configuration.

**Real-world signal:** Shopify migrated their admin console to oxlint. Airbnb lints 126k+ files in 7 seconds with oxlint.

_Sources: [Biome vs ESLint 2025](https://medium.com/@harryespant/biome-vs-eslint-the-ultimate-2025-showdown-for-javascript-developers-speed-features-and-3e5130be4a3c), [oxlint v1.0](https://www.infoq.com/news/2025/08/oxlint-v1-released/)_

### Monorepo Dev Experience

**Turborepo + pnpm setup for Tauri:**

```
codemad/
├── apps/
│   └── desktop/          # Tauri app (Rust + frontend)
├── packages/
│   ├── core/             # Agent system, LLM providers
│   ├── ui/               # Shared UI components
│   ├── shared/           # Types, utils, constants
│   └── mcp/              # MCP client/server logic
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Watch mode** (Turborepo 2.0+): Mark `dev` tasks as `"persistent": true`. Turborepo coordinates all watch processes with dependency awareness.

**TypeScript project references** enable incremental cross-package type checking. Set `"composite": true` and `"declaration": true` in each package's tsconfig. Build with `tsc --build` -- only recompiles changed packages.

**Known issue:** `tauri add` does not detect pnpm correctly in workspaces. Workaround: add an empty `pnpm-lock.yaml` to the Tauri package directory.

_Sources: [Turborepo Watch Mode](https://turborepo.dev/docs/reference/watch), [Tauri v2 + Monorepo Guide](https://melvinoostendorp.nl/blog/tauri-v2-nextjs-monorepo-guide)_

---

## Testing Strategy

### Unit Testing

| Layer | Runner | Mock Strategy |
|-------|--------|---------------|
| Rust commands | `cargo test` + `tauri::test` | `mock_builder()` creates app without desktop env |
| TypeScript logic | Vitest or Bun test | Standard mocks, no Tauri dependency |
| IPC calls | Vitest + `mockIPC()` | `@tauri-apps/api/mocks` intercepts invoke() calls |
| LLM responses | Vitest + MSW or VCR | Record/replay API responses |

**`mockIPC()` example:** Tauri provides `@tauri-apps/api/mocks` to intercept IPC messages without running the Rust backend. The frontend calls `invoke()` and receives mocked responses. This enables pure frontend testing with no native processes.

**Bun test** is 50-100x faster than Jest with zero configuration, Jest API compatibility, and built-in snapshot testing.

_Sources: [Tauri Testing Guide](https://v2.tauri.app/develop/tests/), [Tauri Mock APIs](https://v2.tauri.app/develop/tests/mocking/)_

### Integration and E2E Testing

| Approach | Coverage | Platform Support | Speed |
|----------|----------|-----------------|-------|
| WebDriver (Selenium) | Full desktop E2E | Windows, Linux (no macOS) | Slow |
| Playwright (web only) | Frontend in browser | All (no native features) | Fast |
| Manual smoke testing | Full app | All | Slowest |

**Limitation:** macOS lacks WebDriver support for WKWebView. E2E testing on macOS requires either Playwright against the dev server (misses native features) or manual testing.

**Recommended strategy:** Playwright for frontend-only E2E (covers 80% of UI logic). WebDriver on Linux CI for full desktop integration. Manual smoke tests on macOS before releases.

_Source: [Tauri WebDriver Testing](https://v2.tauri.app/develop/tests/webdriver/)_

### Testing AI/LLM Features

| Feature | Pattern | Tool |
|---------|---------|------|
| Streaming responses | Mock SSE server | VidaiMock, MSW |
| Agent workflows | State machine testing | XState test utilities |
| Tool calls | Record/replay | VCR-like patterns |
| Output quality | Snapshot + eval scoring | Custom evaluators |
| MCP integrations | Mock MCP server | stdio transport with fixtures |

**Agent testing insight (LangChain State of Agent Engineering 2026):**
- 89% of organisations use observability/tracing for agents
- 52.4% run offline evaluations on test sets
- Scenario-based testing with persona-driven conversations is the emerging standard

_Sources: [State of Agent Engineering](https://www.langchain.com/state-of-agent-engineering), [Test-Driven Agent Development](https://labs.lamatic.ai/p/test-driven-agent-development)_

---

## Deployment and Distribution

### Bundle Size and Performance

| Metric | Tauri | Electron |
|--------|-------|----------|
| Installer size | ~2.5 MB | ~85 MB |
| Idle memory | 30-40 MB | 200-300 MB |
| Launch time | <0.5s | 1-2s |
| Binary size | ~3 MB | 100+ MB |

_Source: [Tauri vs Electron: Real Trade-offs](https://www.gethopp.app/blog/tauri-vs-electron)_

### Code Signing

| Platform | Requirement | Cost |
|----------|------------|------|
| macOS | Apple Developer ID + notarisation | $99/year (Apple Developer Program) |
| Windows | EV or OV code signing certificate | $216-$288/year |
| Linux | Not required (package reputation) | Free |

**Critical change:** From February 23, 2026, all code signing certificates have a maximum validity of 459 days (down from multi-year).

_Sources: [Tauri macOS Signing](https://v2.tauri.app/distribute/sign/macos/), [Tauri Windows Signing](https://v2.tauri.app/distribute/sign/windows/)_

### Auto-Update

**tauri-plugin-updater** provides built-in auto-update with mandatory cryptographic signature verification.

| Feature | Status |
|---------|--------|
| Full app download | Supported |
| Delta/incremental updates | Not supported |
| Signature verification | Mandatory (cannot disable) |
| Sidecar updates | Bundled with main app |
| Update servers | GitHub Releases, self-hosted, CrabNebula Cloud |

**Update flow:** App checks update endpoint → receives JSON with version + URL + signature → downloads in background → verifies signature → applies on restart.

**CrabNebula Cloud** (official Tauri partner) provides managed distribution with auto-generated update metadata and built-in signing. Worth evaluating for reducing operational overhead.

_Source: [Tauri Updater Plugin](https://v2.tauri.app/plugin/updater/)_

### CI/CD Pipeline

**GitHub Actions with `tauri-apps/tauri-action`:**

```yaml
matrix:
  platform: [macos-latest, ubuntu-latest, windows-latest]
  include:
    - platform: macos-latest
      args: '--target universal-apple-darwin'
```

| Build Type | Time |
|-----------|------|
| Cached (Rust + Node) | 4-8 minutes |
| Uncached (fresh) | ~1 hour |

**Essential caching:** `swatinem/rust-cache@v2` for Rust target directory + cargo registry. Without this, every CI run rebuilds all Rust dependencies from scratch.

**Monorepo CI:** Turborepo skips unchanged packages automatically based on content hashing. Only the affected packages rebuild.

_Sources: [Tauri GitHub Actions](https://v2.tauri.app/distribute/pipelines/github/), [tauri-apps/tauri-action](https://github.com/tauri-apps/tauri-action)_

### Distribution Channels

| Channel | Platforms | Review Process | Best For |
|---------|-----------|---------------|----------|
| Direct download (website) | All | None | Maximum control, fastest iteration |
| GitHub Releases | All | None | Open source projects |
| CrabNebula Cloud | All | None | Managed Tauri distribution |
| Homebrew Cask | macOS | Community review | Developer audience |
| macOS App Store | macOS | Apple review (24-48h) | Consumer reach |
| Microsoft Store | Windows | Microsoft review (24-48h) | Windows discoverability |
| Flatpak / Snap | Linux | Varies | Linux package managers |

**Recommended for v0.1:** Direct download + GitHub Releases. Add Homebrew Cask when macOS users request it. App stores later if consumer reach matters.

_Source: [Tauri Distribute](https://v2.tauri.app/distribute/)_

---

## LLM Cost Modelling

### Current Pricing (February 2026)

| Provider | Model | Input/M | Output/M | Cached Input/M |
|----------|-------|---------|----------|----------------|
| Anthropic | Claude Opus 4.5 | $5.00 | $25.00 | $0.50 (90% off) |
| Anthropic | Claude Sonnet 4.5 | $3.00 | $15.00 | $0.30 |
| Anthropic | Claude Haiku 4.5 | $1.00 | $5.00 | $0.10 |
| OpenAI | GPT-4.1 | $2.00 | $8.00 | -- |
| OpenAI | GPT-4o | $2.50 | $10.00 | -- |
| Google | Gemini 2.5 Pro | $1.25 | $10.00 | -- |
| Google | Gemini 2.5 Flash | $0.30 | $2.50 | -- |
| Moonshot | Kimi K2 | $0.50 | $2.40 | $0.15 (75% off) |
| Zhipu | GLM-4.7 | ~$0.10 | ~$0.52 | -- |

**Batch processing:** Anthropic offers 50% discount on all tokens for batch API (24h processing window).

_Sources: [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing), [OpenAI Pricing](https://openai.com/api/pricing/), [Google Gemini Pricing](https://ai.google.dev/gemini-api/docs/pricing), [Kimi K2 Pricing](https://pricepertoken.com/pricing-page/model/moonshotai-kimi-k2)_

### Monthly Cost Estimates (50 Sessions/Month)

| Strategy | Monthly Cost | Notes |
|----------|-------------|-------|
| Opus-only | $120-240 | Premium reasoning for everything |
| Smart routing (Haiku 40% + Sonnet 40% + Opus 20%) | $30-60 | Best cost/performance balance |
| Smart routing + prompt caching | $10-25 | 90% cache hit on system prompts |
| Kimi K2 primary + Opus fallback | $15-40 | 76% cheaper than Anthropic-only |
| Free tier only (Gemini + local) | $0 | Hobbyist only, 30-40% capability |

**Biggest cost levers (in priority order):**
1. **Model routing** (60% savings): Haiku for simple tasks, Sonnet for medium, Opus for hard
2. **Prompt caching** (90% on cached tokens): Cache system instructions and codebase context
3. **Context optimisation** (40-60%): Send less context per request
4. **Batch processing** (50%): For non-time-sensitive operations

_Sources: [Anthropic Prompt Caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching), [AGENTS.md Token Optimization](https://smartscope.blog/en/generative-ai/claude/agents-md-token-optimization-guide-2026/)_

### Cost Display for Users

**Recommended pattern (from Cursor):**
1. Show estimated cost before API call (token count prediction)
2. Show actual cost after execution
3. Running total per session / day / month
4. Budget warnings when approaching user-defined limits
5. Per-agent cost attribution (which agent spent what)

The brainstorming session's "cost estimator at readiness gate" (C#3) maps directly to this -- estimate the API cost of Phase 4 (Build) before the user commits.

### Free Tier Reality Check

| Provider | Free Tier | Daily Limit | Viability |
|----------|-----------|-------------|-----------|
| Google Gemini | Yes | 100-1000 RPD (reduced Dec 2025) | Hobbyist only |
| Zhipu GLM | $3/mo lite plan | 120 prompts/month | Minimal |
| Moonshot Kimi | No free tier | N/A | Paid only (but cheap) |
| Anthropic | No free API tier | N/A | Subscription or API key |
| Local models (Ollama) | Free | Unlimited | Hardware-dependent, 1-2 gen behind |

**"Zero cost" stack is not viable for professional use.** Google's free tier was cut 50-80% in December 2025. Local models lack the reasoning capability needed for complex coding tasks. The realistic minimum is ~$10-25/month with smart routing and caching.

_Sources: [Gemini Free Tier Rate Limits](https://www.aifreeapi.com/en/posts/gemini-api-free-tier-rate-limits), [Local LLM Tools 2026](https://dev.to/lightningdev123/top-5-local-llm-tools-and-models-in-2026-1ch5)_

---

## Release Strategy

### v0.1 → v1.0 Layering (Refined from Brainstorming)

| Release | Ships | Proves | Estimated Effort |
|---------|-------|--------|-----------------|
| v0.1-alpha | Tauri shell + single chat + Anthropic provider | Tech works, talks to LLM | 4-6 weeks |
| v0.1-beta | + model routing + streaming + basic UI | Core UX works | 3-4 weeks |
| v0.2 | + Full 4-phase pipeline + Quick Flow | Complete thesis proven | 6-8 weeks |
| v0.3 | + Git worktree isolation + multi-agent | Parallel execution ships faster | 6-8 weeks |
| v0.4 | + Semantic code search (LanceDB + tree-sitter) | Context Intelligence makes agents smarter | 4-6 weeks |
| v0.5 | + MCP tool extensibility + 5 providers | Platform extensibility | 4-6 weeks |
| v1.0 | + Polish + visual brainstorming + viral demo | People want this | 4-6 weeks |

**Total estimated path to v1.0:** 8-12 months for a solo developer with AI tooling.

### Beta Distribution

| Platform | Tool | Capacity |
|----------|------|----------|
| macOS | TestFlight | 10,000 external testers |
| Windows / Linux | Loadly.io | Unlimited uploads/downloads |
| All platforms | GitHub Releases (pre-release tags) | Unlimited |

**Recommended:** GitHub Releases with pre-release tags for alpha/beta. Direct download link on a simple landing page. No app store submission until v1.0.

_Sources: [TestFlight](https://developer.apple.com/testflight/), [Loadly.io](https://loadly.io/)_

### Versioning Strategy

Use semver with update control:
- **Patch** (0.1.1): Bug fixes, auto-applied
- **Minor** (0.2.0): New features, backward-compatible, user notified
- **Major** (1.0.0): Breaking changes, manual update required

Users choose their update appetite: patch-only (conservative), patch+minor (recommended), all (early adopter).

### Feature Flags

**Unleash** (open-source) supports both Rust and TypeScript SDKs. Cache flag state locally for instant evaluation without network latency. Sync on app startup and every N hours.

Use feature flags to:
- Canary test new phases (e.g., enable Visual Brainstorming for 10% of users)
- A/B test UI approaches
- Disable broken features without a full release

_Source: [Unleash Feature Flags for Rust](https://docs.getunleash.io/feature-flag-tutorials/rust)_

---

## Risk Assessment and Mitigation

### Technical Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Bun native dependency failures (34%) | High | Test LanceDB + tree-sitter early. Fallback to Node.js if blocked. |
| WebView differences across platforms | Medium | Test on all 3 platforms in CI. Use Playwright for cross-browser CSS. |
| Rust compilation times (uncached ~1hr) | Medium | swatinem/rust-cache in CI. Keep Rust surface thin. |
| LLM API cost overruns | Medium | Model routing + prompt caching + budget limits with alerts. |
| Code signing cert changes (459-day limit) | Low | Calendar reminder for renewal. Automate signing in CI. |

### Solo Founder Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Burnout (limited nightly hours) | High | Strict scope per release. Quick Flow for small wins. Ship often. |
| Multi-technology maintenance (Rust + TS) | High | Keep Rust surface minimal (supervisor + keychain + sandbox only). |
| Dependency churn across 2 ecosystems | Medium | Renovate with semantic grouping. Manual approval for majors only. |
| No contributors (stealth mode) | Medium | Open-source at v0.2 (thesis proven). GitHub Discussions from day one. |
| Revenue model undefined | Medium | Zero-cost stack. GitHub Sponsors from launch. Revisit at traction. |

_Sources: [Renovate vs Dependabot](https://blog.pullnotifier.com/blog/dependabot-vs-renovate-dependency-update-tools), [Solo Builders Ship Faster](https://codecondo.com/solo-builders-shipping-faster-2026/)_

### AI Productivity Multipliers

| Tool | Best For | Measured Impact |
|------|----------|----------------|
| Claude Code | Architecture, complex logic, multi-file refactors | 30% less rework than alternatives |
| Cursor | Routine implementation, autocomplete, quick fixes | Faster short-term velocity |
| Combined | Use Claude Code for design, Cursor for typing | Estimated 2-3x solo dev throughput |

**Caution:** AI tools increase short-term velocity but can increase code complexity and technical debt. Use Claude Code's planning capabilities to mitigate this -- plan first, then generate.

_Sources: [Claude Code vs Cursor Comparison](https://northflank.com/blog/claude-code-vs-cursor-comparison), [Cowork vs Cursor vs Claude Code](https://brlikhon.engineer/blog/cowork-vs-cursor-vs-claude-code-the-ultimate-ai-coding-agent-battle-for-2026)_

---

## Sustainability Model

### Revenue Path

| Phase | Model | Expected Revenue |
|-------|-------|-----------------|
| Pre-launch | Zero cost. Free tool, free stack. | $0 |
| Launch (v1.0) | GitHub Sponsors + Open Collective | $500-5K/month (if community grows) |
| Traction | Open core (free base + paid team features) | $10K-100K/year |
| Scale | Commercial license for enterprise (dual-license) | Variable |

**Freemium conversion in developer tools:** Industry estimates 2-5% of free users convert to paid.

**When to incorporate:** When revenue exceeds $2K/month consistently or maintenance exceeds 20 hours/week.

_Sources: [How to Monetize Open Source](https://www.reo.dev/blog/monetize-open-source-software), [HeroDevs $20M OSS Fund](https://www.prnewswire.com/news-releases/herodevs-launches-20-million-sustainability-fund-for-open-source-creators-to-secure-end-of-life-software-302488703.html)_

### Community Building Strategy

| Channel | Purpose | When |
|---------|---------|------|
| GitHub Discussions | Canonical Q&A, searchable, AI-crawlable | From v0.2 (open-source) |
| Discord | Real-time chat, community feel | From v0.2 |
| GitHub Releases | Distribution, changelog | From v0.1-alpha |
| Twitter/LinkedIn | Announcements, viral moments | From v1.0 launch |

**Key insight:** GitHub Discussions content is indexed by search engines and AI systems. Discord conversations are not. Use Discussions as the knowledge base; Discord for synchronous chat.

_Sources: [Growing OSS Communities 2025](https://dev.to/axrisi/growing-your-open-source-community-in-2025-strategies-for-sustainable-projects-2lln), [Why Discord Sucks for Dev Communities](https://dev.to/bdbchgg/why-discord-sucks-for-developer-communities-2fg1)_

### License Trade-off (Research Finding vs Brainstorming Decision)

| License | Brainstorming Decision | Research Finding |
|---------|----------------------|-----------------|
| AGPL-3.0 | Chosen to prevent well-funded forks | Deters enterprise users; many corporates avoid AGPL entirely |
| MIT / Apache 2.0 | Rejected (fear of being outpaced) | Maximum adoption; dual-license for commercial protection |

**This is an unresolved tension.** The brainstorming session locked AGPL-3.0. The research suggests MIT + dual-license for commercial use achieves the same fork protection while enabling wider adoption. The decision depends on whether indie devs (who do not care about license) or enterprises (who avoid AGPL) are the priority audience.

---

## Implementation Roadmap Summary

| Priority | Action | Timeline |
|----------|--------|----------|
| 1 | Set up monorepo (pnpm + Turborepo + Tauri) | Week 1 |
| 2 | Tauri shell + Bun sidecar + single Anthropic provider | Weeks 2-4 |
| 3 | Streaming chat UI + model routing (Haiku/Sonnet/Opus) | Weeks 5-7 |
| 4 | CI/CD pipeline (GitHub Actions + tauri-action + Biome) | Week 8 |
| 5 | v0.1-alpha release (direct download) | Week 8-10 |
| 6 | 4-phase protocol + Quick Flow implementation | Weeks 11-18 |
| 7 | Open-source + GitHub Discussions + Discord | At v0.2 |
| 8 | Git worktree isolation + multi-agent | Weeks 19-26 |
| 9 | Context Intelligence (LanceDB + tree-sitter) | Weeks 27-32 |
| 10 | MCP extensibility + remaining providers | Weeks 33-38 |
| 11 | Polish + visual brainstorming + v1.0 launch | Weeks 39-44 |

## Technology Stack Recommendations

Based on all research across steps 2-5, the strongest signal points toward:

| Layer | Recommendation | Confidence | Key Reason |
|-------|---------------|-----------|------------|
| Runtime | **Bun** (with Node.js fallback plan) | 85% | Anthropic-backed, Claude Code proves sidecar pattern, but test LanceDB/tree-sitter first |
| UI Framework | **Decision needed** (React vs Svelte 5 vs SolidJS) | 70% | Trade-off: ecosystem (React) vs performance (SolidJS) vs DX (Svelte) |
| API Framework | **Hono + tRPC** | 92% | Multi-runtime + zero-codegen type safety |
| LLM SDK | **Vercel AI SDK v6** | 95% | Best provider coverage, MCP support, Chinese providers |
| Vector DB | **LanceDB** | 95% | Embedded, hybrid search, validated by Continue AI |
| Monorepo | **pnpm + Turborepo** | 92% | Fastest at CodeMAD scale, minimal config |
| Linting | **Biome** | 90% | 10-25x faster, zero deps, covers linting + formatting |
| Testing | **Vitest** (frontend) + **cargo test** (Rust) | 90% | Fastest, Vite-native |

## Success Metrics and KPIs

| Metric | Target | How to Measure |
|--------|--------|---------------|
| v0.1 time-to-ship | < 10 weeks | Calendar tracking |
| Bundle size | < 5 MB installer | CI artifact size check |
| Cold start time | < 1 second | Automated benchmark |
| LLM response latency (first token) | < 500ms | SSE timestamp tracking |
| API cost per session | < $0.50 average | Token counting + cost attribution |
| Cache hit rate | > 60% | Prompt cache analytics |
| Build time (CI, cached) | < 8 minutes | GitHub Actions timing |
| Test coverage (TypeScript) | > 80% | Vitest coverage report |
| Crash rate | < 1% of sessions | Sentry or equivalent |
