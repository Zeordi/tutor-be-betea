import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  client = prisma;

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
