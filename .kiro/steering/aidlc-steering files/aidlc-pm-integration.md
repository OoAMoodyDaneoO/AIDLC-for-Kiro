---
inclusion: always
---

# AI-DLC: Project Management Tool Integration

## When to Ask
During Intent Alignment / Mob Elaboration, include this question:

```markdown
## Question: Project Management Tool
Does your team use a project management tool for requirements traceability?

A) Jira
B) Azure DevOps (ADO)
C) Linear
D) GitHub Issues
E) No — track in AI-DLC artifacts only
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

## If User Opts In

### Record in aidlc-state.md
```markdown
## PM Tool Configuration
- **Tool**: [Jira/ADO/Linear/GitHub Issues]
- **Sync Enabled**: Yes
- **Project Key**: [Enterprise: Add project key/ID]
- **Linking Enabled**: Yes
```

### MCP Server Setup
Instruct user to configure in `.kiro/settings/mcp.json`:

Jira: `uvx mcp-atlassian` — auth prompted on first invocation
Azure DevOps: `npx -y azure-devops-mcp` — auth prompted on first invocation
GitHub Issues: `npx -y @modelcontextprotocol/server-github` — requires GITHUB_TOKEN env var
Linear: `npx -y mcp-server-linear` — requires LINEAR_API_KEY env var

### What Gets Published & When

#### Inception Phase Sync
- After Requirements Analysis approval → Create **Epic** for the feature
  - Push each FR as a **Feature/Story** linked to the Epic
  - Push each NFR as a **Feature/Story** linked to the Epic with NFR label
- After User Stories approval → Create **User Stories** as work items
  - Link each story to its parent FR Feature
  - Include acceptance criteria in the work item description
  - Tag with priority and story points if available

#### Construction Phase Sync
- After Construction design approval → Create **Sub-tasks/Child Issues** for code generation steps
  - Link sub-tasks to parent User Stories
  - Group by unit/stage gate
- After ARB artifact generation (if enabled) → Attach ARB document link to the Epic
- After task completion → Update work item status to Done/Closed
  - Include completion timestamp and reference to code artifacts

#### Test Evidence Sync (if Test Evidence extension enabled)
- After each test execution → Attach test evidence document to relevant work items
- On test failure → Create **Bug/Defect** work item linked to the parent story
  - Include RCA summary in the bug description
  - Include remediation plan as sub-tasks
  - Set priority based on RCA severity classification
- On test fix verification → Update bug status and attach re-run evidence
- After Build & Test completion → Attach consolidated test evidence summary to the Epic

#### Design Review Sync (if Design Review extension enabled)
- After design review → Push Critical/High drift items as **Issues/Bugs** linked to the Epic
  - Include drift description, expected vs actual state
  - Include remediation steps as sub-tasks

### Hierarchy & Linking Model

```
Epic (Feature)
├── Feature/Story (FR-001: Functional Requirement)
│   ├── User Story (US-001)
│   │   ├── Sub-task (Code generation step)
│   │   ├── Sub-task (Code generation step)
│   │   └── Bug (Test failure — linked to RCA)
│   │       └── Sub-task (Remediation step)
│   └── User Story (US-002)
├── Feature/Story (NFR-001: Non-Functional Requirement)
│   └── User Story (Performance target)
├── Issue (Design Review drift finding)
│   └── Sub-task (Remediation step)
└── Attachment: ARB Submission Document
    Attachment: Test Evidence Summary
```

### Sync Direction
- **Primary**: AI-DLC → PM Tool (automatic on approval gates)
- **Bidirectional**: Task completion syncs both ways
- **Pull (manual hook)**: PM Tool → AI-DLC (user-triggered to check for external changes)

### Vibe Mode Sync
When requirements change during vibe sessions:
- Detect which requirements/stories were modified
- Update corresponding PM tool work items
- Add a comment noting the change was made via AI-DLC vibe session with timestamp
- If the change affects linked items (e.g., FR change affects child stories), flag for review

## If User Opts Out
No MCP config needed. All tracking in aidlc-docs/ and Kiro specs.
