#!/bin/bash
# AI-DLC Scaffolding — Kiro IDE Setup
set -e
echo "🏗️ Setting up AI-DLC for Kiro IDE..."
mkdir -p .kiro/agents .kiro/hooks .kiro/steering .kiro/specs/aidlc/inception .kiro/specs/aidlc/construction .kiro/specs/aidlc/operations .kiro/specs/project-specs

echo "  📦 Installing agents..."
cp ide/agents/*.md .kiro/agents/ 2>/dev/null || true

echo "  🔗 Installing hooks (21)..."
cp ide/hooks/*.kiro.hook .kiro/hooks/ 2>/dev/null || true

echo "  📋 Installing spec templates..."
cp ide/specs/aidlc/inception/requirement.md .kiro/specs/aidlc/inception/ 2>/dev/null || true
cp ide/specs/aidlc/construction/requirement.md .kiro/specs/aidlc/construction/ 2>/dev/null || true
cp ide/specs/aidlc/operations/requirement.md .kiro/specs/aidlc/operations/ 2>/dev/null || true

echo ""
echo "✅ AI-DLC IDE setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .kiro/steering/aidlc-steering files/team-context.md"
echo "  2. Open in Kiro and say: \"Using AI-DLC, I want to build ...\""
echo ""
echo "Optional:"
echo "  • Visual extension: cd extensions && ./build.sh"
echo "  • Kiro Power: Powers panel → Add Custom Power → powers/aidlc/"
echo "  • PM tool: Edit .kiro/settings/mcp.json"
