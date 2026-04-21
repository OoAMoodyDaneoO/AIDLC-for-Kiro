#!/bin/bash
# AI-DLC Scaffolding — Kiro CLI Setup
set -e
echo "Setting up AI-DLC for Kiro CLI..."
mkdir -p .kiro/agents/prompts .kiro/specs/project-specs .kiro/steering
cp cli/agents/*.json .kiro/agents/
cp cli/agents/prompts/*.md .kiro/agents/prompts/
cp cli/steering/*.md .kiro/steering/
echo "Done! Edit .kiro/steering/team-context.md"
echo ""
echo "Available commands in Kiro CLI:"
echo "  kiro-cli --agent aidlc-orchestrator    Start the AI-DLC workflow"
echo ""
echo "Once running, try these commands:"
echo "  dashboard / show status    Full progress dashboard"
echo "  list features              All features with progress"
echo "  new feature                Start a new feature"
echo "  run design review          Trigger design review"
echo "  generate arb               Generate ARB artifact"
echo "  generate pto               Generate Permit to Operate"
echo "  generate release notes     Auto-generate release notes"
echo "  estimate costs             Generate cost estimates"
echo "  run retrospective          Capture phase retrospective"
