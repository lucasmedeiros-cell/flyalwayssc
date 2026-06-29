import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthModule } from "./health/health.module";
import { CatalogModule } from "./catalog/catalog.module";
import { OperatorsModule } from "./operators/operators.module";
import { TripsModule } from "./trips/trips.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    CatalogModule,
    OperatorsModule,
    TripsModule,
    // Próximos: AuthModule, BookingsModule, PaymentsModule, AdminModule (ver roadmap).
  ],
})
export class AppModule {}
