---
inclusion: always
---

# AI-DLC Agent Delegation Matrix

## How Delegation Works
The orchestrator routes work to specialist subagents based on the current AI-DLC stage. Kiro auto-selects based on description, or invoke explicitly with `/agent-name`.

## Stage → Agent → Skills

### INCEPTION PHASE
| Stage | Agent | Skills |
|---|---|---|
| Workspace Detection | aidlc-orchestrator | aidlc-workflow |
| Intent Alignment | requirements-analyst | aidlc-workflow |
| Reverse Engineering | architect | ddd-modeling |
| Requirements Analysis | requirements-analyst | aidlc-workflow |
| User Stories | product-owner | aidlc-workflow |
| Workflow Planning | aidlc-orchestrator | aidlc-workflow |
| Application Design | architect | ddd-modeling |
| Units Generation | architect | ddd-modeling |

### CONSTRUCTION PHASE
| Stage | Agent | Skills |
|---|---|---|
| Functional Design | architect | ddd-modeling |
| NFR Requirements | architect | rest-api-design, adr-writing |
| NFR Design | architect | rest-api-design, adr-writing |
| Infrastructure Design | devops-engineer | terraform-patterns, adr-writing |
| Code Gen (frontend) | frontend-developer | accessibility-audit |
| Code Gen (backend) | backend-developer | rest-api-design |
| Code Gen (database) | database-engineer | ddd-modeling |
| Code Gen (IaC) | devops-engineer | terraform-patterns |
| Build and Test | qa-engineer | test-strategy |
| Security Review | security-engineer | security-review |
| Documentation | technical-writer | aidlc-workflow |

### OPERATIONS PHASE
| Stage | Agent | Skills |
|---|---|---|
| Deployment | devops-engineer | terraform-patterns |
| Monitoring | sre-engineer | observability-setup |
| Incident Response | sre-engineer | observability-setup |

## Notes
- Security reviews can trigger at ANY stage
- Subagents don't access Specs or trigger Hooks
- Steering files and MCP servers DO work in subagents
