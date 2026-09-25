import { Redis } from "@upstash/redis";
import { StructuredLogger } from "../common/logging/logger.service";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const redisLogger = StructuredLogger.for("redis");

export async function testRedisConnection(): Promise<boolean> {
  try {
    await redis.set("tutor_be_betea_health", "ok", { ex: 10 });
    const result = await redis.get("tutor_be_betea_health");
    redisLogger.info("Redis connected", { result });
    return true;
  } catch (error) {
    redisLogger.error("Redis connection failed", { error: String(error) });
    return false;
  }
}
