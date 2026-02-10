# Security Architecture and Plugin Patterns for AI Coding Tools (2026)

**Research Date:** February 2026
**Focus Areas:** Permission models, sandboxing, plugin architecture, credential management, code generation safety

---

## 1. Permission and Sandboxing Models for AI Coding Tools

### 1.1 Claude Code Sandbox Implementation

**File System Permissions:**
- Default write access limited to current working directory and subdirectories
- Default read access to entire computer except denied directories
- Bash tool enforces filesystem isolation by preventing modification of files outside current working directory
- Network isolation through proxy server running outside sandbox with domain restrictions

**Security Metrics:**
- Internal usage shows 84% reduction in permission prompts through sandboxing
- Four main tool types: Bash Commands (with exact matches or wildcards), Read/Edit (file access), Web Fetch (website access)

**Key Features:**
- Filesystem and network boundaries prevent unauthorized access
- User confirmation required for new domain requests
- Platform support: macOS, Linux, WSL2

**Reference:** [Sandboxing - Claude Code Docs](https://code.claude.com/docs/en/sandboxing)
**Deep Dive:** [Making Claude Code More Secure and Autonomous - Anthropic Engineering](https://www.anthropic.com/engineering/claude-code-sandboxing)

---

### 1.2 Cursor IDE Agent Sandboxing

**Architecture:**
- Supports macOS and Linux sandboxing for agents
- Access scoped to workspace with configurable network and filesystem blocking
- Server-side parser requires explicit user approval for unclassified commands

**Security Improvements (Jan 2026):**
- Vulnerability remediation focusing on command classification
- Enterprise controls including Linux sandboxing and service accounts
- Cursor Hooks enable custom enforcement logic at key execution points:
  - Before MCP execution
  - After agent command execution

**Known Limitations:**
- No reliable whitelist mechanism for commands
- Agent can still execute destructive commands (e.g., `rm -rf`) inside workspace despite restrictions

**Reference:** [Terminal - Cursor Docs](https://cursor.com/docs/agent/terminal)
**Security Analysis:** [The Agent Security Paradox - Pillar Security](https://www.pillar.security/blog/the-agent-security-paradox-when-trusted-commands-in-cursor-become-attack-vectors)

---

### 1.3 Devin AI Sandbox Architecture

**Execution Environment:**
- Sandboxed environment with shell, editor, and browser capabilities
- Ephemeral runtimes destroyed after each task to prevent credential persistence
- Multi-step task execution with integrated development tools

**Permission Model:**
- Start with read-only access, escalate to write-only when necessary
- Use narrowly-scoped personal access tokens (PATs) for GitHub
- Human review required before merging agent-generated code

**Best Practices for Integration:**
- Least-privilege GitHub scopes
- Confirm test/lint commands before merge
- CI pipeline enforces checks before production

**Reference:** [Devin by Cognition AI FAQ](https://skywork.ai/blog/devin-cognition-ai-faq-autonomous-ai-software-engineer/)
**Security Guidance:** [Practical Security Guidance for Sandboxing Agentic Workflows - NVIDIA](https://developer.nvidia.com/blog/practical-security-guidance-for-sandboxing-agentic-workflows-and-managing-execution-risk/)

---

## 2. Tauri 2.x Security Model (Capability-Based Permissions)

### 2.1 Core Architecture

**Trust Boundaries:**
- Rust-based core application code (high trust)
- WebView frontend code (lower trust)
- IPC layer as security boundary between frontend and backend

**Capability System:**
- Capabilities define which permissions granted/denied for windows or webviews
- Mapped to app windows and webviews by label
- Enables window-based privilege separation

**Key Design Principle:**
Isolate frontend vulnerabilities in less-privileged windows by limiting capability grants.

### 2.2 Permissions and IPC Commands

**Permission Model:**
- Explicit privileges defined per command
- Maps scopes to commands
- Enables/disables command accessibility in frontend

**Implementation Pattern:**
```
Capability (collection of permissions)
  ├── Command 1 (enabled)
  ├── Command 2 (enabled with scope constraints)
  └── Command 3 (denied)
```

**Scope Definition:**
- Permissions reference other permissions by identifier
- Allows extending scope with allow/deny data
- Defines what is allowed or forbidden

### 2.3 Content Security Policy (CSP)

- WebView CSP configuration restricts script execution
- Prevents inline script vulnerabilities
- Works in conjunction with capability system

**Reference:** [Capabilities - Tauri](https://v2.tauri.app/security/capabilities/)
**Plugin Patterns:** [Using Plugin Permissions - Tauri](https://v2.tauri.app/learn/security/using-plugin-permissions/)

---

## 3. Plugin Architecture Patterns for AI Tools

### 3.1 VS Code Extension Model

**Architecture:**
- Extensions run in separate Extension Host processes (Node.js runtimes)
- Isolated from main renderer and core processes
- Each host handles extension execution and IPC communication

**Isolation Benefits:**
- Misbehaving extensions cannot crash main VS Code
- Extensions have own memory space
- VS Code manages lifecycle independently

**Critical Limitation:**
- All extensions in single Extension Host share global object space
- Global Node.js APIs (fs, http, child_process) not compartmentalized per extension
- Extensions can monkey-patch or proxy other extensions' behavior

**Trust Boundaries:**
- Workspace, extension publisher, MCP server, network domain
- Explicit user consent required for certain actions

**Reference:** [Extension Runtime Security - VS Code](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security)

---

### 3.2 MCP (Model Context Protocol) Security Isolation

**Three-Layer Architecture:**
1. **Host Application** - Handles user input
2. **MCP Client** - Manages available capabilities
3. **MCP Servers** - Expose tools and resources via standard interface

**Isolation Techniques:**
- **Protocol-Level Boundaries:** Host and servers communicate only via MCP protocol
- **Runtime Isolation:** Containerization, sandboxing, privilege isolation
- **Proxy-Mediated Communication:** All interactions routed through trusted proxy
- **Default Deny Model:** Explicit policy enforcement at protocol layer

**Windows 11 Implementation:**
- Declarative capabilities limit blast radius
- Centralized policy enforcement with authentication/authorization
- Consent management at proxy layer

**Multi-Layer Security Pattern:**
- Network isolation
- Authentication (identity verification)
- Authorization (permission checking)
- Input validation
- Output sanitization

**Reference:** [Security Best Practices - MCP](https://modelcontextprotocol.io/specification/draft/basic/security_best_practices)
**Policy Enforcement:** [Model Context Protocol (MCP) Security - Kong Inc.](https://konghq.com/blog/engineering/mcp-tool-governance-security-meets-context-efficiency)

---

### 3.3 Plugin Marketplace and Registry Patterns

**VS Code Marketplace Security:**

**Publisher Trust Model:**
- Publisher identity required in package.json
- Verified badge for domain-verified publishers (6+ month requirement)
- Signature verification on all extensions

**Automated Scanning:**
1. Malware scanning using multiple antivirus engines
2. Secrets detection (API keys, credentials) blocks publishing
3. Dynamic runtime detection in sandboxed VMs
4. Code integrity verification

**User Trust Controls:**
- Confirmation dialog on first install from third-party publisher (VS Code 1.97+)
- Clear security status display

**Enterprise Alternative:**
- Private Marketplace allows air-gapped distribution
- Open-source option: code-marketplace project
- Curated, reviewed extension delivery

**Reference:** [Extension Marketplace - VS Code](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace)
**Security Details:** [Security and Trust in Visual Studio Marketplace](https://developer.microsoft.com/blog/security-and-trust-in-visual-studio-marketplace)
**Supply Chain Risks:** [Supply Chain Risk in VSCode Extension Marketplaces - Wiz](https://www.wiz.io/blog/supply-chain-risk-in-vscode-extension-marketplaces)

---

### 3.4 Plugin Lifecycle Management

**Standard Lifecycle Stages:**

| Event | Timing | Purpose |
|-------|--------|---------|
| PreInstall | Before files installed | Setup requirements |
| PostInstall | After files installed | Initialize plugin |
| PreUpdate | Before update applied | Backup/migrate data |
| PostUpdate | After update applied | Complete update |
| PreUninstall | Before files removed | Cleanup data |
| PostUninstall | After files removed | Final cleanup |

**Enable/Disable Events:**
- PluginModuleEnabledEvent - Modules activated
- PluginEnabledEvent - Plugin fully activated
- PluginDisabledEvent - Plugin deactivated
- PluginModuleDisabledEvent - Modules deactivated

**Key Principle:** Each transition triggers events for dependent systems to respond.

**Reference:** [Plugin Lifecycle Methods - Shopware](https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.html)

---

## 4. Secure Credential Management in Desktop Apps

### 4.1 OS-Level Credential Storage

**macOS Keychain:**
- Native credential storage integrated with OS
- Supports passkey synchronization via iCloud Keychain
- Deep OS integration for seamless access

**Windows Credential Manager:**
- Native credential storage for Windows
- Passkey support integrated across devices via Microsoft accounts
- Credential persistence across sessions

**Linux Secret Service:**
- D-Bus-based credential storage
- Fragmented landscape with multiple implementations
- Hardware-backed authentication limited compared to macOS/Windows

**Cross-Platform Abstraction:**
- Libraries like zalando/go-keyring abstract OS differences
- Enable unified credential storage API across platforms

**Reference:** [Windows Credential Manager and macOS Keychain - Packt](https://subscription.packtpub.com/book/security/9781838828868/10/ch10lvl1sec89/windows-credential-manager-and-macos-keychain)
**Current Gap:** [The Linux Credential Crisis - WebProNews](https://www.webpronews.com/the-linux-credential-crisis-why-your-desktop-still-cant-match-windows-and-macos-for-secure-authentication)

---

### 4.2 Multi-Provider LLM API Key Management

**Problem Statement:**
- AI tools support 5+ LLM providers (OpenAI, Anthropic, Google, local models, etc.)
- Static API keys pose security risks
- Manual key rotation is error-prone

**Solution Patterns:**

**1. Centralized LLM Gateway:**
- Single interface to 180+ models
- Real-time cost tracking
- Provider switching without code changes
- Examples: LLM Gateway, LiteLLM

**2. OAuth 2.0 with OIDC Tokens:**
- OpenID Connect ID token issuance
- Temporary API key generation based on token
- Short expiration periods
- Avoids static key storage

**3. AI Gateway with Credential Manager:**
- Azure API Management approach
- OAuth authorization for AI apps
- Centralized credential management
- Integration with identity providers

**Desktop Implementation:**
- CLI tool initiates OAuth flow
- Single command obtains OIDC ID token
- Automatic LLM API key retrieval
- Works with Google Workspace or enterprise IdP

**Reference:** [Authenticate and Authorize to LLM APIs - Microsoft Learn](https://learn.microsoft.com/en-us/azure/api-management/api-management-authenticate-authorize-ai-apis)
**Modern Approach:** [Securing AI Agents Without Secrets - Aembit](https://aembit.io/blog/securing-ai-agents-without-secrets/)
**API Credential Anti-Pattern:** [API Keys Are a Bad Idea - Christian Posta](https://blog.christianposta.com/api-keys-are-a-bad-idea-for-enterprise-llm-agent-and-mcp-access)

---

### 4.3 Credential Rotation and Expiry Handling

**Refresh Token Rotation Best Practice:**
- Automatic refresh of expired access tokens
- New refresh token issued with each access token refresh
- Old tokens immediately invalidated
- Limits compromise window

**Short-Lived Credential Strategy:**
- Key expiration every few hours/days
- Ephemeral access at runtime
- Immediate expiration after use

**Centralized Management:**
- Single location for all agent API keys
- Automatic rotation without manual intervention
- Instant revocation capability
- Lifecycle tracking through agent retirement

**Monitoring and Alerting:**
- Track API error rates (4xx, 5xx)
- Monitor p95/p99 latencies for tool calls
- Alert on token refresh failures
- Flag anomalies: spikes in 401 errors indicate credential issues

**Reference:** [Secure AI Agent Infrastructure Guide - Composio](https://composio.dev/blog/secure-ai-agent-infrastructure-guide)
**Identity Focus:** [Securing AI Agents 101 - SailPoint](https://www.sailpoint.com/identity-library/securing-ai-agents)

---

## 5. Code Generation Safety Patterns

### 5.1 OWASP-Aware Code Generation

**Vulnerability Classes to Prevent:**

| Vulnerability | Prevention Strategy | Example |
|---------------|-------------------|---------|
| SQL Injection | Prepared statements, parameterized queries, ORM tools | Use `.execute()` with parameters, not string concatenation |
| XSS (Cross-Site Scripting) | HTML encoding, Content Security Policy | Encode user input before DOM insertion |
| CSRF (Cross-Site Request Forgery) | CSRF tokens, SameSite cookies | Validate token on state-changing requests |
| Injection (Command, LDAP, OS) | Avoid interpreter, use safe APIs | Never pass user input to shell commands |

**Generative Best Practices:**
- Follow OWASP Top 10:2025 principles
- Adhere to OWASP ASVS (Application Security Verification Standard) requirements
- Apply input validation and sanitization
- Use prepared statements for all database queries
- Employ strict Content Security Policies for web code

**Reference:** [OWASP Top 10:2025 - Injection](https://owasp.org/Top10/2025/A05_2025-Injection/)
**LLM Prompt Injection:** [LLM Prompt Injection Prevention - OWASP](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
**AI Code Guidelines:** [Security-Focused Guide for AI Code Assistant Instructions - OpenSSF](https://best.openssf.org/Security-Focused-Guide-for-AI-Code-Assistant-Instructions)

---

### 5.2 Automated Security Scanning of Generated Code

**Vulnerability Statistics:**
- 40% of AI-generated code contains vulnerabilities (SQL injection, XSS, weak auth)
- Makes robust scanning more critical than ever

**Semgrep (Rule-Based SAST):**

**Strengths:**
- Extensible, developer-friendly SAST platform
- Highly customizable rule sets
- Extensive community rules library
- Organization-specific pattern creation
- 10x faster vulnerability resolution

**Capabilities:**
- AI-assisted SAST (static code analysis)
- SCA (Software Composition Analysis)
- Secrets detection

**Approach:** Pattern matching with low false-positive rate

**Reference:** [Semgrep Code - Static Application Security Testing](https://semgrep.dev/products/semgrep-code/)

---

**Snyk Code (ML-Based SAST):**

**Strengths:**
- Trained on millions of open-source repositories
- Effective at detecting patterns in AI-generated code
- Real-time scanning capabilities
- Comprehensive developer integration
- Machine-learning approach finds subtle vulnerabilities

**Capabilities:**
- AI-assisted code scanning
- SCA with machine-learning prioritization
- Secrets detection

**Approach:** ML models detect vulnerability patterns

**Reference:** [Snyk AI Security Fabric](https://snyk.io/)

---

**Comparison:**
| Factor | Semgrep | Snyk |
|--------|---------|------|
| **Approach** | Rule-based pattern matching | ML-trained models |
| **Customization** | High (custom rules) | Medium (preset rules) |
| **False Positives** | Lower | Medium |
| **AI Code Detection** | Good | Excellent |
| **Integration** | Wide (CI/CD, IDE, IDE) | Comprehensive |
| **Cost Model** | Freemium/Enterprise | SaaS only |

**Reference:** [2025 AI Code Security Benchmark - sanj.dev](https://sanj.dev/post/ai-code-security-tools-comparison)

---

### 5.3 Supply Chain Security for AI-Generated Dependencies

**Threat Landscape:**
- 43 agent framework components compromised via supply chain attacks (Barracuda Security)
- Model backdoors: behaviors embedded during training, triggered by specific inputs
- Attacks target popular open-source agent frameworks

**Defense Strategies:**

**1. Software Bill of Materials (SBOM) Scanning:**
- Scan all agent frameworks
- Monitor models and dependencies
- Track known CVEs

**2. Continuous Dependency Scanning:**
- Monitor third-party libraries for vulnerabilities
- Detect embedded threats
- Evaluate ML frameworks for backdoors

**3. Vulnerability Assessment:**
- Known CVEs in dependencies
- Backdoors in open-source models
- Compliance with organizational policies

**4. AI-Assisted Remediation:**
- Automated fix generation
- Autonomous remediation workflows
- Keep supply chain secure without slowing delivery

**Emerging Tool Categories:**

**Endor Labs:**
- AI agents + deep program analysis
- Reason about dataflow and business logic
- Enterprise-scale dependency analysis

**Agentic AI Scanners:**
- Package metadata analysis
- Security posture evaluation
- Policy compliance checking
- Autonomous remediation

**Reference:** [Agentic Software Supply Chain Security - JFrog](https://jfrog.com/blog/agentic-software-supply-chain-security-ai-assisted-curation-remediation/)
**Supply Chain Risks:** [Exploiting Trust in Open-Source AI - Trend Micro](https://www.trendmicro.com/vinfo/us/security/news/cybercrime-and-digital-threats/exploiting-trust-in-open-source-ai-the-hidden-supply-chain-risk-no-one-is-watching)

---

## 6. Comparative Summary Table

| Dimension | Claude Code | Cursor | Devin | Tauri 2.x | VS Code Ext |
|-----------|------------|--------|-------|----------|-----------|
| **File Access** | Scoped to workspace | Workspace scoped | Limited to project | IPC-gated | Per-extension |
| **Command Execution** | Sandboxed bash | Sandboxed with approval | Shell in ephemeral env | None (desktop app) | Via IPC only |
| **Network Access** | Proxy-controlled | Configurable blocking | Via ephemeral runtime | IPC-controlled | Plugin-dependent |
| **User Approval** | Per-action | Command classification | Per-merge | Per-capability | Per-permission |
| **Isolation Level** | OS-level process | OS sandbox + server checks | Docker container | IPC boundary | Process isolation |
| **Credential Storage** | Via IDE settings | IDE-managed | Ephemeral/env vars | App-managed | Per-extension access |

---

## 7. Key Recommendations for Implementation

### Permission Model Design
1. **Default Deny:** Require explicit approval for all powerful operations
2. **Principle of Least Privilege:** Grant only necessary permissions to each component
3. **Window-Based Scoping:** Separate windows by privilege level (Tauri pattern)
4. **User Transparency:** Show clear rationale for permission requests

### Sandboxing Strategy
1. **Multi-Layer Boundaries:** Filesystem + network + process isolation
2. **Runtime Ephemeral:** Destroy execution environments after task completion
3. **Scope Limitation:** Workspace-first approach, expandable only with confirmation
4. **Monitoring:** Log all permission uses for audit trails

### Plugin Architecture
1. **Process Isolation:** Run plugins in separate processes (VS Code pattern)
2. **Capability-Based Access:** Define fine-grained permissions (Tauri pattern)
3. **Security Scanning:** Malware, secrets, and runtime detection before distribution
4. **Marketplace Verification:** Signed extensions with publisher trust model

### Credential Management
1. **OS Keychain Integration:** Use native credential stores (macOS Keychain, Windows Credential Manager)
2. **OAuth 2.0 + OIDC:** Prefer token-based auth over static API keys
3. **Centralized Gateway:** Single point for multi-provider LLM access
4. **Automatic Rotation:** Refresh tokens on schedule, invalidate expired credentials immediately

### Code Generation Safety
1. **Pre-Generation Validation:** Train models on secure coding patterns
2. **Post-Generation Scanning:** Automated SAST (Semgrep/Snyk) on all generated code
3. **Dependency Analysis:** SBOM scanning and continuous vulnerability monitoring
4. **Approval Workflows:** Manual review before production deployment

---

## 8. References (All Sources)

### Claude Code & Sandboxing
- [Sandboxing - Claude Code Docs](https://code.claude.com/docs/en/sandboxing)
- [Making Claude Code More Secure and Autonomous - Anthropic Engineering](https://www.anthropic.com/engineering/claude-code-sandboxing)
- [Complete Guide to Claude Code Permissions - EESEL](https://www.eesel.ai/blog/claude-code-permissions)

### Cursor IDE
- [Terminal - Cursor Docs](https://cursor.com/docs/agent/terminal)
- [The Agent Security Paradox - Pillar Security](https://www.pillar.security/blog/the-agent-security-paradox-when-trusted-commands-in-cursor-become-attack-vectors)
- [Oasis x Cursor: Governing Agentic Execution - Oasis Security](https://www.oasis.security/blog/cursor-oasis-governing-agentic-access)

### Devin AI
- [Devin by Cognition AI FAQ](https://skywork.ai/blog/devin-cognition-ai-faq-autonomous-ai-software-engineer/)
- [Practical Security Guidance for Sandboxing Agentic Workflows - NVIDIA](https://developer.nvidia.com/blog/practical-security-guidance-for-sandboxing-agentic-workflows-and-managing-execution-risk/)

### Tauri 2.x
- [Capabilities - Tauri](https://v2.tauri.app/security/capabilities/)
- [Permissions - Tauri](https://v2.tauri.app/security/permissions/)
- [Using Plugin Permissions - Tauri](https://v2.tauri.app/learn/security/using-plugin-permissions/)

### VS Code Extensions
- [Extension Runtime Security - VS Code](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security)
- [Extension Marketplace - VS Code](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace)
- [Security and Trust in Visual Studio Marketplace](https://developer.microsoft.com/blog/security-and-trust-in-visual-studio-marketplace)
- [Supply Chain Risk in VSCode Extension Marketplaces - Wiz](https://www.wiz.io/blog/supply-chain-risk-in-vscode-extension-marketplaces)

### MCP (Model Context Protocol)
- [Security Best Practices - MCP](https://modelcontextprotocol.io/specification/draft/basic/security_best_practices)
- [Model Context Protocol (MCP) Security - Kong Inc.](https://konghq.com/blog/engineering/mcp-tool-governance-security-meets-context-efficiency)
- [Understanding Security Risks and Controls - RedHat](https://www.redhat.com/en/blog/model-context-protocol-mcp-understanding-security-risks-and-controls)
- [Securing MCP: Windows Proxy Approach - Windows Experience Blog](https://blogs.windows.com/windowsexperience/2025/05/19/securing-the-model-context-protocol-building-a-safer-agentic-future-on-windows)

### Credential Management
- [Windows Credential Manager and macOS Keychain - Packt](https://subscription.packtpub.com/book/security/9781838828868/10/ch10lvl1sec89/windows-credential-manager-and-macos-keychain)
- [The Linux Credential Crisis - WebProNews](https://www.webpronews.com/the-linux-credential-crisis-why-your-desktop-still-cant-match-windows-and-macos-for-secure-authentication)
- [Authenticate and Authorize to LLM APIs - Microsoft Learn](https://learn.microsoft.com/en-us/azure/api-management/api-management-authenticate-authorize-ai-apis)
- [Securing AI Agents Without Secrets - Aembit](https://aembit.io/blog/securing-ai-agents-without-secrets/)
- [API Keys Are a Bad Idea - Christian Posta](https://blog.christianposta.com/api-keys-are-a-bad-idea-for-enterprise-llm-agent-and-mcp-access)
- [Secure AI Agent Infrastructure Guide - Composio](https://composio.dev/blog/secure-ai-agent-infrastructure-guide)
- [Securing AI Agents 101 - SailPoint](https://www.sailpoint.com/identity-library/securing-ai-agents)

### Code Generation & Security Scanning
- [OWASP Top 10:2025 - Injection](https://owasp.org/Top10/2025/A05_2025-Injection/)
- [LLM Prompt Injection Prevention - OWASP](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
- [Security-Focused Guide for AI Code Assistant Instructions - OpenSSF](https://best.openssf.org/Security-Focused-Guide-for-AI-Code-Assistant-Instructions)
- [OWASP LLM Top 10: Code Generation - Sonar](https://www.sonarsource.com/resources/library/owasp-llm-code-generation/)
- [AI Agent Security - OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)
- [2025 AI Code Security Benchmark - sanj.dev](https://sanj.dev/post/ai-code-security-tools-comparison)
- [Semgrep Code - Static Application Security Testing](https://semgrep.dev/products/semgrep-code/)
- [Snyk AI Security Fabric](https://snyk.io/)
- [Semgrep vs Snyk Comparison - Semgrep](https://semgrep.dev/resources/semgrep-vs-snyk/)

### Supply Chain Security
- [Agentic Software Supply Chain Security - JFrog](https://jfrog.blog/agentic-software-supply-chain-security-ai-assisted-curation-remediation/)
- [Exploiting Trust in Open-Source AI - Trend Micro](https://www.trendmicro.com/vinfo/us/security/news/cybercrime-and-digital-threats/exploiting-trust-in-open-source-ai-the-hidden-supply-chain-risk-no-one-is-watching)
- [Endor Labs - AI-Native Application Security Platform](https://www.endorlabs.com)
- [Top Agentic AI Security Threats in 2026 - Stellar Cyber](https://stellarcyber.ai/learn/agentic-ai-securiry-threats)

---

**Document Status:** Complete research synthesis with 40+ authoritative sources
**Last Updated:** February 2026
