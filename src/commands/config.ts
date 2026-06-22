import { listConfig, loadConfig, setConfigValue } from '../services/config.js';

export async function runConfigGet(key: string): Promise<void> {
  const config = loadConfig();
  console.log(config[key as keyof typeof config]);
}

export async function runConfigSet(key: string, value: string): Promise<void> {
  const parsed: unknown = value === 'true' ? true : value === 'false' ? false : value;
  await setConfigValue(key as never, parsed);
  console.log(`Set ${key}`);
}

export function runConfigList(): void {
  const config = loadConfig();
  console.log(JSON.stringify(listConfig(config), null, 2));
}
