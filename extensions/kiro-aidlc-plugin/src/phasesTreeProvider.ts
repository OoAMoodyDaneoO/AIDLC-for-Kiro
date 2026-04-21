import * as vscode from 'vscode';
import { BaseTreeProvider } from 'aidlc-shared';
import { AidlcManifest, PHASE_DISPLAY, PhaseName, STAGE_DEFINITIONS } from './types';

export class PhaseItem extends vscode.TreeItem {
  constructor(public readonly phaseName: PhaseName, public readonly stages: StageItem[]) {
    const display = PHASE_DISPLAY[phaseName];
    const completed = stages.filter(s => s.status === 'complete').length;
    super(`${display.label} (${completed}/${stages.length})`, vscode.TreeItemCollapsibleState.Expanded);
    this.iconPath = new vscode.ThemeIcon(display.icon);
    this.contextValue = 'phase';
  }
}

export class StageItem extends vscode.TreeItem {
  constructor(public readonly stageName: string, public readonly status: string, public readonly chatCommand: string) {
    super(stageName, vscode.TreeItemCollapsibleState.None);
    this.contextValue = 'stage';
    this.description = status;
    const iconMap: Record<string, string> = {
      'complete': 'pass-filled', 'in-progress': 'arrow-circle-right',
      'skipped': 'circle-slash', 'pending': 'circle-large-outline',
    };
    this.iconPath = new vscode.ThemeIcon(iconMap[status] || 'circle-large-outline');
  }
}

export class PhasesTreeProvider extends BaseTreeProvider<vscode.TreeItem> {
  private manifest: AidlcManifest | null = null;

  setManifest(m: AidlcManifest | null): void { this.manifest = m; this.refresh(); }

  protected getRootChildren(): vscode.TreeItem[] {
    if (!this.manifest) { return [new vscode.TreeItem('No AI-DLC project detected')]; }
    const phases: PhaseName[] = ['inception', 'construction', 'operations'];
    return phases.map(p => {
      const stageItems = STAGE_DEFINITIONS.filter(d => d.phase === p).map(def => {
        const info = this.manifest?.stages.find(s => s.name === def.name);
        return new StageItem(def.name, info?.status || 'pending', def.chatCommand);
      });
      return new PhaseItem(p, stageItems);
    });
  }

  protected getChildrenOf(element: vscode.TreeItem): vscode.TreeItem[] {
    if (element instanceof PhaseItem) { return element.stages; }
    return [];
  }
}
