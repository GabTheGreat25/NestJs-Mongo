import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { ENV, addCorsOptions } from "src/config";
import { AppModule } from "./app.module";
import { HelmetOptions } from "./config/config.helmet";
import { AllExceptionsFilter, addSwagger } from "./utils";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  addSwagger(app);
  app.enableCors(addCorsOptions());
  app.use(helmet(HelmetOptions));
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(ENV.PORT);
}
bootstrap();
