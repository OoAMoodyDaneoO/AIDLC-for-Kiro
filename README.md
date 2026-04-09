# AI-DLC Scaffolding for Kiro IDE and CLI

A production-ready scaffolding that implements the [AI-DLC (AI-Driven Development Lifecycle)](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/) methodology natively in [Kiro](https://kiro.dev), supporting both the IDE and CLI.

Clone, run setup for your platform, overlay your business context, and start building.

## What's Inside

| Layer | Count | Purpose |
|---|---|---|
| Steering files | 4 | Always-on methodology rules and team context |
| Hooks | 7 | Enforcement, audit logging, bidirectional spec sync (IDE) |
| Custom agents | 12 | Specialist subagents for every AI-DLC role |
| Skills | 9 | On-demand expertise (agentskills.io standard) |
| Rule details | 20+ | Official stage rules from [awslabs/aidlc-workflows](https://github.com/awslabs/aidlc-workflows) |
| Extensions | 3 | Security baseline, property-based testing, blank template |

## Platform Setup

### Kiro IDE

```bash
git clone https://github.com/OoAMoodyDaneoO/AIDLC-for-Kiro-IDE-and-CLI.git
cd AIDLC-for-Kiro-IDE-and-CLI
./setup-ide.sh
```

Copies IDE-format agents (`.md`), hooks (`.kiro.hook`), and spec templates into `.kiro/`. Open in Kiro IDE and type: `Using AI-DLC, [your intent]`

### Kiro CLI

```bash
git clone https://github.com/OoAMoodyDaneoO/AIDLC-for-Kiro-IDE-and-CLI.git
cd AIDLC-for-Kiro-IDE-and-CLI
./setup-cli.sh
kiro-cli --agent aidlc-orchestrator
```

Copies CLI-format agents (`.json`) with prompt files into `.kiro/agents/`.

### Shared vs Platform-Specific

| Component | Shared | IDE | CLI |
|---|---|---|---|
| Steering files | ✅ | | |
| Skills | ✅ | | |
| Rule details + extensions | ✅ | | |
| aidlc-docs/ artifacts | ✅ | | |
| Agents (.md) | | ✅ | |
| Agents (.json) | | | ✅ |
| Hooks (.kiro.hook files) | | ✅ | |
| Hooks (in agent JSON) | | | ✅ |
| Specs (requirement/design/tasks) | | ✅ | |

CLI doesn't support native specs — spec integration is IDE-only. On CLI, `aidlc-docs/` artifacts are the primary documentation.

## Agents

| Agent | Role |
|---|---|
| aidlc-orchestrator | Workflow coordination and delegation |
| requirements-analyst | Requirements gathering and intent analysis |
| product-owner | User stories, personas, acceptance criteria |
| architect | Application design, DDD, NFR patterns, ADRs |
| frontend-developer | HTML, CSS, JS, React, accessibility |
| backend-developer | APIs, business logic, server-side code |
| security-engineer | OWASP, vulnerability assessment, secure coding |
| devops-engineer | IaC, CI/CD, containerization, deployment |
| sre-engineer | Monitoring, observability, incident response |
| qa-engineer | Test strategy, test generation, quality gates |
| database-engineer | Schema design, migrations, query optimization |
| technical-writer | API docs, READMEs, ADRs, onboarding guides |

## Skills

9 on-demand packages: aidlc-workflow, ddd-modeling, accessibility-audit, rest-api-design, adr-writing, test-strategy, security-review, observability-setup, terraform-patterns

## Multi-Feature Support

Each feature gets its own artifact tree and Kiro spec (IDE only):

```
aidlc-docs/{feature-name}/inception/    requirements, plans, stories
aidlc-docs/{feature-name}/construction/ code plans, ADRs, build-and-test
.kiro/specs/project-specs/{feature}/    requirement.md, design.md, tasks.md (IDE)
```

## Customizing for Your Team

1. Edit `.kiro/steering/team-context.md` — coding standards, architecture, security
2. Add extensions in `.kiro/aws-aidlc-rule-details/extensions/`
3. Add skills in `.kiro/skills/`

## Enterprise Onboarding Prompts

After cloning, use these prompts in Kiro to wire up your enterprise context:

**1. Team Context Setup**
```
Review .kiro/steering/team-context.md and help me fill it in.
Our team builds [describe domain]. We use [tech stack].
Ask me about our coding standards, architecture, security, and naming conventions.
```

**2. Import Existing Standards**
```
I have existing team standards to import as steering files.
Help me create steering files in .kiro/steering/ from:
[paste or reference your standards docs]
```

**3. Configure MCP Servers**
```
Help me set up MCP servers for our tools. We use:
- [Jira/ADO/Linear] for project management
- [Confluence/Notion] for documentation
- [specific databases, APIs, or services]
Create the mcp.json in .kiro/settings/
```

**4. Add Custom Skills**
```
Create a skill for [describe workflow — e.g., our deployment process,
code review checklist, data pipeline patterns].
Put it in .kiro/skills/ following agentskills.io format.
```

**5. Create Custom Agents**
```
I need a specialist agent for [describe role — e.g., compliance reviewer,
data engineer who knows our Snowflake setup].
Create an agent in .kiro/agents/ with the right tools and prompt.
```

**6. Add Custom Extensions**
```
Our org requires [describe compliance/security/testing rules].
Create a custom extension in .kiro/aws-aidlc-rule-details/extensions/
with opt-in questions and blocking rules.
```

**7. Import Existing Architecture**
```
We have an existing system. Here's our architecture: [paste or reference].
Create steering files that capture our patterns and conventions
so AI-DLC understands our brownfield context.
```

## Architecture

```
.kiro/                              Shared across IDE and CLI
  steering/                         Always-on methodology rules
  skills/                           On-demand expertise packages
  aws-aidlc-rule-details/           Official AI-DLC stage rules + extensions

ide/                                IDE-specific (setup-ide.sh)
  agents/*.md                       Markdown agents with YAML frontmatter
  hooks/*.kiro.hook                 Standalone hook files
  specs/                            Spec templates

cli/                                CLI-specific (setup-cli.sh)
  agents/*.json                     JSON agent configs

aidlc-docs/                         AI-DLC artifacts (created at runtime)
```

## References

- [AI-DLC Blog Post](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/)
- [AI-DLC Whitepaper](https://prod.d13rzhkk8cj2z0.amplifyapp.com/)
- [AI-DLC Workflows Repo](https://github.com/awslabs/aidlc-workflows)
- [Kiro Documentation](https://kiro.dev/docs/)
- [Agent Skills Standard](https://agentskills.io/specification)

## Future Enhancements

- Visualization dashboard: A web UI that reads `aidlc-docs/` and renders workflow progress
- Additional MCP integrations: Confluence, Notion, Slack notifications
- AI-DLC Power: Package as a Kiro Power for one-click installation

## License

MIT
