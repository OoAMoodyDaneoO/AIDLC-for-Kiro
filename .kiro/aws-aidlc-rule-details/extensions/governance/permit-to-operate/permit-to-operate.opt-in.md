# Permit to Operate (PTO) — Opt-In

**Extension**: Permit to Operate Artifact

## Opt-In Prompt

```markdown
## Question: Permit to Operate (PTO)
Does your enterprise require a Permit to Operate document to be approved before deploying to production? This typically covers technology stack, expected costs, support model, operating model, and production readiness sign-offs.

A) Yes — generate a PTO artifact at the end of the development cycle for technology function approval
B) No — skip PTO artifact generation
X) Other (please describe after [Answer]: tag below)

[Answer]: 
```

## Notes
- When opted in, a PTO artifact is generated after Build & Test completes (before Operations)
- The artifact is a customizable template — enterprises update sections to match their PTO requirements
- Consolidates technology decisions, cost projections, support model, operating model, security sign-off, and production readiness
- Hard gate — must be approved before any production deployment
- If PM tool sync is enabled, the PTO document is attached to the Epic
