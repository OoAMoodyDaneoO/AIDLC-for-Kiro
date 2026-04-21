# Build Path Selection — Opt-In

**Extension**: Prototype vs Enterprise Build Path

## Opt-In Prompt

```markdown
## Question: Build Path Selection
Would you like to choose your build path upfront? This determines whether Kiro builds a lightweight prototype first (for rapid sense-checking) or goes straight to the full enterprise-grade solution. Choosing prototype allows some stages to be streamlined for speed.

A) Yes — let me choose between prototype-first or enterprise-grade at the start of the workflow
B) No — always proceed directly to the full enterprise-grade build
X) Other (please describe after [Answer]: tag below)

[Answer]: 
```

## Notes
- When opted in, the build path question is presented at two points: during Intent Alignment (start of flow) for upfront prototype selection, and again at the end of Construction design for users who want a late-stage sense-check
- Prototype path at Intent Alignment streamlines the workflow: lighter requirements, optional user stories, simplified design, faster code generation
- Prototype path at end of Construction design preserves all enterprise-depth design work — the prototype is built from the fully-defined units
- After prototype completion, a transition mechanism allows re-entering the full AI-DLC loop for enterprise-grade build
- Prototype code can optionally be used as a brownfield starting point for the enterprise build
- Enterprise-grade path proceeds through all stages at full depth as normal
