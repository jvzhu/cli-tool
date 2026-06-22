import inquirer from 'inquirer';
import ora from 'ora';
import { ApiClient } from '../services/api.js';
import { Logger } from '../services/logger.js';

export async function runSync(apiUrl: string, token?: string): Promise<void> {
  const { proceed } = await inquirer.prompt([
    { type: 'confirm', name: 'proceed', message: `Sync from ${apiUrl}?`, default: true }
  ]);

  if (!proceed) {
    console.log('Sync canceled');
    return;
  }

  const spinner = ora('Syncing data...').start();
  try {
    const client = new ApiClient(apiUrl, token, new Logger('info'));
    const result = await client.get('/status');
    spinner.succeed('Sync complete');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    spinner.fail('Sync failed');
    throw error;
  }
}
