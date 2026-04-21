# AI-DLC Framework for Kiro IDE and CLI

Enterprise-grade AI-assisted software development lifecycle for [Kiro](https://kiro.dev). Guides you from intent through design, code generation, testing, and production deployment — with governance checkpoints, PM tool integration, and full audit trails.

## What's Inside

| Component | Count | Purpose |
|---|---|---|
| Steering files | 8 | Methodology rules, governance, PM integration, conflict detection |
| Hooks | 21 | Enforcement, audit, spec sync, governance gates, PM push/pull |
| Custom agents | 12 | Specialist subagents for every AI-DLC role |
| Skills | 9 | On-demand expertise (DDD, security, testing, etc.) |
| Rule details | 20+ | Stage rules from [awslabs/aidlc-workflows](https://github.com/awslabs/aidlc-workflows) |
| Governance extensions | 8 | ARB, PTO, Design Review, Test Evidence, Build Path, PM, Security, AI Compliance |
| IDE extension | 1 | Visual dashboard with sidebar, progress tracking, governance controls |
| CLI TUI dashboard | 1 | Interactive terminal UI for CLI users |
| Kiro Power | 1 | Context-efficient user guide with 6 steering files |

## Quick Start

### Kiro IDE

```bash
git clone https://github.com/OoAMoodyDaneoO/AIDLC-for-Kiro-IDE-and-CLI.git
cd AIDLC-for-Kiro-IDE-and-CLI
./setup-ide.sh
```

Then open in Kiro and say: **"Using AI-DLC, I want to build [describe your feature]"**

### Kiro CLI

```bash
git clone https://github.com/OoAMoodyDaneoO/AIDLC-for-Kiro-IDE-and-CLI.git
cd AIDLC-for-Kiro-IDE-and-CLI
./setup-cli.sh
kiro-cli --agent aidlc-orchestrator
```

### Visual Dashboard (IDE Extension)

```bash
cd extensions && ./build.sh
# In Kiro: Cmd+Shift+P → "Install from VSIX" → extensions/out/kiro-aidlc-plugin.vsix
# Reload window
```

### Visual Dashboard (CLI TUI)

```bash
cd cli/dashboard && npm install
node aidlc-tui.js /path/to/workspace
```

### Kiro Power

Install via Kiro Powers panel → "Add Custom Power" → Local Directory → `powers/aidlc/`

## End-to-End Workflow

The AI-DLC workflow is adaptive — stages execute or skip based on project type, complexity, user choices, and enabled extensions. The diagram below shows the full E2E flow with every decision fork.

### Workflow Legend

- **ALWAYS** — stage always executes
- **CONDITIONAL** — stage executes only when criteria are met
- **GATE** — hard gate that blocks progress until approved
- **MANUAL** — triggered by user on demand
- **⑂** — decision fork

---

### 🔵 INCEPTION PHASE — What to Build and Why

```
┌─────────────────────────┐
│   Workspace Detection   │  ALWAYS
│  (scan for existing code│
│   and aidlc-state.md)   │
└───────────┬─────────────┘
            │
            ⑂ Existing code detected?
           ╱ ╲
         Yes   No
         ╱       ╲
        ▼         ▼
  ┌──────────┐  ┌──────────────────────────┐
  │Brownfield│  │ Greenfield               │
  └────┬─────┘  │ ⑂ Existing prototype?    │
       │        │  A) Code in workspace     │
       │        │     → treat as Brownfield │
       │        │  B) Code in separate repo │
       │        │     → import, Brownfield  │
       │        │  C) Prototype to review   │
       │        │     → analyze, then cont. │
       │        │  D) Completely new        │
       │        │     → standard Greenfield │
       │        └──────────┬───────────────┘
       │                   │
       ⑂ Reverse engineering artifacts exist?
      ╱ ╲
    No   Yes
    ╱       ╲
   ▼         ╲
┌──────────────────┐  │
│Reverse Engineering│  │  CONDITIONAL (brownfield only,
│ (analyze codebase,│  │   no prior artifacts)
│  generate docs)   │  │
└────────┬─────────┘  │
         │ [GATE: user approval]
         ▼            ▼
┌─────────────────────────┐
│    Intent Alignment     │  ALWAYS (MANDATORY — never skip)
│  (capture raw intent,   │
│   clarifying questions,  │
│   refined intent)        │
└───────────┬─────────────┘
            │ [GATE: user approval of refined intent]
            │
            ⑂ Build Path Extension enabled?
           ╱ ╲
         Yes   No
         ╱       ╲
        ▼         │
  ┌────────────────────┐  │
  │ Build Path Choice  │  │  ENTRY POINT 1 (upfront)
  │ ⑂ Prototype or     │  │
  │   Enterprise-Grade? │  │
  └──┬─────────┬───────┘  │
     │         │           │
  Prototype  Enterprise    │
     │         │           │
     │    ┌────┘───────────┘
     │    ▼
     │  ┌─────────────────────────┐
     │  │  Requirements Analysis  │  ALWAYS (depth: minimal/standard/comprehensive)
     │  └───────────┬─────────────┘
     │              │ [GATE: user approval]
     │              │
     │              ⑂ User stories needed? (multi-factor assessment)
     │             ╱ ╲
     │           Yes   No (pure refactoring, simple bug fix, infra-only)
     │           ╱       ╲
     │          ▼         │
     │  ┌───────────────┐ │
     │  │  User Stories  │ │  CONDITIONAL
     │  │  Part 1: Plan  │ │
     │  │  Part 2: Gen   │ │
     │  └───────┬───────┘ │
     │          │ [GATE]   │
     │          ▼         ▼
     │  ┌─────────────────────────┐
     │  │   Workflow Planning     │  ALWAYS
     │  │  (determine phases,     │
     │  │   depth, sequence)      │
     │  └───────────┬─────────────┘
     │              │ [GATE: user approval]
     │              │
     │              ⑂ New components/services needed?
     │             ╱ ╲
     │           Yes   No
     │           ╱       ╲
     │          ▼         │
     │  ┌────────────────┐│
     │  │ App Design     ││  CONDITIONAL
     │  └───────┬────────┘│
     │          │ [GATE]   │
     │          ▼         ▼
     │              │
     │              ⑂ Multiple units of work needed?
     │             ╱ ╲
     │           Yes   No
     │           ╱       ╲
     │          ▼         │
     │  ┌────────────────┐│
     │  │Units Generation││  CONDITIONAL
     │  └───────┬────────┘│
     │          │ [GATE]   │
     │          ▼         ▼
     │  ════════════════════
     │  END OF INCEPTION
     │  ════════════════════
     │              │
     ▼              ▼
(see Prototype   (see Construction
 Fast Path)       Phase below)
```

---

### Prototype Fast Path (Build Path = Prototype)

When the user selects Prototype at Entry Point 1, the workflow is streamlined:

```
Prototype Path
     │
     ▼
  Minimal Requirements (reduced depth)
     │
  Skip User Stories
     │
  Simplified Design (skip NFRs, infrastructure)
     │
  Single "prototype" unit → Code Generation
     │
  ┌─────────────────────────┐
  │   Prototype Review Gate  │  GATE
  │  ⑂ What next?            │
  │   A) Transition to       │
  │      Enterprise-Grade    │
  │   B) Iterate on prototype│
  │   C) Ship as-is          │
  └──┬──────────┬────────────┘
     │          │
  Transition  Continue
     │
     ⑂ Transition approach?
    ╱ ╲
  Clean   Brownfield
  Build   from Prototype
    │        │
    │     Reverse Engineering
    │     (against prototype code)
    │        │
    └────┬───┘
         ▼
  Re-enter at Requirements Analysis
  (full enterprise depth, all stages execute)
```

---

### 🟢 CONSTRUCTION PHASE — How to Build It

Construction executes a per-unit loop. Each unit completes all its design + code stages before the next unit begins.

```
  ┌─────────────────────────────────────────┐
  │         PER-UNIT LOOP                   │
  │  (repeats for each unit of work)        │
  │                                         │
  │  ⑂ New data models / complex logic?     │
  │ ╱ ╲                                     │
  │Yes  No                                  │
  │ ▼                                       │
  │ Functional Design  CONDITIONAL          │
  │ [GATE]                                  │
  │  │                                      │
  │  ⑂ Performance/security/scalability?    │
  │ ╱ ╲                                     │
  │Yes  No                                  │
  │ ▼                                       │
  │ NFR Requirements   CONDITIONAL          │
  │ [GATE]                                  │
  │  │                                      │
  │  ⑂ NFR Requirements executed?           │
  │ ╱ ╲                                     │
  │Yes  No                                  │
  │ ▼                                       │
  │ NFR Design         CONDITIONAL          │
  │ [GATE]                                  │
  │  │                                      │
  │  ⑂ Infrastructure changes needed?       │
  │ ╱ ╲                                     │
  │Yes  No                                  │
  │ ▼                                       │
  │ Infrastructure Design  CONDITIONAL      │
  │ [GATE]                                  │
  │  │                                      │
  │  ▼                                      │
  │ Code Generation    ALWAYS (per-unit)    │
  │  Part 1: Planning  [GATE]               │
  │  Part 2: Generation [GATE]              │
  │                                         │
  └─────────────┬───────────────────────────┘
                │ (after ALL units complete)
                │
```

#### Governance Gates (between design completion and Code Generation)

After all Construction design stages complete for all units, governance gates fire before Code Generation begins:

```
  All units designed
        │
        ⑂ ARB Extension enabled?
       ╱ ╲
     Yes   No
     ╱       ╲
    ▼         │
┌──────────────┐│
│ ARB Artifact ││  HARD GATE — blocks Code Gen until approved
│ Generation   ││
└──────┬───────┘│
       │ [GATE]  │
       ▼        ▼
        │
        ⑂ AI Compliance Extension enabled
       ╱  AND AI/ML capabilities detected?
     Yes   No
     ╱       ╲
    ▼         │
┌──────────────┐│
│AI Compliance ││  HARD GATE — blocks Code Gen until approved
│   Review     ││
└──────┬───────┘│
       │ [GATE]  │
       ▼        ▼
        │
        ⑂ Build Path Extension enabled?
       ╱ ╲  (Entry Point 2 — second chance)
     Yes   No
     ╱       ╲
    ▼         │
┌──────────────────┐│
│ Build Path Choice ││  User chose Enterprise at EP1?
│ ⑂ Prototype now   ││  Offer prototype option again
│   or continue?     ││
└──┬────────┬───────┘│
   │        │         │
Prototype  Continue   │
   │        │         │
   │   ┌────┘─────────┘
   │   ▼
   │  Code Generation (all units)
   │        │
   │        ▼
   │  Build and Test  ALWAYS
   │  [GATE: user approval]
   │        │
   ▼        ▼
(Prototype  (see Operations)
 Review Gate)
```

#### Manual Governance Triggers (any time during Construction)

```
  ┌──────────────────┐   ┌──────────────────┐
  │  Security Review  │   │  Design Review   │
  │  (OWASP Top 10,   │   │  (drift detection│
  │   vuln assessment) │   │   vs design docs)│
  │  MANUAL trigger    │   │  MANUAL trigger  │
  └──────────────────┘   └──────────────────┘
```

---

### 🟡 OPERATIONS PHASE — How to Deploy and Run It

```
  Build and Test complete
        │
        ⑂ PTO Extension enabled?
       ╱ ╲
     Yes   No
     ╱       ╲
    ▼         │
┌──────────────┐│
│ Permit to    ││  HARD GATE — blocks production deployment
│ Operate (PTO)││
└──────┬───────┘│
       │ [GATE]  │
       ▼        ▼
        │
  Operations (placeholder for future:
    deployment, monitoring, incident response)
```

---

### Decision Fork Summary

| Fork | Condition | Path A | Path B |
|---|---|---|---|
| **Brownfield vs Greenfield** | Existing code detected? | Brownfield → Reverse Engineering | Greenfield → Intent Alignment |
| **Existing Prototype** | Greenfield + existing code? | Analyze prototype → Brownfield | Completely new → standard flow |
| **Reverse Engineering** | Brownfield + no prior artifacts? | Execute RE | Skip RE |
| **Build Path (EP1)** | Extension enabled + Intent approved? | Prototype Fast Path | Enterprise-Grade |
| **User Stories** | Multi-factor assessment | Execute stories | Skip (pure refactoring, etc.) |
| **Application Design** | New components/services? | Execute design | Skip |
| **Units Generation** | Multiple units needed? | Decompose into units | Single unit |
| **Functional Design** | New data models/complex logic? | Execute per unit | Skip |
| **NFR Requirements** | Performance/security/scalability? | Execute per unit | Skip |
| **NFR Design** | NFR Requirements executed? | Execute per unit | Skip |
| **Infrastructure Design** | Infrastructure changes needed? | Execute per unit | Skip |
| **ARB Gate** | Extension enabled? | HARD GATE before Code Gen | Skip |
| **AI Compliance** | Extension enabled + AI detected? | HARD GATE before Code Gen | Skip |
| **Build Path (EP2)** | Extension enabled + chose Enterprise at EP1? | Offer prototype option again | Proceed to Code Gen |
| **Prototype Transition** | Prototype complete? | Clean Build or Brownfield transition | Continue iterating |
| **Security Review** | Manual trigger | OWASP assessment | N/A |
| **Design Review** | Manual trigger | Drift detection | N/A |
| **Test Evidence RCA** | Extension enabled + test failure? | RCA required before fix | Standard test flow |
| **PTO Gate** | Extension enabled? | HARD GATE before deployment | Skip |

---

### PM Tool Sync Points

When PM tool integration is enabled (Jira, ADO, Linear, GitHub Issues), artifacts sync at these points:

| Approval Gate | What Syncs |
|---|---|
| Requirements Analysis approved | Epic created, FRs/NFRs as Features/Stories |
| User Stories approved | User Stories as work items linked to FRs |
| Construction design approved | Sub-tasks for code generation steps |
| ARB approved (if enabled) | ARB document attached to Epic |
| Code Generation task complete | Work item status → Done |
| Test failure (if Test Evidence enabled) | Bug/Defect created with RCA |
| Design Review (if enabled) | Critical/High drift items as Issues |
| Build & Test complete | Consolidated test evidence to Epic |
| PTO approved (if enabled) | PTO attached to Epic |

## Enterprise Governance (Opt-In)

| Extension | Gate Point | What It Does |
|---|---|---|
| **ARB Artifact** | Before Code Gen | Architecture Review Board submission |
| **Permit to Operate** | After Build & Test | Production deployment approval |
| **Design Review** | Manual trigger | Drift detection with remediation |
| **Test Evidence & RCA** | During Build & Test | Formal test docs with root cause analysis |
| **Build Path Selection** | Before Code Gen | Prototype-first vs enterprise-grade |
| **PM Tool Integration** | Every approval gate | Push to Jira/ADO/Linear/GitHub Issues |
| **Security Review** | Manual trigger | OWASP Top 10 assessment |
| **AI Compliance** | Before Code Gen | Responsible AI review |

## IDE Extension

- Sidebar: Phases, Features, Governance views
- Dashboard: Progress bars, phase cards, governance actions, activity timeline
- Feature switching, new feature launcher, artifact viewer, search, notifications

## CLI TUI Dashboard

Interactive terminal UI — progress gauge, phases table, governance panel, features list, activity log. Keys: `q` quit, `r` refresh, `1-9` switch features, `Tab` commands.

## Hooks (21)

Enforcement (`plan-first`, `test-rca`), audit (`log-prompt`, `mark-complete`), spec sync (`sync-requirements`, `sync-design`, `sync-tasks`, `sync-task-complete`, `create-spec`), vibe sync, governance gates (`arb-gate`, `build-path`, `pto-gate`), PM push (`requirements`, `stories`, `test-evidence`), manual triggers (`pm-pull`, `design-review`, `release-notes`, `cost-estimate`, `retrospective`).

## Agents (12)

aidlc-orchestrator, requirements-analyst, product-owner, architect, frontend-developer, backend-developer, security-engineer, devops-engineer, sre-engineer, qa-engineer, database-engineer, technical-writer.

## Customizing for Your Enterprise

1. Edit `.kiro/steering/aidlc-steering files/team-context.md` for your team's standards
2. Add business rules to `.kiro/steering/enterprise steering/`
3. Add custom extensions to `.kiro/aws-aidlc-rule-details/extensions/`
4. Configure PM tool MCP server in `.kiro/settings/mcp.json`
5. Customize `[Enterprise: ...]` placeholders in ARB and PTO templates

## Key Commands

| Command | What It Does |
|---|---|
| `Using AI-DLC, I want to build...` | Start new feature |
| `dashboard` / `show status` | View progress |
| `run design review` | Trigger design review |
| `generate arb` / `generate pto` | Generate governance artifacts |
| `generate release notes` | Auto-generate release notes |
| `estimate costs` | Generate cost estimates |
| `run retrospective` | Capture phase retrospective |
| `pull pm changes` | Sync from PM tool |
| `check for conflicts` | Audit steering for conflicts |

## References

- [AI-DLC Blog Post](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/)
- [AI-DLC Whitepaper](https://prod.d13rzhkk8cj2z0.amplifyapp.com/)
- [AI-DLC Workflows Repo](https://github.com/awslabs/aidlc-workflows)
- [Kiro Documentation](https://kiro.dev/docs/)

## License

MIT
