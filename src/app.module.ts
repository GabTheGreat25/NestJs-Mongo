import { Module } from "@nestjs/common";
import { AppConfigModule } from "./config/config.module";
import { RoutesModule } from "./routes/routes.module";
@Module({
  imports: [AppConfigModule, RoutesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
