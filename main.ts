// A dense newspaper front page summing up Wednesday 18 November 2026 — 42 real stories, one page: 13 illustrated cards, briefs 14-42, a world map and a DATE CHECK. v2 (supersedes v1's 27-story page).
// This program copies the entry image beside this file to $MAKEFUN_OUTPUT_DIR/entry.png.
// Node 22, standard library only.
import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const source = new URL('./entry.png', import.meta.url);
const dest = join(outDir, 'entry.png');
copyFileSync(source, dest);
if (statSync(dest).size !== statSync(source).size) {
  throw new Error('entry.png copy size mismatch');
}
