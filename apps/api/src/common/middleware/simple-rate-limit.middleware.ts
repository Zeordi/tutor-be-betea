import { NestMiddleware, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";

type Bucket = { count: number; resetAt: number };

/**
 * In-memory rate limit (single API process).
 * Good enough for beta; swap to Redis later for multi-instance.
 */
export class RateLimitMiddleware implements NestMiddleware {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
  ) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown";
    const key = `${ip}:${req.method}:${req.path}`;
    const now = Date.now();
    let b = this.buckets.get(key);

    if (!b || now > b.resetAt) {
      b = { count: 0, resetAt: now + this.windowMs };
      this.buckets.set(key, b);
    }

    b.count += 1;
    if (b.count > this.max) {
      const retryAfter = Math.max(1, Math.ceil((b.resetAt - now) / 1000));
      _res.setHeader("Retry-After", retryAfter.toString());
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          code: "RATE_LIMITED",
          message: "Too many requests. Try again shortly.",
          path: req.url,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    next();
  }
}

@Injectable()
export class AuthRateLimitMiddleware extends RateLimitMiddleware {
  constructor() {
    super(5, 60_000);
  }
}

@Injectable()
export class PaymentRateLimitMiddleware extends RateLimitMiddleware {
  constructor() {
    super(10, 60_000);
  }
}

@Injectable()
export class GeneralRateLimitMiddleware extends RateLimitMiddleware {
  constructor() {
    super(30, 60_000);
  }
}
