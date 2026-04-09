---
name: aidlc-workflow
description: AI-DLC methodology workflow guide. Use when orchestrating the three-phase AI-DLC lifecycle (Inception, Construction, Operations), managing stage gates, or coordinating specialist agents.
metadata:
  author: aidlc-framework
  version: "1.0"
  agents: aidlc-orchestrator
---

# AI-DLC Workflow

## Three-Phase Lifecycle
1. INCEPTION — Determine WHAT to build and WHY
2. CONSTRUCTION — Determine HOW to build it
3. OPERATIONS — How to DEPLOY and RUN it

## Core Pattern
AI creates plan → AI asks questions → Human validates → AI implements

## Key Rules
- Never skip the plan-then-validate-then-execute cycle
- All questions go in `.md` files, never in chat
- Log everything in audit.md
- Update aidlc-state.md after every stage transition
