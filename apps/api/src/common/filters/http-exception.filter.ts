import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { OperationalException } from "../exceptions/operational-exception";

const STATUS_CODE_MAP: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: "BAD_REQUEST",
  [HttpStatus.UNAUTHORIZED]: "UNAUTHORIZED",
  [HttpStatus.FORBIDDEN]: "FORBIDDEN",
  [HttpStatus.NOT_FOUND]: "NOT_FOUND",
  [HttpStatus.CONFLICT]: "CONFLICT",
  [HttpStatus.UNPROCESSABLE_ENTITY]: "VALIDATION_ERROR",
  [HttpStatus.TOO_MANY_REQUESTS]: "RATE_LIMITED",
  [HttpStatus.INTERNAL_SERVER_ERROR]: "INTERNAL_ERROR",
};

const INTERNAL_ERROR_PATTERNS = [
  /sql/i,
  /query/i,
  /prisma/i,
  /stack/i,
  /at\s+[\w./]+\(\w+\.\w+:\d+\)/,
  /ENOENT/i,
  /EACCES/i,
  /ECONNREFUSED/i,
  /undefined is not/i,
  /cannot read/i,
  /violates/i,
  /duplicate key/i,
  /constraint/i,
];

function looksLikeInternalError(message: string): boolean {
  return INTERNAL_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

function isOperationalException(
  ex: unknown,
): ex is OperationalException {
  return ex instanceof OperationalException;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger("API");

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = "Internal server error";
    let code = "INTERNAL_ERROR";

    if (isOperationalException(exception)) {
      status = exception.getStatus();
      message = exception.message;
      code = STATUS_CODE_MAP[status] || HttpStatus[status] || code;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === "string") {
        message = body;
      } else if (body && typeof body === "object") {
        const o = body as any;
        message = o.message || message;
        code = o.error || o.code || STATUS_CODE_MAP[status] || HttpStatus[status] || code;
      }

      if (process.env.NODE_ENV === "production" && !(exception instanceof OperationalException)) {
        const msgStr = Array.isArray(message) ? message.join(" ") : String(message);
        if (looksLikeInternalError(msgStr)) {
          this.logger.warn(`Sanitized internal error message: ${msgStr}`);
          message = STATUS_CODE_MAP[status] || "Request error";
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
      message =
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : exception.message;
      code = "INTERNAL_ERROR";
    }

    res.status(status).json({
      success: false,
      statusCode: status,
      code,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
