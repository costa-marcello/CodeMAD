---
quick: 002
type: execute
autonomous: true
files_modified:
  - SECURITY.md
  - packages/desktop/README.md
  - packages/slack/README.md
  - packages/opencode/src/acp/README.md
  - packages/containers/README.md
  - github/README.md
  - sdks/vscode/README.md
  - CONTRIBUTING.md
  - packages/app/README.md
---

<objective>
Fix remaining OpenCode references in documentation across all priority levels.

Purpose: Complete the rebranding from OpenCode to CodeMAD in all documentation files.
Output: 9 documentation files updated with consistent CodeMAD branding.
</objective>

<context>
@.planning/STATE.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update HIGH priority docs (SECURITY.md, desktop, slack)</name>
  <files>
    SECURITY.md
    packages/desktop/README.md
    packages/slack/README.md
  </files>
  <action>
  **SECURITY.md:**
  - Line 7: "OpenCode is an AI-powered..." -> "CodeMAD is an AI-powered..."
  - Line 13: "run OpenCode inside" -> "run CodeMAD inside"
  - Line 17: `OPENCODE_SERVER_PASSWORD` -> `CODEMAD_SERVER_PASSWORD`
  - Line 35: GitHub URL `anomalyco/opencode` -> `costantinomarcello/CodeMAD`
  - Line 41: Email `security@anoma.ly` -> `security@codemad.dev` (or appropriate contact)

**packages/desktop/README.md:**

- Line 1: "# OpenCode Desktop" -> "# CodeMAD Desktop"
- Line 3: "Native OpenCode desktop app" -> "Native CodeMAD desktop app"

**packages/slack/README.md:**

- Line 1: "@opencode-ai/slack" -> "@codemad/slack"
- Line 3: "for opencode" -> "for CodeMAD"
- Line 27: "opencode sessions" -> "CodeMAD sessions"
  </action>
  <verify>grep -r "OpenCode\|opencode\|anomalyco\|@opencode-ai" SECURITY.md packages/desktop/README.md packages/slack/README.md returns no matches</verify>
  <done>All HIGH priority docs use CodeMAD branding consistently</done>
  </task>

<task type="auto">
  <name>Task 2: Update MEDIUM priority docs (acp, containers, github, vscode)</name>
  <files>
    packages/opencode/src/acp/README.md
    packages/containers/README.md
    github/README.md
    sdks/vscode/README.md
  </files>
  <action>
  **packages/opencode/src/acp/README.md:**
  - Line 3: "for opencode" -> "for CodeMAD"
  - Line 39-45: CLI commands "opencode acp" -> "codemad acp"
  - Lines 57-67: Zed config - keep command as "opencode" for now (internal package name)
  - Lines 117,126,158: CLI references "opencode" -> "codemad" (user-facing)
  - Line 155: "to opencode's internal session" -> "to CodeMAD's internal session"

**packages/containers/README.md:**

- Lines 18-19: Registry `ghcr.io/anomalyco` -> `ghcr.io/costantinomarcello`
- Line 29: Container image path update

**github/README.md:**

- Line 1: "# opencode GitHub Action" -> "# CodeMAD GitHub Action"
- All "opencode" user-facing references -> "CodeMAD" or "codemad" (CLI)
- Line 3: URL "opencode.ai" -> appropriate CodeMAD URL
- Lines 5,11-43: Product name "opencode" -> "CodeMAD"
- Line 56: CLI "opencode github install" -> "codemad github install"
- Line 63,91: GitHub app URL `anomalyco/opencode` -> `costantinomarcello/CodeMAD`
- Lines 104,124,127,132: Issue/support URLs update
- Keep workflow trigger patterns `/oc` and `/opencode` for backward compat (comment in code)

**sdks/vscode/README.md:**

- Line 1: "# opencode VS Code Extension" -> "# CodeMAD VS Code Extension"
- All "opencode" user-facing references -> "CodeMAD" or "codemad"
- Line 3,7: URL "opencode.ai" -> appropriate CodeMAD URL
- Line 18: Issue URL `anomalyco/opencode` -> `costantinomarcello/CodeMAD`
  </action>
  <verify>grep -r "anomalyco\|opencode\.ai" packages/opencode/src/acp/README.md packages/containers/README.md github/README.md sdks/vscode/README.md returns no matches</verify>
  <done>All MEDIUM priority docs use CodeMAD branding</done>
  </task>

<task type="auto">
  <name>Task 3: Update LOW priority docs (CONTRIBUTING.md, app README)</name>
  <files>
    CONTRIBUTING.md
    packages/app/README.md
  </files>
  <action>
  **CONTRIBUTING.md:**
  - Line 51: Section heading "### Building a "localcode"" -> "### Building a local executable"
  - Verify no other OpenCode references remain (file was already rebranded in quick task 001)

**packages/app/README.md:**

- Line 34: "opencode backend" -> "CodeMAD backend" (in E2E Testing section)
  </action>
  <verify>grep -i "localcode\|opencode backend" CONTRIBUTING.md packages/app/README.md returns no matches</verify>
  <done>All LOW priority docs updated</done>
  </task>

</tasks>

<verification>
Run comprehensive check for remaining references:
```bash
grep -rn "OpenCode\|opencode\|anomalyco\|@opencode-ai" \
  SECURITY.md \
  packages/desktop/README.md \
  packages/slack/README.md \
  packages/opencode/src/acp/README.md \
  packages/containers/README.md \
  github/README.md \
  sdks/vscode/README.md \
  CONTRIBUTING.md \
  packages/app/README.md
```
Should return no matches (except intentional backward-compat patterns like workflow triggers).
</verification>

<success_criteria>

- All 9 documentation files updated
- No "OpenCode" product name references (case insensitive) in target files
- No anomalyco GitHub URLs
- No @opencode-ai package scope references
- Environment variables use CODEMAD\_ prefix
- CLI commands use "codemad" not "opencode"
  </success_criteria>

<output>
After completion, update `.planning/STATE.md` quick tasks table and create summary if needed.
</output>
