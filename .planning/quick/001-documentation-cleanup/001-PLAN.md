---
phase: quick-001
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - README.md
  - CONTRIBUTING.md
autonomous: true

must_haves:
  truths:
    - "README has no 'fork of OpenCode' references"
    - "README uses CodeMAD ASCII art from TUI"
    - "CONTRIBUTING.md references CodeMAD, not OpenCode"
    - "GitHub About section text is prepared for user"
  artifacts:
    - path: "README.md"
      provides: "Updated CodeMAD branding"
      contains: "CODE MAD"
    - path: "CONTRIBUTING.md"
      provides: "CodeMAD-specific contribution guide"
      contains: "CodeMAD"
---

<objective>
Remove all "fork of OpenCode" messaging from documentation and establish CodeMAD as an independent product identity.

Purpose: Position CodeMAD as a standalone AI development platform rather than a derivative project.
Output: Updated README.md, CONTRIBUTING.md, GitHub About text, and packages/docs audit.
</objective>

<execution_context>
@/Users/costantinomarcello/.claude/get-shit-done/workflows/execute-plan.md
@/Users/costantinomarcello/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update README.md with CodeMAD branding</name>
  <files>README.md</files>
  <action>
Update README.md with the following changes:

1. Replace the image/badge header with ASCII art from TUI (`packages/opencode/src/cli/logo.ts`):

```
 █▀▀▀ █▀▀█ █▀▀▄ █▀▀▀ █▄ ▄█ █▀▀█ █▀▀▄
 █    █  █ █  █ █▀▀▀ █ ▀ █ █▀▀█ █  █
 █▄▄▄ █▄▄█ █▄▄▀ █▄▄▄ █   █ █  █ █▄▄▀
```

Use a code block with no language tag to preserve monospace.

2. Remove the "A fork of OpenCode" line entirely.

3. Update "What is CodeMAD?" section:

- Remove "Built as a fork of OpenCode, it adds:" phrasing
- Rewrite as: "CodeMAD is an AI development platform with persistent project context and workflow orchestration."
- List features as native capabilities, not additions

4. In "Coming Soon" section:

- Remove "GSD methodology (Discuss, Plan, Execute, Verify)" - no methodology names
- Replace with "Structured workflow orchestration"

5. In Roadmap section:

- Remove "Phase 5: GSD Workflow" or rename to "Workflow Orchestration"

6. Update Acknowledgments section:

- Change from "CodeMAD is built on [OpenCode]..." to "CodeMAD incorporates code from [OpenCode](https://github.com/anomalyco/opencode) (MIT License)."
- Keep it factual, one sentence
  </action>
  <verify>grep -i "fork of" README.md should return empty; grep "CODE" README.md shows ASCII art</verify>
  <done>README has no fork references, uses ASCII branding, no methodology names</done>
  </task>

<task type="auto">
  <name>Task 2: Update CONTRIBUTING.md for CodeMAD</name>
  <files>CONTRIBUTING.md</files>
  <action>
Update CONTRIBUTING.md with the following changes:

1. Change title from "Contributing to OpenCode" to "Contributing to CodeMAD"

2. Update intro paragraph:

- "We want to make it easy for you to contribute to CodeMAD."

3. Update issue links (lines 17-21):

- Change base URL from `github.com/anomalyco/opencode` to `github.com/costantinomarcello/codemad`

4. Update section titles and references:

- "Developing OpenCode" -> "Developing CodeMAD"
- All "OpenCode" mentions in body text -> "CodeMAD"
- Keep references to `packages/opencode` directory as-is (it's the actual directory name)

5. Update "Understanding bun dev vs opencode":

- Mention both `codemad` (production) and `bun dev` (development)
- Update production examples from `opencode` to `codemad`

6. Update localcode section:

- Keep path as `packages/opencode` (actual path)
- Update binary name reference if mentioned

7. Keep all style preferences, debugging, PR guidelines - just rebrand names
   </action>
   <verify>grep -c "OpenCode" CONTRIBUTING.md returns 0 (except directory paths); grep "CodeMAD" CONTRIBUTING.md returns multiple matches</verify>
   <done>CONTRIBUTING.md fully rebranded to CodeMAD</done>
   </task>

<task type="auto">
  <name>Task 3: Prepare GitHub About section and audit packages/docs</name>
  <files>None (output only)</files>
  <action>
Create a summary output with two sections:

**GitHub About Section** (for user to manually update):
Prepare text for GitHub repository "About" section:

- Max ~350 chars
- Focus: AI development platform, web/desktop, context/memory, orchestration
- No methodology names (GSD, BMAD)
- No "fork of" language

Example format:
"AI development platform for web and desktop with persistent project memory, semantic code search, and multi-agent workflow orchestration. TypeScript/Bun + Tauri."

**packages/docs/ Audit:**
The packages/docs/README.md is a Mintlify documentation starter template.

- Purpose: Documentation site deployment via Mintlify
- Contains: Standard Mintlify quickstart, no project-specific content
- Recommendation: KEEP - required for docs site deployment, will be customized when docs are written
- No action needed now
  </action>
  <verify>Task output includes GitHub About text and audit summary</verify>
  <done>User has GitHub About text to copy; packages/docs understood</done>
  </task>

</tasks>

<verification>
- `grep -ri "fork of opencode" README.md CONTRIBUTING.md` returns empty
- README.md contains CodeMAD ASCII art
- CONTRIBUTING.md title is "Contributing to CodeMAD"
- No methodology names (GSD, BMAD) in README
</verification>

<success_criteria>

- All "fork of OpenCode" references removed from README and CONTRIBUTING
- CodeMAD positioned as independent product
- User has GitHub About section text ready to paste
- packages/docs audit complete with recommendation
  </success_criteria>

<output>
After completion, create `.planning/quick/001-documentation-cleanup/001-SUMMARY.md`
</output>
