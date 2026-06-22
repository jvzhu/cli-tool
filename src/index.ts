#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import updateNotifier from 'update-notifier';
import { loadConfig } from './services/config.js';
import { printOutput } from './services/output.js';
import { loadPlugins } from './services/plugins.js';
import { Hooks, MiddlewareStack } from './services/hooks.js';

const pkg = {
  name: '@jvzhu/cli-tool',
  version: '0.1.0'
};

const config = loadConfig();
const hooks = new Hooks();
const middleware = new MiddlewareStack<{ command: string }>();

hooks.on('command:start', (name) => {
  if (config.logLevel === 'debug') {
    console.log(chalk.gray(`hook: starting ${String(name)}`));
  }
});

middleware.use(async (_ctx, next) => {
  await next();
});

updateNotifier({ pkg }).notify();

const program = new Command();
program
  .name('cli-tool')
  .description('Comprehensive TypeScript CLI utility')
  .version(pkg.version)
  .option('-v, --verbose', 'enable verbose logs')
  .option('-d, --debug', 'enable debug logs')
  .option('-o, --output <format>', 'output format (table|json|yaml|csv)', config.outputFormat);

program
  .command('init')
  .description('Initialize new project/configuration')
  .action(async () => {
    await hooks.emit('command:start', 'init');
    const { runInit } = await import('./commands/init.js');
    await runInit();
  });

const configCommand = program.command('config').description('Manage CLI configuration');
configCommand.command('get <key>').action(async (key) => {
  await hooks.emit('command:start', 'config get');
  const { runConfigGet } = await import('./commands/config.js');
  await runConfigGet(key);
});
configCommand.command('set <key> <value>').action(async (key, value) => {
  await hooks.emit('command:start', 'config set');
  const { runConfigSet } = await import('./commands/config.js');
  await runConfigSet(key, value);
});
configCommand.command('list').action(async () => {
  await hooks.emit('command:start', 'config list');
  const { runConfigList } = await import('./commands/config.js');
  runConfigList();
});

const fileCommand = program.command('file').description('File operations');
fileCommand.command('list [pattern]').action(async (pattern = '**/*') => {
  const { runFileList } = await import('./commands/file.js');
  await runFileList(pattern);
});
fileCommand.command('copy <from> <to>').action(async (from, to) => {
  const { runFileCopy } = await import('./commands/file.js');
  await runFileCopy(from, to);
});
fileCommand.command('move <from> <to>').action(async (from, to) => {
  const { runFileMove } = await import('./commands/file.js');
  await runFileMove(from, to);
});
fileCommand.command('rename <from> <to>').action(async (from, to) => {
  const { runFileRename } = await import('./commands/file.js');
  await runFileRename(from, to);
});
fileCommand.command('delete <target>').option('--force', 'delete without backup').action(async (target, options) => {
  const { runFileDelete } = await import('./commands/file.js');
  await runFileDelete(target, !options.force);
});

program.command('convert <input> <output>').description('Format conversion').action(async (input, output) => {
  const { runConvert } = await import('./commands/convert.js');
  await runConvert(input, output);
});

program.command('validate <dataPath> <schemaPath>').description('Validate data against JSON schema').action(async (dataPath, schemaPath) => {
  const { runValidate } = await import('./commands/validate.js');
  await runValidate(dataPath, schemaPath);
});

program.command('generate [name]').description('Code/template generation').action(async (name) => {
  const { runGenerate } = await import('./commands/generate.js');
  await runGenerate(name);
});

program.command('sync').description('Data synchronization').requiredOption('--api-url <url>', 'API URL').option('--token <token>', 'API token').action(async (options) => {
  const { runSync } = await import('./commands/sync.js');
  await runSync(options.apiUrl, options.token);
});

program.command('build').description('Build operations').action(async () => {
  const { runBuild } = await import('./commands/build.js');
  await runBuild();
});

program.command('help').description('Display help information').action(() => {
  program.outputHelp();
});

program.command('help-json').description('Display help information as JSON').action(() => {
  const options = program.opts();
  printOutput(
    {
      name: program.name(),
      commands: program.commands.map((command) => ({ name: command.name(), description: command.description() }))
    },
    options.output
  );
});

program.command('version').description('Show CLI version').action(() => {
  console.log(pkg.version);
});

program.command('update').description('Check for updates').action(async () => {
  const { runUpdate } = await import('./commands/update.js');
  await runUpdate(pkg.version);
});

await loadPlugins(program);

program.parseAsync(process.argv).catch((error: unknown) => {
  console.error(chalk.red((error as Error).message));
  process.exit(1);
});
