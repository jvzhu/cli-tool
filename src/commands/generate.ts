import fs from 'fs-extra';
import path from 'node:path';
import inquirer from 'inquirer';

export async function runGenerate(name?: string): Promise<void> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Template name',
      default: name ?? 'component'
    }
  ]);

  const output = path.join(process.cwd(), `${answers.name}.ts`);
  const templatePath = path.join(process.cwd(), '.cli-tool', 'templates', `${answers.name}.tpl`);
  const content = (await fs.pathExists(templatePath))
    ? (await fs.readFile(templatePath, 'utf-8')).replaceAll('{{name}}', answers.name)
    : `export function ${answers.name}() {\n  return '${answers.name}';\n}\n`;
  await fs.writeFile(output, content);
  console.log(`Generated ${output}`);
}
