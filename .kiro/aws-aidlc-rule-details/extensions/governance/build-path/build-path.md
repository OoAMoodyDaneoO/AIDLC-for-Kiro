# Build Path Selection — Rules

## Purpose
At the start of the AI-DLC workflow, give users the choice between building a lightweight prototype for rapid sense-checking or proceeding with the full enterprise-grade solution. The build path choice shapes the entire workflow — prototype mode streamlines stages for speed, while enterprise mode executes all stages at full depth. After a prototype is validated, users can transition back into the full AI-DLC loop for enterprise-grade build.

## Rule BP-01: Build Path Selection Timing (Dual Entry Points)
**Rule**: The build path question MUST be available at TWO points in the workflow:

### Entry Point 1 — Upfront (Intent Alignment)
Presented during Intent Alignment, immediately after the refined intent is approved and BEFORE Requirements Analysis begins. This is for users who already know they want to prototype first.

### Entry Point 2 — Bottom-Up (End of Construction Design)
Presented after ALL Construction design stages complete and units/tasks are defined, but BEFORE Code Generation begins. This is for users who chose Enterprise-Grade upfront but now want to sense-check with a prototype before committing to full code generation. If the ARB extension is enabled, this comes AFTER ARB approval.

**Verification**:
- [ ] Build path question is available during Intent Alignment (Entry Point 1)
- [ ] Build path question is available after Construction design completion (Entry Point 2)
- [ ] If user chose Prototype at Entry Point 1, Entry Point 2 is skipped (already on prototype path)
- [ ] If user chose Enterprise-Grade at Entry Point 1, Entry Point 2 offers a second chance to prototype
- [ ] The chosen path influences all subsequent stage execution

## Rule BP-02: Build Path Question
**Rule**: Present the appropriate question based on which entry point is active:

### Entry Point 1 Question (Intent Alignment)
```markdown
## Build Path Selection

Now that your intent is clear, how would you like to proceed?

A) **Prototype First** — Build a lightweight, working prototype quickly to sense-check the concept. Some stages will be streamlined or skipped to accelerate delivery. You can transition to a full enterprise build later.

B) **Enterprise-Grade Build** — Proceed through the full AI-DLC lifecycle with comprehensive requirements, design, testing, and production readiness.

[Answer]:
```

### Entry Point 2 Question (End of Construction Design)
Only presented if the user chose Enterprise-Grade at Entry Point 1 (or if Entry Point 1 was skipped).
```markdown
## Build Path Check — Pre-Code Generation

Your design is complete and all units/tasks are defined. Before committing to full code generation, would you like to build a quick prototype to sense-check the design?

A) **Build a Prototype First** — Create a lightweight working prototype from the defined units to validate the design before the full enterprise build. The prototype covers the core happy-path only.

B) **Proceed to Full Code Generation** — Continue directly to enterprise-grade code generation for all units as planned.

[Answer]:
```

**Verification**:
- [ ] Correct question variant is presented based on entry point
- [ ] User's response is logged in audit.md
- [ ] Build path choice is recorded in aidlc-state.md immediately
- [ ] Entry Point 2 is skipped if user already chose Prototype at Entry Point 1

## Rule BP-03: Prototype Path — Stage Adaptations (Entry Point 1 — Upfront)
**Rule**: When Prototype is selected at Entry Point 1 (Intent Alignment), the following stages are adapted to accelerate delivery:

### Inception Phase Adaptations
| Stage | Prototype Behavior |
|---|---|
| Workspace Detection | Normal (ALWAYS) |
| Intent Alignment | Normal (ALWAYS) — build path selected here |
| Requirements Analysis | **Minimal depth** — capture core FRs only, skip comprehensive NFRs |
| User Stories | **SKIP** — not needed for prototype |
| Workflow Planning | **Simplified** — auto-plan for prototype path, no user approval needed |
| Application Design | **Simplified** — high-level component sketch only |
| Units Generation | **SKIP** — single prototype unit auto-created |

### Construction Phase Adaptations
| Stage | Prototype Behavior |
|---|---|
| Functional Design | **Simplified** — core data model and happy-path logic only |
| NFR Requirements | **SKIP** — not applicable for prototype |
| NFR Design | **SKIP** — not applicable for prototype |
| Infrastructure Design | **SKIP** — not applicable for prototype |
| Code Generation | **Prototype scope** — single unit, happy-path, smoke tests |
| Build and Test | **Simplified** — smoke tests and basic build verification only |

**Verification**:
- [ ] Skipped stages are marked as "Skipped (Prototype)" in aidlc-state.md
- [ ] Simplified stages execute at minimal depth
- [ ] No approval gates for skipped stages
- [ ] Workflow planning auto-generates the prototype execution plan

## Rule BP-03b: Prototype Path — Bottom-Up (Entry Point 2 — Post-Design)
**Rule**: When Prototype is selected at Entry Point 2 (end of Construction design), all Inception and Construction design stages have ALREADY completed at full enterprise depth. The prototype is built from the fully-defined units as a sense-check before committing to full code generation.

### Behavior
- All Inception stages: **Already complete** — no changes
- All Construction design stages (Functional Design, NFR Requirements, NFR Design, Infrastructure Design): **Already complete** — no changes
- Code Generation: **Prototype scope** — create a single `prototype` unit that cherry-picks the core happy-path from the defined units. Generate minimal code covering the primary user journey.
- Build and Test: **Simplified** — smoke tests and basic build verification only

### Key Difference from Entry Point 1
Entry Point 2 preserves ALL design artifacts and enterprise-depth analysis. The prototype is a lightweight implementation of the already-complete design, not a shortcut through the design process. When the user transitions to full build after the prototype, Code Generation simply proceeds with the remaining units — no stages need to be re-run.

**Verification**:
- [ ] All design stages remain marked as complete in aidlc-state.md
- [ ] Prototype unit is created from the existing unit definitions (not replacing them)
- [ ] Build path is recorded as "Prototype First (Post-Design)" in aidlc-state.md
- [ ] After prototype approval, Code Generation resumes for remaining units without re-running design stages

## Rule BP-04: Prototype Path — Unit Creation
**Rule**: If the user chooses Prototype, a single prototype unit of work MUST be created that covers the core functionality with minimal scope.
**Verification**:
- [ ] Prototype unit is created as `prototype` in the units list
- [ ] Prototype scope is explicitly defined and limited
- [ ] Prototype is marked as a pre-cursor to the full build

### Prototype Unit Scope Rules
The prototype unit MUST:
- Cover the core happy-path user journey end-to-end
- Include the primary data model (simplified if needed)
- Include a working UI or API (depending on project type)
- Be runnable and demonstrable
- Use the chosen tech stack (same as the full build)

The prototype unit MUST NOT:
- Implement full error handling (basic only)
- Implement production NFRs (performance, scalability, HA)
- Include comprehensive test suites (smoke tests only)
- Include infrastructure-as-code or deployment automation
- Include authentication/authorization (unless core to the feature)
- Include all edge cases or secondary workflows

### Prototype Code Generation Plan
The prototype code generation plan should follow this structure:
1. Project scaffolding (minimal structure)
2. Core data model implementation
3. Primary business logic (happy path only)
4. Basic UI or API layer (functional, not polished)
5. Smoke tests (verify it works end-to-end)
6. README with run instructions

## Rule BP-05: Prototype Review Gate
**Rule**: After the prototype is built, a review gate MUST be presented where the user can run, test, and evaluate the prototype before deciding next steps.
**Verification**:
- [ ] Prototype is complete and runnable
- [ ] User is presented with run instructions
- [ ] Review gate offers clear next-step options

### Prototype Review Completion Message
```markdown
# 🧪 Prototype Complete

A lightweight working prototype has been generated. You can run it to sense-check the concept.

**Run Instructions**: See README.md or the prototype code generation summary.

> **🚀 WHAT'S NEXT?**
>
> 🔄 **Iterate on Prototype** — Request changes based on your testing
> ✅ **Transition to Enterprise Build** — Re-enter the full AI-DLC loop for enterprise-grade implementation
> 🔀 **Use Prototype as Brownfield** — Start the enterprise AI-DLC loop using prototype code as the baseline
> 🗑️ **Discard & Restart** — Start fresh with a new approach
```

## Rule BP-06: Transition to Enterprise Build (Prototype → Enterprise)
**Rule**: When the user approves the prototype and chooses to transition to enterprise, the transition flow depends on which entry point was used:

### Transition from Entry Point 1 (Upfront Prototype)
The AI-DLC workflow MUST re-enter from the beginning with the prototype context carried forward. Stages that were skipped during prototype now execute at full depth.

1. **User triggers transition** — via prototype review gate or the `aidlc-prototype-to-enterprise` hook
2. **Record transition** — update aidlc-state.md
3. **Reset stage progress** — all stages reset to pending EXCEPT:
   - Workspace Detection → marked complete (already done)
   - Intent Alignment → marked complete (refined intent carries forward)
   - If "Brownfield from Prototype": Reverse Engineering executes against prototype code
4. **Re-enter AI-DLC loop** — start from Requirements Analysis with full enterprise depth:
   - Requirements Analysis at **comprehensive** depth (prototype learnings inform requirements)
   - User Stories **execute** (skipped during prototype)
   - Workflow Planning at **full** depth
   - Application Design at **full** depth
   - All Construction stages at **full** depth including NFRs, infrastructure, comprehensive testing
5. **Carry forward prototype artifacts**:
   - Prototype requirements feed into enterprise requirements as a baseline
   - Prototype code informs design decisions
   - Vibe-coded changes (if any) with `[VIBE-ADDED]` tags are included in requirements
   - Prototype smoke tests inform the enterprise test strategy

### Transition from Entry Point 2 (Post-Design Prototype)
All design stages are already complete at enterprise depth. The transition simply resumes Code Generation for the remaining units.

1. **User triggers transition** — via prototype review gate or the `aidlc-prototype-to-enterprise` hook
2. **Record transition** — update aidlc-state.md
3. **No stage reset needed** — all Inception and Construction design stages remain complete
4. **Resume Code Generation** — proceed with full enterprise-grade code generation for all defined units
   - If "Brownfield from Prototype": Code Generation extends/modifies prototype code for remaining units
   - If "Clean Build": Code Generation generates all units fresh, prototype kept as reference
5. **Build and Test** at full enterprise depth (comprehensive test suites, not just smoke tests)

**Verification**:
- [ ] Transition approach is logged in audit.md
- [ ] aidlc-state.md is updated with transition decision
- [ ] Correct transition flow is followed based on entry point used

### Transition Approaches (Both Entry Points)
- **Clean Build**: Prototype kept as reference only. Full build generates all code fresh.
- **Brownfield from Prototype**: Prototype code becomes the starting point. Code Generation modifies/extends existing files.

## Rule BP-07: State Tracking
**Rule**: The build path choice, entry point, prototype status, and transition state MUST be tracked in aidlc-state.md.

```markdown
## Build Path
- **Selected Path**: [Prototype First / Prototype First (Post-Design) / Enterprise-Grade Build / Enterprise-Grade Build (Transitioned from Prototype)]
- **Entry Point**: [Intent Alignment / Post-Design / N/A]
- **Prototype Status**: [Not Started / In Progress / Complete / Approved / Skipped]
- **Transition Approach**: [Clean Build / Brownfield from Prototype / N/A]
- **Transition Date**: [ISO timestamp / N/A]
- **Enterprise Loop**: [Not Started / In Progress / Complete / N/A]
```

## Rule BP-08: Prototype Vibe Coding Feedback Loop
**Rule**: When a user vibe codes changes on top of a prototype, the agent MUST analyze the changes for gaps between what has been implemented and what is documented in requirements, user stories, and units of work. Any gaps MUST be fed back into the AI-DLC artifacts.
**Verification**:
- [ ] After each vibe-coded write to prototype code, a gap analysis is performed
- [ ] New functionality not covered by existing requirements is identified
- [ ] New functionality not covered by existing user stories is identified
- [ ] Changes that contradict existing requirements/stories are flagged
- [ ] Gaps are presented to the user for confirmation before updating artifacts

### Vibe Feedback Flow
1. **Detect**: When code is written to the prototype workspace and `aidlc-state.md` shows `Prototype Status: Complete` or `In Progress`, the vibe-sync hook triggers gap analysis
2. **Analyze**: Compare the code change against:
   - Functional requirements in `aidlc-docs/{feature}/inception/requirements/requirements.md`
   - User stories in `aidlc-docs/{feature}/inception/user-stories/`
   - Unit definitions and task lists in `aidlc-docs/{feature}/construction/plans/`
   - Functional design in `aidlc-docs/{feature}/construction/*/functional-design/`
3. **Classify** each gap:
   - **New Requirement**: Functionality that doesn't map to any existing FR/NFR
   - **Modified Requirement**: Functionality that changes the intent of an existing FR/NFR
   - **New User Story**: User-facing behavior not captured in any existing story
   - **Modified User Story**: Changes to acceptance criteria or story scope
   - **New Unit of Work**: Functionality that falls outside existing unit boundaries
   - **Design Deviation**: Implementation that contradicts the approved design
4. **Report**: Present a gap summary to the user in chat
5. **Update** (on user approval): Append new items with `[VIBE-ADDED]` tag, log in audit.md
6. **Skip** if the code change is purely within the existing documented scope

### Gap Analysis Thresholds
- **Minor gaps** (cosmetic, naming, small UX tweaks): Log but don't require artifact updates
- **Moderate gaps** (new fields, new API endpoints, new UI components): Require artifact updates
- **Major gaps** (new business logic, new user workflows, architectural changes): Require artifact updates AND flag for design review

## Rule BP-09: Enterprise-Grade Path (Direct)
**Rule**: If the user chooses Enterprise-Grade Build directly at Intent Alignment, proceed through all stages at full depth with no changes to the existing workflow.
**Verification**:
- [ ] Build path recorded as "Enterprise-Grade Build" in aidlc-state.md
- [ ] Prototype Status set to "Skipped"
- [ ] All stages execute at standard/comprehensive depth
