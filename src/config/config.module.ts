import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import ENV from "./config.environment";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => ENV],
      envFilePath: "./src/config/.env",
    }),
  ],
})
export class AppConfigModule {}
