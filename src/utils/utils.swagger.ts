import { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

export function addSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("Nest API")
    .setDescription("Nest API description")
    .setVersion("1.0")
    .addTag("Nest API")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
}
