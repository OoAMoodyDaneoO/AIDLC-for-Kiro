# Troubleshooting

## Common Issues

### "No AI-DLC project detected"
Start a feature: "Using AI-DLC, I want to build ..."

### Extension not showing
1. Verify `.vsix` exists: `ls extensions/out/`
2. Reinstall via "Install from VSIX"
3. Reload window
4. Extension activates when `aidlc-docs/*/aidlc-state.md` exists

### Dashboard not updating
Click refresh icon or press `r` in TUI

### PM tool sync not working
Check `.kiro/settings/mcp.json` for your PM tool MCP server config and credentials

### Test RCA gate blocking writes
Run tests, document RCA in test evidence file, then retry

### Build script "vsce not found"
Run `npm install -g @vscode/vsce` then re-run `./build.sh`

### CLI TUI shows empty
Pass workspace root: `node aidlc-tui.js /path/to/workspace`

### Stages stuck as "pending"
Check `aidlc-state.md` checkboxes — the `aidlc-mark-complete` hook updates on agent stop

## Getting Help
- Check `audit.md` for interaction history
- Check `aidlc-state.md` for current progress
- Run a design review to check for drift
- Use retrospective command to capture learnings
