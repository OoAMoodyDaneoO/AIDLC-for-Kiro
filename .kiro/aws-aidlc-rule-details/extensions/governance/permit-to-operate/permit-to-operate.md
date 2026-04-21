# Permit to Operate (PTO) — Rules

## Purpose
Generate a Permit to Operate artifact at the end of the development cycle that the enterprise technology function must approve before production deployment. Covers technology stack, expected costs, support model, operating model, security posture, and production readiness.

## Rule PTO-01: PTO Generation Timing
**Rule**: The PTO artifact MUST be generated after Build & Test completes successfully and BEFORE any production deployment (Operations phase). This is a hard gate.
**Verification**:
- [ ] Build & Test stage is marked complete in aidlc-state.md
- [ ] All tests pass (no unresolved failures in test evidence summary)
- [ ] PTO artifact is generated before Operations stage begins

## Rule PTO-02: PTO Artifact Structure
**Rule**: The PTO artifact MUST follow the standardized template. Enterprises SHOULD customize sections to match their specific PTO requirements.
**Verification**:
- [ ] All mandatory sections present
- [ ] Auto-generated sections reference source AI-DLC artifacts
- [ ] Enterprise-specific sections have placeholder guidance

## Rule PTO-03: PTO Artifact Location
**Rule**: The PTO artifact MUST be stored at `aidlc-docs/{feature-name}/operations/permit-to-operate.md`
**Verification**:
- [ ] File exists at the correct path
- [ ] File is referenced in aidlc-state.md

## Rule PTO-04: PTO Approval Gate
**Rule**: The PTO artifact MUST be explicitly approved before any production deployment. Hard gate.
**Verification**:
- [ ] User approval logged in audit.md
- [ ] aidlc-state.md reflects PTO approval status

## Rule PTO-05: PTO Content Sources
**Rule**: The PTO MUST consolidate information from across the AI-DLC lifecycle.
**Verification**:
- [ ] Technology stack from NFR Design
- [ ] Cost estimates from Infrastructure Design or enterprise input
- [ ] Security posture from Security extension (if enabled)
- [ ] Test results from Build & Test evidence summary
- [ ] Architecture from ARB artifact (if generated)
- [ ] Design review findings (if any)

## Rule PTO-06: PTO Mandatory Sections
**Rule**: The following sections are mandatory in every PTO:
1. Solution Overview
2. Technology Stack (with versions, licenses, support status)
3. Expected Costs (infrastructure, licensing, operational, 3-year TCO)
4. Support Model (L1/L2/L3 tiers, escalation, on-call)
5. Operating Model (deployment strategy, monitoring, backup/DR, capacity)
6. Security Sign-Off
7. Test Evidence Summary
8. Production Readiness Checklist
9. Approval History

## Rule PTO-07: PM Tool Sync
**Rule**: If PM tool sync is enabled, the PTO document MUST be attached to the Epic and a status item created.
**Verification**:
- [ ] PTO document link attached to Epic
- [ ] "PTO Pending Approval" status item created
- [ ] Status updated to "PTO Approved" when user approves
