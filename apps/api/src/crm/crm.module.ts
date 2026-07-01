import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { CrmAuthModule } from "../crm-auth/crm-auth.module";
import { CrmService } from "./crm.service";
import { CrmController } from "./crm.controller";

@Module({
  imports: [PrismaModule, CrmAuthModule],
  controllers: [CrmController],
  providers: [CrmService],
})
export class CrmModule {}
