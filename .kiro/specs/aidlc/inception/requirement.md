# AI-DLC Template — Inception Phase

## Purpose
Template documenting the AI-DLC Inception Phase methodology. Not a project spec.

## Inception Phase Stages
1. Workspace Detection (ALWAYS) — Scan workspace, greenfield/brownfield
2. Reverse Engineering (CONDITIONAL) — Analyze existing codebase
3. Requirements Analysis (ALWAYS) — Gather requirements at adaptive depth
4. User Stories (CONDITIONAL) — Create stories and personas
5. Workflow Planning (ALWAYS) — Create execution plan
6. Application Design (CONDITIONAL) — Design components, methods, services
7. Units Generation (CONDITIONAL) — Decompose into units of work

## Rule Details
Load from `.kiro/aws-aidlc-rule-details/inception/`

## Outputs (in aidlc-docs/inception/)
- plans/ — Execution plans with checkboxes
- requirements/ — Requirements and verification questions
- user-stories/ — Stories and personas
- application-design/ — Component models, services

## Integration
After Inception, create a project spec in `.kiro/specs/project-specs/{project-name}/`
