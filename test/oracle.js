import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { serializeMarkdown, transform } from '../src/domain/index.js';
import { collectFamilies, scoreBearingFamilies } from './oracle-helpers.js';

const detector = process.env.SLOPTRIM_DETECT;
if (!detector) {
  console.log('SLOPTRIM_DETECT is unset; optional pinned SlopTrim oracle skipped.');
  process.exit(0);
}

const source = `A small team uses a review tool to improve releases. The system is a simple way to show errors before customers see them, and it helps each task stay focused. The team has three goals: catch risky changes early, explain decisions clearly, and keep feedback connected to the code.

The process starts when an engineer opens a change. Reviewers read the proposal and discuss its context. The tool connects comments to exact lines and shows which checks passed. This keeps the conversation practical, but the team still decides what matters.

The team measures results over time. Faster reviews are useful, clear ownership is important, and fewer production problems help everyone. The process does not replace judgment; it gives people a shared place to work and learn.`;
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'claudify-oracle-'));
const fixturePath = join(temporaryDirectory, 'composition.md');

try {
  writeFileSync(fixturePath, serializeMarkdown(transform(source)), 'utf8');
  const run = spawnSync('python3', [detector, fixturePath], { encoding: 'utf8', timeout: 15_000, killSignal: 'SIGKILL' });
  if (run.error) throw new Error(run.error.code === 'ETIMEDOUT' ? 'SlopTrim detector timed out after 15000 ms.' : run.error.message);
  if (run.status !== 0) throw new Error(run.stderr || `SlopTrim exited ${run.status}`);
  const result = JSON.parse(run.stdout);
  const families = collectFamilies(result);
  const scoreBearing = scoreBearingFamilies(families);
  const forbidden = [47, 48, 50, 62, 63, 64, 65, 66, 67, 68, 71].filter((id) => families.has(id));
  if (families.size < 15) throw new Error(`Expected at least 15 SlopTrim families, received ${families.size}: ${[...families].sort((a, b) => a - b)}`);
  if (scoreBearing.length < 10) throw new Error(`Expected at least 10 score-bearing SlopTrim families, received ${scoreBearing.length}: ${scoreBearing.sort((a, b) => a - b)}`);
  if (forbidden.length) throw new Error(`Forbidden SlopTrim families detected: ${forbidden.join(', ')}`);
  const serialized = JSON.stringify(result).toLowerCase();
  if (!serialized.includes('heavy tells') && !serialized.includes('pervasive tells')) throw new Error('Expected heavy tells or higher');
  console.log(`SlopTrim oracle passed with ${families.size} detected families, including ${scoreBearing.length} score-bearing families: ${scoreBearing.sort((a, b) => a - b).join(', ')}.`);
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
