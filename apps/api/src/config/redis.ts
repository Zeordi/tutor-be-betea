import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function testRedisConnection(): Promise<boolean> {
  try {
    await redis.set("tutor_be_betea_health", "ok", { ex: 10 });
    const result = await redis.get("tutor_be_betea_health");
    console.log("✅ Redis connected:", result);
    return true;
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
    return false;
  }
}