import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import ENV from "./config/config.environment";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(ENV.PORT);
}
bootstrap();
