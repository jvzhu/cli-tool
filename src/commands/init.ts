import fs from 'fs-extra';
import path from 'node:path';
import inquirer from 'inquirer';

export async function runInit(cwd = process.cwd()): Promise<void> {
  const answers = await inquirer.prompt([
    { type: 'input', name: 'projectName', message: 'Project name', default: path.basename(cwd) },
    { type: 'confirm', name: 'safeDelete', message: 'Enable safe deletion?', default: true },
    {
      type: 'list',
      name: 'outputFormat',
      message: 'Default output format',
      choices: ['table', 'json', 'yaml', 'csv'],
      default: 'table'
    }
  ]);

  await fs.writeJson(
    path.join(cwd, '.clirc'),
    {
      projectName: answers.projectName,
      safeDelete: answers.safeDelete,
      outputFormat: answers.outputFormat,
      logLevel: 'info'
    },
    { spaces: 2 }
  );

  console.log('Initialized .clirc');
}
