import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log("Conexión a PostgreSQL establecida.");
    } catch (err) {
      // No bloquear el arranque: el API levanta aunque la DB no esté lista.
      this.logger.warn(
        `No se pudo conectar a la base de datos. El API arranca igual; configura DATABASE_URL. (${(err as Error).message})`
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
