#!/bin/bash
# AI-DLC Scaffolding — Kiro IDE Setup
set -e
echo "Setting up AI-DLC for Kiro IDE..."
mkdir -p .kiro/agents .kiro/hooks .kiro/specs/aidlc/inception .kiro/specs/aidlc/construction .kiro/specs/aidlc/operations .kiro/specs/project-specs
cp ide/agents/*.md .kiro/agents/
cp ide/hooks/*.kiro.hook .kiro/hooks/
cp ide/specs/aidlc/inception/requirement.md .kiro/specs/aidlc/inception/
cp ide/specs/aidlc/construction/requirement.md .kiro/specs/aidlc/construction/
cp ide/specs/aidlc/operations/requirement.md .kiro/specs/aidlc/operations/
echo "Done! Edit .kiro/steering/team-context.md then type: Using AI-DLC, ..."
