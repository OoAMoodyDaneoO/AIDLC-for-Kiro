# Security Review Checkpoint — Opt-In

**Extension**: On-Demand Security Review & Vulnerability Assessment

## Opt-In Prompt

```markdown
## Question: Security Review Checkpoint
Should on-demand security review checkpoints be enabled for this project? This provides a manually-triggered capability to perform security assessments against OWASP Top 10, review authentication/authorization patterns, validate input handling, and generate remediation plans for identified vulnerabilities.

A) Yes — enable security review checkpoints with vulnerability assessment and remediation planning
B) No — skip security review checkpoints
X) Other (please describe after [Answer]: tag below)

[Answer]: 
```

## Notes
- When opted in, a manual hook is available to trigger security review at any point
- The review assesses code and design artifacts against OWASP Top 10, authentication/authorization patterns, input validation, secrets management, and dependency vulnerabilities
- Findings are reported with severity (Critical/High/Medium/Low), CVSS-style scoring, and remediation plans
- Review results are stored in `aidlc-docs/{feature-name}/construction/adrs/security-review-{YYYY-MM-DD}.md`
- If PM tool sync is enabled, Critical and High findings are pushed as issues/work items
