import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionsFilter, addSwagger } from "./utils";
import { ENV, addCorsOptions } from "src/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  addSwagger(app);
  app.enableCors(addCorsOptions());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(ENV.PORT);
}
bootstrap();
