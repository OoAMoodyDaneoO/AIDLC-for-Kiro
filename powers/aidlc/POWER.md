---
name: "aidlc"
displayName: "AI-DLC Enterprise Framework"
description: "Enterprise-grade AI-assisted software development lifecycle. Guides you through Inception, Construction, and Operations with governance checkpoints, PM tool integration, and full audit trails."
keywords: ["aidlc", "sdlc", "enterprise", "governance", "requirements", "architecture", "development-lifecycle"]
author: "AI-DLC Framework"
---

# AI-DLC Enterprise Framework

## Overview

AI-DLC (AI-assisted Development Lifecycle) is a structured framework for building enterprise-grade software with AI assistance. It guides you through three phases — Inception, Construction, and Operations — with adaptive depth, governance checkpoints, and full audit trails.

The framework provides:
- **Adaptive workflow** that scales from simple prototypes to enterprise-grade solutions
- **Enterprise governance** with ARB artifacts, Permit to Operate, design reviews, and test evidence
- **PM tool integration** with Jira, Azure DevOps, Linear, and GitHub Issues
- **Prototype-first option** to sense-check designs before committing to full builds
- **Full traceability** from requirements through design, code, tests, and deployment
- **Visual dashboard** via Kiro IDE extension or CLI TUI

## Getting Started

### Quick Start (IDE)
1. Open your workspace in Kiro
2. Say: **"Using AI-DLC, I want to build [describe your feature]"**
3. The framework guides you through each phase automatically

### Quick Start (CLI)
1. Run `./setup-cli.sh` to install CLI agents and steering
2. Start: `kiro-cli --agent aidlc-orchestrator`
3. Say: **"Using AI-DLC, I want to build [describe your feature]"**

### Visual Dashboard
- **IDE**: Install the `kiro-aidlc-plugin` extension — `cd extensions && ./build.sh`
- **CLI**: Run `cd cli/dashboard && npm install && node aidlc-tui.js`

## Available Steering Files

Load only what you need for context efficiency:

- **getting-started** — First-time setup, workspace config, your first feature
- **inception-guide** — Inception phase: Intent, Requirements, Stories, Design
- **construction-guide** — Construction phase: Design, Code Gen, Build & Test
- **governance-guide** — ARB, PTO, Design Review, Test Evidence, PM Integration
- **extension-guide** — IDE extension and CLI TUI dashboard usage
- **troubleshooting** — Common issues and solutions

## The Three Phases

### 🔵 Inception — What to Build and Why
| Stage | Purpose |
|---|---|
| Workspace Detection | Scan workspace, detect existing code or prototype |
| Intent Alignment | Capture and clarify what you want to build |
| Requirements Analysis | Define functional and non-functional requirements |
| User Stories | Create stories with acceptance criteria |
| Workflow Planning | Plan execution phases and depth levels |
| Application Design | Design components, services, and interactions |
| Units Generation | Decompose system into units of work |

### 🟢 Construction — How to Build It
| Stage | Purpose |
|---|---|
| Functional Design | Detail data models and business logic |
| NFR Requirements | Define performance, security, scalability needs |
| NFR Design | Design patterns for non-functional requirements |
| Infrastructure Design | Map cloud services and deployment architecture |
| Code Generation | Generate application code from designs |
| Build and Test | Build, test, and validate the implementation |

### 🟡 Operations — How to Deploy and Run It
| Stage | Purpose |
|---|---|
| Permit to Operate | Production deployment approval |
| Release Notes | Auto-generated from stories and evidence |
| Operations | Deployment, monitoring, maintenance |

## Enterprise Governance Extensions (Opt-In)

| Extension | Gate Point | What It Does |
|---|---|---|
| ARB Artifact | Before Code Gen | Architecture Review Board submission |
| Permit to Operate | After Build & Test | Production deployment approval |
| Design Review | Manual trigger | Drift detection with remediation |
| Test Evidence & RCA | During Build & Test | Formal test docs with root cause analysis |
| Build Path Selection | Before Code Gen | Prototype-first vs enterprise-grade |
| PM Tool Integration | Every approval gate | Push to Jira/ADO/Linear/GitHub Issues |
| Security Review | Manual trigger | OWASP Top 10 vulnerability assessment |
| AI Compliance | Before Code Gen | Responsible AI regulatory review |

## Key Commands

| Command | What It Does |
|---|---|
| `Using AI-DLC, I want to build...` | Start new feature |
| `dashboard` / `show status` | View progress |
| `run design review` | Trigger design review |
| `generate arb` | Generate ARB artifact |
| `generate pto` | Generate Permit to Operate |
| `generate release notes` | Auto-generate release notes |
| `estimate costs` | Generate cost estimates |
| `run retrospective` | Capture phase retrospective |
| `pull pm changes` | Sync from PM tool |

## Best Practices

- Start with Intent Alignment — even simple requests benefit
- Enable governance extensions early during Requirements Analysis
- Prototype first for complex features to sense-check designs
- Keep PM tool synced at every approval gate
- Run design reviews regularly to catch drift early
- Never modify tests without documenting root cause analysis
- Use the visual dashboard for progress tracking
