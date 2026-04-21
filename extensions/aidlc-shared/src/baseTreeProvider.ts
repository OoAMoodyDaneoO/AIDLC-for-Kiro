import * as vscode from 'vscode';

export abstract class BaseTreeProvider<T extends vscode.TreeItem> implements vscode.TreeDataProvider<T> {
  private _onDidChangeTreeData = new vscode.EventEmitter<T | undefined | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void { this._onDidChangeTreeData.fire(); }
  getTreeItem(element: T): T { return element; }

  getChildren(element?: T): T[] {
    if (!element) { return this.getRootChildren(); }
    return this.getChildrenOf(element);
  }

  protected abstract getRootChildren(): T[];
  protected abstract getChildrenOf(element: T): T[];
}

export class MessageItem extends vscode.TreeItem {
  constructor(label: string, icon?: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    if (icon) { this.iconPath = new vscode.ThemeIcon(icon); }
  }
}
