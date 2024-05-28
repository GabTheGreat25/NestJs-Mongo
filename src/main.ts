import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./utils/utils.exceptionsFilter";
import ENV from "./config/config.environment";
import { addSwagger } from "./utils";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  addSwagger(app);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(ENV.PORT);
}
bootstrap();
