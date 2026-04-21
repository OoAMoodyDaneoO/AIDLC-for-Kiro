import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface JsonFileWatcherOptions {
  filePath: string;
  workspaceRoot: string;
  additionalPatterns?: string[];
  pollInterval?: number;
}

export class JsonFileWatcher<T> {
  private _onDidChange = new vscode.EventEmitter<T | null>();
  readonly onDidChange = this._onDidChange.event;
  private filePath: string;
  private workspaceRoot: string;
  private additionalPatterns: string[];
  private pollInterval: number;
  private disposables: vscode.Disposable[] = [];
  private pollTimer?: ReturnType<typeof setInterval>;
  private _current: T | null = null;

  constructor(opts: JsonFileWatcherOptions) {
    this.filePath = opts.filePath;
    this.workspaceRoot = opts.workspaceRoot;
    this.additionalPatterns = opts.additionalPatterns ?? [];
    this.pollInterval = opts.pollInterval ?? 2000;
  }

  get current(): T | null { return this._current; }

  async init(): Promise<void> {
    const relPath = path.relative(this.workspaceRoot, this.filePath);
    const pattern = new vscode.RelativePattern(this.workspaceRoot, relPath);
    const watcher = vscode.workspace.createFileSystemWatcher(pattern);
    watcher.onDidChange(() => this.read());
    watcher.onDidCreate(() => this.read());
    watcher.onDidDelete(() => this.emit(null));
    this.disposables.push(watcher);

    for (const p of this.additionalPatterns) {
      const w = vscode.workspace.createFileSystemWatcher(
        new vscode.RelativePattern(this.workspaceRoot, p)
      );
      w.onDidChange(() => this.read());
      w.onDidCreate(() => this.read());
      this.disposables.push(w);
    }

    if (this.pollInterval > 0) {
      this.pollTimer = setInterval(() => this.read(), this.pollInterval);
    }
    this.read();
  }

  read(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this._current = JSON.parse(raw) as T;
        this._onDidChange.fire(this._current);
      } else {
        this.emit(null);
      }
    } catch { this.emit(null); }
  }

  private emit(data: T | null): void {
    this._current = data;
    this._onDidChange.fire(data);
  }

  dispose(): void {
    if (this.pollTimer) { clearInterval(this.pollTimer); }
    this.disposables.forEach(d => d.dispose());
    this._onDidChange.dispose();
  }
}
