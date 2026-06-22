import { validateJsonSchema } from '../services/file.js';

export async function runValidate(dataPath: string, schemaPath: string): Promise<void> {
  const result = await validateJsonSchema(dataPath, schemaPath);
  if (!result.valid) {
    process.exitCode = 1;
    console.error('Validation failed');
    if (result.errors?.length) {
      for (const error of result.errors) {
        console.error(`- ${error}`);
      }
    }
    return;
  }

  console.log('Validation passed');
}
