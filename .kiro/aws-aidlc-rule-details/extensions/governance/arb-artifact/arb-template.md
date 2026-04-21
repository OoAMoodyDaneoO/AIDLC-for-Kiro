# ARB Artifact Template

This template is used by the ARB artifact generation rule to produce the submission document. The agent populates auto-generated sections from AI-DLC artifacts and leaves enterprise-specific sections as placeholders.

```markdown
# Architecture Review Board (ARB) Submission

## Document Control
| Field | Value |
|---|---|
| Feature Name | {feature-name} |
| Author | [Enterprise: Add author name] |
| Date | [ISO date] |
| Version | 1.0 |
| Status | Draft — Pending ARB Review |
| ARB Reference | [Enterprise: Add ARB ticket/reference number] |

---

## 1. Executive Summary
[Auto-generated from refined-intent.md]

**Source**: #[[file:aidlc-docs/{feature-name}/inception/intent/refined-intent.md]]

---

## 2. Business Context & Requirements

### 2.1 Functional Requirements Summary
[Auto-generated from requirements artifacts]

### 2.2 Non-Functional Requirements Summary
[Auto-generated from NFR requirements artifacts]

**Sources**:
- #[[file:aidlc-docs/{feature-name}/inception/requirements/requirements.md]]
- #[[file:aidlc-docs/{feature-name}/construction/{unit-name}/nfr-requirements/]]

---

## 3. Architecture Overview

### 3.1 High-Level Architecture
### 3.2 Component Architecture
### 3.3 Data Architecture

**Sources**:
- #[[file:aidlc-docs/{feature-name}/inception/application-design/]]
- #[[file:aidlc-docs/{feature-name}/construction/{unit-name}/functional-design/]]

---

## 4. Technology Stack

| Layer | Technology | Justification |
|---|---|---|
| Frontend | [Technology] | [Why chosen] |
| Backend | [Technology] | [Why chosen] |
| Database | [Technology] | [Why chosen] |
| Infrastructure | [Technology] | [Why chosen] |

**Source**: #[[file:aidlc-docs/{feature-name}/construction/{unit-name}/nfr-design/]]

---

## 5. Infrastructure & Deployment

### 5.1 Deployment Architecture
### 5.2 Scalability Strategy
### 5.3 Disaster Recovery

**Source**: #[[file:aidlc-docs/{feature-name}/construction/{unit-name}/infrastructure-design/]]

---

## 6. Security Architecture
[Enterprise: Customize — detail auth, data protection, network security, compliance]

---

## 7. Architecture Decision Records (ADRs)

| ADR | Decision | Status | Rationale |
|---|---|---|---|
| [ADR-001] | [Title] | Accepted | [Rationale] |

**Source**: #[[file:aidlc-docs/{feature-name}/construction/adrs/]]

---

## 8. Risk Assessment
[Enterprise: Customize risk categories and thresholds]

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| [Risk 1] | [H/M/L] | [H/M/L] | [Strategy] |

---

## 9. Cost Estimate
[Enterprise: Add cost estimation methodology]

---

## 10. Migration & Rollback Strategy
[Enterprise: Detail migration/rollback approach]

---

## 11. Operational Readiness
[Enterprise: Detail monitoring, runbooks, support model]

---

## 12. ARB Review Checklist
[Enterprise: Customize to match your ARB requirements]

- [ ] Architecture aligns with enterprise reference architecture
- [ ] Technology choices are on the approved technology radar
- [ ] Security requirements meet enterprise security baseline
- [ ] Data architecture complies with data governance policies
- [ ] Infrastructure design follows cloud best practices
- [ ] Cost estimates are within budget parameters
- [ ] DR/BC requirements are addressed
- [ ] Operational readiness plan is complete
- [ ] All ADRs are documented and justified
- [ ] Compliance requirements are addressed

---

## 13. Appendices

### Appendix A: Glossary
### Appendix B: Reference Documents
### Appendix C: Approval History

| Date | Reviewer | Decision | Comments |
|---|---|---|---|
| [Date] | [Name] | [Approved/Rejected/Conditional] | [Comments] |
```
