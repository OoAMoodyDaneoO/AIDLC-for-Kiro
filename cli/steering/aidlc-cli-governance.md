---
inclusion: always
---

# AI-DLC CLI: Enterprise Governance for Kiro CLI

## Overview
This steering file ensures Kiro CLI users get the same enterprise governance experience as IDE users. Since CLI has no sidebar, dashboard, or file-watch hooks, the orchestrator agent provides governance visibility through structured chat output at key checkpoints.

## CLI-Specific Behavior

### Status Reporting
At the start of every interaction, the orchestrator MUST output a brief status header:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ AI-DLC | {feature-name} | {current-stage}
Progress: ████████░░░░ {N}/{M} stages ({X}%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Governance Gates (CLI Equivalent of IDE Hooks)
Since CLI has no file-watch hooks, the orchestrator MUST manually enforce these gates:

1. **Plan-First Gate**: Before writing any code/design artifact, verify a plan exists and is approved
2. **ARB Gate**: Before Code Generation, check if ARB extension is enabled and artifact exists
3. **Build Path Gate**: Before Code Generation, check if Build Path extension is enabled and choice is made
4. **Test RCA Gate**: Before modifying test files, check if Test Evidence extension is enabled and RCA exists
5. **PTO Gate**: Before Operations, check if PTO extension is enabled and artifact exists
6. **PM Sync**: After each approval gate, check if PM tool sync is enabled and push updates

### Dashboard Command
When the user says "show status", "dashboard", or "show progress", output a full dashboard:

```
┌─────────────────────────────────────────────────────┐
│  🏗️ AI-DLC Dashboard — {feature-name}               │
│  Type: {Greenfield/Brownfield} | Started: {date}    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📊 Overall Progress                                 │
│  ████████████░░░░░░░░ {N}/{M} stages ({X}%)         │
│                                                      │
│  🔵 INCEPTION                                        │
│  ✅ Workspace Detection                              │
│  ✅ Intent Alignment                                 │
│  🔄 Requirements Analysis  ← current                │
│  ○  User Stories                                     │
│  ○  Workflow Planning                                │
│  ○  Application Design                               │
│  ○  Units Generation                                 │
│                                                      │
│  🟢 CONSTRUCTION                                     │
│  ○  Functional Design                                │
│  ○  NFR Requirements                                 │
│  ○  NFR Design                                       │
│  ○  Infrastructure Design                            │
│  ○  Code Generation                                  │
│  ○  Build and Test                                   │
│                                                      │
│  🟡 OPERATIONS                                       │
│  ○  Operations                                       │
│                                                      │
├─────────────────────────────────────────────────────┤
│  🛡️ Governance                                       │
│  📋 PM Tool: {status}                                │
│  📄 ARB Artifact: {status}                           │
│  🎫 PTO: {status}                                    │
│  🧪 Build Path: {status}                             │
│  🔍 Design Review: {status}                          │
│  📝 Test Evidence: {status}                          │
├─────────────────────────────────────────────────────┤
│  ⏱️ Recent Activity                                  │
│  {last 5 audit entries}                              │
└─────────────────────────────────────────────────────┘
```

### Feature Switching
When the user says "switch to {feature-name}" or "list features", scan `aidlc-docs/*/aidlc-state.md` and present available features:

```
📦 Available Features:
  ● data-modelling-tool  — INCEPTION - Requirements Analysis (3/14)
    auth-service          — CONSTRUCTION - Code Generation (9/14)
    reporting-module      — INCEPTION - User Stories (4/14)

Type "switch to {name}" to change active feature.
```

### Artifact Viewing
When the user says "show {artifact-type}" (e.g., "show requirements", "show design", "show audit"), read and display the relevant artifact file content in the chat.

### Governance Actions (CLI Equivalent of IDE Buttons)

| Command | Action |
|---|---|
| `show status` / `dashboard` | Display full dashboard |
| `list features` | List all features with progress |
| `switch to {name}` | Switch active feature |
| `run design review` | Trigger design review checkpoint |
| `pull pm changes` | Pull external PM tool changes |
| `generate arb` | Generate ARB artifact |
| `generate pto` | Generate Permit to Operate |
| `generate release notes` | Generate release notes |
| `estimate costs` | Generate cost estimates |
| `run retrospective` | Capture phase retrospective |
| `show {artifact}` | Display artifact content |
| `new feature` | Start a new AI-DLC feature |
| `export report` | Generate HTML report |

### Spec Sync (CLI Equivalent of IDE Hooks)
Without file-watch hooks, the orchestrator MUST manually sync specs:
- After Requirements Analysis approval → update requirement.md
- After Construction design approval → update design.md
- After Code Generation plan approval → update tasks.md
- After task completion → update tasks.md checkboxes
- After vibe changes → check for gaps and update artifacts

### Audit Logging
The orchestrator MUST append to audit.md after every user interaction.

### Progress Updates
The orchestrator MUST update aidlc-state.md checkboxes after completing any stage.
