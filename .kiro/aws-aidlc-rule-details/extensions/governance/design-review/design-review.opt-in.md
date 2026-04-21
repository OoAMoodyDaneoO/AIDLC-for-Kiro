# Design Review Checkpoint — Opt-In

**Extension**: Design Review & Drift Detection

## Opt-In Prompt

```markdown
## Question: Design Review Checkpoint
Should automated design review checkpoints be enabled for this project? This provides a manually-triggered capability to validate that what has been designed, built, and tested aligns with enterprise standards, detect drift, and generate remediation plans.

A) Yes — enable design review checkpoints with drift detection and remediation planning
B) No — skip design review checkpoints
X) Other (please describe after [Answer]: tag below)

[Answer]: 
```

## Notes
- When opted in, a manual hook is available to trigger design review at any point
- The review compares current implementation against approved design artifacts
- Drift is reported with severity, impact assessment, and a remediation plan
- Review results are stored in `aidlc-docs/{feature-name}/construction/adrs/design-review-{timestamp}.md`
- If PM tool sync is enabled, review findings are pushed as issues/work items
