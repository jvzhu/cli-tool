import os from 'node:os';
import path from 'node:path';
import fs from 'fs-extra';
import dotenv from 'dotenv';
import * as yaml from 'js-yaml';
import type { CliConfig } from '../types.js';

const DEFAULT_CONFIG: CliConfig = {
  outputFormat: 'table',
  logLevel: 'info',
  safeDelete: true
};

const ALLOWED_OUTPUT = ['table', 'json', 'yaml', 'csv'];
const ALLOWED_LEVELS = ['debug', 'info', 'warn', 'error'];

function parseConfigFile(filePath: string): Partial<CliConfig> {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
    return (yaml.load(content) as Partial<CliConfig>) ?? {};
  }

  try {
    return JSON.parse(content) as Partial<CliConfig>;
  } catch {
    return {};
  }
}

function validateConfig(config: Partial<CliConfig>): Partial<CliConfig> {
  const next = { ...config };

  if (next.outputFormat && !ALLOWED_OUTPUT.includes(next.outputFormat)) {
    delete next.outputFormat;
  }

  if (next.logLevel && !ALLOWED_LEVELS.includes(next.logLevel)) {
    delete next.logLevel;
  }

  return next;
}

export function loadConfig(cwd = process.cwd()): CliConfig {
  dotenv.config({ path: path.join(cwd, '.env'), quiet: true });

  const userPath = path.join(os.homedir(), '.clirc');
  const projectPath = path.join(cwd, '.clirc');
  const yamlPath = path.join(cwd, '.clirc.yaml');

  const merged: Partial<CliConfig> = {
    ...DEFAULT_CONFIG,
    ...validateConfig(parseConfigFile(userPath)),
    ...validateConfig(parseConfigFile(projectPath)),
    ...validateConfig(parseConfigFile(yamlPath)),
    apiUrl: process.env.CLI_TOOL_API_URL,
    apiToken: process.env.CLI_TOOL_API_TOKEN
  };

  return merged as CliConfig;
}

export async function setConfigValue(key: keyof CliConfig, value: unknown, cwd = process.cwd()): Promise<void> {
  const projectPath = path.join(cwd, '.clirc');
  const existing = parseConfigFile(projectPath);

  const next = {
    ...existing,
    [key]: value
  };

  await fs.writeJson(projectPath, next, { spaces: 2 });
}

export function listConfig(config: CliConfig): Record<string, unknown> {
  return {
    ...config,
    apiToken: config.apiToken ? '***' : undefined
  };
}
