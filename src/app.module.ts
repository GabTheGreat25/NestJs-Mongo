import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppConfigModule } from "./config/config.module";
import { MongooseConfigService } from "./config/config.connectDB";

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
