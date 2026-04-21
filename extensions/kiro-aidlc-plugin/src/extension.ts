import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { KiroChat } from 'aidlc-shared';
import { PhasesTreeProvider, StageItem } from './phasesTreeProvider';
import { FeaturesTreeProvider, FeatureItem } from './featuresTreeProvider';
import { GovernanceTreeProvider } from './governanceTreeProvider';
import { DashboardPanel } from './dashboardPanel';
import { AidlcManifest, parseStateFile } from './types';
import { ConfigTreeProvider, ConfigItem } from './configTreeProvider';
import { ArtifactsTreeProvider } from './artifactsTreeProvider';

let allManifests: AidlcManifest[] = [];
let activeFeatureIndex = 0;

export function activate(context: vscode.ExtensionContext): void {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceRoot) { return; }

  const chat = new KiroChat({ displayName: 'AI-DLC' });
  const phasesTree = new PhasesTreeProvider();
  const featuresTree = new FeaturesTreeProvider();
  const governanceTree = new GovernanceTreeProvider(workspaceRoot);
  const configTree = new ConfigTreeProvider(workspaceRoot);
  const artifactsTree = new ArtifactsTreeProvider(workspaceRoot);
  const dashboard = new DashboardPanel(chat);
  dashboard.setWorkspaceRoot(workspaceRoot);

  // Status bar item
  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 50);
  statusBar.command = 'aidlc.openDashboard';
  statusBar.tooltip = 'Open AI-DLC Dashboard';
  context.subscriptions.push(statusBar);

  function updateStatusBar(): void {
    if (allManifests.length === 0) { statusBar.hide(); return; }
    const m = allManifests[activeFeatureIndex];
    const done = m.stages.filter(s => s.status === 'complete').length;
    const total = m.stages.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    statusBar.text = `$(brain) ${m.featureName} — ${pct}%`;
    statusBar.show();
  }

  function setActiveFeature(index: number): void {
    if (index >= 0 && index < allManifests.length) {
      activeFeatureIndex = index;
      const m = allManifests[activeFeatureIndex];
      phasesTree.setManifest(m);
      governanceTree.setManifest(m);
      dashboard.setManifests(allManifests, activeFeatureIndex);
      updateStatusBar();
      vscode.window.showInformationMessage(`AI-DLC: Switched to "${m.featureName}"`);
    }
  }

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('aidlcPhases', phasesTree),
    vscode.window.registerTreeDataProvider('aidlcFeatures', featuresTree),
    vscode.window.registerTreeDataProvider('aidlcGovernance', governanceTree),
    vscode.window.registerTreeDataProvider('aidlcConfig', configTree),
    vscode.window.registerTreeDataProvider('aidlcArtifacts', artifactsTree),
    vscode.commands.registerCommand('aidlc.openDashboard', () => dashboard.show(context.extensionUri)),
    vscode.commands.registerCommand('aidlc.refresh', () => loadManifests()),
    vscode.commands.registerCommand('aidlc.runStage', async (item: StageItem) => {
      if (item?.chatCommand) { await chat.send(item.chatCommand); }
    }),
    vscode.commands.registerCommand('aidlc.openArtifact', () => {
      if (allManifests.length > 0) {
        const m = allManifests[activeFeatureIndex];
        const p = path.join(workspaceRoot, 'aidlc-docs', m.featureName, 'aidlc-state.md');
        if (fs.existsSync(p)) { vscode.window.showTextDocument(vscode.Uri.file(p)); }
      }
    }),
    vscode.commands.registerCommand('aidlc.triggerDesignReview', () => chat.send('Run a design review')),
    vscode.commands.registerCommand('aidlc.triggerSecurityReview', () => chat.send('Run a security review')),
    vscode.commands.registerCommand('aidlc.triggerAiCompliance', () => chat.send('Run an AI compliance review')),
    vscode.commands.registerCommand('aidlc.triggerPrototypeTransition', () => chat.send('Transition prototype to enterprise build')),
    vscode.commands.registerCommand('aidlc.triggerPmPull', () => chat.send('Pull PM tool changes')),
    vscode.commands.registerCommand('aidlc.openGovernanceDashboard', () => dashboard.show(context.extensionUri)),
    vscode.commands.registerCommand('aidlc.switchFeature', async () => {
      if (allManifests.length <= 1) {
        vscode.window.showInformationMessage('AI-DLC: Only one feature in this workspace.');
        return;
      }
      const items = allManifests.map((m, i) => ({
        label: `${i === activeFeatureIndex ? '● ' : '  '}${m.featureName}`,
        description: m.currentStage,
        detail: `${m.projectType} — ${m.stages.filter(s => s.status === 'complete').length}/${m.stages.length} stages`,
        index: i,
      }));
      const picked = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a feature to switch to',
        title: 'AI-DLC: Switch Feature',
      });
      if (picked) { setActiveFeature(picked.index); }
    }),
    vscode.commands.registerCommand('aidlc.selectFeature', (item: FeatureItem) => {
      const idx = allManifests.findIndex(m => m.featureName === item.manifest.featureName);
      if (idx >= 0) { setActiveFeature(idx); }
    }),
    vscode.commands.registerCommand('aidlc.switchFeatureByName', (featureName: string) => {
      const idx = allManifests.findIndex(m => m.featureName === featureName);
      if (idx >= 0) { setActiveFeature(idx); }
    }),

    vscode.commands.registerCommand('aidlc.newFeature', async () => {
      const description = await vscode.window.showInputBox({
        prompt: 'Describe the feature or project you want to build',
        placeHolder: 'e.g., A real-time collaboration tool for data architects',
        title: 'AI-DLC: New Feature',
      });
      if (description) {
        await chat.send(`Using AI-DLC, I want to build ${description}`);
      }
    }),

    vscode.commands.registerCommand('aidlc.skipStage', async () => {
      if (allManifests.length === 0) { return; }
      const m = allManifests[activeFeatureIndex];
      const pendingStages = m.stages.filter(s => s.status === 'pending' || s.status === 'in-progress');
      if (pendingStages.length === 0) {
        vscode.window.showInformationMessage('AI-DLC: No stages to skip.');
        return;
      }
      const items = pendingStages.map(s => ({ label: s.name, description: `${s.phase} — ${s.status}` }));
      const picked = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a stage to skip',
        title: 'AI-DLC: Skip Stage',
      });
      if (picked) {
        const confirm = await vscode.window.showWarningMessage(
          `Skip "${picked.label}"? This stage will be marked as skipped and won't be executed.`,
          { modal: true }, 'Skip Stage'
        );
        if (confirm === 'Skip Stage') {
          await chat.send(`Using AI-DLC, skip the ${picked.label} stage`);
        }
      }
    }),

    vscode.commands.registerCommand('aidlc.searchArtifacts', () => {
      dashboard.triggerSearch();
    }),

    vscode.commands.registerCommand('aidlc.openConfigFile', (fsPath: string) => {
      if (fsPath && fs.existsSync(fsPath)) {
        vscode.window.showTextDocument(vscode.Uri.file(fsPath));
      }
    }),
    vscode.commands.registerCommand('aidlc.addConfigFile', (item: ConfigItem) => {
      configTree.addFile(item);
    }),
    vscode.commands.registerCommand('aidlc.deleteConfigFile', (item: ConfigItem) => {
      configTree.deleteFile(item);
    }),
    vscode.commands.registerCommand('aidlc.refreshConfig', () => configTree.refresh()),
    vscode.commands.registerCommand('aidlc.refreshArtifacts', () => artifactsTree.refresh()),

    vscode.commands.registerCommand('aidlc.archiveFeature', async () => {
      if (allManifests.length === 0) { return; }
      const items = allManifests.map((m, i) => ({ label: m.featureName, description: m.currentStage, index: i }));
      const picked = await vscode.window.showQuickPick(items, { placeHolder: 'Select feature to archive', title: 'AI-DLC: Archive Feature' });
      if (!picked) { return; }
      const confirm = await vscode.window.showWarningMessage(`Archive "${picked.label}"? It will be moved to aidlc-docs/.archived/`, { modal: true }, 'Archive');
      if (confirm !== 'Archive') { return; }
      const src = path.join(workspaceRoot, 'aidlc-docs', picked.label);
      const archiveDir = path.join(workspaceRoot, 'aidlc-docs', '.archived');
      if (!fs.existsSync(archiveDir)) { fs.mkdirSync(archiveDir, { recursive: true }); }
      fs.renameSync(src, path.join(archiveDir, picked.label));
      loadManifests();
      vscode.window.showInformationMessage(`AI-DLC: "${picked.label}" archived.`);
    }),

    vscode.commands.registerCommand('aidlc.cloneFeature', async () => {
      if (allManifests.length === 0) { return; }
      const items = allManifests.map((m, i) => ({ label: m.featureName, description: m.currentStage, index: i }));
      const picked = await vscode.window.showQuickPick(items, { placeHolder: 'Select feature to clone', title: 'AI-DLC: Clone Feature' });
      if (!picked) { return; }
      const newName = await vscode.window.showInputBox({ prompt: 'Name for the cloned feature', placeHolder: 'e.g., my-feature-v2', value: picked.label + '-copy' });
      if (!newName) { return; }
      const src = path.join(workspaceRoot, 'aidlc-docs', picked.label);
      const dest = path.join(workspaceRoot, 'aidlc-docs', newName);
      if (fs.existsSync(dest)) { vscode.window.showErrorMessage(`Feature "${newName}" already exists.`); return; }
      const copyDir = (s: string, d: string) => {
        fs.mkdirSync(d, { recursive: true });
        for (const entry of fs.readdirSync(s, { withFileTypes: true })) {
          const sp = path.join(s, entry.name), dp = path.join(d, entry.name);
          if (entry.isDirectory()) { copyDir(sp, dp); } else { fs.copyFileSync(sp, dp); }
        }
      };
      copyDir(src, dest);
      const statePath = path.join(dest, 'aidlc-state.md');
      if (fs.existsSync(statePath)) {
        let content = fs.readFileSync(statePath, 'utf-8');
        content = content.replace(picked.label, newName);
        fs.writeFileSync(statePath, content, 'utf-8');
      }
      loadManifests();
      vscode.window.showInformationMessage(`AI-DLC: "${picked.label}" cloned as "${newName}".`);
    }),

    vscode.commands.registerCommand('aidlc.exportReport', async () => {
      if (allManifests.length === 0) { vscode.window.showInformationMessage('AI-DLC: No features to export.'); return; }
      const m = allManifests[activeFeatureIndex];
      const html = dashboard.generateExportHtml(m, workspaceRoot);
      const uri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(path.join(workspaceRoot, `${m.featureName}-report.html`)),
        filters: { 'HTML': ['html'] },
        title: 'Export AI-DLC Feature Report',
      });
      if (uri) {
        fs.writeFileSync(uri.fsPath, html, 'utf-8');
        vscode.window.showInformationMessage(`AI-DLC: Report exported to ${uri.fsPath}`);
      }
    }),

    vscode.commands.registerCommand('aidlc.archiveFeature', async () => {
      if (allManifests.length === 0) { return; }
      const m = allManifests[activeFeatureIndex];
      const confirm = await vscode.window.showWarningMessage(
        `Archive "${m.featureName}"? It will be moved to aidlc-docs/.archived/`, { modal: true }, 'Archive'
      );
      if (confirm === 'Archive') {
        const src = path.join(workspaceRoot, 'aidlc-docs', m.featureName);
        const dest = path.join(workspaceRoot, 'aidlc-docs', '.archived', m.featureName);
        if (!fs.existsSync(path.join(workspaceRoot, 'aidlc-docs', '.archived'))) {
          fs.mkdirSync(path.join(workspaceRoot, 'aidlc-docs', '.archived'), { recursive: true });
        }
        fs.renameSync(src, dest);
        loadManifests();
        vscode.window.showInformationMessage(`AI-DLC: "${m.featureName}" archived.`);
      }
    }),

    vscode.commands.registerCommand('aidlc.cloneFeature', async () => {
      if (allManifests.length === 0) { return; }
      const items = allManifests.map(m => ({ label: m.featureName, description: m.currentStage }));
      const source = await vscode.window.showQuickPick(items, { placeHolder: 'Select feature to clone', title: 'AI-DLC: Clone Feature' });
      if (!source) { return; }
      const newName = await vscode.window.showInputBox({ prompt: 'Name for the cloned feature', placeHolder: 'e.g., my-new-feature' });
      if (!newName) { return; }
      await chat.send(`Using AI-DLC, clone feature "${source.label}" as "${newName}"`);
    }),

    vscode.commands.registerCommand('aidlc.compareFeatures', async () => {
      if (allManifests.length < 2) { vscode.window.showInformationMessage('AI-DLC: Need at least 2 features to compare.'); return; }
      const items = allManifests.map(m => ({ label: m.featureName, description: m.currentStage }));
      const first = await vscode.window.showQuickPick(items, { placeHolder: 'Select first feature', title: 'Compare Features' });
      if (!first) { return; }
      const second = await vscode.window.showQuickPick(items.filter(i => i.label !== first.label), { placeHolder: 'Select second feature' });
      if (!second) { return; }
      dashboard.showComparison(first.label, second.label);
    }),

    vscode.commands.registerCommand('aidlc.copyArtifactPath', (fsPath: string) => {
      if (fsPath) { vscode.env.clipboard.writeText(fsPath); vscode.window.showInformationMessage('Path copied to clipboard'); }
    }),
  );

  const stateWatcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(workspaceRoot, 'aidlc-docs/*/aidlc-state.md')
  );
  stateWatcher.onDidChange(() => loadManifests());
  stateWatcher.onDidCreate(() => loadManifests());
  stateWatcher.onDidDelete(() => loadManifests());
  context.subscriptions.push(stateWatcher);

  const docsWatcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(workspaceRoot, 'aidlc-docs/**/*.md')
  );
  docsWatcher.onDidChange(() => loadManifests());
  docsWatcher.onDidCreate(() => loadManifests());
  context.subscriptions.push(docsWatcher);

  const kiroWatcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(workspaceRoot, '.kiro/**/*')
  );
  kiroWatcher.onDidChange(() => configTree.refresh());
  kiroWatcher.onDidCreate(() => configTree.refresh());
  kiroWatcher.onDidDelete(() => configTree.refresh());
  context.subscriptions.push(kiroWatcher);

  function loadManifests(): void {
    allManifests = scanForManifests(workspaceRoot!);
    featuresTree.setManifests(allManifests);
    artifactsTree.refresh();
    if (activeFeatureIndex >= allManifests.length) { activeFeatureIndex = 0; }
    if (allManifests.length > 0) {
      phasesTree.setManifest(allManifests[activeFeatureIndex]);
      governanceTree.setManifest(allManifests[activeFeatureIndex]);
      dashboard.setManifests(allManifests, activeFeatureIndex);
      updateStatusBar();
    } else {
      phasesTree.setManifest(null);
      governanceTree.setManifest(null);
      dashboard.setManifests([], 0);
      updateStatusBar();
    }
  }

  loadManifests();
  const config = vscode.workspace.getConfiguration('aidlc');
  const defaultView = config.get<string>('defaultView', 'landing');
  dashboard.setDefaultView(defaultView as 'landing' | 'feature');
  if (allManifests.length > 0 && config.get<boolean>('autoOpenDashboard', true)) { dashboard.show(context.extensionUri); }
}

function scanForManifests(workspaceRoot: string): AidlcManifest[] {
  const docsDir = path.join(workspaceRoot, 'aidlc-docs');
  if (!fs.existsSync(docsDir)) { return []; }
  const manifests: AidlcManifest[] = [];
  try {
    for (const entry of fs.readdirSync(docsDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) { continue; }
      const statePath = path.join(docsDir, entry.name, 'aidlc-state.md');
      if (fs.existsSync(statePath)) {
        manifests.push(parseStateFile(fs.readFileSync(statePath, 'utf-8'), entry.name));
      }
    }
  } catch {}
  return manifests;
}

export function deactivate(): void {}
