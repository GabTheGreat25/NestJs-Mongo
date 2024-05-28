import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppConfigModule } from "./config/config.module";
import { MongooseConfigService } from "./config/config.connectDB";
import { RoutesModule } from "./routes/routes.module";

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    RoutesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
