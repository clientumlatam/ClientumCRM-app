import { readdir } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Keep this list intentionally explicit. A new root-level file should require
// a deliberate decision instead of silently becoming part of the application.
const allowedRootFiles = new Set([
  '.env.example',
  '.gitignore',
  '.npmrc',
  '.replit',
  '.vercelignore',
  'DOCUMENTATION.md',
  'README.md',
  'ROADMAP.md',
  'bun.lock',
  'firebase-applet-config.json',
  'firebase-blueprint.json',
  'firestore.rules',
  'index.html',
  'metadata.json',
  'package-lock.json',
  'package.json',
  'replit.md',
  'server.ts',
  'skills-lock.json',
  'tsconfig.json',
  'vercel.json',
  'vite.config.ts',
]);

async function findUnexpectedRootFiles() {
  const entries = await readdir(projectRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() || entry.isSymbolicLink())
    .map((entry) => entry.name)
    .filter((name) => !allowedRootFiles.has(name))
    .sort();
}

const unexpectedFiles = await findUnexpectedRootFiles();

if (unexpectedFiles.length > 0) {
  console.error('[root-layout-check] Unexpected files in the project root:');
  for (const file of unexpectedFiles) {
    console.error(`  - ${relative(projectRoot, resolve(projectRoot, file))}`);
  }
  console.error(
    '[root-layout-check] Move documents, evidence, images, and ZIP files to project_archive/.',
  );
  process.exitCode = 1;
} else {
  console.log(
    '[root-layout-check] Project root contains only approved runtime/configuration files.',
  );
}