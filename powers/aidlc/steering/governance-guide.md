# Enterprise Governance Guide

## Extensions (all opt-in)

### ARB Artifact
- **When**: After design, before Code Gen (hard gate)
- **Produces**: `construction/adrs/arb-submission.md`
- **Sections**: Executive Summary, Requirements, Architecture, Tech Stack, Infrastructure, Security, ADRs, Risk, Cost, Migration, Operational Readiness, Checklist

### Permit to Operate (PTO)
- **When**: After Build & Test, before Operations (hard gate)
- **Produces**: `operations/permit-to-operate.md`
- **Sections**: Solution Overview, Technology Stack, Expected Costs (3-year TCO), Support Model (L1/L2/L3), Operating Model, Security Sign-Off, Test Evidence, Production Readiness Checklist

### Design Review
- **When**: Manual trigger anytime
- **Produces**: `construction/adrs/design-review-{date}.md`
- **Detects**: Architecture, Security, NFR, Implementation, Standards drift with severity ratings and remediation plans

### Test Evidence & RCA
- **When**: During Build & Test and on test file modifications
- **Rules**: Every test run produces evidence doc. Failed tests require RCA before modification. Test weakening requires justification.

### Build Path Selection
- **When**: Before Code Gen
- **Options**: Prototype First (minimal happy-path tool) or Enterprise-Grade Build
- **Vibe feedback**: Prototype changes analyzed for gaps against requirements

### PM Tool Integration
- **Supports**: Jira, ADO, Linear, GitHub Issues
- **Hierarchy**: Epic → Feature/Story → User Story → Sub-task → Bug
- **Sync**: Push at every approval gate, pull on manual trigger

### Security Review & AI Compliance
- Manual trigger for vulnerability assessment and responsible AI review
