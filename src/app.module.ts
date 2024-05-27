import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppConfigModule } from "./config/config.module";
import { MongooseConfigService } from "./config/config.connectDB";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
