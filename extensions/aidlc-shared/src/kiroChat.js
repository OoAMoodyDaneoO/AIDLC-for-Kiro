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
exports.KiroChat = void 0;
const vscode = __importStar(require("vscode"));
class KiroChat {
    constructor(opts) {
        this.displayName = opts.displayName;
        this.sessionDelay = opts.sessionDelay ?? 500;
    }
    async send(message) {
        try {
            await vscode.commands.executeCommand('kiroAgent.newSession');
            await this.delay(this.sessionDelay);
            await vscode.commands.executeCommand('kiroAgent.sendMainUserInput', message);
        }
        catch {
            vscode.window.showWarningMessage(`${this.displayName}: Failed to send to Kiro Chat`);
        }
    }
    async sendRaw(message) {
        try {
            await vscode.commands.executeCommand('kiroAgent.sendMainUserInput', message);
        }
        catch {
            vscode.window.showWarningMessage(`${this.displayName}: Failed to send to Kiro Chat`);
        }
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.KiroChat = KiroChat;
//# sourceMappingURL=kiroChat.js.map