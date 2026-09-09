import { Injectable, NestMiddleware, HttpException, HttpStatus } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";

type Bucket = { count: number; resetAt: number };

/**
 * In-memory rate limit (single API process).
 * Good enough for beta; swap to Redis later for multi-instance.
 */
@Injectable()
export class SimpleRateLimitMiddleware implements NestMiddleware {
  private buckets = new Map<string, Bucket>();

  constructor(
    private readonly max = 30,
    private readonly windowMs = 60_000,
  ) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown";
    const key = `\( {ip}: \){req.method}:${req.path}`;
    const now = Date.now();
    let b = this.buckets.get(key);

    if (!b || now > b.resetAt) {
      b = { count: 0, resetAt: now + this.windowMs };
      this.buckets.set(key, b);
    }

    b.count += 1;
    if (b.count > this.max) {
      throw new HttpException(
        {
          message: "Too many requests. Try again shortly.",
          code: "RATE_LIMITED",
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    next();
  }
}