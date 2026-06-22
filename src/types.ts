export type OutputFormat = 'table' | 'json' | 'yaml' | 'csv';

export interface CliConfig {
  outputFormat: OutputFormat;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  safeDelete: boolean;
  apiUrl?: string;
  apiToken?: string;
}

export interface CommandContext {
  verbose?: boolean;
  debug?: boolean;
  output?: OutputFormat;
}
