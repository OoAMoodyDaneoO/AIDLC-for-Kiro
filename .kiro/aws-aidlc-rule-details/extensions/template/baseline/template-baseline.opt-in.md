# Template Extension — Opt-In

**Extension**: Template Baseline

## Opt-In Prompt

```markdown
## Question: [Your Extension Name]
Should [your extension] rules be enforced for this project?

A) Yes — enforce all [EXTENSION] rules as blocking constraints
B) No — skip all [EXTENSION] rules
X) Other (please describe after [Answer]: tag below)

[Answer]: 
```

## Notes
- Opt-in filename must match rules file: `{name}.opt-in.md` → `{name}.md`
- Omit opt-in file to always enforce the extension
