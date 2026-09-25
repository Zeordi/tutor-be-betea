import { NestMiddleware, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";
import { redis } from "../../config/redis";

type Bucket = { count: number; resetAt: number };

function getWindowKey(ip: string, method: string, path: string, windowMs: number): string {
  const windowStart = Math.floor(Date.now() / windowMs);
  return `rl:${ip}:${method}:${path}:${windowStart}`;
}

@Injectable()
export class RedisRateLimitMiddleware implements NestMiddleware {
  private readonly memoryBuckets = new Map<string, Bucket>();
  private readonly redisAvailable: boolean;
  private readonly max: number;
  private readonly windowMs: number;

  constructor(max: number, windowMs: number) {
    this.max = max;
    this.windowMs = windowMs;
    this.redisAvailable = !!process.env.UPSTASH_REDIS_REST_URL;
  }

  async use(req: Request, _res: Response, next: NextFunction) {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown";
    const key = `${ip}:${req.method}:${req.path}`;
    const now = Date.now();

    if (this.redisAvailable) {
      const windowKey = getWindowKey(ip, req.method, req.path, this.windowMs);
      try {
        const count = await redis.incr(windowKey);
        if (count === 1) {
          await redis.expire(windowKey, Math.ceil(this.windowMs / 1000));
        }
        if (count > this.max) {
          const retryAfter = Math.max(1, Math.ceil((this.windowMs - (now % this.windowMs)) / 1000));
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
        return;
      } catch {
        // Redis failed, fall back to memory
      }
    }

    let b = this.memoryBuckets.get(key);
    if (!b || now > b.resetAt) {
      b = { count: 0, resetAt: now + this.windowMs };
      this.memoryBuckets.set(key, b);
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
export class AuthRateLimitMiddleware extends RedisRateLimitMiddleware {
  constructor() {
    const max = parseInt(process.env.RATE_LIMIT_AUTH_MAX || "5", 10);
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);
    super(max, windowMs);
  }
}

@Injectable()
export class PaymentRateLimitMiddleware extends RedisRateLimitMiddleware {
  constructor() {
    const max = parseInt(process.env.RATE_LIMIT_PAYMENT_MAX || "10", 10);
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);
    super(max, windowMs);
  }
}

@Injectable()
export class GeneralRateLimitMiddleware extends RedisRateLimitMiddleware {
  constructor() {
    const max = parseInt(process.env.RATE_LIMIT_GENERAL_MAX || "30", 10);
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);
    super(max, windowMs);
  }
}
