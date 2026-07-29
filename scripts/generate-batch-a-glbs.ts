/**
 * Batch A runner — delegates to generate-batch-glbs.ts.
 * Location: scripts/generate-batch-a-glbs.ts
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const r = spawnSync(
  'npx',
  ['tsx', 'scripts/generate-batch-glbs.ts', '--batch=A'],
  { cwd: root, stdio: 'inherit' },
);
process.exit(r.status ?? 1);
