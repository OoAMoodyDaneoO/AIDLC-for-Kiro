# Construction Phase Guide

## Overview
Construction determines HOW to build it. Runs per-unit with design stages, then code generation and testing.

## Per-Unit Stages
1. **Functional Design** (Conditional) — Data models, business logic
2. **NFR Requirements** (Conditional) — Performance, security, scalability
3. **NFR Design** (Conditional) — Implementation patterns for NFRs
4. **Infrastructure Design** (Conditional) — Cloud services, deployment
5. **ARB Artifact** (If enabled) — Architecture Review Board submission. Hard gate
6. **Build Path Selection** (If enabled) — Prototype-first or enterprise-grade
7. **Code Generation** (Always) — Planning then generation with checkboxes
8. **Build and Test** (Always) — Build, test, validate
9. **Permit to Operate** (If enabled) — Production deployment approval. Hard gate

## Tips
- Completion messages use standardized 2-option format (Request Changes / Continue)
- Code goes to workspace root, never aidlc-docs/
- Test Evidence extension requires RCA before modifying failing tests
- ARB and PTO templates have customizable enterprise placeholders
