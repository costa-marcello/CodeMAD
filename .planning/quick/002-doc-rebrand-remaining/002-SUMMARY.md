# Quick Task 002: Documentation Rebrand Remaining - Summary

Complete rebrand of 9 documentation files from OpenCode to CodeMAD branding.

## Results

| Task | Name                    | Commit    | Files Modified                                                          |
| ---- | ----------------------- | --------- | ----------------------------------------------------------------------- |
| 1    | HIGH priority docs      | 36b71fdc3 | SECURITY.md, packages/desktop/README.md, packages/slack/README.md       |
| 2    | MEDIUM priority docs    | 650aac0aa | packages/opencode/src/acp/README.md, packages/containers/README.md, github/README.md, sdks/vscode/README.md |
| 3    | LOW priority docs       | 2b39f3cce | CONTRIBUTING.md, packages/app/README.md                                 |

## Changes Made

### Task 1: HIGH Priority Docs

**SECURITY.md:**
- "OpenCode is an AI-powered..." -> "CodeMAD is an AI-powered..."
- "run OpenCode inside" -> "run CodeMAD inside"
- "OpenCode does **not** sandbox" -> "CodeMAD does **not** sandbox"
- `OPENCODE_SERVER_PASSWORD` -> `CODEMAD_SERVER_PASSWORD`
- GitHub URL: `anomalyco/opencode` -> `costantinomarcello/CodeMAD`
- Email: `security@anoma.ly` -> `security@codemad.dev`

**packages/desktop/README.md:**
- "# OpenCode Desktop" -> "# CodeMAD Desktop"
- "Native OpenCode desktop app" -> "Native CodeMAD desktop app"

**packages/slack/README.md:**
- "@opencode-ai/slack" -> "@codemad/slack"
- "for opencode" -> "for CodeMAD"
- "opencode sessions" -> "CodeMAD sessions"

### Task 2: MEDIUM Priority Docs

**packages/opencode/src/acp/README.md:**
- "for opencode" -> "for CodeMAD"
- CLI commands: `opencode acp` -> `codemad acp`
- Zed config: "OpenCode" -> "CodeMAD", command `opencode` -> `codemad`
- "opencode's bash tool" -> "CodeMAD's bash tool"
- "Mapping to OpenCode" -> "Mapping to CodeMAD"
- "opencode's internal session" -> "CodeMAD's internal session"

**packages/containers/README.md:**
- Registry: `ghcr.io/anomalyco` -> `ghcr.io/costantinomarcello`

**github/README.md:**
- "# opencode GitHub Action" -> "# CodeMAD GitHub Action"
- Product name references: "opencode" -> "CodeMAD"
- URL: `opencode.ai` -> `codemad.dev`
- CLI: `opencode github install` -> `codemad github install`
- GitHub app URL: `github.com/apps/opencode-agent` -> `github.com/apps/codemad-agent`
- Issues URL: `anomalyco/opencode` -> `costantinomarcello/CodeMAD`
- Workflow action: `anomalyco/opencode/github@latest` -> `costantinomarcello/CodeMAD/github@latest`
- Kept `/opencode` trigger pattern for backward compatibility (commented in YAML)

**sdks/vscode/README.md:**
- "# opencode VS Code Extension" -> "# CodeMAD VS Code Extension"
- All user-facing "opencode" -> "CodeMAD"
- URL: `opencode.ai` -> `codemad.dev`
- Issues URL: `anomalyco/opencode` -> `costantinomarcello/CodeMAD`

### Task 3: LOW Priority Docs

**CONTRIBUTING.md:**
- "### Building a 'localcode'" -> "### Building a local executable"

**packages/app/README.md:**
- "opencode backend" -> "CodeMAD backend"

## Intentional Remaining References

The following `opencode` references are intentional and not errors:

1. **Backward-compatible triggers** (github/README.md): `/opencode` command triggers kept for existing users
2. **Internal package paths** (CONTRIBUTING.md): `packages/opencode` directory references (internal structure)
3. **Commit scope** (CONTRIBUTING.md): `chore(opencode):` scope for opencode package changes
4. **Mock payloads** (github/README.md): Example MOCK_EVENT bodies showing user commands

## Verification

All problematic references removed:
- No `anomalyco` GitHub URLs
- No `@opencode-ai` package scope references
- No `opencode.ai` URLs
- Environment variables use `CODEMAD_` prefix
- User-facing CLI commands use `codemad`

## Execution Metrics

- **Duration:** ~12 minutes
- **Completed:** 2026-01-30
- **Tasks:** 3/3
