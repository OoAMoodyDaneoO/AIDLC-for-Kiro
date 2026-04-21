# AI Compliance Review — Opt-In

**Extension**: AI Compliance Review & Responsible AI Governance

## Opt-In Prompt

```markdown
## Question: AI Compliance Review
Does your solution include AI/ML capabilities (model training, inference, LLM integration, AI agents, embeddings, RAG, etc.)? If so, should AI compliance review be enabled? This provides both a stage gate before Code Generation and an on-demand review capability covering responsible AI, model governance, bias/fairness, explainability, data privacy, and regulatory compliance.

A) Yes — enable AI compliance review (my solution includes AI capabilities)
B) No — my solution does not include AI capabilities
C) Yes, and I have custom AI governance standards I'd like to provide
X) Other (please describe after [Answer]: tag below)

[Answer]: 
```

## Notes
- When opted in, an AI compliance review is triggered as a stage gate after Construction design (alongside ARB, if enabled) and before Code Generation
- Additionally available as an on-demand manual review at any point via the `aidlc-ai-compliance` hook
- Covers: responsible AI principles, model governance, data privacy (GDPR/CCPA), bias and fairness, explainability/interpretability, EU AI Act risk classification, model monitoring, human oversight, and customer-provided AI standards
- If the user selects option C, they will be asked to provide their custom AI governance standards document which will be used alongside the built-in checks
- Review results are stored in `aidlc-docs/{feature-name}/construction/adrs/ai-compliance-review-{YYYY-MM-DD}.md`
- If PM tool sync is enabled, Critical and High findings are pushed as issues/work items
