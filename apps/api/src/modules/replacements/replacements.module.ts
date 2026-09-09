import { Module } from "@nestjs/common";
import { ReplacementsService } from "./replacements.service";
import { ReplacementsController } from "./replacements.controller";

@Module({
  controllers: [ReplacementsController],
  providers: [ReplacementsService],
  exports: [ReplacementsService],
})
export class ReplacementsModule {}