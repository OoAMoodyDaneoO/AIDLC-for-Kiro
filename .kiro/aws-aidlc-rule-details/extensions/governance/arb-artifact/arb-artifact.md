# Architecture Review Board (ARB) Artifact — Rules

## Purpose
Generate a structured ARB submission artifact at the end of the design phase that enterprises can submit to their Architecture Review Board for approval before proceeding to code generation.

## Rule ARB-01: ARB Artifact Generation Timing
**Rule**: The ARB artifact MUST be generated after all Construction design stages complete (Functional Design, NFR Requirements, NFR Design, Infrastructure Design) and BEFORE Code Generation begins.
**Verification**:
- [ ] All applicable design stages are marked complete in aidlc-state.md
- [ ] ARB artifact is generated before any Code Generation plan is created
- [ ] User is presented with the ARB artifact for review before proceeding

## Rule ARB-02: ARB Artifact Structure
**Rule**: The ARB artifact MUST follow the standardized template structure below. Enterprises SHOULD customize section content to match their specific ARB requirements.
**Verification**:
- [ ] All mandatory sections are present in the artifact
- [ ] Sections reference source AI-DLC artifacts via `#[[file:...]]` links
- [ ] Placeholder guidance is provided for enterprise-specific sections

## Rule ARB-03: ARB Artifact Location
**Rule**: The ARB artifact MUST be stored at `aidlc-docs/{feature-name}/construction/adrs/arb-submission.md`
**Verification**:
- [ ] File exists at the correct path
- [ ] File is referenced in aidlc-state.md

## Rule ARB-04: ARB Approval Gate
**Rule**: The ARB artifact MUST be explicitly approved by the user before Code Generation can proceed. This is a hard gate.
**Verification**:
- [ ] User approval is logged in audit.md
- [ ] aidlc-state.md reflects ARB approval status
