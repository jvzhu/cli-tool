import { copyFile, listFiles, moveFile, renameFile, safeDelete } from '../services/file.js';

export async function runFileList(pattern: string): Promise<void> {
  const files = await listFiles(pattern);
  for (const file of files) {
    console.log(file);
  }
}

export async function runFileCopy(from: string, to: string): Promise<void> {
  await copyFile(from, to);
  console.log(`Copied ${from} -> ${to}`);
}

export async function runFileMove(from: string, to: string): Promise<void> {
  await moveFile(from, to);
  console.log(`Moved ${from} -> ${to}`);
}

export async function runFileRename(from: string, to: string): Promise<void> {
  await renameFile(from, to);
  console.log(`Renamed ${from} -> ${to}`);
}

export async function runFileDelete(target: string, safe = true): Promise<void> {
  await safeDelete(target, safe);
  console.log(safe ? `Backed up ${target} to ${target}.bak` : `Deleted ${target}`);
}
