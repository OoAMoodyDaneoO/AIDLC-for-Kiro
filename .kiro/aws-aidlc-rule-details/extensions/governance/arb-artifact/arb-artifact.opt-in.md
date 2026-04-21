# Architecture Review Board (ARB) Artifact — Opt-In

**Extension**: ARB Artifact Generation

## Opt-In Prompt

```markdown
## Question: Architecture Review Board (ARB) Artifact
Does your enterprise require an Architecture Review Board submission at the end of the design phase?

A) Yes — generate an ARB artifact at the end of the design phase for submission to the Architecture Review Board
B) No — skip ARB artifact generation
X) Other (please describe after [Answer]: tag below)

[Answer]: 
```

## Notes
- When opted in, an ARB artifact is generated after all Construction design stages complete (before Code Generation)
- The artifact is a customizable template — enterprises should update section content to match their specific ARB submission requirements
- The artifact consolidates all design decisions, NFRs, infrastructure choices, and risk assessments into a single reviewable document
- If PM tool sync is enabled, the ARB artifact reference is also pushed as an attachment/link to the relevant epic
