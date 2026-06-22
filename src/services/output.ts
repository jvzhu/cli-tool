import Table from 'cli-table3';
import * as yaml from 'js-yaml';
import { stringify } from 'csv-stringify/sync';
import type { OutputFormat } from '../types.js';

export function formatOutput(input: unknown, format: OutputFormat): string {
  if (format === 'json') {
    return JSON.stringify(input, null, 2);
  }

  if (format === 'yaml') {
    return yaml.dump(input);
  }

  if (format === 'csv') {
    const rows = Array.isArray(input) ? input : [input];
    const records = rows.map((row) =>
      typeof row === 'object' && row !== null ? row : { value: row }
    );

    return stringify(records, { header: true });
  }

  if (Array.isArray(input)) {
    const keys = Object.keys(input[0] ?? {});
    const table = new Table({ head: keys });
    for (const row of input) {
      table.push(keys.map((key) => String((row as Record<string, unknown>)[key] ?? '')));
    }
    return table.toString();
  }

  return JSON.stringify(input, null, 2);
}

export function printOutput(input: unknown, format: OutputFormat): void {
  console.log(formatOutput(input, format));
}
