# Security Review Checkpoint — Rules

## Purpose
Provide a manually-triggered on-demand security review capability that assesses code and design artifacts against security best practices, OWASP Top 10, and enterprise security standards. Detects vulnerabilities, misconfigurations, and security anti-patterns, and produces a remediation plan to resolve findings.

## Rule SR-01: Security Review Trigger
**Rule**: A security review checkpoint MUST be available as a manually-triggered action at any point after Construction design stages begin.
**Verification**:
- [ ] Manual hook `aidlc-security-review` is configured and available
- [ ] Review can be triggered at any point during or after Construction
- [ ] Review can also be triggered via the extension UI "Run Security Review" button

## Rule SR-02: Security Review Scope
**Rule**: The security review MUST assess the current state of implementation and design artifacts against the following security domains.
**Verification**:
- [ ] OWASP Top 10 assessment (injection, broken auth, sensitive data exposure, XXE, broken access control, security misconfiguration, XSS, insecure deserialization, known vulnerabilities, insufficient logging)
- [ ] Authentication and authorization patterns reviewed
- [ ] Input validation and output encoding assessed
- [ ] Secrets management reviewed (no hardcoded secrets, proper vault usage)
- [ ] Dependency vulnerability scan (known CVEs in dependencies)
- [ ] API security reviewed (rate limiting, CORS, authentication)
- [ ] Data protection assessed (encryption at rest/in transit, PII handling)
- [ ] Infrastructure security reviewed (IAM policies, network segmentation, least privilege)
- [ ] Error handling and logging reviewed (no sensitive data in logs/errors)
- [ ] Session management assessed (token handling, expiry, rotation)

## Rule SR-03: Security Findings Report
**Rule**: The security review MUST produce a structured findings report identifying all security issues.
**Verification**:
- [ ] Each finding has: ID (SR-{feature}-{NNN}), category, severity (Critical/High/Medium/Low), description, affected component, evidence, remediation
- [ ] Findings are categorized by OWASP Top 10 category or security domain
- [ ] Each finding includes a CVSS-style severity assessment
- [ ] Overall security posture score is calculated (percentage of checks passing)
- [ ] Executive summary with risk assessment is provided

### Finding Structure
```markdown
### SR-{feature}-{NNN}: {Title}
- **Category**: {OWASP category or security domain}
- **Severity**: {Critical/High/Medium/Low}
- **CVSS Score**: {0.0-10.0}
- **Affected Component**: {file path or component name}
- **Description**: {What the vulnerability is}
- **Evidence**: {Code snippet or configuration showing the issue}
- **Impact**: {What could happen if exploited}
- **Remediation**: {Specific steps to fix}
- **Effort**: {S/M/L}
- **References**: {CWE/CVE/OWASP links}
```

## Rule SR-04: Remediation Plan
**Rule**: For every finding identified, a remediation plan MUST be produced with clear steps, priority ordering, and effort estimates.
**Verification**:
- [ ] Each finding has a corresponding remediation action
- [ ] Remediation actions include effort estimate (S/M/L)
- [ ] Remediation actions are prioritized: Critical first, then High, Medium, Low
- [ ] A summary remediation timeline is provided
- [ ] Quick wins (low effort, high impact) are highlighted
- [ ] Justification is provided for any accepted risks

## Rule SR-05: Security Review Artifact Storage
**Rule**: Security review results MUST be stored at `aidlc-docs/{feature-name}/construction/adrs/security-review-{YYYY-MM-DD}.md`
**Verification**:
- [ ] File is created at the correct path with date stamp
- [ ] File is referenced in audit.md
- [ ] If PM tool sync is enabled, findings are pushed as issues

## Rule SR-06: PM Tool Sync for Security Findings
**Rule**: If PM tool sync is enabled, Critical and High severity findings MUST be pushed to the PM tool as issues/work items linked to the parent epic/feature.
**Verification**:
- [ ] Critical findings are pushed as blockers
- [ ] High findings are pushed as high-priority issues
- [ ] Medium/Low findings are included in the review report but not auto-pushed
- [ ] Each pushed finding includes remediation steps as sub-tasks

## Rule SR-07: Security Review vs Design Review
**Rule**: Security review is complementary to design review, not a replacement. Design review focuses on architectural drift; security review focuses on vulnerability assessment.
**Verification**:
- [ ] Security review does not duplicate design review drift detection
- [ ] Security review focuses exclusively on security concerns
- [ ] Both reviews can be triggered independently
- [ ] Combined findings can be viewed in the governance dashboard
