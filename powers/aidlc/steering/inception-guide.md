# Inception Phase Guide

## Overview
Inception determines WHAT to build and WHY. Runs 7 stages (some conditional).

## Stages
1. **Workspace Detection** (Always) — Scans for existing code, asks about prototypes, determines greenfield/brownfield
2. **Intent Alignment** (Always) — Captures raw request, asks clarifying questions, produces refined intent. Gate: approve refined intent
3. **Requirements Analysis** (Always, adaptive depth) — FRs, NFRs, governance opt-ins. Gate: approve requirements
4. **User Stories** (Conditional) — Personas and stories with acceptance criteria. Gate: approve stories
5. **Workflow Planning** (Always) — Plans which Construction stages to execute. Gate: approve plan
6. **Application Design** (Conditional) — Component design, service boundaries. Gate: approve design
7. **Units Generation** (Conditional) — Decompose into units of work. Gate: approve units

## Tips
- Be specific in your initial request to reduce clarifying questions
- Mention your tech stack upfront if you know it
- Enable PM tool sync early so requirements push as you go
- The prototype-first option is asked after design completes
