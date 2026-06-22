import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levelPriority: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

export class Logger {
  constructor(
    private readonly level: LogLevel = 'info',
    private readonly logFile = path.join(os.homedir(), '.cli-tool.log')
  ) {}

  private shouldLog(level: LogLevel): boolean {
    return levelPriority[level] >= levelPriority[this.level];
  }

  private write(level: LogLevel, message: string, meta?: unknown): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const payload = {
      ts: new Date().toISOString(),
      level,
      message,
      meta
    };

    console[level === 'debug' ? 'log' : level](JSON.stringify(payload));

    try {
      fs.appendFileSync(this.logFile, `${JSON.stringify(payload)}\n`);
    } catch {
      // ignore file logging failures
    }
  }

  debug(message: string, meta?: unknown): void {
    this.write('debug', message, meta);
  }

  info(message: string, meta?: unknown): void {
    this.write('info', message, meta);
  }

  warn(message: string, meta?: unknown): void {
    this.write('warn', message, meta);
  }

  error(message: string, meta?: unknown): void {
    this.write('error', message, meta);
  }
}
