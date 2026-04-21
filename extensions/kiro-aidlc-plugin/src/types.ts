export interface AidlcManifest {
  featureName: string;
  projectType: string;
  startDate: string;
  currentStage: string;
  stages: StageInfo[];
  extensions: Record<string, boolean>;
  pmTool: PmToolConfig | null;
  buildPath: BuildPathConfig | null;
}

export interface StageInfo {
  name: string;
  phase: 'inception' | 'construction' | 'operations';
  status: 'complete' | 'in-progress' | 'skipped' | 'pending';
}

export interface PmToolConfig { tool: string; syncEnabled: boolean; }
export interface BuildPathConfig { selectedPath: string; entryPoint: string; prototypeStatus: string; transitionApproach: string; }

export type PhaseName = 'inception' | 'construction' | 'operations';

export const PHASE_DISPLAY: Record<PhaseName, { label: string; icon: string }> = {
  inception:    { label: '🔵 Inception',    icon: 'symbol-event' },
  construction: { label: '🟢 Construction', icon: 'tools' },
  operations:   { label: '🟡 Operations',   icon: 'server-process' },
};

export const STAGE_DEFINITIONS: { name: string; phase: PhaseName; chatCommand: string }[] = [
  { name: 'Workspace Detection',   phase: 'inception',    chatCommand: 'Using AI-DLC, start workspace detection' },
  { name: 'Intent Alignment',      phase: 'inception',    chatCommand: 'Using AI-DLC, start intent alignment' },
  { name: 'Requirements Analysis', phase: 'inception',    chatCommand: 'Using AI-DLC, start requirements analysis' },
  { name: 'User Stories',          phase: 'inception',    chatCommand: 'Using AI-DLC, start user stories' },
  { name: 'Workflow Planning',     phase: 'inception',    chatCommand: 'Using AI-DLC, start workflow planning' },
  { name: 'Application Design',    phase: 'inception',    chatCommand: 'Using AI-DLC, start application design' },
  { name: 'Units Generation',      phase: 'inception',    chatCommand: 'Using AI-DLC, start units generation' },
  { name: 'Functional Design',     phase: 'construction', chatCommand: 'Using AI-DLC, start functional design' },
  { name: 'NFR Requirements',      phase: 'construction', chatCommand: 'Using AI-DLC, start NFR requirements' },
  { name: 'NFR Design',            phase: 'construction', chatCommand: 'Using AI-DLC, start NFR design' },
  { name: 'Infrastructure Design', phase: 'construction', chatCommand: 'Using AI-DLC, start infrastructure design' },
  { name: 'Code Generation',       phase: 'construction', chatCommand: 'Using AI-DLC, start code generation' },
  { name: 'Build and Test',        phase: 'construction', chatCommand: 'Using AI-DLC, start build and test' },
  { name: 'Operations',            phase: 'operations',   chatCommand: 'Using AI-DLC, start operations' },
];

export function parseStateFile(content: string, featureName: string): AidlcManifest {
  const manifest: AidlcManifest = {
    featureName, projectType: extractValue(content, 'Project Type') || 'Unknown',
    startDate: extractValue(content, 'Start Date') || '',
    currentStage: extractValue(content, 'Current Stage') || '',
    stages: [], extensions: {}, pmTool: null, buildPath: null,
  };
  const stageLines = content.match(/- \[[ x~]\] .+/g) || [];
  for (const line of stageLines) {
    const isComplete = line.includes('[x]');
    const isInProgress = line.includes('[~]');
    const nameMatch = line.match(/\] (?:INCEPTION|CONSTRUCTION|OPERATIONS) - (.+)/);
    if (nameMatch) {
      const name = nameMatch[1].trim();
      const phasePart = line.match(/\] (INCEPTION|CONSTRUCTION|OPERATIONS)/);
      const phase = (phasePart?.[1]?.toLowerCase() || 'inception') as PhaseName;
      manifest.stages.push({ name, phase,
        status: isComplete ? 'complete' : isInProgress ? 'in-progress' : 'pending',
      });
    }
  }
  const pmTool = extractValue(content, 'Tool');
  const syncEnabled = extractValue(content, 'Sync Enabled');
  if (pmTool && !pmTool.startsWith('[')) {
    manifest.pmTool = { tool: pmTool, syncEnabled: syncEnabled === 'Yes' };
  }
  const selectedPath = extractValue(content, 'Selected Path');
  if (selectedPath && !selectedPath.startsWith('[')) {
    manifest.buildPath = { selectedPath,
      entryPoint: extractValue(content, 'Entry Point') || 'N/A',
      prototypeStatus: extractValue(content, 'Prototype Status') || 'N/A',
      transitionApproach: extractValue(content, 'Transition Approach') || 'N/A',
    };
  }
  return manifest;
}

function extractValue(content: string, key: string): string | null {
  const regex = new RegExp(`\\*\\*${key}\\*\\*:\\s*(.+)`);
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}
