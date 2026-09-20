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

  constructor(context: string = "app") {
    this.context = context;
    this.logger = new Logger(context);
  }

  private format(
    level: "debug" | "info" | "warn" | "error",
    event: string,
    metadata?: LogMetadata,
  ): string {
    const payload = {
      timestamp: new Date().toISOString(),
      level,
      event,
      context: this.context,
      ...metadata,
    };
    return JSON.stringify(payload);
  }

  private log(
    level: "debug" | "info" | "warn" | "error",
    event: string,
    metadata?: LogMetadata,
    trace?: string,
  ): void {
    const message = this.format(level, event, metadata);
    if (level === "error") {
      if (trace) {
        this.logger.error(message, trace);
      } else {
        this.logger.error(message);
      }
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
