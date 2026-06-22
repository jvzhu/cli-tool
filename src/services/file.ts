import path from 'node:path';
import fs from 'fs-extra';
import { glob } from 'glob';
import * as yaml from 'js-yaml';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { Ajv2020 } from 'ajv/dist/2020.js';

export async function listFiles(pattern = '**/*', cwd = process.cwd()): Promise<string[]> {
  return glob(pattern, { cwd, nodir: true });
}

export async function copyFile(from: string, to: string): Promise<void> {
  await fs.copy(from, to);
}

export async function moveFile(from: string, to: string): Promise<void> {
  await fs.move(from, to, { overwrite: true });
}

export async function renameFile(from: string, to: string): Promise<void> {
  await fs.move(from, to, { overwrite: true });
}

export async function safeDelete(filePath: string, safe = true): Promise<void> {
  if (!safe) {
    await fs.remove(filePath);
    return;
  }

  const backup = `${filePath}.bak`;
  await fs.move(filePath, backup, { overwrite: true });
}

export async function convertFile(inputPath: string, outputPath: string): Promise<void> {
  const extIn = path.extname(inputPath).toLowerCase();
  const extOut = path.extname(outputPath).toLowerCase();
  const content = await fs.readFile(inputPath, 'utf-8');

  let data: unknown;
  if (extIn === '.json') {
    data = JSON.parse(content);
  } else if (extIn === '.yaml' || extIn === '.yml') {
    data = yaml.load(content);
  } else if (extIn === '.csv') {
    data = parse(content, { columns: true, skip_empty_lines: true });
  } else {
    throw new Error(`Unsupported input format: ${extIn}`);
  }

  let output = '';
  if (extOut === '.json') {
    output = JSON.stringify(data, null, 2);
  } else if (extOut === '.yaml' || extOut === '.yml') {
    output = yaml.dump(data);
  } else if (extOut === '.csv') {
    const rows = Array.isArray(data) ? data : [data];
    output = stringify(rows as object[], { header: true });
  } else {
    throw new Error(`Unsupported output format: ${extOut}`);
  }

  await fs.writeFile(outputPath, output);
}

export async function validateJsonSchema(
  dataPath: string,
  schemaPath: string
): Promise<{ valid: boolean; errors?: string[] }> {
  const data = await fs.readJson(dataPath);
  const schema = await fs.readJson(schemaPath);
  const ajv = new Ajv2020();
  const validate = ajv.compile(schema);
  const valid = validate(data);
  return {
    valid: Boolean(valid),
    errors: validate.errors?.map((error) => `${error.instancePath || '/'} ${error.message ?? 'invalid'}`)
  };
}

export async function watchPattern(pattern: string, callback: (event: string, file: string) => void): Promise<void> {
  const chokidar = await import('chokidar');
  const watcher = chokidar.watch(pattern, { ignoreInitial: true });
  watcher.on('all', callback);
}
