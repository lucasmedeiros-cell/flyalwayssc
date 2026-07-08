import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  app.setGlobalPrefix("api");
  // Orígenes permitidos: la lista de WEB_ORIGIN (prod) y, en desarrollo, cualquier
  // IP de la LAN privada (192.168.x, 10.x, 172.16-31.x) para poder abrir la web
  // desde otro equipo/teléfono de la red sin editar el .env cada vez que cambia la IP.
  const allowedOrigins = process.env.WEB_ORIGIN?.split(",") ?? ["http://localhost:3000"];
  const isDev = process.env.NODE_ENV !== "production";
  const lanOrigin = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(:\d+)?$/;
  app.enableCors({
    origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
      // Sin Origin (curl, apps nativas) o en la lista explícita → permitido.
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      // En desarrollo, cualquier origen de la red local.
      if (isDev && lanOrigin.test(origin)) return cb(null, true);
      return cb(new Error(`Origen no permitido por CORS: ${origin}`), false);
    },
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
  // Bind a 0.0.0.0 para que funcione dentro de contenedores (Render, Railway,
  // Fly, Docker). En local sigue siendo accesible por http://localhost:PORT.
  await app.listen(port, "0.0.0.0");
  Logger.log(`Vialta API en http://0.0.0.0:${port}/api (docs en /api/docs)`, "Bootstrap");
}

void bootstrap();
