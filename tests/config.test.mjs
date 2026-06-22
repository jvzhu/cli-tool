import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { loadConfig, setConfigValue } from '../dist/services/config.js';

describe('config service', () => {
  let tmpDir;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cli-tool-config-'));
    await fs.writeFile(path.join(tmpDir, '.env'), 'CLI_TOOL_API_URL=https://api.test\nCLI_TOOL_API_TOKEN=abc123\n');
    await fs.writeJson(
      path.join(tmpDir, '.clirc'),
      {
        outputFormat: 'json',
        safeDelete: false,
        logLevel: 'debug'
      },
      { spaces: 2 }
    );
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
    delete process.env.CLI_TOOL_API_URL;
    delete process.env.CLI_TOOL_API_TOKEN;
  });

  it('loads merged config with env', () => {
    const config = loadConfig(tmpDir);

    expect(config.outputFormat).toBe('json');
    expect(config.safeDelete).toBe(false);
    expect(config.logLevel).toBe('debug');
    expect(config.apiUrl).toBe('https://api.test');
  });

  it('sets a config value', async () => {
    await setConfigValue('outputFormat', 'yaml', tmpDir);
    const config = await fs.readJson(path.join(tmpDir, '.clirc'));
    expect(config.outputFormat).toBe('yaml');
  });
});
