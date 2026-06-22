import path from 'node:path';
import { execa } from 'execa';

describe('cli', () => {
  const root = path.resolve(process.cwd());

  it('prints version', async () => {
    const { stdout } = await execa('node', ['dist/index.js', 'version'], { cwd: root });
    expect(stdout.trim()).toBe('0.1.0');
  });

  it('shows help', async () => {
    const { stdout } = await execa('node', ['dist/index.js', '--help'], { cwd: root });
    expect(stdout).toContain('Comprehensive TypeScript CLI utility');
    expect(stdout).toContain('config');
  });
});
