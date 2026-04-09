#!/bin/bash
# AI-DLC Scaffolding — Kiro CLI Setup
set -e
echo "Setting up AI-DLC for Kiro CLI..."
mkdir -p .kiro/agents/prompts .kiro/specs/project-specs
cp cli/agents/*.json .kiro/agents/
cp cli/agents/prompts/*.md .kiro/agents/prompts/
cp cli/steering/*.md .kiro/steering/
echo "Done! Edit .kiro/steering/team-context.md"
echo "Start: kiro-cli --agent aidlc-orchestrator"
