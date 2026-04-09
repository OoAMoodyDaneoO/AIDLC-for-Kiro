---
inclusion: always
---

# AI-DLC CLI: Spec Creation Without Native UI

Kiro CLI has no native spec UI, but AI-DLC still creates spec files as markdown in `.kiro/specs/project-specs/{feature}/`. These maintain parity with the IDE experience.

## When to Create Specs
After Construction design stages complete (Functional Design, NFR Requirements, NFR Design, Infrastructure Design — before Code Generation), the orchestrator MUST create:
1. `requirement.md` — from inception: requirements, stories, intent
2. `design.md` — from inception + construction: execution plan, functional design, NFR design, infrastructure design, ADRs
3. `tasks.md` — from construction: code generation plan steps grouped by stage gates

## Keeping Specs in Sync
Without file-watch hooks, the orchestrator agent updates spec files whenever:
- Requirements change → update requirement.md
- Execution plan changes → update design.md
- Construction steps added/completed → update tasks.md
