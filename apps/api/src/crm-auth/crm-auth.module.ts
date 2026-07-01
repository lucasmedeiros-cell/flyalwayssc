import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../prisma/prisma.module";
import { CrmAuthService } from "./crm-auth.service";
import { CrmAuthController } from "./crm-auth.controller";
import { CrmJwtGuard } from "./crm-jwt.guard";

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [CrmAuthController],
  providers: [CrmAuthService, CrmJwtGuard],
  exports: [CrmAuthService, CrmJwtGuard],
})
export class CrmAuthModule {}
