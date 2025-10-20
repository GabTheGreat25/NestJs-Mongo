import { Module } from "@nestjs/common";
import { V1Module } from "./v1/v1.module";
import { PingController } from "./ping.controller";

@Module({
  imports: [V1Module],
  controllers: [PingController],
})
export class RoutesModule {}
