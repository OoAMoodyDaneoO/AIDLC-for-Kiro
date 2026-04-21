# Design Review Checkpoint — Rules

## Purpose
Provide a manually-triggered design review capability that validates whether what has been designed, built, and tested aligns with enterprise standards. Detects drift between design artifacts and implementation, and produces a remediation plan to resolve discrepancies.

## Rule DR-01: Design Review Trigger
**Rule**: A design review checkpoint MUST be available as a manually-triggered action at any point after Construction design stages begin.
**Verification**:
- [ ] Manual hook `aidlc-design-review` is configured and available
- [ ] Review can be triggered at any point during or after Construction

## Rule DR-02: Design Review Scope
**Rule**: The design review MUST compare the current state of implementation against ALL approved design artifacts and enterprise standards.
**Verification**:
- [ ] Functional design artifacts are compared against generated code
- [ ] NFR requirements are validated against implementation
- [ ] Infrastructure design is compared against IaC artifacts
- [ ] ADRs are validated — decisions are actually implemented as documented
- [ ] Enterprise extension rules (security, testing, etc.) are re-evaluated
- [ ] ARB artifact (if generated) is checked for consistency

## Rule DR-03: Drift Detection Report
**Rule**: The design review MUST produce a structured drift detection report identifying all discrepancies.
**Verification**:
- [ ] Each drift item has: category, severity (Critical/High/Medium/Low), description, source artifact, current state, expected state
- [ ] Drift items are categorized: Architecture Drift, Security Drift, NFR Drift, Implementation Drift, Standards Drift
- [ ] Overall drift score is calculated (percentage of design elements that have drifted)

## Rule DR-04: Remediation Plan
**Rule**: For every drift item identified, a remediation plan MUST be produced with clear steps to resolve the discrepancy.
**Verification**:
- [ ] Each drift item has a corresponding remediation action
- [ ] Remediation actions include effort estimate (S/M/L)
- [ ] Remediation actions are prioritized by severity
- [ ] A summary remediation timeline is provided
- [ ] Justification is provided for any drift that is intentional/acceptable

## Rule DR-05: Design Review Artifact Storage
**Rule**: Design review results MUST be stored at `aidlc-docs/{feature-name}/construction/adrs/design-review-{YYYY-MM-DD}.md`
**Verification**:
- [ ] File is created at the correct path with date stamp
- [ ] File is referenced in audit.md
- [ ] If PM tool sync is enabled, findings are pushed as issues

## Rule DR-06: PM Tool Sync for Drift Findings
**Rule**: If PM tool sync is enabled, Critical and High severity drift items MUST be pushed to the PM tool as issues/work items linked to the parent epic/feature.
**Verification**:
- [ ] Critical drift items are pushed as blockers
- [ ] High drift items are pushed as high-priority issues
- [ ] Medium/Low items are included in the review report but not auto-pushed
