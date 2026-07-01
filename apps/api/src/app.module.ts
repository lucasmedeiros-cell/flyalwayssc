import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthModule } from "./health/health.module";
import { CatalogModule } from "./catalog/catalog.module";
import { OperatorsModule } from "./operators/operators.module";
import { TripsModule } from "./trips/trips.module";
import { WebModule } from "./web/web.module";
import { CrmAuthModule } from "./crm-auth/crm-auth.module";
import { CrmModule } from "./crm/crm.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    CatalogModule,
    OperatorsModule,
    TripsModule,
    WebModule,
    // CRM FLYALWAYS — autenticación real (JWT+bcrypt) y endpoints de gestión interna.
    CrmAuthModule,
    CrmModule,
  ],
})
export class AppModule {}
