#!/usr/bin/env node
'use strict';

const blessed = require('blessed');
const contrib = require('blessed-contrib');
const fs = require('fs');
const path = require('path');

// ── Config ──
const WORKSPACE = process.argv[2] || process.cwd();
const DOCS_DIR = path.join(WORKSPACE, 'aidlc-docs');
const POLL_MS = 2000;

const STAGES = [
  { name: 'Workspace Detection',   phase: 'inception' },
  { name: 'Intent Alignment',      phase: 'inception' },
  { name: 'Requirements Analysis', phase: 'inception' },
  { name: 'User Stories',          phase: 'inception' },
  { name: 'Workflow Planning',     phase: 'inception' },
  { name: 'Application Design',    phase: 'inception' },
  { name: 'Units Generation',      phase: 'inception' },
  { name: 'Functional Design',     phase: 'construction' },
  { name: 'NFR Requirements',      phase: 'construction' },
  { name: 'NFR Design',            phase: 'construction' },
  { name: 'Infrastructure Design', phase: 'construction' },
  { name: 'Code Generation',       phase: 'construction' },
  { name: 'Build and Test',        phase: 'construction' },
  { name: 'Operations',            phase: 'operations' },
];

function parseState(content, featureName) {
  const extract = (key) => { const m = content.match(new RegExp(`\\*\\*${key}\\*\\*:\\s*(.+)`)); return m ? m[1].trim() : ''; };
  const stages = [];
  const lines = content.match(/- \[[ x~]\] .+/g) || [];
  for (const line of lines) {
    const nm = line.match(/\] (?:INCEPTION|CONSTRUCTION|OPERATIONS) - (.+)/);
    if (nm) { stages.push({ name: nm[1].trim(), status: line.includes('[x]') ? 'complete' : line.includes('[~]') ? 'in-progress' : 'pending' }); }
  }
  return { featureName, projectType: extract('Project Type'), currentStage: extract('Current Stage'),
    startDate: extract('Start Date'), stages, pmTool: extract('Tool'), syncEnabled: extract('Sync Enabled') === 'Yes',
    buildPath: extract('Selected Path'), prototypeStatus: extract('Prototype Status') };
}

function parseAudit(content) {
  const entries = [];
  for (const block of content.split(/^---$/m)) {
    const stage = (block.match(/^## (.+)$/m) || [])[1];
    const time = (block.match(/\*\*Timestamp\*\*:\s*(.+)/) || [])[1];
    const response = (block.match(/\*\*AI Response\*\*:\s*(.+)/m) || [])[1];
    if (stage && time) { entries.push({ stage: stage.trim(), time: time.trim(), text: (response || '').trim().substring(0, 80) }); }
  }
  return entries.reverse().slice(0, 15);
}

function scanFeatures() {
  if (!fs.existsSync(DOCS_DIR)) return [];
  const features = [];
  try {
    for (const entry of fs.readdirSync(DOCS_DIR, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const sp = path.join(DOCS_DIR, entry.name, 'aidlc-state.md');
      if (fs.existsSync(sp)) { features.push(parseState(fs.readFileSync(sp, 'utf-8'), entry.name)); }
    }
  } catch {}
  return features;
}

// ── UI ──
const screen = blessed.screen({ smartCSR: true, title: 'AI-DLC Dashboard', fullUnicode: true });
const grid = new contrib.grid({ rows: 12, cols: 12, screen });

const header = grid.set(0, 0, 1, 12, blessed.box, {
  content: ' 🏗️  AI-DLC Terminal Dashboard', tags: true,
  style: { fg: 'white', bg: 'blue', bold: true },
});

const gauge = grid.set(1, 0, 2, 4, contrib.gauge, {
  label: ' Overall Progress ', stroke: 'green', fill: 'white',
  border: { type: 'line', fg: 'cyan' }, style: { border: { fg: 'cyan' } },
});

const featureBox = grid.set(1, 4, 2, 8, blessed.box, {
  label: ' Active Feature ', tags: true, padding: { left: 1 },
  border: { type: 'line', fg: 'cyan' }, style: { border: { fg: 'cyan' }, fg: 'white' },
});

const phasesTable = grid.set(3, 0, 5, 6, contrib.table, {
  label: ' Workflow Phases ', keys: true, vi: true, interactive: true,
  border: { type: 'line', fg: 'cyan' },
  style: { border: { fg: 'cyan' }, header: { fg: 'cyan', bold: true }, cell: { fg: 'white' } },
  columnSpacing: 2, columnWidth: [24, 14, 10],
});

const govTable = grid.set(3, 6, 3, 6, contrib.table, {
  label: ' 🛡️ Governance ',
  border: { type: 'line', fg: 'yellow' },
  style: { border: { fg: 'yellow' }, header: { fg: 'yellow', bold: true }, cell: { fg: 'white' } },
  columnSpacing: 2, columnWidth: [22, 20],
});

const featuresList = grid.set(6, 6, 2, 6, contrib.table, {
  label: ' 📦 Features ', keys: true, vi: true, interactive: true,
  border: { type: 'line', fg: 'magenta' },
  style: { border: { fg: 'magenta' }, header: { fg: 'magenta', bold: true }, cell: { fg: 'white' } },
  columnSpacing: 2, columnWidth: [22, 18, 6],
});

const activityLog = grid.set(8, 0, 3, 12, contrib.log, {
  label: ' ⏱️ Recent Activity ', tags: true, bufferLength: 30,
  border: { type: 'line', fg: 'green' }, style: { border: { fg: 'green' }, fg: 'white' },
});

const cmdBar = grid.set(11, 0, 1, 12, blessed.textbox, {
  label: ' Command (Tab to focus, Enter to run) ', inputOnFocus: true,
  border: { type: 'line', fg: 'white' }, style: { border: { fg: 'white' }, fg: 'white', bg: 'black' },
});

// ── State ──
let features = [], activeIdx = 0, lastAudit = '';

function refresh() {
  features = scanFeatures();
  if (activeIdx >= features.length) activeIdx = 0;
  const m = features[activeIdx] || null;

  header.setContent(m ? ` 🏗️  AI-DLC Terminal Dashboard  │  ${m.featureName}  │  ${m.currentStage}` : ' 🏗️  AI-DLC Terminal Dashboard  │  No features detected');

  if (m) {
    const done = m.stages.filter(s => s.status === 'complete').length;
    const total = m.stages.length;
    gauge.setPercent(total > 0 ? Math.round((done / total) * 100) : 0);
    featureBox.setContent(`{bold}${m.featureName}{/bold}  {cyan-fg}${m.projectType}{/cyan-fg}\nStage: {yellow-fg}${m.currentStage}{/yellow-fg}\nProgress: ${done}/${total} stages  |  Started: ${(m.startDate || '').split('T')[0]}`);
    phasesTable.setData({ headers: ['Stage', 'Phase', 'Status'], data: STAGES.map(def => {
      const info = m.stages.find(s => s.name === def.name);
      const st = info ? info.status : 'pending';
      return [`${st === 'complete' ? '✅' : st === 'in-progress' ? '🔄' : '○ '} ${def.name}`, def.phase, st];
    })});

    const arbExists = fs.existsSync(path.join(DOCS_DIR, m.featureName, 'construction', 'adrs', 'arb-submission.md'));
    const ptoExists = fs.existsSync(path.join(DOCS_DIR, m.featureName, 'operations', 'permit-to-operate.md'));
    let reviews = 0, evidence = 0;
    try { reviews = fs.readdirSync(path.join(DOCS_DIR, m.featureName, 'construction', 'adrs')).filter(f => f.startsWith('design-review-')).length; } catch {}
    try { evidence = fs.readdirSync(path.join(DOCS_DIR, m.featureName, 'construction', 'build-and-test')).filter(f => f.startsWith('test-evidence-')).length; } catch {}
    govTable.setData({ headers: ['Control', 'Status'], data: [
      ['📋 PM Tool', m.pmTool && !m.pmTool.startsWith('[') ? `${m.pmTool} (sync: ${m.syncEnabled ? 'on' : 'off'})` : 'Not configured'],
      ['📄 ARB Artifact', arbExists ? '✅ Generated' : '○ Pending'],
      ['🎫 Permit to Operate', ptoExists ? '✅ Generated' : '○ Pending'],
      ['🧪 Build Path', m.buildPath && !m.buildPath.startsWith('[') ? m.buildPath : 'Not selected'],
      ['🔍 Design Reviews', `${reviews} review(s)`],
      ['📝 Test Evidence', `${evidence} document(s)`],
    ]});

    const auditPath = path.join(DOCS_DIR, m.featureName, 'audit.md');
    if (fs.existsSync(auditPath)) {
      const content = fs.readFileSync(auditPath, 'utf-8');
      if (content !== lastAudit) {
        lastAudit = content;
        activityLog.logLines = [];
        for (const e of parseAudit(content).slice(0, 10)) {
          activityLog.log(`{cyan-fg}${e.time}{/cyan-fg} {yellow-fg}${e.stage}{/yellow-fg} ${e.text}`);
        }
      }
    }
  } else {
    gauge.setPercent(0);
    featureBox.setContent('No active feature.\nStart Kiro CLI and say:\n"Using AI-DLC, I want to build ..."');
  }

  if (features.length > 0) {
    featuresList.setData({ headers: ['Feature', 'Stage', 'Prog'], data: features.map((f, i) => {
      const done = f.stages.filter(s => s.status === 'complete').length;
      const pct = f.stages.length > 0 ? Math.round((done / f.stages.length) * 100) : 0;
      return [`${i === activeIdx ? '● ' : '  '}${f.featureName}`, f.currentStage, `${pct}%`];
    })});
  }
  screen.render();
}

// ── Keys ──
screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
screen.key(['r'], () => { refresh(); activityLog.log('{green-fg}Refreshed{/green-fg}'); screen.render(); });
screen.key(['tab'], () => { cmdBar.focus(); screen.render(); });
screen.key(['1','2','3','4','5','6','7','8','9'], (ch) => {
  const idx = parseInt(ch) - 1;
  if (idx < features.length) { activeIdx = idx; refresh(); activityLog.log(`{green-fg}Switched to: ${features[idx].featureName}{/green-fg}`); }
});
screen.key(['left'], () => { if (activeIdx > 0) { activeIdx--; refresh(); } });
screen.key(['right'], () => { if (activeIdx < features.length - 1) { activeIdx++; refresh(); } });

cmdBar.on('submit', (value) => {
  const cmd = value.trim().toLowerCase(); cmdBar.clearValue(); cmdBar.cancel();
  if (cmd === 'help') {
    activityLog.log('{cyan-fg}Commands: help, refresh, features, switch <name>, quit{/cyan-fg}');
    activityLog.log('{cyan-fg}Keys: q=quit r=refresh tab=command 1-9=switch ←→=navigate{/cyan-fg}');
  } else if (cmd === 'refresh') { refresh(); activityLog.log('{green-fg}Refreshed{/green-fg}');
  } else if (cmd === 'features' || cmd === 'list') {
    features.forEach((f, i) => { const d = f.stages.filter(s => s.status === 'complete').length; activityLog.log(`${i === activeIdx ? '●' : ' '} [${i+1}] ${f.featureName} — ${f.currentStage} (${d}/${f.stages.length})`); });
  } else if (cmd.startsWith('switch ')) {
    const t = cmd.slice(7).trim(); const idx = features.findIndex(f => f.featureName.includes(t));
    if (idx >= 0) { activeIdx = idx; refresh(); activityLog.log(`{green-fg}Switched to: ${features[idx].featureName}{/green-fg}`); }
    else { activityLog.log(`{red-fg}Feature not found: ${t}{/red-fg}`); }
  } else if (cmd === 'quit' || cmd === 'exit') { process.exit(0);
  } else { activityLog.log(`{red-fg}Unknown: ${cmd}. Type 'help'{/red-fg}`); }
  screen.render();
});

// ── Start ──
setInterval(refresh, POLL_MS);
refresh();
activityLog.log('{cyan-fg}AI-DLC Terminal Dashboard started. q=quit r=refresh tab=commands 1-9=switch features{/cyan-fg}');
screen.render();
