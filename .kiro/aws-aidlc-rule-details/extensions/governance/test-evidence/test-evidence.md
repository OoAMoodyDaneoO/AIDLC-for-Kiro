# Test Evidence & RCA Governance — Rules

## Purpose
Ensure all test results are formally documented with evidence trails, failed tests receive root cause analysis before any remediation, and test evidence is pushed to PM tools for audit compliance. Prevents the anti-pattern of modifying tests to pass without analyzing the underlying issue.

## Rule TE-01: Test Evidence Document Generation
**Rule**: Every test execution (unit, integration, performance, e2e, security, contract) MUST produce a formal test evidence document stored at `aidlc-docs/{feature-name}/construction/build-and-test/test-evidence-{test-type}-{YYYY-MM-DD}.md`.
**Verification**:
- [ ] Test evidence document is generated after each test execution
- [ ] Document includes: test type, execution timestamp, environment, pass/fail counts, coverage metrics
- [ ] Individual test case results are listed with status
- [ ] Test output/logs are captured or referenced

## Rule TE-02: Mandatory RCA on Test Failures
**Rule**: When any test fails, a Root Cause Analysis (RCA) MUST be performed and documented BEFORE any code or test modification is made. The agent MUST NOT modify test code to make it pass without first completing the RCA.
**Verification**:
- [ ] RCA is documented for every failed test
- [ ] RCA includes: failure description, stack trace/error output, root cause identification, impact assessment
- [ ] RCA is completed BEFORE any remediation code changes
- [ ] No test file is modified without a corresponding RCA entry

## Rule TE-03: RCA Structure
**Rule**: Each RCA entry MUST follow the standardized structure to ensure auditability.
**Verification**:
- [ ] Failure ID is assigned (TE-{feature}-{NNN})
- [ ] Test name and file path are recorded
- [ ] Error output is captured verbatim
- [ ] Root cause is identified with technical explanation
- [ ] Impact assessment covers: scope of impact, affected components, data integrity risk
- [ ] Classification is assigned: Code Defect, Design Gap, Environment Issue, Test Defect, Data Issue

## Rule TE-04: Remediation Plan for Failures
**Rule**: Every RCA MUST include a remediation plan with clear steps, justification for the chosen approach, and explanation of why the fix addresses the root cause (not just the symptom).
**Verification**:
- [ ] Remediation steps are documented before implementation
- [ ] Justification explains WHY this fix is correct
- [ ] Resolution pathway distinguishes between: fix application code, fix test code, fix both, update design
- [ ] If test code is modified, justification MUST explain why the test expectation was wrong

## Rule TE-05: Anti-Pattern Prevention
**Rule**: Test modifications that weaken assertions, remove test cases, or change expected values MUST be flagged and require explicit justification proving the original test was incorrect.
**Verification**:
- [ ] Any test assertion weakening is flagged in the RCA
- [ ] Removed test cases require documented justification
- [ ] Changed expected values require proof that the new expectation is correct
- [ ] Audit trail shows the analysis was done before the modification

## Rule TE-06: PM Tool Sync for Test Evidence
**Rule**: If PM tool sync is enabled, test evidence documents and RCA findings MUST be pushed to the PM tool.
**Verification**:
- [ ] Passing test evidence is attached/linked to the parent work item
- [ ] Failed test RCAs are pushed as sub-tasks/issues linked to the parent work item
- [ ] RCA remediation status is updated when fixes are applied and tests re-run
- [ ] Final test evidence (all passing) is attached to the work item before closure

## Rule TE-07: Test Evidence Summary
**Rule**: A consolidated test evidence summary MUST be generated at the end of Build and Test.
**Verification**:
- [ ] Summary stored at `aidlc-docs/{feature-name}/construction/build-and-test/test-evidence-summary.md`
- [ ] Summary includes: total tests, pass rate, coverage, all RCAs with resolution status
- [ ] Summary is referenced in build-and-test-summary.md
