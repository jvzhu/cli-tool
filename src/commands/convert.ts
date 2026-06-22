import { convertFile } from '../services/file.js';

export async function runConvert(input: string, output: string): Promise<void> {
  await convertFile(input, output);
  console.log(`Converted ${input} -> ${output}`);
}
