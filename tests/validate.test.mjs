import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { validateJsonSchema } from '../dist/services/file.js';

describe('validate json schema', () => {
  let tmpDir;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cli-tool-validate-'));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('returns validation errors for invalid data', async () => {
    const dataPath = path.join(tmpDir, 'data.json');
    const schemaPath = path.join(tmpDir, 'schema.json');

    await fs.writeJson(dataPath, { count: 'bad' });
    await fs.writeJson(schemaPath, {
      type: 'object',
      properties: {
        count: { type: 'number' }
      },
      required: ['count']
    });

    const result = await validateJsonSchema(dataPath, schemaPath);
    expect(result.valid).toBe(false);
    expect(result.errors?.length).toBeGreaterThan(0);
  });
});
