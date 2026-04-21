# AI-DLC Workflow Extension for Kiro

Visual dashboard for the AI-DLC (AI-Driven Development Lifecycle) framework. Track phases, features, governance, and progress — all from a rich webview UI inside your IDE.

## Features

### Portfolio Landing Page
- Overview of all features with progress rings and key stats
- Aggregate metrics: total features, stages completed, overall progress, artifact count
- Cross-feature activity timeline showing recent events
- Click any feature card to drill into its full AIDLC detail view

### Workflow Visualization
- Three-phase workflow: Inception → Construction → Operations
- Expandable sub-stages with progress bars, status icons, and descriptions
- Stage dependency detection — blocked stages show a lock icon
- "What's Next" smart prompt with one-click action button
- Skip stage button for stages you want to bypass

### Artifact Management
- Design catalogue with 8 artifact categories
- Inline markdown viewer with rendered preview
- Inline markdown editor with Cmd+S save and unsaved change detection
- Search across all artifacts by name or stage (Cmd+Shift+F)

### Governance & Controls
- PM Tool integration wizard (Jira, Azure DevOps, GitHub Issues, Linear)
- Design Review, ARB Artifact generation, Build Path tracking
- Audit log viewer, HTML report export

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd+Shift+D | Open Dashboard |
| Cmd+Shift+N | New Feature |
| Cmd+Shift+S | Switch Feature |
| Cmd+Shift+F | Search Artifacts |
| Cmd+S | Save (in editor) |
| Escape | Close overlay |

## Installation

1. Build: `cd extensions && bash build.sh`
2. Install: Command Palette → "Extensions: Install from VSIX..."
3. Reload: Command Palette → "Developer: Reload Window"

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| aidlc.autoOpenDashboard | true | Auto-open on workspace load |
| aidlc.defaultView | landing | Default view (landing/feature) |
| aidlc.showNotifications | true | Show toast notifications |
| aidlc.timelineEntries | 10 | Timeline entries to display |
