# AI Compliance Review — Rules

## Purpose
Provide a comprehensive AI compliance review capability for solutions that include AI/ML capabilities. Works as both a stage gate (before Code Generation) and an on-demand checkpoint (manually triggered at any point). Assesses against responsible AI best practices, regulatory requirements, and customer-provided AI governance standards.

## Rule AIC-01: AI Compliance Review Trigger (Dual Mode)
**Rule**: The AI compliance review operates in two modes:

### Stage Gate Mode
Triggered automatically after ALL Construction design stages complete and BEFORE Code Generation begins (alongside ARB if enabled). This is a HARD GATE for AI-containing solutions — Code Generation MUST NOT proceed until the AI compliance review is approved.

### On-Demand Mode
Available as a manually-triggered review at any point via the `aidlc-ai-compliance` hook. Recommended trigger points: after Code Generation, after Build & Test, before release, or whenever AI components are modified.

**Verification**:
- [ ] Stage gate triggers after Construction design for AI-containing solutions
- [ ] On-demand hook `aidlc-ai-compliance` is configured and available
- [ ] Stage gate is a hard gate — blocks Code Generation until approved
- [ ] On-demand reviews produce findings but do not block workflow

## Rule AIC-02: AI Capability Detection
**Rule**: The review MUST first determine whether the solution contains AI capabilities by scanning requirements, design artifacts, and code for AI/ML indicators.
**Verification**:
- [ ] Scan for: model training, inference endpoints, LLM integration, AI agents, embeddings, RAG pipelines, vector databases, prompt engineering, fine-tuning, ML pipelines, computer vision, NLP, recommendation engines
- [ ] If no AI capabilities detected, skip the stage gate (log skip in audit.md)
- [ ] If AI capabilities detected, proceed with full compliance review

## Rule AIC-03: Review Scope — Built-in Standards
**Rule**: The AI compliance review MUST assess against the following built-in standards and best practices:

### Responsible AI Principles
- [ ] Fairness: bias detection and mitigation strategies documented
- [ ] Transparency: model decisions are explainable to end users
- [ ] Accountability: clear ownership of AI system behavior
- [ ] Privacy: user data handling complies with privacy requirements
- [ ] Safety: guardrails and safety mechanisms in place
- [ ] Human oversight: human-in-the-loop mechanisms where appropriate

### Model Governance
- [ ] Model versioning and lineage tracking
- [ ] Training data provenance and documentation
- [ ] Model performance metrics and thresholds defined
- [ ] Model drift detection and monitoring planned
- [ ] Model rollback procedures documented
- [ ] A/B testing or canary deployment strategy for model updates

### Data Privacy & Protection
- [ ] Training data privacy assessment (PII handling, anonymization)
- [ ] Inference data privacy (input/output data retention policies)
- [ ] GDPR/CCPA compliance for AI-processed personal data
- [ ] Data minimization principles applied
- [ ] Right to explanation for automated decisions
- [ ] Data processing agreements for third-party AI services

### Bias & Fairness
- [ ] Protected attributes identified and documented
- [ ] Bias testing methodology defined
- [ ] Fairness metrics selected and thresholds set
- [ ] Disparate impact analysis planned
- [ ] Bias mitigation strategies documented
- [ ] Ongoing bias monitoring in production planned

### Explainability & Interpretability
- [ ] Model explainability approach documented (SHAP, LIME, attention, etc.)
- [ ] User-facing explanations designed for automated decisions
- [ ] Audit trail for AI-driven decisions
- [ ] Feature importance documentation
- [ ] Decision boundary documentation for classification models

### Regulatory Compliance
- [ ] EU AI Act risk classification assessed (Unacceptable/High/Limited/Minimal)
- [ ] If High Risk: conformity assessment requirements identified
- [ ] Industry-specific AI regulations identified (healthcare, finance, etc.)
- [ ] Cross-border data transfer compliance for AI workloads
- [ ] Intellectual property considerations for training data and model outputs

### Security & Robustness
- [ ] Adversarial attack resistance assessed (prompt injection, data poisoning, model extraction)
- [ ] Input validation for AI endpoints
- [ ] Output filtering and content safety
- [ ] Rate limiting for AI inference endpoints
- [ ] Model access controls and authentication

### Monitoring & Operations
- [ ] Model performance monitoring planned
- [ ] Data drift detection planned
- [ ] Incident response procedures for AI failures
- [ ] Feedback loops for continuous improvement
- [ ] Cost monitoring for AI compute resources

## Rule AIC-04: Customer-Provided Standards
**Rule**: If the user provided custom AI governance standards (opt-in option C), these MUST be loaded and assessed alongside the built-in standards.
**Verification**:
- [ ] Custom standards document path is recorded in aidlc-state.md
- [ ] Each custom standard is assessed with pass/fail/N/A
- [ ] Custom standard findings are included in the compliance report
- [ ] Non-compliance with customer standards is a blocking finding

### Custom Standards Configuration in aidlc-state.md
```markdown
## AI Compliance
- **AI Capabilities Detected**: [Yes/No]
- **Custom Standards**: [path to customer AI governance document / None]
- **EU AI Act Risk Level**: [Unacceptable/High/Limited/Minimal/N/A]
- **Last Review Date**: [ISO timestamp / N/A]
```

## Rule AIC-05: Compliance Report Structure
**Rule**: The AI compliance review MUST produce a structured report with overall compliance score and per-domain assessments.
**Verification**:
- [ ] Each assessment area has: status (Pass/Fail/N/A/Partial), findings, recommendations
- [ ] Overall compliance score is calculated
- [ ] Executive summary with risk assessment is provided
- [ ] Findings are categorized by severity (Critical/High/Medium/Low)
- [ ] Remediation plan with prioritized actions and effort estimates

## Rule AIC-06: Artifact Storage
**Rule**: AI compliance review results MUST be stored at `aidlc-docs/{feature-name}/construction/adrs/ai-compliance-review-{YYYY-MM-DD}.md`
**Verification**:
- [ ] File is created at the correct path with date stamp
- [ ] File is referenced in audit.md
- [ ] If PM tool sync is enabled, findings are pushed as issues

## Rule AIC-07: PM Tool Sync
**Rule**: If PM tool sync is enabled, Critical and High severity findings MUST be pushed to the PM tool.
**Verification**:
- [ ] Critical findings are pushed as blockers
- [ ] High findings are pushed as high-priority issues
- [ ] AI compliance approval status is attached to the Epic
