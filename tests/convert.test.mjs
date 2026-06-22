import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import * as yaml from 'js-yaml';
import { convertFile } from '../dist/services/file.js';

describe('convert file', () => {
  let tmpDir;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cli-tool-convert-'));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('converts json to yaml', async () => {
    const input = path.join(tmpDir, 'input.json');
    const output = path.join(tmpDir, 'output.yaml');

    await fs.writeJson(input, { name: 'sample', enabled: true });
    await convertFile(input, output);

    const result = yaml.load(await fs.readFile(output, 'utf-8'));
    expect(result).toEqual({ name: 'sample', enabled: true });
  });
});
