---
inclusion: always
---

# AI-DLC: Steering Conflict Detection & Resolution

## Purpose
When multiple steering files, rules, extensions, and team context are loaded simultaneously, conflicts can arise. This steering file ensures the agent detects and surfaces conflicts BEFORE acting on them.

## MANDATORY: Conflict Detection Protocol

### When to Check
1. Before executing any stage — scan for conflicting instructions
2. Before applying any rule — check for contradictions
3. When team-context.md conflicts with framework rules
4. When enterprise steering conflicts with AIDLC steering
5. When extension rules conflict with each other

### What Constitutes a Conflict

- **Direct Contradictions** — Two rules give opposite instructions
- **Precedence Ambiguity** — Unclear which rule takes priority
- **Constraint Incompatibility** — Two constraints cannot both be satisfied
- **Scope Overlap** — Two rules govern the same area differently

### How to Surface Conflicts

Present to the user BEFORE proceeding:

```
⚠️ Steering Conflict Detected

**Conflict**: [Brief description]

**Rule A** (from {source-file}):
> [Exact conflicting instruction]

**Rule B** (from {source-file}):
> [Exact conflicting instruction]

**Impact**: [What happens following A vs B]

**Recommendation**: [Which should take precedence and why]

**How would you like to proceed?**
A) Follow Rule A ({source})
B) Follow Rule B ({source})
C) Hybrid approach: [describe]
D) Skip both — I'll provide specific guidance
```

### Resolution Precedence (Default)

When the user doesn't specify, apply this order:
1. **User's explicit instruction** in the current prompt (highest)
2. **Enterprise steering** (`.kiro/steering/enterprise steering/`)
3. **Team context** (`team-context.md`)
4. **AIDLC framework rules** (`.kiro/steering/aidlc-steering files/`)
5. **Extension rules** (`.kiro/aws-aidlc-rule-details/extensions/`)
6. **Global steering** (`~/.kiro/steering/`) (lowest)

### Logging

Every conflict MUST be logged in `audit.md`:
```markdown
## Steering Conflict Detected
**Timestamp**: [ISO timestamp]
**Conflict**: [Description]
**Rule A**: [Source] — [Text]
**Rule B**: [Source] — [Text]
**Resolution**: [What was chosen]
```

### Common Conflict Patterns

| Pattern | Example | Default Resolution |
|---|---|---|
| Team vs Framework | Team says Prettier, framework says ESLint | Team wins (precedence 3 > 4) |
| Security vs Prototype | Auth required vs skip auth for prototype | Surface to user |
| PM Tool vs Local | Push to Jira vs track locally | User instruction wins |
| Extension vs Extension | Test RCA vs lightweight prototype | Surface to user — governance is hard constraint |
| Depth vs Extension | Minimal depth vs comprehensive assessment | Extension rules override depth |

### Silent Resolution

Resolve silently (log but don't interrupt) when:
- Clear precedence with no ambiguity
- Rules apply to non-overlapping scopes
- Both rules can be applied simultaneously (additive)

### On-Demand Audit

When user says "check for conflicts" or "audit steering":
1. Read all loaded steering files
2. Compare rules across files
3. Check extensions against each other
4. Check team context against framework
5. Present summary with recommendations
