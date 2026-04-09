---
inclusion: always
---

# AI-DLC + Kiro Spec Integration

## Blended Approach

AI-DLC artifacts in `aidlc-docs/` are the "evidence room" — detailed plans, audit trails, question files, and state tracking. Kiro specs in `.kiro/specs/` are the "front door" — summarized, navigable, and integrated with Kiro's native spec UI.

## Multi-Feature Support

A single repo can have multiple features, each with its own AI-DLC artifact tree and Kiro spec. The feature name is the linking key between the two.

```
.kiro/specs/
  aidlc/                                  ← AI-DLC phase templates (shared)
    inception/requirement.md
    construction/requirement.md
    operations/requirement.md
  project-specs/                          ← One spec per feature
    {feature-name}/
      requirement.md
      design.md
      tasks.md

aidlc-docs/
  {feature-name}/                         ← One artifact tree per feature
    inception/
      plans/
      requirements/
      user-stories/
      application-design/
      reverse-engineering/
    construction/
      plans/
      adrs/                           ← Architecture Decision Records
      build-and-test/
    operations/
    aidlc-state.md
    audit.md
```

## Starting a New Feature

When the user says "Using AI-DLC, ..." for a new feature:

1. Derive a kebab-case feature name from the intent (e.g., "fishery-website")
2. Bootstrap the AI-DLC artifact tree using `mkdir -p` (do NOT use .gitkeep files):
   ```bash
   mkdir -p aidlc-docs/{feature-name}/inception/{intent,plans,requirements,user-stories,application-design,reverse-engineering} \
            aidlc-docs/{feature-name}/construction/{plans,adrs,build-and-test} \
            aidlc-docs/{feature-name}/operations
   ```
   Then create `aidlc-state.md` and `audit.md` as the first real files.
3. Run the AI-DLC workflow, storing all artifacts under `aidlc-docs/{feature-name}/`
4. **CRITICAL — Spec Creation Timing**: Create the Kiro spec AFTER Construction design stages complete (before Code Generation). This ensures the spec has the full picture from both Inception AND Construction design:
   
   Inception artifacts feed into `requirement.md`:
   - Intent alignment (refined-intent.md)
   - Requirements (requirements.md)
   - User Stories (if executed)
   
   Construction design artifacts feed into `design.md`:
   - Functional Design (per unit)
   - NFR Requirements and NFR Design (per unit)
   - Infrastructure Design (per unit)
   - Architecture Decision Records (ADRs)
   - Execution plan and workflow visualization
   
   Code Generation plan feeds into `tasks.md`:
   - Code generation steps as Kiro tasks grouped by stage gates
   
   Create the spec at:
   ```
   .kiro/specs/project-specs/{feature-name}/
     requirement.md    ← From inception: requirements, stories, intent
     design.md         ← From inception + construction: execution plan, functional design, NFR design, infrastructure design, ADRs
     tasks.md          ← From construction: code generation plan steps as tasks
   ```
5. Sync hooks keep the spec and artifacts in sync using the shared feature name (but only AFTER the spec exists)
6. The postTaskExecution hook syncs task completions back to AI-DLC plans (bidirectional)

## Linking Convention

Use `#[[file:...]]` references in spec files to link to the feature's AI-DLC artifacts:
- `#[[file:aidlc-docs/{feature-name}/inception/requirements/requirements.md]]`
- `#[[file:aidlc-docs/{feature-name}/inception/plans/execution-plan.md]]`
- `#[[file:aidlc-docs/{feature-name}/construction/plans/{unit}-code-generation-plan.md]]`

## Sync Hooks

Eight hooks automate the workflow:

**Enforcement hooks:**
- `aidlc-plan-first` — gates all write operations to ensure plan-then-validate-then-execute
- `aidlc-log-prompt` — appends every user input to the feature's audit.md
- `aidlc-mark-complete` — updates plan checkboxes and aidlc-state.md on agent stop

**Spec sync hooks (AI-DLC → Kiro specs):**
- `aidlc-sync-requirements` — syncs inception requirements → project spec `requirement.md`
- `aidlc-sync-design` — syncs inception plans/design → project spec `design.md`
- `aidlc-sync-tasks` — syncs construction plans → project spec `tasks.md`

**Bidirectional sync:**
- `aidlc-sync-task-complete` — syncs task completions from Kiro spec back to AI-DLC construction plan
- `aidlc-vibe-sync` — after any write, ensures both AI-DLC artifacts and Kiro specs stay in sync during vibe mode interactions

The hooks match the feature name from the file path to find the corresponding spec or artifact tree.

## Task Stage Gates

Group tasks in `tasks.md` by AI-DLC stage gates:
- CSS Foundation, HTML Pages, JavaScript, Quality & Accessibility (for front-end)
- Business Logic, API Layer, Repository Layer, Testing (for back-end)
- Per-unit grouping for multi-unit projects
