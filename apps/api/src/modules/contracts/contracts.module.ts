import { Module } from "@nestjs/common";
import { ContractsService } from "./contracts.service";
import { ContractsController } from "./contracts.controller";
import { EscrowModule } from "../escrow/escrow.module";

@Module({
  imports: [EscrowModule],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
