import { Module } from "@nestjs/common";
import { CatalogModule } from "../catalog/catalog.module";
import { OperatorsModule } from "../operators/operators.module";
import { WebController } from "./web.controller";
import { WebService } from "./web.service";

@Module({
  imports: [CatalogModule, OperatorsModule],
  controllers: [WebController],
  providers: [WebService],
})
export class WebModule {}
