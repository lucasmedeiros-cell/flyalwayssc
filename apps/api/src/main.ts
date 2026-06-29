import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  app.setGlobalPrefix("api");
  app.enableCors({
    origin: process.env.WEB_ORIGIN?.split(",") ?? "http://localhost:3000",
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: false })
  );

  const config = new DocumentBuilder()
    .setTitle("Vialta API")
    .setDescription("API de transporte multimodal — avión, bus, tren y flotas privadas.")
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, doc);

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  Logger.log(`Vialta API en http://localhost:${port}/api (docs en /api/docs)`, "Bootstrap");
}

void bootstrap();
