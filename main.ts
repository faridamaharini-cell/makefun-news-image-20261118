// A dense newspaper front page summing up Wednesday 18 November 2026 — 42 real stories, one page: 13 illustrated cards, briefs 14-42, a world map and a DATE CHECK. v2 (supersedes v1's 27-story page).
// This program copies the entry image beside this file to $MAKEFUN_OUTPUT_DIR/entry.png.
// Node 22, standard library only. It reads the image into memory, verifies it is
// a JPEG (SOI marker 0xFF 0xD8) and at most 1 MiB, writes it out, then checks the
// written file's size and SHA-256 before reporting success.
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const source = fileURLToPath(new URL('./entry.png', import.meta.url));
const dest = join(outDir, 'entry.png');

const bytes = readFileSync(source);
if (bytes.length < 2 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
  throw new Error('entry.png is not a JPEG: missing SOI marker 0xFF 0xD8');
}
if (bytes.length > 1024 * 1024) {
  throw new Error(`entry.png exceeds 1 MiB: ${bytes.length} bytes`);
}

writeFileSync(dest, bytes);

const sourceSize = statSync(source).size;
const destSize = statSync(dest).size;
if (destSize !== sourceSize) {
  throw new Error(`entry.png copy size mismatch: ${destSize} != ${sourceSize}`);
}
if (destSize > 1024 * 1024) {
  throw new Error(`written entry.png exceeds 1 MiB: ${destSize} bytes`);
}

const sourceDigest = createHash('sha256').update(bytes).digest('hex');
const written = readFileSync(dest);
const digest = createHash('sha256').update(written).digest('hex');
if (digest !== sourceDigest) {
  throw new Error(`entry.png sha256 mismatch: ${digest} != ${sourceDigest}`);
}
console.log(`entry.png: ${destSize} bytes, sha256 ${digest}`);
