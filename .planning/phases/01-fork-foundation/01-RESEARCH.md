# Phase 1: Fork Foundation - Research

**Researched:** 2026-01-30
**Domain:** Electron/Tauri Desktop App Forking, LLM Provider Integration, Chinese AI APIs
**Confidence:** HIGH

## Summary

Phase 1 involves forking OpenCode (anomalyco/opencode) to create CodeMAD with Chinese LLM provider support. OpenCode is a mature, MIT-licensed TypeScript monorepo using Bun workspaces, Tauri 2.x for desktop, and the Vercel AI SDK for provider abstraction. The fork strategy is straightforward due to clear separation of concerns in the codebase.

The three Chinese LLM providers (Kimi K2.5, GLM 4.7, MiniMax M2.1) all support OpenAI-compatible APIs, significantly simplifying integration. Two providers (Zhipu/GLM and MiniMax) already have community AI SDK packages; only Moonshot/Kimi requires a new provider package. All three use API key authentication as primary method; OAuth is emerging but not mature for any.

**Primary recommendation:** Use `@ai-sdk/openai-compatible` pattern for all three Chinese providers. Configure via OpenCode's existing provider system rather than deep code modifications.

## Standard Stack

The established libraries/tools for this phase:

### Core (Inherited from OpenCode)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Bun | Latest | Runtime, package manager | OpenCode's chosen runtime |
| Turbo | Latest | Monorepo build orchestration | Already configured |
| Tauri 2.x | 2.x | Desktop shell | Already implemented |
| SolidJS | Latest | UI framework | OpenCode's UI library |
| Hono | 4.10.7 | HTTP server | Internal API server |
| AI SDK | 6.x | LLM abstraction | Provider integration |

### Chinese Provider Packages
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `zhipu-ai-provider` | Latest | GLM 4.7 integration | Already exists, npm install |
| `vercel-minimax-ai-provider` | Latest | MiniMax M2.1 integration | Already exists, npm install |
| `@ai-sdk/openai-compatible` | Latest | Moonshot/Kimi K2.5 | Build custom provider |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `rcedit` | Latest | Windows exe metadata | Rebrand Windows build |
| `@electron/asar` | If needed | Asset packaging | Only if Electron fallback |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom Moonshot provider | OpenRouter | Extra dependency, latency, cost |
| Direct API calls | AI SDK | Lose streaming, tool calling abstractions |
| Fork AI SDK providers | Use existing | Maintenance burden vs community |

**Installation:**
```bash
bun add zhipu-ai-provider vercel-minimax-ai-provider @ai-sdk/openai-compatible
```

## Architecture Patterns

### OpenCode Repository Structure
```
packages/
├── opencode/           # CLI + HTTP server (Hono) - BRANDING HERE
├── sdk/js/             # TypeScript SDK
├── plugin/             # Tool interface
├── util/               # Shared utilities
├── ui/                 # Component library (SolidJS) - UI BRANDING
├── app/                # Frontend logic (SolidJS)
├── desktop/            # Tauri wrapper - TAURI BRANDING
├── web/                # Astro docs site - DOCS BRANDING
└── console/            # Admin interface
sdks/
└── vscode/             # VS Code extension - EXTENSION BRANDING
```

### Pattern 1: Provider Configuration via opencode.json
**What:** Add Chinese providers through configuration, not code changes
**When to use:** When provider supports OpenAI-compatible API
**Example:**
```json
{
  "provider": {
    "moonshot": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Moonshot AI (Kimi)",
      "options": {
        "baseURL": "https://api.moonshot.cn/v1",
        "apiKey": "{env:MOONSHOT_API_KEY}"
      },
      "models": {
        "kimi-k2.5": {
          "name": "Kimi K2.5",
          "limit": {
            "context": 256000,
            "output": 128000
          }
        },
        "kimi-k2.5-thinking": {
          "name": "Kimi K2.5 (Thinking)",
          "limit": {
            "context": 256000,
            "output": 128000
          }
        }
      }
    },
    "zhipu": {
      "npm": "zhipu-ai-provider",
      "name": "Zhipu AI (GLM)",
      "options": {
        "baseURL": "https://open.bigmodel.cn/api/paas/v4",
        "apiKey": "{env:ZHIPU_API_KEY}"
      },
      "models": {
        "glm-4.7": {
          "name": "GLM 4.7",
          "limit": {
            "context": 200000,
            "output": 128000
          }
        },
        "glm-4.7-flash": {
          "name": "GLM 4.7 Flash",
          "limit": {
            "context": 200000,
            "output": 128000
          }
        }
      }
    },
    "minimax": {
      "npm": "vercel-minimax-ai-provider",
      "name": "MiniMax",
      "options": {
        "baseURL": "https://api.minimax.io/anthropic/v1",
        "apiKey": "{env:MINIMAX_API_KEY}"
      },
      "models": {
        "minimax-m2.1": {
          "name": "MiniMax M2.1",
          "limit": {
            "context": 200000,
            "output": 65536
          }
        }
      }
    }
  }
}
```
Source: [OpenCode Providers Documentation](https://opencode.ai/docs/providers/)

### Pattern 2: Branding Touchpoints
**What:** Locations requiring name/logo changes for rebrand
**When to use:** All forking scenarios

| Location | File(s) | What to Change |
|----------|---------|----------------|
| Package name | All `package.json` | `name` field |
| CLI binary | `packages/opencode/package.json` | `bin` field |
| Tauri app | `packages/desktop/tauri.conf.json` | `productName`, `identifier` |
| Window title | `packages/desktop/tauri.conf.json` | `title` |
| App icons | `packages/desktop/icons/` | All icon files |
| About page | `packages/app/src/` | About component |
| Docs site | `packages/web/` | All branding references |
| README | Root `README.md` | Project name/description |

### Pattern 3: Auth Storage Pattern
**What:** How OpenCode stores provider credentials
**When to use:** Understanding auth flow for new providers

```
~/.local/share/opencode/auth.json
{
  "provider_id": {
    "apiKey": "...",
    "bearerToken": "..."  // Optional, for OAuth
  }
}
```

Precedence (highest first):
1. Bearer token from auth.json
2. Config file options (opencode.json)
3. Environment variables (PROVIDER_API_KEY)

### Anti-Patterns to Avoid
- **Hardcoding provider URLs:** Use config, not code. Chinese providers have regional endpoints.
- **Single auth method:** Support both API key AND OAuth from day one.
- **Modifying core provider code:** Use configuration; core changes complicate upstream merging.
- **Ignoring regional endpoints:** China vs global API bases differ (e.g., api.minimax.io vs api.minimaxi.com).

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OpenAI-compatible provider | Custom HTTP client | `@ai-sdk/openai-compatible` | Handles streaming, tool calling, retries |
| GLM integration | Direct API calls | `zhipu-ai-provider` | Already handles JWT auth, thinking mode |
| MiniMax integration | Direct API calls | `vercel-minimax-ai-provider` | Anthropic format already implemented |
| Desktop rebranding | Edit binaries | Tauri config + rebuild | Proper signing, metadata |
| Icon generation | Manual resize | Icon generators | Multi-resolution consistency |

**Key insight:** All three Chinese providers support OpenAI-compatible APIs. The complexity is in auth, streaming, and thinking modes - all handled by AI SDK abstractions.

## Common Pitfalls

### Pitfall 1: Regional API Endpoint Confusion
**What goes wrong:** API calls fail with auth errors or 404s
**Why it happens:** Chinese providers have separate global and China endpoints
**How to avoid:**
- Moonshot: `platform.moonshot.ai` (global) vs `platform.moonshot.cn` (China)
- Zhipu: `z.ai` (international) vs `open.bigmodel.cn` (China)
- MiniMax: `api.minimax.io` (global) vs `api.minimaxi.com` (China)
**Warning signs:** "Invalid API key" errors when key is correct

### Pitfall 2: Zhipu JWT Token Format
**What goes wrong:** Auth fails despite correct API key
**Why it happens:** Zhipu API key format is `{id}.{secret}`, can use directly as Bearer OR generate JWT
**How to avoid:** Use `zhipu-ai-provider` which handles this automatically
**Warning signs:** 401 errors mentioning token format

### Pitfall 3: Tauri productName vs Package Name
**What goes wrong:** App shows wrong name in menus, Activity Monitor
**Why it happens:** Tauri uses Cargo.toml package name in some places, tauri.conf.json in others
**How to avoid:** Update BOTH Cargo.toml `[package] name` AND tauri.conf.json `productName`
**Warning signs:** "OpenCode" appearing in macOS Activity Monitor after rebrand

### Pitfall 4: OAuth Not Ready for Chinese Providers
**What goes wrong:** Planning OAuth integration that doesn't exist yet
**Why it happens:** Assuming parity with Claude/OpenAI OAuth
**How to avoid:** Implement API key first, OAuth as future enhancement
**Warning signs:** Can't find OAuth documentation for Chinese providers

### Pitfall 5: npm Package Name Collisions
**What goes wrong:** Can't publish due to name taken
**Why it happens:** "codemad" or similar might be taken
**How to avoid:** Check npm registry before committing to name; use scoped packages (@codemad/*)
**Warning signs:** `npm publish` fails with 403

### Pitfall 6: Bun Workspace Resolution
**What goes wrong:** New provider packages not found
**Why it happens:** Bun workspace configuration doesn't include new packages
**How to avoid:** Add new packages to root `package.json` workspaces array
**Warning signs:** "Cannot find module" during build

## Code Examples

Verified patterns from official sources:

### Creating Moonshot/Kimi Provider with AI SDK
```typescript
// Source: https://ai-sdk.dev/providers/openai-compatible-providers/custom-providers
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

export const moonshot = createOpenAICompatible({
  name: 'moonshot',
  baseURL: 'https://api.moonshot.cn/v1',
  headers: {
    Authorization: `Bearer ${process.env.MOONSHOT_API_KEY}`,
  },
});

// Usage
import { generateText } from 'ai';
const { text } = await generateText({
  model: moonshot('kimi-k2.5'),
  prompt: 'Explain quantum computing',
});
```

### Using Existing Zhipu Provider
```typescript
// Source: https://ai-sdk.dev/providers/community-providers/zhipu
import { zhipu } from 'zhipu-ai-provider';

// Default uses ZHIPU_API_KEY env var
const { text } = await generateText({
  model: zhipu('glm-4.7'),
  prompt: 'Write a function to sort an array',
});

// Custom configuration for Z.AI international endpoint
import { createZhipu } from 'zhipu-ai-provider';
const zhipuIntl = createZhipu({
  baseURL: 'https://api.z.ai/api/paas/v4',
  apiKey: process.env.ZAI_API_KEY,
});
```

### Using MiniMax Provider
```typescript
// Source: https://ai-sdk.dev/providers/community-providers/minimax
import { minimax } from 'vercel-minimax-ai-provider';

// Uses MINIMAX_API_KEY env var
const { text } = await generateText({
  model: minimax('MiniMax-M2.1'),
  prompt: 'Refactor this code for better performance',
});
```

### Tauri Branding Configuration
```json
// Source: https://v2.tauri.app/develop/configuration-files/
// packages/desktop/tauri.conf.json
{
  "productName": "CodeMAD",
  "identifier": "com.codemad.app",
  "bundle": {
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  },
  "app": {
    "windows": [
      {
        "title": "CodeMAD"
      }
    ]
  }
}
```

### OpenCode Provider Registration
```typescript
// Source: https://opencode.ai/docs/providers/
// How OpenCode dynamically loads providers
// packages/opencode/src/provider/loader.ts pattern

import { BunProc } from '../util/bun-proc';

async function loadProvider(config: ProviderConfig) {
  // Dynamic package installation to ~/.cache/opencode/
  await BunProc.install(config.npm);

  // Import and configure
  const pkg = await import(config.npm);
  return pkg.createProvider?.(config.options) ?? pkg.default;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom HTTP for each LLM | AI SDK unified abstraction | 2024-2025 | Use AI SDK, not raw fetch |
| Electron desktop | Tauri 2.x | 2025 | 10x smaller bundles |
| Hardcoded providers | Dynamic provider loading | OpenCode 1.x | Add providers via config |
| Single auth method | auth.json multi-method | OpenCode 1.x | API key + OAuth support |

**Deprecated/outdated:**
- Direct Anthropic/OpenAI HTTP calls: Use AI SDK instead
- Electron for new desktop apps: Tauri is lighter, faster
- `opencode-ai/opencode` (archived Go version): Use `anomalyco/opencode` TypeScript version

## API Quick Reference

### Moonshot/Kimi K2.5
| Property | Value |
|----------|-------|
| API Base (Global) | `https://api.moonshot.cn/v1` |
| API Base (China) | `https://api.moonshot.cn/v1` |
| Auth | Bearer token (API key) |
| Format | OpenAI-compatible |
| Context Window | 256K tokens |
| Max Output | 128K tokens |
| Pricing | $0.60/M input, $3.00/M output |
| Special Modes | Thinking (reasoning_content), Instant |

### Zhipu GLM 4.7
| Property | Value |
|----------|-------|
| API Base (Global) | `https://api.z.ai/api/paas/v4` |
| API Base (China) | `https://open.bigmodel.cn/api/paas/v4` |
| Auth | Bearer token (format: `{id}.{secret}`) |
| Format | OpenAI-compatible |
| Context Window | 200K tokens |
| Max Output | 128K tokens |
| Special Features | Extended reasoning (thinking parameter) |
| SDK Package | `zhipu-ai-provider` |

### MiniMax M2.1
| Property | Value |
|----------|-------|
| API Base (Global) | `https://api.minimax.io/anthropic/v1` or `/v1` (OpenAI) |
| API Base (China) | `https://api.minimaxi.com/anthropic/v1` |
| Auth | Bearer token (API key) |
| Format | Anthropic-compatible (default) or OpenAI-compatible |
| Parameters | 230B total, 10B activated |
| Pricing | ~$0.30/M input, ~$1.20/M output |
| SDK Package | `vercel-minimax-ai-provider` |

## Open Questions

Things that couldn't be fully resolved:

1. **OAuth Timeline for Chinese Providers**
   - What we know: All three support API keys; OAuth is requested but not fully implemented
   - What's unclear: When/if Moonshot, Zhipu, MiniMax will offer consumer OAuth
   - Recommendation: Ship with API key auth; add OAuth when available

2. **Moonshot AI SDK Community Provider**
   - What we know: No existing `@ai-sdk/moonshot` package found
   - What's unclear: If one exists under different name or is in development
   - Recommendation: Build minimal provider using `@ai-sdk/openai-compatible`

3. **OpenCode Upstream Merge Strategy**
   - What we know: OpenCode is actively developed (daily commits)
   - What's unclear: How to structure fork to enable clean upstream merges
   - Recommendation: Minimize core code changes; use config overrides where possible

4. **Chinese Provider Rate Limits**
   - What we know: Basic pricing documented
   - What's unclear: Exact rate limits, concurrency limits, retry policies
   - Recommendation: Implement conservative retry with exponential backoff; document limits as discovered

## Sources

### Primary (HIGH confidence)
- [OpenCode GitHub Repository](https://github.com/anomalyco/opencode) - Repo structure, MIT license
- [OpenCode Documentation](https://opencode.ai/docs/) - Configuration, providers, models
- [DeepWiki: anomalyco/opencode](https://deepwiki.com/anomalyco/opencode) - Architecture analysis
- [AI SDK Documentation](https://ai-sdk.dev/) - Provider creation, OpenAI-compatible
- [Zhipu AI Provider (npm)](https://ai-sdk.dev/providers/community-providers/zhipu) - Package docs
- [MiniMax AI Provider (npm)](https://ai-sdk.dev/providers/community-providers/minimax) - Package docs
- [Tauri Configuration](https://v2.tauri.app/develop/configuration-files/) - Desktop branding

### Secondary (MEDIUM confidence)
- [Moonshot Platform Docs](https://platform.moonshot.ai/docs/guide/kimi-k2-5-quickstart) - API reference
- [Zhipu BigModel Platform](https://open.bigmodel.cn/dev/api/http-call/http-auth) - Auth format
- [MiniMax Platform Docs](https://platform.minimax.io/docs/guides/models-intro) - Model specs
- [Kimi CLI GitHub Issue #757](https://github.com/MoonshotAI/kimi-cli/issues/757) - OAuth discussion

### Tertiary (LOW confidence - verify before using)
- WebSearch results for pricing and context windows (may be outdated)
- Community blog posts on Chinese AI providers

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified against OpenCode repo and AI SDK docs
- Architecture: HIGH - Verified via DeepWiki and official docs
- Chinese provider APIs: MEDIUM - Official docs exist but OAuth status uncertain
- Branding locations: HIGH - Verified via OpenCode repo structure
- Pitfalls: MEDIUM - Combination of official docs and community reports

**Research date:** 2026-01-30
**Valid until:** 2026-02-28 (30 days - stable domain, active development)
