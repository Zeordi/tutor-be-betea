import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  readonly client = prisma;

  async onModuleInit() {
    await this.client.$connect();
    this.logger.log("Prisma connected to database");
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}