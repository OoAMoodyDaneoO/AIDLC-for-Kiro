import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface ConfigCategory {
  label: string;
  icon: string;
  basePath: string;
  subfolders: { label: string; folder: string }[];
}

const CATEGORIES: ConfigCategory[] = [
  {
    label: 'Agents', icon: 'person',
    basePath: '.kiro/agents',
    subfolders: [
      { label: 'AI-DLC Agents', folder: 'aidlc subagents' },
      { label: 'Enterprise Agents', folder: 'enterprise subagents' },
      { label: 'Project Agents', folder: 'project subagents' },
    ],
  },
  {
    label: 'Skills', icon: 'lightbulb',
    basePath: '.kiro/skills',
    subfolders: [
      { label: 'Enterprise Skills', folder: 'enterprise skills' },
      { label: 'Project Skills', folder: 'project skills' },
    ],
  },
  {
    label: 'Steering Files', icon: 'compass',
    basePath: '.kiro/steering',
    subfolders: [
      { label: 'AI-DLC Steering', folder: 'aidlc-steering files' },
      { label: 'Enterprise Steering', folder: 'enterprise steering' },
      { label: 'Project Steering', folder: 'project steering' },
    ],
  },
];


export class ConfigItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly fsPath?: string,
    public readonly isFile?: boolean,
    public readonly categoryBase?: string,
    public readonly subfolder?: string,
  ) {
    super(label, collapsibleState);
    if (isFile && fsPath) {
      this.command = { command: 'aidlc.openConfigFile', title: 'Open', arguments: [fsPath] };
      this.contextValue = 'configFile';
      this.iconPath = new vscode.ThemeIcon('file');
      this.tooltip = fsPath;
    } else if (categoryBase && subfolder) {
      this.contextValue = 'configSubfolder';
      this.iconPath = new vscode.ThemeIcon('folder');
    } else {
      this.contextValue = 'configCategory';
    }
  }
}

export class ConfigTreeProvider implements vscode.TreeDataProvider<ConfigItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<ConfigItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private workspaceRoot: string;

  constructor(workspaceRoot: string) { this.workspaceRoot = workspaceRoot; }
  refresh(): void { this._onDidChangeTreeData.fire(undefined); }

  getTreeItem(element: ConfigItem): vscode.TreeItem { return element; }

  getChildren(element?: ConfigItem): ConfigItem[] {
    if (!element) {
      return CATEGORIES.map(c => {
        const item = new ConfigItem(c.label, vscode.TreeItemCollapsibleState.Expanded);
        item.iconPath = new vscode.ThemeIcon(c.icon);
        (item as any)._category = c;
        return item;
      });
    }
    const cat = (element as any)._category as ConfigCategory | undefined;
    if (cat) {
      return cat.subfolders.map(sf => {
        const item = new ConfigItem(sf.label, vscode.TreeItemCollapsibleState.Collapsed, undefined, false, cat.basePath, sf.folder);
        return item;
      });
    }
    if (element.categoryBase && element.subfolder) {
      const dir = path.join(this.workspaceRoot, element.categoryBase, element.subfolder);
      if (!fs.existsSync(dir)) { return []; }
      try {
        return fs.readdirSync(dir)
          .filter(f => !f.startsWith('.'))
          .sort()
          .map(f => {
            const fp = path.join(dir, f);
            const isDir = fs.statSync(fp).isDirectory();
            if (isDir) {
              const files = fs.readdirSync(fp).filter(ff => !ff.startsWith('.')).length;
              const item = new ConfigItem(f, vscode.TreeItemCollapsibleState.Collapsed, fp, false, element.categoryBase, `${element.subfolder}/${f}`);
              item.iconPath = new vscode.ThemeIcon('folder');
              return item;
            }
            return new ConfigItem(f, vscode.TreeItemCollapsibleState.None, fp, true);
          });
      } catch { return []; }
    }
    return [];
  }

  async addFile(element: ConfigItem): Promise<void> {
    if (!element.categoryBase || !element.subfolder) { return; }
    const name = await vscode.window.showInputBox({
      prompt: `Name for the new file`,
      placeHolder: 'e.g., my-custom-agent.md',
    });
    if (!name) { return; }
    const dir = path.join(this.workspaceRoot, element.categoryBase, element.subfolder);
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
    const filePath = path.join(dir, name.endsWith('.md') ? name : `${name}.md`);
    fs.writeFileSync(filePath, `# ${name.replace('.md', '')}\n\n`, 'utf-8');
    this.refresh();
    vscode.window.showTextDocument(vscode.Uri.file(filePath));
  }

  deleteFile(element: ConfigItem): void {
    if (!element.fsPath || !element.isFile) { return; }
    vscode.window.showWarningMessage(`Delete "${element.label}"?`, { modal: true }, 'Delete').then(choice => {
      if (choice === 'Delete' && element.fsPath) {
        fs.unlinkSync(element.fsPath);
        this.refresh();
      }
    });
  }
}
