# Getting Started with AI-DLC

## First-Time Setup

### IDE (Kiro)
1. Clone or open the AI-DLC framework workspace
2. Steering files in `.kiro/steering/` auto-load — no manual setup needed
3. Hooks in `.kiro/hooks/` activate automatically
4. Optional: Install the visual extension — `cd extensions && ./build.sh`, then install the `.vsix`

### CLI (Kiro CLI)
1. Run `./setup-cli.sh` from the workspace root
2. Start: `kiro-cli --agent aidlc-orchestrator`
3. Optional: Run TUI dashboard in a split terminal

## Your First Feature
Say: **"Using AI-DLC, I want to build [describe what you want]"**

The framework will: detect workspace → align intent → gather requirements → plan workflow → design → generate code → build & test

Every stage has an approval gate. Progress tracked in `aidlc-state.md`, interactions logged in `audit.md`.

## Governance Extensions
During Requirements Analysis, opt in to: ARB Artifact, PTO, Design Review, Test Evidence, Build Path, PM Tool, Security Review, AI Compliance.

## Multi-Feature Workspaces
Multiple features share one workspace. Use the extension's feature switcher or say "switch to {name}" in CLI.

## Customization
- Edit `.kiro/steering/aidlc-steering files/team-context.md` for your team's standards
- Customize `[Enterprise: ...]` placeholders in governance templates
- Add business-specific steering in `.kiro/steering/enterprise steering/`
