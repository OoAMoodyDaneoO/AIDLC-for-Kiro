import * as vscode from 'vscode';

export interface KiroChatOptions {
  displayName: string;
  sessionDelay?: number;
}

export class KiroChat {
  private displayName: string;
  private sessionDelay: number;

  constructor(opts: KiroChatOptions) {
    this.displayName = opts.displayName;
    this.sessionDelay = opts.sessionDelay ?? 500;
  }

  async send(message: string): Promise<void> {
    try {
      await vscode.commands.executeCommand('kiroAgent.newSession');
      await this.delay(this.sessionDelay);
      await vscode.commands.executeCommand('kiroAgent.sendMainUserInput', message);
    } catch {
      vscode.window.showWarningMessage(`${this.displayName}: Failed to send to Kiro Chat`);
    }
  }

  async sendRaw(message: string): Promise<void> {
    try {
      await vscode.commands.executeCommand('kiroAgent.sendMainUserInput', message);
    } catch {
      vscode.window.showWarningMessage(`${this.displayName}: Failed to send to Kiro Chat`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
