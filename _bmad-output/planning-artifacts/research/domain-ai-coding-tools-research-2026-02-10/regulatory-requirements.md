# Regulatory Requirements

## Applicable Regulations

**EU AI Act (Regulation 2024/1689)**

The EU AI Act is the most significant regulatory development affecting AI coding tools. Key dates and obligations:

| Milestone | Date | Impact on CodeMAD |
|-----------|------|-------------------|
| Prohibited AI practices banned | Feb 2, 2025 | No impact -- CodeMAD doesn't use prohibited categories |
| GPAI Code of Practice published | May 2, 2025 | Applies to model providers (Anthropic, OpenAI), not CodeMAD directly |
| Transparency obligations enforceable | Aug 2, 2026 | CodeMAD must disclose AI interactions and label AI-generated content |
| Full applicability (except some high-risk) | Aug 2, 2026 | General compliance required |
| High-risk product AI rules | Aug 2, 2027 | Likely not applicable unless CodeMAD is embedded in safety-critical systems |

_Classification:_ AI coding tools are likely "limited risk" under the AI Act, requiring transparency obligations but not high-risk compliance. CodeMAD must: (1) disclose to users that content is AI-generated, (2) not prevent illegal content generation, and (3) if training own models, publish summaries of copyrighted data used.

_Penalties:_ Up to 10M EUR or 2% of annual turnover for non-compliance with transparency obligations.

_Source: [SIG EU AI Act Summary](https://www.softwareimprovementgroup.com/blog/eu-ai-act-summary/), [Wilson Sonsini](https://www.wsgr.com/en/insights/2026-year-in-preview-ai-regulatory-developments-for-companies-to-watch-out-for.html)_

**US Regulatory Landscape**

No federal AI legislation comparable to the EU AI Act exists yet, but the landscape is evolving:

- Multiple US states are pursuing AI legislation (Colorado, California have advanced proposals)
- Executive orders on AI safety continue to shape expectations
- The FTC is actively investigating AI companies for unfair or deceptive practices
- No comprehensive federal framework expected before 2027

_Source: [Wilson Sonsini](https://www.wsgr.com/en/insights/2026-year-in-preview-ai-regulatory-developments-for-companies-to-watch-out-for.html)_

## Industry Standards and Best Practices

| Standard | Relevance | Required? |
|----------|-----------|-----------|
| **ISO/IEC 42001** | AI management system standard. Augment Code is the first AI coding assistant to achieve certification. | Voluntary, but becoming a competitive differentiator for enterprise sales |
| **SOC 2 Type II** | Security, availability, processing integrity, confidentiality, privacy. Standard for SaaS/cloud services. | Not required for desktop-first local tools, but relevant if CodeMAD adds cloud features |
| **OWASP Top 10** | Security baseline for web applications. CodeMAD's API server should follow these. | Industry best practice, effectively required |
| **SLSA (Supply-chain Levels for Software Artifacts)** | Framework for software supply chain integrity. | Increasingly expected for open source projects |

_Source: [Augment Code](https://www.augmentcode.com/tools/cursor-vs-windsurf-codeium-feature-and-price-guide)_

## Compliance Frameworks

**AI-Generated Code Copyright**

This is the most legally uncertain area affecting all AI coding tools:

- **US law:** Copyright requires human authorship. The D.C. Circuit affirmed in _Thaler v. Perlmutter_ that the Copyright Act "requires all eligible work to be authored in the first instance by a human being." Purely AI-generated code is not copyrightable.
- **AI-assisted code:** When human developers "substantially participate" in creation, copyright protection may still apply. The line between "AI-assisted" and "AI-generated" is not legally defined.
- **Licensing risk:** ~35% of AI-generated code samples contain licensing irregularities that could create legal liability. Code trained on open source may reproduce licensed snippets without attribution.
- **Platform policies:** Major platforms (OpenAI, Anthropic, Google) contractually assign output rights to users, but this is a contractual right, not a copyright -- users cannot prevent others from copying purely AI-generated code.
- **Practical mitigation:** Document human contributions, enforce review processes, maintain audit trails. CodeMAD's protocol-driven approach (human decisions at each phase) strengthens the "substantial human participation" argument.

_Source: [MBHB](https://www.mbhb.com/intelligence/snippets/navigating-the-legal-landscape-of-ai-generated-code-ownership-and-liability-challenges/), [Congress.gov](https://www.congress.gov/crs-product/LSB10922), [AIMultiple](https://research.aimultiple.com/generative-ai-copyright/)_

**Key implication for CodeMAD:** The four-phase protocol with interactive decision gates creates a documented chain of human authorship at each stage. This is stronger IP protection than "vibe coding" tools where AI generates code with minimal human input.

## Data Protection and Privacy

**GDPR (EU/EEA)**

| Requirement | CodeMAD Impact | Compliance Path |
|-------------|---------------|-----------------|
| Lawful basis for processing | Must have legal basis if processing personal data | CodeMAD processes code, not personal data by default. If telemetry is added, consent required. |
| Data minimisation | Collect only what's necessary | Desktop-first, local storage. No telemetry by default. |
| Right to erasure | Users can request data deletion | All data is local -- users control their own data. |
| Data Protection Impact Assessment | Required for high-risk processing | Likely not required for local-first tool, but recommended if cloud sync added. |
| Cross-border transfers | Restrictions on data leaving EU/EEA | API calls to US-based LLM providers send code snippets cross-border. Users choose their provider. |

_Enforcement context:_ 2,679 GDPR fines totalling over 6.7B EUR as of December 2025.
_Source: [SecurePrivacy](https://secureprivacy.ai/blog/gdpr-compliance-2026), [CookieScript](https://cookie-script.com/news/data-privacy-trends-2026)_

**CCPA/CPRA (California)**

Similar principles to GDPR. Key differences: applies to businesses meeting revenue/data thresholds, opt-out model rather than opt-in. Record fines exceeded $1.3M in 2025 with joint state investigations.

_Source: [SecurePrivacy](https://secureprivacy.ai/blog/ccpa-requirements-2026-complete-compliance-guide)_

**CodeMAD's privacy advantage:** Desktop-first, local storage, no proxy servers, direct API calls to user-chosen providers. This design is inherently GDPR-friendly. The "zero proxy" architecture is both a feature and a compliance advantage. The only privacy concern is code snippets sent to LLM providers -- but users explicitly choose this, and CodeMAD doesn't add its own data collection layer.

## Licensing and Certification

**AGPL-3.0 Licensing (CodeMAD's chosen license)**

| Obligation | Description | Impact |
|------------|-------------|--------|
| Source code disclosure | Any modifications served over a network must be open-sourced under AGPL | Prevents proprietary forks from offering CodeMAD as a service without sharing code |
| Copyleft propagation | Derivative works must use AGPL | Protects against well-funded competitors taking the code proprietary |
| Network use trigger | Unlike GPL, AGPL triggers on network interaction, not just distribution | If someone builds a hosted CodeMAD service, they must open-source their changes |
| API separation strategy | Separate components communicating via APIs may avoid copyleft propagation | Allows CodeMAD to integrate with proprietary LLM providers without licensing conflict |

_Enterprise concern:_ Some enterprises avoid AGPL software due to compliance complexity. This was noted as a medium-severity unresolved risk in brainstorming (Attack Vector 3). The counter: CodeMAD's beachhead market is indie developers and small teams, not AGPL-averse enterprises.

_Source: [Vaultinum](https://vaultinum.com/blog/essential-guide-to-agpl-compliance-for-tech-companies), [OpenObserve](https://openobserve.ai/blog/what-are-apache-gpl-and-agpl-licenses-and-why-openobserve-moved-from-apache-to-agpl/)_

**Desktop Distribution Requirements**

| Platform | Requirement | Cost | Notes |
|----------|-------------|------|-------|
| **macOS** | Code signing + notarisation (mandatory since Catalina) | $99/year Apple Developer Program | Unsigned apps cannot run. Free accounts cannot notarise. Tauri supports this natively. |
| **Windows** | EV Code Signing Certificate | ~$200-500/year from a CA | Not strictly mandatory but unsigned apps trigger SmartScreen warnings |
| **Linux** | No code signing requirement | Free | AppImage, Flatpak, or .deb distribution |

_Critical constraint from memory:_ Code signing cert validity max 459 days from Feb 23, 2026. Must be renewed before expiry.

_Source: [Tauri macOS signing](https://v2.tauri.app/distribute/sign/macos/), [Tauri distribution](https://v2.tauri.app/distribute/)_

## Implementation Considerations

1. **EU AI Act transparency:** Add a clear disclosure in the UI that code is AI-generated. This is low-effort and required by August 2026. The protocol's phase-by-phase approach naturally documents what AI generated vs what the user decided.

   **[RECONCILIATION - Feb 10, 2026]:** Flagged as critical architecture requirement. Must be addressed in the architecture document.

2. **Copyright protection strategy:** CodeMAD's four-phase protocol with human decision gates at brainstorming, architecture, and readiness checkpoints creates a stronger "substantial human participation" argument than any competitor. Document this in the product's messaging.

   **[RECONCILIATION - Feb 10, 2026]:** Flagged as critical architecture requirement. Must be addressed in the architecture document.

3. **Privacy by design:** The desktop-first, local-storage, no-telemetry architecture is already privacy-compliant. Maintain this as a competitive advantage. If telemetry is added later, implement opt-in consent.

4. **AGPL management:** Keep the AGPL boundary clear. LLM provider integrations communicate via APIs (separate process), which avoids copyleft propagation to proprietary provider SDKs.

5. **Code signing budget:** Allocate ~$300/year for Apple Developer Program + Windows EV cert. Must be in place before first public release.

## Risk Assessment

| Risk | Severity | Likelihood | Mitigation |
|------|----------|-----------|------------|
| EU AI Act non-compliance (transparency) | Medium | Low | Implement disclosure labels by Aug 2026 |
| AI-generated code copyright challenge | High | Medium | Protocol creates human authorship chain; document this |
| AGPL enterprise adoption friction | Medium | Medium | Target indie devs first; consider dual-licensing later |
| GDPR complaint from EU user | Low | Low | Architecture is already privacy-friendly; no personal data processed by default |
| Code signing failure at launch | High | Low | Budget for certs early; test signing pipeline before release |
| AI-generated code contains licensed snippets | Medium | Medium | Code review agent should check for license violations; consider SCA tooling |
