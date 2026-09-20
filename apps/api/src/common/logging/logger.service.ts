import { Injectable, Logger } from "@nestjs/common";

export interface LogMetadata {
  userId?: string;
  ip?: string;
  [key: string]: unknown;
}

@Injectable()
export class StructuredLogger {
  private readonly context: string;
  private readonly logger: Logger;

  /** No constructor DI args — Nest must not inject String */
  constructor() {
    this.context = "app";
    this.logger = new Logger(this.context);
  }

  /** Optional: scoped logger without DI */
  static for(context: string): StructuredLogger {
    const instance = new StructuredLogger();
    (instance as any).context = context;
    (instance as any).logger = new Logger(context);
    return instance;
  }

  private format(
    level: "debug" | "info" | "warn" | "error",
    event: string,
    metadata?: LogMetadata,
  ): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      event,
      context: this.context,
      ...metadata,
    });
  }

  private log(
    level: "debug" | "info" | "warn" | "error",
    event: string,
    metadata?: LogMetadata,
    trace?: string,
  ): void {
    const message = this.format(level, event, metadata);
    if (level === "error") {
      if (trace) this.logger.error(message, trace);
      else this.logger.error(message);
    } else if (level === "warn") {
      this.logger.warn(message);
    } else if (level === "debug") {
      this.logger.debug(message);
    } else {
      this.logger.log(message);
    }
  }

  debug(event: string, metadata?: LogMetadata): void {
    this.log("debug", event, metadata);
  }

  info(event: string, metadata?: LogMetadata): void {
    this.log("info", event, metadata);
  }

  warn(event: string, metadata?: LogMetadata): void {
    this.log("warn", event, metadata);
  }

  error(event: string, metadata?: LogMetadata, trace?: string): void {
    this.log("error", event, metadata, trace);
  }
}
