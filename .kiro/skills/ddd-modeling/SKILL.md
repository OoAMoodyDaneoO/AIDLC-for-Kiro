---
name: ddd-modeling
description: Domain-Driven Design modeling patterns including aggregates, entities, value objects, domain events, repositories, and bounded contexts. Use when designing domain models or decomposing systems.
metadata:
  author: aidlc-framework
  version: "1.0"
  agents: architect
---

# Domain-Driven Design Modeling

## Strategic Design
- Identify bounded contexts from business capabilities
- Define context maps showing relationships
- Apply loose coupling and high cohesion

## Tactical Patterns
- Aggregates: Consistency boundaries with root entity
- Entities: Objects with persistent identity
- Value Objects: Immutable, defined by attributes
- Domain Events: Record of significant occurrences
- Repositories: Data access abstraction
- Factories: Complex object creation
