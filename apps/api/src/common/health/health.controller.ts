import { Controller, Get } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { getVaultKey } from "@tutor/encryption";

export type HealthStatus = "ok" | "degraded";

export interface HealthCheckResponse {
  status: HealthStatus;
  checks: {
    database: "ok" | "error";
    redis: "ok" | "error" | "skipped";
    vault: "ok" | "error";
    timestamp: string;
  };
}

@Controller("health")
export class HealthController {
  @Get()
  async check(): Promise<HealthCheckResponse> {
    const timestamp = new Date().toISOString();
    const checks: HealthCheckResponse["checks"] = {
      database: "error",
      redis: "skipped",
      vault: "error",
      timestamp,
    };

    let degraded = false;

    const dbOk = await this.checkDatabase();
    checks.database = dbOk ? "ok" : "error";
    if (!dbOk) degraded = true;

    const redisOk = await this.checkRedis();
    checks.redis = redisOk ? "ok" : "error";
    if (!redisOk && process.env.UPSTASH_REDIS_REST_URL) degraded = true;

    const vaultOk = this.checkVault();
    checks.vault = vaultOk ? "ok" : "error";
    if (!vaultOk) degraded = true;

    return {
      status: degraded ? "degraded" : "ok",
      checks,
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  private async checkRedis(): Promise<boolean> {
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      return true;
    }

    try {
      const { Redis } = await import("@upstash/redis");
      const client = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
      });
      await client.set("tutor_be_betea_health", "ok", { ex: 10 });
      const result = await client.get("tutor_be_betea_health");
      return result === "ok";
    } catch {
      return false;
    }
  }

  private checkVault(): boolean {
    try {
      getVaultKey();
      return true;
    } catch {
      return false;
    }
  }
}
