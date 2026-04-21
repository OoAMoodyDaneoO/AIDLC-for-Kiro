import * as vscode from 'vscode';
import { BaseTreeProvider } from 'aidlc-shared';
import { AidlcManifest } from './types';

export class FeatureItem extends vscode.TreeItem {
  constructor(public readonly manifest: AidlcManifest) {
    const completed = manifest.stages.filter(s => s.status === 'complete').length;
    super(manifest.featureName, vscode.TreeItemCollapsibleState.Collapsed);
    this.description = `${manifest.currentStage} (${completed}/${manifest.stages.length})`;
    this.iconPath = new vscode.ThemeIcon(manifest.projectType === 'Greenfield' ? 'new-file' : 'file-symlink-directory');
    this.contextValue = 'feature';
    this.command = { command: 'aidlc.selectFeature', title: 'Switch to Feature', arguments: [this] };
  }
}

export class FeaturesTreeProvider extends BaseTreeProvider<vscode.TreeItem> {
  private manifests: AidlcManifest[] = [];

  setManifests(m: AidlcManifest[]): void { this.manifests = m; this.refresh(); }

  protected getRootChildren(): vscode.TreeItem[] {
    if (this.manifests.length === 0) { return [new vscode.TreeItem('No features detected')]; }
    return this.manifests.map(m => new FeatureItem(m));
  }

  protected getChildrenOf(element: vscode.TreeItem): vscode.TreeItem[] {
    if (element instanceof FeatureItem) {
      const m = element.manifest;
      const items: vscode.TreeItem[] = [
        this.detail('Type', m.projectType, 'symbol-class'),
        this.detail('Started', m.startDate.split('T')[0] || 'Unknown', 'calendar'),
        this.detail('Current', m.currentStage, 'arrow-circle-right'),
      ];
      if (m.pmTool) { items.push(this.detail('PM Tool', `${m.pmTool.tool}`, 'cloud')); }
      if (m.buildPath) { items.push(this.detail('Build Path', m.buildPath.selectedPath, 'beaker')); }
      return items;
    }
    return [];
  }

  private detail(label: string, value: string, icon: string): vscode.TreeItem {
    const item = new vscode.TreeItem(`${label}: ${value}`, vscode.TreeItemCollapsibleState.None);
    item.iconPath = new vscode.ThemeIcon(icon);
    return item;
  }
}
