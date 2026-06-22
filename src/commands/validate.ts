import { validateJsonSchema } from '../services/file.js';

export async function runValidate(dataPath: string, schemaPath: string): Promise<void> {
  const valid = await validateJsonSchema(dataPath, schemaPath);
  if (!valid) {
    process.exitCode = 1;
    console.error('Validation failed');
    return;
  }

  console.log('Validation passed');
}
