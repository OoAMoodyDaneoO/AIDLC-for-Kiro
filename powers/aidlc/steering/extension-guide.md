# IDE Extension & CLI Dashboard Guide

## IDE Extension
**Install**: `cd extensions && ./build.sh` then install `.vsix` via Cmd+Shift+P → "Install from VSIX"

**Sidebar**: Phases (14 stages with status), Features (multi-feature with switcher), Governance (all controls)

**Dashboard**: Auto-opens with hero header, progress bar, phase cards with ▶ Run buttons, governance action cards, activity timeline, search, toast notifications

**Commands**: Open Dashboard, Switch Feature, New Feature, Refresh

## CLI TUI Dashboard
**Install**: `cd cli/dashboard && npm install && node aidlc-tui.js /path/to/workspace`

**Layout**: Header, progress gauge, feature info, phases table, governance panel, features list, activity log, command bar

**Keys**: `q` quit, `r` refresh, `Tab` commands, `1-9` switch features, `←→` navigate

**Commands**: `help`, `refresh`, `features`, `switch <name>`, `quit`

**Live updates**: Polls every 2 seconds — run alongside Kiro CLI in a split terminal
