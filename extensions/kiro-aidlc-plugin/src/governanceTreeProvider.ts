import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BaseTreeProvider } from 'aidlc-shared';
import { AidlcManifest } from './types';

export class GovernanceTreeProvider extends BaseTreeProvider<vscode.TreeItem> {
  private manifest: AidlcManifest | null = null;
  private workspaceRoot: string;

  constructor(workspaceRoot: string) { super(); this.workspaceRoot = workspaceRoot; }

  setManifest(m: AidlcManifest | null): void { this.manifest = m; this.refresh(); }

  protected getRootChildren(): vscode.TreeItem[] {
    if (!this.manifest) { return [new vscode.TreeItem('No AI-DLC project detected')]; }
    const f = this.manifest.featureName;
    const items: vscode.TreeItem[] = [];

    // ARB
    const arbExists = fs.existsSync(path.join(this.workspaceRoot, 'aidlc-docs', f, 'construction', 'adrs', 'arb-submission.md'));
    items.push(this.item('ARB Artifact', arbExists ? 'Generated' : 'Not generated', arbExists ? 'pass-filled' : 'circle-large-outline'));

    // Design Reviews
    let reviewCount = 0;
    try { reviewCount = fs.readdirSync(path.join(this.workspaceRoot, 'aidlc-docs', f, 'construction', 'adrs')).filter(x => x.startsWith('design-review-')).length; } catch {}
    items.push(this.item('Design Reviews', `${reviewCount} review(s)`, 'search'));

    // Security Reviews
    let securityReviewCount = 0;
    try { securityReviewCount = fs.readdirSync(path.join(this.workspaceRoot, 'aidlc-docs', f, 'construction', 'adrs')).filter(x => x.startsWith('security-review-')).length; } catch {}
    items.push(this.item('Security Reviews', `${securityReviewCount} review(s)`, 'shield'));

    // AI Compliance Reviews
    let aiComplianceCount = 0;
    try { aiComplianceCount = fs.readdirSync(path.join(this.workspaceRoot, 'aidlc-docs', f, 'construction', 'adrs')).filter(x => x.startsWith('ai-compliance-review-')).length; } catch {}
    items.push(this.item('AI Compliance', `${aiComplianceCount} review(s)`, 'hubot'));

    // Test Evidence
    let evidenceCount = 0;
    try { evidenceCount = fs.readdirSync(path.join(this.workspaceRoot, 'aidlc-docs', f, 'construction', 'build-and-test')).filter(x => x.startsWith('test-evidence-')).length; } catch {}
    items.push(this.item('Test Evidence', `${evidenceCount} document(s)`, 'beaker'));

    // PM Tool
    items.push(this.item('PM Tool', this.manifest.pmTool ? `${this.manifest.pmTool.tool} (${this.manifest.pmTool.syncEnabled ? 'syncing' : 'off'})` : 'Not configured', 'cloud'));

    // Build Path
    if (this.manifest.buildPath) {
      items.push(this.item('Build Path', `${this.manifest.buildPath.selectedPath} — ${this.manifest.buildPath.prototypeStatus}`, 'beaker'));
    }

    // PTO
    const ptoExists = fs.existsSync(path.join(this.workspaceRoot, 'aidlc-docs', f, 'operations', 'permit-to-operate.md'));
    items.push(this.item('Permit to Operate', ptoExists ? 'Generated' : 'Not generated', ptoExists ? 'pass-filled' : 'circle-large-outline'));

    return items;
  }

  protected getChildrenOf(): vscode.TreeItem[] { return []; }

  private item(label: string, desc: string, icon: string): vscode.TreeItem {
    const i = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.None);
    i.description = desc;
    i.iconPath = new vscode.ThemeIcon(icon);
    return i;
  }
}
