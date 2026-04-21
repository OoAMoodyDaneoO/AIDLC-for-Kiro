"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFileWatcher = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class JsonFileWatcher {
    constructor(opts) {
        this._onDidChange = new vscode.EventEmitter();
        this.onDidChange = this._onDidChange.event;
        this.disposables = [];
        this._current = null;
        this.filePath = opts.filePath;
        this.workspaceRoot = opts.workspaceRoot;
        this.additionalPatterns = opts.additionalPatterns ?? [];
        this.pollInterval = opts.pollInterval ?? 2000;
    }
    get current() { return this._current; }
    async init() {
        const relPath = path.relative(this.workspaceRoot, this.filePath);
        const pattern = new vscode.RelativePattern(this.workspaceRoot, relPath);
        const watcher = vscode.workspace.createFileSystemWatcher(pattern);
        watcher.onDidChange(() => this.read());
        watcher.onDidCreate(() => this.read());
        watcher.onDidDelete(() => this.emit(null));
        this.disposables.push(watcher);
        for (const p of this.additionalPatterns) {
            const w = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(this.workspaceRoot, p));
            w.onDidChange(() => this.read());
            w.onDidCreate(() => this.read());
            this.disposables.push(w);
        }
        if (this.pollInterval > 0) {
            this.pollTimer = setInterval(() => this.read(), this.pollInterval);
        }
        this.read();
    }
    read() {
        try {
            if (fs.existsSync(this.filePath)) {
                const raw = fs.readFileSync(this.filePath, 'utf-8');
                this._current = JSON.parse(raw);
                this._onDidChange.fire(this._current);
            }
            else {
                this.emit(null);
            }
        }
        catch {
            this.emit(null);
        }
    }
    emit(data) {
        this._current = data;
        this._onDidChange.fire(data);
    }
    dispose() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
        }
        this.disposables.forEach(d => d.dispose());
        this._onDidChange.dispose();
    }
}
exports.JsonFileWatcher = JsonFileWatcher;
//# sourceMappingURL=jsonFileWatcher.js.map