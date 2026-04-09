# Contributing & Onboarding Guide

## What is this repo?

This repo implements the AI-DLC methodology natively in Kiro. It provides steering files, hooks, custom agents, skills, and spec templates that teams can pull and overlay their own business context onto.

## Quick Start

1. Clone this repo and open it in Kiro
2. Edit `.kiro/steering/team-context.md` with your team's standards
3. Type `Using AI-DLC, [describe your intent]` in chat
4. The workflow guides you through Inception → Construction → Operations

## Where Things Live

| What | Where |
|---|---|
| Steering (always-on rules) | `.kiro/steering/` |
| Hooks (automated enforcement) | `.kiro/hooks/` |
| Custom agents (12 specialists) | `.kiro/agents/` |
| Skills (8 on-demand packages) | `.kiro/skills/` |
| AI-DLC phase templates | `.kiro/specs/aidlc/` |
| Project specs (per feature) | `.kiro/specs/project-specs/{feature}/` |
| AI-DLC artifacts (per feature) | `aidlc-docs/{feature}/` |
| Official AI-DLC rule details | `.kiro/aws-aidlc-rule-details/` |

## Agents

| Agent | Specialization |
|---|---|
| aidlc-orchestrator | Workflow coordination and delegation |
| requirements-analyst | Requirements gathering and analysis |
| product-owner | User stories and acceptance criteria |
| architect | Application design, DDD, NFR patterns |
| frontend-developer | HTML, CSS, JS, React, accessibility |
| backend-developer | APIs, business logic, server-side code |
| security-engineer | OWASP, vulnerability assessment |
| devops-engineer | IaC, CI/CD, deployment |
| sre-engineer | Monitoring, observability, incident response |
| qa-engineer | Test strategy, generation, quality gates |
| database-engineer | Schema design, migrations, optimization |
| technical-writer | Documentation, ADRs, guides |

## Customizing for Your Team

1. Edit `.kiro/steering/team-context.md` — coding standards, architecture, security
2. Add extensions in `.kiro/aws-aidlc-rule-details/extensions/` — org-specific rules
3. Add skills in `.kiro/skills/` — team-specific expertise packages
