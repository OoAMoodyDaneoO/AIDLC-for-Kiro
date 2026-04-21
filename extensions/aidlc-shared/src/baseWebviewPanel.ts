import * as vscode from 'vscode';

export const BASE_CSS = `
:root {
  --bg: var(--vscode-editor-background);
  --fg: var(--vscode-editor-foreground);
  --accent: var(--vscode-textLink-foreground);
  --card-bg: var(--vscode-editorWidget-background);
  --card-border: var(--vscode-editorWidget-border, rgba(128,128,128,0.2));
  --green: #4caf50; --yellow: #ff9800; --red: #f44336;
  --dim: rgba(128,128,128,0.5); --blue: #2196f3;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--vscode-font-family); background: var(--bg); color: var(--fg); padding: 16px; line-height: 1.5; }
h1 { font-size: 1.4em; margin-bottom: 12px; }
h2 { font-size: 1.15em; margin: 16px 0 8px; color: var(--accent); }
h3 { font-size: 1em; margin: 12px 0 6px; }
.card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 6px; padding: 12px; margin-bottom: 10px; }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.75em; font-weight: 600; }
.badge-green { background: var(--green); color: #fff; }
.badge-yellow { background: var(--yellow); color: #000; }
.badge-red { background: var(--red); color: #fff; }
.badge-dim { background: var(--dim); color: #fff; }
.badge-blue { background: var(--blue); color: #fff; }
.progress-bar { width: 100%; height: 8px; background: var(--dim); border-radius: 4px; overflow: hidden; margin: 8px 0; }
.progress-fill { height: 100%; border-radius: 4px; transition: width 0.3s ease; }
.btn { display: inline-block; padding: 6px 14px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em; font-weight: 500; color: #fff; background: var(--accent); margin: 4px 4px 4px 0; }
.btn:hover { opacity: 0.85; }
.btn-secondary { background: var(--dim); }
.btn-green { background: var(--green); }
.btn-yellow { background: var(--yellow); color: #000; }
.btn-red { background: var(--red); }
.step-list { list-style: none; padding: 0; }
.step-item { padding: 4px 0; display: flex; align-items: center; gap: 8px; }
.step-icon { width: 16px; text-align: center; }
.file-link { color: var(--accent); cursor: pointer; text-decoration: underline; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; }
table { width: 100%; border-collapse: collapse; margin: 8px 0; }
th, td { padding: 6px 10px; text-align: left; border-bottom: 1px solid var(--card-border); }
th { font-weight: 600; color: var(--accent); }
.section { margin-bottom: 20px; }
`;

export interface WebviewPanelOptions { viewType: string; title: string; }

export abstract class BaseWebviewPanel {
  protected panel: vscode.WebviewPanel | undefined;
  private viewType: string;
  private title: string;

  constructor(opts: WebviewPanelOptions) {
    this.viewType = opts.viewType;
    this.title = opts.title;
  }

  show(extensionUri: vscode.Uri): void {
    if (this.panel) { this.panel.reveal(); this.update(); return; }
    this.panel = vscode.window.createWebviewPanel(
      this.viewType, this.title, vscode.ViewColumn.One,
      { enableScripts: true, retainContextWhenHidden: true }
    );
    this.panel.onDidDispose(() => { this.panel = undefined; });
    this.panel.webview.onDidReceiveMessage(msg => this.onMessage(msg));
    this.update();
  }

  update(): void {
    if (!this.panel) { return; }
    this.panel.webview.html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>${this.getCss()}</style></head>
<body>${this.getBodyHtml()}
<script>const vscode=acquireVsCodeApi();${this.getScriptJs()}</script>
</body></html>`;
  }

  protected getCss(): string { return BASE_CSS; }
  protected abstract getBodyHtml(): string;
  protected abstract onMessage(msg: unknown): void;
  protected getScriptJs(): string { return ''; }
  dispose(): void { this.panel?.dispose(); }
}
