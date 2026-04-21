---
inclusion: always
---

# AI-DLC: Intent Alignment & Mob Elaboration

## Intent Alignment (MANDATORY — NEVER SKIP)

**CRITICAL RULE**: Intent Alignment is a MANDATORY stage that MUST execute before Requirements Analysis for EVERY new feature, regardless of how clear the user's request appears. This is a hard gate — do NOT proceed to Requirements Analysis until intent is captured, clarified, and approved.

### Why This Is Mandatory
Even seemingly clear requests contain hidden assumptions. Intent Alignment surfaces these early, preventing costly rework during Construction. Skipping this stage is a workflow violation.

### Flow
1. Capture raw intent verbatim in `aidlc-docs/{feature}/inception/intent/raw-intent.md`
2. Ask proportional clarifying questions in chat (per the chat-first interaction pattern):
   - **Simple intents**: 2-3 targeted questions to confirm scope and boundaries
   - **Moderate intents**: 5-8 questions covering scope, users, constraints, and success criteria
   - **Complex intents**: 10+ questions with deep probing on business context, edge cases, and risks
3. Persist questions + answers to `aidlc-docs/{feature}/inception/intent/intent-questions.md`
4. Challenge vague answers with follow-ups — do NOT accept "maybe", "probably", or "not sure" without resolution
5. Produce `aidlc-docs/{feature}/inception/intent/refined-intent.md` summarizing the clarified intent
6. **GATE**: Get explicit user approval of refined intent before proceeding to Requirements Analysis

### Minimum Intent Artifacts (Required)
- `raw-intent.md` — exact user request as provided
- `intent-questions.md` — clarifying questions and answers (even if only 2-3 questions for simple requests)
- `refined-intent.md` — clarified, unambiguous intent statement approved by user

### Directory Bootstrapping
When creating the feature directory tree, use `mkdir -p` via shell command to create all directories at once. Do NOT use `.gitkeep` files — the `fsWrite` tool rejects empty file content. Directories will be implicitly created when the first real artifact is written to them.

## Mob Elaboration (Team Ceremony — Optional)
For full team sessions, intent alignment becomes the formal Mob Elaboration ritual. More intensive, facilitator-led, single-room session.

Trigger with: "Let's run a Mob Elaboration session"
