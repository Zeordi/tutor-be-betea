import { Module } from "@nestjs/common";
import { StructuredLogger } from "./logger.service";

@Module({
  providers: [StructuredLogger],
  exports: [StructuredLogger],
})
export class LoggerModule {}
