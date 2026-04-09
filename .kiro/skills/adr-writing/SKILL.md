---
name: adr-writing
description: Architecture Decision Record (ADR) writing patterns. Use when documenting architecture decisions, technology choices, design trade-offs, or pattern selections during AI-DLC Construction.
metadata:
  author: aidlc-framework
  version: "1.0"
  agents: architect, technical-writer
---

# Architecture Decision Records (ADRs)

## When to Write an ADR
- Technology or framework selection
- Architectural pattern choice (CQRS, event-driven, microservices vs monolith)
- Database selection or data modeling decisions
- NFR trade-offs (performance vs cost, consistency vs availability)
- Infrastructure choices (serverless vs containers)
- Any decision where alternatives were considered and rejected

## ADR Format

```markdown
# ADR-{NNN}: {Title}

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-{NNN}]

## Context
What is the issue or decision that needs to be made?

## Decision
What is the decision that was made?

## Alternatives Considered
| Alternative | Pros | Cons |
|---|---|---|
| Option A | ... | ... |
| Option B | ... | ... |

## Consequences
Positive and negative consequences of this decision.

## References
- [Links to requirements, design docs, or external resources]
```

## File Location
`aidlc-docs/{feature}/construction/adrs/adr-{NNN}-{kebab-title}.md`

## Numbering
Sequential within a feature (ADR-001, ADR-002). Never reuse numbers.
