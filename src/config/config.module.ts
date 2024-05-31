import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import ENV from "./config.environment";
import { MongooseModule } from "@nestjs/mongoose";
import { MongooseConfigService } from "./config.connectDB";
import { MulterModule } from "@nestjs/platform-express";
import storage from "./config.cloudinary";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => ENV],
      envFilePath: "./src/config/.env",
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    MulterModule.register({
      storage,
    }),
  ],
})
export class AppConfigModule {}
