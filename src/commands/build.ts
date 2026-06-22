import ora from 'ora';

export async function runBuild(): Promise<void> {
  const spinner = ora('Running build operation...').start();
  await new Promise((resolve) => setTimeout(resolve, 200));
  spinner.succeed('Build operation complete');
}
