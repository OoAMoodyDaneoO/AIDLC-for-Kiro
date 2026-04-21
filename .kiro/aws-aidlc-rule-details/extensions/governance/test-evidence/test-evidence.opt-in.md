# Test Evidence & RCA Governance — Opt-In

**Extension**: Test Evidence Documentation & Root Cause Analysis

## Opt-In Prompt

```markdown
## Question: Test Evidence & RCA Governance
Should test evidence governance be enforced for this project? This ensures all test results are documented with full evidence trails, failed tests receive root cause analysis (RCA) with remediation plans, and test evidence is pushed to your PM tool.

A) Yes — enforce test evidence documentation, RCA on failures, and PM tool sync
B) No — standard test execution without formal evidence governance
X) Other (please describe after [Answer]: tag below)

[Answer]: 
```

## Notes
- When opted in, every test execution produces a formal test evidence document
- Failed tests trigger mandatory RCA analysis before any test modification is allowed
- RCA includes: failure description, root cause, impact assessment, remediation plan, justification
- Prevents "fix the test to pass" anti-pattern — tests cannot be modified without documented analysis
- If PM tool sync is enabled, test evidence and RCA findings are pushed as attachments/comments
