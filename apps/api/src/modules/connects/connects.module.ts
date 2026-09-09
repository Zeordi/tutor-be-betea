import { Module } from "@nestjs/common";
import { ConnectsService } from "./connects.service";
import { ConnectsController } from "./connects.controller";

@Module({
  controllers: [ConnectsController],
  providers: [ConnectsService],
  exports: [ConnectsService],
})
export class ConnectsModule {}