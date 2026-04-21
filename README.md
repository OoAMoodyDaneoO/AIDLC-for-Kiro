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

## The Three Phases

### 🔵 Inception — What to Build and Why
Workspace Detection → Intent Alignment → Requirements Analysis → User Stories → Workflow Planning → Application Design → Units Generation

### 🟢 Construction — How to Build It
Functional Design → NFR Requirements → NFR Design → Infrastructure Design → (ARB Gate) → (Build Path) → Code Generation → Build and Test

### 🟡 Operations — How to Deploy and Run It
(Permit to Operate Gate) → Release Notes → Operations

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
