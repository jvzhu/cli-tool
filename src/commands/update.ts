import axios from 'axios';

export async function runUpdate(currentVersion: string): Promise<void> {
  const response = await axios.get<{ 'dist-tags': { latest: string } }>('https://registry.npmjs.org/@jvzhu/cli-tool', {
    timeout: 5000
  });

  const latest = response.data['dist-tags'].latest;

  if (latest === currentVersion) {
    console.log(`Already up to date (${currentVersion})`);
    return;
  }

  console.log(`Update available: ${currentVersion} -> ${latest}`);
}
