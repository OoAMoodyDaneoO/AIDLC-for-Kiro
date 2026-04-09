---
inclusion: always
---

# AI-DLC: Project Management Tool Integration

## When to Ask
During Mob Elaboration, include this question:

```markdown
## Question: Project Management Tool
Does your team use a project management tool?

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
```

### MCP Server Setup
Instruct user to configure in `.kiro/settings/mcp.json`:

Jira: `uvx mcp-atlassian` with JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN
Azure DevOps: `uvx mcp-azure-devops` with ADO_ORG_URL, ADO_PAT
GitHub Issues: `uvx mcp-github` with GITHUB_TOKEN
Linear: `uvx mcp-linear` with LINEAR_API_KEY

### What Gets Published
- After Requirements Analysis → epics/features
- After User Stories → issues/work items with acceptance criteria
- After Construction planning → sub-tasks/child issues
- After task completion → update status to done/closed

### Sync Direction
- Primary: AI-DLC → PM Tool
- Optional: PM Tool → AI-DLC (user-triggered pull)

## If User Opts Out
No MCP config needed. All tracking in aidlc-docs/ and Kiro specs.
