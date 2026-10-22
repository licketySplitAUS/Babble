import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { sourceOrigin, routingRules } from './clues-routing.mjs';
import { withExpertButton } from './expert-button.mjs';
import { withSiteIcons } from './site-icons.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
// The source of truth is the saved Admin selection. Every build, including
// legacy solver pushes, reads it so an unrelated push cannot undo launch.
const response = await fetch(`${sourceOrigin}/history-api/publication?config=1`, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
if (!response.ok) throw new Error(`Could not load publication selection: HTTP ${response.status}. Keeping the existing deployment.`);
const selection = await response.json();
if (typeof selection.enabled !== 'boolean' || typeof selection.operationId !== 'string') throw new Error('Invalid publication selection. Keeping the existing deployment.');
process.env.USE_NEW_BABBLE_CLUES = String(selection.enabled);

await fs.mkdir(output, { recursive: true });
// Copy tracked public files only; local scratch files and .git never ship.
const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
for (const file of files) {
  if (file.startsWith('.') || file.startsWith('tools/') || ['netlify.toml', 'package.json'].includes(file) || file.endsWith('.md')) continue;
  const destination = path.join(output, file);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  if (file.endsWith('.html')) {
    const source = await fs.readFile(path.join(root, file), 'utf8');
    const updated = withSiteIcons(withExpertButton(source), file);
    if (updated !== source) { await fs.writeFile(destination, updated); continue; }
  }
  await fs.copyFile(path.join(root, file), destination);
}
await fs.copyFile(path.join(output, 'babbleclues.html'), path.join(output, 'legacy-babbleclues.html'));
await fs.writeFile(path.join(output, '_redirects'), routingRules(selection.enabled));
await fs.writeFile(path.join(output, 'clues-publication.json'), JSON.stringify({ enabled: selection.enabled, operationId: selection.operationId, builtAt: new Date().toISOString() }));
console.log(`Public clues mode: ${selection.enabled ? 'new tool' : 'legacy page'} (${selection.operationId}).`);
