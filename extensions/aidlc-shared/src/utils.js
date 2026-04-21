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
exports.esc = esc;
exports.titleCase = titleCase;
exports.readTextFile = readTextFile;
exports.parseFrontMatter = parseFrontMatter;
exports.listFiles = listFiles;
const fs = __importStar(require("fs"));
function esc(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function titleCase(slug) {
    return slug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
function readTextFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    }
    catch {
        return '';
    }
}
function parseFrontMatter(content) {
    const result = {};
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
        return result;
    }
    for (const line of match[1].split('\n')) {
        const idx = line.indexOf(':');
        if (idx > 0) {
            result[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
        }
    }
    return result;
}
function listFiles(dir, ext) {
    try {
        return fs.readdirSync(dir).filter(f => f.endsWith(ext)).map(f => `${dir}/${f}`);
    }
    catch {
        return [];
    }
}
//# sourceMappingURL=utils.js.map