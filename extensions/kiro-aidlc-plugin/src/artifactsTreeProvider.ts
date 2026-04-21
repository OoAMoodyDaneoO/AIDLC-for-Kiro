import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ArtifactItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly fsPath?: string,
  ) {
    super(label, collapsibleState);
    if (fsPath && collapsibleState === vscode.TreeItemCollapsibleState.None) {
      this.command = { command: 'aidlc.openConfigFile', title: 'Open', arguments: [fsPath] };
      this.contextValue = 'artifactFile';
      this.iconPath = new vscode.ThemeIcon('file');
      this.tooltip = fsPath;
    }
  }
}

export class ArtifactsTreeProvider implements vscode.TreeDataProvider<ArtifactItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<ArtifactItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private workspaceRoot: string;

  constructor(workspaceRoot: string) { this.workspaceRoot = workspaceRoot; }
  refresh(): void { this._onDidChangeTreeData.fire(undefined); }
  getTreeItem(element: ArtifactItem): vscode.TreeItem { return element; }

  getChildren(element?: ArtifactItem): ArtifactItem[] {
    const docsDir = path.join(this.workspaceRoot, 'aidlc-docs');
    if (!fs.existsSync(docsDir)) { return []; }
    if (!element) {
      try {
        return fs.readdirSync(docsDir, { withFileTypes: true })
          .filter(e => e.isDirectory() && !e.name.startsWith('.'))
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(e => {
            const count = this.countFiles(path.join(docsDir, e.name));
            const item = new ArtifactItem(`${e.name} (${count})`, vscode.TreeItemCollapsibleState.Collapsed);
            item.iconPath = new vscode.ThemeIcon('package');
            (item as any)._dir = path.join(docsDir, e.name);
            return item;
          });
      } catch { return []; }
    }
    const dir = (element as any)._dir as string | undefined;
    if (!dir || !fs.existsSync(dir)) { return []; }
    try {
      return fs.readdirSync(dir, { withFileTypes: true })
        .filter(e => !e.name.startsWith('.'))
        .sort((a, b) => { if (a.isDirectory() !== b.isDirectory()) { return a.isDirectory() ? -1 : 1; } return a.name.localeCompare(b.name); })
        .map(e => {
          const fp = path.join(dir, e.name);
          if (e.isDirectory()) {
            const count = this.countFiles(fp);
            if (count === 0) { return null; }
            const item = new ArtifactItem(`${e.name} (${count})`, vscode.TreeItemCollapsibleState.Collapsed);
            item.iconPath = new vscode.ThemeIcon('folder');
            (item as any)._dir = fp;
            return item;
          }
          return e.name.endsWith('.md') ? new ArtifactItem(e.name, vscode.TreeItemCollapsibleState.None, fp) : null;
        }).filter((x): x is ArtifactItem => x !== null);
    } catch { return []; }
  }

  private countFiles(dir: string): number {
    let count = 0;
    try {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name.startsWith('.')) { continue; }
        if (e.isDirectory()) { count += this.countFiles(path.join(dir, e.name)); }
        else if (e.name.endsWith('.md')) { count++; }
      }
    } catch {}
    return count;
  }
}
