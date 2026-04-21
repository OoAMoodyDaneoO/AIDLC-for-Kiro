---
inclusion: always
---

# AI-DLC: Enterprise Governance Framework

## Overview
This steering file coordinates the enterprise governance extensions: ARB Artifact Generation, Design Review Checkpoints, Test Evidence & RCA Governance, and enhanced PM Tool Integration. These work together to provide enterprise-grade audit trails, compliance checkpoints, and traceability.

## Prototype / Existing Code Detection

### When to Ask
During Workspace Detection (before Intent Alignment), if the workspace is greenfield, ask:

```markdown
## Question: Existing Starting Point
Do you have an existing prototype, proof-of-concept, or source code that should serve as a starting point for this project?

A) Yes — I have source code already in this workspace directory
B) Yes — I have code in a separate repository that I need to import first
C) Yes — I have a prototype/PoC that I'd like Kiro to review and understand before we proceed
D) No — this is a completely new project starting from scratch

[Answer]:
```

### Handling Responses

**If A (code already in workspace)**:
1. Treat as brownfield — proceed with Reverse Engineering
2. Provide a summary of the detected code structure, tech stack, and key components
3. Ask: "Is this an accurate understanding of your existing code? Should I proceed with this as the baseline?"
4. Log confirmation in audit.md

**If B (code in separate repo)**:
1. Ask the user to import/clone the code into the workspace directory
2. Provide guidance: "Please clone or copy your code into this workspace, then let me know when it's ready. I'll analyze it before we proceed."
3. Wait for user confirmation, then treat as brownfield

**If C (prototype to review)**:
1. Ask: "Please point me to the prototype — is it in this workspace, a URL, or a separate repo?"
2. If in workspace: analyze and provide a structured summary:
   - Technology stack detected
   - Key components and their responsibilities
   - Architecture patterns observed
   - Data models identified
   - API endpoints (if any)
   - Test coverage (if any)
   - Areas that appear incomplete or placeholder
3. Ask: "Is this an accurate understanding of your prototype? What should we keep, what should we redesign, and what should we discard?"
4. Use the confirmed understanding as input to Requirements Analysis

**If D (completely new)**:
1. Proceed with standard greenfield flow — no additional action needed

## ARB Artifact Checkpoint

### When It Triggers
After ALL Construction design stages complete for ALL units and BEFORE Code Generation begins.

### Flow
1. Check `aidlc-state.md` for ARB extension status (`Enabled: Yes`)
2. If enabled, generate the ARB artifact using the template from `extensions/governance/arb-artifact/arb-template.md`
3. Auto-populate sections from AI-DLC artifacts
4. Leave enterprise-specific sections as placeholders with guidance
5. Present to user for review — this is a HARD GATE before Code Generation
6. If PM tool sync is enabled, attach ARB document link to the Epic
7. Log in audit.md

## Build Path Selection (Prototype vs Enterprise-Grade)

### When It Triggers
At TWO points in the workflow (dual entry points):

**Entry Point 1 — Upfront (Intent Alignment)**: During Intent Alignment, immediately after the refined intent is approved and BEFORE Requirements Analysis begins. For users who know upfront they want to prototype first. Streamlines the entire downstream workflow.

**Entry Point 2 — Bottom-Up (End of Construction Design)**: After ALL Construction design stages complete and units/tasks are defined, but BEFORE Code Generation begins. For users who went enterprise-grade but want to sense-check with a prototype before committing to full code generation. If ARB extension is enabled, this comes AFTER ARB approval.

### Flow
1. Check `aidlc-state.md` for Build Path extension status
2. **Entry Point 1**: Present build path question during Intent Alignment
3. **Entry Point 2**: If user chose Enterprise-Grade at Entry Point 1, present a second-chance prototype question after Construction design completes
4. **If Prototype First (Entry Point 1)**:
   - Record choice in aidlc-state.md immediately
   - Streamline downstream stages: minimal requirements, skip user stories, simplified design, skip NFRs/infrastructure
   - Create a single `prototype` unit, build it, present review gate
5. **If Prototype First (Entry Point 2)**:
   - All design stages already complete at full depth — preserved as-is
   - Create a prototype unit cherry-picked from defined units (core happy-path)
   - Build prototype, present review gate
   - Transition to full build simply resumes Code Generation for remaining units (no stage re-run needed)
6. **If Enterprise-Grade Build**: Record choice, proceed through all stages at full depth
7. Log in audit.md

## Prototype-to-Enterprise Transition

### When It Triggers
- At the prototype review gate after prototype completion
- Manually via the `aidlc-prototype-to-enterprise` hook (user-triggered)

### Flow
1. Verify prototype is complete or approved in `aidlc-state.md`
2. Ask user for transition approach: Clean Build or Brownfield from Prototype
3. Update `aidlc-state.md`: set path to "Enterprise-Grade Build (Transitioned from Prototype)", record transition approach and date
4. Reset all stage progress to pending EXCEPT Workspace Detection and Intent Alignment (kept as complete)
5. If Brownfield: Reverse Engineering runs against prototype code
6. Re-enter AI-DLC loop at Requirements Analysis with full enterprise depth
7. Carry forward: prototype requirements as baseline, any [VIBE-ADDED] items, prototype learnings
8. All previously skipped stages (User Stories, NFRs, Infrastructure Design, etc.) now execute at full depth
9. Log transition in audit.md

## Design Review Checkpoint

### When It Triggers
- Manually via the `aidlc-design-review` hook (user-triggered)
- Recommended trigger points: after Code Generation, after Build & Test, before release

### Flow
1. Check `aidlc-state.md` for Design Review extension status
2. If enabled, scan all design artifacts and compare against implementation
3. Generate drift detection report with severity ratings
4. Produce remediation plan for each drift item
5. If PM tool sync is enabled, push Critical/High findings as issues
6. Log in audit.md

## Security Review Checkpoint

### When It Triggers
- Manually via the `aidlc-security-review` hook (user-triggered)
- Recommended trigger points: after Code Generation, after Build & Test, before release, or at any point during Construction
- Complementary to Design Review — focuses on vulnerability assessment rather than architectural drift

### Flow
1. Check `aidlc-state.md` for Security Review extension status (`Enabled: Yes`)
2. If enabled, scan all generated code and design artifacts for the active feature
3. Assess against: OWASP Top 10, authentication/authorization patterns, input validation, secrets management, dependency vulnerabilities, API security, data protection, infrastructure security, error handling, session management
4. Generate structured findings report with severity ratings (Critical/High/Medium/Low), CVSS-style scores, affected components, evidence, and remediation plans
5. Store report at `aidlc-docs/{feature-name}/construction/adrs/security-review-{YYYY-MM-DD}.md`
6. If PM tool sync is enabled, push Critical/High findings as issues
7. Log in audit.md

## AI Compliance Review Checkpoint

### When It Triggers
- As a stage gate: after ALL Construction design stages complete and BEFORE Code Generation begins (alongside ARB if enabled). Only triggers for solutions with detected AI/ML capabilities. This is a HARD GATE.
- Manually via the `aidlc-ai-compliance` hook (user-triggered) at any point — recommended after Code Generation, after Build & Test, or before release.

### Flow
1. Check `aidlc-state.md` for AI Compliance extension status (`Enabled: Yes`)
2. Detect AI capabilities in the solution (scan requirements, design, code for AI/ML indicators)
3. If no AI capabilities detected, skip (log in audit.md)
4. Assess against built-in standards: responsible AI principles, model governance, data privacy, bias/fairness, explainability, EU AI Act risk classification, security/robustness, monitoring/operations
5. If customer-provided AI governance standards are configured, assess against those too
6. Generate structured compliance report with per-domain scores, severity ratings, and remediation plans
7. Store report at `aidlc-docs/{feature-name}/construction/adrs/ai-compliance-review-{YYYY-MM-DD}.md`
8. Stage gate mode: HARD GATE — Code Generation blocked until approved
9. If PM tool sync is enabled, push Critical/High findings as issues
10. Log in audit.md

## Test Evidence Governance

### When It Triggers
- Via the `aidlc-test-rca` hook when test files are modified

### Flow
1. Check `aidlc-state.md` for Test Evidence extension status
2. If enabled, generate test evidence document after each test run
3. On failures: perform RCA BEFORE any code/test modification
4. Document remediation plan with justification
5. Flag any test assertion weakening or test removal
6. If PM tool sync is enabled, push evidence and RCA findings
7. Generate consolidated test evidence summary at end of Build & Test
8. Log all RCA entries in audit.md

## Permit to Operate (PTO)

### When It Triggers
After Build & Test completes successfully and BEFORE any production deployment (Operations phase). Triggered by the `aidlc-pto-gate` hook when the build-and-test-summary.md is updated.

### Flow
1. Check `aidlc-state.md` for PTO extension status
2. If enabled, verify Build & Test is complete and all tests pass
3. Generate the PTO artifact at `aidlc-docs/{feature-name}/operations/permit-to-operate.md`
4. Auto-populate from: refined intent (solution overview), NFR design (technology stack), infrastructure design (cost baseline), security findings (security sign-off), test evidence summary (test results), design review reports (drift status), ARB artifact (architecture)
5. Leave enterprise-specific sections as placeholders: detailed costs, support model tiers, operating model, approval history
6. Present to user for review — this is a HARD GATE before production deployment
7. If PM tool sync is enabled, attach PTO to the Epic and create "PTO Pending Approval" status
8. Log in audit.md

## PM Tool External Change Detection

### When It Triggers
- Manually via the `aidlc-pm-pull` hook (user-triggered)

### Flow
1. Check `aidlc-state.md` for PM tool configuration
2. If sync enabled, query PM tool for changes to linked work items since last sync
3. Compare PM tool state against AI-DLC artifacts
4. Report any external changes
5. Ask user whether to incorporate changes into AI-DLC artifacts
6. Log sync results in audit.md
