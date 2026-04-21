import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BaseWebviewPanel, esc, KiroChat, BASE_CSS } from 'aidlc-shared';
import { AidlcManifest, PHASE_DISPLAY, PhaseName, STAGE_DEFINITIONS } from './types';

/** Stage ordering for dependency checks */
const STAGE_ORDER = STAGE_DEFINITIONS.map(d => d.name);

/** Maps each stage to its artifact directory and continue command */
const STAGE_ARTIFACT_MAP: Record<string, { dir: string; continueCmd: string; description: string }> = {
  'Workspace Detection':   { dir: '',                             continueCmd: 'Using AI-DLC, start intent alignment',      description: 'Scan workspace and determine project type' },
  'Intent Alignment':      { dir: 'inception/intent',             continueCmd: 'Using AI-DLC, start requirements analysis', description: 'Capture and clarify what you want to build' },
  'Requirements Analysis': { dir: 'inception/requirements',       continueCmd: 'Using AI-DLC, start user stories',          description: 'Define functional and non-functional requirements' },
  'User Stories':          { dir: 'inception/user-stories',       continueCmd: 'Using AI-DLC, start workflow planning',      description: 'Create user stories with acceptance criteria' },
  'Workflow Planning':     { dir: 'inception/plans',              continueCmd: 'Using AI-DLC, start application design',     description: 'Plan execution phases and depth levels' },
  'Application Design':    { dir: 'inception/application-design', continueCmd: 'Using AI-DLC, start units generation',       description: 'Design components, services, and interactions' },
  'Units Generation':      { dir: 'inception/plans',              continueCmd: 'Using AI-DLC, start functional design',      description: 'Decompose system into units of work' },
  'Functional Design':     { dir: 'construction/plans',           continueCmd: 'Using AI-DLC, start NFR requirements',       description: 'Detail data models and business logic' },
  'NFR Requirements':      { dir: 'construction/plans',           continueCmd: 'Using AI-DLC, start NFR design',             description: 'Define performance, security, scalability needs' },
  'NFR Design':            { dir: 'construction/plans',           continueCmd: 'Using AI-DLC, start infrastructure design',  description: 'Design patterns for non-functional requirements' },
  'Infrastructure Design': { dir: 'construction/plans',           continueCmd: 'Using AI-DLC, start code generation',        description: 'Map infrastructure services and deployment' },
  'Code Generation':       { dir: 'construction/plans',           continueCmd: 'Using AI-DLC, start build and test',         description: 'Generate application code from designs' },
  'Build and Test':        { dir: 'construction/build-and-test',  continueCmd: 'Using AI-DLC, start operations',             description: 'Build, test, and validate the implementation' },
  'Operations':            { dir: 'operations',                   continueCmd: '',                                            description: 'Deploy, monitor, and maintain in production' },
};

const DASHBOARD_CSS = `
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
  @keyframes toastIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes toastOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
  body { padding: 20px 24px; }

  /* Toast notifications */
  .toast-container { position: fixed; top: 16px; right: 16px; z-index: 2000; display: flex; flex-direction: column; gap: 8px; }
  .toast { padding: 10px 16px; border-radius: 8px; font-size: 0.84em; font-weight: 500; animation: toastIn 0.3s ease; box-shadow: 0 4px 16px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 8px; max-width: 340px; }
  .toast.removing { animation: toastOut 0.3s ease forwards; }
  .toast-info { background: rgba(33,150,243,0.9); color: #fff; }
  .toast-success { background: rgba(76,175,80,0.9); color: #fff; }
  .toast-warning { background: rgba(255,152,0,0.9); color: #fff; }

  /* Search bar */
  .search-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; padding: 8px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; transition: border-color 0.2s; }
  .search-bar:focus-within { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(33,150,243,0.15); }
  .search-bar input { flex: 1; background: transparent; border: none; color: var(--fg); font-size: 0.88em; font-family: var(--vscode-font-family); outline: none; }
  .search-bar input::placeholder { color: var(--dim); }
  .search-bar .search-icon { opacity: 0.4; font-size: 0.9em; }
  .search-bar .search-shortcut { font-size: 0.7em; opacity: 0.3; padding: 2px 6px; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; }
  .search-results { margin-bottom: 16px; }
  .search-result { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 0.84em; transition: background 0.15s; }
  .search-result:hover { background: rgba(33,150,243,0.08); }
  .search-result .result-stage { font-size: 0.75em; opacity: 0.4; }
  .search-no-results { text-align: center; padding: 16px; opacity: 0.4; font-size: 0.85em; }

  /* Hero */
  .hero { background: linear-gradient(135deg, rgba(33,150,243,0.12), rgba(76,175,80,0.08)); border: 1px solid rgba(33,150,243,0.2); border-radius: 12px; padding: 24px; margin-bottom: 24px; animation: fadeIn 0.4s ease; }
  .hero h1 { font-size: 1.5em; margin-bottom: 2px; display: flex; align-items: center; gap: 12px; letter-spacing: -0.02em; }
  .hero .meta { font-size: 0.85em; opacity: 0.55; margin-top: 4px; }
  .hero .type-badge { font-size: 0.55em; padding: 3px 10px; border-radius: 12px; background: linear-gradient(135deg, var(--blue), var(--accent)); color: #fff; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase; }
  .feature-select { background: rgba(255,255,255,0.05); color: var(--fg); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 8px 12px; font-size: 0.9em; font-family: var(--vscode-font-family); width: 100%; cursor: pointer; margin: 10px 0; }
  .progress-container { margin: 16px 0 8px; }
  .progress-track { width: 100%; height: 8px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, #2196f3, #4caf50, #8bc34a); background-size: 200% 100%; animation: shimmer 3s ease infinite; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
  .progress-row { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }
  .progress-label { font-size: 0.8em; opacity: 0.5; }
  .progress-pct { font-size: 1.4em; font-weight: 700; background: linear-gradient(135deg, #2196f3, #4caf50); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .new-feature-btn { background: transparent; border: 1px dashed rgba(255,255,255,0.2); color: var(--fg); padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 0.82em; font-family: var(--vscode-font-family); opacity: 0.6; transition: all 0.2s; }
  .new-feature-btn:hover { opacity: 1; border-color: var(--accent); color: var(--accent); }

  /* Workflow */
  .workflow { margin-bottom: 28px; }
  .phase-section { margin-bottom: 4px; animation: fadeIn 0.5s ease backwards; }
  .phase-section:nth-child(1) { animation-delay: 0.1s; } .phase-section:nth-child(2) { animation-delay: 0.2s; } .phase-section:nth-child(3) { animation-delay: 0.3s; }
  .phase-banner { display: flex; align-items: center; gap: 12px; padding: 14px 18px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; cursor: pointer; transition: all 0.25s; user-select: none; }
  .phase-banner:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); }
  .phase-banner.completed { border-left: 3px solid var(--green); } .phase-banner.in-progress { border-left: 3px solid var(--yellow); }
  .phase-banner.pending { border-left: 3px solid rgba(128,128,128,0.3); opacity: 0.55; } .phase-banner.pending:hover { opacity: 0.75; }
  .phase-number { background: linear-gradient(135deg, var(--accent), var(--blue)); color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85em; font-weight: 700; flex-shrink: 0; box-shadow: 0 2px 8px rgba(33,150,243,0.3); }
  .phase-banner.completed .phase-number { background: linear-gradient(135deg, var(--green), #66bb6a); }
  .phase-banner.in-progress .phase-number { background: linear-gradient(135deg, var(--yellow), #ffb74d); }
  .phase-info { flex: 1; } .phase-name { font-weight: 600; font-size: 1em; } .phase-summary { font-size: 0.78em; opacity: 0.45; margin-top: 2px; }
  .phase-pct { font-size: 0.85em; font-weight: 700; padding: 2px 10px; border-radius: 10px; }
  .phase-pct.done { background: rgba(76,175,80,0.15); color: var(--green); } .phase-pct.active { background: rgba(255,152,0,0.15); color: var(--yellow); } .phase-pct.waiting { background: rgba(128,128,128,0.1); color: var(--dim); }
  .phase-chevron { font-size: 0.8em; opacity: 0.4; transition: transform 0.25s; } .phase-chevron.open { transform: rotate(90deg); }

  /* Sub-stages */
  .phase-stages { padding: 0 0 0 22px; border-left: 2px solid rgba(255,255,255,0.06); margin-left: 34px; margin-top: 2px; } .phase-stages.collapsed { display: none; }
  .stage-card { position: relative; padding: 14px 16px; margin: 6px 0; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; transition: all 0.2s; }
  .stage-card:hover { border-color: rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); }
  .stage-card.completed { border-left: 3px solid var(--green); } .stage-card.in-progress { border-left: 3px solid var(--yellow); box-shadow: 0 0 12px rgba(255,152,0,0.08); }
  .stage-card.pending { opacity: 0.5; } .stage-card.blocked { opacity: 0.35; }
  .stage-card::before { content: ''; position: absolute; left: -23px; top: 22px; width: 20px; height: 2px; background: rgba(255,255,255,0.06); }
  .stage-header { display: flex; align-items: center; gap: 10px; }
  .stage-icon { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.85em; flex-shrink: 0; border-radius: 50%; }
  .stage-card.completed .stage-icon { background: rgba(76,175,80,0.15); color: var(--green); }
  .stage-card.in-progress .stage-icon { background: rgba(255,152,0,0.15); color: var(--yellow); animation: pulse 2s ease infinite; }
  .stage-card.pending .stage-icon, .stage-card.blocked .stage-icon { background: rgba(128,128,128,0.08); color: var(--dim); }
  .stage-name { font-weight: 600; font-size: 0.9em; flex: 1; } .stage-badge { font-size: 0.7em; padding: 2px 8px; border-radius: 8px; font-weight: 600; }
  .stage-badge.skipped { background: rgba(128,128,128,0.15); color: var(--dim); } .stage-badge.blocked-badge { background: rgba(244,67,54,0.12); color: var(--red); }
  .stage-desc { font-size: 0.78em; opacity: 0.45; margin: 4px 0 0 34px; }
  .stage-progress { margin: 8px 0 0 34px; height: 3px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
  .stage-progress-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }
  .stage-artifacts { margin: 10px 0 0 34px; display: flex; flex-wrap: wrap; gap: 6px; }
  .artifact-chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; background: rgba(33,150,243,0.06); border: 1px solid rgba(33,150,243,0.15); border-radius: 16px; font-size: 0.78em; cursor: pointer; transition: all 0.15s; }
  .artifact-chip:hover { background: rgba(33,150,243,0.12); border-color: var(--accent); color: var(--accent); }
  .artifact-chip .chip-edit { opacity: 0; margin-left: 2px; transition: opacity 0.15s; } .artifact-chip:hover .chip-edit { opacity: 0.7; }
  .stage-actions { margin: 10px 0 0 34px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .continue-btn { background: linear-gradient(135deg, var(--accent), var(--blue)); color: #fff; border: none; padding: 6px 16px; border-radius: 6px; cursor: pointer; font-size: 0.82em; font-weight: 600; font-family: var(--vscode-font-family); transition: all 0.2s; box-shadow: 0 2px 8px rgba(33,150,243,0.25); display: inline-flex; align-items: center; gap: 6px; }
  .continue-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(33,150,243,0.35); }
  .run-btn { background: transparent; border: 1px solid rgba(33,150,243,0.4); color: var(--accent); padding: 5px 14px; border-radius: 6px; cursor: pointer; font-size: 0.78em; font-family: var(--vscode-font-family); font-weight: 600; transition: all 0.2s; }
  .run-btn:hover { background: var(--accent); color: #fff; }
  .skip-btn { background: transparent; border: 1px solid rgba(128,128,128,0.3); color: var(--dim); padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 0.75em; font-family: var(--vscode-font-family); transition: all 0.2s; }
  .skip-btn:hover { border-color: var(--yellow); color: var(--yellow); }


  /* Governance */
  .section-title { font-size: 1.1em; font-weight: 600; margin: 28px 0 14px; display: flex; align-items: center; gap: 8px; opacity: 0.9; }
  .governance-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
  .gov-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px; transition: all 0.25s ease; }
  .gov-card:hover { border-color: rgba(255,255,255,0.15); transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
  .gov-card h3 { font-size: 0.9em; margin-bottom: 8px; font-weight: 600; }
  .gov-card .gov-value { font-size: 0.82em; opacity: 0.6; margin-bottom: 6px; line-height: 1.4; }
  .gov-card .gov-action { margin-top: 10px; }
  .action-btn { background: linear-gradient(135deg, var(--accent), var(--blue)); color: #fff; border: none; padding: 7px 16px; border-radius: 6px; cursor: pointer; font-size: 0.82em; font-weight: 600; font-family: var(--vscode-font-family); transition: all 0.2s; box-shadow: 0 2px 8px rgba(33,150,243,0.25); }
  .action-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(33,150,243,0.35); }
  .action-btn-outline { background: transparent; border: 1px solid rgba(33,150,243,0.4); color: var(--accent); padding: 7px 16px; border-radius: 6px; cursor: pointer; font-size: 0.82em; font-weight: 600; font-family: var(--vscode-font-family); transition: all 0.2s; }
  .action-btn-outline:hover { background: rgba(33,150,243,0.1); }

  /* Audit log viewer */
  .audit-section { margin-top: 28px; }
  .audit-toggle { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; padding: 8px 0; }
  .audit-toggle .chevron { font-size: 0.7em; transition: transform 0.2s; display: inline-block; } .audit-toggle .chevron.open { transform: rotate(90deg); }
  .audit-entries { max-height: 300px; overflow-y: auto; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; margin-top: 8px; }
  .audit-entries.collapsed { display: none; }
  .audit-entry { padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 0.82em; line-height: 1.5; }
  .audit-entry:last-child { border-bottom: none; }
  .audit-entry:hover { background: rgba(255,255,255,0.02); }
  .audit-entry .audit-time { font-size: 0.75em; opacity: 0.35; margin-bottom: 2px; }
  .audit-entry .audit-stage { font-size: 0.75em; color: var(--accent); opacity: 0.6; }
  .audit-entry .audit-input { margin-top: 4px; opacity: 0.7; }
  .audit-entry .audit-full { display: none; margin-top: 6px; opacity: 0.6; font-size: 0.8em; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
  .audit-entry.expanded .audit-full { display: block; }
  .audit-entry.expanded .audit-input .truncated { display: none; }
  .expand-btn { background: transparent; border: none; color: var(--accent); cursor: pointer; font-size: 0.75em; padding: 2px 0; font-family: var(--vscode-font-family); opacity: 0.7; transition: opacity 0.15s; }
  .expand-btn:hover { opacity: 1; text-decoration: underline; }
  .timeline-item .tl-full { display: none; margin-top: 4px; opacity: 0.5; font-size: 0.8em; line-height: 1.4; white-space: pre-wrap; word-break: break-word; }
  .timeline-item.expanded .tl-full { display: block; }
  .timeline-item.expanded .tl-text .truncated { display: none; }

  /* Markdown overlay */
  .md-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease; }
  .md-panel { background: var(--bg); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; width: 90%; max-width: 900px; height: 80vh; display: flex; flex-direction: column; box-shadow: 0 16px 48px rgba(0,0,0,0.4); }
  .md-panel-header { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
  .md-panel-title { flex: 1; font-weight: 600; font-size: 0.95em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .md-panel-path { font-size: 0.75em; opacity: 0.4; margin-left: 8px; font-weight: 400; }
  .md-tab-bar { display: flex; gap: 2px; }
  .md-tab { background: transparent; border: none; color: var(--fg); opacity: 0.5; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 0.82em; font-family: var(--vscode-font-family); font-weight: 600; transition: all 0.15s; }
  .md-tab:hover { opacity: 0.8; } .md-tab.active { opacity: 1; background: rgba(33,150,243,0.12); color: var(--accent); }
  .md-close-btn { background: transparent; border: none; color: var(--fg); opacity: 0.5; cursor: pointer; font-size: 1.2em; padding: 4px 8px; border-radius: 6px; }
  .md-close-btn:hover { opacity: 1; background: rgba(255,255,255,0.06); }
  .md-panel-body { flex: 1; overflow: auto; padding: 18px; } .md-panel-body.editing { padding: 0; }
  .md-editor { width: 100%; height: 100%; background: transparent; color: var(--fg); border: none; resize: none; font-family: 'SF Mono','Fira Code','Cascadia Code',monospace; font-size: 0.88em; line-height: 1.6; padding: 18px; outline: none; tab-size: 2; }
  .md-rendered { font-size: 0.92em; line-height: 1.7; }
  .md-rendered h1 { font-size: 1.5em; margin: 16px 0 10px; color: var(--accent); border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px; }
  .md-rendered h2 { font-size: 1.25em; margin: 14px 0 8px; color: var(--accent); } .md-rendered h3 { font-size: 1.1em; margin: 12px 0 6px; }
  .md-rendered p { margin: 8px 0; } .md-rendered ul,.md-rendered ol { margin: 8px 0; padding-left: 24px; } .md-rendered li { margin: 3px 0; }
  .md-rendered code { background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; font-family: 'SF Mono','Fira Code',monospace; font-size: 0.9em; }
  .md-rendered pre { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 14px; overflow-x: auto; margin: 10px 0; }
  .md-rendered pre code { background: transparent; padding: 0; }
  .md-rendered blockquote { border-left: 3px solid var(--accent); padding-left: 14px; opacity: 0.7; margin: 10px 0; }
  .md-rendered strong { font-weight: 700; } .md-rendered em { font-style: italic; }
  .md-rendered hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 16px 0; }
  .md-rendered table { width: 100%; border-collapse: collapse; margin: 10px 0; }
  .md-rendered th,.md-rendered td { padding: 8px 12px; border: 1px solid rgba(255,255,255,0.08); text-align: left; }
  .md-rendered th { background: rgba(255,255,255,0.04); font-weight: 600; }
  .md-panel-footer { display: flex; align-items: center; justify-content: space-between; padding: 10px 18px; border-top: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
  .md-status { font-size: 0.78em; opacity: 0.4; }
  .md-save-btn { background: linear-gradient(135deg, var(--accent), var(--blue)); color: #fff; border: none; padding: 7px 20px; border-radius: 6px; cursor: pointer; font-size: 0.84em; font-weight: 600; font-family: var(--vscode-font-family); transition: all 0.2s; box-shadow: 0 2px 8px rgba(33,150,243,0.25); }
  .md-save-btn:hover { transform: translateY(-1px); } .md-save-btn:disabled { opacity: 0.4; cursor: default; transform: none; }
  .md-saved-indicator { color: var(--green); font-size: 0.82em; font-weight: 600; opacity: 0; transition: opacity 0.3s; } .md-saved-indicator.show { opacity: 1; }

  .empty { text-align: center; padding: 80px 20px; animation: fadeIn 0.6s ease; } .empty h2 { font-size: 1.4em; margin-bottom: 12px; opacity: 0.8; } .empty p { opacity: 0.45; margin-bottom: 24px; }

  /* Design Catalogue */
  .catalogue-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; margin-top: 10px; }
  .catalogue-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px; transition: all 0.25s; }
  .catalogue-card:hover { border-color: rgba(33,150,243,0.3); transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
  .catalogue-card .cat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .catalogue-card .cat-icon { font-size: 1.3em; } .catalogue-card .cat-title { font-weight: 600; font-size: 0.9em; }
  .catalogue-card .cat-count { font-size: 0.72em; opacity: 0.4; margin-left: auto; padding: 2px 8px; border-radius: 8px; background: rgba(255,255,255,0.06); }
  .catalogue-card .cat-desc { font-size: 0.78em; opacity: 0.5; line-height: 1.4; margin-bottom: 10px; }
  .catalogue-card .cat-files { display: flex; flex-direction: column; gap: 4px; }
  .cat-file { display: flex; align-items: center; gap: 6px; font-size: 0.8em; padding: 3px 6px; border-radius: 4px; cursor: pointer; transition: background 0.15s; }
  .cat-file:hover { background: rgba(33,150,243,0.08); color: var(--accent); }
  .cat-empty { font-size: 0.8em; opacity: 0.35; font-style: italic; }

  /* PM Tool Wizard */
  .pm-wizard { margin-top: 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 20px; }
  .pm-wizard-step { margin-bottom: 16px; }
  .pm-wizard-step .step-label { font-size: 0.85em; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .pm-wizard-step .step-number { background: var(--accent); color: #fff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75em; font-weight: 700; flex-shrink: 0; }
  .pm-tool-options { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; }
  .pm-tool-option { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 10px; background: rgba(255,255,255,0.03); border: 2px solid rgba(255,255,255,0.08); border-radius: 10px; cursor: pointer; transition: all 0.2s; font-size: 0.84em; font-weight: 500; }
  .pm-tool-option:hover { border-color: rgba(33,150,243,0.3); background: rgba(33,150,243,0.05); }
  .pm-tool-option.selected { border-color: var(--accent); background: rgba(33,150,243,0.08); }
  .pm-tool-option .tool-icon { font-size: 1.6em; }
  .pm-config-fields { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
  .pm-field { display: flex; flex-direction: column; gap: 4px; }
  .pm-field label { font-size: 0.8em; opacity: 0.6; font-weight: 500; }
  .pm-field input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 8px 12px; color: var(--fg); font-size: 0.88em; font-family: var(--vscode-font-family); outline: none; transition: border-color 0.2s; }
  .pm-field input:focus { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(33,150,243,0.15); }
  .pm-field input::placeholder { color: var(--dim); }
  .pm-wizard-actions { display: flex; gap: 8px; margin-top: 14px; }
  .pm-status { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(76,175,80,0.08); border: 1px solid rgba(76,175,80,0.2); border-radius: 8px; font-size: 0.84em; }

  /* Task Tracker */
  .task-board { margin-top: 10px; }
  .task-summary { display: flex; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
  .task-stat { display: flex; align-items: center; gap: 6px; font-size: 0.82em; padding: 4px 12px; border-radius: 16px; background: rgba(255,255,255,0.04); }
  .task-stat .dot { width: 8px; height: 8px; border-radius: 50%; }
  .task-stat .dot-done { background: var(--green); } .task-stat .dot-wip { background: var(--yellow); } .task-stat .dot-todo { background: var(--dim); }
  .task-list { display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow-y: auto; }
  .task-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 6px; font-size: 0.82em; transition: background 0.15s; }
  .task-item:hover { background: rgba(255,255,255,0.03); }
  .task-item .task-check { flex-shrink: 0; width: 16px; height: 16px; border-radius: 4px; border: 2px solid var(--dim); display: flex; align-items: center; justify-content: center; font-size: 0.7em; }
  .task-item.done .task-check { background: var(--green); border-color: var(--green); color: #fff; }
  .task-item.wip .task-check { background: var(--yellow); border-color: var(--yellow); color: #fff; }
  .task-item .task-text { flex: 1; } .task-item.done .task-text { opacity: 0.45; text-decoration: line-through; }
  .task-item .task-source { font-size: 0.7em; opacity: 0.3; }

  /* Landing Page */
  .landing-header { text-align: center; padding: 30px 20px 20px; animation: fadeIn 0.4s ease; }
  .landing-header h1 { font-size: 1.8em; letter-spacing: -0.03em; margin-bottom: 6px; }
  .landing-header h1 span { background: linear-gradient(135deg, #2196f3, #4caf50); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .landing-header p { opacity: 0.45; font-size: 0.9em; }
  .landing-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0 28px; }
  .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px; text-align: center; transition: all 0.2s; }
  .stat-card:hover { border-color: rgba(255,255,255,0.15); transform: translateY(-1px); }
  .stat-value { font-size: 1.8em; font-weight: 700; background: linear-gradient(135deg, #2196f3, #4caf50); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .stat-label { font-size: 0.78em; opacity: 0.45; margin-top: 4px; }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin-bottom: 28px; }
  .feature-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.3s; animation: fadeIn 0.5s ease backwards; position: relative; overflow: hidden; }
  .feature-card:hover { border-color: rgba(33,150,243,0.3); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
  .feature-card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--accent), var(--green)); opacity: 0; transition: opacity 0.3s; }
  .feature-card:hover::after { opacity: 1; }
  .feature-card .fc-name { font-size: 1.1em; font-weight: 700; margin-bottom: 4px; }
  .feature-card .fc-type { font-size: 0.72em; padding: 2px 8px; border-radius: 8px; background: rgba(33,150,243,0.1); color: var(--accent); font-weight: 600; display: inline-block; margin-bottom: 10px; }
  .feature-card .fc-stage { font-size: 0.82em; opacity: 0.5; margin-bottom: 12px; }
  .feature-card .fc-progress { height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; margin-bottom: 8px; }
  .feature-card .fc-progress-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #2196f3, #4caf50); transition: width 0.6s ease; }
  .feature-card .fc-stats { display: flex; justify-content: space-between; font-size: 0.78em; opacity: 0.45; }
  .feature-card .fc-ring { position: absolute; top: 16px; right: 16px; width: 44px; height: 44px; }
  .fc-ring svg { transform: rotate(-90deg); } .fc-ring circle { fill: none; stroke-width: 3; }
  .fc-ring .ring-bg { stroke: rgba(255,255,255,0.06); } .fc-ring .ring-fill { stroke: var(--accent); stroke-linecap: round; transition: stroke-dashoffset 0.8s ease; }
  .landing-new-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 16px; background: transparent; border: 2px dashed rgba(255,255,255,0.1); border-radius: 12px; color: var(--fg); opacity: 0.4; cursor: pointer; font-size: 0.9em; font-family: var(--vscode-font-family); transition: all 0.2s; }
  .landing-new-btn:hover { opacity: 0.8; border-color: var(--accent); color: var(--accent); }
  .breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 0.82em; margin-bottom: 16px; opacity: 0.6; }
  .breadcrumb a { color: var(--accent); cursor: pointer; text-decoration: none; } .breadcrumb a:hover { text-decoration: underline; }
  .breadcrumb .sep { opacity: 0.3; }
  .timeline-section { margin-top: 28px; }
  .timeline { position: relative; padding-left: 24px; }
  .timeline::before { content: ''; position: absolute; left: 8px; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.06); }
  .timeline-item { position: relative; padding: 8px 0 16px; animation: fadeIn 0.4s ease backwards; }
  .timeline-item::before { content: ''; position: absolute; left: -20px; top: 12px; width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--accent); background: var(--bg); }
  .timeline-item.completed::before { background: var(--green); border-color: var(--green); }
  .timeline-item .tl-time { font-size: 0.72em; opacity: 0.35; } .timeline-item .tl-text { font-size: 0.84em; margin-top: 2px; }
  .timeline-item .tl-feature { font-size: 0.72em; color: var(--accent); opacity: 0.6; }

  /* Responsive */
  @media (max-width: 600px) {
    .landing-stats { grid-template-columns: repeat(2, 1fr); }
    .features-grid { grid-template-columns: 1fr; }
    .governance-grid { grid-template-columns: 1fr; }
    .catalogue-grid { grid-template-columns: 1fr; }
    .pm-tool-options { grid-template-columns: repeat(2, 1fr); }
    .hero h1 { font-size: 1.2em; }
    .landing-header h1 { font-size: 1.4em; }
  }

  /* Theme-aware — use VS Code tokens */
  .hero { background: linear-gradient(135deg, color-mix(in srgb, var(--vscode-textLink-foreground) 12%, transparent), color-mix(in srgb, var(--green) 8%, transparent)); }
  .phase-banner, .stage-card, .gov-card, .catalogue-card, .feature-card, .stat-card { background: var(--vscode-editorWidget-background, rgba(255,255,255,0.03)); border-color: var(--vscode-editorWidget-border, rgba(128,128,128,0.2)); }
  .search-bar { background: var(--vscode-input-background, rgba(255,255,255,0.04)); border-color: var(--vscode-input-border, rgba(128,128,128,0.2)); }
  .search-bar input { color: var(--vscode-input-foreground, var(--fg)); }
  .md-panel { background: var(--vscode-editor-background); border-color: var(--vscode-editorWidget-border, rgba(128,128,128,0.2)); }
  .md-editor { color: var(--vscode-editor-foreground); }
  .pm-field input { background: var(--vscode-input-background, rgba(255,255,255,0.05)); border-color: var(--vscode-input-border, rgba(128,128,128,0.2)); color: var(--vscode-input-foreground, var(--fg)); }

  /* Comparison View */
  .compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .compare-card { background: var(--vscode-editorWidget-background, rgba(255,255,255,0.03)); border: 1px solid var(--vscode-editorWidget-border, rgba(128,128,128,0.2)); border-radius: 10px; padding: 20px; }
  .compare-card h3 { font-size: 1em; margin-bottom: 12px; }
  .compare-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 0.84em; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .compare-row:last-child { border-bottom: none; }
`;


interface AuditEntry { stage: string; timestamp: string; userInput: string; aiResponse: string; context: string; }

export class DashboardPanel extends BaseWebviewPanel {
  private manifest: AidlcManifest | null = null;
  private allManifests: AidlcManifest[] = [];
  private activeIndex = 0;
  private chat: KiroChat;
  private workspaceRoot: string = '';
  private currentView: 'landing' | 'feature' | 'compare' = 'landing';
  private comparisonFeatures: string[] = [];

  constructor(chat: KiroChat) { super({ viewType: 'aidlcDashboard', title: 'AI-DLC Dashboard' }); this.chat = chat; }
  setWorkspaceRoot(root: string): void { this.workspaceRoot = root; }
  setManifest(m: AidlcManifest | null): void { this.manifest = m; this.update(); }
  setManifests(manifests: AidlcManifest[], activeIndex: number): void {
    this.allManifests = manifests; this.activeIndex = activeIndex;
    this.manifest = manifests[activeIndex] || null; this.update();
  }
  triggerSearch(): void { this.panel?.webview.postMessage({ type: 'focusSearch' }); }
  setDefaultView(view: 'landing' | 'feature'): void { this.currentView = view; }

  showComparison(feature1: string, feature2: string): void {
    this.comparisonFeatures = [feature1, feature2];
    this.currentView = 'compare';
    this.update();
  }
  protected getCss(): string { return BASE_CSS + DASHBOARD_CSS; }

  private getHealthScore(manifest: AidlcManifest): { score: number; color: string; label: string } {
    const done = manifest.stages.filter(s => s.status === 'complete').length;
    const total = manifest.stages.length;
    const skipped = manifest.stages.filter(s => (s.status as string) === 'skipped').length;
    const pct = total > 0 ? (done / total) * 100 : 0;
    const skipPenalty = skipped * 5;
    const score = Math.max(0, Math.min(100, Math.round(pct - skipPenalty)));
    if (score >= 80) { return { score, color: 'var(--green)', label: 'Healthy' }; }
    if (score >= 50) { return { score, color: 'var(--yellow)', label: 'Needs Attention' }; }
    return { score, color: 'var(--red)', label: 'At Risk' };
  }

  private getComparisonHtml(): string {
    const manifests = this.comparisonFeatures.map(name => this.allManifests.find(m => m.featureName === name)).filter(Boolean) as AidlcManifest[];
    if (manifests.length < 2) { return '<div class="empty"><h2>Comparison unavailable</h2></div>'; }
    let h = '<div class="toast-container" id="toasts" role="status" aria-live="polite"></div>';
    h += `<div class="breadcrumb" role="navigation" aria-label="Breadcrumb"><a onclick="vscode.postMessage({type:'navigateToLanding'})">🏠 All Features</a><span class="sep">›</span><span>Compare</span></div>`;
    h += '<div class="section-title">⚖️ Feature Comparison</div>';
    h += '<div class="compare-grid">';
    for (const m of manifests) {
      const done = m.stages.filter(s => s.status === 'complete').length;
      const total = m.stages.length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      const health = this.getHealthScore(m);
      h += '<div class="compare-card">';
      h += `<h3>${esc(m.featureName)}</h3>`;
      h += `<div class="compare-row"><span>Type</span><span>${esc(m.projectType)}</span></div>`;
      h += `<div class="compare-row"><span>Current Stage</span><span>${esc(m.currentStage)}</span></div>`;
      h += `<div class="compare-row"><span>Progress</span><span>${done}/${total} (${pct}%)</span></div>`;
      h += `<div class="compare-row"><span>Health</span><span style="color:${health.color}">${health.label} (${health.score})</span></div>`;
      h += '<div style="margin-top:12px;font-size:0.82em;opacity:0.6">Stages:</div>';
      for (const s of m.stages) {
        const icon = s.status === 'complete' ? '✅' : s.status === 'in-progress' ? '⏳' : '○';
        h += `<div class="compare-row"><span>${icon} ${esc(s.name)}</span><span>${esc(s.status)}</span></div>`;
      }
      h += '</div>';
    }
    h += '</div>';
    h += '<div id="mdOverlay"></div>';
    return h;
  }

  private getWhatsNext(): { text: string; command: string; icon: string } | null {
    if (!this.manifest) { return null; }
    const m = this.manifest;
    for (const def of STAGE_DEFINITIONS) {
      const info = m.stages.find(s => s.name === def.name);
      if (info?.status === 'in-progress') {
        return { text: `Resume ${def.name}`, command: def.chatCommand, icon: '⏳' };
      }
    }
    for (const def of STAGE_DEFINITIONS) {
      const info = m.stages.find(s => s.name === def.name);
      if (!info || info.status === 'pending') {
        if (!this.isStageBlocked(def.name, m)) {
          return { text: `Start ${def.name}`, command: def.chatCommand, icon: '▶' };
        }
      }
    }
    return null;
  }

  generateExportHtml(manifest: AidlcManifest, wsRoot: string): string {
    const m = manifest;
    const done = m.stages.filter(s => s.status === 'complete').length;
    const total = m.stages.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    let h = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>AI-DLC Report: ${m.featureName}</title>`;
    h += `<style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:900px;margin:40px auto;padding:0 20px;color:#1a1a2e;line-height:1.6}`;
    h += `h1{color:#2196f3;border-bottom:2px solid #e0e0e0;padding-bottom:10px}h2{color:#333;margin-top:30px}`;
    h += `.progress{height:10px;background:#e0e0e0;border-radius:5px;overflow:hidden;margin:10px 0}.progress-fill{height:100%;background:linear-gradient(90deg,#2196f3,#4caf50);border-radius:5px}`;
    h += `.meta{color:#666;font-size:0.9em}.badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:0.8em;font-weight:600}`;
    h += `.badge-blue{background:#e3f2fd;color:#1976d2}`;
    h += `table{width:100%;border-collapse:collapse;margin:10px 0}th,td{padding:8px 12px;border:1px solid #e0e0e0;text-align:left}th{background:#f5f5f5;font-weight:600}`;
    h += `.footer{margin-top:40px;padding-top:20px;border-top:1px solid #e0e0e0;color:#999;font-size:0.85em;text-align:center}</style></head><body>`;
    h += `<h1>🏗️ AI-DLC Report: ${m.featureName}</h1>`;
    h += `<p class="meta"><span class="badge badge-blue">${m.projectType}</span> Current Stage: ${m.currentStage}</p>`;
    h += `<div class="progress"><div class="progress-fill" style="width:${pct}%"></div></div>`;
    h += `<p class="meta">${done}/${total} stages (${pct}%)</p>`;
    h += `<h2>📊 Stages</h2><table><tr><th>Stage</th><th>Phase</th><th>Status</th></tr>`;
    for (const def of STAGE_DEFINITIONS) {
      const info = m.stages.find(s => s.name === def.name);
      const st = info?.status || 'pending';
      const badge = st === 'complete' ? '✅' : st === 'in-progress' ? '⏳' : '○';
      h += `<tr><td>${badge} ${def.name}</td><td>${def.phase}</td><td>${st}</td></tr>`;
    }
    h += `</table><h2>🛡️ Governance</h2>`;
    h += `<p>PM Tool: ${m.pmTool ? m.pmTool.tool : 'Not configured'}</p>`;
    h += `<p>Build Path: ${m.buildPath ? m.buildPath.selectedPath : 'Not selected'}</p>`;
    h += `<h2>📂 Artifacts</h2>`;
    for (const [stage, map] of Object.entries(STAGE_ARTIFACT_MAP)) {
      if (!map.dir) { continue; }
      const absDir = path.join(wsRoot, 'aidlc-docs', m.featureName, map.dir);
      try {
        if (fs.existsSync(absDir)) {
          const files = fs.readdirSync(absDir).filter(f => f.endsWith('.md'));
          if (files.length > 0) { h += `<h3>${stage}</h3><ul>`; for (const f of files) { h += `<li>${f}</li>`; } h += `</ul>`; }
        }
      } catch {}
    }
    h += `<div class="footer">Generated by AI-DLC — ${new Date().toISOString().split('T')[0]}</div></body></html>`;
    return h;
  }

  private getAggregateStats(): { totalFeatures: number; totalComplete: number; totalStages: number; totalArtifacts: number } {
    let totalComplete = 0, totalStages = 0, totalArtifacts = 0;
    for (const m of this.allManifests) {
      totalComplete += m.stages.filter(s => s.status === 'complete').length;
      totalStages += m.stages.length;
      for (const [, map] of Object.entries(STAGE_ARTIFACT_MAP)) {
        if (map.dir && this.workspaceRoot) {
          const absDir = path.join(this.workspaceRoot, 'aidlc-docs', m.featureName, map.dir);
          try { if (fs.existsSync(absDir)) { totalArtifacts += fs.readdirSync(absDir).filter(f => f.endsWith('.md')).length; } } catch {}
        }
      }
    }
    return { totalFeatures: this.allManifests.length, totalComplete, totalStages, totalArtifacts };
  }

  private getRecentActivity(): { time: string; text: string; fullText: string; feature: string; completed: boolean }[] {
    const items: { time: string; text: string; fullText: string; feature: string; completed: boolean }[] = [];
    for (const m of this.allManifests) {
      const auditPath = path.join(this.workspaceRoot, 'aidlc-docs', m.featureName, 'audit.md');
      if (!fs.existsSync(auditPath)) { continue; }
      try {
        const content = fs.readFileSync(auditPath, 'utf-8');
        const blocks = content.split(/^---$/m);
        for (const block of blocks) {
          const stageMatch = block.match(/^## (.+)$/m);
          const timeMatch = block.match(/\*\*Timestamp\*\*:\s*(.+)/);
          const responseMatch = block.match(/\*\*AI Response\*\*:\s*(.+)/m);
          const inputMatch = block.match(/\*\*User Input\*\*:\s*"?(.+?)"?\s*$/m);
          const contextMatch = block.match(/\*\*Context\*\*:\s*(.+)/m);
          if (stageMatch && timeMatch) {
            const stage = stageMatch[1].trim();
            const response = responseMatch ? responseMatch[1].trim() : '';
            const input = inputMatch ? inputMatch[1].trim() : '';
            const ctx = contextMatch ? contextMatch[1].trim() : '';
            const short = stage + (response ? ' — ' + response.substring(0, 60) : '');
            let full = `Stage: ${stage}`;
            if (input) { full += `\nUser: ${input}`; }
            if (response) { full += `\nAI: ${response}`; }
            if (ctx) { full += `\nContext: ${ctx}`; }
            items.push({ time: timeMatch[1].trim(), text: short, fullText: full, feature: m.featureName, completed: block.includes('complete') || block.includes('approved') });
          }
        }
      } catch {}
    }
    return items.sort((a, b) => b.time.localeCompare(a.time)).slice(0, 10);
  }

  private getLandingHtml(): string {
    const stats = this.getAggregateStats();
    const activity = this.getRecentActivity();
    let h = '<div class="toast-container" id="toasts" role="status" aria-live="polite"></div>';
    h += '<div class="landing-header"><h1>🏗️ <span>AI-DLC</span> Portfolio</h1><p>Your software development lifecycle at a glance</p></div>';
    h += '<div class="landing-stats">';
    h += `<div class="stat-card"><div class="stat-value">${stats.totalFeatures}</div><div class="stat-label">Features</div></div>`;
    h += `<div class="stat-card"><div class="stat-value">${stats.totalComplete}</div><div class="stat-label">Stages Done</div></div>`;
    h += `<div class="stat-card"><div class="stat-value">${stats.totalStages > 0 ? Math.round((stats.totalComplete / stats.totalStages) * 100) : 0}%</div><div class="stat-label">Overall Progress</div></div>`;
    h += `<div class="stat-card"><div class="stat-value">${stats.totalArtifacts}</div><div class="stat-label">Artifacts</div></div>`;
    h += '</div>';
    h += '<div class="section-title">📦 Features</div><div class="features-grid">';
    for (let i = 0; i < this.allManifests.length; i++) {
      const m = this.allManifests[i];
      const done = m.stages.filter(s => s.status === 'complete').length;
      const total = m.stages.length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      const circ = 2 * Math.PI * 18;
      const offset = circ - (pct / 100) * circ;
      h += `<div class="feature-card" onclick="navigateToFeature('${esc(m.featureName).replace(/'/g, "\\'")}')" tabindex="0" role="button" aria-label="${esc(m.featureName)}, ${pct}%" onkeydown="if(event.key==='Enter')navigateToFeature('${esc(m.featureName).replace(/'/g, "\\'")}')" style="animation-delay:${i * 0.1}s">`;
      h += `<div class="fc-ring"><svg viewBox="0 0 44 44"><circle class="ring-bg" cx="22" cy="22" r="18"/><circle class="ring-fill" cx="22" cy="22" r="18" stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/></svg></div>`;
      h += `<div class="fc-name">${esc(m.featureName)}</div><div class="fc-type">${esc(m.projectType)}</div>`;
      h += `<div class="fc-stage">📍 ${esc(m.currentStage)}</div>`;
      h += `<div class="fc-progress"><div class="fc-progress-fill" style="width:${pct}%"></div></div>`;
      h += `<div class="fc-stats"><span>${done}/${total} stages</span><span>${pct}%</span></div>`;
      const health = this.getHealthScore(m);
      h += `<div style="margin-top:8px;font-size:0.75em;display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;border-radius:50%;background:${health.color}"></span>${health.label} (${health.score})</div>`;
      h += '</div>';
    }
    h += '<button class="landing-new-btn" onclick="vscode.postMessage({type:\'newFeature\'})">➕ Start a new feature</button></div>';

    // Archived Features
    const archivedDir = path.join(this.workspaceRoot, 'aidlc-docs', '.archived');
    let archivedFeatures: string[] = [];
    try {
      if (fs.existsSync(archivedDir)) {
        archivedFeatures = fs.readdirSync(archivedDir, { withFileTypes: true })
          .filter(e => e.isDirectory())
          .map(e => e.name);
      }
    } catch {}
    if (archivedFeatures.length > 0) {
      h += '<div class="audit-section"><div class="audit-toggle section-title" onclick="toggleAudit(this)" tabindex="0" role="button" aria-expanded="false" onkeydown="if(event.key===\'Enter\')toggleAudit(this)">';
      h += `<span class="chevron" aria-hidden="true">▶</span> 🗄️ Archived Features (${archivedFeatures.length})</div>`;
      h += '<div class="audit-entries collapsed">';
      for (const name of archivedFeatures) {
        h += `<div class="audit-entry" style="display:flex;align-items:center;justify-content:space-between">`;
        h += `<span>${esc(name)}</span>`;
        h += `<button class="run-btn" onclick="unarchiveFeature('${esc(name).replace(/'/g, "\\'")}')">Unarchive</button>`;
        h += '</div>';
      }
      h += '</div></div>';
    }

    // Task Tracker (aggregated across all features)
    const allTasks: { text: string; status: 'done' | 'wip' | 'todo'; source: string }[] = [];
    for (const m of this.allManifests) {
      const ft = this.parseTasks(m.featureName);
      for (const t of ft) { allTasks.push({ ...t, source: `${m.featureName}/${t.source}` }); }
    }
    if (allTasks.length > 0) {
      h += '<div class="section-title">🔨 Development Tasks</div>';
      h += this.renderTaskBoard(allTasks, true);
    }

    if (activity.length > 0) {
      h += '<div class="timeline-section"><div class="section-title">⏱️ Recent Activity</div><div class="timeline">';
      for (const item of activity) {
        const hasMore = item.fullText.length > item.text.length;
        h += `<div class="timeline-item${item.completed ? ' completed' : ''}">`;
        h += `<div class="tl-time">${esc(item.time)}</div>`;
        h += `<div class="tl-text"><span class="truncated">${esc(item.text)}</span></div>`;
        h += `<div class="tl-feature">${esc(item.feature)}</div>`;
        if (hasMore) {
          h += `<div class="tl-full">${esc(item.fullText)}</div>`;
          h += `<button class="expand-btn" onclick="toggleEntry(this)">▸ Show more</button>`;
        }
        h += '</div>';
      }
      h += '</div></div>';
    }
    h += '<div id="mdOverlay"></div>';
    return h;
  }

  private getArtifactFiles(relDir: string): string[] {
    if (!this.workspaceRoot || !this.manifest || !relDir) { return []; }
    const absDir = path.join(this.workspaceRoot, 'aidlc-docs', this.manifest.featureName, relDir);
    if (!fs.existsSync(absDir)) { return []; }
    try { return fs.readdirSync(absDir).filter(f => f.endsWith('.md')).sort().map(f => `${relDir}/${f}`); } catch { return []; }
  }

  private getAllArtifactFiles(): { file: string; stage: string }[] {
    const results: { file: string; stage: string }[] = [];
    for (const [stage, map] of Object.entries(STAGE_ARTIFACT_MAP)) {
      if (map.dir) { for (const f of this.getArtifactFiles(map.dir)) { results.push({ file: f, stage }); } }
    }
    return results;
  }

  private parseAuditLog(): AuditEntry[] {
    if (!this.workspaceRoot || !this.manifest) { return []; }
    const auditPath = path.join(this.workspaceRoot, 'aidlc-docs', this.manifest.featureName, 'audit.md');
    if (!fs.existsSync(auditPath)) { return []; }
    try {
      const content = fs.readFileSync(auditPath, 'utf-8');
      const entries: AuditEntry[] = [];
      const blocks = content.split(/^---$/m);
      for (const block of blocks) {
        const stageMatch = block.match(/^## (.+)$/m);
        const timeMatch = block.match(/\*\*Timestamp\*\*:\s*(.+)/);
        const inputMatch = block.match(/\*\*User Input\*\*:\s*"?(.+?)"?\s*$/m);
        const responseMatch = block.match(/\*\*AI Response\*\*:\s*(.+)/m);
        const contextMatch = block.match(/\*\*Context\*\*:\s*(.+)/m);
        if (stageMatch && timeMatch) {
          entries.push({
            stage: stageMatch[1].trim(),
            timestamp: timeMatch[1].trim(),
            userInput: inputMatch ? inputMatch[1].trim() : '',
            aiResponse: responseMatch ? responseMatch[1].trim() : '',
            context: contextMatch ? contextMatch[1].trim() : '',
          });
        }
      }
      return entries.slice(-15).reverse();
    } catch { return []; }
  }

  private isStageBlocked(stageName: string, manifest: AidlcManifest): boolean {
    const idx = STAGE_ORDER.indexOf(stageName);
    if (idx <= 0) { return false; }
    const prevName = STAGE_ORDER[idx - 1];
    const prev = manifest.stages.find(s => s.name === prevName);
    if (!prev) { return true; }
    return prev.status !== 'complete' && prev.status !== ('skipped' as string);
  }

  private parseTasks(featureName: string): { text: string; status: 'done' | 'wip' | 'todo'; source: string }[] {
    const tasks: { text: string; status: 'done' | 'wip' | 'todo'; source: string }[] = [];
    if (!this.workspaceRoot) { return tasks; }
    const planDir = path.join(this.workspaceRoot, 'aidlc-docs', featureName, 'construction', 'plans');
    if (fs.existsSync(planDir)) {
      try {
        for (const file of fs.readdirSync(planDir).filter(f => f.endsWith('.md'))) {
          const content = fs.readFileSync(path.join(planDir, file), 'utf-8');
          for (const line of content.split('\n')) {
            const match = line.match(/^- \[([ x~])\] (.+)/);
            if (match) {
              tasks.push({ text: match[2].trim(), status: match[1] === 'x' ? 'done' : match[1] === '~' ? 'wip' : 'todo', source: file });
            }
          }
        }
      } catch {}
    }
    const specTasks = path.join(this.workspaceRoot, '.kiro', 'specs', 'project-specs', featureName, 'tasks.md');
    if (fs.existsSync(specTasks)) {
      try {
        for (const line of fs.readFileSync(specTasks, 'utf-8').split('\n')) {
          const match = line.match(/^- \[([ x~])\] (.+)/);
          if (match && !tasks.some(t => t.text === match[2].trim())) {
            tasks.push({ text: match[2].trim(), status: match[1] === 'x' ? 'done' : match[1] === '~' ? 'wip' : 'todo', source: 'tasks.md' });
          }
        }
      } catch {}
    }
    return tasks;
  }

  private renderTaskBoard(tasks: { text: string; status: 'done' | 'wip' | 'todo'; source: string }[], compact = false): string {
    if (tasks.length === 0) { return ''; }
    const done = tasks.filter(t => t.status === 'done').length;
    const wip = tasks.filter(t => t.status === 'wip').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const pct = Math.round((done / tasks.length) * 100);
    let h = '<div class="task-board">';
    h += '<div class="task-summary">';
    h += `<span class="task-stat"><span class="dot dot-done"></span> ${done} done</span>`;
    h += `<span class="task-stat"><span class="dot dot-wip"></span> ${wip} in progress</span>`;
    h += `<span class="task-stat"><span class="dot dot-todo"></span> ${todo} to do</span>`;
    h += `<span class="task-stat" style="margin-left:auto;font-weight:600">${pct}%</span>`;
    h += '</div>';
    const displayTasks = compact ? tasks.filter(t => t.status !== 'done').slice(0, 8) : tasks;
    h += '<div class="task-list">';
    for (const t of displayTasks) {
      const cls = t.status === 'done' ? 'done' : t.status === 'wip' ? 'wip' : '';
      const icon = t.status === 'done' ? '✓' : t.status === 'wip' ? '◉' : '';
      h += `<div class="task-item ${cls}"><span class="task-check">${icon}</span><span class="task-text">${esc(t.text)}</span><span class="task-source">${esc(t.source)}</span></div>`;
    }
    if (compact && tasks.filter(t => t.status !== 'done').length > 8) {
      h += `<div style="font-size:0.78em;opacity:0.4;padding:4px 10px">+ ${tasks.filter(t => t.status !== 'done').length - 8} more</div>`;
    }
    h += '</div></div>';
    return h;
  }


  protected getBodyHtml(): string {
    // Route: compare view
    if (this.currentView === 'compare' && this.comparisonFeatures.length === 2) {
      return this.getComparisonHtml();
    }
    // Route: landing page or feature detail
    if (this.currentView === 'landing' || !this.manifest) {
      if (this.allManifests.length === 0) {
        return `<div class="empty"><div style="font-size:3em;margin-bottom:16px">🏗️</div><h2>Welcome to AI-DLC</h2><p>Start a new feature to begin the software development lifecycle</p><button class="action-btn" onclick="vscode.postMessage({type:'newFeature'})">➕ New Feature</button></div><div class="toast-container" id="toasts"></div>`;
      }
      return this.getLandingHtml();
    }
    const m = this.manifest;
    const completed = m.stages.filter(s => s.status === 'complete').length;
    const total = m.stages.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const allFiles = this.getAllArtifactFiles();
    const artifactJson = JSON.stringify(allFiles).replace(/'/g, "\\'").replace(/</g, '\\x3c');

    let h = '';
    h += '<div class="toast-container" id="toasts" role="status" aria-live="polite"></div>';
    h += '<div class="search-bar" role="search"><span class="search-icon" aria-hidden="true">🔍</span>';
    h += '<input id="searchInput" type="text" placeholder="Search artifacts..." aria-label="Search artifacts" />';
    h += '<span class="search-shortcut" aria-hidden="true">⌘⇧F</span></div>';
    h += '<div id="searchResults" class="search-results" role="listbox"></div>';

    h += `<div class="breadcrumb" role="navigation" aria-label="Breadcrumb"><a onclick="vscode.postMessage({type:'navigateToLanding'})">🏠 All Features</a><span class="sep">›</span><span>${esc(m.featureName)}</span></div>`;

    // What's Next prompt
    const next = this.getWhatsNext();
    if (next) {
      h += `<div style="background:linear-gradient(135deg,rgba(33,150,243,0.08),rgba(76,175,80,0.06));border:1px solid rgba(33,150,243,0.2);border-radius:10px;padding:14px 18px;margin-bottom:16px;display:flex;align-items:center;gap:12px;animation:fadeIn 0.4s ease">`;
      h += `<span style="font-size:1.4em">${next.icon}</span>`;
      h += `<div style="flex:1"><div style="font-size:0.82em;opacity:0.5">Your next action</div><div style="font-weight:600;font-size:0.95em">${esc(next.text)}</div></div>`;
      h += `<button class="continue-btn" onclick="vscode.postMessage({type:'runStage',command:'${next.command.replace(/'/g, "\\'")}'})">Go →</button>`;
      h += `</div>`;
    }

    h += `<div class="hero"><h1>${esc(m.featureName)} <span class="type-badge">${esc(m.projectType)}</span></h1>`;
    if (this.allManifests.length > 1) {
      h += '<select class="feature-select" aria-label="Switch feature" onchange="vscode.postMessage({type:\'switchFeature\',name:this.value})">';
      for (let i = 0; i < this.allManifests.length; i++) {
        const fm = this.allManifests[i];
        h += `<option value="${esc(fm.featureName)}"${i === this.activeIndex ? ' selected' : ''}>${esc(fm.featureName)} — ${esc(fm.currentStage)}</option>`;
      }
      h += '</select>';
    }
    h += `<p class="meta">Current Stage: ${esc(m.currentStage)}</p>`;
    h += `<div class="progress-container"><div class="progress-track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill" style="width:${pct}%"></div></div>`;
    h += `<div class="progress-row"><span class="progress-label">${completed} of ${total} stages complete</span><span class="progress-pct">${pct}%</span></div></div>`;
    h += `<button class="new-feature-btn" onclick="vscode.postMessage({type:'newFeature'})" style="margin-top:8px">➕ New Feature</button>`;
    h += `<button class="action-btn-outline" onclick="vscode.postMessage({type:'exportReport'})" style="margin-top:8px;margin-left:8px">📤 Export Report</button></div>`;

    h += '<div class="workflow" role="tree" aria-label="Workflow phases">';
    const phases: PhaseName[] = ['inception', 'construction', 'operations'];
    const phaseDesc: Record<string, string> = { inception: 'Planning, requirements, and architecture', construction: 'Design, code generation, build & test', operations: 'Deployment, monitoring, maintenance' };
    const nums: Record<string, number> = { inception: 1, construction: 2, operations: 3 };

    for (const p of phases) {
      const display = PHASE_DISPLAY[p];
      const stages = STAGE_DEFINITIONS.filter(d => d.phase === p);
      const done = stages.filter(d => m.stages.find(s => s.name === d.name && s.status === 'complete')).length;
      const active = stages.some(d => m.stages.find(s => s.name === d.name && s.status === 'in-progress'));
      const pp = stages.length > 0 ? Math.round((done / stages.length) * 100) : 0;
      const cls = pp === 100 ? 'completed' : active || done > 0 ? 'in-progress' : 'pending';
      const pctCls = pp === 100 ? 'done' : pp > 0 ? 'active' : 'waiting';
      const isOpen = cls === 'in-progress' || (cls === 'completed' && pp < 100);

      h += `<div class="phase-section" role="treeitem" aria-expanded="${isOpen}">`;
      h += `<div class="phase-banner ${cls}" onclick="togglePhase(this)" tabindex="0" role="button" aria-label="${display.label}, ${pp}% complete" onkeydown="if(event.key==='Enter')togglePhase(this)">`;
      h += `<span class="phase-number">${nums[p]}</span>`;
      h += `<div class="phase-info"><div class="phase-name">${display.label}</div><div class="phase-summary">${phaseDesc[p]} — ${done}/${stages.length}</div></div>`;
      h += `<span class="phase-pct ${pctCls}">${pp}%</span>`;
      h += `<span class="phase-chevron ${isOpen ? 'open' : ''}" aria-hidden="true">▶</span></div>`;

      h += `<div class="phase-stages${isOpen ? '' : ' collapsed'}" role="group">`;
      for (const def of stages) {
        const info = m.stages.find(s => s.name === def.name);
        const st = info?.status || 'pending';
        const blocked = st === 'pending' && this.isStageBlocked(def.name, m);
        const icon = st === 'complete' ? '✓' : st === 'in-progress' ? '◉' : blocked ? '🔒' : '○';
        const sc = st === 'complete' ? 'completed' : st === 'in-progress' ? 'in-progress' : blocked ? 'blocked' : 'pending';
        const artMap = STAGE_ARTIFACT_MAP[def.name];
        const stPct = st === 'complete' ? 100 : st === 'in-progress' ? 50 : 0;
        const pColor = st === 'complete' ? 'var(--green)' : st === 'in-progress' ? 'var(--yellow)' : 'var(--dim)';

        h += `<div class="stage-card ${sc}" role="treeitem" aria-label="${def.name}, ${st}">`;
        h += `<div class="stage-header"><span class="stage-icon" aria-hidden="true">${icon}</span><span class="stage-name">${esc(def.name)}</span>`;
        if (blocked) { h += '<span class="stage-badge blocked-badge">Blocked</span>'; }
        h += '</div>';
        if (artMap) { h += `<div class="stage-desc">${esc(artMap.description)}</div>`; }
        h += `<div class="stage-progress"><div class="stage-progress-fill" style="width:${stPct}%;background:${pColor}"></div></div>`;

        if (artMap && artMap.dir) {
          const files = this.getArtifactFiles(artMap.dir);
          if (files.length > 0) {
            h += '<div class="stage-artifacts">';
            for (const f of files) {
              const fname = f.split('/').pop() || f;
              const escaped = esc(f).replace(/'/g, "\\'");
              h += `<span class="artifact-chip" onclick="openFile('${escaped}')" tabindex="0" role="button" aria-label="View ${fname}" onkeydown="if(event.key==='Enter')openFile('${escaped}')">`;
              h += `<span aria-hidden="true">📄</span>${esc(fname)}`;
              h += `<span class="chip-edit" onclick="event.stopPropagation();openFile('${escaped}','edit')" aria-label="Edit ${fname}">✏️</span></span>`;
            }
            h += '</div>';
          }
        }

        h += '<div class="stage-actions">';
        if (st === 'complete' && artMap && artMap.continueCmd) {
          h += `<button class="continue-btn" onclick="vscode.postMessage({type:'runStage',command:'${artMap.continueCmd.replace(/'/g, "\\'")}'})">▶ Continue to Next</button>`;
        } else if (st === 'in-progress') {
          h += `<button class="continue-btn" onclick="vscode.postMessage({type:'runStage',command:'${def.chatCommand.replace(/'/g, "\\'")}'})">⏳ Resume</button>`;
        } else if (st === 'pending' && !blocked) {
          h += `<button class="run-btn" onclick="vscode.postMessage({type:'runStage',command:'${def.chatCommand.replace(/'/g, "\\'")}'})">▶ Start</button>`;
          h += `<button class="skip-btn" onclick="vscode.postMessage({type:'skipStage',name:'${esc(def.name).replace(/'/g, "\\'")}'})">⏭ Skip</button>`;
        } else if (blocked) {
          h += '<span style="font-size:0.78em;opacity:0.4">Waiting for previous stage</span>';
        }
        h += '</div></div>';
      }
      h += '</div></div>';
    }
    h += '</div>';

    h += '<div class="section-title">🛡️ Governance & Controls</div><div class="governance-grid">';
    h += '<div class="gov-card"><h3>📋 PM Tool</h3>';
    if (m.pmTool) { h += `<div class="gov-value">${esc(m.pmTool.tool)}<br>Sync: ${m.pmTool.syncEnabled ? '✅ Active' : '⏸ Paused'}</div><div class="gov-action"><button class="action-btn-outline" onclick="vscode.postMessage({type:'pmPull'})">⬇ Pull</button></div>`; }
    else { h += '<div class="gov-value">Not configured</div>'; }
    h += '</div><div class="gov-card"><h3>🧪 Build Path</h3>';
    if (m.buildPath) { h += `<div class="gov-value">${esc(m.buildPath.selectedPath)}<br>Entry: ${esc(m.buildPath.entryPoint)}<br>Prototype: ${esc(m.buildPath.prototypeStatus)}</div>`; }
    else { h += '<div class="gov-value">Not selected</div>'; }
    h += '</div>';
    h += `<div class="gov-card"><h3>🔍 Design Review</h3><div class="gov-value">Drift detection</div><div class="gov-action"><button class="action-btn" onclick="vscode.postMessage({type:'designReview'})">Run Review</button></div></div>`;
    h += `<div class="gov-card"><h3>🛡️ Security Review</h3><div class="gov-value">Vulnerability assessment</div><div class="gov-action"><button class="action-btn" onclick="vscode.postMessage({type:'securityReview'})">Run Review</button></div></div>`;
    h += `<div class="gov-card"><h3>🤖 AI Compliance</h3><div class="gov-value">Responsible AI review</div><div class="gov-action"><button class="action-btn" onclick="vscode.postMessage({type:'aiCompliance'})">Run Review</button></div></div>`;
    h += `<div class="gov-card"><h3>📄 ARB Artifact</h3><div class="gov-value">Architecture Review Board</div><div class="gov-action"><button class="action-btn-outline" onclick="vscode.postMessage({type:'runStage',command:'Generate ARB artifact'})">Generate</button></div></div>`;
    h += `<div class="gov-card"><h3>🎫 Permit to Operate</h3><div class="gov-value">Production deployment gate</div><div class="gov-action"><button class="action-btn-outline" onclick="vscode.postMessage({type:'runStage',command:'Generate Permit to Operate'})">Generate</button></div></div>`;
    if (m.buildPath && m.buildPath.prototypeStatus === 'Complete') {
      h += `<div class="gov-card"><h3>🚀 Prototype → Enterprise</h3><div class="gov-value">Transition to full build</div><div class="gov-action"><button class="action-btn" onclick="vscode.postMessage({type:'prototypeTransition'})">Transition</button></div></div>`;
    }
    h += '</div>';

    // Development Tasks
    const featureTasks = this.parseTasks(m.featureName);
    if (featureTasks.length > 0) {
      h += '<div class="section-title">🔨 Development Tasks</div>';
      h += this.renderTaskBoard(featureTasks);
    }

    // Design Catalogue
    const catalogueCategories = [
      { icon: '🏗️', title: 'Application Design', desc: 'Component architecture and interactions', dir: 'inception/application-design' },
      { icon: '📐', title: 'Functional Design', desc: 'Data models and business logic', dir: 'construction/plans' },
      { icon: '⚡', title: 'NFR Design', desc: 'Performance, security, scalability patterns', dir: 'construction/plans' },
      { icon: '☁️', title: 'Infrastructure Design', desc: 'Cloud services and deployment architecture', dir: 'construction/plans' },
      { icon: '📝', title: 'ADRs', desc: 'Architecture Decision Records', dir: 'construction/adrs' },
      { icon: '📋', title: 'Requirements', desc: 'Functional and non-functional requirements', dir: 'inception/requirements' },
      { icon: '👤', title: 'User Stories', desc: 'User stories with acceptance criteria', dir: 'inception/user-stories' },
      { icon: '🎯', title: 'Intent & Planning', desc: 'Intent alignment and execution plans', dir: 'inception/intent' },
    ];
    h += '<div class="section-title">📚 Design Catalogue</div><div class="catalogue-grid">';
    for (const cat of catalogueCategories) {
      const files = this.getArtifactFiles(cat.dir);
      h += '<div class="catalogue-card">';
      h += `<div class="cat-header"><span class="cat-icon">${cat.icon}</span><span class="cat-title">${esc(cat.title)}</span><span class="cat-count">${files.length}</span></div>`;
      h += `<div class="cat-desc">${esc(cat.desc)}</div>`;
      if (files.length > 0) {
        h += '<div class="cat-files">';
        for (const f of files) {
          const fname = f.split('/').pop() || f;
          const escaped = esc(f).replace(/'/g, "\\'");
          h += `<div class="cat-file" onclick="openFile('${escaped}')" tabindex="0" role="button" onkeydown="if(event.key==='Enter')openFile('${escaped}')"><span>📄</span>${esc(fname)}</div>`;
        }
        h += '</div>';
      } else {
        h += '<div class="cat-empty">No artifacts yet</div>';
      }
      h += '</div>';
    }
    h += '</div>';

    // PM Tool Configuration
    h += '<div class="section-title">🔧 PM Tool Integration</div>';
    if (m.pmTool && m.pmTool.tool && !m.pmTool.tool.startsWith('[')) {
      h += `<div class="pm-status">✅ Connected to <strong style="margin:0 4px">${esc(m.pmTool.tool)}</strong> — Sync ${m.pmTool.syncEnabled ? 'Active' : 'Paused'}</div>`;
    } else {
      h += '<div class="pm-wizard" id="pmWizard">';
      h += '<div class="pm-wizard-step"><div class="step-label"><span class="step-number">1</span> Choose your PM tool</div>';
      h += '<div style="font-size:0.8em;opacity:0.45;margin-bottom:10px">Select a tool and click Enable — Kiro will prompt you to authenticate on first use.</div>';
      h += '<div class="pm-tool-options">';
      h += '<div class="pm-tool-option" onclick="selectPmTool(this,\'jira\')" data-tool="jira"><span class="tool-icon">🔵</span>Jira</div>';
      h += '<div class="pm-tool-option" onclick="selectPmTool(this,\'ado\')" data-tool="ado"><span class="tool-icon">🟦</span>Azure DevOps</div>';
      h += '<div class="pm-tool-option" onclick="selectPmTool(this,\'github\')" data-tool="github"><span class="tool-icon">⚫</span>GitHub Issues</div>';
      h += '<div class="pm-tool-option" onclick="selectPmTool(this,\'linear\')" data-tool="linear"><span class="tool-icon">🟣</span>Linear</div>';
      h += '<div class="pm-tool-option" onclick="selectPmTool(this,\'none\')" data-tool="none"><span class="tool-icon">📁</span>None</div>';
      h += '</div></div>';
      h += '<div class="pm-wizard-actions" id="pmActions" style="display:none">';
      h += '<button class="action-btn" onclick="configurePmTool()">Enable MCP Server</button>';
      h += '<button class="action-btn-outline" onclick="skipPmTool()">Skip for now</button>';
      h += '</div></div>';
    }

    const auditEntries = this.parseAuditLog();
    if (auditEntries.length > 0) {
      h += '<div class="audit-section"><div class="audit-toggle section-title" onclick="toggleAudit(this)" tabindex="0" role="button" aria-expanded="false" onkeydown="if(event.key===\'Enter\')toggleAudit(this)">';
      h += '<span class="chevron" aria-hidden="true">▶</span> 📋 Recent Activity (' + auditEntries.length + ')</div>';
      h += '<div class="audit-entries collapsed" role="log" aria-label="Audit log">';
      for (const entry of auditEntries) {
        const hasMore = entry.userInput.length > 120 || entry.aiResponse.length > 0 || entry.context.length > 0;
        h += '<div class="audit-entry">';
        h += `<div class="audit-time">${esc(entry.timestamp)}</div>`;
        h += `<div class="audit-stage">${esc(entry.stage)}</div>`;
        if (entry.userInput) {
          const truncated = entry.userInput.length > 120 ? entry.userInput.substring(0, 120) + '...' : entry.userInput;
          h += `<div class="audit-input"><span class="truncated">${esc(truncated)}</span></div>`;
        }
        if (hasMore) {
          h += `<div class="audit-full">`;
          if (entry.userInput) { h += `<div><strong>User:</strong> ${esc(entry.userInput)}</div>`; }
          if (entry.aiResponse) { h += `<div style="margin-top:4px"><strong>AI:</strong> ${esc(entry.aiResponse)}</div>`; }
          if (entry.context) { h += `<div style="margin-top:4px"><strong>Context:</strong> ${esc(entry.context)}</div>`; }
          h += `</div>`;
          h += `<button class="expand-btn" onclick="toggleEntry(this)">▸ Show more</button>`;
        }
        h += '</div>';
      }
      h += '</div></div>';
    }

    h += '<div id="mdOverlay"></div>';
    h += `<script>var artifactIndex=${artifactJson};<\/script>`;
    return h;
  }


  protected onMessage(msg: unknown): void {
    const m = msg as { type: string; command?: string; name?: string; filePath?: string; content?: string; mode?: string };
    switch (m.type) {
      case 'runStage': if (m.command) { this.chat.send(m.command); } break;
      case 'designReview': this.chat.send('Run a design review'); break;
      case 'securityReview': this.chat.send('Run a security review'); break;
      case 'aiCompliance': this.chat.send('Run an AI compliance review'); break;
      case 'prototypeTransition': this.chat.send('Transition prototype to enterprise build'); break;
      case 'pmPull': this.chat.send('Pull PM tool changes'); break;
      case 'switchFeature': if (m.name) { vscode.commands.executeCommand('aidlc.switchFeatureByName', m.name); } break;
      case 'newFeature': vscode.commands.executeCommand('aidlc.newFeature'); break;
      case 'navigateToFeature': {
        if (m.name) {
          const idx = this.allManifests.findIndex(man => man.featureName === m.name);
          if (idx >= 0) {
            this.activeIndex = idx;
            this.manifest = this.allManifests[idx];
            this.currentView = 'feature';
            this.update();
            vscode.commands.executeCommand('aidlc.switchFeatureByName', m.name);
          }
        }
        break;
      }
      case 'navigateToLanding': {
        this.currentView = 'landing';
        this.update();
        break;
      }
      case 'navigateToCompare': {
        const cm = msg as { type: string; feature1?: string; feature2?: string };
        if (cm.feature1 && cm.feature2) {
          this.comparisonFeatures = [cm.feature1, cm.feature2];
          this.currentView = 'compare';
          this.update();
        }
        break;
      }
      case 'unarchiveFeature': {
        if (m.name && this.workspaceRoot) {
          const src = path.join(this.workspaceRoot, 'aidlc-docs', '.archived', m.name);
          const dest = path.join(this.workspaceRoot, 'aidlc-docs', m.name);
          try {
            if (fs.existsSync(src)) {
              fs.renameSync(src, dest);
              this.chat.send('Using AI-DLC, refresh features after unarchiving ' + m.name);
            }
          } catch {}
        }
        break;
      }
      case 'skipStage': if (m.name) { vscode.commands.executeCommand('aidlc.skipStage'); } break;
      case 'exportReport': vscode.commands.executeCommand('aidlc.exportReport'); break;
      case 'readFile': {
        if (m.filePath && this.manifest && this.workspaceRoot) {
          const fullPath = path.join(this.workspaceRoot, 'aidlc-docs', this.manifest.featureName, m.filePath);
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            this.panel?.webview.postMessage({ type: 'fileContent', filePath: m.filePath, content, mode: m.mode || 'view' });
          } catch { this.panel?.webview.postMessage({ type: 'fileError', filePath: m.filePath, error: 'Could not read file' }); }
        }
        break;
      }
      case 'saveFile': {
        if (m.filePath && m.content !== undefined && this.manifest && this.workspaceRoot) {
          const fullPath = path.join(this.workspaceRoot, 'aidlc-docs', this.manifest.featureName, m.filePath);
          try {
            fs.writeFileSync(fullPath, m.content, 'utf-8');
            this.panel?.webview.postMessage({ type: 'fileSaved', filePath: m.filePath });
          } catch { this.panel?.webview.postMessage({ type: 'fileError', filePath: m.filePath, error: 'Could not save file' }); }
        }
        break;
      }
      case 'openInEditor': {
        if (m.filePath && this.manifest && this.workspaceRoot) {
          const fullPath = path.join(this.workspaceRoot, 'aidlc-docs', this.manifest.featureName, m.filePath);
          if (fs.existsSync(fullPath)) { vscode.window.showTextDocument(vscode.Uri.file(fullPath), { viewColumn: vscode.ViewColumn.Beside }); }
        }
        break;
      }
      case 'configurePm': {
        const pm = m as unknown as { tool: string; toolName?: string; command?: string; args?: string[] };
        if (pm.tool === 'none') {
          this.chat.send('Using AI-DLC, skip PM tool configuration — track in AI-DLC artifacts only');
        } else if (pm.command && pm.toolName) {
          const mcpDir = path.join(this.workspaceRoot, '.kiro', 'settings');
          const mcpPath = path.join(mcpDir, 'mcp.json');
          let mcpConfig: Record<string, unknown> = { mcpServers: {} };
          try { if (fs.existsSync(mcpPath)) { mcpConfig = JSON.parse(fs.readFileSync(mcpPath, 'utf-8')); } } catch { /* default */ }
          if (!mcpConfig.mcpServers) { mcpConfig.mcpServers = {}; }
          const serverName = pm.tool + '-pm';
          (mcpConfig.mcpServers as Record<string, unknown>)[serverName] = {
            command: pm.command, args: pm.args || [],
            env: { FASTMCP_LOG_LEVEL: 'ERROR' }, disabled: false, autoApprove: [],
          };
          if (!fs.existsSync(mcpDir)) { fs.mkdirSync(mcpDir, { recursive: true }); }
          fs.writeFileSync(mcpPath, JSON.stringify(mcpConfig, null, 2), 'utf-8');
          this.panel?.webview.postMessage({ type: 'notification', text: pm.toolName + ' MCP server enabled', level: 'success' });
          this.chat.send(`Using AI-DLC, PM tool configured: ${pm.toolName}. Update aidlc-state.md with PM Tool: ${pm.toolName}, Sync Enabled: Yes`);
        }
        break;
      }
    }
  }

  protected getScriptJs(): string {
    return `
    let currentFilePath=null,currentMode='view',originalContent='',isDirty=false;

    function showToast(msg,type){
      const c=document.getElementById('toasts');
      const t=document.createElement('div');
      t.className='toast toast-'+(type||'info');
      t.textContent=msg;
      c.appendChild(t);
      setTimeout(function(){t.classList.add('removing');setTimeout(function(){t.remove()},300)},3000);
    }

    function togglePhase(el){
      el.querySelector('.phase-chevron').classList.toggle('open');
      el.nextElementSibling.classList.toggle('collapsed');
      const section=el.parentElement;
      section.setAttribute('aria-expanded',section.getAttribute('aria-expanded')==='true'?'false':'true');
    }

    function toggleAudit(el){
      el.querySelector('.chevron').classList.toggle('open');
      el.nextElementSibling.classList.toggle('collapsed');
      el.setAttribute('aria-expanded',el.getAttribute('aria-expanded')==='true'?'false':'true');
    }

    function toggleEntry(btn){
      var entry=btn.parentElement;
      entry.classList.toggle('expanded');
      btn.textContent=entry.classList.contains('expanded')?'▾ Show less':'▸ Show more';
    }

    function openFile(fp,mode){currentFilePath=fp;currentMode=mode||'view';vscode.postMessage({type:'readFile',filePath:fp,mode:currentMode});}
    function openInEditor(fp){vscode.postMessage({type:'openInEditor',filePath:fp});}
    function navigateToFeature(name){vscode.postMessage({type:'navigateToFeature',name:name});}

    var searchInput=null;
    setTimeout(function(){
      searchInput=document.getElementById('searchInput');
      if(searchInput){
        searchInput.addEventListener('input',doSearch);
        searchInput.addEventListener('keydown',function(e){if(e.key==='Escape'){searchInput.value='';doSearch();searchInput.blur();}});
      }
    },100);

    function doSearch(){
      var q=(searchInput?searchInput.value:'').toLowerCase().trim();
      var container=document.getElementById('searchResults');
      if(!q){container.innerHTML='';return;}
      var results=(typeof artifactIndex!=='undefined'?artifactIndex:[]).filter(function(a){
        return a.file.toLowerCase().indexOf(q)>=0||a.stage.toLowerCase().indexOf(q)>=0;
      }).slice(0,8);
      if(results.length===0){container.innerHTML='<div class="search-no-results">No artifacts found</div>';return;}
      var html='';
      for(var i=0;i<results.length;i++){
        var r=results[i],fname=r.file.split('/').pop();
        html+='<div class="search-result" onclick="openFile(\\''+r.file.replace(/'/g,"\\\\'")+'\\')" tabindex="0" role="option">';
        html+='<span>📄</span><span>'+fname+'</span><span class="result-stage">'+r.stage+'</span></div>';
      }
      container.innerHTML=html;
    }

    function renderMarkdown(md){
      var h=md;
      h=h.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      h=h.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g,'<pre><code>$1</code></pre>');
      h=h.replace(/\`([^\`]+)\`/g,'<code>$1</code>');
      h=h.replace(/^### (.+)$/gm,'<h3>$1</h3>');h=h.replace(/^## (.+)$/gm,'<h2>$1</h2>');h=h.replace(/^# (.+)$/gm,'<h1>$1</h1>');
      h=h.replace(/\\*\\*(.+?)\\*\\*/g,'<strong>$1</strong>');h=h.replace(/\\*(.+?)\\*/g,'<em>$1</em>');
      h=h.replace(/^&gt; (.+)$/gm,'<blockquote>$1</blockquote>');
      h=h.replace(/^- \\[x\\] (.+)$/gm,'<li><input type="checkbox" checked disabled> $1</li>');
      h=h.replace(/^- \\[ \\] (.+)$/gm,'<li><input type="checkbox" disabled> $1</li>');
      h=h.replace(/^- (.+)$/gm,'<li>$1</li>');h=h.replace(/^---$/gm,'<hr>');
      h=h.replace(/\\n\\n/g,'</p><p>');h=h.replace(/\\n/g,'<br>');
      return '<div class="md-rendered"><p>'+h+'</p></div>';
    }

    function escapeHtml(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML;}

    function showOverlay(fp,content,mode){
      originalContent=content;isDirty=false;
      var fn=fp.split('/').pop(),o=document.getElementById('mdOverlay');
      var h='<div class="md-overlay" onclick="if(event.target===this)closeOverlay()" role="dialog" aria-label="File viewer">';
      h+='<div class="md-panel"><div class="md-panel-header">';
      h+='<div class="md-panel-title">'+fn+'<span class="md-panel-path">'+fp+'</span></div>';
      h+='<div class="md-tab-bar"><button class="md-tab'+(mode==='view'?' active':'')+'" onclick="switchTab(\\'view\\')" aria-label="View">👁 View</button>';
      h+='<button class="md-tab'+(mode==='edit'?' active':'')+'" onclick="switchTab(\\'edit\\')" aria-label="Edit">✏️ Edit</button></div>';
      h+='<button class="md-close-btn" onclick="closeOverlay()" aria-label="Close">✕</button></div>';
      h+='<div id="mdBody" class="md-panel-body'+(mode==='edit'?' editing':'')+'">';
      h+=(mode==='edit'?'<textarea id="mdEditor" class="md-editor" aria-label="Editor">'+escapeHtml(content)+'</textarea>':renderMarkdown(content));
      h+='</div><div class="md-panel-footer"><span class="md-status" id="mdStatus">'+content.length+' chars</span>';
      h+='<div style="display:flex;align-items:center;gap:10px"><span class="md-saved-indicator" id="mdSaved">✓ Saved</span>';
      h+='<button class="md-save-btn" onclick="saveFile()"'+(mode!=='edit'?' disabled':'')+'>💾 Save</button></div></div></div></div>';
      o.innerHTML=h;
      if(mode==='edit'){
        var ed=document.getElementById('mdEditor');
        ed.addEventListener('input',function(){isDirty=ed.value!==originalContent;document.getElementById('mdStatus').textContent=ed.value.length+' chars'+(isDirty?' • Modified':'');});
        ed.addEventListener('keydown',function(e){if((e.metaKey||e.ctrlKey)&&e.key==='s'){e.preventDefault();saveFile();}});
        ed.focus();
      }
    }

    function switchTab(mode){var ed=document.getElementById('mdEditor');currentMode=mode;showOverlay(currentFilePath,ed?ed.value:originalContent,mode);}
    function closeOverlay(){if(isDirty&&!confirm('Unsaved changes. Close?'))return;document.getElementById('mdOverlay').innerHTML='';currentFilePath=null;isDirty=false;}
    function saveFile(){var ed=document.getElementById('mdEditor');if(!ed||!currentFilePath)return;vscode.postMessage({type:'saveFile',filePath:currentFilePath,content:ed.value});}

    window.addEventListener('message',function(e){
      var msg=e.data;
      if(msg.type==='fileContent')showOverlay(msg.filePath,msg.content,msg.mode);
      else if(msg.type==='fileSaved'){
        originalContent=document.getElementById('mdEditor')?.value||originalContent;isDirty=false;
        var s=document.getElementById('mdSaved');if(s){s.classList.add('show');setTimeout(function(){s.classList.remove('show')},2000);}
        document.getElementById('mdStatus').textContent=originalContent.length+' chars';
        showToast('File saved','success');
      }
      else if(msg.type==='fileError')showToast('Error: '+msg.error,'warning');
      else if(msg.type==='focusSearch'){var si=document.getElementById('searchInput');if(si)si.focus();}
      else if(msg.type==='notification')showToast(msg.text,msg.level||'info');
    });

    document.addEventListener('keydown',function(e){
      if((e.metaKey||e.ctrlKey)&&e.shiftKey&&e.key==='f'){e.preventDefault();var si=document.getElementById('searchInput');if(si)si.focus();}
      if(e.key==='Escape'&&document.getElementById('mdOverlay').innerHTML)closeOverlay();
    });

    // PM Tool Wizard
    var selectedPmTool=null;
    var pmToolConfigs={
      jira:{name:'Jira',command:'uvx',args:['mcp-atlassian']},
      ado:{name:'Azure DevOps',command:'npx',args:['-y','azure-devops-mcp']},
      github:{name:'GitHub Issues',command:'npx',args:['-y','@modelcontextprotocol/server-github']},
      linear:{name:'Linear',command:'npx',args:['-y','mcp-server-linear']},
      none:{name:'None',command:null,args:[]}
    };

    function selectPmTool(el,tool){
      selectedPmTool=tool;
      document.querySelectorAll('.pm-tool-option').forEach(function(o){o.classList.remove('selected');});
      el.classList.add('selected');
      document.getElementById('pmActions').style.display='flex';
    }

    function configurePmTool(){
      if(!selectedPmTool)return;
      var cfg=pmToolConfigs[selectedPmTool];
      if(selectedPmTool==='none'){vscode.postMessage({type:'configurePm',tool:'none'});showToast('Tracking in AI-DLC artifacts only','info');return;}
      vscode.postMessage({type:'configurePm',tool:selectedPmTool,toolName:cfg.name,command:cfg.command,args:cfg.args});
      showToast(cfg.name+' MCP server enabled — authenticate when first invoked','success');
    }

    function skipPmTool(){vscode.postMessage({type:'configurePm',tool:'none'});showToast('PM tool skipped','info');}

    function unarchiveFeature(name){vscode.postMessage({type:'unarchiveFeature',name:name});}
    `;
  }
}
