import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./utils/utils.exceptionsFilter";
import ENV from "./config/config.environment";
import { addSwagger } from "./utils";
import { addCorsOptions } from "./config/config.corsOptions";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  addSwagger(app);
  app.enableCors(addCorsOptions());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(ENV.PORT);
}
bootstrap();
