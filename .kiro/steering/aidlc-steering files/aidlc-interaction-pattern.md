---
inclusion: always
---

# AI-DLC: Chat-First Interaction Pattern

## Universal Rule: Dialogue in Chat, Persist to Files

All interactions happen conversationally in chat. Files are the persistent record, not the primary interface.

### The Pattern
1. Discuss in chat — questions, options, feedback, approvals all inline
2. Persist to files — write outcomes to `.md` files for traceability
3. Reference files for review — point users to files for full documents

### Where This Applies

| Interaction | Chat | File (record) |
|---|---|---|
| Intent questions | Ask/answer in chat | `intent-questions.md` |
| Requirements questions | Ask/answer in chat | `requirement-verification-questions.md` |
| User story planning | Discuss in chat | Story planning files |
| Design decisions | Discuss in chat | ADRs and design docs |
| Plan reviews | Summary in chat | Full plan in `.md` files |
| Stage approvals | Approve in chat | `audit.md` |
| Code review feedback | Discuss in chat | Apply to code |
| Extension opt-ins | Ask in chat | `aidlc-state.md` |
| PM tool selection | Ask in chat | `aidlc-state.md` |

### What NOT to Do
- Don't force users to open files and fill in answers as the primary flow
- Don't make users switch context to a file editor for questions
- Don't skip file persistence — files are the audit trail

### File Reviews
When a document is generated, present a concise summary in chat and point to the file for the full version.
