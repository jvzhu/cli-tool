import fs from 'node:fs';
import path from 'node:path';
import type { Command } from 'commander';

export interface CliPlugin {
  name: string;
  register(program: Command): void;
}

export async function loadPlugins(program: Command, cwd = process.cwd()): Promise<void> {
  const pluginDir = path.join(cwd, '.cli-tool', 'plugins');
  if (!fs.existsSync(pluginDir)) {
    return;
  }

  const entries = fs.readdirSync(pluginDir).filter((file) => file.endsWith('.js'));
  for (const entry of entries) {
    const mod = (await import(path.join(pluginDir, entry))) as { default?: CliPlugin };
    if (mod.default) {
      mod.default.register(program);
    }
  }
}
