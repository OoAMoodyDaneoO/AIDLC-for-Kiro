import * as fs from 'fs';

export function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function titleCase(slug: string): string {
  return slug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function readTextFile(filePath: string): string {
  try { return fs.readFileSync(filePath, 'utf-8'); } catch { return ''; }
}

export function parseFrontMatter(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) { return result; }
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx > 0) { result[line.slice(0, idx).trim()] = line.slice(idx + 1).trim(); }
  }
  return result;
}

export function listFiles(dir: string, ext: string): string[] {
  try { return fs.readdirSync(dir).filter(f => f.endsWith(ext)).map(f => `${dir}/${f}`); }
  catch { return []; }
}
