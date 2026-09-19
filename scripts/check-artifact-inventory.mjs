import { readFile, stat } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const inventoryPath = resolve(
  projectRoot,
  '.agents',
  'agent_assets_metadata.toml',
);

function decodeTomlString(value) {
  return JSON.parse(`"${value}"`);
}

function parseOutputEntries(inventory) {
  const entries = [];
  let currentEntry = null;

  for (const [index, line] of inventory.split(/\r?\n/).entries()) {
    if (/^\s*\[\[outputs\]\]\s*$/.test(line)) {
      if (currentEntry) {
        entries.push(currentEntry);
      }
      currentEntry = { entryNumber: entries.length + 1, lineNumber: index + 1 };
      continue;
    }

    if (!currentEntry) {
      continue;
    }

    const idMatch = line.match(/^\s*id\s*=\s*"((?:\\.|[^"])*)"\s*$/);
    if (idMatch) {
      currentEntry.id = decodeTomlString(idMatch[1]);
      continue;
    }

    const titleMatch = line.match(/^\s*title\s*=\s*"((?:\\.|[^"])*)"\s*$/);
    if (titleMatch) {
      currentEntry.title = decodeTomlString(titleMatch[1]);
      continue;
    }

    const uriMatch = line.match(/^\s*uri\s*=\s*"((?:\\.|[^"])*)"\s*$/);
    if (uriMatch) {
      currentEntry.uri = decodeTomlString(uriMatch[1]);
    }
  }

  if (currentEntry) {
    entries.push(currentEntry);
  }

  return entries.filter((entry) => entry.uri?.startsWith('file://'));
}

function localPathFromUri(uri) {
  const encodedPath = uri.slice('file://'.length);
  const decodedPath = decodeURIComponent(encodedPath);

  return isAbsolute(decodedPath)
    ? resolve(decodedPath)
    : resolve(projectRoot, decodedPath);
}

const inventory = await readFile(inventoryPath, 'utf8');
const localEntries = parseOutputEntries(inventory);
const missingEntries = [];

for (const entry of localEntries) {
  const localPath = localPathFromUri(entry.uri);

  try {
    const file = await stat(localPath);
    if (!file.isFile()) {
      throw new Error('Local artifact URI does not point to a file');
    }
  } catch {
    missingEntries.push({ ...entry, localPath });
  }
}

if (missingEntries.length > 0) {
  console.error(
    `[artifact-inventory-check] ${missingEntries.length} local artifact path(s) are missing:`,
  );

  for (const entry of missingEntries) {
    const displayPath = relative(projectRoot, entry.localPath) || entry.localPath;
    console.error(
      `  - entry ${entry.entryNumber} (line ${entry.lineNumber}), ` +
        `"${entry.title ?? '(untitled)'}", ` +
        `id "${entry.id ?? '(missing id)'}", uri "${entry.uri}"`,
    );
    console.error(`    expected file: ${displayPath}`);
  }

  process.exitCode = 1;
} else {
  console.log(
    `[artifact-inventory-check] Verified ${localEntries.length} local artifact path(s).`,
  );
}